"""Focused, stdlib-only arithmetic checks for the four-report source audit.

These test *specified mathematical transformations*, not competing physical ontologies
or the truth of unverified astrophysical mechanisms.
"""
import math
import unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

def radial_freefall_from_rest_at_6(final_r):
    # Idealized Schwarzschild geodesic, proper-time units GM/c^3,
    # released from rest at r=6 GM/c^2. This is a benchmark calculation.
    angle=math.acos(math.sqrt(final_r/6.0))
    return 6.0*math.sqrt(3)*(angle+math.sin(2*angle)/2.0)

class PrimarySourceArithmetic(unittest.TestCase):
    def test_finite_crossing_benchmark(self):
        self.assertAlmostEqual(radial_freefall_from_rest_at_6(2),14.826921,places=5)
        self.assertAlmostEqual(radial_freefall_from_rest_at_6(2)-radial_freefall_from_rest_at_6(3),1.468671,places=5)
    def test_des_simple_z_score(self):
        sigma=math.hypot(0.005,0.010)
        self.assertAlmostEqual(1.003/sigma,89.71,places=1)
        self.assertAlmostEqual((1.003/(0.005+0.010))**2,4471.15,delta=0.2)
    def test_cobe_conditional_toy_greybody(self):
        x=(1+50e-6)**(1/3)-1
        self.assertGreater(x,1.66e-5)
        self.assertLess(x,1.68e-5)
        self.assertNotEqual(x,1.67e-53)
    def test_kg_conversion_of_mass_upper_limit(self):
        ev_c2_to_kg=1.7826619216279e-36
        self.assertAlmostEqual(1e-18*ev_c2_to_kg,1.7826619216279e-54,delta=1e-65)
    def test_cern_positive_muon_lifetime_rough_prediction(self):
        self.assertAlmostEqual(29.33*2.1969811,64.434,delta=0.02)
        self.assertAlmostEqual(64.419,29.33*2.1969811,delta=0.1)
    def test_audit_claim_links(self):
        m=(ROOT/'docs/long-term-memory/research/source-audit-4.md').read_text()
        for text in ('R25','R26','R30','R36','5900(2300)','1.67e-5','1,504','source-audit-claims.csv'):
            self.assertIn(text,m)
        report=(ROOT/'docs/long-term-memory/reports/R36.md').read_text()
        self.assertIn('1.67e-5',report)
        self.assertNotIn('z\\_max(COBE 50 ppm) \\= 1.67e-53',report)

if __name__ == '__main__':
    unittest.main()
