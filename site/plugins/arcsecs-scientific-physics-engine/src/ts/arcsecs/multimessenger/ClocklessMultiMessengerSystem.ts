import { RelationalDistanceCalculator } from "../distance/RelationalDistanceCalculator";
import type { UniversalRelationalEpochSnapshot } from "../chronology/UniversalRelationalEpochModel";

export interface GravityWavefront {
    readonly sourceEventName: string;
    readonly distanceParsecs: number;
    readonly baselineTransit: number;
    readonly arrivalIndex: number;
    readonly strainProxy: number;
    readonly notes: readonly string[];
}

export interface PhotonWavefront {
    readonly sourceEventName: string;
    readonly distanceParsecs: number;
    readonly mediumDensityMultiplier: number;
    readonly velocityFactor: number;
    readonly energyRemaining: number;
    readonly arrivalDelay: number;
    readonly redshiftProxy: number;
    readonly attenuationNotes: readonly string[];
}

export interface MultiMessengerEvent {
    readonly eventName: string;
    readonly eventType: string;
    readonly distanceLabel: string;
    readonly distanceParsecs: number;
    readonly observedDelayLabel: string;
    readonly gravityArrival: number;
    readonly photonArrival: number | null;
    readonly propagationDelayEstimate: number;
    readonly sourceDelayEstimate: number;
    readonly environmentDelayEstimate: number;
    readonly visibilityStatus: string;
    readonly interpretationNotes: readonly string[];
    readonly speculativeBoundary: string;
}

export interface SubstrateDensitySample {
    readonly distanceMegaparsecs: number;
    readonly densityMultiplier: number;
}

export interface ClocklessMultiMessengerObservationInput {
    readonly sourceLabel: string;
    readonly distanceMegaparsecs: number;
    readonly sourceDelaySeconds: number;
    readonly observedDelaySeconds: number;
    readonly attenuationCoefficientPerMegaparsec: number;
    readonly energyDegenerationCoefficientPerMegaparsec: number;
    readonly substrateDensitySamples: ReadonlyArray<SubstrateDensitySample>;
    readonly epochSnapshot: UniversalRelationalEpochSnapshot;
}

export interface ClocklessMultiMessengerObservationResult {
    readonly sourceLabel: string;
    readonly epochIndex: number;
    readonly gravitationalTransitSeconds: number;
    readonly photonTransitSeconds: number;
    readonly propagationLagSeconds: number;
    readonly densityCorrectedPropagationLagSeconds: number;
    readonly intrinsicDelaySeconds: number;
    readonly modeledTotalDelaySeconds: number;
    readonly energyFractionRemaining: number;
    readonly redshiftProxy: number;
    readonly arrivalSequence: string;
}

/** Compares gravity-wave event order against slowed electromagnetic arrival without treating local clocks or lightyears as foundational. */
export class ClocklessMultiMessengerSystem {
    private readonly distanceCalculator: RelationalDistanceCalculator;
    private readonly baselineMessengerSpeedMetersPerSecond: number;

    /**
     * Creates a multi-messenger evaluator.
     * @param distanceCalculator Relational distance calculator used for megaparsec-to-meter conversion constants.
     * @param baselineMessengerSpeedMetersPerSecond Gravity-wave baseline speed proxy for event-order comparisons.
     */
    public constructor(distanceCalculator: RelationalDistanceCalculator = new RelationalDistanceCalculator(), baselineMessengerSpeedMetersPerSecond: number = 299792458) {
        this.distanceCalculator = distanceCalculator;
        this.baselineMessengerSpeedMetersPerSecond = Math.max(1, baselineMessengerSpeedMetersPerSecond);
    }

