# R41 companion: field action, numerical methods, reproduction, and limitations

**Status:** exact specified toy Hamiltonian, numerically approximated continuous evolution. Not a detected cosmic field, solar-system gravity derivation, photon-mass detection, or 3D bubble dynamics.

## 1. Variables and governing mathematical hypothesis

Take a one-dimensional computational coordinate `x` (a numerical Where) and a constant evolution index `T` (the ArcSecs When). The physical candidate is a scalar excitation `φ(x,T)`. Its canonical field momentum is `π = ∂φ/∂T`. The particles have positions `x_i`, mechanical momenta `p_i`, inertial masses `m_i`, and scalar charges `q_i`. The mediator front-speed parameter `u`, screening coefficient `μ`, and smoothing width `σ` are synthetic and freely selected.

For periodic length `L`, with unit normalization for the field kinetic term, specify the **single shared energy functional**:

\[
H =\sum_i\frac{p_i^2}{2m_i}
+\frac12\int_{-L/2}^{L/2}\!dx\,\big[\pi^2+u^2(\partial_x\phi)^2+\mu^2\phi^2\big]
-\int_{-L/2}^{L/2}\!dx\,\rho(x,T)\phi(x,T).
\]

The physical source density is a smoothed sum:

\[
\rho(x,T)=\sum_i q_iG_\sigma(x-x_i(T)),\quad
\widehat G_\sigma(k)=e^{-\sigma^2k^2/2}.
\]

The canonical field and particle equations following from this **one** Hamiltonian are:

\[
\partial_T\phi=\pi,\qquad
\partial_T\pi=u^2\partial_x^2\phi-\mu^2\phi+\rho,
\]
\[
\frac{dx_i}{dT}=\frac{p_i}{m_i},\qquad
\frac{dp_i}{dT}=q_i\int\!dx\,G_\sigma(x-x_i)\,\partial_x\phi(x,T).
\]

The nonrelativistic particle kinetic term is a *limitation of this toy*, not a general photon or high-energy law. The static source solution has positive φ peaking around positive q. A second positive q accelerates *toward* the field maximum. A negative test charge accelerates away. `μ > 0` produces finite-range interactions. There is no literal elastic space or variable material time in these equations.

## 2. Conservation accounting

The **field momentum** on a periodic one-dimensional domain is

\[
P_f=-\int dx\,\pi\,\partial_x\phi.
\]

Total momentum is

\[
P_{tot}=P_f+\sum_i p_i.
\]

With the shared source shape function used for field sourcing and particle forces, translation invariance gives `dP_tot/dT = 0` in the continuous system. The energy functional `H` also has no explicit `T`, giving `dH/dT = 0` for the continuous closed Hamiltonian. **Numerical discretization is approximate**: the finite-step symplectic method conserves a nearby modified Hamiltonian and allows small oscillatory error in the original `H`. The tested energy error decreases with smaller `dt`.

Do not confuse positive free-field energy with the **negative source interaction energy**. Reporting kinetic and positive field energy without the coupling term creates a fake conservation discrepancy. Conversely, claiming field energy alone is exactly conserved while matter accelerates would also be wrong.

## 3. Numerics and algorithm

1. Use NumPy 1D real-valued arrays for the field and its conjugate momentum; a periodic FFT grid computes derivatives and the Gaussian-convolved source density.
2. Use continuous particle positions and Fourier phase shifts, avoiding force discontinuities when a particle crosses cell boundaries.
3. Use the *same* Gaussian window for source deposition and particle force gathering. This symmetry is essential for the total momentum ledger.
4. Use the frequency-space derivative but zero the real FFT Nyquist derivative mode so a grid-real field retains a real gradient. This is a numerical implementation choice.
5. Advance the field and bodies with a symmetric half-kick, drift, half-kick (velocity Verlet) splitting of the same Hamiltonian.
6. Recompute field source density and interpolated forces at each time substep. The solver refuses timesteps larger than 35% of the spatial-grid transit time to guard against obvious instability.
7. Sample total energy, free field energy, interaction energy, particle kinetic energy, total momentum, field momentum, particle momentum, force, and receiver location at specified intervals.
8. Check null source coupling, single-charge zero self-acceleration, same-charge attraction, opposite-charge repulsion, reversal on moving the external source from right to left, symmetric cancellation, energy-error convergence and source recoil.

