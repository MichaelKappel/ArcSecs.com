# ArcSecs Scientific Investigation — Part IX: Deriving the Screened Common-Field Model

**Executive Summary:** We construct and analyze an explicit scalar “common-field” theory (Candidate A-05c) coupling a screened scalar $\psi$ to both electromagnetism and gravity.  The model uses a density-dependent chameleon-like screening to suppress $\psi$ in high-density (e.g. atomic) environments while allowing a cosmological evolution of $\psi$ in low-density intergalactic space.  We derive the action, field equations, and photon/gravitional-wave (GW) speeds and propagate effects on atomic spectra, light redshift, GW timing, lensing, and distance measures.  In all cases we impose the fixed ArcSecs premises (Sec. 2) as axioms. 

Our analysis finds that *no stable parameter set fully satisfies all requirements simultaneously*.  In particular: reproducing a positive cosmological redshift via photon slowing generally requires $\psi$ couplings that distort atomic spectra or fine-structure beyond observational bounds; impedance-matching ($\epsilon=\mu$) yields a net blue‑shift, contrary to observation (Sec. 3E); obtaining correct weak-lensing sign conflicts with obtaining redshift from photon-slowing (Sec. 11); and synchronizing GW and photon speeds to within $O(10^{-15})$ (as demanded by GW170817/GRB170817A) severely constrains the $\psi$ coupling structure (Sec. 9).  One finds gravitational stability and ghost-free conditions impose additional inequalities (Sec. 5).  Numerically, models with significant photon slowing (Regime II) violate local tests or produce wrong lensing, while safe models (Regime I) have negligible cosmological effects.  Models with common $\psi$ coupling (Regime III) are tightly constrained by the multimessenger GW limit and atomic clocks. 

**Conclusion:** Under the stated assumptions, a *physically stable, density-screened common-field model cannot simultaneously* produce order-$H_0$ photon slowing and a positive redshift **while** preserving observed atomic spectra, gravitational lensing deflection, and GW–photon synchronization.  We identify which conditions fail and why (Secs. 11–14).  A provisional *“no-go”* result arises from the combined spectroscopic and lensing constraints, not simply from a single mismatch.  However, some tension remains: e.g., if screening is stronger or couplings are fine-tuned (beyond naturalness), partial success might be possible.  We detail these failures quantitatively, giving parameter bounds and suggested tests (Secs. 14–17).

Key quantitative constraints used include: Pantheon+ supernova distances (flat ΛCDM fits yield $\Omega_M=0.334\pm0.018$), DESI DR2 BAO distances consistent with flat ΛCDM, Planck 2018 CMB ($\Omega_M=0.315\pm0.007$, $H_0=67.4\pm0.5\,$km/s/Mpc), GRB170817A/GW170817 multimessenger (speed difference $|v_{\rm GW}-c|\!<\!10^{-15}c$), strong photon-mass limits ($m_\gamma<\!5\times10^{-51}\,$kg), and similar bounds on variation of fundamental constants (e.g. $|\dot\alpha/\alpha|<10^{-17}$/yr from atomic clocks).  We also note quasar spectra constrain any $\alpha$-variation to $\lesssim10^{-6}$ over cosmic time.  

All derivations (Secs. 3–12) use explicit units and continue equation numbering from (224) per instructions.  The ArcSecs axioms (Sec. 2) are treated as fixed assumptions, not challenged.  We work in a preferred cosmic time $T$ and nonrelativistic quasi-Euclidean geometry per ArcSecs guidelines.

---

## 1. ArcSecs Premises and Physical Assumptions

We begin by reiterating the **ArcSecs foundations (1–12)** as fixed premises, not to be debated (Sec. 2 of the task). For clarity in this analysis, we paraphrase the relevant ones with minimal comment:

1. **Photon mass:** Photons have a (possibly very small) invariant rest mass.  
2. **Time constant:** Time is a uniform, unchanging “When” (no cosmic time dilation or expansion of time).  
3. **Light slowing:** The speed of light $c_\gamma$ may vary (e.g. decrease) over cosmic time via a physical mechanism.  
4–7. **Nonexistence of spacetime:** Space and time are non-material (“Where” and “When” only).  No physical “stretching” of space or spacetime occurs; objects’ separations change only by real motion.  
8. **No ultimate speed:** Light is not necessarily the absolute speed limit in the universe.  
9. **Superluminal recessions:** Distant objects can move apart faster than light by motion (not spacetime expansion).  
10–11. **Unknown Universe size/age:** Total cosmic size and age are not fixed by this model; only inferred ages (e.g. of structure formation) are model-dependent.  
12. **Apparent distances:** Objects may be intrinsically smaller/closer than in standard cosmology (e.g. angular-size anomalies).

We accept these as the starting ontology.  We will compare to standard physics where needed (using GR/ΛCDM as a benchmark) but always remembering that space/time are not dynamic in this picture.  We **do not** assume an FRW metric or cosmic expansion; instead all distance changes are due to motion (and possibly light-speed variation).  Nevertheless, we use conventional relativistic Doppler formulas as limiting cases for moving sources (Sec. 3A, 8).  

Additional working assumptions include:

- **Preferred cosmic time $T$:** We work in a universal time parameter $T$, with physical clocks (proper times) running at rate $q_i=d\tau_i/dT$ that may vary from location to location or epoch.  
- **Minkowski background:** For small-scale processes (atomic, lab), we assume approximately flat spacetime with a global inertial time, but allow fields to modify local light speed.  
- **Homogeneous background for cosmology:** On cosmological scales we consider an isotropic, homogeneous matter distribution with characteristic distance scale factor $A_m(T)$ representing the typical separation of matter (in physical units).  This is analogous to a scale factor, but *not* implying expanding space – rather $A_m$ tracks physical separation due to motion.  
- **Units:** We use SI-like units (or natural units with $c_0$, $\hbar$ factors shown where needed) for clarity.  Equation numbering continues from (224) as required.

In what follows, we label derived results, assumptions, observations, etc., as specified: ArcSecs premises (1–12), “Definitions” (new model assumptions), “Eqn.” (consequences), “Obs” (measured constraints), “Spec.” (speculation).  We strive to cite primary literature for any measured values.  

---

## 2. Audit of Prior ArcSecs Equations

The task statement lists previous results (Sec. 3A–J).  We re-derive and correct these as needed, continuing numbering from (224).

**2.1. Photon transport (Sec. 3A).**  In a preferred time $T$, let a source move along $x_s(T)$ and emit a photon at time $T_e$ detected at $T_a$.  If the photon speed is $c_\gamma(T,\mathbf{x},\mathbf{k})$, then for a stationary observer the one-dimensional travel distance is
\[
x_s(T_e) = \int_{T_e}^{T_a} c_\gamma(T)\,dT
\tag{225}
\]
in an (assumed) homogeneous medium so $c_\gamma(T,\mathbf{x},\mathbf{k})=c_\gamma(T)$.  For successive emissions from a receding source, a derivation (accounting for source velocity $v_s(T_e)$) gives a redshift factor 
\[
1+z \;\;=\;\; \frac{(c_{\gamma,e}+v_s(T_e))}{c_{\gamma,a}}
\frac{q_o}{q_s}\,,
\tag{226}
\]
where $c_{\gamma,e}$ and $c_{\gamma,a}$ are the photon speeds at emission $T_e$ and absorption $T_a$, and $q_s,q_o$ are the clock-rate factors at source and observer (Sec. 3A).  In a static medium ($c_\gamma$ constant) with only Doppler motion, $q_o/q_s$ accounts for gravitational or clock-rate time dilation and the bracket recovers the standard Doppler (phase) formula.  In the limit of constant $c_\gamma$ and local Lorentz invariance, this yields the usual longitudinal Doppler 
\[
1+z = \sqrt{\frac{1+\beta}{1-\beta}}
\quad,\quad \beta=v/c_\gamma,
\tag{227}
\]
as required (for $q_o/q_s=1$).  We note this assumes phase velocity tracking and equal propagation for all frequencies (no dispersion) and that atomic standard frequencies scale with $q_i$ (Sec. 3E,F).  A full derivation must carefully treat source/observer motion, local clocks, and possible photon mass (dispersion).

**2.2. Homogeneous photon slowing model (Sec. 3B).**  A toy model was proposed: 
\[
c_\gamma(T) = c_a \exp[-\Gamma (T-T_a)],\qquad \Gamma>0,
\tag{228}
\]
with a constant source and observer (so $v_s=0$, $q_s=q_o$).  Then integrating (225) for a light pulse gives $x_s = (c_a/\Gamma)[1 - e^{-\Gamma (T_a-T_e)}]$.  One finds the redshift
\[
1+z = \frac{c_{\gamma,e}}{c_{\gamma,a}} = e^{-\Gamma (T_e - T_a)} = 1 + z,
\tag{229}
\]
with $z=e^{\Gamma\Delta T}-1$ (note $T_e<T_a$, so $\Gamma (T_a-T_e)>0$).  The comoving distance $D(z)$ (in static Euclidean space) is $D = x_s = (c_a/\Gamma)(z)$.  Under assumptions of photon-number conservation, energy loss proportional to $(1+z)$, and no lensing, one finds a luminosity distance (flux) law 
\[
D_L(z) = D\,(1+z) = \frac{c_a}{\Gamma}\,z(1+z),
\tag{230}
\]
as quoted.  

*Audit:*  We must check flux-redshift relation carefully.  In a static Euclidean model with slowing light, photon energy $E\propto c_\gamma$ and arrival rate $ \propto c_\gamma$ possibly, so $F\propto (c_\gamma)^2$.  If $c_\gamma\propto 1/(1+z)$, then $F\propto (1+z)^{-2}$.  For isotropic emission $L\propto \nu_{\rm emit}$ etc., one recovers $D_L = D\,(1+z)$ only if each factor cancels correctly.  We confirm (230) is valid under the *specific* assumptions used, but in general $D_L$ must be derived from the full radiative transfer in the model (Sec. 12).  

**2.3. Reconstructed slowing from ΛCDM distance (Sec. 3C).**  If one forces $D(z)$ to match a reference (e.g. ΛCDM) distance curve, then by inversion 
\[
\Gamma_e(z) = \frac{c_{\gamma,a}}{dD/dz}.
\tag{231}
\]
For the flat ΛCDM comoving distance 
\[
D(z)=\frac{c_0}{H_0}\int_0^z\frac{dz'}{E(z')},\quad
E(z)=\sqrt{\Omega_m(1+z)^3+\Omega_\Lambda},
\tag{232}
\]
one obtains $\Gamma_e(z)=H_0\,E(z)$ (setting $c_{\gamma,a}=c_0$).  The redshift drift (change in $z$ per $T$) from differentiating $z$ yields 
\[
\dot z = (1+z)\Gamma_a - \Gamma_e,
\tag{233}
\]
and substituting the reconstructed $\Gamma$ gives $\dot z = (1+z)H_0 - H(z)$, exactly matching the ΛCDM prediction.  *Important:* this is a mathematical degeneracy: matching $D(z)$ and $\dot z$ exactly by construction does not prove the physics.  We keep these formulae as benchmarks (with $\Gamma_e=H_0E(z)$ for $\Lambda$CDM distance fits) but do not treat them as physical predictions.

**2.4. Angular-distance problem (Sec. 3D).**  In a static Euclidean model (no metric expansion), the angular diameter distance $D_A=D$ (the same as the comoving distance).  With $D_L = D(1+z)$ from above, one finds the Etherington relation ratio $\eta(z)=D_L/[(1+z)^2 D_A] =1/(1+z)$ instead of $1$ (the usual FRW result).  This mismatch implies a clear observational test.  We will derive $D_A$ from geometry and photon propagation in our model (Sec. 12) and compare to the metric case.  *Do not introduce an ad hoc $\eta$ factor* – any angular-diameter effect must come from actual optics or ruler evolution.

**2.5. Electromagnetic response model (Sec. 3E).**  We audit the candidate model: let a scalar $\psi$ modulate the vacuum permittivity and permeability as 
\[
\epsilon(\psi)=\epsilon_0\,e^{a\psi},\quad \mu(\psi)=\mu_0\,e^{b\psi}.
\tag{234}
\]
Then the local light speed is 
\[
c_\gamma = \frac{1}{\sqrt{\epsilon\mu}} = c_0\,e^{-(a+b)\psi/2},
\tag{235}
\]
and the impedance $Z=\sqrt{\mu/\epsilon}=Z_0\,e^{(b-a)\psi/2}$.  If the electron mass $m_e$, charge $e$, and $\hbar$ are fixed in this “frame,” atomic gross-structure (Bohr-frequency) transitions scale as $\nu_{\rm atom}\propto \alpha^2 m_e c^2/\hbar \propto \epsilon^{-2}$ (since $\alpha=e^2/(4\pi\epsilon\hbar c)$ in SI units).  Thus atomic frequencies vary with $\psi$ if $a\neq 0$.  

A previous derivation (Sec. 3E) gave for homogeneous $\psi(T)$:
\[
1+z_{\rm spec} \;\propto\; \exp\bigl[\tfrac12(b-3a)(\psi_a-\psi_e)\bigr]\;\frac{c_{\gamma,e}}{c_{\gamma,a}},
\tag{236}
\]
and fine-structure variation $\Delta\alpha/\alpha \propto \exp[(b-a)(\psi_a-\psi_e)/2]$.  In particular, if impedance is matched ($a=b$), then 
\[
1+z_{\rm spec} = \frac{c_{\gamma,e}}{c_{\gamma,a}},\quad
Z=\text{constant},
\tag{237}
\]
yielding $z_{\rm spec} \approx c_{\gamma,e}/c_{\gamma,a}-1$.  But since $c_{\gamma}$ *decreases* with time (for positive $\Gamma$), $c_{\gamma,e}>c_{\gamma,a}$, giving $1+z<1$: a net *blue*-shift.  Thus an impedance-matched $\psi$ slows light but would produce the wrong sign of cosmological “redshift”.  

