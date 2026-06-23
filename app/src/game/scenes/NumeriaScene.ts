import Phaser from 'phaser';
import { bus, EVENTS } from '../../services/eventBus';
import { NUMERIA, tirerItem } from '../../content/numeria';
import type { ContentItem } from '../../content/schema';
import { useGame } from '../../state/store';

/**
 * NUMÉRIA — vertical slice jouable.
 *
 * Boucle cœur :
 *   explorer -> atteindre un Pont de Lumière brisé -> "lancer un sort"
 *   (résoudre une épreuve de Cristomancie) -> le pont se reforme ->
 *   progresser -> atteindre le Sage -> rallumer le Phare.
 *
 * Le rendu est procédural (aucun asset externe) : le scaffold tourne partout.
 */

interface Pont {
  zone: Phaser.GameObjects.Zone;
  gfx: Phaser.GameObjects.Graphics;
  x: number;
  item: ContentItem;
  reforme: boolean;
}

export class NumeriaScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private vitesse = 220;
  private cible: Phaser.Math.Vector2 | null = null;
  private ponts: Pont[] = [];
  private pontActif: Pont | null = null;
  private pontCooldown = 0; // évite la réouverture immédiate après un "Reculer"
  private sage!: Phaser.GameObjects.Container;
  private phareAllume = false;
  private exclus = new Set<string>();
  private largeurMonde = 2400;

  constructor() {
    super('numeria');
  }

  create() {
    const h = this.scale.height;
    this.physics.world.setBounds(0, 0, this.largeurMonde, h);
    this.cameras.main.setBounds(0, 0, this.largeurMonde, h);

    this.dessinerDecor();
    this.creerPonts();
    this.creerSage();
    this.creerPlayer();

    this.cursors = this.input.keyboard!.createCursorKeys();

    // Déplacement tactile / souris : on va vers le point cliqué/touché.
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.cible = new Phaser.Math.Vector2(p.worldX, p.worldY);
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (p.isDown) this.cible = new Phaser.Math.Vector2(p.worldX, p.worldY);
    });

    // Quand React renvoie le résultat d'une épreuve.
    bus.on(EVENTS.CHALLENGE_RESOLVED, (payload) => {
      const { success } = payload as { id: string; success: boolean };
      if (success && this.pontActif) {
        this.reformerPont(this.pontActif);
      } else {
        // Échec / recul : on repousse l'Éveilleur et on temporise.
        this.player.x = Math.max(80, this.player.x - 120);
        this.pontCooldown = this.time.now + 900;
      }
      this.pontActif = null;
    });

    bus.emit(EVENTS.NARRATE, {
      qui: 'Sage Numéa',
      texte:
        "Éveilleur... la Grisaille a brisé mes Ponts de Lumière. Reforme-les par la Cristomancie, et rallume mon Phare.",
    });
  }

  // --- Construction du monde -------------------------------------------------

  private dessinerDecor() {
    const w = this.largeurMonde;
    const h = this.scale.height;
    const bg = this.add.graphics();
    // Ciel dégradé (cristal/aube).
    bg.fillGradientStyle(0x1a1140, 0x2a1a5e, 0x4326a6, 0x6d3bd6, 1);
    bg.fillRect(0, 0, w, h);
    bg.setScrollFactor(0.2);

    // Sol.
    const sol = this.add.graphics();
    sol.fillStyle(0x120e2e, 1);
    sol.fillRect(0, h - 90, w, 90);
    sol.lineStyle(3, 0x7c5cff, 0.6);
    sol.lineBetween(0, h - 90, w, h - 90);

    // Cristaux décoratifs en arrière-plan.
    for (let i = 0; i < 26; i++) {
      const x = Phaser.Math.Between(0, w);
      const taille = Phaser.Math.Between(20, 70);
      const c = this.add.graphics();
      c.fillStyle(0x9d7bff, Phaser.Math.FloatBetween(0.12, 0.35));
      c.fillTriangle(x, h - 90, x - taille * 0.4, h - 90 - taille, x + taille * 0.4, h - 90 - taille * 0.7);
      c.setScrollFactor(Phaser.Math.FloatBetween(0.4, 0.8));
    }

    // Étoiles/particules de savoir.
    for (let i = 0; i < 60; i++) {
      const s = this.add.circle(
        Phaser.Math.Between(0, w),
        Phaser.Math.Between(0, h - 120),
        Phaser.Math.Between(1, 2),
        0xffffff,
        Phaser.Math.FloatBetween(0.2, 0.7),
      );
      s.setScrollFactor(Phaser.Math.FloatBetween(0.3, 0.9));
      this.tweens.add({
        targets: s,
        alpha: 0.1,
        duration: Phaser.Math.Between(900, 2200),
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private creerPonts() {
    const h = this.scale.height;
    const niveau = useGame.getState().niveau;
    const positions = [600, 1180, 1760];
    positions.forEach((x, i) => {
      const item = tirerItem(NUMERIA, Math.min(5, niveau + i), this.exclus);
      this.exclus.add(item.id);

      const gfx = this.add.graphics();
      this.dessinerPontBrise(gfx, x, h - 90);

      const zone = this.add.zone(x, h - 150, 120, 160);
      this.physics.add.existing(zone, true);

      this.ponts.push({ zone, gfx, x, item, reforme: false });
    });
  }

  private dessinerPontBrise(gfx: Phaser.GameObjects.Graphics, x: number, y: number) {
    gfx.clear();
    // Deux piliers, vide au milieu (pont rompu).
    gfx.fillStyle(0x3a2c6b, 1);
    gfx.fillRect(x - 70, y - 70, 26, 70);
    gfx.fillRect(x + 44, y - 70, 26, 70);
    gfx.lineStyle(2, 0x6b4ee0, 0.5);
    gfx.strokeRect(x - 70, y - 70, 26, 70);
    gfx.strokeRect(x + 44, y - 70, 26, 70);
    // Marqueur "à réparer".
    const glow = this.add.circle(x, y - 110, 12, 0xff6b9d, 0.9);
    this.tweens.add({ targets: glow, scale: 1.5, alpha: 0.3, duration: 800, yoyo: true, repeat: -1 });
    glow.setData('pontX', x);
  }

  private reformerPont(p: Pont) {
    p.reforme = true;
    const h = this.scale.height;
    // Le tablier de lumière apparaît.
    p.gfx.fillStyle(0x7cf0ff, 0.9);
    p.gfx.fillRoundedRect(p.x - 70, h - 162, 140, 16, 6);
    this.tweens.add({
      targets: p.gfx,
      alpha: { from: 0.4, to: 1 },
      duration: 400,
      yoyo: true,
      repeat: 1,
    });
    // Récompense.
    const store = useGame.getState();
    store.gagnerXP(25);
    store.enregistrerReussite(p.item.id, p.item.competence);
    this.flotterTexte(p.x, h - 200, '+25 XP  ✦ Pont reformé');

    // Tous les ponts reformés ? Le Sage signale le Phare.
    if (this.ponts.every((x) => x.reforme)) {
      bus.emit(EVENTS.NARRATE, {
        qui: 'Sage Numéa',
        texte: 'Tous les ponts brillent ! Viens jusqu’à moi rallumer le Phare de Numéria.',
      });
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

    // Phare derrière le Sage.
    const phare = this.add.graphics();
    phare.fillStyle(0x241a52, 1);
    phare.fillRect(x + 70, h - 250, 40, 160);
    phare.fillStyle(0x3a2c6b, 1);
    phare.fillRect(x + 64, h - 270, 52, 24);
    this.add.existing(phare);
    this.sage.setData('phareX', x + 90);
    this.sage.setData('phareY', h - 270);
  }

  private creerPlayer() {
    const h = this.scale.height;
    this.player = this.add.container(120, h - 150);
    const corps = this.add.graphics();
    corps.fillStyle(0x18d3ff, 1);
    corps.fillRoundedRect(-12, -18, 24, 40, 8);
    corps.fillStyle(0xfff4d6, 1);
    corps.fillCircle(0, -28, 11);
    this.player.add(corps);
    const aura = this.add.circle(0, -4, 30, 0x18d3ff, 0.18);
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

    if (vx === 0 && vy === 0 && this.cible) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.cible.x, this.cible.y);
      if (d > 8) {
        const a = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.cible.x, this.cible.y);
        vx = Math.cos(a) * this.vitesse;
        vy = Math.sin(a) * this.vitesse;
      } else {
        this.cible = null;
      }
    }
    body.setVelocity(vx, vy);

    // Proximité d'un pont non reformé -> ouvrir l'épreuve.
    if (!this.pontActif && this.time.now > this.pontCooldown) {
      for (const p of this.ponts) {
        if (p.reforme) continue;
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, p.x, this.player.y);
        if (Math.abs(this.player.x - p.x) < 70 && d < 90) {
          this.pontActif = p;
          this.cible = null;
          body.setVelocity(0, 0);
          bus.emit(EVENTS.CHALLENGE_OPEN, { item: p.item });
          break;
        }
      }
    }

    // Atteindre le Sage quand tout est reformé -> rallumer le Phare.
    if (!this.phareAllume && this.ponts.every((p) => p.reforme)) {
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
    useGame.getState().allumerPhare('numeria');
    useGame.getState().gagnerXP(60);
    bus.emit(EVENTS.PHARE_LIT, { royaume: 'numeria' });
  }

  private flotterTexte(x: number, y: number, txt: string) {
    const t = this.add
      .text(x, y, txt, { fontFamily: 'system-ui', fontSize: '18px', color: '#ffe9b0', fontStyle: 'bold' })
      .setOrigin(0.5);
    this.tweens.add({ targets: t, y: y - 50, alpha: 0, duration: 1200, onComplete: () => t.destroy() });
  }
}
