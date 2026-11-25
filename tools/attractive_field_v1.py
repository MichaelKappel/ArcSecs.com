"""ArcSecs R41 bounded synthetic 1D source-coupled attractive scalar-field Hamiltonian.

A physical FIELD degree of freedom is posited, not a literal space/time substrate.
T is an evolution index. This is a mathematical toy, not empirical gravity.
"""
from dataclasses import dataclass
import numpy as np

@dataclass
class Particle:
    x: float
    p: float
    mass: float
    charge: float
    label: str = ''

class AttractiveField1D:
    def __init__(self, particles, length=96., n=384, speed=2., gap=0.15, width=0.3):
        self.parts=[Particle(float(p.x),float(p.p),float(p.mass),float(p.charge),p.label) for p in particles]
        self.length=float(length); self.n=int(n); self.dx=self.length/self.n
        self.x=np.arange(n)*self.dx-self.length/2
        self.k=np.fft.fftfreq(n,d=self.dx)*2*np.pi
        self.kgrad=self.k.copy()
        if n%2==0:self.kgrad[n//2]=0.
        self.width=float(width); self.window=np.exp(-0.5*(self.k*width)**2)
        self.speed=float(speed);self.gap=float(gap);self.t=0.
        self.phi=np.zeros(n);self.pi=np.zeros(n)
        self.initial_energy=self.energy();self.initial_momentum=self.momentum()

    def _spectrum(self,a):return np.fft.fft(a)/self.n
    def _smooth_charge(self):
        spec=np.zeros(self.n,dtype=complex)
        for p in self.parts:
            spec += p.charge/self.length * np.exp(-1j*self.k*p.x)*self.window
        return np.fft.ifft(self.n*spec).real
    def _deriv(self,a):return np.fft.ifft(1j*self.kgrad*np.fft.fft(a)).real
    def _d2(self,a):return np.fft.ifft(-(self.k**2)*np.fft.fft(a)).real
    def _effective_gradient(self,x):
        # derivative of interpolated band-limited physical field at a continuous point
        return float(np.sum(self._spectrum(self.phi)*(1j*self.kgrad)*self.window*np.exp(1j*self.k*x)).real)
    def forces(self):return np.array([p.charge*self._effective_gradient(p.x) for p in self.parts])
    def field_at(self,x):
        return float(np.sum(self._spectrum(self.phi)*self.window*np.exp(1j*self.k*x)).real)
    def _field_accel(self):return self.speed**2*self._d2(self.phi) -self.gap**2*self.phi + self._smooth_charge()
    def step(self,dt):
        dt=float(dt)
        if dt <= 0 or dt > self.dx/self.speed*.35:
            raise ValueError('invalid or overlarge timestep for documented resolution')
        a=self._field_accel(); f=self.forces()
        self.pi += .5*dt*a
        for p,fp in zip(self.parts,f):p.p+=.5*dt*fp
        self.phi += dt*self.pi
        for p in self.parts:p.x += dt*p.p/p.mass
        self.pi += .5*dt*self._field_accel()
        for p,fp in zip(self.parts,self.forces()):p.p+=.5*dt*fp
        self.t+=dt
    def energy(self):
        grad=self._deriv(self.phi);rho=self._smooth_charge()
        field=.5*self.dx*np.sum(self.pi**2+self.speed**2*grad**2+self.gap**2*self.phi**2)
        interaction=-self.dx*np.sum(self.phi*rho)
        kinetic=sum(p.p**2/(2*p.mass) for p in self.parts)
        return dict(total=float(field+interaction+kinetic),field=float(field),interaction=float(interaction),particles=float(kinetic))
    def momentum(self):
        pfield=-self.dx*np.sum(self.pi*self._deriv(self.phi))
        pparticles=sum(p.p for p in self.parts)
        return dict(total=float(pfield+pparticles),field=float(pfield),particles=float(pparticles))
    def evolve(self,duration,dt=.025,trace_dt=.5):
        trace=[];steps=int(np.ceil(duration/dt));stride=max(1,int(round(trace_dt/dt)))
        for i in range(steps+1):
            if i%stride==0 or i==steps:
                e=self.energy();mom=self.momentum()
                trace.append({'T':round(self.t,6),'energy_total':e['total'],'energy_field':e['field'],'energy_interaction':e['interaction'],'momentum_total':mom['total'],'momentum_field':mom['field'],'momentum_particles':mom['particles'],'x_receiver':self.parts[0].x,'p_receiver':self.parts[0].p,'force_receiver':self.forces()[0]})
            if i<steps:self.step(dt)
        return trace

if __name__=='__main__':
    import json
    m=AttractiveField1D([Particle(0,0,1000,1,'inside-receiver'),Particle(12,0,1000,1,'hypothetical-exterior-source')])
    tr=m.evolve(8)
    print(json.dumps({'samples':[dict(T=r['T'],force=r['force_receiver'],momentum_error=r['momentum_total']-m.initial_momentum['total'],energy_error=r['energy_total']-m.initial_energy['total']) for r in tr[::2]],'end':tr[-1]},indent=2))
