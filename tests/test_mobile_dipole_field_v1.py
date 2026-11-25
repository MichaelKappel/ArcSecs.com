"""Finite-mode consistency tests for A-05g. No empirical validation inferred."""
import sys, unittest
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from mobile_dipole_field_v1 import Params, MobileDipoleField

class TestMobileDipoleField(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sim=MobileDipoleField(Params(K=7,N=80,duration=3,output_count=41))
        cls.y=cls.sim.initial()
        cls.sol,cls.inv,cls.diag=cls.sim.run(t_end=3)
    def test_autonomous(self):
        np.testing.assert_allclose(self.sim.rhs(0,self.y),self.sim.rhs(19,self.y),rtol=0,atol=0)
    def test_initial_energy_positive(self):
        self.assertGreater(self.inv[0,0],0)
    def test_invariant_energy(self):
        self.assertLess(np.max(np.abs(self.inv[:,0]-self.inv[0,0])),2e-9)
    def test_invariant_momentum(self):
        self.assertLess(np.max(np.abs(self.inv[:,1]-self.inv[0,1])),2e-9)
    def test_translation_invariance_H(self):
        for d in [.01,.55,1.9]:
            self.assertAlmostEqual(self.sim.invariants(self.sim.shift(self.y,d))[0],self.sim.invariants(self.y)[0],places=11)
    def test_translation_invariance_P(self):
        self.assertAlmostEqual(self.sim.invariants(self.sim.shift(self.y,.71))[1],self.sim.invariants(self.y)[1],places=11)
    def test_translation_covariant_rhs(self):
        shifted=self.sim.shift(self.y,.42)
        derivative_shifted=self.sim.rhs(0,shifted)
        expected=self.sim.shift(self.sim.rhs(0,self.y),.42)
        # A state vector has positions X, whose tangent derivatives are not shifted by delta.
        expected[4*self.sim.d:4*self.sim.d+2]-=.42
        np.testing.assert_allclose(derivative_shifted,expected,rtol=0,atol=1e-11)
    def test_screened_profile_is_solved(self):
        _,_,psi,_,X,_,q,_=self.sim.split(self.y)
        p=self.sim.p
        B,_=self.sim.particle_basis(X)
        r=(p.scalar_mass2*np.r_[p.scalar_bg,np.zeros(self.sim.d-1)]
           -(p.scalar_mass2*np.eye(self.sim.d)-p.scalar_speed2*self.sim.D2)@psi)
        for i in range(2):
            r-=(p.screen*(B[i]@psi)+.5*p.spring*p.spring_scalar*q[i]**2)*(B[i]*self.sim.weights)
        self.assertLess(np.linalg.norm(r),1e-11)
    def test_wave_positivity(self):
        for y in self.sol.y.T:
            psi=self.sim.B@self.sim.split(y)[2]
            self.assertGreater((1-self.sim.p.electric_response*psi).min(),0)
            self.assertGreater((1-self.sim.p.magnetic_response*psi).min(),0)
    def test_zero_emission_zero_receiver(self):
        _,_,diag=self.sim.run(excit=0,t_end=3)
        self.assertLess(max(abs(r['q_receiver']) for r in diag),1e-14)
    def test_no_radiation_no_receiver(self):
        from dataclasses import replace
        sim=MobileDipoleField(replace(self.sim.p,charge=0))
        _,_,diag=sim.run(t_end=3)
        self.assertLess(max(abs(r['q_receiver']) for r in diag),1e-14)
    def test_mobile_center_recoil(self):
        _,_,diag=self.sim.run(speed1=0,speed2=0,t_end=3)
        self.assertGreater(abs(diag[-1]['v_source']),1e-7)
    def test_local_calibration_finite(self):
        self.assertTrue(all(np.isfinite(v['local_frequency_ratio']) and v['local_frequency_ratio']>0 for v in self.diag))
    def test_canonical_qdot(self):
        a,pi,psi,pp,X,pX,q,pq=self.sim.split(self.y)
        B,_=self.sim.particle_basis(X)
        rhs=self.sim.rhs(0,self.y)
        qd=rhs[4*self.sim.d+4:4*self.sim.d+6]
        np.testing.assert_allclose(qd,(pq-self.sim.p.charge*(B@a))/self.sim.p.internal_mass)
    def test_energy_generator(self):
        # Numerical directional derivative of H along its own vector field.
        v=self.sim.rhs(0,self.y); h=1e-6
        Eplus=self.sim.invariants(self.y+h*v)[0]
        Eminus=self.sim.invariants(self.y-h*v)[0]
        self.assertLess(abs((Eplus-Eminus)/(2*h)),1e-8)
    def test_momentum_generator(self):
        v=self.sim.rhs(0,self.y); h=1e-6
        pplus=self.sim.invariants(self.y+h*v)[1]
        pminus=self.sim.invariants(self.y-h*v)[1]
        self.assertLess(abs((pplus-pminus)/(2*h)),1e-8)

if __name__=='__main__': unittest.main()
