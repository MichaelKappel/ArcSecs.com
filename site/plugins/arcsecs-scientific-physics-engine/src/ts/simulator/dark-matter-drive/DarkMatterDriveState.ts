export type DarkMatterDriveScenarioKey =
    | "darkMatterRamjet"
    | "massivePhotonLensing"
    | "tiredLightEnergyLedger"
    | "absoluteTimeQuantumOscillator"
    | "newtonianDarkStar"
    | "darkMatterCondensate";

export type DarkMatterDriveFailureMode =
    | "none"
    | "radiatorBottleneck"
    | "bufferSaturation"
    | "fuelStarvation"
    | "thermalOverload"
    | "captureThreshold";

export interface DarkMatterDriveRecipe {
    readonly label: string;
    readonly scenario: DarkMatterDriveScenarioKey;
    readonly speedMultiplier: number;
    readonly photonPacketCount: number;
    readonly photonMassProxy: number;
    readonly baryonicMass: number;
    readonly lossRate: number;
    readonly compressionRatio: number;
    readonly thermalRejectionCapacity: number;
    readonly failureMode: DarkMatterDriveFailureMode;
    readonly reducedVisualIntensity: boolean;
}

export interface DarkMatterDriveTelemetry {
    readonly framesPerSecond: number;
    readonly physicsTickMilliseconds: number;
    readonly renderMilliseconds: number;
    readonly workerLatency: number;
    readonly ledgerClosureError: number;
    readonly netAccelerationProxy: number;
    readonly captureEfficiency: number;
    readonly thermalLoad: number;
    readonly bufferSaturation: number;
    readonly currentScenarioState: string;
}

export interface DarkMatterDriveTimelineEvent {
    readonly marker: string;
    readonly severity: "pass" | "info" | "note" | "warning";
    readonly why: string;
}

export interface DarkMatterDriveHotspot {
    readonly id: string;
    readonly title: string;
    readonly shortTitle: string;
    readonly x: number;
    readonly y: number;
    readonly scenario: DarkMatterDriveScenarioKey;
    readonly details: readonly string[];
    readonly warnings: readonly string[];
    readonly metric: string;
}
