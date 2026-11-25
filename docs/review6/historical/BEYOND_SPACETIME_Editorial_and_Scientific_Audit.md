# BEYOND SPACETIME — Scientific and editorial audit

**Reviewed:** `BEYOND_SPACETIME_KDP_Hardcover_Interior(1).pdf`, 380 PDF pages, November 24, 2026. All page numbers below are hardcover/PDF pages, not the restarted pagination in the final review. **Disposition:** revision recommended before publication. The twelve ArcSecs foundations are preserved as the research charter; this audit evaluates implementations and claims, not the author's right to investigate them.

## Scope and verdict

I extracted text from the whole PDF, examined the contents and selected pages across the narrative, technical studies, appendices and appended Review 3.0, rendered representative pages, ran a whole-document page-size/text-margin/raster-image/font inspection, independently rederived selected mathematical expressions and recomputed the numerical examples listed below. I checked selected primary literature and KDP requirements. This is a substantial targeted audit, not a proofread of every sentence, independent replication of every simulation, verification of every bibliography entry, or an experimental validation of the proposed theory. The full main-book source repository, `tools/entrained_outflow_v1.py`, `tools/bath_recoil_v1.py`, and the reported full test suite were not supplied as executable files in the reviewed PDF. I have independently implemented selected calculations, not assumed the reported test totals were independently verified.

The manuscript has real strengths: its evidence taxonomy (pp. 8–13), distinction between spectral shift, propagation speed and pulse timing, repeated explicit conservation requirements, and documented negative controls. The book is best described as a conditional research program and computational technical record. It is not yet a unified calibrated replacement cosmology, as the manuscript itself acknowledges (pp. 343, 375–379). I would retain the strongest derivations and revise the architecture, not restart the book from scratch.

## A. Confirmed corrections

### A1 — High priority: unify the tidal tensor sign convention (pp. 126, 137)

Page 126 defines T_ij = ∂i∂j Φ_ext, whereas p. 137 calls GM(3 n_i n_j − δ_ij)/D³ the same tensor. With the convention Φ = −GM/r and gravitational acceleration g = −∇Φ, the latter formula is the acceleration-gradient tensor, not the Hessian of Φ.

Use **T_ij = ∂j g_i = −∂i∂j Φ** consistently. Then for a distant point source T_ij = GM(3 n_i n_j − δ_ij)/D³, and relative acceleration is δg_i = T_ij δx_j. The eigenvalues are +2, −1, −1 times GM/D³. Its trace is −∇²Φ, zero in Newtonian vacuum. For the screened shell, trace T = −Φ_X/λ² > 0 in the empty cavity when Φ_X < 0. Alternatively retain the Hessian definition but invert the formula and write relative acceleration with a minus sign. The physical elongation and compression descriptions on p. 137 are correct; this is a notation error with potential consequences for future solvers.

### A2 — Numerical correction: high-precision bath speed bound (p. 261, BS3)

For e=10⁻⁸, y=1/2, h=0 and a one-arcsecond angular tolerance, the high-precision bounds are approximately

- β_min = 0.9999999999764954694617768527457;
- β_max = 0.9999999999999998999999999999999925, i.e. 1 − 1.000000000000000075 × 10⁻¹⁶.

The book prints 1 − 2 × 10⁻¹⁶ for the upper endpoint. Replace with 1 − 10⁻¹⁶ to the shown precision. The lower endpoint and bandwidth (~2.35 × 10⁻¹¹) are correct. This is a floating-point-scale error, not a substantive change to the geometric conclusion. Compute with high precision or use a stable expansion; ordinary binary64 subtraction near unity is not reliable at this scale.

### A3 — Definition correction: remove redundant mean-radius mode (p. 128)

The displayed spherical-harmonic expansion adds R0(T) and sums over ℓ,m, while describing ℓ=0 as the average radius change. If R0 is the mean radius, start the sum at ℓ=1; if tracking perturbations around a fixed reference radius, keep u00 and explicitly define the reference. Otherwise R0 and the monopole coefficient describe the same degree of freedom. This matters for numerical identifiability of wall growth and tidal modes.

### A4 — Wording correction: finite density across infinite volume (pp. 252–253, 358)

Replace “uniform infinite-density kernel” and “uniform infinite density” with “a spatially infinite domain with uniform finite density ρ0.” The integral I_ref = gρ0λ² assumes finite ρ0, not infinite density. The void response formula and numerical examples are correct.

## B. Major model-integration issues, not arithmetic failures

