import { DarkMatterShipTravelSandboxState, DarkMatterTravelRegion, DarkMatterShipState } from "./DarkMatterShipTravelSandbox";

/**
 * Instrumental mask projection for the 2D UI surface.
 */
export interface DarkMatterTravelInstrumentalMaskProjection {
    readonly uiMaskX: number;
    readonly uiMaskY: number;
    readonly uiMaskIsPhysicalSpace: false;
    readonly relationalAdapterDescription: string;
}

/**
 * Angular route vector used instead of lightyear distance.
 */
export interface DarkMatterTravelArcsecsNavigationVector {
    readonly arcsecondsToBeacon: number;
    readonly headingSlewArcsecondsPerSecond: number;
    readonly boundedSlewArcsecondsPerSecond: number;
    readonly targetBearingDegrees: number;
    readonly shapeDynamicsRatio: number;
    readonly finite: boolean;
}

/**
 * Optical distortion model tied to local substrate density.
 */
export interface DarkMatterTravelOpticalDistortionTelemetry {
    readonly psfFullWidthHalfMaximumArcseconds: number;
    readonly densityWeightedBlur: number;
    readonly photonLaneLag: number;
    readonly energyAttenuation: number;
    readonly visibilityStatus: string;
    readonly finite: boolean;
}

/**
 * Teleparallel gauge-force sample used instead of curvature wording.
 */
export interface DarkMatterTravelTeleparallelGaugeForceSample {
    readonly translationalGaugeForceX: number;
    readonly translationalGaugeForceY: number;
    readonly torsionMagnitude: number;
    readonly curvatureLanguageAllowed: false;
    readonly forceDescription: string;
    readonly finite: boolean;
}

/**
 * Proca substrate density and harvest/drag balance.
 */
export interface DarkMatterTravelProcaSubstrateSample {
    readonly localVectorPotentialDensity: number;
    readonly harvestPotential: number;
    readonly weberDragPenalty: number;
    readonly inertialCoastBenefit: number;
    readonly denseRegionFuelRiskRatio: number;
    readonly finite: boolean;
}

/**
 * Complete relational adapter overlay exported by the sandbox.
 */
export interface DarkMatterTravelRelationalAdapterTelemetry {
    readonly instrumentalMask: DarkMatterTravelInstrumentalMaskProjection;
    readonly arcsecsNavigationVector: DarkMatterTravelArcsecsNavigationVector;
    readonly opticalDistortion: DarkMatterTravelOpticalDistortionTelemetry;
    readonly teleparallelGaugeForce: DarkMatterTravelTeleparallelGaugeForceSample;
    readonly procaSubstrate: DarkMatterTravelProcaSubstrateSample;
    readonly adapterValidation: readonly string[];
    readonly speculativeBoundary: string;
    readonly finite: boolean;
}

/**
 * Builds adapter telemetry that keeps the 2D cockpit understandable while preserving ArcSecs relational language.
 */
