import type { ParameterGuidePreset, ParameterGuideValue } from "../guides/RunYourOwnSimulationGuide";

export type ExperimentRecipeValue = ParameterGuideValue;
export type ExperimentRecipeValidationStatus = "pass" | "warning" | "failed";
export type ExperimentRecipeIssueSeverity = "info" | "warning" | "error";

export interface ExperimentRecipeValidationIssue {
    readonly field: string;
    readonly severity: ExperimentRecipeIssueSeverity;
    readonly message: string;
}

export interface ExperimentRecipe {
    readonly packetType: "ArcSecs Experiment Recipe";
    readonly recipeId: string;
    readonly title: string;
    readonly sourcePresetId: string;
    readonly scenario: string;
    readonly generatedUtc: string;
    readonly parameters: Readonly<Record<string, ExperimentRecipeValue>>;
    readonly highlightedParameters: readonly string[];
    readonly validationStatus: ExperimentRecipeValidationStatus;
    readonly validationIssues: readonly ExperimentRecipeValidationIssue[];
    readonly shareToken: string;
    readonly exportContainsExecutableCode: false;
    readonly scientificBoundary: string;
}

export interface ExperimentRecipeValidationResult {
    readonly status: ExperimentRecipeValidationStatus;
    readonly issues: readonly ExperimentRecipeValidationIssue[];
    readonly normalizedParameters: Readonly<Record<string, ExperimentRecipeValue>>;
}

export interface ExperimentRecipeShareState {
    readonly recipe: ExperimentRecipe;
    readonly shareUrl: string;
    readonly queryParameterName: "arcsecsRecipe";
    readonly exportContainsExecutableCode: false;
}

interface NumericRange {
    readonly minimum: number;
    readonly maximum: number;
}

const numericRanges: Readonly<Record<string, NumericRange>> = Object.freeze({
    acceptedSteps: Object.freeze({ minimum: 500, maximum: 25000 }),
    speedMultiplier: Object.freeze({ minimum: 0.1, maximum: 5 }),
    lossRate: Object.freeze({ minimum: 0, maximum: 1 }),
    photonMassEv: Object.freeze({ minimum: 0, maximum: 1e-12 }),
    betaCoupling: Object.freeze({ minimum: 0, maximum: 10 }),
    accelerationThreshold: Object.freeze({ minimum: 0, maximum: 20 }),
    baryonicMass: Object.freeze({ minimum: 0, maximum: 50 }),
    groupVelocityFraction: Object.freeze({ minimum: 0.01, maximum: 1 }),
    restitution: Object.freeze({ minimum: 0, maximum: 1 }),
    friction: Object.freeze({ minimum: 0, maximum: 1 }),
    photonPacketCount: Object.freeze({ minimum: 8, maximum: 2500 }),
    intergalacticParticleDensity: Object.freeze({ minimum: 0, maximum: 10 }),
    forwardScatteringStrictness: Object.freeze({ minimum: 0, maximum: 1 }),
    softeningRadius: Object.freeze({ minimum: 0.001, maximum: 10 }),
    parallaxArcseconds: Object.freeze({ minimum: 0.001, maximum: 1000 }),
    baselineAu: Object.freeze({ minimum: 0.01, maximum: 20 }),
    scoopFieldDiameterKilometers: Object.freeze({ minimum: 0, maximum: 12000 }),
    substrateDensity: Object.freeze({ minimum: 0, maximum: 10 }),
    shipVelocityRatioC: Object.freeze({ minimum: 0, maximum: 2 }),
    intakeDragCoefficient: Object.freeze({ minimum: 0, maximum: 5 }),
    shieldAblationRate: Object.freeze({ minimum: 0, maximum: 1 }),
    compressionRatio: Object.freeze({ minimum: 1, maximum: 80 }),
    bufferCapacity: Object.freeze({ minimum: 1, maximum: 120 }),
    reactorConversionEfficiency: Object.freeze({ minimum: 0, maximum: 1 }),
    thermalRejectionCapacity: Object.freeze({ minimum: 0, maximum: 100 }),
    exhaustCollimationEfficiency: Object.freeze({ minimum: 0, maximum: 1 }),
    stabilizationGain: Object.freeze({ minimum: 0, maximum: 4 }),
    radiatorReserve: Object.freeze({ minimum: 0, maximum: 1 }),
    habitatIsolationFactor: Object.freeze({ minimum: 0, maximum: 1 })
});

