# Chapter 30Q reproducibility record: stationary screened Stueckelberg boundary

Source model: user-supplied Part XIX massive-vector/Stueckelberg classical action, integrated in Chapter 30L. **No external observations imported or fitted.** Normalized synthetic setting only. Read Chapter 30Q and Appendix W for equations, definitions, numeric approximations, units, gates and limitations.

Files: `summary.json` (coefficients, controls, results, limitations), `scalar_profile.csv` (exact piecewise scalar with static matter profile), `screening_convergence.csv` (independent banded finite-difference check), `mode_spectrum.csv` (12 frequencies in both modes), `scattering_convergence.csv` (fixed physical profile at five grids).

From the workspace root, execute:

```bash
PYTHONPATH=tools python tools/stueckelberg_screened_interface_v1.py --output-dir docs/long-term-memory/research/stueckelberg-screened-interface
python tools/plot_stueckelberg_screened_interface_v1.py --data docs/long-term-memory/research/stueckelberg-screened-interface --figures book/figures
PYTHONPATH=tools python -m unittest tests.test_stueckelberg_screened_interface_v1 -v
```

Scattering uses piecewise-constant transfer matrices and **an independently exact analytic scalar field**, not the gridded scalar solution. Frequency is conserved because coefficients are stationary. The periodic time-domain model is NOT used to fit the scattering answer; it independently checks positive-energy quadratic dynamics with fixed Dirichlet ends. Relative energy drift is a numerical diagnostic, not a measurement of physical losses. The scalar wave and moving matter are not evolved, and so the background **is not a closed matter–radiation energy-momentum theory**.
