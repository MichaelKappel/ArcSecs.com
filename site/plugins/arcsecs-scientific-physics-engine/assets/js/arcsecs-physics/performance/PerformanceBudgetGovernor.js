'use strict';

function clamp(value, minimum, maximum) {
  const numeric = Number(value);
  return Math.min(maximum, Math.max(minimum, Number.isFinite(numeric) ? numeric : minimum));
}

class PerformanceBudgetGovernor {
  evaluate(input) {
    const requestedPhotonPacketCount = clamp(Math.round(Number(input.requestedPhotonPacketCount || 0)), 8, 2500);
    const frameBudgetMs = Math.max(0, Number(input.estimatedFrameBudgetMs || 0));
    const viewportWidthPixels = Math.max(1, Number(input.viewportWidthPixels || 1));
    const devicePixelRatio = clamp(Number(input.devicePixelRatio || 1), 0.5, 4);
    const warningCount = Math.max(0, Math.round(Number(input.warningCount || 0)));
    const reasons = [];
    let riskLevel = 'low';
    if (frameBudgetMs > 12 || requestedPhotonPacketCount > 1600 || devicePixelRatio > 2.5) {
      riskLevel = 'high';
    } else if (frameBudgetMs > 8 || requestedPhotonPacketCount > 900 || viewportWidthPixels < 760 || warningCount > 2) {
      riskLevel = 'medium';
    }
    if (frameBudgetMs > 12) { reasons.push('frame budget above 12 ms'); }
    if (requestedPhotonPacketCount > 1600) { reasons.push('dense photon packet request'); }
    if (viewportWidthPixels < 760) { reasons.push('compact viewport'); }
    if (devicePixelRatio > 2.5) { reasons.push('high device pixel ratio'); }
    if (warningCount > 2) { reasons.push('active warning load'); }
    if (Boolean(input.prefersReducedMotion)) { reasons.push('reduced-motion preference'); }
    let recommendedPhotonPacketCount = requestedPhotonPacketCount;
    let recommendedTrailLength = 96;
    let telemetryUpdateHz = 12;
    let visualEffectLevel = 'full';
    if (riskLevel === 'medium') {
      recommendedPhotonPacketCount = Math.min(recommendedPhotonPacketCount, 900);
      recommendedTrailLength = 48;
      telemetryUpdateHz = 8;
      visualEffectLevel = 'reduced';
    }
    if (riskLevel === 'high') {
      recommendedPhotonPacketCount = Math.min(recommendedPhotonPacketCount, 512);
      recommendedTrailLength = 24;
      telemetryUpdateHz = 5;
      visualEffectLevel = 'minimal';
    }
    if (Boolean(input.prefersReducedMotion)) {
      recommendedPhotonPacketCount = Math.min(recommendedPhotonPacketCount, 256);
      recommendedTrailLength = 12;
      telemetryUpdateHz = 4;
      visualEffectLevel = 'minimal';
    }
    const benchmarkStatusText = riskLevel === 'low'
      ? 'Interactive budget nominal.'
      : riskLevel === 'medium'
        ? 'Reduced visual density recommended before recording or public demos.'
        : 'Graceful degradation required: lower photon count, shorter trails, and minimal pulses.';
    return {
      requestedPhotonPacketCount,
      recommendedPhotonPacketCount,
      recommendedTrailLength,
      telemetryUpdateHz,
      visualEffectLevel,
      riskLevel,
      workerIsolationRequired: true,
      degradationReasons: reasons,
      benchmarkStatusText
    };
  }
}

module.exports = { PerformanceBudgetGovernor };
