'use strict';

class EngineLoop {
  constructor(fixedStepSeconds, onTick, onRender) {
    if (!Number.isFinite(fixedStepSeconds) || fixedStepSeconds <= 0) { throw new Error('Fixed step must be positive.'); }
    this.fixedStepSeconds = fixedStepSeconds;
    this.onTick = onTick;
    this.onRender = onRender;
    this.tickCount = 0;
    this.renderFrameCount = 0;
    this.state = 'idle';
    this.physicsTicksPerRenderFrame = 1;
  }
  run() { this.state = 'running'; }
  pause() { this.state = 'paused'; }
  reset() { this.tickCount = 0; this.renderFrameCount = 0; this.state = 'idle'; }
  setPhysicsTicksPerRenderFrame(physicsTicksPerRenderFrame) { this.physicsTicksPerRenderFrame = Math.max(0, Math.trunc(Number(physicsTicksPerRenderFrame || 0))); }
  stepOnce() {
    this.state = 'stepping';
    this.advancePhysicsTick();
    const diagnostics = this.recordRenderFrame();
    this.state = 'paused';
    return diagnostics;
  }
  frame(requestedPhysicsTicks) {
    if (this.state === 'running') {
      const acceptedTicks = Math.max(0, Math.trunc(Number(requestedPhysicsTicks === undefined ? 1 : requestedPhysicsTicks) * this.physicsTicksPerRenderFrame));
      for (let tickIndex = 0; tickIndex < acceptedTicks; tickIndex += 1) { this.advancePhysicsTick(); }
    }
    return this.recordRenderFrame();
  }
  diagnostics() {
    return {
      state: this.state,
      tickCount: this.tickCount,
      renderFrameCount: this.renderFrameCount,
      elapsedSimulationSeconds: this.tickCount * this.fixedStepSeconds,
      fixedStepSeconds: this.fixedStepSeconds,
      physicsTickRate: 1 / this.fixedStepSeconds
    };
  }
  advancePhysicsTick() {
    this.tickCount += 1;
    this.onTick(this.tickCount, this.tickCount * this.fixedStepSeconds);
  }
  recordRenderFrame() {
    this.renderFrameCount += 1;
    const diagnostics = this.diagnostics();
    this.onRender(diagnostics);
    return diagnostics;
  }
}

module.exports = { EngineLoop };
