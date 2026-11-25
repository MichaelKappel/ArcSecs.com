"""ArcSecs 30Q: finite-width 1D longitudinal Stueckelberg propagation in a screened scalar profile.

Static externally supported scalar environment. Exact positive-energy, gauge-invariant
1D longitudinal reduction; NOT a dynamic atom/scalar backreaction model.
"""
from dataclasses import dataclass, replace
from pathlib import Path
import argparse, csv, json
import numpy as np
from scipy.linalg import solve_banded
from scipy.sparse import diags, eye, csr_matrix
from scipy.sparse.linalg import factorized

@dataclass(frozen=True)
class Params:
    L: float = 18.0
    half_width: float = 3.0
    rho_in: float = 12.0
    rho_out: float = 0.03
    S: float = 1.0
    m2: float = 1.0
    g: float = 1.8
    source: float = 1.0
    lam: float = 0.85
    omega_gap: float = 0.38


def equilibrium(rho,p):return p.source/(p.m2+p.g*rho)


def analytic_profile(x,p=Params()):
    """Exact even Dirichlet solution of -S psi'' +(m²+g rho)psi=source.
    Density is rho_in inside abs(x)<half_width, rho_out outside.
    psi(+-L)=psi_out, psi and S psi' continuous at interfaces.
    """
    x=np.asarray(x,dtype=float)
    ki=np.sqrt((p.m2+p.g*p.rho_in)/p.S)
    ko=np.sqrt((p.m2+p.g*p.rho_out)/p.S)
    yi=equilibrium(p.rho_in,p);yo=equilibrium(p.rho_out,p)
    d=p.L-p.half_width
    denom=np.cosh(ki*p.half_width)+(ki/ko)*np.sinh(ki*p.half_width)*np.tanh(ko*d)
    A=(yo-yi)/denom
    # stable, use cosh(ko*d) <= comfortable for selected reference params
    B=-A*ki*np.sinh(ki*p.half_width)/(ko*np.cosh(ko*d))
    a=np.abs(x)
    return np.where(a<=p.half_width,yi+A*np.cosh(ki*a),yo+B*np.sinh(ko*(p.L-a)))


def numerical_profile(n,p=Params()):
    """FD Dirichlet solve on grid, with density assigned by cell center."""
    x=np.linspace(-p.L,p.L,n)
    dx=x[1]-x[0]
    cells=x[1:-1]
    fraction=np.clip((np.minimum(cells+dx/2,p.half_width)-np.maximum(cells-dx/2,-p.half_width))/dx,0,1)
    rho=p.rho_out+(p.rho_in-p.rho_out)*fraction
    h=p.S/dx**2
    a=np.zeros((3,n-2));a[0,1:]=-h;a[1,:]=2*h+p.m2+p.g*rho;a[2,:-1]=-h
    y=np.full(n-2,p.source)
    y[0]+=h*equilibrium(p.rho_out,p);y[-1]+=h*equilibrium(p.rho_out,p)
    psi=solve_banded((1,1),a,y)
    return x,np.r_[equilibrium(p.rho_out,p),psi,equilibrium(p.rho_out,p)]


def coeffs(psi,p=Params()):
    theta=p.lam*np.asarray(psi)
    eps=np.exp(theta);b=np.exp(-theta);eta=(p.omega_gap**2)*eps;zeta=(p.omega_gap**2)*np.exp(3*theta)
    return eps,b,eta,zeta


