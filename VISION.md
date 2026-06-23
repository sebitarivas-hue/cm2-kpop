# LUMÉRIA — Refonte conceptuelle
### D'une app de quiz K-pop vers un jeu web éducatif d'aventure (CM1–CM2)

> Document fondateur — vision produit, game design, pédagogie, modèle économique, architecture & roadmap.
> Statut : proposition stratégique. Titre « Luméria » = nom de travail (à valider juridiquement avant dépôt de marque).

---

## 0. Diagnostic sans complaisance

L'existant (`index.html`, 3521 lignes, monolithe vanilla) est **une application de quiz à thème K-pop**, pas un univers de jeu. Ses limites structurelles :

- **Pas de boucle de jeu.** On répond à des cartes ; on n'« explore » pas, on ne « vit » rien. La rétention repose sur une quête quotidienne et des trophées — insuffisant pour fidéliser un enfant de 8–12 ans face à Roblox/YouTube.
- **Thème inadapté.** « Idol K-pop » est un univers de licence flou, mal aligné avec une cible primaire et avec une vente aux écoles/collectivités.
- **Architecture non industrialisable.** Un fichier de 281 Ko, zéro test, zéro séparation contenu/code, sauvegarde locale uniquement (pas de cross-device, pas de vue parent/enseignant). Impossible d'y faire travailler une équipe ou d'y verser des milliers d'items.
- **Aucun socle de monétisation.** Pas de comptes, pas de paiement, pas de tableau de bord — donc aucun des 7 leviers de revenu visés n'est atteignable.

**Conclusion : on repart du concept et de l'architecture. On conserve les actifs pédagogiques et la direction artistique, on jette le reste.**

---

## 1. L'univers — LUMÉRIA

### Le pitch (1 phrase)
*Dans un monde dont la lumière s'éteint quand on cesse d'apprendre, tu es un Éveilleur capable de rallumer les Phares du Savoir — et chaque connaissance que tu maîtrises devient un pouvoir.*

