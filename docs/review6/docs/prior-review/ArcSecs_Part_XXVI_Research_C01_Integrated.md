# ArcSecs Scientific Investigation — Part XXVI
## Three-Dimensional Optical Geometry and the Distance–Brightness Consistency Test

**Research installment:** Part XXVI (23 November 2026)  
**Status:** analytical and numerical *candidate-model audit*, not a cosmological fit.  
**Research charter:** the twelve ArcSecs foundational premises supplied by the project owner are retained as premises. We test the candidate mechanisms and observational inferences instead of conflating a premise with an experimental result.

### Abstract

Part XXV produced a planar, dynamically evolving scalar-field model that separated two matter concentrations, preserved relatively stable field values at their centers, generated redshift, and broadened a transverse photon-ray bundle by approximately 22%. Its beam-spreading result could not be interpreted as a measured angular-diameter distance, and its one-dimensional energy-rate proxy could not be interpreted as bolometric flux. An original ArcSecs astronomical-distance audit supplied after that investigation also showed that some simple tired-light or bounded-distance laws increase, rather than decrease, inferred physical galaxy sizes at high redshift.

We test three specific gaps. First, we calculate the observer-to-source and source-to-observer ray-bundle maps in a fully two-transverse-direction, axisymmetric optical model. Second, we connect those maps to photon number, energy, pulse stretching, and luminosity distance. Third, we solve the exact three-dimensional static spherical quadratic-screening profile inherited from Part XI, determining the *sign* of its refractive effect under the previously selected positive photon-slowing coupling.

A reciprocal, transparent lens can change angular distance, but in the tested optical model it changes the reverse beam-area distance equally; **focusing alone cannot supply the missing distance-duality factor**. In the specific density-screened scalar candidate the field is *lower* near dense matter, causing weak optical **defocusing**. The Part XI galactic example has center-field suppression of only approximately 2.53 parts per million and a corresponding positive angular-bundle-distance change of about 7.89 parts per million over an illustrative ten-radius path. These are conditional model calculations, not measured galaxy signals. A positive massive-photon frequency gap is retained in an independent high-frequency control.

## 1. Provenance and reconciliation with the original archive

The directly supplied original *ArcSecs Astronomical Distance Audit.md* is inside `09_Bubble_Observational_Tests_Full_Depth.zip`; the original source inventory is preserved in `ArcSecs_Original_Source_Register.md`. The calculations and hypotheses in original reports must remain distinguished from externally verified observations.

The original audit reports the following example *angular-size-distance ratios*, each based on the same measured angular size and a conventional benchmark distance:

| Redshift | Original static tired-light / benchmark | Original bounded propagation / benchmark |
|---:|---:|---:|
| 0.5 | 1.38 | 1.13 |
| 1.0 | 1.80 | 1.30 |
| 3.0 | 3.74 | 2.02 |
| 10.603 | 12.74 | 4.75 |
| 14.179 | 17.44 | 5.99 |

These results were reported by the historical model comparison and are independently *arithmetically rechecked* here using its tabulated Mpc values; they are not fresh distance fits and do not provide object-level radius measurements. They show that an alternative redshift law need not produce the sign required by Foundation 12.

The original audit also insists on keeping photometric misclassifications separate from sources with spectroscopic confirmation. A clear example of the former is Capotauro, whose proposed high photometric redshift was reclassified as a Galactic Y dwarf following proper-motion and photometric evidence. In contrast, ALMA detected oxygen emission in JADES-GS-z14-0 at spectroscopic redshift 14.1793±0.0007. See the external references below.

**Operational distinction:** an arcsecond is an angular unit. A parsec is a geometric parallax distance unit defined from the astronomical unit and one arcsecond. Changing photon speed can change some **inferred** astronomical distances, but it does not change those unit definitions or independently demonstrate that a spectroscopically secured source is nearby.

## 2. The directional geometry missing from Parts XV–XXV

Define four quantities for one emitter–receiver experiment:

