"""Independent finite-difference and observable controls for Chapter 30P."""
import sys,unittest
from dataclasses import replace
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from charged_quantum_3d_v1 import Params,Coupled3D,metrics

class Coupled3DChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.p=replace(Params(),shell=1,t_end=6.,n_times=61,step=.14)
        cls.m=Coupled3D(cls.p)
        cls.y=cls.m.initial()
        # Nontrivial state so derivatives are tested away from equilibrium.
        rng=np.random.default_rng(942)
        cls.z=cls.y+rng.normal(size=len(cls.y))*0.0005
        cls.z[26:32]=cls.y[26:32]

    def H(self,z):return self.m.invariants(z)[0]
    def numerical_derivative(self,idx,h=1e-5):
        z=self.z.copy();z[idx]+=h;f1=self.H(z);z[idx]-=2*h;f2=self.H(z)
        return (f1-f2)/(2*h)

    def test_signed_independent_charges(self):self.assertEqual(self.m.q.tolist(),[.24,-.24,.24,-.24])
    def test_two_three_dimensional_atoms(self):self.assertEqual(self.m.unpack(self.y)[2].shape,(4,3))
    def test_transverse_polarizations(self):
        self.assertTrue(np.allclose(np.einsum('mja,ma->mj',self.m.e,self.m.k),0.,atol=1e-14))
    def test_positive_mode_coefficients(self):
        d=self.m.derived(self.z);self.assertTrue(np.all(d[1]>0) and np.all(d[3]>0))
    def test_initial_neutrality(self):self.assertAlmostEqual(float(np.sum(self.m.q)),0.)
    def test_bloch_state_norm_initial(self):
        self.assertTrue(np.allclose(np.linalg.norm(self.m.unpack(self.y)[4],axis=1),1.))
    def test_charge_continuity_identity(self):self.assertLess(self.m.continuity(self.z),1e-13)
    def test_screened_gauss_constraint(self):self.assertLess(self.m.constraint(self.z),1e-13)
    def test_hamiltonian_directional_derivative(self):
        dz=self.m.rhs(0,self.z);eps=1e-5
        directional=(self.H(self.z+eps*dz)-self.H(self.z-eps*dz))/(2*eps)
        self.assertLess(abs(directional),1e-8)
    def test_all_three_momentum_derivatives(self):
        dz=self.m.rhs(0,self.z);eps=1e-5
        p1=self.m.invariants(self.z+eps*dz)[1];p2=self.m.invariants(self.z-eps*dz)[1]
        self.assertLess(float(np.linalg.norm((p1-p2)/(2*eps))),1e-8)
    def test_psi_canonical_gradient(self):
        dz=self.m.rhs(0,self.z)
        self.assertAlmostEqual(dz[0],self.numerical_derivative(1),places=8)
    def test_scalar_momentum_gradient(self):
        dz=self.m.rhs(0,self.z)
        self.assertAlmostEqual(dz[1],-self.numerical_derivative(0),places=8)
    def test_particle_position_gradient(self):
        dz=self.m.rhs(0,self.z)
        for i in (2,5,8,11):self.assertAlmostEqual(dz[14+i],-self.numerical_derivative(2+i),places=7)
    def test_particle_momentum_gradient(self):
        dz=self.m.rhs(0,self.z)
        for i in (0,3,7,11):self.assertAlmostEqual(dz[2+i],self.numerical_derivative(14+i),places=7)
    def test_field_canonical_gradients(self):
        dz=self.m.rhs(0,self.z);M=self.m.M
        for j in (32,33,32+2*M,32+2*M+2):
            self.assertAlmostEqual(dz[j],self.numerical_derivative(j+4*M),places=7)
            self.assertAlmostEqual(dz[j+4*M],-self.numerical_derivative(j),places=7)
    def test_bloch_tangent(self):
        spins=self.m.unpack(self.z)[4]
        ds=self.m.unpack(self.m.rhs(0,self.z))[4]
        self.assertTrue(np.allclose(np.sum(spins*ds,axis=1),0.,atol=1e-12))
    def test_translation_invariance(self):
        z=self.z.copy();m=self.m
        psi,ps,r,p,s,a,b,pa,pb=m.unpack(z)
        delta=np.array([.14,-.09,.04]);phase=m.k@delta
        c=np.cos(phase)[:,None];v=np.sin(phase)[:,None]
        def rot(x,y):return c*x-v*y,v*x+c*y
        aa,bb=rot(a,b);pp,qq=rot(pa,pb)
        translated=m.pack(psi,ps,r+delta,p,s,aa,bb,pp,qq)
        self.assertAlmostEqual(m.invariants(z)[0],m.invariants(translated)[0],places=11)
        self.assertTrue(np.allclose(m.invariants(z)[1],m.invariants(translated)[1],atol=1e-12))
    def test_screening_dependence(self):
        p1=self.m.derived(self.y)[3]
        z=self.y.copy();z[0]+=.1
        p2=self.m.derived(z)[3]
        self.assertTrue(np.all(p2>p1))
    def test_nonzero_reciprocal_spin_source(self):
        z=self.y.copy();d=self.m.rhs(0,z)
        self.assertGreater(np.linalg.norm(d[32+4*self.m.M:]),0.)
    def test_zero_source_zero_receiver(self):
        p=replace(self.p,g_source=0.)
        self.assertEqual(metrics(p)['peak_receiver'],0.)
    def test_zero_receiver_coupling(self):
        p=replace(self.p,g_receiver=0.)
        self.assertEqual(metrics(p)['peak_receiver'],0.)
    def test_baseline_energy_momentum(self):
        r=metrics(self.p)
        self.assertLess(r['energy_rel_drift'],1e-8)
        self.assertLess(r['momentum_abs_drift'],1e-8)
        self.assertLess(r['norm_drift'],1e-7)
    def test_cutoff_comparison_short(self):
        p=replace(self.p,t_end=8.,n_times=81)
        a=metrics(replace(p,shell=2));b=metrics(replace(p,shell=3))
        self.assertLess(abs(a['peak_receiver']-b['peak_receiver'])/b['peak_receiver'],.04)
    def test_alpha_conversion(self):
        from quantum_receiver_v1 import atom_gap_and_gradient
        a=self.m.derived(self.z)[13]
        b=atom_gap_and_gradient(self.z[0],self.p.lam)[0]
        self.assertAlmostEqual(a[0],b)
    def test_sources_numerical_nontrivial(self):
        m=self.m; y=self.y
        self.assertGreater(np.linalg.norm(m.rhs(0,y)),0.)

if __name__=='__main__':unittest.main()
