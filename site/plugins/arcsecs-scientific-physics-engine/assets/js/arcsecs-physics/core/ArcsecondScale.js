(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(); }
    else { root.ArcSecsArcsecondScale = factory(); }
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";
    const ARCSECONDS_PER_RADIAN = 206264.80624709636;
    const METERS_PER_PARSEC = 3.0856775814913673e16;
    const METERS_PER_AU = 149597870700;
    const SECONDS_PER_YEAR = 31557600;
    class ArcsecondScale {
        toRadians(arcseconds) {
            const value = Number(arcseconds);
            if (!Number.isFinite(value)) { throw new Error("Arcseconds must be finite."); }
            return value / ARCSECONDS_PER_RADIAN;
        }
        fromRadians(radians) {
            const value = Number(radians);
            if (!Number.isFinite(value)) { throw new Error("Radians must be finite."); }
            return value * ARCSECONDS_PER_RADIAN;
        }
        properMotionToKilometersPerSecond(arcsecondsPerYear, parsecs) {
            const radiansPerSecond = this.toRadians(arcsecondsPerYear) / SECONDS_PER_YEAR;
            const meters = Number(parsecs) * METERS_PER_PARSEC;
            if (!Number.isFinite(meters) || meters < 0) { throw new Error("Parsec distance must be finite and non-negative."); }
            return (radiansPerSecond * meters) / 1000;
        }
        auToArcseconds(au, parsecs) {
            const auValue = Number(au);
            const parsecValue = Number(parsecs);
            if (!Number.isFinite(auValue) || !Number.isFinite(parsecValue) || parsecValue <= 0) { throw new Error("AU and parsecs must be finite, with parsecs > 0."); }
            return auValue / parsecValue;
        }
    }
    return { ArcsecondScale, ARCSECONDS_PER_RADIAN, METERS_PER_PARSEC, METERS_PER_AU, SECONDS_PER_YEAR };
});
