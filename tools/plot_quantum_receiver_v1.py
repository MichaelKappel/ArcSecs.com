"""Render Chapter 30N figures from recorded CSV values (no hidden fitting)."""
import csv
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

R=Path(__file__).resolve().parents[1]
D=R/'docs/long-term-memory/research/quantum-receiver'
F=R/'book/figures'
F.mkdir(parents=True,exist_ok=True)
with (D/'receiver_spectral_convergence.csv').open() as f:
    rows=list(csv.DictReader(f))
fig,ax=plt.subplots(figsize=(8.6,5.1))
for N in [24,48,96,192]:
    group=sorted([r for r in rows if int(r['N'])==N],key=lambda r:float(r['detune']))
    ax.plot([100*float(r['detune']) for r in group],[1e4*float(r['peak_receiver']) for r in group],
            marker='o' if N in (24,192) else None,markersize=4,linewidth=1.5,label=f'{N} Fourier modes')
ax.set(xlabel='Receiver detuning from source (%)',ylabel='Peak receiver excitation probability (× 10⁻⁴)',
       title='One-dimensional quantum receiver: cutoff and detuning')
ax.grid(alpha=.25);ax.legend();fig.tight_layout()
fig.savefig(F/'quantum-receiver-spectral-convergence.png',dpi=190)
plt.close(fig)
with (D/'receiver_time_trace.csv').open() as f:
    rows=list(csv.DictReader(f))
t=np.array([float(r['T']) for r in rows]);prob=np.array([float(r['receiver_excitation']) for r in rows])
fig,ax=plt.subplots(figsize=(8.6,4.6))
ax.plot(t,1e4*prob,lw=1.8)
ax.axvline(13.,linestyle='--',alpha=.6,label='Approximate geometric arrival time')
ax.set(xlabel='Common evolution parameter T (dimensionless)',ylabel='Receiver excitation probability (× 10⁻⁴)',
       title='Response of a two-level receiver to coherent source emission')
ax.legend();ax.grid(alpha=.25);fig.tight_layout()
fig.savefig(F/'quantum-receiver-time-response.png',dpi=190);plt.close(fig)
gap=np.array([float(r['local_gap']) for r in rows]);psi=np.array([float(r['psi']) for r in rows])
fig,ax=plt.subplots(figsize=(8.6,4.6))
ax.plot(t,gap,lw=1.8,label='Local screened atomic gap')
ax.axhline(.742152,color='gray',linestyle='--',alpha=.8,label='Chapter 30M reference at ψ = 0')
ax.set(xlabel='Common evolution parameter T (dimensionless)',ylabel='Quantum gap (local energy units)',
       title='Self-consistent scalar evolution changes the atomic reference gap')
ax.legend();ax.grid(alpha=.25);fig.tight_layout()
fig.savefig(F/'quantum-receiver-local-gap.png',dpi=190);plt.close(fig)
print('Created 3 figures')
