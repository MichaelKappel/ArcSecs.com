(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(); }
    else { root.ArcSecsLeibnizVoid = factory(); }
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";
    class LeibnizVoid {
        evaluate(nodeCount, edgeCount) {
            const nodes = Math.max(0, Math.round(Number(nodeCount || 0)));
            const edges = Math.max(0, Math.round(Number(edgeCount || 0)));
            const active = nodes === 0 && edges === 0;
            return {
                active,
                nodeCount: nodes,
                edgeCount: edges,
                viewportState: active ? "dimensionless void" : "relational graph visible",
                explanation: active ? "With no matter nodes, no distance tethers exist in the ArcSecs interpretation." : "Distance is rendered as relationships between remaining entities."
            };
        }
    }
    return { LeibnizVoid };
});
