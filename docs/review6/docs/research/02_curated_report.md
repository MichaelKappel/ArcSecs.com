# ArcSecs Research 02 — Positive-mass photons — causal emission, aging and energy ledger

**Status:** curated working report, Part XXIX; conditional derivations and candidate development, not a new observation or completed fit. The twelve-foundation charter in `../../.uai/constraints.uai` governs all work. Original line citations below refer to the separately preserved input archive.

## Retained research material

### PH-01 · candidate architecture

Use a gauge-invariant Stueckelberg vector with a strictly positive gap as a control field theory (two transverse and one longitudinal physical modes). Explore Abelian Higgs dynamic gap and a causal polariton/history-state model as alternative physical mechanisms. Derive constrained Hamiltonian, charge continuity, mode stability, and emitter/receiver recoil; do not claim positive gap itself proves no ghosts. A dressed quasiparticle gap and a fundamental invariant rest mass are separate hypotheses. Higgs magnetic vortices may alter model-dependent galactic bounds; they do not eliminate laboratory or extragalactic tests.

Source loci: `R02:7-15; X02:548-596`.

### PH-02 · derived restricted benchmark

At constant C and E_m=m_gamma C^2, E=sqrt(C^2 p^2+E_m^2), u=Cp/E_m, v=C u/sqrt(1+u^2), dp/dT=-gamma p. Integrating yields D=C/gamma[asinh(u_e)-asinh(u_e exp(-gamma tau))]. For epsilon=E_m/E_e, arrival speed/C=sqrt(1-epsilon^2(1+z)^2) in this energy-loss control. At epsilon=1e-16 and z=1, deficit is about 2e-32. Do not infer substantial speed loss from substantial redshift. The model is retained only as an analytic benchmark, not a complete cosmology.

Source loci: `R02:31-47; X02:208-245`.

### PH-03 · derived differential constraint

With u=Cp/E_m and v=C u/sqrt(1+u^2), d ln v/dT=d ln C/dT+(1+u^2)^-1 d ln u/dT. This exact identity supplies the monotonicity test for any differentiable path with positive p. If C increases, the required negative d ln u/dT is amplified by (1+u^2). At fixed Omega or fixed mass, derive the full ray force and reservoir transfer separately; no universal drag coefficient follows from the identity. Variable gap needs dynamics and accounting for rest-energy changes.

Source loci: `R02:39-49; X02:230-265`.

### PH-04 · candidate/history control

A multiplicative reservoir state s=1-exp(-tau/tau_M) with dp/dT=-gamma0 s p gives p=p0 exp[-gamma0(tau-tau_M(1-exp(-tau/tau_M)))], preserving positivity and monotonically decreasing p for gamma0>=0. At constant C,gap it decreases v; a finite heat capacity can halt damping at positive speed. Model a reciprocal reservoir, noise and fluctuation/dispersion constraints; do not infer an infinite heat sink. Reported energy closure and 1D PDE blue shift are illustrative claims, not independently reproduced. Preserve diagnostic parameters from X02 lines 208–245: Omega=1, k0=8, oscillator frequency=1.5, coupling=0.4, damping=0.08; source reports k changing 8.000 to 8.009, illustrating that passive filtering need not redshift. Bath tests compare heat capacities 20, 100, 1e6 and memory time 2.0; reported final normalized speeds 0.99993 (capacity 20) and 0.34683 (history-state). Reproduce full initial/boundary data, energy flux and spectral evolution rather than quote chart values as executed physics. A positive p history does not establish cosmological redshift or pulse stretching.

Source loci: `R02:19-27; R02:47-49; X02:500-525; X02:588-594`.

### PH-05 · observational target and model candidate

Advance physical bulk recession and an explicitly subdominant aging channel, not stationary loss as the sole cause of redshift. DES-SN5YR target b=1.003 +/-0.005(stat) +/-0.010(sys), A_obs=(1+z)^b. Define observed spectral z and observed pulse stretch separately using physical clock rates; require joint fit. For an illustrative factorization (1+z)=(1+z_kin)(1+z_age) with A=1+z_kin and z_age>=0, A/(1+z)=1/(1+z_age). No universal percentage bound follows without a fitted z_age(z), covariances, selection and clock mapping. The explorer's 0.5–1% is a conditional design target, not a measured general bound.

Source loci: `R02:53-67; X02:286-330; X02:500-513`.

### PH-06 · constraint/design requirement

Use local energy and momentum balances: partial_T u_rad + div F_rad=-Q; partial_T u_res + div F_res=Q, plus matter recoil and field-work terms where needed. Compute heat, entropy, line width, angular diffusion, spectrum and polarization; a cold dark reservoir must have finite capacity and dynamics. Photon mass radio group delay is proportional to nu^-2 at leading order, degenerate with plasma, not nu^-1. FRBs, solar wind and atomic spectra are model-dependent bounds; gravitational and electromagnetic arrival times constrain differential propagation, not an absolute proof of mass. Retain the positive-mass premise but require empirical compatibility.

Source loci: `R02:69-90; X02:350-398`.

## Import corrections and boundaries

- R02 line 9 gives inconsistent phase/group velocities with u=Cp/E_m; correct v_g/C=u/sqrt(1+u^2), v_phase/C=sqrt(1+u^2)/u. R02 line 36 uses a different epsilon from the exact energy ratio; use epsilon=E_m/E_e.
- R02 lines 53–61 mix endpoint motion, phase redshift and pulse timing; replace with CT-03 and derive the detector phase. Stationary loss may redshift without stretching.
- R02 line 76 gives the correct order of magnitude but omits /c² in the eV mass unit; use 10^-18 eV/c²=1.78266e-54 kg. The broad mass conversions in line 80 and R05 line 11 must be checked individually. R02 line 84 uses inconsistent gap/range units; Omega is angular frequency, lambda_Y=C/Omega, E_m=hbar Omega. Radio delay is nu^-2. Do not repeat unsupported universal mass limits or claims of a full executed solver.
- Avoid importing FRW volume terms as a physical expansion mechanism: derive flux divergence and work on an actual material flow. Do not revive large stationary fixed-gap drag, collisional blur, additive negative-momentum memory or a limitless unaccounted bath as active solutions.

## Next implementation

Implement the joint photon–reservoir–matter PDE from one action or explicitly conservative open-system equations. Verify positive energy, momentum, mass-gap emission and phase/pulse transport separately. Then fit the subdominant loss channel with actual timing data.

Deliver a runnable solver, parameter file, raw observables, residuals and convergence results. Keep findings separate from proposals and cite source literature before publishing numerical empirical claims.
