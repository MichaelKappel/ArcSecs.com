# ArcSecs Scientific Investigation
## Part XIX — Gauge-Invariant Massive Photons, Environmental Scalar Coupling, and the Electrostatic Screening Constraint

**Research date:** 23 November 2026  
**Status:** New classical field-theory derivation, reproducible numerical tests, and externally sourced observational context. **Not a validated unified cosmology or observational fit.**  
**Continuity:** Parts I–XVIII, especially Part XVIII's coupled transverse mode and the still-unresolved distance–brightness and recession-dynamics problems.  
**Reproduction:** `arcsecs_part_xix_calculations.py`, four CSV outputs, three figures, and `ArcSecs_Part_XIX_Test_Log.txt`.

### Abstract

Part XVIII derived a conservative scalar–electromagnetic oscillator, but it did not treat the scalar potential of electromagnetism, the longitudinal degree of freedom of a massive vector, electric charge conservation, or static charged-matter forces in a common model. Part XIX develops a preferred-time, gauge-invariant classical Stueckelberg construction coupled to an environmental scalar field. It derives two transverse modes and one longitudinal mode, obtains sufficient conditions for positive reduced quadratic kinetic energy, and shows exactly how all three modes can be assigned the same local dispersion relation while retaining a positive mass-related frequency gap. This construction also predicts a Yukawa electrostatic potential. When longitudinal and transverse characteristic speeds are matched, the Yukawa length equals the ratio of characteristic propagation speed to mass gap, providing a testable link between astrophysical propagation and local charged-matter physics. A coupled reduced-mode numerical experiment demonstrates a finite scalar-driven slowing episode and energy conservation to ~1.55×10⁻¹⁵ relative error. Finally, the analysis shows that impedance-matching of the electromagnetic coefficients does not automatically produce positive astronomical redshift: atomic mass or other matter parameters must be modeled consistently.

All twelve ArcSecs foundations are preserved as the project charter, not promoted to independently verified findings. No full matter field, cosmological gravitational theory, actual standard-candle flux solution, or joint likelihood analysis is claimed.

## 1. Problem inherited from Part XVIII

The previous reduced action was

\[
L=\frac K2\dot\psi^2-V(\psi)+\frac{\epsilon(\psi)}2\dot A^2-\frac12\left[\frac{k^2}{\mu(\psi)}+M^2(\psi)\right]A^2.\tag{600}
\]

It exhibited energy exchange but described only one transverse Fourier mode. A positive coefficient in one oscillator is not yet a derivation of an internally consistent massive **vector** field. The missing issues are Gauss's constraint, the longitudinal mode, coupling to conserved matter charge, and the static force between charged bodies. The current calculation explicitly adds those elements, although it does **not** establish a complete quantum theory.

Coordinates \(\mathbf r\) and a universal ordering parameter \(T\) serve as labels for physical position and succession; no assumption that coordinate labels are material substances is needed. A preferred temporal ordering is nevertheless a physical model choice whose consequences would ultimately need testing.

## 2. A gauge-invariant candidate action

Let \(\mathbf A\) be a vector potential, \(\varphi\) an electric scalar potential, \(\chi\) an additional Stueckelberg scalar, and \(\psi\) the environmental scalar. Define

\[
\mathbf E=-\dot{\mathbf A}-\nabla\varphi,\qquad
\mathbf B=\nabla\times\mathbf A,
\]
\[
W_0=\varphi+\dot\chi,\qquad\mathbf W=\mathbf A-\nabla\chi.
\]

A positive-coefficient, preferred-frame classical Lagrangian density is

\[
\boxed{\mathcal L_{\rm vector}=\frac{\epsilon(\psi)}2\mathbf E^2-
\frac{b(\psi)}2\mathbf B^2+
\frac{\zeta(\psi)}2 W_0^2-
\frac{\eta(\psi)}2\mathbf W^2.}\tag{601}
\]

