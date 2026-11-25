export type ArcSecsScenarioKey =
    | "relationalLattice"
    | "absoluteTimeQuantumOscillator"
    | "massivePhotonLensing"
    | "newtonianDarkStar"
    | "superluminalGalilean"
    | "tiredLightEnergyLedger"
    | "darkMatterCondensate"
    | "darkMatterRamjet"
    | "parallaxCalibration"
    | "distanceTimeKernel";

export interface ScenarioCatalogItem {
    readonly key: ArcSecsScenarioKey;
    readonly label: string;
    readonly plainEnglishGoal: string;
    readonly physicistGoal: string;
    readonly assumptions: readonly string[];
}

export const scenarioCatalog: readonly ScenarioCatalogItem[] = [
    { key: "relationalLattice", label: "Relational Flat-Space Lattice", plainEnglishGoal: "Show matter nodes connected by relationship edges instead of a physical spacetime fabric.", physicistGoal: "Inspect edge lengths, constraint tension, and bounded graph stability.", assumptions: ["absolute time", "no physical spacetime fabric"] },
    { key: "absoluteTimeQuantumOscillator", label: "Absolute Time / Quantum Oscillator Damping", plainEnglishGoal: "Show one global clock while nearby oscillators mechanically transition more slowly.", physicistGoal: "Separate universal tick count from local oscillator transition count.", assumptions: ["absolute time", "mechanical oscillator retardation"] },
    { key: "massivePhotonLensing", label: "Massive Photon Gravitational Lensing", plainEnglishGoal: "Show photon paths bending near mass using a configurable massive-photon proxy.", physicistGoal: "Compare Soldner-style, GR reference, and ArcSecs proxy deflection.", assumptions: ["massive photon", "flat-space lensing"] },
    { key: "newtonianDarkStar", label: "Newtonian Dark Star", plainEnglishGoal: "Show light failing to escape when launch speed is below escape velocity.", physicistGoal: "Expose escape threshold, apogee, capture, and escaping states.", assumptions: ["Newtonian dark star", "massive photon"] },
    { key: "superluminalGalilean", label: "Superluminal Galilean Relative Velocity", plainEnglishGoal: "Show opposite-moving bodies with arithmetic relative velocity greater than c.", physicistGoal: "Verify vector subtraction without a Lorentz factor in this alternative mode.", assumptions: ["Galilean superluminal kinematics", "absolute time"] },
    { key: "tiredLightEnergyLedger", label: "Tired-Light Photon Energy Ledger", plainEnglishGoal: "Track photon energy loss and show where the removed energy is recorded.", physicistGoal: "Close the energy ledger and expose redshift and closure error.", assumptions: ["tired-light attenuation", "energy ledger substrate"] },
    { key: "darkMatterCondensate", label: "Dark Matter / Tired-Light Condensate", plainEnglishGoal: "Show exhausted photon energy accumulating into a halo-like condensate.", physicistGoal: "Tie halo density to the tired-light energy ledger.", assumptions: ["dark-light condensate", "tired-light attenuation"] },
    { key: "darkMatterRamjet", label: "Dark Matter Drive / Tired-Light Ramjet", plainEnglishGoal: "Show a complete scoop, buffer, reactor, heat, and thrust accounting pipeline.", physicistGoal: "Audit intake, drag, buffer coherence, thermal limits, exhaust collimation, and readiness.", assumptions: ["ramjet harvest model", "tired-light attenuation", "dark-light condensate"] },
    { key: "parallaxCalibration", label: "Validation and Calibration Lab", plainEnglishGoal: "Verify the one-arcsecond / one-AU / one-parsec benchmark and deterministic readiness gates.", physicistGoal: "Inspect calibration, deterministic replay, finite telemetry, and energy-ledger pass/fail reasons.", assumptions: ["absolute time"] }
    ,{ key: "distanceTimeKernel", label: "Distance-Time Kernel", plainEnglishGoal: "Show distance without lightyears, clockless universal progression, gravity-wave baseline arrival, and degraded electromagnetic light.", physicistGoal: "Inspect parallax/parsec distance, progression estimates, wavefront ordering, delay decomposition, finite telemetry, claim-map validation, and export evidence.", assumptions: ["parsecs not lightyears", "local clocks are probes", "gravity-wave baseline", "electromagnetic light is secondary", "speculative falsification path"] }
];
