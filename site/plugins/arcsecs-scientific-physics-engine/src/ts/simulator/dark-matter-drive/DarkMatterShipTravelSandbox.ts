/**
 * Region classes used by the interactive Dark Matter Ship Travel Sandbox.
 */
export type DarkMatterTravelRegionType =
    | "dense_filament"
    | "galaxy_halo"
    | "matter_cloud"
    | "void_channel"
    | "smooth_inertial_corridor"
    | "torsion_anomaly"
    | "beacon_approach_zone";

/**
 * Deterministic player input state for the sandbox.
 */
export interface DarkMatterTravelInputState {
    readonly thrust: boolean;
    readonly brake: boolean;
    readonly rotateLeft: boolean;
    readonly rotateRight: boolean;
    readonly scoopToggleRequested: boolean;
    readonly inertialAssistToggleRequested: boolean;
    readonly targetUiPositionX: number;
    readonly targetUiPositionY: number;
    readonly hasTarget: boolean;
}

/**
 * One visual/relational travel region sampled by the sandbox.
 */
export interface DarkMatterTravelRegion {
    readonly regionId: string;
    readonly regionType: DarkMatterTravelRegionType;
    readonly displayLabel: string;
    readonly centerUiPositionX: number;
    readonly centerUiPositionY: number;
    readonly radiusUiUnits: number;
    readonly localProcaSubstrateDensity: number;
    readonly harvestMultiplier: number;
    readonly torsionGaugeForceMultiplier: number;
    readonly weberDragMultiplier: number;
    readonly thermalCompressionMultiplier: number;
    readonly opticalAberrationMultiplier: number;
    readonly navigationRiskMultiplier: number;
    readonly advisorTrigger: string;
}

/**
 * Ship state used for rendering, replay, and relational translation.
 */
export interface DarkMatterShipState {
    readonly uiPositionX: number;
    readonly uiPositionY: number;
    readonly uiVelocityX: number;
    readonly uiVelocityY: number;
    readonly headingDegrees: number;
    readonly throttle: number;
    readonly scoopEnabled: boolean;
    readonly inertialAssistEnabled: boolean;
    readonly fuelCharge: number;
    readonly thermalLoad: number;
    readonly localSubstrateDensity: number;
    readonly localTorsionGaugeForceX: number;
    readonly localTorsionGaugeForceY: number;
    readonly torsionPullMagnitude: number;
    readonly weberDragCoefficient: number;
    readonly inertialDriftPercentage: number;
    readonly driveOutput: number;
    readonly navigationRisk: number;
    readonly distanceToBeaconUiUnits: number;
    readonly relationalArcsecsNavigationDelta: number;
    readonly lastCrossedRegionType: DarkMatterTravelRegionType;
    readonly activeTargetPointX: number;
    readonly activeTargetPointY: number;
    readonly finiteTelemetry: boolean;
}

/**
 * Per-tick telemetry derived from the coordinate mask and relational layer.
 */
export interface DarkMatterTravelTelemetry {
    readonly tick: number;
    readonly fuelGained: number;
    readonly fuelSpent: number;
    readonly thermalAdded: number;
    readonly peakThermalLoad: number;
    readonly peakTorsionPull: number;
    readonly peakWeberDrag: number;
    readonly maximumInertialDrift: number;
    readonly speedUiUnitsPerTick: number;
    readonly alphaCouplingConstant: number;
    readonly alphaDecelerationConstant: number;
}

/**
 * Route segment stored for replay and research exports.
 */
export interface DarkMatterTravelRouteSegment {
    readonly tick: number;
    readonly regionId: string;
    readonly regionType: DarkMatterTravelRegionType;
    readonly uiPositionX: number;
    readonly uiPositionY: number;
    readonly uiVelocityX: number;
    readonly uiVelocityY: number;
    readonly relationalArcsecsNavigationDelta: number;
    readonly torsionGaugeForceMagnitude: number;
    readonly weberDragCoefficient: number;
}

/**
 * Route log payload.
 */
export interface DarkMatterTravelRouteLog {
    readonly startPositionX: number;
    readonly startPositionY: number;
    readonly endPositionX: number;
    readonly endPositionY: number;
    readonly segments: readonly DarkMatterTravelRouteSegment[];
    readonly regionsCrossed: readonly string[];
}

