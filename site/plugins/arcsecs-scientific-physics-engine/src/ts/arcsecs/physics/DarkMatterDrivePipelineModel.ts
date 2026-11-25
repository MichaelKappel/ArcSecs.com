export type RamjetFailureMode = "none" | "micrometeorBurst" | "solenoidQuench" | "radiatorPanelLoss" | "bufferSaturation" | "bufferDecoherence" | "wideExhaust" | "shieldOverload";

export interface DarkMatterDrivePipelineInput {
    readonly substrateDensity: number;
    readonly scoopArea: number;
    readonly shipVelocityRatioC: number;
    readonly dragCoefficient: number;
    readonly shieldAblationRate: number;
    readonly compressionRatio: number;
    readonly bufferCapacity: number;
    readonly reactorEfficiency: number;
    readonly radiatorCapacity: number;
    readonly exhaustCollimation: number;
    readonly failureMode: RamjetFailureMode;
}

export interface DarkMatterDrivePipelineState {
    readonly intakeRate: number;
    readonly dragLoad: number;
    readonly shieldIntegrity: number;
    readonly solenoidStatus: "nominal" | "stressed" | "quench";
    readonly bufferFill: number;
    readonly bufferCoherence: number;
    readonly reactorOutput: number;
    readonly wasteHeat: number;
    readonly radiatorCapacity: number;
    readonly exhaustCollimation: number;
    readonly thrust: number;
    readonly netAcceleration: number;
    readonly ledgerClosure: number;
    readonly flightReadinessScore: number;
    readonly warningCount: number;
}

/** Deterministic Dark Matter Drive / tired-light ramjet pipeline accounting model. */
export class DarkMatterDrivePipelineModel {
    /**
     * Computes the full conceptual ramjet pipeline and applies one visible failure injection.
     * @param input Pipeline input parameters and failure mode.
     */
    public compute(input: DarkMatterDrivePipelineInput): DarkMatterDrivePipelineState {
        const intakeRateBase: number = Math.max(0, input.substrateDensity) * Math.max(0, input.scoopArea) * Math.max(0.01, input.shipVelocityRatioC);
        const intakeRate: number = input.failureMode === "micrometeorBurst" ? intakeRateBase * 0.72 : intakeRateBase;
        const solenoidFailed: boolean = input.failureMode === "solenoidQuench";
        const dragMultiplier: number = solenoidFailed ? 2.4 : 1;
        const dragLoad: number = intakeRate * Math.max(0, input.dragCoefficient) * 0.18 * dragMultiplier;
        const shieldStress: number = input.failureMode === "shieldOverload" ? 0.52 : input.failureMode === "micrometeorBurst" ? 0.34 : 0;
        const shieldIntegrity: number = this.clamp(1 - input.shieldAblationRate - dragLoad * 0.002 - shieldStress, 0, 1);
        const compressedIntake: number = intakeRate * Math.max(1, input.compressionRatio) / 18;
        const bufferCapacity: number = Math.max(0.001, input.bufferCapacity);
        const injectedSaturation: number = input.failureMode === "bufferSaturation" ? bufferCapacity * 0.68 : 0;
        const bufferFill: number = this.clamp((compressedIntake + injectedSaturation) / bufferCapacity, 0, 1.4);
        const decoherencePenalty: number = input.failureMode === "bufferDecoherence" ? 0.55 : 0;
        const bufferCoherence: number = this.clamp(1 - Math.max(0, bufferFill - 0.82) * 0.85 - decoherencePenalty, 0, 1);
        const reactorInput: number = Math.min(compressedIntake, bufferCapacity) * bufferCoherence;
        const reactorOutput: number = reactorInput * this.clamp(input.reactorEfficiency, 0, 1);
        const wasteHeat: number = Math.max(0, reactorInput - reactorOutput) + dragLoad * 0.12;
        const radiatorCapacity: number = input.failureMode === "radiatorPanelLoss" ? input.radiatorCapacity * 0.45 : input.radiatorCapacity;
        const thermalThrottle: number = this.clamp(radiatorCapacity / Math.max(0.000001, wasteHeat), 0, 1);
        const exhaustCollimation: number = this.clamp(input.failureMode === "wideExhaust" ? input.exhaustCollimation * 0.48 : input.exhaustCollimation, 0, 1);
        const thrust: number = reactorOutput * thermalThrottle * exhaustCollimation;
        const netAcceleration: number = thrust - dragLoad;
        const ledgerClosure: number = this.clamp(1 - Math.abs(reactorInput - reactorOutput - (reactorInput - reactorOutput)) / Math.max(1, reactorInput), 0, 1);
        const warningCount: number = this.warningCount(shieldIntegrity, bufferFill, bufferCoherence, wasteHeat, radiatorCapacity, exhaustCollimation, solenoidFailed);
        const flightReadinessScore: number = this.clamp((shieldIntegrity + bufferCoherence + thermalThrottle + exhaustCollimation + ledgerClosure) / 5 - warningCount * 0.05, 0, 1);
        const solenoidStatus: "nominal" | "stressed" | "quench" = solenoidFailed ? "quench" : dragLoad > intakeRate * 0.4 ? "stressed" : "nominal";
        return { intakeRate, dragLoad, shieldIntegrity, solenoidStatus, bufferFill, bufferCoherence, reactorOutput, wasteHeat, radiatorCapacity, exhaustCollimation, thrust, netAcceleration, ledgerClosure, flightReadinessScore, warningCount };
    }

    private warningCount(shieldIntegrity: number, bufferFill: number, bufferCoherence: number, wasteHeat: number, radiatorCapacity: number, exhaustCollimation: number, solenoidFailed: boolean): number {
        let count: number = 0;
        if (shieldIntegrity < 0.55) { count += 1; }
        if (bufferFill > 1) { count += 1; }
        if (bufferCoherence < 0.55) { count += 1; }
        if (wasteHeat > radiatorCapacity) { count += 1; }
        if (exhaustCollimation < 0.55) { count += 1; }
        if (solenoidFailed) { count += 1; }
        return count;
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