const textFields: readonly string[] = Object.freeze(["scenario", "ramjetPreset", "comparisonMode", "failureInjectionMode"]);
const booleanFields: readonly string[] = Object.freeze(["showLabels", "showGrid", "showVectors", "showTrails", "showDiagnostics"]);

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeValue(fieldName: string, value: unknown): ExperimentRecipeValue | undefined {
    if (Object.prototype.hasOwnProperty.call(numericRanges, fieldName)) {
        const numericValue: number = typeof value === "number" ? value : Number(value);
        return Number.isFinite(numericValue) ? numericValue : undefined;
    }
    if (booleanFields.indexOf(fieldName) >= 0) {
        if (typeof value === "boolean") {
            return value;
        }
        if (value === "true") {
            return true;
        }
        if (value === "false") {
            return false;
        }
        return undefined;
    }
    if (textFields.indexOf(fieldName) >= 0) {
        return typeof value === "string" ? value.slice(0, 80) : undefined;
    }
    return undefined;
}

function buildStatus(issues: readonly ExperimentRecipeValidationIssue[]): ExperimentRecipeValidationStatus {
    if (issues.some((issue: ExperimentRecipeValidationIssue) => issue.severity === "error")) {
        return "failed";
    }
    if (issues.some((issue: ExperimentRecipeValidationIssue) => issue.severity === "warning")) {
        return "warning";
    }
    return "pass";
}

export class ExperimentRecipeLab {
    public validateParameters(parameters: Readonly<Record<string, unknown>>): ExperimentRecipeValidationResult {
        const normalizedParameters: Record<string, ExperimentRecipeValue> = {};
        const issues: ExperimentRecipeValidationIssue[] = [];
        Object.keys(parameters).forEach((fieldName: string) => {
            const normalizedValue: ExperimentRecipeValue | undefined = normalizeValue(fieldName, parameters[fieldName]);
            if (typeof normalizedValue === "undefined") {
                issues.push(Object.freeze({ field: fieldName, severity: "warning", message: "Unsupported recipe field ignored so the share packet stays safe and inert." }));
                return;
            }
            if (Object.prototype.hasOwnProperty.call(numericRanges, fieldName)) {
                const range: NumericRange = numericRanges[fieldName];
                const numericValue: number = Number(normalizedValue);
                const boundedValue: number = Math.max(range.minimum, Math.min(range.maximum, numericValue));
                normalizedParameters[fieldName] = boundedValue;
                if (boundedValue !== numericValue) {
                    issues.push(Object.freeze({ field: fieldName, severity: "warning", message: `Value was clamped into the safe sandbox range ${range.minimum}–${range.maximum}.` }));
                }
                return;
            }
            normalizedParameters[fieldName] = normalizedValue;
        });
        if (typeof normalizedParameters.scenario !== "string") {
            issues.push(Object.freeze({ field: "scenario", severity: "error", message: "Recipe must include a scenario before it can be applied." }));
        }
        if (typeof normalizedParameters.acceptedSteps !== "number") {
            normalizedParameters.acceptedSteps = 6000;
            issues.push(Object.freeze({ field: "acceptedSteps", severity: "info", message: "Accepted steps defaulted to 6000 for deterministic playback." }));
        }
        return Object.freeze({ status: buildStatus(issues), issues: Object.freeze(issues.slice()), normalizedParameters: Object.freeze(normalizedParameters) });
    }