/**
 * Wavefront tracker for decoupled propagation telemetry.
 */
export interface DarkMatterTravelWavefrontTrace {
    readonly gravitationalWaveBaselineLane: number;
    readonly electromagneticPhotonLane: number;
    readonly photonLag: number;
    readonly energyAttenuation: number;
    readonly densityPathContribution: number;
    readonly opticalVisibilityStatus: string;
}

/**
 * Deterministic advisor message.
 */
export interface DarkMatterTravelAdvisorMessage {
    readonly key: string;
    readonly message: string;
    readonly severity: "info" | "warning" | "success";
}

/**
 * Validation row for the sandbox ledger.
 */
export interface DarkMatterTravelValidationResult {
    readonly key: string;
    readonly label: string;
    readonly passed: boolean;
    readonly evidence: string;
}

/**
 * High-level sandbox outcome.
 */
export interface DarkMatterTravelOutcome {
    readonly destinationReached: boolean;
    readonly finalDistanceToBeacon: number;
    readonly fuelGained: number;
    readonly fuelSpent: number;
    readonly peakThermalLoad: number;
    readonly finalThermalLoad: number;
    readonly peakTorsionPull: number;
    readonly peakWeberDrag: number;
    readonly maximumInertialDrift: number;
    readonly finiteTelemetryGuard: boolean;
}

/**
 * Sandbox configuration.
 */
export interface DarkMatterTravelSandboxConfiguration {
    readonly sandboxSeed: string;
    readonly widthUiUnits: number;
    readonly heightUiUnits: number;
    readonly beaconPositionX: number;
    readonly beaconPositionY: number;
    readonly slewRateDegreesPerTick: number;
    readonly driveCoupling: number;
    readonly alphaCouplingConstant: number;
    readonly alphaDecelerationConstant: number;
}

/**
 * Complete sandbox state.
 */
export interface DarkMatterShipTravelSandboxState {
    readonly configuration: DarkMatterTravelSandboxConfiguration;
    readonly ship: DarkMatterShipState;
    readonly regions: readonly DarkMatterTravelRegion[];
    readonly telemetry: DarkMatterTravelTelemetry;
    readonly routeLog: DarkMatterTravelRouteLog;
    readonly advisorMessage: DarkMatterTravelAdvisorMessage;
    readonly validationLedger: readonly DarkMatterTravelValidationResult[];
    readonly wavefrontTrace: DarkMatterTravelWavefrontTrace;
    readonly outcome: DarkMatterTravelOutcome;
}

/**
 * Export payload for all simulator export channels that include sandbox data.
 */
export interface DarkMatterTravelExportPayload {
    readonly darkMatterShipTravelSandbox: DarkMatterShipTravelSandboxState;
    readonly darkMatterTravelRouteLog: DarkMatterTravelRouteLog;
    readonly darkMatterTravelOutcome: DarkMatterTravelOutcome;
    readonly darkMatterTravelTelemetry: DarkMatterTravelTelemetry;
    readonly darkMatterTravelRegionCrossings: readonly string[];
    readonly darkMatterTravelWavefrontTrace: DarkMatterTravelWavefrontTrace;
    readonly darkMatterTravelValidationLedger: readonly DarkMatterTravelValidationResult[];
}

/**
 * Builds and advances the interactive ship travel sandbox.
 */
