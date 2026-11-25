import unittest, math
from tools.external_coupling import (potential,acceleration,center_gradient,needed_shell_mass,tidal_tensor,signal_delay,leapfrog_energy_drift)
class ExternalShellTests(unittest.TestCase):
    def test_gradient_exact_finite_difference(self):
        for r in (0.1,0.5,1.5,3.0):
            a,lam,G,M=4.,1.5,1.,3.
            h=1e-5
            numeric=-(potential(r+h,a,lam,G,M)-potential(r-h,a,lam,G,M))/(2*h)
            self.assertAlmostEqual(numeric,acceleration(r,a,lam,G,M),delta=5e-10)
    def test_center_force_zero_and_linear(self):
        a,lam,G,M=4.,1.5,1.,3.
        self.assertEqual(acceleration(0,a,lam,G,M),0.0)
        self.assertAlmostEqual(acceleration(.0001,a,lam,G,M)/.0001,center_gradient(a,lam,G,M),delta=1e-9)
    def test_shell_theorem_limit(self):
        self.assertAlmostEqual(potential(1,4,1e7,1,3),-3/4,delta=5e-7)
        self.assertLess(abs(acceleration(1,4,1e7,1,3)),1e-12)
    def test_helmholtz_equation_source_free_inside(self):
        # radial Laplacian Phi''+2 Phi'/r = Phi/lambda^2
        a,lam,G,M=4.,1.5,1.,3.
        r=1.0;h=1e-3
        c=potential(r,a,lam,G,M)
        second=(potential(r+h,a,lam,G,M)-2*c+potential(r-h,a,lam,G,M))/h**2
        first=(potential(r+h,a,lam,G,M)-potential(r-h,a,lam,G,M))/(2*h)
        self.assertAlmostEqual(second+2*first/r-c/lam**2,0,delta=2e-7)
    def test_mass_inversion(self):
        a,lam,G=4.,1.5,1.
        target=.02
        M=needed_shell_mass(target,a,lam,G)
        self.assertAlmostEqual(center_gradient(a,lam,G,M),target,places=14)
    def test_zero_coupling(self):
        self.assertEqual(acceleration(1,4,2,0,100),0)
        self.assertEqual(acceleration(1,4,2,1,0),0)
    def test_neighbor_tidal_traceless(self):
        T=tidal_tensor(1,0,0,3)
        self.assertEqual([T[i][i] for i in range(3)],[6,-3,-3])
        self.assertEqual(sum(T[i][i] for i in range(3)),0)
    def test_causal_delay(self):
        self.assertEqual(signal_delay(4,2),2)
        with self.assertRaises(ValueError):signal_delay(1,0)
    def test_static_energy(self):
        result=leapfrog_energy_drift()
        self.assertLess(result['max_abs_energy_drift'],1e-7)
    def test_validation(self):
        with self.assertRaises(ValueError):potential(5,4,2,1,1)
        with self.assertRaises(ValueError):needed_shell_mass(-1,1,1,1)
if __name__=='__main__': unittest.main()
