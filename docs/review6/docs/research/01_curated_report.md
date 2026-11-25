# ArcSecs Research 01 — C-01 — Cosmic mass, inertia and emission ceiling

**Status:** curated working report, Part XXIX; conditional derivations and candidate development, not a new observation or completed fit. The twelve-foundation charter in `../../.uai/constraints.uai` governs all work. Original line citations below refer to the separately preserved input archive.

## Retained research material

### C01-01 · candidate motivation

A physical constitutive response can produce a finite wave characteristic C=1/sqrt(epsilon mu). Investigate collective matter-sourced response rather than assign substance to empty space. Vacuum-polarization proposals in the text are literature leads, not evidence that cosmic gravity sets C. An absolute numerical c in SI is a unit convention; test dimensionless clock/ruler ratios and signal arrival comparisons.

Source loci: `R01:7-15; R01:27; X01:697-715`.

### C01-02 · candidate equations

Retain impedance-matched Family Ib as an electromagnetic candidate: epsilon=epsilon_* sqrt(1+a I^2), mu=mu_* sqrt(1+a I^2), Z=sqrt(mu/epsilon)=Z_*, C=C_*/sqrt(1+a I^2). At fixed charge and hbar, constant Z also preserves the dimensionless electromagnetic coupling in this parametrization. Derive matter standards rather than assume invariance of every clock. Retarded regulator: (C_I^-2 d_T^2 - laplacian + lambda^-2)I=g rho_src with I(infinity)=0 for an isolated finite source. Both coefficients and source units need calibration; derive backreaction and finite-density boundary conditions. Do not equate I with optical intensity.

Source loci: `X01:697-715; X01:260-340`.

### C01-03 · candidate mechanics

The proposed inertia Lagrangian L=-M0(I) C_m(I)^2 sqrt(1-v^2/C_m(I)^2) is a useful local constitutive ansatz. If M0=m_* (C_*/C)^p and C_m=C, the low-speed inertia is M0; p=2 makes rest energy independent of I, not automatically all fifth forces absent. In a constant background energy rises as M0 C_m^2/sqrt(1-v^2/C_m^2). This imposes a ceiling by construction; deriving its physical origin is the actual research goal.

Source loci: `X01:697-715; X01:285-340`.

### C01-04 · derived relation; reported numerical illustration

For omega^2=C^2 k^2+Omega^2 with positive gap, front/characteristic speed C and packet speed v_g=C sqrt(1-Omega^2/omega^2) are distinct. Phase speed is omega/k, not group speed. At 500 THz and m c^2=10^-18 eV the optical group deficit is about 1.17e-37. This supports an extremely close approach to the emission ceiling, not exact finite-energy equality. Owner idealization F(0)=1 remains an open implementation requirement. A causal field excitation, not additive emitter velocity, is the preferred emission starting point.

Source loci: `X01:350-440; X01:697-715`.

### C01-05 · derived shell result; reported diagnostics

Uniform Newtonian shell force cancellation does not eliminate a nonzero scalar amplitude. Thin shell of mass M, radius R: I(0)=gM exp(-R/lambda)/(4 pi R). For homogeneous sphere central integral ratio to unscreened kernel is 2[1-(1+q)e^-q]/q^2, q=R/lambda. Retain thick-wall quadrature, non-spherical zero-padded 3D convolution, gradients and moving-wall flux as methods. The HTML reports example asymmetry and grid values without full solver output; reproduce rather than elevate them. Specific reproduction targets from X01: N=48, L_box=6, lambda=1; triaxial axes (1.2,1.0,0.8), central I=0.106836, r=0.5 directional values (0.111966,0.113395,0.113143); clumpy shell reported central I=0.111601 and |grad I|=0.0046753; overlapping centers (+/-0.7,0,0), midpoint I=0.233032 versus center 0.165699. These are dimensionless report values with unspecified complete normalization/source profile; reproduce with mesh refinement, isolated boundary and analytic shell limits. Check a thick wall from 0.8R to 1.2R. For the unscreened solar perturbation, delta I=g M_sun/(4 pi R_sun) when R_sun << lambda; propagate it through the same coupling used cosmologically. Source suggests long-range, unified gravitational response, or nonlinear screening as alternatives; none has been established. Use nonlinear screening or a demonstrably universal response to reconcile local precision with cosmic effect.

Source loci: `X01:440-554; R01:29-44`.

### C01-06 · restricted result and next test

Static Hamiltonian rays conserve omega, so at fixed Omega v_g follows C along the ray. The outward higher-C case is not an admissible universal slowing mechanism. Keep the exact sign condition from Report 02 and solve a dynamic coupled field/history model, not an imposed speed clamp. Impedance matching reduces normal-incidence reflection for a simple massless interface; derive finite-gap and oblique transfer. Multi-band void/filament timing, cavity-to-atomic ratios, clocks, solar-limb signals, and multimessenger timing constrain dimensionless variations. GW/EM lag must include intrinsic source delay; do not treat explorer posterior as reproduced.

Source loci: `X01:554-640; X01:697-715`.

## Import corrections and boundaries

- The report R01 emphasizes established spacetime explanations rather than the commissioned physical regulator. Use constitutive/Machian leads only; do not import an ontology of material space. The explorer X01 supplies the more useful candidate handoff.
- Causal front versus massive packet: never set phase and group velocities equal. A static shell potential is not a derived speed ceiling. Exact packet emission at c0 remains unresolved.
- A locally unobservable common rescaling may amount to unit degeneracy. Require dimensionless or cross-environment observable, not numerical assignment of c0.

## Next implementation

Derive a common matter-regulator action, screen local bodies in 3D, derive measured clock/cavity responses, and enforce causal characteristics with no per-ray speed clamping. Compare fixed ceiling and physically varying domain boundary tests.

Deliver a runnable solver, parameter file, raw observables, residuals and convergence results. Keep findings separate from proposals and cite source literature before publishing numerical empirical claims.
