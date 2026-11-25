# ArcSecs Research Report R39 — Photon Momentum Exchange, Source Recoil, and Physical-Field Gravity

**Edition:** 23 November 2026 | **Status:** theoretical working research, reproducible synthetic calculation, not a new experimental result | **Related reports:** R31, R35, R38, R25 | **Scope:** weak-field photon deflection and source backreaction | **Authorial orientation:** affirmative ArcSecs physical-first research

> **ArcSecs editorial reading key:** This report advances an interaction model under the ArcSecs eleven-principle charter. Measurements and their uncertainties are kept separate from model-dependent inferences and from the proposed mechanism. The photon–source coupling is hypothetical and has not been demonstrated to be a unique explanation of the measurements.
>
> **interpretation-versus-observation checkpoint:** The deflection of a radio source near the Sun and changes in a spacecraft radio link are measured effects. A particular field mechanism for causing them is a hypothesis until it makes and passes an independent, discriminating prediction. The equations and calculation work belong to separate code and reproduction documents, not this export-friendly research manuscript.

## Abstract

The ArcSecs project distinguishes physical objects and their interactions from the abstract coordinates used to describe where and when those interactions happen. Three prior technical reports supply the starting material for this investigation: R38 provides an eighteen-type entity and relation vocabulary; R31 reviews observations of photon deflection and the operational meanings of photon mass; R35 reviews physical-field and relational models of gravity against precision experiments. None of these studies, alone, fully closes the conservation ledger for a source that changes the trajectory of a moving photon. This report therefore specifies and executes a narrowly bounded candidate for reciprocal photon–source momentum exchange. It describes the photon as a physical excitation carrying energy and momentum, the gravitating body as a source with a measurable position and recoil momentum, and the interaction as a translation-invariant effective potential. It uses constant universal progression as the ArcSecs time-ordering premise. The model has no physical space, time, or spacetime substrate. A lightweight, externally stored numerical program confirms equal and opposite exchange, conserved total momentum, conserved combined energy, and weak-field bending that approaches the observed solar-limb benchmark when one phenomenological coefficient is fixed at the appropriate value. These are synthetic internal-consistency successes. The model does not derive that coefficient from more fundamental matter physics, does not propagate a disturbance at a finite speed, and cannot yet explain clocks, strong-field horizons, or cosmic photon slowdown. The immediate research payoff is a physically legible, executable bridge connecting the R38 ontology to the gravitational measurements summarized by R31 and R35 while exposing the additional physical steps needed for a legitimate unified theory.

**Keywords:** physical photon, light deflection, gravitational momentum transfer, source recoil, constant event progression, relational locations, source-anchored interaction, Hamiltonian consistency, evidence–interpretation distinction, ArcSecs.

## 1. Mission boundaries and eleven-principle research charter

The following eleven statements are the sponsor's ArcSecs research premises and must not be rewritten into softer slogans or presented as independently certified laboratory discoveries. The model is developed inside this authorial framework and its quantitative consequences are then checked honestly.

1. **Photons have mass.**
2. **Time is constant.**
3. **Light slows down over time.**
4. **Time does not physically exist; it is the “When.”**
5. **Space does not physically exist; it is the “Where.”**
6. **All that physically exists at any moment occupies area and has mass at that moment.**
7. **Spacetime does not physically exist.**
8. **Light is not the fastest thing in the universe.**
9. **Things move apart from each other faster than causality; time, space, or spacetime cannot be physically stretched because they are not physical substances to stretch.**
10. **The size of the universe is unknown.**
11. **Objects in the universe are smaller and closer than they appear.**

The question here is *not* whether to advocate ArcSecs or whether to treat geometry as physical cloth. This study never invokes a stretchable coordinate system to provide a force. Its purpose is to find an interaction rule with identifiable bearers of energy and momentum, an equal-and-opposite response, source-based physical measurements, and experimental consequences. Established experimental observations remain constraints, including when the current ArcSecs mechanism cannot yet explain them. The report does not make relativity the proposed solution and does not spend chapters relitigating project premises.

## 2. Specific problem connecting R31, R35 and R38

R38 identifies a physical Source, an Excitation, an InteractionEvent, and a corresponding Receiver as distinct types. It also designates a LocationRelation as nonmaterial information about where physical bodies are, and a SequenceRelation as nonmaterial information about when events occur. That is a useful ontology, but a computer needs a concrete rule specifying how the Source and Excitation change state when they interact. Merely labeling the event as gravitational does not determine its intensity, direction, exchanged momentum, or accumulated signal delay.

