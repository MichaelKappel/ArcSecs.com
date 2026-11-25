"""ArcSecs Chapter 30L: finite-mode Stueckelberg/scalar audit (synthetic).

Equations track the 2026-11-23 Part XIX uploaded study. Normalized units.
Does NOT simulate charged 3D sources or an astronomical photon-mass detection.
"""
from __future__ import annotations
import argparse
import csv
from pathlib import Path
import numpy as np
from scipy.integrate import solve_ivp

LAMBDA=.5
K=1.
KMODE=3.
OMEGA0=.4

def coefficients(psi, k=KMODE, lam=LAMBDA, omega0=OMEGA0):
    theta=lam*psi
    eps=np.exp(theta)
    b=np.exp(-theta)
    eta=omega0**2 * np.exp(theta)
    zeta=omega0**2 * np.exp(3*theta)
    kl=eps*zeta/(eps*k*k+zeta)
    ct=b*k*k+eta
    # Log-derivatives with respect to psi
    denom=eps*k*k+zeta
    klprime=kl*(4*lam-(lam*eps*k*k+3*lam*zeta)/denom)
    return eps,b,eta,zeta,kl,ct,klprime

def frequencies(psi,k=KMODE):
    eps,b,eta,zeta,kl,ct,klprime=coefficients(psi,k)
    return np.sqrt(ct/eps),np.sqrt(eta/kl)

def hamiltonian(y):
    psi, ppsi, at, pt, al, pl=y
    eps,b,eta,zeta,kl,ct,klprime=coefficients(psi)
    V=.0225*(psi-1)**2
    return np.array([ppsi*ppsi/(2*K)+V,pt*pt/(2*eps)+ct*at*at/2, pl*pl/(2*kl)+eta*al*al/2])

def rhs(t,y):
    psi,ppsi,at,pt,al,pl=y
    eps,b,eta,zeta,kl,ct,klprime=coefficients(psi)
    epsprime=LAMBDA*eps
    ctprime=-LAMBDA*b*KMODE**2+LAMBDA*eta
    etaprime=LAMBDA*eta
    # canonical H = p^2/2 K + V + pT^2/2eps + CT AT^2/2 + pL^2/2 KL + eta AL^2/2
    gradHpsi=.045*(psi-1) - epsprime*pt**2/(2*eps**2) +ctprime*at**2/2-klprime*pl**2/(2*kl**2)+etaprime*al**2/2
    return np.array([ppsi/K,-gradHpsi,pt/eps,-ct*at,pl/kl,-eta*al])

def run(tf=8., points=401):
    y0=[0.,0.,.012,0.,.030,0.]
    sol=solve_ivp(rhs, (0,tf),y0,method='DOP853',rtol=2e-12,atol=2e-14,max_step=.03,dense_output=True)
    if not sol.success: raise RuntimeError(sol.message)
    t=np.linspace(0,tf,points)
    y=sol.sol(t).T
    energies=np.array([hamiltonian(v) for v in y])
    total=energies.sum(axis=1)
    speed=np.exp(-LAMBDA*y[:,0])
    drift=np.max(np.abs(total-total[0]))/total[0]
    return t,y,energies,total,speed,drift

def group_phase(psi,k):
    c=np.exp(-LAMBDA*psi)
    omega=np.sqrt(c*c*k*k+OMEGA0**2)
    return c*c*k/omega,omega/k

def yukawa_residual(n):
    """Grid truncation residual for sampled analytic Yukawa electrostatic solution."""
    r=np.linspace(.5,4.,n)
    ell=2.1
    phi=np.exp(-r/ell)/r
    h=r[1]-r[0]
    D2=(phi[2:]-2*phi[1:-1]+phi[:-2])/h**2
    D1=(phi[2:]-phi[:-2])/(2*h)
    resid=D2+2/r[1:-1]*D1-phi[1:-1]/ell**2
    return float(np.max(np.abs(resid)))

def main():
    pa=argparse.ArgumentParser();pa.add_argument('--output-dir',default='docs/long-term-memory/research/massive-photon-field');args=pa.parse_args()
    folder=Path(args.output_dir);folder.mkdir(parents=True,exist_ok=True)
    t,y,en,total,speed,drift=run()
    with (folder/'stueckelberg_scalar_trajectory.csv').open('w',newline='') as f:
        w=csv.writer(f);w.writerow(['T','psi','p_psi','A_T','p_T','A_L','p_L','E_scalar','E_transverse','E_longitudinal','E_total','c_characteristic']);
        for i in range(len(t)): w.writerow([t[i],*y[i],*en[i],total[i],speed[i]])
    with (folder/'stueckelberg_mode_dispersion.csv').open('w',newline='') as f:
        w=csv.writer(f);w.writerow(['psi','k','omega_T','omega_L','v_group','v_phase','c_characteristic']);
        for psi in [0.,.5,1.,1.5]:
            for k in [.2,.5,1.,3.,8.,30.]:
                oT,oL=frequencies(psi,k);vg,vp=group_phase(psi,k);w.writerow([psi,k,oT,oL,vg,vp,np.exp(-LAMBDA*psi)])
    with (folder/'stueckelberg_yukawa_convergence.csv').open('w',newline='') as f:
        w=csv.writer(f);w.writerow(['radial_nodes','max_grid_residual']);
        for n in [201,401,801,1601]:w.writerow([n,yukawa_residual(n)])
    summary=f'''# Independent ArcSecs Part XIX finite-mode audit\n\nSource: user-uploaded ArcSecs Part XIX (23 November 2026). A separate code implementation reproduces the published normalized initial-value problem.\n\n- Endpoint psi: {y[-1,0]:.8f}\n- Endpoint characteristic speed: {speed[-1]:.8f}\n- Initial total energy: {total[0]:.10f}\n- Final total energy: {total[-1]:.10f}\n- Maximum relative conservation drift: {drift:.4g}\n- Longitudinal/transverse frequencies: exactly matched by construction, not independent observations.\n- Finite massive dispersion gives v_g=c^2 k /sqrt(c^2 k^2+Omega^2), v_phase=omega/k; v_g*v_phase=c^2.\n- Spatially stationary screening changes local speed but conserves ray frequency across time-independent boundaries.\n\nLimits: classical homogeneous finite-mode system; no spin, electron/ion quantum transitions, full 3D scalar/charge continuum, or data fit.\n'''
    (folder/'README.md').write_text(summary)
    print(summary)
if __name__=='__main__':main()
