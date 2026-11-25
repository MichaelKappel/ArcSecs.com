#!/usr/bin/env python3
"""ArcSecs R39: dimensionless, instantaneous weak-field source/photon exchange toy.

This is NOT a causal or complete gravitational field theory. Uses a conservation
ledger for two interacting participants with a translation-invariant Hamiltonian.
Outputs synthetic bench values; no observational data are fitted.
"""
from __future__ import annotations
from dataclasses import dataclass
from math import hypot, pi
import csv
from pathlib import Path

@dataclass(frozen=True)
class Params:
    G:float=1.0
    M:float=10.0
    c:float=100.0
    eta:float=2.0
    softening:float=0.0

# state = photon x,y, photon px,py, source X,Y, source Px,Py

def potential(r: float, par: Params)->float:
    return -par.G*par.M/hypot(r,par.softening)

def hamiltonian(s, par: Params)->float:
    x,y,px,py,X,Y,Px,Py=s
    separation=hypot(x-X,y-Y)
    p=hypot(px,py)
    if separation==0 or p==0: raise ValueError('zero separation or zero photon momentum')
    return (Px*Px+Py*Py)/(2*par.M) + par.c*p*(1+par.eta*potential(separation,par)/par.c**2)

def derivatives(s, par:Params):
    x,y,px,py,X,Y,Px,Py=s
    dx,dy=x-X,y-Y
    r2=dx*dx+dy*dy+par.softening**2
    r=r2**.5
    if r==0:raise ValueError('zero separation')
    p=hypot(px,py)
    if p==0:raise ValueError('zero photon momentum')
    pot=-par.G*par.M/r
    v=par.c*(1+par.eta*pot/par.c**2)
    dv=p and (v*px/p,v*py/p)
    # dPhi/dx = GM (x-X)/r^3. Force -partial H/partial x.
    a=-par.eta*p/par.c*par.G*par.M/r**3
    fpx=a*dx;fpy=a*dy
    return (dv[0],dv[1],fpx,fpy,Px/par.M,Py/par.M,-fpx,-fpy)

def step(s, dt, par):
    k1=derivatives(s,par)
    k2=derivatives(tuple(si+dt*k/2 for si,k in zip(s,k1)),par)
    k3=derivatives(tuple(si+dt*k/2 for si,k in zip(s,k2)),par)
    k4=derivatives(tuple(si+dt*k for si,k in zip(s,k3)),par)
    return tuple(si+dt*(a+2*b+2*c+d)/6 for si,a,b,c,d in zip(s,k1,k2,k3,k4))

def simulate(par=Params(), impact=5., initial_x=-250., dt=0.0005, duration=5.):
    s=(initial_x,impact,1.,0.,0.,0.,0.,0.)
    h0=hamiltonian(s,par); p0=(s[2]+s[6],s[3]+s[7]); max_drift=0.; pdrift=0.
    n=round(duration/dt)
    for i in range(n):
        s=step(s,dt,par)
        if i%25==0 or i==n-1:
            dh=abs(hamiltonian(s,par)-h0)/max(1.,abs(h0))
            dp=hypot((s[2]+s[6])-p0[0],(s[3]+s[7])-p0[1])
            max_drift=max(max_drift,dh)
            pdrift=max(pdrift,dp)
    from math import atan2
    alpha=atan2(-s[3],s[2])
    return {'eta':par.eta,'impact':impact,'alpha_rad':alpha,'alpha_approx_rad':2*par.eta*par.G*par.M/(impact*par.c**2),'final_source_Py':s[7],'final_photon_py':s[3],'max_relative_energy_drift':max_drift,'max_momentum_drift':pdrift,'final_x':s[0]}

def benchmarks():
    return [simulate(Params(eta=eta),impact=b) for eta,b in [(0,5),(1,5),(2,5),(2,7.5),(2,10)]]

if __name__ == '__main__':
    here=Path(__file__).resolve().parents[1]
    target=here/'docs/long-term-memory/research/photon-exchange-benchmarks.csv'
    target.parent.mkdir(parents=True,exist_ok=True)
    rows=benchmarks()
    with target.open('w',encoding='utf-8',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
    for row in rows: print(row)
    print('Wrote',target)
