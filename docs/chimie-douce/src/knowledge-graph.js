import {SCENES,SOURCES,VIDEO,videoAt} from './content.js';
import {FIGURES} from './figures.js';
export const SCENE_RESOURCE_MAP={
  "solgel": {
    "plates": [
      12,
      15,
      18
    ],
    "terms": [
      "solgel",
      "hydrolysis",
      "condensation",
      "gelation",
      "porosity"
    ]
  },
  "cell": {
    "plates": [
      2,
      3,
      10,
      20,
      65
    ],
    "terms": [
      "cellwall",
      "viability",
      "interface",
      "diffusion"
    ]
  },
  "encapsulation": {
    "plates": [
      11,
      12,
      13,
      14,
      16,
      17,
      18
    ],
    "terms": [
      "encapsulation",
      "diffusion",
      "porosity",
      "immunoisolation",
      "viability"
    ]
  },
  "mycelium": {
    "plates": [
      5,
      6
    ],
    "terms": [
      "mycelium",
      "hyphae",
      "biofabrication"
    ]
  },
  "concrete": {
    "plates": [
      7,
      8
    ],
    "terms": [
      "carbonation",
      "spores",
      "biomineralization"
    ]
  },
  "spore": {
    "plates": [
      9
    ],
    "terms": [
      "spores",
      "hygromorph"
    ]
  },
  "ldh": {
    "plates": [
      22,
      23,
      24
    ],
    "terms": [
      "ldh",
      "intercalation",
      "interface"
    ]
  },
  "foam": {
    "plates": [
      21,
      25,
      26,
      27
    ],
    "terms": [
      "hipe",
      "porosity",
      "diffusion"
    ]
  },
  "diatom": {
    "plates": [
      19,
      28,
      29
    ],
    "terms": [
      "diatom",
      "biomineralization",
      "porosity"
    ]
  },
  "photo": {
    "plates": [
      30,
      31,
      32,
      41,
      42,
      43
    ],
    "terms": [
      "photoelectron",
      "interface",
      "biomineralization"
    ]
  },
  "mof": {
    "plates": [
      33,
      34,
      35,
      55,
      56
    ],
    "terms": [
      "mof",
      "nucleation",
      "ligand"
    ]
  },
  "zif": {
    "plates": [
      35,
      36,
      37,
      38,
      39,
      40
    ],
    "terms": [
      "zif8",
      "mof",
      "nucleation",
      "encapsulation",
      "diffusion"
    ]
  },
  "shield": {
    "plates": [
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      66,
      67,
      68
    ],
    "terms": [
      "shield",
      "interface",
      "viability"
    ]
  },
  "cryo": {
    "plates": [
      53,
      54
    ],
    "terms": [
      "cryoprotection",
      "encapsulation",
      "viability"
    ]
  },
  "print": {
    "plates": [
      57,
      59,
      60
    ],
    "terms": [
      "bioprinting",
      "bioink",
      "biofabrication"
    ]
  },
  "fuel": {
    "plates": [
      61,
      62,
      63
    ],
    "terms": [
      "microbialfuel",
      "biofilm",
      "electrontransfer"
    ]
  },
  "cellulose": {
    "plates": [
      58,
      59,
      60,
      64
    ],
    "terms": [
      "cellulose",
      "nanofiber",
      "bioprinting",
      "thermoelectric",
      "biofabrication"
    ]
  },
  "structure": {
    "plates": [
      33,
      34
    ],
    "terms": [
      "mof",
      "crystallography",
      "ligand"
    ]
  }
};
export const CONCEPTS=[
  {
    "id": "solgel",
    "label": "Sol–gel",
    "simple": "Voie de synthèse douce qui transforme un système de précurseurs réactifs en un réseau inorganique ou hybride.",
    "detail": "Les réactions d’hydrolyse et de condensation conduisent à des espèces oligomères, puis à une connectivité croissante. Le chemin réel dépend du pH, des ligands et de la composition.",
    "scene": "solgel"
  },
  {
    "id": "hydrolysis",
    "label": "Hydrolyse",
    "simple": "Réaction avec l’eau qui transforme certains groupes des précurseurs en groupes hydroxyle.",
    "detail": "Dans de nombreux systèmes alkoxydes métalliques, M–OR + H₂O → M–OH + ROH est une écriture simplifiée. Elle ne prédit pas une vitesse sans constantes et conditions.",
    "scene": "solgel"
  },
  {
    "id": "condensation",
    "label": "Condensation",
    "simple": "Formation d’une liaison entre espèces réactives avec élimination d’une petite molécule.",
    "detail": "La création de ponts M–O–M peut libérer H₂O ou ROH selon les groupes engagés. Le réseau simulé n’est qu’une illustration de connectivité.",
    "scene": "solgel"
  },
  {
    "id": "gelation",
    "label": "Gélification",
    "simple": "Formation d’un réseau connecté à l’échelle macroscopique immobilisant une phase fluide.",
    "detail": "Le seuil de gel dépend de la chimie, de la distribution des espèces et des conditions du milieu. Il ne doit pas être confondu avec l’apparition d’une simple liaison.",
    "scene": "solgel"
  },
  {
    "id": "porosity",
    "label": "Porosité",
    "simple": "Proportion de vides dans un matériau et organisation géométrique de ces vides.",
    "detail": "La taille, la connectivité et la distribution des pores conditionnent l’accès des solutés. La porosité n’est pas à elle seule une perméabilité mesurée.",
    "scene": "foam"
  },
  {
    "id": "diffusion",
    "label": "Diffusion",
    "simple": "Transport net d’espèces sous l’effet d’un gradient de potentiel chimique, souvent approché par un gradient de concentration.",
    "detail": "La loi de Fick est un cadre simple dans un milieu homogène ; l’encapsulation réclame souvent des coefficients effectifs et des effets d’interface.",
    "scene": "encapsulation"
  },
  {
    "id": "viability",
    "label": "Viabilité",
    "simple": "Capacité d’une cellule à rester vivante selon un critère expérimental défini.",
    "detail": "Viabilité, activité métabolique et capacité à former une colonie ne sont pas équivalentes ; une coloration unique ne renseigne pas tous ces états.",
    "scene": "cell"
  },
  {
    "id": "cellwall",
    "label": "Paroi cellulaire",
    "simple": "Structure périphérique de nombreuses cellules, distincte de la membrane plasmique.",
    "detail": "Sa chimie dépend de l’organisme : ne pas assimiler la paroi bactérienne à celle d’une cellule végétale, ni à une coque MOF fabriquée.",
    "scene": "cell"
  },
  {
    "id": "interface",
    "label": "Interface bio–minérale",
    "simple": "Région de contact entre une phase biologique et une phase minérale.",
    "detail": "Les charges de surface, l’hydratation, la rugosité et les ligands peuvent modifier nucléation et transport ; les seules images n’établissent pas le mécanisme.",
    "scene": "cell"
  },
  {
    "id": "encapsulation",
    "label": "Encapsulation",
    "simple": "Confinement d’une cellule, enzyme ou autre entité dans une matrice ou une coque.",
    "detail": "Le système doit concilier protection et échanges, tout en distinguant couche minérale, membrane biologique et espèces susceptibles de traverser.",
    "scene": "encapsulation"
  },
  {
    "id": "immunoisolation",
    "label": "Immuno-isolation",
    "simple": "Séparation sélective visant à protéger une entité biologique de certains composants du système immunitaire.",
    "detail": "Elle ne découle pas automatiquement d’une taille de pore affichée : sélectivité, réaction immunitaire et fonction cellulaire requièrent des essais.",
    "scene": "encapsulation"
  },
  {
    "id": "mycelium",
    "label": "Mycélium",
    "simple": "Ensemble des hyphes formant le réseau végétatif d’un champignon.",
    "detail": "Le réseau peut lier un substrat pendant la biofabrication ; un composite final séché peut ne plus contenir d’organisme actif.",
    "scene": "mycelium"
  },
  {
    "id": "hyphae",
    "label": "Hyphe",
    "simple": "Filament de croissance fongique pouvant s’allonger à son extrémité et former des ramifications.",
    "detail": "Les motifs de ramification visualisés ne constituent pas une simulation hydrodynamique ou biomécanique du réseau réel.",
    "scene": "mycelium"
  },
  {
    "id": "biofabrication",
    "label": "Biofabrication",
    "simple": "Fabrication d’une structure grâce à l’activité d’organismes ou de systèmes biologiques.",
    "detail": "Il faut distinguer matériau produit par le vivant, matériau qui reste vivant, et matériau fonctionnalisé ultérieurement.",
    "scene": "mycelium"
  },
  {
    "id": "carbonation",
    "label": "Précipitation de CaCO₃",
    "simple": "Formation de carbonate de calcium à partir d’espèces calciques et carbonatées dans des conditions favorables.",
    "detail": "Le colmatage d’une fissure n’établit pas à lui seul une restauration de résistance ni une étanchéité totale.",
    "scene": "concrete"
  },
  {
    "id": "spores",
    "label": "Spore bactérienne",
    "simple": "Forme de résistance produite par certaines bactéries, notamment des Bacillus.",
    "detail": "Les spores peuvent répondre à des variations d’humidité ; dans d’autres contextes leur germination intervient dans les procédés d’auto-réparation.",
    "scene": "spore"
  },
  {
    "id": "hygromorph",
    "label": "Actionnement hygroréactif",
    "simple": "Déformation mécanique provoquée par une variation d’humidité.",
    "detail": "Le couplage d’une couche active avec un support peut produire une courbure ; amplitude et travail mécanique doivent être mesurés.",
    "scene": "spore"
  },
  {
    "id": "ldh",
    "label": "Hydroxyde double lamellaire (HDL)",
    "simple": "Solide constitué de feuillets hydroxylés chargés positivement et d’espèces interfoliaires compensatrices.",
    "detail": "La substitution partielle de cations divalents par des trivalents crée une charge positive ; la structure précise dépend de la composition.",
    "scene": "ldh"
  },
  {
    "id": "intercalation",
    "label": "Intercalation",
    "simple": "Insertion d’ions ou de molécules dans l’espace entre couches d’un solide lamellaire.",
    "detail": "Un effet d’adsorption ou de libération contrôlée ne constitue pas en soi la preuve d’une biodégradation.",
    "scene": "ldh"
  },
  {
    "id": "hipe",
    "label": "Émulsion interne concentrée (HIPE)",
    "simple": "Émulsion dont la phase dispersée occupe une fraction volumique particulièrement élevée.",
    "detail": "Un procédé templé par HIPE peut produire une mousse à pores hiérarchisés ; géométrie et flux effectifs exigent une caractérisation.",
    "scene": "foam"
  },
  {
    "id": "diatom",
    "label": "Diatomée",
    "simple": "Microalgue photosynthétique dont l’enveloppe appelée frustule est riche en silice.",
    "detail": "La diversité des frustules rend trompeur un modèle géométrique unique ; la microscopie de référence doit rester visible.",
    "scene": "diatom"
  },
  {
    "id": "biomineralization",
    "label": "Biominéralisation",
    "simple": "Formation et organisation de phases minérales sous influence biologique.",
    "detail": "La présence d’un cristal près d’une cellule ne démontre pas nécessairement une synthèse intracellulaire ni sa voie mécanistique.",
    "scene": "diatom"
  },
  {
    "id": "photoelectron",
    "label": "Transfert photoélectronique",
    "simple": "Déplacement de charges après excitation par la lumière dans un système photoactif.",
    "detail": "Le couplage matériau semi-conducteur–métabolisme peut améliorer une conversion, mais les rendements nécessitent des mesures directes.",
    "scene": "photo"
  },
  {
    "id": "mof",
    "label": "Réseau métallo-organique (MOF)",
    "simple": "Matériau cristallin construit par coordination entre ions ou agrégats métalliques et ligands organiques.",
    "detail": "La porosité et la topologie résultent d’une structure cristalline mesurée ; les arêtes de la 3D ici sont idéalisées.",
    "scene": "mof"
  },
  {
    "id": "ligand",
    "label": "Ligand de coordination",
    "simple": "Espèce chimique qui se lie à un centre métallique par coordination.",
    "detail": "Les géométries exactes dépendent des centres, ligands, conditions de synthèse et résultats structuraux.",
    "scene": "mof"
  },
  {
    "id": "nucleation",
    "label": "Nucléation",
    "simple": "Formation d’embryons stables d’une nouvelle phase solide avant sa croissance.",
    "detail": "Une courbe de fraction transformée ne fournit pas directement le nombre, l’emplacement ou la morphologie des germes.",
    "scene": "zif"
  },
  {
    "id": "zif8",
    "label": "ZIF-8",
    "simple": "Framework zéolitique imidazolate à base de Zn²⁺ et de ligands 2-méthylimidazolate.",
    "detail": "Une coque ZIF-8 peut être formée autour de biomolécules ou cellules, mais son épaisseur, perméabilité et réponse biologique requièrent des mesures.",
    "scene": "zif"
  },
  {
    "id": "shield",
    "label": "Blindage nanoparticulaire",
    "simple": "Assemblage de nanoparticules à la surface d’une cellule ou autre entité.",
    "detail": "Il faut distinguer dépôt de surface, adhésion électrostatique, fonctionnalisation chimique et résultat biologique.",
    "scene": "shield"
  },
  {
    "id": "cryoprotection",
    "label": "Cryoprotection",
    "simple": "Stratégie visant à limiter les dommages associés à la congélation et à la décongélation.",
    "detail": "L’hémolyse ou la viabilité post-décongélation sont des mesures différentes d’une simple présence de glace sur l’image.",
    "scene": "cryo"
  },
  {
    "id": "bioprinting",
    "label": "Bio-impression 3D",
    "simple": "Dépôt spatialement contrôlé d’un matériau contenant des composants biologiques, parfois des cellules vivantes.",
    "detail": "Résolution, viabilité et propriétés mécaniques dépendent de la bio-encre, du procédé et de la réticulation.",
    "scene": "print"
  },
  {
    "id": "bioink",
    "label": "Bio-encre",
    "simple": "Formulation imprimable adaptée à la présence éventuelle d’éléments biologiques.",
    "detail": "La viscosité apparente, la rhéologie et les conditions de dépôt doivent être distinguées d’un rendu de simulation.",
    "scene": "print"
  },
  {
    "id": "cellulose",
    "label": "Cellulose bactérienne",
    "simple": "Polysaccharide fibreux extracellulaire produit par certaines bactéries.",
    "detail": "Son réseau de nanofibrilles peut être formé, assemblé ou fonctionnalisé pour produire des supports ; les propriétés dépendent des traitements et additifs.",
    "scene": "cellulose"
  },
  {
    "id": "nanofiber",
    "label": "Nanofibrille",
    "simple": "Fibre dont au moins une dimension transverse est nanométrique.",
    "detail": "Les propriétés d’un réseau de fibres dépendent notamment des liaisons, de l’orientation, de l’humidité et de la distribution dimensionnelle.",
    "scene": "cellulose"
  },
  {
    "id": "microbialfuel",
    "label": "Pile à combustible microbienne",
    "simple": "Dispositif bioélectrochimique exploitant le transfert d’électrons associé à l’activité microbienne.",
    "detail": "Distinguer fonctionnement conceptuel, tension à vide, puissance mesurée, résistances internes et traitement d’effluent.",
    "scene": "fuel"
  },
  {
    "id": "biofilm",
    "label": "Biofilm",
    "simple": "Communauté microbienne associée à une surface dans une matrice extracellulaire.",
    "detail": "Les transferts dans le biofilm affectent fonctionnement électrochimique et gradients locaux ; un dessin de surface ne suffit pas à le caractériser.",
    "scene": "fuel"
  },
  {
    "id": "electrontransfer",
    "label": "Transfert extracellulaire d’électrons",
    "simple": "Déplacement d’électrons entre microorganismes et surfaces ou espèces redox extérieures.",
    "detail": "Les voies directes et médiées diffèrent ; la scène représente un transfert conceptuel et non un bilan électronique calibré.",
    "scene": "fuel"
  },
  {
    "id": "thermoelectric",
    "label": "Effet thermoélectrique",
    "simple": "Couplage entre un gradient de température et la génération d’une différence de potentiel électrique.",
    "detail": "Un papier cellulose–nanotubes peut être un matériau de dispositif ; le coefficient Seebeck et la puissance doivent être mesurés.",
    "scene": "cellulose"
  },
  {
    "id": "crystallography",
    "label": "Cristallographie",
    "simple": "Étude de l’arrangement périodique des atomes dans un cristal.",
    "detail": "Un fichier CIF peut fournir une maille, des coordonnées et une symétrie ; un lecteur partiel ne reconstitue pas automatiquement tous les sites équivalents.",
    "scene": "structure"
  }
];
export const CONCEPT_PLATE_MAP={
  "solgel": [
    12,
    15,
    18
  ],
  "hydrolysis": [
    12,
    15
  ],
  "condensation": [
    12,
    15
  ],
  "gelation": [
    12,
    18
  ],
  "porosity": [
    21,
    25,
    26
  ],
  "diffusion": [
    25,
    40
  ],
  "viability": [
    12,
    18,
    38,
    46
  ],
  "cellwall": [
    2,
    3,
    10
  ],
  "interface": [
    3,
    11,
    47,
    67
  ],
  "encapsulation": [
    12,
    13,
    16,
    17,
    18
  ],
  "immunoisolation": [
    13,
    14,
    17
  ],
  "mycelium": [
    5,
    6
  ],
  "hyphae": [
    5,
    6
  ],
  "biofabrication": [
    5,
    57,
    58,
    59,
    60
  ],
  "carbonation": [
    7,
    8
  ],
  "spores": [
    8,
    9
  ],
  "hygromorph": [
    9
  ],
  "ldh": [
    22,
    23,
    24
  ],
  "intercalation": [
    22,
    23
  ],
  "hipe": [
    25,
    26,
    27
  ],
  "diatom": [
    19,
    28,
    29
  ],
  "biomineralization": [
    19,
    28,
    55,
    56
  ],
  "photoelectron": [
    41,
    42,
    43
  ],
  "mof": [
    33,
    34,
    35
  ],
  "ligand": [
    33,
    34,
    49
  ],
  "nucleation": [
    35,
    36,
    55,
    56
  ],
  "zif8": [
    36,
    37,
    38,
    39,
    40
  ],
  "shield": [
    44,
    47,
    48,
    50
  ],
  "cryoprotection": [
    53,
    54
  ],
  "bioprinting": [
    57,
    59,
    60
  ],
  "bioink": [
    59,
    60
  ],
  "cellulose": [
    58,
    59,
    60,
    64
  ],
  "nanofiber": [
    58,
    64
  ],
  "microbialfuel": [
    61,
    62,
    63
  ],
  "biofilm": [
    61,
    62
  ],
  "electrontransfer": [
    42,
    61,
    62
  ],
  "thermoelectric": [
    64
  ],
  "crystallography": [
    33,
    34
  ]
};
export const CONCEPT_BY_ID=Object.fromEntries(CONCEPTS.map(x=>[x.id,x]));
export const LECTURE_ONLY_PLATES=[1,4,69,70];
export const PLATE_BY_ID=Object.fromEntries(FIGURES.map(x=>[x.id,x]));
export function plateAsset(n){const id=Number(n);if(!Number.isInteger(id)||id<1||id>70)throw new Error('Identifiant planche invalide');return new URL('../assets/planches/fig-'+String(id).padStart(2,'0')+'.webp',import.meta.url).href}
export function sceneResources(sceneId){const s=SCENES.find(x=>x.id===sceneId);if(!s)return null;const links=SCENE_RESOURCE_MAP[sceneId]||{plates:[],terms:[]};return{scene:s,plates:links.plates.map(id=>PLATE_BY_ID[id]).filter(Boolean),concepts:links.terms.map(id=>CONCEPT_BY_ID[id]).filter(Boolean),sources:s.refs.map(id=>({...SOURCES[id],id})).filter(x=>x.name),chapters:[...new Set(links.plates.map(id=>PLATE_BY_ID[id]?.chapter).filter(Boolean))]}}
export function conceptRelations(id){const c=CONCEPT_BY_ID[id];if(!c)return null;return{...c,scene:SCENES.find(x=>x.id===c.scene),plates:(CONCEPT_PLATE_MAP[id]||[]).map(x=>PLATE_BY_ID[x]).filter(Boolean)}}
export function plateVideo(plate){return videoAt(plate.time)}
export function plateLink(id){return '../planches/?figure='+Number(id)}
