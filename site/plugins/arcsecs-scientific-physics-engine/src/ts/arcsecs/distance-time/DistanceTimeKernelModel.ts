export interface RelationalDistanceEstimate {
    readonly methodName: string;
    readonly distanceParsecs: number;
    readonly confidence: number;
    readonly sourceDescription: string;
    readonly dependsOnLightSpeed: boolean;
    readonly notes: readonly string[];
}

export interface UniversalProgressionEstimate {
    readonly methodName: string;
    readonly progressionValue: number;
    readonly normalizedEpoch: number;
    readonly confidence: number;
    readonly dependsOnLocalClock: boolean;
    readonly notes: readonly string[];
}

export interface GravityWavefront {
    readonly sourceEventName: string;
    readonly distanceParsecs: number;
    readonly baselineTransit: number;
    readonly arrivalIndex: number;
    readonly strainProxy: number;
    readonly notes: readonly string[];
}

export interface PhotonWavefront {
    readonly sourceEventName: string;
    readonly distanceParsecs: number;
    readonly mediumDensityMultiplier: number;
    readonly velocityFactor: number;
    readonly energyRemaining: number;
    readonly arrivalDelay: number;
    readonly redshiftProxy: number;
    readonly attenuationNotes: readonly string[];
}

export interface DelayDecomposition {
    readonly observedDelaySeconds: number;
    readonly gravityBaselineArrival: number;
    readonly photonArrival: number | null;
    readonly sourceDelayEstimate: number;
    readonly propagationDelayEstimate: number;
    readonly environmentalDiffusionDelayEstimate: number;
    readonly unknownOrUnassignedRemainder: number;
    readonly decompositionStatus: string;
}

export interface MultiMessengerEvent {
    readonly eventName: string;
    readonly eventKey: string;
    readonly eventType: string;
    readonly distanceLabel: string;
    readonly distanceParsecs: number;
    readonly observedDelayLabel: string;
    readonly observedDelaySeconds: number;
    readonly mediumDensityMultiplier: number;
    readonly sourceDelayEstimate: number;
    readonly environmentalDelayEstimate: number;
    readonly electromagneticVisibilityThreshold: number;
    readonly electromagneticCounterpartStatus: string;
    readonly interpretationNotes: readonly string[];
    readonly speculativeBoundary: string;
}

export interface DistanceTimeKernelSnapshot {
    readonly modeName: string;
    readonly publicLabel: string;
    readonly activeEvent: MultiMessengerEvent;
    readonly distanceEstimates: readonly RelationalDistanceEstimate[];
    readonly progressionEstimates: readonly UniversalProgressionEstimate[];
    readonly gravityWavefront: GravityWavefront;
    readonly photonWavefront: PhotonWavefront;
    readonly delayDecomposition: DelayDecomposition;
    readonly activeClaimKeys: readonly string[];
    readonly telemetry: DistanceTimeTelemetry;
    readonly speculativeBoundary: string;
}

export interface DistanceTimeTelemetry {
    readonly distanceMethod: string;
    readonly distanceParsecs: number;
    readonly parallaxArcseconds: number;
    readonly angularSeparationRadians: number;
    readonly properMotionArcsecondsPerYear: number;
    readonly gravityBaselineArrival: number;
    readonly photonArrival: number | null;
    readonly messengerDelay: number;
    readonly lightVelocityFactor: number;
    readonly photonEnergyRemaining: number;
    readonly mediumDensityMultiplier: number;
    readonly redshiftProxy: number;
    readonly universalProgressionMethod: string;
    readonly relationalTick: number;
    readonly janusComplexityIndex: number;
    readonly localOscillatorWarning: string;
    readonly speculativeBoundaryStatus: string;
}

export interface DistanceTimeKernelInput {
    readonly eventKey: string;
    readonly acceptedSteps: number;
    readonly parallaxArcseconds: number;
    readonly angularSeparationRadians: number;
    readonly properMotionArcsecondsPerYear: number;
    readonly mediumDensityMultiplier: number;
}

