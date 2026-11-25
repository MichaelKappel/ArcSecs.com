# Part XXXIV — Forward-coherent physical conversion and the escape criterion

**Research status.** This chapter extends Parts XXXII–XXXIII rather than replacing the successful reduced Part XXXI reference. It develops two distinct local interaction controls and a selected-mode escape model. All new computations use normalized homogeneous units $C=B_*=\hbar=1$, except when a different reservoir characteristic is explicitly declared. No measured astrophysical density, coupling, coherence length or photon mass is inferred. The twelve foundations and C-01 objective are unchanged. The code and tables reproduce the declared controls, not the universe.

## A finite-range physical mediator instead of an angular filter

Extend the bounded classical action J2 by a real mediator $\sigma$ with positive canonical kinetic term, characteristic one in the reference scattering calculation, and mass $\mu_s>0$. Replace J1 for this candidate by

$$\chi(\sigma)=\chi_m\tanh(g_s\sigma/\chi_m).\tag{K1}$$

Keep the two Stückelberg vector mass terms and the positive electric and magnetic kinetic matrices of J2. The scalar potential can be chosen as

$$\begin{aligned}
V={}&\frac{\mu_s^2}{2}\left(\sigma+\frac{h_s}{\mu_s^2}\phi_0\phi_1\right)^2\\
&+\frac{M_0^2}{2}\phi_0^2+\frac{M_1^2}{2}\phi_1^2+V_+,\quad V_+\geq0.
\end{aligned}\tag{K2}$$

This generates the cubic vertex $-h_s\sigma\phi_0\phi_1$ in the Lagrangian and a nonnegative quartic completion. The field-strength term generates $-g_s\sigma F_0^{\mu\nu}F_{1\mu\nu}/2$ to leading order at $C=1$. Both couplings are local and gauge invariant. In natural units $[g_s]=E^{-1}$, $[h_s]=E$, $[\mu_s]=E$. The electric matrix has eigenvalues $(1\pm\chi)/C>0$ and the mass matrix is positive. The scalar kinetic and potential energies are nonnegative; variation supplies reciprocal sources, rather than applying a photon speed clamp. For the frozen homogeneous background of this calculation, all principal characteristics have the reference speed one; the scalar-sector speed may be varied separately in a different medium. This is a classical EFT control. It does not establish a UV-complete quantum theory, global well-posedness of every background, or an astrophysically viable coupling. A light mediator with fixed $h_s$ can make the quartic term large; the zero-mass propagator limit below is a bound on a tree-level kernel, not a claim that K2 has a regular massless limit at fixed couplings.

For on-shell scattering $A+R_0\to B+R_1$ (the reservoir is initially at rest in the lab), the tree-level exchange replaces the J9 contact coefficient by

