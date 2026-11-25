export interface StabilityLedgerInput {
    readonly energyIn: number;
    readonly energyStored: number;
    readonly energyOutput: number;
    readonly energyWaste: number;
    readonly finiteSampleValues: readonly number[];
    readonly warningCount: number;
}

export interface StabilityLedgerState {
    readonly finiteTelemetryPassed: boolean;
    readonly ledgerClosureError: number;
    readonly energyLedgerScore: number;
    readonly stabilityScore: number;
    readonly riskScore: number;
    readonly failedReason: string;
}

/** Shared stability and energy-ledger checks for scenario validation panels and tests. */
export class StabilityLedgerChecks {
    /**
     * Computes ledger closure, stability, and risk scores.
     * @param input Energy accounting, finite samples, and warning count.
     */
    public evaluate(input: StabilityLedgerInput): StabilityLedgerState {
        const finiteTelemetryPassed: boolean = input.finiteSampleValues.every((value: number) => Number.isFinite(value));
        const ledgerClosureError: number = Math.abs(input.energyIn - input.energyStored - input.energyOutput - input.energyWaste);
        const energyLedgerScore: number = this.clamp(1 - ledgerClosureError / Math.max(1, input.energyIn), 0, 1);
        const warningPenalty: number = Math.min(0.6, Math.max(0, input.warningCount) * 0.08);
        const stabilityScore: number = finiteTelemetryPassed ? this.clamp(energyLedgerScore - warningPenalty, 0, 1) : 0;
        const riskScore: number = this.clamp(1 - stabilityScore + warningPenalty, 0, 1);
        const failedReason: string = !finiteTelemetryPassed ? "Non-finite telemetry sample detected." : ledgerClosureError > 0.000001 ? "Energy ledger did not close within tolerance." : input.warningCount > 0 ? "Scenario has active warning conditions." : "All stability checks passed.";
        return { finiteTelemetryPassed, ledgerClosureError, energyLedgerScore, stabilityScore, riskScore, failedReason };
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
