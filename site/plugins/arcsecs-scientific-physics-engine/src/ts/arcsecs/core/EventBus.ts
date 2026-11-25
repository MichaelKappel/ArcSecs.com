export type ArcSecsEventHandler<TPayload> = (payload: TPayload) => void;

/** Allocation-light typed event bus used by UI, engine, renderer, and validation panels. */
export class EventBus<TEventMap extends Record<string, unknown>> {
    private readonly listeners: Map<keyof TEventMap, Array<ArcSecsEventHandler<TEventMap[keyof TEventMap]>>>;

    public constructor() {
        this.listeners = new Map<keyof TEventMap, Array<ArcSecsEventHandler<TEventMap[keyof TEventMap]>>>();
    }

    /**
     * Subscribes to a typed event.
     * @param name Event name from the event map.
     * @param handler Callback invoked with the matching event payload.
     */
    public on<TKey extends keyof TEventMap>(name: TKey, handler: ArcSecsEventHandler<TEventMap[TKey]>): void {
        const existingHandlers: Array<ArcSecsEventHandler<TEventMap[keyof TEventMap]>> = this.listeners.get(name) || [];
        existingHandlers.push(handler as ArcSecsEventHandler<TEventMap[keyof TEventMap]>);
        this.listeners.set(name, existingHandlers);
    }

    /**
     * Publishes a typed event to all current subscribers.
     * @param name Event name from the event map.
     * @param payload Event payload.
     */
    public emit<TKey extends keyof TEventMap>(name: TKey, payload: TEventMap[TKey]): void {
        const existingHandlers: Array<ArcSecsEventHandler<TEventMap[keyof TEventMap]>> = this.listeners.get(name) || [];
        for (const handler of existingHandlers) {
            handler(payload);
        }
    }

    /**
     * Returns the number of handlers for diagnostics and smoke tests.
     * @param name Event name from the event map.
     */
    public listenerCount<TKey extends keyof TEventMap>(name: TKey): number {
        return (this.listeners.get(name) || []).length;
    }
}
