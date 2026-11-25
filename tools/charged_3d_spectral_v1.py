#!/usr/bin/env python3
"""ArcSecs A-05h: 3D mobile charges, Coulomb-gauge projected EM, scalar field.

Finite dimensional, autonomous canonical Hamiltonian. Independently mobile signed
charges and their (modelled) harmonic binding; longitudinal electrostatic field
is constrained by Gauss's law, while transverse field and scalar are dynamical.

This is a smoothed *finite Fourier-mode* periodic classical approximation: no
claim of exact Maxwell behavior at excluded modes, causal wavefront, quantum
atoms, actual chameleon phenomenology or cosmological interpretation.
"""
from __future__ import annotations
import argparse, csv, json
from dataclasses import dataclass, asdict, replace
from pathlib import Path
import numpy as np
from scipy.integrate import solve_ivp


@dataclass(frozen=True)
class Params:
    length: float = 10.0
    wave_shell: int = 1
    sigma: float = 0.48
    m_positive: float = 3.0
    m_negative: float = 1.0
    charge_magnitude: float = 2.0
    spring: float = 2.8
    permittivity: float = 1.0
    light_speed: float = 1.0
    scalar_speed: float = 0.85
    scalar_mass: float = 1.15
    scalar_source: float = 0.24  # source in proportion to material mass
    scalar_screen: float = 0.55  # quadratic, density-localized field stiffness
    duration: float = 10.0
    steps: int = 161


def generate_wavevectors(shell: int):
    # A complete real-basis half-lattice on a bounded cubic Fourier shell.
    modes=[]
    for nx in range(-shell,shell+1):
        for ny in range(-shell,shell+1):
            for nz in range(-shell,shell+1):
                t=(nx,ny,nz)
                if t == (0,0,0): continue
                if next(a for a in t if a) > 0: modes.append(t)
    return np.asarray(modes,dtype=float)


def transverse_polarizations(k):
    e=np.zeros((len(k),2,3))
    for m,km in enumerate(k):
        v=km/np.linalg.norm(km)
        ref=np.array([0.,0.,1.]) if abs(v[2])<0.9 else np.array([0.,1.,0.])
        e[m,0]=np.cross(v,ref)/np.linalg.norm(np.cross(v,ref))
        e[m,1]=np.cross(v,e[m,0])
    return e