    public buildRecipeFromPreset(preset: ParameterGuidePreset, activeConfig: Readonly<Record<string, unknown>>, title?: string): ExperimentRecipe {
        const mergedParameters: Record<string, unknown> = { ...activeConfig, ...preset.parameters, scenario: preset.scenario };
        const validation: ExperimentRecipeValidationResult = this.validateParameters(mergedParameters);
        const recipeTitle: string = title && title.trim().length > 0 ? title.trim().slice(0, 120) : preset.title;
        const coreRecipe = {
            packetType: "ArcSecs Experiment Recipe" as const,
            recipeId: `${preset.presetId}-${Date.now().toString(36)}`,
            title: recipeTitle,
            sourcePresetId: preset.presetId,
            scenario: String(validation.normalizedParameters.scenario || preset.scenario),
            generatedUtc: new Date().toISOString(),
            parameters: validation.normalizedParameters,
            highlightedParameters: preset.highlightedParameters.slice(),
            validationStatus: validation.status,
            validationIssues: validation.issues,
            shareToken: "",
            exportContainsExecutableCode: false as const,
            scientificBoundary: "ArcSecs experiment recipes only store sandbox parameters. They do not contain executable code and do not prove the speculative model."
        };
        const shareToken: string = this.encodeRecipePayload(coreRecipe);
        return Object.freeze({ ...coreRecipe, shareToken });
    }

    public encodeRecipePayload(recipe: Omit<ExperimentRecipe, "shareToken"> | ExperimentRecipe): string {
        const payload: Record<string, unknown> = {
            packetType: "ArcSecs Experiment Recipe",
            title: recipe.title,
            sourcePresetId: recipe.sourcePresetId,
            scenario: recipe.scenario,
            parameters: recipe.parameters,
            highlightedParameters: recipe.highlightedParameters,
            validationStatus: recipe.validationStatus,
            scientificBoundary: recipe.scientificBoundary,
            exportContainsExecutableCode: false
        };
        return encodeURIComponent(JSON.stringify(payload));
    }

    public decodeRecipePayload(token: string): ExperimentRecipe | null {
        try {
            const parsed: unknown = JSON.parse(decodeURIComponent(token));
            if (!isRecord(parsed) || !isRecord(parsed.parameters)) {
                return null;
            }
            const validation: ExperimentRecipeValidationResult = this.validateParameters(parsed.parameters);
            const title: string = typeof parsed.title === "string" ? parsed.title.slice(0, 120) : "Shared ArcSecs Experiment Recipe";
            const sourcePresetId: string = typeof parsed.sourcePresetId === "string" ? parsed.sourcePresetId.slice(0, 80) : "shared-recipe";
            const scenario: string = typeof validation.normalizedParameters.scenario === "string" ? validation.normalizedParameters.scenario : "relationalLattice";
            const highlightedParameters: readonly string[] = Array.isArray(parsed.highlightedParameters) ? parsed.highlightedParameters.filter((item: unknown): item is string => typeof item === "string").slice(0, 12) : [];
            const coreRecipe = {
                packetType: "ArcSecs Experiment Recipe" as const,
                recipeId: `shared-${Date.now().toString(36)}`,
                title,
                sourcePresetId,
                scenario,
                generatedUtc: new Date().toISOString(),
                parameters: validation.normalizedParameters,
                highlightedParameters,
                validationStatus: validation.status,
                validationIssues: validation.issues,
                shareToken: "",
                exportContainsExecutableCode: false as const,
                scientificBoundary: "ArcSecs experiment recipes only store sandbox parameters. They do not contain executable code and do not prove the speculative model."
            };
            return Object.freeze({ ...coreRecipe, shareToken: this.encodeRecipePayload(coreRecipe) });
        } catch {
            return null;
        }
    }

    public buildShareState(baseUrl: string, recipe: ExperimentRecipe): ExperimentRecipeShareState {
        const url: URL = new URL(baseUrl || "https://arcsecs.com/arcsecs-physics-engine-demo/");
        url.searchParams.set("arcsecsRecipe", recipe.shareToken);
        url.searchParams.set("arcsecsScenario", recipe.scenario);
        return Object.freeze({ recipe, shareUrl: url.toString(), queryParameterName: "arcsecsRecipe", exportContainsExecutableCode: false });
    }

    public readRecipeFromSearch(search: string): ExperimentRecipe | null {
        const normalizedSearch: string = search.startsWith("?") ? search : `?${search}`;
        const parameters: URLSearchParams = new URLSearchParams(normalizedSearch);
        const token: string | null = parameters.get("arcsecsRecipe");
        return token ? this.decodeRecipePayload(token) : null;
    }
}
