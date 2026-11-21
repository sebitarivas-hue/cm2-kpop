import assert from 'node:assert/strict';
import {evaluateKinetics} from '../kinetics.js';
const setups={vegetal:{elongation:1.35,flux:1.45,mineral:1.35,density:100},mycelium:{mu:1.4,transport:1.25,branching:88},solgel:{kh:2.2,kc:1.7},encapsulation:{ks:2,porosity:.46,thickness:1},mof:{k:2,n:2.2,nuclei:1.6}};
let tested=0;
for(const [id,p] of Object.entries(setups)){
 const start=evaluateKinetics(id,0,p),end=evaluateKinetics(id,1,p);
 assert.equal(start.progress,0);assert.equal(end.progress,1);
 for(const [key,val] of Object.entries(start))if(key!=='transport'||id!=='mycelium')assert.ok(Number.isFinite(val),`${id}.${key} finite`);
 for(let i=1;i<=100;i++){
  const t=i/100,m=evaluateKinetics(id,t,p),prev=evaluateKinetics(id,(i-1)/100,p);
  for(const [key,v] of Object.entries(m)){
   assert.ok(Number.isFinite(v),`${id}.${key} finite at ${t}`);
   if(!['transport','transfer','sol','unconverted'].includes(key))assert.ok(v>=-1e-9&&v<=1+1e-9,`${id}.${key} normalized at ${t} : ${v}`);
   if(!['transport','transfer','sol','unconverted','progress'].includes(key))assert.ok(v>=prev[key]-1e-10,`${id}.${key} monotone at ${t}`);
  }
  tested++;
 }
}
const e=evaluateKinetics('encapsulation',.5,setups.encapsulation);
const lessPorous=evaluateKinetics('encapsulation',.5,{...setups.encapsulation,porosity:.2});
const thicker=evaluateKinetics('encapsulation',.5,{...setups.encapsulation,thickness:2});
assert.ok(lessPorous.transfer<e.transfer,'porosity reduces transfer conductance');
assert.ok(thicker.transfer<e.transfer,'thickness reduces transfer conductance');
assert.ok(evaluateKinetics('solgel',.5,{kh:4,kc:1.7}).hydrolysis>evaluateKinetics('solgel',.5,{kh:1,kc:1.7}).hydrolysis,'hydrolysis rate control');
assert.ok(evaluateKinetics('mof',.5,{k:3,n:2.2,nuclei:1}).crystallinity>evaluateKinetics('mof',.5,{k:1,n:2.2,nuclei:1}).crystallinity,'MOF kinetic rate');
console.log(`PASS · ${tested} states, 5 mechanisms, monotonicity/finite bounds and sensitivity checks`);

// Validation croisée: aucune renormalisation dépendante de l'horizon final,
// et la conductance est une grandeur géométrique distincte de la diffusivité.
const slow=evaluateKinetics('mycelium',1,{...setups.mycelium,mu:.45});
const fast=evaluateKinetics('mycelium',1,{...setups.mycelium,mu:2.3});
assert.ok(fast.coverage>slow.coverage && slow.coverage<.8,'faster growth must increase endpoint colonization');
assert.ok(evaluateKinetics('encapsulation',0,setups.encapsulation).transfer>0,'uncoated transfer finite');
assert.equal(evaluateKinetics('mof',0,setups.mof).unconverted,1);