R31 assembles strong observational evidence for solar deflection, spacecraft radio-link effects, astronomical lensing, radiation pressure, and photon momentum. It carefully distinguishes energy-equivalent photon mass from the narrower hypothesis of positive invariant rest mass. R35 describes classical momentum-transfer analogies, Machian and Weber-style alternatives, and field-based gravitational candidates. In both cases, successful agreement with familiar numerical benchmarks must not be mistaken for proof of the physical identity of the interaction carrier.

The missing connection is straightforward to state: if the Sun influences an incoming photon, the Sun–field–photon system must account for the impulse delivered to the photon and the opposite impulse or momentum flux carried by the source and field. It also must reconcile the photon trajectory with energy bookkeeping. In the real world, moving and accelerating sources communicate changes through physical signals; a complete theory therefore needs a finite-propagation carrier. It is better to isolate those demands than hide them behind a fitted deflection angle.

## 3. What existing observations actually establish

### 3.1 Solar-deflection observations

Gravitational light deflection is not merely a diagram in a textbook. Optical eclipse astrometry and radio very-long-baseline interferometry detect changes in the apparent angular position of remote sources when their rays pass close to the Sun. The Modern Eddington Experiment review published in the *Bulletin of the American Astronomical Society* reports a modern optical solar-limb estimate of about 1.752 arcseconds with about three percent uncertainty. The measurements involve image positions, calibrated stellar reference catalogs, lens and camera distortions, atmospheric and field-position controls, and statistical estimation. The derived angle is an experimental result; the explanation assigned to the angle is a separate layer. [S1]

VLBI programs add a different, high-precision route. They infer changes in differential radio path delays by comparing receivers and determining the apparent directions of radio sources near the Sun. These data can constrain whether an alternative force law reproduces the measured angular bending and its dependence on impact parameter. Radio measurements carry plasma-propagation corrections that must be treated as a physical effect rather than silently incorporated into a gravitational prediction. [S2]

### 3.2 Cassini radio-link experiment

Bertotti, Iess and Tortora's 2003 Cassini solar-conjunction study analyzed radio-link signals as the radio paths approached the Sun. Their published parameter is gamma equal to one plus a measured departure of 2.1 parts in one hundred thousand, with an uncertainty of 2.3 parts in one hundred thousand. This parameter is obtained by fitting a specified signal-delay model; it is not a detector output that independently reveals a material spacetime. The signal's measured frequency changes, Doppler tracking, plasma correction, and inferred path geometry are the primary constraints on any ArcSecs replacement. A candidate that yields a similar fitted gamma using merely relabeled coordinate words adds little scientific value; one that predicts an additional source-dependent or frequency-dependent effect that survives independent tests would be more valuable. [S3]

### 3.3 Photons carry real momentum

Photon emission, absorption and reflection produce measurable mechanical impulses. Radiation pressure and atom recoil show energy and momentum passing between physical systems. This supports treating the electromagnetic signal as a physical Excitation and imposing conservation of total momentum in interaction models. It does not, by itself, settle whether the free photon's invariant rest mass is positive. Goldhaber and Nieto review how different experimental searches place upper bounds on that narrower parameter, often with distinct model assumptions. These distinctions are preserved in the ArcSecs vocabulary rather than used to restart an ontology dispute. [S4, S5]

### 3.4 A measurement is not a unique microscopic explanation

The same externally measured deflection or delay can sometimes be generated by different effective mathematical descriptions. Consequently, reproducing the solar-bending coefficient is a necessary constraint but not a successful identification of a force carrier. An independent result would require a new measured feature, a new explanation with independently fixed parameters, or physical conservation consequences that are not freely adjustable. This report treats the experimental values as a benchmark, not as a license to describe its own exploratory mechanism as observed.

## 4. Typed physical components used by the new model

The effective model defines a localized massive Source with a position, inertial mass, and momentum; a photon Excitation with a position, propagation direction, energy, and momentum; and a single InteractionEvent whose transfer strength depends on the current separation of those physical participants. Its evolving variables follow a constant universal progression label T. Relative position is recorded through an R38 LocationRelation; T is an R38 SequenceRelation. Neither relation supplies momentum or exerts force.

