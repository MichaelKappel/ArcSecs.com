#!/usr/bin/env python3
"""ArcSecs 30O -- 3D longitudinal+transverse massive-vector response.

A transparent *driven, linear, fixed-coefficient* Fourier-box reference, not a
self-consistent moving-atom quantum theory or an autonomous simulation.
Normalized units; periodic L^3 box; Gaussian charge clouds with fixed widths.

For two oppositely charged clouds whose separation d(t) is small, the source is
rho_k = -i k.p exp(-sigma_s^2 k^2/2), J_k = -i z p exp(-sigma_s^2 k^2/2).
Their continuity equation is exact at linear order. The FULL nonlinear pair
also satisfies continuity exactly with the expressions in pair_fourier().

With epsilon>0, b=epsilon*c^2, eta=epsilon*gap^2,
zeta=epsilon*gap^2/c^2 the matched Stueckelberg linear theory has
D=c^2 k^2+gap^2-z^2, A=J/(epsilon*D),
phi=-i c^2 (k.p) G/(epsilon D),
E=(z^2 p-c^2 k (k.p))G/(epsilon D).
Here z=omega+i*gamma defines an analytic retarded frequency-window response;
gamma is a chosen window, NOT an energy-conserving damping model.
"""
from __future__ import annotations
from dataclasses import dataclass, replace
from pathlib import Path
import argparse, csv, json
import numpy as np

@dataclass(frozen=True)
class Params:
    N: int = 10                 # cubic integer shell -N..N on each axis
    length: float = 24.0        # periodic box width
    sigma_source: float = 1.5   # fixed physical Gaussian charge cloud width
    sigma_receiver: float = 1.3
    speed: float = 1.0
    epsilon: float = 1.0
    gap: float = 0.30           # positive Stueckelberg mass frequency
    gamma: float = 0.12        # spectral observation-window broadening
    separation: tuple[float,float,float] = (4.5,0.7,0.4)
    emitter_axis: tuple[float,float,float] = (0.0,1.0,0.0)
    receiver_axis: tuple[float,float,float] = (0.0,1.0,0.0)


def lattice(p:Params):
    a=np.arange(-p.N,p.N+1,dtype=float)*2*np.pi/p.length
    k=np.stack(np.meshgrid(a,a,a,indexing='ij'),axis=-1).reshape(-1,3)
    return k,np.einsum('ij,ij->i',k,k)


def fields_at_modes(p:Params,omega:float):
    """Source at origin. Return Fourier rho,J,A,phi,E, and k lattice."""
    k,k2=lattice(p)
    z=complex(omega,p.gamma)
    pol=np.asarray(p.emitter_axis,dtype=float)
    pol=pol/np.linalg.norm(pol)
    kp=k@pol
    G=np.exp(-.5*p.sigma_source**2*k2)
    D=p.speed**2*k2+p.gap**2-z*z
    rho=-1j*kp*G
    J=(-1j*z*G)[:,None]*pol
    A=J/(p.epsilon*D[:,None])
    phi=-1j*p.speed**2*kp*G/(p.epsilon*D)
    E=((z*z*pol[None,:]-p.speed**2*k*kp[:,None])*G[:,None])/(p.epsilon*D[:,None])
    return k,k2,z,rho,J,A,phi,E


def constraints(p:Params,omega:float):
    k,k2,z,rho,J,A,phi,E=fields_at_modes(p,omega)
    e=p.epsilon;c2=p.speed**2;eta=e*p.gap**2;zeta=e*p.gap**2/c2;b=e*c2
    cont=-1j*z*rho +1j*np.einsum('ij,ij->i',k,J)
    gauss=1j*e*np.einsum('ij,ij->i',k,E)+zeta*phi-rho
    # Full vector Ampere equation including k-longitudinal and nonzero mass
    ka=np.einsum('ij,ij->i',k,A)
    lhs=(-e*z*z+eta+b*k2)[:,None]*A-b*k*ka[:,None]+e*z*k*phi[:,None]
    ampere=lhs-J
    # Far more informative than a relative residual near a zero source term.
    scale=max(1.0,float(np.max(np.abs(J))),float(np.max(np.abs(rho))))
    return {'max_continuity_abs':float(np.max(np.abs(cont))),
            'max_gauss_abs':float(np.max(np.abs(gauss))),
            'max_ampere_abs':float(np.max(np.abs(ampere))),
            'max_scaled_equation_residual':float(max(np.max(np.abs(cont)),np.max(np.abs(gauss)),np.max(np.abs(ampere)))/scale)}


def response(p:Params,omega:float):
    k,k2,z,rho,J,A,phi,E=fields_at_modes(p,omega)
    r=np.asarray(p.separation)
    axis=np.asarray(p.receiver_axis,dtype=float)
    axis=axis/np.linalg.norm(axis)
    # Source G already in E; receiver sampling is a SECOND Gaussian convolution.
    receiver_G=np.exp(-.5*p.sigma_receiver**2*k2)
    phase=np.exp(1j*(k@r))
    pref=phase*receiver_G/p.length**3
    transfer=np.sum(pref*(E@axis))
    # Longitudinal / transverse components of the already calculated E.
    proj=np.zeros_like(E)
    m=k2>0
    proj[m]=k[m]*(np.einsum('ij,ij->i',k[m],E[m])/k2[m])[:,None]
    e_long=np.sum(pref*(proj@axis))
    e_trans=np.sum(pref*((E-proj)@axis))
    return {'frequency':float(omega),
            'total_re':float(transfer.real),'total_im':float(transfer.imag),
            'total_abs':float(abs(transfer)),
            'transverse_abs':float(abs(e_trans)),
            'longitudinal_abs':float(abs(e_long)),
            'transverse_re':float(e_trans.real),'transverse_im':float(e_trans.imag),
            'longitudinal_re':float(e_long.real),'longitudinal_im':float(e_long.imag),
            'N':p.N,'mode_count':(2*p.N+1)**3,
            'sigma_source':p.sigma_source,'sigma_receiver':p.sigma_receiver,
            'gap':p.gap,'gamma':p.gamma,'length':p.length}


