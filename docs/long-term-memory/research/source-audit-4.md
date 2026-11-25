# Four-Report Primary-Source and Inference Audit

**Date:** 23 November 2026. **Scope:** detailed priority claims in [R25](../reports/R25.md), [R26](../reports/R26.md), [R30](../reports/R30.md), and [R36](../reports/R36.md). This is a documented targeted primary-source review, not peer review of the 37-report archive. **Claim entries:** 34. The full claim-by-claim matrix is [source-audit-claims.csv](source-audit-claims.csv). The local arithmetic checks live in `tests/test_primary_source_arithmetic.py`.

## Editorial purpose and boundaries

The ArcSecs eleven-principle charter, owned by `.uai/totem.uai`, remains the author's worldview and research agenda. This audit **does not revive material spacetime as a proposed mechanism**. It compares measurements, reported parameter estimates, conditional calculations, and explanatory claims as distinct categories. Neither a successful mathematical benchmark nor a simulation automatically settles ontology. Conversely, a premise or model cannot be rewritten as an independent positive experimental detection without evidence.

No original uploads were deleted; no report was truncated. The four working reports received an export-safe verification addendum, and a small number of demonstrably overstated or erroneous phrases were corrected in place. Others remain for later line-by-line audit.

## Key findings, precise revisions and next tests

### R25 — Horizon crossing and finite detector signals

