"""Independent implementation from equations printed in the supplied PDF.
Run: python independent_checks.py (from this directory). No external datasets.
"""
import csv, json, math, platform
from pathlib import Path
import numpy as np, scipy, mpmath as mp
from scipy.integrate import solve_ivp, quad
from scipy.optimize import brentq
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
OUT=Path(__file__).resolve().parent
mp.mp.dps=70
r=mp.mpf('0.5'); e=mp.mpf('1e-8'); P=mp.sqrt(1-e*e); P1=mp.sqrt(r*r-e*e); theta=mp.pi/(180*3600)
upper=(1-r)/(P-P1); lower=(1-r)/mp.sqrt((P-P1)**2+4*P*P1*mp.sin(theta/2)**2)
results={'dependencies':{'python':platform.python_version(),'numpy':np.__version__,'scipy':scipy.__version__,'mpmath':mp.__version__,'matplotlib':matplotlib.__version__},'bath_upper':str(upper),'bath_deficit':str(1-upper),'bath_lower':str(lower),'TOF_ratio':str(2*mp.log(2)),'tidal_eigenvalues_units_GM_D3':np.linalg.eigvalsh(3*np.outer([1,0,0],[1,0,0])-np.eye(3)).tolist(),'fixed_gap_entry_min_drag':.2*math.sqrt(99)*10,'fixed_gap_arrival_max_drag':.2*math.acosh(10)/math.log(1.2),'remnant_fraction':410.7e-18/1264.41}
# Bounded flow, Review R1–R6
C=.8; B=1.; Om=.1; q=math.sqrt(1-Om**2)/C; eta=.5
w=lambda t:C*C*q/(t*math.sqrt((C*q/t)**2+Om**2))
ta=brentq(lambda t:quad(lambda s:w(s)/(B*s),1,t,epsabs=1e-13,epsrel=1e-13)[0]-eta,1,10,xtol=1e-14)
u=B*math.tanh(eta); wa=w(ta)
results['bounded_flow']={'tau_a':ta,'w_e':w(1),'w_a':wa,'u_a':u,'v_a':(u+wa)/(1+u*wa/B**2),'A_clock':ta}
# Two-body scattering, H4
m0=1e-6;m1=.5;M=100;delta=.1;E=1.;p=math.sqrt(E**2-m0**2);s=M*M+m0*m0+2*M*E;qs=math.sqrt((s-(m1+M+delta)**2)*(s-(m1-M-delta)**2)/(4*s));Es=math.hypot(qs,m1);b=p/(E+M);G=1/math.sqrt(1-b*b)
results['scattering']=[]
for th in [0,.1]:
 pz=G*(qs*math.cos(th)+b*Es);pt=qs*math.sin(th);Ef=G*(Es+b*qs*math.cos(th));rec=math.hypot(M+delta,math.hypot(p-pz,pt))-(M+delta)
 results['scattering'].append(dict(theta_cm=th,E_final=Ef,v_final=math.hypot(pz,pt)/Ef,theta_lab_deg=math.degrees(math.atan2(pt,pz)),recoil=rec,energy_error=E-Ef-delta-rec))
# OF5–8 table
results['outflow']=[]
for gap in [0,.001,.01,.1,.2,.3]:
 W=.5; K=math.sqrt(1-gap**2); H=.2; chi=(1-W)/(H*K); a=1+W*(1-W)/(W*W-gap*gap); ratio=K/math.sqrt(W*W-gap*gap); t=math.log(ratio)/H
 f=lambda t: K*math.exp(-2*H*t)/math.sqrt(K*K*math.exp(-2*H*t)+gap*gap)
 tq=brentq(lambda t:quad(f,0,t,epsabs=1e-13,epsrel=1e-13)[0]-chi,0,100)
 results['outflow'].append(dict(gap=gap,A=a,duality=ratio*math.sqrt(2*a)/4,arrival=t,quadrature_error=tq-t))
