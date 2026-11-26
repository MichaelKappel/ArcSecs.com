# ArcSecs Physics Engine 3.141.3 — Scientific Source Alignment (Round 3)

## Scope and source authority
This is an incremental upgrade to plugin 3.141.2, compatible with the 3.141.0 Scientific Research Library theme. The original book and Review 6 manuscripts were inspected as Markdown. The original archived Python implementations and numerical tables were used as reference fixtures. No new observational fit, physical experiment, or original Python simulation rerun was performed. The book and paper themselves were not modified. The review is targeted, not an exhaustive line-by-line audit of all 41 reports. The source inventory records all report titles and hashes, not complete implementation of all reports.

## What is now implemented
All three demos expose a dedicated Review 6 experiment lab with original source links, normalized units (except the book-specific SI intake and magnitude controls), controls, calculated results and JSON export. Escape results include a plotted population history and full sample export. Finite-cell results include the full sampled history in the export. Existing legacy worker equations, trajectories and default numerical telemetry were preserved; only version strings changed in those files. The main legacy navigation warns that its older proxies are not the Review 6 solver.

| Experiment | Source | Tested boundary |
|---|---|---|
| Escape-assisted conversion | Part XXXIV K11–K13 | All 6 archived cases, 14,406 sample rows, derivative, ledger, 90% sampled escape, independent RK4 integration; monotone total converted population is not photon speed. |
| Collinear phase match | K7 | Reference conserved energy and momentum; absent forward channel controls. Fixed branch masses and energy; sign-changing roots located by convex split/bisection; near-tangent roots can require higher precision. |
| Transfer floor | K4 | Fixed reference; negative forward invariant. |
| Finite-range exchange | K4–K6 | 12 large-gap reference rows; transformed Simpson quadrature (4096 vs 2048 panels); cone fraction and formal cross section within 1e-8 relative tolerance. Other 60 rows, higher-order physics and actual multiple scattering remain open. |
| Finite capacity | K9–K10 | All 15 archived cases, 12,015 time samples; independently coded Jacobi eigensolver, norm, capacity, total Hamiltonian energy and archive comparisons. Reverse transitions retained. |
| Fixed-Q detuning | K10 | 401 source rows; includes free-energy mismatch. |
| Optical and receiver controls | K7 Gaussian aperture, stationary timing and detector current ratios | All eight aperture, three timing and five detector rows; no calibrated absorption rate or universal pulse stretch. |
| Temporal dressing | K14; emission constraint | Fixed-momentum energy derivative and finite-gap group-speed deficit inequality. |
| Distance inference | Book D-01/D-03 | Dust, signed modulus ratio, two distinct time-of-flight histories including opposite signs; not an astronomical fit. |
| Propulsion intake | Book ch.14 | First-order eta*rho*A*v estimate, zero-density and zero-efficiency controls, SI units, restricted to <=0.01c; no invented net thrust. |

## Numerical testing
33 additional automated JavaScript tests; total 247 passing, 58 baseline legacy failures, zero unexpected failures or missing baseline tests. The legacy test debt remains visible; strict original suite is still red. All 29 original worker golden numerical baselines continue to pass. TypeScript, PHP syntax and PHP behavior tests pass via npm test. Nine isolated Chromium browser configurations (3 demos x 390/768/1440 px) pass with zero uncaught JS errors or horizontal document overflow. Tests execute the new experiments, escape data export, stale export invalidation, negative phase-match and escape regimes, keyboard isolation and original simulation workflows. Browser harness uses rendered PHP stubs and real JS, not a running WordPress install. Hardware GPU, live WordPress and GitHub-hosted CI have not been verified. The existing CI workflow is included in the incremental repository overlay. No deployment or push performed.

## Research coverage and unresolved requirements
The 12 foundations are stipulated research commitments. Coverage does not imply truth. The complete research program requires the actual C-01 matter-sourced regulator and causal collective inertia, dynamic wall and history solver (including Part XXXI interval certificate), positive-gap physical emission, conserved-current atomic/nuclear receiver, reciprocal spatial reservoir and thermal reverse channels, high-precision near-degenerate scattering, joint angular/flux/timing/spectral calibration and held-out astronomical likelihood. Physical drive still requires measured substrate, cross-section, mass, momentum, exhaust, drag, power and heat ledgers; a zero-inertia void assumption is not justified. The existing mission simulators remain hypothetical visual models, not a solution of these gates.

The JSON inventory includes the 29 scenario limitations, 25 book bridge identifiers, 12 charter statements, 41 indexed reports and hashes of original reference fixtures. The remaining source coverage must be assessed per mechanism and equation rather than inferred from a title match. Two book bridge controls are implemented only in restricted form. No full observational bridge is marked complete.

## Install
Back up WordPress. Replace plugin through Plugins > Add New Plugin > Upload Plugin with the 3.141.3 archive. Retain the 3.141.0 theme. Clear caches; visit all three demos and open Review 6 experiment lab. GitHub overlay is incremental against 3.141.2; apply after that baseline. The original component-specific licenses remain unchanged. Original scientific reference data is included as test fixtures under the repository's scoped CC0 policy; no additional third-party rights inferred.

## Legacy scenario audit

