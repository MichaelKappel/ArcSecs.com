/**
 * Slow-light condensate helper for speculative dark-sector density fields.
 */
export class DarkMatterCondensateModel {
    /**
     * Estimates density growth from degraded photon energy.
     *
     * @param capturedEnergyJoules Captured or exhausted photon energy.
     * @param effectiveVolumeCubicMeters Volume over which the condensate is distributed.
     * @param speedOfLightMetersPerSecond Local effective speed of light.
     * @returns Effective mass density in kilograms per cubic meter.
     */
    public estimateDensity(capturedEnergyJoules: number, effectiveVolumeCubicMeters: number, speedOfLightMetersPerSecond: number): number {
        if (effectiveVolumeCubicMeters <= 0 || speedOfLightMetersPerSecond <= 0) {
            return 0;
        }

        const equivalentMassKilograms: number = capturedEnergyJoules / Math.pow(speedOfLightMetersPerSecond, 2);
        return equivalentMassKilograms / effectiveVolumeCubicMeters;
    }
}