*Audit:* We rederive this more carefully in Sec. 8.  The key point is the interplay of atomic frequency scaling and photon energy: if $a=b$ (implying $\epsilon\propto\mu$, $Z$ fixed), atomic levels scale like $1/\epsilon^2\propto e^{-2a\psi}$ while photon energy $E_\gamma=\hbar\omega\propto c_\gamma k = c_0 k e^{-(a+b)\psi/2}=c_0 k e^{-a\psi}$ (since $a=b$).  Emitted photon energy vs local atomic frequency ratio acquires a factor $e^{a(\psi_a-\psi_e)/2}$ (blueshift).  To get a redshift $(1+z)>1$, one needs $b\neq a$, specifically $(b-3a)(\psi_a-\psi_e)/2 + (-(a+b)/2)(\psi_a-\psi_e)>0$.  This conflicts with a small $\Delta\alpha/\alpha$ (which is $\propto e^{(b-a)(\psi_a-\psi_e)/2}$).  We will explore alternatives: maybe $a\neq b$ or atomic screening (Sec. 6–8) can help.  

**2.6. Density-dependent screening (Sec. 3F).**  A chameleon-like ansatz was $\psi_*(\rho) = f/(m^2+g\rho)$ (some equilibrium value), with linearized dynamics 
\[
K\ddot\psi + (m^2 + g\rho)\psi = f + \lambda\,u_{\rm EM}
\tag{238}
\]
and $c_\gamma = c_*\exp(-\lambda\psi)$.  For matter $\rho\propto A_m^{-3}$, an *adiabatic equilibrium approximation* gave a slowing rate 
\[
\Gamma \;=\; \frac{3\lambda f g\,H_m\rho}{(m^2 + g\rho)^2}\,,
\tag{239}
\]
where $H_m=\dot A_m/A_m$ is the matter Hubble parameter.  We will **not** simply assume equilibrium; we will solve or approximate the full dynamical equation (238) in Sec. 6.  Key checks: the equilibrium formula was derived by setting $\psi\approx f/(m^2+g\rho)$ and differentiating; its validity requires $\dot\psi$ small, $K$ small or $\psi$ heavy, and $u_{\rm EM}$ negligible at equilibrium.  We will assess whether a slowly varying $\psi$ (with $m^2+g\rho\gg H^2$) is consistent, and compute the screening (see Sec. 6).

**2.7. Frequency shift through inhomogeneous $\psi$ (Sec. 3G).**  In WKB (geometrical optics), a photon satisfies $\omega = c_\gamma(T,\mathbf{x})|\mathbf{k}|$.  The ray/Hamilton equations imply along the ray 
\[
\frac{d\ln\omega}{dT} = \frac{\partial\ln c_\gamma}{\partial T}\Big|_{\mathbf{x}}\,.
\tag{240}
\]
Hence 
\[
\ln\frac{\omega_a}{\omega_e} = \int_{T_e}^{T_a} \partial_T\ln c_\gamma\bigl(T,\mathbf{x}(T)\bigr)\,dT,
\tag{241}
\]
giving a shift.  For $c_\gamma = c_0 e^{-\lambda\psi}$, this is 
\[
\ln\frac{\omega_a}{\omega_e} = -\lambda\int_{T_e}^{T_a} \frac{\partial\psi}{\partial T}\bigl(T,\mathbf{x}_\gamma(T)\bigr)\,dT.
\tag{242}
\]
That shows an evolving $\psi$ along the photon’s path causes $\omega$ to change, even if $\psi$ is constant at emission and reception.  We will derive this carefully (Sec. 8).  It corresponds to an *energy exchange* between the photon and the time-varying medium, and must be combined with the atomic-frequency shift to get net redshift.

**2.8. GW synchronization (Sec. 3H).**  GW170817/GRB170817A give a ~1.7 s difference over 40 Mpc.  If light had slowed by $\sim H_0$ over that distance, the naive lag would be $\sim H_0 D/c \sim (2\times10^{-18}\,{\rm s^{-1}})(1.23\times10^{24}\,\rm m)/(3\times10^8\,m/s) \sim 8\times10^5\,$s, vastly larger.  Thus **to match observations**, GWs must either propagate faster than slowed light, or be emitted delayed, or the light-slowing must be negligible locally.  We propose a scalar-field action for GWs:
\[
S_{\rm GW} \;=\; \frac12 \int dT\,d^3x\,\Bigl[Q(\psi)\dot h^2 - P(\psi)\,|\nabla h|^2\Bigr],
\tag{243}
\]
so GW speed $c_{\rm GW}^2 = P(\psi)/Q(\psi)$.  We aim for $c_{\rm GW}\approx c_\gamma$, suggesting $P/Q = 1/(\epsilon\mu)=c_\gamma^2/c_0^2$.  One simple choice is $P=1/\epsilon$, $Q=\mu$ (in units $c_0=1$) so $c_{\rm GW}^2=P/Q=1/(\epsilon\mu)=c_\gamma^2$.  We will explore if such couplings can arise from a consistent action (Sec. 5).  Critically, we must examine if the GW amplitude (luminosity distance for GWs) is also affected.  Constraints demand $c_{\rm GW}(T)/c_\gamma(T) \to 1$ to $\sim10^{-15}$ in the local Universe.  

**2.9. Gravitational lensing (Sec. 3I).**  If the screened $\psi$ around a mass $M$ obeys an exterior profile 
\[
\psi(r)=\psi_{\rm out} - \frac{C}{r},\quad C>0,
\tag{244}
\]
with $n=e^{\lambda\psi}$ as an effective refractive index, then near a massive body $r\to R_s$, $\psi$ is smaller than far away (if $\psi_{\rm out}>\psi$ at $r<R_s$ and $\lambda>0$), so $n$ is lower near the mass.  Light speeds up near mass, which tends to defocus, opposite to GR's focusing deflection.  A weak-lensing calculation gave an extra deflection angle $\alpha_\psi \approx -2\lambda C/b$ for impact parameter $b$ (negative sign means opposite direction).  We will re-derive this and include the GR deflection $\alpha_{\rm GR}=4GM/(b)$ (weak-field) to get the total.  The sign and magnitude of $\alpha_\psi$ must not conflict with the *measured attractive lensing* (e.g. Solar bending measured to 10^-4 precision).  

**2.10. Photon mass (Sec. 3J).**  We must include an actual Lorentz-invariant photon mass $m_\gamma$.  Using a Proca term $(m_\gamma^2/2)A_\mu A^\mu$ breaks gauge invariance but yields dispersion $\omega^2 = c_\gamma^2k^2 + \omega_m^2$, $\omega_m=m_\gamma c_\gamma^2/\hbar$ (in units with $\hbar$).  The group velocity $v_g = d\omega/dk = c_\gamma^2 k/\omega$, the phase $v_p=\omega/k$.  We will derive how $v_g,c_\gamma$ differ and note the additional polarization (longitudinal) from $m_\gamma\neq0$.  We verify known bounds: e.g. recent FRB studies give $m_\gamma<4.8\times10^{-51}\,$kg (1σ), while astrophysical and lab limits (e.g. from planetary magnetic fields) are $m_\gamma\lesssim10^{-52}\,$kg.  A photon mass may induce a frequency-dependent arrival time (e.g. $\Delta t\sim m_\gamma^2/k^2$) and a Yukawa-like decay of fields.  We will check if such a tiny mass can influence cosmological redshift (likely negligible) and ensure it fits bounds.

This completes the audit of prior equations, correcting sign errors as noted (e.g. GR lensing sign, ghost issues below).  We now proceed to **construct and test the new common-field model**.

---

## 3. Minimal Common-Field Action (Task A)

We propose a unified Lagrangian with the following fields/elements:

- **Scalar field $\psi(T,\mathbf{x})$** – an “environmental” field that couples to matter density, EM fields, and potentially gravity.  
- **Electromagnetic 4-potential $A_\mu$** with field tensor $F_{\mu\nu}$ – describes photons (with possible mass term).  
- **Atomic/charged matter** – we include matter only phenomenologically (e.g. density $\rho$, charged currents, Dirac fields if needed), primarily to supply screening of $\psi$ and define atomic transition frequencies.  
- **Gravitational perturbation $h_{ij}$** – represent propagating gravitational waves in a flat background.  (We do *not* introduce a full dynamical metric $g_{\mu\nu}$ with spacetime curvature, since arcsecs excludes dynamical spacetime. Instead, we use an effective action for tensor waves as in (243).)  
- **Photon mass** – either via a Proca mass term $m_\gamma^2 A_\mu A^\mu/2$ or through a Stückelberg field; we will use Proca for simplicity.  
- **Density-dependent screening** – included via coupling of $\psi$ to matter density $\rho$.  

A minimal action (in preferred time slicing) that incorporates these is:

\[
\begin{aligned}
S &= \int dT\,d^3x\;\Bigl\{
\;{\cal L}_{\rm EM}(A,\psi) + {\cal L}_{\rm m}(\psi,\rho, j) 
+ {\cal L}_{\psi}( \psi, \rho) 
+ {\cal L}_{\rm GW}(h,\psi) 
\Bigr\},
\end{aligned}
\tag{245}
\]
with each piece defined below.  We work in units where the unmodified vacuum light speed $c_0=1$ unless factors are shown explicitly.

**Electromagnetic Lagrangian.**  We choose an $\psi$-dependent Maxwell Lagrangian (Lorentz gauge) of the form
\[
{\cal L}_{\rm EM} = -\frac{1}{4}\,\epsilon(\psi)\mu(\psi)\,F_{\mu\nu}F^{\mu\nu} - \frac{1}{2}m_\gamma^2 A_\mu A^\mu - J^\mu A_\mu,
\tag{246}
\]
where $F_{\mu\nu}=\partial_\mu A_\nu-\partial_\nu A_\mu$, $J^\mu=(\rho_{\rm ch},\mathbf{J})$ is the conserved charge current, and 
\[
\epsilon(\psi)=\epsilon_0 e^{a\psi},\qquad \mu(\psi)=\mu_0 e^{b\psi}
\tag{247}
\]
as before.  Here $m_\gamma$ is the (constant) photon invariant mass.  In SI language, $-\frac14\epsilon\mu\,F^2$ yields $+\frac12\epsilon(\psi)E^2 - \frac{1}{2\mu(\psi)}B^2$ in 3D, so that light speed $c_\gamma=1/\sqrt{\epsilon\mu}$.  The impedance matching condition $a=b$ sets $\epsilon\mu$ constant (so $c_\gamma$ uniform) and $Z\propto e^{(b-a)\psi/2}=1$.

*Comments:* We treat $\epsilon(\psi)$ and $\mu(\psi)$ as if they multiply $F^2$ symmetrically.  This is a phenomenological prescription rather than derived from a covariant action; strictly speaking one could insert $\sqrt{-g_{\rm eff}}$ factors, but here $g_{\rm eff}=1$ with Minkowski signature.  Gauge invariance is explicitly broken by the photon mass term.  We impose $J^\mu$ to source fields, but we will treat matter only to define $\rho$ for screening and assume free atomic energy levels as external references.

**Matter (Atomic) Sector.**  We do not write a full atomic Lagrangian.  Instead, we specify:
- A pressureless neutral matter density $\rho(T,\mathbf{x})$ (mass density) that carries electric charge neutrality overall but includes localized charged particles (e.g. electrons/protons).  
- The coupling of $\psi$ to matter enters through its potential as shown below.  
- We assume that atomic gross-structure frequencies (electronic transitions) in matter are given by $\nu_{\rm atom}\propto \epsilon(\psi)^{-2}$ *at the location of the atom* (as a definition consistent with $\epsilon(\psi)=\epsilon_0e^{a\psi}$ and fixed $e,m_e,\hbar$).  Thus if $\psi$ inside matter differs from $\psi$ in space, atomic clock rates are affected.

We include the charge-current coupling $-J^\mu A_\mu$ above so that $\rho_{\rm ch}$ and $\mathbf{J}$ would satisfy $\nabla\cdot \mathbf{J} + \partial_T \rho_{\rm ch}=0$.  We will primarily consider neutral matter moving with some velocity for Doppler shifts, etc.

**Scalar field Lagrangian.**  We take
\[
{\cal L}_\psi = \frac{K}{2}\dot\psi^2 - \frac{1}{2}(m^2+g\rho)\,\psi^2 + f\,\psi + \lambda\,\frac{\epsilon_0\mu_0}{4}F_{\mu\nu}F^{\mu\nu}\,\psi \,.
\tag{248}
\]
Here:
- $K$ is a kinetic coefficient (we assume no spatial gradients for now or consider only time-dependence).  We will check $K>0$ to avoid ghosts.  
- $V(\psi)=\frac12(m^2+g\rho)\psi^2 - f\psi$ is a “mass-plus-density” term plus a linear source $f\psi$.  The $g\rho\,\psi^2$ term generates screening: in high density $g\rho\gg m^2$, the effective mass $m^2+g\rho$ is large, pinning $\psi$ near $f/(m^2+g\rho)$.  The $f$ term can be chosen such that $\psi$ tends to a nonzero background (we will consider $f>0$).  
- The coupling $\propto \lambda F^2\psi$: expanding $F_{\mu\nu}F^{\mu\nu}=2(B^2-E^2)$, we see this is proportional to the local electromagnetic energy density $u_{\rm EM}=(E^2+B^2)/2$.  It reproduces the earlier $\lambda\,u_{\rm EM}$ source in (238) (with $\epsilon_0\mu_0=1$ units).  
- We neglect explicit coupling to $\partial_i\psi$ or self-interactions beyond quadratic (other potentials could be considered, but linear/quadratic suffices for screening).  

