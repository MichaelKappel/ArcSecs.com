import { DistanceTimeKernelModel } from "../distance-time/DistanceTimeKernelModel";
import type { DistanceTimeKernelInput, DistanceTimeKernelSnapshot, MultiMessengerEvent } from "../distance-time/DistanceTimeKernelModel";
import { FrameworkClaimMap } from "../claims/FrameworkClaimMap";
import type { FrameworkClaimMapExportRecord } from "../claims/FrameworkClaimMap";

export interface MultiMessengerEventTheaterState {
    readonly activeEventKey: string;
    readonly activeEvent: MultiMessengerEvent;
    readonly kernelSnapshot: DistanceTimeKernelSnapshot;
    readonly activeClaimKeys: readonly string[];
    readonly delayLabel: string;
    readonly viewportInstructions: readonly string[];
    readonly validationChecks: readonly string[];
    readonly exportRecords: readonly FrameworkClaimMapExportRecord[];
    readonly speculativeBoundary: string;
}

export interface MultiMessengerEventTheaterExport {
    readonly packetType: string;
    readonly activeEvent: MultiMessengerEvent;
    readonly eventList: readonly MultiMessengerEvent[];
    readonly eventTelemetrySnapshot: DistanceTimeKernelSnapshot["telemetry"];
    readonly wavefrontTelemetry: {
        readonly gravityWavefront: DistanceTimeKernelSnapshot["gravityWavefront"];
        readonly photonWavefront: DistanceTimeKernelSnapshot["photonWavefront"];
    };
    readonly delayDecomposition: DistanceTimeKernelSnapshot["delayDecomposition"];
    readonly activeClaimCards: readonly string[];
    readonly validationResults: readonly string[];
    readonly falsificationNotes: readonly string[];
    readonly speculativeBoundaryText: string;
    readonly exportContainsExecutableCode: boolean;
}

/** Coordinates the public multi-messenger demonstration layer on top of the Distance-Time Kernel and Framework Claim Map. */
export class MultiMessengerEventTheater {
    private readonly kernelModel: DistanceTimeKernelModel;
    private readonly claimMap: FrameworkClaimMap;

    /**
     * Creates the event theater.
     * @param kernelModel Kernel model dependency.
     * @param claimMap Claim map dependency.
     */
    public constructor(kernelModel: DistanceTimeKernelModel = new DistanceTimeKernelModel(), claimMap: FrameworkClaimMap = new FrameworkClaimMap()) {
        this.kernelModel = kernelModel;
        this.claimMap = claimMap;
    }

    /** Lists selectable events for the theater UI. */
    public listEvents(): readonly MultiMessengerEvent[] {
        return this.kernelModel.listEvents();
    }

    /**
     * Selects an event and builds the theater state used by UI, validation, and exports.
     * @param input Kernel input including selected event key.
     */
    public selectEvent(input: DistanceTimeKernelInput): MultiMessengerEventTheaterState {
        const kernelSnapshot: DistanceTimeKernelSnapshot = this.kernelModel.buildSnapshot(input);
        const validationChecks: readonly string[] = this.kernelModel.validate(kernelSnapshot).map((check) => `${check.passed ? "pass" : "warn"}: ${check.label}`);
        const exportRecords: readonly FrameworkClaimMapExportRecord[] = this.claimMap.buildExportRecords(kernelSnapshot);
        return Object.freeze({
            activeEventKey: kernelSnapshot.activeEvent.eventKey,
            activeEvent: kernelSnapshot.activeEvent,
            kernelSnapshot,
            activeClaimKeys: kernelSnapshot.activeClaimKeys,
            delayLabel: "What caused the delay?",
            viewportInstructions: Object.freeze([
                "Render the source event on the left and observer on the right.",
                "Render the blue-white GravityWavefront first.",
                "Render the red-gold PhotonWavefront later, weaker, redder, stretched, faded, uncertain, or missing.",
                "Render the delay bracket, density path overlay, and missing-counterpart state when appropriate."
            ]),
            validationChecks,
            exportRecords,
            speculativeBoundary: kernelSnapshot.speculativeBoundary
        });
    }

    /**
     * Builds an inert export packet for evidence bundles and scene JSON.
     * @param state Current event theater state.
     */
    public buildExport(state: MultiMessengerEventTheaterState): MultiMessengerEventTheaterExport {
        return Object.freeze({
            packetType: "ArcSecs Multi-Messenger Event Theater Export",
            activeEvent: state.activeEvent,
            eventList: this.listEvents(),
            eventTelemetrySnapshot: state.kernelSnapshot.telemetry,
            wavefrontTelemetry: Object.freeze({
                gravityWavefront: state.kernelSnapshot.gravityWavefront,
                photonWavefront: state.kernelSnapshot.photonWavefront
            }),
            delayDecomposition: state.kernelSnapshot.delayDecomposition,
            activeClaimCards: state.activeClaimKeys,
            validationResults: state.validationChecks,
            falsificationNotes: Object.freeze(state.exportRecords.map((record: FrameworkClaimMapExportRecord) => record.falsificationWarning)),
            speculativeBoundaryText: state.speculativeBoundary,
            exportContainsExecutableCode: false
        });
    }
}
