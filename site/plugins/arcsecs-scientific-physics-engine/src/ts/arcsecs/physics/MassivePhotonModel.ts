export interface MassivePhotonState {
    readonly photonMass: number;
    readonly velocity: number;
    readonly gravitationalCoupling: number;
    readonly kineticEnergyProxy: number;
}

/** Massive-photon proxy model used for non-consensus lensing and dark-star scenarios. */
export class MassivePhotonModel {
    /**
     * Computes photon proxy state while keeping all values finite.
     * @param photonMass Effective non-zero photon mass proxy.
     * @param velocity Photon speed proxy.
     */
    public state(photonMass: number, velocity: number): MassivePhotonState {
        const safePhotonMass: number = Math.max(0, photonMass);
        const safeVelocity: number = Math.max(0.000001, velocity);
        const gravitationalCoupling: number = this.clamp(safePhotonMass * 1e18, 0, 4);
        const kineticEnergyProxy: number = 0.5 * safePhotonMass * safeVelocity * safeVelocity;
        return { photonMass: safePhotonMass, velocity: safeVelocity, gravitationalCoupling, kineticEnergyProxy };
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
