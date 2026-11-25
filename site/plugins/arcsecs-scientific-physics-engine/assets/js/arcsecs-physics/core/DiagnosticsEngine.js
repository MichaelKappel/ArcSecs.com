(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(); }
    else { root.ArcSecsDiagnosticsEngine = factory(); }
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";
    class DiagnosticsEngine {
        finiteMetrics(metrics) {
            return Object.keys(metrics || {}).filter((key) => typeof metrics[key] === "number").every((key) => Number.isFinite(metrics[key]));
        }
        buildRelationalReadiness(graphJson) {
            const nodeCount = (graphJson.nodes || []).length;
            const edgeCount = (graphJson.edges || []).length;
            return { nodeCount, edgeCount, leibnizVoid: nodeCount === 0 && edgeCount === 0, ready: nodeCount === 0 || edgeCount > 0 };
        }
        noUnsafeTelemetryText(text) { return !/(undefined|NaN|null|Infinity)/i.test(String(text)); }
    }
    return { DiagnosticsEngine };
});
