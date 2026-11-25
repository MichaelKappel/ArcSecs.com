export interface DistanceTimeUiWiringAuditInput {
    readonly scenarioOptions: readonly string[];
    readonly eventOptions: readonly string[];
    readonly claimKeys: readonly string[];
    readonly activeScenario: string;
    readonly activeEventKey: string;
    readonly activeClaimKey: string;
    readonly exportPacket: Readonly<Record<string, unknown>>;
    readonly viewportPreviewLabel: string;
    readonly hasClaimViewportFocusBanner: boolean;
    readonly hasMobileDelayStackFallback: boolean;
    readonly hasScrollableCompactDock: boolean;
    readonly hasImmediateClaimViewportRedraw: boolean;
}

export interface DistanceTimeUiWiringAuditCheck {
    readonly key: string;
    readonly label: string;
    readonly passed: boolean;
    readonly detail: string;
}

export interface DistanceTimeUiWiringAuditReport {
    readonly ready: boolean;
    readonly checks: readonly DistanceTimeUiWiringAuditCheck[];
    readonly speculativeBoundary: string;
}

const requiredEventKeys: readonly string[] = Object.freeze([
    "gw170817",
    "gw150914",
    "gw190521",
    "gw190814",
    "synthetic-nearby-binary-neutron-star",
    "synthetic-void-line-of-sight",
    "synthetic-dense-filament",
    "synthetic-agn-disk-diffusion",
    "synthetic-missing-counterpart"
]);

const requiredClaimKeys: readonly string[] = Object.freeze([
    "distance-without-lightyears",
    "clockless-universal-progression",
    "gravity-wave-baseline",
    "electromagnetic-secondary-messenger",
    "multi-messenger-event-testing",
    "no-spacetime-foundation-language"
]);

/** Audits browser-facing Distance-Time Kernel wiring without depending on the DOM. */
export class DistanceTimeUiWiringAudit {
    private readonly speculativeBoundary: string = "Speculative research visualization: UI wiring checks verify scenario, event, claim, viewport, validation, and export paths; they do not prove the physics model.";

    /**
     * Builds a deterministic readiness report for Distance-Time UI wiring.
     * @param input Scenario, event, claim, export, and viewport labels collected from the plugin shell.
     */
    public audit(input: DistanceTimeUiWiringAuditInput): DistanceTimeUiWiringAuditReport {
        const checks: readonly DistanceTimeUiWiringAuditCheck[] = Object.freeze([
            this.check("scenario-selector", "Scenario selector contains Distance-Time Kernel", input.scenarioOptions.indexOf("distanceTimeKernel") >= 0, "The selector can activate Distance-Time Kernel."),
            this.check("active-scenario", "Active scenario preview", input.activeScenario === "distanceTimeKernel", "The viewport preview should prefer the selected scenario over stale worker results."),
            this.check("event-options", "Event selector complete", requiredEventKeys.every((eventKey: string) => input.eventOptions.indexOf(eventKey) >= 0), "Real and synthetic Event Theater options are present."),
            this.check("active-event-known", "Active event known", requiredEventKeys.indexOf(input.activeEventKey) >= 0, "Selected event maps to a seeded Event Theater record."),
            this.check("claim-options", "Claim cards complete", requiredClaimKeys.every((claimKey: string) => input.claimKeys.indexOf(claimKey) >= 0), "All Framework Claim Map groups are represented."),
            this.check("active-claim-known", "Active claim known", requiredClaimKeys.indexOf(input.activeClaimKey) >= 0, "Claim-card click state maps to a known claim."),
            this.check("viewport-preview", "Viewport preview label", /gravity/i.test(input.viewportPreviewLabel) && /light/i.test(input.viewportPreviewLabel), "Viewport copy shows gravity-first / light-later behavior."),
            this.check("export-kernel", "Export contains kernel", this.hasObject(input.exportPacket, "distanceTimeKernel"), "Exports include Distance-Time Kernel data."),
            this.check("export-claim-map", "Export contains claim map", this.hasObject(input.exportPacket, "frameworkClaimMap"), "Exports include Framework Claim Map data."),
            this.check("export-event-theater", "Export contains event theater", this.hasObject(input.exportPacket, "multiMessengerEventTheater"), "Exports include Multi-Messenger Event Theater data."),
            this.check("claim-viewport-focus-banner", "Claim viewport focus banner", input.hasClaimViewportFocusBanner, "Claim-card clicks have a browser-visible viewport focus cue."),
            this.check("mobile-delay-stack-fallback", "Mobile delay stack fallback", input.hasMobileDelayStackFallback, "Delay decomposition collapses cleanly at mobile widths."),
            this.check("compact-dock-scroll", "Compact dock scroll contract", input.hasScrollableCompactDock, "Dark Matter Drive compact dock remains readable and scrollable."),
            this.check("claim-redraws-viewport", "Claim click redraws viewport", input.hasImmediateClaimViewportRedraw, "Claim-card clicks refresh the center viewport without waiting for worker completion.")
        ]);
        return Object.freeze({ ready: checks.every((check: DistanceTimeUiWiringAuditCheck) => check.passed), checks, speculativeBoundary: this.speculativeBoundary });
    }

    private check(key: string, label: string, passed: boolean, detail: string): DistanceTimeUiWiringAuditCheck {
        return Object.freeze({ key, label, passed, detail });
    }

    private hasObject(packet: Readonly<Record<string, unknown>>, key: string): boolean {
        return Object.prototype.hasOwnProperty.call(packet, key) && packet[key] !== null && typeof packet[key] === "object";
    }
}
