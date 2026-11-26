/* Offline port of foundations/_lib/model.php v1.3.0. Educational controls only. */
(function(root){'use strict';
function solve(id,input={},catalog=root.BSPOfflineCatalog){const l=catalog.foundations[id];if(!Object.hasOwn(catalog.foundations,id))throw Error('Unknown foundation');if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Parameters must be an object');const p={};for(const key of Object.keys(input))if(!l.params.some(d=>d.key===key))throw Error('Unknown parameter');for(const d of l.params){const v=Object.hasOwn(input,d.key)?input[d.key]:d.default;if(typeof v!=='number'||!Number.isFinite(v)||v<d.min||v>d.max)throw Error(d.label+' is outside its numerical bounds.');p[d.key]=v;}
const rows=[],metrics=[],metric=(label,value,unit='')=>metrics.push({label,value,unit}),sweep=(a,b,fn)=>{for(let i=0;i<=100;i++){const x=a+(b-a)*i/100;rows.push([x,...fn(x)]);}};let f;
switch(id){
case 'photon-mass':f=g=>Math.sqrt(1-g*g);sweep(0,.95,g=>[f(g),f(g)]);metric('Group speed / C',f(p.gap));metric('Normalized momentum',f(p.gap));metric('Energy-equivalent mass / (E/C²)',1);break;
case 'constant-time':{const sr=Math.sqrt(1-p.beta**2);sweep(0,p.duration,t=>[p.rate*t,p.rate*p.ratio*t,p.rate*sr*t]);metric('Reference counts',p.rate*p.duration);metric('Candidate counts',p.rate*p.ratio*p.duration);metric('SR counts',p.rate*sr*p.duration);break;}
case 'light-slowing':{f=t=>{const m=Math.sqrt(1-p.gap*p.gap)*Math.exp(-p.drag*t),e=Math.hypot(m,p.gap);return [e,m/e,1-e];};sweep(0,p.duration,f);const [e,v,loss]=f(p.duration);metric('Final energy / initial',e);metric('Final group speed / C',v);metric('Transferred energy',loss);break;}
case 'when':for(let i=0;i<=10;i++)rows.push([i,i*p.period,i*p.period+p.delay]);metric('Emission interval',p.period,'s');metric('Arrival interval',p.period,'s');metric('First arrival',p.delay,'s');break;
case 'where':{const d=Math.hypot(p.dx,p.dy);sweep(-10,10,x=>[x,x+p.dx,d]);metric('Object A x',p.shift);metric('Object B x',p.shift+p.dx);metric('Invariant separation',d);break;}
case 'physical-existence':f=a=>2*p.energy*Math.sin(a*Math.PI/360);sweep(0,180,a=>[f(a)]);metric('System rest energy Mc²',f(p.angle));metric('Total energy',2*p.energy);metric('Individual photon invariant mass',0);break;
case 'spacetime':f=v=>Math.sqrt(1-v*v);sweep(0,.99,v=>[p.duration*f(v),p.duration]);metric('Proper interval',p.duration*f(p.beta),'s');metric('Reference interval',p.duration,'s');metric('Proper/reference interval',f(p.beta));break;
case 'fastest-signal':sweep(0,p.distance,x=>[x/p.fraction,x]);metric('Packet arrival',p.distance/p.fraction);metric('Reference arrival',p.distance);metric('Arrival difference',p.distance*(1/p.fraction-1));break;
case 'separation':f=v=>2*v/(1+v*v);sweep(0,.99,v=>[2*v,f(v),1]);metric('Coordinate separation rate / C',2*p.beta);metric('SR relative speed / C',f(p.beta));metric('Local causal benchmark / C',1);break;
case 'cosmic-size':f=d=>Math.min(1,(p.reach/d)**3);sweep(.1,20,d=>[f(d)]);metric('Signal reach',p.reach);metric('Assumed domain radius',p.domain);metric('Accessible fraction',f(p.domain));break;
case 'cosmic-age':f=h=>2*Math.asinh(Math.sqrt((1-p.matter)/p.matter))/(3*Math.sqrt(1-p.matter)*(h*1000/3.085677581491367e22))/(365.25*86400*1e9);sweep(45,95,h=>[f(h)]);metric('Modeled age',f(p.h0),'Gyr');metric('Matter fraction',p.matter);metric('Λ fraction',1-p.matter);break;
case 'distance-inference':f=a=>10**(a/5);sweep(-1,3,a=>[p.actual*f(a),p.actual]);metric('Inferred distance',p.actual*f(p.extinction),'Mpc');metric('Calibrated distance',p.actual,'Mpc');metric('Inferred/calibrated size',f(p.extinction));break;
default:throw Error('Unsupported model');}
if(!rows.every(r=>r.every(Number.isFinite))||!metrics.every(m=>Number.isFinite(m.value)))throw Error('Nonfinite output');return {schema:'beyondspacetime.foundation-result.v1',version:catalog.solver_version,foundation:id,parameters:p,equation:l.equation,xLabel:l.xLabel,series:l.series,rows,metrics,limitation:l.limitation,source:l.source,epistemic_status:'conditional_educational_control'};}
const api={solve};if(typeof module==='object'&&module.exports)module.exports=api;else root.BSPOfflineSolver=api;
})(globalThis);