* \(D_A\): source transverse physical size per angle subtended at the observer; \(dA_e=D_A^2 d\Omega_a\) for an axisymmetric small bundle.
* \(D_G\): transverse *receiver area* per initial emission solid angle; \(dA_a=D_G^2 d\Omega_e\).
* \(A\equiv dT_a/dT_e\): arrival interval divided by emission interval, in the preferred ordering parameter.
* \(\mathcal T\): surviving fraction of emitted photons in a specified geometrical ray bundle (or a separately derived directional throughput). **It must not be inserted as a free observational correction.**

For isotropic emission, energy per emitted photon \(\hbar\omega_e\), and detected photon energy \(\hbar\omega_a\), a photon-counting argument gives

\[
\boxed{F_a=\frac{L_e}{4\pi D_G^2}\,\mathcal T\,\frac{\omega_a}{\omega_e}\,\frac{dT_e}{dT_a}.}\tag{1000}
\]

This equation applies to a stationary emitter and receiver with common physical-time calibration, with no photon creation between the source and receiver and no extra beam mixing. For moving or dissimilar atomic reference systems, the photon-energy and clock factors must be calculated from their physical emission and detection processes as in Parts XVIII–XXII.

As a controlled **high-frequency limit** of a strictly positive photon gap \(\Omega_\gamma>0\), take the nondispersive leading-order relations

\[
\frac{\omega_e}{\omega_a}=1+z,\qquad
A=1+z.
\]

The observed luminosity distance, \(F_a=L_e/(4\pi D_L^2)\), then is

\[
\boxed{D_L=\frac{(1+z)D_G}{\sqrt{\mathcal T}}.}\tag{1001}
\]

The dimensionless distance-duality diagnostic is

\[
\boxed{\eta\equiv\frac{D_L}{(1+z)^2D_A}
=\frac{D_G/D_A}{(1+z)\sqrt{\mathcal T}}.}\tag{1002}
\]

This is an *observable constraint calculation* in the stated Euclidean ray model. Equation (1002) does not claim the conventional distance-duality theorem automatically applies to every possible ArcSecs field theory; rather, it identifies what the candidate must predict and which physical factors are missing.

## 3. Optical reciprocity: focusing alone is insufficient

To isolate focusing, represent the spatial refractive index as a smooth axisymmetric lens:

\[
 n(x,r_\perp)=1+\delta
 \exp\left[-\frac{(x-x_l)^2}{2\sigma_x^2}
            -\frac{r_\perp^2}{2\sigma_\perp^2}\right].\tag{1003}
\]

Both transverse directions obey the same paraxial propagation law. For one component \(y\), the central-ray bundle variation \(J\) obeys

\[
 J''=-q(x)J,\qquad
 q(x)=\frac{\delta G(x)}{[1+\delta G(x)]\sigma_\perp^2},
 \quad G(x)=e^{-(x-x_l)^2/(2\sigma_x^2)}.\tag{1004}
\]

