import { TelemetryFrame } from "./PhysicsTypes";

/**
 * Converts telemetry frames into plain view models for a WordPress or canvas UI layer.
 */
export class TelemetryRenderer {
    /**
     * Creates human-readable lines for a telemetry panel.
     *
     * @param frame The telemetry frame returned by the engine.
     * @returns Display lines for a non-jQuery UI renderer.
     */
    public createDisplayLines(frame: TelemetryFrame): readonly string[] {
        const failedChecks: number = frame.conservationLedger.filter((entry) => !entry.passed).length;
        return [
            `Mode: ${frame.mode}`,
            `Elapsed seconds: ${frame.elapsedSeconds}`,
            `Photon mass kg: ${frame.constants.photonMassKilograms}`,
            `Ledger failures: ${failedChecks}`,
            `Warnings: ${frame.warnings.length}`
        ];
    }
}
