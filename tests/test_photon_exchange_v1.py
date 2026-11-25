import sys,unittest, math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools'))
from photon_exchange_v1 import Params, derivatives, hamiltonian, simulate, potential, step

class ReciprocalPhotonSourceTests(unittest.TestCase):
    def setUp(self):
        self.par=Params()
        self.s=(-50.,5.,1.,0.,0.,0.,0.,0.)
    def test_opposite_force_components(self):
        d=derivatives(self.s,self.par)
        self.assertAlmostEqual(d[2]+d[6],0.,places=13)
        self.assertAlmostEqual(d[3]+d[7],0.,places=13)
    def test_total_momentum_exact_one_step(self):
        s=step(self.s,0.005,self.par)
        self.assertAlmostEqual(s[2]+s[6],1.,places=12)
        self.assertAlmostEqual(s[3]+s[7],0.,places=12)
    def test_translation_invariant_hamiltonian(self):
        s=self.s
        shift=tuple((v+11. if i in (0,4) else v-31. if i in (1,5) else v) for i,v in enumerate(s))
        self.assertAlmostEqual(hamiltonian(s,self.par),hamiltonian(shift,self.par),places=12)
    def test_zero_coupling_straight(self):
        x=simulate(Params(eta=0),dt=.002)
        self.assertAlmostEqual(x['alpha_rad'],0.,places=12)
        self.assertAlmostEqual(x['final_source_Py'],0.,places=12)
    def test_source_recoil_opposes_photon(self):
        x=simulate(Params(eta=2),dt=.002)
        self.assertAlmostEqual(x['final_source_Py'],-x['final_photon_py'],places=10)
    def test_energy_conservation(self):
        x=simulate(Params(eta=2),dt=.002)
        self.assertLess(x['max_relative_energy_drift'],2e-10)
    def test_momentum_conservation(self):
        x=simulate(Params(eta=2),dt=.002)
        self.assertLess(x['max_momentum_drift'],2e-12)
    def test_half_strength(self):
        a=simulate(Params(eta=1),dt=.002)['alpha_rad']
        b=simulate(Params(eta=2),dt=.002)['alpha_rad']
        self.assertLess(abs(b/a-2),0.003)
    def test_further_impact_less_deflection(self):
        a=simulate(Params(eta=2),impact=5,dt=.002)['alpha_rad']
        b=simulate(Params(eta=2),impact=10,dt=.002)['alpha_rad']
        self.assertGreater(a,b)
    def test_weak_field_approximation(self):
        x=simulate(Params(eta=2),dt=.002)
        self.assertLess(abs(x['alpha_rad']/x['alpha_approx_rad']-1),0.005)
    def test_mass_monotonic(self):
        a=simulate(Params(M=10),dt=.002)['alpha_rad']
        b=simulate(Params(M=5),dt=.002)['alpha_rad']
        self.assertGreater(a,b)
    def test_solar_grazing_anchor(self):
        G=6.67430e-11;M=1.98847e30;c=299792458.;R=6.957e8
        arcsec=4*G*M/(R*c*c)*180/math.pi*3600
        self.assertGreater(arcsec,1.74)
        self.assertLess(arcsec,1.77)
    def test_report_is_export_safe(self):
        s=(ROOT/'docs/long-term-memory/reports/R39.md').read_text()
        self.assertNotIn('```',s)
        self.assertNotIn('\\[',s)
        self.assertNotIn('data:image/',s)
        self.assertGreater(len(s.split()),3000)
        self.assertIn('UAIX navigation',s)
        self.assertIn('interpretation-versus-observation checkpoint',s.lower())
    def test_no_finite_speed_claim(self):
        s=(ROOT/'docs/long-term-memory/reports/R39.md').read_text()
        self.assertIn('NOT',s.upper())
        self.assertIn('instantaneous',s)

if __name__=='__main__':unittest.main()
