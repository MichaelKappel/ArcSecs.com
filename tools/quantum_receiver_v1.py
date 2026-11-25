"""ArcSecs Chapter 30N — convergent periodic 1D semiclassical spectral receiver.

A controlled, autonomous Ehrenfest Hamiltonian: 1D *transverse* massive-vector
modes, mobile neutral atom centers, two normalized two-level quantum states, and
one homogeneous, dynamical physical scalar. It is NOT 3D Maxwell-Stueckelberg
with a propagating longitudinal polarization; no quantum spontaneous emission.
All quantities dimensionless. The screening-sensitive transition is a local
linear surrogate of the separately converged Chapter 30M radial reference.
"""
from __future__ import annotations
from dataclasses import dataclass, replace
from pathlib import Path
import csv
import numpy as np
from scipy.integrate import solve_ivp

D0 = 0.742152          # extrapolated Chapter 30M static radial reference, s0=0.05
S0 = 0.05


def perturbation_line_derivative(s):
    """d/ds of first-order Yukawa 1s->2p energy difference in local Rydbergs."""
    # D=.75 +2*(-.75-F2p + F1s)
    # derivative 2*(-dF2p/ds + dF1s/ds)
    return 2*((1+s)**-5-8*(2+s)**-3)

DS0=perturbation_line_derivative(S0)


def atom_gap_and_gradient(psi, lam=0.25, line_multiplier=1.):
    """Gap = local E_R exp(-2 theta) times linearized screened D(s).

    s=s0 exp(2 theta), theta=lam psi. Derivative includes BOTH Rydberg
    rescaling and screening; extrapolation outside 0.045<s<0.060 is invalid.
    """
    theta=lam*psi
    s=S0*np.exp(2*theta)
    D=D0+DS0*(s-S0)
    E=np.exp(-2*theta)*D*line_multiplier
    dE=lam*np.exp(-2*theta)*(2*s*DS0-2*D)*line_multiplier
    return E,dE,s


@dataclass(frozen=True)
class Params:
    N:int=64
    L:float=120.
    x_source:float=35.
    x_receiver:float=48.
    sigma:float=1.5
    g_source:float=0.045
    g_receiver:float=0.070
    detune:float=0.
    mass_center:float=250.
    lam:float=.25
    omega0:float=.18
    scalar_K:float=50.
    scalar_kappa:float=10.
    scalar_target:float=.04
    initial_psi:float=.04
    t_end:float=45.
    sample_count:int=451
    rtol:float=2e-9
    atol:float=2e-11
    max_step:float=.16


class ReceiverModel:
    def __init__(self, p=Params()):
        self.p=p
        self.k=np.arange(1,p.N+1,dtype=float)*2*np.pi/p.L
        # Physically fixed Gaussian current/dipole width across cutoff.
        self.weight=np.exp(-.5*(p.sigma*self.k)**2)*np.sqrt(2/p.L)
        self.n=14+4*p.N

    def initial(self):
        p=self.p; N=p.N
        # psi,p_psi; x_source,x_receiver,p_source,p_receiver;
        # 2 Bloch vectors (u,v,w), source coherent +x, receiver ground +z;
        # [a,b,pa,pb] real Fourier coefficients.
        y=np.zeros(self.n)
        y[0]=p.initial_psi
        y[2:4]=p.x_source,p.x_receiver
        y[6:9]=[1.,0.,0.]
        y[9:12]=[0.,0.,1.]
        return y

    def pieces(self, y):
        N=self.p.N
        psi,ps=y[:2]
        x=y[2:4]; momenta=y[4:6]; spins=y[6:12].reshape(2,3)
        a,b,pa,pb=[y[14+i*N:14+(i+1)*N] for i in range(4)]
        return psi,ps,x,momenta,spins,a,b,pa,pb

    def operators(self,y):
        p=self.p
        psi,ps,x,mom,spin,a,b,pa,pb=self.pieces(y)
        theta=p.lam*psi
        eps=np.exp(theta); bb=np.exp(-theta); eta=p.omega0**2*eps
        C=bb*self.k**2+eta
        Cp=p.lam*(-bb*self.k**2+eta)
        cos=np.cos(np.outer(x,self.k)); sin=np.sin(np.outer(x,self.k))
        A=(self.weight*(cos*a+sin*b)).sum(axis=1)
        Ax=(self.weight*self.k*(-sin*a+cos*b)).sum(axis=1)
        D,dD,s=atom_gap_and_gradient(psi,p.lam)
        gaps=np.array([D,D*(1+p.detune)])
        gapd=np.array([dD,dD*(1+p.detune)])
        g=np.array([p.g_source,p.g_receiver])
        return eps,C,Cp,cos,sin,A,Ax,gaps,gapd,g

    def rhs(self,t,y):
        p=self.p; N=p.N
        psi,ps,x,mom,s,a,b,pa,pb=self.pieces(y)
        eps,C,Cp,co,si,A,Ax,D,Dp,g=self.operators(y)
        u,v,w=s.T
        # Hamiltonian spin evolution for Hj = Delta_j*(1-sigma_z)/2 - g_j Aj sigma_x.
        ds=np.stack((D*v,-D*u+2*g*A*w,-2*g*A*v),axis=1)
        dps= -p.scalar_kappa*(psi-p.scalar_target)
        dps+= p.lam*np.sum(pa**2+pb**2)/(2*eps)
        dps-= .5*np.sum(Cp*(a*a+b*b))
        dps-= .5*np.dot(Dp,1-w)
        da=pa/eps; db=pb/eps
        src=g*u
        dpa=-C*a+self.weight*np.sum(src[:,None]*co,axis=0)
        dpb=-C*b+self.weight*np.sum(src[:,None]*si,axis=0)
        dx=mom/p.mass_center
        dmom=src*Ax
        out=np.zeros_like(y)
        out[:2]=ps/p.scalar_K,dps
        out[2:4]=dx;out[4:6]=dmom
        out[6:12]=ds.ravel()
        out[14:14+N]=da;out[14+N:14+2*N]=db
        out[14+2*N:14+3*N]=dpa;out[14+3*N:14+4*N]=dpb
        return out

    def invariants(self,y):
        p=self.p
        psi,ps,x,mom,s,a,b,pa,pb=self.pieces(y)
        eps,C,Cp,co,si,A,Ax,D,Dp,g=self.operators(y)
        E=ps*ps/(2*p.scalar_K)+p.scalar_kappa*(psi-p.scalar_target)**2/2
        E+=np.sum((pa*pa+pb*pb)/eps+C*(a*a+b*b))/2
        E+=np.sum(mom*mom)/(2*p.mass_center)
        E+=np.dot(D,(1-s[:,2]))/2 -np.dot(g*s[:,0],A)
        # Noether: field momentum = -sum k(pa*b-pb*a).
        P=np.sum(mom)-np.sum(self.k*(pa*b-pb*a))
        norms=np.linalg.norm(s,axis=1)
        return float(E),float(P),norms

    def integrate(self):
        t=np.linspace(0,self.p.t_end,self.p.sample_count)
        sol=solve_ivp(self.rhs,(0,self.p.t_end),self.initial(),method='DOP853',
                      t_eval=t,rtol=self.p.rtol,atol=self.p.atol,
                      max_step=self.p.max_step)
        if not sol.success: raise RuntimeError(sol.message)
        return t,sol.y.T


