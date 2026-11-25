#!/usr/bin/env python3
"""ArcSecs BP-3: analytic Yukawa-shell field, tidal comparison, and test-particle energy.

Toy model, NOT cosmological data or an observed external universe. SI inputs
unless explicitly described as dimensionless. No astronomy fitted.
"""
from __future__ import annotations
from math import sinh, cosh, exp, pi, sqrt
from typing import Sequence

G_NEWTON = 6.67430e-11
M_SUN = 1.98847e30
MPC = 3.085677581491367e22
C_LIGHT = 299792458.0

def _check(r:float,a:float,lam:float,G:float,M:float):
    if not (0 <= r < a and a > 0 and lam>0 and G>=0 and M>=0):
        raise ValueError('Need 0 <= r < shell radius a, positive lambda, nonnegative coupling and mass')
    if a/lam > 680 or r/lam > 680:
        raise ValueError('Unsupported extreme exponential regime; rescale parameters')

def potential(r:float,a:float,lam:float,G:float,M:float) -> float:
    """Potential inside a static uniform Yukawa-coupled thin shell, J/kg."""
    _check(r,a,lam,G,M)
    x=r/lam
    form=1 + x*x/6 + x**4/120 + x**6/5040 if x<1e-3 else sinh(x)/x
    return -G*M/a * exp(-a/lam)*form

def acceleration(r:float,a:float,lam:float,G:float,M:float) -> float:
    """Outward radial acceleration a_r=-dPhi/dr, m/s^2."""
    _check(r,a,lam,G,M)
    x=r/lam
    form=(x/3 + x**3/30 + x**5/840) if x<1e-3 else (x*cosh(x)-sinh(x))/x**2
    return G*M/a/lam*exp(-a/lam)*form

def center_gradient(a:float,lam:float,G:float,M:float) -> float:
    """Small-r acceleration per radius, units s^-2."""
    _check(0,a,lam,G,M)
    return G*M*exp(-a/lam)/(3*a*lam**2)

def needed_shell_mass(target_gradient:float,a:float,lam:float,G:float) -> float:
    """Shell mass that produces central a/r=target_gradient in fixed-source approx."""
    if not (target_gradient>0 and a>0 and lam>0 and G>0):raise ValueError('positive inputs required')
    if a/lam>680: raise ValueError('exponential overflow')
    return 3*target_gradient*a*lam**2*exp(a/lam)/G

def tidal_tensor(nx:float,ny:float,nz:float,K:float)->list[list[float]]:
    """Newtonian point-neighbor tidal tensor K*(3*n*n^T-I); K=GM/D^3."""
    if K<0:raise ValueError('K>=0')
    mag=sqrt(nx*nx+ny*ny+nz*nz)
    if mag == 0:raise ValueError('nonzero direction')
    n=[nx/mag,ny/mag,nz/mag]
    return [[K*(3*n[i]*n[j]-(1 if i==j else 0)) for j in range(3)] for i in range(3)]

def signal_delay(distance:float,speed:float)->float:
    """Causal *minimum* for an event-generated field disturbance; not an upper bound."""
    if distance <0 or speed<=0:raise ValueError('nonnegative distance and positive speed')
    return distance/speed

def leapfrog_energy_drift(a=4.,lam=1.5,G=1.,M=3.,r0=.5,v0=.2,dt=.001,steps=1500):
    """Static source test-particle energy conservation; no backreaction."""
    if not (0<r0<a and dt>0 and steps>0):raise ValueError('invalid orbit inputs')
    r,v=r0,v0
    E0=.5*v*v+potential(r,a,lam,G,M)
    max_drift=0.
    for _ in range(steps):
        vhalf=v+.5*dt*acceleration(r,a,lam,G,M)
        rnew=r+dt*vhalf
        if not (0<rnew<a):raise RuntimeError('particle exits reference shell; shorten test')
        v=vhalf+.5*dt*acceleration(rnew,a,lam,G,M)
        r=rnew
        E=.5*v*v+potential(r,a,lam,G,M)
        max_drift=max(max_drift,abs(E-E0))
    return {'r_final':r,'v_final':v,'energy_initial':E0,'max_abs_energy_drift':max_drift}

if __name__=='__main__':
    H0=70*1e3/MPC
    a=1000*MPC; lam=500*MPC
    mass=needed_shell_mass(H0**2,a,lam,G_NEWTON)
    print(f'H0={H0:.9g} s^-1 | target a/r=H0^2={H0**2:.9g} s^-2')
    print(f'For shell a=1000 Mpc lambda=500 Mpc, Gx=G: M={mass/M_SUN:.6g} solar masses')
    for d in [MPC,100*MPC]:
        print(f'r={d/MPC:.0f} Mpc a_exact={acceleration(d,a,lam,G_NEWTON,mass):.6g} m/s^2')
    print('Tidal example n=(1,0,0), K=1e-36:',tidal_tensor(1,0,0,1e-36))
    print('Causal-minimum 1 Gpc at light speed: ',signal_delay(a,C_LIGHT)/(365.25*86400*1e9),'Gyr')
    print('Energy check (dimensionless):',leapfrog_energy_drift())
