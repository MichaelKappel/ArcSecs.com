# External-Domain Pull and Bubble Boundary Dynamics — Research Record

**Status:** ArcSecs hypothesis and test plan; no detected interbubble gravity or physical cosmic wall.

**Canonical book derivation:** [Chapter 30A](../../../book/book.md#chapter-30a-could-other-bubble-universes-pull-on-ours-a-quantitative-arcsecs-model).

**Parent question:** Can physical domains outside our observable region change our domain's wall, internal matter motions, or light signals? The central prediction must distinguish isotropic pressure-driven growth from external tidal distortion and from a new finite-range field coupling.

## Models and their distinct observables

| Model | Physical driver | Expected first signature | Status |
|---|---|---|---|
| BP-1 | Difference in physical pressure across a wall | Isotropic monopole change if a real wall exists | Classical toy derivation; wall unobserved |
| BP-2 | Ordinary exterior inverse-square gravitational field | Directional acceleration/tides, generally not isotropic cavity growth | Shell theorem/tidal derivation; external universe unobserved |
| BP-3 | Screened Yukawa-like parent field | Nonzero cavity radial force away from center for exterior shell | Proposed interaction; carrier and coupling unconfirmed |
| BP-4 | Bubble collision transferring radiation/stress | CMB temperature/polarization and other correlated directional patterns | Published model predictions; no confirmed detection |

## Verified mathematics vs. unknown physics

The thin-wall energy `U = 4πσR² − (4π/3)ΔP R³` and force `F = 4πR²ΔP − 8πσR` are derived for an idealized thin membrane in a pressure difference, NOT for a proven cosmic wall. The critical radius `2σ/ΔP` is an unstable threshold in that approximation. Newtonian exterior spherical shells have no interior gravitational acceleration; a new range-limited field has to be specified for a different outcome. A directional exterior source yields a tidal rather than automatically isotropic disturbance.

## Independent tests and pass/fail gates

1. Re-run `python tools/bubble_force_toy.py` and `python -m unittest tests.test_bubble_force_toy -v`; verify derivative, critical radius and shell-field limits.
2. Derive the physical parent-field source, wall boundary conditions and carrier propagation; prohibit an arbitrary free function chosen after seeing data.
3. Establish a common parameter set that survives laboratory/local gravity bounds and predicts sky-level anisotropy or collision features.
4. Run preregistered CMB analyses with false-alarm trials correction and independent sky-map holdouts. Null detections restrict stated amplitudes, not every possible multiverse theory.
5. Quantify how a wall changes internal galaxies or photon propagation; do not assume wall radius is the redshift-derived cosmic scale.

## Evidence and source links

- [Gott 2017 — negative pressure and growing bubbles](https://aeon.co/essays/did-our-cosmos-emerge-from-a-sea-of-inflating-bubbles)
- [Coleman–De Luccia 1980 — gravity and vacuum decay](https://doi.org/10.1103/PhysRevD.21.3305)
- [Newtonian shell theorem — textbook derivation](https://galaxiesbook.org/chapters/I-01.-Gravitation_2-Spherical-systems%3A-Newton%27s-shell-theorems.html)
- [Feeney et al. 2011 — collision-search methods and WMAP null result](https://doi.org/10.1103/PhysRevD.84.043507)
- [Aguirre et al. — exact thin-wall collision analysis](https://authors.library.caltech.edu/records/ems06-8jm44)

**Related full-depth source records:** [R07](../reports/R07.md), [R08](../reports/R08.md), [R09](../reports/R09.md). These retain the research context and must not be overwritten by this new concise, reviewed derivation.

## Causal external-field follow-up (BP-3, newly derived)

[Chapter 30B](../../../book/book.md#chapter-30b-deriving-a-causal-external-field-coupling-beyond-the-bubble-analogy) and [the new reproducibility record](external-coupling-v2.md) specify a finite-speed screened field, exact shell force, SI benchmark, energy limitations and observational gates. No extra-universe force detected.
