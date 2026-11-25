(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(); }
    else { root.ArcSecsLocalOscillatorProbe = factory(); }
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";
    class LocalOscillatorProbe {
        constructor(id, baseFrequencyHz) {
            this.id = String(id || "probe");
            this.baseFrequencyHz = Number(baseFrequencyHz || 9192631770);
            if (!Number.isFinite(this.baseFrequencyHz) || this.baseFrequencyHz <= 0) { throw new Error("Base oscillator frequency must be finite and greater than zero."); }
        }
        measure(globalTicks, fixedStepSeconds, potentialLoad, velocityLoad) {
            const ticks = Math.max(0, Math.floor(Number(globalTicks || 0)));
            const step = Number(fixedStepSeconds || (1 / 60));
            const load = Math.max(0, Math.min(0.28, Number(potentialLoad || 0) + Number(velocityLoad || 0)));
            const frequencyRatio = Math.max(0.72, 1 - load);
            const absoluteSeconds = ticks * step;
            const localOscillatorTicks = ticks * frequencyRatio;
            return {
                id: this.id,
                baseFrequencyHz: this.baseFrequencyHz,
                absoluteTicks: ticks,
                absoluteSeconds,
                localOscillatorFrequencyHz: this.baseFrequencyHz * frequencyRatio,
                frequencyRatio,
                localOscillatorTicks,
                driftTicks: ticks - localOscillatorTicks,
                mechanicalRetardationPercent: (1 - frequencyRatio) * 100,
                label: "Mechanical Retardation",
                reason: "local oscillator mechanics are loaded while the Universal Cosmic Clock remains fixed"
            };
        }
    }
    return { LocalOscillatorProbe };
});
