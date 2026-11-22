/* Client-side access screen for static GitHub Pages. Visual gate only: repository assets remain publicly fetchable. */
(function(){
'use strict';
const expected='24a7f560d44ddc46a3af1811574d8ec687439179309eb08de757ba88b55a2ddf', key='chimie-douce-session-v1';
let accepted=false;
try{accepted=sessionStorage.getItem(key)===expected}catch(_){}
if(accepted)return;
document.documentElement.classList.add('chimie-access-locked');
const style=document.createElement('style');
style.id='chimie-access-style';
style.textContent=`
html.chimie-access-locked { background:#f3eddf!important; }
html.chimie-access-locked body { visibility:hidden!important; overflow:hidden!important; }
html.chimie-access-locked #chimie-access-root { visibility:visible!important; }
#chimie-access-root {position:fixed;inset:0;z-index:2147483647;overflow:auto;display:grid;place-items:center;
 background:radial-gradient(circle at 70% 10%,#e6d8bd 0%,transparent 44%),#f3eddf;
 color:#193629;padding:clamp(16px,4vw,44px);box-sizing:border-box}
#chimie-access-root *,#chimie-access-root *::before{box-sizing:border-box}
#chimie-access-root .access-card{width:min(100%,610px);padding:clamp(24px,5vw,52px);
 border:1px solid #aa9877;background:#f9f4e9;box-shadow:0 22px 80px #3c302219}
#chimie-access-root .access-eyebrow{display:block;color:#8b3028;letter-spacing:.14em;
 font:700 12px/1.5 Arial,sans-serif;margin-bottom:28px}
#chimie-access-root h1{font:normal clamp(37px,6vw,68px)/1.05 Georgia,serif;letter-spacing:-.045em;
 margin:0 0 14px!important;color:#172b20!important}
#chimie-access-root p{font:normal 16px/1.65 Arial,sans-serif!important;color:#435348!important;margin:0 0 24px}
#chimie-access-root form{display:flex;flex-wrap:wrap;gap:10px;align-items:stretch}
#chimie-access-root input{min-width:0;flex:1 1 220px;font:normal 18px Arial,sans-serif;
 padding:15px 17px;border:1px solid #877c65;border-radius:2px;background:white;color:#172b20}
#chimie-access-root button{padding:15px 24px;border:0;border-radius:2px;
 background:#203d2c;color:#fff9e9;font:700 13px Arial,sans-serif;letter-spacing:.08em;cursor:pointer}
#chimie-access-root button:hover{background:#7e302b}
#chimie-access-root .access-error{min-height:24px;color:#9b2624;font:600 14px/1.5 Arial,sans-serif;margin:13px 0 0}
#chimie-access-root .access-footer{border-top:1px solid #b8a989;padding-top:18px;margin-top:16px;
 font:normal 12px/1.5 Arial,sans-serif;letter-spacing:.03em;color:#516454}
#chimie-access-root input:focus-visible,#chimie-access-root button:focus-visible{outline:3px solid #a36b3c;outline-offset:3px}
@media(max-width:580px){#chimie-access-root form{flex-direction:column}#chimie-access-root button{min-height:48px}}
`;
(document.head||document.documentElement).appendChild(style);
const init=()=>{
 if(!document.body)return;
 const root=document.createElement('section');root.id='chimie-access-root';
 root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');
 root.setAttribute('aria-labelledby','chimie-access-title');
 root.innerHTML='<div class="access-card"><span class="access-eyebrow">CLÉMENT SANCHEZ · COLLÈGE DE FRANCE</span>'+
 '<h1 id="chimie-access-title">Atlas des matériaux hybrides vivants</h1>'+
 '<p>Ce site est actuellement accessible sur invitation. Saisissez le code communiqué pour consulter les 70 planches, les modèles et les ressources scientifiques.</p>'+
 '<form id="chimie-access-form"><label for="chimie-access-input" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)">Code d’accès</label>'+
 '<input id="chimie-access-input" type="password" autocomplete="off" required spellcheck="false" placeholder="Code d’accès" aria-describedby="chimie-access-error">'+
 '<button type="submit">ACCÉDER AU SITE</button></form><p class="access-error" id="chimie-access-error" aria-live="polite"></p>'+
 '<div class="access-footer">Conférence source : Clément Sanchez, Collège de France, 18 février 2020 · Projet de médiation scientifique indépendant.</div></div>';
 document.body.appendChild(root);
 root.querySelector('#chimie-access-input').focus({preventScroll:true});
 root.querySelector('form').addEventListener('submit',async event=>{
  event.preventDefault();
  const field=root.querySelector('#chimie-access-input'),error=root.querySelector('#chimie-access-error');
  if(!crypto?.subtle){error.textContent='Ce navigateur ne permet pas la vérification du code.';return}
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(field.value));
  const hex=Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');
  if(hex!==expected){error.textContent='Code incorrect.';field.select();return}
  try{sessionStorage.setItem(key,expected)}catch(_){}
  document.documentElement.classList.remove('chimie-access-locked');root.remove();style.remove();
 });
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
