import {ORGANIC_IMAGES,getOrganicImage} from './organic-images.js';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const lookup=id=>document.getElementById(id);
const fallback=(img,info)=>{img.hidden=true;const d=img.nextElementSibling;if(d)d.hidden=false;d?.querySelector('a')?.setAttribute('href',info.source)};
function photoMarkup(info,large=false){
 return '<img class="natural-photo" src="'+esc(info.src)+'" alt="'+esc(info.subtitle)+'" loading="'+(large?'eager':'lazy')+'" referrerpolicy="no-referrer">'+
 '<div class="photo-fallback" hidden><strong>Image externe indisponible</strong><a href="'+esc(info.source)+'" target="_blank" rel="noopener noreferrer">Consulter la micrographie sur Wikimedia Commons ↗</a></div>';
}
function setObservation(id){
 const info=getOrganicImage(id),box=lookup('naturalObservation');
 if(!box)return;
 box.innerHTML='<div class="observed-photo">'+photoMarkup(info,true)+
 '<div class="photo-seal">01 / OBSERVATION PHOTOGRAPHIQUE</div></div>'+
 '<figcaption><span class="observation-topic">'+esc(info.title)+'</span><p>'+esc(info.caption)+'</p>'+
 '<div class="photo-citation">© '+esc(info.author)+' · <a href="'+esc(info.licenseUrl)+'" target="_blank" rel="noopener noreferrer">'+esc(info.license)+'</a> · <a href="'+esc(info.source)+'" target="_blank" rel="noopener noreferrer">FICHIER SOURCE ↗</a></div></figcaption>';
 box.querySelectorAll('img').forEach(img=>img.onerror=()=>fallback(img,info));
 const note=lookup('observationMechanism');if(note)note.textContent=info.mechanism;
 const link=lookup('observationSource');if(link)link.href=info.source;
 const label=lookup('observedTitle');if(label)label.textContent=info.title;
}
function renderGallery(){
 const g=lookup('naturalGallery');if(!g)return;
 g.innerHTML=ORGANIC_IMAGES.map((info,i)=>'<article class="natural-card"><a class="natural-card-image" href="#engineering" data-organic="'+esc(info.key)+'" aria-label="Explorer le mécanisme 3D associé à '+esc(info.title)+'">'+photoMarkup(info,false)+
 '<span class="natural-number">0'+(i+1)+' / 05</span></a><div class="natural-card-copy"><span class="natural-label">OBSERVATION / ARCHIVE SCIENTIFIQUE</span><h3>'+esc(info.title)+'</h3><p>'+esc(info.caption)+'</p>'+
 '<div class="natural-card-bridge">'+esc(info.mechanism)+'</div><div class="natural-credits">© '+esc(info.author)+' · <a href="'+esc(info.licenseUrl)+'" target="_blank" rel="noopener noreferrer">'+esc(info.license)+'</a></div><div class="natural-card-actions"><button type="button" data-view="'+esc(info.key)+'">COMPARER AVEC LE MODÈLE 3D ↗</button><a href="'+esc(info.source)+'" target="_blank" rel="noopener noreferrer">SOURCE & LICENCE ↗</a></div></div></article>').join('');
 g.querySelectorAll('img').forEach((img,i)=>{const a=img.closest('.natural-card'),info=ORGANIC_IMAGES.find(o=>o.key===a.querySelector('[data-organic]')?.dataset.organic);img.onerror=()=>fallback(img,info)});
 g.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{const mode=b.dataset.view;window.dispatchEvent(new CustomEvent('chimie:requestMode',{detail:{id:mode}}));lookup('engineering')?.scrollIntoView({behavior:'smooth',block:'start'})});
 g.querySelectorAll('[data-organic]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();window.dispatchEvent(new CustomEvent('chimie:requestMode',{detail:{id:a.dataset.organic}}));lookup('engineering')?.scrollIntoView({behavior:'smooth',block:'start'})}));
}
renderGallery();setObservation(new URLSearchParams(location.search).get('mode')||'vegetal');
window.addEventListener('chimie:mode',e=>setObservation(e.detail?.id));
