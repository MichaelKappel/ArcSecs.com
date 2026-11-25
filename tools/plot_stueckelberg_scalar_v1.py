"""Figures for ArcSecs 30L, using only dimensionless, synthetic data."""
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from stueckelberg_scalar_v1 import run, group_phase, yukawa_residual
root=Path(__file__).resolve().parents[1];out=root/'book'/'figures';out.mkdir(exist_ok=True)
t,y,E,etot,c,drift=run()
fig,ax=plt.subplots(figsize=(8.3,4.1))
ax.plot(t,E[:,0],label='Scalar energy');ax.plot(t,E[:,1],label='Transverse-mode energy');ax.plot(t,E[:,2],label='Longitudinal-mode energy');ax.plot(t,etot,'--',label='Total energy')
ax.set(xlabel='Normalized progression T',ylabel='Dimensionless energy',title='Closed three-sector exchange (synthetic)');ax.grid(alpha=.2);ax.legend(loc='best',fontsize=8);fig.tight_layout();fig.savefig(out/'stueckelberg-energy-sectors.png',dpi=175);plt.close(fig)
fig,ax=plt.subplots(figsize=(8.3,4.1))
k=np.logspace(-1,1.6,180)
for psi in [0,1.13388016]:
    vg=np.array([group_phase(psi,kk)[0] for kk in k]);c=np.exp(-.5*psi)
    ax.plot(k,vg,label=f'Group speed, ψ={psi:.2f}');ax.axhline(c,linestyle='--',alpha=.65,label=f'Characteristic speed, ψ={psi:.2f}')
ax.set(xscale='log',xlabel='Dimensionless wavenumber k',ylabel='Speed in normalized units',title='A photon mass gap makes packet transport dispersive');ax.grid(alpha=.2);ax.legend(fontsize=8);fig.tight_layout();fig.savefig(out/'stueckelberg-massive-speed.png',dpi=175);plt.close(fig)
fig,ax=plt.subplots(figsize=(8.3,4.1))
n=np.array([201,401,801,1601]); residual=np.array([yukawa_residual(int(v)) for v in n]);ax.loglog(n,residual,'o-',label='Finite-difference residual');ax.loglog(n,residual[0]*(n[0]/n)**2,':',label='Second-order reference')
ax.set(xlabel='Radial nodes',ylabel='Max radial ODE residual',title='Yukawa electrostatic equation: grid check');ax.grid(alpha=.2);ax.legend(fontsize=8);fig.tight_layout();fig.savefig(out/'stueckelberg-yukawa-convergence.png',dpi=175);plt.close(fig)
print('Created 3 figures.')
