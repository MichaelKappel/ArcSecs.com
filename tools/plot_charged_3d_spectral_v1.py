#!/usr/bin/env python3
"""Generate clearly labelled synthetic result plots for A-05h."""
from pathlib import Path
import csv, json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'docs/long-term-memory/research/charged-3d-field'
OUT=ROOT/'book/figures'
OUT.mkdir(parents=True,exist_ok=True)

def read(name):
    with (DATA/(name+'.csv')).open() as f:
        return list(csv.DictReader(f))

def xy(name,col):
    rows=read(name);return np.array([float(r['T']) for r in rows]),np.array([float(r[col]) for r in rows])

plt.rcParams.update({'font.size':10,'axes.spines.top':False,'axes.spines.right':False,'figure.dpi':160})
fig,ax=plt.subplots(figsize=(8.2,4.5))
for n,label in [('baseline','Excited, 13 modes'),('unexcited_source','Unexcited control'),('no_electric_charge','Zero-charge control')]:
    x,y=xy(n,'receiver_separation');ax.plot(x,y,label=label)
ax.set_xlabel('Model time T (dimensionless)');ax.set_ylabel('Receiver charge separation (dimensionless)')
ax.set_title('3D mobile-charge response: synthetic controls');ax.legend(frameon=False,loc='upper left')
ax.grid(alpha=.2);fig.tight_layout();fig.savefig(OUT/'charged-3d-receiver-controls.png',dpi=450);plt.close(fig)

fig,axes=plt.subplots(2,1,figsize=(8.2,6.2),sharex=True)
x,H=xy('baseline','energy');H0=H[0]
axes[0].plot(x,(H-H0)/abs(H0));axes[0].set_ylabel('Relative total-energy deviation');axes[0].grid(alpha=.2)
for col,l in [('momentum_x','Pₓ'),('momentum_y','Pᵧ'),('momentum_z','P_z')]:
    xx,y=xy('baseline',col);axes[1].plot(xx,y-y[0],label=l)
axes[1].set_xlabel('Model time T');axes[1].set_ylabel('Total canonical momentum drift');axes[1].legend(ncol=3,frameon=False);axes[1].grid(alpha=.2)
fig.suptitle('Autonomous Hamiltonian: numerical conservation residuals')
fig.tight_layout();fig.savefig(OUT/'charged-3d-conservation.png',dpi=450);plt.close(fig)

fig,axes=plt.subplots(1,2,figsize=(9.,3.7))
for n,label in [('baseline_short_for_resolution','13-mode shell'),('larger_mode_shell','62-mode shell')]:
    x,y=xy(n,'receiver_separation');axes[0].plot(x,y,label=label)
axes[0].set_xlabel('Model time T');axes[0].set_ylabel('Receiver separation');axes[0].legend(frameon=False);axes[0].grid(alpha=.2)
for col,label in [('continuity_residual','Charge continuity'),('gauss_residual','Gauss law')]:
    x,y=xy('baseline',col);axes[1].semilogy(x,np.maximum(y,1e-20),label=label)
axes[1].set_xlabel('Model time T');axes[1].set_ylabel('Retained-mode residual');axes[1].legend(frameon=False);axes[1].grid(alpha=.2)
fig.suptitle('Critical distinction: algebraic closure vs spectral convergence');fig.tight_layout()
fig.savefig(OUT/'charged-3d-resolution-constraints.png',dpi=450);plt.close(fig)
print('saved 3 charts')
