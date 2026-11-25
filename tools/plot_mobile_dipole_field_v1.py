#!/usr/bin/env python3
"""Publication graphs for synthetic 1D A-05g model (no observational data)."""
from pathlib import Path
import csv
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

root=Path(__file__).resolve().parents[1]
dir_=root/'docs/long-term-memory/research/mobile-dipole-field'
figs=root/'book/figures'
figs.mkdir(exist_ok=True)
def load(name):
    with (dir_/(name+'.csv')).open() as f:r=list(csv.DictReader(f))
    return {k:np.array([float(row[k]) for row in r]) for k in r[0]}
b=load('baseline'); n=load('no_excitation'); z=load('no_radiation')
t=b['T']; E0=b['total_energy'][0]; P0=b['total_momentum'][0]
fig,ax=plt.subplots(figsize=(9,5))
ax.plot(t,b['q_source'],label='Emitting dipole displacement')
ax.plot(t,b['q_receiver'],label='Receiving dipole displacement')
ax.plot(t,n['q_receiver'],'--',label='Receiver, no initial emission')
ax.plot(t,z['q_receiver'],':',label='Receiver, coupling disabled')
ax.set(xlabel='Progression T (dimensionless)',ylabel='Transverse charge separation q',title='A-05g — Dynamical emission and reception (synthetic)')
ax.legend(loc='best');ax.grid(alpha=.2);fig.tight_layout()
fig.savefig(figs/'mobile-dipole-emission.png',dpi=175);plt.close(fig)
fig,ax=plt.subplots(figsize=(9,5))
ax.plot(t,b['p_center_source'],label='Emitter center momentum')
ax.plot(t,b['p_center_receiver'],label='Receiver center momentum')
ax.plot(t,b['p_fields'],label='EM + scalar field momentum')
ax.plot(t,b['total_momentum'],'--',label='Total canonical momentum')
ax.set(xlabel='Progression T (dimensionless)',ylabel='Longitudinal canonical momentum',title='A-05g — Momentum exchange with moving matter')
ax.legend(loc='best');ax.grid(alpha=.2);fig.tight_layout()
fig.savefig(figs/'mobile-dipole-momentum.png',dpi=175);plt.close(fig)
fig,axs=plt.subplots(2,1,figsize=(9,7),sharex=True)
axs[0].plot(t,b['field_energy'],label='Combined fields')
axs[0].plot(t,b['matter_energy'],label='Mobile charged composites')
axs[0].plot(t,b['total_energy'],label='Total energy',ls='--')
axs[0].legend();axs[0].set(ylabel='Energy',title='A-05g — Autonomous exchange and numerical conservation')
axs[1].plot(t,b['total_energy']-E0,label='Energy residual')
axs[1].plot(t,b['total_momentum']-P0,label='Momentum residual')
axs[1].legend();axs[1].set(xlabel='Progression T (dimensionless)',ylabel='Absolute numerical deviation')
for a in axs:a.grid(alpha=.2)
fig.tight_layout();fig.savefig(figs/'mobile-dipole-conservation.png',dpi=175);plt.close(fig)
print('Wrote A-05g figure triptych')
