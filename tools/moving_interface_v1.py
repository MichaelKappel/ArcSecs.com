"""A-05e 1D moving matter / scalar / electromagnetic Hamiltonian prototype.

All variables dimensionless. This is a synthetic closed *collective coordinate*
model, NOT a charged fluid, invariant photon-mass theory, cosmological fit,
or a validated alternate gravity mechanism.

Dependencies: numpy, scipy (for accurate ODE integration and stationary solve).
"""
from __future__ import annotations
import argparse
import csv
import json
from dataclasses import asdict, dataclass
from pathlib import Path
import numpy as np
from scipy.integrate import solve_ivp
from scipy.ndimage import map_coordinates
from scipy.sparse.linalg import LinearOperator, cg


@dataclass(frozen=True)
class Parameters:
    length: float = 32.0
    nodes: int = 128
    chi: float = 1.0
    kappa: float = 0.8
    scalar_mass_sq: float = 1.0
    scalar_background: float = 1.0
    coupling_density: float = 3.0
    density_peak: float = 4.0
    slab_sigma: float = 1.0
    a: float = 0.12
    b: float = 0.18
    slab_mass: float = 70.0
    pulse_center: float = -10.0
    pulse_sigma: float = 1.8
    pulse_k: float = 2.5
    pulse_amplitude: float = 0.12
    t_final: float = 18.0


class MovingInterface:
    def __init__(self, p: Parameters):
        self.p = p
        self.dx = p.length / p.nodes
        self.x = np.arange(p.nodes) * self.dx - p.length / 2
        self.k = 2 * np.pi * np.fft.fftfreq(p.nodes, d=self.dx)

    def d(self, f):
        return np.fft.ifft((1j * self.k) * np.fft.fft(f)).real

    def dd(self, f):
        return np.fft.ifft(-(self.k**2) * np.fft.fft(f)).real

    def density(self, X):
        p = self.p
        angle = np.pi * (self.x - X) / p.length
        weight = p.length**2 / (2 * np.pi**2 * p.slab_sigma**2)
        n = p.density_peak * np.exp(-weight * np.sin(angle)**2)
        nx = -n * p.length / (np.pi * p.slab_sigma**2) * np.sin(angle) * np.cos(angle)
        return n, nx

    def stationary_scalar(self, X=0.0):
        p = self.p
        n, _ = self.density(X)
        potential = p.scalar_mass_sq + p.coupling_density * n
        operator = LinearOperator((p.nodes,p.nodes), matvec=lambda psi:
            -p.kappa*self.dd(psi)+potential*psi, dtype=float)
        psi, status = cg(operator, np.full(p.nodes, p.scalar_mass_sq*p.scalar_background),
                         rtol=3e-13, atol=1e-13, maxiter=3000)
        if status:
            raise RuntimeError(f'Equilibrium solver failed: {status}')
        return psi

    def initial_state(self, velocity=0.035, amplitude=None):
        p = self.p
        amp = p.pulse_amplitude if amplitude is None else amplitude
        psi = self.stationary_scalar(0.0)
        psix = self.d(psi)
        envelope = np.exp(-0.5*((self.x-p.pulse_center)/p.pulse_sigma)**2)
        A = amp * envelope * np.sin(p.pulse_k * (self.x-p.pulse_center))
        Ax = self.d(A)
        epsilon = np.exp(p.a * psi)
        mu = np.exp(p.b * psi)
        speed = 1/np.sqrt(epsilon * mu)
        piA = -epsilon * speed * Ax
        piPsi = -p.chi * velocity * psix
        return np.r_[A, piA, psi, piPsi, 0.0, p.slab_mass * velocity]

    def unpack(self, y):
        n = self.p.nodes
        return y[:n], y[n:2*n], y[2*n:3*n], y[3*n:4*n], float(y[4*n]), float(y[4*n+1])

    def rhs(self, t, y):
        p=self.p
        A,piA,psi,piPsi,X,P=self.unpack(y)
        eps=np.exp(p.a*psi); invmu=np.exp(-p.b*psi)
        Ax=self.d(A)
        psix=self.d(psi)
        n,nx=self.density(X)
        dtA=piA/eps
        dtPiA=self.d(invmu*Ax)
        dtPsi=piPsi/p.chi
        dtPiPsi=(p.kappa*self.dd(psi)
                 -p.scalar_mass_sq*(psi-p.scalar_background)
                 -p.coupling_density*n*psi
                 +0.5*p.a*(piA**2)/eps
                 +0.5*p.b*invmu*Ax**2)
        dtX=P/p.slab_mass
        dtP=0.5*p.coupling_density*self.dx*np.sum(nx*psi**2)
        return np.r_[dtA,dtPiA,dtPsi,dtPiPsi,dtX,dtP]

    def budgets(self,y):
        p=self.p
        A,piA,psi,piPsi,X,P=self.unpack(y)
        eps=np.exp(p.a*psi); invmu=np.exp(-p.b*psi)
        n,_=self.density(X)
        Ax=self.d(A); psix=self.d(psi)
        Eem=self.dx*np.sum(0.5*piA**2/eps+0.5*invmu*Ax**2)
        Escalar=self.dx*np.sum(0.5*piPsi**2/p.chi+0.5*p.kappa*psix**2
                          +0.5*p.scalar_mass_sq*(psi-p.scalar_background)**2
                          +0.5*p.coupling_density*n*psi**2)
        Ematter=P**2/(2*p.slab_mass)
        Pfield=-self.dx*np.sum(piA*Ax+piPsi*psix)
        return dict(E_total=float(Eem+Escalar+Ematter),E_em=float(Eem),
                    E_scalar=float(Escalar), E_matter=float(Ematter),
                    P_total=float(P+Pfield),P_field=float(Pfield),P_matter=float(P),
                    slab_x=float(X), slab_v=float(P/p.slab_mass),
                    center_psi=float(psi[np.argmin(abs(self.x-X))]))

    def trace_ray(self, solution, initial_x=-7.5, times=None):
        """Post-process WKB right-going ray; not a measured spectrum.

        Uses the self-consistent scalar field and eikonal relation
        d log(omega)/dt = -(a+b)/2 * partial_t psi along the ray.
        """
        from scipy.integrate import solve_ivp
        p=self.p
        times=solution.t if times is None else np.asarray(times,dtype=float)
        gamma=0.5*(p.a+p.b)
        def sample(arr,x):
            fractional_index=(x-self.x[0])/self.dx
            return float(map_coordinates(arr,[[fractional_index]],order=3,mode="grid-wrap")[0])
        def ray_rhs(t,y):
            *_,psi,piPsi,_,_=self.unpack(solution.sol(t))
            localpsi=sample(psi,y[0]);localpsit=sample(piPsi/p.chi,y[0])
            return [float(np.exp(-gamma*localpsi)),float(-gamma*localpsit)]
        r=solve_ivp(ray_rhs,(float(times[0]),float(times[-1])),[initial_x,0.0],
                    t_eval=times,rtol=5e-9,atol=3e-10,max_step=0.045)
        if not r.success:raise RuntimeError(r.message)
        return r

    def solve(self, velocity=0.035, amplitude=None, final=None, points=181, rtol=2e-9,atol=1e-11):
        p=self.p
        tfinal = p.t_final if final is None else float(final)
        start=self.initial_state(velocity,amplitude)
        t_eval=np.linspace(0,tfinal,points)
        result=solve_ivp(self.rhs,(0,tfinal),start,method='DOP853',dense_output=True,t_eval=t_eval,
                         rtol=rtol,atol=atol)
        if not result.success:raise RuntimeError(result.message)
        budgets=[self.budgets(result.y[:,i]) for i in range(result.y.shape[1])]
        E=np.array([b['E_total'] for b in budgets]);P=np.array([b['P_total'] for b in budgets])
        return result,budgets,dict(max_relative_energy_drift=float(np.max(abs(E-E[0]))/max(1,abs(E[0]))),
                                  max_absolute_momentum_drift=float(np.max(abs(P-P[0]))),
                                  first=budgets[0],last=budgets[-1])


