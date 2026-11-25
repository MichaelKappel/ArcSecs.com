# R39 source, observation, model and test ledger

**Authority:** reviewed integration proposal (not a primary observational study). Its full manuscript is [R39](../reports/R39.md).

## Explicit epistemic categories

| Claim / term | Category | Source / tool | Disposition |
| --- | --- | --- | --- |
| Photon recoil transfers mechanical momentum | Measurement in electromagnetic interactions | Barnett 2010 and recoil experiments; R31 | Observation retained; gravitational carrier separate |
| Solar-grazing light rays exhibit deflection around 1.75 arcseconds | Astronomical measurement / calibrated inferred angle | Modern Eddington 2024; solar VLBI | Data constraint, not unique mechanism |
| Cassini gamma departure `(2.1 +/- 2.3) x 10^-5` | Fit to experimental Doppler telemetry under a stated model | Bertotti, Iess & Tortora 2003 | Model-derived parameter; cite instrument methods |
| Source and photon receive equal and opposite momentum in R39 | Consequence of invented Hamiltonian | photon_exchange_v1.py and tests | Synthetic mathematical success, not detection |
| Total photon+source energy is conserved in R39 | Consequence of time-independent Hamiltonian | `tests/test_photon_exchange_v1.py` | Synthetic mathematical success; field energy not implemented |
| eta=2 gives standard leading light deflection | Parameter calibration to known benchmark | methods and benchmark CSV | Input calibrated, not independently predicted |
| A finite-speed gravitational carrier exists with the specified law | Research conjecture | Next UPM work | Missing: no implemented field action or detection |
| Nonzero photon **invariant rest mass** detected | Not established | Goldhaber & Nieto 2010, PDG; R30, R31 | Experimental upper limits, not positive discovery |
| Constant universal progression T | ArcSecs premise | `.uai/totem.uai` | Working framework; not independently measured |
| A neighboring bubble exerts a causal pull | ArcSecs research conjecture | R07-R09, R33-R34 | Requires moving-source/carrying-field model and observations |

## Next bounded action

Replace the instantaneous potential with an explicitly propagating, energy-and-momentum-carrying physical field. Track field stress/impulse in transit, source emission, receiver absorption, speed limits and energy conservation. Freeze any additional coefficient before analyzing a held-out real VLBI/Cassini subset. Do not silently introduce a material spacetime substrate as a cause. Do not infer nonzero photon invariant rest mass solely from gravitational deflection.
