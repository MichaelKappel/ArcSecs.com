'use strict';

function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, Number(value))); }

const scenarioAssumptions = Object.freeze({
  relationalLattice: ['absolute time', 'no physical spacetime fabric'],
  absoluteTimeQuantumOscillator: ['absolute time', 'mechanical oscillator retardation'],
  massivePhotonLensing: ['massive photon', 'flat-space lensing', 'Proca-style dispersion'],
  newtonianDarkStar: ['Newtonian dark star', 'massive photon'],
  superluminalGalilean: ['Galilean superluminal kinematics', 'absolute time'],
  tiredLightEnergyLedger: ['tired-light attenuation', 'energy ledger substrate'],
  darkMatterCondensate: ['dark-light condensate', 'tired-light attenuation'],
  darkMatterRamjet: ['ramjet harvest model', 'tired-light attenuation', 'dark-light condensate'],
  parallaxCalibration: ['absolute time']
});

const assumptionRows = Object.freeze([
  ['Absolute time', 'implementation', 'The fixed engine tick is shared by every local probe.'],
  ['No physical spacetime fabric', 'speculative', 'Rendered coordinates are labels; relationships define the simulated structure.'],
  ['Massive photon', 'high-risk', 'Photon packets receive a configurable non-zero mass or coupling proxy.'],
  ['Tired-light attenuation', 'high-risk', 'Photon energy is reduced over distance and must be accounted for in a ledger.'],
  ['Galilean superluminal kinematics', 'high-risk', 'Relative velocity is simple vector arithmetic with no Lorentz limiter.'],
  ['Newtonian dark star', 'speculative', 'Capture is framed with escape velocity rather than an event-horizon spacetime description.'],
  ['Proca-style dispersion', 'speculative', 'Frequency-dependent effective photon velocity is exposed as a comparison branch.'],
  ['Dark-light condensate', 'high-risk', 'Ledgered tired-light energy is visualized as a halo-like condensate.'],
  ['Ramjet harvest model', 'high-risk', 'A spacecraft pipeline harvests, buffers, converts, rejects heat, and emits a thrust proxy.']
]);

class AssumptionLadder {
  build(scenario, energyLedgerScore, stabilityScore, warningCount) {
    const assumptions = scenarioAssumptions[String(scenario)] || [];
    const rows = assumptionRows.map((item) => {
      const name = item[0];
      const row = name.toLowerCase();
      const active = assumptions.some((assumption) => {
        const value = String(assumption).toLowerCase();
        return value.includes(row) || row.includes(value) || (row === 'absolute time' && value.includes('mechanical oscillator'));
      });
      return { name, active, level: item[1], explanation: item[2] };
    });
    const activeCount = rows.filter((row) => row.active).length;
    const assumptionLoad = activeCount / rows.length;
    const normalizedStability = clamp(stabilityScore, 0, 1);
    const riskScore = clamp(1 - normalizedStability + assumptionLoad * 0.35 + Math.min(0.25, Number(warningCount || 0) * 0.05), 0, 1);
    return {
      scenario: String(scenario),
      rows,
      scorecard: {
        energyLedgerScore: clamp(energyLedgerScore, 0, 1),
        stabilityScore: normalizedStability,
        riskScore,
        assumptionLoad,
        standardModelComparisonWarning: activeCount > 0 ? 'Alternative hypothesis mode: compare against standard reference baselines before interpreting the visual.' : 'Reference/control mode.',
        speculativeBoundaryLabel: 'ArcSecs speculative model — mathematical sandbox, not proof or measured engineering performance.'
      }
    };
  }
}

module.exports = { AssumptionLadder };