def write_outputs(output,model,velocity=0.035):
    out=Path(output);out.mkdir(parents=True,exist_ok=True)
    results={}
    for tag, vel, amp in [('moving_plus',velocity,None),('stationary',0.0,None),
                           ('moving_minus',-velocity,None),('no_light',velocity,0.0),
                           ('static_no_light',0.0,0.0)]:
        solution,budgets,stat=model.solve(velocity=vel,amplitude=amp)
        with (out/f'{tag}_budgets.csv').open('w',newline='') as f:
            writer=csv.DictWriter(f,fieldnames=['time']+list(budgets[0]));writer.writeheader()
            for t,b in zip(solution.t,budgets):writer.writerow({'time':float(t),**b})
        ray=model.trace_ray(solution)
        stat['ray']={'initial_x':float(ray.y[0,0]),'final_x':float(ray.y[0,-1]),
                     'final_log_frequency_ratio':float(ray.y[1,-1]),
                     'final_frequency_ratio':float(np.exp(ray.y[1,-1]))}
        with (out/f'{tag}_ray.csv').open('w',newline='') as f:
            writer=csv.writer(f);writer.writerow(['time','ray_x','ln_omega_ratio'])
            writer.writerows(zip(ray.t,ray.y[0],ray.y[1]))
        results[tag]=stat
        if tag=='moving_plus':
            with (out/'moving_plus_final_profile.csv').open('w',newline='') as f:
                writer=csv.writer(f);writer.writerow(['x','A','piA','psi','piPsi','rho'])
                A,piA,psi,piPsi,X,_=model.unpack(solution.y[:,-1]);rho,_=model.density(X)
                writer.writerows(zip(model.x,A,piA,psi,piPsi,rho))
    obj={'status':'synthetic dimensionless closed collective-coordinate system, NOT measured data',
         'parameters':asdict(model.p),'runs':results}
    (out/'run_summary.json').write_text(json.dumps(obj,indent=2)+'\n')
    return obj


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output-dir',default='docs/long-term-memory/research/moving-interface')
    parser.add_argument('--nodes',type=int,default=128)
    args=parser.parse_args()
    p=Parameters(nodes=args.nodes)
    summary=write_outputs(args.output_dir,MovingInterface(p))
    for key,v in summary['runs'].items():
        print(f'{key:14s} energy drift {v["max_relative_energy_drift"]:.3e} momentum drift {v["max_absolute_momentum_drift"]:.3e} slab x={v["last"]["slab_x"]:.5f}, v={v["last"]["slab_v"]:.6f} ray dlnw={v["ray"]["final_log_frequency_ratio"]:+.6e}')

if __name__=='__main__':main()