The baseline synthetic configuration is `L=96`, `N=384`, `u=2`, `μ=0.15`, `σ=0.3`, `dt=0.025`. Body 1 begins at `x=0` with mass `1000`, charge `+1`, zero momentum. Body 2 begins at `x=+12`, also with mass `1000`, charge `+1`, zero momentum. Initial φ and π are zero. The external-domain boundary is only the *declared label* `x=8`; the field is computed on both sides. The earliest macroscopic signal travel estimate across 12 units is `12/2 = 6` progression units; finite-width smooth tails give a gradual numerical onset before that estimate. Do **not** call this an exact causal light cone.

Observed baseline: force at T=2 is approximately `-1.33e-10` synthetic units (numerical precursor); at T=5 approximately `2.05e-8`; at T=6 approximately `+0.06264`; at T=7 approximately `+0.11677`. At T=8, receiver mechanical momentum is approximately `+0.23346` and source momentum is approximately `-0.23346`. Energy drift at T=8 with dt=0.025 is approximately `-7.67e-5`, and total momentum residual is below `1e-14` in this execution. These are synthetic unit values, not astronomy.

## 4. How to run

From the project root, with Python 3.10+ and NumPy:

```
python tools/attractive_field_v1.py
python -m unittest discover -s tests -p test_attractive_field_v1.py -v
python -m unittest discover -s tests -v
python tools/validate_package.py
```

The full synthetic event record is at `docs/long-term-memory/research/attractive-field-events.csv`. The plotted figure is at `book/figures/attractive-field-causal.png`. Its caption explicitly says synthetic. For an independent run, vary `dt` from 0.025 to 0.0125 and compare the absolute total-energy error. Check that total momentum stays near machine precision. Then vary source position, source charge, propagation speed and screening range. Preserve the exact program and provenance; do not paste calculation dumps into the R41 report manuscript.

## 5. Causal limitations

A Gaussian does not have compact support. Periodic spectral differentiation is mathematically nonlocal on a finite grid, and tiny numerical field precursors can occur. The **physical** wave equation has finite characteristic speed `u` in the continuum for compact initial data, but the implemented smoothed source and global FFT do not establish an exactly zero signal outside a sharp cone. For that, implement a local-flux finite-volume solver with compact-support deposited sources, prove a discrete front-speed bound and recheck field stress and exact boundary flux.

A one-dimensional scalar field is not the observed four-dimensional gravitational interaction. The software treats the field as a candidate physical mediator while coordinates remain non-material. Its fully closed energy accounting does not establish that a hypothetical scalar charge exists. A nonrelativistic source/receiver model does not predict photon trajectories or black-hole horizons.

## 6. Exterior-domain geometry to investigate next

A symmetric source distribution can cause zero force at the exact center and nonzero force away from it. A finite-range scalar interaction therefore permits an **external source dependence** different from inverse-square shell cancellation in certain idealized geometries. The one-dimensional experiment is not a substitute for a three-dimensional spherical shell calculation with moving sources. Any attempt to represent the wall as a material interface must add its own mass, momentum, stress, energy and coupling terms. For asymmetric neighboring matter, distinguish common center-of-mass acceleration from observable differential tidal gradients.

## 7. Source and model provenance

The physical observation ledger is `docs/long-term-memory/research/attractive-field-ledger.md`. Primary external references are listed in the full R41 report. Historical published scalar fifth-force work provides theoretical context and laboratory constraints, not confirmation of the new ArcSecs candidate. A future empirical fit must use real instrument data, prior parameter registration, frozen parameters, and a truly independent holdout; no such fit was performed in this study.