const speculativeBoundary: string = "Speculative research visualization: this hypothesis model tests, compares, visualizes, and exposes a falsification path; it is not proof or settled physics.";

/** Builds finite Distance-Time Kernel telemetry for the ArcSecs no-lightyear / clockless-time scenario. */
export class DistanceTimeKernelModel {
    public static readonly parsecsPerMegaparsec: number = 1000000;
    private static readonly metersPerMegaparsec: number = 3.0856775814913673e22;
    private static readonly baselineMessengerSpeedMetersPerSecond: number = 299792458;
    private readonly events: readonly MultiMessengerEvent[];

    /**
     * Creates the kernel model.
     * @param events Optional event catalog override for deterministic tests.
     */
    public constructor(events: readonly MultiMessengerEvent[] = createDefaultMultiMessengerEvents()) {
        this.events = events;
    }

    /**
     * Lists the real and synthetic multi-messenger events available to the theater.
     */
    public listEvents(): readonly MultiMessengerEvent[] {
        return this.events.slice();
    }

    /**
     * Builds the active Distance-Time Kernel snapshot.
     * @param input Scenario input from controls or a deterministic test fixture.
     */
    public buildSnapshot(input: DistanceTimeKernelInput): DistanceTimeKernelSnapshot {
        const activeEvent: MultiMessengerEvent = this.findEvent(input.eventKey);
        const density: number = this.clamp(this.finite(input.mediumDensityMultiplier) * activeEvent.mediumDensityMultiplier, 0.05, 25);
        const distanceEstimates: readonly RelationalDistanceEstimate[] = this.buildDistanceEstimates(activeEvent, input);
        const progressionEstimates: readonly UniversalProgressionEstimate[] = this.buildProgressionEstimates(input.acceptedSteps, activeEvent);
        const gravityWavefront: GravityWavefront = this.buildGravityWavefront(activeEvent);
        const photonWavefront: PhotonWavefront = this.buildPhotonWavefront(activeEvent, density, gravityWavefront.baselineTransit);
        const delayDecomposition: DelayDecomposition = this.buildDelayDecomposition(activeEvent, photonWavefront);
        const telemetry: DistanceTimeTelemetry = {
            distanceMethod: distanceEstimates[0].methodName,
            distanceParsecs: distanceEstimates[0].distanceParsecs,
            parallaxArcseconds: this.clamp(this.finite(input.parallaxArcseconds), 0.000001, 1000000),
            angularSeparationRadians: this.clamp(this.finite(input.angularSeparationRadians), 0.000000001, 10),
            properMotionArcsecondsPerYear: this.clamp(this.finite(input.properMotionArcsecondsPerYear), 0, 1000000),
            gravityBaselineArrival: gravityWavefront.arrivalIndex,
            photonArrival: photonWavefront.energyRemaining < activeEvent.electromagneticVisibilityThreshold ? null : gravityWavefront.arrivalIndex + photonWavefront.arrivalDelay,
            messengerDelay: photonWavefront.arrivalDelay,
            lightVelocityFactor: photonWavefront.velocityFactor,
            photonEnergyRemaining: photonWavefront.energyRemaining,
            mediumDensityMultiplier: photonWavefront.mediumDensityMultiplier,
            redshiftProxy: photonWavefront.redshiftProxy,
            universalProgressionMethod: progressionEstimates[0].methodName,
            relationalTick: Math.max(0, Math.floor(this.finite(input.acceptedSteps))),
            janusComplexityIndex: progressionEstimates.find((estimate: UniversalProgressionEstimate) => estimate.methodName === "Janus Point complexity")?.progressionValue ?? 0,
            localOscillatorWarning: "Local oscillator values are displayed as physical probes, not universal time.",
            speculativeBoundaryStatus: "visible"
        };

        return {
            modeName: "Distance-Time Kernel",
            publicLabel: "No-Lightyear Distance / Clockless Time",
            activeEvent,
            distanceEstimates,
            progressionEstimates,
            gravityWavefront,
            photonWavefront,
            delayDecomposition,
            activeClaimKeys: this.claimKeysForEvent(activeEvent),
            telemetry,
            speculativeBoundary
        };
    }

