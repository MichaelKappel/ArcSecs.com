export type DarkMatterDriveContractEndpointKey =
    | "framework"
    | "distanceTimeKernel"
    | "multiMessengerEventTheater"
    | "pluginHandoff"
    | "evidenceMap"
    | "sourceMatrix"
    | "claimStatus"
    | "researchLibrary";

export type DarkMatterDriveContractFetchStatus = "not-requested" | "success" | "fallback" | "schema-mismatch" | "stale" | "blocked";

export interface DarkMatterDriveContractEndpointDescriptor {
    readonly endpointKey: DarkMatterDriveContractEndpointKey;
    readonly publicLabel: string;
    readonly pageUrl: string;
    readonly jsonUrl: string;
    readonly requiredAnchors: readonly string[];
    readonly requiredExportReference: string;
}

export interface DarkMatterDriveContractEndpointResult {
    readonly endpointKey: DarkMatterDriveContractEndpointKey;
    readonly publicLabel: string;
    readonly pageUrl: string;
    readonly jsonUrl: string;
    readonly status: DarkMatterDriveContractFetchStatus;
    readonly matchedAnchors: readonly string[];
    readonly missingAnchors: readonly string[];
    readonly schemaVersion: string;
    readonly generatedUtc: string;
    readonly warning: string;
}

export interface DarkMatterDriveContractAlignmentState {
    readonly sourceName: "DarkMatterDrive.com public contract";
    readonly endpoints: readonly DarkMatterDriveContractEndpointResult[];
    readonly requiredContractAnchors: readonly string[];
    readonly requiredClaimKeys: readonly string[];
    readonly exportSourceReferenceNames: readonly string[];
    readonly blockerWarnings: readonly string[];
    readonly fallbackIsSafe: boolean;
    readonly speculativeBoundaryText: string;
}

export interface DarkMatterDriveContractPayloadSummary {
    readonly schemaVersion: string;
    readonly generatedUtc: string;
    readonly anchors: readonly string[];
}

export interface DarkMatterDriveContractFetchReport {
    readonly endpoint: DarkMatterDriveContractEndpointDescriptor;
    readonly result: DarkMatterDriveContractEndpointResult;
    readonly payloadSummary: DarkMatterDriveContractPayloadSummary;
}

export type DarkMatterDriveContractFetcher = (url: string) => Promise<unknown>;

const speculativeBoundaryText: string = "Speculative research visualization: DarkMatterDrive.com contract alignment is used for hypothesis testing, comparison, validation, and falsification paths; it is not proof or settled physics.";

const currentUtcFallback: string = "1970-01-01T00:00:00.000Z";

export const darkMatterDrivePublicContractEndpoints: readonly DarkMatterDriveContractEndpointDescriptor[] = Object.freeze([
    Object.freeze({ endpointKey: "framework", publicLabel: "Framework", pageUrl: "https://darkmatterdrive.com/framework/", jsonUrl: "https://darkmatterdrive.com/framework.json", requiredAnchors: Object.freeze(["Distance-Time Kernel", "Framework Claim Map", "Multi-Messenger Event Theater"]), requiredExportReference: "DarkMatterDrive Framework public contract" }),
    Object.freeze({ endpointKey: "distanceTimeKernel", publicLabel: "Distance-Time Kernel", pageUrl: "https://darkmatterdrive.com/distance-time-kernel/", jsonUrl: "https://darkmatterdrive.com/distance-time-kernel.json", requiredAnchors: Object.freeze(["parsecs", "parallax", "arcseconds", "gravity-wave baseline", "clockless progression"]), requiredExportReference: "DarkMatterDrive Distance-Time Kernel contract" }),
    Object.freeze({ endpointKey: "multiMessengerEventTheater", publicLabel: "Multi-Messenger Event Theater", pageUrl: "https://darkmatterdrive.com/multi-messenger-event-theater/", jsonUrl: "https://darkmatterdrive.com/multi-messenger-event-theater.json", requiredAnchors: Object.freeze(["GW170817", "GW150914", "GW190521", "Supernova light-curve stretch", "Hubble tension"]), requiredExportReference: "DarkMatterDrive Multi-Messenger Event Theater contract" }),
    Object.freeze({ endpointKey: "pluginHandoff", publicLabel: "Plugin Handoff", pageUrl: "https://darkmatterdrive.com/plugin-handoff/", jsonUrl: "https://darkmatterdrive.com/plugin-handoff.json", requiredAnchors: Object.freeze(["strict TypeScript", "export builders", "Validation Lab", "Quality Gate"]), requiredExportReference: "DarkMatterDrive Plugin Handoff contract" }),
    Object.freeze({ endpointKey: "evidenceMap", publicLabel: "Evidence Map", pageUrl: "https://darkmatterdrive.com/evidence-map/", jsonUrl: "https://darkmatterdrive.com/evidence-map.json", requiredAnchors: Object.freeze(["Claim", "Telemetry", "Validation", "Falsification path"]), requiredExportReference: "DarkMatterDrive Evidence Map contract" }),
    Object.freeze({ endpointKey: "sourceMatrix", publicLabel: "Source Matrix", pageUrl: "https://darkmatterdrive.com/source-matrix/", jsonUrl: "https://darkmatterdrive.com/source-matrix.json", requiredAnchors: Object.freeze(["source documents", "contract anchors", "public references"]), requiredExportReference: "DarkMatterDrive Source Matrix contract" }),
    Object.freeze({ endpointKey: "claimStatus", publicLabel: "Claim Status", pageUrl: "https://darkmatterdrive.com/claim-status/", jsonUrl: "https://darkmatterdrive.com/claim-status.json", requiredAnchors: Object.freeze(["Distance Without Lightyears", "Clockless Universal Progression", "Gravity-Wave Baseline", "Electromagnetic Light as Secondary Messenger"]), requiredExportReference: "DarkMatterDrive Claim Status contract" }),
    Object.freeze({ endpointKey: "researchLibrary", publicLabel: "Research Library", pageUrl: "https://darkmatterdrive.com/research-library/", jsonUrl: "https://darkmatterdrive.com/research-library.json", requiredAnchors: Object.freeze(["New Universe Framework", "Rethinking Light Time and Spacetime", "Rethinking Cosmic Measurement Framework"]), requiredExportReference: "DarkMatterDrive Research Library contract" })
]);

