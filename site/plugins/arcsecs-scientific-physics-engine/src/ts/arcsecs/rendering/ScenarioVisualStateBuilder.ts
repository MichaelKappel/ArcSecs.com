import { ArcSecsScenarioKey } from "../scenarios/ScenarioCatalog";
import { RamjetFailureMode } from "../physics/DarkMatterDrivePipelineModel";

export type VisualPrimitiveType = "node" | "edge" | "photonTrail" | "mass" | "oscillator" | "halo" | "spacecraft" | "pipelineStage" | "warningPulse" | "label";

export interface VisualPrimitive {
    readonly type: VisualPrimitiveType;
    readonly id: string;
    readonly x: number;
    readonly y: number;
    readonly radius: number;
    readonly label: string;
    readonly intensity: number;
}

export interface ScenarioVisualState {
    readonly scenario: ArcSecsScenarioKey;
    readonly primitives: readonly VisualPrimitive[];
    readonly centerInstruction: string;
    readonly mustRenderWarning: boolean;
}

export interface ScenarioVisualInput {
    readonly scenario: ArcSecsScenarioKey;
    readonly tickCount: number;
    readonly failureMode: RamjetFailureMode;
    readonly warningCount: number;
    readonly primarySignal: number;
    readonly secondarySignal: number;
}

/** Converts scenario telemetry into concrete render primitives instead of empty panels. */
export class ScenarioVisualStateBuilder {
    /**
     * Builds high-level render primitives for the selected mode.
     * @param input Current scenario telemetry and warning state.
     */
    public build(input: ScenarioVisualInput): ScenarioVisualState {
        const primitives: VisualPrimitive[] = [];
        const pulse: number = 0.5 + Math.sin(input.tickCount / 12) * 0.5;
        if (input.scenario === "darkMatterRamjet") {
            this.addRamjet(primitives, input, pulse);
        } else if (input.scenario === "darkMatterCondensate") {
            this.addCondensate(primitives, input);
        } else if (input.scenario === "absoluteTimeQuantumOscillator") {
            primitives.push(this.primitive("mass", "central_mass", 0, 0, 34, "mass field", input.secondarySignal));
            primitives.push(this.primitive("oscillator", "deep_probe", -120, -20, 14, "deep oscillator", 1));
            primitives.push(this.primitive("oscillator", "near_probe", 92, -10, 14, "near damped oscillator", Math.max(0.2, 1 - input.secondarySignal)));
        } else if (input.scenario === "massivePhotonLensing" || input.scenario === "newtonianDarkStar") {
            primitives.push(this.primitive("mass", "compact_mass", 0, 0, input.scenario === "newtonianDarkStar" ? 46 : 34, "compact mass", 1));
            primitives.push(this.primitive("photonTrail", "photon_path_a", -140, -36, 6, "curved photon path", input.primarySignal));
            primitives.push(this.primitive("photonTrail", "photon_path_b", -110, 38, 6, input.scenario === "newtonianDarkStar" ? "fallback path" : "comparison path", input.secondarySignal));
        } else if (input.scenario === "superluminalGalilean") {
            primitives.push(this.primitive("node", "body_a", -96 - input.primarySignal * 8, 0, 16, "body A", 1));
            primitives.push(this.primitive("node", "body_b", 96 + input.primarySignal * 8, 0, 16, "body B", 1));
            primitives.push(this.primitive("edge", "relative_velocity", 0, 0, 2, "relative velocity > c", input.primarySignal));
        } else if (input.scenario === "tiredLightEnergyLedger" || input.scenario === "parallaxCalibration") {
            primitives.push(this.primitive("photonTrail", "ledger_photon", -130, 0, 7, "photon energy", input.primarySignal));
            primitives.push(this.primitive("edge", "substrate_ledger", 0, 34, 3, "substrate ledger", input.secondarySignal));
            primitives.push(this.primitive("label", "closure_label", 120, -24, 8, "ledger closure", 1 - Math.abs(input.primarySignal - input.secondarySignal)));
        } else {
            for (let index: number = 0; index < 8; index += 1) {
                const angle: number = index * Math.PI * 2 / 8;
                primitives.push(this.primitive("node", "node_" + index, Math.cos(angle) * 92, Math.sin(angle) * 58, 10, "relation node", 1));
                primitives.push(this.primitive("edge", "edge_" + index, Math.cos(angle) * 46, Math.sin(angle) * 29, 2, "solver link", input.secondarySignal));
            }
        }
        if (input.warningCount > 0) {
            primitives.push(this.primitive("warningPulse", "warning_bus", 0, -96, 22, input.failureMode === "none" ? "validation warning" : input.failureMode, pulse));
        }
        return { scenario: input.scenario, primitives, centerInstruction: this.instruction(input.scenario), mustRenderWarning: input.warningCount > 0 };
    }

    private addRamjet(primitives: VisualPrimitive[], input: ScenarioVisualInput, pulse: number): void {
        primitives.push(this.primitive("spacecraft", "ramjet_ship", 38, 0, 30, "ramjet craft", 1));
        const labels: readonly string[] = ["EIT scoop", "intake", "HIBE shield", "Fishback solenoid", "DSP buffer", "reactor", "radiator", "collimated exhaust"];
        for (let index: number = 0; index < labels.length; index += 1) {
            primitives.push(this.primitive("pipelineStage", "stage_" + index, -160 + index * 45, index % 2 === 0 ? -32 : 32, 12, labels[index], index < 4 ? input.primarySignal : input.secondarySignal));
        }
        if (input.failureMode !== "none") {
            primitives.push(this.primitive("warningPulse", "failure_" + input.failureMode, -24, -72, 24, input.failureMode, pulse));
        }
    }

    private addCondensate(primitives: VisualPrimitive[], input: ScenarioVisualInput): void {
        for (let index: number = 0; index < 12; index += 1) {
            const angle: number = index * Math.PI * 2 / 12;
            const radius: number = 42 + index * 5;
            primitives.push(this.primitive("halo", "condensate_" + index, Math.cos(angle) * radius, Math.sin(angle) * radius * 0.65, 8, "ledger halo", input.secondarySignal));
        }
    }

    private primitive(type: VisualPrimitiveType, id: string, x: number, y: number, radius: number, label: string, intensity: number): VisualPrimitive {
        return { type, id, x, y, radius, label, intensity: this.clamp(intensity, 0, 1) };
    }

    private instruction(scenario: ArcSecsScenarioKey): string {
        if (scenario === "darkMatterRamjet") {
            return "Watch the scoop-to-exhaust pipeline; failure injections must create a visible warning pulse and telemetry change.";
        }
        if (scenario === "absoluteTimeQuantumOscillator") {
            return "Compare one global tick with two local oscillator transition counts.";
        }
        if (scenario === "tiredLightEnergyLedger") {
            return "Confirm photon energy lost is accounted for by the substrate ledger.";
        }
        return "Run, pause, step, and reset should visibly change this scenario state.";
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
