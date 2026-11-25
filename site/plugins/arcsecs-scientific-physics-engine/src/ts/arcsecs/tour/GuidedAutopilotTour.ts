export type GuidedTourStageStatus = 'queued' | 'active' | 'complete' | 'paused' | 'review';

export interface GuidedTourStageDefinition {
    readonly order: number;
    readonly scenario: string;
    readonly title: string;
    readonly plainLanguageGoal: string;
    readonly physicistCheckpoint: string;
    readonly operatorAction: string;
    readonly expectedEvidence: string;
}

export interface GuidedTourStageState extends GuidedTourStageDefinition {
    readonly status: GuidedTourStageStatus;
    readonly progressPercent: number;
}

export interface GuidedTourSnapshot {
    readonly tourId: string;
    readonly status: GuidedTourStageStatus;
    readonly currentStageIndex: number;
    readonly stageCount: number;
    readonly progressPercent: number;
    readonly currentScenario: string;
    readonly currentTitle: string;
    readonly stages: ReadonlyArray<GuidedTourStageState>;
    readonly exportContainsExecutableCode: false;
}

const STAGES: ReadonlyArray<GuidedTourStageDefinition> = Object.freeze([
    { order: 1, scenario: 'relationalLattice', title: 'Relational Flat-Space Lattice', plainLanguageGoal: 'Show that the visible grid is a label layer while solver links carry the relationship story.', physicistCheckpoint: 'Edge count, relation length, and stability remain finite.', operatorAction: 'Select relational lattice and start the fixed-step simulation.', expectedEvidence: 'Material nodes and solver links remain visible.' },
    { order: 2, scenario: 'absoluteTimeQuantumOscillator', title: 'Absolute Time / Oscillator Damping', plainLanguageGoal: 'Show one global time counter with two local oscillators transitioning at different rates.', physicistCheckpoint: 'Near-mass oscillator transitions are lower without changing global tick count.', operatorAction: 'Compare deep-space and near-mass transition counts.', expectedEvidence: 'Global tick is shared while local transition counts diverge.' },
    { order: 3, scenario: 'massivePhotonLensing', title: 'Massive Photon Lensing', plainLanguageGoal: 'Show curved photon paths next to Soldner and GR reference comparisons.', physicistCheckpoint: 'Deflection changes with mass, coupling, and impact parameter.', operatorAction: 'Run lensing and inspect the deflection arcsecond readout.', expectedEvidence: 'Curved trails and explicit baseline mismatch are visible.' },
    { order: 4, scenario: 'newtonianDarkStar', title: 'Newtonian Dark Star', plainLanguageGoal: 'Show photons turning around when escape velocity exceeds their outward velocity.', physicistCheckpoint: 'Captured state must agree with the escape velocity threshold.', operatorAction: 'Launch the dark-star scenario and inspect apogee / capture state.', expectedEvidence: 'Captured and escaping labels are tied to trajectory state.' },
    { order: 5, scenario: 'superluminalGalilean', title: 'Galilean Relative Velocity', plainLanguageGoal: 'Show arithmetic relative velocity without Lorentz limiting in the alternative hypothesis mode.', physicistCheckpoint: 'Relative velocity equals vector sum/difference and Lorentz factor stays disabled.', operatorAction: 'Run the Galilean mode and read the relative velocity badge.', expectedEvidence: 'Relative velocity can exceed one c in the displayed arithmetic model.' },
    { order: 6, scenario: 'tiredLightEnergyLedger', title: 'Tired-Light Energy Ledger', plainLanguageGoal: 'Show that lost photon energy is not allowed to vanish from the accounting.', physicistCheckpoint: 'Lost energy and substrate ledger gain close within tolerance.', operatorAction: 'Run the energy-ledger mode and inspect closure error.', expectedEvidence: 'Ledger closure is shown as a number and warning state.' },
    { order: 7, scenario: 'darkMatterCondensate', title: 'Dark-Light Condensate', plainLanguageGoal: 'Show exhausted light pooling into a halo-like visualization linked to the ledger.', physicistCheckpoint: 'Halo density follows accumulated tired-light energy.', operatorAction: 'Run condensate and inspect halo density / accumulated energy.', expectedEvidence: 'Visible halo growth is coupled to ledger telemetry.' },
    { order: 8, scenario: 'darkMatterRamjet', title: 'Dark Matter Ramjet Pipeline', plainLanguageGoal: 'Show the EIT scoop through exhaust pipeline and which subsystem bottlenecks first.', physicistCheckpoint: 'Failure injection changes telemetry rather than only labels.', operatorAction: 'Run ramjet and compare readiness before / after failure buttons.', expectedEvidence: 'Buffer, drag, shield, thermal, and thrust signals update visibly.' },
    { order: 9, scenario: 'parallaxCalibration', title: 'Validation Lab', plainLanguageGoal: 'Show that the research cockpit still honors simple calibration anchors.', physicistCheckpoint: 'One arcsecond and one AU resolve to one parsec within tolerance.', operatorAction: 'Run validation lab and inspect pass/fail reasons.', expectedEvidence: 'Calibration, replay, ledger, and readiness checks are listed.' }
]);

