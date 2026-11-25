# ARC-HYP-C01 — Cosmological mass–inertia regulation of the local photon emission ceiling

**Status:** PROPOSED, unverified physical mechanism; adopted as a working hypothesis in the ArcSecs research charter on 2026-11-23.  
**Owner clarification:** The *main purpose* of the two-spacecraft experiment is to ask **why freshly emitted light in our cosmic domain begins at the locally established maximum speed and subsequently only slows**; it is **not** primarily a claim that photons travel at four times that speed.  
**Related research:** ArcSecs Part XXVI, Part XI screening, Parts XIX–XXV positive-gap photons and source/receiver trajectories; original bubble, relational gravity, and causality reports.  
**Authority:** Explicit user instructions are charter authority; none of the proposed mass-dependent ceiling, literal cosmic wall, surrounding domains or in-flight slowing has been empirically established.

## 1. Exact conceptual intent

The user imagines our cosmic domain as a matter-containing *bubble*, potentially with a shell or wall and a hollow or comparatively dilute region. The **cumulative gravitating mass and its interaction field** may regulate inertial response and set the largest **locally attainable photon emission speed**. In our environment this measured reference speed is set to `c0 = 299792458 m/s`. A photon is not emitted faster than this limit and then decelerated down to it. **It starts at this reference ceiling**, and thereafter its propagation speed may decrease over the photon's flight time or due to interactions with physical fields. The ceiling may be environment/domain dependent; neither an exterior domain nor a perfectly symmetric hollow cavity is assumed to have identical rules.

The two spacecraft carry inherited momentum from disappeared bubble domains. Each may be inertial and feel no acceleration locally while being on a collision course with the other. A **closing rate of separation** may be greater than c0 without being the propagation velocity of a single information-carrying disturbance. The numbers `2c0` for ship closing or `4c0` for beam closing follow only under specified **classical additive kinematics**. The latter cannot be asserted together with a frame-independent photon/causal speed ceiling without additional transformation laws. Keep this cartoon **illustrative, not evidence**.

The concept is not the suggestion that a physical bubble shell exerts a simple inward Newtonian force on every interior object. For an ideal uniformly distributed Newtonian spherical shell, the net interior acceleration is **zero**, even though its potential can be nonzero. The mechanism being sought is a *relational inertia/constitutive response* coupled to the large-scale mass environment; its kernel, cutoff, boundary conditions, and sensitivity to exterior matter must be specified.

## 2. Working definitions: do not conflate

- `T`: a universal ordering parameter (constant time premise), not a deformable substance.
- `x_a(T), x_b(T)`: positions used as **relational bookkeeping**, not proof of substantive Space.
- `v_closing = -d|x_b-x_a|/dT` for approaching objects in a specified common description; not a signal velocity.
- `c0`: accepted present-day *local reference* photon emission speed, numerically 299,792,458 m/s. For publication, specify operational units and the role of today's SI meter/second convention.
- `C_em(r,T; environment)`: hypothesized local **photon emission-speed ceiling** determined (perhaps) by matter/gravity/inertia. At the current reference site `C_em = c0` by normalization.
- `C_causal(r,T)`: possible maximum *information/front* propagation speed. It is a separate notion until derived; do not assume it equals `C_em` in every environment or frame.
- `v_gamma(T; T_e, r_e, spectrum)`: physically relevant **packet/group speed** along a photon path; distinct from phase speed and high-frequency front speed for a dispersive massive photon.
- `tau=T-T_e>=0`: photon elapsed time since emission in the chosen universal ordering; possible path/environmental dependence beyond age is an open question.
- `bubble wall/cavity/exterior`: hypothetical geometries and matter/field boundaries; not discovered features of our universe.
- `I(r,T)` or `Phi_rel`: generalized environment variable constructed from the density distribution and physical interaction kernel; not automatically the ordinary Newtonian potential.

## 3. Candidate bounded slowing rule — mathematical *ansatz*, not derivation

Choose the reference domain and an emission event `T_e`:

    v_gamma(T_e + tau) = C_em(r_e,T_e) * F(tau, path/environment, parameters)

with `F(0)=1`, `0 < F <= 1`, and `dF/dtau <= 0` for the stated no-reacceleration **single-flight** hypothesis. `F=exp(-gamma*tau)` is a convenient toy law, but predicts a finite path length as `tau->infinity`; an autonomous finite-energy scalar may NOT permit such decay forever (Parts XXIII–XXIV). Alternative bounded models have `F(tau)->f_min>0`. If the field changes in space, a locally defined ceiling and transport law must be carefully distinguished: a photon passing from one domain to another might appear to accelerate relative to local coordinates unless the absolute post-emission monotonic condition is included explicitly. This is an unresolved constraint, not a solved mechanism.

Constant causal-limit variant for this domain:

    0 < v_gamma(T) <= C_em(r_e,T_e) = c0 <= C_causal

or the alternative (unresolved) `C_em(r,T) <= C_causal(r,T)` with different environments. Choose one before computing rays or inter-domain boundary crossing. A photon-speed ceiling at emission does **not by itself** imply a bound on relative closing rates.

## 4. Candidate environment functional

One provisional scalar environment descriptor is

    I(r,T) = integral_{matter domain} rho(r',T) K(|r-r'|; lambda_I, boundary) d^3r'

and a normalized response is

    C_em(r,T) / c0 = G[I(r,T)/I(reference)] ,  G(1)=1.

