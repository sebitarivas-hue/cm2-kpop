import {SOURCES,SCENES} from '../src/content.js';
import {FIGURES} from '../src/figures.js';
import {EXTRA_BIBLIO} from '../src/bibliography-extra.js';
import {SCENE_RESOURCE_MAP,PLATE_BY_ID} from '../src/knowledge-graph.js';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const yrs={S0:2020,R1:2002,R2:2003,R3:2011,R4:2014,R5:2016,R6:2016,R7:2017,R8:2016,R9:2017,R10:2006,R11:2019,R12:2018,R13:2018,R14:2006,R15:2007,R16:2015,R17:2011,R18:2016};
const groups=[
 ['fondements','∴','Fondements'],['encapsulation','◉','Encapsulation'],['mof','◇','MOFs & cristaux'],
 ['hdl','≡','Matériaux lamellaires'],['mycélium','⌁','Mycélium'],['biofabrication','↝','Biofabrication'],
 ['cellulose','≈','Cellulose'],['bioénergie','↯','Bioénergie'],['actuation','∿','Actionnement'],
 ['vivant','✳','Matière vivante'],['microrobotique','⊕','Microrobotique'],['porosité','○','Porosité']
];
const topicFor=s=>{let t=s.toLowerCase();if(/mycél|fung|hyph/.test(t))return'mycélium';if(/layered|lamella|atrazine|hydroxide/.test(t))return'hdl';if(/zif|mof|metal.organic|coordination/.test(t))return'mof';if(/fuel|electrod|energy|thermoelectric/.test(t))return'bioénergie';if(/cellulose|nanocellulos/.test(t))return'cellulose';if(/print|biofabri/.test(t))return'biofabrication';if(/spore|responsive|actuat/.test(t))return'actuation';if(/silica|sol.gel|encapsulat|preserv/.test(t))return'encapsulation';return'fondements'};
const indexed=Object.entries(SOURCES).map(([id,r])=>{const scenes=SCENES.filter(s=>s.refs.includes(id)).map(s=>s.id);return{id,year:yrs[id]??null,title:r.name,author:id==='S0'?'Clément Sanchez':'Référence extraite du manuscrit',journal:r.kind,doi:r.url?.includes('doi.org/')?r.url.split('doi.org/')[1]:null,url:r.url,topic:topicFor(r.name+' '+scenes.join(' ')),scenes,insight:id==='S0'?'Conférence originale du 18 février 2020, source de la chronologie.':'Référence extraite du dossier scientifique. Consulter la publication pour les mesures, résultats et méthodes détaillés.',origin:'dossier',period:'avant',kind:id==='S0'?'cours':'article'}});
const expanded=EXTRA_BIBLIO.map(r=>({...r,origin:'approfondissement',kind:'article'}));
const all=[...indexed,...expanded].sort((a,b)=>(b.year||0)-(a.year||0)||a.id.localeCompare(b.id));
const parms=new URLSearchParams(location.search),state={q:'',topic:parms.get('topic')||'',period:'',kind:'',scene:parms.get('scene')||'',figure:parms.get('figure')||'',ref:parms.get('ref')||''};
const thematicFigure=r=>[...new Set((r.scenes||[]).flatMap(id=>SCENE_RESOURCE_MAP[id]?.plates||[]))].slice(0,3).map(id=>PLATE_BY_ID[id]).filter(Boolean);
function createMap(){const counts=Object.fromEntries(groups.map(x=>[x[0],all.filter(r=>r.topic===x[0]).length]));$('topicMap').innerHTML=groups.map(([id,mark,name])=>'<button class="topic-node '+(state.topic===id?'active':'')+'" data-topic="'+esc(id)+'" aria-pressed="'+(state.topic===id)+'"><span class="symbol">'+mark+'</span><b>'+esc(name)+'</b><small>'+counts[id]+'</small></button>').join('');$('topicMap').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.topic=state.topic===b.dataset.topic?'':b.dataset.topic;update()}))}
function sourceCard(r){
 const fs=thematicFigure(r),ss=SCENES.filter(s=>r.scenes.includes(s.id)),
 period=r.year>2020?'<span class="post">RECHERCHE POSTÉRIEURE</span>':'<span>ANTÉRIEUR OU CONTEMPORAIN AU COURS</span>';
 const art='<span class="ref-journal-mark">PUBLICATION SCIENTIFIQUE</span><span class="ref-journal-year">'+esc(r.year||'—')+'</span><span class="ref-journal-topic">'+esc(r.topic.toUpperCase())+'</span>'; 
 const a=ss.slice(0,3).map(s=>'<a href="../#'+esc(s.id)+'">◉ '+esc(s.title)+'</a>').join('');
 const v=fs.slice(0,2).map(f=>'<a href="../planches/?figure='+f.id+'&ref='+esc(r.id)+'">⌕ FIG. '+String(f.id).padStart(2,'0')+'</a>').join('');
 // A DOI or PubMed landing page does not automatically give access to a free PDF.
 const target=String(r.url||'');
 const valid=/^https:\/\//i.test(target);
 const href=valid?esc(target):'https://search.crossref.org/?q='+encodeURIComponent(r.title);
 const isVideo=r.id==='S0';
 const isDoi=target.includes('doi.org/');
 const sourceLabel=isVideo?'OUVRIR LA CONFÉRENCE ↗':isDoi?'OUVRIR L’ARTICLE VIA DOI ↗':'OUVRIR LA NOTICE DE L’ARTICLE ↗';
 const linkTitle=isVideo?'Voir la conférence originale':isDoi?'Ouvrir la page de l’article via son DOI':'Consulter la notice ou le résumé de cette publication';
 const pictureLink='<a class="ref-image-link" href="'+href+'" target="_blank" rel="noopener noreferrer" aria-label="'+esc(linkTitle+' : '+r.title)+'">'+art+'<span class="ref-open-overlay" aria-hidden="true">↗ CONSULTER LA PUBLICATION</span></a>';
 const doiLink=r.doi?'<a class="ref-doi-link" href="https://doi.org/'+encodeURI(r.doi)+'" target="_blank" rel="noopener noreferrer" title="Ouvrir le DOI de la publication">DOI : '+esc(r.doi)+' ↗</a>':'<a class="ref-doi-link" href="'+href+'" target="_blank" rel="noopener noreferrer">'+(isVideo?'VIDÉO ORIGINALE ↗':'NOTICE BIBLIOGRAPHIQUE ↗')+'</a>';
 return '<article id="ref-'+esc(r.id)+'" class="refcard">'+
 '<div class="ref-visual">'+pictureLink+'</div>'+
 '<div class="ref-meta"><span>'+esc(r.id)+'</span><span>'+esc(r.year||'S. D.')+'</span><span>'+esc(r.topic.toUpperCase())+'</span>'+period+'</div>'+
 '<h3><a class="ref-title-link" href="'+href+'" target="_blank" rel="noopener noreferrer" title="'+esc(linkTitle)+'">'+esc(r.title)+' <span aria-hidden="true">↗</span></a></h3>'+
 '<div class="ref-auth">'+esc(r.author)+' · '+esc(r.journal)+'</div>'+
 '<p class="ref-desc">'+esc(r.insight)+'</p>'+
 '<div class="doi">'+doiLink+'</div>'+
 '<div class="ref-actions"><a href="'+href+'" target="_blank" rel="noopener noreferrer">'+sourceLabel+'</a><button type="button" data-bib="'+esc(r.id)+'">COPIER LA CITATION</button></div>'+
 '<div class="connections">'+a+v+'</div></article>';
}

