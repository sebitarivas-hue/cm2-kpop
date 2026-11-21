import {conceptRelations,plateAsset,plateVideo} from './knowledge-graph.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;':'&quot;'}[c]));
const base=new URL('../',import.meta.url);
const link=p=>new URL(p,base).href;
let dialog=null;
export function ensureConceptDialog(){
 if(dialog)return dialog;
 dialog=document.createElement('dialog');dialog.id='conceptDialog';dialog.className='concept-dialog';
 dialog.setAttribute('aria-label','Définition et expériences scientifiques associées');
 dialog.innerHTML='<div class="concept-dialog-top"><span>LEXIQUE VIVANT / CHIMIE DOUCE</span><button type="button" id="conceptClose" aria-label="Fermer la définition">×</button></div><div id="conceptDetail" class="concept-detail"></div>';
 document.body.append(dialog);
 dialog.querySelector('#conceptClose').onclick=()=>dialog.close();
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 document.addEventListener('click',e=>{const x=e.target.closest('[data-concept]');if(x){e.preventDefault();openConcept(x.dataset.concept)}});
 return dialog;
}
export function openConcept(id){
 const c=conceptRelations(id);if(!c)return;
 const d=ensureConceptDialog(),el=d.querySelector('#conceptDetail');
 const scene=c.scene;
 const figures=c.plates.slice(0,4).map(f=>'<a class="concept-plate" href="'+link('planches/?figure='+f.id)+'"><img src="'+plateAsset(f.id)+'" loading="lazy" alt="Planche originale '+f.id+' : '+esc(f.title)+'"><span>FIG. '+String(f.id).padStart(2,'0')+' · '+esc(f.title)+'</span></a>').join('');
 el.innerHTML='<span class="concept-eyebrow">NOTION / '+esc(c.id.toUpperCase())+'</span><h2>'+esc(c.label)+'</h2><p class="concept-simple">'+esc(c.simple)+'</p><h3>Le mécanisme et ses limites</h3><p>'+esc(c.detail)+'</p><h3>Source originale et expérimentation</h3><p>Le modèle est une reconstruction pédagogique. Les planches ci-dessous sont extraites du cours de Clément Sanchez, Collège de France, 18 février 2020.</p><div class="concept-actions"><a href="'+link('#'+scene.id)+'">◉ EXPÉRIMENTER EN 3D ↗</a><a href="'+link('notions/?notion='+encodeURIComponent(c.id))+'">⌕ FICHE CANONIQUE ↗</a><a href="'+link('bibliographie/?scene='+scene.id)+'">↗ PUBLICATIONS</a><a href="'+link('research/')+'">▤ MONOGRAPHIE</a></div><div class="concept-plates">'+figures+'</div>';
 if(!d.open)d.showModal();
}
export function conceptButton(c){return '<button type="button" class="concept-chip" data-concept="'+esc(c.id)+'" title="Lire la définition et voir les expériences">'+esc(c.label)+' <span>?</span></button>'}