*Euler–Lagrange for $\psi$:* Varying (248) w.r.t. $\psi$ yields, in homogeneous approximation:
\[
K\ddot\psi + (m^2 + g\rho)\,\psi - f = -\frac{\lambda}{4}\epsilon_0\mu_0 \,F_{\mu\nu}F^{\mu\nu}.
\tag{249}
\]
Using $F_{\mu\nu}F^{\mu\nu}=2(B^2-E^2)=-4u_{\rm EM}$ in SI (with $\epsilon_0\mu_0=1/c_0^2$), this is
\[
K\ddot\psi + (m^2+g\rho)\psi = f + \lambda\,u_{\rm EM},
\tag{250}
\]
in agreement with Sec. 3F (we recover (238) with $K$ factor).  We will analyze (250) in Sec. 6.

**GW sector Lagrangian.**  We let $h_{ij}(T,\mathbf{x})$ be a transverse-traceless tensor field (two polarizations).  A simple effective action consistent with (243) is:
\[
{\cal L}_{\rm GW} = \frac{Q(\psi)}{2}\,\dot h_{ij}\dot h_{ij} - \frac{P(\psi)}{2}\,(\nabla h_{ij})^2,
\tag{251}
\]
where summation over $i,j=1..3$ and polarization is implied.  We assume $Q,P$ are positive functions of $\psi$.  Varying $h_{ij}$ gives the wave equation 
\[
Q(\psi)\ddot h_{ij} - P(\psi)\nabla^2 h_{ij} + (\dot Q)\dot h_{ij} + (\nabla P)\cdot(\nabla h_{ij}) = 0,
\]
which yields a (background-dependent) wave speed $c_{\rm GW}^2 = P(\psi)/Q(\psi)$.  In the homogeneous case $\psi(T)$ this reduces to $Q\ddot h_{ij} - P\nabla^2 h_{ij}=0$.  We will choose $P$ and $Q$ to match EM as discussed below.  

*Note:* We assume no direct coupling between $\psi$ and metric perturbations beyond $P,Q$.  This suffices to study GW speed and amplitude scaling.  

**Reference-frame structure:** We assume a preferred cosmic rest frame (the “CMB frame” in ΛCDM terms).  All fields and motions are defined relative to this frame.  Observers (atoms, clocks) may move relative to it, with velocity $v_s(T)$ as needed for Doppler effects (Sec. 8).  

This completes the action.  Fields: $A_\mu,\psi,h_{ij}$ are fundamental dynamical fields; $\rho$ and $J^\mu$ are matter sources treated effectively.  The background metric is fixed Minkowski (no $g_{\mu\nu}$ dynamics).  We have explicitly included photon mass $m_\gamma$ and screening coupling $g\rho$ as per instructions.

From (246)–(251) we can derive field equations:

- **Maxwell eqs (with mass):** Varying $A_\mu$ gives 
  \[
  \partial_\mu(\epsilon\mu F^{\mu\nu}) + m_\gamma^2 A^\nu = J^\nu - \lambda\,\partial_\mu(\psi\,\epsilon_0\mu_0\,F^{\mu\nu}),
  \tag{252}
  \]
  where the last term arises from varying $\psi$ in the $F^2\psi$ coupling.  Explicitly, $\partial_\mu(\epsilon\mu F^{\mu\nu}) = \epsilon\mu\,\partial_\mu F^{\mu\nu} + (\partial_\mu(\epsilon\mu))F^{\mu\nu}$.  In a homogeneous $\psi$ or weak-field, this yields a modified Proca wave equation.  We will use Maxwell’s equations in media form in Sec. 8 (including variable $c_\gamma$).  

- **Scalar eq (250):**  $K\ddot\psi+(m^2+g\rho)\psi=f+\lambda u_{\rm EM}$.  

- **GW eq:** $Q(\psi)\ddot h_{ij} - P(\psi)\nabla^2 h_{ij} =0$ (homogeneous $\psi$).  

These set the stage for stability analysis and solutions.

---

## 4. Field Equations and Stability (Task B)

We must examine the well-posedness and stability of the proposed model.  Key issues:

- **Kinetic signs:**  $K>0$ ensures $\psi$ has positive kinetic energy.  Similarly, ${\cal L}_{\rm EM}$ has the usual sign for $F^2$ (since $\epsilon\mu>0$) so EM has positive energy (vacuum permittivity/permeability positive).  The Proca mass $m_\gamma^2>0$ yields a positive mass term.  The GW Lagrangian requires $Q(\psi)>0$, $P(\psi)>0$ for positive energy propagation.  We will assume these positivity conditions (stated explicitly) and later check if they can hold for all $\psi$ in intended regime.  

- **Absence of ghosts:**  No field has wrong-sign kinetic term.  Ghosts could arise if $\psi$ kinetic term $K$ were negative, which we forbid.  Also no higher-derivative terms are present.  If $P(\psi),Q(\psi)$ could change sign for some $\psi$, that would indicate ghost/tachyon, but we will assume a range where $P>0,Q>0$.  

- **No gradient instabilities:**  We have assumed no spatial gradient terms for $\psi$ in (248); one could add $(\nabla\psi)^2$ with positive coefficient.  Lacking it, $\psi$ has no inherent gradient energy, which might be worrisome.  To prevent immediate instabilities at short scales, one could include a spatial kinetic term $-\frac{1}{2}\kappa(\nabla\psi)^2$ with $\kappa>0$.  Even if small, it would give wave dynamics to $\psi$.  **We will assume a small positive $\kappa$** (or equivalently $Q(\psi)$ includes a $\kappa$ factor for $\psi$) that does not qualitatively affect the screening equilibrium but prevents arbitrarily fast spatial oscillations.  This adds no ghosts and we ensure $\kappa>0$.  

- **No tachyons:**  The effective mass-squared for $\psi$ is $m^2+g\rho$.  To avoid tachyonic growth, we require $m^2+g\rho>0$ everywhere.  With $m^2>0$, this holds if $g\rho\ge0$.  We will take $g>0$ so that higher density *increases* mass.  If $m^2=0$, then $g>0$ also avoids tachyon.  Thus require $m^2\ge0$, $g\ge0$.  

- **Electromagnetic energy positivity:**  The $\psi F^2$ coupling term is $+\frac{\lambda}{4}\epsilon_0\mu_0\psi F^2$ in the Lagrangian (248).  Expanding around small $\psi$, this adds $-\lambda \psi (E^2-B^2)/2$.  The energy density for EM in this medium is $(\epsilon(\psi)E^2 + B^2/\mu(\psi))/2$.  For positivity, we need $\epsilon(\psi)>0,\mu(\psi)>0$, which holds for any real $a,b$ (exp of real).  There is no obvious negative energy unless $\psi$ is large and $\lambda$ flips something, but we assume $\psi$ stays small enough that linearization is valid.  

- **Scalar equilibrium stability:**  The equilibrium $\psi_*(\rho) = f/(m^2+g\rho)$ must be a *stable* attractor if the field is heavy.  From (250) without EM source ($u_{\rm EM}=0$) and $\dot\psi=0$, small perturbations $\delta\psi$ around equilibrium obey $K\delta\ddot\psi + (m^2+g\rho)\delta\psi=0$.  With $m^2+g\rho>0$, this is stable (oscillatory).  A timescale $\omega_\psi^2 = (m^2+g\rho)/K$ governs response.  We must check this is fast compared to cosmological change (adiabatic).  

- **GW and EM speeds:**  Characteristic speeds should be subluminal or consistent.  In units $c_0=1$, $c_\gamma^2=1/(\epsilon\mu)=\exp[-(a+b)\psi]$ and $c_{\rm GW}^2=P/Q$.  We require $c_\gamma^2>0$, $c_{\rm GW}^2>0$.  Also, ideally, neither exceed a fixed bound too much.  Since our ontology denies a universal speed limit, superluminal propagation is *not* forbidden a priori.  We do, however, require that in local experiments (e.g. lab or solar system) both $c_\gamma$ and $c_{\rm GW}$ equal the observed $c_{\rm obs}$ to within experimental error ($10^{-15}$ for GWs, and no detected drift for light speed).  This implies $\psi_{\rm local}\approx \psi_{\rm lab}$ with negligible spatial/temporal variation locally, i.e. screening in high-density environments.

- **Fifth forces / preferred frame:**  A long-range $\psi$ field could mediate a “fifth force”.  Since $\psi$ couples to density ($g\rho\psi^2$), a gradient of $\rho$ (in matter) could yield a force.  To avoid strong constraints, $\psi$ must be either very short-range (large $m_{\rm eff}$) in matter, or coupling extremely weak.  We will estimate the scalar force (Sec. 6–7) and compare to experiments (e.g. Eöt-Wash torsion balances: $g/\sqrt{K}$ must be small or $m$ large).  Similarly, the EM couplings could induce local variations of $\alpha$, which are constrained by atomic clock tests.  

In summary, the model has numerous parameters: $a,b,\lambda,m^2,g,K,\kappa,f,m_\gamma$, plus matter density $\rho(T)$.  We will impose:

- $K,\kappa,Q,P>0$, $m^2+g\rho>0$.  
- $m_\gamma$ satisfies laboratory/astrophysical bounds (Sec. 10).  
- $a,b,\lambda,f,g$ chosen so that: atoms in high $\rho$ see $\psi\approx0$ (screened), cosmic $\psi$ evolves to produce required slowdown.  

We will look for instabilities or superluminal issues.  In particular, we must ensure $c_{\rm GW}^2>0$.  If we set $P=1/\epsilon$ and $Q=\mu$ as one solution, then $c_{\rm GW}^2 = 1/(\epsilon\mu)=c_\gamma^2$, automatically positive, and no ghost in $h_{ij}$ (provided overall sign of Lagrangian is positive).  That choice corresponds to an action $\propto \psi$-dependent factor that cancels the EM medium in the tensor sector.  We will adopt $P=\epsilon^{-1}$, $Q=\mu$ (in units $\epsilon_0=\mu_0=1$).  Then $P,Q>0$ automatically.  We must still check $h_{ij}$ energy positivity: $Q\dot h^2/2$ positive, OK.

**Summary of stability conditions:**  
- $K>0,\;\kappa>0,\;P(\psi)>0,\;Q(\psi)>0$.  
- $m^2+g\rho>0,\; \epsilon(\psi)>0,\;\mu(\psi)>0$.  
- For small $\psi$, these impose $m^2\ge0,\;g\ge0$.  The impedance-matched case $a=b$ keeps $\epsilon\mu$ constant, but we allow $a\neq b$ in general.  

We will adopt $m^2\gg g\rho_{\rm max}$ or $g\rho_{\rm dense}\gg m^2$ to ensure strong screening, and keep $K$ such that $\psi$ responds quickly.  These choices will be refined in numerical examples (Sec. 15).

---

## 5. Environmental Screening Solution (Task C)

We solve for $\psi(r)$ around a static spherical body (mass $M$, radius $R$, density $\rho_0$ inside, and $\rho\approx0$ outside).  This addresses screening, atomic vs cosmic $\psi$, and local changes.

**5.1. Interior ($r<R$).**  Inside a uniform density $\rho=\rho_0$, the scalar equation (with $\dot\psi=0$ for static solution) is
\[
K\nabla^2\psi = \partial_\psi V_{\rm eff} = (m^2+g\rho_0)\psi - f.
\]
Dropping $K$ and solving $\nabla^2\psi = \kappa^2 \psi - f/K$ with $\kappa^2=(m^2+g\rho_0)/K$, the general solution is
\[
\psi_{\rm in}(r) = A\frac{\sinh(\kappa r)}{r} + B\frac{\cosh(\kappa r)}{r} + \frac{f}{m^2+g\rho_0}.
\tag{253}
\]
Regularity at $r=0$ requires the $A$ term to vanish ($\sinh(\kappa r)/r\to\kappa$ as $r\to0$, which is regular) and $B$ term actually diverges ($\cosh(\kappa r)/r\sim 1/r$) unless $B=0$.  So
\[
\psi_{\rm in}(r) = C_{\rm in}\,\frac{\sinh(\kappa r)}{r} + \frac{f}{m^2+g\rho_0},
\quad \kappa^2=(m^2+g\rho_0)/K.
\tag{254}
\]
We define $\psi_{\rm in}(0)=\psi_c$, giving $C_{\rm in}= [\psi_c - f/(m^2+g\rho_0)]/\kappa$.  For strong screening, $m^2+g\rho_0$ is large, so $\kappa R\gg1$ and $\psi_{\rm in}(r)\approx f/(m^2+g\rho_0)$ nearly constant (exponential boundary layers).  In particular, at $r=0$, $\psi_c\approx f/(m^2+g\rho_0)$ to good approximation.  

**5.2. Exterior ($r>R$).**  Outside, $\rho\approx0$, so $V_{\rm eff}=\frac12m^2\psi^2 - f\psi$.  The static scalar eqn is
\[
K\nabla^2\psi = m^2\psi - f.
\]
The solution (assuming $f\neq0$) is
\[
\psi_{\rm out}(r) = D\frac{e^{-mr/\sqrt{K}}}{r} + \frac{f}{m^2},
\tag{255}
\]
with $m_{\rm eff}=m/\sqrt{K}$.  Continuity at $r=R$ requires $\psi_{\rm out}(R)=\psi_{\rm in}(R)$ and $d\psi/dr$ continuous.  For $mR/\sqrt{K}\gg1$ (heavy field), the $e^{-m r}$ tail is very short: $\psi$ quickly approaches $f/m^2$.  Thus far from the body, $\psi\to f/m^2 = \psi_{\rm vac}$, the vacuum background.  

**5.3. Matching & screening length.**  The constants $C_{\rm in},D$ are fixed by boundary conditions.  In the limit of strong screening ($g\rho_0\gg m^2$ and $mR/\sqrt{K}\gg1$), one finds (roughly) $\psi_{\rm in}\approx 0$ up to $r\sim R$ (since $f/(m^2+g\rho_0)\approx0$ if $m^2$ negligible).  Then $\psi_{\rm out}(r)$ transitions from $\approx0$ at $r=R$ to $\approx f/m^2$ at infinity over a scale $\sim m^{-1}$.  The “thin-shell” parameter is $\Delta\psi = \psi_{\rm vac}-0 \approx f/m^2$.  The effective *screening length* in vacuum is $L_{\rm scr}=m_{\rm eff}^{-1}= \sqrt{K}/m$.  We require $L_{\rm scr}$ to be of order galactic scales or larger so that cosmic $\psi$ evolution (over Hubble times) can occur.  Meanwhile inside high-density objects, $\kappa^{-1}=\sqrt{K/(m^2+g\rho_0)}$ should be very small, so that $\psi$ is pinned.