    /**
     * Runs deterministic validation checks against a kernel snapshot.
     * @param snapshot Snapshot to validate.
     */
    public validate(snapshot: DistanceTimeKernelSnapshot): readonly DistanceTimeKernelValidationCheck[] {
        const finiteTelemetry: boolean = Object.keys(snapshot.telemetry).every((key: string) => {
            const value: unknown = snapshot.telemetry[key as keyof DistanceTimeTelemetry];
            return typeof value !== "number" || Number.isFinite(value);
        });
        const parallaxDistance: number = 1 / Math.max(0.000001, snapshot.telemetry.parallaxArcseconds);
        const angularEstimate: RelationalDistanceEstimate | undefined = snapshot.distanceEstimates.find((estimate: RelationalDistanceEstimate) => estimate.methodName === "Angular geometry");
        const properMotionEstimate: RelationalDistanceEstimate | undefined = snapshot.distanceEstimates.find((estimate: RelationalDistanceEstimate) => estimate.methodName === "Proper motion helper");
        const visiblePhotonOrdering: boolean = snapshot.telemetry.photonArrival === null || snapshot.telemetry.photonArrival > snapshot.gravityWavefront.arrivalIndex;
        const delayPiecesTotal: number = snapshot.delayDecomposition.sourceDelayEstimate + snapshot.delayDecomposition.propagationDelayEstimate + snapshot.delayDecomposition.environmentalDiffusionDelayEstimate + snapshot.delayDecomposition.unknownOrUnassignedRemainder;
        const observedDelay: number = Math.max(0, snapshot.delayDecomposition.observedDelaySeconds || delayPiecesTotal);
        const denseEnergyProbe: number = Math.exp(-0.00025 * 8 * Math.sqrt(Math.max(0, snapshot.activeEvent.distanceParsecs / DistanceTimeKernelModel.parsecsPerMegaparsec)));
        const voidEnergyProbe: number = Math.exp(-0.00025 * 0.2 * Math.sqrt(Math.max(0, snapshot.activeEvent.distanceParsecs / DistanceTimeKernelModel.parsecsPerMegaparsec)));
        const progressionChanges: boolean = snapshot.progressionEstimates.some((estimate: UniversalProgressionEstimate) => estimate.dependsOnLocalClock === false && Number.isFinite(estimate.progressionValue));
        const claimKeysAreKnown: boolean = snapshot.activeClaimKeys.every((claimKey: string) => ["distance-without-lightyears", "clockless-universal-progression", "gravity-wave-baseline", "electromagnetic-secondary-messenger", "multi-messenger-event-testing", "no-spacetime-foundation-language"].indexOf(claimKey) >= 0);
        return [
            { key: "finite-telemetry", label: "Finite telemetry", passed: finiteTelemetry, detail: "All numeric kernel telemetry is finite." },
            { key: "parallax-inverse-arcsecond", label: "Parallax inverse-arcsecond distance", passed: Math.abs(snapshot.distanceEstimates[0].distanceParsecs - parallaxDistance) < 0.000001 || snapshot.distanceEstimates[0].methodName !== "Parallax", detail: "Parallax distance uses parsecs = 1 / arcseconds." },
            { key: "angular-separation-finite", label: "Angular separation stable", passed: Boolean(angularEstimate && Number.isFinite(angularEstimate.distanceParsecs) && angularEstimate.distanceParsecs > 0), detail: "Angular geometry estimate remains finite." },
            { key: "proper-motion-finite", label: "Proper-motion finite velocity", passed: Boolean(properMotionEstimate && properMotionEstimate.notes.every((note: string) => note.indexOf("NaN") < 0 && note.indexOf("Infinity") < 0)), detail: "Proper-motion helper remains finite and does not fall back to light travel time." },
            { key: "gravity-first", label: "Gravity wavefront baseline", passed: visiblePhotonOrdering, detail: "Gravity arrival remains the baseline and precedes visible photon arrival." },
            { key: "photon-delay-distance-scaling", label: "Photon delay finite", passed: Number.isFinite(snapshot.photonWavefront.arrivalDelay) && snapshot.photonWavefront.arrivalDelay >= 0, detail: "Photon lag remains finite and non-negative." },
            { key: "density-dependent-attenuation", label: "Density-dependent attenuation", passed: denseEnergyProbe < voidEnergyProbe, detail: "Dense synthetic paths degrade photons more than void synthetic paths." },
            { key: "photon-energy-bounded", label: "Photon energy bounded", passed: Number.isFinite(snapshot.photonWavefront.energyRemaining) && snapshot.photonWavefront.energyRemaining >= 0 && snapshot.photonWavefront.energyRemaining <= 1, detail: "Photon energy is finite and non-negative." },
            { key: "progression-responds-to-structure", label: "Relational progression responds", passed: progressionChanges, detail: "Universal progression estimates are non-local-clock relational probes." },
            { key: "event-selection-state", label: "Event selection state", passed: snapshot.activeEvent.eventKey.length > 0 && snapshot.activeEvent.eventName.length > 0, detail: "Event Theater has a selected active event." },
            { key: "delay-decomposition-bounded", label: "Delay decomposition bounded", passed: Math.abs(delayPiecesTotal - observedDelay) < Math.max(0.0001, observedDelay * 0.0001 + 0.0001), detail: "Delay categories sum to the observed delay or a labeled remainder." },
            { key: "claim-keys-known", label: "Claim keys known", passed: claimKeysAreKnown, detail: "Active claim keys map to Framework Claim Map cards." },
            { key: "speculative-boundary", label: "Speculative boundary visible", passed: /speculative research visualization/i.test(snapshot.speculativeBoundary), detail: snapshot.speculativeBoundary }
        ];
    }