| Scenario | Scope limitation |
|---|---|
| `control` | Conventional synthetic regression, not measured dataset. |
| `vsl` | Prescribed 1.25-to-1 speed ratio; no C-01 matter-sourced constitutive law or physical calibration. |
| `relationalLattice` | Illustrative graph and prescribed sinusoidal outputs; no solved autonomous field dynamics. |
| `relationalFlatSpaceEngine` | Illustrative relational architecture; no solved coupled matter/field dynamics. |
| `absoluteTimeQuantumOscillator` | Prescribed local damping; no derived optical/nuclear/decay clock comparison. |
| `teleparallelGravity` | Illustrative output; not a calibrated retarded gravity solver. |
| `tiredLightPhotonDecay` | Prescribed exponential attenuation; not microscopic exchange or speed history. |
| `mechanisticTiredLight` | Density-scaled exponential and strictness slider; no derived differential scattering or optical-depth model. |
| `entropicBetaMatter` | Prescribed beta response; not a global Machian integral. |
| `mondRotationCurves` | Toy mass dependence; not fitted SPARC data or a held-out prediction. |
| `procaPhotonDispersion` | Illustrative animation signature; diagnostic dispersion is distinct from travel-history claim. |
| `massivePhotonProca` | Restricted frequency-dependent dispersion; not an invariant-mass measurement or emission theory. |
| `eitSlowLight` | Group velocity and storage proxy; not vacuum photon aging. |
| `flatSpaceLensing` | Reduced deflection proxy; not joint optical map, flux and chromaticity validation. |
| `massivePhotonLensing` | Reduced deflection proxy; no calibrated wave-optical detector. |
| `newtonianDarkStar` | Newtonian escape threshold toy; not a complete horizon or local relativistic crossing calculation. |
| `superluminalGalilean` | Arithmetic relative speed, not a measured superluminal causal signal. |
| `tiredLightEnergyLedger` | Prescribed complement of lost energy; not independent recipient dynamics. |
| `darkMatterCondensate` | Halo-like accumulation proxy; no derived dark substrate or empirical fit. |
| `distanceTimeKernel` | Synthetic event profiles; arrival and redshift proxies are not a common astronomical fit. |
| `singularitySafeGravity` | Softened force toy; not a derived regular field theory. |
| `monteCarloPhotonPipeline` | Seeded reduced transport; not K6 angular kernel or measured scattering cross sections. |
| `parallaxCalibration` | Small-angle baseline/angle control; not a universal astronomical distance correction. |
| `photometricCalibration` | Background/aperture reduced calibration; not full reciprocal ray-bundle prediction. |
| `rigidBodyDiagnostics` | Generic numerical visualization; no research validation implied. |
| `ccctl` | Prescribed attenuation proxy; not Review 6 microscopic mechanism. |
| `darkMatterDrive` | Prescribed thrust and shield proxies; no measured capture or net thrust demonstration. |
| `darkMatterRamjet` | Conceptual subsystem engineering model; substrate, capture coupling and global inertia unverified. |
| `sunSimulation` | Synthetic orbital regression; not precision ephemeris integration. |

## Book research bridges

| Bridge | Source title | Status |
|---|---|---|
| D-01 | Distance modulus, dust and signed distance ratio | restricted analytical control implemented; full observational bridge open |
| D-02 | Independent geometry and local calibration | open: complete bridge not implemented |
| D-03 | One Mpc sign reversal with consistent endpoint velocities | restricted analytical control implemented; full observational bridge open |
| D-04 | Entrained 3D physical outflow | open: complete bridge not implemented |
| D-05 | Lensing and flux must be paired | open: complete bridge not implemented |
| D-06 | Extreme objects and classification controls | open: complete bridge not implemented |
| D-07 | Covariance-aware distance inference | open: complete bridge not implemented |
| T-01 | Universal ordering and physical clock response | open: complete bridge not implemented |
| T-02 | Inherited motion and relational inertia | open: complete bridge not implemented |
| T-03 | Moving sources plus weak transport aging | open: complete bridge not implemented |
| T-04 | Different causal reaches | open: complete bridge not implemented |
| G-01 | Retarded spin-2 physical interaction (M1) | open: complete bridge not implemented |
| G-02 | Gravity and dark-sector discrimination | open: complete bridge not implemented |
| G-03 | Capture, escape and local versus coordinate velocities | open: complete bridge not implemented |
| G-04 | Energy recipient and momentum exchange | open: complete bridge not implemented |
| P-01 | Gauge-consistent positive-gap photon architecture | open: complete bridge not implemented |
| P-02 | Environmental gap and phase-dependent limits | open: complete bridge not implemented |
| P-03 | Atomic recoil and independent force-range test | open: complete bridge not implemented |
| P-04 | Reciprocal aging and causal memory | open: complete bridge not implemented |
| P-05 | Transport diagnostics and closed ledger | open: complete bridge not implemented |
| C01-01 | Constitutive origin of a local emission characteristic | open: complete bridge not implemented |
| C01-02 | Finite-range causal collective inertia | open: complete bridge not implemented |
| C01-03 | Shell and void response | open: complete bridge not implemented |
| C01-04 | Separate characteristic, group and causal speeds | open: complete bridge not implemented |
| C01-05 | Operational calibration and void experiment | open: complete bridge not implemented |

## v3.141.4 supplement
See [cosmic-evolution.md](cosmic-evolution.md) for the separate conventional and hypothetical greater-cosmos experiments and their limits.
