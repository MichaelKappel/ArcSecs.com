import { GravitySolver } from "./GravitySolver";

export interface DarkStarEscapeState {
    readonly escapeVelocity: number;
    readonly photonVelocity: number;
    readonly distanceFromCenter: number;
    readonly apogee: number;
    readonly captured: boolean;
    readonly escaping: boolean;
}

/** Newtonian dark-star threshold model for launch, apogee, capture, and escape visualization. */
export class DarkStarEscapeModel {
    private readonly gravitySolver: GravitySolver;

    /**
     * Creates a dark-star escape model.
     * @param gravitySolver Gravity solver used for escape velocity calculations.
     */
    public constructor(gravitySolver: GravitySolver = new GravitySolver()) {
        this.gravitySolver = gravitySolver;
    }

    /**
     * Computes whether a photon proxy escapes or returns.
     * @param centralMass Central mass proxy.
     * @param launchRadius Launch radius from the center.
     * @param photonVelocity Outbound photon velocity proxy.
     */
    public evaluate(centralMass: number, launchRadius: number, photonVelocity: number): DarkStarEscapeState {
        const distanceFromCenter: number = Math.max(0.000001, launchRadius);
        const escapeVelocity: number = this.gravitySolver.escapeVelocity(centralMass, distanceFromCenter);
        const captured: boolean = photonVelocity < escapeVelocity;
        const escaping: boolean = !captured;
        const velocityRatio: number = photonVelocity / Math.max(0.000001, escapeVelocity);
        const apogee: number = captured ? distanceFromCenter / Math.max(0.000001, 1 - velocityRatio * velocityRatio) : Number.POSITIVE_INFINITY;
        return { escapeVelocity, photonVelocity, distanceFromCenter, apogee, captured, escaping };
    }
}
