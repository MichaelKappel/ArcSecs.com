# Causal External-Domain Coupling — Derivation and Test Record

**Status:** New ArcSecs field-theory toy and numerical checks; **not** a measured external-bubble interaction. Authorial framework: [ArcSecs principles](arcsecs-principles.md) · narrative: [book Chapter 30B](../../../book/book.md#chapter-30b-deriving-a-causal-external-field-coupling-beyond-the-bubble-analogy) · antecedent: [external-domain force model](external-domain-force-model.md).

## Theory and evidence boundaries

The candidate field $\Phi_X$ (units J/kg) is sourced by a shared environment through a finite-range wave equation with speed $v_X$ and screening length $\lambda$. The chosen quadratic field Lagrangian and its Euler–Lagrange equation are written explicitly in Chapter 30B. These equations are a defined proposal, **not** evidence that physically disconnected universes interact. In the static limit the model satisfies a Yukawa/Helmholtz law. A static spherical external shell generates a radially outward interior field when the interaction is screened; Newtonian unscreened shell gravity generates none. A distant ordinary neighboring point source creates a traceless anisotropic tidal tensor at first order. Exact source locations, matter coupling, bubble wall, boundary tension, field energy and backreaction remain unknown.

## Executed numerical results

- Prespecified illustrative normalization: $H_*=70$ km/s/Mpc, shell radius $a=1{,}000$ Mpc, range $\lambda=500$ Mpc, and $G_X=G_N$.
- Effective local gradient $A_X=H_*^2=5.1463\times10^{-36}\,\mathrm{s}^{-2}$ (chosen for comparison, not fitted).
- Required toy shell mass $M_X=1.2554\times10^{52}$ kg = $6.3135\times10^{21}$ solar masses.
- Acceleration at 1 Mpc: $1.5880\times10^{-13}$ m/s²; at 100 Mpc: $1.5943\times10^{-11}$ m/s².
- Disturbance source 1 Gpc away: minimum front travel time at $v_X=c$ equals about 3.2616 billion years.
- Ordinary distant-neighbor tidal eigenvalues $+2K,-K,-K$; trace zero.
- Static test-particle leapfrog integration: maximum absolute specific-energy drift $4.7\times10^{-12}$ in declared normalized units. This does not establish full source+field energy conservation.
- Ten automated tests check: static gradient, origin series, unscreened Newtonian limit, empty-cavity Helmholtz equation, inverse parameter normalization, zero coupling, tensor eigenvalues/trace, front-travel timing, static-particle energy, invalid input rejection. See `tools/external_coupling.py` and `tests/test_external_coupling.py`.

[Parameter sweep CSV](screened-shell-benchmarks.csv) · [Exact model and units in the manuscript](../../../book/book.md#30b3-an-exterior-shell-produces-an-exact-testable-field).

## Independent research sources and intended datasets

- [Coleman and De Luccia (1980)](https://doi.org/10.1103/PhysRevD.21.3305), gravitational effects on vacuum decay (different theoretical framework).
- [Feeney et al. (2011)](https://doi.org/10.1103/PhysRevD.84.043507), bubble-collision WMAP analysis with no confirmed detection.
- [Eöt-Wash inverse-square law tests](https://www.npl.washington.edu/eotwash/inverse-square-law), laboratory restrictions on certain fifth-force Yukawa couplings.
- [DESI DR2 BAO (2025)](https://doi.org/10.1103/tr6y-kpc6), measured large-scale distance observables; not a field detection.
- [Planck 2018 parameters and legacy sky maps](https://arxiv.org/abs/1807.06209); published baseline, not re-fitted here.

## Model risks, conflicts and a single best next step

1. **Source identity:** No measured outer shell or coupling to a separate universe. A shared embedding is an additional assumption.
2. **Causal dynamics:** The static solution does not alone establish a self-consistent evolving bubble field; model the moving source and retarded response.
3. **Energy accounting:** Static test-particle energy conservation omits moving shell and field backreaction. Derive a closed system with source inertia and wall boundary conditions.
4. **Unique prediction:** The near-center acceleration $A_Xr$ can mimic many isotropic acceleration prescriptions. Establish off-center anisotropy or time-variation that is not independently adjustable.
5. **Observational test:** Use real data with a prespecified likelihood, matched data cuts, foreground controls and held-out sky region, then fit $G_X,\lambda,a$ with an explicit cosmic source model.

**Next bounded action:** Implement a moving-shell+field numerical PDE with conserved total energy, a finite propagation-front test, and a preregistered synthetic signal-injection suite. Then propose an observational likelihood using published DESI and Planck data; do not claim observed interbubble effects before that analysis succeeds.