export class DarkMatterDrivePublicContractClient {
    private readonly endpoints: readonly DarkMatterDriveContractEndpointDescriptor[];

    public constructor(endpoints: readonly DarkMatterDriveContractEndpointDescriptor[] = darkMatterDrivePublicContractEndpoints) {
        this.endpoints = endpoints;
    }

    public listEndpoints(): readonly DarkMatterDriveContractEndpointDescriptor[] {
        return this.endpoints.slice();
    }

    public buildFallbackAlignmentState(reason: string): DarkMatterDriveContractAlignmentState {
        const endpointResults: readonly DarkMatterDriveContractEndpointResult[] = Object.freeze(this.endpoints.map((endpoint: DarkMatterDriveContractEndpointDescriptor) => this.buildResult(endpoint, "fallback", endpoint.requiredAnchors, [], "fallback", currentUtcFallback, reason)));
        return this.buildAlignmentState(endpointResults);
    }

    public buildAlignmentState(endpointResults: readonly DarkMatterDriveContractEndpointResult[]): DarkMatterDriveContractAlignmentState {
        const blockerWarnings: readonly string[] = Object.freeze(endpointResults.filter((result: DarkMatterDriveContractEndpointResult) => result.status !== "success" && result.status !== "fallback").map((result: DarkMatterDriveContractEndpointResult) => `${result.publicLabel}: ${result.warning}`));
        return Object.freeze({
            sourceName: "DarkMatterDrive.com public contract",
            endpoints: endpointResults.slice(),
            requiredContractAnchors: Object.freeze(["GW170817", "GW150914", "GW190521", "Supernova light-curve stretch", "Hubble tension", "GW190814", "Synthetic Dense-Filament Event", "Synthetic Void-Line-of-Sight Event"]),
            requiredClaimKeys: Object.freeze(["distance-without-lightyears", "clockless-universal-progression", "gravity-wave-baseline", "electromagnetic-secondary-messenger", "multi-messenger-event-testing", "no-spacetime-foundation-language"]),
            exportSourceReferenceNames: Object.freeze(this.endpoints.map((endpoint: DarkMatterDriveContractEndpointDescriptor) => endpoint.requiredExportReference)),
            blockerWarnings,
            fallbackIsSafe: endpointResults.every((result: DarkMatterDriveContractEndpointResult) => result.status === "success" || result.status === "fallback"),
            speculativeBoundaryText
        });
    }

    public validatePayload(endpoint: DarkMatterDriveContractEndpointDescriptor, payload: unknown): DarkMatterDriveContractEndpointResult {
        const summary: DarkMatterDriveContractPayloadSummary = this.extractPayloadSummary(payload);
        const matchedAnchors: readonly string[] = Object.freeze(endpoint.requiredAnchors.filter((anchor: string) => summary.anchors.some((candidate: string) => candidate.toLowerCase() === anchor.toLowerCase())));
        const missingAnchors: readonly string[] = Object.freeze(endpoint.requiredAnchors.filter((anchor: string) => matchedAnchors.indexOf(anchor) < 0));
        const status: DarkMatterDriveContractFetchStatus = missingAnchors.length === 0 ? "success" : "schema-mismatch";
        const warning: string = missingAnchors.length === 0 ? "Contract payload matched required ArcSecs anchors." : `Contract payload missing anchors: ${missingAnchors.join(", ")}.`;
        return this.buildResult(endpoint, status, matchedAnchors, missingAnchors, summary.schemaVersion, summary.generatedUtc, warning);
    }