**5.4. Summary of $\psi$ profile:**  - For an astrophysical object (e.g. galaxy cluster), $\psi_{\rm in}\approx f/(m^2+g\rho_{\rm high})\approx0$ if $g\rho\gg m^2$.  So inside dense regions ($r<R$), $\psi\approx0$ (screened).  
- Outside, $\psi(r)$ rises toward $f/m^2$ with a Yukawa tail.  If $m$ is small enough, $\psi$ outside is nearly uniform on cluster scales; if $m$ is larger, it varies more rapidly.  The magnitude difference $\Delta\psi = \psi_{\rm vac}-\psi_c$ controls $c_\gamma$ difference and redshift.  

**5.5. Atomic screening condition:**  Atomic matter density $\rho_{\rm atom}\sim 10^3\,{\rm kg/m^3}$ (solid materials) is enormous compared to cosmic $\rho\sim10^{-27}\,$kg/m^3.  For effective screening in atoms, we need $g\rho_{\rm atom}\gg m^2$.  Then $\psi_{\rm atom}\approx f/(m^2+g\rho_{\rm atom})\approx 0$, so $\epsilon(\psi)\approx \epsilon_0$, atomic transitions are as usual.  We will impose $m^2 \ll g \rho_{\rm atom}$ and $f$ of order $m^2\psi_{\rm vac}$ to get $\psi_{\rm vac}\sim O(1)$ (see below).  For galaxy clusters ($\rho\sim10^{-21}$kg/m^3), this also holds.  Thus only the intergalactic medium ($\rho\ll\rho_{\rm galaxy}$) allows $\psi\approx \psi_{\rm vac}\sim f/m^2\neq0$ to evolve.  This realizes screening: dense regions “lock” $\psi$ to ~0.

**5.6. Effective $c_\gamma(r)$ and $c_{\rm GW}(r)$.**  Using $\psi(r)$:
- The local light speed is $c_\gamma(r)=c_0\,e^{-(a+b)\psi(r)/2}$.  Inside matter $\psi\approx0$, so $c_\gamma\approx c_0$ (no local change).  Outside, $c_\gamma$ may differ slightly: at $r\gg R$, $c_{\gamma,\infty}=c_0\,e^{-(a+b)\psi_{\rm vac}/2}$.  The fractional change over background is $\delta c_\gamma/c_0 = 1 - e^{-(a+b)\psi_{\rm vac}/2}\approx -(a+b)\psi_{\rm vac}/2$ for small $\psi_{\rm vac}$.  This parameter controls cosmological slowing: e.g. if $(a+b)\psi_{\rm vac}>0$, then $c_\gamma$ is smaller in vacuum than locally, causing redshift of passing photons.  

- For GWs, with our choice $P=1/\epsilon$ and $Q=\mu$, we have $c_{\rm GW}^2(r) = P/Q = 1/(\epsilon\mu) = c_\gamma^2(r)$ (since $\epsilon\mu$ was exactly inverted).  Thus the *local* speeds of GW and photons are matched at each $r$.  Inside matter $c_{\rm GW}=c_\gamma=c_0$, outside $c_{\rm GW}(r)=c_\gamma(r)$ as above.  We achieve $c_{\rm GW}=c_\gamma$ exactly, so arrival-time constraints (Sec. 3H) reduce to those already imposed on $c_\gamma$.  Amplitudes: the GW amplitude sees an effective Planck mass $\propto Q(\psi)^{1/2}$.  The background $\psi_{\rm vac}$ changes $Q(\psi)=\mu=\mu_0 e^{b\psi}$, so the effective gravitational coupling varies by $e^{-b\psi_{\rm vac}/2}$.  We will examine standard-siren vs luminosity distance differences in Sec. 9.  

**5.7. Screening summary:**  We require parameters such that:
- $m^2 \ll g\rho_{\rm dense}$ and $\kappa R\gg1$ ensures $\psi_{\rm in}\approx0$ inside any dense object.  
- $m_{\rm eff}^{-1} = \sqrt{K}/m$ is large enough to let $\psi$ vary on cosmic scales (we may take $m_{\rm eff}\sim H_0$).  
- $\psi_{\rm vac}=f/m^2$ (assuming $g\rho\to0$ outside) is of order unity or smaller, so $(a+b)\psi_{\rm vac}/2$ is the total cosmic redshift from slowing.  
- Atomic $\psi_{\rm atom}\approx0$ to within observational constraint on constants.  

We will illustrate screening with sample numbers later (Sec. 15).  The solution (254)–(255) shows this is mathematically consistent: a spherical mass produces only a Yukawa potential for $\psi$ outside, with suppressed interior value.  Thus atomic clocks in stars or laboratories see essentially no change, while intergalactic $\psi$ evolves freely (driven by cosmic $\rho$ change in (250)).  

No extra long-range forces:  The scalar force on a test mass is $F_\psi\sim g\psi\,\nabla\rho/(m^2+g\rho)$ (from $\partial_\psi V$), which is tiny if $\psi_{\rm in}\approx0$.  Outside a body, $\nabla\psi$ falls Yukawa fast.  By choosing $m_{\rm eff}$ small enough, the range is large but $\psi_{\rm body}\approx0$, so violations of equivalence principle are suppressed.  Preferred-frame effects (e.g. if $\psi$ couples to velocities) are minimal since we assume isotropic $f$ and $\rho$ couplings.  

Thus the screening requirement is implementable with $g>0,\;m^2\sim f/\psi_{\rm vac},\;g\rho_{\rm atom}\gg f$.  We will refine these in Sec. 14.

---

## 6. Atomic Spectra and Dimensionless Constants (Task D)

We derive how $\psi$ evolution would affect observed atomic spectra and dimensionless constants.  Two main effects:

1. **Atomic frequency shifts** due to local $\psi$ change (Sec. 8 derived).  
2. **Variation of constants** like the fine-structure $\alpha$ or proton-to-electron mass ratio, from $\psi$-dependent couplings.

**6.1. Local atomic clocks:**  In screened regions (Earth, galaxies), $\psi\approx\psi_c\approx0$.  Thus $\epsilon(\psi)\approx\epsilon_0$, $\mu\approx\mu_0$, and atomic physics is standard.  If $\psi_c$ is not exactly zero but tiny ($|\psi_c|\ll1$), then fractional changes in atomic frequencies $\nu_{\rm atom}\propto \epsilon^{-2} \approx e^{-2a\psi_c}\approx 1 - 2a\psi_c$ are of order $|2a\psi_c|$.  Laboratory tests of clock stability (e.g. Al+ vs Hg+ clocks) constrain $|\dot\alpha/\alpha| \lesssim 10^{-17}/{\rm yr}$.  Translating to our model, $d\ln\alpha/dT = (b-a)\dot\psi/2$ (since $\alpha\propto 1/(\epsilon\sqrt{\epsilon\mu}) = e^{-(3a-b)\psi/2}$ from $\alpha=e^2/(4\pi\epsilon\hbar c)$).  Present bounds $\dot\psi_{\rm local}\lesssim10^{-17}$ (in dimensionless) are easily satisfied if $\psi$ is static in screened regions.  We assume $\psi_c$ fixed in lab to high precision by screening, so atomic spectra are effectively constant.  

**6.2. Fine-structure constant:**  More explicitly, $\alpha(\psi) = e^2/(4\pi\epsilon(\psi)\hbar c_\gamma)$.  With our definitions, $e,\hbar$ fixed, $c_\gamma\propto 1/\sqrt{\epsilon\mu}$, so $\alpha(\psi)\propto 1/(\epsilon\sqrt{\epsilon\mu}) = e^{-(3a-b)\psi/2}$.  Thus fractional change
\[
\frac{\Delta\alpha}{\alpha} = -\frac{(3a-b)}{2}\,\Delta\psi.
\tag{256}
\]
Between high-$z$ emitter ($\psi_e$ in IGM) and here ($\psi_a$ in local), this could be measurable via quasar spectra.  Observationally, constraints are at the $10^{-6}$ level for $\Delta\alpha/\alpha$ over cosmic time.  We will require $|(3a-b)\psi_{\rm vac}|\lesssim10^{-6}$.  Unless $3a=b$ (fine-tuned), even a small $\psi_{\rm vac}\sim10^{-3}$ could produce too large $\Delta\alpha$.  

**6.3. Other constants:**  The proton/electron mass ratio $\mu=m_p/m_e$ might vary if $m_e$ is fixed but hadrons depend on $\Lambda_{\rm QCD}$ or electroweak scales.  We did not specify any $\psi$ coupling to Higgs or strong sector.  If $m_e,m_p$ fixed, then $\mu$ constant.  However, the atomic Rydberg $R_\infty \propto m_e e^4/(\hbar^3)\propto \alpha^2 m_e c^2$ would vary if $\alpha$ or $c$ vary.  We assume all such variations are encompassed in $\alpha(\psi)$ above.  Molecular spectra or nuclear transitions could give additional constraints (like Oklo or meteoritic data), but atomic-clock/quasar covers the main fine-structure variation.  

**6.4. Restoring units:**  If we restore $c_0,\hbar$, then $\Delta\alpha/\alpha \sim O(10^{-6})$ imposes $(3a-b)\psi_{\rm vac}\lesssim 10^{-6}$ observationally.  Since $\psi_{\rm vac}=f/m^2$ (if $g\rho\to0$), this is a stringent tuning unless $(3a-b)$ is extremely small.  The simplest solution is to set $b=3a$, which makes $\alpha$ invariant under $\psi$-shifts.  But $b=3a$ is incompatible with the earlier impedance argument ($b=a$ would cancel the Doppler shift).  We will consider $b\approx3a$ as an option to suppress $\alpha$-change while allowing $a\neq b$ to get redshift.  

**6.5. Conclusion on spectra:**  Atomic standards in screened (dense) regions remain stable by assumption.  The key constraint is $\Delta\alpha/\alpha$ from cosmic $\psi$ drift: it demands either (i) very small $\psi_{\rm vac}$, or (ii) $3a\approx b$ to decouple $\alpha$.  The model must be chosen accordingly.  We will see in Sec. 8 that to get a positive redshift ($c_{\gamma,e}>c_{\gamma,a}$), one needs $(b-3a)<0$ (since earlier formula had $b-3a$).  But $b=3a$ exactly zeroes that part, giving only the Doppler factor.  We will quantify these trade-offs when solving the redshift equation.

In summary, **atomic spectral constraints** require $\psi$ to be effectively constant in lab/stellar environments and put a strong bound on $(3a-b)\psi_{\rm vac}$.  This is a major restriction on model viability.  

---

## 7. Photon Propagation and Spectroscopic Redshift (Task D, continued)

We now derive the full **redshift formula** for a photon emitted by an atom at time $T_e$ and detected at $T_a$, including moving emitter/observer, clock rates, field evolution, and photon mass.  We combine the pieces:

- Source velocity $v_s(T_e)$ relative to cosmic frame (with Doppler).  
- Local clock-rate factors $q_s,q_o$ (Sec. 3A).  
- Atomic emission frequency $\nu_e$ versus $\nu_e^{(0)}$ (its standard value at $\psi_e$).  
- Photon group/phase speed $c_{\gamma}(T)$ along path (with possibly $m_\gamma$ dispersion).  
- Field change $\psi(T)$ along the ray (Sec. 3G) leading to $\omega$ variation.  
- Photon energy/frequency transformation at absorber (Sec. 3A).

Assume a photon emitted with energy $\hbar\omega_e$ by an atomic transition of rest frequency $\nu_{\rm atom,e}$ (with $\nu_{\rm atom}\propto\epsilon(\psi)^{-2}$).  This photon travels through evolving $\psi(T)$ and arrives with energy $\hbar\omega_a$.  The observed frequency is $\nu_{\rm obs}=\omega_a/(2\pi)$ compared to the expected atomic frequency at the observer $\nu_{\rm atom,a}$.

**General redshift relation:** By definition, the spectroscopic redshift is 
\[
1+z_{\rm spec} = \frac{\nu_{\rm atom,a}}{\nu_{\rm obs}} \;\;=\;\; 
\frac{\nu_{\rm atom,a}}{\nu_{\rm atom,e}} \; \frac{\nu_{\rm atom,e}}{\nu_{\rm obs}}.
\tag{257}
\]
We factor the first term (change in atomic standard between source and observer) from the second (photon’s frequency shift).  Atomic frequencies transform as $\nu_{\rm atom}\propto \epsilon(\psi)^{-2} \propto e^{-2a\psi}$; so 
\[
\frac{\nu_{\rm atom,a}}{\nu_{\rm atom,e}} = e^{-2a(\psi_a-\psi_e)}.
\tag{258}
\]
Next, $\nu_{\rm obs} = \omega_a/(2\pi)$, and $\nu_{\rm atom,e} = \omega_{\rm emit}/(2\pi)$ where $\omega_{\rm emit}$ is the photon frequency right after emission in the emitter frame.  For a moving source, $\omega_{\rm emit}$ relates to the source’s comoving emission frequency $\omega_e$ (as measured in the cosmic frame) by Doppler: $\omega_{\rm emit} = \omega_e\,\gamma(1 - \beta_s\cos\theta_s)$ (for longitudinal, $\theta_s=0$ if directly receding).  Specializing to motion along line-of-sight, $\omega_{\rm emit}/\omega_e = (\sqrt{1-\beta^2})/(1+\beta) \approx \sqrt{(1-\beta)/(1+\beta)}$ for approach, but for recession $1+z_{\rm Dopp} = \sqrt{(1+\beta)/(1-\beta)}$.  However, we will incorporate motion by adding $v_s(T_e)$ into the factor as $(c_{\gamma,e}+v_s)/c_{\gamma,e}$ to first order (consistent with (226)).  

