"""Independent dimensionless checks and conditional extensions of Parts XXVI–XXVIII."""
import csv, math
from pathlib import Path
from scipy.integrate import quad
from scipy.optimize import brentq
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/long-term-memory/research/cosmic-aging'

def speed(u): return u/math.hypot(1,u)
def age_distance(u,t,gamma=1.): return (math.asinh(u)-math.asinh(u*math.exp(-gamma*t)))/gamma
def age_for_z(eps,z):
    if not 0<eps<1 or not 0<=z<1/eps-1: raise ValueError('finite arrival requires E > rest energy')
    return math.log1p(z)+.5*(math.log1p(-eps*eps)-math.log1p(-(eps*(1+z))**2))
def deficit(eps,z):
    x=(eps*(1+z))**2
    if x>1: raise ValueError('below mass gap')
    return x/(1+math.sqrt(1-x))
def shell(q,x):
    if x==0:return 1.
    if x<=1:return math.sinh(q*x)/(q*x)
    return math.sinh(q)/q*math.exp(-q*(x-1))/x
def shell_quad(q,x):
    if x==0:return 1.
    return .5*math.exp(q)*quad(lambda mu:math.exp(-q*math.sqrt(1+x*x-2*x*mu))/math.sqrt(1+x*x-2*x*mu),-1,1,epsabs=1e-12,epsrel=1e-12)[0]
def shell_c(q,x):return math.sqrt(2/(1+shell(q,x)**2))
def void_fraction(s):return -math.expm1(-s)-s*math.exp(-s)
def energy_ceiling(v_initial,c_final):
    if not 0<=v_initial<c_final:raise ValueError('bound requires v_initial < final characteristic')
    return 1/math.sqrt(1-(v_initial/c_final)**2)
def emission_arrival(te,u=10.,gamma=.3,vs=-.08,vr=.03,D=1.):
    # x_s=vs*te, x_r=D+vr*ta. First crossing in a bracket where packet outruns receiver.
    upper=math.log(u/(vr/math.sqrt(1-vr*vr)))/gamma if vr>0 else 100/gamma
    f=lambda t:age_distance(u,t,gamma)-D-(vr-vs)*te-vr*t
    if f(0)>=0 or f(upper)<=0:raise ValueError('no first crossing in bracket')
    t=brentq(f,0,upper,xtol=1e-13)
    va=speed(u*math.exp(-gamma*t)); return te+t,(va-vs)/(va-vr),va

def reciprocity(dgda,ze,stretch,survival,z):return dgda*math.sqrt(ze*stretch/survival)/(1+z)**2

def bath_energy_per_momentum(ui,uf):
    # E(p_i)-E(p_f) divided by delta p; C=rest energy=1. Rationalized.
    return (ui+uf)/(math.hypot(1,ui)+math.hypot(1,uf))

def write(name,header,rows):
    with (OUT/name).open('w',newline='') as f:
        w=csv.writer(f);w.writerow(header);w.writerows(rows)
def main():
    OUT.mkdir(exist_ok=True,parents=True)
    rows=[]
    for e in [.01,.0001,1e-8,1e-16]:
        for z in [.1,.5,1,3,10]:
            u=math.sqrt(1-e*e)/e;t=age_for_z(e,z)
            d=age_distance(u,t);n=quad(lambda x:speed(u*math.exp(-x)),0,t,epsabs=1e-12)[0]
            rows.append((e,z,t,deficit(e,z),d,n,abs(d-n),z/(1+z)))
    write('drag.csv',['gap_fraction','z','gamma_age','speed_deficit','distance_gamma_over_C','quadrature','abs_error','energy_loss_fraction'],rows)
    shells=[(q,x,shell(q,x),shell_quad(q,x),shell_c(q,x)) for q in [.01,.1,.5,1,2,5] for x in [0,.5,1,2,3]]
    write('shell.csv',['q','r_over_R','response','quadrature','C_over_center'],shells)
    moves=[]
    for vs,vr in [(0,0),(-.08,0),(0,.03),(-.08,.03)]:
        for te in [0,.4,1.]:
            ta,a,v=emission_arrival(te,vs=vs,vr=vr)
            h=1e-5;fd=(emission_arrival(te+h,vs=vs,vr=vr)[0]-emission_arrival(te-h,vs=vs,vr=vr)[0])/(2*h)
            moves.append((vs,vr,te,ta,v,a,fd,abs(a-fd)))
    write('arrival.csv',['vs','vr','te','ta','va','analytic_stretch','fd_stretch','abs_error'],moves)
    bounds=[(r,energy_ceiling(1,r),1e-8*energy_ceiling(1,r),1-1e-8*energy_ceiling(1,r)) for r in [1.001,1.01,1.1,math.sqrt(2),2]]
    write('exit-bound.csv',['C_final_over_v_initial','max_Efinal_over_gap','max_energy_survival_eps_1e-8','min_loss'],bounds)
    info=f'Drag quadrature max absolute discrepancy: {max(r[6] for r in rows):.12g}\nShell quadrature max relative discrepancy: {max(abs(r[2]-r[3])/r[2] for r in shells):.12g}\nArrival derivative max absolute discrepancy: {max(r[7] for r in moves):.12g}\nMoving endpoints example: {emission_arrival(.4)}\nShell exit bound sqrt(2): {energy_ceiling(1,math.sqrt(2)):.12g}\n'
    (OUT/'verification.txt').write_text(info);print(info)
    import matplotlib;matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    fig,ax=plt.subplots(figsize=(7.2,4.2))
    z=np.geomspace(1,30,200)-1
    for e in [.01,.0001,1e-8,1e-16]:ax.loglog(1+z,[deficit(e,v) for v in z],label=f'gap / emission energy = {e:g}')
    ax.set(xlabel='Energy ratio 1 + z',ylabel='Fractional speed deficit',title='Fixed-gap drag: energy loss is not speed loss');ax.grid(alpha=.2);ax.legend(fontsize=8);fig.tight_layout();fig.savefig(ROOT/'book/figures/cosmic-aging-deficit.png',dpi=450);plt.close(fig)
    fig,ax=plt.subplots(figsize=(7.2,4.2));x=np.linspace(0,3,400)
    for q in [.1,1,5]:ax.plot(x,[shell_c(q,float(v)) for v in x],label=f'R / range = {q:g}')
    ax.axvline(1,ls='--',color='gray');ax.set(xlabel='Radius / shell radius',ylabel='Characteristic speed / center value',title='Static regulator: slower at the shell, faster outside');ax.grid(alpha=.2);ax.legend();fig.tight_layout();fig.savefig(ROOT/'book/figures/cosmic-aging-shell.png',dpi=450);plt.close(fig)
if __name__=='__main__':main()