### La fiction
**Luméria** était un monde lumineux où le savoir circulait librement. Une brume, **la Grisaille (l'Oubli)**, a commencé à effacer les couleurs, les mots, les nombres et les souvenirs. Sept **Phares du Savoir** se sont éteints, et avec eux l'équilibre du monde. Le joueur incarne un **Éveilleur** : un enfant rare qui peut canaliser *tous* les Savoirs (le parallèle « Avatar » : un passeur entre les disciplines, là où chacun n'en maîtrise qu'une). Sa quête initiatique : voyager de royaume en royaume, être formé par les **Sages-Gardiens**, rallumer les Phares et repousser la Grisaille.

C'est l'esprit d'*Avatar* (maîtrise progressive, mentors, équilibre, voyage initiatique, cultures différentes) **sans la licence** : nos « éléments » sont des **disciplines du savoir**, et la maîtrise se gagne en apprenant pour de vrai.

### Les 7 Royaumes (1 royaume = 1 domaine = 1 pouvoir)

| Royaume | Domaine | Pouvoir (Arcane) | Identité visuelle |
|---|---|---|---|
| **Numéria** | Mathématiques | **Cristomancie** — fractionner, mesurer, bâtir avec les cristaux-nombres | Cristaux, géométrie sacrée, ponts de lumière |
| **Verba** | Français | **Runomancie** — déchiffrer et réparer les runes (mots, accords, conjugaison) | Bibliothèque-forêt, runes gravées, encre vivante |
| **Vivaria** | Sciences | **Biomancie** — faire pousser, classer, expérimenter le vivant et la matière | Serres, volcans, laboratoires alchimiques |
| **Chronos** | Histoire | **Chronomancie** — voyager dans le temps, remettre les époques dans l'ordre | Sabliers géants, ruines superposées des époques |
| **Terra** | Géographie | **Cartomancie** — naviguer, lire les cartes, relier les territoires | Mers, boussoles, planisphère vivant |
| **Babel** | Langues (anglais) | **Glossomancie** — comprendre et parler les langues | Marché-carrefour, ponts entre cultures |
| **Chroma** | Arts | **Chromancie** — peindre, rythmer, créer pour redonner couleur au monde | Cité-atelier, lumière, musique visible |

Royaume transversal : **la Citadelle (EMC / citoyenneté)** — hub social, guildes, règles de vie commune. On y recycle le contenu EMC existant.

### Le héros & les mentors
- **L'Éveilleur** = l'avatar du joueur (créateur de personnage, héritier direct du système d'avatar actuel, mais original et inclusif).
- **Les Sages-Gardiens** = 7 mentors, un par royaume, qui donnent les quêtes, enseignent les Arcanes et incarnent la « culture » de leur royaume.
- **La Grisaille** = l'antagoniste systémique (pas un méchant à frapper : une entropie qu'on repousse en apprenant — message pédagogique fort, zéro violence).

---

## 2. Le gameplay — « vivre une aventure », pas « faire des exercices »

Principe directeur : **on ne répond jamais à une question — on lance un sort.** L'acte d'apprendre est l'acte de jeu.

### Les 7 piliers demandés, concrétisés
- **Exploration libre** : carte-monde 2D/2.5D, chaque royaume est une région ouverte à parcourir (hérite et étend la mini-map actuelle).
- **Quêtes** : trame narrative principale (rallumer chaque Phare) + quêtes secondaires des Sages + quêtes quotidiennes.
- **Énigmes** : portes runiques, ponts de cristaux, mécanismes — résolus par une compétence du programme.
- **Mini-jeux** : un *template de mécanique* par type de compétence (voir §3), réskinnable à l'infini avec du contenu.
- **Coopération** : guildes, défis de classe, entraide (async d'abord, temps réel ensuite).
- **Collection** : familiers (« Éclats » à apprivoiser), cartes-savoir, reliques, cosmétiques — moteur de rétention non prédateur.
- **Personnalisation** : créateur d'avatar + repaire/atelier personnalisable.
- **Progression narrative** : niveaux d'Éveilleur, arbre de maîtrise par royaume, déblocage de régions.

### Pourquoi ça fait revenir chaque jour (rétention éthique)
- **Boucle quotidienne** : « Le Phare faiblit la nuit » → une quête courte (3–5 min) rallume la flamme du jour. (Streak *bienveillant* : on ne punit pas, on récompense la régularité ; pas de culpabilisation FOMO.)
- **Énergie/Lumière** qui se régénère en jouant (jamais payante — pas de pay-to-win).
- **Événements saisonniers** (Festival des Couleurs, Éclipse de la Grisaille…) → contenu frais, raison de revenir.
- **Collection + social** : nouveaux familiers, classements de guilde, objectifs de classe.

---

## 3. Pédagogie — chaque compétence CM1–CM2 devient une mécanique

Aligné sur le **programme français du Cycle 3 (CM1–CM2)** et le socle commun. Règle d'or : **une compétence → un geste de jeu**, jamais une fiche scolaire.

| Royaume | Compétences du programme (extrait) | Mécanique de jeu |
|---|---|---|
| **Numéria** (Maths) | Fractions & décimaux, 4 opérations, calcul mental, périmètre/aire, durées, symétrie, proportionnalité, problèmes | **Tailler les cristaux** (fractions = couper le cristal en parts), **bâtir des ponts** (mesures/géométrie), **forge de runes-calcul** (calcul mental contre le temps) |
| **Verba** (Français) | Classes de mots, accords GN, sujet/verbe, conjugaison (présent/imparfait/futur/passé composé), homophones, vocabulaire, compréhension | **Réparer les runes brisées** (accords/conjugaison), **déchiffrer les grimoires** (compréhension), **invoquer par le mot juste** (vocabulaire) |
| **Vivaria** (Sciences) | Classification du vivant, chaînes alimentaires, cycles de vie, corps humain, états/mélanges de la matière, ciel & Terre, environnement | **Cultiver & classer** (tri du vivant), **alchimie** (états/mélanges), **soigner l'écosystème** (chaînes alimentaires) |
| **Chronos** (Histoire) | Préhistoire → Antiquité → Moyen Âge → Temps modernes → Révolution → XIXe–XXe | **Voyages temporels** : remettre les époques/événements dans l'ordre, restaurer les fresques du passé |
| **Terra** (Géo) | Planisphère, continents/océans, France (fleuves, reliefs, régions), habiter/se déplacer, paysages | **Navigation** : tracer des routes, lire la boussole, relier villes et territoires |
| **Babel** (Anglais) | Salutations, nombres, couleurs, famille, animaux, nourriture, météo, heure | **Ponts entre cultures** : traduire pour ouvrir les portes, dialogues à compléter |
| **Chroma** (Arts) | Arts visuels, histoire des arts, rythme & chant | **Chromancie** : reproduire un motif/rythme, recolorer le monde, mini-jeu musical |

**Différenciation & adaptabilité** (clé pour les écoles) : difficulté ajustée par compétence (maîtrise mesurée), mode DYS (police, contrastes, audio), tutoriels contextuels. Chaque item est **tagué par code de compétence du programme** → c'est ce qui alimente les tableaux de bord parent/enseignant et la promesse EdTech.

---

## 4. Modèle économique — éthique, sans pay-to-win, sans mécanique prédatrice

7 leviers, organisés en 3 moteurs :

### B2C — Familles
1. **Gratuit & complet** : tout le curriculum est jouable sans payer. La gratuité n'est jamais bridée sur l'apprentissage.
2. **Cosmétique premium** : skins d'avatar, familiers rares, déco du repaire. **Zéro avantage de jeu.**
3. **Pass Aventure (saisonnier, éthique)** : ~5–8 €/saison. Récompenses cosmétiques + chapitres narratifs. Pistes gratuite *et* premium ; gagnable en jouant ; **pas de loot box, pas de hasard payant.**
4. **Abonnement Famille « Cercle des Parents »** (~6 €/mois, multi-enfants) : tableau de bord de progression par compétence, rapports hebdo alignés sur le programme, contrôle du temps de jeu.

### B2B / B2G — Écoles & collectivités (le vrai moteur de revenu en EdTech FR)
5. **Espace enseignant** : mode classe, attribution de quêtes par compétence, suivi de la maîtrise, conformité RGPD.
6. **Licences établissement** : par élève (~3–6 €/élève/an) ou par classe (~150–300 €/classe/an).
7. **Collectivités & dispositifs publics** : mairies, départements, régions, « Territoires Numériques Éducatifs » — achats groupés.

**Garde-fous** (non négociables) : RGPD + protection des mineurs, **aucune publicité ciblée enfants**, aucune donnée personnelle d'enfant collectée sans cadre parent/école, hébergement UE, profils pseudonymes, pas de dark pattern, pas de mécanique de rareté anxiogène. Ces garde-fous *sont* l'argument de vente B2B/B2G.

---

## 5. Production — ce qu'on garde, ce qu'on jette, comment on construit

### 5.1 À CONSERVER (actifs de valeur)
- ✅ **La banque de 752 questions** — l'actif le plus précieux. À nettoyer, **re-taguer par compétence**, valider pédagogiquement, migrer en JSON/CMS versionné. (≈ 60–70 % réutilisable tel quel.)
- ✅ **Le système d'avatar SVG** — devient le créateur de personnage + la couche cosmétique. La logique tenues/coiffures/accessoires est réemployable comme socle.
- ✅ **Le shell PWA** (manifest, icônes, install, service worker) — patterns réutilisables.
- ✅ **Le « juice »** : audio WebAudio, confettis, retours haptiques mobiles — patterns d'UX à reprendre.
- ✅ **Les concepts de progression** : XP, niveaux, quête du jour, trophées, sauvegarde multi-profils — bonnes idées à ré-implémenter côté serveur.

### 5.2 À SUPPRIMER / RETIRER
- ❌ **Le monolithe `index.html`** de 3521 lignes (non maintenable, non testable, non scalable en équipe).
- ❌ **Le thème « idol K-pop »** comme cadre narratif.
- ❌ **Le quiz-cartes comme boucle principale** → rétrogradé en *une* mécanique parmi d'autres (« lancer un sort »).
- ❌ **La persistance localStorage seule** → remplacée par comptes + sauvegarde cloud.

### 5.3 Architecture technique cible (moderne, web + mobile, gratuite à lancer)

Choix : **2D/2.5D stylisé**, pas de 3D façon Genshin (coût et performance web/mobile incompatibles avec un MVP). On vise « beau et lisible », façon Pokémon/Roblox-éducatif.

```
Monorepo (pnpm + Turborepo)
├── apps/web        → React + TypeScript + Vite (PWA installable)
│   └── moteur de jeu : Phaser 3  (2D tile-based, mobile-friendly, open-source)
│       état : Zustand · UI : composants maison
├── apps/api        → Supabase (Postgres + Auth + Row Level Security + Edge Functions)
│                     comptes, sauvegarde cloud, tableaux de bord, classements
├── packages/content→ curriculum en JSON validé par schéma (items tagués compétence)
│                     ← pipeline séparé code/contenu : des pédagogues éditent sans toucher au code
├── packages/engine → mécaniques de jeu réutilisables (templates de sorts/mini-jeux)
├── packages/ui     → design system partagé
└── packages/shared → types, codes de compétences, schémas
```

- **Paiement** : Stripe (abonnements + Pass), facturation B2B séparée.
- **Privacy-first analytics** : PostHog/Plausible auto-hébergé UE — *learning analytics* (maîtrise par compétence), pas de tracking pub.
- **Coop** : async d'abord (classements, guildes, défis de classe) ; temps réel ensuite via Colyseus.
- **Qualité** : TypeScript strict, tests (Vitest/Playwright), CI/CD, schéma de validation du contenu.
- **Conformité** : RGPD, hébergement UE, comptes enfants créés par parent/enseignant.

### 5.4 MVP — réalisable en 3 mois (1 trimestre)

**Objectif : prouver la boucle cœur** *explorer → quête → apprendre-en-jouant → progresser → revenir demain*, et la valider auprès de 1–2 classes.

Périmètre :
- **2 royaumes** : **Numéria (Maths)** + **Verba (Français)** — les deux plus lourds au programme et les mieux couverts par le contenu existant.
- **Créateur d'avatar** (depuis le système SVG existant, relooké).
- **3–4 templates de mécanique** : Cristomancie (fractions/calcul), Runomancie (accords/conjugaison) + 2 mini-jeux.
- **Comptes + sauvegarde cloud** + **tableau de bord parent minimal**.
- **Boucle quotidienne** (Phare du jour, streak bienveillant) + **collection** (premiers familiers).
- **Onboarding narratif** (l'arrivée de l'Éveilleur, la Grisaille, le premier Sage).
- **Boutique cosmétique** branchée (Stripe en test, pas encore de vraie vente).
- **Contenu** : ~150–200 items curés et tagués par royaume.

Livrable : **vertical slice jouable** + **bêta fermée** (1–2 classes / un cercle de familles).

### 5.5 Roadmap 12 mois

| Trimestre | Jalons |
|---|---|
| **T1 (M1–3)** | MVP / vertical slice — 2 royaumes (Numéria, Verba), comptes + cloud, dashboard parent v0, bêta fermée 1–2 classes. |
| **T2 (M4–6)** | +2 royaumes (**Vivaria**, **Chronos**) · coop async + guildes · **Pass Aventure S1** · abonnement Famille en prod · **CMS de contenu** (les pédagogues deviennent autonomes) · soft launch FR. |
| **T3 (M7–9)** | +2 royaumes (**Terra**, **Babel**) · 1er **événement saisonnier** · **espace enseignant + pilote B2B** (5–10 écoles) · modes accessibilité/DYS · i18n-ready. |
| **T4 (M10–12)** | 7e royaume (**Chroma**) · coop **temps réel** · **lancement public + marketing** · **pilote B2G** (mairie/collectivité) · 1res données d'efficacité pédagogique (crédibilité EdTech) · préparation levée / scale. |

### 5.6 Potentiel économique (estimations — fourchettes, pas des promesses)

Contexte FR : ~1,6 M d'élèves en CM1–CM2, ~210 000 classes en primaire. Marché EdTech FR actif (concurrents type Lalilo, Holy Owly, Nomad Éducation), achat public structuré (TNE, collectivités).

**Hypothèses de modèle (médian) :**
- B2C : freemium → ~2–5 % de conversion abonnement Famille (~60 €/an) + ARPU cosmétique/Pass ~0,5–1 €/MAU.
- B2B/B2G : ~250 €/classe/an ; capter 1–2 % des classes = 2 000–4 000 classes.

**Scénarios de revenu (année post-lancement) :**

| Scénario | An 1 | An 2 | An 3 |
|---|---|---|---|
| Conservateur | 30–80 k€ | 250–500 k€ | 0,8–1,5 M€ |
| Médian | 50–150 k€ | 0,5–1,5 M€ | 2–5 M€ |
| Ambitieux | 150–300 k€ | 1,5–3 M€ | 5–10 M€ |

Moteur dominant à terme : **le canal écoles/collectivités** (revenu récurrent, gros paniers), le B2C servant l'acquisition et la preuve d'usage.

**Coûts & financement** : une équipe resserrée (2–3 devs, 1 game/UX designer, 1–2 artistes 2D, 1–2 conseillers pédagogiques, du marketing) sur 12–18 mois implique un **seed ~500–800 k€** pour atteindre le lancement public + premiers pilotes B2B avec du runway.

**Risques majeurs** (à piloter) : coût de production du contenu, conformité vie privée des mineurs, **cycle de vente scolaire long et saisonnier** (vendre avant septembre), rétention difficile chez les 8–12, concurrence installée, nécessité d'une **validation d'efficacité** pour crédibiliser le B2B.

---

## 6. Recommandation

1. **Geler le développement de l'app de quiz actuelle** (elle reste en ligne comme proto, mais on n'y investit plus).
2. **Lancer le chantier MVP Luméria** sur la nouvelle architecture (monorepo React+Phaser+Supabase), en démarrant par **Numéria + Verba**.
3. **Première brique concrète** : migrer la banque de 752 questions en **contenu tagué par compétence** (réutilise l'actif, débloque les tableaux de bord, indépendant du moteur de jeu).
4. **Bêta classe avant l'été**, soft launch FR à la rentrée — le calendrier scolaire commande le go-to-market.

> *Repartir de zéro sur le code, oui. Mais en capitalisant sur les deux actifs réels déjà créés : le contenu pédagogique et la direction artistique de l'avatar.*