The photon has a physical propagation state and a nonzero momentum transfer capability. The simulation uses a positive signal energy and an effective photon inertial response; it deliberately does not insert a positive photon invariant rest mass as a derived result. The project premise that photons have mass stays visible, while the exact mass sense supported by this experiment remains properly labeled. A future massive-photon branch must implement independently measured rest-mass effects, polarization modes, and plasma corrections. It must not simply convert photon energy into a rest-mass detection by changing words.

The potential appearing in the numerical prototype is a **bookkeeping device for a source–receiver interaction energy**, not a claim that empty coordinates are material and not yet a physical field carrier. It is determined by the source's mass and the relation between the source and the excitation. All trajectory changes have reciprocal source momentum changes. The simulation can therefore say what it means for *the same interaction* to bend a light ray and recoil the source. It cannot yet say what medium-free physical entity transports that influence across a finite separation in a causal way. That is reserved as the central UPM-2 research problem.

## 5. The minimal reciprocity candidate

The implementation begins with an effective interaction energy depending only on source–photon separation and photon momentum. This choice guarantees that absolute coordinate origin does not affect the motion. The photon changes both direction and the momentum supplied to it by its interaction with the source. The source changes momentum oppositely. The interaction energy and the kinetic energy of the source and excitation together form one total-energy record. The candidate is a translation-invariant two-participant Hamiltonian system, with full mathematical definitions kept outside the report in the source code and methods document.

A single dimensionless coupling coefficient controls the strength of the photon–source interaction. The coefficient is a **phenomenological input**, not an independently derived theorem. A value selected to match the solar weak-field deflection gives the standard observed leading-order amplitude. The same value is used in the worked test without retuning the force separately for each synthetic impact parameter. The code also runs a half-strength candidate and a zero-strength candidate. The result is an explicit numerical statement about what is caused by the coupling rather than an assertion about geometry itself.

This construction is intentionally limited to weak fields and long-range scattering. It is not safe to extrapolate it down to a black-hole trapping surface, where nonlinear source physics, finite signal speed, and strong gradients can become crucial. Nor does the static effective potential include a cumulative tired-light mechanism. Local gravitational gradients and secular cosmological propagation changes are distinct questions and require distinct physical interaction channels unless one shared field can truly be derived.

### 5.1 Why source recoil matters

A simulation that moves only the photon while holding the source fixed has an unrecorded external participant: whatever holds the source fixed must absorb the opposite impulse. Such a simulation can fit a trajectory while violating the project's physical accounting principle if it claims the source is an isolated physical system. R39 therefore evolves the source's momentum and position, even though its recoil is tiny for a very massive object. The model carries equal and opposite momentum transfer at every integration step; it checks the total rather than merely calculating a deflection. This is a meaningful improvement over an imposed optical bending formula, although not an empirical detection of a gravitational exchange carrier.

### 5.2 Why an energy ledger matters

A time-independent interaction rule should not manufacture or destroy energy in a closed two-participant test. A numerical method should verify that the total kinetic-plus-interaction energy stays stable under progressively finer steps. The companion program performs this check and writes a small reproducibility table. It does not prove that a real gravitational field stores its energy in precisely the same way. In a causal field theory, a third contribution—the physical field's energy and momentum—must enter this ledger, along with radiation losses when accelerating sources emit disturbances.

### 5.3 Why time remains constant in this research program

All numerical state changes are ordered by the same T progression label. T is never an elastic substance. Physical sources may move, photons may change direction and relative speed, and atomic processes may have state-dependent frequencies; those properties do not cause the program to treat T as a material thing that slows or stretches. This is a deliberate ArcSecs modeling choice. The present photon-only experiment does not establish that the universal T premise has been empirically distinguished from alternative time coordinatizations. That belongs to the species-dependent clock and synchronization work of R26 and R29.

## 6. Computational method, clearly separated from the published narrative

The source program is located at `tools/photon_exchange_v1.py`, with tests at `tests/test_photon_exchange_v1.py`. It uses Python's standard library and requires no astronomy subscription or external numerical library. A reproduction guide at `docs/long-term-memory/research/photon-exchange-methods.md` explains how to execute the solver, select a synthetic source, and inspect the exported CSV. The manuscript contains no displayed equations, calculation dumps, code fences, mathematical derivations, or base64 figure blocks.

Five simulation scenarios were executed. One has no coupling and serves as a straight-line control. Two use different coupling strengths at the same impact parameter. Two more retain the strongest coupling while increasing the distance of closest approach. In each case the code integrates both physical participants and records the outgoing photon direction, the equal and opposite source momentum, the corresponding simple weak-field estimate, the worst observed combined-energy drift, and the worst observed combined-momentum drift. The numbers use illustrative dimensionless parameters. They are **not** Sun observations, a fit to Cassini raw data, a real photon-mass measurement, or a simulation of another universe.

