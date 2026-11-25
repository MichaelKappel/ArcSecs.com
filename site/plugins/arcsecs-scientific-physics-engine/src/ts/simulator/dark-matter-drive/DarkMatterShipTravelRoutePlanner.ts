import { DarkMatterShipTravelSandboxState, DarkMatterTravelRegion, DarkMatterShipState } from "./DarkMatterShipTravelSandbox";
import { DarkMatterTravelRelationalAdapterTelemetry } from "./DarkMatterShipTravelRelationalAdapter";

/**
 * Route candidate category used by the Dark Matter Ship Travel Route Planner.
 */
export type DarkMatterTravelRouteCandidateType =
    | "fuel-harvest"
    | "safe-void-coast"
    | "balanced"
    | "emergency-cooling"
    | "direct-beacon";

/**
 * One candidate route scored from the current sandbox state.
 */
export interface DarkMatterTravelRouteCandidate {
    readonly candidateId: string;
    readonly candidateType: DarkMatterTravelRouteCandidateType;
    readonly label: string;
    readonly targetRegionId: string;
    readonly targetRegionType: string;
    readonly targetUiPositionX: number;
    readonly targetUiPositionY: number;
    readonly targetArcseconds: number;
    readonly fuelGainScore: number;
    readonly gravityTorsionCost: number;
    readonly weberDragCost: number;
    readonly thermalRiskCost: number;
    readonly opticalLagCost: number;
    readonly inertialCoastBenefit: number;
    readonly beaconProgressScore: number;
    readonly totalScore: number;
    readonly recommendation: string;
    readonly finite: boolean;
}

/**
 * Planner summary and selected candidate.
 */
export interface DarkMatterTravelRoutePlan {
    readonly plannerId: string;
    readonly generatedAtTick: number;
    readonly selectedCandidateId: string;
    readonly routePolicy: string;
    readonly routeSummary: string;
    readonly candidateCount: number;
    readonly candidates: readonly DarkMatterTravelRouteCandidate[];
    readonly recommendedCandidate: DarkMatterTravelRouteCandidate;
    readonly finite: boolean;
}

/**
 * Route planner validation row.
 */
export interface DarkMatterTravelRoutePlannerValidationResult {
    readonly key: string;
    readonly label: string;
    readonly passed: boolean;
    readonly evidence: string;
}

/**
 * Complete route planner export bundle.
 */
export interface DarkMatterTravelRoutePlannerExport {
    readonly darkMatterTravelRoutePlanner: DarkMatterTravelRoutePlan;
    readonly darkMatterTravelRouteCandidates: readonly DarkMatterTravelRouteCandidate[];
    readonly darkMatterTravelRecommendedRoute: DarkMatterTravelRouteCandidate;
    readonly darkMatterTravelRoutePlannerValidation: readonly DarkMatterTravelRoutePlannerValidationResult[];
}

/**
 * Builds deterministic route suggestions from fuel, torsion, Weber drag, thermal risk, optical lag, and beacon progress.
 */
