# A-05j bounded source/atom reproducibility record

Inputs: dimensionless preferred-frame matched massive vector; fixed homogeneous electrostatic coefficients; Gaussian mode smoothing and Coulombic one-electron central potential.

Files: `atomic_grid_convergence.csv`, `yukawa_atomic_line_benchmark.csv`, `mode_charge_continuity.csv`. These are *not* a dynamic 3D charged-field simulation, observed spectra or a validated photon-mass measurement. The finite-grid convergence shown concerns only the **static radial eigenvalue** subproblem, not the Chapter 30K receiver response.

Run: `python tools/massive_charge_atom_v1.py`, then `python -m unittest discover -s tests -q`.
