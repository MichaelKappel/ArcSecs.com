'use strict';

class RuntimeReadinessAudit {
  constructor() {
    this.requiredControls = Object.freeze(['run', 'playPause', 'step', 'reset', 'scenario', 'benchmark', 'commandPalette', 'guidedDemo']);
    this.requiredScenarioKeys = Object.freeze(['relationalLattice', 'absoluteTimeQuantumOscillator', 'massivePhotonLensing', 'newtonianDarkStar', 'superluminalGalilean', 'tiredLightEnergyLedger', 'darkMatterCondensate', 'darkMatterRamjet', 'parallaxCalibration']);
    this.requiredFailureModes = Object.freeze(['micrometeorBurst', 'solenoidQuench', 'radiatorPanelLoss', 'bufferSaturation', 'bufferDecoherence', 'wideExhaust', 'shieldOverload']);
    this.requiredStatusTexts = Object.freeze(['Idle', 'Running', 'Paused', 'Stepping', 'Warning', 'Failed validation']);
  }

  audit(input) {
    const presentControls = new Set(input.presentControls || []);
    const presentScenarioKeys = new Set(input.presentScenarioKeys || []);
    const presentFailureModes = new Set(input.presentFailureModes || []);
    const visibleStatusTexts = new Set(input.visibleStatusTexts || []);
    const missingControls = this.requiredControls.filter((item) => !presentControls.has(item));
    const missingScenarios = this.requiredScenarioKeys.filter((item) => !presentScenarioKeys.has(item));
    const missingFailureModes = this.requiredFailureModes.filter((item) => !presentFailureModes.has(item));
    const missingStatusTexts = this.requiredStatusTexts.filter((item) => !visibleStatusTexts.has(item));
    const checks = [
      this.check('Core controls exposed', missingControls.length === 0, missingControls.length === 0 ? 'all required controls are present' : missingControls.join(', ')),
      this.check('Prompt scenarios exposed', missingScenarios.length === 0, missingScenarios.length === 0 ? '1-9 scenario set is present' : missingScenarios.join(', ')),
      this.check('Failure injections exposed', missingFailureModes.length === 0, missingFailureModes.length === 0 ? 'all ramjet failures are present' : missingFailureModes.join(', ')),
      this.check('Status language visible', missingStatusTexts.length === 0, missingStatusTexts.length === 0 ? 'all status states are text-visible' : missingStatusTexts.join(', ')),
      this.check('Canvas accessible name', Boolean(input.canvasHasAccessibleName), Boolean(input.canvasHasAccessibleName) ? 'canvas has surrounding accessible text' : 'canvas label is missing'),
      this.check('Keyboard shortcuts documented', Boolean(input.keyboardShortcutsDocumented), Boolean(input.keyboardShortcutsDocumented) ? 'keyboard reference is present' : 'keyboard reference is missing'),
      this.check('Speculative boundary visible', Boolean(input.speculativeBoundaryVisible), Boolean(input.speculativeBoundaryVisible) ? 'scientific boundary language is present' : 'boundary language is missing')
    ];
    const passedCount = checks.filter((item) => item.passed).length;
    const score = passedCount / Math.max(1, checks.length);
    const status = score === 1 ? 'pass' : score >= 0.75 ? 'warning' : 'failed';
    const summary = status === 'pass'
      ? 'Runtime shell is ready: controls, scenarios, failures, status text, accessibility, and speculative boundary are visible.'
      : 'Runtime shell needs review: ' + checks.filter((item) => !item.passed).map((item) => item.label).join('; ');
    return { status, score, missingControls, missingScenarios, missingFailureModes, checks, summary };
  }

  check(label, passed, detail) { return { label, passed, detail }; }
}

module.exports = { RuntimeReadinessAudit };
