// Sources photographiques : Wikimedia Commons, licences explicites, observations distinctes des modèles.
export const ORGANIC_IMAGES=[
  {
    "key": "vegetal",
    "title": "Nervures végétales",
    "subtitle": "Photographie macroscopique d’un limbe de feuille",
    "file": "Green leaf vein.jpg",
    "author": "Star61",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "caption": "Réseau naturel de nervures et tissus foliaires ; cette photographie ne montre ni MOF ni dépôt minéral.",
    "mechanism": "Les ramifications de la plante 3D représentent une architecture végétale générale. Le modèle temporel exprime la disponibilité des précurseurs et un dépôt hypothétique, pas la localisation observée des minéraux.",
    "source": "https://commons.wikimedia.org/wiki/File:Green_leaf_vein.jpg",
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Green_leaf_vein.jpg?width=1100"
  },
  {
    "key": "mycelium",
    "title": "Hyphes de mycélium",
    "subtitle": "Microscopie de fluorescence · Podospora anserina",
    "file": "Mycelium.JPG",
    "author": "Christian Scheckhuber",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "caption": "Hyphes de Podospora anserina colorées au JC-1 ; le signal décrit le marquage du métabolisme, pas une mesure de croissance spatiale.",
    "mechanism": "La 3D explicite l’extension apicale et les ramifications. La loi logistique pilote une couverture pédagogique, sans simulation du turgor, des gradients internes ni des interactions entre hyphes.",
    "source": "https://commons.wikimedia.org/wiki/File:Mycelium.JPG",
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Mycelium.JPG?width=1100"
  },
  {
    "key": "solgel",
    "title": "Silice mésoporeuse",
    "subtitle": "Microscopie électronique à balayage · nanoparticules",
    "file": "Mesoporous silica SEM.jpg",
    "author": "Groupe de Victor Lin · Iowa State University",
    "license": "Domaine public",
    "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
    "caption": "Morphologie de nanoparticules de silice mésoporeuse. L’image est un exemple d’architecture finale et ne documente pas directement la cinétique sol–gel.",
    "mechanism": "La scène visualise deux variables réduites : hydrolyse des précurseurs puis condensation. Elle ne prédit ni le diamètre des pores ni le moment réel de gélification.",
    "source": "https://commons.wikimedia.org/wiki/File:Mesoporous_silica_SEM.jpg",
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Mesoporous_silica_SEM.jpg?width=1100"
  },
  {
    "key": "encapsulation",
    "title": "Bactéries vivantes : l’interface",
    "subtitle": "Micrographie électronique · Escherichia coli",
    "file": "Escherichia coli electron microscopy.jpg",
    "author": "Janice Haney Carr",
    "license": "Domaine public",
    "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
    "caption": "Morphologie réelle de cellules d’E. coli. Ce spécimen n’est pas encapsulé : il sert uniquement à situer l’échelle et la forme de la cellule.",
    "mechanism": "La 3D ajoute une coque minérale purement schématique et fait varier un indice de conductance de transfert. Aucune survie bactérienne n’est prédite.",
    "source": "https://commons.wikimedia.org/wiki/File:Escherichia_coli_electron_microscopy.jpg",
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/Escherichia_coli_electron_microscopy.jpg?width=1100"
  },
  {
    "key": "mof",
    "title": "Cristallites de MOF",
    "subtitle": "Microscopie électronique · MOF autour d’un germe",
    "file": "CSIRO ScienceImage 11684 Scanning electron microscope image of the seed inside the MOF crystals.jpg",
    "author": "Dr Paolo Falcaro & Dr Dario Buso · CSIRO",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "caption": "Image de germes dans des cristaux de MOF ; ce n’est pas une micrographie d’exosquelette cellulaire ZIF-8.",
    "mechanism": "Le modèle 3D distingue amorçage et croissance d’une enveloppe conceptuelle. La courbe d’Avrami n’est pas étalonnée sur la micrographie ci-contre.",
    "source": "https://commons.wikimedia.org/wiki/File:CSIRO_ScienceImage_11684_Scanning_electron_microscope_image_of_the_seed_inside_the_MOF_crystals.jpg",
    "src": "https://commons.wikimedia.org/wiki/Special:FilePath/CSIRO_ScienceImage_11684_Scanning_electron_microscope_image_of_the_seed_inside_the_MOF_crystals.jpg?width=1100"
  }
];
export function getOrganicImage(id){return ORGANIC_IMAGES.find(x=>x.key===id) || ORGANIC_IMAGES[0]}
