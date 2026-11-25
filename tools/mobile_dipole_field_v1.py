#!/usr/bin/env python3
"""ArcSecs A-05g: autonomous, translation-invariant finite-mode mobile-dipole/EM/scalar model.

Synthetic classical Coulomb-gauge transverse reduction on a periodic 1D line.
The reduced neutral dipole consists of a longitudinal mobile center and a transverse
internal charge separation. It is NOT a 3D plasma, a full Maxwell gauge theory,
or a quantum atom.
"""
from __future__ import annotations
import argparse, csv, json
from dataclasses import dataclass, replace, asdict
from pathlib import Path
import numpy as np
from scipy.integrate import solve_ivp

@dataclass(frozen=True)
class Params:
    K: int = 10
    N: int = 96
    length: float = float(2 * np.pi)
    sigma: float = 0.32
    scalar_bg: float = 0.10
    scalar_mass2: float = 1.4
    scalar_speed2: float = 0.8
    electric_response: float = 0.28
    magnetic_response: float = 0.17
    spring: float = 4.8
    spring_scalar: float = 0.7
    screen: float = 2.4
    charge: float = 0.45
    internal_mass: float = 1.0
    center_mass: float = 13.0
    duration: float = 12.0
    output_count: int = 301

class MobileDipoleField:
    def __init__(self, p: Params):
        assert p.K >= 1 and p.N >= 6*p.K + 1
        self.p = p
        self.d = 1 + 2*p.K
        k = np.arange(1, p.K+1, dtype=float)
        self.k = k
        self.kfull = np.zeros(self.d)
        self.kfull[1::2] = k
        self.kfull[2::2] = k
        self.x = np.arange(p.N)*p.length/p.N
        self.weights = np.ones(self.d)*2/p.length
        self.weights[0] = 1/p.length
        self.damp = np.exp(-.5*(2*np.pi*k/p.length*p.sigma)**2)
        self.B = self.basis(self.x, False, False)
        self.Bx = self.basis(self.x, True, False)
        self.proj = self.B.T * (2/p.N)
        self.proj[0] /= 2
        self.D = np.zeros((self.d, self.d))
        for i, kv in enumerate(2*np.pi*k/p.length):
            self.D[1+2*i, 2+2*i] = kv
            self.D[2+2*i, 1+2*i] = -kv
        self.D2 = self.D@self.D
        self.mass = np.ones(self.d)*p.length/2
        self.mass[0] = p.length

    def basis(self, x, derivative=False, smooth=True):
        x = np.atleast_1d(x)
        k = 2*np.pi*self.k/self.p.length
        phase = np.outer(x, k)
        B = np.ones((len(x), self.d))
        if derivative: B[:, 0] = 0
        damp = self.damp if smooth else np.ones_like(k)
        B[:, 1::2] = (-np.sin(phase)*k if derivative else np.cos(phase))*damp
        B[:, 2::2] = (np.cos(phase)*k if derivative else np.sin(phase))*damp
        return B

    def particle_basis(self, X):
        B = self.basis(X, False, True)
        G = self.basis(X, True, True)
        return B,G

    def split(self, y):
        d=self.d
        return y[:d], y[d:2*d], y[2*d:3*d], y[3*d:4*d], y[4*d:4*d+2], y[4*d+2:4*d+4], y[4*d+4:4*d+6], y[4*d+6:4*d+8]

    def combine(self, A, Pi, psi, Ppsi, X, pX, q, pq):
        return np.r_[A,Pi,psi,Ppsi,X,pX,q,pq]

    def scalar_equilibrium(self, X, q):
        p=self.p
        B,_=self.particle_basis(X)
        D=np.diag(p.scalar_mass2-p.scalar_speed2*np.diag(self.D2))
        r=np.zeros(self.d); r[0]=p.scalar_mass2*p.scalar_bg
        for i in range(2):
            D+=p.screen*np.outer(self.weights*B[i], B[i])
            r-=0.5*p.spring*p.spring_scalar*q[i]**2*self.weights*B[i]
        return np.linalg.solve(D,r)

    def initial(self, excitation=.17, coupling=None, speed1=.028, speed2=-.012):
        p=self.p
        X=np.array([1.48,4.53])
        q=np.array([excitation,0.])
        psi=self.scalar_equilibrium(X,q)
        A=np.zeros(self.d); Pi=np.zeros(self.d); Ppsi=np.zeros(self.d)
        pX=p.center_mass*np.array([speed1,speed2])
        pq=np.zeros(2)
        return self.combine(A,Pi,psi,Ppsi,X,pX,q,pq)

    def rhs(self, t, y):
        p=self.p
        A,Pi,psi,Ppsi,X,pX,q,pq=self.split(y)
        a=self.B@A; ax=self.Bx@A; ps=self.B@psi
        alp=1-p.electric_response*ps
        bet=1-p.magnetic_response*ps
        ALPHA=self.proj@(alp*(self.B@Pi))
        BETA=self.D@(self.proj@(bet*ax))
        B,G=self.particle_basis(X)
        ai=B@A; psi_i=B@psi; ax_i=G@A; psix_i=G@psi
        qdot=(pq-p.charge*ai)/p.internal_mass
        # Variation of the finite-mode Hamiltonian, including the same
        # smoothed kernels for energy, field sources, and recoil.
        Pidot=BETA + np.sum((p.charge*qdot)[:,None]*(B*self.weights), axis=0)
        psidot=Ppsi
        psi_force=p.scalar_speed2*(self.D2@psi) - p.scalar_mass2*(psi-np.r_[p.scalar_bg,np.zeros(self.d-1)])
        psi_force+=self.proj@(0.5*p.electric_response*(self.B@Pi)**2 + 0.5*p.magnetic_response*ax**2)
        scalar_src=.5*p.spring*p.spring_scalar*q**2 + p.screen*psi_i
        Ppsidot=psi_force-np.sum(scalar_src[:,None]*(B*self.weights),axis=0)
        Xdot=pX/p.center_mass
        pXdot=p.charge*qdot*ax_i-(.5*p.spring*p.spring_scalar*q**2+p.screen*psi_i)*psix_i
        pqdot=-p.spring*(1+p.spring_scalar*psi_i)*q
        return self.combine(ALPHA,Pidot,psidot,Ppsidot,Xdot,pXdot,qdot,pqdot)

    def invariants(self, y):
        p=self.p
        A,Pi,psi,Ppsi,X,pX,q,pq=self.split(y)
        av=self.B@A; ax=self.Bx@A
        piv=self.B@Pi; ps=self.B@psi; psx=self.Bx@psi; pp=self.B@Ppsi
        B,_=self.particle_basis(X)
        localA=B@A; localpsi=B@psi
        qdot=(pq-p.charge*localA)/p.internal_mass
        u=.5*(1-p.electric_response*ps)*piv**2 +.5*(1-p.magnetic_response*ps)*ax**2
        u+=.5*pp**2+.5*p.scalar_speed2*psx**2+.5*p.scalar_mass2*(ps-p.scalar_bg)**2
        field_energy=p.length*np.mean(u)
        matter_energy=np.sum(pX**2/(2*p.center_mass)+.5*p.internal_mass*qdot**2+.5*p.spring*(1+p.spring_scalar*localpsi)*q**2+.5*p.screen*localpsi**2)
        field_momentum=-p.length*np.mean(piv*ax+pp*psx)
        return float(field_energy+matter_energy), float(np.sum(pX)+field_momentum), float(field_energy), float(matter_energy)

    def local_diagnostics(self,y):
        p=self.p
        A,Pi,psi,Ppsi,X,pX,q,pq=self.split(y)
        B,G=self.particle_basis(X)
        li=B@psi
        speed=np.sqrt((1-p.electric_response*li)*(1-p.magnetic_response*li))
        omega=np.sqrt(p.spring*(1+p.spring_scalar*li)/p.internal_mass)
        qdot=(pq-p.charge*(B@A))/p.internal_mass
        return {"X_source":X[0],"X_receiver":X[1],"q_source":q[0],"q_receiver":q[1],"v_source":pX[0]/p.center_mass,"v_receiver":pX[1]/p.center_mass,
                "psi_source":li[0],"psi_receiver":li[1],"local_speed_source":speed[0],"local_speed_receiver":speed[1],
                "local_frequency_ratio":omega[1]/omega[0],"qdot_source":qdot[0],"qdot_receiver":qdot[1],"p_center_source":pX[0],"p_center_receiver":pX[1],
                "p_fields":-p.length*np.mean((self.B@Pi)*(self.Bx@A)+(self.B@Ppsi)*(self.Bx@psi))}

    def run(self,excit=.17, coupling=None, speed1=.028,speed2=-.012, t_end=None):
        y0=self.initial(excit,speed1=speed1,speed2=speed2)
        times=np.linspace(0, t_end or self.p.duration,self.p.output_count)
        sol=solve_ivp(self.rhs, (0,float(times[-1])), y0,method='DOP853',rtol=2e-10,atol=2e-12,t_eval=times)
        if not sol.success: raise RuntimeError(sol.message)
        invs=np.array([self.invariants(y) for y in sol.y.T])
        diag=[self.local_diagnostics(y) for y in sol.y.T]
        return sol, invs, diag

    def shift(self, y, delta):
        # Exact physical shift u(x)->u(x-delta) and X->X+delta.
        a,pi,psi,pp,X,pX,q,pq=self.split(y)
        def tran(v):
            out=v.copy()
            for j,k in enumerate(2*np.pi*self.k/self.p.length):
                c=v[1+2*j]; s=v[2+2*j]; th=k*delta
                out[1+2*j]= c*np.cos(th)-s*np.sin(th)
                out[2+2*j]= c*np.sin(th)+s*np.cos(th)
            return out
        return self.combine(tran(a),tran(pi),tran(psi),tran(pp),X+delta,pX,q,pq)


