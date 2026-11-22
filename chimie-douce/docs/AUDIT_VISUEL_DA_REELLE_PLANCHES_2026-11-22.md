# CONTRE-AUDIT DE DIRECTION ARTISTIQUE — partir du site existant

**Statut : analyse des véritables actifs graphiques de production, pas proposition de remplacement.**  
**Date : 22 novembre 2026.**  
**Référence :** `sebitarivas-hue/cm2-kpop`, `main`, fichiers `chimie-douce/assets/atlas-redessine/` inspectés directement en image pour les numéros 28, 36, 55, 59, 60.  
**Limite :** les pages protégées n'ont pas été testées par navigateur authentifié. L'analyse des feuilles CSS et du DOM est statique. **Ne pas transformer cet audit en affirmation sur les rendus desktop et mobile effectivement observés.**

## 1. Le constat qui change la commande

Les précédents briefs ont commis une erreur de direction artistique : transformer un projet déjà doté de **planches scientifiques illustrées, très denses, organiques et expressives** en des pages minimalistes, des pastilles et des diagrammes ornementaux. Cette interprétation est **abandonnée**.

La charte source n'est pas une palette générique « crème et vert ». Elle comprend :
- Une **composition scientifique en pleine page**, avec un objet ou une scène centrale complexe et multi-échelle.
- Une titraille spectaculaire en **sérif contrastée** (noir + accent carmin/bordeaux), accompagnée d'une sous-titration italique.
- Des **agrandissements incrustés** et coupes anatomiques / structurales raccordés aux objets par traits de rappel.
- Des **panneaux latéraux de progression** numérotés, explicatifs et illustrés.
- Des **cartouches secondaires de matériaux, molécules, organites, composants**.
- Des figures multiples et des **liaisons visuelles** : flèches de réaction, trajectoires, relations d'échelle, zooms et séquences.
- Une règle explicite : une figure peut être extrêmement attractive tout en étant **reconstruction pédagogique**. Elle doit l'annoncer **sur l'image, pas dans une notice séparée**.
- Une direction bibliographique intégrée : numéro d'image, contexte du cours, publication/source et avertissement épistémique en pied.

Cette identité n'est pas à remplacer mais à **formaliser, clarifier, harmoniser et rendre interactive**.

## 2. Analyse de cinq planches réellement visionnées

### Planche 28 — Diatomées, radiolaires et architectures naturelles

Lien à la version de production : `chimie-douce/assets/atlas-redessine/planche-28.webp`.  
**Force :** une « salle » centrale peuplée d'organismes siliceux aux textures différentes ; légendes taxonomiques en contact avec les formes ; colonne latérale exposant légèreté/résistance, surface, hiérarchie, inspiration ; principe scientifique / statut en bas. L'image combine potentiel poétique et structure pédagogique.
**A préserver :** diversité morphologique, largeur de la galerie centrale, détails microstructuraux, hiérarchie de lecture, champ de statut.
**À corriger / contrôler :** lisibilité des légendes sur téléphone ; catégories biologiques et taxons à confirmer avec les sources, car la planche dit elle-même qu'aucune photographie microscopique réelle n'est reproduite ; ne pas transformer des architectures idéalisées en micrographies dans les métadonnées.

### Planche 36 — ZIF-8 : formation d'une coque cellulaire

Lien : `chimie-douce/assets/atlas-redessine/planche-36.webp`.  
**Force :** progression en quatre états (cellule, précurseurs, nucléation, croissance) ; molécules et ions identifiés, trois niveaux de détail (gabarit, membrane, cristallites), panneau droit en trois étapes ; comparaison ponctuelle avec une autre famille de MOFs.
**A préserver :** continuité des séquences, zoom latéral, relation des précurseurs à la couche, distinction entre les échelles.
**À corriger / contrôler :** incohérences potentielles de représentation entre icônes moléculaires et vrai réseau cristallin ; aucune viabilité/imperméabilité déduite de la géométrie de la coque, comme le rappelle le bandeau bas.
**Conséquence pour la 3D :** vue A = coque polycristalline D0/D1 ; vue B = vrai cristal ZIF-8 D2 si CIF authentique ; liaison entre A et B **sans fausse continuité d'échelle**.

### Planche 55 — Synthèse de MOFs à l'intérieur des plantes

