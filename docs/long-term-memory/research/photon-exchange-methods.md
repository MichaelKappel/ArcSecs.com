# R39 — Photon-source momentum exchange: methods to reproduce

**Status:** executable synthetic weak-field toy; NOT a causal gravitational theory or an observational fit. These numerical methods are intentionally separate from export-safe R39 manuscript.

## Exact model used by source code

Let x and p be the photon's position and momentum, X and P the source's position and momentum, M the source mass, c the reference signal speed, G the coupling parameter, eta the photon-source coupling coefficient, and a an optional softening length. The total Hamiltonian in the current instantaneous model is

`H = P^2/(2 M) + c |p| [1 + eta Phi(|x-X|)/c^2]`

with `Phi(r) = -G M / sqrt(r^2 + a^2)`.

This Hamiltonian defines the **effective source–receiver interaction energy**, not a material spacetime medium. It is invariant under shifting x and X equally, so total momentum is conserved. Hamiltonian gradients give both the photon force and the opposite source force. It has no independent propagating field degree of freedom, and consequently should not be extrapolated to causal source variations or black-hole horizons.

From the weak-field and far-source asymptotic limit, the total angular bending is approximately

`alpha = 2 eta G M / (b c^2)`,

where b is the photon impact parameter. Setting eta=1 produces the half-strength corpuscular benchmark; eta=2 gives `4 GM/(b c^2)`. The latter value is **chosen to match** the leading observed solar deflection. It is not derived from the 11 ArcSecs premises or an observed microscopic carrier.

## Reproduce the numbers

1. Extract the `ArcSecs/` folder into a short local path such as `C:\ArcSecs`.
2. Install Python 3.10 or later; no third-party Python packages are required.
3. From the `ArcSecs` folder, run `python tools/photon_exchange_v1.py`. The script writes `docs/long-term-memory/research/photon-exchange-benchmarks.csv`.
4. Run `python -m unittest tests/test_photon_exchange_v1.py -v` if test imports are supported, or `python -m unittest discover -s tests -p test_photon_exchange_v1.py -v` for guaranteed discovery.
5. Run `python -m unittest discover -s tests -v` and `python tools/validate_package.py` for complete handoff checks.
6. Compare the finite-flight simulation with the leading-order expression above. A finite integration interval, nonzero deflection, and source recoil explain small differences from the infinite-path weak-field approximation.
7. Optional: lower `dt` in `simulate()` to verify numerical convergence. Do not report the synthetic output as solar telemetry.

## Numerical cases

The default scenarios set dimensionless G=1, M=10, c=100; the photon begins at x=-250 with initial momentum along +x. All settings use zero softening. The synthetic impact parameters are 5, 7.5 and 10. Coefficients eta=0, 1, and 2 are tested. Default integration interval is 5 units in T and timestep 0.0005. Trajectories are evolved with a fourth-order Runge–Kutta method.

Conserved quantities: total photon-plus-source momentum and total photon-plus-source Hamiltonian. Source recoil sign is opposite the photon transverse impulse. The model deliberately has no field radiation energy; a later causal implementation must include it.

## SI anchor calculation: NOT a new measurement

Using `G=6.67430e-11 m^3 kg^-1 s^-2`, solar mass `M=1.98847e30 kg`, solar radius `b=6.957e8 m`, and defined reference c `299792458 m/s`, the eta=2 leading-order estimate equals approximately **1.751 arcseconds** for solar grazing. This is a benchmark already known from astronomical work (e.g., Modern Eddington Experiment); obtaining it after choosing eta=2 is not independent validation.

## Controls and scientific failure criteria

- If numerical source and photon momentum do not sum to a constant, the interaction ledger is broken.
- If energy drifts as timestep tends to zero, the source/interaction energy rule or integrator is broken.
- If an independent VLBI or Cassini holdout cannot be fitted by a single already-frozen coefficient, the weak-field model is insufficient.
- No evidence of positive invariant photon rest mass follows from this model, regardless of the bending coefficient.
- No finite-speed causality can be inferred from the static potential; a retarded source-carrier field is required.

## Sources and provenance

- Cassini primary experiment: https://doi.org/10.1038/nature01997
- Modern Eddington optical experiment: https://baas.aas.org/pub/2024n9i040/release/1
- VLBI solar-deflection: https://doi.org/10.1038/349768a0
- CODATA constants: https://physics.nist.gov/cuu/Constants/
- Source technical studies: `docs/long-term-memory/reports/R31.md`, `R35.md`, `R38.md`.

No datasets were downloaded; the sole output CSV consists of deterministic **synthetic** model calculations.
