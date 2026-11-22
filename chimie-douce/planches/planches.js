import {FIGURES} from '../src/figures.js';
import {SCENES,videoAt} from '../src/content.js';
import {SCENE_RESOURCE_MAP} from '../src/knowledge-graph.js';
import {plateAsset} from '../src/knowledge-graph.js';
import {redesignedPlate,redesignedCount} from '../src/redesigned-plates.js';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const scientificReview=Object.freeze({
 32:'Cultures d’algues : distinguer croissance, productivité, transfert du CO₂, distribution de lumière et contraintes de changement d’échelle. Les architectures illustrées ne démontrent aucune performance mesurée.',
 33:'MOFs : la topologie d’un réseau résulte du choix de nœuds de coordination et de ligands. L’analogie d’échafaudage est structurale ; elle ne constitue pas une structure cristallographique déterminée.',
 34:'Chimie réticulaire : comparer composition, connectivité et géométrie des pores sans assimiler toutes les familles de MOFs à une topologie unique.',
 35:'Croissance près de cellules : distinguer nucléation, dépôt minéral, continuité de la coque et survie cellulaire ; ces phénomènes requièrent des essais indépendants.',
 36:'ZIF-8 : réseau zinc–2-méthylimidazolate ; l’existence d’une coque ne démontre ni son étanchéité ni une immunoprotection biologique.',
 37:'Microscopie : documenter l’échelle, la préparation, la technique et les témoins avant de qualifier une couche d’exosquelette cristallin.',
 38:'Réponse au stress : séparer viabilité, intégrité membranaire, reprise métabolique et prolifération ; toute protection dépend du stress et du protocole.',
 39:'Enzymes et MOFs : distinguer incorporation, adsorption et activité catalytique conservée ; l’accessibilité du substrat et la stabilité sont à mesurer.',
 40:'Transport : la perméabilité dépend du type de molécule, de la porosité effective, des défauts et des interactions ; une coque ZIF-8 n’est pas une membrane idéale.'
});
const chapterNames=[...new Set(FIGURES.map(f=>f.chapter))];
chapterNames.forEach((n,i)=>$('chapter').add(new Option(String(i+1).padStart(2,'0')+' · '+n,n)));
const params=new URLSearchParams(location.search);
const state={chapter:params.get('chapter')||'',q:'',id:Number(params.get('figure')||0),view:'illustration'};
function relevantScenes(f){return SCENES.filter(s=>SCENE_RESOURCE_MAP[s.id]?.plates.includes(f.id)).slice(0,4)}
function renderNavigator(){
 const nav=$('plateNavigator');if(!nav)return;
 nav.innerHTML=FIGURES.map(f=>{
  const edition=redesignedPlate(f.id);
  return '<button type="button" data-figure-jump="'+f.id+'" class="plate-index-item'+(edition?' has-edition':'')+
  '" title="'+esc(f.title)+'" aria-label="Voir la figure '+f.id+' : '+esc(f.title)+'"'+
  (edition?' data-edition="redessinee"':'')+'>'+String(f.id).padStart(2,'0')+'</button>';
 }).join('');
 nav.querySelectorAll('[data-figure-jump]').forEach(b=>b.addEventListener('click',()=>openFigure(Number(b.dataset.figureJump))));
}
function render(){
 const q=state.q.toLocaleLowerCase('fr');
 const rows=FIGURES.filter(f=>(!state.chapter||f.chapter===state.chapter)&&(!q||(f.title+' '+f.note+' '+f.chapter).toLocaleLowerCase('fr').includes(q)));
 $('counter').textContent=rows.length+' / '+FIGURES.length+' PLANCHES · '+redesignedCount()+' ILLUSTRATIONS REDESSINÉES · SOURCES ORIGINALES CONSERVÉES';
 $('gallery').innerHTML=rows.map(f=>{
  const art=redesignedPlate(f.id),src=art?.src||plateAsset(f.id);
  return '<button class="fig-card '+(art?'fig-card-new':'')+'" data-id="'+f.id+'" aria-label="Ouvrir la planche '+f.id+' : '+esc(f.title)+'">'+
   '<span class="fig-art"><img src="'+esc(src)+'" alt="'+(art?'Reconstruction scientifique de la planche ':'Diapositive originale ')+f.id+' — '+esc(f.title)+'" loading="lazy" decoding="async"></span>'+
   '<span class="fig-body"><span class="fig-number">FIG. '+String(f.id).padStart(2,'0')+' / '+time(f.time)+' · CH. '+String(chapterNames.indexOf(f.chapter)+1).padStart(2,'0')+'</span>'+
   '<span class="fig-title">'+esc(f.title)+'</span><span class="fig-chapter">'+esc(f.chapter)+'</span>'+
   '<span class="fig-visit">'+(art?'ILLUSTRATION + SOURCE ORIGINALE ↗':'OUVRIR LA SOURCE ↗')+'</span>'+
   '<span class="sanchez-plate-credit">CLÉMENT SANCHEZ · COLLÈGE DE FRANCE · 2020</span>'+ 
   (art?'<span class="redesigned-status">ILLUSTRATION CONCEPTUELLE · NON EXPÉRIMENTALE</span>':'')+
   '</span></button>';
 }).join('');
 document.querySelectorAll('.fig-card[data-id]').forEach(b=>b.onclick=()=>openFigure(Number(b.dataset.id)));
}
function time(t){const s=Math.round(t);return String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor((s%3600)/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function displayFigureArt(){
 const f=FIGURES.find(x=>x.id===state.id);if(!f)return;
 const enhanced=redesignedPlate(f.id);
 const newView=Boolean(enhanced&&state.view==='illustration');
 const src=newView?enhanced.src:plateAsset(f.id);
 const description=newView?'Illustration scientifique redessinée : reconstruction explicative, sans données expérimentales mesurées.':'Diapositive originale du cours de Clément Sanchez (2020), conservée comme document source.';
 $('bigArt').innerHTML='<img src="'+esc(src)+'" alt="'+esc(description)+' Planche '+f.id+' — '+esc(f.title)+'">';
 const versions=$('figureVersions');
 versions.hidden=!enhanced;
 versions.innerHTML=enhanced?'<button type="button" data-view="illustration" aria-pressed="'+newView+'">ILLUSTRATION REDESSINÉE</button><button type="button" data-view="original" aria-pressed="'+(!newView)+'">SOURCE ORIGINALE 2020</button>':'';
 versions.querySelectorAll('button[data-view]').forEach(button=>button.onclick=()=>{
  state.view=button.dataset.view;displayFigureArt();
 });
 const note=$('artStatus');
 note.textContent=description;
 note.classList.toggle('source-original-note',!newView);
}
function openFigure(id){
 const f=FIGURES.find(f=>f.id===id);if(!f)return;
 state.id=f.id;
 state.view=(new URLSearchParams(location.search).get('view')==='original')?'original':(redesignedPlate(f.id)?'illustration':'original');
 $('dialogMeta').textContent='CLÉMENT SANCHEZ · COLLÈGE DE FRANCE / FIGURE '+String(f.id).padStart(2,'0')+' / '+time(f.time);
 $('dialogChapter').textContent='CHAPITRE '+String(chapterNames.indexOf(f.chapter)+1).padStart(2,'0')+' · '+f.chapter;
 $('dialogTitle').textContent=f.title;
 $('dialogText').textContent=f.note;
 const critical=$('scientificReview');if(critical){
  critical.hidden=!scientificReview[f.id];
  critical.textContent=scientificReview[f.id]||'';
 }
 displayFigureArt();
 const scenes=relevantScenes(f);
 let ln='<a target="_blank" rel="noopener noreferrer" href="'+esc(videoAt(f.time))+'">VOIR LA DIAPOSITIVE DANS LA VIDÉO ↗</a><a href="../research/#figure-'+f.id+'">LIRE LA LÉGENDE SCIENTIFIQUE ↗</a><a href="../notions/">EXPLORER LE VOCABULAIRE ↗</a>';
 if(scenes.length)ln+=scenes.slice(0,2).map(s=>'<a href="../#'+esc(s.id)+'">EXPLORER EN 3D : '+esc(s.title)+' ↗</a>').join('');
 $('dialogLinks').innerHTML=ln;
 const d=$('details');if(!d.open)d.showModal();
 const url=new URL(location.href);url.searchParams.set('figure',id);history.replaceState({},'',url);
 document.title='Figure '+String(f.id).padStart(2,'0')+' — '+f.title+' · Clément Sanchez · Collège de France';
 document.querySelectorAll('.plate-index-item').forEach(el=>el.setAttribute('aria-current',String(Number(el.dataset.figureJump)===f.id)));

}
$('query').oninput=e=>{state.q=e.target.value;render()};
$('chapter').onchange=e=>{state.chapter=e.target.value;render()};
$('prevFigure').onclick=()=>openFigure(state.id===1?70:state.id-1);
$('nextFigure').onclick=()=>openFigure(state.id===70?1:state.id+1);
$('close').onclick=()=>{$('details').close()};
$('details').addEventListener('close',()=>{const u=new URL(location.href);u.searchParams.delete('figure');history.replaceState({},'',u);document.title='Les 70 planches — Chimie douce'});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('details').open)$('details').close();if($('details').open&&e.key==='ArrowRight')openFigure(state.id===70?1:state.id+1);if($('details').open&&e.key==='ArrowLeft')openFigure(state.id===1?70:state.id-1)});
renderNavigator();render();if(state.chapter)$('chapter').value=state.chapter;if(state.id)openFigure(state.id);