Lien : `chimie-douce/assets/atlas-redessine/planche-55.webp`.  
**Force :** grande plante complète, coupe circulaire de tige avec xylème/phloème, incrustation cellulaire, chimie de deux voies de précurseurs, tracé cinétique explicitement « conceptuel » et bandeau « Ce que montrent les observations / Ce que cela ne prouve pas ». C'est le standard narratif du site.
**À préserver absolument :** la dissociation entre observation et non-preuve ; plan intégrant trajet, échelle anatomique, modèle chimique, limitations.
**À contrôler :** le passage de l'organisme au compartiment cellulaire ne doit pas être présenté comme imagerie exacte issue de la publication ; vérifier structures moléculaires, sources et terminologie.

### Planche 59 — Bio-impression de bactéries dans des matériaux

Lien : `chimie-douce/assets/atlas-redessine/planche-59.webp`.  
**Force :** rendu de procédé au centre, encart agrandi sur la matrice poreuse et les bactéries, colonne composants à gauche, cycle formulation–extrusion–vérification à droite, applications biologiques en bas.
**À préserver :** la valeur visuelle de la matière transparente, les textures des hydrogels, l'impression 3D représentée en situation, les applications.
**À contrôler :** liste des formulations et exemples réels selon la publication source, statut exact de la démonstration et distinction systématique entre fonction souhaitée et fonction mesurée. La planche signale justement : « la géométrie imprimée ne suffit pas à prouver la viabilité ni l'activité bactérienne ».
**Risque UX :** rétrécir l'image entière sur mobile détruit presque toutes les légendes ; besoin d'une navigation par régions sémantiques.

### Planche 60 — Biofabrication : tissus et démonstrateurs

Lien : `chimie-douce/assets/atlas-redessine/planche-60.webp`.  
**Force :** hiérarchie très détaillée en trois modules : mise en forme, protocole en quatre étapes, dimensions du démonstrateur (géométrie, transport, évaluation). Les images montrent une matière hydratée et lumineuse riche d'informations.
**À préserver :** le zoom matière et l'explication des essais de viabilité.
**À contrôler :** différencier construction conceptuelle d'une image d'expérience, et **ne pas** qualifier une structure de « tissu implantable » sur la seule base d'un hydrogel extrudé. Le bandeau final fournit la limitation.
**Risque éditorial :** redondance graphique et textuelle importante avec la planche 59 ; créer un lien « Approfondir la biofabrication », pas recopier les mêmes paragraphes sur deux fiches sans valeur nouvelle.

## 3. DA cible : prolongement de la langue déjà développée

**Nom de système de travail :** « Planche–Atlas–Laboratoire » — continuité de lecture, pas nouvelle marque imposée.

**Couverture / accueil :** choisir un **visuel central réel et validé issu d'une des recherches actuelles de Clément**, plutôt qu'un dessin décoratif ou une 3D fictive. Proposer 2–3 déclinaisons basées sur des planches du site, jamais des stock images. N'utiliser les objets des matériaux vivants que dans leur contexte ; ne pas les transformer en identité globale permanente.

**Titraille :** conserver sérif de grande taille + détail carmin + italique scientifique ; établir échelles typographiques, et éviter de substituer des polices « startup » sans accord.

**Palette :** fond papier ivoire, noir gravure, rouge carmin/marsala pour les mots-clés et alertes, vert profond pour panneaux de protocole ; couleurs secondaires **par famille de phénomènes** (bleu silice, violet MOF, vert biologique, ocre précurseur, etc.) liées à une légende stable et accessibles au daltonisme.

**Compositions :** hero scientifique détaillé, panneaux de protocole, matière et microstructure, « observation / interprétation / limites », notes de source. Garder l'ampleur visuelle ; ne pas convertir toutes les informations en cartes rectangulaires uniformes.

**Animations :** les formes peuvent progressivement se révéler, se superposer, pivoter et être isolées, **uniquement si chaque changement de vue est scientifiquement justifiable**. La texture d'une reconstruction ne doit pas être présentée comme photo au microscope.

## 4. Déploiement UX : transformer les planches en chapitres interactifs

### Sur ordinateur

Une planche scientifique principale en **focale** (plein écran possible), avec **cinq régions cliquables canoniques** :
1. matière / spécimen principal ;
2. loupe et détail à une autre échelle ;
3. étapes chimiques / procédés ;
4. applications et mesures ;
5. conclusion scientifique et limites.

Ouvrir un panneau contextuel latéral repliable pour chaque région, sans superposition sur les éléments importants. L'utilisateur peut isoler un calque, revenir à l'état de référence et comparer la planche reconstruite et l'original du cours.

