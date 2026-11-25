export type SensitivitySeverity = "pass" | "info" | "warning";
export type SensitivityScenarioKey = "massivePhotonLensing" | "tiredLightEnergyLedger" | "darkMatterRamjet" | "absoluteTimeQuantumOscillator" | "newtonianDarkStar" | "superluminalGalilean" | "darkMatterCondensate" | "parallaxCalibration" | "relationalLattice";

export interface SensitivityAxisDefinition {
    readonly key: string;
    readonly label: string;
    readonly minimum: number;
    readonly maximum: number;
    readonly steps: number;
    readonly unit: string;
    readonly explanation: string;
}

export interface SensitivityScanInput {
    readonly scenario?: string;
    readonly activeConfig?: Readonly<Record<string, string | number | boolean>>;
    readonly latestMetrics?: Readonly<Record<string, string | number | boolean>> | null;
    readonly replayTimeline?: Readonly<{ readonly snapshots?: readonly SensitivityReplaySnapshotInput[] }> | null;
}

export interface SensitivityReplaySnapshotInput {
    readonly scenario?: string;
    readonly title?: string;
    readonly visualMarkers?: readonly SensitivityReplayMarkerInput[];
    readonly beforeAfterMetrics?: readonly SensitivityReplayMetricInput[];
}

export interface SensitivityReplayMetricInput {
    readonly key?: string;
    readonly afterValue?: number;
    readonly delta?: number;
}

export interface SensitivityReplayMarkerInput {
    readonly key?: string;
    readonly triggered?: boolean;
}

export interface SensitivityScanPoint {
    readonly index: number;
    readonly axisValue: number;
    readonly axisText: string;
    readonly metricValue: number;
    readonly metricText: string;
    readonly deltaFromBaseline: number;
    readonly deltaText: string;
    readonly severity: SensitivitySeverity;
    readonly markerLabels: readonly string[];
    readonly explanation: string;
}

export interface SensitivityTippingPoint {
    readonly pointIndex: number;
    readonly axisValue: number;
    readonly label: string;
    readonly severity: SensitivitySeverity;
    readonly explanation: string;
}

export interface SensitivityScanSummary {
    readonly scenario: string;
    readonly stageCount: number;
    readonly warningCount: number;
    readonly strongestChangeText: string;
    readonly recommendedAction: string;
    readonly visitorSummary: string;
    readonly physicistSummary: string;
}

export interface ExperimentSensitivityScanPacket {
    readonly packetType: "ArcSecs Experiment Sensitivity Scanner";
    readonly generatedUtc: string;
    readonly scenario: string;
    readonly axis: SensitivityAxisDefinition;
    readonly points: readonly SensitivityScanPoint[];
    readonly tippingPoints: readonly SensitivityTippingPoint[];
    readonly summary: SensitivityScanSummary;
    readonly readyToExport: boolean;
    readonly exportContainsExecutableCode: false;
    readonly scientificBoundary: string;
}

export interface ExperimentSensitivityScanReport {
    readonly packetType: "ArcSecs Experiment Sensitivity Scanner Report";
    readonly generatedUtc: string;
    readonly scan: ExperimentSensitivityScanPacket;
    readonly context: Readonly<Record<string, unknown>>;
    readonly exportContainsExecutableCode: false;
    readonly scientificBoundary: string;
}

