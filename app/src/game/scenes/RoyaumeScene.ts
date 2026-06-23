import Phaser from 'phaser';
import { bus, EVENTS } from '../../services/eventBus';
import { tirerItem } from '../../content/pool';
import type { ContentItem } from '../../content/schema';
import { useGame } from '../../state/store';
import { avatarSvgDoc } from '../../ui/avatarArt';
import type { RoyaumeConfig } from '../royaumes';

/** Convertit "#rrggbb" en nombre Phaser ; repli si invalide. */
function hexToNum(hex: string, fallback: number): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  return m ? parseInt(m[1], 16) : fallback;
}

/**
 * RoyaumeScene — moteur GÉNÉRIQUE d'un royaume, piloté par RoyaumeConfig.
 *
 * Boucle cœur (identique pour les 7 royaumes, réskinnée par la config) :
 *   explorer -> atteindre un "objet" brisé -> "lancer un sort" (épreuve taguée)
 *   -> l'objet se reforme -> progresser -> atteindre le Sage -> rallumer le Phare.
 */
interface Cible {
  gfx: Phaser.GameObjects.Graphics;
  x: number;
  item: ContentItem;
  reforme: boolean;
}

export class RoyaumeScene extends Phaser.Scene {
  private cfg!: RoyaumeConfig;
  private player!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private vitesse = 220;
  private destination: Phaser.Math.Vector2 | null = null;
  private cibles: Cible[] = [];
  private cibleActive: Cible | null = null;
  private cooldown = 0;
  private sage!: Phaser.GameObjects.Container;
  private phareAllume = false;
  private exclus = new Set<string>();
  private largeurMonde = 2400;

  constructor() {
    super('royaume');
  }

  init(data: { config: RoyaumeConfig }) {
    this.cfg = data.config;
    // reset (la scène est réutilisée d'un royaume à l'autre)
    this.cibles = [];
    this.cibleActive = null;
    this.cooldown = 0;
    this.phareAllume = false;
    this.exclus = new Set();
    this.destination = null;
  }

