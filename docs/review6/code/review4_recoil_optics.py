#!/usr/bin/env python3
"""Finite-wall recoil and directional optical Jacobi checks. Reduced controls only."""
from pathlib import Path
import csv, math
import numpy as np
from scipy.integrate import solve_ivp
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
R=Path(__file__).resolve().parents[1]; O=R/'appendices'; F=R/'figures'
def write(name,rows):
 with (O/name).open('w',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
def run(Mw,step=.02,tol=1e-11):
 d0=1e-6; beta=1.; M=100.; cap=2.; p0=math.sqrt(1-d0*d0); inv=0. if math.isinf(Mw) else 1/Mw
 def values(y):
  x,p,a,Q,X,W=y; r=x-X; u=np.clip(r,0.,1.); C=1+.2*u*u*(3-2*u); Cp=1.2*u*(1-u); D=d0+beta*a; E=math.hypot(C*p,D); v=C*C*p/E; A=v-beta*D/E-a/M; rate=max(A,0.)*max(1-a/cap,0.); Hx=C*Cp*p*p/E
  # C moves with wall; conservative static-wall term acquires extra -U_w*d v/dx at fixed p,a
  dv=v*v*Cp/C-C*C*D*(D+beta*p)*rate/E**3-inv*W*(2*C*Cp*p/E-C**3*Cp*p**3/E**3)
  return E,v,Hx,A,rate,dv,C
 def rhs(t,y):
  E,v,Hx,A,rate,dv,C=values(y); return [v,-Hx-rate,rate,A*rate,y[-1]*inv,Hx]
 def arrive(t,y):return y[0]-y[4]-1
 arrive.terminal=True;arrive.direction=1
 def stop(t,y):return y[1]-1e-10
 stop.terminal=True;stop.direction=-1
 sol=solve_ivp(rhs,(0,100),[-.3,p0,0.,0.,0.,0.],method='DOP853',rtol=tol,atol=tol*.01,max_step=step,events=(arrive,stop),dense_output=True)
 t=np.unique(np.r_[np.linspace(0,sol.t[-1],3001),sol.t]); Y=sol.sol(t); x,p,a,Q,X,W=Y; E,v,Hx,A,rate,dv,C=np.array([values(y) for y in Y.T]).T
 P=p+a+W; total=E+a*a/(2*M)+Q+W*W*inv/2
 row=dict(wall_mass='infinity' if math.isinf(Mw) else Mw,status='arrived' if len(sol.t_events[0]) else ('stopped_threshold' if len(sol.t_events[1]) else ('timeout' if sol.success else 'solver_failure')),rtol=tol,max_step=step,duration=t[-1],energy=E[-1],speed=v[-1],gap=d0+a[-1],wall_recoil=W[-1]**2*inv/2,wall_displacement=X[-1],wall_speed=W[-1]*inv,heat=Q[-1],bath_recoil=a[-1]**2/(2*M),max_sampled_dvdt=max(dv),energy_error=max(abs(total-1)),momentum_error=max(abs(P-p0)))
 assert row['energy_error']<1e-7 and row['momentum_error']<1e-9
 return row,np.column_stack((t,x-X,v,E,Q,W*W*inv/2))
rows=[]; traces=[]
for mass in (math.inf,100.,10.,1.):
 r,tr=run(mass);rows.append(r);traces.append(tr)
r,tr=run(10.,.005,1e-13);rows.append(r);assert max(abs(r[k]-rows[2][k]) for k in ('duration','energy','speed'))<1e-8
write('review4_recoil.csv',rows)
# 3D isotropic rapidity-label rays: transverse Jacobi equation J''=J,
# J(0)=0,J'(0)=1. Integrate in each direction with local transverse units.
optic=[]
for eta in (.1,.5,1.,2.):
 sol=solve_ivp(lambda l,y:[y[1],y[0]],(0,eta),[0.,1.],rtol=1e-12,atol=1e-14,method='DOP853')
 J=sol.y[0,-1];assert abs(J-math.sinh(eta))<1e-10
 for te,ta in [(1.,2.),(.5,3.)]:
  optic.append(dict(eta=eta,tau_e=te,tau_a=ta,J_numerical=J,J_exact=math.sinh(eta),angular_distance=te*J,reverse_area_distance=ta*J,error=abs(J-math.sinh(eta))))
write('review4_optical_jacobi.csv',optic)
plt.rcParams.update({'font.size':10,'pdf.fonttype':42});fig,ax=plt.subplots(figsize=(4.65,3.1))
for r,tr,style in zip(rows,traces,('-','--',':','-.')):ax.plot(tr[:,1],tr[:,2],style,label='wall mass '+str(r['wall_mass']))
ax.set(xlabel='Position relative to wall',ylabel='Packet speed / reference ceiling');ax.legend(fontsize=8);ax.grid(alpha=.2);fig.tight_layout();fig.savefig(F/'review4_recoil.pdf');plt.close(fig)
(O/'review4_recoil_verification.txt').write_text('Five finite/infinite wall integrations: energy/momentum assertions passed; finite-mass refinement passed. Eight directional area cases: independent numerical Jacobi equation agrees with sinh(eta). No interval certificate or physical fit.\n')
print(rows)