export class DarkMatterShipTravelRoutePlanner {
    /**
     * Builds a route plan for the current sandbox state.
     * @param sandbox Current interactive travel sandbox state.
     * @param adapter Current relational adapter telemetry.
     * @returns Complete route planner export bundle.
     */
    public build(sandbox: DarkMatterShipTravelSandboxState, adapter: DarkMatterTravelRelationalAdapterTelemetry): DarkMatterTravelRoutePlannerExport {
        const candidates: readonly DarkMatterTravelRouteCandidate[] = [
            this.buildCandidate("fuel-harvest", "Fuel harvest pass", "dense_filament", sandbox, adapter),
            this.buildCandidate("safe-void-coast", "Safe void coast", "void_channel", sandbox, adapter),
            this.buildCandidate("balanced", "Balanced substrate corridor", "galaxy_halo", sandbox, adapter),
            this.buildCandidate("emergency-cooling", "Emergency cooling route", "smooth_inertial_corridor", sandbox, adapter),
            this.buildCandidate("direct-beacon", "Direct beacon approach", "beacon_approach_zone", sandbox, adapter)
        ];

        const recommendedCandidate: DarkMatterTravelRouteCandidate = candidates.slice().sort((left, right) => right.totalScore - left.totalScore)[0];
        const validation: readonly DarkMatterTravelRoutePlannerValidationResult[] = this.validate(candidates, recommendedCandidate, sandbox, adapter);

        const plan: DarkMatterTravelRoutePlan = {
            plannerId: "dmd-route-planner-v1",
            generatedAtTick: sandbox.telemetry.tick,
            selectedCandidateId: recommendedCandidate.candidateId,
            routePolicy: "Maximize fuel and beacon progress while minimizing teleparallel torsion, Weber drag, optical lag, and thermal risk.",
            routeSummary: recommendedCandidate.recommendation,
            candidateCount: candidates.length,
            candidates,
            recommendedCandidate,
            finite: candidates.every((candidate) => candidate.finite) && validation.every((row) => row.passed)
        };

        return {
            darkMatterTravelRoutePlanner: plan,
            darkMatterTravelRouteCandidates: candidates,
            darkMatterTravelRecommendedRoute: recommendedCandidate,
            darkMatterTravelRoutePlannerValidation: validation
        };
    }

    private buildCandidate(candidateType: DarkMatterTravelRouteCandidateType, label: string, regionType: string, sandbox: DarkMatterShipTravelSandboxState, adapter: DarkMatterTravelRelationalAdapterTelemetry): DarkMatterTravelRouteCandidate {
        const ship: DarkMatterShipState = sandbox.ship;
        const region: DarkMatterTravelRegion = sandbox.regions.find((entry) => entry.regionType === regionType) || sandbox.regions[0];
        const distanceToCandidate: number = this.distance(ship.uiPositionX, ship.uiPositionY, region.centerUiPositionX, region.centerUiPositionY);
        const targetArcseconds: number = distanceToCandidate * 48.2;
        const beaconDistanceAfter: number = this.distance(region.centerUiPositionX, region.centerUiPositionY, sandbox.configuration.beaconPositionX, sandbox.configuration.beaconPositionY);
        const fuelGainScore: number = region.localProcaSubstrateDensity * region.harvestMultiplier * 18;
        const gravityTorsionCost: number = region.torsionGaugeForceMultiplier * region.navigationRiskMultiplier * 12;
        const weberDragCost: number = region.weberDragMultiplier * region.localProcaSubstrateDensity * 15;
        const thermalRiskCost: number = region.thermalCompressionMultiplier * Math.max(0, ship.thermalLoad - 15) * 0.42;
        const opticalLagCost: number = region.opticalAberrationMultiplier * adapter.opticalDistortion.photonLaneLag * 8;
        const inertialCoastBenefit: number = Math.max(0, 100 - weberDragCost) * (region.regionType === "void_channel" || region.regionType === "smooth_inertial_corridor" ? 0.8 : 0.26);
        const beaconProgressScore: number = Math.max(0, 100 - beaconDistanceAfter);
        const typeBias: number = this.routeBias(candidateType, ship);
        const totalScore: number = fuelGainScore + inertialCoastBenefit + beaconProgressScore + typeBias - gravityTorsionCost - weberDragCost - thermalRiskCost - opticalLagCost;

        return {
            candidateId: `route-${candidateType}`,
            candidateType,
            label,
            targetRegionId: region.regionId,
            targetRegionType: region.regionType,
            targetUiPositionX: region.centerUiPositionX,
            targetUiPositionY: region.centerUiPositionY,
            targetArcseconds,
            fuelGainScore,
            gravityTorsionCost,
            weberDragCost,
            thermalRiskCost,
            opticalLagCost,
            inertialCoastBenefit,
            beaconProgressScore,
            totalScore,
            recommendation: this.buildRecommendation(candidateType, region, totalScore),
            finite: this.allFinite([targetArcseconds, fuelGainScore, gravityTorsionCost, weberDragCost, thermalRiskCost, opticalLagCost, inertialCoastBenefit, beaconProgressScore, totalScore])
        };
    }