The tests check that the force pair sums to zero, that the zero-coupling model leaves momentum unaltered, that source and photon momenta remain reciprocal, that overall energy stays constant within floating-point tolerance, that bending grows with coupling, and that bending decreases with a greater passing distance. The analytic weak-field law is checked against the numerical integration with a deliberately nonzero tolerance because finite start and end locations differ from the infinite-distance approximation.

## 7. Results of the executed synthetic calculation

The no-coupling control travels in a straight line. The half-strength candidate bends by approximately 0.000400 radians for the chosen synthetic source and trajectory. The full-strength candidate bends by approximately 0.000801 radians. Increasing the illustrative impact parameter lowers the bending systematically. In the full-strength run, the source's outgoing transverse momentum equals the opposite of the photon's outgoing transverse momentum to the precision shown in the generated CSV; the relative total-energy drift is near numerical roundoff for the selected integration step. These results check the internal mechanics, not the correct identity of a force carrier.

The leading solar-grazing deflection predicted by the **chosen weak-field coefficient** is about 1.75 arcseconds. The numerical result and the simple solar estimate are reproduced in the methods document, not embedded here. Agreement is expected because that coefficient was selected to yield that leading-order benchmark. It would be misleading to count the agreement as an independent scientific confirmation of ArcSecs or as proof that photons possess positive invariant rest mass. What is new relative to a single deflection formula is the explicit conserved response of the source in the same mathematical rule.

### 7.1 Results that cannot be claimed

No radio telemetry or VLBI catalog was downloaded and refitted. No microphysical radiation–gravity exchange carrier was detected. No new finite-speed gravitational signal was implemented. No intrinsic photon rest mass was measured. No solar or stellar gravitational parameter was estimated from the raw observations. No direct physical modification of atomic transition frequencies was modeled. No astrophysical tired-light energy-transfer law was derived. No extreme horizon-crossing observation was made. No outside-universe boundary was detected. Each of these belongs to an independent research task and should remain open in UAIX memory.

## 8. Causal completion and required field backreaction

The instantaneous separation-based force in this model is a useful closed laboratory for conservation accounting, but it is **not** an acceptable final causal theory. If a physical source changes position, the influence detected far away should depend on a finite-speed physical carrier or another rigorously specified causal interaction channel. Making the source's outgoing momentum compensate the photon's recoil is not equivalent to establishing how the exchanged energy and momentum reached the participants.

The next version must introduce an explicit field state attached to a physical source and capable of propagation, storage of energy and momentum, and absorption by a physical receiver. The field must have a finite characteristic propagation speed specified by a physical dynamical law rather than imposed by a synchronization convention. The calculation must track field momentum during flight. A source should recoil when it emits or redistributes the field, and a receiver should respond when a disturbance arrives. In between, field energy and momentum must be present in the ledger rather than disappearing until the receiver moves.

The model must distinguish the comparatively slow physical motion of a source, local photon scattering near that source, and any additional external-cosmos influence. In the greater-cosmos program, the same standard applies to a nearby bubble source: a hypothesized pulling force must carry energy and momentum through a physical interaction and be detectable with a causal propagation history. The earlier screened-shell force model gives an interesting candidate static response but does not eliminate the need for moving-source field backreaction and an observationally distinct prediction.

## 9. Experimental path forward: predictions not yet fitted

### 9.1 Solar-distance and frequency cross-check

The first practical calibration uses published VLBI angular deflection and spacecraft radio delay, controlling for solar plasma, source position and ephemerides. First reproduce the catalog data using the exact reduction procedures supplied by the observing teams. Then freeze the ArcSecs coefficient using one calibration subset. The remaining observations should be treated as a holdout, rather than allowing a separate coefficient to rescue each baseline. Pre-register which frequency-dependent or trajectory-dependent deviation, if any, the ArcSecs carrier predicts beyond the weak-field leading term. A null holdout result then yields a quantitative limit on the extra physical coupling.

### 9.2 Recoil observability

The Sun's recoil from one photon is far too small to observe as an isolated event. A laboratory analog using electromagnetic radiation pressure, movable mirrors or trapped microscopic scatterers can test the reciprocal impulse bookkeeping directly but **cannot independently identify cosmic gravitation**. An actual gravity–photon carrier requires a test where the exchange differs from already known electromagnetic recoil and from the benchmark solar-bending result. Designing such an experiment is a later task; numerical conservation alone does not make it real.