const scenarioAxes: Readonly<Record<string, SensitivityAxisDefinition>> = Object.freeze({
    massivePhotonLensing: Object.freeze({ key: "photonMassEv", label: "Photon mass / coupling", minimum: 0, maximum: 2, steps: 7, unit: "eV proxy", explanation: "Sweeps the non-zero photon mass/coupling branch to show how quickly lensing departs from the zero-mass baseline." }),
    tiredLightEnergyLedger: Object.freeze({ key: "lossRate", label: "Tired-light attenuation", minimum: 0, maximum: 0.018, steps: 7, unit: "loss", explanation: "Sweeps attenuation to reveal when redshift growth remains ledger-closed versus warning-prone." }),
    darkMatterRamjet: Object.freeze({ key: "thermalRejectionCapacity", label: "Radiator capacity", minimum: 4, maximum: 40, steps: 7, unit: "MW proxy", explanation: "Sweeps radiator capacity to show where the ramjet thermal bottleneck appears or clears." }),
    absoluteTimeQuantumOscillator: Object.freeze({ key: "betaCoupling", label: "Gravitational damping coefficient", minimum: 0, maximum: 1.8, steps: 7, unit: "damping", explanation: "Sweeps the oscillator damping term while global time remains shared." }),
    newtonianDarkStar: Object.freeze({ key: "speedMultiplier", label: "Photon launch velocity proxy", minimum: 0.35, maximum: 1.4, steps: 7, unit: "c proxy", explanation: "Sweeps the launch-speed margin around the Newtonian escape threshold." }),
    superluminalGalilean: Object.freeze({ key: "speedMultiplier", label: "Opposing body speed", minimum: 0.4, maximum: 2.2, steps: 7, unit: "c proxy", explanation: "Sweeps direct Galilean relative velocity with no Lorentz limiter." }),
    darkMatterCondensate: Object.freeze({ key: "lossRate", label: "Condensate feed rate", minimum: 0, maximum: 0.024, steps: 7, unit: "feed", explanation: "Sweeps tired-light ledger feed rate into the condensate halo proxy." }),
    parallaxCalibration: Object.freeze({ key: "acceptedSteps", label: "Calibration sample count", minimum: 500, maximum: 9000, steps: 7, unit: "ticks", explanation: "Sweeps deterministic sample count to show calibration stability." }),
    relationalLattice: Object.freeze({ key: "acceptedSteps", label: "Relational solve ticks", minimum: 500, maximum: 9000, steps: 7, unit: "ticks", explanation: "Sweeps fixed-step solve length to expose stability of relational links." })
});

function finiteNumber(value: unknown, fallback: number): number {
    const numericValue: number = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
}

function formatValue(value: number): string {
    const numericValue: number = finiteNumber(value, 0);
    if (Math.abs(numericValue) >= 10000 || (Math.abs(numericValue) < 0.001 && numericValue !== 0)) {
        return numericValue.toExponential(3);
    }
    return numericValue.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

function readConfigValue(config: Readonly<Record<string, string | number | boolean>>, key: string, fallback: number): number {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
        return finiteNumber(config[key], fallback);
    }
    return fallback;
}

function buildAxisValues(axis: SensitivityAxisDefinition): readonly number[] {
    const steps: number = Math.max(3, Math.min(11, Math.round(finiteNumber(axis.steps, 7))));
    const values: number[] = [];
    for (let index: number = 0; index < steps; index += 1) {
        const ratio: number = steps === 1 ? 0 : index / (steps - 1);
        values.push(axis.minimum + ((axis.maximum - axis.minimum) * ratio));
    }
    return Object.freeze(values);
}

function normalizeScenario(scenario: string | undefined): SensitivityScenarioKey {
    const key: string = String(scenario || "massivePhotonLensing");
    return Object.prototype.hasOwnProperty.call(scenarioAxes, key) ? key as SensitivityScenarioKey : "relationalLattice";
}

function metricForScenario(scenario: SensitivityScenarioKey, axisValue: number, config: Readonly<Record<string, string | number | boolean>>): number {
    if (scenario === "massivePhotonLensing") {
        const impactParameter: number = Math.max(0.2, readConfigValue(config, "impactParameter", 1.4));
        return (0.08 + axisValue * 0.34) / impactParameter;
    }
    if (scenario === "tiredLightEnergyLedger") {
        const distanceScale: number = Math.max(1, readConfigValue(config, "acceptedSteps", 6000) / 6000);
        return 1 - Math.exp(-axisValue * 90 * distanceScale);
    }
    if (scenario === "darkMatterRamjet") {
        const substrateDensity: number = Math.max(0.1, readConfigValue(config, "substrateDensity", 1.6));
        const shipVelocity: number = Math.max(0.05, readConfigValue(config, "shipVelocityRatioC", 0.66));
        const demand: number = substrateDensity * shipVelocity * 18;
        return demand / Math.max(0.1, axisValue);
    }
    if (scenario === "absoluteTimeQuantumOscillator") {
        return Math.max(0, axisValue * 0.22);
    }
    if (scenario === "newtonianDarkStar") {
        return axisValue - 1;
    }
    if (scenario === "superluminalGalilean") {
        return axisValue * 2;
    }
    if (scenario === "darkMatterCondensate") {
        return axisValue * 42;
    }
    if (scenario === "parallaxCalibration") {
        return Math.min(1, Math.max(0, axisValue / 9000));
    }
    return Math.min(1, Math.max(0, axisValue / 9000));
}

