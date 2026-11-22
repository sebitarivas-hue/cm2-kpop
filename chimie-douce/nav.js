import {SCENES} from './src/content.js';
import {initI18n,currentLanguage} from './i18n.js';
// One authoritative site-wide art-direction layer loaded after every route's local stylesheet.
const masterStyle=document.createElement('link');
masterStyle.rel='stylesheet';
masterStyle.href=new URL('./atlas-master.css',import.meta.url).href;
masterStyle.dataset.atlasDesign='approved-master';
document.head.appendChild(masterStyle);
const root=new URL('./',import.meta.url),links=[['Accueil','', '⌂'],['Atlas 3D','#laboratoire','◉'],['Ingénierie','ingenierie/','✥'],['Planches','planches/','▧'],['Notions','notions/','⌕'],['Cours','research/','◫'],['Bibliographie','bibliographie/','⌕'],['Clément Sanchez','clement-sanchez/','♧'],['Essai','chimie_douce_interactive.html','✦'],['Labo','lab/','◇']];
const url=path=>new URL(path,root).href;
const h=(s)=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function route(){let p=location.pathname;return p.includes('/chimie_douce_interactive.html')?'Essai':p.includes('/clement-sanchez/')?'Clément Sanchez':p.includes('/planches/')?'Planches':p.includes('/notions/')?'Notions':p.includes('/bibliographie/')?'Bibliographie':p.includes('/research/')?'Cours':p.includes('/ingenierie/')?'Ingénierie':p.includes('/lab/')?'Labo':'Atlas 3D'}
const n=document.createElement('nav');n.id='atlasGlobalNav';n.setAttribute('aria-label','Navigation principale et fil d’Ariane');n.innerHTML='<a class="nav-signature" href="'+url('')+'"><span class="sig-orb"></span><span class="sanchez-brand"><strong>CLÉMENT SANCHEZ</strong><small>CHIMIE DOUCE · MATÉRIAUX HYBRIDES VIVANTS</small></span></a><span class="nav-divider"></span><div class="breadcrumbs" id="atlasBreadcrumb"></div><div class="route-menu">'+links.map(([name,path])=>'<a href="'+url(path)+'" data-route="'+name+'" class="'+(route()===name?'active':'')+'">'+name+'</a>').join('')+'</div><button type="button" class="nav-back" id="atlasBack" title="Revenir à la page précédente">← RETOUR</button>';
n.insertAdjacentHTML('beforeend','<button type="button" id="atlasMobileMenuBtn" class="atlas-mobile-toggle" aria-expanded="false" aria-controls="atlasGlobalNavLinks" aria-label="Ouvrir le menu du site">☰ <span>MENU</span></button>');
n.querySelector('.route-menu').id='atlasGlobalNavLinks';
document.body.prepend(n);
const attribution=document.createElement('div');
attribution.className='sanchez-attribution';
attribution.innerHTML='<span>CLÉMENT SANCHEZ</span><span>VERS DES MATÉRIAUX HYBRIDES VIVANTS · COLLÈGE DE FRANCE · 2020</span><a href="https://www.youtube.com/watch?v=LkvdhO6XWZ4" target="_blank" rel="noopener noreferrer">CONFÉRENCE SOURCE ↗</a>';
n.insertAdjacentElement('afterend',attribution);