### 9.3 Clocks and gravitational gradients

A future extension could couple the same physical source field to atomic or nuclear transition energies while holding universal T fixed. It must reproduce measured frequency ratios from different altitudes and from moving clocks, and it must do so without adjusting each clock species independently after seeing the result. If all local rate ratios become operationally identical to familiar coordinate predictions, the result is a possible physical reinterpretation but not a separately detected theory. Distinct species sensitivity, preferred-frame effects, or dynamic source-response transients are possible search targets, subject to their existing precision bounds.

### 9.4 Massive photons and accumulated propagation change

The project takes photons to be massive, and it investigates secular changes to light propagation. A nonzero invariant rest mass, however, is a separate hypothesis from the established facts that radiation carries energy and momentum. It must be tested with dispersion, longitudinal modes, Coulomb-law departures and carefully controlled source physics. Likewise, a cumulative cosmological speed or energy change requires an energy sink and must reproduce observed supernova arrival-interval scaling, multi-band dispersion, source sharpness and the microwave background. Those challenges should be inherited from R30 and R36 instead of silently declared solved by the gravitational bending toy.

### 9.5 An observation that would genuinely differentiate the program

A strong candidate would predict a small signal beyond the existing weak-field law, fixing the new coefficient through independently measured properties of a source or carrier and forecasting a held-out data feature. One possible family is a frequency-independent but source-history-dependent correction to signal delay after a known physical source change. Another is a small, energy-dependent shift associated with a specifically defined massive-photon dispersion channel after controlling for plasma. Neither is yet numerically specified by R39. A future report must choose one and preregister it rather than listing both as confirmed discoveries.

## 10. Structured observation-to-inference evidence ledger

| Evidence / source | Direct or processed observable | Interpretation boundary | ArcSecs follow-up |
| --- | --- | --- | --- |
| 2017 eclipse / 2024 Modern Eddington Experiment review [S1] | Calibrated apparent source-position shift near Sun | Physical coupling mechanism not directly recorded | Reproduce deflection profile with one fixed source-coupling coefficient |
| Solar VLBI deflection [S2] | Differential radio signals and inferred source directions | Solar plasma and geometric path reduction must be controlled | Holdout trajectory and frequency analysis |
| Cassini solar-conjunction tracking [S3] | Coherent radio-link Doppler/frequency response | Fitted gamma is model-dependent, not a picture of material spacetime | Independent prediction for path delay and its residuals |
| Photon recoil / radiation pressure [S4] | Mechanical impulse when radiation interacts with matter | Demonstrates transferred momentum, not intrinsic rest-mass discovery | Complete reciprocal photon–source–field energy ledger |
| Photon mass constraints [S5] | Laboratory and astrophysical null measurements with assumptions | Upper limits do not constitute positive mass detection | Design a specific nonzero rest-mass discriminator |
| R39 synthetic trajectory | Outgoing angle under assigned coupling | Computed prediction, not sky observation | Compare with independent VLBI holdout after freezing coefficient |
| R39 source response | Equal and opposite impulse under assigned coupling | Algorithmic consequence of chosen Hamiltonian | Build a retarded mediator with energy/momentum transport |
| R39 energy conservation | Stable total energy in numerical integration | Tests equations and integration, not experimental source mechanism | Add field stress/energy and moving-source emission |

## 11. Scientific status, limitations and reproducibility disclosure

The **empirical** support at this stage is for the existence of light bending, radio-link effects, and radiative energy–momentum transfer. The **ArcSecs premises** are the sponsor's fixed research framework. The **candidate mechanism** in this paper is a new, testable *working calculation*, not a demonstrated law of nature. The **numerical results** verify internal consistency under stated assumptions; they were generated in dimensionless illustrative units and should not be interpreted as telescope data. The candidate has a coefficient chosen to match an already known bending value. A genuine theory improvement requires a first-principles derivation of that coefficient, a causal mediator, and a second independently predicted observation.

The source program needs no external dependencies, but it does not include a measured solar ephemeris, full astrometric covariance matrix, plasma corrections, spacecraft phase-delay time series, or a fitted likelihood. The current finite-interaction-range issue, the treatment of strong fields, the positive photon rest-mass question, local oscillator couplings, cosmic-scale energy transfer, and external-bubble backreaction all remain unsolved. These are next experiments and derivations, not reasons to discard source data or restart a philosophical argument.

