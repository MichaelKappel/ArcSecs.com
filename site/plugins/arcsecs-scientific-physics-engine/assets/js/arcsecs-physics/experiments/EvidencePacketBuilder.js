"use strict";

class EvidencePacketBuilder {
  build(input) {
    const grandExperiment = input.grandExperiment || { stages: [], summary: {} };
    const benchmark = input.benchmark || null;
    const latestResult = input.latestResult || null;
    const stageCount = Array.isArray(grandExperiment.stages) ? grandExperiment.stages.length : 0;
    const passCount = Array.isArray(grandExperiment.stages) ? grandExperiment.stages.filter((stage) => stage.status === "pass").length : 0;
    return {
      engineVersion: input.engineVersion || (grandExperiment.engineVersion || "unknown"),
      generatedUtc: new Date().toISOString(),
      packetType: "ArcSecs Grand Experiment Evidence Packet",
      scientificBoundary: "Speculative research visualization; conceptual diagnostic only; not measured physical performance or proof of an operational drive.",
      visitorSummary: `${passCount}/${stageCount} scripted stages passed the internal evidence checklist.`,
      grandExperiment,
      benchmarkSummary: benchmark ? benchmark.summary : null,
      latestScenario: latestResult && latestResult.config ? latestResult.config.scenario : null,
      latestMetrics: latestResult ? latestResult.metrics : null,
      reproducibility: {
        deterministicTicks: latestResult ? latestResult.acceptedSteps : 0,
        exportContainsExecutableCode: false,
        safeToShareAsData: true
      }
    };
  }
}

module.exports = { EvidencePacketBuilder };
