/* Non-interactive educational reconstructions. Original source slides are always retained. */
const SOURCE='Clément Sanchez — Collège de France, 18 février 2020';
const IDS=Object.freeze([7,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46]);
const LEGACY=Object.fromEntries(IDS.map(id=>[
  id,Object.freeze({
    src:new URL('../assets/atlas-redessine/planche-'+String(id).padStart(2,'0')+'.webp',import.meta.url).href,
    kind:'reconstruction',
    defaultOriginal:id===43||id===46,
    source:SOURCE,
    caution:id===42?'Transfert photoélectronique et synthèse d’acétate représentés conceptuellement : cette image ne constitue pas une mesure de flux ni une preuve directe du mécanisme.':id===43?'ATTENTION — Courbes générées à titre illustratif : leurs coordonnées, barres d’erreur et écarts ne correspondent à AUCUN jeu de données expérimentales vérifié. Pour les résultats réels, consulter la diapositive originale et la publication citée.':id===44?'Couche et épaisseur illustratives : les valeurs nanométriques dessinées, l’imagerie et la morphologie ne sont pas des mesures originales.':id===45?'La protection contre l’oxygène ne peut être affirmée pour toute coque MOF ; perméabilité à O₂, viabilité et maintien de la fonction requièrent des témoins expérimentaux.':id===46?'ATTENTION — Graphiques entièrement illustratifs : courbes, erreurs et observations ne sont PAS des résultats expérimentaux. La comparaison doit être réalisée à partir des figures sources et témoins publiés.':id===37?'Image entièrement illustrative : les barres d’échelle dessinées ne correspondent pas à des mesures de microscopie.':id===39?'Reconstruction d’une enzyme confinée dans un MOF : elle ne démontre pas la fonctionnalisation de coque enzyme–MOF présentée dans la source.':id===41?'Couplage CdS–bactérie présenté comme principe : ni transfert électronique ni production d’acétate ne sont démontrés par ce dessin.':'Illustration conceptuelle reconstruite ; ni micrographie, ni données expérimentales originales.'
  })
]));
/* Scientific vector edition, drawn on cream stock. All original slides remain available. */
const VECTOR_IDS=Object.freeze([52,53,54,55,56]);
const VECTOR_NOTES=Object.freeze({
 52:'Assemblage multifonctionnel conceptuel : les fonctions biologiques sont à caractériser séparément.',
 53:'Schéma de cryopréservation sans valeurs de température ni rendement biologique déduits.',
 54:'Hémolyse et récupération illustrées sans courbes ni pourcentages expérimentaux fictifs.',
 55:'Localisation de nucléation MOF dans les tissus végétaux : hypothèse de mécanisme à confirmer.',
 56:'Carte cellulaire et végétale schématique : aucune fausse micrographie ou intensité mesurée.'
});
const VECTOR=Object.fromEntries(VECTOR_IDS.map(id=>[id,Object.freeze({
 src:new URL('../assets/atlas-redessine/planche-'+String(id).padStart(2,'0')+'.svg',import.meta.url).href,
 kind:'reconstruction',
 source:SOURCE,
 caution:VECTOR_NOTES[id],
 defaultOriginal:id===54||id===56
})]));
const REDESIGNED=Object.freeze({...LEGACY,...VECTOR});
export const redesignedPlate=id=>REDESIGNED[Number(id)]||null;
export const redesignedCount=()=>IDS.length+VECTOR_IDS.length;
export const redesignedIds=()=>[...IDS,...VECTOR_IDS].sort((a,b)=>a-b);
