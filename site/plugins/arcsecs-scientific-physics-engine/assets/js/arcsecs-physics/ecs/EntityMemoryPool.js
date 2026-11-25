'use strict';

const EntityTypeFlag = Object.freeze({ None: 0, MaterialNode: 1, Photon: 2, OscillatorProbe: 4, MassiveBody: 8, Spacecraft: 16, Condensate: 32, SolverLink: 64 });

class EntityMemoryPool {
  constructor(capacity) {
    this.capacity = Math.max(1, Math.trunc(Number(capacity || 1)));
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
    for (let index = 0; index < this.capacity; index += 1) { this.freeList[index] = this.capacity - index - 1; }
  }
  allocate() {
    if (this.freeCount === 0) { throw new Error('Entity pool exhausted.'); }
    this.freeCount -= 1;
    const entityId = this.freeList[this.freeCount];
    this.activeFlags[entityId] = 1;
    return entityId;
  }
  release(entityId) {
    const id = Math.trunc(Number(entityId));
    if (id < 0 || id >= this.capacity || this.activeFlags[id] === 0) { return; }
    this.positionX[id] = 0; this.positionY[id] = 0; this.positionZ[id] = 0;
    this.velocityX[id] = 0; this.velocityY[id] = 0; this.velocityZ[id] = 0;
    this.accelerationX[id] = 0; this.accelerationY[id] = 0; this.accelerationZ[id] = 0;
    this.mass[id] = 0; this.radius[id] = 0; this.internalEnergy[id] = 0;
    this.oscillatorPhase[id] = 0; this.oscillatorTransitionCount[id] = 0;
    this.photonWavelength[id] = 0; this.photonFrequency[id] = 0; this.photonEnergy[id] = 0;
    this.entityTypeFlags[id] = 0; this.activeFlags[id] = 0;
    this.freeList[this.freeCount] = id;
    this.freeCount += 1;
  }
  spawnPhoton(photonMass, wavelength, frequency, energy) {
    const entityId = this.allocate();
    this.entityTypeFlags[entityId] = EntityTypeFlag.Photon;
    this.mass[entityId] = Number(photonMass || 0);
    this.photonWavelength[entityId] = Number(wavelength || 0);
    this.photonFrequency[entityId] = Number(frequency || 0);
    this.photonEnergy[entityId] = Number(energy || 0);
    return entityId;
  }
  activeCount() {
    let count = 0;
    for (let index = 0; index < this.capacity; index += 1) { count += this.activeFlags[index]; }
    return count;
  }
}

module.exports = { EntityMemoryPool, EntityTypeFlag };
