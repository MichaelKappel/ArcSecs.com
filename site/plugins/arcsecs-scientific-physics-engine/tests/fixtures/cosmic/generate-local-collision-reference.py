"""Independent DOP853 integration of the semi-discrete Hamiltonian, including flux as a state."""
import json
from pathlib import Path
import numpy as np
from scipy.integrate import solve_ivp
base=dict(initialState=1,separation=12,wallSpeed=.5,amplitude=.25,duration=22,dt=.01,resolution=512)
cases=[]
for name, overrides in [('collision',{}),('pulse',dict(initialState=2,duration=10)),('stationary',dict(wallSpeed=0,duration=6)),('vacuum',dict(initialState=0,duration=4)),('fast',dict(separation=8,wallSpeed=.7,duration=12))]:
    p=base|overrides;n=p['resolution'];dx=64/n;x=np.arange(n)*dx-32;d=p['separation'];v=p['wallSpeed'];w=np.sqrt(2*(1-v*v));f=np.full(n,-1.);vel=np.zeros(n)
    if p['initialState']==1:
        a=np.tanh((x+d/2)/w);b=np.tanh((x-d/2)/w);f=a-b-1;vel=-v/w*(2-a*a-b*b)
    elif p['initialState']==2:
        r=(x+d/2)/1.5;f+=p['amplitude']*np.maximum(0,1-r*r)**3
    lo=n//2-round(2/dx);hi=n//2+round(2/dx)-1
    def flux(f,vel):
        j=-(vel+np.roll(vel,-1))*(np.roll(f,-1)-f)/(2*dx)
        return j[lo-1]-j[hi]
    def rhs(t,y):
        f,vel=y[:n],y[n:2*n];return np.r_[vel,(np.roll(f,1)+np.roll(f,-1)-2*f)/dx**2+f-f**3,flux(f,vel)]
    # Align reference samples with the browser's sampling cadence.
    steps=round(p['duration']/p['dt']);stride=max(1,int(np.ceil(steps/240)));times=np.arange(0,steps+1,stride)*p['dt'];times=np.unique(np.r_[times,p['duration']]);times=times[times<=p['duration']+1e-10];times[-1]=p['duration']
    sol=solve_ivp(rhs,(0,p['duration']),np.r_[f,vel,0.],method='DOP853',t_eval=times,rtol=2e-11,atol=2e-12,max_step=.05);assert sol.success
    rows=[]
    for t,y in zip(sol.t,sol.y.T):
        f,vel=y[:n],y[n:2*n];k=vel**2/2;bond=(np.roll(f,-1)-f)**2/(2*dx**2);grad=(bond+np.roll(bond,1))/2;pot=(f*f-1)**2/4;total=(k+grad+pot)*dx
        rows.append(dict(t=t,centerField=f[n//2],centralEnergy=total[lo:hi+1].sum(),totalEnergy=total.sum(),kineticEnergy=k.sum()*dx,gradientEnergy=grad.sum()*dx,potentialEnergy=pot.sum()*dx,inwardFlux=flux(f,vel),integratedInwardFlux=y[-1]))
    cases.append(dict(name=name,parameters=p,rows=rows,finalField=sol.y[:n,-1].tolist()))
Path(__file__).with_name('local-collision-reference.json').write_text(json.dumps(dict(source='Independent SciPy DOP853, same semidiscrete lattice, not a continuum or observational reference',cases=cases),indent=2)+'\n')
