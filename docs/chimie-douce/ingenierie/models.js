import * as THREE from 'three';

// This module constructs visual hypotheses, not resolved molecular structures.
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
function prng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
const palette={gold:0xdcb986,light:0xece1c3,mint:0x8adabe,teal:0x398b79,forest:0x245445,deep:0x0e3439,petal:0xc4e7b3,crystal:0x86e1d4,amber:0xe2ab73,spore:0xc9bc96};
function material(color,extra={}){return new THREE.MeshStandardMaterial({color,roughness:.62,metalness:.04,...extra});}
const gold=()=>material(palette.gold,{metalness:.25,roughness:.36});
const green=()=>material(palette.forest,{roughness:.78,side:THREE.DoubleSide});
const darkGreen=()=>material(0x356e52,{side:THREE.DoubleSide,roughness:.82});
const lightGreen=()=>material(0x83b582,{side:THREE.DoubleSide,roughness:.78});
function tube(root,pts,radius,color,steps=12,opacity=1){
 const p=pts.map(a=>a.isVector3?a:new THREE.Vector3(...a));
 const curve=new THREE.CatmullRomCurve3(p);
 const geo=new THREE.TubeGeometry(curve,Math.max(8,steps),radius,6,false);
 const m=material(color,{transparent:opacity<1,opacity,depthWrite:opacity===1,roughness:.68});
 const mesh=new THREE.Mesh(geo,m);mesh.userData.fullIndex=geo.index?.count??0;root.add(mesh);
 return {mesh,curve};
}
function sphere(root,pos,r,color,opts={}){const geo=new THREE.IcosahedronGeometry(r,opts.detail??2);const mesh=new THREE.Mesh(geo,material(color,opts.material||{}));mesh.position.copy(pos);root.add(mesh);return mesh;}
function leaf(root,base,dir,length,width,index){
 const n=18,across=10,v=[],uv=[],ind=[];
 const along=dir.clone().normalize();let normal=V(0,0,1);
 if(Math.abs(along.dot(normal))>.92)normal=V(0,1,0);
 const side=new THREE.Vector3().crossVectors(along,normal).normalize();
 const bend=normal.clone().multiplyScalar((index%2?1:-1)*.12*length);
 for(let i=0;i<=n;i++){const t=i/n;const w=Math.pow(Math.sin(Math.PI*t),.85)*width;
  const axis=base.clone().addScaledVector(along,t*length).addScaledVector(bend,Math.sin(Math.PI*t)*.65);
  for(let j=0;j<=across;j++){const s=(j/across*2-1),p=axis.clone().addScaledVector(side,s*w).addScaledVector(normal,.13*width*Math.sin(Math.PI*t)*(1-s*s));v.push(p.x,p.y,p.z);uv.push(t,j/across);}
 }
 for(let i=0;i<n;i++)for(let j=0;j<across;j++){const a=i*(across+1)+j,b=a+across+1;ind.push(a,a+1,b,a+1,b+1,b);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(ind);geo.computeVertexNormals();
 const colors=[0x32694c,0x487f59,0x6f9866,0x8ab582];const mesh=new THREE.Mesh(geo,material(colors[index%colors.length],{side:THREE.DoubleSide,roughness:.88,transparent:true,opacity:.95}));root.add(mesh);
 const stem=axisPath(base,along,length,bend);tube(root,stem,.011,0xd0b483,14);
 // Explicit veins, not decorative random fine lines.
 const veins=[];for(let t=.22;t<.9;t+=.21){const b=base.clone().addScaledVector(along,t*length).addScaledVector(bend,Math.sin(Math.PI*t)*.65);const m=width*Math.pow(Math.sin(Math.PI*t),.85);for(const sign of [-1,1]){const target=b.clone().addScaledVector(side,sign*m*.88).addScaledVector(along,length*.1);veins.push(tube(root,[b,b.clone().addScaledVector(side,sign*m*.46).addScaledVector(along,length*.055),target],.005,0xb1c28d,6));}}
 return {mesh,veins};
}
function axisPath(base,along,length,bend){const a=[];for(let i=0;i<=8;i++){const t=i/8;a.push(base.clone().addScaledVector(along,t*length).addScaledVector(bend,Math.sin(Math.PI*t)*.65));}return a;}
function plant(params){
 const root=new THREE.Group(),rng=prng(1183),woody=material(0x8d936c,{roughness:.91});
 const stems=[],leaves=[],roots=[],minerals=[];
 // Anatomical branching tree: a central stem, lateral spiral phyllotaxy, ribbed leaves, roots.
 const mainPts=[];for(let i=0;i<=20;i++){let t=i/20;mainPts.push(V(.09*Math.sin(3.3*t),-1.6+4.4*t,.13*Math.sin(5*t)));}
 const main=tube(root,mainPts,.052,0xa6af88,40);stems.push({obj:main,threshold:0});
 sphere(root,V(0,-1.67,0),.38,0x3b5244,{detail:1});
 for(let i=0;i<33;i++){
  const theta=i*2.399963229728653;const h=.2+.71*i/33;const y=-1.55+h*4.35;
  const base=V(.09*Math.sin(3.3*h),y,.13*Math.sin(5*h));
  const az=V(Math.cos(theta),0,Math.sin(theta));
  const dist=.55+1.2*(1-h)+rng()*.4;
  const tip=base.clone().addScaledVector(az,dist).add(V(0,(.19+rng()*.32)*dist,0));
  const ctrl=base.clone().lerp(tip,.53).add(V(0,.24*dist,0));
  const branch=tube(root,[base,ctrl,tip],.017+(.017*(1-h)),0x9ca987,16);
  const threshold=.07+.55*h;stems.push({obj:branch,threshold});
  const dir=az.clone().add(V(0,.20+rng()*.37,0)).normalize();
  const L=(.39+.42*(1-h))*(.77+rng()*.42),w=.11+.055*rng();
  const l=leaf(root,tip,dir,L,w,i);leaves.push({obj:l.mesh,veins:l.veins,threshold:.17+h*.62});
  if(i%2===0){const btip=tip.clone().addScaledVector(az,.25).add(V(0,.2,0));let ob=tube(root,[tip,btip],.008,0x83a87e,7);stems.push({obj:ob,threshold:.23+.55*h});}
 }
 for(let i=0;i<14;i++){
  const theta=i*2.3999632,rad=.42+.22*rng(),down=.5+.75*rng();const p=V(0,-1.65,0),q=V(rad*Math.cos(theta),-2.1,rad*Math.sin(theta)),t=V((rad+.48)*Math.cos(theta+.17),-2.1-down,(rad+.48)*Math.sin(theta+.17));
  const tr=tube(root,[p,q,t],.013,0x8eaf82,12);roots.push({obj:tr,threshold:.04});
 }
 const dummy=new THREE.Object3D(),count=260,inst=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.025,0),material(palette.gold,{emissive:0x71502a,emissiveIntensity:.18}),count);root.add(inst);
 const dots=[];for(let i=0;i<count;i++){const k=i%leaves.length,l=leaves[k],a=.15+rng()*.7,theta=k*2.39996323,hw=.71*k/33;
  const p=V(.09*Math.sin(3.3*hw)+(0.7+(.9*(1-hw)))*Math.cos(theta)*a,-1.55+hw*4.35+a*.25,(.7+(.9*(1-hw)))*Math.sin(theta)*a);
  p.add(V((rng()-.5)*.2,(rng()-.5)*.15,(rng()-.5)*.2));dots.push({p,threshold:.35+hw*.37+rng()*.2});}
 function tick(t,state){let growth=state.growth,coat=state.coat;main.mesh.geometry.setDrawRange(0,Math.floor(main.mesh.userData.fullIndex*Math.max(.02,growth)));
  stems.forEach(({obj,threshold})=>obj.mesh.geometry.setDrawRange(0,Math.floor(obj.mesh.userData.fullIndex*Math.max(0,Math.min(1,(growth-threshold)/.28)))));
  roots.forEach(({obj,threshold})=>obj.mesh.geometry.setDrawRange(0,Math.floor(obj.mesh.userData.fullIndex*Math.max(0,Math.min(1,(growth-threshold)/.45)))));
  leaves.forEach(({obj,veins,threshold},i)=>{const local=Math.max(0,Math.min(1,(growth-threshold)/.28));obj.visible=local>.005&&(i/33<params.density/100);obj.scale.setScalar(Math.max(.001,local));veins.forEach(v=>{v.mesh.visible=local>.05&&(i/33<params.density/100);v.mesh.material.opacity=local;});obj.material.opacity=.35+.6*local;});
  let shown=0;dots.forEach((d,i)=>{const local=(coat-d.threshold)/.11;const size=Math.max(0,Math.min(1,local));dummy.position.copy(d.p);dummy.scale.setScalar(size);dummy.rotation.set(i*1.2,i*.3,i*.8);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);if(size>.001)shown++;});inst.instanceMatrix.needsUpdate=true;root.userData.activeParticles=shown;
 }
 return {root,tick,camera:[7,4.8,10]};
}
function mycelium(params){
 const root=new THREE.Group(),rng=prng(719),branches=[],spores=[];let base=V(0,-.7,0);
 // Polarized apical extension and lateral branching; not an organism-specific growth model.
 for(let i=0;i<7;i++){let a=i*2*Math.PI/7,dirs=[];const pts=[base.clone()];for(let j=1;j<=14;j++){const radius=j*.27,phi=a+.15*Math.sin(j*.45+i);pts.push(V(radius*Math.cos(phi),-.7+.22*Math.sin(j*.31+i),radius*Math.sin(phi)));}const trunk=tube(root,pts,.045,0xb8c99e,60);branches.push({obj:trunk,birth:0,end:.65,pts,weight:1});
  for(let j=3;j<13;j+=2){for(const side of [-1,1]){let q=pts[j].clone(),outDir=a+(side*.6)+(rng()-.5)*.3;const p=[];for(let s=0;s<=9;s++){let rad=s*.2;p.push(V(q.x+rad*Math.cos(outDir+s*.11*side),q.y+.18*Math.sin(s*.7+i),q.z+rad*Math.sin(outDir+s*.11*side)));}const b=tube(root,p,.018+(.007*rng()),i%2?0xa7bb88:0x87c0ac,32);branches.push({obj:b,birth:.12+j*.034+rng()*.04,end:.9,pts:p,weight:.4,branchLimit:rng()});
  }}
 }
 const debris=new THREE.Group();root.add(debris);for(let i=0;i<45;i++){let a=rng()*6.28,r=Math.sqrt(rng())*4;const s=sphere(debris,V(r*Math.cos(a),-1.06+(rng()-.5)*.1,r*Math.sin(a)),.045+rng()*.08,i%4?0x254a40:0x598069,{detail:0});s.scale.y=.28;}
 const n=48,particles=new THREE.InstancedMesh(new THREE.SphereGeometry(.037,6,5),material(palette.gold,{emissive:palette.amber,emissiveIntensity:.4}),n);root.add(particles);const dummy=new THREE.Object3D();
 function tick(t,state){let coverage=state.coverage;
  branches.forEach(b=>{const enabled=b.weight===1||b.branchLimit<=params.branching/100;const grow=enabled?Math.max(0,Math.min(1,(coverage-b.birth)/(b.end-b.birth))):0;b.obj.mesh.geometry.setDrawRange(0,Math.floor(b.obj.mesh.userData.fullIndex*grow));});
  for(let i=0;i<n;i++){const b=branches[(i*7)%branches.length],length=b.pts.length-1,local=(t*(.4+state.transport*.6)+i/n)%1;const active=Math.max(0,Math.min(1,(coverage-b.birth)/(b.end-b.birth)));const q=b.obj.curve.getPoint(Math.min(local,.999));dummy.position.copy(q);dummy.scale.setScalar(local<active?1:0);dummy.updateMatrix();particles.setMatrixAt(i,dummy.matrix)}particles.instanceMatrix.needsUpdate=true;
 }
 return {root,tick,camera:[9,4.6,9]};
}
function solgel(params){
 const root=new THREE.Group(),rng=prng(95),nodes=[],edges=[];
 const count=100;const verts=[];
 for(let i=0;i<count;i++){const phi=Math.acos(1-2*(i+.5)/count),a=i*2.3999632297,r=2.6*Math.pow(rng(),.27);const p=V(Math.sin(phi)*Math.cos(a)*r,(rng()-.5)*4.2,Math.sin(phi)*Math.sin(a)*r);verts.push(p);let m=sphere(root,p,.065+(rng()*.045),i%5?palette.mint:palette.gold,{detail:0});nodes.push({m,threshold:.08+rng()*.45});}
 for(let i=0;i<count;i++){let ds=verts.map((v,j)=>({j,d:j===i?999:verts[i].distanceToSquared(v)})).sort((a,b)=>a.d-b.d).slice(0,3);for(const x of ds){if(x.j<i)continue;const curve=tube(root,[verts[i],verts[i].clone().lerp(verts[x.j],.5).add(V(0,(rng()-.5)*.17,0)),verts[x.j]],.014,0xb7cebd,9);edges.push({obj:curve,threshold:.18+rng()*.75});}}
 const halo=new THREE.Mesh(new THREE.IcosahedronGeometry(3.4,3),new THREE.MeshBasicMaterial({color:0x57b7a0,wireframe:true,transparent:true,opacity:.08}));root.add(halo);
 function tick(t,state){const h=state.hydrolysis,c=state.condensation;nodes.forEach(d=>d.m.scale.setScalar(h>d.threshold?1:.001));edges.forEach(d=>d.obj.mesh.geometry.setDrawRange(0,Math.floor(d.obj.mesh.userData.fullIndex*Math.max(0,Math.min(1,(c-d.threshold)/.17)))));halo.material.opacity=.015+.08*c;}
 return {root,tick,camera:[7,5,9]};
}
function cell(params){
 const root=new THREE.Group(),rng=prng(622);const cellGeo=new THREE.SphereGeometry(1.47,42,25);const pos=cellGeo.attributes.position;for(let i=0;i<pos.count;i++){let x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),w=1+.045*Math.sin(x*7+y*2)*Math.cos(z*5)+.02*Math.cos(y*13);pos.setXYZ(i,x*w*1.23,y*w*.83,z*w*.96);}cellGeo.computeVertexNormals();
 const membrane=new THREE.Mesh(cellGeo,material(0x4c977c,{transparent:true,opacity:.88,side:THREE.DoubleSide,roughness:.66}));root.add(membrane);
 const coat=new THREE.Mesh(new THREE.SphereGeometry(1.8,48,32),new THREE.MeshPhysicalMaterial({color:0xa2e0d5,roughness:.27,metalness:.08,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}));coat.scale.set(1.2,.9,1);root.add(coat);
 const nucleoid=tube(root,Array.from({length:28},(_,i)=>{let t=i/27*6.28;return V(.5*Math.cos(t*2),.44*Math.sin(t*3),.37*Math.sin(t*2));}),.045,0xd0b087,65);
 const count=220,items=[],group=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.07,0),material(0xabddd2,{emissive:0x1c655e,emissiveIntensity:.15}),count);root.add(group);const dummy=new THREE.Object3D();
 for(let i=0;i<count;i++){let angle=i*2.3999632,y=1-2*(i+.5)/count,r=Math.sqrt(1-y*y),p=V(Math.cos(angle)*r*2.19,y*1.64,Math.sin(angle)*r*1.8),z=.16+.78*rng();items.push({p,z});}
 const molecules=new THREE.InstancedMesh(new THREE.SphereGeometry(.03,7,5),material(palette.gold,{emissive:0x927449,emissiveIntensity:.4}),65);root.add(molecules);
 function tick(t,state){let x=state.shell;
  coat.material.opacity=.05+.33*x;coat.scale.set(1.18, .89, .99);
  items.forEach((it,i)=>{dummy.position.copy(it.p);dummy.scale.setScalar(Math.max(0,Math.min(1,(x-it.z)/.13)));dummy.rotation.set(i*.1,i*.31,i*.2);dummy.updateMatrix();group.setMatrixAt(i,dummy.matrix)});group.instanceMatrix.needsUpdate=true;
  for(let i=0;i<65;i++){const phase=i*2.39996,rad=1.4+(.45*(.5+.5*Math.sin(i*17.3))),u=(t*state.transfer*2+i/65)%1;let p=V(Math.cos(phase)*rad*(1-u*.4), Math.sin(phase*.65)*1.2*(1-u*.45), Math.sin(phase)*rad*(1-u*.4));dummy.position.copy(p);dummy.scale.setScalar(u<state.uptake?1:0);dummy.updateMatrix();molecules.setMatrixAt(i,dummy.matrix);}molecules.instanceMatrix.needsUpdate=true;
 }
 return {root,tick,camera:[6.5,4.7,8.3]};
}
function mof(params){
 const root=new THREE.Group(),core=sphere(root,V(),1.48,0x357e71,{material:{transparent:true,opacity:.93,roughness:.84}});
 core.scale.set(1.24,.85,.9);
 const nucleus=sphere(root,V(),.5,0xba9e70,{material:{roughness:.63}});
 const rng=prng(99),part=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.18,0),material(0x8ddaca,{metalness:.28,roughness:.36}),280);
 root.add(part);const dots=[];for(let i=0;i<280;i++){const y=1-2*(i+.5)/280,a=i*2.3999632,r=Math.sqrt(1-y*y);dots.push({p:V(2.14*r*Math.cos(a),1.65*y,1.74*r*Math.sin(a)),on:.10+.78*rng()});}
 const dummy=new THREE.Object3D();const metal=new THREE.Mesh(new THREE.IcosahedronGeometry(2.4,2),new THREE.MeshPhysicalMaterial({color:0x77cfc9,wireframe:true,transparent:true,opacity:.11}));root.add(metal);
 function tick(t,state){const x=state.crystallinity;part.count=280;dots.forEach((d,i)=>{dummy.position.copy(d.p);dummy.rotation.set(i*.31,i*.17,i*.29);dummy.scale.setScalar(Math.max(0,Math.min(1,(x-d.on)/.12)));dummy.updateMatrix();part.setMatrixAt(i,dummy.matrix)});part.instanceMatrix.needsUpdate=true;metal.material.opacity=.02+.12*x;}
 return {root,tick,camera:[7,4.4,9]};
}
export function makeOrganicModel(id,params){switch(id){case 'vegetal':return plant(params);case 'mycelium':return mycelium(params);case 'solgel':return solgel(params);case 'encapsulation':return cell(params);case 'mof':return mof(params);default:return plant(params);}}
export function disposeOrganicModel(root){if(!root)return;const materials=new Set(),geos=new Set();root.traverse(x=>{if(x.geometry)geos.add(x.geometry);if(x.material){for(const m of Array.isArray(x.material)?x.material:[x.material])materials.add(m);}});for(const m of materials)m.dispose();for(const g of geos)g.dispose();}