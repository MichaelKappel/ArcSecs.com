import type { ParameterGuidePreset, ParameterGuideValue } from "../guides/RunYourOwnSimulationGuide";

export type ExperimentPlaylistItemStatus = "queued" | "running" | "complete" | "warning" | "blocked";

export interface ExperimentPlaylistResultInput {
    readonly scenario?: string;
    readonly validationScore?: number;
    readonly warningCount?: number;
    readonly ledgerStatus?: string;
    readonly primaryMetric?: string;
    readonly primaryValue?: number;
}

export interface ExperimentPlaylistComparisonInput {
    readonly rows?: readonly {
        readonly presetId?: string;
        readonly validationScore?: number;
        readonly warningCount?: number;
        readonly stageStatus?: string;
    }[];
}

export interface ExperimentPlaylistItem {
    readonly order: number;
    readonly presetId: string;
    readonly title: string;
    readonly scenario: string;
    readonly audience: string;
    readonly expectedSignal: string;
    readonly parameterCount: number;
    readonly highlightedParameters: readonly string[];
    readonly status: ExperimentPlaylistItemStatus;
    readonly validationScore: number;
    readonly warningCount: number;
    readonly lastLedgerStatus: string;
    readonly operatorInstruction: string;
}

export interface ExperimentPlaylistSummary {
    readonly itemCount: number;
    readonly completedCount: number;
    readonly warningCount: number;
    readonly runningCount: number;
    readonly progressPercent: number;
    readonly readyToExport: boolean;
    readonly visitorSummary: string;
    readonly physicistSummary: string;
}

export interface ExperimentPlaylistPacket {
    readonly packetType: "ArcSecs Experiment Playlist Runner";
    readonly playlistId: string;
    readonly generatedUtc: string;
    readonly currentIndex: number;
    readonly currentPresetId: string;
    readonly currentScenario: string;
    readonly selectedPresetIds: readonly string[];
    readonly items: readonly ExperimentPlaylistItem[];
    readonly summary: ExperimentPlaylistSummary;
    readonly exportContainsExecutableCode: false;
    readonly scientificBoundary: string;
}

function uniqueLimited(values: readonly string[], maximumCount: number): readonly string[] {
    const selectedValues: string[] = [];
    values.forEach((value: string) => {
        if (value.length > 0 && selectedValues.indexOf(value) === -1 && selectedValues.length < maximumCount) {
            selectedValues.push(value);
        }
    });
    return Object.freeze(selectedValues);
}

function finiteNumber(value: unknown, fallback: number): number {
    const numericValue: number = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
}

function clamp(value: number, minimumValue: number, maximumValue: number): number {
    return Math.max(minimumValue, Math.min(maximumValue, value));
}

function summarize(items: readonly ExperimentPlaylistItem[]): ExperimentPlaylistSummary {
    const completedCount: number = items.filter((item: ExperimentPlaylistItem) => item.status === "complete" || item.status === "warning").length;
    const warningCount: number = items.reduce((total: number, item: ExperimentPlaylistItem) => total + item.warningCount + (item.status === "warning" ? 1 : 0), 0);
    const runningCount: number = items.filter((item: ExperimentPlaylistItem) => item.status === "running").length;
    const progressPercent: number = Math.round((completedCount / Math.max(1, items.length)) * 100);
    return Object.freeze({
        itemCount: items.length,
        completedCount,
        warningCount,
        runningCount,
        progressPercent,
        readyToExport: completedCount > 0,
        visitorSummary: "Run a queue of guided experiment recipes in sequence, then export one cautious batch report instead of isolated screenshots.",
        physicistSummary: "Playlist rows preserve scenario order, parameter counts, validation scores, warnings, and ledger status so the batch remains auditable."
    });
}

export class ExperimentPlaylistRunner {
    private readonly maximumItems: number;

    public constructor(maximumItems: number = 8) {
        this.maximumItems = Math.max(2, Math.min(12, Math.round(maximumItems)));
    }

    public normalizePresetIds(presetIds: readonly string[], availablePresets: readonly ParameterGuidePreset[]): readonly string[] {
        const availableIds: readonly string[] = availablePresets.map((preset: ParameterGuidePreset) => preset.presetId);
        const validIds: readonly string[] = presetIds.filter((presetId: string) => availableIds.indexOf(presetId) >= 0);
        if (validIds.length > 0) {
            return uniqueLimited(validIds, this.maximumItems);
        }
        return uniqueLimited(availableIds.slice(0, Math.min(5, this.maximumItems)), this.maximumItems);
    }

