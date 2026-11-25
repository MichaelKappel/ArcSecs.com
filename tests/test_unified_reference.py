"""Focused synthetic checks for ArcSecs UPM-0. Not observational tests."""
import sys, unittest
from dataclasses import replace
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from unified_reference import (Parameters,State,step,phi,clock_rate,
    photon_momentum,photon_group_speed,total_energy,wall_force)
from external_coupling import C_LIGHT


def params(**kw):
    p=Parameters(shell_radius_m=8., screening_length_m=2., external_G=1.,
      shell_source_kg=3.,particle_kg=1.,wall_kg=2.,pressure_delta_pa=0.001,
      wall_tension_j_m2=0.002,clock_hz=1e6, photon_loss_per_m=1e-10)
    return replace(p,**kw)

def state():
    return State(0.,1.,0.04,2.,0.,0.,1e-12)

class UnifiedReferenceTests(unittest.TestCase):
    def test_null_photon_loss_energy_constant(self):
        p=params(photon_loss_per_m=0.)
        s=step(state(),p,0.001)
        self.assertEqual(s.photon_energy_j,1e-12)
        self.assertEqual(s.sink_energy_j,0.)
    def test_photon_energy_transfer_ledger(self):
        p=params()
        s=state(); sn=step(s,p,.001)
        self.assertAlmostEqual(sn.photon_energy_j+sn.sink_energy_j,s.photon_energy_j,places=23)
        self.assertAlmostEqual(sn.sink_momentum_kg_m_s,
                               photon_momentum(s.photon_energy_j,p)-photon_momentum(sn.photon_energy_j,p),places=28)
    def test_source_zero_implies_zero_phi(self):
        p=params(shell_source_kg=0.)
        self.assertEqual(phi(0.,p),0.)
        self.assertEqual(phi(1.,p),0.)
        self.assertEqual(clock_rate(1.,0.,p),p.clock_hz)
    def test_clock_count_no_time_stretch(self):
        p=params(clock_phi_coupling=0.,clock_speed_coupling=0.)
        s=step(state(),p,.002)
        self.assertAlmostEqual(s.clock_cycles,.002*1e6,places=10)
        self.assertAlmostEqual(s.T_s,.002,places=12)
    def test_clock_potential_changes_rate_if_coupling_nonzero(self):
        p=params(clock_phi_coupling=1e18)
        self.assertNotEqual(clock_rate(1.,0.,p), clock_rate(0.,0.,p))
    def test_massless_photon_propagates_c(self):
        self.assertEqual(photon_group_speed(1e-12,params(photon_rest_kg=0.)),C_LIGHT)
    def test_proca_speed_below_c_if_mass_nonzero(self):
        mass=.2*1e-12/C_LIGHT**2
        p=params(photon_rest_kg=mass)
        self.assertLess(photon_group_speed(1e-12,p),C_LIGHT)
        self.assertGreater(photon_group_speed(1e-12,p),0.)
        self.assertRaises(ValueError,photon_group_speed,0.5*mass*C_LIGHT**2,p)
    def test_wall_pressure_and_tension_recover_force(self):
        p=params(external_G=0.)
        r=2.
        self.assertAlmostEqual(wall_force(r,p), 4*3.141592653589793*p.pressure_delta_pa*r*r -8*3.141592653589793*p.wall_tension_j_m2*r)
    def test_energy_ledger_static_external(self):
        p=params(photon_loss_per_m=0.)
        s=state(); E0=total_energy(s,p)
        for _ in range(1000):s=step(s,p,0.0005)
        self.assertLess(abs((total_energy(s,p)-E0)/E0),3e-6)
    def test_single_external_state_links_independent_observables(self):
        p=params(clock_phi_coupling=1e18,photon_phi_coupling=1e18)
        p2=replace(p,shell_source_kg=0.)
        self.assertNotEqual(clock_rate(1,0,p),clock_rate(1,0,p2))
        self.assertNotEqual(wall_force(2,p),wall_force(2,p2))
    def test_no_inferred_expansion_from_wall_alone(self):
        p=params(external_G=0.,pressure_delta_pa=0.001)
        s=state(); new=step(s,p,.01)
        # Two state quantities evolve independently; source does not prescribe x/R.
        self.assertNotEqual(new.wall_r_m,s.wall_r_m)
        self.assertEqual(new.particle_r_m,s.particle_r_m+s.particle_v_m_s*.01)
    def test_proca_energy_floor_raises(self):
        m=.99*1e-12/C_LIGHT**2
        p=params(photon_rest_kg=m,photon_loss_per_m=1e-3)
        self.assertRaises(ValueError,step,state(),p,0.01)

if __name__=='__main__':unittest.main()
