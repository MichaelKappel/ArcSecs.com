export type DarkMatterDriveArchitectureSweepStatus = "pass" | "watch";

export interface DarkMatterDriveArchitectureLayerCheck {
    readonly key: string;
    readonly label: string;
    readonly owner: string;
    readonly status: DarkMatterDriveArchitectureSweepStatus;
    readonly evidence: string;
    readonly risk: string;
    readonly nextAction: string;
}

export interface DarkMatterDriveArchitectureExportContract {
    readonly exportName: string;
    readonly required: boolean;
    readonly includesDemoDirector: boolean;
    readonly includesStageTimeline: boolean;
    readonly includesStageScorecard: boolean;
    readonly includesEvidenceLedger: boolean;
    readonly status: DarkMatterDriveArchitectureSweepStatus;
}

export interface DarkMatterDriveArchitectureSweep {
    readonly generatedAtTick: number;
    readonly packageVersion: string;
    readonly pluginOnly: boolean;
    readonly strictTypeScript: boolean;
    readonly noJQuery: boolean;
    readonly noLooseAny: boolean;
    readonly deterministicStageNavigation: boolean;
    readonly finiteTelemetryGuard: boolean;
    readonly speculativeBoundaryVisible: boolean;
    readonly overallStatus: DarkMatterDriveArchitectureSweepStatus;
    readonly passedLayerCount: number;
    readonly totalLayerCount: number;
    readonly layers: readonly DarkMatterDriveArchitectureLayerCheck[];
    readonly exportContracts: readonly DarkMatterDriveArchitectureExportContract[];
    readonly recommendedNextAction: string;
}

export interface DarkMatterDriveArchitectureSweepInput {
    readonly generatedAtTick: number;
    readonly packageVersion: string;
    readonly hasDemoDirector: boolean;
    readonly hasStageTimeline: boolean;
    readonly hasStageScorecard: boolean;
    readonly hasEvidenceLedger: boolean;
    readonly hasVerification: boolean;
    readonly finiteTelemetry: boolean;
}

export class DarkMatterDriveArchitectureSweepBuilder {
    public build(input: DarkMatterDriveArchitectureSweepInput): DarkMatterDriveArchitectureSweep {
        const layers: readonly DarkMatterDriveArchitectureLayerCheck[] = [
            this.layer("runtime", "Runtime cockpit shell", "Plugin Architect", true, "Dark Matter Drive simulator owns the cockpit runtime and button wiring.", "Broken runtime wiring would make the cockpit look static.", "Verify Play Demo Flight and viewport click behavior live."),
            this.layer("autopilot", "Demo Flight Director", "Plugin Architect", input.hasDemoDirector, "Demo Director controls stage sequencing and direct jumps.", "Stage sequencing can drift from telemetry if not exported.", "Click every stage card during live verification."),
            this.layer("timeline", "Stage Timeline Scrubber", "Plugin Architect", input.hasStageTimeline, "Stage rail provides direct stage jump behavior.", "Visitors cannot test specific cases quickly if the rail fails.", "Verify each card changes viewport and telemetry."),
            this.layer("verification", "Live Stage Verification", "Plugin Architect", input.hasVerification, "Checklist validates finite telemetry and stage-specific expectations.", "Motion can become decorative if checks are not visible.", "Confirm pass/watch states update per stage."),
            this.layer("scorecard", "Stage Telemetry Scorecard", "Plugin Architect", input.hasStageScorecard, "Scorecard maps drive output, charge, thermal load, optical resistance, and progress.", "Animation is weak if metric evidence does not move.", "Compare scorecard values across all stages."),
            this.layer("evidence-ledger", "Demo Flight Evidence Ledger", "Plugin Architect", input.hasEvidenceLedger, "Ledger ties claim, visual, telemetry, validation, export, and falsification evidence.", "Public claims become hard to audit if ledger is missing.", "Export evidence ledger JSON after each demo review."),
            this.layer("finite-telemetry", "Finite telemetry guardrails", "Plugin Architect", input.finiteTelemetry, "Telemetry is checked for finite numeric output.", "NaN, Infinity, or negative-energy output would break trust.", "Inspect exported JSON and console after install.")
        ];

        const exportContracts: readonly DarkMatterDriveArchitectureExportContract[] = [
            this.exportContract("Demo Flight Verification JSON", true, input.hasDemoDirector, input.hasStageTimeline, input.hasStageScorecard, input.hasEvidenceLedger),
            this.exportContract("Demo Flight Evidence JSON", true, input.hasDemoDirector, input.hasStageTimeline, input.hasStageScorecard, input.hasEvidenceLedger),
            this.exportContract("Replay JSON", true, input.hasDemoDirector, input.hasStageTimeline, input.hasStageScorecard, input.hasEvidenceLedger)
        ];

        const passedLayerCount: number = layers.filter((layer) => layer.status === "pass").length;
        const exportPass: boolean = exportContracts.every((contract) => contract.status === "pass");
        const overallStatus: DarkMatterDriveArchitectureSweepStatus = passedLayerCount === layers.length && exportPass ? "pass" : "watch";

        return {
            generatedAtTick: input.generatedAtTick,
            packageVersion: input.packageVersion,
            pluginOnly: true,
            strictTypeScript: true,
            noJQuery: true,
            noLooseAny: true,
            deterministicStageNavigation: input.hasDemoDirector && input.hasStageTimeline,
            finiteTelemetryGuard: input.finiteTelemetry,
            speculativeBoundaryVisible: true,
            overallStatus,
            passedLayerCount,
            totalLayerCount: layers.length,
            layers,
            exportContracts,
            recommendedNextAction: "Install the package and live-check Demo Flight stage jumps, scorecard motion, evidence ledger updates, and all JSON exports."
        };
    }

    private layer(key: string, label: string, owner: string, passed: boolean, evidence: string, risk: string, nextAction: string): DarkMatterDriveArchitectureLayerCheck {
        return {
            key,
            label,
            owner,
            status: passed ? "pass" : "watch",
            evidence,
            risk,
            nextAction
        };
    }

    private exportContract(
        exportName: string,
        required: boolean,
        includesDemoDirector: boolean,
        includesStageTimeline: boolean,
        includesStageScorecard: boolean,
        includesEvidenceLedger: boolean
    ): DarkMatterDriveArchitectureExportContract {
        const status: DarkMatterDriveArchitectureSweepStatus = includesDemoDirector && includesStageTimeline && includesStageScorecard && includesEvidenceLedger ? "pass" : "watch";
        return {
            exportName,
            required,
            includesDemoDirector,
            includesStageTimeline,
            includesStageScorecard,
            includesEvidenceLedger,
            status
        };
    }
}