### B1 — Highest scientific priority: Chapter 32A requires an explicit reference frame for the C-01 ceiling (pp. 119–122 versus 251, 345–348)

The printed Hamiltonian ω = u·k + W with u=Hx is Galilean-entrained. It gives dx/dT = u+v_rel. For a fixed C and Ω, v_rel=C²k/W decreases as k decreases. For a positive outgoing radial ray, the common-frame speed can increase: dv_rel/dT = −H v_rel Ω²/W², so d²x/dT² = H u+H v_rel(1−Ω²/W²) for constant H. With u≥0 this is positive. The medium-frame slowing result is correct; it does not imply a nonincreasing common-frame speed or common-frame front limit.

Independent evaluation of the printed p. 121 parameters H=.2, C=1, W_e=1, T_e=0, z=1, choosing the emitting source at χ=0 and a receiver in the positive direction:

| Ω/W_e | v_rel,a/C | u_receiver,a/C | dx/dT at arrival / C |
|---:|---:|---:|---:|
| 0 | 1.000000 | 1.000000 | 2.000000 |
| .01 | .999800 | 1.000200 | 2.00000004 |
| .1 | .979796 | 1.020621 | 2.000417 |
| .2 | .916515 | 1.091089 | 2.007605 |
| .3 | .800000 | 1.250000 | 2.050000 |

The table is not a new physical observation. It follows from the same OF5 benchmark: u_a=H S_a χ_s=C(W_e−W_a)/sqrt(W_a²−Ω²). It highlights an important restriction if the intended common-frame individual causal limit is C. The optical/timing table remains mathematically correct for its stated advection ansatz. The whole-sector front characteristics and admissible matter velocity field must be specified before the model can be called compatible with the C-01 ceiling. If C is a local medium-relative characteristic and the all-sector limit is different, say so explicitly, derive transformations and test the laboratory-frame ceiling. If a common-frame ceiling is intended, restrict the domain/velocity range or derive a replacement Hamiltonian. Do not add a numerical speed clamp. The unbounded Hx law on infinite fixed coordinates cannot be a globally bounded physical velocity field.

Suggested insert after OF7: “The monotonic statement refers to the local medium-frame group speed C²k/W; common-frame speed includes the material flow u. The prescribed advection model does not enforce the proposed individual causal ceiling in a common frame and is used only as a kinematic benchmark.”

### B2 — C-01 and positive mass: distinguish target from achieved result (pp. 42–43, 205–209, 251, 346, 349, 375)

For ω²=C_f² k²+Ω² with Ω>0, v_g=C_f sqrt(1−Ω²/ω²) is strictly below the characteristic for every finite permitted frequency. A front at C_f is not equivalent to a packet emitted at C_f. The manuscript recognizes this in several locations. Make the same caveat visible in the introductory physical narrative; otherwise readers may think the exact local emission ceiling has been derived. Preserve the user's C-01 question: why does newly emitted light begin at the locally established maximum rather than begin above it? Explicitly distinguish the idealized equality target, a tested near-ceiling approximation, and the front-speed alternative. A new dispersion or microscopic mechanism is needed for an exact finite-energy equality if that equality remains required.

### B3 — Impedance matching preserves one coupling, not all atomic clocks (pp. 161–165, 207–209, 346–349)

In the C-01 family ε/ε*=μ/μ*=sqrt(1+αI²), impedance Z=sqrt(μ/ε) is constant. At fixed e, ℏ and electron mass, a leading Coulomb atomic frequency nevertheless scales as ε⁻². If characteristic speed falls by two, ε doubles, the local atomic reference falls by four and homogeneous adiabatic photon frequency falls by two. Relative to the receiver's reference this yields 1+z_spec=1/2 (z=−0.5), not redshift. Chapters 30F and 30L already derive this conditional result. Link them explicitly to the retained C-01 family, whose impedance matching alone does not resolve the source/receiver standard problem. Do not silently equate constant dimensionless coupling with invariant spectra, or claim a universal observed shift from photon speed alone. A physical matter-rate law is required.

### B4 — Clarify the energy/rate calibration in flux equations (pp. 28, 121, 255–257, 350, 355)

