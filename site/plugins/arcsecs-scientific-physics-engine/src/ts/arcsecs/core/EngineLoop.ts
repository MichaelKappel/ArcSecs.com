import { FixedStepClock } from "./FixedStepClock";

export type EngineLoopState = "idle" | "running" | "paused" | "stepping";

export interface EngineLoopDiagnostics {
    readonly state: EngineLoopState;
    readonly tickCount: number;
    readonly renderFrameCount: number;
    readonly elapsedSimulationSeconds: number;
    readonly fixedStepSeconds: number;
    readonly physicsTickRate: number;
}

export type EngineTickHandler = (tickCount: number, elapsedSimulationSeconds: number) => void;
export type EngineRenderHandler = (diagnostics: EngineLoopDiagnostics) => void;

/** Fixed-step loop coordinator that keeps physics ticks deterministic and render frames observational. */
export class EngineLoop {
    private readonly clock: FixedStepClock;
    private readonly onTick: EngineTickHandler;
    private readonly onRender: EngineRenderHandler;
    private stateValue: EngineLoopState;
    private physicsTicksPerRenderFrame: number;

    /**
     * Creates a deterministic engine loop.
     * @param fixedStepSeconds Fixed physics step duration in seconds.
     * @param onTick Physics tick callback executed once per deterministic tick.
     * @param onRender Render callback executed when a render frame is recorded.
     */
    public constructor(fixedStepSeconds: number, onTick: EngineTickHandler, onRender: EngineRenderHandler) {
        this.clock = new FixedStepClock(fixedStepSeconds);
        this.onTick = onTick;
        this.onRender = onRender;
        this.stateValue = "idle";
        this.physicsTicksPerRenderFrame = 1;
    }

    /** Starts or resumes deterministic ticking. */
    public run(): void {
        this.stateValue = "running";
    }

    /** Pauses deterministic ticking while leaving render diagnostics available. */
    public pause(): void {
        this.stateValue = "paused";
    }

    /** Resets deterministic ticks, render frame count, and visible loop state. */
    public reset(): void {
        this.clock.reset();
        this.stateValue = "idle";
    }

    /** Advances exactly one deterministic physics tick and emits one render diagnostic sample. */
    public stepOnce(): EngineLoopDiagnostics {
        this.stateValue = "stepping";
        this.advancePhysicsTick();
        const diagnostics: EngineLoopDiagnostics = this.recordRenderFrame();
        this.stateValue = "paused";
        return diagnostics;
    }

    /**
     * Records one render frame and advances physics only when the loop is running.
     * @param requestedPhysicsTicks Optional deterministic ticks to consume this render frame.
     */
    public frame(requestedPhysicsTicks: number = 1): EngineLoopDiagnostics {
        if (this.stateValue === "running") {
            const acceptedTicks: number = Math.max(0, Math.trunc(requestedPhysicsTicks * this.physicsTicksPerRenderFrame));
            for (let tickIndex: number = 0; tickIndex < acceptedTicks; tickIndex += 1) {
                this.advancePhysicsTick();
            }
        }
        return this.recordRenderFrame();
    }

    /**
     * Sets the deterministic tick multiplier used per render frame.
     * @param physicsTicksPerRenderFrame Number of fixed ticks consumed per render frame while running.
     */
    public setPhysicsTicksPerRenderFrame(physicsTicksPerRenderFrame: number): void {
        this.physicsTicksPerRenderFrame = Math.max(0, Math.trunc(physicsTicksPerRenderFrame));
    }

    /** Returns current loop state. */
    public get state(): EngineLoopState {
        return this.stateValue;
    }

    /** Returns current immutable diagnostics. */
    public diagnostics(): EngineLoopDiagnostics {
        return {
            state: this.stateValue,
            tickCount: this.clock.tickCount,
            renderFrameCount: this.clock.renderFrameCount,
            elapsedSimulationSeconds: this.clock.elapsedSimulationSeconds,
            fixedStepSeconds: this.clock.fixedStepSeconds,
            physicsTickRate: 1 / this.clock.fixedStepSeconds
        };
    }

    private advancePhysicsTick(): void {
        const tickCount: number = this.clock.step();
        this.onTick(tickCount, this.clock.elapsedSimulationSeconds);
    }

    private recordRenderFrame(): EngineLoopDiagnostics {
        this.clock.recordRenderFrame();
        const diagnostics: EngineLoopDiagnostics = this.diagnostics();
        this.onRender(diagnostics);
        return diagnostics;
    }
}
