"use strict";

const ASSUMPTION_NAMES = Object.freeze([
  "Absolute time",
  "No physical spacetime fabric",
  "Massive photon",
  "Tired-light attenuation",
  "Galilean superluminal kinematics",
  "Newtonian dark star",
  "Dark-light condensate",
  "Ramjet harvest model"
]);

function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, value)); }
function finiteNumber(value, fallback) { return Number.isFinite(Number(value)) ? Number(value) : fallback; }
function rowsFrom(input) { return input && input.grandExperiment && Array.isArray(input.grandExperiment.rows) ? input.grandExperiment.rows : []; }

class ReviewCockpit {
  build(input) {
    const safeInput = input || { engineVersion: "unknown" };
    const rows = rowsFrom(safeInput);
    const summary = safeInput.grandExperiment && safeInput.grandExperiment.summary ? safeInput.grandExperiment.summary : null;
    const stageCount = finiteNumber(summary ? summary.stageCount : undefined, rows.length || 9);
    const passCount = finiteNumber(summary ? summary.passCount : undefined, rows.filter((row) => row.status === "pass").length);
    const passRatio = clamp(passCount / Math.max(1, stageCount), 0, 1);
    const averageValidationScore = finiteNumber(summary ? summary.averageValidationScore : undefined, rows.length ? rows.reduce((total, row) => total + finiteNumber(row.validationScore, 0), 0) / rows.length : 0);
    const warningCount = finiteNumber(summary ? summary.totalWarnings : undefined, rows.reduce((total, row) => total + finiteNumber(row.warningCount, 0), 0));
    const flightRecorder = safeInput.flightRecorder || null;
    const recorderScore = flightRecorder && flightRecorder.exportReady ? 1 : 0.55;
    const latestMetrics = safeInput.latestMetrics || null;
    const ledgerScore = latestMetrics && latestMetrics.ledgerStatus === "pass" ? 1 : latestMetrics && latestMetrics.ledgerStatus === "review" ? 0.72 : 0.62;
    const warningPenalty = clamp(warningCount / Math.max(1, stageCount * 4), 0, 0.22);
    const readinessScore = clamp((averageValidationScore * 0.52) + (passRatio * 0.25) + (recorderScore * 0.13) + (ledgerScore * 0.10) - warningPenalty, 0, 1);
    const reviewStatus = readinessScore >= 0.82 && passRatio >= 0.88 ? "readyWithCaution" : readinessScore >= 0.62 ? "needsReview" : "holdForRevision";
    const weakestPoints = this.buildWeakPoints(rows, summary ? summary.weakestScenario : undefined);
    const assumptionRisks = this.buildAssumptionRisks(readinessScore, warningCount, rows);
    const nextActions = this.buildNextActions(reviewStatus, weakestPoints, latestMetrics, safeInput.guidedTour || null);
    return Object.freeze({
      packetType: "ArcSecs Review Cockpit",
      engineVersion: String(safeInput.engineVersion || "unknown"),
      generatedUtc: new Date().toISOString(),
      reviewStatus,
      readinessScore,
      passRatio,
      publicSummary: this.buildPublicSummary(reviewStatus, passCount, stageCount, safeInput.guidedTour || null),
      physicistSummary: this.buildPhysicistSummary(averageValidationScore, warningCount, weakestPoints),
      weakestPoints,
      assumptionRisks,
      nextActions,
      shareableBoundary: "Speculative research visualization and mathematical sandbox; not established current technology, measured physical performance, or proof of an operational drive.",
      exportContainsExecutableCode: false
    });
  }
  buildWeakPoints(rows, weakestScenario) {
    const sorted = rows.slice().sort((left, right) => {
      const validationDelta = finiteNumber(left.validationScore, 0) - finiteNumber(right.validationScore, 0);
      if (Math.abs(validationDelta) > 0.0001) { return validationDelta; }
      return finiteNumber(right.warningCount, 0) - finiteNumber(left.warningCount, 0);
    }).slice(0, 3);
    if (!sorted.length && weakestScenario) {
      return Object.freeze([{ scenario: weakestScenario, title: weakestScenario, reason: "Grand Experiment summary identified this as the weakest scenario.", validationScore: 0, warningCount: 0 }]);
    }
    return Object.freeze(sorted.map((row) => Object.freeze({
      scenario: row.scenario,
      title: row.title,
      reason: row.status === "pass" ? "Lowest relative validation margin among passing stages." : "Stage requires review before being used as visitor-facing evidence.",
      validationScore: finiteNumber(row.validationScore, 0),
      warningCount: finiteNumber(row.warningCount, 0)
    })));
  }
  buildAssumptionRisks(readinessScore, warningCount, rows) {
    const rowText = rows.map((row) => row.scenario).join(" ");
    return Object.freeze(ASSUMPTION_NAMES.map((assumption) => {
      const active = rowText.length > 0 || assumption === "Ramjet harvest model";
      let riskLevel = readinessScore > 0.82 && warningCount <= 3 ? "medium" : "high";
      if (assumption === "Absolute time" && readinessScore > 0.75) { riskLevel = "medium"; }
      if (!active) { riskLevel = "low"; }
      return Object.freeze({ assumption, riskLevel, reason: active ? "Active in the nine-mode review path and must remain labeled as an ArcSecs alternative hypothesis." : "Not active in the current evidence packet." });
    }));
  }
  buildNextActions(status, weakestPoints, metrics, guidedTour) {
    const actions = [];
    if (guidedTour && guidedTour.status !== "active") { actions.push("Run or resume the Guided Autopilot Tour so visitors see the scenario sequence before reviewing exports."); }
    if (weakestPoints.length) { actions.push(`Open ${weakestPoints[0].title} and compare its metric, validation score, and warning count before public sharing.`); }
    if (metrics && metrics.ledgerStatus && metrics.ledgerStatus !== "pass") { actions.push("Inspect the photon energy ledger because the latest run is not reporting a clean pass."); }
    if (status === "readyWithCaution") { actions.push("Export the Review Cockpit packet together with the Grand Experiment evidence packet for a cautious research note."); }
    else if (status === "needsReview") { actions.push("Treat the page as a review build: share screenshots only with the speculative boundary and weakest-stage notes visible."); }
    else { actions.push("Hold public promotion until the weakest scenario and warning budget improve."); }
    return Object.freeze(actions.slice(0, 4));
  }
  buildPublicSummary(status, passCount, stageCount, guidedTour) {
    const tourText = guidedTour ? ` Guided tour is ${guidedTour.status || "pending"} at ${guidedTour.currentTitle || "the first stage"}.` : " Guided tour data is pending.";
    const statusText = status === "readyWithCaution" ? "ready for cautious public demonstration" : status === "needsReview" ? "useful but still marked for review" : "not ready for public demonstration";
    return `The ArcSecs demo is ${statusText}: ${passCount}/${stageCount} Grand Experiment stages currently pass.${tourText}`;
  }
  buildPhysicistSummary(averageValidationScore, warningCount, weakestPoints) {
    const weakest = weakestPoints.length ? weakestPoints[0].title : "none";
    return `Average validation score ${(averageValidationScore * 100).toFixed(1)}%, warning count ${warningCount}, weakest stage ${weakest}. Treat all model claims as assumption-driven comparisons rather than empirical confirmation.`;
  }
}

module.exports = { ReviewCockpit, ASSUMPTION_NAMES };