The photon-counting formula F = L_e T_surv/(4πD_G² Z_E A) is correct when emission luminosity and received flux are expressed per the same time convention (or when identical stable calibrated clock rates are assumed). In the general ArcSecs clock framework, p. 350 correctly identifies physical clock stretch A_clock=(ν_r/ν_s) dT_a/dT_e for calibrated source and receiver clock tick counts. Define the operational photon energy ratio in consistent energy units and use A_clock for luminosity and flux measured per local clock unit, or explicitly restrict the displayed formula to common-T quantities. If detector standards vary, Z_E also needs an operational mapping. The special-case 0.16 throughput result on p. 355 remains correct under its declared assumptions. This is a missing generalization, not a correction to the restricted result.

### B5 — Keep the two incompatible 1 Mpc illustrations separate (pp. 26–27, 256, 353)

D-03 defines a lookback law with arrival speed equal to c0. For slowing trajectories in that law, emission speed exceeds c0, so a constant-today-speed travel estimate is too small. The user's clarified C-01 example assumes emission at c0 and subsequent slowing, not a photon starting above today's local ceiling in a stationary environment. The latter exponential model yields 2 ln 2 = 1.386294 for the distance ratio when arrival speed is half c0. Both arithmetic statements are correct but the initial conditions differ. Label D-03 an alternative cosmological-time control, not the canonical C-01 post-emission law. Put the 1 Mpc stationary example prominently in the main chapter. Neither example supplies a direct redshift-to-distance correction.

### B6 — Scope of Foundation 12 and the local distance anchors (pp. 10–12, 26–28, 353–355)

The exact charter is printed on p. 10. Its explanatory text on p. 12 refers only to some initially misclassified objects; it is an observational example, not a derivation of the full closer-and-smaller hypothesis. Keep that distinction. Explicitly state that the target concerns what a specified conventional distance estimator infers versus the physical model, and identify which estimator and epoch are compared. Correct classification of a foreground dwarf does not validate a universal scale change for confirmed galaxies. For the seven extreme-object dossiers, use exact object names, independently constrained distances, calibrated primary-source sizes/masses and uncertainty tables, not illustrative numbers alone. The sensitivity formulas on pp. 28 and 353–355 are sound at fixed calibration, but the book does not yet predict the distance changes. A coherent quantitative result must match both angular and brightness measurements, timing, source dynamics and independent anchors.

### B7 — Part XXXI's dressing model is not the same physical mechanism as Chapter 30S (pp. 258–266, 367–372)

The scalar surrogate emits secondary excitations and predicts a hard-event spectrum at its example coupling. The appended packet history model introduces a separate gap-growing coordinate, lumped receiver and prescribed stationary wall. A high-energy photon crosses one wall without sampled acceleration, but its effective gap is ~72.85% of final packet energy. The reduced model does not derive actual vector modes, photon frequency at a detector, line coherence, or microscopic detailed balance. Give the two models separate IDs and build a specific comparison: derive a bath-induced self-energy/dressing change, energy transfer, recoil and reverse reaction; verify whether the scalar or vector transition can actually produce the assumed gap growth. Do not treat the reduced positive result as the completed microscopic interaction. The book's explicit caveats are good; an integration bridge would prevent the research branches from being mistaken for one solution.

### B8 — Numerical conservation versus convergence (pp. 200–203, 223–240, 336, 372)

Constraint residuals and energy balance check a declared finite-dimensional model but do not establish accuracy of every observable or continuum convergence. Chapter 30K correctly notes that a matched-time receiver response changes substantially when the mode cutoff increases. Establish refinement sequences in physical source width, domain size, time step, mode cutoff and boundary conditions; compute uncertainties of the specific observed receiver quantities. The Part XXXI derivative test is sampled, not a rigorous interval bound. The reported 422 tests and 135 assertions are separate code-suite claims, not independent physical experiments or proof. Provide separate reproducibility results for each release, with exact code hash and dependency lockfile.

## C. Independent calculation checks

The accompanying Python script evaluates the printed equations using standard numerical functions, high-precision arithmetic for the near-unity bound, independent convex phase-space root finding, and a separately implemented DOP853 integration for the Part XXXI benchmark. See the output text file. Most checked numerical values agree to the printed precision.

