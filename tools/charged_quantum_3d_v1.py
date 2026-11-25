#!/usr/bin/env python3
"""ArcSecs Chapter 30P: finite-dimensional 3D mobile-charge / two-level receiver.

An *autonomous semiclassical* Hamiltonian of four independently moving
regularized signed charges, two normalized Bloch vectors, two transverse
finite-Fourier vector modes, a constrained massive electrostatic potential,
and one spatially UNIFORM dynamic scalar. Conserves Noether H and 3-vector P.
The longitudinal massive-vector propagating degree of freedom, spin/charge
microphysical identification, QED and continuum convergence are NOT included.
Normalized units; finite periodic box; no observational fit.
"""
from __future__ import annotations
from dataclasses import dataclass, replace
from pathlib import Path
import csv, json
import numpy as np
from scipy.integrate import solve_ivp
from charged_3d_spectral_v1 import generate_wavevectors, transverse_polarizations
from quantum_receiver_v1 import atom_gap_and_gradient

@dataclass(frozen=True)
class Params:
    shell:int=1
    L:float=14.
    sigma:float=1.75
    m_plus:float=5.
    m_minus:float=2.
    q:float=.24
    spring:float=1.0
    g_source:float=1.5
    g_receiver:float=1.5
    detune:float=0.
    omega_gap:float=.40
    lam:float=.16
    scalar_K:float=10.
    scalar_stiffness:float=12.
    scalar_target:float=.04
    psi_initial:float=.04
    center_x:float=2.5
    t_end:float=12.
    n_times:int=121
    rtol:float=1e-8
    atol:float=3e-10
    step:float=.14

