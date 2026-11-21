import * as THREE from 'three';
import {createStructureModel} from './structure.js';
const C={teal:0x749d85,cyan:0xa1bca0,gold:0xc3a67c,amber:0xd8bc91,blue:0x668f85,violet:0x9a9982,purple:0x8a8d72,coral:0xb78f7a,white:0xe8e0cc,green:0x88a36c,dark:0x253e33};
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const mat=(color,opts={})=>new THREE.MeshStandardMaterial({color,metalness:0,roughness:.78,...opts});
const glass=(color,opacity=.2)=>new THREE.MeshPhysicalMaterial({color,roughness:.58,metalness:0,transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide,transmission:0});
const glow=(color)=>new THREE.MeshBasicMaterial({color,transparent:true,opacity:.82});
const sph=new THREE.SphereGeometry(1,12,8);
const hex=new THREE.IcosahedronGeometry(1,0);
const M={gold:mat(C.gold,{metalness:.04,roughness:.69}),cyan:mat(C.cyan,{metalness:0,roughness:.73}),blue:mat(C.blue),teal:mat(C.teal),purple:mat(C.purple),coral:mat(C.coral),green:mat(C.green),white:mat(C.white),dark:mat(C.dark)};
function rand(seed=42){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296}}
function sphere(parent,pos,r,material=M.cyan,geom=sph){const m=new THREE.Mesh(geom,material);m.position.copy(pos);m.scale.setScalar(r);parent.add(m);return m}
function rod(parent,p1,p2,r=.024,material=M.cyan){const diff=p2.clone().sub(p1);const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,diff.length(),7),material);m.position.copy(p1).addScaledVector(diff,.5);m.quaternion.setFromUnitVectors(V(0,1,0),diff.normalize());parent.add(m);return m}
function wireCurve(parent,points,r,material){const curve=new THREE.CatmullRomCurve3(points);const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(12,points.length*4),r,5,false),material);parent.add(mesh);return mesh}
function instanced(parent,count,r,material,seed,positionFn){const mesh=new THREE.InstancedMesh(sph,material,count);const obj=new THREE.Object3D(),rng=rand(seed);for(let i=0;i<count;i++){const p=positionFn(i,rng);obj.position.set(p[0],p[1],p[2]);obj.scale.setScalar(typeof p[3]==='number'?p[3]:r);obj.rotation.set(0,0,0);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix)}mesh.instanceMatrix.needsUpdate=true;parent.add(mesh);return mesh}
function torus(parent,center,R,r=.02,material=M.cyan,rotation=[0,0,0]){const obj=new THREE.Mesh(new THREE.TorusGeometry(R,r,7,70),material);obj.position.copy(center);obj.rotation.set(...rotation);parent.add(obj);return obj}
function boxFrame(parent,width,height,depth,materialColor=C.teal){const edges=new THREE.EdgesGeometry(new THREE.BoxGeometry(width,height,depth));const o=new THREE.LineSegments(edges,new THREE.LineBasicMaterial({color:materialColor,transparent:true,opacity:.35}));parent.add(o);return o}
function shadowFloor(root){const g=new THREE.GridHelper(20,22,0x1a4251,0x103039);g.position.y=-3.65;g.material.transparent=true;g.material.opacity=.25;root.add(g)}
function nucleus(root,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);root.add(g);let prev=null;for(let i=0;i<90;i++){const t=i/89*Math.PI*6,p=V(Math.cos(t)*.32,Math.sin(t)*.32,(i/89-.5)*2.3);sphere(g,p,.043,i%4?M.cyan:M.gold);if(prev)rod(g,prev,p,.013,M.blue);prev=p}return g}
function bacillus(root,scale=1,opacity=.30){const g=new THREE.Group();g.scale.setScalar(scale);root.add(g);const outer=new THREE.Mesh(new THREE.CapsuleGeometry(.85,1.45,8,16),glass(C.teal,opacity));outer.rotation.z=Math.PI/2;g.add(outer);const inner=new THREE.Mesh(new THREE.CapsuleGeometry(.69,1.45,6,14),glass(C.cyan,.11));inner.rotation.z=Math.PI/2;g.add(inner);nucleus(g);for(let j=0;j<5;j++){const x=-.95+j*.48;const pts=[];for(let k=0;k<8;k++){let u=k/7;pts.push(V(x+u*1.35,(.8+u*.65)*Math.sin((j+1)*3.1+u*4.8),(.8+u*.65)*Math.cos((j+1)*3.1+u*4.8)))}wireCurve(g,pts,.015,M.gold)}return g}
function animatedParticles(root,count,radius,seed=17,color='cyan',speed=.8){const matref=M[color]||M.cyan;const pts=instanced(root,count,.052,matref,seed,(i,r)=>{const a=r()*Math.PI*2,b=(r()-.5)*Math.PI;const dist=radius+r()*.9;return [Math.cos(a)*Math.cos(b)*dist,Math.sin(b)*dist,Math.sin(a)*Math.cos(b)*dist,.038+r()*.045]});return {object:pts,tick(t){pts.rotation.y=t*.06*speed;pts.rotation.x=Math.sin(t*.25)*.13}}}
function makeSolgel(root,p){
 // Illustrative mesoscale topology, not a measured molecular structure.
 // Seeded, connected porous clusters replace the disconnected ball-and-stick cloud.
 const rng=rand(102),n=Math.max(48,Math.min(240,Math.round(p.density*1.55))),points=[];
 const spacing=1.08,half=3.0;
 const positions=[];
 for(let x=-half;x<=half;x+=spacing)for(let y=-2.65;y<=2.65;y+=spacing)for(let z=-2.65;z<=2.65;z+=spacing){
   const q=V(x+(rng()-.5)*.36,y+(rng()-.5)*.36,z+(rng()-.5)*.36);
   const cavity=((q.x-.45)/1.18)**2+((q.y+.1)/.97)**2+((q.z-.12)/1.12)**2;
   if(cavity>1.1&&rng()>.07)positions.push(q);
 }
 // Evenly subsample rather than replacing chemistry with unpredictable particles.
 const stride=Math.max(1,Math.floor(positions.length/n));
 for(let i=0;i<positions.length&&points.length<n;i+=stride)points.push(positions[i]);
 const bondGeo=new THREE.CylinderGeometry(1,1,1,8);
 const nodeGeo=new THREE.IcosahedronGeometry(1,2);
 const oxygenGeo=new THREE.IcosahedronGeometry(1,1);
 const bondMaterial=mat(0xd5dfcd,{roughness:.56,metalness:0});
 const oxMaterial=mat(0xcda46e,{roughness:.53,metalness:0});
 const nodeMaterial=mat(0xe5dfcc,{roughness:.52,metalness:0});
 const skinMaterial=glass(0xdde8d2,.08);
 const maxEdges=n*4;
 const bonds=new THREE.InstancedMesh(bondGeo,bondMaterial,maxEdges);
 const bridges=new THREE.InstancedMesh(oxygenGeo,oxMaterial,maxEdges);
 const nodes=new THREE.InstancedMesh(nodeGeo,nodeMaterial,points.length);
 const transform=new THREE.Object3D(),up=V(0,1,0);
 let count=0;
 for(let i=0;i<points.length;i++){
   const a=points[i];transform.position.copy(a);transform.quaternion.identity();
   transform.scale.setScalar(.095+(i%11===0?.046:0));transform.updateMatrix();nodes.setMatrixAt(i,transform.matrix);
   const near=points.map((b,j)=>({j,d:a.distanceTo(b)})).filter(x=>x.j>i&&x.d<1.96)
     .sort((x,y)=>x.d-y.d).slice(0,3);
   for(const {j,d} of near){
     if(count>=maxEdges)break;
     if(rng()>.56+p.bonds/240)continue;
     const b=points[j],mid=a.clone().add(b).multiplyScalar(.5),dir=b.clone().sub(a).normalize();
     transform.position.copy(mid);transform.quaternion.setFromUnitVectors(up,dir);
     transform.scale.set(.052+(.02*p.bonds/100),d,.052+(.02*p.bonds/100));
     transform.updateMatrix();bonds.setMatrixAt(count,transform.matrix);
     transform.quaternion.identity();transform.scale.setScalar(.073);transform.updateMatrix();
     bridges.setMatrixAt(count,transform.matrix);
     count++;
   }
 }
 nodes.instanceMatrix.needsUpdate=true;bonds.count=count;bonds.instanceMatrix.needsUpdate=true;
 bridges.count=count;bridges.instanceMatrix.needsUpdate=true;
 root.add(bonds,bridges,nodes);
 // Soft translucent silica volumes, localized around aggregates, not a solid bounding cage.
 const shellGeo=new THREE.IcosahedronGeometry(1,2);
 for(let i=0;i<Math.min(21,points.length);i+=1){
  const v=points[Math.floor(i*points.length/21)],bubble=new THREE.Mesh(shellGeo,skinMaterial);
  if(!v)continue;
  bubble.position.copy(v);bubble.scale.set(.38+rng()*.31,.28+rng()*.25,.32+rng()*.29);root.add(bubble);
 }
 const frame=boxFrame(root,7.25,5.75,5.75,0x9ab096);frame.material.opacity=.13;
 // Tracers illustrate transport; they are not atoms, molecules or kinetic predictions.
 const tracers=animatedParticles(root,Math.min(30,Math.round(p.motion/3)),2.8,52,'gold',p.motion/65);
 return t=>tracers.tick(t);
}
function makeCell(root,p){const b=bacillus(root,1,Math.min(.6,p.membrane/140));const particles=animatedParticles(root,p.nutrients,2.6,12,'gold',p.motion/65);return t=>{b.rotation.y=Math.sin(t*.26)*.12;particles.tick(t)}}
function makeEncapsulation(root,p){const b=bacillus(root,.72,.29);const radius=2.4+p.shell/120;const sh=new THREE.Mesh(new THREE.IcosahedronGeometry(radius,3),glass(C.teal,.13));root.add(sh);const frame=new THREE.Mesh(new THREE.IcosahedronGeometry(radius,3),new THREE.MeshBasicMaterial({color:C.cyan,wireframe:true,transparent:true,opacity:.14}));root.add(frame);const R=rand(130);for(let k=0;k<Math.round(20+p.pores*.6);k++){const theta=R()*Math.PI*2,yy=R()*2-1,ss=Math.sqrt(1-yy*yy);const pos=V(Math.cos(theta)*ss,yy,Math.sin(theta)*ss).multiplyScalar(radius+.02);sphere(root,pos,.06+(p.pores/100)*.045,k%6?M.cyan:M.gold)}const particles=animatedParticles(root,55,3.15,104,'gold',p.motion/50);return t=>{b.rotation.y=Math.sin(t*.3)*.06;frame.rotation.y=t*.025;particles.tick(t)}}
function makeMycelium(root,p){const R=rand(342),branches=p.branch;let segments=0;for(let i=0;i<Math.min(8,Math.floor(p.fibers/10));i++){const base=V((R()-.5)*5,-2.5,(R()-.5)*3),ang=R()*6.3;function grow(start,d,len,depth){if(segments>p.fibers*2||depth>branches)return;const end=start.clone().addScaledVector(d,len);rod(root,start,end,.013+(.035/(1+depth)),depth%3?M.green:M.gold);segments++;if(depth<branches){for(let k=0;k<(R()>.6?2:1);k++){const dir=d.clone().add(V((R()-.5)*1.6,(R()-.5)*.65,(R()-.5)*1.7)).normalize();grow(end,dir,len*(.63+R()*.12),depth+1)}}}grow(base,V(Math.cos(ang)*.35,.85,Math.sin(ang)*.35).normalize(),.7+R()*.5,0)}for(let i=0;i<25;i++)sphere(root,V((R()-.5)*6,-2.7+R()*.2,(R()-.5)*4),.11+R()*.18,M.dark);return t=>{root.rotation.y=Math.sin(t*.08*p.motion/100)*.045}}
function makeConcrete(root,p){const left=new THREE.Mesh(new THREE.BoxGeometry(2.7,4.5,2.2),mat(0x63727b,{roughness:.91}));left.position.x=-1.6;root.add(left);const right=left.clone();right.position.x=1.6;root.add(right);const g=new THREE.Group();root.add(g);const rr=rand(173);for(let i=0;i<p.spores;i++){const pt=V((rr()-.5)*1.25,(rr()-.5)*4,(rr()-.5)*1.5);sphere(g,pt,.09, M.gold)}for(let i=0;i<150;i++){const pt=V((rr()-.5)*1.2,(rr()-.5)*4.1,(rr()-.5)*2);const c=sphere(g,pt,.055+rr()*.11,M.white);c.scale.multiplyScalar(Math.min(1,p.healing/70))}rod(root,V(0,-2.3,1.4),V(0,2.2,1.4),.014,M.cyan);return t=>{g.rotation.y=Math.sin(t*.06)*.02}}
function makeSpore(root,p){const band=new THREE.Group();root.add(band);const film=mat(C.teal,{side:THREE.DoubleSide,transparent:true,opacity:.45});const ge=new THREE.PlaneGeometry(5.6,2.6,36,12);const mesh=new THREE.Mesh(ge,film);mesh.rotation.x=-.35;band.add(mesh);const spores=[];const R=rand(92);for(let i=0;i<p.layers*11;i++){const x=(i%11-5)*.48,y=(Math.floor(i/11)-(p.layers/2))*.24;const s=sphere(band,V(x,y,.05),.07+R()*.04,M.gold);spores.push(s)}const ar=ge.attributes.position;return t=>{const amp=p.humidity/100*.75;for(let i=0;i<ar.count;i++){let x=ar.getX(i);ar.setZ(i,Math.sin(x*.7+t*.7*p.motion/100)*amp+Math.pow(x/4,2)*amp)}ar.needsUpdate=true;ge.computeVertexNormals();spores.forEach((s,i)=>{s.position.z=.08+Math.sin(s.position.x*.7+t*.7*p.motion/100)*amp})}}
function makeLDH(root,p){const n=5;const layers=p.layers,sep=.48+p.spacing/56;for(let l=0;l<layers;l++){let y=(l-(layers-1)/2)*sep;const layer=new THREE.Group();layer.position.y=y;root.add(layer);for(let ix=-n;ix<=n;ix++)for(let iz=-n;iz<=n;iz++){const x=(ix+iz*.5)*.46,z=iz*.39;if(Math.abs(x)>3.1||Math.abs(z)>2.25)continue;const tri=(Math.abs(ix*7+iz*13)%100)<p.substitution;let a=V(x,0,z);sphere(layer,a,.092,tri?M.gold:M.teal);if((ix+iz)%2===0){const oo=new THREE.Mesh(new THREE.OctahedronGeometry(.23,0),new THREE.MeshBasicMaterial({color:C.cyan,wireframe:true,transparent:true,opacity:.12}));oo.position.copy(a);layer.add(oo)}}if(l<layers-1){const rr=rand(l*23+3);for(let k=0;k<17;k++)sphere(root,V((rr()-.5)*5,y+sep/2,(rr()-.5)*3.9),.08,k%3?M.purple:M.gold)}}return t=>{root.rotation.y=Math.sin(t*.11)*.06}}
function makeFoam(root,p){const rng=rand(291),pores=Math.min(85,p.pores),g=new THREE.Group();root.add(g);for(let i=0;i<pores;i++){const x=(rng()-.5)*6,y=(rng()-.5)*4.6,z=(rng()-.5)*4.2,r=.36+rng()*.56;const sh=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),new THREE.MeshBasicMaterial({color:i%5===0?C.gold:C.teal,wireframe:true,transparent:true,opacity:.14+p.opening/800}));sh.position.set(x,y,z);g.add(sh)}boxFrame(root,6.8,5.2,5.2);const part=animatedParticles(root,30,2.6,100,'gold',p.motion/60);return t=>part.tick(t)}
function makeDiatom(root,p){const group=new THREE.Group();root.add(group);const cylinder=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,.7,72,2,true),glass(C.gold,.22));cylinder.rotation.z=Math.PI/2;group.add(cylinder);for(let side of [-1,1]){let x=side*.35;const flat=new THREE.Mesh(new THREE.CircleGeometry(2.1,72),glass(C.teal,.16));flat.position.x=x;flat.rotation.y=Math.PI/2;group.add(flat);torus(group,V(x,0,0),2.1,.055,M.gold,[0,Math.PI/2,0]);for(let k=0;k<3;k++){const R=.45+k*.57;for(let a=0;a<p.ribs*(k+1);a++){const t=a/p.ribs/(k+1)*Math.PI*2;torus(group,V(x+side*.015,Math.cos(t)*R,Math.sin(t)*R),.067+k*.015,.014,M.cyan,[0,Math.PI/2,0])}}}return t=>{group.rotation.x=t*.08*p.motion/100;group.rotation.y=.28*Math.sin(t*.1)}}
function makePhoto(root,p){const bacteria=bacillus(root,.6,.3);bacteria.position.x=1.2;const randf=rand(800);for(let k=0;k<p.interface;k++){const x=-1.1+randf()*.8,y=(randf()-.5)*2.7,z=(randf()-.5)*2.4;sphere(root,V(x,y,z),.065,k%3===0?M.gold:M.purple)}for(let i=0;i<13;i++){const a=i/13*Math.PI*2,x=-3.2+((i%4)-2)*.1;rod(root,V(x,2.9,(i-6)*.24),V(x+.6,1.6,(i-6)*.24),.014,M.gold)}const part=animatedParticles(root,40,2.5,81,'gold',p.light/80);return t=>{part.tick(t);bacteria.rotation.y=Math.sin(t*.1)*.1}}
function makeMOF(root,p){const n=p.nodes,space=.85+p.aperture/125;const shift=(n-1)*space/2;const palette=[M.cyan,M.gold,M.purple];const pts=[];for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++){let a=V(x*space-shift,y*space-shift,z*space-shift);pts.push(a);sphere(root,a,.12,M.gold);if(x>0)rod(root,a,V((x-1)*space-shift,a.y,a.z),.028,M.teal);if(y>0)rod(root,a,V(a.x,(y-1)*space-shift,a.z),.028,M.teal);if(z>0)rod(root,a,V(a.x,a.y,(z-1)*space-shift),.028,M.teal)}for(let i=0;i<Math.min(pts.length,40);i++){if(i%3===0){const v=pts[i];sphere(root,v.clone().add(V(.14,.14,0)),.043,palette[i%3])}}return t=>{root.rotation.y=Math.sin(t*.1*p.motion/100)*.12}}
function makeZIF(root,p){const b=bacillus(root,.66,.29);const R=rand(3004);const g=new THREE.Group();root.add(g);const count=Math.round(p.shell*3.2);for(let i=0;i<count;i++){let theta=R()*Math.PI*2,z=R()*2-1,rr=Math.sqrt(1-z*z),dist=1.9+R()*.22;const q=V(Math.cos(theta)*rr*dist,z*dist,Math.sin(theta)*rr*dist);const crystal=new THREE.Mesh(hex,i%8?M.teal:M.gold);crystal.position.copy(q);crystal.scale.setScalar(.095+p.crystals/600);crystal.rotation.set(R()*5,R()*5,R()*5);g.add(crystal)}const part=animatedParticles(root,25,2.6,120,'gold',p.motion/80);return t=>{g.rotation.y=t*.027;part.tick(t);b.rotation.z=Math.sin(t*.17)*.02}}
function makeShield(root,p){const cell=new THREE.Mesh(new THREE.SphereGeometry(1.65,32,20),glass(C.cyan,.25));root.add(cell);const nuc=sphere(root,V(0,0,0),.57,M.purple);const R=rand(4500);for(let i=0;i<p.coverage*2.8;i++){let t=R()*Math.PI*2,z=R()*2-1,s=Math.sqrt(1-z*z),rad=1.68+R()*.1;const particle=sphere(root,V(Math.cos(t)*s*rad,z*rad,Math.sin(t)*s*rad),.035+p.size/420,i%7?M.gold:M.cyan);particle.rotation.x=R()*3}return t=>{nuc.rotation.y=t*.1}}
function makeCryo(root,p){const b=bacillus(root,.68,.28);const R=rand(722);const flakes=new THREE.Group();root.add(flakes);for(let i=0;i<p.ice;i++){let x=(R()-.5)*6,y=(R()-.5)*5,z=(R()-.5)*4;const f=new THREE.Group();f.position.set(x,y,z);flakes.add(f);for(let a=0;a<3;a++){const angle=a*Math.PI/3;rod(f,V(-.11*Math.cos(angle),-.11*Math.sin(angle),0),V(.11*Math.cos(angle),.11*Math.sin(angle),0),.012,M.white)}}return t=>{flakes.rotation.y=t*.012*p.motion/50}}
function makePrint(root,p){const g=new THREE.Group();root.add(g);let z0=(p.layers-1)*.16/2;for(let l=0;l<p.layers;l++){let y=l*.17-1.9,along=l%2===0,amount=7;for(let k=0;k<amount;k++){const off=(k-(amount-1)/2)*(.25+p.spacing/175);const from=along?V(-2.3,y,off):V(off,y,-2.3),to=along?V(2.3,y,off):V(off,y,2.3);rod(g,from,to,.052, l%3===0?M.gold:M.teal)}}const nozzle=new THREE.Mesh(new THREE.ConeGeometry(.35,1.1,20),M.white);nozzle.rotation.z=Math.PI;nozzle.position.set(0,.45,0);root.add(nozzle);const tip=sphere(root,V(0,-.18,0),.09,M.gold);return t=>{const step=(t*(p.motion/100))%8;nozzle.position.x=Math.sin(step)*1.9;tip.position.x=nozzle.position.x;nozzle.position.y=.45+.03*Math.sin(step*2)}}
function makeFuel(root,p){const water=glass(C.teal,.095);const chamber1=new THREE.Mesh(new THREE.BoxGeometry(2.8,3.1,3),water);chamber1.position.x=-2.15;root.add(chamber1);const chamber2=chamber1.clone();chamber2.position.x=2.15;root.add(chamber2);const membrane=new THREE.Mesh(new THREE.BoxGeometry(.16,3.1,3),glass(C.gold,.2));root.add(membrane);for(let x of [-3.05,3.05]){const plate=new THREE.Mesh(new THREE.BoxGeometry(.12,2.4,2.4),M.dark);plate.position.set(x,0,0);root.add(plate)}wireCurve(root,[V(-3.05,1.4,0),V(-3.05,2.35,0),V(-1.2,2.6,0),V(0,2.6,0),V(1.2,2.6,0),V(3.05,2.35,0),V(3.05,1.4,0)],.032,M.gold);const R=rand(34);for(let k=0;k<p.biofilm;k++){const x=-3.05+(R()-.5)*.35,y=(R()-.5)*2.1,z=(R()-.5)*2.0;sphere(root,V(x,y,z),.09,M.green)}const electrons=[];for(let i=0;i<p.electron/3;i++){const e=sphere(root,V(0,0,0),.052,M.gold);electrons.push(e)}return t=>electrons.forEach((e,i)=>{let s=((i/electrons.length)+(t*p.motion/100*.13))%1;e.position.set(-3.05+6.1*s,2.6+Math.sin(s*Math.PI)*.09,0)})}
function makeCellulose(root,p){const rng=rand(280);const g=new THREE.Group();root.add(g);for(let i=0;i<p.fibers;i++){const a=V((rng()-.5)*6,(rng()-.5)*4.7,(rng()-.5)*4);const angle=rng()*Math.PI*2;const align=p.alignment/100;const b=a.clone().add(V((1-align)*Math.cos(angle)*1.6+align*1.6,(rng()-.5)*.45,(1-align)*Math.sin(angle)*1.6));wireCurve(g,[a,a.clone().lerp(b,.5).add(V(0,(rng()-.5)*.4,.1)),b],.018,i%5===0?M.gold:M.cyan)}return t=>{g.rotation.y=Math.sin(t*.08*p.motion/100)*.05}}
export function buildModel(sceneId,params){const root=new THREE.Group();root.name=sceneId;const base=new THREE.Group();root.add(base);let tick=()=>{};switch(sceneId){case 'solgel':tick=makeSolgel(base,params);break;case 'cell':tick=makeCell(base,params);break;case 'encapsulation':tick=makeEncapsulation(base,params);break;case 'mycelium':tick=makeMycelium(base,params);break;case 'concrete':tick=makeConcrete(base,params);break;case 'spore':tick=makeSpore(base,params);break;case 'ldh':tick=makeLDH(base,params);break;case 'foam':tick=makeFoam(base,params);break;case 'diatom':tick=makeDiatom(base,params);break;case 'photo':tick=makePhoto(base,params);break;case 'mof':tick=makeMOF(base,params);break;case 'zif':tick=makeZIF(base,params);break;case 'shield':tick=makeShield(base,params);break;case 'cryo':tick=makeCryo(base,params);break;case 'print':tick=makePrint(base,params);break;case 'fuel':tick=makeFuel(base,params);break;case 'cellulose':tick=makeCellulose(base,params);break;case 'structure':{const structure=createStructureModel(params);base.add(structure.root);tick=structure.tick;break}default:tick=makeSolgel(base,params)}
 return {root,tick};}
export function disposeModel(root){if(!root)return;root.traverse(o=>{if(o.geometry && o.geometry!==sph && o.geometry!==hex)o.geometry.dispose();if(o.material && !Object.values(M).includes(o.material) && !(o.material instanceof THREE.MeshStandardMaterial && o.material.userData?.shared)){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{if(m.dispose)m.dispose()})}})}
export {C};