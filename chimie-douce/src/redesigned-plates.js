/* Non-interactive educational reconstructions. Original source slides are always retained. */
const SOURCE='Clément Sanchez — Collège de France, 18 février 2020';
const IDS=Object.freeze([7,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46]);
const LEGACY=Object.fromEntries(IDS.map(id=>[
  id,Object.freeze({
    src:new URL('../assets/atlas-redessine/planche-'+String(id).padStart(2,'0')+'.webp',import.meta.url).href,
    kind:'reconstruction',
    defaultOriginal:[37,39,43,44,45,46].includes(id),
    source:SOURCE,
    caution:id===42?'Transfert photoélectronique et synthèse d’acétate représentés conceptuellement : cette image ne constitue pas une mesure de flux ni une preuve directe du mécanisme.':id===43?'ATTENTION — Courbes générées à titre illustratif : leurs coordonnées, barres d’erreur et écarts ne correspondent à AUCUN jeu de données expérimentales vérifié. Pour les résultats réels, consulter la diapositive originale et la publication citée.':id===44?'Couche et épaisseur illustratives : les valeurs nanométriques dessinées, l’imagerie et la morphologie ne sont pas des mesures originales.':id===45?'La protection contre l’oxygène ne peut être affirmée pour toute coque MOF ; perméabilité à O₂, viabilité et maintien de la fonction requièrent des témoins expérimentaux.':id===46?'ATTENTION — Graphiques entièrement illustratifs : courbes, erreurs et observations ne sont PAS des résultats expérimentaux. La comparaison doit être réalisée à partir des figures sources et témoins publiés.':id===37?'Image entièrement illustrative : les barres d’échelle dessinées ne correspondent pas à des mesures de microscopie.':id===39?'Reconstruction d’une enzyme confinée dans un MOF : elle ne démontre pas la fonctionnalisation de coque enzyme–MOF présentée dans la source.':id===41?'Couplage CdS–bactérie présenté comme principe : ni transfert électronique ni production d’acétate ne sont démontrés par ce dessin.':'Illustration conceptuelle reconstruite ; ni micrographie, ni données expérimentales originales.'
  })
]));
/* Scientific vector edition, drawn on cream stock. All original slides remain available. */
const VECTOR_IDS=Object.freeze([1,2,3,4,5,6,8,9,10,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70]);
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
 55:'Localisation de nucléation MOF dans les tissus végétaux : hypothèse de mécanisme à confirmer.',
 56:'Carte cellulaire et végétale schématique : aucune fausse micrographie ou intensité mesurée.',
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
 defaultOriginal:[48,50,51,54,56,60,62,63,68].includes(id)
})]));
const REDESIGNED=Object.freeze({...LEGACY,...VECTOR});
export const redesignedPlate=id=>REDESIGNED[Number(id)]||null;
export const redesignedCount=()=>IDS.length+VECTOR_IDS.length;
export const redesignedIds=()=>[...IDS,...VECTOR_IDS].sort((a,b)=>a-b);
