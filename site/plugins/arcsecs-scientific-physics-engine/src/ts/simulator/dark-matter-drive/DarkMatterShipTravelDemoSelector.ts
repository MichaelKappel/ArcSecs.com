export type DarkMatterShipTravelDemoKey =
    | "demo-flight"
    | "acceptance-flight"
    | "dark-matter-ship-travel"
    | "acceptance-evidence-bundle";

export interface DarkMatterShipTravelDemoDefinition {
    readonly key: DarkMatterShipTravelDemoKey;
    readonly label: string;
    readonly description: string;
    readonly primaryAction: string;
    readonly preset: string;
    readonly automatic: boolean;
    readonly recordsAcceptance: boolean;
    readonly expectedViewportChange: string;
}

export interface DarkMatterShipTravelDemoSelection {
    readonly selectedKey: DarkMatterShipTravelDemoKey;
    readonly label: string;
    readonly description: string;
    readonly primaryAction: string;
    readonly automatic: boolean;
    readonly recordsAcceptance: boolean;
    readonly expectedViewportChange: string;
    readonly finite: boolean;
}

export class DarkMatterShipTravelDemoSelector {
    public readonly demos: readonly DarkMatterShipTravelDemoDefinition[] = [
        {
            key: "demo-flight",
            label: "Demo Flight",
            description: "Stage-by-stage guided cockpit demonstration with manual timeline control.",
            primaryAction: "play-demo-flight",
            preset: "interactiveBlueprint",
            automatic: false,
            recordsAcceptance: false,
            expectedViewportChange: "Cockpit wakes up and stage rail controls the main viewport."
        },
        {
            key: "acceptance-flight",
            label: "Acceptance Flight",
            description: "Automatic acceptance run through every demo stage with validation and export checks.",
            primaryAction: "run-acceptance-flight",
            preset: "interactiveBlueprint",
            automatic: true,
            recordsAcceptance: true,
            expectedViewportChange: "Runner visits every stage and produces pass/fail acceptance data."
        },
        {
            key: "dark-matter-ship-travel",
            label: "Dark Matter Ship Travel",
            description: "Travel-oriented demonstration showing departure, Proca-wind alignment, cruise, dense-filament crossing, missing-counterpart navigation, and thermal arrival handling.",
            primaryAction: "run-ship-travel",
            preset: "sailDarkMatterWind",
            automatic: true,
            recordsAcceptance: true,
            expectedViewportChange: "The craft visibly travels through route phases while telemetry, evidence, acceptance, and certificate panels update."
        },
        {
            key: "acceptance-evidence-bundle",
            label: "Acceptance Evidence Bundle",
            description: "Archive-focused acceptance run that ends with the evidence bundle and certificate ready for export.",
            primaryAction: "run-acceptance-flight",
            preset: "interactiveBlueprint",
            automatic: true,
            recordsAcceptance: true,
            expectedViewportChange: "All acceptance artifacts are collected and summarized into the archive bundle."
        }
    ];

    public select(key: DarkMatterShipTravelDemoKey): DarkMatterShipTravelDemoSelection {
        const definition: DarkMatterShipTravelDemoDefinition = this.demos.find((demo) => demo.key === key) || this.demos[0];

        return {
            selectedKey: definition.key,
            label: definition.label,
            description: definition.description,
            primaryAction: definition.primaryAction,
            automatic: definition.automatic,
            recordsAcceptance: definition.recordsAcceptance,
            expectedViewportChange: definition.expectedViewportChange,
            finite: definition.label.length > 0 && definition.primaryAction.length > 0
        };
    }
}
