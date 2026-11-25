# R40 — Finite-speed messenger: mathematical and reproduction companion

**Status:** synthetic, nonrelativistic, first-contact event model; NOT a detected gravitational carrier, genuine photon simulation, or a universe/bubble observation. All actual derivations and calculations belong HERE rather than in the export-friendly R40 paper.

## Physics and conservation contract

A source of mass `M` and initial velocity `v_s` stores a physical carrier of mass `m`, initially moving with that source. Its internal reservoir has energy `U`. A launch sets the carrier's outgoing velocity to `v_c = v_s + u`, with chosen relative launch speed `u`. The source recoils according to

`v_s_new = v_s - (m/M)*(v_c-v_s)`.

The carrier exists BEFORE launch and is included in initial mass and momentum; it is not spontaneously manufactured. The reservoir pays the increase in particle kinetic energy:

`U_new = U - [ M*(v_s_new^2-v_s^2)/2 + m*(v_c^2-v_s^2)/2 ]`.

At launch and every subsequent event, the modeled totals are

`P = sum_all_bodies(M_i*v_i) + sum_all_carriers(m_j*v_j)`

`E = sum_all_bodies(M_i*v_i^2/2 + U_i) + sum_all_carriers(m_j*v_j^2/2)`.

A mass `m` carrier with precontact speed `u` and receiver of mass `M` with precontact speed `v` interact elastically in one dimension:

`u_after = ((m-M)*u + 2*M*v)/(m+M)`

`v_after = (2*m*u + (M-m)*v)/(m+M)`.

These rules preserve total kinetic energy and momentum exactly in algebra. Between local events, all modeled positions evolve linearly with velocities under a single progression index T. The contact time solves relative physical motion and is **not** assigned by a mystical global action or instantaneous force. No spacetime or spatial substance is a participant. IMPORTANT: this is a toy and the velocity formula is not the high-speed physical photon scattering law.

The code is located at `tools/causal_messenger_v1.py`. It generates `docs/long-term-memory/research/causal-carrier-benchmarks.csv` and `causal-carrier-events.json`. The report itself is plain Markdown with no equations, code blocks or data:image objects.

## Chosen synthetic configuration — not astronomical parameter values

| Item | Position | Initial velocity | Mass | Source reserve | Relative launch speed |
| --- | ---: | ---: | ---: | ---: | ---: |
| Internal source | -10 | 0 | 20 | 2 | +2 |
| Receiver | 0 | 0 | 3 | 0 | none |
| External bubble *candidate* | +18 | -0.08 | 40 | 2 | -2 |
| Preexisting internal carrier | -10 | 0 | 0.20 | counted in source system | +2 |
| Preexisting external carrier | +18 | -0.08 | 0.16 | counted in exterior system | -2 |

All quantities are dimensionless modeling units. There is no claim that these are properties of another universe or actual signal masses. The first carrier arrives at T=5.00000. The external carrier encounters the receiver at approximately T=8.261803 after the receiver's first impulse changes its trajectory. The internal-only receiver final velocity is +0.25. When the external carrier also interacts, the receiver's final velocity is approximately +0.01405063. An incoming momentum packet from the right reduces the receiver's rightward velocity; **it does not constitute an attractive pull toward the right-hand source**. Conservation is evaluated against the explicitly stored initial ledger in both scenarios.

## Reproduce exactly

1. Extract the ZIP's `ArcSecs/` folder into a short location such as `C:\ArcSecs`.
2. Install Python 3.10 or later. No third-party Python packages, GPUs, telescope accounts or licensed solvers are needed.
3. From the `ArcSecs` root run `python tools/causal_messenger_v1.py`.
4. Inspect `docs/long-term-memory/research/causal-carrier-benchmarks.csv` and `causal-carrier-events.json`. Both are **synthetic program outputs**, not real data.
5. Run `python -m unittest discover -s tests -p test_causal_messenger_v1.py -v` for the focused checks.
6. Run `python -m unittest discover -s tests -v` and `python tools/validate_package.py` for the full UAIX handoff.
7. To study a changed bubble-source motion, edit `Exchange.__init__`'s external source velocity and the stored carrier's corresponding initial velocity consistently; rerun. To study different launch speeds, adjust the `launch` calls while retaining adequate reservoir energy. Retest source recoil and arrival chronology.
8. The program stops at T=9.5, before either reflected carrier can contact a source again. Any extension beyond that point MUST add further collision targets or stop calling the implementation a complete physical interaction simulator.

## Scientific interpretation and future field transport

- **What is mathematically checked:** exact local impulse/energy bookkeeping; finite messenger propagation; both source recoils; delayed receiver response; distinction between internal-only and an additional exterior signal; event chronology.
- **What is not calculated:** real gravitational photon bending, continuously propagating scalar/tensor fields, source-field radiation reaction, a photon’s invariant rest mass, redshift law, atomic-clock rate shifts, shell attraction, actual space-wide causality or bubble cosmology.
- **What is needed for an attractive field:** an independent physical action; source-to-field and field-to-receiver energy/momentum flux; stress contribution with correct sign; a finite field propagation speed; stable 3-D numerical scheme; a frozen coupling coefficient and real observations held out of calibration.
- **Why observational data remain authoritative:** the synthetic code has no telescope inputs. Test a future candidate against spacecraft/radio, VLBI, gravitational-wave/gamma-ray timing, and force-search measurements. Published model-fit parameters are not themselves raw instrument signals.

## Specific sources

- Bertotti, Iess & Tortora (2003), Cassini radio links: https://doi.org/10.1038/nature01997
- LIGO/Virgo et al. (2017), GW170817 and GRB 170817A: https://dcc.ligo.org/LIGO-P1700308/public
- Kapner et al. (2007), inverse-square force tests: https://doi.org/10.1103/PhysRevLett.98.021101
- Bothwell et al. (2022), atomic oscillator frequency gradient: https://doi.org/10.1038/s41586-021-04349-7
- Goldhaber & Nieto (2010), photon rest-mass limits: https://doi.org/10.1103/RevModPhys.82.939
- R38 physical-entity ontology, R39 reciprocal static exchange, R07–R09/R33–R34 bubble dynamics, all under `docs/long-term-memory/reports/`.

**Human review and reproducibility warning:** matching synthetic ledger totals demonstrates only that the rules and implementation are internally consistent. The model must not be described as a new empirical discovery, a field theory, an actual photon or experimental proof of the ArcSecs premises.
