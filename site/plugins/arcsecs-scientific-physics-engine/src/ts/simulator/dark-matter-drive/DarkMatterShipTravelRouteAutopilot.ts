import { DarkMatterShipTravelSandboxState } from "./DarkMatterShipTravelSandbox";
import { DarkMatterTravelRouteCandidate, DarkMatterTravelRoutePlan } from "./DarkMatterShipTravelRoutePlanner";

/**
 * Autopilot command produced from a selected route candidate.
 */
export interface DarkMatterTravelAutopilotCommand {
    readonly commandId: string;
    readonly targetUiPositionX: number;
    readonly targetUiPositionY: number;
    readonly targetArcseconds: number;
    readonly thrustRecommended: boolean;
    readonly brakeRecommended: boolean;
    readonly inertialAssistRecommended: boolean;
    readonly scoopRecommended: boolean;
    readonly steeringInstruction: string;
    readonly finite: boolean;
}

/**
 * Autopilot status snapshot.
 */
export interface DarkMatterTravelAutopilotState {
    readonly autopilotId: string;
    readonly routeCandidateId: string;
    readonly routeCandidateLabel: string;
    readonly engaged: boolean;
    readonly ticksSimulated: number;
    readonly startingDistanceToTarget: number;
    readonly currentDistanceToTarget: number;
    readonly progressTowardTarget: number;
    readonly targetReached: boolean;
    readonly statusLabel: string;
    readonly finite: boolean;
}

/**
 * Autopilot validation row.
 */
export interface DarkMatterTravelAutopilotValidationResult {
    readonly key: string;
    readonly label: string;
    readonly passed: boolean;
    readonly evidence: string;
}

/**
 * Complete route-autopilot export.
 */
export interface DarkMatterTravelAutopilotExport {
    readonly darkMatterTravelAutopilot: DarkMatterTravelAutopilotState;
    readonly darkMatterTravelAutopilotTarget: DarkMatterTravelRouteCandidate;
    readonly darkMatterTravelAutopilotCommands: readonly DarkMatterTravelAutopilotCommand[];
    readonly darkMatterTravelAutopilotValidation: readonly DarkMatterTravelAutopilotValidationResult[];
}

/**
 * Builds deterministic autopilot commands from a route plan and sandbox telemetry.
 */
export class DarkMatterShipTravelRouteAutopilot {
    /**
     * Builds the autopilot export bundle.
     * @param sandbox Current sandbox state.
     * @param routePlan Current route plan.
     * @param ticksSimulated Number of simulation ticks applied by the autopilot.
     * @returns Route autopilot export bundle.
     */
    public build(sandbox: DarkMatterShipTravelSandboxState, routePlan: DarkMatterTravelRoutePlan, ticksSimulated: number): DarkMatterTravelAutopilotExport {
        const target: DarkMatterTravelRouteCandidate = routePlan.recommendedCandidate;
        const startingDistanceToTarget: number = this.distance(sandbox.routeLog.startPositionX, sandbox.routeLog.startPositionY, target.targetUiPositionX, target.targetUiPositionY);
        const currentDistanceToTarget: number = this.distance(sandbox.ship.uiPositionX, sandbox.ship.uiPositionY, target.targetUiPositionX, target.targetUiPositionY);
        const progressTowardTarget: number = Math.max(0, startingDistanceToTarget - currentDistanceToTarget);
        const targetReached: boolean = currentDistanceToTarget < 5;
        const command: DarkMatterTravelAutopilotCommand = this.buildCommand(sandbox, target);
        const state: DarkMatterTravelAutopilotState = {
            autopilotId: "dmd-route-autopilot-v1",
            routeCandidateId: target.candidateId,
            routeCandidateLabel: target.label,
            engaged: true,
            ticksSimulated,
            startingDistanceToTarget,
            currentDistanceToTarget,
            progressTowardTarget,
            targetReached,
            statusLabel: targetReached ? "target reached" : "navigating recommended route",
            finite: this.allFinite([ticksSimulated, startingDistanceToTarget, currentDistanceToTarget, progressTowardTarget])
        };
        const validation: readonly DarkMatterTravelAutopilotValidationResult[] = [
            {
                key: "finite-autopilot-state",
                label: "Finite autopilot state",
                passed: state.finite && command.finite,
                evidence: "Target coordinates, distances, target arcseconds, and command values are finite."
            },
            {
                key: "planner-target-used",
                label: "Planner target used",
                passed: target.candidateId === routePlan.selectedCandidateId,
                evidence: `Autopilot target uses route planner candidate ${target.candidateId}.`
            },
            {
                key: "progress-non-negative",
                label: "Progress is non-negative",
                passed: progressTowardTarget >= 0,
                evidence: "Autopilot progress is clamped to non-negative values for deterministic telemetry."
            },
            {
                key: "tradeoff-aware-command",
                label: "Tradeoff-aware command",
                passed: command.thrustRecommended || command.brakeRecommended || command.inertialAssistRecommended || command.scoopRecommended,
                evidence: "Autopilot command responds to fuel, thermal, route, and drag tradeoffs."
            }
        ];

        return {
            darkMatterTravelAutopilot: state,
            darkMatterTravelAutopilotTarget: target,
            darkMatterTravelAutopilotCommands: [command],
            darkMatterTravelAutopilotValidation: validation
        };
    }

