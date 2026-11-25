export type RuntimeReadinessStatus = "pass" | "warning" | "failed";

export interface RuntimeReadinessInput {
    readonly presentControls: readonly string[];
    readonly presentScenarioKeys: readonly string[];
    readonly presentFailureModes: readonly string[];
    readonly visibleStatusTexts: readonly string[];
    readonly canvasHasAccessibleName: boolean;
    readonly keyboardShortcutsDocumented: boolean;
    readonly speculativeBoundaryVisible: boolean;
}

export interface RuntimeReadinessCheck {
    readonly label: string;
    readonly passed: boolean;
    readonly detail: string;
}

export interface RuntimeReadinessReport {
    readonly status: RuntimeReadinessStatus;
    readonly score: number;
    readonly missingControls: readonly string[];
    readonly missingScenarios: readonly string[];
    readonly missingFailureModes: readonly string[];
    readonly checks: readonly RuntimeReadinessCheck[];
    readonly summary: string;
}

/** Audits whether the shipped WordPress shell exposes the prompt-required controls and states. */
export class RuntimeReadinessAudit {
    public readonly requiredControls: readonly string[];
    public readonly requiredScenarioKeys: readonly string[];
    public readonly requiredFailureModes: readonly string[];
    public readonly requiredStatusTexts: readonly string[];

    public constructor() {
        this.requiredControls = ["run", "playPause", "step", "reset", "scenario", "benchmark", "commandPalette", "guidedDemo"];
        this.requiredScenarioKeys = ["relationalLattice", "absoluteTimeQuantumOscillator", "massivePhotonLensing", "newtonianDarkStar", "superluminalGalilean", "tiredLightEnergyLedger", "darkMatterCondensate", "darkMatterRamjet", "parallaxCalibration"];
        this.requiredFailureModes = ["micrometeorBurst", "solenoidQuench", "radiatorPanelLoss", "bufferSaturation", "bufferDecoherence", "wideExhaust", "shieldOverload"];
        this.requiredStatusTexts = ["Idle", "Running", "Paused", "Stepping", "Warning", "Failed validation"];
    }

    /**
     * Evaluates shell readiness without requiring a browser DOM.
     * @param input Extracted control, scenario, failure, and accessibility signals.
     */
    public audit(input: RuntimeReadinessInput): RuntimeReadinessReport {
        const presentControls: Set<string> = new Set<string>(input.presentControls);
        const presentScenarioKeys: Set<string> = new Set<string>(input.presentScenarioKeys);
        const presentFailureModes: Set<string> = new Set<string>(input.presentFailureModes);
        const visibleStatusTexts: Set<string> = new Set<string>(input.visibleStatusTexts);

        const missingControls: string[] = this.requiredControls.filter((item: string) => !presentControls.has(item));
        const missingScenarios: string[] = this.requiredScenarioKeys.filter((item: string) => !presentScenarioKeys.has(item));
        const missingFailureModes: string[] = this.requiredFailureModes.filter((item: string) => !presentFailureModes.has(item));
        const missingStatusTexts: string[] = this.requiredStatusTexts.filter((item: string) => !visibleStatusTexts.has(item));

        const checks: RuntimeReadinessCheck[] = [
            this.check("Core controls exposed", missingControls.length === 0, missingControls.length === 0 ? "all required controls are present" : missingControls.join(", ")),
            this.check("Prompt scenarios exposed", missingScenarios.length === 0, missingScenarios.length === 0 ? "1-9 scenario set is present" : missingScenarios.join(", ")),
            this.check("Failure injections exposed", missingFailureModes.length === 0, missingFailureModes.length === 0 ? "all ramjet failures are present" : missingFailureModes.join(", ")),
            this.check("Status language visible", missingStatusTexts.length === 0, missingStatusTexts.length === 0 ? "all status states are text-visible" : missingStatusTexts.join(", ")),
            this.check("Canvas accessible name", input.canvasHasAccessibleName, input.canvasHasAccessibleName ? "canvas has surrounding accessible text" : "canvas label is missing"),
            this.check("Keyboard shortcuts documented", input.keyboardShortcutsDocumented, input.keyboardShortcutsDocumented ? "keyboard reference is present" : "keyboard reference is missing"),
            this.check("Speculative boundary visible", input.speculativeBoundaryVisible, input.speculativeBoundaryVisible ? "scientific boundary language is present" : "boundary language is missing")
        ];

        const passedCount: number = checks.filter((item: RuntimeReadinessCheck) => item.passed).length;
        const score: number = passedCount / Math.max(1, checks.length);
        const status: RuntimeReadinessStatus = score === 1 ? "pass" : score >= 0.75 ? "warning" : "failed";
        const summary: string = status === "pass"
            ? "Runtime shell is ready: controls, scenarios, failures, status text, accessibility, and speculative boundary are visible."
            : "Runtime shell needs review: " + checks.filter((item: RuntimeReadinessCheck) => !item.passed).map((item: RuntimeReadinessCheck) => item.label).join("; ");

        return { status, score, missingControls, missingScenarios, missingFailureModes, checks, summary };
    }

    private check(label: string, passed: boolean, detail: string): RuntimeReadinessCheck {
        return { label, passed, detail };
    }
}
