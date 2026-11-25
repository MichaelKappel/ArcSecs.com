import { EntityMemory } from "./EntityMemory";
import { EntityTypeFlag, PhotonComponent } from "./ComponentTypes";

/** Object-pool facade for photons and transient particles so dense scenes do not allocate every frame. */
export class PhotonPool {
    private readonly memory: EntityMemory;

    /**
     * Creates a photon pool on top of the shared entity memory.
     * @param memory Structure-of-arrays memory backing active entities.
     */
    public constructor(memory: EntityMemory) {
        this.memory = memory;
    }

    /**
     * Spawns one photon packet into the existing typed arrays.
     * @param photonMass Effective photon mass proxy.
     * @param wavelength Photon wavelength proxy.
     * @param frequency Photon frequency proxy.
     * @param energy Photon energy proxy.
     */
    public spawn(photonMass: number, wavelength: number, frequency: number, energy: number): PhotonComponent {
        const entityId: number = this.memory.allocate();
        this.memory.entityTypeFlags[entityId] = EntityTypeFlag.Photon;
        this.memory.mass[entityId] = photonMass;
        this.memory.photonWavelength[entityId] = wavelength;
        this.memory.photonFrequency[entityId] = frequency;
        this.memory.photonEnergy[entityId] = energy;
        this.memory.internalEnergy[entityId] = 0;
        return { entityId, photonMass, wavelength, frequency, energy, ledgerEnergy: 0 };
    }

    /**
     * Retires a photon packet back into the shared free list.
     * @param entityId Photon entity identifier.
     */
    public retire(entityId: number): void {
        this.memory.release(entityId);
    }

    /** Returns the number of active photon entities currently in the pool. */
    public activePhotonCount(): number {
        let photonCount: number = 0;
        for (let entityId: number = 0; entityId < this.memory.capacity; entityId += 1) {
            if (this.memory.activeFlags[entityId] === 1 && (this.memory.entityTypeFlags[entityId] & EntityTypeFlag.Photon) === EntityTypeFlag.Photon) {
                photonCount += 1;
            }
        }
        return photonCount;
    }
}
