export type FlightRecorderSeverity = "info" | "pass" | "warn" | "fail";

export interface FlightRecorderEventInput {
    readonly label: string;
    readonly detail: string;
    readonly severity: FlightRecorderSeverity;
    readonly source: string;
    readonly tick?: number;
    readonly scenario?: string;
    readonly status?: string;
}

export interface FlightRecorderEvent {
    readonly sequence: number;
    readonly elapsedMilliseconds: number;
    readonly label: string;
    readonly detail: string;
    readonly severity: FlightRecorderSeverity;
    readonly source: string;
    readonly tick: number;
    readonly scenario: string;
    readonly status: string;
}

export interface FlightRecorderSnapshot {
    readonly sessionId: string;
    readonly eventCount: number;
    readonly passCount: number;
    readonly warningCount: number;
    readonly failureCount: number;
    readonly lastScenario: string;
    readonly lastStatus: string;
    readonly exportReady: boolean;
    readonly progressPercent: number;
    readonly events: ReadonlyArray<FlightRecorderEvent>;
}

/**
 * Records visible autopilot and simulation lifecycle events as inert data.
 * @remarks The browser controller renders these entries into the Experiment Recorder panel.
 */
export class FlightRecorder {
    private readonly sessionId: string;
    private readonly maximumEvents: number;
    private readonly events: FlightRecorderEvent[];
    private startedAtMilliseconds: number;
    private nextSequence: number;

    /**
     * Creates a bounded flight recorder.
     * @param sessionId Stable session identifier used in exported diagnostics.
     * @param maximumEvents Maximum number of events retained in memory.
     */
    public constructor(sessionId: string, maximumEvents: number) {
        this.sessionId = sessionId.length > 0 ? sessionId : "arcsecs-session";
        this.maximumEvents = Math.max(10, Math.min(250, Math.round(maximumEvents)));
        this.events = [];
        this.startedAtMilliseconds = 0;
        this.nextSequence = 1;
    }

    /**
     * Starts or restarts the elapsed-time base.
     * @param nowMilliseconds Current high-resolution time in milliseconds.
     */
    public start(nowMilliseconds: number): void {
        this.startedAtMilliseconds = Number.isFinite(nowMilliseconds) ? nowMilliseconds : 0;
    }

    /**
     * Adds a lifecycle event to the bounded recorder.
     * @param input Event content and classification.
     * @param nowMilliseconds Current high-resolution time in milliseconds.
     */
    public record(input: FlightRecorderEventInput, nowMilliseconds: number): FlightRecorderEvent {
        const elapsedMilliseconds: number = Math.max(0, (Number.isFinite(nowMilliseconds) ? nowMilliseconds : 0) - this.startedAtMilliseconds);
        const event: FlightRecorderEvent = {
            sequence: this.nextSequence,
            elapsedMilliseconds,
            label: input.label,
            detail: input.detail,
            severity: input.severity,
            source: input.source,
            tick: Math.max(0, Math.round(input.tick || 0)),
            scenario: input.scenario || "none",
            status: input.status || "pending"
        };
        this.nextSequence += 1;
        this.events.unshift(event);
        if (this.events.length > this.maximumEvents) {
            this.events.pop();
        }
        return event;
    }

    /** Clears all retained events while preserving the session identifier. */
    public clear(): void {
        this.events.length = 0;
        this.nextSequence = 1;
    }

    /**
     * Builds a summarized recorder snapshot for rendering or export.
     * @param expectedGrandExperimentStages Expected number of Grand Experiment stages.
     */
    public snapshot(expectedGrandExperimentStages: number): FlightRecorderSnapshot {
        const passCount: number = this.events.filter((event: FlightRecorderEvent) => event.severity === "pass").length;
        const warningCount: number = this.events.filter((event: FlightRecorderEvent) => event.severity === "warn").length;
        const failureCount: number = this.events.filter((event: FlightRecorderEvent) => event.severity === "fail").length;
        const lastEvent: FlightRecorderEvent | undefined = this.events[0];
        const stageEvents: number = this.events.filter((event: FlightRecorderEvent) => event.source === "grand-experiment" && event.severity === "pass").length;
        const progressPercent: number = Math.max(0, Math.min(100, Math.round((stageEvents / Math.max(1, expectedGrandExperimentStages)) * 100)));
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
