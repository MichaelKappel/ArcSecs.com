export type ParameterGuideValue = string | number | boolean;

export interface ParameterGuidePreset {
    readonly presetId: string;
    readonly title: string;
    readonly scenario: string;
    readonly audience: "visitor" | "physicist" | "engineer";
    readonly question: string;
    readonly expectedResult: string;
    readonly explanation: string;
    readonly caution: string;
    readonly parameters: Readonly<Record<string, ParameterGuideValue>>;
    readonly highlightedParameters: readonly string[];
}

export interface ParameterGuideSnapshot {
    readonly packetType: "ArcSecs Run Your Own Simulation Parameter Guide";
    readonly generatedUtc: string;
    readonly presetCount: number;
    readonly selectedPresetId: string;
    readonly selectedPreset: ParameterGuidePreset;
    readonly presets: readonly ParameterGuidePreset[];
    readonly exportContainsExecutableCode: false;
    readonly scientificBoundary: string;
}

export class RunYourOwnSimulationGuide {
    private readonly presets: readonly ParameterGuidePreset[];

    public constructor(presets: readonly ParameterGuidePreset[] = defaultParameterGuidePresets) {
        this.presets = presets.slice();
    }

    public listPresets(): readonly ParameterGuidePreset[] {
        return this.presets.slice();
    }

    public getPreset(presetId: string): ParameterGuidePreset {
        const match: ParameterGuidePreset | undefined = this.presets.find((preset: ParameterGuidePreset) => preset.presetId === presetId);
        return match || this.presets[0];
    }

    public buildSnapshot(selectedPresetId: string): ParameterGuideSnapshot {
        const selectedPreset: ParameterGuidePreset = this.getPreset(selectedPresetId);
        return Object.freeze({
            packetType: "ArcSecs Run Your Own Simulation Parameter Guide",
            generatedUtc: new Date().toISOString(),
            presetCount: this.presets.length,
            selectedPresetId: selectedPreset.presetId,
            selectedPreset,
            presets: this.listPresets(),
            exportContainsExecutableCode: false,
            scientificBoundary: "Preset values populate the ArcSecs speculative research sandbox; they are guided demonstrations, not empirical proof or measured physical performance."
        });
    }

    public applyPresetToConfig(baseConfig: Readonly<Record<string, ParameterGuideValue>>, presetId: string): Readonly<Record<string, ParameterGuideValue>> {
        const preset: ParameterGuidePreset = this.getPreset(presetId);
        return Object.freeze({ ...baseConfig, ...preset.parameters, scenario: preset.scenario });
    }
}

