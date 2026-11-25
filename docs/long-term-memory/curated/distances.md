# Astronomical distances — 3D outflow, optical maps and anchors

Curated active research report | 30S memory consolidation | 2026-11-23

Status: source-derived research direction and conditional analytical checks; no new observed mechanism or joint observational fit. The 12 principles remain the authorial charter. Rejected implementations are not research instructions. Source IDs and exact input line ranges resolve through the [source register](sources.md).

## D-01 — Distance modulus, dust and signed distance ratio
**Status:** corrected analytic.  **Input:** D-M L3–18; D-M L31–34.

For calibrated luminosity and extinction A_lambda, m-M=5 log10(D_L/10 pc)+A_lambda. One Mpc gives 25 mag without extinction. Ignoring positive extinction overestimates distance by 10^(A_lambda/5). For two moduli on the same calibration, D_method/D_anchor=10^[(mu_method-mu_anchor)/5]; signed ratio is this minus one (not the linearized modulus difference except at small offsets). Use 3D dust, extinction law, blending and metallicity as explicit nuisance variables, not a universal propagation correction.

## D-02 — Independent geometry and local calibration
**Status:** source-reported anchors.  **Input:** D-M L22–29; D-H L897–920; D-H L575–581.

Retain Gaia parallax/zero-point, detached eclipsing binaries and water megamasers as distinct anchor methods. Source-reported LMC 49.59 kpc (0.09 stat, 0.54 syst) and NGC 4258 7.576 Mpc (0.082 stat, 0.076 syst) are literature lookup targets; SMC and M31 cross-checks remain useful. Do not import explorer "maximum shift" values as measured bounds. Calibrate radar, parallax, binary dynamics and maser observables under the proposed field theory. Large distance corrections must preserve independent geometry.

## D-03 — One Mpc sign reversal with consistent endpoint velocities
**Status:** repaired candidate.  **Input:** D-H L176–228; D-H L641–662.

The supplied JavaScript distance integral is D/(c0 tau0)=x+(eta/g-1)[x-(1-exp(-g x))/g], x=tau/tau0, g=gamma tau0. It does NOT integrate the separately displayed emission/arrival speeds. A consistent interpretation uses lookback s from arrival and v(s)/c0=1+(eta/g-1)(1-exp(-g s/tau0)), 0<=s<=tau: arrival is c0 and emission is v(tau). For eta>g, speed is larger in the past and decreases toward arrival, so D_TOF/D<1; eta=g gives equality; eta<g reverses the sign and is not an aging solution. This repairs the kinematic illustration only, not the source-independent physical propagation law. Fixed initial speed c0 with subsequent slowing gives the opposite TOF sign. No distance or light travel age is inferred from redshift alone.

## D-04 — Entrained 3D physical outflow
**Status:** candidate and derivation gate.  **Input:** D-H L129–134; D-H L279–308; D-H L840–852; D-H L1260–1277.

Explore physical positions x=S(T) chi and velocity u_m=(dot S/S)x, where S labels trajectories rather than a material spatial substrate. For an explicitly assumed entrained propagation law dx/dT=u_m+C(T)n in a homogeneous model, dchi/dT=C(T)n/S(T). The comoving coordinate path is integral C/S dT. Derive emission and arrival angle maps, matter-clock conversions and phase transport from an action before identifying D_A=S_e chi, D_G=S_a chi, A=1+z, or conventional duality. These identities may be recovered only under additional endpoint and redshift assumptions. Do not reuse chart ratios, imposed high-z compression or a reference LambdaCDM curve as independent predictions.

## D-05 — Lensing and flux must be paired
**Status:** conditional analytic.  **Input:** D-H L292–308; D-M L47–55; D-H L132–134.

For a specified magnification mu and unchanged source, effective angular-area distance scales as D_A/sqrt(mu); flux increases by mu, with effective luminosity distance D_L/sqrt(mu) if emitted luminosity is fixed. Magnification is sightline-specific and selection-biased; it is not a universal smaller-object correction. Use the 30R/Part XXVI two-direction optical ledger: F=L_e T_surv/(4 pi D_G^2 Z_E A). Derive both directional Jacobi maps, source and receiver rates and extinction. Jointly test surface brightness, flux, angle and arrival time.

## D-06 — Extreme objects and classification controls
**Status:** conditional sensitivity and source leads.  **Input:** D-H L375–390; D-H L988–1096; G-H L324–325.

Keep WOH G64, HV 888, HV 11423, the M31 candidate, Holmberg 15A, Phoenix A and TON 618 as individual dossiers, not a single correction factor. WOH G64 has dust/temperature/geometry sensitivity; HV objects require temperature, extinction and membership; M31 candidate lacks verified primary parameters in the explorer; Holmberg 15A dynamical mass depends on orbit modeling; Phoenix A indirect masses are not direct measurements; TON 618 virial calibration and luminosity are model-dependent. At fixed temperature and bolometric flux, R_star scales with D_L and L with D_L^2. A virial mass with R_BLR proportional to L^a scales with D_L^(2a) at fixed velocity and calibration; an Eddington-luminosity mass scales with D_L^2 only if Eddington ratio is fixed. Foreground dwarf contamination must be separated from spectroscopically verified high-redshift galaxies; proper motion and spectra are independent checks. Do not import unverified object masses or revised classifications without primary-source validation.

## D-07 — Covariance-aware distance inference
**Status:** test design.  **Input:** D-M L57–74; D-H L305–308.

Build a data vector of raw angles, fluxes, calibrated magnitudes, parallaxes, line spectra and time delays. Fit physical parameters and shared calibration nuisance terms with a documented covariance, holdout sample and same observables for the control. The Markdown claims a completed ladder fit, posterior chains and code not supplied in this intake. Do not use its claimed H0 posterior or residual scatter as a verified result. A smaller inferred size is conditional on independently constrained distance and object model, not a predetermined fit outcome.

