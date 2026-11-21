import {FIGURES} from '../src/figures.js';
import {SCENES,videoAt} from '../src/content.js';
import {figureIllustration} from '../src/illustrations.js';
for(const f of FIGURES){const e=document.getElementById('figure-'+f.id);if(!e)continue;
 const div=document.createElement('div');div.className='fig-preview';div.innerHTML=figureIllustration(f,false);e.prepend(div);
 const links=document.createElement('div');links.className='fig-more';
 const nearest=SCENES.map(s=>({...s,d:Math.abs(s.time-f.time)})).sort((a,b)=>a.d-b.d)[0];
 links.innerHTML='<a href="../planches/?figure='+f.id+'">VOIR LA PLANCHE REDESSINÉE ↗</a><a href="../bibliographie/?figure='+f.id+'">ÉTUDES CONNEXES ↗</a><a target="_blank" rel="noopener noreferrer" href="'+videoAt(f.time)+'">DIAPOSITIVE ORIGINALE À '+Math.floor(f.time/60)+':'+String(f.time%60).padStart(2,'0')+' ↗</a>'+(nearest?'<a href="../#'+nearest.id+'">MODÈLE 3D : '+nearest.title+' ↗</a>':'');
 e.append(links);
}
