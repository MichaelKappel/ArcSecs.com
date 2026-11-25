export type ReviewCockpitStatus = 'readyWithCaution' | 'needsReview' | 'holdForRevision';

export interface ReviewCockpitGrandExperimentRow {
    readonly order: number;
    readonly scenario: string;
    readonly title: string;
    readonly status: string;
    readonly primaryMetric: string;
    readonly primaryValue: number;
    readonly validationScore: number;
    readonly observationalFitScore?: number;
    readonly warningCount: number;
    readonly ledger?: string;
    readonly expertCheck?: string;
    readonly visitorQuestion?: string;
}

export interface ReviewCockpitGrandExperimentSummary {
    readonly stageCount: number;
    readonly passCount: number;
    readonly averageValidationScore: number;
    readonly weakestScenario?: string;
    readonly strongestScenario?: string;
    readonly totalWarnings?: number;
    readonly exportReadiness?: string;
    readonly recommendedNextStep?: string;
}

export interface ReviewCockpitGrandExperimentInput {
    readonly engineVersion?: string;
    readonly rows?: ReadonlyArray<ReviewCockpitGrandExperimentRow>;
    readonly summary?: ReviewCockpitGrandExperimentSummary;
    readonly scientificBoundary?: string;
}

export interface ReviewCockpitGuidedTourInput {
    readonly status?: string;
    readonly progressPercent?: number;
    readonly currentTitle?: string;
    readonly currentScenario?: string;
    readonly stageCount?: number;
}

export interface ReviewCockpitFlightRecorderInput {
    readonly progressPercent?: number;
    readonly passCount?: number;
    readonly warningCount?: number;
    readonly failureCount?: number;
    readonly exportReady?: boolean;
}

export interface ReviewCockpitLatestMetricsInput {
    readonly ledgerStatus?: string;
    readonly energyLedgerClosureProxy?: number;
    readonly ramjetMissionReadiness?: number;
    readonly ramjetWarnings?: string;
    readonly baselineDelta?: number;
}

export interface ReviewCockpitInput {
    readonly engineVersion: string;
    readonly grandExperiment?: ReviewCockpitGrandExperimentInput | null;
    readonly guidedTour?: ReviewCockpitGuidedTourInput | null;
    readonly flightRecorder?: ReviewCockpitFlightRecorderInput | null;
    readonly latestMetrics?: ReviewCockpitLatestMetricsInput | null;
}

export interface ReviewCockpitWeakPoint {
    readonly scenario: string;
    readonly title: string;
    readonly reason: string;
    readonly validationScore: number;
    readonly warningCount: number;
}

export interface ReviewCockpitAssumptionRisk {
    readonly assumption: string;
    readonly riskLevel: 'low' | 'medium' | 'high';
    readonly reason: string;
}

export interface ReviewCockpitReport {
    readonly packetType: 'ArcSecs Review Cockpit';
    readonly engineVersion: string;
    readonly generatedUtc: string;
    readonly reviewStatus: ReviewCockpitStatus;
    readonly readinessScore: number;
    readonly passRatio: number;
    readonly publicSummary: string;
    readonly physicistSummary: string;
    readonly weakestPoints: ReadonlyArray<ReviewCockpitWeakPoint>;
    readonly assumptionRisks: ReadonlyArray<ReviewCockpitAssumptionRisk>;
    readonly nextActions: ReadonlyArray<string>;
    readonly shareableBoundary: string;
    readonly exportContainsExecutableCode: false;
}

const ASSUMPTION_NAMES: ReadonlyArray<string> = Object.freeze([
    'Absolute time',
    'No physical spacetime fabric',
    'Massive photon',
    'Tired-light attenuation',
    'Galilean superluminal kinematics',
    'Newtonian dark star',
    'Dark-light condensate',
    'Ramjet harvest model'
]);

function clamp(value: number, minimum: number, maximum: number): number {
    return Math.min(maximum, Math.max(minimum, value));
}

function finiteNumber(value: number | undefined, fallback: number): number {
    return Number.isFinite(value) ? Number(value) : fallback;
}

