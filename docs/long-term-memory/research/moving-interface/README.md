# ArcSecs Chapter 30H — moving slab and coupled electromagnetic/scalar waves

The novel code, numbers, figures and mathematical derivation in this folder are self-contained **dimensionless synthetic research**, not measured evidence of cosmic scalar fields or a new photon mass. The twelve-principle project charter remains authoritative.

- `run_summary.json` has exact initial/final energy and momentum budgets, maximum drift statistics, slab trajectory and WKB ray diagnostics for five controlled starting conditions.
- `<condition>_budgets.csv` records the time series for material, scalar, electromagnetic, total energy and canonical total momentum.
- `<condition>_ray.csv` records the calculated WKB ray path and change in log frequency along the same dynamically evolved scalar field.
- `moving_plus_final_profile.csv` is the final field/density profile from the main run.
- `tools/moving_interface_v1.py` (under workspace root) contains the Hamiltonian equations and the reproducible generator; `tools/plot_moving_interface_v1.py` reproduces the plotted figures.
- `tests/test_moving_interface_v1.py` contains mathematical and computational regressions.

Run from the ArcSecs root: `python tools/moving_interface_v1.py --output-dir docs/long-term-memory/research/moving-interface` and `python tools/plot_moving_interface_v1.py --output-dir docs/long-term-memory/research/moving-interface --figure-dir book/figures`. Then run `python -m unittest discover -s tests -p 'test_*.py'` and `python tools/validate_package.py`.

**Important limitations:** Moving neutral rigid density is represented by a collective coordinate, not charged particles or a deformable continuum. WKB frequency changes do not equal calibrated atomic redshifts. There is no observational holdout and no claim of verified astronomical photon slowing. The full local stress and charge-carrier dynamics remain future work.
