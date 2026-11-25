"""Publication figures for bounded A-05j static charge/atom calculation."""
from pathlib import Path
import csv
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
ROOT=Path(__file__).resolve().parents[1]
D=ROOT/'docs/long-term-memory/research/massive-charge-atom'
F=ROOT/'book/figures'
F.mkdir(parents=True,exist_ok=True)

def load(name):
 with (D/name).open() as f:return list(csv.DictReader(f))
rows=load('yukawa_atomic_line_benchmark.csv');s=np.array([float(r['s_aBohr_over_ell']) for r in rows]);
fig,ax=plt.subplots(figsize=(8.4,4.9))
for key,label in [('line_1s_2p_numeric','1s → 2p (radial eigenproblem)'),('line_1s_2s_numeric','1s → 2s (radial eigenproblem)')]:
 ax.plot(s,[float(r[key]) for r in rows],marker='o',label=label)
ax.plot(s,[float(r['line_1s_2p_1storder']) for r in rows],linestyle='--',label='1s → 2p (first-order estimate)')
ax.set(xlabel='Screening strength $s=a_B/\\ell_Y$',ylabel='Transition energy / local Rydberg',title='Screened electrostatics changes the model atomic lines')
ax.grid(alpha=.25);ax.legend(fontsize=9);fig.tight_layout();fig.savefig(F/'massive-atom-lines.png',dpi=180);plt.close(fig)
rows=load('atomic_grid_convergence.csv');rows=[r for r in rows if float(r['s_aBohr_over_ell'])==.05]; n=np.array([int(r['radial_nodes']) for r in rows]);
fig,ax=plt.subplots(figsize=(8.4,4.8))
ax.plot((60/(n+1))**2,[float(r['line_1s_to_2p_E_R']) for r in rows],marker='o',label='1s → 2p line')
ax.set(xlabel='Squared radial grid spacing $h^2$',ylabel='1s → 2p line / local Rydberg',title='Grid refinement of the static atomic subproblem (s = 0.05)')
ax.grid(alpha=.25);ax.legend(fontsize=9);fig.tight_layout();fig.savefig(F/'massive-atom-grid-convergence.png',dpi=180);plt.close(fig)
print('created two figures')