    public async fetchEndpoint(endpoint: DarkMatterDriveContractEndpointDescriptor, fetcher: DarkMatterDriveContractFetcher): Promise<DarkMatterDriveContractFetchReport> {
        try {
            const payload: unknown = await fetcher(endpoint.jsonUrl);
            const result: DarkMatterDriveContractEndpointResult = this.validatePayload(endpoint, payload);
            return Object.freeze({ endpoint, result, payloadSummary: this.extractPayloadSummary(payload) });
        } catch (error: unknown) {
            const message: string = error instanceof Error ? error.message : "Endpoint fetch failed.";
            const result: DarkMatterDriveContractEndpointResult = this.buildResult(endpoint, "fallback", endpoint.requiredAnchors, [], "fallback", currentUtcFallback, message);
            return Object.freeze({ endpoint, result, payloadSummary: Object.freeze({ schemaVersion: "fallback", generatedUtc: currentUtcFallback, anchors: endpoint.requiredAnchors }) });
        }
    }

    private extractPayloadSummary(payload: unknown): DarkMatterDriveContractPayloadSummary {
        if (this.isStringArray(payload)) {
            return Object.freeze({ schemaVersion: "array", generatedUtc: currentUtcFallback, anchors: payload });
        }
        if (this.isRecord(payload)) {
            const schemaVersion: string = this.stringValue(payload, "schemaVersion", this.stringValue(payload, "version", "unversioned"));
            const generatedUtc: string = this.stringValue(payload, "generatedUtc", this.stringValue(payload, "updatedUtc", currentUtcFallback));
            const anchors: readonly string[] = this.readAnchors(payload);
            return Object.freeze({ schemaVersion, generatedUtc, anchors });
        }
        return Object.freeze({ schemaVersion: "invalid", generatedUtc: currentUtcFallback, anchors: Object.freeze([]) });
    }

    private readAnchors(record: Readonly<Record<string, unknown>>): readonly string[] {
        const keys: readonly string[] = Object.freeze(["anchors", "contractAnchors", "events", "claims", "sourceDocuments", "pages", "exportTargets"]);
        const anchors: string[] = [];
        keys.forEach((key: string) => {
            const value: unknown = record[key];
            if (this.isStringArray(value)) {
                value.forEach((item: string) => anchors.push(item));
            }
            if (Array.isArray(value)) {
                value.forEach((item: unknown) => {
                    if (this.isRecord(item)) {
                        const label: string = this.stringValue(item, "eventName", this.stringValue(item, "title", this.stringValue(item, "name", this.stringValue(item, "key", ""))));
                        if (label.length > 0) {
                            anchors.push(label);
                        }
                    }
                });
            }
        });
        const summaryText: string = this.stringValue(record, "summary", "") + " " + this.stringValue(record, "description", "");
        this.endpoints.forEach((endpoint: DarkMatterDriveContractEndpointDescriptor) => {
            endpoint.requiredAnchors.forEach((anchor: string) => {
                if (summaryText.toLowerCase().indexOf(anchor.toLowerCase()) >= 0) {
                    anchors.push(anchor);
                }
            });
        });
        return Object.freeze(anchors.filter((anchor: string, index: number, values: string[]) => anchor.length > 0 && values.indexOf(anchor) === index));
    }

    private buildResult(endpoint: DarkMatterDriveContractEndpointDescriptor, status: DarkMatterDriveContractFetchStatus, matchedAnchors: readonly string[], missingAnchors: readonly string[], schemaVersion: string, generatedUtc: string, warning: string): DarkMatterDriveContractEndpointResult {
        return Object.freeze({
            endpointKey: endpoint.endpointKey,
            publicLabel: endpoint.publicLabel,
            pageUrl: endpoint.pageUrl,
            jsonUrl: endpoint.jsonUrl,
            status,
            matchedAnchors: matchedAnchors.slice(),
            missingAnchors: missingAnchors.slice(),
            schemaVersion,
            generatedUtc,
            warning
        });
    }

    private stringValue(record: Readonly<Record<string, unknown>>, key: string, fallback: string): string {
        const value: unknown = record[key];
        return typeof value === "string" && value.length > 0 ? value : fallback;
    }

    private isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
        return typeof value === "object" && value !== null && Array.isArray(value) === false;
    }

    private isStringArray(value: unknown): value is readonly string[] {
        return Array.isArray(value) && value.every((item: unknown) => typeof item === "string");
    }
}
