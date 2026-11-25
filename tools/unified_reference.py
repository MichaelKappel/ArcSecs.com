#!/usr/bin/env python3
"""ArcSecs UPM-0: inspectable ONE-STATE physical-process simulation scaffold.

This is a toy, NOT a validated replacement for special/general relativity and NOT
an observation of external universes. The parent source is static, photon energy
loss is imposed, and the receiving reservoir is a bookkeeping variable only.

The same external source potential is accessed by matter acceleration, a wall,
a clock-rate ansatz and a photon-loss ansatz. Their coupling constants are NOT
derived from a common first-principles action; the code exposes this missing link.
All inputs and outputs use SI units. Run: python tools/unified_reference.py.
"""
from __future__ import annotations
from dataclasses import dataclass
from math import exp, pi, sqrt
try:
    from .external_coupling import potential, acceleration, C_LIGHT
except ImportError:
    from external_coupling import potential, acceleration, C_LIGHT


@dataclass(frozen=True)
class Parameters:
    shell_radius_m: float
    screening_length_m: float
    external_G: float                 # m^3/(kg s^2); effective coupling, not measured
    shell_source_kg: float
    particle_kg: float
    wall_kg: float
    pressure_delta_pa: float = 0.0    # P_in - P_out
    wall_tension_j_m2: float = 0.0
    clock_hz: float = 1.0             # baseline cycles per universal parameter T
    clock_phi_coupling: float = 0.0   # dimensionless toy parameter
    clock_speed_coupling: float = 0.0 # dimensionless toy parameter
    photon_loss_per_m: float = 0.0   # imposed coefficient; mechanism NOT derived
    photon_phi_coupling: float = 0.0 # dimensionless toy parameter
    photon_rest_kg: float = 0.0       # free Proca dispersion only, no detection

    def validate(self):
        if min(self.shell_radius_m, self.screening_length_m,
               self.particle_kg, self.wall_kg, self.clock_hz) <= 0:
            raise ValueError('positive lengths, masses and clock frequency required')
        if min(self.external_G, self.shell_source_kg,
               self.wall_tension_j_m2, self.photon_loss_per_m,
               self.photon_rest_kg) < 0:
            raise ValueError('negative source/coupling/tension/loss/mass not allowed')


@dataclass
class State:
    T_s: float
    particle_r_m: float
    particle_v_m_s: float
    wall_r_m: float
    wall_v_m_s: float
    clock_cycles: float
    photon_energy_j: float
    sink_energy_j: float = 0.0
    sink_momentum_kg_m_s: float = 0.0
    photon_path_m: float = 0.0


def phi(r: float, p: Parameters) -> float:
    return potential(r, p.shell_radius_m, p.screening_length_m,
                     p.external_G, p.shell_source_kg)


def source_acceleration(r: float, p: Parameters) -> float:
    return acceleration(r, p.shell_radius_m, p.screening_length_m,
                        p.external_G, p.shell_source_kg)


def clock_rate(r: float, v: float, p: Parameters) -> float:
    """Process cycles per T-second, relative to chosen center reference clock.

    This is a first-order ansatz, not a novel experimental derivation. For
    universal couplings, similar observables may be reparametrizations of GR.
    """
    dp = phi(r, p) - phi(0.0, p)
    multiplier = (1.0 + p.clock_phi_coupling * dp / C_LIGHT**2
                  - p.clock_speed_coupling * v*v / (2.0*C_LIGHT**2))
    if multiplier <= 0:
        raise ValueError('clock-rate ansatz became nonphysical')
    return p.clock_hz * multiplier


def photon_momentum(E: float, p: Parameters) -> float:
    rest_E = p.photon_rest_kg * C_LIGHT**2
    if E < rest_E:
        raise ValueError('photon energy below hypothetical rest energy')
    return sqrt(max(0.0, E*E - rest_E*rest_E)) / C_LIGHT


def photon_group_speed(E: float, p: Parameters) -> float:
    """Free Proca dispersion speed. Not an explanation of cosmological redshift."""
    rest_E = p.photon_rest_kg * C_LIGHT**2
    if E <= rest_E:
        if E < rest_E: raise ValueError('photon energy below rest-energy threshold')
        return 0.0
    return C_LIGHT * sqrt(1.0 - (rest_E/E)**2)


def photon_loss_coefficient(r: float, p: Parameters) -> float:
    dphi = (phi(r, p) - phi(0.0, p))/C_LIGHT**2
    return p.photon_loss_per_m * exp(p.photon_phi_coupling * dphi)


