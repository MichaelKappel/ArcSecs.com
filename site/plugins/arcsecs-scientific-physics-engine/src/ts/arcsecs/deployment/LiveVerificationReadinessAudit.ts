import type { ArcSecsExportTarget } from "../exports/ExportSchemaContracts";
import { darkMatterDrivePublicContractEndpoints } from "../contracts/DarkMatterDrivePublicContracts";

export interface ArcSecsLiveVerificationExpectation {
    readonly key: string;
    readonly label: string;
    readonly pagePath: "/arcsecs-physics-engine-demo/" | "/dark-matter-drive-simulator/" | "both";
    readonly expectedEvidence: readonly string[];
    readonly failureMeaning: string;
}

export interface ArcSecsLiveVerificationMatrix {
    readonly pluginVersion: string;
    readonly canonicalPluginFolder: string;
    readonly canonicalMainPluginFile: string;
    readonly primaryPages: readonly string[];
    readonly requiredExportTargets: readonly ArcSecsExportTarget[];
    readonly requiredEventAnchors: readonly string[];
    readonly requiredClaimGroups: readonly string[];
    readonly requiredContractEndpoints: readonly string[];
    readonly expectations: readonly ArcSecsLiveVerificationExpectation[];
    readonly speculativeBoundaryText: string;
}

const requiredExportTargets: readonly ArcSecsExportTarget[] = Object.freeze([
    "benchmarkJson",
    "calibrationCertificate",
    "qualityGate",
    "operatorRunbook",
    "evidencePacket",
    "researchBundle",
    "sceneJson"
]);

const requiredEventAnchors: readonly string[] = Object.freeze([
    "GW170817",
    "GW150914",
    "GW190521",
    "Supernova Light-Curve Stretch",
    "Hubble Tension",
    "GW190814",
    "Synthetic Nearby Binary Neutron Star",
    "Synthetic Void-Line-of-Sight Event",
    "Synthetic Dense-Filament Event",
    "Synthetic AGN-Disk Diffusion Event",
    "Synthetic Missing-Counterpart Event"
]);

const requiredClaimGroups: readonly string[] = Object.freeze([
    "Distance Without Lightyears",
    "Clockless Universal Progression",
    "Gravity-Wave Baseline",
    "Electromagnetic Light as Secondary Messenger",
    "Multi-Messenger Event Testing",
    "No-Spacetime Foundation Language"
]);

const speculativeBoundaryText: string = "Speculative research visualization: verify the live simulator as a hypothesis/model/test/compare/falsification path, not proof or settled physics.";

/** Builds the package-side checklist used before and during live ArcSecs.com verification. */
export class ArcSecsLiveVerificationReadinessAudit {
    /** Returns the required live verification matrix without reading DOM state or theme files. */
    public buildMatrix(): ArcSecsLiveVerificationMatrix {
        return Object.freeze({
            pluginVersion: "5.8.27",
            canonicalPluginFolder: "arcsecs-scientific-physics-engine",
            canonicalMainPluginFile: "arcsecs-scientific-physics-engine/arcsecs-scientific-physics-engine.php",
            primaryPages: Object.freeze([
                "https://arcsecs.com/arcsecs-physics-engine-demo/",
                "https://arcsecs.com/dark-matter-drive-simulator/"
            ]),
            requiredExportTargets,
            requiredEventAnchors,
            requiredClaimGroups,
            requiredContractEndpoints: Object.freeze(darkMatterDrivePublicContractEndpoints.map((endpoint) => endpoint.jsonUrl)),
            expectations: this.buildExpectations(),
            speculativeBoundaryText
        });
    }

    /** Checks whether every required export target is represented exactly once in a target list. */
    public hasAllExportTargets(targets: readonly string[]): boolean {
        return requiredExportTargets.every((target) => targets.indexOf(target) >= 0);
    }

    /** Checks whether every DarkMatterDrive and ArcSecs Event Theater anchor is represented. */
    public hasAllEventAnchors(events: readonly string[]): boolean {
        const normalizedEvents: readonly string[] = events.map((eventName) => eventName.toLowerCase());
        return requiredEventAnchors.every((eventName) => normalizedEvents.indexOf(eventName.toLowerCase()) >= 0);
    }

    /** Checks whether every public claim group is represented. */
    public hasAllClaimGroups(claims: readonly string[]): boolean {
        const normalizedClaims: readonly string[] = claims.map((claimName) => claimName.toLowerCase());
        return requiredClaimGroups.every((claimName) => normalizedClaims.indexOf(claimName.toLowerCase()) >= 0);
    }

    private buildExpectations(): readonly ArcSecsLiveVerificationExpectation[] {
        return Object.freeze([
            Object.freeze({ key: "scenario-selector", label: "Distance-Time Kernel mode appears and activates", pagePath: "/arcsecs-physics-engine-demo/", expectedEvidence: Object.freeze(["Distance-Time Kernel", "No-Lightyear Distance / Clockless Time", "center viewport redraw"]), failureMeaning: "The kernel is not reachable from the live simulator UI." }),
            Object.freeze({ key: "gravity-first-light-later", label: "Gravity-first / light-later visual is obvious", pagePath: "both", expectedEvidence: Object.freeze(["blue-white gravity wavefront", "red-gold photon wavefront", "delay bracket", "missing counterpart label"]), failureMeaning: "The central project claim is not visibly demonstrated." }),
            Object.freeze({ key: "event-theater-anchors", label: "Event Theater contains required anchors", pagePath: "/arcsecs-physics-engine-demo/", expectedEvidence: requiredEventAnchors, failureMeaning: "The live event selector is missing DarkMatterDrive or prior ArcSecs anchors." }),
            Object.freeze({ key: "delay-decomposition", label: "Delay decomposition is visible", pagePath: "both", expectedEvidence: Object.freeze(["source delay", "propagation delay", "environmental diffusion delay", "visibility threshold", "missing-counterpart status"]), failureMeaning: "The live page does not explain what caused the delay." }),
            Object.freeze({ key: "claim-map", label: "Framework Claim Map is wired", pagePath: "both", expectedEvidence: requiredClaimGroups, failureMeaning: "Claim cards cannot be used as the traceability bridge from demo to telemetry/export." }),
            Object.freeze({ key: "exports", label: "All seven export buttons produce valid JSON", pagePath: "/arcsecs-physics-engine-demo/", expectedEvidence: requiredExportTargets, failureMeaning: "The live export system is incomplete or no longer compatible with the public contract." }),
            Object.freeze({ key: "contract-endpoints", label: "DarkMatterDrive endpoint success/fallback state is visible in exports", pagePath: "/arcsecs-physics-engine-demo/", expectedEvidence: Object.freeze(darkMatterDrivePublicContractEndpoints.map((endpoint) => endpoint.publicLabel)), failureMeaning: "Endpoint fetch/fallback state is silently missing from exported evidence." })
        ]);
    }
}
