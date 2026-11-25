import type { ParameterGuidePreset, ParameterGuideValue } from "../guides/RunYourOwnSimulationGuide";

export interface ExperimentComparisonStageRow {
    readonly scenario: string;
    readonly status?: string;
    readonly validationScore?: number;
    readonly warningCount?: number;
    readonly primaryMetric?: string;
    readonly primaryValue?: number;
}

export interface ExperimentComparisonGrandTour {
    readonly rows?: readonly ExperimentComparisonStageRow[];
}

export interface ExperimentComparisonPresetRow {
    readonly presetId: string;
    readonly title: string;
    readonly scenario: string;
    readonly audience: string;
    readonly question: string;
    readonly expectedSignal: string;
    readonly highlightedParameters: readonly string[];
    readonly changedParameters: Readonly<Record<string, ParameterGuideValue>>;
    readonly assumptionLoad: number;
    readonly assumptionRisk: "low" | "medium" | "high";
    readonly stageStatus: string;
    readonly validationScore: number;
    readonly warningCount: number;
    readonly recommendation: string;
}

export interface ExperimentComparisonSummary {
    readonly presetCount: number;
    readonly scenarioCount: number;
    readonly highestRisk: "low" | "medium" | "high";
    readonly warningCount: number;
    readonly passCount: number;
    readonly visitorSummary: string;
    readonly physicistSummary: string;
}

export interface ExperimentComparisonWorkbenchPacket {
    readonly packetType: "ArcSecs Experiment Comparison Workbench";
    readonly generatedUtc: string;
    readonly selectedPresetIds: readonly string[];
    readonly rows: readonly ExperimentComparisonPresetRow[];
    readonly summary: ExperimentComparisonSummary;
    readonly exportContainsExecutableCode: false;
    readonly scientificBoundary: string;
}

const scenarioAssumptionMap: Readonly<Record<string, readonly string[]>> = Object.freeze({
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

function riskFromLoad(load: number, warnings: number): "low" | "medium" | "high" {
    if (load >= 5 || warnings >= 3) {
        return "high";
    }
    if (load >= 3 || warnings > 0) {
        return "medium";
    }
    return "low";
}

function higherRisk(left: "low" | "medium" | "high", right: "low" | "medium" | "high"): "low" | "medium" | "high" {
    const order: Readonly<Record<"low" | "medium" | "high", number>> = Object.freeze({ low: 1, medium: 2, high: 3 });
    return order[right] > order[left] ? right : left;
}

export class ExperimentComparisonWorkbench {
    public normalizeSelection(presetIds: readonly string[], availablePresets: readonly ParameterGuidePreset[]): readonly string[] {
        const availableIds: readonly string[] = availablePresets.map((preset: ParameterGuidePreset) => preset.presetId);
        const filteredIds: readonly string[] = presetIds.filter((presetId: string) => availableIds.indexOf(presetId) >= 0);
        if (filteredIds.length > 0) {
            return uniqueLimited(filteredIds, 4);
        }
        return uniqueLimited(availableIds.slice(0, 3), 4);
    }

    public buildComparison(selectedPresetIds: readonly string[], availablePresets: readonly ParameterGuidePreset[], activeConfig: Readonly<Record<string, ParameterGuideValue>>, grandTour: ExperimentComparisonGrandTour | null = null): ExperimentComparisonWorkbenchPacket {
        const selectedIds: readonly string[] = this.normalizeSelection(selectedPresetIds, availablePresets);
        const rows: ExperimentComparisonPresetRow[] = selectedIds.map((presetId: string): ExperimentComparisonPresetRow => {
            const preset: ParameterGuidePreset = availablePresets.find((candidate: ParameterGuidePreset) => candidate.presetId === presetId) || availablePresets[0];
            const stageRow: ExperimentComparisonStageRow | undefined = grandTour && grandTour.rows ? grandTour.rows.find((row: ExperimentComparisonStageRow) => row.scenario === preset.scenario) : undefined;
            const changedParameters: Record<string, ParameterGuideValue> = {};
            Object.keys(preset.parameters).forEach((parameterName: string) => {
                if (activeConfig[parameterName] !== preset.parameters[parameterName]) {
                    changedParameters[parameterName] = preset.parameters[parameterName];
                }
            });
            const assumptions: readonly string[] = scenarioAssumptionMap[preset.scenario] || Object.freeze(["Speculative ArcSecs assumption set"]);
            const warningCount: number = finiteNumber(stageRow ? stageRow.warningCount : 0, 0);
            const assumptionRisk: "low" | "medium" | "high" = riskFromLoad(assumptions.length, warningCount);
            const validationScore: number = finiteNumber(stageRow ? stageRow.validationScore : 0, 0);
            const stageStatus: string = stageRow && stageRow.status ? stageRow.status : "not-yet-run";
            return Object.freeze({
                presetId: preset.presetId,
                title: preset.title,
                scenario: preset.scenario,
                audience: preset.audience,
                question: preset.question,
                expectedSignal: preset.expectedResult,
                highlightedParameters: preset.highlightedParameters.slice(),
                changedParameters: Object.freeze(changedParameters),
                assumptionLoad: assumptions.length,
                assumptionRisk,
                stageStatus,
                validationScore,
                warningCount,
                recommendation: stageStatus === "pass" ? "Good comparison candidate; keep the speculative boundary visible." : "Run this recipe before presenting it as part of a comparison bundle."
            });
        });
        const scenarios: readonly string[] = uniqueLimited(rows.map((row: ExperimentComparisonPresetRow) => row.scenario), rows.length);
        const summary: ExperimentComparisonSummary = Object.freeze({
            presetCount: rows.length,
            scenarioCount: scenarios.length,
            highestRisk: rows.reduce((risk: "low" | "medium" | "high", row: ExperimentComparisonPresetRow) => higherRisk(risk, row.assumptionRisk), "low"),
            warningCount: rows.reduce((total: number, row: ExperimentComparisonPresetRow) => total + row.warningCount, 0),
            passCount: rows.filter((row: ExperimentComparisonPresetRow) => row.stageStatus === "pass").length,
            visitorSummary: "Compare selected recipes side by side, then run the ones with the clearest visible signal before sharing screenshots.",
            physicistSummary: "Comparison rows expose assumption load, validation status, warnings, and parameter deltas so speculative claims remain auditable."
        });
        return Object.freeze({
            packetType: "ArcSecs Experiment Comparison Workbench",
            generatedUtc: new Date().toISOString(),
            selectedPresetIds: selectedIds,
            rows: Object.freeze(rows),
            summary,
            exportContainsExecutableCode: false,
            scientificBoundary: "Experiment comparisons are inert recipe summaries for the ArcSecs speculative sandbox; they do not prove the underlying physics model."
        });
    }
}
