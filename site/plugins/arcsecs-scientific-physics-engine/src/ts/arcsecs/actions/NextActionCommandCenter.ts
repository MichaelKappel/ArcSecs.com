export type NextActionKind =
    | 'runGuidedTour'
    | 'focusWeakestScenario'
    | 'inspectPhotonLedger'
    | 'runGrandExperiment'
    | 'exportResearchBundle'
    | 'shareWithCaution'
    | 'holdForRevision';

export type NextActionStatus = 'ready' | 'complete' | 'blocked';
export type NextActionSeverity = 'info' | 'review' | 'warning';

export interface NextActionWeakPointInput {
    readonly scenario: string;
    readonly title: string;
    readonly validationScore: number;
    readonly warningCount: number;
}

export interface NextActionReviewInput {
    readonly reviewStatus?: string;
    readonly readinessScore?: number;
    readonly passRatio?: number;
    readonly weakestPoints?: ReadonlyArray<NextActionWeakPointInput>;
    readonly nextActions?: ReadonlyArray<string>;
}

export interface NextActionGuidedTourInput {
    readonly status?: string;
    readonly progressPercent?: number;
    readonly currentScenario?: string;
    readonly currentTitle?: string;
}

export interface NextActionMetricsInput {
    readonly ledgerStatus?: string;
    readonly energyLedgerClosureProxy?: number;
    readonly ramjetWarnings?: string;
}

export interface NextActionCommandCenterInput {
    readonly review?: NextActionReviewInput | null;
    readonly guidedTour?: NextActionGuidedTourInput | null;
    readonly latestMetrics?: NextActionMetricsInput | null;
    readonly hasGrandExperiment: boolean;
    readonly hasReviewCockpit: boolean;
}

export interface NextActionItem {
    readonly actionId: string;
    readonly kind: NextActionKind;
    readonly title: string;
    readonly detail: string;
    readonly buttonLabel: string;
    readonly targetScenario?: string;
    readonly status: NextActionStatus;
    readonly severity: NextActionSeverity;
}

export interface NextActionPlan {
    readonly packetType: 'ArcSecs Next Action Command Center';
    readonly generatedUtc: string;
    readonly overallStatus: 'ready' | 'incomplete' | 'blocked';
    readonly completedCount: number;
    readonly actionCount: number;
    readonly actions: ReadonlyArray<NextActionItem>;
    readonly researchBoundary: string;
    readonly exportContainsExecutableCode: false;
}