def pair_fourier(k:np.ndarray,q:float,d:np.ndarray,ddot:np.ndarray,
                 center:np.ndarray,sigma:float):
    """Exact Fourier signed Gaussian charge pair and its current.

    The +/- charges lie at X +/- d/2 and move at +/-dotd/2. This holds for
    arbitrary time dependence and finite d; net charge is zero.
    """
    k2=np.einsum('ij,ij->i',k,k)
    base=np.exp(-.5*sigma**2*k2-1j*(k@center))
    kd=k@d
    rho=-2j*q*base*np.sin(.5*kd)
    J=(q*base*np.cos(.5*kd))[:,None]*ddot[None,:]
    drho=-1j*q*base*np.cos(.5*kd)*(k@ddot)
    return rho,J,drho


def run(out_dir,quick=False):
    out=Path(out_dir);out.mkdir(parents=True,exist_ok=True)
    cutoffs=[4,6,8,10,12] if not quick else [4,8,12]
    freqs=np.linspace(.45,1.65,9) if not quick else [0.65,1.,1.35]
    rows=[]
    for N in cutoffs:
        for f in freqs:
            rows.append(response(Params(N=N),float(f)))
    def write(name,data):
        with (out/name).open('w',newline='') as fp:
            w=csv.DictWriter(fp,fieldnames=list(data[0]));w.writeheader();w.writerows(data)
    write('spectral_cutoff_scan.csv',rows)
    controls=[]
    for label,p in [
        ('baseline',Params(N=12)),
        ('mass_gap_zero',Params(N=12,gap=0.)),
        ('clouds_narrower',Params(N=12,sigma_source=.65,sigma_receiver=.65)),
        ('larger_box',Params(N=12,length=30.)),
        ('perpendicular_receiver',Params(N=12,receiver_axis=(0.,0.,1.))),
    ]:
        r=response(p,1.05);r['label']=label;controls.append(r)
    write('model_controls.csv',controls)
    residuals=[]
    for N in cutoffs:
        r=constraints(Params(N=N),1.05);r['N']=N;residuals.append(r)
    write('constraint_residuals.csv',residuals)
    # Complex response convergence is the real acceptance criterion; NOT just
    # |response|, which can hide phase errors.
    dct={(r['N'],r['frequency']):complex(r['total_re'],r['total_im']) for r in rows}
    top=cutoffs[-1]; prev=cutoffs[-2]
    err=np.asarray([abs(dct[(prev,f)]-dct[(top,f)]) for f in freqs])
    relative=np.asarray([a/max(abs(dct[(top,f)]),1e-14) for a,f in zip(err,freqs)])
    summary={'reference_cutoff':top,'comparison_cutoff':prev,'n_frequencies':len(freqs),
        'max_complex_absolute_difference':float(err.max()),
        'max_relative_complex_difference':float(relative.max()),
        'max_constraint_residual':float(max(x['max_scaled_equation_residual'] for x in residuals)),
        'physical_source_width_held_fixed':Params().sigma_source,
        'physical_receiver_width_held_fixed':Params().sigma_receiver,
        'no_gravity_or_3d_quantum_atom':True,
        'no_autonomous_energy_momentum_claim':True}
    (out/'summary.json').write_text(json.dumps(summary,indent=2)+'\n')
    print(json.dumps(summary,indent=2))
    return summary

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--out-dir',required=True);parser.add_argument('--quick',action='store_true')
    a=parser.parse_args();run(a.out_dir,a.quick)


def independent_mode_solve(p:Params,omega:float,k:np.ndarray):
    """Independent 4x4 Fourier constraint solve for one sourced wave mode."""
    k=np.asarray(k,dtype=float)
    z=complex(omega,p.gamma);e=p.epsilon;c2=p.speed**2
    eta=e*p.gap**2;b=e*c2;zeta=e*p.gap**2/c2
    pol=np.asarray(p.emitter_axis,dtype=float)
    pol/=np.linalg.norm(pol)
    G=np.exp(-.5*p.sigma_source**2*(k@k))
    rho=-1j*(k@pol)*G
    J=-1j*z*pol*G
    M=np.zeros((4,4),dtype=complex)
    M[:3,:3]=(-e*z*z+eta+b*(k@k))*np.eye(3)-b*np.outer(k,k)
    M[:3,3]=e*z*k
    M[3,:3]=-e*z*k
    M[3,3]=e*(k@k)+zeta
    sol=np.linalg.solve(M,np.r_[J,rho])
    AA,phi=sol[:3],sol[3]
    return 1j*z*AA-1j*k*phi,AA,phi
