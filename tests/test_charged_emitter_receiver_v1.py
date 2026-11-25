"""A-05f synthetic classical charged emitter/receiver regression suite.

No test here is a detection or a validation against astronomical data.
"""
import sys, unittest
from dataclasses import replace
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from charged_emitter_receiver_v1 import Parameters,EmitterReceiver

class ChargedEmitterReceiverTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.p=Parameters(nodes=64)
        cls.m=EmitterReceiver(cls.p)
        cls.sol,cls.hist,cls.drift=cls.m.solve(final=24,points=91)

    def test_spatial_period_is_defined(self):
        self.assertAlmostEqual(self.m.dx*self.p.nodes,self.p.length)

    def test_delta_kernels_normalized(self):
        for w in (self.m.ws,self.m.wr):
            self.assertAlmostEqual(self.m.dx*np.sum(w),1.,places=12)
            self.assertGreater(w.min(),0)

    def test_fixed_screening_density_is_positive(self):
        self.assertGreaterEqual(self.m.rho.min(),0.)
        self.assertAlmostEqual(self.m.dx*np.sum(self.m.rho),self.p.rho_source+self.p.rho_receiver,places=11)

    def test_equilibrium_residual(self):
        psi=self.m.equilibrium()
        e=-self.p.kappa*self.m.dd(psi)+self.m.Vcoeff*psi-self.p.mpsi2*self.p.psi_far
        self.assertLess(max(abs(e)),1e-10)

    def test_source_more_screened(self):
        s,r=self.m.local_values(self.m.equilibrium())
        self.assertGreater(r,s)
        self.assertGreater(s,0)
        self.assertLess(r,self.p.psi_far)

    def test_Coulomb_well_is_even_positive(self):
        psi=.3
        for q in [.05,.15,.4]:
            self.assertGreater(self.m.V(q,psi),0)
            self.assertAlmostEqual(self.m.V(q,psi),self.m.V(-q,psi),places=13)
            self.assertAlmostEqual(self.m.Vq(q,psi),-self.m.Vq(-q,psi),places=13)

    def test_local_Coulomb_frequency_is_derived_not_fitted(self):
        psi=.7
        h=2e-5
        curvature=(self.m.V(h,psi)-2*self.m.V(0,psi)+self.m.V(-h,psi))/h**2
        expected=self.p.k0*np.exp(-self.p.a*psi)
        self.assertLess(abs(curvature-expected)/expected,2e-6)

    def test_screened_frequency_ratio(self):
        s,r=self.m.calibrated_frequencies(self.m.equilibrium())
        self.assertLess(r/s,1.)
        self.assertAlmostEqual(r/s,0.9616401845462854,places=8)

    def test_equal_density_equal_frequency(self):
        p=replace(self.p,rho_receiver=self.p.rho_source)
        m=EmitterReceiver(p)
        s,r=m.calibrated_frequencies(m.equilibrium())
        self.assertAlmostEqual(s,r,places=9)

    def test_zero_a_removes_atomic_frequency_difference(self):
        p=replace(self.p,a=0.)
        m=EmitterReceiver(p)
        s,r=m.calibrated_frequencies(m.equilibrium())
        self.assertAlmostEqual(s,r,places=14)

    def test_initial_field_E_B_are_zero(self):
        y=self.m.initial_state()
        A,piA,*_=self.m.unpack(y)
        eps,invmu,P,At,E=self.m.field_quantities(y)
        self.assertLess(np.max(abs(A)),1e-14)
        self.assertLess(np.max(abs(E)),1e-14)
        self.assertLess(np.max(abs(piA+P)),1e-14)

    def test_initial_charge_energy_positive(self):
        y=self.m.initial_state()
        d=self.m.budget(y)
        self.assertGreater(d['source'],0)
        self.assertEqual(d['receiver'],0)
        self.assertLess(abs(d['em']),1e-13)

    def test_charge_current_is_time_derivative_of_polarization(self):
        y=self.m.initial_state()
        dy=self.m.rhs(0.,y)
        n=self.p.nodes
        dp_actual=(self.p.charge_s*dy[4*n]*self.m.ws+
                   self.p.charge_r*dy[4*n+2]*self.m.wr)
        A,piA,psi,piPsi,qs,ps,qr,pr=self.m.unpack(y)
        dp_expected=self.p.charge_s*ps/self.p.qmass*self.m.ws+self.p.charge_r*pr/self.p.qmass*self.m.wr
        np.testing.assert_allclose(dp_actual,dp_expected,atol=1e-14)

    def test_energy_directional_derivative_is_zero(self):
        y=self.m.initial_state()
        dy=self.m.rhs(0,y)
        y=y+.27*dy
        dy=self.m.rhs(.27,y)
        h=1e-5
        deriv=(self.m.budget(y+h*dy)['total']-self.m.budget(y-h*dy)['total'])/(2*h)
        self.assertLess(abs(deriv),1e-7)

    def test_integrated_total_energy_conserved(self):
        self.assertLess(self.drift,2e-8)

    def test_detector_moves_after_emission(self):
        self.assertGreater(max(abs(a['qr']) for a in self.hist),1e-3)
        self.assertGreater(max(a['receiver'] for a in self.hist),1e-6)

    def test_delayed_receiver_signal_exceeds_early_spectral_tail(self):
        early=[abs(row['qr']) for t,row in zip(self.sol.t,self.hist) if t<10]
        late=[abs(row['qr']) for t,row in zip(self.sol.t,self.hist) if 19<t<24]
        self.assertLess(max(early),4e-7)
        self.assertGreater(max(late)/max(early),500)
        self.assertGreater(max(late),1e-4)

    def test_emission_generates_radiation_energy(self):
        self.assertGreater(max(a['em'] for a in self.hist),1e-3)

    def test_zero_emission_control(self):
        sol,h,drift=self.m.solve(final=8,amplitude=0,points=21)
        self.assertLess(max(abs(row['qr']) for row in h),1e-12)
        self.assertLess(max(abs(row['qs']) for row in h),1e-12)
        self.assertLess(max(abs(row['em']) for row in h),1e-13)
        self.assertLess(drift,1e-9)

    def test_decoupled_receiver_control(self):
        m=EmitterReceiver(replace(self.p,charge_r=0.))
        _,h,d=m.solve(final=24,points=81)
        self.assertLess(max(abs(row['qr']) for row in h),1e-12)
        self.assertLess(d,2e-8)

    def test_no_electromagnetic_coupling_em_stays_zero(self):
        p=replace(self.p,charge_s=0.,charge_r=0.)
        m=EmitterReceiver(p)
        _,h,d=m.solve(final=7,points=21)
        self.assertLess(max(abs(row['em']) for row in h),1e-12)
        self.assertLess(d,2e-8)

    def test_64_vs_96_grid_calibration(self):
        m=EmitterReceiver(replace(self.p,nodes=96))
        r64=self.m.calibrated_frequencies(self.m.equilibrium())
        r96=m.calibrated_frequencies(m.equilibrium())
        np.testing.assert_allclose(r64,r96,rtol=1e-7)

if __name__=='__main__': unittest.main()
