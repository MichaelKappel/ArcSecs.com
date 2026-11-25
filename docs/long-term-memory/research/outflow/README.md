# Chapter 32A — Physical outflow and the telescope

Independent bounded extension of D-04 and T-03, integrated edition. No observational fit or self-consistent matter dynamics. Prescribed S=exp(H T), constant C and gap, stable source/receiver standards, isotropic straight rays and no bath. The coordinate Hamiltonian is omega = H x dot k + sqrt(C² k² + Omega²). K=S k is conserved; fixed emission frequency means K_e changes between emissions. The exact arrival relation W_a=W_e-H K_e chi, and A=1+W_a(W_e-W_a)/(W_a²-Omega²), yield A>Z_E at positive redshift and positive gap. In the zero-gap control A=Z_E and the unit-survival optical duality ratio is 1. For the finite-gap cases, angle/flux distances are model-defined under the geometry assumptions. No imposed distance compression.

## Reproduce
From the archive root: `python tools/entrained_outflow_v1.py`; then `python -m unittest discover -s tests -p test_entrained_outflow_v1.py -q`. The `scan.csv` contains 24 cases at H=.2, C=W_e=1, emission time 0; gap fractions 0, .001, .01, .1, .2, .3, target z .1, .5, 1, 2. Maximum exact-vs-quadrature arrival discrepancy 1.34115e-13; maximum finite-difference timing derivative discrepancy 5.50039e-9. All nine new tests passed. Target redshifts select separations, not fitted observations. Figure in the manuscript. Chapter 32A contains derivations and assumptions.

## Open gates
Derive outflow, scalar field and matter clocks from action; close backreaction ledger; handle nonuniform optics and a reciprocal bath. Calibrate independently before using data. This is not the planned Chapter 30T vector–bath calculation. The original 28 source claims and line ledger have not been changed.
