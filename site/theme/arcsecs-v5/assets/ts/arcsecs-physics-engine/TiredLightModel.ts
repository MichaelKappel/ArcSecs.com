/**
 * Models explicit photon-energy attenuation for tired-light thought experiments.
 */
export class TiredLightModel {
    /**
     * Applies exponential energy decay across path length.
     *
     * @param initialEnergyJoules Initial photon or packet energy.
     * @param distanceMeters Propagation distance.
     * @param attenuationPerMeter Energy-loss coefficient per meter.
     * @returns Remaining energy in joules.
     */
    public calculateRemainingEnergy(initialEnergyJoules: number, distanceMeters: number, attenuationPerMeter: number): number {
        return initialEnergyJoules * Math.exp(-attenuationPerMeter * distanceMeters);
    }

    /**
     * Converts energy loss into an observed redshift-style ratio.
     *
     * @param initialEnergyJoules Initial energy before attenuation.
     * @param remainingEnergyJoules Remaining energy after attenuation.
     * @returns A redshift-like z value.
     */
    public calculateEnergyLossRedshift(initialEnergyJoules: number, remainingEnergyJoules: number): number {
        if (remainingEnergyJoules <= 0) {
            return Number.POSITIVE_INFINITY;
        }

        return (initialEnergyJoules / remainingEnergyJoules) - 1;
    }
}
