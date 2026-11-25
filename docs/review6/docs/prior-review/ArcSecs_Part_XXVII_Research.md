# ArcSecs Scientific Investigation — Part XXVII
## C-01: A collective cosmic field as a candidate origin of the local light-speed ceiling

Date: 2026-11-23. Research status: analytical candidate and reproducible dimensionless tests, not an observational fit. Continuation of the C-01 addendum to Part XXVI. Preserve the twelve current ArcSecs working foundations as the investigation's charter; they are not results verified by this paper.

### Abstract

The author's two-spacecraft experiment motivates a question about why newly emitted light in our present cosmic domain should start at the local maximum speed rather than at a higher speed and subsequently decelerate to the measured value. We test a finite-range scalar response sourced by matter and a positive kinetic coefficient shared by two illustrative field sectors. A hollow spherical shell produces a nonzero static scalar even when its ordinary Newtonian acceleration is identically zero. The candidate local characteristic speed decreases as the magnitude of this scalar increases. An exact spherical solution, independent angular quadrature, and radial massive-mode ray integrals quantify the wall and exterior transition. Under the illustrative calibration, a shell with radius equal to the response range yields a wall ceiling 0.91649 times its central ceiling and a ceiling 1.38229 times the central one at twice the shell radius. This exhibits an environment-dependent speed but does not produce irreversible slowing: a transmitted ray accelerates outside the shell. In a stationary medium its coordinate frequency is conserved. Positive mass also keeps the finite-frequency group speed below the characteristic speed. These results establish a useful mathematical candidate and two precise missing mechanisms; they do not establish the origin of the measured local speed, a cosmic wall, or modified astronomical distances.

## 1. Source lineage and preserved intent

Read before constructing this installment: `.uai/memory.uai` and `paper/ArcSecs_C01_Paper_Addendum.md` in the prior C-01 update; original ZIP members `ArcSecs External Bubble Growth Physics.md`, `07_Cosmic_Bubble_External_Forces_Full_Depth.md` and `Relational Gravity Without Spacetime Fabric.md`; Part XXIV's autonomous scalar and positive-gap dispersion. The original external-bubble reports explicitly identify ordinary spherical-shell force cancellation and consider a finite-range coupling or exterior asymmetry. The relational-gravity report already examines a weighted inverse-distance cosmic inertia integral, including void deletions. The new calculation develops a local retarded implementation of a related *candidate*, not a new observation of a bubble. It does not use the conventional cosmological radius as the unknown physical bubble radius.

Author clarification (preserve exactly): “The real point of the thought experiment was to think about why we would have a maximum speed of light limit locally where we are in the universe and why we would always assume that light can only slow down from that established maximum speed never start from a faster speed.”

Working reference: c0 = 299792458 m/s. Define C_em as the local emission ceiling, C_front as the high-frequency characteristic/front speed, C_causal as the fastest actual signal characteristic among *all* physical sectors, and v_g as the group velocity of a finite-frequency packet. These distinctions are mandatory. The user's idealized assumption is emission at the ceiling followed by slowdown, with no emission above the local limit. The two ships retain uniform inherited motion from separate disappeared domains. Zero local acceleration does not determine mutual separation rate. The illustrative 4c0 opposing-beam closing rate is conditional on Galilean velocity addition, not a C-01 prediction; do not use it to claim a single photon exceeds causality.

## 2. A local physical regulator instead of instantaneous action

Use a universal time coordinate T and ordinary relational position labels x. Let I be a dimensionless physical scalar response, lambda a positive length, g a coupling of dimension length/mass, and rho a prescribed rest-mass density. A static equilibrium obeys

$$(-\nabla^2+\lambda^{-2})I=J,\qquad J=g\rho.$$

With a decaying boundary condition its solution is

$$I(\mathbf x)=\frac{g}{4\pi}\int \frac{\rho(\mathbf y)e^{-|\mathbf x-\mathbf y|/\lambda}}{|\mathbf x-\mathbf y|}d^3y.$$

This is a static Green function, not an instruction for a changing source to update the whole cosmos instantaneously. The hypothesized field is physical and can carry energy; the coordinates are not material substances. The normalization of I, coupling g, and range lambda are not measured. A nonzero scalar in a cavity is distinct from a Newtonian force. An absolute Newtonian potential alone is gauge-dependent up to a constant; this candidate instead defines a field with a mass term and boundary conditions.