def transfer(frequency,pol='L',n=401,p=Params()):
    """Exact transfer per spatial cell in variable-coefficient Sturm-Liouville equation.
    Physical Fourier frequency omega>positive mass gap. State is [u,p(x)u']. 
    """
    if frequency<=p.omega_gap:raise ValueError('Above-gap propagating modes only')
    if pol not in ('T','L'):raise ValueError(pol)
    x=np.linspace(-p.L,p.L,n);xm=(x[1:]+x[:-1])/2;dx=x[1]-x[0]
    eps,b,eta,zeta=coeffs(analytic_profile(xm,p),p)
    k0=np.sqrt(frequency**2-p.omega_gap**2)
    k=k0*np.sqrt(eps/b) # local k=k0*exp(theta)
    weight=b if pol=='T' else 1/zeta
    kk=weight*k
    c=np.cos(k*dx);s=np.sin(k*dx)
    M=np.eye(2)
    for c1,s1,k1 in zip(c,s,kk):
        cell=np.array([[c1,s1/k1],[-k1*s1,c1]])
        M=cell@M
    psi_l=analytic_profile([-p.L],p)[0];psi_r=analytic_profile([p.L],p)[0]
    eL,bL,etL,zL=coeffs(psi_l,p); eR,bR,etR,zR=coeffs(psi_r,p)
    kcL=k0*np.sqrt(eL/bL)*(bL if pol=='T' else 1/zL)
    kcR=k0*np.sqrt(eR/bR)*(bR if pol=='T' else 1/zR)
    inc=np.array([1.,1j*kcL]);ref=np.array([1.,-1j*kcL]);out=np.array([1.,1j*kcR])
    r,t=np.linalg.solve(np.column_stack((M@ref,-out)),-M@inc)
    flux_ratio=float(kcR/kcL)
    return {'omega':float(frequency),'pol':pol,'n':n,'r':complex(r),'t':complex(t),
            'R':float(abs(r)**2),'transmitted':float(flux_ratio*abs(t)**2),
            'flux_error':float(abs(abs(r)**2+flux_ratio*abs(t)**2-1.)),
            'phase_t':float(np.angle(t)), 'L':p.L,'gap':p.omega_gap}


def sharp_interface_reflection(psi_left,psi_right,frequency,pol,p=Params()):
    """Analytic interface field-amplitude r when u and p(x)u' are continuous."""
    k0=np.sqrt(frequency**2-p.omega_gap**2)
    e1,b1,eta1,z1=coeffs(psi_left,p);e2,b2,eta2,z2=coeffs(psi_right,p)
    v1=k0*np.sqrt(e1/b1)*(b1 if pol=='T' else 1/z1)
    v2=k0*np.sqrt(e2/b2)*(b2 if pol=='T' else 1/z2)
    return float((v1-v2)/(v1+v2))


def field_operator(x,p,pol):
    """Sparse symmetric positive stiffness C and diagonal positive inverse inertia B.
    Dirichlet field boundary: q(x=+-L)=0. Scalar remains held fixed.
    """
    h=x[1]-x[0];psi=analytic_profile(x,p);eps,b,eta,zeta=coeffs(psi,p)
    faces=analytic_profile((x[:-1]+x[1:])/2,p)
    ef,bf,etaf,zf=coeffs(faces,p)
    F=bf if pol=='T' else 1/zf
    diag=(F[:-1]+F[1:])/h**2
    f=eta[1:-1] if pol=='T' else 1/eps[1:-1]
    C=diags([-F[1:-1]/h**2,diag+f,-F[1:-1]/h**2],[-1,0,1],shape=(len(diag),len(diag)),format='csc')
    B=1/eps[1:-1] if pol=='T' else eta[1:-1]
    return C,B


