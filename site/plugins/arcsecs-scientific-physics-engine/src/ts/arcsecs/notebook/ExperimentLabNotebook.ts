export type LabNotebookSource = "scenario-run" | "recipe-run" | "playlist-run" | "manual-save";

export interface LabNotebookMetricInput {
    readonly baselineDelta?: number;
    readonly finalEnergyFraction?: number;
    readonly finalRedshift?: number;
    readonly energyLedgerClosureProxy?: number;
    readonly ramjetBufferFill?: number;
    readonly ramjetRadiatorLoad?: number;
    readonly ramjetThrustProxy?: number;
    readonly ramjetWarnings?: string;
    readonly ledgerStatus?: string;
    readonly scenarioRisk?: string;
    readonly warningCount?: number;
}

export interface LabNotebookResultInput {
    readonly source: LabNotebookSource;
    readonly scenario: string;
    readonly scenarioLabel: string;
    readonly presetId?: string;
    readonly presetTitle?: string;
    readonly acceptedSteps?: number;
    readonly validationScore?: number;
    readonly warningCount?: number;
    readonly metrics?: LabNotebookMetricInput;
    readonly playlistId?: string;
    readonly playlistItemOrder?: number;
    readonly activeConfig?: Readonly<Record<string, string | number | boolean>>;
}

export interface LabNotebookMetricCard {
    readonly key: string;
    readonly label: string;
    readonly value: string;
    readonly numericValue: number;
    readonly unit: string;
    readonly status: "pass" | "warning" | "review";
    readonly explanation: string;
}

export interface LabNotebookEntry {
    readonly entryId: string;
    readonly createdUtc: string;
    readonly source: LabNotebookSource;
    readonly scenario: string;
    readonly scenarioLabel: string;
    readonly presetId: string;
    readonly presetTitle: string;
    readonly acceptedSteps: number;
    readonly validationScore: number;
    readonly warningCount: number;
    readonly ledgerStatus: string;
    readonly visitorSummary: string;
    readonly physicistSummary: string;
    readonly metricCards: readonly LabNotebookMetricCard[];
    readonly playlistId: string;
    readonly playlistItemOrder: number;
    readonly activeConfig: Readonly<Record<string, string | number | boolean>>;
}

export interface LabNotebookSummary {
    readonly entryCount: number;
    readonly warningCount: number;
    readonly averageValidationScore: number;
    readonly latestScenario: string;
    readonly readyToExport: boolean;
    readonly visitorSummary: string;
    readonly physicistSummary: string;
}

export interface ExperimentLabNotebookPacket {
    readonly packetType: "ArcSecs Experiment Lab Notebook";
    readonly notebookId: string;
    readonly generatedUtc: string;
    readonly entries: readonly LabNotebookEntry[];
    readonly summary: LabNotebookSummary;
    readonly exportContainsExecutableCode: false;
    readonly scientificBoundary: string;
}

function finiteNumber(value: unknown, fallback: number): number {
    const numericValue: number = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
}

