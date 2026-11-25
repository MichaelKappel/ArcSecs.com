(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(); }
    else { root.ArcSecsRuntimeAudit = factory(); }
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";
    class RuntimeAudit {
        constructor() { this.events = []; }
        record(kind, detail) { this.events.push({ kind: String(kind), detail: String(detail), utc: new Date().toISOString() }); return this.events[this.events.length - 1]; }
        summarize() { return { count: this.events.length, last: this.events[this.events.length - 1] || null, events: this.events.slice(-12) }; }
    }
    return { RuntimeAudit };
});