Here \(\epsilon,b,\zeta,\eta>0\); \(b=1/\mu\) in the electromagnetic parametrization. As a technical convention, the present action uses dimensionless normalized electromagnetic units; restoring SI requires consistent normalization of \(\varphi,\mathbf A\), the charge, and the mass coefficients.

Under

\[
\mathbf A\mapsto\mathbf A+\nabla\Lambda,\quad
\varphi\mapsto\varphi-\partial_T\Lambda,\quad
\chi\mapsto\chi+\Lambda,\tag{602}
\]

all \(\mathbf E,\mathbf B,W_0,\mathbf W\) remain invariant. Hence the action has an exact Abelian gauge redundancy for arbitrary spacetime-dependent \(\Lambda\), even with nonzero mass coefficients. This is the established Stueckelberg strategy; it is not an original invention of ArcSecs [R1].

A possible matter-and-scalar completion takes the form

\[
\begin{aligned}
L={}&\sum_i\left[\tfrac12m_i(\psi(\mathbf r_i))|\dot{\mathbf r}_i|^2
+q_i(\dot{\mathbf r}_i\cdot\mathbf A(\mathbf r_i)-\varphi(\mathbf r_i))\right]
-\sum_{i<j}U_{ij}(|\mathbf r_i-\mathbf r_j|,\psi)\\
&+\int d^3r\left[\mathcal L_{\rm vector}+
\tfrac K2\dot\psi^2-\tfrac S2|\nabla\psi|^2-V(\psi)\right].
\end{aligned}\tag{603}
\]

For fixed point charges \(q_i\), the charged-matter term changes by the total derivative \(\sum_iq_i d\Lambda(T,\mathbf r_i(T))/dT\), and the matter current obeys a continuity equation. Equation (603) is a **proposed classical action architecture**; it does not yet specify a realistic atomic Hamiltonian, electron spin, nuclear structure, matter creation, or gravitational sector. The pair forces and scalar-dependent inertial masses require independent physical justification.

## 3. All three photon polarizations

Choose a homogeneous fixed background \(\psi\), set \(\chi=0\) by gauge choice for a positive vector mass, and consider a Fourier wave with magnitude \(k\).

For either transverse polarization, \(\varphi\) does not enter and the quadratic oscillator is

\[
L_T=\frac\epsilon2\dot A_T^2-\frac12(bk^2+\eta)A_T^2,
\]

so

\[
\boxed{\omega_T^2(k)=\frac b\epsilon k^2+\frac\eta\epsilon.}\tag{604}
\]

For the longitudinal amplitude \(A_L\), \(\varphi\) is a nondynamical constraint variable. Eliminating it yields

\[
L_L=\frac12\frac{\epsilon\zeta}{\epsilon k^2+\zeta}\dot A_L^2-\frac\eta2 A_L^2,\tag{605}
\]

and

\[
\boxed{\omega_L^2(k)=\frac\eta\zeta k^2+\frac\eta\epsilon.}\tag{606}
\]

Both reduced quadratic kinetic and potential terms are positive if \(\epsilon,b,\zeta,\eta>0\). For every strictly positive mass coefficient the vector therefore has two transverse and one longitudinal propagating polarization, with no negative-energy *quadratic* mode in this homogeneous classical analysis. This conclusion does not resolve nonlinear strong-coupling, coupling to gravity, or quantum unitarity.

### 3.1 Shared dispersion constraint

All three polarization speeds agree if and only if the coefficients obey

\[
\boxed{\frac\eta\zeta=\frac b\epsilon.}\tag{607}
\]

Then

\[
\omega_{T,L}^2=c_\gamma^2k^2+\Omega_\gamma^2,\quad
c_\gamma^2=b/\epsilon,\quad \Omega_\gamma^2=\eta/\epsilon>0.\tag{608}
\]