| PDF page | Quantity | Book | Recalculated | Result |
|---|---|---:|---:|---|
| 25 | transverse speed | 9.48 km/s | 9.48094 | matches |
| 43 | Yukawa range at 10⁻¹⁸ eV/c² | 1.973×10¹¹ m | 1.973269804×10¹¹ | matches |
| 101 | density 0.3 GeV/c² per cm³ | 5.35×10⁻²² kg/m³ | 5.34799×10⁻²² | matches |
| 101 | 1 m² at 0.1c mass flux | 1.6×10⁻¹⁴ kg/s | 1.60329×10⁻¹⁴ | matches under stated convention |
| 121 | stretch at Ω/W_e=.2 | 2.190476 | 2.190476190 | matches |
| 121 | duality at Ω/W_e=.2 | 1.118794 | 1.118794298 | matches |
| 125 | radial force at R=2 | 10.05 | 10.05309649 | matches |
| 135 | illustrative exterior shell mass | 1.26×10⁵² kg | 1.255426×10⁵² | matches |
| 261 | β upper deficit from unity | 2×10⁻¹⁶ | 1×10⁻¹⁶ | correct as A2 |
| 261 | single event at β=.9 | 19.7191° | 19.719116° | matches |
| 263 | RMS spread for N=100 | .069639 | .069638868 | matches |
| 263 | energy-only maximum count | 35 | 35 | matches |
| 265 | scalar rate | 2.29762×10⁻⁸ | 2.297615596×10⁻⁸ | matches |
| 265 | scalar loss power | 1.10099×10⁻⁸ | 1.100988530×10⁻⁸ | matches |
| 353 | 1 Mpc inferred/actual | 1.38629 | 1.386294361 | matches |
| 358 | void fraction s=1 | .13910987 | .139109867 | matches |
| 363 | energy fraction s=1.1, ε=10⁻¹⁶ | 2.4004×10⁻¹⁶ | 2.400397×10⁻¹⁶ | matches |
| 364 | drag lower and upper bounds | 19.89975; 3.28345 | 19.89974874; 3.28345468 | matches |
| 365 | asymptotic stop position | .152700 | .152700437 | matches |
| 369 | history arrival time | 1.445830 | 1.445830121 | matches |
| 369 | retained energy | .695303 | .695302670 | matches |
| 369 | final speed | .822104 | .822103826 | matches |
| 369 | final effective gap | .506501 | .506501369 | matches |
| 369–370 | heat and recoil | .303415; .001283 | .303414617; .001282713 | matches |

Part XXXI independent integration endpoint energy residual ~−8.21×10⁻¹³ and momentum residual ~3.33×10⁻¹⁶ in normalized units. These are separate checks, not a reproduction of all 42 cases or 135 assertions. The algebraic endpoint and instantaneous speed-derivative identities were reviewed and are consistent with the declared static, forward-trajectory, lumped-receiver model.

## D. References and evidentiary quality

Selected anchors checked against published records:

- LMC 49.59 ±0.09(stat) ±0.54(sys) kpc (pp. 26,353): correct. Pietrzyński et al., Nature (2019), https://doi.org/10.1038/s41586-019-0999-4.
- NGC 4258 maser 7.576 ±0.082(stat) ±0.076(sys) Mpc (pp. 26,354): correct. Reid, Pesce & Riess (2019), https://doi.org/10.3847/2041-8213/ab552d.
- DES 1,504 SNe Ia, b=1.003 ±0.005(stat) ±0.010(sys) (pp. 91,159,255,361): correct. MNRAS 533, 3365, https://academic.oup.com/mnras/article/533/3/3365/7738388.
- GW170817/GRB 170817A 1.74 ±0.05 s lag and −3×10⁻¹⁵ to +7×10⁻¹⁶ differential speed bound (pp. 31,258,375): correct under published source/emission assumptions. https://doi.org/10.3847/2041-8213/aa920c.
- WMAP bubble-collision search methodology DOI on p. 282 correct: https://doi.org/10.1103/PhysRevD.84.043507. A null detection is not proof that an outside domain does not exist.

The book has multiple overlapping citation systems (Sxx, CRx, BSx, A1–A5, report and line IDs). Consolidate into one bibliographic database, preserve technical provenance IDs as separate fields, and give a permanent URL/DOI for every external value. For empirical anchors, identify the particular table, equation or figure and assumptions rather than saying only “source-reported.” The newest studies and object dossiers require separate systematic source verification. Add a release-version identifier or commit hash and a public, durable data/code-access link; manuscript-local file paths alone are not reproducible by book purchasers. The absence of a source bundle in this PDF prevents independently checking all claimed simulations. Do not convert literature proposals, historical analogies, or educational visualizations into observational support.

## E. Editorial and publication preflight

### E1 — The final 40 pages are appended, not integrated (pp. 8–9, 20, 339–380)

