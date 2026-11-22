# Plan directeur — Clément Sanchez, enseignements et recherche internationale

**Statut : proposition d'architecture, non implémentée**  
**Date d'audit : 22 novembre 2026**  
**Branche de planification : `plan/chimie-corpus-international-20261122`**  
**Référence : `main` au démarrage de cette branche (6a3554a1701d6ee1aebd1ee0e1a45656d813a02c).**

## 0. Décision d'architecture

Ne pas créer trois sous-sites « Recherche / Industrie / Grand public ». Produire **un seul référentiel documentaire** et trois modes de lecture de ce même corpus, avec une recherche et une navigation communes.

La **leçon inaugurale de Clément Sanchez (10 février 2011)** est le point d'entrée historiographique. Les cycles de cours, chaque séance, les séminaires, les colloques, la biographie, la bibliographie, la vidéographie, les 70 planches du cours de 2020, les 38 notions, les 18 laboratoires et les recherches internationales doivent relever d'un **graphe de connaissances traçable**.

**Interdictions :** pas de refonte graphique arbitraire, pas de suppression d'originaux, pas de simulation présentée comme quantitative sans validation, pas de lien scientifique prétendu sur la base d'une simple similitude lexicale, pas de reproduction d'images tierces sans vérification des droits.

## 1. État audité (GitHub, branche main)

Sources principales :
- `ressources/international/ressources_chimie_douce.json` — 38 ressources à identifiant unique et à URL explicite.
- `ressources/international/CATALOGUE.md` — présentation et politique de réemploi.
- `chimie-douce/src/knowledge-graph.js` — 38 notions / 18 scènes reliées à des planches par `SCENE_RESOURCE_MAP` et `CONCEPT_PLATE_MAP`.
- `chimie-douce/src/figures.js` — index de 70 planches.
- `chimie-douce/src/content.js` — scènes et bibliographie du cours de 2020.
- `chimie-douce/src/redesigned-plates.js` — éditions graphiques avec statuts éditoriaux encore hétérogènes.

Observations sur le catalogue international :
- 13 entrées Japon, 4 Chine, 5 États-Unis, 3 Suisse, 3 Europe, 10 « International ».
- 38/38 disposent de `source_url`, `audiences`, `topics`, `rights_status`, `priority`, `checked`.
- 38/38 ne contiennent **aucun identifiant canonique** de notion, de planche, de scène ou de séance ; les relations inter-corpus sont donc absentes.
- 4 références possèdent une URL `doi.org`, mais le DOI n'est pas normalisé dans un champ dédié.
- 36/38 ont un champ `notes` vide.
- L'inventaire contient des plateformes et API : « 38 ressources » ne signifie pas « 38 publications scientifiques ».
- Aucune URL de la liste ne provient du domaine `mit.edu` ; la couverture institutionnelle du MIT reste à compléter.
- La date commune `checked=2026-11-22` est **une déclaration de catalogue**, non une preuve de contrôle HTTP, bibliographique, juridique ou scientifique des 38 URLs.

Il faut séparer *présence en base*, *lien accessible*, *identification bibliographique contrôlée*, *pertinence scientifique évaluée* et *droit de réutilisation confirmé*.

## 2. Architecture cible

### Navigation principale (hypothèse à tester en prototype)

1. **Accueil** : manifeste scientifique + lien prominent vers l'inaugurale.
2. **Enseignements** : chronologie complète 2011–2020, cycles, séances individuelles, séminaires, colloques.
3. **Clément Sanchez** : biographie, bibliographie, vidéographie, jalons scientifiques (sous-navigation persistante).
4. **Notions / Atlas** : 38 notions actuelles extensibles, 70 figures, 18 laboratoires 3D, scènes et modèles.
5. **Recherche mondiale** : ressources et équipes internationales, travaux classés par thème et preuve.
6. **Ingénierie / applications** : mécanismes, procédés, caractérisation, maturité, contraintes et secteurs.
7. **Bibliothèque** : recherche transversale, publications, médias, données, sources et licences.

La cohérence DA actuelle est prioritaire : **fond crème, précision éditoriale, lisibilité et continuité graphique** ; pas de changement de design sans prototype testé.

### Modèle de données normalisé

Créer des entités stables : `person`, `institution`, `teaching_cycle`, `lecture`, `seminar`, `colloquium`, `publication`, `media`, `concept`, `figure`, `scene`, `experiment`, `research_resource`, `claim`, `rights_record`.