export class DarkMatterShipTravelRelationalAdapter {
    /**
     * Builds adapter telemetry from the current sandbox state.
     * @param sandbox Current Dark Matter Ship Travel Sandbox state.
     * @returns Relational adapter telemetry.
     */
    public build(sandbox: DarkMatterShipTravelSandboxState): DarkMatterTravelRelationalAdapterTelemetry {
        const ship: DarkMatterShipState = sandbox.ship;
        const activeRegion: DarkMatterTravelRegion = this.findActiveRegion(sandbox);
        const arcsecondsToBeacon: number = ship.distanceToBeaconUiUnits * 48.2;
        const boundedSlewArcsecondsPerSecond: number = 10800;
        const targetBearingDegrees: number = Math.atan2(sandbox.configuration.beaconPositionY - ship.uiPositionY, sandbox.configuration.beaconPositionX - ship.uiPositionX) * 180 / Math.PI;
        const shapeDynamicsRatio: number = ship.distanceToBeaconUiUnits / Math.max(1, sandbox.configuration.widthUiUnits);
        const psfFullWidthHalfMaximumArcseconds: number = 2 + activeRegion.localProcaSubstrateDensity * activeRegion.opticalAberrationMultiplier * 0.74;
        const harvestPotential: number = activeRegion.localProcaSubstrateDensity * activeRegion.harvestMultiplier;
        const weberDragPenalty: number = activeRegion.weberDragMultiplier * activeRegion.localProcaSubstrateDensity;
        const inertialCoastBenefit: number = 100 - weberDragPenalty * 12;
        const denseRegionFuelRiskRatio: number = harvestPotential / Math.max(0.01, weberDragPenalty + activeRegion.navigationRiskMultiplier);

        const instrumentalMask: DarkMatterTravelInstrumentalMaskProjection = {
            uiMaskX: ship.uiPositionX,
            uiMaskY: ship.uiPositionY,
            uiMaskIsPhysicalSpace: false,
            relationalAdapterDescription: "The 2D X/Y surface is an instrumental mask for visitor control, replay, and visualization; route calculations are recorded as relational Arcsecs deltas and substrate samples."
        };

        const arcsecsNavigationVector: DarkMatterTravelArcsecsNavigationVector = {
            arcsecondsToBeacon,
            headingSlewArcsecondsPerSecond: sandbox.configuration.slewRateDegreesPerTick * 3600,
            boundedSlewArcsecondsPerSecond,
            targetBearingDegrees,
            shapeDynamicsRatio,
            finite: this.allFinite([arcsecondsToBeacon, targetBearingDegrees, shapeDynamicsRatio])
        };

        const opticalDistortion: DarkMatterTravelOpticalDistortionTelemetry = {
            psfFullWidthHalfMaximumArcseconds,
            densityWeightedBlur: psfFullWidthHalfMaximumArcseconds * activeRegion.localProcaSubstrateDensity,
            photonLaneLag: sandbox.wavefrontTrace.photonLag,
            energyAttenuation: sandbox.wavefrontTrace.energyAttenuation,
            visibilityStatus: sandbox.wavefrontTrace.opticalVisibilityStatus,
            finite: this.allFinite([psfFullWidthHalfMaximumArcseconds, sandbox.wavefrontTrace.photonLag, sandbox.wavefrontTrace.energyAttenuation])
        };

        const teleparallelGaugeForce: DarkMatterTravelTeleparallelGaugeForceSample = {
            translationalGaugeForceX: ship.localTorsionGaugeForceX,
            translationalGaugeForceY: ship.localTorsionGaugeForceY,
            torsionMagnitude: ship.torsionPullMagnitude,
            curvatureLanguageAllowed: false,
            forceDescription: "Route bending is modeled as a translational gauge-force / torsion sample on the sandbox mask, not spacetime curvature.",
            finite: this.allFinite([ship.localTorsionGaugeForceX, ship.localTorsionGaugeForceY, ship.torsionPullMagnitude])
        };

        const procaSubstrate: DarkMatterTravelProcaSubstrateSample = {
            localVectorPotentialDensity: activeRegion.localProcaSubstrateDensity,
            harvestPotential,
            weberDragPenalty,
            inertialCoastBenefit,
            denseRegionFuelRiskRatio,
            finite: this.allFinite([activeRegion.localProcaSubstrateDensity, harvestPotential, weberDragPenalty, inertialCoastBenefit, denseRegionFuelRiskRatio])
        };

        const adapterValidation: readonly string[] = [
            "UI coordinates are marked as non-physical instrumental-mask values.",
            "Distance-to-beacon is exported as Arcsecs navigation telemetry rather than lightyears.",
            "Optical distortion is tied to Proca substrate density through PSF FWHM proxy.",
            "Route bending is recorded as teleparallel translational gauge force / torsion magnitude.",
            "Dense-region fuel harvest is balanced against Weber drag and navigation risk."
        ];

        return {
            instrumentalMask,
            arcsecsNavigationVector,
            opticalDistortion,
            teleparallelGaugeForce,
            procaSubstrate,
            adapterValidation,
            speculativeBoundary: "Speculative research visualization only; this adapter makes ArcSecs assumptions explicit and testable.",
            finite: instrumentalMask.uiMaskIsPhysicalSpace === false
                && arcsecsNavigationVector.finite
                && opticalDistortion.finite
                && teleparallelGaugeForce.finite
                && procaSubstrate.finite
        };
    }

    private findActiveRegion(sandbox: DarkMatterShipTravelSandboxState): DarkMatterTravelRegion {
        const matchedRegion: DarkMatterTravelRegion | undefined = sandbox.regions.find((region) => region.regionType === sandbox.ship.lastCrossedRegionType);
        return matchedRegion || sandbox.regions[0];
    }

    private allFinite(values: readonly number[]): boolean {
        return values.every((value) => Number.isFinite(value));
    }
}