### Sur téléphone

Pas d'image globale réduite à 375 px. Présenter :
- d'abord la vue complète pour l'orientation ;
- ensuite un **lecteur de régions zoomables** avec synchronisation de la légende et possibilité de revenir au cadrage total ;
- étapes en cartes de lecture séquentielle **déduites de la planche existante** et non nouveaux contenus redondants ;
- bouton « Source / Limites » toujours accessible ;
- gestes contrôlés pour zoomer, sans provoquer de collisions de modales.

Le système doit fonctionner en portrait/paysage, clavier et lecteurs d'écran, avec tests réels à 320/375/390/768/1024/1440 px et zoom 200 %.

### Bibliographie

Depuis la légende de n'importe quelle planche : DOI / source / date / méthode / publication originale → notion → chapitre → expérience 3D → brevet / application s'il y a une relation **vérifiée**. Une ressource ne doit posséder qu'une seule fiche documentaire canonique, reliée à des vues multiples.

### 3D

Chaque planche devient un « storyboard scientifique » du modèle 3D : découper en objets, étapes, échelles et paramètres, **avec sources**.
- D0 : schéma / concept, non mesuré ;
- D1 : géométrie ou morphologie appuyée sur mesure ;
- D2 : vraie structure cristallographique sous CIF/PDB et références ;
- D3 : simulation physicochimique validée avec hypothèses, paramètres et tests.
Pour la planche 36, par exemple, le ZIF-8 cristallin D2 et la coque cellulaire D0/D1 doivent former deux vues **liées mais non confondues**.

## 5. Tickets de correction présents dans le code actuel

| ID | Constat constaté dans main | Correction requise |
|---|---|---|
| DA-01 | Plusieurs feuilles `editorial.css`, `atlas-approved.css`, `atlas-specimen.css`, `discovery-home.css`, etc. sont chargées en parallèle, certaines avec `!important`. | Inventorier les tokens, repérer les responsabilités et écrire les tests de non-régression CSS. Ne pas refaire les écrans. |
| VIS-02 | `src/redesigned-plates.js` porte `defaultOriginal` pour certaines planches ; `planches/planches.js` en tient compte, alors que `src/scene-resources.js` choisit une reconstruction dès qu'elle existe. | Unifier la fonction de résolution image source/reconstruction, tester les 70 cas. |
| UX-03 | Une planche imprimable haute densité n'est pas directement lisible à l'échelle d'un smartphone. | Créer lecteur de régions, agrandissement, légendes synchronisées et tests mobiles, sans supprimer la vue intégrale. |
| SCI-04 | Les reconstructions incluent parfois une scène 3D synthétique très photoréaliste. | Étiquetage visible « reconstruction / aucune micrographie réelle », contrôle de chaque légende. |
| BIB-05 | `bibliographie/bibliographie.js` indexe les sources associées au cours de 2020 ; l'inventaire exhaustif Sanchez 2022–2026 est encore à construire et dédoublonner. | Un référentiel bibliographique complet par DOI et type, validation des coauteurs/affiliations, relier figure et résultat, pas d'attribution fausse. |
| EDIT-06 | L'accueil et l'attribution du site sont centrés sur « Vers des matériaux hybrides vivants » (2020). | Évoluer vers la recherche actuelle et la sélection de Clément **après son accord scientifique**, tout en conservant intact ce module. |

## 6. La commande pour le dossier d'agence final

Le nouveau document d'agence doit **montrer les planches réelles 28, 36, 55, 59 et 60 en grand**, avec zooms ciblés et critiques précises en marge, puis les **captures authentiques des interfaces d'accueil, d'ingénierie, de laboratoire, d'atlas, de bibliographie et de monographie** quand un accès navigateur est possible. Il ne faut plus insérer d'images décoratives sans rapport ni de faux mockups dits « conçus pour Clément ».

Séparer explicitement :
- **CE QUI EXISTE** — captures/images source datées et commit ;
- **CE QU'ON PROPOSE** — wireframes ou règles, sans faire passer des designs non déployés pour des écrans réels ;
- **CE QUE CLÉMENT VALIDE** — chaque choix scientifico-éditorial et DA ;
- **CE QU'ON TESTE** — critères d'acceptation et compte rendu de recette.

**IMPORTANT :** ce rapport est un **premier contre-audit sur cinq planches réelles**. Il ne peut pas servir de preuve que les 70 planches, toutes les pages et le responsive ont été validés visuellement.
