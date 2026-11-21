import {FIGURES} from '../src/figures.js';
import {SCENES,videoAt} from '../src/content.js';
import {plateAsset,sceneResources} from '../src/knowledge-graph.js';
for(const f of FIGURES){const e=document.getElementById('figure-'+f.id);if(!e)continue;
 const div=document.createElement('div');div.className='fig-preview';div.innerHTML='<a href="../planches/?figure='+f.id+'" title="Voir cette planche originale dans l’archive"><img class="original-plate-thumbnail" src="'+plateAsset(f.id)+'" alt="Planche originale du cours, figure '+f.id+' : '+f.title+'" loading="lazy"></a>';e.prepend(div);
 const links=document.createElement('div');links.className='fig-more';
 const related=SCENES.filter(s=>sceneResources(s.id)?.plates.some(p=>p.id===f.id));const nearest=related[0]||null;
 links.innerHTML='<a href="../planches/?figure='+f.id+'">OUVRIR L’ORIGINAL EN GRAND ↗</a><a href="../bibliographie/?figure='+f.id+'">ÉTUDES CONNEXES ↗</a><a target="_blank" rel="noopener noreferrer" href="'+videoAt(f.time)+'">DIAPOSITIVE ORIGINALE À '+Math.floor(f.time/60)+':'+String(f.time%60).padStart(2,'0')+' ↗</a>'+(nearest?'<a href="../#'+nearest.id+'">MODÈLE 3D : '+nearest.title+' ↗</a>':'');
 e.append(links);
}
