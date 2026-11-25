export const enum EntityTypeFlag {
    None = 0,
    MaterialNode = 1,
    Photon = 2,
    OscillatorProbe = 4,
    MassiveBody = 8,
    Spacecraft = 16,
    Condensate = 32,
    SolverLink = 64
}

export interface SolverLinkComponent {
    readonly sourceEntityId: number;
    readonly targetEntityId: number;
    readonly restLength: number;
    readonly tension: number;
    readonly torsionProxy: number;
}

export interface PhotonComponent {
    readonly entityId: number;
    readonly photonMass: number;
    readonly wavelength: number;
    readonly frequency: number;
    readonly energy: number;
    readonly ledgerEnergy: number;
}

export interface OscillatorProbeComponent {
    readonly entityId: number;
    readonly globalTickCount: number;
    readonly transitionCount: number;
    readonly dampingCoefficient: number;
}
