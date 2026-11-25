export type ReplayPlaybackState = "paused" | "playing";
export type ReplayStageStatus = "pass" | "warning";
export type ReplayMarkerSeverity = "pass" | "warning" | "info";

export interface ReplayPlaylistItemInput {
    readonly order?: number;
    readonly presetId?: string;
    readonly title?: string;
    readonly scenario?: string;
    readonly status?: string;
    readonly warningCount?: number;
    readonly validationScore?: number;
    readonly lastLedgerStatus?: string;
    readonly expectedSignal?: string;
}

export interface ReplayPlaylistInput {
    readonly playlistId?: string;
    readonly items?: readonly ReplayPlaylistItemInput[];
}

export interface ReplayNotebookMetricCardInput {
    readonly key: string;
    readonly numericValue: number;
}

export interface ReplayNotebookEntryInput {
    readonly presetId?: string;
    readonly presetTitle?: string;
    readonly scenario: string;
    readonly scenarioLabel: string;
    readonly warningCount?: number;
    readonly validationScore?: number;
    readonly ledgerStatus?: string;
    readonly visitorSummary?: string;
    readonly metricCards?: readonly ReplayNotebookMetricCardInput[];
}

export interface ReplayNotebookInput {
    readonly entries?: readonly ReplayNotebookEntryInput[];
}

export interface ReplayLatestResultInput {
    readonly config?: Readonly<{ readonly scenario?: string }>;
    readonly validationLab?: Readonly<{ readonly validationScore?: number }>;
    readonly metrics?: Readonly<Record<string, string | number | boolean>>;
}

export interface ReplayMetricDelta {
    readonly key: string;
    readonly label: string;
    readonly beforeValue: number;
    readonly afterValue: number;
    readonly delta: number;
    readonly beforeText: string;
    readonly afterText: string;
    readonly deltaText: string;
    readonly unit: string;
    readonly status: "pass" | "warning" | "changed" | "stable";
    readonly explanation: string;
}

export interface ReplayVisualMarker {
    readonly key: "deflectionIncrease" | "ledgerClosure" | "radiatorBottleneck" | "bufferSaturation" | "netAccelerationDrop";
    readonly label: string;
    readonly triggered: boolean;
    readonly severity: ReplayMarkerSeverity;
    readonly explanation: string;
}

export interface ReplayStageSnapshot {
    readonly snapshotId: string;
    readonly order: number;
    readonly presetId: string;
    readonly scenario: string;
    readonly title: string;
    readonly status: ReplayStageStatus;
    readonly startedState: string;
    readonly completedState: string;
    readonly whyThisChanged: string;
    readonly beforeAfterMetrics: readonly ReplayMetricDelta[];
    readonly visualMarkers: readonly ReplayVisualMarker[];
    readonly warningCount: number;
    readonly validationScore: number;
    readonly ledgerStatus: string;
}

export interface ReplayTimelineEvent {
    readonly eventId: string;
    readonly order: number;
    readonly scenario: string;
    readonly label: string;
    readonly severity: ReplayMarkerSeverity;
    readonly detail: string;
}

export interface ReplayTimelineSummary {
    readonly stageCount: number;
    readonly warningCount: number;
    readonly markerCount: number;
    readonly readyToExport: boolean;
    readonly visitorSummary: string;
    readonly physicistSummary: string;
}

export interface ExperimentReplayTimelinePacket {
    readonly packetType: "ArcSecs Experiment Replay Timeline";
    readonly generatedUtc: string;
    readonly playbackState: ReplayPlaybackState;
    readonly currentIndex: number;
    readonly currentSnapshotId: string;
    readonly snapshots: readonly ReplayStageSnapshot[];
    readonly events: readonly ReplayTimelineEvent[];
    readonly summary: ReplayTimelineSummary;
    readonly nextWarningIndex: number;
    readonly exportContainsExecutableCode: false;
    readonly scientificBoundary: string;
}

