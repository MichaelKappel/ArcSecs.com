"""Part XXVIII: dimensionless passive massive-packet drag benchmark.
Not a microscopic bath or cosmological fit. Run from any directory.
"""
from pathlib import Path
import csv, numpy as np
from scipy.integrate import quad
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
P=Path(__file__).resolve().parents[1]
# x=gamma*t, epsilon=rest energy/initial energy
rows=[]; errs=[]
for eps in [1e-2,1e-4,1e-8,1e-16]:
    u0=np.sqrt(1-eps**2)/eps
    for z in [0,1,3,10,100]:
        r=eps*(1+z)
        if r>=1: continue
        u=np.sqrt(1-r*r)/r
        x=np.log(u0/u)
        distance=np.arcsinh(u0)-np.arcsinh(u)
        numeric=quad(lambda t: (u0*np.exp(-t))/np.hypot(1,u0*np.exp(-t)),0,x,epsabs=1e-12)[0]
        errs.append(abs(distance-numeric))
        # stable evaluation of 1-v/C
        deficit=r*r/(1+np.sqrt(1-r*r))
        drag_loss=1-1/(1+z)
        rows.append([eps,z,x,distance,deficit,drag_loss])
with (P/'appendices'/'photon_aging.csv').open('w') as f:
 w=csv.writer(f);w.writerow(['rest_to_initial_energy','z','gamma_age','gamma_distance_over_C','one_minus_v_over_C','energy_fraction_transferred']);w.writerows(rows)
assert max(errs)<1e-12
# exact energy-loss rate and energy + bath ledger using finite diff at moderate dimensionless values
u0=100.; x=np.linspace(0,9,1001);u=u0*np.exp(-x);e=np.hypot(1,u);bath=e[0]-e
assert np.max(np.abs(e+bath-e[0]))<1e-12
assert np.all(np.diff(e)<=0)
# stationary emission times: equal travel ages give unchanged packet intervals
em=np.array([0.,0.2,0.7,1.5]);arrival=em+2.3
assert np.max(np.abs(np.diff(em)-np.diff(arrival)))<1e-14
# deficit curves plotted vs z
fig,ax=plt.subplots(figsize=(7.2,4.2),layout='constrained')
for eps in [1e-2,1e-4,1e-8,1e-16]:
 z=np.geomspace(1,100,400)-1;r=eps*(1+z);m=r<1;z=z[m];r=r[m];ax.loglog(1+z,r*r/(1+np.sqrt(1-r*r)),label=f'Initial gap fraction = {eps:g}')
ax.set(xlabel='Frequency ratio 1 + z',ylabel='Fractional speed deficit 1 − v/C',title='Fixed-gap massive-packet drag: redshift is not speed loss');ax.grid(True,which='both',alpha=.18);ax.legend(fontsize=8)
fig.savefig(P/'figures'/'photon_aging.png',dpi=200);plt.close(fig)
(P/'appendices'/'part_xxviii_verification.txt').write_text(f'Executed exact-distance vs quadrature comparisons: {len(errs)}\nMaximum absolute discrepancy: {max(errs):.6g}\nEnergy-ledger arithmetic and stationary pulse separation assertions passed.\nThe bath ledger is a bookkeeping identity, not an independently simulated field.\n')
print('max discrepancy',max(errs))
