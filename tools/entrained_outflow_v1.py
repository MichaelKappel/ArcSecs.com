"""Synthetic kinematic benchmark, not a dynamical theory or astronomical fit.
Positive constant gap, constant characteristic C, prescribed exponential physical outflow.
All quantities normalized to emission frequency = 1 in the default scan.
"""
from dataclasses import dataclass
import math
from scipy.integrate import quad
from scipy.optimize import brentq

@dataclass(frozen=True)
class Outflow:
    H: float = .2
    C: float = 1.
    gap: float = .1
    emit: float = 1.
    def __post_init__(self):
        if not (self.H>0 and self.C>0 and 0<=self.gap<self.emit):
            raise ValueError('Require H,C>0 and 0<=gap<emit')
    def S(self,t): return math.exp(self.H*t)
    def K(self,te): return self.S(te)*math.sqrt((self.emit-self.gap)*(self.emit+self.gap))/self.C
    def W(self,t,K): return math.hypot(self.C*K/self.S(t),self.gap)
    def f(self,t,K): return self.C**2*K/(self.S(t)**2*self.W(t,K))
    def reach(self,te): return (self.emit-self.gap)/(self.H*self.K(te))
    def chi_at_z(self,te,z):
        if not (z>0 and self.emit/(1+z)>self.gap): raise ValueError('Target redshift outside finite-frequency reach')
        return (self.emit-self.emit/(1+z))/(self.H*self.K(te))
    def arrival(self,te,chi):
        if not 0<chi<self.reach(te): raise ValueError('No finite forward arrival')
        K=self.K(te); wa=self.emit-self.H*K*chi
        return math.log(self.C*K/math.sqrt((wa-self.gap)*(wa+self.gap)))/self.H
    def arrival_numeric(self,te,chi):
        K=self.K(te)
        if not 0<chi<self.reach(te): raise ValueError('No finite forward arrival')
        hi=te+1/self.H
        while quad(lambda t:self.f(t,K),te,hi,epsabs=1e-11)[0]<chi: hi=te+2*(hi-te)
        return brentq(lambda ta:quad(lambda t:self.f(t,K),te,ta,epsabs=1e-11)[0]-chi,te,hi,xtol=1e-12)
    def observables(self,te,chi,survival=1.):
        if not 0<survival<=1: raise ValueError('Invalid survival fraction')
        K=self.K(te); ta=self.arrival(te,chi); wa=self.W(ta,K)
        Z=self.emit/wa
        A=1+wa*(self.emit-wa)/((wa-self.gap)*(wa+self.gap))
        DA=self.S(te)*chi; DG=self.S(ta)*chi
        DL=DG*math.sqrt(Z*A/survival)
        return dict(te=te,ta=ta,chi=chi,gap_fraction=self.gap/self.emit,Z=Z,A=A,DA=DA,DG=DG,DL=DL,eta=DL/(Z**2*DA),reach=self.reach(te))

if __name__=='__main__':
    from pathlib import Path
    import csv
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    root=Path(__file__).resolve().parents[1]
    dest=root/'docs/long-term-memory/research/outflow'; dest.mkdir(exist_ok=True)
    rows=[]
    for gap in (0.,.001,.01,.1,.2,.3):
        model=Outflow(gap=gap)
        for z in (.1,.5,1.,2.):
            chi=model.chi_at_z(0,z); row=model.observables(0,chi)
            row['target_z']=z; row['quadrature_error']=abs(row['ta']-model.arrival_numeric(0,chi))
            h=1e-5
            row['timing_error']=abs(row['A']-(model.arrival(h,chi)-model.arrival(-h,chi))/(2*h))
            rows.append(row)
    with (dest/'scan.csv').open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=rows[0].keys());w.writeheader();w.writerows(rows)
    fig,ax=plt.subplots(figsize=(7,4.2))
    for gap in (0.,.01,.1,.2,.3):
        m=Outflow(gap=gap); zs=[.01+i*1.99/120 for i in range(121)]
        ax.plot(zs,[m.observables(0,m.chi_at_z(0,z))['A']/(1+z) for z in zs],label=f'gap fraction {gap:g}')
    ax.set(xlabel='Energy redshift z (selected target)',ylabel='Arrival stretch / (1 + z)',title='Prescribed physical outflow: finite-gap timing test');ax.grid(alpha=.25);ax.legend();fig.tight_layout()
    fig.savefig(root/'book/figures/entrained-outflow-timing.png',dpi=450);plt.close(fig)
    print('Cases:',len(rows),'max quadrature discrepancy',max(r['quadrature_error'] for r in rows),'max timing derivative discrepancy',max(r['timing_error'] for r in rows))
    for r in rows:
        if r['target_z']==1: print(r['gap_fraction'],r['A'],r['eta'],r['DA'],r['DG'])
