"use strict";

class AutoLaunchDirector {
    buildPlan(input) {
        const safeDelayMilliseconds = Math.max(0, Math.min(10000, Math.round(Number(input.delayMilliseconds) || 0)));
        const shouldRunScenario = input.autoRun === true;
        const shouldRunGrandExperiment = input.autoGrandExperiment === true && input.workerAvailable === true;
        if (!shouldRunScenario && !shouldRunGrandExperiment) {
            return { status: "disabled", shouldRunScenario, shouldRunGrandExperiment, delayMilliseconds: safeDelayMilliseconds, scenario: input.defaultScenario, reason: "Automatic launch is disabled by shortcode attributes.", respectsReducedMotion: input.reducedMotion === true };
        }
        if (input.autoGrandExperiment === true && input.workerAvailable === false) {
            return { status: "blocked", shouldRunScenario, shouldRunGrandExperiment: false, delayMilliseconds: safeDelayMilliseconds, scenario: input.defaultScenario, reason: "Grand Experiment autostart is blocked because Web Workers are unavailable.", respectsReducedMotion: input.reducedMotion === true };
        }
        const reducedMotionText = input.reducedMotion === true ? " Reduced-motion preference is respected with conservative rendering budgets." : "";
        return { status: "queued", shouldRunScenario, shouldRunGrandExperiment, delayMilliseconds: input.reducedMotion === true ? Math.max(safeDelayMilliseconds, 1200) : safeDelayMilliseconds, scenario: input.defaultScenario, reason: shouldRunGrandExperiment ? `Page-load autopilot will run the selected scenario and then the Grand Experiment evidence sweep.${reducedMotionText}` : `Page-load autopilot will run the selected scenario.${reducedMotionText}`, respectsReducedMotion: input.reducedMotion === true };
    }
}

module.exports = { AutoLaunchDirector };