Introduce an illustrative transverse amplitude a, constant bare frequency gap Omega>0, positive coefficient A(I)=1+alpha I^2 with alpha>0, and a characteristic speed parameter C*. A common-scale toy action density (multiply by a positive energy-density times length-squared normalization to obtain physical units) is

$$\mathcal L=\frac{A(I)}{2C_*^2}(I_T^2+a_T^2)-\frac12(|\nabla I|^2+|\nabla a|^2+\lambda^{-2}I^2)-\frac{A(I)\Omega^2}{2C_*^2}a^2+JI.$$

Both I and a are dimensionless in this chosen normalization. All terms have dimensions inverse length squared. For fixed J, the energy density in the same normalization is

$$\mathcal E=\frac{A}{2C_*^2}(I_T^2+a_T^2+\Omega^2a^2)+\frac12(|\nabla I|^2+|\nabla a|^2+\lambda^{-2}I^2)-JI.$$

The source term can be completed as a square: I^2/(2lambda^2)-JI=(I-lambda^2 J)^2/(2lambda^2)-lambda^2 J^2/2. For a smooth fixed finite source with square-integrable J the integrated energy is bounded below and conserved with zero boundary flux. The infinitely thin shell below is a distributional static idealization, not a claim about that square-integrability proof; a shell of finite thickness avoids this issue. With evolving matter a dynamical matter action and reciprocal force/energy exchange are necessary. No full vector gauge, spin-2 gravity, atomic-clock or matter-inertia completion is claimed.

Varying a gives ∂T(A a_T/C*²) - ∇²a + A Omega² a/C*²=0. The I equation is ∂T(A I_T/C*²)-∇²I+lambda^-2 I-J - A'(I)(I_T²+a_T²-Omega²a²)/(2C*²)=0. Linearized about a stationary I background and a=0, the two sectors have the same principal characteristic speed

$$ C(I)=\frac{C_*}{\sqrt{1+\alpha I^2}}.$$

Hence they have positive kinetic and gradient coefficients; no negative-energy kinetic mode appears in this restricted model. A common speed for two toy fields is not proof that *every* real signal or massive body shares that limit. To identify C with the full causal limit, all interacting sectors must be shown to have compatible characteristics. Nor does a wave kinetic coefficient alone establish that mechanical inertia of a spacecraft is generated by cosmic matter.

Set a reference I_ref=1 by convention and C*=c0 sqrt(1+alpha). In this model weak scalar response allows a larger characteristic speed; strong response lowers it. The direction of this relation was chosen to investigate the author's proposed restriction by mass, not derived uniquely from gravity. C* is a free bare parameter, calibrated rather than predicted. Even the vacuum in this ansatz has a finite maximum C*, not an infinite speed. Other environmental laws are possible.

## 3. Hollow bubble calculation

Take a spherical shell of physical radius R, mass M, with empty interior and exterior. J=g M delta(r-R)/(4 pi R²). Define x=r/R and q=R/lambda. The angular integral of the Yukawa kernel gives

$$I(0)=\frac{gM}{4\pi R}e^{-q}.$$

Normalize each illustrated shell to the same center response I(0)=1. This changes gM/R with q and is **not a fixed-mass parameter scan**. For fixed M, the center instead becomes exponentially insensitive to a far shell with R much larger than lambda. Solving the radial Helmholtz equation with regularity at the origin and decay outside gives

$$\frac{I(r)}{I(0)}=\begin{cases}\sinh(qx)/(qx),&x\le1,\\ [\sinh(q)/q]e^{-q(x-1)}/x,&x\ge1.\end{cases}$$

I is continuous and its outward derivative jump is -gM/(4 pi R²). At q→0 the interior is uniform even though the exterior field is proportional to 1/r. The Newtonian net force is zero everywhere inside the uniform shell; in the candidate field, the magnitude of I can still regulate C. Finite q makes I increase toward the shell. At small x, I/I(0)=1+q²x²/6+O(q⁴x⁴). For alpha=1 this implies C/c0≈1-q²x²/12. This spatial dependence provides a test, although operational clocks/rulers must be modeled before comparing a coordinate-speed variation with a measured one.

### Numerical experiment

`c01_shell.py` solves the exact profiles, compares them with an independent 512-node Gauss-Legendre angular integral of the kernel at 42 nonsingular points, checks derivative jumps and integrates radial ray travel times. The range scan is dimensionless and alpha=1; it is not a fitted coupling. Results:

| R/lambda | I_wall/I_center | C_wall/c0 | C(2R)/c0 |
|---:|---:|---:|---:|
| 0.01 | 1.00001667 | 0.99999167 | 1.26741906 |
| 0.1 | 1.00166750 | 0.99916660 | 1.28811771 |
| 0.5 | 1.04219061 | 0.97913158 | 1.34846464 |
| 1 | 1.17520119 | 0.91648714 | 1.38228665 |
| 2 | 1.81343020 | 0.68290582 | 1.40368479 |
| 5 | 14.84064212 | 0.09507769 | 1.41244926 |

The far exterior limit in every normalized case is sqrt(2)c0. The example with q=1 and fixed center reference demonstrates that a cavity need not be free from a collective scalar effect. The wall is a mathematical mass shell, not an identified cosmic boundary. Observers inside an actual cosmic bubble might be in the cavity, in a material wall, or in a distributed interior; do not identify the chosen origin with Earth's location. A thin-shell model does not predict stable bubble formation or a wall radius.

## 4. Positive mass, propagation and the strict monotonicity conflict

In a slowly varying stationary background, the eikonal dispersion of a is

$$\omega^2=C(I)^2 k^2+\Omega^2,\qquad v_g=C(I)\sqrt{1-\Omega^2/\omega^2}.$$

Omega is a positive gap, not an experimentally inferred invariant rest mass. In a locally Lorentz-type dispersion the corresponding rest-mass proxy is hbar Omega/C²; holding Omega fixed while C varies would change that proxy. The paper does not silently interpret a fixed gap as a fixed invariant mass in every domain. For finite omega>Omega the group speed is strictly below C. If C_em=C_front=C_causal, an exact initial packet group velocity equal to C_em cannot hold within this dispersion law. One option is to understand c0 as the emission/front ceiling approached by energetic packets; the user's exact group-speed idealization remains a separate open requirement. Do not conflate phase velocity omega/k with signal velocity.

For fixed stationary I, Hamiltonian ray transport has dω/dT=∂ω/∂T=0. A ray can refract and exchange momentum with the fixed environment, but its coordinate frequency is conserved. Two stationary identical clock standards would measure no net redshift solely from this static transport. A different physical clock response or time-dependent field may shift observed frequency; neither is calculated in this static model. It follows that the regulator is not a tired-light mechanism on its own.

For q=1 the outward radial group speed at constant omega decreases from center to wall, then increases outside. The illustrative gap ratio Omega/omega=0.1 is intentionally large to make the distinction visible; it is NOT a realistic photon mass estimate. At center v_g/c0=0.994987; at wall ≈0.91189; at 2R ≈1.37536. It never exceeds the candidate local C(I), even where that local C(I) exceeds the original center reference. If the rule is instead that a photon may never exceed its emission speed *anywhere*, this candidate fails that rule. To prevent reacceleration one must derive a separate age/path-dependent loss or memory mechanism consistent with the local instantaneous ceiling and energy-momentum conservation. Adding irreversible loss by hand or imposing min(v_old,C_new) would not supply that derivation. In a static nondispersive positive speed profile travel time is a path integral, not a direct universal time-of-flight observation of galaxies.

Ray time to x=b in units R/c0 is integral from 0 to b of [C(x)/c0 sqrt(1-Omega²/omega²)]^-1 dx. At q=1, T(1)=1.03451282 R/c0 and T(3)=2.57552779 R/c0. Therefore the very same shell can overestimate a known center-to-wall travel distance when multiplied by c0, yet underestimate a center-to-3R distance. Redshift-based distance is a different inference. The results do not establish Foundation #12; Part XXVI's angle/brightness consistency tests remain mandatory.

## 5. A void test that does not require observing a cosmic wall

As a separate mathematical benchmark, consider an otherwise uniform, idealized infinite density rho0 with finite lambda and its static scalar I_ref=g rho0 lambda². Remove all matter in a centered sphere of radius b, leaving all surrounding matter fixed. The fractional center response removed is

$$ f(s)=1-(1+s)e^{-s},\qquad s=b/\lambda.$$