A mass can be operationally defined in a locally calibrated reference medium by \(m_\gamma c_{\rm ref}^2=\hbar\Omega_{\rm ref}\). In varying media, whether this parameter represents a universal, constant *rest mass* or an environmental effective mass must be specified. Equality of the instantaneous dispersion does **not** establish equal amplitudes or group transport through strongly inhomogeneous environments.

## 4. Electrostatic prediction: the new mass–range link

In a static homogeneous environment with a point charge \(Q\), Gauss's constraint is

\[
-\epsilon\nabla^2\varphi+\zeta\varphi=Q\delta^3(\mathbf r).\tag{609}
\]

Its solution is the Yukawa potential

\[
\boxed{\varphi(r)=\frac{Q}{4\pi\epsilon r}e^{-r/\ell_Y},\qquad
\ell_Y=\sqrt{\frac\epsilon\zeta}.}\tag{610}
\]

Using the shared-dispersion condition (607),

\[
\boxed{\ell_Y=\frac{c_\gamma}{\Omega_\gamma}.}\tag{611}
\]

In the reference medium this corresponds to the reduced Compton wavelength, \(\hbar/(m_\gamma c_{\rm ref})\). This is a consequential test of the **specific matched Stueckelberg model**: it cannot choose an arbitrary nonzero photon mass gap while leaving the static electric-force range completely independent. A more general vector theory, an environmental Higgs phase, or different longitudinal/transverse speeds could change this conclusion, but would require new equations.

A finite-difference numerical check of the source-free Yukawa radial equation gave a maximum differential-equation residual that decreases under grid refinement:

| Radial grid points | Maximum residual |
|--:|--:|
| 201 | 1.83×10⁻⁵ |
| 401 | 5.18×10⁻⁶ |
| 801 | 1.38×10⁻⁶ |
| 1601 | 3.57×10⁻⁷ |

The trend agrees with the expected second-order finite-difference convergence; it tests the numerical implementation, not the underlying validity of the physical model.

A large \(\ell_Y\) makes atomic corrections tiny, but it does not automatically remove constraints from magnetostatic fields, planetary-scale electrical phenomena, or astrophysical propagation. Further, the leading expansion of \(e^{-r/\ell_Y}/r\) contains a constant potential shift, which cancels in an isolated atomic transition to leading order; spectroscopy requires comparing the **difference** between atomic energy levels, not simply the absolute potential offset.

## 5. An exactly matched, evolving coefficient family

Choose an illustrative field-dependent response

\[
\epsilon=e^{\lambda\psi},\quad b=e^{-\lambda\psi},\quad
\eta=\Omega_0^2e^{\lambda\psi},\quad
\zeta=\Omega_0^2e^{3\lambda\psi}.\tag{612}
\]

The three vector modes then share

\[
\boxed{\omega^2(T,k)=e^{-2\lambda\psi(T)}k^2+\Omega_0^2.}\tag{613}
\]

For increasing \(\psi\), the characteristic speed \(c_\gamma=e^{-\lambda\psi}\) decreases while the frequency gap remains positive and constant. This example separates changing electromagnetic propagation from direct photon-mass dispersion. It does **not** prove that \(\psi\) increases indefinitely, and it should not be interpreted as an observational measurement of \(c_\gamma(T)\).

### 5.1 Coupled homogeneous-mode dynamics

After solving the vector's scalar-potential constraint, define

\[
K_L=\frac{\epsilon\zeta}{\epsilon k^2+\zeta},\quad
C_T=bk^2+\eta.
\]

For one representative transverse mode and the longitudinal mode,

\[
L_{\rm red}=\frac K2\dot\psi^2-V(\psi)+
\frac\epsilon2\dot A_T^2-\frac{C_T}2A_T^2+
\frac{K_L}2\dot A_L^2-\frac\eta2A_L^2.\tag{614}
\]

Its Euler–Lagrange equations are

