"""ArcSecs Chapter 30G: transparent 1D static screened-scalar boundary solver.

All quantities are arbitrary dimensionless trial units.  This is a mathematical
boundary model, not a measured cosmological field, dynamical photon/matter theory,
or an observational fit.  Matter density is prescribed and held static.

Stationary functional at fixed charge/displacement D:
    F[psi] = integral [kappa/2 (psi_x)^2 + (m2 + g*rho)psi^2/2
                        - f*psi + D^2/(2*eps0*exp(a*psi))] dx
subject to psi(-L)=psi(L)=psi_out(D), fixed density slab |x|<=R.

Interior ODE: -kappa psi_xx + (m2+g*rho)psi - f
                    - a D^2/(2 eps0 exp(a psi)) = 0.
For D=0, analytic infinite-exterior matched solution is available.
"""
from __future__ import annotations
from dataclasses import dataclass, replace
from pathlib import Path
from math import sqrt, cosh, sinh, tanh, exp, isfinite
from typing import Sequence
import csv, argparse, json

@dataclass(frozen=True)
class Slab:
    L: float = 8.0
    R: float = 1.0
    N: int = 801       # should be odd, interface R included on grid for defaults
    kappa: float = 1.0
    m2: float = 1.0
    g: float = 2.0
    rho_in: float = 20.0
    rho_out: float = 0.0
    f: float = 1.0
    a: float = 0.35
    b: float = 1.65
    eps0: float = 1.0
    mu0: float = 1.0
    D: float = 0.0


def check(p: Slab):
    if not (p.L > p.R > 0 and p.N >= 9 and p.N%2 == 1 and
            p.kappa > 0 and p.m2 > 0 and p.g >= 0 and p.rho_in >=p.rho_out>=0 and
            p.f > 0 and p.eps0 > 0 and p.mu0 > 0 and isfinite(p.D)):
        raise ValueError('Positive bounded toy coefficients, odd N and L>R required')


def exterior_root(p: Slab) -> float:
    """Unique positive root of Kout*psi-f-a*D^2/(2eps0)*e^(-a*psi)."""
    k=p.m2+p.g*p.rho_out
    psi=p.f/k
    for _ in range(100):
        factor=p.D*p.D/(2*p.eps0)*exp(-p.a*psi)
        err=k*psi-p.f-p.a*factor
        deriv=k+p.a*p.a*factor
        dx=err/deriv
        psi-=dx
        if abs(dx)<1e-14: return psi
    raise RuntimeError('Exterior equilibrium did not converge')


def analytic_zero_D(x:float,p:Slab)->float:
    """Analytic even slab on an infinite exterior, D=0, constant kappa."""
    if abs(p.D)>1e-15: raise ValueError('Exact benchmark only for D=0')
    ki=p.m2+p.g*p.rho_in; ko=p.m2+p.g*p.rho_out
    pin=p.f/ki; pout=p.f/ko
    qi=sqrt(ki/p.kappa); qo=sqrt(ko/p.kappa)
    den=cosh(qi*p.R)+(qi/qo)*sinh(qi*p.R)
    A=(pout-pin)/den
    if abs(x)<=p.R:
        return pin+A*cosh(qi*x)
    B=-A*(qi/qo)*sinh(qi*p.R)
    return pout+B*exp(-qo*(abs(x)-p.R))


def analytic_finite_D0(x:float,p:Slab)->float:
    """Exact piecewise static slab with Dirichlet psi(+/-L)=psi_out, D=0."""
    if abs(p.D)>1e-15: raise ValueError('Exact benchmark only for D=0')
    ki=p.m2+p.g*p.rho_in; ko=p.m2+p.g*p.rho_out
    pin=p.f/ki; pout=p.f/ko
    qi=sqrt(ki/p.kappa); qo=sqrt(ko/p.kappa)
    ratio=(qi/qo)*tanh(qo*(p.L-p.R))
    A=(pout-pin)/(cosh(qi*p.R)+ratio*sinh(qi*p.R))
    if abs(x)<=p.R:
        return pin+A*cosh(qi*x)
    B=-A*ratio*sinh(qi*p.R)
    return pout+B*sinh(qo*(p.L-abs(x)))/sinh(qo*(p.L-p.R))


def density(x:float,p:Slab) -> float:
    # Finite-volume half-cell at a density jump: avoid assigning an entire
    # cell to either side when its center lands precisely on the interface.
    if abs(abs(x)-p.R)<1e-12:
        return (p.rho_in+p.rho_out)/2
    return p.rho_in if abs(x)<p.R else p.rho_out


def tridiagonal(lower:Sequence[float], diag:Sequence[float], upper:Sequence[float], rhs:Sequence[float])->list[float]:
    n=len(diag)
    c=list(upper); d=list(rhs); b=list(diag)
    for j in range(1,n):
        mul=lower[j-1]/b[j-1]
        b[j]-=mul*c[j-1]
        d[j]-=mul*d[j-1]
    x=[0.]*n
    x[-1]=d[-1]/b[-1]
    for j in range(n-2,-1,-1): x[j]=(d[j]-c[j]*x[j+1])/b[j]
    return x


