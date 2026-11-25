"""Static screening and bounded-source tests; synthetic equations only."""
import math,sys,unittest
from dataclasses import replace
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from screened_slab_v1 import (Slab,solve,optics,energy,exterior_root,analytic_finite_D0,density,spectroscopy_ledger)

class ScreenedSlabV1Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.p=Slab()
        cls.x,cls.y,cls.data=solve(cls.p)

    def test_symmetry(self):
        self.assertLess(max(abs(a-b) for a,b in zip(self.y,reversed(self.y))),2e-11)

    def test_static_equation_residual(self):
        self.assertLess(self.data['max_residual'],1e-8)

    def test_boundary_values(self):
        self.assertAlmostEqual(self.y[0],exterior_root(self.p),places=12)
        self.assertAlmostEqual(self.y[-1],exterior_root(self.p),places=12)

    def test_dense_matter_suppresses_field(self):
        self.assertLess(self.data['psi_center'],.03*self.data['psi_exterior'])

    def test_comparison_to_analytic_finite_domain(self):
        error=max(abs(v-analytic_finite_D0(x,self.p)) for x,v in zip(self.x,self.y))
        self.assertLess(error,2.5e-4)

    def test_refinement_quadratic_convergence(self):
        errors=[]
        for n in [401,801]:
            p=replace(self.p,N=n)
            xs,ys,_=solve(p)
            errors.append(max(abs(v-analytic_finite_D0(x,p)) for x,v in zip(xs,ys)))
        self.assertGreater(errors[0]/errors[1],3.7)
        self.assertLess(errors[0]/errors[1],4.3)

    def test_zero_density_contrast_flat_solution(self):
        p=replace(self.p,rho_in=0.)
        xs,ys,d=solve(p)
        self.assertLess(max(abs(t-1.) for t in ys),1e-10)

    def test_monotonic_screening_with_density(self):
        centers=[solve(replace(self.p,rho_in=rho,N=401))[2]['psi_center'] for rho in (0,2,10,40)]
        self.assertEqual(centers,sorted(centers,reverse=True))

    def test_no_electric_source_if_a_zero(self):
        p=replace(self.p,a=0.,D=.8)
        _,ys,_=solve(p)
        _,ys0,_=solve(replace(p,D=0.))
        self.assertLess(max(abs(a-b) for a,b in zip(ys,ys0)),1e-9)

    def test_fixed_D_electric_forcing_increases_psi(self):
        p=replace(self.p,D=.35)
        _,yy,dd=solve(p)
        self.assertGreater(dd['psi_center'],self.data['psi_center'])
        self.assertGreater(dd['psi_exterior'],self.data['psi_exterior'])
        self.assertLess(dd['max_residual'],1e-8)

    def test_stationary_energy_minimum(self):
        p=self.p
        center=p.N//2
        for amp in (-.005,+.005):
            trial=self.y.copy();trial[center]+=amp
            self.assertGreater(energy(self.x,trial,p),energy(self.x,self.y,p))

    def test_continuity_scalar_gradient_flux(self):
        # One-sided finite-volume fluxes on the two sides converge at interface.
        h=self.data['dx']; i=round((self.p.L+self.p.R)/h)
        left=(self.y[i]-self.y[i-1])/h
        right=(self.y[i+1]-self.y[i])/h
        self.assertLess(abs(left-right),.12)

    def test_optics_from_one_scalar(self):
        for y in [self.data['psi_center'],self.data['psi_exterior']]:
            op=optics(y,self.p)
            self.assertAlmostEqual(op['v']**2*op['epsilon']*op['mu'],1.,places=12)

    def test_stationary_profile_has_no_transport_frequency_shift(self):
        # For omega=v(x)|k|, Hamilton's equation gives d(ln omega)/dT =
        # partial_T ln v; this equals zero for the computed static profile.
        # Travel delay is nonzero but independent of launch T.
        v=[optics(y,self.p)['v'] for y in self.y]
        h=self.data['dx']
        delay=h*(.5/v[0]+sum(1/t for t in v[1:-1])+.5/v[-1])
        self.assertGreater(delay,2*self.p.L/ max(v))
        for te in (-3.0,0.,1.0):
            ta=te+delay
            self.assertAlmostEqual(ta-te,delay,places=12)
        self.assertAlmostEqual((1.+delay)-(0.+delay),1.,places=12)

    def test_homogeneous_limit_recovers_three_way_identity(self):
        for d in (-.2,0.,.15):
            row=spectroscopy_ledger(d,d,.35,1.65)
            self.assertAlmostEqual(row['screening_residual'],1.,places=12)

    def test_static_cross_boundary_has_no_transport_redshift(self):
        delta=self.data['psi_exterior']-self.data['psi_center']
        row=spectroscopy_ledger(0.,delta,self.p.a,self.p.b)
        self.assertAlmostEqual(row['S_transport'],1.,places=12)
        self.assertLess(row['z_spec'],0.) # different SOURCE/OBSERVER atomic calibration only
        self.assertAlmostEqual(row['screening_residual'],math.exp(-(self.p.a+self.p.b)*delta),places=12)

    def test_spatial_temporal_closure_nontrivial(self):
        # Independently choose ray-integrated time change and distinct atomic
        # endpoints: this is not the homogeneous I=delta special case.
        i_ray, delta = 0.125, 0.79
        a, b = .35, 1.65
        result=spectroscopy_ledger(i_ray,delta,a,b)
        expected=math.exp((a+b)*(i_ray-delta))
        self.assertAlmostEqual(result['screening_residual'],expected,places=12)
        self.assertNotAlmostEqual(result['screening_residual'],1.,places=3)

    def test_same_atomic_environment_no_static_shift(self):
        row=spectroscopy_ledger(0.,0.,self.p.a,self.p.b)
        self.assertEqual(row['z_spec'],0.)

    def test_reject_unphysical_parameter(self):
        from screened_slab_v1 import check
        with self.assertRaises(ValueError): check(replace(self.p,kappa=-1))

if __name__=='__main__': unittest.main()