    private validate(candidates: readonly DarkMatterTravelRouteCandidate[], recommendedCandidate: DarkMatterTravelRouteCandidate, sandbox: DarkMatterShipTravelSandboxState, adapter: DarkMatterTravelRelationalAdapterTelemetry): readonly DarkMatterTravelRoutePlannerValidationResult[] {
        const denseCandidate: DarkMatterTravelRouteCandidate | undefined = candidates.find((candidate) => candidate.candidateType === "fuel-harvest");
        const voidCandidate: DarkMatterTravelRouteCandidate | undefined = candidates.find((candidate) => candidate.candidateType === "safe-void-coast");

        return [
            {
                key: "finite-route-scores",
                label: "Finite route scores",
                passed: candidates.every((candidate) => candidate.finite),
                evidence: "All route candidates have finite fuel, torsion, drag, thermal, optical, beacon, and total score values."
            },
            {
                key: "dense-fuel-cost-tradeoff",
                label: "Dense fuel/cost trade-off",
                passed: Boolean(denseCandidate && denseCandidate.fuelGainScore > (voidCandidate ? voidCandidate.fuelGainScore : 0) && denseCandidate.weberDragCost > 0),
                evidence: "Dense route has higher fuel potential while retaining drag/risk costs."
            },
            {
                key: "void-coast-option",
                label: "Void coast option",
                passed: Boolean(voidCandidate && voidCandidate.inertialCoastBenefit > 35),
                evidence: "Void route remains available as a low-fuel / high-coasting alternative."
            },
            {
                key: "recommended-route-present",
                label: "Recommended route present",
                passed: recommendedCandidate.totalScore === Math.max(...candidates.map((candidate) => candidate.totalScore)),
                evidence: `Recommended route is ${recommendedCandidate.label}.`
            },
            {
                key: "adapter-aligned",
                label: "Relational adapter aligned",
                passed: adapter.finite && sandbox.outcome.finiteTelemetryGuard,
                evidence: "Route planner consumes the finite relational adapter and sandbox outcome state."
            }
        ];
    }

    private buildRecommendation(candidateType: DarkMatterTravelRouteCandidateType, region: DarkMatterTravelRegion, totalScore: number): string {
        if (candidateType === "fuel-harvest") {
            return `Harvest fuel through ${region.displayLabel}, but watch torsion, Weber drag, and thermal compression. Score ${totalScore.toFixed(2)}.`;
        }
        if (candidateType === "safe-void-coast") {
            return `Coast through ${region.displayLabel}; fuel is weaker, but inertia is preserved and drag is low. Score ${totalScore.toFixed(2)}.`;
        }
        if (candidateType === "emergency-cooling") {
            return `Use ${region.displayLabel} to cool the hull and reduce dense-substrate stress. Score ${totalScore.toFixed(2)}.`;
        }
        if (candidateType === "direct-beacon") {
            return `Aim toward ${region.displayLabel}; shortest beacon progress can still cost fuel if the route crosses dense substrate. Score ${totalScore.toFixed(2)}.`;
        }
        return `Use ${region.displayLabel} as a balanced fuel, risk, and beacon-progress route. Score ${totalScore.toFixed(2)}.`;
    }

    private routeBias(candidateType: DarkMatterTravelRouteCandidateType, ship: DarkMatterShipState): number {
        if (candidateType === "emergency-cooling" && ship.thermalLoad > 60) { return 34; }
        if (candidateType === "fuel-harvest" && ship.fuelCharge < 35) { return 32; }
        if (candidateType === "safe-void-coast" && ship.navigationRisk > 70) { return 28; }
        if (candidateType === "direct-beacon" && ship.distanceToBeaconUiUnits < 30) { return 26; }
        if (candidateType === "balanced") { return 12; }
        return 0;
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
