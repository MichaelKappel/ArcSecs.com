import { DarkMatterShipTravelSandboxState } from "./DarkMatterShipTravelSandbox";
import { DarkMatterTravelRouteCandidate, DarkMatterTravelRoutePlan } from "./DarkMatterShipTravelRoutePlanner";
import { DarkMatterTravelAutopilotExport } from "./DarkMatterShipTravelRouteAutopilot";

/**
 * Mission objective status.
 */
export type DarkMatterTravelMissionObjectiveStatus = "complete" | "active" | "watch";

/**
 * Mission objective type.
 */
export type DarkMatterTravelMissionObjectiveType =
    | "reach-beacon"
    | "maintain-fuel"
    | "control-thermal-load"
    | "sample-dense-region"
    | "sample-void-region"
    | "avoid-excessive-torsion"
    | "validate-route-autopilot";

/**
 * Mission objective row.
 */
export interface DarkMatterTravelMissionObjective {
    readonly objectiveId: string;
    readonly objectiveType: DarkMatterTravelMissionObjectiveType;
    readonly label: string;
    readonly status: DarkMatterTravelMissionObjectiveStatus;
    readonly progress: number;
    readonly target: number;
    readonly scoreContribution: number;
    readonly evidence: string;
    readonly finite: boolean;
}

/**
 * Mission scorecard.
 */
export interface DarkMatterTravelMissionScore {
    readonly totalScore: number;
    readonly objectiveCount: number;
    readonly completedObjectiveCount: number;
    readonly activeObjectiveCount: number;
    readonly watchObjectiveCount: number;
    readonly missionPass: boolean;
    readonly finalGrade: string;
    readonly finite: boolean;
}

/**
 * Mission validation row.
 */
export interface DarkMatterTravelMissionValidationResult {
    readonly key: string;
    readonly label: string;
    readonly passed: boolean;
    readonly evidence: string;
}

/**
 * Complete mission objective export.
 */
export interface DarkMatterTravelMissionObjectiveExport {
    readonly darkMatterTravelMission: string;
    readonly darkMatterTravelMissionObjectives: readonly DarkMatterTravelMissionObjective[];
    readonly darkMatterTravelMissionScore: DarkMatterTravelMissionScore;
    readonly darkMatterTravelMissionValidation: readonly DarkMatterTravelMissionValidationResult[];
}

/**
 * Builds mission objectives from sandbox, route planner, and route autopilot state.
 */
export class DarkMatterShipTravelMissionObjectives {
    /**
     * Builds mission objectives for the current sandbox run.
     * @param sandbox Current interactive travel sandbox state.
     * @param routePlan Current route planner state.
     * @param autopilot Current route autopilot state.
     * @returns Mission objective export bundle.
     */
    public build(sandbox: DarkMatterShipTravelSandboxState, routePlan: DarkMatterTravelRoutePlan, autopilot: DarkMatterTravelAutopilotExport): DarkMatterTravelMissionObjectiveExport {
        const recommendedRoute: DarkMatterTravelRouteCandidate = routePlan.recommendedCandidate;
        const objectives: readonly DarkMatterTravelMissionObjective[] = [
            this.objective(
                "reach-beacon",
                "reach-beacon",
                "Reach the beacon without lightyear navigation",
                sandbox.outcome.destinationReached ? "complete" : "active",
                Math.max(0, 100 - sandbox.ship.distanceToBeaconUiUnits),
                100,
                sandbox.outcome.destinationReached ? 20 : 12,
                `Distance to beacon is ${sandbox.ship.distanceToBeaconUiUnits.toFixed(2)} UI-mask units, exported as relational Arcsecs telemetry.`
            ),
            this.objective(
                "maintain-fuel",
                "maintain-fuel",
                "Maintain enough harvested fuel reserve",
                sandbox.ship.fuelCharge >= 20 ? "complete" : "watch",
                sandbox.ship.fuelCharge,
                20,
                sandbox.ship.fuelCharge >= 20 ? 16 : 5,
                `Fuel charge is ${sandbox.ship.fuelCharge.toFixed(2)} percent.`
            ),
            this.objective(
                "control-thermal-load",
                "control-thermal-load",
                "Keep thermal load below redline",
                sandbox.ship.thermalLoad < 78 ? "complete" : "watch",
                Math.max(0, 100 - sandbox.ship.thermalLoad),
                22,
                sandbox.ship.thermalLoad < 78 ? 16 : 4,
                `Thermal load is ${sandbox.ship.thermalLoad.toFixed(2)} percent.`
            ),
            this.objective(
                "sample-dense-region",
                "sample-dense-region",
                "Sample a fuel-rich dense region",
                sandbox.routeLog.regionsCrossed.some((region) => region === "dense_filament" || region === "galaxy_halo" || region === "matter_cloud") ? "complete" : "active",
                sandbox.routeLog.regionsCrossed.some((region) => region === "dense_filament" || region === "galaxy_halo" || region === "matter_cloud") ? 1 : 0,
                1,
                sandbox.routeLog.regionsCrossed.some((region) => region === "dense_filament" || region === "galaxy_halo" || region === "matter_cloud") ? 14 : 3,
                "Dense-region sampling proves the fuel/risk tradeoff was observed."
            ),
            this.objective(
                "sample-void-region",
                "sample-void-region",
                "Sample a smooth inertial coasting region",
                sandbox.routeLog.regionsCrossed.some((region) => region === "void_channel" || region === "smooth_inertial_corridor") ? "complete" : "active",
                sandbox.routeLog.regionsCrossed.some((region) => region === "void_channel" || region === "smooth_inertial_corridor") ? 1 : 0,
                1,
                sandbox.routeLog.regionsCrossed.some((region) => region === "void_channel" || region === "smooth_inertial_corridor") ? 14 : 3,
                "Void/inertial region sampling proves coasting was observed."
            ),
            this.objective(
                "avoid-excessive-torsion",
                "avoid-excessive-torsion",
                "Avoid excessive torsion pull",
                sandbox.telemetry.peakTorsionPull < 0.22 ? "complete" : "watch",
                Math.max(0, 0.22 - sandbox.telemetry.peakTorsionPull),
                0.22,
                sandbox.telemetry.peakTorsionPull < 0.22 ? 12 : 4,
                `Peak torsion pull is ${sandbox.telemetry.peakTorsionPull.toFixed(4)}.`
            ),
            this.objective(
                "validate-route-autopilot",
                "validate-route-autopilot",
                "Validate route autopilot against planner recommendation",
                autopilot.darkMatterTravelAutopilotValidation.every((row) => row.passed) ? "complete" : "watch",
                autopilot.darkMatterTravelAutopilot.progressTowardTarget,
                Math.max(1, autopilot.darkMatterTravelAutopilot.startingDistanceToTarget),
                autopilot.darkMatterTravelAutopilotValidation.every((row) => row.passed) ? 16 : 5,
                `Autopilot follows ${recommendedRoute.label}.`
            )
        ];
        const score: DarkMatterTravelMissionScore = this.buildScore(objectives);
        const validation: readonly DarkMatterTravelMissionValidationResult[] = this.validate(objectives, score, sandbox, routePlan, autopilot);

        return {
            darkMatterTravelMission: "Dark Matter Ship Travel Sandbox Mission",
            darkMatterTravelMissionObjectives: objectives,
            darkMatterTravelMissionScore: score,
            darkMatterTravelMissionValidation: validation
        };
    }

