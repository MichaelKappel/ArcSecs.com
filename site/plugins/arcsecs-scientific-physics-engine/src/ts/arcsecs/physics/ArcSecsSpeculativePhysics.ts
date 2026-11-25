export interface OscillatorDampingResult {
    readonly globalTickCount: number;
    readonly globalSimulationSeconds: number;
    readonly deepSpaceTransitions: number;
    readonly nearMassTransitions: number;
    readonly localGravitationalGradient: number;
    readonly dampingCoefficient: number;
}

export interface LensingResult {
    readonly impactParameter: number;
    readonly centralMass: number;
    readonly photonMass: number;
    readonly velocity: number;
    readonly soldnerDeflectionArcseconds: number;
    readonly standardGeneralRelativityArcseconds: number;
    readonly arcsecsProxyArcseconds: number;
}

export interface DarkStarResult {
    readonly escapeVelocity: number;
    readonly photonVelocity: number;
    readonly apogeeRadius: number;
    readonly captured: boolean;
}

export interface GalileanVelocityResult {
    readonly bodyAVelocity: number;
    readonly bodyBVelocity: number;
    readonly relativeVelocity: number;
    readonly lorentzFactorApplied: boolean;
}

export interface EnergyLedgerResult {
    readonly initialEnergy: number;
    readonly currentEnergy: number;
    readonly energyLost: number;
    readonly substrateLedgerEnergy: number;
    readonly ledgerClosureError: number;
    readonly redshift: number;
}

export interface CondensateResult {
    readonly haloDensity: number;
    readonly accumulatedCondensateEnergy: number;
    readonly ledgerCoupling: number;
}

export interface RamjetPipelineResult {
    readonly intakeRate: number;
    readonly dragLoad: number;
    readonly shieldAblation: number;
    readonly solenoidStatus: string;
    readonly bufferFill: number;
    readonly bufferCoherence: number;
    readonly reactorOutput: number;
    readonly wasteHeat: number;
    readonly radiatorCapacity: number;
    readonly exhaustCollimation: number;
    readonly thrust: number;
    readonly netAcceleration: number;
    readonly ledgerClosure: number;
    readonly flightReadinessScore: number;
}

/** Deterministic mathematical sandbox for ArcSecs speculative scenario diagnostics. */
export class ArcSecsSpeculativePhysics {
    /**
     * Computes local oscillator retardation while preserving one global clock.
     * @param globalTickCount Global fixed-step ticks.
     * @param fixedStepSeconds Fixed-step duration.
     * @param massProxy Nearby source mass proxy.
     * @param distanceProxy Distance from the source.
     */
    public oscillatorDamping(globalTickCount: number, fixedStepSeconds: number, massProxy: number, distanceProxy: number): OscillatorDampingResult {
        const gradient: number = massProxy / Math.pow(Math.max(0.001, distanceProxy), 2);
        const dampingCoefficient: number = this.clamp(gradient * 0.012, 0, 0.36);
        const globalSimulationSeconds: number = globalTickCount * fixedStepSeconds;
        return {
            globalTickCount,
            globalSimulationSeconds,
            deepSpaceTransitions: globalTickCount,
            nearMassTransitions: Math.floor(globalTickCount * (1 - dampingCoefficient)),
            localGravitationalGradient: gradient,
            dampingCoefficient
        };
    }

    /**
     * Computes a massive-photon flat-space lensing comparison.
     * @param centralMass Central mass proxy.
     * @param impactParameter Closest approach proxy.
     * @param photonMass Effective non-zero photon mass proxy.
     * @param velocity Photon velocity proxy.
     */
    public lensing(centralMass: number, impactParameter: number, photonMass: number, velocity: number): LensingResult {
        const safeImpactParameter: number = Math.max(0.001, impactParameter);
        const safeVelocity: number = Math.max(0.001, velocity);
        const soldnerDeflectionArcseconds: number = (2 * centralMass) / (safeImpactParameter * safeVelocity * safeVelocity);
        const standardGeneralRelativityArcseconds: number = soldnerDeflectionArcseconds * 2;
        const arcsecsProxyArcseconds: number = soldnerDeflectionArcseconds * (1 + this.clamp(photonMass * 1e18, 0, 3));
        return { impactParameter: safeImpactParameter, centralMass, photonMass, velocity: safeVelocity, soldnerDeflectionArcseconds, standardGeneralRelativityArcseconds, arcsecsProxyArcseconds };
    }

