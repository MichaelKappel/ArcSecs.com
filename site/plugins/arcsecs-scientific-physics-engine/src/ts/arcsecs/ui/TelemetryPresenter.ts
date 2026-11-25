export interface TelemetryRow {
    readonly label: string;
    readonly value: string;
    readonly status: "nominal" | "warning" | "failed";
}

/** Converts numerical telemetry into safe text rows, never NaN or Infinity display. */
export class TelemetryPresenter {
    /**
     * Formats a finite numeric value for the cockpit.
     * @param value Numeric telemetry value.
     * @param fallback Safe fallback displayed when value is not finite.
     */
    public formatNumber(value: number, fallback: string): string {
        if (!Number.isFinite(value)) {
            return fallback;
        }
        if (Math.abs(value) >= 10000 || (Math.abs(value) <= 0.001 && value !== 0)) {
            return value.toExponential(3);
        }
        return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }

    /**
     * Creates a pass/fail energy ledger row.
     * @param ledgerClosureError Absolute ledger closure error.
     */
    public ledgerRow(ledgerClosureError: number): TelemetryRow {
        const status: "nominal" | "warning" | "failed" = ledgerClosureError < 0.000001 ? "nominal" : ledgerClosureError < 0.01 ? "warning" : "failed";
        return { label: "Ledger closure error", value: this.formatNumber(ledgerClosureError, "not finite"), status };
    }

    /**
     * Creates a public-facing speculation label row.
     * @param scenarioLabel Active scenario label.
     */
    public boundaryRow(scenarioLabel: string): TelemetryRow {
        return { label: scenarioLabel, value: "Speculative research visualization, not measured physical performance.", status: "nominal" };
    }
}
