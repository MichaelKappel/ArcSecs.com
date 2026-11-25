"use strict";

class FlightRecorder {
    constructor(sessionId, maximumEvents) {
        this.sessionId = String(sessionId || "arcsecs-session");
        this.maximumEvents = Math.max(10, Math.min(250, Math.round(Number(maximumEvents) || 80)));
        this.events = [];
        this.startedAtMilliseconds = 0;
        this.nextSequence = 1;
    }
    start(nowMilliseconds) {
        this.startedAtMilliseconds = Number.isFinite(Number(nowMilliseconds)) ? Number(nowMilliseconds) : 0;
    }
    record(input, nowMilliseconds) {
        const elapsedMilliseconds = Math.max(0, (Number.isFinite(Number(nowMilliseconds)) ? Number(nowMilliseconds) : 0) - this.startedAtMilliseconds);
        const event = {
            sequence: this.nextSequence,
            elapsedMilliseconds,
            label: String(input.label || "Event"),
            detail: String(input.detail || "No detail supplied."),
            severity: ["info", "pass", "warn", "fail"].includes(input.severity) ? input.severity : "info",
            source: String(input.source || "ui"),
            tick: Math.max(0, Math.round(Number(input.tick) || 0)),
            scenario: String(input.scenario || "none"),
            status: String(input.status || "pending")
        };
        this.nextSequence += 1;
        this.events.unshift(event);
        if (this.events.length > this.maximumEvents) {
            this.events.pop();
        }
        return event;
    }
    clear() {
        this.events.length = 0;
        this.nextSequence = 1;
    }
    snapshot(expectedGrandExperimentStages) {
        const passCount = this.events.filter((event) => event.severity === "pass").length;
        const warningCount = this.events.filter((event) => event.severity === "warn").length;
        const failureCount = this.events.filter((event) => event.severity === "fail").length;
        const lastEvent = this.events[0] || null;
        const stageEvents = this.events.filter((event) => event.source === "grand-experiment" && event.severity === "pass").length;
        const progressPercent = Math.max(0, Math.min(100, Math.round((stageEvents / Math.max(1, Number(expectedGrandExperimentStages) || 1)) * 100)));
        return {
            sessionId: this.sessionId,
            eventCount: this.events.length,
            passCount,
            warningCount,
            failureCount,
            lastScenario: lastEvent ? lastEvent.scenario : "none",
            lastStatus: lastEvent ? lastEvent.status : "pending",
            exportReady: failureCount === 0 && passCount > 0,
            progressPercent,
            events: this.events.slice()
        };
    }
}

module.exports = { FlightRecorder };