    /**
     * Computes a Newtonian dark-star escape/capture condition.
     * @param centralMass Central body mass proxy.
     * @param radius Launch radius proxy.
     * @param photonVelocity Outward photon velocity proxy.
     */
    public darkStar(centralMass: number, radius: number, photonVelocity: number): DarkStarResult {
        const safeRadius: number = Math.max(0.001, radius);
        const escapeVelocity: number = Math.sqrt((2 * centralMass) / safeRadius);
        const captured: boolean = photonVelocity < escapeVelocity;
        const apogeeRadius: number = captured ? safeRadius / Math.max(0.001, 1 - Math.pow(photonVelocity / escapeVelocity, 2)) : safeRadius * 1000000;
        return { escapeVelocity, photonVelocity, apogeeRadius, captured };
    }

    /**
     * Computes Galilean relative velocity without Lorentz limiting.
     * @param bodyAVelocity Body A velocity along an axis.
     * @param bodyBVelocity Body B velocity along the opposite axis.
     */
    public galileanRelativeVelocity(bodyAVelocity: number, bodyBVelocity: number): GalileanVelocityResult {
        return { bodyAVelocity, bodyBVelocity, relativeVelocity: Math.abs(bodyAVelocity - bodyBVelocity), lorentzFactorApplied: false };
    }

    /**
     * Computes tired-light energy loss and ledger closure.
     * @param initialEnergy Initial photon energy proxy.
     * @param distance Travel distance proxy.
     * @param attenuationCoefficient Exponential attenuation coefficient.
     */
    public tiredLightLedger(initialEnergy: number, distance: number, attenuationCoefficient: number): EnergyLedgerResult {
        const currentEnergy: number = initialEnergy * Math.exp(-Math.max(0, attenuationCoefficient) * Math.max(0, distance));
        const energyLost: number = initialEnergy - currentEnergy;
        const substrateLedgerEnergy: number = energyLost;
        const ledgerClosureError: number = Math.abs(initialEnergy - currentEnergy - substrateLedgerEnergy);
        const redshift: number = initialEnergy / Math.max(0.000001, currentEnergy) - 1;
        return { initialEnergy, currentEnergy, energyLost, substrateLedgerEnergy, ledgerClosureError, redshift };
    }

    /**
     * Computes a dark-light condensate halo proxy tied to ledger energy.
     * @param ledgerEnergy Energy gathered from tired-light loss.
     * @param radius Halo radius proxy.
     */
    public condensate(ledgerEnergy: number, radius: number): CondensateResult {
        const volumeProxy: number = (4 / 3) * Math.PI * Math.pow(Math.max(0.001, radius), 3);
        const haloDensity: number = ledgerEnergy / volumeProxy;
        return { haloDensity, accumulatedCondensateEnergy: ledgerEnergy, ledgerCoupling: this.clamp(haloDensity * 100, 0, 1) };
    }

    /**
     * Computes a deterministic ramjet pipeline state.
     * @param substrateDensity Available incoming dark-light substrate density proxy.
     * @param scoopArea Scoop cross-section proxy.
     * @param reactorEfficiency Reactor conversion efficiency.
     * @param radiatorCapacity Thermal rejection capacity.
     * @param exhaustCollimation Exhaust focus efficiency.
     */
    public ramjetPipeline(substrateDensity: number, scoopArea: number, reactorEfficiency: number, radiatorCapacity: number, exhaustCollimation: number): RamjetPipelineResult {
        const intakeRate: number = Math.max(0, substrateDensity) * Math.max(0, scoopArea);
        const dragLoad: number = intakeRate * 0.18;
        const shieldAblation: number = dragLoad * 0.04;
        const bufferFill: number = this.clamp(intakeRate / 100, 0, 1);
        const bufferCoherence: number = this.clamp(1 - bufferFill * 0.18, 0, 1);
        const reactorOutput: number = intakeRate * this.clamp(reactorEfficiency, 0, 1) * bufferCoherence;
        const wasteHeat: number = Math.max(0, intakeRate - reactorOutput);
        const thermalMargin: number = Math.max(0.001, radiatorCapacity) / Math.max(0.001, wasteHeat);
        const thrust: number = reactorOutput * this.clamp(exhaustCollimation, 0, 1) * this.clamp(thermalMargin, 0, 1);
        const netAcceleration: number = thrust - dragLoad;
        const ledgerClosure: number = this.clamp(1 - Math.abs(intakeRate - reactorOutput - wasteHeat) / Math.max(1, intakeRate), 0, 1);
        const flightReadinessScore: number = this.clamp((bufferCoherence + ledgerClosure + this.clamp(thermalMargin, 0, 1) + this.clamp(exhaustCollimation, 0, 1)) / 4, 0, 1);
        return { intakeRate, dragLoad, shieldAblation, solenoidStatus: dragLoad > 24 ? "stressed" : "nominal", bufferFill, bufferCoherence, reactorOutput, wasteHeat, radiatorCapacity, exhaustCollimation, thrust, netAcceleration, ledgerClosure, flightReadinessScore };
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