We set geometric path length \(D=10\), \(x_l=3\), \(\sigma_x=1.1\), and \(\sigma_\perp=2.5\), all in dimensionless distance units. For a lens acting on the ray bundle, initialize \(J(0)=0, J'(0)=1\), integrate to the far plane, and reverse the spatial profile for the source-emission control.

The resulting transfer matrices are symplectic (determinant one) to the displayed numerical tolerances. The off-diagonal coefficient is equal when the optical path is reversed, despite the lens not being centered between endpoints.

| Index contrast \(\delta\) | \(D_A/D\) | \(D_G/D\) | Character |
|---:|---:|---:|---|
| −0.020 | 1.017789 | 1.017789 | Defocusing |
| 0 | 1.000000 | 1.000000 | Uniform control |
| 0.020 | 0.982835 | 0.982835 | Weak focusing |
| 0.060 | 0.950245 | 0.950245 | Moderate focusing |
| 0.287042 | 0.800000 | 0.800000 | Illustrative 20% reduction |

The last row requires an approximately 28.7% **central index contrast**, *for these freely chosen geometric widths*. It is not a physically calibrated galactic prediction, and the paraxial approximation would need to be verified for real observed off-axis images.

Crucially, \(D_G/D_A=1\) to numerical precision in the reciprocal static lens, even when both distances change substantially. Therefore, with \(\mathcal T=1\),

\[
\boxed{\eta=\frac1{1+z}.}\tag{1005}
\]

**Finding XXVI-1:** Ordinary smooth focusing or defocusing within a reciprocal, nondispersive optical medium does not remove the Part XV–XVIII brightness-distance discrepancy. It changes the size inferred from a fixed measured angle and changes the reverse geometrical beam area in concert.

A globally time-dependent factor \(c(T)\) multiplying a stationary spatial optical profile can be absorbed into an optical propagation parameter \(\tau=\int c(T)dT\); in the nondispersive, stationary-endpoint limit it leaves this purely spatial reciprocity result intact. General time-dependent *spatial* structure, moving lenses, frequency-dependent transport and non-conserved photons require a separate derivation.

## 4. Independent 3D quadratic screening calculation and the sign of refraction

Part XI's quadratic candidate obeys, in a static region of constant density,

\[
S\nabla^2\psi=(m^2+g\rho)(\psi-\psi_*(\rho)),
\qquad \psi_*(\rho)=\frac{f}{m^2+g\rho}.\tag{1006}
\]

For a sphere of radius \(R=1\), use the exact regular interior and decaying exterior solutions:

\[
\psi_{\rm in}(r)=\psi_i+A\frac{\sinh(k_i r)}r,
\quad
\psi_{\rm out}(r)=\psi_o+B\frac{e^{-k_o(r-1)}}r.\tag{1007}
\]

Set \(q_i=k_iR\), \(q_o=k_oR\), \(\Delta\psi=\psi_o-\psi_i\), and match both the field and its derivative at the surface:

\[
A=\frac{R\Delta\psi(1+q_o)}{q_i\cosh q_i+q_o\sinh q_i},
\qquad
B=-R\Delta\psi\frac{q_i\cosh q_i-\sinh q_i}{q_i\cosh q_i+q_o\sinh q_i}.\tag{1008}
\]

We reproduce the density ratios inherited from Part XI, \(g\rho_i/m^2=10^4\) and \(g\rho_o/m^2=1\), normalizing \(\psi_{\rm vac}=1\). The optical response is \(n=e^{\lambda\psi}\) with \(\lambda=4/3>0\), consistent with a decreasing photon speed \(c_\gamma=e^{-\lambda\psi}\) as the scalar rises.

For a central small-angle ray through this spherical field, the transverse bundle equation becomes

\[
\boxed{J''(x)=\lambda\frac{\psi'(r)}r J(x),\quad r=|x-x_l|.}\tag{1009}
\]

The numerical integration crosses the sphere and extends five sphere radii to either side. It explicitly includes the exterior Yukawa tail. Note the geometry is illustrative: this path length is not calibrated to a galaxy/observer/source arrangement.

| Interior screening \(q_i\) | Actual central suppression vs exterior | \(D_A/D\) | Optical effect |
|---:|---:|---:|---|
| 0.00225 (Part XI galaxy) | 2.531 ppm | 1.00000789 | Slight defocusing |
| 0.0225 | 0.0253% | 1.000789 | Defocusing |
| 0.225 | 2.473% | 1.07812 | Defocusing |
| 1 | 34.97% | 2.27759 | Strong, illustrative defocusing |
| 3 | 89.77% | 4.52454 | Strong, illustrative defocusing |

The sign is important. This density coupling makes \(\psi\) *lower* at the dense center than in the surrounding region. With positive \(\lambda\), the optical index \(n=e^{\lambda\psi}\) is also lower at the center, tending to push rays **away** from the central axis. In this idealized optical model it enlarges, rather than reduces, the inferred angular-size distance.

**Finding XXVI-2:** The original quadratic density-screening mechanism, combined with positive photon-slowing coupling and isolated spherical boundary conditions, has the wrong sign of optical bending for making a centrally viewed object appear smaller. This is a property of this candidate, not a claim that every possible scalar field must defocus; other gravitating interactions or lens configurations may produce net focusing.

In the weak-screened galaxy case the change is minute and would not replace a normal gravitational-lensing model. The large-\(q_i\) rows are sensitivity tests, not physically scaled galaxy predictions.

## 5. How much additional transport is required?

Under reciprocal geometry (\(D_G=D_A\)), equation (1002) yields the transmission necessary to have \(\eta=1\):

\[
\boxed{\mathcal T_{\eta=1}(z)=(1+z)^{-2}.}\tag{1010}
\]

At redshift one, this requires a transmission of **0.25**. At redshift two it requires **0.1111**. These are substantial wavelength-integrated photon-number changes or equivalent independently calculated throughput modifications; they cannot be asserted without an energy budget and observational consequences.

If the model additionally predicts a fixed angular-size ratio \(q=D_A^{\rm ArcSecs}/D_A^{\rm ref}<1\) and must match the reference luminosity distance \(D_L^{\rm ref}=(1+z)^2D_A^{\rm ref}\), then

\[
\boxed{\mathcal T_{\mathrm{brightness\ fit}}
=\left(\frac{q}{1+z}\right)^2.}\tag{1011}
\]

For \(q=0.80\) at \(z=1\), this is \(\mathcal T=0.16\), implying an effective optical depth \(-\ln\mathcal T\approx1.833\). With that brightness fit the candidate necessarily predicts \(\eta=1/q=1.25\), not one. A single adjustable throughput cannot *simultaneously* make the physical size 20% smaller, preserve the benchmark luminosity distance, and preserve the benchmark angular/luminosity relation.

This mathematical inconsistency should not be disguised by adding an unmotivated gray attenuation factor. A new physical mechanism must identify which observationally tested quantity it changes and what compensating changes it predicts elsewhere.

For comparison, a November 2026 DESI DR2 reanalysis reports no significant **redshift-dependent** departure from the distance-duality shape under its parametrization \(\eta=(1+z)^\epsilon\), with \(\epsilon=-0.0290\pm0.0166\). Constant offsets remain calibration-degenerate. The tested unattenuated ArcSecs baseline corresponds formally to \(\epsilon=-1\), a very different shape; **this is not a joint data fit or a model-independent exclusion statement**, and the DESI analysis assumptions must be respected.

## 6. A strictly positive photon-gap consistency check

The main flux/optics analysis above is a controlled high-frequency approximation to a positive-gap photon. To avoid silently replacing the ArcSecs positive-mass premise with a massless physical assumption, an independent dispersion calculation uses

\[
\omega^2=c(T)^2k^2+\Omega_\gamma^2,
\quad \Omega_\gamma>0,\qquad
c(T)=e^{-\gamma T},\quad \gamma=\frac{\ln2}{10}.\tag{1012}
\]

Emission frequency is fixed at \(\omega_e=1\); successive emissions therefore have wave numbers \(k(T_e)=\sqrt{\omega_e^2-\Omega_\gamma^2}/c(T_e)\). For a stationary receiver, the arrival-time derivative includes the derivative of *emission wave number*:

\[
\frac{dT_a}{dT_e}
=\frac{v_{g,e}-k'(T_e)\int_{T_e}^{T_a}\partial_kv_g\,dT}{v_{g,a}}.\tag{1013}
\]

In this test the fixed receiver distance is selected so that the first pulse reaches at \(T_a=10\). The difference between its measured arrival stretch and the spectroscopic frequency ratio is:

| Frequency-gap ratio \(\Omega_\gamma/\omega_e\) | Propagation redshift | Arrival stretch | Stretch / (1+z) |
|---:|---:|---:|---:|
| \(10^{-4}\) | 0.999999970 | 2.000000010 | 1.000000020 |
| 0.02 | 0.998801079 | 2.000399800 | 1.000800 |
| 0.10 | 0.970658556 | 2.009877084 | 1.019901 |
| 0.20 | 0.889822365 | 2.038126093 | 1.078475 |

A strictly positive but sufficiently small gap leaves the high-frequency nondispersive distance argument almost unchanged. A large gap does not; its group-delay, energy and pulse distortion must be tracked explicitly. The dimensionless values are numerical sensitivity experiments, not fits to photon rest-mass measurements. The finite-difference/analytic arrival-stretch residual is below \(6.3\times10^{-11}\) across the tested cases.

**Finding XXVI-3:** The missing brightness factor cannot be attributed to a tiny positive photon mass without demonstrating a corresponding, strongly measurable propagation effect. Positive photon mass and large cosmological energy transfer remain separate modeling requirements.

## 7. Numerical reproducibility and error controls

Two source files produce the results: `arcsecs_part_xxvi_calculations.py` and `arcsecs_part_xxvi_spherical.py`. They use Python, NumPy, SciPy, and Matplotlib. The computations are deterministic and produce five CSV datasets and five figures.

* Observer/source optical reciprocity absolute error: below \(1.1\times10^{-11}\) in the selected transfer-matrix entries.
* Transfer-matrix symplectic determinant error: below \(9.0\times10^{-14}\).
* Integration-tolerance sensitivity for \(\delta=0.03\): approximately \(7.0\times10^{-12}\) in the relevant distance coefficient.
* Fixed-line-frequency positive-gap pulse calculation: numerical versus analytically differentiated interval ratio agrees to better than \(6.3\times10^{-11}\).
* Limiting cases: no-lens geometry recovers \(D_A=D_G=D\), and zero-gap propagation recovers \(dT_a/dT_e=1+z\).

The static sphere solver uses the exact matched closed-form field and integrates the ray bundle along a selected path. It is *not* a full time-dependent three-dimensional matter–scalar solve. Optical propagation is paraxial, scalar coefficients are deliberately illustrative, and ordinary gravitational deflection and detailed plasma physics are omitted.

## 8. Empirical discriminators and research priorities

Original ArcSecs reports propose model-independent or minimally model-dependent checks. The next forward comparison should use their priority order rather than fitting arbitrary new parameters until results resemble conventional distance curves:

1. **Object classification and angles:** independently verified astrometry, proper motion and parallax for suspected contaminants; multi-line spectroscopy and ALMA line confirmation for high-redshift controls. Capotauro and JADES-GS-z14-0 should be treated as different classes, not one population.
2. **Absolute local geometry:** maser-based distances such as NGC 4258 and laboratory-defined angle/length units. Keep proper motion separate from true annual parallax.
3. **Spectral and temporal behavior:** achromatic redshift, line ratios, relative atomic/nuclear clock stability, and DES supernova light-curve stretching. DES found a time-dilation index \(1.003\pm0.005\) statistical ±0.010 systematic for 1,504 Type Ia supernovae.
4. **Optical phase-space conservation:** ray-bundle transfer and reciprocal area tests from full 3D wave optics, allowing time-dependent moving lenses, rather than substituting planar magnification proxies.
5. **Radiative transfer:** photon number, bolometric energy, scatter-induced blur and angular redistribution, each derived from a physical interaction and its energy budget; calculate \(D_L\) and \(D_A\) simultaneously.
6. **Baryon acoustic and supernova comparisons:** use joint DESI DR2 \(D_M/r_d\), \(D_H/r_d\), and supernova apparent magnitudes, with the full covariance and sensitivity to the standard-ruler calibration. No such observational likelihood was run here.

A viable new candidate must be able to state its *pre-observation* prediction for both angular and brightness distances, explain the sign of its refraction, and describe how its extra energy transfer avoids unacceptable chromaticity and image blurring.

## 9. Conclusions

The original report archive materially changes the priority of ArcSecs research. It demonstrates that several previously proposed nonexpanding distance laws have an unfavorable sign for Foundation 12. Part XXVI adds a new mathematically checked reason why simply increasing focusing is not enough: in a reciprocal optical model, the two directional area maps change together, so the missing redshift-dependent luminosity factor remains.

The chosen quadratic scalar screening candidate also produces defocusing, not the required focusing, in an idealized spherically symmetric static calculation. Its physically relevant weak-screened parameter regime creates a very small correction rather than a large size reduction. A small positive massive-photon gap is compatible with treating these geometric-optics calculations as controlled limits, but it does not supply the missing radiative transfer mechanism.

These are restrictions on the *candidate equations*, not new empirical verdicts on the project owner's twelve foundations. The program remains testable only by identifying new physical interactions that generate distinct, falsifiable predictions across spectroscopy, timing, angles and fluxes.

### Proposed Part XXVII

**A single three-dimensional photon/field kinetic transport theory with an energy-conserving source–observer flux calculation.** Build a spatially resolved, physical-scale source/galaxy/observer system; integrate the electromagnetic phase-space density and its collision/interaction term with the scalar field; derive source emission and local atomic standards from the same matter action; recover both optical directional Jacobians and actual energy flux without defining an arbitrary transmission factor. Test it first against local geometric distances and independently calibrated spectral/temporal measurements, then apply it to a preregistered high-redshift holdout set.

## Sources and provenance

**User-supplied originals:** `ArcSecs Astronomical Distance Audit.md` inside `09_Bubble_Observational_Tests_Full_Depth.zip`; `Physical Redshift Mechanisms Evaluation.md` in the same ZIP; `ArcSecs_Original_Source_Register.md`; `ArcSecs_Part_XI_Research` material supplied in the initial handoff; and the subsequent Parts XV–XXV, especially `ArcSecs_Part_XXV_Research.md`. Source documents are preserved unmodified.

**Independent external sources (checked 23 November 2026):**

- [Capotauro proper-motion / brown-dwarf identification (MNRAS, 2026)](https://academic.oup.com/mnras/advance-article/doi/10.1093/mnras/stag2055/9003823).
- [JADES-GS-z14-0 ALMA oxygen-line redshift (Astrophysical Journal Letters)](https://doi.org/10.3847/1538-4357/adbf1b).
- [Dark Energy Survey Type Ia supernova time dilation](https://academic.oup.com/mnras/article/533/3/3365/7738388).
- [DESI DR2 BAO collaboration results](https://journals.aps.org/prd/abstract/10.1103/tr6y-kpc6).
- [DESI DR2 calibration and redshift modes in distance-duality tests, PRD accepted manuscript, November 2026](https://journals.aps.org/prd/accepted/10.1103/2glj-ljfh).

**Reproducibility warning:** The source-audit table values were *transcribed and ratio-checked* from a historical research document. They were not obtained here by downloading the underlying JWST catalog or regenerating the original model's cosmological distance integrations. The optical and pulse calculations are freshly executed, while the observational comparisons are contextual constraints rather than fits.

---

# Research Extension C-01 — Cosmic Inertia and the Local Maximum Photon Emission Speed

# Research Extension C-01 — Why New Light Begins at the Local Ceiling

**For inclusion in ArcSecs Part XXVI and as a conceptual constraint for Part XXVII**  
**Research classification:** Hypothesis / charter-level modeling assumption, not an established empirical finding.

## Motivation: the *question* behind the two-spacecraft thought experiment

Consider two spacecraft that inherited uniform motion from different, now-disappeared cosmic-bubble domains. Each records zero acceleration and can regard itself as locally at rest. Yet their trajectories can cause their mutual separation to decrease rapidly. In a selected additive-kinematics description, a ship pair assigned `+v` and `−v` approaches at `2v`. This **closing rate is not the propagation speed of a single signal**. The familiar `4c0` picture of their opposing headlight fronts requires the *additional* assumption of Galilean composition of light's velocity; it does not follow merely from uniform inherited momentum. The paper does not adopt such a `4c0` single-photon prediction.

The point of this thought experiment is more fundamental: **why does light newly emitted in our present cosmic environment start at a particular maximum local speed, rather than having been emitted faster and subsequently slowing to the value measured here?** The proposed ArcSecs rule is that the initial speed is bounded by the physical environment at emission. In the reference region, the bound is the observed local value `c0 = 299,792,458 m/s`. Following emission, light may become progressively slower. The proposal does *not* require any photon to originate above the emission ceiling.

## C-01 hypothesis: collective cosmic mass and the initial-speed limit

ArcSecs hypothesizes that collective gravitational/inertial interactions of the matter within a cosmic domain may set the local maximum photon-emission speed. A domain may have an interior matter distribution, potentially a comparatively hollow cavity and surrounding concentrations, or hypothetical boundary structures. A different mass/interaction distribution within another domain—or outside the hypothesized bubble—could yield a different local emission ceiling. This is a **domain-dependent physical-coupling proposal**, not a discovery of a literal universe wall.

The mechanism must be **more than Newtonian inward gravitational attraction**. A perfectly uniform spherical shell has no net Newtonian force at any interior point. An inertia-modifying, density-integral, scalar, or other collective coupling would require explicit field equations, boundary conditions, and energy accounting. We use the environment variable

\[
\mathcal I(\mathbf r,T)=\int\!\rho(\mathbf r',T)\,K(|\mathbf r-\mathbf r'|;\xi,\partial\mathcal B)\,d^3r',
\qquad C_{\mathrm{em}}(\mathbf r,T)=c_0\,G\!\left(\frac{\mathcal I(\mathbf r,T)}{\mathcal I_{\mathrm{ref}}}\right),\quad G(1)=1.
\tag{C01.1}
\]

These functions are unknown until derived; the expression is a testable parameterization, not an established law. The cosmic bubble and its boundary conditions are likewise hypotheses. `C_em` denotes the locally governed photon-emission ceiling, and does not automatically equal the velocity at which every other physical interaction can transmit information.

## Post-emission monotone-slowing condition

For a photon emitted at event `(r_e,T_e)` let `tau=T-T_e>=0`. A first restricted candidate is

\[
 v_\gamma(T_e+\tau)=C_{\mathrm{em}}(\mathbf r_e,T_e)F(\tau;\text{environment,path}),\quad
 F(0)=1,\quad 0<F\le 1,\quad \partial_\tau F\le0.
 \tag{C01.2}
\]

Thus a photon *does not start faster than the local emission ceiling*; it begins at that ceiling in the initial idealization and slows thereafter. Whether this strict monotonicity survives passage into different physical environments is an open constraint. As a toy calculation, exponential `F=e^{-\gamma\tau}` is mathematically possible; the physically more important task is to derive `F` from a finite-energy autonomous field, not prescribe permanent slowing. Earlier Parts XXIII–XXIV show that some closed scalar-field models bound the photon characteristic speed away from zero.

## Essential massive-photon and causal-speed qualification

The earlier ArcSecs massive-photon law

\[
\omega^2=c_{\mathrm{field}}^2k^2+\Omega_\gamma^2,\quad\Omega_\gamma>0
\]

implies `v_group=c_field sqrt(1-Omega_gamma^2/omega^2)`, which is below `c_field` at finite frequency. Consequently, the phrase '*every photon starts at exactly c0*' is **not yet established by that dispersion relation** if `c_field=c0` at emission. This distinction must be resolved before presenting an exact initial group speed as a consequence of the field theory: `c0` might refer to a high-frequency/front ceiling, or a new consistent massive-photon emission law may be needed. A closing rate of physical separation exceeding `c0` should not be conflated with super-causal information transfer.

## Observational discriminators and continuation

This hypothesis requires a measured, environment-dependent initial emission-speed prediction and a separately derived age/path-dependent slowdown prediction. Test local two-way/one-way clock experiments and Lorentz-invariance constraints, photon-mass/plasma dispersion, transient arrival and redshift distributions, gravitational-wave/electromagnetic travel timing, shell/cavity transition fields, and independent geometric distances. The comparison must distinguish direct travel-time distance from redshift-inferred distance. No numerical observational fit or proof of the proposed cosmic-boundary mechanism is claimed here.

**Working decision:** Retain C-01 as a **proposed** physical explanation for the local photon-emission ceiling. Use the two spacecraft as a *motivation for distinguishing relational closing speeds, local emission speed, and causal signal speeds*, not as evidence for individual photons above `c0`.
