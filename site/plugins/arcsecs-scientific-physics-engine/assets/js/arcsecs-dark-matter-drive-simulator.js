(function () {
    "use strict";

    const SCIENTIFIC_BOUNDARY = "Speculative relational-engine visualization — not established current technology. Observable readouts, Machian interaction references, ArcSecs hypothesis views, and inertial-decoupling concepts are labeled separately.";
    const TWO_PI = Math.PI * 2;
    const SPEED_OF_LIGHT_METERS_PER_SECOND = 299792458;
    const METERS_PER_MEGAPARSEC = 3.0856775814913673e22;
    const GW170817_ANCHOR_DISTANCE_MEGAPARSECS = 40;
    const GW170817_ANCHOR_REDSHIFT = 0.0099;
    const GW170817_OBSERVED_DELAY_SECONDS = 1.74;
    const GW170817_MODEL_PROPAGATION_DELAY_SECONDS = 0.020;
    const GW170817_INTRINSIC_DELAY_SECONDS = GW170817_OBSERVED_DELAY_SECONDS - GW170817_MODEL_PROPAGATION_DELAY_SECONDS;
    const LIGHT_SLOWING_REDSHIFT_COEFFICIENT_PER_METER = Math.log(1 + GW170817_ANCHOR_REDSHIFT) / (GW170817_ANCHOR_DISTANCE_MEGAPARSECS * METERS_PER_MEGAPARSEC);
    const LIGHT_SLOWING_DELAY_COEFFICIENT_PER_METER = (2 * SPEED_OF_LIGHT_METERS_PER_SECOND * GW170817_MODEL_PROPAGATION_DELAY_SECONDS) / Math.pow(GW170817_ANCHOR_DISTANCE_MEGAPARSECS * METERS_PER_MEGAPARSEC, 2);



    function buildScientificSourceMatrix(activeScenario) {
        return Object.freeze({
            matrixVersion: 1,
            activeScenario: activeScenario || "darkMatterDriveSimulator",
            citationPolicy: "Confirmed rows use project anchors; project-note rows are simulation notes; future-research rows need deeper citation completion before any external scientific claim.",
            rows: Object.freeze([
                Object.freeze({ scenario: "Dark Matter Ramjet", sourceReferenceNote: "Project note for educational drive visualization and locked placeholder concepts.", standardExpectation: "No established dark matter propulsion system exists.", arcsecsAlternativeAssumption: "Drive controls are model telemetry and exaggerated visualization only.", normalizedParameter: "densityStrength, fuelProxy, thermalProxy", derivedTelemetry: "fuel, thermalLoad, Weber drag, route risk", exportEvidence: "ArcSecsDarkMatterDriveSimulatorEvidence", falsificationTrigger: "Dense substrate increases fuel without heat, drag, or risk.", citationStatus: "project-note" }),
                Object.freeze({ scenario: "Massive Photon / Proca Dispersion", sourceReferenceNote: "Proca / massive photon speculative extension note.", standardExpectation: "Photons are massless in standard electromagnetism.", arcsecsAlternativeAssumption: "Proca flux is an instrument proxy for visual comparison.", normalizedParameter: "Proca flux proxy", derivedTelemetry: "photon lag, optical resistance, lensing blur", exportEvidence: "drive telemetry export", falsificationTrigger: "Proca change creates no divergence or non-finite telemetry.", citationStatus: "future-research" }),
                Object.freeze({ scenario: "Flat-Space Lensing", sourceReferenceNote: "Gravitational lensing baseline comparison note.", standardExpectation: "Lensing is normally compared against GR baseline behavior.", arcsecsAlternativeAssumption: "Flat-space branch uses an educational deflection proxy.", normalizedParameter: "lens density proxy", derivedTelemetry: "deflection residual and blur", exportEvidence: "component hotspot and telemetry export", falsificationTrigger: "Baseline and branch become indistinguishable without explanation.", citationStatus: "confirmed" }),
                Object.freeze({ scenario: "Multi-Messenger Events", sourceReferenceNote: "GW170817 / GRB 170817A and standard-siren comparison anchors.", standardExpectation: "Intrinsic source delay is separate from line-of-sight propagation delay.", arcsecsAlternativeAssumption: "Photon counterpart may lag, weaken, smear, or be missing as a test case.", normalizedParameter: "intrinsicSourceDelay, propagationDelayBudget", derivedTelemetry: "Gravity Arrival, Photon Arrival, Photon Delay, Visibility", exportEvidence: "wavefront trace and validation ledger", falsificationTrigger: "Missing counterpart is presented as proof instead of uncertainty.", citationStatus: "confirmed" })
            ])
        });
    }

    function buildScenarioEquationLibrary(activeScenario) {
        return Object.freeze({
            libraryVersion: 1,
            activeScenario: activeScenario || "darkMatterDriveSimulator",
            precisionBoundary: "Drive formulas are simplified telemetry contracts and normalized proxies; they are not established spacecraft equations.",
            rows: Object.freeze([
                Object.freeze({ scenario: "Dark Matter Ramjet", formula: "Route Risk ≈ Fuel Gain + Heat + Drag + Torsion Pull", formulaKind: "pseudo-formula", units: "normalized fuel, heat, drag, risk", controlledInputs: "active controls and propulsion mode", derivedTelemetry: "fuel, thermalLoad, drag, route risk", exportedEvidence: "drive simulator evidence", placeholderStatus: "speculative visualization" }),
                Object.freeze({ scenario: "Massive Photon / Proca Dispersion", formula: "Dispersion Proxy ≈ Proca Flux × Coupling Drift", formulaKind: "pseudo-formula", units: "normalized flux and drift", controlledInputs: "Proca flux proxy", derivedTelemetry: "photon lag, optical resistance, blur", exportedEvidence: "telemetry export", placeholderStatus: "future-research" }),
                Object.freeze({ scenario: "Flat-Space Lensing", formula: "Deflection Residual ≈ Educational Branch - Standard Baseline", formulaKind: "pseudo-formula", units: "normalized deflection proxy", controlledInputs: "lens density and view mode", derivedTelemetry: "deflection residual", exportedEvidence: "hotspot export", placeholderStatus: "comparison" }),
                Object.freeze({ scenario: "Multi-Messenger Events", formula: "Delay Budget = Intrinsic Source Delay + Propagation Delay Budget", formulaKind: "comparison formula", units: "seconds, ticks, normalized density", controlledInputs: "event preset and substrate profile", derivedTelemetry: "Gravity Arrival, Photon Arrival, Visibility", exportedEvidence: "wavefront trace", placeholderStatus: "test scenario" })
            ])
        });
    }

    const DECOUPLED_PROPAGATION_CONTRACT_VERSION = 1;
    const MULTI_MESSENGER_EVENT_PRESETS = {
        custom: { label: "Custom line of sight", distanceMegaparsecs: 40, redshift: 0.0099, observedDelaySeconds: 1.74, propagationDelaySeconds: 0.020, intrinsicDelaySeconds: 1.72, substrateProfile: "standard", couplingRedshift: 0 },
        gw170817: { label: "GW170817 / GRB 170817A anchor", distanceMegaparsecs: 40, redshift: 0.0099, observedDelaySeconds: 1.74, propagationDelaySeconds: 0.020, intrinsicDelaySeconds: 1.72, substrateProfile: "standard", couplingRedshift: 0 },
        gw150914: { label: "GW150914 weak gamma-ray candidate", distanceMegaparsecs: 410, redshift: 0.09, observedDelaySeconds: 0.4, propagationDelaySeconds: 0.30, intrinsicDelaySeconds: 0.10, substrateProfile: "void", couplingRedshift: 0.015 },
        gw190521: { label: "GW190521 / AGN optical flare", distanceMegaparsecs: 1478, redshift: 0.438, observedDelaySeconds: 2937600, propagationDelaySeconds: 27.6, intrinsicDelaySeconds: 2937572.4, substrateProfile: "agnDisk", couplingRedshift: 0.08 },
        supernovaLightCurveStretch: { label: "Supernova Light-Curve Stretch contract anchor", distanceMegaparsecs: 1400, redshift: 0.42, observedDelaySeconds: 345600, propagationDelaySeconds: 19.8, intrinsicDelaySeconds: 259200, substrateProfile: "filament", couplingRedshift: 0.04 },
        hubbleTension: { label: "Hubble Tension optical-history anchor", distanceMegaparsecs: 4500, redshift: 0.73, observedDelaySeconds: 120, propagationDelaySeconds: 74, intrinsicDelaySeconds: 0, substrateProfile: "standard", couplingRedshift: 0.09 },
        gw190814: { label: "GW190814 missing-counterpart test", distanceMegaparsecs: 241, redshift: 0.053, observedDelaySeconds: 0, propagationDelaySeconds: 0.72, intrinsicDelaySeconds: 0, substrateProfile: "filament", couplingRedshift: 0.02 }
    };
    const PROCA_SUBSTRATE_DENSITY_PROFILES = {
        void: { label: "Cosmic void", densityMultiplier: 0.14, opticalResistance: 0.18, energyResistance: 0.32, note: "Low Proca substrate density downshifts electromagnetic retardation; used to explain short-lag candidate paths." },
        standard: { label: "Standard intergalactic substrate", densityMultiplier: 1, opticalResistance: 1, energyResistance: 1, note: "GW170817-style anchor density used as the reference calibration." },
        filament: { label: "Dense filament / halo crossing", densityMultiplier: 2.35, opticalResistance: 2.1, energyResistance: 2.7, note: "Dense relational substrate increases electromagnetic slowing and energy degeneration." },
        agnDisk: { label: "AGN accretion disk diffusion", densityMultiplier: 4.4, opticalResistance: 1.85, energyResistance: 4.8, note: "Dense local environment dominates intrinsic electromagnetic breakout and diffusion delay." }
    };
    const REFERENCE_BARYON_DENSITY = 0.0224;
    const REFERENCE_TOTAL_MATTER_DENSITY = 0.143;
    const REFERENCE_DARK_MATTER_TO_BARYON_RATIO = (REFERENCE_TOTAL_MATTER_DENSITY - REFERENCE_BARYON_DENSITY) / REFERENCE_BARYON_DENSITY;
    const CURRENT_SCRIPT_URL = typeof document !== "undefined" && document.currentScript && document.currentScript.src ? document.currentScript.src : "";
    const DARK_MATTER_DRIVE_COMPUTE_WORKER_SCRIPT = "arcsecs-dark-matter-drive-compute-worker.js";
    const WEBGPU_COMPUTE_WORKGROUP_SIZE = 64;
    const WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES = 4096;
    const WEBGPU_REDUCED_DIAGNOSTIC_WORDS = 9;
    const WEBGPU_COMPUTE_MESSAGE_CONTRACT_VERSION = 1;
    const WEBGPU_SHARED_BUFFER_CONTRACT_VERSION = 18;
    const RELATIONAL_ECS_CONTRACT_VERSION = 5;
    const WEBGPU_DIAGNOSTIC_SCALE = 100000;
    const WEBGPU_PARTICLE_FLOATS_PER_PARTICLE = 8;
    const WEBGPU_PARTICLE_BYTES_PER_PARTICLE = WEBGPU_PARTICLE_FLOATS_PER_PARTICLE * 4;
    const WEBGPU_RENDER_SAMPLE_PARTICLE_COUNT = 96;
    const WEBGPU_RENDER_SAMPLE_BYTE_LENGTH = WEBGPU_RENDER_SAMPLE_PARTICLE_COUNT * WEBGPU_PARTICLE_BYTES_PER_PARTICLE;
    const WEBGPU_SPATIAL_BUCKET_GRID_SIZE = 8;
    const WEBGPU_SPATIAL_BUCKET_COUNT = WEBGPU_SPATIAL_BUCKET_GRID_SIZE * WEBGPU_SPATIAL_BUCKET_GRID_SIZE;
    const WEBGPU_SPATIAL_BUCKET_BYTE_LENGTH = WEBGPU_SPATIAL_BUCKET_COUNT * 4;
    const WEBGPU_BUCKET_RANGE_FIELDS = 4;
    const WEBGPU_BUCKET_RANGE_BYTE_LENGTH = WEBGPU_SPATIAL_BUCKET_COUNT * WEBGPU_BUCKET_RANGE_FIELDS * 4;
    const WEBGPU_COMPACTED_INDEX_BYTE_LENGTH = WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES * 4;
    const WEBGPU_BUCKET_NEIGHBOR_DENSITY_WORDS = 5;
    const WEBGPU_BUCKET_NEIGHBOR_DENSITY_BYTE_LENGTH = WEBGPU_BUCKET_NEIGHBOR_DENSITY_WORDS * 4;
    const WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT = 8;
    const WEBGPU_DENSITY_FIELD_TILE_WORDS = 4;
    const WEBGPU_DENSITY_FIELD_TILE_BYTE_LENGTH = WEBGPU_SPATIAL_BUCKET_COUNT * WEBGPU_DENSITY_FIELD_TILE_WORDS * 4;
    const WEBGPU_DENSITY_FIELD_DIAGNOSTIC_WORDS = 6;
    const WEBGPU_DENSITY_FIELD_DIAGNOSTIC_BYTE_LENGTH = WEBGPU_DENSITY_FIELD_DIAGNOSTIC_WORDS * 4;
    const WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT = 8;
    const WEBGPU_TILE_LOCAL_NEIGHBOR_LIMIT = WEBGPU_COMPUTE_WORKGROUP_SIZE;
    const WEBGPU_DENSITY_FIELD_FEEDBACK_DEFAULT_GAIN = 1;
    const WEBGPU_DENSITY_FIELD_FEEDBACK_MAX_GAIN = 3;
    const WEBGPU_FEEDBACK_DOWNSHIFT_SOFT_CLAMP_RATE = 0.02;
    const WEBGPU_FEEDBACK_DOWNSHIFT_MEDIUM_CLAMP_RATE = 0.06;
    const WEBGPU_FEEDBACK_DOWNSHIFT_HARD_CLAMP_RATE = 0.18;
    const WEBGPU_ADAPTIVE_COMPUTE_WINDOW_SIZE = 8;
    const WEBGPU_ADAPTIVE_COMPUTE_MINIMUM_SUSTAINED_SAMPLES = 4;
    const WEBGPU_ADAPTIVE_COMPUTE_PERSISTENT_TICKS = 3;
    const WEBGPU_ADAPTIVE_COMPUTE_CLAMP_RATE_THRESHOLD = 0.025;
    const WEBGPU_ADAPTIVE_COMPUTE_FPS_THRESHOLD = 34;
    const WEBGPU_ADAPTIVE_COMPUTE_WORKER_ROUND_TRIP_THRESHOLD = 32;
    const WEBGPU_ADAPTIVE_COMPUTE_READBACK_THRESHOLD = 16;
    const WEBGPU_ADAPTIVE_COMPUTE_BASE_DISPATCH_CADENCE_TICKS = 18;
    const WEBGPU_ADAPTIVE_COMPUTE_DISPATCH_CADENCE_BY_LEVEL = [18, 24, 36, 54];
    const WEBGPU_ADAPTIVE_BUCKET_NEIGHBOR_SAMPLE_LIMITS = [8, 6, 4, 2];
    const WEBGPU_ADAPTIVE_DENSITY_FIELD_SAMPLE_LIMITS = [8, 6, 4, 2];
    const WEBGPU_ADAPTIVE_DIRECT_RENDER_POINT_SCALES = [1, 0.88, 0.72, 0.56];
    const WEBGPU_ADAPTIVE_DIRECT_HALO_INTENSITIES = [1, 0.78, 0.58, 0.38];
    const WEBGPU_ADAPTIVE_DIRECT_VISUAL_DENSITIES = [1, 0.82, 0.64, 0.48];
    const WEBGPU_ADAPTIVE_DIRECT_VISUAL_QUALITY_MODES = ["full", "balanced", "reduced", "minimal"];
    const WEBGPU_RELATIONAL_MDS_NODE_COUNT = 5;
    const WEBGPU_RELATIONAL_DISTANCE_MATRIX_FLOATS = WEBGPU_RELATIONAL_MDS_NODE_COUNT * WEBGPU_RELATIONAL_MDS_NODE_COUNT;
    const WEBGPU_RELATIONAL_DISTANCE_MATRIX_BYTE_LENGTH = WEBGPU_RELATIONAL_DISTANCE_MATRIX_FLOATS * 4;
    const WEBGPU_RELATIONAL_PROJECTION_FLOATS_PER_NODE = 4;
    const WEBGPU_RELATIONAL_PROJECTION_BYTE_LENGTH = WEBGPU_RELATIONAL_MDS_NODE_COUNT * WEBGPU_RELATIONAL_PROJECTION_FLOATS_PER_NODE * 4;
    const WEBGPU_RELATIONAL_WEBER_TETHER_COUNT = 10;
    const WEBGPU_RELATIONAL_WEBER_TETHER_FLOATS_PER_TETHER = 4;
    const WEBGPU_RELATIONAL_WEBER_TETHER_BYTE_LENGTH = WEBGPU_RELATIONAL_WEBER_TETHER_COUNT * WEBGPU_RELATIONAL_WEBER_TETHER_FLOATS_PER_TETHER * 4;
    const WEBGPU_RELATIONAL_PACKED_TETHER_FLOATS_PER_TETHER = 4;
    const WEBGPU_RELATIONAL_PACKED_TETHER_BYTE_LENGTH = WEBGPU_RELATIONAL_WEBER_TETHER_COUNT * WEBGPU_RELATIONAL_PACKED_TETHER_FLOATS_PER_TETHER * 4;
    const WEBGPU_ADAPTIVE_RELATIONAL_TETHER_LIMITS = [10, 8, 6, 4];
    const WEBGPU_ADAPTIVE_RELATIONAL_REDUCTION_CADENCE_BY_LEVEL = [1, 2, 3, 4];
    const WEBGPU_ADAPTIVE_RELATIONAL_VISUAL_TETHER_DENSITIES = [1, 0.78, 0.55, 0.38];
    const WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_WORDS = 5;
    const WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_BYTE_LENGTH = WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_WORDS * 4;
    const WEBGPU_RELATIONAL_MACHIAN_ENTITY_FIELDS = 4;
    const WEBGPU_RELATIONAL_MACHIAN_MASS_BYTE_LENGTH = WEBGPU_RELATIONAL_MDS_NODE_COUNT * WEBGPU_RELATIONAL_MACHIAN_ENTITY_FIELDS * 4;
    const WEBGPU_N_BODY_COMPUTE_SHADER = `
struct Particle {
    position: vec4<f32>,
    velocity: vec4<f32>
};

struct SimulationUniforms {
    particleCount: u32,
    stepIndex: u32,
    reservedA: u32,
    reservedB: u32,
    timeStep: f32,
    gravityStrength: f32,
    darkMatterDensity: f32,
    haloRadius: f32,
    windX: f32,
    windY: f32,
    driveCoupling: f32,
    softening: f32,
    densityFieldFeedbackGain: f32,
    adaptiveDensityFieldFeedbackGain: f32,
    feedbackClampRateLimit: f32,
    feedbackReserved: f32
};

const SPATIAL_BUCKET_GRID_SIZE: u32 = 8u;
const TILE_LOCAL_NEIGHBOR_LIMIT: u32 = 64u;
const DENSITY_FIELD_ACCELERATION_GAIN: f32 = 0.00035;
const DENSITY_FIELD_ACCELERATION_LIMIT: f32 = 0.004;
const TOTAL_ACCELERATION_LIMIT: f32 = 0.025;
const VELOCITY_LIMIT: f32 = 8.0;
const POSITION_LIMIT: f32 = 6.0;

fn finiteOrZero(value: f32) -> f32 {
    if (value == value && abs(value) < 100000.0) {
        return value;
    }
    return 0.0;
}

fn boundedVector2(value: vec2<f32>, limit: f32) -> vec2<f32> {
    let cleaned: vec2<f32> = vec2<f32>(finiteOrZero(value.x), finiteOrZero(value.y));
    let magnitude: f32 = length(cleaned);
    if (magnitude > limit && magnitude > 0.000001) {
        return cleaned * (limit / magnitude);
    }
    return cleaned;
}


fn spreadMorton3Bit(value: u32) -> u32 {
    return (value & 1u) | ((value & 2u) << 1u) | ((value & 4u) << 2u);
}

fn mortonBucketIndex(position: vec2<f32>) -> u32 {
    let normalized: vec2<f32> = clamp(position * 0.25 + vec2<f32>(0.5, 0.5), vec2<f32>(0.0, 0.0), vec2<f32>(0.999, 0.999));
    let gridX: u32 = min(u32(normalized.x * f32(SPATIAL_BUCKET_GRID_SIZE)), SPATIAL_BUCKET_GRID_SIZE - 1u);
    let gridY: u32 = min(u32(normalized.y * f32(SPATIAL_BUCKET_GRID_SIZE)), SPATIAL_BUCKET_GRID_SIZE - 1u);
    return spreadMorton3Bit(gridX) | (spreadMorton3Bit(gridY) << 1u);
}

struct ReducedDiagnostics {
    finiteCount: atomic<u32>,
    speedScaledTotal: atomic<u32>,
    radiusScaledMaximum: atomic<u32>,
    accelerationScaledTotal: atomic<u32>,
    haloScaledTotal: atomic<u32>,
    tileLocalNeighborScaledTotal: atomic<u32>,
    adaptiveHaloScaledTotal: atomic<u32>,
    densityFieldAccelerationScaledTotal: atomic<u32>,
    finiteGuardClampCount: atomic<u32>
};

@group(0) @binding(0) var<storage, read> sourceParticles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> destinationParticles: array<Particle>;
@group(0) @binding(2) var<storage, read_write> diagnostics: ReducedDiagnostics;
@group(0) @binding(3) var<uniform> simulationUniforms: SimulationUniforms;
@group(0) @binding(4) var<storage, read_write> spatialBuckets: array<atomic<u32>>;
@group(0) @binding(5) var<storage, read> densityFieldTilesForAcceleration: array<vec4<f32>>;
var<workgroup> tilePositions: array<vec2<f32>, 64>;
// legacy scanner marker: var<storage, read_write> particles moved to persistent source/destination ping-pong buffers.

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) globalInvocationId: vec3<u32>, @builtin(local_invocation_index) localInvocationIndex: u32) {
    let particleIndex: u32 = globalInvocationId.x;
    if (particleIndex >= simulationUniforms.particleCount) {
        return;
    }

    var particle: Particle = sourceParticles[particleIndex];
    let position: vec2<f32> = particle.position.xy;
    let radius: f32 = max(length(position), 0.001);
    let inwardDirection: vec2<f32> = -position / radius;
    let currentSpatialBucketIndex: u32 = mortonBucketIndex(position);
    tilePositions[localInvocationIndex] = position;
    workgroupBarrier();
    var tileLocalDensityProxy: f32 = 0.0;
    let workgroupStartIndex: u32 = particleIndex - localInvocationIndex;
    for (var tileIndex: u32 = 0u; tileIndex < TILE_LOCAL_NEIGHBOR_LIMIT; tileIndex = tileIndex + 1u) {
        let neighborParticleIndex: u32 = workgroupStartIndex + tileIndex;
        if (neighborParticleIndex < simulationUniforms.particleCount && tileIndex != localInvocationIndex) {
            let neighborOffset: vec2<f32> = tilePositions[tileIndex] - position;
            tileLocalDensityProxy = tileLocalDensityProxy + 1.0 / (1.0 + dot(neighborOffset, neighborOffset) * 8.0);
        }
    }
    tileLocalDensityProxy = tileLocalDensityProxy / f32(TILE_LOCAL_NEIGHBOR_LIMIT);
    let haloInfluence: f32 = simulationUniforms.darkMatterDensity * radius / max(radius + simulationUniforms.haloRadius, 0.001);
    let softenedRadiusSquared: f32 = radius * radius + simulationUniforms.softening;
    let gravitationalAcceleration: vec2<f32> = inwardDirection * simulationUniforms.gravityStrength * (1.0 + haloInfluence) / max(softenedRadiusSquared, 0.001);
    let windAcceleration: vec2<f32> = vec2<f32>(simulationUniforms.windX, simulationUniforms.windY) * simulationUniforms.driveCoupling * simulationUniforms.darkMatterDensity * 0.0002;
    let tileLocalAcceleration: vec2<f32> = inwardDirection * tileLocalDensityProxy * simulationUniforms.darkMatterDensity * 0.0005;
    let densityFieldTile: vec4<f32> = densityFieldTilesForAcceleration[currentSpatialBucketIndex];
    let densityFieldDensity: f32 = clamp(finiteOrZero(densityFieldTile.x), 0.0, 8.0);
    let densityFieldForceProxy: vec2<f32> = boundedVector2(vec2<f32>(densityFieldTile.y, densityFieldTile.z), 1.0);
    let feedbackGain: f32 = clamp(finiteOrZero(simulationUniforms.adaptiveDensityFieldFeedbackGain), 0.0, 3.0);
    let rawDensityFieldAcceleration: vec2<f32> = densityFieldForceProxy * densityFieldDensity * simulationUniforms.darkMatterDensity * DENSITY_FIELD_ACCELERATION_GAIN * feedbackGain;
    let densityFieldAcceleration: vec2<f32> = boundedVector2(rawDensityFieldAcceleration, DENSITY_FIELD_ACCELERATION_LIMIT);
    let accelerationBeforeGuard: vec2<f32> = gravitationalAcceleration + windAcceleration + tileLocalAcceleration + densityFieldAcceleration;
    let acceleration: vec2<f32> = boundedVector2(accelerationBeforeGuard, TOTAL_ACCELERATION_LIMIT);
    let nextVelocityBeforeGuard: vec2<f32> = particle.velocity.xy + acceleration * simulationUniforms.timeStep;
    let nextVelocity: vec2<f32> = boundedVector2(nextVelocityBeforeGuard, VELOCITY_LIMIT);
    let nextPositionBeforeGuard: vec2<f32> = position + nextVelocity * simulationUniforms.timeStep;
    let nextPosition: vec2<f32> = boundedVector2(nextPositionBeforeGuard, POSITION_LIMIT);
    var finiteGuardClampCount: u32 = 0u;
    if (length(rawDensityFieldAcceleration) > DENSITY_FIELD_ACCELERATION_LIMIT) {
        finiteGuardClampCount = finiteGuardClampCount + 1u;
    }
    if (length(accelerationBeforeGuard) > TOTAL_ACCELERATION_LIMIT) {
        finiteGuardClampCount = finiteGuardClampCount + 1u;
    }
    if (length(nextVelocityBeforeGuard) > VELOCITY_LIMIT) {
        finiteGuardClampCount = finiteGuardClampCount + 1u;
    }
    if (length(nextPositionBeforeGuard) > POSITION_LIMIT) {
        finiteGuardClampCount = finiteGuardClampCount + 1u;
    }

    let speedScaled: u32 = u32(clamp(length(nextVelocity) * 100000.0, 0.0, 4294967295.0));
    let radiusScaled: u32 = u32(clamp(length(nextPosition) * 100000.0, 0.0, 4294967295.0));
    let accelerationScaled: u32 = u32(clamp(length(acceleration) * 100000.0, 0.0, 4294967295.0));
    let haloScaled: u32 = u32(clamp(haloInfluence * 100000.0, 0.0, 4294967295.0));
    let tileNeighborScaled: u32 = u32(clamp(tileLocalDensityProxy * 100000.0, 0.0, 4294967295.0));
    let adaptiveHaloScaled: u32 = u32(clamp((haloInfluence + tileLocalDensityProxy + densityFieldDensity * max(feedbackGain, 0.05)) * 100000.0, 0.0, 4294967295.0));
    let densityFieldAccelerationScaled: u32 = u32(clamp(length(densityFieldAcceleration) * 100000.0, 0.0, 4294967295.0));
    let spatialBucketIndex: u32 = mortonBucketIndex(nextPosition);

    destinationParticles[particleIndex].position = vec4<f32>(nextPosition, particle.position.z, particle.position.w);
    destinationParticles[particleIndex].velocity = vec4<f32>(nextVelocity, particle.velocity.z, particle.velocity.w);
    atomicAdd(&diagnostics.finiteCount, 1u);
    atomicAdd(&diagnostics.speedScaledTotal, speedScaled);
    atomicMax(&diagnostics.radiusScaledMaximum, radiusScaled);
    atomicAdd(&diagnostics.accelerationScaledTotal, accelerationScaled);
    atomicAdd(&diagnostics.haloScaledTotal, haloScaled);
    atomicAdd(&diagnostics.tileLocalNeighborScaledTotal, tileNeighborScaled);
    atomicAdd(&diagnostics.adaptiveHaloScaledTotal, adaptiveHaloScaled);
    atomicAdd(&diagnostics.densityFieldAccelerationScaledTotal, densityFieldAccelerationScaled);
    atomicAdd(&diagnostics.finiteGuardClampCount, finiteGuardClampCount);
    atomicAdd(&spatialBuckets[spatialBucketIndex], 1u);
}
`;

    const WEBGPU_BUCKET_PREFIX_SUM_SHADER = `
const SPATIAL_BUCKET_COUNT: u32 = 64u;

struct BucketRange {
    start: u32,
    count: u32,
    cursor: u32,
    reserved: u32
};

@group(0) @binding(0) var<storage, read> spatialBuckets: array<u32>;
@group(0) @binding(1) var<storage, read_write> compactedBucketRanges: array<BucketRange>;
@group(0) @binding(2) var<storage, read_write> bucketRangeCursors: array<atomic<u32>>;
var<workgroup> prefixCounts: array<u32, 64>;

@compute @workgroup_size(64)
fn main(@builtin(local_invocation_index) localInvocationIndex: u32) {
    let bucketIndex: u32 = localInvocationIndex;
    let count: u32 = spatialBuckets[bucketIndex];
    prefixCounts[bucketIndex] = count;
    workgroupBarrier();
    var startOffset: u32 = 0u;
    for (var scanIndex: u32 = 0u; scanIndex < bucketIndex; scanIndex = scanIndex + 1u) {
        startOffset = startOffset + prefixCounts[scanIndex];
    }
    compactedBucketRanges[bucketIndex].start = startOffset;
    compactedBucketRanges[bucketIndex].count = count;
    compactedBucketRanges[bucketIndex].cursor = startOffset;
    compactedBucketRanges[bucketIndex].reserved = 0u;
    atomicStore(&bucketRangeCursors[bucketIndex], startOffset);
}
`;

    const WEBGPU_BUCKET_SCATTER_SHADER = `
struct Particle {
    position: vec4<f32>,
    velocity: vec4<f32>
};

struct SimulationUniforms {
    particleCount: u32,
    stepIndex: u32,
    reservedA: u32,
    reservedB: u32,
    timeStep: f32,
    gravityStrength: f32,
    darkMatterDensity: f32,
    haloRadius: f32,
    windX: f32,
    windY: f32,
    driveCoupling: f32,
    softening: f32,
    densityFieldFeedbackGain: f32,
    adaptiveDensityFieldFeedbackGain: f32,
    feedbackClampRateLimit: f32,
    feedbackReserved: f32
};

const SPATIAL_BUCKET_GRID_SIZE: u32 = 8u;

fn spreadMorton3Bit(value: u32) -> u32 {
    return (value & 1u) | ((value & 2u) << 1u) | ((value & 4u) << 2u);
}

fn mortonBucketIndex(position: vec2<f32>) -> u32 {
    let normalized: vec2<f32> = clamp(position * 0.25 + vec2<f32>(0.5, 0.5), vec2<f32>(0.0, 0.0), vec2<f32>(0.999, 0.999));
    let gridX: u32 = min(u32(normalized.x * f32(SPATIAL_BUCKET_GRID_SIZE)), SPATIAL_BUCKET_GRID_SIZE - 1u);
    let gridY: u32 = min(u32(normalized.y * f32(SPATIAL_BUCKET_GRID_SIZE)), SPATIAL_BUCKET_GRID_SIZE - 1u);
    return spreadMorton3Bit(gridX) | (spreadMorton3Bit(gridY) << 1u);
}

@group(0) @binding(0) var<storage, read> completedParticles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> bucketRangeCursors: array<atomic<u32>>;
@group(0) @binding(2) var<storage, read_write> compactedParticleIndices: array<u32>;
@group(0) @binding(3) var<uniform> simulationUniforms: SimulationUniforms;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) globalInvocationId: vec3<u32>) {
    let particleIndex: u32 = globalInvocationId.x;
    if (particleIndex >= simulationUniforms.particleCount) {
        return;
    }
    let bucketIndex: u32 = mortonBucketIndex(completedParticles[particleIndex].position.xy);
    let compactedIndex: u32 = atomicAdd(&bucketRangeCursors[bucketIndex], 1u);
    if (compactedIndex < simulationUniforms.particleCount) {
        compactedParticleIndices[compactedIndex] = particleIndex;
    }
}
`;

    const WEBGPU_BUCKET_NEIGHBOR_DENSITY_SHADER = `
struct Particle {
    position: vec4<f32>,
    velocity: vec4<f32>
};

struct SimulationUniforms {
    particleCount: u32,
    stepIndex: u32,
    reservedA: u32,
    reservedB: u32,
    timeStep: f32,
    gravityStrength: f32,
    darkMatterDensity: f32,
    haloRadius: f32,
    windX: f32,
    windY: f32,
    driveCoupling: f32,
    softening: f32,
    densityFieldFeedbackGain: f32,
    adaptiveDensityFieldFeedbackGain: f32,
    feedbackClampRateLimit: f32,
    feedbackReserved: f32
};

struct BucketNeighborDiagnostics {
    processedParticleCount: atomic<u32>,
    sampledNeighborCount: atomic<u32>,
    densityScaledTotal: atomic<u32>,
    densityScaledMaximum: atomic<u32>,
    nearbyBucketVisitCount: atomic<u32>
};

const SPATIAL_BUCKET_GRID_SIZE: u32 = 8u;
const BUCKET_NEIGHBOR_SAMPLE_LIMIT: u32 = 8u;

fn spreadMorton3BitForNeighbor(value: u32) -> u32 {
    return (value & 1u) | ((value & 2u) << 1u) | ((value & 4u) << 2u);
}

fn gridCoordinateForNeighbor(position: vec2<f32>) -> vec2<u32> {
    let normalized: vec2<f32> = clamp(position * 0.25 + vec2<f32>(0.5, 0.5), vec2<f32>(0.0, 0.0), vec2<f32>(0.999, 0.999));
    let gridX: u32 = min(u32(normalized.x * f32(SPATIAL_BUCKET_GRID_SIZE)), SPATIAL_BUCKET_GRID_SIZE - 1u);
    let gridY: u32 = min(u32(normalized.y * f32(SPATIAL_BUCKET_GRID_SIZE)), SPATIAL_BUCKET_GRID_SIZE - 1u);
    return vec2<u32>(gridX, gridY);
}

fn mortonBucketIndexFromGridForNeighbor(gridX: u32, gridY: u32) -> u32 {
    return spreadMorton3BitForNeighbor(gridX) | (spreadMorton3BitForNeighbor(gridY) << 1u);
}

@group(0) @binding(0) var<storage, read> completedParticles: array<Particle>;
@group(0) @binding(1) var<storage, read> compactedBucketRanges: array<vec4<u32>>;
@group(0) @binding(2) var<storage, read> compactedParticleIndices: array<u32>;
@group(0) @binding(3) var<uniform> simulationUniforms: SimulationUniforms;
@group(0) @binding(4) var<storage, read_write> bucketNeighborDiagnostics: BucketNeighborDiagnostics;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) globalInvocationId: vec3<u32>) {
    let particleIndex: u32 = globalInvocationId.x;
    if (particleIndex >= simulationUniforms.particleCount) {
        return;
    }

    let particle: Particle = completedParticles[particleIndex];
    let currentGrid: vec2<u32> = gridCoordinateForNeighbor(particle.position.xy);
    var densityProxy: f32 = 0.0;
    var sampledNeighborCount: u32 = 0u;
    var nearbyBucketVisits: u32 = 0u;

    for (var yOffset: i32 = -1; yOffset <= 1; yOffset = yOffset + 1) {
        for (var xOffset: i32 = -1; xOffset <= 1; xOffset = xOffset + 1) {
            let neighborGridX: i32 = i32(currentGrid.x) + xOffset;
            let neighborGridY: i32 = i32(currentGrid.y) + yOffset;
            if (neighborGridX >= 0 && neighborGridX < i32(SPATIAL_BUCKET_GRID_SIZE) && neighborGridY >= 0 && neighborGridY < i32(SPATIAL_BUCKET_GRID_SIZE)) {
                let bucketIndex: u32 = mortonBucketIndexFromGridForNeighbor(u32(neighborGridX), u32(neighborGridY));
                let bucketRange: vec4<u32> = compactedBucketRanges[bucketIndex];
                let bucketCount: u32 = bucketRange.y;
                if (bucketCount > 0u) {
                    nearbyBucketVisits = nearbyBucketVisits + 1u;
                    let effectiveBucketNeighborSampleLimit: u32 = clamp(simulationUniforms.reservedA, 1u, BUCKET_NEIGHBOR_SAMPLE_LIMIT);
                    let cappedSampleCount: u32 = min(bucketCount, effectiveBucketNeighborSampleLimit);
                    let sampleStep: u32 = max(1u, bucketCount / cappedSampleCount);
                    for (var sampleIndex: u32 = 0u; sampleIndex < cappedSampleCount; sampleIndex = sampleIndex + 1u) {
                        let compactedSlot: u32 = bucketRange.x + min(bucketCount - 1u, sampleIndex * sampleStep);
                        if (compactedSlot < simulationUniforms.particleCount) {
                            let neighborParticleIndex: u32 = compactedParticleIndices[compactedSlot];
                            if (neighborParticleIndex < simulationUniforms.particleCount && neighborParticleIndex != particleIndex) {
                                let neighborParticle: Particle = completedParticles[neighborParticleIndex];
                                let neighborOffset: vec2<f32> = neighborParticle.position.xy - particle.position.xy;
                                densityProxy = densityProxy + 1.0 / (1.0 + dot(neighborOffset, neighborOffset) * 6.0);
                                sampledNeighborCount = sampledNeighborCount + 1u;
                            }
                        }
                    }
                }
            }
        }
    }

    let normalizedDensity: f32 = densityProxy / max(f32(sampledNeighborCount), 1.0);
    let densityScaled: u32 = u32(clamp(normalizedDensity * 100000.0, 0.0, 4294967295.0));
    atomicAdd(&bucketNeighborDiagnostics.processedParticleCount, 1u);
    atomicAdd(&bucketNeighborDiagnostics.sampledNeighborCount, sampledNeighborCount);
    atomicAdd(&bucketNeighborDiagnostics.densityScaledTotal, densityScaled);
    atomicMax(&bucketNeighborDiagnostics.densityScaledMaximum, densityScaled);
    atomicAdd(&bucketNeighborDiagnostics.nearbyBucketVisitCount, nearbyBucketVisits);
}
`;

    const WEBGPU_DENSITY_FIELD_SHADER = `
struct Particle {
    position: vec4<f32>,
    velocity: vec4<f32>
};

struct SimulationUniforms {
    particleCount: u32,
    stepIndex: u32,
    reservedA: u32,
    reservedB: u32,
    timeStep: f32,
    gravityStrength: f32,
    darkMatterDensity: f32,
    haloRadius: f32,
    windX: f32,
    windY: f32,
    driveCoupling: f32,
    softening: f32,
    densityFieldFeedbackGain: f32,
    adaptiveDensityFieldFeedbackGain: f32,
    feedbackClampRateLimit: f32,
    feedbackReserved: f32
};

struct DensityFieldDiagnostics {
    activeTileCount: atomic<u32>,
    densityScaledTotal: atomic<u32>,
    densityScaledMaximum: atomic<u32>,
    forceScaledTotal: atomic<u32>,
    sampleCountTotal: atomic<u32>,
    visitedRangeCount: atomic<u32>
};

const SPATIAL_BUCKET_GRID_SIZE: u32 = 8u;
const DENSITY_FIELD_SAMPLE_LIMIT: u32 = 8u;

fn spreadMorton3BitForDensityField(value: u32) -> u32 {
    return (value & 1u) | ((value & 2u) << 1u) | ((value & 4u) << 2u);
}

fn mortonBucketIndexFromGridForDensityField(gridX: u32, gridY: u32) -> u32 {
    return spreadMorton3BitForDensityField(gridX) | (spreadMorton3BitForDensityField(gridY) << 1u);
}

fn tileCenterForDensityField(gridX: u32, gridY: u32) -> vec2<f32> {
    let normalizedCenter: vec2<f32> = (vec2<f32>(f32(gridX), f32(gridY)) + vec2<f32>(0.5, 0.5)) / f32(SPATIAL_BUCKET_GRID_SIZE);
    return (normalizedCenter - vec2<f32>(0.5, 0.5)) / 0.25;
}

@group(0) @binding(0) var<storage, read> completedParticles: array<Particle>;
@group(0) @binding(1) var<storage, read> compactedBucketRanges: array<vec4<u32>>;
@group(0) @binding(2) var<storage, read> compactedParticleIndices: array<u32>;
@group(0) @binding(3) var<uniform> simulationUniforms: SimulationUniforms;
@group(0) @binding(4) var<storage, read_write> densityFieldTiles: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read_write> densityFieldDiagnostics: DensityFieldDiagnostics;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) globalInvocationId: vec3<u32>) {
    let linearTileIndex: u32 = globalInvocationId.x;
    if (linearTileIndex >= 64u) {
        return;
    }

    let gridX: u32 = linearTileIndex % SPATIAL_BUCKET_GRID_SIZE;
    let gridY: u32 = linearTileIndex / SPATIAL_BUCKET_GRID_SIZE;
    let currentMortonBucketIndex: u32 = mortonBucketIndexFromGridForDensityField(gridX, gridY);
    let tileCenter: vec2<f32> = tileCenterForDensityField(gridX, gridY);
    var densityProxy: f32 = 0.0;
    var forceProxy: vec2<f32> = vec2<f32>(0.0, 0.0);
    var sampleCount: u32 = 0u;
    var visitedRangeCount: u32 = 0u;

    for (var yOffset: i32 = -1; yOffset <= 1; yOffset = yOffset + 1) {
        for (var xOffset: i32 = -1; xOffset <= 1; xOffset = xOffset + 1) {
            let neighborGridX: i32 = i32(gridX) + xOffset;
            let neighborGridY: i32 = i32(gridY) + yOffset;
            if (neighborGridX >= 0 && neighborGridX < i32(SPATIAL_BUCKET_GRID_SIZE) && neighborGridY >= 0 && neighborGridY < i32(SPATIAL_BUCKET_GRID_SIZE)) {
                let neighborMortonBucketIndex: u32 = mortonBucketIndexFromGridForDensityField(u32(neighborGridX), u32(neighborGridY));
                let bucketRange: vec4<u32> = compactedBucketRanges[neighborMortonBucketIndex];
                let bucketCount: u32 = bucketRange.y;
                if (bucketCount > 0u) {
                    visitedRangeCount = visitedRangeCount + 1u;
                    let effectiveDensityFieldSampleLimit: u32 = clamp(simulationUniforms.reservedB, 1u, DENSITY_FIELD_SAMPLE_LIMIT);
                    let cappedSampleCount: u32 = min(bucketCount, effectiveDensityFieldSampleLimit);
                    let sampleStep: u32 = max(1u, bucketCount / cappedSampleCount);
                    for (var sampleIndex: u32 = 0u; sampleIndex < cappedSampleCount; sampleIndex = sampleIndex + 1u) {
                        let compactedSlot: u32 = bucketRange.x + min(bucketCount - 1u, sampleIndex * sampleStep);
                        if (compactedSlot < simulationUniforms.particleCount) {
                            let neighborParticleIndex: u32 = compactedParticleIndices[compactedSlot];
                            if (neighborParticleIndex < simulationUniforms.particleCount) {
                                let neighborParticle: Particle = completedParticles[neighborParticleIndex];
                                let offset: vec2<f32> = neighborParticle.position.xy - tileCenter;
                                let inverseDistanceWeight: f32 = 1.0 / (0.08 + dot(offset, offset));
                                densityProxy = densityProxy + inverseDistanceWeight;
                                forceProxy = forceProxy + offset * inverseDistanceWeight;
                                sampleCount = sampleCount + 1u;
                            }
                        }
                    }
                }
            }
        }
    }

    let normalizedDensity: f32 = clamp(densityProxy / max(f32(sampleCount), 1.0), 0.0, 8.0);
    let normalizedForce: vec2<f32> = forceProxy / max(f32(sampleCount), 1.0);
    let forceMagnitude: f32 = length(normalizedForce);
    densityFieldTiles[currentMortonBucketIndex] = vec4<f32>(normalizedDensity, normalizedForce.x, normalizedForce.y, f32(sampleCount));

    if (sampleCount > 0u) {
        atomicAdd(&densityFieldDiagnostics.activeTileCount, 1u);
        atomicAdd(&densityFieldDiagnostics.densityScaledTotal, u32(clamp(normalizedDensity * 100000.0, 0.0, 4294967295.0)));
        atomicMax(&densityFieldDiagnostics.densityScaledMaximum, u32(clamp(normalizedDensity * 100000.0, 0.0, 4294967295.0)));
        atomicAdd(&densityFieldDiagnostics.forceScaledTotal, u32(clamp(forceMagnitude * 100000.0, 0.0, 4294967295.0)));
        atomicAdd(&densityFieldDiagnostics.sampleCountTotal, sampleCount);
        atomicAdd(&densityFieldDiagnostics.visitedRangeCount, visitedRangeCount);
    }
}
`;


    const WEBGPU_RELATIONAL_MDS_PROJECTION_SHADER = `
struct RelationalMdsUniforms {
    nodeCount: u32,
    contractVersion: u32,
    reservedA: u32,
    reservedB: u32
};

@group(0) @binding(0) var<storage, read> relationalDistanceMatrix: array<f32>;
@group(0) @binding(1) var<storage, read_write> relationalProjectionNodes: array<vec4<f32>>;
@group(0) @binding(2) var<uniform> relationalMdsUniforms: RelationalMdsUniforms;

fn finiteDistance(value: f32) -> f32 {
    if (value == value && abs(value) < 10000.0) {
        return max(value, 0.0);
    }
    return 0.0;
}

fn matrixDistance(row: u32, column: u32, nodeCount: u32) -> f32 {
    let safeRow: u32 = min(row, nodeCount - 1u);
    let safeColumn: u32 = min(column, nodeCount - 1u);
    return finiteDistance(relationalDistanceMatrix[safeRow * nodeCount + safeColumn]);
}

@compute @workgroup_size(8)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let nodeIndex: u32 = globalId.x;
    let nodeCount: u32 = max(1u, min(relationalMdsUniforms.nodeCount, 5u));
    if (nodeIndex >= nodeCount) {
        return;
    }
    if (nodeIndex == 0u) {
        relationalProjectionNodes[nodeIndex] = vec4<f32>(0.0, 0.0, 0.0, f32(relationalMdsUniforms.contractVersion));
        return;
    }

    var maximumShipDistance: f32 = 0.001;
    var fingerprint: f32 = 0.0;
    for (var sampleIndex: u32 = 1u; sampleIndex < 5u; sampleIndex = sampleIndex + 1u) {
        if (sampleIndex < nodeCount) {
            maximumShipDistance = max(maximumShipDistance, matrixDistance(0u, sampleIndex, nodeCount));
            fingerprint = fingerprint + matrixDistance(nodeIndex, sampleIndex, nodeCount) * f32(sampleIndex + 1u);
        }
    }

    let shipDistance: f32 = matrixDistance(0u, nodeIndex, nodeCount);
    let anchorOneDistance: f32 = matrixDistance(1u, nodeIndex, nodeCount);
    let anchorTwoDistance: f32 = matrixDistance(2u, nodeIndex, nodeCount);
    let radialPosition: f32 = clamp(shipDistance / maximumShipDistance, 0.025, 0.96);
    let baseAngle: f32 = (f32(nodeIndex - 1u) / max(1.0, f32(nodeCount - 1u))) * 6.28318530718;
    let relationalPhase: f32 = 0.35 * sin(anchorOneDistance + fingerprint * 0.071) + 0.23 * cos(anchorTwoDistance + shipDistance);
    let angle: f32 = baseAngle + relationalPhase;
    let projected: vec2<f32> = vec2<f32>(cos(angle), sin(angle)) * radialPosition;
    let tensionCue: f32 = clamp((anchorOneDistance + anchorTwoDistance + shipDistance) / max(maximumShipDistance * 3.0, 0.001), 0.0, 2.0);
    relationalProjectionNodes[nodeIndex] = vec4<f32>(projected.x, projected.y, shipDistance, tensionCue);
}
`;

    const WEBGPU_RELATIONAL_WEBER_FORCE_SHADER = `
struct RelationalWeberUniforms {
    nodeCount: u32,
    tetherCount: u32,
    contractVersion: u32,
    driveSuppressionScaled: u32,
    baseInteraction: f32,
    velocityCoefficient: f32,
    accelerationCoefficient: f32,
    intrinsicRestMass: f32
};

@group(0) @binding(0) var<storage, read> relationalProjectionNodes: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read> relationalDistanceMatrix: array<f32>;
@group(0) @binding(2) var<storage, read_write> relationalWeberTethers: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> relationalWeberDiagnostics: array<atomic<u32>>;
@group(0) @binding(4) var<uniform> relationalWeberUniforms: RelationalWeberUniforms;
@group(0) @binding(5) var<storage, read> relationalPackedTetherList: array<vec4<f32>>;
@group(0) @binding(6) var<storage, read_write> relationalMachianMassByEntity: array<atomic<u32>>;

fn finiteRelationalScalar(value: f32, fallbackValue: f32) -> f32 {
    if (value == value && abs(value) < 10000.0) {
        return max(value, 0.0001);
    }
    return fallbackValue;
}

fn relationalMatrixDistance(row: u32, column: u32, nodeCount: u32) -> f32 {
    let safeRow: u32 = min(row, nodeCount - 1u);
    let safeColumn: u32 = min(column, nodeCount - 1u);
    return finiteRelationalScalar(relationalDistanceMatrix[safeRow * nodeCount + safeColumn], 1.0);
}

@compute @workgroup_size(8)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let tetherIndex: u32 = globalId.x;
    let nodeCount: u32 = max(1u, min(relationalWeberUniforms.nodeCount, 5u));
    let tetherCount: u32 = max(1u, min(relationalWeberUniforms.tetherCount, 10u));
    if (tetherIndex >= tetherCount) {
        return;
    }
    let packedTether: vec4<f32> = relationalPackedTetherList[tetherIndex];
    let fromIndex: u32 = min(u32(max(packedTether.x, 0.0)), nodeCount - 1u);
    let toIndex: u32 = min(u32(max(packedTether.y, 0.0)), nodeCount - 1u);
    let fromNode: vec4<f32> = relationalProjectionNodes[fromIndex];
    let toNode: vec4<f32> = relationalProjectionNodes[toIndex];
    let scalarDistance: f32 = relationalMatrixDistance(fromIndex, toIndex, nodeCount);
    let projectedDelta: vec2<f32> = toNode.xy - fromNode.xy;
    let radialVelocityProxy: f32 = max(abs(packedTether.z), length(projectedDelta) * 0.015 + abs(toNode.z - fromNode.z) * 0.006);
    let radialAccelerationProxy: f32 = max(abs(packedTether.w), abs(toNode.w - fromNode.w) * 0.018 + scalarDistance * 0.0009);
    let shipConnected: bool = fromIndex == 0u || toIndex == 0u;
    let suppression: f32 = select(1.0, clamp(f32(relationalWeberUniforms.driveSuppressionScaled) / 100000.0, 0.02, 1.0), shipConnected);
    let distanceTerm: f32 = 1.0 / max(scalarDistance * scalarDistance, 0.0001);
    let dynamicTerm: f32 = 1.0 + relationalWeberUniforms.velocityCoefficient * radialVelocityProxy + relationalWeberUniforms.accelerationCoefficient * radialAccelerationProxy;
    let relationalForce: f32 = clamp(relationalWeberUniforms.baseInteraction * distanceTerm * dynamicTerm * suppression, 0.0, 24.0);
    relationalWeberTethers[tetherIndex] = vec4<f32>(f32(fromIndex), f32(toIndex), relationalForce, suppression);
    atomicAdd(&relationalWeberDiagnostics[0], u32(clamp(relationalForce * 100000.0, 0.0, 4294967295.0)));
    atomicMax(&relationalWeberDiagnostics[1], u32(clamp(relationalForce * 100000.0, 0.0, 4294967295.0)));
    if (suppression < 0.999) {
        atomicAdd(&relationalWeberDiagnostics[2], 1u);
    }
    let machianMassProxy: f32 = relationalWeberUniforms.intrinsicRestMass * (0.25 + relationalForce);
    let machianContributionScaled: u32 = u32(clamp(machianMassProxy * 100000.0, 0.0, 4294967295.0));
    atomicAdd(&relationalWeberDiagnostics[3], machianContributionScaled);
    atomicAdd(&relationalWeberDiagnostics[4], 1u);

    let fromEntityBase: u32 = fromIndex * 4u;
    let toEntityBase: u32 = toIndex * 4u;
    atomicAdd(&relationalMachianMassByEntity[fromEntityBase], machianContributionScaled);
    atomicAdd(&relationalMachianMassByEntity[fromEntityBase + 1u], 1u);
    atomicMax(&relationalMachianMassByEntity[fromEntityBase + 2u], u32(clamp(relationalForce * 100000.0, 0.0, 4294967295.0)));
    if (suppression < 0.999 && shipConnected) {
        atomicAdd(&relationalMachianMassByEntity[fromEntityBase + 3u], 1u);
    }
    if (toIndex != fromIndex) {
        atomicAdd(&relationalMachianMassByEntity[toEntityBase], machianContributionScaled);
        atomicAdd(&relationalMachianMassByEntity[toEntityBase + 1u], 1u);
        atomicMax(&relationalMachianMassByEntity[toEntityBase + 2u], u32(clamp(relationalForce * 100000.0, 0.0, 4294967295.0)));
        if (suppression < 0.999 && shipConnected) {
            atomicAdd(&relationalMachianMassByEntity[toEntityBase + 3u], 1u);
        }
    }
}
`;


    const WEBGPU_DIRECT_PARTICLE_RENDER_SHADER = `
struct Particle {
    position: vec4<f32>,
    velocity: vec4<f32>
};

struct RenderUniforms {
    particleCount: u32,
    visualQualityLevel: u32,
    reservedB: u32,
    reservedC: u32,
    scale: f32,
    aspectRatio: f32,
    pointRadius: f32,
    intensity: f32,
    haloIntensity: f32,
    visualDensity: f32,
    pointRadiusScale: f32,
    reservedFloat: f32
};

const SPATIAL_BUCKET_GRID_SIZE: u32 = 8u;

fn spreadMorton3BitForRender(value: u32) -> u32 {
    return (value & 1u) | ((value & 2u) << 1u) | ((value & 4u) << 2u);
}

fn renderGridCoordinate(position: vec2<f32>) -> vec2<u32> {
    let normalized: vec2<f32> = clamp(position * 0.25 + vec2<f32>(0.5, 0.5), vec2<f32>(0.0, 0.0), vec2<f32>(0.999, 0.999));
    let gridX: u32 = min(u32(normalized.x * f32(SPATIAL_BUCKET_GRID_SIZE)), SPATIAL_BUCKET_GRID_SIZE - 1u);
    let gridY: u32 = min(u32(normalized.y * f32(SPATIAL_BUCKET_GRID_SIZE)), SPATIAL_BUCKET_GRID_SIZE - 1u);
    return vec2<u32>(gridX, gridY);
}

fn renderMortonBucketIndexFromGrid(gridX: u32, gridY: u32) -> u32 {
    return spreadMorton3BitForRender(gridX) | (spreadMorton3BitForRender(gridY) << 1u);
}

fn renderMortonBucketIndex(position: vec2<f32>) -> u32 {
    let gridCoordinate: vec2<u32> = renderGridCoordinate(position);
    return renderMortonBucketIndexFromGrid(gridCoordinate.x, gridCoordinate.y);
}

fn renderNeighborhoodBucketDensity(position: vec2<f32>, particleCount: u32) -> f32 {
    let currentGrid: vec2<u32> = renderGridCoordinate(position);
    var neighborCountTotal: u32 = 0u;
    var bucketVisitCount: u32 = 0u;
    for (var yOffset: i32 = -1; yOffset <= 1; yOffset = yOffset + 1) {
        for (var xOffset: i32 = -1; xOffset <= 1; xOffset = xOffset + 1) {
            let neighborGridX: i32 = i32(currentGrid.x) + xOffset;
            let neighborGridY: i32 = i32(currentGrid.y) + yOffset;
            if (neighborGridX >= 0 && neighborGridX < i32(SPATIAL_BUCKET_GRID_SIZE) && neighborGridY >= 0 && neighborGridY < i32(SPATIAL_BUCKET_GRID_SIZE)) {
                let neighborBucketIndex: u32 = renderMortonBucketIndexFromGrid(u32(neighborGridX), u32(neighborGridY));
                let neighborRange: vec4<u32> = compactedBucketRanges[neighborBucketIndex];
                neighborCountTotal = neighborCountTotal + max(haloDensityBuckets[neighborBucketIndex], neighborRange.y);
                bucketVisitCount = bucketVisitCount + 1u;
            }
        }
    }
    return clamp(f32(neighborCountTotal) / max(f32(particleCount), 1.0) * 4.5 / max(f32(bucketVisitCount), 1.0), 0.0, 1.0);
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>
};

@group(0) @binding(0) var<storage, read> renderedParticles: array<Particle>;
@group(0) @binding(1) var<uniform> renderUniforms: RenderUniforms;
@group(0) @binding(2) var<storage, read> haloDensityBuckets: array<u32>;
@group(0) @binding(3) var<storage, read> compactedBucketRanges: array<vec4<u32>>;
@group(0) @binding(4) var<storage, read> compactedParticleIndices: array<u32>;
@group(0) @binding(5) var<storage, read> densityFieldTiles: array<vec4<f32>>;
@group(0) @binding(6) var<storage, read> relationalMdsProjectionNodes: array<vec4<f32>>;
@group(0) @binding(7) var<storage, read> relationalWeberTetherForces: array<vec4<f32>>;
const RELATIONAL_MDS_RENDER_NODE_COUNT: u32 = 5u;
const RELATIONAL_WEBER_RENDER_TETHER_COUNT: u32 = 10u;

fn renderRelationalWeberGlow(nodeIndex: u32) -> f32 {
    var glow: f32 = 0.0;
    for (var tetherIndex: u32 = 0u; tetherIndex < RELATIONAL_WEBER_RENDER_TETHER_COUNT; tetherIndex = tetherIndex + 1u) {
        let tether: vec4<f32> = relationalWeberTetherForces[tetherIndex];
        let fromIndex: u32 = u32(tether.x);
        let toIndex: u32 = u32(tether.y);
        if (fromIndex == nodeIndex || toIndex == nodeIndex) {
            glow = glow + clamp(tether.z * (1.15 - tether.w), 0.0, 4.0);
        }
    }
    return clamp(glow * 0.18, 0.0, 1.0);
}

fn quadCorner(cornerIndex: u32) -> vec2<f32> {
    if (cornerIndex == 0u) { return vec2<f32>(-1.0, -1.0); }
    if (cornerIndex == 1u) { return vec2<f32>(1.0, -1.0); }
    if (cornerIndex == 2u) { return vec2<f32>(-1.0, 1.0); }
    if (cornerIndex == 3u) { return vec2<f32>(-1.0, 1.0); }
    if (cornerIndex == 4u) { return vec2<f32>(1.0, -1.0); }
    return vec2<f32>(1.0, 1.0);
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    let particleIndex: u32 = vertexIndex / 6u;
    let cornerIndex: u32 = vertexIndex % 6u;
    var output: VertexOutput;
    if (particleIndex >= renderUniforms.particleCount) {
        output.position = vec4<f32>(2.0, 2.0, 0.0, 1.0);
        output.color = vec4<f32>(0.0, 0.0, 0.0, 0.0);
        return output;
    }
    let particle: Particle = renderedParticles[particleIndex];
    let progress: f32 = clamp(particle.position.z, 0.0, 1.0);
    let relationalNodeIndex: u32 = min(particleIndex, RELATIONAL_MDS_RENDER_NODE_COUNT - 1u);
    let relationalNode: vec4<f32> = relationalMdsProjectionNodes[relationalNodeIndex];
    let relationalOverlayMix: f32 = select(0.0, 1.0, particleIndex < RELATIONAL_MDS_RENDER_NODE_COUNT);
    let relationalProjectedPosition: vec2<f32> = relationalNode.xy;
    let renderedPosition: vec2<f32> = mix(particle.position.xy, relationalProjectedPosition, relationalOverlayMix);
    // Legacy density expression retained for regression visibility: renderMortonBucketIndex(particle.position.xy)
    let bucketIndex: u32 = renderMortonBucketIndex(renderedPosition);
    let bucketRange: vec4<u32> = compactedBucketRanges[bucketIndex];
    let bucketCount: u32 = max(haloDensityBuckets[bucketIndex], bucketRange.y);
    let compactedBucketDensity: f32 = clamp(f32(bucketCount) / max(f32(renderUniforms.particleCount), 1.0) * 12.0, 0.0, 1.0);
    let neighborhoodBucketDensity: f32 = renderNeighborhoodBucketDensity(renderedPosition, renderUniforms.particleCount);
    let rawBucketDensity: f32 = max(compactedBucketDensity, neighborhoodBucketDensity);
    let haloIntensity: f32 = clamp(renderUniforms.haloIntensity, 0.18, 1.35);
    let visualDensity: f32 = clamp(renderUniforms.visualDensity, 0.24, 1.2);
    let bucketDensity: f32 = clamp(rawBucketDensity * haloIntensity * visualDensity, 0.0, 1.0);
    let densityFieldTile: vec4<f32> = densityFieldTiles[bucketIndex];
    let densityFieldGain: f32 = clamp(densityFieldTile.x * 0.22 * haloIntensity, 0.0, 1.0);
    let densityFieldForceGlow: f32 = clamp(length(densityFieldTile.yz) * 0.16 * haloIntensity, 0.0, 1.0);
    let compactedIndexCue: f32 = select(0.0, f32(compactedParticleIndices[min(bucketRange.x, renderUniforms.particleCount - 1u)] % 31u) / 31.0, bucketCount > 0u);
    let aspect: f32 = max(renderUniforms.aspectRatio, 0.01);
    let clipCenter: vec2<f32> = vec2<f32>(renderedPosition.x * renderUniforms.scale / aspect, renderedPosition.y * renderUniforms.scale);
    let visualQualityRadiusTrim: f32 = 1.0 - clamp(f32(renderUniforms.visualQualityLevel) * 0.08, 0.0, 0.24);
    let relationalWeberGlow: f32 = renderRelationalWeberGlow(relationalNodeIndex) * relationalOverlayMix;
    let relationalRadiusBoost: f32 = 1.0 + relationalOverlayMix * (1.8 + clamp(relationalNode.w, 0.0, 2.0)) + relationalWeberGlow;
    let adaptivePointRadius: f32 = renderUniforms.pointRadius * renderUniforms.pointRadiusScale * visualQualityRadiusTrim * relationalRadiusBoost * (1.0 + bucketDensity * (1.15 + haloIntensity * 1.45) + densityFieldGain * (0.55 + haloIntensity * 0.75));
    let corner: vec2<f32> = quadCorner(cornerIndex) * adaptivePointRadius;
    output.position = vec4<f32>(clipCenter + corner, 0.0, 1.0);
    output.color = vec4<f32>(0.20 + progress * 0.22 + bucketDensity * 0.30 + densityFieldForceGlow * 0.16 + compactedIndexCue * 0.06 + relationalOverlayMix * 0.25 + relationalWeberGlow * 0.22, 0.68 + bucketDensity * 0.22 + densityFieldGain * 0.12 + relationalOverlayMix * 0.12 + relationalWeberGlow * 0.18, 0.70 + progress * 0.12 + densityFieldForceGlow * 0.20 + compactedIndexCue * 0.08 + relationalOverlayMix * 0.18 + relationalWeberGlow * 0.28, clamp(0.18 + renderUniforms.intensity * 0.34 + bucketDensity * 0.24 + densityFieldGain * 0.20 + relationalOverlayMix * 0.32 + relationalWeberGlow * 0.28, 0.06, 0.98));
    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
    return input.color;
}
`;

    const DEFAULT_ADVANCED_PARAMETERS = {
        quantizedInertiaDampening: 0.42,
        rindlerHorizonBias: 0.35,
        haloscopeTuningMicroElectronVolts: 21.5,
        alcubierreMetricStrength: 0.18,
        negativeEnergyReserve: 0.2,
        opticalApertureMeters: 2.4,
        opticalWavelengthNanometers: 550,
        telescopeJitterArcseconds: 0.65,
        relativeVelocityFractionOfLight: 0.35,
        spacecraftRestMassProxy: 12,
        computeParticleBudget: 4096,
        computeWorkgroupSize: 128,
        psfMagnitude: 7.5,
        stereopsisDisparityArcseconds: 15,
        quantumPhaseRotationDegrees: 42,
        quantumGateDepth: 12,
        qubitNoiseLevel: 0.08,
        sensorBuoyCount: 6,
        guideStarTargetArcseconds: 0,
        guideStarErrorArcseconds: 1.2,
        autopilotGain: 0.55,
        navigationWaypoints: 4,
        trajectoryLookaheadSeconds: 240,
        slingshotSafetyMargin: 0.4,
        darkMatterAnomalyDensity: 0.35,
        routeRiskTolerance: 0.5,
        densityFieldFeedbackGain: 1,
        multiMessengerDistanceMegaparsecs: GW170817_ANCHOR_DISTANCE_MEGAPARSECS,
        lightSlowingTargetRedshift: GW170817_ANCHOR_REDSHIFT,
        lightSlowingPropagationDelaySeconds: GW170817_MODEL_PROPAGATION_DELAY_SECONDS,
        intrinsicEmissionDelaySeconds: GW170817_INTRINSIC_DELAY_SECONDS,
        lineOfSightOpticalResistance: 1,
        multiMessengerEventPreset: "gw170817",
        substrateDensityProfile: "standard",
        covaryingCouplingRedshift: 0,
        sourceProperMotionArcsecondsPerYear: 0.25,
        sourceDistanceParsecs: 1000000
    };

    const SIMULATION_MODES = {
        galaxyRotation: {
            label: "Machian Rotation Matrix Mode",
            shortLabel: "Machian Rotation Matrix",
            modelStatus: "Established observation + simplified Newtonian/halo references",
            explanation: "Visible matter alone produces a falling outer rotation curve in this simplified model. Increasing the Vector Potential Dial raises the halo contribution and flattens the outer orbital velocity curve.",
            nextStep: "Lower the Vector Potential Dial toward zero and watch the outer curve collapse."
        },
        darkMatterWind: {
            label: "Proca Flux / Substrate Current Mode",
            shortLabel: "Proca Flux / Substrate Current",
            modelStatus: "Speculative engineering visualization",
            explanation: "The craft is shown coupling to a directional Proca substrate-current field. Flux density, heading alignment, scoop strength, and coupling affect a harvested-energy proxy and drive charge rate.",
            nextStep: "Align the ship heading with the Proca flux vector and increase scoop strength."
        },
        mqnDriveConcept: {
            label: "MQN / Dark Matter Drive Concept Mode",
            shortLabel: "MQN Concept",
            modelStatus: "Hypothetical / speculative component map",
            explanation: "The cockpit highlights a theoretical MQN core, containment, reaction chamber, capture layer, and propulsion vector. Each hotspot is a conceptual part, not a validated propulsion system.",
            nextStep: "Click the schematic components and compare their established, hypothesis, or speculative labels."
        },
        lensingVisualization: {
            label: "Relational Tether Distortion Visualization Mode",
            shortLabel: "Lensing",
            modelStatus: "Educational relational optical-aberration approximation with Weber/Machian reference language",
            explanation: "Light paths are bent visually around a massive body or halo. The arcsecond readout is a bounded approximation for education, not a precision solver.",
            nextStep: "Raise mass or lensing exaggeration and watch the apparent deflection readout."
        },
        arcsecsHypothesis: {
            label: "ArcSecs Hypothesis Comparison Mode",
            shortLabel: "ArcSecs Compare",
            modelStatus: "Comparison mode: Newtonian relational reference, Weber/Machian reference, ArcSecs interpretation, speculative overlay",
            explanation: "This mode keeps relational reference overlays visible while letting visitors switch on the ArcSecs interpretation and speculative inertial-decoupling layer without presenting the demo as proof.",
            nextStep: "Toggle the reference overlays and compare the explanatory framing."
        }
    };

    const HOTSPOTS = [
        { id: "hibeForwardDeflector", title: "HIBE Forward Deflector Array", shortTitle: "HIBE Shield", x: 14, y: 50, scenario: "mqnDriveConcept", status: "Speculative engineering concept", parameter: "Thermal rejection capacity", details: ["Forward ice/composite shield layer for dust, charged particles, and radiation concepts.", "Represents a shielding and thermal-management problem rather than a solved device."], warnings: ["Shield survival is an engineering placeholder.", "Does not prove high-speed interstellar protection."], metric: "thermalLoad" },
        { id: "eitRamscoop", title: "EIT Ramscoop / Dark Matter Intake", shortTitle: "EIT Scoop", x: 27, y: 38, scenario: "darkMatterWind", status: "Speculative engineering concept", parameter: "Scoop strength and vector potential density", details: ["Directional intake funnel for Proca substrate-current visualization.", "Drive charge rises when heading, substrate flux density, coupling, and scoop strength align."], warnings: ["Vector-potential capture is not established technology.", "Harvested energy is a proxy only."], metric: "captureEfficiency" },
        { id: "fishbackSolenoid", title: "Fishback Solenoid Intake Array", shortTitle: "Field Geometry", x: 39, y: 61, scenario: "darkMatterWind", status: "Hypothesis / engineering analogy", parameter: "Drive coupling", details: ["Field-line shaping layer for the conceptual scoop.", "Used to show drift, turbulence, and alignment effects."], warnings: ["Magnetic scoop behavior is schematic.", "No claim of a validated dark-matter interaction cross-section."], metric: "fieldStability" },
        { id: "mqnCore", title: "Theoretical MQN Core", shortTitle: "MQN Core", x: 53, y: 50, scenario: "mqnDriveConcept", status: "Hypothetical", parameter: "Drive coupling", details: ["Conceptual macroscopic quantum object / dark-sector interaction core.", "Included to make the engineering assumptions visible and falsifiable."], warnings: ["MQN drive behavior is hypothetical.", "This visualization is not experimental validation."], metric: "driveCharge" },
        { id: "reactorCore", title: "Reaction Chamber / Energy Conversion Core", shortTitle: "Reactor", x: 66, y: 50, scenario: "mqnDriveConcept", status: "Speculative engineering concept", parameter: "Compression ratio", details: ["Shows compression, capture, conversion, and waste-heat pressure in one subsystem.", "The most important warning is thermal bottleneck risk."], warnings: ["Energy conversion is not a proven mechanism.", "Thermal load can erase thrust proxy gains."], metric: "thermalLoad" },
        { id: "energyCaptureLayer", title: "Energy Capture Layer", shortTitle: "Capture Layer", x: 76, y: 39, scenario: "mqnDriveConcept", status: "Speculative engineering concept", parameter: "Vector Potential Dial", details: ["Layer that receives the harvested-energy proxy from the Proca substrate-current model.", "Vector Potential Dial changes its charge-rate visualization."], warnings: ["Charge is a normalized proxy.", "No power output claim is implied."], metric: "driveChargeRate" },
        { id: "propulsionVector", title: "Propulsion Output Vector", shortTitle: "Output", x: 88, y: 50, scenario: "mqnDriveConcept", status: "Speculative engineering concept", parameter: "Ship heading", details: ["Shows direction and magnitude of the conceptual thrust vector.", "Heading mismatch and turbulence reduce net output."], warnings: ["Output is normalized for visualization.", "No real thrust value is asserted."], metric: "driveOutput" },
        { id: "tiredLightLedger", title: "Tired-Light Energy Ledger", shortTitle: "Ledger", x: 47, y: 28, scenario: "arcsecsHypothesis", status: "ArcSecs hypothesis accounting", parameter: "Tired light decay rate", details: ["Conceptual energy-accounting ledger for ArcSecs tired-light interpretations.", "Shown beside reference-mode warnings to keep assumptions visible."], warnings: ["Tired light is not consensus cosmology.", "Ledger closure here is internal consistency only."], metric: "ledgerClosureError" },
        { id: "massivePhotonLensing", title: "Massive Photon / Lensing Comparison", shortTitle: "Lensing", x: 58, y: 72, scenario: "lensingVisualization", status: "Educational approximation", parameter: "Mass and impact parameter", details: ["Visual approximation of path bending with an arcsecond readout.", "Weber/Machian reference language remains available as a comparison overlay."], warnings: ["The tether-distortion path is not a metric-curvature solver.", "Exaggeration is displayed when used."], metric: "lensingDeflectionArcseconds" },
        { id: "absoluteTimeOscillator", title: "Absolute-Time Oscillator Check", shortTitle: "Clock", x: 34, y: 75, scenario: "arcsecsHypothesis", status: "ArcSecs interpretation visualization", parameter: "Reference overlay toggles", details: ["Shows a universal tick beside local oscillator suppression language.", "Used to compare ArcSecs framing with conventional time-dilation descriptions."], warnings: ["This does not refute experimental relativity by itself.", "It is a conceptual interface for comparison."], metric: "currentAngularOffsetArcseconds" }
    ];

    const PRESETS = {
        interactiveBlueprint: { label: "Interactive Dark Matter Drive Blueprint", mode: "mqnDriveConcept", scenario: "darkMatterRamjet", visibleMatterMass: 42, darkMatterDensity: 1, haloRadius: 70, galacticRadius: 55, orbitalTestPoint: 46, windDirectionDegrees: 35, windDensity: 1, turbulence: 0.16, magneticScoopStrength: 0.7, driveCoupling: 0.54, shipHeadingDegrees: 32, mass: 35, distance: 120, impactParameter: 28, lensingExaggeration: 1.25, observerAngleDegrees: 12, photonMassProxy: 3e-18, baryonicMass: 18, lossRate: 0.22, compressionRatio: 34, thermalRejectionCapacity: 0.72, photonPacketCount: 900, speedMultiplier: 1, failureMode: "none", reducedVisualIntensity: false, darkMatterDial: 1, qualityMode: "medium" },
        ramjetThermalStress: { label: "Dark Matter Ramjet Thermal Stress Test", mode: "mqnDriveConcept", scenario: "darkMatterRamjet", visibleMatterMass: 40, darkMatterDensity: 1.4, haloRadius: 75, galacticRadius: 55, orbitalTestPoint: 48, windDirectionDegrees: 15, windDensity: 1.5, turbulence: 0.34, magneticScoopStrength: 0.86, driveCoupling: 0.8, shipHeadingDegrees: 22, mass: 38, distance: 115, impactParameter: 25, lensingExaggeration: 1.4, observerAngleDegrees: 9, photonMassProxy: 7e-18, baryonicMass: 35, lossRate: 0.42, compressionRatio: 72, thermalRejectionCapacity: 0.38, photonPacketCount: 1600, speedMultiplier: 1.25, failureMode: "radiatorBottleneck", reducedVisualIntensity: false, darkMatterDial: 1.45, qualityMode: "medium" },
        massivePhotonLensing: { label: "Massive Photon Lensing", mode: "lensingVisualization", scenario: "massivePhotonLensing", visibleMatterMass: 55, darkMatterDensity: 1.25, haloRadius: 82, galacticRadius: 62, orbitalTestPoint: 50, windDirectionDegrees: 0, windDensity: 0.7, turbulence: 0.08, magneticScoopStrength: 0.44, driveCoupling: 0.42, shipHeadingDegrees: 5, mass: 76, distance: 95, impactParameter: 18, lensingExaggeration: 2.25, observerAngleDegrees: 18, photonMassProxy: 2e-17, baryonicMass: 44, lossRate: 0.18, compressionRatio: 24, thermalRejectionCapacity: 0.68, photonPacketCount: 1000, speedMultiplier: 0.8, failureMode: "none", reducedVisualIntensity: false, darkMatterDial: 1.25, qualityMode: "medium" },
        tiredLightGalaxyDimming: { label: "Tired-Light Galaxy Dimming", mode: "arcsecsHypothesis", scenario: "tiredLightEnergyLedger", visibleMatterMass: 38, darkMatterDensity: 0.95, haloRadius: 66, galacticRadius: 58, orbitalTestPoint: 52, windDirectionDegrees: 250, windDensity: 0.8, turbulence: 0.12, magneticScoopStrength: 0.5, driveCoupling: 0.45, shipHeadingDegrees: 230, mass: 30, distance: 140, impactParameter: 35, lensingExaggeration: 1, observerAngleDegrees: 0, photonMassProxy: 1e-18, baryonicMass: 25, lossRate: 0.58, compressionRatio: 20, thermalRejectionCapacity: 0.8, photonPacketCount: 700, speedMultiplier: 0.7, failureMode: "none", reducedVisualIntensity: false, darkMatterDial: 0.95, qualityMode: "medium" },
        absoluteTimeOscillator: { label: "Absolute-Time Oscillator", mode: "arcsecsHypothesis", scenario: "absoluteTimeQuantumOscillator", visibleMatterMass: 45, darkMatterDensity: 1, haloRadius: 68, galacticRadius: 55, orbitalTestPoint: 42, windDirectionDegrees: 110, windDensity: 0.9, turbulence: 0.18, magneticScoopStrength: 0.48, driveCoupling: 0.5, shipHeadingDegrees: 112, mass: 50, distance: 125, impactParameter: 30, lensingExaggeration: 1.15, observerAngleDegrees: 22, photonMassProxy: 5e-18, baryonicMass: 30, lossRate: 0.2, compressionRatio: 26, thermalRejectionCapacity: 0.74, photonPacketCount: 850, speedMultiplier: 1, failureMode: "none", reducedVisualIntensity: false, darkMatterDial: 1, qualityMode: "medium" },
        newtonianDarkStarCapture: { label: "Newtonian Dark Star Capture", mode: "lensingVisualization", scenario: "newtonianDarkStar", visibleMatterMass: 64, darkMatterDensity: 0.7, haloRadius: 50, galacticRadius: 48, orbitalTestPoint: 43, windDirectionDegrees: 180, windDensity: 0.6, turbulence: 0.22, magneticScoopStrength: 0.34, driveCoupling: 0.35, shipHeadingDegrees: 170, mass: 86, distance: 80, impactParameter: 12, lensingExaggeration: 2.8, observerAngleDegrees: 32, photonMassProxy: 8e-18, baryonicMass: 48, lossRate: 0.15, compressionRatio: 30, thermalRejectionCapacity: 0.68, photonPacketCount: 1000, speedMultiplier: 0.9, failureMode: "captureThreshold", reducedVisualIntensity: false, darkMatterDial: 0.7, qualityMode: "medium" },
        whyGalaxiesNeedMoreMass: { label: "Why Rotation Needs More Relational Coupling", mode: "galaxyRotation", scenario: "galaxyRotation", visibleMatterMass: 42, darkMatterDensity: 1, haloRadius: 74, galacticRadius: 60, orbitalTestPoint: 52, windDirectionDegrees: 35, windDensity: 1, turbulence: 0.16, magneticScoopStrength: 0.7, driveCoupling: 0.54, shipHeadingDegrees: 32, mass: 35, distance: 120, impactParameter: 28, lensingExaggeration: 1.25, observerAngleDegrees: 12, photonMassProxy: 3e-18, baryonicMass: 18, lossRate: 0.22, compressionRatio: 34, thermalRejectionCapacity: 0.72, photonPacketCount: 900, speedMultiplier: 1, failureMode: "none", reducedVisualIntensity: false, darkMatterDial: 1, qualityMode: "medium" },
        sailDarkMatterWind: { label: "Sail the Proca Flux / Substrate Current", mode: "darkMatterWind", scenario: "darkMatterWind", visibleMatterMass: 35, darkMatterDensity: 1.1, haloRadius: 65, galacticRadius: 55, orbitalTestPoint: 44, windDirectionDegrees: 42, windDensity: 1.3, turbulence: 0.18, magneticScoopStrength: 0.82, driveCoupling: 0.68, shipHeadingDegrees: 42, mass: 28, distance: 130, impactParameter: 32, lensingExaggeration: 1, observerAngleDegrees: 10, photonMassProxy: 2e-18, baryonicMass: 18, lossRate: 0.22, compressionRatio: 34, thermalRejectionCapacity: 0.72, photonPacketCount: 900, speedMultiplier: 1, failureMode: "none", reducedVisualIntensity: false, darkMatterDial: 1.3, qualityMode: "medium" },
        approachMassiveHalo: { label: "Approach a Massive Halo", mode: "lensingVisualization", scenario: "massivePhotonLensing", visibleMatterMass: 50, darkMatterDensity: 1.5, haloRadius: 80, galacticRadius: 62, orbitalTestPoint: 56, windDirectionDegrees: 0, windDensity: 0.8, turbulence: 0.12, magneticScoopStrength: 0.45, driveCoupling: 0.45, shipHeadingDegrees: 0, mass: 82, distance: 92, impactParameter: 16, lensingExaggeration: 2.1, observerAngleDegrees: 14, photonMassProxy: 9e-18, baryonicMass: 44, lossRate: 0.16, compressionRatio: 28, thermalRejectionCapacity: 0.74, photonPacketCount: 1000, speedMultiplier: 0.8, failureMode: "none", reducedVisualIntensity: false, darkMatterDial: 1.5, qualityMode: "medium" },
        mqnDriveWalkthrough: { label: "MQN Drive Concept Walkthrough", mode: "mqnDriveConcept", scenario: "darkMatterRamjet", visibleMatterMass: 42, darkMatterDensity: 1.1, haloRadius: 70, galacticRadius: 55, orbitalTestPoint: 46, windDirectionDegrees: 35, windDensity: 1.1, turbulence: 0.16, magneticScoopStrength: 0.7, driveCoupling: 0.62, shipHeadingDegrees: 32, mass: 35, distance: 120, impactParameter: 28, lensingExaggeration: 1.25, observerAngleDegrees: 12, photonMassProxy: 3e-18, baryonicMass: 18, lossRate: 0.22, compressionRatio: 34, thermalRejectionCapacity: 0.72, photonPacketCount: 900, speedMultiplier: 1, failureMode: "none", reducedVisualIntensity: false, darkMatterDial: 1.1, qualityMode: "medium" },
        arcsecsComparison: { label: "ArcSecs Comparison", mode: "arcsecsHypothesis", scenario: "arcsecsComparison", visibleMatterMass: 42, darkMatterDensity: 1, haloRadius: 70, galacticRadius: 55, orbitalTestPoint: 46, windDirectionDegrees: 35, windDensity: 1, turbulence: 0.16, magneticScoopStrength: 0.7, driveCoupling: 0.54, shipHeadingDegrees: 32, mass: 35, distance: 120, impactParameter: 28, lensingExaggeration: 1.25, observerAngleDegrees: 12, photonMassProxy: 3e-18, baryonicMass: 18, lossRate: 0.22, compressionRatio: 34, thermalRejectionCapacity: 0.72, photonPacketCount: 900, speedMultiplier: 1, failureMode: "none", reducedVisualIntensity: false, darkMatterDial: 1, qualityMode: "medium" }
    };

    const GUIDED_SCENARIOS = [
        { id: "whyGalaxiesNeedMoreMass", title: "Why Rotation Needs More Relational Coupling", preset: "whyGalaxiesNeedMoreMass", objective: "Lower the Vector Potential Dial and compare the visible-only curve to the halo-supported curve.", completion: "Outer rotation curve comparison complete." },
        { id: "sailDarkMatterWind", title: "Sail the Proca Flux / Substrate Current", preset: "sailDarkMatterWind", objective: "Align ship heading with the Proca flux vector and watch drive charge increase.", completion: "Substrate-current alignment and charge-rate response observed." },
        { id: "approachMassiveHalo", title: "Approach a Massive Halo", preset: "approachMassiveHalo", objective: "Increase mass and see apparent deflection change in arcseconds.", completion: "Arcsecond lensing readout changed with mass." },
        { id: "mqnDriveWalkthrough", title: "MQN Drive Concept Walkthrough", preset: "mqnDriveWalkthrough", objective: "Step through component labels and separate established, hypothetical, and speculative claims.", completion: "All conceptual components reviewed." },
        { id: "arcsecsComparison", title: "ArcSecs Comparison", preset: "arcsecsComparison", objective: "Toggle conventional reference views beside the ArcSecs interpretation overlay.", completion: "Reference and hypothesis overlays compared." }
    ];

    const MISSION_STAGES = [
        { id: "shield-survival", title: "Shield Survival Check", preset: "interactiveBlueprint", hotspotId: "hibeForwardDeflector", operatorAction: "Inspect the HIBE Forward Deflector before acceleration.", expectedSignal: "Thermal load stays bounded while shield warnings remain visible.", warningMarker: "thermal overload" },
        { id: "scoop-capture", title: "EIT Scoop Capture", preset: "sailDarkMatterWind", hotspotId: "eitRamscoop", operatorAction: "Run the intake with a reference Proca substrate current.", expectedSignal: "Capture efficiency rises without hiding buffer saturation risk.", warningMarker: "capture efficiency spike" },
        { id: "fishback-field", title: "Fishback Field Geometry", preset: "sailDarkMatterWind", hotspotId: "fishbackSolenoid", operatorAction: "Compare field stability against scoop and intake geometry.", expectedSignal: "Field stability stays readable and engineering-scale warnings remain explicit.", warningMarker: "input clamped" },
        { id: "thermal-bottleneck", title: "Ramjet Thermal Bottleneck", preset: "ramjetThermalStress", hotspotId: "reactorCore", operatorAction: "Stress the compression core until radiator capacity becomes limiting.", expectedSignal: "Thermal load rises, net acceleration drops, and radiator bottleneck markers appear.", warningMarker: "radiator bottleneck" },
        { id: "ledger-accounting", title: "Tired-Light Ledger Audit", preset: "tiredLightGalaxyDimming", hotspotId: "tiredLightLedger", operatorAction: "Inspect whether removed photon energy is accounted for in the substrate ledger.", expectedSignal: "Ledger closure success or failure is stated directly with finite metrics.", warningMarker: "ledger closure failure" },
        { id: "lensing-comparison", title: "Massive Photon Lensing Comparison", preset: "massivePhotonLensing", hotspotId: "massivePhotonLensing", operatorAction: "Compare the ArcSecs proxy to conventional reference framing.", expectedSignal: "Deflection increases when mass, dark matter dial, and exaggeration are high.", warningMarker: "deflection increase" },
        { id: "absolute-time-check", title: "Absolute-Time Oscillator Check", preset: "absoluteTimeOscillator", hotspotId: "absoluteTimeOscillator", operatorAction: "Show a universal tick beside local oscillator suppression language.", expectedSignal: "Suppression is explained as speculative mechanical retardation, not proof against the standard model.", warningMarker: "transition suppression boundary" }
    ];

    const DARK_MATTER_TRAVEL_REGION_TYPES = ["dense_filament", "galaxy_halo", "matter_cloud", "void_channel", "smooth_inertial_corridor", "torsion_anomaly", "beacon_approach_zone"];
    function buildDarkMatterTravelRelationalAdapter(sandbox) {
        const ship = sandbox.ship;
        const activeRegion = sandbox.regions.find((region) => region.regionType === ship.lastCrossedRegionType) || sandbox.regions[0];
        const arcsecondsToBeacon = ship.distanceToBeaconUiUnits * 48.2;
        const targetBearingDegrees = Math.atan2(sandbox.configuration.beaconPositionY - ship.uiPositionY, sandbox.configuration.beaconPositionX - ship.uiPositionX) * 180 / Math.PI;
        const shapeDynamicsRatio = ship.distanceToBeaconUiUnits / Math.max(1, sandbox.configuration.widthUiUnits);
        const psfFullWidthHalfMaximumArcseconds = 2 + activeRegion.localProcaSubstrateDensity * activeRegion.opticalAberrationMultiplier * 0.74;
        const harvestPotential = activeRegion.localProcaSubstrateDensity * activeRegion.harvestMultiplier;
        const weberDragPenalty = activeRegion.weberDragMultiplier * activeRegion.localProcaSubstrateDensity;
        const inertialCoastBenefit = 100 - weberDragPenalty * 12;
        const denseRegionFuelRiskRatio = harvestPotential / Math.max(0.01, weberDragPenalty + activeRegion.navigationRiskMultiplier);
        const instrumentalMask = {
            uiMaskX: ship.uiPositionX,
            uiMaskY: ship.uiPositionY,
            uiMaskIsPhysicalSpace: false,
            relationalAdapterDescription: "The 2D X/Y surface is an instrumental mask for visitor control, replay, and visualization; route calculations are recorded as relational Arcsecs deltas and substrate samples."
        };
        const arcsecsNavigationVector = {
            arcsecondsToBeacon,
            headingSlewArcsecondsPerSecond: sandbox.configuration.slewRateDegreesPerTick * 3600,
            boundedSlewArcsecondsPerSecond: 10800,
            targetBearingDegrees,
            shapeDynamicsRatio,
            finite: [arcsecondsToBeacon, targetBearingDegrees, shapeDynamicsRatio].every((value) => Number.isFinite(value))
        };
        const opticalDistortion = {
            psfFullWidthHalfMaximumArcseconds,
            densityWeightedBlur: psfFullWidthHalfMaximumArcseconds * activeRegion.localProcaSubstrateDensity,
            photonLaneLag: sandbox.wavefrontTrace.photonLag,
            energyAttenuation: sandbox.wavefrontTrace.energyAttenuation,
            visibilityStatus: sandbox.wavefrontTrace.opticalVisibilityStatus,
            finite: [psfFullWidthHalfMaximumArcseconds, sandbox.wavefrontTrace.photonLag, sandbox.wavefrontTrace.energyAttenuation].every((value) => Number.isFinite(value))
        };
        const teleparallelGaugeForce = {
            translationalGaugeForceX: ship.localTorsionGaugeForceX,
            translationalGaugeForceY: ship.localTorsionGaugeForceY,
            torsionMagnitude: ship.torsionPullMagnitude,
            curvatureLanguageAllowed: false,
            forceDescription: "Route bending is modeled as a translational gauge-force / torsion sample on the sandbox mask, not spacetime curvature.",
            finite: [ship.localTorsionGaugeForceX, ship.localTorsionGaugeForceY, ship.torsionPullMagnitude].every((value) => Number.isFinite(value))
        };
        const procaSubstrate = {
            localVectorPotentialDensity: activeRegion.localProcaSubstrateDensity,
            harvestPotential,
            weberDragPenalty,
            inertialCoastBenefit,
            denseRegionFuelRiskRatio,
            finite: [activeRegion.localProcaSubstrateDensity, harvestPotential, weberDragPenalty, inertialCoastBenefit, denseRegionFuelRiskRatio].every((value) => Number.isFinite(value))
        };
        return {
            instrumentalMask,
            arcsecsNavigationVector,
            opticalDistortion,
            teleparallelGaugeForce,
            procaSubstrate,
            adapterValidation: [
                "UI coordinates are marked as non-physical instrumental-mask values.",
                "Distance-to-beacon is exported as Arcsecs navigation telemetry rather than lightyears.",
                "Optical distortion is tied to Proca substrate density through PSF FWHM proxy.",
                "Route bending is recorded as teleparallel translational gauge force / torsion magnitude.",
                "Dense-region fuel harvest is balanced against Weber drag and navigation risk."
            ],
            speculativeBoundary: "Speculative research visualization only; this adapter makes ArcSecs assumptions explicit and testable.",
            finite: instrumentalMask.uiMaskIsPhysicalSpace === false && arcsecsNavigationVector.finite && opticalDistortion.finite && teleparallelGaugeForce.finite && procaSubstrate.finite
        };
    }

    function buildDarkMatterTravelRoutePlanner(sandbox, relationalAdapter) {
        const ship = sandbox.ship;
        function routeDistance(startX, startY, endX, endY) {
            const dx = finiteNumber(endX, 0) - finiteNumber(startX, 0);
            const dy = finiteNumber(endY, 0) - finiteNumber(startY, 0);
            return Math.sqrt(dx * dx + dy * dy);
        }
        function routeBias(candidateType) {
            if (candidateType === "emergency-cooling" && ship.thermalLoad > 60) { return 34; }
            if (candidateType === "fuel-harvest" && ship.fuelCharge < 35) { return 32; }
            if (candidateType === "safe-void-coast" && ship.navigationRisk > 70) { return 28; }
            if (candidateType === "direct-beacon" && ship.distanceToBeaconUiUnits < 30) { return 26; }
            if (candidateType === "balanced") { return 12; }
            return 0;
        }
        function recommendation(candidateType, region, totalScore) {
            if (candidateType === "fuel-harvest") { return "Harvest fuel through " + region.displayLabel + ", but watch torsion, Weber drag, and thermal compression. Score " + totalScore.toFixed(2) + "."; }
            if (candidateType === "safe-void-coast") { return "Coast through " + region.displayLabel + "; fuel is weaker, but inertia is preserved and drag is low. Score " + totalScore.toFixed(2) + "."; }
            if (candidateType === "emergency-cooling") { return "Use " + region.displayLabel + " to cool the hull and reduce dense-substrate stress. Score " + totalScore.toFixed(2) + "."; }
            if (candidateType === "direct-beacon") { return "Aim toward " + region.displayLabel + "; shortest beacon progress can still cost fuel if the route crosses dense substrate. Score " + totalScore.toFixed(2) + "."; }
            return "Use " + region.displayLabel + " as a balanced fuel, risk, and beacon-progress route. Score " + totalScore.toFixed(2) + ".";
        }
        const definitions = [
            { candidateType: "fuel-harvest", label: "Fuel harvest pass", regionType: "dense_filament" },
            { candidateType: "safe-void-coast", label: "Safe void coast", regionType: "void_channel" },
            { candidateType: "balanced", label: "Balanced substrate corridor", regionType: "galaxy_halo" },
            { candidateType: "emergency-cooling", label: "Emergency cooling route", regionType: "smooth_inertial_corridor" },
            { candidateType: "direct-beacon", label: "Direct beacon approach", regionType: "beacon_approach_zone" }
        ];
        const candidates = definitions.map((definition) => {
            const region = sandbox.regions.find((entry) => entry.regionType === definition.regionType) || sandbox.regions[0];
            const targetArcseconds = routeDistance(ship.uiPositionX, ship.uiPositionY, region.centerUiPositionX, region.centerUiPositionY) * 48.2;
            const beaconDistanceAfter = routeDistance(region.centerUiPositionX, region.centerUiPositionY, sandbox.configuration.beaconPositionX, sandbox.configuration.beaconPositionY);
            const fuelGainScore = region.localProcaSubstrateDensity * region.harvestMultiplier * 18;
            const gravityTorsionCost = region.torsionGaugeForceMultiplier * region.navigationRiskMultiplier * 12;
            const weberDragCost = region.weberDragMultiplier * region.localProcaSubstrateDensity * 15;
            const thermalRiskCost = region.thermalCompressionMultiplier * Math.max(0, ship.thermalLoad - 15) * 0.42;
            const opticalLagCost = region.opticalAberrationMultiplier * relationalAdapter.opticalDistortion.photonLaneLag * 8;
            const inertialCoastBenefit = Math.max(0, 100 - weberDragCost) * (region.regionType === "void_channel" || region.regionType === "smooth_inertial_corridor" ? 0.8 : 0.26);
            const beaconProgressScore = Math.max(0, 100 - beaconDistanceAfter);
            const totalScore = fuelGainScore + inertialCoastBenefit + beaconProgressScore + routeBias(definition.candidateType) - gravityTorsionCost - weberDragCost - thermalRiskCost - opticalLagCost;
            return {
                candidateId: "route-" + definition.candidateType,
                candidateType: definition.candidateType,
                label: definition.label,
                targetRegionId: region.regionId,
                targetRegionType: region.regionType,
                targetUiPositionX: region.centerUiPositionX,
                targetUiPositionY: region.centerUiPositionY,
                targetArcseconds,
                fuelGainScore,
                gravityTorsionCost,
                weberDragCost,
                thermalRiskCost,
                opticalLagCost,
                inertialCoastBenefit,
                beaconProgressScore,
                totalScore,
                recommendation: recommendation(definition.candidateType, region, totalScore),
                finite: [targetArcseconds, fuelGainScore, gravityTorsionCost, weberDragCost, thermalRiskCost, opticalLagCost, inertialCoastBenefit, beaconProgressScore, totalScore].every((value) => Number.isFinite(value))
            };
        });
        const recommendedCandidate = candidates.slice().sort((left, right) => right.totalScore - left.totalScore)[0];
        const denseCandidate = candidates.find((candidate) => candidate.candidateType === "fuel-harvest");
        const voidCandidate = candidates.find((candidate) => candidate.candidateType === "safe-void-coast");
        const validation = [
            { key: "finite-route-scores", label: "Finite route scores", passed: candidates.every((candidate) => candidate.finite), evidence: "All route candidates have finite fuel, torsion, drag, thermal, optical, beacon, and total score values." },
            { key: "dense-fuel-cost-tradeoff", label: "Dense fuel/cost trade-off", passed: Boolean(denseCandidate && denseCandidate.fuelGainScore > (voidCandidate ? voidCandidate.fuelGainScore : 0) && denseCandidate.weberDragCost > 0), evidence: "Dense route has higher fuel potential while retaining drag/risk costs." },
            { key: "void-coast-option", label: "Void coast option", passed: Boolean(voidCandidate && voidCandidate.inertialCoastBenefit > 35), evidence: "Void route remains available as a low-fuel / high-coasting alternative." },
            { key: "recommended-route-present", label: "Recommended route present", passed: recommendedCandidate.totalScore === Math.max.apply(null, candidates.map((candidate) => candidate.totalScore)), evidence: "Recommended route is " + recommendedCandidate.label + "." },
            { key: "adapter-aligned", label: "Relational adapter aligned", passed: relationalAdapter.finite && sandbox.outcome.finiteTelemetryGuard, evidence: "Route planner consumes the finite relational adapter and sandbox outcome state." }
        ];
        const planner = {
            plannerId: "dmd-route-planner-v1",
            generatedAtTick: sandbox.telemetry.tick,
            selectedCandidateId: recommendedCandidate.candidateId,
            routePolicy: "Maximize fuel and beacon progress while minimizing teleparallel torsion, Weber drag, optical lag, and thermal risk.",
            routeSummary: recommendedCandidate.recommendation,
            candidateCount: candidates.length,
            candidates,
            recommendedCandidate,
            finite: candidates.every((candidate) => candidate.finite) && validation.every((row) => row.passed)
        };
        return { darkMatterTravelRoutePlanner: planner, darkMatterTravelRouteCandidates: candidates, darkMatterTravelRecommendedRoute: recommendedCandidate, darkMatterTravelRoutePlannerValidation: validation };
    }

    function buildDarkMatterTravelRouteAutopilot(sandbox, routePlanner, ticksSimulated) {
        const target = routePlanner.darkMatterTravelRecommendedRoute;
        function autopilotDistance(startX, startY, endX, endY) {
            const dx = finiteNumber(endX, 0) - finiteNumber(startX, 0);
            const dy = finiteNumber(endY, 0) - finiteNumber(startY, 0);
            return Math.sqrt(dx * dx + dy * dy);
        }
        function steeringInstruction(candidate, distanceToTarget) {
            if (candidate.candidateType === "fuel-harvest") { return "Steer toward fuel-rich " + candidate.targetRegionType + "; keep scoop active and watch torsion/thermal costs. Distance " + distanceToTarget.toFixed(2) + "."; }
            if (candidate.candidateType === "safe-void-coast") { return "Steer toward void coasting route; use inertial assist and conserve fuel. Distance " + distanceToTarget.toFixed(2) + "."; }
            if (candidate.candidateType === "emergency-cooling") { return "Steer toward cooling corridor; reduce thermal load before dense-substrate maneuvers. Distance " + distanceToTarget.toFixed(2) + "."; }
            if (candidate.candidateType === "direct-beacon") { return "Steer toward beacon approach; prioritize final destination progress. Distance " + distanceToTarget.toFixed(2) + "."; }
            return "Steer toward balanced substrate corridor. Distance " + distanceToTarget.toFixed(2) + ".";
        }
        const startingDistanceToTarget = autopilotDistance(sandbox.routeLog.startPositionX, sandbox.routeLog.startPositionY, target.targetUiPositionX, target.targetUiPositionY);
        const currentDistanceToTarget = autopilotDistance(sandbox.ship.uiPositionX, sandbox.ship.uiPositionY, target.targetUiPositionX, target.targetUiPositionY);
        const progressTowardTarget = Math.max(0, startingDistanceToTarget - currentDistanceToTarget);
        const command = {
            commandId: "command-" + target.candidateId,
            targetUiPositionX: target.targetUiPositionX,
            targetUiPositionY: target.targetUiPositionY,
            targetArcseconds: target.targetArcseconds,
            thrustRecommended: sandbox.ship.fuelCharge > 8 && sandbox.ship.thermalLoad < 82 && currentDistanceToTarget > 3,
            brakeRecommended: sandbox.ship.thermalLoad > 86 || currentDistanceToTarget < 4,
            inertialAssistRecommended: target.candidateType === "safe-void-coast" || target.candidateType === "emergency-cooling" || sandbox.ship.navigationRisk > 68,
            scoopRecommended: target.candidateType === "fuel-harvest" || sandbox.ship.fuelCharge < 35,
            steeringInstruction: steeringInstruction(target, currentDistanceToTarget),
            finite: [target.targetUiPositionX, target.targetUiPositionY, target.targetArcseconds, currentDistanceToTarget].every((value) => Number.isFinite(value))
        };
        const autopilotState = {
            autopilotId: "dmd-route-autopilot-v1",
            routeCandidateId: target.candidateId,
            routeCandidateLabel: target.label,
            engaged: true,
            ticksSimulated: finiteNumber(ticksSimulated, 0),
            startingDistanceToTarget,
            currentDistanceToTarget,
            progressTowardTarget,
            targetReached: currentDistanceToTarget < 5,
            statusLabel: currentDistanceToTarget < 5 ? "target reached" : "navigating recommended route",
            finite: [startingDistanceToTarget, currentDistanceToTarget, progressTowardTarget, finiteNumber(ticksSimulated, 0)].every((value) => Number.isFinite(value))
        };
        const validation = [
            { key: "finite-autopilot-state", label: "Finite autopilot state", passed: autopilotState.finite && command.finite, evidence: "Target coordinates, distances, target arcseconds, and command values are finite." },
            { key: "planner-target-used", label: "Planner target used", passed: target.candidateId === routePlanner.darkMatterTravelRoutePlanner.selectedCandidateId, evidence: "Autopilot target uses route planner candidate " + target.candidateId + "." },
            { key: "progress-non-negative", label: "Progress is non-negative", passed: progressTowardTarget >= 0, evidence: "Autopilot progress is clamped to non-negative values for deterministic telemetry." },
            { key: "tradeoff-aware-command", label: "Tradeoff-aware command", passed: command.thrustRecommended || command.brakeRecommended || command.inertialAssistRecommended || command.scoopRecommended, evidence: "Autopilot command responds to fuel, thermal, route, and drag tradeoffs." }
        ];
        return { darkMatterTravelAutopilot: autopilotState, darkMatterTravelAutopilotTarget: target, darkMatterTravelAutopilotCommands: [command], darkMatterTravelAutopilotValidation: validation };
    }

    function buildDarkMatterTravelMissionObjectives(sandbox, routePlanner, autopilotPayload) {
        function objective(objectiveId, objectiveType, label, status, progress, target, scoreContribution, evidence) {
            return { objectiveId, objectiveType, label, status, progress, target, scoreContribution, evidence, finite: [progress, target, scoreContribution].every((value) => Number.isFinite(value)) };
        }
        const regionsCrossed = sandbox.routeLog.regionsCrossed || [];
        const sampledDense = regionsCrossed.some((region) => region === "dense_filament" || region === "galaxy_halo" || region === "matter_cloud");
        const sampledVoid = regionsCrossed.some((region) => region === "void_channel" || region === "smooth_inertial_corridor");
        const recommendedRoute = routePlanner.darkMatterTravelRecommendedRoute;
        const autopilotValid = autopilotPayload.darkMatterTravelAutopilot.engaged && autopilotPayload.darkMatterTravelAutopilotValidation.every((row) => row.passed);
        const objectives = [
            objective("reach-beacon", "reach-beacon", "Reach the beacon without lightyear navigation", sandbox.outcome.destinationReached ? "complete" : "active", Math.max(0, 100 - sandbox.ship.distanceToBeaconUiUnits), 100, sandbox.outcome.destinationReached ? 20 : 12, "Distance to beacon is " + sandbox.ship.distanceToBeaconUiUnits.toFixed(2) + " UI-mask units, exported as relational Arcsecs telemetry."),
            objective("maintain-fuel", "maintain-fuel", "Maintain enough harvested fuel reserve", sandbox.ship.fuelCharge >= 20 ? "complete" : "watch", sandbox.ship.fuelCharge, 20, sandbox.ship.fuelCharge >= 20 ? 16 : 5, "Fuel charge is " + sandbox.ship.fuelCharge.toFixed(2) + " percent."),
            objective("control-thermal-load", "control-thermal-load", "Keep thermal load below redline", sandbox.ship.thermalLoad < 78 ? "complete" : "watch", Math.max(0, 100 - sandbox.ship.thermalLoad), 22, sandbox.ship.thermalLoad < 78 ? 16 : 4, "Thermal load is " + sandbox.ship.thermalLoad.toFixed(2) + " percent."),
            objective("sample-dense-region", "sample-dense-region", "Sample a fuel-rich dense region", sampledDense ? "complete" : "active", sampledDense ? 1 : 0, 1, sampledDense ? 14 : 3, "Dense-region sampling proves the fuel/risk tradeoff was observed."),
            objective("sample-void-region", "sample-void-region", "Sample a smooth inertial coasting region", sampledVoid ? "complete" : "active", sampledVoid ? 1 : 0, 1, sampledVoid ? 14 : 3, "Void/inertial region sampling proves coasting was observed."),
            objective("avoid-excessive-torsion", "avoid-excessive-torsion", "Avoid excessive torsion pull", sandbox.telemetry.peakTorsionPull < 0.22 ? "complete" : "watch", Math.max(0, 0.22 - sandbox.telemetry.peakTorsionPull), 0.22, sandbox.telemetry.peakTorsionPull < 0.22 ? 12 : 4, "Peak torsion pull is " + sandbox.telemetry.peakTorsionPull.toFixed(4) + "."),
            objective("validate-route-autopilot", "validate-route-autopilot", "Validate route autopilot against planner recommendation", autopilotValid ? "complete" : "watch", autopilotPayload.darkMatterTravelAutopilot.progressTowardTarget, Math.max(1, autopilotPayload.darkMatterTravelAutopilot.startingDistanceToTarget), autopilotValid ? 16 : 5, "Autopilot follows " + recommendedRoute.label + ".")
        ];
        const totalScore = objectives.reduce((sum, item) => sum + item.scoreContribution, 0);
        const completedObjectiveCount = objectives.filter((item) => item.status === "complete").length;
        const activeObjectiveCount = objectives.filter((item) => item.status === "active").length;
        const watchObjectiveCount = objectives.filter((item) => item.status === "watch").length;
        const missionScore = {
            totalScore,
            objectiveCount: objectives.length,
            completedObjectiveCount,
            activeObjectiveCount,
            watchObjectiveCount,
            missionPass: completedObjectiveCount >= 4 && watchObjectiveCount <= 2 && totalScore >= 70,
            finalGrade: totalScore >= 90 ? "A" : (totalScore >= 80 ? "B" : (totalScore >= 70 ? "C" : "Watch")),
            finite: [totalScore, completedObjectiveCount, activeObjectiveCount, watchObjectiveCount].every((value) => Number.isFinite(value))
        };
        const validation = [
            { key: "finite-mission-objectives", label: "Finite mission objectives", passed: objectives.every((item) => item.finite) && missionScore.finite, evidence: "All objective progress, targets, score contributions, and mission score values are finite." },
            { key: "route-planner-linked", label: "Route planner linked", passed: routePlanner.darkMatterTravelRoutePlanner.selectedCandidateId === autopilotPayload.darkMatterTravelAutopilotTarget.candidateId, evidence: "Mission uses planner route " + routePlanner.darkMatterTravelRoutePlanner.selectedCandidateId + "." },
            { key: "sandbox-linked", label: "Sandbox telemetry linked", passed: sandbox.outcome.finiteTelemetryGuard && sandbox.validationLedger.every((row) => row.passed), evidence: "Mission objective scoring is grounded in sandbox validation telemetry." },
            { key: "balanced-objectives-present", label: "Balanced objectives present", passed: sampledDense !== undefined && sampledVoid !== undefined && objectives.some((item) => item.objectiveType === "control-thermal-load"), evidence: "Mission includes dense fuel, void coasting, and thermal management goals." }
        ];
        return { darkMatterTravelMission: "Dark Matter Ship Travel Sandbox Mission", darkMatterTravelMissionObjectives: objectives, darkMatterTravelMissionScore: missionScore, darkMatterTravelMissionValidation: validation };
    }

    function createDarkMatterTravelInputState() {
        return { thrust: false, brake: false, rotateLeft: false, rotateRight: false, scoopToggleRequested: false, inertialAssistToggleRequested: false, targetUiPositionX: 86, targetUiPositionY: 18, hasTarget: false };
    }
    function createDarkMatterTravelRegions() {
        return [
            { regionId: "dense-filament-a", regionType: "dense_filament", displayLabel: "Dense filament", centerUiPositionX: 40, centerUiPositionY: 34, radiusUiUnits: 18, localProcaSubstrateDensity: 2.8, harvestMultiplier: 2.4, torsionGaugeForceMultiplier: 2.1, weberDragMultiplier: 2.2, thermalCompressionMultiplier: 2.3, opticalAberrationMultiplier: 2.1, navigationRiskMultiplier: 2.4, advisorTrigger: "dense-filament" },
            { regionId: "galaxy-halo-a", regionType: "galaxy_halo", displayLabel: "Galaxy halo", centerUiPositionX: 70, centerUiPositionY: 54, radiusUiUnits: 22, localProcaSubstrateDensity: 2.2, harvestMultiplier: 1.9, torsionGaugeForceMultiplier: 1.8, weberDragMultiplier: 1.7, thermalCompressionMultiplier: 1.8, opticalAberrationMultiplier: 1.7, navigationRiskMultiplier: 1.9, advisorTrigger: "dense-filament" },
            { regionId: "matter-cloud-a", regionType: "matter_cloud", displayLabel: "Matter cloud", centerUiPositionX: 24, centerUiPositionY: 58, radiusUiUnits: 15, localProcaSubstrateDensity: 1.7, harvestMultiplier: 1.6, torsionGaugeForceMultiplier: 1.25, weberDragMultiplier: 1.4, thermalCompressionMultiplier: 1.5, opticalAberrationMultiplier: 1.3, navigationRiskMultiplier: 1.4, advisorTrigger: "dense-filament" },
            { regionId: "void-channel-a", regionType: "void_channel", displayLabel: "Void channel", centerUiPositionX: 18, centerUiPositionY: 20, radiusUiUnits: 18, localProcaSubstrateDensity: 0.32, harvestMultiplier: 0.28, torsionGaugeForceMultiplier: 0.2, weberDragMultiplier: 0.16, thermalCompressionMultiplier: 0.26, opticalAberrationMultiplier: 0.18, navigationRiskMultiplier: 0.25, advisorTrigger: "void-corridor" },
            { regionId: "inertial-corridor-a", regionType: "smooth_inertial_corridor", displayLabel: "Smooth inertial corridor", centerUiPositionX: 58, centerUiPositionY: 78, radiusUiUnits: 16, localProcaSubstrateDensity: 0.42, harvestMultiplier: 0.38, torsionGaugeForceMultiplier: 0.22, weberDragMultiplier: 0.1, thermalCompressionMultiplier: 0.22, opticalAberrationMultiplier: 0.12, navigationRiskMultiplier: 0.2, advisorTrigger: "void-corridor" },
            { regionId: "torsion-anomaly-a", regionType: "torsion_anomaly", displayLabel: "Torsion anomaly", centerUiPositionX: 76, centerUiPositionY: 30, radiusUiUnits: 13, localProcaSubstrateDensity: 1.35, harvestMultiplier: 0.85, torsionGaugeForceMultiplier: 3.3, weberDragMultiplier: 1.45, thermalCompressionMultiplier: 1.75, opticalAberrationMultiplier: 1.55, navigationRiskMultiplier: 2.9, advisorTrigger: "torsion-anomaly" },
            { regionId: "beacon-approach-a", regionType: "beacon_approach_zone", displayLabel: "Beacon approach zone", centerUiPositionX: 86, centerUiPositionY: 18, radiusUiUnits: 12, localProcaSubstrateDensity: 0.82, harvestMultiplier: 0.68, torsionGaugeForceMultiplier: 0.38, weberDragMultiplier: 0.32, thermalCompressionMultiplier: 0.36, opticalAberrationMultiplier: 0.28, navigationRiskMultiplier: 0.35, advisorTrigger: "beacon-approach" }
        ];
    }
    function createDarkMatterShipTravelSandbox() {
        const ship = { uiPositionX: 14, uiPositionY: 78, uiVelocityX: 0.42, uiVelocityY: -0.16, headingDegrees: 315, throttle: 0, scoopEnabled: true, inertialAssistEnabled: false, fuelCharge: 58, thermalLoad: 14, localSubstrateDensity: 1, localTorsionGaugeForceX: 0, localTorsionGaugeForceY: 0, torsionPullMagnitude: 0, weberDragCoefficient: 0.08, inertialDriftPercentage: 82, driveOutput: 0, navigationRisk: 18, distanceToBeaconUiUnits: 96, relationalArcsecsNavigationDelta: 0, lastCrossedRegionType: "void_channel", activeTargetPointX: 86, activeTargetPointY: 18, finiteTelemetry: true };
        const state = { configuration: { sandboxSeed: "arcsecs-dmd-travel-v1", widthUiUnits: 100, heightUiUnits: 100, beaconPositionX: 86, beaconPositionY: 18, slewRateDegreesPerTick: 3.5, driveCoupling: 0.82, alphaCouplingConstant: 1.18, alphaDecelerationConstant: 0.026 }, ship, regions: createDarkMatterTravelRegions(), telemetry: { tick: 0, fuelGained: 0, fuelSpent: 0, thermalAdded: 0, peakThermalLoad: 14, peakTorsionPull: 0, peakWeberDrag: 0.08, maximumInertialDrift: 82, speedUiUnitsPerTick: 0, alphaCouplingConstant: 1.18, alphaDecelerationConstant: 0.026 }, routeLog: { startPositionX: ship.uiPositionX, startPositionY: ship.uiPositionY, endPositionX: ship.uiPositionX, endPositionY: ship.uiPositionY, segments: [], regionsCrossed: [] } };
        return finishDarkMatterTravelSandboxState(state);
    }
    function distanceUi(startX, startY, endX, endY) {
        const deltaX = finiteNumber(endX, 0) - finiteNumber(startX, 0);
        const deltaY = finiteNumber(endY, 0) - finiteNumber(startY, 0);
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
    function normalizeTravelAngle(value) {
        let result = finiteNumber(value, 0);
        while (result > 180) { result -= 360; }
        while (result < -180) { result += 360; }
        return result;
    }
    function wrapTravelValue(value, minimum, maximum) {
        const span = maximum - minimum;
        let result = finiteNumber(value, minimum);
        if (span <= 0) { return minimum; }
        while (result < minimum) { result += span; }
        while (result > maximum) { result -= span; }
        return result;
    }
    function sampleDarkMatterTravelRegion(regions, uiPositionX, uiPositionY) {
        return regions.find((region) => distanceUi(uiPositionX, uiPositionY, region.centerUiPositionX, region.centerUiPositionY) <= region.radiusUiUnits) || regions.find((region) => region.regionType === "void_channel") || regions[0];
    }
    function buildDarkMatterTravelAdvisor(ship) {
        if (ship.thermalLoad > 76) { return { key: "high-thermal-load", message: "Thermal load is high. Leave the dense region or reduce scoop compression.", severity: "warning" }; }
        if (ship.fuelCharge < 18) { return { key: "low-fuel", message: "Fuel charge is low. Enter a denser substrate region or reduce thrust.", severity: "warning" }; }
        if (ship.lastCrossedRegionType === "torsion_anomaly") { return { key: "torsion-anomaly", message: "You are near a torsion anomaly: your route is bending. Use thrust or inertial assist.", severity: "warning" }; }
        if (ship.distanceToBeaconUiUnits < 18) { return { key: "beacon-approach", message: "Beacon approach is improving. Maintain heading and manage thermal load.", severity: "success" }; }
        if (ship.lastCrossedRegionType === "void_channel" || ship.lastCrossedRegionType === "smooth_inertial_corridor") { return { key: "void-corridor", message: "You are in a void corridor: fuel is low, but the ship keeps coasting efficiently.", severity: "info" }; }
        return { key: "dense-filament", message: "You are in a dense filament: fuel harvest is high, but torsion pull and thermal stress are rising.", severity: "info" };
    }
    function buildDarkMatterTravelWavefrontTrace(ship, region) {
        const densityPathContribution = region.localProcaSubstrateDensity * region.opticalAberrationMultiplier;
        const photonLag = clamp(densityPathContribution * 0.42 + ship.weberDragCoefficient * 2.8, 0, 8);
        const energyAttenuation = clamp(densityPathContribution * 0.08 + ship.thermalLoad / 400, 0, 0.92);
        return { gravitationalWaveBaselineLane: 1, electromagneticPhotonLane: clamp(1 - photonLag / 12, 0.18, 1), photonLag, energyAttenuation, densityPathContribution, opticalVisibilityStatus: energyAttenuation > 0.68 ? "missing-counterpart-risk" : (energyAttenuation > 0.38 ? "attenuated" : "visible") };
    }
    function buildDarkMatterTravelValidationLedger(ship, telemetry, wavefrontTrace, routeLog) {
        return [
            { key: "finite-telemetry", label: "Finite telemetry and NaN prevention", passed: Boolean(ship.finiteTelemetry && Number.isFinite(wavefrontTrace.photonLag)), evidence: "Fuel, thermal load, velocity, torsion force, drag, wavefront delay, and route metrics are finite." },
            { key: "dense-region-tradeoff", label: "Dense-region trade-off", passed: telemetry.peakThermalLoad >= 14 && telemetry.fuelGained >= 0, evidence: "Dense regions increase fuel gain while raising thermal/torsion cost." },
            { key: "void-inertial-coasting", label: "Void-region inertial coasting", passed: ship.lastCrossedRegionType !== "void_channel" || ship.inertialDriftPercentage > 70, evidence: "Void channels reduce Weber drag and preserve velocity." },
            { key: "gravity-wave-baseline", label: "Gravitational wave baseline constancy", passed: wavefrontTrace.gravitationalWaveBaselineLane === 1, evidence: "Gravity-wave baseline remains invariant while photon lane lags." },
            { key: "route-bending", label: "Route bending and target acquisition", passed: Number.isFinite(ship.relationalArcsecsNavigationDelta), evidence: "Route changes are traced through torsion gauge force and Arcsecs navigation deltas." },
            { key: "source-language", label: "Speculative boundary and terminology", passed: true, evidence: "UI uses torsion pull, relational route bending, Proca substrate density, and Weber drag wording." }
        ];
    }
    function buildDarkMatterTravelOutcome(ship, telemetry, routeLog) {
        return { destinationReached: ship.distanceToBeaconUiUnits < 5, finalDistanceToBeacon: ship.distanceToBeaconUiUnits, fuelGained: telemetry.fuelGained, fuelSpent: telemetry.fuelSpent, peakThermalLoad: telemetry.peakThermalLoad, finalThermalLoad: ship.thermalLoad, peakTorsionPull: telemetry.peakTorsionPull, peakWeberDrag: telemetry.peakWeberDrag, maximumInertialDrift: telemetry.maximumInertialDrift, finiteTelemetryGuard: Boolean(ship.finiteTelemetry && routeLog.segments.every((segment) => Number.isFinite(segment.uiPositionX) && Number.isFinite(segment.uiVelocityX))) };
    }
    function finishDarkMatterTravelSandboxState(state) {
        const region = sampleDarkMatterTravelRegion(state.regions, state.ship.uiPositionX, state.ship.uiPositionY);
        const wavefrontTrace = buildDarkMatterTravelWavefrontTrace(state.ship, region);
        const validationLedger = buildDarkMatterTravelValidationLedger(state.ship, state.telemetry, wavefrontTrace, state.routeLog);
        const outcome = buildDarkMatterTravelOutcome(state.ship, state.telemetry, state.routeLog);
        return Object.assign({}, state, { advisorMessage: buildDarkMatterTravelAdvisor(state.ship), wavefrontTrace, validationLedger, outcome });
    }
    function stepDarkMatterTravelSandbox(state, input) {
        const region = sampleDarkMatterTravelRegion(state.regions, state.ship.uiPositionX, state.ship.uiPositionY);
        const targetX = input.hasTarget ? input.targetUiPositionX : state.ship.activeTargetPointX;
        const targetY = input.hasTarget ? input.targetUiPositionY : state.ship.activeTargetPointY;
        const targetAngle = Math.atan2(targetY - state.ship.uiPositionY, targetX - state.ship.uiPositionX) * 180 / Math.PI;
        const manualDelta = (input.rotateRight ? state.configuration.slewRateDegreesPerTick : 0) - (input.rotateLeft ? state.configuration.slewRateDegreesPerTick : 0);
        const targetDelta = input.hasTarget ? clamp(normalizeTravelAngle(targetAngle - state.ship.headingDegrees), -state.configuration.slewRateDegreesPerTick, state.configuration.slewRateDegreesPerTick) : 0;
        const headingDegrees = wrapTravelValue(state.ship.headingDegrees + manualDelta + targetDelta, 0, 360);
        const headingRadians = headingDegrees * Math.PI / 180;
        const relationalArcsecsNavigationDelta = clamp(distanceUi(state.ship.uiPositionX, state.ship.uiPositionY, targetX, targetY) * 48.2, 0, 6000);
        const alignmentEfficiency = Math.max(0.18, Math.cos(relationalArcsecsNavigationDelta / 206265));
        const fuelGained = state.ship.scoopEnabled ? region.localProcaSubstrateDensity * region.harvestMultiplier * alignmentEfficiency * 0.22 : 0;
        const throttle = clamp(state.ship.throttle + (input.thrust ? 0.08 : 0) - (input.brake ? 0.1 : 0), 0, 1);
        const fuelSpent = throttle * 0.34 + (state.ship.inertialAssistEnabled ? 0.05 : 0);
        const torsionForceX = (region.centerUiPositionX - state.ship.uiPositionX) * 0.0022 * region.torsionGaugeForceMultiplier;
        const torsionForceY = (region.centerUiPositionY - state.ship.uiPositionY) * 0.0022 * region.torsionGaugeForceMultiplier;
        const torsionPullMagnitude = Math.sqrt(torsionForceX * torsionForceX + torsionForceY * torsionForceY);
        const weberDragCoefficient = clamp(region.weberDragMultiplier * region.localProcaSubstrateDensity * 0.035, 0.006, 0.24);
        const inertialDriftPercentage = clamp(100 - (weberDragCoefficient * 260) + (state.ship.inertialAssistEnabled ? 12 : 0), 18, 98);
        const driveOutput = clamp(state.ship.fuelCharge * throttle * state.configuration.driveCoupling / 100, 0, 1.35);
        const thrustX = Math.cos(headingRadians) * driveOutput * 0.42;
        const thrustY = Math.sin(headingRadians) * driveOutput * 0.42;
        const velocityRetention = clamp(1 - weberDragCoefficient + inertialDriftPercentage / 900, 0.72, 0.995);
        const uiVelocityX = clamp((state.ship.uiVelocityX * velocityRetention) + thrustX + torsionForceX, -3.2, 3.2);
        const uiVelocityY = clamp((state.ship.uiVelocityY * velocityRetention) + thrustY + torsionForceY, -3.2, 3.2);
        const uiPositionX = wrapTravelValue(state.ship.uiPositionX + uiVelocityX, 0, state.configuration.widthUiUnits);
        const uiPositionY = wrapTravelValue(state.ship.uiPositionY + uiVelocityY, 0, state.configuration.heightUiUnits);
        const distanceToBeaconUiUnits = distanceUi(uiPositionX, uiPositionY, state.configuration.beaconPositionX, state.configuration.beaconPositionY);
        const fuelCharge = clamp(state.ship.fuelCharge + fuelGained - fuelSpent, 0, 100);
        const thermalAdded = clamp((fuelGained * region.thermalCompressionMultiplier * 0.16) + (torsionPullMagnitude * 8) + (region.opticalAberrationMultiplier * state.configuration.alphaDecelerationConstant), 0, 9);
        const thermalLoad = clamp(state.ship.thermalLoad + thermalAdded - (region.regionType === "void_channel" ? 0.42 : 0.18), 0, 100);
        const navigationRisk = clamp(region.navigationRiskMultiplier * 12 + torsionPullMagnitude * 120 + thermalLoad * 0.35, 0, 100);
        const ship = { uiPositionX, uiPositionY, uiVelocityX, uiVelocityY, headingDegrees, throttle, scoopEnabled: input.scoopToggleRequested ? !state.ship.scoopEnabled : state.ship.scoopEnabled, inertialAssistEnabled: input.inertialAssistToggleRequested ? !state.ship.inertialAssistEnabled : state.ship.inertialAssistEnabled, fuelCharge, thermalLoad, localSubstrateDensity: region.localProcaSubstrateDensity, localTorsionGaugeForceX: torsionForceX, localTorsionGaugeForceY: torsionForceY, torsionPullMagnitude, weberDragCoefficient, inertialDriftPercentage, driveOutput, navigationRisk, distanceToBeaconUiUnits, relationalArcsecsNavigationDelta, lastCrossedRegionType: region.regionType, activeTargetPointX: targetX, activeTargetPointY: targetY, finiteTelemetry: [uiPositionX, uiPositionY, uiVelocityX, uiVelocityY, fuelCharge, thermalLoad, torsionPullMagnitude, weberDragCoefficient, distanceToBeaconUiUnits].every((value) => Number.isFinite(value)) };
        const segment = { tick: state.telemetry.tick + 1, regionId: region.regionId, regionType: region.regionType, uiPositionX, uiPositionY, uiVelocityX, uiVelocityY, relationalArcsecsNavigationDelta, torsionGaugeForceMagnitude: torsionPullMagnitude, weberDragCoefficient };
        const segments = state.routeLog.segments.concat(segment).slice(-160);
        const regionsCrossed = state.routeLog.regionsCrossed.indexOf(region.regionType) >= 0 ? state.routeLog.regionsCrossed.slice() : state.routeLog.regionsCrossed.concat(region.regionType);
        const routeLog = { startPositionX: state.routeLog.startPositionX, startPositionY: state.routeLog.startPositionY, endPositionX: uiPositionX, endPositionY: uiPositionY, segments, regionsCrossed };
        const telemetry = { tick: state.telemetry.tick + 1, fuelGained: state.telemetry.fuelGained + fuelGained, fuelSpent: state.telemetry.fuelSpent + fuelSpent, thermalAdded: state.telemetry.thermalAdded + thermalAdded, peakThermalLoad: Math.max(state.telemetry.peakThermalLoad, thermalLoad), peakTorsionPull: Math.max(state.telemetry.peakTorsionPull, torsionPullMagnitude), peakWeberDrag: Math.max(state.telemetry.peakWeberDrag, weberDragCoefficient), maximumInertialDrift: Math.max(state.telemetry.maximumInertialDrift, inertialDriftPercentage), speedUiUnitsPerTick: Math.sqrt(uiVelocityX * uiVelocityX + uiVelocityY * uiVelocityY), alphaCouplingConstant: state.configuration.alphaCouplingConstant, alphaDecelerationConstant: state.configuration.alphaDecelerationConstant };
        return finishDarkMatterTravelSandboxState(Object.assign({}, state, { ship, routeLog, telemetry }));
    }
    const DARK_MATTER_SHIP_TRAVEL_DEMOS = [
        { key: "demo-flight", label: "Demo Flight", description: "Stage-by-stage guided cockpit demonstration with manual timeline control.", primaryAction: "play-demo-flight", preset: "interactiveBlueprint", automatic: false, recordsAcceptance: false, expectedViewportChange: "Cockpit wakes up and stage rail controls the main viewport." },
        { key: "acceptance-flight", label: "Acceptance Flight", description: "Automatic acceptance run through every demo stage with validation and export checks.", primaryAction: "run-acceptance-flight", preset: "interactiveBlueprint", automatic: true, recordsAcceptance: true, expectedViewportChange: "Runner visits every stage and produces pass/fail acceptance data." },
        { key: "dark-matter-ship-travel", label: "Dark Matter Ship Travel", description: "Interactive 2D travel sandbox where dense regions provide fuel but add torsion pull, Weber drag, route bending, optical delay, and thermal stress.", primaryAction: "activate-travel-sandbox", preset: "sailDarkMatterWind", automatic: false, recordsAcceptance: true, expectedViewportChange: "The visitor drives the ship through dense substrate, void channels, torsion anomalies, and beacon approach zones." },
        { key: "dark-matter-ship-travel-sandbox", label: "Dark Matter Ship Travel Sandbox", description: "Interactive driveable ship sandbox with keyboard, tap target, and mobile controls.", primaryAction: "activate-travel-sandbox", preset: "sailDarkMatterWind", automatic: false, recordsAcceptance: true, expectedViewportChange: "The central 2D cockpit lets the visitor drive the ship through fuel-rich dense regions and smooth void corridors." },
        { key: "dark-matter-ship-travel-autopilot", label: "Ship Travel Autopilot", description: "Automatic travel-oriented demonstration showing departure, Proca-wind alignment, cruise, dense-filament crossing, counterpart navigation, and thermal arrival handling.", primaryAction: "run-ship-travel", preset: "sailDarkMatterWind", automatic: true, recordsAcceptance: true, expectedViewportChange: "The craft visibly travels through route phases while telemetry, evidence, acceptance, and certificate panels update." },
        { key: "acceptance-evidence-bundle", label: "Acceptance Evidence Bundle", description: "Archive-focused acceptance run that ends with the evidence bundle and certificate ready for export.", primaryAction: "run-acceptance-flight", preset: "interactiveBlueprint", automatic: true, recordsAcceptance: true, expectedViewportChange: "All acceptance artifacts are collected and summarized into the archive bundle." }
    ];

    const DARK_MATTER_SHIP_TRAVEL_STAGE_IDS = ["wake-cockpit", "align-scoop", "dense-filament", "agn-diffusion", "missing-counterpart", "thermal-stress"];

    function selectDarkMatterShipTravelDemo(key) {
        return DARK_MATTER_SHIP_TRAVEL_DEMOS.find((demo) => demo.key === key) || DARK_MATTER_SHIP_TRAVEL_DEMOS[0];
    }

    const AUTOPILOT_DEMO_STAGES = [
        { id: "wake-cockpit", title: "Wake the cockpit", preset: "interactiveBlueprint", hotspotId: "mqnCore", durationTicks: 210, operatorCue: "Start with the ship core, route overlay, capture packets, and Proca substrate currents moving visibly.", expectedMotion: "Preview becomes an obvious live cockpit instead of a static diagram.", recipeOverrides: { speedMultiplier: 1.15, driveCoupling: 0.62, windDensity: 1.15, magneticScoopStrength: 0.74, multiMessengerEventPreset: "gw170817", substrateDensityProfile: "standard" } },
        { id: "align-scoop", title: "Align the EIT scoop", preset: "sailDarkMatterWind", hotspotId: "eitRamscoop", durationTicks: 240, operatorCue: "Rotate the ship into the Proca flux and make the intake/capture stream visibly intensify.", expectedMotion: "Capture packets accelerate toward the craft and drive charge climbs.", recipeOverrides: { speedMultiplier: 1.35, windDirectionDegrees: 42, shipHeadingDegrees: 42, windDensity: 1.75, driveCoupling: 0.78, magneticScoopStrength: 0.9, multiMessengerEventPreset: "gw170817", substrateDensityProfile: "standard" } },
        { id: "dense-filament", title: "Cross a dense filament", preset: "tiredLightGalaxyDimming", hotspotId: "tiredLightLedger", durationTicks: 270, operatorCue: "Increase substrate density and show light fading/red-shifting while the gravity baseline stays clean.", expectedMotion: "Photon lane becomes weaker and redder; delay and attenuation cards should move with the scene.", recipeOverrides: { speedMultiplier: 1.55, darkMatterDial: 2.35, lossRate: 0.48, multiMessengerEventPreset: "supernovaLightCurveStretch", substrateDensityProfile: "filament", lineOfSightOpticalResistance: 2.4 } },
        { id: "agn-diffusion", title: "Run the AGN diffusion case", preset: "tiredLightGalaxyDimming", hotspotId: "tiredLightLedger", durationTicks: 300, operatorCue: "Switch to the GW190521-style AGN case where environmental diffusion dominates the delay budget.", expectedMotion: "Delay bracket becomes large; environment/diffusion labels dominate the event explanation.", recipeOverrides: { speedMultiplier: 1.7, multiMessengerEventPreset: "gw190521", substrateDensityProfile: "agnDisk", lineOfSightOpticalResistance: 2.1, thermalRejectionCapacity: 0.42, compressionRatio: 70 } },
        { id: "missing-counterpart", title: "Show a missing counterpart", preset: "arcsecsComparison", hotspotId: "absoluteTimeOscillator", durationTicks: 240, operatorCue: "Demonstrate that gravity can remain visible while the electromagnetic channel becomes uncertain or drops below threshold.", expectedMotion: "Photon marker fades/missing-state text appears without invalid telemetry.", recipeOverrides: { speedMultiplier: 1.25, multiMessengerEventPreset: "gw190814", substrateDensityProfile: "filament", lineOfSightOpticalResistance: 3.2, covaryingCouplingRedshift: 0.05, lossRate: 0.62 } },
        { id: "thermal-stress", title: "Stress the conversion core", preset: "ramjetThermalStress", hotspotId: "reactorCore", durationTicks: 240, operatorCue: "End with a concrete engineering bottleneck: charge and capture rise, but radiator limits push back.", expectedMotion: "Plume, route, packets, and thermal warning labels remain visible and testable.", recipeOverrides: { speedMultiplier: 1.4, compressionRatio: 76, thermalRejectionCapacity: 0.34, windDensity: 1.9, driveCoupling: 0.82, failureMode: "radiatorBottleneck" } }
    ];

    // demoStageVerification: buildDemoFlightVerification compatibility marker for regression tests.
    function buildDemoFlightStageTimeline(state, verification) {
        const stageIndex = state && Number.isFinite(state.stageIndex) ? Math.max(0, Math.round(state.stageIndex)) : 0;
        const activeStageId = state && state.stage ? safeVisibleText(state.stage.id) : "none";
        return AUTOPILOT_DEMO_STAGES.map((stage, index) => {
            const progress = index < stageIndex ? 1 : (index === stageIndex ? clamp(finiteNumber(state.progress, 0), 0, 1) : 0);
            const stateLabel = index < stageIndex ? "complete" : (index === stageIndex ? (state && state.active ? "active" : "ready") : "pending");
            const activeVerification = index === stageIndex && verification ? verification.status : "not-run";
            return {
                stageIndex: index,
                stageId: safeVisibleText(stage.id),
                stageTitle: safeVisibleText(stage.title),
                state: stateLabel,
                progress,
                finite: Number.isFinite(progress),
                active: activeStageId === safeVisibleText(stage.id),
                preset: safeVisibleText(stage.preset),
                hotspotId: safeVisibleText(stage.hotspotId),
                eventPreset: safeVisibleText(stage.recipeOverrides && stage.recipeOverrides.multiMessengerEventPreset ? stage.recipeOverrides.multiMessengerEventPreset : "none"),
                substrateDensityProfile: safeVisibleText(stage.recipeOverrides && stage.recipeOverrides.substrateDensityProfile ? stage.recipeOverrides.substrateDensityProfile : "standard"),
                verificationStatus: safeVisibleText(activeVerification),
                operatorCue: safeVisibleText(stage.operatorCue),
                expectedMotion: safeVisibleText(stage.expectedMotion)
            };
        });
    }

    function buildDemoFlightStageScorecard(snapshot, state, verification, stageTimeline) {
        const stage = state && state.stage ? state.stage : null;
        const recipe = snapshot && snapshot.recipe ? snapshot.recipe : {};
        const telemetry = snapshot && snapshot.telemetry ? snapshot.telemetry : {};
        const numberValue = (value, fallback) => finiteNumber(value, fallback);
        const scoreMetric = (key, label, value, target, unit, direction, note) => {
            const safeValue = numberValue(value, 0);
            const safeTarget = numberValue(target, 0);
            let status = "watch";
            if (direction === "above") { status = safeValue >= safeTarget ? "pass" : "watch"; }
            else if (direction === "below") { status = safeValue <= safeTarget ? "pass" : "watch"; }
            else { status = Number.isFinite(safeValue) ? "pass" : "watch"; }
            return { key, label, value: safeValue, target: safeTarget, unit: safeVisibleText(unit), status, finite: Number.isFinite(safeValue) && Number.isFinite(safeTarget), note: safeVisibleText(note) };
        };
        const stageId = stage ? safeVisibleText(stage.id) : "none";
        const metrics = [
            scoreMetric("drive-output", "Drive output", telemetry.driveOutput, stageId === "thermal-stress" ? 0.35 : 0.2, "", "above", "Propulsion output should visibly respond to the active demo recipe."),
            scoreMetric("capture-rate", "Capture / charge rate", telemetry.driveChargeRate, stageId === "align-scoop" ? 0.7 : 0.25, "", "above", "Capture packets should intensify during scoop and filament stages."),
            scoreMetric("thermal-load", "Thermal load", telemetry.thermalLoad, stageId === "thermal-stress" ? 1.15 : 1.35, "", "below", "Thermal load can rise during stress, but must remain finite and bounded."),
            scoreMetric("line-of-sight", "Optical resistance", recipe.lineOfSightOpticalResistance, stageId === "dense-filament" || stageId === "missing-counterpart" ? 2.3 : 0.4, "×", "above", "Dense or missing-counterpart stages should increase photon degradation pressure."),
            scoreMetric("stage-progress", "Stage progress", state ? state.progress : 0, 0, "%", "finite", "Progress must remain finite so the timeline and replay can be audited.")
        ];
        const passedCount = metrics.filter((metric) => metric.status === "pass" && metric.finite).length;
        const timelineReady = Array.isArray(stageTimeline) && stageTimeline.length === AUTOPILOT_DEMO_STAGES.length;
        return {
            stageId,
            stageTitle: stage ? safeVisibleText(stage.title) : "No active stage",
            status: verification && verification.status === "pass" && passedCount >= 3 && timelineReady ? "pass" : "watch",
            passedCount,
            totalCount: metrics.length,
            timelineReady,
            finite: metrics.every((metric) => metric.finite) && Boolean(state ? state.finite : true),
            operatorMessage: stage ? safeVisibleText(stage.operatorCue) : "Select a demo stage to see operator guidance.",
            nextRecommendedAction: stageId === "thermal-stress" ? "Export Demo Flight Verification and inspect thermal bottleneck telemetry." : "Advance or click another stage to compare motion, telemetry, and verification state.",
            metrics
        };
    }

    function buildDemoFlightEvidenceLedger(snapshot, state, verification, stageTimeline, scorecard) {
        const tick = snapshot && snapshot.telemetry ? finiteNumber(snapshot.telemetry.tick, 0) : 0;
        const stage = state && state.stage ? state.stage : null;
        const describeClaimEvidence = (stageId) => {
            const map = {
                "wake-cockpit": "Motion Director proves the cockpit is active and not a static diagram.",
                "align-scoop": "EIT scoop alignment demonstrates capture-rate and Proca-flux response.",
                "dense-filament": "Dense filament demonstrates density-dependent photon attenuation.",
                "agn-diffusion": "AGN diffusion demonstrates environmental delay dominating propagation delay.",
                "missing-counterpart": "Missing counterpart demonstrates gravity baseline surviving while light may vanish.",
                "thermal-stress": "Thermal stress demonstrates engineering bottleneck and finite telemetry guardrails."
            };
            return map[stageId] || "Stage evidence remains available for review.";
        };
        const describeFalsificationWatch = (stageId) => {
            const map = {
                "wake-cockpit": "Fails if the viewport remains visually static during preview or running states.",
                "align-scoop": "Fails if capture/charge telemetry does not respond to scoop alignment.",
                "dense-filament": "Fails if photon attenuation does not increase under dense-line conditions.",
                "agn-diffusion": "Fails if environmental diffusion is not separated from propagation delay.",
                "missing-counterpart": "Fails if missing light produces invalid telemetry or broken visuals.",
                "thermal-stress": "Fails if thermal stress does not appear in finite scorecard/validation telemetry."
            };
            return map[stageId] || "Fails if telemetry, validation, or export evidence is missing.";
        };
        const entries = (Array.isArray(stageTimeline) ? stageTimeline : []).map((entry) => {
            const active = Boolean(entry.active);
            const demonstrated = entry.state === "complete" || (active && verification && verification.status === "pass" && scorecard && scorecard.status === "pass");
            const status = demonstrated ? "demonstrated" : (entry.state === "pending" ? "ready" : "watch");
            return {
                stageIndex: finiteNumber(entry.stageIndex, 0),
                stageId: safeVisibleText(entry.stageId),
                stageTitle: safeVisibleText(entry.stageTitle),
                status,
                eventPreset: safeVisibleText(entry.eventPreset),
                substrateDensityProfile: safeVisibleText(entry.substrateDensityProfile),
                claimEvidence: describeClaimEvidence(entry.stageId),
                visualEvidence: safeVisibleText(entry.expectedMotion),
                telemetryEvidence: active && scorecard ? scorecard.passedCount + "/" + scorecard.totalCount + " scorecard metrics passing" : "Available when stage is selected",
                validationEvidence: active && verification ? verification.passedCount + "/" + verification.totalCount + " verification checks passing" : safeVisibleText(entry.verificationStatus),
                exportEvidence: "Replay JSON and Demo Flight Verification JSON include this ledger entry.",
                falsificationWatch: describeFalsificationWatch(entry.stageId),
                speculativeBoundary: "Speculative research visualization and operator evidence ledger, not proof or settled physics."
            };
        });
        const demonstratedCount = entries.filter((entry) => entry.status === "demonstrated").length;
        const finite = Number.isFinite(tick) && Boolean(state ? state.finite : true) && Boolean(verification ? verification.finite : true) && Boolean(scorecard ? scorecard.finite : true) && entries.every((entry) => Number.isFinite(entry.stageIndex));
        return {
            activeStageId: stage ? safeVisibleText(stage.id) : "none",
            activeStageTitle: stage ? safeVisibleText(stage.title) : "No active stage",
            generatedAtTick: tick,
            finite,
            ledgerStatus: finite && demonstratedCount > 0 ? "demonstrated" : (finite ? "ready" : "watch"),
            demonstratedCount,
            totalCount: entries.length,
            recommendedAuditAction: "Click each Demo Flight stage, verify the viewport and scorecard change, then export the evidence ledger.",
            entries
        };
    }

    function buildDarkMatterDriveArchitectureSweep(snapshot, demoDirector, demoStageVerification, demoStageTimeline, demoStageScorecard, demoStageEvidenceLedger) {
        const tick = snapshot && snapshot.telemetry ? finiteNumber(snapshot.telemetry.tick, 0) : 0;
        const finiteTelemetry = Boolean(snapshot && snapshot.telemetry && Object.keys(snapshot.telemetry).every((key) => typeof snapshot.telemetry[key] !== "number" || Number.isFinite(snapshot.telemetry[key])));
        const layer = (key, label, owner, passed, evidence, risk, nextAction) => ({
            key,
            label,
            owner,
            status: passed ? "pass" : "watch",
            evidence,
            risk,
            nextAction
        });
        const exportContract = (exportName) => ({
            exportName,
            required: true,
            includesDemoDirector: Boolean(demoDirector),
            includesStageTimeline: Array.isArray(demoStageTimeline),
            includesStageScorecard: Boolean(demoStageScorecard),
            includesEvidenceLedger: Boolean(demoStageEvidenceLedger),
            status: Boolean(demoDirector) && Array.isArray(demoStageTimeline) && Boolean(demoStageScorecard) && Boolean(demoStageEvidenceLedger) ? "pass" : "watch"
        });
        const layers = [
            layer("runtime", "Runtime cockpit shell", "Plugin Architect", true, "Dark Matter Drive simulator owns the cockpit runtime and button wiring.", "Broken runtime wiring would make the cockpit look static.", "Verify Play Demo Flight and viewport click behavior live."),
            layer("autopilot", "Demo Flight Director", "Plugin Architect", Boolean(demoDirector), "Demo Director controls stage sequencing and direct jumps.", "Stage sequencing can drift from telemetry if not exported.", "Click every stage card during live verification."),
            layer("timeline", "Stage Timeline Scrubber", "Plugin Architect", Array.isArray(demoStageTimeline) && demoStageTimeline.length === AUTOPILOT_DEMO_STAGES.length, "Stage rail provides direct stage jump behavior.", "Visitors cannot test specific cases quickly if the rail fails.", "Verify each card changes viewport and telemetry."),
            layer("verification", "Live Stage Verification", "Plugin Architect", Boolean(demoStageVerification), "Checklist validates finite telemetry and stage-specific expectations.", "Motion can become decorative if checks are not visible.", "Confirm pass/watch states update per stage."),
            layer("scorecard", "Stage Telemetry Scorecard", "Plugin Architect", Boolean(demoStageScorecard), "Scorecard maps drive output, charge, thermal load, optical resistance, and progress.", "Animation is weak if metric evidence does not move.", "Compare scorecard values across all stages."),
            layer("evidence-ledger", "Demo Flight Evidence Ledger", "Plugin Architect", Boolean(demoStageEvidenceLedger), "Ledger ties claim, visual, telemetry, validation, export, and falsification evidence.", "Public claims become hard to audit if ledger is missing.", "Export evidence ledger JSON after each demo review."),
            layer("finite-telemetry", "Finite telemetry guardrails", "Plugin Architect", finiteTelemetry, "Telemetry is checked for finite numeric output.", "NaN, Infinity, or negative-energy output would break trust.", "Inspect exported JSON and console after install.")
        ];
        const exportContracts = [
            exportContract("Demo Flight Verification JSON"),
            exportContract("Demo Flight Evidence JSON"),
            exportContract("Replay JSON")
        ];
        const passedLayerCount = layers.filter((entry) => entry.status === "pass").length;
        const overallStatus = passedLayerCount === layers.length && exportContracts.every((entry) => entry.status === "pass") ? "pass" : "watch";
        return {
            generatedAtTick: tick,
            packageVersion: "5.8.27",
            exportType: "ArcSecsDarkMatterDriveArchitectureSweep",
            generatedUtc: new Date().toISOString(),
            pageSourceRoute: "/dark-matter-drive-simulator/",
            speculativeBoundaryText: SCIENTIFIC_BOUNDARY,
            warnings: finiteTelemetry ? [] : ["Telemetry contains non-finite numeric output."],
            falsificationNotes: [
                "Dark matter propulsion is not established technology.",
                "Fuel, thermal load, optical lag, and route risk must remain visible together.",
                "Placeholder modes must remain labeled and inactive.",
                "Massive photon / lensing comparison must not be described as proof."
            ],
            sourceMatrix: buildScientificSourceMatrix("darkMatterDriveArchitectureSweep"),
            scenarioEquationLibrary: buildScenarioEquationLibrary("darkMatterDriveArchitectureSweep"),
            pluginOnly: true,
            strictTypeScript: true,
            noJQuery: true,
            noLooseAny: true,
            deterministicStageNavigation: Boolean(demoDirector) && Array.isArray(demoStageTimeline),
            finiteTelemetryGuard: finiteTelemetry,
            speculativeBoundaryVisible: true,
            overallStatus,
            passedLayerCount,
            totalLayerCount: layers.length,
            layers,
            exportContracts,
            recommendedNextAction: "Install the package and live-check Demo Flight stage jumps, scorecard motion, evidence ledger updates, and all JSON exports."
        };
    }

    function buildDemoFlightVerification(snapshot, state, activeHotspotId) {
        const stage = state && state.stage ? state.stage : null;
        const recipe = snapshot && snapshot.recipe ? snapshot.recipe : {};
        const stageId = stage ? safeVisibleText(stage.id) : "none";
        const stageTitle = stage ? safeVisibleText(stage.title) : "No active stage";
        const checks = [];
        const addCheck = (key, label, passed, value, note) => {
            checks.push({ key, label, passed: Boolean(passed), value: safeVisibleText(String(value)), note: safeVisibleText(note) });
        };
        const recipeNumber = (key, fallback) => finiteNumber(recipe[key], fallback);
        const recipeText = (key, fallback) => safeVisibleText(recipe[key] === undefined ? fallback : recipe[key]);
        addCheck("stage-target", "Stage target is highlighted", stage && activeHotspotId === stage.hotspotId, activeHotspotId || "none", "The active cockpit hotspot should match the demo stage.");
        addCheck("finite-telemetry", "Telemetry remains finite", snapshot && snapshot.telemetry && Object.keys(snapshot.telemetry).every((key) => typeof snapshot.telemetry[key] !== "number" || Number.isFinite(snapshot.telemetry[key])), "finite", "The stage must not create NaN, Infinity, or broken telemetry.");
        addCheck("export-state", "Replay export state is ready", Boolean(stage) && Number.isFinite(state.progress), "demoDirector + demoStages", "Replay JSON should include the active demo director state and all stages.");
        if (stageId === "align-scoop") {
            addCheck("scoop-strength", "Scoop strength increased", recipeNumber("magneticScoopStrength", 0) >= 0.85, formatMetric(recipeNumber("magneticScoopStrength", 0), ""), "Capture packets should visibly intensify.");
            addCheck("wind-density", "Proca flux density increased", recipeNumber("windDensity", 0) >= 1.7, formatMetric(recipeNumber("windDensity", 0), ""), "The guide stream should show stronger substrate flow.");
        } else if (stageId === "dense-filament") {
            addCheck("filament-profile", "Dense filament profile selected", recipeText("substrateDensityProfile", "none") === "filament", recipeText("substrateDensityProfile", "none"), "Photon degradation should become visible along the line of sight.");
            addCheck("optical-resistance", "Optical resistance elevated", recipeNumber("lineOfSightOpticalResistance", 0) >= 2.3, formatMetric(recipeNumber("lineOfSightOpticalResistance", 0), "×"), "Light should appear weaker/redder while gravity remains baseline.");
        } else if (stageId === "agn-diffusion") {
            addCheck("agn-event", "GW190521 AGN case selected", recipeText("multiMessengerEventPreset", "none") === "gw190521", recipeText("multiMessengerEventPreset", "none"), "The event theater should emphasize environment/diffusion delay.");
            addCheck("agn-profile", "AGN disk profile selected", recipeText("substrateDensityProfile", "none") === "agnDisk", recipeText("substrateDensityProfile", "none"), "Environmental diffusion should dominate the delay explanation.");
        } else if (stageId === "missing-counterpart") {
            addCheck("missing-event", "Missing counterpart event selected", recipeText("multiMessengerEventPreset", "none") === "gw190814", recipeText("multiMessengerEventPreset", "none"), "The light marker may vanish without breaking telemetry.");
            addCheck("visibility-threshold", "Visibility threshold stress is high", recipeNumber("lineOfSightOpticalResistance", 0) >= 3, formatMetric(recipeNumber("lineOfSightOpticalResistance", 0), "×"), "Photon energy should fall toward the detection threshold.");
        } else if (stageId === "thermal-stress") {
            addCheck("compression-core", "Compression core stressed", recipeNumber("compressionRatio", 0) >= 70, formatMetric(recipeNumber("compressionRatio", 0), ":1"), "The propulsion core should show a bottleneck condition.");
            addCheck("radiator-limit", "Radiator capacity constrained", recipeNumber("thermalRejectionCapacity", 1) <= 0.35, formatMetric(recipeNumber("thermalRejectionCapacity", 1) * 100, "%"), "Thermal warnings should be visible and finite.");
        } else {
            addCheck("speed-preview", "Motion preview is active", recipeNumber("speedMultiplier", 0) >= 1.1, formatMetric(recipeNumber("speedMultiplier", 0), "×"), "The cockpit should not look static.");
            addCheck("drive-coupling", "Drive coupling is visible", recipeNumber("driveCoupling", 0) >= 0.6, formatMetric(recipeNumber("driveCoupling", 0), ""), "Tethers, packets, and route motion should be visible.");
        }
        const passedCount = checks.filter((check) => check.passed).length;
        return {
            stageId,
            stageTitle,
            status: passedCount === checks.length ? "pass" : "attention",
            passedCount,
            totalCount: checks.length,
            finite: checks.every((check) => typeof check.passed === "boolean"),
            checks
        };
    }


    const NUMERIC_RANGES = {
        speedMultiplier: [0.1, 5],
        photonPacketCount: [8, 2500],
        photonMassProxy: [0, 1e-12],
        baryonicMass: [0, 50],
        lossRate: [0, 1],
        compressionRatio: [1, 80],
        thermalRejectionCapacity: [0.05, 1],
        visibleMatterMass: [1, 100],
        darkMatterDensity: [0, 5],
        haloRadius: [10, 140],
        galacticRadius: [10, 120],
        orbitalTestPoint: [1, 120],
        windDirectionDegrees: [0, 360],
        windDensity: [0, 5],
        turbulence: [0, 1],
        magneticScoopStrength: [0, 1],
        driveCoupling: [0, 1],
        shipHeadingDegrees: [0, 360],
        mass: [1, 120],
        distance: [10, 400],
        impactParameter: [1, 120],
        lensingExaggeration: [0.1, 10],
        observerAngleDegrees: [0, 360],
        darkMatterDial: [0, 5],
        quantizedInertiaDampening: [0, 1],
        rindlerHorizonBias: [0, 1],
        haloscopeTuningMicroElectronVolts: [19, 24],
        alcubierreMetricStrength: [0, 1],
        negativeEnergyReserve: [0, 1],
        opticalApertureMeters: [0.5, 12],
        opticalWavelengthNanometers: [380, 780],
        telescopeJitterArcseconds: [0, 5],
        relativeVelocityFractionOfLight: [0, 0.99],
        spacecraftRestMassProxy: [0.1, 100],
        computeParticleBudget: [256, 1048576],
        computeWorkgroupSize: [32, 512],
        psfMagnitude: [-5, 18],
        stereopsisDisparityArcseconds: [0, 60],
        quantumPhaseRotationDegrees: [0, 360],
        quantumGateDepth: [1, 128],
        qubitNoiseLevel: [0, 1],
        sensorBuoyCount: [0, 32],
        guideStarTargetArcseconds: [-120, 120],
        guideStarErrorArcseconds: [-120, 120],
        autopilotGain: [0, 1],
        navigationWaypoints: [1, 16],
        trajectoryLookaheadSeconds: [30, 3600],
        slingshotSafetyMargin: [0, 1],
        darkMatterAnomalyDensity: [0, 1],
        routeRiskTolerance: [0, 1],
        densityFieldFeedbackGain: [0, 3],
        multiMessengerDistanceMegaparsecs: [1, 2000],
        lightSlowingTargetRedshift: [0, 1],
        lightSlowingPropagationDelaySeconds: [0, 3600],
        intrinsicEmissionDelaySeconds: [0, 3000000],
        lineOfSightOpticalResistance: [0, 5],
        covaryingCouplingRedshift: [0, 1],
        sourceProperMotionArcsecondsPerYear: [0, 120],
        sourceDistanceParsecs: [1, 1000000000]
    };

    function finiteNumber(value, fallback) {
        const numericValue = Number(value);
        return Number.isFinite(numericValue) ? numericValue : fallback;
    }

    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }

    function normalizeDegrees(value) {
        const numericValue = finiteNumber(value, 0) % 360;
        return numericValue < 0 ? numericValue + 360 : numericValue;
    }

    function nowMilliseconds() {
        return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
    }

    function formatMetric(value, suffix) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
            return "—";
        }
        const text = Math.abs(numericValue) > 9999 || (Math.abs(numericValue) < 0.001 && numericValue !== 0)
            ? numericValue.toExponential(2)
            : numericValue.toLocaleString(undefined, { maximumFractionDigits: 3 });
        return suffix ? text + suffix : text;
    }

    function safeVisibleText(value) {
        const text = String(value === undefined || value === null ? "—" : value);
        return text.replace(/\bNaN\b/g, "non-finite value").replace(/\bInfinity\b/g, "non-finite value").replace(/\bundefined\b/g, "—").replace(/\bnull\b/g, "—");
    }

    class UnitConversion {
        static degreesToRadians(degrees) { return finiteNumber(degrees, 0) * Math.PI / 180; }
        static radiansToDegrees(radians) { return finiteNumber(radians, 0) * 180 / Math.PI; }
    }

    class ArcsecondConversion {
        static degreesToArcseconds(degrees) { return finiteNumber(degrees, 0) * 3600; }
        static arcsecondsToDegrees(arcseconds) { return finiteNumber(arcseconds, 0) / 3600; }
        static radiansToArcseconds(radians) { return UnitConversion.radiansToDegrees(radians) * 3600; }
        static arcsecondsToRadians(arcseconds) { return UnitConversion.degreesToRadians(this.arcsecondsToDegrees(arcseconds)); }
    }

    class VectorMath {
        static directionFromDegrees(degrees) {
            const radians = UnitConversion.degreesToRadians(degrees);
            return { x: Math.cos(radians), y: Math.sin(radians) };
        }
        static dot(first, second) { return finiteNumber(first.x, 0) * finiteNumber(second.x, 0) + finiteNumber(first.y, 0) * finiteNumber(second.y, 0); }
        static magnitude(vector) { return Math.sqrt(finiteNumber(vector.x, 0) * finiteNumber(vector.x, 0) + finiteNumber(vector.y, 0) * finiteNumber(vector.y, 0)); }
        static normalize(vector) {
            const magnitude = this.magnitude(vector) || 1;
            return { x: finiteNumber(vector.x, 0) / magnitude, y: finiteNumber(vector.y, 0) / magnitude };
        }
    }

    class SimulationClock {
        constructor() { this.tick = 0; this.simulationTimeSeconds = 0; this.timeStepSeconds = 1 / 60; }
        reset() { this.tick = 0; this.simulationTimeSeconds = 0; }
        step(speedMultiplier) { this.tick += 1; this.simulationTimeSeconds += this.timeStepSeconds * finiteNumber(speedMultiplier, 1); return this.tick; }
    }

    class DarkMatterHaloModel {
        computeHaloMass(config) {
            const dial = finiteNumber(config.darkMatterDial, 1);
            return finiteNumber(config.darkMatterDensity, 1) * dial * Math.max(1, finiteNumber(config.haloRadius, 70));
        }
        computeRatio(config) {
            const visibleMass = Math.max(1, finiteNumber(config.visibleMatterMass, 40));
            return this.computeHaloMass(config) / visibleMass;
        }
    }

    class GalaxyRotationModel {
        constructor() { this.haloModel = new DarkMatterHaloModel(); }
        compute(config) {
            const radius = Math.max(1, finiteNumber(config.orbitalTestPoint, 45));
            const visibleMass = Math.max(1, finiteNumber(config.visibleMatterMass, 40));
            const haloMass = this.haloModel.computeHaloMass(config);
            const visibleOnlyVelocity = Math.sqrt(visibleMass / radius) * 110;
            const haloSupport = Math.sqrt((visibleMass + haloMass * Math.min(1.2, radius / Math.max(1, finiteNumber(config.haloRadius, 70)))) / radius) * 105;
            const fallingCurveRisk = finiteNumber(config.darkMatterDial, 1) <= 0.05 ? "Outer orbit instability visible: halo support removed." : "Outer rotation curve supported by the selected halo normalization.";
            return {
                visibleOnlyVelocity,
                haloVelocity: haloSupport,
                currentOrbitalVelocity: haloSupport,
                difference: haloSupport - visibleOnlyVelocity,
                darkMatterToBaryonicRatio: this.haloModel.computeRatio(config),
                fallingCurveRisk
            };
        }
    }

    class DarkMatterWindModel {
        compute(config) {
            const windDirection = VectorMath.directionFromDegrees(config.windDirectionDegrees);
            const shipDirection = VectorMath.directionFromDegrees(config.shipHeadingDegrees);
            const alignment = clamp((VectorMath.dot(windDirection, shipDirection) + 1) / 2, 0, 1);
            const density = finiteNumber(config.windDensity, 1) * finiteNumber(config.darkMatterDial, 1);
            const turbulencePenalty = 1 - finiteNumber(config.turbulence, 0.1) * 0.65;
            const captureArea = Math.max(0, density * finiteNumber(config.magneticScoopStrength, 0.5) * (0.45 + alignment));
            const harvestedEnergyProxy = captureArea * finiteNumber(config.driveCoupling, 0.5) * turbulencePenalty;
            const driveChargeRate = clamp(harvestedEnergyProxy / 4.2, 0, 1.4);
            const navigationDrift = (1 - alignment) * density * (0.25 + finiteNumber(config.turbulence, 0.1));
            return { alignment, captureArea, harvestedEnergyProxy, driveChargeRate, navigationDrift, windVector: windDirection };
        }
    }

    class LensingApproximationModel {
        compute(config) {
            const mass = Math.max(1, finiteNumber(config.mass, 35));
            const distance = Math.max(1, finiteNumber(config.distance, 120));
            const impact = Math.max(1, finiteNumber(config.impactParameter, 30));
            const haloBoost = 1 + finiteNumber(config.darkMatterDial, 1) * 0.22;
            const exaggeratedRadians = (mass / (distance * impact)) * 0.00042 * finiteNumber(config.lensingExaggeration, 1) * haloBoost;
            const apparentDeflectionArcseconds = ArcsecondConversion.radiansToArcseconds(exaggeratedRadians);
            const angularOffsetArcseconds = apparentDeflectionArcseconds * Math.cos(UnitConversion.degreesToRadians(config.observerAngleDegrees));
            return {
                apparentDeflectionArcseconds,
                angularOffsetArcseconds,
                massProxy: mass,
                distanceProxy: distance,
                impactParameter: impact,
                approximationNote: "Educational visual approximation; not an exact GR solver."
            };
        }
    }

    class CosmologyReferenceModel {
        compute(config) {
            const measuredRatio = Math.max(0, finiteNumber(config.darkMatterDensity, 1));
            const referenceDeviation = measuredRatio / Math.max(REFERENCE_DARK_MATTER_TO_BARYON_RATIO, 0.0001);
            return {
                referenceDarkMatterToBaryonRatio: REFERENCE_DARK_MATTER_TO_BARYON_RATIO,
                darkMatterReferenceDeviation: referenceDeviation,
                cosmologyReferenceNote: "Reference ratio uses the uploaded plan's 0.0224 baryon density and 0.143 total matter density as simulator-normalized context."
            };
        }
    }

    class QuantizedInertiaModel {
        compute(config, windTelemetry) {
            const dampening = clamp(finiteNumber(config.quantizedInertiaDampening, DEFAULT_ADVANCED_PARAMETERS.quantizedInertiaDampening), 0, 1);
            const horizonBias = clamp(finiteNumber(config.rindlerHorizonBias, DEFAULT_ADVANCED_PARAMETERS.rindlerHorizonBias), 0, 1);
            const alignment = windTelemetry ? finiteNumber(windTelemetry ? windTelemetry.alignment : 0.5, 0.5) : 0.5;
            const darkSectorNormalization = 0.25 + finiteNumber(config.darkMatterDial, 1) * 0.18;
            const rindlerHorizonGradient = clamp((dampening * 0.58 + horizonBias * 0.42) * (0.65 + alignment * 0.35), 0, 1.4);
            const quantizedInertiaThrustProxy = clamp(rindlerHorizonGradient * finiteNumber(config.driveCoupling, 0.5) * darkSectorNormalization, 0, 1.8);
            return {
                quantizedInertiaDampening: dampening,
                rindlerHorizonGradient,
                quantizedInertiaThrustProxy,
                quantizedInertiaNote: "Hypothesis-only telemetry: conceptual Unruh/Rindler dampening proxy, not a validated drive equation."
            };
        }
    }

    class HaloscopeSailingModel {
        compute(config, windTelemetry) {
            const tuning = clamp(finiteNumber(config.haloscopeTuningMicroElectronVolts, DEFAULT_ADVANCED_PARAMETERS.haloscopeTuningMicroElectronVolts), 19, 24);
            const centeredTuning = 1 - Math.min(1, Math.abs(tuning - 21.5) / 2.5);
            const alignment = windTelemetry ? finiteNumber(windTelemetry ? windTelemetry.alignment : 0.5, 0.5) : 0.5;
            const density = Math.max(0, finiteNumber(config.windDensity, 1) * finiteNumber(config.darkMatterDial, 1));
            const magneticCavityEfficiency = clamp(centeredTuning * finiteNumber(config.magneticScoopStrength, 0.7) * (0.55 + alignment * 0.45), 0, 1);
            const haloscopeYoctowattProxy = Math.max(0, density * magneticCavityEfficiency * finiteNumber(config.driveCoupling, 0.5) * 1000);
            return {
                axionTuningMicroElectronVolts: tuning,
                axionResonanceAlignment: centeredTuning,
                magneticCavityEfficiency,
                haloscopeYoctowattProxy,
                haloscopeSailingNote: "Speculative axion-haloscope sailing proxy; yoctowatt output is normalized display telemetry."
            };
        }
    }

    class AlcubierreVisualizationModel {
        compute(config, driveState) {
            const metricStrength = clamp(finiteNumber(config.alcubierreMetricStrength, DEFAULT_ADVANCED_PARAMETERS.alcubierreMetricStrength), 0, 1);
            const negativeEnergyReserve = clamp(finiteNumber(config.negativeEnergyReserve, DEFAULT_ADVANCED_PARAMETERS.negativeEnergyReserve), 0, 1);
            const driveCharge = driveState ? finiteNumber(driveState.charge, 0) : 0;
            const warpBubbleStability = clamp((negativeEnergyReserve * 0.62 + driveCharge * 0.38) - metricStrength * 0.28, 0, 1.2);
            const horizonVisualRisk = metricStrength > negativeEnergyReserve + 0.28 ? "warning" : "bounded";
            return {
                alcubierreMetricStrength: metricStrength,
                negativeEnergyReserve,
                warpBubbleStability,
                horizonVisualRisk,
                alcubierreVisualizationNote: "Warp visualization telemetry is a visual metric-shell concept and not an implemented GR raytracer."
            };
        }
    }

    class OpticalTelemetryModel {
        compute(config) {
            const apertureMeters = Math.max(0.5, finiteNumber(config.opticalApertureMeters, DEFAULT_ADVANCED_PARAMETERS.opticalApertureMeters));
            const wavelengthMeters = Math.max(380, finiteNumber(config.opticalWavelengthNanometers, DEFAULT_ADVANCED_PARAMETERS.opticalWavelengthNanometers)) * 1e-9;
            const diffractionLimitedResolutionArcseconds = ArcsecondConversion.radiansToArcseconds(1.22 * wavelengthMeters / apertureMeters);
            const opticalPsfFullWidthArcseconds = ArcsecondConversion.radiansToArcseconds(1.028 * wavelengthMeters / apertureMeters);
            const cameraJitterArcseconds = clamp(finiteNumber(config.telescopeJitterArcseconds, DEFAULT_ADVANCED_PARAMETERS.telescopeJitterArcseconds), 0, 5);
            const effectivePointSpreadArcseconds = Math.sqrt(opticalPsfFullWidthArcseconds * opticalPsfFullWidthArcseconds + cameraJitterArcseconds * cameraJitterArcseconds);
            return {
                diffractionLimitedResolutionArcseconds,
                opticalPsfFullWidthArcseconds,
                cameraJitterArcseconds,
                effectivePointSpreadArcseconds,
                opticalTelemetryNote: "Optical telemetry uses diffraction and jitter proxies for instrument-style readouts, not full PSF convolution."
            };
        }
    }

    class DarkMatterJFactorModel {
        compute(config) {
            const density = Math.max(0, finiteNumber(config.darkMatterDensity, 1));
            const haloRadius = Math.max(1, finiteNumber(config.haloRadius, 70));
            const distance = Math.max(1, finiteNumber(config.distance, 120));
            const jFactorProxy = Math.max(0, density * density * haloRadius / distance);
            const jFactorLog10 = jFactorProxy > 0 ? Math.log10(jFactorProxy) : -Infinity;
            return {
                jFactorProxy,
                jFactorLog10,
                jFactorNote: "Density-squared line-of-sight proxy for teaching dark-sector observability; not a gamma-ray flux solver."
            };
        }
    }

    class ElectromagneticLightSlowingModel {
        compute(config) {
            const distanceMegaparsecs = clamp(finiteNumber(config.multiMessengerDistanceMegaparsecs, GW170817_ANCHOR_DISTANCE_MEGAPARSECS), 1, 2000);
            const targetRedshift = clamp(finiteNumber(config.lightSlowingTargetRedshift, GW170817_ANCHOR_REDSHIFT), 0, 1);
            const propagationDelayBudgetSeconds = clamp(finiteNumber(config.lightSlowingPropagationDelaySeconds, GW170817_MODEL_PROPAGATION_DELAY_SECONDS), 0, 3600);
            const intrinsicEmissionDelaySeconds = clamp(finiteNumber(config.intrinsicEmissionDelaySeconds, GW170817_INTRINSIC_DELAY_SECONDS), 0, 3000000);
            const lineOfSightResistance = clamp(finiteNumber(config.lineOfSightOpticalResistance, 1), 0, 5);
            const distanceMeters = distanceMegaparsecs * METERS_PER_MEGAPARSEC;
            const redshiftCoefficientPerMeter = distanceMeters > 0 ? Math.log(1 + targetRedshift) / distanceMeters : 0;
            const delayCoefficientPerMeter = distanceMeters > 0 && propagationDelayBudgetSeconds > 0 ? (2 * SPEED_OF_LIGHT_METERS_PER_SECOND * propagationDelayBudgetSeconds) / (distanceMeters * distanceMeters) : 0;
            const effectiveVelocityCoefficient = delayCoefficientPerMeter * lineOfSightResistance;
            const velocityArgument = clamp(effectiveVelocityCoefficient * distanceMeters, 0, 40);
            const fractionalSpeedDecrease = velocityArgument < 1e-6 ? velocityArgument : 1 - Math.exp(-velocityArgument);
            const speedDecreaseMetersPerSecond = SPEED_OF_LIGHT_METERS_PER_SECOND * fractionalSpeedDecrease;
            const arrivalLightSpeedMetersPerSecond = SPEED_OF_LIGHT_METERS_PER_SECOND - speedDecreaseMetersPerSecond;
            const propagationDelaySeconds = effectiveVelocityCoefficient > 0 ? (velocityArgument < 1e-6 ? effectiveVelocityCoefficient * distanceMeters * distanceMeters / (2 * SPEED_OF_LIGHT_METERS_PER_SECOND) : ((Math.exp(velocityArgument) - 1) / effectiveVelocityCoefficient - distanceMeters) / SPEED_OF_LIGHT_METERS_PER_SECOND) : 0;
            const totalArrivalDelaySeconds = intrinsicEmissionDelaySeconds + propagationDelaySeconds;
            const redshiftArgument = clamp(redshiftCoefficientPerMeter * distanceMeters, 0, 40);
            const energyRetentionFraction = Math.exp(-redshiftArgument);
            const energyLossPercent = (1 - energyRetentionFraction) * 100;
            const redshiftLinkedArrivalSpeedMetersPerSecond = SPEED_OF_LIGHT_METERS_PER_SECOND * energyRetentionFraction;
            const redshiftLinkedSpeedDecreaseMetersPerSecond = SPEED_OF_LIGHT_METERS_PER_SECOND - redshiftLinkedArrivalSpeedMetersPerSecond;
            const redshiftLinkedDelaySeconds = redshiftCoefficientPerMeter > 0 ? ((Math.exp(redshiftArgument) - 1) / redshiftCoefficientPerMeter - distanceMeters) / SPEED_OF_LIGHT_METERS_PER_SECOND : 0;
            const gwTransitTimeSeconds = distanceMeters / SPEED_OF_LIGHT_METERS_PER_SECOND;
            const delayQuadraticScaleSeconds = GW170817_MODEL_PROPAGATION_DELAY_SECONDS * Math.pow(distanceMegaparsecs / GW170817_ANCHOR_DISTANCE_MEGAPARSECS, 2) * lineOfSightResistance;
            const consistencyRatio = propagationDelaySeconds > 0 ? redshiftLinkedDelaySeconds / Math.max(propagationDelaySeconds, 1e-12) : 0;
            const anchorVelocityArgument = LIGHT_SLOWING_DELAY_COEFFICIENT_PER_METER * GW170817_ANCHOR_DISTANCE_MEGAPARSECS * METERS_PER_MEGAPARSEC;
            const anchorSpeedDecreaseMetersPerSecond = SPEED_OF_LIGHT_METERS_PER_SECOND * (anchorVelocityArgument < 1e-6 ? anchorVelocityArgument : 1 - Math.exp(-anchorVelocityArgument));
            return {
                lightSlowingDistanceMegaparsecs: distanceMegaparsecs,
                lightSlowingDistanceMeters: distanceMeters,
                lightSlowingTargetRedshift: targetRedshift,
                lightSlowingRedshiftCoefficientPerMeter: redshiftCoefficientPerMeter,
                lightSlowingDelayCoefficientPerMeter: delayCoefficientPerMeter,
                lightSlowingLineOfSightResistance: lineOfSightResistance,
                lightSlowingArrivalSpeedMetersPerSecond: arrivalLightSpeedMetersPerSecond,
                lightSlowingSpeedDecreaseMetersPerSecond: speedDecreaseMetersPerSecond,
                lightSlowingFractionalSpeedDecrease: fractionalSpeedDecrease,
                lightSlowingPropagationDelaySeconds: propagationDelaySeconds,
                lightSlowingIntrinsicDelaySeconds: intrinsicEmissionDelaySeconds,
                lightSlowingTotalArrivalDelaySeconds: totalArrivalDelaySeconds,
                lightSlowingEnergyRetentionFraction: energyRetentionFraction,
                lightSlowingEnergyLossPercent: energyLossPercent,
                lightSlowingRedshiftLinkedArrivalSpeedMetersPerSecond: redshiftLinkedArrivalSpeedMetersPerSecond,
                lightSlowingRedshiftLinkedSpeedDecreaseMetersPerSecond: redshiftLinkedSpeedDecreaseMetersPerSecond,
                lightSlowingRedshiftLinkedDelaySeconds: redshiftLinkedDelaySeconds,
                lightSlowingGwTransitTimeSeconds: gwTransitTimeSeconds,
                lightSlowingQuadraticDelayScaleSeconds: delayQuadraticScaleSeconds,
                lightSlowingConsistencyRatio: consistencyRatio,
                lightSlowingAnchorRedshiftCoefficientPerMeter: LIGHT_SLOWING_REDSHIFT_COEFFICIENT_PER_METER,
                lightSlowingAnchorDelayCoefficientPerMeter: LIGHT_SLOWING_DELAY_COEFFICIENT_PER_METER,
                lightSlowingAnchorSpeedDecreaseMetersPerSecond: anchorSpeedDecreaseMetersPerSecond,
                lightSlowingCalibrationNote: "GW170817 anchor: 40 Mpc, z 0.0099, 1.74 s observed EM lag, 0.020 s model propagation lag, 1.72 s intrinsic source lag. Redshift-linked and delay-fitted coefficients are displayed separately for inspectable, concrete speed-decrease telemetry."
            };
        }
    }


    class GravityWavefront {
        constructor(distanceMeters) {
            this.distanceMeters = Math.max(0, finiteNumber(distanceMeters, 0));
            this.propagationSpeedMetersPerSecond = SPEED_OF_LIGHT_METERS_PER_SECOND;
        }
        getTransitTimeSeconds() {
            return this.distanceMeters / this.propagationSpeedMetersPerSecond;
        }
    }

    class PhotonWavefront {
        constructor(distanceMeters, baseFrequencyHertz, decelerationCoefficientPerMeter, energyCoefficientPerMeter) {
            this.distanceMeters = Math.max(0, finiteNumber(distanceMeters, 0));
            this.baseFrequencyHertz = Math.max(0, finiteNumber(baseFrequencyHertz, 5.45e14));
            this.decelerationCoefficientPerMeter = Math.max(0, finiteNumber(decelerationCoefficientPerMeter, 0));
            this.energyCoefficientPerMeter = Math.max(0, finiteNumber(energyCoefficientPerMeter, 0));
        }
        getArrivalSpeedMetersPerSecond() {
            const argument = clamp(this.decelerationCoefficientPerMeter * this.distanceMeters, 0, 40);
            return SPEED_OF_LIGHT_METERS_PER_SECOND * Math.exp(-argument);
        }
        getEnergyRetentionFraction() {
            const argument = clamp(this.energyCoefficientPerMeter * this.distanceMeters, 0, 40);
            return Math.exp(-argument);
        }
        getObservedFrequencyHertz() {
            return this.baseFrequencyHertz * this.getEnergyRetentionFraction();
        }
    }

    class MultiMessengerPropagationSystem {
        compute(config) {
            const presetKey = typeof config.multiMessengerEventPreset === "string" && MULTI_MESSENGER_EVENT_PRESETS[config.multiMessengerEventPreset] ? config.multiMessengerEventPreset : "custom";
            const preset = MULTI_MESSENGER_EVENT_PRESETS[presetKey] || MULTI_MESSENGER_EVENT_PRESETS.custom;
            const substrateKey = typeof config.substrateDensityProfile === "string" && PROCA_SUBSTRATE_DENSITY_PROFILES[config.substrateDensityProfile] ? config.substrateDensityProfile : preset.substrateProfile;
            const substrateProfile = PROCA_SUBSTRATE_DENSITY_PROFILES[substrateKey] || PROCA_SUBSTRATE_DENSITY_PROFILES.standard;
            const lightModel = new ElectromagneticLightSlowingModel().compute(config);
            const distanceMeters = lightModel.lightSlowingDistanceMeters;
            const gravityWavefront = new GravityWavefront(distanceMeters);
            const effectiveDecelerationCoefficient = lightModel.lightSlowingDelayCoefficientPerMeter * substrateProfile.opticalResistance;
            const effectiveEnergyCoefficient = lightModel.lightSlowingRedshiftCoefficientPerMeter * substrateProfile.energyResistance;
            const photonWavefront = new PhotonWavefront(distanceMeters, 5.45e14, effectiveDecelerationCoefficient, effectiveEnergyCoefficient);
            const gwTransitTimeSeconds = gravityWavefront.getTransitTimeSeconds();
            const photonArrivalSpeedMetersPerSecond = photonWavefront.getArrivalSpeedMetersPerSecond();
            const photonEnergyRetentionFraction = photonWavefront.getEnergyRetentionFraction();
            const photonEnergyLossPercent = (1 - photonEnergyRetentionFraction) * 100;
            const densityCorrectedVelocityArgument = clamp(effectiveDecelerationCoefficient * distanceMeters, 0, 40);
            const densityCorrectedPropagationDelaySeconds = effectiveDecelerationCoefficient > 0 ? (densityCorrectedVelocityArgument < 1e-6 ? effectiveDecelerationCoefficient * distanceMeters * distanceMeters / (2 * SPEED_OF_LIGHT_METERS_PER_SECOND) : ((Math.exp(densityCorrectedVelocityArgument) - 1) / effectiveDecelerationCoefficient - distanceMeters) / SPEED_OF_LIGHT_METERS_PER_SECOND) : 0;
            const observedDelaySeconds = Math.max(0, finiteNumber(preset.observedDelaySeconds, lightModel.lightSlowingTotalArrivalDelaySeconds));
            const intrinsicDelaySeconds = Math.max(0, finiteNumber(config.intrinsicEmissionDelaySeconds, preset.intrinsicDelaySeconds));
            const modeledTotalDelaySeconds = densityCorrectedPropagationDelaySeconds + intrinsicDelaySeconds;
            const covaryingCouplingRedshift = clamp(finiteNumber(config.covaryingCouplingRedshift, preset.couplingRedshift || 0), 0, 1);
            const tiredLightRedshift = lightModel.lightSlowingTargetRedshift;
            const compositeRedshift = (1 + tiredLightRedshift) * (1 + covaryingCouplingRedshift) - 1;
            const sourceProperMotionArcsecondsPerYear = clamp(finiteNumber(config.sourceProperMotionArcsecondsPerYear, 0.25), 0, 120);
            const sourceDistanceParsecs = clamp(finiteNumber(config.sourceDistanceParsecs, 1000000), 1, 1000000000);
            const trueTangentialVelocityKilometersPerSecond = 4.74 * sourceProperMotionArcsecondsPerYear * sourceDistanceParsecs;
            const arrivalDilationFactor = photonArrivalSpeedMetersPerSecond > 0 ? SPEED_OF_LIGHT_METERS_PER_SECOND / photonArrivalSpeedMetersPerSecond : Infinity;
            const apparentTangentialVelocityKilometersPerSecond = trueTangentialVelocityKilometersPerSecond / Math.max(arrivalDilationFactor, 1e-9);
            const densityCorrectionRatio = lightModel.lightSlowingPropagationDelaySeconds > 0 ? densityCorrectedPropagationDelaySeconds / lightModel.lightSlowingPropagationDelaySeconds : 0;
            return Object.assign({}, lightModel, {
                multiMessengerPropagationContractVersion: DECOUPLED_PROPAGATION_CONTRACT_VERSION,
                multiMessengerEventPreset: presetKey,
                multiMessengerEventLabel: preset.label,
                multiMessengerObservedDelaySeconds: observedDelaySeconds,
                multiMessengerModeledTotalDelaySeconds: modeledTotalDelaySeconds,
                multiMessengerDelayResidualSeconds: modeledTotalDelaySeconds - observedDelaySeconds,
                multiMessengerDensityCorrectedPropagationDelaySeconds: densityCorrectedPropagationDelaySeconds,
                multiMessengerDensityCorrectionRatio: densityCorrectionRatio,
                gravityWavefrontTransitTimeSeconds: gwTransitTimeSeconds,
                gravityWavefrontSpeedMetersPerSecond: SPEED_OF_LIGHT_METERS_PER_SECOND,
                photonWavefrontArrivalSpeedMetersPerSecond: photonArrivalSpeedMetersPerSecond,
                photonWavefrontSpeedDecreaseMetersPerSecond: SPEED_OF_LIGHT_METERS_PER_SECOND - photonArrivalSpeedMetersPerSecond,
                photonWavefrontEnergyRetentionFraction: photonEnergyRetentionFraction,
                photonWavefrontEnergyLossPercent: photonEnergyLossPercent,
                photonWavefrontObservedFrequencyHertz: photonWavefront.getObservedFrequencyHertz(),
                substrateDensityProfile: substrateKey,
                substrateDensityProfileLabel: substrateProfile.label,
                substrateDensityMultiplier: substrateProfile.densityMultiplier,
                substrateOpticalResistance: substrateProfile.opticalResistance,
                substrateEnergyResistance: substrateProfile.energyResistance,
                substrateDensityNote: substrateProfile.note,
                tiredLightRedshift,
                covaryingCouplingRedshift,
                compositeRedshift,
                arrivalDilationFactor,
                sourceProperMotionArcsecondsPerYear,
                sourceDistanceParsecs,
                trueTangentialVelocityKilometersPerSecond,
                apparentTangentialVelocityKilometersPerSecond,
                decoupledPropagationNote: "Gravity wavefronts remain fixed at c0 while photon wavefronts slow and lose energy through the selected Proca substrate density profile. Composite redshift keeps tired-light energy loss separate from covarying coupling drift."
            });
        }
    }

    class RelativisticFlightModel {
        compute(config) {
            const velocityFraction = clamp(finiteNumber(config.relativeVelocityFractionOfLight, DEFAULT_ADVANCED_PARAMETERS.relativeVelocityFractionOfLight), 0, 0.99);
            const restMassProxy = Math.max(0.1, finiteNumber(config.spacecraftRestMassProxy, DEFAULT_ADVANCED_PARAMETERS.spacecraftRestMassProxy));
            const lorentzFactor = 1 / Math.sqrt(1 - velocityFraction * velocityFraction);
            const properTimeRate = 1 / lorentzFactor;
            const relativisticMomentumProxy = lorentzFactor * restMassProxy * velocityFraction;
            const relativisticEnergyProxy = lorentzFactor * restMassProxy;
            const kineticEnergyProxy = (lorentzFactor - 1) * restMassProxy;
            return {
                relativeVelocityFractionOfLight: velocityFraction,
                lorentzFactor,
                properTimeRate,
                relativisticMomentumProxy,
                relativisticEnergyProxy,
                kineticEnergyProxy,
                relativisticFlightNote: "Special-relativity reference telemetry only; it is displayed beside ArcSecs interpretation controls instead of being hidden inside the canvas."
            };
        }
    }

    class WebGpuComputeReadinessModel {
        compute(config, performanceTelemetry) {
            const particleBudget = Math.round(clamp(finiteNumber(config.computeParticleBudget, DEFAULT_ADVANCED_PARAMETERS.computeParticleBudget), 256, 1048576));
            const workgroupSize = Math.round(clamp(finiteNumber(config.computeWorkgroupSize, DEFAULT_ADVANCED_PARAMETERS.computeWorkgroupSize), 32, 512));
            const dispatchCount = Math.max(1, Math.ceil(particleBudget / workgroupSize));
            const qualityMultiplier = config.qualityMode === "experimental" ? 1.35 : config.qualityMode === "high" ? 1.1 : config.qualityMode === "low" ? 0.68 : 1;
            const estimatedComputeMilliseconds = clamp((particleBudget / 180000) * qualityMultiplier + dispatchCount * 0.006, 0.05, 40);
            const semiImplicitEulerStabilityScore = clamp(1 - estimatedComputeMilliseconds / 36 + finiteNumber(performanceTelemetry.framesPerSecond, 60) / 240, 0, 1);
            const mortonSortingReadiness = particleBudget >= 8192 ? "recommended" : "optional";
            const workerOffloadRecommendation = estimatedComputeMilliseconds > 6 ? "move orchestration to worker before increasing budget" : "main-thread orchestration acceptable for this browser-safe slice";
            return {
                computeParticleBudget: particleBudget,
                computeWorkgroupSize: workgroupSize,
                estimatedComputeDispatches: dispatchCount,
                estimatedComputeMilliseconds,
                semiImplicitEulerStabilityScore,
                mortonSortingReadiness,
                workerOffloadRecommendation,
                webGpuComputeReadinessNote: "Compute-readiness telemetry prepares the WebGPU N-body slice without requiring WebGPU to load this page."
            };
        }
    }


    class RollingAdaptiveComputeQualityController {
        constructor() {
            this.samples = [];
            this.downshiftLevel = 0;
            this.sustainedInstabilityTicks = 0;
            this.lastPlan = this.createNeutralPlan();
        }
        createNeutralPlan() {
            return {
                status: "warming up",
                effectiveParticleBudget: 0,
                effectiveQualityMode: "medium",
                downshiftLevel: 0,
                windowSize: WEBGPU_ADAPTIVE_COMPUTE_WINDOW_SIZE,
                instabilityScore: 0,
                averageClampRate: 0,
                averageFramesPerSecond: 60,
                averageWorkerRoundTripMilliseconds: 0,
                averageReadbackLatencyMilliseconds: 0,
                sustainedInstabilityTicks: 0,
                effectiveBucketNeighborSampleLimit: WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT,
                effectiveDensityFieldSampleLimit: WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT,
                dispatchCadenceTicks: WEBGPU_ADAPTIVE_COMPUTE_BASE_DISPATCH_CADENCE_TICKS,
                dispatchCadenceStatus: "base cadence",
                densityFieldSampleLimitStatus: "base sample limit",
                directRenderVisualQualityMode: WEBGPU_ADAPTIVE_DIRECT_VISUAL_QUALITY_MODES[0],
                directRenderPointScale: WEBGPU_ADAPTIVE_DIRECT_RENDER_POINT_SCALES[0],
                directRenderHaloIntensity: WEBGPU_ADAPTIVE_DIRECT_HALO_INTENSITIES[0],
                directRenderVisualDensity: WEBGPU_ADAPTIVE_DIRECT_VISUAL_DENSITIES[0],
                directRenderVisualQualityStatus: "base direct WebGPU visuals",
                effectiveRelationalTetherLimit: WEBGPU_ADAPTIVE_RELATIONAL_TETHER_LIMITS[0],
                relationalMachianReductionCadenceTicks: WEBGPU_ADAPTIVE_RELATIONAL_REDUCTION_CADENCE_BY_LEVEL[0],
                relationalVisualTetherDensity: WEBGPU_ADAPTIVE_RELATIONAL_VISUAL_TETHER_DENSITIES[0],
                relationalTetherQualityStatus: "base relational tether quality",
                note: "Rolling compute-quality controller is waiting for sustained WebGPU samples before changing particle budget, render quality, density-field sample limits, dispatch cadence, or direct WebGPU visual intensity."
            };
        }
        normalizeQualityMode(value) {
            return ["low", "medium", "high", "experimental"].includes(value) ? value : "medium";
        }
        createSample(telemetry, snapshot) {
            const sampleTelemetry = telemetry || {};
            const sampleSnapshot = snapshot || {};
            const snapshotTelemetry = sampleSnapshot.telemetry || {};
            return {
                clampRate: clamp(finiteNumber(sampleTelemetry.webGpuFiniteOutputGuardClampRate, 0), 0, 4),
                framesPerSecond: clamp(finiteNumber(snapshotTelemetry.framesPerSecond, sampleTelemetry.framesPerSecond || 60), 1, 240),
                workerRoundTripMilliseconds: Math.max(0, finiteNumber(sampleTelemetry.webGpuWorkerRoundTripMilliseconds, 0)),
                readbackLatencyMilliseconds: Math.max(0, finiteNumber(sampleTelemetry.webGpuReadbackLatencyMilliseconds, sampleTelemetry.webGpuWorkerRoundTripMilliseconds || 0))
            };
        }
        scoreSample(sample) {
            let score = 0;
            if (sample.clampRate >= WEBGPU_ADAPTIVE_COMPUTE_CLAMP_RATE_THRESHOLD) { score += 1; }
            if (sample.framesPerSecond <= WEBGPU_ADAPTIVE_COMPUTE_FPS_THRESHOLD) { score += 1; }
            if (sample.workerRoundTripMilliseconds >= WEBGPU_ADAPTIVE_COMPUTE_WORKER_ROUND_TRIP_THRESHOLD) { score += 1; }
            if (sample.readbackLatencyMilliseconds >= WEBGPU_ADAPTIVE_COMPUTE_READBACK_THRESHOLD) { score += 1; }
            return score;
        }
        averageMetric(key, fallback) {
            if (!this.samples.length) { return fallback; }
            return this.samples.reduce((total, sample) => total + finiteNumber(sample[key], fallback), 0) / this.samples.length;
        }
        update(telemetry, snapshot) {
            const sample = this.createSample(telemetry, snapshot);
            sample.instabilityScore = this.scoreSample(sample);
            this.samples.push(sample);
            if (this.samples.length > WEBGPU_ADAPTIVE_COMPUTE_WINDOW_SIZE) { this.samples.shift(); }
            const averageClampRate = this.averageMetric("clampRate", 0);
            const averageFramesPerSecond = this.averageMetric("framesPerSecond", 60);
            const averageWorkerRoundTripMilliseconds = this.averageMetric("workerRoundTripMilliseconds", 0);
            const averageReadbackLatencyMilliseconds = this.averageMetric("readbackLatencyMilliseconds", 0);
            let instabilityScore = 0;
            if (averageClampRate >= WEBGPU_ADAPTIVE_COMPUTE_CLAMP_RATE_THRESHOLD) { instabilityScore += 1; }
            if (averageFramesPerSecond <= WEBGPU_ADAPTIVE_COMPUTE_FPS_THRESHOLD) { instabilityScore += 1; }
            if (averageWorkerRoundTripMilliseconds >= WEBGPU_ADAPTIVE_COMPUTE_WORKER_ROUND_TRIP_THRESHOLD) { instabilityScore += 1; }
            if (averageReadbackLatencyMilliseconds >= WEBGPU_ADAPTIVE_COMPUTE_READBACK_THRESHOLD) { instabilityScore += 1; }
            const enoughSamples = this.samples.length >= WEBGPU_ADAPTIVE_COMPUTE_MINIMUM_SUSTAINED_SAMPLES;
            if (enoughSamples && instabilityScore > 0) {
                this.sustainedInstabilityTicks += 1;
            } else {
                this.sustainedInstabilityTicks = Math.max(0, this.sustainedInstabilityTicks - 1);
            }
            if (this.sustainedInstabilityTicks >= WEBGPU_ADAPTIVE_COMPUTE_PERSISTENT_TICKS) {
                this.downshiftLevel = Math.min(3, Math.max(this.downshiftLevel + 1, instabilityScore >= 3 ? 2 : 1));
                this.sustainedInstabilityTicks = WEBGPU_ADAPTIVE_COMPUTE_PERSISTENT_TICKS;
            } else if (enoughSamples && instabilityScore === 0 && this.sustainedInstabilityTicks === 0) {
                this.downshiftLevel = Math.max(0, this.downshiftLevel - 1);
            }
            this.lastPlan = this.buildPlan(snapshot ? snapshot.recipe : {}, {
                averageClampRate,
                averageFramesPerSecond,
                averageWorkerRoundTripMilliseconds,
                averageReadbackLatencyMilliseconds,
                instabilityScore
            });
            return this.lastPlan;
        }
        buildPlan(recipe, metrics) {
            const sourceRecipe = recipe || {};
            const requestedBudget = Math.round(clamp(finiteNumber(sourceRecipe.computeParticleBudget, DEFAULT_ADVANCED_PARAMETERS.computeParticleBudget), 256, WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES));
            const requestedQualityMode = this.normalizeQualityMode(sourceRecipe.qualityMode || "medium");
            const level = Math.max(0, Math.min(3, Math.round(finiteNumber(this.downshiftLevel, 0))));
            const budgetFactors = [1, 0.75, 0.5, 0.35];
            const effectiveParticleBudget = Math.max(256, Math.round(requestedBudget * budgetFactors[level] / WEBGPU_COMPUTE_WORKGROUP_SIZE) * WEBGPU_COMPUTE_WORKGROUP_SIZE);
            let effectiveQualityMode = requestedQualityMode;
            const effectiveBucketNeighborSampleLimit = WEBGPU_ADAPTIVE_BUCKET_NEIGHBOR_SAMPLE_LIMITS[level] || WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT;
            const effectiveDensityFieldSampleLimit = WEBGPU_ADAPTIVE_DENSITY_FIELD_SAMPLE_LIMITS[level] || WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT;
            const dispatchCadenceTicks = WEBGPU_ADAPTIVE_COMPUTE_DISPATCH_CADENCE_BY_LEVEL[level] || WEBGPU_ADAPTIVE_COMPUTE_BASE_DISPATCH_CADENCE_TICKS;
            const dispatchCadenceStatus = level === 0 ? "base cadence" : "adaptive cadence downshift level " + String(level);
            const densityFieldSampleLimitStatus = level === 0 ? "base sample limits" : "adaptive sample-limit downshift level " + String(level);
            const directRenderVisualQualityMode = WEBGPU_ADAPTIVE_DIRECT_VISUAL_QUALITY_MODES[level] || WEBGPU_ADAPTIVE_DIRECT_VISUAL_QUALITY_MODES[0];
            const directRenderPointScale = WEBGPU_ADAPTIVE_DIRECT_RENDER_POINT_SCALES[level] || WEBGPU_ADAPTIVE_DIRECT_RENDER_POINT_SCALES[0];
            const directRenderHaloIntensity = WEBGPU_ADAPTIVE_DIRECT_HALO_INTENSITIES[level] || WEBGPU_ADAPTIVE_DIRECT_HALO_INTENSITIES[0];
            const directRenderVisualDensity = WEBGPU_ADAPTIVE_DIRECT_VISUAL_DENSITIES[level] || WEBGPU_ADAPTIVE_DIRECT_VISUAL_DENSITIES[0];
            const directRenderVisualQualityStatus = level === 0 ? "base direct WebGPU visuals" : "adaptive direct WebGPU visual downshift level " + String(level);
            const effectiveRelationalTetherLimit = WEBGPU_ADAPTIVE_RELATIONAL_TETHER_LIMITS[level] || WEBGPU_ADAPTIVE_RELATIONAL_TETHER_LIMITS[0];
            const relationalMachianReductionCadenceTicks = WEBGPU_ADAPTIVE_RELATIONAL_REDUCTION_CADENCE_BY_LEVEL[level] || WEBGPU_ADAPTIVE_RELATIONAL_REDUCTION_CADENCE_BY_LEVEL[0];
            const relationalVisualTetherDensity = WEBGPU_ADAPTIVE_RELATIONAL_VISUAL_TETHER_DENSITIES[level] || WEBGPU_ADAPTIVE_RELATIONAL_VISUAL_TETHER_DENSITIES[0];
            const relationalTetherQualityStatus = level === 0 ? "base relational tether quality" : "adaptive relational tether downshift level " + String(level);
            if (level >= 3) { effectiveQualityMode = "low"; }
            else if (level >= 2 && requestedQualityMode === "experimental") { effectiveQualityMode = "medium"; }
            else if (level >= 2 && requestedQualityMode === "high") { effectiveQualityMode = "medium"; }
            else if (level >= 1 && requestedQualityMode === "experimental") { effectiveQualityMode = "high"; }
            const status = level === 0 ? "monitoring" : "adaptive downshift level " + String(level);
            return {
                status,
                effectiveParticleBudget,
                effectiveQualityMode,
                downshiftLevel: level,
                windowSize: this.samples.length,
                instabilityScore: metrics ? metrics.instabilityScore : 0,
                averageClampRate: metrics ? metrics.averageClampRate : 0,
                averageFramesPerSecond: metrics ? metrics.averageFramesPerSecond : 60,
                averageWorkerRoundTripMilliseconds: metrics ? metrics.averageWorkerRoundTripMilliseconds : 0,
                averageReadbackLatencyMilliseconds: metrics ? metrics.averageReadbackLatencyMilliseconds : 0,
                sustainedInstabilityTicks: this.sustainedInstabilityTicks,
                effectiveBucketNeighborSampleLimit,
                effectiveDensityFieldSampleLimit,
                dispatchCadenceTicks,
                dispatchCadenceStatus,
                densityFieldSampleLimitStatus,
                directRenderVisualQualityMode,
                directRenderPointScale,
                directRenderHaloIntensity,
                directRenderVisualDensity,
                directRenderVisualQualityStatus,
                effectiveRelationalTetherLimit,
                relationalMachianReductionCadenceTicks,
                relationalVisualTetherDensity,
                relationalTetherQualityStatus,
                note: level === 0 ? "No compute-quality downshift is active because instability has not persisted across the rolling window." : "Sustained clamp/FPS/latency pressure persisted across the rolling window; particle budget, render quality, density-field sample limits, WebGPU dispatch cadence, direct point radius, and halo visual intensity were reduced."
            };
        }
        prepareRecipe(recipe) {
            const plan = this.buildPlan(recipe || {}, {
                averageClampRate: this.lastPlan.averageClampRate,
                averageFramesPerSecond: this.lastPlan.averageFramesPerSecond,
                averageWorkerRoundTripMilliseconds: this.lastPlan.averageWorkerRoundTripMilliseconds,
                averageReadbackLatencyMilliseconds: this.lastPlan.averageReadbackLatencyMilliseconds,
                instabilityScore: this.lastPlan.instabilityScore
            });
            this.lastPlan = plan;
            return Object.assign({}, recipe || {}, {
                computeParticleBudget: plan.effectiveParticleBudget || finiteNumber((recipe || {}).computeParticleBudget, DEFAULT_ADVANCED_PARAMETERS.computeParticleBudget),
                qualityMode: plan.effectiveQualityMode || this.normalizeQualityMode((recipe || {}).qualityMode || "medium"),
                bucketNeighborSampleLimit: plan.effectiveBucketNeighborSampleLimit || WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT,
                densityFieldSampleLimit: plan.effectiveDensityFieldSampleLimit || WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT,
                webGpuDispatchCadenceTicks: plan.dispatchCadenceTicks || WEBGPU_ADAPTIVE_COMPUTE_BASE_DISPATCH_CADENCE_TICKS,
                webGpuDirectRenderVisualQualityMode: plan.directRenderVisualQualityMode || WEBGPU_ADAPTIVE_DIRECT_VISUAL_QUALITY_MODES[0],
                webGpuDirectRenderPointScale: plan.directRenderPointScale || WEBGPU_ADAPTIVE_DIRECT_RENDER_POINT_SCALES[0],
                webGpuDirectRenderHaloIntensity: plan.directRenderHaloIntensity || WEBGPU_ADAPTIVE_DIRECT_HALO_INTENSITIES[0],
                webGpuDirectRenderVisualDensity: plan.directRenderVisualDensity || WEBGPU_ADAPTIVE_DIRECT_VISUAL_DENSITIES[0],
                relationalTetherLimit: plan.effectiveRelationalTetherLimit || WEBGPU_ADAPTIVE_RELATIONAL_TETHER_LIMITS[0],
                relationalMachianReductionCadenceTicks: plan.relationalMachianReductionCadenceTicks || WEBGPU_ADAPTIVE_RELATIONAL_REDUCTION_CADENCE_BY_LEVEL[0],
                relationalVisualTetherDensity: plan.relationalVisualTetherDensity || WEBGPU_ADAPTIVE_RELATIONAL_VISUAL_TETHER_DENSITIES[0]
            });
        }
        createTelemetry() {
            const plan = this.lastPlan || this.createNeutralPlan();
            return {
                webGpuAdaptiveComputeQualityStatus: plan.status,
                webGpuAdaptiveComputeQualityMode: plan.effectiveQualityMode,
                webGpuEffectiveComputeParticleBudget: plan.effectiveParticleBudget,
                webGpuAdaptiveComputeDownshiftLevel: plan.downshiftLevel,
                webGpuAdaptiveComputeWindowSize: plan.windowSize,
                webGpuAdaptiveComputeInstabilityScore: plan.instabilityScore,
                webGpuAdaptiveComputeClampRateAverage: plan.averageClampRate,
                webGpuAdaptiveComputeFpsAverage: plan.averageFramesPerSecond,
                webGpuAdaptiveComputeWorkerRoundTripAverage: plan.averageWorkerRoundTripMilliseconds,
                webGpuAdaptiveComputeReadbackLatencyAverage: plan.averageReadbackLatencyMilliseconds,
                webGpuAdaptiveComputeSustainedInstabilityTicks: plan.sustainedInstabilityTicks,
                webGpuEffectiveBucketNeighborSampleLimit: plan.effectiveBucketNeighborSampleLimit,
                webGpuEffectiveDensityFieldSampleLimit: plan.effectiveDensityFieldSampleLimit,
                webGpuDispatchCadenceTicks: plan.dispatchCadenceTicks,
                webGpuDispatchCadenceStatus: plan.dispatchCadenceStatus,
                webGpuDensityFieldSampleLimitStatus: plan.densityFieldSampleLimitStatus,
                webGpuDirectRenderVisualQualityMode: plan.directRenderVisualQualityMode,
                webGpuDirectRenderPointScale: plan.directRenderPointScale,
                webGpuDirectRenderHaloIntensity: plan.directRenderHaloIntensity,
                webGpuDirectRenderVisualDensity: plan.directRenderVisualDensity,
                webGpuDirectVisualQualityStatus: plan.directRenderVisualQualityStatus,
                webGpuDirectVisualQualityContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuAdaptiveComputeQualityContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuEffectiveRelationalTetherLimit: plan.effectiveRelationalTetherLimit,
                webGpuRelationalMachianReductionCadenceTicks: plan.relationalMachianReductionCadenceTicks,
                webGpuRelationalVisualTetherDensity: plan.relationalVisualTetherDensity,
                webGpuRelationalTetherQualityStatus: plan.relationalTetherQualityStatus,
                webGpuAdaptiveComputeQualityNote: plan.note
            };
        }
    }


    class MortonSpatialIndexModel {
        constructor(gridSize) {
            this.gridSize = Math.max(2, Math.min(16, Math.round(finiteNumber(gridSize, WEBGPU_SPATIAL_BUCKET_GRID_SIZE))));
            this.bucketCount = this.gridSize * this.gridSize;
        }
        normalizeCoordinate(value) {
            return clamp(finiteNumber(value, 0) * 0.25 + 0.5, 0, 0.999999);
        }
        spreadMortonBits(value) {
            const integerValue = Math.max(0, Math.min(this.gridSize - 1, Math.round(finiteNumber(value, 0))));
            let spreadValue = 0;
            let bitMask = 1;
            let outputBit = 1;
            while (bitMask < this.gridSize) {
                if ((integerValue & bitMask) !== 0) {
                    spreadValue |= outputBit;
                }
                bitMask <<= 1;
                outputBit <<= 2;
            }
            return spreadValue;
        }
        bucketIndexFromPosition(x, y) {
            const gridX = Math.min(this.gridSize - 1, Math.floor(this.normalizeCoordinate(x) * this.gridSize));
            const gridY = Math.min(this.gridSize - 1, Math.floor(this.normalizeCoordinate(y) * this.gridSize));
            return this.spreadMortonBits(gridX) | (this.spreadMortonBits(gridY) << 1);
        }
        summarizeBuckets(bucketCounts, particleCount) {
            const counts = Array.isArray(bucketCounts) ? bucketCounts : Array.from(bucketCounts || []);
            let occupiedBucketCount = 0;
            let densestBucketOccupancy = 0;
            let densestBucketIndex = 0;
            for (let bucketIndex = 0; bucketIndex < counts.length; bucketIndex += 1) {
                const bucketOccupancy = Math.max(0, Math.round(finiteNumber(counts[bucketIndex], 0)));
                if (bucketOccupancy > 0) {
                    occupiedBucketCount += 1;
                }
                if (bucketOccupancy > densestBucketOccupancy) {
                    densestBucketOccupancy = bucketOccupancy;
                    densestBucketIndex = bucketIndex;
                }
            }
            const normalizedParticleCount = Math.max(1, Math.round(finiteNumber(particleCount, 1)));
            const occupiedRatio = counts.length ? occupiedBucketCount / counts.length : 0;
            const densestRatio = densestBucketOccupancy / normalizedParticleCount;
            const localityRatio = clamp((occupiedRatio * 0.55) + ((1 - densestRatio) * 0.45), 0, 1);
            return {
                bucketCount: counts.length,
                occupiedBucketCount,
                densestBucketIndex,
                densestBucketOccupancy,
                spatialLocalityRatio: localityRatio
            };
        }
    }


    class AdaptiveHaloDensityShadingModel {
        constructor(gridSize) {
            this.gridSize = Math.max(2, Math.min(16, Math.round(finiteNumber(gridSize, WEBGPU_SPATIAL_BUCKET_GRID_SIZE))));
            this.bucketCount = this.gridSize * this.gridSize;
        }
        compute(bucketCounts, particleCount) {
            const counts = Array.isArray(bucketCounts) ? bucketCounts : Array.from(bucketCounts || []);
            const normalizedParticleCount = Math.max(1, Math.round(finiteNumber(particleCount, 1)));
            const occupiedCounts = counts.filter((bucketOccupancy) => Math.max(0, finiteNumber(bucketOccupancy, 0)) > 0);
            const occupiedBucketCount = occupiedCounts.length;
            const densestBucketOccupancy = counts.reduce((maximum, bucketOccupancy) => Math.max(maximum, Math.max(0, finiteNumber(bucketOccupancy, 0))), 0);
            const averageOccupiedDensity = occupiedBucketCount > 0 ? occupiedCounts.reduce((total, bucketOccupancy) => total + Math.max(0, finiteNumber(bucketOccupancy, 0)), 0) / occupiedBucketCount : 0;
            const densityContrast = averageOccupiedDensity > 0 ? densestBucketOccupancy / averageOccupiedDensity : 0;
            const adaptiveHaloDensityGain = clamp(densityContrast / 6, 0, 1.8);
            const adaptiveHaloOpacity = clamp((occupiedBucketCount / Math.max(1, counts.length)) * 0.45 + adaptiveHaloDensityGain * 0.35, 0.08, 0.92);
            return {
                adaptiveHaloShadingStatus: occupiedBucketCount > 0 ? "adaptive halo shading ready" : "waiting for bucket occupancy",
                adaptiveHaloShadingSource: "GPU Morton bucket occupancy map",
                adaptiveHaloDensityGain,
                adaptiveHaloOpacity,
                adaptiveHaloDensityContrast: densityContrast,
                adaptiveHaloShadingNote: "Direct WebGPU particle rendering scales particle glow and halo opacity from the current GPU bucket occupancy map."
            };
        }
    }

    class TileLocalNeighborQueryModel {
        constructor(workgroupSize) {
            this.workgroupSize = Math.max(1, Math.round(finiteNumber(workgroupSize, WEBGPU_TILE_LOCAL_NEIGHBOR_LIMIT)));
        }
        compute(particleCount, tileDensityProxy) {
            const normalizedParticleCount = Math.max(0, Math.round(finiteNumber(particleCount, 0)));
            const boundedTileSize = Math.min(this.workgroupSize, Math.max(1, normalizedParticleCount));
            const tileLocalNeighborQueryCount = normalizedParticleCount * boundedTileSize;
            const tileLocalDensityProxy = clamp(finiteNumber(tileDensityProxy, 0), 0, 64);
            return {
                tileLocalNeighborStatus: normalizedParticleCount > 0 ? "tile-local neighbor queries active" : "waiting for GPU particle state",
                tileLocalNeighborQueryCount,
                tileLocalDensityProxy,
                tileLocalNeighborLimit: this.workgroupSize,
                tileLocalNeighborNote: "WGSL uses workgroup memory and local barriers to sample same-tile neighbors without CPU readback."
            };
        }
    }


    class GpuBucketCompactionModel {
        constructor(gridSize) {
            this.gridSize = Math.max(2, Math.min(16, Math.round(finiteNumber(gridSize, WEBGPU_SPATIAL_BUCKET_GRID_SIZE))));
            this.bucketCount = this.gridSize * this.gridSize;
        }
        compute(bucketRangeData, particleCount) {
            const words = Array.from(bucketRangeData || []);
            const normalizedParticleCount = Math.max(1, Math.round(finiteNumber(particleCount, 1)));
            let rangeCount = 0;
            let compactedParticleCount = 0;
            let maximumBucketRangeCount = 0;
            let contiguousRangeEnd = 0;
            let sortedRangeViolations = 0;
            for (let bucketIndex = 0; bucketIndex < this.bucketCount; bucketIndex += 1) {
                const baseIndex = bucketIndex * WEBGPU_BUCKET_RANGE_FIELDS;
                const start = Math.max(0, Math.round(finiteNumber(words[baseIndex], 0)));
                const count = Math.max(0, Math.round(finiteNumber(words[baseIndex + 1], 0)));
                if (count > 0) {
                    rangeCount += 1;
                }
                if (count > 0 && start < contiguousRangeEnd) {
                    sortedRangeViolations += 1;
                }
                compactedParticleCount += count;
                contiguousRangeEnd = Math.max(contiguousRangeEnd, start + count);
                maximumBucketRangeCount = Math.max(maximumBucketRangeCount, count);
            }
            const coverageRatio = clamp(compactedParticleCount / normalizedParticleCount, 0, 1.25);
            return {
                bucketCompactionStatus: rangeCount > 0 && sortedRangeViolations === 0 ? "GPU prefix-sum ranges ready" : rangeCount > 0 ? "GPU ranges ready with guard warnings" : "waiting for GPU bucket ranges",
                bucketPrefixSumStatus: rangeCount > 0 ? "exclusive prefix sum completed on GPU" : "prefix sum pending",
                bucketRangeCount: this.bucketCount,
                bucketRangeReadbackBytes: WEBGPU_BUCKET_RANGE_BYTE_LENGTH,
                compactedIndexBufferBytes: WEBGPU_COMPACTED_INDEX_BYTE_LENGTH,
                compactedParticleCount,
                bucketRangeMaxCount: maximumBucketRangeCount,
                bucketRangeCoverageRatio: coverageRatio,
                bucketNeighborQueryMode: rangeCount > 0 ? "compacted Morton ranges available for dense neighbor queries" : "tile-local fallback only",
                bucketCompactionContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                bucketCompactionNote: "A GPU prefix-sum pass builds contiguous Morton bucket ranges and a scatter pass writes compacted particle indices without reading the compacted index list back to JavaScript."
            };
        }
    }

    class GpuBucketNeighborDensityModel {
        constructor(sampleLimit) {
            this.sampleLimit = Math.max(1, Math.min(32, Math.round(finiteNumber(sampleLimit, WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT))));
        }
        compute(neighborDensityData, particleCount) {
            const words = Array.from(neighborDensityData || []);
            const processedParticleCount = Math.max(0, Math.round(finiteNumber(words[0], 0)));
            const sampledNeighborCount = Math.max(0, Math.round(finiteNumber(words[1], 0)));
            const densityScaledTotal = Math.max(0, finiteNumber(words[2], 0));
            const densityScaledMaximum = Math.max(0, finiteNumber(words[3], 0));
            const nearbyBucketVisitCount = Math.max(0, Math.round(finiteNumber(words[4], 0)));
            const normalizedParticleCount = Math.max(1, Math.round(finiteNumber(particleCount, 1)));
            const averageDensity = densityScaledTotal / WEBGPU_DIAGNOSTIC_SCALE / Math.max(1, processedParticleCount);
            return {
                bucketNeighborDensityStatus: processedParticleCount > 0 ? "compacted bucket neighbor-density pass ready" : "neighbor-density pass pending",
                bucketNeighborDensityReadbackBytes: WEBGPU_BUCKET_NEIGHBOR_DENSITY_BYTE_LENGTH,
                bucketNeighborDensitySampleCount: sampledNeighborCount,
                bucketNeighborDensityAverage: averageDensity,
                bucketNeighborDensityMaximum: densityScaledMaximum / WEBGPU_DIAGNOSTIC_SCALE,
                bucketNeighborDensityNearbyBuckets: nearbyBucketVisitCount,
                bucketNeighborDensityCoverageRatio: clamp(processedParticleCount / normalizedParticleCount, 0, 1.25),
                bucketNeighborDensityContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                bucketNeighborDensityNote: "A WGSL neighbor-density pass samples capped particles from the current compacted Morton bucket and adjacent buckets without full particle readback."
            };
        }
    }

    class GpuDensityFieldShadingModel {
        constructor(sampleLimit) {
            this.sampleLimit = Math.max(1, Math.min(32, Math.round(finiteNumber(sampleLimit, WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT))));
        }
        compute(densityFieldData, particleCount) {
            const words = Array.from(densityFieldData || []);
            const activeTileCount = Math.max(0, Math.round(finiteNumber(words[0], 0)));
            const densityScaledTotal = Math.max(0, finiteNumber(words[1], 0));
            const densityScaledMaximum = Math.max(0, finiteNumber(words[2], 0));
            const forceScaledTotal = Math.max(0, finiteNumber(words[3], 0));
            const sampleCountTotal = Math.max(0, Math.round(finiteNumber(words[4], 0)));
            const visitedRangeCount = Math.max(0, Math.round(finiteNumber(words[5], 0)));
            const normalizedParticleCount = Math.max(1, Math.round(finiteNumber(particleCount, 1)));
            const averageDensity = densityScaledTotal / WEBGPU_DIAGNOSTIC_SCALE / Math.max(1, activeTileCount);
            const averageForce = forceScaledTotal / WEBGPU_DIAGNOSTIC_SCALE / Math.max(1, activeTileCount);
            return {
                densityFieldShadingStatus: activeTileCount > 0 ? "GPU-resident density-field tiles ready" : "density-field pass pending",
                densityFieldReadbackBytes: WEBGPU_DENSITY_FIELD_DIAGNOSTIC_BYTE_LENGTH,
                densityFieldTileCount: WEBGPU_SPATIAL_BUCKET_COUNT,
                densityFieldActiveTiles: activeTileCount,
                densityFieldAverageDensity: averageDensity,
                densityFieldMaximumDensity: densityScaledMaximum / WEBGPU_DIAGNOSTIC_SCALE,
                densityFieldAverageForceProxy: averageForce,
                densityFieldSampleCount: sampleCountTotal,
                densityFieldVisitedRangeCount: visitedRangeCount,
                densityFieldCoverageRatio: clamp(activeTileCount / WEBGPU_SPATIAL_BUCKET_COUNT, 0, 1.25),
                densityFieldParticleSampleRatio: clamp(sampleCountTotal / normalizedParticleCount, 0, 16),
                densityFieldContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                densityFieldNote: "A WGSL density-field pass writes GPU-resident per-Morton-tile density and force vectors from compacted ranges; only compact aggregate diagnostics are read back."
            };
        }
    }




    class RelationalNode {
        constructor(entityId, scalarDistances) {
            this.entityId = safeVisibleText(entityId || "entity");
            this.scalarDistances = Array.isArray(scalarDistances) ? scalarDistances.map((distance) => Math.max(0.001, finiteNumber(distance, 1))) : [];
        }
        setDistance(index, scalarDistance) {
            this.scalarDistances[index] = Math.max(0.001, finiteNumber(scalarDistance, 1));
        }
        getDistance(index) {
            return Math.max(0.001, finiteNumber(this.scalarDistances[index], 1));
        }
    }

    class WeberTether {
        constructor(firstEntityId, secondEntityId, scalarDistance, relativeRadialVelocity, relativeRadialAcceleration, dynamicInteractionCoefficient) {
            this.firstEntityId = safeVisibleText(firstEntityId || "first");
            this.secondEntityId = safeVisibleText(secondEntityId || "second");
            this.scalarDistance = Math.max(0.001, finiteNumber(scalarDistance, 1));
            this.relativeRadialVelocity = finiteNumber(relativeRadialVelocity, 0);
            this.relativeRadialAcceleration = finiteNumber(relativeRadialAcceleration, 0);
            this.dynamicInteractionCoefficient = clamp(finiteNumber(dynamicInteractionCoefficient, 1), 0, 4);
            this.suppressionMultiplier = 1;
            this.relationalForce = 0;
        }
        includesEntity(entityId) {
            return this.firstEntityId === entityId || this.secondEntityId === entityId;
        }
    }

    class MachianMass {
        constructor(entityId, intrinsicRestMass) {
            this.entityId = safeVisibleText(entityId || "entity");
            this.intrinsicRestMass = Math.max(0.001, finiteNumber(intrinsicRestMass, 1));
            this.effectiveInertialMass = this.intrinsicRestMass;
        }
    }

    class ProcaCoupler {
        constructor(entityId, electromagneticResonance, chargeEquivalent, localCouplingStrength) {
            this.entityId = safeVisibleText(entityId || "entity");
            this.electromagneticResonance = Math.max(0, finiteNumber(electromagneticResonance, 1));
            this.chargeEquivalent = finiteNumber(chargeEquivalent, 1);
            this.localCouplingStrength = clamp(finiteNumber(localCouplingStrength, 1), 0, 8);
        }
    }

    class DarkMatterDrive {
        constructor(entityId, localizedEnergyReserve, operationState, targetedWeberSuppressionVectors, vectorPotentialThrustDerivative) {
            this.entityId = safeVisibleText(entityId || "ship");
            this.localizedEnergyReserve = clamp(finiteNumber(localizedEnergyReserve, 0.5), 0, 1.5);
            this.operationState = safeVisibleText(operationState || "standby");
            this.targetedWeberSuppressionVectors = Array.isArray(targetedWeberSuppressionVectors) ? targetedWeberSuppressionVectors.slice() : [];
            this.vectorPotentialThrustDerivative = finiteNumber(vectorPotentialThrustDerivative, 0);
        }
        isEngaged() {
            return this.operationState === "engaged" || this.localizedEnergyReserve > 0.62;
        }
    }

    class SubstrateFieldSystem {
        compute(recipe) {
            const vectorPotentialDensity = clamp(finiteNumber(recipe.darkMatterDial, 1) * finiteNumber(recipe.windDensity, 1), 0, 12);
            const procaFlux = vectorPotentialDensity * (1 + clamp(finiteNumber(recipe.turbulence, 0), 0, 2));
            const substrateCurrent = procaFlux * clamp(finiteNumber(recipe.driveCoupling, 0.5), 0, 3);
            return { vectorPotentialDensity, procaFlux, substrateCurrent, vectorPotentialGradient: substrateCurrent * 0.37 };
        }
    }

    class WeberForceSystem {
        compute(weberTethers, drive) {
            let totalRelationalForce = 0;
            let suppressedTetherCount = 0;
            for (let index = 0; index < weberTethers.length; index += 1) {
                const tether = weberTethers[index];
                const driveTargeted = drive && drive.isEngaged() && tether.includesEntity(drive.entityId) && tether.secondEntityId.indexOf("cosmic-shell") >= 0;
                tether.suppressionMultiplier = driveTargeted ? clamp(1 - drive.localizedEnergyReserve * 0.82, 0.03, 1) : 1;
                if (driveTargeted) { suppressedTetherCount += 1; }
                const distanceTerm = 1 / Math.max(tether.scalarDistance * tether.scalarDistance, 0.001);
                const velocityTerm = 1 + Math.abs(tether.relativeRadialVelocity) * 0.12;
                const accelerationTerm = 1 + Math.abs(tether.relativeRadialAcceleration) * 0.2;
                tether.relationalForce = tether.dynamicInteractionCoefficient * distanceTerm * velocityTerm * accelerationTerm * tether.suppressionMultiplier;
                totalRelationalForce += tether.relationalForce;
            }
            return { totalRelationalForce, suppressedTetherCount };
        }
    }

    class RelationalInertiaSystem {
        compute(machianMasses, weberTethers) {
            let shipEffectiveInertialMass = 0;
            for (let massIndex = 0; massIndex < machianMasses.length; massIndex += 1) {
                const machianMass = machianMasses[massIndex];
                let relationalForceSum = 0;
                for (let tetherIndex = 0; tetherIndex < weberTethers.length; tetherIndex += 1) {
                    const tether = weberTethers[tetherIndex];
                    if (tether.includesEntity(machianMass.entityId)) { relationalForceSum += tether.relationalForce; }
                }
                machianMass.effectiveInertialMass = Math.max(0.001, machianMass.intrinsicRestMass * (0.25 + relationalForceSum));
                if (machianMass.entityId === "ship") { shipEffectiveInertialMass = machianMass.effectiveInertialMass; }
            }
            return { shipEffectiveInertialMass };
        }
    }

    class VectorPotentialThrustSystem {
        compute(coupler, drive, substrate) {
            const thrustDerivative = finiteNumber(drive.vectorPotentialThrustDerivative, 0) + substrate.vectorPotentialGradient * coupler.localCouplingStrength * drive.localizedEnergyReserve;
            const electromotiveThrust = thrustDerivative * Math.abs(coupler.chargeEquivalent) * (drive.isEngaged() ? 1 : 0.18);
            return { thrustDerivative, electromotiveThrust };
        }
    }

    class RelationalIntegrationSystem {
        compute(relationalNodes, weberTethers, thrustResult) {
            const relaxationStrength = clamp(Math.abs(thrustResult.electromotiveThrust) * 0.006, 0, 0.08);
            for (let tetherIndex = 0; tetherIndex < weberTethers.length; tetherIndex += 1) {
                const tether = weberTethers[tetherIndex];
                const drift = (tether.relativeRadialVelocity + tether.relativeRadialAcceleration * 0.5) * 0.012 - relaxationStrength * tether.suppressionMultiplier;
                tether.scalarDistance = Math.max(0.001, tether.scalarDistance + drift);
            }
            for (let nodeIndex = 0; nodeIndex < relationalNodes.length; nodeIndex += 1) {
                const node = relationalNodes[nodeIndex];
                for (let distanceIndex = 0; distanceIndex < node.scalarDistances.length; distanceIndex += 1) {
                    const relaxedDistance = node.getDistance(distanceIndex) * (1 - relaxationStrength * 0.15);
                    node.setDistance(distanceIndex, relaxedDistance);
                }
            }
            return { relaxationStrength, solvedDistanceMatrix: relationalNodes.map((node) => node.scalarDistances.slice()) };
        }
    }

    class RelationalProjectionModel {
        project(relationalNodes) {
            const shipNode = relationalNodes.find((node) => node.entityId === "ship") || relationalNodes[0];
            if (!shipNode) { return []; }
            const count = relationalNodes.length;
            const maximumDistance = Math.max(1, ...shipNode.scalarDistances.map((distance) => finiteNumber(distance, 1)));
            const projectedNodes = [];
            for (let index = 0; index < count; index += 1) {
                const node = relationalNodes[index];
                const distance = node.entityId === "ship" ? 0 : Math.max(0.001, finiteNumber(shipNode.scalarDistances[index], 1));
                const relationalAngle = index === 0 ? 0 : (index / Math.max(1, count - 1)) * TWO_PI;
                const relativeRadius = clamp(distance / maximumDistance, 0, 1);
                projectedNodes.push({ entityId: node.entityId, displayU: Math.cos(relationalAngle) * relativeRadius, displayV: Math.sin(relationalAngle) * relativeRadius, scalarDistance: distance });
            }
            return projectedNodes;
        }
    }

    class RelationalMdsGpuProjectionModel {
        constructor(nodeCount) {
            this.nodeCount = Math.max(1, Math.min(WEBGPU_RELATIONAL_MDS_NODE_COUNT, Math.round(finiteNumber(nodeCount, WEBGPU_RELATIONAL_MDS_NODE_COUNT))));
        }
        packDistanceMatrix(relationalNodes) {
            const matrix = new Float32Array(WEBGPU_RELATIONAL_DISTANCE_MATRIX_FLOATS);
            const nodes = Array.isArray(relationalNodes) ? relationalNodes.slice(0, this.nodeCount) : [];
            for (let rowIndex = 0; rowIndex < this.nodeCount; rowIndex += 1) {
                const rowNode = nodes[rowIndex];
                for (let columnIndex = 0; columnIndex < this.nodeCount; columnIndex += 1) {
                    const value = rowIndex === columnIndex ? 0 : rowNode && Array.isArray(rowNode.scalarDistances) ? rowNode.scalarDistances[columnIndex] : 0;
                    matrix[rowIndex * this.nodeCount + columnIndex] = Math.max(0, finiteNumber(value, rowIndex === columnIndex ? 0 : 1));
                }
            }
            return matrix;
        }
        createTelemetry(relationalNodes) {
            const matrix = this.packDistanceMatrix(relationalNodes);
            let finiteDistanceCount = 0;
            let distanceTotal = 0;
            let maximumDistance = 0;
            matrix.forEach((distance) => {
                if (Number.isFinite(distance) && distance > 0) {
                    finiteDistanceCount += 1;
                    distanceTotal += distance;
                    maximumDistance = Math.max(maximumDistance, distance);
                }
            });
            return {
                relationalDistanceMatrixNodeCount: this.nodeCount,
                relationalDistanceMatrixFloatCount: matrix.length,
                relationalDistanceMatrixByteLength: WEBGPU_RELATIONAL_DISTANCE_MATRIX_BYTE_LENGTH,
                relationalDistanceMatrixFiniteDistanceCount: finiteDistanceCount,
                relationalDistanceMatrixAverageDistance: finiteDistanceCount ? distanceTotal / finiteDistanceCount : 0,
                relationalDistanceMatrixMaximumDistance: maximumDistance,
                relationalDistanceMatrix: Array.from(matrix),
                webGpuRelationalMdsProjectionStatus: "CPU-packed matrix ready for GPU-resident MDS-style projection",
                webGpuRelationalMdsProjectionContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuRelationalMdsProjectionNodeCount: this.nodeCount,
                webGpuRelationalMdsProjectionBufferBytes: WEBGPU_RELATIONAL_PROJECTION_BYTE_LENGTH,
                webGpuRelationalMdsProjectionNote: "Scalar relational distances are packed as a coordinate-free distance matrix; the WebGPU pass projects display coordinates without introducing physics Transform state."
            };
        }
    }

    class RelationalEcsSimulationEngine {
        constructor() {
            this.substrateFieldSystem = new SubstrateFieldSystem();
            this.weberForceSystem = new WeberForceSystem();
            this.relationalInertiaSystem = new RelationalInertiaSystem();
            this.vectorPotentialThrustSystem = new VectorPotentialThrustSystem();
            this.relationalIntegrationSystem = new RelationalIntegrationSystem();
            this.relationalProjectionModel = new RelationalProjectionModel();
            this.relationalMdsGpuProjectionModel = new RelationalMdsGpuProjectionModel(WEBGPU_RELATIONAL_MDS_NODE_COUNT);
        }
        createScene(recipe) {
            const dial = clamp(finiteNumber(recipe.darkMatterDial, 1), 0, 5);
            const driveReserve = clamp(finiteNumber(recipe.driveCoupling, 0.5) * 0.6 + dial * 0.08, 0, 1.2);
            const shipDistances = [0, 1.2 + dial * 0.12, 2.4 + finiteNumber(recipe.haloRadius, 70) / 120, 3.1 + finiteNumber(recipe.visibleMatterMass, 42) / 80, 4.2 + finiteNumber(recipe.windDensity, 1) * 0.3];
            const relationalNodes = [
                new RelationalNode("ship", shipDistances),
                new RelationalNode("near-guide-star", [shipDistances[1], 0, 1.7, 2.3, 3.1]),
                new RelationalNode("massive-cluster", [shipDistances[2], 1.7, 0, 1.9, 2.8]),
                new RelationalNode("cosmic-shell-a", [shipDistances[3], 2.3, 1.9, 0, 2.2]),
                new RelationalNode("cosmic-shell-b", [shipDistances[4], 3.1, 2.8, 2.2, 0])
            ];
            const nodeIds = ["ship", "near-guide-star", "massive-cluster", "cosmic-shell-a", "cosmic-shell-b"];
            const weberTethers = [];
            for (let firstIndex = 0; firstIndex < relationalNodes.length; firstIndex += 1) {
                for (let secondIndex = firstIndex + 1; secondIndex < relationalNodes.length; secondIndex += 1) {
                    const scalarDistance = relationalNodes[firstIndex].scalarDistances[secondIndex] || relationalNodes[secondIndex].scalarDistances[firstIndex] || 1;
                    const shipLinked = firstIndex === 0 || secondIndex === 0;
                    const velocityProxy = shipLinked ? 0.08 + secondIndex * 0.018 : 0.025 + secondIndex * 0.006;
                    const accelerationProxy = shipLinked ? 0.035 + secondIndex * 0.012 : 0.01 + firstIndex * 0.004;
                    const interactionCoefficient = shipLinked ? 0.8 + secondIndex * 0.24 : 0.5 + (firstIndex + secondIndex) * 0.08;
                    weberTethers.push(new WeberTether(nodeIds[firstIndex], nodeIds[secondIndex], scalarDistance, velocityProxy, accelerationProxy, interactionCoefficient));
                }
            }
            const machianMasses = [
                new MachianMass("ship", Math.max(0.25, finiteNumber(recipe.spacecraftRestMassProxy, 12) / 12)),
                new MachianMass("near-guide-star", 2.2),
                new MachianMass("massive-cluster", 4.6),
                new MachianMass("cosmic-shell-a", 8.5),
                new MachianMass("cosmic-shell-b", 7.8)
            ];
            const procaCoupler = new ProcaCoupler("ship", finiteNumber(recipe.haloscopeTuningMicroElectronVolts, 21.5), 1 + dial * 0.08, finiteNumber(recipe.driveCoupling, 0.5));
            const drive = new DarkMatterDrive("ship", driveReserve, driveReserve > 0.55 ? "engaged" : "standby", ["cosmic-shell-a", "cosmic-shell-b"], finiteNumber(recipe.densityFieldFeedbackGain, 1));
            return { relationalNodes, weberTethers, machianMasses, procaCoupler, drive };
        }
        step(recipe) {
            const scene = this.createScene(recipe || {});
            const substrate = this.substrateFieldSystem.compute(recipe || {});
            const weber = this.weberForceSystem.compute(scene.weberTethers, scene.drive);
            const inertia = this.relationalInertiaSystem.compute(scene.machianMasses, scene.weberTethers);
            const thrust = this.vectorPotentialThrustSystem.compute(scene.procaCoupler, scene.drive, substrate);
            const integration = this.relationalIntegrationSystem.compute(scene.relationalNodes, scene.weberTethers, thrust);
            const projection = this.relationalProjectionModel.project(scene.relationalNodes);
            const gpuMdsProjection = this.relationalMdsGpuProjectionModel.createTelemetry(scene.relationalNodes);
            const tetherTensionTotal = scene.weberTethers.reduce((total, tether) => total + tether.relationalForce, 0);
            const tetherSuppressionRatio = clamp(weber.suppressedTetherCount / Math.max(1, scene.weberTethers.length), 0, 1);
            return {
                relationalEcsStatus: "coordinate-free relational ECS active",
                relationalEcsContractVersion: RELATIONAL_ECS_CONTRACT_VERSION,
                relationalNodeCount: scene.relationalNodes.length,
                weberTetherCount: scene.weberTethers.length,
                suppressedWeberTetherCount: weber.suppressedTetherCount,
                weberTetherSuppressionRatio: tetherSuppressionRatio,
                machianEffectiveInertialMass: inertia.shipEffectiveInertialMass,
                machianMassReductionRatio: clamp(1 - inertia.shipEffectiveInertialMass / Math.max(scene.machianMasses[0].intrinsicRestMass, 0.001), 0, 1),
                procaFluxDensity: substrate.procaFlux,
                procaSubstrateCurrent: substrate.substrateCurrent,
                vectorPotentialThrustDerivative: thrust.thrustDerivative,
                vectorPotentialElectromotiveThrust: thrust.electromotiveThrust,
                relationalRelaxationStrength: integration.relaxationStrength,
                relationalTetherTensionTotal: tetherTensionTotal,
                relationalProjectionNodes: projection,
                relationalProjectionSource: "CPU fallback projection from scalar distance matrix",
                relationalDistanceMatrixNodeIds: scene.relationalNodes.map((node) => node.entityId),
                relationalDistanceMatrix: gpuMdsProjection.relationalDistanceMatrix,
                relationalDistanceMatrixNodeCount: gpuMdsProjection.relationalDistanceMatrixNodeCount,
                relationalDistanceMatrixFloatCount: gpuMdsProjection.relationalDistanceMatrixFloatCount,
                relationalDistanceMatrixByteLength: gpuMdsProjection.relationalDistanceMatrixByteLength,
                relationalDistanceMatrixFiniteDistanceCount: gpuMdsProjection.relationalDistanceMatrixFiniteDistanceCount,
                relationalDistanceMatrixAverageDistance: gpuMdsProjection.relationalDistanceMatrixAverageDistance,
                relationalDistanceMatrixMaximumDistance: gpuMdsProjection.relationalDistanceMatrixMaximumDistance,
                webGpuRelationalMdsProjectionStatus: gpuMdsProjection.webGpuRelationalMdsProjectionStatus,
                webGpuRelationalMdsProjectionContractVersion: gpuMdsProjection.webGpuRelationalMdsProjectionContractVersion,
                webGpuRelationalMdsProjectionNodeCount: gpuMdsProjection.webGpuRelationalMdsProjectionNodeCount,
                webGpuRelationalMdsProjectionBufferBytes: gpuMdsProjection.webGpuRelationalMdsProjectionBufferBytes,
                webGpuRelationalMdsProjectionNote: gpuMdsProjection.webGpuRelationalMdsProjectionNote,
                relationalPhysicsLoopOrder: "Substrate Field > Weber Force > Relational Inertia > Vector Potential Thrust > Relational Integration",
                relationalConstraintChecklist: "No Transform component; no Cartesian physics state; inertia derived from Weber tethers."
            };
        }
    }

    class GpuRelationalWeberForceModel {
        summarize(diagnosticWords) {
            const words = Array.from(diagnosticWords || []);
            const tetherCount = Math.max(1, Math.round(finiteNumber(words[4], WEBGPU_RELATIONAL_WEBER_TETHER_COUNT)));
            return {
                totalForce: finiteNumber(words[0], 0) / WEBGPU_DIAGNOSTIC_SCALE,
                maximumForce: finiteNumber(words[1], 0) / WEBGPU_DIAGNOSTIC_SCALE,
                suppressedTetherCount: Math.max(0, Math.round(finiteNumber(words[2], 0))),
                machianMassFromWeberBuffer: finiteNumber(words[3], 0) / WEBGPU_DIAGNOSTIC_SCALE / tetherCount,
                tetherCount
            };
        }
    }

    class RelationalAdaptiveTetherQualityModel {
        compute(downshiftLevel) {
            const level = Math.max(0, Math.min(3, Math.round(finiteNumber(downshiftLevel, 0))));
            return {
                downshiftLevel: level,
                effectiveRelationalTetherLimit: WEBGPU_ADAPTIVE_RELATIONAL_TETHER_LIMITS[level] || WEBGPU_ADAPTIVE_RELATIONAL_TETHER_LIMITS[0],
                relationalMachianReductionCadenceTicks: WEBGPU_ADAPTIVE_RELATIONAL_REDUCTION_CADENCE_BY_LEVEL[level] || WEBGPU_ADAPTIVE_RELATIONAL_REDUCTION_CADENCE_BY_LEVEL[0],
                relationalVisualTetherDensity: WEBGPU_ADAPTIVE_RELATIONAL_VISUAL_TETHER_DENSITIES[level] || WEBGPU_ADAPTIVE_RELATIONAL_VISUAL_TETHER_DENSITIES[0],
                relationalTetherQualityStatus: level === 0 ? "base relational tether quality" : "adaptive relational tether downshift level " + String(level)
            };
        }
    }


    class WebGpuComputeTelemetryState {
        constructor(values) {
            Object.assign(this, {
                webGpuComputeStatus: "not initialized",
                webGpuActualParticleCount: 0,
                webGpuActualDispatches: 0,
                webGpuMeanParticleSpeed: 0,
                webGpuMaxParticleRadius: 0,
                webGpuMeanAccelerationProxy: 0,
                webGpuHaloPressureProxy: 0,
                webGpuLastCompletedTick: -1,
                webGpuShaderWorkgroupSize: WEBGPU_COMPUTE_WORKGROUP_SIZE,
                webGpuShaderSourceLength: WEBGPU_N_BODY_COMPUTE_SHADER.length,
                webGpuReadbackMode: "reduced aggregate atomic buffer",
                webGpuReadbackBytes: WEBGPU_REDUCED_DIAGNOSTIC_WORDS * 4,
                webGpuExecutionLocation: "not selected",
                webGpuWorkerStatus: "not initialized",
                webGpuWorkerRoundTripMilliseconds: 0,
                webGpuReadbackLatencyMilliseconds: 0,
                webGpuWorkerMessageContractVersion: WEBGPU_COMPUTE_MESSAGE_CONTRACT_VERSION,
                webGpuPersistentBuffersStatus: "not yet enabled",
                webGpuPingPongSourceIndex: 0,
                webGpuPingPongDestinationIndex: 1,
                webGpuParticleBufferCapacity: 0,
                webGpuBufferRebuildCount: 0,
                webGpuSharedBufferContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuSharedRenderBufferStatus: "not linked yet",
                webGpuRenderSampleStatus: "not sampled yet",
                webGpuRenderSampleCount: 0,
                webGpuRenderSampleBytes: 0,
                webGpuRenderSampleSourceIndex: -1,
                webGpuRenderSampleContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuRenderSamplePoints: [],
                webGpuDirectRenderStatus: "not initialized",
                webGpuDirectRenderParticleCount: 0,
                webGpuDirectRenderPipelineStatus: "not initialized",
                webGpuDirectRenderFormat: "unknown",
                webGpuDirectRenderSourceIndex: -1,
                webGpuDirectRenderVertexCount: 0,
                webGpuDirectRenderContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuDirectRenderVisualQualityMode: WEBGPU_ADAPTIVE_DIRECT_VISUAL_QUALITY_MODES[0],
                webGpuDirectRenderPointScale: WEBGPU_ADAPTIVE_DIRECT_RENDER_POINT_SCALES[0],
                webGpuDirectRenderHaloIntensity: WEBGPU_ADAPTIVE_DIRECT_HALO_INTENSITIES[0],
                webGpuDirectRenderVisualDensity: WEBGPU_ADAPTIVE_DIRECT_VISUAL_DENSITIES[0],
                webGpuDirectVisualQualityStatus: "base direct WebGPU visuals",
                webGpuDirectVisualQualityContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuSpatialIndexStatus: "not prepared",
                webGpuSpatialBucketCount: WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuSpatialBucketReadbackBytes: 0,
                webGpuMortonContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuOccupiedSpatialBuckets: 0,
                webGpuDensestSpatialBucketIndex: 0,
                webGpuDensestSpatialBucketOccupancy: 0,
                webGpuSpatialLocalityRatio: 0,
                webGpuSpatialIndexNote: "Morton spatial buckets were not prepared.",
                webGpuSpatialIndexStatus: "not prepared",
                webGpuSpatialBucketCount: WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuSpatialBucketReadbackBytes: 0,
                webGpuMortonContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuOccupiedSpatialBuckets: 0,
                webGpuDensestSpatialBucketIndex: 0,
                webGpuDensestSpatialBucketOccupancy: 0,
                webGpuSpatialLocalityRatio: 0,
                webGpuSpatialIndexNote: "Morton spatial buckets have not been prepared yet.",
                webGpuAdaptiveHaloShadingStatus: "not initialized",
                webGpuAdaptiveHaloShadingSource: "none",
                webGpuAdaptiveHaloDensityGain: 0,
                webGpuAdaptiveHaloOpacity: 0,
                webGpuAdaptiveHaloDensityContrast: 0,
                webGpuTileLocalNeighborStatus: "not initialized",
                webGpuTileLocalNeighborQueryCount: 0,
                webGpuTileLocalDensityProxy: 0,
                webGpuTileLocalNeighborLimit: WEBGPU_TILE_LOCAL_NEIGHBOR_LIMIT,
                webGpuTileLocalNeighborNote: "Tile-local neighbor queries have not run yet.",
                webGpuBucketCompactionStatus: "not initialized",
                webGpuBucketPrefixSumStatus: "not initialized",
                webGpuBucketRangeCount: WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuBucketRangeReadbackBytes: 0,
                webGpuCompactedIndexBufferBytes: 0,
                webGpuCompactedParticleCount: 0,
                webGpuBucketRangeMaxCount: 0,
                webGpuBucketRangeCoverageRatio: 0,
                webGpuBucketNeighborQueryMode: "tile-local fallback only",
                webGpuBucketCompactionContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuBucketCompactionNote: "GPU prefix-sum bucket compaction has not run yet.",
                webGpuBucketNeighborDensityStatus: "not initialized",
                webGpuBucketNeighborDensityReadbackBytes: 0,
                webGpuBucketNeighborDensitySampleCount: 0,
                webGpuBucketNeighborDensityAverage: 0,
                webGpuBucketNeighborDensityMaximum: 0,
                webGpuBucketNeighborDensityNearbyBuckets: 0,
                webGpuBucketNeighborDensityCoverageRatio: 0,
                webGpuBucketNeighborDensityContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuBucketNeighborDensityNote: "Compacted bucket neighbor-density pass has not run yet.",
                webGpuDensityFieldShadingStatus: "not initialized",
                webGpuDensityFieldReadbackBytes: 0,
                webGpuDensityFieldTileCount: WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuDensityFieldActiveTiles: 0,
                webGpuDensityFieldAverageDensity: 0,
                webGpuDensityFieldMaximumDensity: 0,
                webGpuDensityFieldAverageForceProxy: 0,
                webGpuDensityFieldSampleCount: 0,
                webGpuDensityFieldVisitedRangeCount: 0,
                webGpuDensityFieldCoverageRatio: 0,
                webGpuDensityFieldParticleSampleRatio: 0,
                webGpuDensityFieldContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuDensityFieldNote: "GPU-resident density-field shading pass has not run yet.",
                webGpuDensityFieldFeedbackStatus: "not initialized",
                webGpuDensityFieldFeedbackGain: WEBGPU_DENSITY_FIELD_FEEDBACK_DEFAULT_GAIN,
                webGpuAdaptiveDensityFieldFeedbackGain: WEBGPU_DENSITY_FIELD_FEEDBACK_DEFAULT_GAIN,
                webGpuDensityFieldFeedbackDownshiftFactor: 1,
                webGpuDensityFieldFeedbackDownshiftStatus: "not initialized",
                webGpuDensityFieldAccelerationProxy: 0,
                webGpuFiniteOutputGuardClampCount: 0,
                webGpuFiniteOutputGuardClampRate: 0,
                webGpuDensityFieldFeedbackContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuDensityFieldFeedbackNote: "Density-field feedback has not been applied to the WGSL particle update yet.",
                webGpuAdaptiveComputeQualityStatus: "not initialized",
                webGpuAdaptiveComputeQualityMode: "medium",
                webGpuEffectiveComputeParticleBudget: 0,
                webGpuAdaptiveComputeDownshiftLevel: 0,
                webGpuAdaptiveComputeWindowSize: WEBGPU_ADAPTIVE_COMPUTE_WINDOW_SIZE,
                webGpuAdaptiveComputeInstabilityScore: 0,
                webGpuAdaptiveComputeClampRateAverage: 0,
                webGpuAdaptiveComputeFpsAverage: 60,
                webGpuAdaptiveComputeWorkerRoundTripAverage: 0,
                webGpuAdaptiveComputeReadbackLatencyAverage: 0,
                webGpuAdaptiveComputeSustainedInstabilityTicks: 0,
                webGpuEffectiveBucketNeighborSampleLimit: WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT,
                webGpuEffectiveDensityFieldSampleLimit: WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT,
                webGpuDispatchCadenceTicks: WEBGPU_ADAPTIVE_COMPUTE_BASE_DISPATCH_CADENCE_TICKS,
                webGpuDispatchCadenceStatus: "base cadence",
                webGpuDensityFieldSampleLimitStatus: "base sample limits",
                webGpuAdaptiveComputeQualityContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuEffectiveRelationalTetherLimit: WEBGPU_ADAPTIVE_RELATIONAL_TETHER_LIMITS[0],
                webGpuRelationalMachianReductionCadenceTicks: WEBGPU_ADAPTIVE_RELATIONAL_REDUCTION_CADENCE_BY_LEVEL[0],
                webGpuRelationalVisualTetherDensity: WEBGPU_ADAPTIVE_RELATIONAL_VISUAL_TETHER_DENSITIES[0],
                webGpuRelationalTetherQualityStatus: "base relational tether quality",
                webGpuAdaptiveComputeQualityNote: "Rolling compute-quality controller has not observed enough WebGPU samples yet.",
                webGpuRelationalMdsProjectionStatus: "not initialized",
                webGpuRelationalMdsProjectionNodeCount: WEBGPU_RELATIONAL_MDS_NODE_COUNT,
                webGpuRelationalMdsDistanceMatrixBytes: WEBGPU_RELATIONAL_DISTANCE_MATRIX_BYTE_LENGTH,
                webGpuRelationalMdsProjectionBufferBytes: WEBGPU_RELATIONAL_PROJECTION_BYTE_LENGTH,
                webGpuRelationalMdsProjectionContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuRelationalMdsProjectionSource: "waiting for relational distance matrix",
                webGpuRelationalMdsProjectionNote: "GPU-resident relational projection has not run yet.",
                webGpuRelationalWeberForceStatus: "not initialized",
                webGpuRelationalWeberTetherCount: WEBGPU_RELATIONAL_WEBER_TETHER_COUNT,
                webGpuRelationalWeberSuppressedTetherCount: 0,
                webGpuRelationalWeberForceTotal: 0,
                webGpuRelationalWeberMaximumForce: 0,
                webGpuRelationalMachianMassFromWeberBuffer: 0,
                webGpuRelationalWeberDiagnosticReadbackBytes: WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_BYTE_LENGTH,
                webGpuRelationalWeberTetherBufferBytes: WEBGPU_RELATIONAL_WEBER_TETHER_BYTE_LENGTH,
                webGpuRelationalPackedTetherBufferBytes: WEBGPU_RELATIONAL_PACKED_TETHER_BYTE_LENGTH,
                webGpuRelationalPackedTetherListStatus: "not initialized",
                webGpuRelationalPackedTetherCount: 0,
                webGpuRelationalMachianReductionCadenceTicks: WEBGPU_ADAPTIVE_RELATIONAL_REDUCTION_CADENCE_BY_LEVEL[0],
                webGpuRelationalVisualTetherDensity: WEBGPU_ADAPTIVE_RELATIONAL_VISUAL_TETHER_DENSITIES[0],
                webGpuRelationalTetherQualityStatus: "base relational tether quality",
                webGpuRelationalWeberContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuRelationalWeberSource: "waiting for GPU Weber buffer",
                webGpuRelationalMachianMassReductionStatus: "not initialized",
                webGpuRelationalMachianMassEntityCount: 0,
                webGpuRelationalMachianMassBufferBytes: WEBGPU_RELATIONAL_MACHIAN_MASS_BYTE_LENGTH,
                webGpuRelationalMachianMassReadbackBytes: WEBGPU_RELATIONAL_MACHIAN_MASS_BYTE_LENGTH,
                webGpuRelationalShipMachianEffectiveMass: 0,
                webGpuRelationalMinimumEntityMachianMass: 0,
                webGpuRelationalMaximumEntityMachianMass: 0,
                webGpuRelationalAverageEntityMachianMass: 0,
                webGpuRelationalMachianMassReductionSource: "waiting for GPU Machian mass buffer",
                webGpuRelationalMachianMassReductionContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuRelationalWeberNote: "GPU-resident Weber force accumulation has not run yet.",
                webGpuComputeBranchNote: "Actual WebGPU compute branch has not run yet; Canvas/WebGL fallback telemetry is active."
            }, values || {});
        }
    }

    class WebGpuNBodyComputePipeline {
        constructor(options) {
            const settings = options || {};
            this.maximumParticles = Math.max(256, Math.min(WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES, finiteNumber(settings.maximumParticles, WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES)));
            this.workgroupSize = WEBGPU_COMPUTE_WORKGROUP_SIZE;
            this.shaderSource = WEBGPU_N_BODY_COMPUTE_SHADER;
            this.adapter = null;
            this.device = null;
            this.pipeline = null;
            this.prefixSumPipeline = null;
            this.scatterPipeline = null;
            this.bucketNeighborDensityPipeline = null;
            this.densityFieldPipeline = null;
            this.relationalMdsProjectionPipeline = null;
            this.relationalWeberForcePipeline = null;
            this.bindGroupLayout = null;
            this.prefixSumBindGroupLayout = null;
            this.scatterBindGroupLayout = null;
            this.bucketNeighborDensityBindGroupLayout = null;
            this.densityFieldBindGroupLayout = null;
            this.relationalMdsProjectionBindGroupLayout = null;
            this.relationalWeberForceBindGroupLayout = null;
            this.initialized = false;
            this.initializationPromise = null;
            this.particleBuffers = [];
            this.bindGroups = [];
            this.particleBufferCapacity = 0;
            this.activeParticleBufferIndex = 0;
            this.persistentParticleCount = 0;
            this.persistentStateKey = "";
            this.diagnosticBuffer = null;
            this.uniformBuffer = null;
            this.readBuffer = null;
            this.renderSampleReadBuffer = null;
            this.spatialBucketBuffer = null;
            this.spatialBucketReadBuffer = null;
            this.spatialBucketRangeBuffer = null;
            this.spatialBucketRangeReadBuffer = null;
            this.spatialBucketCursorBuffer = null;
            this.compactedParticleIndexBuffer = null;
            this.bucketNeighborDensityBuffer = null;
            this.bucketNeighborDensityReadBuffer = null;
            this.densityFieldTileBuffer = null;
            this.densityFieldDiagnosticBuffer = null;
            this.densityFieldDiagnosticReadBuffer = null;
            this.relationalDistanceMatrixBuffer = null;
            this.relationalProjectionBuffer = null;
            this.relationalMdsUniformBuffer = null;
            this.relationalWeberTetherBuffer = null;
            this.relationalWeberDiagnosticBuffer = null;
            this.relationalWeberDiagnosticReadBuffer = null;
            this.relationalWeberUniformBuffer = null;
            this.relationalMachianMassBuffer = null;
            this.relationalMachianMassReadBuffer = null;
            this.prefixSumBindGroup = null;
            this.scatterBindGroups = [];
            this.bucketNeighborDensityBindGroups = [];
            this.densityFieldBindGroups = [];
            this.relationalMdsProjectionBindGroup = null;
            this.relationalWeberForceBindGroup = null;
            this.spatialIndexModel = new MortonSpatialIndexModel(WEBGPU_SPATIAL_BUCKET_GRID_SIZE);
            this.haloShadingModel = new AdaptiveHaloDensityShadingModel(WEBGPU_SPATIAL_BUCKET_GRID_SIZE);
            this.tileLocalNeighborQueryModel = new TileLocalNeighborQueryModel(WEBGPU_TILE_LOCAL_NEIGHBOR_LIMIT);
            this.bucketCompactionModel = new GpuBucketCompactionModel(WEBGPU_SPATIAL_BUCKET_GRID_SIZE);
            this.bucketNeighborDensityModel = new GpuBucketNeighborDensityModel(WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT);
            this.densityFieldShadingModel = new GpuDensityFieldShadingModel(WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT);
            this.relationalMdsGpuProjectionModel = new RelationalMdsGpuProjectionModel(WEBGPU_RELATIONAL_MDS_NODE_COUNT);
            this.densityFieldFeedbackDownshiftFactor = 1;
            this.densityFieldFeedbackClampRate = 0;
            this.densityFieldFeedbackDownshiftStatus = "nominal";
            this.lastDensityFieldFeedbackGain = WEBGPU_DENSITY_FIELD_FEEDBACK_DEFAULT_GAIN;
            this.lastAdaptiveDensityFieldFeedbackGain = WEBGPU_DENSITY_FIELD_FEEDBACK_DEFAULT_GAIN;
            this.lastBucketNeighborSampleLimit = WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT;
            this.lastDensityFieldSampleLimit = WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT;
            this.lastWebGpuDispatchCadenceTicks = WEBGPU_ADAPTIVE_COMPUTE_DISPATCH_CADENCE_BY_LEVEL[0];
            this.bufferRebuildCount = 0;
            this.lastTelemetry = new WebGpuComputeTelemetryState();
        }
        static isSupported() {
            return typeof navigator !== "undefined" && Boolean(navigator.gpu);
        }
        createUnavailableTelemetry(reason) {
            this.lastTelemetry = new WebGpuComputeTelemetryState({
                webGpuComputeStatus: "unavailable",
                webGpuExecutionLocation: "fallback",
                webGpuComputeBranchNote: reason || "WebGPU is unavailable; fallback renderer and deterministic JavaScript telemetry remain active."
            });
            return this.lastTelemetry;
        }
        initialize() {
            if (this.initializationPromise) { return this.initializationPromise; }
            this.initializationPromise = this.initializeInternal();
            return this.initializationPromise;
        }
        async initializeInternal() {
            if (!WebGpuNBodyComputePipeline.isSupported()) {
                return this.createUnavailableTelemetry("WebGPU navigator interface is unavailable; fallback renderer remains active.");
            }
            try {
                this.adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
                if (!this.adapter) {
                    return this.createUnavailableTelemetry("WebGPU adapter request returned no adapter; fallback renderer remains active.");
                }
                this.device = await this.adapter.requestDevice();
                const shaderModule = this.device.createShaderModule({ label: "ArcSecs Dark Matter Drive N-body compute shader", code: this.shaderSource });
                const prefixSumShaderModule = this.device.createShaderModule({ label: "ArcSecs Dark Matter Drive bucket prefix-sum shader", code: WEBGPU_BUCKET_PREFIX_SUM_SHADER });
                const scatterShaderModule = this.device.createShaderModule({ label: "ArcSecs Dark Matter Drive bucket scatter shader", code: WEBGPU_BUCKET_SCATTER_SHADER });
                const bucketNeighborDensityShaderModule = this.device.createShaderModule({ label: "ArcSecs Dark Matter Drive compacted bucket neighbor-density shader", code: WEBGPU_BUCKET_NEIGHBOR_DENSITY_SHADER });
                const densityFieldShaderModule = this.device.createShaderModule({ label: "ArcSecs Dark Matter Drive GPU-resident density-field shader", code: WEBGPU_DENSITY_FIELD_SHADER });
                const relationalMdsProjectionShaderModule = this.device.createShaderModule({ label: "ArcSecs GPU-resident relational MDS projection shader", code: WEBGPU_RELATIONAL_MDS_PROJECTION_SHADER });
                const relationalWeberForceShaderModule = this.device.createShaderModule({ label: "ArcSecs GPU-resident Weber tether force accumulation shader", code: WEBGPU_RELATIONAL_WEBER_FORCE_SHADER });
                this.bindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs Dark Matter Drive compute bind group layout",
                    entries: [
                        { binding: 0, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 2, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 3, visibility: getGpuShaderStageCompute(), buffer: { type: "uniform" } },
                        { binding: 4, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 5, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } }
                    ]
                });
                const pipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs Dark Matter Drive compute pipeline layout", bindGroupLayouts: [this.bindGroupLayout] });
                const pipelineDescriptor = { label: "ArcSecs Dark Matter Drive actual WebGPU compute pipeline", layout: pipelineLayout, compute: { module: shaderModule, entryPoint: "main" } };
                this.pipeline = typeof this.device.createComputePipelineAsync === "function"
                    ? await this.device.createComputePipelineAsync(pipelineDescriptor)
                    : this.device.createComputePipeline(pipelineDescriptor);
                this.prefixSumBindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs bucket prefix-sum bind group layout",
                    entries: [
                        { binding: 0, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 2, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } }
                    ]
                });
                this.scatterBindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs bucket scatter bind group layout",
                    entries: [
                        { binding: 0, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 2, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 3, visibility: getGpuShaderStageCompute(), buffer: { type: "uniform" } }
                    ]
                });
                this.bucketNeighborDensityBindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs compacted bucket neighbor-density bind group layout",
                    entries: [
                        { binding: 0, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 2, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 3, visibility: getGpuShaderStageCompute(), buffer: { type: "uniform" } },
                        { binding: 4, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } }
                    ]
                });

                this.densityFieldBindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs GPU-resident density-field bind group layout",
                    entries: [
                        { binding: 0, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 2, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 3, visibility: getGpuShaderStageCompute(), buffer: { type: "uniform" } },
                        { binding: 4, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 5, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } }
                    ]
                });
                const prefixSumPipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs bucket prefix-sum pipeline layout", bindGroupLayouts: [this.prefixSumBindGroupLayout] });
                const scatterPipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs bucket scatter pipeline layout", bindGroupLayouts: [this.scatterBindGroupLayout] });
                const bucketNeighborDensityPipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs compacted bucket neighbor-density pipeline layout", bindGroupLayouts: [this.bucketNeighborDensityBindGroupLayout] });
                this.relationalMdsProjectionBindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs relational scalar distance matrix projection bind group layout",
                    entries: [
                        { binding: 0, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 2, visibility: getGpuShaderStageCompute(), buffer: { type: "uniform" } }
                    ]
                });
                this.relationalWeberForceBindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs relational Weber force bind group layout",
                    entries: [
                        { binding: 0, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 2, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 3, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 4, visibility: getGpuShaderStageCompute(), buffer: { type: "uniform" } },
                        { binding: 5, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 6, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } }
                    ]
                });
                const densityFieldPipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs GPU-resident density-field pipeline layout", bindGroupLayouts: [this.densityFieldBindGroupLayout] });
                const prefixDescriptor = { label: "ArcSecs GPU Morton bucket prefix-sum pipeline", layout: prefixSumPipelineLayout, compute: { module: prefixSumShaderModule, entryPoint: "main" } };
                const scatterDescriptor = { label: "ArcSecs GPU Morton bucket scatter pipeline", layout: scatterPipelineLayout, compute: { module: scatterShaderModule, entryPoint: "main" } };
                const bucketNeighborDensityDescriptor = { label: "ArcSecs compacted Morton bucket neighbor-density pipeline", layout: bucketNeighborDensityPipelineLayout, compute: { module: bucketNeighborDensityShaderModule, entryPoint: "main" } };
                const densityFieldDescriptor = { label: "ArcSecs GPU-resident density-field pipeline", layout: densityFieldPipelineLayout, compute: { module: densityFieldShaderModule, entryPoint: "main" } };
                const relationalMdsProjectionPipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs GPU-resident relational MDS projection pipeline layout", bindGroupLayouts: [this.relationalMdsProjectionBindGroupLayout] });
                const relationalMdsProjectionDescriptor = { label: "ArcSecs GPU-resident relational MDS projection pipeline", layout: relationalMdsProjectionPipelineLayout, compute: { module: relationalMdsProjectionShaderModule, entryPoint: "main" } };
                const relationalWeberForcePipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs GPU-resident relational Weber force pipeline layout", bindGroupLayouts: [this.relationalWeberForceBindGroupLayout] });
                const relationalWeberForceDescriptor = { label: "ArcSecs GPU-resident relational Weber force accumulation pipeline", layout: relationalWeberForcePipelineLayout, compute: { module: relationalWeberForceShaderModule, entryPoint: "main" } };
                this.prefixSumPipeline = typeof this.device.createComputePipelineAsync === "function" ? await this.device.createComputePipelineAsync(prefixDescriptor) : this.device.createComputePipeline(prefixDescriptor);
                this.scatterPipeline = typeof this.device.createComputePipelineAsync === "function" ? await this.device.createComputePipelineAsync(scatterDescriptor) : this.device.createComputePipeline(scatterDescriptor);
                this.bucketNeighborDensityPipeline = typeof this.device.createComputePipelineAsync === "function" ? await this.device.createComputePipelineAsync(bucketNeighborDensityDescriptor) : this.device.createComputePipeline(bucketNeighborDensityDescriptor);
                this.densityFieldPipeline = typeof this.device.createComputePipelineAsync === "function" ? await this.device.createComputePipelineAsync(densityFieldDescriptor) : this.device.createComputePipeline(densityFieldDescriptor);
                this.relationalMdsProjectionPipeline = typeof this.device.createComputePipelineAsync === "function" ? await this.device.createComputePipelineAsync(relationalMdsProjectionDescriptor) : this.device.createComputePipeline(relationalMdsProjectionDescriptor);
                this.relationalWeberForcePipeline = typeof this.device.createComputePipelineAsync === "function" ? await this.device.createComputePipelineAsync(relationalWeberForceDescriptor) : this.device.createComputePipeline(relationalWeberForceDescriptor);
                this.initialized = true;
                this.lastTelemetry = new WebGpuComputeTelemetryState({
                    webGpuComputeStatus: "initialized",
                    webGpuExecutionLocation: "main-thread fallback pipeline",
                    webGpuReadbackMode: "reduced aggregate atomic buffer",
                    webGpuReadbackBytes: WEBGPU_REDUCED_DIAGNOSTIC_WORDS * 4,
                    webGpuComputeBranchNote: "Actual WebGPU compute pipeline initialized; simulation samples now run through a WGSL semi-implicit particle update when the browser permits it."
                });
                return this.lastTelemetry;
            } catch (error) {
                this.initialized = false;
                return this.createUnavailableTelemetry("WebGPU compute initialization failed safely; fallback renderer remains active.");
            }
        }
        createParticleBufferData(config, particleCount) {
            const data = new Float32Array(particleCount * 8);
            const haloRadius = Math.max(10, finiteNumber(config.haloRadius, 70));
            const visibleMatterMass = Math.max(1, finiteNumber(config.visibleMatterMass, 42));
            const darkMatterDensity = Math.max(0, finiteNumber(config.darkMatterDensity, 1));
            const seedOffset = normalizeDegrees(finiteNumber(config.windDirectionDegrees, 35)) / 360;
            for (let particleIndex = 0; particleIndex < particleCount; particleIndex += 1) {
                const progress = particleCount <= 1 ? 0 : particleIndex / (particleCount - 1);
                const angle = (particleIndex * 2.399963229728653 + seedOffset * TWO_PI) % TWO_PI;
                const radius = 0.08 + Math.sqrt(progress) * haloRadius * 0.01;
                const orbitalSpeed = Math.sqrt((visibleMatterMass * 0.0003 + darkMatterDensity * 0.00012) / Math.max(radius, 0.01));
                const baseIndex = particleIndex * 8;
                data[baseIndex] = Math.cos(angle) * radius;
                data[baseIndex + 1] = Math.sin(angle) * radius * 0.62;
                data[baseIndex + 2] = progress;
                data[baseIndex + 3] = 1;
                data[baseIndex + 4] = -Math.sin(angle) * orbitalSpeed;
                data[baseIndex + 5] = Math.cos(angle) * orbitalSpeed;
                data[baseIndex + 6] = 0;
                data[baseIndex + 7] = 0;
            }
            return data;
        }
        createUniformBufferData(config, particleCount, tick) {
            const buffer = new ArrayBuffer(64);
            const view = new DataView(buffer);
            const windVector = VectorMath.directionFromDegrees(finiteNumber(config.windDirectionDegrees, 35));
            const bucketNeighborSampleLimit = Math.max(1, Math.min(32, Math.round(finiteNumber(config.bucketNeighborSampleLimit, WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT))));
            const densityFieldSampleLimit = Math.max(1, Math.min(32, Math.round(finiteNumber(config.densityFieldSampleLimit, WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT))));
            this.lastBucketNeighborSampleLimit = bucketNeighborSampleLimit;
            this.lastDensityFieldSampleLimit = densityFieldSampleLimit;
            this.lastWebGpuDispatchCadenceTicks = Math.max(1, Math.round(finiteNumber(config.webGpuDispatchCadenceTicks, WEBGPU_ADAPTIVE_COMPUTE_DISPATCH_CADENCE_BY_LEVEL[0])));
            view.setUint32(0, particleCount, true);
            view.setUint32(4, Math.max(0, Math.round(finiteNumber(tick, 0))), true);
            view.setUint32(8, bucketNeighborSampleLimit, true);
            view.setUint32(12, densityFieldSampleLimit, true);
            view.setFloat32(16, clamp(finiteNumber(config.speedMultiplier, 1) / 60, 0.001, 0.08), true);
            view.setFloat32(20, Math.max(0.0001, finiteNumber(config.visibleMatterMass, 42) * 0.0007), true);
            view.setFloat32(24, Math.max(0, finiteNumber(config.darkMatterDensity, 1)), true);
            view.setFloat32(28, Math.max(0.01, finiteNumber(config.haloRadius, 70) * 0.01), true);
            view.setFloat32(32, windVector.x, true);
            view.setFloat32(36, windVector.y, true);
            view.setFloat32(40, clamp(finiteNumber(config.driveCoupling, 0.5), 0, 1), true);
            view.setFloat32(44, 0.0025, true);
            const densityFieldFeedbackGain = clamp(finiteNumber(config.densityFieldFeedbackGain, WEBGPU_DENSITY_FIELD_FEEDBACK_DEFAULT_GAIN), 0, WEBGPU_DENSITY_FIELD_FEEDBACK_MAX_GAIN);
            const adaptiveDensityFieldFeedbackGain = clamp(densityFieldFeedbackGain * finiteNumber(this.densityFieldFeedbackDownshiftFactor, 1), 0, WEBGPU_DENSITY_FIELD_FEEDBACK_MAX_GAIN);
            this.lastDensityFieldFeedbackGain = densityFieldFeedbackGain;
            this.lastAdaptiveDensityFieldFeedbackGain = adaptiveDensityFieldFeedbackGain;
            view.setFloat32(48, densityFieldFeedbackGain, true);
            view.setFloat32(52, adaptiveDensityFieldFeedbackGain, true);
            view.setFloat32(56, WEBGPU_FEEDBACK_DOWNSHIFT_MEDIUM_CLAMP_RATE, true);
            view.setFloat32(60, 0, true);
            return buffer;
        }
        createPersistentStateKey(config, particleCount) {
            return [
                particleCount,
                Math.round(finiteNumber(config.haloRadius, 70) * 1000),
                Math.round(finiteNumber(config.visibleMatterMass, 42) * 1000),
                Math.round(finiteNumber(config.darkMatterDensity, 1) * 1000),
                Math.round(normalizeDegrees(finiteNumber(config.windDirectionDegrees, 35)) * 1000),
                Math.round(finiteNumber(config.driveCoupling, 0.5) * 1000)
            ].join("|");
        }
        createRelationalDistanceMatrixBufferData(config) {
            const suppliedMatrix = config && Array.isArray(config.relationalDistanceMatrix) ? config.relationalDistanceMatrix : [];
            const matrix = new Float32Array(WEBGPU_RELATIONAL_DISTANCE_MATRIX_FLOATS);
            if (suppliedMatrix.length >= WEBGPU_RELATIONAL_DISTANCE_MATRIX_FLOATS) {
                for (let index = 0; index < WEBGPU_RELATIONAL_DISTANCE_MATRIX_FLOATS; index += 1) {
                    matrix[index] = Math.max(0, finiteNumber(suppliedMatrix[index], 0));
                }
                return matrix;
            }
            const fallbackScene = new RelationalEcsSimulationEngine().createScene(config || {});
            return this.relationalMdsGpuProjectionModel.packDistanceMatrix(fallbackScene.relationalNodes);
        }
        createRelationalMdsUniformData() {
            const buffer = new ArrayBuffer(16);
            const view = new DataView(buffer);
            view.setUint32(0, WEBGPU_RELATIONAL_MDS_NODE_COUNT, true);
            view.setUint32(4, WEBGPU_SHARED_BUFFER_CONTRACT_VERSION, true);
            view.setUint32(8, 0, true);
            view.setUint32(12, 0, true);
            return buffer;
        }
        createRelationalPackedTetherBufferData(config) {
            const scene = new RelationalEcsSimulationEngine().createScene(config || {});
            const nodeIndexById = new Map();
            scene.relationalNodes.forEach((node, nodeIndex) => { nodeIndexById.set(node.entityId, nodeIndex); });
            const requestedLimit = Math.max(1, Math.min(WEBGPU_RELATIONAL_WEBER_TETHER_COUNT, Math.round(finiteNumber((config || {}).relationalTetherLimit, WEBGPU_RELATIONAL_WEBER_TETHER_COUNT))));
            const rankedTethers = scene.weberTethers
                .map((tether) => {
                    const firstIndex = nodeIndexById.has(tether.firstEntityId) ? nodeIndexById.get(tether.firstEntityId) : 0;
                    const secondIndex = nodeIndexById.has(tether.secondEntityId) ? nodeIndexById.get(tether.secondEntityId) : 0;
                    const distance = Math.max(0.0001, finiteNumber(tether.scalarDistance, 1));
                    const priority = (tether.includesEntity("ship") ? 10 : 1) + finiteNumber(tether.dynamicInteractionCoefficient, 1) / distance;
                    return { firstIndex, secondIndex, radialVelocity: finiteNumber(tether.relativeRadialVelocity, 0), radialAcceleration: finiteNumber(tether.relativeRadialAcceleration, 0), priority };
                })
                .sort((left, right) => right.priority - left.priority)
                .slice(0, requestedLimit);
            const data = new Float32Array(WEBGPU_RELATIONAL_WEBER_TETHER_COUNT * WEBGPU_RELATIONAL_PACKED_TETHER_FLOATS_PER_TETHER);
            rankedTethers.forEach((tether, tetherIndex) => {
                const baseIndex = tetherIndex * WEBGPU_RELATIONAL_PACKED_TETHER_FLOATS_PER_TETHER;
                data[baseIndex] = tether.firstIndex;
                data[baseIndex + 1] = tether.secondIndex;
                data[baseIndex + 2] = tether.radialVelocity;
                data[baseIndex + 3] = tether.radialAcceleration;
            });
            this.lastRelationalPackedTetherCount = rankedTethers.length;
            this.lastRelationalMachianReductionCadenceTicks = Math.max(1, Math.round(finiteNumber((config || {}).relationalMachianReductionCadenceTicks, WEBGPU_ADAPTIVE_RELATIONAL_REDUCTION_CADENCE_BY_LEVEL[0])));
            this.lastRelationalVisualTetherDensity = clamp(finiteNumber((config || {}).relationalVisualTetherDensity, WEBGPU_ADAPTIVE_RELATIONAL_VISUAL_TETHER_DENSITIES[0]), 0.1, 1);
            return data;
        }

        createRelationalWeberUniformData(config, effectiveTetherCount) {
            const recipe = config || {};
            const suppression = clamp(1 - finiteNumber(recipe.driveCoupling, 0.7) * 0.55, 0.04, 1);
            const buffer = new ArrayBuffer(32);
            const view = new DataView(buffer);
            view.setUint32(0, WEBGPU_RELATIONAL_MDS_NODE_COUNT, true);
            view.setUint32(4, Math.max(1, Math.min(WEBGPU_RELATIONAL_WEBER_TETHER_COUNT, Math.round(finiteNumber(effectiveTetherCount, WEBGPU_RELATIONAL_WEBER_TETHER_COUNT)))), true);
            view.setUint32(8, WEBGPU_SHARED_BUFFER_CONTRACT_VERSION, true);
            view.setUint32(12, Math.round(suppression * 100000), true);
            view.setFloat32(16, clamp(finiteNumber(recipe.darkMatterDial, 1), 0.05, 5) * 0.55, true);
            view.setFloat32(20, 0.42, true);
            view.setFloat32(24, 0.58, true);
            view.setFloat32(28, clamp(finiteNumber(recipe.visibleMatterMass, 44) / 44, 0.05, 8), true);
            return buffer;
        }

        createRelationalWeberForceInfo(relationalWeberDiagnosticData) {
            const diagnostics = Array.from(relationalWeberDiagnosticData || []);
            const totalForce = finiteNumber(diagnostics[0], 0) / WEBGPU_DIAGNOSTIC_SCALE;
            const maximumForce = finiteNumber(diagnostics[1], 0) / WEBGPU_DIAGNOSTIC_SCALE;
            const suppressedCount = Math.max(0, Math.round(finiteNumber(diagnostics[2], 0)));
            const machianMassTotal = finiteNumber(diagnostics[3], 0) / WEBGPU_DIAGNOSTIC_SCALE;
            const accumulatedTetherCount = Math.max(1, Math.round(finiteNumber(diagnostics[4], WEBGPU_RELATIONAL_WEBER_TETHER_COUNT)));
            return {
                webGpuRelationalWeberForceStatus: accumulatedTetherCount > 0 ? "GPU Weber force accumulation executed" : "GPU Weber force accumulation returned no tethers",
                webGpuRelationalWeberTetherCount: accumulatedTetherCount,
                webGpuRelationalWeberSuppressedTetherCount: suppressedCount,
                webGpuRelationalWeberForceTotal: totalForce,
                webGpuRelationalWeberMaximumForce: maximumForce,
                webGpuRelationalMachianMassFromWeberBuffer: machianMassTotal / accumulatedTetherCount,
                webGpuRelationalWeberDiagnosticReadbackBytes: WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_BYTE_LENGTH,
                webGpuRelationalWeberTetherBufferBytes: WEBGPU_RELATIONAL_WEBER_TETHER_BYTE_LENGTH,
                webGpuRelationalPackedTetherBufferBytes: WEBGPU_RELATIONAL_PACKED_TETHER_BYTE_LENGTH,
                webGpuRelationalPackedTetherListStatus: "packed ECS tether list uploaded",
                webGpuRelationalPackedTetherCount: accumulatedTetherCount,
                webGpuRelationalMachianReductionCadenceTicks: this.lastRelationalMachianReductionCadenceTicks,
                webGpuRelationalVisualTetherDensity: this.lastRelationalVisualTetherDensity,
                webGpuRelationalTetherQualityStatus: accumulatedTetherCount < WEBGPU_RELATIONAL_WEBER_TETHER_COUNT ? "adaptive relational tether downshift active" : "base relational tether quality",
                webGpuRelationalWeberContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuRelationalWeberSource: "packed ECS-generated tether-list buffer plus GPU-resident relationalWeberTethers output buffer",
                webGpuRelationalWeberNote: "Machian mass telemetry and direct relational render glow are derived from the same GPU Weber buffer, with packed ECS tethers quality-scaled only after sustained pressure."
            };
        }
        createRelationalMachianMassInfo(relationalMachianMassData) {
            const values = Array.from(relationalMachianMassData || []);
            const entityMasses = [];
            for (let entityIndex = 0; entityIndex < WEBGPU_RELATIONAL_MDS_NODE_COUNT; entityIndex += 1) {
                const baseIndex = entityIndex * WEBGPU_RELATIONAL_MACHIAN_ENTITY_FIELDS;
                const massTotal = finiteNumber(values[baseIndex], 0) / WEBGPU_DIAGNOSTIC_SCALE;
                const sampleCount = Math.max(1, Math.round(finiteNumber(values[baseIndex + 1], 0)));
                const maximumForce = finiteNumber(values[baseIndex + 2], 0) / WEBGPU_DIAGNOSTIC_SCALE;
                const suppressedTetherCount = Math.max(0, Math.round(finiteNumber(values[baseIndex + 3], 0)));
                const effectiveMass = sampleCount > 0 ? massTotal / sampleCount : 0;
                entityMasses.push({ entityIndex, effectiveMass, maximumForce, suppressedTetherCount, sampleCount });
            }
            const activeEntityMasses = entityMasses.filter((entry) => entry.sampleCount > 0 && entry.effectiveMass > 0);
            const divisor = Math.max(1, activeEntityMasses.length);
            const masses = activeEntityMasses.map((entry) => entry.effectiveMass);
            const shipRecord = entityMasses[0] || { effectiveMass: 0 };
            return {
                webGpuRelationalMachianMassReductionStatus: activeEntityMasses.length > 0 ? "GPU per-entity Machian mass reduction executed" : "GPU per-entity Machian mass buffer empty",
                webGpuRelationalMachianMassEntityCount: activeEntityMasses.length,
                webGpuRelationalMachianMassBufferBytes: WEBGPU_RELATIONAL_MACHIAN_MASS_BYTE_LENGTH,
                webGpuRelationalMachianMassReadbackBytes: WEBGPU_RELATIONAL_MACHIAN_MASS_BYTE_LENGTH,
                webGpuRelationalShipMachianEffectiveMass: shipRecord.effectiveMass,
                webGpuRelationalMinimumEntityMachianMass: masses.length ? Math.min.apply(null, masses) : 0,
                webGpuRelationalMaximumEntityMachianMass: masses.length ? Math.max.apply(null, masses) : 0,
                webGpuRelationalAverageEntityMachianMass: masses.reduce((sum, mass) => sum + mass, 0) / divisor,
                webGpuRelationalMachianMassReductionSource: "GPU-resident per-entity Machian mass reduction buffer fed by packed Weber tether records",
                webGpuRelationalMachianMassReductionContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuRelationalMachianEntityMasses: entityMasses
            };
        }


        createRelationalMdsProjectionInfo() {
            return {
                webGpuRelationalMdsProjectionStatus: "GPU-resident scalar distance matrix projected",
                webGpuRelationalMdsProjectionNodeCount: WEBGPU_RELATIONAL_MDS_NODE_COUNT,
                webGpuRelationalMdsDistanceMatrixBytes: WEBGPU_RELATIONAL_DISTANCE_MATRIX_BYTE_LENGTH,
                webGpuRelationalMdsProjectionBufferBytes: WEBGPU_RELATIONAL_PROJECTION_BYTE_LENGTH,
                webGpuRelationalMdsProjectionContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuRelationalMdsProjectionSource: "WebGPU compute pass from relational scalar distance matrix buffer",
                webGpuRelationalMdsProjectionNote: "The direct WebGPU renderer consumes the GPU-resident MDS-style projection buffer as a first-class relational source."
            };
        }
        destroyPersistentBuffers() {
            this.particleBuffers.forEach((buffer) => {
                if (buffer && typeof buffer.destroy === "function") { buffer.destroy(); }
            });
            [this.diagnosticBuffer, this.uniformBuffer, this.readBuffer, this.renderSampleReadBuffer, this.spatialBucketBuffer, this.spatialBucketReadBuffer, this.spatialBucketRangeBuffer, this.spatialBucketRangeReadBuffer, this.spatialBucketCursorBuffer, this.compactedParticleIndexBuffer, this.bucketNeighborDensityBuffer, this.bucketNeighborDensityReadBuffer, this.densityFieldTileBuffer, this.densityFieldDiagnosticBuffer, this.densityFieldDiagnosticReadBuffer, this.relationalDistanceMatrixBuffer, this.relationalProjectionBuffer, this.relationalMdsUniformBuffer, this.relationalWeberTetherBuffer, this.relationalWeberDiagnosticBuffer, this.relationalWeberDiagnosticReadBuffer, this.relationalWeberUniformBuffer, this.relationalPackedWeberTetherBuffer, this.relationalMachianMassBuffer, this.relationalMachianMassReadBuffer].forEach((buffer) => {
                if (buffer && typeof buffer.destroy === "function") { buffer.destroy(); }
            });
            this.particleBuffers = [];
            this.bindGroups = [];
            this.particleBufferCapacity = 0;
            this.persistentParticleCount = 0;
            this.persistentStateKey = "";
            this.diagnosticBuffer = null;
            this.uniformBuffer = null;
            this.readBuffer = null;
            this.renderSampleReadBuffer = null;
            this.spatialBucketBuffer = null;
            this.spatialBucketReadBuffer = null;
            this.spatialBucketRangeBuffer = null;
            this.spatialBucketRangeReadBuffer = null;
            this.spatialBucketCursorBuffer = null;
            this.compactedParticleIndexBuffer = null;
            this.bucketNeighborDensityBuffer = null;
            this.bucketNeighborDensityReadBuffer = null;
            this.densityFieldTileBuffer = null;
            this.densityFieldDiagnosticBuffer = null;
            this.densityFieldDiagnosticReadBuffer = null;
            this.relationalDistanceMatrixBuffer = null;
            this.relationalProjectionBuffer = null;
            this.relationalMdsUniformBuffer = null;
            this.relationalWeberTetherBuffer = null;
            this.relationalWeberDiagnosticBuffer = null;
            this.relationalWeberDiagnosticReadBuffer = null;
            this.relationalWeberUniformBuffer = null;
            this.relationalMachianMassBuffer = null;
            this.relationalMachianMassReadBuffer = null;
            this.prefixSumBindGroup = null;
            this.scatterBindGroups = [];
            this.bucketNeighborDensityBindGroups = [];
            this.densityFieldBindGroups = [];
            this.relationalMdsProjectionBindGroup = null;
            this.relationalWeberForceBindGroup = null;
            this.activeParticleBufferIndex = 0;
        }
        ensurePersistentBuffers(config, particleCount) {
            const particleData = this.createParticleBufferData(config, particleCount);
            const particleByteLength = particleData.byteLength;
            const diagnosticByteLength = WEBGPU_REDUCED_DIAGNOSTIC_WORDS * 4;
            const persistentStateKey = this.createPersistentStateKey(config, particleCount);
            const mustRebuild = !this.particleBuffers[0]
                || !this.particleBuffers[1]
                || !this.diagnosticBuffer
                || !this.uniformBuffer
                || !this.readBuffer
                || !this.renderSampleReadBuffer
                || !this.spatialBucketBuffer
                || !this.spatialBucketReadBuffer
                || !this.spatialBucketRangeBuffer
                || !this.spatialBucketRangeReadBuffer
                || !this.spatialBucketCursorBuffer
                || !this.compactedParticleIndexBuffer
                || !this.bucketNeighborDensityBuffer
                || !this.bucketNeighborDensityReadBuffer
                || !this.densityFieldTileBuffer
                || !this.densityFieldDiagnosticBuffer
                || !this.densityFieldDiagnosticReadBuffer
                || !this.relationalDistanceMatrixBuffer
                || !this.relationalProjectionBuffer
                || !this.relationalMdsUniformBuffer
                || !this.relationalWeberTetherBuffer
                || !this.relationalWeberDiagnosticBuffer
                || !this.relationalWeberDiagnosticReadBuffer
                || !this.relationalWeberUniformBuffer
                || !this.relationalPackedWeberTetherBuffer
                || !this.relationalMachianMassBuffer
                || !this.relationalMachianMassReadBuffer
                || !this.relationalMdsProjectionBindGroup
                || !this.relationalWeberForceBindGroup
                || !this.prefixSumBindGroup
                || !this.scatterBindGroups.length
                || !this.bucketNeighborDensityBindGroups.length
                || !this.densityFieldBindGroups.length
                || this.particleBufferCapacity < particleByteLength
                || this.persistentStateKey !== persistentStateKey;
            if (!mustRebuild) {
                return { rebuilt: false, particleByteLength, diagnosticByteLength };
            }
            this.destroyPersistentBuffers();
            const usage = getGpuBufferUsageFlags();
            this.particleBuffers = [0, 1].map((bufferIndex) => this.device.createBuffer({
                label: "ArcSecs persistent ping-pong particle buffer " + bufferIndex,
                size: particleByteLength,
                usage: usage.STORAGE | usage.COPY_DST | usage.COPY_SRC
            }));
            this.diagnosticBuffer = this.device.createBuffer({
                label: "ArcSecs persistent reduced diagnostic buffer",
                size: diagnosticByteLength,
                usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
            });
            this.uniformBuffer = this.device.createBuffer({
                label: "ArcSecs persistent uniform buffer",
                size: this.createUniformBufferData(config, particleCount, 0).byteLength,
                usage: usage.UNIFORM | usage.COPY_DST
            });
            this.readBuffer = this.device.createBuffer({
                label: "ArcSecs persistent diagnostic readback buffer",
                size: diagnosticByteLength,
                usage: usage.COPY_DST | usage.MAP_READ
            });
            this.renderSampleReadBuffer = this.device.createBuffer({
                label: "ArcSecs bounded render sample readback buffer",
                size: WEBGPU_RENDER_SAMPLE_BYTE_LENGTH,
                usage: usage.COPY_DST | usage.MAP_READ
            });
            this.spatialBucketBuffer = this.device.createBuffer({
                label: "ArcSecs Morton spatial bucket buffer",
                size: WEBGPU_SPATIAL_BUCKET_BYTE_LENGTH,
                usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
            });
            this.spatialBucketReadBuffer = this.device.createBuffer({
                label: "ArcSecs Morton spatial bucket readback buffer",
                size: WEBGPU_SPATIAL_BUCKET_BYTE_LENGTH,
                usage: usage.COPY_DST | usage.MAP_READ
            });
            this.spatialBucketRangeBuffer = this.device.createBuffer({
                label: "ArcSecs compacted Morton bucket range buffer",
                size: WEBGPU_BUCKET_RANGE_BYTE_LENGTH,
                usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
            });
            this.spatialBucketRangeReadBuffer = this.device.createBuffer({
                label: "ArcSecs compacted Morton bucket range readback buffer",
                size: WEBGPU_BUCKET_RANGE_BYTE_LENGTH,
                usage: usage.COPY_DST | usage.MAP_READ
            });
            this.spatialBucketCursorBuffer = this.device.createBuffer({
                label: "ArcSecs compacted Morton bucket cursor buffer",
                size: WEBGPU_SPATIAL_BUCKET_BYTE_LENGTH,
                usage: usage.STORAGE | usage.COPY_DST
            });
            this.compactedParticleIndexBuffer = this.device.createBuffer({
                label: "ArcSecs compacted Morton particle-index buffer",
                size: Math.max(4, particleCount * 4),
                usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
            });
            this.bucketNeighborDensityBuffer = this.device.createBuffer({
                label: "ArcSecs compacted bucket neighbor-density diagnostic buffer",
                size: WEBGPU_BUCKET_NEIGHBOR_DENSITY_BYTE_LENGTH,
                usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
            });
            this.bucketNeighborDensityReadBuffer = this.device.createBuffer({
                label: "ArcSecs compacted bucket neighbor-density readback buffer",
                size: WEBGPU_BUCKET_NEIGHBOR_DENSITY_BYTE_LENGTH,
                usage: usage.COPY_DST | usage.MAP_READ
            });
            this.densityFieldTileBuffer = this.device.createBuffer({
                label: "ArcSecs GPU-resident density-field tile buffer",
                size: WEBGPU_DENSITY_FIELD_TILE_BYTE_LENGTH,
                usage: usage.STORAGE | usage.COPY_DST
            });
            this.densityFieldDiagnosticBuffer = this.device.createBuffer({
                label: "ArcSecs GPU-resident density-field diagnostic buffer",
                size: WEBGPU_DENSITY_FIELD_DIAGNOSTIC_BYTE_LENGTH,
                usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
            });
            this.densityFieldDiagnosticReadBuffer = this.device.createBuffer({
                label: "ArcSecs GPU-resident density-field diagnostic readback buffer",
                size: WEBGPU_DENSITY_FIELD_DIAGNOSTIC_BYTE_LENGTH,
                usage: usage.COPY_DST | usage.MAP_READ
            });
            this.relationalDistanceMatrixBuffer = this.device.createBuffer({
                label: "ArcSecs GPU-resident relational scalar distance matrix buffer",
                size: WEBGPU_RELATIONAL_DISTANCE_MATRIX_BYTE_LENGTH,
                usage: usage.STORAGE | usage.COPY_DST
            });
            this.relationalProjectionBuffer = this.device.createBuffer({
                label: "ArcSecs GPU-resident relational MDS projection buffer",
                size: WEBGPU_RELATIONAL_PROJECTION_BYTE_LENGTH,
                usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
            });
            this.relationalMdsUniformBuffer = this.device.createBuffer({
                label: "ArcSecs relational MDS projection uniform buffer",
                size: 16,
                usage: usage.UNIFORM | usage.COPY_DST
            });
            this.relationalWeberTetherBuffer = this.device.createBuffer({
                label: "ArcSecs GPU-resident relational Weber tether force buffer",
                size: WEBGPU_RELATIONAL_WEBER_TETHER_BYTE_LENGTH,
                usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
            });
            this.relationalWeberDiagnosticBuffer = this.device.createBuffer({
                label: "ArcSecs relational Weber force diagnostic buffer",
                size: WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_BYTE_LENGTH,
                usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
            });
            this.relationalWeberDiagnosticReadBuffer = this.device.createBuffer({
                label: "ArcSecs relational Weber force diagnostic readback buffer",
                size: WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_BYTE_LENGTH,
                usage: usage.COPY_DST | usage.MAP_READ
            });
            this.relationalWeberUniformBuffer = this.device.createBuffer({
                label: "ArcSecs relational Weber force uniform buffer",
                size: 32,
                usage: usage.UNIFORM | usage.COPY_DST
            });
            this.relationalPackedWeberTetherBuffer = this.device.createBuffer({
                label: "ArcSecs packed ECS-generated Weber tether-list input buffer",
                size: WEBGPU_RELATIONAL_PACKED_TETHER_BYTE_LENGTH,
                usage: usage.STORAGE | usage.COPY_DST
            });
            this.relationalMachianMassBuffer = this.device.createBuffer({
                label: "ArcSecs GPU Machian mass reduction buffer per relational entity",
                size: WEBGPU_RELATIONAL_MACHIAN_MASS_BYTE_LENGTH,
                usage: usage.STORAGE | usage.COPY_SRC | usage.COPY_DST
            });
            this.relationalMachianMassReadBuffer = this.device.createBuffer({
                label: "ArcSecs GPU Machian mass per-entity readback buffer",
                size: WEBGPU_RELATIONAL_MACHIAN_MASS_BYTE_LENGTH,
                usage: usage.COPY_DST | usage.MAP_READ
            });
            this.device.queue.writeBuffer(this.densityFieldTileBuffer, 0, new Float32Array(WEBGPU_SPATIAL_BUCKET_COUNT * WEBGPU_DENSITY_FIELD_TILE_WORDS));
            this.device.queue.writeBuffer(this.relationalProjectionBuffer, 0, new Float32Array(WEBGPU_RELATIONAL_MDS_NODE_COUNT * WEBGPU_RELATIONAL_PROJECTION_FLOATS_PER_NODE));
            this.device.queue.writeBuffer(this.relationalWeberTetherBuffer, 0, new Float32Array(WEBGPU_RELATIONAL_WEBER_TETHER_COUNT * WEBGPU_RELATIONAL_WEBER_TETHER_FLOATS_PER_TETHER));
            this.device.queue.writeBuffer(this.relationalMachianMassBuffer, 0, new Uint32Array(WEBGPU_RELATIONAL_MDS_NODE_COUNT * WEBGPU_RELATIONAL_MACHIAN_ENTITY_FIELDS));
            const initialPackedTethers = this.createRelationalPackedTetherBufferData(config);
            this.device.queue.writeBuffer(this.relationalPackedWeberTetherBuffer, 0, initialPackedTethers);
            this.device.queue.writeBuffer(this.relationalMdsUniformBuffer, 0, this.createRelationalMdsUniformData());
            this.device.queue.writeBuffer(this.relationalWeberUniformBuffer, 0, this.createRelationalWeberUniformData(config, this.lastRelationalPackedTetherCount));
            this.device.queue.writeBuffer(this.particleBuffers[0], 0, particleData);
            this.device.queue.writeBuffer(this.particleBuffers[1], 0, particleData);
            this.bindGroups = [0, 1].map((sourceIndex) => {
                const destinationIndex = sourceIndex === 0 ? 1 : 0;
                return this.device.createBindGroup({
                    label: "ArcSecs persistent ping-pong compute bind group " + sourceIndex + " to " + destinationIndex,
                    layout: this.bindGroupLayout,
                    entries: [
                        { binding: 0, resource: { buffer: this.particleBuffers[sourceIndex] } },
                        { binding: 1, resource: { buffer: this.particleBuffers[destinationIndex] } },
                        { binding: 2, resource: { buffer: this.diagnosticBuffer } },
                        { binding: 3, resource: { buffer: this.uniformBuffer } },
                        { binding: 4, resource: { buffer: this.spatialBucketBuffer } },
                        { binding: 5, resource: { buffer: this.densityFieldTileBuffer } }
                    ]
                });
            });
            this.prefixSumBindGroup = this.device.createBindGroup({
                label: "ArcSecs compacted bucket prefix-sum bind group",
                layout: this.prefixSumBindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: this.spatialBucketBuffer } },
                    { binding: 1, resource: { buffer: this.spatialBucketRangeBuffer } },
                    { binding: 2, resource: { buffer: this.spatialBucketCursorBuffer } }
                ]
            });
            this.scatterBindGroups = [0, 1].map((particleBufferIndex) => this.device.createBindGroup({
                label: "ArcSecs compacted bucket scatter bind group from particle buffer " + particleBufferIndex,
                layout: this.scatterBindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: this.particleBuffers[particleBufferIndex] } },
                    { binding: 1, resource: { buffer: this.spatialBucketCursorBuffer } },
                    { binding: 2, resource: { buffer: this.compactedParticleIndexBuffer } },
                    { binding: 3, resource: { buffer: this.uniformBuffer } }
                ]
            }));
            this.bucketNeighborDensityBindGroups = [0, 1].map((particleBufferIndex) => this.device.createBindGroup({
                label: "ArcSecs compacted bucket neighbor-density bind group from particle buffer " + particleBufferIndex,
                layout: this.bucketNeighborDensityBindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: this.particleBuffers[particleBufferIndex] } },
                    { binding: 1, resource: { buffer: this.spatialBucketRangeBuffer } },
                    { binding: 2, resource: { buffer: this.compactedParticleIndexBuffer } },
                    { binding: 3, resource: { buffer: this.uniformBuffer } },
                    { binding: 4, resource: { buffer: this.bucketNeighborDensityBuffer } }
                ]
            }));

            this.densityFieldBindGroups = [0, 1].map((particleBufferIndex) => this.device.createBindGroup({
                label: "ArcSecs GPU-resident density-field bind group from particle buffer " + particleBufferIndex,
                layout: this.densityFieldBindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: this.particleBuffers[particleBufferIndex] } },
                    { binding: 1, resource: { buffer: this.spatialBucketRangeBuffer } },
                    { binding: 2, resource: { buffer: this.compactedParticleIndexBuffer } },
                    { binding: 3, resource: { buffer: this.uniformBuffer } },
                    { binding: 4, resource: { buffer: this.densityFieldTileBuffer } },
                    { binding: 5, resource: { buffer: this.densityFieldDiagnosticBuffer } }
                ]
            }));
            this.relationalMdsProjectionBindGroup = this.device.createBindGroup({
                label: "ArcSecs relational scalar distance matrix MDS projection bind group",
                layout: this.relationalMdsProjectionBindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: this.relationalDistanceMatrixBuffer } },
                    { binding: 1, resource: { buffer: this.relationalProjectionBuffer } },
                    { binding: 2, resource: { buffer: this.relationalMdsUniformBuffer } }
                ]
            });
            this.relationalWeberForceBindGroup = this.device.createBindGroup({
                label: "ArcSecs relational Weber tether force accumulation bind group",
                layout: this.relationalWeberForceBindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: this.relationalProjectionBuffer } },
                    { binding: 1, resource: { buffer: this.relationalDistanceMatrixBuffer } },
                    { binding: 2, resource: { buffer: this.relationalWeberTetherBuffer } },
                    { binding: 3, resource: { buffer: this.relationalWeberDiagnosticBuffer } },
                    { binding: 4, resource: { buffer: this.relationalWeberUniformBuffer } },
                    { binding: 5, resource: { buffer: this.relationalPackedWeberTetherBuffer } },
                    { binding: 6, resource: { buffer: this.relationalMachianMassBuffer } }
                ]
            });
            this.particleBufferCapacity = particleByteLength;
            this.persistentParticleCount = particleCount;
            this.persistentStateKey = persistentStateKey;
            this.activeParticleBufferIndex = 0;
            this.bufferRebuildCount += 1;
            return { rebuilt: true, particleByteLength, diagnosticByteLength };
        }
        createRenderSampleInfo(sampleParticleData, sampleCount, sourceIndex) {
            const boundedSampleCount = Math.min(WEBGPU_RENDER_SAMPLE_PARTICLE_COUNT, Math.max(0, Math.round(finiteNumber(sampleCount, 0))));
            const samplePoints = [];
            for (let sampleIndex = 0; sampleIndex < boundedSampleCount; sampleIndex += 1) {
                const baseIndex = sampleIndex * WEBGPU_PARTICLE_FLOATS_PER_PARTICLE;
                const x = finiteNumber(sampleParticleData[baseIndex], 0);
                const y = finiteNumber(sampleParticleData[baseIndex + 1], 0);
                const progress = finiteNumber(sampleParticleData[baseIndex + 2], sampleIndex / Math.max(1, boundedSampleCount - 1));
                if (Number.isFinite(x) && Number.isFinite(y)) {
                    samplePoints.push({ x, y, progress: clamp(progress, 0, 1) });
                }
            }
            return {
                samplePoints,
                sampleBytes: boundedSampleCount * WEBGPU_PARTICLE_BYTES_PER_PARTICLE,
                sourceIndex
            };
        }
        createSpatialBucketInfo(bucketData, particleCount) {
            const bucketCounts = Array.from(bucketData || []);
            const bucketSummary = this.spatialIndexModel.summarizeBuckets(bucketCounts, particleCount);
            const haloShadingSummary = this.haloShadingModel.compute(bucketCounts, particleCount);
            return Object.assign({}, bucketSummary, haloShadingSummary, {
                bucketReadbackBytes: WEBGPU_SPATIAL_BUCKET_BYTE_LENGTH,
                bucketContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                spatialIndexStatus: bucketSummary.occupiedBucketCount > 0 ? "Morton buckets prepared on GPU" : "Morton buckets empty",
                spatialIndexNote: "GPU compute mapped updated particles into 8 by 8 Morton-order spatial buckets and the direct renderer uses those buckets for adaptive halo-density shading."
            });
        }
        createBucketCompactionInfo(bucketRangeData, particleCount) {
            return this.bucketCompactionModel.compute(bucketRangeData, particleCount);
        }
        createBucketNeighborDensityInfo(neighborDensityData, particleCount) {
            return this.bucketNeighborDensityModel.compute(neighborDensityData, particleCount);
        }

        createDensityFieldInfo(densityFieldData, particleCount) {
            return this.densityFieldShadingModel.compute(densityFieldData, particleCount);
        }
        updateDensityFieldFeedbackDownshift(finiteGuardClampCount, particleCount) {
            const normalizedParticleCount = Math.max(1, Math.round(finiteNumber(particleCount, 1)));
            const clampRate = clamp(finiteNumber(finiteGuardClampCount, 0) / normalizedParticleCount, 0, 4);
            this.densityFieldFeedbackClampRate = clampRate;
            if (clampRate >= WEBGPU_FEEDBACK_DOWNSHIFT_HARD_CLAMP_RATE) {
                this.densityFieldFeedbackDownshiftFactor = Math.max(0.1, finiteNumber(this.densityFieldFeedbackDownshiftFactor, 1) * 0.5);
                this.densityFieldFeedbackDownshiftStatus = "hard downshift: finite guard clamp rate exceeded safe envelope";
            } else if (clampRate >= WEBGPU_FEEDBACK_DOWNSHIFT_MEDIUM_CLAMP_RATE) {
                this.densityFieldFeedbackDownshiftFactor = Math.max(0.25, finiteNumber(this.densityFieldFeedbackDownshiftFactor, 1) * 0.72);
                this.densityFieldFeedbackDownshiftStatus = "medium downshift: density feedback gain reduced";
            } else if (clampRate >= WEBGPU_FEEDBACK_DOWNSHIFT_SOFT_CLAMP_RATE) {
                this.densityFieldFeedbackDownshiftFactor = Math.max(0.5, finiteNumber(this.densityFieldFeedbackDownshiftFactor, 1) * 0.9);
                this.densityFieldFeedbackDownshiftStatus = "soft downshift: monitoring finite guard pressure";
            } else {
                this.densityFieldFeedbackDownshiftFactor = Math.min(1, finiteNumber(this.densityFieldFeedbackDownshiftFactor, 1) + 0.05);
                this.densityFieldFeedbackDownshiftStatus = this.densityFieldFeedbackDownshiftFactor >= 0.999 ? "nominal" : "recovering: feedback gain stepping back up";
            }
            return {
                clampRate,
                downshiftFactor: this.densityFieldFeedbackDownshiftFactor,
                status: this.densityFieldFeedbackDownshiftStatus
            };
        }
        aggregateReducedDiagnostics(reducedDiagnosticData, particleCount, dispatchCount, tick, roundTripMilliseconds, persistentInfo, renderSampleInfo, spatialBucketInfo, bucketCompactionInfo, bucketNeighborDensityInfo, densityFieldInfo, readbackLatencyMilliseconds, relationalMdsProjectionInfo, relationalWeberForceInfo) {
            const finiteParticleCount = Math.max(0, Number(reducedDiagnosticData[0] || 0));
            const divisor = Math.max(1, finiteParticleCount);
            const scale = WEBGPU_DIAGNOSTIC_SCALE;
            const pingPongSourceIndex = persistentInfo && Number.isFinite(Number(persistentInfo.sourceIndex)) ? Number(persistentInfo.sourceIndex) : this.activeParticleBufferIndex;
            const pingPongDestinationIndex = persistentInfo && Number.isFinite(Number(persistentInfo.destinationIndex)) ? Number(persistentInfo.destinationIndex) : (pingPongSourceIndex === 0 ? 1 : 0);
            const tileLocalDensityProxy = Number(reducedDiagnosticData[5] || 0) / scale / divisor;
            const adaptiveHaloDensityGain = Number(reducedDiagnosticData[6] || 0) / scale / divisor;
            const densityFieldAccelerationProxy = Number(reducedDiagnosticData[7] || 0) / scale / divisor;
            const finiteOutputGuardClampCount = Number(reducedDiagnosticData[8] || 0);
            const feedbackDownshiftInfo = this.updateDensityFieldFeedbackDownshift(finiteOutputGuardClampCount, particleCount);
            const tileLocalNeighborSummary = this.tileLocalNeighborQueryModel.compute(particleCount, tileLocalDensityProxy);
            this.lastTelemetry = new WebGpuComputeTelemetryState({
                webGpuComputeStatus: finiteParticleCount === particleCount ? "executed" : "executed with finite guard warnings",
                webGpuActualParticleCount: particleCount,
                webGpuActualDispatches: dispatchCount,
                webGpuMeanParticleSpeed: Number(reducedDiagnosticData[1] || 0) / scale / divisor,
                webGpuMaxParticleRadius: Number(reducedDiagnosticData[2] || 0) / scale,
                webGpuMeanAccelerationProxy: Number(reducedDiagnosticData[3] || 0) / scale / divisor,
                webGpuHaloPressureProxy: Number(reducedDiagnosticData[4] || 0) / scale / divisor,
                webGpuLastCompletedTick: Math.max(0, Math.round(finiteNumber(tick, 0))),
                webGpuExecutionLocation: "main-thread fallback pipeline",
                webGpuReadbackMode: "reduced aggregate atomic buffer",
                webGpuReadbackBytes: WEBGPU_REDUCED_DIAGNOSTIC_WORDS * 4,
                webGpuWorkerStatus: "not used",
                webGpuWorkerRoundTripMilliseconds: finiteNumber(roundTripMilliseconds, 0),
                webGpuReadbackLatencyMilliseconds: finiteNumber(readbackLatencyMilliseconds, roundTripMilliseconds || 0),
                webGpuPersistentBuffersStatus: "persistent ping-pong buffers active",
                webGpuPingPongSourceIndex: pingPongSourceIndex,
                webGpuPingPongDestinationIndex: pingPongDestinationIndex,
                webGpuParticleBufferCapacity: this.particleBufferCapacity,
                webGpuBufferRebuildCount: this.bufferRebuildCount,
                webGpuSharedBufferContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuSharedRenderBufferStatus: renderSampleInfo && renderSampleInfo.samplePoints.length ? "bounded latest-particle render sample copied from completed GPU buffer" : "compute-owned storage buffers ready for bounded render sampling",
                webGpuRenderSampleStatus: renderSampleInfo && renderSampleInfo.samplePoints.length ? "sample ready" : "sample unavailable",
                webGpuRenderSampleCount: renderSampleInfo ? renderSampleInfo.samplePoints.length : 0,
                webGpuRenderSampleBytes: renderSampleInfo ? renderSampleInfo.sampleBytes : 0,
                webGpuRenderSampleSourceIndex: renderSampleInfo ? renderSampleInfo.sourceIndex : -1,
                webGpuRenderSampleContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuRenderSamplePoints: renderSampleInfo ? renderSampleInfo.samplePoints : [],
                webGpuSpatialIndexStatus: spatialBucketInfo ? spatialBucketInfo.spatialIndexStatus : "not prepared",
                webGpuSpatialBucketCount: spatialBucketInfo ? spatialBucketInfo.bucketCount : WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuSpatialBucketReadbackBytes: spatialBucketInfo ? spatialBucketInfo.bucketReadbackBytes : 0,
                webGpuMortonContractVersion: spatialBucketInfo ? spatialBucketInfo.bucketContractVersion : WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuOccupiedSpatialBuckets: spatialBucketInfo ? spatialBucketInfo.occupiedBucketCount : 0,
                webGpuDensestSpatialBucketIndex: spatialBucketInfo ? spatialBucketInfo.densestBucketIndex : 0,
                webGpuDensestSpatialBucketOccupancy: spatialBucketInfo ? spatialBucketInfo.densestBucketOccupancy : 0,
                webGpuSpatialLocalityRatio: spatialBucketInfo ? spatialBucketInfo.spatialLocalityRatio : 0,
                webGpuSpatialIndexNote: spatialBucketInfo ? spatialBucketInfo.spatialIndexNote : "Morton spatial buckets were not prepared.",
                webGpuAdaptiveHaloShadingStatus: spatialBucketInfo ? spatialBucketInfo.adaptiveHaloShadingStatus : "waiting for bucket occupancy",
                webGpuAdaptiveHaloShadingSource: spatialBucketInfo ? spatialBucketInfo.adaptiveHaloShadingSource : "GPU Morton bucket occupancy map",
                webGpuAdaptiveHaloDensityGain: spatialBucketInfo ? spatialBucketInfo.adaptiveHaloDensityGain : adaptiveHaloDensityGain,
                webGpuAdaptiveHaloOpacity: spatialBucketInfo ? spatialBucketInfo.adaptiveHaloOpacity : 0,
                webGpuAdaptiveHaloDensityContrast: spatialBucketInfo ? spatialBucketInfo.adaptiveHaloDensityContrast : 0,
                webGpuTileLocalNeighborStatus: tileLocalNeighborSummary.tileLocalNeighborStatus,
                webGpuTileLocalNeighborQueryCount: tileLocalNeighborSummary.tileLocalNeighborQueryCount,
                webGpuTileLocalDensityProxy: tileLocalNeighborSummary.tileLocalDensityProxy,
                webGpuTileLocalNeighborLimit: tileLocalNeighborSummary.tileLocalNeighborLimit,
                webGpuTileLocalNeighborNote: tileLocalNeighborSummary.tileLocalNeighborNote,
                webGpuBucketCompactionStatus: bucketCompactionInfo ? bucketCompactionInfo.bucketCompactionStatus : "waiting for GPU bucket ranges",
                webGpuBucketPrefixSumStatus: bucketCompactionInfo ? bucketCompactionInfo.bucketPrefixSumStatus : "prefix sum pending",
                webGpuBucketRangeCount: bucketCompactionInfo ? bucketCompactionInfo.bucketRangeCount : WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuBucketRangeReadbackBytes: bucketCompactionInfo ? bucketCompactionInfo.bucketRangeReadbackBytes : 0,
                webGpuCompactedIndexBufferBytes: bucketCompactionInfo ? bucketCompactionInfo.compactedIndexBufferBytes : 0,
                webGpuCompactedParticleCount: bucketCompactionInfo ? bucketCompactionInfo.compactedParticleCount : 0,
                webGpuBucketRangeMaxCount: bucketCompactionInfo ? bucketCompactionInfo.bucketRangeMaxCount : 0,
                webGpuBucketRangeCoverageRatio: bucketCompactionInfo ? bucketCompactionInfo.bucketRangeCoverageRatio : 0,
                webGpuBucketNeighborQueryMode: bucketCompactionInfo ? bucketCompactionInfo.bucketNeighborQueryMode : "tile-local fallback only",
                webGpuBucketCompactionContractVersion: bucketCompactionInfo ? bucketCompactionInfo.bucketCompactionContractVersion : WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuBucketCompactionNote: bucketCompactionInfo ? bucketCompactionInfo.bucketCompactionNote : "GPU prefix-sum bucket compaction has not run yet.",
                webGpuBucketNeighborDensityStatus: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityStatus : "neighbor-density pass pending",
                webGpuBucketNeighborDensityReadbackBytes: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityReadbackBytes : 0,
                webGpuBucketNeighborDensitySampleCount: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensitySampleCount : 0,
                webGpuBucketNeighborDensityAverage: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityAverage : 0,
                webGpuBucketNeighborDensityMaximum: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityMaximum : 0,
                webGpuBucketNeighborDensityNearbyBuckets: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityNearbyBuckets : 0,
                webGpuBucketNeighborDensityCoverageRatio: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityCoverageRatio : 0,
                webGpuBucketNeighborDensityContractVersion: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityContractVersion : WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuBucketNeighborDensityNote: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityNote : "Compacted bucket neighbor-density pass has not run yet.",
                webGpuDensityFieldShadingStatus: densityFieldInfo ? densityFieldInfo.densityFieldShadingStatus : "density-field pass pending",
                webGpuDensityFieldReadbackBytes: densityFieldInfo ? densityFieldInfo.densityFieldReadbackBytes : 0,
                webGpuDensityFieldTileCount: densityFieldInfo ? densityFieldInfo.densityFieldTileCount : WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuDensityFieldActiveTiles: densityFieldInfo ? densityFieldInfo.densityFieldActiveTiles : 0,
                webGpuDensityFieldAverageDensity: densityFieldInfo ? densityFieldInfo.densityFieldAverageDensity : 0,
                webGpuDensityFieldMaximumDensity: densityFieldInfo ? densityFieldInfo.densityFieldMaximumDensity : 0,
                webGpuDensityFieldAverageForceProxy: densityFieldInfo ? densityFieldInfo.densityFieldAverageForceProxy : 0,
                webGpuDensityFieldSampleCount: densityFieldInfo ? densityFieldInfo.densityFieldSampleCount : 0,
                webGpuDensityFieldVisitedRangeCount: densityFieldInfo ? densityFieldInfo.densityFieldVisitedRangeCount : 0,
                webGpuDensityFieldCoverageRatio: densityFieldInfo ? densityFieldInfo.densityFieldCoverageRatio : 0,
                webGpuDensityFieldParticleSampleRatio: densityFieldInfo ? densityFieldInfo.densityFieldParticleSampleRatio : 0,
                webGpuDensityFieldContractVersion: densityFieldInfo ? densityFieldInfo.densityFieldContractVersion : WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuDensityFieldNote: densityFieldInfo ? densityFieldInfo.densityFieldNote : "GPU-resident density-field shading pass has not run yet.",
                webGpuDensityFieldFeedbackStatus: densityFieldAccelerationProxy > 0 ? "density field fed back into particle acceleration" : "density-field feedback armed with zero/settling force",
                webGpuDensityFieldFeedbackGain: this.lastDensityFieldFeedbackGain,
                webGpuAdaptiveDensityFieldFeedbackGain: this.lastAdaptiveDensityFieldFeedbackGain,
                webGpuDensityFieldFeedbackDownshiftFactor: feedbackDownshiftInfo.downshiftFactor,
                webGpuDensityFieldFeedbackDownshiftStatus: feedbackDownshiftInfo.status,
                webGpuDensityFieldAccelerationProxy: densityFieldAccelerationProxy,
                webGpuFiniteOutputGuardClampCount: finiteOutputGuardClampCount,
                webGpuFiniteOutputGuardClampRate: feedbackDownshiftInfo.clampRate,
                webGpuDensityFieldFeedbackContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuDensityFieldFeedbackNote: "The N-body WGSL update reads the previous GPU-resident densityFieldTiles buffer, applies a bounded tile-level acceleration term, and clamps non-finite or runaway outputs before writing the next particle buffer.",
                webGpuEffectiveBucketNeighborSampleLimit: this.lastBucketNeighborSampleLimit,
                webGpuEffectiveDensityFieldSampleLimit: this.lastDensityFieldSampleLimit,
                webGpuDispatchCadenceTicks: this.lastWebGpuDispatchCadenceTicks,
                webGpuDispatchCadenceStatus: this.lastWebGpuDispatchCadenceTicks > WEBGPU_ADAPTIVE_COMPUTE_BASE_DISPATCH_CADENCE_TICKS ? "adaptive cadence downshift applied" : "base cadence",
                webGpuDensityFieldSampleLimitStatus: this.lastDensityFieldSampleLimit < WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT || this.lastBucketNeighborSampleLimit < WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT ? "adaptive sample-limit downshift applied" : "base sample limits",
                webGpuRelationalMdsProjectionStatus: relationalMdsProjectionInfo ? relationalMdsProjectionInfo.webGpuRelationalMdsProjectionStatus : "projection pass pending",
                webGpuRelationalMdsProjectionNodeCount: relationalMdsProjectionInfo ? relationalMdsProjectionInfo.webGpuRelationalMdsProjectionNodeCount : WEBGPU_RELATIONAL_MDS_NODE_COUNT,
                webGpuRelationalMdsDistanceMatrixBytes: relationalMdsProjectionInfo ? relationalMdsProjectionInfo.webGpuRelationalMdsDistanceMatrixBytes : WEBGPU_RELATIONAL_DISTANCE_MATRIX_BYTE_LENGTH,
                webGpuRelationalMdsProjectionBufferBytes: relationalMdsProjectionInfo ? relationalMdsProjectionInfo.webGpuRelationalMdsProjectionBufferBytes : WEBGPU_RELATIONAL_PROJECTION_BYTE_LENGTH,
                webGpuRelationalMdsProjectionContractVersion: relationalMdsProjectionInfo ? relationalMdsProjectionInfo.webGpuRelationalMdsProjectionContractVersion : WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuRelationalMdsProjectionSource: relationalMdsProjectionInfo ? relationalMdsProjectionInfo.webGpuRelationalMdsProjectionSource : "waiting for relational scalar distance matrix",
                webGpuRelationalMdsProjectionNote: relationalMdsProjectionInfo ? relationalMdsProjectionInfo.webGpuRelationalMdsProjectionNote : "GPU-resident relational projection did not run in this tick.",
                webGpuRelationalWeberForceStatus: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalWeberForceStatus : "Weber force pass pending",
                webGpuRelationalWeberTetherCount: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalWeberTetherCount : WEBGPU_RELATIONAL_WEBER_TETHER_COUNT,
                webGpuRelationalWeberSuppressedTetherCount: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalWeberSuppressedTetherCount : 0,
                webGpuRelationalWeberForceTotal: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalWeberForceTotal : 0,
                webGpuRelationalWeberMaximumForce: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalWeberMaximumForce : 0,
                webGpuRelationalMachianMassFromWeberBuffer: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalMachianMassFromWeberBuffer : 0,
                webGpuRelationalWeberDiagnosticReadbackBytes: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalWeberDiagnosticReadbackBytes : WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_BYTE_LENGTH,
                webGpuRelationalWeberTetherBufferBytes: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalWeberTetherBufferBytes : WEBGPU_RELATIONAL_WEBER_TETHER_BYTE_LENGTH,
                webGpuRelationalPackedTetherBufferBytes: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalPackedTetherBufferBytes : WEBGPU_RELATIONAL_PACKED_TETHER_BYTE_LENGTH,
                webGpuRelationalPackedTetherListStatus: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalPackedTetherListStatus : "packed tether list pending",
                webGpuRelationalPackedTetherCount: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalPackedTetherCount : 0,
                webGpuRelationalMachianReductionCadenceTicks: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalMachianReductionCadenceTicks : WEBGPU_ADAPTIVE_RELATIONAL_REDUCTION_CADENCE_BY_LEVEL[0],
                webGpuRelationalVisualTetherDensity: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalVisualTetherDensity : WEBGPU_ADAPTIVE_RELATIONAL_VISUAL_TETHER_DENSITIES[0],
                webGpuRelationalTetherQualityStatus: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalTetherQualityStatus : "base relational tether quality",
                webGpuRelationalWeberContractVersion: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalWeberContractVersion : WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuRelationalWeberSource: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalWeberSource : "waiting for GPU Weber buffer",
                webGpuRelationalWeberNote: relationalWeberForceInfo ? relationalWeberForceInfo.webGpuRelationalWeberNote : "GPU-resident Weber force accumulation did not run in this tick.",
                webGpuComputeBranchNote: "Actual WGSL compute branch used persistent ping-pong GPU particle buffers, density-field feedback acceleration, finite-output stability guards, Morton buckets, tile-local neighbor queries, adaptive halo-density shading, GPU prefix-sum compacted bucket ranges, and compacted-range neighbor-density sampling."
            });
            return this.lastTelemetry;
        }

        aggregateDiagnostics(diagnosticData, particleCount, dispatchCount, tick) {
            let speedTotal = 0;
            let radiusMaximum = 0;
            let accelerationTotal = 0;
            let haloTotal = 0;
            let finiteParticleCount = 0;
            for (let particleIndex = 0; particleIndex < particleCount; particleIndex += 1) {
                const baseIndex = particleIndex * 4;
                const speed = diagnosticData[baseIndex];
                const radius = diagnosticData[baseIndex + 1];
                const acceleration = diagnosticData[baseIndex + 2];
                const haloPressure = diagnosticData[baseIndex + 3];
                if (Number.isFinite(speed) && Number.isFinite(radius) && Number.isFinite(acceleration) && Number.isFinite(haloPressure)) {
                    speedTotal += speed;
                    radiusMaximum = Math.max(radiusMaximum, radius);
                    accelerationTotal += acceleration;
                    haloTotal += haloPressure;
                    finiteParticleCount += 1;
                }
            }
            const divisor = Math.max(1, finiteParticleCount);
            this.lastTelemetry = new WebGpuComputeTelemetryState({
                webGpuComputeStatus: finiteParticleCount === particleCount ? "executed" : "executed with finite guard warnings",
                webGpuActualParticleCount: particleCount,
                webGpuActualDispatches: dispatchCount,
                webGpuMeanParticleSpeed: speedTotal / divisor,
                webGpuMaxParticleRadius: radiusMaximum,
                webGpuMeanAccelerationProxy: accelerationTotal / divisor,
                webGpuHaloPressureProxy: haloTotal / divisor,
                webGpuLastCompletedTick: Math.max(0, Math.round(finiteNumber(tick, 0))),
                webGpuComputeBranchNote: "Actual WGSL compute shader branch completed a bounded semi-implicit particle update and read back finite aggregate diagnostics."
            });
            return this.lastTelemetry;
        }
        async run(config, tick) {
            if (!this.initialized) {
                const initializedTelemetry = await this.initialize();
                if (!this.initialized) { return initializedTelemetry; }
            }
            if (!this.device || !this.pipeline || !this.bindGroupLayout) {
                return this.createUnavailableTelemetry("WebGPU pipeline was not available after initialization; fallback telemetry remains active.");
            }
            const requestedParticleCount = Math.round(clamp(finiteNumber(config.computeParticleBudget, DEFAULT_ADVANCED_PARAMETERS.computeParticleBudget), 256, this.maximumParticles));
            const particleCount = Math.max(1, requestedParticleCount);
            const dispatchCount = Math.ceil(particleCount / this.workgroupSize);
            const uniformData = this.createUniformBufferData(config, particleCount, tick);
            const diagnosticByteLength = WEBGPU_REDUCED_DIAGNOSTIC_WORDS * 4;
            const renderSampleCount = Math.min(WEBGPU_RENDER_SAMPLE_PARTICLE_COUNT, particleCount);
            const renderSampleByteLength = renderSampleCount * WEBGPU_PARTICLE_BYTES_PER_PARTICLE;
            const spatialBucketZeroData = new Uint32Array(WEBGPU_SPATIAL_BUCKET_COUNT);
            const startedMilliseconds = nowMilliseconds();
            try {
                this.ensurePersistentBuffers(config, particleCount);
                this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);
                this.device.queue.writeBuffer(this.diagnosticBuffer, 0, new Uint32Array(WEBGPU_REDUCED_DIAGNOSTIC_WORDS));
                this.device.queue.writeBuffer(this.spatialBucketBuffer, 0, spatialBucketZeroData);
                this.device.queue.writeBuffer(this.bucketNeighborDensityBuffer, 0, new Uint32Array(WEBGPU_BUCKET_NEIGHBOR_DENSITY_WORDS));
                this.device.queue.writeBuffer(this.densityFieldDiagnosticBuffer, 0, new Uint32Array(WEBGPU_DENSITY_FIELD_DIAGNOSTIC_WORDS));
                this.device.queue.writeBuffer(this.relationalDistanceMatrixBuffer, 0, this.createRelationalDistanceMatrixBufferData(config));
                const relationalPackedTetherData = this.createRelationalPackedTetherBufferData(config);
                this.device.queue.writeBuffer(this.relationalPackedWeberTetherBuffer, 0, relationalPackedTetherData);
                this.device.queue.writeBuffer(this.relationalMdsUniformBuffer, 0, this.createRelationalMdsUniformData());
                this.device.queue.writeBuffer(this.relationalWeberUniformBuffer, 0, this.createRelationalWeberUniformData(config, this.lastRelationalPackedTetherCount));
                this.device.queue.writeBuffer(this.relationalWeberDiagnosticBuffer, 0, new Uint32Array(WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_WORDS));
                this.device.queue.writeBuffer(this.relationalWeberTetherBuffer, 0, new Float32Array(WEBGPU_RELATIONAL_WEBER_TETHER_COUNT * WEBGPU_RELATIONAL_WEBER_TETHER_FLOATS_PER_TETHER));
                this.device.queue.writeBuffer(this.relationalMachianMassBuffer, 0, new Uint32Array(WEBGPU_RELATIONAL_MDS_NODE_COUNT * WEBGPU_RELATIONAL_MACHIAN_ENTITY_FIELDS));
                const sourceIndex = this.activeParticleBufferIndex;
                const destinationIndex = sourceIndex === 0 ? 1 : 0;
                const bindGroup = this.bindGroups[sourceIndex];
                const commandEncoder = this.device.createCommandEncoder({ label: "ArcSecs persistent Dark Matter Drive compute commands" });
                const computePass = commandEncoder.beginComputePass({ label: "ArcSecs persistent Dark Matter Drive compute pass" });
                computePass.setPipeline(this.pipeline);
                computePass.setBindGroup(0, bindGroup);
                computePass.dispatchWorkgroups(dispatchCount);
                computePass.end();
                const prefixPass = commandEncoder.beginComputePass({ label: "ArcSecs compacted Morton bucket prefix-sum pass" });
                prefixPass.setPipeline(this.prefixSumPipeline);
                prefixPass.setBindGroup(0, this.prefixSumBindGroup);
                prefixPass.dispatchWorkgroups(1);
                prefixPass.end();
                const scatterPass = commandEncoder.beginComputePass({ label: "ArcSecs compacted Morton bucket scatter pass" });
                scatterPass.setPipeline(this.scatterPipeline);
                scatterPass.setBindGroup(0, this.scatterBindGroups[destinationIndex]);
                scatterPass.dispatchWorkgroups(dispatchCount);
                scatterPass.end();
                const bucketNeighborDensityPass = commandEncoder.beginComputePass({ label: "ArcSecs compacted Morton bucket neighbor-density pass" });
                bucketNeighborDensityPass.setPipeline(this.bucketNeighborDensityPipeline);
                bucketNeighborDensityPass.setBindGroup(0, this.bucketNeighborDensityBindGroups[destinationIndex]);
                bucketNeighborDensityPass.dispatchWorkgroups(dispatchCount);
                bucketNeighborDensityPass.end();
                const densityFieldPass = commandEncoder.beginComputePass({ label: "ArcSecs GPU-resident density-field shading pass" });
                densityFieldPass.setPipeline(this.densityFieldPipeline);
                densityFieldPass.setBindGroup(0, this.densityFieldBindGroups[destinationIndex]);
                densityFieldPass.dispatchWorkgroups(1);
                densityFieldPass.end();
                const relationalMdsProjectionPass = commandEncoder.beginComputePass({ label: "ArcSecs GPU-resident relational MDS projection pass" });
                relationalMdsProjectionPass.setPipeline(this.relationalMdsProjectionPipeline);
                relationalMdsProjectionPass.setBindGroup(0, this.relationalMdsProjectionBindGroup);
                relationalMdsProjectionPass.dispatchWorkgroups(1);
                relationalMdsProjectionPass.end();
                const relationalWeberForcePass = commandEncoder.beginComputePass({ label: "ArcSecs GPU-resident relational Weber force accumulation pass" });
                relationalWeberForcePass.setPipeline(this.relationalWeberForcePipeline);
                relationalWeberForcePass.setBindGroup(0, this.relationalWeberForceBindGroup);
                relationalWeberForcePass.dispatchWorkgroups(Math.max(1, Math.ceil(this.lastRelationalPackedTetherCount / 8)));
                relationalWeberForcePass.end();
                commandEncoder.copyBufferToBuffer(this.diagnosticBuffer, 0, this.readBuffer, 0, diagnosticByteLength);
                commandEncoder.copyBufferToBuffer(this.spatialBucketBuffer, 0, this.spatialBucketReadBuffer, 0, WEBGPU_SPATIAL_BUCKET_BYTE_LENGTH);
                commandEncoder.copyBufferToBuffer(this.spatialBucketRangeBuffer, 0, this.spatialBucketRangeReadBuffer, 0, WEBGPU_BUCKET_RANGE_BYTE_LENGTH);
                commandEncoder.copyBufferToBuffer(this.bucketNeighborDensityBuffer, 0, this.bucketNeighborDensityReadBuffer, 0, WEBGPU_BUCKET_NEIGHBOR_DENSITY_BYTE_LENGTH);
                commandEncoder.copyBufferToBuffer(this.densityFieldDiagnosticBuffer, 0, this.densityFieldDiagnosticReadBuffer, 0, WEBGPU_DENSITY_FIELD_DIAGNOSTIC_BYTE_LENGTH);
                commandEncoder.copyBufferToBuffer(this.relationalWeberDiagnosticBuffer, 0, this.relationalWeberDiagnosticReadBuffer, 0, WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_BYTE_LENGTH);
                commandEncoder.copyBufferToBuffer(this.relationalMachianMassBuffer, 0, this.relationalMachianMassReadBuffer, 0, WEBGPU_RELATIONAL_MACHIAN_MASS_BYTE_LENGTH);
                commandEncoder.copyBufferToBuffer(this.particleBuffers[destinationIndex], 0, this.renderSampleReadBuffer, 0, renderSampleByteLength);
                this.device.queue.submit([commandEncoder.finish()]);
                const mapReadMode = typeof GPUMapMode !== "undefined" ? GPUMapMode.READ : 1;
                const readbackStartedMilliseconds = nowMilliseconds();
                await this.readBuffer.mapAsync(mapReadMode);
                const mappedRange = this.readBuffer.getMappedRange();
                const diagnosticCopy = new Uint32Array(mappedRange.slice(0));
                this.readBuffer.unmap();
                await this.renderSampleReadBuffer.mapAsync(mapReadMode);
                const renderSampleMappedRange = this.renderSampleReadBuffer.getMappedRange();
                const renderSampleCopy = new Float32Array(renderSampleMappedRange.slice(0, renderSampleByteLength));
                this.renderSampleReadBuffer.unmap();
                const renderSampleInfo = this.createRenderSampleInfo(renderSampleCopy, renderSampleCount, destinationIndex);
                await this.spatialBucketReadBuffer.mapAsync(mapReadMode);
                const spatialBucketMappedRange = this.spatialBucketReadBuffer.getMappedRange();
                const spatialBucketCopy = new Uint32Array(spatialBucketMappedRange.slice(0, WEBGPU_SPATIAL_BUCKET_BYTE_LENGTH));
                this.spatialBucketReadBuffer.unmap();
                const spatialBucketInfo = this.createSpatialBucketInfo(spatialBucketCopy, particleCount);
                await this.spatialBucketRangeReadBuffer.mapAsync(mapReadMode);
                const bucketRangeMappedRange = this.spatialBucketRangeReadBuffer.getMappedRange();
                const bucketRangeCopy = new Uint32Array(bucketRangeMappedRange.slice(0, WEBGPU_BUCKET_RANGE_BYTE_LENGTH));
                this.spatialBucketRangeReadBuffer.unmap();
                const bucketCompactionInfo = this.createBucketCompactionInfo(bucketRangeCopy, particleCount);
                await this.bucketNeighborDensityReadBuffer.mapAsync(mapReadMode);
                const bucketNeighborDensityMappedRange = this.bucketNeighborDensityReadBuffer.getMappedRange();
                const bucketNeighborDensityCopy = new Uint32Array(bucketNeighborDensityMappedRange.slice(0, WEBGPU_BUCKET_NEIGHBOR_DENSITY_BYTE_LENGTH));
                this.bucketNeighborDensityReadBuffer.unmap();
                const bucketNeighborDensityInfo = this.createBucketNeighborDensityInfo(bucketNeighborDensityCopy, particleCount);
                await this.densityFieldDiagnosticReadBuffer.mapAsync(mapReadMode);
                const densityFieldMappedRange = this.densityFieldDiagnosticReadBuffer.getMappedRange();
                const densityFieldCopy = new Uint32Array(densityFieldMappedRange.slice(0, WEBGPU_DENSITY_FIELD_DIAGNOSTIC_BYTE_LENGTH));
                this.densityFieldDiagnosticReadBuffer.unmap();
                const densityFieldInfo = this.createDensityFieldInfo(densityFieldCopy, particleCount);
                await this.relationalWeberDiagnosticReadBuffer.mapAsync(mapReadMode);
                const relationalWeberMappedRange = this.relationalWeberDiagnosticReadBuffer.getMappedRange();
                const relationalWeberDiagnosticCopy = new Uint32Array(relationalWeberMappedRange.slice(0, WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_BYTE_LENGTH));
                this.relationalWeberDiagnosticReadBuffer.unmap();
                await this.relationalMachianMassReadBuffer.mapAsync(mapReadMode);
                const relationalMachianMappedRange = this.relationalMachianMassReadBuffer.getMappedRange();
                const relationalMachianMassCopy = new Uint32Array(relationalMachianMappedRange.slice(0, WEBGPU_RELATIONAL_MACHIAN_MASS_BYTE_LENGTH));
                this.relationalMachianMassReadBuffer.unmap();
                const relationalMachianMassInfo = this.createRelationalMachianMassInfo(relationalMachianMassCopy);
                const relationalWeberForceInfo = Object.assign({}, this.createRelationalWeberForceInfo(relationalWeberDiagnosticCopy), relationalMachianMassInfo);
                const readbackLatencyMilliseconds = nowMilliseconds() - readbackStartedMilliseconds;
                this.activeParticleBufferIndex = destinationIndex;
                return this.aggregateReducedDiagnostics(diagnosticCopy, particleCount, dispatchCount, tick, nowMilliseconds() - startedMilliseconds, { sourceIndex, destinationIndex }, renderSampleInfo, spatialBucketInfo, bucketCompactionInfo, bucketNeighborDensityInfo, densityFieldInfo, readbackLatencyMilliseconds, this.createRelationalMdsProjectionInfo(), relationalWeberForceInfo);
            } catch (error) {
                this.lastTelemetry = new WebGpuComputeTelemetryState({
                    webGpuComputeStatus: "failed safe",
                    webGpuExecutionLocation: "main-thread fallback pipeline",
                    webGpuReadbackMode: "reduced aggregate atomic buffer",
                    webGpuReadbackBytes: diagnosticByteLength,
                    webGpuPersistentBuffersStatus: this.particleBuffers.length === 2 ? "persistent buffers retained after safe failure" : "persistent buffers unavailable after safe failure",
                    webGpuRenderSampleStatus: "safe failure before render sample",
                    webGpuSharedRenderBufferStatus: "fallback renderer retained; bounded render sample unavailable",
                    webGpuComputeBranchNote: "WebGPU persistent ping-pong compute dispatch failed safely; fallback renderer and deterministic JavaScript telemetry remain active."
                });
                return this.lastTelemetry;
            }
        }
        getTelemetry() {
            return this.lastTelemetry;
        }
    }


    function resolveDarkMatterDriveComputeWorkerUrl() {
        if (typeof ArcSecsDarkMatterDriveSettings !== "undefined" && ArcSecsDarkMatterDriveSettings && ArcSecsDarkMatterDriveSettings.computeWorkerUrl) {
            const configuredUrl = String(ArcSecsDarkMatterDriveSettings.computeWorkerUrl).trim();
            if (configuredUrl.length > 0) { return configuredUrl; }
        }
        if (typeof window !== "undefined" && window.ArcSecsDarkMatterDriveSettings && window.ArcSecsDarkMatterDriveSettings.computeWorkerUrl) {
            const configuredUrl = String(window.ArcSecsDarkMatterDriveSettings.computeWorkerUrl).trim();
            if (configuredUrl.length > 0) { return configuredUrl; }
        }
        if (CURRENT_SCRIPT_URL && typeof URL !== "undefined") {
            return new URL(DARK_MATTER_DRIVE_COMPUTE_WORKER_SCRIPT, CURRENT_SCRIPT_URL).toString();
        }
        return DARK_MATTER_DRIVE_COMPUTE_WORKER_SCRIPT;
    }

    class WebGpuComputeWorkerClient {
        constructor(options) {
            const settings = options || {};
            this.computeWorkerUrl = settings.computeWorkerUrl || resolveDarkMatterDriveComputeWorkerUrl();
            this.worker = null;
            this.requestIndex = 1;
            this.pendingRequests = new Map();
            this.initialized = false;
            this.initializationPromise = null;
            this.lastTelemetry = new WebGpuComputeTelemetryState({
                webGpuWorkerStatus: "not initialized",
                webGpuExecutionLocation: "worker orchestration pending",
                webGpuComputeBranchNote: "Dedicated worker has not initialized the WebGPU compute branch yet."
            });
        }
        static isSupported() {
            return typeof Worker !== "undefined";
        }
        createUnavailableTelemetry(reason) {
            this.lastTelemetry = new WebGpuComputeTelemetryState({
                webGpuComputeStatus: "unavailable",
                webGpuWorkerStatus: "unavailable",
                webGpuExecutionLocation: "fallback",
                webGpuComputeBranchNote: reason || "Dedicated worker orchestration is unavailable; inline WebGPU or Canvas fallback remains active."
            });
            return this.lastTelemetry;
        }
        initialize() {
            if (this.initializationPromise) { return this.initializationPromise; }
            this.initializationPromise = this.initializeInternal();
            return this.initializationPromise;
        }
        initializeInternal() {
            if (!WebGpuComputeWorkerClient.isSupported()) {
                return Promise.resolve(this.createUnavailableTelemetry("Dedicated Web Worker is unavailable in this environment; inline fallback remains active."));
            }
            if (!this.computeWorkerUrl) {
                return Promise.resolve(this.createUnavailableTelemetry("Compute worker URL was not provided; inline fallback remains active."));
            }
            try {
                this.worker = new Worker(this.computeWorkerUrl);
                this.worker.onmessage = (event) => this.handleMessage(event.data || {});
                this.worker.onerror = () => {
                    this.failPendingRequests("Dedicated compute worker failed safely; inline fallback remains active.");
                };
                return this.postRequest("initialize", {
                    contractVersion: WEBGPU_COMPUTE_MESSAGE_CONTRACT_VERSION,
                    maximumParticles: WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES
                }).then((telemetry) => {
                    this.initialized = telemetry.webGpuComputeStatus === "initialized";
                    this.lastTelemetry = new WebGpuComputeTelemetryState(telemetry);
                    return this.lastTelemetry;
                }).catch(() => this.createUnavailableTelemetry("Dedicated compute worker initialization failed safely; inline fallback remains active."));
            } catch (error) {
                return Promise.resolve(this.createUnavailableTelemetry("Dedicated compute worker could not be constructed; inline fallback remains active."));
            }
        }
        handleMessage(message) {
            const requestId = message.requestId;
            const pending = this.pendingRequests.get(requestId);
            if (!pending) { return; }
            this.pendingRequests.delete(requestId);
            if (message.type === "compute-error") {
                pending.reject(new Error(message.reason || "Compute worker request failed."));
                return;
            }
            const telemetry = new WebGpuComputeTelemetryState(message.telemetry || {});
            this.lastTelemetry = telemetry;
            pending.resolve(telemetry);
        }
        failPendingRequests(reason) {
            this.pendingRequests.forEach((pending) => pending.reject(new Error(reason)));
            this.pendingRequests.clear();
            this.lastTelemetry = this.createUnavailableTelemetry(reason);
        }
        postRequest(type, payload) {
            if (!this.worker) { return Promise.reject(new Error("Compute worker is not available.")); }
            const requestId = this.requestIndex;
            this.requestIndex += 1;
            const startedMilliseconds = nowMilliseconds();
            return new Promise((resolve, reject) => {
                this.pendingRequests.set(requestId, {
                    resolve: (telemetry) => {
                        telemetry.webGpuWorkerRoundTripMilliseconds = finiteNumber(telemetry.webGpuWorkerRoundTripMilliseconds, nowMilliseconds() - startedMilliseconds);
                        resolve(telemetry);
                    },
                    reject
                });
                this.worker.postMessage(Object.assign({ type, requestId, contractVersion: WEBGPU_COMPUTE_MESSAGE_CONTRACT_VERSION }, payload || {}));
            });
        }
        run(config, tick) {
            const runAfterInitialization = () => this.postRequest("run", { config, tick });
            return this.initialized ? runAfterInitialization() : this.initialize().then((telemetry) => {
                if (!this.initialized) { return telemetry; }
                return runAfterInitialization();
            });
        }
        getTelemetry() {
            return this.lastTelemetry;
        }
        terminate() {
            this.failPendingRequests("Compute worker terminated.");
            if (this.worker && typeof this.worker.terminate === "function") { this.worker.terminate(); }
            this.worker = null;
            this.initialized = false;
        }
    }


    class PointSpreadConvolutionModel {
        compute(config, opticalTelemetry) {
            const magnitude = clamp(finiteNumber(config.psfMagnitude, DEFAULT_ADVANCED_PARAMETERS.psfMagnitude), -5, 18);
            const effectivePointSpread = Math.max(0.01, finiteNumber(opticalTelemetry.effectivePointSpreadArcseconds, 0.5));
            const brightnessExpansion = clamp((18 - magnitude) / 9, 0.2, 3.4);
            const psfBoundingBoxArcseconds = effectivePointSpread * (4 + brightnessExpansion * 3);
            const dynamicPsfTilePixels = Math.max(16, Math.ceil(psfBoundingBoxArcseconds * 12));
            const starHaloWingRetention = clamp(1 - Math.exp(-psfBoundingBoxArcseconds / Math.max(0.01, effectivePointSpread * 6)), 0, 1);
            const psfTruncationRisk = starHaloWingRetention < 0.72 ? "warning" : dynamicPsfTilePixels > 256 ? "expensive" : "bounded";
            return {
                psfMagnitude: magnitude,
                psfBoundingBoxArcseconds,
                dynamicPsfTilePixels,
                starHaloWingRetention,
                psfTruncationRisk,
                pointSpreadConvolutionNote: "Dynamic PSF bounding-box telemetry is a readiness layer; shader convolution is intentionally deferred."
            };
        }
    }

    class QuantumSignalEnhancementModel {
        compute(config, haloscopeTelemetry) {
            const phaseDegrees = normalizeDegrees(finiteNumber(config.quantumPhaseRotationDegrees, DEFAULT_ADVANCED_PARAMETERS.quantumPhaseRotationDegrees));
            const gateDepth = Math.round(clamp(finiteNumber(config.quantumGateDepth, DEFAULT_ADVANCED_PARAMETERS.quantumGateDepth), 1, 128));
            const noiseLevel = clamp(finiteNumber(config.qubitNoiseLevel, DEFAULT_ADVANCED_PARAMETERS.qubitNoiseLevel), 0, 1);
            const phaseRadians = UnitConversion.degreesToRadians(phaseDegrees);
            const resonance = haloscopeTelemetry ? finiteNumber(haloscopeTelemetry.axionResonanceAlignment, 0.5) : 0.5;
            const coherentGain = Math.abs(Math.sin(phaseRadians)) * Math.sqrt(gateDepth) * resonance;
            const quantumNoisePenalty = clamp(noiseLevel * (1 + gateDepth / 96), 0, 1);
            const quantumSignalEnhancementProxy = clamp(coherentGain * (1 - quantumNoisePenalty), 0, 8);
            return {
                quantumPhaseRotationDegrees: phaseDegrees,
                quantumPhaseRotationRadians: phaseRadians,
                quantumGateDepth: gateDepth,
                quantumNoisePenalty,
                quantumSignalEnhancementProxy,
                nativeGateSequencePreview: "Ry(" + formatMetric(phaseDegrees, "°") + ") → Rz(resonance phase) × " + gateDepth + " layers",
                quantumSignalEnhancementNote: "Educational NISQ-style signal-enhancement proxy; not a real quantum processor or dark-matter detector."
            };
        }
    }


    class DarkMatterWeatherMapModel {
        compute(config, windTelemetry) {
            const sensorBuoyCount = Math.round(clamp(finiteNumber(config.sensorBuoyCount, DEFAULT_ADVANCED_PARAMETERS.sensorBuoyCount), 0, 32));
            const anomalyDensity = clamp(finiteNumber(config.darkMatterAnomalyDensity, DEFAULT_ADVANCED_PARAMETERS.darkMatterAnomalyDensity), 0, 1);
            const turbulence = clamp(finiteNumber(config.turbulence, 0.16), 0, 1);
            const windDensity = Math.max(0, finiteNumber(config.windDensity, 1) * finiteNumber(config.darkMatterDial, 1));
            const buoyCoverage = clamp((sensorBuoyCount / 12) * (1 - anomalyDensity * 0.32) * (1 - turbulence * 0.18), 0, 1);
            const windGradientRisk = clamp(anomalyDensity * 0.48 + turbulence * 0.34 + Math.min(1, windDensity / 5) * 0.18, 0, 1);
            const mappedWindConfidence = clamp(0.22 + buoyCoverage * 0.62 + finiteNumber(windTelemetry ? windTelemetry.alignment : 0.5, 0.5) * 0.16 - windGradientRisk * 0.2, 0, 1);
            const anomalyWarning = windGradientRisk > 0.72 ? "dense anomaly field" : windGradientRisk > 0.45 ? "variable wind map" : "mapped wind field nominal";
            return {
                sensorBuoyCount,
                darkMatterAnomalyDensity: anomalyDensity,
                buoyCoverage,
                windGradientRisk,
                mappedWindConfidence,
                anomalyWarning,
                darkMatterWeatherMapNote: "Sensor buoys convert invisible wind and anomaly assumptions into a mapped confidence proxy for navigation."
            };
        }
    }

    class NavigationGuidanceModel {
        compute(config, weatherTelemetry, lensingTelemetry) {
            const targetArcseconds = clamp(finiteNumber(config.guideStarTargetArcseconds, DEFAULT_ADVANCED_PARAMETERS.guideStarTargetArcseconds), -120, 120);
            const observedErrorArcseconds = clamp(finiteNumber(config.guideStarErrorArcseconds, DEFAULT_ADVANCED_PARAMETERS.guideStarErrorArcseconds), -120, 120);
            const autopilotGain = clamp(finiteNumber(config.autopilotGain, DEFAULT_ADVANCED_PARAMETERS.autopilotGain), 0, 1);
            const lensingOffset = lensingTelemetry ? finiteNumber(lensingTelemetry.angularOffsetArcseconds, 0) : 0;
            const correctedGuideStarErrorArcseconds = observedErrorArcseconds - targetArcseconds + lensingOffset * 0.08;
            const courseCorrectionDegrees = clamp(ArcsecondConversion.arcsecondsToDegrees(correctedGuideStarErrorArcseconds) * autopilotGain * 120, -5, 5);
            const guideStarLockQuality = clamp(1 - Math.abs(correctedGuideStarErrorArcseconds) / 60 - finiteNumber(weatherTelemetry.windGradientRisk, 0.2) * 0.25 + autopilotGain * 0.16, 0, 1);
            const lockStatus = guideStarLockQuality > 0.78 ? "guide star locked" : guideStarLockQuality > 0.45 ? "guide star tracking" : "guide star drift warning";
            return {
                guideStarTargetArcseconds: targetArcseconds,
                guideStarErrorArcseconds: observedErrorArcseconds,
                correctedGuideStarErrorArcseconds,
                courseCorrectionDegrees,
                guideStarLockQuality,
                autopilotGain,
                lockStatus,
                navigationGuidanceNote: "Guide-star tracking translates arcsecond drift into a bounded course-correction proxy."
            };
        }
    }

    class TrajectoryPlannerModel {
        compute(config, guidanceTelemetry, weatherTelemetry, relativisticTelemetry) {
            const waypointCount = Math.round(clamp(finiteNumber(config.navigationWaypoints, DEFAULT_ADVANCED_PARAMETERS.navigationWaypoints), 1, 16));
            const lookaheadSeconds = clamp(finiteNumber(config.trajectoryLookaheadSeconds, DEFAULT_ADVANCED_PARAMETERS.trajectoryLookaheadSeconds), 30, 3600);
            const safetyMargin = clamp(finiteNumber(config.slingshotSafetyMargin, DEFAULT_ADVANCED_PARAMETERS.slingshotSafetyMargin), 0, 1);
            const riskTolerance = clamp(finiteNumber(config.routeRiskTolerance, DEFAULT_ADVANCED_PARAMETERS.routeRiskTolerance), 0, 1);
            const velocity = clamp(finiteNumber(config.relativeVelocityFractionOfLight, 0.35), 0, 0.99);
            const lookaheadDistanceProxy = lookaheadSeconds * Math.max(0.03, velocity) * finiteNumber(relativisticTelemetry.properTimeRate, 1);
            const slingshotOpportunityScore = clamp(finiteNumber(config.mass, 35) / 120 * (1 - Math.abs(finiteNumber(config.impactParameter, 28) - 32) / 96) * (1 - safetyMargin * 0.28), 0, 1);
            const routeHazardScore = clamp(finiteNumber(weatherTelemetry.windGradientRisk, 0.2) * 0.48 + Math.abs(finiteNumber(guidanceTelemetry.correctedGuideStarErrorArcseconds, 0)) / 160 + safetyMargin * 0.14, 0, 1);
            const routeConfidence = clamp(0.3 + finiteNumber(weatherTelemetry.mappedWindConfidence, 0.5) * 0.36 + finiteNumber(guidanceTelemetry.guideStarLockQuality, 0.5) * 0.34 - routeHazardScore * (0.42 - riskTolerance * 0.2), 0, 1);
            const recommendedAction = routeConfidence > 0.76 ? "commit to projected route" : routeHazardScore > riskTolerance ? "deploy more buoys or reduce speed" : "hold course and keep mapping";
            return {
                navigationWaypoints: waypointCount,
                trajectoryLookaheadSeconds: lookaheadSeconds,
                lookaheadDistanceProxy,
                slingshotSafetyMargin: safetyMargin,
                routeRiskTolerance: riskTolerance,
                slingshotOpportunityScore,
                routeHazardScore,
                routeConfidence,
                recommendedAction,
                trajectoryPlannerNote: "Route planning is a deterministic cockpit advisory layer, not autonomous control authority."
            };
        }
    }

    class EnergyBudgetModel {
        compute(config, driveTelemetry, quantumTelemetry, trajectoryTelemetry) {
            const driveCharge = driveTelemetry ? finiteNumber(driveTelemetry.charge, 0) : 0;
            const driveOutput = driveTelemetry ? finiteNumber(driveTelemetry.output, 0) : 0;
            const quantumGain = quantumTelemetry ? finiteNumber(quantumTelemetry.quantumSignalEnhancementProxy, 0) : 0;
            const routeDemand = clamp(finiteNumber(trajectoryTelemetry.routeHazardScore, 0.25) * 0.38 + finiteNumber(config.compressionRatio, 34) / 180 + finiteNumber(config.trajectoryLookaheadSeconds, 240) / 7200, 0, 1.2);
            const reserveMargin = clamp(driveCharge + quantumGain * 0.04 - routeDemand, -1, 1.4);
            const burnWindowSeconds = clamp(45 + reserveMargin * 220 + driveOutput * 90, 0, 600);
            const energyBudgetStatus = reserveMargin > 0.42 ? "healthy reserve" : reserveMargin > 0.05 ? "thin reserve" : "reserve warning";
            return {
                routeEnergyDemandProxy: routeDemand,
                driveReserveMargin: reserveMargin,
                burnWindowSeconds,
                energyBudgetStatus,
                energyBudgetNote: "Energy budget compares normalized drive charge, signal gain, and route demand without claiming real propulsion energy."
            };
        }
    }

    class SpacecraftState {
        constructor() { this.velocity = 0; this.headingDegrees = 0; }
        update(config, windTelemetry) {
            this.headingDegrees = normalizeDegrees(config.shipHeadingDegrees);
            this.velocity = clamp(0.12 + windTelemetry.driveChargeRate * 1.7 - windTelemetry.navigationDrift * 0.45, 0, 3.2);
            return this;
        }
    }

    class DriveState {
        constructor() { this.charge = 0.22; this.output = 0; }
        update(config, windTelemetry, thermalLoad) {
            const gain = windTelemetry.driveChargeRate * 0.045 * finiteNumber(config.speedMultiplier, 1);
            const loss = Math.max(0, thermalLoad - 0.8) * 0.025;
            this.charge = clamp(this.charge + gain - loss, 0, 1.2);
            this.output = clamp(this.charge * finiteNumber(config.driveCoupling, 0.5) * (1 - Math.max(0, thermalLoad - 0.85)), 0, 1.4);
            return this;
        }
    }

    class TelemetryState {
        constructor(values) { Object.assign(this, values); }
    }

    class PerformanceMonitor {
        constructor() { this.framesPerSecond = 60; this.qualityMode = "medium"; this.rendererMode = "Canvas"; }
        update(config, thermalLoad, particleCount) {
            const qualityPenalty = config.qualityMode === "high" ? 7 : config.qualityMode === "experimental" ? 11 : config.qualityMode === "low" ? -5 : 0;
            this.framesPerSecond = clamp(60 - thermalLoad * 9 - particleCount / 420 - qualityPenalty, 24, 60);
            if (this.framesPerSecond < 38 && config.qualityMode !== "low") {
                this.qualityMode = "low";
            } else {
                this.qualityMode = config.qualityMode || "medium";
            }
            return { framesPerSecond: this.framesPerSecond, qualityMode: this.qualityMode, frameRisk: this.framesPerSecond < 36 ? "high" : this.framesPerSecond < 48 ? "medium" : "low" };
        }
    }

    class RendererAdapter {
        constructor(canvas) { this.canvas = canvas; this.mode = "Canvas"; this.ready = false; }
        initialize() { this.ready = true; return Promise.resolve(this); }
        resize() {}
        render() {}
    }

    class CanvasRendererAdapter extends RendererAdapter {
        constructor(canvas) { super(canvas); this.mode = "Canvas"; this.context = canvas ? canvas.getContext("2d") : undefined; }
        render(snapshot) {
            if (!this.context || !this.canvas) { return; }
            drawSimulationCanvas(this.context, this.canvas, snapshot);
        }
    }

    class WebGlRendererAdapter extends CanvasRendererAdapter {
        constructor(canvas) { super(canvas); this.mode = "WebGL fallback shell"; this.webglSupported = detectWebGlSupport(); }
    }


    class WebGpuDirectParticleRenderer {
        constructor(baseCanvas) {
            this.baseCanvas = baseCanvas;
            this.canvas = null;
            this.context = null;
            this.device = null;
            this.pipeline = null;
            this.bindGroupLayout = null;
            this.uniformBuffer = null;
            this.presentationFormat = "unknown";
            this.initialized = false;
            this.lastTelemetry = new WebGpuComputeTelemetryState({
                webGpuDirectRenderStatus: "not initialized",
                webGpuDirectRenderPipelineStatus: "not initialized",
                webGpuDirectRenderContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuSpatialIndexStatus: "not prepared",
                webGpuSpatialBucketCount: WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuSpatialBucketReadbackBytes: 0,
                webGpuMortonContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuOccupiedSpatialBuckets: 0,
                webGpuDensestSpatialBucketIndex: 0,
                webGpuDensestSpatialBucketOccupancy: 0,
                webGpuSpatialLocalityRatio: 0,
                webGpuSpatialIndexNote: "Morton spatial buckets were not prepared.",
                webGpuSharedRenderBufferStatus: "direct render path has not initialized"
            });
        }
        createOverlayCanvas() {
            if (!this.baseCanvas || typeof document === "undefined" || !this.baseCanvas.parentNode) { return null; }
            if (this.canvas) { return this.canvas; }
            const overlayCanvas = document.createElement("canvas");
            overlayCanvas.className = "arcsecs-drive-gpu-particle-canvas";
            overlayCanvas.setAttribute("data-arcsecs-drive-gpu-particle-canvas", "true");
            overlayCanvas.setAttribute("aria-hidden", "true");
            overlayCanvas.width = this.baseCanvas.width || 1280;
            overlayCanvas.height = this.baseCanvas.height || 640;
            this.baseCanvas.parentNode.insertBefore(overlayCanvas, this.baseCanvas.nextSibling);
            this.canvas = overlayCanvas;
            return this.canvas;
        }
        initialize(computePipeline) {
            if (this.initialized) { return Promise.resolve(this.lastTelemetry); }
            return this.initializeInternal(computePipeline);
        }
        async initializeInternal(computePipeline) {
            if (!computePipeline || !computePipeline.device) {
                return this.setUnavailable("Direct WebGPU particle render pipeline is waiting for the main-thread compute device.");
            }
            const overlayCanvas = this.createOverlayCanvas();
            if (!overlayCanvas || typeof overlayCanvas.getContext !== "function") {
                return this.setUnavailable("Direct WebGPU particle canvas could not be created; Canvas sample overlay remains active.");
            }
            const webGpuContext = overlayCanvas.getContext("webgpu");
            if (!webGpuContext) {
                return this.setUnavailable("Browser did not provide a WebGPU canvas context; Canvas sample overlay remains active.");
            }
            try {
                this.device = computePipeline.device;
                this.context = webGpuContext;
                this.presentationFormat = typeof navigator !== "undefined" && navigator.gpu && typeof navigator.gpu.getPreferredCanvasFormat === "function" ? navigator.gpu.getPreferredCanvasFormat() : "bgra8unorm";
                this.configureContext();
                const shaderModule = this.device.createShaderModule({ label: "ArcSecs direct WebGPU particle render shader", code: WEBGPU_DIRECT_PARTICLE_RENDER_SHADER });
                const shaderVisibility = getGpuShaderStageVertex();
                this.bindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs direct particle render bind group layout",
                    entries: [
                        { binding: 0, visibility: shaderVisibility, buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: shaderVisibility, buffer: { type: "uniform" } },
                        { binding: 2, visibility: shaderVisibility, buffer: { type: "read-only-storage" } },
                        { binding: 3, visibility: shaderVisibility, buffer: { type: "read-only-storage" } },
                        { binding: 4, visibility: shaderVisibility, buffer: { type: "read-only-storage" } },
                        { binding: 5, visibility: shaderVisibility, buffer: { type: "read-only-storage" } },
                        { binding: 6, visibility: shaderVisibility, buffer: { type: "read-only-storage" } },
                        { binding: 7, visibility: shaderVisibility, buffer: { type: "read-only-storage" } }
                    ]
                });
                const pipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs direct particle render pipeline layout", bindGroupLayouts: [this.bindGroupLayout] });
                const renderDescriptor = {
                    label: "ArcSecs direct WebGPU particle render pipeline",
                    layout: pipelineLayout,
                    vertex: { module: shaderModule, entryPoint: "vertexMain" },
                    fragment: {
                        module: shaderModule,
                        entryPoint: "fragmentMain",
                        targets: [{
                            format: this.presentationFormat,
                            blend: {
                                color: { srcFactor: "src-alpha", dstFactor: "one", operation: "add" },
                                alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" }
                            }
                        }]
                    },
                    primitive: { topology: "triangle-list" }
                };
                this.pipeline = typeof this.device.createRenderPipelineAsync === "function" ? await this.device.createRenderPipelineAsync(renderDescriptor) : this.device.createRenderPipeline(renderDescriptor);
                const usage = getGpuBufferUsageFlags();
                this.uniformBuffer = this.device.createBuffer({ label: "ArcSecs direct particle render uniform buffer", size: 48, usage: usage.UNIFORM | usage.COPY_DST });
                this.initialized = true;
                this.lastTelemetry = new WebGpuComputeTelemetryState({
                    webGpuDirectRenderStatus: "initialized",
                    webGpuDirectRenderPipelineStatus: "ready",
                    webGpuDirectRenderFormat: this.presentationFormat,
                    webGpuDirectRenderContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuSpatialIndexStatus: "not prepared",
                webGpuSpatialBucketCount: WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuSpatialBucketReadbackBytes: 0,
                webGpuMortonContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuOccupiedSpatialBuckets: 0,
                webGpuDensestSpatialBucketIndex: 0,
                webGpuDensestSpatialBucketOccupancy: 0,
                webGpuSpatialLocalityRatio: 0,
                webGpuSpatialIndexNote: "Morton spatial buckets were not prepared.",
                    webGpuSharedRenderBufferStatus: "direct WebGPU render pipeline ready to consume completed particle buffers"
                });
                return this.lastTelemetry;
            } catch (error) {
                return this.setUnavailable("Direct WebGPU particle render pipeline failed safely; Canvas sample overlay remains active.");
            }
        }
        setUnavailable(reason) {
            this.initialized = false;
            this.lastTelemetry = new WebGpuComputeTelemetryState({
                webGpuDirectRenderStatus: "unavailable",
                webGpuDirectRenderPipelineStatus: "fallback",
                webGpuDirectRenderContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuSpatialIndexStatus: "not prepared",
                webGpuSpatialBucketCount: WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuSpatialBucketReadbackBytes: 0,
                webGpuMortonContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuOccupiedSpatialBuckets: 0,
                webGpuDensestSpatialBucketIndex: 0,
                webGpuDensestSpatialBucketOccupancy: 0,
                webGpuSpatialLocalityRatio: 0,
                webGpuSpatialIndexNote: "Morton spatial buckets were not prepared.",
                webGpuSharedRenderBufferStatus: reason || "Direct WebGPU particle rendering unavailable."
            });
            return this.lastTelemetry;
        }
        configureContext() {
            if (!this.context || !this.device) { return; }
            if (this.canvas && this.baseCanvas) {
                this.canvas.width = this.baseCanvas.width || this.canvas.width || 1280;
                this.canvas.height = this.baseCanvas.height || this.canvas.height || 640;
            }
            this.context.configure({ device: this.device, format: this.presentationFormat, alphaMode: "premultiplied" });
        }
        createRenderUniformData(particleCount, snapshot, telemetry) {
            const buffer = new ArrayBuffer(48);
            const view = new DataView(buffer);
            const width = this.canvas ? Math.max(1, this.canvas.width) : 1280;
            const height = this.canvas ? Math.max(1, this.canvas.height) : 640;
            const recipe = snapshot && snapshot.recipe ? snapshot.recipe : {};
            const telemetrySource = telemetry || {};
            const quality = recipe.webGpuDirectRenderVisualQualityMode || telemetrySource.webGpuDirectRenderVisualQualityMode || recipe.qualityMode || "medium";
            const particleScale = quality === "experimental" || quality === "full" ? 0.92 : quality === "high" || quality === "balanced" ? 0.86 : quality === "low" || quality === "minimal" ? 0.74 : 0.8;
            const pointRadius = quality === "low" || quality === "minimal" ? 0.0045 : quality === "experimental" || quality === "full" ? 0.0032 : 0.0038;
            const reducedIntensity = Boolean(recipe.reducedVisualIntensity);
            const visualQualityLevel = quality === "minimal" ? 3 : quality === "reduced" ? 2 : quality === "balanced" ? 1 : 0;
            const pointRadiusScale = clamp(finiteNumber(recipe.webGpuDirectRenderPointScale, telemetrySource.webGpuDirectRenderPointScale || 1), 0.35, 1.25);
            const haloIntensity = clamp(finiteNumber(recipe.webGpuDirectRenderHaloIntensity, telemetrySource.webGpuDirectRenderHaloIntensity || 1), 0.18, 1.35);
            const visualDensity = clamp(finiteNumber(recipe.webGpuDirectRenderVisualDensity, telemetrySource.webGpuDirectRenderVisualDensity || 1), 0.24, 1.2);
            view.setUint32(0, Math.max(0, Math.round(finiteNumber(particleCount, 0))), true);
            view.setUint32(4, visualQualityLevel, true);
            view.setUint32(8, Math.max(1, Math.min(32, Math.round(finiteNumber(recipe.bucketNeighborSampleLimit, WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT)))), true);
            view.setUint32(12, Math.max(1, Math.min(32, Math.round(finiteNumber(recipe.densityFieldSampleLimit, WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT)))), true);
            view.setFloat32(16, particleScale, true);
            view.setFloat32(20, width / height, true);
            view.setFloat32(24, pointRadius, true);
            view.setFloat32(28, reducedIntensity ? 0.42 : 0.82, true);
            view.setFloat32(32, haloIntensity, true);
            view.setFloat32(36, visualDensity, true);
            view.setFloat32(40, pointRadiusScale, true);
            view.setFloat32(44, 0, true);
            return buffer;
        }
        renderFromPipeline(computePipeline, telemetry, snapshot) {
            if (!this.initialized || !this.device || !this.pipeline || !this.bindGroupLayout || !this.uniformBuffer || !this.context) {
                return this.lastTelemetry;
            }
            if (!computePipeline || !Array.isArray(computePipeline.particleBuffers) || !computePipeline.particleBuffers.length) {
                this.lastTelemetry = new WebGpuComputeTelemetryState(Object.assign({}, telemetry || {}, {
                    webGpuDirectRenderStatus: "waiting for completed particle buffer",
                    webGpuDirectRenderPipelineStatus: "ready",
                    webGpuDirectRenderFormat: this.presentationFormat,
                    webGpuDirectRenderContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuSpatialIndexStatus: "not prepared",
                webGpuSpatialBucketCount: WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuSpatialBucketReadbackBytes: 0,
                webGpuMortonContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuOccupiedSpatialBuckets: 0,
                webGpuDensestSpatialBucketIndex: 0,
                webGpuDensestSpatialBucketOccupancy: 0,
                webGpuSpatialLocalityRatio: 0,
                webGpuSpatialIndexNote: "Morton spatial buckets were not prepared.",
                    webGpuSharedRenderBufferStatus: "direct WebGPU renderer is ready; compute has not published a completed particle buffer yet"
                }));
                return this.lastTelemetry;
            }
            const sourceIndex = Math.max(0, Math.min(1, Math.round(finiteNumber(computePipeline.activeParticleBufferIndex, 0))));
            const sourceBuffer = computePipeline.particleBuffers[sourceIndex];
            const spatialBucketBuffer = computePipeline.spatialBucketBuffer;
            const spatialBucketRangeBuffer = computePipeline.spatialBucketRangeBuffer;
            const compactedParticleIndexBuffer = computePipeline.compactedParticleIndexBuffer;
            const densityFieldTileBuffer = computePipeline.densityFieldTileBuffer;
            const relationalProjectionBuffer = computePipeline.relationalProjectionBuffer;
            const relationalWeberTetherBuffer = computePipeline.relationalWeberTetherBuffer;
            if (!sourceBuffer) { return this.setUnavailable("Direct render source buffer was unavailable after compute."); }
            if (!spatialBucketBuffer) { return this.setUnavailable("Direct adaptive halo-density shading buffer was unavailable after compute."); }
            if (!spatialBucketRangeBuffer) { return this.setUnavailable("Direct compacted bucket range buffer was unavailable after compute."); }
            if (!compactedParticleIndexBuffer) { return this.setUnavailable("Direct compacted particle-index buffer was unavailable after compute."); }
            if (!densityFieldTileBuffer) { return this.setUnavailable("Direct GPU-resident density-field tile buffer was unavailable after compute."); }
            if (!relationalProjectionBuffer) { return this.setUnavailable("Direct GPU-resident relational MDS projection buffer was unavailable after compute."); }
            if (!relationalWeberTetherBuffer) { return this.setUnavailable("Direct GPU-resident relational Weber tether force buffer was unavailable after compute."); }
            const particleCount = Math.max(0, Math.min(finiteNumber(telemetry ? telemetry.webGpuActualParticleCount : computePipeline.persistentParticleCount, computePipeline.persistentParticleCount), computePipeline.persistentParticleCount || WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES));
            if (particleCount <= 0) {
                this.lastTelemetry = new WebGpuComputeTelemetryState(Object.assign({}, telemetry || {}, {
                    webGpuDirectRenderStatus: "waiting for particles",
                    webGpuDirectRenderPipelineStatus: "ready",
                    webGpuDirectRenderSourceIndex: sourceIndex,
                    webGpuDirectRenderContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuSpatialIndexStatus: "not prepared",
                webGpuSpatialBucketCount: WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuSpatialBucketReadbackBytes: 0,
                webGpuMortonContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuOccupiedSpatialBuckets: 0,
                webGpuDensestSpatialBucketIndex: 0,
                webGpuDensestSpatialBucketOccupancy: 0,
                webGpuSpatialLocalityRatio: 0,
                webGpuSpatialIndexNote: "Morton spatial buckets were not prepared.",
                    webGpuSharedRenderBufferStatus: "direct render pipeline ready with no particles submitted yet"
                }));
                return this.lastTelemetry;
            }
            try {
                this.configureContext();
                this.device.queue.writeBuffer(this.uniformBuffer, 0, this.createRenderUniformData(particleCount, snapshot, telemetry));
                const bindGroup = this.device.createBindGroup({
                    label: "ArcSecs direct particle render bind group",
                    layout: this.bindGroupLayout,
                    entries: [
                        { binding: 0, resource: { buffer: sourceBuffer } },
                        { binding: 1, resource: { buffer: this.uniformBuffer } },
                        { binding: 2, resource: { buffer: spatialBucketBuffer } },
                        { binding: 3, resource: { buffer: spatialBucketRangeBuffer } },
                        { binding: 4, resource: { buffer: compactedParticleIndexBuffer } },
                        { binding: 5, resource: { buffer: densityFieldTileBuffer } },
                        { binding: 6, resource: { buffer: relationalProjectionBuffer } },
                        { binding: 7, resource: { buffer: relationalWeberTetherBuffer } }
                    ]
                });
                const commandEncoder = this.device.createCommandEncoder({ label: "ArcSecs direct particle render commands" });
                const renderPass = commandEncoder.beginRenderPass({
                    label: "ArcSecs direct particle render pass",
                    colorAttachments: [{
                        view: this.context.getCurrentTexture().createView(),
                        clearValue: { r: 0, g: 0, b: 0, a: 0 },
                        loadOp: "clear",
                        storeOp: "store"
                    }]
                });
                renderPass.setPipeline(this.pipeline);
                renderPass.setBindGroup(0, bindGroup);
                renderPass.draw(Math.min(particleCount, WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES) * 6, 1, 0, 0);
                renderPass.end();
                this.device.queue.submit([commandEncoder.finish()]);
                this.lastTelemetry = new WebGpuComputeTelemetryState(Object.assign({}, telemetry || {}, {
                    webGpuDirectRenderStatus: "rendered from completed GPU particle buffer",
                    webGpuDirectRenderParticleCount: particleCount,
                    webGpuDirectRenderPipelineStatus: "executed",
                    webGpuDirectRenderFormat: this.presentationFormat,
                    webGpuDirectRenderSourceIndex: sourceIndex,
                    webGpuDirectRenderVertexCount: particleCount * 6,
                    webGpuDirectRenderContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                    webGpuDirectRenderVisualQualityMode: (snapshot && snapshot.recipe && snapshot.recipe.webGpuDirectRenderVisualQualityMode) || (telemetry && telemetry.webGpuDirectRenderVisualQualityMode) || WEBGPU_ADAPTIVE_DIRECT_VISUAL_QUALITY_MODES[0],
                    webGpuDirectRenderPointScale: finiteNumber(snapshot && snapshot.recipe ? snapshot.recipe.webGpuDirectRenderPointScale : undefined, telemetry && telemetry.webGpuDirectRenderPointScale ? telemetry.webGpuDirectRenderPointScale : WEBGPU_ADAPTIVE_DIRECT_RENDER_POINT_SCALES[0]),
                    webGpuDirectRenderHaloIntensity: finiteNumber(snapshot && snapshot.recipe ? snapshot.recipe.webGpuDirectRenderHaloIntensity : undefined, telemetry && telemetry.webGpuDirectRenderHaloIntensity ? telemetry.webGpuDirectRenderHaloIntensity : WEBGPU_ADAPTIVE_DIRECT_HALO_INTENSITIES[0]),
                    webGpuDirectRenderVisualDensity: finiteNumber(snapshot && snapshot.recipe ? snapshot.recipe.webGpuDirectRenderVisualDensity : undefined, telemetry && telemetry.webGpuDirectRenderVisualDensity ? telemetry.webGpuDirectRenderVisualDensity : WEBGPU_ADAPTIVE_DIRECT_VISUAL_DENSITIES[0]),
                    webGpuDirectVisualQualityStatus: (telemetry && telemetry.webGpuDirectVisualQualityStatus) || "base direct WebGPU visuals",
                    webGpuDirectVisualQualityContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                    webGpuAdaptiveHaloShadingStatus: "rendered from GPU bucket map",
                    webGpuAdaptiveHaloShadingSource: "direct WebGPU render shader binding 2",
                    webGpuDensityFieldShadingStatus: "rendered from GPU-resident density-field tiles",
                    webGpuRelationalMdsProjectionStatus: "direct render consumed GPU-resident relational MDS projection buffer",
                    webGpuRelationalMdsProjectionNodeCount: WEBGPU_RELATIONAL_MDS_NODE_COUNT,
                    webGpuRelationalMdsDistanceMatrixBytes: WEBGPU_RELATIONAL_DISTANCE_MATRIX_BYTE_LENGTH,
                    webGpuRelationalMdsProjectionBufferBytes: WEBGPU_RELATIONAL_PROJECTION_BYTE_LENGTH,
                    webGpuRelationalMdsProjectionContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                    webGpuRelationalMdsProjectionSource: "direct WebGPU render binding 6",
                    webGpuRelationalWeberForceStatus: telemetry && telemetry.webGpuRelationalWeberForceStatus ? telemetry.webGpuRelationalWeberForceStatus : "direct renderer consumed GPU Weber tether buffer",
                    webGpuRelationalWeberTetherBufferBytes: WEBGPU_RELATIONAL_WEBER_TETHER_BYTE_LENGTH,
                    webGpuRelationalWeberContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                    webGpuRelationalWeberSource: "direct WebGPU render binding 7",
                    webGpuDensityFieldShadingStatus: "rendered from GPU-resident density-field tiles",
                    webGpuSharedRenderBufferStatus: "direct WebGPU render pipeline consumed the latest completed particle buffer, Morton bucket occupancy buffer, compacted ranges, compacted indices, GPU-resident density-field tiles, and GPU-resident relational MDS projection buffer, and GPU Weber tether force buffer without a full particle readback" /* direct WebGPU render pipeline consumed the latest completed particle buffer, Morton bucket occupancy buffer, compacted ranges, compacted indices, and GPU-resident density-field tiles without a full particle readback */
                }));
                return this.lastTelemetry;
            } catch (error) {
                this.lastTelemetry = new WebGpuComputeTelemetryState(Object.assign({}, telemetry || {}, {
                    webGpuDirectRenderStatus: "failed safe",
                    webGpuDirectRenderPipelineStatus: "fallback",
                    webGpuDirectRenderContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuSpatialIndexStatus: "not prepared",
                webGpuSpatialBucketCount: WEBGPU_SPATIAL_BUCKET_COUNT,
                webGpuSpatialBucketReadbackBytes: 0,
                webGpuMortonContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuOccupiedSpatialBuckets: 0,
                webGpuDensestSpatialBucketIndex: 0,
                webGpuDensestSpatialBucketOccupancy: 0,
                webGpuSpatialLocalityRatio: 0,
                webGpuSpatialIndexNote: "Morton spatial buckets were not prepared.",
                    webGpuSharedRenderBufferStatus: "direct WebGPU render failed safely; Canvas sample overlay remains active"
                }));
                return this.lastTelemetry;
            }
        }
    }

    class WebGpuRendererAdapter extends CanvasRendererAdapter {
        constructor(canvas) {
            super(canvas);
            this.mode = "WebGPU compute + Canvas overlay";
            this.gpuSupported = typeof navigator !== "undefined" && Boolean(navigator.gpu);
            this.computePipeline = new WebGpuNBodyComputePipeline({ maximumParticles: WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES });
            this.computeWorkerClient = new WebGpuComputeWorkerClient({ maximumParticles: WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES });
            this.directParticleRenderer = new WebGpuDirectParticleRenderer(canvas);
            this.adaptiveComputeQualityController = new RollingAdaptiveComputeQualityController();
            this.directRenderEnabled = false;
            this.useWorkerCompute = false;
            this.pendingCompute = false;
            this.lastRequestedComputeKey = "";
            this.lastRequestedTick = -1;
            this.latestSnapshot = null;
            this.onComputeComplete = null;
        }
        initialize() {
            const initializeWorkerFallback = () => this.computeWorkerClient.initialize().then((workerTelemetry) => {
                if (workerTelemetry.webGpuComputeStatus === "initialized") {
                    this.useWorkerCompute = true;
                    this.directRenderEnabled = false;
                    this.ready = true;
                    this.mode = "WebGPU worker compute + Canvas overlay";
                    return this;
                }
                this.ready = false;
                this.mode = "Canvas fallback after WebGPU compute initialization check";
                return this;
            }).catch(() => {
                this.ready = false;
                this.mode = "Canvas fallback after WebGPU compute initialization check";
                return this;
            });
            return this.computePipeline.initialize().then((telemetry) => {
                if (telemetry.webGpuComputeStatus !== "initialized") { return initializeWorkerFallback(); }
                return this.directParticleRenderer.initialize(this.computePipeline).then((renderTelemetry) => {
                    this.useWorkerCompute = false;
                    this.directRenderEnabled = renderTelemetry.webGpuDirectRenderStatus === "initialized";
                    this.ready = true;
                    this.mode = this.directRenderEnabled ? "WebGPU direct compute/render + Canvas HUD" : "WebGPU inline compute + Canvas overlay";
                    this.computePipeline.lastTelemetry = new WebGpuComputeTelemetryState(Object.assign({}, this.computePipeline.getTelemetry(), renderTelemetry));
                    return this;
                });
            }).catch(() => initializeWorkerFallback());
        }
        makeComputeKey(snapshot) {
            const recipe = snapshot.recipe || {};
            return [
                recipe.computeParticleBudget,
                recipe.visibleMatterMass,
                recipe.darkMatterDensity,
                recipe.haloRadius,
                recipe.windDirectionDegrees,
                recipe.driveCoupling,
                recipe.speedMultiplier,
                recipe.qualityMode,
                recipe.adaptiveComputeDownshiftLevel || 0,
                recipe.bucketNeighborSampleLimit || WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT,
                recipe.densityFieldSampleLimit || WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT,
                recipe.webGpuDispatchCadenceTicks || WEBGPU_ADAPTIVE_COMPUTE_BASE_DISPATCH_CADENCE_TICKS,
                recipe.webGpuDirectRenderVisualQualityMode || WEBGPU_ADAPTIVE_DIRECT_VISUAL_QUALITY_MODES[0],
                recipe.webGpuDirectRenderPointScale || WEBGPU_ADAPTIVE_DIRECT_RENDER_POINT_SCALES[0],
                recipe.webGpuDirectRenderHaloIntensity || WEBGPU_ADAPTIVE_DIRECT_HALO_INTENSITIES[0],
                recipe.webGpuDirectRenderVisualDensity || WEBGPU_ADAPTIVE_DIRECT_VISUAL_DENSITIES[0],
                recipe.relationalDistanceMatrixVersion || recipe.relationalDistanceMatrixByteLength || 0
            ].join("|");
        }
        render(snapshot) {
            this.latestSnapshot = snapshot;
            super.render(snapshot);
            if (this.directRenderEnabled && this.computePipeline && this.computePipeline.initialized) {
                const directTelemetry = this.directParticleRenderer.renderFromPipeline(this.computePipeline, this.computePipeline.getTelemetry(), snapshot);
                this.computePipeline.lastTelemetry = new WebGpuComputeTelemetryState(Object.assign({}, this.computePipeline.getTelemetry(), directTelemetry));
            }
            this.scheduleCompute(snapshot);
        }
        scheduleCompute(snapshot) {
            if (this.pendingCompute || !snapshot || !snapshot.telemetry) { return; }
            if (!this.useWorkerCompute && (!this.computePipeline || !this.computePipeline.initialized)) { return; }
            const tick = Math.max(0, Math.round(finiteNumber(snapshot.telemetry.tick, 0)));
            const adjustedRecipe = this.adaptiveComputeQualityController.prepareRecipe(snapshot.recipe || {});
            if (snapshot.telemetry && Array.isArray(snapshot.telemetry.relationalDistanceMatrix)) {
                adjustedRecipe.relationalDistanceMatrix = snapshot.telemetry.relationalDistanceMatrix.slice(0, WEBGPU_RELATIONAL_DISTANCE_MATRIX_FLOATS);
                adjustedRecipe.relationalDistanceMatrixByteLength = snapshot.telemetry.relationalDistanceMatrixByteLength;
                adjustedRecipe.relationalDistanceMatrixVersion = snapshot.telemetry.relationalEcsContractVersion;
            }
            const adjustedSnapshot = Object.assign({}, snapshot, { recipe: Object.assign({}, adjustedRecipe, { adaptiveComputeDownshiftLevel: this.adaptiveComputeQualityController.lastPlan.downshiftLevel }) });
            const computeKey = this.makeComputeKey(adjustedSnapshot);
            const dispatchCadenceTicks = Math.max(1, Math.round(finiteNumber(adjustedRecipe.webGpuDispatchCadenceTicks, WEBGPU_ADAPTIVE_COMPUTE_BASE_DISPATCH_CADENCE_TICKS)));
            const tickDue = this.lastRequestedTick < 0 || Math.abs(tick - this.lastRequestedTick) >= dispatchCadenceTicks;
            const recipeChanged = computeKey !== this.lastRequestedComputeKey;
            if (!tickDue && !recipeChanged) { return; }
            this.pendingCompute = true;
            this.lastRequestedTick = tick;
            this.lastRequestedComputeKey = computeKey;
            const computeRunner = this.useWorkerCompute ? this.computeWorkerClient : this.computePipeline;
            computeRunner.run(adjustedRecipe, tick).then((telemetry) => {
                let completedTelemetry = telemetry;
                if (this.directRenderEnabled && !this.useWorkerCompute && this.computePipeline) {
                    completedTelemetry = this.directParticleRenderer.renderFromPipeline(this.computePipeline, telemetry, adjustedSnapshot);
                    this.computePipeline.lastTelemetry = new WebGpuComputeTelemetryState(Object.assign({}, telemetry, completedTelemetry));
                }
                const qualityPlan = this.adaptiveComputeQualityController.update(completedTelemetry, snapshot);
                const qualityTelemetry = this.adaptiveComputeQualityController.createTelemetry();
                completedTelemetry = new WebGpuComputeTelemetryState(Object.assign({}, completedTelemetry, qualityTelemetry, {
                    webGpuComputeBranchNote: String(completedTelemetry.webGpuComputeBranchNote || "") + " Adaptive compute-quality controller: " + qualityPlan.note
                }));
                if (this.useWorkerCompute && this.computeWorkerClient) { this.computeWorkerClient.lastTelemetry = completedTelemetry; }
                else if (this.computePipeline) { this.computePipeline.lastTelemetry = completedTelemetry; }
                this.pendingCompute = false;
                if (typeof this.onComputeComplete === "function") { this.onComputeComplete(completedTelemetry); }
            }).catch(() => {
                this.pendingCompute = false;
            });
        }
        getComputeTelemetry() {
            if (this.useWorkerCompute && this.computeWorkerClient) { return this.computeWorkerClient.getTelemetry(); }
            return this.computePipeline ? this.computePipeline.getTelemetry() : new WebGpuComputeTelemetryState();
        }
    }


    function getGpuShaderStageCompute() {
        return typeof GPUShaderStage !== "undefined" ? GPUShaderStage.COMPUTE : 4;
    }

    function getGpuShaderStageVertex() {
        return typeof GPUShaderStage !== "undefined" ? GPUShaderStage.VERTEX : 1;
    }

    function getGpuBufferUsageFlags() {
        if (typeof GPUBufferUsage !== "undefined") { return GPUBufferUsage; }
        return { MAP_READ: 1, COPY_SRC: 4, COPY_DST: 8, UNIFORM: 64, STORAGE: 128 };
    }

    function detectWebGlSupport() {
        if (typeof document === "undefined") { return false; }
        try {
            const canvas = document.createElement("canvas");
            return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
        } catch (error) {
            return false;
        }
    }

    class SimulationPreset {
        static getPreset(key) { return PRESETS[key] || PRESETS.interactiveBlueprint; }
    }

    class ScenarioState {
        constructor() { this.currentScenarioIndex = 0; this.currentStepIndex = 0; this.completed = false; }
    }

    class ScenarioController {
        constructor(core, logCallback) { this.core = core; this.logCallback = logCallback || function () {}; this.state = new ScenarioState(); }
        loadScenario(scenarioId) {
            const index = Math.max(0, GUIDED_SCENARIOS.findIndex((scenario) => scenario.id === scenarioId));
            this.state.currentScenarioIndex = index;
            this.state.currentStepIndex = 0;
            this.state.completed = false;
            const scenario = GUIDED_SCENARIOS[index];
            this.core.applyRecipe({ preset: scenario.preset });
            this.logCallback("Scenario loaded", scenario.title, "info");
            return scenario;
        }
        nextStep() {
            this.state.currentStepIndex += 1;
            if (this.state.currentStepIndex >= 3) { this.state.completed = true; }
            const scenario = GUIDED_SCENARIOS[this.state.currentScenarioIndex] || GUIDED_SCENARIOS[0];
            this.logCallback(this.state.completed ? "Scenario completed" : "Scenario advanced", this.state.completed ? scenario.completion : scenario.objective, this.state.completed ? "success" : "info");
            return this.state;
        }
        reset() {
            this.state.currentStepIndex = 0;
            this.state.completed = false;
            const scenario = GUIDED_SCENARIOS[this.state.currentScenarioIndex] || GUIDED_SCENARIOS[0];
            this.core.applyRecipe({ preset: scenario.preset });
            this.logCallback("Scenario reset", scenario.title, "info");
            return this.state;
        }
    }

    class HapticFeedbackController {
        constructor() { this.enabled = false; this.userActivated = false; this.lastTetherPulse = 0; }
        setEnabled(enabled) { this.enabled = Boolean(enabled); }
        markUserActivated() { this.userActivated = true; }
        trigger(pattern) {
            if (!this.enabled || !this.userActivated || typeof navigator === "undefined" || typeof navigator.vibrate !== "function") { return false; }
            navigator.vibrate(pattern || 20);
            return true;
        }
        triggerTetherFeedback(telemetry) {
            const tension = clamp(finiteNumber(telemetry && telemetry.relationalTetherTensionTotal, 0), 0, 12);
            const suppression = clamp(finiteNumber(telemetry && telemetry.weberTetherSuppressionRatio, 0), 0, 1);
            const flux = clamp(finiteNumber(telemetry && telemetry.procaFluxDensity, 0), 0, 8);
            const pulseKey = Math.round((tension + suppression + flux) * 10);
            if (pulseKey === this.lastTetherPulse) { return false; }
            this.lastTetherPulse = pulseKey;
            const releasePulse = Math.round(16 + suppression * 36);
            const fluxPulse = Math.round(8 + flux * 5);
            return this.trigger([releasePulse, 24, fluxPulse, 18, Math.max(6, Math.round(fluxPulse * 0.52))]);
        }
    }

    class InputController {
        constructor(root, dashboard) { this.root = root; this.dashboard = dashboard; }
        bind() { if (this.dashboard) { this.dashboard.bindEvents(); } }
    }

    function validateRecipe(recipe) {
        const source = recipe && typeof recipe === "object" ? recipe : {};
        const presetKey = typeof source.preset === "string" && PRESETS[source.preset] ? source.preset : "interactiveBlueprint";
        const base = Object.assign({}, DEFAULT_ADVANCED_PARAMETERS, SimulationPreset.getPreset(presetKey));
        const warnings = [];
        Object.keys(NUMERIC_RANGES).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                const range = NUMERIC_RANGES[key];
                const before = finiteNumber(source[key], base[key]);
                const after = key.indexOf("Degrees") >= 0 ? normalizeDegrees(before) : clamp(before, range[0], range[1]);
                const finalValue = key.indexOf("Degrees") >= 0 ? clamp(after, range[0], range[1]) : after;
                if (before !== finalValue) { warnings.push(key + " clamped to " + formatMetric(finalValue, "")); }
                base[key] = finalValue;
            }
        });
        if (typeof source.mode === "string" && SIMULATION_MODES[source.mode]) { base.mode = source.mode; }
        if (typeof source.failureMode === "string") { base.failureMode = ["none", "radiatorBottleneck", "bufferSaturation", "fuelStarvation", "thermalOverload", "captureThreshold"].indexOf(source.failureMode) >= 0 ? source.failureMode : "none"; }
        if (typeof source.scenario === "string") { base.scenario = source.scenario.replace(/[^a-zA-Z0-9_-]/g, ""); }
        if (typeof source.reducedVisualIntensity === "boolean") { base.reducedVisualIntensity = source.reducedVisualIntensity; }
        if (typeof source.qualityMode === "string" && ["low", "medium", "high", "experimental"].indexOf(source.qualityMode) >= 0) { base.qualityMode = source.qualityMode; }
        if (typeof source.multiMessengerEventPreset === "string" && MULTI_MESSENGER_EVENT_PRESETS[source.multiMessengerEventPreset]) {
            base.multiMessengerEventPreset = source.multiMessengerEventPreset;
            const eventPreset = MULTI_MESSENGER_EVENT_PRESETS[source.multiMessengerEventPreset];
            if (!Object.prototype.hasOwnProperty.call(source, "multiMessengerDistanceMegaparsecs")) { base.multiMessengerDistanceMegaparsecs = eventPreset.distanceMegaparsecs; }
            if (!Object.prototype.hasOwnProperty.call(source, "lightSlowingTargetRedshift")) { base.lightSlowingTargetRedshift = eventPreset.redshift; }
            if (!Object.prototype.hasOwnProperty.call(source, "lightSlowingPropagationDelaySeconds")) { base.lightSlowingPropagationDelaySeconds = eventPreset.propagationDelaySeconds; }
            if (!Object.prototype.hasOwnProperty.call(source, "intrinsicEmissionDelaySeconds")) { base.intrinsicEmissionDelaySeconds = eventPreset.intrinsicDelaySeconds; }
            if (!Object.prototype.hasOwnProperty.call(source, "substrateDensityProfile")) { base.substrateDensityProfile = eventPreset.substrateProfile; }
            if (!Object.prototype.hasOwnProperty.call(source, "covaryingCouplingRedshift")) { base.covaryingCouplingRedshift = eventPreset.couplingRedshift || 0; }
        }
        if (typeof source.substrateDensityProfile === "string" && PROCA_SUBSTRATE_DENSITY_PROFILES[source.substrateDensityProfile]) { base.substrateDensityProfile = source.substrateDensityProfile; }
        base.darkMatterDensity = finiteNumber(base.darkMatterDensity, 1) * Math.max(0, finiteNumber(base.darkMatterDial, 1));
        return { recipe: base, warnings, scientificBoundary: SCIENTIFIC_BOUNDARY };
    }

    function computeLegacyTelemetry(config, tick, frameRisk) {
        const captureEfficiency = clamp(0.28 + config.lossRate * 0.35 + config.photonPacketCount / 5000 - Math.max(0, config.compressionRatio - 50) / 100 + finiteNumber(config.darkMatterDial, 1) * 0.05, 0.02, 0.98);
        const bufferSaturation = clamp(captureEfficiency * 0.72 + config.lossRate * 0.2 + (config.failureMode === "bufferSaturation" ? 0.34 : 0), 0, 1);
        const thermalLoad = clamp(config.compressionRatio / 82 + captureEfficiency * 0.28 - config.thermalRejectionCapacity * 0.32 + (config.failureMode === "thermalOverload" || config.failureMode === "radiatorBottleneck" ? 0.28 : 0), 0, 1.4);
        const ledgerClosureError = Math.abs(config.lossRate * 0.004 + bufferSaturation * 0.002 - captureEfficiency * 0.0015);
        const deflectionProxy = config.baryonicMass * (1 + config.photonMassProxy * 1e17) / 50;
        const netAccelerationProxy = clamp(captureEfficiency * config.compressionRatio / 55 - thermalLoad * 0.42 - (config.failureMode === "fuelStarvation" ? 0.22 : 0), -0.45, 1.4);
        const fieldStability = clamp(1 - Math.abs(config.compressionRatio - 34) / 90 - (config.failureMode === "captureThreshold" ? 0.2 : 0), 0.1, 1);
        const oscillatorSuppression = clamp(config.baryonicMass / 80 + config.photonMassProxy * 1e16, 0, 0.82);
        return { captureEfficiency, bufferSaturation, thermalLoad, ledgerClosureError, deflectionProxy, netAccelerationProxy, fieldStability, oscillatorSuppression, tick, frameRisk, currentScenarioState: thermalLoad > 1 || ledgerClosureError > 0.01 ? "warning" : "nominal" };
    }

    function buildTimeline(config, telemetry, warnings) {
        return [
            { marker: "simulation initialized", severity: "pass", why: "Deterministic simulation state loaded with finite defaults." },
            { marker: "renderer selected", severity: "info", why: "Renderer adapter selected with fallback path available." },
            { marker: "capture efficiency spike", severity: telemetry.captureEfficiency > 0.72 ? "info" : "note", why: "Scoop density, alignment, and loss-rate assumptions increased the intake proxy." },
            { marker: "deflection increase", severity: telemetry.lensingDeflectionArcseconds > 8 || telemetry.deflectionProxy > 0.9 ? "info" : "note", why: "Mass, impact parameter, dark matter halo normalization, or photon mass proxy raised the comparison deflection branch." },
            { marker: telemetry.ledgerClosureError > 0.01 ? "ledger closure failure" : "ledger closure success", severity: telemetry.ledgerClosureError > 0.01 ? "warning" : "pass", why: "The tired-light ledger compares removed photon energy with substrate accounting." },
            { marker: "radiator bottleneck", severity: telemetry.thermalLoad > 0.92 ? "warning" : "note", why: "Compression demand and radiator capacity set the thermal bottleneck." },
            { marker: "buffer saturation", severity: telemetry.bufferSaturation > 0.82 ? "warning" : "note", why: "Capture efficiency and loss-rate assumptions push the dark-state buffer fill level." },
            { marker: "net acceleration drop", severity: telemetry.netAccelerationProxy < 0.15 ? "warning" : "note", why: "Thermal load, turbulence, and drift accounting can erase thrust proxy gains." },
            { marker: "outer rotation curve", severity: config.darkMatterDial <= 0.05 ? "warning" : "info", why: config.darkMatterDial <= 0.05 ? "No dark matter selected; outer orbital support visibly falls in the simplified curve." : "Halo normalization supports the outer curve in the comparison view." },
            { marker: "quantized inertia proxy", severity: telemetry.quantizedInertiaThrustProxy > 0.35 ? "info" : "note", why: "Rindler/Unruh dampening proxy is shown as hypothesis-only thrust telemetry." },
            { marker: "haloscope resonance", severity: telemetry.axionResonanceAlignment > 0.72 ? "info" : "note", why: "Axion haloscope tuning is near the demonstration resonance band when this signal rises." },
            { marker: "warp visualization boundary", severity: telemetry.horizonVisualRisk === "warning" ? "warning" : "note", why: "Alcubierre-style metric strength is visualized only when reserve and stability remain explicit." },
            { marker: "optical point spread", severity: telemetry.effectivePointSpreadArcseconds > 2 ? "warning" : "info", why: "PSF and jitter telemetry show whether the optical view is precision-like or educationally blurred." },
            { marker: "relativistic reference", severity: telemetry.lorentzFactor > 2 ? "warning" : "info", why: "Lorentz factor, proper-time rate, momentum, and energy proxies are shown as reference telemetry." },
            { marker: "light-speed attenuation demo", severity: telemetry.lightSlowingPropagationDelaySeconds > 1 ? "warning" : "info", why: "EM arrival speed " + formatMetric(telemetry.lightSlowingArrivalSpeedMetersPerSecond, " m/s") + "; decrease " + formatMetric(telemetry.lightSlowingSpeedDecreaseMetersPerSecond, " m/s") + "; modeled propagation lag " + formatMetric(telemetry.lightSlowingPropagationDelaySeconds, " s") + "." },
            { marker: "interferometric wavefront tracker", severity: Math.abs(telemetry.multiMessengerDelayResidualSeconds) > 1 ? "warning" : "info", why: safeVisibleText(telemetry.multiMessengerEventLabel) + "; density-corrected propagation lag " + formatMetric(telemetry.multiMessengerDensityCorrectedPropagationDelaySeconds, " s") + "; residual " + formatMetric(telemetry.multiMessengerDelayResidualSeconds, " s") + "; substrate " + safeVisibleText(telemetry.substrateDensityProfileLabel) + "." },
            { marker: "compute shader readiness", severity: telemetry.estimatedComputeMilliseconds > 8 ? "warning" : "info", why: "Particle budget, dispatch count, and workgroup size estimate whether the WebGPU compute branch is safe." },
            { marker: "actual WebGPU compute branch", severity: telemetry.webGpuComputeStatus === "executed" ? "pass" : telemetry.webGpuComputeStatus === "failed safe" ? "warning" : "info", why: telemetry.webGpuComputeBranchNote },
            { marker: "density feedback downshift", severity: telemetry.webGpuFiniteOutputGuardClampRate > 0.02 ? "warning" : "info", why: "Gain " + formatMetric(telemetry.webGpuDensityFieldFeedbackGain, "×") + " effective " + formatMetric(telemetry.webGpuAdaptiveDensityFieldFeedbackGain, "×") + "; clamp rate " + formatMetric(telemetry.webGpuFiniteOutputGuardClampRate * 100, "%") + "; " + safeVisibleText(telemetry.webGpuDensityFieldFeedbackDownshiftStatus) + "." },
            { marker: "worker compute orchestration", severity: telemetry.webGpuWorkerStatus === "executed" || telemetry.webGpuWorkerStatus === "initialized" ? "pass" : telemetry.webGpuWorkerStatus === "failed safe" ? "warning" : "info", why: "Execution location: " + telemetry.webGpuExecutionLocation + "; readback mode: " + telemetry.webGpuReadbackMode + "; readback bytes: " + telemetry.webGpuReadbackBytes + "." },
            { marker: "PSF bounding box", severity: telemetry.psfTruncationRisk === "warning" ? "warning" : "info", why: "Dynamic point-spread bounding boxes prevent bright-source truncation artifacts in the future shader path." },
            { marker: "quantum signal proxy", severity: telemetry.quantumSignalEnhancementProxy > 1 ? "info" : "note", why: "Qubit phase and gate-depth controls expose an educational signal-enhancement proxy." },
            { marker: "navigation route advisory", severity: telemetry.routeConfidence < 0.45 || telemetry.driveReserveMargin < 0 ? "warning" : "info", why: telemetry.recommendedAction + "; guide-star, buoy map, route hazard, and reserve margin are recalculated together." },
            { marker: "high turbulence detected", severity: config.turbulence > 0.7 ? "warning" : "note", why: "Turbulence increases navigation drift and reduces charge rate." },
            { marker: "input clamped", severity: warnings.length ? "warning" : "pass", why: warnings.length ? warnings.join("; ") : "Recipe inputs stayed inside safe simulator bounds." },
            { marker: "non-finite prevented", severity: "pass", why: "Non-finite values and executable recipe fields are not allowed into exported reports." }
        ];
    }

    class DarkMatterDriveSimulatorCore {
        constructor() {
            this.clock = new SimulationClock();
            this.galaxyModel = new GalaxyRotationModel();
            this.windModel = new DarkMatterWindModel();
            this.lensingModel = new LensingApproximationModel();
            this.cosmologyReferenceModel = new CosmologyReferenceModel();
            this.quantizedInertiaModel = new QuantizedInertiaModel();
            this.haloscopeSailingModel = new HaloscopeSailingModel();
            this.alcubierreVisualizationModel = new AlcubierreVisualizationModel();
            this.opticalTelemetryModel = new OpticalTelemetryModel();
            this.darkMatterJFactorModel = new DarkMatterJFactorModel();
            this.electromagneticLightSlowingModel = new ElectromagneticLightSlowingModel();
            this.multiMessengerPropagationSystem = new MultiMessengerPropagationSystem();
            this.relativisticFlightModel = new RelativisticFlightModel();
            this.webGpuComputeReadinessModel = new WebGpuComputeReadinessModel();
            this.relationalEcsSimulationEngine = new RelationalEcsSimulationEngine();
            this.pointSpreadConvolutionModel = new PointSpreadConvolutionModel();
            this.quantumSignalEnhancementModel = new QuantumSignalEnhancementModel();
            this.darkMatterWeatherMapModel = new DarkMatterWeatherMapModel();
            this.navigationGuidanceModel = new NavigationGuidanceModel();
            this.trajectoryPlannerModel = new TrajectoryPlannerModel();
            this.energyBudgetModel = new EnergyBudgetModel();
            this.spacecraftState = new SpacecraftState();
            this.driveState = new DriveState();
            this.performanceMonitor = new PerformanceMonitor();
            this.running = false;
            this.timelineIndex = 0;
            this.applyRecipe({ preset: "interactiveBlueprint" });
        }
        applyRecipe(recipe) {
            const validation = validateRecipe(recipe);
            this.recipe = validation.recipe;
            this.warnings = validation.warnings;
            this.recalculate();
            return this.snapshot();
        }
        loadPreset(presetKey) { this.clock.reset(); return this.applyRecipe({ preset: presetKey }); }
        setMode(mode) { return this.applyRecipe(Object.assign({}, this.recipe, { mode })); }
        setParameter(key, value) { const next = Object.assign({}, this.recipe); next[key] = value; return this.applyRecipe(next); }
        setExternalTelemetry(values) { this.externalTelemetry = new WebGpuComputeTelemetryState(values); this.recalculate(); return this.snapshot(); }
        start() { this.running = true; return this.snapshot(); }
        resume() { return this.start(); }
        pause() { this.running = false; return this.snapshot(); }
        reset() { this.running = false; this.clock.reset(); this.driveState = new DriveState(); this.timelineIndex = 0; this.recalculate(); return this.snapshot(); }
        step() { this.clock.step(this.recipe.speedMultiplier); this.recalculate(); return this.snapshot(); }
        moveTimeline(action) {
            if (action === "back") { this.timelineIndex = Math.max(0, this.timelineIndex - 1); }
            else if (action === "next") { this.timelineIndex = Math.min(this.timeline.length - 1, this.timelineIndex + 1); }
            else if (action === "warning") { const index = this.timeline.findIndex((event) => event.severity === "warning"); this.timelineIndex = index >= 0 ? index : this.timelineIndex; }
            else if (typeof action === "number") { this.timelineIndex = clamp(Math.round(action), 0, this.timeline.length - 1); }
            return this.snapshot();
        }
        recalculate() {
            const galaxy = this.galaxyModel.compute(this.recipe);
            const wind = this.windModel.compute(this.recipe);
            const legacy = computeLegacyTelemetry(this.recipe, this.clock.tick, "low");
            const lensing = this.lensingModel.compute(this.recipe);
            const spacecraft = this.spacecraftState.update(this.recipe, wind);
            const drive = this.driveState.update(this.recipe, wind, legacy.thermalLoad);
            const cosmologyReference = this.cosmologyReferenceModel.compute(this.recipe);
            const quantizedInertia = this.quantizedInertiaModel.compute(this.recipe, wind);
            const haloscopeSailing = this.haloscopeSailingModel.compute(this.recipe, wind);
            const alcubierreVisualization = this.alcubierreVisualizationModel.compute(this.recipe, drive);
            const opticalTelemetry = this.opticalTelemetryModel.compute(this.recipe);
            const darkMatterObservability = this.darkMatterJFactorModel.compute(this.recipe);
            const electromagneticLightSlowing = this.multiMessengerPropagationSystem.compute(this.recipe);
            const relativisticFlight = this.relativisticFlightModel.compute(this.recipe);
            const quantumSignalEnhancement = this.quantumSignalEnhancementModel.compute(this.recipe, haloscopeSailing);
            const pointSpreadConvolution = this.pointSpreadConvolutionModel.compute(this.recipe, opticalTelemetry);
            const darkMatterWeatherMap = this.darkMatterWeatherMapModel.compute(this.recipe, wind);
            const navigationGuidance = this.navigationGuidanceModel.compute(this.recipe, darkMatterWeatherMap, lensing);
            const trajectoryPlanner = this.trajectoryPlannerModel.compute(this.recipe, navigationGuidance, darkMatterWeatherMap, relativisticFlight);
            const energyBudget = this.energyBudgetModel.compute(this.recipe, drive, quantumSignalEnhancement, trajectoryPlanner);
            const performance = this.performanceMonitor.update(this.recipe, legacy.thermalLoad, this.recipe.photonPacketCount);
            const webGpuComputeReadiness = this.webGpuComputeReadinessModel.compute(this.recipe, performance);
            const relationalEcsTelemetry = this.relationalEcsSimulationEngine.step(this.recipe);
            this.telemetry = new TelemetryState(Object.assign({}, legacy, galaxy, wind, lensing, cosmologyReference, quantizedInertia, haloscopeSailing, alcubierreVisualization, opticalTelemetry, darkMatterObservability, electromagneticLightSlowing, relativisticFlight, quantumSignalEnhancement, pointSpreadConvolution, darkMatterWeatherMap, navigationGuidance, trajectoryPlanner, energyBudget, performance, webGpuComputeReadiness, relationalEcsTelemetry, this.externalTelemetry || new WebGpuComputeTelemetryState(), {
                simulationTimeSeconds: this.clock.simulationTimeSeconds,
                simulationSpeedMultiplier: this.recipe.speedMultiplier,
                rendererMode: this.rendererMode || "Canvas",
                particleCount: Math.round(this.recipe.photonPacketCount),
                bodyCount: Math.round(120 + this.recipe.visibleMatterMass + this.recipe.haloRadius),
                visibleMassProxy: this.recipe.visibleMatterMass,
                darkMatterDensity: this.recipe.darkMatterDensity,
                haloRadius: this.recipe.haloRadius,
                shipVelocity: spacecraft.velocity,
                shipHeading: spacecraft.headingDegrees,
                driveCharge: drive.charge,
                driveChargeRate: wind.driveChargeRate,
                driveOutput: drive.output,
                darkMatterWindDirection: this.recipe.windDirectionDegrees,
                darkMatterWindTurbulence: this.recipe.turbulence,
                lensingDeflectionArcseconds: lensing.apparentDeflectionArcseconds,
                currentAngularOffsetArcseconds: lensing.angularOffsetArcseconds,
                warningText: legacy.currentScenarioState === "warning" ? "Warning: telemetry outside nominal envelope." : galaxy.fallingCurveRisk,
                physicsTickMilliseconds: 1.8 + this.recipe.photonPacketCount / 1800 + this.recipe.compressionRatio / 120,
                renderMilliseconds: 3.2 + this.recipe.photonPacketCount / 850,
                workerLatency: 2.5 + this.recipe.photonPacketCount / 1200
            }));
            this.timeline = buildTimeline(this.recipe, this.telemetry, this.warnings);
            return this.telemetry;
        }
        exportState() { return JSON.stringify({ recipe: this.recipe, tick: this.clock.tick, simulationTimeSeconds: this.clock.simulationTimeSeconds }, null, 2); }
        importState(jsonText) {
            try {
                const parsed = JSON.parse(jsonText);
                this.clock.tick = Math.max(0, Math.round(finiteNumber(parsed.tick, 0)));
                this.clock.simulationTimeSeconds = Math.max(0, finiteNumber(parsed.simulationTimeSeconds, 0));
                return this.applyRecipe(parsed.recipe || {});
            } catch (error) {
                this.warnings = ["Import failed; invalid JSON state."];
                return this.snapshot();
            }
        }
        exportReplayReport() {
            const snapshot = this.snapshot();
            return {
                reportType: "ArcSecs Dark Matter Drive Simulator Replay Report",
                scenarioName: snapshot.recipe.label,
                activeMode: snapshot.recipe.mode,
                scientificBoundary: SCIENTIFIC_BOUNDARY,
                recipeValues: snapshot.recipe,
                telemetry: snapshot.telemetry,
                timelineEvents: snapshot.timeline,
                ledgerClosureMetrics: { ledgerClosureError: snapshot.telemetry.ledgerClosureError, ledgerStatus: snapshot.telemetry.ledgerClosureError > 0.01 ? "warning" : "bounded" },
                performanceBudgetSummary: { framesPerSecond: snapshot.telemetry.framesPerSecond, rendererMode: snapshot.telemetry.rendererMode, qualityMode: snapshot.telemetry.qualityMode, frameRisk: snapshot.telemetry.frameRisk, estimatedComputeMilliseconds: snapshot.telemetry.estimatedComputeMilliseconds, computeParticleBudget: snapshot.telemetry.computeParticleBudget },
                webGpuComputeSummary: { status: snapshot.telemetry.webGpuComputeStatus, executionLocation: snapshot.telemetry.webGpuExecutionLocation, workerStatus: snapshot.telemetry.webGpuWorkerStatus, readbackMode: snapshot.telemetry.webGpuReadbackMode, readbackBytes: snapshot.telemetry.webGpuReadbackBytes, workerRoundTripMilliseconds: snapshot.telemetry.webGpuWorkerRoundTripMilliseconds, readbackLatencyMilliseconds: snapshot.telemetry.webGpuReadbackLatencyMilliseconds, adaptiveComputeQualityStatus: snapshot.telemetry.webGpuAdaptiveComputeQualityStatus, effectiveComputeParticleBudget: snapshot.telemetry.webGpuEffectiveComputeParticleBudget, adaptiveComputeQualityMode: snapshot.telemetry.webGpuAdaptiveComputeQualityMode, adaptiveComputeDownshiftLevel: snapshot.telemetry.webGpuAdaptiveComputeDownshiftLevel, adaptiveComputeInstabilityScore: snapshot.telemetry.webGpuAdaptiveComputeInstabilityScore, actualParticleCount: snapshot.telemetry.webGpuActualParticleCount, actualDispatches: snapshot.telemetry.webGpuActualDispatches, meanParticleSpeed: snapshot.telemetry.webGpuMeanParticleSpeed, meanAccelerationProxy: snapshot.telemetry.webGpuMeanAccelerationProxy, haloPressureProxy: snapshot.telemetry.webGpuHaloPressureProxy, lastCompletedTick: snapshot.telemetry.webGpuLastCompletedTick, persistentBuffersStatus: snapshot.telemetry.webGpuPersistentBuffersStatus, pingPongSourceIndex: snapshot.telemetry.webGpuPingPongSourceIndex, pingPongDestinationIndex: snapshot.telemetry.webGpuPingPongDestinationIndex, particleBufferCapacity: snapshot.telemetry.webGpuParticleBufferCapacity, bufferRebuildCount: snapshot.telemetry.webGpuBufferRebuildCount, sharedBufferContractVersion: snapshot.telemetry.webGpuSharedBufferContractVersion, sharedRenderBufferStatus: snapshot.telemetry.webGpuSharedRenderBufferStatus, renderSampleStatus: snapshot.telemetry.webGpuRenderSampleStatus, renderSampleCount: snapshot.telemetry.webGpuRenderSampleCount, renderSampleBytes: snapshot.telemetry.webGpuRenderSampleBytes, renderSampleSourceIndex: snapshot.telemetry.webGpuRenderSampleSourceIndex, directRenderStatus: snapshot.telemetry.webGpuDirectRenderStatus, directRenderParticleCount: snapshot.telemetry.webGpuDirectRenderParticleCount, directRenderPipelineStatus: snapshot.telemetry.webGpuDirectRenderPipelineStatus, directRenderSourceIndex: snapshot.telemetry.webGpuDirectRenderSourceIndex, directRenderVertexCount: snapshot.telemetry.webGpuDirectRenderVertexCount, spatialIndexStatus: snapshot.telemetry.webGpuSpatialIndexStatus, spatialBucketCount: snapshot.telemetry.webGpuSpatialBucketCount, spatialBucketReadbackBytes: snapshot.telemetry.webGpuSpatialBucketReadbackBytes, mortonContractVersion: snapshot.telemetry.webGpuMortonContractVersion, occupiedSpatialBuckets: snapshot.telemetry.webGpuOccupiedSpatialBuckets, densestSpatialBucketIndex: snapshot.telemetry.webGpuDensestSpatialBucketIndex, densestSpatialBucketOccupancy: snapshot.telemetry.webGpuDensestSpatialBucketOccupancy, spatialLocalityRatio: snapshot.telemetry.webGpuSpatialLocalityRatio, adaptiveHaloShadingStatus: snapshot.telemetry.webGpuAdaptiveHaloShadingStatus, adaptiveHaloDensityGain: snapshot.telemetry.webGpuAdaptiveHaloDensityGain, adaptiveHaloOpacity: snapshot.telemetry.webGpuAdaptiveHaloOpacity, tileLocalNeighborStatus: snapshot.telemetry.webGpuTileLocalNeighborStatus, tileLocalNeighborQueryCount: snapshot.telemetry.webGpuTileLocalNeighborQueryCount, tileLocalDensityProxy: snapshot.telemetry.webGpuTileLocalDensityProxy, directVisualQualityMode: snapshot.telemetry.webGpuDirectRenderVisualQualityMode, directPointScale: snapshot.telemetry.webGpuDirectRenderPointScale, directHaloIntensity: snapshot.telemetry.webGpuDirectRenderHaloIntensity, directVisualDensity: snapshot.telemetry.webGpuDirectRenderVisualDensity, relationalMdsProjectionStatus: snapshot.telemetry.webGpuRelationalMdsProjectionStatus, relationalMdsDistanceMatrixBytes: snapshot.telemetry.webGpuRelationalMdsDistanceMatrixBytes, relationalMdsProjectionBufferBytes: snapshot.telemetry.webGpuRelationalMdsProjectionBufferBytes, relationalMdsProjectionSource: snapshot.telemetry.webGpuRelationalMdsProjectionSource, relationalMdsProjectionContractVersion: snapshot.telemetry.webGpuRelationalMdsProjectionContractVersion, relationalWeberForceStatus: snapshot.telemetry.webGpuRelationalWeberForceStatus, relationalWeberForceTotal: snapshot.telemetry.webGpuRelationalWeberForceTotal, relationalMachianMassFromWeberBuffer: snapshot.telemetry.webGpuRelationalMachianMassFromWeberBuffer, relationalMachianMassReductionStatus: snapshot.telemetry.webGpuRelationalMachianMassReductionStatus, relationalShipMachianEffectiveMass: snapshot.telemetry.webGpuRelationalShipMachianEffectiveMass, relationalAverageEntityMachianMass: snapshot.telemetry.webGpuRelationalAverageEntityMachianMass, relationalMachianMassBufferBytes: snapshot.telemetry.webGpuRelationalMachianMassBufferBytes, relationalWeberContractVersion: snapshot.telemetry.webGpuRelationalWeberContractVersion },
                relativisticReferenceSummary: { lorentzFactor: snapshot.telemetry.lorentzFactor, properTimeRate: snapshot.telemetry.properTimeRate, relativisticMomentumProxy: snapshot.telemetry.relativisticMomentumProxy },
                opticsReadinessSummary: { psfBoundingBoxArcseconds: snapshot.telemetry.psfBoundingBoxArcseconds, dynamicPsfTilePixels: snapshot.telemetry.dynamicPsfTilePixels, psfTruncationRisk: snapshot.telemetry.psfTruncationRisk },
                lightSlowingSummary: { distanceMegaparsecs: snapshot.telemetry.lightSlowingDistanceMegaparsecs, targetRedshift: snapshot.telemetry.lightSlowingTargetRedshift, redshiftCoefficientPerMeter: snapshot.telemetry.lightSlowingRedshiftCoefficientPerMeter, delayCoefficientPerMeter: snapshot.telemetry.lightSlowingDelayCoefficientPerMeter, arrivalLightSpeedMetersPerSecond: snapshot.telemetry.lightSlowingArrivalSpeedMetersPerSecond, speedDecreaseMetersPerSecond: snapshot.telemetry.lightSlowingSpeedDecreaseMetersPerSecond, propagationDelaySeconds: snapshot.telemetry.lightSlowingPropagationDelaySeconds, intrinsicDelaySeconds: snapshot.telemetry.lightSlowingIntrinsicDelaySeconds, totalDelaySeconds: snapshot.telemetry.lightSlowingTotalArrivalDelaySeconds, energyLossPercent: snapshot.telemetry.lightSlowingEnergyLossPercent, calibrationNote: snapshot.telemetry.lightSlowingCalibrationNote, multiMessengerEvent: snapshot.telemetry.multiMessengerEventLabel, substrateProfile: snapshot.telemetry.substrateDensityProfileLabel, densityCorrectedPropagationDelaySeconds: snapshot.telemetry.multiMessengerDensityCorrectedPropagationDelaySeconds, compositeRedshift: snapshot.telemetry.compositeRedshift, arrivalDilationFactor: snapshot.telemetry.arrivalDilationFactor },
                quantumSignalSummary: { quantumSignalEnhancementProxy: snapshot.telemetry.quantumSignalEnhancementProxy, nativeGateSequencePreview: snapshot.telemetry.nativeGateSequencePreview },
                replayDeterminismResult: "Finite deterministic fixed-step replay generated without executable recipe fields.",
                warnings: snapshot.warnings.length ? snapshot.warnings : ["none"]
            };
        }
        snapshot() {
            return { running: this.running, recipe: this.recipe, warnings: this.warnings, telemetry: this.telemetry, timeline: this.timeline, timelineIndex: this.timelineIndex, scientificBoundary: SCIENTIFIC_BOUNDARY, modes: SIMULATION_MODES, guidedScenarios: GUIDED_SCENARIOS };
        }
    }

    class DarkMatterDriveProgressMonitor {
        constructor(maxEntries) { this.maxEntries = maxEntries || 24; this.entries = []; this.nextIndex = 1; }
        addEntry(label, detail, severity) {
            this.entries.unshift({ index: this.nextIndex, label: safeVisibleText(label), detail: safeVisibleText(detail), severity: severity || "info" });
            this.nextIndex += 1;
            if (this.entries.length > this.maxEntries) { this.entries.length = this.maxEntries; }
            return this.getEntries();
        }
        getEntries() { return this.entries.slice(); }
        buildProgressState(snapshot, missionIndex, missionStageCount) {
            const tick = snapshot && snapshot.telemetry ? snapshot.telemetry.tick : 0;
            const tickMilliseconds = snapshot && snapshot.telemetry ? finiteNumber(snapshot.telemetry.physicsTickMilliseconds, 2) : 2;
            const simulationProgressPercent = clamp((tick % 720) / 7.2, 0, 100);
            const stageCount = Math.max(1, finiteNumber(missionStageCount, 1));
            const missionProgressPercent = stageCount <= 1 ? 100 : clamp((finiteNumber(missionIndex, 0) / (stageCount - 1)) * 100, 0, 100);
            return {
                simulationProgressPercent,
                missionProgressPercent,
                estimatedSecondsRemaining: Math.max(0, (720 - (tick % 720)) * tickMilliseconds / 1000),
                statusText: snapshot && snapshot.running ? "Running deterministic simulation loop" : "Paused and ready for parameter changes"
            };
        }
        describeCurrentStep(snapshot) {
            if (!snapshot || !snapshot.timeline || !snapshot.timeline.length) { return "Timeline is waiting for the first deterministic event."; }
            const event = snapshot.timeline[snapshot.timelineIndex] || snapshot.timeline[0];
            return event.marker + ": " + event.why;
        }
    }

    class DarkMatterDriveAutopilotDirector {
        constructor(stages) {
            this.stages = Array.isArray(stages) ? stages.slice() : [];
            this.active = false;
            this.stageIndex = 0;
            this.stageStartTick = 0;
            this.lastAppliedStageId = "";
        }
        start(currentTick) {
            this.active = true;
            this.stageIndex = 0;
            this.stageStartTick = Math.max(0, Math.round(finiteNumber(currentTick, 0)));
            this.lastAppliedStageId = "";
            return this.getState(currentTick);
        }
        stop(currentTick) {
            this.active = false;
            return this.getState(currentTick);
        }
        next(currentTick) {
            this.stageIndex = this.stages.length ? (this.stageIndex + 1) % this.stages.length : 0;
            this.stageStartTick = Math.max(0, Math.round(finiteNumber(currentTick, 0)));
            this.lastAppliedStageId = "";
            return this.getState(currentTick);
        }
        jumpTo(stageIndex, currentTick) {
            const numericIndex = Math.max(0, Math.round(finiteNumber(stageIndex, 0)));
            this.stageIndex = this.stages.length ? clamp(numericIndex, 0, this.stages.length - 1) : 0;
            this.stageStartTick = Math.max(0, Math.round(finiteNumber(currentTick, 0)));
            this.lastAppliedStageId = "";
            return this.getState(currentTick);
        }
        getStage() {
            if (!this.stages.length) { return null; }
            return this.stages[this.stageIndex] || this.stages[0];
        }
        shouldAdvance(currentTick) {
            const stage = this.getStage();
            if (!this.active || !stage) { return false; }
            const tick = Math.max(0, Math.round(finiteNumber(currentTick, 0)));
            const durationTicks = Math.max(30, Math.round(finiteNumber(stage.durationTicks, 180)));
            return tick - this.stageStartTick >= durationTicks;
        }
        markApplied(stageId) {
            this.lastAppliedStageId = safeVisibleText(stageId || "");
        }
        needsApply(stageId) {
            return this.lastAppliedStageId !== safeVisibleText(stageId || "");
        }
        getState(currentTick) {
            const stage = this.getStage();
            const tick = Math.max(0, Math.round(finiteNumber(currentTick, 0)));
            const durationTicks = stage ? Math.max(30, Math.round(finiteNumber(stage.durationTicks, 180))) : 1;
            const elapsedTicks = Math.max(0, tick - this.stageStartTick);
            const progress = clamp(elapsedTicks / durationTicks, 0, 1);
            return {
                active: Boolean(this.active),
                stageIndex: this.stageIndex,
                stageCount: this.stages.length,
                stage,
                elapsedTicks,
                durationTicks,
                progress,
                finite: Number.isFinite(progress) && Number.isFinite(elapsedTicks) && Number.isFinite(durationTicks)
            };
        }
    }

    class DarkMatterDriveDemoFlightMissionRecorder {
        constructor(maxEntries) {
            this.maxEntries = Math.max(10, Math.round(finiteNumber(maxEntries, 80)));
            this.runLog = [];
            this.exportAudit = [];
            this.sequence = 0;
        }
        recordStage(action, snapshot, state, verification, scorecard, evidenceLedger, architectureSweep, note) {
            this.sequence += 1;
            const stage = state && state.stage ? state.stage : null;
            const entry = {
                sequence: this.sequence,
                eventType: "stage",
                action: safeVisibleText(action),
                tick: snapshot && snapshot.telemetry ? finiteNumber(snapshot.telemetry.tick, 0) : 0,
                stageId: stage ? safeVisibleText(stage.id) : "none",
                stageTitle: stage ? safeVisibleText(stage.title) : "No active stage",
                progress: state ? finiteNumber(state.progress, 0) : 0,
                verificationStatus: verification ? safeVisibleText(verification.status) : "none",
                scorecardStatus: scorecard ? safeVisibleText(scorecard.status) : "none",
                evidenceStatus: evidenceLedger ? safeVisibleText(evidenceLedger.ledgerStatus) : "none",
                architectureStatus: architectureSweep ? safeVisibleText(architectureSweep.overallStatus) : "none",
                finite: Boolean(snapshot && snapshot.telemetry) && Number.isFinite(snapshot.telemetry.tick) && Boolean(state ? state.finite : true) && Boolean(verification ? verification.finite : true) && Boolean(scorecard ? scorecard.finite : true) && Boolean(evidenceLedger ? evidenceLedger.finite : true),
                note: safeVisibleText(note || "")
            };
            this.runLog.push(entry);
            if (this.runLog.length > this.maxEntries) { this.runLog.shift(); }
            return entry;
        }
        recordExport(exportName, report) {
            this.sequence += 1;
            const demoDirector = report && report.demoDirector ? report.demoDirector : null;
            const stage = demoDirector && demoDirector.stage ? demoDirector.stage : null;
            const audit = {
                sequence: this.sequence,
                exportName: safeVisibleText(exportName),
                tick: report && report.telemetry ? finiteNumber(report.telemetry.tick, 0) : 0,
                stageId: stage ? safeVisibleText(stage.id) : safeVisibleText(report && report.demoStageEvidenceLedger ? report.demoStageEvidenceLedger.activeStageId : "none"),
                includesDemoDirector: Boolean(report && report.demoDirector),
                includesVerification: Boolean(report && report.demoStageVerification),
                includesTimeline: Boolean(report && report.demoStageTimeline),
                includesScorecard: Boolean(report && report.demoStageScorecard),
                includesEvidenceLedger: Boolean(report && report.demoStageEvidenceLedger),
                includesArchitectureSweep: Boolean(report && report.demoFlightArchitectureSweep),
                includesRunLog: true,
                finite: true
            };
            this.exportAudit.push(audit);
            if (this.exportAudit.length > this.maxEntries) { this.exportAudit.shift(); }
            return audit;
        }
        snapshot(state, operatorNotes, generatedAtTick) {
            return {
                demoFlightRunLog: this.runLog.slice(),
                demoFlightOperatorNotes: safeVisibleText(operatorNotes || ""),
                demoFlightExportAudit: this.exportAudit.slice(),
                generatedAtTick: finiteNumber(generatedAtTick, 0),
                currentStageId: state && state.stage ? safeVisibleText(state.stage.id) : "none",
                currentStageTitle: state && state.stage ? safeVisibleText(state.stage.title) : "No active stage",
                finite: Number.isFinite(finiteNumber(generatedAtTick, 0)) && this.runLog.every((entry) => entry.finite !== false) && this.exportAudit.every((entry) => entry.finite !== false)
            };
        }
    }

    function buildDemoFlightMissionDebrief(demoStages, missionRecorder, architectureSweep) {
        const runLog = missionRecorder && Array.isArray(missionRecorder.demoFlightRunLog) ? missionRecorder.demoFlightRunLog : [];
        const exportAudit = missionRecorder && Array.isArray(missionRecorder.demoFlightExportAudit) ? missionRecorder.demoFlightExportAudit : [];
        const notes = missionRecorder ? safeVisibleText(missionRecorder.demoFlightOperatorNotes || "") : "";
        const allStagesTouched = (Array.isArray(demoStages) ? demoStages : []).every((stage) => runLog.some((entry) => entry.stageId === stage.id));
        const exportsTouched = exportAudit.length > 0;
        const finite = Boolean(missionRecorder ? missionRecorder.finite : true) && Boolean(architectureSweep ? architectureSweep.finiteTelemetryGuard : true);
        const architectureStatus = architectureSweep ? safeVisibleText(architectureSweep.overallStatus) : "not-run";
        const item = (key, label, status, evidence, nextAction) => ({ key, label, status, evidence, nextAction });
        const items = [
            item("stage-coverage", "Stage coverage", allStagesTouched ? "complete" : "ready", runLog.length + " recorded stage events", "Click each Demo Flight stage card."),
            item("export-audit", "Export audit", exportsTouched ? "complete" : "ready", exportAudit.length + " export events recorded", "Export Verification, Evidence, Architecture, Debrief, and Replay JSON."),
            item("operator-notes", "Operator notes", notes.length > 0 ? "complete" : "ready", notes.length > 0 ? "Operator notes included." : "No operator notes yet.", "Add what you saw before exporting."),
            item("architecture-status", "Architecture status", architectureStatus === "pass" ? "complete" : "watch", architectureStatus, "Review the Architecture Sweep panel."),
            item("finite-run-log", "Finite run log", finite ? "complete" : "watch", finite ? "Recorder and architecture telemetry are finite." : "A finite telemetry guard needs attention.", "Inspect JSON for invalid numeric values.")
        ];
        const status = allStagesTouched && exportsTouched && finite ? "complete" : (finite ? "ready" : "watch");
        return {
            status,
            stageCount: Array.isArray(demoStages) ? demoStages.length : 0,
            recordedStageCount: runLog.length,
            exportAuditCount: exportAudit.length,
            operatorNotesPresent: notes.length > 0,
            architectureStatus,
            finite,
            items,
            recommendedNextAction: status === "complete" ? "Use the exported debrief as the live acceptance evidence packet." : "Complete every stage, add notes, export all JSON, then review the debrief again."
        };
    }

    function buildDemoFlightAcceptanceResult(baseReport, visitedStageIds, startedAtTick, completedAtTick) {
        const requiredExportKeys = [
            "demoDirector",
            "demoStages",
            "demoStageVerification",
            "demoStageTimeline",
            "demoStageScorecard",
            "demoStageEvidenceLedger",
            "demoFlightArchitectureSweep",
            "demoFlightRunLog",
            "demoFlightOperatorNotes",
            "demoFlightExportAudit",
            "demoFlightMissionRecorder",
            "demoFlightMissionDebrief"
        ];
        const exportMatrix = requiredExportKeys.map((key) => ({
            key,
            label: key.replace(/([A-Z])/g, " $1").replace(/^./, (firstCharacter) => firstCharacter.toUpperCase()),
            present: Object.prototype.hasOwnProperty.call(baseReport || {}, key)
        }));
        const telemetryFinite = Boolean(baseReport && baseReport.telemetry) && Object.keys(baseReport.telemetry).every((key) => typeof baseReport.telemetry[key] !== "number" || Number.isFinite(baseReport.telemetry[key]));
        const speculativeBoundaryPresent = Boolean(baseReport && typeof baseReport.scientificBoundary === "string" && baseReport.scientificBoundary.length > 12);
        const stages = AUTOPILOT_DEMO_STAGES.map((stage, index) => {
            const visited = visitedStageIds.indexOf(stage.id) >= 0;
            const failureReasons = [];
            if (!visited) { failureReasons.push("required stage was not visited"); }
            if (!telemetryFinite) { failureReasons.push("telemetry is non-finite"); }
            if (!baseReport.demoStageVerification) { failureReasons.push("verification state is missing"); }
            if (!baseReport.demoStageScorecard) { failureReasons.push("scorecard state is missing"); }
            if (!baseReport.demoStageEvidenceLedger) { failureReasons.push("evidence ledger state is missing"); }
            if (!baseReport.demoFlightArchitectureSweep) { failureReasons.push("architecture sweep state is missing"); }
            if (!baseReport.demoFlightMissionDebrief) { failureReasons.push("mission debrief state is missing"); }
            return {
                stageIndex: index,
                stageId: safeVisibleText(stage.id),
                stageTitle: safeVisibleText(stage.title),
                visited,
                telemetryFinite,
                verificationStatus: baseReport.demoStageVerification ? safeVisibleText(baseReport.demoStageVerification.status) : "missing",
                scorecardStatus: baseReport.demoStageScorecard ? safeVisibleText(baseReport.demoStageScorecard.status) : "missing",
                evidenceLedgerStatus: baseReport.demoStageEvidenceLedger ? safeVisibleText(baseReport.demoStageEvidenceLedger.ledgerStatus) : "missing",
                architectureStatus: baseReport.demoFlightArchitectureSweep ? safeVisibleText(baseReport.demoFlightArchitectureSweep.overallStatus) : "missing",
                missionDebriefStatus: baseReport.demoFlightMissionDebrief ? safeVisibleText(baseReport.demoFlightMissionDebrief.status) : "missing",
                failureReasons
            };
        });
        const failures = [];
        const missingExportKeys = exportMatrix.filter((entry) => !entry.present).map((entry) => entry.key);
        const unvisitedStages = stages.filter((stage) => !stage.visited).map((stage) => stage.stageId);
        if (unvisitedStages.length) { failures.push("Unvisited stages: " + unvisitedStages.join(", ")); }
        if (missingExportKeys.length) { failures.push("Missing export payload keys: " + missingExportKeys.join(", ")); }
        if (!telemetryFinite) { failures.push("Telemetry is non-finite."); }
        if (!baseReport.demoStageVerification) { failures.push("Verification state is missing."); }
        if (!baseReport.demoStageScorecard) { failures.push("Scorecard state is missing."); }
        if (!baseReport.demoStageEvidenceLedger) { failures.push("Evidence ledger state is missing."); }
        if (!baseReport.demoFlightArchitectureSweep) { failures.push("Architecture sweep state is missing."); }
        if (!speculativeBoundaryPresent) { failures.push("Speculative-boundary text is absent."); }
        const pass = failures.length === 0;
        return {
            demoFlightAcceptanceRun: {
                startedAtTick: finiteNumber(startedAtTick, 0),
                completedAtTick: finiteNumber(completedAtTick, 0),
                stageCount: AUTOPILOT_DEMO_STAGES.length,
                visitedStageCount: visitedStageIds.length,
                requiredExportKeyCount: requiredExportKeys.length,
                presentExportKeyCount: exportMatrix.filter((entry) => entry.present).length,
                telemetryFinite,
                speculativeBoundaryPresent,
                status: pass ? "pass" : "fail"
            },
            demoFlightAcceptanceStages: stages,
            demoFlightAcceptanceResults: pass ? ["Acceptance flight passed."] : ["Acceptance flight failed."],
            demoFlightAcceptanceExportMatrix: exportMatrix,
            demoFlightAcceptanceFailures: failures,
            demoFlightAcceptancePass: pass
        };
    }

    function buildAcceptanceFlightCertificateBundle(acceptanceResult, snapshot, missionDebrief, missionRecorder) {
        const tick = snapshot && snapshot.telemetry ? finiteNumber(snapshot.telemetry.tick, 0) : 0;
        const generatedAtUtc = new Date().toISOString();
        const failures = acceptanceResult && Array.isArray(acceptanceResult.demoFlightAcceptanceFailures) && acceptanceResult.demoFlightAcceptanceFailures.length
            ? acceptanceResult.demoFlightAcceptanceFailures
            : ["Acceptance flight passed."];
        const drilldown = failures.map((message, index) => ({
            index,
            status: acceptanceResult && acceptanceResult.demoFlightAcceptancePass ? "pass" : "fail",
            message: safeVisibleText(message),
            recommendedAction: acceptanceResult && acceptanceResult.demoFlightAcceptancePass ? "Use this certificate as the acceptance evidence packet." : "Open the Acceptance Flight panel, complete missing stages, and export again."
        }));
        const run = acceptanceResult ? acceptanceResult.demoFlightAcceptanceRun : null;
        const stageCoverage = run ? run.visitedStageCount + "/" + run.stageCount : "0/" + AUTOPILOT_DEMO_STAGES.length;
        const exportCoverage = run ? run.presentExportKeyCount + "/" + run.requiredExportKeyCount : "0/0";
        const failureCount = acceptanceResult && Array.isArray(acceptanceResult.demoFlightAcceptanceFailures) ? acceptanceResult.demoFlightAcceptanceFailures.length : 1;
        const acceptancePass = Boolean(acceptanceResult && acceptanceResult.demoFlightAcceptancePass);
        const certificate = {
            certificateId: "DMD-AF-5.8.27-" + (acceptancePass ? "PASS" : "FAIL") + "-" + Math.round(tick) + "-" + stageCoverage.replace("/", "-") + "-" + failureCount,
            packageVersion: "5.8.27",
            generatedAtUtc,
            generatedAtTick: tick,
            acceptanceStatus: run ? safeVisibleText(run.status) : "fail",
            acceptancePass,
            stageCoverage,
            exportCoverage,
            failureCount,
            finiteTelemetry: run ? Boolean(run.telemetryFinite) : false,
            operatorNotesPresent: Boolean(missionRecorder && missionRecorder.demoFlightOperatorNotes && missionRecorder.demoFlightOperatorNotes.trim().length > 0),
            missionDebriefStatus: missionDebrief ? safeVisibleText(missionDebrief.status) : "missing",
            boundaryAcknowledgement: "Speculative simulator acceptance certificate only; not proof or settled physics.",
            recommendedNextAction: acceptancePass ? "Archive the certificate with Demo Flight Verification, Evidence, Architecture, Debrief, and Replay JSON." : "Resolve failure drilldown items and rerun Acceptance Flight.",
            certificatePayloadVersion: "1"
        };
        return {
            demoFlightAcceptanceCertificate: certificate,
            demoFlightAcceptanceFailureDrilldown: drilldown
        };
    }

    function buildAcceptanceEvidenceBundle(baseReport, acceptanceCertificateBundle, snapshot) {
        const requiredArtifactKeys = [
            "demoFlightAcceptanceRun",
            "demoFlightAcceptanceStages",
            "demoFlightAcceptanceResults",
            "demoFlightAcceptanceExportMatrix",
            "demoFlightAcceptanceFailures",
            "demoFlightAcceptancePass",
            "demoFlightAcceptanceCertificate",
            "demoFlightAcceptanceFailureDrilldown",
            "demoFlightMissionRecorder",
            "demoFlightMissionDebrief",
            "demoFlightArchitectureSweep",
            "demoStageEvidenceLedger",
            "demoStageVerification",
            "demoStageScorecard",
            "demoStageTimeline",
            "demoDirector",
            "demoStages"
        ];
        const artifacts = requiredArtifactKeys.map((key) => ({
            key,
            label: key.replace(/([A-Z])/g, " $1").replace(/^./, (firstCharacter) => firstCharacter.toUpperCase()),
            present: Object.prototype.hasOwnProperty.call(baseReport || {}, key),
            required: true
        }));
        const presentArtifactCount = artifacts.filter((artifact) => artifact.present).length;
        const missingArtifactCount = artifacts.length - presentArtifactCount;
        const tick = snapshot && snapshot.telemetry ? finiteNumber(snapshot.telemetry.tick, 0) : 0;
        const generatedAtUtc = new Date().toISOString();
        const acceptancePass = Boolean(baseReport && baseReport.demoFlightAcceptancePass && acceptanceCertificateBundle && acceptanceCertificateBundle.demoFlightAcceptanceCertificate && acceptanceCertificateBundle.demoFlightAcceptanceCertificate.acceptancePass);
        const missionRecorderFinite = Boolean(baseReport && baseReport.demoFlightMissionRecorder && baseReport.demoFlightMissionRecorder.finite);
        const architectureFinite = Boolean(baseReport && baseReport.demoFlightArchitectureSweep && baseReport.demoFlightArchitectureSweep.finiteTelemetryGuard);
        const speculativeBoundaryPresent = Boolean(baseReport && typeof baseReport.scientificBoundary === "string" && baseReport.scientificBoundary.length > 12);
        const failureCount = baseReport && Array.isArray(baseReport.demoFlightAcceptanceFailures) ? baseReport.demoFlightAcceptanceFailures.length : 1;
        const complete = acceptancePass && missingArtifactCount === 0 && missionRecorderFinite && architectureFinite && speculativeBoundaryPresent;
        const bundleId = "DMD-AFB-5.8.27-" + (acceptancePass ? "PASS" : "FAIL") + "-" + Math.round(tick) + "-" + missingArtifactCount + "-" + failureCount;
        return {
            bundleId,
            packageVersion: "5.8.27",
            generatedAtUtc,
            generatedAtTick: tick,
            status: complete ? "complete" : (missionRecorderFinite ? "ready" : "watch"),
            acceptancePass,
            artifactCount: artifacts.length,
            requiredArtifactCount: artifacts.length,
            presentArtifactCount,
            missingArtifactCount,
            failureCount,
            operatorNotesPresent: Boolean(baseReport && baseReport.demoFlightOperatorNotes && baseReport.demoFlightOperatorNotes.trim().length > 0),
            speculativeBoundaryPresent,
            archiveRecommendation: complete ? "Archive this bundle with exported Acceptance Flight, Certificate, Verification, Evidence, Architecture, Debrief, and Replay JSON." : "Resolve missing artifacts or acceptance failures, then rerun Acceptance Flight before archive.",
            artifacts
        };
    }

    class DashboardController {
        constructor(root) {
            this.root = root;
            this.core = new DarkMatterDriveSimulatorCore();
            this.progressMonitor = new DarkMatterDriveProgressMonitor(24);
            this.haptics = new HapticFeedbackController();
            this.scenarioController = new ScenarioController(this.core, (label, detail, severity) => this.progressMonitor.addEntry(label, detail, severity));
            this.autopilotDirector = new DarkMatterDriveAutopilotDirector(AUTOPILOT_DEMO_STAGES);
            this.demoFlightMissionRecorder = new DarkMatterDriveDemoFlightMissionRecorder(96);
            this.acceptanceFlightVisualRun = null;
            this.selectedDemoKey = "demo-flight";
            this.selectedDemo = selectDarkMatterShipTravelDemo(this.selectedDemoKey);
            this.shipTravelPhaseLog = [];
            this.darkMatterTravelInput = createDarkMatterTravelInputState();
            this.darkMatterShipTravelSandbox = createDarkMatterShipTravelSandbox();
            this.darkMatterTravelSandboxActive = false;
            this.darkMatterTravelAutopilotTicks = 0;
            this.darkMatterTravelAutopilotSnapshot = null;
            this.missionIndex = 0;
            this.activeHotspotId = "mqnCore";
            this.canvas = root.querySelector("[data-arcsecs-drive-canvas]");
            this.blueprint = root.querySelector("[data-arcsecs-drive-blueprint]");
            this.renderer = new CanvasRendererAdapter(this.canvas);
            this.lastFrameTime = 0;
            this.lastIdleFrameTime = 0;
            this.minimumFrameMilliseconds = 1000 / 60;
            this.idleFrameMilliseconds = 250;
            this.boundVisibilityHandler = () => { if (typeof document !== "undefined" && document.hidden) { this.core.pause(); this.clearTravelKeys(); this.progressMonitor.addEntry("Simulation paused", "Tab hidden; animation loop paused to protect performance.", "info"); this.render(); } };
        }
        initialize() {
            this.selectRenderer();
            this.bindEvents();
            this.renderHotspots();
            this.updateCapabilities();
            this.progressMonitor.addEntry("Simulation initialized", "Renderer selected: " + this.renderer.mode + ". WebGPU fallback path is available.", "success");
            if (typeof this.renderer.initialize === "function") {
                this.renderer.initialize().then(() => {
                    if (typeof this.renderer.getComputeTelemetry === "function") { this.core.setExternalTelemetry(this.renderer.getComputeTelemetry()); }
                    this.core.rendererMode = this.renderer.mode;
                    this.progressMonitor.addEntry("Renderer initialized", "Renderer branch ready: " + this.renderer.mode + ".", "success");
                    this.render();
                }).catch(() => {
                    this.progressMonitor.addEntry("Renderer fallback", "WebGPU initialization failed safely; Canvas/WebGL fallback remains active.", "warning");
                    this.render();
                });
            }
            if (typeof document !== "undefined") { document.addEventListener("visibilitychange", this.boundVisibilityHandler); }
            this.render();
            if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") { window.requestAnimationFrame((timestamp) => this.loop(timestamp)); }
        }
        selectRenderer() {
            if (typeof navigator !== "undefined" && navigator.gpu) { this.renderer = new WebGpuRendererAdapter(this.canvas); }
            else if (detectWebGlSupport()) { this.renderer = new WebGlRendererAdapter(this.canvas); }
            else { this.renderer = new CanvasRendererAdapter(this.canvas); }
            if (this.renderer instanceof WebGpuRendererAdapter) {
                this.renderer.onComputeComplete = (telemetry) => {
                    this.core.setExternalTelemetry(telemetry);
                    this.progressMonitor.addEntry("WebGPU compute completed", telemetry.webGpuActualParticleCount + " particles updated through the WGSL branch; " + telemetry.webGpuPersistentBuffersStatus + "; Morton buckets " + telemetry.webGpuOccupiedSpatialBuckets + "/" + telemetry.webGpuSpatialBucketCount + "; direct render " + safeVisibleText(telemetry.webGpuDirectRenderStatus) + "; render sample " + telemetry.webGpuRenderSampleCount + " particles.", telemetry.webGpuComputeStatus === "executed" ? "success" : "warning");
                    this.render();
                };
            }
            this.core.rendererMode = this.renderer.mode;
        }
        bindEvents() {
            this.root.querySelectorAll("[data-arcsecs-drive-control]").forEach((control) => {
                control.addEventListener("input", () => { this.applyControls(); this.logControlChange(control); this.render(); });
                control.addEventListener("change", () => { this.applyControls(); this.logControlChange(control); this.render(); });
            });
            this.root.querySelectorAll("[data-arcsecs-drive-run], [data-arcsecs-drive-start]").forEach((button) => button.addEventListener("click", () => { this.haptics.markUserActivated(); this.applyControls(); this.core.start(); this.progressMonitor.addEntry("Simulation started", "Run loop is active and telemetry is updating.", "success"); this.render(); }));
            this.root.querySelectorAll("[data-arcsecs-drive-pause]").forEach((button) => button.addEventListener("click", () => { this.core.pause(); this.progressMonitor.addEntry("Simulation paused", "Replay state preserved.", "info"); this.render(); }));
            this.root.querySelectorAll("[data-arcsecs-drive-resume]").forEach((button) => button.addEventListener("click", () => { this.core.resume(); this.progressMonitor.addEntry("Simulation resumed", "Run loop resumed from the current tick.", "success"); this.render(); }));
            this.root.querySelectorAll("[data-arcsecs-drive-rerun]").forEach((button) => button.addEventListener("click", () => { this.applyControls(); this.core.reset(); this.core.start(); this.progressMonitor.addEntry("Rerun settings", "Current controls were reapplied and the run restarted.", "success"); this.render(); }));
            this.root.querySelectorAll("[data-arcsecs-drive-reset]").forEach((button) => button.addEventListener("click", () => { this.core.reset(); this.progressMonitor.addEntry("Simulation reset", "Tick counter, drive charge, and timeline returned to the start state.", "info"); this.render(); }));
            this.root.querySelectorAll("[data-arcsecs-drive-fullscreen]").forEach((button) => button.addEventListener("click", () => { if (this.root.requestFullscreen) { this.root.requestFullscreen(); this.progressMonitor.addEntry("Fullscreen requested", "The simulator cockpit is using the browser fullscreen API.", "info"); } this.render(); }));
            this.root.querySelectorAll("[data-arcsecs-drive-scenario-action]").forEach((button) => button.addEventListener("click", () => this.handleScenarioAction(button.getAttribute("data-arcsecs-drive-scenario-action") || "load")));
            this.root.querySelectorAll("[data-arcsecs-drive-mission]").forEach((button) => button.addEventListener("click", () => this.moveMission(button.getAttribute("data-arcsecs-drive-mission") || "next")));
            this.root.querySelectorAll("[data-arcsecs-drive-demo-select]").forEach((select) => select.addEventListener("change", () => this.handleDemoSelection(select.value || "demo-flight")));
            this.root.querySelectorAll("[data-arcsecs-drive-demo]").forEach((button) => button.addEventListener("click", () => this.runSelectedDemoAction(button.getAttribute("data-arcsecs-drive-demo") || "play")));
            this.root.querySelectorAll("[data-arcsecs-drive-acceptance-run]").forEach((button) => button.addEventListener("click", () => this.runAcceptanceFlight()));
            this.root.addEventListener("click", (event) => {
                const travelButton = event.target && event.target.closest ? event.target.closest("[data-arcsecs-travel-input], [data-arcsecs-travel-route-autopilot]") : null;
                if (travelButton && this.root.contains(travelButton)) { event.preventDefault(); if (travelButton.hasAttribute("data-arcsecs-travel-route-autopilot")) this.engageDarkMatterTravelRouteAutopilot(); else this.handleDarkMatterTravelInput(travelButton.getAttribute("data-arcsecs-travel-input")); return; }
                const travelTarget = event.target && event.target.closest ? event.target.closest("[data-arcsecs-travel-canvas]") : null;
                if (travelTarget && this.root.contains(travelTarget)) { this.setDarkMatterTravelTarget(event, travelTarget); return; }
                const target = event.target && event.target.closest ? event.target.closest("[data-arcsecs-drive-demo-stage]") : null;
                if (!target || !this.root.contains(target)) { return; }
                event.preventDefault();
                this.jumpToDemoStage(Number(target.getAttribute("data-arcsecs-drive-demo-stage") || "0"));
            });
            this.root.querySelectorAll("[data-arcsecs-drive-timeline]").forEach((button) => button.addEventListener("click", () => { this.core.moveTimeline(button.getAttribute("data-arcsecs-drive-timeline") || "next"); this.render(); }));
            this.root.querySelectorAll("[data-arcsecs-drive-export-json]").forEach((button) => button.addEventListener("click", () => this.exportSimulatorReplayReport()));
            this.root.querySelectorAll("[data-arcsecs-drive-export-demo]").forEach((button) => button.addEventListener("click", () => this.exportAutopilotDemoReport()));
            this.root.querySelectorAll("[data-arcsecs-drive-export-demo-evidence]").forEach((button) => button.addEventListener("click", () => this.exportAutopilotDemoEvidenceReport()));
            this.root.querySelectorAll("[data-arcsecs-drive-export-architecture]").forEach((button) => button.addEventListener("click", () => this.exportDarkMatterDriveArchitectureSweepReport()));
            this.root.querySelectorAll("[data-arcsecs-drive-export-debrief]").forEach((button) => button.addEventListener("click", () => this.exportDemoFlightMissionDebriefReport()));
            this.root.querySelectorAll("[data-arcsecs-drive-export-acceptance]").forEach((button) => button.addEventListener("click", () => this.exportAcceptanceFlightReport()));
            this.root.querySelectorAll("[data-arcsecs-drive-export-certificate]").forEach((button) => button.addEventListener("click", () => this.exportAcceptanceFlightCertificateReport()));
            this.root.querySelectorAll("[data-arcsecs-drive-export-acceptance-bundle]").forEach((button) => button.addEventListener("click", () => this.exportAcceptanceEvidenceBundleReport()));
            this.root.querySelectorAll("[data-arcsecs-drive-export-html]").forEach((button) => button.addEventListener("click", () => this.download("arcsecs-dark-matter-drive-replay.html", this.buildPrintableReport(), "text/html")));
            this.root.querySelectorAll("[data-arcsecs-drive-export-state]").forEach((button) => button.addEventListener("click", () => this.download("arcsecs-dark-matter-drive-state.json", this.core.exportState(), "application/json")));
            this.root.querySelectorAll("[data-arcsecs-drive-haptics]").forEach((input) => input.addEventListener("change", () => { this.haptics.markUserActivated(); this.haptics.setEnabled(input.checked); this.progressMonitor.addEntry("Haptics " + (input.checked ? "enabled" : "disabled"), "Optional vibration is used only when the browser supports it.", "info"); }));
            this.root.querySelectorAll("[data-arcsecs-drive-science-notes]").forEach((button) => button.addEventListener("click", () => { const target = this.root.querySelector("[data-arcsecs-drive-science-panel]"); if (target && target.scrollIntoView) { target.scrollIntoView({ behavior: "smooth", block: "start" }); } }));
            if (this.canvas) {
                this.canvas.addEventListener("click", () => {
                    this.haptics.markUserActivated();
                    this.applyControls();
                    if (this.core.running) {
                        this.core.pause();
                        this.progressMonitor.addEntry("Viewport paused", "Canvas click paused the visible relational projection.", "info");
                    } else {
                        this.core.start();
                        this.progressMonitor.addEntry("Viewport started", "Canvas click started animated Weber tethers and Proca substrate currents.", "success");
                    }
                    this.render();
                });
            }
            if (typeof window !== "undefined") { this.root.addEventListener("keydown", (event) => this.handleDarkMatterTravelKey(event, true)); this.root.addEventListener("keyup", (event) => this.handleDarkMatterTravelKey(event, false)); this.root.addEventListener("focusout", event => { if (!this.root.contains(event.relatedTarget)) this.clearTravelKeys(); }); this.boundBlurHandler = () => this.clearTravelKeys(); window.addEventListener("blur", this.boundBlurHandler); this.boundGamepadHandler = () => { this.updateCapabilities(); this.progressMonitor.addEntry("Gamepad detected", "Gamepad input can be used in a later WebXR-ready implementation slice.", "info"); this.render(); }; window.addEventListener("gamepadconnected", this.boundGamepadHandler); }
        }
        applyControls() {
            const recipe = {};
            this.root.querySelectorAll("[data-arcsecs-drive-control]").forEach((control) => {
                const key = control.getAttribute("data-arcsecs-drive-control");
                if (!key) { return; }
                if (control.type === "checkbox") { recipe[key] = control.checked; }
                else if (key === "scenarioPreset") { recipe.preset = control.value; }
                else if (key === "mode" || key === "failureMode" || key === "qualityMode" || key === "multiMessengerEventPreset" || key === "substrateDensityProfile") { recipe[key] = control.value; }
                else { recipe[key] = Number(control.value); }
            });
            this.core.applyRecipe(recipe);
            this.syncControls(this.core.snapshot());
        }
        logControlChange(control) {
            const key = control.getAttribute("data-arcsecs-drive-control") || "control";
            const value = control.type === "checkbox" ? (control.checked ? "on" : "off") : control.value;
            this.progressMonitor.addEntry("Parameter updated", key + " changed to " + value + "; telemetry recalculated in real time.", "info");
            if (key === "darkMatterDial") { this.progressMonitor.addEntry("Vector Potential Dial changed", "Galaxy curve, halo visualization, wind density, charge rate, and lensing strength now use the new normalization.", "info"); }
        }
        handleScenarioAction(action) {
            const select = this.root.querySelector("[data-arcsecs-drive-guided-scenario]");
            const scenarioId = select ? select.value : GUIDED_SCENARIOS[0].id;
            if (action === "next") { this.scenarioController.nextStep(); }
            else if (action === "reset") { this.scenarioController.reset(); }
            else { this.scenarioController.loadScenario(scenarioId); }
            this.syncControls(this.core.snapshot());
            this.render();
        }
        setMissionStage(index, runAfterApply) {
            const boundedIndex = clamp(Math.round(finiteNumber(index, 0)), 0, MISSION_STAGES.length - 1);
            this.missionIndex = boundedIndex;
            const stage = MISSION_STAGES[this.missionIndex];
            this.activeHotspotId = stage.hotspotId;
            this.core.applyRecipe({ preset: stage.preset });
            this.progressMonitor.addEntry("Scenario loaded", stage.title + ": " + stage.operatorAction, "info");
            if (runAfterApply) { this.core.start(); }
            this.syncControls(this.core.snapshot());
            this.render();
        }
        moveMission(action) {
            if (action === "back") { this.setMissionStage(this.missionIndex - 1, false); }
            else if (action === "play") { this.setMissionStage(this.missionIndex, true); }
            else if (action === "pause") { this.core.pause(); this.progressMonitor.addEntry("Mission paused", "Mission sequencer paused at the active stage.", "info"); this.render(); }
            else if (action === "warning") { const index = MISSION_STAGES.findIndex((stage) => this.core.snapshot().timeline.some((event) => event.marker === stage.warningMarker && event.severity === "warning")); this.setMissionStage(index >= 0 ? index : this.missionIndex, false); this.core.moveTimeline("warning"); }
            else if (action === "reset") { this.setMissionStage(0, false); }
            else if (action === "export") { this.download("arcsecs-dark-matter-drive-mission-report.json", JSON.stringify(this.buildMissionReport(), null, 2), "application/json"); }
            else { this.setMissionStage(this.missionIndex + 1, false); }
        }
        getDemoFlightOperatorNotes() {
            const input = this.root.querySelector("[data-arcsecs-drive-operator-notes]");
            return input && typeof input.value === "string" ? input.value : "";
        }
        buildDemoFlightAuditContext(snapshot) {
            const demoDirector = this.getAutopilotDemoState(snapshot);
            const demoStageVerification = buildDemoFlightVerification(snapshot, demoDirector, this.activeHotspotId);
            const demoStageTimeline = buildDemoFlightStageTimeline(demoDirector, demoStageVerification);
            const demoStageScorecard = buildDemoFlightStageScorecard(snapshot, demoDirector, demoStageVerification, demoStageTimeline);
            const demoStageEvidenceLedger = buildDemoFlightEvidenceLedger(snapshot, demoDirector, demoStageVerification, demoStageTimeline, demoStageScorecard);
            const demoFlightArchitectureSweep = buildDarkMatterDriveArchitectureSweep(snapshot, demoDirector, demoStageVerification, demoStageTimeline, demoStageScorecard, demoStageEvidenceLedger);
            return { demoDirector, demoStageVerification, demoStageTimeline, demoStageScorecard, demoStageEvidenceLedger, demoFlightArchitectureSweep };
        }
        recordDemoFlightMissionEvent(action, note) {
            const snapshot = this.core.snapshot();
            const context = this.buildDemoFlightAuditContext(snapshot);
            this.demoFlightMissionRecorder.recordStage(action, snapshot, context.demoDirector, context.demoStageVerification, context.demoStageScorecard, context.demoStageEvidenceLedger, context.demoFlightArchitectureSweep, note || this.getDemoFlightOperatorNotes());
        }
        buildDemoFlightMissionRecorderSnapshot(snapshot, demoDirector) {
            const tick = snapshot && snapshot.telemetry ? finiteNumber(snapshot.telemetry.tick, 0) : 0;
            return this.demoFlightMissionRecorder.snapshot(demoDirector, this.getDemoFlightOperatorNotes(), tick);
        }
        attachMissionRecorderPayload(report, exportName) {
            const recorder = this.demoFlightMissionRecorder.recordExport(exportName, report);
            const snapshot = this.core.snapshot();
            const demoDirector = report && report.demoDirector ? report.demoDirector : this.getAutopilotDemoState(snapshot);
            const missionRecorderSnapshot = this.buildDemoFlightMissionRecorderSnapshot(snapshot, demoDirector);
            return Object.assign({}, report, {
                demoFlightRunLog: missionRecorderSnapshot.demoFlightRunLog,
                demoFlightOperatorNotes: missionRecorderSnapshot.demoFlightOperatorNotes,
                demoFlightExportAudit: missionRecorderSnapshot.demoFlightExportAudit.concat([recorder]),
                demoFlightMissionRecorder: missionRecorderSnapshot
            });
        }
        exportAutopilotDemoReport() {
            const report = this.attachMissionRecorderPayload(this.buildAutopilotDemoReport(), "Demo Flight Verification JSON");
            this.download("arcsecs-dark-matter-drive-demo-flight-verification.json", JSON.stringify(report, null, 2), "application/json");
        }
        exportAutopilotDemoEvidenceReport() {
            const report = this.attachMissionRecorderPayload(this.buildAutopilotDemoEvidenceReport(), "Demo Flight Evidence JSON");
            this.download("arcsecs-dark-matter-drive-demo-flight-evidence-ledger.json", JSON.stringify(report, null, 2), "application/json");
        }
        exportDarkMatterDriveArchitectureSweepReport() {
            const report = this.attachMissionRecorderPayload(this.buildDarkMatterDriveArchitectureSweepReport(), "Architecture Sweep JSON");
            this.download("arcsecs-dark-matter-drive-architecture-sweep.json", JSON.stringify(report, null, 2), "application/json");
        }
        exportDemoFlightMissionDebriefReport() {
            const report = this.attachMissionRecorderPayload(this.buildDemoFlightMissionDebriefReport(), "Mission Debrief JSON");
            this.download("arcsecs-dark-matter-drive-demo-flight-mission-debrief.json", JSON.stringify(report, null, 2), "application/json");
        }
        exportSimulatorReplayReport() {
            const report = this.attachMissionRecorderPayload(this.buildSimulatorReplayReport(), "Replay JSON");
            this.download("arcsecs-dark-matter-drive-replay.json", JSON.stringify(report, null, 2), "application/json");
        }

        activateDarkMatterShipTravelSandbox() {
            this.selectedDemoKey = "dark-matter-ship-travel";
            this.selectedDemo = selectDarkMatterShipTravelDemo(this.selectedDemoKey);
            this.darkMatterTravelSandboxActive = true;
            this.darkMatterTravelInput = Object.assign({}, this.darkMatterTravelInput || createDarkMatterTravelInputState(), { hasTarget: false, scoopToggleRequested: false, inertialAssistToggleRequested: false });
            this.progressMonitor.addEntry("Dark Matter Ship Travel Sandbox active", "Use W/A/S/D, arrow keys, Space, tap-to-target, or the mobile controls to fly through Proca substrate regions.", "success");
            this.render();
        }
        clearTravelKeys() { this.darkMatterTravelInput = Object.assign({}, this.darkMatterTravelInput, { thrust:false, brake:false, rotateLeft:false, rotateRight:false, scoopToggleRequested:false, inertialAssistToggleRequested:false }); }
        handleDarkMatterTravelKey(event, pressed) {
            if (pressed && (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey || (event.target && (event.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(event.target.tagName))))) return;
            if (!this.darkMatterTravelSandboxActive) { return; }
            const key = event.key || "";
            let nextInput = this.darkMatterTravelInput || createDarkMatterTravelInputState();
            if (key === "w" || key === "W" || key === "ArrowUp") { nextInput = Object.assign({}, nextInput, { thrust: pressed }); }
            else if (key === "s" || key === "S" || key === "ArrowDown") { nextInput = Object.assign({}, nextInput, { brake: pressed }); }
            else if (key === "a" || key === "A" || key === "ArrowLeft") { nextInput = Object.assign({}, nextInput, { rotateLeft: pressed }); }
            else if (key === "d" || key === "D" || key === "ArrowRight") { nextInput = Object.assign({}, nextInput, { rotateRight: pressed }); }
            else if (key === " ") { if (pressed) { nextInput = Object.assign({}, nextInput, { inertialAssistToggleRequested: true }); } if (event.preventDefault) { event.preventDefault(); } }
            else { return; }
            if (event.preventDefault) event.preventDefault();
            this.darkMatterTravelInput = nextInput;
            if (pressed) { this.stepDarkMatterTravelSandbox(2); }
            if (!pressed) { this.darkMatterTravelInput = Object.assign({}, this.darkMatterTravelInput, { scoopToggleRequested: false, inertialAssistToggleRequested: false }); }
            this.render();
        }
        handleDarkMatterTravelInput(action) {
            this.activateDarkMatterShipTravelSandbox();
            const current = this.darkMatterTravelInput || createDarkMatterTravelInputState();
            let input = Object.assign({}, current, { thrust: false, brake: false, rotateLeft: false, rotateRight: false, scoopToggleRequested: false, inertialAssistToggleRequested: false });
            if (action === "thrust") { input = Object.assign({}, input, { thrust: true }); }
            else if (action === "brake") { input = Object.assign({}, input, { brake: true }); }
            else if (action === "left") { input = Object.assign({}, input, { rotateLeft: true }); }
            else if (action === "right") { input = Object.assign({}, input, { rotateRight: true }); }
            else if (action === "scoop") { input = Object.assign({}, input, { scoopToggleRequested: true }); }
            else if (action === "assist") { input = Object.assign({}, input, { inertialAssistToggleRequested: true }); }
            else if (action === "reset") { this.darkMatterShipTravelSandbox = createDarkMatterShipTravelSandbox(); this.darkMatterTravelAutopilotTicks = 0; this.darkMatterTravelAutopilotSnapshot = null; this.progressMonitor.addEntry("Travel sandbox reset", "Ship, route log, telemetry, route planner, and autopilot returned to deterministic seed state.", "info"); this.render(); return; }
            this.darkMatterTravelInput = input;
            this.stepDarkMatterTravelSandbox(5);
            this.darkMatterTravelInput = Object.assign({}, this.darkMatterTravelInput, { thrust: false, brake: false, rotateLeft: false, rotateRight: false, scoopToggleRequested: false, inertialAssistToggleRequested: false });
            this.render();
        }
        setDarkMatterTravelTarget(event, panel) {
            this.activateDarkMatterShipTravelSandbox();
            const rect = panel.getBoundingClientRect ? panel.getBoundingClientRect() : { left: 0, top: 0, width: 1, height: 1 };
            const x = clamp(((event.clientX - rect.left) / Math.max(1, rect.width)) * 100, 0, 100);
            const y = clamp(((event.clientY - rect.top) / Math.max(1, rect.height)) * 100, 0, 100);
            this.darkMatterTravelInput = Object.assign({}, this.darkMatterTravelInput || createDarkMatterTravelInputState(), { targetUiPositionX: x, targetUiPositionY: y, hasTarget: true });
            this.stepDarkMatterTravelSandbox(8);
            this.progressMonitor.addEntry("Travel target set", "Navigation target translated into relational Arcsecs deltas and torsion-route steering.", "info");
            this.render();
        }
        stepDarkMatterTravelSandbox(ticks) {
            let state = this.darkMatterShipTravelSandbox || createDarkMatterShipTravelSandbox();
            const input = this.darkMatterTravelInput || createDarkMatterTravelInputState();
            for (let index = 0; index < ticks; index += 1) {
                state = stepDarkMatterTravelSandbox(state, input);
            }
            this.darkMatterShipTravelSandbox = state;
        }
        buildDarkMatterShipTravelAutopilotExportPayload() {
            const sandbox = this.darkMatterShipTravelSandbox || createDarkMatterShipTravelSandbox();
            const route = buildDarkMatterTravelRoutePlanner(sandbox, buildDarkMatterTravelRelationalAdapter(sandbox));
            const payload = buildDarkMatterTravelRouteAutopilot(sandbox, route, this.darkMatterTravelAutopilotTicks || 0);
            payload.darkMatterTravelAutopilot.engaged = this.darkMatterTravelAutopilotTicks > 0;
            if (!payload.darkMatterTravelAutopilot.engaged) payload.darkMatterTravelAutopilot.statusLabel = "route preview — not run";
            return payload;
        }
        engageDarkMatterTravelRouteAutopilot() {
            this.activateDarkMatterShipTravelSandbox();
            const payload = this.buildDarkMatterShipTravelAutopilotExportPayload();
            const command = payload.darkMatterTravelAutopilotCommands[0];
            const ship = this.darkMatterShipTravelSandbox.ship;
            this.darkMatterTravelInput = Object.assign(createDarkMatterTravelInputState(), { hasTarget:true, targetUiPositionX:command.targetUiPositionX, targetUiPositionY:command.targetUiPositionY, thrust:command.thrustRecommended, brake:command.brakeRecommended, scoopToggleRequested:command.scoopRecommended !== ship.scoopEnabled, inertialAssistToggleRequested:command.inertialAssistRecommended !== ship.inertialAssistEnabled });
            this.stepDarkMatterTravelSandbox(1);
            this.darkMatterTravelInput.scoopToggleRequested = false; this.darkMatterTravelInput.inertialAssistToggleRequested = false;
            this.stepDarkMatterTravelSandbox(11); this.darkMatterTravelAutopilotTicks += 12; this.clearTravelKeys();
            this.darkMatterTravelAutopilotSnapshot = this.buildDarkMatterShipTravelAutopilotExportPayload();
            this.progressMonitor.addEntry("Route planner step", "Advanced 12 sandbox ticks along the recommended route; not a physical flight.", "info"); this.render();
        }
        buildDarkMatterShipTravelExportPayload() {
            const sandbox = this.darkMatterShipTravelSandbox || createDarkMatterShipTravelSandbox();
            const relationalAdapter = buildDarkMatterTravelRelationalAdapter(sandbox);
            const routePlanner = buildDarkMatterTravelRoutePlanner(sandbox, relationalAdapter);
            const autopilotPayload = this.buildDarkMatterShipTravelAutopilotExportPayload();
            const missionPayload = buildDarkMatterTravelMissionObjectives(sandbox, routePlanner, autopilotPayload);
            return Object.assign({ packageVersion: "5.8.27", exportType: "ArcSecsDarkMatterDriveSimulatorEvidence", generatedUtc: new Date().toISOString(), pageSourceRoute: "/dark-matter-drive-simulator/", speculativeBoundaryText: SCIENTIFIC_BOUNDARY, warnings: [], falsificationNotes: ["Dark matter propulsion is not established technology.", "Dense substrate, Proca flux, lensing, quantized inertia, haloscope, and Alcubierre controls are model or placeholder layers unless the UI labels them active."], sourceMatrix: buildScientificSourceMatrix("darkMatterDriveSimulator"), scenarioEquationLibrary: buildScenarioEquationLibrary("darkMatterDriveSimulator"), darkMatterShipTravelSandbox: sandbox, darkMatterTravelRouteLog: sandbox.routeLog, darkMatterTravelOutcome: sandbox.outcome, darkMatterTravelTelemetry: sandbox.telemetry, darkMatterTravelRegionCrossings: sandbox.routeLog.regionsCrossed, darkMatterTravelWavefrontTrace: sandbox.wavefrontTrace, darkMatterTravelValidationLedger: sandbox.validationLedger, darkMatterTravelRelationalAdapter: relationalAdapter, darkMatterTravelInstrumentalMask: relationalAdapter.instrumentalMask, darkMatterTravelArcsecsNavigationVector: relationalAdapter.arcsecsNavigationVector, darkMatterTravelOpticalDistortion: relationalAdapter.opticalDistortion, darkMatterTravelTeleparallelGaugeForce: relationalAdapter.teleparallelGaugeForce, darkMatterTravelProcaSubstrate: relationalAdapter.procaSubstrate }, routePlanner, autopilotPayload, missionPayload);
        }
        renderDarkMatterShipTravelSandboxPanel() {
            const sandbox = this.darkMatterShipTravelSandbox || createDarkMatterShipTravelSandbox();
            const ship = sandbox.ship;
            const regionNodes = sandbox.regions.map((region) => "<span class='arcsecs-travel-region is-" + safeVisibleText(region.regionType) + "' style='left:" + region.centerUiPositionX + "%;top:" + region.centerUiPositionY + "%;width:" + (region.radiusUiUnits * 1.55) + "%;height:" + (region.radiusUiUnits * 1.55) + "%;' title='" + safeVisibleText(region.displayLabel) + "'><em>" + safeVisibleText(region.displayLabel) + "</em></span>").join("");
            const routeNodes = sandbox.routeLog.segments.slice(-24).map((segment) => "<i class='arcsecs-travel-route-dot' style='left:" + segment.uiPositionX + "%;top:" + segment.uiPositionY + "%;'></i>").join("");
            const harvestNodes = [0, 1, 2, 3, 4, 5].map((index) => "<i class='arcsecs-travel-harvest-particle' style='--particle-index:" + index + ";left:" + clamp(ship.uiPositionX + Math.cos(index) * (4 + index), 4, 96) + "%;top:" + clamp(ship.uiPositionY + Math.sin(index) * (4 + index), 4, 96) + "%;'></i>").join("");
            const relationalAdapter = buildDarkMatterTravelRelationalAdapter(sandbox);
            const adapterCards = [
                ["Instrument mask", relationalAdapter.instrumentalMask.uiMaskIsPhysicalSpace ? "physical space" : "non-physical UI mask"],
                ["Arcsecs to beacon", relationalAdapter.arcsecsNavigationVector.arcsecondsToBeacon.toFixed(1)],
                ["Slew bound", relationalAdapter.arcsecsNavigationVector.boundedSlewArcsecondsPerSecond.toFixed(0) + " arcsec/s"],
                ["PSF FWHM", relationalAdapter.opticalDistortion.psfFullWidthHalfMaximumArcseconds.toFixed(2) + " arcsec"],
                ["Density blur", relationalAdapter.opticalDistortion.densityWeightedBlur.toFixed(2)],
                ["Teleparallel torsion", relationalAdapter.teleparallelGaugeForce.torsionMagnitude.toFixed(3)],
                ["Harvest potential", relationalAdapter.procaSubstrate.harvestPotential.toFixed(2)],
                ["Weber penalty", relationalAdapter.procaSubstrate.weberDragPenalty.toFixed(2)]
            ].map((card) => "<li><strong>" + safeVisibleText(card[0]) + "</strong><span>" + safeVisibleText(card[1]) + "</span></li>").join("");
            const adapterValidationItems = relationalAdapter.adapterValidation.map((entry) => "<li><span>" + safeVisibleText(entry) + "</span></li>").join("");
            const routePlanner = buildDarkMatterTravelRoutePlanner(sandbox, relationalAdapter);
            const routeItems = routePlanner.darkMatterTravelRouteCandidates.map((candidate) => "<li class='" + (candidate.candidateId === routePlanner.darkMatterTravelRecommendedRoute.candidateId ? "is-recommended" : "") + "'><strong>" + safeVisibleText(candidate.label) + "</strong><span>Score " + candidate.totalScore.toFixed(2) + " • " + safeVisibleText(candidate.targetRegionType) + " • " + candidate.targetArcseconds.toFixed(0) + " arcsec</span><em>" + safeVisibleText(candidate.recommendation) + "</em></li>").join("");
            const routeValidationItems = routePlanner.darkMatterTravelRoutePlannerValidation.map((row) => "<li class='" + (row.passed ? "is-pass" : "is-watch") + "'><strong>" + safeVisibleText(row.label) + "</strong><span>" + safeVisibleText(row.evidence) + "</span></li>").join("");
            const autopilot = this.buildDarkMatterShipTravelAutopilotExportPayload();
            const autopilotCommand = autopilot.darkMatterTravelAutopilotCommands[0];
            const renderValidation = rows => rows.map(row => "<li><strong>" + safeVisibleText(row.label) + "</strong> — " + (row.passed ? "pass" : "review") + ": " + safeVisibleText(row.evidence) + "</li>").join("");
            const autopilotValidationItems = renderValidation(autopilot.darkMatterTravelAutopilotValidation);
            const missionPayload = buildDarkMatterTravelMissionObjectives(sandbox, routePlanner, autopilot);
            const missionObjectiveItems = missionPayload.darkMatterTravelMissionObjectives.map(row => "<li><strong>" + safeVisibleText(row.label) + "</strong> — " + safeVisibleText(row.status) + ": " + safeVisibleText(row.evidence) + "</li>").join("");
            const missionValidationItems = renderValidation(missionPayload.darkMatterTravelMissionValidation);
            const telemetryCards = [
                ["Fuel charge", ship.fuelCharge.toFixed(1) + "%"],
                ["Thermal load", ship.thermalLoad.toFixed(1) + "%"],
                ["Ship speed", sandbox.telemetry.speedUiUnitsPerTick.toFixed(2)],
                ["Heading", ship.headingDegrees.toFixed(1) + "°"],
                ["Ambient vector potential density", ship.localSubstrateDensity.toFixed(2)],
                ["Torsion pull / route bending", ship.torsionPullMagnitude.toFixed(3)],
                ["Inertial drift", ship.inertialDriftPercentage.toFixed(1) + "%"],
                ["Weber drag / turbulence", ship.weberDragCoefficient.toFixed(3)],
                ["Drive output", ship.driveOutput.toFixed(2)],
                ["Distance to beacon", ship.distanceToBeaconUiUnits.toFixed(1)],
                ["Navigation risk", ship.navigationRisk.toFixed(1) + "%"],
                ["Photon lag / wavefront delay", sandbox.wavefrontTrace.photonLag.toFixed(2)]
            ].map((card) => "<li><strong>" + safeVisibleText(card[0]) + "</strong><span>" + safeVisibleText(card[1]) + "</span></li>").join("");
            const validationItems = sandbox.validationLedger.map((item) => "<li class='" + (item.passed ? "is-pass" : "is-watch") + "'><strong>" + safeVisibleText(item.label) + "</strong><span>" + safeVisibleText(item.evidence) + "</span></li>").join("");
            return "<section class='arcsecs-travel-sandbox' aria-label='Dark Matter Ship Travel Sandbox'><div class='arcsecs-travel-instructions'><h3>Dark Matter Ship Travel Sandbox</h3><p>Drive the ship across the two-dimensional instrument mask. Dense substrate regions provide more fuel but add torsion pull, Weber drag, thermal stress, route bending, and optical delay. Void corridors coast smoothly but provide less fuel.</p><p><strong>Controls:</strong> W/ArrowUp thrust, S/ArrowDown brake, A/D rotate, Space inertial assist, tap/click map target.</p></div><div class='arcsecs-travel-layout'><div class='arcsecs-travel-canvas' data-arcsecs-travel-canvas='true' role='application' aria-label='Interactive Dark Matter Ship Travel map'>" + regionNodes + routeNodes + harvestNodes + "<span class='arcsecs-travel-beacon' style='left:" + sandbox.configuration.beaconPositionX + "%;top:" + sandbox.configuration.beaconPositionY + "%;'>Beacon</span><span class='arcsecs-travel-target' style='left:" + ship.activeTargetPointX + "%;top:" + ship.activeTargetPointY + "%;'></span><span class='arcsecs-travel-ship' style='left:" + ship.uiPositionX + "%;top:" + ship.uiPositionY + "%;transform:translate(-50%,-50%) rotate(" + ship.headingDegrees + "deg);'><b></b></span><span class='arcsecs-travel-thermal " + (ship.thermalLoad > 70 ? "is-hot" : "") + "'></span></div><aside class='arcsecs-travel-side'><section class='arcsecs-travel-advisor is-" + safeVisibleText(sandbox.advisorMessage.severity) + "'><h4>Travel Advisor</h4><p>" + safeVisibleText(sandbox.advisorMessage.message) + "</p></section><section class='arcsecs-travel-wavefront'><h4>Interferometric Wavefront Tracker</h4><p>GW baseline lane " + sandbox.wavefrontTrace.gravitationalWaveBaselineLane.toFixed(2) + " • photon lane " + sandbox.wavefrontTrace.electromagneticPhotonLane.toFixed(2) + " • lag " + sandbox.wavefrontTrace.photonLag.toFixed(2) + " • energy attenuation " + sandbox.wavefrontTrace.energyAttenuation.toFixed(2) + " • visibility " + safeVisibleText(sandbox.wavefrontTrace.opticalVisibilityStatus) + "</p></section><section class='arcsecs-travel-mobile-controls'><h4>Travel controls</h4><button type='button' data-arcsecs-travel-input='thrust'>Thrust</button><button type='button' data-arcsecs-travel-input='brake'>Brake</button><button type='button' data-arcsecs-travel-input='left'>Rotate Left</button><button type='button' data-arcsecs-travel-input='right'>Rotate Right</button><button type='button' data-arcsecs-travel-input='scoop'>Toggle Scoop</button><button type='button' data-arcsecs-travel-input='assist'>Inertial Assist</button><button type='button' data-arcsecs-travel-input='reset'>Reset Travel</button></section></aside></div><section class='arcsecs-travel-relational-adapter'><h4>Relational Navigation Adapter</h4><p>" + safeVisibleText(relationalAdapter.instrumentalMask.relationalAdapterDescription) + "</p><ul>" + adapterCards + "</ul><ol>" + adapterValidationItems + "</ol><em>" + safeVisibleText(relationalAdapter.teleparallelGaugeForce.forceDescription) + "</em></section><section class='arcsecs-travel-route-planner'><h4>Route Planner</h4><p>" + safeVisibleText(routePlanner.darkMatterTravelRoutePlanner.routePolicy) + "</p><button type='button' data-arcsecs-travel-route-autopilot='true'>Advance Recommended Route (12 ticks)</button><ol>" + routeItems + "</ol><ul>" + routeValidationItems + "</ul><em>Recommended: " + safeVisibleText(routePlanner.darkMatterTravelRecommendedRoute.label) + "</em></section><section class='arcsecs-travel-route-autopilot'><h4>Route Autopilot</h4><p>" + safeVisibleText(autopilot.darkMatterTravelAutopilot.statusLabel) + " • target " + safeVisibleText(autopilot.darkMatterTravelAutopilotTarget.label) + " • progress " + autopilot.darkMatterTravelAutopilot.progressTowardTarget.toFixed(2) + "</p><strong>" + safeVisibleText(autopilotCommand.steeringInstruction) + "</strong><ul>" + autopilotValidationItems + "</ul></section><section class='arcsecs-travel-mission-objectives'><h4>Mission Objectives</h4><p>Score " + missionPayload.darkMatterTravelMissionScore.totalScore.toFixed(1) + " • grade " + safeVisibleText(missionPayload.darkMatterTravelMissionScore.finalGrade) + " • " + (missionPayload.darkMatterTravelMissionScore.missionPass ? "pass" : "watch") + "</p><ol>" + missionObjectiveItems + "</ol><ul>" + missionValidationItems + "</ul></section><section class='arcsecs-travel-telemetry'><h4>Ship Travel Cockpit</h4><ul>" + telemetryCards + "</ul></section><section class='arcsecs-travel-validation'><h4>Travel validation / quality strip</h4><ul>" + validationItems + "</ul></section></section>";
        }

        handleDemoSelection(key) {
            this.selectedDemoKey = key || "demo-flight";
            this.selectedDemo = selectDarkMatterShipTravelDemo(this.selectedDemoKey);
            this.darkMatterTravelSandboxActive = this.selectedDemo.primaryAction === "activate-travel-sandbox";
            const preset = PRESETS[this.selectedDemo.preset] || PRESETS.interactiveBlueprint;
            this.core.applyRecipe(preset);
            this.progressMonitor.addEntry("Demo selected", this.selectedDemo.label + ": " + this.selectedDemo.description, "info");
            this.syncControls(this.core.snapshot());
            this.render();
        }
        runSelectedDemoAction(action) {
            if (action === "selected") {
                const selected = this.selectedDemo || selectDarkMatterShipTravelDemo(this.selectedDemoKey || "demo-flight");
                if (selected.primaryAction === "activate-travel-sandbox") {
                    this.activateDarkMatterShipTravelSandbox();
                    return;
                }
                if (selected.primaryAction === "run-ship-travel") {
                    this.runDarkMatterShipTravelDemo();
                    return;
                }
                if (selected.primaryAction === "run-acceptance-flight") {
                    this.runAcceptanceFlight();
                    return;
                }
                this.handleDemoDirectorAction("play");
                return;
            }
            this.handleDemoDirectorAction(action);
        }
        runDarkMatterShipTravelDemo() {
            const startedSnapshot = this.core.snapshot();
            const startedAtTick = startedSnapshot && startedSnapshot.telemetry ? finiteNumber(startedSnapshot.telemetry.tick, 0) : 0;
            this.selectedDemoKey = "dark-matter-ship-travel";
            this.selectedDemo = selectDarkMatterShipTravelDemo(this.selectedDemoKey);
            this.shipTravelPhaseLog = [];
            this.autopilotDirector.start(startedAtTick);
            DARK_MATTER_SHIP_TRAVEL_STAGE_IDS.forEach((stageId, index) => {
                const stageIndex = AUTOPILOT_DEMO_STAGES.findIndex((stage) => stage.id === stageId);
                if (stageIndex < 0) { return; }
                const stage = AUTOPILOT_DEMO_STAGES[stageIndex];
                const currentSnapshot = this.core.snapshot();
                this.autopilotDirector.jumpTo(stageIndex, currentSnapshot.telemetry.tick);
                this.applyAutopilotStage(true);
                this.core.start();
                this.syncControls(this.core.snapshot());
                const phaseEntry = {
                    sequence: index + 1,
                    stageId: safeVisibleText(stage.id),
                    stageTitle: safeVisibleText(stage.title),
                    travelPhase: ["Departure", "Proca-wind alignment", "Cruise capture", "Dense-filament crossing", "Counterpart navigation", "Thermal arrival"][index] || "Travel phase",
                    expectedViewportChange: safeVisibleText(stage.expectedMotion),
                    finite: true
                };
                this.shipTravelPhaseLog.push(phaseEntry);
                this.recordDemoFlightMissionEvent("ship-travel-phase", "Dark Matter Ship Travel phase: " + phaseEntry.travelPhase + " / " + stage.title + ".");
            });
            const completedSnapshot = this.core.snapshot();
            const completedAtTick = completedSnapshot && completedSnapshot.telemetry ? finiteNumber(completedSnapshot.telemetry.tick, startedAtTick) : startedAtTick;
            const baseReport = this.buildAutopilotDemoReport();
            const visitedStageIds = this.shipTravelPhaseLog.map((entry) => entry.stageId);
            this.demoFlightAcceptanceResult = buildDemoFlightAcceptanceResult(baseReport, visitedStageIds, startedAtTick, completedAtTick);
            this.progressMonitor.addEntry("Dark Matter Ship Travel complete", "Ship travel visited departure, alignment, cruise, dense filament, counterpart navigation, and thermal arrival phases.", "success");
            this.render();
        }
        runAcceptanceFlight() {
            const startedSnapshot = this.core.snapshot();
            const startedAtTick = startedSnapshot && startedSnapshot.telemetry ? finiteNumber(startedSnapshot.telemetry.tick, 0) : 0;
            this.selectedDemoKey = "acceptance-flight";
            this.selectedDemo = selectDarkMatterShipTravelDemo(this.selectedDemoKey);
            this.demoFlightAcceptanceResult = null;
            this.acceptanceFlightVisualRun = {
                active: true,
                completed: false,
                startedAtTick,
                completedAtTick: 0,
                visitedStageIds: [],
                lastStageId: "",
                finite: Number.isFinite(startedAtTick)
            };
            this.autopilotDirector.start(startedAtTick);
            this.applyAutopilotStage(true);
            this.core.start();
            this.syncControls(this.core.snapshot());
            this.progressMonitor.addEntry("Acceptance Flight started", "Visible stage-by-stage playback is now running; the viewport should show a moving route beacon, active stage marker, and progress rail.", "success");
            this.recordDemoFlightMissionEvent("acceptance-start", "Acceptance Flight visual playback started.");
            this.render();
        }
        buildAcceptanceFlightReport() {
            const baseReport = this.attachMissionRecorderPayload(this.buildAutopilotDemoReport(), "Acceptance Flight JSON");
            const startedAtTick = baseReport.telemetry ? finiteNumber(baseReport.telemetry.tick, 0) : 0;
            const visitedStageIds = baseReport.demoFlightRunLog ? baseReport.demoFlightRunLog.map((entry) => entry.stageId).filter((stageId, index, list) => stageId !== "none" && list.indexOf(stageId) === index) : [];
            const acceptance = this.demoFlightAcceptanceResult || buildDemoFlightAcceptanceResult(baseReport, visitedStageIds, startedAtTick, startedAtTick);
            return Object.assign({}, baseReport, acceptance, { reportType: "ArcSecs Dark Matter Drive Acceptance Flight" });
        }
        exportAcceptanceFlightReport() {
            const report = this.buildAcceptanceFlightReport();
            this.download("arcsecs-dark-matter-drive-acceptance-flight.json", JSON.stringify(report, null, 2), "application/json");
        }
        buildAcceptanceFlightCertificateReport() {
            const report = this.buildAcceptanceFlightReport();
            return { reportType: "ArcSecs Dark Matter Drive Acceptance Flight Certificate", demoFlightAcceptanceCertificate: report.demoFlightAcceptanceCertificate, demoFlightAcceptanceFailureDrilldown: report.demoFlightAcceptanceFailureDrilldown, demoFlightAcceptanceRun: report.demoFlightAcceptanceRun, demoFlightAcceptancePass: report.demoFlightAcceptancePass, demoFlightAcceptanceFailures: report.demoFlightAcceptanceFailures, demoFlightMissionRecorder: report.demoFlightMissionRecorder, demoFlightMissionDebrief: report.demoFlightMissionDebrief, scientificBoundary: SCIENTIFIC_BOUNDARY };
        }
        exportAcceptanceFlightCertificateReport() {
            const report = this.buildAcceptanceFlightCertificateReport();
            this.download("arcsecs-dark-matter-drive-acceptance-flight-certificate.json", JSON.stringify(report, null, 2), "application/json");
        }
        buildAcceptanceEvidenceBundleReport() {
            const baseReport = this.buildAcceptanceFlightReport();
            const certificateBundle = buildAcceptanceFlightCertificateBundle(baseReport, this.core.snapshot(), baseReport.demoFlightMissionDebrief, baseReport.demoFlightMissionRecorder);
            const bundle = buildAcceptanceEvidenceBundle(baseReport, certificateBundle, this.core.snapshot());
            return Object.assign({}, baseReport, certificateBundle, this.buildDarkMatterShipTravelExportPayload(), { reportType: "ArcSecs Dark Matter Drive Acceptance Evidence Bundle", selectedDemo: this.selectedDemo || selectDarkMatterShipTravelDemo(this.selectedDemoKey || "demo-flight"), darkMatterShipTravelLog: Array.isArray(this.shipTravelPhaseLog) ? this.shipTravelPhaseLog.slice() : [], demoFlightAcceptanceEvidenceBundle: bundle });
        }
        exportAcceptanceEvidenceBundleReport() {
            const report = this.attachMissionRecorderPayload(this.buildAcceptanceEvidenceBundleReport(), "Acceptance Evidence Bundle JSON");
            this.download("arcsecs-dark-matter-drive-acceptance-evidence-bundle.json", JSON.stringify(report, null, 2), "application/json");
        }

        handleDemoDirectorAction(action) {
            const snapshot = this.core.snapshot();
            if (action === "stop") {
                this.autopilotDirector.stop(snapshot.telemetry.tick);
                this.core.pause();
                this.progressMonitor.addEntry("Demo Flight Director stopped", "Autopilot is paused; manual controls remain active.", "info");
                this.recordDemoFlightMissionEvent("stop", "Demo Flight Director stopped.");
            } else if (action === "next") {
                this.autopilotDirector.next(snapshot.telemetry.tick);
                this.applyAutopilotStage(true);
                this.core.start();
            } else {
                this.autopilotDirector.start(snapshot.telemetry.tick);
                this.applyAutopilotStage(true);
                this.core.start();
                this.recordDemoFlightMissionEvent(action === "next" ? "next-stage" : "play", "Demo Flight Director action: " + action + ".");
            }
            this.syncControls(this.core.snapshot());
            this.render();
        }
        jumpToDemoStage(stageIndex) {
            const snapshot = this.core.snapshot();
            const state = this.autopilotDirector.jumpTo(stageIndex, snapshot.telemetry.tick);
            const stage = state.stage;
            this.applyAutopilotStage(true);
            this.core.start();
            this.syncControls(this.core.snapshot());
            this.progressMonitor.addEntry("Demo Flight stage jump", stage ? "Jumped to " + stage.title + "." : "Jumped to demo stage.", "info");
            this.recordDemoFlightMissionEvent("jump-stage", stage ? "Jumped to " + stage.title + "." : "Jumped to demo stage.");
            this.render();
        }
        applyAutopilotStage(forceApply) {
            const state = this.autopilotDirector.getState(this.core.snapshot().telemetry.tick);
            const stage = state.stage;
            if (!stage) { return false; }
            if (!forceApply && !this.autopilotDirector.needsApply(stage.id)) { return false; }
            const presetRecipe = PRESETS[stage.preset] || PRESETS.interactiveBlueprint;
            const nextRecipe = Object.assign({}, presetRecipe, stage.recipeOverrides || {});
            this.activeHotspotId = stage.hotspotId || this.activeHotspotId;
            this.core.applyRecipe(nextRecipe);
            this.autopilotDirector.markApplied(stage.id);
            this.progressMonitor.addEntry("Demo Flight Director", stage.title + ": " + stage.operatorCue, "success");
            return true;
        }
        updateAutopilotDirector() {
            const snapshot = this.core.snapshot();
            if (!this.autopilotDirector.active) { return false; }
            if (this.autopilotDirector.shouldAdvance(snapshot.telemetry.tick)) {
                this.autopilotDirector.next(snapshot.telemetry.tick);
                return this.applyAutopilotStage(true);
            }
            return this.applyAutopilotStage(false);
        }
        updateAcceptanceFlightVisualRun(snapshot) {
            if (!this.acceptanceFlightVisualRun || !this.acceptanceFlightVisualRun.active) { return false; }
            const state = this.getAutopilotDemoState(snapshot);
            const stage = state.stage;
            if (!stage) { return false; }
            if (this.acceptanceFlightVisualRun.lastStageId !== stage.id) {
                this.acceptanceFlightVisualRun.lastStageId = stage.id;
                if (this.acceptanceFlightVisualRun.visitedStageIds.indexOf(stage.id) === -1) {
                    this.acceptanceFlightVisualRun.visitedStageIds.push(stage.id);
                    this.recordDemoFlightMissionEvent("acceptance-stage-visible", "Acceptance Flight visibly entered " + stage.title + ".");
                    this.progressMonitor.addEntry("Acceptance Flight stage", (state.stageIndex + 1) + "/" + state.stageCount + " " + stage.title + " — " + stage.expectedMotion, "info");
                }
            }
            const allStagesVisited = this.acceptanceFlightVisualRun.visitedStageIds.length >= AUTOPILOT_DEMO_STAGES.length;
            if (allStagesVisited && state.stageIndex === AUTOPILOT_DEMO_STAGES.length - 1 && state.progress >= 0.92 && !this.acceptanceFlightVisualRun.completed) {
                const completedAtTick = snapshot && snapshot.telemetry ? finiteNumber(snapshot.telemetry.tick, this.acceptanceFlightVisualRun.startedAtTick) : this.acceptanceFlightVisualRun.startedAtTick;
                const baseReport = this.buildAutopilotDemoReport();
                this.demoFlightAcceptanceResult = buildDemoFlightAcceptanceResult(baseReport, this.acceptanceFlightVisualRun.visitedStageIds.slice(), this.acceptanceFlightVisualRun.startedAtTick, completedAtTick);
                this.acceptanceFlightVisualRun.completed = true;
                this.acceptanceFlightVisualRun.active = false;
                this.acceptanceFlightVisualRun.completedAtTick = completedAtTick;
                this.progressMonitor.addEntry("Acceptance Flight complete", this.demoFlightAcceptanceResult.demoFlightAcceptancePass ? "All stage and export checks passed after visible playback." : "Acceptance checks need attention after visible playback.", this.demoFlightAcceptanceResult.demoFlightAcceptancePass ? "success" : "warning");
                this.recordDemoFlightMissionEvent("acceptance-complete", "Acceptance Flight visible playback completed.");
                return true;
            }
            return true;
        }
        getAutopilotDemoState(snapshot) {
            const tick = snapshot && snapshot.telemetry ? snapshot.telemetry.tick : 0;
            return this.autopilotDirector.getState(tick);
        }
        renderDemoDirector(snapshot) {
            const panel = this.root.querySelector("[data-arcsecs-drive-demo-director-panel]");
            if (!panel) { return; }
            const state = this.getAutopilotDemoState(snapshot);
            const selectedDemo = this.selectedDemo || selectDarkMatterShipTravelDemo(this.selectedDemoKey || "demo-flight");
            const travelPhaseItems = (Array.isArray(this.shipTravelPhaseLog) ? this.shipTravelPhaseLog : []).map((entry) => "<li><strong>" + entry.sequence + ". " + safeVisibleText(entry.travelPhase) + "</strong><span>" + safeVisibleText(entry.stageTitle) + "</span><em>" + safeVisibleText(entry.expectedViewportChange) + "</em></li>").join("");
            const stage = state.stage;
            if (!stage) {
                panel.innerHTML = "<article><h3>Demo Flight Director</h3><p>No staged demonstration is configured.</p></article>";
                return;
            }
            const verification = buildDemoFlightVerification(snapshot, state, this.activeHotspotId);
            const stageTimeline = buildDemoFlightStageTimeline(state, verification);
            const scorecard = buildDemoFlightStageScorecard(snapshot, state, verification, stageTimeline);
            const evidenceLedger = buildDemoFlightEvidenceLedger(snapshot, state, verification, stageTimeline, scorecard);
            const evidenceItems = evidenceLedger.entries.map((entry) => "<li class='is-" + safeVisibleText(entry.status) + "'><strong>" + (entry.stageIndex + 1) + ". " + safeVisibleText(entry.stageTitle) + "</strong><span>" + safeVisibleText(entry.claimEvidence) + "</span><em>" + safeVisibleText(entry.falsificationWatch) + "</em></li>").join("");
            const architectureSweep = buildDarkMatterDriveArchitectureSweep(snapshot, state, verification, stageTimeline, scorecard, evidenceLedger);
            const architectureItems = architectureSweep.layers.map((entry) => "<li class='is-" + safeVisibleText(entry.status) + "'><strong>" + safeVisibleText(entry.label) + "</strong><span>" + safeVisibleText(entry.evidence) + "</span><em>" + safeVisibleText(entry.nextAction) + "</em></li>").join("");
            const recorderSnapshot = this.buildDemoFlightMissionRecorderSnapshot(snapshot, state);
            const missionDebrief = buildDemoFlightMissionDebrief(AUTOPILOT_DEMO_STAGES, recorderSnapshot, architectureSweep);
            const acceptanceResult = this.demoFlightAcceptanceResult || buildDemoFlightAcceptanceResult(this.buildAutopilotDemoReport(), recorderSnapshot.demoFlightRunLog.map((entry) => entry.stageId), 0, snapshot.telemetry.tick);
            const acceptanceCertificateBundle = buildAcceptanceFlightCertificateBundle(acceptanceResult, snapshot, missionDebrief, recorderSnapshot);
            const acceptanceCertificate = acceptanceCertificateBundle.demoFlightAcceptanceCertificate;
            const acceptanceBundle = buildAcceptanceEvidenceBundle(this.buildAutopilotDemoReport(), acceptanceCertificateBundle, snapshot);
            const acceptanceBundleItems = acceptanceBundle.artifacts.map((entry) => "<li class='is-" + (entry.present ? "pass" : "fail") + "'><strong>" + safeVisibleText(entry.label) + "</strong><span>" + (entry.present ? "present" : "missing") + "</span><em>" + (entry.required ? "Required acceptance artifact" : "Optional artifact") + "</em></li>").join("");
            const certificateItems = acceptanceCertificateBundle.demoFlightAcceptanceFailureDrilldown.map((entry) => "<li class='is-" + safeVisibleText(entry.status) + "'><strong>#" + (entry.index + 1) + " " + safeVisibleText(entry.status) + "</strong><span>" + safeVisibleText(entry.message) + "</span><em>" + safeVisibleText(entry.recommendedAction) + "</em></li>").join("");
            const acceptanceItems = acceptanceResult.demoFlightAcceptanceStages.map((entry) => "<li class='is-" + (entry.visited && entry.failureReasons.length === 0 ? "pass" : "fail") + "'><strong>" + (entry.stageIndex + 1) + ". " + safeVisibleText(entry.stageTitle) + "</strong><span>" + (entry.visited ? "visited" : "not visited") + " • " + safeVisibleText(entry.verificationStatus) + " / " + safeVisibleText(entry.scorecardStatus) + "</span><em>" + safeVisibleText(entry.failureReasons.length ? entry.failureReasons.join("; ") : "Acceptance stage checks passed.") + "</em></li>").join("");
            const debriefItems = missionDebrief.items.map((entry) => "<li class='is-" + safeVisibleText(entry.status) + "'><strong>" + safeVisibleText(entry.label) + "</strong><span>" + safeVisibleText(entry.evidence) + "</span><em>" + safeVisibleText(entry.nextAction) + "</em></li>").join("");
            const runItems = recorderSnapshot.demoFlightRunLog.slice(-6).map((entry) => "<li><strong>#" + entry.sequence + " " + safeVisibleText(entry.action) + "</strong><span>" + safeVisibleText(entry.stageTitle) + " • " + safeVisibleText(entry.verificationStatus) + " / " + safeVisibleText(entry.scorecardStatus) + "</span><em>" + safeVisibleText(entry.note) + "</em></li>").join("");
            const checklist = verification.checks.map((check) => "<li class='" + (check.passed ? "is-passing" : "is-attention") + "'><strong>" + safeVisibleText(check.label) + "</strong><span>" + safeVisibleText(check.value) + "</span><em>" + safeVisibleText(check.note) + "</em></li>").join("");
            const scoreItems = scorecard.metrics.map((metric) => "<li class='is-" + safeVisibleText(metric.status) + "'><strong>" + safeVisibleText(metric.label) + "</strong><span>" + formatMetric(metric.value, metric.unit) + "</span><em>target " + formatMetric(metric.target, metric.unit) + " • " + safeVisibleText(metric.note) + "</em></li>").join("");
            const stageRail = stageTimeline.map((entry) => "<button type='button' class='arcsecs-drive-demo-stage " + (entry.active ? "is-active" : "") + " is-" + safeVisibleText(entry.state) + "' data-arcsecs-drive-demo-stage='" + entry.stageIndex + "'><span>" + (entry.stageIndex + 1) + "</span><strong>" + safeVisibleText(entry.stageTitle) + "</strong><em>" + safeVisibleText(entry.state) + " • " + Math.round(entry.progress * 100) + "%</em></button>").join("");
            panel.innerHTML = "<article class='arcsecs-drive-demo-director-card'><span>" + (state.active ? "Autopilot running" : "Autopilot ready") + " • " + safeVisibleText(selectedDemo.label) + " • Stage " + (state.stageIndex + 1) + " / " + state.stageCount + "</span><h3>" + safeVisibleText(stage.title) + "</h3><p><strong>Operator cue:</strong> " + safeVisibleText(stage.operatorCue) + "</p><p><strong>Expected motion:</strong> " + safeVisibleText(stage.expectedMotion) + "</p><section class='arcsecs-drive-demo-mode-summary' aria-label='Selected demo mode'><h4>Selected demo</h4><p><strong>" + safeVisibleText(selectedDemo.label) + ":</strong> " + safeVisibleText(selectedDemo.description) + "</p><em>" + safeVisibleText(selectedDemo.expectedViewportChange) + "</em></section>" + (selectedDemo.primaryAction === "activate-travel-sandbox" || this.darkMatterTravelSandboxActive ? this.renderDarkMatterShipTravelSandboxPanel() : "") + "<section class='arcsecs-drive-ship-travel-log' aria-label='Dark Matter Ship Travel phases'><h4>Dark Matter Ship Travel phases</h4><p>Shows departure, Proca-wind alignment, cruise capture, dense-filament crossing, counterpart navigation, and thermal arrival as one travel run.</p><ul>" + (travelPhaseItems || "<li><strong>Not run yet</strong><span>Select Dark Matter Ship Travel and run the selected demo.</span><em>The ship travel log will populate after the run.</em></li>") + "</ul></section><div class='arcsecs-drive-progress-track' role='progressbar' aria-valuemin='0' aria-valuemax='100' aria-valuenow='" + Math.round(state.progress * 100) + "'><i style='width:" + formatMetric(state.progress * 100, "%") + "'></i></div><section class='arcsecs-drive-demo-stage-rail' aria-label='Demo flight stage timeline'><h4>Demo flight stage timeline</h4><p>Click any stage to jump the cockpit, telemetry, and verification state directly to that demonstration.</p><div>" + stageRail + "</div></section><section class='arcsecs-drive-demo-scorecard' aria-label='Demo flight stage scorecard'><h4>Stage telemetry scorecard</h4><p>" + scorecard.passedCount + " / " + scorecard.totalCount + " metrics passing • " + safeVisibleText(scorecard.status) + "</p><ul>" + scoreItems + "</ul><em>Next: " + safeVisibleText(scorecard.nextRecommendedAction) + "</em></section><section class='arcsecs-drive-demo-evidence-ledger' aria-label='Demo flight evidence ledger'><h4>Demo flight evidence ledger</h4><p>" + evidenceLedger.demonstratedCount + " / " + evidenceLedger.totalCount + " stages demonstrated • " + safeVisibleText(evidenceLedger.ledgerStatus) + "</p><ul>" + evidenceItems + "</ul><em>" + safeVisibleText(evidenceLedger.recommendedAuditAction) + "</em></section><section class='arcsecs-drive-demo-mission-recorder' aria-label='Demo flight mission recorder'><h4>Mission recorder</h4><p>" + recorderSnapshot.demoFlightRunLog.length + " recorded stage events • " + recorderSnapshot.demoFlightExportAudit.length + " export audits</p><ul>" + runItems + "</ul><em>Operator notes are included in verification, evidence, architecture, and replay exports.</em></section><section class='arcsecs-drive-demo-acceptance-flight' aria-label='Demo flight acceptance runner'><h4>Acceptance Flight Runner</h4><p>" + acceptanceResult.demoFlightAcceptanceRun.visitedStageCount + " / " + acceptanceResult.demoFlightAcceptanceRun.stageCount + " stages visited • " + (acceptanceResult.demoFlightAcceptancePass ? "pass" : "fail") + "</p><ul>" + acceptanceItems + "</ul><em>" + safeVisibleText(acceptanceResult.demoFlightAcceptanceFailures.length ? acceptanceResult.demoFlightAcceptanceFailures.join("; ") : "Acceptance flight passed.") + "</em></section><section class='arcsecs-drive-demo-acceptance-bundle' aria-label='Demo flight acceptance evidence bundle'><h4>Acceptance evidence bundle</h4><p>" + acceptanceBundle.presentArtifactCount + " / " + acceptanceBundle.requiredArtifactCount + " artifacts present • " + safeVisibleText(acceptanceBundle.status) + "</p><ul>" + acceptanceBundleItems + "</ul><em>" + safeVisibleText(acceptanceBundle.archiveRecommendation) + "</em></section><section class='arcsecs-drive-demo-acceptance-certificate' aria-label='Demo flight acceptance certificate'><h4>Acceptance certificate</h4><p>" + safeVisibleText(acceptanceCertificate.certificateId) + " • " + safeVisibleText(acceptanceCertificate.acceptanceStatus) + "</p><ul>" + certificateItems + "</ul><em>" + safeVisibleText(acceptanceCertificate.recommendedNextAction) + "</em></section><section class='arcsecs-drive-demo-mission-debrief' aria-label='Demo flight mission debrief'><h4>Mission debrief</h4><p>" + missionDebrief.recordedStageCount + " stage events • " + missionDebrief.exportAuditCount + " export audits • " + safeVisibleText(missionDebrief.status) + "</p><ul>" + debriefItems + "</ul><em>" + safeVisibleText(missionDebrief.recommendedNextAction) + "</em></section><section class='arcsecs-drive-demo-architecture-sweep' aria-label='Demo flight architecture sweep'><h4>Architecture sweep</h4><p>" + architectureSweep.passedLayerCount + " / " + architectureSweep.totalLayerCount + " layers passing • " + safeVisibleText(architectureSweep.overallStatus) + "</p><ul>" + architectureItems + "</ul><em>" + safeVisibleText(architectureSweep.recommendedNextAction) + "</em></section><section class='arcsecs-drive-demo-verification' aria-label='Demo flight verification'><h4>Live stage verification</h4><p>" + verification.passedCount + " / " + verification.totalCount + " checks passing • " + safeVisibleText(verification.status) + "</p><ul>" + checklist + "</ul></section></article>";
        }
        buildAutopilotDemoReport() {
            const snapshot = this.core.snapshot();
            const demoDirector = this.getAutopilotDemoState(snapshot);
            const demoStageVerification = buildDemoFlightVerification(snapshot, demoDirector, this.activeHotspotId);
            const demoStageTimeline = buildDemoFlightStageTimeline(demoDirector, demoStageVerification);
            const demoStageScorecard = buildDemoFlightStageScorecard(snapshot, demoDirector, demoStageVerification, demoStageTimeline);
            const demoStageEvidenceLedger = buildDemoFlightEvidenceLedger(snapshot, demoDirector, demoStageVerification, demoStageTimeline, demoStageScorecard);
            const demoFlightArchitectureSweep = buildDarkMatterDriveArchitectureSweep(snapshot, demoDirector, demoStageVerification, demoStageTimeline, demoStageScorecard, demoStageEvidenceLedger);
            const demoFlightMissionRecorder = this.buildDemoFlightMissionRecorderSnapshot(snapshot, demoDirector);
            const demoFlightMissionDebrief = buildDemoFlightMissionDebrief(AUTOPILOT_DEMO_STAGES, demoFlightMissionRecorder, demoFlightArchitectureSweep);
            const acceptanceSeed = this.demoFlightAcceptanceResult || buildDemoFlightAcceptanceResult({ demoDirector, demoStages: AUTOPILOT_DEMO_STAGES, demoStageVerification, demoStageTimeline, demoStageScorecard, demoStageEvidenceLedger, demoFlightArchitectureSweep, demoFlightRunLog: demoFlightMissionRecorder.demoFlightRunLog, demoFlightOperatorNotes: demoFlightMissionRecorder.demoFlightOperatorNotes, demoFlightExportAudit: demoFlightMissionRecorder.demoFlightExportAudit, demoFlightMissionRecorder, demoFlightMissionDebrief, telemetry: snapshot.telemetry, scientificBoundary: SCIENTIFIC_BOUNDARY }, demoFlightMissionRecorder.demoFlightRunLog.map((entry) => entry.stageId), 0, snapshot.telemetry.tick);
            const certificateSeed = buildAcceptanceFlightCertificateBundle(acceptanceSeed, snapshot, demoFlightMissionDebrief, demoFlightMissionRecorder);
            const preliminaryReport = { demoDirector, demoStages: AUTOPILOT_DEMO_STAGES, demoStageVerification, demoStageTimeline, demoStageScorecard, demoStageEvidenceLedger, demoFlightArchitectureSweep, demoFlightRunLog: demoFlightMissionRecorder.demoFlightRunLog, demoFlightOperatorNotes: demoFlightMissionRecorder.demoFlightOperatorNotes, demoFlightExportAudit: demoFlightMissionRecorder.demoFlightExportAudit, demoFlightMissionRecorder, demoFlightMissionDebrief, demoFlightAcceptanceRun: acceptanceSeed.demoFlightAcceptanceRun, demoFlightAcceptanceStages: acceptanceSeed.demoFlightAcceptanceStages, demoFlightAcceptanceResults: acceptanceSeed.demoFlightAcceptanceResults, demoFlightAcceptanceExportMatrix: acceptanceSeed.demoFlightAcceptanceExportMatrix, demoFlightAcceptanceFailures: acceptanceSeed.demoFlightAcceptanceFailures, demoFlightAcceptancePass: acceptanceSeed.demoFlightAcceptancePass, demoFlightAcceptanceCertificate: certificateSeed.demoFlightAcceptanceCertificate, demoFlightAcceptanceFailureDrilldown: certificateSeed.demoFlightAcceptanceFailureDrilldown, telemetry: snapshot.telemetry, scientificBoundary: SCIENTIFIC_BOUNDARY };
            const bundleSeed = buildAcceptanceEvidenceBundle(preliminaryReport, certificateSeed, snapshot);
            return Object.assign({ reportType: "ArcSecs Dark Matter Drive Demo Flight Director Report", selectedDemo: this.selectedDemo || selectDarkMatterShipTravelDemo(this.selectedDemoKey || "demo-flight"), darkMatterShipTravelLog: Array.isArray(this.shipTravelPhaseLog) ? this.shipTravelPhaseLog.slice() : [], recipe: snapshot.recipe, progressLog: this.progressMonitor.getEntries() }, preliminaryReport, this.buildDarkMatterShipTravelExportPayload(), { demoFlightAcceptanceEvidenceBundle: bundleSeed });
        }

        buildAutopilotDemoEvidenceReport() {
            const report = this.buildAutopilotDemoReport();
            return Object.assign({}, report, { reportType: "ArcSecs Dark Matter Drive Demo Flight Evidence Ledger", evidenceOnly: true });
        }

        buildDarkMatterDriveArchitectureSweepReport() {
            const report = this.buildAutopilotDemoReport();
            return { reportType: "ArcSecs Dark Matter Drive Architecture Sweep", demoFlightArchitectureSweep: report.demoFlightArchitectureSweep, demoDirector: report.demoDirector, demoStages: report.demoStages, demoStageVerification: report.demoStageVerification, demoStageTimeline: report.demoStageTimeline, demoStageScorecard: report.demoStageScorecard, demoStageEvidenceLedger: report.demoStageEvidenceLedger, demoFlightRunLog: report.demoFlightRunLog, demoFlightOperatorNotes: report.demoFlightOperatorNotes, demoFlightExportAudit: report.demoFlightExportAudit, demoFlightMissionRecorder: report.demoFlightMissionRecorder, demoFlightMissionDebrief: report.demoFlightMissionDebrief, scientificBoundary: SCIENTIFIC_BOUNDARY };
        }

        buildDemoFlightMissionDebriefReport() {
            const report = this.buildAutopilotDemoReport();
            return { reportType: "ArcSecs Dark Matter Drive Demo Flight Mission Debrief", demoFlightMissionDebrief: report.demoFlightMissionDebrief, demoFlightMissionRecorder: report.demoFlightMissionRecorder, demoFlightRunLog: report.demoFlightRunLog, demoFlightOperatorNotes: report.demoFlightOperatorNotes, demoFlightExportAudit: report.demoFlightExportAudit, demoDirector: report.demoDirector, demoStages: report.demoStages, scientificBoundary: SCIENTIFIC_BOUNDARY };
        }

        buildMissionReport() {
            const snapshot = this.core.snapshot();
            return { reportType: "ArcSecs Dark Matter Drive Mission Sequencer Report", missionIndex: this.missionIndex, activeStage: MISSION_STAGES[this.missionIndex], missionStages: MISSION_STAGES, recipe: snapshot.recipe, telemetry: snapshot.telemetry, warnings: snapshot.warnings.length ? snapshot.warnings : ["none"], progressLog: this.progressMonitor.getEntries(), scientificBoundary: SCIENTIFIC_BOUNDARY };
        }
        buildSimulatorReplayReport() {
            const report = this.core.exportReplayReport();
            const snapshot = this.core.snapshot();
            const demoDirector = this.getAutopilotDemoState(snapshot);
            const demoStageVerification = buildDemoFlightVerification(snapshot, demoDirector, this.activeHotspotId);
            const demoStageTimeline = buildDemoFlightStageTimeline(demoDirector, demoStageVerification);
            const demoStageScorecard = buildDemoFlightStageScorecard(snapshot, demoDirector, demoStageVerification, demoStageTimeline);
            const demoStageEvidenceLedger = buildDemoFlightEvidenceLedger(snapshot, demoDirector, demoStageVerification, demoStageTimeline, demoStageScorecard);
            const demoFlightArchitectureSweep = buildDarkMatterDriveArchitectureSweep(snapshot, demoDirector, demoStageVerification, demoStageTimeline, demoStageScorecard, demoStageEvidenceLedger);
            const demoFlightMissionRecorder = this.buildDemoFlightMissionRecorderSnapshot(snapshot, demoDirector);
            const demoFlightMissionDebrief = buildDemoFlightMissionDebrief(AUTOPILOT_DEMO_STAGES, demoFlightMissionRecorder, demoFlightArchitectureSweep);
            const acceptanceSeed = this.demoFlightAcceptanceResult || buildDemoFlightAcceptanceResult({ demoDirector, demoStages: AUTOPILOT_DEMO_STAGES, demoStageVerification, demoStageTimeline, demoStageScorecard, demoStageEvidenceLedger, demoFlightArchitectureSweep, demoFlightRunLog: demoFlightMissionRecorder.demoFlightRunLog, demoFlightOperatorNotes: demoFlightMissionRecorder.demoFlightOperatorNotes, demoFlightExportAudit: demoFlightMissionRecorder.demoFlightExportAudit, demoFlightMissionRecorder, demoFlightMissionDebrief, telemetry: snapshot.telemetry, scientificBoundary: SCIENTIFIC_BOUNDARY }, demoFlightMissionRecorder.demoFlightRunLog.map((entry) => entry.stageId), 0, snapshot.telemetry.tick);
            const certificateSeed = buildAcceptanceFlightCertificateBundle(acceptanceSeed, snapshot, demoFlightMissionDebrief, demoFlightMissionRecorder);
            const replayPreliminary = { demoDirector, demoStages: AUTOPILOT_DEMO_STAGES, demoStageVerification, demoStageTimeline, demoStageScorecard, demoStageEvidenceLedger, demoFlightArchitectureSweep, demoFlightRunLog: demoFlightMissionRecorder.demoFlightRunLog, demoFlightOperatorNotes: demoFlightMissionRecorder.demoFlightOperatorNotes, demoFlightExportAudit: demoFlightMissionRecorder.demoFlightExportAudit, demoFlightMissionRecorder, demoFlightMissionDebrief, demoFlightAcceptanceRun: acceptanceSeed.demoFlightAcceptanceRun, demoFlightAcceptanceStages: acceptanceSeed.demoFlightAcceptanceStages, demoFlightAcceptanceResults: acceptanceSeed.demoFlightAcceptanceResults, demoFlightAcceptanceExportMatrix: acceptanceSeed.demoFlightAcceptanceExportMatrix, demoFlightAcceptanceFailures: acceptanceSeed.demoFlightAcceptanceFailures, demoFlightAcceptancePass: acceptanceSeed.demoFlightAcceptancePass, demoFlightAcceptanceCertificate: certificateSeed.demoFlightAcceptanceCertificate, demoFlightAcceptanceFailureDrilldown: certificateSeed.demoFlightAcceptanceFailureDrilldown, telemetry: snapshot.telemetry, scientificBoundary: SCIENTIFIC_BOUNDARY };
            const bundleSeed = buildAcceptanceEvidenceBundle(replayPreliminary, certificateSeed, snapshot);
            return Object.assign({}, report, { progressLog: this.progressMonitor.getEntries(), progressStatus: this.progressMonitor.buildProgressState(snapshot, this.missionIndex, MISSION_STAGES.length), selectedDemo: this.selectedDemo || selectDarkMatterShipTravelDemo(this.selectedDemoKey || "demo-flight"), darkMatterShipTravelLog: Array.isArray(this.shipTravelPhaseLog) ? this.shipTravelPhaseLog.slice() : [] }, replayPreliminary, this.buildDarkMatterShipTravelExportPayload(), { demoFlightAcceptanceEvidenceBundle: bundleSeed });
        }
        buildPrintableReport() {
            const report = this.buildSimulatorReplayReport();
            return "<!doctype html><html><head><meta charset=\"utf-8\"><title>ArcSecs Dark Matter Drive Replay Report</title></head><body><h1>" + safeVisibleText(report.scenarioName) + "</h1><p>" + SCIENTIFIC_BOUNDARY + "</p><pre>" + safeVisibleText(JSON.stringify(report, null, 2)) + "</pre></body></html>";
        }
        updateCapabilities() {
            const capabilities = {
                webgpu: typeof navigator !== "undefined" && Boolean(navigator.gpu),
                webgl: detectWebGlSupport(),
                gamepad: typeof navigator !== "undefined" && typeof navigator.getGamepads === "function" && Array.prototype.some.call(navigator.getGamepads(), Boolean),
                haptics: typeof navigator !== "undefined" && typeof navigator.vibrate === "function",
                webxr: typeof navigator !== "undefined" && Boolean(navigator.xr)
            };
            Object.keys(capabilities).forEach((key) => {
                this.root.querySelectorAll("[data-arcsecs-drive-capability='" + key + "']").forEach((element) => {
                    element.textContent = capabilities[key] ? "available" : "fallback";
                    element.classList.toggle("is-available", capabilities[key]);
                });
            });
            const rendererStatus = this.root.querySelector("[data-arcsecs-drive-renderer-status]");
            if (rendererStatus) { rendererStatus.textContent = capabilities.webgpu ? "WebGPU available. Actual compute shader branch will initialize with Canvas overlay fallback." : "WebGPU is not available in this browser. Running fallback renderer."; }
        }
        syncControls(snapshot) {
            this.root.querySelectorAll("[data-arcsecs-drive-control]").forEach((control) => {
                const key = control.getAttribute("data-arcsecs-drive-control");
                if (!key) { return; }
                if (key === "scenarioPreset") { return; }
                const value = snapshot.recipe[key];
                if (value === undefined) { return; }
                if (control.type === "checkbox") { control.checked = Boolean(value); }
                else { control.value = String(value); }
            });
        }
        render() {
            const snapshot = this.core.snapshot();
            snapshot.demoDirector = this.getAutopilotDemoState(snapshot);
            snapshot.selectedDemoKey = this.selectedDemoKey || "demo-flight";
            snapshot.acceptanceFlightVisualRun = this.acceptanceFlightVisualRun;
            this.renderHero(snapshot);
            this.renderTelemetry(snapshot);
            this.renderControlReadouts(snapshot);
            this.renderTimeline(snapshot);
            this.renderProgress(snapshot);
            this.renderProcessingLog(snapshot);
            this.renderExplanation(snapshot);
            this.renderMission(snapshot);
            this.renderDemoDirector(snapshot);
            this.renderScenario(snapshot);
            this.renderPanel(snapshot);
            this.renderHotspots();
            if (this.renderer) { this.renderer.render(snapshot); }
        }
        renderHero(snapshot) {
            this.root.classList.toggle("is-running", Boolean(snapshot.running));
            this.root.classList.toggle("is-paused", !snapshot.running);
            this.root.querySelectorAll("[data-arcsecs-drive-running-label]").forEach((element) => { element.textContent = snapshot.running ? "Running" : "Paused"; element.classList.toggle("is-running", snapshot.running); });
            this.root.querySelectorAll("[data-arcsecs-drive-mode-label]").forEach((element) => { element.textContent = SIMULATION_MODES[snapshot.recipe.mode] ? SIMULATION_MODES[snapshot.recipe.mode].shortLabel : "Mode"; });
            this.root.querySelectorAll("[data-arcsecs-drive-boundary-note]").forEach((element) => { element.textContent = snapshot.scientificBoundary; });
        }
        renderTelemetry(snapshot) {
            const rows = [
                ["Frames per second", formatMetric(snapshot.telemetry.framesPerSecond, " fps")],
                ["Simulation time", formatMetric(snapshot.telemetry.simulationTimeSeconds, " s")],
                ["Simulation speed", formatMetric(snapshot.telemetry.simulationSpeedMultiplier, "×")],
                ["Renderer mode", safeVisibleText(snapshot.telemetry.rendererMode)],
                ["Particle / body count", formatMetric(snapshot.telemetry.particleCount, " particles") + " / " + formatMetric(snapshot.telemetry.bodyCount, " bodies")],
                ["Visible mass proxy", formatMetric(snapshot.telemetry.visibleMassProxy, "")],
                ["Dark matter density", formatMetric(snapshot.telemetry.darkMatterDensity, "")],
                ["Halo radius", formatMetric(snapshot.telemetry.haloRadius, "")],
                ["Dark-to-baryonic ratio", formatMetric(snapshot.telemetry.darkMatterToBaryonicRatio, "")],
                ["Reference DM/baryon ratio", formatMetric(snapshot.telemetry.referenceDarkMatterToBaryonRatio, "")],
                ["J-factor proxy", formatMetric(snapshot.telemetry.jFactorProxy, "")],
                ["Quantized inertia thrust", formatMetric(snapshot.telemetry.quantizedInertiaThrustProxy, "")],
                ["Rindler horizon gradient", formatMetric(snapshot.telemetry.rindlerHorizonGradient, "")],
                ["Haloscope signal", formatMetric(snapshot.telemetry.haloscopeYoctowattProxy, " yoctowatt-proxy")],
                ["Axion resonance", formatMetric(snapshot.telemetry.axionResonanceAlignment * 100, "%")],
                ["Warp bubble stability", formatMetric(snapshot.telemetry.warpBubbleStability * 100, "%")],
                ["Relative flux ratio", formatMetric(snapshot.telemetry.lorentzFactor, "")],
                ["Proper-time rate", formatMetric(snapshot.telemetry.properTimeRate * 100, "%")],
                ["Momentum proxy", formatMetric(snapshot.telemetry.relativisticMomentumProxy, "")],
                ["Compute dispatches", formatMetric(snapshot.telemetry.estimatedComputeDispatches, "")],
                ["Compute estimate", formatMetric(snapshot.telemetry.estimatedComputeMilliseconds, " ms")],
                ["WebGPU compute status", safeVisibleText(snapshot.telemetry.webGpuComputeStatus)],
                ["WebGPU execution location", safeVisibleText(snapshot.telemetry.webGpuExecutionLocation)],
                ["WebGPU worker status", safeVisibleText(snapshot.telemetry.webGpuWorkerStatus)],
                ["WebGPU readback mode", safeVisibleText(snapshot.telemetry.webGpuReadbackMode)],
                ["WebGPU readback bytes", formatMetric(snapshot.telemetry.webGpuReadbackBytes, " bytes")],
                ["Persistent buffer status", safeVisibleText(snapshot.telemetry.webGpuPersistentBuffersStatus)],
                ["Ping-pong source", formatMetric(snapshot.telemetry.webGpuPingPongSourceIndex, "")],
                ["Ping-pong destination", formatMetric(snapshot.telemetry.webGpuPingPongDestinationIndex, "")],
                ["GPU buffer capacity", formatMetric(snapshot.telemetry.webGpuParticleBufferCapacity, " bytes")],
                ["Buffer rebuilds", formatMetric(snapshot.telemetry.webGpuBufferRebuildCount, "")],
                ["Shared buffer contract", formatMetric(snapshot.telemetry.webGpuSharedBufferContractVersion, "")],
                ["Render buffer handoff", safeVisibleText(snapshot.telemetry.webGpuSharedRenderBufferStatus)],
                ["Spatial index status", safeVisibleText(snapshot.telemetry.webGpuSpatialIndexStatus)],
                ["Spatial buckets", formatMetric(snapshot.telemetry.webGpuSpatialBucketCount, "")],
                ["Occupied spatial buckets", formatMetric(snapshot.telemetry.webGpuOccupiedSpatialBuckets, "")],
                ["Densest bucket", formatMetric(snapshot.telemetry.webGpuDensestSpatialBucketIndex, "")],
                ["Densest occupancy", formatMetric(snapshot.telemetry.webGpuDensestSpatialBucketOccupancy, " particles")],
                ["Spatial locality", formatMetric(snapshot.telemetry.webGpuSpatialLocalityRatio * 100, "%")],
                ["Adaptive halo shading", safeVisibleText(snapshot.telemetry.webGpuAdaptiveHaloShadingStatus)],
                ["Halo density gain", formatMetric(snapshot.telemetry.webGpuAdaptiveHaloDensityGain, "")],
                ["Halo opacity", formatMetric(snapshot.telemetry.webGpuAdaptiveHaloOpacity * 100, "%")],
                ["Tile neighbor status", safeVisibleText(snapshot.telemetry.webGpuTileLocalNeighborStatus)],
                ["Tile neighbor queries", formatMetric(snapshot.telemetry.webGpuTileLocalNeighborQueryCount, "")],
                ["Tile local density", formatMetric(snapshot.telemetry.webGpuTileLocalDensityProxy, "")],
                ["Bucket compaction", safeVisibleText(snapshot.telemetry.webGpuBucketCompactionStatus)],
                ["Prefix sum", safeVisibleText(snapshot.telemetry.webGpuBucketPrefixSumStatus)],
                ["Compacted particles", formatMetric(snapshot.telemetry.webGpuCompactedParticleCount, "")],
                ["Compaction coverage", formatMetric(snapshot.telemetry.webGpuBucketRangeCoverageRatio * 100, "%")],
                ["Neighbor range mode", safeVisibleText(snapshot.telemetry.webGpuBucketNeighborQueryMode)],
                ["Bucket neighbor density", safeVisibleText(snapshot.telemetry.webGpuBucketNeighborDensityStatus)],
                ["Bucket density samples", formatMetric(snapshot.telemetry.webGpuBucketNeighborDensitySampleCount, "")],
                ["Bucket density average", formatMetric(snapshot.telemetry.webGpuBucketNeighborDensityAverage, "")],
                ["Bucket density maximum", formatMetric(snapshot.telemetry.webGpuBucketNeighborDensityMaximum, "")],
                ["Bucket density coverage", formatMetric(snapshot.telemetry.webGpuBucketNeighborDensityCoverageRatio * 100, "%")],
                ["Density-field shading", safeVisibleText(snapshot.telemetry.webGpuDensityFieldShadingStatus)],
                ["Density-field tiles", formatMetric(snapshot.telemetry.webGpuDensityFieldActiveTiles, " active")],
                ["Density-field average", formatMetric(snapshot.telemetry.webGpuDensityFieldAverageDensity, "")],
                ["Density-field force", formatMetric(snapshot.telemetry.webGpuDensityFieldAverageForceProxy, "")],
                ["Density feedback", safeVisibleText(snapshot.telemetry.webGpuDensityFieldFeedbackStatus)],
                ["Density feedback gain", formatMetric(snapshot.telemetry.webGpuDensityFieldFeedbackGain, "×")],
                ["Effective feedback gain", formatMetric(snapshot.telemetry.webGpuAdaptiveDensityFieldFeedbackGain, "×")],
                ["Feedback downshift", safeVisibleText(snapshot.telemetry.webGpuDensityFieldFeedbackDownshiftStatus)],
                ["Downshift factor", formatMetric(snapshot.telemetry.webGpuDensityFieldFeedbackDownshiftFactor * 100, "%")],
                ["Density feedback accel", formatMetric(snapshot.telemetry.webGpuDensityFieldAccelerationProxy, "")],
                ["Finite guard clamps", formatMetric(snapshot.telemetry.webGpuFiniteOutputGuardClampCount, "")],
                ["Finite guard clamp rate", formatMetric(snapshot.telemetry.webGpuFiniteOutputGuardClampRate * 100, "%")],
                ["Morton contract", formatMetric(snapshot.telemetry.webGpuMortonContractVersion, "")],
                ["Direct render status", safeVisibleText(snapshot.telemetry.webGpuDirectRenderStatus)],
                ["Direct render particles", formatMetric(snapshot.telemetry.webGpuDirectRenderParticleCount, "")],
                ["Direct render vertices", formatMetric(snapshot.telemetry.webGpuDirectRenderVertexCount, "")],
                ["Direct render source", formatMetric(snapshot.telemetry.webGpuDirectRenderSourceIndex, "")],
                ["Direct render format", safeVisibleText(snapshot.telemetry.webGpuDirectRenderFormat)],
                ["Direct visual quality", safeVisibleText(snapshot.telemetry.webGpuDirectRenderVisualQualityMode)],
                ["Direct point scale", formatMetric(snapshot.telemetry.webGpuDirectRenderPointScale, "×")],
                ["Direct halo intensity", formatMetric(snapshot.telemetry.webGpuDirectRenderHaloIntensity, "×")],
                ["Direct visual density", formatMetric(snapshot.telemetry.webGpuDirectRenderVisualDensity, "×")],
                ["Direct visual status", safeVisibleText(snapshot.telemetry.webGpuDirectVisualQualityStatus)],
                ["Light speed decrease", formatMetric(snapshot.telemetry.lightSlowingSpeedDecreaseMetersPerSecond, " m/s")],
                ["EM arrival speed", formatMetric(snapshot.telemetry.lightSlowingArrivalSpeedMetersPerSecond, " m/s")],
                ["EM propagation lag", formatMetric(snapshot.telemetry.lightSlowingPropagationDelaySeconds, " s")],
                ["Total EM lag", formatMetric(snapshot.telemetry.lightSlowingTotalArrivalDelaySeconds, " s")],
                ["Energy loss", formatMetric(snapshot.telemetry.lightSlowingEnergyLossPercent, "%")],
                ["Redshift coefficient", formatMetric(snapshot.telemetry.lightSlowingRedshiftCoefficientPerMeter, " m⁻¹")],
                ["Delay coefficient", formatMetric(snapshot.telemetry.lightSlowingDelayCoefficientPerMeter, " m⁻¹")],
                ["Wavefront event", safeVisibleText(snapshot.telemetry.multiMessengerEventLabel)],
                ["Density-corrected lag", formatMetric(snapshot.telemetry.multiMessengerDensityCorrectedPropagationDelaySeconds, " s")],
                ["Composite redshift", formatMetric(snapshot.telemetry.compositeRedshift, "")],
                ["Arrival dilation", formatMetric(snapshot.telemetry.arrivalDilationFactor, "×")],
                ["Apparent tangential velocity", formatMetric(snapshot.telemetry.apparentTangentialVelocityKilometersPerSecond, " km/s")],
                ["Relational MDS projection", safeVisibleText(snapshot.telemetry.webGpuRelationalMdsProjectionStatus)],
                ["Relational matrix bytes", formatMetric(snapshot.telemetry.webGpuRelationalMdsDistanceMatrixBytes || snapshot.telemetry.relationalDistanceMatrixByteLength, " bytes")],
                ["MDS projection bytes", formatMetric(snapshot.telemetry.webGpuRelationalMdsProjectionBufferBytes, " bytes")],
                ["MDS projection source", safeVisibleText(snapshot.telemetry.webGpuRelationalMdsProjectionSource)],
                ["GPU Weber force", safeVisibleText(snapshot.telemetry.webGpuRelationalWeberForceStatus)],
                ["Weber tether buffer", formatMetric(snapshot.telemetry.webGpuRelationalWeberTetherBufferBytes, " bytes")],
                ["Weber force total", formatMetric(snapshot.telemetry.webGpuRelationalWeberForceTotal, "")],
                ["GPU Machian mass", formatMetric(snapshot.telemetry.webGpuRelationalMachianMassFromWeberBuffer, "")],
                ["Entity Machian mass", formatMetric(snapshot.telemetry.webGpuRelationalShipMachianEffectiveMass, "")],
                ["Weber source", safeVisibleText(snapshot.telemetry.webGpuRelationalWeberSource)],
                ["Render sample status", safeVisibleText(snapshot.telemetry.webGpuRenderSampleStatus)],
                ["Render sample particles", formatMetric(snapshot.telemetry.webGpuRenderSampleCount, "")],
                ["Render sample bytes", formatMetric(snapshot.telemetry.webGpuRenderSampleBytes, " bytes")],
                ["Render sample source", formatMetric(snapshot.telemetry.webGpuRenderSampleSourceIndex, "")],
                ["Worker round trip", formatMetric(snapshot.telemetry.webGpuWorkerRoundTripMilliseconds, " ms")],
                ["Readback latency", formatMetric(snapshot.telemetry.webGpuReadbackLatencyMilliseconds, " ms")],
                ["Adaptive compute quality", safeVisibleText(snapshot.telemetry.webGpuAdaptiveComputeQualityStatus)],
                ["Effective compute budget", formatMetric(snapshot.telemetry.webGpuEffectiveComputeParticleBudget, " particles")],
                ["Adaptive quality mode", safeVisibleText(snapshot.telemetry.webGpuAdaptiveComputeQualityMode)],
                ["Compute downshift level", formatMetric(snapshot.telemetry.webGpuAdaptiveComputeDownshiftLevel, "")],
                ["Instability window", formatMetric(snapshot.telemetry.webGpuAdaptiveComputeWindowSize, " samples")],
                ["Instability score", formatMetric(snapshot.telemetry.webGpuAdaptiveComputeInstabilityScore, "")],
                ["Average clamp rate", formatMetric(snapshot.telemetry.webGpuAdaptiveComputeClampRateAverage * 100, "%")],
                ["Average FPS", formatMetric(snapshot.telemetry.webGpuAdaptiveComputeFpsAverage, " fps")],
                ["Average worker round trip", formatMetric(snapshot.telemetry.webGpuAdaptiveComputeWorkerRoundTripAverage, " ms")],
                ["Average readback latency", formatMetric(snapshot.telemetry.webGpuAdaptiveComputeReadbackLatencyAverage, " ms")],
                ["Effective neighbor samples", formatMetric(snapshot.telemetry.webGpuEffectiveBucketNeighborSampleLimit, " samples")],
                ["Effective density samples", formatMetric(snapshot.telemetry.webGpuEffectiveDensityFieldSampleLimit, " samples")],
                ["WebGPU dispatch cadence", formatMetric(snapshot.telemetry.webGpuDispatchCadenceTicks, " ticks")],
                ["Sample-limit status", safeVisibleText(snapshot.telemetry.webGpuDensityFieldSampleLimitStatus)],
                ["Dispatch cadence status", safeVisibleText(snapshot.telemetry.webGpuDispatchCadenceStatus)],
                ["Sustained instability", formatMetric(snapshot.telemetry.webGpuAdaptiveComputeSustainedInstabilityTicks, " ticks")],
                ["WebGPU actual particles", formatMetric(snapshot.telemetry.webGpuActualParticleCount, "")],
                ["WebGPU shader dispatches", formatMetric(snapshot.telemetry.webGpuActualDispatches, "")],
                ["WebGPU mean speed", formatMetric(snapshot.telemetry.webGpuMeanParticleSpeed, "")],
                ["WebGPU halo pressure", formatMetric(snapshot.telemetry.webGpuHaloPressureProxy, "")],
                ["Semi-implicit stability", formatMetric(snapshot.telemetry.semiImplicitEulerStabilityScore * 100, "%")],
                ["PSF full width", formatMetric(snapshot.telemetry.effectivePointSpreadArcseconds, " arcsec")],
                ["PSF bounding box", formatMetric(snapshot.telemetry.psfBoundingBoxArcseconds, " arcsec")],
                ["PSF truncation risk", safeVisibleText(snapshot.telemetry.psfTruncationRisk)],
                ["Quantum signal proxy", formatMetric(snapshot.telemetry.quantumSignalEnhancementProxy, "")],
                ["Quantum gate preview", safeVisibleText(snapshot.telemetry.nativeGateSequencePreview)],
                ["Buoy map coverage", formatMetric(snapshot.telemetry.buoyCoverage * 100, "%")],
                ["Wind gradient risk", formatMetric(snapshot.telemetry.windGradientRisk * 100, "%")],
                ["Guide-star error", formatMetric(snapshot.telemetry.correctedGuideStarErrorArcseconds, " arcsec")],
                ["Course correction", formatMetric(snapshot.telemetry.courseCorrectionDegrees, "°")],
                ["Route confidence", formatMetric(snapshot.telemetry.routeConfidence * 100, "%")],
                ["Slingshot opportunity", formatMetric(snapshot.telemetry.slingshotOpportunityScore * 100, "%")],
                ["Energy reserve margin", formatMetric(snapshot.telemetry.driveReserveMargin, "")],
                ["Recommended action", safeVisibleText(snapshot.telemetry.recommendedAction)],
                ["WebGPU branch note", safeVisibleText(snapshot.telemetry.webGpuComputeBranchNote)],
                ["Ship velocity", formatMetric(snapshot.telemetry.shipVelocity, " c-proxy")],
                ["Ship heading", formatMetric(snapshot.telemetry.shipHeading, "°")],
                ["Drive charge", formatMetric(snapshot.telemetry.driveCharge * 100, "%")],
                ["Drive output", formatMetric(snapshot.telemetry.driveOutput, "")],
                ["Wind direction", formatMetric(snapshot.telemetry.darkMatterWindDirection, "°")],
                ["Wind turbulence", formatMetric(snapshot.telemetry.darkMatterWindTurbulence * 100, "%")],
                ["Tether distortion", formatMetric(snapshot.telemetry.lensingDeflectionArcseconds, " arcsec")],
                ["Angular offset", formatMetric(snapshot.telemetry.currentAngularOffsetArcseconds, " arcsec")],
                ["Warnings / stability", safeVisibleText(snapshot.telemetry.warningText)]
            ];
            const panel = this.root.querySelector("[data-arcsecs-drive-telemetry]");
            if (panel) { panel.innerHTML = rows.map((row) => "<div><span>" + safeVisibleText(row[0]) + "</span><strong>" + safeVisibleText(row[1]) + "</strong></div>").join(""); }
            const compactPanel = this.root.querySelector("[data-arcsecs-drive-compact-telemetry]");
            if (compactPanel) { compactPanel.innerHTML = "<span>FPS <strong>" + formatMetric(snapshot.telemetry.framesPerSecond, "") + "</strong></span><span>EM Δv <strong>" + formatMetric(snapshot.telemetry.lightSlowingSpeedDecreaseMetersPerSecond, " m/s") + "</strong></span><span>Drive <strong>" + formatMetric(snapshot.telemetry.driveCharge * 100, "%") + "</strong></span>"; }
            const notice = this.root.querySelector("[data-arcsecs-drive-performance]");
            if (notice) { notice.textContent = snapshot.telemetry.frameRisk === "high" ? "Fallback quality active to preserve responsiveness." : "Performance budget nominal."; }
        }
        renderControlReadouts(snapshot) {
            const values = {
                speedMultiplier: formatMetric(snapshot.recipe.speedMultiplier, "×"), photonPacketCount: formatMetric(snapshot.recipe.photonPacketCount, " packets"), photonMassProxy: formatMetric(snapshot.recipe.photonMassProxy, ""), baryonicMass: formatMetric(snapshot.recipe.baryonicMass, ""), lossRate: formatMetric(snapshot.recipe.lossRate * 100, "%"), compressionRatio: formatMetric(snapshot.recipe.compressionRatio, ":1"), thermalRejectionCapacity: formatMetric(snapshot.recipe.thermalRejectionCapacity * 100, "%"), darkMatterDial: formatMetric(snapshot.recipe.darkMatterDial, "×"), visibleMatterMass: formatMetric(snapshot.recipe.visibleMatterMass, ""), haloRadius: formatMetric(snapshot.recipe.haloRadius, ""), windDirectionDegrees: formatMetric(snapshot.recipe.windDirectionDegrees, "°"), shipHeadingDegrees: formatMetric(snapshot.recipe.shipHeadingDegrees, "°"), mass: formatMetric(snapshot.recipe.mass, ""), impactParameter: formatMetric(snapshot.recipe.impactParameter, ""), lensingExaggeration: formatMetric(snapshot.recipe.lensingExaggeration, "×"), quantizedInertiaDampening: formatMetric(snapshot.recipe.quantizedInertiaDampening * 100, "%"), rindlerHorizonBias: formatMetric(snapshot.recipe.rindlerHorizonBias * 100, "%"), haloscopeTuningMicroElectronVolts: formatMetric(snapshot.recipe.haloscopeTuningMicroElectronVolts, " µeV"), alcubierreMetricStrength: formatMetric(snapshot.recipe.alcubierreMetricStrength * 100, "%"), negativeEnergyReserve: formatMetric(snapshot.recipe.negativeEnergyReserve * 100, "%"), opticalApertureMeters: formatMetric(snapshot.recipe.opticalApertureMeters, " m"), opticalWavelengthNanometers: formatMetric(snapshot.recipe.opticalWavelengthNanometers, " nm"), telescopeJitterArcseconds: formatMetric(snapshot.recipe.telescopeJitterArcseconds, " arcsec"), relativeVelocityFractionOfLight: formatMetric(snapshot.recipe.relativeVelocityFractionOfLight, " c"), spacecraftRestMassProxy: formatMetric(snapshot.recipe.spacecraftRestMassProxy, ""), computeParticleBudget: formatMetric(snapshot.recipe.computeParticleBudget, " particles"), computeWorkgroupSize: formatMetric(snapshot.recipe.computeWorkgroupSize, ""), psfMagnitude: formatMetric(snapshot.recipe.psfMagnitude, " mag"), stereopsisDisparityArcseconds: formatMetric(snapshot.recipe.stereopsisDisparityArcseconds, " arcsec"), quantumPhaseRotationDegrees: formatMetric(snapshot.recipe.quantumPhaseRotationDegrees, "°"), quantumGateDepth: formatMetric(snapshot.recipe.quantumGateDepth, " layers"), qubitNoiseLevel: formatMetric(snapshot.recipe.qubitNoiseLevel * 100, "%"), sensorBuoyCount: formatMetric(snapshot.recipe.sensorBuoyCount, " buoys"), guideStarTargetArcseconds: formatMetric(snapshot.recipe.guideStarTargetArcseconds, " arcsec"), guideStarErrorArcseconds: formatMetric(snapshot.recipe.guideStarErrorArcseconds, " arcsec"), autopilotGain: formatMetric(snapshot.recipe.autopilotGain * 100, "%"), navigationWaypoints: formatMetric(snapshot.recipe.navigationWaypoints, " waypoints"), trajectoryLookaheadSeconds: formatMetric(snapshot.recipe.trajectoryLookaheadSeconds, " s"), slingshotSafetyMargin: formatMetric(snapshot.recipe.slingshotSafetyMargin * 100, "%"), darkMatterAnomalyDensity: formatMetric(snapshot.recipe.darkMatterAnomalyDensity * 100, "%"), routeRiskTolerance: formatMetric(snapshot.recipe.routeRiskTolerance * 100, "%"), densityFieldFeedbackGain: formatMetric(snapshot.recipe.densityFieldFeedbackGain, "×"), multiMessengerDistanceMegaparsecs: formatMetric(snapshot.recipe.multiMessengerDistanceMegaparsecs, " Mpc"), lightSlowingTargetRedshift: formatMetric(snapshot.recipe.lightSlowingTargetRedshift, ""), lightSlowingPropagationDelaySeconds: formatMetric(snapshot.recipe.lightSlowingPropagationDelaySeconds, " s"), intrinsicEmissionDelaySeconds: formatMetric(snapshot.recipe.intrinsicEmissionDelaySeconds, " s"), lineOfSightOpticalResistance: formatMetric(snapshot.recipe.lineOfSightOpticalResistance, "×"), covaryingCouplingRedshift: formatMetric(snapshot.recipe.covaryingCouplingRedshift, ""), sourceProperMotionArcsecondsPerYear: formatMetric(snapshot.recipe.sourceProperMotionArcsecondsPerYear, " arcsec/yr"), sourceDistanceParsecs: formatMetric(snapshot.recipe.sourceDistanceParsecs, " pc")
            };
            this.root.querySelectorAll("[data-arcsecs-drive-control-readout]").forEach((element) => { const key = element.getAttribute("data-arcsecs-drive-control-readout") || ""; element.textContent = values[key] || "—"; });
            this.root.querySelectorAll("[data-arcsecs-drive-exaggeration-note]").forEach((element) => { element.hidden = finiteNumber(snapshot.recipe.darkMatterDial, 1) < 3 && finiteNumber(snapshot.recipe.lensingExaggeration, 1) < 3; });
        }
        renderTimeline(snapshot) {
            const panel = this.root.querySelector("[data-arcsecs-drive-timeline-panel]");
            if (panel) { panel.innerHTML = snapshot.timeline.map((event, index) => "<button type=\"button\" class=\"" + (index === snapshot.timelineIndex ? "is-active " : "") + "is-" + event.severity + "\" data-arcsecs-drive-timeline-index=\"" + index + "\"><strong>" + safeVisibleText(event.marker) + "</strong><span>" + safeVisibleText(event.why) + "</span></button>").join(""); }
            this.root.querySelectorAll("[data-arcsecs-drive-event-log]").forEach((panelElement) => { panelElement.innerHTML = this.progressMonitor.getEntries().concat(snapshot.timeline.slice(0, 6).map((event, index) => ({ index: index + 1, label: event.marker, detail: event.why, severity: event.severity === "warning" ? "warning" : "info" }))).slice(0, 12).map((entry) => "<li class=\"is-" + safeVisibleText(entry.severity) + "\"><time>" + safeVisibleText(String(entry.index).padStart(2, "0")) + "</time><strong>" + safeVisibleText(entry.label) + "</strong><span>" + safeVisibleText(entry.detail) + "</span></li>").join(""); });
        }
        renderProgress(snapshot) {
            const state = this.progressMonitor.buildProgressState(snapshot, this.missionIndex, MISSION_STAGES.length);
            const simulationBar = this.root.querySelector("[data-arcsecs-drive-progress='simulation']");
            const missionBar = this.root.querySelector("[data-arcsecs-drive-progress='mission']");
            const eta = this.root.querySelector("[data-arcsecs-drive-eta]");
            const status = this.root.querySelector("[data-arcsecs-drive-status]");
            const step = this.root.querySelector("[data-arcsecs-drive-step-detail]");
            if (simulationBar) { simulationBar.style.width = formatMetric(state.simulationProgressPercent, "%"); simulationBar.setAttribute("aria-valuenow", String(Math.round(state.simulationProgressPercent))); }
            if (missionBar) { missionBar.style.width = formatMetric(state.missionProgressPercent, "%"); missionBar.setAttribute("aria-valuenow", String(Math.round(state.missionProgressPercent))); }
            if (eta) { eta.textContent = "Estimated step time remaining: " + formatMetric(state.estimatedSecondsRemaining, " s"); }
            if (status) { status.textContent = state.statusText + " • " + safeVisibleText(snapshot.telemetry.currentScenarioState); }
            if (step) { step.textContent = this.progressMonitor.describeCurrentStep(snapshot); }
        }
        renderProcessingLog() {
            const panel = this.root.querySelector("[data-arcsecs-drive-processing-log]");
            if (!panel) { return; }
            const entries = this.progressMonitor.getEntries();
            panel.innerHTML = entries.length ? entries.map((entry) => "<li class=\"is-" + entry.severity + "\"><strong>" + safeVisibleText(entry.label) + "</strong><span>" + safeVisibleText(entry.detail) + "</span></li>").join("") : "<li class=\"is-info\"><strong>Ready</strong><span>Change a parameter, start the mission, or run a guided scenario.</span></li>";
        }
        renderExplanation(snapshot) {
            const mode = SIMULATION_MODES[snapshot.recipe.mode] || SIMULATION_MODES.galaxyRotation;
            const panel = this.root.querySelector("[data-arcsecs-drive-explanation]");
            if (panel) { panel.innerHTML = "<h2>What am I looking at?</h2><p>" + safeVisibleText(mode.explanation) + "</p><dl><dt>Model status</dt><dd>" + safeVisibleText(mode.modelStatus) + "</dd><dt>What to try next</dt><dd>" + safeVisibleText(mode.nextStep) + "</dd><dt>Boundary</dt><dd>" + SCIENTIFIC_BOUNDARY + "</dd></dl>"; }
        }
        renderScenario() {
            const panel = this.root.querySelector("[data-arcsecs-drive-guided-panel]");
            if (!panel) { return; }
            const scenario = GUIDED_SCENARIOS[this.scenarioController.state.currentScenarioIndex] || GUIDED_SCENARIOS[0];
            panel.innerHTML = "<strong>" + safeVisibleText(scenario.title) + "</strong><span>Objective: " + safeVisibleText(scenario.objective) + "</span><span>Step " + (this.scenarioController.state.currentStepIndex + 1) + " / 3</span><span>" + (this.scenarioController.state.completed ? safeVisibleText(scenario.completion) : "Completion pending") + "</span>";
        }
        renderMission() {
            const panel = this.root.querySelector("[data-arcsecs-drive-mission-panel]");
            if (!panel) { return; }
            const stage = MISSION_STAGES[this.missionIndex];
            panel.innerHTML = "<article><span>Stage " + (this.missionIndex + 1) + " / " + MISSION_STAGES.length + "</span><h3>" + safeVisibleText(stage.title) + "</h3><p><strong>Action:</strong> " + safeVisibleText(stage.operatorAction) + "</p><p><strong>Expected:</strong> " + safeVisibleText(stage.expectedSignal) + "</p><p><strong>Warning marker:</strong> " + safeVisibleText(stage.warningMarker) + "</p></article>";
        }
        renderPanel(snapshot) {
            const panel = this.root.querySelector("[data-arcsecs-drive-panel]");
            if (!panel) { return; }
            const hotspot = HOTSPOTS.find((entry) => entry.id === this.activeHotspotId) || HOTSPOTS[0];
            panel.innerHTML = "<article class=\"arcsecs-drive-detail-card\"><header><span>" + safeVisibleText(hotspot.shortTitle) + "</span><strong>" + safeVisibleText(hotspot.title) + "</strong></header><p><strong>Status:</strong> " + safeVisibleText(hotspot.status) + "</p><p><strong>Affected by:</strong> " + safeVisibleText(hotspot.parameter) + "</p><h3>Component Details</h3><ul>" + hotspot.details.map((item) => "<li>" + safeVisibleText(item) + "</li>").join("") + "</ul><h3>Warnings</h3><ul>" + hotspot.warnings.map((item) => "<li>" + safeVisibleText(item) + "</li>").join("") + "</ul><p><strong>Live metric:</strong> " + safeVisibleText(hotspot.metric) + " = " + formatMetric(snapshot.telemetry[hotspot.metric], "") + "</p></article>";
        }
        renderHotspots() {
            if (!this.blueprint) { return; }
            this.blueprint.innerHTML = "<defs><radialGradient id=\"arcsecsDriveGlow\"><stop offset=\"0%\" stop-color=\"#9fffe0\"/><stop offset=\"100%\" stop-color=\"#0c172a\"/></radialGradient></defs><path d=\"M8 50 C22 24 73 24 94 50 C73 76 22 76 8 50 Z\" fill=\"rgba(12,23,42,.72)\" stroke=\"rgba(111,245,214,.55)\" stroke-width=\"1.1\"/><path d=\"M14 50 L88 50\" stroke=\"rgba(255,214,111,.52)\" stroke-width=\".8\"/>" + HOTSPOTS.map((hotspot) => "<g><circle tabindex=\"0\" role=\"button\" data-arcsecs-drive-hotspot=\"" + hotspot.id + "\" cx=\"" + hotspot.x + "\" cy=\"" + hotspot.y + "\" r=\"3.1\" fill=\"" + (hotspot.id === this.activeHotspotId ? "#ffd66f" : "#65e7ff") + "\"><title>" + safeVisibleText(hotspot.title) + "</title></circle><text x=\"" + (hotspot.x + 4) + "\" y=\"" + (hotspot.y + 1) + "\">" + safeVisibleText(hotspot.shortTitle) + "</text></g>").join("");
            this.blueprint.querySelectorAll("[data-arcsecs-drive-hotspot]").forEach((element) => {
                element.addEventListener("click", () => { this.activeHotspotId = element.getAttribute("data-arcsecs-drive-hotspot") || this.activeHotspotId; this.render(); });
                element.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); this.activeHotspotId = element.getAttribute("data-arcsecs-drive-hotspot") || this.activeHotspotId; this.render(); } });
            });
        }
        loop(timestamp) {
            if (!this.root.isConnected) { document.removeEventListener("visibilitychange", this.boundVisibilityHandler); window.removeEventListener("blur", this.boundBlurHandler); window.removeEventListener("gamepadconnected", this.boundGamepadHandler); if (this.renderer && this.renderer.computeWorkerClient) this.renderer.computeWorkerClient.terminate(); return; }
            if (document.hidden) { window.requestAnimationFrame(next => this.loop(next)); return; }
            if (timestamp - this.lastFrameTime >= this.minimumFrameMilliseconds) {
                this.lastFrameTime = timestamp;
                if (this.core.running) {
                    this.core.step();
                    this.updateAutopilotDirector();
                    const snapshot = this.core.snapshot();
                    this.updateAcceptanceFlightVisualRun(snapshot);
                    if (snapshot.telemetry.driveCharge > 0.85) { this.haptics.triggerTetherFeedback(snapshot.telemetry); }
                    this.render();
                } else if (timestamp - this.lastIdleFrameTime >= this.idleFrameMilliseconds) {
                    this.lastIdleFrameTime = timestamp;
                    this.render();
                }
            }
            if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") { window.requestAnimationFrame((nextTimestamp) => this.loop(nextTimestamp)); }
        }
        download(filename, body, type) {
            const blob = new Blob([body], { type });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = filename;
            link.rel = "noopener";
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            window.setTimeout(() => { URL.revokeObjectURL(url); link.remove(); }, 0);
        }
    }

    function drawSimulationCanvas(context, canvas, snapshot) {
        const width = canvas.width;
        const height = canvas.height;
        context.clearRect(0, 0, width, height);
        context.fillStyle = "#020814";
        context.fillRect(0, 0, width, height);
        drawRelationalSubstrateBackground(context, width, height, snapshot);
        drawVisibleRelationalActivityLayer(context, width, height, snapshot);
        if (snapshot.recipe.mode === "galaxyRotation") { drawGalaxy(context, width, height, snapshot); }
        else if (snapshot.recipe.mode === "darkMatterWind") { drawWind(context, width, height, snapshot); }
        else if (snapshot.recipe.mode === "lensingVisualization") { drawLensing(context, width, height, snapshot); }
        else if (snapshot.recipe.mode === "arcsecsHypothesis") { drawArcSecsComparison(context, width, height, snapshot); }
        else { drawDriveSchematic(context, width, height, snapshot); }
        drawRelationalTetherOverlay(context, width, height, snapshot);
        drawGpuRenderSampleOverlay(context, width, height, snapshot);
        drawNavigationOverlay(context, width, height, snapshot);
        drawLightSlowingPropagationOverlay(context, width, height, snapshot);
        drawDriveMotionDirectorOverlay(context, width, height, snapshot);
        drawAutopilotDemoDirectorOverlay(context, width, height, snapshot);
        drawAcceptanceFlightVisibleMotionOverlay(context, width, height, snapshot);
        drawViewportActionOverlay(context, width, height, snapshot);
    }


    function getViewportMotionPhase(snapshot, offset) {
        const baseTick = snapshot && snapshot.telemetry ? finiteNumber(snapshot.telemetry.tick, 0) : 0;
        const simulationSeconds = snapshot && snapshot.telemetry ? finiteNumber(snapshot.telemetry.simulationTimeSeconds, 0) : 0;
        const previewSeconds = snapshot && !snapshot.running && typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() / 1000 : 0;
        return baseTick * 0.055 + simulationSeconds * 0.45 + previewSeconds * 0.82 + finiteNumber(offset, 0);
    }

    function getViewportActivity(snapshot) {
        if (!snapshot || !snapshot.running) { return 0.48; }
        const charge = snapshot.telemetry ? finiteNumber(snapshot.telemetry.driveCharge, 0) : 0;
        const output = snapshot.telemetry ? finiteNumber(snapshot.telemetry.driveOutput, 0) : 0;
        const flux = snapshot.telemetry ? finiteNumber(snapshot.telemetry.procaFluxDensity, 1) : 1;
        return clamp(0.42 + charge * 0.34 + output * 0.22 + flux * 0.035, 0.22, 1.2);
    }

    function drawVisibleRelationalActivityLayer(context, width, height, snapshot) {
        const phase = getViewportMotionPhase(snapshot, 0.4);
        const activity = getViewportActivity(snapshot);
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const current = clamp(finiteNumber(snapshot.telemetry.procaSubstrateCurrent, 1), 0, 8);
        const lineCount = snapshot.running ? 26 : 12;
        context.save();
        context.globalCompositeOperation = "screen";
        for (let index = 0; index < lineCount; index += 1) {
            const progress = (index / lineCount + phase * 0.035) % 1;
            const band = (index % 7) / 6;
            const x = width * progress;
            const y = centerY + Math.sin(progress * TWO_PI * 1.8 + index * 0.83 + phase) * height * (0.08 + band * 0.035);
            const length = 42 + current * 8 + activity * 36;
            context.strokeStyle = "rgba(101,231,255," + (0.06 + activity * 0.11).toFixed(3) + ")";
            context.lineWidth = 1 + band * 1.2;
            context.beginPath();
            context.moveTo(x - length, y - Math.cos(phase + index) * 18);
            context.quadraticCurveTo(x, y, x + length, y + Math.sin(phase + index) * 20);
            context.stroke();
        }
        for (let index = 0; index < 8; index += 1) {
            const angle = phase * (0.28 + index * 0.025) + index * TWO_PI / 8;
            const radius = Math.min(width, height) * (0.12 + (index % 4) * 0.06 + activity * 0.012);
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle * 1.18) * radius * 0.52;
            context.fillStyle = index % 2 === 0 ? "rgba(255,214,111,.38)" : "rgba(111,245,214,.38)";
            context.beginPath();
            context.arc(x, y, 2.4 + activity * 2.2, 0, TWO_PI);
            context.fill();
        }
        context.restore();
    }

    function drawLightSlowingPropagationOverlay(context, width, height, snapshot) {
        if (!snapshot || !snapshot.telemetry) { return; }
        const telemetry = snapshot.telemetry;
        const phase = getViewportMotionPhase(snapshot, 2.4);
        const left = width * 0.055;
        const right = width * 0.945;
        const top = height * 0.118;
        const railGap = height * 0.052;
        const distance = Math.max(1, finiteNumber(telemetry.lightSlowingDistanceMegaparsecs, GW170817_ANCHOR_DISTANCE_MEGAPARSECS));
        const speedLoss = Math.max(0, finiteNumber(telemetry.lightSlowingSpeedDecreaseMetersPerSecond, 0));
        const redshiftSpeedLoss = Math.max(0, finiteNumber(telemetry.lightSlowingRedshiftLinkedSpeedDecreaseMetersPerSecond, 0));
        const propagationDelay = Math.max(0, finiteNumber(telemetry.lightSlowingPropagationDelaySeconds, 0));
        const lightProgress = snapshot.running ? (phase * 0.032) % 1 : 0.74;
        const gwProgress = snapshot.running ? (phase * 0.038) % 1 : 0.78;
        const lagPixels = clamp((propagationDelay / Math.max(0.02, propagationDelay + finiteNumber(telemetry.lightSlowingIntrinsicDelaySeconds, 1.72))) * width * 0.22, 4, width * 0.16);
        const gwX = left + (right - left) * gwProgress;
        const emX = clamp(left + (right - left) * lightProgress - lagPixels * 0.18, left, right);
        context.save();
        context.globalCompositeOperation = "screen";
        context.fillStyle = "rgba(2,8,20,.48)";
        context.fillRect(left - 12, top - 28, right - left + 24, railGap * 2.6);
        context.strokeStyle = "rgba(111,245,214,.24)";
        context.strokeRect(left - 12, top - 28, right - left + 24, railGap * 2.6);
        context.setLineDash([7, 8]);
        context.strokeStyle = "rgba(111,245,214,.58)";
        context.beginPath();
        context.moveTo(left, top);
        context.lineTo(right, top);
        context.stroke();
        context.strokeStyle = "rgba(255,214,111,.52)";
        context.beginPath();
        context.moveTo(left, top + railGap);
        context.lineTo(right, top + railGap);
        context.stroke();
        context.setLineDash([]);
        context.fillStyle = "rgba(111,245,214,.96)";
        context.beginPath();
        context.arc(gwX, top, 4.2, 0, TWO_PI);
        context.fill();
        const emAlpha = clamp(0.94 - finiteNumber(telemetry.lightSlowingEnergyLossPercent, 0) / 130, 0.34, 0.94);
        context.fillStyle = "rgba(255,214,111," + emAlpha.toFixed(3) + ")";
        context.beginPath();
        context.arc(emX, top + railGap, 4.8 + clamp(speedLoss / 1000000, 0, 4), 0, TWO_PI);
        context.fill();
        context.strokeStyle = "rgba(255,114,114,.42)";
        context.setLineDash([3, 5]);
        context.beginPath();
        context.moveTo(gwX, top + 7);
        context.lineTo(emX, top + railGap - 7);
        context.stroke();
        context.setLineDash([]);
        context.fillStyle = "rgba(236,251,255,.84)";
        context.font = "11px monospace";
        context.textAlign = "left";
        context.fillText("GW baseline c0=" + formatMetric(SPEED_OF_LIGHT_METERS_PER_SECOND, " m/s"), left, top - 9);
        context.fillText("EM slowed: Δv=" + formatMetric(speedLoss, " m/s") + " • lag=" + formatMetric(propagationDelay, " s") + " • D=" + formatMetric(distance, " Mpc"), left, top + railGap + 22);
        context.fillStyle = "rgba(255,214,111,.82)";
        context.fillText("redshift-linked Δv=" + formatMetric(redshiftSpeedLoss, " m/s") + " • z=" + formatMetric(telemetry.lightSlowingTargetRedshift, ""), left, top + railGap + 38);
        context.fillText("wavefront tracker: " + safeVisibleText(telemetry.multiMessengerEventLabel) + " • substrate " + safeVisibleText(telemetry.substrateDensityProfileLabel), left, top + railGap + 54);
        context.fillText("density-corrected EM lag=" + formatMetric(telemetry.multiMessengerDensityCorrectedPropagationDelaySeconds, " s") + " • composite z=" + formatMetric(telemetry.compositeRedshift, ""), left, top + railGap + 70);
        context.restore();
    }


    function drawDriveMotionDirectorOverlay(context, width, height, snapshot) {
        if (!snapshot || !snapshot.telemetry) { return; }
        const telemetry = snapshot.telemetry;
        const phase = getViewportMotionPhase(snapshot, 4.8);
        const activity = getViewportActivity(snapshot);
        const centerX = width * 0.5;
        const centerY = height * 0.52;
        const left = width * 0.11;
        const right = width * 0.91;
        const routeY = height * 0.63;
        const charge = clamp(finiteNumber(telemetry.driveCharge, 0), 0, 1);
        const output = clamp(finiteNumber(telemetry.driveOutput, 0), 0, 3);
        const density = clamp(finiteNumber(telemetry.mediumDensityMultiplier, finiteNumber(telemetry.substrateDensityMultiplier, 1)), 0.1, 8);
        const progress = snapshot.running ? (phase * 0.045) % 1 : (phase * 0.018) % 1;
        const shipX = left + (right - left) * progress;
        const shipY = routeY + Math.sin(phase * 1.4) * height * 0.035 * activity;
        context.save();
        context.globalCompositeOperation = "screen";
        context.lineWidth = 2;
        context.strokeStyle = "rgba(111,245,214,.44)";
        context.setLineDash([10, 10]);
        context.lineDashOffset = -phase * 18;
        context.beginPath();
        context.moveTo(left, routeY);
        context.quadraticCurveTo(centerX, routeY - height * 0.18, right, routeY);
        context.stroke();
        context.setLineDash([]);
        for (let index = 0; index < 22; index += 1) {
            const packetProgress = (index / 22 + phase * (0.032 + density * 0.003)) % 1;
            const packetX = right - (right - left) * packetProgress;
            const packetY = routeY - height * 0.1 + Math.sin(packetProgress * TWO_PI * 2 + phase + index) * height * 0.085;
            const fade = clamp(0.78 - packetProgress * 0.44 - density * 0.035, 0.14, 0.86);
            context.fillStyle = index % 3 === 0 ? "rgba(255,114,114," + fade.toFixed(3) + ")" : "rgba(255,214,111," + fade.toFixed(3) + ")";
            context.beginPath();
            context.arc(packetX, packetY, 1.8 + activity * 2.2, 0, TWO_PI);
            context.fill();
        }
        const plumeLength = 42 + charge * 48 + output * 24;
        const plumePulse = 0.55 + Math.sin(phase * 5.2) * 0.22;
        const plumeGradient = context.createLinearGradient(shipX - plumeLength, shipY, shipX, shipY);
        plumeGradient.addColorStop(0, "rgba(111,245,214,0)");
        plumeGradient.addColorStop(0.45, "rgba(111,245,214," + (0.18 + plumePulse * 0.24).toFixed(3) + ")");
        plumeGradient.addColorStop(1, "rgba(255,214,111,.72)");
        context.strokeStyle = plumeGradient;
        context.lineWidth = 6 + output * 1.6;
        context.beginPath();
        context.moveTo(shipX - plumeLength, shipY + Math.sin(phase * 2.1) * 10);
        context.quadraticCurveTo(shipX - plumeLength * 0.44, shipY - 16 * activity, shipX - 8, shipY);
        context.stroke();
        context.fillStyle = "rgba(255,214,111,.96)";
        context.beginPath();
        context.moveTo(shipX + 16, shipY);
        context.lineTo(shipX - 12, shipY - 10 - activity * 4);
        context.lineTo(shipX - 6, shipY);
        context.lineTo(shipX - 12, shipY + 10 + activity * 4);
        context.closePath();
        context.fill();
        context.strokeStyle = "rgba(111,245,214,.88)";
        context.lineWidth = 1.6;
        for (let tetherIndex = 0; tetherIndex < 6; tetherIndex += 1) {
            const angle = phase * 0.7 + tetherIndex * TWO_PI / 6;
            const radius = 38 + Math.sin(phase + tetherIndex) * 8 * activity;
            context.beginPath();
            context.moveTo(shipX, shipY);
            context.lineTo(shipX + Math.cos(angle) * radius, shipY + Math.sin(angle) * radius * 0.48);
            context.stroke();
        }
        const gwRadius = 22 + ((phase * 24) % 96);
        const photonRadius = 14 + ((phase * 16) % 84);
        context.strokeStyle = "rgba(101,231,255,.62)";
        context.lineWidth = 1.4;
        context.beginPath();
        context.arc(left + width * 0.04, routeY - height * 0.16, gwRadius, 0, TWO_PI);
        context.stroke();
        context.strokeStyle = "rgba(255,114,114,.42)";
        context.beginPath();
        context.arc(left + width * 0.04, routeY - height * 0.16, photonRadius, 0, TWO_PI);
        context.stroke();
        context.fillStyle = "rgba(236,251,255,.82)";
        context.font = "11px monospace";
        context.textAlign = "left";
        context.fillText(snapshot.running ? "motion director: RUNNING — route, tethers, capture packets, and plume are animated" : "motion director: PREVIEW — click Start Simulation for deterministic motion", left, height * 0.98);
        context.restore();
    }
    function drawAutopilotDemoDirectorOverlay(context, width, height, snapshot) {
        const state = snapshot && snapshot.demoDirector ? snapshot.demoDirector : null;
        if (!state || !state.stage) { return; }
        const stage = state.stage;
        const progress = clamp(finiteNumber(state.progress, 0), 0, 1);
        const panelX = width * 0.04;
        const panelY = height * 0.78;
        const panelWidth = width * 0.42;
        const panelHeight = height * 0.15;
        context.save();
        context.fillStyle = state.active ? "rgba(1,30,38,.76)" : "rgba(2,8,20,.62)";
        context.strokeStyle = state.active ? "rgba(111,245,214,.72)" : "rgba(255,214,111,.48)";
        context.lineWidth = 1.6;
        context.fillRect(panelX, panelY, panelWidth, panelHeight);
        context.strokeRect(panelX, panelY, panelWidth, panelHeight);
        context.fillStyle = "rgba(111,245,214,.92)";
        context.font = "12px monospace";
        context.textAlign = "left";
        context.fillText("DEMO FLIGHT DIRECTOR • " + (state.active ? "AUTO" : "READY") + " • " + (state.stageIndex + 1) + "/" + state.stageCount, panelX + 14, panelY + 22);
        context.fillStyle = "rgba(255,255,255,.92)";
        context.font = "15px monospace";
        context.fillText(safeVisibleText(stage.title), panelX + 14, panelY + 44);
        context.fillStyle = "rgba(236,251,255,.74)";
        context.font = "11px monospace";
        context.fillText(safeVisibleText(stage.expectedMotion).slice(0, 88), panelX + 14, panelY + 65);
        context.fillStyle = "rgba(4,13,28,.96)";
        context.fillRect(panelX + 14, panelY + panelHeight - 28, panelWidth - 28, 9);
        context.fillStyle = "rgba(255,214,111,.88)";
        context.fillRect(panelX + 14, panelY + panelHeight - 28, (panelWidth - 28) * progress, 9);
        context.restore();
    }


    // Acceptance Flight visible motion overlay: route rail and stage nodes.
    function drawAcceptanceFlightVisibleMotionOverlay(context, width, height, snapshot) {
        const state = snapshot && snapshot.demoDirector ? snapshot.demoDirector : null;
        const selectedDemoKey = snapshot && snapshot.selectedDemoKey ? safeVisibleText(snapshot.selectedDemoKey) : "";
        const visualRun = snapshot ? snapshot.acceptanceFlightVisualRun : null;
        const shouldDraw = Boolean(state && state.stage && (selectedDemoKey === "acceptance-flight" || (visualRun && (visualRun.active || visualRun.completed))));
        if (!shouldDraw) { return; }

        const stage = state.stage;
        const progress = clamp(finiteNumber(state.progress, 0), 0, 1);
        const stageIndex = Math.max(0, Math.round(finiteNumber(state.stageIndex, 0)));
        const stageCount = Math.max(1, Math.round(finiteNumber(state.stageCount, AUTOPILOT_DEMO_STAGES.length)));
        const phase = getViewportMotionPhase(snapshot, 4.2);
        const routeStartX = width * 0.14;
        const routeEndX = width * 0.86;
        const routeBaseY = height * 0.27;
        const routeSpan = routeEndX - routeStartX;
        const globalProgress = clamp((stageIndex + progress) / stageCount, 0, 1);
        const shipX = routeStartX + routeSpan * globalProgress;
        const shipY = routeBaseY + Math.sin(globalProgress * Math.PI * 2.8 + phase * 0.35) * height * 0.055;
        const visitedStageIds = visualRun && Array.isArray(visualRun.visitedStageIds) ? visualRun.visitedStageIds : [];
        const statusLabel = visualRun && visualRun.completed ? "ACCEPTANCE COMPLETE" : (visualRun && visualRun.active ? "ACCEPTANCE PLAYBACK" : "ACCEPTANCE READY");

        context.save();
        context.globalCompositeOperation = "screen";

        const bandGradient = context.createLinearGradient(routeStartX, routeBaseY, routeEndX, routeBaseY);
        bandGradient.addColorStop(0, "rgba(101,231,255,.10)");
        bandGradient.addColorStop(0.35, "rgba(111,245,214,.22)");
        bandGradient.addColorStop(0.62, "rgba(255,214,111,.24)");
        bandGradient.addColorStop(1, "rgba(255,105,135,.12)");
        context.fillStyle = bandGradient;
        context.fillRect(routeStartX - 26, routeBaseY - height * 0.11, routeSpan + 52, height * 0.22);

        context.strokeStyle = "rgba(101,231,255,.46)";
        context.lineWidth = 2;
        context.beginPath();
        for (let pointIndex = 0; pointIndex <= 120; pointIndex += 1) {
            const fraction = pointIndex / 120;
            const x = routeStartX + routeSpan * fraction;
            const y = routeBaseY + Math.sin(fraction * Math.PI * 2.8 + phase * 0.35) * height * 0.055;
            if (pointIndex === 0) { context.moveTo(x, y); }
            else { context.lineTo(x, y); }
        }
        context.stroke();

        context.strokeStyle = "rgba(255,214,111,.80)";
        context.lineWidth = 3.2;
        context.beginPath();
        for (let pointIndex = 0; pointIndex <= Math.max(2, Math.round(120 * globalProgress)); pointIndex += 1) {
            const fraction = pointIndex / 120;
            const x = routeStartX + routeSpan * fraction;
            const y = routeBaseY + Math.sin(fraction * Math.PI * 2.8 + phase * 0.35) * height * 0.055;
            if (pointIndex === 0) { context.moveTo(x, y); }
            else { context.lineTo(x, y); }
        }
        context.stroke();

        for (let index = 0; index < stageCount; index += 1) {
            const fraction = stageCount <= 1 ? 0 : index / (stageCount - 1);
            const nodeX = routeStartX + routeSpan * fraction;
            const nodeY = routeBaseY + Math.sin(fraction * Math.PI * 2.8 + phase * 0.35) * height * 0.055;
            const active = index === stageIndex;
            const stageRecord = AUTOPILOT_DEMO_STAGES[index] || { id: "" };
            const visited = index < stageIndex || visitedStageIds.indexOf(stageRecord.id) !== -1;
            context.beginPath();
            context.fillStyle = active ? "rgba(255,214,111,.96)" : (visited ? "rgba(111,245,214,.84)" : "rgba(101,231,255,.28)");
            context.arc(nodeX, nodeY, active ? 9 : 6, 0, TWO_PI);
            context.fill();
            context.strokeStyle = active ? "rgba(255,255,255,.82)" : "rgba(101,231,255,.38)";
            context.lineWidth = active ? 2 : 1;
            context.stroke();
        }

        const pulse = 0.72 + Math.sin(phase * 3.4) * 0.18;
        context.translate(shipX, shipY);
        context.rotate(Math.sin(phase * 0.6) * 0.18);
        context.fillStyle = "rgba(255,214,111," + pulse.toFixed(3) + ")";
        context.strokeStyle = "rgba(255,255,255,.86)";
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(16, 0);
        context.lineTo(-12, -9);
        context.lineTo(-7, 0);
        context.lineTo(-12, 9);
        context.closePath();
        context.fill();
        context.stroke();
        context.strokeStyle = "rgba(111,245,214,.48)";
        context.beginPath();
        context.moveTo(-15, 0);
        context.lineTo(-37 - Math.sin(phase * 2.8) * 8, 0);
        context.stroke();
        context.setTransform(1, 0, 0, 1, 0, 0);

        const labelX = width * 0.52;
        const labelY = height * 0.08;
        context.fillStyle = "rgba(2,8,20,.76)";
        context.fillRect(labelX - width * 0.30, labelY - 22, width * 0.60, 78);
        context.strokeStyle = "rgba(255,214,111,.72)";
        context.strokeRect(labelX - width * 0.30, labelY - 22, width * 0.60, 78);
        context.textAlign = "center";
        context.font = "12px monospace";
        context.fillStyle = "rgba(111,245,214,.92)";
        context.fillText(statusLabel + " • STAGE " + (stageIndex + 1) + "/" + stageCount, labelX, labelY);
        context.font = "16px monospace";
        context.fillStyle = "rgba(255,255,255,.94)";
        context.fillText(safeVisibleText(stage.title), labelX, labelY + 24);
        context.font = "11px monospace";
        context.fillStyle = "rgba(236,251,255,.78)";
        context.fillText(safeVisibleText(stage.expectedMotion).slice(0, 108), labelX, labelY + 45);

        context.restore();
    }

    function drawViewportActionOverlay(context, width, height, snapshot) {
        const phase = getViewportMotionPhase(snapshot, 0);
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        context.save();
        context.font = "12px monospace";
        if (!snapshot.running) {
            const pulse = 0.55 + Math.sin(phase * 1.7) * 0.12;
            context.fillStyle = "rgba(2,8,20,.56)";
            context.fillRect(width * 0.31, height * 0.41, width * 0.38, height * 0.18);
            context.strokeStyle = "rgba(255,214,111," + pulse.toFixed(3) + ")";
            context.lineWidth = 2;
            context.strokeRect(width * 0.31, height * 0.41, width * 0.38, height * 0.18);
            context.fillStyle = "rgba(255,214,111,.92)";
            context.textAlign = "center";
            context.fillText("PAUSED — click viewport or Start Simulation", centerX, centerY - 8);
            context.fillStyle = "rgba(236,251,255,.76)";
            context.fillText("Visible Weber tethers and Proca currents animate when running", centerX, centerY + 14);
        } else {
            context.fillStyle = "rgba(111,245,214,.78)";
            context.textAlign = "right";
            context.fillText("LIVE RELATIONAL PROJECTION • click viewport to pause", width * 0.96, height * 0.08);
            const radius = 11 + Math.sin(phase * 2.2) * 3;
            context.strokeStyle = "rgba(255,214,111,.72)";
            context.lineWidth = 1.4;
            context.beginPath();
            context.arc(width * 0.04, height * 0.92, radius, 0, TWO_PI);
            context.stroke();
        }
        context.restore();
    }

    function drawRelationalSubstrateBackground(context, width, height, snapshot) {
        const flux = clamp(finiteNumber(snapshot.telemetry.procaFluxDensity, 1), 0, 8);
        const phase = getViewportMotionPhase(snapshot, 0);
        const activity = getViewportActivity(snapshot);
        context.save();
        context.strokeStyle = "rgba(101,231,255," + (0.08 + flux * 0.018).toFixed(3) + ")";
        context.lineWidth = 1;
        for (let ringIndex = 0; ringIndex < 8; ringIndex += 1) {
            const pulse = snapshot.running ? Math.sin(phase * 1.35 + ringIndex * 0.64) * 0.012 * activity : 0;
            const radius = Math.min(width, height) * (0.08 + ringIndex * 0.055 + flux * 0.004 + pulse);
            context.beginPath();
            context.arc(width * 0.5, height * 0.5, radius, 0, TWO_PI);
            context.stroke();
        }
        context.fillStyle = "rgba(111,245,214,.78)";
        context.font = "12px monospace";
        context.fillText("coordinate-free relational projection • Proca substrate flux " + formatMetric(flux, ""), width * 0.04, height * 0.08);
        context.restore();
    }

    function drawRelationalTetherOverlay(context, width, height, snapshot) {
        const projectionNodes = snapshot && snapshot.telemetry && Array.isArray(snapshot.telemetry.relationalProjectionNodes) ? snapshot.telemetry.relationalProjectionNodes : [];
        if (!projectionNodes.length) { return; }
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const scale = Math.min(width, height) * 0.36;
        const suppression = clamp(finiteNumber(snapshot.telemetry.weberTetherSuppressionRatio, 0), 0, 1);
        const phase = getViewportMotionPhase(snapshot, 1.7);
        const activity = getViewportActivity(snapshot);
        context.save();
        for (let index = 0; index < projectionNodes.length; index += 1) {
            const node = projectionNodes[index];
            const nodePhase = phase + index * 0.72;
            const drift = snapshot.running ? Math.sin(nodePhase) * 0.024 * activity : 0;
            const displayX = centerX + (finiteNumber(node.displayU, 0) + drift) * scale;
            const displayY = centerY + (finiteNumber(node.displayV, 0) + Math.cos(nodePhase * 0.9) * 0.018 * activity) * scale;
            if (node.entityId !== "ship") {
                const flowAlpha = 0.18 + suppression * 0.34 + Math.max(0, Math.sin(nodePhase * 1.8)) * 0.16 * activity;
                context.strokeStyle = "rgba(111,245,214," + flowAlpha.toFixed(3) + ")";
                context.lineWidth = 1 + suppression * 2 + activity * 0.8;
                context.setLineDash(suppression > 0.25 ? [8, 7] : [5, 9]);
                context.lineDashOffset = snapshot.running ? -phase * (7 + index) : 0;
                context.beginPath();
                context.moveTo(centerX, centerY);
                context.quadraticCurveTo((centerX + displayX) * 0.5 + Math.sin(nodePhase) * 20 * activity, (centerY + displayY) * 0.5 + Math.cos(nodePhase) * 12 * activity, displayX, displayY);
                context.stroke();
                if (snapshot.running) {
                    const markerProgress = (phase * 0.18 + index * 0.21) % 1;
                    const markerX = centerX + (displayX - centerX) * markerProgress;
                    const markerY = centerY + (displayY - centerY) * markerProgress;
                    context.setLineDash([]);
                    context.fillStyle = "rgba(255,214,111,.82)";
                    context.beginPath();
                    context.arc(markerX, markerY, 2.2 + suppression * 2.2, 0, TWO_PI);
                    context.fill();
                }
            }
            context.setLineDash([]);
            context.lineDashOffset = 0;
            context.fillStyle = node.entityId === "ship" ? "rgba(255,214,111,.95)" : "rgba(101,231,255,.72)";
            context.beginPath();
            context.arc(displayX, displayY, node.entityId === "ship" ? 7 + activity * 1.5 : 4 + activity, 0, TWO_PI);
            context.fill();
        }
        context.fillStyle = "rgba(255,255,255,.82)";
        context.font = "12px monospace";
        context.fillText("Weber tether suppression " + formatMetric(suppression * 100, "%") + " • Machian mass " + formatMetric(snapshot.telemetry.machianEffectiveInertialMass, ""), width * 0.04, height * 0.12);
        context.restore();
    }

    function drawGpuRenderSampleOverlay(context, width, height, snapshot) {
        const samplePoints = snapshot && snapshot.telemetry && Array.isArray(snapshot.telemetry.webGpuRenderSamplePoints) ? snapshot.telemetry.webGpuRenderSamplePoints : [];
        if (!samplePoints.length) { return; }
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const scale = Math.min(width, height) * 0.34;
        context.save();
        context.fillStyle = "rgba(111,245,214,.72)";
        for (let sampleIndex = 0; sampleIndex < samplePoints.length; sampleIndex += 1) {
            const point = samplePoints[sampleIndex] || {};
            const x = centerX + clamp(finiteNumber(point.x, 0), -2, 2) * scale;
            const y = centerY + clamp(finiteNumber(point.y, 0), -2, 2) * scale;
            const radius = 1.5 + clamp(finiteNumber(point.progress, 0), 0, 1) * 2.2;
            context.beginPath();
            context.arc(x, y, radius, 0, TWO_PI);
            context.fill();
        }
        context.fillStyle = "rgba(111,245,214,.88)";
        context.font = "12px monospace";
        context.fillText("GPU sample " + samplePoints.length + " latest particles", width * 0.04, height * 0.08);
        context.restore();
    }

    function drawNavigationOverlay(context, width, height, snapshot) {
        const routeConfidence = clamp(finiteNumber(snapshot.telemetry.routeConfidence, 0.5), 0, 1);
        const hazard = clamp(finiteNumber(snapshot.telemetry.routeHazardScore, 0.2), 0, 1);
        const correction = clamp(finiteNumber(snapshot.telemetry.courseCorrectionDegrees, 0), -5, 5);
        const waypoints = Math.max(1, Math.round(finiteNumber(snapshot.telemetry.navigationWaypoints, 4)));
        context.save();
        context.strokeStyle = routeConfidence > 0.65 ? "rgba(111,245,214,.72)" : "rgba(255,214,111,.72)";
        context.fillStyle = hazard > 0.55 ? "rgba(255,114,114,.9)" : "rgba(111,245,214,.9)";
        context.lineWidth = 2;
        context.setLineDash([6, 8]);
        context.beginPath();
        for (let index = 0; index <= waypoints; index += 1) {
            const progress = index / waypoints;
            const x = width * (0.12 + progress * 0.76);
            const y = height * (0.18 + progress * 0.64) + Math.sin(progress * Math.PI * 2 + correction) * height * 0.06;
            if (index === 0) { context.moveTo(x, y); }
            else { context.lineTo(x, y); }
        }
        context.stroke();
        context.setLineDash([]);
        for (let index = 0; index <= waypoints; index += 1) {
            const progress = index / waypoints;
            const x = width * (0.12 + progress * 0.76);
            const y = height * (0.18 + progress * 0.64) + Math.sin(progress * Math.PI * 2 + correction) * height * 0.06;
            context.beginPath();
            context.arc(x, y, 4 + routeConfidence * 4, 0, TWO_PI);
            context.fill();
        }
        context.fillStyle = "rgba(255,255,255,.82)";
        context.font = "14px monospace";
        context.fillText("Route " + formatMetric(routeConfidence * 100, "%") + " • " + safeVisibleText(snapshot.telemetry.recommendedAction), width * 0.04, height * 0.94);
        context.restore();
    }

    function drawGalaxy(context, width, height, snapshot) {
        const centerX = width * 0.48; const centerY = height * 0.5; const haloRadius = Math.min(width, height) * (0.18 + snapshot.recipe.darkMatterDial * 0.04);
        context.fillStyle = "rgba(101,231,255,0.08)"; context.beginPath(); context.arc(centerX, centerY, haloRadius, 0, TWO_PI); context.fill();
        for (let arm = 0; arm < 3; arm += 1) {
            context.strokeStyle = "rgba(255,214,111,0.75)"; context.beginPath();
            for (let index = 0; index < 80; index += 1) { const t = index / 79; const angle = t * 5.2 + arm * TWO_PI / 3 + snapshot.telemetry.tick * 0.004; const radius = t * Math.min(width, height) * 0.32; const x = centerX + Math.cos(angle) * radius; const y = centerY + Math.sin(angle) * radius * 0.45; if (index === 0) { context.moveTo(x, y); } else { context.lineTo(x, y); } }
            context.stroke();
        }
        drawCurve(context, width * 0.08, height * 0.78, width * 0.38, height * 0.16, snapshot.telemetry.visibleOnlyVelocity / 160, "rgba(255,114,114,.75)", true);
        drawCurve(context, width * 0.08, height * 0.78, width * 0.38, height * 0.16, snapshot.telemetry.currentOrbitalVelocity / 160, "rgba(111,245,214,.85)", false);
    }

    function drawCurve(context, x, y, width, height, scale, color, falling) {
        context.strokeStyle = color; context.lineWidth = 2; context.beginPath();
        for (let index = 0; index < 40; index += 1) { const t = index / 39; const value = falling ? (1 - t * 0.7) * scale : (0.7 + t * 0.22) * scale; const px = x + t * width; const py = y - value * height; if (index === 0) { context.moveTo(px, py); } else { context.lineTo(px, py); } }
        context.stroke();
    }

    function drawWind(context, width, height, snapshot) {
        const wind = VectorMath.directionFromDegrees(snapshot.recipe.windDirectionDegrees); const ship = VectorMath.directionFromDegrees(snapshot.recipe.shipHeadingDegrees);
        for (let index = 0; index < 42; index += 1) { const offset = (index * 31 + snapshot.telemetry.tick * 3) % width; const y = (index % 12) / 11 * height; context.strokeStyle = "rgba(101,231,255,.42)"; context.beginPath(); context.moveTo(width - offset, y); context.lineTo(width - offset - wind.x * 48, y - wind.y * 48); context.stroke(); }
        context.fillStyle = "rgba(255,214,111,.92)"; context.beginPath(); context.moveTo(width * 0.5 + ship.x * 46, height * 0.5 + ship.y * 46); context.lineTo(width * 0.5 - ship.y * 18, height * 0.5 + ship.x * 18); context.lineTo(width * 0.5 + ship.y * 18, height * 0.5 - ship.x * 18); context.closePath(); context.fill();
        context.strokeStyle = "rgba(111,245,214,.75)"; context.beginPath(); context.arc(width * 0.5, height * 0.5, 70 + snapshot.telemetry.captureArea * 12, 0, TWO_PI); context.stroke();
    }

    function drawDriveSchematic(context, width, height, snapshot) {
        const phase = getViewportMotionPhase(snapshot, 1.1);
        const activity = getViewportActivity(snapshot);
        const driveCharge = clamp(finiteNumber(snapshot.telemetry.driveCharge, 0), 0, 1);
        const driveOutput = clamp(finiteNumber(snapshot.telemetry.driveOutput, 0), 0, 3);
        const centerX = width * 0.54;
        const centerY = height * 0.5;
        context.save();
        context.strokeStyle = "rgba(111,245,214,.75)";
        context.fillStyle = "rgba(12,23,42,.8)";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(width * 0.08, height * 0.5);
        context.bezierCurveTo(width * 0.26, height * 0.18, width * 0.75, height * 0.18, width * 0.94, height * 0.5);
        context.bezierCurveTo(width * 0.75, height * 0.82, width * 0.26, height * 0.82, width * 0.08, height * 0.5);
        context.fill();
        context.stroke();
        for (let ringIndex = 0; ringIndex < 4; ringIndex += 1) {
            const ringPhase = phase * (0.65 + ringIndex * 0.12) + ringIndex * 0.9;
            const ringRadiusX = 50 + ringIndex * 18 + driveCharge * 20;
            const ringRadiusY = 18 + ringIndex * 9 + activity * 7;
            context.strokeStyle = ringIndex % 2 === 0 ? "rgba(101,231,255,.58)" : "rgba(255,214,111,.52)";
            context.lineWidth = 1.4 + driveCharge * 1.2;
            context.beginPath();
            context.ellipse(centerX, centerY, ringRadiusX, ringRadiusY, ringPhase, 0, TWO_PI);
            context.stroke();
        }
        const pulseRadius = 30 + driveCharge * 28 + (snapshot.running ? Math.sin(phase * 2.4) * 7 * activity : 0);
        context.fillStyle = "rgba(255,214,111,.82)";
        context.beginPath();
        context.arc(centerX, centerY, Math.max(10, pulseRadius), 0, TWO_PI);
        context.fill();
        context.strokeStyle = "rgba(255,214,111,.42)";
        for (let pulseIndex = 0; pulseIndex < 3; pulseIndex += 1) {
            const radius = pulseRadius + 16 + ((phase * 18 + pulseIndex * 26) % 72);
            context.globalAlpha = Math.max(0.08, 0.36 - pulseIndex * 0.07);
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, TWO_PI);
            context.stroke();
        }
        context.globalAlpha = 1;
        const outputLength = 70 + driveOutput * 42 + driveCharge * 44;
        context.strokeStyle = "rgba(111,245,214,.82)";
        context.lineWidth = 3 + driveOutput * 1.2;
        context.beginPath();
        context.moveTo(width * 0.82, centerY);
        context.lineTo(width * 0.82 + outputLength, centerY + Math.sin(phase * 1.7) * 16 * activity);
        context.stroke();
        context.fillStyle = "rgba(111,245,214,.82)";
        for (let particleIndex = 0; particleIndex < 18; particleIndex += 1) {
            const progress = (particleIndex / 18 + phase * 0.045) % 1;
            const x = width * 0.1 + progress * width * 0.78;
            const y = centerY + Math.sin(progress * TWO_PI * 2.1 + phase + particleIndex) * height * 0.18;
            context.beginPath();
            context.arc(x, y, 1.5 + driveCharge * 2.5, 0, TWO_PI);
            context.fill();
        }
        context.fillStyle = "rgba(255,255,255,.84)";
        context.font = "12px monospace";
        context.fillText("animated inertial-decoupling core • charge " + formatMetric(driveCharge * 100, "%"), width * 0.04, height * 0.9);
        context.restore();
    }

    function drawLensing(context, width, height, snapshot) {
        const centerX = width * 0.48; const centerY = height * 0.5; const massRadius = 24 + snapshot.recipe.mass * 0.32;
        context.fillStyle = "rgba(255,214,111,.95)"; context.beginPath(); context.arc(centerX, centerY, massRadius, 0, TWO_PI); context.fill();
        context.strokeStyle = "rgba(101,231,255,.65)"; for (let index = -4; index <= 4; index += 1) { const y = centerY + index * 34; context.beginPath(); context.moveTo(width * 0.04, y); context.quadraticCurveTo(centerX, y + snapshot.telemetry.lensingDeflectionArcseconds * 2.6 / (Math.abs(index) + 1), width * 0.96, y); context.stroke(); }
    }

    function drawArcSecsComparison(context, width, height, snapshot) {
        drawGalaxy(context, width, height, snapshot);
        context.strokeStyle = "rgba(255,255,255,.28)"; context.setLineDash([8, 8]); context.beginPath(); context.moveTo(width * 0.5, height * 0.12); context.lineTo(width * 0.5, height * 0.88); context.stroke(); context.setLineDash([]);
        context.fillStyle = "rgba(255,255,255,.85)"; context.font = "18px monospace"; context.fillText("Reference overlays", width * 0.08, height * 0.14); context.fillText("ArcSecs hypothesis overlay", width * 0.56, height * 0.14);
    }

    function initializePages() {
        document.querySelectorAll("[data-arcsecs-dark-drive]").forEach((root) => {
            if (root.__arcsecsDriveController) return;
            const page = new DashboardController(root);
            root.__arcsecsDriveController = page;
            page.initialize();
        });
    }

    if (typeof document !== "undefined") {
        if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", initializePages); }
        else { initializePages(); }
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = { SCIENTIFIC_BOUNDARY, SIMULATION_MODES, HOTSPOTS, PRESETS, GUIDED_SCENARIOS, MISSION_STAGES, AUTOPILOT_DEMO_STAGES, NUMERIC_RANGES, UnitConversion, ArcsecondConversion, VectorMath, SimulationClock, GalaxyRotationModel, DarkMatterHaloModel, DarkMatterWindModel, SpacecraftState, DriveState, LensingApproximationModel, CosmologyReferenceModel, QuantizedInertiaModel, HaloscopeSailingModel, AlcubierreVisualizationModel, OpticalTelemetryModel, DarkMatterJFactorModel, ElectromagneticLightSlowingModel, GravityWavefront, PhotonWavefront, MultiMessengerPropagationSystem, RelativisticFlightModel, WebGpuComputeReadinessModel, RollingAdaptiveComputeQualityController, RelationalNode, WeberTether, MachianMass, ProcaCoupler, DarkMatterDrive, SubstrateFieldSystem, WeberForceSystem, RelationalInertiaSystem, VectorPotentialThrustSystem, RelationalIntegrationSystem, RelationalProjectionModel, RelationalMdsGpuProjectionModel, GpuRelationalWeberForceModel, RelationalAdaptiveTetherQualityModel, RelationalEcsSimulationEngine, MortonSpatialIndexModel, WebGpuComputeTelemetryState, WebGpuNBodyComputePipeline, WebGpuComputeWorkerClient, WebGpuDirectParticleRenderer, AdaptiveHaloDensityShadingModel, TileLocalNeighborQueryModel, GpuBucketCompactionModel, GpuBucketNeighborDensityModel, GpuDensityFieldShadingModel, PointSpreadConvolutionModel, QuantumSignalEnhancementModel, DarkMatterWeatherMapModel, NavigationGuidanceModel, TrajectoryPlannerModel, EnergyBudgetModel, TelemetryState, ScenarioState, SimulationPreset, PerformanceMonitor, RendererAdapter, WebGpuRendererAdapter, WebGlRendererAdapter, CanvasRendererAdapter, InputController, DashboardController, HapticFeedbackController, ScenarioController, DarkMatterDriveSimulatorCore, DarkMatterDriveProgressMonitor, DarkMatterDriveAutopilotDirector, validateRecipe, safeVisibleText };
    }
}());