$$g_b\longrightarrow \frac{g_s h_s}{\mu_s^2-t},\quad t=(p-p')^2.\tag{K3}$$

The Lorentz-algebra contraction is valid here because all frozen characteristics are one. It does not prescribe a material geometry. Its vector tensor is still the gauge-invariant J9 tensor, so Ward substitutions vanish. The heavy-mediator limit with $g_s h_s/\mu_s^2$ held fixed reproduces the contact shape and normalization. The mass scan holds $g_s h_s=0.01$ fixed to compare shapes; no physical weak-coupling or unitarity bound is inferred from the formal cross sections. In particular, large elastic cross sections in the extreme long-range limit require an infrared/finite-size and higher-order treatment.

## Exact forward-transfer floor for inelastic conversion

In the center-of-momentum frame let $q_i,q_f$ be the incoming/outgoing vector momentum magnitudes, and $e_i,e_f$ their energies. Put $y=1-\cos\theta_*$, $b=2q_iq_f$. Then

$$\begin{aligned}
t(y)&=t_0-by,\\
t_0&=(e_i-e_f)^2-(q_i-q_f)^2,\\
a&=\mu_s^2-t_0.
\end{aligned}\tag{K4}$$

If both outgoing invariant masses exceed the respective incoming masses, the transfer is necessarily spacelike: if $q=p-p'$ were future causal, $p=p'+q$ would imply $m_i\geq m_f$, contrary to the assumed increase. If $q$ were past causal, $R_0=R_1-q$ would similarly imply $M_i\geq M_f$. This uses the reverse triangle inequality for future causal momenta. Thus $t_0<0$ even in the exactly forward direction. Decreasing the mediator mass cannot remove the finite inelastic momentum-transfer floor. This result does not exclude other physical channels or near-degenerate multi-step transitions.

For incident transverse polarization averaged over its two states, define $d_0=e_ie_f-q_iq_f$. The positive polarization-summed tensor weight is

$$\begin{aligned}
W(y)=\frac12\big[&(-d_0+e_ie_f y)^2\\
&+(d_0+q_iq_f y)^2\\
&+e_i^2m_f^2 y(2-y)\big].
\end{aligned}\tag{K5}$$

The differential cross section integrated over azimuth is

$$\frac{d\sigma_T}{dy}=\frac{q_f}{32\pi s q_i}
\frac{(g_sh_s)^2 W(y)}{(a+by)^2}.\tag{K6}$$

Here $s$ is the two-body invariant squared total energy, not a reservoir characteristic. The lab angle is computed by the exact boost of the outgoing momentum, not identified with the center-of-momentum angle. The normalized cone fraction uses the exact lab angle cutoff and integrates K6. At fixed kinematics, the relative shape for larger $a$ compared with smaller $a$ is proportional to $[(a_{\rm small}+by)/(a_{\rm large}+by)]^2$, increasing in $y$. Consequently the normalized distribution moves toward larger angles as $a$ increases; the smallest possible $a$ gives the largest forward cone fraction within this kernel family. This is an ordering of conditional distributions, not an absolute reaction-rate bound.

The numerical integrals use $z=\ln(1+by/a)$ to resolve a tiny forward cone; $dy/(a+by)^2=e^{-z}dz/(ab)$. The forward invariant is computed at 65 decimal digits before float quadrature. For the exact reference of J10 ($m_i=10^{-6}$, $m_f=0.5$, $M_i=100$, $M_f=100.1$, $E_i=1$), $t_0=-0.0534657349453$ and $\sqrt{-t_0}=0.231226587886$. Results for a conversion event:

| Quantity | Contact J10 | Zero-mass kernel limit |
|:--|--:|--:|
| One-arcsec fraction | $1.445\,10^{-13}$ | $9.325\,10^{-11}$ |
| Mean angle (degrees) | 119.821 | 63.649 |
| Mean energy | 0.889076 | 0.894892 |
| Energy SD | 0.003113 | 0.004534 |
| Lab longitudinal fraction | 0.086880 | 0.239755 |

Although the mediator improves the reference cone fraction by about 646 times, its absolute value is still much less than one. It also increases the outgoing longitudinal fraction in this reference. The exact forward kinematic energy is 0.899683 and its group speed 0.831348. No arbitrary angular cut has been applied to the physical rate.

![Conditional one-arcsecond cone acceptance for seven scanned mass combinations; five displayed. The nearly degenerate and elastic controls can be forward-peaked, unlike the large gap change. These are tree-level shapes, not physical astronomical cross sections.](figures/review6_mediator.pdf)

The 72 rows include 70 positive-mass mediator cases, one contact control and one formal massless inelastic kernel. For the near-degenerate example $m_i=0.1,m_f=0.10001,M_f-M_i=10^{-6}$ and $\mu_s=10^{-8}$, the cone fraction is approximately 0.8844, but the retained mean energy is 0.9999989997 and the change of gap is minute. The exactly elastic small-mediator control can approach unity cone fraction while transferring negligible energy. These examples establish why a proposed dense conversion ladder must be tested for cumulative angular diffusion and optical depth, rather than assuming that each step is harmless. Even for independent small deflections with zero mean transverse direction, the mean-square deflection grows as the sum of the single-step variances in the paraxial limit. An individual cone acceptance is not a bound on the final image, and the elastic control is not photon aging. The near-degenerate/elastic results are conditional on the Born approximation; actual multiple scattering, screening, finite density, perturbative unitarity and polarization transport remain unsolved.

## A phase-matched collective reservoir: collinear conversion is possible

A distinct coherent control is obtained by retaining the local interaction K1 but allowing the real physical reservoir excitation $\sigma$ to have a slower characteristic $s_b$ in a material rest frame, with dispersion $\omega_b(Q)=\sqrt{s_b^2 Q^2+\mu_b^2}$. A positive local kinetic term $[\dot\sigma^2-s_b^2|\nabla\sigma|^2-\mu_b^2\sigma^2]/2$ gives this free dispersion. It has no negative energy or super-ceiling characteristic in the frozen background for $0<s_b<1$. It is not the same parameter set used to derive K6. The bounded mixing with $\sigma$ allows a leading $A\to B+\sigma$ vertex; two distinct positive-mass vector branches are retained. The reservoir must actually have the selected excitation and a physical means to accept and transport its momentum. This 1-to-2 conversion is a local candidate distinct from both the 2-to-2 exchange and the Chapter 30S same-branch scalar bath.

For co-directed incident and outgoing packets in a homogeneous medium, impose

$$\begin{aligned}
p_B&=p_A-Q>0,\\
E_A&=\sqrt{p_A^2+m_A^2},\\
E_A&=\sqrt{(p_A-Q)^2+m_B^2}+\omega_b(Q).
\end{aligned}\tag{K7}$$

For $m_B>m_A$ and $E_B<E_A$, $Q> E_A-E_B$ in these units: the momentum difference between fixed-mass states is greater than the energy difference since $dE/dp<1$, and increasing the final mass decreases its momentum further at a given energy. Thus the emitted reservoir excitation must be capable of carrying more momentum than energy in reference units. A subcharacteristic material excitation can meet that demand, unlike a freely propagating massive scalar with the same reference characteristic. This is a kinematic necessity for this collinear free-mode channel, not a proof of the existence of the physical medium.

Choose $m_A=10^{-6}$, $m_B=0.5$, $E_A=1$, $s_b=0.4$, $\mu_b=0.02$. Solving K7 for a forward root gives:

| Variable | Normalized value |
|:--|--:|
| Incident momentum | 0.9999999999995 |
| Reservoir momentum $Q$ | 0.257685206948 |
| Outgoing momentum | 0.742314793051 |
| Reservoir energy | 0.104996507279 |
| Outgoing energy | 0.895003492721 |
| Outgoing group speed | 0.829398766696 |
| Reservoir group speed | 0.392676234478 |

The energy and momentum identities are checked to $2\,10^{-15}$ in the normalized calculation. The outgoing packet is slower, retains a positive gap and is exactly collinear **conditional on this selected mode**. The reservoir group speed is below its own characteristic, and all three free-mode characteristics are at most one. In the collinear geometry the transverse field-strength matrix element is proportional to $E_AE_B-p_Ap_B=0.152688699670$ and is diagonal in transverse polarization; transverse-to-longitudinal conversion vanishes for this vertex at exactly zero angle. This is a constructive selection rule, not a proof that the medium selects this direction. Other modes in the continuum are still allowed unless an actual correlation, structure factor and boundary condition suppress them. A static spatially uniform mixing cannot change momentum or remove energy, and a static inhomogeneous linear medium preserves frequency; this channel must involve dynamical physical reservoir excitations.

## Coherence length and angular acceptance

To express the necessary angular selection quantitatively, consider a coherent material mode with transverse amplitude envelope $\exp[-r_\perp^2/(2L_\perp^2)]$, phase-matched longitudinally. Its transverse Fourier intensity is proportional to $\exp[-L_\perp^2 q_\perp^2]$. For a paraxial, azimuthally symmetric output with otherwise slowly varying matrix element, the integrated probability inside angle $\theta_0$ is

$$P_{\rm cone}\simeq 1-\exp[-L_\perp^2p_B^2\sin^2\theta_0].\tag{K8}$$

In this approximation the two-dimensional transverse momentum measure is used, rather than a one-dimensional angular Gaussian. For the K7 reference and one arcsecond, the 90% and 99% requirements are respectively $L_\perp=4.21643\,10^5$ and $5.96293\,10^5$ normalized inverse momentum units. These are required coherence lengths under the assumed Gaussian envelope, not derived sizes of a cosmic structure. Multiplying by a physical inverse reference momentum would give metres only after calibration. Finite longitudinal length and a real dispersion, background population, coherence time and mode-density calculation are indispensable. This control deliberately does not impose K8 on the incoherent scattering cross section K6.

## Finite collective capacity, reverse transitions and frequency selectivity

For a single phase-matched mode, truncate the local interaction to a rotating-wave Hamiltonian coupling radiation modes $a,b$ and a collective reservoir spin with $R$ two-level sites. A site excitation in the selected spin wave carries momentum $Q$ and energy $\omega_b(Q)$. The reservoir spin description is an additional physical coarse graining; its material site density and microscopic matrix element are not derived from K1. Let $N$ be the total radiation number, $n$ the converted number, and start with all sites unexcited. The term

$$H_{\rm int}=g(b^\dagger a S^+ + a^\dagger b S^-)\tag{K9}$$

preserves $N$ and $n_B-n_{\rm exc}=0$. In the symmetric subspace $0\leq n\leq\min(N,R)$, its only off-diagonal entries between $n,n+1$ are $g(n+1)\sqrt{(N-n)(R-n)}$. The diagonal detuning relative to the initial free energy is $n\delta$, where $\delta=E_B+\omega_b-E_A$. This finite Hermitian matrix preserves norm and total Hamiltonian energy. On exact resonance the free energy and momentum ledgers independently close for every basis state; off resonance interaction energy, and switching work if the coupling changes externally, must be counted. The conserved momentum follows from the selected-mode phase match. This is a finite-cell, reciprocal quantum control, not a derivation of the local continuum rate or Part XXXI mobility.

For $N=1$, writing $G=g\sqrt R$, the exact converted population is

$$P_B(T)=\frac{G^2}{G^2+\delta^2/4}
\sin^2\!\left(T\sqrt{G^2+\delta^2/4}\right).\tag{K10}$$

The finite capacity is explicit and the reverse reaction is unavoidable in the isolated resonant cell: on resonance full conversion at $T=\pi/(2G)$ is followed by complete return to the initial state at $T=\pi/G$. For $g=0.01,R=16$, $G=0.04$ and the first maximum is at $T=39.26990817$. Fifteen finite-cell cases with $N=1,4,8$, $R=1,2,4,16$ in the declared combinations and detunings 0, 0.02, 0.1 were evolved by symmetric-matrix eigendecomposition. The single-photon analytic solution is an independent arithmetic control. Capacity, norm and total relative energy are tested at each stored time. No closed finite-cell trajectory is identified with fundamental irreversibility.

![Finite-mode population evolution; reverse transitions and capacity limits remain visible. The detuned single-packet example is not an on-shell asymptotic scattering cross section.](figures/review6_coherent_cells.pdf)

Keeping $Q$ fixed and choosing the on-resonance conversion duration $\pi/(2G)$ gives an energy-dependent detuning $\delta(E)=\sqrt{(\sqrt{E^2-m_A^2}-Q)^2+m_B^2}+\omega_b(Q)-E$. The simulation uses 401 incident energies from 0.6 to 1.4. Away from the matched energy, K10 yields different conversion probabilities. The final free branch energy in this finite-time control need not equal $E-\omega_b$ when $\delta\ne0$; the mismatch is explicitly stored, not called an astronomical redshift. An actual spectral kernel must enforce the full energy ledger including interaction/switching and physical linewidth. Fixed-frequency mode conversion can be frequency selective and cannot be extrapolated into an achromatic astronomical aging law.

![Fixed phase-match mode and finite interaction duration: incident-energy sensitivity of the converted population.](figures/review6_detuning.pdf)

## Escape-assisted conversion: a continuous population criterion

The closed K9 cell does not supply a history law. A physical route to approximate one-way transfer is emission into a reservoir mode that transports energy and momentum away from the interaction region before it can return. For a single resonant incident packet, take the selected-mode coupling $G>0$ and an outgoing escape channel with rate $\kappa\geq0$. The escaped state includes both the outgoing B packet and the reservoir excitation outside the local interaction cell. In a Markov approximation to a continuum with no incoming excitation, the Lindblad jump is $\sqrt{\kappa}|B,\mathrm{escaped}\rangle\langle B,\mathrm{local}|$. The no-jump amplitudes can be written as a real $a$ and $-i y$; the escaped population is $P_{\rm esc}$. Then

$$\begin{aligned}
\dot a&=-Gy,\quad \dot y=Ga-\frac\kappa2 y,\\
\dot P_{\rm esc}&=\kappa y^2,\\
a^2+y^2+P_{\rm esc}&=1.
\end{aligned}\tag{K11}$$

The escape term is not destruction of radiation or of reservoir energy: it transfers the selected state out of the cell. The free ledger assigns the same energy and momentum to the local and escaped B-plus-reservoir states on resonance. A continuum dilation, outgoing boundary flux and actual spectral density are required for a full local conservation proof. A finite-temperature or reflected incoming reservoir requires the reverse channel and its physical detailed balance; the vacuum outgoing-boundary idealization is not valid in an arbitrary cosmic environment. Rate $\kappa$ is not derived here; a rough transport timescale would involve the reservoir group speed and the physical longitudinal interaction length, which must be computed rather than fitted as a universal drag constant.

Eliminating $y$ gives $\ddot a+(\kappa/2)\dot a+G^2a=0$, with $a(0)=1$ and $\dot a(0)=0$. For $\kappa>4G$, put $\lambda=\sqrt{(\kappa/4)^2-G^2}$. The exact solution is

$$\begin{aligned}
a(T)&=e^{-\kappa T/4}\left[\cosh(\lambda T)+\frac{\kappa}{4\lambda}\sinh(\lambda T)\right],\\
y(T)&=\frac{G}{\lambda}e^{-\kappa T/4}\sinh(\lambda T).
\end{aligned}\tag{K12}$$

Both are nonnegative for all $T\geq0$. At $\kappa=4G$, $a=(1+GT)e^{-GT}$ and $y=GT e^{-GT}$, also nonnegative. It follows that

$$\kappa\geq4G\ \Longrightarrow\ \frac{d(1-a^2)}{dT}=2Gay\geq0.\tag{K13}$$

This is a continuous analytical monotonicity criterion for the *total converted population*, including escaped excitations. The escaped population alone increases for every nonnegative escape rate. For $0\leq\kappa<4G$, the trigonometric continuation of K12 produces oscillations and sign reversals of the total population derivative. Even with no return of escaped states, coherent back-conversion occurs locally before escape. In the very large escape-rate limit the conversion becomes slow: the slow amplitude exponent approaches $-2G^2/\kappa$. Thus faster reservoir escape does not automatically improve net conversion throughput.

Six escape ratios $\kappa/G=0,1,2,4,8,16$ at $G=0.04$ were compared with a separate DOP853 solution of K11. The analytic and numerical solutions agree to a maximum sampled absolute difference $1.54\,10^{-13}$ using relative tolerance $10^{-12}$, absolute tolerance $10^{-14}$ and maximum step 1. The initial unconstrained-step integration at the largest escape rate differed by $1.44\,10^{-8}$ and was refined; solver settings matter. First sampled times for 90% escape are respectively unavailable, 122, 59.5, 67, 118 and 231.5 in normalized time units. These are resolution-0.5 observations of the simulated curve; the continuous sign assertion follows analytically from K12 rather than these samples.

![Escape-assisted converted-population control. At and above critical damping the total converted population is monotonically nondecreasing. Excessive escape slows net transfer.](figures/review6_escape.pdf)

Do not convert K13 into a single-photon speed theorem. A coherent superposition has multiple dispersion poles and need not possess a group velocity equal to its population-weighted branch speeds. Even for an incoherent ensemble, a monotone mean speed is not a proof that every packet continuously slows. The Part XXXI interval certificate concerns a different, reduced trajectory and is retained without extension. A physically derived multi-level dense dressing limit would have to give an individual pole, a linewidth, a pathwise drift law and energy/momentum/clock calibration, not merely monotonically changing populations. K13 is useful because it identifies a concrete, testable mechanism for suppressing local reverse conversion, not because it has completed Foundation 3.

## Why static mixing and uniform temporal dressing are not the history law

For a single homogeneous branch $E^2=C(T)^2p^2+\Delta(T)^2$, translation invariance keeps $p$ fixed. Differentiation gives

$$E\dot E=Cp^2\dot C+\Delta\dot\Delta.\tag{K14}$$

At fixed momentum, a growing gap with fixed or rising $C$ cannot cause an energy redshift. In a globally time-dependent regulator, energy can fall despite growing gap only when $Cp^2\dot C<-\Delta\dot\Delta$. This is a condition on physical energy exchange with the regulator, not a constitutive derivation. A static spatial variation conserves the canonical energy for autonomous Hamiltonian evolution; real momentum exchange and a recipient are required for cumulative spectral energy change. As a counterfactual, imposing the Part XXXI reference final energy 0.695302669585 and gap 0.5065013693 at the original fixed momentum requires $C_f=0.4763424873$, giving group speed 0.3263358177, rather than the actual rising-wall exterior $C_f=1.2$ and final speed 0.822104. A common temporal modulation is therefore not that reference history mechanism. Keep C-01's environment-dependent regulator and per-packet aging distinct until their reciprocal coupling is derived.

## Emission, detection, clocks and optical timing

The C-01 exact initial ceiling is still a research requirement. From the existing finite-gap dispersion, if an emission protocol is to be within a fractional speed deficit $\varepsilon$ of its local characteristic, the exact condition is $\Delta/E\leq\sqrt{2\varepsilon-\varepsilon^2}$. It cannot yield exact equality at finite positive gap. A phase-matched conversion is downstream of emission and cannot repair this by redefining group speed as wavefront speed. The numerical value of the regulator's local characteristic must still be linked to dimensionless observations and a measured source response.

Use conserved charged currents in J2, including physical atomic transition matrix elements. If the receiver couples to the outgoing branch with charge $q_B$, its direct transverse amplitude contains $q_B\langle f|J_\perp|i\rangle e_B$. The squared coupling ratio $|q_B/q_A|^2$ is only a multiplicative comparison when the relevant field normalizations and current matrix elements agree; a physically normalized absorption rate also depends on the branch density of states, recoil, spectral line and detector aperture. If $q_B=0$ in an unmixed reception region there is no direct absorption through that current. Reconversion requires its own energy and momentum ledger. The positive bare mass has not been reinterpreted as the ensemble-averaged gap. The bound-state quantum receiver, longitudinal response beyond collinearity, optical/nuclear rate response, and regulator backreaction are not yet solved by K7–K13.

A stationary, one-dimensional reference with conversion at $x=d$ between fixed endpoints separated by one has actual path length one and arrival time $d/v_A+(1-d)/v_B$. For $d=0.5$ the arrival time is approximately 1.10285 rather than 1, while the equal-standard transported spectral ratio is $E_A/E_B=1.11731$. In a stationary repeatable history, two identical pulses separated at emission have that same interval at reception; the additional delay is not time stretching. In a moving source/receiver or time-dependent environment, solve the endpoint map rather than multiply the spectral ratio into the duration. Use the clock-calibrated flux and distance relations of the preceding sections. The receiver's local calibrated transition can change the registered spectral ratio, and aperture losses change measured brightness. The coherent direction control does not supply angular or luminosity distances for actual galaxies; independent geometric anchors and the physical three-dimensional matter flow remain required. No arbitrary distance compression or claim of measured object size follows.

## Verification and next research gates

The new numerical controls are supplied in \nolinkurl{code/review6_forward.py} and \nolinkurl{code/review6_escape.py}. They include 72 mediator rows, 15 finite-cell cases, 401 fixed-mode detunings, 8 aperture requirements, and 6 analytic-versus-ODE escape cases. The first script records 137 regression assertions, including positivity, contact recovery, selected refined quadratures, phase match and finite-cell unitarity and energy tests; they are not experiments. The high-precision forward transfer and log change of variable avoid subtracting nearly equal cosines at arcsecond scales. Five selected quadratures were compared at tighter relative tolerances, and the two Review 5.0 contact observables were reproduced. Three extreme elastic rows triggered integration warnings for small moment integrals (one selected refinement also warns); the warning counts are retained and those rows are illustrative rather than precision-certified. The central inelastic reference and selected near-degenerate comparison do not have those warnings. Tree-level cross sections are not nonperturbatively certified, and the coherent rate $G$ and escape rate $\kappa$ are not calibrated. The original 21-case independent-audit benchmark and the earlier wall certificate are preserved as source records; they are not represented as new independent experiments or a newly executed interval proof in this edition.

Retain K1–K6 as a finite-range exchange candidate and its large-transfer negative control. Retain K7–K10 as a phase-matched selected-mode candidate and its finite-capacity, frequency and reverse-transition controls. Retain K11–K13 as an analytical open-cell population criterion under declared assumptions. None is identical to Chapter 30S, Part XXXI or the Part XXXII contact conversion. A next investigation must derive the actual material structure factor and escape spectral density from a causal spatial reservoir, solve coupled multimode dynamics including the detector current and thermal reverse reactions, and establish whether the required forward momentum transfer and linewidth can coexist. Extend pathwise monotonicity only with a derived gap-history law and actual field backreaction. Then fit held-out optical, timing, geometric-anchor and clock measurements with shared parameters. Publication as an explicitly speculative research program need not await that fit, but publication as a demonstrated replacement for established cosmology would be unsupported.
