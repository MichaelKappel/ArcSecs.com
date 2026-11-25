# ArcSecs Research 04 — Astronomical distances — transport, anchors and extreme objects

**Status:** curated working report, Part XXIX; conditional derivations and candidate development, not a new observation or completed fit. The twelve-foundation charter in `../../.uai/constraints.uai` governs all work. Original line citations below refer to the separately preserved input archive.

## Retained research material

### D-01 · derived estimator test

1 Mpc=10^6 pc gives distance modulus 25 in the standard inverse-square control and c0 travel time about 3.26156 Myr. For a stationary 1 Mpc source and v(age)<=c0, D_TOF=c0 tau>=D_true; strict slowing on a nonzero interval gives overestimate. With exponential v=c0 exp(-gamma t), D_TOF/D=-ln(r)/(1-r), r=v_arr/c0, giving 1.38629 at r=0.5. This is exactly the user’s initial motivation, not a redshift distance measurement. The explorer separately considers a raised earlier emission ceiling; quarantine that alternative pending owner approval and actual C-01 field derivation. Its displayed integral and endpoint velocities are not the same law.

Source loci: `R04:10-19; R04:31-36; X04:176-259; X04:637-661`.

### D-02 · derived calibration relations; source-reported anchors

Flux/distance control m-M=5 log10(D/10 pc)+A_lambda. Ignored positive extinction makes D_inferred/D=10^(A_lambda/5). For a modulus offset Delta mu, exact fractional ratio is 10^(Delta mu/5)-1, not Delta mu/(5 log10 e) except at small offsets. Keep dust, metallicity, blending, calibration and lensing as independent nuisance parameters. Source reports LMC 49.59+/-0.54 kpc and NGC4258 7.576+/-0.082(stat)+/-0.076(sys) Mpc; preserve these geometric/astrophysical anchors, verify against primary data before use in likelihood. Do not carry over claimed chains/figures that were not supplied.

Source loci: `R04:10-19; R04:22-36; R04:57-62`.

### D-03 · candidate physical outflow; not fitted

Investigate a physically moving material regulator entrained with matter velocity u_m=H_phys(T)x. For homogeneous flow, x=S(T)chi is a trajectory label with S derived from H_phys, not stretching of space. Number continuity is partial_T n+div(n u_m)=0. Derive the eikonal Hamiltonian and energy exchange for light in that moving material, not a rescaled LambdaCDM plot. If a model yields D_A=S_e chi and D_G=chi (S_a=1), verify reciprocity, endpoint standards and the observed spectral and pulse relations before claiming distance duality. The HTML applies highZFactor and 1/sqrt(mu) to reference D_A,D_L by construction; those plotted reductions are sensitivity examples only.

Source loci: `X04:120-135; X04:775-822`.

### D-04 · source-reported benchmark / cohort rules

Use conventional distances only as named comparison estimators. Retain high-z angular-distance turnover as a target; static tired-light angular distance control increases inferred size at high z and is not an active candidate. Keep foreground photometric misclassification (Capotauro) separate from multi-line high-z spectra (GN-z11 z=10.603; JADES-GS-z14-0 ALMA z=14.1793+/-0.0007 as reported). Check source identification and original angular half-light radius before any size claim; an individual lens magnification is not proof of global distance overestimate. Redshift alone does not determine physical distance.

Source loci: `X04:273-306; X04:383-405; X04:775-822`.

### D-05 · derived sensitivity, not inferred revisions

Preserve requested object cohort: WOH G64, HV 888, HV 11423, LGGS J004520.67+414717.3, Holmberg 15A, Phoenix A, TON 618. For measured angular radius theta, R=theta D_A (small angle). For fixed bolometric flux, L=4 pi D_L^2 F; stellar effective temperature fixed implies inferred radius proportional to D_L under the stated emission model. Dynamical BH mass M~v^2 theta D_A/G scales with D_A; single-epoch virial M~L^a v^2 scales with D_L^(2a), typically a near 0.5 only for the calibration used. Eddington luminosity proxy scales as D_L^2 at fixed ratio. Strong independent Local Group distances restrict dramatic star corrections. TON 618 is a high-priority sensitivity test; compare BLR line-width, reverberation and lensing uncertainties before revising masses. Preserve the following source-reported dossier values as reproduction targets (not fresh literature verification): WOH G64 R=1540 R_sun nominal, model spread 800–1788 R_sun; dust torus and binary state dominate. HV 888 R=1374 R_sun nominal, temperature-scale spread 1353–1509; HV 11423 R=1086 R_sun nominal, spectral-state spread 960–1220. The LGGS candidate has an evidence gap: confirm catalog identity, membership and spectrum before assigning a physical radius. Holmberg 15A: 40 versus 21.6 billion solar masses reported for axisymmetric versus triaxial orbit models, a major estimator change independent of cosmic transport. Phoenix A: roughly 10–20 billion solar masses feedback proxies versus 100 billion scenario, not direct dynamical mass. TON 618: reference z=2.219 and 40.7/66 billion solar-mass virial estimates; not independent horizon measurements. Treat all numbers as inputs to uncertainty and sensitivity studies, not verified revised sizes.

Source loci: `X04:420-504; R04:22-29; X05:325-350; X04:969-1100`.

### D-06 · joint transport requirement

Compute emitted/arrival/physical separation, geometric path, TOF proxy, angular distance D_A, area/reciprocal distance D_G, luminosity distance D_L and redshift estimator explicitly. With photon-number throughput Tcal, energy ratio E_a/E_e=1/(1+z), measured arrival stretch A, F=L_e Tcal/[4 pi D_G^2(1+z)A]; D_L=D_G sqrt((1+z)A/Tcal). Under the specific Part XXVI assumptions A=1+z, this reduces to D_L=(1+z)D_G/sqrt(Tcal). Require measured angles/fluxes, time stretch, BAO and independent anchors jointly. A magnification slider or independent free opacity cannot demonstrate Foundation 12. Fit shared physical parameters and covariance.

Source loci: `R04:57-74; X04:132-135; X04:292-306`.

## Import corrections and boundaries

- R04 prose supplies dust/ladder controls but changes the commissioned extreme-object cohort. Use the seven owner-selected objects from X04. R04 line 41 misidentifies the GW170817 optical counterpart as SN 2017cbv; do not reuse that designation (use AT2017gfo after source verification).
- Do not carry the claimed H0 chain, calibration pipeline or example dossiers as reproduced results: supporting data and code were not uploaded. Use exact modulus conversion.
- X04 lines 637–661: the integral corresponds to an age-law derivative unlike the displayed emission/arrival endpoint formula. Hold elevated earlier ceiling branch pending explicit owner approval; use the fixed local-c0 experiment as the current control. X04 795–822 uses a post hoc reference-distance slider, not a derived C-01 cosmology.

## Next implementation

Run actual rays from fixed and moving sources to a calibrated receiver; derive both optical Jacobi maps and flux plus pulse transfer. Fit anchors first, then high-z jointly; report each extreme object’s estimator and uncertainty.

Deliver a runnable solver, parameter file, raw observables, residuals and convergence results. Keep findings separate from proposals and cite source literature before publishing numerical empirical claims.
