(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(); }
    else { root.ArcSecsSoldnerLensing = factory(); }
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";
    class SoldnerLensing {
        compare(massProxy, impactParameterProxy) {
            const mass = Math.max(0, Number(massProxy || 0));
            const impact = Math.max(0.001, Number(impactParameterProxy || 1));
            const soldnerArcseconds = mass / (impact * 4);
            const refractiveCorrectionArcseconds = soldnerArcseconds * 2;
            const standardReferenceArcseconds = refractiveCorrectionArcseconds;
            return {
                soldnerArcseconds,
                refractiveCorrectionArcseconds,
                standardReferenceArcseconds,
                percentOfReference: standardReferenceArcseconds === 0 ? 0 : soldnerArcseconds / standardReferenceArcseconds,
                caution: "Soldner corpuscular lensing is shown as a comparison model, not as a settled replacement for General Relativity."
            };
        }
    }
    return { SoldnerLensing };
});
