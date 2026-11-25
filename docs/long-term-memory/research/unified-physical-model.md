# ArcSecs UPM-0 — Common State and Cross-Sector Model (Working Record)

[Research index](../index.md) · [Book Chapter 30C](../../../book/book.md#chapter-30c-one-state-five-mechanisms-the-executable-arcsecs-reference-model) · [Eleven-principle charter](arcsecs-principles.md) · [24-report coverage](24-report-coverage.md)

**Status:** ArcSecs hypothesis-building and executable toy. Not a tested replacement for relativity, evidence that neighboring universes exist, discovery of nonzero photon rest mass, or experimental confirmation of photon slowing. Created from the last verified causal-shell model and the nine full-depth / fifteen source-depth reports; the report source bodies remain unchanged.

## Scientific research question

Can a *single explicit physical state* connect (a) clock-process counts, (b) matter motion, (c) photon propagation and energy transfer, (d) hypothetical bubble boundary dynamics, and (e) measurable astronomical outputs without inserting a literal elastic time/space substance or tuning a separate law after each observation?

**Hypothesis UPM-0:** An exterior finite-range potential affects several independently parameterized physical sectors. This links their calculation inputs, not yet their microscopic interactions. Values of the source mass, range, coupling, photon loss, clock coupling and bubble wall are **hypothetical** and not determined by observed evidence. The model must not be described as confirmed or as one first-principles field theory.

## Minimal shared state and dimensions

| Variable | Meaning | SI units | Empirical status |
|---|---|---|---|
| T | proposed universal progression parameter | s | model convention, not a newly observed absolute clock |
| r, v, m | test particle radial coordinate, speed, invariant mass | m, m/s, kg | a synthetic test state |
| N, f | physical process cycle count, rate | cycles, Hz | rate ansatz only |
| E_gamma, p_gamma | selected photon's energy/momentum | J, kg m/s | physical quantities; intrinsic mass hypothesized |
| U_sink, P_sink | receiving energy and momentum | J, kg m/s | bookkeeping only; receiver interaction not identified |
| R, Rdot, M_wall | hypothetical interface radius, speed, inertia | m, m/s, kg | neither wall nor outer domain has been detected |
| Phi_X, a_X | external screened potential and acceleration | J/kg, m/s² | assumed screened law, synthetic source |
| DeltaP, sigma | pressure difference, surface tension | Pa, J/m² | toy wall parameters |
| lambda, G_X, M_X | range, coupling, source mass | m, m³/(kg s²), kg | assumed parameters, not cosmological fit |

Reference field: `Phi_X(r) = -(G_X M_X/a) exp(-a/lambda) sinh(r/lambda)/(r/lambda)` within a **static uniform shell**. This reproduces the validated relation in the [previous causal model](external-coupling-v2.md). The potential uses a uniform shell; ordinary inverse-square gravity gives zero interior acceleration in the symmetric limit.

Physical-process clock rate: `f_a = f0 [1 + alpha_a(Phi_X(r)-Phi_X(0))/c² - beta_a v²/(2c²)]`. If one universal factor applies to all processes, the observable outcome may be a reparametrization of tested proper-time phenomena, **not** a new measurement. A distinct physical hypothesis requires an independently testable process-specific departure.

Photon: `E²=p²c²+m_gamma²c⁴` for the hypothetical free massive-photon dispersion; separately `dE/dell=-kappa E`, with receiver ledger `dU_sink/dT = kappa E v_g` and `dP_sink=-dp_gamma`. The photon rest mass `m_gamma` remains undetected, and the loss constant `kappa` is imposed rather than derived. A real theory must identify the source and sink (matter or field), predict angular scattering, polarization, image sharpness, spectral line width, transient stretch, background radiation, and full conservation.

Wall: `U_w=4pi sigma R² - (4pi/3) DeltaP R³ + M_wall Phi_X(R)`, with `M_wall Rddot = 4pi R² DeltaP - 8pi sigma R + M_wall a_X(R)`. The pressure term is **not** gravitational attraction; directional neighbor tides are not interchangeable with isotropic expansion. A change in `R` alone does not establish interior galaxy separation, photon redshift or actual universal growth.

## Executable prototype

- Source: [`tools/unified_reference.py`](../../../tools/unified_reference.py) (stdlib Python; SI numerical inputs).
- Checks: [`tests/test_unified_reference.py`](../../../tests/test_unified_reference.py).
- Use: `python tools/unified_reference.py`; then `python -m unittest discover -s tests -v`.
- Outputs: synthetic `T`, particle radius/velocity, wall radius/velocity, counted cycles, photon energy and travel-length ledger, receiver energy/momentum, and energy drift under the fixed-source approximation.
- **Important approximation:** The photon path increment is evaluated with the local potential of a single cell, not a spatially resolved radiation ray; the accumulated illustrative path must not be treated as a resolved shell-crossing trajectory. The photon sink is bookkeeping and is not a simulated dynamical medium.

## Required falsification and numerical gates

1. Null-coupling: zero external source suppresses shell acceleration and source-linked rate shifts.
2. Massless limit: `m_gamma=0` gives `v_g=c` for the chosen free-field dispersion.
3. Photon loss off: `kappa=0` conserves photon energy with no sink deposit.
4. Imposed photon energy loss: photon-plus-sink energy and their collinear momentum ledgers close numerically.
5. Static-source particle and wall energy: leapfrog relative drift passes a declared numerical tolerance and converges as the step decreases.
6. Bubble pressure sign: the force decomposes into separate pressure, tension and potential contributions; changing wall radius never automatically changes another object's radial separation.
7. Full candidate gate **not yet passed**: a dynamical source and finite-speed wave solver with stress-energy conservation, causal response, proper spatial photon transport, independent astronomical prediction and blinded data comparison.

The model currently satisfies the **synthetic-code gates** only. They are not evidence that real-world measurements favor this hypothesis.

## Primary independent observational programs for later tests

- Clock and unstable-particle processes: optical/nuclear clock comparisons and moving particles, with frozen parameters and uncertainty budgets.
- Photon transport: DES 2024 supernova time-duration measurements, Tolman surface brightness, COBE/FIRAS spectrum, multi-frequency images and transients. See book references [S02], [S14].
- Galaxy and gravitational dynamics: SPARC rotation curves, cluster lensing, Cassini delays, gravitational-wave observations and local fifth-force tests.
- Greater cosmos: Planck/WMAP bubble-signature null searches, cosmic microwave anisotropy patterns, cross-correlation and directional tidal forecasts. No exterior-domain force is observed.
- Nuclear cosmology: direct Gupta–Samaras 2026 publication [S30], DOI `10.3390/universe12070193`. Their conditional rate-scaling match and lithium/deuterium tradeoff must both be preserved.

## Open work in priority order

1. Replace fixed source with **moving shell plus a retarded field**; evolve the field and its energy alongside the source, particle, radiation and sink, with independent convergence tests.
2. Replace the imposed loss coefficient with a microscopic scattering/interaction operator and measured environmental density; derive redshift and arrival-interval stretching *from that operator*.
3. Show whether the same coupling constants apply to clock, photon and matter sectors from a common action, without creating ghosts or violating known laboratory constraints.
4. Compute distinct signals that could be sought in **untrained** sky data, with preregistered nuisance parameters and quantitative exclusion criteria.

**Source and preservation note:** Full report bodies remain in `docs/long-term-memory/reports/R01.md`–`R24.md`. R10–R24 are annotated working editions and still require scientific line editing. Do not replace them with this summary.

## R41 implementation note: testable attractive-field candidate (2026-11-23)

R41, added after the prior model architecture, posits an energetic and momentum-carrying physical scalar degree of freedom and like-sign attractive particle coupling. Its dynamic source/receiver force is delayed, its equal/opposite source recoil is accounted for, and its total momentum is numerically conserved. Whole-system energy has small time-step error that converges; the coupling was chosen, not independently measured. It is a **separate bounded candidate** from the R39 weak-field photon deflection and R40 messenger impact models, and does not unify their physical mechanisms yet. [R41](../reports/R41.md); [formal mathematical methods](attractive-field-methods.md); [evidence ledger](attractive-field-ledger.md). Distinct next experiment: derive photon coupling, do 3D shell/boundary momentum flux, pre-register observable under exact primary data measurement constraints.