export class GuidedAutopilotTour {
    private readonly tourId: string;
    private readonly stageDefinitions: ReadonlyArray<GuidedTourStageDefinition>;
    private currentStageIndex: number;
    private paused: boolean;
    private started: boolean;

    public constructor(tourId: string = 'arcsecs-guided-autopilot-tour', stages: ReadonlyArray<GuidedTourStageDefinition> = STAGES) {
        this.tourId = tourId;
        this.stageDefinitions = stages.slice();
        this.currentStageIndex = 0;
        this.paused = false;
        this.started = false;
    }

    public start(): GuidedTourSnapshot {
        this.started = true;
        this.paused = false;
        this.currentStageIndex = Math.max(0, Math.min(this.currentStageIndex, this.stageDefinitions.length - 1));
        return this.snapshot();
    }

    public pause(): GuidedTourSnapshot {
        this.started = true;
        this.paused = true;
        return this.snapshot();
    }

    public resume(): GuidedTourSnapshot {
        this.started = true;
        this.paused = false;
        return this.snapshot();
    }

    public next(): GuidedTourSnapshot {
        this.started = true;
        this.paused = false;
        this.currentStageIndex = Math.min(this.stageDefinitions.length - 1, this.currentStageIndex + 1);
        return this.snapshot();
    }

    public previous(): GuidedTourSnapshot {
        this.started = true;
        this.paused = false;
        this.currentStageIndex = Math.max(0, this.currentStageIndex - 1);
        return this.snapshot();
    }

    public selectScenario(scenario: string): GuidedTourSnapshot {
        const index = this.stageDefinitions.findIndex((stage: GuidedTourStageDefinition) => stage.scenario === scenario);
        if (index >= 0) {
            this.started = true;
            this.currentStageIndex = index;
        }
        return this.snapshot();
    }

    public snapshot(): GuidedTourSnapshot {
        const stageCount = this.stageDefinitions.length;
        const boundedIndex = Math.max(0, Math.min(this.currentStageIndex, stageCount - 1));
        const currentStage = this.stageDefinitions[boundedIndex];
        const status: GuidedTourStageStatus = !this.started ? 'queued' : (this.paused ? 'paused' : 'active');
        const progressPercent = Math.round(((boundedIndex + (this.started ? 1 : 0)) / Math.max(1, stageCount)) * 100);
        const stages = this.stageDefinitions.map((stage: GuidedTourStageDefinition, index: number): GuidedTourStageState => {
            let stageStatus: GuidedTourStageStatus = 'queued';
            if (index < boundedIndex) {
                stageStatus = 'complete';
            } else if (index === boundedIndex) {
                stageStatus = status;
            }
            return Object.freeze({ ...stage, status: stageStatus, progressPercent: Math.round(((index + 1) / Math.max(1, stageCount)) * 100) });
        });
        return Object.freeze({
            tourId: this.tourId,
            status,
            currentStageIndex: boundedIndex,
            stageCount,
            progressPercent,
            currentScenario: currentStage.scenario,
            currentTitle: currentStage.title,
            stages,
            exportContainsExecutableCode: false
        });
    }
}

export const guidedAutopilotTourStages = STAGES;