This is obtained by integrating r exp(-r/lambda) from 0 to b. It is not a force or a claim that real voids are empty. With I_ref normalized to 1, alpha=1, the void center speed changes by sqrt[2/(1+(1-f)^2)]-1. For b/lambda=.01, .1 and 1, predicted fractional changes are 2.4834e-5, 0.00234215 and 0.13910987 respectively. For small s, f≈s²/2, and ΔC/C≈alpha/(1+alpha)*s²/2. With alpha=1 a hypothetical 1e-6 bound on an independently measurable fractional speed difference in this exact setup would require b/lambda ≲0.002, or lambda ≳500b. This is a conditional design sensitivity, not an observed bound. The infinite background has infinite total matter; this is a local benchmark of a convergent kernel, not a statement of cosmic size, age or total energy.

## 6. Empirical discriminators and the danger of rescaling units

A dimensionful coordinate speed is not a direct measurement of a change in nature. Today the SI numerical value of c is fixed by the unit definitions. A successful theory must predict dimensionless observables: frequency ratios, timing differences in specified clocks, relative propagation of field modes, phase shifts or orientation dependence. If all rods, clocks and fields vary together, an apparent change of units may be unobservable. A preferred cosmic-frame physical field must also predict actual moving-source and moving-detector transformations. No such result has been obtained here.

External literature controls (checked for this installment):

* D. W. Sciama (1953), On the Origin of Inertia, MNRAS 113, 34–42, https://doi.org/10.1093/mnras/113.1.34. Historical motivation only, not support for this particular constitutive law.
* Abbott et al. (2017), Gravitational Waves and Gamma-Rays from a Binary Neutron Star Merger: GW170817 and GRB 170817A, https://arxiv.org/abs/1710.05834. Using assumptions about relative emission time and distance, the reported relative GW/EM speed bound was -3e-15 to +7e-16. A shared environmental speed can evade a *differential* timing bound, whereas photon-only slowing relative to GW propagation cannot simply ignore it. This is not a direct universal limit on alpha or lambda.
* Nagel et al. (2015), Direct terrestrial test of Lorentz symmetry in electrodynamics to 10^-18, https://www.nature.com/articles/ncomms9174. Their reported orientation-dependent fractional frequency constraint was (9.2 ± 10.7)e-19 at 95% confidence. It does not directly bound the spherical isotropic coordinate-speed profile; the matter/clock response and preferred-frame anisotropy must be calculated first.

Prior ArcSecs work on physical clocks, massive photons, solar-system screening, SN arrival-time dilation and optical reciprocity remains relevant. Especially important: any additional irreversible energy exchange requires an energy ledger, must avoid excessive dispersion or scattering, and must produce the correct frequency and time-dilation relationships. A model that only changes C but conserves frequency cannot explain cosmological redshift through age slowing.

## 7. Numerical verification and research disposition

Executed tests: 42 independent angular quadrature values, six analytic shell jump checks, seven void quadratures, numerical local dispersion differentiation, and a reacceleration sign control. Maximum relative kernel mismatch 1.223e-12; dispersion derivative absolute mismatch 5.971e-12 in normalized units. CSV files and plot are generated by the included Python program. No cosmological likelihood, full dynamical bubble simulation, physical mass determination or atomic measurement is performed.

Findings:
1. The proposed response has a well-defined local characteristic speed and positive kinetic coefficients in a restricted field action.
2. Collective scalar influence within a hollow shell is mathematically possible without an ordinary inward Newtonian force. A long response range can make the cavity nearly uniform.
3. The assumed constitutive law permits an exterior with a higher local emission/front ceiling, but predicts reacceleration of existing rays outside the wall. This conflicts with strict age-only monotonic slowdown over every environment.
4. Stationary environmental regulation cannot by itself produce redshift or an irreversible aging law.
5. No derivation of the numerical value c0 from actual cosmic masses or of a speed ceiling for all sectors has yet been made. Calibration is not explanation.

## 8. Part XXVIII plan

Keep C-01 as an explicit research hypothesis. Next construct a dynamical mass-source sector and a passive, energy-accounted photon interaction with the regulator or additional physical bath. Derive the relationship among emission, propagation, dispersion and loss in the homogeneous limit before crossing a bubble boundary. Test whether such a model can produce monotone speed decrease, small spectral dispersion, redshift and time dilation while respecting the multimessenger speed constraint. Include positive photon gap, stable matter clocks, common causal characteristics and measurable dimensionless comparisons. Then test independent geometric anchors and brightness/angle consistency. Preserve the failed strict-monotonicity result rather than discarding it. No outside-bubble existence or unbounded speed is assumed as an empirical result.
