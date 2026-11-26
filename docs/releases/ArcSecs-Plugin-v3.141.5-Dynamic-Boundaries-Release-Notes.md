# v3.141.5 — Dynamic Cosmic Boundaries & Energy Accounting

## Scope and source distinction

Two additional interactive experiments extend BEYOND SPACETIME chapters 30A–30C (especially 30C.5–6) rather than claim to implement a new established cosmology. The original six experiments, including the conventional hot Big Bang reference, remain unchanged in their numerical equations. Physical recession is not ruled out. Neither an observable horizon nor the scale factor is a material wall. No redshift or interior matter law follows from wall expansion alone.

## Adiabatic finite-pressure interior

Assume a uniform idealized gas, constant adiabatic index gamma > 1, no heat exchange, no mass transfer, fixed wall mass M, constant tension sigma and constant exterior pressure Pe. V = 4 pi R^3 / 3. From dU = -Pi dV and Pi = (gamma-1) U/V:

    U(R) = U0 (R0/R)^(3(gamma-1))
    Pi(R) = Pi0 (R0/R)^(3 gamma)
    M R'' = 4 pi R^2 (Pi-Pe) - 8 pi sigma R
    E = M R'^2/2 + U + 4 pi sigma R^2 + Pe V

The exterior work is Pe(V-V0), positive when the gas/wall does work on its surroundings. It is a constant-pressure mechanical reservoir, not a finite parent cosmos. The conserved expression includes its signed pressure work via the potential Pe V; no source energy is manufactured. Pressure drops on expansion and rises on compression. The shell is a Newtonian collective coordinate; no relativistic gas or spacetime model is asserted.

## Prescribed moving screened source

Retain the book's static thin-shell Yukawa potential Phi = -GM/a exp(-a/lambda) sinh(R/lambda)/(R/lambda), evaluate it at a(T)=10+uT, and restrict 0.05 < R < a(T). Fixed effective coupling GM and fixed range lambda. Wall force includes M times the radial acceleration and the pressure/tension terms. Since the potential explicitly depends on time, mechanical energy is not conserved on its own:

    dE_mech/dT = M partial_T Phi = -M Phi (1/a + 1/lambda) u
    W(T) = integral_0^T M partial_t Phi dt
    residual = E_mech(T)-E_mech(0)-W(T)

The work is integrated as an independent state, not defined as the energy difference. This is a prescribed quasistatic source, not a retarded moving-field solution; the source's inertia and energy are not calculated. It does not close the total source+field+wall momentum/energy budget. Static source and zero coupling give zero explicit work. A crossing terminates before the domain boundary; it does not simulate a collision.

## Integration and tests

Fixed-step RK4, 100–8000 integer steps, normalized units and bounded input ranges. Every stage is evaluated only inside the domain; an out-of-domain stage stops at the last accepted state. Reports accepted steps, elapsed time, maximum absolute and scaled residual (scale=max(1,abs(initial energy))), and sampled rows. No claim of exact conservation for arbitrary coarse steps; use refinement and check the residual. The browser provides energy and radius plots and JSON evidence.

The fixture generator uses SciPy DOP853, integrates gas internal energy as an independent variable, and computes screened acceleration and work with numerical angular quadrature instead of the JS closed-form shell implementation. 11 independent reference trajectories at 11 times each. Automated tests compare sampled trajectories and check equilibrium, expansion/contraction, adiabatic invariant, vacuum motion, pressure work, static/zero-coupling limits, work derivative, deterministic repetition, step refinement, input rejection and domain crossing. These are numerical model checks, not new observational evidence.

## Remaining science

Dynamic causal source fields, finite propagation, backreaction, a finite parent energy budget, physical interface microphysics, collision mechanisms, photon transport and a common astronomical likelihood remain open. Do not confuse a conditional energy ledger with empirical validation.

## Release verification

- Full quality gate: 352 passing JavaScript tests, 58 known historical failures, 0 unexpected failures, 0 missing baseline tests. Strict legacy suite remains failing. TypeScript compilation and PHP tests/syntax checks passed.
- 40 additional numerical tests; 11 independent trajectories, 121 reference samples. Existing 29 worker regression scenarios preserved.
- Isolated Chromium rendered-page checks: three original simulators at 390, 768, and 1440 px; cosmic simulator at the same widths, eight experiments and 24 exports in total. Final cosmic rerun verified both radius and energy plots.
- No full live WordPress integration, hardware GPU validation, comprehensive security review, or new observational fit. No automatic deployment or GitHub push.

## Install

Replace the existing physics engine plugin with the full ZIP through WordPress Plugins > Add New Plugin > Upload Plugin. Keep the v3.141.0 Scientific Research Library theme. Back up and stage first. The new controls appear on the existing /cosmic-evolution-simulator/ page (shortcode [arcsecs_cosmic_evolution]). For GitHub, extract the incremental ZIP at the repository root over v3.141.4. It retains the existing GitHub Actions quality workflow, which automatically discovers the new JS tests and runs the updated cosmic browser harness. GitHub CI itself was not executed here.

The source changes are additive except for interface, version and provenance metadata. No original manuscript or data files were edited.