function severityForScenario(scenario: SensitivityScenarioKey, metricValue: number, delta: number): SensitivitySeverity {
    if (scenario === "darkMatterRamjet") {
        return metricValue >= 1 ? "warning" : "pass";
    }
    if (scenario === "tiredLightEnergyLedger") {
        return metricValue > 0.78 ? "warning" : metricValue > 0.25 ? "info" : "pass";
    }
    if (scenario === "newtonianDarkStar") {
        return metricValue < 0 ? "warning" : "pass";
    }
    if (Math.abs(delta) > 0.2) {
        return "info";
    }
    return "pass";
}

function markerLabelsForScenario(scenario: SensitivityScenarioKey, metricValue: number, severity: SensitivitySeverity): readonly string[] {
    const labels: string[] = [];
    if (scenario === "massivePhotonLensing" && metricValue > 0.25) { labels.push("deflection increase"); }
    if (scenario === "tiredLightEnergyLedger") { labels.push(severity === "warning" ? "ledger warning threshold" : "ledger closure watch"); }
    if (scenario === "darkMatterRamjet" && metricValue >= 1) { labels.push("radiator bottleneck", "net acceleration drop risk"); }
    if (scenario === "newtonianDarkStar" && metricValue < 0) { labels.push("capture threshold"); }
    if (scenario === "superluminalGalilean" && metricValue > 1) { labels.push("relative velocity above c"); }
    if (scenario === "darkMatterCondensate" && metricValue > 0.5) { labels.push("halo growth"); }
    return Object.freeze(labels);
}

function explanationForPoint(scenario: SensitivityScenarioKey, axis: SensitivityAxisDefinition, point: number, metricValue: number, severity: SensitivitySeverity): string {
    if (scenario === "darkMatterRamjet") {
        return severity === "warning" ? "At " + formatValue(point) + " " + axis.unit + ", radiator load remains above capacity, so heat becomes the limiting variable." : "At " + formatValue(point) + " " + axis.unit + ", radiator capacity is sufficient for this proxy load.";
    }
    if (scenario === "massivePhotonLensing") {
        return "At " + formatValue(point) + " " + axis.unit + ", the curved-path proxy becomes " + formatValue(metricValue) + " arcsec-like units.";
    }
    if (scenario === "tiredLightEnergyLedger") {
        return severity === "warning" ? "This attenuation setting pushes redshift high enough that the ledger needs close inspection." : "This attenuation setting changes redshift while staying in the normal ledger-watch range.";
    }
    return "Changing " + axis.label + " to " + formatValue(point) + " changes the scenario response to " + formatValue(metricValue) + ".";
}

