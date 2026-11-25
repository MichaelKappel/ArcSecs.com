import { ArcSecsScenarioKey } from "../scenarios/ScenarioCatalog";
import { ArcSecsCommand, CommandDispatcher } from "../core/CommandDispatcher";

export interface KeyboardPresetBinding {
    readonly key: string;
    readonly scenario: ArcSecsScenarioKey;
}

export const defaultKeyboardPresetBindings: readonly KeyboardPresetBinding[] = [
    { key: "1", scenario: "relationalLattice" },
    { key: "2", scenario: "absoluteTimeQuantumOscillator" },
    { key: "3", scenario: "massivePhotonLensing" },
    { key: "4", scenario: "newtonianDarkStar" },
    { key: "5", scenario: "superluminalGalilean" },
    { key: "6", scenario: "tiredLightEnergyLedger" },
    { key: "7", scenario: "darkMatterCondensate" },
    { key: "8", scenario: "darkMatterRamjet" },
    { key: "9", scenario: "parallaxCalibration" }
];

/** Bridges keyboard intent to the same command dispatcher used by buttons. */
export class ControlBindings {
    private readonly dispatcher: CommandDispatcher;

    /**
     * Creates the keyboard binding facade.
     * @param dispatcher Command dispatcher that mutates simulation state.
     */
    public constructor(dispatcher: CommandDispatcher) {
        this.dispatcher = dispatcher;
    }

    /**
     * Converts a key to a command without touching browser state.
     * @param key Keyboard event key.
     * @param tick Current deterministic simulation tick.
     */
    public commandForKey(key: string, tick: number): ArcSecsCommand | null {
        const preset: KeyboardPresetBinding | undefined = defaultKeyboardPresetBindings.find((item: KeyboardPresetBinding) => item.key === key);
        if (preset) {
            return { name: "selectScenario", value: preset.scenario, issuedAtTick: tick };
        }
        if (key === " ") {
            return { name: "pause", value: "toggle", issuedAtTick: tick };
        }
        if (key.toLowerCase() === "s") {
            return { name: "step", value: "one-fixed-tick", issuedAtTick: tick };
        }
        if (key.toLowerCase() === "r") {
            return { name: "reset", value: "current-scenario", issuedAtTick: tick };
        }
        return null;
    }

    /**
     * Dispatches a key command when one exists.
     * @param key Keyboard event key.
     * @param tick Current deterministic simulation tick.
     */
    public dispatchKey(key: string, tick: number): boolean {
        const command: ArcSecsCommand | null = this.commandForKey(key, tick);
        if (!command) {
            return false;
        }
        return this.dispatcher.dispatch(command).accepted;
    }
}
