import math, sys, unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"tools"))
from attractive_field_v1 import AttractiveField1D,Particle

class R41AttractiveFieldTests(unittest.TestCase):
    def mk(self,parts=None,dt=.025):
        return AttractiveField1D(parts or [Particle(0,0,1000,1,'receiver'),Particle(12,0,1000,1,'external')],length=96,n=384,speed=2,gap=.15,width=.3)
    def test_zero_coupling_no_field(self):
        m=self.mk([Particle(-2,0,100,0),Particle(2,0,100,0)]); m.evolve(1)
        self.assertAlmostEqual(m.energy()['total'],0.,places=12)
        self.assertAlmostEqual(m.momentum()['total'],0.,places=12)
        self.assertLess(abs(m.phi).max(),1e-12)
    def test_single_charge_no_self_acceleration(self):
        m=self.mk([Particle(0,0,1000,1)]);m.evolve(1)
        self.assertAlmostEqual(m.parts[0].p,0.,places=9)
    def test_field_pulse_finite_front(self):
        m=self.mk(); tr=m.evolve(7)
        at2=min(tr,key=lambda x:abs(x['T']-2))
        at7=tr[-1]
        self.assertLess(abs(at2['force_receiver']),1e-7)
        self.assertGreater(at7['force_receiver'],.01)
    def test_attraction_direction(self):
        m=self.mk();m.evolve(7);self.assertGreater(m.parts[0].p,0.)
    def test_reverse_exterior(self):
        m=self.mk([Particle(0,0,1000,1),Particle(-12,0,1000,1)]);m.evolve(7);self.assertLess(m.parts[0].p,0.)
    def test_opposite_scalar_charge_repulsion(self):
        m=self.mk([Particle(0,0,1000,-1),Particle(12,0,1000,1)]);m.evolve(7);self.assertLess(m.parts[0].p,0.)
    def test_total_momentum(self):
        m=self.mk(); t=m.evolve(8)
        self.assertLess(max(abs(row['momentum_total']) for row in t),1e-9)
    def test_energy_drift(self):
        m=self.mk(); t=m.evolve(8)
        self.assertLess(max(abs(row['energy_total']) for row in t),1.2e-4)
    def test_energy_convergence(self):
        a=self.mk();t1=a.evolve(7,dt=.025)
        b=self.mk();t2=b.evolve(7,dt=.0125)
        err1=abs(t1[-1]['energy_total']);err2=abs(t2[-1]['energy_total'])
        self.assertLess(err2,err1*.31)
    def test_source_recoil(self):
        m=self.mk();m.evolve(8)
        self.assertLess(m.parts[1].p,0)
        self.assertGreater(m.parts[0].p,0)
    def test_zero_source_charge_delays(self):
        m=self.mk([Particle(0,0,1000,1),Particle(12,0,1000,0)]);m.evolve(7)
        self.assertLess(abs(m.parts[0].p),1e-7)
    def test_finite_speed_parameter_later_arrival(self):
        a=self.mk();a.evolve(6)
        b=AttractiveField1D([Particle(0,0,1000,1),Particle(12,0,1000,1)],length=96,n=384,speed=1,gap=.15,width=.3);b.evolve(6)
        self.assertGreater(abs(a.forces()[0]),abs(b.forces()[0])*100)
    def test_two_sources_center_symmetry(self):
        m=self.mk([Particle(0,0,1000,1),Particle(-12,0,1000,1),Particle(12,0,1000,1)]);m.evolve(7)
        self.assertLess(abs(m.parts[0].p),1e-8)
    def test_validation_rejects_oversize_dt(self):
        m=self.mk()
        with self.assertRaises(ValueError):m.step(2)
    def test_no_time_as_field(self):
        m=self.mk();self.assertTrue(hasattr(m,'t'));self.assertFalse(hasattr(m,'spacetime'))
    def test_pulse_locality_late_exterior(self):
        near=self.mk([Particle(0,0,1000,1),Particle(8,0,1000,1)]);near.evolve(5)
        far=self.mk([Particle(0,0,1000,1),Particle(16,0,1000,1)]);far.evolve(5)
        self.assertGreater(abs(near.forces()[0]),abs(far.forces()[0])*100)

if __name__=='__main__':unittest.main()