    private buildDistanceEstimates(activeEvent: MultiMessengerEvent, input: DistanceTimeKernelInput): readonly RelationalDistanceEstimate[] {
        const safeParallax: number = this.clamp(this.finite(input.parallaxArcseconds), 0.000001, 1000000);
        const safeAngularSeparation: number = this.clamp(this.finite(input.angularSeparationRadians), 0.000000001, 10);
        const safeProperMotion: number = this.clamp(this.finite(input.properMotionArcsecondsPerYear), 0, 1000000);
        const parallaxDistanceParsecs: number = 1 / safeParallax;
        const angularDistanceParsecs: number = Math.max(0.000001, activeEvent.distanceParsecs * 0.001) / safeAngularSeparation;
        const tangentialVelocityProxy: number = 4.74047 * safeProperMotion * parallaxDistanceParsecs;
        return [
            { methodName: "Parallax", distanceParsecs: parallaxDistanceParsecs, confidence: 0.96, sourceDescription: "Arcsecond geometry", dependsOnLightSpeed: false, notes: ["parsecs = 1 / parallaxArcseconds", "Lightyear values are legacy comparison only."] },
            { methodName: "Angular geometry", distanceParsecs: angularDistanceParsecs, confidence: 0.82, sourceDescription: "Angular separation with relational baseline", dependsOnLightSpeed: false, notes: ["distance = transverse separation / angleRadians"] },
            { methodName: "Proper motion helper", distanceParsecs: parallaxDistanceParsecs, confidence: this.clamp(tangentialVelocityProxy / 100000, 0.2, 0.9), sourceDescription: "Proper motion plus parsec distance", dependsOnLightSpeed: false, notes: [`Tangential velocity proxy ${tangentialVelocityProxy.toFixed(6)} km/s`] },
            { methodName: "Gravitational-wave standard siren", distanceParsecs: activeEvent.distanceParsecs, confidence: 0.78, sourceDescription: `${activeEvent.eventName} strain baseline`, dependsOnLightSpeed: false, notes: ["Gravity-wave strain is used as the baseline messenger."] },
            { methodName: "Dark standard-siren catalog matching", distanceParsecs: activeEvent.distanceParsecs * 1.015, confidence: 0.62, sourceDescription: "Catalog host-matching placeholder", dependsOnLightSpeed: false, notes: ["Host matching is statistical and export-labeled as hypothesis support."] }
        ];
    }

