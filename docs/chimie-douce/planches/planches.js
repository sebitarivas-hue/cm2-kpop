import {FIGURES} from '../src/figures.js';
import {SCENES,VIDEO,videoAt} from '../src/content.js';
import {figureIllustration} from '../src/illustrations.js';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chapterNames=[...new Set(FIGURES.map(f=>f.chapter))];
chapterNames.forEach((n,i)=>$('chapter').add(new Option(String(i+1).padStart(2,'0')+' · '+n,n)));
const params=new URLSearchParams(location.search);
const state={chapter:params.get('chapter')||'',q:'',id:Number(params.get('figure')||0)};
function relevantScenes(f){return SCENES.map(s=>({...s,delta:Math.abs(s.time-f.time)})).filter(s=>s.delta<270).sort((a,b)=>a.delta-b.delta).slice(0,4)}
function render(){const q=state.q.toLocaleLowerCase('fr');const rows=FIGURES.filter(f=>(!state.chapter||f.chapter===state.chapter)&&(!q||(f.title+' '+f.note+' '+f.chapter).toLocaleLowerCase('fr').includes(q)));$('counter').textContent=rows.length+' / '+FIGURES.length+' PLANCHES · TOUCHEZ UNE IMAGE POUR EXPLORER';$('gallery').innerHTML=rows.map(f=>'<button class="fig-card" data-id="'+f.id+'" aria-label="Ouvrir la planche '+f.id+' : '+esc(f.title)+'"><span class="fig-art">'+figureIllustration(f,false)+'</span><span class="fig-body"><span class="fig-number">FIG. '+String(f.id).padStart(2,'0')+' / '+time(f.time)+' · CH. '+String(chapterNames.indexOf(f.chapter)+1).padStart(2,'0')+'</span><span class="fig-title">'+esc(f.title)+'</span><span class="fig-chapter">'+esc(f.chapter)+'</span><span class="fig-visit">OUVRIR LA PLANCHE ↗</span></span></button>').join('');document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>openFigure(Number(b.dataset.id)))}
function time(t){const s=Math.round(t);return String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor((s%3600)/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function openFigure(id){const f=FIGURES.find(f=>f.id===id);if(!f)return;state.id=f.id;$('dialogMeta').textContent='ATLAS SCIENTIFIQUE / FIGURE '+String(f.id).padStart(2,'0')+' / '+time(f.time);$('dialogChapter').textContent='CHAPITRE '+String(chapterNames.indexOf(f.chapter)+1).padStart(2,'0')+' · '+f.chapter;$('dialogTitle').textContent=f.title;$('dialogText').textContent=f.note;$('bigArt').innerHTML=figureIllustration(f,true);
 const scenes=relevantScenes(f);let ln='<a target="_blank" rel="noopener noreferrer" href="'+esc(videoAt(f.time))+'">VOIR LA DIAPOSITIVE DANS LA VIDÉO ↗</a><a href="../research/#figure-'+f.id+'">LIRE LA LÉGENDE SCIENTIFIQUE ↗</a><a href="../bibliographie/?figure='+f.id+'">PUBLICATIONS CONNEXES ↗</a>';
 if(scenes.length)ln+=scenes.slice(0,2).map(s=>'<a href="../#'+esc(s.id)+'">EXPLORER EN 3D : '+esc(s.title)+' ↗</a>').join('');
 $('dialogLinks').innerHTML=ln;const d=$('details');if(!d.open)d.showModal();const url=new URL(location.href);url.searchParams.set('figure',id);history.replaceState({},'',url);document.title='Figure '+String(f.id).padStart(2,'0')+' — '+f.title+' · Chimie douce'}
$('query').oninput=e=>{state.q=e.target.value;render()};
$('chapter').onchange=e=>{state.chapter=e.target.value;render()};
$('close').onclick=()=>{$('details').close()};
$('details').addEventListener('close',()=>{const u=new URL(location.href);u.searchParams.delete('figure');history.replaceState({},'',u);document.title='Les 70 planches — Chimie douce'});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('details').open)$('details').close();if($('details').open&&e.key==='ArrowRight')openFigure(state.id===70?1:state.id+1);if($('details').open&&e.key==='ArrowLeft')openFigure(state.id===1?70:state.id-1)});
render();if(state.chapter)$('chapter').value=state.chapter;if(state.id)openFigure(state.id);
