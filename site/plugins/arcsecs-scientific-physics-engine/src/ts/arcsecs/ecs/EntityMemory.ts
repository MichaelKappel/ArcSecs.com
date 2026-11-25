/** Structure-of-arrays storage for hot ArcSecs simulation state. */
export class EntityMemory {
    public readonly capacity: number;
    public readonly positionX: Float64Array;
    public readonly positionY: Float64Array;
    public readonly positionZ: Float64Array;
    public readonly velocityX: Float64Array;
    public readonly velocityY: Float64Array;
    public readonly velocityZ: Float64Array;
    public readonly accelerationX: Float64Array;
    public readonly accelerationY: Float64Array;
    public readonly accelerationZ: Float64Array;
    public readonly mass: Float64Array;
    public readonly radius: Float64Array;
    public readonly internalEnergy: Float64Array;
    public readonly oscillatorPhase: Float64Array;
    public readonly oscillatorTransitionCount: Uint32Array;
    public readonly photonWavelength: Float64Array;
    public readonly photonFrequency: Float64Array;
    public readonly photonEnergy: Float64Array;
    public readonly entityTypeFlags: Uint16Array;
    public readonly activeFlags: Uint8Array;
    private readonly freeList: Uint32Array;
    private freeCount: number;

    /**
     * Creates typed-array entity memory.
     * @param capacity Maximum number of entities retained by the pool.
     */
    public constructor(capacity: number) {
        this.capacity = Math.max(1, Math.trunc(capacity));
        this.positionX = new Float64Array(this.capacity);
        this.positionY = new Float64Array(this.capacity);
        this.positionZ = new Float64Array(this.capacity);
        this.velocityX = new Float64Array(this.capacity);
        this.velocityY = new Float64Array(this.capacity);
        this.velocityZ = new Float64Array(this.capacity);
        this.accelerationX = new Float64Array(this.capacity);
        this.accelerationY = new Float64Array(this.capacity);
        this.accelerationZ = new Float64Array(this.capacity);
        this.mass = new Float64Array(this.capacity);
        this.radius = new Float64Array(this.capacity);
        this.internalEnergy = new Float64Array(this.capacity);
        this.oscillatorPhase = new Float64Array(this.capacity);
        this.oscillatorTransitionCount = new Uint32Array(this.capacity);
        this.photonWavelength = new Float64Array(this.capacity);
        this.photonFrequency = new Float64Array(this.capacity);
        this.photonEnergy = new Float64Array(this.capacity);
        this.entityTypeFlags = new Uint16Array(this.capacity);
        this.activeFlags = new Uint8Array(this.capacity);
        this.freeList = new Uint32Array(this.capacity);
        this.freeCount = this.capacity;
        for (let index: number = 0; index < this.capacity; index += 1) {
            this.freeList[index] = this.capacity - index - 1;
        }
    }

    /** Allocates an entity slot from the free list. */
    public allocate(): number {
        if (this.freeCount === 0) {
            throw new Error("Entity pool exhausted.");
        }
        this.freeCount -= 1;
        const entityId: number = this.freeList[this.freeCount];
        this.activeFlags[entityId] = 1;
        return entityId;
    }

    /**
     * Releases an entity slot and clears hot numeric state.
     * @param entityId Entity identifier returned from allocate.
     */
    public release(entityId: number): void {
        this.validateId(entityId);
        if (this.activeFlags[entityId] === 0) {
            return;
        }
        this.positionX[entityId] = 0;
        this.positionY[entityId] = 0;
        this.positionZ[entityId] = 0;
        this.velocityX[entityId] = 0;
        this.velocityY[entityId] = 0;
        this.velocityZ[entityId] = 0;
        this.accelerationX[entityId] = 0;
        this.accelerationY[entityId] = 0;
        this.accelerationZ[entityId] = 0;
        this.mass[entityId] = 0;
        this.radius[entityId] = 0;
        this.internalEnergy[entityId] = 0;
        this.oscillatorPhase[entityId] = 0;
        this.oscillatorTransitionCount[entityId] = 0;
        this.photonWavelength[entityId] = 0;
        this.photonFrequency[entityId] = 0;
        this.photonEnergy[entityId] = 0;
        this.entityTypeFlags[entityId] = 0;
        this.activeFlags[entityId] = 0;
        this.freeList[this.freeCount] = entityId;
        this.freeCount += 1;
    }

    /** Counts active entity slots without allocating. */
    public activeCount(): number {
        let count: number = 0;
        for (let index: number = 0; index < this.capacity; index += 1) {
            count += this.activeFlags[index];
        }
        return count;
    }

    private validateId(entityId: number): void {
        if (!Number.isInteger(entityId) || entityId < 0 || entityId >= this.capacity) {
            throw new Error("Invalid entity identifier.");
        }
    }
}
