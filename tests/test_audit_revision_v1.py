import unittest
from decimal import Decimal,localcontext
from tools.audit_revision_v1 import bath_band_high_precision,outflow_frames
from tools.external_coupling import tidal_tensor
class AuditRevision(unittest.TestCase):
    def test_precise_endpoint(self):
        lo,hi=bath_band_high_precision()
        with localcontext() as c:
            c.prec=55
            self.assertLess(abs((1-hi)/Decimal('1e-16')-1),Decimal('1e-14'))
            self.assertLess(abs(lo-Decimal('0.9999999999764954694617768527457')),Decimal('1e-30'))
    def test_outflow_ceiling(self):
        for g in (0,.01,.1,.2,.3):
            v,u,common=outflow_frames(g); self.assertLessEqual(v,1+1e-12);self.assertGreater(common,1.99)
    def test_outflow_values(self):
        v,u,w=outflow_frames(.3);self.assertAlmostEqual(v,.8);self.assertAlmostEqual(u,1.25);self.assertAlmostEqual(w,2.05)
    def test_tidal_convention(self):
        t=tidal_tensor(1,0,0,1);self.assertEqual([t[i][i] for i in range(3)],[2,-1,-1])
