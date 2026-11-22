import {SCENES,videoAt} from './content.js';
import {FIGURES} from './figures.js';
import {sceneResources,plateAsset} from './knowledge-graph.js';
import {ensureConceptDialog,conceptButton} from './concept-ui.js';
import {translateTerm} from '../i18n.js';
import {redesignedPlate} from './redesigned-plates.js';
const tr=s=>translateTerm(s);
const el=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chapters=[...new Set(FIGURES.map(x=>x.chapter))];
const chapterId=ch=>chapters.indexOf(ch)+1;
let currentScene=null,activePlate=null;
function photo(f){
 const enhanced=redesignedPlate(f.id);
 const image=enhanced?.src||plateAsset(f.id);
 const heading=enhanced?'RECONSTRUCTION SCIENTIFIQUE · FIG. ':'ARCHIVE DU COURS · FIG. ';
 const original=enhanced?'<details class="source-original-access"><summary>VOIR LA DIAPOSITIVE ORIGINALE · SOURCE 2020</summary><a href="./planches/?figure='+f.id+'&view=original"><img src="'+plateAsset(f.id)+'" loading="lazy" alt="Diapositive originale du cours, figure '+f.id+'"></a><p>La source originale est conservée sans modification. La reconstruction ci-dessus n’est pas une mesure ni une micrographie.</p></details>':'';
 return '<figure class="source-original'+(enhanced?' source-enhanced':'')+'"><a href="./planches/?figure='+f.id+'" title="Ouvrir les deux versions de la planche"><img src="'+esc(image)+'" alt="'+(enhanced?'Reconstruction conceptuelle ':'Diapositive originale ')+f.id+' — '+esc(tr(f.title))+'" loading="lazy"><span class="original-seal">'+heading+String(f.id).padStart(2,'0')+'</span></a><figcaption><b>'+esc(tr(f.title))+'</b><p>'+esc(tr(f.note))+'</p><div class="source-credits">D’après le cours de Clément Sanchez · <a href="'+videoAt(f.time)+'" target="_blank" rel="noopener noreferrer">Vidéo à '+formatTime(f.time)+' ↗</a> · <a href="./planches/?figure='+f.id+'">Fiche canonique ↗</a></div>'+original+'</figcaption></figure>';
}
function formatTime(t){const s=Math.floor(t);return String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor(s%3600/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function setImage(id){
 const r=sceneResources(currentScene),f=r?.plates.find(f=>f.id===id);if(!f)return;
 activePlate=id;el('resourceOriginal').innerHTML=photo(f);
 const selector=el('resourcePlatePicker');
 selector.innerHTML=r.plates.filter(f=>f.id!==id).map(x=>'<button type="button" data-plate="'+x.id+'" aria-label="Afficher la planche '+x.id+'"><img src="'+esc(redesignedPlate(x.id)?.src||plateAsset(x.id))+'" loading="lazy" alt=""><span>'+String(x.id).padStart(2,'0')+'</span></button>').join('');
 selector.querySelectorAll('[data-plate]').forEach(b=>b.addEventListener('click',()=>setImage(Number(b.dataset.plate))));
 const entry=el('resourcePlateCount');if(entry)entry.textContent='Planche '+r.plates.findIndex(f=>f.id===id)+1+' / '+r.plates.length;
}
function render(id){
 const r=sceneResources(id);if(!r)return;
 currentScene=id;
 const scene=r.scene;
 el('resourceSceneTitle').textContent=tr(scene.title);
 el('resourceSceneSummary').textContent=tr(scene.intro);
 el('resourceSceneId').textContent='DOSSIER '+scene.n+' / 18';
 el('resourceConcepts').innerHTML=r.concepts.map(conceptButton).join('');
 el('resourceChapters').innerHTML=r.chapters.map(ch=>'<a href="./research/#chapitre-'+chapterId(ch)+'">CHAPITRE '+String(chapterId(ch)).padStart(2,'0')+' / '+esc(tr(ch))+' ↗</a>').join('');
 el('resourceReferences').innerHTML=r.sources.map(src=>'<a href="./bibliographie/?scene='+encodeURIComponent(id)+'&ref='+encodeURIComponent(src.id)+'"><span>'+esc(src.id)+'</span>'+esc(src.name)+' ↗</a>').join('');
 el('resourceExperiment').href='./#'+id;
 el('resourceTime').href=videoAt(scene.time);
 el('resourceTime').textContent='OUVRIR LE COURS À '+formatTime(scene.time)+' ↗';
 el('resourceGlossary').href='./notions/?scene='+encodeURIComponent(id);
 const f=r.plates[0];if(f)setImage(f.id);else{el('resourceOriginal').textContent='Pas de diapositive spécifique attribuée à cette scène.';el('resourcePlatePicker').replaceChildren()}
}
window.addEventListener('chimie:language',()=>{if(currentScene)render(currentScene)});
function init(){
 const lower=document.querySelector('.main .lower');if(!lower)return;
 const root=document.createElement('section');root.id='sceneResources';root.className='scene-resources';
 root.setAttribute('aria-label','Dossier scientifique unifié, sources originales, notions et expériences');
 root.innerHTML='<div class="resource-header"><span class="res-num" id="resourceSceneId">DOSSIER SCIENTIFIQUE</span><h2 id="resourceSceneTitle">Sources du cours</h2><p id="resourceSceneSummary"></p><div class="resource-actions"><a id="resourceExperiment" href="#laboratoire">◉ MANIPULER LE MODÈLE 3D</a><a id="resourceTime" target="_blank" rel="noopener noreferrer" href="#">▶ VOIR LE COURS</a><a id="resourceGlossary" href="./notions/">⌕ EXPLORER LES NOTIONS</a></div></div><div class="resource-grid"><div class="resource-observation"><div class="resource-section-title"><strong>01 / VOIR</strong><span id="resourcePlateCount"></span></div><div id="resourceOriginal" aria-live="polite"></div><div id="resourcePlatePicker" class="resource-plate-picker" aria-label="Autres planches originales du même dossier"></div></div><div class="resource-context"><div class="resource-section-title"><strong>02 / COMPRENDRE</strong><span>UNE SEULE SOURCE DOCUMENTAIRE</span></div><h3>Notions interactives</h3><div id="resourceConcepts" class="resource-concepts"></div><h3>Dans la monographie</h3><div id="resourceChapters" class="resource-links"></div><h3>Publications vérifiables</h3><div id="resourceReferences" class="resource-links resource-publications"></div><p class="resource-disclaimer">Documents originaux du cours et modèles pédagogiques indépendants : une correspondance thématique ne prouve ni une équivalence expérimentale ni une simulation validée. Les droits des diapositives demeurent ceux de leurs titulaires.</p></div></div>';
 lower.insertAdjacentElement('afterend',root);
 ensureConceptDialog();
 el('resourceExperiment').addEventListener('click',e=>{e.preventDefault();document.querySelector('.stage')?.scrollIntoView({behavior:'smooth',block:'center'})});
 const update=()=>{const id=location.hash.slice(1)||SCENES[0].id;if(id!==currentScene)render(id)};
 window.addEventListener('hashchange',update);
 window.addEventListener('atlas:navigate',update);
 update();
}
init();