export interface ExperimentReplayTimelineReport {
    readonly packetType: "ArcSecs Experiment Replay Timeline Report";
    readonly generatedUtc: string;
    readonly timeline: ExperimentReplayTimelinePacket;
    readonly context: Readonly<Record<string, unknown>>;
    readonly exportContainsExecutableCode: false;
    readonly scientificBoundary: string;
}

function finiteNumber(value: unknown, fallback: number): number {
    const numericValue: number = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
}

function clampIndex(index: number, length: number): number {
    if (length <= 0) {
        return 0;
    }
    return Math.max(0, Math.min(length - 1, Math.round(finiteNumber(index, 0))));
}

function formatValue(value: number): string {
    const numericValue: number = finiteNumber(value, 0);
    if (Math.abs(numericValue) >= 10000 || (Math.abs(numericValue) < 0.001 && numericValue !== 0)) {
        return numericValue.toExponential(3);
    }
    return numericValue.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

function readLatestMetric(metrics: Readonly<Record<string, string | number | boolean>>, names: readonly string[], fallback: number): number {
    for (const name of names) {
        if (Object.prototype.hasOwnProperty.call(metrics, name)) {
            return finiteNumber(metrics[name], fallback);
        }
    }
    return fallback;
}

function readNotebookMetric(entry: ReplayNotebookEntryInput | undefined, key: string, fallback: number): number {
    const cards: readonly ReplayNotebookMetricCardInput[] = entry && entry.metricCards ? entry.metricCards : [];
    const card: ReplayNotebookMetricCardInput | undefined = cards.find((candidate: ReplayNotebookMetricCardInput) => candidate.key === key);
    return finiteNumber(card ? card.numericValue : fallback, fallback);
}

function explainScenarioChange(scenario: string): string {
    const explanations: Readonly<Record<string, string>> = {
        massivePhotonLensing: "Photon deflection changes because the recipe raises the massive-photon coupling branch while holding the standard reference comparison visible.",
        tiredLightEnergyLedger: "Photon energy and redshift change because distance attenuation transfers energy into the explicit tired-light ledger.",
        darkMatterRamjet: "Ramjet telemetry changes because higher intake and reactor demand push thermal rejection, buffer fill, and exhaust collimation into bottleneck territory.",
        absoluteTimeQuantumOscillator: "Oscillator counts change because the near-mass probe is mechanically damped while the global fixed tick remains shared.",
        newtonianDarkStar: "Photon capture state changes when launch speed crosses the Newtonian escape-velocity threshold.",
        superluminalGalilean: "Relative velocity changes by direct Galilean vector arithmetic with no Lorentz limiter applied in this alternative hypothesis mode.",
        darkMatterCondensate: "Halo density changes as tired-light ledger energy is represented as a condensate accumulation proxy.",
        parallaxCalibration: "Validation changes when arcsecond, AU, and parsec calibration checks close or fail their tolerance band."
    };
    return explanations[scenario] || "The snapshot changes because the selected recipe altered one or more sandbox controls before the deterministic run was recorded.";
}

function freezeMetric(key: string, label: string, beforeValue: number, afterValue: number, unit: string, status: ReplayMetricDelta["status"], explanation: string): ReplayMetricDelta {
    const delta: number = afterValue - beforeValue;
    return Object.freeze({ key, label, beforeValue, afterValue, delta, beforeText: formatValue(beforeValue), afterText: formatValue(afterValue), deltaText: formatValue(delta), unit, status, explanation });
}

function buildMetrics(item: ReplayPlaylistItemInput, entry: ReplayNotebookEntryInput | undefined, latestResult: ReplayLatestResultInput | null): { readonly scenario: string; readonly warningCount: number; readonly validationScore: number; readonly ledgerStatus: string; readonly metrics: readonly ReplayMetricDelta[] } {
    const latestMetrics: Readonly<Record<string, string | number | boolean>> = latestResult && latestResult.metrics ? latestResult.metrics : {};
    const scenario: string = entry ? entry.scenario : item.scenario || (latestResult && latestResult.config && latestResult.config.scenario ? latestResult.config.scenario : "relationalLattice");
    const warningCount: number = finiteNumber(entry && entry.warningCount !== undefined ? entry.warningCount : item.warningCount, 0);
    const validationScore: number = finiteNumber(entry && entry.validationScore !== undefined ? entry.validationScore : item.validationScore !== undefined ? item.validationScore : latestResult && latestResult.validationLab ? latestResult.validationLab.validationScore : 0.72, 0.72);
    const ledgerStatus: string = String(entry && entry.ledgerStatus ? entry.ledgerStatus : item.lastLedgerStatus || latestMetrics.ledgerStatus || "pass");
    const baselineDelta: number = readNotebookMetric(entry, "baselineDelta", readLatestMetric(latestMetrics, ["baselineDelta", "speculativeModelValue"], 0.18));
    const finalRedshift: number = readNotebookMetric(entry, "finalRedshift", readLatestMetric(latestMetrics, ["finalRedshift"], scenario === "tiredLightEnergyLedger" ? 0.42 : 0.03));
    const finalEnergyFraction: number = readNotebookMetric(entry, "finalEnergyFraction", readLatestMetric(latestMetrics, ["finalEnergyFraction"], scenario === "tiredLightEnergyLedger" ? 0.62 : 0.95));
    const bufferFill: number = readNotebookMetric(entry, "ramjetBufferFill", readLatestMetric(latestMetrics, ["ramjetBufferFill"], scenario === "darkMatterRamjet" ? 1.08 : 0.36));
    const radiatorLoad: number = readNotebookMetric(entry, "ramjetRadiatorLoad", readLatestMetric(latestMetrics, ["ramjetRadiatorLoad"], scenario === "darkMatterRamjet" ? 1.18 : 0.44));
    const thrustProxy: number = readNotebookMetric(entry, "ramjetThrustProxy", readLatestMetric(latestMetrics, ["ramjetThrustProxy"], scenario === "darkMatterRamjet" ? 0.41 : 0.12));
    const deflectionProxy: number = scenario === "massivePhotonLensing" ? Math.max(0.08, Math.abs(baselineDelta) + 0.24) : Math.abs(baselineDelta);
    const ledgerClosure: number = readLatestMetric(latestMetrics, ["energyLedgerClosureProxy", "ledgerClosureError"], ledgerStatus === "pass" ? 0.0008 : 0.016);
    const netAcceleration: number = scenario === "darkMatterRamjet" ? readLatestMetric(latestMetrics, ["ramjetNetAcceleration", "ramjetAcceleration", "netAcceleration"], Math.max(0, thrustProxy - Math.max(0, radiatorLoad - 1) * 0.5)) : readLatestMetric(latestMetrics, ["netAcceleration"], 0.02);
    const metrics: ReplayMetricDelta[] = [
        freezeMetric("deflection", "Deflection proxy", scenario === "massivePhotonLensing" ? Math.max(0, deflectionProxy * 0.45) : 0, deflectionProxy, "arcsec", scenario === "massivePhotonLensing" && deflectionProxy > 0.2 ? "changed" : "stable", "Before/after proxy for curved photon path strength."),
        freezeMetric("ledgerClosure", "Ledger closure", 0, ledgerClosure, "error", ledgerStatus === "pass" && Math.abs(ledgerClosure) < 0.01 ? "pass" : "warning", "Energy removed from photons should appear in the tired-light ledger."),
        freezeMetric("redshift", "Redshift", 0, finalRedshift, "z", scenario === "tiredLightEnergyLedger" ? "changed" : "stable", "Wavelength/frequency shift produced by the recipe."),
        freezeMetric("photonEnergy", "Photon energy", 1, finalEnergyFraction, "fraction", finalEnergyFraction < 0.9 ? "changed" : "stable", "Remaining photon energy after the simulated distance."),
        freezeMetric("radiatorLoad", "Radiator load", 0.42, radiatorLoad, "ratio", radiatorLoad >= 1 ? "warning" : "pass", "Thermal rejection pressure in the Dark Matter Ramjet pipeline."),
        freezeMetric("bufferFill", "Buffer fill", 0.25, bufferFill, "ratio", bufferFill >= 1 ? "warning" : "pass", "DSP buffer saturation pressure in the ramjet pipeline."),
        freezeMetric("netAcceleration", "Net acceleration", Math.max(0, netAcceleration + 0.18), netAcceleration, "proxy", scenario === "darkMatterRamjet" && netAcceleration < 0.08 ? "warning" : "pass", "Thrust minus drag and thermal bottleneck penalties."),
        freezeMetric("validationScore", "Validation score", 0.72, validationScore, "score", validationScore >= 0.72 ? "pass" : "warning", "Scenario validation proxy captured for this stage.")
    ];
    return Object.freeze({ scenario, warningCount, validationScore, ledgerStatus, metrics: Object.freeze(metrics) });
}

function buildMarkers(scenario: string, metrics: readonly ReplayMetricDelta[], warningCount: number, ledgerStatus: string): readonly ReplayVisualMarker[] {
    const lookup: Map<string, ReplayMetricDelta> = new Map(metrics.map((metric: ReplayMetricDelta) => [metric.key, metric]));
    const deflection: ReplayMetricDelta | undefined = lookup.get("deflection");
    const ledger: ReplayMetricDelta | undefined = lookup.get("ledgerClosure");
    const radiator: ReplayMetricDelta | undefined = lookup.get("radiatorLoad");
    const buffer: ReplayMetricDelta | undefined = lookup.get("bufferFill");
    const netAcceleration: ReplayMetricDelta | undefined = lookup.get("netAcceleration");
    return Object.freeze([
        Object.freeze({ key: "deflectionIncrease", label: "Deflection increase", triggered: scenario === "massivePhotonLensing" && deflection !== undefined && deflection.delta > 0.05, severity: "info", explanation: "Raised massive-photon coupling should visibly increase curved photon path strength." }),
        Object.freeze({ key: "ledgerClosure", label: "Ledger closure/failure", triggered: scenario === "tiredLightEnergyLedger" || ledgerStatus !== "pass" || warningCount > 0, severity: ledgerStatus === "pass" && ledger !== undefined && Math.abs(ledger.afterValue) < 0.01 ? "pass" : "warning", explanation: "The replay marks whether photon energy loss is accounted for or becomes a ledger warning." }),
        Object.freeze({ key: "radiatorBottleneck", label: "Radiator bottleneck", triggered: scenario === "darkMatterRamjet" && radiator !== undefined && radiator.afterValue >= 1, severity: "warning", explanation: "Waste heat exceeds sustainable radiator capacity." }),
        Object.freeze({ key: "bufferSaturation", label: "Buffer saturation", triggered: scenario === "darkMatterRamjet" && buffer !== undefined && buffer.afterValue >= 1, severity: "warning", explanation: "The intake/conversion buffer crosses its saturation threshold." }),
        Object.freeze({ key: "netAccelerationDrop", label: "Net acceleration drop", triggered: scenario === "darkMatterRamjet" && netAcceleration !== undefined && netAcceleration.delta < -0.05, severity: "warning", explanation: "Drag and thermal limits reduce net acceleration after the bottleneck appears." })
    ]);
}

function summarize(snapshots: readonly ReplayStageSnapshot[]): ReplayTimelineSummary {
    const warningCount: number = snapshots.filter((snapshot: ReplayStageSnapshot) => snapshot.status === "warning").length;
    const markerCount: number = snapshots.reduce((total: number, snapshot: ReplayStageSnapshot) => total + snapshot.visualMarkers.filter((marker: ReplayVisualMarker) => marker.triggered).length, 0);
    return Object.freeze({
        stageCount: snapshots.length,
        warningCount,
        markerCount,
        readyToExport: snapshots.length > 0,
        visitorSummary: snapshots.length > 0 ? "Replay Timeline has " + snapshots.length.toString() + " stage snapshot" + (snapshots.length === 1 ? "" : "s") + " with before/after metrics and why-this-changed notes." : "Build or run a playlist to create replay timeline snapshots.",
        physicistSummary: snapshots.length > 0 ? "Timeline captures staged metric deltas, warning markers, ledger status, and replay controls for audit-style review." : "No replay events are available yet."
    });
}

export class ExperimentReplayTimeline {
    private readonly maximumEvents: number;

    public constructor(maximumEvents: number = 24) {
        this.maximumEvents = Math.max(6, Math.min(60, Math.round(finiteNumber(maximumEvents, 24))));
    }

    public buildTimeline(playlist: ReplayPlaylistInput | null, notebook: ReplayNotebookInput | null, latestResult: ReplayLatestResultInput | null, selectedIndex: number = 0, playbackState: ReplayPlaybackState = "paused"): ExperimentReplayTimelinePacket {
        const playlistItems: readonly ReplayPlaylistItemInput[] = playlist && playlist.items ? playlist.items : [];
        const notebookEntries: readonly ReplayNotebookEntryInput[] = notebook && notebook.entries ? notebook.entries : [];
        const items: readonly ReplayPlaylistItemInput[] = playlistItems.length > 0 ? playlistItems : notebookEntries.map((entry: ReplayNotebookEntryInput, index: number) => Object.freeze({ order: index + 1, presetId: entry.presetId, title: entry.presetTitle || entry.scenarioLabel, scenario: entry.scenario, status: "complete", warningCount: entry.warningCount, validationScore: entry.validationScore, lastLedgerStatus: entry.ledgerStatus, expectedSignal: entry.visitorSummary }));
        const snapshots: ReplayStageSnapshot[] = items.map((item: ReplayPlaylistItemInput, index: number) => {
            const entry: ReplayNotebookEntryInput | undefined = notebookEntries.find((candidate: ReplayNotebookEntryInput) => candidate.scenario === item.scenario || candidate.presetId === item.presetId);
            const metricState: { readonly scenario: string; readonly warningCount: number; readonly validationScore: number; readonly ledgerStatus: string; readonly metrics: readonly ReplayMetricDelta[] } = buildMetrics(item, entry, latestResult);
            const visualMarkers: readonly ReplayVisualMarker[] = buildMarkers(metricState.scenario, metricState.metrics, metricState.warningCount, metricState.ledgerStatus);
            const hasWarning: boolean = metricState.warningCount > 0 || metricState.ledgerStatus !== "pass" || visualMarkers.some((marker: ReplayVisualMarker) => marker.triggered && marker.severity === "warning");
            return Object.freeze({
                snapshotId: "arcsecs-replay-stage-" + (index + 1 < 10 ? "0" : "") + String(index + 1),
                order: index + 1,
                presetId: item.presetId || (entry ? entry.presetId || "manual" : "manual"),
                scenario: metricState.scenario,
                title: entry && entry.scenarioLabel ? entry.scenarioLabel : item.title || metricState.scenario,
                status: hasWarning ? "warning" : "pass",
                startedState: index === 0 ? "playlist-start" : "after-previous-stage",
                completedState: item.status || (entry ? "captured" : "queued"),
                whyThisChanged: explainScenarioChange(metricState.scenario),
                beforeAfterMetrics: metricState.metrics,
                visualMarkers,
                warningCount: metricState.warningCount,
                validationScore: metricState.validationScore,
                ledgerStatus: metricState.ledgerStatus
            });
        });
        const boundedIndex: number = clampIndex(selectedIndex, snapshots.length);
        const eventsWork: ReplayTimelineEvent[] = [];
        snapshots.forEach((snapshot: ReplayStageSnapshot) => {
            eventsWork.push(Object.freeze({ eventId: snapshot.snapshotId + "-stage", order: snapshot.order, scenario: snapshot.scenario, label: snapshot.title, severity: snapshot.status === "warning" ? "warning" : "pass", detail: snapshot.whyThisChanged }));
            snapshot.visualMarkers.filter((marker: ReplayVisualMarker) => marker.triggered).forEach((marker: ReplayVisualMarker) => {
                eventsWork.push(Object.freeze({ eventId: snapshot.snapshotId + "-" + marker.key, order: snapshot.order, scenario: snapshot.scenario, label: marker.label, severity: marker.severity, detail: marker.explanation }));
            });
        });
        const events: ReplayTimelineEvent[] = eventsWork.slice(0, this.maximumEvents);
        const nextWarningIndex: number = snapshots.findIndex((snapshot: ReplayStageSnapshot) => snapshot.status === "warning");
        return Object.freeze({
            packetType: "ArcSecs Experiment Replay Timeline",
            generatedUtc: new Date().toISOString(),
            playbackState: playbackState === "playing" ? "playing" : "paused",
            currentIndex: boundedIndex,
            currentSnapshotId: snapshots[boundedIndex] ? snapshots[boundedIndex].snapshotId : "none",
            snapshots: Object.freeze(snapshots),
            events: Object.freeze(events),
            summary: summarize(snapshots),
            nextWarningIndex,
            exportContainsExecutableCode: false,
            scientificBoundary: "Experiment Replay Timeline reports are inert browser-side playback summaries for the ArcSecs speculative sandbox; they do not prove the underlying physics model."
        });
    }

    public previous(timeline: ExperimentReplayTimelinePacket): ExperimentReplayTimelinePacket {
        return this.buildTimelineFromExisting(timeline, clampIndex(timeline.currentIndex - 1, timeline.snapshots.length), "paused");
    }

    public next(timeline: ExperimentReplayTimelinePacket): ExperimentReplayTimelinePacket {
        return this.buildTimelineFromExisting(timeline, clampIndex(timeline.currentIndex + 1, timeline.snapshots.length), timeline.playbackState === "playing" ? "playing" : "paused");
    }

    public play(timeline: ExperimentReplayTimelinePacket): ExperimentReplayTimelinePacket {
        return this.buildTimelineFromExisting(timeline, timeline.currentIndex, "playing");
    }

    public pause(timeline: ExperimentReplayTimelinePacket): ExperimentReplayTimelinePacket {
        return this.buildTimelineFromExisting(timeline, timeline.currentIndex, "paused");
    }

    public jumpToNextWarning(timeline: ExperimentReplayTimelinePacket): ExperimentReplayTimelinePacket {
        const index: number = timeline.nextWarningIndex >= 0 ? timeline.nextWarningIndex : timeline.currentIndex;
        return this.buildTimelineFromExisting(timeline, index, "paused");
    }

    public exportReport(timeline: ExperimentReplayTimelinePacket, context: Readonly<Record<string, unknown>> = {}): ExperimentReplayTimelineReport {
        return Object.freeze({ packetType: "ArcSecs Experiment Replay Timeline Report", generatedUtc: new Date().toISOString(), timeline, context, exportContainsExecutableCode: false, scientificBoundary: timeline.scientificBoundary });
    }

    private buildTimelineFromExisting(timeline: ExperimentReplayTimelinePacket, index: number, playbackState: ReplayPlaybackState): ExperimentReplayTimelinePacket {
        const boundedIndex: number = clampIndex(index, timeline.snapshots.length);
        return Object.freeze(Object.assign({}, timeline, { generatedUtc: new Date().toISOString(), playbackState, currentIndex: boundedIndex, currentSnapshotId: timeline.snapshots[boundedIndex] ? timeline.snapshots[boundedIndex].snapshotId : "none" }));
    }
}
