export type GrandExperimentScenarioKey =
    | "relationalLattice"
    | "absoluteTimeQuantumOscillator"
    | "massivePhotonLensing"
    | "newtonianDarkStar"
    | "superluminalGalilean"
    | "tiredLightEnergyLedger"
    | "darkMatterCondensate"
    | "darkMatterRamjet"
    | "parallaxCalibration";

export interface GrandExperimentStageDefinition {
    readonly order: number;
    readonly scenario: GrandExperimentScenarioKey;
    readonly title: string;
    readonly visitorQuestion: string;
    readonly expertCheck: string;
    readonly primaryMetric: string;
    readonly passCondition: string;
}

export interface GrandExperimentStageResult {
    readonly order: number;
    readonly scenario: GrandExperimentScenarioKey;
    readonly title: string;
    readonly primaryMetric: string;
    readonly primaryValue: number;
    readonly validationScore: number;
    readonly warningCount: number;
    readonly status: "pass" | "review";
    readonly evidenceLine: string;
}

export interface GrandExperimentSummary {
    readonly stageCount: number;
    readonly passCount: number;
    readonly averageValidationScore: number;
    readonly weakestScenario: GrandExperimentScenarioKey;
    readonly recommendedNextStep: string;
    readonly scientificBoundary: string;
}

export interface GrandExperimentPackage {
    readonly engineVersion: string;
    readonly generatedUtc: string;
    readonly stages: ReadonlyArray<GrandExperimentStageResult>;
    readonly summary: GrandExperimentSummary;
}

export interface ScenarioMetricSample {
    readonly scenario: GrandExperimentScenarioKey;
    readonly primaryValue: number;
    readonly validationScore: number;
    readonly warningCount: number;
}

export class ExperimentDirector {
    public readonly stages: ReadonlyArray<GrandExperimentStageDefinition> = Object.freeze([
        { order: 1, scenario: "relationalLattice", title: "Relational Flat-Space Primer", visitorQuestion: "Can a visible coordinate grid be treated as labels while relations do the real work?", expertCheck: "Solver-link counts and relation stability must remain finite.", primaryMetric: "constraintCount", passCondition: "more than zero solver links" },
        { order: 2, scenario: "absoluteTimeQuantumOscillator", title: "Absolute Time / Oscillator Damping", visitorQuestion: "Can two probes share one global tick while the near-mass oscillator transitions less often?", expertCheck: "Deep-space transitions must exceed near-mass transitions without changing global time.", primaryMetric: "oscillatorNearMassTransitions", passCondition: "near-mass transitions below deep-space transitions" },
        { order: 3, scenario: "massivePhotonLensing", title: "Massive Photon Lensing Comparison", visitorQuestion: "Do photon paths bend near a mass while the Soldner and GR baselines stay visible?", expertCheck: "Deflection and baseline mismatch must be reported explicitly.", primaryMetric: "massivePhotonDeflectionArcseconds", passCondition: "finite non-zero deflection" },
        { order: 4, scenario: "newtonianDarkStar", title: "Newtonian Dark Star Escape", visitorQuestion: "Can an escaping light packet turn around when escape velocity wins?", expertCheck: "Captured state must correspond to escape velocity exceeding photon velocity.", primaryMetric: "darkStarEscapeVelocity", passCondition: "escape threshold visible" },
        { order: 5, scenario: "superluminalGalilean", title: "Galilean Relative Velocity", visitorQuestion: "Can arithmetic relative velocity exceed c without applying Lorentz compression?", expertCheck: "Relative velocity equals vector difference and Lorentz factor remains disabled.", primaryMetric: "galileanRelativeVelocity", passCondition: "relative velocity above one c" },
        { order: 6, scenario: "tiredLightEnergyLedger", title: "Tired-Light Ledger Closure", visitorQuestion: "Where does the lost photon energy go?", expertCheck: "Energy lost must equal substrate ledger gain within tolerance.", primaryMetric: "tiredLightLedgerClosureError", passCondition: "closure error near zero" },
        { order: 7, scenario: "darkMatterCondensate", title: "Condensate Halo Build-Up", visitorQuestion: "Can exhausted photon energy form a visible halo-like accumulation?", expertCheck: "Halo density must be coupled to tired-light ledger energy.", primaryMetric: "condensateHaloDensity", passCondition: "finite halo density" },
        { order: 8, scenario: "darkMatterRamjet", title: "Dark Matter Ramjet Pipeline", visitorQuestion: "Which engineering subsystem becomes the bottleneck first?", expertCheck: "Failure injections must change drag, buffer, thermal, shield, or exhaust telemetry.", primaryMetric: "ramjetMissionReadiness", passCondition: "readiness and warnings visible" },
        { order: 9, scenario: "parallaxCalibration", title: "Validation Lab Calibration", visitorQuestion: "Does the demo still honor the one-arcsecond-to-one-parsec benchmark?", expertCheck: "1 AU and 1 arcsecond must resolve to 1 parsec within tolerance.", primaryMetric: "parallaxParsecs", passCondition: "parsec calibration close to one" }
    ]);

    public buildPackage(engineVersion: string, samples: ReadonlyArray<ScenarioMetricSample>): GrandExperimentPackage {
        const lookup = new Map<GrandExperimentScenarioKey, ScenarioMetricSample>();
        for (const sample of samples) {
            lookup.set(sample.scenario, sample);
        }
        const stageResults = this.stages.map((stage): GrandExperimentStageResult => {
            const sample = lookup.get(stage.scenario) || { scenario: stage.scenario, primaryValue: 0, validationScore: 0, warningCount: 1 };
            const status: "pass" | "review" = sample.validationScore >= 0.75 && Number.isFinite(sample.primaryValue) && sample.warningCount <= 2 ? "pass" : "review";
            return {
                order: stage.order,
                scenario: stage.scenario,
                title: stage.title,
                primaryMetric: stage.primaryMetric,
                primaryValue: sample.primaryValue,
                validationScore: sample.validationScore,
                warningCount: sample.warningCount,
                status,
                evidenceLine: `${stage.title}: ${stage.passCondition}; metric ${stage.primaryMetric}=${sample.primaryValue.toFixed(6)}.`
            };
        });
        const passCount = stageResults.filter((stage) => stage.status === "pass").length;
        const averageValidationScore = stageResults.reduce((sum, stage) => sum + stage.validationScore, 0) / Math.max(1, stageResults.length);
        const weakest = stageResults.slice().sort((left, right) => left.validationScore - right.validationScore)[0] || stageResults[0];
        return {
            engineVersion,
            generatedUtc: new Date().toISOString(),
            stages: stageResults,
            summary: {
                stageCount: stageResults.length,
                passCount,
                averageValidationScore,
                weakestScenario: weakest.scenario,
                recommendedNextStep: weakest.status === "pass" ? "Export the evidence packet and run ramjet failure-injection comparisons." : `Review ${weakest.title} before sharing the demo.` ,
                scientificBoundary: "Grand Experiment Director is a scripted conceptual diagnostic; it is not measured physical performance or proof of a working drive."
            }
        };
    }
}
