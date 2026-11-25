"""Independent analytic, constraint, flux, and energy checks for Chapter 30Q."""
import sys,unittest
from dataclasses import replace
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from stueckelberg_screened_interface_v1 import (
    Params,equilibrium,analytic_profile,numerical_profile,coeffs,transfer,
    sharp_interface_reflection,evolve,field_operator)

class ScreenedStueckelbergChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.p=Params();cls.freq=1.1
    def test_potential_mass_positive(self):self.assertGreater(self.p.m2+self.p.g*self.p.rho_in,0.)
    def test_environmental_mass_positive(self):self.assertGreater(self.p.omega_gap,0.)
    def test_screened_interior(self):self.assertLess(analytic_profile([0.],self.p)[0],analytic_profile([self.p.L],self.p)[0])
    def test_equilibria_order(self):self.assertLess(equilibrium(self.p.rho_in,self.p),equilibrium(self.p.rho_out,self.p))
    def test_boundary_value(self):
        v=analytic_profile([-self.p.L,self.p.L],self.p)
        self.assertTrue(np.allclose(v,equilibrium(self.p.rho_out,self.p),atol=2e-15))
    def test_profile_even(self):
        x=np.linspace(-14,14,31);self.assertTrue(np.allclose(analytic_profile(x,self.p),analytic_profile(-x,self.p)))
    def test_profile_continuous(self):
        a=self.p.half_width;u=analytic_profile([a-1e-8,a+1e-8],self.p)
        self.assertLess(abs(u[0]-u[1]),1e-6)
    def test_profile_flux_continuous(self):
        a=self.p.half_width;h=1e-4;f=lambda x:analytic_profile([x],self.p)[0]
        left=(f(a)-f(a-h))/h;right=(f(a+h)-f(a))/h
        self.assertLess(abs(left-right),2e-3)
    def test_fd_converges(self):
        errors=[]
        for n in [201,401,801]:
            x,num=numerical_profile(n,self.p)
            errors.append(float(np.max(np.abs(num-analytic_profile(x,self.p)))))
        self.assertLess(errors[2],errors[1]);self.assertLess(errors[1],errors[0])
        self.assertLess(errors[2],.0005)
    def test_fd_positive(self):
        _,y=numerical_profile(401,self.p);self.assertTrue(np.all(y>0))
    def test_positive_coefficients(self):
        for e in coeffs(analytic_profile(np.linspace(-10,10,30),self.p),self.p):self.assertTrue(np.all(e>0))
    def test_exact_matching_condition(self):
        eps,b,eta,zeta=coeffs(analytic_profile(np.linspace(-10,10,40),self.p),self.p)
        self.assertTrue(np.allclose(b/eps,eta/zeta,rtol=2e-15))
    def test_identical_gap(self):
        eps,b,eta,zeta=coeffs(analytic_profile(np.linspace(-10,10,40),self.p),self.p)
        self.assertTrue(np.allclose(eta/eps,self.p.omega_gap**2,rtol=2e-15))
    def test_static_range_identity(self):
        eps,b,eta,zeta=coeffs(analytic_profile(np.linspace(-10,10,40),self.p),self.p)
        self.assertTrue(np.allclose(np.sqrt(eps/zeta),np.sqrt(b/eps)/self.p.omega_gap))
    def test_exact_sharp_T_reflection(self):
        self.assertLess(abs(sharp_interface_reflection(.1,.9,1.1,'T',self.p)),1e-14)
    def test_sharp_L_reflection_tanh(self):
        z=sharp_interface_reflection(.1,.9,1.1,'L',self.p)
        self.assertAlmostEqual(z,float(np.tanh(self.p.lam*(.9-.1))),places=13)
    def test_interior_reflection_longitudinal_nonzero(self):
        self.assertGreater(transfer(self.freq,'L',801,self.p)['R'],.1)
    def test_transverse_reflection_zero(self):
        for w in [.61,.8,1.,1.1,1.6,2.8]:self.assertLess(transfer(w,'T',201,self.p)['R'],1e-24)
    def test_mode_flux_conservation(self):
        for w in [.7,1.1,1.9]:
            for pol in ['T','L']:
                self.assertLess(transfer(w,pol,801,self.p)['flux_error'],2e-12)
    def test_transmission_reciprocity(self):
        for pol in ('T','L'):
            z=transfer(1.1,pol,801,self.p)
            self.assertAlmostEqual(z['R']+z['transmitted'],1,places=11)
    def test_longitudinal_resolution_convergence(self):
        r=[transfer(self.freq,'L',n,self.p)['R'] for n in [201,401,801,1601]]
        self.assertLess(abs(r[-1]-r[-2]),abs(r[-2]-r[-3]))
        self.assertLess(abs(r[-1]-r[-2]),.0003)
    def test_zero_scalar_coupling_reflection(self):
        p=replace(self.p,lam=0.)
        for pol in ('T','L'):self.assertLess(transfer(self.freq,pol,401,p)['R'],1e-20)
    def test_zero_scalar_source_reflection(self):
        p=replace(self.p,source=0.)
        for pol in ('T','L'):self.assertLess(transfer(self.freq,pol,401,p)['R'],1e-20)
    def test_below_gap_rejected(self):
        with self.assertRaises(ValueError):transfer(self.p.omega_gap,'L',401,self.p)
    def test_positive_quadratic_form(self):
        C,B=field_operator(np.linspace(-self.p.L,self.p.L,201),self.p,'L')
        u=np.sin(np.linspace(0,3*np.pi,len(B)))
        self.assertTrue(np.all(B>0));self.assertGreater(float(u@C@u),0)
    def test_time_L_energy_ledger(self):
        self.assertLess(evolve('L',n=241,steps=120,dt=.03,p=self.p)['energy_rel_drift'],5e-12)
    def test_time_T_energy_ledger(self):
        self.assertLess(evolve('T',n=241,steps=120,dt=.03,p=self.p)['energy_rel_drift'],5e-12)
    def test_time_energy_initial_positive(self):
        for pol in ('T','L'):self.assertGreater(evolve(pol,n=141,steps=12,dt=.05,p=self.p)['E0'],0)
    def test_wavelength_vs_gap(self):
        # Positive vector gap makes group and characteristic speeds different.
        eps,b,eta,zeta=coeffs(np.array([.2]),self.p)
        c=np.sqrt(b[0]/eps[0]);omega=1.1;k=np.sqrt(omega**2-self.p.omega_gap**2)/c
        vg=c*c*k/omega
        self.assertLess(vg,c)

if __name__=='__main__':unittest.main()