Page 340 explicitly states that the review manuscript was reproduced without reconciling it with the preceding book. The main narrative ends on p. 339 with its vector-bath priority, while the appended manuscript introduces the Part XXX/XXXI wall and history models. The front matter's “newest mathematical contribution” and title's “30S+” do not clearly describe all material in the release. The book's 41 historical-report inventory and the appended paper's 38 original-report count are different source collections; not necessarily a contradiction, but they need one crosswalk. I recommend a new edition, not just another appended paper: integrate the new findings into Chapter 30R/30S and a numbered 30T or 30U, establish one shared model ledger, and move detailed reproduction notes into matched appendices. Update the front matter, route, conclusion, TOC and research roadmap after that work. Preserve the historical source PDFs separately.

### E2 — Section numbering and pagination (pp. 341–342, 367–372)

Rendered p. 342 shows “10Part XXX”, “11Part XXXI”, and labels such as “11.11.” caused by combining automated headings with manual numbering. Remove manual numbering in Section 11, increase the number-column width, and generate a single main TOC. The appended manuscript has both original page numbers 1–40 and separate hardcover page labels 341–380; reader references should resolve to one printed page number and consistent equation IDs. If the standalone review is preserved verbatim by design, clearly label its own internal page references and provide a crosswalk. Book p. 340 itself is a standalone divider, not a new technical chapter.

### E3 — Typography and print images

PDF properties: 380 pages, consistent 442.08 × 663.12 pt (6.14 × 9.21 in) media/crop boxes, 13 embedded font resources by `pdffonts`; no encryption. For a no-bleed interior, selected KDP margin requirements for 301–500 pages are 0.625 in inside and 0.25 in outside. The whole-document text-box check found no violations of 45 pt inside and 18 pt outside/top/bottom; the minimum measured inside text margin was about 46.49 pt. Image bounding boxes also passed these tested margins. These are geometric preflight results, not KDP approval or inspection of every drawn mark. Confirm the selected hardcover trim, ink/paper and bleed option in KDP Previewer; order a physical proof.

There are 48 placed raster image occurrences, 20 below approximately 300 effective PPI (threshold 299 to allow rounding). Especially: pp. 262 and 264 about 222 PPI, p. 122 about 250 PPI, pp. 253–254 about 257 PPI, p. 137 about 275 PPI. Regenerate plots as embedded vector PDF or 300–450 PPI at final size, use legible labels and distinct grayscale line styles. Appended review body type is approximately 8.2 pt, compared with 10.9 pt in main text, because the existing layout was scaled. Re-typeset at the same readable body size instead of proportionally reducing it. Add a conventional copyright/publication information page (no 'copyright' text found in PDF), with edition, imprint/author and appropriate disclosures. KDP's AI-generated content declaration is a platform requirement where applicable; disclose AI-generated text and images in the submission workflow, distinguish AI-assisted material according to the current policy. The book cover and upload settings were not supplied, so spine, cover dimensions, barcode placement and platform compliance cannot be certified here.

KDP official references: https://kdp.amazon.com/en_US/help/topic/GVBQ3CMEQW3W2VL6 (trim/margins); https://kdp.amazon.com/en_US/help/topic/G200672390 (content/AI disclosure).

## F. Recommended revision sequence

1. Correct tidal-sign convention, bath numerical endpoint, mode decomposition, density wording and formula/notation ledger.
2. Resolve what is meant by locally measured packet speed, front speed, common-frame speed, matter speed and causal speed in every model. Add the Chapter 32A outflow compatibility check as an acceptance gate. Make C-01's user-intended initial speed the motivation throughout.
3. Integrate the atomic-response closure into the C-01 discussion and the operational clock calibration into the optical formula. Identify exactly what must be derived rather than assumed.
4. Merge the two histories (scalar bath and gap dressing) into a single research roadmap, with distinct candidate IDs until a microscopic derivation is available. Keep negative controls as compact anti-regression gates.
5. Establish one master source register, evidence ledger, canonical notation glossary and permanent reproduction manifest. Link every numerical table to its script, parameters, units, version and CSV. Verify references and run the exact release suite from a clean environment.
6. Rebuild the book at its final trim with one typography/pagination system, updated TOC and index, accessible plots, front matter and a proof copy. Publish as an independent scientific research program, not as a completed measured cosmological theory.

**Conclusion:** The selected mathematical checks largely reproduce; the most important improvements concern physical compatibility and integration rather than a wholesale failure of the arithmetic. No new empirical result is claimed by this audit. The unmodified PDF should remain archived; apply the corrections to the editable book and project memory rather than silently modifying its historical scientific record.
