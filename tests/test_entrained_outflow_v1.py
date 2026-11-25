import unittest, sys, math
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from entrained_outflow_v1 import Outflow
class EntrainedOutflowTests(unittest.TestCase):
    def test_massless(self):
        m=Outflow(gap=0)
        for te in (0.,.7):
            for z in (.1,.5,1.,2.):
                r=m.observables(te,m.chi_at_z(te,z));self.assertAlmostEqual(r['A'],1+z,places=12);self.assertAlmostEqual(r['eta'],1,places=12)
    def test_quadrature(self):
        for gap in (0.,.01,.1,.3):
            m=Outflow(gap=gap)
            for te in (0.,.7):
                for z in (.1,.5,1.,2.):
                    chi=m.chi_at_z(te,z);self.assertAlmostEqual(m.arrival(te,chi),m.arrival_numeric(te,chi),places=9)
    def test_arrival_derivative(self):
        for gap in (0.,.1,.3):
            m=Outflow(gap=gap);h=1e-5
            for z in (.1,.5,1.):
                chi=m.chi_at_z(.2,z);r=m.observables(.2,chi)
                self.assertAlmostEqual(r['A'],(m.arrival(.2+h,chi)-m.arrival(.2-h,chi))/(2*h),places=7)
    def test_positive_gap_stretch(self):
        for gap in (.001,.01,.1,.3):
            m=Outflow(gap=gap);r=m.observables(0,m.chi_at_z(0,1))
            self.assertGreater(r['A'],r['Z']);self.assertGreater(r['eta'],1.)
    def test_selected_redshift(self):
        for gap in (0.,.2,.3):
            m=Outflow(gap=gap)
            for z in (.1,.5,1.,2.):self.assertAlmostEqual(m.observables(.4,m.chi_at_z(.4,z))['Z'],1+z,places=12)
    def test_reach(self):
        m=Outflow(gap=.2)
        with self.assertRaises(ValueError): m.arrival(0,m.reach(0))
        with self.assertRaises(ValueError): m.chi_at_z(0,4)
    def test_flux(self):
        m=Outflow();chi=m.chi_at_z(0,1);r=m.observables(0,chi);r2=m.observables(0,chi,.25)
        self.assertAlmostEqual(r2['DL'],2*r['DL']);self.assertEqual(r['DA'],r2['DA'])
    def test_hamiltonian_velocity(self):
        m=Outflow();t=.2;K=m.K(0);h=1e-5
        self.assertAlmostEqual(m.f(t,K),(m.W(t,K+h)-m.W(t,K-h))/(2*h),places=9)
    def test_invalid(self):
        with self.assertRaises(ValueError):Outflow(gap=1)
        with self.assertRaises(ValueError):Outflow(H=0)
        with self.assertRaises(ValueError):Outflow().observables(0,1,0)
if __name__=='__main__':unittest.main()
