"""Run from any location with path to public repository root as argv[1]."""
import sys, json
from pathlib import Path
from dataclasses import replace
sys.path.insert(0,str(Path(sys.argv[1])/'tools'))
from quantum_receiver_v1 import Params, ReceiverModel
cases=[{}, {'N':24,'detune':-.08}, {'N':48,'detune':.08}, {'g_receiver':0}, {'g_source':0}, {'lam':0}, {'sigma':.9}]
result=[]
for case in cases:
 p=replace(Params(sample_count=226),**case);m=ReceiverModel(p);t,y=m.integrate();rows=[]
 for T,state in zip(t,y):
  E,P,n=m.invariants(state);psi,_,_,_,spin,*_=m.pieces(state);ops=m.operators(state)
  rows.append(dict(t=float(T),psi=float(psi),sourcePopulation=float((1-spin[0,2])/2),receiverPopulation=float((1-spin[1,2])/2),receiverField=float(ops[5][1]),receiverGap=float(ops[7][1]),energy=E,momentum=P))
 result.append(dict(parameters=dict(modes=p.N,detune=p.detune,sourceCoupling=p.g_source,receiverCoupling=p.g_receiver,scalarCoupling=p.lam,width=p.sigma,duration=p.t_end,dt=.025),rows=rows))
 print('reference case',case,flush=True)
Path(__file__).with_name('receiver-reference.json').write_text(json.dumps(result,indent=2)+'\n')
