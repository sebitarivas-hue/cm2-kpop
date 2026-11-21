/* Navigation de la conférence depuis le registre documentaire commun. */
import {FIGURES} from './src/figures.js';
import {plateAsset} from './src/knowledge-graph.js';
import {CHAPTER_TERMS} from './chapter-locales.js';
import {HOME_TERMS} from './home-locales.js';
import {currentLanguage} from './i18n.js';
const root=document.getElementById('discoveryChapters');
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');
function render(){
 if(!root)return;
 const lang=currentLanguage();
 const translate=s=>{if(lang==='fr')return s;const direct=HOME_TERMS[s]?.[lang]||CHAPTER_TERMS[s]?.[lang];if(direct)return direct;const key=Object.keys(CHAPTER_TERMS).find(k=>k.includes(s));const full=key&&CHAPTER_TERMS[key]?.[lang];return full?full.replace(/^\d+\.\s*/, '').replace(/\s*\\(\d\d:\d\d[^)]*\\)$/, ''):s;};
 const chapters=[...new Set(FIGURES.map(f=>f.chapter))];
 root.innerHTML=chapters.map((name,i)=>{
   const first=FIGURES.find(f=>f.chapter===name);
   if(!first)return '';
   const label=translate(name);
   return '<a class="discovery-chapter" href="./planches/?figure='+first.id+'" aria-label="'+escape(translate('Chapitre'))+' '+(i+1)+' : '+escape(label)+'"><img loading="lazy" src="'+plateAsset(first.id)+'" alt="'+escape(translate('Planche originale'))+' '+first.id+' : '+escape(first.title)+'"><div><small>'+escape(translate('CHAPITRE'))+' '+String(i+1).padStart(2,'0')+' · '+fmt(first.time)+'</small><strong>'+escape(label)+'</strong><span>'+escape(translate('VOIR LA PLANCHE SOURCE ↗'))+'</span></div></a>';
 }).join('');
}
render();
window.addEventListener('chimie:language',render);
