import { SimulationEntity, Vector3D } from "./PhysicsTypes";

/**
 * Estimates relational inertia links between entities without hiding the approximation.
 */
export class RelationalInertiaModel {
    /**
     * Calculates a simple distance-weighted relational influence score.
     *
     * @param entity The local body being evaluated.
     * @param universeEntities Other bodies contributing relational context.
     * @returns A dimensionless influence score for telemetry comparisons.
     */
    public calculateInfluenceScore(entity: SimulationEntity, universeEntities: readonly SimulationEntity[]): number {
        return universeEntities
            .filter((otherEntity: SimulationEntity) => otherEntity.entityId !== entity.entityId)
            .reduce((runningScore: number, otherEntity: SimulationEntity) => {
                const separationMeters: number = this.calculateDistance(entity.positionMeters, otherEntity.positionMeters);
                if (separationMeters <= 0) {
                    return runningScore;
                }

                return runningScore + (otherEntity.restMassKilograms / Math.pow(separationMeters, 2));
            }, 0);
    }

    /**
     * Calculates Euclidean distance between two vectors.
     *
     * @param first First point.
     * @param second Second point.
     * @returns Distance in meters.
     */
    private calculateDistance(first: Vector3D, second: Vector3D): number {
        const xDifference: number = first.x - second.x;
        const yDifference: number = first.y - second.y;
        const zDifference: number = first.z - second.z;
        return Math.sqrt((xDifference * xDifference) + (yDifference * yDifference) + (zDifference * zDifference));
    }
}
