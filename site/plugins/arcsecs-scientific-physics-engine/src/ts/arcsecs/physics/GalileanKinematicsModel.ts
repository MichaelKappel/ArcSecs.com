export interface GalileanRelativeVelocityState {
    readonly bodyAVelocity: number;
    readonly bodyBVelocity: number;
    readonly relativeVelocity: number;
    readonly globalTimeSeconds: number;
    readonly lorentzFactorApplied: boolean;
}

/** Galilean relative-velocity model for the alternative absolute-time scenario. */
export class GalileanKinematicsModel {
    /**
     * Computes relative velocity by arithmetic vector difference without Lorentz limiting.
     * @param bodyAVelocity Body A velocity along the visualization axis.
     * @param bodyBVelocity Body B velocity along the visualization axis.
     * @param globalTimeSeconds Shared global simulation time.
     */
    public relativeVelocity(bodyAVelocity: number, bodyBVelocity: number, globalTimeSeconds: number): GalileanRelativeVelocityState {
        return {
            bodyAVelocity,
            bodyBVelocity,
            relativeVelocity: Math.abs(bodyAVelocity - bodyBVelocity),
            globalTimeSeconds,
            lorentzFactorApplied: false
        };
    }
}