function finiteNumber(value: number | undefined, fallback: number): number {
    return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function firstWeakPoint(review: NextActionReviewInput | null): NextActionWeakPointInput | null {
    return review && Array.isArray(review.weakestPoints) && review.weakestPoints.length > 0 ? review.weakestPoints[0] : null;
}

export class NextActionCommandCenter {
    public buildPlan(input: NextActionCommandCenterInput): NextActionPlan {
        const review = input.review || null;
        const guidedTour = input.guidedTour || null;
        const metrics = input.latestMetrics || null;
        const weakPoint = firstWeakPoint(review);
        const actions: NextActionItem[] = [];

        const tourComplete = guidedTour ? guidedTour.status === 'complete' || finiteNumber(guidedTour.progressPercent, 0) >= 100 : false;
        actions.push(Object.freeze({
            actionId: 'run-guided-tour',
            kind: 'runGuidedTour',
            title: tourComplete ? 'Guided tour is complete' : 'Run or resume the Guided Autopilot Tour',
            detail: tourComplete ? 'The visitor-facing narrative path has reached every prompt-required stage.' : 'Start the visible nine-stage tour so visitors see the scenario sequence before reviewing exports.',
            buttonLabel: tourComplete ? 'Restart Tour' : 'Start Tour',
            targetScenario: guidedTour && guidedTour.currentScenario ? guidedTour.currentScenario : 'relationalLattice',
            status: tourComplete ? 'complete' : 'ready',
            severity: tourComplete ? 'info' : 'review'
        }));

        actions.push(Object.freeze({
            actionId: 'focus-weakest-scenario',
            kind: 'focusWeakestScenario',
            title: weakPoint ? `Open weakest stage: ${weakPoint.title}` : 'Open weakest stage after review data exists',
            detail: weakPoint ? `Validation ${(finiteNumber(weakPoint.validationScore, 0) * 100).toFixed(1)}%, warnings ${finiteNumber(weakPoint.warningCount, 0)}. Compare its metric, validation score, and warning count before public sharing.` : 'Build the Review Cockpit after a Grand Experiment so the weakest stage can be selected directly.',
            buttonLabel: weakPoint ? 'Open Weakest Stage' : 'Build Review First',
            targetScenario: weakPoint ? weakPoint.scenario : 'parallaxCalibration',
            status: weakPoint ? 'ready' : 'blocked',
            severity: weakPoint ? 'review' : 'warning'
        }));

        const ledgerNeedsReview = metrics && metrics.ledgerStatus && metrics.ledgerStatus !== 'pass';
        actions.push(Object.freeze({
            actionId: 'inspect-photon-ledger',
            kind: 'inspectPhotonLedger',
            title: ledgerNeedsReview ? 'Inspect photon energy ledger' : 'Photon energy ledger currently passes',
            detail: ledgerNeedsReview ? `Latest ledger status is ${metrics ? metrics.ledgerStatus : 'unknown'} with closure proxy ${finiteNumber(metrics ? metrics.energyLedgerClosureProxy : undefined, 0).toFixed(6)}.` : 'Open the Tired-Light Energy Ledger anyway when preparing a cautious research note so the accounting path is visible.',
            buttonLabel: 'Inspect Ledger',
            targetScenario: 'tiredLightEnergyLedger',
            status: ledgerNeedsReview ? 'ready' : 'complete',
            severity: ledgerNeedsReview ? 'warning' : 'info'
        }));

        actions.push(Object.freeze({
            actionId: 'run-grand-experiment',
            kind: 'runGrandExperiment',
            title: input.hasGrandExperiment ? 'Grand Experiment evidence exists' : 'Run Grand Experiment evidence sweep',
            detail: input.hasGrandExperiment ? 'The nine-mode sweep is available for export and review.' : 'Run the deterministic nine-mode sweep before exporting a research bundle.',
            buttonLabel: input.hasGrandExperiment ? 'Rerun Sweep' : 'Run Sweep',
            status: input.hasGrandExperiment ? 'complete' : 'ready',
            severity: input.hasGrandExperiment ? 'info' : 'review'
        }));

        const reviewStatus = review && review.reviewStatus ? review.reviewStatus : 'needsReview';
        const exportReady = input.hasGrandExperiment && input.hasReviewCockpit;
        actions.push(Object.freeze({
            actionId: reviewStatus === 'holdForRevision' ? 'hold-for-revision' : reviewStatus === 'readyWithCaution' ? 'export-research-bundle' : 'share-with-caution',
            kind: reviewStatus === 'holdForRevision' ? 'holdForRevision' : reviewStatus === 'readyWithCaution' ? 'exportResearchBundle' : 'shareWithCaution',
            title: reviewStatus === 'holdForRevision' ? 'Hold public promotion' : reviewStatus === 'readyWithCaution' ? 'Export cautious research bundle' : 'Prepare cautious review bundle',
            detail: reviewStatus === 'holdForRevision' ? 'Keep the public claim boundary visible and improve weak stages before promotion.' : exportReady ? 'Package the Review Cockpit, Grand Experiment, Guided Tour, Flight Recorder, latest metrics, and boundary language into one inert JSON file.' : 'Build missing review or evidence data before exporting.',
            buttonLabel: reviewStatus === 'holdForRevision' ? 'Show Hold Notes' : 'Export Bundle',
            status: exportReady ? 'ready' : 'blocked',
            severity: reviewStatus === 'readyWithCaution' ? 'info' : reviewStatus === 'holdForRevision' ? 'warning' : 'review'
        }));

        const completedCount = actions.filter((action: NextActionItem) => action.status === 'complete').length;
        const blockedCount = actions.filter((action: NextActionItem) => action.status === 'blocked').length;
        return Object.freeze({
            packetType: 'ArcSecs Next Action Command Center',
            generatedUtc: new Date().toISOString(),
            overallStatus: blockedCount > 0 ? 'blocked' : completedCount === actions.length ? 'ready' : 'incomplete',
            completedCount,
            actionCount: actions.length,
            actions: Object.freeze(actions),
            researchBoundary: 'Speculative research visualization and mathematical sandbox; next actions organize review work and do not prove the model.',
            exportContainsExecutableCode: false
        });
    }
}
