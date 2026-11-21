/* Les vignettes proviennent du même registre que les dossiers scientifiques. */
import {FIGURES} from './src/figures.js';
import {plateAsset} from './src/knowledge-graph.js';
const root=document.getElementById('discoveryChapters');
if(root){
 const chapters=[...new Set(FIGURES.map(f=>f.chapter))];
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');
 root.innerHTML=chapters.map((name,i)=>{
   const first=FIGURES.find(f=>f.chapter===name);
   if(!first)return '';
   return '<a class="discovery-chapter" href="./planches/?figure='+first.id+'" aria-label="Chapitre '+(i+1)+' : '+escape(name)+'"><img loading="lazy" src="'+plateAsset(first.id)+'" alt="Planche originale '+first.id+' : '+escape(first.title)+'"><div><small>CHAPITRE '+String(i+1).padStart(2,'0')+' · '+fmt(first.time)+'</small><strong>'+escape(name)+'</strong><span>VOIR LA PLANCHE SOURCE ↗</span></div></a>';
 }).join('');
}
