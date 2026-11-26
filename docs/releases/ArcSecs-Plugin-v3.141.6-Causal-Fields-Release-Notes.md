# v3.141.6 — Causal Fields and Reciprocal Source Dynamics

## Scientific scope

Adds a ninth experiment to the cosmic evolution laboratory, implementing the bounded Chapter 30D / R41 source-coupled scalar-field Hamiltonian from BEYOND SPACETIME. This is a conditional, normalized 1D periodic model with a Gaussian source profile, not a cosmic gravitational measurement. The previous eight experiments, including the conventional hot Big Bang reference and the quasistatic moving shell, retain their equations. A physical wall is not assumed to be the observable horizon. No universal redshift law follows from this calculation.

## Governing equations and method

For a scalar field phi with conjugate velocity pi, speed u and gap mu, the Hamiltonian is

    H = sum_i p_i^2/(2 m_i) + integral (pi^2 + u^2 phi_x^2 + mu^2 phi^2)/2 dx - integral rho phi dx
    phi_T = pi
    pi_T = u^2 phi_xx - mu^2 phi + rho
    x_i' = p_i/m_i
    p_i' = q_i integral G_width(x-x_i) phi_x dx
    P_total = sum_i p_i - integral pi phi_x dx

Charge density and force use the same Gaussian smoothing and reciprocal Fourier basis. The browser uses a symmetric real Fourier-Galerkin representation on a periodic domain of length 96, omitting the original FFT grid's unpaired Nyquist mode. This makes all retained gradients and the interaction energy consistent. The zero mode is retained. Kick–drift–kick evolution moves both the particles and the field; no external force or delay curve is imposed. Field energy, interaction energy, particle kinetic energy, particle momentum, field momentum, and total residuals are calculated independently. A moving source is initialized with momentum and subsequently evolves autonomously; it is not held on a prescribed trajectory. Symmetric sources may be enabled as a zero-force control.

The default source is 12 normalized lengths away, u=2, gap=.15, width=.3, both masses=1000, both charges=1, dt=.025, 384 grid-equivalent resolution and duration 8. The nominal initial-separation travel time is 6. This is not a measured arrival time for moving sources. Gaussian tails, Fourier truncation and the periodic domain prohibit a claim of an exactly sharp causal front. No relativistic particle mechanics, 3D field stress, physical wall dynamics, photon coupling or observation fit is included. A finite positive field energy does not itself prove the proposed interaction exists.

## Verification

The reference fixture generator reads the book's original public `tools/attractive_field_v1.py` NumPy FFT implementation and records its SHA-256. Ten trajectories, 33 time samples each, 10 shared quantities per sample, plus terminal source position and momentum, are compared with a mixed absolute/relative 1e-9 tolerance. Includes stationary, moving, mirrored, opposite-charge, zero-coupling, symmetric, slower field, time-refined, asymmetric mass/charge, and wider profile cases. Default force at T=6 is about 0.0626366117366; at T=7 it is about 0.1167710976775. At T=2 absolute force is below 1e-7. Maximum default energy residual about 7.71e-5, momentum residual about 4.34e-16 (normalized units). Halving dt reduces energy residual to about 1.93e-5; moving-source field momentum is nonzero and total momentum remains conserved within the tested tolerance. These are finite numerical results, not exact energy conservation or independent experimental validation.

34 new tests pass. Full gate: 386 JavaScript passes, 58 disclosed historical failures, 0 unexpected failures, 0 missing baseline tests. TypeScript, three PHP test contracts, 12 PHP syntax checks pass. Isolated Chromium harness: all four simulators at 390, 768, 1440 px; nine cosmic modes and ten JSON exports per width, including opposite-charge control; no uncaught errors. No full WordPress integration, GPU hardware test, security audit, or GitHub CI run. Original numerical CSV fixtures unchanged. The strict legacy suite remains failing.

## Install

Replace the plugin using WordPress Plugins > Add New Plugin > Upload Plugin; keep v3.141.0 theme. Back up and stage first. Open /cosmic-evolution-simulator/ and select Causal attractive field. Use JSON evidence export to preserve inputs and all sampled ledgers. The incremental overlay assumes v3.141.5 and retains the existing CI workflow. No automatic deployment or GitHub push.

## Next research gate

Derive a local compact-support causal discretization with flux conservation, then extend to three dimensions and couple a dynamic physical boundary to the same field and particle energy/momentum ledger. Collision mechanics, photon transport, clocks, calibrated astronomical predictions and independent observations remain open. Do not infer a greater cosmos, an exterior wall, or a faster-than-light signal from a successful toy calculation.
