import { EntityMemory } from "../ecs/EntityMemory";
import { EntityTypeFlag } from "../ecs/ComponentTypes";

export interface RenderCameraState {
    readonly centerX: number;
    readonly centerY: number;
    readonly scale: number;
}

export interface RenderFrameDiagnostics {
    readonly materialNodesRendered: number;
    readonly photonsRendered: number;
    readonly spacecraftRendered: number;
}

/** Reliable Canvas 2D fallback renderer for WordPress hosts without WebGL2 guarantees. */
export class CanvasRenderer2D {
    private readonly context: CanvasRenderingContext2D;
    private camera: RenderCameraState;

    /**
     * Creates a scoped renderer for the ArcSecs demo canvas.
     * @param canvas Canvas owned by the plugin root.
     */
    public constructor(canvas: HTMLCanvasElement) {
        const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (!context) {
            throw new Error("Canvas 2D context is unavailable.");
        }
        this.context = context;
        this.camera = { centerX: 0, centerY: 0, scale: 1 };
    }

    /**
     * Sets the camera used for world-to-canvas conversion.
     * @param camera Camera center and scale.
     */
    public setCamera(camera: RenderCameraState): void {
        this.camera = camera;
    }

    /**
     * Renders active typed-array entities without rebuilding DOM.
     * @param memory Entity memory containing active scene state.
     */
    public render(memory: EntityMemory): RenderFrameDiagnostics {
        const width: number = this.context.canvas.width;
        const height: number = this.context.canvas.height;
        this.context.clearRect(0, 0, width, height);
        let materialNodesRendered: number = 0;
        let photonsRendered: number = 0;
        let spacecraftRendered: number = 0;
        for (let entityId: number = 0; entityId < memory.capacity; entityId += 1) {
            if (memory.activeFlags[entityId] !== 1) {
                continue;
            }
            const x: number = width / 2 + (memory.positionX[entityId] - this.camera.centerX) * this.camera.scale;
            const y: number = height / 2 + (memory.positionY[entityId] - this.camera.centerY) * this.camera.scale;
            const radius: number = Math.max(2, memory.radius[entityId] * this.camera.scale);
            if ((memory.entityTypeFlags[entityId] & EntityTypeFlag.Photon) === EntityTypeFlag.Photon) {
                this.context.strokeRect(x - radius, y - radius, radius * 2, radius * 2);
                photonsRendered += 1;
            } else if ((memory.entityTypeFlags[entityId] & EntityTypeFlag.Spacecraft) === EntityTypeFlag.Spacecraft) {
                this.context.beginPath();
                this.context.moveTo(x + radius * 2, y);
                this.context.lineTo(x - radius, y - radius);
                this.context.lineTo(x - radius, y + radius);
                this.context.closePath();
                this.context.stroke();
                spacecraftRendered += 1;
            } else {
                this.context.beginPath();
                this.context.arc(x, y, radius, 0, Math.PI * 2);
                this.context.stroke();
                materialNodesRendered += 1;
            }
        }
        return { materialNodesRendered, photonsRendered, spacecraftRendered };
    }
}