Neither `K` nor `G` is known or established. `G` must **not** be chosen merely to reproduce the observed c0; derive it from an action plus positive-energy, stable, causally consistent matter/field equations. A naive `sqrt(GM/R)` is a *gravitational velocity scale*, not a fundamental maximum signal speed. Check shell cancellation, exterior mass contributions, and isotropy constraints on any Machian kernel. If a bubble cavity or beyond-wall region changes the effective inertial state, compute the transition solution; do not claim an unobserved physical boundary.

## 5. Crucial tension with prior positive-gap photon model

Parts XIX–XXVI used `omega^2 = c_field^2 k^2 + Omega_gamma^2` with `Omega_gamma > 0`. Its group velocity is

    v_group = d omega/dk = c_field^2 k / omega
            = c_field * sqrt(1 - Omega_gamma^2/omega^2) < c_field

for any finite frequency. Therefore the **claim that every massive photon starts with group speed exactly c0** is not automatically consistent with setting `c_field=c0` at emission. Options (all unproven) include (A) define `c0` as the high-frequency/front ceiling, with finite-mass photon packets emitted just below it; (B) choose a new massive-photon dispersion relation yielding exactly c0 initial group speed without superluminal fronts or instabilities; or (C) interpret `c0` as an operational reference bound and permit frequency-dependent initial speed. **Do not silently mix these interpretations.** This question is top-priority before Part XXVII field simulation.

## 6. The two-ship experiment — supporting thought experiment, not a 4c0 prediction

Assume two lone ships, originating from distinct vanished bubbles, have uniform inherited trajectories and no accelerometer signal. A chosen third reference could assign velocities `+v` and `-v`. Under *additive position kinematics*, closing is `2v`; it is not a photon or information propagation speed. If each emits light at c0 relative to its own rest frame, the common-frame beam velocities **depend on the transformation law**. The `4c0` head-on light-front closing number applies only if `v=c0` and common-frame velocities add Galilean-style. It is **not compatible** with an invariant local-to-every-frame c0 ceiling if interpreted as individual photon speeds. Avoid relying on the 4c0 number in the core C-01 claim.

## 7. Consequences and falsifiers to pursue

1. Establish how the local emitting clock, ruler, and particle spectrum define `c0` operationally; compare dimensionless measurements, not only varying dimensionful speed.
2. Derive an action tying the cosmic mass field to an inertial/constitutive response; show a stable nonzero photon mass, positive mode energies, and bounded propagation fronts.
3. Calculate shell/cavity/exterior solutions. A perfectly symmetric gravitational shell has zero Newtonian net interior force. Test proposed scalar/tensor effects, boundary gradients, and environmental continuity.
4. Test local isotropy: one-way/two-way light timing, modern resonator/clock experiments, high-energy particle observations, differential velocities and Machian inertia gradients.
5. Evolve a **newly emitted** photon starting at the proposed local ceiling and trace a much older photon passing through the same environment; predict distinct observable velocities and dispersion. State whether all frequencies start identically.
6. Calculate arrival time versus independent geometric distance, redshift and spectrum **separately**. In-flight speed reduction does not by itself yield an astronomical redshift or a distance overestimate.
7. Include independent anchors (eclipsing binaries, masers, parallax), Ia supernova time dilation, strong lensing image morphology, GW/EM arrival correlations, FRB dispersion, and spectral-line ratios.
8. Distinguish whether a measured 2c0 relative *closing rate* implies anything about faster-than-causal signals (not in itself).
9. Predict a quantitative environment dependence of the ceiling, with specific direction, magnitude, transition length/time and a predeclared null test; without this, C-01 remains qualitative.
10. Check global energy/momentum and any bubble boundary supply of stress-energy. Do not model exterior bubble effects as known astrophysical events.

## 8. Explicit status / what is not being claimed

- The foundation that photons have nonzero mass is a *user-imposed research premise*; observation provides upper limits and no established detection of positive photon rest mass.
- The literal hollow universe bubble, exterior domains, and cosmic wall are speculative.
- A particular Machian inertia kernel, a cosmic mass–dependent photon speed ceiling, and post-emission monotone slowing have **not** been derived or empirically verified.
- The user is **not** proposing a mandatory common-frame 4c0 photon velocity as the main conclusion.
- In current mainstream physical theory, uniform inertial observers measure light propagation invariantly in local vacuum experiments; C-01 is a proposed alternative requiring independent successful predictions. Describe that as an empirical comparison, not an ontology debate.

## 9. Source and update provenance

- User clarification in current conversation, 2026-11-23: 'The real point ... why we would have a maximum speed of light limit locally ... [light] can only slow down from that established maximum speed never start from a faster speed.' This **supersedes** a previous emphasis on `4c0` headlight closing rates.
- User instructions: treat twelve ArcSecs foundations as research charter, not twelve independently confirmed experiments.
- Original ZIP: `09_Bubble_Observational_Tests_Full_Depth.zip`; sources `05_Relational_Gravity_Full_Depth.md`, `07_Cosmic_Bubble_External_Forces_Full_Depth.md`, `08_Bubble_Birth_Death_Greater_Cosmos_Full_Depth.md`, `Relational Superluminal Separation and Causality.md`.
- Prior long-term handoff: `Pasted text(20261123-212813).txt` and preceding Parts XI–XXVI. These are provenance resources, not direct repository-file authority.
- Manuscript integration location: Part XXVI updated copy, *Research Extension C-01*, following main conclusion. No earlier source paper was overwritten.

## 10. Recommended smallest next work item

**Resolve the speed-definition conflict first:** parameterize `v_group`, `v_phase`, and `v_front` for a positive-mass photon; decide whether 'starts at c0' means an exact group speed, a limiting causal front, or an idealized emitted wave. Next derive one finite-energy matter-shell/inertia action and test its predicted local emission ceiling without presupposing a hollow wall. Only then run photon redshift/distance simulations.
