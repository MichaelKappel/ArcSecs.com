export interface RelationalEdgeState {
    readonly fromEntityId: number;
    readonly toEntityId: number;
    readonly restLength: number;
    readonly currentLength: number;
    readonly tension: number;
    readonly torsionProxy: number;
    readonly stability: number;
}

/** Computes relationship-edge diagnostics without treating coordinates as a physical fabric. */
export class RelationalSolver {
    /**
     * Evaluates a single solver link.
     * @param fromEntityId Source entity identifier.
     * @param toEntityId Target entity identifier.
     * @param restLength Desired relationship length.
     * @param currentLength Current rendered/proxy length.
     * @param relativeAngleRadians Relative angular displacement used as a torsion proxy.
     */
    public evaluateEdge(fromEntityId: number, toEntityId: number, restLength: number, currentLength: number, relativeAngleRadians: number): RelationalEdgeState {
        const safeRestLength: number = Math.max(0.000001, restLength);
        const lengthError: number = currentLength - safeRestLength;
        const tension: number = lengthError / safeRestLength;
        const torsionProxy: number = Math.sin(relativeAngleRadians) * Math.min(1, Math.abs(tension) + 0.05);
        const stability: number = this.clamp(1 - Math.abs(tension) - Math.abs(torsionProxy) * 0.5, 0, 1);
        return { fromEntityId, toEntityId, restLength: safeRestLength, currentLength, tension, torsionProxy, stability };
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
