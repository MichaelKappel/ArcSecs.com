"""ArcSecs Chapter 30F: independent, pure-stdlib reproduction of a homogeneous toy.

This code tests the *specified hypothetical equations*, not a measured cosmic field.
Reference: ArcSecs Photon-Field Dynamics Technical Continuation (2026-11-23),
section 6 and eqs. 19--30.  All numerical inputs below are arbitrary dimensionless
trial parameters from that historical research paper.

Run: python tools/photon_field_closure_v1.py --output-dir out
"""
from __future__ import annotations
import argparse
import csv
from dataclasses import dataclass
from math import exp
from pathlib import Path

@dataclass(frozen=True)
class Parameters:
    chi: float = 1.0
    U0: float = 0.03
    lam: float = 1.0
    E_gamma0: float = 0.002
    g: float = 1.0
    psi0: float = -1.0
    psi_dot0: float = 0.4
    t0: float = -2.0
    dt: float = 0.0005
    steps: int = 4000


def radiation_energy(psi: float, p: Parameters) -> float:
    return p.E_gamma0 * exp(-p.g * (psi - p.psi0))


def energy(psi: float, dpsi: float, p: Parameters) -> float:
    return (0.5 * p.chi * dpsi*dpsi + p.U0*exp(-p.lam*psi)
            + radiation_energy(psi, p))


def derivative(state: tuple[float,float], p: Parameters) -> tuple[float,float]:
    psi, dpsi = state
    return dpsi, (p.lam*p.U0*exp(-p.lam*psi) + p.g*radiation_energy(psi,p))/p.chi


def rk4_step(state: tuple[float,float], h: float, p: Parameters) -> tuple[float,float]:
    k1 = derivative(state, p)
    s2 = tuple(state[j] + 0.5*h*k1[j] for j in (0,1))
    k2 = derivative(s2,p)
    s3 = tuple(state[j] + 0.5*h*k2[j] for j in (0,1))
    k3 = derivative(s3,p)
    s4 = tuple(state[j] + h*k3[j] for j in (0,1))
    k4 = derivative(s4,p)
    return tuple(state[j]+h*(k1[j]+2*k2[j]+2*k3[j]+k4[j])/6 for j in (0,1))


def integrate(p: Parameters = Parameters()) -> list[tuple[float,float,float]]:
    if not (p.chi>0 and p.dt>0 and p.steps>0 and p.U0>0 and p.E_gamma0>0):
        raise ValueError('Use positive toy coefficients and time step.')
    state = (p.psi0,p.psi_dot0)
    history=[]
    for i in range(p.steps+1):
        history.append((p.t0+i*p.dt,*state))
        if i<p.steps:
            state = rk4_step(state,p.dt,p)
    return history


def calc_branch(delta_psi: float, a: float, b: float) -> dict[str,float]:
    """Optical response and alpha closure for fixed e, m_e, hbar and Coulomb atom."""
    g=(a+b)/2
    propagation=exp(g*delta_psi)
    spectral=exp((g-2*a)*delta_psi)
    alpha_ratio=exp((b-a)*delta_psi/2)
    return dict(S_prop=propagation,z_prop=propagation-1,
                z_spec=spectral-1,alpha_ratio=alpha_ratio,
                closure_residual=spectral*propagation-alpha_ratio**2)


def results(p: Parameters = Parameters()) -> tuple[list[dict[str,float|str]], dict[str,float]]:
    h=integrate(p)
    psi_a=h[-1][1]
    E0=energy(h[0][1],h[0][2],p)
    drift=max(abs(energy(psi,dpsi,p)-E0)/abs(E0) for _,psi,dpsi in h)
    rows=[]
    for te in (-1.8,-1.5,-0.9):
        i=round((te-p.t0)/p.dt)
        actual_t,psi_e,_=h[i]
        if abs(actual_t-te)>1e-11:
            raise ValueError('Selected emission time is not on the integration grid')
        delta_psi=psi_a-psi_e
        # D / v_a = integral exp[g*(psi_a - psi(T))] dT, at fixed endpoint.
        integrand=[exp(p.g*(psi_a-rec[1])) for rec in h[i:]]
        distance=p.dt*(0.5*integrand[0]+sum(integrand[1:-1])+0.5*integrand[-1])
        for branch,a,b in [('M',0.,2*p.g),('I',p.g,p.g)]:
            calc=calc_branch(delta_psi,a,b)
            rows.append(dict(branch=branch,t_emission=te,
                             distance_over_v_a=distance,delta_psi=delta_psi,**calc))
    return rows, {'psi_arrival':psi_a,'max_relative_energy_drift':drift,'steps':float(p.steps)}


def write_output(out: Path, p: Parameters = Parameters()) -> None:
    out.mkdir(parents=True,exist_ok=True)
    rows,summary=results(p)
    with (out/'photon_field_closure_predictions.csv').open('w', newline='') as f:
        writer=csv.DictWriter(f,fieldnames=list(rows[0]))
        writer.writeheader();writer.writerows(rows)
    with (out/'photon_field_closure_checks.txt').open('w') as f:
        f.write('HYPOTHETICAL HOMOGENEOUS TOY MODEL — NOT OBSERVED DATA\n')
        f.write('Independent pure-Python RK4 solution of the source continuation ODE.\n')
        for k,v in summary.items(): f.write(f'{k}: {v:.16g}\n')
        f.write('Source approximation: fixed electron mass, e, hbar; leading Coulomb spectrum.\n')
        f.write('Identity: (1+z_spec)*S_prop=(alpha_a/alpha_e)^2.\n')
    print(summary)
    for row in rows:
        print(row['branch'],row['t_emission'],
              'D',f"{row['distance_over_v_a']:.4f}",
              'z_prop',f"{row['z_prop']:.4f}",
              'z_spec',f"{row['z_spec']:.4f}",
              'alpha_a/e',f"{row['alpha_ratio']:.4f}")


if __name__=='__main__':
    ap=argparse.ArgumentParser()
    ap.add_argument('--output-dir',type=Path,default=Path('out/photon_field_closure'))
    write_output(ap.parse_args().output_dir)
