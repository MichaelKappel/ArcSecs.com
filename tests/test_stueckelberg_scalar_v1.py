"""New 30L analytical and numerical unit tests; all tests are synthetic."""
import sys,unittest
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
import stueckelberg_scalar_v1 as S

class TestStueckelbergScalar(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.t,cls.y,cls.en,cls.energy,cls.c,cls.drift=S.run()
    def test_epsilon_positive(self):
        for p in [-5,0,1,5]: self.assertGreater(S.coefficients(p)[0],0)
    def test_magnetic_positive(self):
        for p in [-5,0,1,5]: self.assertGreater(S.coefficients(p)[1],0)
    def test_mass_positive(self):
        for p in [-5,0,1,5]: self.assertGreater(S.coefficients(p)[2],0)
    def test_temporal_positive(self):
        for p in [-5,0,1,5]: self.assertGreater(S.coefficients(p)[3],0)
    def test_longitudinal_kinetic_positive(self):
        for p in [-5,0,1,5]: self.assertGreater(S.coefficients(p)[4],0)
    def test_speed_matching(self):
        for p in [-1,0,1,2]:
            eps,b,eta,zeta,*_=S.coefficients(p)
            self.assertAlmostEqual(eta/zeta,b/eps,12)
    def test_mass_gap_transverse(self):
        for p in [-1,0,1]:
            oT,oL=S.frequencies(p,0)
            self.assertAlmostEqual(oT,S.OMEGA0,12)
    def test_mass_gap_longitudinal(self):
        for p in [-1,0,1]:
            oT,oL=S.frequencies(p,0)
            self.assertAlmostEqual(oL,S.OMEGA0,12)
    def test_all_polarizations_same(self):
        for p in [-1,0,1]:
            for k in [.02,1,3,20]:
                oT,oL=S.frequencies(p,k)
                self.assertAlmostEqual(oT,oL,11)
    def test_group_below_characteristic_speed(self):
        for k in [.1,1,10]:self.assertLess(S.group_phase(1,k)[0], np.exp(-.5))
    def test_phase_above_characteristic_speed(self):
        for k in [.1,1,10]:self.assertGreater(S.group_phase(1,k)[1], np.exp(-.5))
    def test_group_times_phase(self):
        for k in [.1,1,10]:
            a,b=S.group_phase(1,k);self.assertAlmostEqual(a*b,np.exp(-1),12)
    def test_scalar_endpoint(self):self.assertAlmostEqual(self.y[-1,0],1.133880,5)
    def test_speed_endpoint(self):self.assertAlmostEqual(self.c[-1],.567259,5)
    def test_total_energy_positive(self):self.assertTrue(np.all(self.energy>0))
    def test_conservation(self):self.assertLess(self.drift,2e-12)
    def test_yukawa_residual_converges(self):
        x=[S.yukawa_residual(n) for n in [201,401,801,1601]]
        self.assertTrue(all(a>b for a,b in zip(x,x[1:])))
    def test_yukawa_second_order(self):
        x=[S.yukawa_residual(n) for n in [401,801,1601]]
        self.assertGreater(x[0]/x[1],3.7);self.assertGreater(x[1]/x[2],3.7)
    def test_initial_total_energy(self):self.assertAlmostEqual(self.energy[0],.02323152,10)
    def test_massive_redshift_higher_frequency(self):
        # q=2; delta theta = ln 2; positive, chromatic toy branch
        delta=np.log(2); ce=1;ca=np.exp(-delta)
        def z(k):return np.sqrt((ce*k)**2+.4**2)/np.sqrt((ca*k)**2+.4**2)-1
        self.assertGreater(z(10),z(.1))
    def test_q0_blueshift_highk(self):
        delta=np.log(2);k=1000
        ratio=np.exp(-2*delta)*np.sqrt(k*k+.4**2)/np.sqrt((np.exp(-delta)*k)**2+.4**2)
        self.assertAlmostEqual(ratio-.5,0,6)
    def test_nonzero_gap_weakens_transport_shift(self):
        delta=np.log(2);k=1
        no_gap=np.exp(delta)
        with_gap=np.sqrt(k*k+.4**2)/np.sqrt((np.exp(-delta)*k)**2+.4**2)
        self.assertLess(with_gap,no_gap)

if __name__=='__main__':unittest.main()
