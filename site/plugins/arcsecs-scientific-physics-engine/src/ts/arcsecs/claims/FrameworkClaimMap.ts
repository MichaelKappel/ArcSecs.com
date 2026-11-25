import type { DistanceTimeKernelSnapshot } from "../distance-time/DistanceTimeKernelModel";

export interface FrameworkClaimCard {
    readonly claimKey: string;
    readonly claimTitle: string;
    readonly plainEnglishStatement: string;
    readonly simulatorBehavior: string;
    readonly requiredTelemetry: readonly string[];
    readonly validationChecks: readonly string[];
    readonly evidenceCategory: string;
    readonly falsificationCondition: string;
    readonly speculativeBoundaryNote: string;
    readonly relatedScenarioNames: readonly string[];
    readonly exportInclusionStatus: string;
    readonly visualTarget: string;
}

export interface FrameworkClaimMapSelection {
    readonly activeClaimKey: string;
    readonly activeClaim: FrameworkClaimCard;
    readonly viewportHighlightTargets: readonly string[];
    readonly telemetryHighlightTargets: readonly string[];
    readonly validationHighlightTargets: readonly string[];
    readonly exportEvidenceMarked: boolean;
}

export interface FrameworkClaimMapExportRecord {
    readonly claimKey: string;
    readonly claimTitle: string;
    readonly demonstratedStatus: string;
    readonly scenarioUsed: string;
    readonly telemetrySnapshot: Readonly<Record<string, number | string | boolean | null>>;
    readonly validationSnapshot: readonly string[];
    readonly falsificationWarning: string;
    readonly speculativeBoundaryText: string;
}

/** Provides traceability from ArcSecs claims to visuals, telemetry, validation, exports, and falsification paths. */
export class FrameworkClaimMap {
    private readonly claims: readonly FrameworkClaimCard[];

    /**
     * Creates a claim map.
     * @param claims Optional claim list override for deterministic tests.
     */
    public constructor(claims: readonly FrameworkClaimCard[] = createDefaultFrameworkClaimCards()) {
        this.claims = claims;
    }

    /** Lists all claim cards. */
    public listClaims(): readonly FrameworkClaimCard[] {
        return this.claims.slice();
    }

    /**
     * Selects a claim card and returns the UI/validation/export targets to emphasize.
     * @param claimKey Claim key from the claim card list.
     */
    public selectClaim(claimKey: string): FrameworkClaimMapSelection {
        const activeClaim: FrameworkClaimCard = this.claims.find((claim: FrameworkClaimCard) => claim.claimKey === claimKey) ?? this.claims[0];
        return Object.freeze({
            activeClaimKey: activeClaim.claimKey,
            activeClaim,
            viewportHighlightTargets: Object.freeze([activeClaim.visualTarget]),
            telemetryHighlightTargets: Object.freeze(activeClaim.requiredTelemetry.slice()),
            validationHighlightTargets: Object.freeze(activeClaim.validationChecks.slice()),
            exportEvidenceMarked: true
        });
    }

    /**
     * Builds export records from a kernel snapshot.
     * @param snapshot Current Distance-Time Kernel snapshot.
     */
    public buildExportRecords(snapshot: DistanceTimeKernelSnapshot): readonly FrameworkClaimMapExportRecord[] {
        const activeClaimKeys: readonly string[] = snapshot.activeClaimKeys;
        return Object.freeze(this.claims.map((claim: FrameworkClaimCard) => Object.freeze({
            claimKey: claim.claimKey,
            claimTitle: claim.claimTitle,
            demonstratedStatus: activeClaimKeys.indexOf(claim.claimKey) >= 0 ? "demonstrated-in-current-run" : "available-not-active",
            scenarioUsed: snapshot.modeName,
            telemetrySnapshot: Object.freeze({
                distanceParsecs: snapshot.telemetry.distanceParsecs,
                messengerDelay: snapshot.telemetry.messengerDelay,
                photonEnergyRemaining: snapshot.telemetry.photonEnergyRemaining,
                redshiftProxy: snapshot.telemetry.redshiftProxy,
                mediumDensityMultiplier: snapshot.telemetry.mediumDensityMultiplier,
                localOscillatorWarning: snapshot.telemetry.localOscillatorWarning,
                speculativeBoundaryStatus: snapshot.telemetry.speculativeBoundaryStatus
            }),
            validationSnapshot: claim.validationChecks.slice(),
            falsificationWarning: claim.falsificationCondition,
            speculativeBoundaryText: claim.speculativeBoundaryNote
        })));
    }
}