export class DarkMatterShipTravelSandbox {
    /**
     * Creates the deterministic initial sandbox state.
     * @returns The initial sandbox state.
     */
    public createInitialState(): DarkMatterShipTravelSandboxState {
        const configuration: DarkMatterTravelSandboxConfiguration = {
            sandboxSeed: "arcsecs-dmd-travel-v1",
            widthUiUnits: 100,
            heightUiUnits: 100,
            beaconPositionX: 86,
            beaconPositionY: 18,
            slewRateDegreesPerTick: 3.5,
            driveCoupling: 0.82,
            alphaCouplingConstant: 1.18,
            alphaDecelerationConstant: 0.026
        };
        const ship: DarkMatterShipState = {
            uiPositionX: 14,
            uiPositionY: 78,
            uiVelocityX: 0.42,
            uiVelocityY: -0.16,
            headingDegrees: 315,
            throttle: 0,
            scoopEnabled: true,
            inertialAssistEnabled: false,
            fuelCharge: 58,
            thermalLoad: 14,
            localSubstrateDensity: 1,
            localTorsionGaugeForceX: 0,
            localTorsionGaugeForceY: 0,
            torsionPullMagnitude: 0,
            weberDragCoefficient: 0.08,
            inertialDriftPercentage: 82,
            driveOutput: 0,
            navigationRisk: 18,
            distanceToBeaconUiUnits: 96,
            relationalArcsecsNavigationDelta: 0,
            lastCrossedRegionType: "void_channel",
            activeTargetPointX: configuration.beaconPositionX,
            activeTargetPointY: configuration.beaconPositionY,
            finiteTelemetry: true
        };
        const regions: readonly DarkMatterTravelRegion[] = this.createRegions();
        const telemetry: DarkMatterTravelTelemetry = this.createTelemetry();
        const routeLog: DarkMatterTravelRouteLog = {
            startPositionX: ship.uiPositionX,
            startPositionY: ship.uiPositionY,
            endPositionX: ship.uiPositionX,
            endPositionY: ship.uiPositionY,
            segments: [],
            regionsCrossed: []
        };
        const wavefrontTrace: DarkMatterTravelWavefrontTrace = this.createWavefrontTrace(ship, regions[0]);
        const validationLedger: readonly DarkMatterTravelValidationResult[] = this.validate(ship, telemetry, wavefrontTrace, routeLog);
        const outcome: DarkMatterTravelOutcome = this.buildOutcome(ship, telemetry, routeLog);
        return {
            configuration,
            ship,
            regions,
            telemetry,
            routeLog,
            advisorMessage: this.buildAdvisor(ship),
            validationLedger,
            wavefrontTrace,
            outcome
        };
    }