\[
\begin{aligned}
&\frac d{dT}(\epsilon\dot A_T)+C_TA_T=0,\\
&\frac d{dT}(K_L\dot A_L)+\eta A_L=0,\\
&K\ddot\psi+V_{,\psi}
-\tfrac12\epsilon_{,\psi}\dot A_T^2+\tfrac12C_{T,\psi}A_T^2
-\tfrac12K_{L,\psi}\dot A_L^2+\tfrac12\eta_{,\psi}A_L^2=0.
\end{aligned}\tag{615}
\]

The canonical total energy

\[
\boxed{E_{\rm tot}=\frac K2\dot\psi^2+V+
\frac\epsilon2\dot A_T^2+\frac{C_T}2A_T^2+
\frac{K_L}2\dot A_L^2+\frac\eta2A_L^2}\tag{616}
\]

satisfies \(dE_{\rm tot}/dT=0\) exactly for the closed autonomous model. When \(\psi\) is driven by a prescribed external density history, that term must instead be included in the open-system energy accounting; external density cannot be changed without tracking its energy source.

## 6. Reproducible numerical experiment

Set \(\lambda=0.5\), \(k=3\), \(\Omega_0=0.4\), \(K=1\), and \(V=0.0225(\psi-1)^2\). Initialize \(\psi=\dot\psi=0\), \(A_T=0.012\), \(A_L=0.030\), and \(\dot A_T=\dot A_L=0\); integrate over dimensionless \(0\le T\le8\) with `scipy.integrate.solve_ivp`, method `DOP853`, `rtol=2e-12`, `atol=2e-14`, max step `0.03`.

| Quantity | Initially | At \(T=8\) |
|---|---:|---:|
| Scalar \(\psi\) | 0.000000 | 1.133880 |
| Propagation characteristic speed | 1.000000 | 0.567259 |
| Scalar energy | 0.022500 | 0.022807 |
| Transverse mode energy | 0.000660 | 0.000381 |
| Longitudinal mode energy | 0.000072 | 0.000043 |
| Total energy | 0.02323152 | 0.02323152 |

Maximum relative numerical drift of total energy: **1.55×10⁻¹⁵**. The maximum transverse–longitudinal instantaneous frequency mismatch over tested parameter values was **1.78×10⁻¹⁵**. These unusually small errors demonstrate internal accuracy for this small ODE problem, not empirical support for the theory.

The scalar gained energy from the vector modes in the selected initial-value experiment; with different scalar initial conditions, the field could oscillate or reverse and the vector modes could gain energy. The result does not establish a monotonic billions-of-years propagation history.

See `ArcSecs_Part_XIX_Energy_Exchange.png`, `ArcSecs_Part_XIX_Propagation.png`, and `arcsecs_part_xix_coupled_energy.csv` for the underlying trajectory.

## 7. Fine structure and atomic standards: why wave slowing is not yet redshift

For the impedance-matched family (612), the characteristic speed scales as \(c_\gamma=e^{-\theta}\), with \(\theta=\lambda\psi\). If the elementary charge \(e\) and \(\hbar\) remain constant,

\[
\alpha\propto\frac{e^2}{\epsilon\hbar c_\gamma}=\text{constant}.\tag{617}
\]

This can avoid a large change in the fine-structure **ratio**. But the leading nonrelativistic Coulombic atomic transition frequency still depends on the electron inertial mass and electrostatic coefficient:

\[
\nu_{\rm atom}\propto m_e\epsilon^{-2},\tag{618}
\]

up to relativistic, reduced-mass, nuclear, spin, and other corrections. Postulate for illustration \(m_e\propto e^{q\theta}\) and fixed emission-site charge and \(\hbar\). For spatially homogeneous, adiabatic, nondispersive propagation between stationary source and observer, the wave frequency ratio is \(\omega_a/\omega_e=e^{-(\theta_a-\theta_e)}\). Then

\[
\boxed{1+z_{\rm spec}=e^{(q-1)(\theta_a-\theta_e)}.}\tag{619}
\]

For \(\Delta\theta=\ln2\):

