export type VisualEffectLevel = "full" | "reduced" | "minimal";
export type PerformanceRiskLevel = "low" | "medium" | "high";

export interface PerformanceBudgetInput {
    readonly requestedPhotonPacketCount: number;
    readonly estimatedFrameBudgetMs: number;
    readonly viewportWidthPixels: number;
    readonly devicePixelRatio: number;
    readonly prefersReducedMotion: boolean;
    readonly warningCount: number;
}

export interface PerformanceBudgetRecommendation {
    readonly requestedPhotonPacketCount: number;
    readonly recommendedPhotonPacketCount: number;
    readonly recommendedTrailLength: number;
    readonly telemetryUpdateHz: number;
    readonly visualEffectLevel: VisualEffectLevel;
    readonly riskLevel: PerformanceRiskLevel;
    readonly workerIsolationRequired: boolean;
    readonly degradationReasons: readonly string[];
    readonly benchmarkStatusText: string;
}

/**
 * Converts live frame-budget and accessibility signals into a concrete rendering budget.
 * @remarks This keeps lower-end devices responsive by reducing photon density, trail length,
 * visual pulses, and telemetry frequency before the browser becomes unresponsive.
 */
export class PerformanceBudgetGovernor {
    /**
     * Builds a deterministic performance recommendation for the current viewport and run.
     * @param input Current performance and accessibility signals.
     */
    public evaluate(input: PerformanceBudgetInput): PerformanceBudgetRecommendation {
        const requestedPhotonPacketCount: number = this.clamp(Math.round(input.requestedPhotonPacketCount), 8, 2500);
        const frameBudgetMs: number = Math.max(0, input.estimatedFrameBudgetMs);
        const viewportWidthPixels: number = Math.max(1, input.viewportWidthPixels);
        const devicePixelRatio: number = this.clamp(input.devicePixelRatio, 0.5, 4);
        const warningCount: number = Math.max(0, Math.round(input.warningCount));
        const reasons: string[] = [];

        let riskLevel: PerformanceRiskLevel = "low";
        if (frameBudgetMs > 12 || requestedPhotonPacketCount > 1600 || devicePixelRatio > 2.5) {
            riskLevel = "high";
        } else if (frameBudgetMs > 8 || requestedPhotonPacketCount > 900 || viewportWidthPixels < 760 || warningCount > 2) {
            riskLevel = "medium";
        }

        if (frameBudgetMs > 12) { reasons.push("frame budget above 12 ms"); }
        if (requestedPhotonPacketCount > 1600) { reasons.push("dense photon packet request"); }
        if (viewportWidthPixels < 760) { reasons.push("compact viewport"); }
        if (devicePixelRatio > 2.5) { reasons.push("high device pixel ratio"); }
        if (warningCount > 2) { reasons.push("active warning load"); }
        if (input.prefersReducedMotion) { reasons.push("reduced-motion preference"); }

        let recommendedPhotonPacketCount: number = requestedPhotonPacketCount;
        let recommendedTrailLength: number = 96;
        let telemetryUpdateHz: number = 12;
        let visualEffectLevel: VisualEffectLevel = "full";

        if (riskLevel === "medium") {
            recommendedPhotonPacketCount = Math.min(recommendedPhotonPacketCount, 900);
            recommendedTrailLength = 48;
            telemetryUpdateHz = 8;
            visualEffectLevel = "reduced";
        }
        if (riskLevel === "high") {
            recommendedPhotonPacketCount = Math.min(recommendedPhotonPacketCount, 512);
            recommendedTrailLength = 24;
            telemetryUpdateHz = 5;
            visualEffectLevel = "minimal";
        }
        if (input.prefersReducedMotion) {
            recommendedPhotonPacketCount = Math.min(recommendedPhotonPacketCount, 256);
            recommendedTrailLength = 12;
            telemetryUpdateHz = 4;
            visualEffectLevel = "minimal";
        }

        const benchmarkStatusText: string = riskLevel === "low"
            ? "Interactive budget nominal."
            : riskLevel === "medium"
                ? "Reduced visual density recommended before recording or public demos."
                : "Graceful degradation required: lower photon count, shorter trails, and minimal pulses.";

        return {
            requestedPhotonPacketCount,
            recommendedPhotonPacketCount,
            recommendedTrailLength,
            telemetryUpdateHz,
            visualEffectLevel,
            riskLevel,
            workerIsolationRequired: true,
            degradationReasons: reasons,
            benchmarkStatusText
        };
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
    }
}
