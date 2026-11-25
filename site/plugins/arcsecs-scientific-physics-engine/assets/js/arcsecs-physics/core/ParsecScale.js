(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(); }
    else { root.ArcSecsParsecScale = factory(); }
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";
    class ParsecScale {
        fromParallaxArcseconds(parallaxArcseconds, baselineAu) {
            const angle = Number(parallaxArcseconds);
            const baseline = Number(baselineAu === undefined ? 1 : baselineAu);
            if (!Number.isFinite(angle) || angle <= 0) { throw new Error("Parallax angle must be finite and greater than zero."); }
            if (!Number.isFinite(baseline) || baseline <= 0) { throw new Error("Baseline AU must be finite and greater than zero."); }
            return baseline / angle;
        }
        toLightYears(parsecs) {
            const value = Number(parsecs);
            if (!Number.isFinite(value) || value < 0) { throw new Error("Parsecs must be finite and non-negative."); }
            return value * 3.26156;
        }
        normalizeCosmicDistance(parsecs, referenceParsecs) {
            const distance = Number(parsecs);
            const reference = Number(referenceParsecs || 1);
            if (!Number.isFinite(distance) || !Number.isFinite(reference) || reference <= 0) { throw new Error("Distance and reference must be finite, with reference > 0."); }
            return distance / (distance + reference);
        }
    }
    return { ParsecScale };
});
