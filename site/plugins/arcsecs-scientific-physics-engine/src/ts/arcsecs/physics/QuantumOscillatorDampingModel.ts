export interface QuantumOscillatorDampingState {
    readonly globalTickCount: number;
    readonly globalSimulationSeconds: number;
    readonly deepSpaceTransitionCount: number;
    readonly nearMassTransitionCount: number;
    readonly localGravitationalGradient: number;
    readonly dampingCoefficient: number;
}

/** ArcSecs mechanical oscillator model: one universal clock with local transition damping. */
export class QuantumOscillatorDampingModel {
    /**
     * Computes transition counts for deep-space and near-mass probes under one global clock.
     * @param globalTickCount Immutable global fixed-step tick count.
     * @param fixedStepSeconds Fixed step duration in seconds.
     * @param massProxy Nearby mass proxy.
     * @param distanceProxy Probe distance from the mass proxy.
     */
    public compute(globalTickCount: number, fixedStepSeconds: number, massProxy: number, distanceProxy: number): QuantumOscillatorDampingState {
        const safeDistance: number = Math.max(0.001, distanceProxy);
        const localGravitationalGradient: number = Math.max(0, massProxy) / (safeDistance * safeDistance);
        const dampingCoefficient: number = this.clamp(localGravitationalGradient * 0.012, 0, 0.36);
        return {
            globalTickCount,
            globalSimulationSeconds: globalTickCount * fixedStepSeconds,
            deepSpaceTransitionCount: globalTickCount,
            nearMassTransitionCount: Math.floor(globalTickCount * (1 - dampingCoefficient)),
            localGravitationalGradient,
            dampingCoefficient
        };
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(maximum, Math.max(minimum, value));
    }
}
