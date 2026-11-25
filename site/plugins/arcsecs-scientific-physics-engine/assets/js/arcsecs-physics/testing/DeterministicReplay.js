'use strict';

class SeededRandom {
  constructor(seed) { this.state = seed >>> 0; }
  nextUnit() { this.state = (1664525 * this.state + 1013904223) >>> 0; return this.state / 4294967296; }
  nextRange(minimum, maximum) { return minimum + (maximum - minimum) * this.nextUnit(); }
}

class DeterministicReplay {
  run(seed, tickCount) {
    const random = new SeededRandom(seed);
    const positionX = new Float64Array(16);
    const positionY = new Float64Array(16);
    const velocityX = new Float64Array(16);
    const velocityY = new Float64Array(16);
    const mass = new Float64Array(16);
    const active = new Uint8Array(16);
    for (let index = 0; index < 8; index += 1) {
      active[index] = 1;
      positionX[index] = random.nextRange(-1, 1);
      positionY[index] = random.nextRange(-1, 1);
      velocityX[index] = random.nextRange(-0.02, 0.02);
      velocityY[index] = random.nextRange(-0.02, 0.02);
      mass[index] = random.nextRange(0.5, 2);
    }
    for (let tickIndex = 0; tickIndex < tickCount; tickIndex += 1) {
      for (let entityId = 0; entityId < active.length; entityId += 1) {
        if (active[entityId] === 1) {
          positionX[entityId] += velocityX[entityId];
          positionY[entityId] += velocityY[entityId];
        }
      }
    }
    let checksum = 0;
    let activeEntityCount = 0;
    for (let entityId = 0; entityId < active.length; entityId += 1) {
      activeEntityCount += active[entityId];
      checksum += positionX[entityId] * 31 + positionY[entityId] * 17 + mass[entityId] * 7;
    }
    return { tickCount, activeEntityCount, checksum: Number(checksum.toFixed(12)) };
  }
}

module.exports = { DeterministicReplay };
