(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(); }
    else { root.ArcSecsUniversalClock = factory(); }
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";
    class UniversalClock {
        constructor(fixedStepSeconds) {
            this.fixedStepSeconds = Number(fixedStepSeconds || (1 / 60));
            this.absoluteTickCount = 0;
            if (!Number.isFinite(this.fixedStepSeconds) || this.fixedStepSeconds <= 0) { throw new Error("Fixed timestep must be finite and greater than zero."); }
        }
        tick(count) { this.absoluteTickCount += Math.max(1, Math.floor(Number(count || 1))); return this.snapshot(1); }
        snapshot(localOscillatorRatio) {
            const ratio = Math.max(0, Math.min(1, Number(localOscillatorRatio === undefined ? 1 : localOscillatorRatio)));
            return {
                absoluteTickCount: this.absoluteTickCount,
                fixedStepSeconds: this.fixedStepSeconds,
                elapsedSimulationSeconds: this.absoluteTickCount * this.fixedStepSeconds,
                localOscillatorRatio: ratio,
                localOscillatorTicks: this.absoluteTickCount * ratio,
                oscillatorDriftTicks: this.absoluteTickCount * (1 - ratio),
                mechanicalRetardationPercent: (1 - ratio) * 100,
                engineStatus: "fixed-step immutable clock"
            };
        }
    }
    return { UniversalClock };
});
