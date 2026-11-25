#!/usr/bin/env python3
"""ArcSecs bubble-wall algebra sanity check: theoretical toy, not cosmological data."""
import math

def wall_energy(r,sigma,delta_p):
    if r<=0 or sigma<0: raise ValueError('positive radius and nonnegative surface tension required')
    return 4*math.pi*sigma*r*r-(4*math.pi/3)*delta_p*r**3

def wall_force(r,sigma,delta_p):
    if r<=0 or sigma<0: raise ValueError('positive radius and nonnegative surface tension required')
    return 4*math.pi*r*r*delta_p-8*math.pi*sigma*r

def critical_radius(sigma,delta_p):
    if sigma<=0 or delta_p<=0: raise ValueError('positive surface tension and pressure difference required')
    return 2*sigma/delta_p

def yukawa_shell_potential(r,a,lam,G,M):
    if not (0<=r<a and a>0 and lam>0 and G>=0 and M>=0):raise ValueError('invalid shell parameters')
    u=r/lam
    form=math.sinh(u)/u if u>1e-7 else 1+u*u/6+u**4/120
    return -(G*M/a)*math.exp(-a/lam)*form

if __name__=='__main__':
    sigma=.8;dp=1
    print('Toy critical radius:',critical_radius(sigma,dp))
    for r in (1,1.6,2): print(f'R={r}: U={wall_energy(r,sigma,dp):.6f} F={wall_force(r,sigma,dp):+.6f}')
    print('No astrophysical data used; parameters are dimensionless.')
