import {FIGURES} from '../src/figures.js';
import {SCENES,videoAt} from '../src/content.js';
import {SCENE_RESOURCE_MAP} from '../src/knowledge-graph.js';
import {plateAsset} from '../src/knowledge-graph.js';
import {redesignedPlate,editorialPlateStatus} from '../src/redesigned-plates.js';
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
 40:'Transport : la perméabilité dépend du type de molécule, de la porosité effective, des défauts et des interactions ; une coque ZIF-8 n’est pas une membrane idéale.',
 42:'Photoexcitation de CdS et transfert électronique à la bactérie : le trajet des électrons est un schéma mécanistique, pas une mesure électrochimique. Le couplage au métabolisme doit être interprété à partir des expériences originales.',
 43:'Les courbes de cette illustration sont inventées et ne doivent servir ni à quantifier la production d’acétate ni à comparer les groupes. La diapositive scientifique originale est affichée par défaut.',
 44:'La couverture nanométrique dessinée et les épaisseurs indiquées sont conceptuelles ; l’attribution structurale et les performances réelles nécessitent les données de l’article source.',
 45:'La représentation d’une coque limitant le passage de l’oxygène est une hypothèse explicative : ne pas l’assimiler à une imperméabilité de principe. Vérifier les contrôles de survie et d’activité.',
 46:'Les graphiques figurant dans la reconstruction sont fictifs et non quantitatifs. La diapositive originale est affichée par défaut, car elle seule permet de vérifier les conditions et les mesures rapportées.',
 47:'Une cellule HeLa est eucaryote : distinguer la membrane plasmique, les ligands d’ancrage et la distribution des nanoparticules. La densité du revêtement, sa continuité et la survie cellulaire ne sont pas établies par une coupe schématique.',
 48:'La présence d’une sonde sur la coque et l’amplitude d’un signal ne prouvent ni la sélectivité du récepteur ni l’absence de bruit de fond. Évaluer contrôle négatif, réversibilité, réponse dose–signal et compatibilité cellulaire.',
 49:'Coordination, adsorption électrostatique et couplage covalent sont des processus chimiquement distincts. Leur compatibilité avec une membrane vivante et leur rendement de greffage doivent être démontrés ; ne pas présumer une interface étanche.',
 50:'Les diagrammes de stabilité sont conceptuels. Survie, intégrité membranaire, persistance métabolique et résistance mécanique doivent être mesurées séparément, avec témoins et échelles temporelles rapportées.',
 51:'Une mesure de nanoindentation dépend de la vitesse de chargement, de la géométrie et du modèle d’analyse. La rigidification apparente d’une supracellule ne démontre pas à elle seule sa viabilité.',
 52:'Des particules portant plusieurs fonctionnalités ne prouvent ni leur fonctionnement simultané ni leur biocompatibilité. Vérifier les fonctions séparément, puis dans le matériau assemblé.',
 53:'La cryoprotection doit être évaluée sur plusieurs cycles ou conditions : congélation, décongélation, récupération, viabilité et fonctions ultérieures ne sont pas interchangeables.',
 54:'L’hémolyse et la récupération après décongélation nécessitent des contrôles quantitatifs et l’évaluation de particules MOF résiduelles ; aucun taux ne doit être inféré du schéma reconstruit.',
 55:'La localisation intracellulaire ou extracellulaire de MOFs dépend du transport des précurseurs, de leur diffusion et des sites de nucléation ; un schéma ne démontre pas le mécanisme de croissance in vivo.',
 56:'La mise en évidence de phases MOF dans les tissus végétaux doit croiser imagerie, cartographie élémentaire et contrôles de préparation ; un signal ne prouve pas une distribution homogène.'
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
 $('counter').textContent=rows.length+' / '+FIGURES.length+' PLANCHES · 38 ILLUSTRATIONS DÉTAILLÉES (01 ET 07 À RECTIFIER) · 32 SVG EN REFONTE · 70 SOURCES ORIGINALES';
 $('gallery').innerHTML=rows.map(f=>{
  const art=redesignedPlate(f.id),src=(art&&!art.defaultOriginal)?art.src:plateAsset(f.id);
  return '<button class="fig-card '+(art?'fig-card-new':'')+'" data-id="'+f.id+'" aria-label="Ouvrir la planche '+f.id+' : '+esc(f.title)+'">'+
   '<span class="fig-art"><img src="'+esc(src)+'" alt="'+(art&&!art.defaultOriginal?'Reconstruction scientifique de la planche ':'Diapositive originale ')+f.id+' — '+esc(f.title)+'" loading="lazy" decoding="async"></span>'+
   '<span class="fig-body"><span class="fig-number">FIG. '+String(f.id).padStart(2,'0')+' / '+time(f.time)+' · CH. '+String(chapterNames.indexOf(f.chapter)+1).padStart(2,'0')+'</span>'+
   '<span class="fig-title">'+esc(f.title)+'</span><span class="fig-chapter">'+esc(f.chapter)+'</span>'+
   '<span class="fig-visit">'+(art?'ILLUSTRATION + SOURCE ORIGINALE ↗':'OUVRIR LA SOURCE ↗')+'</span>'+
   '<span class="plate-editorial-status">'+esc(editorialPlateStatus(f.id))+'</span>'+ 
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
 const comparing=Boolean(enhanced&&state.view==='comparison');
 const newView=Boolean(enhanced&&state.view==='illustration');
 const src=newView?enhanced.src:plateAsset(f.id);
 const description=(newView||comparing)?enhanced.caution:'Diapositive originale du cours de Clément Sanchez (2020), conservée comme document source.';
 const originalImage='<img src="'+esc(plateAsset(f.id))+'" alt="Diapositive originale 2020 : '+esc(f.title)+'">';
 const redrawImage=enhanced?'<img src="'+esc(enhanced.src)+'" alt="Reconstruction pédagogique distincte de la planche '+f.id+' : '+esc(f.title)+'">':'';
 $('bigArt').classList.toggle('comparison-view',comparing);
 $('bigArt').innerHTML=comparing?'<div class="comparison-panel"><strong>SOURCE ORIGINALE 2020</strong>'+originalImage+'</div><div class="comparison-panel"><strong>RECONSTRUCTION PÉDAGOGIQUE</strong>'+redrawImage+'</div>':'<img src="'+esc(src)+'" alt="'+esc(description)+' Planche '+f.id+' — '+esc(f.title)+'">';
 const versions=$('figureVersions');
 versions.hidden=!enhanced;
 versions.innerHTML=enhanced?'<button type="button" data-view="illustration" aria-pressed="'+newView+'">ILLUSTRATION REDESSINÉE</button><button type="button" data-view="original" aria-pressed="'+(!newView&&!comparing)+'">SOURCE ORIGINALE 2020</button><button type="button" data-view="comparison" aria-pressed="'+comparing+'">COMPARER LES DEUX</button>':'';
 versions.querySelectorAll('button[data-view]').forEach(button=>button.onclick=()=>{
  state.view=button.dataset.view;displayFigureArt();
  const route=new URL(location.href);route.searchParams.set('view',state.view);
  history.replaceState(history.state,'',route);
 });
 const note=$('artStatus');
 note.textContent=description;
 note.classList.toggle('source-original-note',!newView);
}
function openFigure(id){
 const f=FIGURES.find(f=>f.id===id);if(!f)return;
 state.id=f.id;
 const requestedView=new URLSearchParams(location.search).get('view');const edition=redesignedPlate(f.id);
 state.view=requestedView==='original'?'original':requestedView==='comparison'&&edition?'comparison':requestedView==='illustration'&&edition?'illustration':(edition&&!edition.defaultOriginal?'illustration':'original');
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
 const url=new URL(location.href);url.searchParams.set('figure',id);history.replaceState(history.state,'',url);
 document.title='Figure '+String(f.id).padStart(2,'0')+' — '+f.title+' · Clément Sanchez · Collège de France';
 document.querySelectorAll('.plate-index-item').forEach(el=>el.setAttribute('aria-current',String(Number(el.dataset.figureJump)===f.id)));

}
$('query').oninput=e=>{state.q=e.target.value;render()};
$('chapter').onchange=e=>{state.chapter=e.target.value;render()};
$('prevFigure').onclick=()=>openFigure(state.id===1?70:state.id-1);
$('nextFigure').onclick=()=>openFigure(state.id===70?1:state.id+1);
$('close').onclick=()=>{$('details').close()};
$('details').addEventListener('close',()=>{const u=new URL(location.href);u.searchParams.delete('figure');u.searchParams.delete('view');history.replaceState(history.state,'',u);document.title='Les 70 planches — Chimie douce'});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('details').open)$('details').close();if($('details').open&&e.key==='ArrowRight')openFigure(state.id===70?1:state.id+1);if($('details').open&&e.key==='ArrowLeft')openFigure(state.id===1?70:state.id-1)});
renderNavigator();render();if(state.chapter)$('chapter').value=state.chapter;if(state.id)openFigure(state.id);