initI18n(n);
const mobileToggle=document.getElementById('atlasMobileMenuBtn');
const mobileLabels={fr:['MENU','FERMER'],en:['MENU','CLOSE'],es:['MENÚ','CERRAR'],it:['MENU','CHIUDI'],zh:['菜单','关闭']};
const setMobileOpen=open=>{const labels=mobileLabels[currentLanguage()]||mobileLabels.fr;n.classList.toggle('mobile-menu-open',open);mobileToggle.setAttribute('aria-expanded',String(open));mobileToggle.setAttribute('aria-label',open?labels[1]:labels[0]);mobileToggle.innerHTML=open?'× <span>'+labels[1]+'</span>':'☰ <span>'+labels[0]+'</span>'};
window.addEventListener('chimie:language',()=>setMobileOpen(n.classList.contains('mobile-menu-open')));
mobileToggle.addEventListener('click',()=>setMobileOpen(!n.classList.contains('mobile-menu-open')));
n.querySelectorAll('.route-menu a').forEach(a=>a.addEventListener('click',()=>setMobileOpen(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMobileOpen(false)});
document.addEventListener('click',e=>{if(!n.contains(e.target)&&n.classList.contains('mobile-menu-open'))setMobileOpen(false)});
const ptitle=()=>{let r=route();if(r==='Essai'){const labels={paradigmes:'Paradigmes',chronologie:'Chronologie',chapitres:'Chapitres',acteurs:'Acteurs',bibliometrie:'Bibliométrie',limites:'Limites',conclusion:'Conclusion'};return labels[location.hash.slice(1)]||'De la substance au système'}if(r==='Ingénierie')return 'Morphogenèse / cinétiques / matériaux';if(r==='Atlas 3D'){const scene=SCENES.find(s=>'#'+s.id===location.hash);return scene?'Scène · '+scene.title:'Accueil / laboratoires'}if(r==='Planches'){let f=new URLSearchParams(location.search).get('figure');return f?'Figure '+String(f).padStart(2,'0'):'Les 70 planches'}if(r==='Clément Sanchez')return 'Portrait, recherches et conférences';if(r==='Bibliographie'){const qs=new URLSearchParams(location.search),s=SCENES.find(s=>s.id===qs.get('scene'));return s?'Sources · '+s.title:'53 références connectées'}if(r==='Notions')return'Glossaire · 38 notions';if(r==='Cours'){let hh=location.hash.match(/chapitre-(\d+)/);return hh?'Chapitre '+hh[1]:'Monographie en 16 chapitres'}return'Laboratoire virtuel'};
function refresh(){const bc=document.getElementById('atlasBreadcrumb');if(!bc)return;bc.innerHTML=route()==='Essai'?'<a href="'+url('')+'">ATLAS</a><span>›</span><a href="'+url('chimie_douce_interactive.html')+'">ESSAI</a><span>›</span><span class="crumb-current">'+h(ptitle())+'</span>':'<a href="'+url('')+'">ATLAS</a><span>›</span><span class="crumb-current">'+h(ptitle())+'</span>'}
refresh();addEventListener('hashchange',refresh);addEventListener('popstate',refresh);addEventListener('atlas:navigate',refresh);
document.getElementById('atlasBack').onclick=()=>{const prev=sessionStorage.getItem('chimie:previous');if(prev&&prev.startsWith(root.href)&&prev!==location.href){location.href=prev}else{location.href=url('')}};
try{const current=location.href,last=sessionStorage.getItem('chimie:current');if(last&&last!==current&&last.startsWith(root.href))sessionStorage.setItem('chimie:previous',last);sessionStorage.setItem('chimie:current',current)}catch{}
if(route()==='Cours'){const hs=[...document.querySelectorAll('h2[id^="chapitre-"]')];let scheduled=false;addEventListener('scroll',()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;let target=hs[0];for(const x of hs){if(x.getBoundingClientRect().top<185)target=x}if(target&&target.id&&location.hash!=='#'+target.id){const bc=document.getElementById('atlasBreadcrumb');if(bc)bc.innerHTML='<a href="'+url('')+'">ATLAS</a><span>›</span><a href="'+url('research/')+'">COURS</a><span>›</span><span class="crumb-current">'+h(target.textContent.trim().slice(0,62))+'</span>'}})},{passive:true})}

if(route()==='Essai'){
 const items=[...document.querySelectorAll('#nav .nav-link')].map(a=>({id:a.getAttribute('href')?.slice(1),label:a.textContent.trim()})).filter(x=>x.id&&document.getElementById(x.id));
 if(items.length){
  const tools=document.createElement('aside');tools.id='atlasEssayTools';tools.setAttribute('aria-label','Navigation dans l’essai');
  tools.innerHTML='<div class="essay-tools-caption"><span>LECTURE / SECTION</span><span id="essayPosition"></span></div><div class="essay-tools-row"><button type="button" id="essayPrev" aria-label="Section précédente">←</button><label for="essayJump" class="sr-only">Aller à une section</label><select id="essayJump" aria-label="Aller à une section de l’essai">'+items.map((x,i)=>'<option value="'+x.id+'">'+String(i+1).padStart(2,'0')+' · '+h(x.label)+'</option>').join('')+'</select><button type="button" id="essayNext" aria-label="Section suivante">→</button></div><div class="essay-progress"><span id="essayProgress"></span></div><a class="essay-atlas-link" href="'+url('')+'">← REVENIR À L’ATLAS COMPLET</a>';
  document.body.append(tools);
  let active=0,queued=false;
  const goto=i=>{if(i<0){location.href=url('');return}if(i>=items.length)return;location.hash=items[i].id;document.getElementById(items[i].id)?.scrollIntoView({behavior:'smooth',block:'start'})};
  document.getElementById('essayJump').addEventListener('change',e=>goto(items.findIndex(x=>x.id===e.target.value)));
  document.getElementById('essayPrev').addEventListener('click',()=>goto(active-1));
  document.getElementById('essayNext').addEventListener('click',()=>goto(active+1));
  const tick=()=>{queued=false;const current=items.reduce((acc,x,i)=>document.getElementById(x.id)?.getBoundingClientRect().top<260?i:acc,0);active=current;document.getElementById('essayJump').value=items[current].id;document.getElementById('essayPosition').textContent=String(current+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');document.getElementById('essayNext').disabled=current===items.length-1;document.getElementById('essayPrev').textContent=current===0?'⌂':'←';const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);document.getElementById('essayProgress').style.width=Math.min(100,Math.max(0,scrollY/max*100))+'%';const bc=document.getElementById('atlasBreadcrumb');if(bc)bc.innerHTML='<a href="'+url('')+'">ATLAS</a><span>›</span><a href="'+url('chimie_douce_interactive.html')+'">ESSAI</a><span>›</span><span class="crumb-current">'+h(items[current].label)+'</span>'};
  addEventListener('scroll',()=>{if(queued)return;queued=true;requestAnimationFrame(tick)},{passive:true});
  addEventListener('hashchange',()=>requestAnimationFrame(tick));tick();
 }
}
