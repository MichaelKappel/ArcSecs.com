"""Part XXX restricted static wall benchmark; dimensionless E_e=C_e=1."""
import csv, math
from pathlib import Path
import numpy as np
from scipy.integrate import solve_ivp
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'appendices'; FIG=ROOT/'figures'; OUT.mkdir(exist_ok=True); FIG.mkdir(exist_ok=True)
# q_e = epsilon^2; endpoint constraint for fixed positive gap
rows=[]
for eps in (1e-2,1e-6,1e-10,1e-16):
    y0=math.acosh(1/eps)
    # sinh(y0)*cosh(y0) = sqrt(1-eps^2)/eps^2
    shch=math.sqrt(1-eps*eps)/(eps*eps)
    log_smax=y0/shch
    for s in (1.001,1.01,1.1,math.sqrt(2)):
        # numerically stable form of 1 - (1-eps^2)/s^2
        gmin=math.sqrt((s-1)*(s+1)+eps*eps)/s
        emax=eps/gmin
        rows.append(dict(epsilon=eps,ceiling_ratio=s,max_arrival_energy_fraction=emax,min_loss_fraction=1-emax,log_ceiling_ratio_max_constant_drag=log_smax,constant_drag_feasible=math.log(s)<log_smax,min_final_gap_fraction_of_emission_energy_at_z1=0.5*gmin))
with (OUT/'wall_energy_bounds.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
# Independent ODE integration in coordinate time, with linear wall C(x)=1+k*x, x in [0,1].
eps=.1;s=1.2;k=s-1;y0=math.acosh(1/eps);glo=k*math.sinh(y0)*math.cosh(y0);ghi=k*y0/math.log(s)
checks=[]; trajectories=[]
for gamma in (0,.2,2.,glo):
    # y(x) exact while y>0; x(t) stops asymptotically at y=0.
    def rhs(t,z):
        x,y=z; C=1+k*x
        return [C*math.tanh(y),-gamma*math.tanh(y)]
    def wall(t,z):return z[0]-1
    wall.terminal=True;wall.direction=1
    sol=solve_ivp(rhs,[0,80],[0,y0],rtol=2e-11,atol=1e-12,events=wall,dense_output=True,max_step=.05)
    x,y=sol.y; error=np.max(np.abs(y-(y0-gamma*np.log1p(k*x)/k)))
    assert error<1e-8,(gamma,error)
    reached=len(sol.t_events[0])>0
    expected=gamma<ghi
    assert reached==expected,(gamma,reached,expected)
    v=(1+k*x)*np.tanh(y); E=eps*np.cosh(y)
    # For this reduced model the energy sink Q = gamma E tanh^2 y.
    def rhs_ledger(t,z):
        x,y,b=z; C=1+k*x; E=eps*math.cosh(y)
        return [C*math.tanh(y),-gamma*math.tanh(y),gamma*E*math.tanh(y)**2]
    sl=solve_ivp(rhs_ledger,[0,80],[0,y0,0],rtol=2e-11,atol=1e-12,events=wall,max_step=.05)
    balance=float(np.max(np.abs(eps*np.cosh(sl.y[1])+sl.y[2]-1)))
    assert balance<1e-8
    checks.append((gamma,reached,float(x[-1]),float(v[-1]),float(E[-1]),float(error),balance))
    trajectories.append((gamma,x,v,E))
with (OUT/'wall_trajectory_checks.csv').open('w',newline='') as f:
    w=csv.writer(f);w.writerow(['gamma','reached_wall','x_final','v_final','E_final','rapidity_max_abs_error','ledger_max_abs_error']);w.writerows(checks)
# Additional exact tests for monotone vs energy endpoint; choose normalized final speed at initial speed.
for row in rows:
    eps=row['epsilon'];s=row['ceiling_ratio'];r=row['max_arrival_energy_fraction'];vf=s*math.sqrt(max(0,1-(eps/r)**2)); assert abs(vf-math.sqrt(1-eps*eps))<1e-12
with (OUT/'part_xxx_verification.txt').open('w') as f:
    f.write(f'16 endpoint identities; 4 independent ODE trajectory/analytic comparisons; 4 energy ledger comparisons; 4 reachability comparisons.\nMax rapidity discrepancy = {max(x[5] for x in checks):.6g}\nMax energy ledger discrepancy = {max(x[6] for x in checks):.6g}\nExample epsilon=0.1, C1/C0=1.2: gamma_min={glo:.9g}, gamma_cross_max={ghi:.9g}\nAll assertions passed. No observational fit.\n')
plt.rcParams.update({'font.size':11,'axes.spines.top':False,'axes.spines.right':False})
fig,ax=plt.subplots(figsize=(8,4.4))
sgrid=1+np.geomspace(1e-6,1,400)
for eps in (1e-2,1e-6,1e-10,1e-16):
    ax.loglog(sgrid-1,eps*sgrid/np.sqrt((sgrid-1)*(sgrid+1)+eps**2),label=f'gap / emission energy = {eps:g}')
ax.set(xlabel='Fractional increase in local ceiling',ylabel='Maximum retained photon energy fraction',title='Fixed-gap crossing: energy cost of nonincreasing speed'); ax.grid(alpha=.25,which='both');ax.legend(fontsize=9);fig.tight_layout();fig.savefig(FIG/'wall_energy_bounds.png',dpi=180);plt.close(fig)
fig,ax=plt.subplots(figsize=(8,4.3))
for g,x,v,E in trajectories:
    ax.plot(x,v,label=f'drag {g:.3g}')
ax.axhline(math.sqrt(.99),ls='--',color='gray',label='initial packet speed');ax.set(xlabel='Position across normalized wall',ylabel='Packet speed / initial ceiling',title='Linear wall: weak drag accelerates; monotone drag stops');ax.legend(fontsize=9);ax.grid(alpha=.2);fig.tight_layout();fig.savefig(FIG/'wall_trajectories.png',dpi=180);plt.close(fig)
print((OUT/'part_xxx_verification.txt').read_text());print(checks)