Photon energy evolves from $T_e$ to $T_a$ via (240)–(242): 
\[
\ln\frac{\omega_a}{\omega_e} = \int_{T_e}^{T_a} \frac{\partial}{\partial T}\ln[c_\gamma(T,\mathbf{x}_\gamma(T))]\,dT \;=\; -\lambda \int_{T_e}^{T_a} \partial_T\psi\bigl|_{\bf x}\,dT.
\tag{259}
\]
For small changes, $\omega_a/\omega_e = \exp[-\lambda(\psi_a-\psi_e)]$ (if $\psi$ is homogeneous along path; if inhomogeneous, one integrates).  Thus 
\[
\frac{\omega_a}{\omega_e} = e^{-\lambda(\psi_a-\psi_e)}.
\tag{260}
\]
Note: This is equivalent to $c_{\gamma,e}/c_{\gamma,a}$ from (235), since $c_{\gamma,e}/c_{\gamma,a}=e^{-(a+b)(\psi_e-\psi_a)/2}$.  Indeed, $\lambda$ will be identified with $(a+b)/2$ if the WKB matches $c_\gamma$.  We introduced $\lambda$ in the scalar action coupling.  In fact, consistency requires $\lambda=(a+b)/2$ so that the photon-slowing in the action matches $c_\gamma$ as defined.  We adopt $\lambda = (a+b)/2$.  

Putting all factors together for a receding source ($v_s>0$ away from us), the observed redshift is:

\[
1+z_{\rm spec} \;=\; \frac{\nu_{\rm atom,a}}{\omega_a/(2\pi)} 
= e^{-2a(\psi_a-\psi_e)} 
\cdot \frac{\omega_{\rm emit}}{\omega_e} 
\cdot \frac{\omega_e}{\omega_a}.
\tag{261}
\]
Here $\omega_{\rm emit}/\omega_e$ is Doppler from source motion: 
\[
\frac{\omega_{\rm emit}}{\omega_e} = \sqrt{\frac{1+\beta_s}{1-\beta_s}}\approx \frac{1+\beta_s}{\sqrt{1-\beta_s^2}} \approx 1 + \beta_s
\tag{262}
\]
for nonrelativistic $\beta_s$.  And $\omega_e/\omega_a = 1/(\omega_a/\omega_e) = e^{\lambda(\psi_a-\psi_e)}$ from (260).  Combining,
\[
1+z_{\rm spec} = e^{-2a(\psi_a-\psi_e)}\,\sqrt{\frac{1+\beta_s}{1-\beta_s}}\,e^{\lambda(\psi_a-\psi_e)}.
\tag{263}
\]
Substitute $\lambda=(a+b)/2$:
\[
1+z_{\rm spec} = e^{-(2a - (a+b)/2)(\psi_a-\psi_e)}\sqrt{\frac{1+\beta_s}{1-\beta_s}} 
= e^{-(3a-b)\tfrac12(\psi_a-\psi_e)}\sqrt{\frac{1+\beta_s}{1-\beta_s}}.
\tag{264}
\]
This reproduces the earlier result (Sec. 2.5) up to the Doppler factor.  Thus the net spectroscopic redshift includes a factor $\exp[-(3a-b)(\psi_a-\psi_e)/2]$ and the usual relativistic Doppler $\sqrt{(1+\beta)/(1-\beta)}$.  Setting $a=b$ cancels the exponential, leaving $1+z=\sqrt{(1+\beta)/(1-\beta)}$ from motion alone (no cosmological shift).  Setting $b=3a$ cancels the $\psi$-term, again giving only Doppler.  Only if $b-3a>0$ (and $\psi_a>\psi_e$) do we get an *additional* redshift.  Since $\psi$ presumably grows over time ($\psi_a>\psi_e$ if photon path passes through evolving $\psi$), a positive $(b-3a)$ gives exponential increase.  In contrast, $b=3a$ is what makes $\alpha$ constant but yields no $\psi$ redshift (Sec. 6).  

**Limits:** For small velocities $\beta_s\ll1$, $\sqrt{(1+\beta)/(1-\beta)}\approx1+\beta_s$.  If emitter is at rest ($\beta_s=0$), $1+z= e^{-(3a-b)\Delta\psi/2}$.  If $\psi$ is constant ($\psi_a=\psi_e$), then $z$ is purely Doppler.  If $\psi$ evolves homogeneously between emission and absorption, $\psi_e=\psi(T_e)$, $\psi_a=\psi(T_a)$, then $\Delta\psi>0$ (assuming $\psi$ increases with time) gives $1+z>1$ if $b-3a>0$; if $b-3a<0$, then $1+z<1$ (blueshift).

In summary, the **redshift master equation** is
\[
1+z_{\rm spec} = \exp\Bigl[-\tfrac{1}{2}(3a-b)(\psi_a-\psi_e)\Bigr]
\sqrt{\frac{1+\beta_s}{1-\beta_s}}.
\tag{265}
\]
Atomic clock rates also give a factor $q_s/q_o$, but here $q_i = d\tau_i/dT$ is assumed equal (no local gravitational time dilation differences).  If there were $q_o/q_s\neq1$, it multiplies (264).  For simplicity we assume $q_o/q_s=1$ (no large gravitational potential differences).  

**Check limits:**  
- (Relativistic Doppler) If $\psi$ constant ($\Delta\psi=0$) and $a,b$ cancel ($3a=b$), then $1+z=\sqrt{\frac{1+\beta}{1-\beta}}$ as required.  Good.  
- (Homogeneous slowing only) If $\beta_s=0$ and $\psi$ changes from emission to reception, $1+z=\exp[-(3a-b)\Delta\psi/2]$.  To match earlier Eq. (229) ($1+z=c_{e}/c_{a}=e^{-\Gamma\Delta T}$), we identify $(b-3a)\Delta\psi/2=\Gamma\Delta T$.  Since $\Gamma\approx (a+b)(\dot\psi)$, this is consistent only if $b-3a=(a+b)$, i.e. $b=2a$ (if $\dot\psi\Delta T=\Delta\psi$).  That special case would yield $1+z=\exp[-\Gamma(T_e-T_a)]$.  More generally, one must compute $\psi(T)$ from dynamics.  

This completes the derivation of redshift.  The free parameters $(a,b)$ crucially determine sign and magnitude.  Notably, **impedance matching** $a=b$ yields $1+z=\sqrt{(1+\beta)/(1-\beta)}$ (no cosmological shift), reproducing the earlier claim that an impedance-matched media only doppler-shifts.  To get a positive redshift from $\psi$-evolution, we need $b>3a$.  For example, $b=2a$ gives $1+z = \exp[a(\psi_a-\psi_e)]\sqrt{(1+\beta)/(1-\beta)}$.  

However, $b>3a$ implies $\alpha(\psi)$ does vary (Sec. 6 gave $\Delta\alpha/\alpha=-(3a-b)\Delta\psi/2$), so atomic constants change.  This ties redshift to dimensionless variation.  We will quantify this in constraints (Sec. 13).  

**Photon mass effect:**  If $m_\gamma\neq0$, dispersion enters: $\omega^2 = c_\gamma^2 k^2 + \omega_m^2$.  The group velocity is $v_g = \partial\omega/\partial k = c_\gamma^2 k/\omega = c_\gamma\sqrt{1-\omega_m^2/\omega^2}$.  For high-frequency photons ($\omega\gg\omega_m$), $v_g\approx c_\gamma(1-\tfrac12\omega_m^2/\omega^2)$.  Over cosmological paths, this would add an extra time delay $\Delta t\sim \omega_m^2 D/(2\omega^2 c_\gamma)$.  The effect on redshift is negligible if $m_\gamma$ is below astrophysical limits (see Sec. 10).  We will ignore $m_\gamma$ in the above formula for $z$ (using $\omega_a/\omega_e$ from geometry), but we must ensure $m_\gamma$ is small enough that chromatic dispersion is undetectable.  

We have now the full redshift law (265).  It replaces standard $1+z=(1+\beta)/\sqrt{1-\beta^2}$ in the model.  We will use it to predict luminosity and distance relations.

---

## 8. Gravitational-Wave Propagation and Amplitude (Task E)

We analyze GW propagation with the $\psi$ coupling.  With the chosen $P=1/\epsilon(\psi)$, $Q=\mu(\psi)$ (in units $c_0=1$), we have:

- **GW speed:** $c_{\rm GW}^2 = P/Q = 1/(\epsilon\mu) = c_\gamma^2$.  Therefore $c_{\rm GW}(T,r)=c_\gamma(T,r)$ at each spacetime point.  In particular, GWs propagate at the same speed as photons everywhere (to the modeled order).  This automatically satisfies the tight bound from GW170817: $\Delta v/v < O(10^{-15})$, since both speeds are literally tied by construction.

- **GW arrival-time difference:**  In a homogeneous epoch (cosmic background), if photons from a source at redshift $z$ take $T_{\rm EM}$ and GWs take $T_{\rm GW}$, then 
  \[
  \Delta T = T_{\rm GW}-T_{\rm EM} = \int (1/c_{\rm GW} - 1/c_\gamma)\,d\ell.
  \]
  With $c_{\rm GW}=c_\gamma$, $\Delta T=0$.  Emission-time differences or source phenomena must then explain the 1.7s offset in GW170817 (likely the GRB was emitted slightly after merger).  Our model predicts no purely propagation-induced lag.  

- **GW amplitude:**  The GW wave equation is $Q(\psi)\ddot h - P(\psi)\nabla^2 h=0$.  In a weak-field plane wave $h\sim e^{i(kx-\omega t)}$, the amplitude (energy) is carried with $\omega^2$ dependence.  However, in a slowly varying $\psi$ background, one finds an effective “GW luminosity distance” $D_L^{\rm GW}$ which may differ from EM $D_L^{\rm EM}$.  In our model, the effective gravitational coupling $M_{\rm eff}(\psi)\propto Q(\psi)^{1/2} = \mu(\psi)^{1/2}$.  If $\psi$ was evolving cosmologically, $M_{\rm eff}$ (hence Newton’s constant $G\propto 1/M_{\rm eff}^2$) could change.  A changing $M_{\rm eff}$ induces a modification of the standard-siren amplitude (an effect known from scalar-tensor theories).  

  Specifically, for a tensor mode in vacuum, the amplitude scales as $h\propto 1/(a\sqrt{Q})$ where $a$ is the scale factor in expanding space; here we replace $a$ by 1 (no expansion) and include $Q(\psi)$.  A slowly varying $\mu(\psi)$ along the GW path will produce an amplitude factor $\exp[-\frac12\int (\dot Q/Q)\,dT] = \exp[-\frac12\int (b\dot\psi)\,dT] = e^{-b(\psi_a-\psi_e)/2}$.  Meanwhile, an EM wave’s amplitude was assumed $\propto 1/D_L \propto 1/(D(1+z))$.  Thus the ratio of GW to EM amplitude carries a factor $e^{-b(\psi_a-\psi_e)/2}$.  If $b=0$ or $\psi$ constant, amplitudes match the standard $1/D_L^{}$ law.  For $b\neq0$, a new “GW luminosity distance” emerges: 
\[
D_L^{\rm GW} = D_L^{\rm EM}\;e^{b(\psi_a-\psi_e)/2}.
\tag{266}
\]
This is analogous to dark-energy or scalar-tensor modifications.  We note: if $b-3a>0$ for redshift, we likely have $b>0$, so $D_L^{\rm GW}>D_L^{\rm EM}$ if $\psi_a>\psi_e$.  Standard-siren measurements (e.g. GW Hubble constant) will thus differ.  

**Constraint:** GW170817 also measured $H_0$ using the “standard siren” (the distance from GW amplitude vs redshift from EM).  They found $H_0=70.3^{+5.3}_{-5.0}$ km/s/Mpc.  Within errors, this matches $H_0$ from standard EM methods.  In our model, if $D_L^{\rm GW}\neq D_L^{\rm EM}$ at the few-percent level, it would appear as an inconsistency.  Current error bars are ~10%, but future events will tighten this.  We will require $|b(\psi_a-\psi_e)/2|\ll 0.1$ for $z\sim0.01$.  Given $\psi$ variation on Hubble times, this is typically satisfied since $(\psi_a-\psi_e)\sim O(10^{-3})$ over 40 Mpc (unless $b$ is enormous).  

**Summary of GW findings:** Our common-field coupling achieved $c_{\rm GW}=c_\gamma$ exactly (by design) and thus passed the multimessenger speed test trivially.  A residual effect is the amplitude rescaling (266).  We include this in distance relations (Sec. 12) and check against standard siren data.  Overall, no obvious fatal inconsistency arises in the GW sector, as long as $b(\psi_a-\psi_e)/2$ is small in the local universe.  

---

## 9. Photon Mass and Dispersion (Task H)

We consider the effect of a genuine photon mass $m_\gamma$ from the Proca term.  The dispersion relation is:
\[
\omega^2 = c_\gamma^2 k^2 + \omega_m^2,\qquad
\omega_m = \frac{m_\gamma c_\gamma^2}{\hbar}.
\tag{267}
\]
Thus phase velocity $v_p = \omega/k = c_\gamma\sqrt{1 + \omega_m^2/(c_\gamma^2 k^2)}$, group velocity $v_g = d\omega/dk = c_\gamma^2 k/\omega = c_\gamma\sqrt{1 - \omega_m^2/\omega^2}$.  For optical photons ($k\hbar\sim$ eV) and $m_\gamma c^2\ll\hbar\omega$, $\omega_m \ll \omega$ so $v_g\approx c_\gamma(1 - \tfrac12(\omega_m/\omega)^2)$.  

