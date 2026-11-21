# Ingénierie du vivant — Chimie douce

Laboratoire scientifique 3D pédagogique conçu à partir du cours de Clément Sanchez, Collège de France, 18 février 2020.

Cinq mécanismes : morphogenèse végétale et dépôt minéral ; croissance du mycélium ; hydrolyse et condensation sol-gel ; encapsulation et transfert de solutés ; cristallisation MOF à la biointerface.

- Morphologies organiques procédurales : nervures végétales, phyllotaxie, réseaux d'hyphes, membranes et coques.
- Temps réduit τ ∈ [0,1], paramètres, chronologie, étapes de transformation, références primaires.
- Variables d'état issues d'équations affichées, graphes calculés, export CSV et capture PNG.
- Les modèles ne sont pas étalonnés sur les résultats de la conférence, ne constituent ni prédictions ni microscopies.
- Three.js r187 chargé depuis CDN, accès à Internet nécessaire.
- Test : `node tests/kinetics.test.mjs`.

## Audit scientifique du 21/11/2026

- Source primaire vérifiée pour la formation in vivo de MOFs chez les plantes : Richardson et Liang, *Small* (2018), DOI 10.1002/smll.201702958. La géométrie végétale ne représente pas la localisation mesurée des cristaux.
- Croissance fongique : le modèle logistique à capacité fixe est un outil phénoménologique ; absence de transport cytoplasmique, de croissance mécanique apicale et d’anastomose résolus.
- Sol–gel : réactions réduites séquentielles ; absence de pH, température, hydrolyse catalytique, spéciation et seuil de percolation.
- Encapsulation : ε^1,5 approxime une relation entre diffusivité effective et porosité ; sa division par une épaisseur définit ici un indice de conductance (non une perméabilité intrinsèque). Aucun couplage de viabilité ni consommation cellulaire.
- MOFs : X est un indice de transformation de type Avrami. Il n’est ni une mesure de cristallinité ni une fraction de surface couverte. Aucun mécanisme de nucléation-germination thermodynamique résolu.
- Tout temps τ et tout paramètre cinétique sont sans dimension et ne reproduisent aucune valeur expérimentale calibrée. Les schémas végétaux/mycéliens sont procéduraux et qualitatifs.

Références vérifiées :
- Richardson & Liang (2018), DOI 10.1002/smll.201702958, https://pubmed.ncbi.nlm.nih.gov/29168918/
- Liang et al. (2016), DOI 10.1002/adma.201602335, https://pubmed.ncbi.nlm.nih.gov/27414706/
- Sol–gel review (2016), DOI 10.1039/C5MH00260E, https://pubs.rsc.org/en/content/articlehtml/2016/mh/c5mh00260e
- Modelling of hyphal growth and branching (2023), https://pmc.ncbi.nlm.nih.gov/articles/PMC10213032/
- Bruggeman approximation and effective diffusivity (2021), https://pmc.ncbi.nlm.nih.gov/articles/PMC7914409/