def residual_and_jacobian(vals:Sequence[float], p:Slab, boundary:float):
    h=2*p.L/(p.N-1)
    q=p.kappa/(h*h)
    n=p.N-2
    rs=[]; diag=[]
    for i in range(n):
        idx=i+1; x=-p.L+h*idx
        k=p.m2+p.g*density(x,p)
        left=boundary if i==0 else vals[i-1]
        right=boundary if i==n-1 else vals[i+1]
        val=vals[i]
        fixedE=p.D*p.D/(2*p.eps0)*exp(-p.a*val)
        rs.append(-q*(left-2*val+right)+k*val-p.f-p.a*fixedE)
        diag.append(2*q+k+p.a*p.a*fixedE)
    return rs,diag,[-q]*(n-1),[-q]*(n-1)


def solve(p:Slab=Slab())->tuple[list[float],list[float],dict]:
    check(p)
    h=2*p.L/(p.N-1)
    xs=[-p.L+i*h for i in range(p.N)]
    boundary=exterior_root(p)
    # Jacobian is strictly diagonally dominant for positive k and D^2.
    vals=[boundary]*(p.N-2)
    for iteration in range(35):
        res,diag,lo,hi=residual_and_jacobian(vals,p,boundary)
        magnitude=max(abs(v) for v in res)
        if magnitude<2e-9:break
        step=tridiagonal(lo,diag,hi,[-r for r in res])
        t=1.
        for _ in range(20):
            candidate=[v+t*dv for v,dv in zip(vals,step)]
            rr,*_=residual_and_jacobian(candidate,p,boundary)
            if max(abs(r) for r in rr)<magnitude:
                vals=candidate;break
            t*=0.5
        else: raise RuntimeError('Newton line search failed')
    else: raise RuntimeError('Newton solver did not converge')
    ys=[boundary,*vals,boundary]
    res,*_=residual_and_jacobian(vals,p,boundary)
    # The discretized variational energy uses segment gradient terms and node potential.
    E=energy(xs,ys,p)
    return xs,ys,dict(max_residual=max(abs(v) for v in res),
                       iterations=iteration,
                       psi_center=ys[p.N//2],psi_edge=ys[round((p.L+p.R)/h)],
                       psi_exterior=boundary,energy=E,dx=h)


def energy(xs:Sequence[float],ys:Sequence[float],p:Slab)->float:
    h=xs[1]-xs[0]
    grad=sum((ys[i+1]-ys[i])**2 for i in range(len(ys)-1))*p.kappa/(2*h)
    pot=0.
    for i in range(1,len(ys)-1):
        k=p.m2+p.g*density(xs[i],p); v=ys[i]
        pot+=h*(k*v*v/2-p.f*v+p.D*p.D/(2*p.eps0)*exp(-p.a*v))
    return grad+pot


def optics(psi:float,p:Slab)->dict[str,float]:
    eps=p.eps0*exp(p.a*psi)
    mu=p.mu0*exp(p.b*psi)
    return dict(epsilon=eps,mu=mu,v=1/sqrt(eps*mu),
                alpha_eff=1/(eps*(1/sqrt(eps*mu))))


def spectroscopy_ledger(integrated_partial_time_psi:float, delta_psi_atoms:float,
                        a:float,b:float)->dict[str,float]:
    """Adiabatic WKB identity with spatially variable scalar, no Doppler/gravity.

    I = integral_along_ray partial_T psi dT; endpoint psi difference need not
    equal I if psi is spatially nonuniform.  This is a conditional toy relation.
    """
    g=(a+b)/2
    S=exp(g*integrated_partial_time_psi)
    one_plus_z=S*exp(-2*a*delta_psi_atoms)
    alpha_ratio=exp((b-a)*delta_psi_atoms/2)
    residual=(one_plus_z*S)/(alpha_ratio**2)
    return dict(S_transport=S,z_spec=one_plus_z-1,alpha_ratio=alpha_ratio,
                screening_residual=residual)


def output(out:Path,p:Slab=Slab()) ->dict:
    xs,ys,info=solve(p)
    out.mkdir(parents=True,exist_ok=True)
    rows=[]
    for x,y in zip(xs,ys):
        op=optics(y,p)
        rows.append(dict(x=x,psi=y,rho=density(x,p),**op))
    with (out/'screened_slab_profile.csv').open('w',newline='') as f:
        writer=csv.DictWriter(f,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
    outer=optics(info['psi_exterior'],p)
    center=optics(info['psi_center'],p)
    info.update(static_cross_boundary_ledger=spectroscopy_ledger(0.0, info['psi_exterior']-info['psi_center'],p.a,p.b),
                fraction_center_to_exterior=info['psi_center']/info['psi_exterior'],
                speed_center_to_outer=center['v']/outer['v'],
                alpha_center_to_outer=center['alpha_eff']/outer['alpha_eff'],
                max_analytic_error=(max(abs(y-analytic_finite_D0(x,p)) for x,y in zip(xs,ys)) if p.D==0 else None),
                assumption='static fixed matter density, 1D slab, dimensionless toy')
    (out/'screened_slab_checks.json').write_text(json.dumps({'parameters':p.__dict__,'result':info},indent=2)+'\n')
    return info

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--output-dir',type=Path,default=Path('out/screened_slab'))
    parser.add_argument('--D',type=float,default=0.0)
    args=parser.parse_args()
    print(json.dumps(output(args.output_dir,replace(Slab(),D=args.D)),indent=2))
