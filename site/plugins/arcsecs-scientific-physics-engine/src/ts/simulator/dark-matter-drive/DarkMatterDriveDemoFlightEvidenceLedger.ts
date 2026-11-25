import { DarkMatterDriveAutopilotState } from "./DarkMatterDriveAutopilotDirector";
import { DarkMatterDriveDemoFlightVerification } from "./DarkMatterDriveDemoFlightVerification";
import { DarkMatterDriveDemoFlightTimeline } from "./DarkMatterDriveDemoFlightTimeline";
import { DarkMatterDriveDemoFlightScorecard } from "./DarkMatterDriveDemoFlightScorecard";

export type DarkMatterDriveDemoFlightEvidenceStatus = "demonstrated" | "ready" | "watch";

export interface DarkMatterDriveDemoFlightEvidenceEntry {
    readonly stageIndex: number;
    readonly stageId: string;
    readonly stageTitle: string;
    readonly status: DarkMatterDriveDemoFlightEvidenceStatus;
    readonly eventPreset: string;
    readonly substrateDensityProfile: string;
    readonly claimEvidence: string;
    readonly visualEvidence: string;
    readonly telemetryEvidence: string;
    readonly validationEvidence: string;
    readonly exportEvidence: string;
    readonly falsificationWatch: string;
    readonly speculativeBoundary: string;
}

export interface DarkMatterDriveDemoFlightEvidenceLedger {
    readonly activeStageId: string;
    readonly activeStageTitle: string;
    readonly generatedAtTick: number;
    readonly finite: boolean;
    readonly ledgerStatus: DarkMatterDriveDemoFlightEvidenceStatus;
    readonly demonstratedCount: number;
    readonly totalCount: number;
    readonly recommendedAuditAction: string;
    readonly entries: readonly DarkMatterDriveDemoFlightEvidenceEntry[];
}

export class DarkMatterDriveDemoFlightEvidenceLedgerBuilder {
    public build(
        state: DarkMatterDriveAutopilotState,
        timeline: DarkMatterDriveDemoFlightTimeline,
        verification: DarkMatterDriveDemoFlightVerification,
        scorecard: DarkMatterDriveDemoFlightScorecard,
        generatedAtTick: number
    ): DarkMatterDriveDemoFlightEvidenceLedger {
        const entries: DarkMatterDriveDemoFlightEvidenceEntry[] = timeline.entries.map((entry) => {
            const active: boolean = entry.active;
            const demonstrated: boolean = entry.state === "complete" || (active && verification.status === "pass" && scorecard.status === "pass");
            const status: DarkMatterDriveDemoFlightEvidenceStatus = demonstrated ? "demonstrated" : (entry.state === "pending" ? "ready" : "watch");

            return {
                stageIndex: entry.stageIndex,
                stageId: entry.stageId,
                stageTitle: entry.stageTitle,
                status,
                eventPreset: entry.eventPreset,
                substrateDensityProfile: entry.substrateDensityProfile,
                claimEvidence: this.describeClaimEvidence(entry.stageId),
                visualEvidence: entry.expectedMotion,
                telemetryEvidence: active ? `${scorecard.passedCount}/${scorecard.totalCount} scorecard metrics passing` : "Available when stage is selected",
                validationEvidence: active ? `${verification.passedCount}/${verification.totalCount} verification checks passing` : entry.verificationStatus,
                exportEvidence: "Replay JSON and Demo Flight Verification JSON include this ledger entry.",
                falsificationWatch: this.describeFalsificationWatch(entry.stageId),
                speculativeBoundary: "Speculative research visualization and operator evidence ledger, not proof or settled physics."
            };
        });

        const demonstratedCount: number = entries.filter((entry) => entry.status === "demonstrated").length;
        const finite: boolean = Number.isFinite(generatedAtTick) && state.finite && timeline.finite && verification.finite && scorecard.finite;
        const ledgerStatus: DarkMatterDriveDemoFlightEvidenceStatus = finite && demonstratedCount > 0 ? "demonstrated" : (finite ? "ready" : "watch");

        return {
            activeStageId: state.stage ? state.stage.id : "none",
            activeStageTitle: state.stage ? state.stage.title : "No active stage",
            generatedAtTick,
            finite,
            ledgerStatus,
            demonstratedCount,
            totalCount: entries.length,
            recommendedAuditAction: "Click each Demo Flight stage, verify the viewport and scorecard change, then export the evidence ledger.",
            entries
        };
    }

    private describeClaimEvidence(stageId: string): string {
        const map: Readonly<Record<string, string>> = {
            "wake-cockpit": "Motion Director proves the cockpit is active and not a static diagram.",
            "align-scoop": "EIT scoop alignment demonstrates capture-rate and Proca-flux response.",
            "dense-filament": "Dense filament demonstrates density-dependent photon attenuation.",
            "agn-diffusion": "AGN diffusion demonstrates environmental delay dominating propagation delay.",
            "missing-counterpart": "Missing counterpart demonstrates gravity baseline surviving while light may vanish.",
            "thermal-stress": "Thermal stress demonstrates engineering bottleneck and finite telemetry guardrails."
        };
        return map[stageId] || "Stage evidence remains available for review.";
    }

    private describeFalsificationWatch(stageId: string): string {
        const map: Readonly<Record<string, string>> = {
            "wake-cockpit": "Fails if the viewport remains visually static during preview or running states.",
            "align-scoop": "Fails if capture/charge telemetry does not respond to scoop alignment.",
            "dense-filament": "Fails if photon attenuation does not increase under dense-line conditions.",
            "agn-diffusion": "Fails if environmental diffusion is not separated from propagation delay.",
            "missing-counterpart": "Fails if missing light produces invalid telemetry or broken visuals.",
            "thermal-stress": "Fails if thermal stress does not appear in finite scorecard/validation telemetry."
        };
        return map[stageId] || "Fails if telemetry, validation, or export evidence is missing.";
    }
}