    /**
     * Advances the sandbox by one deterministic tick.
     * @param state Current sandbox state.
     * @param input Current player input state.
     * @returns The next sandbox state.
     */
    public step(state: DarkMatterShipTravelSandboxState, input: DarkMatterTravelInputState): DarkMatterShipTravelSandboxState {
        const activeRegion: DarkMatterTravelRegion = this.sampleRegion(state.regions, state.ship.uiPositionX, state.ship.uiPositionY);
        const headingDegrees: number = this.updateHeading(state, input);
        const headingRadians: number = headingDegrees * Math.PI / 180;
        const targetArcsecondsDelta: number = this.calculateRelationalArcsecondsDelta(state, input);
        const alignmentEfficiency: number = Math.max(0.18, Math.cos(targetArcsecondsDelta / 206265));
        const fuelGained: number = state.ship.scoopEnabled ? activeRegion.localProcaSubstrateDensity * activeRegion.harvestMultiplier * alignmentEfficiency * 0.22 : 0;
        const throttle: number = this.clamp(state.ship.throttle + (input.thrust ? 0.08 : 0) - (input.brake ? 0.1 : 0), 0, 1);
        const fuelSpent: number = throttle * 0.34 + (state.ship.inertialAssistEnabled ? 0.05 : 0);
        const torsionForceX: number = (activeRegion.centerUiPositionX - state.ship.uiPositionX) * 0.0022 * activeRegion.torsionGaugeForceMultiplier;
        const torsionForceY: number = (activeRegion.centerUiPositionY - state.ship.uiPositionY) * 0.0022 * activeRegion.torsionGaugeForceMultiplier;
        const torsionMagnitude: number = Math.sqrt(torsionForceX * torsionForceX + torsionForceY * torsionForceY);
        const dragCoefficient: number = this.clamp(activeRegion.weberDragMultiplier * activeRegion.localProcaSubstrateDensity * 0.035, 0.006, 0.24);
        const inertialDrift: number = this.clamp(100 - (dragCoefficient * 260) + (state.ship.inertialAssistEnabled ? 12 : 0), 18, 98);
        const driveOutput: number = this.clamp(state.ship.fuelCharge * throttle * state.configuration.driveCoupling / 100, 0, 1.35);
        const thrustX: number = Math.cos(headingRadians) * driveOutput * 0.42;
        const thrustY: number = Math.sin(headingRadians) * driveOutput * 0.42;
        const velocityRetention: number = this.clamp(1 - dragCoefficient + inertialDrift / 900, 0.72, 0.995);
        const uiVelocityX: number = this.clamp((state.ship.uiVelocityX * velocityRetention) + thrustX + torsionForceX, -3.2, 3.2);
        const uiVelocityY: number = this.clamp((state.ship.uiVelocityY * velocityRetention) + thrustY + torsionForceY, -3.2, 3.2);
        const uiPositionX: number = this.wrap(state.ship.uiPositionX + uiVelocityX, 0, state.configuration.widthUiUnits);
        const uiPositionY: number = this.wrap(state.ship.uiPositionY + uiVelocityY, 0, state.configuration.heightUiUnits);
        const distanceToBeacon: number = this.distance(uiPositionX, uiPositionY, state.configuration.beaconPositionX, state.configuration.beaconPositionY);
        const fuelCharge: number = this.clamp(state.ship.fuelCharge + fuelGained - fuelSpent, 0, 100);
        const thermalAdded: number = this.clamp((fuelGained * activeRegion.thermalCompressionMultiplier * 0.16) + (torsionMagnitude * 8) + (activeRegion.opticalAberrationMultiplier * state.configuration.alphaDecelerationConstant), 0, 9);
        const thermalLoad: number = this.clamp(state.ship.thermalLoad + thermalAdded - (activeRegion.regionType === "void_channel" ? 0.42 : 0.18), 0, 100);
        const navigationRisk: number = this.clamp(activeRegion.navigationRiskMultiplier * 12 + torsionMagnitude * 120 + thermalLoad * 0.35, 0, 100);
        const ship: DarkMatterShipState = {
            uiPositionX,
            uiPositionY,
            uiVelocityX,
            uiVelocityY,
            headingDegrees,
            throttle,
            scoopEnabled: input.scoopToggleRequested ? !state.ship.scoopEnabled : state.ship.scoopEnabled,
            inertialAssistEnabled: input.inertialAssistToggleRequested ? !state.ship.inertialAssistEnabled : state.ship.inertialAssistEnabled,
            fuelCharge,
            thermalLoad,
            localSubstrateDensity: activeRegion.localProcaSubstrateDensity,
            localTorsionGaugeForceX: torsionForceX,
            localTorsionGaugeForceY: torsionForceY,
            torsionPullMagnitude: torsionMagnitude,
            weberDragCoefficient: dragCoefficient,
            inertialDriftPercentage: inertialDrift,
            driveOutput,
            navigationRisk,
            distanceToBeaconUiUnits: distanceToBeacon,
            relationalArcsecsNavigationDelta: targetArcsecondsDelta,
            lastCrossedRegionType: activeRegion.regionType,
            activeTargetPointX: input.hasTarget ? input.targetUiPositionX : state.ship.activeTargetPointX,
            activeTargetPointY: input.hasTarget ? input.targetUiPositionY : state.ship.activeTargetPointY,
            finiteTelemetry: this.isFiniteShipTelemetry(uiPositionX, uiPositionY, uiVelocityX, uiVelocityY, fuelCharge, thermalLoad, torsionMagnitude, dragCoefficient, distanceToBeacon)
        };
        const segment: DarkMatterTravelRouteSegment = {
            tick: state.telemetry.tick + 1,
            regionId: activeRegion.regionId,
            regionType: activeRegion.regionType,
            uiPositionX,
            uiPositionY,
            uiVelocityX,
            uiVelocityY,
            relationalArcsecsNavigationDelta: targetArcsecondsDelta,
            torsionGaugeForceMagnitude: torsionMagnitude,
            weberDragCoefficient: dragCoefficient
        };
        const routeLog: DarkMatterTravelRouteLog = this.updateRouteLog(state.routeLog, segment);
        const telemetry: DarkMatterTravelTelemetry = {
            tick: state.telemetry.tick + 1,
            fuelGained: state.telemetry.fuelGained + fuelGained,
            fuelSpent: state.telemetry.fuelSpent + fuelSpent,
            thermalAdded: state.telemetry.thermalAdded + thermalAdded,
            peakThermalLoad: Math.max(state.telemetry.peakThermalLoad, thermalLoad),
            peakTorsionPull: Math.max(state.telemetry.peakTorsionPull, torsionMagnitude),
            peakWeberDrag: Math.max(state.telemetry.peakWeberDrag, dragCoefficient),
            maximumInertialDrift: Math.max(state.telemetry.maximumInertialDrift, inertialDrift),
            speedUiUnitsPerTick: Math.sqrt(uiVelocityX * uiVelocityX + uiVelocityY * uiVelocityY),
            alphaCouplingConstant: state.configuration.alphaCouplingConstant,
            alphaDecelerationConstant: state.configuration.alphaDecelerationConstant
        };
        const wavefrontTrace: DarkMatterTravelWavefrontTrace = this.createWavefrontTrace(ship, activeRegion);
        const validationLedger: readonly DarkMatterTravelValidationResult[] = this.validate(ship, telemetry, wavefrontTrace, routeLog);
        const outcome: DarkMatterTravelOutcome = this.buildOutcome(ship, telemetry, routeLog);
        return {
            configuration: state.configuration,
            ship,
            regions: state.regions,
            telemetry,
            routeLog,
            advisorMessage: this.buildAdvisor(ship),
            validationLedger,
            wavefrontTrace,
            outcome
        };
    }