function rowsFrom(input: ReviewCockpitInput): ReadonlyArray<ReviewCockpitGrandExperimentRow> {
    return input.grandExperiment && Array.isArray(input.grandExperiment.rows) ? input.grandExperiment.rows : [];
}

export class ReviewCockpit {
    public build(input: ReviewCockpitInput): ReviewCockpitReport {
        const rows = rowsFrom(input);
        const summary = input.grandExperiment && input.grandExperiment.summary ? input.grandExperiment.summary : undefined;
        const stageCount = finiteNumber(summary ? summary.stageCount : undefined, rows.length || 9);
        const passCount = finiteNumber(summary ? summary.passCount : undefined, rows.filter((row: ReviewCockpitGrandExperimentRow) => row.status === 'pass').length);
        const passRatio = clamp(passCount / Math.max(1, stageCount), 0, 1);
        const averageValidationScore = finiteNumber(summary ? summary.averageValidationScore : undefined, rows.length ? rows.reduce((total: number, row: ReviewCockpitGrandExperimentRow) => total + finiteNumber(row.validationScore, 0), 0) / rows.length : 0);
        const warningCount = finiteNumber(summary ? summary.totalWarnings : undefined, rows.reduce((total: number, row: ReviewCockpitGrandExperimentRow) => total + finiteNumber(row.warningCount, 0), 0));
        const flightRecorder = input.flightRecorder || null;
        const recorderScore = flightRecorder && flightRecorder.exportReady ? 1 : 0.55;
        const latestMetrics = input.latestMetrics || null;
        const ledgerScore = latestMetrics && latestMetrics.ledgerStatus === 'pass' ? 1 : latestMetrics && latestMetrics.ledgerStatus === 'review' ? 0.72 : 0.62;
        const warningPenalty = clamp(warningCount / Math.max(1, stageCount * 4), 0, 0.22);
        const readinessScore = clamp((averageValidationScore * 0.52) + (passRatio * 0.25) + (recorderScore * 0.13) + (ledgerScore * 0.10) - warningPenalty, 0, 1);
        const reviewStatus: ReviewCockpitStatus = readinessScore >= 0.82 && passRatio >= 0.88 ? 'readyWithCaution' : readinessScore >= 0.62 ? 'needsReview' : 'holdForRevision';
        const weakestPoints = this.buildWeakPoints(rows, summary ? summary.weakestScenario : undefined);
        const assumptionRisks = this.buildAssumptionRisks(readinessScore, warningCount, rows);
        const nextActions = this.buildNextActions(reviewStatus, weakestPoints, latestMetrics, input.guidedTour || null);
        return Object.freeze({
            packetType: 'ArcSecs Review Cockpit',
            engineVersion: input.engineVersion,
            generatedUtc: new Date().toISOString(),
            reviewStatus,
            readinessScore,
            passRatio,
            publicSummary: this.buildPublicSummary(reviewStatus, passCount, stageCount, input.guidedTour || null),
            physicistSummary: this.buildPhysicistSummary(averageValidationScore, warningCount, weakestPoints),
            weakestPoints,
            assumptionRisks,
            nextActions,
            shareableBoundary: 'Speculative research visualization and mathematical sandbox; not established current technology, measured physical performance, or proof of an operational drive.',
            exportContainsExecutableCode: false
        });
    }

    private buildWeakPoints(rows: ReadonlyArray<ReviewCockpitGrandExperimentRow>, weakestScenario: string | undefined): ReadonlyArray<ReviewCockpitWeakPoint> {
        const sorted = rows.slice().sort((left: ReviewCockpitGrandExperimentRow, right: ReviewCockpitGrandExperimentRow) => {
            const validationDelta = finiteNumber(left.validationScore, 0) - finiteNumber(right.validationScore, 0);
            if (Math.abs(validationDelta) > 0.0001) {
                return validationDelta;
            }
            return finiteNumber(right.warningCount, 0) - finiteNumber(left.warningCount, 0);
        }).slice(0, 3);
        if (!sorted.length && weakestScenario) {
            return Object.freeze([{ scenario: weakestScenario, title: weakestScenario, reason: 'Grand Experiment summary identified this as the weakest scenario.', validationScore: 0, warningCount: 0 }]);
        }
        return Object.freeze(sorted.map((row: ReviewCockpitGrandExperimentRow): ReviewCockpitWeakPoint => Object.freeze({
            scenario: row.scenario,
            title: row.title,
            reason: row.status === 'pass' ? 'Lowest relative validation margin among passing stages.' : 'Stage requires review before being used as visitor-facing evidence.',
            validationScore: finiteNumber(row.validationScore, 0),
            warningCount: finiteNumber(row.warningCount, 0)
        })));
    }

