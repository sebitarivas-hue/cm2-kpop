# Chimie douce — Atlas 3D des matières vivantes

Application web expérimentale d'exploration tridimensionnelle de la chimie douce, de ses procédés et de ses interfaces avec le vivant.

## Périmètre livré

- **18 laboratoires WebGL** (sol–gel, membrane cellulaire, encapsulation, mycélium, béton autoréparant, spores, HDL, mousse Si(HIPE), diatomée, photo-biohybride, MOFs, coque ZIF-8, boucliers cellulaires, cryoprotection, bio-impression, pile microbienne et cellulose).
- Caméra libre (OrbitControls), zoom, pause, recadrage, captures PNG, légendes 3D, ajustements visuels, navigation clavier et mobile.
- **70 figures indexées** avec minutages renvoyant à la vidéo primaire ; 18 références documentaires, avec liens vers DOI lorsqu'ils sont connus.
- Catalogue et fiches expliquant *ce que les modèles représentent, et ce qu'ils ne démontrent pas*.
- L'essai historique `chimie_douce_interactive.html` demeure intact.

## Sources

Cours : Clément Sanchez, « Vers des matériaux hybrides vivants », Collège de France, 18 février 2020, https://www.youtube.com/watch?v=LkvdhO6XWZ4.
Corpus de travail : transcription VTT, 454 captures, monographie documentaire 16 chapitres, index de 70 figures. Bibliographie dans `src/content.js`.

## Validation scientifique

**Aucune scène n'est une simulation quantitative validée.** Les modèles sont géométriques ou conceptuels ; les réglages agissent sur leur visualisation. Les réseaux MOF ne sont pas des mailles CIF mesurées, la porosité représentée n'est pas une distribution expérimentale, et les particules ne suivent pas une loi de diffusion calibrée. Éviter d'extraire des dimensions, réactions, rendements, viabilités ou constantes cinétiques depuis les modèles. Les articles de référence doivent être consultés pour tout usage scientifique.

## Lancer

Un serveur statique suffit :

```bash
python3 -m http.server 8080
```

Puis ouvrir `http://localhost:8080/`. La connexion Internet reste nécessaire pour importer Three.js r187 depuis jsDelivr (version épinglée à 0.187.0).

## Hébergement GitHub Pages

Le dépôt de travail peut être privé. Selon le forfait GitHub, GitHub Pages peut demander un dépôt public ou une offre autorisant Pages sur dépôts privés. Dans GitHub : **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**. Ne pas supposer qu'une URL est active avant la confirmation des paramètres Pages et une vérification HTTP réelle.

## Identité et droits

Projet scientifique indépendant, **non affilié au Collège de France**. Aucun logotype officiel n'est utilisé. Les captures originales demeurent dans le corpus de recherche et les figures sont citées via leur minutage dans la vidéo ; leur réutilisation publique est soumise aux droits des auteurs/éditeurs.

## Technologies

JavaScript ES modules, Three.js r187, WebGL, CSS responsive. Aucun framework ni serveur de données requis.

## Bibliothèque éditoriale

- `research/index.html` : monographie complète lisible dans le navigateur (16 chapitres, 70 légendes, références), avec recherche par chapitre.
- `research/monographie.md` : version texte/source modifiable.
- `research/figures-index.csv` : index documentaire des figures avec minutage, chapitre et description.

## Contrôles

Exécuter `node tests/validate.mjs` depuis le dépôt pour contrôler la cohérence des 18 scènes, des figures et des références. Ce contrôle technique ne remplace pas la validation scientifique des études citées ni un test visuel sur un navigateur avec WebGL activé.

## Import de données atomiques

Le laboratoire 18 accepte les fichiers `.xyz` et un sous-ensemble des fichiers `.cif` : transformation des coordonnées fractionnaires selon les paramètres de maille, rendu 3D des sites, maille et liaisons inférées à partir des rayons covalents. **Le lecteur ne reconstruit pas les opérations de symétrie, les désordres ni les occupations partielles**. Il ne remplace donc pas un logiciel cristallographique validé. Les fichiers sont traités localement dans le navigateur.