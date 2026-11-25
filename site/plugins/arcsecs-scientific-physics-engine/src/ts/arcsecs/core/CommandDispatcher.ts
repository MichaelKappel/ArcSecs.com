export type ArcSecsCommandName =
    | "run"
    | "pause"
    | "step"
    | "reset"
    | "selectScenario"
    | "injectFailure"
    | "runValidation";

export interface ArcSecsCommand {
    readonly name: ArcSecsCommandName;
    readonly value: string;
    readonly issuedAtTick: number;
}

export interface CommandHandlerResult {
    readonly accepted: boolean;
    readonly message: string;
}

export type ArcSecsCommandHandler = (command: ArcSecsCommand) => CommandHandlerResult;

/** Explicit command dispatcher so buttons and keyboard shortcuts change simulation state through one path. */
export class CommandDispatcher {
    private readonly handlers: Map<ArcSecsCommandName, ArcSecsCommandHandler>;
    private readonly history: ArcSecsCommand[];

    public constructor() {
        this.handlers = new Map<ArcSecsCommandName, ArcSecsCommandHandler>();
        this.history = [];
    }

    /**
     * Registers a command handler.
     * @param name Command name.
     * @param handler Handler for the command.
     */
    public register(name: ArcSecsCommandName, handler: ArcSecsCommandHandler): void {
        this.handlers.set(name, handler);
    }

    /**
     * Dispatches a command and records it for diagnostics.
     * @param command Command requested by UI, keyboard, validation lab, or guided demo.
     */
    public dispatch(command: ArcSecsCommand): CommandHandlerResult {
        this.history.push(command);
        const handler: ArcSecsCommandHandler | undefined = this.handlers.get(command.name);
        if (!handler) {
            return { accepted: false, message: `No handler registered for ${command.name}.` };
        }
        return handler(command);
    }

    /** Returns an immutable copy of accepted and rejected command attempts. */
    public getHistory(): readonly ArcSecsCommand[] {
        return this.history.slice();
    }
}
