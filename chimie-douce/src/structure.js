import * as THREE from 'three';
const RADII={H:.31,C:.76,N:.71,O:.66,F:.57,Na:1.66,Mg:1.41,Al:1.21,Si:1.11,P:1.07,S:1.05,Cl:1.02,K:2.03,Ca:1.76,Fe:1.24,Co:1.26,Ni:1.24,Cu:1.32,Zn:1.22,Zr:1.75};
const COLORS={H:0xf1f3f4,C:0x5e8290,N:0x3f76d2,O:0xe66762,F:0x74bf84,Na:0xbca0d7,Mg:0x6db79b,Al:0xb5c6cd,Si:0xc1ab76,P:0xdb9c5b,S:0xe0bd57,Cl:0x86be77,K:0xa47cce,Ca:0x9bcaa0,Fe:0xc78657,Co:0x9876ab,Ni:0x66a68a,Cu:0xc48a61,Zn:0xb0c3cd,Zr:0x75a4b0};
const trimElement=s=>{const match=String(s||'').replace(/\d+/g,'').match(/[A-Za-z]{1,2}/);if(!match)return 'C';const raw=match[0];return raw[0].toUpperCase()+raw.slice(1).toLowerCase()};
const cleanNum=s=>Number(String(s||'').replace(/\(.+\)$/,'').replace(/['"]/g,''));
const cifCell=(vals)=>{
 const [a,b,c,A,B,G]=['a','b','c','alpha','beta','gamma'].map(k=>vals[k]);if(![a,b,c,A,B,G].every(x=>Number.isFinite(x)&&x>0))return null;
 const deg=Math.PI/180,al=A*deg,be=B*deg,ga=G*deg;const u=new THREE.Vector3(a,0,0),v=new THREE.Vector3(b*Math.cos(ga),b*Math.sin(ga),0);
 const cx=c*Math.cos(be),cy=c*(Math.cos(al)-Math.cos(be)*Math.cos(ga))/Math.sin(ga),cz=Math.sqrt(Math.max(0,c*c-cx*cx-cy*cy));const w=new THREE.Vector3(cx,cy,cz);
 return [u,v,w];
};
export function parseStructure(filename,text){const ext=filename.toLowerCase().split('.').pop();const atoms=[];let cell=null,warning='';const lines=text.replace(/\r/g,'').split('\n');
 if(ext==='xyz'){
  const start=/^\d+\s*$/.test(lines[0]?.trim())?2:0;
  for(const raw of lines.slice(start)){
   const p=raw.trim().split(/\s+/);if(p.length<4)continue;const xyz=p.slice(1,4).map(Number);if(xyz.every(Number.isFinite))atoms.push({element:trimElement(p[0]),pos:new THREE.Vector3(...xyz)});
  }
  warning='Positions cartésiennes importées (unités XYZ présumées en ångströms). Les liaisons sont déduites heuristiquement des distances.';
 }else if(ext==='cif'){
  const vals={};for(const k of ['a','b','c','alpha','beta','gamma']){const term=k.length===1?'_cell_length_'+k:'_cell_angle_'+k;const m=text.match(new RegExp(term+'\\s+([^\\s#]+)','i'));vals[k]=m?cleanNum(m[1]):NaN}cell=cifCell(vals);
  if(!cell)throw Error('CIF : paramètres de maille incomplets ou invalides.');
  let headers=[],inLoop=false;
  for(let i=0;i<lines.length;i++){
   let line=lines[i].trim();if(!line||line.startsWith('#'))continue;
   if(line==='loop_'){inLoop=true;headers=[];continue}
   if(line.startsWith('_')){if(inLoop)headers.push(line.split(/\s+/)[0].toLowerCase());continue}
   if(!inLoop||!headers.length)continue;
   const ix=headers.findIndex(x=>x==='_atom_site_fract_x'),iy=headers.findIndex(x=>x==='_atom_site_fract_y'),iz=headers.findIndex(x=>x==='_atom_site_fract_z');
   if(ix<0||iy<0||iz<0)continue;
   const p=line.replace(/'([^']*)'/g,'$1').split(/\s+/);if(p.length<headers.length)continue;
   const x=cleanNum(p[ix]),y=cleanNum(p[iy]),z=cleanNum(p[iz]);if(![x,y,z].every(Number.isFinite))continue;
   const ie=headers.findIndex(x=>x==='_atom_site_type_symbol'),il=headers.findIndex(x=>x==='_atom_site_label');const element=trimElement(p[ie>=0?ie:il]);
   atoms.push({element,pos:cell[0].clone().multiplyScalar(x).addScaledVector(cell[1],y).addScaledVector(cell[2],z)});
  }
  warning='CIF : les sites fractionnaires sont transformés en coordonnées cartésiennes. Les opérations de symétrie, désordres et occupations partielles ne sont PAS développés ; cette vue peut ne contenir que l’unité asymétrique.';
 }else throw Error('Format non pris en charge : importez un .xyz ou un .cif.');
 if(!atoms.length)throw Error('Aucun site atomique XYZ/CIF exploitable trouvé dans ce fichier.');
 if(atoms.length>450)throw Error('Structure trop grande pour ce lecteur expérimental (450 atomes maximum dans le fichier).');
 return {atoms,cell,warning,filename};
}
let imported={atoms:[{element:'O',pos:new THREE.Vector3(0,0,0)},{element:'H',pos:new THREE.Vector3(.757,0,.586)},{element:'H',pos:new THREE.Vector3(-.757,0,.586)}],filename:'démonstration — H₂O',cell:null,warning:'Molécule d’eau illustrative : trois positions cartésiennes fixées. Importez un fichier scientifique pour travailler sur ses coordonnées.'};
export const setImportedStructure=x=>{imported=x};
export const getImportedStructure=()=>imported;
export function createStructureModel(params){const root=new THREE.Group(),atoms=imported.atoms;const points=atoms.map(a=>a.pos);const min=new THREE.Vector3(Infinity,Infinity,Infinity),max=new THREE.Vector3(-Infinity,-Infinity,-Infinity);for(const p of points){min.min(p);max.max(p)}const size=max.clone().sub(min),maxSize=Math.max(size.length(),1.4);const scale=Math.min(2,7/maxSize);const center=min.clone().add(max).multiplyScalar(.5);const coords=points.map(p=>p.clone().sub(center).multiplyScalar(scale));
 const sphereGeo=new THREE.SphereGeometry(1,16,12);for(let i=0;i<atoms.length;i++){const a=atoms[i],r=(RADII[a.element]||1.15)*(.18+params.atomRadius/150)*scale;const material=new THREE.MeshStandardMaterial({color:COLORS[a.element]||0xc4a2bd,metalness:.16,roughness:.36});const mesh=new THREE.Mesh(sphereGeo,material);mesh.position.copy(coords[i]);mesh.scale.setScalar(Math.max(.055,Math.min(.55,r)));root.add(mesh)}
 if(params.bonds>0){const bondMat=new THREE.MeshStandardMaterial({color:0xb7d0cf,metalness:.24,roughness:.4});const maxBond=atoms.length>200?0:atoms.length;for(let i=0;i<maxBond;i++)for(let j=i+1;j<maxBond;j++){const dist=atoms[i].pos.distanceTo(atoms[j].pos);const threshold=(RADII[atoms[i].element]||1)+(RADII[atoms[j].element]||1);if(dist<.3||dist>threshold*(.99+params.bonds/300))continue;const diff=coords[j].clone().sub(coords[i]);const rod=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,diff.length(),6),bondMat);rod.position.copy(coords[i]).addScaledVector(diff,.5);rod.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),diff.normalize());root.add(rod)}}
 if(imported.cell&&params.cell>0){const [a,b,c]=imported.cell,vertices=[new THREE.Vector3(),a,b,c,a.clone().add(b),a.clone().add(c),b.clone().add(c),a.clone().add(b).add(c)];const ij=[[0,1],[0,2],[0,3],[1,4],[1,5],[2,4],[2,6],[3,5],[3,6],[4,7],[5,7],[6,7]];const array=[];for(const [i,j] of ij)array.push(...vertices[i].clone().sub(center).multiplyScalar(scale).toArray(),...vertices[j].clone().sub(center).multiplyScalar(scale).toArray());const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(array,3));root.add(new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0xd3a66a,transparent:true,opacity:params.cell/130})))}
 return {root,tick:()=>{},warning:imported.warning};
}