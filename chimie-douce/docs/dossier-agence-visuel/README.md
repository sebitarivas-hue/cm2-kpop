# Dossier d'agence visuel — Clément Sanchez, version contrôlable

**Date :** 22 novembre 2026  
**Statut :** document de revue hors production, branche `plan/chimie-corpus-international-20261122`  
**Page :** `chimie-douce/docs/dossier-agence-visuel/index.html`

## Pourquoi ce format

Les précédents briefs PDF avaient traité la richesse du site comme un problème à simplifier ; ils n'étaient pas représentatifs des illustrations réellement produites. Cette nouvelle version **charge sans duplication les planches 28, 36, 55, 59 et 60 depuis le site lui-même**, dans leur intégralité et avec liens vers leurs fiches originales. Leur composition, leurs légendes et leurs avertissements sont examinés comme point de départ de la DA future.

**Attention :** le document représente directement les véritables planches. Il ne prouve pas que leur exactitude scientifique et les droits d'utilisation sont validés ; Clément doit relire les assertions.

## Afficher le véritable dossier sur un ordinateur

Dans le terminal du Mac :

```bash
git clone --single-branch --branch plan/chimie-corpus-international-20261122 https://github.com/sebitarivas-hue/cm2-kpop.git ~/cm2-agence-clement
cd ~/cm2-agence-clement
python3 -m http.server 8123
```

Ouvrir :

`http://localhost:8123/chimie-douce/docs/dossier-agence-visuel/`

Pour un dépôt déjà cloné, passer sur la branche documentaire sans écraser des modifications locales, ou faire un clone indépendant comme indiqué.

Le bouton **Exporter en PDF** lance le dialogue d'impression du navigateur. Choisir **Enregistrer au format PDF**, format A4 paysage, et activer les **arrière-plans graphiques** si le navigateur le propose. Les planches sont incorporées par le navigateur à partir des fichiers réels du dépôt ; **attendre leur chargement avant d'imprimer**.

Le dossier fonctionne en HTML, CSS et JS natifs, sans dépendance externe. Les figures sont dans `chimie-douce/assets/atlas-redessine/`.

## Éléments effectivement audités

- Visuels contrôlés en grandeur réelle : **28, 36, 55, 59, 60**.
- Code des pages `index.html`, `planches/`, `research/`, `notions/`, `bibliographie/`, `lab/`, `ingenierie/`.
- Structure de `src/content.js`, `src/figures.js`, `src/knowledge-graph.js`, `src/redesigned-plates.js`, `src/scene-resources.js`, `ingenierie/engine.js`, `ingenierie/models.js`, `lab/lab.js`.
- Contrôles statiques : IDs uniques, ancres résolues, assets référencés présents, liens relatifs présents, format impression A4 paysage, zoom des planches accessible.

## Limites explicites

Les captures authentiques des **interfaces déployées dans le site protégé** n'ont pas pu être prises dans un navigateur authentifié ; seules les planches ont été effectivement affichées ici. Le dossier ne prétend donc pas présenter un audit pixel par pixel des écrans d'accueil, de l'atlas, de la monographie, du laboratoire, de la bibliographie ou du responsive. Les modèles 3D originaux ne sont pas capturés dans ce document. Ces éléments exigent une recette navigateur réelle et des tests d'interaction.

Le diagramme du parcours ZIF-8 dans le dossier est une **proposition de storyboard UX originale** et porte une mention explicite « non quantitatif » ; ce n'est pas une capture, une structure CIF, ni une simulation scientifique. Ne pas le confondre avec les images originales du site.

Aucune modification de production n'est effectuée. L'impression locale ne modifie pas le site ni son accès.

## Prochaines étapes validables

1. Clément sélectionne les innovations et les cours centraux.
2. Documenter la grammaire visuelle existante dans une charte DA, avec variantes validées.
3. Tester un lecteur de régions à partir de la planche 36, sur ordinateur et téléphone.
4. Définir le paquet de données d'un seul modèle cristallographique D2, sans remplacer les représentations conceptuelles D0/D1.
5. Faire corriger les assertions scientifiques et statuts des planches par Clément, lot par lot.
6. Tester la navigation, les liens, le mobile et les droits avant toute diffusion supplémentaire.