def metrics(p=Params(), return_trace=False):
    model=ReceiverModel(p)
    t,ys=model.integrate()
    en=[]; mo=[]; norms=[]; rec=[]; signal=[]; gaps=[]; scalar=[]; pos=[]
    for y in ys:
        E,P,norm=model.invariants(y);en.append(E);mo.append(P);norms.append(norm)
        psi,_,x,_,spin,*_=model.pieces(y)
        ops=model.operators(y)
        rec.append((1-spin[1,2])/2)
        signal.append(ops[5][1])
        gaps.append(ops[7][1]);scalar.append(psi);pos.append(x.copy())
    en=np.asarray(en);mo=np.asarray(mo);norms=np.asarray(norms)
    rec=np.array(rec);signal=np.array(signal);gaps=np.array(gaps)
    arrival_start=(p.x_receiver-p.x_source)/np.exp(-p.lam*p.initial_psi)
    mask=(t>=arrival_start+2)&(t<=p.t_end)
    # Excited receiver population maximum in common post-arrival window.
    response=rec[mask].max()
    result=dict(N=p.N,detune=p.detune,sigma=p.sigma,source_coupling=p.g_source,
        receiver_coupling=p.g_receiver,peak_receiver=float(response),
        receiver_at_end=float(rec[-1]),
        energy_rel_drift=float(np.max(np.abs(en-en[0]))/max(1e-14,abs(en[0]))),
        momentum_abs_drift=float(np.max(np.abs(mo-mo[0]))),
        max_bloch_norm_drift=float(np.max(np.abs(norms-1))),
        min_psi=float(np.min(scalar)),max_psi=float(np.max(scalar)),
        min_gap=float(np.min(gaps)),max_gap=float(np.max(gaps)),
        largest_center_motion=float(np.max(np.abs(np.array(pos)-np.array(pos[0])))))
    if return_trace:
        return result,dict(t=t,psi=np.array(scalar),receiver_population=rec,
                           receiver_field=signal,receiver_gap=gaps,energy=en,momentum=mo)
    return result


def run(output_dir, full=True):
    out=Path(output_dir);out.mkdir(parents=True,exist_ok=True)
    Ns=[24,48,96,192]
    detunings=[-.12,-.08,-.04,0.,.04,.08,.12]
    if not full: Ns=[24,48,96];detunings=[-.08,0.,.08]
    rows=[];trace=None
    for N in Ns:
        for d in detunings:
            result=(metrics(Params(N=N,detune=d),return_trace=(N==Ns[-1] and d==0.)))
            if isinstance(result,tuple):
                row,trace=result
            else: row=result
            rows.append(row)
            print(f'N={N:3} detune={d:+.3f} response={row["peak_receiver"]:.9g} Erel={row["energy_rel_drift"]:.2g}',flush=True)
    ctrls=[]
    for label,p in [
      ('receiver_decoupled',Params(N=Ns[-1],g_receiver=0.)),
      ('source_decoupled',Params(N=Ns[-1],g_source=0.)),
      ('no_scalar_coupling',Params(N=Ns[-1],lam=0.)),
      ('narrower_kernel',Params(N=Ns[-1],sigma=.9))]:
      row=metrics(p);row['label']=label;ctrls.append(row)
    def write(name,rr):
        with (out/name).open('w',newline='') as f:
            w=csv.DictWriter(f,fieldnames=list(rr[0]));w.writeheader();w.writerows(rr)
    write('receiver_spectral_convergence.csv',rows)
    write('receiver_controls.csv',ctrls)
    if trace:
        with (out/'receiver_time_trace.csv').open('w',newline='') as f:
            w=csv.writer(f);w.writerow(['T','psi','receiver_excitation','transverse_field_at_receiver','local_gap','total_energy','total_momentum'])
            w.writerows(zip(trace['t'],trace['psi'],trace['receiver_population'],trace['receiver_field'],trace['receiver_gap'],trace['energy'],trace['momentum']))
    return rows,ctrls

if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser();parser.add_argument('--output-dir',required=True);parser.add_argument('--quick',action='store_true')
    args=parser.parse_args();run(args.output_dir,full=not args.quick)