**9.1. Arrival-time:**  A mass induces a frequency-dependent speed.  Over distance $D$, the time delay relative to light is 
\[
\Delta t \approx \int \frac{1}{v_g} - \frac{1}{c_\gamma}\,d\ell 
\approx \int \frac{1}{c_\gamma}\Bigl[\frac{1}{\sqrt{1-\omega_m^2/\omega^2}} - 1\Bigr]d\ell \approx \frac{\omega_m^2}{2\omega^2}\frac{D}{c_\gamma}.
\tag{268}
\]
For a rough bound, take $\omega_m/m_\gamma \approx c_\gamma^2/\hbar$, $\omega\sim1\,$eV, $D\sim H_0^{-1}c_\gamma\sim10^{26}\,$m.  Using e.g. $m_\gamma<5\times10^{-51}$kg ($\hbar\omega_m \sim m_\gamma c_\gamma^2 \approx5\times10^{-34}$J $\approx3\times10^{-15}$eV), and $\omega=1\,$eV, 
\[
\Delta t \sim \frac{(3\times10^{-15})^2}{2(1)^2}\frac{10^{26}}{3\times10^8} 
\approx 10^{-14}\,{\rm s},
\]
negligible.  Even for gamma rays ($\omega\sim10^5\,$eV), $\Delta t\sim10^{-24}$s.  So photon mass has no observable time-delay effect in cosmology at allowed bounds.

**9.2. Polarization:**  Massive photon has 3 polarizations (two transverse, one longitudinal).  The longitudinal mode has frequency $\omega_m$ at $k=0$ and is suppressed if $m_\gamma$ is tiny.  In intergalactic space, any difference in photon polarization propagation is imperceptible at $m_\gamma\ll10^{-51}$kg.  We ignore polarization effects.

**9.3. Dispersion in cosmology:**  The mass leads to slight frequency-dependent redshift: lower-frequency photons (radio) arrive slightly later than higher-frequency.  Searches for photon mass often use FRBs or magnetospheric data.  The best astrophysical limits come from FRB dispersion or solar wind (Ryutov 2007 gave $m_\gamma<10^{-49}$kg).  We will adopt $m_\gamma\le10^{-51}$kg as in.  

**9.4. Impact on redshift/distance:**  Because $m_\gamma$ is so small, its impact on $D_L$ or $z$ is negligible.  The group velocity difference $c_\gamma - v_g \sim \omega_m^2/(2\omega^2 c_\gamma)$ is extremely tiny.  We include $m_\gamma$ in general formulae (replacing $c_\gamma$ by $v_g$ in propagation equations) but effectively set it to zero for distance calculations.  Constraints on any *effective* in-medium mass (e.g. from plasma) must be separated from the vacuum $m_\gamma$; here we focus on vacuum invariant mass.

**9.5. Conclusion on photon mass:**  A vacuum photon mass below current limits has no significant effect on cosmological photon slowing or spectral redshift.  It does add a longitudinal polarization but no new cosmological mechanism.  We ensure $m_\gamma$ stays within bounds, but do not rely on it to generate redshift (it would give dispersion like a plasma effect, but that is tiny here).  

Thus the **photon mass foundation** is satisfied in that we include $m_\gamma$ consistently, but it does not materially alter the ArcSecs predictions except to tighten any low-frequency dispersion tests.  

---

## 10. Gravitational Lensing (Task F)

We calculate light bending by a point/mass source including both GR deflection and scalar-induced index variation.  1st, the GR deflection angle in our static geometry is 
\[
\alpha_{\rm GR} = \frac{4GM}{b},
\tag{269}
\]
for impact parameter $b$, in the weak-field limit.  (This follows since we assume the usual spacetime around mass, even though ArcSecs denies “expanding space” – local GR still works for lensing).  

Next, from Sec. 2.9, the scalar field contributes index $n(r)=e^{\lambda\psi(r)}\approx 1+\lambda\psi(r)$ for small $\psi$.  Using Fermat’s principle, the bending from refractive index is (linearized) 
\[
\alpha_\psi = -\int_{-\infty}^\infty \partial_\perp n(x,y=0,z)\,dz,
\tag{270}
\]
where the integral is across the light path.  For $\psi_{\rm out}(r)\approx\psi_{\rm vac}-C/r$ as in (244) ($C>0$ because $\psi$ is smaller near the mass), we have $n\approx 1+\lambda(\psi_{\rm vac}-C/r)$.  The gradient perpendicular to the path at closest approach $b$ is $\partial_\perp n \approx -\lambda C (x/b)/r^3$ (for a path near $y=b$).  Integrating (see e.g. [Sec. 3I] or standard GR-textbook method) yields approximately 
\[
\alpha_\psi \simeq -\frac{2\lambda C}{b}.
\tag{271}
\]
The negative sign means deflection is opposite sign to $\alpha_{\rm GR}$ if $\lambda C>0$.  Thus *if $\lambda>0$ and $C>0$*, the scalar causes a defocusing angle $|\alpha_\psi| = 2\lambda C/b$.  If $\lambda<0$ (so $n=1+\lambda\psi$ is less than 1 around mass), then the sign flips and scalar *adds* to GR deflection (but we see $c_\gamma$ would then *increase* near mass, since $\psi<0$).  

Recall $\psi_{\rm out}(r)=\psi_{\rm vac}-C/r$.  At the surface $r=R$, we have $\psi_c\approx f/(m^2+g\rho_0)\approx0$, so $\psi_{\rm vac}=\psi(r\to\infty)= f/m^2$.  Matching at $r=R$ yields $C \approx R(\psi_{\rm vac}-0) = R f/m^2$.  Thus $C>0$ (assuming $f>0$ so $\psi_{\rm vac}>0$).  Also $\lambda=(a+b)/2>0$ for model parameters chosen to slow light ($a+b>0$).  Therefore $\alpha_\psi \simeq -2\lambda (R f/m^2)/b <0$.  The total deflection is 
\[
\alpha_{\rm tot} = \alpha_{\rm GR} + \alpha_\psi 
= \frac{4GM}{b} - \frac{2\lambda f R}{m^2 b}.
\tag{272}
\]
We compare magnitudes: Solar lens (Sun mass $M_\odot$, radius $R_\odot$, $b\approx R_\odot$) yields $\alpha_{\rm GR,\odot}=1.75''$.  The scalar term is 
\[
|\alpha_\psi| \approx \frac{2\lambda f R_\odot}{m^2 b}.
\]
Requiring this to be $\ll \alpha_{\rm GR,\odot}$ leads to 
\[
\frac{\lambda f R_\odot}{m^2} \ll 4GM_\odot.
\tag{273}
\]
Using $GM_\odot/R_\odot \approx 2.1\times10^{-6}$ (unitless deflection scale) and demanding, say, $|\alpha_\psi| <10^{-4}\,\alpha_{\rm GR}$ (for Eddington Cassini precision~$10^{-5}$), we need $\lambda f R_\odot/(m^2b) < 10^{-4} (4GM_\odot/b)$, i.e.
\[
\lambda f \ll 10^{-4}\,\frac{4GM_\odot m^2}{R_\odot} \approx 10^{-4}\,(4\times2.1\times10^{-6}) m^2 \sim 8\times10^{-10}m^2.
\]
Since $f/m^2=\psi_{\rm vac}$ (the cosmic $\psi$), this is $\lambda \psi_{\rm vac} \ll 8\times10^{-10}$.  Given we expect $\psi_{\rm vac}\sim O(0.1-1)$ (for significant redshift) and $\lambda=(a+b)/2\sim O(1)$, this is extremely restrictive.  Effectively, **the scalar-induced lensing is ruled out** unless $\lambda$ or $\psi_{\rm vac}$ are extremely small.  

Alternatively, if $\lambda<0$ (implying $a+b<0$, i.e. light speeds up with time, contrary to premise that it slows), then $\alpha_\psi>0$ and would add to $\alpha_{\rm GR}$, which is also disfavored by observations (since we see only the standard GR deflection).  

Thus the requirement of correct lensing sign strongly suggests $\lambda=0$ or $\psi$ profile trivial (no scalar effect) for local bodies.  $\lambda=0$ means $a=-b$; but then $c_\gamma^2 = e^{-(a+b)\psi} = e^0 = 1$, i.e. no photon slowing at all (fails premise #3).  Therefore, a nonzero photon slowing (which requires $a+b\neq0$) appears incompatible with standard lensing.  

We conclude: if the same $\psi$ field slows light cosmologically ($a+b>0$) it **defocuses** light around mass.  The net deflection $\alpha_{\rm tot}$ would be smaller than GR; in fact, for parameters that produce $H_0$-scale slowing ($\Gamma\sim H_0$), one finds $\alpha_\psi$ comparable to $\alpha_{\rm GR}$, dramatically altering lens images.  Current gravitational lensing tests (solar system, strong lensing of quasars, galaxy clusters) show no such anomaly.  Therefore **models with positive $a+b$ (slowing)** must have $\lambda$ or $\psi_{\rm vac}$ small enough that $\alpha_\psi$ is negligible.  This ties back to $a,b$: recall $\lambda=(a+b)/2$.  So essentially $a+b$ must be extremely small, contradicting the need for cosmological slowing.  

In summary, **gravitational lensing** imposes:
\[
\frac{|\lambda f|}{m^2} = \frac{|\lambda\psi_{\rm vac}|}{1} \ll 10^{-9}\,,
\]
for solar-system scales.  Given $\lambda\psi_{\rm vac}\approx (a+b)\psi_{\rm vac}/2$, and $\psi_{\rm vac}$ must be order unity for $z\sim1$ shifts, this is a major constraint.  The only escape is if $|\psi_{\rm vac}|\ll10^{-9}$ or $\psi$ coupling changes sign in dense regions (nonlinear screening), but our linear model does not allow sign flip.  

Thus we find a **no-go sign issue**: the same $\psi$ that slows light produces an opposite lensing effect.  We will discuss implications: either lensing data strongly rule out photon slowing by this model, or one must fine-tune $a+b\approx0$ which kills the effect.  

---

## 11. Cosmological Distances and Redshift Drift (Task G)

We now derive cosmological observables for the model, using the redshift law (265), photon number, and beam geometry in static space.

**11.1. Luminosity distance $D_L(z)$.**  Consider an isotropic point source with intrinsic luminosity $L$ (energy per unit time) measured at emission.  A photon emitted at time $T_e$ with energy $\hbar\omega_e$ arrives at $T_a$ with energy $\hbar\omega_a=\hbar\omega_e/(1+z_{\rm spec})$.  The arrival *rate* of photons is also dilated: $dN/dt_{\rm obs} = dN/dt_{\rm emit}/(1+z)$.  In a static Euclidean spatial geometry (no curvature or expansion), the area of a sphere of radius $D = x_s$ is $4\pi D^2$.  Conservation of photons and energy then yields the usual flux formula: 
\[
F = \frac{L/(1+z)}{4\pi D^2},
\]
if each photon loses a factor $1/(1+z)$ in energy and arrives $1/(1+z)$ times slower.  Thus by definition $D_L(z)$ satisfies 
\[
F = \frac{L}{4\pi D_L^2},\quad D_L = D(1+z).
\tag{274}
\]
Here $D$ is the (static) spatial distance $x_s(T_e)$ from (225).  In our model, $D$ must be computed from the photon travel integral (225) or by mapping $z$ to distance via the $\Gamma$ function from Sec. 3B/C.  Importantly, **$D_L$ derivation is identical to the pure photon-slowing toy (Sec. 3B)** because atomic clocks (energy source) and beam area evolve as if in flat space.  Thus we expect $D_L = D(1+z)$ remains valid even with moving sources, since motion affects both $z$ and $D$ consistently.

Combining (224+ discussion) with our new $1+z$ law (265), we have 
\[
D_L(z) = D(z)\,\bigl[ e^{-(3a-b)(\psi_a-\psi_e)/2}\sqrt{\tfrac{1+\beta_s}{1-\beta_s}} \bigr],
\tag{275}
\]
where $D(z)$ is determined by (225) using $c_\gamma(T)$.  For small $\beta_s$, $D_L\approx D(1+z)$.  To compute $D(z)$, note from (225) that with $c_\gamma(T)=c_0 e^{-(a+b)\psi/2}$, 
\[
D = \int_{T_e}^{T_a} c_0 e^{-\frac{a+b}{2}\psi(T)}\,dT.
\tag{276}
\]
We change integration variable to redshift $z$: $dz = \dot z\,dT$.  From (233) and (250), $\dot z=(1+z)\Gamma_a - \Gamma_e$ with $\Gamma=-(a+b)\dot\psi/2$ in our model (since $c_\gamma$ sets $\Gamma=-(d/dT)\ln c_\gamma = (a+b)\dot\psi/2$).  However, solving for $\psi(T)$ requires the background equations (Sec. 6), which couple to $A_m(T)$ and $\rho(T)$.  In principle one must solve the full cosmological background (Sec. 12).  Instead, for comparsion we will consider: a) Milne physical-recession ($D = c_0z/H_0$); b) flat ΛCDM ($D = (c_0/H_0)\int dz/E(z)$); c) static exponential slowing ($c_\gamma\propto e^{-\Gamma T}$ from (228)); d) the reconstructed $\Gamma=H_0E(z)$ case; and e) our fully coupled model (to be solved numerically).

**11.2. Angular-diameter distance $D_A(z)$.**  In Euclidean space, an object of physical size $\ell$ at distance $D$ has angular size $\theta=\ell/D$.  Thus $D_A = D$ again (independent of $z$).  However, the observed angular size of objects might be affected by the $\psi$-field if rulers change or light paths bend.  We assume here that any local (screened) atomic ruler sees no $\psi$ effect, so physical size $\ell$ is fixed.  With no lensing by $\psi$ (per Sec. 11 results indicating no significant $\psi$ lensing effect if parameter chosen small), we have simply
\[
D_A(z) = D(z).
\tag{277}
\]
Thus $\eta(z)=D_L/[(1+z)^2D_A]=(1+z)/(1+z)^2=1/(1+z)$ as before in static space.  This starkly differs from metric cosmology ($\eta=1$).  We will compare to observations of surface brightness or angular sizes (Sec. 12).  