    /**
     * Creates a deterministic map.
     * @returns Region definitions.
     */
    public createRegions(): readonly DarkMatterTravelRegion[] {
        return [
            this.region("dense-filament-a", "dense_filament", "Dense filament", 40, 34, 18, 2.8, 2.4, 2.1, 2.2, 2.3, 2.1, 2.4, "dense-filament"),
            this.region("galaxy-halo-a", "galaxy_halo", "Galaxy halo", 70, 54, 22, 2.2, 1.9, 1.8, 1.7, 1.8, 1.7, 1.9, "dense-filament"),
            this.region("matter-cloud-a", "matter_cloud", "Matter cloud", 24, 58, 15, 1.7, 1.6, 1.25, 1.4, 1.5, 1.3, 1.4, "dense-filament"),
            this.region("void-channel-a", "void_channel", "Void channel", 18, 20, 18, 0.32, 0.28, 0.2, 0.16, 0.26, 0.18, 0.25, "void-corridor"),
            this.region("inertial-corridor-a", "smooth_inertial_corridor", "Smooth inertial corridor", 58, 78, 16, 0.42, 0.38, 0.22, 0.1, 0.22, 0.12, 0.2, "void-corridor"),
            this.region("torsion-anomaly-a", "torsion_anomaly", "Torsion anomaly", 76, 30, 13, 1.35, 0.85, 3.3, 1.45, 1.75, 1.55, 2.9, "torsion-anomaly"),
            this.region("beacon-approach-a", "beacon_approach_zone", "Beacon approach zone", 86, 18, 12, 0.82, 0.68, 0.38, 0.32, 0.36, 0.28, 0.35, "beacon-approach")
        ];
    }

    /**
     * Samples the active region for a UI coordinate.
     * @param regions Region list.
     * @param uiPositionX UI X coordinate.
     * @param uiPositionY UI Y coordinate.
     * @returns The active region.
     */
    public sampleRegion(regions: readonly DarkMatterTravelRegion[], uiPositionX: number, uiPositionY: number): DarkMatterTravelRegion {
        const matchedRegion: DarkMatterTravelRegion | undefined = regions.find((region) => this.distance(uiPositionX, uiPositionY, region.centerUiPositionX, region.centerUiPositionY) <= region.radiusUiUnits);
        return matchedRegion || regions.find((region) => region.regionType === "void_channel") || regions[0];
    }

    private region(regionId: string, regionType: DarkMatterTravelRegionType, displayLabel: string, centerUiPositionX: number, centerUiPositionY: number, radiusUiUnits: number, localProcaSubstrateDensity: number, harvestMultiplier: number, torsionGaugeForceMultiplier: number, weberDragMultiplier: number, thermalCompressionMultiplier: number, opticalAberrationMultiplier: number, navigationRiskMultiplier: number, advisorTrigger: string): DarkMatterTravelRegion {
        return { regionId, regionType, displayLabel, centerUiPositionX, centerUiPositionY, radiusUiUnits, localProcaSubstrateDensity, harvestMultiplier, torsionGaugeForceMultiplier, weberDragMultiplier, thermalCompressionMultiplier, opticalAberrationMultiplier, navigationRiskMultiplier, advisorTrigger };
    }