def evolve(pol='L',n=321,steps=240,dt=0.02,p=Params()):
    """Implicit midpoint evolves fixed scalar vector fields, preserving quadratic energy.
    Returns energy drift, control and field amplitude over a finite observation.
    """
    x=np.linspace(-p.L,p.L,n)
    C,B=field_operator(x,p,pol);m=len(B);c=x[1:-1]
    h=x[1]-x[0]
    # Localization to left exterior, real initial wave; no injected sources after initial state.
    q0=np.exp(-.5*((c+10)/1.8)**2)*np.cos(1.7*c)*.02
    if pol=='T':p0=np.zeros(m)
    else:p0=np.zeros(m)
    q=q0.copy();mom=p0.copy()
    J=(eye(m,format='csc')+(dt**2/4)*diags(B)@C).tocsc()
    solve=factorized(J)
    def energy(qq,pp):return float(.5*h*(np.dot(pp*B,pp)+np.dot(qq,C@qq)))
    initial=energy(q,mom);maxdev=0.;times=[];values=[]
    for j in range(steps):
        qnew=solve(q+dt*B*mom - (dt**2/4)*B*(C@q))
        pnew=mom-(dt/2)*(C@(q+qnew))
        q,mom=qnew,pnew
        E=energy(q,mom);maxdev=max(maxdev,abs(E/initial-1))
        if j%max(1,steps//12)==0:times.append((j+1)*dt);values.append(E)
    return {'pol':pol,'n':n,'steps':steps,'dt':dt,'E0':initial,'energy_rel_drift':float(maxdev),
            'q_rms_end':float(np.sqrt(np.mean(q*q))),'time_points':times,'energies':values}


def run_suite(folder,p=Params()):
    dest=Path(folder);dest.mkdir(exist_ok=True,parents=True)
    Ns=[101,201,401,801,1601];omega=1.1
    pts=[]
    for n in Ns:
        x,num=numerical_profile(n,p);reference=analytic_profile(x,p)
        pts.append({'n':n,'dx':x[1]-x[0],'sup_error':np.max(np.abs(num-reference)),
                    'center_numeric':num[n//2],'center_exact':reference[n//2]})
    with (dest/'screening_convergence.csv').open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(pts[0]));w.writeheader();w.writerows(pts)
    spectrum=[]
    for w in np.linspace(.6,2.8,12):
        for pol in ('T','L'):
            v=transfer(w,pol,1001,p)
            spectrum.append({k:v[k] for k in ('omega','pol','R','transmitted','flux_error','phase_t')})
    with (dest/'mode_spectrum.csv').open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(spectrum[0]));w.writeheader();w.writerows(spectrum)
    sc=[]
    for n in Ns:
        for pol in ('T','L'):
            a=transfer(omega,pol,n,p)
            sc.append({'n':n,'pol':pol,'R':a['R'],'flux_error':a['flux_error'], 't_phase':a['phase_t']})
    with (dest/'scattering_convergence.csv').open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(sc[0]));w.writeheader();w.writerows(sc)
    time_controls=[evolve(pol='L',p=p),evolve(pol='T',p=p),evolve(pol='L',p=replace(p,lam=0.))]
    summary={'model':'static scalar sourced by fixed external matter, positive Stueckelberg quadratic mode scattering',
             'params':p.__dict__,'screening_center':float(analytic_profile([0.],p)[0]),
             'screening_exterior':float(analytic_profile([p.L],p)[0]),
             'scalar_convergence':pts,'scattering_at_1p1':sc,
             'largest_mode_flux_residual':max(x['flux_error'] for x in spectrum),
             'max_transverse_R':max(x['R'] for x in spectrum if x['pol']=='T'),
             'longitudinal_R_at_1p1':transfer(1.1,'L',1601,p)['R'],
             'time_domain_controls':time_controls,
             'limits':['one-dimensional stratified exterior','scalar background static and externally supported',
                       'no moving charges, quantum atom, backreacting scalar, or cosmological light slowing']}
    (dest/'summary.json').write_text(json.dumps(summary,indent=2))
    x=np.linspace(-p.L,p.L,1001);eps,b,eta,zeta=coeffs(analytic_profile(x,p),p)
    with (dest/'scalar_profile.csv').open('w',newline='') as f:
        w=csv.writer(f);w.writerow(['x','density','psi','epsilon','b','eta','zeta'])
        w.writerows(zip(x,np.where(np.abs(x)<p.half_width,p.rho_in,p.rho_out),analytic_profile(x,p),eps,b,eta,zeta))
    return summary

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--output-dir',default='docs/long-term-memory/research/stueckelberg-screened-interface')
    a=parser.parse_args();s=run_suite(a.output_dir)
    print(json.dumps({k:v for k,v in s.items() if k in ('screening_center','screening_exterior','longitudinal_R_at_1p1','max_transverse_R','largest_mode_flux_residual')},indent=2))
