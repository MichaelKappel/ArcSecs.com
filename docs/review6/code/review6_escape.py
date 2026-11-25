"""Resonant selected-mode escape control; one photon, one reservoir excitation.
A Markov boundary approximation, not a derived cosmological damping law."""
from pathlib import Path
import csv,json,math
import numpy as np
from scipy.integrate import solve_ivp
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'appendices';FIG=ROOT/'figures'
g=.04; T=np.linspace(0,1200,2401); rows=[];results=[]
for factor in [0.,1.,2.,4.,8.,16.]:
    k=factor*g;lam2=(k/4)**2-g*g
    if lam2>1e-18:
        lam=math.sqrt(lam2);em=np.exp((-k/4+lam)*T);ep=np.exp((-k/4-lam)*T);A=.5*(em+ep)+k/(8*lam)*(em-ep);Y=g/(2*lam)*(em-ep)
    elif lam2< -1e-18:
        lam=math.sqrt(-lam2);exp=np.exp(-k*T/4);A=exp*(np.cos(lam*T)+k/(4*lam)*np.sin(lam*T));Y=exp*g/lam*np.sin(lam*T)
    else:A=np.exp(-g*T)*(1+g*T);Y=np.exp(-g*T)*g*T
    esc=1-A*A-Y*Y;converted=1-A*A;der=2*g*A*Y
    sol=solve_ivp(lambda t,y:[-g*y[1],g*y[0]-k*y[1]/2,k*y[1]**2],(0,T[-1]),[1,0,0],t_eval=T,method='DOP853',rtol=1e-12,atol=1e-14,max_step=1.)
    err=np.max(abs(sol.y-np.array([A,Y,esc])));print(factor,err,flush=True);assert err<2e-9;assert np.min(esc)>-2e-12 and np.max(converted)<=1+2e-12
    if factor>=4:assert np.min(der)>=-1e-15
    i=np.where(esc>=.9)[0];results.append(dict(kappa_over_g=factor,kappa=k,final_escaped=float(esc[-1]),min_sample_population_derivative=float(der.min()),first_sample_t90_escape=float(T[i[0]]) if len(i) else None,max_solution_difference=float(err),analytic_monotonic_total_conversion=factor>=4))
    for t,a,y,s,c,d in zip(T,A,Y,esc,converted,der):rows.append(dict(kappa_over_g=factor,kappa=k,g=g,T=t,A_population=a*a,B_local_population=y*y,B_escaped_population=s,total_B=c,d_total_B_dT=d))
with (OUT/'review6_escape.csv').open('w') as f:w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
(OUT/'review6_escape_summary.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
plt.rcParams.update({'font.size':10,'pdf.fonttype':42,'axes.spines.top':False,'axes.spines.right':False,'figure.figsize':(4.7,3.25)})
fig,ax=plt.subplots()
for factor in [0.,2.,4.,8.]:
    r=[x for x in rows if x['kappa_over_g']==factor and x['T']<=250];ax.plot([x['T'] for x in r],[x['total_B'] for x in r],label=f'κ/g={factor:g}')
ax.set(xlabel='Interaction time (normalized)',ylabel='Total converted population');ax.legend(fontsize=8);fig.tight_layout();fig.savefig(FIG/'review6_escape.pdf');plt.close(fig)
