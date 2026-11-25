import unittest,math
import numpy as np
from scipy.integrate import quad
from scipy.stats import binom
from tools.bath_recoil_v1 import *

class BathRecoil(unittest.TestCase):
    def test_momentum_difference(self):
        p,r,d=momenta(.1,.2);self.assertAlmostEqual(d,p-r,15)
    def test_domain(self):
        with self.assertRaises(ValueError):momenta(.1,.9)
    def test_event_energy(self):
        self.assertLess(event(.01,.5,.9)['energy_error'],1e-14)
    def test_event_momentum(self):
        self.assertLess(event(.01,.5,.9)['q_error'],1e-14)
    def test_gapped_event(self):
        self.assertLess(event(.01,.5,.8,.1)['energy_error'],1e-14)
    def test_invalid_bath_gap(self):
        with self.assertRaises(ValueError):event(.01,.5,.8,.5)
    def test_too_slow(self):
        with self.assertRaises(ValueError):event(.01,.5,.1)
    def test_too_fast(self):
        with self.assertRaises(ValueError):event(.1,.5,.9999)
    def test_forward_bound(self):
        _,b=allowed_band(.1,.5);self.assertLess(event(.1,.5,b)['angle'],1e-7)
    def test_reverse_bound(self):
        b,_=allowed_band(.1,.5);self.assertAlmostEqual(event(.1,.5,b)['angle'],math.pi,7)
    def test_arcsecond(self):
        a=math.pi/648000;b,_=allowed_band(1e-4,.5,angle=a);self.assertAlmostEqual(event(1e-4,.5,b)['angle']/a,1,places=4)
    def test_gapless_threshold(self):
        b=.9;e=1/threshold(b);self.assertAlmostEqual(qmax_gapless(e,b),0,13)
    def test_below_threshold(self):self.assertEqual(qmax_gapless(.8,.9),0.)
    def test_max_transfer(self):
        e=.1;b=.9;q=qmax_gapless(e,b);p=math.sqrt(1-e*e);self.assertAlmostEqual(math.hypot(p-q,e)+b*q,1,13)
    def test_above_threshold(self):self.assertGreater(qmax_gapless(.01,.9),0.)
    def test_scalar_phase_space(self):
        l,u,g,power=scalar_rate(.1,.9,.05,g=.001);self.assertGreater(g,0);self.assertGreater(u,l);self.assertLess(u,.9)
    def test_phase_space_closed(self):self.assertIsNone(allowed_y_interval(.4,.99,.005))
    def test_scalar_band_endpoints(self):
        l,u=allowed_y_interval(.1,.9,.05)
        for y in [l,u]:self.assertLess(event(.1,y,.9,.05)['energy_error'],1e-12)
    def test_scalar_rate_quad(self):
        e,b,h,g=.1,.9,.05,.001;l,u,rate,power=scalar_rate(e,b,h,g)
        ql,qu=[math.sqrt(y*y-h*h)/b for y in (l,u)];pref=g*g/(16*math.pi*math.sqrt(1-e*e))
        self.assertAlmostEqual(rate,pref*quad(lambda q:q/math.hypot(b*q,h),ql,qu)[0],18)
        self.assertAlmostEqual(power,pref*quad(lambda q:q,ql,qu)[0],18)
    def test_scalar_rate_coupling(self):
        self.assertAlmostEqual(scalar_rate(.1,.9,.05,2)[2]/scalar_rate(.1,.9,.05,1)[2],4)
    def test_scalar_band_forbidden_outside(self):
        l,u=allowed_y_interval(.1,.9,.05)
        with self.assertRaises(ValueError):event(.1,(h:=.05)+(l-h)/2,.9,h)
    def test_cascade_one(self):
        a,r=cascade(.01,.9,1);self.assertAlmostEqual(r,2*math.sin(a[0]/2),14)
    def test_cascade_decreases(self):self.assertLess(cascade(.01,.9,64)[1],cascade(.01,.9,16)[1])
    def test_cascade_monte_carlo(self):
        a,r=cascade(.01,.9,16);mc,se=monte_carlo(a);self.assertLess(abs(mc*mc-r*r),5*se)
    def test_line_mean(self):self.assertAlmostEqual(line_stats(100)[1],.5,14)
    def test_line_variance(self):
        n=8;f,m,r,_=line_stats(n);k=np.arange(n+1);prob=binom.pmf(k,n,.5);x=(1-f)**k
        self.assertAlmostEqual(np.dot(prob,x),m,14);self.assertAlmostEqual(np.sqrt(np.dot(prob,(x-m)**2))/m,r,14)
    def test_line_decreases(self):self.assertLess(line_stats(10000)[2],line_stats(100)[2])
    def test_deterministic_control(self):self.assertEqual(line_stats(10,1)[2],0.)
    def test_line_minimum(self):self.assertGreater(line_stats(1000)[3],.24)
if __name__=='__main__':unittest.main()