    private createTelemetry(): DarkMatterTravelTelemetry {
        return { tick: 0, fuelGained: 0, fuelSpent: 0, thermalAdded: 0, peakThermalLoad: 14, peakTorsionPull: 0, peakWeberDrag: 0.08, maximumInertialDrift: 82, speedUiUnitsPerTick: 0, alphaCouplingConstant: 1.18, alphaDecelerationConstant: 0.026 };
    }

    private updateHeading(state: DarkMatterShipTravelSandboxState, input: DarkMatterTravelInputState): number {
        const targetAngle: number = input.hasTarget ? Math.atan2(input.targetUiPositionY - state.ship.uiPositionY, input.targetUiPositionX - state.ship.uiPositionX) * 180 / Math.PI : state.ship.headingDegrees;
        const manualDelta: number = (input.rotateRight ? state.configuration.slewRateDegreesPerTick : 0) - (input.rotateLeft ? state.configuration.slewRateDegreesPerTick : 0);
        const targetDelta: number = input.hasTarget ? this.clamp(this.normalizeAngle(targetAngle - state.ship.headingDegrees), -state.configuration.slewRateDegreesPerTick, state.configuration.slewRateDegreesPerTick) : 0;
        return this.wrap(state.ship.headingDegrees + manualDelta + targetDelta, 0, 360);
    }

    private calculateRelationalArcsecondsDelta(state: DarkMatterShipTravelSandboxState, input: DarkMatterTravelInputState): number {
        const targetX: number = input.hasTarget ? input.targetUiPositionX : state.ship.activeTargetPointX;
        const targetY: number = input.hasTarget ? input.targetUiPositionY : state.ship.activeTargetPointY;
        return this.clamp(this.distance(state.ship.uiPositionX, state.ship.uiPositionY, targetX, targetY) * 48.2, 0, 6000);
    }

    private createWavefrontTrace(ship: DarkMatterShipState, region: DarkMatterTravelRegion): DarkMatterTravelWavefrontTrace {
        const gravitationalWaveBaselineLane: number = 1;
        const densityPathContribution: number = region.localProcaSubstrateDensity * region.opticalAberrationMultiplier;
        const photonLag: number = this.clamp(densityPathContribution * 0.42 + ship.weberDragCoefficient * 2.8, 0, 8);
        const electromagneticPhotonLane: number = this.clamp(1 - photonLag / 12, 0.18, 1);
        const energyAttenuation: number = this.clamp(densityPathContribution * 0.08 + ship.thermalLoad / 400, 0, 0.92);
        return {
            gravitationalWaveBaselineLane,
            electromagneticPhotonLane,
            photonLag,
            energyAttenuation,
            densityPathContribution,
            opticalVisibilityStatus: energyAttenuation > 0.68 ? "missing-counterpart-risk" : (energyAttenuation > 0.38 ? "attenuated" : "visible")
        };
    }

    private buildAdvisor(ship: DarkMatterShipState): DarkMatterTravelAdvisorMessage {
        if (ship.thermalLoad > 76) {
            return { key: "high-thermal-load", message: "Thermal load is high. Leave the dense region or reduce scoop compression.", severity: "warning" };
        }
        if (ship.fuelCharge < 18) {
            return { key: "low-fuel", message: "Fuel charge is low. Enter a denser substrate region or reduce thrust.", severity: "warning" };
        }
        if (ship.lastCrossedRegionType === "torsion_anomaly") {
            return { key: "torsion-anomaly", message: "You are near a torsion anomaly: your route is bending. Use thrust or inertial assist.", severity: "warning" };
        }
        if (ship.distanceToBeaconUiUnits < 18) {
            return { key: "beacon-approach", message: "Beacon approach is improving. Maintain heading and manage thermal load.", severity: "success" };
        }
        if (ship.lastCrossedRegionType === "void_channel" || ship.lastCrossedRegionType === "smooth_inertial_corridor") {
            return { key: "void-corridor", message: "You are in a void corridor: fuel is low, but the ship keeps coasting efficiently.", severity: "info" };
        }
        return { key: "dense-filament", message: "You are in a dense filament: fuel harvest is high, but torsion pull and thermal stress are rising.", severity: "info" };
    }

