# A-05f classical charged emitter–receiver synthetic dataset

The source code is `tools/charged_emitter_receiver_v1.py`; the 22 regression checks are in `tests/test_charged_emitter_receiver_v1.py`. Six controlled time histories and the baseline initial scalar profile are CSV files, with exact parameters and summary statistics in `run_summary.json`. All numerical quantities are dimensionless.

Model constraints: fixed positive support sites, mobile transverse charges, scalar-modulated classical Coulomb-like well, reduced Maxwell transverse wave, feedback on scalar and total energy conservation. No closed longitudinal momentum, quantum atomic spectra, rest-photon-mass calculation or observed cosmic field is claimed. Original archived sources remain byte-identical.

Reproduction:

```sh
python tools/charged_emitter_receiver_v1.py --output-dir docs/long-term-memory/research/charged-emitter-receiver
python -m unittest discover -s tests -p 'test_*.py' -q
```