# Part XXXI / XXXII. x,p,a,Q,W,X. P=a exactly.
def run(name, E0=1., gap=1e-6, cap=2., beta=1., K=1., M=100., rise=.2, lead=.3, Mw=math.inf, method='DOP853',rtol=1e-10,atol=1e-12,step=.04,linear=False,horizon=100.):
 def diag(y):
  x,p,a,Q,W,X=y; z=x-X; f=min(1,max(0,z)); C=1+rise*(f if linear else 3*f*f-2*f**3); Cp=rise*(1 if linear else 6*f*(1-f)) if 0<=z<=1 else 0.; D=gap+beta*a; E=math.hypot(C*p,D); v=C*C*p/E; Ex=C*Cp*p*p/E; Ea=beta*D/E; A=v-Ea-a/M; adot=K*max(A,0)*max(1-a/cap,0); U=W/Mw; dv=v*v*Cp/C-C*C*D*(D+beta*p)/E**3*adot-U*(2*C*Cp*p/E-v*Ex/E)
  return E,v,Ex,A,adot,U,dv,D
 def rhs(t,y):
  E,v,Ex,A,adot,U,dv,D=diag(y);return [v,-Ex-adot,adot,A*adot,Ex,U]
 def arrival(t,y):return y[0]-y[5]-1
 arrival.terminal=True;arrival.direction=1
 def stopped(t,y):return y[1]-1e-12
 stopped.terminal=True;stopped.direction=-1
 y0=[-lead,math.sqrt(E0*E0-gap*gap),0,0,0,0]; sol=solve_ivp(rhs,[0,horizon],y0,method=method,rtol=rtol,atol=atol,max_step=step,dense_output=True,events=[arrival,stopped]); ts=np.unique(np.r_[sol.t,np.linspace(0,sol.t[-1],5001)]); ys=sol.sol(ts); vals=np.array([diag(y) for y in ys.T]); x,p,a,Q,W,X=ys; E,v,Ex,A,adot,U,dv,D=vals.T; energy=E+a*a/(2*M)+Q+W*W/(2*Mw);mom=p+a+W
 status='arrived' if len(sol.t_events[0]) else 'threshold_stop' if len(sol.t_events[1]) else 'incomplete' if sol.success else 'numerical_failure'
 row=dict(name=name,status=status,arrival_time=sol.t[-1],speed=v[-1],retained=E[-1]/E0,gap=D[-1],heat=Q[-1]/E0,recoil=a[-1]**2/(2*M*E0),wall_recoil=W[-1]**2/(2*Mw*E0),wall_momentum=W[-1],max_sampled_dv=max(dv),reaccelerating=bool(max(dv)>1e-10),saturated=bool(a[-1]>=cap*(1-1e-8)),energy_residual=max(abs(energy-E0)),momentum_residual=max(abs(mom-y0[1])),steps=len(sol.t)-1,method=method,rtol=rtol,atol=atol,max_step=step,E0=E0,initial_gap=gap,capacity=cap,beta=beta,mobility=K,receiver_mass=M,wall_rise=rise,lead=lead,wall_mass=Mw,linear=linear,horizon=horizon)
 return row,np.column_stack([ts,x-X,v,E,D,Q,a,W,dv])
cases=[('baseline',{}),('refined',dict(rtol=1e-12,atol=1e-14,step=.01)),('RK45',dict(method='RK45',rtol=1e-11,atol=1e-13,step=.02)),('tiny_gap',dict(gap=1e-16)),('no_exchange',dict(K=0)),('fixed_gap',dict(beta=0)),('no_lead',dict(lead=0)),('cap_0.1',dict(cap=.1)),('cap_0.3',dict(cap=.3)),('cap_0.5',dict(cap=.5)),('E_0.5',dict(E0=.5)),('E_2',dict(E0=2)),('E_4',dict(E0=4)),('steep',dict(rise=.4)),('receiver_1',dict(M=1)),('linear',dict(linear=True)),('wall_100',dict(Mw=100)),('wall_10',dict(Mw=10)),('wall_1',dict(Mw=1)),('wall_10_refined',dict(Mw=10,rtol=1e-12,atol=1e-14,step=.01)),('short_horizon',dict(horizon=.1))]
rows=[];fig,ax=plt.subplots(figsize=(8,5))
for name,kw in cases:
 row,track=run(name,**kw);rows.append(row)
 if name in ['baseline','refined','no_exchange','cap_0.1','E_4','wall_1']:
  ax.plot(track[:,1],track[:,2],label=name);np.savetxt(OUT/(name+'_trajectory.csv'),track,delimiter=',',header='T,relative_x,v,E,gap,Q,a,W,dv',comments='')
ax.set(xlabel='Position relative to wall / wall width',ylabel='Group speed / initial characteristic',title='Independent reduced-model trajectories (synthetic)');ax.legend();fig.tight_layout();fig.savefig(OUT/'trajectory_comparison.png',dpi=180);plt.close(fig)
with open(OUT/'history_cases.csv','w') as f: writer=csv.DictWriter(f,fieldnames=rows[0].keys());writer.writeheader();writer.writerows(rows)
results['history_baseline']=rows[0];results['baseline_refinement_max_abs']=max(abs(rows[0][k]-rows[1][k]) for k in ['arrival_time','speed','retained','gap']);
(OUT/'verification.json').write_text(json.dumps(results,indent=2,allow_nan=True));print(json.dumps(results,indent=2));print('CASE SUMMARY');[print(r['name'],r['status'],r['speed'],r['retained'],r['max_sampled_dv']) for r in rows]