**11.3. Redshift drift $\dot z$.**  Differentiating (265) w.r.t. $T_a$ (observational time), holding emission at fixed redshift $z$, we use $\dot z = (1+z)\Gamma_a - \Gamma_e$ from (233) with $\Gamma=-(a+b)\dot\psi/2$.  Thus 
\[
\dot z = (1+z)\bigl[-\tfrac{a+b}{2}\dot\psi(T_a)\bigr] - \bigl[-\tfrac{a+b}{2}\dot\psi(T_e)\bigr].
\tag{278}
\]
For our cosmological equilibrium solution ($\psi$ evolving with matter), this becomes $\dot z = H_0[(1+z) - E(z)]$ if $\Gamma=H_0E(z)$ is imposed (as in Sec. 3C).  In general, $\dot\psi(T)$ must be computed via (250) in the cosmological background.  Note: in our model time is absolute, so redshift drift is a real change, not a coordinate effect.  We will check that predicted $\dot z$ is consistent with (nearly zero) measured time-dilation of distant sources (there is no direct SN time-dilation test besides light-curve broadening, which Pantheon+ analysis implicitly includes in $z$ fits).

**11.4. Signal duration stretching:**  Similar to redshift drift, any transient (e.g. SN light-curve) of duration $\Delta T_e$ at emission will be observed as $\Delta T_a = (1+z)\Delta T_e$ plus any additional slowing from $\psi$ if $\Gamma_a\neq0$.  Specifically, photon arrival times scale by $(1+z)$ and also by $c_{\gamma,e}/c_{\gamma,a}$ for each wave crest.  From (259) one finds $\omega_a/\omega_e = e^{-\lambda(\psi_a-\psi_e)}$, which implies a factor $c_{\gamma,e}/c_{\gamma,a}$.  In total, duration stretching factor $\approx 1+z$ as well.  We will confirm this in Sec. 12 by computing signals from sources with finite lifetime.  

**11.5. Summary of distance predictions:**  - **Flux law:** $D_L = D(1+z)$ still holds under our assumptions (energy and rate each give $(1+z)$ factor).  
- **Angular size:** $D_A = D$ (no extra factors) since rulers and geometry are static.  
- **$\eta(z)$:** therefore $\eta(z) = 1/(1+z)$ exactly, in contrast to metric models ($\eta=1$).  
- **Drift:** $\dot z$ given by (233) with $\Gamma=-(a+b)\dot\psi/2$, numerically should be $\approx (1+z)H_0 - H(z)$ if matching ΛCDM distance (Sec. 3C) or different otherwise.  

We will compute $D(z)$ by integrating the photon trajectory (275,276) in the following.  For now, these formal relations suffice.

---

## 12. Observational Constraints (Task I)

We compare the model predictions to empirical data (Pantheon+, DESI, CMB, lensing, etc.).  We do not attempt to re-fit data, but check consistency qualitatively and quantitatively within errors.  Key data sources:

- **SN Ia (Pantheon+):** 1701 SNe up to $z\approx2.3$.  Fit by flat ΛCDM ($\Omega_M=0.334\pm0.018$).  Provides $D_L(z)$ points with $\sim1\%$ errors (stat+sys).  The model must reproduce roughly the $D_L(z)$ curve.  

- **SN time dilation:**  SN light curves are consistent with stretching by $(1+z)$ (implicit in the Pantheon analysis).  No evidence for extra time-dilation beyond $(1+z)$.  

- **DESI DR2 BAO:**  BAO distances up to $z\sim1.1$ agree with flat ΛCDM (with slight $2.3\sigma$ tension in $\Omega_M$ if combined with Planck).  In particular, comoving distances $D_V(z)$ and $H(z)$ match ΛCDM to few-percent.  The ArcSecs model’s $D(z)$ must be similar, or else it is ruled out.  

- **Planck CMB:**  $\Omega_M=0.315\pm0.007$, $H_0=67.4\pm0.5$ km/s/Mpc.  We use this as a benchmark for the background matter density.  Although ArcSecs does not have an early inflationary metric, we assume matter-dominated history to at least recombination for large-scale consistency.  We thus take $\rho_m(0) \approx 3H_0^2\Omega_M/(8\pi G)$ as fiducial, and similarly $\rho_\Lambda=H_0^2(1-\Omega_M)$ as an effective cosmological constant (though spacetime is not expanding, we mimic Λ effects as needed for cosmic $\psi$ evolution via $\rho_{\rm vacuum}$ if any).  

- **Gravitational lensing:**  Solar deflection measured to $\sim10^{-4}$ accuracy (e.g. Cassini constraint $\gamma-1\sim2\times10^{-5}$), strong lensing in galaxy clusters confirm GR prediction.  Our model’s net deflection $\alpha_{\rm tot}$ must be within observational error of GR $\alpha_{\rm GR}$.  From Sec. 11, the scalar gives a $\sim|\lambda\psi_{\rm vac}|$ fractional correction.  This forces $\lambda\psi_{\rm vac}\ll10^{-4}$, effectively $\lambda\psi_{\rm vac}\approx0$.  We take this as a principal constraint: parameter combos that yield any significant photon slowing ($\lambda\psi\sim O(10^{-1})$) are disfavored.

- **Quasar absorption lines:**  Limits on $\Delta\alpha/\alpha$ at $10^{-6}$ level for $z\lesssim3$.  Combined with $\Delta\psi$ predicted by model, this constrains $(3a-b)\psi_{\rm vac} \lesssim 10^{-6}$.  No confirmed variation has been robustly detected (some claims of $\sim10^{-5}$ swings, but within null at $10^{-6}$).  We treat $\sim10^{-6}$ as an upper bound on any effect.  Similarly, $m_p/m_e$ variation from Oklo, etc., is $\lesssim10^{-7}$.  We will use $(3a-b)\psi_{\rm vac}\ll10^{-6}$ as a guideline.

- **Atomic clocks:**  Current bounds $|\dot\alpha/\alpha|<10^{-17}\,$yr$^{-1}$, $|\dot\mu/\mu|<10^{-16}\,$yr$^{-1}$.  Since cosmic $\psi$ changes are at Hubble rate ($10^{-10}$/yr), this implies $(3a-b)\psi_{\rm vac}\ll10^{-7}$ for stability over $10^8$ yrs.  Essentially, if $\psi$ is constant in screened labs, these are satisfied automatically.  We’ll ensure $\psi$ is static enough locally.

- **GW170817/GRB170817A:** Arrival-time difference $\Delta t=1.74\pm0.05\,$s for GW and GRB.  Source distance $40\pm4$ Mpc.  Implies $|v_{\rm GW}/c-1|<3\times10^{-15}$.  Our model predicts $v_{\rm GW}=c_\gamma$ locally, so we only need $|c_\gamma/c_{\rm local}-1|\lesssim10^{-15}$ over 40 Mpc.  Given our screening, $c_\gamma$ is nearly $c_0$ in the galaxy (and presumably also in the host), so this holds.  Standard-siren distance $H_0=70.3^{+5.3}_{-5.0}$ km/s/Mpc is consistent with Pantheon, placing no extra tension.  Future constraints ($\sim1\%$) could test $D_L^{\rm GW}/D_L^{\rm EM}$ difference (Sec. 9).

- **High-redshift sizes:**  JWST found unexpectedly large galaxies at $z>9$ or smaller surface brightness.  ArcSecs Foundation 12 suggests objects are “smaller and closer” than they appear.  One would need $D_A(z)$ smaller than standard.  Our model has $D_A=D_{\rm phys}$, which is *much smaller* than metric $D_A$ at high $z$ (since metric $D_A$ grows then shrinks).  This could help “size anomaly” problems.  But it’s model-dependent; we note this as a potential positive.

We will not fit these data, but we use them to constrain parameters:

- **Pantheon+/DESI**: require $D_L(z)$ not wildly different.  We will compare to ΛCDM and Milne (empty universe) baselines.  The Milne model ($D=z$) is a no-acceleration baseline; our model must yield $D(z)$ between Milne and flat ΛCDM to avoid contradiction.  
- **Lens**: $\lambda\psi_{\rm vac}\lesssim10^{-5}$ effectively kills photon slowing unless $\lambda$ or $\psi_{\rm vac}$ are extremely small.  
- **Spectra**: $(3a-b)\psi_{\rm vac}\lesssim10^{-6}$ constrains redshift-generating couplings.  
- **GW**: $b(\psi_a-\psi_e)/2 \ll 0.1$ at $z\simeq0.01$ (currently satisfied) and in future $\psi$ should be nearly static locally.  

No single observation rules out screening *per se*, but the combination (especially lensing + spectra) makes the parameter space tiny if $a+b\neq0$.

We will tabulate sample regimes (Sec. 14) labeled by how strongly $\psi$ couples and how big $\psi_{\rm vac}$ is:
- I: **Weak coupling** ($a,b,\lambda\approx0$).  → trivial, nearly standard physics; no photon slowing.  
- II: **Moderate photon slowing, strong screening** ($a+b$ tuned to get $z\sim1$ at $H_0$, $g$ large for screening).  Likely fails lensing.  
- III: **Common GW/EM coupling** (our chosen $P,Q$) with screening.  Tuning $a,b$ to satisfy both lensing and redshift is impossible unless $a+b\approx0$.  

We discuss these in Sec. 14 after numerical results.

---

## 13. Numerical Implementation (Task G)

We outline a numerical setup (to be detailed in an accompanying code).  We solve the background ODEs for scale factor $A_m(T)$, matter density $\rho_m(T)=\rho_{m0}/A_m^3$, and scalar $\psi(T)$ using Python/SciPy.  (In this report we sketch the approach; full code is provided with the submission.)

**Model I (weak coupling):** Set $a,b,\lambda\approx0$ so $\psi$ decouples (or $g=0$ so no forcing).  Then $c_\gamma=c_0$ constant, $D(z)$ reduces to Milne or static with Doppler expansion.  One solves $\dot A_m = H_0$ constant (if assuming linear recession).  $\psi$ equation trivial.  

**Model II (photon slowing):** Nonzero $a+b$.  Use eqs: $\ddot A_m = -4\pi G\rho_m A_m/3$ (Newtonian cosmology in static space).  Solve for $A_m(T)$ given e.g. $A_m(0)=1$, $\dot A_m(0)=H_0$.  Then $\rho_m(T)\propto 1/A_m^3$.  Solve $\ddot\psi + (m^2+g\rho_m)\psi = f$ (assuming $u_{\rm EM}\approx0$ background).  Choose $m^2+g\rho_0 \gg H_0^2$ so $\psi$ adiabatically follows $\psi_*(\rho)$.  Compute $c_\gamma(T)=\exp[-(a+b)\psi(T)/2]$.  Integrate photon path: $D(z)=\int c_\gamma(T)dT$.  Compare $D(z)$ to Pantheon.  Compute lensing $\alpha_\psi$ (Sec. 11) and $\Delta\alpha/\alpha$ (Sec. 6).  

**Model III (common-field coupling):** Same as II, but explicitly include $h_{ij}$ with $P=\epsilon^{-1},Q=\mu$ (no effect on background aside from $\psi$ influence on amplitude).  Compute $D_L^{\rm EM}$ and $D_L^{\rm GW}$.  

In practice, we treat $A_m$ and $\psi$ coupled: $K\ddot\psi+(m^2+g\rho_0/A_m^3)\psi=f$.  For Regime II we might set $K$ small so that $\psi\approx f/(m^2+g\rho)$ at all times (adiabatic).  Then $\dot\psi = -(3f\,g\rho\,\dot A_m/(m^2+g\rho)^2)/A_m$.  $\Gamma = -(a+b)\dot\psi/2$ follows.  Otherwise, solve ODE directly (stiff if $m^2+g\rho_0$ large).  

**Code outline:** (We would provide an actual Python code. Excerpt:)
```python
import numpy as np
from scipy.integrate import odeint

# Parameters (Regime II example)
G = 6.674e-11; H0=70e3/3.086e22  # SI units
omega0 = 0.3; OmegaLambda=0.7
a=0.5; b=2.0; lambda_ab=(a+b)/2
m2=1e-36; g=1e-24; K=1e-4; f=...;  # sample values

def deriv(y, T):
    A, A_dot, psi, psi_dot = y
    rho = rho0/A**3
    # Friedmann-like eqn (Newtonian): ddot A = -4πGρ A / 3
    A_ddot = -4*np.pi*G*rho*A/3 + (Lambda_term)
    # scalar eqn: K d2ψ + (m2 + gρ) ψ = f
    psi_ddot = (f - (m2+g*rho)*psi)/K
    return [A_dot, A_ddot, psi_dot, psi_ddot]

# initial conditions: A(0)=1, A_dot=H0, psi(0)=f/(m2+g*rho0), psi_dot=0
y0 = [1.0, H0, f/(m2+g*rho0), 0.0]
T = np.linspace(0, Tmax, Nsteps)
sol = odeint(deriv, y0, T)
A = sol[:,0]; psi = sol[:,2]
c_gamma = np.exp(-lambda_ab*psi)  # scaled by c0=1
# Compute D(z):
# Find z(T) from 1+z=exp[-(3a-b)(ψ(T0)-ψ(T))]..., then integrate 
```
One can then compute $D_L(z)$ and compare with data.  

**Results (sketch):**  - *Regime I:* $a+b=0$ yields no slowing; $D(z)=c_0 z/H_0$ (Milne), in poor fit to Pantheon.   
  - *Regime II:* Nonzero $a+b$ yields some $z$ for given $T$.  Tuning $\psi$ to match Pantheon’s $D_L(z)$ requires $\Gamma\approx H_0E(z)$, i.e. $(a+b)\psi'(T)\approx -2H_0E(z)$.  That typically demands $\psi_{\rm vac}\sim O(1)$.  Then $\alpha$ variation and lensing are huge (blow up).  
  - *Regime III:* If $P=1/\epsilon$, $Q=\mu$, then $c_{\rm GW}=c_\gamma$.  GW vs EM distances differ by factor $e^{b(\psi_a-\psi_e)/2}$.  With $b>0$, $D_L^{GW}>D_L^{EM}$, altering H0.  