Proposer des IDs préfixés : `person:sanchez-clement`, `lecture:cdf-2011-inaugurale`, `concept:solgel`, `figure:2020-01`, `resource:JP-HOK-01`, `scene:solgel`. Conserver les IDs existants comme références canoniques ou alias rétrocompatibles ; ne jamais renuméroter les planches existantes.

Schéma minimal `research_resource` :
- `id` (obligatoire, unique), `title`, `source_url`, `country`, `institution_id?`, `resource_kind`, `topics_raw[]`.
- `canonical_concepts[]`, `relevant_lectures[]`, `relevant_figures[]`, `relevant_scenes[]` : **IDs contrôlés**, ne pas peupler automatiquement sans validation.
- `relation_type` pour chaque arête : `illustrates`, `defines`, `cites`, `precedes`, `extends`, `contrasts`, `has_method_in_common`, `related_topic_only`.
- `relation_evidence` : identifiant d'une source vérifiable, citation localisée/section, commentaire humain et statut `candidate|reviewed|verified|rejected`.
- `doi?`, `authors[]?`, `published_at?`, `license?`, `rights_evidence_url?`, `last_link_check?`, `last_scientific_review?`.
- `audiences[]`, `abstract_research?`, `summary_industry?`, `summary_public?`, `scientific_claims[]`.
- `review_status`: `inventoried|link_checked|bibliographically_verified|scientifically_reviewed` ; `reuse_status`: `link_only|metadata_allowed|embedded_with_terms|licensed_copy`.

**Une relation validée nécessite une source**, une justification et un responsable/relecteur, pas seulement un mot-clé partagé.

### Trois modes de lecture, une seule fiche

- **Recherche** : références primaires, DOI, méthodes, conditions expérimentales, résultats, incertitude, limites, mises en perspective.
- **Industrie et investissement** : procédé, changement d'échelle, coûts/performances *uniquement si documentés*, propriété intellectuelle, sécurité, TRL *avec justification*, statut application.
- **Découverte / grand public** : présentation pédagogique, définitions cliquables, figures autorisées, expériences explicitement conceptuelles.

Le mode change l'angle éditorial, pas les données factuelles. Si une donnée est indisponible, afficher « non documenté » et non un chiffre inventé.

## 3. Processus par lots — ordre impératif

### Porte A — Inventaire et qualité des données (sans modification de site)

1. Lire les 38 enregistrements, établir un tableau par ID.
2. Valider JSON, URLs, doublons, types, schéma et droits indiqués.
3. Vérifier *effectivement* les liens ; traiter 403 / 429 / géoblocage comme « vérification manuelle requise », non comme une suppression certaine.
4. Identifier les DOI, vérifier avec Crossref / éditeur / organismes ; ne pas inférer auteurs, résultats ou licence.
5. Classer le type de ressource : publication primaire, laboratoire, institution, documentation technique, jeu de données, logiciel, API, texte de référence, droits.
6. Compléter MIT et les équipes japonaises / chinoises par **sources institutionnelles** ; représenter une couverture manquante comme une lacune, jamais comme un inventaire exhaustif.

**Livrable A :** tableau des 38 fiches avec niveau de vérification, corrections candidates, trous de couverture et décisions de droits.

### Porte B — Corpus des enseignements (sans modifier le site public)

1. Reconstituer à partir du Collège de France les cycles, séances datées et médias de 2010–2011 à 2019–2020.
2. Mettre à part l'année sans enseignement statutaire 2017–2018, et distinguer leçon inaugurale, cours, séminaire, colloque, invité.
3. Vérifier chaque titre, date, intervenant, durée et URL officielle ; enregistrer les éléments indisponibles.
4. Construire un dossier distinct « Clément Sanchez » (biographie, bibliographie, vidéographie) dont les sources officielles sont prioritaires.
5. Indexer les enseignements par notion **seulement après confrontation du contenu**, sans attribuer une ressource internationale à un cours sur seul mot-clé.

**Livrable B :** inventaire chronologique complet avec taux de couverture par année / type / séance.

### Porte C — Graphe scientifique audité

1. Normaliser les 38 termes actuels en préservant leurs IDs, définitions et traductions.
2. Produire une table de rapprochement des 38 ressources internationales vers concepts, figures, scènes et séances : **proposées** d'abord.
3. Revoir chaque correspondance selon la source primaire. Une notion liée ne signifie pas que l'article reproduit l'expérience de Sanchez.
4. Conserver des fiches non reliées avec motif explicite plutôt que créer des arêtes artificielles.
5. Distinguer l'antériorité (avant 2011 / 2011–2020 / après 2020) et les relations de comparaison scientifique.

