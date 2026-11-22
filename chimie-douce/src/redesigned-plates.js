/* Non-interactive educational reconstructions. Original source slides are always retained. */
const SOURCE='Clément Sanchez — Collège de France, 18 février 2020';
const IDS=Object.freeze([7,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]);
const REDESIGNED=Object.freeze(Object.fromEntries(IDS.map(id=>[
  id,Object.freeze({
    src:new URL('../assets/atlas-redessine/planche-'+String(id).padStart(2,'0')+'.webp',import.meta.url).href,
    kind:'reconstruction',
    source:SOURCE,
    caution:'Illustration conceptuelle reconstruite ; ni micrographie, ni données expérimentales originales.'
  })
])));
export const redesignedPlate=id=>REDESIGNED[Number(id)]||null;
export const redesignedCount=()=>IDS.length;
export const redesignedIds=()=>IDS.slice();
