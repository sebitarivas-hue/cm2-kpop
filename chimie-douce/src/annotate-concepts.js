import {ensureConceptDialog} from './concept-ui.js';
const pairs=[
 ['cellulose bactérienne','cellulose'],['hydroxydes doubles lamellaires','ldh'],['hydroxydes lamellaires','ldh'],['cristallographie','crystallography'],
 ['biominéralisation','biomineralization'],['bio-impression','bioprinting'],['biofabrication','biofabrication'],['immuno-isolation','immunoisolation'],
 ['cryopréservation','cryoprotection'],['cryoprotection','cryoprotection'],['nanofibrilles','nanofiber'],['mycélium','mycelium'],
 ['microporosité','porosity'],['macroporosité','porosity'],['connectivité des pores','porosity'],['porosité','porosity'],
 ['diffusion','diffusion'],['viabilité','viability'],['encapsulation','encapsulation'],['hydrolyse','hydrolysis'],['condensation','condensation'],
 ['intercalation','intercalation'],['gélification','gelation'],['sol–gel','solgel'],['sol-gel','solgel'],
 ['matériau métallo-organique','mof'],['ZIF-8','zif8'],['MOFs','mof'],['MOF','mof'],
 ['diatomées','diatom'],['biofilm','biofilm'],['bio-encre','bioink'],['ligand','ligand'],['nucléation','nucleation'],['effet thermoélectrique','thermoelectric'],
 ['pile microbienne','microbialfuel'],['spores','spores'],['hyphes','hyphae']
];
const sorted=pairs.sort((a,b)=>b[0].length-a[0].length);
const escape=s=>s.replace(/[\\^$.*+?()[\]{}|]/g,'\\$&');
const rex=new RegExp(sorted.map(([w])=>escape(w)).join('|'),'gi');
function markParagraph(p){
 if(p.closest('.figure-note,nav,.resource-graph,aside,[data-no-translate]'))return;
 const walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT),nodes=[];let n;while(n=walker.nextNode())if(n.nodeValue.trim()&&!n.parentElement.closest('a,button,code,pre,script,style'))nodes.push(n);
 let count=0;
 for(const node of nodes){if(count>=2)break;const text=node.nodeValue;rex.lastIndex=0;const m=rex.exec(text);if(!m)continue;const pair=sorted.find(([s])=>s.toLocaleLowerCase('fr')===m[0].toLocaleLowerCase('fr'));if(!pair)continue;const before=text.slice(0,m.index),after=text.slice(m.index+m[0].length);const frag=document.createDocumentFragment();if(before)frag.append(document.createTextNode(before));const btn=document.createElement('button');btn.className='inline-concept';btn.type='button';btn.dataset.concept=pair[1];btn.title='Ouvrir la définition scientifique et les images originales';btn.textContent=m[0]+' ⓘ';frag.append(btn);if(after)frag.append(document.createTextNode(after));node.replaceWith(frag);count++;}
}
export function annotateConcepts(root=document.querySelector('main')||document.body){
 ensureConceptDialog();
 for(const p of root.querySelectorAll('p'))markParagraph(p);
}
