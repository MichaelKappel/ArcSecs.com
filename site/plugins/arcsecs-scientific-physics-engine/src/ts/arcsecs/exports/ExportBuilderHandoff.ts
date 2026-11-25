import type { ArcSecsExportSourceReference, ArcSecsExportTarget } from "./ExportSchemaContracts";

export interface ArcSecsExportBuilderHandoff {
    readonly handoffName: string;
    readonly implementationOwner: "plugin-agent";
    readonly themeDependencyAllowed: false;
    readonly requiredTargets: readonly ArcSecsExportTarget[];
    readonly sourceReferences: readonly ArcSecsExportSourceReference[];
    readonly requiredLiveDataSources: readonly string[];
    readonly speculativeBoundaryText: string;
}

const requiredExportTargets: readonly ArcSecsExportTarget[] = Object.freeze(["benchmarkJson", "calibrationCertificate", "qualityGate", "operatorRunbook", "evidencePacket", "researchBundle", "sceneJson"]);

export const arcsecsExportBuilderHandoff: ArcSecsExportBuilderHandoff = Object.freeze({
    handoffName: "ArcSecs strict TypeScript export builders",
    implementationOwner: "plugin-agent",
    themeDependencyAllowed: false,
    requiredTargets: requiredExportTargets,
    sourceReferences: Object.freeze([
        Object.freeze({ documentName: "New Universe Framework Time and Distance.md", role: "Distance without lightyears and clockless progression source" }),
        Object.freeze({ documentName: "Rethinking Light Time and Spacetime.md", role: "No-spacetime and local-oscillator probe framing" }),
        Object.freeze({ documentName: "Modeling Light Slowing and Energy Degeneration Multi-Messenger Events.md", role: "Gravity-wave baseline and degraded-light event model" }),
        Object.freeze({ documentName: "Rethinking Cosmic Measurement Framework.md", role: "Relational measurement and export evidence framework" }),
        Object.freeze({ documentName: "DarkMatterDrive.com Framework public contract", role: "Source-side contract page alignment" }),
        Object.freeze({ documentName: "DarkMatterDrive.com Distance-Time Kernel public contract", role: "No-lightyear distance and clockless progression endpoint alignment" }),
        Object.freeze({ documentName: "DarkMatterDrive.com Multi-Messenger Event Theater public contract", role: "GW170817, GW150914, GW190521, supernova stretch, and Hubble tension anchor alignment" }),
        Object.freeze({ documentName: "DarkMatterDrive.com Plugin Handoff public contract", role: "Plugin-agent implementation and strict export-builder source alignment" }),
        Object.freeze({ documentName: "DarkMatterDrive.com Evidence Map public contract", role: "Claim-to-evidence and falsification-path alignment" }),
        Object.freeze({ documentName: "DarkMatterDrive.com Source Matrix public contract", role: "Public source reference and endpoint alignment" }),
        Object.freeze({ documentName: "DarkMatterDrive.com Claim Status public contract", role: "Claim Map source-contract alignment" }),
        Object.freeze({ documentName: "DarkMatterDrive.com Research Library public contract", role: "Framework source-library alignment" })
    ]),
    requiredLiveDataSources: Object.freeze(["Distance-Time Kernel", "Framework Claim Map", "Multi-Messenger Event Theater", "Validation Lab ledger", "Quality Gate state", "Telemetry snapshots", "Viewport/demo state", "Active scenario", "Active event", "Active story step", "Active claim cards", "Speculative-boundary language", "Falsification paths", "DarkMatterDrive.com public contract endpoints", "Endpoint fallback state"]),
    speculativeBoundaryText: "Speculative research visualization: this hypothesis model is for testing, comparison, simulation, visualization, and falsification paths; it is not proof or settled physics."
});
