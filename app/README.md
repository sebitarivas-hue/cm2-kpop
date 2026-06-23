# Luméria — MVP (vertical slice)

Jeu web éducatif d'aventure pour les 8–12 ans (CM1–CM2). Voir la vision produit
complète dans [`../VISION.md`](../VISION.md).

Ce dossier est le **scaffold technique** du MVP : il prouve la **boucle cœur** sur
le premier royaume, **Numéria (Mathématiques)**.

## Boucle de jeu démontrée

`explorer (carte 2D) → atteindre un Pont de Lumière brisé → « lancer un sort »
(résoudre une épreuve de Cristomancie taguée par compétence) → le pont se reforme
→ gagner XP / maîtrise → atteindre le Sage → rallumer le Phare du royaume.`

On ne « répond pas à une question » : on canalise un pouvoir. L'apprentissage **est**
le gameplay.

## Stack

- **React + TypeScript + Vite** (PWA-ready)
- **Phaser 3** — moteur de jeu 2D (exploration, physique, rendu procédural)
- **Zustand** — état du joueur (niveau, XP, maîtrise par compétence, sauvegarde)
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
npm run dev      # http://localhost:5173
npm run build    # build de production -> dist/
npm run preview  # sert le build
```

## Statut

Vertical slice jouable — 1 royaume sur 7. Prochaines briques (cf. roadmap) :
créateur d'avatar, royaume Verba (Français), comptes + sauvegarde cloud (Supabase),
tableau de bord parent.
