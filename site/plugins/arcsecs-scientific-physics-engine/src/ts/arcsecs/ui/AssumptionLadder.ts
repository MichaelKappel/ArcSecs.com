import { ArcSecsScenarioKey, scenarioCatalog } from "../scenarios/ScenarioCatalog";

export interface AssumptionLadderRow {
    readonly name: string;
    readonly active: boolean;
    readonly level: "reference" | "implementation" | "speculative" | "high-risk";
    readonly explanation: string;
}

export interface PhysicistScorecardState {
    readonly energyLedgerScore: number;
    readonly stabilityScore: number;
    readonly riskScore: number;
    readonly assumptionLoad: number;
    readonly standardModelComparisonWarning: string;
    readonly speculativeBoundaryLabel: string;
}

export interface AssumptionLadderState {
    readonly scenario: ArcSecsScenarioKey;
    readonly rows: readonly AssumptionLadderRow[];
    readonly scorecard: PhysicistScorecardState;
}

const assumptionCopy: readonly AssumptionLadderRow[] = [
    { name: "Absolute time", active: false, level: "implementation", explanation: "The fixed engine tick is shared by every local probe." },
    { name: "No physical spacetime fabric", active: false, level: "speculative", explanation: "Rendered coordinates are labels; relationships define the simulated structure." },
    { name: "Massive photon", active: false, level: "high-risk", explanation: "Photon packets receive a configurable non-zero mass or coupling proxy." },
    { name: "Tired-light attenuation", active: false, level: "high-risk", explanation: "Photon energy is reduced over distance and must be accounted for in a ledger." },
    { name: "Galilean superluminal kinematics", active: false, level: "high-risk", explanation: "Relative velocity is simple vector arithmetic with no Lorentz limiter." },
    { name: "Newtonian dark star", active: false, level: "speculative", explanation: "Capture is framed with escape velocity rather than an event-horizon spacetime description." },
    { name: "Proca-style dispersion", active: false, level: "speculative", explanation: "Frequency-dependent effective photon velocity is exposed as a comparison branch." },
    { name: "Dark-light condensate", active: false, level: "high-risk", explanation: "Ledgered tired-light energy is visualized as a halo-like condensate." },
    { name: "Ramjet harvest model", active: false, level: "high-risk", explanation: "A spacecraft pipeline harvests, buffers, converts, rejects heat, and emits a thrust proxy." }
];

/** Builds the explicit assumption ladder and physicist scorecard requested by the prompt. */
export class AssumptionLadder {
    /**
     * Builds assumption and scorecard state for a scenario.
     * @param scenario Scenario key.
     * @param energyLedgerScore Current energy-ledger score.
     * @param stabilityScore Current stability score.
     * @param warningCount Current warning count.
     */
    public build(scenario: ArcSecsScenarioKey, energyLedgerScore: number, stabilityScore: number, warningCount: number): AssumptionLadderState {
        const catalogItem = scenarioCatalog.find((item) => item.key === scenario);
        const activeAssumptions: readonly string[] = catalogItem ? catalogItem.assumptions : [];
        const rows: AssumptionLadderRow[] = assumptionCopy.map((row: AssumptionLadderRow) => ({ ...row, active: activeAssumptions.some((assumption: string) => this.matches(row.name, assumption, scenario)) }));
        const activeCount: number = rows.filter((row: AssumptionLadderRow) => row.active).length;
        const assumptionLoad: number = activeCount / rows.length;
        const riskScore: number = this.clamp(1 - stabilityScore + assumptionLoad * 0.35 + Math.min(0.25, warningCount * 0.05), 0, 1);
        const standardModelComparisonWarning: string = activeCount > 0 ? "Alternative hypothesis mode: compare against standard reference baselines before interpreting the visual." : "Reference/control mode.";
        const speculativeBoundaryLabel: string = "ArcSecs speculative model — mathematical sandbox, not proof or measured engineering performance.";
        return { scenario, rows, scorecard: { energyLedgerScore: this.clamp(energyLedgerScore, 0, 1), stabilityScore: this.clamp(stabilityScore, 0, 1), riskScore, assumptionLoad, standardModelComparisonWarning, speculativeBoundaryLabel } };
    }

    private matches(rowName: string, assumption: string, scenario: ArcSecsScenarioKey): boolean {
        const row: string = rowName.toLowerCase();
        const active: string = assumption.toLowerCase();
        if (row === "proca-style dispersion" && scenario === "massivePhotonLensing") {
            return true;
        }
        return active.includes(row) || row.includes(active) || (row === "absolute time" && active.includes("mechanical oscillator"));
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