    public buildPlaylist(selectedPresetIds: readonly string[], availablePresets: readonly ParameterGuidePreset[], activeConfig: Readonly<Record<string, ParameterGuideValue>>, comparison: ExperimentPlaylistComparisonInput | null = null, currentIndex: number = 0): ExperimentPlaylistPacket {
        const selectedIds: readonly string[] = this.normalizePresetIds(selectedPresetIds, availablePresets);
        const boundedIndex: number = clamp(Math.round(currentIndex), 0, Math.max(0, selectedIds.length - 1));
        const items: readonly ExperimentPlaylistItem[] = selectedIds.map((presetId: string, index: number): ExperimentPlaylistItem => {
            const preset: ParameterGuidePreset = availablePresets.find((candidate: ParameterGuidePreset) => candidate.presetId === presetId) || availablePresets[0];
            const comparisonRow = comparison && comparison.rows ? comparison.rows.find((row) => row.presetId === preset.presetId) : undefined;
            const status: ExperimentPlaylistItemStatus = index === boundedIndex ? "running" : "queued";
            return Object.freeze({
                order: index + 1,
                presetId: preset.presetId,
                title: preset.title,
                scenario: preset.scenario,
                audience: preset.audience,
                expectedSignal: preset.expectedResult,
                parameterCount: Object.keys(preset.parameters).filter((parameterName: string) => activeConfig[parameterName] !== preset.parameters[parameterName]).length,
                highlightedParameters: preset.highlightedParameters.slice(),
                status,
                validationScore: finiteNumber(comparisonRow ? comparisonRow.validationScore : 0, 0),
                warningCount: finiteNumber(comparisonRow ? comparisonRow.warningCount : 0, 0),
                lastLedgerStatus: comparisonRow && comparisonRow.stageStatus ? comparisonRow.stageStatus : "not-yet-run",
                operatorInstruction: "Apply this recipe, run the scenario, verify the expected signal, then advance to the next playlist item."
            });
        });
        return this.buildPacket(selectedIds, items, boundedIndex);
    }

    public recordCurrentResult(playlist: ExperimentPlaylistPacket, result: ExperimentPlaylistResultInput | null = null): ExperimentPlaylistPacket {
        const currentIndex: number = clamp(playlist.currentIndex, 0, Math.max(0, playlist.items.length - 1));
        const items: readonly ExperimentPlaylistItem[] = playlist.items.map((item: ExperimentPlaylistItem, index: number): ExperimentPlaylistItem => {
            if (index !== currentIndex) {
                return item;
            }
            const warningCount: number = finiteNumber(result ? result.warningCount : item.warningCount, item.warningCount);
            const validationScore: number = finiteNumber(result ? result.validationScore : item.validationScore, item.validationScore);
            const lastLedgerStatus: string = result && result.ledgerStatus ? result.ledgerStatus : item.lastLedgerStatus;
            return Object.freeze({ ...item, status: warningCount > 0 || lastLedgerStatus === "warning" ? "warning" : "complete", warningCount, validationScore, lastLedgerStatus });
        });
        return this.buildPacket(playlist.selectedPresetIds, items, currentIndex);
    }

    public completeCurrent(playlist: ExperimentPlaylistPacket, result: ExperimentPlaylistResultInput | null = null): ExperimentPlaylistPacket {
        const currentIndex: number = clamp(playlist.currentIndex, 0, Math.max(0, playlist.items.length - 1));
        const nextIndex: number = clamp(currentIndex + 1, 0, Math.max(0, playlist.items.length - 1));
        const items: readonly ExperimentPlaylistItem[] = playlist.items.map((item: ExperimentPlaylistItem, index: number): ExperimentPlaylistItem => {
            if (index < currentIndex) {
                return item;
            }
            if (index === currentIndex) {
                const warningCount: number = finiteNumber(result ? result.warningCount : item.warningCount, item.warningCount);
                const validationScore: number = finiteNumber(result ? result.validationScore : item.validationScore, item.validationScore);
                const lastLedgerStatus: string = result && result.ledgerStatus ? result.ledgerStatus : item.lastLedgerStatus;
                return Object.freeze({ ...item, status: warningCount > 0 || lastLedgerStatus === "warning" ? "warning" : "complete", warningCount, validationScore, lastLedgerStatus });
            }
            if (index === nextIndex && nextIndex !== currentIndex) {
                return Object.freeze({ ...item, status: "running" });
            }
            return Object.freeze({ ...item, status: "queued" });
        });
        return this.buildPacket(playlist.selectedPresetIds, items, nextIndex);
    }

    public resetPlaylist(playlist: ExperimentPlaylistPacket): ExperimentPlaylistPacket {
        const items: readonly ExperimentPlaylistItem[] = playlist.items.map((item: ExperimentPlaylistItem, index: number): ExperimentPlaylistItem => Object.freeze({ ...item, status: index === 0 ? "running" : "queued", validationScore: 0, warningCount: 0, lastLedgerStatus: "not-yet-run" }));
        return this.buildPacket(playlist.selectedPresetIds, items, 0);
    }

    public currentItem(playlist: ExperimentPlaylistPacket): ExperimentPlaylistItem {
        return playlist.items[clamp(playlist.currentIndex, 0, Math.max(0, playlist.items.length - 1))];
    }

    private buildPacket(selectedIds: readonly string[], items: readonly ExperimentPlaylistItem[], currentIndex: number): ExperimentPlaylistPacket {
        const boundedIndex: number = clamp(currentIndex, 0, Math.max(0, items.length - 1));
        const currentItem: ExperimentPlaylistItem = items[boundedIndex];
        return Object.freeze({
            packetType: "ArcSecs Experiment Playlist Runner",
            playlistId: "arcsecs-playlist-" + selectedIds.join("-").replace(/[^a-z0-9-]/gi, "").slice(0, 72),
            generatedUtc: new Date().toISOString(),
            currentIndex: boundedIndex,
            currentPresetId: currentItem ? currentItem.presetId : "none",
            currentScenario: currentItem ? currentItem.scenario : "relationalLattice",
            selectedPresetIds: Object.freeze(selectedIds.slice()),
            items: Object.freeze(items.slice()),
            summary: summarize(items),
            exportContainsExecutableCode: false,
            scientificBoundary: "Experiment playlists are inert guided batches for the ArcSecs speculative sandbox; they organize review workflow and do not prove the underlying physics model."
        });
    }
}