def wall_potential(R: float, p: Parameters) -> float:
    return (4*pi*p.wall_tension_j_m2*R**2
            - 4*pi*p.pressure_delta_pa*R**3/3.0
            + p.wall_kg*phi(R,p))


def wall_force(R: float, p: Parameters) -> float:
    return (4*pi*p.pressure_delta_pa*R**2
            - 8*pi*p.wall_tension_j_m2*R
            + p.wall_kg*source_acceleration(R,p))


def total_energy(s: State, p: Parameters) -> float:
    """Static-source toy ledger; missing energy of a DYNAMIC source or field."""
    return (0.5*p.particle_kg*s.particle_v_m_s**2
            + p.particle_kg*phi(s.particle_r_m,p)
            + 0.5*p.wall_kg*s.wall_v_m_s**2
            + wall_potential(s.wall_r_m,p)
            + s.photon_energy_j + s.sink_energy_j)


def step(s: State, p: Parameters, dt_s: float) -> State:
    """Second-order leapfrog for matter/wall, local one-cell photon transport.

    Photon momentum is transferred to an unmodeled sink, without gravitational
    bending, scattering, or feedback. These omissions limit physical validity.
    """
    p.validate()
    if dt_s <= 0 or s.photon_energy_j <= 0:
        raise ValueError('dt and photon energy must be positive')
    if not (0 <= s.particle_r_m < p.shell_radius_m and
            0 < s.wall_r_m < p.shell_radius_m):
        raise ValueError('state must lie inside external shell')
    pr_half = s.particle_v_m_s + 0.5*dt_s*source_acceleration(s.particle_r_m,p)
    wr_half = s.wall_v_m_s + 0.5*dt_s*wall_force(s.wall_r_m,p)/p.wall_kg
    r_new = s.particle_r_m + dt_s*pr_half
    R_new = s.wall_r_m + dt_s*wr_half
    if not (0 <= r_new < p.shell_radius_m and 0 < R_new < p.shell_radius_m):
        raise ValueError('motion left the domain; reduce dt or change boundary model')
    v_new = pr_half + 0.5*dt_s*source_acceleration(r_new,p)
    w_new = wr_half + 0.5*dt_s*wall_force(R_new,p)/p.wall_kg
    # No observed empirical effect: pure test of the configured process ansatz.
    N_new = s.clock_cycles + 0.5*dt_s*(clock_rate(s.particle_r_m,
                                                   s.particle_v_m_s,p)
                                          + clock_rate(r_new,v_new,p))
    # A local one-cell transport update, NOT full radiative transport.
    path_step = photon_group_speed(s.photon_energy_j,p)*dt_s
    kappa = photon_loss_coefficient(s.particle_r_m,p)
    E_new = s.photon_energy_j*exp(-kappa*path_step)
    if E_new < p.photon_rest_kg*C_LIGHT**2:
        raise ValueError('energy reached Proca rest floor: this toy cannot continue')
    transferred_E = s.photon_energy_j - E_new
    transferred_p = (photon_momentum(s.photon_energy_j,p)
                     - photon_momentum(E_new,p))
    return State(s.T_s + dt_s, r_new, v_new, R_new, w_new,
                 N_new, E_new, s.sink_energy_j+transferred_E,
                 s.sink_momentum_kg_m_s+transferred_p,
                 s.photon_path_m+path_step)


def demo():
    # Pure illustrative SI parameters, deliberately NOT claimed as cosmic values.
    p=Parameters(shell_radius_m=8.0, screening_length_m=2.0,
        external_G=1.0, shell_source_kg=3.0, particle_kg=1.0,
        wall_kg=2.0, pressure_delta_pa=0.001, wall_tension_j_m2=0.002,
        clock_hz=1e6, clock_phi_coupling=1.0,
        photon_loss_per_m=1e-10, photon_phi_coupling=1.0)
    s=State(T_s=0.0,particle_r_m=1.0,particle_v_m_s=0.04,
        wall_r_m=2.0,wall_v_m_s=0.0,clock_cycles=0.0,
        photon_energy_j=1e-12)
    E0=total_energy(s,p)
    for _ in range(250):
        s=step(s,p,0.001)
    from dataclasses import asdict
    print('ArcSecs UPM-0 synthetic demonstration, NOT observed cosmology')
    for k,v in asdict(s).items(): print(f'{k}: {v:.12g}')
    print('photon+sink energy drift J:',s.photon_energy_j+s.sink_energy_j-1e-12)
    print('total energy relative drift:',(total_energy(s,p)-E0)/max(abs(E0),1e-100))

if __name__=='__main__':demo()
