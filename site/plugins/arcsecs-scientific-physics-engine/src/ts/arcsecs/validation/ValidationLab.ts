import { ArcSecsScenarioKey, scenarioCatalog } from "../scenarios/ScenarioCatalog";
import { StabilityLedgerChecks, StabilityLedgerState } from "../physics/StabilityLedgerChecks";

export interface ValidationLabInput {
    readonly scenario: ArcSecsScenarioKey;
    readonly tickCount: number;
    readonly renderFrameCount: number;
    readonly initialEnergy: number;
    readonly currentEnergy: number;
    readonly ledgerGain: number;
    readonly finiteSamples: readonly number[];
    readonly warningCount: number;
    readonly replaySignatureA: string;
    readonly replaySignatureB: string;
}

export interface ValidationLabCheck {
    readonly name: string;
    readonly passed: boolean;
    readonly expected: string;
    readonly actual: string;
    readonly failureReason: string;
}

export interface ArcsecondCalibrationState {
    readonly baselineAu: number;
    readonly parallaxArcseconds: number;
    readonly radians: number;
    readonly parsecs: number;
    readonly passed: boolean;
}

export interface ValidationLabReport {
    readonly scenario: ArcSecsScenarioKey;
    readonly arcsecondCalibration: ArcsecondCalibrationState;
    readonly ledger: StabilityLedgerState;
    readonly checks: readonly ValidationLabCheck[];
    readonly validationScore: number;
    readonly failedCheckText: string;
    readonly speculativeBoundary: string;
}

/** Executable validation lab used by tests, documentation, and the UI contract. */
export class ValidationLab {
    private readonly ledgerChecks: StabilityLedgerChecks;

    public constructor() {
        this.ledgerChecks = new StabilityLedgerChecks();
    }

    /**
     * Computes the one-arcsecond / one-AU / one-parsec calibration benchmark.
     * @param baselineAu Astronomical-unit baseline.
     * @param parallaxArcseconds Parallax angle in arcseconds.
     */
    public calibrateArcsecondParsec(baselineAu: number, parallaxArcseconds: number): ArcsecondCalibrationState {
        const safeBaselineAu: number = Math.max(0.000001, baselineAu);
        const safeArcseconds: number = Math.max(0.000001, parallaxArcseconds);
        const radians: number = safeArcseconds / 206264.80624709636;
        const parsecs: number = safeBaselineAu / safeArcseconds;
        return { baselineAu: safeBaselineAu, parallaxArcseconds: safeArcseconds, radians, parsecs, passed: Math.abs(parsecs - 1) < 0.000001 && Math.abs(safeArcseconds - 1) < 0.000001 };
    }

    /**
     * Runs scenario readiness checks and returns user-readable failure reasons.
     * @param input Validation input from the deterministic run.
     */
    public run(input: ValidationLabInput): ValidationLabReport {
        const calibration: ArcsecondCalibrationState = this.calibrateArcsecondParsec(1, 1);
        const energyLost: number = Math.max(0, input.initialEnergy - input.currentEnergy);
        const ledger: StabilityLedgerState = this.ledgerChecks.evaluate({
            energyIn: input.initialEnergy,
            energyStored: input.ledgerGain,
            energyOutput: input.currentEnergy,
            energyWaste: 0,
            finiteSampleValues: input.finiteSamples,
            warningCount: input.warningCount
        });
        const checks: ValidationLabCheck[] = [
            this.check("Arcsecond / parsec calibration", calibration.passed, "1 AU at 1 arcsecond equals 1 parsec", calibration.parsecs.toFixed(6) + " parsec", "Calibration drifted away from the ArcSecs angular benchmark."),
            this.check("Photon energy ledger closure", Math.abs(energyLost - input.ledgerGain) <= 0.000001 && ledger.ledgerClosureError <= 0.000001, "energy lost equals ledger gain", "lost=" + energyLost.toFixed(6) + "; ledger=" + input.ledgerGain.toFixed(6), "Energy disappeared or appeared without a substrate ledger entry."),
            this.check("Deterministic replay", input.replaySignatureA === input.replaySignatureB, "same seed and ticks produce identical signature", input.replaySignatureA + " / " + input.replaySignatureB, "The scenario is not deterministic under fixed-step replay."),
            this.check("Fixed-step clock", input.tickCount >= input.renderFrameCount || input.renderFrameCount === 0, "physics ticks are counted separately from render frames", "ticks=" + input.tickCount + "; frames=" + input.renderFrameCount, "Render frames appear to be driving physics state directly."),
            this.check("Finite telemetry", ledger.finiteTelemetryPassed, "all sampled values are finite", ledger.failedReason, "A non-finite value reached the validation lab."),
            this.check("Scenario registered", scenarioCatalog.some((item) => item.key === input.scenario), "scenario has catalog entry and assumption boundary", input.scenario, "The active scenario is missing from the assumption-aware catalog.")
        ];
        const passedCount: number = checks.filter((item: ValidationLabCheck) => item.passed).length;
        const validationScore: number = passedCount / Math.max(1, checks.length);
        const failedCheckText: string = checks.filter((item: ValidationLabCheck) => !item.passed).map((item: ValidationLabCheck) => item.name + ": " + item.failureReason).join(" ") || "All validation lab checks passed.";
        return { scenario: input.scenario, arcsecondCalibration: calibration, ledger, checks, validationScore, failedCheckText, speculativeBoundary: "Conceptual diagnostic, not measured physical performance or proof of the ArcSecs speculative model." };
    }

    private check(name: string, passed: boolean, expected: string, actual: string, failureReason: string): ValidationLabCheck {
        return { name, passed, expected, actual, failureReason: passed ? "" : failureReason };
    }
}
