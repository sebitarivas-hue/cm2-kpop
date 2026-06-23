# Luméria — MVP (vertical slice)

Jeu web éducatif d'aventure pour les 8–12 ans (CM1–CM2). Voir la vision produit
complète dans [`../VISION.md`](../VISION.md).

Ce dossier est le **scaffold technique** du MVP : un **moteur de royaume générique**
piloté par configuration, avec **deux royaumes jouables** — **Numéria (Maths)** et
**Verba (Français)** — reliés par une **carte-monde**.

## Boucle de jeu démontrée

`explorer (carte 2D) → atteindre un Pont de Lumière brisé → « lancer un sort »
(résoudre une épreuve de Cristomancie taguée par compétence) → le pont se reforme
→ gagner XP / maîtrise → atteindre le Sage → rallumer le Phare du royaume.`

On ne « répond pas à une question » : on canalise un pouvoir. L'apprentissage **est**
le gameplay.

## Stack

- **React + TypeScript + Vite** (PWA-ready)
- **Phaser** — moteur de jeu 2D (exploration, physique, rendu procédural)
- **Zustand** — état du joueur (niveau, XP, maîtrise par compétence, sauvegarde)
- **Supabase** — sauvegarde cloud + comptes (optionnel, activé par variables d'env)
- Rendu **100 % procédural** : aucun asset externe, tourne partout.

## Architecture (mime les futurs packages du monorepo)

```
src/
  game/        moteur Phaser : scènes, wrapper React  (→ packages/engine + apps/web)
  content/     contenu pédagogique TAGUÉ par compétence (→ packages/content)
  state/       store Zustand + modèle de sauvegarde
  services/    eventBus (Phaser↔React) + persistance abstraite (→ Supabase plus tard)
  ui/          overlays React : onboarding, HUD, épreuve, narration, victoire
```

Points clés de conception :

- **Contenu séparé du code et tagué compétence** (`content/schema.ts`,
  `content/numeria.ts`) → socle des futurs tableaux de bord parent/enseignant.
- **Persistance abstraite** (`services/save.ts`) : `LocalSaveAdapter` aujourd'hui,
  `SupabaseSaveAdapter` demain, sans toucher au reste.
- **Découplage moteur/UI** via un bus d'événements.

## Lancer en local

```bash
cd app
npm install
npm run dev               # http://localhost:5173
npm run build             # build de production -> dist/
npm run preview           # sert le build
npm run validate:content  # valide le contenu pédagogique (schéma + réponses)
```

Sauvegarde cloud (optionnelle) : copier `.env.example` en `.env.local` et renseigner
les clés Supabase. Sans clés, la sauvegarde est locale.

## Statut

Deux royaumes jouables sur 7, reliés par la carte-monde. Prochaines briques
(cf. roadmap) : créateur d'avatar, royaumes Vivaria/Chronos, activation des comptes
+ sauvegarde cloud Supabase, tableau de bord parent.
