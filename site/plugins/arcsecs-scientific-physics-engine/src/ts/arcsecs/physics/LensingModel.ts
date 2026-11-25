export interface LensingComparisonState {
    readonly impactParameter: number;
    readonly centralMass: number;
    readonly photonMass: number;
    readonly photonVelocity: number;
    readonly soldnerDeflectionArcseconds: number;
    readonly standardGeneralRelativityArcseconds: number;
    readonly arcsecsProxyArcseconds: number;
    readonly standardMismatchArcseconds: number;
}

/** Flat-space massive-photon lensing comparison model with explicit standard-reference mismatch. */
export class LensingModel {
    /**
     * Computes Soldner-style, GR reference, and ArcSecs proxy deflection values.
     * @param centralMass Central mass proxy.
     * @param impactParameter Closest approach distance proxy.
     * @param photonMass Effective photon mass proxy.
     * @param photonVelocity Photon velocity proxy.
     */
    public compare(centralMass: number, impactParameter: number, photonMass: number, photonVelocity: number): LensingComparisonState {
        const safeImpactParameter: number = Math.max(0.000001, impactParameter);
        const safePhotonVelocity: number = Math.max(0.000001, photonVelocity);
        const safePhotonMass: number = Math.max(0, photonMass);
        const soldnerDeflectionArcseconds: number = (2 * Math.max(0, centralMass)) / (safeImpactParameter * safePhotonVelocity * safePhotonVelocity);
        const standardGeneralRelativityArcseconds: number = soldnerDeflectionArcseconds * 2;
        const arcsecsProxyArcseconds: number = soldnerDeflectionArcseconds * (1 + this.clamp(safePhotonMass * 1e18, 0, 4));
        const standardMismatchArcseconds: number = arcsecsProxyArcseconds - standardGeneralRelativityArcseconds;
        return { impactParameter: safeImpactParameter, centralMass, photonMass: safePhotonMass, photonVelocity: safePhotonVelocity, soldnerDeflectionArcseconds, standardGeneralRelativityArcseconds, arcsecsProxyArcseconds, standardMismatchArcseconds };
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
