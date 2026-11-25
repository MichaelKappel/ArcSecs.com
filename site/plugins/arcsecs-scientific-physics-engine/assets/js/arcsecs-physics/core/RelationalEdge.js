(function (root, factory) {
    if (typeof module === "object" && module.exports) { module.exports = factory(); }
    else { root.ArcSecsRelationalEdge = factory(); }
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";
    class RelationalEdge {
        constructor(fromEntityId, toEntityId, distanceParsecs, angularSeparationArcseconds, relativeVelocityKps, couplingStrength) {
            this.fromEntityId = String(fromEntityId);
            this.toEntityId = String(toEntityId);
            this.distanceParsecs = Number(distanceParsecs);
            this.angularSeparationArcseconds = Number(angularSeparationArcseconds);
            this.relativeVelocityKps = Number(relativeVelocityKps || 0);
            this.couplingStrength = Number(couplingStrength === undefined ? 1 : couplingStrength);
            if (!this.fromEntityId || !this.toEntityId || this.fromEntityId === this.toEntityId) { throw new Error("Relational edges require two distinct entity IDs."); }
            if (![this.distanceParsecs, this.angularSeparationArcseconds, this.relativeVelocityKps, this.couplingStrength].every(Number.isFinite)) { throw new Error("Relational edge numeric values must be finite."); }
            if (this.distanceParsecs < 0 || this.angularSeparationArcseconds < 0) { throw new Error("Relational edge distance and angular separation must be non-negative."); }
        }
        get key() { return [this.fromEntityId, this.toEntityId].sort().join("::"); }
        toJSON() {
            return {
                fromEntityId: this.fromEntityId,
                toEntityId: this.toEntityId,
                distanceParsecs: this.distanceParsecs,
                angularSeparationArcseconds: this.angularSeparationArcseconds,
                relativeVelocityKps: this.relativeVelocityKps,
                couplingStrength: this.couplingStrength,
                constraintState: this.couplingStrength > 0.75 ? "locked" : "soft"
            };
        }
    }
    return { RelationalEdge };
});
