'use strict';

function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, Number(value))); }
function primitive(type, id, x, y, radius, label, intensity) { return { type, id, x, y, radius, label, intensity: clamp(intensity, 0, 1) }; }

class ScenarioVisualStateBuilder {
  build(input) {
    const scenario = String(input.scenario || 'relationalLattice');
    const primitives = [];
    const pulse = 0.5 + Math.sin(Number(input.tickCount || 0) / 12) * 0.5;
    const primarySignal = Number.isFinite(Number(input.primarySignal)) ? Number(input.primarySignal) : 0.5;
    const secondarySignal = Number.isFinite(Number(input.secondarySignal)) ? Number(input.secondarySignal) : 0.5;
    const warningCount = Number(input.warningCount || 0);
    const failureMode = String(input.failureMode || 'none');

    if (scenario === 'darkMatterRamjet') {
      primitives.push(primitive('spacecraft', 'ramjet_ship', 38, 0, 30, 'ramjet craft', 1));
      ['EIT scoop', 'intake', 'HIBE shield', 'Fishback solenoid', 'DSP buffer', 'reactor', 'radiator', 'collimated exhaust'].forEach((label, index) => {
        primitives.push(primitive('pipelineStage', 'stage_' + index, -160 + index * 45, index % 2 === 0 ? -32 : 32, 12, label, index < 4 ? primarySignal : secondarySignal));
      });
      if (failureMode !== 'none') { primitives.push(primitive('warningPulse', 'failure_' + failureMode, -24, -72, 24, failureMode, pulse)); }
    } else if (scenario === 'darkMatterCondensate') {
      for (let index = 0; index < 12; index += 1) {
        const angle = index * Math.PI * 2 / 12;
        const radius = 42 + index * 5;
        primitives.push(primitive('halo', 'condensate_' + index, Math.cos(angle) * radius, Math.sin(angle) * radius * 0.65, 8, 'ledger halo', secondarySignal));
      }
    } else if (scenario === 'absoluteTimeQuantumOscillator') {
      primitives.push(primitive('mass', 'central_mass', 0, 0, 34, 'mass field', secondarySignal));
      primitives.push(primitive('oscillator', 'deep_probe', -120, -20, 14, 'deep oscillator', 1));
      primitives.push(primitive('oscillator', 'near_probe', 92, -10, 14, 'near damped oscillator', Math.max(0.2, 1 - secondarySignal)));
    } else if (scenario === 'massivePhotonLensing' || scenario === 'newtonianDarkStar') {
      primitives.push(primitive('mass', 'compact_mass', 0, 0, scenario === 'newtonianDarkStar' ? 46 : 34, 'compact mass', 1));
      primitives.push(primitive('photonTrail', 'photon_path_a', -140, -36, 6, 'curved photon path', primarySignal));
      primitives.push(primitive('photonTrail', 'photon_path_b', -110, 38, 6, scenario === 'newtonianDarkStar' ? 'fallback path' : 'comparison path', secondarySignal));
    } else if (scenario === 'superluminalGalilean') {
      primitives.push(primitive('node', 'body_a', -96 - primarySignal * 8, 0, 16, 'body A', 1));
      primitives.push(primitive('node', 'body_b', 96 + primarySignal * 8, 0, 16, 'body B', 1));
      primitives.push(primitive('edge', 'relative_velocity', 0, 0, 2, 'relative velocity > c', primarySignal));
    } else if (scenario === 'tiredLightEnergyLedger' || scenario === 'parallaxCalibration') {
      primitives.push(primitive('photonTrail', 'ledger_photon', -130, 0, 7, 'photon energy', primarySignal));
      primitives.push(primitive('edge', 'substrate_ledger', 0, 34, 3, 'substrate ledger', secondarySignal));
      primitives.push(primitive('label', 'closure_label', 120, -24, 8, 'ledger closure', 1 - Math.abs(primarySignal - secondarySignal)));
    } else {
      for (let index = 0; index < 8; index += 1) {
        const angle = index * Math.PI * 2 / 8;
        primitives.push(primitive('node', 'node_' + index, Math.cos(angle) * 92, Math.sin(angle) * 58, 10, 'relation node', 1));
        primitives.push(primitive('edge', 'edge_' + index, Math.cos(angle) * 46, Math.sin(angle) * 29, 2, 'solver link', secondarySignal));
      }
    }
    if (warningCount > 0) { primitives.push(primitive('warningPulse', 'warning_bus', 0, -96, 22, failureMode === 'none' ? 'validation warning' : failureMode, pulse)); }
    return { scenario, primitives, centerInstruction: this.instruction(scenario), mustRenderWarning: warningCount > 0 };
  }

  instruction(scenario) {
    if (scenario === 'darkMatterRamjet') { return 'Watch the scoop-to-exhaust pipeline; failure injections must create a visible warning pulse and telemetry change.'; }
    if (scenario === 'absoluteTimeQuantumOscillator') { return 'Compare one global tick with two local oscillator transition counts.'; }
    if (scenario === 'tiredLightEnergyLedger') { return 'Confirm photon energy lost is accounted for by the substrate ledger.'; }
    return 'Run, pause, step, and reset should visibly change this scenario state.';
  }
}

module.exports = { ScenarioVisualStateBuilder };