class Coupled3D:
    def __init__(self,p=Params()):
        self.p=p
        if p.shell<1 or p.L<=0 or p.sigma<=0 or p.scalar_K<=0 or p.omega_gap<=0:
            raise ValueError('positive physical parameters and nonempty modes required')
        self.k=generate_wavevectors(p.shell)*(2*np.pi/p.L)
        self.M=len(self.k)
        self.k2=np.einsum('ij,ij->i',self.k,self.k)
        self.e=transverse_polarizations(self.k)
        self.weight=np.sqrt(2/p.L**3)*np.exp(-p.sigma**2*self.k2/2)
        self.q=np.array([p.q,-p.q,p.q,-p.q])
        self.mass=np.array([p.m_plus,p.m_minus,p.m_plus,p.m_minus])
        self.g=np.array([p.g_source,p.g_receiver])
        self.d=np.array([[0.,1.,0.],[0.,1.,0.]])
        self.n=2+24+6+8*self.M  # psi,p_psi; positions/momenta; spins; 4 transverse coordinate/canonical pairs

    def pack(self,psi,ps,r,p,spin,a,b,pa,pb):
        return np.r_[psi,ps,np.ravel(r),np.ravel(p),np.ravel(spin),np.ravel(a),np.ravel(b),np.ravel(pa),np.ravel(pb)]
    def unpack(self,y):
        M=self.M
        psi,ps=y[:2]
        r=y[2:14].reshape(4,3); mom=y[14:26].reshape(4,3)
        spins=y[26:32].reshape(2,3)
        a=y[32:32+2*M].reshape(M,2)
        b=y[32+2*M:32+4*M].reshape(M,2)
        pa=y[32+4*M:32+6*M].reshape(M,2)
        pb=y[32+6*M:32+8*M].reshape(M,2)
        return psi,ps,r,mom,spins,a,b,pa,pb

    def initial(self):
        p=self.p
        r=np.array([[-p.center_x,0.,0.],[-p.center_x,0.,0.],
                    [p.center_x,0.,0.],[p.center_x,0.,0.]])
        spin=np.array([[1.,0.,0.],[0.,0.,1.]])
        zeros=np.zeros((self.M,2))
        return self.pack(p.psi_initial,0.,r,np.zeros((4,3)),spin,zeros,zeros,zeros,zeros)

    def geometry(self,r):
        x=np.vstack((r,(r[0]+r[1])/2,(r[2]+r[3])/2))
        angle=x@self.k.T
        C=self.weight[None,:]*np.cos(angle)
        S=self.weight[None,:]*np.sin(angle)
        return C,S

    def derived(self,y):
        p=self.p
        psi,ps,r,mom,s,a,b,pa,pb=self.unpack(y)
        eps=np.exp(p.lam*psi); bb=1/eps
        eta=p.omega_gap**2*eps
        Cmat=bb*self.k2+eta
        Cprime=p.lam*(-bb*self.k2+eta)
        denom=eps*self.k2+p.omega_gap**2*eps**3
        denom_prime=p.lam*(eps*self.k2+3*p.omega_gap**2*eps**3)
        C,S=self.geometry(r)
        # Vector potential for four charges and the two dipole locations.
        avec=np.einsum('im,mja->ia',C,self.e*a[:,:,None])+np.einsum('im,mja->ia',S,self.e*b[:,:,None])
        gradA=np.einsum('im,mja,mc->iac',-S,self.e*a[:,:,None],self.k) + np.einsum('im,mja,mc->iac',C,self.e*b[:,:,None],self.k)
        v=(mom-self.q[:,None]*avec[:4])/self.mass[:,None]
        rho_c=np.sum(self.q[:,None]*C[:4],axis=0)
        rho_s=np.sum(self.q[:,None]*S[:4],axis=0)
        Ec=np.einsum('im,ma->ia',S[:4]*rho_c[None,:]/denom[None,:]-C[:4]*rho_s[None,:]/denom[None,:],self.k)
        D,Dprime,_=atom_gap_and_gradient(psi,p.lam)
        gaps=np.array([D,D*(1+p.detune)])
        gap_primes=np.array([Dprime,Dprime*(1+p.detune)])
        B=np.sum(avec[4:]*self.d,axis=1)
        Bgrad=np.einsum('ia,iac->ic',self.d,gradA[4:])
        return eps,Cmat,Cprime,denom,denom_prime,C,S,avec,gradA,v,rho_c,rho_s,Ec,gaps,gap_primes,B,Bgrad

    def rhs(self,t,y):
        p=self.p
        psi,ps,r,mom,spins,a,b,pa,pb=self.unpack(y)
        (eps,K,Kp,D,Dp,C,S,A,gradA,v,rhoc,rhos,EL,gaps,gapsp,B,Bgrad)=self.derived(y)
        u,vspin,w=spins.T
        # Ehrenfest two-level evolution from H_atom = gap(1-w)/2 -g*u*B.
        ds=np.stack((gaps*vspin,-gaps*u+2*self.g*B*w,-2*self.g*B*vspin),axis=1)
        dp=self.q[:,None]*EL+np.einsum('i,ia,iac->ic',self.q,v,gradA[:4])
        # Neutral-pair binding with freely moving BOTH signed particles.
        for j in range(2):
            aidx,bidx=2*j,2*j+1
            force=-p.spring*(r[aidx]-r[bidx])
            dp[aidx]+=force;dp[bidx]-=force
            dp[aidx]+=.5*self.g[j]*u[j]*Bgrad[j]
            dp[bidx]+=.5*self.g[j]*u[j]*Bgrad[j]
        # Mode evolution from the same Hamiltonian as particles and spins.
        dpa=-K[:,None]*a+np.einsum('i,im,ia,mja->mj',self.q,C[:4],v,self.e)
        dpb=-K[:,None]*b+np.einsum('i,im,ia,mja->mj',self.q,S[:4],v,self.e)
        for j in range(2):
            dpa+=self.g[j]*u[j]*C[4+j,:,None]*np.einsum('ja,a->j',self.e.reshape(self.M*2,3),self.d[j]).reshape(self.M,2)
            dpb+=self.g[j]*u[j]*S[4+j,:,None]*np.einsum('ja,a->j',self.e.reshape(self.M*2,3),self.d[j]).reshape(self.M,2)
        dps=-p.scalar_stiffness*(psi-p.scalar_target)
        dps+=p.lam*np.sum(pa**2+pb**2)/(2*eps)-.5*np.sum(Kp[:,None]*(a*a+b*b))
        dps+=.5*np.sum((rhoc**2+rhos**2)*Dp/(D**2))
        dps-=.5*np.sum(gapsp*(1-w))
        return self.pack(ps/p.scalar_K,dps,v,dp,ds,pa/eps,pb/eps,dpa,dpb)

    def invariants(self,y):
        p=self.p
        psi,ps,r,mom,spins,a,b,pa,pb=self.unpack(y)
        eps,K,Kp,D,Dp,C,S,A,gradA,v,rhoc,rhos,EL,gaps,gapsp,B,Bgrad=self.derived(y)
        Hmatter=.5*np.sum(self.mass[:,None]*v*v)
        Hbond=sum(.5*p.spring*np.sum((r[2*j]-r[2*j+1])**2) for j in range(2))
        HL=.5*np.sum((rhoc*rhoc+rhos*rhos)/D)
        HT=.5*(np.sum((pa*pa+pb*pb)/eps)+np.sum(K[:,None]*(a*a+b*b)))
        Hpsi=ps*ps/(2*p.scalar_K)+.5*p.scalar_stiffness*(psi-p.scalar_target)**2
        Hatom=.5*np.sum(gaps*(1-spins[:,2]))-np.sum(self.g*spins[:,0]*B)
        H=Hmatter+Hbond+HL+HT+Hpsi+Hatom
        Pf=np.sum(self.k*(np.sum(a*pb-b*pa,axis=1))[:,None],axis=0)
        P=np.sum(mom,axis=0)+Pf
        return float(H),P,np.linalg.norm(spins,axis=1),dict(matter=float(Hmatter),bond=float(Hbond),electric=float(HL),transverse=float(HT),scalar=float(Hpsi),atomic=float(Hatom))

    def continuity(self,y):
        q=self.derived(y);C,S=q[5],q[6];v=q[9]
        ks=self.k
        rhocdot=-np.sum(self.q[:,None]*S[:4]*np.einsum('ia,ma->im',v,ks),axis=0)
        rhosdot=np.sum(self.q[:,None]*C[:4]*np.einsum('ia,ma->im',v,ks),axis=0)
        Jc=np.einsum('i,im,ia->ma',self.q,C[:4],v)
        Js=np.einsum('i,im,ia->ma',self.q,S[:4],v)
        return float(max(np.max(np.abs(rhocdot+np.einsum('ma,ma->m',ks,Js))),np.max(np.abs(rhosdot-np.einsum('ma,ma->m',ks,Jc)))))

    def constraint(self,y):
        q=self.derived(y);rho_c,rho_s=q[10],q[11]
        eps=np.exp(self.p.lam*self.unpack(y)[0]); zeta=self.p.omega_gap**2*eps**3
        # (eps*k^2+zeta)phi=rho in retained modes; constructed algebraically.
        phi_c=rho_c/q[3];phi_s=rho_s/q[3]
        return float(max(np.max(np.abs((eps*self.k2+zeta)*phi_c-rho_c)),np.max(np.abs((eps*self.k2+zeta)*phi_s-rho_s))))

    def integrate(self):
        p=self.p
        t=np.linspace(0,p.t_end,p.n_times)
        sol=solve_ivp(self.rhs,(0,p.t_end),self.initial(),t_eval=t,method='DOP853',rtol=p.rtol,atol=p.atol,max_step=p.step)
        if not sol.success:raise RuntimeError(sol.message)
        return t,sol.y.T

