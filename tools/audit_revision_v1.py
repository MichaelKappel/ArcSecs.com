"""Audit checks for main-book claims only; no changes to protected Review 3.0."""
from decimal import Decimal, localcontext
import math
from tools.entrained_outflow_v1 import Outflow

def bath_band_high_precision(e='1e-8', y='0.5', h='0', arcseconds='1'):
    with localcontext() as ctx:
        ctx.prec=65
        e,y,h,a=map(Decimal,(e,y,h,arcseconds))
        pi=Decimal('3.1415926535897932384626433832795028841971693993751058209749445923')
        x=a*pi/Decimal(1296000)
        # Taylor expansion for small-angle sine, with explicit convergence.
        term=x; sine=x; n=1
        while True:
            term *= -x*x/Decimal((2*n)*(2*n+1))
            old=sine; sine+=term; n+=1
            if old==sine:break
        p=(1-e*e).sqrt(); r=((1-y)**2-e*e).sqrt(); d=y*(2-y)/(p+r)
        w=(y*y-h*h).sqrt()
        lo=w/(d*d+4*p*r*sine*sine).sqrt(); hi=w/d
        return lo,hi

def outflow_frames(gap,z=1):
    m=Outflow(gap=gap); chi=m.chi_at_z(0,z); ta=m.arrival(0,chi); K=m.K(0)
    rel=m.C**2*K/(m.S(ta)*m.W(ta,K)); u=m.H*m.S(ta)*chi
    return rel/m.C,u/m.C,(rel+u)/m.C

if __name__=='__main__':
    lo,hi=bath_band_high_precision();print('BS3 beta min/max:',lo,hi)
    with localcontext() as c:
        c.prec=60;print('Upper deficit:',1-hi)
    for g in [0,.01,.1,.2,.3]:print('OF5',g,*outflow_frames(g))
