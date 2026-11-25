"""ArcSecs A-05f: two mobile bound charges + scalar + transverse electromagnetic field.

Autonomous dimensionless 1+1D Hamiltonian. Real classical charge coordinates q_s,q_r
move transverse to the 1D wave direction while fixed compensating positive charges
provide restoring Coulomb-like wells. Supports are FIXED in x; longitudinal momentum
is NOT closed by the model, but the full field + charge ENERGY is.

Classical oscillators do not model quantum transitions or invariant photon rest mass.
No astrophysical observation, parameter fitting or absolute redshift detection.
"""
from __future__ import annotations
import argparse, csv, json
from dataclasses import asdict, dataclass, replace
from pathlib import Path
import numpy as np
from scipy.integrate import solve_ivp
from scipy.sparse.linalg import LinearOperator, cg

@dataclass(frozen=True)
class Parameters:
    length: float=48.0
    nodes: int=128
    chi: float=1.0
    kappa: float=0.8
    mpsi2: float=1.0
    psi_far: float=1.0
    g_rho: float=1.0
    rho_source: float=3.0
    rho_receiver: float=0.65
    rho_sigma: float=1.0
    source_x: float=-8.0
    receiver_x: float=8.0
    smearing: float=0.68
    a: float=0.27
    b: float=0.18
    qmass: float=1.0
    k0: float=5.76       # isolated oscillator omega0=2.4 at psi=0
    well_radius: float=0.65
    charge_s: float=0.37
    charge_r: float=0.37
    excited_q: float=0.14
    end_t: float=32.0

class EmitterReceiver:
    def __init__(self,p:Parameters):
        self.p=p
        self.dx=p.length/p.nodes
        self.x=np.arange(p.nodes)*self.dx-p.length/2
        self.k=2*np.pi*np.fft.fftfreq(p.nodes,d=self.dx)
        # fixed normalized shape functions, not delta functions
        self.ws=self.gaussian(p.source_x,p.smearing)
        self.wr=self.gaussian(p.receiver_x,p.smearing)
        self.rho=p.rho_source*self.gaussian(p.source_x,p.rho_sigma) + p.rho_receiver*self.gaussian(p.receiver_x,p.rho_sigma)
        # weight normalization here implies density parameters = integrated densities
        self.Vcoeff=p.mpsi2 + p.g_rho*self.rho

    def gaussian(self,pos,width):
        # Periodic shortest distance on [-L/2,L/2)
        d=(self.x-pos+self.p.length/2)%self.p.length-self.p.length/2
        f=np.exp(-0.5*(d/width)**2)
        return f/(self.dx*np.sum(f))

    def d(self,f):return np.fft.ifft(1j*self.k*np.fft.fft(f)).real
    def dd(self,f):return np.fft.ifft(-(self.k**2)*np.fft.fft(f)).real
    def mean(self,w,f):return float(self.dx*np.dot(w,f))

    def equilibrium(self):
        p=self.p
        op=LinearOperator((p.nodes,p.nodes),matvec=lambda f:-p.kappa*self.dd(f)+self.Vcoeff*f,dtype=float)
        psi,code=cg(op,np.full(p.nodes,p.mpsi2*p.psi_far),atol=1e-13,rtol=1e-13,maxiter=5000)
        if code: raise RuntimeError(f'Equilibrium error {code}')
        return psi

    def unpack(self,y):
        n=self.p.nodes
        return y[:n],y[n:2*n],y[2*n:3*n],y[3*n:4*n],float(y[4*n]),float(y[4*n+1]),float(y[4*n+2]),float(y[4*n+3])

    def field_quantities(self,y):
        A,piA,psi,piPsi,qs,ps,qr,pr=self.unpack(y)
        eps=np.exp(self.p.a*psi)
        invmu=np.exp(-self.p.b*psi)
        P=self.p.charge_s*qs*self.ws+self.p.charge_r*qr*self.wr
        At=(piA+P)/eps
        E=-At
        return eps,invmu,P,At,E

    def V(self,q,localpsi):
        p=self.p
        r=p.well_radius
        return p.k0*r*r*np.exp(-p.a*localpsi)*(1-r/np.sqrt(r*r+q*q))

    def Vq(self,q,localpsi):
        p=self.p;r=p.well_radius
        return p.k0*np.exp(-p.a*localpsi)*r**3*q/(r*r+q*q)**1.5

    def local_values(self,psi):
        return self.mean(self.ws,psi),self.mean(self.wr,psi)

    def calibrated_frequencies(self,psi):
        p=self.p
        es,er=self.local_values(psi)
        return (np.sqrt(p.k0/p.qmass)*np.exp(-p.a*es/2),
                np.sqrt(p.k0/p.qmass)*np.exp(-p.a*er/2))

    def initial_state(self,amplitude=None):
        p=self.p
        qs=p.excited_q if amplitude is None else amplitude
        psi=self.equilibrium()
        P=p.charge_s*qs*self.ws
        # Start without electric or magnetic radiation; all energy initially in q_s and screening configuration
        return np.r_[np.zeros(p.nodes),-P,psi,np.zeros(p.nodes),qs,0.,0.,0.]

    def rhs(self,t,y):
        p=self.p
        A,piA,psi,piPsi,qs,ps,qr,pr=self.unpack(y)
        eps,invmu,P,At,E=self.field_quantities(y)
        Ax=self.d(A)
        psis,psir=self.local_values(psi)
        vs=self.V(qs,psis);vr=self.V(qr,psir)
        # H = ∫[(piA+P)^2/(2eps)+Ax²/(2mu)+ piPsi²/(2chi)+...
        #      +0.5*g*rho*psi²] dx + ∑ (p_i²/2m + V(q_i,psi_i))
        dA=At
        dpiA=self.d(invmu*Ax)
        dpsi=piPsi/p.chi
        dpiPsi=(p.kappa*self.dd(psi)-p.mpsi2*(psi-p.psi_far)-p.g_rho*self.rho*psi
                +0.5*p.a*eps*At**2 +0.5*p.b*invmu*Ax**2
                +p.a*(vs*self.ws+vr*self.wr))
        dqs=ps/p.qmass
        dps=-self.Vq(qs,psis)+p.charge_s*self.mean(self.ws,E)
        dqr=pr/p.qmass
        dpr=-self.Vq(qr,psir)+p.charge_r*self.mean(self.wr,E)
        return np.r_[dA,dpiA,dpsi,dpiPsi,dqs,dps,dqr,dpr]

    def budget(self,y):
        p=self.p
        A,piA,psi,piPsi,qs,ps,qr,pr=self.unpack(y)
        eps,invmu,P,At,E=self.field_quantities(y)
        Ax=self.d(A);psix=self.d(psi)
        es,er=self.local_values(psi)
        em=self.dx*np.sum(0.5*eps*At*At+0.5*invmu*Ax*Ax)
        scalar=self.dx*np.sum(0.5*piPsi**2/p.chi+0.5*p.kappa*psix**2
             +0.5*p.mpsi2*(psi-p.psi_far)**2+0.5*p.g_rho*self.rho*psi**2)
        src=ps**2/(2*p.qmass)+self.V(qs,es)
        rec=pr**2/(2*p.qmass)+self.V(qr,er)
        w_s,w_r=self.calibrated_frequencies(psi)
        return dict(total=float(em+scalar+src+rec),em=float(em),scalar=float(scalar),
                    source=float(src),receiver=float(rec),qs=float(qs),qr=float(qr),
                    qdot_s=float(ps/p.qmass),qdot_r=float(pr/p.qmass),
                    E_source=self.mean(self.ws,E), E_receiver=self.mean(self.wr,E),
                    psi_source=es,psi_receiver=er,omega_s=w_s,omega_r=w_r)

    def solve(self,final=None,points=241,amplitude=None,rtol=3e-9,atol=2e-11):
        final=self.p.end_t if final is None else final
        yi=self.initial_state(amplitude)
        sol=solve_ivp(self.rhs,(0,final),yi,method='DOP853',t_eval=np.linspace(0,final,points),
                      rtol=rtol,atol=atol)
        if not sol.success:raise RuntimeError(sol.message)
        history=[self.budget(sol.y[:,j]) for j in range(sol.t.size)]
        eng=np.array([row['total'] for row in history])
        drift=float(np.max(abs(eng-eng[0]))/max(1.,abs(eng[0])))
        return sol,history,drift