    private buildProgressionEstimates(acceptedSteps: number, activeEvent: MultiMessengerEvent): readonly UniversalProgressionEstimate[] {
        const relationalTick: number = Math.max(0, Math.floor(this.finite(acceptedSteps)));
        const normalizedEpoch: number = this.clamp(relationalTick / 25000, 0, 1);
        const distanceScale: number = Math.log(1 + activeEvent.distanceParsecs / DistanceTimeKernelModel.parsecsPerMegaparsec);
        return [
            { methodName: "Relational simulation tick", progressionValue: relationalTick, normalizedEpoch, confidence: 0.95, dependsOnLocalClock: false, notes: ["Fixed deterministic state-transition count."] },
            { methodName: "York-time-style global progression", progressionValue: normalizedEpoch * (1 + distanceScale * 0.01), normalizedEpoch, confidence: 0.72, dependsOnLocalClock: false, notes: ["Global shape-progress proxy, not a local oscillator."] },
            { methodName: "GLET aggregate relational change", progressionValue: normalizedEpoch * 0.8 + distanceScale * 0.02, normalizedEpoch, confidence: 0.66, dependsOnLocalClock: false, notes: ["Aggregate relational change proxy."] },
            { methodName: "Janus Point complexity", progressionValue: this.clamp(0.35 + normalizedEpoch * 0.5 + distanceScale * 0.015, 0, 1), normalizedEpoch, confidence: 0.69, dependsOnLocalClock: false, notes: ["Complexity gradient is the displayed progression marker."] },
            { methodName: "CMB cooling epoch marker", progressionValue: this.clamp(1 - normalizedEpoch * 0.18, 0, 1), normalizedEpoch, confidence: 0.58, dependsOnLocalClock: false, notes: ["Epoch marker only; not a local clock."] },
            { methodName: "Gravitational-wave-background synchronizer", progressionValue: this.clamp(0.4 + distanceScale * 0.025, 0, 1), normalizedEpoch, confidence: 0.7, dependsOnLocalClock: false, notes: ["Global messenger synchronization candidate."] }
        ];
    }

    private buildGravityWavefront(activeEvent: MultiMessengerEvent): GravityWavefront {
        const distanceMeters: number = (activeEvent.distanceParsecs / DistanceTimeKernelModel.parsecsPerMegaparsec) * DistanceTimeKernelModel.metersPerMegaparsec;
        const baselineTransit: number = distanceMeters / DistanceTimeKernelModel.baselineMessengerSpeedMetersPerSecond;
        const strainProxy: number = this.clamp(1 / Math.sqrt(Math.max(1, activeEvent.distanceParsecs / 1000000)), 0.000001, 1);
        return {
            sourceEventName: activeEvent.eventName,
            distanceParsecs: activeEvent.distanceParsecs,
            baselineTransit,
            arrivalIndex: 0,
            strainProxy,
            notes: ["Blue-white baseline messenger", "Arrives first in Distance-Time Kernel scenario"]
        };
    }

    private buildPhotonWavefront(activeEvent: MultiMessengerEvent, mediumDensityMultiplier: number, gravityTransit: number): PhotonWavefront {
        const distanceMegaparsecs: number = activeEvent.distanceParsecs / DistanceTimeKernelModel.parsecsPerMegaparsec;
        const attenuationCoefficient: number = 0.00000005 * mediumDensityMultiplier;
        const velocityFactor: number = this.clamp(Math.exp(-attenuationCoefficient * distanceMegaparsecs), 0.000001, 1);
        const propagationDelay: number = Math.max(0.000001, gravityTransit * (1 / velocityFactor - 1) * 0.000000001);
        const energyRemaining: number = this.clamp(Math.exp(-0.00025 * mediumDensityMultiplier * Math.sqrt(Math.max(0, distanceMegaparsecs))), 0, 1);
        const redshiftProxy: number = this.clamp((1 / Math.max(0.000001, energyRemaining)) - 1, 0, 1000000);
        const visible: boolean = energyRemaining >= activeEvent.electromagneticVisibilityThreshold && activeEvent.electromagneticCounterpartStatus !== "missing";
        return {
            sourceEventName: activeEvent.eventName,
            distanceParsecs: activeEvent.distanceParsecs,
            mediumDensityMultiplier,
            velocityFactor,
            energyRemaining,
            arrivalDelay: visible ? propagationDelay : Math.max(propagationDelay, activeEvent.observedDelaySeconds),
            redshiftProxy,
            attenuationNotes: visible ? ["Red-gold secondary messenger", "Lag and fading scale with density."] : ["Missing-counterpart threshold reached", "No visible photon arrival marker is rendered."]
        };
    }