class ChargeField3D:
    """Canonical particle positions/momenta, two transverse modes and scalar modes."""
    def __init__(self,p:Params):
        self.p=p
        if p.wave_shell<1 or p.length<=0 or p.sigma<0 or p.permittivity<=0:
            raise ValueError('invalid spectral configuration')
        self.k=generate_wavevectors(p.wave_shell)*(2*np.pi/p.length)
        self.k2=np.einsum('ij,ij->i',self.k,self.k)
        self.M=len(self.k)
        self.e=transverse_polarizations(self.k)
        self.b=np.sqrt(2./p.length**3)*np.exp(-.5*p.sigma**2*self.k2)
        self.wA2=p.light_speed**2*self.k2
        self.wS2=p.scalar_speed**2*self.k2+p.scalar_mass**2
        self.q=np.array([p.charge_magnitude,-p.charge_magnitude,p.charge_magnitude,-p.charge_magnitude])
        self.mass=np.array([p.m_positive,p.m_negative,p.m_positive,p.m_negative])
        self.g=self.mass*p.scalar_source
        self.screen=self.mass*p.scalar_screen
        self.N=4

    def pack(self,r,pc,ac,as_,pac,pas,sc,ss,psc,pss):
        return np.concatenate([r.ravel(),pc.ravel(),ac.ravel(),as_.ravel(),pac.ravel(),pas.ravel(),sc.ravel(),ss.ravel(),psc.ravel(),pss.ravel()])

    def unpack(self,y):
        n=self.N*3; m=self.M; v=self.M*2
        r=y[:n].reshape(self.N,3); pc=y[n:2*n].reshape(self.N,3)
        idx=2*n
        def take(count,shape):
            nonlocal idx
            a=y[idx:idx+count].reshape(shape);idx+=count;return a
        ac=take(v,(m,2)); a_s=take(v,(m,2))
        pac=take(v,(m,2)); pas=take(v,(m,2))
        sc=take(m,(m,)); ss=take(m,(m,))
        psc=take(m,(m,)); pss=take(m,(m,))
        assert idx==len(y)
        return r,pc,ac,a_s,pac,pas,sc,ss,psc,pss

    def basis(self,r):
        phase=r@self.k.T
        return self.b[None,:]*np.cos(phase),self.b[None,:]*np.sin(phase)

    def static_scalar(self,r):
        C,S=self.basis(r)
        B=np.concatenate([C,S],axis=1)
        stiffness=np.r_[self.wS2,self.wS2]
        H=np.diag(stiffness)+B.T@(self.screen[:,None]*B)
        f=-B.T@self.g
        x=np.linalg.solve(H,f)
        return x[:self.M],x[self.M:]

    def initial(self,excitation=.32,kick=(0.,0.,0.)):
        # Two independent positive and negative material particles in each pair.
        r=np.array([[-2.4,0.,0.],[-2.4,excitation,0.],
                    [ 2.4,0.,0.],[ 2.4,0.,0.]])
        pc=np.zeros_like(r)
        pc[1]=np.asarray(kick,dtype=float);pc[0]=-pc[1]
        Z=np.zeros((self.M,2));z=np.zeros(self.M)
        sc,ss=self.static_scalar(r)
        return self.pack(r,pc,Z,Z,Z,Z,sc,ss,z,z)

    def quantities(self,y):
        r,pc,ac,as_,pac,pas,sc,ss,psc,pss=self.unpack(y)
        C,S=self.basis(r)
        # Per-particle electromagnetic vector potential, using perpendicular modes.
        A=np.einsum('im,mja->ia',C,self.e*ac[:,:,None]) +np.einsum('im,mja->ia',S,self.e*as_[:,:,None])
        v=(pc-self.q[:,None]*A)/self.mass[:,None]
        psi=C@sc+S@ss
        gradpsi=np.einsum('im,ma->ia',(-S*sc[None,:]+C*ss[None,:]),self.k)
        rho_c=self.q@C;rho_s=self.q@S
        # Charge density/current modes share identical deposition kernels.
        jc=np.einsum('i,im,ia->ma',self.q,C,v)
        js=np.einsum('i,im,ia->ma',self.q,S,v)
        # E_L is the smooth projected field (not a propagating additional mode).
        El=np.einsum('im,ma->ia',(S*rho_c[None,:]-C*rho_s[None,:])/(self.p.permittivity*self.k2)[None,:],self.k)
        return r,pc,ac,as_,pac,pas,sc,ss,psc,pss,C,S,A,v,psi,gradpsi,rho_c,rho_s,jc,js,El

    def rhs(self,t,y):
        (r,pc,ac,as_,pac,pas,sc,ss,psc,pss,C,S,A,v,psi,gradpsi,rhoc,rhos,jc,js,El)=self.quantities(y)
        qv=self.q[:,None]*v
        # Sum_i q_i v_i · dA_i/dr_i, including the mode gradient factor k.
        vpol=np.einsum('ia,mja->imj',v,self.e)
        coef=np.einsum('im,imj->im', -S,np.einsum('imj,mj->imj',vpol,ac)) +np.einsum('im,imj->im',C,np.einsum('imj,mj->imj',vpol,as_))
        canonical_lorentz=np.einsum('i,im,ma->ia',self.q,coef,self.k)
        scalar_force=-(self.g+self.screen*psi)[:,None]*gradpsi
        spring_force=np.zeros((self.N,3))
        for a,b in ((0,1),(2,3)):
            f=-self.p.spring*(r[a]-r[b]);spring_force[a]+=f;spring_force[b]-=f
        p_dot=self.q[:,None]*El +canonical_lorentz +scalar_force+spring_force
        # Transverse projected Ampère equations (cos and sine source components).
        source_cos=np.einsum('i,im,ia,mja->mj',self.q,C,v,self.e)
        source_sin=np.einsum('i,im,ia,mja->mj',self.q,S,v,self.e)
        # The field responds with equal and opposite coupling to particles.
        pac_dot=-self.wA2[:,None]*ac+source_cos
        pas_dot=-self.wA2[:,None]*as_+source_sin
        screened=self.g+self.screen*psi
        psc_dot=-self.wS2*sc-np.einsum('i,im->m',screened,C)
        pss_dot=-self.wS2*ss-np.einsum('i,im->m',screened,S)
        return self.pack(v,p_dot,pac,pas,pac_dot,pas_dot,psc,pss,psc_dot,pss_dot)

    def invariants(self,y):
        r,pc,ac,as_,pac,pas,sc,ss,psc,pss,C,S,A,v,psi,gradpsi,rhoc,rhos,jc,js,El=self.quantities(y)
        kinetic=np.sum(.5*self.mass[:,None]*v*v)
        bond=.5*self.p.spring*(np.sum((r[0]-r[1])**2)+np.sum((r[2]-r[3])**2))
        coulomb=np.sum((rhoc**2+rhos**2)/(2*self.p.permittivity*self.k2))
        transverse=.5*np.sum(pac**2+pas**2+self.wA2[:,None]*(ac**2+as_**2))
        scalar=.5*np.sum(psc**2+pss**2+self.wS2*(sc**2+ss**2))
        scalar_coupling=np.sum(self.g*psi+.5*self.screen*psi**2)
        H=kinetic+bond+coulomb+transverse+scalar+scalar_coupling
        # Noether generator of continuous common translation of particles and
        # both dynamic field-mode coefficient pairs on a fixed periodic grid.
        fieldP=np.sum(self.k*(np.sum(ac*pas-as_*pac,axis=1)+sc*pss-ss*psc)[:,None],axis=0)
        P=np.sum(pc,axis=0)+fieldP
        return float(H),P,dict(kinetic=float(kinetic),bond=float(bond),coulomb=float(coulomb),transverse=float(transverse),scalar=float(scalar),scalar_coupling=float(scalar_coupling),particle_canonical_momentum=np.sum(pc,axis=0).tolist(),field_canonical_momentum=fieldP.tolist())

    def continuity_residual(self,y,ydot=None):
        # exact semidiscrete continuity: dot rho_cos + k · J_sin = 0,
        # dot rho_sin - k · J_cos = 0
        if ydot is None:ydot=self.rhs(0,y)
        C,S=self.basis(self.unpack(y)[0])
        v=self.unpack(ydot)[0]
        rho_c_dot=np.sum(self.q[:,None]*(-S)*np.einsum('ia,ma->im',v,self.k),axis=0)
        rho_s_dot=np.sum(self.q[:,None]*C*np.einsum('ia,ma->im',v,self.k),axis=0)
        qc=self.quantities(y)
        Jc,Js=qc[18],qc[19]
        return float(max(np.max(np.abs(rho_c_dot+np.einsum('ma,ma->m',self.k,Js))),np.max(np.abs(rho_s_dot-np.einsum('ma,ma->m',self.k,Jc)))))

    def gauss_residual(self,y):
        # coefficient form in the retained Fourier space
        q=self.quantities(y);rc,rs=q[16],q[17]
        phi_c=rc/(self.p.permittivity*self.k2);phi_s=rs/(self.p.permittivity*self.k2)
        El_c=-self.k*phi_s[:,None];El_s=self.k*phi_c[:,None]
        return float(max(np.max(np.abs(-np.einsum('ma,ma->m',self.k,El_c)-rs/self.p.permittivity)),np.max(np.abs(np.einsum('ma,ma->m',self.k,El_s)-rc/self.p.permittivity))))

    def shift(self,y,delta):
        """Physically translate particles and mode profiles together."""
        r,pc,ac,as_,pac,pas,sc,ss,psc,pss=self.unpack(y)
        angle=self.k@np.asarray(delta)
        c=np.cos(angle);s=np.sin(angle)
        def rot(u,v):
            shape=(self.M,)+(1,)*(u.ndim-1)
            cc=c.reshape(shape);sn=s.reshape(shape)
            return cc*u-sn*v,sn*u+cc*v
        ac2,as2=rot(ac,as_);pac2,pas2=rot(pac,pas)
        sc2,ss2=rot(sc,ss);psc2,pss2=rot(psc,pss)
        return self.pack(r+delta,pc,ac2,as2,pac2,pas2,sc2,ss2,psc2,pss2)

    def run(self,excit=.32,t_end=None,kick=(.035,0.,.045)):
        y0=self.initial(excitation=excit,kick=kick)
        t=np.linspace(0,self.p.duration if t_end is None else t_end,self.p.steps)
        sol=solve_ivp(self.rhs,(t[0],t[-1]),y0,t_eval=t,method='DOP853',rtol=5e-10,atol=5e-12)
        if not sol.success:raise RuntimeError(sol.message)
        return sol


