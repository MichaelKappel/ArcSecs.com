(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(require("./RelationalGraph.js"), require("./UniversalClock.js"), require("./ArcsecondScale.js"), require("./ParsecScale.js"), require("./DiagnosticsEngine.js")); }
    else { root.ArcSecsCoreEngine = factory(root.ArcSecsRelationalGraph, root.ArcSecsUniversalClock, root.ArcSecsArcsecondScale, root.ArcSecsParsecScale, root.ArcSecsDiagnosticsEngine); }
})(typeof self !== "undefined" ? self : this, function (graphModule, clockModule, arcsecondModule, parsecModule, diagnosticsModule) {
    "use strict";
    class ArcSecsEngine {
        constructor(options) {
            this.clock = new clockModule.UniversalClock((options && options.fixedStepSeconds) || (1 / 60));
            this.graph = new graphModule.RelationalGraph();
            this.arcseconds = new arcsecondModule.ArcsecondScale();
            this.parsecs = new parsecModule.ParsecScale();
            this.diagnostics = new diagnosticsModule.DiagnosticsEngine();
        }
        seedTwoBodyDemo() {
            this.graph.addNode("observer", "observer", 1).addNode("source", "star", 2).addEdge("observer", "source", 1, 1, 4.74047, 1);
            return this;
        }
        step(localOscillatorRatio) { return { clock: this.clock.tick(1), graph: this.graph.toJSON(), localOscillatorRatio: Number(localOscillatorRatio || 1) }; }
        buildSnapshot() { return { clock: this.clock.snapshot(1), graph: this.graph.toJSON(), diagnostics: this.diagnostics.buildRelationalReadiness(this.graph.toJSON()) }; }
    }
    return { ArcSecsEngine };
});