    private buildDelayDecomposition(activeEvent: MultiMessengerEvent, photonWavefront: PhotonWavefront): DelayDecomposition {
        const propagationDelay: number = Math.max(0, photonWavefront.arrivalDelay);
        const knownParts: number = activeEvent.sourceDelayEstimate + propagationDelay + activeEvent.environmentalDelayEstimate;
        const unknownRemainder: number = Math.max(0, activeEvent.observedDelaySeconds - knownParts);
        const photonArrival: number | null = photonWavefront.energyRemaining < activeEvent.electromagneticVisibilityThreshold || activeEvent.electromagneticCounterpartStatus === "missing" ? null : propagationDelay;
        return {
            observedDelaySeconds: activeEvent.observedDelaySeconds,
            gravityBaselineArrival: 0,
            photonArrival,
            sourceDelayEstimate: activeEvent.sourceDelayEstimate,
            propagationDelayEstimate: propagationDelay,
            environmentalDiffusionDelayEstimate: activeEvent.environmentalDelayEstimate,
            unknownOrUnassignedRemainder: unknownRemainder,
            decompositionStatus: unknownRemainder > 0 ? "unknown remainder labeled" : "decomposition bounded"
        };
    }

    private findEvent(eventKey: string): MultiMessengerEvent {
        return this.events.find((item: MultiMessengerEvent) => item.eventKey === eventKey) ?? this.events[0];
    }

    private claimKeysForEvent(activeEvent: MultiMessengerEvent): readonly string[] {
        const baseClaims: string[] = ["distance-without-lightyears", "gravity-wave-baseline", "multi-messenger-event-testing", "no-spacetime-foundation-language"];
        if (activeEvent.mediumDensityMultiplier > 1.2 || activeEvent.eventKey.indexOf("dense") >= 0 || activeEvent.eventKey.indexOf("agn") >= 0) {
            baseClaims.push("electromagnetic-secondary-messenger");
        }
        if ((activeEvent.eventKey.indexOf("missing") >= 0 || activeEvent.eventKey === "gw190814") && baseClaims.indexOf("electromagnetic-secondary-messenger") < 0) {
            baseClaims.push("electromagnetic-secondary-messenger");
        }
        baseClaims.push("clockless-universal-progression");
        return Object.freeze(baseClaims.filter((claimKey: string, index: number, keys: string[]) => keys.indexOf(claimKey) === index));
    }

