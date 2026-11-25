import { PhysicalConstantsSnapshot, ScenarioMode } from "./PhysicsTypes";

/**
 * Coordinates invariant constants and explicitly selected speculative branches.
 * Dimensionless constants are kept visible so model drift cannot hide inside magic numbers.
 */
export class ConstantsManager {
    private readonly baseline: PhysicalConstantsSnapshot;

    /**
     * @param baseline The reference constants used before a scenario branch changes anything.
     */
    public constructor(baseline: PhysicalConstantsSnapshot) {
        this.baseline = baseline;
    }

    /**
     * Returns constants for a scenario and elapsed time.
     *
     * @param mode The selected simulation scenario mode.
     * @param elapsedSeconds Elapsed scenario time in seconds.
     * @returns A snapshot of constants for this step.
     */
    public getSnapshot(mode: ScenarioMode, elapsedSeconds: number): PhysicalConstantsSnapshot {
        if (mode === "tired-light") {
            return this.createTiredLightSnapshot(elapsedSeconds);
        }

        if (mode === "proca-photon" || mode === "condensate") {
            return {
                ...this.baseline,
                photonMassKilograms: Math.max(this.baseline.photonMassKilograms, 1e-54)
            };
        }

        return this.baseline;
    }

    /**
     * Creates a conservative tired-light branch where effective c decay is explicit.
     *
     * @param elapsedSeconds Elapsed scenario time in seconds.
     * @returns A constants snapshot with the effective light speed adjusted.
     */
    private createTiredLightSnapshot(elapsedSeconds: number): PhysicalConstantsSnapshot {
        const hubbleLikeDecayPerSecond: number = 2.2e-18;
        const decayFactor: number = Math.exp(-hubbleLikeDecayPerSecond * elapsedSeconds);
        const adjustedSpeedOfLight: number = this.baseline.speedOfLightMetersPerSecond * decayFactor;

        return {
            ...this.baseline,
            speedOfLightMetersPerSecond: adjustedSpeedOfLight
        };
    }
}
