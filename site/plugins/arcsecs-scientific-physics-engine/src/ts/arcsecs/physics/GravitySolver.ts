export interface GravityAccelerationResult {
    readonly radius: number;
    readonly acceleration: number;
    readonly softenedRadius: number;
}

/** Newtonian-style softened gravity solver used by the conceptual sandbox. */
export class GravitySolver {
    private readonly gravitationalConstantProxy: number;

    /**
     * Creates a gravity solver.
     * @param gravitationalConstantProxy Dimensionless gravitational constant proxy for the sandbox.
     */
    public constructor(gravitationalConstantProxy: number = 1) {
        this.gravitationalConstantProxy = Math.max(0, gravitationalConstantProxy);
    }

    /**
     * Calculates softened acceleration toward a central source.
     * @param centralMass Central source mass proxy.
     * @param radius Distance from the source.
     * @param softeningRadius Minimum radius used to prevent singular force spikes.
     */
    public acceleration(centralMass: number, radius: number, softeningRadius: number = 0.001): GravityAccelerationResult {
        const softenedRadius: number = Math.sqrt(radius * radius + softeningRadius * softeningRadius);
        const acceleration: number = this.gravitationalConstantProxy * Math.max(0, centralMass) / Math.max(0.000001, softenedRadius * softenedRadius);
        return { radius, acceleration, softenedRadius };
    }

    /**
     * Calculates escape velocity for a Newtonian dark-star style visualization.
     * @param centralMass Central source mass proxy.
     * @param radius Launch radius.
     */
    public escapeVelocity(centralMass: number, radius: number): number {
        return Math.sqrt((2 * this.gravitationalConstantProxy * Math.max(0, centralMass)) / Math.max(0.000001, radius));
    }
}
