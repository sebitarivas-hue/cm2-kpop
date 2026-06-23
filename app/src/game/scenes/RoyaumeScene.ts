import Phaser from 'phaser';
import { bus, EVENTS } from '../../services/eventBus';
import { tirerItem } from '../../content/pool';
import type { ContentItem } from '../../content/schema';
import { useGame } from '../../state/store';
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
    const h = this.scale.height;
    this.physics.world.setBounds(0, 0, this.largeurMonde, h);
    this.cameras.main.setBounds(0, 0, this.largeurMonde, h);

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

  // --- Décor -----------------------------------------------------------------
  private dessinerDecor() {
    const w = this.largeurMonde;
    const h = this.scale.height;
    const [c1, c2, c3, c4] = this.cfg.ciel;
    const bg = this.add.graphics();
    bg.fillGradientStyle(c1, c2, c3, c4, 1);
    bg.fillRect(0, 0, w, h);
    bg.setScrollFactor(0.2);

    const sol = this.add.graphics();
    sol.fillStyle(0x0f0c24, 1);
    sol.fillRect(0, h - 90, w, 90);
    sol.lineStyle(3, this.cfg.accent, 0.6);
    sol.lineBetween(0, h - 90, w, h - 90);

    for (let i = 0; i < 26; i++) {
      const x = Phaser.Math.Between(0, w);
      const taille = Phaser.Math.Between(20, 70);
      const c = this.add.graphics();
      c.fillStyle(this.cfg.accent, Phaser.Math.FloatBetween(0.12, 0.35));
      c.fillTriangle(x, h - 90, x - taille * 0.4, h - 90 - taille, x + taille * 0.4, h - 90 - taille * 0.7);
      c.setScrollFactor(Phaser.Math.FloatBetween(0.4, 0.8));
    }

    for (let i = 0; i < 60; i++) {
      const s = this.add.circle(
        Phaser.Math.Between(0, w),
        Phaser.Math.Between(0, h - 120),
        Phaser.Math.Between(1, 2),
        0xffffff,
        Phaser.Math.FloatBetween(0.2, 0.7),
      );
      s.setScrollFactor(Phaser.Math.FloatBetween(0.3, 0.9));
      this.tweens.add({ targets: s, alpha: 0.1, duration: Phaser.Math.Between(900, 2200), yoyo: true, repeat: -1 });
    }
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
    const h = this.scale.height;
    const av = useGame.getState().avatar;
    const tenue = hexToNum(av.tenue, this.cfg.joueur);
    const peau = hexToNum(av.peau, 0xfff4d6);
    const cheveux = hexToNum(av.cheveux, 0x3a2a1a);
    this.player = this.add.container(120, h - 150);
    const corps = this.add.graphics();
    corps.fillStyle(tenue, 1);
    corps.fillRoundedRect(-12, -18, 24, 40, 8);
    corps.fillStyle(peau, 1);
    corps.fillCircle(0, -28, 11);
    corps.fillStyle(cheveux, 1); // mèche de cheveux
    corps.fillEllipse(0, -36, 24, 12);
    this.player.add(corps);
    const aura = this.add.circle(0, -4, 30, tenue, 0.18);
    this.player.add(aura);
    this.tweens.add({ targets: aura, scale: 1.25, alpha: 0.06, duration: 1200, yoyo: true, repeat: -1 });

    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(28, 48);
    body.setOffset(-14, -30);
    body.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  // --- Boucle ----------------------------------------------------------------
  update() {
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
