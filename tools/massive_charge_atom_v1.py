"""ArcSecs A-05j bounded benchmark: charge continuity, Yukawa spectroscopy.

Numerical implementation of a classical Stueckelberg electrostatic sector
and nonrelativistic 1-particle central-potential radial eigenvalue problem.
No coupled photon emission, renormalized QED, actual cosmology or detection.
"""
from __future__ import annotations
import argparse
import csv
from pathlib import Path
import numpy as np
from scipy.linalg import eigh_tridiagonal


def density_current_fourier(r, v, q, k, sigma):
    """Gaussian-smeared charge/current and exact instantaneous d rho/dT.

    r,v shape=(n_charges,3); k shape=(3,). All quantities normalized.
    Same smearing kernel must be used for charge and current.
    """
    r, v, q, k = map(np.asarray, (r, v, q, k))
    assert r.ndim == 2 and r.shape == v.shape and r.shape[1] == 3
    assert q.shape == (len(r),) and k.shape == (3,) and sigma >= 0
    kernel = np.exp(-.5*sigma**2*np.dot(k,k))
    phases = np.exp(-1j * (r @ k))*q*kernel
    rho = phases.sum()
    j = (phases[:,None]*v).sum(axis=0)
    drho = (-1j * phases*(v@k)).sum()
    return rho,j,drho


def gauss_potential_mode(rho, k, epsilon, zeta):
    k=np.asarray(k)
    assert epsilon > 0 and zeta > 0
    phi=rho/(epsilon*np.dot(k,k)+zeta)
    return phi


def yukawa_kernel(r, ell, epsilon=1.):
    assert r>0 and ell>0 and epsilon>0
    return np.exp(-r/ell)/(4*np.pi*epsilon*r)


def yukawa_radial_force(r, ell, epsilon=1., qa=1., qb=1.):
    """Signed radial force on particle 2 along +rhat from particle 1."""
    assert r>0 and ell>0 and epsilon>0
    return qa*qb*np.exp(-r/ell)*(1/r**2+1/(ell*r))/(4*np.pi*epsilon)


def F1s(s):
    return 4/(2+s)**2

def F2s(s):
    d=1+s
    return .5/d**2 - 1/d**3 + .75/d**4

def F2p(s):
    return .25/(1+s)**4


def perturbation(s):
    """Hydrogenic first-order Yukawa corrections in Rydberg units.
    H0=-d²/dr² + l(l+1)/r² - 2/r, V=-2 exp(-sr)/r.
    """
    assert s>=0
    e1=-1+2*(1-F1s(s))
    e2s=-.25+2*(.25-F2s(s))
    e2p=-.25+2*(.25-F2p(s))
    return np.array([e1,e2s,e2p])


def radial_eigenvalues(s,nodes=2000,rmax=60.):
    """Dirichlet radial finite difference; energies [1s,2s,2p] / E_R.
    Tridiagonal symmetric operator on interior r_j = j h.
    """
    if s<0 or nodes<200 or rmax<25: raise ValueError('unphysical grid')
    h=rmax/(nodes+1)
    r=h*np.arange(1,nodes+1)
    center=2/h**2 -2*np.exp(-s*r)/r
    off=np.full(nodes-1,-1/h**2)
    es=eigh_tridiagonal(center,off,select='i',select_range=(0,1),check_finite=False,lapack_driver='stebz')[0]
    ep=eigh_tridiagonal(center+2/r**2,off,select='i',select_range=(0,0),check_finite=False,lapack_driver='stebz')[0]
    return np.array([es[0],es[1],ep[0]])


def ratios(e):
    return np.array([e[2]-e[0],e[1]-e[0],e[2]-e[1]])


def param_scaling(theta, q_mass=0., s0=.05):
    """Part XIX matched family: eps=e^theta, zeta=Omega0² e^{3theta}.
    Reduced mass varies as exp(q_mass*theta) in a chosen toy atomic model.
    Atomic Rydberg factor scales exp((q_mass-2)*theta),
    screening strength a_B/ell scales exp((2-q_mass)*theta).
    """
    return np.exp((q_mass-2)*theta),s0*np.exp((2-q_mass)*theta)


def scaled_line(theta,q_mass=0.,s0=.05,nodes=2200):
    scale,s=param_scaling(theta,q_mass,s0)
    return scale*ratios(radial_eigenvalues(s,nodes=nodes))[0]


