"use strict";

const scenarioAssumptionMap = Object.freeze({
  massivePhotonLensing: Object.freeze(["Massive photon", "Newtonian gravitational acceleration", "Flat-space lensing comparison", "Standard GR reference baseline"]),
  tiredLightEnergyLedger: Object.freeze(["Tired-light attenuation", "Photon energy ledger", "Substrate transfer", "Redshift by energy loss"]),
  absoluteTimeQuantumOscillator: Object.freeze(["Absolute time", "Mechanical oscillator damping", "Shared global tick", "Near-mass transition suppression"]),
  newtonianDarkStar: Object.freeze(["Newtonian dark star", "Photon escape threshold", "Massive photon proxy", "No spacetime horizon claim"]),
  superluminalGalilean: Object.freeze(["Galilean vector arithmetic", "No Lorentz factor", "Relative velocity above c", "Absolute time"]),
  darkMatterRamjet: Object.freeze(["Ramjet harvest model", "Tired-light substrate", "Thermal bottleneck", "Speculative propulsion ledger", "Failure injection"]),
  darkMatterCondensate: Object.freeze(["Dark-light condensate", "Tired-light ledger pooling", "Halo density proxy", "Speculative dark sector visualization"]),
  parallaxCalibration: Object.freeze(["Arcsecond calibration", "AU baseline", "Parsec benchmark", "Validation lab"]),
  relationalLattice: Object.freeze(["Relational links", "Flat coordinate labels", "No physical spacetime fabric"])
});
function uniqueLimited(values, maximumCount) { const selectedValues = []; values.forEach((value) => { if (value.length > 0 && selectedValues.indexOf(value) === -1 && selectedValues.length < maximumCount) { selectedValues.push(value); } }); return Object.freeze(selectedValues); }
function finiteNumber(value, fallback) { const numericValue = Number(value); return Number.isFinite(numericValue) ? numericValue : fallback; }
function riskFromLoad(load, warnings) { if (load >= 5 || warnings >= 3) { return "high"; } if (load >= 3 || warnings > 0) { return "medium"; } return "low"; }
function higherRisk(left, right) { const order = { low: 1, medium: 2, high: 3 }; return order[right] > order[left] ? right : left; }
class ExperimentComparisonWorkbench {
  normalizeSelection(presetIds, availablePresets) { const availableIds = availablePresets.map((preset) => preset.presetId); const filteredIds = presetIds.filter((presetId) => availableIds.indexOf(presetId) >= 0); if (filteredIds.length > 0) { return uniqueLimited(filteredIds, 4); } return uniqueLimited(availableIds.slice(0, 3), 4); }
  buildComparison(selectedPresetIds, availablePresets, activeConfig, grandTour = null) {
    const selectedIds = this.normalizeSelection(selectedPresetIds, availablePresets);
    const rows = selectedIds.map((presetId) => {
      const preset = availablePresets.find((candidate) => candidate.presetId === presetId) || availablePresets[0];
      const stageRow = grandTour && grandTour.rows ? grandTour.rows.find((row) => row.scenario === preset.scenario) : undefined;
      const changedParameters = {};
      Object.keys(preset.parameters).forEach((parameterName) => { if (activeConfig[parameterName] !== preset.parameters[parameterName]) { changedParameters[parameterName] = preset.parameters[parameterName]; } });
      const assumptions = scenarioAssumptionMap[preset.scenario] || Object.freeze(["Speculative ArcSecs assumption set"]);
      const warningCount = finiteNumber(stageRow ? stageRow.warningCount : 0, 0);
      const assumptionRisk = riskFromLoad(assumptions.length, warningCount);
      const validationScore = finiteNumber(stageRow ? stageRow.validationScore : 0, 0);
      const stageStatus = stageRow && stageRow.status ? stageRow.status : "not-yet-run";
      return Object.freeze({ presetId: preset.presetId, title: preset.title, scenario: preset.scenario, audience: preset.audience, question: preset.question, expectedSignal: preset.expectedResult, highlightedParameters: preset.highlightedParameters.slice(), changedParameters: Object.freeze(changedParameters), assumptionLoad: assumptions.length, assumptionRisk, stageStatus, validationScore, warningCount, recommendation: stageStatus === "pass" ? "Good comparison candidate; keep the speculative boundary visible." : "Run this recipe before presenting it as part of a comparison bundle." });
    });
    const scenarios = uniqueLimited(rows.map((row) => row.scenario), rows.length);
    const summary = Object.freeze({ presetCount: rows.length, scenarioCount: scenarios.length, highestRisk: rows.reduce((risk, row) => higherRisk(risk, row.assumptionRisk), "low"), warningCount: rows.reduce((total, row) => total + row.warningCount, 0), passCount: rows.filter((row) => row.stageStatus === "pass").length, visitorSummary: "Compare selected recipes side by side, then run the ones with the clearest visible signal before sharing screenshots.", physicistSummary: "Comparison rows expose assumption load, validation status, warnings, and parameter deltas so speculative claims remain auditable." });
    return Object.freeze({ packetType: "ArcSecs Experiment Comparison Workbench", generatedUtc: new Date().toISOString(), selectedPresetIds: selectedIds, rows: Object.freeze(rows), summary, exportContainsExecutableCode: false, scientificBoundary: "Experiment comparisons are inert recipe summaries for the ArcSecs speculative sandbox; they do not prove the underlying physics model." });
  }
}
module.exports = { ExperimentComparisonWorkbench };