All observations, uncertainty values, and external experimental references must be checked against primary papers before journal submission. Human authorship, original measurement reprocessing where appropriate, statistical uncertainty analysis, explicit funding/conflict disclosure, and independent reviewer assessment are still required. The existing reports and source literature must be cited rather than copied without provenance. No AI-generated manuscript is represented here as peer reviewed, journal accepted or experimentally validated.

## 12. Conclusion and concrete next action

R39 moves the ArcSecs physics engine from *naming* physical entities to calculating a reciprocal physical-state change. Using a single source-linked interaction ledger, it bends a photon, changes the source's momentum oppositely, and preserves total energy without assigning force to empty space or treating time as a stretchable substance. The model's principal value is its explicit conservation bookkeeping and an executable route from R38's ontology to R31/R35's light-deflection observations.

Its principal missing result is equally precise: an effective instantaneous interaction is not a physical propagating carrier. **Next: derive a finite-speed, energy–momentum-carrying field and source emission/receiver absorption rules, then use a frozen model to predict a solar or laboratory residual that existing data have not already been used to fit.** Retain the observed data, preserve the eleven-principle research charter, and label every novel claim according to whether it is observed, computed under assumptions or still proposed.

## Primary-source references and retrieval starting points

**[S1]** *Modern Eddington Experiment 2024: Results and Conclusions*. *Bulletin of the American Astronomical Society* (2024). https://baas.aas.org/pub/2024n9i040/release/1. Reports results and provenance for modern eclipse astrometry, including a roughly 1.752 arcsecond estimate with a quoted three-percent uncertainty.

**[S2]** *New measurement of solar gravitational deflection of radio signals using VLBI*. *Nature* **349**, 768–770 (1991). https://doi.org/10.1038/349768a0. Radio-astrometric deflection and its measurement context.

**[S3]** Bertotti, B., Iess, L. & Tortora, P. *A test of general relativity using radio links with the Cassini spacecraft*. *Nature* **425**, 374–376 (2003). https://doi.org/10.1038/nature01997. Solar-conjunction radio tracking, calibrated delay model, fitted parameter and uncertainty.

**[S4]** Barnett, S. M. *Resolution of the Abraham–Minkowski Dilemma*. *Physical Review Letters* **104**, 070401 (2010). https://doi.org/10.1103/PhysRevLett.104.070401. Momentum accounting in electromagnetic interactions with matter; medium-specific physics is not a gravitational-force detection.

**[S5]** Goldhaber, A. S. & Nieto, M. M. *Photon and Graviton Mass Limits*. *Reviews of Modern Physics* **82**, 939–979 (2010). https://doi.org/10.1103/RevModPhys.82.939. Model-dependent and model-independent aspects of searches for photon invariant rest mass.

**[S6]** Deser, S. *Self-Interaction and Gauge Invariance*. *General Relativity and Gravitation* **1**, 9–18 (1970). https://arxiv.org/abs/gr-qc/0411023. Historical field-theoretic self-coupling benchmark; not evidence for a literal geometric substrate and not equivalent to the specific R39 mechanism.

**[S7]** NIST CODATA *2022 recommended values of the fundamental physical constants*. https://physics.nist.gov/cuu/Constants/. Source for reproducible physical-constant definitions and benchmark inputs.

**[S8]** R31, *Physical Photon Mass and Deflection*, internal ArcSecs report `docs/long-term-memory/reports/R31.md` (editorially reviewed, not peer reviewed).

**[S9]** R35, *Relational Gravity Without Spacetime Fabric*, internal ArcSecs report `docs/long-term-memory/reports/R35.md` (editorially reviewed, not peer reviewed).

**[S10]** R38, *Physical Reality Without a Spacetime Substrate*, internal ArcSecs report `docs/long-term-memory/reports/R38.md` (editorially reviewed, not peer reviewed).

## UAIX navigation

- [Durable research index](../index.md)
- [R38 typed ontology](R38.md)
- [R31 photon-deflection source study](R31.md)
- [R35 relational gravity source study](R35.md)
- [Experimental reproduction guide](../research/photon-exchange-methods.md)
- [Synthetic calculation output](../research/photon-exchange-benchmarks.csv)
- [Current hypothesis and provenance record](../research/photon-exchange-ledger.md)

*R39 is a synthetic research integration study with independent primary-source citations; it preserves the full earlier technical corpus. Neither the photon coupling law nor its numerical confirmation is an empirical discovery.*
