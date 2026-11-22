/* New non-interactive explanatory plates; original course slides are never overwritten. */
const REDESIGNED = Object.freeze({
  21:{src:'../assets/atlas-redessine/planche-21.webp',kind:'reconstruction',source:'Clément Sanchez — Collège de France, 18 février 2020'},
  22:{src:'../assets/atlas-redessine/planche-22.webp',kind:'reconstruction',source:'Clément Sanchez — Collège de France, 18 février 2020'},
  23:{src:'../assets/atlas-redessine/planche-23.webp',kind:'reconstruction',source:'Clément Sanchez — Collège de France, 18 février 2020'},
  24:{src:'../assets/atlas-redessine/planche-24.webp',kind:'reconstruction',source:'Clément Sanchez — Collège de France, 18 février 2020'},
  25:{src:'../assets/atlas-redessine/planche-25.webp',kind:'reconstruction',source:'Clément Sanchez — Collège de France, 18 février 2020'},
  26:{src:'../assets/atlas-redessine/planche-26.webp',kind:'reconstruction',source:'Clément Sanchez — Collège de France, 18 février 2020'},
  27:{src:'../assets/atlas-redessine/planche-27.webp',kind:'reconstruction',source:'Clément Sanchez — Collège de France, 18 février 2020'},
  28:{src:'../assets/atlas-redessine/planche-28.webp',kind:'reconstruction',source:'Clément Sanchez — Collège de France, 18 février 2020'},
  29:{src:'../assets/atlas-redessine/planche-29.webp',kind:'reconstruction',source:'Clément Sanchez — Collège de France, 18 février 2020'},
  30:{src:'../assets/atlas-redessine/planche-30.webp',kind:'reconstruction',source:'Clément Sanchez — Collège de France, 18 février 2020'},
});
export const redesignedPlate = id => REDESIGNED[Number(id)]||null;
export const redesignedCount = () => Object.keys(REDESIGNED).length;
