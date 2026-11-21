/* Modèles réduits, sans calibration expérimentale : τ∈[0,1].
 * Ne pas interpréter les paramètres ni la sortie comme des données mesurées.
 */
export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const expRise=(k,t)=>1-Math.exp(-k*t);
const integralRise=(k,t)=>t+(Math.expm1(-k*t))/k; // ∫₀ᵗ (1−e⁻ᵏˢ) ds
export function evaluateKinetics(id,time,p){
 const t=clamp(time);
 switch(id){
  case 'vegetal':{
   const growth=expRise(3*p.elongation,t),a=3*p.flux,availability=expRise(a,t),coat=expRise(3*p.mineral,integralRise(a,t));
   return {growth,availability,coat,transport:availability,progress:t};
  }
  case 'mycelium':{
   const mu=4*p.mu,b0=.018;
   const logistic=x=>1/(1+(1/b0-1)*Math.exp(-mu*x));
   const coverage=clamp((logistic(t)-b0)/(1-b0)); // fixed carrying capacity; final value depends on growth rate
   const nutrients=expRise(3*p.transport,t);
   return {coverage,nutrients,tips:clamp(coverage*(.65+.35*p.branching/100)),transport:p.transport,progress:t};
  }
  case 'solgel':{
   const hydrolysis=expRise(p.kh,t);
   const condensation=expRise(p.kc,integralRise(p.kh,t));
   return {hydrolysis,condensation,sol:1-hydrolysis,progress:t};
  }
  case 'encapsulation':{
   const shell=1-Math.exp(-Math.pow(p.ks*t,2));
   const transfer=Math.pow(p.porosity,1.5)/p.thickness/(1+1.4*shell); // conductance/permeance-like index, NOT intrinsic permeability
   // Midpoint quadrature for time-integrated transfer conductance.
   let area=0,dt=t/80;
   for(let j=0;j<80;j++){
    const x=(j+.5)*dt,stage=1-Math.exp(-Math.pow(p.ks*x,2));
    const local=Math.pow(p.porosity,1.5)/p.thickness/(1+1.4*stage);
    area+=local*dt;
   }
   const uptake=expRise(3,area);
   return {shell,transfer,uptake,progress:t};
  }
  case 'mof':{
   const crystallinity=1-Math.exp(-Math.pow(p.k*t,p.n));
   const nucleation=expRise(p.nuclei,t);
   return {crystallinity,nucleation,unconverted:1-crystallinity,progress:t}; // X is transformation index, not measured surface coverage
  }
  default:throw Error('Mécanisme inconnu : '+id);
 }
}