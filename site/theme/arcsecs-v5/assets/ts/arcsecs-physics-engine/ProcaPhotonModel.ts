import { PhysicalConstantsSnapshot } from "./PhysicsTypes";

/**
 * Proca-inspired photon transport helper for speculative massive-photon branches.
 */
export class ProcaPhotonModel {
    /**
     * Calculates an approximate group velocity for a photon with a tiny rest mass.
     *
     * @param frequencyHertz Photon frequency in hertz.
     * @param constants Constants snapshot containing c, h-bar, and photon mass.
     * @returns Approximate group velocity in meters per second.
     */
    public calculateGroupVelocity(frequencyHertz: number, constants: PhysicalConstantsSnapshot): number {
        if (constants.photonMassKilograms <= 0) {
            return constants.speedOfLightMetersPerSecond;
        }

        const angularFrequency: number = 2 * Math.PI * frequencyHertz;
        const massTerm: number = (constants.photonMassKilograms * Math.pow(constants.speedOfLightMetersPerSecond, 2)) / constants.planckConstantReduced;
        const velocityFactor: number = Math.sqrt(Math.max(0, 1 - Math.pow(massTerm / angularFrequency, 2)));
        return constants.speedOfLightMetersPerSecond * velocityFactor;
    }
}
