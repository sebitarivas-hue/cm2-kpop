import {ORGANIC_IMAGES} from './ingenierie/organic-images.js';
const safe=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dest=document.getElementById('organicHomeCards');
if(dest){
 dest.innerHTML=ORGANIC_IMAGES.map((f,i)=>'<article class="home-organic-card"><a href="./ingenierie/?mode='+encodeURIComponent(f.key)+'" class="home-organic-link" aria-label="Comparer '+safe(f.title)+' avec le modèle tridimensionnel"><div class="home-organic-media"><img src="'+safe(f.src)+'" alt="'+safe(f.subtitle)+'" loading="lazy" referrerpolicy="no-referrer"><span class="home-organic-index">0'+(i+1)+' / 05</span><span class="home-organic-cta">OBSERVER → MODÉLISER ↗</span></div><div class="home-organic-caption"><h3>'+safe(f.title)+'</h3><p>'+safe(f.caption)+'</p></div></a><div class="home-organic-credit">© '+safe(f.author)+' · <a href="'+safe(f.source)+'" target="_blank" rel="noopener noreferrer">SOURCE & LICENCE ↗</a></div></article>').join('');
 dest.querySelectorAll('img').forEach(img=>{img.addEventListener('error',()=>{img.hidden=true;const wrap=img.closest('.home-organic-media');if(wrap&&!wrap.querySelector('.home-photo-error'))wrap.insertAdjacentHTML('beforeend','<span class="home-photo-error">Vignette indisponible · consulter la source ↗</span>')})})
}