function formatMetric(value: number): string {
    if (!Number.isFinite(value)) {
        return "—";
    }
    if (Math.abs(value) >= 10000 || (Math.abs(value) < 0.001 && value !== 0)) {
        return value.toExponential(3);
    }
    return value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

function statusFromWarnings(warningCount: number, ledgerStatus: string): "pass" | "warning" | "review" {
    if (warningCount > 0 || ledgerStatus === "warning" || ledgerStatus === "fail") {
        return "warning";
    }
    if (ledgerStatus !== "pass") {
        return "review";
    }
    return "pass";
}

function buildVisitorSummary(input: LabNotebookResultInput, ledgerStatus: string, warningCount: number): string {
    const label: string = input.scenarioLabel || input.scenario;
    if (input.scenario === "massivePhotonLensing") {
        return "Photon deflection was recorded for the massive-photon lensing recipe; compare photon mass, impact parameter, and the standard reference lines before treating the signal as meaningful.";
    }
    if (input.scenario === "tiredLightEnergyLedger") {
        return "Photon energy loss and redshift were recorded with ledger status " + ledgerStatus + "; the important visitor takeaway is whether the lost energy is accounted for.";
    }
    if (input.scenario === "darkMatterRamjet") {
        return "The ramjet pipeline result was recorded; buffer fill, radiator load, warnings, and thrust proxy show which subsystem bottlenecked first.";
    }
    if (input.scenario === "absoluteTimeQuantumOscillator") {
        return "The oscillator result was recorded; global time remains shared while local transition counts are compared as mechanical damping signals.";
    }
    if (warningCount > 0) {
        return label + " was recorded with warnings, so use it as a review case rather than a visitor-ready claim.";
    }
    return label + " was recorded in the Lab Notebook with validation and ledger telemetry ready for comparison.";
}

function buildPhysicistSummary(input: LabNotebookResultInput, validationScore: number, warningCount: number, ledgerStatus: string): string {
    const sourceText: string = input.source === "playlist-run" ? "playlist item" : input.source === "recipe-run" ? "recipe run" : input.source === "manual-save" ? "manual save" : "scenario run";
    return "Recorded " + sourceText + " for " + (input.scenarioLabel || input.scenario) + ": validation " + (validationScore * 100).toFixed(1) + "%, warnings " + warningCount.toString() + ", ledger " + ledgerStatus + ". Treat this as an auditable sandbox result, not empirical confirmation.";
}

function buildMetricCard(key: string, label: string, rawValue: unknown, unit: string, warningThreshold: number, explanation: string): LabNotebookMetricCard {
    const numericValue: number = finiteNumber(rawValue, 0);
    const status: "pass" | "warning" | "review" = Math.abs(numericValue) > warningThreshold ? "warning" : "pass";
    return Object.freeze({ key, label, value: formatMetric(numericValue), numericValue, unit, status, explanation });
}

function buildMetricCards(input: LabNotebookResultInput, validationScore: number, warningCount: number, ledgerStatus: string): readonly LabNotebookMetricCard[] {
    const metrics: LabNotebookMetricInput = input.metrics || {};
    const cards: LabNotebookMetricCard[] = [
        Object.freeze({ key: "validationScore", label: "Validation score", value: formatMetric(validationScore * 100), numericValue: validationScore, unit: "%", status: validationScore >= 0.72 ? "pass" : "review", explanation: "Scenario validation proxy from the active run." }),
        Object.freeze({ key: "warningCount", label: "Warning count", value: warningCount.toString(), numericValue: warningCount, unit: "warnings", status: warningCount > 0 ? "warning" : "pass", explanation: "Visible warning budget captured with this result." }),
        Object.freeze({ key: "ledgerStatus", label: "Ledger status", value: ledgerStatus, numericValue: ledgerStatus === "pass" ? 1 : 0, unit: "state", status: statusFromWarnings(warningCount, ledgerStatus), explanation: "Energy/accounting state reported by the run." }),
        buildMetricCard("baselineDelta", "Baseline delta", metrics.baselineDelta, "delta", 1.5, "Difference between baseline and speculative branch."),
        buildMetricCard("finalRedshift", "Redshift", metrics.finalRedshift, "z", 4, "Tired-light redshift proxy when available."),
        buildMetricCard("finalEnergyFraction", "Photon energy", metrics.finalEnergyFraction, "fraction", 1.1, "Remaining photon energy fraction when available."),
        buildMetricCard("ramjetBufferFill", "Buffer fill", metrics.ramjetBufferFill, "ratio", 1, "Dark Matter Ramjet buffer fill when available."),
        buildMetricCard("ramjetRadiatorLoad", "Radiator load", metrics.ramjetRadiatorLoad, "ratio", 1, "Thermal rejection load when available."),
        buildMetricCard("ramjetThrustProxy", "Thrust proxy", metrics.ramjetThrustProxy, "proxy", 1000000, "Conceptual thrust signal for the ramjet pipeline.")
    ];
    return Object.freeze(cards);
}

function buildEntryId(input: LabNotebookResultInput, index: number): string {
    const source: string = input.source.replace(/[^a-z0-9-]/gi, "").toLowerCase();
    const scenario: string = input.scenario.replace(/[^a-z0-9-]/gi, "").toLowerCase().slice(0, 32);
    return "arcsecs-note-" + source + "-" + scenario + "-" + (index + 1 < 10 ? "0" : "") + String(index + 1);
}

function summarize(entries: readonly LabNotebookEntry[]): LabNotebookSummary {
    const warningCount: number = entries.reduce((total: number, entry: LabNotebookEntry) => total + entry.warningCount + (entry.ledgerStatus === "pass" ? 0 : 1), 0);
    const averageValidationScore: number = entries.length > 0 ? entries.reduce((total: number, entry: LabNotebookEntry) => total + entry.validationScore, 0) / entries.length : 0;
    const latest: LabNotebookEntry | undefined = entries[0];
    return Object.freeze({
        entryCount: entries.length,
        warningCount,
        averageValidationScore,
        latestScenario: latest ? latest.scenario : "none",
        readyToExport: entries.length > 0,
        visitorSummary: entries.length > 0 ? "The Lab Notebook has " + entries.length.toString() + " saved result" + (entries.length === 1 ? "" : "s") + " with visible summaries, metric cards, and cautious copy text." : "Run or save an experiment to create the first Lab Notebook result.",
        physicistSummary: entries.length > 0 ? "Average validation " + (averageValidationScore * 100).toFixed(1) + "%, warning budget " + warningCount.toString() + "; notebook entries preserve source, scenario, ledger, metric cards, and active config." : "Notebook is empty; no run evidence has been captured."
    });
}

export class ExperimentLabNotebook {
    private readonly maximumEntries: number;

    public constructor(maximumEntries: number = 12) {
        this.maximumEntries = Math.max(3, Math.min(30, Math.round(finiteNumber(maximumEntries, 12))));
    }

    public createEmpty(notebookId: string = "arcsecs-lab-notebook"): ExperimentLabNotebookPacket {
        return this.buildPacket(notebookId, []);
    }

    public restore(rawPacket: unknown, notebookId: string = "arcsecs-lab-notebook"): ExperimentLabNotebookPacket {
        const packet: { readonly entries?: readonly LabNotebookEntry[]; readonly notebookId?: string } = (rawPacket && typeof rawPacket === "object") ? rawPacket as { readonly entries?: readonly LabNotebookEntry[]; readonly notebookId?: string } : {};
        const entries: readonly LabNotebookEntry[] = Array.isArray(packet.entries) ? packet.entries.slice(0, this.maximumEntries) : [];
        return this.buildPacket(packet.notebookId || notebookId, entries);
    }

    public addResult(packet: ExperimentLabNotebookPacket, input: LabNotebookResultInput): ExperimentLabNotebookPacket {
        const validationScore: number = Math.max(0, Math.min(1, finiteNumber(input.validationScore, 0)));
        const warningCount: number = Math.max(0, Math.round(finiteNumber(input.warningCount, 0)));
        const ledgerStatus: string = input.metrics && input.metrics.ledgerStatus ? String(input.metrics.ledgerStatus) : "pass";
        const previousEntries: readonly LabNotebookEntry[] = packet && Array.isArray(packet.entries) ? packet.entries : [];
        const entry: LabNotebookEntry = Object.freeze({
            entryId: buildEntryId(input, previousEntries.length),
            createdUtc: new Date().toISOString(),
            source: input.source,
            scenario: input.scenario,
            scenarioLabel: input.scenarioLabel || input.scenario,
            presetId: input.presetId || "manual",
            presetTitle: input.presetTitle || input.scenarioLabel || input.scenario,
            acceptedSteps: Math.max(0, Math.round(finiteNumber(input.acceptedSteps, 0))),
            validationScore,
            warningCount,
            ledgerStatus,
            visitorSummary: buildVisitorSummary(input, ledgerStatus, warningCount),
            physicistSummary: buildPhysicistSummary(input, validationScore, warningCount, ledgerStatus),
            metricCards: buildMetricCards(input, validationScore, warningCount, ledgerStatus),
            playlistId: input.playlistId || "none",
            playlistItemOrder: Math.max(0, Math.round(finiteNumber(input.playlistItemOrder, 0))),
            activeConfig: Object.freeze(Object.assign({}, input.activeConfig || {}))
        });
        return this.buildPacket(packet.notebookId, [entry].concat(previousEntries).slice(0, this.maximumEntries));
    }

    public buildVisitorCopy(packet: ExperimentLabNotebookPacket): string {
        const lines: string[] = packet.entries.slice(0, 5).map((entry: LabNotebookEntry) => "- " + entry.scenarioLabel + ": " + entry.visitorSummary);
        return "ArcSecs Experiment Lab Notebook\n" + packet.summary.visitorSummary + "\n" + lines.join("\n") + "\nBoundary: " + packet.scientificBoundary;
    }

    public buildPhysicistCopy(packet: ExperimentLabNotebookPacket): string {
        const lines: string[] = packet.entries.slice(0, 5).map((entry: LabNotebookEntry) => "- " + entry.physicistSummary);
        return "ArcSecs Lab Notebook physicist summary\n" + packet.summary.physicistSummary + "\n" + lines.join("\n") + "\nBoundary: " + packet.scientificBoundary;
    }

    public buildPacket(notebookId: string, entries: readonly LabNotebookEntry[]): ExperimentLabNotebookPacket {
        const safeEntries: readonly LabNotebookEntry[] = Object.freeze(entries.slice(0, this.maximumEntries));
        return Object.freeze({
            packetType: "ArcSecs Experiment Lab Notebook",
            notebookId: notebookId || "arcsecs-lab-notebook",
            generatedUtc: new Date().toISOString(),
            entries: safeEntries,
            summary: summarize(safeEntries),
            exportContainsExecutableCode: false,
            scientificBoundary: "Experiment Lab Notebook entries are inert browser-side summaries for the ArcSecs speculative sandbox; they do not prove the underlying physics model."
        });
    }
}
