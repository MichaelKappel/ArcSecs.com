# ArcSecs A-05j Stage 2A — quantum transverse receiver benchmark

This folder contains **synthetic dimensionless simulations** for Chapter 30N and Appendix T. They demonstrate a cutoff-convergent excitation-versus-detuning curve for a **one-dimensional, transverse-only** massive-vector field coupled to a coherent two-level source, ground-state receiver, mobile neutral centers, and one homogeneous dynamical scalar. This is not a fully gauge-complete 3D massive-vector, dynamic signed-charge, or quantum QED computation.

Inputs: `tools/quantum_receiver_v1.py` is the authoritative executable specification. `tools/plot_quantum_receiver_v1.py` creates three figures using the CSVs. `tests/test_quantum_receiver_v1.py` has 25 project tests including independent Hamiltonian-gradient checks, energy/momentum conservation, Bloch norms and coupling controls.

Data:
- `receiver_spectral_convergence.csv`: seven detunings times four cutoff sizes; every run has the same spatial smearing width sigma=1.5 and the same other declared physical parameters.
- `receiver_controls.csv`: zero source coupling, zero receiver coupling, zero scalar coupling, and narrower physical sampling width.
- `receiver_time_trace.csv`: the zero-detuning N=192 reference trajectory, including scalar, received transverse field, excited probability, local atomic gap and conserved quantities.

**Key success:** the maximum seven-point response difference comparing N=48 with N=192 is below 7.3e-13 absolute, with the Gaussian sampling width held fixed; the peak excitation at zero detuning and N=192 is about 1.17427e-4. **Key caveats:** this success does not repair Chapter 30K's 3D receiver cutoff failure (~25%); narrower Gaussian widths alter the physical response; a pure excited source does not emit spontaneously in this classical-mean-field field scheme.

Scientific source: Chapter 30M's converged static `1s->2p` Yukawa result at s0=0.05, and Part XIX's positive-gap matched transverse dispersion. The off-reference slope is a declared first-order perturbative surrogate, not a dynamically recalculated quantum atomic eigenvalue. Do not cite this run as observational evidence for any ArcSecs cosmological premise.