- **Validated numerical example:** A particle freely released from rest at six gravitational length scales in the specified idealized radial-infall benchmark accumulates about 14.8269 gravitational light-crossing units before reaching radius two, and approximately 1.4687 units from radius three to two. These are predicted *local clock intervals*, not a direct observation of an astrophysical crossing.
- **Overreach corrected:** “Last escaping photon” and “permanent signal silence” were being presented as deterministic detector facts. The revised report labels them **conditional stochastic emission/receiver forecasts**. Real measurements constrain finite detector counts, instrument thresholds and spectral fading.
- **Next calculation:** Add Poisson photon emission, ray escape probability, detector frequency response and upper/lower detection-time confidence limits; compare to EHT and other actual data without claiming a telescope times an event-horizon crossing.
- **Primary article:** Matt Visser, *Physical observability of horizons* (2014), [DOI](https://doi.org/10.1103/PhysRevD.90.127502).

### R26 — Physical processes and constant progression

- **Validated published observables:** NIST measured gravitational frequency shifts across a millimeter-scale atomic sample; the CERN storage-ring experiment measured a positive-muon decay lifetime of 64.419 ± 0.058 microseconds at gamma 29.33.
- **Important correction:** The thorium-229 sensitivity parameter K=5900(2300) is a nuclear-model **estimate** informed by spectroscopy, not a precise direct calibration. Its substantial uncertainty must enter the proposed nuclear/atomic comparative test. The October 2026 thorium-clock operation is real, but the new ArcSecs discrimination experiment remains a proposal.
- **Next calculation:** Develop explicit motion-dependent interactions across electromagnetic, nuclear and weak processes. A common factor exactly reproducing established ratios remains observationally degenerate unless an independent differential signature is derived.
- **Primary sources:** [NIST 2022 clock paper](https://www.nist.gov/publications/resolving-gravitational-redshift-across-millimetre-scale-atomic-sample), [CERN muon paper](https://cds.cern.ch/record/878581), [2025 sensitivity analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC12528423/), [2026 thorium clock](https://pmc.ncbi.nlm.nih.gov/articles/PMC13686927/).

### R30 — Photon mass evidence and the rest-mass discrimination problem

- **Directly evidenced:** Photons carry energy and momentum and respond to gravitation. The Particle Data Group lists upper limits for **invariant rest mass**, not a positive detection. Its solar-wind-derived benchmark is 1 × 10⁻¹⁸ eV/c² (mass equivalent approximately 1.78 × 10⁻⁵⁴ kg), conditional on the field model.
- **Important distinction:** Mass-equivalent energy, inertia in momentum exchange, effective in-medium mass and intrinsic vacuum rest mass are separate quantities. The ArcSecs premise “photons have mass” remains the project position; claims about *which mass* has been detected must specify the observable.
- **Next experiment:** Predict a Proca-like longitudinal mode, static-field correction or multi-frequency propagation deviation that can be separated from plasma and lensing nuisance parameters. No verified positive rest-mass detection is available in the cited sources.
- **Primary sources:** [PDG 2025 photon mass listings](https://pdg.lbl.gov/2025/listings/rpp2025-list-photon.pdf), [lensed-FRB rest-mass upper bound](https://doi.org/10.1103/PhysRevD.111.L041304).

### R36 — Physical redshift models, DES timing and COBE/FIRAS

- **Validated published parameter:** DES reports a light-curve width exponent 1.003 ± 0.005 (statistical) ± 0.010 (systematic) for 1,504 Type Ia supernovae. This quantifies signal-event intervals; it is not a direct observation of a material called time. A model predicting zero interval stretch is inconsistent with the measurement.
- **Arithmetic correction:** The printed `1.67e-53` for the toy FIRAS redshift threshold was a transcription error; the manuscript's own assumed greybody normalization gives approximately `1.67e-5`. **This is not a model-independent upper bound on every photon-energy-loss mechanism.**
- **Bibliographic correction:** The CMB 1996 FIRAS spectrum study reported 2.728 ± 0.004 K (95% confidence), while the refined 2.72548 ± 0.00057 K temperature comes from the 2009 synthesis.
- **Model qualification:** The claimed 1.94–2.70% maximum tired-light share assumes a particular `b_eff = 1 - f_TL` ansatz and simplified uncertainty handling; it is not a bound on all physical-propagation models. The proposed speed-damped transport law still needs a physical energy source/sink and independent optical/radio/CMB predictions.
- **Primary sources:** [DES light-curve-width study](https://academic.oup.com/mnras/article/533/3/3365/7738388), [DES official public data](https://github.com/des-science/DES-SN5YR), [Fixsen et al. 1996](https://arxiv.org/abs/astro-ph/9605054), [Fixsen 2009](https://arxiv.org/abs/0911.1955).

## Remaining uncertainty

- No raw DES, FRB, FIRAS spectra or EHT visibility files were downloaded or jointly fitted in this audit.
- The four manuscripts contain many additional numbered sources and precision claims not included in this targeted verification. Preserve them with their existing author-attributed status, not as newly verified facts.
- A detection claim must not be inferred from “physically intuitive,” “mathematically fits,” “below an upper limit,” or “simulated” alone.
- **Next bounded action:** Verify the physical gravity report R35 and the physical photon-deflection report R31 against Cassini/VLBI/EHT benchmarks; then rerun the DES timing model on official released curves to validate the R36 forecasts before changing the book.

## Direct source records

- **PDG25**: https://pdg.lbl.gov/2025/listings/rpp2025-list-photon.pdf
- **DES24**: https://academic.oup.com/mnras/article/533/3/3365/7738388
- **DESDATA**: https://github.com/des-science/DES-SN5YR
- **NIST22**: https://www.nist.gov/publications/resolving-gravitational-redshift-across-millimetre-scale-atomic-sample
- **CER77**: https://cds.cern.ch/record/878581
- **TH25**: https://pmc.ncbi.nlm.nih.gov/articles/PMC12528423/
- **TH26**: https://pmc.ncbi.nlm.nih.gov/articles/PMC13686927/
- **VIS14**: https://doi.org/10.1103/PhysRevD.90.127502
- **COBE96**: https://arxiv.org/abs/astro-ph/9605054
- **COBE09**: https://arxiv.org/abs/0911.1955
- **FRB25**: https://doi.org/10.1103/PhysRevD.111.L041304
