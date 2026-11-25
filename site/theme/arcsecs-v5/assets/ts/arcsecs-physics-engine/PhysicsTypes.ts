/**
 * Shared TypeScript contracts for ArcSecs speculative physics-engine examples.
 * These files are source examples for the research package; the current WordPress
 * theme does not compile or enqueue them at runtime.
 */

export type ScenarioMode = "mainstream" | "tired-light" | "proca-photon" | "condensate" | "relational-inertia";

export interface Vector3D {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}

export interface SimulationEntity {
    readonly entityId: string;
    readonly displayName: string;
    readonly restMassKilograms: number;
    readonly positionMeters: Vector3D;
    readonly velocityMetersPerSecond: Vector3D;
}

export interface PhysicalConstantsSnapshot {
    readonly speedOfLightMetersPerSecond: number;
    readonly gravitationalConstant: number;
    readonly planckConstantReduced: number;
    readonly elementaryChargeCoulombs: number;
    readonly fineStructureConstant: number;
    readonly photonMassKilograms: number;
}

export interface SimulationStepInput {
    readonly mode: ScenarioMode;
    readonly elapsedSeconds: number;
    readonly entities: readonly SimulationEntity[];
}

export interface ConservationLedgerEntry {
    readonly name: string;
    readonly expectedValue: number;
    readonly observedValue: number;
    readonly tolerance: number;
    readonly passed: boolean;
    readonly notes: string;
}

export interface TelemetryFrame {
    readonly mode: ScenarioMode;
    readonly elapsedSeconds: number;
    readonly constants: PhysicalConstantsSnapshot;
    readonly conservationLedger: readonly ConservationLedgerEntry[];
    readonly warnings: readonly string[];
}
