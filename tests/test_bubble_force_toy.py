import math
import unittest
from tools.bubble_force_toy import wall_energy,wall_force,critical_radius,yukawa_shell_potential
class BubbleToyChecks(unittest.TestCase):
 def test_pressure_energy_gradient(self):
  for r in (.8,1.0,1.3,2.1):
   h=1e-5
   numerical=-(wall_energy(r+h,.8,1)-wall_energy(r-h,.8,1))/(2*h)
   self.assertAlmostEqual(numerical,wall_force(r,.8,1),places=6)
 def test_critical_radius(self):
  self.assertEqual(critical_radius(.8,1),1.6)
  self.assertAlmostEqual(wall_force(1.6,.8,1),0,places=10)
  self.assertLess(wall_force(1,.8,1),0)
  self.assertGreater(wall_force(2,.8,1),0)
 def test_yukawa_shell_newton_limit(self):
  # Infinite screening length recovers the constant interior Newtonian shell potential.
  a=3.0;r=1.0;G=1.0;M=2.0
  val=yukawa_shell_potential(r,a,1e6,G,M)
  self.assertAlmostEqual(val,-G*M/a,places=5)
 def test_no_yukawa_center_force(self):
  a=4.0;lam=2;h=1e-4
  center=yukawa_shell_potential(0,a,lam,1,3)
  self.assertLess(abs(yukawa_shell_potential(h,a,lam,1,3)-center),1e-8)
if __name__=='__main__':unittest.main()
