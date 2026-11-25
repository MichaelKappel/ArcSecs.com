import { FixedStepClock } from "../core/FixedStepClock";
import { EntityMemory } from "../ecs/EntityMemory";
import { SeededRandom } from "../core/SeededRandom";

export interface ReplaySummary {
    readonly tickCount: number;
    readonly activeEntityCount: number;
    readonly checksum: number;
}

/** Deterministic replay fixture used by test helpers and manual benchmark panels. */
export class DeterministicReplay {
    /**
     * Runs a small seeded entity simulation and returns a checksum.
     * @param seed Reproducibility seed.
     * @param tickCount Number of fixed ticks to execute.
     */
    public run(seed: number, tickCount: number): ReplaySummary {
        const random: SeededRandom = new SeededRandom(seed);
        const clock: FixedStepClock = new FixedStepClock(1 / 60);
        const memory: EntityMemory = new EntityMemory(16);
        for (let index: number = 0; index < 8; index += 1) {
            const entityId: number = memory.allocate();
            memory.positionX[entityId] = random.nextRange(-1, 1);
            memory.positionY[entityId] = random.nextRange(-1, 1);
            memory.velocityX[entityId] = random.nextRange(-0.02, 0.02);
            memory.velocityY[entityId] = random.nextRange(-0.02, 0.02);
            memory.mass[entityId] = random.nextRange(0.5, 2);
        }
        for (let tickIndex: number = 0; tickIndex < tickCount; tickIndex += 1) {
            clock.step();
            for (let entityId: number = 0; entityId < memory.capacity; entityId += 1) {
                if (memory.activeFlags[entityId] === 1) {
                    memory.positionX[entityId] += memory.velocityX[entityId];
                    memory.positionY[entityId] += memory.velocityY[entityId];
                }
            }
        }
        let checksum: number = 0;
        for (let entityId: number = 0; entityId < memory.capacity; entityId += 1) {
            checksum += memory.positionX[entityId] * 31 + memory.positionY[entityId] * 17 + memory.mass[entityId] * 7;
        }
        return { tickCount: clock.tickCount, activeEntityCount: memory.activeCount(), checksum: Number(checksum.toFixed(12)) };
    }
}
