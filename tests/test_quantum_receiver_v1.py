"""Chapter 30N: autonomous 1D transverse two-level receiver benchmark tests.

These do not certify a full 3D charged massive-vector/longitudinal theory.
"""
import sys,unittest
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from quantum_receiver_v1 import Params,ReceiverModel,metrics,atom_gap_and_gradient,perturbation_line_derivative,D0,S0

class TestQuantumReceiverAnalytic(unittest.TestCase):
 def setUp(self):
  self.p=Params(N=12,t_end=9.,sample_count=61)
  self.m=ReceiverModel(self.p)
  self.y=self.m.initial()
 def test_reference_line_anchor(self):
  d,_,s=atom_gap_and_gradient(0.)
  self.assertAlmostEqual(d,D0)
  self.assertAlmostEqual(s,S0)
 def test_gap_positive_near_reference(self):
  for psi in [-.2,0.,.04,.1,.2]:
   self.assertGreater(atom_gap_and_gradient(psi)[0],0.)
 def test_gap_gradient_finite_difference(self):
  for psi in [-.1,0.,.04,.16]:
   h=1e-5
   num=(atom_gap_and_gradient(psi+h)[0]-atom_gap_and_gradient(psi-h)[0])/(2*h)
   self.assertAlmostEqual(num,atom_gap_and_gradient(psi)[1],delta=2e-9)
 def test_smoothing_cutoff(self):
  self.assertLess(self.m.weight[-1],self.m.weight[0])
 def test_positive_transverse_mode_energy(self):
  eps,C,*_=self.m.operators(self.y)
  self.assertGreater(eps,0.)
  self.assertTrue(np.all(C>0))
 def test_match_gap(self):
  eps,C,*_=self.m.operators(self.y)
  k=self.m.k
  theta=self.p.lam*self.p.initial_psi
  np.testing.assert_allclose(C/eps,np.exp(-2*theta)*k*k+self.p.omega0**2,rtol=1e-14)
 def test_initial_source_is_coherent_receiver_ground(self):
  np.testing.assert_allclose(self.y[6:12],[1,0,0,0,0,1])
 def test_rhs_preserves_bloch_norm_instantaneously(self):
  y=self.y.copy();y[7]=.2;y[8]=.15;y[9]=.1;y[10]=-.2
  d=self.m.rhs(0.,y)
  for offset in [6,9]:
   self.assertAlmostEqual(float(np.dot(y[offset:offset+3],d[offset:offset+3])),0.,places=12)
 def test_scalar_force_is_minus_energy_gradient(self):
  y=self.y.copy();y[0]=.06;y[8]=-.2;y[11]=.8
  y[14]=.012;y[14+2*self.p.N]=.015
  h=1e-5
  yp=y.copy();ym=y.copy();yp[0]+=h;ym[0]-=h
  dEdpsi=(self.m.invariants(yp)[0]-self.m.invariants(ym)[0])/(2*h)
  self.assertAlmostEqual(self.m.rhs(0.,y)[1],-dEdpsi,delta=5e-9)
 def test_center_force_is_minus_energy_gradient(self):
  y=self.y.copy();y[14]=.015;y[14+self.p.N]=-.022
  h=2e-5
  yp=y.copy();ym=y.copy();yp[2]+=h;ym[2]-=h
  dx=(self.m.invariants(yp)[0]-self.m.invariants(ym)[0])/(2*h)
  self.assertAlmostEqual(self.m.rhs(0.,y)[4],-dx,delta=2e-9)
 def test_mode_forces_are_energy_gradients(self):
  y=self.y.copy();y[14]=.008;y[14+2*self.p.N]=.005
  h=1e-5
  yp=y.copy();ym=y.copy();yp[14]+=h;ym[14]-=h
  dH=(self.m.invariants(yp)[0]-self.m.invariants(ym)[0])/(2*h)
  self.assertAlmostEqual(self.m.rhs(0.,y)[14+2*self.p.N],-dH,delta=2e-9)
 def test_zero_field_source_has_initial_nonzero_field_force(self):
  self.assertGreater(abs(self.m.rhs(0.,self.y)[14+2*self.p.N]),0.)
 def test_zero_coupled_receiver_ground_initial(self):
  m=ReceiverModel(Params(N=12,g_receiver=0.));y=m.initial()
  r=m.rhs(0.,y)
  np.testing.assert_allclose(r[9:12],0.,atol=1e-15)
 def test_no_seed_classical_spontaneous_emission(self):
  m=ReceiverModel(Params(N=12));y=m.initial();y[6:9]=[0.,0.,-1.]
  dy=m.rhs(0.,y)
  self.assertAlmostEqual(float(np.linalg.norm(dy[14+2*m.p.N:14+4*m.p.N])),0.)

class TestQuantumReceiverIntegration(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.rows={n:metrics(Params(N=n,t_end=22.,sample_count=151)) for n in [24,48,96]}
 def test_energy_closure(self):
  for row in self.rows.values():self.assertLess(row['energy_rel_drift'],2e-9)
 def test_momentum_closure(self):
  for row in self.rows.values():self.assertLess(row['momentum_abs_drift'],1e-8)
 def test_spin_norm(self):
  for row in self.rows.values():self.assertLess(row['max_bloch_norm_drift'],1e-9)
 def test_receiver_responds(self):
  self.assertGreater(self.rows[48]['peak_receiver'],1e-7)
 def test_cutoff_converges_with_fixed_smearing(self):
  a=self.rows[48]['peak_receiver'];b=self.rows[96]['peak_receiver']
  self.assertLess(abs(a-b)/b,2e-4)
 def test_scalar_evolves(self):
  self.assertGreater(self.rows[48]['max_psi']-self.rows[48]['min_psi'],.005)
 def test_mobile_center_recoils(self):
  self.assertGreater(self.rows[48]['largest_center_motion'],1e-10)
 def test_receiver_coupling_control(self):
  r=metrics(Params(N=24,g_receiver=0.,t_end=18.,sample_count=101))
  self.assertLess(r['peak_receiver'],1e-13)
 def test_source_coupling_control(self):
  r=metrics(Params(N=24,g_source=0.,t_end=18.,sample_count=101))
  self.assertLess(r['peak_receiver'],1e-13)
 def test_no_scalar_coupling_holds_field_constant(self):
  r=metrics(Params(N=24,lam=0.,t_end=18.,sample_count=101))
  self.assertAlmostEqual(r['max_gap'],D0,places=12)
 def test_resonant_response_exceeds_large_positive_detuning(self):
  baseline=metrics(Params(N=24,detune=0.,t_end=45.))['peak_receiver']
  off=metrics(Params(N=24,detune=.12,t_end=45.))['peak_receiver']
  self.assertGreater(baseline,off)

if __name__=='__main__':unittest.main()
