import { ConstantsManager } from "./ConstantsManager";
import { ConservationLedgerEntry, SimulationStepInput, TelemetryFrame } from "./PhysicsTypes";

/**
 * Minimal deterministic coordinator for ArcSecs research-mode simulations.
 * The implementation favors visible ledgers over hidden corrections.
 */
export class CorePhysicsEngine {
    private readonly constantsManager: ConstantsManager;

    /**
     * @param constantsManager Supplies scenario-specific constants for each step.
     */
    public constructor(constantsManager: ConstantsManager) {
        this.constantsManager = constantsManager;
    }

    /**
     * Executes one simulation step and returns the telemetry needed by the UI.
     *
     * @param input Step mode, elapsed time, and entity state.
     * @returns A telemetry frame for charts, warnings, and conservation ledgers.
     */
    public step(input: SimulationStepInput): TelemetryFrame {
        const constants = this.constantsManager.getSnapshot(input.mode, input.elapsedSeconds);
        const conservationLedger: ConservationLedgerEntry[] = this.createConservationLedger(input);
        const warnings: string[] = [];

        if (input.mode !== "mainstream" && conservationLedger.some((entry: ConservationLedgerEntry) => !entry.passed)) {
            warnings.push("Speculative branch failed at least one conservation ledger check.");
        }

        return {
            mode: input.mode,
            elapsedSeconds: input.elapsedSeconds,
            constants,
            conservationLedger,
            warnings
        };
    }

    /**
     * Builds conservation entries for a step. Real scenario modules should append their own checks.
     *
     * @param input Current simulation step input.
     * @returns Ledger entries that make failures visible.
     */
    private createConservationLedger(input: SimulationStepInput): ConservationLedgerEntry[] {
        const totalRestMassKilograms: number = input.entities.reduce(
            (runningTotal: number, entity) => runningTotal + entity.restMassKilograms,
            0
        );

        return [
            {
                name: "Total rest mass accounting",
                expectedValue: totalRestMassKilograms,
                observedValue: totalRestMassKilograms,
                tolerance: 1e-12,
                passed: true,
                notes: "Baseline placeholder check. Scenario modules should add energy, momentum, and redshift ledgers."
            }
        ];
    }
}
