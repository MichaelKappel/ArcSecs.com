"""Regression tests for the finite-mode 3D classical charge/EM/scalar experiment.

Tests assert algebraic and numerical closure of a synthetic Hamiltonian; no
physical field detection, photon rest mass or astronomical fit follows.
"""
import unittest
import numpy as np
from dataclasses import replace
from tools.charged_3d_spectral_v1 import Params, ChargeField3D, generate_wavevectors


class TestCharged3DSpectral(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sim=ChargeField3D(Params(duration=5.,steps=61))
        cls.y=cls.sim.initial(kick=(.025,.013,.040))

    def test_01_nonzero_modes_all_three_axes(self):
        k=self.sim.k
        self.assertEqual(len(k),13)
        self.assertTrue(np.all(np.linalg.norm(k,axis=1)>0))
        self.assertTrue(np.all(np.any(np.abs(k)>0,axis=0)))

    def test_02_transverse_orthogonal(self):
        self.assertLess(np.max(np.abs(np.einsum('ma,mja->mj',self.sim.k,self.sim.e))),1e-13)
        self.assertLess(np.max(np.abs(np.sum(self.sim.e[:,0]*self.sim.e[:,1],axis=1))),1e-13)
        self.assertTrue(np.allclose(np.linalg.norm(self.sim.e,axis=2),1))

    def test_03_independently_mobile_signed_charges(self):
        self.assertEqual(self.sim.N,4)
        self.assertTrue(np.array_equal(np.sign(self.sim.q),[1,-1,1,-1]))
        self.assertEqual(self.sim.unpack(self.y)[0].shape,(4,3))
        self.assertEqual(self.sim.unpack(self.y)[1].shape,(4,3))

    def test_04_neutral_periodic_cell(self):
        self.assertAlmostEqual(float(np.sum(self.sim.q)),0.)

    def test_05_coulomb_gauge(self):
        self.test_02_transverse_orthogonal()

    def test_06_gauss_constraint(self):
        self.assertLess(self.sim.gauss_residual(self.y),1e-13)

    def test_07_continuity_with_three_dimensional_current(self):
        self.assertLess(self.sim.continuity_residual(self.y),1e-12)

    def test_08_static_scalar_exact_stationary_derivative(self):
        d=self.sim.unpack(self.sim.rhs(0,self.y))
        self.assertLess(np.max(np.abs(d[8])),2e-12)
        self.assertLess(np.max(np.abs(d[9])),2e-12)

    def test_09_translation_preserves_energy(self):
        old=self.sim.invariants(self.y)[0]
        new=self.sim.invariants(self.sim.shift(self.y,np.array([.27,.43,-.17])))[0]
        self.assertAlmostEqual(old,new,places=11)

    def test_10_translation_preserves_three_momentum(self):
        old=self.sim.invariants(self.y)[1]
        new=self.sim.invariants(self.sim.shift(self.y,np.array([.27,.43,-.17])))[1]
        self.assertTrue(np.allclose(old,new,atol=2e-13))

    def test_11_translation_covariance_rhs(self):
        delta=np.array([.23,-.18,.31])
        y2=self.sim.shift(self.y,delta)
        f1=self.sim.rhs(0,self.y);f2=self.sim.rhs(0,y2)
        # A tangent vector is rotated in field space, without translating r-dot.
        fexpected=self.sim.shift(f1,delta)
        fexpected[:12]-=np.tile(delta,4)
        self.assertTrue(np.allclose(f2,fexpected,atol=2e-12,rtol=2e-12))

    def test_12_hamiltonian_directional_derivative(self):
        f=self.sim.rhs(0,self.y)
        h=1e-6
        Hplus=self.sim.invariants(self.y+h*f)[0]
        Hminus=self.sim.invariants(self.y-h*f)[0]
        self.assertLess(abs((Hplus-Hminus)/(2*h)),5e-9)

    def test_13_momentum_directional_derivative(self):
        f=self.sim.rhs(0,self.y)
        h=1e-6
        Pplus=self.sim.invariants(self.y+h*f)[1]
        Pminus=self.sim.invariants(self.y-h*f)[1]
        self.assertLess(np.linalg.norm((Pplus-Pminus)/(2*h)),5e-9)

    def test_14_fully_three_dimensional_mobile_trajectories(self):
        s=self.sim.run(t_end=2.,kick=(.035,.008,.046))
        start=self.sim.unpack(s.y[:,0])[0];end=self.sim.unpack(s.y[:,-1])[0]
        self.assertGreater(abs(end[1,2]-start[1,2]),1e-4)
        self.assertGreater(abs(end[1,0]-start[1,0]),1e-4)
        self.assertGreater(abs(end[1,1]-start[1,1]),1e-4)

    def test_15_energy_integration(self):
        sol=self.sim.run(t_end=5.)
        H=np.array([self.sim.invariants(y)[0] for y in sol.y.T])
        self.assertLess(np.max(np.abs(H-H[0]))/abs(H[0]),1e-7)

    def test_16_momentum_integration_all_three_axes(self):
        sol=self.sim.run(t_end=5.)
        P=np.array([self.sim.invariants(y)[1] for y in sol.y.T])
        self.assertLess(np.max(np.linalg.norm(P-P[0],axis=1)),1e-9)

    def test_17_gauss_and_continuity_through_evolution(self):
        sol=self.sim.run(t_end=3.)
        for y in sol.y.T[::10]:
            self.assertLess(self.sim.gauss_residual(y),1e-12)
            self.assertLess(self.sim.continuity_residual(y),1e-12)

    def test_18_null_unexcited_no_emission(self):
        sol=self.sim.run(excit=0.,kick=(0.,0.,0.),t_end=4.)
        radiative=[self.sim.unpack(y)[4:6] for y in sol.y.T]
        self.assertLess(max(np.linalg.norm(a)+np.linalg.norm(b) for a,b in radiative),1e-10)
        self.assertLess(max(np.linalg.norm(self.sim.unpack(y)[0][2]-self.sim.unpack(y)[0][3]) for y in sol.y.T),1e-10)

    def test_19_zero_charge_no_transverse_emission(self):
        p=replace(self.sim.p,charge_magnitude=0.)
        m=ChargeField3D(p);s=m.run(t_end=3.)
        self.assertLess(max(np.linalg.norm(m.unpack(y)[4])+np.linalg.norm(m.unpack(y)[5]) for y in s.y.T),1e-10)

    def test_20_zero_scalar_source_and_screen(self):
        p=replace(self.sim.p,scalar_source=0.,scalar_screen=0.)
        m=ChargeField3D(p);y=m.initial()
        self.assertLess(np.linalg.norm(m.unpack(y)[6]),1e-14)
        self.assertLess(np.linalg.norm(m.unpack(y)[7]),1e-14)
        self.assertLess(m.gauss_residual(y),1e-14)

    def test_21_screening_reduces_static_scalar_amplitude(self):
        p=self.sim.p;m=ChargeField3D(replace(p,scalar_screen=0.))
        self.assertLess(np.linalg.norm(self.sim.unpack(self.y)[6:8]),np.linalg.norm(m.unpack(m.initial())[6:8]))

    def test_22_wave_shell_extends_resolution(self):
        k=generate_wavevectors(2)
        self.assertEqual(len(k),62)
        self.assertGreater(len(k),self.sim.M)

    def test_23_coulomb_force_antisymmetric(self):
        q=self.sim.quantities(self.y)
        force=np.sum(self.sim.q[:,None]*q[-1],axis=0)
        self.assertLess(np.linalg.norm(force),1e-12)

    def test_24_initial_total_momentum_zero(self):
        self.assertLess(np.linalg.norm(self.sim.invariants(self.y)[1]),1e-13)


if __name__=='__main__':unittest.main()