export const defaultParameterGuidePresets: readonly ParameterGuidePreset[] = Object.freeze([
    Object.freeze({
        presetId: "massive-photon-lensing",
        title: "Massive Photon Lensing: non-zero photon mass",
        scenario: "massivePhotonLensing",
        audience: "physicist",
        question: "What changes when photon mass is non-zero near a compact body?",
        expectedResult: "Photon trails curve more strongly, the deflection readout rises, and the standard-reference mismatch remains visible.",
        explanation: "This preset raises the baryonic mass proxy and enables a small effective photon mass so the lensing comparison becomes easy to see in the viewport and charts.",
        caution: "The photon-mass value is a sandbox knob for an ArcSecs alternative hypothesis; it is not a measured photon mass claim.",
        parameters: Object.freeze({ scenario: "massivePhotonLensing", acceptedSteps: 9000, photonMassEv: 1e-17, baryonicMass: 9.4, photonPacketCount: 768, showTrails: true, showVectors: true, showDiagnostics: true }),
        highlightedParameters: Object.freeze(["photonMassEv", "baryonicMass", "photonPacketCount"])
    }),
    Object.freeze({
        presetId: "tired-light-galaxy-dimming",
        title: "Tired Light: distant galaxy luminosity loss",
        scenario: "tiredLightEnergyLedger",
        audience: "visitor",
        question: "How does tired-light attenuation change photon energy and apparent brightness over distance?",
        expectedResult: "Photon energy falls, redshift rises, and the removed energy appears in the substrate ledger rather than disappearing.",
        explanation: "This uses a stronger loss-rate setting and many photon packets so the accounting panel and comparison graph visibly react.",
        caution: "The attenuation coefficient is a conceptual slider, not a cosmological measurement.",
        parameters: Object.freeze({ scenario: "tiredLightEnergyLedger", acceptedSteps: 12000, lossRate: 0.085, photonPacketCount: 1024, intergalacticParticleDensity: 2.4, forwardScatteringStrictness: 0.96, showTrails: true, showDiagnostics: true }),
        highlightedParameters: Object.freeze(["lossRate", "intergalacticParticleDensity", "forwardScatteringStrictness"])
    }),
    Object.freeze({
        presetId: "absolute-time-oscillator-comparison",
        title: "Absolute Time: near-mass oscillator damping",
        scenario: "absoluteTimeQuantumOscillator",
        audience: "visitor",
        question: "Can two clocks share one global tick while local oscillator transitions differ?",
        expectedResult: "The global tick remains shared while the near-mass oscillator reports fewer transitions than the deep-space probe.",
        explanation: "This preset makes the mass proxy high enough that the damping coefficient and transition-count difference are easy to notice.",
        caution: "This is the ArcSecs mechanical interpretation of clock-rate differences, not proof against consensus relativity.",
        parameters: Object.freeze({ scenario: "absoluteTimeQuantumOscillator", acceptedSteps: 10000, baryonicMass: 8.8, accelerationThreshold: 1.6, showLabels: true, showDiagnostics: true }),
        highlightedParameters: Object.freeze(["baryonicMass", "accelerationThreshold", "acceptedSteps"])
    }),
    Object.freeze({
        presetId: "newtonian-dark-star-capture",
        title: "Newtonian Dark Star: photon capture threshold",
        scenario: "newtonianDarkStar",
        audience: "physicist",
        question: "When does a photon-like particle fail to escape a compact Newtonian mass?",
        expectedResult: "The escape velocity threshold exceeds the launch speed proxy and the capture/apogee state becomes visible.",
        explanation: "This preset raises the mass proxy and step count to make the outbound path turn back in the dark-star visualization.",
        caution: "This is a Newtonian dark-star visualization inside the ArcSecs model, not a replacement for measured black-hole physics.",
        parameters: Object.freeze({ scenario: "newtonianDarkStar", acceptedSteps: 11000, baryonicMass: 11.5, photonMassEv: 6e-18, showTrails: true, showVectors: true, showDiagnostics: true }),
        highlightedParameters: Object.freeze(["baryonicMass", "photonMassEv", "acceptedSteps"])
    }),
    Object.freeze({
        presetId: "galilean-superluminal-relative-velocity",
        title: "Galilean Relative Velocity: above-light-speed arithmetic",
        scenario: "superluminalGalilean",
        audience: "visitor",
        question: "What happens when two bodies separate in opposite directions without Lorentz limiting?",
        expectedResult: "Relative velocity is displayed as arithmetic vector addition and can exceed one c in the selected hypothesis mode.",
        explanation: "The speed multiplier and diagnostics reveal the no-Lorentz-factor assumption instead of hiding it.",
        caution: "This is a Galilean alternative-hypothesis sandbox; it does not make a real faster-than-light travel claim.",
        parameters: Object.freeze({ scenario: "superluminalGalilean", acceptedSteps: 7000, speedMultiplier: 1.6, showVectors: true, showLabels: true, showDiagnostics: true }),
        highlightedParameters: Object.freeze(["speedMultiplier", "acceptedSteps", "showVectors"])
    }),
    Object.freeze({
        presetId: "ramjet-thermal-stress-test",
        title: "Dark Matter Ramjet: thermal bottleneck stress test",
        scenario: "darkMatterRamjet",
        audience: "engineer",
        question: "Which pipeline stage becomes the bottleneck when capture and reactor output exceed radiator capacity?",
        expectedResult: "Waste heat and radiator load warnings rise, readiness drops, and the flight director points at thermal management.",
        explanation: "This preset combines high capture, high compression, low thermal rejection, and a radiator-panel-loss failure so the pipeline visibly complains.",
        caution: "The ramjet is a conceptual diagnostic pipeline, not established propulsion technology.",
        parameters: Object.freeze({ scenario: "darkMatterRamjet", acceptedSteps: 14000, ramjetPreset: "thermalOverload", comparisonMode: "undersizedRadiator", failureInjectionMode: "radiatorPanelLoss", scoopFieldDiameterKilometers: 7800, substrateDensity: 2.8, shipVelocityRatioC: 0.62, compressionRatio: 42, bufferCapacity: 36, reactorConversionEfficiency: 0.61, thermalRejectionCapacity: 5.5, exhaustCollimationEfficiency: 0.82, showDiagnostics: true }),
        highlightedParameters: Object.freeze(["ramjetPreset", "failureInjectionMode", "thermalRejectionCapacity"])
    }),
    Object.freeze({
        presetId: "condensate-halo-growth",
        title: "Dark-Light Condensate: halo growth from tired-light ledger",
        scenario: "darkMatterCondensate",
        audience: "visitor",
        question: "What would exhausted photon energy look like if it pooled into a halo-like distribution?",
        expectedResult: "The condensate visualization brightens while halo density and accumulated ledger energy rise together.",
        explanation: "This preset increases attenuation and particle density to make the halo connection readable without opening expert controls.",
        caution: "The halo is an ArcSecs visualization hypothesis, not direct evidence for dark matter composition.",
        parameters: Object.freeze({ scenario: "darkMatterCondensate", acceptedSteps: 13000, lossRate: 0.074, photonPacketCount: 1280, intergalacticParticleDensity: 3.2, showTrails: true, showDiagnostics: true }),
        highlightedParameters: Object.freeze(["lossRate", "photonPacketCount", "intergalacticParticleDensity"])
    }),
    Object.freeze({
        presetId: "validation-lab-one-arcsecond",
        title: "Validation Lab: one arcsecond equals one parsec check",
        scenario: "parallaxCalibration",
        audience: "physicist",
        question: "Does the sandbox still honor the basic arcsecond / AU / parsec calibration anchor?",
        expectedResult: "The calibration lab reports a pass for the one-arcsecond, one-AU, one-parsec benchmark and lists any failed checks.",
        explanation: "This preset sets the clean calibration anchor before users explore more speculative modes.",
        caution: "Passing the calibration anchor only verifies the demo math path; it does not validate the speculative physics assumptions.",
        parameters: Object.freeze({ scenario: "parallaxCalibration", acceptedSteps: 4000, parallaxArcseconds: 1, baselineAu: 1, showDiagnostics: true }),
        highlightedParameters: Object.freeze(["parallaxArcseconds", "baselineAu", "acceptedSteps"])
    })
]);