**Livrable C :** graphe versionné, pour chaque arête : source, justification, degré de validation, provenance et méthode de contrôle.

### Porte D — Prototype non déployé

1. Maquetter **la leçon inaugurale** comme page de référence : média officiel, concepts, figures, références, chronologie.
2. Prototyper la page « Clément Sanchez » (bio / biblio / vidéo), puis une fiche ressource à trois modes.
3. Prototyper le moteur de découverte croisant notions, planches, modèles, pays et types de ressources.
4. Valider en desktop et mobile : navigation stable, menu refermable, accessibilité clavier, images lisibles, absence de collisions.
5. Ne pas modifier ou déplacer l'original des 70 figures et ne pas interrompre la consultation de la conférence 2020.

**Livrable D :** prototype + tests humains sur un parcours inaugurale → notion → figure → publication → modèle → laboratoire international.

### Porte E — Implémentation conditionnelle

Seulement après revue des livrables A-D :
- Branches fonctionnelles isolées, PR avec diff et tests ; aucun push direct à `main`.
- Passage progressif des données vers le référentiel canonique via adaptateurs ; compatibilité des URLs et IDs actuels.
- Indicateurs séparés pour couverture documentaire, disponibilité des liens, preuves scientifiques et intégrité technique.
- Monitoring des liens, sans intégration automatique de contenus protégés.
- Fusion après contrôle visuel, tests automatiques et approbation.

## 4. Tests et critères de passage

**Données :**
- 38/38 enregistrements parseables, IDs uniques, URLs syntaxiquement valides.
- 100 % des relations publiées pointent vers un identifiant existant et sont accompagnées d'une provenance / d'un statut.
- Zéro DOI inventé ; les DOI réels ont métadonnées vérifiées ou statut « à contrôler ».
- Aucune image, PDF ou vidéo tiers copié sans droit exact établi.

**Contenus :**
- L'ensemble des 70 planches et leurs URL restent accessibles ; toute reconstruction non validée est signalée.
- Chacune des 18 scènes possède son lien canonique ; pas de doublon physique inutile.
- Chaque fiche de leçon indique le statut de disponibilité des médias.
- Absence de relations « résultat expérimental prouvé » issues d'un simple voisinage thématique.

**Technique / UX :**
- Aucun lien interne cassé, aucun ID dupliqué dans la page, aucune régression du système de langue.
- Tests de navigation mobile portrait/paysage et desktop, clavier et lecteurs d'écran.
- Vérifications de performance et de chargement différé des contenus lourds ; repli si WebGL est indisponible.
- Tests automatisés des données, des liens internes et de la cohérence du graphe dans le dépôt.

## 5. Priorités de réalisation (ordre, pas calendrier fictif)

**P0 — Sécuriser les sources :** audit des 38, DOI, droits, taxonomie, inventaire exact des cours, leçon inaugurale.

**P1 — Fonder le référentiel :** identifiants, schémas, relations contrôlées, navigation canonique, conservation des historiques.

**P2 — Prototyper le cœur pédagogique :** inaugurale, biographie / bibliographie / vidéographie, puis fiches de notions et ressources dans les trois modes.

**P3 — Développer l'intégration :** importer, filtrer, interconnecter, tester et publier sous contrôle.

**P4 — Étendre :** corpus scientifiques Japon/Chine/MIT, archives, nouveaux médias et laboratoires, après vérification de pertinence, provenance et droits.

## 6. Consigne pour les agents

> Tu pilotes le développement du site de Clément Sanchez comme une archive scientifique et un atlas de connaissances, pas comme un simple site vitrine. Lis l'intégralité du dépôt, inventorie chaque cours officiel et chaque ressource du catalogue international. Produis d'abord les livrables A-D ci-dessus avec sources contrôlables et statuts de preuve. N'affirme jamais qu'un lien scientifique existe sans démonstration documentaire. Utilise un référentiel unique à trois niveaux de lecture. Préserve la DA crème, les 70 originaux, les scènes et le multilingue. N'effectue aucune modification de production ni fusion sur `main` avant validation explicite du plan et des tests.

## 7. Décision à prendre avant la première PR fonctionnelle

Après examen des livrables A-D : valider le modèle d'entités et les trois modes, confirmer la page inaugurale comme parcours de référence, puis autoriser explicitement la phase E. Sans cette décision, le chantier reste au stade documentaire.
