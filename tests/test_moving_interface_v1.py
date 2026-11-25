"""A-05e mathematical regression tests; these do not validate cosmic physics."""
import sys
import unittest
from dataclasses import replace
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from moving_interface_v1 import Parameters, MovingInterface


class MovingInterfaceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.p=Parameters(nodes=64,t_final=3.,pulse_amplitude=0.06)
        cls.model=MovingInterface(cls.p)
        cls.solve=cls.model.solve(velocity=0.03,points=21)

    def test_equilibrium_positive_and_screened(self):
        psi=self.model.stationary_scalar()
        self.assertGreater(psi.min(),0)
        self.assertLess(psi.min(),0.4)
        self.assertGreater(psi.max(),0.9)

    def test_equilibrium_stationary_residual(self):
        psi=self.model.stationary_scalar()
        n,_=self.model.density(0)
        r=-self.p.kappa*self.model.dd(psi)+(self.p.scalar_mass_sq+self.p.coupling_density*n)*psi-self.p.scalar_mass_sq*self.p.scalar_background
        self.assertLess(np.max(np.abs(r)),1e-10)

    def test_density_gradient_matches_finite_difference(self):
        X=0.37
        n,nx=self.model.density(X)
        h=1e-5
        np_,_=self.model.density(X+h)
        nm_,_=self.model.density(X-h)
        np.testing.assert_allclose((np_-nm_)/(2*h),-nx,atol=2e-9)

    def test_density_periodic_and_smooth(self):
        n,_=self.model.density(.24)
        n_shift,_=self.model.density(.24+self.p.length)
        np.testing.assert_allclose(n,n_shift,atol=2e-14)

    def test_dispersion_speed_response(self):
        psi=self.model.stationary_scalar()
        eps=np.exp(self.p.a*psi)
        mu=np.exp(self.p.b*psi)
        gamma=(self.p.a+self.p.b)/2
        np.testing.assert_allclose(1/np.sqrt(eps*mu),np.exp(-gamma*psi),rtol=1e-14)

    def test_initial_positive_em_energy(self):
        b=self.model.budgets(self.model.initial_state())
        self.assertGreater(b['E_em'],0)
        self.assertGreater(b['E_scalar'],0)

    def test_time_evolution_energy_conserves(self):
        self.assertLess(self.solve[2]['max_relative_energy_drift'],1e-7)

    def test_time_evolution_momentum_conserves(self):
        self.assertLess(self.solve[2]['max_absolute_momentum_drift'],1e-6)

    def test_matter_moves(self):
        self.assertGreater(self.solve[2]['last']['slab_x'],0.05)

    def test_energy_exchange_while_total_stays_constant(self):
        old=self.solve[2]['first']; new=self.solve[2]['last']
        self.assertGreater(abs(new['E_scalar']-old['E_scalar']),1e-8)
        self.assertLess(abs(new['E_total']-old['E_total']),1e-7)

    def test_hamiltonian_derivative_approximately_zero(self):
        y=self.model.initial_state(velocity=.03)
        dy=self.model.rhs(0,y)
        h=2e-6
        ep=self.model.budgets(y+h*dy)['E_total']
        em=self.model.budgets(y-h*dy)['E_total']
        self.assertLess(abs((ep-em)/(2*h)),2e-7)

    def test_momentum_derivative_approximately_zero(self):
        y=self.model.initial_state(velocity=.03)
        dy=self.model.rhs(0,y)
        h=2e-6
        pp=self.model.budgets(y+h*dy)['P_total']
        pm=self.model.budgets(y-h*dy)['P_total']
        self.assertLess(abs((pp-pm)/(2*h)),2e-6)

    def test_zero_light_has_no_em_source_or_energy(self):
        y=self.model.initial_state(velocity=.0,amplitude=0)
        A,piA,_,_,_,_=self.model.unpack(y)
        self.assertAlmostEqual(self.model.budgets(y)['E_em'],0)
        self.assertAlmostEqual(np.max(np.abs(A)),0)
        self.assertAlmostEqual(np.max(np.abs(piA)),0)

    def test_static_no_light_has_no_time_frequency_shift(self):
        m=self.model
        sol,_,_=m.solve(velocity=0,amplitude=0,final=2,points=11)
        ray=m.trace_ray(sol)
        self.assertLess(abs(ray.y[1,-1]),1e-9)

    def test_frozen_scalar_matter_motion_decouples_if_gzero(self):
        p=replace(self.p,coupling_density=0, pulse_amplitude=0)
        m=MovingInterface(p)
        sol,_,s=m.solve(velocity=.06,amplitude=0,final=3,points=11)
        self.assertAlmostEqual(s['last']['slab_x'],.18,places=8)
        self.assertAlmostEqual(s['last']['slab_v'],.06,places=8)
        ray=m.trace_ray(sol)
        self.assertLess(abs(ray.y[1,-1]),1e-9)

    def test_zero_electromagnetic_scalar_coupling(self):
        p=replace(self.p,a=0,b=0)
        m=MovingInterface(p)
        sol,_,_=m.solve(velocity=.035,final=2,points=11)
        ray=m.trace_ray(sol)
        self.assertAlmostEqual(ray.y[1,-1],0.,places=12)

    def test_em_field_changes_scalar_from_no_light_control(self):
        m=self.model
        s1,_,_=m.solve(velocity=0,amplitude=0,final=2,points=11)
        s2,_,_=m.solve(velocity=0,amplitude=.12,final=2,points=11)
        psi1=m.unpack(s1.y[:,-1])[2];psi2=m.unpack(s2.y[:,-1])[2]
        self.assertGreater(np.max(abs(psi1-psi2)),1e-7)

    def test_ray_finite_and_faster_than_zero(self):
        ray=self.model.trace_ray(self.solve[0]); self.assertTrue(np.isfinite(ray.y).all())
        self.assertGreater(ray.y[0,-1],ray.y[0,0])

    def test_flux_exchange_moving_density_energy(self):
        y=self.model.initial_state(velocity=.04)
        dy=self.model.rhs(0,y)
        _,_,psi,_,X,P=self.model.unpack(y)
        _,n_x=self.model.density(X)
        field_matter_power=.5*self.p.coupling_density*self.model.dx*np.sum(n_x*psi**2)*P/self.p.slab_mass
        self.assertAlmostEqual(dy[-1]*(P/self.p.slab_mass),field_matter_power,places=12)

    def test_solver_repeatability(self):
        s,_,res=self.model.solve(velocity=.03,points=21)
        np.testing.assert_allclose(s.y,self.solve[0].y,atol=1e-12)


if __name__ == '__main__':unittest.main()
