'use strict';

const scenarioCatalog = Object.freeze([
  'relationalLattice',
  'absoluteTimeQuantumOscillator',
  'massivePhotonLensing',
  'newtonianDarkStar',
  'superluminalGalilean',
  'tiredLightEnergyLedger',
  'darkMatterCondensate',
  'darkMatterRamjet',
  'parallaxCalibration'
]);

function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, Number(value))); }

class ValidationLab {
  calibrateArcsecondParsec(baselineAu, parallaxArcseconds) {
    const safeBaselineAu = Math.max(0.000001, Number(baselineAu));
    const safeArcseconds = Math.max(0.000001, Number(parallaxArcseconds));
    const radians = safeArcseconds / 206264.80624709636;
    const parsecs = safeBaselineAu / safeArcseconds;
    return { baselineAu: safeBaselineAu, parallaxArcseconds: safeArcseconds, radians, parsecs, passed: Math.abs(parsecs - 1) < 0.000001 && Math.abs(safeArcseconds - 1) < 0.000001 };
  }

  run(input) {
    const calibration = this.calibrateArcsecondParsec(1, 1);
    const initialEnergy = Math.max(0, Number(input.initialEnergy));
    const currentEnergy = Math.max(0, Number(input.currentEnergy));
    const ledgerGain = Math.max(0, Number(input.ledgerGain));
    const energyLost = Math.max(0, initialEnergy - currentEnergy);
    const finiteTelemetryPassed = Array.from(input.finiteSamples || []).every((value) => Number.isFinite(Number(value)));
    const ledgerClosureError = Math.abs(initialEnergy - ledgerGain - currentEnergy);
    const energyLedgerScore = clamp(1 - ledgerClosureError / Math.max(1, initialEnergy), 0, 1);
    const warningPenalty = Math.min(0.6, Math.max(0, Number(input.warningCount || 0)) * 0.08);
    const stabilityScore = finiteTelemetryPassed ? clamp(energyLedgerScore - warningPenalty, 0, 1) : 0;
    const riskScore = clamp(1 - stabilityScore + warningPenalty, 0, 1);
    const ledger = {
      finiteTelemetryPassed,
      ledgerClosureError,
      energyLedgerScore,
      stabilityScore,
      riskScore,
      failedReason: !finiteTelemetryPassed ? 'Non-finite telemetry sample detected.' : ledgerClosureError > 0.000001 ? 'Energy ledger did not close within tolerance.' : Number(input.warningCount || 0) > 0 ? 'Scenario has active warning conditions.' : 'All stability checks passed.'
    };
    const checks = [
      this.check('Arcsecond / parsec calibration', calibration.passed, '1 AU at 1 arcsecond equals 1 parsec', calibration.parsecs.toFixed(6) + ' parsec', 'Calibration drifted away from the ArcSecs angular benchmark.'),
      this.check('Photon energy ledger closure', Math.abs(energyLost - ledgerGain) <= 0.000001 && ledger.ledgerClosureError <= 0.000001, 'energy lost equals ledger gain', 'lost=' + energyLost.toFixed(6) + '; ledger=' + ledgerGain.toFixed(6), 'Energy disappeared or appeared without a substrate ledger entry.'),
      this.check('Deterministic replay', String(input.replaySignatureA) === String(input.replaySignatureB), 'same seed and ticks produce identical signature', String(input.replaySignatureA) + ' / ' + String(input.replaySignatureB), 'The scenario is not deterministic under fixed-step replay.'),
      this.check('Fixed-step clock', Number(input.tickCount) >= Number(input.renderFrameCount) || Number(input.renderFrameCount) === 0, 'physics ticks are counted separately from render frames', 'ticks=' + Number(input.tickCount || 0) + '; frames=' + Number(input.renderFrameCount || 0), 'Render frames appear to be driving physics state directly.'),
      this.check('Finite telemetry', ledger.finiteTelemetryPassed, 'all sampled values are finite', ledger.failedReason, 'A non-finite value reached the validation lab.'),
      this.check('Scenario registered', scenarioCatalog.includes(String(input.scenario)), 'scenario has catalog entry and assumption boundary', String(input.scenario), 'The active scenario is missing from the assumption-aware catalog.')
    ];
    const passedCount = checks.filter((item) => item.passed).length;
    const failedCheckText = checks.filter((item) => !item.passed).map((item) => item.name + ': ' + item.failureReason).join(' ') || 'All validation lab checks passed.';
    return { scenario: String(input.scenario), arcsecondCalibration: calibration, ledger, checks, validationScore: passedCount / Math.max(1, checks.length), failedCheckText, speculativeBoundary: 'Conceptual diagnostic, not measured physical performance or proof of the ArcSecs speculative model.' };
  }

  check(name, passed, expected, actual, failureReason) { return { name, passed, expected, actual, failureReason: passed ? '' : failureReason }; }
}

module.exports = { ValidationLab };
