"use strict";

function playlistUniqueLimited(values, maximumCount) { const selectedValues = []; values.forEach((value) => { if (String(value || "").length > 0 && selectedValues.indexOf(value) === -1 && selectedValues.length < maximumCount) { selectedValues.push(value); } }); return Object.freeze(selectedValues); }
function playlistFiniteNumber(value, fallback) { const numericValue = Number(value); return Number.isFinite(numericValue) ? numericValue : fallback; }
function playlistClamp(value, minimumValue, maximumValue) { return Math.max(minimumValue, Math.min(maximumValue, value)); }
function playlistSummarize(items) {
  const completedCount = items.filter((item) => item.status === "complete" || item.status === "warning").length;
  const warningCount = items.reduce((total, item) => total + item.warningCount + (item.status === "warning" ? 1 : 0), 0);
  const runningCount = items.filter((item) => item.status === "running").length;
  const progressPercent = Math.round((completedCount / Math.max(1, items.length)) * 100);
  return Object.freeze({ itemCount: items.length, completedCount, warningCount, runningCount, progressPercent, readyToExport: completedCount > 0, visitorSummary: "Run a queue of guided experiment recipes in sequence, then export one cautious batch report instead of isolated screenshots.", physicistSummary: "Playlist rows preserve scenario order, parameter counts, validation scores, warnings, and ledger status so the batch remains auditable." });
}
class ExperimentPlaylistRunner {
  constructor(maximumItems = 8) { this.maximumItems = Math.max(2, Math.min(12, Math.round(Number(maximumItems) || 8))); }
  normalizePresetIds(presetIds, availablePresets) { const availableIds = availablePresets.map((preset) => preset.presetId); const validIds = presetIds.filter((presetId) => availableIds.indexOf(presetId) >= 0); if (validIds.length > 0) { return playlistUniqueLimited(validIds, this.maximumItems); } return playlistUniqueLimited(availableIds.slice(0, Math.min(5, this.maximumItems)), this.maximumItems); }
  buildPlaylist(selectedPresetIds, availablePresets, activeConfig, comparison = null, currentIndex = 0) {
    const selectedIds = this.normalizePresetIds(selectedPresetIds, availablePresets);
    const boundedIndex = playlistClamp(Math.round(Number(currentIndex) || 0), 0, Math.max(0, selectedIds.length - 1));
    const items = selectedIds.map((presetId, index) => {
      const preset = availablePresets.find((candidate) => candidate.presetId === presetId) || availablePresets[0];
      const comparisonRow = comparison && comparison.rows ? comparison.rows.find((row) => row.presetId === preset.presetId) : undefined;
      const status = index === boundedIndex ? "running" : "queued";
      return Object.freeze({ order: index + 1, presetId: preset.presetId, title: preset.title, scenario: preset.scenario, audience: preset.audience, expectedSignal: preset.expectedResult, parameterCount: Object.keys(preset.parameters).filter((parameterName) => activeConfig[parameterName] !== preset.parameters[parameterName]).length, highlightedParameters: preset.highlightedParameters.slice(), status, validationScore: playlistFiniteNumber(comparisonRow ? comparisonRow.validationScore : 0, 0), warningCount: playlistFiniteNumber(comparisonRow ? comparisonRow.warningCount : 0, 0), lastLedgerStatus: comparisonRow && comparisonRow.stageStatus ? comparisonRow.stageStatus : "not-yet-run", operatorInstruction: "Apply this recipe, run the scenario, verify the expected signal, then advance to the next playlist item." });
    });
    return this.buildPacket(selectedIds, items, boundedIndex);
  }
  recordCurrentResult(playlist, result = null) {
    const currentIndex = playlistClamp(playlist.currentIndex, 0, Math.max(0, playlist.items.length - 1));
    const items = playlist.items.map((item, index) => {
      if (index !== currentIndex) { return item; }
      const warningCount = playlistFiniteNumber(result ? result.warningCount : item.warningCount, item.warningCount);
      const validationScore = playlistFiniteNumber(result ? result.validationScore : item.validationScore, item.validationScore);
      const lastLedgerStatus = result && result.ledgerStatus ? result.ledgerStatus : item.lastLedgerStatus;
      return Object.freeze(Object.assign({}, item, { status: warningCount > 0 || lastLedgerStatus === "warning" ? "warning" : "complete", warningCount, validationScore, lastLedgerStatus }));
    });
    return this.buildPacket(playlist.selectedPresetIds, items, currentIndex);
  }
  completeCurrent(playlist, result = null) {
    const currentIndex = playlistClamp(playlist.currentIndex, 0, Math.max(0, playlist.items.length - 1));
    const nextIndex = playlistClamp(currentIndex + 1, 0, Math.max(0, playlist.items.length - 1));
    const items = playlist.items.map((item, index) => {
      if (index < currentIndex) { return item; }
      if (index === currentIndex) {
        const warningCount = playlistFiniteNumber(result ? result.warningCount : item.warningCount, item.warningCount);
        const validationScore = playlistFiniteNumber(result ? result.validationScore : item.validationScore, item.validationScore);
        const lastLedgerStatus = result && result.ledgerStatus ? result.ledgerStatus : item.lastLedgerStatus;
        return Object.freeze(Object.assign({}, item, { status: warningCount > 0 || lastLedgerStatus === "warning" ? "warning" : "complete", warningCount, validationScore, lastLedgerStatus }));
      }
      if (index === nextIndex && nextIndex !== currentIndex) { return Object.freeze(Object.assign({}, item, { status: "running" })); }
      return Object.freeze(Object.assign({}, item, { status: "queued" }));
    });
    return this.buildPacket(playlist.selectedPresetIds, items, nextIndex);
  }
  resetPlaylist(playlist) { const items = playlist.items.map((item, index) => Object.freeze(Object.assign({}, item, { status: index === 0 ? "running" : "queued", validationScore: 0, warningCount: 0, lastLedgerStatus: "not-yet-run" }))); return this.buildPacket(playlist.selectedPresetIds, items, 0); }
  currentItem(playlist) { return playlist.items[playlistClamp(playlist.currentIndex, 0, Math.max(0, playlist.items.length - 1))]; }
  buildPacket(selectedIds, items, currentIndex) { const boundedIndex = playlistClamp(currentIndex, 0, Math.max(0, items.length - 1)); const currentItem = items[boundedIndex]; return Object.freeze({ packetType: "ArcSecs Experiment Playlist Runner", playlistId: "arcsecs-playlist-" + selectedIds.join("-").replace(/[^a-z0-9-]/gi, "").slice(0, 72), generatedUtc: new Date().toISOString(), currentIndex: boundedIndex, currentPresetId: currentItem ? currentItem.presetId : "none", currentScenario: currentItem ? currentItem.scenario : "relationalLattice", selectedPresetIds: Object.freeze(selectedIds.slice()), items: Object.freeze(items.slice()), summary: playlistSummarize(items), exportContainsExecutableCode: false, scientificBoundary: "Experiment playlists are inert guided batches for the ArcSecs speculative sandbox; they organize review workflow and do not prove the underlying physics model." }); }
}
module.exports = { ExperimentPlaylistRunner };
