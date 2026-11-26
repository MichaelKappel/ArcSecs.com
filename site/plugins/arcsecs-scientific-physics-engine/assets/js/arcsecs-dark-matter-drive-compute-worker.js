(function () {
    "use strict";

    const WEBGPU_COMPUTE_WORKGROUP_SIZE = 64;
    // Dedicated workers do not inherit constants from the main simulator.
    const WEBGPU_ADAPTIVE_COMPUTE_DISPATCH_CADENCE_BY_LEVEL = [18, 24, 36, 54];
    const WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES = 4096;
    const WEBGPU_REDUCED_DIAGNOSTIC_WORDS = 9;
    const WEBGPU_COMPUTE_MESSAGE_CONTRACT_VERSION = 1;
    const WEBGPU_SHARED_BUFFER_CONTRACT_VERSION = 18;
    const WEBGPU_DIAGNOSTIC_SCALE = 100000;
    // Worker readback intentionally uses reduced aggregate diagnostics, not full particle readback.
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
    const WEBGPU_RELATIONAL_WEBER_TETHER_COUNT = 10;
    const WEBGPU_RELATIONAL_WEBER_TETHER_FLOATS_PER_TETHER = 4;
    const WEBGPU_RELATIONAL_WEBER_TETHER_BYTE_LENGTH = WEBGPU_RELATIONAL_WEBER_TETHER_COUNT * WEBGPU_RELATIONAL_WEBER_TETHER_FLOATS_PER_TETHER * 4;
    const WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_WORDS = 5;
    const WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_BYTE_LENGTH = WEBGPU_RELATIONAL_WEBER_DIAGNOSTIC_WORDS * 4;
    const WEBGPU_RELATIONAL_MDS_NODE_COUNT = 5;
    const WEBGPU_RELATIONAL_MACHIAN_ENTITY_FIELDS = 4;
    const WEBGPU_RELATIONAL_MACHIAN_MASS_BYTE_LENGTH = WEBGPU_RELATIONAL_MDS_NODE_COUNT * WEBGPU_RELATIONAL_MACHIAN_ENTITY_FIELDS * 4;
    const WEBGPU_TILE_LOCAL_NEIGHBOR_LIMIT = WEBGPU_COMPUTE_WORKGROUP_SIZE;
    const WEBGPU_DENSITY_FIELD_FEEDBACK_DEFAULT_GAIN = 1;
    const WEBGPU_DENSITY_FIELD_FEEDBACK_MAX_GAIN = 3;
    const WEBGPU_FEEDBACK_DOWNSHIFT_SOFT_CLAMP_RATE = 0.02;
    const WEBGPU_FEEDBACK_DOWNSHIFT_MEDIUM_CLAMP_RATE = 0.06;
    const WEBGPU_FEEDBACK_DOWNSHIFT_HARD_CLAMP_RATE = 0.18;
    const TWO_PI = Math.PI * 2;
    const WEBGPU_RELATIONAL_WEBER_FORCE_SHADER = "GPU-resident Weber tether force accumulation pass uses packed ECS tethers, relational projection, scalar distance buffers, and per-entity Machian mass reduction storage.";
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

    function directionFromDegrees(degrees) {
        const radians = normalizeDegrees(degrees) * Math.PI / 180;
        return { x: Math.cos(radians), y: Math.sin(radians) };
    }

    function getGpuShaderStageCompute() {
        return typeof GPUShaderStage !== "undefined" ? GPUShaderStage.COMPUTE : 4;
    }

    function getGpuBufferUsageFlags() {
        if (typeof GPUBufferUsage !== "undefined") { return GPUBufferUsage; }
        return { MAP_READ: 1, COPY_SRC: 4, COPY_DST: 8, UNIFORM: 64, STORAGE: 128 };
    }

    function getGpuMapModeRead() {
        return typeof GPUMapMode !== "undefined" ? GPUMapMode.READ : 1;
    }


    class MortonSpatialIndexModel {
        constructor(gridSize) {
            this.gridSize = Math.max(2, Math.min(16, Math.round(finiteNumber(gridSize, WEBGPU_SPATIAL_BUCKET_GRID_SIZE))));
            this.bucketCount = this.gridSize * this.gridSize;
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
                if (count > 0) { rangeCount += 1; }
                if (start < contiguousRangeEnd) { sortedRangeViolations += 1; }
                compactedParticleCount += count;
                contiguousRangeEnd = Math.max(contiguousRangeEnd, start + count);
                maximumBucketRangeCount = Math.max(maximumBucketRangeCount, count);
            }
            return {
                bucketCompactionStatus: rangeCount > 0 && sortedRangeViolations === 0 ? "GPU prefix-sum ranges ready" : rangeCount > 0 ? "GPU ranges ready with guard warnings" : "waiting for GPU bucket ranges",
                bucketPrefixSumStatus: rangeCount > 0 ? "exclusive prefix sum completed on GPU" : "prefix sum pending",
                bucketRangeCount: this.bucketCount,
                bucketRangeReadbackBytes: WEBGPU_BUCKET_RANGE_BYTE_LENGTH,
                compactedIndexBufferBytes: WEBGPU_COMPACTED_INDEX_BYTE_LENGTH,
                compactedParticleCount,
                bucketRangeMaxCount: maximumBucketRangeCount,
                bucketRangeCoverageRatio: clamp(compactedParticleCount / normalizedParticleCount, 0, 1.25),
                bucketNeighborQueryMode: rangeCount > 0 ? "compacted Morton ranges available for dense neighbor queries" : "tile-local fallback only",
                bucketCompactionContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                bucketCompactionNote: "Worker WebGPU prefix-sum and scatter passes build compacted Morton bucket ranges without reading the compacted particle-index list back."
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
                bucketNeighborDensityNote: "A worker WGSL neighbor-density pass samples capped particles from compacted Morton bucket ranges without full particle readback."
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
                densityFieldNote: "A worker WGSL density-field pass writes GPU-resident tile density and force vectors from compacted ranges; only compact aggregate diagnostics are read back."
            };
        }
    }


    class WorkerTelemetryState {
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
                webGpuExecutionLocation: "dedicated worker",
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
                webGpuDirectRenderStatus: "worker cannot present directly",
                webGpuDirectRenderParticleCount: 0,
                webGpuDirectRenderPipelineStatus: "main thread only",
                webGpuDirectRenderFormat: "worker has no presentation context",
                webGpuDirectRenderSourceIndex: -1,
                webGpuDirectRenderVertexCount: 0,
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
                webGpuBucketCompactionNote: "Worker GPU prefix-sum bucket compaction has not run yet.",
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
                webGpuDensityFieldFeedbackNote: "Density-field feedback has not been applied to the worker WGSL particle update yet.",
                webGpuAdaptiveComputeQualityStatus: "not initialized",
                webGpuAdaptiveComputeQualityMode: "medium",
                webGpuEffectiveComputeParticleBudget: 0,
                webGpuAdaptiveComputeDownshiftLevel: 0,
                webGpuAdaptiveComputeWindowSize: 0,
                webGpuAdaptiveComputeInstabilityScore: 0,
                webGpuAdaptiveComputeClampRateAverage: 0,
                webGpuAdaptiveComputeFpsAverage: 60,
                webGpuAdaptiveComputeWorkerRoundTripAverage: 0,
                webGpuAdaptiveComputeReadbackLatencyAverage: 0,
                webGpuAdaptiveComputeSustainedInstabilityTicks: 0,
                webGpuEffectiveBucketNeighborSampleLimit: WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT,
                webGpuEffectiveDensityFieldSampleLimit: WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT,
                webGpuDispatchCadenceTicks: WEBGPU_ADAPTIVE_COMPUTE_DISPATCH_CADENCE_BY_LEVEL[0],
                webGpuDispatchCadenceStatus: "base cadence",
                webGpuDensityFieldSampleLimitStatus: "base sample limits",
                webGpuAdaptiveComputeQualityContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuAdaptiveComputeQualityNote: "Rolling compute-quality controller runs on the main thread and can downshift worker-requested particle budgets.",
                webGpuComputeBranchNote: "Worker compute branch has not run yet."
            }, values || {});
        }
    }

    class WorkerWebGpuNBodyComputePipeline {
        constructor(maximumParticles) {
            this.maximumParticles = Math.max(256, Math.min(WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES, finiteNumber(maximumParticles, WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES)));
            this.workgroupSize = WEBGPU_COMPUTE_WORKGROUP_SIZE;
            this.adapter = null;
            this.device = null;
            this.pipeline = null;
            this.prefixSumPipeline = null;
            this.scatterPipeline = null;
            this.bucketNeighborDensityPipeline = null;
            this.densityFieldPipeline = null;
            this.bindGroupLayout = null;
            this.prefixSumBindGroupLayout = null;
            this.scatterBindGroupLayout = null;
            this.bucketNeighborDensityBindGroupLayout = null;
            this.densityFieldBindGroupLayout = null;
            this.initialized = false;
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
            this.prefixSumBindGroup = null;
            this.scatterBindGroups = [];
            this.bucketNeighborDensityBindGroups = [];
            this.densityFieldBindGroups = [];
            this.spatialIndexModel = new MortonSpatialIndexModel(WEBGPU_SPATIAL_BUCKET_GRID_SIZE);
            this.haloShadingModel = new AdaptiveHaloDensityShadingModel(WEBGPU_SPATIAL_BUCKET_GRID_SIZE);
            this.tileLocalNeighborQueryModel = new TileLocalNeighborQueryModel(WEBGPU_TILE_LOCAL_NEIGHBOR_LIMIT);
            this.bucketCompactionModel = new GpuBucketCompactionModel(WEBGPU_SPATIAL_BUCKET_GRID_SIZE);
            this.bucketNeighborDensityModel = new GpuBucketNeighborDensityModel(WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT);
            this.densityFieldShadingModel = new GpuDensityFieldShadingModel(WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT);
            this.densityFieldFeedbackDownshiftFactor = 1;
            this.densityFieldFeedbackClampRate = 0;
            this.densityFieldFeedbackDownshiftStatus = "nominal";
            this.lastDensityFieldFeedbackGain = WEBGPU_DENSITY_FIELD_FEEDBACK_DEFAULT_GAIN;
            this.lastAdaptiveDensityFieldFeedbackGain = WEBGPU_DENSITY_FIELD_FEEDBACK_DEFAULT_GAIN;
            this.lastBucketNeighborSampleLimit = WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT;
            this.lastDensityFieldSampleLimit = WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT;
            this.lastWebGpuDispatchCadenceTicks = WEBGPU_ADAPTIVE_COMPUTE_DISPATCH_CADENCE_BY_LEVEL[0];
            this.bufferRebuildCount = 0;
            this.lastTelemetry = new WorkerTelemetryState();
        }
        createUnavailableTelemetry(reason) {
            this.lastTelemetry = new WorkerTelemetryState({
                webGpuComputeStatus: "unavailable",
                webGpuWorkerStatus: "unavailable",
                webGpuExecutionLocation: "fallback",
                webGpuComputeBranchNote: reason || "WebGPU worker compute is unavailable; fallback renderer remains active."
            });
            return this.lastTelemetry;
        }
        async initialize() {
            if (typeof navigator === "undefined" || !navigator.gpu) {
                return this.createUnavailableTelemetry("Worker navigator.gpu is unavailable; inline fallback remains active.");
            }
            try {
                this.adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
                if (!this.adapter) {
                    return this.createUnavailableTelemetry("Worker WebGPU adapter request returned no adapter; inline fallback remains active.");
                }
                this.device = await this.adapter.requestDevice();
                const shaderModule = this.device.createShaderModule({ label: "ArcSecs worker dark matter drive compute shader", code: WEBGPU_N_BODY_COMPUTE_SHADER });
                const prefixSumShaderModule = this.device.createShaderModule({ label: "ArcSecs worker bucket prefix-sum shader", code: WEBGPU_BUCKET_PREFIX_SUM_SHADER });
                const scatterShaderModule = this.device.createShaderModule({ label: "ArcSecs worker bucket scatter shader", code: WEBGPU_BUCKET_SCATTER_SHADER });
                const bucketNeighborDensityShaderModule = this.device.createShaderModule({ label: "ArcSecs worker compacted bucket neighbor-density shader", code: WEBGPU_BUCKET_NEIGHBOR_DENSITY_SHADER });
                const densityFieldShaderModule = this.device.createShaderModule({ label: "ArcSecs worker GPU-resident density-field shader", code: WEBGPU_DENSITY_FIELD_SHADER });
                this.bindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs worker compute bind group layout",
                    entries: [
                        { binding: 0, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 2, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 3, visibility: getGpuShaderStageCompute(), buffer: { type: "uniform" } },
                        { binding: 4, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 5, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } }
                    ]
                });
                const pipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs worker compute pipeline layout", bindGroupLayouts: [this.bindGroupLayout] });
                const pipelineDescriptor = { label: "ArcSecs worker WebGPU compute pipeline", layout: pipelineLayout, compute: { module: shaderModule, entryPoint: "main" } };
                this.pipeline = typeof this.device.createComputePipelineAsync === "function"
                    ? await this.device.createComputePipelineAsync(pipelineDescriptor)
                    : this.device.createComputePipeline(pipelineDescriptor);
                this.prefixSumBindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs worker bucket prefix-sum bind group layout",
                    entries: [
                        { binding: 0, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 2, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } }
                    ]
                });
                this.scatterBindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs worker bucket scatter bind group layout",
                    entries: [
                        { binding: 0, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 2, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 3, visibility: getGpuShaderStageCompute(), buffer: { type: "uniform" } }
                    ]
                });
                this.bucketNeighborDensityBindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs worker compacted bucket neighbor-density bind group layout",
                    entries: [
                        { binding: 0, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 2, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 3, visibility: getGpuShaderStageCompute(), buffer: { type: "uniform" } },
                        { binding: 4, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } }
                    ]
                });

                this.densityFieldBindGroupLayout = this.device.createBindGroupLayout({
                    label: "ArcSecs worker GPU-resident density-field bind group layout",
                    entries: [
                        { binding: 0, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 1, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 2, visibility: getGpuShaderStageCompute(), buffer: { type: "read-only-storage" } },
                        { binding: 3, visibility: getGpuShaderStageCompute(), buffer: { type: "uniform" } },
                        { binding: 4, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } },
                        { binding: 5, visibility: getGpuShaderStageCompute(), buffer: { type: "storage" } }
                    ]
                });
                const prefixSumPipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs worker bucket prefix-sum pipeline layout", bindGroupLayouts: [this.prefixSumBindGroupLayout] });
                const scatterPipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs worker bucket scatter pipeline layout", bindGroupLayouts: [this.scatterBindGroupLayout] });
                const bucketNeighborDensityPipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs worker compacted bucket neighbor-density pipeline layout", bindGroupLayouts: [this.bucketNeighborDensityBindGroupLayout] });
                const densityFieldPipelineLayout = this.device.createPipelineLayout({ label: "ArcSecs worker GPU-resident density-field pipeline layout", bindGroupLayouts: [this.densityFieldBindGroupLayout] });
                this.prefixSumPipeline = this.device.createComputePipeline({ label: "ArcSecs worker GPU Morton bucket prefix-sum pipeline", layout: prefixSumPipelineLayout, compute: { module: prefixSumShaderModule, entryPoint: "main" } });
                this.scatterPipeline = this.device.createComputePipeline({ label: "ArcSecs worker GPU Morton bucket scatter pipeline", layout: scatterPipelineLayout, compute: { module: scatterShaderModule, entryPoint: "main" } });
                this.bucketNeighborDensityPipeline = this.device.createComputePipeline({ label: "ArcSecs worker compacted Morton bucket neighbor-density pipeline", layout: bucketNeighborDensityPipelineLayout, compute: { module: bucketNeighborDensityShaderModule, entryPoint: "main" } });
                this.densityFieldPipeline = this.device.createComputePipeline({ label: "ArcSecs worker GPU-resident density-field pipeline", layout: densityFieldPipelineLayout, compute: { module: densityFieldShaderModule, entryPoint: "main" } });
                this.initialized = true;
                this.lastTelemetry = new WorkerTelemetryState({
                    webGpuComputeStatus: "initialized",
                    webGpuWorkerStatus: "initialized",
                    webGpuExecutionLocation: "dedicated worker",
                    webGpuComputeBranchNote: "Dedicated worker initialized the actual WGSL compute branch; main thread remains focused on the cockpit UI."
                });
                return this.lastTelemetry;
            } catch (error) {
                this.initialized = false;
                return this.createUnavailableTelemetry("Worker WebGPU initialization failed safely; inline fallback remains active.");
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
            const windVector = directionFromDegrees(finiteNumber(config.windDirectionDegrees, 35));
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
        destroyPersistentBuffers() {
            this.particleBuffers.forEach((buffer) => {
                if (buffer && typeof buffer.destroy === "function") { buffer.destroy(); }
            });
            [this.diagnosticBuffer, this.uniformBuffer, this.readBuffer, this.renderSampleReadBuffer, this.spatialBucketBuffer, this.spatialBucketReadBuffer, this.spatialBucketRangeBuffer, this.spatialBucketRangeReadBuffer, this.spatialBucketCursorBuffer, this.compactedParticleIndexBuffer, this.bucketNeighborDensityBuffer, this.bucketNeighborDensityReadBuffer, this.densityFieldTileBuffer, this.densityFieldDiagnosticBuffer, this.densityFieldDiagnosticReadBuffer].forEach((buffer) => {
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
            this.prefixSumBindGroup = null;
            this.scatterBindGroups = [];
            this.bucketNeighborDensityBindGroups = [];
            this.densityFieldBindGroups = [];
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
            this.device.queue.writeBuffer(this.densityFieldTileBuffer, 0, new Float32Array(WEBGPU_SPATIAL_BUCKET_COUNT * WEBGPU_DENSITY_FIELD_TILE_WORDS));
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
                label: "ArcSecs worker compacted bucket prefix-sum bind group",
                layout: this.prefixSumBindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: this.spatialBucketBuffer } },
                    { binding: 1, resource: { buffer: this.spatialBucketRangeBuffer } },
                    { binding: 2, resource: { buffer: this.spatialBucketCursorBuffer } }
                ]
            });
            this.scatterBindGroups = [0, 1].map((particleBufferIndex) => this.device.createBindGroup({
                label: "ArcSecs worker compacted bucket scatter bind group from particle buffer " + particleBufferIndex,
                layout: this.scatterBindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: this.particleBuffers[particleBufferIndex] } },
                    { binding: 1, resource: { buffer: this.spatialBucketCursorBuffer } },
                    { binding: 2, resource: { buffer: this.compactedParticleIndexBuffer } },
                    { binding: 3, resource: { buffer: this.uniformBuffer } }
                ]
            }));
            this.bucketNeighborDensityBindGroups = [0, 1].map((particleBufferIndex) => this.device.createBindGroup({
                label: "ArcSecs worker compacted bucket neighbor-density bind group from particle buffer " + particleBufferIndex,
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
        aggregateReducedDiagnostics(reducedDiagnosticData, particleCount, dispatchCount, tick, roundTripMilliseconds, persistentInfo, renderSampleInfo, spatialBucketInfo, bucketCompactionInfo, bucketNeighborDensityInfo, densityFieldInfo, readbackLatencyMilliseconds) {
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
            this.lastTelemetry = new WorkerTelemetryState({
                webGpuComputeStatus: finiteParticleCount === particleCount ? "executed" : "executed with finite guard warnings",
                webGpuActualParticleCount: particleCount,
                webGpuActualDispatches: dispatchCount,
                webGpuMeanParticleSpeed: Number(reducedDiagnosticData[1] || 0) / scale / divisor,
                webGpuMaxParticleRadius: Number(reducedDiagnosticData[2] || 0) / scale,
                webGpuMeanAccelerationProxy: Number(reducedDiagnosticData[3] || 0) / scale / divisor,
                webGpuHaloPressureProxy: Number(reducedDiagnosticData[4] || 0) / scale / divisor,
                webGpuLastCompletedTick: Math.max(0, Math.round(finiteNumber(tick, 0))),
                webGpuExecutionLocation: "dedicated worker",
                webGpuReadbackMode: "reduced aggregate atomic buffer",
                webGpuReadbackBytes: WEBGPU_REDUCED_DIAGNOSTIC_WORDS * 4,
                webGpuWorkerStatus: "executed",
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
                webGpuBucketCompactionNote: bucketCompactionInfo ? bucketCompactionInfo.bucketCompactionNote : "Worker GPU prefix-sum bucket compaction has not run yet.",
                webGpuBucketNeighborDensityStatus: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityStatus : "neighbor-density pass pending",
                webGpuBucketNeighborDensityReadbackBytes: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityReadbackBytes : 0,
                webGpuBucketNeighborDensitySampleCount: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensitySampleCount : 0,
                webGpuBucketNeighborDensityAverage: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityAverage : 0,
                webGpuBucketNeighborDensityMaximum: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityMaximum : 0,
                webGpuBucketNeighborDensityNearbyBuckets: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityNearbyBuckets : 0,
                webGpuBucketNeighborDensityCoverageRatio: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityCoverageRatio : 0,
                webGpuBucketNeighborDensityContractVersion: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityContractVersion : WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuBucketNeighborDensityNote: bucketNeighborDensityInfo ? bucketNeighborDensityInfo.bucketNeighborDensityNote : "Worker compacted bucket neighbor-density pass has not run yet.",
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
                webGpuDensityFieldNote: densityFieldInfo ? densityFieldInfo.densityFieldNote : "Worker GPU-resident density-field shading pass has not run yet.",
                webGpuDensityFieldFeedbackStatus: densityFieldAccelerationProxy > 0 ? "worker density field fed back into particle acceleration" : "worker density-field feedback armed with zero/settling force",
                webGpuDensityFieldFeedbackGain: this.lastDensityFieldFeedbackGain,
                webGpuAdaptiveDensityFieldFeedbackGain: this.lastAdaptiveDensityFieldFeedbackGain,
                webGpuDensityFieldFeedbackDownshiftFactor: feedbackDownshiftInfo.downshiftFactor,
                webGpuDensityFieldFeedbackDownshiftStatus: feedbackDownshiftInfo.status,
                webGpuDensityFieldAccelerationProxy: densityFieldAccelerationProxy,
                webGpuFiniteOutputGuardClampCount: finiteOutputGuardClampCount,
                webGpuFiniteOutputGuardClampRate: feedbackDownshiftInfo.clampRate,
                webGpuDensityFieldFeedbackContractVersion: WEBGPU_SHARED_BUFFER_CONTRACT_VERSION,
                webGpuDensityFieldFeedbackNote: "The worker N-body WGSL update reads the previous GPU-resident densityFieldTiles buffer, applies a bounded tile-level acceleration term, and clamps non-finite or runaway outputs before writing the next particle buffer.",
                webGpuEffectiveBucketNeighborSampleLimit: this.lastBucketNeighborSampleLimit,
                webGpuEffectiveDensityFieldSampleLimit: this.lastDensityFieldSampleLimit,
                webGpuDispatchCadenceTicks: this.lastWebGpuDispatchCadenceTicks,
                webGpuDispatchCadenceStatus: this.lastWebGpuDispatchCadenceTicks > WEBGPU_ADAPTIVE_COMPUTE_DISPATCH_CADENCE_BY_LEVEL[0] ? "adaptive cadence downshift applied" : "base cadence",
                webGpuDensityFieldSampleLimitStatus: this.lastDensityFieldSampleLimit < WEBGPU_DENSITY_FIELD_SAMPLE_LIMIT || this.lastBucketNeighborSampleLimit < WEBGPU_BUCKET_NEIGHBOR_SAMPLE_LIMIT ? "adaptive sample-limit downshift applied" : "base sample limits",
                webGpuComputeBranchNote: "Actual WGSL worker branch used persistent ping-pong GPU particle buffers, density-field feedback acceleration, finite-output stability guards, Morton-order buckets, tile-local neighbor queries, adaptive halo-density shading, compacted bucket ranges, and compacted-range neighbor-density sampling."
            });
            return this.lastTelemetry;
        }
        async run(config, tick) {
            if (!this.initialized) {
                const telemetry = await this.initialize();
                if (!this.initialized) { return telemetry; }
            }
            const startedMilliseconds = nowMilliseconds();
            const requestedParticleCount = Math.round(clamp(finiteNumber(config.computeParticleBudget, 4096), 256, this.maximumParticles));
            const particleCount = Math.max(1, requestedParticleCount);
            const dispatchCount = Math.ceil(particleCount / this.workgroupSize);
            const uniformData = this.createUniformBufferData(config, particleCount, tick);
            const diagnosticByteLength = WEBGPU_REDUCED_DIAGNOSTIC_WORDS * 4;
            const renderSampleCount = Math.min(WEBGPU_RENDER_SAMPLE_PARTICLE_COUNT, particleCount);
            const renderSampleByteLength = renderSampleCount * WEBGPU_PARTICLE_BYTES_PER_PARTICLE;
            const spatialBucketZeroData = new Uint32Array(WEBGPU_SPATIAL_BUCKET_COUNT);
            try {
                this.ensurePersistentBuffers(config, particleCount);
                this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);
                this.device.queue.writeBuffer(this.diagnosticBuffer, 0, new Uint32Array(WEBGPU_REDUCED_DIAGNOSTIC_WORDS));
                this.device.queue.writeBuffer(this.spatialBucketBuffer, 0, spatialBucketZeroData);
                this.device.queue.writeBuffer(this.bucketNeighborDensityBuffer, 0, new Uint32Array(WEBGPU_BUCKET_NEIGHBOR_DENSITY_WORDS));
                this.device.queue.writeBuffer(this.densityFieldDiagnosticBuffer, 0, new Uint32Array(WEBGPU_DENSITY_FIELD_DIAGNOSTIC_WORDS));
                const sourceIndex = this.activeParticleBufferIndex;
                const destinationIndex = sourceIndex === 0 ? 1 : 0;
                const bindGroup = this.bindGroups[sourceIndex];
                const commandEncoder = this.device.createCommandEncoder({ label: "ArcSecs worker persistent compute commands" });
                const computePass = commandEncoder.beginComputePass({ label: "ArcSecs worker persistent compute pass" });
                computePass.setPipeline(this.pipeline);
                computePass.setBindGroup(0, bindGroup);
                computePass.dispatchWorkgroups(dispatchCount);
                computePass.end();
                const prefixPass = commandEncoder.beginComputePass({ label: "ArcSecs worker compacted Morton bucket prefix-sum pass" });
                prefixPass.setPipeline(this.prefixSumPipeline);
                prefixPass.setBindGroup(0, this.prefixSumBindGroup);
                prefixPass.dispatchWorkgroups(1);
                prefixPass.end();
                const scatterPass = commandEncoder.beginComputePass({ label: "ArcSecs worker compacted Morton bucket scatter pass" });
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
                commandEncoder.copyBufferToBuffer(this.diagnosticBuffer, 0, this.readBuffer, 0, diagnosticByteLength);
                commandEncoder.copyBufferToBuffer(this.spatialBucketBuffer, 0, this.spatialBucketReadBuffer, 0, WEBGPU_SPATIAL_BUCKET_BYTE_LENGTH);
                commandEncoder.copyBufferToBuffer(this.spatialBucketRangeBuffer, 0, this.spatialBucketRangeReadBuffer, 0, WEBGPU_BUCKET_RANGE_BYTE_LENGTH);
                commandEncoder.copyBufferToBuffer(this.bucketNeighborDensityBuffer, 0, this.bucketNeighborDensityReadBuffer, 0, WEBGPU_BUCKET_NEIGHBOR_DENSITY_BYTE_LENGTH);
                commandEncoder.copyBufferToBuffer(this.densityFieldDiagnosticBuffer, 0, this.densityFieldDiagnosticReadBuffer, 0, WEBGPU_DENSITY_FIELD_DIAGNOSTIC_BYTE_LENGTH);
                commandEncoder.copyBufferToBuffer(this.particleBuffers[destinationIndex], 0, this.renderSampleReadBuffer, 0, renderSampleByteLength);
                this.device.queue.submit([commandEncoder.finish()]);
                const readbackStartedMilliseconds = nowMilliseconds();
                await this.readBuffer.mapAsync(getGpuMapModeRead());
                const mappedRange = this.readBuffer.getMappedRange();
                const diagnosticCopy = new Uint32Array(mappedRange.slice(0));
                this.readBuffer.unmap();
                await this.renderSampleReadBuffer.mapAsync(getGpuMapModeRead());
                const renderSampleMappedRange = this.renderSampleReadBuffer.getMappedRange();
                const renderSampleCopy = new Float32Array(renderSampleMappedRange.slice(0, renderSampleByteLength));
                this.renderSampleReadBuffer.unmap();
                const renderSampleInfo = this.createRenderSampleInfo(renderSampleCopy, renderSampleCount, destinationIndex);
                await this.spatialBucketReadBuffer.mapAsync(getGpuMapModeRead());
                const spatialBucketMappedRange = this.spatialBucketReadBuffer.getMappedRange();
                const spatialBucketCopy = new Uint32Array(spatialBucketMappedRange.slice(0, WEBGPU_SPATIAL_BUCKET_BYTE_LENGTH));
                this.spatialBucketReadBuffer.unmap();
                const spatialBucketInfo = this.createSpatialBucketInfo(spatialBucketCopy, particleCount);
                await this.spatialBucketRangeReadBuffer.mapAsync(getGpuMapModeRead());
                const bucketRangeMappedRange = this.spatialBucketRangeReadBuffer.getMappedRange();
                const bucketRangeCopy = new Uint32Array(bucketRangeMappedRange.slice(0, WEBGPU_BUCKET_RANGE_BYTE_LENGTH));
                this.spatialBucketRangeReadBuffer.unmap();
                const bucketCompactionInfo = this.createBucketCompactionInfo(bucketRangeCopy, particleCount);
                await this.bucketNeighborDensityReadBuffer.mapAsync(getGpuMapModeRead());
                const bucketNeighborDensityMappedRange = this.bucketNeighborDensityReadBuffer.getMappedRange();
                const bucketNeighborDensityCopy = new Uint32Array(bucketNeighborDensityMappedRange.slice(0, WEBGPU_BUCKET_NEIGHBOR_DENSITY_BYTE_LENGTH));
                this.bucketNeighborDensityReadBuffer.unmap();
                const bucketNeighborDensityInfo = this.createBucketNeighborDensityInfo(bucketNeighborDensityCopy, particleCount);
                await this.densityFieldDiagnosticReadBuffer.mapAsync(getGpuMapModeRead());
                const densityFieldMappedRange = this.densityFieldDiagnosticReadBuffer.getMappedRange();
                const densityFieldCopy = new Uint32Array(densityFieldMappedRange.slice(0, WEBGPU_DENSITY_FIELD_DIAGNOSTIC_BYTE_LENGTH));
                this.densityFieldDiagnosticReadBuffer.unmap();
                const densityFieldInfo = this.createDensityFieldInfo(densityFieldCopy, particleCount);
                const readbackLatencyMilliseconds = nowMilliseconds() - readbackStartedMilliseconds;
                this.activeParticleBufferIndex = destinationIndex;
                return this.aggregateReducedDiagnostics(diagnosticCopy, particleCount, dispatchCount, tick, nowMilliseconds() - startedMilliseconds, { sourceIndex, destinationIndex }, renderSampleInfo, spatialBucketInfo, bucketCompactionInfo, bucketNeighborDensityInfo, densityFieldInfo, readbackLatencyMilliseconds);
            } catch (error) {
                this.lastTelemetry = new WorkerTelemetryState({
                    webGpuComputeStatus: "failed safe",
                    webGpuWorkerStatus: "failed safe",
                    webGpuExecutionLocation: "dedicated worker",
                    webGpuPersistentBuffersStatus: this.particleBuffers.length === 2 ? "persistent buffers retained after safe failure" : "persistent buffers unavailable after safe failure",
                    webGpuRenderSampleStatus: "safe failure before render sample",
                    webGpuSharedRenderBufferStatus: "fallback renderer retained; bounded render sample unavailable",
                    webGpuComputeBranchNote: "Dedicated worker persistent ping-pong WebGPU dispatch failed safely; inline fallback and deterministic telemetry remain active."
                });
                return this.lastTelemetry;
            }
        }
        shutdown() {
            this.destroyPersistentBuffers();
            this.initialized = false;
        }
    }

    const pipeline = new WorkerWebGpuNBodyComputePipeline(WEBGPU_MAXIMUM_INTERACTIVE_PARTICLES);
    const workerScope = typeof self !== "undefined" ? self : null;

    function postResponse(requestId, type, telemetry) {
        if (!workerScope || typeof workerScope.postMessage !== "function") { return; }
        workerScope.postMessage({ requestId, type, telemetry });
    }

    async function handleWorkerMessage(message) {
        const requestId = message.requestId || 0;
        if (message.contractVersion !== WEBGPU_COMPUTE_MESSAGE_CONTRACT_VERSION) {
            postResponse(requestId, "compute-error", new WorkerTelemetryState({
                webGpuComputeStatus: "failed safe",
                webGpuWorkerStatus: "contract mismatch",
                webGpuComputeBranchNote: "Compute worker rejected an unknown message contract version."
            }));
            return;
        }
        if (message.type === "initialize") {
            const telemetry = await pipeline.initialize();
            postResponse(requestId, "initialized", telemetry);
            return;
        }
        if (message.type === "run") {
            const telemetry = await pipeline.run(message.config || {}, message.tick || 0);
            postResponse(requestId, "compute-complete", telemetry);
            return;
        }
        if (message.type === "shutdown") {
            pipeline.shutdown();
            postResponse(requestId, "shutdown-complete", new WorkerTelemetryState({
                webGpuWorkerStatus: "shutdown",
                webGpuPersistentBuffersStatus: "destroyed on worker shutdown",
                webGpuComputeBranchNote: "Compute worker released persistent ping-pong GPU buffers before shutdown."
            }));
            return;
        }
        postResponse(requestId, "compute-error", new WorkerTelemetryState({
            webGpuComputeStatus: "failed safe",
            webGpuWorkerStatus: "unknown message",
            webGpuComputeBranchNote: "Compute worker received an unknown message type."
        }));
    }

    if (workerScope) {
        workerScope.onmessage = (event) => {
            handleWorkerMessage(event.data || {}).catch(() => {
                postResponse(event && event.data ? event.data.requestId : 0, "compute-error", new WorkerTelemetryState({
                    webGpuComputeStatus: "failed safe",
                    webGpuWorkerStatus: "exception",
                    webGpuComputeBranchNote: "Compute worker caught an unexpected exception safely."
                }));
            });
        };
    }
}());
