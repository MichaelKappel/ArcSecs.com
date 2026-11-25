"""30O: independent tests for 3D positive-mass vector linear receiver benchmark."""
import unittest
from dataclasses import replace
import numpy as np
from tools.charged_3d_green_v1 import (Params,lattice,fields_at_modes,
    constraints,response,pair_fourier,independent_mode_solve)

class TestCharged3DGreen(unittest.TestCase):
    def setUp(self):
        self.p=Params(N=6)

    def test_modes_count(self):
        k,k2=lattice(self.p)
        self.assertEqual(k.shape,((2*self.p.N+1)**3,3))
        self.assertTrue((k2>=0).all())

    def test_pair_net_charge(self):
        k,_=lattice(Params(N=2))
        rho,_,_=pair_fourier(k,2.,np.array([0.6,-.4,.3]),np.array([.09,.11,-.3]),np.zeros(3),.9)
        self.assertLess(abs(rho[(k==0).all(axis=1)][0]),1e-15)

    def test_exact_signed_pair_current_continuity(self):
        k,_=lattice(Params(N=3))
        rho,J,drho=pair_fourier(k,2.,np.array([.6,-.4,.3]),np.array([.09,.11,-.3]),np.zeros(3),.9)
        self.assertLess(np.max(abs(drho+1j*np.einsum('ij,ij->i',k,J))),1e-14)

    def test_pair_numeric_time_derivative(self):
        k,_=lattice(Params(N=2))
        d=np.array([.6,-.4,.3]);v=np.array([.09,.11,-.3]);dt=1e-4
        plus=pair_fourier(k,2.,d+dt*v,v,np.zeros(3),.9)[0]
        minus=pair_fourier(k,2.,d-dt*v,v,np.zeros(3),.9)[0]
        derivative=pair_fourier(k,2.,d,v,np.zeros(3),.9)[2]
        self.assertLess(np.max(abs((plus-minus)/(2*dt)-derivative)),1e-9)

    def test_linear_dipole_limit(self):
        k,_=lattice(Params(N=2))
        d=np.array([.002,-.001,.001]); v=np.array([.03,.04,.01]); q=1.7;s=.6
        exact_rho,exact_J,_=pair_fourier(k,q,d,v,np.zeros(3),s)
        G=np.exp(-.5*s*s*(k*k).sum(axis=1))
        linear_rho=-1j*q*(k@d)*G
        linear_J=q*G[:,None]*v[None,:]
        self.assertLess(np.max(abs(exact_rho-linear_rho)),1e-9)
        self.assertLess(np.max(abs(exact_J-linear_J)),2e-7)

    def test_linear_continuity(self):
        self.assertLess(constraints(self.p,1.05)['max_continuity_abs'],1e-13)

    def test_gauss(self):
        self.assertLess(constraints(self.p,1.05)['max_gauss_abs'],1e-13)

    def test_ampere(self):
        self.assertLess(constraints(self.p,1.05)['max_ampere_abs'],1e-13)

    def test_constraints_three_frequencies(self):
        for f in (.45,1.05,1.65):
            self.assertLess(constraints(self.p,f)['max_scaled_equation_residual'],1e-13)

    def test_constraint_nontrivial_mass(self):
        self.assertLess(constraints(replace(self.p,gap=.51),1.05)['max_scaled_equation_residual'],1e-13)

    def test_4_by_4_independent_solver(self):
        p=replace(self.p,epsilon=1.3,speed=.87,gap=.42)
        for k in ([.4,.1,-.3],[-.6,.3,.5],[.0,.0,.0]):
            indep,A,ph=independent_mode_solve(p,1.05,k)
            kv=np.array(k);k2=kv@kv
            z=1.05+1j*p.gamma;pol=np.array(p.emitter_axis);pol=pol/np.linalg.norm(pol)
            G=np.exp(-.5*p.sigma_source**2*k2)
            D=p.speed**2*k2+p.gap**2-z*z
            expected=(z*z*pol-p.speed**2*kv*(kv@pol))*G/(p.epsilon*D)
            self.assertLess(np.max(abs(indep-expected)),2e-13)

    def test_response_trans_long_sum_complex(self):
        r=response(self.p,1.05)
        total=complex(r['total_re'],r['total_im'])
        tr=complex(r['transverse_re'],r['transverse_im'])
        lo=complex(r['longitudinal_re'],r['longitudinal_im'])
        self.assertLess(abs(total-tr-lo),1e-14)

    def test_longitudinal_nonzero(self):
        r=response(self.p,1.05)
        self.assertGreater(r['longitudinal_abs'],1e-5)

    def test_transverse_nonzero(self):
        r=response(self.p,1.05)
        self.assertGreater(r['transverse_abs'],1e-5)

    def test_perpendicular_receive_differs(self):
        self.assertGreater(abs(response(self.p,1.05)['total_abs']-
            response(replace(self.p,receiver_axis=(0.,0.,1.)),1.05)['total_abs']),1e-4)

    def test_mass_gap_control_differs(self):
        self.assertGreater(abs(response(self.p,1.05)['total_abs']-
            response(replace(self.p,gap=0.),1.05)['total_abs']),1e-5)

    def test_finite_width_is_physical_parameter(self):
        r=response(self.p,1.05)['total_abs']
        r2=response(replace(self.p,sigma_source=.65,sigma_receiver=.65),1.05)['total_abs']
        self.assertGreater(abs(r-r2),1e-4)

    def test_finite_periodic_box_dependence(self):
        r=response(self.p,1.05)['total_abs']
        r2=response(replace(self.p,length=30.),1.05)['total_abs']
        self.assertGreater(abs(r-r2),1e-6)

    def test_response_is_complex(self):
        r=response(self.p,1.05)
        self.assertGreater(abs(r['total_im']),1e-5)

    def test_response_frequency_changes(self):
        self.assertGreater(abs(response(self.p,.6)['total_abs']-
            response(self.p,1.2)['total_abs']),1e-4)

    def test_static_vector_is_longitudinal(self):
        p=replace(self.p,gamma=0.)
        r=response(p,0.)
        self.assertLess(r['transverse_abs'],1e-14)
        self.assertGreater(r['longitudinal_abs'],1e-5)

    def test_high_cutoff_fixed_width_converges(self):
        a=response(Params(N=10),1.05)
        b=response(Params(N=12),1.05)
        za=complex(a['total_re'],a['total_im']);zb=complex(b['total_re'],b['total_im'])
        self.assertLess(abs(za-zb),1e-9)
        self.assertLess(abs(za-zb)/abs(zb),3e-6)

    def test_coarse_cutoff_not_equal_to_reference(self):
        a=response(Params(N=4),1.05)
        b=response(Params(N=12),1.05)
        za=complex(a['total_re'],a['total_im']);zb=complex(b['total_re'],b['total_im'])
        self.assertGreater(abs(za-zb),1e-5)

    def test_phase_rotation_reciprocity(self):
        p=replace(self.p,emitter_axis=(0.,1.,0.),receiver_axis=(.0,.7,.7))
        q=replace(p,separation=tuple(-np.array(p.separation)),
                  emitter_axis=p.receiver_axis, receiver_axis=p.emitter_axis)
        a=response(p,1.05);b=response(q,1.05)
        self.assertAlmostEqual(a['total_re'],b['total_re'],places=12)
        self.assertAlmostEqual(a['total_im'],b['total_im'],places=12)

    def test_sign_inversion_source(self):
        p=replace(self.p,emitter_axis=(0.,-1.,0.))
        a=response(self.p,1.05);b=response(p,1.05)
        self.assertAlmostEqual(a['total_re'],-b['total_re'],places=12)
        self.assertAlmostEqual(a['total_im'],-b['total_im'],places=12)

    def test_nonzero_gap_yukawa_relation(self):
        p=self.p
        zeta=p.epsilon*p.gap**2/p.speed**2
        eta=p.epsilon*p.gap**2
        self.assertAlmostEqual(eta/zeta,p.speed**2)
        self.assertAlmostEqual(np.sqrt(p.epsilon/zeta),p.speed/p.gap)

    def test_grid_independence_constraint(self):
        a=constraints(Params(N=4),1.05)
        b=constraints(Params(N=12),1.05)
        self.assertLess(a['max_scaled_equation_residual'],1e-13)
        self.assertLess(b['max_scaled_equation_residual'],1e-13)

if __name__=='__main__':unittest.main()
