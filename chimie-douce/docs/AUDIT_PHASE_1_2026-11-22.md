# Audit phase 1 — corpus Clément Sanchez et architecture chimie douce

**Date : 22 novembre 2026**  
**Branche de documentation :** `plan/chimie-corpus-international-20261122` (aucun changement de production).  
**Base auditée :** `main` `6a3554a1701d6ee1aebd1ee0e1a45656d813a02c`.  
**Statut : audit partiel vérifié, inventaire structurel complet ; recette fonctionnelle et revue scientifique exhaustive non effectuées.**

## 1. Portée et limites

L'audit prend pour référence :
- Arborescence GitHub complète `git/trees/main?recursive=1` (`truncated:false`).
- Lecture ciblée des sources et tests via GitHub.
- Programmes des cours officiels, catalogue audiovisuel, page de la chaire et biographie du Collège de France.
- Fichiers `ressources/international/CATALOGUE.md` et `ressources_chimie_douce.json`.

**Non réalisé** : exécution du site en navigateur, tests Node, audit WCAG instrumenté, contrôle scientifique individuel des 70 figures et de leurs reconstructions, validation HTTP de chaque URL du catalogue, vérification des licences exactes, dédoublonnage bibliographique de la production complète de Sanchez. La tentative de cloner GitHub dans l'environnement d'audit échoue par résolution DNS ; les fichiers lus sont ceux de l'API GitHub, sans supposer qu'un build a fonctionné.

## 2. Inventaire du dépôt (constats vérifiés)

`git/trees/main?recursive=1` : **245 entrées = 229 blobs et 16 arbres, sans troncature** ; **13 232 090 octets**. Extensions : 113 `.webp`, 32 `.svg`, 46 `.js`, 15 `.css`, 9 `.html`, 4 `.mjs`, 4 `.md`, 3 `.png`, 2 `.json`, 1 `.csv`.

Composantes existantes : 70 diapositives originales `assets/planches/fig-XX.webp` ; 70 identifiants de figures dans `src/figures.js` ; 18 scènes dans `src/content.js` ; 38 concepts dans `src/knowledge-graph.js` ; monographie 16 chapitres ; fichiers de traduction ; laboratoires d'ingénierie et de visualisation ; catalogue international de 38 ressources.

**Présence de ces artefacts ≠ validation de leur fonctionnement**. Aucun workflow GitHub Actions et aucun fichier `package.json` ne figurent dans l'arborescence de cette révision ; les tests `tests/validate.mjs`, `tests/unified-resources.mjs`, `ingenierie/tests/kinetics.test.mjs` et l'outil `tools/audit-i18n.mjs` existent, mais leur passage n'a pas été démontré dans cet audit.

## 3. Non-conformités et risques

| Sévérité | Constat vérifié dans le code | Conséquence et mesure proposée |
|---|---|---|
| **P0** | `src/scene-resources.js` choisit `redesignedPlate(f.id)?.src || plateAsset(f.id)` indépendamment de `defaultOriginal`. | Des reconstructions schématiques ou sensibles s'affichent comme illustration principale dans le dossier 3D. Définir une fonction unique de priorité éditoriale, puis tester toutes les vues avant correction. |
| **P0** | `src/research-illustrations.js` injecte systématiquement `art.src` pour tous les IDs redessinés. | La monographie peut afficher une esquisse non validée de la même façon qu'une reconstruction détaillée. Prévoir statut et avertissement visibles. |
| **P0** | Le corpus de cours interne repose essentiellement sur la séance « Vers des matériaux hybrides vivants » du **18 février 2020**. | Les 53 cours individuels et la leçon inaugurale ne disposent pas d'une structure documentaire comparable. Reconstituer en priorité la chronologie officielle. |
| **P1** | 38 ressources internationales ont une URL mais aucune relation explicite vers ID concept/figure/scène/leçon dans leur JSON. | Toute liaison automatisée actuelle serait inférée et non prouvée. Construire des arêtes candidates et les valider une par une. |
| **P1** | 4 DOI du catalogue sont exprimés comme URL de ressource, sans champs bibliographiques normalisés. | Contrôles auteurs, revue, année et statut OA impossibles sans enrichissement métadonnées. |
| **P1** | `redesigned-plates.js` distingue constructions vectorielles et détaillées, mais conserve des statuts éditoriaux nécessitant une vérification, notamment les titres intégrés des figures 01 et 07. | Définir une grille de validation illustration/source ; aucune substitution silencieuse. |
| **P1** | Les validations existantes testent surtout IDs, cardinalités, liens de scènes et fichiers. | Ajouter tests des URL internes, liens source, licences, schémas, provenance, modes de lecture, navigation mobile, i18n et affichage de source primaire. |
| **P2** | Plusieurs feuilles CSS de direction graphique coexistent et sont chargées via différents points d'entrée. | Évaluer cascade réelle et cohérence sur l'ensemble des pages avant toute refonte. |
| **P2** | Le JSON international rassemble institutions, laboratoires, API, outils, vocabulaire et publications. | Normaliser les types de ressources sans perdre les catégories d'origine ni confondre une page de labo avec un résultat expérimental. |