  create() {
    const h = this.hauteur();
    this.physics.world.setBounds(0, 0, this.largeurMonde, h);
    this.cameras.main.setBounds(0, 0, this.largeurMonde, h);
    this.cameras.main.setBackgroundColor(this.cfg.ciel[0]);

    this.dessinerDecor();
    this.creerCibles();
    this.creerSage();
    this.creerPlayer();

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.destination = new Phaser.Math.Vector2(p.worldX, p.worldY);
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (p.isDown) this.destination = new Phaser.Math.Vector2(p.worldX, p.worldY);
    });

    bus.on(EVENTS.CHALLENGE_RESOLVED, this.onResolved);

    bus.emit(EVENTS.NARRATE, { qui: this.cfg.sage, texte: this.cfg.intro });
  }

  /** Hauteur robuste (évite un canvas à 0 px au démarrage). */
  private hauteur(): number {
    return this.scale.height || this.cameras.main?.height || window.innerHeight || 720;
  }

  private onResolved = (payload: unknown) => {
    const { success } = payload as { id: string; success: boolean };
    if (success && this.cibleActive) {
      this.reformer(this.cibleActive);
    } else {
      this.player.x = Math.max(80, this.player.x - 120);
      this.cooldown = this.time.now + 900;
    }
    this.cibleActive = null;
  };

  shutdown() {
    bus.off(EVENTS.CHALLENGE_RESOLVED, this.onResolved);
  }

  // --- Décor atmosphérique (esprit "Journey") --------------------------------
  private dessinerDecor() {
    const w = this.largeurMonde;
    const h = this.hauteur();
    const [c1, c2, c3, c4] = this.cfg.ciel;

    // Base TOUJOURS dessinée (simple, ne peut pas échouer) : ciel + sol.
    const bg = this.add.graphics().setScrollFactor(0).setDepth(-50);
    bg.fillGradientStyle(c1, c2, c3, c4, 1);
    bg.fillRect(0, 0, w, h);
    const solBase = this.add.graphics().setDepth(-40);
    solBase.fillStyle(0x0f0c24, 1);
    solBase.fillRect(0, h - 90, w, 90);
    solBase.lineStyle(3, this.cfg.accent, 0.55);
    solBase.lineBetween(0, h - 90, w, h - 90);

    // Effets avancés ISOLÉS : si une API échoue, le royaume reste jouable.
    try {
      this.decorAtmospherique(w, h, c4);
    } catch (e) {
      console.warn('[Luméria] effets de décor désactivés:', e);
    }
  }

  private decorAtmospherique(w: number, h: number, c4: number) {
    // Astre lumineux + halos additifs.
    const orb = this.add.container(w * 0.3, h * 0.3).setScrollFactor(0.12).setDepth(-48);
    [
      { r: 130, a: 0.05 },
      { r: 84, a: 0.08 },
      { r: 48, a: 0.13 },
    ].forEach((o) => orb.add(this.add.circle(0, 0, o.r, 0xffe9c4, o.a).setBlendMode(Phaser.BlendModes.ADD)));
    const core = this.add.circle(0, 0, 30, 0xfff3d6, 0.95).setBlendMode(Phaser.BlendModes.ADD);
    orb.add(core);
    this.tweens.add({ targets: core, scale: 1.1, alpha: 0.78, duration: 3200, yoyo: true, repeat: -1 });

    // Poussières d'étoiles lointaines qui scintillent.
    for (let i = 0; i < 70; i++) {
      const s = this.add
        .circle(Phaser.Math.Between(0, w), Phaser.Math.Between(0, h * 0.6), Phaser.Math.FloatBetween(0.6, 1.8), 0xffffff, Phaser.Math.FloatBetween(0.2, 0.7))
        .setScrollFactor(Phaser.Math.FloatBetween(0.1, 0.25))
        .setDepth(-47);
      this.tweens.add({ targets: s, alpha: 0.05, duration: Phaser.Math.Between(1400, 3200), yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 2000) });
    }

    // Dunes en parallaxe : de la brume lointaine au relief proche.
    this.duneLayer(h * 0.52, 26, c4, 0.45, 0.25, 0.0016, 1.3).setDepth(-46);
    this.duneLayer(h * 0.64, 34, this.cfg.accent, 0.4, 0.38, 0.0022, 3.1).setDepth(-45);
    this.duneLayer(h * 0.74, 30, 0x1a1430, 0.65, 0.52, 0.003, 5.7).setDepth(-44);

    // Brume basse au-dessus du sol.
    const haze = this.add.graphics().setScrollFactor(0.5).setDepth(-41);
    haze.fillStyle(c4, 0.1);
    haze.fillRect(0, h - 150, w, 70);

    // Sol jouable + horizon qui luit (sable de Journey).
    const sol = this.add.graphics().setDepth(-40);
    sol.fillGradientStyle(0x171033, 0x171033, 0x0c0820, 0x0c0820, 1);
    sol.fillRect(0, h - 90, w, 90);
    const glowLine = this.add.rectangle(w / 2, h - 90, w, 18, this.cfg.accent, 0.14).setBlendMode(Phaser.BlendModes.ADD).setDepth(-39);
    this.tweens.add({ targets: glowLine, alpha: 0.05, duration: 2600, yoyo: true, repeat: -1 });

    // Poussières de lumière flottantes (signature "Journey").
    this.creerMoteTexture();
    this.add
      .particles(0, 0, 'mote', {
        x: { min: 0, max: w },
        y: { min: h * 0.2, max: h - 30 },
        lifespan: { min: 4000, max: 9000 },
        speedY: { min: -16, max: -3 },
        speedX: { min: -8, max: 8 },
        scale: { start: 0.7, end: 0 },
        alpha: { start: 0.5, end: 0 },
        frequency: 150,
        blendMode: 'ADD',
        tint: this.cfg.joueur,
      })
      .setScrollFactor(0.7)
      .setDepth(-30);

    // Bloom + vignette (WebGL uniquement ; ignoré sinon).
    try {
      // postFX n'est disponible qu'en WebGL ; type non exposé selon les versions.
      const fx = (this.cameras.main as unknown as { postFX?: { addBloom: (...a: number[]) => void; addVignette: (...a: number[]) => void } }).postFX;
      fx?.addBloom(0xffffff, 1, 1, 1, 1.15);
      fx?.addVignette(0.5, 0.5, 0.78, 0.45);
    } catch {
      /* rendu Canvas : pas de post-FX, l'ambiance reste correcte */
    }
  }

  /** Une couche de collines lisses (sinus) avec parallaxe. */
  private duneLayer(yBase: number, amp: number, color: number, alpha: number, scroll: number, freq: number, seed: number) {
    const w = this.largeurMonde;
    const h = this.scale.height;
    const g = this.add.graphics();
    g.fillStyle(color, alpha);
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= w; x += 110) g.lineTo(x, yBase + Math.sin(x * freq + seed) * amp);
    g.lineTo(w, h);
    g.closePath();
    g.fillPath();
    g.setScrollFactor(scroll);
    return g;
  }

  /** Texture douce (dégradé radial simulé) pour les poussières de lumière. */
  private creerMoteTexture() {
    if (this.textures.exists('mote')) return;
    const g = this.make.graphics({ x: 0, y: 0 });
    for (let r = 8; r >= 1; r--) {
      g.fillStyle(0xffffff, 0.05);
      g.fillCircle(8, 8, r);
    }
    g.generateTexture('mote', 16, 16);
    g.destroy();
  }

  private creerCibles() {
    const h = this.scale.height;
    const niveau = useGame.getState().niveau;
    [600, 1180, 1760].forEach((x, i) => {
      const item = tirerItem(this.cfg.pool, Math.min(5, niveau + i), this.exclus);
      this.exclus.add(item.id);
      const gfx = this.add.graphics();
      this.dessinerCibleBrisee(gfx, x, h - 90);
      this.cibles.push({ gfx, x, item, reforme: false });
    });
  }

  private dessinerCibleBrisee(gfx: Phaser.GameObjects.Graphics, x: number, y: number) {
    gfx.clear();
    gfx.fillStyle(0x2c2152, 1);
    gfx.fillRect(x - 70, y - 70, 26, 70);
    gfx.fillRect(x + 44, y - 70, 26, 70);
    gfx.lineStyle(2, this.cfg.accent, 0.5);
    gfx.strokeRect(x - 70, y - 70, 26, 70);
    gfx.strokeRect(x + 44, y - 70, 26, 70);
    const glow = this.add.circle(x, y - 110, 12, 0xff6b9d, 0.9);
    this.tweens.add({ targets: glow, scale: 1.5, alpha: 0.3, duration: 800, yoyo: true, repeat: -1 });
  }

  private reformer(c: Cible) {
    c.reforme = true;
    const h = this.scale.height;
    c.gfx.fillStyle(0x7cf0ff, 0.9);
    c.gfx.fillRoundedRect(c.x - 70, h - 162, 140, 16, 6);
    this.tweens.add({ targets: c.gfx, alpha: { from: 0.4, to: 1 }, duration: 400, yoyo: true, repeat: 1 });

    const store = useGame.getState();
    store.gagnerXP(25);
    store.enregistrerReussite(c.item.id, c.item.competence);
    this.flotter(c.x, h - 200, `+25 XP  ${this.cfg.emoji} ${this.cfg.objet} réparé`);

    if (this.cibles.every((x) => x.reforme)) {
      bus.emit(EVENTS.NARRATE, { qui: this.cfg.sage, texte: this.cfg.tout });
    }
  }

  private creerSage() {
    const h = this.scale.height;
    const x = this.largeurMonde - 180;
    this.sage = this.add.container(x, h - 150);
    const robe = this.add.graphics();
    robe.fillStyle(0xffd36b, 1);
    robe.fillTriangle(-26, 60, 26, 60, 0, -30);
    robe.fillStyle(0xffe9b0, 1);
    robe.fillCircle(0, -42, 16);
    this.sage.add(robe);
    const aura = this.add.circle(0, 0, 70, 0xffd36b, 0.12);
    this.sage.add(aura);
    this.tweens.add({ targets: aura, scale: 1.3, alpha: 0.04, duration: 1600, yoyo: true, repeat: -1 });

    const phare = this.add.graphics();
    phare.fillStyle(0x1c1542, 1);
    phare.fillRect(x + 70, h - 250, 40, 160);
    phare.fillStyle(0x2c2152, 1);
    phare.fillRect(x + 64, h - 270, 52, 24);
    this.sage.setData('phareX', x + 90);
    this.sage.setData('phareY', h - 270);
  }

  private creerPlayer() {
    const h = this.hauteur();
    const av = useGame.getState().avatar;
    const tenue = hexToNum(av.tenue, this.cfg.joueur);
    this.player = this.add.container(120, h - 150);

    // Personnage de base TOUJOURS visible (fallback si la texture avatar échoue).
    const halo = this.add.circle(0, -8, 32, tenue, 0.16);
    const corps = this.add.graphics();
    corps.fillStyle(tenue, 1);
    corps.fillRoundedRect(-13, -20, 26, 42, 9);
    corps.fillStyle(hexToNum(av.peau, 0xffe0c4), 1);
    corps.fillCircle(0, -30, 12);
    corps.fillStyle(hexToNum(av.cheveux, 0x2a1a3a), 1);
    corps.fillEllipse(0, -38, 26, 12);
    this.player.add([halo, corps]);
    this.tweens.add({ targets: halo, scale: 1.25, alpha: 0.05, duration: 1200, yoyo: true, repeat: -1 });

    // Physique + caméra (cœur — doit toujours s'exécuter).
    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(30, 70);
    body.setOffset(-15, -50);
    body.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Avatar illustré (texture SVG) + traînée lumineuse — décoratif, isolé.
    try {
      this.parerAvatar(av, tenue, corps);
    } catch (e) {
      console.warn('[Luméria] avatar illustré indisponible, rendu simplifié:', e);
    }
  }

  /** Rasterise l'illustration SVG de l'avatar en texture et l'applique au héros. */
  private parerAvatar(av: ReturnType<typeof useGame.getState>['avatar'], tenue: number, corps: Phaser.GameObjects.Graphics) {
    this.creerMoteTexture();
    const key = `avatar_${Date.now()}`;
    const uri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(avatarSvgDoc(av, 220));
    this.load.svg(key, uri, { width: 132, height: 165 });
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      if (!this.textures.exists(key) || !this.player?.active) return;
      const sprite = this.add.image(0, -20, key).setOrigin(0.5, 0.78).setScale(0.62);
      this.player.add(sprite);
      corps.setVisible(false); // on masque le fallback une fois l'illustration prête
    });
    this.load.start();

    this.add
      .particles(0, 0, 'mote', {
        follow: this.player,
        followOffset: { x: 0, y: -8 },
        lifespan: 700,
        speedX: { min: -12, max: 12 },
        speedY: { min: -6, max: 14 },
        scale: { start: 0.5, end: 0 },
        alpha: { start: 0.4, end: 0 },
        frequency: 130,
        blendMode: 'ADD',
        tint: tenue,
      })
      .setDepth(-5);
  }

  // --- Boucle ----------------------------------------------------------------
  update() {
    if (!this.player?.body || !this.cursors) return; // sécurité tant que create() n'a pas fini
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    let vx = 0;
    let vy = 0;
    if (this.cursors.left.isDown) vx = -this.vitesse;
    else if (this.cursors.right.isDown) vx = this.vitesse;
    if (this.cursors.up.isDown) vy = -this.vitesse;
    else if (this.cursors.down.isDown) vy = this.vitesse;

    if (vx === 0 && vy === 0 && this.destination) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.destination.x, this.destination.y);
      if (d > 8) {
        const a = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.destination.x, this.destination.y);
        vx = Math.cos(a) * this.vitesse;
        vy = Math.sin(a) * this.vitesse;
      } else this.destination = null;
    }
    body.setVelocity(vx, vy);

    if (!this.cibleActive && this.time.now > this.cooldown) {
      for (const c of this.cibles) {
        if (c.reforme) continue;
        if (Math.abs(this.player.x - c.x) < 70) {
          this.cibleActive = c;
          this.destination = null;
          body.setVelocity(0, 0);
          bus.emit(EVENTS.CHALLENGE_OPEN, { item: c.item });
          break;
        }
      }
    }

    if (!this.phareAllume && this.cibles.every((c) => c.reforme)) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.sage.x, this.sage.y);
      if (d < 90) this.allumerPhare();
    }
  }

  private allumerPhare() {
    this.phareAllume = true;
    const x = this.sage.getData('phareX') as number;
    const y = this.sage.getData('phareY') as number;
    const faisceau = this.add.circle(x, y, 20, 0xffe9b0, 0.95);
    this.tweens.add({ targets: faisceau, scale: 6, alpha: 0, duration: 1400, repeat: 2 });
    this.cameras.main.flash(600, 255, 233, 176);
    useGame.getState().allumerPhare(this.cfg.id);
    useGame.getState().gagnerXP(60);
    bus.emit(EVENTS.PHARE_LIT, { royaume: this.cfg.id, nom: this.cfg.nom });
  }

  private flotter(x: number, y: number, txt: string) {
    const t = this.add
      .text(x, y, txt, { fontFamily: 'system-ui', fontSize: '18px', color: '#ffe9b0', fontStyle: 'bold' })
      .setOrigin(0.5);
    this.tweens.add({ targets: t, y: y - 50, alpha: 0, duration: 1200, onComplete: () => t.destroy() });
  }
}
