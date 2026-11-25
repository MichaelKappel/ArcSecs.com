"""A-05j static charge + hydrogenic Yukawa spectrum: conditional benchmarks."""
import sys, unittest
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from massive_charge_atom_v1 import (
 density_current_fourier,gauss_potential_mode,yukawa_kernel,
 yukawa_radial_force,F1s,F2s,F2p,perturbation,radial_eigenvalues,
 ratios,param_scaling,scaled_line)

class TestChargeField(unittest.TestCase):
 def setUp(self):
  self.k=np.array([1.13,-2.1,.57]);self.q=np.array([1.,-1.,.5])
  self.r=np.array([[0.,.5,-.3],[.7,0.,.2],[-.6,.1,.4]])
  self.v=np.array([[.12,-.08,.04],[-.04,.17,.01],[.06,.01,-.11]])
 def test_continuity_complex(self):
  rho,j,drho=density_current_fourier(self.r,self.v,self.q,self.k,.3)
  self.assertLess(abs(drho+1j*self.k@j),2e-14)
 def test_continuity_varied_modes(self):
  for k in [np.zeros(3),self.k,4*self.k,np.array([0.,0.,7.])]:
   rho,j,drho=density_current_fourier(self.r,self.v,self.q,k,.22)
   self.assertLess(abs(drho+1j*k@j),3e-14)
 def test_continuity_translation(self):
  for shift in [[.4,-.9,1.2],[0.,0.,0.]]:
   rho,j,drho=density_current_fourier(self.r+shift,self.v,self.q,self.k,.1)
   self.assertLess(abs(drho+1j*self.k@j),2e-14)
 def test_continuity_finite_difference(self):
  dt=2e-5
  rho,j,d=density_current_fourier(self.r,self.v,self.q,self.k,.2)
  plus=density_current_fourier(self.r+dt*self.v,self.v,self.q,self.k,.2)[0]
  minus=density_current_fourier(self.r-dt*self.v,self.v,self.q,self.k,.2)[0]
  self.assertLess(abs((plus-minus)/(2*dt)-d),1e-8)
 def test_zero_velocity_no_current(self):
  rho,j,d=density_current_fourier(self.r,np.zeros_like(self.v),self.q,self.k,.2)
  self.assertEqual(d,0j);self.assertLess(np.linalg.norm(j),1e-13)
 def test_zero_mode_net_charge(self):
  rho,j,d=density_current_fourier(self.r,self.v,self.q,np.zeros(3),.2)
  self.assertAlmostEqual(rho.real,sum(self.q));self.assertAlmostEqual(d.real,0.)
 def test_gauss_all_modes(self):
  for k in [np.zeros(3),self.k,10*self.k]:
   rho,_,_=density_current_fourier(self.r,self.v,self.q,k,.1)
   phi=gauss_potential_mode(rho,k,2.,.25)
   self.assertLess(abs((2*np.dot(k,k)+.25)*phi-rho),1e-14)
 def test_gauss_requires_positive(self):
  with self.assertRaises(AssertionError):gauss_potential_mode(1.,self.k,1.,0.)
 def test_static_yukawa_decreases(self):
  self.assertGreater(yukawa_kernel(.2,3.),yukawa_kernel(1.,3.))
 def test_yukawa_force_derivative(self):
  r=.8;h=1e-5;ell=2.7
  approximate=-(yukawa_kernel(r+h,ell)-yukawa_kernel(r-h,ell))/(2*h)
  self.assertAlmostEqual(approximate,yukawa_radial_force(r,ell),places=9)
 def test_coulomb_limit(self):
  r=.9;val=yukawa_kernel(r,1e10)
  self.assertAlmostEqual(val,1/(4*np.pi*r),places=9)
 def test_repulsion_attraction(self):
  f=yukawa_radial_force(2.,1.5,qa=1.,qb=1.)
  self.assertGreater(f,0.)
  self.assertAlmostEqual(yukawa_radial_force(2.,1.5,qa=1.,qb=-1.),-f)