Les correctifs antérieurement proposés sur `fix/chimie-plate-science-20261122` ne sont **pas fusionnés** dans `main`. Leur présence n'implique ni validation ni adoption. Le présent document ne modifie aucun fichier fonctionnel.

## 4. Programme officiel : base de vérité historique

**Page officielle des enseignements :**  
https://www.college-de-france.fr/fr/chaire/clement-sanchez-chimie-des-materiaux-hybrides-chaire-statutaire/events

Le catalogue recense 10 entrées de cycles « cours », dont **une année 2017–2018 sans cours statutaire**, soit 9 séries actives totalisant **53 séances de cours** ; le catalogue audiovisuel recense en outre 1 leçon inaugurale, 25 entrées de séminaire, 70 interventions de colloques et 11 interventions de conférenciers invités au sein de ses 160 résultats (attention : types de notices et intervenants distincts).

- 2010–2011 — Une courte histoire des matériaux hybrides — **5 cours** + inaugurale séparée.
- 2011–2012 — Chimie douce et polymères — **6 cours**.
- 2012–2013 — Chimie mésoscopique — **6 cours**.
- 2013–2014 — Interfaces I — **6 cours**.
- 2014–2015 — Interfaces II — **6 cours**.
- 2015–2016 — Interfaces III — **6 cours**.
- 2016–2017 — Carbones et matériaux carbonés — **6 cours**.
- 2017–2018 — **pas d'enseignement statutaire** ; attention aux séminaires invités présents dans le catalogue.
- 2018–2019 — Matériaux poreux — **6 cours**.
- 2019–2020 — Chimie douce 2020 — **6 cours**.

Catalogue médias : https://www.college-de-france.fr/fr/audios-videos?f%5B0%5D=chair%3A3496  
Leçon inaugurale : https://www.college-de-france.fr/fr/agenda/lecon-inaugurale/chimie-des-materiaux-hybrides/chimie-des-materiaux-hybrides  
Synthèses officielles : https://www.college-de-france.fr/fr/chaire/clement-sanchez-chimie-des-materiaux-hybrides-chaire-statutaire/annual-summaries

**Point fondamental :** les 70 planches existantes décrivent le cours « Vers des matériaux hybrides vivants » du 18 février 2020, cinquième séance du cycle 2019–2020 ; elles ne décrivent pas à elles seules les autres 52 cours. L'inaugurale du **10 février 2011** doit être la porte d'entrée intellectuelle du portail, sans être confondue avec une séance du cycle 2020.

## 5. Clément Sanchez : sources canoniques identifiées

- Chaire : https://www.college-de-france.fr/fr/chaire/clement-sanchez-chimie-des-materiaux-hybrides-chaire-statutaire
- Biographie institutionnelle, CV, bibliographie à télécharger : https://www.college-de-france.fr/fr/chaire/clement-sanchez-chimie-des-materiaux-hybrides-chaire-statutaire/biography
- Enseignements : https://www.college-de-france.fr/fr/chaire/clement-sanchez-chimie-des-materiaux-hybrides-chaire-statutaire/events
- Vidéographie officielle : https://www.college-de-france.fr/fr/audios-videos?f%5B0%5D=chair%3A3496
- Résumés annuels : https://www.college-de-france.fr/fr/chaire/clement-sanchez-chimie-des-materiaux-hybrides-chaire-statutaire/annual-summaries

La page biographique est identifiable ; la bibliographie complète (PDF officiel et publications récentes) et le CV restent **à transcrire/contrôler**. Aucune exhaustivité bibliographique n'est revendiquée. Les interventions de colloques faites par des invités ne sont pas automatiquement attribuées à Sanchez.

## 6. Catalogue international : état contrôlé

