/** Deterministic linear-congruential random generator for reproducible scenario fixtures. */
export class SeededRandom {
    private state: number;

    /**
     * Creates the deterministic generator.
     * @param seed Unsigned 32-bit seed used by scenario setup and tests.
     */
    public constructor(seed: number) {
        this.state = seed >>> 0;
    }

    /**
     * Returns the next reproducible value in the range [0, 1).
     */
    public nextUnit(): number {
        this.state = (1664525 * this.state + 1013904223) >>> 0;
        return this.state / 4294967296;
    }

    /**
     * Returns a reproducible value in the requested range.
     * @param minimum Inclusive lower bound.
     * @param maximum Exclusive upper bound.
     */
    public nextRange(minimum: number, maximum: number): number {
        return minimum + (maximum - minimum) * this.nextUnit();
    }
}
