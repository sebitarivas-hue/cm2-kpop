/*
 * Monograph illustration enhancement. Source notes stay untouched,
 * reconstructed images are supplementary and link back to canonical comparisons.
 */
import {redesignedPlate,redesignedIds} from './redesigned-plates.js';
for(const id of redesignedIds()){
 const entry=document.getElementById('figure-'+id);
 const art=redesignedPlate(id);
 if(!entry||!art||entry.querySelector('.research-redrawn'))continue;
 const figure=document.createElement('figure');
 figure.className='research-redrawn';
 const a=document.createElement('a');
 a.href='../planches/?figure='+id;
 a.title='Comparer la reconstruction et la diapositive du cours';
 const img=document.createElement('img');
 img.src=art.src;img.loading='lazy';img.decoding='async';
 img.alt='Reconstruction scientifique conceptuelle de la figure '+id;
 img.width=1400;img.height=1050;
 a.append(img);figure.append(a);
 const caption=document.createElement('figcaption');
 caption.textContent='ILLUSTRATION SCIENTIFIQUE RECONSTRUITE — ni micrographie ni donnée expérimentale. Comparer avec la diapositive originale.';
 figure.append(caption);
 entry.insertBefore(figure,entry.querySelector('p')||null);
}
const style=document.createElement('style');
style.textContent=`
.figure-note .research-redrawn{margin:18px 0 20px;max-width:100%;background:#102519;border:1px solid #ad9f83}
.figure-note .research-redrawn img{display:block;width:100%;height:auto;object-fit:contain}
.figure-note .research-redrawn figcaption{padding:10px 14px;color:#f1e8d4;font:600 11px/1.5 system-ui,sans-serif;letter-spacing:.025em}
.figure-note .research-redrawn a:focus-visible{outline:3px solid #bc8a50;outline-offset:3px}
@media(max-width:780px){.figure-note .research-redrawn{margin:12px 0}.figure-note .research-redrawn figcaption{font-size:12px}}
`;
document.head.append(style);
