/* Non-interactive educational reconstructions. Original source slides are always retained. */
const SOURCE='Clément Sanchez — Collège de France, 18 février 2020';
const IDS=Object.freeze([7,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,51,53,54,55,56]);
const LEGACY=Object.fromEntries(IDS.map(id=>[
  id,Object.freeze({
    src:new URL('../assets/atlas-redessine/planche-'+String(id).padStart(2,'0')+'.webp',import.meta.url).href,
    kind:'reconstruction',
    defaultOriginal:[1,7,37,39,43,44,45,46].includes(id),
    source:SOURCE,
    caution:id===55?'Reconstruction conceptuelle de la synthèse de MOFs dans la plante : transport et nucléation localisée sont des mécanismes à vérifier, et les structures dessinées ne sont ni une cartographie chimique ni des mesures in vivo.':id===56?'Localisation des phases MOF figurée comme hypothèse dans les tissus, les parois et les compartiments végétaux : un signal de microscopie ne suffit pas à identifier un cristal, sa position subcellulaire ou sa distribution uniforme.':id===51?'Coupe anatomique et réponse force–déplacement conceptuelles ; le module apparent dépend de la géométrie de pointe, du chargement et du modèle de contact. La rigidité ne démontre pas la viabilité.':id===53?'Cryopréservation de globules rouges avec nanoparticules MOF de zirconium : cette image ne démontre ni la vitrification ni un rendement de récupération. Température et mécanismes repris conceptuellement du cours ; consulter les données expérimentales originales.':id===54?'Schéma pédagogique des MOFs de zirconium, de l’hémolyse et de la récupération après décongélation : les graphiques sont intentionnellement vides et ne reproduisent aucune valeur. Consulter la diapositive et la publication d’origine pour toute comparaison quantitative.':id===42?'Transfert photoélectronique et synthèse d’acétate représentés conceptuellement : cette image ne constitue pas une mesure de flux ni une preuve directe du mécanisme.':id===43?'ATTENTION — Courbes générées à titre illustratif : leurs coordonnées, barres d’erreur et écarts ne correspondent à AUCUN jeu de données expérimentales vérifié. Pour les résultats réels, consulter la diapositive originale et la publication citée.':id===44?'Couche et épaisseur illustratives : les valeurs nanométriques dessinées, l’imagerie et la morphologie ne sont pas des mesures originales.':id===45?'La protection contre l’oxygène ne peut être affirmée pour toute coque MOF ; perméabilité à O₂, viabilité et maintien de la fonction requièrent des témoins expérimentaux.':id===46?'ATTENTION — Graphiques entièrement illustratifs : courbes, erreurs et observations ne sont PAS des résultats expérimentaux. La comparaison doit être réalisée à partir des figures sources et témoins publiés.':id===37?'Image entièrement illustrative : les barres d’échelle dessinées ne correspondent pas à des mesures de microscopie.':id===39?'Reconstruction d’une enzyme confinée dans un MOF : elle ne démontre pas la fonctionnalisation de coque enzyme–MOF présentée dans la source.':id===41?'Couplage CdS–bactérie présenté comme principe : ni transfert électronique ni production d’acétate ne sont démontrés par ce dessin.':'Illustration conceptuelle reconstruite ; ni micrographie, ni données expérimentales originales.'
  })
]));
/* Scientific vector edition, drawn on cream stock. All original slides remain available. */
const VECTOR_IDS=Object.freeze([1,2,3,4,5,6,8,9,10,47,48,49,50,52,57,58,59,60,61,62,63,64,65,66,67,68,69,70]);
const VECTOR_NOTES=Object.freeze({
 1:'Carte du cours : illustration conceptuelle sans hiérarchie expérimentale.',
 2:'Bactéries, archées et eucaryotes sont distincts ; la diversité biologique est schématisée.',
 3:'Enveloppes et échanges représentés à titre explicatif, sans perméabilité mesurée.',
 4:'Façade végétalisée schématique : aucune économie d’énergie ou performance chiffrée.',
 5:'Mycélium : la croissance précède l’inactivation éventuelle du matériau fini.',
 6:'Objets mycéliens illustratifs : propriétés mécaniques non déterminées.',
 8:'Béton autocicatrisant : schéma sans résistance ni fermeture de fissure mesurées.',
 9:'Actionnement hygroscopique schématique : amplitude et force non mesurées.',
 10:'Matrice protectrice conceptuelle : tolérance cellulaire et immunoprotection non établies.',
 47:'Couche de nanoparticules autour de cellules HeLa représentée à titre conceptuel.',
 48:'Sondes et ciblage : les réponses optiques et sélectivités requièrent des témoins expérimentaux.',
 49:'Liaison chimique et rendement de greffage sont des propriétés distinctes.',
 50:'Aucune mesure de stabilité ou de viabilité reproduite ; consulter les courbes sources.',
 51:'Nanoindentation de système cellule–coque : aucune dureté ni valeur de module mesurées reproduites.',
 52:'Assemblage multifonctionnel conceptuel : les fonctions biologiques sont à caractériser séparément.',
 53:'Schéma de cryopréservation sans valeurs de température ni rendement biologique déduits.',
 54:'Hémolyse et récupération illustrées sans courbes ni pourcentages expérimentaux fictifs.',

 57:'Schémas de procédés : les contraintes imposées aux cellules diffèrent selon la technique.',
 58:'Fibrilles et membrane cellulosique représentées sans données quantitatives de pureté.',
 59:'Le dépôt bio-imprimé ne prouve pas la viabilité ni la fonction biologique.',
 60:'Démonstrateurs conceptuels ; aucune preuve de compatibilité médicale ou d’implantation.',
 61:'Pile microbienne : schéma conceptuel, sans puissance ni rendement mesurés.',
 62:'Effluent et réacteur schématiques ; une tension isolée ne permet aucun bilan énergétique.',
 63:'Traitement d’effluents conceptuel ; absence de débit et de charge mesurés.',
 64:'Réseau cellulose–nanotubes schématique ; aucune valeur de coefficient Seebeck ou de puissance.',
 65:'Surface bioactive conceptuelle ; aucune mesure de dégradation ni de durabilité.',
 66:'Bactéries attachées à la surface externe des zéolithes, non à l’intérieur des micropores moléculaires.',
 67:'Charges représentées comme états possibles ; elles dépendent du pH et de la force ionique.',
 68:'Association E. coli–zéolithe illustrative, non micrographie ni mesure de rendement.',
 69:'Schéma intégratif de synthèse, sans démonstration de performance multi-fonctionnelle.',
 70:'Perspectives conceptuelles : sécurité, impact et industrialisation requièrent vérification.'
});
const VECTOR=Object.fromEntries(VECTOR_IDS.map(id=>[id,Object.freeze({
 src:new URL('../assets/atlas-redessine/planche-'+String(id).padStart(2,'0')+(id===1?'.webp':'.svg'),import.meta.url).href,
 kind:'reconstruction',
 source:SOURCE,
 caution:VECTOR_NOTES[id],
 defaultOriginal:true
})]));
/* Source-checked high-resolution illustration replacements supersede schematic vectors. */
const REVIEWED=Object.freeze({
 52:Object.freeze({
  src:new URL('../assets/atlas-redessine/planche-52.webp',import.meta.url).href,
  kind:'reconstruction',
  source:SOURCE,
  caution:'Reconstruction conceptuelle : les matériaux MIL-100(Fe), UiO-66, Fe₃O₄, silices mésoporeuses et MET-3 doivent être vérifiés séparément dans la source ; aucune activité simultanée ou biocompatibilité in vivo n’est établie par ce dessin.',
  defaultOriginal:false
 })
});
const REDESIGNED=Object.freeze({...LEGACY,...VECTOR,...REVIEWED});
export const redesignedPlate=id=>REDESIGNED[Number(id)]||null;
export const redesignedCount=()=>new Set([...IDS,...VECTOR_IDS,...Object.keys(REVIEWED).map(Number)]).size;
/* Presence does not mean art-direction approval: precise progress categories. */
export const detailedPlateCount=()=>new Set([...IDS,...Object.keys(REVIEWED).map(Number)]).size;
export const schematicPlateCount=()=>VECTOR_IDS.filter(id=>!REVIEWED[id]).length;
export const editorialPlateStatus=id=>([1,7].includes(Number(id))?'titre intégré à corriger':REVIEWED[id]?'illustration détaillée disponible':VECTOR_IDS.includes(Number(id))?'reconstruction schématique à reprendre':'illustration détaillée disponible');
export const redesignedIds=()=>[...IDS,...VECTOR_IDS].sort((a,b)=>a-b);
