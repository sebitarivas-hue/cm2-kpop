# Clément Sanchez — La matière en relation

**Prototype fonctionnel, isolé du site public.** Révision du 22 novembre 2026.  
**Branche :** `prototype/sanchez-poetique-20261122`, dérivée de la branche documentaire `plan/chimie-corpus-international-20261122`.

## Objet

Ce premier démonstrateur **ne prétend pas** contenir l'intégralité des recherches et matériaux de Sanchez. Il teste l'architecture éditoriale et UX de la future plateforme : une narration structurée par la leçon inaugurale, un explorateur des huit axes scientifiques avec trois modes de lecture, l'accès aux 53 fiches officielles de cours, des dossiers de brevets et une politique de fidélité des futurs objets 3D.

### Lancer et tester sans toucher à votre dépôt local de travail

```bash
git clone --single-branch --branch prototype/sanchez-poetique-20261122 https://github.com/sebitarivas-hue/cm2-kpop.git ~/cm2-sanchez-prototype
cd ~/cm2-sanchez-prototype
python3 -m http.server 8123
```

Ouvrir : **http://localhost:8123/chimie-douce/prototypes/sanchez-poetique/**

La page fonctionne en HTML/CSS/JavaScript natifs, sans dépendance d'exécution. Le filtre de cours charge le fichier relatif `../../docs/donnees/enseignements_officiels_confirmes_2011_2020.json` : il faut donc servir le dossier racine du dépôt par HTTP, et non ouvrir le seul fichier HTML depuis `file://`. Si le chargement échoue, la page affiche un lien vers l'index documentaire intégral.

### Parcours à tester

1. **Desktop / mobile** : barre de navigation, composition éditoriale, panneaux d'idées, cartes et tableaux, sans débordements ni recouvrements.
2. **Navigation clavier** : tabulation vers les actions, axes et onglets, contrôle de focus et ordre logique.
3. **Huit axes** : chaque bouton change la fiche ; `Découverte / Recherche / Industrie` modifie la formulation, jamais l'état des preuves.
4. **53 enseignements** : chargement depuis JSON, recherche par titre/date/cycle, lien individuel vers Collège de France.
5. **Brevets** : les trois cartes distinguent brevet et commercialisation non vérifiée.
6. **3D** : la zone de prototype décrit les niveaux D0–D3 et ne simule **aucune** structure atomique sans fichier CIF et DOI authentifiés.
7. **Sources** : liens externes ouvrent une page institutionnelle, un brevet ou une publication. Le schéma graphique de l'accueil est explicitement non quantitatif.

### Tests réalisés

Contrôle statique du fichier HTML avec l'API GitHub : balisage racine présent, IDs uniques, ancres internes résolues, mode recherche relié au JSON existant. Le fichier de données contient 54 enregistrements dont 53 cours et une leçon inaugurale ; URLs distinctes. Les fichiers `index.html` et `README.md` sont situés sous `prototypes/`.

**Tests NON exécutés dans cette étape :** capture d'écran et recette réelle iPhone/desktop, tests de lecteur d'écran, performance et tests navigateur automatisés. Ces contrôles sont obligatoires avant intégration.

## Politique scientifique

L'ouverture est une composition éditoriale originale basée sur les thèmes de l'inaugurale ; aucune phrase originale n'est attribuée comme citation de Sanchez. La composition SVG n'est **pas** une micrographie ni une simulation. Les cartes brevet ne sont pas une preuve d'exploitation industrielle, et les laboratoires 3D déjà disponibles ne sont pas par défaut des structures atomiques authentiques.

**Ne pas copier ce prototype sur `main`, ni remplacer l'accueil existant sans validation graphique, scientifique et juridique.** Il s'agit de la porte D (prototype hors production) du plan directeur.
