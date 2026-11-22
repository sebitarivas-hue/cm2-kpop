import {conceptRelations,plateAsset} from './knowledge-graph.js';
import {FIGURES} from './figures.js';
import {redesignedPlate} from './redesigned-plates.js';
import {translateTerm} from '../i18n.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base=new URL('../',import.meta.url);
const link=p=>new URL(p,base).href;
let dialog=null,activeConcept=null;
const L=s=>translateTerm(s);
export function ensureConceptDialog(){
 if(dialog)return dialog;
 dialog=document.createElement('dialog');dialog.id='conceptDialog';dialog.className='concept-dialog';
 dialog.setAttribute('aria-label',L('Définition et expériences scientifiques associées'));
 dialog.innerHTML='<div class="concept-dialog-top"><span>LEXIQUE VIVANT / CHIMIE DOUCE</span><button type="button" id="conceptClose" aria-label="Fermer la définition">×</button></div><div id="conceptDetail" class="concept-detail"></div>';
 document.body.append(dialog);
 dialog.querySelector('#conceptClose').onclick=()=>dialog.close();
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 document.addEventListener('click',e=>{const x=e.target.closest('[data-concept]');if(x){e.preventDefault();openConcept(x.dataset.concept)}});
 window.addEventListener('chimie:language',()=>{if(dialog){dialog.querySelector('.concept-dialog-top span').textContent=L('LEXIQUE VIVANT / CHIMIE DOUCE');dialog.querySelector('#conceptClose').setAttribute('aria-label',L('Fermer la définition'));if(dialog.open&&activeConcept)openConcept(activeConcept)}});
 return dialog;
}
export function openConcept(id){
 const c=conceptRelations(id);if(!c)return;activeConcept=id;
 const d=ensureConceptDialog(),el=d.querySelector('#conceptDetail');
 const scene=c.scene;
 const chapters=[...new Set(FIGURES.map(x=>x.chapter))];const chapter=chapters.indexOf(c.plates[0]?.chapter)+1;
 const figures=c.plates.slice(0,4).map(f=>{const art=redesignedPlate(f.id);return '<a class="concept-plate" href="'+link('planches/?figure='+f.id)+'"><img src="'+esc(art?.src||plateAsset(f.id))+'" loading="lazy" alt="'+esc(art?'Reconstruction conceptuelle':'Diapositive originale')+' '+f.id+' : '+esc(L(f.title))+'"><span>FIG. '+String(f.id).padStart(2,'0')+' · '+esc(L(f.title))+(art?' · ILLUSTRATION + SOURCE':'')+'</span></a>'}).join('');
 el.innerHTML='<span class="concept-eyebrow">'+esc(L('NOTION'))+' / '+esc(c.id.toUpperCase())+'</span><h2>'+esc(L(c.label))+'</h2><p class="concept-simple">'+esc(L(c.simple))+'</p><h3>'+esc(L('Le mécanisme et ses limites'))+'</h3><p>'+esc(L(c.detail))+'</p><h3>'+esc(L('Source originale et expérimentation'))+'</h3><p>'+esc(L('Le modèle est une reconstruction pédagogique. Les planches ci-dessous sont extraites du cours de Clément Sanchez, Collège de France, 18 février 2020.'))+'</p><div class="concept-actions"><a href="'+link('#'+scene.id)+'" >'+esc(L('◉ EXPÉRIMENTER EN 3D ↗'))+'</a><a href="'+link('notions/?notion='+encodeURIComponent(c.id))+'" >'+esc(L('⌕ FICHE CANONIQUE ↗'))+'</a><a href="'+link('bibliographie/?scene='+scene.id)+'" >'+esc(L('↗ PUBLICATIONS'))+'</a><a href="'+link('research/#chapitre-'+(chapter>0?chapter:1))+'" >'+esc(L('▤ CHAPITRE DU COURS'))+'</a></div><div class="concept-plates">'+figures+'</div>';
 if(!d.open)d.showModal();
}
export function conceptButton(c){return '<button type="button" class="concept-chip" data-concept="'+esc(c.id)+'" title="'+esc(L('Lire la définition et voir les expériences'))+'">'+esc(L(c.label))+' <span>?</span></button>'}
