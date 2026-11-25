export type AutoLaunchStatus = "disabled" | "queued" | "runningScenario" | "runningGrandExperiment" | "complete" | "blocked";

export interface AutoLaunchInput {
    readonly autoRun: boolean;
    readonly autoGrandExperiment: boolean;
    readonly workerAvailable: boolean;
    readonly reducedMotion: boolean;
    readonly delayMilliseconds: number;
    readonly defaultScenario: string;
}

export interface AutoLaunchPlan {
    readonly status: AutoLaunchStatus;
    readonly shouldRunScenario: boolean;
    readonly shouldRunGrandExperiment: boolean;
    readonly delayMilliseconds: number;
    readonly scenario: string;
    readonly reason: string;
    readonly respectsReducedMotion: boolean;
}

/**
 * Converts shortcode autostart attributes into one deterministic browser launch plan.
 * @remarks The plan is inert data; callers decide how to execute it so tests can verify
 * autostart behavior without starting timers or requiring a live WordPress page.
 */
export class AutoLaunchDirector {
    /**
     * Builds an automatic launch plan for the page-load demo experience.
     * @param input Attribute and browser capability inputs collected by the UI shell.
     */
    public buildPlan(input: AutoLaunchInput): AutoLaunchPlan {
        const safeDelayMilliseconds: number = Math.max(0, Math.min(10000, Math.round(input.delayMilliseconds)));
        const shouldRunScenario: boolean = input.autoRun === true;
        const shouldRunGrandExperiment: boolean = input.autoGrandExperiment === true && input.workerAvailable === true;
        if (!shouldRunScenario && !shouldRunGrandExperiment) {
            return {
                status: "disabled",
                shouldRunScenario,
                shouldRunGrandExperiment,
                delayMilliseconds: safeDelayMilliseconds,
                scenario: input.defaultScenario,
                reason: "Automatic launch is disabled by shortcode attributes.",
                respectsReducedMotion: input.reducedMotion
            };
        }
        if (input.autoGrandExperiment === true && input.workerAvailable === false) {
            return {
                status: "blocked",
                shouldRunScenario,
                shouldRunGrandExperiment: false,
                delayMilliseconds: safeDelayMilliseconds,
                scenario: input.defaultScenario,
                reason: "Grand Experiment autostart is blocked because Web Workers are unavailable.",
                respectsReducedMotion: input.reducedMotion
            };
        }
        const reducedMotionText: string = input.reducedMotion ? " Reduced-motion preference is respected with conservative rendering budgets." : "";
        return {
            status: "queued",
            shouldRunScenario,
            shouldRunGrandExperiment,
            delayMilliseconds: input.reducedMotion ? Math.max(safeDelayMilliseconds, 1200) : safeDelayMilliseconds,
            scenario: input.defaultScenario,
            reason: shouldRunGrandExperiment
                ? `Page-load autopilot will run the selected scenario and then the Grand Experiment evidence sweep.${reducedMotionText}`
                : `Page-load autopilot will run the selected scenario.${reducedMotionText}`,
            respectsReducedMotion: input.reducedMotion
        };
    }
}