def summarize(name,model,sol,output_dir=None):
    I=[model.invariants(row) for row in sol.y.T]
    H=np.array([v[0] for v in I]);P=np.array([v[1] for v in I]);
    p=model.p;r0=model.unpack(sol.y[:,0])[0]
    receivers=[];transverse=[];cont=[];gauss=[]
    rows=[]
    for idx,(t,y) in enumerate(zip(sol.t,sol.y.T)):
        q=model.quantities(y);r=q[0]; A=q[12];C=q[10];S=q[11]
        dipole=np.linalg.norm(r[3]-r[2]); receivers.append(dipole)
        tf=float(np.linalg.norm(q[4])+np.linalg.norm(q[5]));transverse.append(tf)
        cont.append(model.continuity_residual(y));gauss.append(model.gauss_residual(y))
        rows.append(dict(T=float(t),energy=H[idx],momentum_x=P[idx,0],momentum_y=P[idx,1],momentum_z=P[idx,2],receiver_separation=dipole,source_separation=float(np.linalg.norm(r[1]-r[0])),transverse_field_norm=tf,continuity_residual=cont[-1],gauss_residual=gauss[-1]))
    result=dict(case=name,energy_relative_drift=float(np.max(np.abs(H-H[0]))/max(1e-12,abs(H[0]))),momentum_absolute_drift=float(np.max(np.linalg.norm(P-P[0],axis=1))),peak_receiver_separation=float(np.max(receivers)),peak_transverse_field=float(np.max(transverse)),max_charge_continuity_residual=float(np.max(cont)),max_gauss_residual=float(np.max(gauss)),initial_energy=float(H[0]),final_energy=float(H[-1]),initial_momentum=P[0].tolist(),final_momentum=P[-1].tolist(),modes=model.M)
    if output_dir:
        fp=Path(output_dir)/(name+'.csv')
        with fp.open('w',newline='') as f:
            writer=csv.DictWriter(f,rows[0].keys());writer.writeheader();writer.writerows(rows)
    return result


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--output-dir',type=Path,required=True)
    ap.add_argument('--quick',action='store_true')
    args=ap.parse_args()
    args.output_dir.mkdir(parents=True,exist_ok=True)
    p=Params(duration=5.,steps=81) if args.quick else Params()
    cases=[('baseline',p,.32),('unexcited_source',p,0.),('no_electric_charge',replace(p,charge_magnitude=0.),.32),('no_scalar_coupling',replace(p,scalar_source=0.,scalar_screen=0.),.32),('baseline_short_for_resolution',replace(p,duration=min(4.,p.duration),steps=81),.32),('larger_mode_shell',replace(p,wave_shell=2,duration=min(4.,p.duration),steps=81),.32)]
    results=[]
    for name,pi,excit in cases:
        sim=ChargeField3D(pi);kick=(.035,0.,.045) if excit else (0.,0.,0.)
        sol=sim.run(excit=excit,kick=kick);results.append(summarize(name,sim,sol,args.output_dir))
    (args.output_dir/'parameters.json').write_text(json.dumps(dict(cases=[dict(name=name,parameters=asdict(pi),excitation=exc) for name,pi,exc in cases]),indent=2))
    (args.output_dir/'results.json').write_text(json.dumps(results,indent=2))
    print(json.dumps(results,indent=2))

if __name__=='__main__':main()