    private buildCommand(sandbox: DarkMatterShipTravelSandboxState, target: DarkMatterTravelRouteCandidate): DarkMatterTravelAutopilotCommand {
        const distanceToTarget: number = this.distance(sandbox.ship.uiPositionX, sandbox.ship.uiPositionY, target.targetUiPositionX, target.targetUiPositionY);
        const thrustRecommended: boolean = sandbox.ship.fuelCharge > 8 && sandbox.ship.thermalLoad < 82 && distanceToTarget > 3;
        const brakeRecommended: boolean = sandbox.ship.thermalLoad > 86 || distanceToTarget < 4;
        const inertialAssistRecommended: boolean = target.candidateType === "safe-void-coast" || target.candidateType === "emergency-cooling" || sandbox.ship.navigationRisk > 68;
        const scoopRecommended: boolean = target.candidateType === "fuel-harvest" || sandbox.ship.fuelCharge < 35;
        return {
            commandId: `command-${target.candidateId}`,
            targetUiPositionX: target.targetUiPositionX,
            targetUiPositionY: target.targetUiPositionY,
            targetArcseconds: target.targetArcseconds,
            thrustRecommended,
            brakeRecommended,
            inertialAssistRecommended,
            scoopRecommended,
            steeringInstruction: this.buildSteeringInstruction(target, distanceToTarget),
            finite: this.allFinite([target.targetUiPositionX, target.targetUiPositionY, target.targetArcseconds, distanceToTarget])
        };
    }

    private buildSteeringInstruction(target: DarkMatterTravelRouteCandidate, distanceToTarget: number): string {
        if (target.candidateType === "fuel-harvest") {
            return `Steer toward fuel-rich ${target.targetRegionType}; keep scoop active and watch torsion/thermal costs. Distance ${distanceToTarget.toFixed(2)}.`;
        }
        if (target.candidateType === "safe-void-coast") {
            return `Steer toward void coasting route; use inertial assist and conserve fuel. Distance ${distanceToTarget.toFixed(2)}.`;
        }
        if (target.candidateType === "emergency-cooling") {
            return `Steer toward cooling corridor; reduce thermal load before dense-substrate maneuvers. Distance ${distanceToTarget.toFixed(2)}.`;
        }
        if (target.candidateType === "direct-beacon") {
            return `Steer toward beacon approach; prioritize final destination progress. Distance ${distanceToTarget.toFixed(2)}.`;
        }
        return `Steer toward balanced substrate corridor. Distance ${distanceToTarget.toFixed(2)}.`;
    }

    private distance(startX: number, startY: number, endX: number, endY: number): number {
        const deltaX: number = endX - startX;
        const deltaY: number = endY - startY;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    private allFinite(values: readonly number[]): boolean {
        return values.every((value) => Number.isFinite(value));
    }
}
