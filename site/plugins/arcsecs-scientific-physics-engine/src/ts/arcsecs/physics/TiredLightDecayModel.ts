export interface TiredLightDecayState {
    readonly initialEnergy: number;
    readonly currentEnergy: number;
    readonly energyLost: number;
    readonly substrateLedgerEnergy: number;
    readonly ledgerClosureError: number;
    readonly redshift: number;
}

/** Tired-light energy attenuation with explicit ledger accounting. */
export class TiredLightDecayModel {
    /**
     * Calculates energy decay and ledger closure for a photon packet.
     * @param initialEnergy Initial photon energy proxy.
     * @param distance Traveled distance proxy.
     * @param attenuationCoefficient Non-negative attenuation coefficient.
     * @param ledgerEfficiency Fraction of removed energy written to the substrate ledger.
     */
    public decay(initialEnergy: number, distance: number, attenuationCoefficient: number, ledgerEfficiency: number = 1): TiredLightDecayState {
        const safeInitialEnergy: number = Math.max(0, initialEnergy);
        const safeDistance: number = Math.max(0, distance);
        const safeAttenuationCoefficient: number = Math.max(0, attenuationCoefficient);
        const currentEnergy: number = safeInitialEnergy * Math.exp(-safeAttenuationCoefficient * safeDistance);
        const energyLost: number = safeInitialEnergy - currentEnergy;
        const substrateLedgerEnergy: number = energyLost * this.clamp(ledgerEfficiency, 0, 1);
        const ledgerClosureError: number = Math.abs(energyLost - substrateLedgerEnergy);
        const redshift: number = safeInitialEnergy / Math.max(0.000001, currentEnergy) - 1;
        return { initialEnergy: safeInitialEnergy, currentEnergy, energyLost, substrateLedgerEnergy, ledgerClosureError, redshift };
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