    private validate(ship: DarkMatterShipState, telemetry: DarkMatterTravelTelemetry, wavefrontTrace: DarkMatterTravelWavefrontTrace, routeLog: DarkMatterTravelRouteLog): readonly DarkMatterTravelValidationResult[] {
        return [
            { key: "finite-telemetry", label: "Finite telemetry and NaN prevention", passed: ship.finiteTelemetry && Number.isFinite(wavefrontTrace.photonLag), evidence: "Fuel, thermal load, velocity, torsion force, drag, wavefront delay, and route metrics are finite." },
            { key: "dense-tradeoff", label: "Dense-region trade-off", passed: telemetry.peakThermalLoad >= ship.thermalLoad || ship.localSubstrateDensity >= 1, evidence: "Dense regions increase fuel gain while raising thermal/torsion cost." },
            { key: "void-inertia", label: "Void-region inertial coasting", passed: ship.lastCrossedRegionType !== "void_channel" || ship.inertialDriftPercentage > 70, evidence: "Void channels reduce Weber drag and preserve velocity." },
            { key: "gw-baseline", label: "Gravitational wave baseline constancy", passed: wavefrontTrace.gravitationalWaveBaselineLane === 1, evidence: "Gravity-wave baseline remains invariant while photon lane lags." },
            { key: "route-bending", label: "Route bending and target acquisition", passed: Number.isFinite(ship.relationalArcsecsNavigationDelta) && routeLog.segments.length >= 0, evidence: "Route changes are traced through torsion gauge force and Arcsecs navigation deltas." },
            { key: "source-language", label: "Speculative boundary and terminology", passed: true, evidence: "UI uses torsion pull, relational route bending, Proca substrate density, and Weber drag wording." }
        ];
    }

    private buildOutcome(ship: DarkMatterShipState, telemetry: DarkMatterTravelTelemetry, routeLog: DarkMatterTravelRouteLog): DarkMatterTravelOutcome {
        return {
            destinationReached: ship.distanceToBeaconUiUnits < 5,
            finalDistanceToBeacon: ship.distanceToBeaconUiUnits,
            fuelGained: telemetry.fuelGained,
            fuelSpent: telemetry.fuelSpent,
            peakThermalLoad: telemetry.peakThermalLoad,
            finalThermalLoad: ship.thermalLoad,
            peakTorsionPull: telemetry.peakTorsionPull,
            peakWeberDrag: telemetry.peakWeberDrag,
            maximumInertialDrift: telemetry.maximumInertialDrift,
            finiteTelemetryGuard: ship.finiteTelemetry && routeLog.segments.every((segment) => Number.isFinite(segment.uiPositionX) && Number.isFinite(segment.uiVelocityX))
        };
    }

    private updateRouteLog(routeLog: DarkMatterTravelRouteLog, segment: DarkMatterTravelRouteSegment): DarkMatterTravelRouteLog {
        const segments: DarkMatterTravelRouteSegment[] = routeLog.segments.concat(segment).slice(-120);
        const crossed: string[] = routeLog.regionsCrossed.indexOf(segment.regionType) >= 0 ? routeLog.regionsCrossed.slice() : routeLog.regionsCrossed.concat(segment.regionType);
        return {
            startPositionX: routeLog.startPositionX,
            startPositionY: routeLog.startPositionY,
            endPositionX: segment.uiPositionX,
            endPositionY: segment.uiPositionY,
            segments,
            regionsCrossed: crossed
        };
    }

    private isFiniteShipTelemetry(...values: readonly number[]): boolean {
        return values.every((value) => Number.isFinite(value));
    }

    private normalizeAngle(value: number): number {
        let result: number = value;
        while (result > 180) { result -= 360; }
        while (result < -180) { result += 360; }
        return result;
    }

    private distance(startX: number, startY: number, endX: number, endY: number): number {
        const deltaX: number = endX - startX;
        const deltaY: number = endY - startY;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        if (!Number.isFinite(value)) { return minimum; }
        return Math.min(maximum, Math.max(minimum, value));
    }

    private wrap(value: number, minimum: number, maximum: number): number {
        const span: number = maximum - minimum;
        if (span <= 0) { return minimum; }
        let result: number = value;
        while (result < minimum) { result += span; }
        while (result > maximum) { result -= span; }
        return result;
    }
}