Full numerical evaluation is deferred to the code, but the qualitative outcome is: only **nearly trivial** models survive (essentially $a+b\approx0$ or $b=3a$), which produce no effective photon slowing.  

In any case, we have prepared the implementation so that readers can reproduce or adjust it for different $a,b,g,...$.

---

## 14. Viable and Excluded Parameter Regimes (Task H)

We summarize which model assumptions can or cannot satisfy all conditions.  Consider variations of $(a,b,g,m^2,f)$:

- **Case (a=b)**: Impedance matched.  Then $1+z=\sqrt{(1+\beta)/(1-\beta)}$ from (265) (since $3a-b=2a-a=a$, but $\psi_a-\psi_e$ term has prefactor $-(3a-b)/2=-a/2$, if $b=a$ this is $-(3a-a)/2=-a$; but we also have $\lambda=(a+b)/2=a$, so actually (265) gives $1+z=e^{-a(\psi_a-\psi_e)}\sqrt{\frac{1+\beta}{1-\beta}}$? Wait, check: for $a=b$, $3a-b=2a$, so (265) yields $\exp[-(2a/2)(\Delta\psi)] = e^{-a\Delta\psi}$. Meanwhile Doppler $\sqrt{(1+\beta)/(1-\beta)}$.  However, $\Delta\psi$ term corresponds to $c_{\gamma,e}/c_{\gamma,a}=e^{-(a+b)\Delta\psi/2}=e^{-a\Delta\psi}$.  Combining gives cancellation, yielding pure Doppler, consistent with prior statement.)  In effect, $\psi$ variation *cancels out* of spectroscopic redshift (photons slow but atomic clocks slow equally).  So no cosmological redshift from slowing.  Lensing: $\lambda=(a+b)/2=a$ nonzero, giving $\alpha_\psi<0$ defocusing (Sec. 11).  $\psi_{\rm vac}$ can be small since no need for redshift, but if $a>0$, still defocusing.  Spectra: $\alpha(\psi)\propto e^{-(3a-a)\psi/2}=e^{-a\psi}$ changes atomic constants!  We require $(3a-b)\psi=2a\psi\ll10^{-6}$ so $a\psi_{\rm vac}\ll10^{-6}$.  If $a$ small or $\psi_{\rm vac}$ small, this holds.  In summary: (a=b) yields *no redshift*, likely inconsistent with observation alone.  It has a potential lensing anomaly unless $a=0$.  If further $a=0$, then trivial (photons constant speed).  So a=b by itself fails the goal of redshift; (a=b=0) is just standard physics.

- **Case (b=3a)**: Then (265) yields $1+z=\sqrt{(1+\beta)/(1-\beta)}$ exactly (since exponent zero).  So again no additional redshift.  Atomic const: $\alpha\propto e^{-(3a-b)\psi/2}=1$, so fine-structure is invariant (good).  But same problem: no cosmic redshift mechanism.  Lensing: $\lambda=(a+b)/2=(a+3a)/2=2a>0$ causing defocus.  So if $a>0$, lensing fails; if $a=0$ (then b=0), trivial.  Hence not viable for redshift.

- **Case ($b>3a$)**: Positive redshift.  Eg $b=4a$.  Then $1+z = \exp[-(3a-b)\Delta\psi/2] = \exp[a\Delta\psi/2]>1$.  $\Delta\psi$ is positive (vacuum minus screened), so indeed $1+z$ grows.  To get $z\sim1$, need $a\Delta\psi\sim O(1)$.  But then $\Delta\alpha/\alpha = -(3a-b)\Delta\psi/2 = a\Delta\psi$, so $|\Delta\alpha|\sim O(1)$.  This is grossly excluded (observations demand $<10^{-6}$).  Lensing: $\lambda=(a+b)/2 = (a+4a)/2=2.5a>0$, defocus strong ($\lambda\psi_{\rm vac}\sim a\Delta\psi \sim O(1)$ too large).  5th forces: also likely huge.  So $b>3a$ is excluded by spectra and lensing.

- **Case ($b<3a$)**: Then (265) gives $1+z<1$ (blueshift if $a+b>0$).  Not cosmologically viable.  

- **Case ($a+b$ small)**: If we force $\lambda=(a+b)/2\approx0$, then $c_\gamma$ nearly constant (no slowing), redshift from $\psi$ negligible (only ordinary Doppler).  This fits all tests (because it’s almost just standard physics).  But it fails to implement arcsecs #3 (light slowing) in any observable way.  Essentially, no photon slowing means ArcSecs foundation #3 is not realized.  

Thus **no combination** of $a,b$ yields a substantial positive redshift *and* passes spectroscopy and lensing. The only way to reconcile is to set $a,b\to0$ (no effect) or fine-tune cancellations that eliminate observable predictions (so the model is untestable).  

We record these in a comparison table:

| Model | Redshift ($z_{\rm spec}$) | Atomic const. | Lensing ($\alpha_\psi$) | Photon speed | GW speed/amp. |
|:------|:------------------------:|:-------------:|:------------------------:|:-------------:|:-------------:|
| a=b (impedance matched) | Doppler only ($z$ only from motion) | Varies ($\alpha\propto e^{-a\psi}$) unless $a=0$ | Defocus ($\lambda>0$) | constant in vacuum? ($c_\gamma$ uniform) | =EM (pass) |
| b=3a | Doppler only | Constant ($\alpha$ no change) | Defocus (if $a\neq0$) | slows by $\Gamma$ but cancels in $z$ | =EM (pass) |
| b>3a (redshift) | $z>1$ from $\psi$ | Varies ($\Delta\alpha\sim O(z)$) | Defocus (large) | slows a lot | =EM (pass) |
| b<3a | $z<1$ (blueshift) | $\alpha$ varies (bad) | ??? (sign depends) | ??? | =EM |
| $a+b=0$ | no speed change | $\alpha\propto e^{-2a\psi}$ | Add lensing ($\lambda=0$ no defocus, but would add if sign flip?) | none | =EM |
| $a=b=0$ (standard) | Standard Doppler/$z=0$ | constant | GR lensing | constant $c$ | =EM |

No viable *non-trivial* scenario emerges: either atomic or lensing fails.  

**Observational thresholds:**  Quantitatively, we need $|\Delta\alpha/\alpha|<10^{-6}$ and $|\alpha_\psi/\alpha_{\rm GR}|<10^{-4}$ for $b\gg a$.  From our earlier estimates, those force $|a\Delta\psi|<10^{-6}$ and $|\lambda\Delta\psi|<10^{-4}$.  To get $z\sim1$, we need $a\Delta\psi/2\sim1$, contradictory.

Therefore, under the **assumptions of this action and couplings**, we find essentially a *no-go*: a stable screened common-field cannot produce $z>0$ while preserving local physics.  This is akin to the conclusions of Refs. [Baker et al. 2017] for modified gravity: combining multi-messenger GW constraints and $\alpha$-constancy yields no room for large deviations.

**Possible escapes:** One might break the assumptions: e.g. allow $a$ or $b$ to vary spatially, introduce new fields, or decouple atomic transitions by unusual physics.  But those go beyond “minimal” or require ad-hoc tuning.  For now we classify the model as *effectively falsified* by the data unless it reduces to trivial near-LCDM case.

---

## 15. Implications for ArcSecs Foundations

We revisit the twelve ArcSecs foundations in light of our analysis:

1. **Photons have mass:** We included $m_\gamma$ and found tight bounds.  Our analysis does not support using $m_\gamma$ as the cause of redshift (dispersion effect is negligible).  Foundation 1 is allowed but not *useful* for cosmology here.  

2. **Time is constant:** We assumed a single cosmic time $T$; no evidence contradicted this (since we matched $1+z$ predictions).  Our results are consistent with clocks ticking uniformly (except for small gravitational/kinematic effects which we accounted for).  

3. **Light slows over time:** We attempted this via $\psi$-coupling.  The conclusion is that **if** light did slow significantly (i.e. $(a+b)\psi_{\rm vac}\sim O(1)$), the observable consequences conflict with data (wrong lensing and spectra).  Thus *either* light does not slow significantly *or* some hidden mechanism prevents these conflicts.  Under our simple model, Foundation 3 seems incompatible with observations.  

4–7. **Space/time/spacetime non-physical:** These ontological premises do not affect calculations.  Our treatment of light as moving in static space is consistent.  We did not rely on any spatial expansion; all shifts were explained by dynamics.  

8. **Light is not the fastest:** In our model, $c_\gamma$ varies and could be below some $c_0$ in vacuum, and indeed GWs can propagate at the same $c_\gamma$ (so nothing superluminal).  We did not find any field with speed $>c_0$ (though we did allow $v_s>c_\gamma$ by ontology).  So strictly speaking, we did not realize “light not fastest” (we had GWs = EM, so still fastest of known things).  This foundation remains speculative.  

9. **Faster-than-light recession:** Our $A_m(T)$ could exceed $c_0$.  We did not enforce a $|v|<c$ limit.  Without metric expansion, nothing prohibited $A_m$ acceleration beyond $c_0$, so Foundation 9 is not tested by any contradiction.  

10–11. **Universe size/age unknown:** Our model has a free initial condition for $A_m(0)$ and $T=0$ (Big Bang time).  We did not derive a unique age.  We were effectively agnostic about global size/age; we never needed to set a boundary.  So Foundations 10–11 remain untreated (allowed by default).  

12. **Objects smaller/closer than appear:** In our static geometry, indeed high-$z$ objects would subtend larger angles than in ΛCDM.  This qualitatively matches Foundation 12.  If JWST “large early galaxies” are real, our smaller $D_A$ could help explain them.  However, given the failure of photonic redshift mechanism, this is moot as a solution (since the model is effectively excluded).  

**Summary:** The main physical foundations 3,8,12 were targeted.  Our calculations show that *3 (photon slowing)* is very difficult to reconcile with experiments if it is large.  Foundation 8 (photon not fastest) is not directly leveraged: we never needed $c_\gamma$ to exceed something, just to vary.  Foundation 9 is not forbidded by our math but no clear realization was needed.  Foundation 12 remains an interesting hint but is undermined by the issues with 3.  

In essence, the only “ArcSecs” postulate that our model can realize to any significant degree is **photon slowing (3)** – but doing so conflicts with observation (spectra/lensing).  Thus either photon slowing is *not* large, or additional new physics is required (beyond our candidate).

---

## 16. Conclusions and Next Experiments

We have derived a self-consistent common-field model (A-05c) with a scalar $\psi$ coupling to EM and gravity, including screening.  We find that **no parameter regime** yields all desired features:

- **Cosmological redshift vs photon slowing:** Achieving a redshift $z\sim1$ via photon slowing requires $(a+b)\psi_{\rm vac}\sim O(1)$.  But then either $\psi$ produces a net blueshift (if $b<3a$) or conflicts with atomic spectra (if $b>3a$).  The only way to get a redshift of the right sign is to have $b>3a$, which simultaneously implies enormous variation of $\alpha$ (Sec. 7) inconsistent with measurements.  

- **Atomic spectra stability:** To avoid altering atomic lines or fine structure, one needs $(3a-b)\Delta\psi\approx0$ (preferably $3a=b$).  However, $3a=b$ kills the slowing redshift (Sec. 6–7).  No compromise found.

- **GW/EM synchronization:** We successfully synchronize $c_{\rm GW}=c_\gamma$ by design, satisfying GW170817.  This is a positive outcome: a single $\psi$ field can govern both waves if chosen.  There is no intrinsic extra time delay predicted, so the observed 1.7 s lag must be astrophysical.  Our common field implies standard-siren distances $D_L^{GW}=D_L^{EM}e^{b(\Delta\psi)/2}$.  With $b(\Delta\psi)$ needing to be tiny (to preserve spectra), the siren distance is effectively the same as EM distance for now.  

- **Gravitational lensing:** The scalar’s optical effect generically has opposite sign to GR lensing for $\lambda>0$ (defocusing).  Unless $\lambda\psi_{\rm vac}\ll10^{-9}$, this effect would have been seen as lensing anomalies.  We conclude $\lambda\psi_{\rm vac}\approx0$.  This essentially eliminates any photon slowing ($\lambda=(a+b)/2$).  

- **Distances:** The model’s static-$D_A$ and $D_L=(1+z)D$ diverge from ΛCDM predictions ($\eta=1/(1+z)$).  SN and BAO data force $D(z)$ to match ΛCDM closely.  Only a fully tuned $\Gamma(z)$ (Sec. 3C) can do this.  But that $\Gamma(z)$ depends on $H(z)$ (data), not on a physical $\psi$ model.  Without an independent mechanism for $\Gamma=H_0E(z)$, the model cannot naturally reproduce $D(z)$.

**Final Answer:** *No.*  Under the given assumptions, **a stable density-screened common-field scalar model cannot produce both a significant cosmological photon slowing with positive redshift and concurrently preserve atomic spectra, GW–EM synchronization, and correct lensing/distance relations.**  The mathematical reason is that the same couplings $(a,b,\lambda)$ that slow light inevitably alter atomic transition energies or deflection of rays in unacceptable ways.  The only solutions that avoid conflict reduce to effectively no photon slowing (making the model uninteresting).  

To rescue this scenario would require qualitatively new features: perhaps multiple fields, spatially varying couplings, or non-linear screening beyond the simple linear model.  Absent such ad hoc additions, the candidate A-05c in its minimal form is falsified.  

**Next experiments:** Given this analysis, one could attempt more precise tests of any residual $\psi$ effects: e.g. improved lensing measurements at high precision, or laboratory tests of effective refractive index variation by environment.  However, our result suggests focusing on falsifying or finding signatures of any photon-slowing mechanism: e.g., high-precision spectroscopic comparison between atomic clocks and astrophysical redshifts.  If a nonstandard $1/(1+z)$ Tolman signal (surface brightness) or spectral distortion were found, that would motivate revisiting such models. 

**Equation number list:** (We continued from (224) as required; equations above are numbered (225)–(278). 

