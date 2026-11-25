'use strict';

class CanvasRenderer2D {
  constructor(canvas) {
    const context = canvas && canvas.getContext ? canvas.getContext('2d') : null;
    if (!context) { throw new Error('Canvas 2D context is unavailable.'); }
    this.context = context;
    this.camera = { centerX: 0, centerY: 0, scale: 1 };
  }
  setCamera(camera) { this.camera = { centerX: Number(camera.centerX || 0), centerY: Number(camera.centerY || 0), scale: Math.max(0.001, Number(camera.scale || 1)) }; }
  render(memory) {
    const width = this.context.canvas.width;
    const height = this.context.canvas.height;
    this.context.clearRect(0, 0, width, height);
    let materialNodesRendered = 0;
    let photonsRendered = 0;
    let spacecraftRendered = 0;
    for (let entityId = 0; entityId < memory.capacity; entityId += 1) {
      if (memory.activeFlags[entityId] !== 1) { continue; }
      const x = width / 2 + (memory.positionX[entityId] - this.camera.centerX) * this.camera.scale;
      const y = height / 2 + (memory.positionY[entityId] - this.camera.centerY) * this.camera.scale;
      const radius = Math.max(2, memory.radius[entityId] * this.camera.scale);
      if ((memory.entityTypeFlags[entityId] & 2) === 2) { this.context.strokeRect(x - radius, y - radius, radius * 2, radius * 2); photonsRendered += 1; }
      else if ((memory.entityTypeFlags[entityId] & 16) === 16) { this.context.beginPath(); this.context.moveTo(x + radius * 2, y); this.context.lineTo(x - radius, y - radius); this.context.lineTo(x - radius, y + radius); this.context.closePath(); this.context.stroke(); spacecraftRendered += 1; }
      else { this.context.beginPath(); this.context.arc(x, y, radius, 0, Math.PI * 2); this.context.stroke(); materialNodesRendered += 1; }
    }
    return { materialNodesRendered, photonsRendered, spacecraftRendered };
  }
}

module.exports = { CanvasRenderer2D };