function activeList(){const q=state.q.toLocaleLowerCase('fr').trim();return all.filter(r=>{if(state.topic&&r.topic!==state.topic)return false;if(state.period&&r.period!==state.period)return false;if(state.kind&&r.kind!==state.kind)return false;if(state.scene&&!r.scenes.includes(state.scene))return false;if(state.figure){let f=FIGURES.find(f=>String(f.id)===String(state.figure));if(f){let ds=SCENES.filter(s=>Math.abs(s.time-f.time)<190).map(s=>s.id);if(!r.scenes.some(s=>ds.includes(s))&&r.id!=='S0')return false}}const blob=[r.title,r.author,r.journal,r.doi,r.topic,r.year,r.insight,r.id].join(' ').toLocaleLowerCase('fr');return!q||blob.includes(q)})}
function update(){createMap();let rows=activeList();$('totalRef').textContent=all.length+' SOURCES';$('resultsCount').textContent=rows.length+' RÉFÉRENCE'+(rows.length>1?'S':'')+' AFFICHÉE'+(rows.length>1?'S':'');$('results').innerHTML=rows.length?rows.map(sourceCard).join(''):'<div class="empty-list">Aucune référence pour cette combinaison de filtres. Modifiez la recherche.</div>';const related=state.scene?'Scène '+(SCENES.find(s=>s.id===state.scene)?.title||state.scene):state.figure?'Figure '+state.figure+' — rapprochement thématique indicatif':'';$('contextLabel').textContent=related||'34 recherches complémentaires et 19 références du dossier';history.replaceState(null,'',location.pathname+(state.topic||state.scene||state.figure?'?'+new URLSearchParams(Object.entries({topic:state.topic,scene:state.scene,figure:state.figure}).filter(([,v])=>v)).toString():'')+(location.hash||''));
 document.querySelectorAll('[data-bib]').forEach(button=>button.onclick=async()=>{const r=all.find(r=>r.id===button.dataset.bib);if(!r)return;const citation=r.title+' ('+(r.year||'s.d.')+'). '+r.journal+'. '+r.url;try{await navigator.clipboard.writeText(citation);button.textContent='COPIÉ ✓'}catch{button.textContent='COPIE INDISPONIBLE'}});
 if(state.ref){const el=$('ref-'+state.ref);if(el)requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'center'}));state.ref=''}}
for(const s of SCENES){$('sceneFilter').add(new Option(s.title,s.id))}if(state.scene)$('sceneFilter').value=state.scene;
$('query').addEventListener('input',e=>{state.q=e.target.value;update()});
$('period').addEventListener('change',e=>{state.period=e.target.value;update()});
$('sourceKind').addEventListener('change',e=>{state.kind=e.target.value;update()});
$('sceneFilter').addEventListener('change',e=>{state.scene=e.target.value;state.figure='';update()});
$('reset').onclick=()=>{state.q=state.topic=state.period=state.kind=state.scene=state.figure='';$('query').value='';$('period').value='';$('sourceKind').value='';$('sceneFilter').value='';update()};
update();
