
const escapeSvg=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dot=(x,y,r,color='url(#gold)',op=1)=>'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'" fill="'+color+'" opacity="'+op+'"/>';
const line=(x1,y1,x2,y2,color='#7dbbb8',width=2,op=.8)=>'<path d="M'+x1.toFixed(1)+' '+y1.toFixed(1)+' L'+x2.toFixed(1)+' '+y2.toFixed(1)+'" fill="none" stroke="'+color+'" stroke-width="'+width+'" opacity="'+op+'"/>';
function visualType(f){
 const t=(f.title+' '+f.chapter).toLowerCase(),m=f.time||0;
 if(/hdl|lamell|brucite|atrazine/.test(t)||m>1500&&m<1850)return 'lamellae';
 if(/mycé|hyph|fong|champignon/.test(t))return 'hyphae';
 if(/béton|fissure|calcite|caco/.test(t))return 'crack';
 if(/imprim|extrusion|cellulose|biofabri/.test(t))return 'print';
 if(/mof|zif|cristall|coque|minéralis/.test(t)||m>2320&&m<3550)return 'mof';
 if(/pile|électro|thermoélec|énergie/.test(t)||m>4060&&m<4300)return 'fuel';
 if(/diatom|photo|algue|silicification/.test(t))return 'diatom';
 if(/cryopr|congéla|glace|globule/.test(t))return 'cryo';
 if(/sol.gel|silice|poros|mousse|gel|encaps|cellule|bactér/.test(t))return 'cell';
 return 'network';
}
function motif(type,k){
 let out='',cx=455,cy=262;
 if(type==='lamellae'){
   for(let z=0;z<5;z++){let y=114+z*69;out+='<path d="M166 '+y+' Q460 '+(y-34)+' 750 '+y+'" fill="none" stroke="#7ddbd0" stroke-width="12" stroke-linecap="round" opacity="'+(.34+z*.09)+'"/>';
     for(let j=0;j<9;j++)out+=dot(187+j*69,y-8*Math.sin(j*.65),6.5,z%2?'#d9b77a':'#77e5d7',.95);
     if(z<4)for(let j=0;j<7;j++)out+=dot(214+j*82,y+28,3+(j%3),'#d7a96e',.9);}
 }
 if(type==='mof'){
   let pts=[];for(let a=0;a<10;a++){let q=a*2*Math.PI/10;pts.push([cx+180*Math.cos(q),cy+175*Math.sin(q)])}
   for(let i=0;i<pts.length;i++){let p=pts[i],r=pts[(i+1)%pts.length],t=pts[(i+3)%pts.length];out+=line(...p,...r,'#7adfd0',3,.75)+line(...p,...t,'#bb9a70',1.7,.37)+dot(...p,9,i%2?'#dfb77b':'#6df1df')}
   for(let i=0;i<8;i++){let a=i*Math.PI/4,p=[cx+83*Math.cos(a),cy+80*Math.sin(a)];out+=dot(...p,7,'#d6bb84')+line(cx,cy,...p,'#4fa89d',1.8,.7)}out+=dot(cx,cy,16,'#e2c086',.85);
 }
 if(type==='cell'){
   out+='<ellipse cx="455" cy="260" rx="215" ry="146" fill="#76cbbf" fill-opacity=".06" stroke="#7ad8c5" stroke-width="9"/><ellipse cx="455" cy="260" rx="190" ry="119" fill="none" stroke="#d4ae7e" stroke-width="2" stroke-dasharray="7 10"/>';
   for(let j=0;j<17;j++){let a=j*2*Math.PI/17;out+=dot(cx+224*Math.cos(a),cy+154*Math.sin(a),4,'#7fe6d3')}
   for(let j=0;j<24;j++){let a=(j*2.399),r=8+12*Math.sqrt(j);out+=dot(cx+r*Math.cos(a),cy+.73*r*Math.sin(a),3+j%4,j%3?'#caab75':'#75d9c6',.7)}
   out+='<path d="M384 265q45 -78 85 0t87 0" fill="none" stroke="#d9c190" stroke-width="6" opacity=".9"/>';
 }
 if(type==='hyphae'||type==='network'){
   for(let i=0;i<17;i++){let a=i*2.399,p=[cx+28*Math.cos(a),cy+28*Math.sin(a)],q=[cx+(84+i%4*28)*Math.cos(a),cy+(85+i%4*28)*Math.sin(a)],r=[q[0]+32*Math.cos(a+.5),q[1]+32*Math.sin(a+.5)];out+=line(...p,...q,'#84d5c5',3,1)+line(...q,...r,'#d2b380',1.7,.7)+dot(...q,4,'#d0b57c');if(i%2===0)out+=line(...q,q[0]-18*Math.sin(a),q[1]+25*Math.cos(a),'#7cdecf',1.3,.7)}
   for(let i=0;i<26;i++){let a=i*.55;out+=dot(cx+181*Math.cos(a),cy+152*Math.sin(a),1+i%4,'#b4cbb4',.6)}
 }
 if(type==='crack'){
   out+='<rect x="170" y="85" width="570" height="355" rx="26" fill="#b2b2a0" fill-opacity=".1" stroke="#adbab3" stroke-opacity=".24"/>';
   let ps=[[445,100],[430,159],[467,197],[423,245],[456,308],[424,359],[456,433]];
   out+='<polyline points="'+ps.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#07171b" stroke-width="31" stroke-linejoin="round"/>';
   for(let j=0;j<39;j++){let x=430+25*Math.sin(j*4.3),y=107+j*8.4;out+=dot(x,y,3+j%4,j%3?'#d0b782':'#87d3c3',.8)}
 }
 if(type==='print'){
   for(let j=0;j<8;j++){let y=389-j*29;out+='<path d="M225 '+y+' Q330 '+(y+21)+' 445 '+y+' T680 '+y+'" fill="none" stroke="'+(j%2?'#9bdfcb':'#d5b179')+'" stroke-width="11" opacity=".75"/>'}
   out+='<path d="M418 75H492L486 164L467 211L447 211L424 164Z" fill="#9ac3b5" fill-opacity=".23" stroke="#c9b280" stroke-width="5"/><path d="M457 210L454 272" stroke="#dcb67b" stroke-width="8" stroke-linecap="round"/>';
 }
 if(type==='fuel'){
   out+='<rect x="165" y="118" width="580" height="290" rx="14" fill="#7fbaa8" fill-opacity=".07" stroke="#7eafae" stroke-width="2"/><rect x="212" y="145" width="18" height="234" rx="7" fill="#a5cfcc"/><rect x="677" y="145" width="18" height="234" rx="7" fill="#d8be86"/><path d="M230 138V88H686V138" fill="none" stroke="#cfa86c" stroke-width="5"/>';
   out+='<path d="M462 130V400" stroke="#a8cbc0" stroke-width="3" stroke-dasharray="7 12"/>';for(let i=0;i<26;i++)out+=dot(255+i*15,230+72*Math.sin(i*.7),4,i%2?'#88dbc7':'#e0bd83',.84);
 }
 if(type==='diatom'){
   out+='<ellipse cx="455" cy="260" rx="194" ry="148" fill="#7ebeb6" fill-opacity=".06" stroke="#bcb992" stroke-width="7"/>';for(let i=0;i<13;i++){let a=i*Math.PI/12,rx=180*(1-i/25),ry=125*(1-i/25);out+='<ellipse cx="455" cy="260" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="#8fdccf" stroke-width=".8" opacity=".7"/>'}for(let x=-150;x<=150;x+=22)for(let y=-110;y<=110;y+=22)if(x*x/190/190+y*y/143/143<.8)out+=dot(cx+x,cy+y,2,'#d7bf8d',.8);
 }
 if(type==='cryo'){
   for(let i=0;i<8;i++){let a=i*Math.PI/4,x2=cx+165*Math.cos(a),y2=cy+165*Math.sin(a);out+=line(cx,cy,x2,y2,'#9cdbea',4,.95);for(let j=1;j<=3;j++){let tx=cx+(j*.23)*165*Math.cos(a),ty=cy+(j*.23)*165*Math.sin(a);out+=line(tx,ty,tx+27*Math.cos(a+.6),ty+27*Math.sin(a+.6),'#d1c6a3',1.6,.8)+line(tx,ty,tx+27*Math.cos(a-.6),ty+27*Math.sin(a-.6),'#d1c6a3',1.6,.8)}}
   out+=dot(cx,cy,16,'#caad7d');
 }
 return out;
}
export function figureIllustration(figure,large=false){
 const k=Number(figure.id)||1,type=visualType(figure),w=large?1000:760,h=large?562:428,id='fx'+k+'_'+(large?'l':'s');
 const bg='<rect width="920" height="520" fill="#0b1b22"/><circle cx="690" cy="110" r="230" fill="url(#haze)" opacity=".6"/><circle cx="170" cy="490" r="210" fill="url(#haze)" opacity=".42"/>';
 const grid='<path d="'+Array.from({length:13},(_,i)=>'M'+(100+i*60)+' 0V520').join(' ')+Array.from({length:9},(_,i)=>'M0 '+(40+i*55)+'H920').join(' ')+'" stroke="#91b8ae" stroke-opacity=".08" stroke-width="1" fill="none"/>';
 return '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schéma conceptuel de '+escapeSvg(figure.title)+'" viewBox="0 0 920 520" width="'+w+'" height="'+h+'" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e9c58b"/><stop offset="1" stop-color="#82d7ce"/></linearGradient><radialGradient id="haze"><stop stop-color="#577e77" stop-opacity=".28"/><stop offset="1" stop-color="#577e77" stop-opacity="0"/></radialGradient></defs>'+bg+grid+'<g>'+motif(type,k)+'</g><path d="M32 25H115M32 25V94M888 495H805M888 495V425" stroke="#bfac89" stroke-width="2" opacity=".6"/><text x="35" y="470" fill="#e2c79c" font-family="monospace" font-size="14" letter-spacing="3">CHIMIE DOUCE · '+String(k).padStart(2,'0')+'</text><text x="35" y="492" fill="#9eb5b0" font-family="monospace" font-size="10" letter-spacing="2">SCHÉMA CONCEPTUEL · NON À L’ÉCHELLE</text><text x="885" y="45" text-anchor="end" fill="#b3c8bf" font-family="monospace" font-size="12" letter-spacing="2">'+type.toUpperCase()+'</text></svg>';
}