| Electron-mass exponent \(q\) | \(m_{e,a}/m_{e,e}\) | Spectroscopic \(z\) |
|---:|---:|---:|
| 0 | 1 | −0.500 |
| 1 | 2 | 0 |
| 1.5 | 2.83 | 0.414 |
| 2 | 4 | 1.000 |

**Result:** The matched electromagnetic model with constant electron mass yields a **blueshift** when the light-propagation speed decreases. Positive redshift is possible in this toy scaling if electron inertia evolves sufficiently fast, but then reproducing \(z=1\) in this example requires a factor-four electron inertial-mass change between epochs. That is not a viable matter model by assertion; it would modify atomic ratios and other dimensionless observables unless related matter sectors coevolve appropriately. Accurate astronomical lines also require a source motion, gravitational, spatial screening, and finite-mass calculation.

Atomic-clock comparisons constrain multiple field couplings, not only \(\alpha\). Relevant examples include the experimental and theoretical analyses of fundamental-constant drifts and electron/nuclear interactions [R3, R4].

## 8. Literature and observational cross-checks

**8.1 Photon mass.** A February 12, 2026 *Physical Review D* fast-radio-burst study reports one-sigma photon-rest-mass upper limits \(4.83\), \(4.71\), and \(4.86\times10^{-51}\) kg across three cosmological assumptions [R2]. These are **model-dependent upper bounds**, not detections. For a separate illustrative mass energy of \(10^{-18}\) eV, \(\hbar/(m_\gamma c)=1.9733\times10^{11}\) m. The same expression evaluated at \(4.83\times10^{-51}\) kg gives \(7.2830\times10^7\) m. A model's *local* mass parameter must be compared against the appropriate local and astronomical constraints, not solely one selected FRB limit.

In the simple constant-medium massive dispersion, the leading high-frequency fractional group-speed correction is \(\tfrac12(m_\gamma c^2/h\nu)^2\). For the \(10^{-18}\) eV benchmark it is only \(2.92\times10^{-26}\) at 1 GHz and \(8.13\times10^{-38}\) at 500 nm. A very small positive rest mass therefore does not by itself account for an order-unity decrease in optical photon speed; such a decrease would have to come from the medium/background coefficients or a new dispersion mechanism.

**8.2 Environmental mass is possible but not automatic.** A November 19, 2026 *Journal of High Energy Physics* paper by Gruzinov, Hook, and Huang explores an Abelian-Higgs mechanism with different electromagnetic phases under different magnetic fields [R5]. It shows why bounds derived for a uniform Proca mass need not automatically transfer unchanged to an environmentally dependent Higgs theory. It does **not** demonstrate the redshift, matter separation, or apparent-size predictions of ArcSecs.

**8.3 Atomic clocks.** The 2024 *Physical Review D* analysis by Dzuba, Flambaum, and Mansour studies how atomic transition ratios constrain scalar couplings to photons and matter [R3]. An earlier clock-comparison result reports a fractional fine-structure drift estimate of \(1.0(1.1)\times10^{-18}\,\mathrm{yr^{-1}}\) [R4]. The particular observable, model assumptions, and combinations of constants matter; varying one dimensional parameter alone is not a directly testable claim.

**8.4 Gravitational-wave speed.** The joint GW170817/GRB 170817A observation gave an arrival-time separation of about 1.7 seconds and tight conditional constraints on differences in electromagnetic and gravitational-wave propagation speeds [R6]. The current action has **no gravitational-wave sector**, so it cannot yet explain that synchronization.

**8.5 Distance duality.** A *Physical Review D* paper accepted November 13, 2026 finds no significant redshift-dependent distance-duality deviation in its restricted DESI DR2 reanalysis, while documenting a calibration-dependent normalization ambiguity [R7]. The present construction does not yet predict \(D_A(z)\), \(D_L(z)\), or radiation focusing. The earlier Part XVII–XVIII brightness requirement is not resolved here.

## 9. What is established, and what is not