    /**
     * Evaluates a multi-messenger event using gravitational arrival as the event-order baseline and light as the path-dependent messenger.
     * @param input Observation data, substrate profile, and current Universal Relational Epoch snapshot.
     */
    public evaluateObservation(input: ClocklessMultiMessengerObservationInput): ClocklessMultiMessengerObservationResult {
        const safeDistanceMegaparsecs: number = Math.max(0, this.finite(input.distanceMegaparsecs));
        const distanceMeters: number = safeDistanceMegaparsecs * RelationalDistanceCalculator.metersPerMegaparsec;
        const gravitationalTransitSeconds: number = distanceMeters / this.baselineMessengerSpeedMetersPerSecond;
        const meanDensityMultiplier: number = this.calculateMeanDensityMultiplier(input.substrateDensitySamples);
        const attenuationCoefficient: number = Math.max(0, this.finite(input.attenuationCoefficientPerMegaparsec)) * meanDensityMultiplier;
        const energyDegenerationCoefficient: number = Math.max(0, this.finite(input.energyDegenerationCoefficientPerMegaparsec)) * meanDensityMultiplier;
        const photonTransitSeconds: number = this.calculatePhotonTransitSeconds(safeDistanceMegaparsecs, attenuationCoefficient);
        const propagationLagSeconds: number = Math.max(0, photonTransitSeconds - gravitationalTransitSeconds);
        const densityCorrectedPropagationLagSeconds: number = propagationLagSeconds * meanDensityMultiplier;
        const intrinsicDelaySeconds: number = Math.max(0, this.finite(input.observedDelaySeconds) - densityCorrectedPropagationLagSeconds);
        const modeledTotalDelaySeconds: number = Math.max(0, this.finite(input.sourceDelaySeconds)) + densityCorrectedPropagationLagSeconds;
        const energyFractionRemaining: number = Math.exp(-energyDegenerationCoefficient * safeDistanceMegaparsecs);
        const redshiftProxy: number = (1 / Math.max(0.000000001, energyFractionRemaining)) - 1;
        const arrivalSequence: string = densityCorrectedPropagationLagSeconds > 0
            ? "gravity-wave-baseline -> delayed-electromagnetic-messenger"
            : "gravity-wave-baseline -> electromagnetic-near-synchronous";

        return {
            sourceLabel: input.sourceLabel,
            epochIndex: input.epochSnapshot.epochIndex,
            gravitationalTransitSeconds,
            photonTransitSeconds,
            propagationLagSeconds,
            densityCorrectedPropagationLagSeconds,
            intrinsicDelaySeconds,
            modeledTotalDelaySeconds,
            energyFractionRemaining,
            redshiftProxy,
            arrivalSequence
        };
    }

    /**
     * Calculates a density multiplier from path samples so voids and dense media can affect photon behavior differently.
     * @param samples Line-of-sight substrate density samples.
     */
    public calculateMeanDensityMultiplier(samples: ReadonlyArray<SubstrateDensitySample>): number {
        if (samples.length === 0) {
            return 1;
        }

        let weightedDensity: number = 0;
        let weightedDistance: number = 0;
        for (let index: number = 0; index < samples.length; index += 1) {
            const sample: SubstrateDensitySample = samples[index];
            const distanceWeight: number = Math.max(0.000001, this.finite(sample.distanceMegaparsecs));
            weightedDensity += Math.max(0, this.finite(sample.densityMultiplier)) * distanceWeight;
            weightedDistance += distanceWeight;
        }

        return weightedDistance === 0 ? 1 : Math.max(0.000001, weightedDensity / weightedDistance);
    }

    private calculatePhotonTransitSeconds(distanceMegaparsecs: number, attenuationCoefficientPerMegaparsec: number): number {
        const distanceMeters: number = distanceMegaparsecs * RelationalDistanceCalculator.metersPerMegaparsec;
        const receiverSpeedMetersPerSecond: number = this.baselineMessengerSpeedMetersPerSecond * Math.exp(-attenuationCoefficientPerMegaparsec * distanceMegaparsecs);
        const averageSpeedMetersPerSecond: number = Math.max(1, (this.baselineMessengerSpeedMetersPerSecond + receiverSpeedMetersPerSecond) / 2);
        return distanceMeters / averageSpeedMetersPerSecond;
    }

    private finite(value: number): number {
        return Number.isFinite(value) ? value : 0;
    }
}
