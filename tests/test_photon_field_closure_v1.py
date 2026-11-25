"""Mathematical regression checks, not an observational validation of ArcSecs."""
import math,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from photon_field_closure_v1 import Parameters,calc_branch,integrate,energy,results

class PhotonFieldClosureTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rows,cls.summary=results()

    def test_fixed_twelve_charter_not_reduced_to_eleven(self):
        book=(Path(__file__).resolve().parents[1]/'book'/'book.md').read_text()
        self.assertIn('11. **The age of the universe is unknown.**',book)
        self.assertIn('12. **Objects in the universe are smaller and closer than they appear.**',book)

    def test_paper_initial_conditions_reproduced(self):
        self.assertAlmostEqual(self.summary['psi_arrival'],-0.0722536789,places=9)

    def test_closed_toy_energy(self):
        self.assertLess(self.summary['max_relative_energy_drift'],1e-10)

    def test_reproduces_reported_branch_m_emission(self):
        row=next(r for r in self.rows if r['branch']=='M' and r['t_emission']==-1.8)
        self.assertAlmostEqual(row['distance_over_v_a'],2.8709,places=4)
        self.assertAlmostEqual(row['z_spec'],1.3306,places=4)
        self.assertAlmostEqual(row['z_prop'],1.3306,places=4)

    def test_reproduces_reported_branch_i_sign(self):
        row=next(r for r in self.rows if r['branch']=='I' and r['t_emission']==-1.8)
        self.assertAlmostEqual(row['z_spec'],-.5709,places=4)
        self.assertGreater(row['z_prop'],0)

    def test_spectral_alpha_transport_closure(self):
        for row in self.rows:
            self.assertLess(abs(row['closure_residual']),1e-12)

    def test_spectral_alpha_closure_arbitrary_parameters(self):
        for a,b,dpsi in [(0,2,.4),(1,1,.1),(.2,1.8,.8),(3,-1,-.6),(1,3,0)]:
            r=calc_branch(dpsi,a,b)
            self.assertLess(abs(r['closure_residual']),1e-10)

    def test_magnetic_branch_alpha_large(self):
        row=next(r for r in self.rows if r['branch']=='M' and r['t_emission']==-1.8)
        self.assertAlmostEqual(row['alpha_ratio'],1+row['z_spec'],places=10)

    def test_matched_branch_alpha_constant_and_spectral_blue(self):
        row=next(r for r in self.rows if r['branch']=='I' and r['t_emission']==-1.8)
        self.assertAlmostEqual(row['alpha_ratio'],1,places=10)
        self.assertLess(row['z_spec'],0)

    def test_zero_drift(self):
        x=calc_branch(0.,0.,2.)
        self.assertEqual(x['z_spec'],0.)
        self.assertEqual(x['z_prop'],0.)
        self.assertEqual(x['alpha_ratio'],1.)

if __name__=='__main__':unittest.main()