def write_data(out):
    out=Path(out);out.mkdir(parents=True,exist_ok=True)
    cases={
        'baseline_screened':Parameters(),
        'zero_emission':replace(Parameters(),excited_q=0.),
        'receiver_decoupled':replace(Parameters(),charge_r=0.),
        'equal_screening':replace(Parameters(),rho_receiver=3.),
        'no_scalar_optical_coupling':replace(Parameters(),a=0.,b=0.),
        'zero_charge_coupling':replace(Parameters(),charge_s=0.,charge_r=0.),
    }
    summary={'status':'Synthetic classical bound-charge analog; NOT a quantum atom, rest-mass detection, or calibrated cosmology',
             'cases':{}}
    for key,p in cases.items():
        m=EmitterReceiver(p);sol,hist,drift=m.solve()
        with (out/f'{key}_history.csv').open('w',newline='') as f:
            writer=csv.DictWriter(f,fieldnames=['t']+list(hist[0]));writer.writeheader()
            for t,row in zip(sol.t,hist):writer.writerow({'t':float(t),**row})
        scalar0=m.equilibrium()
        cal=m.calibrated_frequencies(scalar0)
        summary['cases'][key]={'parameters':asdict(p),'max_relative_energy_drift':drift,
                               'initial_calibration_omega_source':cal[0],
                               'initial_calibration_omega_receiver':cal[1],
                               'screening_calibration_ratio':cal[1]/cal[0],
                               'max_abs_receiver_displacement':max(abs(row['qr']) for row in hist),
                               'max_receiver_energy':max(row['receiver'] for row in hist),
                               'initial_energy':hist[0]['total'], 'final_energy':hist[-1]['total']}
        if key=='baseline_screened':
            with (out/'baseline_initial_profile.csv').open('w',newline='') as f:
                writer=csv.writer(f);writer.writerow(['x','psi','rho','ws','wr'])
                writer.writerows(zip(m.x,scalar0,m.rho,m.ws,m.wr))
    (out/'run_summary.json').write_text(json.dumps(summary,indent=2)+'\n')
    return summary

if __name__=='__main__':
    cli=argparse.ArgumentParser();cli.add_argument('--output-dir',default='docs/long-term-memory/research/charged-emitter-receiver');cli.add_argument('--nodes',type=int,default=128)
    a=cli.parse_args()
    result=write_data(a.output_dir)
    for key,v in result['cases'].items():
        print(key,'drift',f'{v["max_relative_energy_drift"]:.2e}',
              'screen ratio',f'{v["screening_calibration_ratio"]:.6f}',
              'received',f'{v["max_abs_receiver_displacement"]:.6g}')