    private buildAssumptionRisks(readinessScore: number, warningCount: number, rows: ReadonlyArray<ReviewCockpitGrandExperimentRow>): ReadonlyArray<ReviewCockpitAssumptionRisk> {
        const rowText = rows.map((row: ReviewCockpitGrandExperimentRow) => row.scenario).join(' ');
        return Object.freeze(ASSUMPTION_NAMES.map((assumption: string): ReviewCockpitAssumptionRisk => {
            const active = rowText.length > 0 || assumption === 'Ramjet harvest model';
            let riskLevel: 'low' | 'medium' | 'high' = readinessScore > 0.82 && warningCount <= 3 ? 'medium' : 'high';
            if (assumption === 'Absolute time' && readinessScore > 0.75) {
                riskLevel = 'medium';
            }
            if (!active) {
                riskLevel = 'low';
            }
            return Object.freeze({
                assumption,
                riskLevel,
                reason: active ? 'Active in the nine-mode review path and must remain labeled as an ArcSecs alternative hypothesis.' : 'Not active in the current evidence packet.'
            });
        }));
    }

    private buildNextActions(status: ReviewCockpitStatus, weakestPoints: ReadonlyArray<ReviewCockpitWeakPoint>, metrics: ReviewCockpitLatestMetricsInput | null, guidedTour: ReviewCockpitGuidedTourInput | null): ReadonlyArray<string> {
        const actions: string[] = [];
        if (guidedTour && guidedTour.status !== 'active') {
            actions.push('Run or resume the Guided Autopilot Tour so visitors see the scenario sequence before reviewing exports.');
        }
        if (weakestPoints.length) {
            actions.push(`Open ${weakestPoints[0].title} and compare its metric, validation score, and warning count before public sharing.`);
        }
        if (metrics && metrics.ledgerStatus && metrics.ledgerStatus !== 'pass') {
            actions.push('Inspect the photon energy ledger because the latest run is not reporting a clean pass.');
        }
        if (status === 'readyWithCaution') {
            actions.push('Export the Review Cockpit packet together with the Grand Experiment evidence packet for a cautious research note.');
        } else if (status === 'needsReview') {
            actions.push('Treat the page as a review build: share screenshots only with the speculative boundary and weakest-stage notes visible.');
        } else {
            actions.push('Hold public promotion until the weakest scenario and warning budget improve.');
        }
        return Object.freeze(actions.slice(0, 4));
    }

    private buildPublicSummary(status: ReviewCockpitStatus, passCount: number, stageCount: number, guidedTour: ReviewCockpitGuidedTourInput | null): string {
        const tourText = guidedTour ? ` Guided tour is ${guidedTour.status || 'pending'} at ${guidedTour.currentTitle || 'the first stage'}.` : ' Guided tour data is pending.';
        const statusText = status === 'readyWithCaution' ? 'ready for cautious public demonstration' : status === 'needsReview' ? 'useful but still marked for review' : 'not ready for public demonstration';
        return `The ArcSecs demo is ${statusText}: ${passCount}/${stageCount} Grand Experiment stages currently pass.${tourText}`;
    }

    private buildPhysicistSummary(averageValidationScore: number, warningCount: number, weakestPoints: ReadonlyArray<ReviewCockpitWeakPoint>): string {
        const weakest = weakestPoints.length ? weakestPoints[0].title : 'none';
        return `Average validation score ${(averageValidationScore * 100).toFixed(1)}%, warning count ${warningCount}, weakest stage ${weakest}. Treat all model claims as assumption-driven comparisons rather than empirical confirmation.`;
    }
}
