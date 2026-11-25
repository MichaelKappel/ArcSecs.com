import unittest,math
from scipy.integrate import quad
from tools.cosmic_aging_review import *
class CosmicReview(unittest.TestCase):
    def test_initial_speed(self): self.assertLess(speed(10),1)
    def test_monotonic(self): self.assertLess(speed(5),speed(10))
    def test_drag_integral(self): self.assertAlmostEqual(age_distance(5,2),quad(lambda t:speed(5*math.exp(-t)),0,2)[0],places=12)
    def test_drag_range(self): self.assertLess(age_distance(5,10),math.asinh(5))
    def test_redshift_inverse(self):
        e,z=.1,1.; u=math.sqrt(1-e**2)/e; self.assertAlmostEqual(1/(e*math.hypot(1,u*math.exp(-age_for_z(e,z)))),1+z)
    def test_invalid_redshift(self):
        with self.assertRaises(ValueError):age_for_z(.5,1)
    def test_tiny_deficit(self): self.assertAlmostEqual(deficit(1e-16,1)/2e-32,1)
    def test_shell_quad(self):
        for q in [.01,.1,1,5]:
            for x in [.5,1,2]:self.assertAlmostEqual(shell(q,x)/shell_quad(q,x),1,places=10)
    def test_shell_center(self): self.assertEqual(shell_c(1,0),1.)
    def test_shell_exit(self): self.assertGreater(shell_c(1,2),shell_c(1,1))
    def test_void_integral(self): self.assertAlmostEqual(void_fraction(.1),quad(lambda x:x*math.exp(-x),0,.1)[0],places=12)
    def test_stationary(self): self.assertEqual(emission_arrival(.4,vs=0,vr=0)[1],1)
    def test_arrival_derivative(self):
        h=1e-5;fd=(emission_arrival(.4+h)[0]-emission_arrival(.4-h)[0])/(2*h);self.assertAlmostEqual(fd,emission_arrival(.4)[1],places=8)
    def test_exit_bound(self):self.assertAlmostEqual(energy_ceiling(1,math.sqrt(2)),math.sqrt(2))
    def test_reciprocity(self):self.assertAlmostEqual(reciprocity(1,2,2,.16,1),1.25)
    def test_bath_cost(self):self.assertLess(bath_energy_per_momentum(10,5),speed(10))
    def test_bath_cost_lower(self):self.assertGreater(bath_energy_per_momentum(10,5),speed(5))
    def test_hydrogen_leading(self):self.assertEqual(-(.5*(6-1.5))/.375,-6)
if __name__=='__main__':unittest.main()
