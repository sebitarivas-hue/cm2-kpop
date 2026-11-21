/*
 * Chimie douce | runtime multilingual layer
 * Source of truth: the French course text remains unchanged.
 * Exact editorial UI translations are included below; remaining scientific prose
 * uses on-device Translator API when already available, otherwise an external
 * machine translation request (MyMemory). This layer is NOT peer reviewed.
 */
export const LANGUAGES={
 fr:{label:"Français",code:"fr"},
 en:{label:"English",code:"en"},
 es:{label:"Español",code:"es"},
 it:{label:"Italiano",code:"it"},
 zh:{label:"中文（简体）",code:"zh-CN"}
};
const SAFE_LANG=Object.keys(LANGUAGES);
const LABELS={
 fr:["Accueil","Atlas 3D","Ingénierie","Planches","Cours","Bibliographie","Essai","Labo","MENU","FERMER","RETOUR","ATLAS","ESSAI"],
 en:["Home","3D Atlas","Engineering","Plates","Lectures","Bibliography","Essay","Lab","MENU","CLOSE","BACK","ATLAS","ESSAY"],
 es:["Inicio","Atlas 3D","Ingeniería","Láminas","Clases","Bibliografía","Ensayo","Lab.","MENÚ","CERRAR","VOLVER","ATLAS","ENSAYO"],
 it:["Home","Atlante 3D","Ingegneria","Tavole","Lezioni","Bibliografia","Saggio","Lab.","MENU","CHIUDI","INDIETRO","ATLANTE","SAGGIO"],
 zh:["首页","3D 图谱","工程建模","图版","课程","参考文献","论文","实验室","菜单","关闭","返回","图谱","论文"]
};
const UI={
"LE COURS DE CLÉMENT SANCHEZ · COLLÈGE DE FRANCE":{
 en:"CLÉMENT SANCHEZ’S LECTURE · COLLÈGE DE FRANCE",
 es:"CURSO DE CLÉMENT SANCHEZ · COLLÈGE DE FRANCE",
 it:"LEZIONE DI CLÉMENT SANCHEZ · COLLÈGE DE FRANCE",
 zh:"克莱芒·桑切斯课程 · 法兰西公学院"},
"Vers des matériaux":{en:"Toward Living",es:"Hacia materiales",it:"Verso materiali",zh:"迈向生命"},
"hybrides vivants.":{en:"Hybrid Materials.",es:"híbridos vivos.",it:"ibridi viventi.",zh:"杂化材料。"},
"UN COURS DE":{en:"A LECTURE BY",es:"CURSO IMPARTIDO POR",it:"LEZIONE DI",zh:"主讲人"},
"COLLÈGE DE FRANCE · 18 FÉVRIER 2020":{en:"COLLÈGE DE FRANCE · FEBRUARY 18, 2020",es:"COLLÈGE DE FRANCE · 18 DE FEBRERO DE 2020",it:"COLLÈGE DE FRANCE · 18 FEBBRAIO 2020",zh:"法兰西公学院 · 2020年2月18日"},
"↗ VOIR LA CONFÉRENCE ORIGINALE":{en:"↗ WATCH THE ORIGINAL LECTURE",es:"↗ VER LA CONFERENCIA ORIGINAL",it:"↗ GUARDA LA LEZIONE ORIGINALE",zh:"↗ 观看原始讲座"},
"EXPLORER LES LABORATOIRES":{en:"EXPLORE THE LABORATORIES",es:"EXPLORAR LOS LABORATORIOS",it:"ESPLORA I LABORATORI",zh:"探索实验室"},
"EXPÉRIMENTER EN LABO":{en:"ENTER THE LAB",es:"EXPERIMENTAR EN EL LABORATORIO",it:"SPERIMENTA IN LABORATORIO",zh:"进入实验室"},
"LABORATOIRES 3D":{en:"3D LABORATORIES",es:"LABORATORIOS 3D",it:"LABORATORI 3D",zh:"3D 实验室"},
"FIGURES MINUTÉES":{en:"TIMESTAMPED FIGURES",es:"FIGURAS CRONOMETRADAS",it:"FIGURE CON MINUTAGGIO",zh:"带时间标记的图版"},
"CHAPITRES":{en:"CHAPTERS",es:"CAPÍTULOS",it:"CAPITOLI",zh:"章节"},
"La nature":{en:"Nature",es:"La naturaleza",it:"La natura",zh:"自然"},
"avant le modèle.":{en:"before the model.",es:"antes del modelo.",it:"prima del modello.",zh:"先于模型。"},
"OBSERVATION RÉELLE":{en:"REAL OBSERVATION",es:"OBSERVACIÓN REAL",it:"OSSERVAZIONE REALE",zh:"真实观测"},
"MODÈLE PHÉNOMÉNOLOGIQUE":{en:"PHENOMENOLOGICAL MODEL",es:"MODELO FENOMENOLÓGICO",it:"MODELLO FENOMENOLOGICO",zh:"现象学模型"},
"OBSERVATION SCIENTIFIQUE":{en:"SCIENTIFIC OBSERVATION",es:"OBSERVACIÓN CIENTÍFICA",it:"OSSERVAZIONE SCIENTIFICA",zh:"科学观测"},
"RECHERCHER UN PHÉNOMÈNE":{en:"SEARCH FOR A PHENOMENON",es:"BUSCAR UN FENÓMENO",it:"CERCA UN FENOMENO",zh:"搜索现象"},
"RECHERCHER UNE PUBLICATION":{en:"SEARCH PUBLICATIONS",es:"BUSCAR PUBLICACIONES",it:"CERCA PUBBLICAZIONI",zh:"检索文献"},
"OUVRIR L’ARTICLE VIA DOI ↗":{en:"OPEN ARTICLE VIA DOI ↗",es:"ABRIR ARTÍCULO POR DOI ↗",it:"APRI L'ARTICOLO TRAMITE DOI ↗",zh:"通过 DOI 打开论文 ↗"},
"COPIER LA CITATION":{en:"COPY CITATION",es:"COPIAR CITA",it:"COPIA CITAZIONE",zh:"复制引用"},
"RECHERCHES ULTÉRIEURES":{en:"SUBSEQUENT RESEARCH",es:"INVESTIGACIONES POSTERIORES",it:"RICERCHE SUCCESSIVE",zh:"后续研究"},
"LA PREUVE PAR LES SOURCES":{en:"EVIDENCE FROM SOURCES",es:"EVIDENCIAS DOCUMENTALES",it:"LE PROVE NELLE FONTI",zh:"文献证据"},
"Une référence n’est pas une preuve automatique.":{en:"A citation is not proof in itself.",es:"Una referencia no es por sí sola una prueba.",it:"Una citazione non è di per sé una prova.",zh:"引用本身并不能构成证据。"},
"ÉQUATIONS & CINÉTIQUE":{en:"EQUATIONS & KINETICS",es:"ECUACIONES Y CINÉTICA",it:"EQUAZIONI E CINETICA",zh:"方程与动力学"},
"LES LABORATOIRES":{en:"THE LABORATORIES",es:"LOS LABORATORIOS",it:"I LABORATORI",zh:"实验室"},
"OUVRIR LES 70 PLANCHES":{en:"OPEN ALL 70 PLATES",es:"ABRIR LAS 70 LÁMINAS",it:"APRI LE 70 TAVOLE",zh:"打开 70 张图版"},
"ORIGINAL / COLLEGE DE FRANCE":{en:"ORIGINAL / COLLÈGE DE FRANCE",es:"ORIGINAL / COLLÈGE DE FRANCE",it:"ORIGINALE / COLLÈGE DE FRANCE",zh:"原始课程 / 法兰西公学院"}
};
const SKIP="script,style,noscript,pre,code,textarea,svg,math,[contenteditable],.ref-title-link,.ref-doi-link,.doi,.equation,.bibliographic-original,.atlas-language-control,[data-no-translate]";
const textRecords=new Map(),attrRecords=new Map();
let current='fr',version=0,busy=0,queue=[],processed=new WeakMap(),observer=null,translater=null,scheduled=false,failures=0,success=0;
const storageKey="chimie:language";
const canTranslate=n=>!!n?.parentElement&&!n.parentElement.closest(SKIP);
const hasLanguage=s=>/[\p{L}]/u.test(s) && s.replace(/\s/g,'').length>4&&!/^[A-Z][A-Z0-9 .:+()−–\-×⁄%]+$/.test(s);
function localTranslate(s,lang){
 const value=s.trim();
 const translated=UI[value]?.[lang];
 return translated?s.replace(value,translated):null;
}
function getSaved(){try{const q=new URLSearchParams(location.search).get('lang');if(q&&SAFE_LANG.includes(q))return q;const n=localStorage.getItem(storageKey);return SAFE_LANG.includes(n)?n:'fr'}catch{return 'fr'}}
export function currentLanguage(){return current}
function normalizeLanguage(code){return SAFE_LANG.includes(code)?code:'fr'}
function status(message,error=false){
 const el=document.getElementById('atlasLanguageStatus');if(!el)return;
 el.textContent=message;
 el.dataset.state=error?'warning':'ready';
}
async function remoteTranslate(source,lang){
 const api='https://api.mymemory.translated.net/get?langpair=fr%7C'+encodeURIComponent(LANGUAGES[lang].code)+'&q='+encodeURIComponent(source);
 const resp=await fetch(api,{mode:'cors',cache:'force-cache',signal:AbortSignal.timeout(11000)});
 if(!resp.ok)throw Error("HTTP "+resp.status);
 const j=await resp.json();
 const t=String(j.responseData?.translatedText||'');
 if(!t||j.responseStatus!==200||/MYMEMORY WARNING/i.test(t))throw Error("Translation unavailable");
 const holder=document.createElement('textarea');holder.innerHTML=t;
 return holder.value;
}
async function translateChunk(s,lang){
 const key='chimie:v2:'+lang+':'+s;
 try{const cached=localStorage.getItem(key);if(cached)return cached}catch{}
 let translation=null;
 if(globalThis.Translator?.availability&&globalThis.Translator?.create){
  try{
   if(!translater||translater.lang!==lang){
    const state=await globalThis.Translator.availability({sourceLanguage:'fr',targetLanguage:LANGUAGES[lang].code});
    if(state==='available'){const instance=await globalThis.Translator.create({sourceLanguage:'fr',targetLanguage:LANGUAGES[lang].code});translater={lang,instance}}
   }
   if(translater?.lang===lang)translation=await translater.instance.translate(s);
  }catch{}
 }
 if(!translation)translation=await remoteTranslate(s,lang);
 try{if(translation.length<1200)localStorage.setItem(key,translation)}catch{}
 return translation;
}
function chunks(value,max=440){
 if(value.length<=max)return[value];
 const result=[];let remaining=value;
 while(remaining.length>max){
  let i=remaining.lastIndexOf('. ',max);
  if(i<max*.35)i=remaining.lastIndexOf(' ',max);
  if(i<max*.3)i=max;
  result.push(remaining.slice(0,i+1));remaining=remaining.slice(i+1);
 }
 if(remaining)result.push(remaining);
 return result;
}
async function translateScientific(s,lang){
 const parts=chunks(s);
 const out=[];
 for(const c of parts)out.push(await translateChunk(c,lang));
 return out.join(parts.some(p=>p.endsWith(' '))?'':' ');
}
function textNode(n,original){
 if(!canTranslate(n))return;
 const src=original??n.nodeValue;
 if(!hasLanguage(src))return;
 if(!textRecords.has(n))textRecords.set(n,src);
 const v=textRecords.get(n);if(current==='fr'){n.nodeValue=v;return}
 if(processed.get(n)===current)return;
 const direct=localTranslate(v,current);if(direct!==null){n.nodeValue=direct;processed.set(n,current);return}
 if(!/\b(de|du|des|une|un|le|la|les|dans|avec|pour|sur|par|et|est|sont|aux|entre|cette|ces|leurs|qui|que)\b/i.test(v)&&!/[éèàùêçîôûëï]/i.test(v))return;
 schedule({node:n,source:v,lang:current,version});
}
function scan(root=document.body){
 if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let n;while(n=walker.nextNode())textNode(n);
 for(const el of root.querySelectorAll('[placeholder],[alt],[title],[aria-label]')){
  if(el.closest(SKIP))continue;
  const original=attrRecords.get(el)||{};
  for(const k of ['placeholder','alt','title','aria-label']){
   if(!el.hasAttribute(k))continue;
   if(!(k in original))original[k]=el.getAttribute(k);
   if(current==='fr'){el.setAttribute(k,original[k]);continue}
   const direct=localTranslate(original[k],current);if(direct)el.setAttribute(k,direct);
  }
  attrRecords.set(el,original);
 }
}
function schedule(item){
 if(!item.node.isConnected)return;
 const rect=item.node.parentElement?.getBoundingClientRect();
 if(rect&&(rect.top>innerHeight+950||rect.bottom<-550))return;
 if(processed.get(item.node)===item.lang)return;
 processed.set(item.node,item.lang);
 queue.push(item);
 if(queue.length>650)queue=queue.slice(0,650);
 pump();
}
async function pump(){
 while(busy<2&&queue.length){
  const task=queue.shift();if(task.version!==version||!task.node.isConnected)continue;
  busy++;
  (async()=>{
   try{
    const result=await translateScientific(task.source,task.lang);
    if(task.version===version&&task.node.isConnected&&result)task.node.nodeValue=result;
    success++;
   }catch{failures++;if(failures===1||failures%20===0)status('Traduction automatique indisponible pour certains passages ; texte original conservé.',true)}
   finally{busy--;pump()}
  })();
 }
}
function displayLabels(){
 const select=document.getElementById('atlasLanguageSelect');
 if(select)select.value=current;
 document.documentElement.lang=LANGUAGES[current].code;
 const badge=document.getElementById('atlasLanguageStatus');
 if(badge){badge.textContent=current==='fr'?'Texte original':current==='zh'?'机器翻译 · 需科学审校':current==='en'?'Machine translation · scientific review needed':current==='es'?'Traducción automática · requiere revisión científica':'Traduzione automatica · revisione scientifica necessaria';badge.dataset.state='ready'}
 document.querySelectorAll('#atlasGlobalNav [data-translation-key],#atlasGlobalNav .route-menu a').forEach(e=>{
  if(e.dataset.translationKey){
    const i=Number(e.dataset.translationKey);if(Number.isInteger(i)&&LABELS[current][i])e.textContent=LABELS[current][i];
  }else{
    const order=['Accueil','Atlas 3D','Ingénierie','Planches','Cours','Bibliographie','Essai','Labo'];
    const idx=order.indexOf(e.dataset.route);
    if(idx!==-1)e.textContent=LABELS[current][idx];
  }
 });
}
export function setLanguage(lang){
 const next=normalizeLanguage(lang);
 if(next!==current){version++;queue=[];processed=new WeakMap();current=next;translater=null;failures=success=0;}
 try{localStorage.setItem(storageKey,current)}catch{}
 displayLabels();
 for(const [n,v] of textRecords)if(n.isConnected)n.nodeValue=v;
 scan(document.body);
 const url=new URL(location.href);if(current==='fr')url.searchParams.delete('lang');else url.searchParams.set('lang',current);
 history.replaceState(history.state,'',url);
 window.dispatchEvent(new CustomEvent('chimie:language',{detail:{language:current}}));
}
function visibleScan(){
 if(scheduled)return;scheduled=true;
 requestAnimationFrame(()=>{scheduled=false;if(current!=='fr')scan(document.body)})
}
export function initI18n(nav){
 current=getSaved();
 const slot=document.createElement('div');slot.className='atlas-language-control';
 slot.innerHTML='<label for="atlasLanguageSelect" class="atlas-language-label">LANG / 语言</label><select id="atlasLanguageSelect" aria-label="Langue du site / Website language">'+Object.entries(LANGUAGES).map(([key,val])=>'<option value="'+key+'">'+val.label+'</option>').join('')+'</select><span id="atlasLanguageStatus" class="atlas-language-status"></span>';
 const toggler=nav.querySelector('.atlas-mobile-toggle');
 nav.insertBefore(slot,toggler||null);
 slot.querySelector('select').addEventListener('change',e=>setLanguage(e.target.value));
 observer=new MutationObserver(mutations=>{if(current==='fr')return;for(const m of mutations){if(m.addedNodes.length){visibleScan();break}}});
 observer.observe(document.body,{subtree:true,childList:true});
 addEventListener('scroll',visibleScan,{passive:true});
 addEventListener('hashchange',visibleScan);
 setLanguage(current);
}