class TestAtomicBenchmark(unittest.TestCase):
 def test_unscreened_perturbation(self):
  np.testing.assert_allclose(perturbation(0.),[-1.,-.25,-.25],atol=1e-14)
 def test_unscreened_integrals(self):
  self.assertAlmostEqual(F1s(0.),1.);self.assertAlmostEqual(F2s(0.),.25)
  self.assertAlmostEqual(F2p(0.),.25)
 def test_first_order_small_screening(self):
  s=.001;self.assertAlmostEqual(perturbation(s)[0]+1.,2*s,delta=1e-5)
 def test_2p_2s_splitting_is_quadratic_small_s(self):
  spl1=ratios(perturbation(.004))[2];spl2=ratios(perturbation(.008))[2]
  self.assertGreater(spl1,0.);self.assertAlmostEqual(spl2/spl1,4.,delta=.2)
 def test_unscreened_numerical(self):
  e=radial_eigenvalues(0.,nodes=4000)
  self.assertLess(abs(e[0]+1.),7e-5)
  self.assertLess(abs(e[1]+.25),1e-5)
  self.assertLess(abs(e[2]+.25),1e-5)
 def test_spectral_line_decreases_under_screening(self):
  a=ratios(radial_eigenvalues(.01,nodes=1600))[0]
  b=ratios(radial_eigenvalues(.10,nodes=1600))[0]
  self.assertGreater(a,b)
 def test_2p_2s_splitting_positive_when_screened(self):
  self.assertGreater(ratios(radial_eigenvalues(.05,nodes=3000))[2],0.)
 def test_2p_2s_refines(self):
  # The observed second-order convergence is a test of a *static* radial solver only.
  vals=[ratios(radial_eigenvalues(.05,nodes=n))[2] for n in (600,1200,2400)]
  self.assertLess(abs(vals[2]-vals[1]),abs(vals[1]-vals[0])*.30)
 def test_1s_2p_refines(self):
  vals=[ratios(radial_eigenvalues(.05,nodes=n))[0] for n in (600,1200,2400)]
  self.assertLess(abs(vals[2]-vals[1]),abs(vals[1]-vals[0])*.30)
 def test_richardson_extrapolated(self):
  v4=ratios(radial_eigenvalues(.05,nodes=4800))[0]
  v8=ratios(radial_eigenvalues(.05,nodes=9600))[0]
  v14=ratios(radial_eigenvalues(.05,nodes=14400))[0]
  # Extrapolate O(h²); n+1 is exact for h.
  h8=60/9601;h14=60/14401
  pred=(v14*h8*h8-v8*h14*h14)/(h8*h8-h14*h14)
  self.assertLess(abs(pred-v14),7e-6)
  self.assertLess(abs(v14-v8),abs(v8-v4))
 def test_first_order_agrees_weak(self):
  e=ratios(radial_eigenvalues(.02,nodes=4000))[0]
  p=ratios(perturbation(.02))[0]
  self.assertLess(abs(e-p),1.1e-4)
 def test_first_order_departs_at_larger_s(self):
  e=ratios(radial_eigenvalues(.1,nodes=4000))[0]
  p=ratios(perturbation(.1))[0]
  self.assertGreater(abs(e-p),1e-3)
 def test_mass_scaling_model(self):
  a,b=param_scaling(.2,q_mass=1.,s0=.05)
  self.assertAlmostEqual(a,np.exp(-.2));self.assertAlmostEqual(b,.05*np.exp(.2))
 def test_q_two_s_constant_line(self):
  e0=scaled_line(0.,q_mass=2.,s0=.03,nodes=1200)
  e1=scaled_line(.3,q_mass=2.,s0=.03,nodes=1200)
  self.assertAlmostEqual(e0,e1,places=11)
 def test_q_zero_line_changes(self):
  e0=scaled_line(0.,q_mass=0.,s0=.03,nodes=1200)
  e1=scaled_line(.2,q_mass=0.,s0=.03,nodes=1200)
  self.assertGreater(e0,e1)

if __name__=='__main__':unittest.main()
