import {CONCEPTS,sceneResources} from '../src/knowledge-graph.js';import {ensureConceptDialog,openConcept} from '../src/concept-ui.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const input=document.getElementById('notionSearch'),grid=document.getElementById('notionGrid'),count=document.getElementById('notionCount');
ensureConceptDialog();
const params=new URLSearchParams(location.search),scene=params.get('scene');
if(scene){const set=new Set(sceneResources(scene)?.concepts.map(c=>c.id)||[]);if(set.size){input.placeholder='Notions liées à cette scène ; effacer pour toutes les notions';}}
function update(){
 const q=input.value.trim().toLocaleLowerCase('fr');
 const arr=CONCEPTS.filter(c=>(!scene||sceneResources(scene)?.concepts.some(x=>x.id===c.id))&&(!q||(c.label+' '+c.simple+' '+c.detail).toLocaleLowerCase('fr').includes(q)));
 count.textContent=arr.length+' / '+CONCEPTS.length+' NOTIONS';
 grid.innerHTML=arr.map((c,i)=>'<article class="notion-card" id="notion-'+esc(c.id)+'"><span class="number">NOTION '+String(CONCEPTS.indexOf(c)+1).padStart(2,'0')+' / '+CONCEPTS.length+'</span><h2>'+esc(c.label)+'</h2><p>'+esc(c.simple)+'</p><div class="notion-card-actions"><button type="button" data-concept="'+esc(c.id)+'">COMPRENDRE ↗</button><a href="../#'+esc(c.scene)+'">MANIPULER EN 3D ↗</a></div></article>').join('');
 if(!arr.length)grid.textContent='Aucune notion trouvée. Essayez une autre recherche.';
}
input.addEventListener('input',update);update();
const id=params.get('notion');if(id&&CONCEPTS.some(x=>x.id===id))requestAnimationFrame(()=>openConcept(id));