| Proposed requirement | Current research state |
|---|---|
| Nonzero vector mass with exact gauge redundancy | **Constructed** classically using Stueckelberg field |
| Longitudinal mode and positive quadratic kinetic energy | **Derived** for positive coefficients |
| Matching local longitudinal/transverse dispersions | **Derived** for \(\eta/\zeta=b/\epsilon\) |
| Electrostatic range linked to mass gap | **Derived** for this matched model |
| Closed-system total-energy conservation | **Derived and numerically checked** |
| Finite scalar-driven slowing episode | **Demonstrated** in a dimensionless toy simulation |
| Stable realistic atomic standards and positive redshift | **Not demonstrated**; toy homogeneous model requires extra matter response |
| Nonsingular many-body recession arising from same action | **Not demonstrated** |
| Cosmological billions-of-years monotonic slowing | **Not demonstrated** |
| Gravitational-wave co-propagation | **Not included** |
| Angular-size and luminosity-distance predictions | **Not derived** |
| Agreement with data and experimental photon-mass bounds | **Not fitted** |
| Quantum completion and consistency of matter couplings | **Not demonstrated** |

## 10. Part XX — A bounded continuation

The most productive next step is a **charge-conserving matter and atomic spectroscopy model in a smooth environmental field**, not another arbitrary cosmological distance function. First, couple a gauge-invariant electron/ion model to (601) and explicitly compute the ratio of two transition frequencies while the environmental scalar evolves. Second, solve the associated screened electrostatic boundary-value problem across low- and high-density media; use its actual field profile rather than local equilibrium assumptions. Third, propagate narrow photon wave packets through that profile and compute spectral line shapes and phase/group delays. Only then connect the result to matter motion and the angular/brightness transport equations.

A failure of these **specific** field coefficients would be evidence against those coefficients, not a mathematical disproof of the twelve foundational premises. Conversely, conserving energy in one toy simulation does not establish the entire research program.

## References (verified as of November 23, 2026)

- **[R1]** Ruegg and Ruiz-Altaba, *The Stueckelberg field* (2004 review/preprint). https://arxiv.org/abs/hep-th/0304245
- **[R2]** Zhang, Liu, Yu, and Wu, *Photon rest mass from localized fast radio bursts with an improved distribution of the dispersion measure from extragalactic gas*, *Phys. Rev. D* **113**, 043513 (12 February 2026). https://doi.org/10.1103/sh7h-94jy
- **[R3]** Dzuba, Flambaum, and Mansour, *Constraints on the variation of physical constants, equivalence principle violation, and a fifth force from atomic experiments*, *Phys. Rev. D* **110**, 055022 (2024). https://doi.org/10.1103/PhysRevD.110.055022
- **[R4]** Lange et al., *Improved Limits for Violations of Local Position Invariance from Atomic Clock Comparisons*, *Phys. Rev. Lett.* **126**, 011102 (2021). https://pubmed.ncbi.nlm.nih.gov/33480794/
- **[R5]** Gruzinov, Hook, and Huang, *The universe as a superconductor: how to search for a photon mass*, *JHEP* 2026, article 186 (19 November 2026). https://doi.org/10.1007/JHEP11(2026)186
- **[R6]** LIGO–Virgo and Fermi–INTEGRAL collaboration summaries of GW170817 and GRB 170817A. https://ligo.org/science-summaries/gw170817grb/
- **[R7]** Melchiorri, *Calibration and redshift modes in tests of Etherington's distance duality: A DESI DR2 reanalysis*, *Phys. Rev. D*, accepted 13 November 2026. https://doi.org/10.1103/2glj-ljfh

### Reproducibility and limitations

All computed numbers are generated by the accompanying Python script, without embedded imported observational data. Dimensions are normalized in the ODE portion. The physical mass conversion uses CODATA constants via `scipy.constants`. No parameter fitting, independent solver, high-resolution multidimensional field evolution, or observational likelihood has been attempted. Existing report files are preserved unchanged.
