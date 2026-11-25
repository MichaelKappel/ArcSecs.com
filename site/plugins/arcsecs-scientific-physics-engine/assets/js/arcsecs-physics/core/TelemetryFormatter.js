(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(); }
    else { root.ArcSecsTelemetryFormatter = factory(); }
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";
    class TelemetryFormatter {
        count(value) { const n = Number(value); return Number.isFinite(n) ? Math.max(0, Math.round(n)).toLocaleString() : "0"; }
        fixed(value, digits) { const n = Number(value); return Number.isFinite(n) ? n.toFixed(digits === undefined ? 4 : digits) : "0"; }
        percent(value) { const n = Number(value); return Number.isFinite(n) ? (n * 100).toFixed(1) + "%" : "0.0%"; }
        status(value) { const text = String(value || "nominal"); return /(undefined|nan|null|infinity)/i.test(text) ? "nominal" : text; }
    }
    return { TelemetryFormatter };
});