    private objective(objectiveId: string, objectiveType: DarkMatterTravelMissionObjectiveType, label: string, status: DarkMatterTravelMissionObjectiveStatus, progress: number, target: number, scoreContribution: number, evidence: string): DarkMatterTravelMissionObjective {
        return {
            objectiveId,
            objectiveType,
            label,
            status,
            progress,
            target,
            scoreContribution,
            evidence,
            finite: this.allFinite([progress, target, scoreContribution])
        };
    }

    private buildScore(objectives: readonly DarkMatterTravelMissionObjective[]): DarkMatterTravelMissionScore {
        const totalScore: number = objectives.reduce((sum, objective) => sum + objective.scoreContribution, 0);
        const completedObjectiveCount: number = objectives.filter((objective) => objective.status === "complete").length;
        const activeObjectiveCount: number = objectives.filter((objective) => objective.status === "active").length;
        const watchObjectiveCount: number = objectives.filter((objective) => objective.status === "watch").length;

        return {
            totalScore,
            objectiveCount: objectives.length,
            completedObjectiveCount,
            activeObjectiveCount,
            watchObjectiveCount,
            missionPass: completedObjectiveCount >= 4 && watchObjectiveCount <= 2 && totalScore >= 70,
            finalGrade: totalScore >= 90 ? "A" : (totalScore >= 80 ? "B" : (totalScore >= 70 ? "C" : "Watch")),
            finite: this.allFinite([totalScore, completedObjectiveCount, activeObjectiveCount, watchObjectiveCount])
        };
    }

    private validate(objectives: readonly DarkMatterTravelMissionObjective[], score: DarkMatterTravelMissionScore, sandbox: DarkMatterShipTravelSandboxState, routePlan: DarkMatterTravelRoutePlan, autopilot: DarkMatterTravelAutopilotExport): readonly DarkMatterTravelMissionValidationResult[] {
        return [
            {
                key: "finite-mission-objectives",
                label: "Finite mission objectives",
                passed: objectives.every((objective) => objective.finite) && score.finite,
                evidence: "All objective progress, targets, score contributions, and mission score values are finite."
            },
            {
                key: "route-planner-linked",
                label: "Route planner linked",
                passed: routePlan.selectedCandidateId === autopilot.darkMatterTravelAutopilotTarget.candidateId,
                evidence: `Mission uses planner route ${routePlan.selectedCandidateId}.`
            },
            {
                key: "sandbox-linked",
                label: "Sandbox telemetry linked",
                passed: sandbox.outcome.finiteTelemetryGuard && sandbox.validationLedger.every((row) => row.passed),
                evidence: "Mission objective scoring is grounded in sandbox validation telemetry."
            },
            {
                key: "balanced-objectives-present",
                label: "Balanced objectives present",
                passed: objectives.some((objective) => objective.objectiveType === "sample-dense-region") && objectives.some((objective) => objective.objectiveType === "sample-void-region") && objectives.some((objective) => objective.objectiveType === "control-thermal-load"),
                evidence: "Mission includes dense fuel, void coasting, and thermal management goals."
            }
        ];
    }

    private allFinite(values: readonly number[]): boolean {
        return values.every((value) => Number.isFinite(value));
    }
}
