export interface RelationalDistanceEstimate {
    readonly methodName: string;
    readonly distanceParsecs: number;
    readonly confidence: number;
    readonly sourceDescription: string;
    readonly dependsOnLightSpeed: boolean;
    readonly notes: readonly string[];
}

export interface DarkStandardSirenHostCandidate {
    readonly hostName: string;
    readonly distanceMegaparsecs: number;
    readonly associationProbability: number;
}

export interface DarkStandardSirenEstimate {
    readonly weightedDistanceMegaparsecs: number;
    readonly confidence: number;
    readonly candidateCount: number;
    readonly dominantHostName: string;
}

export interface RelationalDistancePacket {
    readonly distanceParsecs: number;
    readonly distanceMegaparsecs: number;
    readonly tangentialVelocityKilometersPerSecond: number;
    readonly methodLabel: string;
}

/** Calculates ArcSecs distance values without making lightyears or electromagnetic light-speed transit foundational. */
export class RelationalDistanceCalculator {
    public static readonly parsecsPerMegaparsec: number = 1000000;
    public static readonly metersPerMegaparsec: number = 3.0856775814913673e22;
    private static readonly tangentialVelocityScale: number = 4.74047;

    /**
     * Calculates parsecs from parallax measured in arcseconds.
     * @param parallaxArcseconds Observed parallax angle in arcseconds.
     */
    public calculateParsecsFromParallax(parallaxArcseconds: number): number {
        const safeParallaxArcseconds: number = Math.max(0.000000001, this.finite(parallaxArcseconds));
        return 1 / safeParallaxArcseconds;
    }

    /**
     * Calculates distance from transverse separation and angular separation.
     * @param transverseSeparation Transverse baseline in the caller's preferred distance unit.
     * @param angleRadians Angular separation in radians.
     */
    public calculateAngularDistance(transverseSeparation: number, angleRadians: number): number {
        const safeAngleRadians: number = Math.max(0.000000000001, Math.abs(this.finite(angleRadians)));
        return Math.abs(this.finite(transverseSeparation)) / safeAngleRadians;
    }

    /**
     * Calculates tangential velocity from proper motion and parsec distance.
     * @param properMotionArcsecondsPerYear Proper motion in arcseconds per year.
     * @param distanceParsecs Distance in parsecs.
     */
    public calculateTangentialVelocityKilometersPerSecond(properMotionArcsecondsPerYear: number, distanceParsecs: number): number {
        const safeProperMotion: number = Math.abs(this.finite(properMotionArcsecondsPerYear));
        const safeDistanceParsecs: number = Math.max(0, this.finite(distanceParsecs));
        return RelationalDistanceCalculator.tangentialVelocityScale * safeProperMotion * safeDistanceParsecs;
    }

    /**
     * Calculates a gravitational-wave standard siren distance from calibrated chirp amplitude and observed strain.
     * @param calibratedChirpAmplitudeMegaparsecs Calibrated chirp amplitude-distance scale in megaparsecs.
     * @param observedStrainAmplitude Observed gravitational-wave strain amplitude.
     */
    public calculateGravitationalWaveStandardSirenDistanceMegaparsecs(calibratedChirpAmplitudeMegaparsecs: number, observedStrainAmplitude: number): number {
        const safeObservedStrainAmplitude: number = Math.max(1e-30, Math.abs(this.finite(observedStrainAmplitude)));
        return Math.max(0, this.finite(calibratedChirpAmplitudeMegaparsecs)) / safeObservedStrainAmplitude;
    }

    /**
     * Builds a weighted dark-standard-siren estimate from candidate host associations.
     * @param hostCandidates Candidate host galaxies or baryonic-node associations from the gravitational-wave localization region.
     */
    public calculateDarkStandardSirenEstimate(hostCandidates: ReadonlyArray<DarkStandardSirenHostCandidate>): DarkStandardSirenEstimate {
        if (hostCandidates.length === 0) {
            return { weightedDistanceMegaparsecs: 0, confidence: 0, candidateCount: 0, dominantHostName: "none" };
        }

        let weightedDistanceMegaparsecs: number = 0;
        let probabilityTotal: number = 0;
        let dominantHostName: string = hostCandidates[0].hostName;
        let dominantProbability: number = -1;

        for (let index: number = 0; index < hostCandidates.length; index += 1) {
            const candidate: DarkStandardSirenHostCandidate = hostCandidates[index];
            const probability: number = this.clamp(candidate.associationProbability, 0, 1);
            weightedDistanceMegaparsecs += Math.max(0, this.finite(candidate.distanceMegaparsecs)) * probability;
            probabilityTotal += probability;
            if (probability > dominantProbability) {
                dominantProbability = probability;
                dominantHostName = candidate.hostName;
            }
        }

        const safeProbabilityTotal: number = Math.max(0.000001, probabilityTotal);
        const confidence: number = this.clamp(probabilityTotal / hostCandidates.length, 0, 1);
        return {
            weightedDistanceMegaparsecs: weightedDistanceMegaparsecs / safeProbabilityTotal,
            confidence,
            candidateCount: hostCandidates.length,
            dominantHostName
        };
    }

    /**
     * Builds a complete parallax/proper-motion distance packet for telemetry and source cards.
     * @param parallaxArcseconds Observed parallax angle in arcseconds.
     * @param properMotionArcsecondsPerYear Proper motion in arcseconds per year.
     */
    public createParallaxPacket(parallaxArcseconds: number, properMotionArcsecondsPerYear: number): RelationalDistancePacket {
        const distanceParsecs: number = this.calculateParsecsFromParallax(parallaxArcseconds);
        const distanceMegaparsecs: number = distanceParsecs / RelationalDistanceCalculator.parsecsPerMegaparsec;
        const tangentialVelocityKilometersPerSecond: number = this.calculateTangentialVelocityKilometersPerSecond(properMotionArcsecondsPerYear, distanceParsecs);
        return {
            distanceParsecs,
            distanceMegaparsecs,
            tangentialVelocityKilometersPerSecond,
            methodLabel: "parallax-arcsecond-geometry"
        };
    }

    private finite(value: number): number {
        return Number.isFinite(value) ? value : 0;
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