function summarize(scenario: SensitivityScenarioKey, points: readonly SensitivityScanPoint[]): SensitivityScanSummary {
    let strongestIndex: number = -1;
    let strongestMagnitude: number = -1;
    points.forEach((point: SensitivityScanPoint, index: number) => {
        const magnitude: number = Math.abs(point.deltaFromBaseline);
        if (magnitude > strongestMagnitude) {
            strongestMagnitude = magnitude;
            strongestIndex = index;
        }
    });
    const warningCount: number = points.filter((point: SensitivityScanPoint) => point.severity === "warning").length;
    const strongestPoint: SensitivityScanPoint | undefined = strongestIndex >= 0 ? points[strongestIndex] : undefined;
    const strongestText: string = strongestPoint ? strongestPoint.axisText + " produced delta " + strongestPoint.deltaText : "No scan points available";
    const action: string = warningCount > 0 ? "Jump to the first warning point, then rerun the playlist with a safer parameter range." : "Use this range as a safe comparison sweep, then export the sensitivity report.";
    return Object.freeze({
        scenario,
        stageCount: points.length,
        warningCount,
        strongestChangeText: strongestText,
        recommendedAction: action,
        visitorSummary: "Sensitivity Scanner swept " + points.length.toString() + " values and found " + warningCount.toString() + " warning point" + (warningCount === 1 ? "" : "s") + ".",
        physicistSummary: "Scanner reports deterministic parameter response deltas, marker thresholds, and warning transitions for one ArcSecs sandbox control."
    });
}

function buildTippingPoints(points: readonly SensitivityScanPoint[]): readonly SensitivityTippingPoint[] {
    const tippingPoints: SensitivityTippingPoint[] = [];
    points.forEach((point: SensitivityScanPoint) => {
        if (point.severity === "warning" || point.markerLabels.length > 0) {
            tippingPoints.push(Object.freeze({ pointIndex: point.index, axisValue: point.axisValue, label: point.markerLabels.length > 0 ? point.markerLabels.join(" / ") : "warning threshold", severity: point.severity, explanation: point.explanation }));
        }
    });
    return Object.freeze(tippingPoints.slice(0, 8));
}

export class ExperimentSensitivityScanner {
    public listSupportedScans(): readonly SensitivityAxisDefinition[] {
        const keys: readonly string[] = Object.keys(scenarioAxes);
        return Object.freeze(keys.map((key: string) => scenarioAxes[key]));
    }

    public buildScan(input: SensitivityScanInput = {}): ExperimentSensitivityScanPacket {
        const activeConfig: Readonly<Record<string, string | number | boolean>> = input.activeConfig || {};
        const scenario: SensitivityScenarioKey = normalizeScenario(input.scenario || String(activeConfig.scenario || "massivePhotonLensing"));
        const axis: SensitivityAxisDefinition = scenarioAxes[scenario];
        const axisValues: readonly number[] = buildAxisValues(axis);
        const baselineMetric: number = metricForScenario(scenario, axisValues[0], activeConfig);
        const points: readonly SensitivityScanPoint[] = Object.freeze(axisValues.map((axisValue: number, index: number) => {
            const metricValue: number = metricForScenario(scenario, axisValue, activeConfig);
            const delta: number = metricValue - baselineMetric;
            const severity: SensitivitySeverity = severityForScenario(scenario, metricValue, delta);
            const markerLabels: readonly string[] = markerLabelsForScenario(scenario, metricValue, severity);
            return Object.freeze({ index, axisValue, axisText: formatValue(axisValue) + " " + axis.unit, metricValue, metricText: formatValue(metricValue), deltaFromBaseline: delta, deltaText: formatValue(delta), severity, markerLabels, explanation: explanationForPoint(scenario, axis, axisValue, metricValue, severity) });
        }));
        return Object.freeze({
            packetType: "ArcSecs Experiment Sensitivity Scanner",
            generatedUtc: new Date().toISOString(),
            scenario,
            axis,
            points,
            tippingPoints: buildTippingPoints(points),
            summary: summarize(scenario, points),
            readyToExport: points.length > 0,
            exportContainsExecutableCode: false,
            scientificBoundary: "Experiment Sensitivity Scanner reports are deterministic parameter sweeps for the ArcSecs speculative sandbox; they are not measured physical validation."
        });
    }

    public exportReport(scan: ExperimentSensitivityScanPacket, context: Readonly<Record<string, unknown>> = {}): ExperimentSensitivityScanReport {
        return Object.freeze({ packetType: "ArcSecs Experiment Sensitivity Scanner Report", generatedUtc: new Date().toISOString(), scan, context, exportContainsExecutableCode: false, scientificBoundary: scan.scientificBoundary });
    }
}
