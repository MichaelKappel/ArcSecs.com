import math

checks=[]
def ck(name,value,expected,rtol=1e-10):
 assert math.isclose(value,expected,rel_tol=rtol,abs_tol=1e-14),(name,value,expected)
 checks.append((name,value,expected,'PASS'))
ck('1 Mpc modulus',5*math.log10(1e6/10),25)
ck('exponential TOF at r=0.5',-math.log(.5)/(1-.5),2*math.log(2))
ck('fixed packet moving source arrival map', (1-(-.3))/(1-.2),1.625)
masskg=1e-18*1.602176634e-19/299792458**2; assert math.isclose(masskg,1.782661921e-54,rel_tol=1e-9,abs_tol=0); checks.append(('mass conversion kg',masskg,1.782661921e-54,'PASS'))
# tiny values exact stable formula and relative assertions rather than abs tolerance.
eps=1e-18/(4.135667696e-15*500e12); deficit=eps**2/(1+math.sqrt(1-eps**2)); assert 1.16e-37<deficit<1.18e-37
checks.append(('optical group deficit 500 THz',deficit,'1.16e-37..1.18e-37','PASS'))
deficit2=(2e-16)**2/(1+math.sqrt(1-(2e-16)**2)); assert 1.99e-32<deficit2<2.01e-32
checks.append(('fixed gap deficit z=1',deficit2,'2e-32','PASS'))
ratio=410.7e-18/1264.41;assert 3.24e-19<ratio<3.26e-19;checks.append(('CMB remnant ratio',ratio,'3.25e-19','PASS'))
ck('ideal collector force',2*5.348e-22*100*(220e3)**2,5.176864e-9,rtol=1e-8)
from scipy.integrate import quad
for q in (.01,.1,1,10): ck('Yukawa central integral q='+str(q),quad(lambda t:2*t*math.exp(-q*t),0,1)[0],2*(1-(1+q)*math.exp(-q))/q**2,1e-8)

for row in checks: print(*row, sep=" | ")