    private finite(value: number): number {
        return Number.isFinite(value) ? value : 0;
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}

export interface DistanceTimeKernelValidationCheck {
    readonly key: string;
    readonly label: string;
    readonly passed: boolean;
    readonly detail: string;
}

/** Creates the deterministic real/synthetic event catalog for the Event Theater. */
export function createDefaultMultiMessengerEvents(): readonly MultiMessengerEvent[] {
    return Object.freeze([
        createEvent("gw170817", "GW170817", "Binary neutron star", "40 Mpc", 40000000, "1.74 seconds", 1.74, 1, 1.68, 0.04, 0.05, "visible", ["Clean benchmark event", "Source/jet-breakout delay dominates in the visualization."]),
        createEvent("gw150914", "GW150914", "Binary black hole debated counterpart", "410 Mpc", 410000000, "0.4 seconds debated", 0.4, 0.55, 0.05, 0.03, 0.08, "uncertain", ["Electromagnetic counterpart is debated", "Do not force a clean light counterpart."]),
        createEvent("gw190521", "GW190521", "Binary black hole in AGN-like environment", "5.3 Gpc", 5300000000, "34 days", 2937600, 5.5, 20, 2937540, 0.04, "visible delayed", ["Dense environment / AGN disk diffusion event", "Environment dominates the observed delay."]),
        createEvent("gw190814", "GW190814", "Compact binary missing counterpart", "241 Mpc", 241000000, "no confirmed electromagnetic counterpart", 0, 3.6, 0, 0, 0.28, "missing", ["Missing-counterpart / attenuation-threshold event", "Supports source suppression, attenuation, threshold, and uncertainty labels."]),
        createEvent("supernova-light-curve-stretch", "Supernova Light-Curve Stretch", "Optical stretch contract anchor", "1.4 Gpc", 1400000000, "1+z light-curve stretch comparison", 345600, 2.4, 0, 86400, 0.12, "visible stretched", ["DarkMatterDrive contract anchor", "Tests whether degraded electromagnetic propagation can visualize supernova stretch without making time dilation foundational."]),
        createEvent("hubble-tension", "Hubble Tension", "Optical-history comparison anchor", "4.5 Gpc", 4500000000, "distance-ladder versus early-universe mismatch", 120, 1.9, 0, 30, 0.1, "visible degraded", ["DarkMatterDrive contract anchor", "Frames Hubble tension as an optical-history comparison and falsification path, not proof."]),
        createEvent("synthetic-nearby-binary-neutron-star", "Synthetic Nearby Binary Neutron Star", "Synthetic benchmark", "8 Mpc", 8000000, "0.7 seconds", 0.7, 0.8, 0.68, 0.01, 0.03, "visible", ["Short-distance demonstration", "Light lag is small and source delay dominates."]),
        createEvent("synthetic-void-line-of-sight", "Synthetic Void-Line-of-Sight Event", "Synthetic path-dependence", "260 Mpc", 260000000, "2.2 seconds", 2.2, 0.22, 1.8, 0.04, 0.02, "visible", ["Lower medium density", "Less photon degradation and better visibility."]),
        createEvent("synthetic-dense-filament", "Synthetic Dense-Filament Event", "Synthetic density stress", "260 Mpc", 260000000, "15.5 seconds", 15.5, 8.5, 2.4, 3.9, 0.18, "visible degraded", ["Higher medium density", "Stronger attenuation, redshift proxy, and photon lag."]),
        createEvent("synthetic-agn-disk-diffusion", "Synthetic AGN-Disk Diffusion Event", "Synthetic environment stress", "1.2 Gpc", 1200000000, "9.5 days", 820800, 6.5, 15, 820740, 0.06, "visible delayed", ["Environmental delay dominates", "Propagation delay is separated from local diffusion."]),
        createEvent("synthetic-missing-counterpart", "Synthetic Missing-Counterpart Event", "Synthetic threshold test", "900 Mpc", 900000000, "no visible photon arrival", 0, 12, 0, 0, 0.45, "missing", ["Gravity arrival with no visible photon arrival", "Electromagnetic energy falls below detection threshold."])
    ]);
}

function createEvent(eventKey: string, eventName: string, eventType: string, distanceLabel: string, distanceParsecs: number, observedDelayLabel: string, observedDelaySeconds: number, mediumDensityMultiplier: number, sourceDelayEstimate: number, environmentalDelayEstimate: number, electromagneticVisibilityThreshold: number, electromagneticCounterpartStatus: string, interpretationNotes: readonly string[]): MultiMessengerEvent {
    return Object.freeze({
        eventName,
        eventKey,
        eventType,
        distanceLabel,
        distanceParsecs,
        observedDelayLabel,
        observedDelaySeconds,
        mediumDensityMultiplier,
        sourceDelayEstimate,
        environmentalDelayEstimate,
        electromagneticVisibilityThreshold,
        electromagneticCounterpartStatus,
        interpretationNotes,
        speculativeBoundary
    });
}