def metrics(p=Params(),traces=False):
    m=Coupled3D(p);t,ys=m.integrate()
    H=[];P=[];norm=[];pop=[];field=[];scalar=[];disp=[]
    for y in ys:
        h,pm,n,_=m.invariants(y);H.append(h);P.append(pm);norm.append(n)
        s=m.unpack(y)[4];pop.append((1-s[1,2])/2)
        field.append(m.derived(y)[15][1]);scalar.append(m.unpack(y)[0])
        r=m.unpack(y)[2];disp.append(np.max(np.abs(r-m.unpack(ys[0])[2])))
    H=np.asarray(H);P=np.asarray(P);norm=np.asarray(norm);pop=np.asarray(pop)
    mask=t>=max(0,p.center_x*2-0.4)
    peak=float(pop[mask].max())
    out=dict(shell=p.shell,modes=m.M,sigma=p.sigma,detune=p.detune,
        g_source=p.g_source,g_receiver=p.g_receiver,peak_receiver=peak,
        final_receiver=float(pop[-1]),energy_rel_drift=float(np.max(np.abs(H-H[0]))/max(1e-12,abs(H[0]))),
        momentum_abs_drift=float(np.max(np.linalg.norm(P-P[0],axis=1))),
        norm_drift=float(np.max(np.abs(norm-1))),
        max_charge_continuity=float(max(m.continuity(y) for y in ys[::max(1,len(ys)//12)])),
        max_gauss_constraint=float(max(m.constraint(y) for y in ys[::max(1,len(ys)//12)])),
        scalar_range=float(np.ptp(scalar)),max_charge_motion=float(max(disp)))
    if traces:
        return out,dict(t=t,receiver_excitation=pop,total_energy=H,three_momentum=P,psi=np.asarray(scalar),receiver_field=np.asarray(field))
    return out

def run(outdir):
    o=Path(outdir);o.mkdir(parents=True,exist_ok=True)
    base=Params()
    rows=[];track=None
    configs=[(f'shell_{sh}',replace(base,shell=sh)) for sh in (1,2,3,4,5)]
    configs += [('source_off',replace(base,shell=4,g_source=0.)),
                ('receiver_off',replace(base,shell=4,g_receiver=0.)),
                ('scalar_off',replace(base,shell=4,lam=0.)),
                ('wide_kernel',replace(base,shell=4,sigma=2.1)),
                ('charges_off',replace(base,shell=4,q=0.))]
    configs += [(f'detune_{d:+.2f}',replace(base,shell=4,detune=d))
                for d in (-.12,-.06,.06,.12)]
    for tag,p in configs:
        result=metrics(p,traces=(tag=='shell_4'))
        if isinstance(result,tuple):row,track=result
        else:row=result
        row={'case':tag,**row};rows.append(row)
        print(tag,row['peak_receiver'],row['energy_rel_drift'],row['momentum_abs_drift'],flush=True)
    with (o/'comparison.csv').open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=rows[0]);w.writeheader();w.writerows(rows)
    if track:
        with (o/'baseline_trace.csv').open('w',newline='') as f:
            w=csv.writer(f);w.writerow(['T','receiver_population','energy','P_x','P_y','P_z','psi','receiver_dipole_field'])
            w.writerows(zip(track['t'],track['receiver_excitation'],track['total_energy'],*track['three_momentum'].T,track['psi'],track['receiver_field']))
    (o/'summary.json').write_text(json.dumps(rows,indent=2))
    return rows

if __name__=='__main__':
    import argparse
    p=argparse.ArgumentParser();p.add_argument('--output-dir',required=True);args=p.parse_args();run(args.output_dir)