Fichier primaire : `ressources/international/ressources_chimie_douce.json`. **38 enregistrements** ; 38 URLs, 38 statuts déclaratifs de droits et 38 identifiants uniques. Répartition : Japon 13, Chine 4, États-Unis 5, Suisse 3, Europe 3, International 10. **38/38 sans relations explicites vers notions/planches/scènes/leçons** ; **4 URLs DOI**, **36 champs `notes` vides**. L'ensemble ne constitue pas une bibliographie primaire de 38 articles. L'absence de ressource d'origine institutionnelle `mit.edu` constitue une lacune.

**Compléments internationaux institutionnels candidats à vérifier avant intégration :**
- MIT Media Lab — Printing Living Materials : https://www.media.mit.edu/projects/printing-living-materials/overview/
- MIT Materials Research Laboratory — Complex Biogels : https://mrl.mit.edu/node/77
- Kyoto iCeMS — groupe Kitagawa et publications MOF : https://www.kitagawa.icems.kyoto-u.ac.jp/publication/
- NIMS — chercheur G. Hayase, sol–gel / matériaux poreux : https://samurai.nims.go.jp/profiles/hayase_gen?locale=en
- CAS — protocellules à membrane MOF, actualité de juin 2025 : https://english.cas.cn/newsroom/research_news/chem/202506/t20250623_1046005.shtml

Il s'agit d'**entrées candidates**, et non de correspondances scientifiquement démontrées avec Sanchez. Les droits des images MIT Media Lab sont explicitement réservés ; n'ajouter que liens et métadonnées en l'absence d'autorisation.

## 7. Modèle documentaire de référence (proposition, non implémentée)

Entités : `person`, `institution`, `teaching_cycle`, `lecture`, `seminar`, `colloquium`, `publication`, `media`, `concept`, `figure`, `scene`, `experiment`, `research_resource`, `claim`, `rights_record`.

Règle pour chaque arête : `source_id`, `target_id`, `relation_type`, `evidence_url`, `evidence_locator`, `review_status`, `reviewer`, `review_date`. Types suggérés : `cites`, `defines`, `illustrates`, `compares_with`, `precedes`, `extends`, `shares_method`, `related_topic_only`. Une similarité de thème n'autorise pas une relation causale ou historique.

**Une seule fiche, trois angles de lecture** (Recherche : méthode, données et limites ; Industrie : procédés, TRL et risques sourcés ; Grand public : explications et exemples vérifiés). Pas de chiffres industriels ou de TRL inventés.

## 8. Plan de passage (gates)

- **A — données** : vérifier individuellement les 38 liens, types, DOI, licences et métadonnées, compléter couverture MIT/Japon/Chine.
- **B — corpus** : inventaire des 53 séances avec titre, date, lien officiel, média, statut et provenance ; 1 inaugurale ; séminaires et colloques séparés. Annexer les résumés annuels.
- **C — connaissance** : schéma et arêtes sourcées avec niveau de confiance ; aucun lien forcé.
- **D — maquettes** : inaugurale, bio/biblio/vidéo, recherche internationale, une fiche à 3 lectures ; tester desktop + mobile.
- **E — implémentation** : PR séparées après décision explicite de validation du plan, avec migration, tests automatisés et recette visuelle, sans impact inattendu sur le site actif.

## 9. Critères de clôture de l'audit avant architecture validée

- Arborescence GitHub et versions figées, fichiers sources listés : **atteint**.
- Programmation de la chaire et ensemble des 53 cours : **structure et titres accessibles dans les 9 programmes officiels ; médias individuels non tous vérifiés**.
- Inventaire biographique/bibliographique/vidéographique exhaustif : **non atteint**.
- Vérification HTTP/licence/DOI de 38 ressources : **non atteinte**.
- Matrice de correspondances fondées sur des preuves (38 × concepts/cours) : **non atteinte**.
- Tests navigateur, accessibilité et non-régression : **non atteints**.
- Plan de structuration : **proposé**, soumis à validation après compléments.

## 10. Décision

**NE PAS FUSIONNER ET NE PAS PUBLIER.** Ce rapport est une pièce documentaire. Le plan directeur `PLAN_DIRECTEUR_CORPUS_INTERNATIONAL.md` détaille les choix encore à arbitrer. L'étape suivante, strictement en lecture seule pour le site, est la production de l'inventaire cours/séminaires et de la matrice de contrôle des 38 ressources.
