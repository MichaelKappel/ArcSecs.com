"use strict";
function replayFiniteNumber(value, fallback) { const numericValue = Number(value); return Number.isFinite(numericValue) ? numericValue : fallback; }
function replayClampIndex(index, length) { if (length <= 0) { return 0; } return Math.max(0, Math.min(length - 1, Math.round(replayFiniteNumber(index, 0)))); }
function replayFormatValue(value) { const numericValue = replayFiniteNumber(value, 0); if (Math.abs(numericValue) >= 10000 || (Math.abs(numericValue) < 0.001 && numericValue !== 0)) { return numericValue.toExponential(3); } return numericValue.toFixed(4).replace(/0+$/, "").replace(/\.$/, ""); }
function replayMetricFromCards(entry, key, fallback) { const cards = entry && Array.isArray(entry.metricCards) ? entry.metricCards : []; const card = cards.find((candidate) => candidate && candidate.key === key); return replayFiniteNumber(card ? card.numericValue : fallback, fallback); }
function replayReadMetric(metrics, names, fallback) { for (const name of names) { if (Object.prototype.hasOwnProperty.call(metrics || {}, name)) { return replayFiniteNumber(metrics[name], fallback); } } return fallback; }
function replayScenarioLabel(item, entry, latestResult) { if (entry && entry.scenarioLabel) { return entry.scenarioLabel; } if (item && item.title) { return item.title; } if (latestResult && latestResult.config && latestResult.config.scenario) { return latestResult.config.scenario; } return "ArcSecs scenario"; }
function replayWhyThisChanged(scenario) { const explanations = { massivePhotonLensing: "Photon deflection changes because the recipe raises the massive-photon coupling branch while holding the standard reference comparison visible.", tiredLightEnergyLedger: "Photon energy and redshift change because distance attenuation transfers energy into the explicit tired-light ledger.", darkMatterRamjet: "Ramjet telemetry changes because higher intake and reactor demand push thermal rejection, buffer fill, and exhaust collimation into bottleneck territory.", absoluteTimeQuantumOscillator: "Oscillator counts change because the near-mass probe is mechanically damped while the global fixed tick remains shared.", newtonianDarkStar: "Photon capture state changes when launch speed crosses the Newtonian escape-velocity threshold.", superluminalGalilean: "Relative velocity changes by direct Galilean vector arithmetic with no Lorentz limiter applied in this alternative hypothesis mode.", darkMatterCondensate: "Halo density changes as tired-light ledger energy is represented as a condensate accumulation proxy.", parallaxCalibration: "Validation changes when arcsecond, AU, and parsec calibration checks close or fail their tolerance band." }; return explanations[scenario] || "The snapshot changes because the selected recipe altered one or more sandbox controls before the deterministic run was recorded."; }
function replayMetricsForScenario(item, entry, latestResult) {
  const scenario = (entry && entry.scenario) || (item && item.scenario) || (latestResult && latestResult.config ? latestResult.config.scenario : "relationalLattice");
  const latestMetrics = latestResult && latestResult.metrics ? latestResult.metrics : {};
  const warningCount = replayFiniteNumber((entry && entry.warningCount) || (item && item.warningCount) || latestMetrics.warningCount, 0);
  const validationScore = replayFiniteNumber((entry && entry.validationScore) || (item && item.validationScore) || (latestResult && latestResult.validationLab ? latestResult.validationLab.validationScore : 0.72), 0.72);
  const ledgerStatus = (entry && entry.ledgerStatus) || (item && item.lastLedgerStatus) || latestMetrics.ledgerStatus || "pass";
  const baselineDelta = replayMetricFromCards(entry, "baselineDelta", replayReadMetric(latestMetrics, ["baselineDelta", "speculativeModelValue"], 0.18));
  const finalRedshift = replayMetricFromCards(entry, "finalRedshift", replayReadMetric(latestMetrics, ["finalRedshift"], scenario === "tiredLightEnergyLedger" ? 0.42 : 0.03));
  const finalEnergyFraction = replayMetricFromCards(entry, "finalEnergyFraction", replayReadMetric(latestMetrics, ["finalEnergyFraction"], scenario === "tiredLightEnergyLedger" ? 0.62 : 0.95));
  const bufferFill = replayMetricFromCards(entry, "ramjetBufferFill", replayReadMetric(latestMetrics, ["ramjetBufferFill"], scenario === "darkMatterRamjet" ? 1.08 : 0.36));
  const radiatorLoad = replayMetricFromCards(entry, "ramjetRadiatorLoad", replayReadMetric(latestMetrics, ["ramjetRadiatorLoad"], scenario === "darkMatterRamjet" ? 1.18 : 0.44));
  const thrustProxy = replayMetricFromCards(entry, "ramjetThrustProxy", replayReadMetric(latestMetrics, ["ramjetThrustProxy"], scenario === "darkMatterRamjet" ? 0.41 : 0.12));
  const deflectionProxy = scenario === "massivePhotonLensing" ? Math.max(0.08, Math.abs(baselineDelta) + 0.24) : Math.abs(baselineDelta);
  const ledgerClosure = replayReadMetric(latestMetrics, ["energyLedgerClosureProxy", "ledgerClosureError"], ledgerStatus === "pass" ? 0.0008 : 0.016);
  const netAcceleration = scenario === "darkMatterRamjet" ? replayReadMetric(latestMetrics, ["ramjetNetAcceleration", "ramjetAcceleration", "netAcceleration"], Math.max(0, thrustProxy - Math.max(0, radiatorLoad - 1) * 0.5)) : replayReadMetric(latestMetrics, ["netAcceleration"], 0.02);
  const metrics = [
    { key: "deflection", label: "Deflection proxy", beforeValue: scenario === "massivePhotonLensing" ? Math.max(0, deflectionProxy * 0.45) : 0, afterValue: deflectionProxy, unit: "arcsec", status: scenario === "massivePhotonLensing" && deflectionProxy > 0.2 ? "changed" : "stable", explanation: "Before/after proxy for curved photon path strength." },
    { key: "ledgerClosure", label: "Ledger closure", beforeValue: 0, afterValue: ledgerClosure, unit: "error", status: ledgerStatus === "pass" && Math.abs(ledgerClosure) < 0.01 ? "pass" : "warning", explanation: "Energy removed from photons should appear in the tired-light ledger." },
    { key: "redshift", label: "Redshift", beforeValue: 0, afterValue: finalRedshift, unit: "z", status: scenario === "tiredLightEnergyLedger" ? "changed" : "stable", explanation: "Wavelength/frequency shift produced by the recipe." },
    { key: "photonEnergy", label: "Photon energy", beforeValue: 1, afterValue: finalEnergyFraction, unit: "fraction", status: finalEnergyFraction < 0.9 ? "changed" : "stable", explanation: "Remaining photon energy after the simulated distance." },
    { key: "radiatorLoad", label: "Radiator load", beforeValue: 0.42, afterValue: radiatorLoad, unit: "ratio", status: radiatorLoad >= 1 ? "warning" : "pass", explanation: "Thermal rejection pressure in the Dark Matter Ramjet pipeline." },
    { key: "bufferFill", label: "Buffer fill", beforeValue: 0.25, afterValue: bufferFill, unit: "ratio", status: bufferFill >= 1 ? "warning" : "pass", explanation: "DSP buffer saturation pressure in the ramjet pipeline." },
    { key: "netAcceleration", label: "Net acceleration", beforeValue: Math.max(0, netAcceleration + 0.18), afterValue: netAcceleration, unit: "proxy", status: scenario === "darkMatterRamjet" && netAcceleration < 0.08 ? "warning" : "pass", explanation: "Thrust minus drag and thermal bottleneck penalties." },
    { key: "validationScore", label: "Validation score", beforeValue: 0.72, afterValue: validationScore, unit: "score", status: validationScore >= 0.72 ? "pass" : "warning", explanation: "Scenario validation proxy captured for this stage." }
  ].map((metric) => Object.freeze(Object.assign({}, metric, { delta: replayFiniteNumber(metric.afterValue, 0) - replayFiniteNumber(metric.beforeValue, 0), beforeText: replayFormatValue(metric.beforeValue), afterText: replayFormatValue(metric.afterValue), deltaText: replayFormatValue(replayFiniteNumber(metric.afterValue, 0) - replayFiniteNumber(metric.beforeValue, 0)) })));
  return { scenario, warningCount, validationScore, ledgerStatus, metrics };
}
function replayBuildMarkers(scenario, metrics, warningCount, ledgerStatus) {
  const lookup = new Map(metrics.map((metric) => [metric.key, metric]));
  const deflection = lookup.get("deflection");
  const ledger = lookup.get("ledgerClosure");
  const radiator = lookup.get("radiatorLoad");
  const buffer = lookup.get("bufferFill");
  const netAcceleration = lookup.get("netAcceleration");
  return Object.freeze([
    Object.freeze({ key: "deflectionIncrease", label: "Deflection increase", triggered: scenario === "massivePhotonLensing" && deflection && deflection.delta > 0.05, severity: "info", explanation: "Raised massive-photon coupling should visibly increase curved photon path strength." }),
    Object.freeze({ key: "ledgerClosure", label: "Ledger closure/failure", triggered: scenario === "tiredLightEnergyLedger" || ledgerStatus !== "pass" || warningCount > 0, severity: ledgerStatus === "pass" && ledger && Math.abs(ledger.afterValue) < 0.01 ? "pass" : "warning", explanation: "The replay marks whether photon energy loss is accounted for or becomes a ledger warning." }),
    Object.freeze({ key: "radiatorBottleneck", label: "Radiator bottleneck", triggered: scenario === "darkMatterRamjet" && radiator && radiator.afterValue >= 1, severity: "warning", explanation: "Waste heat exceeds sustainable radiator capacity." }),
    Object.freeze({ key: "bufferSaturation", label: "Buffer saturation", triggered: scenario === "darkMatterRamjet" && buffer && buffer.afterValue >= 1, severity: "warning", explanation: "The intake/conversion buffer crosses its saturation threshold." }),
    Object.freeze({ key: "netAccelerationDrop", label: "Net acceleration drop", triggered: scenario === "darkMatterRamjet" && netAcceleration && netAcceleration.delta < -0.05, severity: "warning", explanation: "Drag and thermal limits reduce net acceleration after the bottleneck appears." })
  ]);
}
function replaySummarize(snapshots) {
  const warningSnapshots = snapshots.filter((snapshot) => snapshot.status === "warning");
  const markers = snapshots.reduce((total, snapshot) => total + snapshot.visualMarkers.filter((marker) => marker.triggered).length, 0);
  return Object.freeze({ stageCount: snapshots.length, warningCount: warningSnapshots.length, markerCount: markers, readyToExport: snapshots.length > 0, visitorSummary: snapshots.length > 0 ? "Replay Timeline has " + snapshots.length.toString() + " stage snapshot" + (snapshots.length === 1 ? "" : "s") + " with before/after metrics and why-this-changed notes." : "Build or run a playlist to create replay timeline snapshots.", physicistSummary: snapshots.length > 0 ? "Timeline captures staged metric deltas, warning markers, ledger status, and replay controls for audit-style review." : "No replay events are available yet." });
}
class ExperimentReplayTimeline {
  constructor(maximumEvents = 24) { this.maximumEvents = Math.max(6, Math.min(60, Math.round(replayFiniteNumber(maximumEvents, 24)))); }
  buildTimeline(playlist, notebook, latestResult, selectedIndex = 0, playbackState = "paused") {
    const playlistItems = playlist && Array.isArray(playlist.items) ? playlist.items : [];
    const notebookEntries = notebook && Array.isArray(notebook.entries) ? notebook.entries : [];
    const items = playlistItems.length > 0 ? playlistItems : notebookEntries.map((entry, index) => ({ order: index + 1, presetId: entry.presetId, title: entry.presetTitle || entry.scenarioLabel, scenario: entry.scenario, status: "complete", warningCount: entry.warningCount, validationScore: entry.validationScore, lastLedgerStatus: entry.ledgerStatus, expectedSignal: entry.visitorSummary }));
    const snapshots = items.map((item, index) => {
      const entry = notebookEntries.find((candidate) => candidate.scenario === item.scenario || candidate.presetId === item.presetId) || null;
      const metricState = replayMetricsForScenario(item, entry, latestResult);
      const visualMarkers = replayBuildMarkers(metricState.scenario, metricState.metrics, metricState.warningCount, metricState.ledgerStatus);
      const hasWarning = metricState.warningCount > 0 || metricState.ledgerStatus !== "pass" || visualMarkers.some((marker) => marker.triggered && marker.severity === "warning");
      return Object.freeze({ snapshotId: "arcsecs-replay-stage-" + (index + 1 < 10 ? "0" : "") + String(index + 1), order: index + 1, presetId: item.presetId || (entry ? entry.presetId : "manual"), scenario: metricState.scenario, title: replayScenarioLabel(item, entry, latestResult), status: hasWarning ? "warning" : "pass", startedState: index === 0 ? "playlist-start" : "after-previous-stage", completedState: item.status || (entry ? "captured" : "queued"), whyThisChanged: replayWhyThisChanged(metricState.scenario), beforeAfterMetrics: Object.freeze(metricState.metrics), visualMarkers, warningCount: metricState.warningCount, validationScore: metricState.validationScore, ledgerStatus: metricState.ledgerStatus });
    });
    const boundedIndex = replayClampIndex(selectedIndex, snapshots.length);
    const eventWork = [];
    snapshots.forEach((snapshot) => {
      eventWork.push(Object.freeze({ eventId: snapshot.snapshotId + "-stage", order: snapshot.order, scenario: snapshot.scenario, label: snapshot.title, severity: snapshot.status === "warning" ? "warning" : "pass", detail: snapshot.whyThisChanged }));
      snapshot.visualMarkers.filter((marker) => marker.triggered).forEach((marker) => { eventWork.push(Object.freeze({ eventId: snapshot.snapshotId + "-" + marker.key, order: snapshot.order, scenario: snapshot.scenario, label: marker.label, severity: marker.severity, detail: marker.explanation })); });
    });
    const events = eventWork.slice(0, this.maximumEvents);
    const warningIndex = snapshots.findIndex((snapshot) => snapshot.status === "warning");
    return Object.freeze({ packetType: "ArcSecs Experiment Replay Timeline", generatedUtc: new Date().toISOString(), playbackState: playbackState === "playing" ? "playing" : "paused", currentIndex: boundedIndex, currentSnapshotId: snapshots[boundedIndex] ? snapshots[boundedIndex].snapshotId : "none", snapshots: Object.freeze(snapshots), events: Object.freeze(events), summary: replaySummarize(snapshots), nextWarningIndex: warningIndex, exportContainsExecutableCode: false, scientificBoundary: "Experiment Replay Timeline reports are inert browser-side playback summaries for the ArcSecs speculative sandbox; they do not prove the underlying physics model." });
  }
  previous(timeline) { return this.buildTimelineFromExisting(timeline, replayClampIndex((timeline ? timeline.currentIndex : 0) - 1, timeline && timeline.snapshots ? timeline.snapshots.length : 0), "paused"); }
  next(timeline) { return this.buildTimelineFromExisting(timeline, replayClampIndex((timeline ? timeline.currentIndex : 0) + 1, timeline && timeline.snapshots ? timeline.snapshots.length : 0), timeline && timeline.playbackState === "playing" ? "playing" : "paused"); }
  play(timeline) { return this.buildTimelineFromExisting(timeline, timeline ? timeline.currentIndex : 0, "playing"); }
  pause(timeline) { return this.buildTimelineFromExisting(timeline, timeline ? timeline.currentIndex : 0, "paused"); }
  jumpToNextWarning(timeline) { const index = timeline && timeline.nextWarningIndex >= 0 ? timeline.nextWarningIndex : timeline ? timeline.currentIndex : 0; return this.buildTimelineFromExisting(timeline, index, "paused"); }
  buildTimelineFromExisting(timeline, index, playbackState) { const existing = timeline || this.buildTimeline(null, null, null); const boundedIndex = replayClampIndex(index, existing.snapshots.length); return Object.freeze(Object.assign({}, existing, { generatedUtc: new Date().toISOString(), playbackState, currentIndex: boundedIndex, currentSnapshotId: existing.snapshots[boundedIndex] ? existing.snapshots[boundedIndex].snapshotId : "none" })); }
  exportReport(timeline, context = {}) { const activeTimeline = timeline || this.buildTimeline(null, null, null); return Object.freeze({ packetType: "ArcSecs Experiment Replay Timeline Report", generatedUtc: new Date().toISOString(), timeline: activeTimeline, context: Object.freeze(Object.assign({}, context)), exportContainsExecutableCode: false, scientificBoundary: activeTimeline.scientificBoundary }); }
}
module.exports = { ExperimentReplayTimeline };
