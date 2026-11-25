(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(); }
    else { root.ArcSecsWeberMachianInduction = factory(); }
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";
    class WeberMachianInduction {
        calculate(betaCoupling, edgeCount, nodeCount, baryonicMass) {
            const beta = Math.max(0, Number(betaCoupling || 0));
            const edges = Math.max(1, Number(edgeCount || 1));
            const nodes = Math.max(1, Number(nodeCount || 1));
            const mass = Math.max(0, Number(baryonicMass || 0));
            const machianInductionProxy = Math.max(0, Math.min(1, beta * (1 + edges / nodes) / 10));
            const weberForceProxy = Math.max(0, Math.min(12, mass * beta / edges));
            return { machianInductionProxy, weberForceProxy, bounded: true, relationshipDensity: edges / nodes };
        }
    }
    return { WeberMachianInduction };
});