def write_case(folder, name, params, **kw):
    folder=Path(folder); folder.mkdir(parents=True,exist_ok=True)
    sim=MobileDipoleField(params)
    sol,invs,ds=sim.run(**kw)
    H0,P0=invs[0,:2]
    row=[]
    for i,t in enumerate(sol.t):
        row.append(dict(T=float(t),total_energy=float(invs[i,0]),total_momentum=float(invs[i,1]),field_energy=float(invs[i,2]),matter_energy=float(invs[i,3]),**{k:float(v) for k,v in ds[i].items()}))
    f=folder/(name+'.csv')
    with f.open('w',newline='') as o:
        w=csv.DictWriter(o,fieldnames=list(row[0]));w.writeheader();w.writerows(row)
    return dict(case=name, energy_drift=float(np.max(np.abs(invs[:,0]-H0))/max(1e-14,abs(H0))), momentum_drift=float(np.max(np.abs(invs[:,1]-P0))), final_center1=float(ds[-1]['X_source']),final_center2=float(ds[-1]['X_receiver']),peak_receiver_q=float(np.max(np.abs([v['q_receiver'] for v in ds]))), calibration_ratio_initial=float(ds[0]['local_frequency_ratio']), calibration_ratio_final=float(ds[-1]['local_frequency_ratio']), initial_energy=float(H0),initial_momentum=float(P0))


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--output-dir',type=Path,required=True)
    ap.add_argument('--quick',action='store_true')
    args=ap.parse_args()
    out=args.output_dir; out.mkdir(parents=True, exist_ok=True)
    p=Params(duration=8. if args.quick else 12.)
    cases=[('baseline',p,dict()),('no_excitation',p,dict(excit=0.)),('no_radiation',replace(p,charge=0.),dict()),('no_screening',replace(p,screen=0.),dict()),('stationary_centers_initially',p,dict(speed1=0.,speed2=0.)),('higher_fourier_resolution',replace(p,K=14,N=112),dict())]
    results=[write_case(out,n,cp,**kw) for n,cp,kw in cases]
    (out/'parameters.json').write_text(json.dumps(dict(baseline=asdict(p),cases=[{'name':n,'parameters':asdict(cp),'initial_controls':kw} for n,cp,kw in cases]),indent=2))
    (out/'results.json').write_text(json.dumps(results,indent=2))
    print(json.dumps(results,indent=2))

if __name__=='__main__': main()