def run(output_dir):
    output_dir=Path(output_dir);output_dir.mkdir(parents=True,exist_ok=True)
    # Isolate grid convergence from physical parameter changes.
    gridrows=[]
    for s in [0.,.05,.10]:
        for n in [600,1200,2400,4800,9600,14400]:
            e=radial_eigenvalues(s,n)
            d=ratios(e)
            gridrows.append([s,n,*e,*d])
    with (output_dir/'atomic_grid_convergence.csv').open('w',newline='') as f:
        w=csv.writer(f);w.writerow(['s_aBohr_over_ell','radial_nodes','E_1s_E_R','E_2s_E_R','E_2p_E_R','line_1s_to_2p_E_R','line_1s_to_2s_E_R','split_2p_minus_2s_E_R']);w.writerows(gridrows)
    spect=[]
    for s in [0.,.005,.01,.02,.05,.075,.10,.15,.20]:
        e=radial_eigenvalues(s,nodes=4000)
        p=perturbation(s)
        spect.append([s,*e,*p,*ratios(e),*ratios(p)])
    with (output_dir/'yukawa_atomic_line_benchmark.csv').open('w',newline='') as f:
        w=csv.writer(f);w.writerow(['s_aBohr_over_ell','E_1s_numeric','E_2s_numeric','E_2p_numeric','E_1s_1storder','E_2s_1storder','E_2p_1storder','line_1s_2p_numeric','line_1s_2s_numeric','split_2p_2s_numeric','line_1s_2p_1storder','line_1s_2s_1storder','split_2p_2s_1storder']);w.writerows(spect)
    k=np.array([1.7,-.9,.65]);r=np.array([[-.45,.25,.13],[.30,.09,-.21]]);v=np.array([[.14,-.07,.06],[-.10,.05,.09]]);q=np.array([1.,-1.]);sig=.12
    rho,j,drho=density_current_fourier(r,v,q,k,sig)
    residual=abs(drho+1j*np.dot(k,j))
    rho_half1=density_current_fourier(r+v*1e-4,v,q,k,sig)[0]
    rho_half0=density_current_fourier(r-v*1e-4,v,q,k,sig)[0]
    fd_error=abs((rho_half1-rho_half0)/(2e-4)-drho)
    with (output_dir/'mode_charge_continuity.csv').open('w',newline='') as f:
        w=csv.writer(f);w.writerow(['rho_real','rho_imag','Jx_real','Jy_real','Jz_real','continuity_residual','finite_differencing_error','gauss_constraint_residual']);phi=gauss_potential_mode(rho,k,1.2,.16);w.writerow([rho.real,rho.imag,j[0].real,j[1].real,j[2].real,residual,fd_error,abs((1.2*np.dot(k,k)+.16)*phi-rho)])
    # Write concise run summary.
    rows=np.asarray(gridrows)
    arr=rows[(rows[:,0]==.05)]
    high=arr[-1]
    print('s=.05, final grid: E(1s,2s,2p)=',high[2:5],'line2p-1s=',high[5],'2p-2s=',high[7])
    print('last two grids line difference 1s-2p=',abs(arr[-2,5]-arr[-1,5]))
    print('continuity residual=',residual,'Gauss residual=',abs((1.2*np.dot(k,k)+.16)*phi-rho))
    (output_dir/'README.md').write_text('''# A-05j bounded source/atom reproducibility record\n\nInputs: dimensionless preferred-frame matched massive vector; fixed homogeneous electrostatic coefficients; Gaussian mode smoothing and Coulombic one-electron central potential.\n\nFiles: `atomic_grid_convergence.csv`, `yukawa_atomic_line_benchmark.csv`, `mode_charge_continuity.csv`. These are *not* a dynamic 3D charged-field simulation, observed spectra or a validated photon-mass measurement. The finite-grid convergence shown concerns only the **static radial eigenvalue** subproblem, not the Chapter 30K receiver response.\n\nRun: `python tools/massive_charge_atom_v1.py`, then `python -m unittest discover -s tests -q`.\n''')

if __name__=='__main__':
    pa=argparse.ArgumentParser();pa.add_argument('--output-dir',default='docs/long-term-memory/research/massive-charge-atom');args=pa.parse_args();run(args.output_dir)
