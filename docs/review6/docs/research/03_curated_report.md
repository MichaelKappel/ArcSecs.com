# ArcSecs Research 03 — Constant time — physical clocks, inherited motion, and causal reach

**Status:** curated working report, Part XXIX; conditional derivations and candidate development, not a new observation or completed fit. The twelve-foundation charter in `../../.uai/constraints.uai` governs all work. Original line citations below refer to the separately preserved input archive.

## Retained research material

### CT-01 · research premise and requirements

Model constant ordering T and physical local clocks: N_i(T)=integral nu_i(x(T),v(T),I(T),...)dT. The report notes that a process-rate account can be operationally indistinguishable from a conventional timing law. This is the constructive point: derive a common clock response across atomic species, nuclear transitions, mechanical oscillators and particle decay. No claim that a gravitational-wave background is an actual universal clock; a numerical simulation tick is bookkeeping.

Source loci: `R03:7; R03:15-17; R03:23-29`.

### CT-02 · kinematic/control result

Inherited uniform motion needs no continuing force. Distinguish accelerometer response, velocity relative to another body, and velocity relative to a proposed material regulator. Two oppositely moving ships at +/-u have common-frame separation derivative -2u when approaching; at u=0.9 C, this is -1.8 C while each coordinate speed stays below C. Opposing fronts at +/-C close at 2C. No 4C signal or instantaneous Mach feedback. A common domain rest state is a candidate material reference, not proof of measurable absolute motion. Retarded field equations govern changes in inertia.

Source loci: `R03:23-31; R03:89; X01:350-440`.

### CT-03 · corrected timing derivation

For fixed packet speed w along +x in a common coordinate, x_r(T_a)-x_s(T_e)=w(T_a-T_e). Differentiate to obtain dT_a/dT_e=(w-v_s)/(w-v_r), where v_s,v_r are signed along +x. For a receding source at v_s<0 and receiver fixed, stretch exceeds one. For a stationary age-only propagation law between fixed endpoints, each pulse has the same travel time, so stretch=1. For general w(T,T_e), use the implicit ray endpoint map, including emission-history derivatives. Convert to measured clocks via dN_r/dN_s=(nu_r/nu_s)(dT_a/dT_e). Spectral frequency comes from phase along detector worldline, not automatically from group-packet arrival times.

Source loci: `R03:37-49; R03:71-75; R02:53-59`.

### CT-04 · research interface

Compute photon reach as a ray integral or reachable set, with moving receivers and physical domain boundaries. Causal reach is the union of allowable retarded physical signal channels, not necessarily the photon path. Match observed multimessenger lag including source delay. For eternal or large domains, derive radiative intensity and energy budget; darkness of the sky constrains sources and transport but alone does not specify total age/size. Preserve distinct domain age, object ages, emission time, travel time and observation time.

Source loci: `R03:55-75; R03:95; X01:697-715`.

## Import corrections and boundaries

- R03 is mostly a conventional-model critique, not the requested constructive derivation. Retain process-clock distinction, precision targets, uniform-motion and causal timing tests only. Do not adopt its claim that constant coordinate ordering automatically requires locally detectable motion; observable predictions depend on the dynamics.
- Do not equate a stationary tired-light model with all physical recession models. No new numerical solver was attached; test the corrected endpoint map and use prior Parts XXI–XXII.

## Next implementation

Derive physical clock Hamiltonians and common observable transformation rules; use signed moving endpoints and a retarded domain field. Test clock ratios, decay, GPS, and the arrival-time/redshift relation without using arbitrary clock rescaling.

Deliver a runnable solver, parameter file, raw observables, residuals and convergence results. Keep findings separate from proposals and cite source literature before publishing numerical empirical claims.
