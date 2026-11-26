"""Independent DOP853 benchmark; regenerate using numpy/scipy, not the JS solver.
Adiabatic reference integrates gas energy as an independent state. Moving shell
uses angular quadrature of the Yukawa kernel for potential and force.
"""
import json, math
from pathlib import Path
import numpy as np
from scipy.integrate import solve_ivp, quad
P=math.pi
base=dict(radius=3,mass=40,velocity=0,tension=.2,insidePressure=.5,outsidePressure=.1,gamma=1.4,duration=2,steps=2000)
move=dict(radius=3,mass=40,velocity=0,tension=.05,pressure=.05,gm=5,range=2,shellVelocity=-.5,duration=2,steps=2000)
fixtures=[]
for changes in ({},{'insidePressure':.04,'duration':.5},{'velocity':.2,'gamma':5/3},{'outsidePressure':0,'tension':0},{'radius':2,'insidePressure':.4,'outsidePressure':.2,'tension':.2}):
 p={**base,**changes};r0=p['radius'];g=p['gamma'];vol=lambda r:4*P*r**3/3
 def rhs(t,y):
  r,v,U=y;pressure=(g-1)*U/vol(r); area=4*P*r*r
  return [v,(area*(pressure-p['outsidePressure'])-8*P*p['tension']*r)/p['mass'],-pressure*area*v]
 sol=solve_ivp(rhs,[0,p['duration']],[r0,p['velocity'],p['insidePressure']*vol(r0)/(g-1)],method='DOP853',rtol=1e-12,atol=1e-13,dense_output=True)
 assert sol.success
 rows=[]
 for t in np.linspace(0,p['duration'],11):
  r,v,U=sol.sol(t);rows.append(dict(t=t,radius=r,velocity=v,gasEnergy=U,pressure=(g-1)*U/vol(r)))
 fixtures.append(dict(model='adiabatic',params=p,rows=rows))
for changes in ({},{'shellVelocity':.5},{'shellVelocity':0},{'gm':0},{'range':.5,'duration':1},{'radius':2,'pressure':0,'tension':0,'velocity':.1}):
 p={**move,**changes};m=p['mass'];l=p['range'];gm=p['gm'];u=p['shellVelocity']
 def rhs(t,y):
  r,v,w=y;a=10+u*t
  def vals(mu):
   d=math.sqrt(a*a+r*r-2*a*r*mu);kern=math.exp(-d/l)/d;grad=kern*(1/l+1/d)/d
   return grad*(r-a*mu),grad*(a-r*mu)
  acc=-gm/2*quad(lambda mu:vals(mu)[0],-1,1,epsabs=1e-12)[0];dphida=gm/2*quad(lambda mu:vals(mu)[1],-1,1,epsabs=1e-12)[0]
  return [v,(4*P*r*r*p['pressure']-8*P*r*p['tension'])/m+acc,m*dphida*u]
 sol=solve_ivp(rhs,[0,p['duration']],[p['radius'],p['velocity'],0],method='DOP853',rtol=1e-12,atol=1e-13,dense_output=True);assert sol.success
 rows=[]
 for t in np.linspace(0,p['duration'],11):
  r,v,w=sol.sol(t);rows.append(dict(t=t,radius=r,velocity=v,externalWork=w))
 fixtures.append(dict(model='movingShell',params=p,rows=rows))
Path(__file__).with_name('dynamic-reference.json').write_text(json.dumps({'method':'SciPy DOP853; independent gas energy state and angular Yukawa quadrature','fixtures':fixtures},indent=2)+'\n')