/** Creates the required ArcSecs Framework Claim Map cards. */
export function createDefaultFrameworkClaimCards(): readonly FrameworkClaimCard[] {
    const boundary: string = "Speculative research visualization and falsification path, not proof or settled physics.";
    return Object.freeze([
        createClaim("distance-without-lightyears", "Distance Without Lightyears", "ArcSecs does not use lightyears as a foundational distance unit because light travel distance assumes stable electromagnetic propagation speed.", "Show parallax triangle, arcsecond overlay, angular baseline, and relational node-distance overlay.", ["Distance method", "Distance in parsecs", "Parallax angle", "Angular separation", "Proper motion", "dependsOnLightSpeed: false"], ["Parallax inverse-arcsecond distance", "Angular separation stability", "Proper-motion finite velocity", "No electromagnetic travel-time dependency"], "distance-kernel", "The simulator cannot produce stable distance estimates without falling back to lightyears or electromagnetic travel time.", boundary, ["Distance-Time Kernel", "Parallax Calibration"], "included", "parallax-overlay"),
        createClaim("clockless-universal-progression", "Clockless Universal Progression", "ArcSecs treats local atomic clocks as physical probes, not universal time.", "Show a global progression strip with local oscillator drift underneath.", ["Progression method", "Relational tick", "Janus complexity index", "CMB epoch proxy", "Gravitational background synchronizer", "dependsOnLocalClock: false"], ["Progression changes when relational structure changes", "Local oscillator values labeled as probes", "No cesium clock is universal time"], "progression-kernel", "The simulator cannot keep a stable progression model unless it relies on local oscillator time.", boundary, ["Distance-Time Kernel", "Absolute Time / Quantum Oscillator Damping"], "included", "progression-strip"),
        createClaim("gravity-wave-baseline", "Gravity-Wave Baseline", "For deep events, gravity-wave propagation acts as the cleaner baseline messenger.", "Show a blue-white gravity wavefront crossing the scene cleanly and reaching the observer first.", ["Source event", "Gravity arrival index", "Strain proxy", "Baseline transit", "Distance parsecs"], ["GravityWavefront arrival baseline", "Gravity before photon", "Finite gravity baseline values"], "wavefront-baseline", "Gravity arrival cannot be cleanly separated from electromagnetic arrival or does not produce a stable baseline.", boundary, ["Distance-Time Kernel", "Multi-Messenger Event Theater"], "included", "gravity-wavefront"),
        createClaim("electromagnetic-secondary-messenger", "Electromagnetic Light as Secondary Messenger", "Light remains useful evidence, but it is not the ruler or the clock.", "Show a red-gold photon wavefront lagging, fading, stretching, or red-shifting with distance and density.", ["Photon arrival", "Delay from gravity baseline", "Velocity factor", "Energy remaining", "Redshift proxy", "Medium density multiplier"], ["Photon delay increases with distance", "Photon attenuation increases with density", "Energy finite and non-negative", "No NaN or Infinity"], "photon-degradation", "Photon delay, attenuation, or redshift does not change with distance or medium-density settings.", boundary, ["Distance-Time Kernel", "Tired-Light Photon Energy Ledger"], "included", "photon-wavefront"),
        createClaim("multi-messenger-event-testing", "Multi-Messenger Event Testing", "Known and synthetic events separate source delay, propagation delay, environmental diffusion delay, and missing-counterpart status.", "Event selector updates gravity timing, photon timing, density path, source delay, propagation delay, environment delay, and visibility.", ["Event name", "Event type", "Distance parsecs", "Observed delay", "Source delay", "Propagation delay", "Environmental delay", "Visibility status"], ["Event telemetry finite", "Event switch updates viewport", "Delay categories remain labeled", "Missing-counterpart supported"], "event-theater", "The model cannot distinguish intrinsic source delay from propagation delay, or all events collapse into one explanation.", boundary, ["Distance-Time Kernel", "Multi-Messenger Event Theater"], "included", "event-theater"),
        createClaim("no-spacetime-foundation-language", "No-Spacetime Foundation Language", "ArcSecs may compare itself to standard explanations, but active model text does not present spacetime, metric expansion, literal time dilation, invariant electromagnetic light speed, local atomic clocks, or warp bubbles as foundations.", "Show standard explanation versus ArcSecs simulation interpretation with the active ArcSecs side clearly marked.", ["Foundation label", "Rejected construct label", "ArcSecs replacement concept", "Speculative boundary status"], ["Speculative-boundary wording present", "Hypothesis/model/test/compare wording present", "No proof or settled-physics framing"], "language-guardrail", "Public text implies the simulator proves replacement physics or presents old spacetime constructs as foundations.", boundary, ["Distance-Time Kernel", "All public ArcSecs modes"], "included", "language-boundary")
    ]);
}

function createClaim(claimKey: string, claimTitle: string, plainEnglishStatement: string, simulatorBehavior: string, requiredTelemetry: readonly string[], validationChecks: readonly string[], evidenceCategory: string, falsificationCondition: string, speculativeBoundaryNote: string, relatedScenarioNames: readonly string[], exportInclusionStatus: string, visualTarget: string): FrameworkClaimCard {
    return Object.freeze({ claimKey, claimTitle, plainEnglishStatement, simulatorBehavior, requiredTelemetry: Object.freeze(requiredTelemetry.slice()), validationChecks: Object.freeze(validationChecks.slice()), evidenceCategory, falsificationCondition, speculativeBoundaryNote, relatedScenarioNames: Object.freeze(relatedScenarioNames.slice()), exportInclusionStatus, visualTarget });
}
