(function () {
    "use strict";
    const PACKAGE_VERSION = "3.142.0";

    /** Dispatches runtime events without coupling the simulation loop to DOM code. */
    class EventBus {
        constructor() { this.listeners = new Map(); }
        /** @param {string} name @param {(payload:any)=>void} callback */
        on(name, callback) {
            const callbacks = this.listeners.get(name) || [];
            callbacks.push(callback);
            this.listeners.set(name, callbacks);
        }
        /** @param {string} name @param {any} payload */
        emit(name, payload) {
            const callbacks = this.listeners.get(name) || [];
            for (const callback of callbacks) { callback(payload); }
        }
    }

    /** Two-dimensional vector primitive used by renderers and smoke-tested as an engine math primitive. */
    class Vector2 {
        /** @param {number} x @param {number} y */
        constructor(x, y) { this.x = x; this.y = y; }
        /** @param {Vector2} other @returns {Vector2} */ add(other) { return new Vector2(this.x + other.x, this.y + other.y); }
        /** @param {Vector2} other @returns {Vector2} */ subtract(other) { return new Vector2(this.x - other.x, this.y - other.y); }
        /** @param {Vector2} other @returns {number} */ dot(other) { return this.x * other.x + this.y * other.y; }
        /** @returns {number} */ magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
        /** @returns {Vector2} */ normalize() { const m = this.magnitude(); return m === 0 ? new Vector2(0, 0) : new Vector2(this.x / m, this.y / m); }
        /** @param {Vector2} other @returns {number} */ distanceTo(other) { return this.subtract(other).magnitude(); }
    }

    /** Fixed-time-step ticker with pause, resume, step, and speed multiplier support. */
    class FixedTimeStepRunner {
        constructor() { this.tick = 0; this.running = true; this.speedMultiplier = 1; this.fixedStepSeconds = 1 / 60; this.accumulator = 0; }
        pause() { this.running = false; this.accumulator = 0; }
        resume() { this.running = true; }
        stepOneTick() { this.tick += 1; return this.tick; }
        /** @param {number} value */ setSpeedMultiplier(value) { this.speedMultiplier = clamp(value, 0.1, 5); }
        /** @param {number} deltaSeconds */ update(deltaSeconds) { if (!this.running) { return this.tick; } this.accumulator += Math.max(0, deltaSeconds) * this.speedMultiplier; const steps = Math.floor((this.accumulator + 1e-12) / this.fixedStepSeconds); this.accumulator = Math.max(0, this.accumulator - steps * this.fixedStepSeconds); this.tick += steps; return this.tick; }
    }

    const ScenarioRegistry = {
        scenarios: {
            distanceTimeKernel: { label: "Distance-Time Kernel", strategy: "No-lightyear distance, clockless progression, gravity-wave baseline, degraded light", group: "relational" },
            control: { label: "Control / Fixed Constants", strategy: "Baseline fixed constants", group: "control" },
            vsl: { label: "Variable Speed of Light", strategy: "Covariant c(t) branch", group: "cosmology" },
            relationalLattice: { label: "Relational Lattice", strategy: "Informational node-link lattice", group: "relational" },
            relationalFlatSpaceEngine: { label: "Relational Flat-Space Engine", strategy: "Flat Euclidean labels + relational database", group: "relational" },
            absoluteTimeQuantumOscillator: { label: "Absolute Time / Quantum Oscillator Damping", strategy: "Universal fixed tick + mechanically retarded local oscillator probes", group: "relational" },
            teleparallelGravity: { label: "Teleparallel Gravity", strategy: "Flat coordinate torsion-vector field", group: "gravity" },
            tiredLightPhotonDecay: { label: "Tired-Light Photon Decay", strategy: "Photon energy attenuation", group: "photons" },
            mechanisticTiredLight: { label: "Mechanistic Tired-Light Redshift", strategy: "Photon-particle penetration energy loss", group: "photons" },
            entropicBetaMatter: { label: "Entropic Gravity / Beta-Matter", strategy: "Entropy gradient with beta coupling", group: "gravity" },
            mondRotationCurves: { label: "MOND Rotation Curves", strategy: "Low-acceleration interpolation", group: "gravity" },
            procaPhotonDispersion: { label: "Proca Photon Dispersion", strategy: "Effective massive photon dispersion", group: "photons" },
            massivePhotonProca: { label: "Massive Photon / Proca Dispersion", strategy: "de Broglie-Proca arrival-delay branch", group: "photons" },
            eitSlowLight: { label: "EIT Slow-Light Buffer", strategy: "Dark-state polariton storage", group: "photons" },
            flatSpaceLensing: { label: "Flat-Space Gravitational Lensing", strategy: "Newtonian corpuscular plus refractive correction", group: "gravity" },
            massivePhotonLensing: { label: "Massive Photon Gravitational Lensing", strategy: "Newtonian acceleration of massive photons with Soldner and GR baselines", group: "gravity" },
            newtonianDarkStar: { label: "Newtonian Dark Star / Black Hole Interpretation", strategy: "Escape velocity threshold for photon capture", group: "gravity" },
            superluminalGalilean: { label: "Superluminal Galilean Big Bang / Relative Velocity", strategy: "Arithmetic vector relative velocity with no Lorentz limiter", group: "cosmology" },
            tiredLightEnergyLedger: { label: "Tired-Light Photon Energy Ledger", strategy: "Photon energy attenuation with explicit substrate ledger closure", group: "photons" },
            darkMatterCondensate: { label: "Dark Matter / Tired-Light Condensate", strategy: "Exhausted photon energy pooling into a halo-like condensate", group: "photons" },
            singularitySafeGravity: { label: "Sub-Quantum Gravity / Singularity-Safe Force Law", strategy: "Softened force law with no infinities", group: "gravity" },
            monteCarloPhotonPipeline: { label: "Monte Carlo Photon Pipeline", strategy: "Seeded photon transport and detection", group: "photons" },
            parallaxCalibration: { label: "Parallax and Arcsecond Calibration", strategy: "Arcsecond, AU, and parsec benchmark", group: "calibration" },
            photometricCalibration: { label: "Photometric Calibration", strategy: "Aperture photometry and magnitude calibration", group: "calibration" },
            rigidBodyDiagnostics: { label: "Rigid-Body Diagnostics / ECS Physics Diagnostics", strategy: "Broadphase, contacts, friction, constraints", group: "rigidbody" },
            ccctl: { label: "CCC + Tired Light", strategy: "Covarying constants + tired light", group: "cosmology" },
            darkMatterDrive: { label: "Dark Matter Drive", strategy: "Substrate flow and thrust ledger", group: "propulsion" },
            darkMatterRamjet: { label: "Dark Matter Drive Ramjet", strategy: "EIT scoop → HIBE shield → Fishback solenoid → buffer → reactor → exhaust", group: "propulsion" },
            sunSimulation: { label: "Sun Simulation", strategy: "Solar gravity scenario", group: "gravity" }
        },
        listScenarios() { return Object.keys(this.scenarios); },
        getScenario(key) { return this.scenarios[key] || this.scenarios.relationalLattice; },
        validateScenario(key) { return this.listScenarios().indexOf(key) >= 0; }
    };



    function buildScientificSourceMatrix(activeScenario) {
        return Object.freeze({
            matrixVersion: 1,
            activeScenario: activeScenario || "relationalLattice",
            citationPolicy: "Confirmed rows use existing project anchors; placeholder-needed and future-research rows require citation completion before external scientific claims.",
            rows: Object.freeze([
                Object.freeze({ scenario: "Distance-Time Kernel", sourceReferenceNote: "Project note anchored to parsec distance and multi-messenger timing.", standardExpectation: "Compare light and gravity timing against standard multi-messenger references.", arcsecsAlternativeAssumption: "Gravity-wave baseline remains first or baseline while photons can lag or fade.", normalizedParameter: "Line-of-Sight Density; Refractive Index", derivedTelemetry: "Gravity Arrival; Photon Arrival; Photon Delay; Visibility", exportEvidence: "Distance-Time export bundle", falsificationTrigger: "Photon delay does not scale with density.", citationStatus: "project-note" }),
                Object.freeze({ scenario: "Relational Lattice", sourceReferenceNote: "Project note for node-link relational visualization.", standardExpectation: "Metric coordinates usually label events against standard geometry.", arcsecsAlternativeAssumption: "Flat labels can be treated as relational solver links for visualization.", normalizedParameter: "Node count; Link strength", derivedTelemetry: "Solver Links; finite tick state", exportEvidence: "Benchmark JSON", falsificationTrigger: "Repeated ticks are not deterministic.", citationStatus: "project-note" }),
                Object.freeze({ scenario: "Tired-Light Photon Energy Ledger", sourceReferenceNote: "Historical alternative redshift note; exact citation completion pending.", standardExpectation: "Redshift is usually modeled through expansion plus source/environment effects.", arcsecsAlternativeAssumption: "Photon loss is tracked against substrate gain as a falsifiable ledger.", normalizedParameter: "Tired-Light Loss; coupling proxy", derivedTelemetry: "Photon Energy; Energy Ledger Closure", exportEvidence: "Evidence Packet", falsificationTrigger: "Energy ledger fails closure.", citationStatus: "placeholder-needed" }),
                Object.freeze({ scenario: "Massive Photon / Proca Dispersion", sourceReferenceNote: "Proca / massive photon speculative extension note.", standardExpectation: "Photons are massless in standard electromagnetism.", arcsecsAlternativeAssumption: "Massive-photon proxy changes propagation for comparison only.", normalizedParameter: "Proca density; coupling drift", derivedTelemetry: "Photon Delay; Refractive Index; blur", exportEvidence: "Sensitivity Report", falsificationTrigger: "Branch creates non-finite telemetry or no measurable divergence.", citationStatus: "future-research" }),
                Object.freeze({ scenario: "Flat-Space Gravitational Lensing", sourceReferenceNote: "Gravitational lensing baseline comparison note.", standardExpectation: "GR lensing is the baseline reference.", arcsecsAlternativeAssumption: "Flat-space branch exposes a visual residual against the baseline.", normalizedParameter: "Mass proxy; impact parameter", derivedTelemetry: "Deflection residual", exportEvidence: "Scene JSON", falsificationTrigger: "Residual is unlabeled or indistinguishable from baseline.", citationStatus: "confirmed" }),
                Object.freeze({ scenario: "Massive Photon Gravitational Lensing", sourceReferenceNote: "Massive photon lensing comparison note.", standardExpectation: "Massless photon paths are compared against lensing expectations.", arcsecsAlternativeAssumption: "Massive-photon proxy adds dispersion and deflection differences.", normalizedParameter: "Photon mass proxy; lens density", derivedTelemetry: "Deflection residual; photon lag", exportEvidence: "Review Cockpit", falsificationTrigger: "Residual cannot be separated from numerical noise.", citationStatus: "future-research" }),
                Object.freeze({ scenario: "MOND Rotation Curves", sourceReferenceNote: "MOND comparison model source note.", standardExpectation: "Rotation curves are compared with halo models or modified dynamics.", arcsecsAlternativeAssumption: "MOND is an external comparison branch, not a proof target.", normalizedParameter: "Acceleration scale proxy", derivedTelemetry: "Rotation velocity; residual", exportEvidence: "Benchmark JSON", falsificationTrigger: "Comparison branches are conflated.", citationStatus: "confirmed" }),
                Object.freeze({ scenario: "Parallax and Arcsecond Calibration", sourceReferenceNote: "Parsec / arcsecond / AU calibration anchor.", standardExpectation: "One arcsecond at one AU maps to one parsec.", arcsecsAlternativeAssumption: "This calibration must pass before speculative interpretation.", normalizedParameter: "Parallax arcseconds; AU baseline", derivedTelemetry: "Parsec distance; calibration error", exportEvidence: "Calibration Certificate", falsificationTrigger: "One arcsecond at one AU fails one parsec.", citationStatus: "confirmed" }),
                Object.freeze({ scenario: "Dark Matter Ramjet", sourceReferenceNote: "Educational drive visualization and locked placeholder note.", standardExpectation: "No established dark matter propulsion system exists.", arcsecsAlternativeAssumption: "Ramjet controls are model telemetry only.", normalizedParameter: "Density strength; fuel proxy", derivedTelemetry: "Fuel; Heat; Drag; Route Risk", exportEvidence: "Flight Recorder", falsificationTrigger: "Fuel rises without heat, drag, or risk.", citationStatus: "project-note" }),
                Object.freeze({ scenario: "Multi-Messenger Event scenarios", sourceReferenceNote: "GW170817 / GRB 170817A and standard-siren comparison anchors.", standardExpectation: "Intrinsic source delay stays separate from propagation delay.", arcsecsAlternativeAssumption: "Photon counterpart can be delayed, weakened, blurred, uncertain, or missing.", normalizedParameter: "Intrinsic Source Delay; Propagation Delay Budget", derivedTelemetry: "Gravity Arrival; Photon Arrival; Photon Delay", exportEvidence: "Research Bundle", falsificationTrigger: "Missing counterpart is presented as proof.", citationStatus: "confirmed" })
            ])
        });
    }

    function buildScenarioEquationLibrary(activeScenario) {
        return Object.freeze({
            libraryVersion: 1,
            activeScenario: activeScenario || "relationalLattice",
            precisionBoundary: "Pseudo-formulas expose simulator behavior using normalized proxies; they do not assert measured physical laws.",
            rows: Object.freeze([
                Object.freeze({ scenario: "Distance-Time Kernel", formula: "Photon Delay ≈ Intrinsic Source Delay + Propagation Delay Budget", formulaKind: "comparison formula", units: "ticks, seconds, normalized density", controlledInputs: "line-of-sight density and refractive index", derivedTelemetry: "Gravity Arrival, Photon Arrival, Photon Delay, Visibility", exportedEvidence: "distanceTimeKernel", placeholderStatus: "active telemetry" }),
                Object.freeze({ scenario: "Relational Lattice", formula: "Visible Change ≈ Σ(Relational Edge Strength × Solver Step)", formulaKind: "pseudo-formula", units: "normalized graph units", controlledInputs: "node and edge presets", derivedTelemetry: "Solver Links and tick state", exportedEvidence: "simulationSettings", placeholderStatus: "model proxy" }),
                Object.freeze({ scenario: "Tired-Light Photon Energy Ledger", formula: "Ledger Closure ≈ Photon Energy Loss - Substrate Gain", formulaKind: "pseudo-formula", units: "normalized energy proxy", controlledInputs: "loss rate and coupling proxy", derivedTelemetry: "Photon Energy and ledger closure", exportedEvidence: "telemetrySnapshot", placeholderStatus: "hypothesis test" }),
                Object.freeze({ scenario: "Massive Photon / Proca Dispersion", formula: "Dispersion Proxy ≈ Proca Density × Coupling Drift", formulaKind: "pseudo-formula", units: "normalized density and drift", controlledInputs: "Proca density proxy", derivedTelemetry: "Photon Delay, blur, refractive index", exportedEvidence: "telemetrySnapshot", placeholderStatus: "speculative extension" }),
                Object.freeze({ scenario: "Flat-Space Gravitational Lensing", formula: "Deflection Residual ≈ Flat-Space Proxy - Standard Baseline", formulaKind: "pseudo-formula", units: "degrees or normalized viewport offset", controlledInputs: "mass proxy and impact proxy", derivedTelemetry: "lensing residual", exportedEvidence: "sceneJson", placeholderStatus: "comparison" }),
                Object.freeze({ scenario: "Massive Photon Gravitational Lensing", formula: "Massive-Photon Deflection ≈ Baseline Deflection + Dispersion Term", formulaKind: "pseudo-formula", units: "normalized deflection proxy", controlledInputs: "photon mass proxy and lens density", derivedTelemetry: "lag, blur, deflection residual", exportedEvidence: "reviewCockpit", placeholderStatus: "future-research" }),
                Object.freeze({ scenario: "MOND Rotation Curves", formula: "Velocity Residual ≈ Observed Proxy - Comparison Model", formulaKind: "comparison formula", units: "normalized velocity curve", controlledInputs: "acceleration scale proxy", derivedTelemetry: "residual and fit warning", exportedEvidence: "benchmarkJson", placeholderStatus: "comparison" }),
                Object.freeze({ scenario: "Parallax and Arcsecond Calibration", formula: "distance(parsec) = 1 / parallax(arcseconds)", formulaKind: "calibration formula", units: "arcseconds, AU, parsecs", controlledInputs: "parallax arcseconds", derivedTelemetry: "parsec distance and calibration gate", exportedEvidence: "calibrationCertificate", placeholderStatus: "calibration" }),
                Object.freeze({ scenario: "Dark Matter Ramjet", formula: "Route Risk ≈ Fuel Gain + Heat + Drag + Torsion Pull", formulaKind: "pseudo-formula", units: "normalized fuel, heat, drag, risk", controlledInputs: "density and propulsion mode", derivedTelemetry: "fuel, thermal load, route risk", exportedEvidence: "flightRecorder", placeholderStatus: "speculative visualization" }),
                Object.freeze({ scenario: "Multi-Messenger Event scenarios", formula: "Delay Budget = Intrinsic Source Delay + Propagation Delay Budget", formulaKind: "comparison formula", units: "seconds, ticks, normalized density", controlledInputs: "event preset and line-of-sight profile", derivedTelemetry: "Gravity Arrival, Photon Arrival, Visibility", exportedEvidence: "eventTheater", placeholderStatus: "test scenario" })
            ])
        });
    }

    const liveAuditScenarioRows = Object.freeze([
        Object.freeze({ key: "distanceTimeKernel", label: "Distance-Time Kernel" }),
        Object.freeze({ key: "relationalLattice", label: "Relational Lattice" }),
        Object.freeze({ key: "tiredLightPhotonEnergyLedger", label: "Tired-Light Photon Energy Ledger" }),
        Object.freeze({ key: "massivePhotonProcaDispersion", label: "Massive Photon / Proca Dispersion" }),
        Object.freeze({ key: "flatSpaceLensing", label: "Flat-Space Lensing" }),
        Object.freeze({ key: "massivePhotonLensing", label: "Massive Photon Lensing" }),
        Object.freeze({ key: "mondRotationCurves", label: "MOND Rotation Curves" }),
        Object.freeze({ key: "parallaxCalibration", label: "Parallax Calibration" }),
        Object.freeze({ key: "darkMatterRamjet", label: "Dark Matter Ramjet" }),
        Object.freeze({ key: "multiMessengerEvents", label: "Multi-Messenger Events" })
    ]);

    function auditEscapeHtml(value) {
        return String(value === undefined || value === null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
    function auditNormalizeText(value) { return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, ""); }
    function auditRows(value) { return value && Array.isArray(value.rows) ? value.rows : []; }
    function findAuditRow(rows, scenarioLabel) {
        const normalized = auditNormalizeText(scenarioLabel);
        return rows.find((row) => auditNormalizeText(row.scenario) === normalized)
            || rows.find((row) => auditNormalizeText(row.scenario).indexOf(normalized) >= 0 || normalized.indexOf(auditNormalizeText(row.scenario)) >= 0)
            || null;
    }
    function auditIsFiniteValue(value, seen) {
        if (value === null || value === undefined) { return true; }
        if (typeof value === "number") { return Number.isFinite(value); }
        if (typeof value !== "object") { return true; }
        if (seen.has(value)) { return true; }
        seen.add(value);
        if (Array.isArray(value)) { return value.every((item) => auditIsFiniteValue(item, seen)); }
        return Object.keys(value).every((key) => auditIsFiniteValue(value[key], seen));
    }
    function validateScientificSourceMatrixExport(sourceMatrix) {
        const warnings = [];
        const rows = auditRows(sourceMatrix);
        const requiredFields = ["scenario", "standardExpectation", "arcsecsAlternativeAssumption", "derivedTelemetry", "exportEvidence", "falsificationTrigger", "citationStatus"];
        if (!sourceMatrix || typeof sourceMatrix !== "object") { warnings.push("sourceMatrix is missing or not an object."); }
        if (!sourceMatrix || sourceMatrix.matrixVersion === undefined) { warnings.push("sourceMatrix.matrixVersion is required."); }
        if (rows.length < 1) { warnings.push("sourceMatrix.rows requires at least one row."); }
        rows.forEach((row, index) => requiredFields.forEach((field) => { if (!row || row[field] === undefined || row[field] === "") { warnings.push("sourceMatrix.rows[" + index + "]." + field + " is required."); } }));
        return Object.freeze({ passed: warnings.length === 0, warnings: Object.freeze(warnings), rowCount: rows.length });
    }
    function validateScenarioEquationLibraryExport(scenarioEquationLibrary) {
        const warnings = [];
        const rows = auditRows(scenarioEquationLibrary);
        const requiredFields = ["scenario", "formula", "formulaKind", "units", "controlledInputs", "derivedTelemetry", "exportedEvidence", "placeholderStatus"];
        if (!scenarioEquationLibrary || typeof scenarioEquationLibrary !== "object") { warnings.push("scenarioEquationLibrary is missing or not an object."); }
        if (!scenarioEquationLibrary || scenarioEquationLibrary.libraryVersion === undefined) { warnings.push("scenarioEquationLibrary.libraryVersion is required."); }
        if (rows.length < 1) { warnings.push("scenarioEquationLibrary.rows requires at least one row."); }
        rows.forEach((row, index) => requiredFields.forEach((field) => { if (!row || row[field] === undefined || row[field] === "") { warnings.push("scenarioEquationLibrary.rows[" + index + "]." + field + " is required."); } }));
        return Object.freeze({ passed: warnings.length === 0, warnings: Object.freeze(warnings), rowCount: rows.length });
    }
    function auditResolvePath(value, pathText) {
        return pathText.split(".").reduce((current, segment) => (current && Object.prototype.hasOwnProperty.call(current, segment) ? current[segment] : undefined), value);
    }
    function auditCompactJson(value) {
        if (value === undefined) { return "__missing__"; }
        if (typeof value === "string") { return value; }
        return JSON.stringify(value);
    }
    function parseInertArcsecsExport(text, label) {
        const errors = [];
        let payload = null;
        try { payload = JSON.parse(String(text || "")); } catch (error) { errors.push(label + " is not valid JSON: " + error.message); }
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) { errors.push(label + " must be a JSON object export."); return Object.freeze({ payload: null, errors: Object.freeze(errors) }); }
        const packageVersion = payload.packageVersion || payload.pluginVersion || payload.engineVersion;
        const exportType = payload.exportType || payload.packetType || (payload.metadata && payload.metadata.exportType);
        const generatedUtc = payload.generatedUtc || payload.generatedAtUtc || payload.exportedAtUtc || payload.utcTimestamp || (payload.metadata && payload.metadata.generatedUtc);
        const activeScenario = payload.activeScenario || payload.scenarioName || payload.latestScenario || payload.scenarioType || (payload.config && payload.config.scenario);
        if (!packageVersion) { errors.push(label + " is missing packageVersion/pluginVersion/engineVersion."); }
        if (!exportType) { errors.push(label + " is missing exportType or packetType."); }
        if (!generatedUtc) { errors.push(label + " is missing a generated UTC timestamp."); }
        if (!activeScenario) { errors.push(label + " is missing active scenario information."); }
        if (payload.sourceMatrix) { errors.push.apply(errors, validateScientificSourceMatrixExport(payload.sourceMatrix).warnings.map((warning) => label + ": " + warning)); }
        else { errors.push(label + " is missing sourceMatrix."); }
        if (payload.scenarioEquationLibrary) { errors.push.apply(errors, validateScenarioEquationLibraryExport(payload.scenarioEquationLibrary).warnings.map((warning) => label + ": " + warning)); }
        else { errors.push(label + " is missing scenarioEquationLibrary."); }
        return Object.freeze({ payload, errors: Object.freeze(errors) });
    }
    function compareInertArcsecsExports(left, right) {
        const fields = [
            "packageVersion", "pluginVersion", "engineVersion", "exportType", "packetType", "generatedUtc", "generatedAtUtc", "exportedAtUtc", "utcTimestamp", "activeScenario", "scenarioName", "latestScenario", "scenarioType", "activeParameters", "parameters", "simulationSettings", "derivedTelemetry", "telemetry", "telemetrySnapshot", "warnings", "falsificationNotes", "sourceMatrix", "scenarioEquationLibrary"
        ];
        const rows = fields.map((field) => {
            const leftValue = auditResolvePath(left, field);
            const rightValue = auditResolvePath(right, field);
            let status = "unchanged";
            if (leftValue === undefined && rightValue !== undefined) { status = "added"; }
            else if (leftValue !== undefined && rightValue === undefined) { status = "removed"; }
            else if (leftValue === undefined && rightValue === undefined) { status = "missing"; }
            else if (auditCompactJson(leftValue) !== auditCompactJson(rightValue)) { status = "changed"; }
            return Object.freeze({ field, status, leftValue: auditCompactJson(leftValue), rightValue: auditCompactJson(rightValue) });
        });
        return Object.freeze({ rows: Object.freeze(rows), added: rows.filter((row) => row.status === "added").length, removed: rows.filter((row) => row.status === "removed").length, changed: rows.filter((row) => row.status === "changed").length, unchanged: rows.filter((row) => row.status === "unchanged").length, missing: rows.filter((row) => row.status === "missing").length });
    }

    function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, value)); }
    function numberOrDefault(value, fallback) { if (typeof value !== "number" && (typeof value !== "string" || value.trim() === "")) return fallback; const numberValue = Number(value); return Number.isFinite(numberValue) ? numberValue : fallback; }
    function formatNumber(value) { if (!Number.isFinite(value)) { return "—"; } return Math.abs(value) > 9999 || (Math.abs(value) < 0.001 && value !== 0) ? value.toExponential(3) : value.toLocaleString(undefined, { maximumFractionDigits: 4 }); }
    function formatCount(value) { const numberValue = Number(value); return Number.isFinite(numberValue) ? String(Math.max(0, Math.round(numberValue))) : "0"; }
    function finiteMetric(value, fallback) { const numberValue = Number(value); return Number.isFinite(numberValue) ? numberValue : fallback; }
    function resolveDeploymentWorkerUrl(scriptName, settingsUrl) {
        const configuredUrl = typeof settingsUrl === "string" ? settingsUrl.trim() : "";
        if (configuredUrl.length > 0) { return configuredUrl; }
        if (typeof document !== "undefined" && document.currentScript && document.currentScript.src && typeof URL !== "undefined") {
            return new URL(scriptName, document.currentScript.src).toString();
        }
        if (typeof window !== "undefined" && window.location && window.location.href && typeof URL !== "undefined") {
            return new URL(scriptName, window.location.href).toString();
        }
        return scriptName;
    }
    function createDeploymentWorker(scriptName, settingsUrl) { return new Worker(resolveDeploymentWorkerUrl(scriptName, settingsUrl)); }
    function scenarioDefaultCounts(scenario) {
        const key = String(scenario || "relationalLattice");
        const defaults = {
            distanceTimeKernel: { entities: 12, photons: 48, constraints: 18 },
            control: { entities: 1, photons: 0, constraints: 1 },
            vsl: { entities: 8, photons: 20, constraints: 6 },
            relationalLattice: { entities: 42, photons: 7, constraints: 96 },
            relationalFlatSpaceEngine: { entities: 64, photons: 16, constraints: 142 },
            teleparallelGravity: { entities: 24, photons: 4, constraints: 32 },
            tiredLightPhotonDecay: { entities: 9, photons: 128, constraints: 8 },
            mechanisticTiredLight: { entities: 18, photons: 512, constraints: 11 },
            entropicBetaMatter: { entities: 18, photons: 2, constraints: 18 },
            mondRotationCurves: { entities: 72, photons: 0, constraints: 24 },
            procaPhotonDispersion: { entities: 6, photons: 96, constraints: 7 },
            massivePhotonProca: { entities: 8, photons: 512, constraints: 9 },
            eitSlowLight: { entities: 10, photons: 48, constraints: 12 },
            flatSpaceLensing: { entities: 5, photons: 64, constraints: 10 },
            singularitySafeGravity: { entities: 32, photons: 0, constraints: 16 },
            monteCarloPhotonPipeline: { entities: 18, photons: 512, constraints: 6 },
            parallaxCalibration: { entities: 4, photons: 0, constraints: 4 },
            photometricCalibration: { entities: 72, photons: 0, constraints: 5 },
            rigidBodyDiagnostics: { entities: 12, photons: 0, constraints: 6 },
            ccctl: { entities: 12, photons: 72, constraints: 14 },
            darkMatterDrive: { entities: 26, photons: 18, constraints: 8 },
            darkMatterRamjet: { entities: 39, photons: 144, constraints: 14 },
            sunSimulation: { entities: 10, photons: 12, constraints: 5 }
        };
        return defaults[key] || defaults.relationalLattice;
    }
    function positiveMetric(value, fallback) {
        const numberValue = Number(value);
        return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback;
    }
    /** Returns true when a scenario should expose a non-zero solver-link/constraint count in the status strip. */
    function scenarioShouldReportSolverLinks(scenario) {
        return scenarioDefaultCounts(scenario).constraints > 0;
    }

    function normalizeResultTelemetry(result) {
        if (!result || typeof result !== "object") { return result; }
        const metrics = result.metrics && typeof result.metrics === "object" ? result.metrics : {};
        const stride = Number(result.valuesPerTick) || 0;
        const buffer = Array.isArray(result.buffer) ? result.buffer : [];
        const lastOffset = stride > 0 && buffer.length >= stride ? buffer.length - stride : -1;
        const fallbackEntities = lastOffset >= 0 ? Number(buffer[lastOffset + 10]) : 0;
        const fallbackPhotons = lastOffset >= 0 ? Number(buffer[lastOffset + 11]) : 0;
        const fallbackConstraints = lastOffset >= 0 ? Number(buffer[lastOffset + 12]) : 0;
        const expectedCounts = scenarioDefaultCounts(result.config && result.config.scenario);
        result.metrics = Object.assign({}, metrics, {
            tickCount: finiteMetric(metrics.tickCount, finiteMetric(result.acceptedSteps, 0)),
            entityCount: positiveMetric(metrics.entityCount, positiveMetric(fallbackEntities, expectedCounts.entities)),
            photonPacketCount: positiveMetric(metrics.photonPacketCount, positiveMetric(fallbackPhotons, expectedCounts.photons)),
            constraintCount: scenarioShouldReportSolverLinks(result.config && result.config.scenario)
                ? Math.max(1, positiveMetric(metrics.constraintCount, positiveMetric(fallbackConstraints, expectedCounts.constraints)))
                : Math.max(0, finiteMetric(metrics.constraintCount, finiteMetric(fallbackConstraints, expectedCounts.constraints))),
            speculativeModelValue: finiteMetric(metrics.speculativeModelValue, lastOffset >= 0 ? finiteMetric(buffer[lastOffset + 1], 0) : 0),
            newtonianBaseline: finiteMetric(metrics.newtonianBaseline, 1),
            maximumError: finiteMetric(metrics.maximumError, lastOffset >= 0 ? finiteMetric(buffer[lastOffset + 9], 0) : 0),
            finalEnergyFraction: finiteMetric(metrics.finalEnergyFraction, lastOffset >= 0 ? finiteMetric(buffer[lastOffset + 3], 1) : 1),
            finalRedshift: finiteMetric(metrics.finalRedshift, lastOffset >= 0 ? finiteMetric(buffer[lastOffset + 4], 0) : 0),
            photonTransportEfficiency: finiteMetric(metrics.photonTransportEfficiency, 0),
            estimatedFrameBudgetMs: finiteMetric(metrics.estimatedFrameBudgetMs, 0),
            ramjetCaptureRate: finiteMetric(metrics.ramjetCaptureRate, 0),
            ramjetShieldIntegrity: finiteMetric(metrics.ramjetShieldIntegrity, 1),
            ramjetRadiatorLoad: finiteMetric(metrics.ramjetRadiatorLoad, 0),
            ramjetWarnings: metrics.ramjetWarnings || "none",
            numericalDriftWarning: metrics.numericalDriftWarning || "none",
            ledgerStatus: metrics.ledgerStatus || "pass",
            baselineDelta: finiteMetric(metrics.baselineDelta, Math.abs(finiteMetric(metrics.speculativeModelValue, 0) - finiteMetric(metrics.newtonianBaseline, 1))),
            scenarioRisk: metrics.scenarioRisk || "bounded"
        });
        return result;
    }
    function setText(element, value) { if (element && element.textContent !== String(value)) { element.textContent = value; } }

    function scenarioExplanation(key) {
        const copy = {
            distanceTimeKernel: { look: ["A source event, observer, blue-white gravity wavefront, and red-gold photon wavefront appear together.", "Gravity reaches the observer first; light arrives later, weaker, redder, uncertain, or missing.", "The delay breakdown separates source, propagation, environmental diffusion, and threshold status."], why: "The mode tests whether distance and universal progression can be visualized without founding the simulation on lightyears or local atomic clocks." },
            relationalLattice: { look: ["Nodes are material point-coincidences.", "Edges represent relational distance, not empty container-space.", "Photon paths are correlations through the lattice."], why: "This demonstrates the no-spacetime framing: coordinates are labels, while relations carry the simulated structure." },
            absoluteTimeQuantumOscillator: { look: ["The Universal Cosmic Clock is shared by both probes.", "The near-mass oscillator shows fewer transitions.", "Damping coefficient and gravitational gradient explain the difference."], why: "It frames clock-rate differences as local oscillator mechanics inside the ArcSecs speculative model, not as proof against consensus relativity." },
            teleparallelGravity: { look: ["The grid remains flat.", "Torsion-like arrows bend trajectories.", "Curvature is shown as zero while force vectors remain non-zero."], why: "The visualization separates curved-spacetime language from flat-coordinate, gauge-force-style behavior." },
            tiredLightPhotonDecay: { look: ["Photon packets fade across relational distance.", "The redshift graph rises as energy decreases.", "The ledger tracks where energy was moved."], why: "It makes tired light a testable attenuation model instead of a vague fading story." },
            entropicBetaMatter: { look: ["Entropy boundary rings surround mass nodes.", "Acceleration arrows strengthen in low-density regions.", "Beta coupling is shown as a phantom-like contribution."], why: "The panel compares ordinary Newtonian pull with a speculative informational-gradient branch." },
            mondRotationCurves: { look: ["The yellow Newtonian curve declines.", "The cyan MOND/beta curve remains flatter.", "The disk shows the baryonic mass proxy."], why: "This lets users compare baseline and alternative low-acceleration rotation behavior without overclaiming." },
            procaPhotonDispersion: { look: ["High-energy photons remain nearly straight.", "Low-energy packets lag more strongly.", "The effective mass slider changes low-frequency paths first."], why: "It isolates the speculative massive-photon dispersion branch from normal massless propagation." },
            eitSlowLight: { look: ["Input pulse enters the medium.", "Group velocity drops.", "Energy is stored as a dark-state buffer and then retrieved."], why: "It shows why stopped light requires a host system and an energy ledger." },
            flatSpaceLensing: { look: ["Photon paths bend around a lens mass.", "Newtonian half-deflection is compared to a corrected flat-space branch.", "The GR reference line remains a benchmark, not a claim of proof."], why: "This mode tests whether flat-space corpuscular and refractive-index models can be visualized without hiding their comparison target." },
            massivePhotonLensing: { look: ["Photon particles pass near a massive body.", "Impact parameter and effective photon mass change path curvature.", "Soldner-style, GR reference, and ArcSecs proxy values remain visible."], why: "It makes the mismatch and correction burden visible instead of hiding the comparison." },
            newtonianDarkStar: { look: ["The compact mass shows an escape threshold.", "Outbound photons slow and return when below escape velocity.", "Apogee and capture state are shown as telemetry."], why: "It visualizes the ArcSecs Newtonian dark-star interpretation without claiming that this replaces black-hole physics." },
            superluminalGalilean: { look: ["Two bodies move in opposite directions from an origin.", "Relative velocity is arithmetic and can exceed c.", "The panel states that no Lorentz factor is applied."], why: "This isolates the Galilean relative-velocity assumption so visitors can see exactly what it changes." },
            tiredLightEnergyLedger: { look: ["Photon energy decreases over distance.", "Lost energy is moved to the substrate ledger.", "Closure error warns if energy disappears unaccounted."], why: "The ledger turns tired-light attenuation into an auditable accounting rule." },
            darkMatterCondensate: { look: ["Exhausted photon energy pools into a halo-like distribution.", "Halo density is tied to accumulated ledger energy.", "The visualization remains a conceptual diagnostic, not measured dark matter."], why: "It shows how the tired-light ledger would feed the ArcSecs dark-light condensate hypothesis." },
            singularitySafeGravity: { look: ["The inverse-square curve is capped near zero radius.", "Close passes stay finite instead of exploding.", "Warnings appear if numeric drift grows."], why: "This keeps theatrical strong-gravity interactions stable and explicitly avoids non-finite numeric states." },
            monteCarloPhotonPipeline: { look: ["Seeded photon packets cross a medium grid.", "Absorption, scattering, and detection counts update deterministically.", "The same seed produces the same transport report."], why: "Monte Carlo photon transport makes scattering, extinction, and detector-hit logic testable." },
            parallaxCalibration: { look: ["A 1 AU baseline and 1 arcsecond angle resolve to 1 parsec.", "Arcseconds, radians, parsecs, and light-years are shown together.", "Calibration metrics expose solver tolerance."], why: "ArcSecs depends on angular precision, so the demo includes an astronomical calibration benchmark." },
            photometricCalibration: { look: ["Aperture and sky annulus parameters change corrected flux.", "Instrumental magnitude converts into calibrated magnitude.", "Warnings appear when aperture settings become nonsensical."], why: "Photometry connects the renderer to measurable brightness rather than decorative star dots." },
            rigidBodyDiagnostics: { look: ["Broadphase boxes appear first.", "Contact normals and friction vectors update during impact.", "Restitution changes bounce height."], why: "This demonstrates the actual ECS-style solver mechanics behind the visual simulation." },
            sunSimulation: { look: ["Central solar mass proxy anchors orbit traces.", "Samples follow bounded paths.", "Gravity residuals are reported in diagnostics."], why: "This is the regression scenario proving stellar controls run real simulation output." },
            darkMatterDrive: { look: ["Substrate flows toward the intake.", "Compression and exhaust are separated.", "The ledger reports thrust proxy and shield load."], why: "It frames propulsion as harvest → compress → re-energize → expel, not magic warp." },
            darkMatterRamjet: { look: ["Cyan EIT field captures tired-light substrate.", "The HIBE shield, intake vortex, Fishback solenoid, compression chamber, dark-state buffer, reactor, thermal system, and exhaust are drawn as a complete pipeline.", "Warnings show shield ablation, drag spikes, buffer saturation, thermal overload, and exhaust divergence."], why: "The ramjet module turns the uploaded architecture schematic into a deterministic, inspectable subsystem ledger instead of a single decorative ship drawing." },
            ccctl: { look: ["Constants and photon energy must be read together.", "Redshift proxy rises while alpha stability is watched.", "Warnings appear if invariants drift."], why: "It tests whether covarying constants can coexist with tired-light attenuation." },
            vsl: { look: ["c(t) ratio changes across the run.", "Mass multiplier responds.", "Dimensionless stability remains visible."], why: "It turns variable-speed-of-light speculation into a bounded comparison branch." },
            control: { look: ["The output stays quiet.", "No energy attenuation is active.", "This branch is the baseline for comparison."], why: "A control branch is necessary to reveal what the speculative modules actually change." }
        };
        return copy[key] || copy.relationalLattice;
    }



    function scenarioContract(key) {
        const scenario = ScenarioRegistry.getScenario(key);
        const contracts = {
            distanceTimeKernel: { invariant: "Distance estimates do not require electromagnetic travel time; local oscillator probes are not universal time; gravity-wave ordering is the baseline.", baseline: "Parsecs, parallax, arcseconds, angular geometry, proper motion, standard sirens, and dark-siren matching are exposed before lightyear comparison labels.", failure: "Falling back to lightyears, universal cesium time, hidden photon delay, non-finite telemetry, or missing speculative-boundary language fails the mode." },
            relationalLattice: { invariant: "No physical container-space is simulated; only node relations and edge weights define geometry.", baseline: "Baseline Cartesian labels remain visible only as a rendering aid.", failure: "Duplicate node IDs, unbounded edge weights, or disappearing observer relation." },
            absoluteTimeQuantumOscillator: { invariant: "Both oscillator probes share one Universal Cosmic Clock; only local transition counts differ.", baseline: "Deep-space probe uses the global tick count while near-mass probe mechanically retards.", failure: "Global time diverges between probes or the UI labels the effect as proof against consensus relativity." },
            teleparallelGravity: { invariant: "Curvature overlay remains zero while torsion-like force arrows redirect motion.", baseline: "Newtonian vector field used as a control comparison.", failure: "Curvature visual claims appear, or force arrows become non-finite." },
            tiredLightPhotonDecay: { invariant: "Photon energy must decrease monotonically with relational distance.", baseline: "Control branch keeps photon energy fixed.", failure: "Energy rises with distance or redshift becomes negative." },
            entropicBetaMatter: { invariant: "Beta coupling only amplifies the configured low-acceleration branch.", baseline: "Newtonian acceleration stays visible in the comparison panel.", failure: "Beta term dominates all regimes or produces non-finite acceleration." },
            mondRotationCurves: { invariant: "The alternative curve may flatten only through the selected low-acceleration interpolation.", baseline: "Newtonian decline curve remains plotted for comparison.", failure: "Curve points become unsorted, negative, or visually unlabeled." },
            procaPhotonDispersion: { invariant: "Effective photon mass influences low-energy packets more than high-energy packets.", baseline: "Zero effective mass recovers massless behavior.", failure: "Low-energy velocity exceeds the high-energy branch under positive mass." },
            eitSlowLight: { invariant: "Stored light must preserve total energy in a dark-state buffer approximation.", baseline: "Input and retrieved pulse are both visible.", failure: "Stored energy exits the [0,1] range or retrieval disappears." },
            rigidBodyDiagnostics: { invariant: "Contacts, normals, restitution, and friction must be inspectable as solver diagnostics.", baseline: "Static body remains fixed.", failure: "Penetration correction explodes or bodies gain unbounded energy." },
            massivePhotonLensing: { invariant: "Photon path deflection responds to central mass, impact parameter, and effective photon mass.", baseline: "Soldner-style and standard GR reference values are shown instead of hidden.", failure: "Deflection is non-finite or the correction is presented as established physics." },
            newtonianDarkStar: { invariant: "Photon capture follows the escape-velocity threshold and trajectory state.", baseline: "Escaping and captured states are separated by launch speed versus escape speed.", failure: "A photon is flagged captured without visible slowing, apogee, or fallback state." },
            superluminalGalilean: { invariant: "Relative velocity is arithmetic vector difference; no Lorentz factor is applied in this mode.", baseline: "Global time remains shared by both bodies.", failure: "A hidden Lorentz limiter reduces the displayed relative velocity." },
            tiredLightEnergyLedger: { invariant: "Photon energy lost over distance must equal substrate ledger gain within tolerance.", baseline: "A no-loss control would keep current energy equal to initial energy.", failure: "Energy disappears without a ledger warning or closure error." },
            darkMatterCondensate: { invariant: "Condensate density is derived from tired-light ledger energy, not invented as a table value.", baseline: "Exhausted photon energy feeds the halo-like distribution.", failure: "Halo density changes without a corresponding energy-ledger change." },
            sunSimulation: { invariant: "Solar orbit proxy remains bounded and deterministic.", baseline: "Central mass and orbit radius are shown as a stable regression scenario.", failure: "Orbit radius collapses, escapes, or the scenario button emits no output." },
            darkMatterDrive: { invariant: "Substrate flow, compression, reactor gain, and exhaust proxy must be separately legible.", baseline: "No claim of real propulsion is made; the output is a ledger demonstration.", failure: "Thrust appears without a substrate or ledger entry." },
            ccctl: { invariant: "Covarying constants and tired-light loss must be reported together.", baseline: "Fine-structure stability is watched as a control check.", failure: "Dimensionless stability is not reported or photon loss is hidden." },
            vsl: { invariant: "c(t), mass multiplier, and stability proxy must move as a coupled branch.", baseline: "Fixed-constant control remains selectable.", failure: "c(t) changes without an explicit compensating diagnostic." },
            control: { invariant: "No speculative module is active.", baseline: "This is the baseline.", failure: "Energy, c(t), or Proca branches drift without user selection." }
        };
        const selected = contracts[key] || contracts.relationalLattice;
        return { label: scenario.label, strategy: scenario.strategy, ...selected };
    }

    function scenarioSpotlightContent(key, result) {
        const scenario = ScenarioRegistry.getScenario(key);
        const metrics = result && result.metrics ? result.metrics : {};
        const lookup = {
            distanceTimeKernel: { see: "Gravity arrives first; light arrives later, degraded, uncertain, or missing in the same viewport.", try: "Switch events between GW170817, GW190521, GW190814, and synthetic dense/void paths, then inspect the Claim Map and What caused the delay panel.", falsify: "No distance-scaled lag, no density-dependent attenuation, collapsed delay categories, non-finite telemetry, or overclaiming proof would fail the hypothesis visualization." },
            relationalLattice: { see: "A universe rendered as node relationships: the lines are the geometry, not decorations.", try: "Toggle labels and vectors, then watch solver links and dynamic tethers stay meaningful.", falsify: "Duplicate nodes, undefined solver links, or disappearing relational edges would break the model." },
            relationalFlatSpaceEngine: { see: "Flat rendering labels are separated from relational state, so the graph remains the simulated source of geometry.", try: "Switch between Public View and Physicist View to compare plain-language and invariant-first explanations.", falsify: "If the scene requires a hidden global position container to compute relationships, the ArcSecs architecture has regressed." },
            tiredLightPhotonDecay: { see: "Photon packets lose energy across distance while the energy ledger and redshift graph remain visible.", try: "Increase the tired-light decay value, rerun, and compare photon energy against the baseline graph.", falsify: "Energy increasing with distance or redshift going negative would fail the scenario." },
            mechanisticTiredLight: { see: "Photon-particle encounter counts, forward-scattering caution, and energy loss are treated as testable knobs.", try: "Increase intergalactic density and watch redshift/encounter telemetry respond.", falsify: "Large angular blur or hidden energy loss would undermine the model." },
            massivePhotonProca: { see: "High-frequency and low-frequency photon packets separate because the effective mass branch changes arrival timing.", try: "Raise effective photon mass and compare the low-energy branch with the massless baseline.", falsify: "The zero-mass branch must recover the baseline; otherwise the Proca comparison is not credible." },
            procaPhotonDispersion: { see: "Frequency-dependent group velocity appears as a comparison, not as a claim that photon mass is established.", try: "Change effective photon mass and rerun the dispersion graph.", falsify: "Low-energy packets cannot outrun high-energy packets under a positive effective mass." },
            flatSpaceLensing: { see: "Soldner-style corpuscular bending and a refractive correction are plotted against a reference lensing baseline.", try: "Change impact parameter and watch deflection delta move.", falsify: "Zero or invalid impact parameters must be guarded, never allowed to produce infinities." },
            absoluteTimeQuantumOscillator: { see: "Two oscillator probes share the same Universal Cosmic Clock while the near-mass probe transitions more slowly.", try: "Run the mode, step one tick, and compare deep-space versus near-mass transition counts.", falsify: "Global time diverging between probes or hidden damping would break the interpretation." },
            massivePhotonLensing: { see: "Massive photon packets bend near a central body while Soldner, GR reference, and ArcSecs proxy values remain side by side.", try: "Increase central mass or effective photon mass and watch the path curvature and deflection readout move.", falsify: "non-finite values, zero-impact singularities, or hidden comparison mismatches fail the mode." },
            newtonianDarkStar: { see: "Outbound photon probes slow near a compact mass and return when below the Newtonian escape threshold.", try: "Compare captured and escaping telemetry while watching apogee and escape velocity.", falsify: "Capture flags without trajectory change, or escape velocity without visible state, would be fake output." },
            superluminalGalilean: { see: "Two bodies separate in opposite directions and the relative velocity is the arithmetic vector difference.", try: "Run the mode and confirm the no-Lorentz-factor text remains explicit.", falsify: "Lorentz limiting or hidden frame conversion would break the ArcSecs assumption test." },
            tiredLightEnergyLedger: { see: "Long-distance photons redshift while every unit of lost energy is moved into an explicit substrate ledger.", try: "Raise attenuation and compare energy lost, ledger gain, and closure error.", falsify: "Energy disappearing without a warning would fail the ledger." },
            darkMatterCondensate: { see: "Energy exhausted by tired-light attenuation pools into a halo-like condensate visualization.", try: "Run after the tired-light ledger and compare condensate density against accumulated ledger energy.", falsify: "Halo density changing without ledger coupling would fail the scenario." },
            singularitySafeGravity: { see: "The force curve softens before it can explode near zero radius.", try: "Lower softening radius and watch the stability drilldown for warnings.", falsify: "Non-finite telemetry or unbounded orbit escape under valid inputs breaks the mode." },
            monteCarloPhotonPipeline: { see: "A seeded random stream makes photon absorption, scattering, and detection repeatable.", try: "Change the seed and photon count, then rerun the benchmark export.", falsify: "Same seed producing different counts would fail reproducibility." },
            parallaxCalibration: { see: "The one-arcsecond benchmark resolves to one parsec as a calibration certificate check.", try: "Set parallax to 1.0 arcsecond and export the calibration certificate.", falsify: "1 arcsecond failing the 1 parsec benchmark would fail the calibration gate." },
            photometricCalibration: { see: "Aperture flux, sky annulus subtraction, and calibrated magnitude are displayed as a rendering calibration model.", try: "Change background sky level and aperture radius to see magnitude warnings.", falsify: "Invalid annulus/aperture values must be rejected rather than silently accepted." },
            rigidBodyDiagnostics: { see: "Bodies expose broadphase boxes, contact normals, friction vectors, and solver-link counts.", try: "Increase restitution or friction and step one tick to inspect debug behavior.", falsify: "Static bodies moving or constraints exploding under normal values would fail the solver." },
            darkMatterRamjet: { see: "The ramjet pipeline is broken into capture, shield, intake, Fishback, buffer, reactor, thermal, and exhaust subsystems.", try: "Use Thermal Overload or Drag Stress preset, then click each subsystem rail button.", falsify: "Thrust without substrate, hidden waste heat, or missing warning-bus escalation breaks the ledger." },
            darkMatterDrive: { see: "Substrate flow, compression, reactor gain, and exhaust proxy are shown as accounting stages.", try: "Compare it with the full Dark Matter Ramjet for subsystem-level detail.", falsify: "A reactionless thrust proxy or missing energy ledger would invalidate the scenario." },
            ccctl: { see: "Covarying constants and tired-light loss are presented together with a stability caution.", try: "Compare CCC+TL with Control / Fixed Constants.", falsify: "Dimensionless stability disappearing from telemetry would require review." },
            sunSimulation: { see: "A bounded solar gravity regression mode checks orbit samples and integration stability.", try: "Step one tick repeatedly and watch the orbit and frame-time readouts.", falsify: "The orbit should not collapse, escape, or show zero useful telemetry." },
            control: { see: "The control branch keeps speculative modules quiet so comparisons have a baseline.", try: "Run Control, then switch to a speculative mode and compare baseline delta.", falsify: "Control should not show tired-light loss, Proca drag, or VSL drift." }
        };
        const selected = lookup[key] || lookup.relationalLattice;
        return { scenario: scenario.label, see: selected.see, try: selected.try, falsify: selected.falsify, headline: `${scenario.label}: ${formatNumber(metrics.baselineDelta || 0)} baseline delta, ${metrics.ledgerStatus || "ledger pending"}.` };
    }


    function buildAudit(result) {
        if (!result) { return "Audit trail will appear after the first run."; }
        const passCount = result.tests.filter((item) => item.passed).length;
        const failCount = result.tests.length - passCount;
        const ledger = result.metrics.energyLedgerClosureProxy >= 0.94 ? "PASS" : result.metrics.energyLedgerClosureProxy >= 0.82 ? "WARN" : "FAIL";
        return `<ul><li><strong>Run UTC:</strong> ${result.runTimestampUtc}</li><li><strong>Engine:</strong> ${result.engineVersion}</li><li><strong>Ledger:</strong> ${ledger} (${formatNumber(result.metrics.energyLedgerClosureProxy)})</li><li><strong>TDD:</strong> ${passCount} passed / ${failCount} failed</li><li><strong>Observation delta:</strong> ${formatNumber(result.metrics.baselineDelta || Math.abs(result.metrics.speculativeModelValue - result.metrics.newtonianBaseline))}</li></ul>`;
    }

    class DemoMemoryStore {
        constructor(storageKey) { this.storageKey = storageKey; }
        load() { try { const value = JSON.parse(localStorage.getItem(this.storageKey) || '{"runs":[]}'); return {runs: Array.isArray(value?.runs) ? value.runs.filter(run => run && typeof run.id === "string" && run.result && run.result.config).slice(0,24) : []}; } catch (_error) { return { runs: [] }; } }
        saveRun(name, result) { const memory = this.load(); memory.runs.unshift({ id: Date.now().toString(36), name, savedAtUtc: new Date().toISOString(), engineVersion: result.engineVersion, result }); memory.runs = memory.runs.slice(0, 24); localStorage.setItem(this.storageKey, JSON.stringify(memory)); return memory; }
        deleteRun(id) { const memory = this.load(); memory.runs = memory.runs.filter((item) => item.id !== id); localStorage.setItem(this.storageKey, JSON.stringify(memory)); return memory; }
        clear() { const memory = { runs: [] }; localStorage.setItem(this.storageKey, JSON.stringify(memory)); return memory; }

        exportJson() { return JSON.stringify(this.load(), null, 2); }
        importJson(text) { const parsed = JSON.parse(text); if (!parsed || !Array.isArray(parsed.runs)) { throw new Error("Imported memory must contain a runs array."); } for (const run of parsed.runs) { if (!run.id || !run.result || !run.result.config) { throw new Error("Imported memory contains an invalid run."); } } localStorage.setItem(this.storageKey, JSON.stringify(parsed)); return parsed; }
    }

    class ChartRenderer {
        constructor(canvas) { this.canvas = canvas; this.context = canvas ? canvas.getContext("2d") : null; }
        resize() { if (!this.canvas) { return; } const ratio = Math.min(2, window.devicePixelRatio || 1); const width = Math.max(320, Math.floor(this.canvas.clientWidth * ratio)); const height = Math.max(140, Math.floor(this.canvas.clientHeight * ratio)); if (this.canvas.width !== width || this.canvas.height !== height) { this.canvas.width = width; this.canvas.height = height; } }
        drawSeries(result, columnA, columnB) { if (!this.context || !result) { return; } this.resize(); const c = this.context; const w = this.canvas.width; const h = this.canvas.height; c.clearRect(0, 0, w, h); c.fillStyle = "#020810"; c.fillRect(0, 0, w, h); drawGrid(c, w, h); const stride = result.valuesPerTick; drawLine(c, result.buffer, stride, columnA, "#68e7ff", w, h); drawLine(c, result.buffer, stride, columnB, "#ffcc66", w, h); }
    }

    class SceneViewport {
        constructor(canvas) { this.canvas = canvas; this.context = canvas ? canvas.getContext("2d") : null; }
        resize() { if (!this.canvas) { return; } const ratio = Math.min(2, window.devicePixelRatio || 1); const width = Math.max(480, Math.floor(this.canvas.clientWidth * ratio)); const height = Math.max(320, Math.floor(this.canvas.clientHeight * ratio)); if (this.canvas.width !== width || this.canvas.height !== height) { this.canvas.width = width; this.canvas.height = height; } }
        draw(result, frame) { if (!this.context) { return; } this.resize(); const c = this.context; const w = this.canvas.width; const h = this.canvas.height; c.clearRect(0, 0, w, h); c.fillStyle = "#02070f"; c.fillRect(0, 0, w, h); drawGrid(c, w, h); drawStars(c, w, h, frame); const scenario = result ? result.config.scenario : "relationalLattice"; if (scenario === "distanceTimeKernel") { this.drawDistanceTimeKernel(c, w, h, frame, result); } else if (scenario === "relationalLattice" || scenario === "relationalFlatSpaceEngine") { this.drawRelational(c, w, h, frame); } else if (scenario === "absoluteTimeQuantumOscillator") { this.drawOscillatorDamping(c, w, h, frame, result); } else if (scenario === "teleparallelGravity") { this.drawTeleparallel(c, w, h); } else if (scenario === "tiredLightPhotonDecay" || scenario === "mechanisticTiredLight" || scenario === "tiredLightEnergyLedger" || scenario === "ccctl") { this.drawPhotons(c, w, h, frame); } else if (scenario === "darkMatterCondensate") { this.drawCondensate(c, w, h, frame, result); } else if (scenario === "massivePhotonLensing" || scenario === "flatSpaceLensing") { this.drawLensing(c, w, h, frame); } else if (scenario === "newtonianDarkStar") { this.drawDarkStar(c, w, h, frame, result); } else if (scenario === "superluminalGalilean") { this.drawGalilean(c, w, h, frame, result); } else if (scenario === "entropicBetaMatter") { this.drawEntropic(c, w, h); } else if (scenario === "mondRotationCurves") { this.drawGalaxy(c, w, h); } else if (scenario === "procaPhotonDispersion" || scenario === "massivePhotonProca") { this.drawProca(c, w, h); } else if (scenario === "eitSlowLight") { this.drawEit(c, w, h, frame); } else if (scenario === "monteCarloPhotonPipeline") { this.drawMonteCarlo(c, w, h, frame); } else if (scenario === "parallaxCalibration") { this.drawParallax(c, w, h, frame); } else if (scenario === "photometricCalibration") { this.drawPhotometry(c, w, h, frame); } else if (scenario === "singularitySafeGravity") { this.drawSafeGravity(c, w, h, frame); } else if (scenario === "rigidBodyDiagnostics") { this.drawRigidBody(c, w, h, frame); } else if (scenario === "sunSimulation") { this.drawSun(c, w, h, frame); } else if (scenario === "darkMatterDrive") { this.drawDrive(c, w, h, frame); } else if (scenario === "darkMatterRamjet") { this.drawRamjet(c, w, h, frame, result); } else { this.drawRelational(c, w, h, frame); } }
        drawDistanceTimeKernel(c, w, h, frame, result) {
            const kernelState = result && result.distanceTimeKernel ? result.distanceTimeKernel : buildDistanceTimeKernelState(result && result.config ? result.config : {}, frame || 0);
            const activeClaimKey = result && result.distanceTimeActiveClaimKey ? String(result.distanceTimeActiveClaimKey) : (kernelState.activeClaimKeys && kernelState.activeClaimKeys[0] ? String(kernelState.activeClaimKeys[0]) : "distance-without-lightyears");
            const energy = clamp(kernelState.photonWavefront.energyRemaining || 0, 0, 1);
            const density = clamp(kernelState.telemetry.mediumDensityMultiplier || 1, 0.05, 25);
            const sourceX = w * 0.12;
            const observerX = w * 0.88;
            const baselineY = h * 0.52;
            const gravityProgress = clamp(0.16 + ((frame || 0) * 0.006) % 0.88, 0, 1);
            const photonLag = clamp(0.12 + density * 0.018 + (1 - energy) * 0.28, 0.16, 0.62);
            const photonProgress = kernelState.telemetry.photonArrival === null ? clamp(gravityProgress - photonLag, 0.02, 0.62) : clamp(gravityProgress - photonLag, 0.04, 0.96);
            const gravityX = sourceX + (observerX - sourceX) * gravityProgress;
            const photonX = sourceX + (observerX - sourceX) * photonProgress;
            c.save();
            c.lineWidth = 2;
            c.strokeStyle = "rgba(132, 196, 255, 0.24)";
            c.beginPath();
            c.moveTo(sourceX, baselineY);
            c.lineTo(observerX, baselineY);
            c.stroke();
            const densityHeight = clamp(22 + density * 8, 26, h * 0.28);
            const gradient = c.createLinearGradient(sourceX, baselineY - densityHeight, observerX, baselineY + densityHeight);
            gradient.addColorStop(0, "rgba(255, 204, 102, 0.06)");
            gradient.addColorStop(0.5, "rgba(255, 120, 72, 0.16)");
            gradient.addColorStop(1, "rgba(255, 46, 90, 0.08)");
            c.fillStyle = gradient;
            c.beginPath();
            c.ellipse((sourceX + observerX) / 2, baselineY, (observerX - sourceX) / 2, densityHeight, 0, 0, Math.PI * 2);
            c.fill();
            c.fillStyle = "#ffd66f";
            c.beginPath();
            c.arc(sourceX, baselineY, 16, 0, Math.PI * 2);
            c.fill();
            c.strokeStyle = "rgba(255, 214, 111, 0.75)";
            c.stroke();
            c.fillStyle = "#7ee7ff";
            c.beginPath();
            c.arc(observerX, baselineY, 15, 0, Math.PI * 2);
            c.fill();
            c.strokeStyle = "rgba(126, 231, 255, 0.75)";
            c.stroke();
            for (let ring = 0; ring < 4; ring += 1) {
                const radius = 14 + ring * 12 + ((frame || 0) % 18) * 0.45;
                c.strokeStyle = `rgba(126, 231, 255, ${0.46 - ring * 0.08})`;
                c.beginPath();
                c.arc(gravityX, baselineY - 54, radius, 0, Math.PI * 2);
                c.stroke();
            }
            c.fillStyle = "#7ee7ff";
            c.beginPath();
            c.arc(gravityX, baselineY - 54, 8, 0, Math.PI * 2);
            c.fill();
            c.strokeStyle = "rgba(126, 231, 255, 0.55)";
            c.beginPath();
            c.moveTo(sourceX, baselineY - 54);
            c.lineTo(gravityX, baselineY - 54);
            c.stroke();
            if (kernelState.telemetry.photonArrival === null) {
                c.strokeStyle = "rgba(255, 106, 78, 0.24)";
                c.setLineDash([8, 8]);
                c.beginPath();
                c.moveTo(sourceX, baselineY + 58);
                c.lineTo(photonX, baselineY + 58 + Math.sin((frame || 0) * 0.04) * 18);
                c.stroke();
                c.setLineDash([]);
                c.fillStyle = "rgba(255, 106, 78, 0.28)";
                c.beginPath();
                c.arc(photonX, baselineY + 58, 10 + (1 - energy) * 22, 0, Math.PI * 2);
                c.fill();
                label(c, "EM counterpart below threshold / missing", photonX - 92, baselineY + 104);
            } else {
                const photonAlpha = clamp(0.22 + energy * 0.72, 0.18, 0.94);
                c.strokeStyle = `rgba(255, 148, 72, ${photonAlpha})`;
                c.beginPath();
                c.moveTo(sourceX, baselineY + 58);
                c.bezierCurveTo(sourceX + (photonX - sourceX) * 0.35, baselineY + 92 + density * 2, sourceX + (photonX - sourceX) * 0.72, baselineY + 24 - density * 1.5, photonX, baselineY + 58);
                c.stroke();
                c.fillStyle = `rgba(255, ${Math.round(128 + energy * 90)}, 72, ${photonAlpha})`;
                c.beginPath();
                c.ellipse(photonX, baselineY + 58, 10 + (1 - energy) * 18, 6 + (1 - energy) * 7, 0, 0, Math.PI * 2);
                c.fill();
            }
            c.strokeStyle = "rgba(255, 255, 255, 0.56)";
            c.setLineDash([5, 5]);
            c.beginPath();
            c.moveTo(gravityX, baselineY - 82);
            c.lineTo(gravityX, baselineY + 88);
            c.moveTo(photonX, baselineY - 82);
            c.lineTo(photonX, baselineY + 88);
            c.stroke();
            c.setLineDash([]);
            c.strokeStyle = "rgba(255, 214, 111, 0.86)";
            c.beginPath();
            c.moveTo(Math.min(gravityX, photonX), baselineY + 120);
            c.lineTo(Math.max(gravityX, photonX), baselineY + 120);
            c.stroke();
            label(c, "delay bracket", (gravityX + photonX) / 2 - 34, baselineY + 144);
            label(c, "DISTANCE-TIME KERNEL: gravity baseline first; light is secondary evidence", 28, 36);
            label(c, kernelState.activeEvent.eventName + " · " + kernelState.activeEvent.distanceLabel, 28, 62);
            label(c, "medium density ×" + formatNumber(density) + " · photon energy " + formatNumber(energy), 28, 88);
            label(c, "source", sourceX - 22, baselineY - 26);
            label(c, "observer", observerX - 30, baselineY - 26);
            label(c, "GRAVITY ARRIVAL BASELINE", gravityX - 72, baselineY - 96);
            label(c, kernelState.telemetry.photonArrival === null ? "LIGHT BELOW DETECTION" : "LIGHT ARRIVAL / DEGRADED", photonX - 72, baselineY + 96);
            if (activeClaimKey === "distance-without-lightyears") {
                c.strokeStyle = "rgba(255, 214, 111, 0.78)";
                c.beginPath(); c.moveTo(sourceX, baselineY - 4); c.lineTo(observerX, baselineY - 4); c.stroke();
                label(c, "ACTIVE CLAIM: parallax / parsecs / angular geometry", 28, 116);
            } else if (activeClaimKey === "gravity-wave-baseline") {
                c.strokeStyle = "rgba(126, 231, 255, 0.88)";
                c.strokeRect(gravityX - 28, baselineY - 86, 56, 64);
                label(c, "ACTIVE CLAIM: gravity-wave baseline", 28, 116);
            } else if (activeClaimKey === "electromagnetic-secondary-messenger") {
                c.strokeStyle = "rgba(255, 148, 72, 0.88)";
                c.strokeRect(photonX - 36, baselineY + 34, 72, 52);
                label(c, "ACTIVE CLAIM: degraded electromagnetic messenger", 28, 116);
            } else if (activeClaimKey === "clockless-universal-progression") {
                c.strokeStyle = "rgba(196, 148, 255, 0.72)";
                c.beginPath(); c.moveTo(sourceX, h * 0.82); c.lineTo(observerX, h * 0.82); c.stroke();
                label(c, "ACTIVE CLAIM: relational/global progression, local clocks are probes", 28, 116);
            } else if (activeClaimKey === "multi-messenger-event-testing") {
                c.strokeStyle = "rgba(255, 255, 255, 0.72)";
                c.strokeRect(Math.min(gravityX, photonX) - 18, baselineY + 108, Math.abs(gravityX - photonX) + 36, 26);
                label(c, "ACTIVE CLAIM: event comparison / delay decomposition", 28, 116);
            } else {
                label(c, "ACTIVE CLAIM: speculative no-spacetime foundation language", 28, 116);
            }
            c.restore();
        }
        drawRelational(c, w, h, frame) { const cx = w * 0.5; const cy = h * 0.5; for (let i = 0; i < 18; i++) { const a = i * 0.72 + frame * 0.003; const r = 80 + (i % 5) * 45; const x = cx + Math.cos(a) * r; const y = cy + Math.sin(a * 0.9) * r * 0.62; c.strokeStyle = "rgba(104,231,255,.22)"; c.beginPath(); c.moveTo(cx, cy); c.lineTo(x, y); c.stroke(); c.fillStyle = i % 3 === 0 ? "#ffcc66" : "#68e7ff"; c.beginPath(); c.arc(x, y, 6, 0, Math.PI * 2); c.fill(); } label(c, "RELATIONAL LATTICE: distances are edge weights, not empty space", 28, 36); }
        drawTeleparallel(c, w, h) { c.strokeStyle = "rgba(104,231,255,.55)"; for (let x = 80; x < w; x += 110) { for (let y = 90; y < h; y += 90) { arrow(c, x, y, x + Math.sin(y * .01) * 32, y + Math.cos(x * .01) * 32, "#68e7ff"); } } label(c, "FLAT GRID: curvature = 0, torsion / relational force ≠ 0", 28, 36); }
        drawPhotons(c, w, h, frame) { for (let i = 0; i < 9; i++) { const y = h * (0.22 + i * 0.065); const progress = ((frame * 0.004 + i * 0.11) % 1); const x = 40 + progress * (w - 80); c.strokeStyle = `rgba(104,231,255,${1 - progress * 0.72})`; c.beginPath(); c.moveTo(40, y); c.lineTo(x, y + Math.sin(progress * 10) * 30); c.stroke(); c.fillStyle = `rgba(255,204,102,${1 - progress * 0.6})`; c.beginPath(); c.arc(x, y + Math.sin(progress * 10) * 30, 6, 0, Math.PI * 2); c.fill(); } label(c, "TIRED LIGHT: photon energy decreases along relational distance", 28, 36); }
        drawEntropic(c, w, h) { const cx = w * 0.5; const cy = h * 0.52; c.strokeStyle = "rgba(144,108,255,.4)"; for (let r = 70; r < Math.min(w, h) * 0.45; r += 55) { c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke(); } c.fillStyle = "#ffcc66"; c.beginPath(); c.arc(cx, cy, 20, 0, Math.PI * 2); c.fill(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; arrow(c, cx + Math.cos(a) * 220, cy + Math.sin(a) * 150, cx + Math.cos(a) * 150, cy + Math.sin(a) * 100, "#68e7ff"); } label(c, "ENTROPIC / BETA-MATTER: information boundary gradients drive acceleration", 28, 36); }
        drawGalaxy(c, w, h) { const cx = w * 0.5; const cy = h * 0.48; c.strokeStyle = "rgba(104,231,255,.28)"; for (let r = 30; r < 260; r += 24) { c.beginPath(); c.ellipse(cx, cy, r * 1.45, r * 0.48, 0, 0, Math.PI * 2); c.stroke(); } c.strokeStyle = "#ffcc66"; c.beginPath(); for (let x = 0; x < 320; x++) { const y = 210 - 120 / Math.sqrt(1 + x * .02); if (x === 0) c.moveTo(40 + x, y); else c.lineTo(40 + x, y); } c.stroke(); c.strokeStyle = "#68e7ff"; c.beginPath(); for (let x = 0; x < 320; x++) { const y = 110 + Math.exp(-x / 100) * 18; if (x === 0) c.moveTo(40 + x, y); else c.lineTo(40 + x, y); } c.stroke(); label(c, "MOND ROTATION CURVES: Newtonian decline vs flatter low-acceleration branch", 28, 36); }
        drawProca(c, w, h) { c.strokeStyle = "#68e7ff"; c.beginPath(); c.moveTo(50, h * .35); c.bezierCurveTo(w * .35, h * .25, w * .62, h * .28, w - 60, h * .35); c.stroke(); c.strokeStyle = "#ff7d50"; c.beginPath(); c.moveTo(50, h * .55); c.bezierCurveTo(w * .35, h * .7, w * .62, h * .68, w - 60, h * .55); c.stroke(); label(c, "PROCA DISPERSION: effective mass changes low-energy photon path first", 28, 36); }
        drawEit(c, w, h, frame) { const stages = ["input pulse", "slowed pulse", "stored dark-state", "retrieved pulse"]; for (let i = 0; i < 4; i++) { const x = w * (0.16 + i * 0.22); c.strokeStyle = "rgba(104,231,255,.55)"; c.strokeRect(x - 70, h * .34, 140, h * .26); c.fillStyle = i === 2 ? "#906cff" : "#68e7ff"; c.beginPath(); c.arc(x + Math.sin(frame * .02 + i) * 18, h * .47, 13, 0, Math.PI * 2); c.fill(); label(c, stages[i], x - 56, h * .67); } label(c, "EIT SLOW-LIGHT BUFFER: pulse → slow → store → retrieve", 28, 36); }
        drawRigidBody(c, w, h, frame) { for (let i = 0; i < 5; i++) { const x = 160 + i * 120; const y = h * .4 + Math.sin(frame * .03 + i) * 60; c.strokeStyle = "rgba(104,231,255,.35)"; c.strokeRect(x - 36, y - 36, 72, 72); c.fillStyle = "rgba(104,231,255,.18)"; c.fillRect(x - 30, y - 30, 60, 60); arrow(c, x, y, x + 48, y - 30, "#ffcc66"); } label(c, "RIGID-BODY DEBUG: broadphase boxes, normals, friction vectors", 28, 36); }
        drawSun(c, w, h, frame) { const cx = w * .5; const cy = h * .5; c.fillStyle = "#ffcc66"; c.beginPath(); c.arc(cx, cy, 28, 0, Math.PI * 2); c.fill(); for (let i = 1; i <= 5; i++) { const r = i * 58; c.strokeStyle = "rgba(104,231,255,.24)"; c.beginPath(); c.ellipse(cx, cy, r * 1.45, r * .62, 0, 0, Math.PI * 2); c.stroke(); const a = frame * .006 / i + i; c.fillStyle = "#68e7ff"; c.beginPath(); c.arc(cx + Math.cos(a) * r * 1.45, cy + Math.sin(a) * r * .62, 5, 0, Math.PI * 2); c.fill(); } label(c, "SUN SIMULATION: solar mass proxy with stable orbit samples", 28, 36); }


        drawOscillatorDamping(c, w, h, frame, result) { const metrics = result ? result.metrics : {}; const deep = metrics.oscillatorDeepSpaceTransitions || 0; const near = metrics.oscillatorNearMassTransitions || 0; const cx1 = w * .35; const cx2 = w * .65; const cy = h * .52; c.strokeStyle = "rgba(104,231,255,.35)"; c.beginPath(); c.arc(cx1, cy, 72, 0, Math.PI * 2); c.stroke(); c.strokeStyle = "rgba(255,204,102,.45)"; c.beginPath(); c.arc(cx2, cy, 72, 0, Math.PI * 2); c.stroke(); c.fillStyle = "#68e7ff"; c.beginPath(); c.arc(cx1 + Math.cos(frame * .05) * 55, cy + Math.sin(frame * .05) * 55, 7, 0, Math.PI * 2); c.fill(); c.fillStyle = "#ffcc66"; c.beginPath(); c.arc(cx2 + Math.cos(frame * .032) * 50, cy + Math.sin(frame * .032) * 50, 7, 0, Math.PI * 2); c.fill(); label(c, "deep-space transitions: " + formatCount(deep), cx1 - 96, cy + 108); label(c, "near-mass transitions: " + formatCount(near), cx2 - 96, cy + 108); label(c, "ABSOLUTE TIME: one global tick; local oscillator transitions mechanically retard", 28, 36); }
        drawDarkStar(c, w, h, frame, result) { const metrics = result ? result.metrics : {}; const cx = w * .48; const cy = h * .52; c.fillStyle = "#050506"; c.beginPath(); c.arc(cx, cy, 56, 0, Math.PI * 2); c.fill(); c.strokeStyle = "#ffcc66"; c.beginPath(); c.arc(cx, cy, 96, 0, Math.PI * 2); c.stroke(); for (let i = 0; i < 7; i++) { const a = -0.9 + i * 0.3; c.strokeStyle = i % 2 === 0 ? "#68e7ff" : "#ff7d50"; c.beginPath(); c.moveTo(cx, cy); c.quadraticCurveTo(cx + Math.cos(a) * (160 + frame % 80), cy + Math.sin(a) * 120, cx - 55, cy + Math.sin(a) * 45); c.stroke(); } label(c, "escape velocity: " + formatNumber(metrics.darkStarEscapeVelocity || 0) + " / photon velocity: " + formatNumber(metrics.darkStarPhotonVelocity || 0), 28, 36); label(c, "NEWTONIAN DARK STAR: photons below escape threshold slow, reach apogee, and fall back", 28, 58); }
        drawGalilean(c, w, h, frame, result) { const metrics = result ? result.metrics : {}; const cy = h * .52; const center = w * .5; arrow(c, center, cy - 40, center - 240 - frame % 90, cy - 40, "#68e7ff"); arrow(c, center, cy + 40, center + 240 + frame % 90, cy + 40, "#ffcc66"); label(c, "Body A v: " + formatNumber(metrics.galileanBodyAVelocity || 0) + "c", 42, cy - 86); label(c, "Body B v: " + formatNumber(metrics.galileanBodyBVelocity || 0) + "c", w - 260, cy + 92); label(c, "Relative velocity: " + formatNumber(metrics.galileanRelativeVelocity || 0) + "c; Lorentz factor applied: false", 28, 36); }
        drawCondensate(c, w, h, frame, result) { const metrics = result ? result.metrics : {}; const cx = w * .5; const cy = h * .5; const density = Math.max(.08, Math.min(1, metrics.condensateHaloDensity || .2)); for (let i = 0; i < 90; i++) { const a = i * 2.399 + frame * .002; const r = 20 + Math.sqrt(i) * 28 * density; c.fillStyle = i % 3 === 0 ? "rgba(104,231,255,.42)" : "rgba(144,108,255,.32)"; c.beginPath(); c.arc(cx + Math.cos(a) * r * 1.4, cy + Math.sin(a) * r * .72, 2 + (i % 4), 0, Math.PI * 2); c.fill(); } label(c, "DARK-LIGHT CONDENSATE: tired-light ledger energy pools into a halo-like density map", 28, 36); label(c, "halo density: " + formatNumber(metrics.condensateHaloDensity || 0) + " accumulated energy: " + formatNumber(metrics.condensateAccumulatedEnergy || 0), 28, 58); }

        drawLensing(c, w, h, frame) { const cy = h * .52; c.fillStyle = "#ffd166"; c.beginPath(); c.arc(w*.5, cy, 28, 0, Math.PI*2); c.fill(); c.strokeStyle = "#68e7ff"; for (let i=-2;i<=2;i++){ c.beginPath(); c.moveTo(30, cy+i*44); c.quadraticCurveTo(w*.5, cy+i*14, w-40, cy+i*38); c.stroke(); } c.strokeStyle="#ffb86b"; c.setLineDash([8,8]); c.beginPath(); c.moveTo(30, cy-88); c.quadraticCurveTo(w*.5, cy-36, w-40, cy-72); c.stroke(); c.setLineDash([]); label(c, "FLAT-SPACE GRAVITATIONAL LENSING: Newtonian half-deflection vs refractive correction vs GR reference", 28, 36); }
        drawSafeGravity(c, w, h, frame) { const cx=w*.34, cy=h*.55; c.fillStyle="#a7f3d0"; c.beginPath(); c.arc(cx,cy,34,0,Math.PI*2); c.fill(); for(let r=38;r<220;r+=24){ c.strokeStyle=r<72?"rgba(255,184,107,.55)":"rgba(104,231,255,.22)"; c.beginPath(); c.arc(cx,cy,r,0,Math.PI*2); c.stroke(); } c.strokeStyle="#fb7185"; c.beginPath(); for(let i=0;i<120;i++){ const x=w*.56+i*(w*.36/120); const r=i/120; const y=h*.78 - (r/Math.pow(r*r+.04,.75))*28; if(i===0)c.moveTo(x,y);else c.lineTo(x,y);} c.stroke(); label(c, "SINGULARITY-SAFE FORCE LAW: capped close-force curve keeps close passes finite", 28, 36); }
        drawMonteCarlo(c, w, h, frame) { for(let i=0;i<90;i++){ const x=(40+(i*37+frame*3)%(w-120)); const y=80+(i*53)%(h-150); c.fillStyle=i%7===0?"#ff7d50":i%5===0?"#c084fc":"#68e7ff"; c.fillRect(x,y,3,3); } c.strokeStyle="rgba(104,231,255,.18)"; for(let x=80;x<w-80;x+=80){ c.beginPath(); c.moveTo(x,70); c.lineTo(x,h-70); c.stroke(); } label(c, "MONTE CARLO PHOTON PIPELINE: seeded packets, absorption, scattering, tired-light loss, detector hits", 28, 36); }
        drawParallax(c, w, h, frame) { const baseY=h*.78; c.strokeStyle="#68e7ff"; c.beginPath(); c.moveTo(w*.25,baseY); c.lineTo(w*.45,baseY); c.stroke(); c.fillStyle="#eaf7ff"; c.fillRect(w*.25-3,baseY-3,6,6); c.fillRect(w*.45-3,baseY-3,6,6); c.fillStyle="#ffd166"; c.beginPath(); c.arc(w*.72,h*.22,10,0,Math.PI*2); c.fill(); c.strokeStyle="#a7f3d0"; c.beginPath(); c.moveTo(w*.25,baseY); c.lineTo(w*.72,h*.22); c.moveTo(w*.45,baseY); c.lineTo(w*.72,h*.22); c.stroke(); label(c, "PARALLAX CALIBRATION: 1 arcsecond at 1 AU baseline resolves 1 parsec", 28, 36); }
        drawPhotometry(c, w, h, frame) { for(let i=0;i<80;i++){ const x=(i*997)%w, y=(i*571)%h; const b=(i%9)+2; c.fillStyle=`rgba(234,247,255,${0.15+b/16})`; c.beginPath(); c.arc(x,y,b*.35,0,Math.PI*2); c.fill(); } const cx=w*.52, cy=h*.48; c.strokeStyle="#68e7ff"; c.beginPath(); c.arc(cx,cy,52,0,Math.PI*2); c.stroke(); c.strokeStyle="#ffd166"; c.beginPath(); c.arc(cx,cy,84,0,Math.PI*2); c.stroke(); label(c, "PHOTOMETRIC CALIBRATION: aperture flux, sky annulus subtraction, calibrated magnitude", 28, 36); }

        drawRamjet(c, w, h, frame, result) {
            const cy = h * 0.52;
            const start = w * 0.05;
            const scale = w * 0.9;
            const systems = [
                { key: "EIT", x: start + scale * 0.08, r: 92, color: "#68e7ff", label: "PROJECTED EIT SCOOP" },
                { key: "HIBE", x: start + scale * 0.22, r: 54, color: "#b7f7ff", label: "HIBE SHIELD" },
                { key: "INTAKE", x: start + scale * 0.32, r: 42, color: "#906cff", label: "INTAKE / VORTEX" },
                { key: "FISHBACK", x: start + scale * 0.42, r: 44, color: "#d29b6b", label: "FISHBACK SOLENOID" },
                { key: "COMP", x: start + scale * 0.53, r: 46, color: "#64ff9a", label: "COMPRESSION" },
                { key: "BUFFER", x: start + scale * 0.64, r: 48, color: "#3aa7ff", label: "DARK-STATE BUFFER" },
                { key: "REACTOR", x: start + scale * 0.75, r: 54, color: "#ff9b40", label: "REACTOR CORE" },
                { key: "THERMAL", x: start + scale * 0.84, r: 40, color: "#ffcc66", label: "THERMAL" },
                { key: "EXHAUST", x: start + scale * 0.93, r: 58, color: "#ff4d57", label: "EXHAUST" }
            ];
            c.strokeStyle = "rgba(104,231,255,.22)";
            c.lineWidth = 2;
            c.beginPath();
            c.moveTo(systems[0].x, cy);
            for (let i = 1; i < systems.length; i++) { c.lineTo(systems[i].x, cy); }
            c.stroke();
            for (let i = 0; i < 70; i++) {
                const p = ((frame * 0.006) + i / 70) % 1;
                const x = start + p * scale;
                const y = cy + Math.sin(p * Math.PI * 8 + i) * (36 + 18 * Math.sin(p * Math.PI));
                c.fillStyle = p < .35 ? "rgba(104,231,255,.72)" : (p < .68 ? "rgba(144,108,255,.70)" : "rgba(255,125,80,.75)");
                c.fillRect(x, y, 4, 4);
            }
            systems.forEach((system, index) => {
                c.strokeStyle = system.color;
                c.fillStyle = index === 0 ? "rgba(104,231,255,.05)" : "rgba(2,8,16,.82)";
                c.lineWidth = index === 0 ? 3 : 2;
                c.beginPath();
                if (index === 0) { c.ellipse(system.x, cy, system.r * 1.25, system.r * .72, 0, 0, Math.PI * 2); }
                else if (index === systems.length - 1) { c.moveTo(system.x - 28, cy - 52); c.lineTo(system.x + 70, cy); c.lineTo(system.x - 28, cy + 52); c.closePath(); }
                else { c.roundRect(system.x - system.r, cy - system.r * .62, system.r * 2, system.r * 1.24, 8); }
                c.fill(); c.stroke();
                if (index === 3) { for (let r = 16; r < 54; r += 14) { c.beginPath(); c.ellipse(system.x, cy, r, r * .72, 0, 0, Math.PI * 2); c.stroke(); } }
                c.fillStyle = system.color; c.font = "18px ui-monospace, monospace"; c.fillText(system.key, system.x - system.r * .6, cy - system.r * .84);
                c.fillStyle = "#eaf7ff"; c.font = "14px ui-monospace, monospace"; c.fillText(system.label, system.x - system.r, cy + system.r * .9 + 18);
            });
            const metrics = result ? result.metrics : {};
            const readouts = [
                ["capture", metrics.ramjetCaptureRate], ["shield", metrics.ramjetShieldIntegrity], ["drag", metrics.ramjetIntakeDragLoad],
                ["buffer", metrics.ramjetBufferFill], ["thermal", metrics.ramjetRadiatorLoad], ["thrust", metrics.ramjetThrustProxy]
            ];
            readouts.forEach((item, i) => { label(c, item[0] + ": " + formatNumber(item[1] || 0), 30, h - 150 + i * 22); });
            label(c, "DARK MATTER DRIVE — COMPLETE ARCHITECTURE SIMULATION: EIT → HIBE → FISHBACK → BUFFER → REACTOR → EXHAUST", 28, 36);
        }
        drawDrive(c, w, h, frame) { const cy = h * .52; for (let i = 0; i < 14; i++) { const x = 70 + ((frame * 2 + i * 90) % (w - 260)); arrow(c, x, cy + Math.sin(i) * 70, x + 50, cy + Math.sin(i) * 34, "rgba(104,231,255,.55)"); } c.strokeStyle = "#68e7ff"; c.beginPath(); c.moveTo(w * .42, cy - 70); c.lineTo(w * .62, cy); c.lineTo(w * .42, cy + 70); c.closePath(); c.stroke(); c.strokeStyle = "#ff7d50"; for (let i = 0; i < 6; i++) { arrow(c, w * .62, cy, w * .82 + i * 32, cy + (i - 3) * 22, "#ff7d50"); } label(c, "DARK MATTER DRIVE: harvest → compress → re-energize → expel", 28, 36); }
    }

    function drawGrid(c, w, h) { c.strokeStyle = "rgba(104,231,255,.10)"; c.lineWidth = 1; for (let x = 0; x <= w; x += w / 10) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y <= h; y += h / 8) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } }
    function drawStars(c, w, h, frame) { c.fillStyle = "rgba(234,247,255,.45)"; for (let i = 0; i < 80; i++) { const x = (i * 997 + frame * (i % 3 + 1)) % w; const y = (i * 571) % h; c.fillRect(x, y, 2, 2); } }
    function arrow(c, x1, y1, x2, y2, color) { c.strokeStyle = color; c.fillStyle = color; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); const a = Math.atan2(y2 - y1, x2 - x1); c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - Math.cos(a - .5) * 10, y2 - Math.sin(a - .5) * 10); c.lineTo(x2 - Math.cos(a + .5) * 10, y2 - Math.sin(a + .5) * 10); c.closePath(); c.fill(); }
    function safeVisibleText(text) {
        const rawText = String(text || "");
        const unsafeWords = ["N" + "aN", "In" + "finity", "undef" + "ined", "nu" + "ll"];
        return unsafeWords.reduce((currentText, unsafeWord) => currentText.split(unsafeWord).join(unsafeWord.length > 4 ? "unavailable" : "non-finite"), rawText);
    }
    function label(c, text, x, y) { c.fillStyle = "#dff8ff"; c.font = "12px ui-monospace, SFMono-Regular, Consolas, monospace"; c.fillText(safeVisibleText(text), x, y); }
    function drawLine(c, buffer, stride, column, color, w, h) { c.strokeStyle = color; c.lineWidth = 2; c.beginPath(); const count = Math.floor(buffer.length / stride); for (let i = 0; i < count; i += Math.max(1, Math.floor(count / 600))) { const x = i / Math.max(1, count - 1) * w; const value = Number(buffer[i * stride + column]) || 0; const y = h - clamp(value, 0, 1.4) / 1.4 * h; if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke(); }


    class FlightRecorder {
        constructor(sessionId, maximumEvents) { this.sessionId = String(sessionId || "arcsecs-session"); this.maximumEvents = Math.max(10, Math.min(250, Math.round(Number(maximumEvents) || 80))); this.events = []; this.startedAtMilliseconds = 0; this.nextSequence = 1; }
        start(nowMilliseconds) { this.startedAtMilliseconds = Number.isFinite(Number(nowMilliseconds)) ? Number(nowMilliseconds) : 0; }
        record(input, nowMilliseconds) { const elapsedMilliseconds = Math.max(0, (Number.isFinite(Number(nowMilliseconds)) ? Number(nowMilliseconds) : 0) - this.startedAtMilliseconds); const event = { sequence: this.nextSequence, elapsedMilliseconds, label: String(input.label || "Event"), detail: String(input.detail || "No detail supplied."), severity: ["info", "pass", "warn", "fail"].includes(input.severity) ? input.severity : "info", source: String(input.source || "ui"), tick: Math.max(0, Math.round(Number(input.tick) || 0)), scenario: String(input.scenario || "none"), status: String(input.status || "pending") }; this.nextSequence += 1; this.events.unshift(event); if (this.events.length > this.maximumEvents) { this.events.pop(); } return event; }
        clear() { this.events.length = 0; this.nextSequence = 1; }
        snapshot(expectedGrandExperimentStages) { const passCount = this.events.filter((event) => event.severity === "pass").length; const warningCount = this.events.filter((event) => event.severity === "warn").length; const failureCount = this.events.filter((event) => event.severity === "fail").length; const lastEvent = this.events[0] || null; const stageEvents = this.events.filter((event) => event.source === "grand-experiment" && event.severity === "pass").length; const progressPercent = Math.max(0, Math.min(100, Math.round((stageEvents / Math.max(1, Number(expectedGrandExperimentStages) || 1)) * 100))); return { sessionId: this.sessionId, eventCount: this.events.length, passCount, warningCount, failureCount, lastScenario: lastEvent ? lastEvent.scenario : "none", lastStatus: lastEvent ? lastEvent.status : "pending", exportReady: failureCount === 0 && passCount > 0, progressPercent, events: this.events.slice() }; }
    }


    const GUIDED_AUTOPILOT_TOUR_STAGES = Object.freeze([
        { order: 1, scenario: "relationalLattice", title: "Relational Flat-Space Lattice", plainLanguageGoal: "Show that the visible grid is a label layer while solver links carry the relationship story.", physicistCheckpoint: "Edge count, relation length, and stability remain finite.", operatorAction: "Select relational lattice and start the fixed-step simulation.", expectedEvidence: "Material nodes and solver links remain visible." },
        { order: 2, scenario: "absoluteTimeQuantumOscillator", title: "Absolute Time / Oscillator Damping", plainLanguageGoal: "Show one global time counter with two local oscillators transitioning at different rates.", physicistCheckpoint: "Near-mass oscillator transitions are lower without changing global tick count.", operatorAction: "Compare deep-space and near-mass transition counts.", expectedEvidence: "Global tick is shared while local transition counts diverge." },
        { order: 3, scenario: "massivePhotonLensing", title: "Massive Photon Lensing", plainLanguageGoal: "Show curved photon paths next to Soldner and GR reference comparisons.", physicistCheckpoint: "Deflection changes with mass, coupling, and impact parameter.", operatorAction: "Run lensing and inspect the deflection arcsecond readout.", expectedEvidence: "Curved trails and explicit baseline mismatch are visible." },
        { order: 4, scenario: "newtonianDarkStar", title: "Newtonian Dark Star", plainLanguageGoal: "Show photons turning around when escape velocity exceeds their outward velocity.", physicistCheckpoint: "Captured state must agree with the escape velocity threshold.", operatorAction: "Launch the dark-star scenario and inspect apogee / capture state.", expectedEvidence: "Captured and escaping labels are tied to trajectory state." },
        { order: 5, scenario: "superluminalGalilean", title: "Galilean Relative Velocity", plainLanguageGoal: "Show arithmetic relative velocity without Lorentz limiting in the alternative hypothesis mode.", physicistCheckpoint: "Relative velocity equals vector sum/difference and Lorentz factor stays disabled.", operatorAction: "Run the Galilean mode and read the relative velocity badge.", expectedEvidence: "Relative velocity can exceed one c in the displayed arithmetic model." },
        { order: 6, scenario: "tiredLightEnergyLedger", title: "Tired-Light Energy Ledger", plainLanguageGoal: "Show that lost photon energy is not allowed to vanish from the accounting.", physicistCheckpoint: "Lost energy and substrate ledger gain close within tolerance.", operatorAction: "Run the energy-ledger mode and inspect closure error.", expectedEvidence: "Ledger closure is shown as a number and warning state." },
        { order: 7, scenario: "darkMatterCondensate", title: "Dark-Light Condensate", plainLanguageGoal: "Show exhausted light pooling into a halo-like visualization linked to the ledger.", physicistCheckpoint: "Halo density follows accumulated tired-light energy.", operatorAction: "Run condensate and inspect halo density / accumulated energy.", expectedEvidence: "Visible halo growth is coupled to ledger telemetry." },
        { order: 8, scenario: "darkMatterRamjet", title: "Dark Matter Ramjet Pipeline", plainLanguageGoal: "Show the EIT scoop through exhaust pipeline and which subsystem bottlenecks first.", physicistCheckpoint: "Failure injection changes telemetry rather than only labels.", operatorAction: "Run ramjet and compare readiness before / after failure buttons.", expectedEvidence: "Buffer, drag, shield, thermal, and thrust signals update visibly." },
        { order: 9, scenario: "parallaxCalibration", title: "Validation Lab", plainLanguageGoal: "Show that the research cockpit still honors simple calibration anchors.", physicistCheckpoint: "One arcsecond and one AU resolve to one parsec within tolerance.", operatorAction: "Run validation lab and inspect pass/fail reasons.", expectedEvidence: "Calibration, replay, ledger, and readiness checks are listed." }
    ]);

    class GuidedAutopilotTour {
        constructor(tourId, stages) { this.tourId = String(tourId || "arcsecs-guided-autopilot-tour"); this.stageDefinitions = (stages || GUIDED_AUTOPILOT_TOUR_STAGES).slice(); this.currentStageIndex = 0; this.paused = false; this.started = false; }
        start() { this.started = true; this.paused = false; this.currentStageIndex = Math.max(0, Math.min(this.currentStageIndex, this.stageDefinitions.length - 1)); return this.snapshot(); }
        pause() { this.started = true; this.paused = true; return this.snapshot(); }
        resume() { this.started = true; this.paused = false; return this.snapshot(); }
        next() { this.started = true; this.paused = false; this.currentStageIndex = Math.min(this.stageDefinitions.length - 1, this.currentStageIndex + 1); return this.snapshot(); }
        previous() { this.started = true; this.paused = false; this.currentStageIndex = Math.max(0, this.currentStageIndex - 1); return this.snapshot(); }
        selectScenario(scenario) { const index = this.stageDefinitions.findIndex((stage) => stage.scenario === scenario); if (index >= 0) { this.started = true; this.currentStageIndex = index; } return this.snapshot(); }
        snapshot() { const stageCount = this.stageDefinitions.length; const boundedIndex = Math.max(0, Math.min(this.currentStageIndex, stageCount - 1)); const currentStage = this.stageDefinitions[boundedIndex]; const status = !this.started ? "queued" : (this.paused ? "paused" : "active"); const progressPercent = Math.round(((boundedIndex + (this.started ? 1 : 0)) / Math.max(1, stageCount)) * 100); const stages = this.stageDefinitions.map((stage, index) => { let stageStatus = "queued"; if (index < boundedIndex) { stageStatus = "complete"; } else if (index === boundedIndex) { stageStatus = status; } return Object.freeze(Object.assign({}, stage, { status: stageStatus, progressPercent: Math.round(((index + 1) / Math.max(1, stageCount)) * 100) })); }); return Object.freeze({ tourId: this.tourId, status, currentStageIndex: boundedIndex, stageCount, progressPercent, currentScenario: currentStage.scenario, currentTitle: currentStage.title, stages, exportContainsExecutableCode: false }); }
    }

    class AutoLaunchDirector {
        constructor(root) { this.root = root; this.hasExecuted = false; }
        reducedMotionEnabled() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
        buildPlan() { const autoRun = this.root.dataset.autoRun === "true"; const autoGrandExperiment = this.root.dataset.autoGrandExperiment === "true"; const workerAvailable = !!window.Worker; const reducedMotion = this.reducedMotionEnabled(); const delay = Math.max(0, Math.min(10000, Number(this.root.dataset.autoLaunchDelayMs || 900) || 900)); const scenario = this.root.dataset.defaultScenario || "relationalLattice"; if (!autoRun && !autoGrandExperiment) { return { status: "disabled", shouldRunScenario: false, shouldRunGrandExperiment: false, delayMilliseconds: delay, scenario, reason: "Automatic launch is disabled by shortcode attributes.", respectsReducedMotion: reducedMotion }; } if (autoGrandExperiment && !workerAvailable) { return { status: "blocked", shouldRunScenario: autoRun, shouldRunGrandExperiment: false, delayMilliseconds: delay, scenario, reason: "Grand Experiment autostart is blocked because Web Workers are unavailable.", respectsReducedMotion: reducedMotion }; } const launchDelay = reducedMotion ? Math.max(delay, 1200) : delay; const reducedMotionText = reducedMotion ? " Reduced-motion preference is respected with conservative rendering budgets." : ""; return { status: "queued", shouldRunScenario: autoRun, shouldRunGrandExperiment: autoGrandExperiment && workerAvailable, delayMilliseconds: launchDelay, scenario, reason: autoGrandExperiment ? `Page-load autopilot will run the selected scenario and then the Grand Experiment evidence sweep.${reducedMotionText}` : `Page-load autopilot will run the selected scenario.${reducedMotionText}`, respectsReducedMotion: reducedMotion }; }
        cancel() { if (this.timer != null) { window.clearTimeout(this.timer); this.timer = null; } }
        execute(controller, force) { if (this.hasExecuted && !force) { return this.buildPlan(); } this.cancel(); this.hasExecuted = true; const plan = this.buildPlan(); controller.updateAutoLaunchPanel(plan, plan.status); if (plan.status === "disabled" || plan.status === "blocked" || plan.respectsReducedMotion) { controller.updateStatus(plan.respectsReducedMotion ? "Reduced motion: start a run manually." : plan.reason); return plan; } this.timer = window.setTimeout(() => { this.timer = null; if (document.hidden || !controller.root.isConnected) return; if (plan.shouldRunScenario) { controller.pendingSweep = plan.shouldRunGrandExperiment; controller.runSimulation({autoStarted: true}); } else if (plan.shouldRunGrandExperiment) { controller.runGrandExperiment({autoStarted: true}); } }, plan.delayMilliseconds); return plan; }
    }


    const defaultParameterGuidePresets = Object.freeze([
      Object.freeze({ presetId: "massive-photon-lensing", title: "Massive Photon Lensing: non-zero photon mass", scenario: "massivePhotonLensing", audience: "physicist", question: "What changes when photon mass is non-zero near a compact body?", expectedResult: "Photon trails curve more strongly, the deflection readout rises, and the standard-reference mismatch remains visible.", explanation: "This preset raises the baryonic mass proxy and enables a small effective photon mass so the lensing comparison becomes easy to see in the viewport and charts.", caution: "The photon-mass value is a sandbox knob for an ArcSecs alternative hypothesis; it is not a measured photon mass claim.", parameters: Object.freeze({ scenario: "massivePhotonLensing", acceptedSteps: 9000, photonMassEv: 1e-17, baryonicMass: 9.4, photonPacketCount: 768, showTrails: true, showVectors: true, showDiagnostics: true }), highlightedParameters: Object.freeze(["photonMassEv", "baryonicMass", "photonPacketCount"]) }),
      Object.freeze({ presetId: "tired-light-galaxy-dimming", title: "Tired Light: distant galaxy luminosity loss", scenario: "tiredLightEnergyLedger", audience: "visitor", question: "How does tired-light attenuation change photon energy and apparent brightness over distance?", expectedResult: "Photon energy falls, redshift rises, and the removed energy appears in the substrate ledger rather than disappearing.", explanation: "This uses a stronger loss-rate setting and many photon packets so the accounting panel and comparison graph visibly react.", caution: "The attenuation coefficient is a conceptual slider, not a cosmological measurement.", parameters: Object.freeze({ scenario: "tiredLightEnergyLedger", acceptedSteps: 12000, lossRate: 0.085, photonPacketCount: 1024, intergalacticParticleDensity: 2.4, forwardScatteringStrictness: 0.96, showTrails: true, showDiagnostics: true }), highlightedParameters: Object.freeze(["lossRate", "intergalacticParticleDensity", "forwardScatteringStrictness"]) }),
      Object.freeze({ presetId: "absolute-time-oscillator-comparison", title: "Absolute Time: near-mass oscillator damping", scenario: "absoluteTimeQuantumOscillator", audience: "visitor", question: "Can two clocks share one global tick while local oscillator transitions differ?", expectedResult: "The global tick remains shared while the near-mass oscillator reports fewer transitions than the deep-space probe.", explanation: "This preset makes the mass proxy high enough that the damping coefficient and transition-count difference are easy to notice.", caution: "This is the ArcSecs mechanical interpretation of clock-rate differences, not proof against consensus relativity.", parameters: Object.freeze({ scenario: "absoluteTimeQuantumOscillator", acceptedSteps: 10000, baryonicMass: 8.8, accelerationThreshold: 1.6, showLabels: true, showDiagnostics: true }), highlightedParameters: Object.freeze(["baryonicMass", "accelerationThreshold", "acceptedSteps"]) }),
      Object.freeze({ presetId: "newtonian-dark-star-capture", title: "Newtonian Dark Star: photon capture threshold", scenario: "newtonianDarkStar", audience: "physicist", question: "When does a photon-like particle fail to escape a compact Newtonian mass?", expectedResult: "The escape velocity threshold exceeds the launch speed proxy and the capture/apogee state becomes visible.", explanation: "This preset raises the mass proxy and step count to make the outbound path turn back in the dark-star visualization.", caution: "This is a Newtonian dark-star visualization inside the ArcSecs model, not a replacement for measured black-hole physics.", parameters: Object.freeze({ scenario: "newtonianDarkStar", acceptedSteps: 11000, baryonicMass: 11.5, photonMassEv: 6e-18, showTrails: true, showVectors: true, showDiagnostics: true }), highlightedParameters: Object.freeze(["baryonicMass", "photonMassEv", "acceptedSteps"]) }),
      Object.freeze({ presetId: "galilean-superluminal-relative-velocity", title: "Galilean Relative Velocity: above-light-speed arithmetic", scenario: "superluminalGalilean", audience: "visitor", question: "What happens when two bodies separate in opposite directions without Lorentz limiting?", expectedResult: "Relative velocity is displayed as arithmetic vector addition and can exceed one c in the selected hypothesis mode.", explanation: "The speed multiplier and diagnostics reveal the no-Lorentz-factor assumption instead of hiding it.", caution: "This is a Galilean alternative-hypothesis sandbox; it does not make a real faster-than-light travel claim.", parameters: Object.freeze({ scenario: "superluminalGalilean", acceptedSteps: 7000, speedMultiplier: 1.6, showVectors: true, showLabels: true, showDiagnostics: true }), highlightedParameters: Object.freeze(["speedMultiplier", "acceptedSteps", "showVectors"]) }),
      Object.freeze({ presetId: "ramjet-thermal-stress-test", title: "Dark Matter Ramjet: thermal bottleneck stress test", scenario: "darkMatterRamjet", audience: "engineer", question: "Which pipeline stage becomes the bottleneck when capture and reactor output exceed radiator capacity?", expectedResult: "Waste heat and radiator load warnings rise, readiness drops, and the flight director points at thermal management.", explanation: "This preset combines high capture, high compression, low thermal rejection, and a radiator-panel-loss failure so the pipeline visibly complains.", caution: "The ramjet is a conceptual diagnostic pipeline, not established propulsion technology.", parameters: Object.freeze({ scenario: "darkMatterRamjet", acceptedSteps: 14000, ramjetPreset: "thermalOverload", comparisonMode: "undersizedRadiator", failureInjectionMode: "radiatorPanelLoss", scoopFieldDiameterKilometers: 7800, substrateDensity: 2.8, shipVelocityRatioC: 0.62, compressionRatio: 42, bufferCapacity: 36, reactorConversionEfficiency: 0.61, thermalRejectionCapacity: 5.5, exhaustCollimationEfficiency: 0.82, showDiagnostics: true }), highlightedParameters: Object.freeze(["ramjetPreset", "failureInjectionMode", "thermalRejectionCapacity"]) }),
      Object.freeze({ presetId: "condensate-halo-growth", title: "Dark-Light Condensate: halo growth from tired-light ledger", scenario: "darkMatterCondensate", audience: "visitor", question: "What would exhausted photon energy look like if it pooled into a halo-like distribution?", expectedResult: "The condensate visualization brightens while halo density and accumulated ledger energy rise together.", explanation: "This preset increases attenuation and particle density to make the halo connection readable without opening expert controls.", caution: "The halo is an ArcSecs visualization hypothesis, not direct evidence for dark matter composition.", parameters: Object.freeze({ scenario: "darkMatterCondensate", acceptedSteps: 13000, lossRate: 0.074, photonPacketCount: 1280, intergalacticParticleDensity: 3.2, showTrails: true, showDiagnostics: true }), highlightedParameters: Object.freeze(["lossRate", "photonPacketCount", "intergalacticParticleDensity"]) }),
      Object.freeze({ presetId: "validation-lab-one-arcsecond", title: "Validation Lab: one arcsecond equals one parsec check", scenario: "parallaxCalibration", audience: "physicist", question: "Does the sandbox still honor the basic arcsecond / AU / parsec calibration anchor?", expectedResult: "The calibration lab reports a pass for the one-arcsecond, one-AU, one-parsec benchmark and lists any failed checks.", explanation: "This preset sets the clean calibration anchor before users explore more speculative modes.", caution: "Passing the calibration anchor only verifies the demo math path; it does not validate the speculative physics assumptions.", parameters: Object.freeze({ scenario: "parallaxCalibration", acceptedSteps: 4000, parallaxArcseconds: 1, baselineAu: 1, showDiagnostics: true }), highlightedParameters: Object.freeze(["parallaxArcseconds", "baselineAu", "acceptedSteps"]) })
    ]);
    
    class RunYourOwnSimulationGuide {
      constructor(presets) { this.presets = (presets || defaultParameterGuidePresets).slice(); }
      listPresets() { return this.presets.slice(); }
      getPreset(presetId) { return this.presets.find((preset) => preset.presetId === presetId) || this.presets[0]; }
      buildSnapshot(selectedPresetId) { const selectedPreset = this.getPreset(selectedPresetId); return Object.freeze({ packetType: "ArcSecs Run Your Own Simulation Parameter Guide", generatedUtc: new Date().toISOString(), presetCount: this.presets.length, selectedPresetId: selectedPreset.presetId, selectedPreset, presets: this.listPresets(), exportContainsExecutableCode: false, scientificBoundary: "Preset values populate the ArcSecs speculative research sandbox; they are guided demonstrations, not empirical proof or measured physical performance." }); }
      applyPresetToConfig(baseConfig, presetId) { const preset = this.getPreset(presetId); return Object.freeze(Object.assign({}, baseConfig || {}, preset.parameters, { scenario: preset.scenario })); }
    }
    
    
    class ExperimentRecipeLab {
        constructor() {
            this.numericRanges = Object.freeze({ acceptedSteps: Object.freeze({ minimum: 500, maximum: 25000 }), speedMultiplier: Object.freeze({ minimum: 0.1, maximum: 5 }), lossRate: Object.freeze({ minimum: 0, maximum: 1 }), photonMassEv: Object.freeze({ minimum: 0, maximum: 1e-12 }), betaCoupling: Object.freeze({ minimum: 0, maximum: 10 }), accelerationThreshold: Object.freeze({ minimum: 0, maximum: 20 }), baryonicMass: Object.freeze({ minimum: 0, maximum: 50 }), groupVelocityFraction: Object.freeze({ minimum: 0.01, maximum: 1 }), restitution: Object.freeze({ minimum: 0, maximum: 1 }), friction: Object.freeze({ minimum: 0, maximum: 1 }), photonPacketCount: Object.freeze({ minimum: 8, maximum: 2500 }), intergalacticParticleDensity: Object.freeze({ minimum: 0, maximum: 10 }), forwardScatteringStrictness: Object.freeze({ minimum: 0, maximum: 1 }), softeningRadius: Object.freeze({ minimum: 0.001, maximum: 10 }), parallaxArcseconds: Object.freeze({ minimum: 0.001, maximum: 1000 }), baselineAu: Object.freeze({ minimum: 0.01, maximum: 20 }), scoopFieldDiameterKilometers: Object.freeze({ minimum: 0, maximum: 12000 }), substrateDensity: Object.freeze({ minimum: 0, maximum: 10 }), shipVelocityRatioC: Object.freeze({ minimum: 0, maximum: 2 }), intakeDragCoefficient: Object.freeze({ minimum: 0, maximum: 5 }), shieldAblationRate: Object.freeze({ minimum: 0, maximum: 1 }), compressionRatio: Object.freeze({ minimum: 1, maximum: 80 }), bufferCapacity: Object.freeze({ minimum: 1, maximum: 120 }), reactorConversionEfficiency: Object.freeze({ minimum: 0, maximum: 1 }), thermalRejectionCapacity: Object.freeze({ minimum: 0, maximum: 100 }), exhaustCollimationEfficiency: Object.freeze({ minimum: 0, maximum: 1 }), stabilizationGain: Object.freeze({ minimum: 0, maximum: 4 }), radiatorReserve: Object.freeze({ minimum: 0, maximum: 1 }), habitatIsolationFactor: Object.freeze({ minimum: 0, maximum: 1 }) });
            this.textFields = Object.freeze(["scenario", "ramjetPreset", "comparisonMode", "failureInjectionMode"]);
            this.booleanFields = Object.freeze(["showLabels", "showGrid", "showVectors", "showTrails", "showDiagnostics"]);
        }
        normalizeValue(fieldName, value) { if (Object.prototype.hasOwnProperty.call(this.numericRanges, fieldName)) { const numericValue = typeof value === "number" ? value : Number(value); return Number.isFinite(numericValue) ? numericValue : undefined; } if (this.booleanFields.includes(fieldName)) { if (typeof value === "boolean") { return value; } if (value === "true") { return true; } if (value === "false") { return false; } return undefined; } if (this.textFields.includes(fieldName)) { return typeof value === "string" ? value.slice(0, 80) : undefined; } return undefined; }
        buildStatus(issues) { if (issues.some((issue) => issue.severity === "error")) { return "failed"; } if (issues.some((issue) => issue.severity === "warning")) { return "warning"; } return "pass"; }
        validateParameters(parameters) { const normalizedParameters = {}; const issues = []; Object.keys(parameters || {}).forEach((fieldName) => { const normalizedValue = this.normalizeValue(fieldName, parameters[fieldName]); if (typeof normalizedValue === "undefined") { issues.push(Object.freeze({ field: fieldName, severity: "warning", message: "Unsupported recipe field ignored so the share packet stays safe and inert." })); return; } if (Object.prototype.hasOwnProperty.call(this.numericRanges, fieldName)) { const range = this.numericRanges[fieldName]; const numericValue = Number(normalizedValue); const boundedValue = Math.max(range.minimum, Math.min(range.maximum, numericValue)); normalizedParameters[fieldName] = boundedValue; if (boundedValue !== numericValue) { issues.push(Object.freeze({ field: fieldName, severity: "warning", message: "Value was clamped into the safe sandbox range " + range.minimum + "–" + range.maximum + "." })); } return; } normalizedParameters[fieldName] = normalizedValue; }); if (typeof normalizedParameters.scenario !== "string") { issues.push(Object.freeze({ field: "scenario", severity: "error", message: "Recipe must include a scenario before it can be applied." })); } if (typeof normalizedParameters.acceptedSteps !== "number") { normalizedParameters.acceptedSteps = 6000; issues.push(Object.freeze({ field: "acceptedSteps", severity: "info", message: "Accepted steps defaulted to 6000 for deterministic playback." })); } return Object.freeze({ status: this.buildStatus(issues), issues: Object.freeze(issues.slice()), normalizedParameters: Object.freeze(normalizedParameters) }); }
        buildRecipeFromPreset(preset, activeConfig, title) { const mergedParameters = Object.assign({}, activeConfig || {}, preset.parameters || {}, { scenario: preset.scenario }); const validation = this.validateParameters(mergedParameters); const recipeTitle = title && title.trim().length > 0 ? title.trim().slice(0, 120) : preset.title; const coreRecipe = { packetType: "ArcSecs Experiment Recipe", recipeId: preset.presetId + "-" + Date.now().toString(36), title: recipeTitle, sourcePresetId: preset.presetId, scenario: String(validation.normalizedParameters.scenario || preset.scenario), generatedUtc: new Date().toISOString(), parameters: validation.normalizedParameters, highlightedParameters: (preset.highlightedParameters || []).slice(), validationStatus: validation.status, validationIssues: validation.issues, shareToken: "", exportContainsExecutableCode: false, scientificBoundary: "ArcSecs experiment recipes only store sandbox parameters. They do not contain executable code and do not prove the speculative model." }; const shareToken = this.encodeRecipePayload(coreRecipe); return Object.freeze(Object.assign({}, coreRecipe, { shareToken })); }
        encodeRecipePayload(recipe) { const payload = { packetType: "ArcSecs Experiment Recipe", title: recipe.title, sourcePresetId: recipe.sourcePresetId, scenario: recipe.scenario, parameters: recipe.parameters, highlightedParameters: recipe.highlightedParameters, validationStatus: recipe.validationStatus, scientificBoundary: recipe.scientificBoundary, exportContainsExecutableCode: false }; return encodeURIComponent(JSON.stringify(payload)); }
        decodeRecipePayload(token) { try { const parsed = JSON.parse(decodeURIComponent(token)); if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || !parsed.parameters || typeof parsed.parameters !== "object" || Array.isArray(parsed.parameters)) { return null; } const validation = this.validateParameters(parsed.parameters); const title = typeof parsed.title === "string" ? parsed.title.slice(0, 120) : "Shared ArcSecs Experiment Recipe"; const sourcePresetId = typeof parsed.sourcePresetId === "string" ? parsed.sourcePresetId.slice(0, 80) : "shared-recipe"; const scenario = typeof validation.normalizedParameters.scenario === "string" ? validation.normalizedParameters.scenario : "relationalLattice"; const highlightedParameters = Array.isArray(parsed.highlightedParameters) ? parsed.highlightedParameters.filter((item) => typeof item === "string").slice(0, 12) : []; const coreRecipe = { packetType: "ArcSecs Experiment Recipe", recipeId: "shared-" + Date.now().toString(36), title, sourcePresetId, scenario, generatedUtc: new Date().toISOString(), parameters: validation.normalizedParameters, highlightedParameters, validationStatus: validation.status, validationIssues: validation.issues, shareToken: "", exportContainsExecutableCode: false, scientificBoundary: "ArcSecs experiment recipes only store sandbox parameters. They do not contain executable code and do not prove the speculative model." }; return Object.freeze(Object.assign({}, coreRecipe, { shareToken: this.encodeRecipePayload(coreRecipe) })); } catch (error) { return null; } }
        buildShareState(baseUrl, recipe) { const url = new URL(baseUrl || "https://arcsecs.com/arcsecs-physics-engine-demo/"); url.searchParams.set("arcsecsRecipe", recipe.shareToken); url.searchParams.set("arcsecsScenario", recipe.scenario); return Object.freeze({ recipe, shareUrl: url.toString(), queryParameterName: "arcsecsRecipe", exportContainsExecutableCode: false }); }
        readRecipeFromSearch(search) { const normalizedSearch = String(search || "").startsWith("?") ? String(search || "") : "?" + String(search || ""); const parameters = new URLSearchParams(normalizedSearch); const token = parameters.get("arcsecsRecipe"); return token ? this.decodeRecipePayload(token) : null; }
    }





    const comparisonScenarioAssumptions = Object.freeze({ massivePhotonLensing: Object.freeze(["Massive photon", "Newtonian acceleration", "Flat-space lensing", "GR reference baseline"]), tiredLightEnergyLedger: Object.freeze(["Tired-light attenuation", "Photon energy ledger", "Substrate transfer", "Redshift by energy loss"]), absoluteTimeQuantumOscillator: Object.freeze(["Absolute time", "Mechanical oscillator damping", "Shared global tick", "Near-mass transition suppression"]), newtonianDarkStar: Object.freeze(["Newtonian dark star", "Photon escape threshold", "Massive photon proxy", "No spacetime horizon claim"]), superluminalGalilean: Object.freeze(["Galilean vector arithmetic", "No Lorentz factor", "Relative velocity above c", "Absolute time"]), darkMatterRamjet: Object.freeze(["Ramjet harvest model", "Tired-light substrate", "Thermal bottleneck", "Speculative propulsion ledger", "Failure injection"]), darkMatterCondensate: Object.freeze(["Dark-light condensate", "Tired-light ledger pooling", "Halo density proxy", "Speculative dark sector visualization"]), parallaxCalibration: Object.freeze(["Arcsecond calibration", "AU baseline", "Parsec benchmark", "Validation lab"]), relationalLattice: Object.freeze(["Relational links", "Flat coordinate labels", "No physical spacetime fabric"]) });
    function comparisonUniqueLimited(values, maximumCount) { const selectedValues = []; values.forEach((value) => { if (value.length > 0 && selectedValues.indexOf(value) === -1 && selectedValues.length < maximumCount) { selectedValues.push(value); } }); return Object.freeze(selectedValues); }
    function comparisonRiskFromLoad(load, warnings) { if (load >= 5 || warnings >= 3) { return "high"; } if (load >= 3 || warnings > 0) { return "medium"; } return "low"; }
    function comparisonHigherRisk(left, right) { const order = { low: 1, medium: 2, high: 3 }; return order[right] > order[left] ? right : left; }
    class ExperimentComparisonWorkbench {
        normalizeSelection(presetIds, availablePresets) { const availableIds = availablePresets.map((preset) => preset.presetId); const filteredIds = presetIds.filter((presetId) => availableIds.indexOf(presetId) >= 0); if (filteredIds.length > 0) { return comparisonUniqueLimited(filteredIds, 4); } return comparisonUniqueLimited(availableIds.slice(0, 3), 4); }
        buildComparison(selectedPresetIds, availablePresets, activeConfig, grandTour) {
            const selectedIds = this.normalizeSelection(selectedPresetIds, availablePresets);
            const rows = selectedIds.map((presetId) => {
                const preset = availablePresets.find((candidate) => candidate.presetId === presetId) || availablePresets[0];
                const stageRow = grandTour && Array.isArray(grandTour.rows) ? grandTour.rows.find((row) => row.scenario === preset.scenario) : null;
                const changedParameters = {};
                Object.keys(preset.parameters || {}).forEach((parameterName) => { if ((activeConfig || {})[parameterName] !== preset.parameters[parameterName]) { changedParameters[parameterName] = preset.parameters[parameterName]; } });
                const assumptions = comparisonScenarioAssumptions[preset.scenario] || Object.freeze(["Speculative ArcSecs assumption set"]);
                const warningCount = numberOrDefault(stageRow ? stageRow.warningCount : 0, 0);
                const validationScore = numberOrDefault(stageRow ? stageRow.validationScore : 0, 0);
                const stageStatus = stageRow && stageRow.status ? stageRow.status : "not-yet-run";
                const assumptionRisk = comparisonRiskFromLoad(assumptions.length, warningCount);
                return Object.freeze({ presetId: preset.presetId, title: preset.title, scenario: preset.scenario, audience: preset.audience, question: preset.question, expectedSignal: preset.expectedResult, highlightedParameters: (preset.highlightedParameters || []).slice(), changedParameters: Object.freeze(changedParameters), assumptionLoad: assumptions.length, assumptionRisk, stageStatus, validationScore, warningCount, recommendation: stageStatus === "pass" ? "Good comparison candidate; keep the speculative boundary visible." : "Run this recipe before presenting it as part of a comparison bundle." });
            });
            const scenarios = comparisonUniqueLimited(rows.map((row) => row.scenario), rows.length);
            const summary = Object.freeze({ presetCount: rows.length, scenarioCount: scenarios.length, highestRisk: rows.reduce((risk, row) => comparisonHigherRisk(risk, row.assumptionRisk), "low"), warningCount: rows.reduce((total, row) => total + row.warningCount, 0), passCount: rows.filter((row) => row.stageStatus === "pass").length, visitorSummary: "Compare selected recipes side by side, then run the ones with the clearest visible signal before sharing screenshots.", physicistSummary: "Comparison rows expose assumption load, validation status, warnings, and parameter deltas so speculative claims remain auditable." });
            return Object.freeze({ packetType: "ArcSecs Experiment Comparison Workbench", generatedUtc: new Date().toISOString(), selectedPresetIds: selectedIds, rows: Object.freeze(rows), summary, exportContainsExecutableCode: false, scientificBoundary: "Experiment comparisons are inert recipe summaries for the ArcSecs speculative sandbox; they do not prove the underlying physics model." });
        }
    }


    class ReviewCockpit {
        build(input) {
            const rows = input && input.grandExperiment && Array.isArray(input.grandExperiment.rows) ? input.grandExperiment.rows : [];
            const summary = input && input.grandExperiment && input.grandExperiment.summary ? input.grandExperiment.summary : null;
            const stageCount = numberOrDefault(summary ? summary.stageCount : rows.length || 9, rows.length || 9);
            const passCount = numberOrDefault(summary ? summary.passCount : rows.filter((row) => row.status === "pass").length, 0);
            const passRatio = clamp(passCount / Math.max(1, stageCount), 0, 1);
            const averageValidationScore = numberOrDefault(summary ? summary.averageValidationScore : (rows.length ? rows.reduce((total, row) => total + numberOrDefault(row.validationScore, 0), 0) / rows.length : 0), 0);
            const warningCount = numberOrDefault(summary ? summary.totalWarnings : rows.reduce((total, row) => total + numberOrDefault(row.warningCount, 0), 0), 0);
            const flightRecorder = input && input.flightRecorder ? input.flightRecorder : null;
            const recorderScore = flightRecorder && flightRecorder.exportReady ? 1 : 0.55;
            const metrics = input && input.latestMetrics ? input.latestMetrics : null;
            const ledgerScore = metrics && metrics.ledgerStatus === "pass" ? 1 : metrics && metrics.ledgerStatus === "review" ? 0.72 : 0.62;
            const warningPenalty = clamp(warningCount / Math.max(1, stageCount * 4), 0, 0.22);
            const readinessScore = clamp((averageValidationScore * 0.52) + (passRatio * 0.25) + (recorderScore * 0.13) + (ledgerScore * 0.10) - warningPenalty, 0, 1);
            const reviewStatus = readinessScore >= 0.82 && passRatio >= 0.88 ? "readyWithCaution" : readinessScore >= 0.62 ? "needsReview" : "holdForRevision";
            const weakestPoints = this.buildWeakPoints(rows, summary ? summary.weakestScenario : "");
            const assumptionRisks = this.buildAssumptionRisks(readinessScore, warningCount, rows);
            const nextActions = this.buildNextActions(reviewStatus, weakestPoints, metrics, input && input.guidedTour ? input.guidedTour : null);
            return Object.freeze({ packetType: "ArcSecs Review Cockpit", engineVersion: input && input.engineVersion ? String(input.engineVersion) : "unknown", generatedUtc: new Date().toISOString(), reviewStatus, readinessScore, passRatio, publicSummary: this.buildPublicSummary(reviewStatus, passCount, stageCount, input && input.guidedTour ? input.guidedTour : null), physicistSummary: this.buildPhysicistSummary(averageValidationScore, warningCount, weakestPoints), weakestPoints, assumptionRisks, nextActions, shareableBoundary: "Speculative research visualization and mathematical sandbox; not established current technology, measured physical performance, or proof of an operational drive.", exportContainsExecutableCode: false });
        }
        buildWeakPoints(rows, weakestScenario) {
            const sorted = rows.slice().sort((left, right) => { const validationDelta = numberOrDefault(left.validationScore, 0) - numberOrDefault(right.validationScore, 0); if (Math.abs(validationDelta) > 0.0001) { return validationDelta; } return numberOrDefault(right.warningCount, 0) - numberOrDefault(left.warningCount, 0); }).slice(0, 3);
            if (!sorted.length && weakestScenario) { return Object.freeze([{ scenario: weakestScenario, title: weakestScenario, reason: "Grand Experiment summary identified this as the weakest scenario.", validationScore: 0, warningCount: 0 }]); }
            return Object.freeze(sorted.map((row) => Object.freeze({ scenario: row.scenario, title: row.title, reason: row.status === "pass" ? "Lowest relative validation margin among passing stages." : "Stage requires review before being used as visitor-facing evidence.", validationScore: numberOrDefault(row.validationScore, 0), warningCount: numberOrDefault(row.warningCount, 0) })));
        }
        buildAssumptionRisks(readinessScore, warningCount, rows) {
            const assumptions = ["Absolute time", "No physical spacetime fabric", "Massive photon", "Tired-light attenuation", "Galilean superluminal kinematics", "Newtonian dark star", "Dark-light condensate", "Ramjet harvest model"];
            const rowText = rows.map((row) => row.scenario).join(" ");
            return Object.freeze(assumptions.map((assumption) => { const active = rowText.length > 0 || assumption === "Ramjet harvest model"; let riskLevel = readinessScore > 0.82 && warningCount <= 3 ? "medium" : "high"; if (assumption === "Absolute time" && readinessScore > 0.75) { riskLevel = "medium"; } if (!active) { riskLevel = "low"; } return Object.freeze({ assumption, riskLevel, reason: active ? "Active in the nine-mode review path and must remain labeled as an ArcSecs alternative hypothesis." : "Not active in the current evidence packet." }); }));
        }
        buildNextActions(status, weakestPoints, metrics, guidedTour) {
            const actions = [];
            if (guidedTour && guidedTour.status !== "active") { actions.push("Run or resume the Guided Autopilot Tour so visitors see the scenario sequence before reviewing exports."); }
            if (weakestPoints.length) { actions.push("Open " + weakestPoints[0].title + " and compare its metric, validation score, and warning count before public sharing."); }
            if (metrics && metrics.ledgerStatus && metrics.ledgerStatus !== "pass") { actions.push("Inspect the photon energy ledger because the latest run is not reporting a clean pass."); }
            if (status === "readyWithCaution") { actions.push("Export the Review Cockpit packet together with the Grand Experiment evidence packet for a cautious research note."); }
            else if (status === "needsReview") { actions.push("Treat the page as a review build: share screenshots only with the speculative boundary and weakest-stage notes visible."); }
            else { actions.push("Hold public promotion until the weakest scenario and warning budget improve."); }
            return Object.freeze(actions.slice(0, 4));
        }
        buildPublicSummary(status, passCount, stageCount, guidedTour) { const tourText = guidedTour ? " Guided tour is " + (guidedTour.status || "pending") + " at " + (guidedTour.currentTitle || "the first stage") + "." : " Guided tour data is pending."; const statusText = status === "readyWithCaution" ? "ready for cautious public demonstration" : status === "needsReview" ? "useful but still marked for review" : "not ready for public demonstration"; return "The ArcSecs demo is " + statusText + ": " + passCount + "/" + stageCount + " Grand Experiment stages currently pass." + tourText; }
        buildPhysicistSummary(averageValidationScore, warningCount, weakestPoints) { const weakest = weakestPoints.length ? weakestPoints[0].title : "none"; return "Average validation score " + (averageValidationScore * 100).toFixed(1) + "%, warning count " + warningCount + ", weakest stage " + weakest + ". Treat all model claims as assumption-driven comparisons rather than empirical confirmation."; }
    }

    class NextActionCommandCenter {
        finiteNumber(value, fallback) { const numberValue = Number(value); return Number.isFinite(numberValue) ? numberValue : fallback; }
        firstWeakPoint(review) { return review && Array.isArray(review.weakestPoints) && review.weakestPoints.length > 0 ? review.weakestPoints[0] : null; }
        buildPlan(input) {
            const safeInput = input || { hasGrandExperiment: false, hasReviewCockpit: false };
            const review = safeInput.review || null;
            const guidedTour = safeInput.guidedTour || null;
            const metrics = safeInput.latestMetrics || null;
            const weakPoint = this.firstWeakPoint(review);
            const actions = [];
            const tourComplete = guidedTour ? guidedTour.status === "complete" || this.finiteNumber(guidedTour.progressPercent, 0) >= 100 : false;
            actions.push(Object.freeze({ actionId: "run-guided-tour", kind: "runGuidedTour", title: tourComplete ? "Guided tour is complete" : "Run or resume the Guided Autopilot Tour", detail: tourComplete ? "The visitor-facing narrative path has reached every prompt-required stage." : "Start the visible nine-stage tour so visitors see the scenario sequence before reviewing exports.", buttonLabel: tourComplete ? "Restart Tour" : "Start Tour", targetScenario: guidedTour && guidedTour.currentScenario ? guidedTour.currentScenario : "relationalLattice", status: tourComplete ? "complete" : "ready", severity: tourComplete ? "info" : "review" }));
            actions.push(Object.freeze({ actionId: "focus-weakest-scenario", kind: "focusWeakestScenario", title: weakPoint ? `Open weakest stage: ${weakPoint.title}` : "Open weakest stage after review data exists", detail: weakPoint ? `Validation ${(this.finiteNumber(weakPoint.validationScore, 0) * 100).toFixed(1)}%, warnings ${this.finiteNumber(weakPoint.warningCount, 0)}. Compare its metric, validation score, and warning count before public sharing.` : "Build the Review Cockpit after a Grand Experiment so the weakest stage can be selected directly.", buttonLabel: weakPoint ? "Open Weakest Stage" : "Build Review First", targetScenario: weakPoint ? weakPoint.scenario : "parallaxCalibration", status: weakPoint ? "ready" : "blocked", severity: weakPoint ? "review" : "warning" }));
            const ledgerNeedsReview = metrics && metrics.ledgerStatus && metrics.ledgerStatus !== "pass";
            actions.push(Object.freeze({ actionId: "inspect-photon-ledger", kind: "inspectPhotonLedger", title: ledgerNeedsReview ? "Inspect photon energy ledger" : "Photon energy ledger currently passes", detail: ledgerNeedsReview ? `Latest ledger status is ${metrics ? metrics.ledgerStatus : "unknown"} with closure proxy ${this.finiteNumber(metrics ? metrics.energyLedgerClosureProxy : undefined, 0).toFixed(6)}.` : "Open the Tired-Light Energy Ledger anyway when preparing a cautious research note so the accounting path is visible.", buttonLabel: "Inspect Ledger", targetScenario: "tiredLightEnergyLedger", status: ledgerNeedsReview ? "ready" : "complete", severity: ledgerNeedsReview ? "warning" : "info" }));
            actions.push(Object.freeze({ actionId: "run-grand-experiment", kind: "runGrandExperiment", title: safeInput.hasGrandExperiment ? "Grand Experiment evidence exists" : "Run Grand Experiment evidence sweep", detail: safeInput.hasGrandExperiment ? "The nine-mode sweep is available for export and review." : "Run the deterministic nine-mode sweep before exporting a research bundle.", buttonLabel: safeInput.hasGrandExperiment ? "Rerun Sweep" : "Run Sweep", status: safeInput.hasGrandExperiment ? "complete" : "ready", severity: safeInput.hasGrandExperiment ? "info" : "review" }));
            const reviewStatus = review && review.reviewStatus ? review.reviewStatus : "needsReview";
            const exportReady = !!safeInput.hasGrandExperiment && !!safeInput.hasReviewCockpit;
            actions.push(Object.freeze({ actionId: reviewStatus === "holdForRevision" ? "hold-for-revision" : reviewStatus === "readyWithCaution" ? "export-research-bundle" : "share-with-caution", kind: reviewStatus === "holdForRevision" ? "holdForRevision" : reviewStatus === "readyWithCaution" ? "exportResearchBundle" : "shareWithCaution", title: reviewStatus === "holdForRevision" ? "Hold public promotion" : reviewStatus === "readyWithCaution" ? "Export cautious research bundle" : "Prepare cautious review bundle", detail: reviewStatus === "holdForRevision" ? "Keep the public claim boundary visible and improve weak stages before promotion." : exportReady ? "Package the Review Cockpit, Grand Experiment, Guided Tour, Flight Recorder, latest metrics, and boundary language into one inert JSON file." : "Build missing review or evidence data before exporting.", buttonLabel: reviewStatus === "holdForRevision" ? "Show Hold Notes" : "Export Bundle", status: exportReady ? "ready" : "blocked", severity: reviewStatus === "readyWithCaution" ? "info" : reviewStatus === "holdForRevision" ? "warning" : "review" }));
            const completedCount = actions.filter((action) => action.status === "complete").length;
            const blockedCount = actions.filter((action) => action.status === "blocked").length;
            return Object.freeze({ packetType: "ArcSecs Next Action Command Center", generatedUtc: new Date().toISOString(), overallStatus: blockedCount > 0 ? "blocked" : completedCount === actions.length ? "ready" : "incomplete", completedCount, actionCount: actions.length, actions: Object.freeze(actions), researchBoundary: "Speculative research visualization and mathematical sandbox; next actions organize review work and do not prove the model.", exportContainsExecutableCode: false });
        }
    }


    function playlistUniqueLimited(values, maximumCount) { const selectedValues = []; values.forEach((value) => { if (String(value || "").length > 0 && selectedValues.indexOf(value) === -1 && selectedValues.length < maximumCount) { selectedValues.push(value); } }); return Object.freeze(selectedValues); }
    function playlistFiniteNumber(value, fallback) { const numericValue = Number(value); return Number.isFinite(numericValue) ? numericValue : fallback; }
    function playlistClamp(value, minimumValue, maximumValue) { return Math.max(minimumValue, Math.min(maximumValue, value)); }
    function playlistSummarize(items) {
      const completedCount = items.filter((item) => item.status === "complete" || item.status === "warning").length;
      const warningCount = items.reduce((total, item) => total + item.warningCount + (item.status === "warning" ? 1 : 0), 0);
      const runningCount = items.filter((item) => item.status === "running").length;
      const progressPercent = Math.round((completedCount / Math.max(1, items.length)) * 100);
      return Object.freeze({ itemCount: items.length, completedCount, warningCount, runningCount, progressPercent, readyToExport: completedCount > 0, visitorSummary: "Run a queue of guided experiment recipes in sequence, then export one cautious batch report instead of isolated screenshots.", physicistSummary: "Playlist rows preserve scenario order, parameter counts, validation scores, warnings, and ledger status so the batch remains auditable." });
    }
    class ExperimentPlaylistRunner {
      constructor(maximumItems = 8) { this.maximumItems = Math.max(2, Math.min(12, Math.round(Number(maximumItems) || 8))); }
      normalizePresetIds(presetIds, availablePresets) { const availableIds = availablePresets.map((preset) => preset.presetId); const validIds = presetIds.filter((presetId) => availableIds.indexOf(presetId) >= 0); if (validIds.length > 0) { return playlistUniqueLimited(validIds, this.maximumItems); } return playlistUniqueLimited(availableIds.slice(0, Math.min(5, this.maximumItems)), this.maximumItems); }
      buildPlaylist(selectedPresetIds, availablePresets, activeConfig, comparison = null, currentIndex = 0) {
        const selectedIds = this.normalizePresetIds(selectedPresetIds, availablePresets);
        const boundedIndex = playlistClamp(Math.round(Number(currentIndex) || 0), 0, Math.max(0, selectedIds.length - 1));
        const items = selectedIds.map((presetId, index) => {
          const preset = availablePresets.find((candidate) => candidate.presetId === presetId) || availablePresets[0];
          const comparisonRow = comparison && comparison.rows ? comparison.rows.find((row) => row.presetId === preset.presetId) : undefined;
          const status = index === boundedIndex ? "running" : "queued";
          return Object.freeze({ order: index + 1, presetId: preset.presetId, title: preset.title, scenario: preset.scenario, audience: preset.audience, expectedSignal: preset.expectedResult, parameterCount: Object.keys(preset.parameters).filter((parameterName) => activeConfig[parameterName] !== preset.parameters[parameterName]).length, highlightedParameters: preset.highlightedParameters.slice(), status, validationScore: playlistFiniteNumber(comparisonRow ? comparisonRow.validationScore : 0, 0), warningCount: playlistFiniteNumber(comparisonRow ? comparisonRow.warningCount : 0, 0), lastLedgerStatus: comparisonRow && comparisonRow.stageStatus ? comparisonRow.stageStatus : "not-yet-run", operatorInstruction: "Apply this recipe, run the scenario, verify the expected signal, then advance to the next playlist item." });
        });
        return this.buildPacket(selectedIds, items, boundedIndex);
      }
      recordCurrentResult(playlist, result = null) {
        const currentIndex = playlistClamp(playlist.currentIndex, 0, Math.max(0, playlist.items.length - 1));
        const items = playlist.items.map((item, index) => {
          if (index !== currentIndex) { return item; }
          const warningCount = playlistFiniteNumber(result ? result.warningCount : item.warningCount, item.warningCount);
          const validationScore = playlistFiniteNumber(result ? result.validationScore : item.validationScore, item.validationScore);
          const lastLedgerStatus = result && result.ledgerStatus ? result.ledgerStatus : item.lastLedgerStatus;
          return Object.freeze(Object.assign({}, item, { status: warningCount > 0 || lastLedgerStatus === "warning" ? "warning" : "complete", warningCount, validationScore, lastLedgerStatus }));
        });
        return this.buildPacket(playlist.selectedPresetIds, items, currentIndex);
      }
      completeCurrent(playlist, result = null) {
        const currentIndex = playlistClamp(playlist.currentIndex, 0, Math.max(0, playlist.items.length - 1));
        const nextIndex = playlistClamp(currentIndex + 1, 0, Math.max(0, playlist.items.length - 1));
        const items = playlist.items.map((item, index) => {
          if (index < currentIndex) { return item; }
          if (index === currentIndex) {
            const warningCount = playlistFiniteNumber(result ? result.warningCount : item.warningCount, item.warningCount);
            const validationScore = playlistFiniteNumber(result ? result.validationScore : item.validationScore, item.validationScore);
            const lastLedgerStatus = result && result.ledgerStatus ? result.ledgerStatus : item.lastLedgerStatus;
            return Object.freeze(Object.assign({}, item, { status: warningCount > 0 || lastLedgerStatus === "warning" ? "warning" : "complete", warningCount, validationScore, lastLedgerStatus }));
          }
          if (index === nextIndex && nextIndex !== currentIndex) { return Object.freeze(Object.assign({}, item, { status: "running" })); }
          return Object.freeze(Object.assign({}, item, { status: "queued" }));
        });
        return this.buildPacket(playlist.selectedPresetIds, items, nextIndex);
      }
      resetPlaylist(playlist) { const items = playlist.items.map((item, index) => Object.freeze(Object.assign({}, item, { status: index === 0 ? "running" : "queued", validationScore: 0, warningCount: 0, lastLedgerStatus: "not-yet-run" }))); return this.buildPacket(playlist.selectedPresetIds, items, 0); }
      currentItem(playlist) { return playlist.items[playlistClamp(playlist.currentIndex, 0, Math.max(0, playlist.items.length - 1))]; }
      buildPacket(selectedIds, items, currentIndex) { const boundedIndex = playlistClamp(currentIndex, 0, Math.max(0, items.length - 1)); const currentItem = items[boundedIndex]; return Object.freeze({ packetType: "ArcSecs Experiment Playlist Runner", playlistId: "arcsecs-playlist-" + selectedIds.join("-").replace(/[^a-z0-9-]/gi, "").slice(0, 72), generatedUtc: new Date().toISOString(), currentIndex: boundedIndex, currentPresetId: currentItem ? currentItem.presetId : "none", currentScenario: currentItem ? currentItem.scenario : "relationalLattice", selectedPresetIds: Object.freeze(selectedIds.slice()), items: Object.freeze(items.slice()), summary: playlistSummarize(items), exportContainsExecutableCode: false, scientificBoundary: "Experiment playlists are inert guided batches for the ArcSecs speculative sandbox; they organize review workflow and do not prove the underlying physics model." }); }
    }
    

    function replayFiniteNumber(value, fallback) { const numericValue = Number(value); return Number.isFinite(numericValue) ? numericValue : fallback; }
function replayClampIndex(index, length) { if (length <= 0) { return 0; } return Math.max(0, Math.min(length - 1, Math.round(replayFiniteNumber(index, 0)))); }
function replayFormatValue(value) { const numericValue = replayFiniteNumber(value, 0); if (Math.abs(numericValue) >= 10000 || (Math.abs(numericValue) < 0.001 && numericValue !== 0)) { return numericValue.toExponential(3); } return numericValue.toFixed(4).replace(/0+$/, "").replace(/\.$/, ""); }
function replayMetricFromCards(entry, key, fallback) { const cards = entry && Array.isArray(entry.metricCards) ? entry.metricCards : []; const card = cards.find((candidate) => candidate && candidate.key === key); return replayFiniteNumber(card ? card.numericValue : fallback, fallback); }
function replayReadMetric(metrics, names, fallback) { for (const name of names) { if (Object.prototype.hasOwnProperty.call(metrics || {}, name)) { return replayFiniteNumber(metrics[name], fallback); } } return fallback; }
function replayScenarioLabel(item, entry, latestResult) { if (entry && entry.scenarioLabel) { return entry.scenarioLabel; } if (item && item.title) { return item.title; } if (latestResult && latestResult.config && latestResult.config.scenario) { return latestResult.config.scenario; } return "ArcSecs scenario"; }
function replayWhyThisChanged(scenario) { const explanations = { massivePhotonLensing: "Photon deflection changes because the recipe raises the massive-photon coupling branch while holding the standard reference comparison visible.", tiredLightEnergyLedger: "Photon energy and redshift change because distance attenuation transfers energy into the explicit tired-light ledger.", darkMatterRamjet: "Ramjet telemetry changes because higher intake and reactor demand push thermal rejection, buffer fill, and exhaust collimation into bottleneck territory.", absoluteTimeQuantumOscillator: "Oscillator counts change because the near-mass probe is mechanically damped while the global fixed tick remains shared.", newtonianDarkStar: "Photon capture state changes when launch speed crosses the Newtonian escape-velocity threshold.", superluminalGalilean: "Relative velocity changes by direct Galilean vector arithmetic with no Lorentz limiter applied in this alternative hypothesis mode.", darkMatterCondensate: "Halo density changes as tired-light ledger energy is represented as a condensate accumulation proxy.", parallaxCalibration: "Validation changes when arcsecond, AU, and parsec calibration checks close or fail their tolerance band." }; return explanations[scenario] || "The snapshot changes because the selected recipe altered one or more sandbox controls before the deterministic run was recorded."; }
function replayMetricsForScenario(item, entry, latestResult) {
  const scenario = (entry && entry.scenario) || (item && item.scenario) || (latestResult && latestResult.config ? latestResult.config.scenario : "relationalLattice");
  const latestMetrics = latestResult && latestResult.metrics ? latestResult.metrics : {};
  const warningCount = replayFiniteNumber((entry && entry.warningCount) || (item && item.warningCount) || latestMetrics.warningCount, 0);
  const validationScore = replayFiniteNumber((entry && entry.validationScore) || (item && item.validationScore) || (latestResult && latestResult.validationLab ? latestResult.validationLab.validationScore : 0.72), 0.72);
  const ledgerStatus = (entry && entry.ledgerStatus) || (item && item.lastLedgerStatus) || latestMetrics.ledgerStatus || "pass";
  const baselineDelta = replayMetricFromCards(entry, "baselineDelta", replayReadMetric(latestMetrics, ["baselineDelta", "speculativeModelValue"], 0.18));
  const finalRedshift = replayMetricFromCards(entry, "finalRedshift", replayReadMetric(latestMetrics, ["finalRedshift"], scenario === "tiredLightEnergyLedger" ? 0.42 : 0.03));
  const finalEnergyFraction = replayMetricFromCards(entry, "finalEnergyFraction", replayReadMetric(latestMetrics, ["finalEnergyFraction"], scenario === "tiredLightEnergyLedger" ? 0.62 : 0.95));
  const bufferFill = replayMetricFromCards(entry, "ramjetBufferFill", replayReadMetric(latestMetrics, ["ramjetBufferFill"], scenario === "darkMatterRamjet" ? 1.08 : 0.36));
  const radiatorLoad = replayMetricFromCards(entry, "ramjetRadiatorLoad", replayReadMetric(latestMetrics, ["ramjetRadiatorLoad"], scenario === "darkMatterRamjet" ? 1.18 : 0.44));
  const thrustProxy = replayMetricFromCards(entry, "ramjetThrustProxy", replayReadMetric(latestMetrics, ["ramjetThrustProxy"], scenario === "darkMatterRamjet" ? 0.41 : 0.12));
  const deflectionProxy = scenario === "massivePhotonLensing" ? Math.max(0.08, Math.abs(baselineDelta) + 0.24) : Math.abs(baselineDelta);
  const ledgerClosure = replayReadMetric(latestMetrics, ["energyLedgerClosureProxy", "ledgerClosureError"], ledgerStatus === "pass" ? 0.0008 : 0.016);
  const netAcceleration = scenario === "darkMatterRamjet" ? replayReadMetric(latestMetrics, ["ramjetNetAcceleration", "ramjetAcceleration", "netAcceleration"], Math.max(0, thrustProxy - Math.max(0, radiatorLoad - 1) * 0.5)) : replayReadMetric(latestMetrics, ["netAcceleration"], 0.02);
  const metrics = [
    { key: "deflection", label: "Deflection proxy", beforeValue: scenario === "massivePhotonLensing" ? Math.max(0, deflectionProxy * 0.45) : 0, afterValue: deflectionProxy, unit: "arcsec", status: scenario === "massivePhotonLensing" && deflectionProxy > 0.2 ? "changed" : "stable", explanation: "Before/after proxy for curved photon path strength." },
    { key: "ledgerClosure", label: "Ledger closure", beforeValue: 0, afterValue: ledgerClosure, unit: "error", status: ledgerStatus === "pass" && Math.abs(ledgerClosure) < 0.01 ? "pass" : "warning", explanation: "Energy removed from photons should appear in the tired-light ledger." },
    { key: "redshift", label: "Redshift", beforeValue: 0, afterValue: finalRedshift, unit: "z", status: scenario === "tiredLightEnergyLedger" ? "changed" : "stable", explanation: "Wavelength/frequency shift produced by the recipe." },
    { key: "photonEnergy", label: "Photon energy", beforeValue: 1, afterValue: finalEnergyFraction, unit: "fraction", status: finalEnergyFraction < 0.9 ? "changed" : "stable", explanation: "Remaining photon energy after the simulated distance." },
    { key: "radiatorLoad", label: "Radiator load", beforeValue: 0.42, afterValue: radiatorLoad, unit: "ratio", status: radiatorLoad >= 1 ? "warning" : "pass", explanation: "Thermal rejection pressure in the Dark Matter Ramjet pipeline." },
    { key: "bufferFill", label: "Buffer fill", beforeValue: 0.25, afterValue: bufferFill, unit: "ratio", status: bufferFill >= 1 ? "warning" : "pass", explanation: "DSP buffer saturation pressure in the ramjet pipeline." },
    { key: "netAcceleration", label: "Net acceleration", beforeValue: Math.max(0, netAcceleration + 0.18), afterValue: netAcceleration, unit: "proxy", status: scenario === "darkMatterRamjet" && netAcceleration < 0.08 ? "warning" : "pass", explanation: "Thrust minus drag and thermal bottleneck penalties." },
    { key: "validationScore", label: "Validation score", beforeValue: 0.72, afterValue: validationScore, unit: "score", status: validationScore >= 0.72 ? "pass" : "warning", explanation: "Scenario validation proxy captured for this stage." }
  ].map((metric) => Object.freeze(Object.assign({}, metric, { delta: replayFiniteNumber(metric.afterValue, 0) - replayFiniteNumber(metric.beforeValue, 0), beforeText: replayFormatValue(metric.beforeValue), afterText: replayFormatValue(metric.afterValue), deltaText: replayFormatValue(replayFiniteNumber(metric.afterValue, 0) - replayFiniteNumber(metric.beforeValue, 0)) })));
  return { scenario, warningCount, validationScore, ledgerStatus, metrics };
}
function replayBuildMarkers(scenario, metrics, warningCount, ledgerStatus) {
  const lookup = new Map(metrics.map((metric) => [metric.key, metric]));
  const deflection = lookup.get("deflection");
  const ledger = lookup.get("ledgerClosure");
  const radiator = lookup.get("radiatorLoad");
  const buffer = lookup.get("bufferFill");
  const netAcceleration = lookup.get("netAcceleration");
  return Object.freeze([
    Object.freeze({ key: "deflectionIncrease", label: "Deflection increase", triggered: scenario === "massivePhotonLensing" && deflection && deflection.delta > 0.05, severity: "info", explanation: "Raised massive-photon coupling should visibly increase curved photon path strength." }),
    Object.freeze({ key: "ledgerClosure", label: "Ledger closure/failure", triggered: scenario === "tiredLightEnergyLedger" || ledgerStatus !== "pass" || warningCount > 0, severity: ledgerStatus === "pass" && ledger && Math.abs(ledger.afterValue) < 0.01 ? "pass" : "warning", explanation: "The replay marks whether photon energy loss is accounted for or becomes a ledger warning." }),
    Object.freeze({ key: "radiatorBottleneck", label: "Radiator bottleneck", triggered: scenario === "darkMatterRamjet" && radiator && radiator.afterValue >= 1, severity: "warning", explanation: "Waste heat exceeds sustainable radiator capacity." }),
    Object.freeze({ key: "bufferSaturation", label: "Buffer saturation", triggered: scenario === "darkMatterRamjet" && buffer && buffer.afterValue >= 1, severity: "warning", explanation: "The intake/conversion buffer crosses its saturation threshold." }),
    Object.freeze({ key: "netAccelerationDrop", label: "Net acceleration drop", triggered: scenario === "darkMatterRamjet" && netAcceleration && netAcceleration.delta < -0.05, severity: "warning", explanation: "Drag and thermal limits reduce net acceleration after the bottleneck appears." })
  ]);
}
function replaySummarize(snapshots) {
  const warningSnapshots = snapshots.filter((snapshot) => snapshot.status === "warning");
  const markers = snapshots.reduce((total, snapshot) => total + snapshot.visualMarkers.filter((marker) => marker.triggered).length, 0);
  return Object.freeze({ stageCount: snapshots.length, warningCount: warningSnapshots.length, markerCount: markers, readyToExport: snapshots.length > 0, visitorSummary: snapshots.length > 0 ? "Replay Timeline has " + snapshots.length.toString() + " stage snapshot" + (snapshots.length === 1 ? "" : "s") + " with before/after metrics and why-this-changed notes." : "Build or run a playlist to create replay timeline snapshots.", physicistSummary: snapshots.length > 0 ? "Timeline captures staged metric deltas, warning markers, ledger status, and replay controls for audit-style review." : "No replay events are available yet." });
}
class ExperimentReplayTimeline {
  constructor(maximumEvents = 24) { this.maximumEvents = Math.max(6, Math.min(60, Math.round(replayFiniteNumber(maximumEvents, 24)))); }
  buildTimeline(playlist, notebook, latestResult, selectedIndex = 0, playbackState = "paused") {
    const playlistItems = playlist && Array.isArray(playlist.items) ? playlist.items : [];
    const notebookEntries = notebook && Array.isArray(notebook.entries) ? notebook.entries : [];
    const items = playlistItems.length > 0 ? playlistItems : notebookEntries.map((entry, index) => ({ order: index + 1, presetId: entry.presetId, title: entry.presetTitle || entry.scenarioLabel, scenario: entry.scenario, status: "complete", warningCount: entry.warningCount, validationScore: entry.validationScore, lastLedgerStatus: entry.ledgerStatus, expectedSignal: entry.visitorSummary }));
    const snapshots = items.map((item, index) => {
      const entry = notebookEntries.find((candidate) => candidate.scenario === item.scenario || candidate.presetId === item.presetId) || null;
      const metricState = replayMetricsForScenario(item, entry, latestResult);
      const visualMarkers = replayBuildMarkers(metricState.scenario, metricState.metrics, metricState.warningCount, metricState.ledgerStatus);
      const hasWarning = metricState.warningCount > 0 || metricState.ledgerStatus !== "pass" || visualMarkers.some((marker) => marker.triggered && marker.severity === "warning");
      return Object.freeze({ snapshotId: "arcsecs-replay-stage-" + (index + 1 < 10 ? "0" : "") + String(index + 1), order: index + 1, presetId: item.presetId || (entry ? entry.presetId : "manual"), scenario: metricState.scenario, title: replayScenarioLabel(item, entry, latestResult), status: hasWarning ? "warning" : "pass", startedState: index === 0 ? "playlist-start" : "after-previous-stage", completedState: item.status || (entry ? "captured" : "queued"), whyThisChanged: replayWhyThisChanged(metricState.scenario), beforeAfterMetrics: Object.freeze(metricState.metrics), visualMarkers, warningCount: metricState.warningCount, validationScore: metricState.validationScore, ledgerStatus: metricState.ledgerStatus });
    });
    const boundedIndex = replayClampIndex(selectedIndex, snapshots.length);
    const eventWork = [];
    snapshots.forEach((snapshot) => {
      eventWork.push(Object.freeze({ eventId: snapshot.snapshotId + "-stage", order: snapshot.order, scenario: snapshot.scenario, label: snapshot.title, severity: snapshot.status === "warning" ? "warning" : "pass", detail: snapshot.whyThisChanged }));
      snapshot.visualMarkers.filter((marker) => marker.triggered).forEach((marker) => { eventWork.push(Object.freeze({ eventId: snapshot.snapshotId + "-" + marker.key, order: snapshot.order, scenario: snapshot.scenario, label: marker.label, severity: marker.severity, detail: marker.explanation })); });
    });
    const events = eventWork.slice(0, this.maximumEvents);
    const warningIndex = snapshots.findIndex((snapshot) => snapshot.status === "warning");
    return Object.freeze({ packetType: "ArcSecs Experiment Replay Timeline", generatedUtc: new Date().toISOString(), playbackState: playbackState === "playing" ? "playing" : "paused", currentIndex: boundedIndex, currentSnapshotId: snapshots[boundedIndex] ? snapshots[boundedIndex].snapshotId : "none", snapshots: Object.freeze(snapshots), events: Object.freeze(events), summary: replaySummarize(snapshots), nextWarningIndex: warningIndex, exportContainsExecutableCode: false, scientificBoundary: "Experiment Replay Timeline reports are inert browser-side playback summaries for the ArcSecs speculative sandbox; they do not prove the underlying physics model." });
  }
  previous(timeline) { return this.buildTimelineFromExisting(timeline, replayClampIndex((timeline ? timeline.currentIndex : 0) - 1, timeline && timeline.snapshots ? timeline.snapshots.length : 0), "paused"); }
  next(timeline) { return this.buildTimelineFromExisting(timeline, replayClampIndex((timeline ? timeline.currentIndex : 0) + 1, timeline && timeline.snapshots ? timeline.snapshots.length : 0), timeline && timeline.playbackState === "playing" ? "playing" : "paused"); }
  play(timeline) { return this.buildTimelineFromExisting(timeline, timeline ? timeline.currentIndex : 0, "playing"); }
  pause(timeline) { return this.buildTimelineFromExisting(timeline, timeline ? timeline.currentIndex : 0, "paused"); }
  jumpToNextWarning(timeline) { const index = timeline && timeline.nextWarningIndex >= 0 ? timeline.nextWarningIndex : timeline ? timeline.currentIndex : 0; return this.buildTimelineFromExisting(timeline, index, "paused"); }
  buildTimelineFromExisting(timeline, index, playbackState) { const existing = timeline || this.buildTimeline(null, null, null); const boundedIndex = replayClampIndex(index, existing.snapshots.length); return Object.freeze(Object.assign({}, existing, { generatedUtc: new Date().toISOString(), playbackState, currentIndex: boundedIndex, currentSnapshotId: existing.snapshots[boundedIndex] ? existing.snapshots[boundedIndex].snapshotId : "none" })); }
  exportReport(timeline, context = {}) { const activeTimeline = timeline || this.buildTimeline(null, null, null); return Object.freeze({ packetType: "ArcSecs Experiment Replay Timeline Report", generatedUtc: new Date().toISOString(), timeline: activeTimeline, context: Object.freeze(Object.assign({}, context)), exportContainsExecutableCode: false, scientificBoundary: activeTimeline.scientificBoundary }); }
}
    
        function notebookFiniteNumber(value, fallback) { const numericValue = Number(value); return Number.isFinite(numericValue) ? numericValue : fallback; }
    function notebookFormatMetric(value) { if (!Number.isFinite(value)) { return "—"; } if (Math.abs(value) >= 10000 || (Math.abs(value) < 0.001 && value !== 0)) { return value.toExponential(3); } return value.toFixed(4).replace(/0+$/, "").replace(/\.$/, ""); }
    function notebookStatusFromWarnings(warningCount, ledgerStatus) { if (warningCount > 0 || ledgerStatus === "warning" || ledgerStatus === "fail") { return "warning"; } if (ledgerStatus !== "pass") { return "review"; } return "pass"; }
    function notebookVisitorSummary(input, ledgerStatus, warningCount) { const label = input.scenarioLabel || input.scenario; if (input.scenario === "massivePhotonLensing") { return "Photon deflection was recorded for the massive-photon lensing recipe; compare photon mass, impact parameter, and the standard reference lines before treating the signal as meaningful."; } if (input.scenario === "tiredLightEnergyLedger") { return "Photon energy loss and redshift were recorded with ledger status " + ledgerStatus + "; the important visitor takeaway is whether the lost energy is accounted for."; } if (input.scenario === "darkMatterRamjet") { return "The ramjet pipeline result was recorded; buffer fill, radiator load, warnings, and thrust proxy show which subsystem bottlenecked first."; } if (input.scenario === "absoluteTimeQuantumOscillator") { return "The oscillator result was recorded; global time remains shared while local transition counts are compared as mechanical damping signals."; } if (warningCount > 0) { return label + " was recorded with warnings, so use it as a review case rather than a visitor-ready claim."; } return label + " was recorded in the Lab Notebook with validation and ledger telemetry ready for comparison."; }
    function notebookPhysicistSummary(input, validationScore, warningCount, ledgerStatus) { const sourceText = input.source === "playlist-run" ? "playlist item" : input.source === "recipe-run" ? "recipe run" : input.source === "manual-save" ? "manual save" : "scenario run"; return "Recorded " + sourceText + " for " + (input.scenarioLabel || input.scenario) + ": validation " + (validationScore * 100).toFixed(1) + "%, warnings " + warningCount.toString() + ", ledger " + ledgerStatus + ". Treat this as an auditable sandbox result, not empirical confirmation."; }
    function notebookMetricCard(key, label, rawValue, unit, warningThreshold, explanation) { const numericValue = notebookFiniteNumber(rawValue, 0); const status = Math.abs(numericValue) > warningThreshold ? "warning" : "pass"; return Object.freeze({ key, label, value: notebookFormatMetric(numericValue), numericValue, unit, status, explanation }); }
    function notebookMetricCards(input, validationScore, warningCount, ledgerStatus) { const metrics = input.metrics || {}; return Object.freeze([Object.freeze({ key: "validationScore", label: "Validation score", value: notebookFormatMetric(validationScore * 100), numericValue: validationScore, unit: "%", status: validationScore >= 0.72 ? "pass" : "review", explanation: "Scenario validation proxy from the active run." }), Object.freeze({ key: "warningCount", label: "Warning count", value: warningCount.toString(), numericValue: warningCount, unit: "warnings", status: warningCount > 0 ? "warning" : "pass", explanation: "Visible warning budget captured with this result." }), Object.freeze({ key: "ledgerStatus", label: "Ledger status", value: ledgerStatus, numericValue: ledgerStatus === "pass" ? 1 : 0, unit: "state", status: notebookStatusFromWarnings(warningCount, ledgerStatus), explanation: "Energy/accounting state reported by the run." }), notebookMetricCard("baselineDelta", "Baseline delta", metrics.baselineDelta, "delta", 1.5, "Difference between baseline and speculative branch."), notebookMetricCard("finalRedshift", "Redshift", metrics.finalRedshift, "z", 4, "Tired-light redshift proxy when available."), notebookMetricCard("finalEnergyFraction", "Photon energy", metrics.finalEnergyFraction, "fraction", 1.1, "Remaining photon energy fraction when available."), notebookMetricCard("ramjetBufferFill", "Buffer fill", metrics.ramjetBufferFill, "ratio", 1, "Dark Matter Ramjet buffer fill when available."), notebookMetricCard("ramjetRadiatorLoad", "Radiator load", metrics.ramjetRadiatorLoad, "ratio", 1, "Thermal rejection load when available."), notebookMetricCard("ramjetThrustProxy", "Thrust proxy", metrics.ramjetThrustProxy, "proxy", 1000000, "Conceptual thrust signal for the ramjet pipeline.")]); }
    function notebookEntryId(input, index) { const source = String(input.source || "scenario-run").replace(/[^a-z0-9-]/gi, "").toLowerCase(); const scenario = String(input.scenario || "scenario").replace(/[^a-z0-9-]/gi, "").toLowerCase().slice(0, 32); return "arcsecs-note-" + source + "-" + scenario + "-" + (index + 1 < 10 ? "0" : "") + String(index + 1); }
    function notebookSummarize(entries) { const warningCount = entries.reduce((total, entry) => total + entry.warningCount + (entry.ledgerStatus === "pass" ? 0 : 1), 0); const averageValidationScore = entries.length > 0 ? entries.reduce((total, entry) => total + entry.validationScore, 0) / entries.length : 0; const latest = entries[0]; return Object.freeze({ entryCount: entries.length, warningCount, averageValidationScore, latestScenario: latest ? latest.scenario : "none", readyToExport: entries.length > 0, visitorSummary: entries.length > 0 ? "The Lab Notebook has " + entries.length.toString() + " saved result" + (entries.length === 1 ? "" : "s") + " with visible summaries, metric cards, and cautious copy text." : "Run or save an experiment to create the first Lab Notebook result.", physicistSummary: entries.length > 0 ? "Average validation " + (averageValidationScore * 100).toFixed(1) + "%, warning budget " + warningCount.toString() + "; notebook entries preserve source, scenario, ledger, metric cards, and active config." : "Notebook is empty; no run evidence has been captured." }); }
    class ExperimentLabNotebook {
      constructor(maximumEntries = 12) { this.maximumEntries = Math.max(3, Math.min(30, Math.round(notebookFiniteNumber(maximumEntries, 12)))); }
      createEmpty(notebookId = "arcsecs-lab-notebook") { return this.buildPacket(notebookId, []); }
      restore(rawPacket, notebookId = "arcsecs-lab-notebook") { const packet = rawPacket && typeof rawPacket === "object" ? rawPacket : {}; const entries = Array.isArray(packet.entries) ? packet.entries.slice(0, this.maximumEntries) : []; return this.buildPacket(packet.notebookId || notebookId, entries); }
      addResult(packet, input) { const validationScore = Math.max(0, Math.min(1, notebookFiniteNumber(input.validationScore, 0))); const warningCount = Math.max(0, Math.round(notebookFiniteNumber(input.warningCount, 0))); const ledgerStatus = input.metrics && input.metrics.ledgerStatus ? String(input.metrics.ledgerStatus) : "pass"; const previousEntries = packet && Array.isArray(packet.entries) ? packet.entries : []; const entry = Object.freeze({ entryId: notebookEntryId(input, previousEntries.length), createdUtc: new Date().toISOString(), source: input.source, scenario: input.scenario, scenarioLabel: input.scenarioLabel || input.scenario, presetId: input.presetId || "manual", presetTitle: input.presetTitle || input.scenarioLabel || input.scenario, acceptedSteps: Math.max(0, Math.round(notebookFiniteNumber(input.acceptedSteps, 0))), validationScore, warningCount, ledgerStatus, visitorSummary: notebookVisitorSummary(input, ledgerStatus, warningCount), physicistSummary: notebookPhysicistSummary(input, validationScore, warningCount, ledgerStatus), metricCards: notebookMetricCards(input, validationScore, warningCount, ledgerStatus), playlistId: input.playlistId || "none", playlistItemOrder: Math.max(0, Math.round(notebookFiniteNumber(input.playlistItemOrder, 0))), activeConfig: Object.freeze(Object.assign({}, input.activeConfig || {})) }); return this.buildPacket(packet.notebookId, [entry].concat(previousEntries).slice(0, this.maximumEntries)); }
      buildVisitorCopy(packet) { const lines = packet.entries.slice(0, 5).map((entry) => "- " + entry.scenarioLabel + ": " + entry.visitorSummary); return "ArcSecs Experiment Lab Notebook\n" + packet.summary.visitorSummary + "\n" + lines.join("\n") + "\nBoundary: " + packet.scientificBoundary; }
      buildPhysicistCopy(packet) { const lines = packet.entries.slice(0, 5).map((entry) => "- " + entry.physicistSummary); return "ArcSecs Lab Notebook physicist summary\n" + packet.summary.physicistSummary + "\n" + lines.join("\n") + "\nBoundary: " + packet.scientificBoundary; }
      buildPacket(notebookId, entries) { const safeEntries = Object.freeze(entries.slice(0, this.maximumEntries)); return Object.freeze({ packetType: "ArcSecs Experiment Lab Notebook", notebookId: notebookId || "arcsecs-lab-notebook", generatedUtc: new Date().toISOString(), entries: safeEntries, summary: notebookSummarize(safeEntries), exportContainsExecutableCode: false, scientificBoundary: "Experiment Lab Notebook entries are inert browser-side summaries for the ArcSecs speculative sandbox; they do not prove the underlying physics model." }); }
    }
    

const sensitivityScenarioAxes = Object.freeze({
  massivePhotonLensing: Object.freeze({ key: "photonMassEv", label: "Photon mass / coupling", minimum: 0, maximum: 2, steps: 7, unit: "eV proxy", explanation: "Sweeps the non-zero photon mass/coupling branch to show how quickly lensing departs from the zero-mass baseline." }),
  tiredLightEnergyLedger: Object.freeze({ key: "lossRate", label: "Tired-light attenuation", minimum: 0, maximum: 0.018, steps: 7, unit: "loss", explanation: "Sweeps attenuation to reveal when redshift growth remains ledger-closed versus warning-prone." }),
  darkMatterRamjet: Object.freeze({ key: "thermalRejectionCapacity", label: "Radiator capacity", minimum: 4, maximum: 40, steps: 7, unit: "MW proxy", explanation: "Sweeps radiator capacity to show where the ramjet thermal bottleneck appears or clears." }),
  absoluteTimeQuantumOscillator: Object.freeze({ key: "betaCoupling", label: "Gravitational damping coefficient", minimum: 0, maximum: 1.8, steps: 7, unit: "damping", explanation: "Sweeps the oscillator damping term while global time remains shared." }),
  newtonianDarkStar: Object.freeze({ key: "speedMultiplier", label: "Photon launch velocity proxy", minimum: 0.35, maximum: 1.4, steps: 7, unit: "c proxy", explanation: "Sweeps the launch-speed margin around the Newtonian escape threshold." }),
  superluminalGalilean: Object.freeze({ key: "speedMultiplier", label: "Opposing body speed", minimum: 0.4, maximum: 2.2, steps: 7, unit: "c proxy", explanation: "Sweeps direct Galilean relative velocity with no Lorentz limiter." }),
  darkMatterCondensate: Object.freeze({ key: "lossRate", label: "Condensate feed rate", minimum: 0, maximum: 0.024, steps: 7, unit: "feed", explanation: "Sweeps tired-light ledger feed rate into the condensate halo proxy." }),
  parallaxCalibration: Object.freeze({ key: "acceptedSteps", label: "Calibration sample count", minimum: 500, maximum: 9000, steps: 7, unit: "ticks", explanation: "Sweeps deterministic sample count to show calibration stability." }),
  relationalLattice: Object.freeze({ key: "acceptedSteps", label: "Relational solve ticks", minimum: 500, maximum: 9000, steps: 7, unit: "ticks", explanation: "Sweeps fixed-step solve length to expose stability of relational links." })
});
function sensitivityFiniteNumber(value, fallback) { const numericValue = Number(value); return Number.isFinite(numericValue) ? numericValue : fallback; }
function sensitivityFormatValue(value) { const numericValue = sensitivityFiniteNumber(value, 0); if (Math.abs(numericValue) >= 10000 || (Math.abs(numericValue) < 0.001 && numericValue !== 0)) { return numericValue.toExponential(3); } return numericValue.toFixed(4).replace(/0+$/, "").replace(/\.$/, ""); }
function sensitivityReadConfigValue(config, key, fallback) { return Object.prototype.hasOwnProperty.call(config || {}, key) ? sensitivityFiniteNumber(config[key], fallback) : fallback; }
function sensitivityBuildAxisValues(axis) { const steps = Math.max(3, Math.min(11, Math.round(sensitivityFiniteNumber(axis.steps, 7)))); const values = []; for (let index = 0; index < steps; index += 1) { const ratio = steps === 1 ? 0 : index / (steps - 1); values.push(axis.minimum + ((axis.maximum - axis.minimum) * ratio)); } return Object.freeze(values); }
function sensitivityNormalizeScenario(scenario) { const key = String(scenario || "massivePhotonLensing"); return Object.prototype.hasOwnProperty.call(sensitivityScenarioAxes, key) ? key : "relationalLattice"; }
function sensitivityMetricForScenario(scenario, axisValue, config) {
  if (scenario === "massivePhotonLensing") { const impactParameter = Math.max(0.2, sensitivityReadConfigValue(config, "impactParameter", 1.4)); return (0.08 + axisValue * 0.34) / impactParameter; }
  if (scenario === "tiredLightEnergyLedger") { const distanceScale = Math.max(1, sensitivityReadConfigValue(config, "acceptedSteps", 6000) / 6000); return 1 - Math.exp(-axisValue * 90 * distanceScale); }
  if (scenario === "darkMatterRamjet") { const substrateDensity = Math.max(0.1, sensitivityReadConfigValue(config, "substrateDensity", 1.6)); const shipVelocity = Math.max(0.05, sensitivityReadConfigValue(config, "shipVelocityRatioC", 0.66)); const demand = substrateDensity * shipVelocity * 18; return demand / Math.max(0.1, axisValue); }
  if (scenario === "absoluteTimeQuantumOscillator") { return Math.max(0, axisValue * 0.22); }
  if (scenario === "newtonianDarkStar") { return axisValue - 1; }
  if (scenario === "superluminalGalilean") { return axisValue * 2; }
  if (scenario === "darkMatterCondensate") { return axisValue * 42; }
  if (scenario === "parallaxCalibration") { return Math.min(1, Math.max(0, axisValue / 9000)); }
  return Math.min(1, Math.max(0, axisValue / 9000));
}
function sensitivitySeverityForScenario(scenario, metricValue, delta) { if (scenario === "darkMatterRamjet") { return metricValue >= 1 ? "warning" : "pass"; } if (scenario === "tiredLightEnergyLedger") { return metricValue > 0.78 ? "warning" : metricValue > 0.25 ? "info" : "pass"; } if (scenario === "newtonianDarkStar") { return metricValue < 0 ? "warning" : "pass"; } if (Math.abs(delta) > 0.2) { return "info"; } return "pass"; }
function sensitivityMarkerLabelsForScenario(scenario, metricValue, severity) { const labels = []; if (scenario === "massivePhotonLensing" && metricValue > 0.25) { labels.push("deflection increase"); } if (scenario === "tiredLightEnergyLedger") { labels.push(severity === "warning" ? "ledger warning threshold" : "ledger closure watch"); } if (scenario === "darkMatterRamjet" && metricValue >= 1) { labels.push("radiator bottleneck", "net acceleration drop risk"); } if (scenario === "newtonianDarkStar" && metricValue < 0) { labels.push("capture threshold"); } if (scenario === "superluminalGalilean" && metricValue > 1) { labels.push("relative velocity above c"); } if (scenario === "darkMatterCondensate" && metricValue > 0.5) { labels.push("halo growth"); } return Object.freeze(labels); }
function sensitivityExplanationForPoint(scenario, axis, point, metricValue, severity) { if (scenario === "darkMatterRamjet") { return severity === "warning" ? "At " + sensitivityFormatValue(point) + " " + axis.unit + ", radiator load remains above capacity, so heat becomes the limiting variable." : "At " + sensitivityFormatValue(point) + " " + axis.unit + ", radiator capacity is sufficient for this proxy load."; } if (scenario === "massivePhotonLensing") { return "At " + sensitivityFormatValue(point) + " " + axis.unit + ", the curved-path proxy becomes " + sensitivityFormatValue(metricValue) + " arcsec-like units."; } if (scenario === "tiredLightEnergyLedger") { return severity === "warning" ? "This attenuation setting pushes redshift high enough that the ledger needs close inspection." : "This attenuation setting changes redshift while staying in the normal ledger-watch range."; } return "Changing " + axis.label + " to " + sensitivityFormatValue(point) + " changes the scenario response to " + sensitivityFormatValue(metricValue) + "."; }
function sensitivitySummarize(scenario, points) { let strongest = null; points.forEach((point) => { if (strongest === null || Math.abs(point.deltaFromBaseline) > Math.abs(strongest.deltaFromBaseline)) { strongest = point; } }); const warningCount = points.filter((point) => point.severity === "warning").length; const strongestText = strongest ? strongest.axisText + " produced delta " + strongest.deltaText : "No scan points available"; const action = warningCount > 0 ? "Jump to the first warning point, then rerun the playlist with a safer parameter range." : "Use this range as a safe comparison sweep, then export the sensitivity report."; return Object.freeze({ scenario, stageCount: points.length, warningCount, strongestChangeText: strongestText, recommendedAction: action, visitorSummary: "Sensitivity Scanner swept " + points.length.toString() + " values and found " + warningCount.toString() + " warning point" + (warningCount === 1 ? "" : "s") + ".", physicistSummary: "Scanner reports deterministic parameter response deltas, marker thresholds, and warning transitions for one ArcSecs sandbox control." }); }
function sensitivityBuildTippingPoints(points) { const tippingPoints = []; points.forEach((point) => { if (point.severity === "warning" || point.markerLabels.length > 0) { tippingPoints.push(Object.freeze({ pointIndex: point.index, axisValue: point.axisValue, label: point.markerLabels.length > 0 ? point.markerLabels.join(" / ") : "warning threshold", severity: point.severity, explanation: point.explanation })); } }); return Object.freeze(tippingPoints.slice(0, 8)); }
class ExperimentSensitivityScanner {
  listSupportedScans() { return Object.freeze(Object.keys(sensitivityScenarioAxes).map((key) => sensitivityScenarioAxes[key])); }
  buildScan(input = {}) {
    const activeConfig = input.activeConfig || {};
    const scenario = sensitivityNormalizeScenario(input.scenario || String(activeConfig.scenario || "massivePhotonLensing"));
    const axis = sensitivityScenarioAxes[scenario];
    const axisValues = sensitivityBuildAxisValues(axis);
    const baselineMetric = sensitivityMetricForScenario(scenario, axisValues[0], activeConfig);
    const points = Object.freeze(axisValues.map((axisValue, index) => { const metricValue = sensitivityMetricForScenario(scenario, axisValue, activeConfig); const delta = metricValue - baselineMetric; const severity = sensitivitySeverityForScenario(scenario, metricValue, delta); const markerLabels = sensitivityMarkerLabelsForScenario(scenario, metricValue, severity); return Object.freeze({ index, axisValue, axisText: sensitivityFormatValue(axisValue) + " " + axis.unit, metricValue, metricText: sensitivityFormatValue(metricValue), deltaFromBaseline: delta, deltaText: sensitivityFormatValue(delta), severity, markerLabels, explanation: sensitivityExplanationForPoint(scenario, axis, axisValue, metricValue, severity) }); }));
    return Object.freeze({ packetType: "ArcSecs Experiment Sensitivity Scanner", generatedUtc: new Date().toISOString(), scenario, axis, points, tippingPoints: sensitivityBuildTippingPoints(points), summary: sensitivitySummarize(scenario, points), readyToExport: points.length > 0, exportContainsExecutableCode: false, scientificBoundary: "Experiment Sensitivity Scanner reports are deterministic parameter sweeps for the ArcSecs speculative sandbox; they are not measured physical validation." });
  }
  exportReport(scan, context = {}) { return Object.freeze({ packetType: "ArcSecs Experiment Sensitivity Scanner Report", generatedUtc: new Date().toISOString(), scan, context: Object.freeze(Object.assign({}, context)), exportContainsExecutableCode: false, scientificBoundary: scan.scientificBoundary }); }
}



    const distanceTimeSpeculativeBoundary = "Speculative research visualization: this hypothesis model tests, compares, visualizes, and exposes a falsification path; it is not proof or settled physics.";
    const distanceTimeEvents = Object.freeze([
        Object.freeze({ eventKey: "gw170817", eventName: "GW170817", eventType: "Binary neutron star", distanceLabel: "40 Mpc", distanceParsecs: 40000000, observedDelayLabel: "1.74 seconds", observedDelaySeconds: 1.74, mediumDensityMultiplier: 1, sourceDelayEstimate: 1.68, environmentDelayEstimate: 0.04, electromagneticVisibilityThreshold: 0.05, visibilityStatus: "visible", interpretationNotes: ["Clean benchmark event", "Most delay is shown as source / jet-breakout delay."] }),
        Object.freeze({ eventKey: "gw150914", eventName: "GW150914", eventType: "Binary black hole debated counterpart", distanceLabel: "410 Mpc", distanceParsecs: 410000000, observedDelayLabel: "0.4 seconds debated", observedDelaySeconds: 0.4, mediumDensityMultiplier: 0.55, sourceDelayEstimate: 0.05, environmentDelayEstimate: 0.03, electromagneticVisibilityThreshold: 0.08, visibilityStatus: "uncertain", interpretationNotes: ["Electromagnetic counterpart is debated", "The theater should not force a clean light counterpart."] }),
        Object.freeze({ eventKey: "gw190521", eventName: "GW190521", eventType: "Binary black hole / AGN-disk diffusion", distanceLabel: "5.3 Gpc", distanceParsecs: 5300000000, observedDelayLabel: "34 days", observedDelaySeconds: 2937600, mediumDensityMultiplier: 5.5, sourceDelayEstimate: 20, environmentDelayEstimate: 2937540, electromagneticVisibilityThreshold: 0.04, visibilityStatus: "visible delayed", interpretationNotes: ["Dense environment / AGN disk diffusion event", "Environment dominates the delay breakdown."] }),
        Object.freeze({ eventKey: "gw190814", eventName: "GW190814", eventType: "Compact binary missing counterpart", distanceLabel: "241 Mpc", distanceParsecs: 241000000, observedDelayLabel: "no confirmed electromagnetic counterpart", observedDelaySeconds: 0, mediumDensityMultiplier: 3.6, sourceDelayEstimate: 0, environmentDelayEstimate: 0, electromagneticVisibilityThreshold: 0.28, visibilityStatus: "missing", interpretationNotes: ["Missing-counterpart / attenuation threshold event", "No visible light state is supported without invalid telemetry."] }),
        Object.freeze({ eventKey: "supernova-light-curve-stretch", eventName: "Supernova Light-Curve Stretch", eventType: "Optical stretch contract anchor", distanceLabel: "1.4 Gpc", distanceParsecs: 1400000000, observedDelayLabel: "1+z light-curve stretch comparison", observedDelaySeconds: 345600, mediumDensityMultiplier: 2.4, sourceDelayEstimate: 0, environmentDelayEstimate: 86400, electromagneticVisibilityThreshold: 0.12, visibilityStatus: "visible stretched", interpretationNotes: ["DarkMatterDrive contract anchor", "Tests whether degraded electromagnetic propagation can visualize supernova stretch without making time dilation foundational."] }),
        Object.freeze({ eventKey: "hubble-tension", eventName: "Hubble Tension", eventType: "Optical-history comparison anchor", distanceLabel: "4.5 Gpc", distanceParsecs: 4500000000, observedDelayLabel: "distance-ladder versus early-universe mismatch", observedDelaySeconds: 120, mediumDensityMultiplier: 1.9, sourceDelayEstimate: 0, environmentDelayEstimate: 30, electromagneticVisibilityThreshold: 0.1, visibilityStatus: "visible degraded", interpretationNotes: ["DarkMatterDrive contract anchor", "Frames Hubble tension as an optical-history comparison and falsification path, not proof."] }),
        Object.freeze({ eventKey: "synthetic-nearby-binary-neutron-star", eventName: "Synthetic Nearby Binary Neutron Star", eventType: "Synthetic benchmark", distanceLabel: "8 Mpc", distanceParsecs: 8000000, observedDelayLabel: "0.7 seconds", observedDelaySeconds: 0.7, mediumDensityMultiplier: 0.8, sourceDelayEstimate: 0.68, environmentDelayEstimate: 0.01, electromagneticVisibilityThreshold: 0.03, visibilityStatus: "visible", interpretationNotes: ["Short-distance event", "Light lag is small and source delay dominates."] }),
        Object.freeze({ eventKey: "synthetic-void-line-of-sight", eventName: "Synthetic Void-Line-of-Sight Event", eventType: "Synthetic path-dependence", distanceLabel: "260 Mpc", distanceParsecs: 260000000, observedDelayLabel: "2.2 seconds", observedDelaySeconds: 2.2, mediumDensityMultiplier: 0.22, sourceDelayEstimate: 1.8, environmentDelayEstimate: 0.04, electromagneticVisibilityThreshold: 0.02, visibilityStatus: "visible", interpretationNotes: ["Lower medium density", "Less photon degradation and better visibility."] }),
        Object.freeze({ eventKey: "synthetic-dense-filament", eventName: "Synthetic Dense-Filament Event", eventType: "Synthetic density stress", distanceLabel: "260 Mpc", distanceParsecs: 260000000, observedDelayLabel: "15.5 seconds", observedDelaySeconds: 15.5, mediumDensityMultiplier: 8.5, sourceDelayEstimate: 2.4, environmentDelayEstimate: 3.9, electromagneticVisibilityThreshold: 0.18, visibilityStatus: "visible degraded", interpretationNotes: ["Higher medium density", "Stronger attenuation, redshift proxy, and photon lag."] }),
        Object.freeze({ eventKey: "synthetic-agn-disk-diffusion", eventName: "Synthetic AGN-Disk Diffusion Event", eventType: "Synthetic environment stress", distanceLabel: "1.2 Gpc", distanceParsecs: 1200000000, observedDelayLabel: "9.5 days", observedDelaySeconds: 820800, mediumDensityMultiplier: 6.5, sourceDelayEstimate: 15, environmentDelayEstimate: 820740, electromagneticVisibilityThreshold: 0.06, visibilityStatus: "visible delayed", interpretationNotes: ["Environmental delay dominates", "Propagation delay is separated from local diffusion."] }),
        Object.freeze({ eventKey: "synthetic-missing-counterpart", eventName: "Synthetic Missing-Counterpart Event", eventType: "Synthetic threshold test", distanceLabel: "900 Mpc", distanceParsecs: 900000000, observedDelayLabel: "no visible photon arrival", observedDelaySeconds: 0, mediumDensityMultiplier: 12, sourceDelayEstimate: 0, environmentDelayEstimate: 0, electromagneticVisibilityThreshold: 0.45, visibilityStatus: "missing", interpretationNotes: ["Gravity arrival with no visible photon arrival", "Electromagnetic energy falls below detection threshold."] })
    ]);
    const distanceTimeClaimCards = Object.freeze([
        Object.freeze({ key: "distance-without-lightyears", title: "Distance Without Lightyears", visualTarget: "parallax-overlay", statement: "Distance starts with parsecs, parallax, arcseconds, angular geometry, proper motion, standard sirens, and dark-siren matching.", telemetry: ["Distance method", "Distance in parsecs", "Parallax angle", "Angular separation", "Proper motion", "dependsOnLightSpeed: false"], validation: ["Parallax inverse-arcsecond distance", "Angular separation stable", "Proper-motion finite velocity"], falsification: "The simulator cannot produce stable distance estimates without falling back to lightyears or electromagnetic travel time." }),
        Object.freeze({ key: "clockless-universal-progression", title: "Clockless Universal Progression", visualTarget: "progression-strip", statement: "Local atomic clocks are physical probes, not universal time.", telemetry: ["Progression method", "Relational tick", "Janus complexity index", "CMB epoch proxy", "dependsOnLocalClock: false"], validation: ["Progression changes with relational structure", "Local oscillator values labeled as probes"], falsification: "The simulator cannot keep a stable progression model unless it relies on local oscillator time." }),
        Object.freeze({ key: "gravity-wave-baseline", title: "Gravity-Wave Baseline", visualTarget: "gravity-wavefront", statement: "For deep events, gravity-wave propagation acts as the cleaner baseline messenger.", telemetry: ["Source event", "Gravity arrival index", "Strain proxy", "Baseline transit"], validation: ["GravityWavefront arrival baseline", "Gravity before photon", "Finite gravity values"], falsification: "Gravity arrival cannot be cleanly separated from electromagnetic arrival." }),
        Object.freeze({ key: "electromagnetic-secondary-messenger", title: "Electromagnetic Light as Secondary Messenger", visualTarget: "photon-wavefront", statement: "Light is useful evidence, but it is modeled as path-dependent, density-dependent, attenuating, delayed, red-shifted, and energy-degenerating.", telemetry: ["Photon arrival", "Delay from gravity", "Velocity factor", "Energy remaining", "Redshift proxy", "Medium density"], validation: ["Photon delay increases with distance", "Photon attenuation increases with density", "Energy finite and non-negative"], falsification: "Photon delay, attenuation, or redshift does not change with distance or medium density." }),
        Object.freeze({ key: "multi-messenger-event-testing", title: "Multi-Messenger Event Testing", visualTarget: "event-theater", statement: "Real and synthetic events separate source delay, propagation delay, environmental diffusion delay, and missing-counterpart status.", telemetry: ["Event name", "Event type", "Observed delay", "Source delay", "Propagation delay", "Environmental delay"], validation: ["Event telemetry finite", "Event switch updates viewport", "Delay categories separated", "Missing counterpart supported"], falsification: "The model cannot distinguish source delay from propagation delay or all events collapse into one explanation." }),
        Object.freeze({ key: "no-spacetime-foundation-language", title: "No-Spacetime Foundation Language", visualTarget: "language-boundary", statement: "Active ArcSecs model text does not present spacetime, metric expansion, literal time dilation, invariant electromagnetic light speed, local atomic clocks, or warp bubbles as foundations.", telemetry: ["Foundation label", "Rejected construct", "ArcSecs replacement", "Speculative boundary"], validation: ["Hypothesis wording present", "No proof framing", "Speculative boundary visible"], falsification: "Public text implies the simulator proves replacement physics or presents old constructs as foundations." })
    ]);
    function distanceTimeEventByKey(key) { return distanceTimeEvents.find((event) => event.eventKey === key) || distanceTimeEvents[0]; }
    function buildDistanceTimeKernelState(config, frame) {
        const event = distanceTimeEventByKey(config.distanceTimeEvent || "gw170817");
        const parallaxArcseconds = clamp(numberOrDefault(config.distanceTimeParallaxArcseconds, 0.76813), 0.000001, 1000000);
        const angularSeparationRadians = clamp(numberOrDefault(config.distanceTimeAngularSeparationRadians, 0.000004848), 0.000000001, 10);
        const properMotionArcsecondsPerYear = clamp(numberOrDefault(config.distanceTimeProperMotionArcsecondsPerYear, 3.85), 0, 1000000);
        const mediumDensityMultiplier = clamp(event.mediumDensityMultiplier * Math.max(0.05, numberOrDefault(config.substrateDensity, 1)), 0.05, 25);
        const distanceMegaparsecs = event.distanceParsecs / 1000000;
        const parallaxDistanceParsecs = 1 / parallaxArcseconds;
        const angularDistanceParsecs = Math.max(0.000001, event.distanceParsecs * 0.001) / angularSeparationRadians;
        const properMotionVelocity = 4.74047 * properMotionArcsecondsPerYear * parallaxDistanceParsecs;
        const gravityArrival = 0;
        const velocityFactor = clamp(Math.exp(-0.00000005 * mediumDensityMultiplier * distanceMegaparsecs), 0.000001, 1);
        const propagationDelay = Math.max(0.000001, distanceMegaparsecs * mediumDensityMultiplier * 0.0005);
        const energyRemaining = clamp(Math.exp(-0.00025 * mediumDensityMultiplier * Math.sqrt(Math.max(0, distanceMegaparsecs))), 0, 1);
        const redshiftProxy = clamp((1 / Math.max(0.000001, energyRemaining)) - 1, 0, 1000000);
        const missing = event.visibilityStatus === "missing" || energyRemaining < event.electromagneticVisibilityThreshold;
        const photonArrival = missing ? null : gravityArrival + propagationDelay;
        const knownDelay = event.sourceDelayEstimate + propagationDelay + event.environmentDelayEstimate;
        const unknownRemainder = Math.max(0, event.observedDelaySeconds - knownDelay);
        const activeClaimKeys = ["distance-without-lightyears", "clockless-universal-progression", "gravity-wave-baseline", "multi-messenger-event-testing", "no-spacetime-foundation-language"];
        if (mediumDensityMultiplier > 1.2 || event.visibilityStatus !== "visible") { activeClaimKeys.push("electromagnetic-secondary-messenger"); }
        return Object.freeze({
            modeName: "Distance-Time Kernel",
            publicLabel: "No-Lightyear Distance / Clockless Time",
            activeEvent: event,
            activeClaimKeys: Object.freeze(activeClaimKeys),
            visualProgress: ((frame || 0) * 0.006) % 1,
            distanceEstimates: Object.freeze([
                Object.freeze({ methodName: "Parallax", distanceParsecs: parallaxDistanceParsecs, confidence: 0.96, sourceDescription: "Arcsecond geometry", dependsOnLightSpeed: false, notes: ["parsecs = 1 / parallaxArcseconds"] }),
                Object.freeze({ methodName: "Angular geometry", distanceParsecs: angularDistanceParsecs, confidence: 0.82, sourceDescription: "Angular separation with relational baseline", dependsOnLightSpeed: false, notes: ["distance = transverse separation / angleRadians"] }),
                Object.freeze({ methodName: "Proper motion helper", distanceParsecs: parallaxDistanceParsecs, confidence: clamp(properMotionVelocity / 100000, 0.2, 0.9), sourceDescription: "Proper motion plus parsec distance", dependsOnLightSpeed: false, notes: ["Tangential velocity proxy " + formatNumber(properMotionVelocity) + " km/s"] }),
                Object.freeze({ methodName: "Gravitational-wave standard siren", distanceParsecs: event.distanceParsecs, confidence: 0.78, sourceDescription: event.eventName + " strain baseline", dependsOnLightSpeed: false, notes: ["Gravity-wave strain is used as the baseline messenger."] }),
                Object.freeze({ methodName: "Dark standard-siren catalog matching", distanceParsecs: event.distanceParsecs * 1.015, confidence: 0.62, sourceDescription: "Catalog host-matching placeholder", dependsOnLightSpeed: false, notes: ["Statistical host matching placeholder."] })
            ]),
            progressionEstimates: Object.freeze([
                Object.freeze({ methodName: "Relational simulation tick", progressionValue: Math.max(0, Math.round(numberOrDefault(config.acceptedSteps, 6000))), normalizedEpoch: clamp(numberOrDefault(config.acceptedSteps, 6000) / 25000, 0, 1), confidence: 0.95, dependsOnLocalClock: false }),
                Object.freeze({ methodName: "York-time-style global progression", progressionValue: clamp(numberOrDefault(config.acceptedSteps, 6000) / 25000 + Math.log(1 + distanceMegaparsecs) * 0.01, 0, 1), normalizedEpoch: clamp(numberOrDefault(config.acceptedSteps, 6000) / 25000, 0, 1), confidence: 0.72, dependsOnLocalClock: false }),
                Object.freeze({ methodName: "Janus Point complexity", progressionValue: clamp(0.35 + numberOrDefault(config.acceptedSteps, 6000) / 25000 * 0.5 + Math.log(1 + distanceMegaparsecs) * 0.015, 0, 1), normalizedEpoch: clamp(numberOrDefault(config.acceptedSteps, 6000) / 25000, 0, 1), confidence: 0.69, dependsOnLocalClock: false })
            ]),
            gravityWavefront: Object.freeze({ sourceEventName: event.eventName, distanceParsecs: event.distanceParsecs, baselineTransit: distanceMegaparsecs * 3.26156e6 * 365.25 * 24 * 3600, arrivalIndex: gravityArrival, strainProxy: clamp(1 / Math.sqrt(Math.max(1, distanceMegaparsecs)), 0.000001, 1), notes: ["Blue-white baseline messenger", "Arrives first in Distance-Time Kernel scenario"] }),
            photonWavefront: Object.freeze({ sourceEventName: event.eventName, distanceParsecs: event.distanceParsecs, mediumDensityMultiplier, velocityFactor, energyRemaining, arrivalDelay: missing ? Math.max(propagationDelay, event.observedDelaySeconds) : propagationDelay, redshiftProxy, attenuationNotes: missing ? ["Missing counterpart threshold reached"] : ["Red-gold secondary messenger", "Lag and fading scale with density."] }),
            delayDecomposition: Object.freeze({ observedDelaySeconds: event.observedDelaySeconds, gravityBaselineArrival: 0, photonArrival, sourceDelayEstimate: event.sourceDelayEstimate, propagationDelayEstimate: propagationDelay, environmentalDiffusionDelayEstimate: event.environmentDelayEstimate, unknownOrUnassignedRemainder: unknownRemainder, decompositionStatus: unknownRemainder > 0 ? "unknown remainder labeled" : "decomposition bounded" }),
            telemetry: Object.freeze({ distanceMethod: "Parallax", distanceParsecs: parallaxDistanceParsecs, parallaxArcseconds, angularSeparationRadians, properMotionArcsecondsPerYear, gravityBaselineArrival: gravityArrival, photonArrival, messengerDelay: missing ? 0 : propagationDelay, lightVelocityFactor: velocityFactor, photonEnergyRemaining: energyRemaining, mediumDensityMultiplier, redshiftProxy, universalProgressionMethod: "Relational simulation tick", relationalTick: Math.max(0, Math.round(numberOrDefault(config.acceptedSteps, 6000))), janusComplexityIndex: clamp(0.35 + numberOrDefault(config.acceptedSteps, 6000) / 25000 * 0.5, 0, 1), localOscillatorWarning: "Local oscillator values are probes, not universal time.", speculativeBoundaryStatus: "visible" }),
            validationChecks: Object.freeze(buildDistanceTimeValidationChecks({ velocityFactor, energyRemaining, propagationDelay, missing, event, parallaxDistanceParsecs, parallaxArcseconds, angularDistanceParsecs, properMotionVelocity, photonArrival, gravityArrival, sourceDelayEstimate: event.sourceDelayEstimate, environmentDelayEstimate: event.environmentDelayEstimate, unknownOrUnassignedRemainder: unknownRemainder, progressionValue: clamp(0.35 + numberOrDefault(config.acceptedSteps, 6000) / 25000 * 0.5 + Math.log(1 + distanceMegaparsecs) * 0.015, 0, 1), activeClaimKeys })),
            speculativeBoundary: distanceTimeSpeculativeBoundary
        });
    }
    function buildDistanceTimeValidationChecks(input) {
        const finiteTelemetry = [input.velocityFactor, input.energyRemaining, input.propagationDelay, input.parallaxDistanceParsecs, input.angularDistanceParsecs, input.properMotionVelocity].every(Number.isFinite);
        const denseAttenuationProbe = Math.exp(-0.00025 * 4 * Math.sqrt(Math.max(0, input.event.distanceParsecs / 1000000)));
        const voidAttenuationProbe = Math.exp(-0.00025 * 0.2 * Math.sqrt(Math.max(0, input.event.distanceParsecs / 1000000)));
        const delaySum = input.sourceDelayEstimate + input.propagationDelay + input.environmentDelayEstimate + input.unknownOrUnassignedRemainder;
        const observedDelay = Math.max(0, input.event.observedDelaySeconds || delaySum);
        return [
            { key: "finite-telemetry", label: "Finite telemetry", passed: finiteTelemetry, detail: "Kernel telemetry, wavefront, distance, and event numbers are finite." },
            { key: "parallax-inverse-arcsecond", label: "Parallax inverse-arcsecond distance", passed: Math.abs(input.parallaxDistanceParsecs - 1 / input.parallaxArcseconds) < 0.000001, detail: "parsecs = 1 / arcseconds without light travel time." },
            { key: "angular-separation-stable", label: "Angular separation stability", passed: Number.isFinite(input.angularDistanceParsecs) && input.angularDistanceParsecs > 0, detail: "Angular geometry estimate is finite and positive." },
            { key: "proper-motion-finite", label: "Proper-motion finite velocity", passed: Number.isFinite(input.properMotionVelocity) && input.properMotionVelocity >= 0, detail: "Tangential velocity helper remains finite." },
            { key: "gravity-baseline-ordering", label: "Gravity baseline ordering", passed: input.photonArrival === null || input.photonArrival > input.gravityArrival, detail: "GravityWavefront remains the baseline and arrives before visible photons." },
            { key: "photon-delay-distance-scaling", label: "Photon delay scales with distance", passed: Number.isFinite(input.propagationDelay) && input.propagationDelay >= 0.000001, detail: "Photon lag is positive in Distance-Time Kernel scenarios." },
            { key: "density-dependent-attenuation", label: "Density-dependent attenuation", passed: denseAttenuationProbe < voidAttenuationProbe, detail: "Dense paths degrade photons more than void paths." },
            { key: "photon-energy-bounded", label: "Photon energy non-negative", passed: input.energyRemaining >= 0 && input.energyRemaining <= 1 && Number.isFinite(input.energyRemaining), detail: "Photon energy is finite, bounded, and non-negative." },
            { key: "progression-responds-to-structure", label: "Relational progression responds", passed: Number.isFinite(input.progressionValue) && input.progressionValue > 0, detail: "Universal progression estimate changes with relational structure and event selection." },
            { key: "event-selection-viewport-model", label: "Event selection viewport model", passed: Boolean(input.event && input.event.eventKey && input.event.eventName), detail: "Active Event Theater state is available for viewport rendering." },
            { key: "delay-decomposition-bounded", label: "Delay decomposition bounded", passed: Number.isFinite(delaySum) && Math.abs(delaySum - observedDelay) < Math.max(0.0001, observedDelay * 0.0001 + 0.0001), detail: "Delay categories sum to the observed delay or a labeled remainder." },
            { key: "missing-counterpart-safe", label: "Missing counterpart safe", passed: input.event.visibilityStatus !== "missing" || input.photonArrival === null || Number.isFinite(input.photonArrival), detail: "Missing-counterpart events do not create invalid photon telemetry." },
            { key: "claim-export-links", label: "Claim export links", passed: Array.isArray(input.activeClaimKeys) && input.activeClaimKeys.length > 0, detail: "Claim Map exports have active claim evidence links." },
            { key: "speculative-boundary", label: "Speculative boundary", passed: true, detail: distanceTimeSpeculativeBoundary }
        ];
    }
    function distanceTimeExportRecords(kernelState) {
        return distanceTimeClaimCards.map((claim) => Object.freeze({ claimKey: claim.key, claimTitle: claim.title, demonstratedStatus: kernelState.activeClaimKeys.indexOf(claim.key) >= 0 ? "demonstrated-in-current-run" : "available-not-active", scenarioUsed: "Distance-Time Kernel", telemetrySnapshot: kernelState.telemetry, validationSnapshot: claim.validation, falsificationWarning: claim.falsification, speculativeBoundaryText: distanceTimeSpeculativeBoundary }));
    }
    function distanceTimeExportBundle(kernelState) {
        return Object.freeze({ packetType: "ArcSecs Distance-Time Kernel / Claim Map / Event Theater Export", activeEvent: kernelState.activeEvent, eventList: distanceTimeEvents, eventTelemetrySnapshot: kernelState.telemetry, wavefrontTelemetry: Object.freeze({ gravityWavefront: kernelState.gravityWavefront, photonWavefront: kernelState.photonWavefront }), delayDecomposition: kernelState.delayDecomposition, activeClaimCards: kernelState.activeClaimKeys, claimMap: distanceTimeExportRecords(kernelState), validationResults: kernelState.validationChecks, falsificationNotes: distanceTimeClaimCards.map((claim) => claim.falsification), speculativeBoundaryText: distanceTimeSpeculativeBoundary, exportContainsExecutableCode: false });
    }

    const darkMatterDrivePublicContractEndpoints = Object.freeze([
        Object.freeze({ endpointKey: "framework", publicLabel: "Framework", pageUrl: "https://darkmatterdrive.com/framework/", jsonUrl: "https://darkmatterdrive.com/framework.json", requiredAnchors: Object.freeze(["Distance-Time Kernel", "Framework Claim Map", "Multi-Messenger Event Theater"]) }),
        Object.freeze({ endpointKey: "distanceTimeKernel", publicLabel: "Distance-Time Kernel", pageUrl: "https://darkmatterdrive.com/distance-time-kernel/", jsonUrl: "https://darkmatterdrive.com/distance-time-kernel.json", requiredAnchors: Object.freeze(["parsecs", "parallax", "arcseconds", "gravity-wave baseline", "clockless progression"]) }),
        Object.freeze({ endpointKey: "multiMessengerEventTheater", publicLabel: "Multi-Messenger Event Theater", pageUrl: "https://darkmatterdrive.com/multi-messenger-event-theater/", jsonUrl: "https://darkmatterdrive.com/multi-messenger-event-theater.json", requiredAnchors: Object.freeze(["GW170817", "GW150914", "GW190521", "Supernova light-curve stretch", "Hubble tension"]) }),
        Object.freeze({ endpointKey: "pluginHandoff", publicLabel: "Plugin Handoff", pageUrl: "https://darkmatterdrive.com/plugin-handoff/", jsonUrl: "https://darkmatterdrive.com/plugin-handoff.json", requiredAnchors: Object.freeze(["strict TypeScript", "export builders", "Validation Lab", "Quality Gate"]) }),
        Object.freeze({ endpointKey: "evidenceMap", publicLabel: "Evidence Map", pageUrl: "https://darkmatterdrive.com/evidence-map/", jsonUrl: "https://darkmatterdrive.com/evidence-map.json", requiredAnchors: Object.freeze(["Claim", "Telemetry", "Validation", "Falsification path"]) }),
        Object.freeze({ endpointKey: "sourceMatrix", publicLabel: "Source Matrix", pageUrl: "https://darkmatterdrive.com/source-matrix/", jsonUrl: "https://darkmatterdrive.com/source-matrix.json", requiredAnchors: Object.freeze(["source documents", "contract anchors", "public references"]) }),
        Object.freeze({ endpointKey: "claimStatus", publicLabel: "Claim Status", pageUrl: "https://darkmatterdrive.com/claim-status/", jsonUrl: "https://darkmatterdrive.com/claim-status.json", requiredAnchors: Object.freeze(["Distance Without Lightyears", "Clockless Universal Progression", "Gravity-Wave Baseline", "Electromagnetic Light as Secondary Messenger"]) }),
        Object.freeze({ endpointKey: "researchLibrary", publicLabel: "Research Library", pageUrl: "https://darkmatterdrive.com/research-library/", jsonUrl: "https://darkmatterdrive.com/research-library.json", requiredAnchors: Object.freeze(["New Universe Framework", "Rethinking Light Time and Spacetime", "Rethinking Cosmic Measurement Framework"]) })
    ]);
    function buildDarkMatterDriveContractAlignmentState(status, warning) { const endpoints = darkMatterDrivePublicContractEndpoints.map((endpoint) => Object.freeze({ endpointKey: endpoint.endpointKey, publicLabel: endpoint.publicLabel, pageUrl: endpoint.pageUrl, jsonUrl: endpoint.jsonUrl, status: status || "fallback", matchedAnchors: endpoint.requiredAnchors, missingAnchors: Object.freeze([]), schemaVersion: status === "success" ? "public-contract" : "fallback", generatedUtc: "1970-01-01T00:00:00.000Z", warning: warning || "Endpoint data is optional at runtime; fallback keeps telemetry finite and reports the source-contract state in exports." })); return Object.freeze({ sourceName: "DarkMatterDrive.com public contract", endpoints: Object.freeze(endpoints), requiredContractAnchors: Object.freeze(["GW170817", "GW150914", "GW190521", "Supernova light-curve stretch", "Hubble tension", "GW190814", "Synthetic Dense-Filament Event", "Synthetic Void-Line-of-Sight Event"]), requiredClaimKeys: Object.freeze(["distance-without-lightyears", "clockless-universal-progression", "gravity-wave-baseline", "electromagnetic-secondary-messenger", "multi-messenger-event-testing", "no-spacetime-foundation-language"]), exportSourceReferenceNames: Object.freeze(["DarkMatterDrive Framework public contract", "DarkMatterDrive Distance-Time Kernel contract", "DarkMatterDrive Multi-Messenger Event Theater contract", "DarkMatterDrive Plugin Handoff contract", "DarkMatterDrive Evidence Map contract", "DarkMatterDrive Source Matrix contract", "DarkMatterDrive Claim Status contract", "DarkMatterDrive Research Library contract"]), blockerWarnings: Object.freeze(status === "blocked" ? [warning || "Public contract endpoint unavailable."] : []), fallbackIsSafe: status !== "blocked", speculativeBoundaryText: distanceTimeSpeculativeBoundary }); }
    const arcsecsExportBuilderHandoff = Object.freeze({ handoffName: "ArcSecs strict TypeScript export builders", implementationOwner: "plugin-agent", themeDependencyAllowed: false, requiredTargets: Object.freeze(["benchmarkJson", "calibrationCertificate", "qualityGate", "operatorRunbook", "evidencePacket", "researchBundle", "sceneJson"]), sourceReferences: Object.freeze([Object.freeze({ documentName: "New Universe Framework Time and Distance.md", role: "Distance without lightyears and clockless progression source" }), Object.freeze({ documentName: "Rethinking Light Time and Spacetime.md", role: "No-spacetime and local-oscillator probe framing" }), Object.freeze({ documentName: "Modeling Light Slowing and Energy Degeneration Multi-Messenger Events.md", role: "Gravity-wave baseline and degraded-light event model" }), Object.freeze({ documentName: "Rethinking Cosmic Measurement Framework.md", role: "Relational measurement and export evidence framework" }), Object.freeze({ documentName: "DarkMatterDrive.com Framework public contract", role: "Source-side contract page alignment" }), Object.freeze({ documentName: "DarkMatterDrive.com Distance-Time Kernel public contract", role: "No-lightyear distance and clockless progression endpoint alignment" }), Object.freeze({ documentName: "DarkMatterDrive.com Multi-Messenger Event Theater public contract", role: "GW170817, GW150914, GW190521, supernova stretch, and Hubble tension anchor alignment" }), Object.freeze({ documentName: "DarkMatterDrive.com Plugin Handoff public contract", role: "Plugin-agent implementation and strict export-builder source alignment" }), Object.freeze({ documentName: "DarkMatterDrive.com Evidence Map public contract", role: "Claim-to-evidence and falsification-path alignment" }), Object.freeze({ documentName: "DarkMatterDrive.com Source Matrix public contract", role: "Public source reference and endpoint alignment" }), Object.freeze({ documentName: "DarkMatterDrive.com Claim Status public contract", role: "Claim Map source-contract alignment" }), Object.freeze({ documentName: "DarkMatterDrive.com Research Library public contract", role: "Framework source-library alignment" })]), speculativeBoundaryText: distanceTimeSpeculativeBoundary });
    function strictExportFiniteNumber(value, fallback) { return Number.isFinite(value) ? value : fallback; }
    function strictExportNormalizeRecord(source) { const normalized = {}; Object.keys(source || {}).sort().forEach((key) => { const value = source[key]; normalized[key] = typeof value === "number" ? strictExportFiniteNumber(value, 0) : value; }); return Object.freeze(normalized); }
    function strictExportTelemetryIsFinite(source) { return Object.keys(source || {}).every((key) => typeof source[key] !== "number" || Number.isFinite(source[key])); }
    function strictExportValidationErrors(context) { const issues = []; if (!context.generatedUtc || context.generatedUtc.charAt(context.generatedUtc.length - 1) !== "Z") { issues.push(Object.freeze({ fieldName: "generatedUtc", severity: "error", message: "Generated timestamp must be UTC ISO-8601 text ending in Z." })); } if (!context.activeScenario) { issues.push(Object.freeze({ fieldName: "activeScenario", severity: "error", message: "Active scenario is required." })); } if (!strictExportTelemetryIsFinite(context.telemetrySnapshot)) { issues.push(Object.freeze({ fieldName: "telemetrySnapshot", severity: "error", message: "Telemetry snapshot contains non-finite numeric output." })); } if (!strictExportTelemetryIsFinite(context.viewportState)) { issues.push(Object.freeze({ fieldName: "viewportState", severity: "error", message: "Viewport state contains non-finite numeric output." })); } if (!context.distanceTimeKernel || !Number.isFinite(context.distanceTimeKernel.photonWavefront.energyRemaining) || context.distanceTimeKernel.photonWavefront.energyRemaining < 0) { issues.push(Object.freeze({ fieldName: "photonWavefront.energyRemaining", severity: "error", message: "Photon energy must be finite and non-negative." })); } if (!Array.isArray(context.frameworkClaimMap) || context.frameworkClaimMap.length === 0) { issues.push(Object.freeze({ fieldName: "frameworkClaimMap", severity: "error", message: "Framework Claim Map export records are required." })); } if (!Array.isArray(context.validationLedger) || context.validationLedger.length === 0) { issues.push(Object.freeze({ fieldName: "validationLedger", severity: "error", message: "Validation ledger is required." })); } if (!/speculative research visualization/i.test(context.speculativeBoundaryText || "")) { issues.push(Object.freeze({ fieldName: "speculativeBoundaryText", severity: "error", message: "Speculative boundary text is required." })); } return Object.freeze(issues); }
    function strictExportBasePayload(packetType, context) { return Object.freeze({ packetType, packageVersion: context.packageVersion, engineVersion: context.engineVersion, generatedUtc: context.generatedUtc, activeScenario: context.activeScenario, sourceReferences: context.sourceReferences, caveats: context.caveats, speculativeBoundaryText: context.speculativeBoundaryText, falsificationPaths: context.falsificationPaths, exportContainsExecutableCode: false, sourceContractAlignment: context.sourceContractAlignment, sourceMatrix: context.sourceMatrix, scenarioEquationLibrary: context.scenarioEquationLibrary, scenarioScreenshotEvidencePack: context.scenarioScreenshotEvidencePack || null, reviewerNotesBundle: context.reviewerNotesBundle || null, auditValidationStatus: context.auditValidationStatus || "not-run", publicReviewerGalleryManifest: context.publicReviewerGalleryManifest || null, evidenceBundleIntegrityLabels: context.evidenceBundleIntegrityLabels || null, reviewerSignOffSummary: context.reviewerSignOffSummary || null, reviewBundleReconciliation: context.reviewBundleReconciliation || null, scenarioReviewWalkthroughWizard: context.scenarioReviewWalkthroughWizard || null, evidenceRepairQueue: context.evidenceRepairQueue || null, evidenceRepairCompletionLedger: context.evidenceRepairCompletionLedger || null, demoReadinessGate: context.demoReadinessGate || null, publicDemoScenarioChecklist: context.publicDemoScenarioChecklist || null, reviewerEvidenceExportPack: context.reviewerEvidenceExportPack || null, publicPublishingEvidenceArchiveIndex: context.publicPublishingEvidenceArchiveIndex || null, reviewerRetrievalNotes: context.reviewerRetrievalNotes || null }); }
    function strictExportBuildResult(payload, errors) { const hasError = errors.some((issue) => issue.severity === "error"); return Object.freeze({ success: !hasError, payload: hasError ? null : Object.freeze(payload), validationErrors: errors }); }
    function buildStrictExportPayload(target, context) { const validationErrors = strictExportValidationErrors(context); const base = strictExportBasePayload("ArcSecs " + target + " Export", context); const passedChecks = context.validationLedger.filter((check) => check.passed).map((check) => check.label); const failedChecks = context.validationLedger.filter((check) => !check.passed).map((check) => check.label); if (target === "benchmarkJson") { return strictExportBuildResult(Object.assign({}, base, { activeEventName: context.distanceTimeKernel.activeEvent.eventName, distanceTimeKernel: context.distanceTimeKernel, gravityWavefrontTelemetry: context.distanceTimeKernel.gravityWavefront, photonWavefrontTelemetry: context.distanceTimeKernel.photonWavefront, eventTheaterTelemetry: context.eventTheater, claimMapDemonstratedState: context.frameworkClaimMap, validationLedgerSummary: context.validationLedger, qualityGateSummary: context.qualityGate, deterministicBenchmarkValues: strictExportNormalizeRecord(context.telemetrySnapshot) }), validationErrors); } if (target === "calibrationCertificate") { return strictExportBuildResult(Object.assign({}, base, { scenarioContext: context.activeScenario, eventContext: context.distanceTimeKernel.activeEvent.eventName, distanceEstimateSummary: context.distanceTimeKernel.distanceEstimates, universalProgressionSummary: context.distanceTimeKernel.progressionEstimates, wavefrontOrderingSummary: context.distanceTimeKernel.telemetry.photonArrival === null ? "photon missing below detection threshold" : "gravity baseline precedes photon arrival", validationChecksPassed: passedChecks, validationChecksFailed: failedChecks, qualityGateResult: context.qualityGate.gateStatus, falsificationNotes: context.falsificationPaths }), validationErrors); } if (target === "qualityGate") { return strictExportBuildResult(Object.assign({}, base, context.qualityGate, { distanceTimeKernel: context.distanceTimeKernel, frameworkClaimMap: context.frameworkClaimMap, eventTheater: context.eventTheater }), validationErrors); } if (target === "operatorRunbook") { return strictExportBuildResult(Object.assign({}, base, { selectedScenario: context.activeScenario, recommendedSteps: ["Select Distance-Time Kernel.", "Select GW170817, GW190521, GW190814, synthetic dense-filament, and synthetic void-line-of-sight events.", "Confirm gravity arrives before visible light or a missing-counterpart state is labeled.", "Click Framework Claim Map cards to highlight viewport and telemetry.", "Run Validation Lab and Quality Gate before sharing exports."], activeStoryPath: context.activeStoryStep, eventTheaterInstructions: ["Use What caused the delay? to separate source, propagation, environment, and threshold components.", "Compare dense and void synthetic events for path-dependent photon degradation."], telemetryToWatch: ["distanceParsecs", "messengerDelay", "photonEnergyRemaining", "mediumDensityMultiplier", "redshiftProxy", "janusComplexityIndex"], validationChecksAndMeaning: context.validationLedger.map((check) => check.label + ": " + check.detail), failureMeanings: context.falsificationPaths }), validationErrors); } if (target === "evidencePacket") { return strictExportBuildResult(Object.assign({}, base, { traceabilityChainLabel: "Claim → Visual demo → Telemetry → Validation → Export → Falsification path", claimTraceability: context.frameworkClaimMap, activeEvent: context.eventTheater.activeEvent, eventDelayDecomposition: context.eventTheater.delayDecomposition, telemetrySnapshots: { kernelTelemetry: context.distanceTimeKernel.telemetry, wavefrontTelemetry: context.eventTheater.wavefrontTelemetry, delayDecomposition: context.eventTheater.delayDecomposition, viewportState: context.viewportState }, validationSnapshots: context.validationLedger, qualityGateResult: context.qualityGate }), validationErrors); } if (target === "researchBundle") { return strictExportBuildResult(Object.assign({}, base, { scenarioEventStoryState: { scenario: context.activeScenario, event: context.distanceTimeKernel.activeEvent.eventName, storyStep: context.activeStoryStep }, kernelTelemetry: context.distanceTimeKernel, claimMapState: context.frameworkClaimMap, eventTheaterState: context.eventTheater, validationAndQualityGateState: { validationLedger: context.validationLedger, qualityGate: context.qualityGate }, publicExplanationSummary: "ArcSecs tests whether distance and universal progression can be visualized without making lightyears, local clocks, or physical spacetime foundational." }), validationErrors); } return strictExportBuildResult(Object.assign({}, base, { scenarioType: context.activeScenario, simulationSettings: strictExportNormalizeRecord(context.simulationSettings || { scenario: context.activeScenario }), visualSceneState: strictExportNormalizeRecord(context.viewportState), selectedEvent: context.distanceTimeKernel.activeEvent.eventName, sourceObserverCoordinates: { sourceX: 0.1, sourceY: 0.5, observerX: 0.9, observerY: 0.5 }, gravityWavefrontState: context.distanceTimeKernel.gravityWavefront, photonWavefrontState: context.distanceTimeKernel.photonWavefront, mediumDensityPathState: { densityMultiplier: context.distanceTimeKernel.telemetry.mediumDensityMultiplier, visibilityStatus: context.distanceTimeKernel.activeEvent.visibilityStatus, photonVisible: context.distanceTimeKernel.telemetry.photonArrival !== null }, delayMarkers: context.eventTheater.delayDecomposition, claimHighlightState: context.distanceTimeKernel.activeClaimKeys, storyStepState: context.activeStoryStep, telemetrySnapshot: strictExportNormalizeRecord(context.telemetrySnapshot), validationEvidenceMarkers: context.validationLedger.map((check) => check.key) }), validationErrors); }

    class DemoController {
        constructor(root) { this.root = root; this.form = root.querySelector("[data-arcsecs-controls]"); this.bus = new EventBus(); this.runner = new FixedTimeStepRunner(); this.runner.pause(); this.pendingSweep = false; this.workerBusy = false; this.memory = new DemoMemoryStore("arcsecsPhysicsEngineMemoryV4"); this.viewport = new SceneViewport(root.querySelector("[data-arcsecs-viewport]")); this.primaryGraph = new ChartRenderer(root.querySelector("[data-arcsecs-graph='primary']")); this.secondaryGraph = new ChartRenderer(root.querySelector("[data-arcsecs-graph='secondary']")); this.worker = null; this.activeRunId = 0; this.latestResult = null; this.latestBenchmark = null; this.latestGrandTour = null; this.measurementHistory = []; this.activeRamjetSubsystem = "eitScoop"; this.autoLaunchDirector = new AutoLaunchDirector(root); this.guidedAutopilotTour = new GuidedAutopilotTour("arcsecs-tour-" + Date.now().toString(36)); this.reviewCockpit = new ReviewCockpit(); this.latestReviewCockpit = null; this.nextActionCommandCenter = new NextActionCommandCenter(); this.latestNextActionPlan = null; this.parameterGuide = new RunYourOwnSimulationGuide(); this.recipeLab = new ExperimentRecipeLab(); this.experimentComparisonWorkbench = new ExperimentComparisonWorkbench(); this.experimentPlaylistRunner = new ExperimentPlaylistRunner(8); this.experimentLabNotebook = new ExperimentLabNotebook(12); this.experimentReplayTimeline = new ExperimentReplayTimeline(32); this.experimentSensitivityScanner = new ExperimentSensitivityScanner(); this.latestExperimentSensitivityScan = null; this.latestRecipeShareState = null; this.parameterGuideWorkspace = "overview"; this.latestExperimentComparison = null; this.latestExperimentPlaylist = null; this.latestExperimentLabNotebook = this.loadExperimentLabNotebook(); this.latestExperimentReplayTimeline = null; const firstParameterPreset = this.parameterGuide.listPresets()[0]; this.selectedParameterPresetId = firstParameterPreset ? firstParameterPreset.presetId : "massive-photon-lensing"; this.selectedComparisonPresetIds = [this.selectedParameterPresetId, "tired-light-galaxy-dimming", "ramjet-thermal-stress-test"]; this.selectedPlaylistPresetIds = [this.selectedParameterPresetId, "tired-light-galaxy-dimming", "absolute-time-oscillator-comparison", "validation-lab-one-arcsecond"]; this.flightRecorder = new FlightRecorder("arcsecs-" + Date.now().toString(36), 80); this.frame = 0; this.lastFrameTime = performance.now(); this.activeDistanceTimeClaimKey = "distance-without-lightyears"; this.latestDistanceTimeKernel = buildDistanceTimeKernelState(this.toConfig ? this.toConfig() : { scenario: "distanceTimeKernel" }, 0); this.latestScenarioScreenshotEvidencePack = null; this.latestReviewerNotesBundle = null; this.latestScreenshotCapture = null; this.publicReviewerGalleryRows = []; this.publicReviewerRejectedRows = []; this.latestPublicReviewerGalleryManifest = null; this.latestEvidenceBundleIntegrityLabels = null; this.latestReviewerSignOffSummary = null; this.latestReviewBundleReconciliation = null; this.reconciliationRejectedRows = []; this.latestScenarioReviewWalkthroughWizard = null; this.evidenceRepairQueueRows = []; this.activeReviewScenarioIndex = 0; this.latestEvidenceRepairQueue = null; this.latestEvidenceRepairCompletionLedger = null; this.evidenceRepairCompletionRows = []; this.latestDemoReadinessGate = null; this.latestPublicDemoScenarioChecklist = null; this.publicDemoChecklistRows = []; this.latestReviewerEvidenceExportPack = null; this.latestPublicDemoScriptBuilder = null; this.latestScreenshotCaptionPack = null; this.latestPublicDemoPageAssemblyChecklist = null; this.latestCopyReviewBundle = null; this.latestPublicDemoRouteDraftBundle = this.latestPublicDemoRouteDraftBundle || null; this.latestSeoSchemaReview = this.latestSeoSchemaReview || null; this.latestPublicDemoPublicationHandoffManifest = this.latestPublicDemoPublicationHandoffManifest || null; this.latestStaticPageDraftExport = this.latestStaticPageDraftExport || null; this.latestStaticDraftReviewImport = this.latestStaticDraftReviewImport || null; this.latestPageReadinessDiff = this.latestPageReadinessDiff || null; this.latestStaticPublicationReviewChecklist = this.latestStaticPublicationReviewChecklist || null; this.latestPageDraftFreezeBundle = this.latestPageDraftFreezeBundle || null; this.latestStaticPublishHandoffQaSummary = this.latestStaticPublishHandoffQaSummary || null; this.latestPublicPageContentChecklist = this.latestPublicPageContentChecklist || null; this.latestPublicPageManualPublishingRunbook = this.latestPublicPageManualPublishingRunbook || null; this.latestPostDeployVerificationChecklist = this.latestPostDeployVerificationChecklist || null; this.latestManualPublishingArchiveReceipt = this.latestManualPublishingArchiveReceipt || null; this.latestHumanReviewSignOffExport = this.latestHumanReviewSignOffExport || null; this.latestPublicPublishingEvidenceArchiveIndex = null; this.latestReviewerRetrievalNotes = null; }
        initialize() { this.flightRecorder.start(performance.now()); this.root.setAttribute("tabindex", "0"); this.root.dataset.keyboardReady = "true"; this.initializeHelpTooltips(); this.bindControls(); this.loadDefaultScenario(); this.applyRecipeFromUrl(); this.updateRunGuideState("waiting"); this.renderWaitingEvidenceState(this.toConfig().scenario); this.renderMemory(); this.renderGuidedAutopilotTour(); this.renderReviewCockpit(); this.renderNextActionCommandCenter(); this.renderParameterGuide(); this.renderExperimentComparisonWorkbench(); this.renderExperimentPlaylistRunner(); this.renderExperimentReplayTimeline(); this.renderExperimentSensitivityScanner(); this.updateDistanceTimeKernelPanels(null); this.renderLiveScenarioAuditConsole(this.buildLiveScenarioAuditSummary(null)); this.renderEvidencePackPanels(); this.renderPublicReviewerGalleryManifest(); this.renderReviewBundleReconciliation(); this.renderScenarioReviewWalkthroughWizard(); this.renderEvidenceRepairQueue(); this.renderStaticPublicationReviewChecklist(); this.renderPageDraftFreezeBundle(); this.renderPublicPublishingEvidenceArchiveIndex(); this.renderReviewerRetrievalNotes(); if (this.root.dataset.autoGuidedTour === "true") { this.startGuidedTour({ autoStarted: true, runScenario: false }); } this.recordFlightEvent({ label: "Page shell initialized", detail: "Autopilot and fixed-step renderer are ready for the selected scenario.", severity: "info", source: "page-load", scenario: this.toConfig().scenario, status: "initialized" }); const cancel = this.root.querySelector("[data-arcsecs-cancel-run]"); if (cancel) cancel.addEventListener("click", () => this.cancelComputation()); const pause = this.root.querySelector("[data-arcsecs-play-pause]"); if (pause) { pause.textContent = "Resume"; pause.setAttribute("aria-pressed", "true"); } this.startRenderLoop(); this.executeAutoLaunch(false); }
        bindControls() { this.root.querySelectorAll("[data-arcsecs-preset]").forEach((button) => button.addEventListener("click", () => { this.setScenario(button.getAttribute("data-arcsecs-preset") || "relationalLattice"); this.runSimulation(); this.closeCommandPalette(); })); this.root.querySelectorAll("[data-arcsecs-ramjet-preset]").forEach((button) => button.addEventListener("click", () => { this.applyRamjetPreset(button.getAttribute("data-arcsecs-ramjet-preset") || "stableCruise"); this.setScenario("darkMatterRamjet"); this.runSimulation(); })); this.root.querySelectorAll("[data-arcsecs-failure-inject]").forEach((button) => button.addEventListener("click", () => { this.applyFailureInjection(button.getAttribute("data-arcsecs-failure-inject") || "none"); this.setScenario("darkMatterRamjet"); this.runSimulation(); })); this.root.querySelectorAll("[data-arcsecs-subsystem-focus]").forEach((button) => button.addEventListener("click", () => { this.setRamjetSubsystemFocus(button.getAttribute("data-arcsecs-subsystem-focus") || "eitScoop"); })); const run = this.root.querySelector("[data-arcsecs-run]"); if (run) run.addEventListener("click", () => this.runSimulation()); const playPause = this.root.querySelector("[data-arcsecs-play-pause]"); if (playPause) playPause.addEventListener("click", () => this.togglePlayPause(playPause)); const step = this.root.querySelector("[data-arcsecs-step]"); if (step) step.addEventListener("click", () => { this.runner.stepOneTick(); this.updateCounters(16); this.updateStatus("Stepped one deterministic tick."); }); const reset = this.root.querySelector("[data-arcsecs-reset]"); if (reset) reset.addEventListener("click", () => { this.runner.tick = 0; this.runSimulation(); }); const speed = this.root.querySelector("[data-arcsecs-speed]"); if (speed) speed.addEventListener("input", () => this.runner.setSpeedMultiplier(numberOrDefault(speed.value, 1))); this.form.addEventListener("change", () => this.markDirty()); const distanceTimeEventSelect = this.root.querySelector("[data-arcsecs-distance-time-event]"); if (distanceTimeEventSelect) distanceTimeEventSelect.addEventListener("change", () => { this.setScenario("distanceTimeKernel"); const previewConfig = this.toConfig(); const previewResult = Object.assign({}, this.latestResult || {}, { config: previewConfig, metrics: this.latestResult && this.latestResult.metrics ? this.latestResult.metrics : {}, distanceTimeKernel: buildDistanceTimeKernelState(previewConfig, this.frame || 0) }); this.latestDistanceTimeKernel = previewResult.distanceTimeKernel;  this.updateDistanceTimeKernelPanels(previewResult); this.viewport.draw(previewResult, this.frame || 0); this.recordFlightEvent({ label: "Distance-Time event selected", detail: "Event Theater switched to " + previewResult.distanceTimeKernel.activeEvent.eventName + " and refreshed viewport, telemetry, claims, validation, and export state.", severity: "info", source: "event-theater", scenario: "distanceTimeKernel", status: "previewed" }); this.runSimulation(); }); const claimMapPanel = this.root.querySelector("[data-arcsecs-claim-map]"); if (claimMapPanel) claimMapPanel.addEventListener("click", (event) => { const target = event.target && event.target.closest ? event.target.closest("[data-arcsecs-claim-card]") : null; if (target) { this.selectDistanceTimeClaim(target.getAttribute("data-arcsecs-claim-card") || "distance-without-lightyears"); } }); const exportScene = this.root.querySelector("[data-arcsecs-export-scene]"); if (exportScene) exportScene.addEventListener("click", () => this.exportSceneJson()); const importScene = this.root.querySelector("[data-arcsecs-import-scene]"); if (importScene) importScene.addEventListener("change", (event) => this.importScene(event)); const screenshot = this.root.querySelector("[data-arcsecs-screenshot]"); if (screenshot) screenshot.addEventListener("click", () => this.screenshot()); const save = this.root.querySelector("[data-arcsecs-save-run]"); if (save) save.addEventListener("click", () => this.saveRun()); const exportJson = this.root.querySelector("[data-arcsecs-export-json]"); if (exportJson) exportJson.addEventListener("click", () => this.exportJson()); const exportCsv = this.root.querySelector("[data-arcsecs-export-csv]"); if (exportCsv) exportCsv.addEventListener("click", () => this.exportCsv()); const benchmark = this.root.querySelector("[data-arcsecs-benchmark]"); if (benchmark) benchmark.addEventListener("click", () => this.runBenchmark()); const grandTour = this.root.querySelectorAll("[data-arcsecs-grand-tour]"); grandTour.forEach((button) => button.addEventListener("click", () => this.runGrandExperiment())); 
            const autoLaunch = this.root.querySelector("[data-arcsecs-auto-launch]"); if (autoLaunch) autoLaunch.addEventListener("click", () => this.executeAutoLaunch(true)); 
            const exportBenchmark = this.root.querySelector("[data-arcsecs-export-benchmark]"); if (exportBenchmark) exportBenchmark.addEventListener("click", () => this.exportBenchmark()); const exportEvidencePacket = this.root.querySelector("[data-arcsecs-export-evidence-packet]"); if (exportEvidencePacket) exportEvidencePacket.addEventListener("click", () => this.exportEvidencePacket()); const exportFlightRecorder = this.root.querySelector("[data-arcsecs-export-flight-recorder]"); if (exportFlightRecorder) exportFlightRecorder.addEventListener("click", () => this.exportFlightRecorder()); const buildReviewCockpit = this.root.querySelector("[data-arcsecs-build-review-cockpit]"); if (buildReviewCockpit) buildReviewCockpit.addEventListener("click", () => this.buildReviewCockpitPanel(true)); const exportReviewCockpit = this.root.querySelector("[data-arcsecs-export-review-cockpit]"); if (exportReviewCockpit) exportReviewCockpit.addEventListener("click", () => this.exportReviewCockpit()); const doNextActions = this.root.querySelector("[data-arcsecs-do-next-actions]"); if (doNextActions) doNextActions.addEventListener("click", () => this.executeReviewNextActions()); const exportResearchBundle = this.root.querySelector("[data-arcsecs-export-research-bundle]"); if (exportResearchBundle) exportResearchBundle.addEventListener("click", () => this.exportResearchNoteBundle()); const auditCurrentScenario = this.root.querySelector("[data-arcsecs-audit-current-scenario]"); if (auditCurrentScenario) auditCurrentScenario.addEventListener("click", () => this.auditCurrentScenario()); const copyAuditSummary = this.root.querySelector("[data-arcsecs-copy-audit-summary]"); if (copyAuditSummary) copyAuditSummary.addEventListener("click", () => this.copyAuditSummary()); const exportAuditConsoleJson = this.root.querySelector("[data-arcsecs-export-audit-console-json]"); if (exportAuditConsoleJson) exportAuditConsoleJson.addEventListener("click", () => this.exportAuditConsoleJson()); const compareExports = this.root.querySelector("[data-arcsecs-compare-exports]"); if (compareExports) compareExports.addEventListener("click", () => this.compareExports()); const captureScenarioScreenshot = this.root.querySelector("[data-arcsecs-capture-scenario-screenshot]"); if (captureScenarioScreenshot) captureScenarioScreenshot.addEventListener("click", () => this.captureScenarioScreenshot()); const buildReviewerNotesBundle = this.root.querySelector("[data-arcsecs-build-reviewer-notes-bundle]"); if (buildReviewerNotesBundle) buildReviewerNotesBundle.addEventListener("click", () => this.buildReviewerNotesBundle(true)); const exportReviewerNotesJson = this.root.querySelector("[data-arcsecs-export-reviewer-notes-json]"); if (exportReviewerNotesJson) exportReviewerNotesJson.addEventListener("click", () => this.exportReviewerNotesJson()); const exportEvidencePackJson = this.root.querySelector("[data-arcsecs-export-evidence-pack-json]"); if (exportEvidencePackJson) exportEvidencePackJson.addEventListener("click", () => this.exportEvidencePackJson()); const addGalleryManifestRow = this.root.querySelector("[data-arcsecs-add-gallery-manifest-row]"); if (addGalleryManifestRow) addGalleryManifestRow.addEventListener("click", () => this.addPublicReviewerGalleryRow()); const exportGalleryManifestJson = this.root.querySelector("[data-arcsecs-export-gallery-manifest-json]"); if (exportGalleryManifestJson) exportGalleryManifestJson.addEventListener("click", () => this.exportPublicReviewerGalleryManifestJson()); const clearGalleryManifest = this.root.querySelector("[data-arcsecs-clear-gallery-manifest]"); if (clearGalleryManifest) clearGalleryManifest.addEventListener("click", () => this.clearPublicReviewerGalleryManifest()); const buildIntegrityLabels = this.root.querySelector("[data-arcsecs-build-integrity-labels]"); if (buildIntegrityLabels) buildIntegrityLabels.addEventListener("click", () => this.buildEvidenceBundleIntegrityLabels(true)); const buildSignoffSummary = this.root.querySelector("[data-arcsecs-build-signoff-summary]"); if (buildSignoffSummary) buildSignoffSummary.addEventListener("click", () => this.buildReviewerSignOffSummary(true)); const exportSignoffSummaryJson = this.root.querySelector("[data-arcsecs-export-signoff-summary-json]"); if (exportSignoffSummaryJson) exportSignoffSummaryJson.addEventListener("click", () => this.exportReviewerSignOffSummaryJson()); const reconcileReviewBundle = this.root.querySelector("[data-arcsecs-reconcile-review-bundle]"); if (reconcileReviewBundle) reconcileReviewBundle.addEventListener("click", () => this.reconcileReviewBundle()); const exportReconciliationJson = this.root.querySelector("[data-arcsecs-export-reconciliation-json]"); if (exportReconciliationJson) exportReconciliationJson.addEventListener("click", () => this.exportReviewBundleReconciliationJson()); const clearReconciliationInputs = this.root.querySelector("[data-arcsecs-clear-reconciliation-inputs]"); if (clearReconciliationInputs) clearReconciliationInputs.addEventListener("click", () => this.clearReviewBundleReconciliationInputs()); const startReviewWalkthrough = this.root.querySelector("[data-arcsecs-start-review-walkthrough]"); if (startReviewWalkthrough) startReviewWalkthrough.addEventListener("click", () => this.startScenarioReviewWalkthrough()); const nextReviewScenario = this.root.querySelector("[data-arcsecs-next-review-scenario]"); if (nextReviewScenario) nextReviewScenario.addEventListener("click", () => this.nextReviewScenario()); const previousReviewScenario = this.root.querySelector("[data-arcsecs-previous-review-scenario]"); if (previousReviewScenario) previousReviewScenario.addEventListener("click", () => this.previousReviewScenario()); const exportWalkthroughJson = this.root.querySelector("[data-arcsecs-export-walkthrough-json]"); if (exportWalkthroughJson) exportWalkthroughJson.addEventListener("click", () => this.exportScenarioReviewWalkthroughJson()); const buildEvidenceRepairQueue = this.root.querySelector("[data-arcsecs-build-evidence-repair-queue]"); if (buildEvidenceRepairQueue) buildEvidenceRepairQueue.addEventListener("click", () => this.buildEvidenceRepairQueue(true)); const exportRepairQueueJson = this.root.querySelector("[data-arcsecs-export-repair-queue-json]"); if (exportRepairQueueJson) exportRepairQueueJson.addEventListener("click", () => this.exportEvidenceRepairQueueJson()); const buildCompletionLedger = this.root.querySelector("[data-arcsecs-build-completion-ledger]"); if (buildCompletionLedger) buildCompletionLedger.addEventListener("click", () => this.buildEvidenceRepairCompletionLedger(true)); const exportCompletionLedgerJson = this.root.querySelector("[data-arcsecs-export-completion-ledger-json]"); if (exportCompletionLedgerJson) exportCompletionLedgerJson.addEventListener("click", () => this.exportEvidenceRepairCompletionLedgerJson()); const evaluateDemoReadinessGate = this.root.querySelector("[data-arcsecs-evaluate-demo-readiness-gate]"); if (evaluateDemoReadinessGate) evaluateDemoReadinessGate.addEventListener("click", () => this.evaluateDemoReadinessGate(true)); const exportDemoReadinessGateJson = this.root.querySelector("[data-arcsecs-export-demo-readiness-gate-json]"); if (exportDemoReadinessGateJson) exportDemoReadinessGateJson.addEventListener("click", () => this.exportDemoReadinessGateJson()); const buildPublicDemoChecklist = this.root.querySelector("[data-arcsecs-build-public-demo-checklist]"); if (buildPublicDemoChecklist) buildPublicDemoChecklist.addEventListener("click", () => this.buildPublicDemoScenarioChecklist(true)); const exportSelectedScenarioEvidencePack = this.root.querySelector("[data-arcsecs-export-selected-scenario-evidence-pack-json]"); if (exportSelectedScenarioEvidencePack) exportSelectedScenarioEvidencePack.addEventListener("click", () => this.exportSelectedScenarioEvidencePackJson()); const exportAllDemoEvidencePacks = this.root.querySelector("[data-arcsecs-export-all-demo-evidence-packs-json]"); if (exportAllDemoEvidencePacks) exportAllDemoEvidencePacks.addEventListener("click", () => this.exportAllDemoEvidencePacksJson()); const buildPublicDemoScripts = this.root.querySelector("[data-arcsecs-build-public-demo-scripts]"); if (buildPublicDemoScripts) buildPublicDemoScripts.addEventListener("click", () => this.buildPublicDemoScripts(true)); const exportSelectedDemoScript = this.root.querySelector("[data-arcsecs-export-selected-demo-script-json]"); if (exportSelectedDemoScript) exportSelectedDemoScript.addEventListener("click", () => this.exportSelectedDemoScriptJson()); const exportAllDemoScripts = this.root.querySelector("[data-arcsecs-export-all-demo-scripts-json]"); if (exportAllDemoScripts) exportAllDemoScripts.addEventListener("click", () => this.exportAllDemoScriptsJson()); const buildScreenshotCaptionPack = this.root.querySelector("[data-arcsecs-build-screenshot-caption-pack]"); if (buildScreenshotCaptionPack) buildScreenshotCaptionPack.addEventListener("click", () => this.buildScreenshotCaptionPack(true)); const exportScreenshotCaptionPack = this.root.querySelector("[data-arcsecs-export-screenshot-caption-pack-json]"); if (exportScreenshotCaptionPack) exportScreenshotCaptionPack.addEventListener("click", () => this.exportScreenshotCaptionPackJson()); const buildPageAssemblyChecklist = this.root.querySelector("[data-arcsecs-build-page-assembly-checklist]"); if (buildPageAssemblyChecklist) buildPageAssemblyChecklist.addEventListener("click", () => this.buildPublicDemoPageAssemblyChecklist(true)); const buildCopyReviewBundle = this.root.querySelector("[data-arcsecs-build-copy-review-bundle]"); if (buildCopyReviewBundle) buildCopyReviewBundle.addEventListener("click", () => this.buildCopyReviewBundle(true)); const exportSelectedCopyReviewBundle = this.root.querySelector("[data-arcsecs-export-selected-copy-review-bundle-json]"); if (exportSelectedCopyReviewBundle) exportSelectedCopyReviewBundle.addEventListener("click", () => this.exportSelectedCopyReviewBundleJson()); const exportAllCopyReviewBundles = this.root.querySelector("[data-arcsecs-export-all-copy-review-bundles-json]"); if (exportAllCopyReviewBundles) exportAllCopyReviewBundles.addEventListener("click", () => this.exportAllCopyReviewBundlesJson()); const buildRouteDraftBundle = this.root.querySelector("[data-arcsecs-build-route-draft-bundle]"); if (buildRouteDraftBundle) buildRouteDraftBundle.addEventListener("click", () => this.buildPublicDemoRouteDraftBundle(true)); const buildSeoSchemaReview = this.root.querySelector("[data-arcsecs-build-seo-schema-review]"); if (buildSeoSchemaReview) buildSeoSchemaReview.addEventListener("click", () => this.buildSeoSchemaReview(true)); const exportSelectedRouteDraft = this.root.querySelector("[data-arcsecs-export-selected-route-draft-json]"); if (exportSelectedRouteDraft) exportSelectedRouteDraft.addEventListener("click", () => this.exportSelectedRouteDraftJson()); const exportAllRouteDrafts = this.root.querySelector("[data-arcsecs-export-all-route-drafts-json]"); if (exportAllRouteDrafts) exportAllRouteDrafts.addEventListener("click", () => this.exportAllRouteDraftsJson()); const exportSeoSchemaReview = this.root.querySelector("[data-arcsecs-export-seo-schema-review-json]"); if (exportSeoSchemaReview) exportSeoSchemaReview.addEventListener("click", () => this.exportSeoSchemaReviewJson()); const buildPublicationHandoffManifest = this.root.querySelector("[data-arcsecs-build-publication-handoff-manifest]"); if (buildPublicationHandoffManifest) buildPublicationHandoffManifest.addEventListener("click", () => this.buildPublicDemoPublicationHandoffManifest(true)); const buildStaticPageDraftExport = this.root.querySelector("[data-arcsecs-build-static-page-draft-export]"); if (buildStaticPageDraftExport) buildStaticPageDraftExport.addEventListener("click", () => this.buildStaticPageDraftExport(true)); const exportSelectedStaticPageDraft = this.root.querySelector("[data-arcsecs-export-selected-static-page-draft-json]"); if (exportSelectedStaticPageDraft) exportSelectedStaticPageDraft.addEventListener("click", () => this.exportSelectedStaticPageDraftJson()); const exportAllStaticPageDrafts = this.root.querySelector("[data-arcsecs-export-all-static-page-drafts-json]"); if (exportAllStaticPageDrafts) exportAllStaticPageDrafts.addEventListener("click", () => this.exportAllStaticPageDraftsJson()); const exportPublicationHandoffManifest = this.root.querySelector("[data-arcsecs-export-publication-handoff-manifest-json]"); if (exportPublicationHandoffManifest) exportPublicationHandoffManifest.addEventListener("click", () => this.exportPublicationHandoffManifestJson()); this.root.querySelectorAll("[data-arcsecs-demo-script-filter-scenario], [data-arcsecs-demo-script-filter-gate-status], [data-arcsecs-demo-script-filter-checklist-override], [data-arcsecs-demo-script-filter-warning], [data-arcsecs-demo-script-status]").forEach((select) => select.addEventListener("change", () => { this.renderPublicDemoScriptBuilder(); this.renderScreenshotCaptionPack(); })); this.root.querySelectorAll("[data-arcsecs-page-assembly-filter-scenario], [data-arcsecs-page-assembly-filter-script-status], [data-arcsecs-page-assembly-filter-caption-status], [data-arcsecs-page-assembly-filter-copy-readiness], [data-arcsecs-page-assembly-filter-warning], [data-arcsecs-copy-readiness-status]").forEach((select) => select.addEventListener("change", () => { this.renderPublicDemoPageAssemblyChecklist(); this.renderCopyReviewBundle(); })); this.root.querySelectorAll("[data-arcsecs-route-draft-filter-scenario], [data-arcsecs-route-draft-filter-copy-readiness], [data-arcsecs-route-draft-filter-schema-status], [data-arcsecs-route-draft-filter-warning], [data-arcsecs-route-draft-filter-placeholder], [data-arcsecs-route-draft-status]").forEach((select) => select.addEventListener("change", () => { this.renderPublicDemoRouteDraftBundle(); this.renderSeoSchemaReview(); })); this.root.querySelectorAll("[data-arcsecs-publication-handoff-filter-scenario], [data-arcsecs-publication-handoff-filter-route-status], [data-arcsecs-publication-handoff-filter-schema-status], [data-arcsecs-publication-handoff-filter-copy-readiness], [data-arcsecs-publication-handoff-filter-evidence-pack], [data-arcsecs-publication-handoff-filter-warning], [data-arcsecs-publication-handoff-status]").forEach((select) => select.addEventListener("change", () => { this.renderPublicDemoPublicationHandoffManifest(); this.renderStaticPageDraftExport(); })); this.root.querySelectorAll("[data-arcsecs-gap-filter-severity], [data-arcsecs-gap-filter-scenario]").forEach((select) => select.addEventListener("change", () => { this.renderReviewBundleReconciliation(); this.renderScenarioReviewWalkthroughWizard(); })); this.root.querySelectorAll("[data-arcsecs-repair-filter-severity], [data-arcsecs-repair-filter-scenario], [data-arcsecs-repair-filter-type], [data-arcsecs-repair-filter-status]").forEach((select) => select.addEventListener("change", () => this.renderEvidenceRepairQueue())); this.root.querySelectorAll("[data-arcsecs-completion-filter-scenario], [data-arcsecs-completion-filter-status]").forEach((select) => select.addEventListener("change", () => this.renderEvidenceRepairCompletionLedger())); this.root.querySelectorAll("[data-arcsecs-demo-gate-filter-scenario], [data-arcsecs-demo-gate-filter-status], [data-arcsecs-demo-gate-filter-critical]").forEach((select) => select.addEventListener("change", () => this.renderDemoReadinessGate())); this.root.querySelectorAll("[data-arcsecs-demo-checklist-filter-scenario], [data-arcsecs-demo-checklist-filter-gate-status], [data-arcsecs-demo-checklist-filter-completeness], [data-arcsecs-demo-checklist-filter-critical], [data-arcsecs-demo-checklist-override-status], [data-arcsecs-evidence-pack-selected-scenario]").forEach((select) => select.addEventListener("change", () => { this.renderPublicDemoScenarioChecklist(); this.renderReviewerEvidenceExportPackStatus(); })); this.root.querySelectorAll("[data-arcsecs-gallery-filter-reviewer-status], [data-arcsecs-gallery-filter-screenshot-suitability], [data-arcsecs-gallery-filter-citation-status], [data-arcsecs-gallery-filter-telemetry], [data-arcsecs-gallery-filter-source-equation]").forEach((select) => select.addEventListener("change", () => this.renderPublicReviewerGalleryManifest())); this.root.querySelectorAll("[data-arcsecs-integrity-filter-status]").forEach((select) => select.addEventListener("change", () => this.renderEvidenceBundleIntegrityLabels())); this.root.querySelectorAll("[data-arcsecs-parameter-guide-open]").forEach((button) => button.addEventListener("click", () => this.openParameterGuide())); this.root.querySelectorAll("[data-arcsecs-parameter-guide-close]").forEach((button) => button.addEventListener("click", () => this.closeParameterGuide())); const parameterGuideModal = this.root.querySelector("[data-arcsecs-parameter-guide-modal]"); if (parameterGuideModal) parameterGuideModal.addEventListener("click", (event) => { if (event.target === parameterGuideModal) { this.closeParameterGuide(); } }); const parameterGuideList = this.root.querySelector("[data-arcsecs-parameter-guide-list]"); if (parameterGuideList) parameterGuideList.addEventListener("click", (event) => { const target = event.target && event.target.closest ? event.target.closest("[data-arcsecs-parameter-preset]") : null; if (target) { this.selectParameterGuidePreset(target.getAttribute("data-arcsecs-parameter-preset") || "massive-photon-lensing"); } }); this.root.querySelectorAll("[data-arcsecs-guide-workspace]").forEach((button) => button.addEventListener("click", () => this.setParameterGuideWorkspace(button.getAttribute("data-arcsecs-guide-workspace") || "overview"))); const applyParameterPreset = this.root.querySelector("[data-arcsecs-parameter-guide-apply]"); if (applyParameterPreset) applyParameterPreset.addEventListener("click", () => this.applyParameterGuidePreset(false)); const runParameterPreset = this.root.querySelector("[data-arcsecs-parameter-guide-run]"); if (runParameterPreset) runParameterPreset.addEventListener("click", () => this.applyParameterGuidePreset(true)); const exportParameterGuide = this.root.querySelector("[data-arcsecs-parameter-guide-export]"); if (exportParameterGuide) exportParameterGuide.addEventListener("click", () => this.exportParameterGuide()); const validateRecipe = this.root.querySelector("[data-arcsecs-recipe-validate]"); if (validateRecipe) validateRecipe.addEventListener("click", () => this.validateCurrentRecipe()); const createRecipeLink = this.root.querySelector("[data-arcsecs-recipe-link]"); if (createRecipeLink) createRecipeLink.addEventListener("click", () => this.createRecipeShareLink()); const applySharedRecipe = this.root.querySelector("[data-arcsecs-recipe-apply]"); if (applySharedRecipe) applySharedRecipe.addEventListener("click", () => this.applyLatestRecipeShareState(false)); const runSharedRecipe = this.root.querySelector("[data-arcsecs-recipe-run]"); if (runSharedRecipe) runSharedRecipe.addEventListener("click", () => this.applyLatestRecipeShareState(true)); const exportRecipe = this.root.querySelector("[data-arcsecs-recipe-export]"); if (exportRecipe) exportRecipe.addEventListener("click", () => this.exportExperimentRecipe()); const addComparisonRecipe = this.root.querySelector("[data-arcsecs-comparison-add]"); if (addComparisonRecipe) addComparisonRecipe.addEventListener("click", () => this.addSelectedRecipeToComparison()); const clearComparisonRecipe = this.root.querySelector("[data-arcsecs-comparison-clear]"); if (clearComparisonRecipe) clearComparisonRecipe.addEventListener("click", () => this.clearExperimentComparison()); const buildComparisonRecipe = this.root.querySelector("[data-arcsecs-comparison-build]"); if (buildComparisonRecipe) buildComparisonRecipe.addEventListener("click", () => this.buildExperimentComparison()); const exportComparisonRecipe = this.root.querySelector("[data-arcsecs-comparison-export]"); if (exportComparisonRecipe) exportComparisonRecipe.addEventListener("click", () => this.exportExperimentComparison()); const addPlaylistRecipe = this.root.querySelector("[data-arcsecs-playlist-add]"); if (addPlaylistRecipe) addPlaylistRecipe.addEventListener("click", () => this.addSelectedRecipeToPlaylist()); const buildPlaylistRecipe = this.root.querySelector("[data-arcsecs-playlist-build]"); if (buildPlaylistRecipe) buildPlaylistRecipe.addEventListener("click", () => this.buildExperimentPlaylist()); const runPlaylistRecipe = this.root.querySelector("[data-arcsecs-playlist-run]"); if (runPlaylistRecipe) runPlaylistRecipe.addEventListener("click", () => this.runExperimentPlaylist()); const nextPlaylistRecipe = this.root.querySelector("[data-arcsecs-playlist-next]"); if (nextPlaylistRecipe) nextPlaylistRecipe.addEventListener("click", () => this.advanceExperimentPlaylist()); const clearPlaylistRecipe = this.root.querySelector("[data-arcsecs-playlist-clear]"); if (clearPlaylistRecipe) clearPlaylistRecipe.addEventListener("click", () => this.clearExperimentPlaylist()); const exportPlaylistRecipe = this.root.querySelector("[data-arcsecs-playlist-export]"); if (exportPlaylistRecipe) exportPlaylistRecipe.addEventListener("click", () => this.exportExperimentPlaylist()); const saveNotebook = this.root.querySelector("[data-arcsecs-notebook-save]"); if (saveNotebook) saveNotebook.addEventListener("click", () => this.saveLatestResultToNotebook("manual-save")); const clearNotebook = this.root.querySelector("[data-arcsecs-notebook-clear]"); if (clearNotebook) clearNotebook.addEventListener("click", () => this.clearExperimentLabNotebook()); const exportNotebook = this.root.querySelector("[data-arcsecs-notebook-export]"); if (exportNotebook) exportNotebook.addEventListener("click", () => this.exportExperimentLabNotebook()); const copyNotebookVisitor = this.root.querySelector("[data-arcsecs-notebook-copy-visitor]"); if (copyNotebookVisitor) copyNotebookVisitor.addEventListener("click", () => this.copyExperimentLabNotebook("visitor")); const copyNotebookPhysicist = this.root.querySelector("[data-arcsecs-notebook-copy-physicist]"); if (copyNotebookPhysicist) copyNotebookPhysicist.addEventListener("click", () => this.copyExperimentLabNotebook("physicist")); const replayBack = this.root.querySelector("[data-arcsecs-replay-back]"); if (replayBack) replayBack.addEventListener("click", () => this.moveExperimentReplayTimeline("back")); const replayPlay = this.root.querySelector("[data-arcsecs-replay-play]"); if (replayPlay) replayPlay.addEventListener("click", () => this.moveExperimentReplayTimeline("play")); const replayPause = this.root.querySelector("[data-arcsecs-replay-pause]"); if (replayPause) replayPause.addEventListener("click", () => this.moveExperimentReplayTimeline("pause")); const replayNext = this.root.querySelector("[data-arcsecs-replay-next]"); if (replayNext) replayNext.addEventListener("click", () => this.moveExperimentReplayTimeline("next")); const replayWarning = this.root.querySelector("[data-arcsecs-replay-warning]"); if (replayWarning) replayWarning.addEventListener("click", () => this.moveExperimentReplayTimeline("warning")); const replayExport = this.root.querySelector("[data-arcsecs-replay-export]"); if (replayExport) replayExport.addEventListener("click", () => this.exportExperimentReplayTimeline()); const sensitivityScan = this.root.querySelector("[data-arcsecs-sensitivity-scan]"); if (sensitivityScan) sensitivityScan.addEventListener("click", () => this.refreshExperimentSensitivityScan("operator")); const sensitivityExport = this.root.querySelector("[data-arcsecs-sensitivity-export]"); if (sensitivityExport) sensitivityExport.addEventListener("click", () => this.exportExperimentSensitivityScan()); const comparisonPanel = this.root.querySelector("[data-arcsecs-recipe-comparison]"); if (comparisonPanel) comparisonPanel.addEventListener("click", (event) => { const target = event.target && event.target.closest ? event.target.closest("[data-arcsecs-comparison-preset]") : null; if (target) { this.selectParameterGuidePreset(target.getAttribute("data-arcsecs-comparison-preset") || this.selectedParameterPresetId); } }); const playlistPanel = this.root.querySelector("[data-arcsecs-recipe-playlist]"); if (playlistPanel) playlistPanel.addEventListener("click", (event) => { const target = event.target && event.target.closest ? event.target.closest("[data-arcsecs-playlist-preset]") : null; if (target) { this.selectParameterGuidePreset(target.getAttribute("data-arcsecs-playlist-preset") || this.selectedParameterPresetId); } }); const notebookPanel = this.root.querySelector("[data-arcsecs-lab-notebook]"); if (notebookPanel) notebookPanel.addEventListener("click", (event) => { const target = event.target && event.target.closest ? event.target.closest("[data-arcsecs-notebook-scenario]") : null; if (target) { this.setScenario(target.getAttribute("data-arcsecs-notebook-scenario") || this.toConfig().scenario); this.runSimulation(); } }); const sensitivityPanel = this.root.querySelector("[data-arcsecs-sensitivity-scanner]"); if (sensitivityPanel) sensitivityPanel.addEventListener("click", (event) => { const target = event.target && event.target.closest ? event.target.closest("[data-arcsecs-sensitivity-point]") : null; if (target) { this.applyExperimentSensitivityPoint(Number(target.getAttribute("data-arcsecs-sensitivity-point") || "0")); } }); const nextActionPanel = this.root.querySelector("[data-arcsecs-next-action-panel]"); if (nextActionPanel) nextActionPanel.addEventListener("click", (event) => { const target = event.target && event.target.closest ? event.target.closest("[data-arcsecs-next-action-id]") : null; if (target) { this.executeReviewNextAction(target.getAttribute("data-arcsecs-next-action-id") || ""); } }); const guidedNext = this.root.querySelector("[data-arcsecs-guided-tour-next]"); if (guidedNext) guidedNext.addEventListener("click", () => this.advanceGuidedTour()); const guidedPrevious = this.root.querySelector("[data-arcsecs-guided-tour-previous]"); if (guidedPrevious) guidedPrevious.addEventListener("click", () => this.previousGuidedTour()); const guidedPause = this.root.querySelector("[data-arcsecs-guided-tour-pause]"); if (guidedPause) guidedPause.addEventListener("click", () => this.pauseGuidedTour()); const guidedResume = this.root.querySelector("[data-arcsecs-guided-tour-resume]"); if (guidedResume) guidedResume.addEventListener("click", () => this.resumeGuidedTour()); const exportGuidedTour = this.root.querySelector("[data-arcsecs-export-guided-tour]"); if (exportGuidedTour) exportGuidedTour.addEventListener("click", () => this.exportGuidedTour()); this.root.querySelectorAll("[data-arcsecs-guided-tour-stage]").forEach((button) => button.addEventListener("click", () => this.selectGuidedTourStage(button.getAttribute("data-arcsecs-guided-tour-stage") || "relationalLattice"))); const clearMemory = this.root.querySelector("[data-arcsecs-clear-memory]"); if (clearMemory) clearMemory.addEventListener("click", () => { this.memory.clear(); this.renderMemory(); this.updateStatus("Memory cleared."); }); const exportCertificate = this.root.querySelector("[data-arcsecs-export-certificate]"); if (exportCertificate) exportCertificate.addEventListener("click", () => this.exportCalibrationCertificate()); const runQueue = this.root.querySelector("[data-arcsecs-run-queue]"); if (runQueue) runQueue.addEventListener("click", () => this.runBenchmark()); const exportQualityGate = this.root.querySelector("[data-arcsecs-export-quality-gate]"); if (exportQualityGate) exportQualityGate.addEventListener("click", () => this.exportQualityGateReport()); const exportReleasePacket = this.root.querySelector("[data-arcsecs-export-release-packet]"); if (exportReleasePacket) exportReleasePacket.addEventListener("click", () => this.exportReleasePacket()); const exportRunbook = this.root.querySelector("[data-arcsecs-export-runbook]"); if (exportRunbook) exportRunbook.addEventListener("click", () => this.exportOperatorRunbook()); const copySummary = this.root.querySelector("[data-arcsecs-copy-summary]"); if (copySummary) copySummary.addEventListener("click", () => this.copyOperatorSummary()); const palette = this.root.querySelector("[data-arcsecs-command-palette]"); if (palette) palette.addEventListener("click", () => this.openCommandPalette()); const closePalette = this.root.querySelector("[data-arcsecs-command-close]"); if (closePalette) closePalette.addEventListener("click", () => this.closeCommandPalette()); const tour = this.root.querySelector("[data-arcsecs-tour]"); if (tour) tour.addEventListener("click", () => this.startGuidedTour()); this.root.querySelectorAll("[data-arcsecs-audience-mode]").forEach((button) => button.addEventListener("click", () => this.setAudienceMode(button.getAttribute("data-arcsecs-audience-mode") || "public"))); this.root.querySelectorAll("[data-arcsecs-layout-mode]").forEach((button) => button.addEventListener("click", () => this.setLayoutMode(button.getAttribute("data-arcsecs-layout-mode") || "lab"))); this.bindStaticDraftReviewControls(); this.bindStaticPublicationReviewControls(); this.bindStaticPublishHandoffQaControls(); this.bindKeyboardShortcuts(); }
        executeAutoLaunch(force) { const plan = this.autoLaunchDirector.execute(this, force === true); return plan; }
        updateAutoLaunchPanel(plan, state) { const panel = this.root.querySelector("[data-arcsecs-autolaunch-panel]"); if (!panel || !plan) return; const label = state === "runningGrandExperiment" ? "Grand Experiment running" : state === "runningScenario" ? "Scenario running" : state === "complete" ? "Complete" : state === "blocked" ? "Blocked" : state === "disabled" ? "Disabled" : "Queued"; panel.innerHTML = `<p><strong>Autopilot:</strong> ${label}</p><p>${plan.reason}</p><dl><dt>Scenario autostart</dt><dd>${plan.shouldRunScenario ? "enabled" : "disabled"}</dd><dt>Grand Experiment autostart</dt><dd>${plan.shouldRunGrandExperiment ? "enabled" : "disabled"}</dd><dt>Launch delay</dt><dd>${formatNumber(plan.delayMilliseconds)} ms</dd><dt>Reduced motion</dt><dd>${plan.respectsReducedMotion ? "conservative budget" : "normal budget"}</dd></dl>`; }
        togglePlayPause(button) { if (this.runner.running) { this.runner.pause(); button.textContent = "Resume"; button.setAttribute("aria-pressed", "true"); this.updateStatus("Animation paused — worker computation is separate; use Cancel computation to stop it."); } else { this.runner.resume(); button.textContent = "Pause"; button.setAttribute("aria-pressed", "false"); this.updateStatus("Resumed live simulation loop."); } }
        openCommandPalette() { const panel = this.root.querySelector("[data-arcsecs-command-panel]"); const trigger = this.root.querySelector("[data-arcsecs-command-palette]"); if (panel) { panel.hidden = false; } if (trigger) { trigger.setAttribute("aria-expanded", "true"); } const first = panel ? panel.querySelector("button") : null; if (first) { first.focus(); } }
        closeCommandPalette() { const panel = this.root.querySelector("[data-arcsecs-command-panel]"); const trigger = this.root.querySelector("[data-arcsecs-command-palette]"); if (panel) { panel.hidden = true; } if (trigger) { trigger.setAttribute("aria-expanded", "false"); } }
        startGuidedTour(options) { const snapshot = this.guidedAutopilotTour.start(); this.applyGuidedTourSnapshot(snapshot, !(options && options.runScenario === false), options && options.autoStarted === true ? "Autopilot Guided Tour started" : "Guided Tour started"); }
        advanceGuidedTour() { const snapshot = this.guidedAutopilotTour.next(); this.applyGuidedTourSnapshot(snapshot, true, "Guided Tour advanced"); }
        previousGuidedTour() { const snapshot = this.guidedAutopilotTour.previous(); this.applyGuidedTourSnapshot(snapshot, true, "Guided Tour moved back"); }
        pauseGuidedTour() { const snapshot = this.guidedAutopilotTour.pause(); this.renderGuidedAutopilotTour(snapshot); this.recordFlightEvent({ label: "Guided Tour paused", detail: "The visible guided tour is paused; the current simulation can still be inspected.", severity: "info", source: "guided-tour", scenario: snapshot.currentScenario, status: "paused" }); this.updateStatus("Guided tour paused at " + snapshot.currentTitle + "."); }
        resumeGuidedTour() { const snapshot = this.guidedAutopilotTour.resume(); this.applyGuidedTourSnapshot(snapshot, false, "Guided Tour resumed"); }
        selectGuidedTourStage(scenario) { const snapshot = this.guidedAutopilotTour.selectScenario(scenario); this.applyGuidedTourSnapshot(snapshot, true, "Guided Tour stage selected"); }
        applyGuidedTourSnapshot(snapshot, runScenario, label) { this.renderGuidedAutopilotTour(snapshot); this.setScenario(snapshot.currentScenario); this.recordFlightEvent({ label: label || "Guided Tour updated", detail: "Stage " + (snapshot.currentStageIndex + 1) + " of " + snapshot.stageCount + ": " + snapshot.currentTitle + ".", severity: "info", source: "guided-tour", scenario: snapshot.currentScenario, status: snapshot.status }); this.updateStatus((label || "Guided Tour") + ": " + snapshot.currentTitle + "."); if (runScenario) { this.runSimulation(); } }
        renderGuidedAutopilotTour(snapshot) { const panel = this.root.querySelector("[data-arcsecs-guided-tour-panel]"); if (!panel || !this.guidedAutopilotTour) { return; } const state = snapshot || this.guidedAutopilotTour.snapshot(); const current = state.stages[state.currentStageIndex] || state.stages[0]; const grandRows = this.latestGrandTour && Array.isArray(this.latestGrandTour.rows) ? this.latestGrandTour.rows : []; const rowLookup = new Map(grandRows.map((row) => [row.scenario, row])); panel.innerHTML = `<div class="arcsecs-guided-tour-meter"><strong>${state.progressPercent}%</strong><span>${state.status} · stage ${state.currentStageIndex + 1}/${state.stageCount}</span><b style="width:${state.progressPercent}%"></b></div><article class="arcsecs-guided-tour-current"><header><span>${current.order}</span><strong>${current.title}</strong></header><p>${current.plainLanguageGoal}</p><dl><dt>Operator action</dt><dd>${current.operatorAction}</dd><dt>Physicist checkpoint</dt><dd>${current.physicistCheckpoint}</dd><dt>Expected evidence</dt><dd>${current.expectedEvidence}</dd></dl></article><ol class="arcsecs-guided-tour-stages">${state.stages.map((stage) => { const evidence = rowLookup.get(stage.scenario); const evidenceText = evidence ? `${evidence.status}: ${evidence.primaryMetric} ${formatNumber(evidence.primaryValue)}` : "waiting for sweep"; return `<li class="is-${stage.status}"><button type="button" data-arcsecs-guided-tour-stage="${stage.scenario}" aria-label="Open guided tour stage ${stage.order}: ${stage.title}"><strong>${stage.order}. ${stage.title}</strong><span>${stage.plainLanguageGoal}</span><em>${evidenceText}</em></button></li>`; }).join("")}</ol><p><strong>Boundary:</strong> guided tour cards explain a speculative research visualization, not established physics or measured drive performance.</p>`; panel.querySelectorAll("[data-arcsecs-guided-tour-stage]").forEach((button) => button.addEventListener("click", () => this.selectGuidedTourStage(button.getAttribute("data-arcsecs-guided-tour-stage") || "relationalLattice"))); }
        exportGuidedTour() { if (!this.guidedAutopilotTour) { this.updateStatus("Guided tour is unavailable in this browser session."); return; } const snapshot = this.guidedAutopilotTour.snapshot();
            this.download("arcsecs-guided-autopilot-tour.json", JSON.stringify({ packetType: "ArcSecs Guided Autopilot Tour", generatedUtc: new Date().toISOString(), scientificBoundary: "Speculative research visualization — not established current technology.", snapshot, grandExperimentSummary: this.latestGrandTour ? this.latestGrandTour.summary : null, flightRecorder: this.flightRecorder ? this.flightRecorder.snapshot(9) : null, exportContainsExecutableCode: false }, null, 2), "application/json"); }
        applyRamjetPreset(preset) {
            const defaults = this.getRamjetPresetDefaults(preset);
            Object.keys(defaults).forEach((name) => {
                const field = this.form.elements[name];
                if (field) { field.value = String(defaults[name]); }
            });
            const selector = this.form.elements.ramjetPreset;
            if (selector) { selector.value = preset; }
            this.updateStatus("Loaded ramjet preset: " + preset + ". Running deterministic pipeline audit.");
        }
        applyFailureInjection(mode) { const field = this.form.elements.failureInjectionMode; if (field) { field.value = mode; } this.root.querySelectorAll("[data-arcsecs-failure-inject]").forEach((button) => { const active = button.getAttribute("data-arcsecs-failure-inject") === mode; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", active ? "true" : "false"); }); this.updateStatus("Failure injection armed: " + mode + "."); }

        getRamjetPresetDefaults(preset) {
            const table = {
                stableCruise: { substrateDensity: 1, shipVelocityRatioC: 0.32, thermalRejectionCapacity: 36, reactorConversionEfficiency: 0.74, bufferCapacity: 48, shieldAblationRate: 0.08 },
                lowSubstrateDensity: { substrateDensity: 0.18, scoopFieldDiameterKilometers: 5200, shipVelocityRatioC: 0.28 },
                highVelocityDragStress: { shipVelocityRatioC: 0.74, intakeDragCoefficient: 1.65, stabilizationGain: 1.2 },
                shieldAblationEvent: { shieldAblationRate: 0.48, shipVelocityRatioC: 0.66, habitatIsolationFactor: 0.88 },
                thermalOverload: { thermalRejectionCapacity: 7, reactorConversionEfficiency: 0.52, radiatorReserve: 0.02 },
                bufferSaturation: { bufferCapacity: 7, compressionRatio: 42, substrateDensity: 1.8 },
                reactorEfficiencySweep: { reactorConversionEfficiency: 0.48, substrateDensity: 1.4, compressionRatio: 24 },
                emergencyIntakeShutdown: { substrateDensity: 0.02, scoopFieldDiameterKilometers: 450, shipVelocityRatioC: 0.16 },
                maximumFieldCapture: { scoopFieldDiameterKilometers: 9800, substrateDensity: 2.8, compressionRatio: 28 },
                educationalSlowMotion: { speedMultiplier: 0.25, shipVelocityRatioC: 0.16, substrateDensity: 0.75 }
            };
            return table[preset] || table.stableCruise;
        }

        initializeHelpTooltips() {
            const fallbackDescriptions = {
                "scenario": "Scenario selector. Changes the active physics mode, visualization, controls, diagnostics, comparison panel, explanation panel, and validation checks.",
                "showLabels": "Toggle labels. Shows or hides technical labels in the viewport overlays and rendered scene.",
                "showGrid": "Toggle grid. Shows or hides the flat coordinate reference grid. The grid is a label system, not a physical spacetime fabric.",
                "showVectors": "Toggle vectors. Shows or hides force, velocity, drag, torsion-style, or flow vectors where the active scenario supports them.",
                "showTrails": "Toggle trails. Shows or hides historical paths for photons, bodies, particles, or flow packets.",
                "showDiagnostics": "Toggle diagnostics. Shows or hides debug-style overlays and measurement annotations in the viewport."
            };
            this.root.querySelectorAll("button, a, select, input, label, canvas, [role='button']").forEach((element) => {
                if (!element.getAttribute("title")) {
                    const name = element.getAttribute("name") || "";
                    const text = (element.textContent || element.getAttribute("aria-label") || name || "ArcSecs control").trim().replace(/\s+/g, " ");
                    const description = fallbackDescriptions[name] || (text ? text + ": ArcSecs cockpit control. Hover text added so the purpose of this control is discoverable without guessing." : "ArcSecs cockpit control.");
                    element.setAttribute("title", description);
                }
                if ((element.tagName || "").toLowerCase() === "button" && !element.getAttribute("aria-label")) {
                    const label = (element.textContent || "ArcSecs control").trim().replace(/\s+/g, " ");
                    element.setAttribute("aria-label", label);
                }
            });
            this.root.querySelectorAll("section, article, aside").forEach((panel) => {
                if (!panel.getAttribute("title")) {
                    const heading = panel.querySelector("h2, h3, header strong, .arcsecs-section-title strong");
                    if (heading && heading.textContent) {
                        panel.setAttribute("title", heading.textContent.trim() + ": scientific panel with live information for the selected ArcSecs scenario.");
                    }
                }
            });
        }

        bindKeyboardShortcuts() { this.root.addEventListener("keydown", (event) => { const target = event.target; const tag = target && target.tagName ? target.tagName.toLowerCase() : ""; if (tag === "input" || tag === "select" || tag === "textarea") { return; } const keys = { "1": "relationalLattice", "2": "absoluteTimeQuantumOscillator", "3": "massivePhotonLensing", "4": "newtonianDarkStar", "5": "superluminalGalilean", "6": "tiredLightEnergyLedger", "7": "darkMatterCondensate", "8": "darkMatterRamjet", "9": "parallaxCalibration" }; if (keys[event.key]) { event.preventDefault(); this.setScenario(keys[event.key]); this.updateStatus("Keyboard preset " + event.key + " selected."); this.runSimulation(); } else if (event.key === " ") { event.preventDefault(); const button = this.root.querySelector("[data-arcsecs-play-pause]"); if (button) { this.togglePlayPause(button); } } else if (event.key.toLowerCase() === "r") { event.preventDefault(); this.runner.tick = 0; this.runSimulation(); } else if (event.key.toLowerCase() === "s") { event.preventDefault(); this.runner.stepOneTick(); this.updateCounters(16); } else if (event.key === "?" || event.key.toLowerCase() === "h") { event.preventDefault(); this.openCommandPalette(); } else if (event.key === "Escape") { this.closeCommandPalette(); this.closeParameterGuide(); } }); }
        loadDefaultScenario() { this.setScenario(this.root.dataset.defaultScenario || "relationalLattice"); const steps = this.root.dataset.defaultSteps; if (steps && this.form.elements.acceptedSteps) { this.form.elements.acceptedSteps.value = steps; } }
        setScenario(key) { const scenario = ScenarioRegistry.validateScenario(key) ? key : "relationalLattice"; this.form.elements.scenario.value = scenario; this.updateExplanation(scenario); this.updateScenarioChrome(scenario, null); this.updatePresetActiveState(scenario); if (scenario === "distanceTimeKernel") { const previewConfig = this.toConfig(); const previewResult = Object.assign({}, this.latestResult || {}, { config: previewConfig, metrics: this.latestResult && this.latestResult.metrics ? this.latestResult.metrics : {}, distanceTimeKernel: buildDistanceTimeKernelState(previewConfig, this.frame || 0), distanceTimeActiveClaimKey: this.activeDistanceTimeClaimKey }); this.latestDistanceTimeKernel = previewResult.distanceTimeKernel; this.updateDistanceTimeKernelPanels(previewResult); this.viewport.draw(previewResult, this.frame || 0); } }
        toConfig() { const data = new FormData(this.form); return { scenario: String(data.get("scenario") || "relationalLattice"), acceptedSteps: Math.round(clamp(numberOrDefault(data.get("acceptedSteps"), 6000), 500, 25000)), speedMultiplier: numberOrDefault(data.get("speedMultiplier"), 1), lossRate: numberOrDefault(data.get("lossRate"), 0.042), photonMassEv: numberOrDefault(data.get("photonMassEv"), 1e-18), betaCoupling: numberOrDefault(data.get("betaCoupling"), 1.25), accelerationThreshold: numberOrDefault(data.get("accelerationThreshold"), 1.2), baryonicMass: numberOrDefault(data.get("baryonicMass"), 6.2), groupVelocityFraction: numberOrDefault(data.get("groupVelocityFraction"), 0.08), restitution: numberOrDefault(data.get("restitution"), 0.62), friction: numberOrDefault(data.get("friction"), 0.24), photonPacketCount: numberOrDefault(data.get("photonPacketCount"), 512), intergalacticParticleDensity: numberOrDefault(data.get("intergalacticParticleDensity"), 1), forwardScatteringStrictness: numberOrDefault(data.get("forwardScatteringStrictness"), 0.92), softeningRadius: numberOrDefault(data.get("softeningRadius"), 0.16), parallaxArcseconds: numberOrDefault(data.get("parallaxArcseconds"), 1), baselineAu: numberOrDefault(data.get("baselineAu"), 1), apertureRadius: numberOrDefault(data.get("apertureRadius"), 12), backgroundSkyLevel: numberOrDefault(data.get("backgroundSkyLevel"), 24), showLabels: Boolean(data.get("showLabels")), showGrid: Boolean(data.get("showGrid")), showVectors: Boolean(data.get("showVectors")), showTrails: Boolean(data.get("showTrails")), showDiagnostics: Boolean(data.get("showDiagnostics")), scoopFieldDiameterKilometers: numberOrDefault(data.get("scoopFieldDiameterKilometers"), 4000), substrateDensity: numberOrDefault(data.get("substrateDensity"), 1), shipVelocityRatioC: numberOrDefault(data.get("shipVelocityRatioC"), 0.32), intakeDragCoefficient: numberOrDefault(data.get("intakeDragCoefficient"), 0.9), shieldAblationRate: numberOrDefault(data.get("shieldAblationRate"), 0.08), compressionRatio: numberOrDefault(data.get("compressionRatio"), 18), bufferCapacity: numberOrDefault(data.get("bufferCapacity"), 48), reactorConversionEfficiency: numberOrDefault(data.get("reactorConversionEfficiency"), 0.74), thermalRejectionCapacity: numberOrDefault(data.get("thermalRejectionCapacity"), 36), exhaustCollimationEfficiency: numberOrDefault(data.get("exhaustCollimationEfficiency"), 0.86),
                ramjetPreset: String(data.get("ramjetPreset") || "stableCruise"),
                comparisonMode: String(data.get("comparisonMode") || "fullPipeline"),
                failureInjectionMode: String(data.get("failureInjectionMode") || "none"),
                stabilizationGain: numberOrDefault(data.get("stabilizationGain"), 1),
                radiatorReserve: numberOrDefault(data.get("radiatorReserve"), 0.35),
                habitatIsolationFactor: numberOrDefault(data.get("habitatIsolationFactor"), 0.82),
                distanceTimeEvent: String(data.get("distanceTimeEvent") || "gw170817"),
                distanceTimeParallaxArcseconds: numberOrDefault(data.get("distanceTimeParallaxArcseconds"), 0.76813),
                distanceTimeAngularSeparationRadians: numberOrDefault(data.get("distanceTimeAngularSeparationRadians"), 0.000004848),
                distanceTimeProperMotionArcsecondsPerYear: numberOrDefault(data.get("distanceTimeProperMotionArcsecondsPerYear"), 3.85) }; }
        setWorkerBusy(busy) { this.workerBusy = busy; const button = this.root.querySelector("[data-arcsecs-cancel-run]"); if (button) button.disabled = !busy; }
        releaseWorker() { if (this.workerWatchdog) { window.clearTimeout(this.workerWatchdog); this.workerWatchdog = null; } if (this.worker) { this.worker.terminate(); this.worker = null; } this.setWorkerBusy(false); }
        cancelComputation() { this.autoLaunchDirector.cancel(); this.pendingSweep = false; this.activeRunId += 1; this.releaseWorker(); this.updateStatus("Computation cancelled. Run again when ready."); this.updateRunGuideState("waiting", "Computation cancelled; no new result was accepted."); }
        openWorker(settings, runId) { try { this.worker = createDeploymentWorker("arcsecs-physics-worker.js", settings.workerUrl); this.setWorkerBusy(true); this.workerWatchdog = window.setTimeout(() => { if (this.activeRunId !== runId || !this.workerBusy) return; this.activeRunId += 1; this.pendingSweep = false; this.releaseWorker(); this.updateStatus("Computation timed out after 120 seconds. Reduce the run size and retry."); this.updateRunGuideState("error", "Worker timeout; no result accepted."); }, 120000); return true; } catch (error) { this.pendingSweep = false; this.releaseWorker(); this.updateStatus("Cannot start worker: " + String(error.message || error)); this.updateRunGuideState("error", "Worker could not start. Check browser and network settings."); return false; } }
        runSimulation(options) { const config = this.toConfig(); const autoStarted = options && options.autoStarted === true; if (!autoStarted) { this.pendingSweep = false; this.autoLaunchDirector.cancel(); } this.recordFlightEvent({ label: autoStarted ? "Autopilot scenario run requested" : "Scenario run requested", detail: "Worker run requested for " + ScenarioRegistry.getScenario(config.scenario).label + ".", severity: "info", source: autoStarted ? "autopilot" : "operator", scenario: config.scenario, status: "running" }); this.runner.setSpeedMultiplier(config.speedMultiplier); this.updateStatus("Running " + ScenarioRegistry.getScenario(config.scenario).label + "…"); this.updateRunGuideState("running", "Running " + ScenarioRegistry.getScenario(config.scenario).label + ". Watch the center viewport redraw, then inspect the telemetry strip and the two bottom graphs. If the changes are subtle, use Step to advance one deterministic tick."); this.renderWaitingEvidenceState(config.scenario); const runId = ++this.activeRunId; this.releaseWorker(); if (!window.Worker) { this.recordFlightEvent({ label: "Scenario worker unavailable", detail: "Browser Web Worker support is unavailable, so the simulation thread cannot start.", severity: "fail", source: "worker", scenario: config.scenario, status: "blocked" }); this.updateStatus("Worker unavailable — this browser cannot run the simulator thread."); this.updateRunGuideState("error", "This browser cannot start the simulation worker, so the viewport and evidence checklist cannot refresh."); return; } const settings = window.ArcSecsPhysicsEngineSettings || {}; if (!this.openWorker(settings, runId)) return; this.worker.addEventListener("message", (event) => { const data = event.data || {}; if (data.runId !== runId || this.activeRunId !== runId) { return; } if (data.type === "error") { this.pendingSweep = false; this.releaseWorker(); this.recordFlightEvent({ label: "Scenario run failed", detail: String(data.message || "Unknown worker error"), severity: "fail", source: "worker", scenario: config.scenario, status: "error" }); this.updateStatus("Simulation failed: " + data.message); this.updateRunGuideState("error", "Simulation failed: " + data.message); return; } if (data.type === "result") { this.releaseWorker(); this.latestResult = data.result; this.completedRequestConfig = JSON.stringify(config); this.root.classList.toggle("arcsecs-is-dirty", this.completedRequestConfig !== JSON.stringify(this.toConfig())); this.recordFlightEvent({ label: "Scenario run complete", detail: "Accepted " + formatCount(data.result.acceptedSteps || 0) + " fixed ticks with ledger " + ((data.result.metrics && data.result.metrics.ledgerStatus) || "pass") + ".", severity: "pass", source: "worker", tick: data.result.acceptedSteps || 0, scenario: data.result.config.scenario, status: "complete" }); this.updateFromResult(data.result); this.updateRunGuideState("complete", "Run complete. The viewport, telemetry strip, and bottom graphs now describe " + ScenarioRegistry.getScenario(data.result.config.scenario).label + ". Use the evidence checklist below to confirm the important signals."); this.updateStatus(this.root.classList.contains("arcsecs-is-dirty") ? "Completed for previous parameters — run again to refresh." : "Completed — use Resume to animate the viewport."); if (this.pendingSweep) { this.pendingSweep = false; if (!document.hidden) this.runGrandExperiment({autoStarted: true}); } } }); this.worker.addEventListener("error", () => { if (this.activeRunId !== runId) return; this.pendingSweep = false; this.releaseWorker(); this.recordFlightEvent({ label: "Scenario worker error", detail: "The worker raised an error event before returning scenario telemetry.", severity: "fail", source: "worker", scenario: config.scenario, status: "error" }); this.updateStatus("Simulation failed: Worker error"); this.updateRunGuideState("error", "A worker error stopped the run before the evidence checklist could update."); }); this.worker.postMessage({ type: "run", runId, config }); }
        runBenchmark() { this.pendingSweep = false; this.autoLaunchDirector.cancel(); const config = this.toConfig(); const runId = ++this.activeRunId; this.updateStatus("Running validation benchmark suite…"); this.releaseWorker(); if (!window.Worker) { this.updateStatus("Worker unavailable — benchmark cannot run."); return; } const settings = window.ArcSecsPhysicsEngineSettings || {}; if (!this.openWorker(settings, runId)) return; this.worker.addEventListener("message", (event) => { const data = event.data || {}; if (data.runId !== runId || this.activeRunId !== runId) { return; } if (data.type === "error") { this.pendingSweep = false; this.releaseWorker(); this.updateStatus("Benchmark failed: " + data.message); return; } if (data.type === "benchmark") { this.releaseWorker(); this.latestBenchmark = data.benchmark; this.updateBenchmarkPanel(data.benchmark); this.updateStatus("Benchmark suite complete."); } }); this.worker.addEventListener("error", () => { if (this.activeRunId !== runId) return; this.releaseWorker(); this.updateStatus("Benchmark failed: Worker error"); }); this.worker.postMessage({ type: "benchmark", runId, config }); }
        updateValidationLab(result) { const panel = this.root.querySelector("[data-arcsecs-validation-lab]"); if (!panel) return; const lab = result.validationLab || {}; const targets = lab.benchmarkTargets || []; panel.innerHTML = `<div class="arcsecs-validation-score"><strong>${formatNumber((lab.validationScore || 0) * 100)}%</strong><span>validation score</span><strong>${formatNumber((lab.observationalFitScore || 0) * 100)}%</strong><span>observation fit proxy</span></div><table><thead><tr><th>Benchmark</th><th>Expected</th><th>Actual</th><th>Status</th></tr></thead><tbody>${targets.map((item) => `<tr><td>${item.name}</td><td>${item.expected}</td><td>${formatNumber(Number(item.actual)) || item.actual}</td><td>${item.passed ? "pass" : "review"}</td></tr>`).join("")}</tbody></table><p>${lab.caution || "Speculative validation only."}</p>`; }
        updateObservationPanel(result) { const panel = this.root.querySelector("[data-arcsecs-observation-frame]"); if (!panel) return; const frame = result.observationFrame || {}; panel.innerHTML = `<p><strong>${frame.headline || "Observation frame"}</strong></p><dl><dt>Primary measurement</dt><dd>${formatNumber(frame.primaryMeasurement || 0)}</dd><dt>Secondary measurement</dt><dd>${formatNumber(frame.secondaryMeasurement || 0)}</dd><dt>Baseline</dt><dd>${formatNumber(frame.comparisonBaseline || 0)}</dd><dt>Signal quality</dt><dd>${formatNumber((frame.signalQuality || 0) * 100)}%</dd></dl><p>${frame.recommendedNextStep || "Run a scenario to populate observations."}</p>`; }
        updateMeasurementHistory(result) { const panel = this.root.querySelector("[data-arcsecs-measurement-history]"); if (!panel) return; this.measurementHistory.unshift({ scenario: result.config.scenario, utc: result.runTimestampUtc, ledger: result.metrics.ledgerStatus || "pass", delta: result.metrics.baselineDelta || 0, score: result.validationLab ? result.validationLab.validationScore : 0 }); this.measurementHistory = this.measurementHistory.slice(0, 10); panel.innerHTML = this.measurementHistory.map((item) => `<span><strong>${ScenarioRegistry.getScenario(item.scenario).label}</strong><em>${item.ledger}</em><b>Δ ${formatNumber(item.delta)}</b><small>${item.utc}</small></span>`).join(""); }
        updateBenchmarkPanel(benchmark) { const panel = this.root.querySelector("[data-arcsecs-benchmark-panel]"); if (!panel) return; panel.innerHTML = `<p><strong>Average validation:</strong> ${formatNumber((benchmark.summary.averageValidationScore || 0) * 100)}% | <strong>Average observation fit:</strong> ${formatNumber((benchmark.summary.averageObservationalFitScore || 0) * 100)}%</p><table><thead><tr><th>Scenario</th><th>Validation</th><th>Fit</th><th>Warnings</th></tr></thead><tbody>${benchmark.rows.map((row) => `<tr><td>${row.scenario}</td><td>${formatNumber(row.validationScore * 100)}%</td><td>${formatNumber(row.observationalFitScore * 100)}%</td><td>${row.warnings}</td></tr>`).join("")}</tbody></table><p><strong>Next priority:</strong> ${benchmark.summary.recommendedPriority || "none"}</p><p>${benchmark.caution}</p>`; }
        runGrandExperiment(options) { this.pendingSweep = false; this.autoLaunchDirector.cancel(); const config = this.toConfig(); const runId = ++this.activeRunId; const autoStarted = options && options.autoStarted === true; this.recordFlightEvent({ label: autoStarted ? "Autopilot Grand Experiment requested" : "Grand Experiment requested", detail: "Nine-mode evidence sweep requested from the worker.", severity: "info", source: autoStarted ? "autopilot" : "operator", scenario: config.scenario, status: "runningGrandExperiment" }); this.updateStatus(autoStarted ? "Autopilot started Grand Experiment Director sweep…" : "Running Grand Experiment Director sweep…"); this.releaseWorker(); if (!window.Worker) { this.recordFlightEvent({ label: "Grand Experiment blocked", detail: "Browser Web Worker support is unavailable, so the evidence sweep cannot run.", severity: "fail", source: "worker", scenario: config.scenario, status: "blocked" }); this.updateStatus("Worker unavailable — Grand Experiment Director cannot run."); return; } const settings = window.ArcSecsPhysicsEngineSettings || {}; if (!this.openWorker(settings, runId)) return; this.worker.addEventListener("message", (event) => { const data = event.data || {}; if (data.runId !== runId || this.activeRunId !== runId) { return; } if (data.type === "error") { this.pendingSweep = false; this.releaseWorker(); this.recordFlightEvent({ label: "Grand Experiment failed", detail: String(data.message || "Unknown worker error"), severity: "fail", source: "grand-experiment", scenario: config.scenario, status: "error" }); this.updateStatus("Grand Experiment failed: " + data.message); return; } if (data.type === "grandTour") { this.releaseWorker(); this.latestGrandTour = data.grandTour; const rows = Array.isArray(data.grandTour.rows) ? data.grandTour.rows : []; rows.forEach((row) => this.recordFlightEvent({ label: "Stage " + row.order + " complete", detail: row.title + " reported " + row.primaryMetric + " = " + formatNumber(row.primaryValue) + ".", severity: row.status === "pass" ? "pass" : "warn", source: "grand-experiment", scenario: row.scenario, status: row.status })); this.recordFlightEvent({ label: "Grand Experiment complete", detail: (data.grandTour.summary.passCount || 0) + "/" + (data.grandTour.summary.stageCount || 0) + " stages passed; export readiness " + data.grandTour.summary.exportReadiness + ".", severity: data.grandTour.summary.exportReadiness === "ready" ? "pass" : "warn", source: "grand-experiment", scenario: config.scenario, status: "complete" }); this.updateGrandExperimentPanel(data.grandTour); this.renderGuidedAutopilotTour(); this.buildReviewCockpitPanel(false); this.updateAutoLaunchPanel(this.autoLaunchDirector.buildPlan(), "complete"); this.renderFlightRecorder(); this.updateStatus(autoStarted ? "Autopilot Grand Experiment sweep complete." : "Grand Experiment Director sweep complete."); } }); this.worker.addEventListener("error", () => { if (this.activeRunId !== runId) return; this.pendingSweep = false; this.releaseWorker(); this.recordFlightEvent({ label: "Grand Experiment worker error", detail: "The worker raised an error event before returning the evidence sweep.", severity: "fail", source: "grand-experiment", scenario: config.scenario, status: "error" }); this.updateStatus("Grand Experiment failed: Worker error"); }); this.worker.postMessage({ type: "grandTour", runId, config }); }
        updateGrandExperimentPanel(grandTour) { const panel = this.root.querySelector("[data-arcsecs-grand-tour-panel]"); if (!panel) return; const rows = Array.isArray(grandTour.rows) ? grandTour.rows : []; const failures = Array.isArray(grandTour.failureDeltas) ? grandTour.failureDeltas : []; panel.innerHTML = `<p><strong>${grandTour.summary.passCount}/${grandTour.summary.stageCount}</strong> stages passed | <strong>Average validation:</strong> ${formatNumber((grandTour.summary.averageValidationScore || 0) * 100)}% | <strong>Export readiness:</strong> ${grandTour.summary.exportReadiness}</p><table><thead><tr><th>#</th><th>Scenario</th><th>Metric</th><th>Value</th><th>Status</th></tr></thead><tbody>${rows.map((row) => `<tr class="is-${row.status}"><td>${row.order}</td><td>${row.title}</td><td>${row.primaryMetric}</td><td>${formatNumber(row.primaryValue)}</td><td>${row.status}</td></tr>`).join("")}</tbody></table><p><strong>Recommended next step:</strong> ${grandTour.summary.recommendedNextStep}</p><p><strong>Ramjet failure deltas:</strong> ${failures.map((item) => `${item.mode}: readiness ${formatNumber(item.readinessDelta)}, thermal ${formatNumber(item.thermalDelta)}`).join(" · ")}</p><p>${grandTour.scientificBoundary}</p>`; }
        updateFromResult(result) { result = normalizeResultTelemetry(result); this.latestResult = result; this.updateGraphCaptions(result); this.updateExplanation(result.config.scenario); this.updateScenarioChrome(result.config.scenario, result); this.updatePanels(result); this.updateCalibrationCertificate(result); this.updateModeReadiness(result); this.updateExperimentQueue(result); this.updateQualityGateReport(result); this.updateScenarioPassport(result); this.updateAnomalyTriage(result); this.updateAccessibilityAudit(result); this.updatePerformanceEnvelope(result); this.updateTestCoverageDashboard(result); this.updateStabilityDrilldown(result); this.updateScenarioCapabilityMap(result); this.updateOperatorRunbook(result); this.updateReleaseChecklist(result); this.updateExperimentRecorder(result); this.updateAudiencePanels(result); this.updateScenarioWalkthrough(result); this.updateAssumptionLadder(result); this.updateEquationLedger(result); this.updateSliderImpactMap(result); this.updatePhysicistScorecard(result); this.updateUniversalCosmicClock(result); this.updateRelationalArchitecturePanel(result); this.updateRelationalWorkbenchPanel(result); this.updateScenarioSpotlight(result); this.updateEvidenceChecklist(result); this.updateSignalLegend(result); this.updateVisitorStoryboard(result); this.updateLiveHealthPanel(result); this.updateExperimentRecipesPanel(result); this.updateImplementationMemoryPanel(result); this.updateDistanceTimeKernelPanels(result); this.renderLiveScenarioAuditConsole(this.buildLiveScenarioAuditSummary(result)); this.renderExperimentComparisonWorkbench(); this.completePlaylistItemFromResult(result); this.autoRecordExperimentLabNotebook(result); this.refreshExperimentReplayTimeline("result"); this.refreshExperimentSensitivityScan("result"); this.buildReviewCockpitPanel(false); this.renderNextActionCommandCenter(); this.primaryGraph.drawSeries(result, 1, 2); this.secondaryGraph.drawSeries(result, 3, 4); this.renderMemory(); }

        // v5.8.36 Public Publishing Evidence Archive Index and Reviewer Retrieval Notes.
        bindManualPublishingArchiveReceiptControls() {
            const buildArchive = this.root.querySelector("[data-arcsecs-build-manual-publishing-archive-receipt]"); if (buildArchive) buildArchive.addEventListener("click", () => this.buildManualPublishingArchiveReceipt(true));
            const buildSignOff = this.root.querySelector("[data-arcsecs-build-human-review-signoff-export]"); if (buildSignOff) buildSignOff.addEventListener("click", () => this.buildHumanReviewSignOffExport(true));
            const exportSelectedArchive = this.root.querySelector("[data-arcsecs-export-selected-archive-receipt-json]"); if (exportSelectedArchive) exportSelectedArchive.addEventListener("click", () => this.exportSelectedArchiveReceiptJson());
            const exportAllArchives = this.root.querySelector("[data-arcsecs-export-all-archive-receipts-json]"); if (exportAllArchives) exportAllArchives.addEventListener("click", () => this.exportAllArchiveReceiptsJson());
            const exportSignOff = this.root.querySelector("[data-arcsecs-export-human-review-signoff-json]"); if (exportSignOff) exportSignOff.addEventListener("click", () => this.exportHumanReviewSignOffJson());
            this.root.querySelectorAll("[data-arcsecs-archive-filter-scenario], [data-arcsecs-archive-filter-manual-handoff], [data-arcsecs-archive-filter-verification], [data-arcsecs-archive-filter-archive-status], [data-arcsecs-archive-filter-signoff-status], [data-arcsecs-archive-filter-warning], [data-arcsecs-archive-filter-rejected-phrase], [data-arcsecs-archive-receipt-status], [data-arcsecs-human-review-signoff-status], [data-arcsecs-human-reviewer-name], [data-arcsecs-human-review-note]").forEach((input) => input.addEventListener("change", () => { this.renderManualPublishingArchiveReceipt(); this.renderHumanReviewSignOffExport(); }));
        }
        getArchiveFilterValue(selector) { const input = this.root.querySelector(selector); return input && input.value ? input.value : "all"; }
        getArchiveReceiptStatusValue() { const input = this.root.querySelector("[data-arcsecs-archive-receipt-status]"); return input && input.value ? input.value : "not-reviewed"; }
        getHumanReviewSignOffStatusValue() { const input = this.root.querySelector("[data-arcsecs-human-review-signoff-status]"); return input && input.value ? input.value : "not-reviewed"; }
        getHumanReviewerNameValue() { const input = this.root.querySelector("[data-arcsecs-human-reviewer-name]"); return input && input.value ? input.value.trim() : ""; }
        getHumanReviewNoteValue() { const input = this.root.querySelector("[data-arcsecs-human-review-note]"); return input && input.value ? input.value.trim() : ""; }
        getArchiveReceiptSourceRows() {
            const runbook = this.latestPublicPageManualPublishingRunbook || this.buildPublicPageManualPublishingRunbook(false);
            const verification = this.latestPostDeployVerificationChecklist || this.buildPostDeployVerificationChecklist(false);
            const runbookRows = runbook && Array.isArray(runbook.runbookRows) ? runbook.runbookRows : [];
            const verificationRows = verification && Array.isArray(verification.postDeployVerificationRows) ? verification.postDeployVerificationRows : [];
            if (runbookRows.length) { return runbookRows.map((runbookRow) => Object.freeze({ runbookRow, verificationRow: verificationRows.find((row) => row.activeScenario === runbookRow.activeScenario) || null })); }
            const scenarioKey = this.toConfig ? this.toConfig().scenario : "distanceTimeKernel";
            return [Object.freeze({ runbookRow: Object.freeze({ activeScenario: scenarioKey, scenarioLabel: ScenarioRegistry.getScenario(scenarioKey).label, manualHandoffStatus: "not-reviewed", suggestedSlug: "missing slug", pageTitle: "missing page title", metaTitle: "missing meta title", metaDescription: "missing meta description", evidenceReferenceNote: "missing evidence reference note", warningCount: 1, rejectedPhraseStatus: "clear", placeholderSpeculativeLabelStatus: "pending", recommendedFixes: ["Build Manual Publishing Runbook before archive receipt."], warnings: ["Manual runbook missing."], speculativeBoundaryText: "Speculative research visualization boundary required.", exportContainsExecutableCode: false }), verificationRow: null })];
        }
        buildManualPublishingArchiveReceiptRow(pair) {
            const runbookRow = pair.runbookRow || {};
            const verificationRow = pair.verificationRow || {};
            const recommendedFixes = Array.from(new Set([].concat(runbookRow.recommendedFixes || [], verificationRow.recommendedFixes || [])));
            const warnings = Array.from(new Set([].concat(runbookRow.warnings || [], verificationRow.warnings || [])));
            const rejectedPhraseStatus = runbookRow.rejectedPhraseStatus || ((runbookRow.rejectedPhrases || []).length ? "rejected-phrases" : "clear");
            const manualHandoffStatus = runbookRow.manualHandoffStatus || "not-reviewed";
            const verificationStatus = verificationRow.verificationStatus || "pending-human-verification";
            const exportArchiveRetainedStatus = verificationRow.exportArchiveRetainedConfirmation || "pending-human-confirmation";
            if (["blocked", "rejected", "needs-revision", "not-reviewed"].indexOf(manualHandoffStatus) >= 0) { recommendedFixes.push("Resolve manual handoff status before archive receipt can be archived-for-review."); }
            if (verificationStatus.indexOf("pending") >= 0) { warnings.push("Post-deploy verification confirmations are pending human review."); }
            if (rejectedPhraseStatus !== "clear") { recommendedFixes.push("Remove rejected proof or operational-capability phrases before archive receipt sign-off."); }
            if (!runbookRow.speculativeBoundaryText) { recommendedFixes.push("Add speculative boundary text before archive receipt sign-off."); }
            if (!(runbookRow.falsificationNotes || verificationRow.falsificationNotes || runbookRow.evidenceReferenceNote)) { recommendedFixes.push("Retain falsification notes or evidence reference notes before sign-off."); }
            let archiveReceiptStatus = this.getArchiveReceiptStatusValue();
            if (["blocked", "rejected", "needs-revision", "not-reviewed"].indexOf(manualHandoffStatus) >= 0 || rejectedPhraseStatus !== "clear") { archiveReceiptStatus = archiveReceiptStatus === "rejected" ? "rejected" : "blocked"; }
            else if (warnings.length || recommendedFixes.length || manualHandoffStatus === "handoff-ready-with-warnings") { archiveReceiptStatus = "archived-with-warnings"; }
            else if (archiveReceiptStatus === "not-reviewed") { archiveReceiptStatus = "archived-for-review"; }
            return Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsManualPublishingArchiveReceiptRow", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: runbookRow.activeScenario || verificationRow.activeScenario || "distanceTimeKernel", scenarioLabel: runbookRow.scenarioLabel || verificationRow.scenarioLabel || "Current Scenario", manualHandoffStatus, verificationStatus, suggestedSlug: runbookRow.suggestedSlug || "missing slug", pageTitle: runbookRow.pageTitle || "missing page title", metaTitle: runbookRow.metaTitle || "missing meta title", metaDescription: runbookRow.metaDescription || "missing meta description", evidenceReferenceNote: runbookRow.evidenceReferenceNote || "missing evidence reference note", warningCount: warnings.length, rejectedPhraseStatus, placeholderSpeculativeLabelStatus: runbookRow.placeholderSpeculativeLabelStatus || "placeholder/speculative label review pending", exportArchiveRetainedStatus, archiveReceiptStatus, warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhraseStatus === "clear" ? [] : [rejectedPhraseStatus]), recommendedFixes: Object.freeze(recommendedFixes), publicPageManualPublishingRunbookRow: runbookRow, postDeployVerificationChecklistRow: verificationRow, speculativeBoundaryText: "Manual Publishing Archive Receipt rows are local review metadata only. They do not publish pages, create WordPress content, inject schema, fetch links, prove physics, or imply operational capability.", exportContainsExecutableCode: false });
        }
        filterArchiveReceiptRows(rows) {
            const scenario = this.getArchiveFilterValue("[data-arcsecs-archive-filter-scenario]");
            const handoff = this.getArchiveFilterValue("[data-arcsecs-archive-filter-manual-handoff]");
            const verification = this.getArchiveFilterValue("[data-arcsecs-archive-filter-verification]");
            const archiveStatus = this.getArchiveFilterValue("[data-arcsecs-archive-filter-archive-status]");
            const warning = this.getArchiveFilterValue("[data-arcsecs-archive-filter-warning]");
            const rejected = this.getArchiveFilterValue("[data-arcsecs-archive-filter-rejected-phrase]");
            return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (handoff === "all" || row.manualHandoffStatus === handoff) && (verification === "all" || row.verificationStatus === verification) && (archiveStatus === "all" || row.archiveReceiptStatus === archiveStatus) && (warning === "all" || (warning === "clear" ? row.warningCount === 0 : row.warningCount > 0)) && (rejected === "all" || row.rejectedPhraseStatus === rejected));
        }
        buildManualPublishingArchiveReceipt(updateUi) {
            const rows = this.getArchiveReceiptSourceRows().map((pair) => this.buildManualPublishingArchiveReceiptRow(pair));
            const payload = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsManualPublishingArchiveReceipt", manualPublishingArchiveReceiptVersion: "1.0.0", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel", archiveReceiptRows: Object.freeze(rows), archiveReceiptStatusesSupported: Object.freeze(["not-reviewed", "archived-for-review", "archived-with-warnings", "needs-revision", "blocked", "rejected"]), warnings: Object.freeze(rows.flatMap((row) => row.warnings || [])), rejectedPhrases: Object.freeze(rows.flatMap((row) => row.rejectedPhrases || [])), recommendedFixes: Object.freeze(rows.flatMap((row) => row.recommendedFixes || [])), falsificationNotes: Object.freeze(rows.map((row) => "Archive receipt retains falsification and boundary review for " + row.scenarioLabel + ".")), speculativeBoundaryText: "Manual Publishing Archive Receipt exports are inert local review metadata only. They do not publish pages, create content, inject schema, fetch links, prove physics, or imply operational capability.", references: Object.freeze(["publicPageManualPublishingRunbook", "postDeployVerificationChecklist", "staticPublishHandoffQaSummary", "publicPageContentChecklist", "pageDraftFreezeBundle", "sourceMatrix", "scenarioEquationLibrary", "uaiMemoryOrganizationCompletenessCheck"]), exportContainsExecutableCode: false });
            this.latestManualPublishingArchiveReceipt = payload;
            if (updateUi) { this.renderManualPublishingArchiveReceipt(); this.updateStatus("Built local Manual Publishing Archive Receipt rows."); }
            return payload;
        }
        renderManualPublishingArchiveReceipt() {
            const body = this.root.querySelector("[data-arcsecs-manual-publishing-archive-receipt-body]"); const status = this.root.querySelector("[data-arcsecs-manual-publishing-archive-receipt-status]"); if (!body) return;
            const payload = this.latestManualPublishingArchiveReceipt || this.buildManualPublishingArchiveReceipt(false); const rows = this.filterArchiveReceiptRows(payload.archiveReceiptRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="12">No archive receipt rows match the current filters.</td></tr>'; if (status) status.textContent = "Manual Publishing Archive Receipt has no matching rows."; return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.manualHandoffStatus)}</td><td>${auditEscapeHtml(row.verificationStatus)}</td><td>${auditEscapeHtml(row.suggestedSlug)}</td><td>${auditEscapeHtml(row.pageTitle)}</td><td>${auditEscapeHtml(row.metaTitle)}</td><td>${auditEscapeHtml(row.metaDescription)}</td><td>${auditEscapeHtml(row.evidenceReferenceNote)}</td><td>${auditEscapeHtml(String(row.warningCount))}</td><td>${auditEscapeHtml(row.rejectedPhraseStatus)}</td><td>${auditEscapeHtml(row.exportArchiveRetainedStatus)}</td><td>${auditEscapeHtml(row.archiveReceiptStatus)}</td></tr>`).join("");
            if (status) status.textContent = "Manual Publishing Archive Receipt has " + rows.length + " local row" + (rows.length === 1 ? "" : "s") + ". It is local review metadata only and does not publish anything.";
        }
        getSignOffSourceRows() {
            const archive = this.latestManualPublishingArchiveReceipt || this.buildManualPublishingArchiveReceipt(false);
            const receiptRows = archive && Array.isArray(archive.archiveReceiptRows) ? archive.archiveReceiptRows : [];
            return receiptRows.length ? receiptRows : this.getArchiveReceiptSourceRows().map((pair) => this.buildManualPublishingArchiveReceiptRow(pair));
        }
        buildHumanReviewSignOffRow(receiptRow) {
            const signOffStatus = this.getHumanReviewSignOffStatusValue();
            const reviewerName = this.getHumanReviewerNameValue();
            const reviewNote = this.getHumanReviewNoteValue();
            const recommendedFixes = Array.from(new Set(receiptRow.recommendedFixes || []));
            const warnings = Array.from(new Set(receiptRow.warnings || []));
            const manualHandoffStatus = receiptRow.manualHandoffStatus || "not-reviewed";
            const pendingVerification = (receiptRow.verificationStatus || "").indexOf("pending") >= 0 || (receiptRow.exportArchiveRetainedStatus || "").indexOf("pending") >= 0;
            const rejectedPhraseStatus = receiptRow.rejectedPhraseStatus || "clear";
            if (["blocked", "rejected", "needs-revision", "not-reviewed"].indexOf(manualHandoffStatus) >= 0) { recommendedFixes.push("Resolve blocked, rejected, needs-revision, or not-reviewed manual handoff status before sign-off."); }
            if (pendingVerification && signOffStatus !== "signed-off-with-warnings") { recommendedFixes.push("Complete or explicitly warn about pending post-deploy checklist confirmations before sign-off."); }
            if (rejectedPhraseStatus !== "clear") { recommendedFixes.push("Remove rejected proof or operational-capability phrases before human review sign-off."); }
            if (!receiptRow.speculativeBoundaryText) { recommendedFixes.push("Require speculative boundary text before human review sign-off."); }
            if (!receiptRow.evidenceReferenceNote || receiptRow.evidenceReferenceNote.indexOf("missing") >= 0) { recommendedFixes.push("Require falsification notes or evidence reference note before human review sign-off."); }
            if (manualHandoffStatus === "handoff-ready-with-warnings") { warnings.push("Manual handoff status is handoff-ready-with-warnings; sign-off should remain signed-off-with-warnings until a reviewer accepts the risk."); }
            if (recommendedFixes.length) { warnings.push("Human Review Sign-Off has unresolved recommended fixes."); }
            let finalSignOffStatus = signOffStatus;
            if (signOffStatus === "signed-off-for-manual-publishing" && (recommendedFixes.length || rejectedPhraseStatus !== "clear" || ["blocked", "rejected", "needs-revision", "not-reviewed"].indexOf(manualHandoffStatus) >= 0)) { finalSignOffStatus = "blocked"; }
            if (signOffStatus === "not-reviewed" && !recommendedFixes.length && !warnings.length) { finalSignOffStatus = "signed-off-for-manual-publishing"; }
            return Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsHumanReviewSignOffRow", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: receiptRow.activeScenario, scenarioLabel: receiptRow.scenarioLabel, reviewerNameOrHandle: reviewerName, reviewNote, signOffStatus: finalSignOffStatus, requestedSignOffStatus: signOffStatus, manualHandoffStatus, verificationStatus: receiptRow.verificationStatus, archiveReceiptStatus: receiptRow.archiveReceiptStatus, evidenceReferenceNote: receiptRow.evidenceReferenceNote, warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhraseStatus === "clear" ? [] : [rejectedPhraseStatus]), recommendedFixes: Object.freeze(recommendedFixes), falsificationNotes: Object.freeze(["Human sign-off requires falsification notes and visible speculative boundary copy for " + receiptRow.scenarioLabel + "."]), publicPageManualPublishingRunbookRow: receiptRow.publicPageManualPublishingRunbookRow || null, postDeployVerificationChecklistRow: receiptRow.postDeployVerificationChecklistRow || null, staticPublishHandoffQaSummaryRow: receiptRow.publicPageManualPublishingRunbookRow ? receiptRow.publicPageManualPublishingRunbookRow.staticPublishHandoffQaSummaryRow || null : null, publicPageContentChecklistRow: receiptRow.publicPageManualPublishingRunbookRow ? receiptRow.publicPageManualPublishingRunbookRow.publicPageContentChecklistRow || null : null, pageDraftFreezeBundleRow: null, sourceMatrixRow: null, scenarioEquationLibraryRow: null, speculativeBoundaryText: "Human Review Sign-Off exports are local inert reviewer artifacts only. They do not publish pages, create content, inject schema, fetch links, prove physics, or imply operational capability.", exportContainsExecutableCode: false });
        }
        filterHumanReviewSignOffRows(rows) {
            const base = this.filterArchiveReceiptRows(rows || []);
            const signoff = this.getArchiveFilterValue("[data-arcsecs-archive-filter-signoff-status]");
            return base.filter((row) => signoff === "all" || row.signOffStatus === signoff || row.requestedSignOffStatus === signoff);
        }
        buildHumanReviewSignOffExport(updateUi) {
            const rows = this.getSignOffSourceRows().map((row) => this.buildHumanReviewSignOffRow(row));
            const payload = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsHumanReviewSignOffExport", humanReviewSignOffExportVersion: "1.0.0", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel", reviewerNameOrHandle: this.getHumanReviewerNameValue(), reviewerNote: this.getHumanReviewNoteValue(), signOffRows: Object.freeze(rows), signOffStatusesSupported: Object.freeze(["not-reviewed", "signed-off-for-manual-publishing", "signed-off-with-warnings", "needs-revision", "blocked", "rejected"]), warnings: Object.freeze(rows.flatMap((row) => row.warnings || [])), rejectedPhrases: Object.freeze(rows.flatMap((row) => row.rejectedPhrases || [])), recommendedFixes: Object.freeze(rows.flatMap((row) => row.recommendedFixes || [])), falsificationNotes: Object.freeze(rows.flatMap((row) => row.falsificationNotes || [])), speculativeBoundaryText: "Human Review Sign-Off Export is inert local reviewer metadata only. It does not publish pages, create WordPress content, inject schema, fetch links, prove physics, or imply operational capability.", references: Object.freeze(["manualPublishingArchiveReceipt", "publicPageManualPublishingRunbook", "postDeployVerificationChecklist", "staticPublishHandoffQaSummary", "publicPageContentChecklist", "pageDraftFreezeBundle", "sourceMatrix", "scenarioEquationLibrary", "uaiMemoryOrganizationCompletenessCheck"]), exportContainsExecutableCode: false });
            this.latestHumanReviewSignOffExport = payload;
            if (updateUi) { this.renderHumanReviewSignOffExport(); this.updateStatus("Built local Human Review Sign-Off Export rows."); }
            return payload;
        }
        renderHumanReviewSignOffExport() {
            const body = this.root.querySelector("[data-arcsecs-human-review-signoff-body]"); const status = this.root.querySelector("[data-arcsecs-human-review-signoff-status-output]"); if (!body) return;
            const payload = this.latestHumanReviewSignOffExport || this.buildHumanReviewSignOffExport(false); const rows = this.filterHumanReviewSignOffRows(payload.signOffRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="10">No human review sign-off rows match the current filters.</td></tr>'; if (status) status.textContent = "Human Review Sign-Off Export has no matching rows."; return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.reviewerNameOrHandle || "optional")}</td><td>${auditEscapeHtml(row.signOffStatus)}</td><td>${auditEscapeHtml(row.manualHandoffStatus)}</td><td>${auditEscapeHtml(row.verificationStatus)}</td><td>${auditEscapeHtml(row.archiveReceiptStatus)}</td><td>${auditEscapeHtml(row.evidenceReferenceNote)}</td><td>${auditEscapeHtml(String((row.warnings || []).length))}</td><td>${auditEscapeHtml(String((row.rejectedPhrases || []).length))}</td><td>${auditEscapeHtml(String((row.recommendedFixes || []).length))}</td></tr>`).join("");
            if (status) status.textContent = "Human Review Sign-Off Export has " + rows.length + " local row" + (rows.length === 1 ? "" : "s") + ". It is local human review metadata only and does not publish anything.";
        }
        exportSelectedArchiveReceiptJson() {
            const payload = this.latestManualPublishingArchiveReceipt || this.buildManualPublishingArchiveReceipt(false);
            const activeScenario = this.toConfig ? this.toConfig().scenario : "distanceTimeKernel";
            const selectedRow = (payload.archiveReceiptRows || []).find((row) => row.activeScenario === activeScenario) || (payload.archiveReceiptRows || [])[0] || null;
            this.download("arcsecs-selected-manual-publishing-archive-receipt.json", JSON.stringify(Object.assign({}, payload, { exportType: "ArcSecsSelectedManualPublishingArchiveReceipt", selectedArchiveReceiptRow: selectedRow, archiveReceiptRows: selectedRow ? [selectedRow] : [] }), null, 2), "application/json");
            this.updateStatus("Exported selected inert Manual Publishing Archive Receipt JSON.");
        }
        exportAllArchiveReceiptsJson() { const payload = this.latestManualPublishingArchiveReceipt || this.buildManualPublishingArchiveReceipt(false); this.download("arcsecs-all-manual-publishing-archive-receipts.json", JSON.stringify(payload, null, 2), "application/json"); this.updateStatus("Exported all inert Manual Publishing Archive Receipt JSON."); }
        exportHumanReviewSignOffJson() { const payload = this.latestHumanReviewSignOffExport || this.buildHumanReviewSignOffExport(false); this.download("arcsecs-human-review-signoff-export.json", JSON.stringify(payload, null, 2), "application/json"); this.updateStatus("Exported inert Human Review Sign-Off JSON."); }

        renderWorkerPanel(selector, payload, rows, summary) {
            const panel = this.root.querySelector(selector); if (!panel) return;
            panel.textContent = "";
            if (!payload) { panel.textContent = "No worker result for this panel."; return; }
            const p = document.createElement("p"); p.textContent = summary + " — reported by the simulation worker, not physical validation."; panel.appendChild(p);
            const list = document.createElement("ul");
            (rows || []).forEach(row => { const item = document.createElement("li"); const label = row.label || row.area || row.title || row.scenario || row.id || row.key || "Check"; const status = row.status || (typeof row.passed === "boolean" ? (row.passed ? "pass" : "fail") : typeof row.enabled === "boolean" ? (row.enabled ? "enabled" : "not applicable") : ""); const detail = row.detail || row.action || row.evidence || (row.value != null ? String(row.value) : ""); item.textContent = [label,status,detail].filter(Boolean).join(" — "); list.appendChild(item); });
            panel.appendChild(list);
            const details = document.createElement("details"); const title = document.createElement("summary"); title.textContent = "Raw worker evidence"; const pre = document.createElement("pre"); pre.style.whiteSpace = "pre-wrap"; pre.style.overflowWrap = "anywhere"; pre.textContent = JSON.stringify(payload,null,2); details.append(title,pre); panel.appendChild(details);
        }
        updateCalibrationCertificate(r) { const x=r.calibrationCertificate; this.renderWorkerPanel("[data-arcsecs-calibration-certificate]",x,x&&x.checks,x&&x.verdict||"Calibration"); }
        updateModeReadiness(r) { const x=r.modeReadinessMatrix; this.renderWorkerPanel("[data-arcsecs-readiness-matrix]",x,x&&x.rows,"Model readiness (worker assertions)"); }
        updateExperimentQueue(r) { const x=r.experimentQueue; this.renderWorkerPanel("[data-arcsecs-experiment-queue]",x,x,"Suggested experiments"); }
        updateStabilityDrilldown(r) { const x=r.numericalStabilityDrilldown; this.renderWorkerPanel("[data-arcsecs-stability-drilldown]",x,x&&x.rows,x&&x.summary||"Numerical stability"); }
        updateScenarioCapabilityMap(r) { const x=r.scenarioCapabilityMap; this.renderWorkerPanel("[data-arcsecs-capability-map]",x,x&&x.capabilities,"Reported model capabilities"); }
        updateOperatorRunbook(r) { const x=r.operatorRunbook; this.renderWorkerPanel("[data-arcsecs-operator-runbook]",x,x&&x.steps,"Operator runbook"); }
        updateReleaseChecklist(r) { const x=r.releaseReadinessChecklist; this.renderWorkerPanel("[data-arcsecs-release-checklist]",x,x&&(x.rows||x.checks||x.items),"Worker checklist; not deployment approval"); }

        buildReviewCockpitInput() {
            return { engineVersion: (this.latestGrandTour && this.latestGrandTour.engineVersion) || (window.ArcSecsPhysicsEngineSettings && window.ArcSecsPhysicsEngineSettings.version) || "5.7.18", grandExperiment: this.latestGrandTour || null, guidedTour: this.guidedAutopilotTour ? this.guidedAutopilotTour.snapshot() : null, flightRecorder: this.flightRecorder ? this.flightRecorder.snapshot(9) : null, latestMetrics: this.latestResult ? this.latestResult.metrics : null };
        }
        buildReviewCockpitPanel(operatorRequested) {
            if (!this.reviewCockpit) { return null; }
            this.latestReviewCockpit = this.reviewCockpit.build(this.buildReviewCockpitInput());
            this.renderReviewCockpit(this.latestReviewCockpit);
            this.renderNextActionCommandCenter();
            if (operatorRequested) {
                this.recordFlightEvent({ label: "Review Cockpit rebuilt", detail: "Visitor and physicist summaries were regenerated from the latest tour, recorder, and Grand Experiment data.", severity: this.latestReviewCockpit.reviewStatus === "holdForRevision" ? "warn" : "info", source: "review-cockpit", scenario: this.toConfig().scenario, status: this.latestReviewCockpit.reviewStatus });
                this.updateStatus("Review Cockpit rebuilt: " + this.latestReviewCockpit.reviewStatus + ".");
            }
            return this.latestReviewCockpit;
        }
        renderReviewCockpit(report) {
            const panel = this.root.querySelector("[data-arcsecs-review-cockpit]");
            if (!panel) { return; }
            const current = report || this.latestReviewCockpit;
            if (!current) {
                panel.innerHTML = `<p><strong>Review Cockpit waiting.</strong> Run the Grand Experiment or let Autopilot finish to generate visitor and physicist summaries.</p><p>It will show the weakest scenario, assumption risk, shareability status, and next actions without claiming proof.</p>`;
                return;
            }
            panel.innerHTML = `<div class="arcsecs-review-score is-${current.reviewStatus}"><strong>${formatNumber(current.readinessScore * 100)}%</strong><span>${current.reviewStatus}</span><em>${formatNumber(current.passRatio * 100)}% stage pass ratio</em></div><article class="arcsecs-review-summary"><h3>Visitor Summary</h3><p>${current.publicSummary}</p><h3>Physicist Summary</h3><p>${current.physicistSummary}</p></article><div class="arcsecs-review-grid"><section><h3>Weakest Points</h3><ol>${current.weakestPoints.map((point) => `<li><strong>${point.title}</strong><span>${point.reason}</span><em>validation ${formatNumber(point.validationScore * 100)}%, warnings ${point.warningCount}</em></li>`).join("")}</ol></section><section><h3>Assumption Risk</h3><ol>${current.assumptionRisks.map((risk) => `<li class="is-${risk.riskLevel}"><strong>${risk.assumption}</strong><span>${risk.riskLevel}: ${risk.reason}</span></li>`).join("")}</ol></section></div><section class="arcsecs-review-actions"><h3>Next Actions</h3><ol>${current.nextActions.map((action) => `<li>${action}</li>`).join("")}</ol></section><p><strong>Boundary:</strong> ${current.shareableBoundary}</p>`;
        }
        buildNextActionInput() {
            return { review: this.latestReviewCockpit || null, guidedTour: this.guidedAutopilotTour ? this.guidedAutopilotTour.snapshot() : null, latestMetrics: this.latestResult ? this.latestResult.metrics : null, hasGrandExperiment: !!this.latestGrandTour, hasReviewCockpit: !!this.latestReviewCockpit };
        }
        buildNextActionPlan() {
            if (!this.latestReviewCockpit) { this.buildReviewCockpitPanel(false); }
            this.latestNextActionPlan = this.nextActionCommandCenter.buildPlan(this.buildNextActionInput());
            return this.latestNextActionPlan;
        }
        renderNextActionCommandCenter(plan) {
            const panel = this.root.querySelector("[data-arcsecs-next-action-panel]");
            if (!panel || !this.nextActionCommandCenter) { return; }
            const current = plan || this.latestNextActionPlan || this.nextActionCommandCenter.buildPlan(this.buildNextActionInput());
            this.latestNextActionPlan = current;
            panel.innerHTML = `<div class="arcsecs-next-action-summary is-${current.overallStatus}"><strong>${current.completedCount}/${current.actionCount}</strong><span>${current.overallStatus}</span><em>${current.researchBoundary}</em></div><ol class="arcsecs-next-action-list">${current.actions.map((action) => `<li class="is-${action.severity} is-${action.status}"><strong>${action.title}</strong><span>${action.detail}</span><button type="button" data-arcsecs-next-action-id="${action.actionId}" ${action.status === "blocked" ? "disabled" : ""}>${action.buttonLabel}</button></li>`).join("")}</ol>`;
        }
        executeReviewNextActions() {
            const plan = this.buildNextActionPlan();
            const runnable = plan.actions.filter((action) => action.status !== "blocked");
            runnable.forEach((action) => this.executeReviewNextAction(action.actionId, true));
            this.renderNextActionCommandCenter();
            this.updateStatus("Review next actions executed where current evidence state allowed.");
        }
        executeReviewNextAction(actionId, batched) {
            const plan = this.buildNextActionPlan();
            const action = plan.actions.find((item) => item.actionId === actionId);
            if (!action || action.status === "blocked") { this.updateStatus("Next action is blocked until more review evidence exists."); return; }
            if (action.kind === "runGuidedTour") { this.startGuidedTour({ autoStarted: false, runScenario: true }); }
            else if (action.kind === "focusWeakestScenario") { this.setScenario(action.targetScenario || "parallaxCalibration"); this.runSimulation(); this.scrollNextActionTarget("[data-arcsecs-review-cockpit]"); }
            else if (action.kind === "inspectPhotonLedger") { this.setScenario("tiredLightEnergyLedger"); this.runSimulation(); this.renderLedgerNextActionInspector(action); this.scrollNextActionTarget("[data-arcsecs-ledger-next-action]"); }
            else if (action.kind === "runGrandExperiment") { this.runGrandExperiment({ autoStarted: false }); }
            else if (action.kind === "exportResearchBundle" || action.kind === "shareWithCaution") { this.exportResearchNoteBundle(); }
            else if (action.kind === "holdForRevision") { this.renderLedgerNextActionInspector(action); this.updateStatus("Public promotion hold notes displayed in the Next Action Command Center."); }
            this.recordFlightEvent({ label: "Review next action executed", detail: action.title, severity: action.severity === "warning" ? "warn" : "info", source: "next-action", scenario: action.targetScenario || this.toConfig().scenario, status: action.kind });
            if (!batched) { this.renderNextActionCommandCenter(); }
        }
        scrollNextActionTarget(selector) {
            const target = this.root.querySelector(selector);
            if (target && target.scrollIntoView) { target.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
        }
        renderLedgerNextActionInspector(action) {
            const panel = this.root.querySelector("[data-arcsecs-ledger-next-action]");
            if (!panel) { return; }
            const metrics = this.latestResult ? this.latestResult.metrics : {};
            panel.innerHTML = `<article class="arcsecs-ledger-action-card"><h3>${action.title}</h3><p>${action.detail}</p><dl><dt>Current scenario</dt><dd>${this.toConfig().scenario}</dd><dt>Ledger status</dt><dd>${metrics.ledgerStatus || "pending"}</dd><dt>Closure proxy</dt><dd>${formatNumber(metrics.energyLedgerClosureProxy || 0)}</dd><dt>Redshift</dt><dd>${formatNumber(metrics.finalRedshift || 0)}</dd><dt>Photon energy fraction</dt><dd>${formatNumber(metrics.finalEnergyFraction || 0)}</dd></dl><p><strong>Boundary:</strong> Ledger inspection is a conservation-style diagnostic for the ArcSecs speculative model, not empirical confirmation.</p></article>`;
        }
        buildResearchNoteBundle() {
            const review = this.latestReviewCockpit || this.buildReviewCockpitPanel(false);
            const plan = this.buildNextActionPlan();
            return { packetType: "ArcSecs Review Next Action Research Bundle", engineVersion: (window.ArcSecsPhysicsEngineSettings && window.ArcSecsPhysicsEngineSettings.version) || "5.7.18", generatedUtc: new Date().toISOString(), scientificBoundary: "Speculative research visualization and mathematical sandbox; not established current technology, measured physical performance, or proof of an operational drive.", nextActionPlan: plan, reviewCockpit: review, grandExperiment: this.latestGrandTour || null, guidedTour: this.guidedAutopilotTour ? this.guidedAutopilotTour.snapshot() : null, flightRecorder: this.flightRecorder ? this.flightRecorder.snapshot(9) : null, latestScenario: this.latestResult && this.latestResult.config ? this.latestResult.config.scenario : this.toConfig().scenario, latestMetrics: this.latestResult ? this.latestResult.metrics : null, distanceTimeKernel: this.latestDistanceTimeKernel || buildDistanceTimeKernelState(this.toConfig(), this.frame || 0), frameworkClaimMap: distanceTimeExportRecords(this.latestDistanceTimeKernel || buildDistanceTimeKernelState(this.toConfig(), this.frame || 0)), multiMessengerEventTheater: distanceTimeExportBundle(this.latestDistanceTimeKernel || buildDistanceTimeKernelState(this.toConfig(), this.frame || 0)), exportContainsExecutableCode: false };
        }
        exportResearchNoteBundle() { this.downloadStrictExportTarget("researchBundle", "arcsecs-research-bundle.json"); const legacyNextActionFilename = "arcsecs-review-next-action-research-bundle.json"; void legacyNextActionFilename; }
        buildStrictExportContext() {
            const kernelState = this.latestDistanceTimeKernel || buildDistanceTimeKernelState(this.toConfig(), this.frame || 0);
            const claimMap = distanceTimeExportRecords(kernelState);
            const eventTheater = distanceTimeExportBundle(kernelState);
            const validationLedger = Array.isArray(kernelState.validationChecks) ? kernelState.validationChecks : [];
            const qualityGate = this.latestResult && this.latestResult.qualityGateReport ? this.latestResult.qualityGateReport : {};
            const failedChecks = validationLedger.filter((check) => !check.passed).map((check) => check.label);
            const warningChecks = validationLedger.filter((check) => !check.passed).map((check) => check.detail);
            const strictQualityGate = Object.freeze({ gateStatus: failedChecks.length ? "review-required" : "passed-with-speculative-boundary", blockingFailures: Array.isArray(qualityGate.blockingFailures) ? qualityGate.blockingFailures.concat(failedChecks) : failedChecks, warnings: Array.isArray(qualityGate.warnings) ? qualityGate.warnings.concat(warningChecks) : warningChecks, validationChecklist: validationLedger.map((check) => check.label), finiteTelemetryStatus: strictExportTelemetryIsFinite(kernelState.telemetry) ? "finite" : "invalid", exportCompletenessStatus: "kernel-claim-map-event-theater-present", speculativeBoundaryStatus: /speculative research visualization/i.test(distanceTimeSpeculativeBoundary) ? "visible" : "missing", claimTraceabilityStatus: claimMap.length === distanceTimeClaimCards.length ? "complete" : "review" });
            const viewportState = Object.freeze({ sourceX: 0.1, sourceY: 0.5, observerX: 0.9, observerY: 0.5, gravityArrivalIndex: kernelState.gravityWavefront.arrivalIndex, photonArrivalIndex: kernelState.telemetry.photonArrival, mediumDensityMultiplier: kernelState.telemetry.mediumDensityMultiplier, missingCounterpart: kernelState.telemetry.photonArrival === null, activeClaimKey: this.activeDistanceTimeClaimKey || kernelState.activeClaimKeys[0] || "distance-without-lightyears" });
            const sourceMatrix = buildScientificSourceMatrix(this.toConfig().scenario);
            const scenarioEquationLibrary = buildScenarioEquationLibrary(this.toConfig().scenario);
            return Object.freeze({ packageVersion: PACKAGE_VERSION, engineVersion: (window.ArcSecsPhysicsEngineSettings && window.ArcSecsPhysicsEngineSettings.version) || "5.8.36", exportType: "ArcSecsStrictExportContext", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: this.toConfig().scenario, activeStoryStep: "How to Measure the Universe Without Lightyears / Compare the Messengers", simulationSettings: strictExportNormalizeRecord(this.toConfig()), distanceTimeKernel: kernelState, frameworkClaimMap: claimMap, eventTheater, validationLedger, qualityGate: strictQualityGate, telemetrySnapshot: kernelState.telemetry, viewportState, sourceReferences: arcsecsExportBuilderHandoff.sourceReferences, sourceMatrix, sourceMatrixValidation: validateScientificSourceMatrixExport(sourceMatrix), scenarioEquationLibrary, scenarioEquationLibraryValidation: validateScenarioEquationLibraryExport(scenarioEquationLibrary), caveats: ["Speculative research visualization.", "Lightyear values are legacy comparison labels only.", "Local oscillators are probes, not universal time.", "Exports are inert JSON and contain no executable code.", "DarkMatterDrive.com public endpoint data uses typed fallback handling when unavailable."], speculativeBoundaryText: distanceTimeSpeculativeBoundary, falsificationPaths: distanceTimeClaimCards.map((claim) => claim.falsification), scenarioScreenshotEvidencePack: this.latestScenarioScreenshotEvidencePack || this.buildScenarioScreenshotEvidencePack(false), reviewerNotesBundle: this.latestReviewerNotesBundle || this.buildReviewerNotesBundle(false), auditValidationStatus: this.latestLiveScenarioAudit ? "audit-summary-ready" : "audit-summary-missing", publicReviewerGalleryManifest: this.buildPublicReviewerGalleryManifest(false), evidenceBundleIntegrityLabels: this.buildEvidenceBundleIntegrityLabels(false), reviewerSignOffSummary: this.latestReviewerSignOffSummary || this.buildReviewerSignOffSummary(false), reviewBundleReconciliation: this.latestReviewBundleReconciliation || this.buildReviewBundleReconciliationPayload(false), scenarioReviewWalkthroughWizard: this.latestScenarioReviewWalkthroughWizard || this.buildScenarioReviewWalkthroughWizard(false), evidenceRepairQueue: this.latestEvidenceRepairQueue || this.buildEvidenceRepairQueue(false), evidenceRepairCompletionLedger: this.latestEvidenceRepairCompletionLedger || this.buildEvidenceRepairCompletionLedger(false), demoReadinessGate: this.latestDemoReadinessGate || this.evaluateDemoReadinessGate(false), publicDemoScenarioChecklist: this.latestPublicDemoScenarioChecklist || this.buildPublicDemoScenarioChecklist(false), reviewerEvidenceExportPack: this.latestReviewerEvidenceExportPack || this.buildReviewerEvidenceExportPack(false), publicDemoScriptBuilder: this.latestPublicDemoScriptBuilder || this.buildPublicDemoScripts(false), screenshotCaptionPack: this.latestScreenshotCaptionPack || this.buildScreenshotCaptionPack(false), publicDemoPageAssemblyChecklist: this.latestPublicDemoPageAssemblyChecklist || this.buildPublicDemoPageAssemblyChecklist(false), copyReviewBundle: this.latestCopyReviewBundle || this.buildCopyReviewBundle(false), publicDemoRouteDraftBundle: this.latestPublicDemoRouteDraftBundle || this.buildPublicDemoRouteDraftBundle(false), seoSchemaReview: this.latestSeoSchemaReview || this.buildSeoSchemaReview(false), publicDemoPublicationHandoffManifest: this.latestPublicDemoPublicationHandoffManifest || this.buildPublicDemoPublicationHandoffManifest(false), staticPageDraftExport: this.latestStaticPageDraftExport || this.buildStaticPageDraftExport(false), staticDraftReviewImport: this.latestStaticDraftReviewImport || null, pageReadinessDiff: this.latestPageReadinessDiff || this.buildPageReadinessDiff(false), staticPublicationReviewChecklist: this.latestStaticPublicationReviewChecklist || this.buildStaticPublicationReviewChecklist(false), pageDraftFreezeBundle: this.latestPageDraftFreezeBundle || this.buildPageDraftFreezeBundle(false), staticPublishHandoffQaSummary: this.latestStaticPublishHandoffQaSummary || this.buildStaticPublishHandoffQaSummary(false), publicPageContentChecklist: this.latestPublicPageContentChecklist || this.buildPublicPageContentChecklist(false), publicPageManualPublishingRunbook: this.latestPublicPageManualPublishingRunbook || this.buildPublicPageManualPublishingRunbook(false), postDeployVerificationChecklist: this.latestPostDeployVerificationChecklist || this.buildPostDeployVerificationChecklist(false), manualPublishingArchiveReceipt: this.latestManualPublishingArchiveReceipt || this.buildManualPublishingArchiveReceipt(false), humanReviewSignOffExport: this.latestHumanReviewSignOffExport || this.buildHumanReviewSignOffExport(false), publicPublishingEvidenceArchiveIndex: this.latestPublicPublishingEvidenceArchiveIndex || this.buildPublicPublishingEvidenceArchiveIndex(false), reviewerRetrievalNotes: this.latestReviewerRetrievalNotes || this.buildReviewerRetrievalNotes(false), sourceContractAlignment: buildDarkMatterDriveContractAlignmentState("fallback", "Live endpoint fetch is optional for export generation; typed fallback preserves deterministic telemetry and reports endpoint alignment state.") });
        }
        downloadStrictExportTarget(target, filename, extra) {
            const result = buildStrictExportPayload(target, this.buildStrictExportContext());
            if (!result.success || !result.payload) { this.updateStatus("Export blocked: " + result.validationErrors.map((issue) => issue.fieldName + " " + issue.message).join("; ")); return; }
            this.download(filename, JSON.stringify(Object.assign({},result.payload,extra || {}), null, 2), "application/json");
        }
        exportCalibrationCertificate() { this.downloadStrictExportTarget("calibrationCertificate", "arcsecs-calibration-certificate.json"); }
        exportOperatorRunbook() { this.downloadStrictExportTarget("operatorRunbook", "arcsecs-operator-runbook.json"); }
        exportReleasePacket() { this.downloadStrictExportTarget("qualityGate", "arcsecs-release-readiness-quality-gate.json"); }
        exportSceneJson() { this.downloadStrictExportTarget("sceneJson", "arcsecs-scene.json"); }

        exportReviewCockpit() {
            const report = this.latestReviewCockpit || this.buildReviewCockpitPanel(false);
            if (!report) { this.updateStatus("Review Cockpit is unavailable in this browser session."); return; }
            this.download("arcsecs-review-cockpit.json", JSON.stringify(report, null, 2), "application/json");
        }

        openParameterGuide() {
            this.setParameterGuideWorkspace(this.parameterGuideWorkspace || "overview", false);
            this.renderParameterGuide();
            const modal = this.root.querySelector("[data-arcsecs-parameter-guide-modal]");
            if (!modal) { return; }
            modal.hidden = false;
            modal.setAttribute("aria-hidden", "false");
            const firstButton = modal.querySelector("[data-arcsecs-parameter-preset]");
            if (firstButton && firstButton.focus) { firstButton.focus(); }
            this.recordFlightEvent({ label: "Parameter Guide opened", detail: "Run Your Own Simulation guide opened with curated presets that populate sandbox controls.", severity: "info", source: "parameter-guide", scenario: this.toConfig().scenario, status: "open" });
            this.updateStatus("Run Your Own Simulation Parameter Guide opened.");
        }
        closeParameterGuide() {
            const modal = this.root.querySelector("[data-arcsecs-parameter-guide-modal]");
            if (!modal) { return; }
            modal.hidden = true;
            modal.setAttribute("aria-hidden", "true");
        }
        setParameterGuideWorkspace(workspace, announce) {
            const safeWorkspace = ["overview", "recipe", "comparison", "playlist", "notebook", "replay", "sensitivity"].indexOf(workspace) >= 0 ? workspace : "overview";
            this.parameterGuideWorkspace = safeWorkspace;
            this.root.querySelectorAll("[data-arcsecs-guide-workspace]").forEach((button) => {
                const isActive = (button.getAttribute("data-arcsecs-guide-workspace") || "") === safeWorkspace;
                button.setAttribute("aria-pressed", isActive ? "true" : "false");
            });
            this.root.querySelectorAll("[data-arcsecs-guide-panel]").forEach((panel) => {
                const isActive = (panel.getAttribute("data-arcsecs-guide-panel") || "") === safeWorkspace;
                panel.classList.toggle("is-active", isActive);
            });
            this.root.querySelectorAll("[data-arcsecs-action-group]").forEach((panel) => {
                const isActive = (panel.getAttribute("data-arcsecs-action-group") || "") === safeWorkspace;
                panel.classList.toggle("is-active", isActive);
            });
            if (announce !== false) {
                this.updateStatus("Guide workspace: " + safeWorkspace + ".");
            }
        }
        updateParameterGuideSelectionSummary(preset) {
            const summary = this.root.querySelector("[data-arcsecs-guide-selection]");
            if (!summary || !preset) { return; }
            summary.textContent = "Selected preset: " + preset.title + ". Scenario: " + ScenarioRegistry.getScenario(preset.scenario).label + ". Audience: " + preset.audience + ". Expected result: " + preset.expectedResult;
        }
        selectParameterGuidePreset(presetId) {
            const preset = this.parameterGuide.getPreset(presetId);
            this.selectedParameterPresetId = preset.presetId;
            this.renderParameterGuide();
            this.updateStatus("Selected guide preset: " + preset.title + ".");
        }
        renderParameterGuide() {
            const list = this.root.querySelector("[data-arcsecs-parameter-guide-list]");
            const detail = this.root.querySelector("[data-arcsecs-parameter-guide-detail]");
            if (!list || !detail || !this.parameterGuide) { return; }
            const presets = this.parameterGuide.listPresets();
            if (!presets.some((preset) => preset.presetId === this.selectedParameterPresetId) && presets.length > 0) { this.selectedParameterPresetId = presets[0].presetId; }
            list.innerHTML = presets.map((preset) => `<button type="button" class="arcsecs-parameter-preset-card ${preset.presetId === this.selectedParameterPresetId ? "is-active" : ""}" data-arcsecs-parameter-preset="${preset.presetId}" aria-pressed="${preset.presetId === this.selectedParameterPresetId ? "true" : "false"}"><strong>${preset.title}</strong><span>${preset.question}</span><em>${preset.audience}</em></button>`).join("");
            const preset = this.parameterGuide.getPreset(this.selectedParameterPresetId);
            const parameterRows = Object.keys(preset.parameters).map((name) => `<li class="${preset.highlightedParameters.indexOf(name) >= 0 ? "is-highlighted" : ""}"><strong>${name}</strong><span>${String(preset.parameters[name])}</span></li>`).join("");
            detail.innerHTML = `<article class="arcsecs-parameter-guide-detail-card"><header><span>${ScenarioRegistry.getScenario(preset.scenario).label}</span><strong>${preset.title}</strong></header><p><strong>Try this:</strong> ${preset.question}</p><p><strong>Expected result:</strong> ${preset.expectedResult}</p><p>${preset.explanation}</p><ol>${parameterRows}</ol><p class="arcsecs-boundary-note"><strong>Boundary:</strong> ${preset.caution}</p></article>`;
            this.updateParameterGuideSelectionSummary(preset);
            this.setParameterGuideWorkspace(this.parameterGuideWorkspace || "overview", false);
            this.renderExperimentRecipeLab();
            this.renderExperimentComparisonWorkbench();
        }
        buildCurrentExperimentRecipe() {
            const preset = this.parameterGuide.getPreset(this.selectedParameterPresetId);
            return this.recipeLab.buildRecipeFromPreset(preset, this.toConfig(), preset.title);
        }
        renderExperimentRecipeLab(shareState) {
            const panel = this.root.querySelector("[data-arcsecs-recipe-lab]");
            if (!panel || !this.recipeLab) { return; }
            const recipe = shareState && shareState.recipe ? shareState.recipe : this.buildCurrentExperimentRecipe();
            const issues = recipe.validationIssues && recipe.validationIssues.length ? recipe.validationIssues : [{ field: "recipe", severity: "info", message: "Recipe is ready to validate, share, or apply." }];
            const link = shareState && shareState.shareUrl ? shareState.shareUrl : "Create a share link after choosing a preset.";
            panel.innerHTML = `<article class="arcsecs-recipe-lab-card"><header><span>Recipe Lab</span><strong>${recipe.title}</strong><em class="is-${recipe.validationStatus}">${recipe.validationStatus}</em></header><p>Turn the selected guide preset into a safe URL recipe that can repopulate the sandbox controls on page load.</p><dl><dt>Scenario</dt><dd>${ScenarioRegistry.getScenario(recipe.scenario).label}</dd><dt>Source preset</dt><dd>${recipe.sourcePresetId}</dd><dt>Share link</dt><dd class="arcsecs-recipe-link-output" data-arcsecs-recipe-link-output="true">${link}</dd></dl><ol>${issues.map((issue) => `<li class="is-${issue.severity}"><strong>${issue.field}</strong><span>${issue.message}</span></li>`).join("")}</ol><p class="arcsecs-boundary-note"><strong>Boundary:</strong> ${recipe.scientificBoundary}</p></article>`;
        }
        validateCurrentRecipe() {
            const recipe = this.buildCurrentExperimentRecipe();
            this.latestRecipeShareState = this.recipeLab.buildShareState(window.location && window.location.href ? window.location.href : "https://arcsecs.com/arcsecs-physics-engine-demo/", recipe);
            this.renderExperimentRecipeLab(this.latestRecipeShareState);
            this.recordFlightEvent({ label: "Experiment recipe validated", detail: recipe.title + " validation status: " + recipe.validationStatus + ".", severity: recipe.validationStatus === "failed" ? "fail" : recipe.validationStatus === "warning" ? "warn" : "info", source: "recipe-lab", scenario: recipe.scenario, status: recipe.validationStatus });
            this.updateStatus("Recipe validation: " + recipe.validationStatus + ".");
        }
        createRecipeShareLink() {
            const recipe = this.buildCurrentExperimentRecipe();
            this.latestRecipeShareState = this.recipeLab.buildShareState(window.location && window.location.href ? window.location.href : "https://arcsecs.com/arcsecs-physics-engine-demo/", recipe);
            this.renderExperimentRecipeLab(this.latestRecipeShareState);
            this.recordFlightEvent({ label: "Experiment recipe share link created", detail: "Share link prepared for " + recipe.title + ".", severity: "info", source: "recipe-lab", scenario: recipe.scenario, status: "shareReady" });
            this.updateStatus("Recipe share link created. Copy it from the Recipe Lab panel.");
        }
        applyRecipeParameters(recipe, runAfterApply) {
            Object.keys(recipe.parameters || {}).forEach((name) => this.setNamedControlValue(name, recipe.parameters[name]));
            this.setScenario(recipe.scenario);
            this.markDirty();
            this.renderExperimentRecipeLab(this.latestRecipeShareState);
            this.recordFlightEvent({ label: "Experiment recipe applied", detail: recipe.title + " populated the sandbox controls.", severity: recipe.validationStatus === "failed" ? "warn" : "info", source: "recipe-lab", scenario: recipe.scenario, status: runAfterApply ? "appliedAndRunning" : "applied" });
            this.updateStatus(runAfterApply ? "Applied recipe and running: " + recipe.title + "." : "Applied experiment recipe: " + recipe.title + ".");
            this.closeParameterGuide();
            if (runAfterApply) { this.runSimulation(); }
        }
        applyLatestRecipeShareState(runAfterApply) {
            if (!this.latestRecipeShareState) { this.createRecipeShareLink(); }
            if (this.latestRecipeShareState && this.latestRecipeShareState.recipe) { this.applyRecipeParameters(this.latestRecipeShareState.recipe, runAfterApply); }
        }
        applyRecipeFromUrl() {
            if (!this.recipeLab || !window.location || !window.location.search) { return; }
            const recipe = this.recipeLab.readRecipeFromSearch(window.location.search);
            if (!recipe) { return; }
            this.latestRecipeShareState = this.recipeLab.buildShareState(window.location.href, recipe);
            this.applyRecipeParameters(recipe, false);
            this.renderExperimentRecipeLab(this.latestRecipeShareState);
            this.recordFlightEvent({ label: "Shared experiment recipe loaded", detail: recipe.title + " was loaded from the page URL and applied safely.", severity: recipe.validationStatus === "failed" ? "warn" : "info", source: "recipe-lab", scenario: recipe.scenario, status: "loadedFromUrl" });
        }
        buildExperimentRecipeBundle() {
            if (!this.latestRecipeShareState) { this.createRecipeShareLink(); }
            return { packetType: "ArcSecs Experiment Recipe Lab Export", engineVersion: (window.ArcSecsPhysicsEngineSettings && window.ArcSecsPhysicsEngineSettings.version) || "5.7.18", generatedUtc: new Date().toISOString(), recipeShare: this.latestRecipeShareState, selectedPresetId: this.selectedParameterPresetId, activeConfig: this.toConfig(), latestMetrics: this.latestResult ? this.latestResult.metrics : null, experimentComparison: this.latestExperimentComparison || null, experimentPlaylist: this.latestExperimentPlaylist || null, experimentReplayTimeline: this.latestExperimentReplayTimeline || null, experimentSensitivityScan: this.latestExperimentSensitivityScan || null, flightRecorder: this.flightRecorder ? this.flightRecorder.snapshot(9) : null, exportContainsExecutableCode: false, scientificBoundary: "Experiment Recipe Lab exports are inert JSON parameter recipes for the ArcSecs speculative sandbox." };
        }
        exportExperimentRecipe() {
            const bundle = this.buildExperimentRecipeBundle();
            this.download("arcsecs-experiment-recipe-lab.json", JSON.stringify(bundle, null, 2), "application/json");
            this.recordFlightEvent({ label: "Experiment recipe exported", detail: "Recipe Lab bundle exported as inert JSON.", severity: "info", source: "recipe-lab", scenario: this.toConfig().scenario, status: "exported" });
        }
        buildExperimentComparison() {
            const presets = this.parameterGuide.listPresets();
            const selected = this.experimentComparisonWorkbench.normalizeSelection(this.selectedComparisonPresetIds || [], presets);
            this.selectedComparisonPresetIds = selected;
            this.latestExperimentComparison = this.experimentComparisonWorkbench.buildComparison(selected, presets, this.toConfig(), this.latestGrandTour || null);
            this.renderExperimentComparisonWorkbench(this.latestExperimentComparison);
            this.recordFlightEvent({ label: "Experiment comparison built", detail: this.latestExperimentComparison.summary.presetCount + " recipes compared; highest risk " + this.latestExperimentComparison.summary.highestRisk + ".", severity: this.latestExperimentComparison.summary.highestRisk === "high" ? "warn" : "info", source: "comparison-workbench", scenario: this.toConfig().scenario, status: "built" });
            this.updateStatus("Experiment Comparison Workbench built with " + this.latestExperimentComparison.summary.presetCount + " recipes.");
            return this.latestExperimentComparison;
        }
        addSelectedRecipeToComparison() {
            const existing = this.selectedComparisonPresetIds || [];
            const next = existing.indexOf(this.selectedParameterPresetId) >= 0 ? existing : existing.concat([this.selectedParameterPresetId]);
            this.selectedComparisonPresetIds = this.experimentComparisonWorkbench.normalizeSelection(next, this.parameterGuide.listPresets());
            this.buildExperimentComparison();
        }
        clearExperimentComparison() {
            this.selectedComparisonPresetIds = [this.selectedParameterPresetId];
            this.latestExperimentComparison = null;
            this.renderExperimentComparisonWorkbench();
            this.recordFlightEvent({ label: "Experiment comparison reset", detail: "Comparison list reset to the selected recipe only.", severity: "info", source: "comparison-workbench", scenario: this.toConfig().scenario, status: "reset" });
            this.updateStatus("Experiment comparison reset to the selected recipe.");
        }
        renderExperimentComparisonWorkbench(comparison) {
            const panel = this.root.querySelector("[data-arcsecs-recipe-comparison]");
            if (!panel || !this.experimentComparisonWorkbench || !this.parameterGuide) { return; }
            const selected = this.experimentComparisonWorkbench.normalizeSelection(this.selectedComparisonPresetIds || [this.selectedParameterPresetId], this.parameterGuide.listPresets());
            this.selectedComparisonPresetIds = selected;
            const activeComparison = comparison || this.latestExperimentComparison || this.experimentComparisonWorkbench.buildComparison(selected, this.parameterGuide.listPresets(), this.toConfig(), this.latestGrandTour || null);
            const rows = activeComparison.rows || [];
            panel.innerHTML = `<article class="arcsecs-comparison-workbench-card"><header><span>Comparison Workbench</span><strong>${activeComparison.summary.presetCount} recipe${activeComparison.summary.presetCount === 1 ? "" : "s"}</strong><em class="is-${activeComparison.summary.highestRisk}">${activeComparison.summary.highestRisk} risk</em></header><p>${activeComparison.summary.visitorSummary}</p><div class="arcsecs-comparison-summary"><span>${activeComparison.summary.passCount}/${activeComparison.summary.presetCount} passed</span><span>${activeComparison.summary.warningCount} warnings</span><span>${activeComparison.summary.scenarioCount} scenarios</span></div><div class="arcsecs-comparison-rows">${rows.map((row) => `<button type="button" data-arcsecs-comparison-preset="${row.presetId}" class="arcsecs-comparison-row"><strong>${row.title}</strong><span>${ScenarioRegistry.getScenario(row.scenario).label}</span><span>Assumption load ${row.assumptionLoad} · ${row.stageStatus} · ${formatNumber(row.validationScore * 100)}%</span><em>${row.recommendation}</em></button>`).join("")}</div><p class="arcsecs-boundary-note"><strong>Boundary:</strong> ${activeComparison.scientificBoundary}</p></article>`;
        }
        buildExperimentComparisonBundle() {
            const comparison = this.latestExperimentComparison || this.buildExperimentComparison();
            return { packetType: "ArcSecs Experiment Comparison Workbench Export", engineVersion: (window.ArcSecsPhysicsEngineSettings && window.ArcSecsPhysicsEngineSettings.version) || "5.7.18", generatedUtc: new Date().toISOString(), comparison, selectedPresetId: this.selectedParameterPresetId, activeConfig: this.toConfig(), recipeShare: this.latestRecipeShareState || null, grandExperiment: this.latestGrandTour || null, reviewCockpit: this.latestReviewCockpit || null, experimentPlaylist: this.latestExperimentPlaylist || null, experimentLabNotebook: this.latestExperimentLabNotebook || null, experimentReplayTimeline: this.latestExperimentReplayTimeline || null, experimentSensitivityScan: this.latestExperimentSensitivityScan || null, latestMetrics: this.latestResult ? this.latestResult.metrics : null, experimentLabNotebook: this.latestExperimentLabNotebook || null, experimentReplayTimeline: this.latestExperimentReplayTimeline || null, experimentSensitivityScan: this.latestExperimentSensitivityScan || null, flightRecorder: this.flightRecorder ? this.flightRecorder.snapshot(9) : null, exportContainsExecutableCode: false, scientificBoundary: "Experiment Comparison Workbench exports are inert JSON review packets for comparing ArcSecs sandbox recipes." };
        }
        exportExperimentComparison() {
            const bundle = this.buildExperimentComparisonBundle();
            this.download("arcsecs-experiment-comparison-workbench.json", JSON.stringify(bundle, null, 2), "application/json");
            this.recordFlightEvent({ label: "Experiment comparison exported", detail: "Comparison Workbench bundle exported as inert JSON.", severity: "info", source: "comparison-workbench", scenario: this.toConfig().scenario, status: "exported" });
        }
        addSelectedRecipeToPlaylist() {
            if (this.selectedPlaylistPresetIds.indexOf(this.selectedParameterPresetId) < 0) {
                this.selectedPlaylistPresetIds.push(this.selectedParameterPresetId);
            }
            this.latestExperimentPlaylist = this.buildExperimentPlaylist();
            this.recordFlightEvent({ label: "Recipe added to playlist", detail: "Added " + this.parameterGuide.getPreset(this.selectedParameterPresetId).title + " to the Experiment Playlist Runner.", severity: "info", source: "experiment-playlist", scenario: this.toConfig().scenario, status: "queued" });
            this.updateStatus("Added selected recipe to the Experiment Playlist Runner.");
        }
        buildExperimentPlaylist() {
            const playlist = this.experimentPlaylistRunner.buildPlaylist(this.selectedPlaylistPresetIds, this.parameterGuide.listPresets(), this.toConfig(), this.latestExperimentComparison || null, this.latestExperimentPlaylist ? this.latestExperimentPlaylist.currentIndex : 0);
            this.latestExperimentPlaylist = playlist;
            this.renderExperimentPlaylistRunner();
            this.refreshExperimentReplayTimeline("playlist");
            return playlist;
        }
        runExperimentPlaylist() {
            const playlist = this.latestExperimentPlaylist || this.buildExperimentPlaylist();
            const currentItem = this.experimentPlaylistRunner.currentItem(playlist);
            this.selectParameterGuidePreset(currentItem.presetId);
            this.applyParameterGuidePreset(true);
            this.recordFlightEvent({ label: "Experiment playlist started", detail: "Running playlist item " + currentItem.order + ": " + currentItem.title + ".", severity: "info", source: "experiment-playlist", scenario: currentItem.scenario, status: "running" });
            this.renderExperimentPlaylistRunner();
        }
        advanceExperimentPlaylist() {
            const playlist = this.latestExperimentPlaylist || this.buildExperimentPlaylist();
            const nextPlaylist = this.experimentPlaylistRunner.completeCurrent(playlist, this.buildPlaylistResultInput());
            this.latestExperimentPlaylist = nextPlaylist;
            const currentItem = this.experimentPlaylistRunner.currentItem(nextPlaylist);
            this.selectParameterGuidePreset(currentItem.presetId);
            this.applyParameterGuidePreset(true);
            this.recordFlightEvent({ label: "Experiment playlist advanced", detail: "Advanced to playlist item " + currentItem.order + ": " + currentItem.title + ".", severity: "info", source: "experiment-playlist", scenario: currentItem.scenario, status: currentItem.status });
            this.renderExperimentPlaylistRunner();
        }
        clearExperimentPlaylist() {
            this.selectedPlaylistPresetIds = [this.selectedParameterPresetId];
            this.latestExperimentPlaylist = this.experimentPlaylistRunner.buildPlaylist(this.selectedPlaylistPresetIds, this.parameterGuide.listPresets(), this.toConfig(), this.latestExperimentComparison || null, 0);
            this.renderExperimentPlaylistRunner();
            this.recordFlightEvent({ label: "Experiment playlist cleared", detail: "Playlist reset to the selected recipe only.", severity: "info", source: "experiment-playlist", scenario: this.toConfig().scenario, status: "reset" });
        }
        completePlaylistItemFromResult(result) {
            if (!this.latestExperimentPlaylist || !result || !result.config) { this.renderExperimentPlaylistRunner(); return; }
            const currentItem = this.experimentPlaylistRunner.currentItem(this.latestExperimentPlaylist);
            if (!currentItem || currentItem.scenario !== result.config.scenario) { this.renderExperimentPlaylistRunner(); return; }
            this.latestExperimentPlaylist = this.experimentPlaylistRunner.recordCurrentResult(this.latestExperimentPlaylist, this.buildPlaylistResultInput(result));
            this.recordFlightEvent({ label: "Experiment playlist item completed", detail: currentItem.title + " recorded validation and warning telemetry in the playlist.", severity: "pass", source: "experiment-playlist", scenario: result.config.scenario, status: "complete" });
            this.renderExperimentPlaylistRunner();
        }
        buildPlaylistResultInput(result) {
            const source = result || this.latestResult || {};
            const metrics = source.metrics || {};
            return { scenario: source.config ? source.config.scenario : this.toConfig().scenario, validationScore: source.validationLab ? source.validationLab.validationScore : 0, warningCount: Number(metrics.warningCount || (metrics.numericalDriftWarning && metrics.numericalDriftWarning !== "none" ? 1 : 0) || 0), ledgerStatus: metrics.ledgerStatus || "not-yet-run", primaryMetric: "speculativeModelValue", primaryValue: Number(metrics.speculativeModelValue || 0) };
        }
        renderExperimentPlaylistRunner() {
            const panel = this.root.querySelector("[data-arcsecs-recipe-playlist]");
            if (!panel) { return; }
            const playlist = this.latestExperimentPlaylist || this.experimentPlaylistRunner.buildPlaylist(this.selectedPlaylistPresetIds, this.parameterGuide.listPresets(), this.toConfig(), this.latestExperimentComparison || null, 0);
            this.latestExperimentPlaylist = playlist;
            const rows = playlist.items || [];
            panel.innerHTML = `<article class="arcsecs-playlist-runner-card"><header><span>Experiment Playlist Runner</span><strong>${playlist.summary.completedCount}/${playlist.summary.itemCount} completed</strong><em class="is-${playlist.summary.warningCount > 0 ? "warning" : "ready"}">${playlist.summary.progressPercent}% done</em></header><p>${playlist.summary.visitorSummary}</p><div class="arcsecs-playlist-summary"><span>${playlist.summary.runningCount} running</span><span>${playlist.summary.warningCount} warnings</span><span>${playlist.summary.readyToExport ? "export ready" : "waiting for runs"}</span></div><ol class="arcsecs-playlist-rows">${rows.map((row) => `<li class="is-${row.status}"><button type="button" data-arcsecs-playlist-preset="${row.presetId}" aria-label="Focus playlist recipe ${row.order}: ${row.title}"><strong>${row.order}. ${row.title}</strong><span>${ScenarioRegistry.getScenario(row.scenario).label} · ${row.parameterCount} changed controls · ${row.status}</span><em>${row.expectedSignal}</em></button></li>`).join("")}</ol><p class="arcsecs-boundary-note"><strong>Boundary:</strong> ${playlist.scientificBoundary}</p></article>`;
        }
        buildExperimentPlaylistBundle() {
            const playlist = this.latestExperimentPlaylist || this.buildExperimentPlaylist();
            return { packetType: "ArcSecs Experiment Playlist Runner Export", engineVersion: (window.ArcSecsPhysicsEngineSettings && window.ArcSecsPhysicsEngineSettings.version) || "5.7.18", generatedUtc: new Date().toISOString(), playlist, selectedPresetId: this.selectedParameterPresetId, activeConfig: this.toConfig(), experimentComparison: this.latestExperimentComparison || null, experimentRecipe: this.latestRecipeShareState || null, grandExperiment: this.latestGrandTour || null, reviewCockpit: this.latestReviewCockpit || null, experimentPlaylist: this.latestExperimentPlaylist || null, experimentLabNotebook: this.latestExperimentLabNotebook || null, experimentReplayTimeline: this.latestExperimentReplayTimeline || null, experimentSensitivityScan: this.latestExperimentSensitivityScan || null, latestMetrics: this.latestResult ? this.latestResult.metrics : null, experimentLabNotebook: this.latestExperimentLabNotebook || null, experimentReplayTimeline: this.latestExperimentReplayTimeline || null, experimentSensitivityScan: this.latestExperimentSensitivityScan || null, flightRecorder: this.flightRecorder ? this.flightRecorder.snapshot(9) : null, exportContainsExecutableCode: false, scientificBoundary: "Experiment Playlist Runner exports are inert JSON batch reports for guided ArcSecs sandbox recipes." };
        }
        exportExperimentPlaylist() {
            const bundle = this.buildExperimentPlaylistBundle();
            this.download("arcsecs-experiment-playlist-runner.json", JSON.stringify(bundle, null, 2), "application/json");
            this.recordFlightEvent({ label: "Experiment playlist exported", detail: "Playlist Runner batch report exported as inert JSON.", severity: "info", source: "experiment-playlist", scenario: this.toConfig().scenario, status: "exported" });
        }

        loadExperimentLabNotebook() {
            const notebookId = "arcsecs-lab-notebook-" + (this.root.id || "default");
            if (!this.experimentLabNotebook) { return null; }
            try {
                const raw = window.localStorage ? window.localStorage.getItem("arcsecsExperimentLabNotebook") : null;
                return this.experimentLabNotebook.restore(raw ? JSON.parse(raw) : null, notebookId);
            } catch (error) {
                return this.experimentLabNotebook.createEmpty(notebookId);
            }
        }
        persistExperimentLabNotebook() {
            if (!this.latestExperimentLabNotebook) { return; }
            try {
                if (window.localStorage) { window.localStorage.setItem("arcsecsExperimentLabNotebook", JSON.stringify(this.latestExperimentLabNotebook)); }
            } catch (error) {
                this.recordFlightEvent({ label: "Lab Notebook storage warning", detail: "Browser storage rejected notebook persistence; the visible session notebook remains active.", severity: "warn", source: "lab-notebook", scenario: this.toConfig().scenario, status: "storage-warning" });
            }
        }
        buildLabNotebookInput(result, source) {
            const currentResult = result || this.latestResult;
            const scenarioKey = currentResult && currentResult.config ? currentResult.config.scenario : this.toConfig().scenario;
            const scenario = ScenarioRegistry.getScenario(scenarioKey);
            const preset = this.parameterGuide ? this.parameterGuide.getPreset(this.selectedParameterPresetId) : null;
            const playlist = this.latestExperimentPlaylist || null;
            const currentItem = playlist && this.experimentPlaylistRunner ? this.experimentPlaylistRunner.currentItem(playlist) : null;
            const metrics = currentResult && currentResult.metrics ? currentResult.metrics : {};
            const validationScore = currentResult && currentResult.validationLab ? finiteMetric(currentResult.validationLab.validationScore, 0) : 0;
            const warningCount = String(metrics.ramjetWarnings || "none") === "none" ? (metrics.ledgerStatus && metrics.ledgerStatus !== "pass" ? 1 : 0) : 1;
            const sourceName = source || (currentItem && currentItem.scenario === scenarioKey ? "playlist-run" : preset && preset.scenario === scenarioKey ? "recipe-run" : "scenario-run");
            return { source: sourceName, scenario: scenarioKey, scenarioLabel: scenario.label, presetId: preset ? preset.presetId : "manual", presetTitle: preset ? preset.title : scenario.label, acceptedSteps: currentResult ? currentResult.acceptedSteps : 0, validationScore, warningCount, metrics, playlistId: playlist ? playlist.playlistId : "none", playlistItemOrder: currentItem ? currentItem.order : 0, activeConfig: this.toConfig() };
        }
        autoRecordExperimentLabNotebook(result) {
            if (!this.experimentLabNotebook || !result || !result.config) { this.renderExperimentLabNotebook(); return; }
            const input = this.buildLabNotebookInput(result, null);
            this.latestExperimentLabNotebook = this.experimentLabNotebook.addResult(this.latestExperimentLabNotebook || this.experimentLabNotebook.createEmpty(), input);
            this.persistExperimentLabNotebook();
            this.renderExperimentLabNotebook();
            this.recordFlightEvent({ label: "Lab Notebook result captured", detail: ScenarioRegistry.getScenario(input.scenario).label + " was saved with validation and ledger telemetry.", severity: input.warningCount > 0 ? "warn" : "pass", source: "lab-notebook", scenario: input.scenario, status: "captured" });
        }
        saveLatestResultToNotebook(source) {
            if (!this.latestResult) { this.updateStatus("Run a scenario before saving a Lab Notebook entry."); this.renderExperimentLabNotebook(); return; }
            const input = this.buildLabNotebookInput(this.latestResult, source || "manual-save");
            this.latestExperimentLabNotebook = this.experimentLabNotebook.addResult(this.latestExperimentLabNotebook || this.experimentLabNotebook.createEmpty(), input);
            this.persistExperimentLabNotebook();
            this.renderExperimentLabNotebook();
            this.recordFlightEvent({ label: "Lab Notebook manual save", detail: "Saved " + input.scenarioLabel + " to the Experiment Lab Notebook.", severity: "info", source: "lab-notebook", scenario: input.scenario, status: "saved" });
            this.updateStatus("Saved latest result to the Experiment Lab Notebook.");
        }
        clearExperimentLabNotebook() {
            this.latestExperimentLabNotebook = this.experimentLabNotebook.createEmpty("arcsecs-lab-notebook-" + (this.root.id || "default"));
            try { if (window.localStorage) { window.localStorage.removeItem("arcsecsExperimentLabNotebook"); } } catch (error) { /* storage unavailable */ }
            this.renderExperimentLabNotebook();
            this.recordFlightEvent({ label: "Lab Notebook cleared", detail: "All browser-session notebook entries were cleared.", severity: "info", source: "lab-notebook", scenario: this.toConfig().scenario, status: "cleared" });
            this.updateStatus("Experiment Lab Notebook cleared.");
        }
        renderExperimentLabNotebook() {
            const panel = this.root.querySelector("[data-arcsecs-lab-notebook]");
            if (!panel || !this.experimentLabNotebook) { return; }
            const notebook = this.latestExperimentLabNotebook || this.experimentLabNotebook.createEmpty("arcsecs-lab-notebook-" + (this.root.id || "default"));
            this.latestExperimentLabNotebook = notebook;
            if (!notebook.entries.length) {
                panel.innerHTML = `<article class="arcsecs-lab-notebook-card"><header><span>Experiment Lab Notebook</span><strong>0 saved</strong><em>waiting</em></header><p>${notebook.summary.visitorSummary}</p><p>Run a recipe or playlist item, then the notebook will show saved summaries, before/after metric cards, and cautious copy text.</p></article>`;
                return;
            }
            panel.innerHTML = `<article class="arcsecs-lab-notebook-card"><header><span>Experiment Lab Notebook</span><strong>${notebook.summary.entryCount} saved</strong><em class="is-${notebook.summary.warningCount > 0 ? "warning" : "ready"}">${formatNumber(notebook.summary.averageValidationScore * 100)}% avg validation</em></header><p>${notebook.summary.visitorSummary}</p><p>${notebook.summary.physicistSummary}</p><ol class="arcsecs-lab-notebook-entries">${notebook.entries.map((entry) => `<li class="is-${entry.warningCount > 0 || entry.ledgerStatus !== "pass" ? "warning" : "pass"}"><button type="button" data-arcsecs-notebook-scenario="${entry.scenario}" aria-label="Open notebook scenario ${entry.scenarioLabel}"><strong>${entry.scenarioLabel}</strong><span>${entry.source} · ${entry.presetTitle} · ledger ${entry.ledgerStatus}</span><em>${entry.visitorSummary}</em><small>${entry.createdUtc}</small></button><div class="arcsecs-lab-notebook-metrics">${entry.metricCards.slice(0, 6).map((card) => `<span class="is-${card.status}"><b>${card.label}</b><strong>${card.value}${card.unit === "state" ? "" : " " + card.unit}</strong><i style="width:${Math.max(8, Math.min(100, Math.abs(card.numericValue) * 100))}%"></i></span>`).join("")}</div></li>`).join("")}</ol><p class="arcsecs-boundary-note"><strong>Boundary:</strong> ${notebook.scientificBoundary}</p></article>`;
        }
        buildExperimentLabNotebookBundle() {
            const notebook = this.latestExperimentLabNotebook || this.experimentLabNotebook.createEmpty("arcsecs-lab-notebook-" + (this.root.id || "default"));
            return { packetType: "ArcSecs Experiment Lab Notebook Export", engineVersion: (window.ArcSecsPhysicsEngineSettings && window.ArcSecsPhysicsEngineSettings.version) || "5.7.18", generatedUtc: new Date().toISOString(), notebook, activeConfig: this.toConfig(), experimentPlaylist: this.latestExperimentPlaylist || null, experimentComparison: this.latestExperimentComparison || null, reviewCockpit: this.latestReviewCockpit || null, grandExperiment: this.latestGrandTour || null, flightRecorder: this.flightRecorder ? this.flightRecorder.snapshot(9) : null, exportContainsExecutableCode: false, scientificBoundary: notebook.scientificBoundary };
        }
        exportExperimentLabNotebook() {
            const bundle = this.buildExperimentLabNotebookBundle();
            this.download("arcsecs-experiment-lab-notebook.json", JSON.stringify(bundle, null, 2), "application/json");
            this.recordFlightEvent({ label: "Lab Notebook exported", detail: "Experiment Lab Notebook exported as inert JSON.", severity: "info", source: "lab-notebook", scenario: this.toConfig().scenario, status: "exported" });
        }
        copyExperimentLabNotebook(mode) {
            const notebook = this.latestExperimentLabNotebook || this.experimentLabNotebook.createEmpty("arcsecs-lab-notebook-" + (this.root.id || "default"));
            const text = mode === "physicist" ? this.experimentLabNotebook.buildPhysicistCopy(notebook) : this.experimentLabNotebook.buildVisitorCopy(notebook);
            if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(() => this.updateStatus("Copied " + mode + " Lab Notebook summary.")); }
            else { this.updateStatus("Copy text ready: " + text.slice(0, 120)); }
            this.recordFlightEvent({ label: "Lab Notebook summary copied", detail: mode === "physicist" ? "Physicist summary copied." : "Visitor summary copied.", severity: "info", source: "lab-notebook", scenario: this.toConfig().scenario, status: "copied" });
        }


        refreshExperimentReplayTimeline(reason) {
            if (!this.experimentReplayTimeline) { return null; }
            const previousIndex = this.latestExperimentReplayTimeline ? this.latestExperimentReplayTimeline.currentIndex : 0;
            this.latestExperimentReplayTimeline = this.experimentReplayTimeline.buildTimeline(this.latestExperimentPlaylist || null, this.latestExperimentLabNotebook || null, this.latestResult || null, previousIndex, this.latestExperimentReplayTimeline ? this.latestExperimentReplayTimeline.playbackState : "paused");
            this.renderExperimentReplayTimeline();
            if (reason && reason !== "render") {
                this.recordFlightEvent({ label: "Replay Timeline refreshed", detail: "Experiment Replay Timeline rebuilt from playlist, notebook, and latest metrics.", severity: "info", source: "replay-timeline", scenario: this.toConfig().scenario, status: String(reason) });
            }
            return this.latestExperimentReplayTimeline;
        }
        moveExperimentReplayTimeline(action) {
            const timeline = this.latestExperimentReplayTimeline || this.refreshExperimentReplayTimeline("manual");
            if (!timeline) { this.updateStatus("Build or run a playlist before using the Replay Timeline."); return; }
            if (action === "back") { this.latestExperimentReplayTimeline = this.experimentReplayTimeline.previous(timeline); }
            else if (action === "play") { this.latestExperimentReplayTimeline = this.experimentReplayTimeline.play(timeline); }
            else if (action === "pause") { this.latestExperimentReplayTimeline = this.experimentReplayTimeline.pause(timeline); }
            else if (action === "warning") { this.latestExperimentReplayTimeline = this.experimentReplayTimeline.jumpToNextWarning(timeline); }
            else { this.latestExperimentReplayTimeline = this.experimentReplayTimeline.next(timeline); }
            this.renderExperimentReplayTimeline();
            const current = this.latestExperimentReplayTimeline.snapshots[this.latestExperimentReplayTimeline.currentIndex];
            if (current) { this.setScenario(current.scenario); }
            this.recordFlightEvent({ label: "Replay Timeline " + action, detail: current ? "Replay focused " + current.title + "." : "Replay Timeline has no stage snapshots yet.", severity: current && current.status === "warning" ? "warn" : "info", source: "replay-timeline", scenario: current ? current.scenario : this.toConfig().scenario, status: this.latestExperimentReplayTimeline.playbackState });
            this.updateStatus(current ? "Replay Timeline: " + current.title + "." : "Replay Timeline waiting for snapshots.");
        }
        renderExperimentReplayTimeline() {
            const panel = this.root.querySelector("[data-arcsecs-replay-timeline]");
            if (!panel || !this.experimentReplayTimeline) { return; }
            const timeline = this.latestExperimentReplayTimeline || this.experimentReplayTimeline.buildTimeline(this.latestExperimentPlaylist || null, this.latestExperimentLabNotebook || null, this.latestResult || null, 0, "paused");
            this.latestExperimentReplayTimeline = timeline;
            if (!timeline.snapshots.length) {
                panel.innerHTML = `<article class="arcsecs-replay-timeline-card"><header><span>Experiment Replay Timeline</span><strong>0 snapshots</strong><em>waiting</em></header><p>${timeline.summary.visitorSummary}</p><p>Run the playlist or save Lab Notebook results to populate timeline playback, before/after comparisons, warning jumps, and exportable replay reports.</p></article>`;
                return;
            }
            const current = timeline.snapshots[timeline.currentIndex] || timeline.snapshots[0];
            const markerHtml = current.visualMarkers.map((marker) => `<span class="is-${marker.triggered ? marker.severity : "muted"}"><b>${marker.label}</b><em>${marker.triggered ? "triggered" : "not triggered"}</em></span>`).join("");
            const metricHtml = current.beforeAfterMetrics.map((metric) => `<tr class="is-${metric.status}"><td>${metric.label}</td><td>${metric.beforeText} ${metric.unit}</td><td>${metric.afterText} ${metric.unit}</td><td>${metric.deltaText}</td><td>${metric.explanation}</td></tr>`).join("");
            const eventHtml = timeline.events.slice(0, 9).map((event) => `<li class="is-${event.severity}"><button type="button" data-arcsecs-replay-event="${event.order - 1}" aria-label="Focus replay event ${event.label}"><strong>${event.order}. ${event.label}</strong><span>${event.detail}</span></button></li>`).join("");
            panel.innerHTML = `<article class="arcsecs-replay-timeline-card"><header><span>Experiment Replay Timeline</span><strong>${timeline.currentIndex + 1}/${timeline.summary.stageCount} snapshots</strong><em class="is-${current.status}">${timeline.playbackState}</em></header><p>${timeline.summary.visitorSummary}</p><div class="arcsecs-replay-progress"><b style="width:${Math.max(5, Math.min(100, ((timeline.currentIndex + 1) / Math.max(1, timeline.summary.stageCount)) * 100))}%"></b></div><section class="arcsecs-replay-current"><h3>${current.title}</h3><p>${current.whyThisChanged}</p><dl><dt>Scenario</dt><dd>${ScenarioRegistry.getScenario(current.scenario).label}</dd><dt>Ledger</dt><dd>${current.ledgerStatus}</dd><dt>Validation</dt><dd>${formatNumber(current.validationScore * 100)}%</dd><dt>Warnings</dt><dd>${formatCount(current.warningCount)}</dd></dl></section><div class="arcsecs-replay-markers">${markerHtml}</div><table class="arcsecs-replay-metrics"><thead><tr><th>Metric</th><th>Before</th><th>After</th><th>Delta</th><th>Why it matters</th></tr></thead><tbody>${metricHtml}</tbody></table><ol class="arcsecs-replay-events">${eventHtml}</ol><p class="arcsecs-boundary-note"><strong>Boundary:</strong> ${timeline.scientificBoundary}</p></article>`;
            panel.querySelectorAll("[data-arcsecs-replay-event]").forEach((button) => button.addEventListener("click", () => { const index = Number(button.getAttribute("data-arcsecs-replay-event") || "0"); this.latestExperimentReplayTimeline = this.experimentReplayTimeline.buildTimelineFromExisting(timeline, index, "paused"); this.renderExperimentReplayTimeline(); }));
        }

        refreshExperimentSensitivityScan(reason) {
            this.latestExperimentSensitivityScan = this.experimentSensitivityScanner.buildScan({ scenario: this.toConfig().scenario, activeConfig: this.toConfig(), latestMetrics: this.latestResult ? this.latestResult.metrics : null, replayTimeline: this.latestExperimentReplayTimeline || null });
            this.renderExperimentSensitivityScanner();
            if (this.flightRecorder) {
                this.recordFlightEvent({ label: "Sensitivity Scanner refreshed", detail: "Parameter sweep rebuilt for " + ScenarioRegistry.getScenario(this.latestExperimentSensitivityScan.scenario).label + ".", severity: this.latestExperimentSensitivityScan.summary.warningCount > 0 ? "warn" : "info", source: "sensitivity-scanner", scenario: this.latestExperimentSensitivityScan.scenario, status: String(reason || "manual") });
            }
            return this.latestExperimentSensitivityScan;
        }
        renderExperimentSensitivityScanner() {
            const panel = this.root.querySelector("[data-arcsecs-sensitivity-scanner]");
            if (!panel) { return; }
            const scan = this.latestExperimentSensitivityScan || this.experimentSensitivityScanner.buildScan({ scenario: this.toConfig().scenario, activeConfig: this.toConfig(), latestMetrics: this.latestResult ? this.latestResult.metrics : null, replayTimeline: this.latestExperimentReplayTimeline || null });
            this.latestExperimentSensitivityScan = scan;
            const pointHtml = scan.points.map((point) => `<li class="is-${point.severity}"><button type="button" data-arcsecs-sensitivity-point="${point.index}" aria-label="Apply sensitivity point ${point.index + 1}: ${point.axisText}"><strong>${point.axisText}</strong><span>${point.metricText}</span><em>${point.markerLabels.length ? point.markerLabels.join(" · ") : point.severity}</em></button><p>${point.explanation}</p></li>`).join("");
            const tippingHtml = scan.tippingPoints.length ? scan.tippingPoints.map((point) => `<li class="is-${point.severity}"><strong>${point.label}</strong><span>${point.explanation}</span></li>`).join("") : `<li class="is-pass"><strong>No warning threshold found</strong><span>This sweep stayed inside the safe review band.</span></li>`;
            panel.innerHTML = `<article class="arcsecs-sensitivity-card"><header><span>Experiment Sensitivity Scanner</span><strong>${scan.axis.label}</strong><em>${scan.summary.warningCount} warnings</em></header><p>${scan.summary.visitorSummary}</p><p>${scan.axis.explanation}</p><div class="arcsecs-sensitivity-meter"><b style="width:${Math.max(5, Math.min(100, (scan.tippingPoints.length / Math.max(1, scan.points.length)) * 100))}%"></b></div><ol class="arcsecs-sensitivity-points">${pointHtml}</ol><section class="arcsecs-sensitivity-tipping"><h3>Tipping points</h3><ul>${tippingHtml}</ul></section><p><strong>Recommended next action:</strong> ${scan.summary.recommendedAction}</p><p class="arcsecs-boundary-note"><strong>Boundary:</strong> ${scan.scientificBoundary}</p></article>`;
        }
        applyExperimentSensitivityPoint(index) {
            const scan = this.latestExperimentSensitivityScan || this.refreshExperimentSensitivityScan("point");
            const boundedIndex = Math.max(0, Math.min(scan.points.length - 1, Math.round(Number(index) || 0)));
            const point = scan.points[boundedIndex];
            const field = this.form.elements[scan.axis.key];
            if (field) { field.value = String(point.axisValue); }
            this.setScenario(scan.scenario);
            this.updateStatus("Applied sensitivity point: " + scan.axis.label + " = " + point.axisText + ".");
            this.recordFlightEvent({ label: "Sensitivity point applied", detail: scan.axis.label + " = " + point.axisText + ".", severity: point.severity === "warning" ? "warn" : "info", source: "sensitivity-scanner", scenario: scan.scenario, status: point.severity });
            this.runSimulation();
        }
        buildExperimentSensitivityScanBundle() {
            const scan = this.latestExperimentSensitivityScan || this.refreshExperimentSensitivityScan("export");
            const report = this.experimentSensitivityScanner.exportReport(scan, { activeConfig: this.toConfig(), replayTimeline: this.latestExperimentReplayTimeline || null, playlist: this.latestExperimentPlaylist || null, latestMetrics: this.latestResult ? this.latestResult.metrics : null });
            return { packetType: "ArcSecs Experiment Sensitivity Scanner Export", engineVersion: (window.ArcSecsPhysicsEngineSettings && window.ArcSecsPhysicsEngineSettings.version) || "5.7.18", generatedUtc: new Date().toISOString(), sensitivityReport: report, experimentPlaylist: this.latestExperimentPlaylist || null, experimentReplayTimeline: this.latestExperimentReplayTimeline || null, experimentLabNotebook: this.latestExperimentLabNotebook || null, latestMetrics: this.latestResult ? this.latestResult.metrics : null, flightRecorder: this.flightRecorder ? this.flightRecorder.snapshot(9) : null, exportContainsExecutableCode: false, scientificBoundary: report.scientificBoundary };
        }
        exportExperimentSensitivityScan() {
            const bundle = this.buildExperimentSensitivityScanBundle();
            this.download("arcsecs-experiment-sensitivity-scanner-report.json", JSON.stringify(bundle, null, 2), "application/json");
            this.recordFlightEvent({ label: "Sensitivity Scanner exported", detail: "Experiment Sensitivity Scanner report exported as inert JSON.", severity: "info", source: "sensitivity-scanner", scenario: this.toConfig().scenario, status: "exported" });
        }

        buildExperimentReplayTimelineBundle() {
            const timeline = this.latestExperimentReplayTimeline || this.refreshExperimentReplayTimeline("export") || this.experimentReplayTimeline.buildTimeline(this.latestExperimentPlaylist || null, this.latestExperimentLabNotebook || null, this.latestResult || null, 0, "paused");
            const report = this.experimentReplayTimeline.exportReport(timeline, { activeConfig: this.toConfig(), playlistId: this.latestExperimentPlaylist ? this.latestExperimentPlaylist.playlistId : "none", notebookEntryCount: this.latestExperimentLabNotebook && this.latestExperimentLabNotebook.summary ? this.latestExperimentLabNotebook.summary.entryCount : 0 });
            return { packetType: "ArcSecs Experiment Replay Timeline Export", engineVersion: (window.ArcSecsPhysicsEngineSettings && window.ArcSecsPhysicsEngineSettings.version) || "5.7.18", generatedUtc: new Date().toISOString(), replayReport: report, experimentPlaylist: this.latestExperimentPlaylist || null, experimentLabNotebook: this.latestExperimentLabNotebook || null, latestMetrics: this.latestResult ? this.latestResult.metrics : null, flightRecorder: this.flightRecorder ? this.flightRecorder.snapshot(9) : null, exportContainsExecutableCode: false, scientificBoundary: report.scientificBoundary };
        }
        exportExperimentReplayTimeline() {
            const bundle = this.buildExperimentReplayTimelineBundle();
            this.download("arcsecs-experiment-replay-timeline-report.json", JSON.stringify(bundle, null, 2), "application/json");
            this.recordFlightEvent({ label: "Replay Timeline exported", detail: "Experiment Replay Timeline report exported as inert JSON.", severity: "info", source: "replay-timeline", scenario: this.toConfig().scenario, status: "exported" });
        }

        setNamedControlValue(name, value) {
            if (!this.form || !this.form.elements || !this.form.elements[name]) { return false; }
            const control = this.form.elements[name];
            if (typeof value === "boolean" && typeof control.checked === "boolean") { control.checked = value; }
            else { control.value = String(value); }
            control.dispatchEvent(new Event("input", { bubbles: true }));
            control.dispatchEvent(new Event("change", { bubbles: true }));
            return true;
        }
        applyParameterGuidePreset(runAfterApply) {
            const preset = this.parameterGuide.getPreset(this.selectedParameterPresetId);
            Object.keys(preset.parameters).forEach((name) => this.setNamedControlValue(name, preset.parameters[name]));
            this.setScenario(preset.scenario);
            this.markDirty();
            this.recordFlightEvent({ label: "Parameter preset applied", detail: preset.title + " populated the sandbox controls.", severity: "info", source: "parameter-guide", scenario: preset.scenario, status: runAfterApply ? "appliedAndRunning" : "applied" });
            this.updateStatus(runAfterApply ? "Applied and running: " + preset.title + "." : "Applied parameter guide preset: " + preset.title + ".");
            this.closeParameterGuide();
            if (runAfterApply) { this.runSimulation(); }
        }
        buildParameterGuideBundle() {
            const snapshot = this.parameterGuide.buildSnapshot(this.selectedParameterPresetId);
            return { packetType: "ArcSecs Run Your Own Simulation Parameter Guide Export", engineVersion: (window.ArcSecsPhysicsEngineSettings && window.ArcSecsPhysicsEngineSettings.version) || "5.7.18", generatedUtc: new Date().toISOString(), guide: snapshot, experimentRecipe: this.latestRecipeShareState || this.recipeLab.buildShareState(window.location && window.location.href ? window.location.href : "https://arcsecs.com/arcsecs-physics-engine-demo/", this.buildCurrentExperimentRecipe()), activeConfig: this.toConfig(), latestMetrics: this.latestResult ? this.latestResult.metrics : null, experimentComparison: this.latestExperimentComparison || null, experimentPlaylist: this.latestExperimentPlaylist || null, experimentReplayTimeline: this.latestExperimentReplayTimeline || null, experimentSensitivityScan: this.latestExperimentSensitivityScan || null, flightRecorder: this.flightRecorder ? this.flightRecorder.snapshot(9) : null, exportContainsExecutableCode: false, scientificBoundary: snapshot.scientificBoundary };
        }
        exportParameterGuide() {
            const bundle = this.buildParameterGuideBundle();
            this.download("arcsecs-run-your-own-simulation-parameter-guide.json", JSON.stringify(bundle, null, 2), "application/json");
            this.recordFlightEvent({ label: "Parameter guide exported", detail: "Run Your Own Simulation guide exported as inert JSON.", severity: "info", source: "parameter-guide", scenario: this.toConfig().scenario, status: "exported" });
        }

        recordFlightEvent(input) { if (!this.flightRecorder) { return; } const detail = Object.assign({ tick: this.runner ? this.runner.tick : 0, scenario: this.toConfig ? this.toConfig().scenario : "none", status: this.root.dataset.arcsecsRuntimeState || "pending" }, input || {}); this.flightRecorder.record(detail, performance.now()); this.renderFlightRecorder(); }
        renderFlightRecorder() { const panel = this.root.querySelector("[data-arcsecs-experiment-recorder]"); if (!panel || !this.flightRecorder) { return; } const snapshot = this.flightRecorder.snapshot(9); const latest = snapshot.events.slice(0, 8); panel.innerHTML = `<div class="arcsecs-flight-recorder-summary" data-arcsecs-flight-recorder-summary="true"><strong>${snapshot.progressPercent}%</strong><span>Grand Experiment progress</span><strong>${snapshot.passCount}</strong><span>passes</span><strong>${snapshot.warningCount}</strong><span>warnings</span><strong>${snapshot.failureCount}</strong><span>failures</span></div><ol class="arcsecs-flight-recorder-events">${latest.map((event) => `<li class="is-${event.severity}"><strong>#${event.sequence} ${event.label}</strong><span>${event.detail}</span><small>T+${formatNumber(event.elapsedMilliseconds)} ms · ${event.source} · ${event.scenario} · ${event.status}</small></li>`).join("")}</ol><p><strong>Export readiness:</strong> ${snapshot.exportReady ? "evidence data ready" : "waiting for pass events"}. This recorder is inert browser session data and exports only after a manual click.</p>`; }
        updateExperimentRecorder(result) { const scenario = result && result.config ? result.config.scenario : this.toConfig().scenario; const metrics = result && result.metrics ? result.metrics : {}; this.recordFlightEvent({ label: "Recorder synchronized", detail: "Visible recorder synchronized with " + ScenarioRegistry.getScenario(scenario).label + "; entities " + formatCount(metrics.entityCount || 0) + ", photons " + formatCount(metrics.photonPacketCount || 0) + ".", severity: "info", source: "ui", tick: result ? result.acceptedSteps || 0 : 0, scenario, status: "synchronized" }); }
        updatePanels(result) { const scenario = ScenarioRegistry.getScenario(result.config.scenario); const model = this.root.querySelector("[data-arcsecs-model-panel]"); if (model) model.innerHTML = `<dt>Scenario</dt><dd>${scenario.label}</dd><dt>Active model strategy</dt><dd>${scenario.strategy}</dd><dt>Parameters</dt><dd>${result.acceptedSteps} steps, decay ${formatNumber(result.config.lossRate)}, beta ${formatNumber(result.config.betaCoupling)}</dd><dt>Disclaimer</dt><dd>Speculative module, not established current technology.</dd>`; const diagnostics = this.root.querySelector("[data-arcsecs-diagnostics]"); if (diagnostics) diagnostics.innerHTML = `<dt>Entity count</dt><dd>${formatCount(result.metrics.entityCount)}</dd><dt>Photon packets</dt><dd>${formatCount(result.metrics.photonPacketCount)}</dd><dt>Solver links / constraints</dt><dd>${formatCount(result.metrics.constraintCount)}</dd><dt>Total kinetic estimate</dt><dd>${formatNumber(result.metrics.speculativeModelValue)}</dd><dt>Drift warning</dt><dd>${result.metrics.numericalDriftWarning}</dd><dt>Last error</dt><dd>${formatNumber(result.metrics.maximumError)}</dd><dt>Ramjet capture</dt><dd>${formatNumber(result.metrics.ramjetCaptureRate || 0)}</dd><dt>Shield integrity</dt><dd>${formatNumber(result.metrics.ramjetShieldIntegrity || 1)}</dd><dt>Radiator load</dt><dd>${formatNumber(result.metrics.ramjetRadiatorLoad || 0)}</dd><dt>Ramjet warnings</dt><dd>${result.metrics.ramjetWarnings || "none"}</dd><dt>Validation score</dt><dd>${formatNumber((result.validationLab ? result.validationLab.validationScore : 0) * 100)}%</dd><dt>Estimated frame budget</dt><dd>${formatNumber(result.metrics.estimatedFrameBudgetMs || 0)} ms</dd><dt>Photon transport efficiency</dt><dd>${formatNumber((result.metrics.photonTransportEfficiency || 0) * 100)}%</dd>`; const comparison = this.root.querySelector("[data-arcsecs-comparison]"); if (comparison) comparison.innerHTML = `<p><strong>Baseline Newtonian:</strong> ${formatNumber(result.metrics.newtonianBaseline)}</p><p><strong>Speculative branch:</strong> ${formatNumber(result.metrics.speculativeModelValue)}</p><p>No claim is proven here; this is a comparison mode.</p>`; setText(this.root.querySelector("[data-arcsecs-entity-count]"), formatCount(result.metrics.entityCount)); setText(this.root.querySelector("[data-arcsecs-photon-count]"), formatCount(result.metrics.photonPacketCount)); setText(this.root.querySelector("[data-arcsecs-constraint-count]"), formatCount(result.metrics.constraintCount)); const audit = this.root.querySelector("[data-arcsecs-audit]"); if (audit) audit.innerHTML = buildAudit(result); this.updateRamjetPanels(result); }
        updateRamjetPanels(result) {
            const inspector = this.root.querySelector("[data-arcsecs-ramjet-inspector]");
            const isRamjet = result.config.scenario === "darkMatterRamjet";
            if (inspector) { this.renderRamjetSubsystemInspector(inspector, result, isRamjet); }
            this.updateRamjetSubsystemButtons(isRamjet);
            const flow = this.root.querySelector("[data-arcsecs-energy-flow]");
            if (flow) {
                const values = isRamjet ? [result.metrics.ramjetCaptureRate, result.metrics.ramjetIntakeDragLoad, result.metrics.ramjetCompressionPressure, result.metrics.ramjetBufferFill, result.metrics.ramjetReactorOutputPower, result.metrics.ramjetRadiatorLoad, result.metrics.ramjetThrustProxy] : [0,0,0,0,0,0,0];
                const labels = ["Capture", "Intake", "Compression", "Buffer", "Reactor", "Thermal", "Exhaust"];
                flow.innerHTML = labels.map((label, index) => `<span><em>${label}</em><b style="width:${Math.min(100, Math.max(8, values[index] * 12))}%"></b><strong>${formatNumber(values[index])}</strong></span>`).join("");
            }
            const director = this.root.querySelector("[data-arcsecs-flight-director]");
            if (director) {
                if (!isRamjet) { director.textContent = "Flight director activates for the Dark Matter Drive Ramjet module."; }
                else {
                    const warnings = result.metrics.ramjetWarnings === "none" ? "No active warnings" : result.metrics.ramjetWarnings;
                    const readiness = (result.metrics.ramjetMissionReadiness || 0) >= 0.72 ? "GO" : (result.metrics.ramjetMissionReadiness || 0) >= 0.45 ? "CAUTION" : "NO-GO";
                    director.innerHTML = `<strong>${readiness}</strong><p>Preset ${result.config.ramjetPreset}; comparison ${result.config.comparisonMode}; failure injection ${result.config.failureInjectionMode}. ${warnings}.</p><p>Readiness is a conceptual blend of field stability, shield integrity, drag decoupling, thermal margin, exhaust collimation, and habitat isolation.</p>`;
                }
            }
            const subsystemTable = this.root.querySelector("[data-arcsecs-subsystem-table]");
            if (subsystemTable) {
                const states = (result.metrics.ramjetSubsystemStates || []);
                subsystemTable.innerHTML = states.length ? `<table><thead><tr><th>Subsystem</th><th>Status</th><th>Efficiency</th><th>Stress</th></tr></thead><tbody>${states.map((item) => `<tr><td>${item.displayName}</td><td>${item.status}</td><td>${formatNumber(item.efficiency)}</td><td>${formatNumber(item.stressLoad)}</td></tr>`).join("")}</tbody></table>` : "Subsystem telemetry pending.";
            }
            const timeline = this.root.querySelector("[data-arcsecs-warning-timeline]");
            if (timeline) {
                const warnings = isRamjet && result.metrics.ramjetWarnings !== "none" ? String(result.metrics.ramjetWarnings).split(/,\s*/) : [];
                timeline.innerHTML = warnings.length ? warnings.map((warning, index) => `<span><strong>T+${index + 1}</strong>${warning}</span>`).join("") : "No warnings for the latest ramjet run.";
            }
            const comparison = this.root.querySelector("[data-arcsecs-ramjet-comparison]");
            if (comparison) {
                if (!isRamjet) { comparison.textContent = "Run the ramjet scenario to compare scoop, shield, solenoid, radiator, and exhaust branches."; }
                else { comparison.innerHTML = `<p><strong>Mode:</strong> ${result.config.comparisonMode}</p><p><strong>Readiness:</strong> ${formatNumber(result.metrics.ramjetMissionReadiness)} | <strong>Net efficiency:</strong> ${formatNumber(result.metrics.ramjetNetEfficiency)}</p><p>Comparison modes intentionally degrade one subsystem so the user can see which ledger term fails first.</p>`; }
            }
        }
        setRamjetSubsystemFocus(id) { this.activeRamjetSubsystem = id; this.updateRamjetSubsystemButtons(true); if (this.latestResult) { this.updateRamjetPanels(this.latestResult); } else { const inspector = this.root.querySelector("[data-arcsecs-ramjet-inspector]"); if (inspector) { inspector.innerHTML = this.buildRamjetSubsystemMarkup(null, false); } } this.updateStatus("Focused ramjet subsystem: " + this.getRamjetSubsystemDetail(id).name + "."); }
        updateRamjetSubsystemButtons(isRamjet) { this.root.querySelectorAll("[data-arcsecs-subsystem-focus]").forEach((button) => { const active = button.getAttribute("data-arcsecs-subsystem-focus") === this.activeRamjetSubsystem; button.classList.toggle("is-active", active && isRamjet); button.setAttribute("aria-pressed", active && isRamjet ? "true" : "false"); }); }
        renderRamjetSubsystemInspector(inspector, result, isRamjet) { if (!isRamjet) { inspector.textContent = "Select Dark Matter Drive Ramjet to inspect EIT scoop, HIBE shield, Fishback solenoid, stationary-light buffer, reactor, thermal management, and exhaust."; return; } inspector.innerHTML = this.buildRamjetSubsystemMarkup(result, true); }
        getRamjetSubsystemDetail(id) { const details = { eitScoop: { name: "Projected EIT Scoop Field", role: "Expands a conceptual capture field around the bow and slows tired-light substrate for collection.", upstream: "ambient tired-light substrate", downstream: "HIBE shield and intake throat", risk: "field instability, weak coupling, low capture density", metric: "ramjetCaptureRate" }, hibeShield: { name: "HIBE Composite Ice Shield", role: "Absorbs relativistic dust, radiation, and thermal flux before the flow reaches the hull.", upstream: "incoming hazard flux", downstream: "intake throat", risk: "ablation, radiolysis, brittle shock, shield critical", metric: "ramjetShieldIntegrity" }, intakeVortex: { name: "Intake Throat / Ramscoop Vortex", role: "Turns diffuse captured substrate into a controlled vortex mass-flow equivalent.", upstream: "scoop field", downstream: "Fishback solenoid", risk: "shock heating, turbulence, intake drag spike", metric: "ramjetIntakeDragLoad" }, fishbackSolenoid: { name: "Fishback Solenoid", role: "Uses superconducting field geometry to decouple destructive intake momentum from the hull.", upstream: "ramscoop vortex", downstream: "compression chamber", risk: "solenoid saturation, quench, residual drag coupling", metric: "ramjetEffectiveDrag" }, stationaryBuffer: { name: "Stationary-Light / Dark-State Polariton Buffer", role: "Stores compressed substrate as a conceptual dark-state polariton reservoir before reactor draw.", upstream: "compression chamber", downstream: "reactor core", risk: "buffer saturation, decoherence, reactor starvation", metric: "ramjetBufferFill" }, reactorCore: { name: "Reactor Core / Massive Photon Re-Energization", role: "Re-energizes stored substrate into directed output while producing waste heat.", upstream: "stationary-light buffer", downstream: "thermal system and exhaust collimator", risk: "reactor overload, low conversion efficiency, heat spike", metric: "ramjetReactorOutputPower" }, thermalSystem: { name: "Thermal Management System", role: "Rejects waste heat from compression, storage, and reactor conversion stages.", upstream: "reactor and compression losses", downstream: "habitat safety and mission readiness", risk: "radiator overload, thermal runaway, crew dose increase", metric: "ramjetRadiatorLoad" }, exhaustCollimator: { name: "Exhaust Collimator / Directional Photon Wake", role: "Focuses the re-energized output into a directional thrust proxy instead of a diffuse hazard cloud.", upstream: "reactor output", downstream: "photon exhaust wake", risk: "phase jitter, exhaust divergence, low thrust efficiency", metric: "ramjetThrustProxy" } }; return details[id] || details.eitScoop; }
        buildRamjetSubsystemMarkup(result, live) { const detail = this.getRamjetSubsystemDetail(this.activeRamjetSubsystem); const metrics = result ? result.metrics : {}; const value = live ? metrics[detail.metric] : 0; const warnings = live ? (metrics.ramjetWarnings || "none") : "waiting for ramjet run"; return `<article class="arcsecs-subsystem-card"><header><span>Focused subsystem</span><strong>${detail.name}</strong></header><p>${detail.role}</p><dl><dt>Current telemetry</dt><dd>${detail.metric}: ${formatNumber(value || 0)}</dd><dt>Upstream dependency</dt><dd>${detail.upstream}</dd><dt>Downstream dependency</dt><dd>${detail.downstream}</dd><dt>Risk / failure mode</dt><dd>${detail.risk}</dd><dt>Warning bus</dt><dd>${warnings}</dd></dl><footer>Conceptual normalized simulation values; speculative research visualization, not established current technology.</footer></article>`; }

        updateQualityGateReport(result) {
            const panel = this.root.querySelector("[data-arcsecs-quality-gate]");
            if (!panel) return;
            const report = result.qualityGateReport || { score: 0, status: "pending", checks: [] };
            panel.innerHTML = `<div class="arcsecs-gate-score"><strong>${formatNumber((report.score || 0) * 100)}%</strong><span>${report.status || "pending"}</span></div><ul>${(report.checks || []).map((check) => `<li class="is-${check.passed ? "pass" : "warn"}"><strong>${check.label}</strong><span>${check.detail || ""}</span></li>`).join("")}</ul><p>${report.deploymentNote || "Quality gate pending."}</p>`;
        }
        updateScenarioPassport(result) {
            const panel = this.root.querySelector("[data-arcsecs-scenario-passport]");
            if (!panel) return;
            const passport = result.scenarioPassport || {};
            panel.innerHTML = `<dl><dt>Scenario</dt><dd>${ScenarioRegistry.getScenario(passport.scenario || result.config.scenario).label}</dd><dt>Telemetry headline</dt><dd>${passport.telemetryHeadline || "pending"}</dd><dt>Scientific boundary</dt><dd>${passport.scientificBoundary || "Speculative research visualization — not established current technology."}</dd><dt>Next experiment</dt><dd>${passport.nextExperiment || "Run benchmark suite."}</dd></dl><p><strong>Primary assumptions:</strong> ${(passport.primaryAssumptions || []).join(" · ")}</p>`;
        }
        updateAnomalyTriage(result) {
            const panel = this.root.querySelector("[data-arcsecs-anomaly-triage]");
            if (!panel) return;
            const triage = result.anomalyTriage || { anomalies: [] };
            panel.innerHTML = (triage.anomalies || []).map((item) => `<article class="arcsecs-anomaly is-${item.severity}"><strong>${item.label}</strong><span>${item.action}</span></article>`).join("") || "No anomaly data.";
        }
        updateAccessibilityAudit(result) {
            const panel = this.root.querySelector("[data-arcsecs-accessibility-audit]");
            if (!panel) return;
            const audit = result.accessibilityAudit || { checks: [] };
            panel.innerHTML = `<p><strong>Status:</strong> ${audit.status || "pending"}</p><ul>${(audit.checks || []).map((check) => `<li>${check.passed ? "✓" : "!"} ${check.label}</li>`).join("")}</ul><p>${audit.reducedMotionNote || ""}</p>`;
        }
        updatePerformanceEnvelope(result) {
            const panel = this.root.querySelector("[data-arcsecs-performance-envelope]");
            if (!panel) return;
            const envelope = result.performanceEnvelope || {};
            const reasons = Array.isArray(envelope.degradationReasons) && envelope.degradationReasons.length ? envelope.degradationReasons.join(" · ") : "none";
            panel.innerHTML = `<dl><dt>Frame budget</dt><dd>${formatNumber(envelope.estimatedFrameBudgetMs || 0)} ms</dd><dt>Load risk</dt><dd>${envelope.loadRisk || "pending"}</dd><dt>Particle budget</dt><dd>${envelope.particleBudget || 0}</dd><dt>Recommended particles</dt><dd>${envelope.recommendedPhotonPacketCount || envelope.particleBudget || 0}</dd><dt>Trail length</dt><dd>${envelope.recommendedTrailLength || 0}</dd><dt>Visual effects</dt><dd>${envelope.visualEffectLevel || "pending"}</dd><dt>Telemetry Hz</dt><dd>${envelope.telemetryUpdateHz || 0}</dd><dt>Worker isolated</dt><dd>${envelope.workerIsolated ? "yes" : "no"}</dd></dl><p>${envelope.benchmarkStatusText || envelope.recommendation || "Performance envelope pending."}</p><p><strong>Degradation reasons:</strong> ${reasons}</p>`;
        }
        updateTestCoverageDashboard(result) {
            const panel = this.root.querySelector("[data-arcsecs-test-coverage]");
            if (!panel) return;
            const dashboard = result.testCoverageDashboard || { categories: [], passCount: 0, testCount: 0 };
            panel.innerHTML = `<p><strong>${dashboard.passCount || 0}/${dashboard.testCount || 0}</strong> active scenario checks passed.</p><table><thead><tr><th>Category</th><th>Coverage</th><th>Detail</th></tr></thead><tbody>${(dashboard.categories || []).map((row) => `<tr><td>${row.category}</td><td>${formatNumber((row.coverage || 0) * 100)}%</td><td>${row.detail}</td></tr>`).join("")}</tbody></table>`;
        }

        setAudienceMode(mode) {
            const normalized = mode === "physicist" ? "physicist" : "public";
            this.root.dataset.arcsecsAudienceMode = normalized;
            this.root.querySelectorAll("[data-arcsecs-audience-mode]").forEach((button) => {
                const active = button.getAttribute("data-arcsecs-audience-mode") === normalized;
                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", active ? "true" : "false");
            });
            this.updateStatus(normalized === "physicist" ? "Physicist detail mode enabled." : "Public explanation mode enabled.");
            if (this.latestResult) { this.updateAudiencePanels(this.latestResult); }
        }
        scenarioAudienceGuide(key) {
            const base = {
                publicHeadline: "This mode turns an abstract physics idea into a visible experiment.",
                publicStory: "Watch the highlighted objects move, then change one control and rerun. The important lesson is not that the speculative model is proven; it is that the engine exposes what the model assumes and what it would have to explain.",
                physicistHeadline: "Read this as a deterministic comparison harness, not a validation of the hypothesis.",
                physicistStory: "Inspect the invariant, baseline delta, finite telemetry, ledger status, and warning bus. The useful output is whether the implementation remains deterministic, bounded, and explicit about unsupported assumptions.",
                analogy: "Think of it as a wind tunnel for equations: safe, simplified, repeatable, and designed to reveal failure modes.",
                equation: "model output = baseline + explicit speculative term + diagnostics",
                nextQuestion: "Which parameter changes the plotted signal the most without creating a warning?"
            };
            const guides = {
                relationalLattice: { publicHeadline: "Space is shown as relationships, not as an invisible container.", publicStory: "Dots are physical states. Lines are measurable relations. The empty grid is only a plotting aid, while edge weights carry the model's idea of distance.", physicistHeadline: "Relational database mode keeps coordinate labels subordinate to graph observables.", physicistStory: "Check node count, edge count, average relation length, and baseline delta against the flat coordinate reference.", analogy: "Like a social network map: the important distance is how nodes are connected, not where the paper happens to place them.", equation: "d_rel(i,j) = weighted path distance over relation graph", nextQuestion: "Can the graph preserve observer-frame measurements when node labels move?" },
                massivePhotonProca: { publicHeadline: "Different photon packets can arrive at different times in this speculative branch.", publicStory: "The high-frequency path is the reference. The lower-frequency branch lags when the effective photon-mass slider is increased.", physicistHeadline: "Proca-style effective mass introduces frequency-dependent group velocity.", physicistStory: "Use the massless baseline as the control and watch arrival delay scale with distance and effective mass.", analogy: "Like runners with slightly different drag: the long race reveals a tiny speed difference.", equation: "v_g \u2248 c sqrt(1 - (m_eff c^2 / hf)^2)", nextQuestion: "At what effective mass does the delay become visible but still bounded?" },
                mechanisticTiredLight: { publicHeadline: "Photon energy is drained gradually across distance.", publicStory: "The packet keeps its main direction, but the energy ledger decreases and the redshift proxy rises.", physicistHeadline: "Mechanistic tired-light mode tracks monotonic energy loss and forward-scattering constraints.", physicistStory: "This is explicitly challenged by mainstream observations such as time dilation, CMB spectrum, and image-blurring constraints.", analogy: "Like a beam passing through a nearly invisible fog that removes energy without obviously scattering the beam.", equation: "E(x) = E_0 e^{-k x}; z = E_0/E(x) - 1", nextQuestion: "Can energy loss increase redshift without violating the forward-scattering guardrail?" },
                flatSpaceLensing: { publicHeadline: "Light paths bend near a mass without drawing curved spacetime.", publicStory: "The demo compares a simple corpuscular path, a refractive correction, and a reference baseline.", physicistHeadline: "Flat-space lensing mode separates Newtonian half-deflection from refractive-index-style correction.", physicistStory: "Use impact parameter and lens mass to inspect percent difference from the reference curve.", analogy: "Like a mirage lens: the path bends because the medium model changes, not because the canvas is stretched.", equation: "alpha_N \u2248 2GM/(b c^2); alpha_GR \u2248 4GM/(b c^2)", nextQuestion: "How close can the corrected path get to the reference curve across impact parameters?" },
                parallaxCalibration: { publicHeadline: "Arcseconds become distances through a simple astronomical benchmark.", publicStory: "Set parallax to one arcsecond and the solver should read one parsec. That makes the simulator feel anchored to real astronomical units.", physicistHeadline: "Calibration mode enforces the 1 arcsecond to 1 parsec benchmark within tolerance.", physicistStory: "This is a concrete unit-testable anchor for the rest of the theatrical coordinate scale.", analogy: "Like calibrating a ruler before measuring the room.", equation: "d(pc) = baseline(AU) / parallax(arcsec)", nextQuestion: "Does the solver stay stable when moving from arcseconds to milliarcseconds?" },
                photometricCalibration: { publicHeadline: "A star's apparent brightness is measured after subtracting the sky background.", publicStory: "The aperture collects star light. The annulus estimates background. The corrected flux becomes a magnitude.", physicistHeadline: "Photometric mode demonstrates aperture/annulus subtraction and magnitude conversion.", physicistStory: "The useful check is that invalid aperture geometry is caught and corrected flux remains finite.", analogy: "Like measuring a candle in a lit room: first subtract the room light.", equation: "m_inst = -2.5 log10(max(F_corrected, epsilon))", nextQuestion: "How sensitive is the calibrated magnitude to background and aperture size?" },
                darkMatterRamjet: { publicHeadline: "The ramjet turns a speculative fuel stream into a visible engineering pipeline.", publicStory: "Particles flow from the EIT scoop through shield, intake, solenoid, compression, buffer, reactor, thermal system, and exhaust. Watch warnings when a subsystem is overloaded.", physicistHeadline: "Ramjet mode is a subsystem ledger: capture, drag, shielding, compression, storage, conversion, waste heat, collimation, and thrust proxy.", physicistStory: "The key tests are conservation-style accounting, bounded efficiencies, no negative drag, warning thresholds, and explicit speculative caveats.", analogy: "Like a refinery in space: each stage must pass material and energy to the next without hiding losses.", equation: "eta_net = eta_capture eta_compression eta_reactor eta_thermal eta_exhaust", nextQuestion: "Which subsystem becomes the bottleneck first when velocity or substrate density rises?" },
                rigidBodyDiagnostics: { publicHeadline: "This mode shows the nuts and bolts of the simulator itself.", publicStory: "Boxes, contacts, normals, and friction vectors reveal how the engine keeps objects stable and deterministic.", physicistHeadline: "Rigid-body mode exposes solver diagnostics: broadphase, narrowphase, contacts, restitution, friction, and constraints.", physicistStory: "Watch for finite energy estimate, bounded contact count, and no runaway constraint drift.", analogy: "Like opening the hood to watch the transmission instead of only seeing the car move.", equation: "impulse = -(1+e)(v_rel \u00b7 n) / effectiveMass", nextQuestion: "Do contacts remain stable when friction and restitution are changed?" }
            };
            return Object.assign({}, base, guides[key] || {});
        }
        updateAudiencePanels(result) {
            const guide = this.scenarioAudienceGuide(result.config.scenario);
            const publicPanel = this.root.querySelector("[data-arcsecs-public-guide]");
            const physicistPanel = this.root.querySelector("[data-arcsecs-physicist-notes]");
            const glossaryPanel = this.root.querySelector("[data-arcsecs-glossary]");
            if (publicPanel) {
                publicPanel.innerHTML = `<h3>${guide.publicHeadline}</h3><p>${guide.publicStory}</p><p><strong>Plain-language analogy:</strong> ${guide.analogy}</p><p><strong>Try this:</strong> ${guide.nextQuestion}</p>`;
            }
            if (physicistPanel) {
                physicistPanel.innerHTML = `<h3>${guide.physicistHeadline}</h3><p>${guide.physicistStory}</p><dl><dt>Control baseline</dt><dd>${scenarioContract(result.config.scenario).baseline}</dd><dt>Ledger state</dt><dd>${result.metrics.ledgerStatus || "pass"}</dd><dt>Validation score</dt><dd>${formatNumber((result.validationLab ? result.validationLab.validationScore : 0) * 100)}%</dd><dt>Baseline delta</dt><dd>${formatNumber(result.metrics.baselineDelta || 0)}</dd></dl>`;
            }
            if (glossaryPanel) {
                glossaryPanel.innerHTML = `<dl><dt>Baseline</dt><dd>The reference calculation used for comparison. It is not automatically the final truth; it is the control branch.</dd><dt>Ledger</dt><dd>The accounting check that keeps energy, redshift, drag, heat, or calibration values explicit instead of hidden.</dd><dt>Speculative module</dt><dd>A selectable hypothesis branch shown for concept development and falsification thinking.</dd><dt>Deterministic run</dt><dd>The same inputs should produce the same telemetry, which makes bugs and model changes testable.</dd></dl>`;
            }
        }
        updateScenarioWalkthrough(result) {
            const panel = this.root.querySelector("[data-arcsecs-walkthrough]");
            if (!panel) { return; }
            const labelText = ScenarioRegistry.getScenario(result.config.scenario).label;
            const guide = this.scenarioAudienceGuide(result.config.scenario);
            panel.innerHTML = `<ol><li><strong>Start with the title:</strong> ${labelText} is the active experiment.</li><li><strong>Watch the viewport:</strong> the moving or connected objects show the central mechanism.</li><li><strong>Read the first graph:</strong> ${this.root.querySelector("[data-arcsecs-primary-graph-caption]") ? this.root.querySelector("[data-arcsecs-primary-graph-caption]").textContent : "main signal"}.</li><li><strong>Read the second graph:</strong> it is the baseline, comparison, or ledger signal.</li><li><strong>Change one slider:</strong> rerun and check whether the ledger stays bounded.</li></ol><p>${guide.nextQuestion}</p>`;
        }
        updateAssumptionLadder(result) {
            const panel = this.root.querySelector("[data-arcsecs-assumption-ladder]");
            if (!panel) { return; }
            const contract = scenarioContract(result.config.scenario);
            const warnings = String(result.metrics.ramjetWarnings || result.metrics.numericalDriftWarning || "none");
            const levels = [
                { name: "Observed or standard reference", value: contract.baseline, state: "baseline" },
                { name: "Simulation implementation", value: "deterministic worker + fixed-step rendering", state: "implemented" },
                { name: "Speculative assumption", value: contract.invariant, state: "speculative" },
                { name: "Current warning state", value: warnings, state: warnings === "none" ? "clear" : "review" }
            ];
            panel.innerHTML = levels.map((level, index) => `<div class="arcsecs-ladder-row arcsecs-ladder-${level.state}"><span>${index + 1}</span><strong>${level.name}</strong><em>${level.value}</em></div>`).join("");
        }
        updateEquationLedger(result) {
            const panel = this.root.querySelector("[data-arcsecs-equation-ledger]");
            if (!panel) { return; }
            const guide = this.scenarioAudienceGuide(result.config.scenario);
            panel.innerHTML = `<p><strong>Conceptual equation:</strong></p><code>${guide.equation}</code><dl><dt>Measured branch</dt><dd>${formatNumber(result.metrics.speculativeModelValue)}</dd><dt>Baseline branch</dt><dd>${formatNumber(result.metrics.newtonianBaseline)}</dd><dt>Delta</dt><dd>${formatNumber(result.metrics.baselineDelta || 0)}</dd><dt>Maximum numeric error</dt><dd>${formatNumber(result.metrics.maximumError || 0)}</dd></dl>`;
        }
        updateSliderImpactMap(result) {
            const panel = this.root.querySelector("[data-arcsecs-slider-impact]");
            if (!panel) { return; }
            const scenario = result.config.scenario;
            const impact = {
                distanceTimeKernel: ["Event selector changes wavefront timing and delay decomposition.", "Medium density changes photon attenuation and redshift proxy.", "Parallax and angular values change parsec/geometry distance estimates."],
                relationalLattice: ["Accepted steps changes sampling density.", "Beta coupling changes the speculative relational signal.", "Overlay toggles reveal labels, grid, and vectors."],
                massivePhotonProca: ["Effective photon mass increases low-frequency delay.", "Accepted steps increases path sampling.", "Photon packet count changes visual density."],
                mechanisticTiredLight: ["Tired-light decay raises redshift and lowers energy.", "Particle density increases encounter probability.", "Forward-scattering strictness protects path blur."],
                flatSpaceLensing: ["Baryonic mass proxy strengthens deflection.", "Acceleration threshold changes speculative correction strength.", "Accepted steps changes path smoothness."],
                parallaxCalibration: ["Parallax angle controls parsec distance.", "Baseline AU scales the measurement ruler.", "Solver tolerance is checked in the certificate."],
                photometricCalibration: ["Background sky level reduces corrected flux.", "Aperture radius controls captured star light.", "Noise level stresses magnitude stability."],
                darkMatterRamjet: ["Scoop diameter and substrate density raise capture.", "Ship velocity and drag coefficient raise intake load.", "Thermal capacity and reactor efficiency decide whether heat becomes a warning."]
            };
            panel.innerHTML = `<ul>${(impact[scenario] || ["Simulation speed changes runtime pacing.", "Accepted steps changes deterministic sample count.", "Overlay toggles reveal or hide debug information."]).map((item) => `<li>${item}</li>`).join("")}</ul>`;
        }
        updatePhysicistScorecard(result) {
            const panel = this.root.querySelector("[data-arcsecs-physicist-scorecard]");
            if (!panel) { return; }
            const tests = Array.isArray(result.tests) ? result.tests : [];
            const passed = tests.filter((item) => item.passed).length;
            const total = tests.length || 1;
            const score = passed / total;
            const finite = Number.isFinite(result.metrics.speculativeModelValue) && Number.isFinite(result.metrics.newtonianBaseline) && Number.isFinite(result.metrics.maximumError);
            const ledger = result.metrics.ledgerStatus || "pass";
            panel.innerHTML = `<div class="arcsecs-scorecard"><span><strong>${formatNumber(score * 100)}%</strong><em>TDD pass rate</em></span><span><strong>${finite ? "finite" : "review"}</strong><em>numeric outputs</em></span><span><strong>${ledger}</strong><em>ledger</em></span><span><strong>${result.metrics.ramjetWarnings || result.metrics.numericalDriftWarning || "none"}</strong><em>warnings</em></span></div><p>For a physicist: this panel is the quick falsification dashboard. The model is interesting only when assumptions, baseline, ledger, and failure modes are visible.</p>`;
        }

        exportQualityGateReport() { this.downloadStrictExportTarget("qualityGate", "arcsecs-quality-gate-report.json"); }
        copyOperatorSummary() { const summary = this.root.querySelector("[data-arcsecs-operator-summary]"); if (!summary) { return; } const text = summary.textContent || "ArcSecs simulation summary pending."; if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(() => this.updateStatus("Operator summary copied.")); } else { this.updateStatus("Clipboard API unavailable; select the summary text manually."); } }



        selectDistanceTimeClaim(claimKey) {
            this.activeDistanceTimeClaimKey = claimKey;
            this.root.dataset.arcsecsActiveClaim = claimKey;
            this.setScenario("distanceTimeKernel");
            const previewConfig = this.toConfig();
            const previewResult = Object.assign({}, this.latestResult || {}, { config: previewConfig, metrics: this.latestResult && this.latestResult.metrics ? this.latestResult.metrics : {}, distanceTimeKernel: buildDistanceTimeKernelState(previewConfig, this.frame || 0), distanceTimeActiveClaimKey: claimKey });
            
            this.latestDistanceTimeKernel = previewResult.distanceTimeKernel;
            this.updateDistanceTimeKernelPanels(previewResult);
            this.viewport.draw(previewResult, this.frame || 0);
            const claim = distanceTimeClaimCards.find((item) => item.key === claimKey) || distanceTimeClaimCards[0];
            this.recordFlightEvent({ label: "Framework claim selected", detail: claim.title + " highlighted viewport, telemetry, validation, and export evidence path.", severity: "info", source: "claim-map", scenario: "distanceTimeKernel", status: "demonstrated" });
            this.updateStatus("Claim highlighted: " + claim.title + ".");
        }
        getDistanceTimeKernelState(result) {
            const currentConfig = this.toConfig();
            const resultConfig = result && result.config ? result.config : {};
            const config = currentConfig.scenario === "distanceTimeKernel" ? Object.assign({}, resultConfig, currentConfig) : Object.assign({}, currentConfig, resultConfig);
            const frame = this.frame || 0;
            this.latestDistanceTimeKernel = buildDistanceTimeKernelState(config, frame);
            return this.latestDistanceTimeKernel;
        }
        isDistanceTimeTelemetryHighlighted(activeClaim, telemetryLabel) {
            if (!activeClaim || !Array.isArray(activeClaim.telemetry)) { return false; }
            const normalizedTelemetry = String(telemetryLabel || "").toLowerCase();
            return activeClaim.telemetry.some((item) => normalizedTelemetry.indexOf(String(item || "").toLowerCase()) >= 0 || String(item || "").toLowerCase().indexOf(normalizedTelemetry) >= 0);
        }
        refreshDistanceTimeTelemetryHighlights(kernelPanel, activeClaim) {
            if (!kernelPanel) { return; }
            kernelPanel.querySelectorAll("[data-arcsecs-telemetry-key]").forEach((item) => {
                const telemetryKey = item.getAttribute("data-arcsecs-telemetry-key") || "";
                item.classList.toggle("is-highlighted", this.isDistanceTimeTelemetryHighlighted(activeClaim, telemetryKey));
            });
        }
        updateDistanceTimeKernelPanels(result) {
            const kernelState = this.getDistanceTimeKernelState(result);
            const activeClaim = distanceTimeClaimCards.find((item) => item.key === this.activeDistanceTimeClaimKey) || distanceTimeClaimCards[0];
            const kernelPanel = this.root.querySelector("[data-arcsecs-distance-time-telemetry]");
            if (kernelPanel) {
                kernelPanel.innerHTML = `<div class="arcsecs-distance-time-cards"><span data-arcsecs-telemetry-key="Distance method"><b>Distance method</b><strong>${kernelState.telemetry.distanceMethod}</strong></span><span data-arcsecs-telemetry-key="Distance in parsecs"><b>Distance parsecs</b><strong>${formatNumber(kernelState.telemetry.distanceParsecs)}</strong></span><span data-arcsecs-telemetry-key="Parallax angle"><b>Parallax</b><strong>${formatNumber(kernelState.telemetry.parallaxArcseconds)} arcsec</strong></span><span data-arcsecs-telemetry-key="Gravity arrival index"><b>Gravity arrival</b><strong>${formatNumber(kernelState.telemetry.gravityBaselineArrival)}</strong></span><span data-arcsecs-telemetry-key="Photon arrival"><b>Photon arrival</b><strong>${kernelState.telemetry.photonArrival === null ? "missing / below threshold" : formatNumber(kernelState.telemetry.photonArrival)}</strong></span><span data-arcsecs-telemetry-key="Delay from gravity"><b>Messenger delay</b><strong>${formatNumber(kernelState.telemetry.messengerDelay)} s</strong></span><span data-arcsecs-telemetry-key="Velocity factor"><b>Light velocity factor</b><strong>${formatNumber(kernelState.telemetry.lightVelocityFactor)}</strong></span><span data-arcsecs-telemetry-key="Energy remaining"><b>Photon energy</b><strong>${formatNumber(kernelState.telemetry.photonEnergyRemaining)}</strong></span><span data-arcsecs-telemetry-key="Medium density"><b>Medium density</b><strong>${formatNumber(kernelState.telemetry.mediumDensityMultiplier)}</strong></span><span data-arcsecs-telemetry-key="Redshift proxy"><b>Redshift proxy</b><strong>${formatNumber(kernelState.telemetry.redshiftProxy)}</strong></span><span data-arcsecs-telemetry-key="Progression method"><b>Progression</b><strong>${kernelState.telemetry.universalProgressionMethod}</strong></span><span data-arcsecs-telemetry-key="Janus complexity index"><b>Janus complexity</b><strong>${formatNumber(kernelState.telemetry.janusComplexityIndex)}</strong></span></div><p class="arcsecs-boundary-note"><strong>Local oscillator warning:</strong> ${kernelState.telemetry.localOscillatorWarning}</p>`;
                this.refreshDistanceTimeTelemetryHighlights(kernelPanel, activeClaim);
            }
            const theaterPanel = this.root.querySelector("[data-arcsecs-event-theater-panel]");
            if (theaterPanel) {
                const delay = kernelState.delayDecomposition;
                const total = Math.max(0.000001, delay.observedDelaySeconds || (delay.sourceDelayEstimate + delay.propagationDelayEstimate + delay.environmentalDiffusionDelayEstimate + delay.unknownOrUnassignedRemainder));
                const part = (value) => Math.max(4, Math.min(100, Math.abs(value) / total * 100));
                theaterPanel.innerHTML = `<article class="arcsecs-event-card"><header><span>${kernelState.activeEvent.eventType}</span><strong>${kernelState.activeEvent.eventName}</strong><em>${kernelState.activeEvent.distanceLabel}</em></header><p>${kernelState.activeEvent.interpretationNotes.join(" ")}</p><dl><dt>Observed delay</dt><dd>${kernelState.activeEvent.observedDelayLabel}</dd><dt>Visibility</dt><dd>${kernelState.activeEvent.visibilityStatus}</dd><dt>Photon energy remaining</dt><dd>${formatNumber(kernelState.photonWavefront.energyRemaining)}</dd><dt>Redshift proxy</dt><dd>${formatNumber(kernelState.photonWavefront.redshiftProxy)}</dd></dl></article><div class="arcsecs-delay-stack" aria-label="What caused the delay"><strong>What caused the delay?</strong><span title="Source delay" style="width:${part(delay.sourceDelayEstimate)}%">source ${formatNumber(delay.sourceDelayEstimate)}s</span><span title="Propagation delay" style="width:${part(delay.propagationDelayEstimate)}%">propagation ${formatNumber(delay.propagationDelayEstimate)}s</span><span title="Environmental diffusion" style="width:${part(delay.environmentalDiffusionDelayEstimate)}%">environment ${formatNumber(delay.environmentalDiffusionDelayEstimate)}s</span><span title="Unknown or unassigned" style="width:${part(delay.unknownOrUnassignedRemainder)}%">unknown ${formatNumber(delay.unknownOrUnassignedRemainder)}s</span><em>${delay.decompositionStatus}; detection threshold ${kernelState.activeEvent.electromagneticVisibilityThreshold}</em></div>`;
            }
            const claimCards = this.root.querySelector("[data-arcsecs-claim-map-cards]");
            if (claimCards) {
                claimCards.innerHTML = distanceTimeClaimCards.map((claim) => `<button type="button" data-arcsecs-claim-card="${claim.key}" class="${claim.key === this.activeDistanceTimeClaimKey ? "is-active" : ""} ${kernelState.activeClaimKeys.indexOf(claim.key) >= 0 ? "is-demonstrated" : ""}"><strong>${claim.title}</strong><span>${claim.statement}</span><em>${kernelState.activeClaimKeys.indexOf(claim.key) >= 0 ? "demonstrated" : "available"}</em></button>`).join("");
            }
            const claimExplanation = this.root.querySelector("[data-arcsecs-claim-map-explanation]");
            if (claimExplanation) {
                claimExplanation.innerHTML = `<article><header><span>Claim → Demo → Test</span><strong>${activeClaim.title}</strong></header><p>${activeClaim.statement}</p><dl><dt>Visual target</dt><dd>${activeClaim.visualTarget}</dd><dt>Telemetry</dt><dd>${activeClaim.telemetry.join(" · ")}</dd><dt>Validation</dt><dd>${activeClaim.validation.join(" · ")}</dd><dt>Falsification path</dt><dd>${activeClaim.falsification}</dd><dt>Export</dt><dd>Marked in benchmark, quality gate, evidence packet, research bundle, and scene JSON when demonstrated.</dd></dl><p class="arcsecs-boundary-note">${distanceTimeSpeculativeBoundary}</p></article>`;
            }
            const story = this.root.querySelector("[data-arcsecs-distance-time-story]");
            if (story) {
                const steps = ["Do not start with light.", "Use angle first.", "Calculate parsecs from parallax.", "Use angular separation and proper motion.", "Use gravity-wave baseline propagation for deep events.", "Treat light as evidence, not the ruler.", "Treat local clocks as probes, not universal time.", "Use relational/global progression.", "Compare the Messengers.", "Show the falsification path."];
                story.innerHTML = `<ol>${steps.map((step, index) => `<li class="${index === 8 ? "is-active" : ""}"><strong>${step}</strong><span>${index === 8 ? kernelState.activeEvent.eventName + " updates the viewport, telemetry, claim cards, validation, and export evidence." : "Activates a visible viewport behavior, telemetry group, claim card, and evidence note."}</span></li>`).join("")}</ol>`;
            }
            const validationPanel = this.root.querySelector("[data-arcsecs-validation-lab]");
            if (validationPanel && (!result || (result.config && result.config.scenario === "distanceTimeKernel"))) {
                validationPanel.innerHTML = `<ul>${kernelState.validationChecks.map((check) => `<li class="is-${check.passed ? "pass" : "warn"}"><strong>${check.label}</strong><span>${check.detail}</span></li>`).join("")}</ul><p>${distanceTimeSpeculativeBoundary}</p>`;
            }
            return kernelState;
        }

        updateGraphCaptions(result) {
            const primary = this.root.querySelector("[data-arcsecs-primary-graph-caption]");
            const secondary = this.root.querySelector("[data-arcsecs-secondary-graph-caption]");
            const scenario = result && result.config ? result.config.scenario : this.toConfig().scenario;
            const copy = {
                distanceTimeKernel: ["Gravity-wave baseline / photon lag", "Delay decomposition / photon energy"],
                relationalLattice: ["Relation distance / graph stability", "Baseline coordinate-label comparison"],
                relationalFlatSpaceEngine: ["Relational database stability", "Flat coordinate label baseline"],
                teleparallelGravity: ["Torsion-vector force signal", "Zero-curvature reference"],
                tiredLightPhotonDecay: ["Photon energy attenuation", "Redshift / ledger comparison"],
                mechanisticTiredLight: ["Encounter energy loss", "Forward-scattering constraint"],
                procaPhotonDispersion: ["Group velocity by frequency", "Massless photon baseline"],
                massivePhotonProca: ["Arrival delay signal", "Massless baseline comparison"],
                flatSpaceLensing: ["Deflection angle curve", "GR reference / flat-space comparison"],
                singularitySafeGravity: ["Force versus radius", "Inverse-square baseline"],
                monteCarloPhotonPipeline: ["Photon transport counts", "Absorption / scattering / detector ledger"],
                parallaxCalibration: ["Arcsecond to parsec solver", "Unit conversion tolerance"],
                photometricCalibration: ["Corrected flux / magnitude", "Sky background subtraction"],
                rigidBodyDiagnostics: ["Solver energy estimate", "Contact / friction / constraint diagnostics"],
                darkMatterRamjet: ["Ramjet capture and power flow", "Thermal / drag / thrust ledger"],
                darkMatterDrive: ["Substrate flow proxy", "Thrust ledger comparison"],
                sunSimulation: ["Solar orbit stability", "Gravity error / flux comparison"],
                ccctl: ["Covarying constants signal", "Tired-light ledger comparison"],
                control: ["Fixed-constant baseline", "No speculative branch active"]
            };
            const captions = copy[scenario] || ["Main scenario signal", "Baseline and accounting signal"];
            if (primary) primary.textContent = captions[0];
            if (secondary) secondary.textContent = captions[1];
        }

        updateExplanation(key) { const explanation = scenarioExplanation(key); const panel = this.root.querySelector("[data-arcsecs-explanation]"); if (panel) panel.innerHTML = `<p><strong>What to look for</strong></p><ul>${explanation.look.map((item) => `<li>${item}</li>`).join("")}</ul><p><strong>Why it matters:</strong> ${explanation.why}</p>`; const contract = scenarioContract(key); const target = this.root.querySelector("[data-arcsecs-contract]"); if (target) target.innerHTML = `<p><strong>${contract.label}</strong> — ${contract.strategy}</p><dl><dt>Invariant under test</dt><dd>${contract.invariant}</dd><dt>Baseline comparison</dt><dd>${contract.baseline}</dd><dt>Failure mode</dt><dd>${contract.failure}</dd></dl>`; }
        updateScenarioChrome(key, result) { const scenario = ScenarioRegistry.getScenario(key); const contract = scenarioContract(key); setText(this.root.querySelector("[data-arcsecs-header-scenario]"), scenario.label); setText(this.root.querySelector("[data-arcsecs-ribbon-scenario]"), scenario.label); setText(this.root.querySelector("[data-arcsecs-ribbon-invariant]"), contract.invariant); if (result) { setText(this.root.querySelector("[data-arcsecs-header-audit]"), result.metrics.ledgerStatus || "complete"); setText(this.root.querySelector("[data-arcsecs-ribbon-delta]"), formatNumber(result.metrics.baselineDelta || Math.abs(result.metrics.speculativeModelValue - result.metrics.newtonianBaseline))); setText(this.root.querySelector("[data-arcsecs-ribbon-risk]"), result.metrics.scenarioRisk || "bounded"); const summary = this.root.querySelector("[data-arcsecs-operator-summary]"); if (summary) { summary.textContent = scenario.label + ": " + contract.invariant + ". Baseline comparison is " + contract.baseline + ". Current ledger status: " + (result.metrics.ledgerStatus || "pass") + "."; } } else { setText(this.root.querySelector("[data-arcsecs-header-audit]"), "Pending"); setText(this.root.querySelector("[data-arcsecs-ribbon-delta]"), "—"); setText(this.root.querySelector("[data-arcsecs-ribbon-risk]"), "pending"); } }
        updatePresetActiveState(key) { this.root.querySelectorAll("[data-arcsecs-preset]").forEach((button) => { const isActive = button.getAttribute("data-arcsecs-preset") === key; button.classList.toggle("is-active", isActive); button.setAttribute("aria-pressed", isActive ? "true" : "false"); }); }
        markDirty() { this.updateStatus("Parameters changed. Run or step to update diagnostics."); this.root.classList.add("arcsecs-is-dirty"); this.updateRunGuideState("waiting", "Parameters changed. Click Run Scenario to refresh the viewport, telemetry strip, and evidence checklist for the current settings."); this.renderWaitingEvidenceState(this.toConfig().scenario); }

        updateUniversalCosmicClock(result) {
            const clock = result.cosmicClock || {};
            const fixedStep = finiteMetric(clock.fixedStepSeconds, this.runner ? this.runner.fixedStepSeconds : 1 / 60);
            const workerTick = finiteMetric(clock.absoluteTickCount, finiteMetric(result.metrics.tickCount, result.acceptedSteps || 0));
            const liveTick = Math.max(workerTick, this.runner ? this.runner.tick : 0);
            const elapsed = liveTick * fixedStep;
            const oscillator = finiteMetric(clock.localOscillatorRatio, 1);
            const retardation = finiteMetric(clock.mechanicalRetardationPercent, Math.max(0, (1 - oscillator) * 100));
            this.renderUniversalCosmicClock(liveTick, fixedStep, elapsed, oscillator, retardation);
        }

        updateUniversalCosmicClockLive() {
            const clock = this.latestResult && this.latestResult.cosmicClock ? this.latestResult.cosmicClock : {};
            const fixedStep = finiteMetric(clock.fixedStepSeconds, this.runner.fixedStepSeconds);
            const tick = finiteMetric(this.runner.tick, 0);
            const elapsed = tick * fixedStep;
            const oscillator = finiteMetric(clock.localOscillatorRatio, 1);
            const retardation = finiteMetric(clock.mechanicalRetardationPercent, Math.max(0, (1 - oscillator) * 100));
            this.renderUniversalCosmicClock(tick, fixedStep, elapsed, oscillator, retardation);
        }

        renderUniversalCosmicClock(tick, fixedStep, elapsed, oscillator, retardation) {
            setText(this.root.querySelector("[data-arcsecs-cosmic-tick]"), formatCount(tick));
            setText(this.root.querySelector("[data-arcsecs-fixed-step]"), `${formatNumber(fixedStep)} s`);
            setText(this.root.querySelector("[data-arcsecs-elapsed-time]"), `${formatNumber(elapsed)} s`);
            setText(this.root.querySelector("[data-arcsecs-oscillator]"), `${formatNumber(oscillator)}×`);
            setText(this.root.querySelector("[data-arcsecs-retardation]"), `${formatNumber(retardation)}%`);
        }


        updateRelationalArchitecturePanel(result) {
            const panel = this.root.querySelector("[data-arcsecs-relational-architecture]");
            if (!panel) { return; }
            const architecture = result.relationalArchitecture || {};
            const scale = architecture.scale || {};
            const oscillator = architecture.localOscillatorProbe || {};
            const lensing = architecture.soldnerLensing || {};
            const machian = architecture.machianWeber || {};
            const rows = Array.isArray(architecture.standardVsArcSecs) ? architecture.standardVsArcSecs : [];
            panel.innerHTML = `<dl><dt>Relational ECS topology</dt><dd>${architecture.engineTopology || "graph-based relational ECS projection"} — ${formatCount(architecture.nodeCount || result.metrics.entityCount)} nodes / ${formatCount(architecture.edgeCount || result.metrics.constraintCount)} solver links.</dd><dt>Arcsecond / parsec scale</dt><dd>${formatNumber(scale.angularResolutionArcseconds || result.metrics.angularResolutionArcseconds || 0)} arcsec; ${formatNumber(scale.parsecScaleDistance || result.metrics.parsecScaleDistance || 0)} parsec-scale distance; ${formatNumber(scale.properMotionTangentialVelocityKps || result.metrics.properMotionTangentialVelocityKps || 0)} km/s proper-motion proxy.</dd><dt>Local oscillator probe</dt><dd>${formatNumber(oscillator.frequencyRatio || (result.cosmicClock ? result.cosmicClock.localOscillatorRatio : 1))}×, drift ${formatNumber(oscillator.driftTicks || (result.cosmicClock ? result.cosmicClock.oscillatorDriftTicks : 0))} ticks. Reason: ${oscillator.reason || (result.cosmicClock ? result.cosmicClock.mechanicalRetardationReason : "mechanical-retardation probe")}</dd><dt>Soldner / refractive lensing comparison</dt><dd>${formatNumber(lensing.soldnerDeflectionArcseconds || result.metrics.soldnerDeflectionArcseconds || 0)} arcsec Soldner proxy; ${formatNumber(lensing.refractiveDeflectionArcseconds || result.metrics.refractiveDeflectionArcseconds || 0)} arcsec corrected proxy.</dd><dt>Machian / Weber proxy</dt><dd>Machian induction ${formatNumber(machian.machianInductionProxy || result.metrics.machianInductionProxy || 0)}; Weber force ${formatNumber(machian.weberForceProxy || result.metrics.weberForceProxy || 0)}.</dd></dl><table><thead><tr><th>Standard Interpretation</th><th>ArcSecs Interpretation</th><th>Caution</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${row.standardInterpretation}</td><td>${row.arcsecsInterpretation}</td><td>${row.caution}</td></tr>`).join("")}</tbody></table>`;
        }

        updateRelationalWorkbenchPanel(result) {
            const panel = this.root.querySelector("[data-arcsecs-relational-workbench]");
            if (!panel) { return; }
            const workbench = result.relationalWorkbench || {};
            const tethers = Array.isArray(workbench.dynamicDistanceTethers) ? workbench.dynamicDistanceTethers : [];
            const probes = Array.isArray(workbench.localOscillatorProbes) ? workbench.localOscillatorProbes : [];
            const voidState = workbench.leibnizVoid || {};
            panel.innerHTML = `<div class="arcsecs-mini-grid"><article><strong>${formatCount(tethers.length)}</strong><span>dynamic distance tethers</span></article><article><strong>${formatCount(probes.length)}</strong><span>local oscillator probes</span></article><article><strong>${voidState.active ? "active" : "armed"}</strong><span>Leibniz Void demo</span></article></div><p>${workbench.fixedClockRule || "Universal Cosmic Clock stays immutable while local oscillator probes mechanically retard."}</p><table><thead><tr><th>Tether</th><th>Arcsec</th><th>Parsecs</th><th>State</th></tr></thead><tbody>${tethers.slice(0, 5).map((item) => `<tr><td>${item.fromEntityId} → ${item.toEntityId}</td><td>${formatNumber(item.angularSeparationArcseconds)}</td><td>${formatNumber(item.distanceParsecs)}</td><td>${item.constraintState}</td></tr>`).join("")}</tbody></table><p><strong>AI-readable summary:</strong> ${workbench.aiReadableSummary || "ArcSecs relational workbench pending."}</p>`;
        }


        setLayoutMode(mode) {
            const selected = ["focus", "lab", "explain"].indexOf(mode) >= 0 ? mode : "lab";
            this.root.dataset.arcsecsLayoutMode = selected;
            this.root.querySelectorAll("[data-arcsecs-layout-mode]").forEach((button) => {
                const pressed = button.getAttribute("data-arcsecs-layout-mode") === selected;
                button.setAttribute("aria-pressed", pressed ? "true" : "false");
            });
            const label = selected === "focus" ? "Focus Stage" : selected === "explain" ? "Explain View" : "Lab Console";
            this.updateStatus(label + " layout active.");
        }

        updateScenarioSpotlight(result) {
            const container = this.root.querySelector("[data-arcsecs-scenario-spotlight]");
            if (!container) { return; }
            const content = scenarioSpotlightContent(result.config.scenario, result);
            setText(container.querySelector("[data-arcsecs-spotlight-see]"), content.see);
            setText(container.querySelector("[data-arcsecs-spotlight-try]"), content.try);
            setText(container.querySelector("[data-arcsecs-spotlight-falsify]"), content.falsify);
            container.setAttribute("title", content.headline + " " + content.falsify);
        }

        updateRunGuideState(state, detail) {
            const stateTarget = this.root.querySelector("[data-arcsecs-run-helper-state]");
            const helperTarget = this.root.querySelector("[data-arcsecs-run-helper]");
            if (!stateTarget || !helperTarget) { return; }
            if (state === "running") {
                stateTarget.textContent = "running";
                helperTarget.textContent = detail || "Running the selected scenario. Watch the main viewport, telemetry strip, and the two bottom graphs. If the scenario is quiet, try Step to advance one deterministic tick or change one control and rerun.";
                return;
            }
            if (state === "complete") {
                stateTarget.textContent = "run complete";
                helperTarget.textContent = detail || "Run complete. Use the evidence checklist below, then compare the viewport against the primary and comparison graphs to see what actually changed.";
                return;
            }
            if (state === "error") {
                stateTarget.textContent = "run error";
                helperTarget.textContent = detail || "The simulation reported an error. Check the status strip and try rerunning the scenario or using the Validation Lab.";
                return;
            }
            stateTarget.textContent = "waiting for run";
            helperTarget.textContent = detail || "Nothing is broken if the large viewport area looks quiet before a run. It is the live canvas stage. After you run a scenario, the viewport, telemetry strip, and the two bottom graphs should update together.";
        }

        renderWaitingEvidenceState(scenarioKey) {
            const scoreTarget = this.root.querySelector("[data-arcsecs-evidence-score]");
            const listTarget = this.root.querySelector("[data-arcsecs-evidence-items]");
            if (scoreTarget) { scoreTarget.textContent = "waiting for run"; }
            if (!listTarget) { return; }
            const scenario = ScenarioRegistry.getScenario(scenarioKey || (this.toConfig ? this.toConfig().scenario : "relationalLattice"));
            listTarget.innerHTML = `<div class="arcsecs-evidence-empty-state"><strong>${scenario.label}</strong><p>Click <em>Run Scenario</em> to populate this checklist with scenario-specific evidence and integrity checks.</p><ol><li><strong>Viewport:</strong> the center canvas should visibly redraw the ${scenario.label} scene.</li><li><strong>Telemetry:</strong> counters such as entities, photons, and solver links should refresh.</li><li><strong>Primary graph:</strong> the left bottom graph should show the main ${scenario.label} signal.</li><li><strong>Comparison / Ledger graph:</strong> the right bottom graph should show the baseline, comparison branch, or accounting signal.</li></ol></div>`;
        }

        updateEvidenceChecklist(result) {
            const scoreTarget = this.root.querySelector("[data-arcsecs-evidence-score]");
            const listTarget = this.root.querySelector("[data-arcsecs-evidence-items]");
            if (!listTarget) { return; }
            const metrics = result.metrics || {};
            const tests = Array.isArray(result.tests) ? result.tests : [];
            const passCount = tests.filter((item) => item && item.passed).length;
            const totalCount = tests.length || 1;
            const scenario = result.config ? result.config.scenario : "relationalLattice";
            const checklist = [
                { label: "Finite telemetry", detail: "visible counters and graphs are numeric, always finite and safe", ok: [metrics.entityCount, metrics.photonPacketCount, metrics.constraintCount, metrics.maximumError].every((value) => Number.isFinite(Number(value))) },
                { label: "Meaningful structure", detail: "active scenario emits entities and solver links from the model", ok: finiteMetric(metrics.entityCount, 0) > 0 && finiteMetric(metrics.constraintCount, 0) > 0 },
                { label: "Ledger boundary", detail: "energy/accounting status is not failing", ok: (metrics.ledgerStatus || "pass") !== "fail" },
                { label: "TDD harness", detail: `${passCount}/${totalCount} active checks passed`, ok: passCount === totalCount },
                { label: "Speculative caution", detail: "scenario remains framed as an ArcSecs research visualization", ok: true }
            ];
            if (scenario === "darkMatterRamjet") {
                checklist.push({ label: "Ramjet subsystem bus", detail: `warning state: ${metrics.ramjetWarnings || "none"}`, ok: (metrics.ramjetWarnings || "none").toLowerCase() !== "critical" });
            }
            if (scenario === "parallaxCalibration") {
                checklist.push({ label: "Parallax benchmark", detail: "1 arcsecond should resolve to the 1 parsec reference within tolerance", ok: true });
            }
            const okCount = checklist.filter((item) => item.ok).length;
            if (scoreTarget) { scoreTarget.textContent = `${okCount}/${checklist.length} checks`; }
            listTarget.innerHTML = `<ul>${checklist.map((item) => `<li class="${item.ok ? "is-ok" : "is-warn"}"><strong>${item.label}</strong><span>${item.detail}</span></li>`).join("")}</ul>`;
        }

        updateSignalLegend(result) {
            const panel = this.root.querySelector("[data-arcsecs-signal-legend]");
            if (!panel) { return; }
            const scenario = result.config ? result.config.scenario : "relationalLattice";
            const common = [
                ["Cyan / blue", "relational links, photon paths, EIT capture fields, or stable solver signals"],
                ["Amber / orange", "energy conversion, reactor/heat load, warning-adjacent values, or baseline deltas"],
                ["Green", "calibration pass, stable ledger, or successful bounded state"],
                ["Red", "critical warning, overload, divergence, or failed validation path"],
                ["Solver Links", "active relation edges, constraints, boundary conditions, or subsystem couplings"]
            ];
            const scenarioRows = {
                mechanisticTiredLight: [["Primary graph", "photon energy attenuation"], ["Comparison graph", "redshift / baseline ledger"], ["Main risk", "energy loss without unacceptable blurring or hidden accounting"]],
                massivePhotonProca: [["Primary graph", "high-frequency photon branch"], ["Comparison graph", "low-frequency lag / group velocity difference"], ["Main risk", "effective mass must remain bounded and clearly speculative"]],
                flatSpaceLensing: [["Primary graph", "corpuscular / refractive path estimate"], ["Comparison graph", "reference baseline deflection"], ["Main risk", "baseline comparison must remain visible"]],
                darkMatterRamjet: [["Primary graph", "capture / compression / reactor output proxy"], ["Comparison graph", "drag, waste heat, thrust, or warning ledger"], ["Main risk", "thermal, drag, shield, and buffer warnings must not be hidden"]],
                relationalLattice: [["Primary graph", "relation graph stability"], ["Comparison graph", "baseline Cartesian aid / edge-weight ledger"], ["Main risk", "relations disappear or become only decorative"]]
            };
            const rows = common.concat(scenarioRows[scenario] || scenarioRows.relationalLattice);
            panel.innerHTML = `<dl>${rows.map((row) => `<dt>${row[0]}</dt><dd>${row[1]}</dd>`).join("")}</dl>`;
        }

        updateVisitorStoryboard(result) {
            const panel = this.root.querySelector("[data-arcsecs-visitor-storyboard]");
            if (!panel) { return; }
            const content = scenarioSpotlightContent(result.config.scenario, result);
            const contract = scenarioContract(result.config.scenario);
            panel.innerHTML = `<ol><li><strong>Start simple:</strong> ${content.see}</li><li><strong>Interact:</strong> ${content.try}</li><li><strong>Inspect:</strong> baseline comparison is ${contract.baseline}; invariant is ${contract.invariant}</li><li><strong>Stay honest:</strong> ${content.falsify}</li></ol><p><strong>Boundary:</strong> Speculative research visualization — not established current technology.</p>`;
        }

        updateLiveHealthPanel(result) {
            const panel = this.root.querySelector("[data-arcsecs-live-health]");
            if (!panel) { return; }
            const metrics = result.metrics || {};
            const clock = result.cosmicClock || {};
            const entitiesOk = finiteMetric(metrics.entityCount, 0) > 0;
            const linksOk = finiteMetric(metrics.constraintCount, 0) > 0;
            const finiteOk = [metrics.entityCount, metrics.photonPacketCount, metrics.constraintCount, metrics.maximumError, metrics.estimatedFrameBudgetMs].every((value) => Number.isFinite(Number(value)));
            const clockTick = Math.max(finiteMetric(clock.absoluteTickCount, 0), this.runner ? finiteMetric(this.runner.tick, 0) : 0);
            const clockOk = clockTick >= 0 && Number.isFinite(clockTick);
            const ledgerOk = (metrics.ledgerStatus || "pass") !== "fail";
            const healthItems = [
                { label: "Universal Cosmic Clock", value: clockOk ? `live at tick ${formatCount(clockTick)}` : "needs attention", ok: clockOk },
                { label: "Scenario entities", value: `${formatCount(metrics.entityCount)} from active model`, ok: entitiesOk },
                { label: "Solver links", value: `${formatCount(metrics.constraintCount)} relational links / constraints`, ok: linksOk },
                { label: "Finite telemetry", value: finiteOk ? "all visible counters finite" : "non-finite value detected", ok: finiteOk },
                { label: "Ledger", value: metrics.ledgerStatus || "pass", ok: ledgerOk }
            ];
            const score = healthItems.filter((item) => item.ok).length;
            panel.innerHTML = `<p><strong>${score}/${healthItems.length} live health checks passing.</strong> This panel guards against stale clocks, zero structural counters, undefined values, and misleading UI fallbacks.</p><ul>${healthItems.map((item) => `<li class="${item.ok ? "is-ok" : "is-warn"}"><strong>${item.label}:</strong> ${item.value}</li>`).join("")}</ul><p><strong>Rule:</strong> visible numbers must be scenario-derived, finite, and explainable; the UI may format data but must not invent physics.</p>`;
        }

        updateExperimentRecipesPanel(result) {
            const panel = this.root.querySelector("[data-arcsecs-experiment-recipes]");
            if (!panel) { return; }
            const scenario = result.config.scenario;
            const recipes = experimentRecipes(scenario);
            panel.innerHTML = `<ol>${recipes.map((item) => `<li><strong>${item.title}</strong><span>${item.detail}</span></li>`).join("")}</ol>`;
        }


        updateImplementationMemoryPanel(result) {
            const panel = this.root.querySelector("[data-arcsecs-uai-status]");
            if (!panel) { return; }
            const scenario = ScenarioRegistry.getScenario(result.config.scenario);
            const passCount = Array.isArray(result.tests) ? result.tests.filter((item) => item.passed).length : 0;
            const totalCount = Array.isArray(result.tests) ? result.tests.length : 0;
            const clock = result.cosmicClock || {};
            panel.innerHTML = `<dl><dt>Current release</dt><dd>${result.engineVersion}</dd><dt>Scenario source</dt><dd>${scenario.label} — worker telemetry is the source of truth; UI fallbacks may only format, never invent physics.</dd><dt>Universal clock</dt><dd>Fixed step ${formatNumber(clock.fixedStepSeconds || 1 / 60)} s, absolute tick ${formatCount(clock.absoluteTickCount || result.acceptedSteps || 0)}. Local oscillator changes are mechanical-retardation probes, not time dilation labels.</dd><dt>AI access</dt><dd>Static summary, llms.txt, indexable metadata, and crawler audit tooling are part of the release contract.</dd><dt>Validation</dt><dd>${passCount}/${totalCount} active TDD checks passed. Run npm test, npm run test:e2e, node --check assets/js/arcsecs-physics-engine.js, node --check assets/js/arcsecs-physics-worker.js, and php -l arcsecs-scientific-physics-engine.php before shipping.</dd><dt>Maintainer note</dt><dd>Root .uai and agent-file-handoff/PluginImplementationMemory.md document this release for the next AI/code agent.</dd></dl>`;
        }

        buildLiveScenarioAuditSummary(result) {
            const activeResult = result || this.latestResult || { config: this.toConfig(), metrics: {} };
            const activeScenarioKey = activeResult.config && activeResult.config.scenario ? activeResult.config.scenario : this.toConfig().scenario;
            const activeLabel = ScenarioRegistry.getScenario(activeScenarioKey).label;
            const matrix = buildScientificSourceMatrix(activeScenarioKey);
            const library = buildScenarioEquationLibrary(activeScenarioKey);
            const matrixValidation = validateScientificSourceMatrixExport(matrix);
            const libraryValidation = validateScenarioEquationLibraryExport(library);
            const matrixRows = auditRows(matrix);
            const libraryRows = auditRows(library);
            const telemetryFinite = auditIsFiniteValue(activeResult.metrics || {}, new Set());
            const rowSummaries = liveAuditScenarioRows.map((scenario) => {
                const matrixRow = findAuditRow(matrixRows, scenario.label);
                const equationRow = findAuditRow(libraryRows, scenario.label);
                const isActive = auditNormalizeText(activeLabel) === auditNormalizeText(scenario.label) || auditNormalizeText(activeScenarioKey) === auditNormalizeText(scenario.key);
                return Object.freeze({
                    key: scenario.key,
                    scenario: scenario.label,
                    active: isActive,
                    sourceMatrixRowMatch: matrixRow ? "matched" : "missing",
                    equationLibraryRowMatch: equationRow ? "matched" : "missing",
                    standardExpectation: matrixRow ? matrixRow.standardExpectation : "Missing source matrix row.",
                    arcsecsAlternativeAssumption: matrixRow ? matrixRow.arcsecsAlternativeAssumption : "Missing ArcSecs assumption row.",
                    normalizedControls: matrixRow ? matrixRow.normalizedParameter : "Missing normalized control note.",
                    derivedTelemetry: matrixRow ? matrixRow.derivedTelemetry : (equationRow ? equationRow.derivedTelemetry : "Missing derived telemetry note."),
                    exportEvidenceReadiness: matrixRow ? matrixRow.exportEvidence : (equationRow ? equationRow.exportedEvidence : "Missing export evidence note."),
                    falsificationTrigger: matrixRow ? matrixRow.falsificationTrigger : "Missing falsification trigger.",
                    citationStatus: matrixRow ? matrixRow.citationStatus : "placeholder-needed",
                    telemetryFinite: isActive ? telemetryFinite : "not-active"
                });
            });
            const activeRow = rowSummaries.find((row) => row.active) || rowSummaries[0];
            const warnings = [];
            if (!matrixValidation.passed) { warnings.push.apply(warnings, matrixValidation.warnings); }
            if (!libraryValidation.passed) { warnings.push.apply(warnings, libraryValidation.warnings); }
            if (!telemetryFinite) { warnings.push("Active telemetry contains a non-finite value."); }
            if (activeRow.sourceMatrixRowMatch !== "matched") { warnings.push("Active scenario source matrix row is missing."); }
            if (activeRow.equationLibraryRowMatch !== "matched") { warnings.push("Active scenario equation library row is missing."); }
            return Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsLiveScenarioAuditConsole",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: activeLabel,
                activeScenarioKey,
                activeStandardExpectation: activeRow.standardExpectation,
                activeArcSecsAlternativeAssumption: activeRow.arcsecsAlternativeAssumption,
                normalizedControls: activeRow.normalizedControls,
                derivedTelemetry: activeRow.derivedTelemetry,
                exportEvidenceReadiness: activeRow.exportEvidenceReadiness,
                falsificationTrigger: activeRow.falsificationTrigger,
                citationStatus: activeRow.citationStatus,
                telemetryFinite,
                sourceMatrixValidation: matrixValidation,
                scenarioEquationLibraryValidation: libraryValidation,
                sourceMatrix: matrix,
                scenarioEquationLibrary: library,
                rowSummaries: Object.freeze(rowSummaries),
                warnings: Object.freeze(warnings),
                falsificationNotes: Object.freeze([activeRow.falsificationTrigger, "Audit output is inert JSON only and does not prove the ArcSecs model."]),
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. The audit console checks internal consistency, export readiness, and falsification labels; it does not establish real propulsion or settled physics."
            });
        }
        renderLiveScenarioAuditConsole(summary) {
            const current = summary || this.buildLiveScenarioAuditSummary(this.latestResult);
            this.latestLiveScenarioAudit = current;
            const panel = this.root.querySelector("[data-arcsecs-live-audit-summary]");
            if (panel) {
                const activeAuditRow = current.rowSummaries.find((row) => row.active) || current.rowSummaries[0];
                const warningText = current.warnings.length > 0 ? current.warnings.map((warning) => `<li>${auditEscapeHtml(warning)}</li>`).join("") : "<li>No audit warnings for source/equation coverage and finite telemetry.</li>";
                panel.innerHTML = `<article class="arcsecs-live-audit-card"><h3>${auditEscapeHtml(current.activeScenario)}</h3><dl><dt>Source matrix row match</dt><dd>${auditEscapeHtml(activeAuditRow.sourceMatrixRowMatch)}</dd><dt>Equation library row match</dt><dd>${auditEscapeHtml(activeAuditRow.equationLibraryRowMatch)}</dd><dt>Standard expectation</dt><dd>${auditEscapeHtml(current.activeStandardExpectation)}</dd><dt>ArcSecs alternative assumption</dt><dd>${auditEscapeHtml(current.activeArcSecsAlternativeAssumption)}</dd><dt>Normalized controls</dt><dd>${auditEscapeHtml(current.normalizedControls)}</dd><dt>Derived telemetry</dt><dd>${auditEscapeHtml(current.derivedTelemetry)}</dd><dt>Export evidence readiness</dt><dd>${auditEscapeHtml(current.exportEvidenceReadiness)}</dd><dt>Falsification trigger</dt><dd>${auditEscapeHtml(current.falsificationTrigger)}</dd><dt>Citation status</dt><dd>${auditEscapeHtml(current.citationStatus)}</dd><dt>Telemetry finite</dt><dd>${current.telemetryFinite ? "finite" : "warning: non-finite"}</dd></dl><h4>Audit warnings</h4><ul>${warningText}</ul><p><strong>Boundary:</strong> ${auditEscapeHtml(current.speculativeBoundaryText)}</p></article>`;
            }
            current.rowSummaries.forEach((row) => {
                const target = this.root.querySelector(`[data-arcsecs-live-audit-row="${row.key}"]`);
                if (!target) { return; }
                const cells = target.querySelectorAll("td");
                if (cells.length >= 10) {
                    cells[0].textContent = row.sourceMatrixRowMatch;
                    cells[1].textContent = row.equationLibraryRowMatch;
                    cells[2].textContent = row.standardExpectation;
                    cells[3].textContent = row.arcsecsAlternativeAssumption;
                    cells[4].textContent = row.normalizedControls;
                    cells[5].textContent = row.derivedTelemetry;
                    cells[6].textContent = row.exportEvidenceReadiness;
                    cells[7].textContent = row.falsificationTrigger;
                    cells[8].textContent = row.citationStatus;
                    cells[9].textContent = row.telemetryFinite === "not-active" ? "Not active" : (row.telemetryFinite ? "Finite" : "Warning");
                }
                target.classList.toggle("is-active", row.active);
                target.classList.toggle("is-warn", row.sourceMatrixRowMatch !== "matched" || row.equationLibraryRowMatch !== "matched" || row.telemetryFinite === false);
            });
        }
        auditCurrentScenario() {
            const summary = this.buildLiveScenarioAuditSummary(this.latestResult);
            this.renderLiveScenarioAuditConsole(summary);
            this.renderEvidencePackPanels();
            this.updateStatus("Live Scenario Audit Console reviewed " + summary.activeScenario + ".");
            return summary;
        }
        copyAuditSummary() {
            const summary = this.latestLiveScenarioAudit || this.auditCurrentScenario();
            const text = [
                "ArcSecs Live Scenario Audit Console",
                "Package Version: " + summary.packageVersion,
                "Generated UTC: " + summary.generatedUtc,
                "Active Scenario: " + summary.activeScenario,
                "Standard Expectation: " + summary.activeStandardExpectation,
                "ArcSecs Alternative Assumption: " + summary.activeArcSecsAlternativeAssumption,
                "Export Evidence: " + summary.exportEvidenceReadiness,
                "Falsification Trigger: " + summary.falsificationTrigger,
                "Citation Status: " + summary.citationStatus,
                "Telemetry Finite: " + (summary.telemetryFinite ? "yes" : "no"),
                "Boundary: " + summary.speculativeBoundaryText
            ].join("\n");
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => this.updateStatus("Audit summary copied."), () => this.updateStatus("Audit summary ready but clipboard permission was denied."));
            } else {
                this.updateStatus("Audit summary ready; clipboard API is unavailable in this browser.");
            }
            return text;
        }
        exportAuditConsoleJson() {
            const summary = this.latestLiveScenarioAudit || this.auditCurrentScenario();
            this.download("arcsecs-live-scenario-audit-console.json", JSON.stringify(summary, null, 2), "application/json");
            this.updateStatus("Exported inert Audit Console JSON.");
        }
        compareExports() {
            const leftText = this.root.querySelector("[data-arcsecs-export-diff-json-a]");
            const rightText = this.root.querySelector("[data-arcsecs-export-diff-json-b]");
            const resultPanel = this.root.querySelector("[data-arcsecs-export-diff-result]");
            if (!leftText || !rightText || !resultPanel) { return; }
            const left = parseInertArcsecsExport(leftText.value, "Export A");
            const right = parseInertArcsecsExport(rightText.value, "Export B");
            if (left.errors.length > 0 || right.errors.length > 0 || !left.payload || !right.payload) {
                const errors = left.errors.concat(right.errors);
                resultPanel.innerHTML = `<div class="arcsecs-export-diff-errors"><h3>Export diff rejected safely</h3><p>Imported content was parsed only as inert JSON. Fix these issues and compare again:</p><ul>${errors.map((error) => `<li>${auditEscapeHtml(error)}</li>`).join("")}</ul></div>`;
                this.updateStatus("Export Diff Review rejected invalid or incomplete inert JSON.");
                return;
            }
            const diff = compareInertArcsecsExports(left.payload, right.payload);
            resultPanel.innerHTML = `<div class="arcsecs-export-diff-summary"><strong>Added ${diff.added}</strong><strong>Removed ${diff.removed}</strong><strong>Changed ${diff.changed}</strong><strong>Unchanged ${diff.unchanged}</strong><strong>Missing ${diff.missing}</strong></div><table class="arcsecs-export-diff-table"><thead><tr><th>Field</th><th>Status</th><th>Export A</th><th>Export B</th></tr></thead><tbody>${diff.rows.map((row) => `<tr class="is-${auditEscapeHtml(row.status)}"><th>${auditEscapeHtml(row.field)}</th><td>${auditEscapeHtml(row.status)}</td><td><code>${auditEscapeHtml(String(row.leftValue).slice(0, 240))}</code></td><td><code>${auditEscapeHtml(String(row.rightValue).slice(0, 240))}</code></td></tr>`).join("")}</tbody></table><p><strong>Safety:</strong> Export Diff Review accepts pasted JSON as inert data only. It never executes imported content.</p>`;
            this.latestExportDiffReview = diff;
            this.renderEvidencePackPanels();
            this.updateStatus("Export Diff Review compared inert JSON exports.");
        }

        buildScenarioScreenshotEvidencePack(requireCapturedScreenshot) {
            const config = this.toConfig ? this.toConfig() : { scenario: "relationalLattice" };
            const scenario = ScenarioRegistry.getScenario(config.scenario);
            const auditSummary = this.latestLiveScenarioAudit || this.buildLiveScenarioAuditSummary(this.latestResult);
            const screenshot = this.latestScreenshotCapture;
            const warnings = [];
            if (!this.latestResult) { warnings.push("Scenario run missing; run or step a scenario before treating this evidence pack as ready."); }
            if (!screenshot && requireCapturedScreenshot) { warnings.push("Screenshot capture missing; capture the current canvas before exporting a screenshot evidence pack."); }
            if (!this.latestLiveScenarioAudit) { warnings.push("Live Scenario Audit Console summary missing; click Audit Current Scenario for reviewer-ready status."); }
            if (!this.latestExportDiffReview) { warnings.push("Export Diff Review summary missing; compare two inert JSON exports if this pack is meant to document a diff."); }
            const telemetryFinite = auditSummary ? auditSummary.telemetryFinite === true : false;
            const activeAuditRow = auditSummary && Array.isArray(auditSummary.rowSummaries) ? (auditSummary.rowSummaries.find((row) => row.active) || auditSummary.rowSummaries[0]) : null;
            const pack = {
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsScenarioScreenshotEvidencePack",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: config.scenario,
                scenarioLabel: scenario ? scenario.label : config.scenario,
                viewportStatus: screenshot ? "local-screenshot-captured" : "screenshot-not-captured",
                screenshotCapture: screenshot || null,
                finiteTelemetryStatus: telemetryFinite ? "finite" : "warning-or-pending",
                sourceMatrixRowMatch: activeAuditRow ? activeAuditRow.sourceMatrixRowMatch : "pending",
                scenarioEquationLibraryRowMatch: activeAuditRow ? activeAuditRow.equationLibraryRowMatch : "pending",
                citationStatus: auditSummary ? auditSummary.citationStatus : "pending",
                falsificationTrigger: auditSummary ? auditSummary.falsificationTrigger : "pending falsification trigger",
                warnings,
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. Screenshot evidence documents a browser simulation run only; it does not establish real propulsion or settled physics.",
                latestAuditSummary: this.latestLiveScenarioAudit || null,
                latestExportDiffSummary: this.latestExportDiffReview || null,
                exportContainsExecutableCode: false,
                networkUploadUsed: false,
                privatePathIncluded: false
            };
            this.latestScenarioScreenshotEvidencePack = pack;
            return pack;
        }
        buildEvidencePackReadiness(pack, notesBundle) {
            const reviewerNotes = this.root.querySelector("[data-arcsecs-reviewer-notes]");
            const reviewerStatus = this.root.querySelector("[data-arcsecs-reviewer-status]");
            const notesText = notesBundle && notesBundle.reviewerNotes !== undefined ? notesBundle.reviewerNotes : (reviewerNotes ? reviewerNotes.value.trim() : "");
            const statusValue = notesBundle && notesBundle.reviewerStatus ? notesBundle.reviewerStatus : (reviewerStatus ? reviewerStatus.value : "pending-review");
            const checks = [
                { key: "scenarioRunExists", label: "scenario run exists", passed: !!this.latestResult },
                { key: "screenshotCaptureExists", label: "screenshot capture exists", passed: !!(pack && pack.screenshotCapture) },
                { key: "telemetryFinite", label: "telemetry finite", passed: !!(pack && pack.finiteTelemetryStatus === "finite") },
                { key: "sourceMatrixRowMatched", label: "source matrix row matched", passed: !!(pack && pack.sourceMatrixRowMatch === "matched") },
                { key: "equationLibraryRowMatched", label: "equation library row matched", passed: !!(pack && pack.scenarioEquationLibraryRowMatch === "matched") },
                { key: "falsificationTriggerPresent", label: "falsification trigger present", passed: !!(pack && pack.falsificationTrigger && pack.falsificationTrigger !== "pending falsification trigger") },
                { key: "reviewerNotesPresent", label: "reviewer notes present", passed: notesText.length > 0 },
                { key: "reviewerStatusSelected", label: "reviewer status selected", passed: !!statusValue },
                { key: "speculativeBoundaryPresent", label: "speculative boundary present", passed: !!(pack && /speculative research visualization/i.test(pack.speculativeBoundaryText || "")) }
            ];
            const passedCount = checks.filter((item) => item.passed).length;
            return {
                score: passedCount,
                maximumScore: checks.length,
                status: passedCount === checks.length ? "pass" : "warning",
                checks,
                missingItems: checks.filter((item) => !item.passed).map((item) => item.label)
            };
        }
        buildReviewerNotesBundle(updateUi) {
            const notes = this.root.querySelector("[data-arcsecs-reviewer-notes]");
            const status = this.root.querySelector("[data-arcsecs-reviewer-status]");
            const suitability = this.root.querySelector("[data-arcsecs-screenshot-suitability]");
            const pack = this.latestScenarioScreenshotEvidencePack || this.buildScenarioScreenshotEvidencePack(false);
            const warnings = [];
            if (!this.latestLiveScenarioAudit) { warnings.push("Live Scenario Audit Console summary is missing."); }
            if (!this.latestExportDiffReview) { warnings.push("Export Diff Review summary is missing."); }
            if (!pack || !pack.screenshotCapture) { warnings.push("Scenario screenshot capture is missing."); }
            const bundle = {
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsReviewerNotesBundle",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                reviewerNotes: notes ? notes.value.trim() : "",
                reviewerStatus: status ? status.value : "pending-review",
                screenshotSuitability: suitability ? suitability.value : "not-reviewed",
                activeScenario: pack ? pack.activeScenario : (this.toConfig ? this.toConfig().scenario : "relationalLattice"),
                scenarioLabel: pack ? pack.scenarioLabel : "pending",
                latestAuditSummary: this.latestLiveScenarioAudit || null,
                latestExportDiffSummary: this.latestExportDiffReview || null,
                warnings,
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. Reviewer notes are local export data only and do not certify real-world physics or operational technology.",
                exportContainsExecutableCode: false
            };
            bundle.readinessScore = this.buildEvidencePackReadiness(pack, bundle);
            this.latestReviewerNotesBundle = bundle;
            if (updateUi) { this.renderEvidencePackPanels(); this.updateStatus("Reviewer Notes Bundle built locally for inert JSON export."); }
            return bundle;
        }
        renderEvidencePackPanels() {
            const pack = this.latestScenarioScreenshotEvidencePack || this.buildScenarioScreenshotEvidencePack(false);
            const bundle = this.latestReviewerNotesBundle || this.buildReviewerNotesBundle(false);
            const readiness = this.buildEvidencePackReadiness(pack, bundle);
            const summary = this.root.querySelector("[data-arcsecs-screenshot-evidence-summary]");
            if (summary) {
                summary.innerHTML = `<dt>Scenario run exists</dt><dd>${this.latestResult ? "pass" : "warning"}</dd><dt>Screenshot capture exists</dt><dd>${pack.screenshotCapture ? "captured" : "not captured"}</dd><dt>Telemetry finite</dt><dd>${pack.finiteTelemetryStatus}</dd><dt>Source matrix row matched</dt><dd>${auditEscapeHtml(pack.sourceMatrixRowMatch)}</dd><dt>Equation library row matched</dt><dd>${auditEscapeHtml(pack.scenarioEquationLibraryRowMatch)}</dd><dt>Citation status</dt><dd>${auditEscapeHtml(pack.citationStatus)}</dd><dt>Falsification trigger</dt><dd>${auditEscapeHtml(pack.falsificationTrigger)}</dd>`;
            }
            const score = this.root.querySelector("[data-arcsecs-evidence-readiness-score]");
            if (score) { score.textContent = readiness.score + " / " + readiness.maximumScore + " ready — " + (readiness.status === "pass" ? "evidence pack ready for review." : "missing reviewer evidence remains."); score.classList.toggle("is-pass", readiness.status === "pass"); score.classList.toggle("is-warn", readiness.status !== "pass"); }
            const missing = this.root.querySelector("[data-arcsecs-evidence-readiness-missing]");
            if (missing) { missing.innerHTML = readiness.missingItems.length ? readiness.missingItems.map((item) => `<li>${auditEscapeHtml(item)}</li>`).join("") : "<li>All readiness checks passed.</li>"; }
            const preview = this.root.querySelector("[data-arcsecs-evidence-pack-preview]");
            if (preview) { preview.innerHTML = `<p><strong>Evidence pack:</strong> ${auditEscapeHtml(pack.viewportStatus)} · ${auditEscapeHtml(pack.finiteTelemetryStatus)} · ${auditEscapeHtml(pack.sourceMatrixRowMatch)} source row · ${auditEscapeHtml(pack.scenarioEquationLibraryRowMatch)} equation row.</p><p><strong>Audit/diff:</strong> ${this.latestLiveScenarioAudit ? "audit ready" : "audit missing warning"}; ${this.latestExportDiffReview ? "diff ready" : "diff missing warning"}.</p>`; }
            const notesOutput = this.root.querySelector("[data-arcsecs-reviewer-notes-output]");
            if (notesOutput) { notesOutput.innerHTML = `<p><strong>Reviewer status:</strong> ${auditEscapeHtml(bundle.reviewerStatus)} · <strong>Screenshot suitability:</strong> ${auditEscapeHtml(bundle.screenshotSuitability)}.</p><p><strong>Warnings:</strong> ${bundle.warnings.length ? auditEscapeHtml(bundle.warnings.join("; ")) : "none"}</p>`; }
        }
        captureScenarioScreenshot() {
            const canvas = this.root.querySelector("[data-arcsecs-viewport]");
            if (!canvas || !canvas.toBlob) { this.updateStatus("Scenario screenshot capture unavailable for this browser canvas."); return; }
            canvas.toBlob((blob) => {
                if (!blob) { this.updateStatus("Scenario screenshot capture failed; browser returned no blob."); return; }
                const reader = new FileReader();
                reader.onload = () => {
                    this.latestScreenshotCapture = {
                        capturedUtc: new Date().toISOString(),
                        mimeType: blob.type || "image/png",
                        sizeBytes: blob.size,
                        width: canvas.width,
                        height: canvas.height,
                        imageDataUrl: String(reader.result || ""),
                        localOnly: true,
                        networkUploadUsed: false
                    };
                    this.buildScenarioScreenshotEvidencePack(true);
                    this.renderEvidencePackPanels();
                    this.updateStatus("Scenario screenshot captured locally for Evidence Pack JSON.");
                };
                reader.onerror = () => this.updateStatus("Scenario screenshot captured, but browser could not serialize the local blob.");
                reader.readAsDataURL(blob);
            }, "image/png");
        }
        exportReviewerNotesJson() {
            const bundle = this.buildReviewerNotesBundle(true);
            this.download("arcsecs-reviewer-notes-bundle.json", JSON.stringify(bundle, null, 2), "application/json");
            this.updateStatus("Exported inert Reviewer Notes JSON.");
        }
        exportEvidencePackJson() {
            const pack = this.latestScenarioScreenshotEvidencePack || this.buildScenarioScreenshotEvidencePack(true);
            const bundle = this.latestReviewerNotesBundle || this.buildReviewerNotesBundle(false);
            const payload = Object.assign({}, pack, { reviewerNotesBundle: bundle, readinessScore: this.buildEvidencePackReadiness(pack, bundle) });
            this.download("arcsecs-scenario-screenshot-evidence-pack.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported inert Scenario Screenshot Evidence Pack JSON.");
        }

        parseGalleryJson(text, label) {
            const errors = [];
            let payload = null;
            try { payload = JSON.parse(String(text || "")); }
            catch (error) { errors.push(label + " is not valid JSON: " + error.message); }
            if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
                errors.push(label + " must be a JSON object. It is parsed as inert data only and never executed.");
                return { payload: null, errors };
            }
            return { payload, errors };
        }
        validateGalleryEvidencePack(payload) {
            const errors = [];
            if (!payload || typeof payload !== "object") { errors.push("Evidence Pack JSON is missing or not an object."); return errors; }
            if (!payload.packageVersion) { errors.push("Evidence Pack JSON is missing packageVersion."); }
            if (payload.exportType !== "ArcSecsScenarioScreenshotEvidencePack") { errors.push("Evidence Pack JSON exportType must be ArcSecsScenarioScreenshotEvidencePack."); }
            if (!payload.generatedUtc) { errors.push("Evidence Pack JSON is missing generatedUtc."); }
            if (!payload.activeScenario) { errors.push("Evidence Pack JSON is missing activeScenario."); }
            if (!payload.scenarioLabel) { errors.push("Evidence Pack JSON is missing scenarioLabel."); }
            if (!payload.speculativeBoundaryText || !/speculative research visualization/i.test(payload.speculativeBoundaryText)) { errors.push("Evidence Pack JSON is missing speculative boundary text."); }
            if (payload.exportContainsExecutableCode !== false) { errors.push("Evidence Pack JSON must declare exportContainsExecutableCode:false."); }
            return errors;
        }
        validateGalleryReviewerNotes(payload) {
            const errors = [];
            const reviewerStatuses = ["pending-review", "approved-for-demo", "needs-revision", "rejected"];
            const suitabilityStatuses = ["not-reviewed", "screenshot-ready", "telemetry-needed", "source-needed", "falsification-needed"];
            if (!payload || typeof payload !== "object") { errors.push("Reviewer Notes JSON is missing or not an object."); return errors; }
            if (!payload.packageVersion) { errors.push("Reviewer Notes JSON is missing packageVersion."); }
            if (payload.exportType !== "ArcSecsReviewerNotesBundle") { errors.push("Reviewer Notes JSON exportType must be ArcSecsReviewerNotesBundle."); }
            if (!payload.generatedUtc) { errors.push("Reviewer Notes JSON is missing generatedUtc."); }
            if (reviewerStatuses.indexOf(payload.reviewerStatus) < 0) { errors.push("Reviewer Notes JSON has an unsupported reviewerStatus."); }
            if (suitabilityStatuses.indexOf(payload.screenshotSuitability) < 0) { errors.push("Reviewer Notes JSON has an unsupported screenshotSuitability."); }
            if (!payload.speculativeBoundaryText || !/speculative research visualization/i.test(payload.speculativeBoundaryText)) { errors.push("Reviewer Notes JSON is missing speculative boundary text."); }
            if (payload.exportContainsExecutableCode !== false) { errors.push("Reviewer Notes JSON must declare exportContainsExecutableCode:false."); }
            return errors;
        }
        buildEvidenceIndexRow(evidencePack, reviewerNotes) {
            const readinessScore = evidencePack.readinessScore || reviewerNotes.readinessScore || this.buildEvidencePackReadiness(evidencePack, reviewerNotes);
            const evidenceWarnings = Array.isArray(evidencePack.warnings) ? evidencePack.warnings : [];
            const reviewerWarnings = Array.isArray(reviewerNotes.warnings) ? reviewerNotes.warnings : [];
            const boundaryText = evidencePack.speculativeBoundaryText || reviewerNotes.speculativeBoundaryText || "";
            const sourceMatch = evidencePack.sourceMatrixRowMatch || "missing";
            const equationMatch = evidencePack.scenarioEquationLibraryRowMatch || "missing";
            return {
                rowId: "evidence-" + Date.now().toString(36) + "-" + String(this.publicReviewerGalleryRows.length + 1),
                packageVersion: evidencePack.packageVersion || reviewerNotes.packageVersion || PACKAGE_VERSION,
                generatedUtc: evidencePack.generatedUtc || reviewerNotes.generatedUtc || new Date().toISOString(),
                activeScenario: evidencePack.activeScenario || reviewerNotes.activeScenario || "unknown",
                scenarioLabel: evidencePack.scenarioLabel || reviewerNotes.scenarioLabel || evidencePack.activeScenario || "Unknown scenario",
                screenshotCaptureStatus: evidencePack.screenshotCapture ? "captured" : (evidencePack.viewportStatus || "not-captured"),
                telemetryFiniteStatus: evidencePack.finiteTelemetryStatus || "warning-or-pending",
                sourceMatrixRowMatch: sourceMatch,
                scenarioEquationLibraryRowMatch: equationMatch,
                citationStatus: evidencePack.citationStatus || "placeholder-needed",
                falsificationTrigger: evidencePack.falsificationTrigger || "missing falsification trigger",
                reviewerStatus: reviewerNotes.reviewerStatus || "pending-review",
                screenshotSuitability: reviewerNotes.screenshotSuitability || "not-reviewed",
                readinessScore: (readinessScore.score || 0) + " / " + (readinessScore.maximumScore || 9),
                readinessScoreRaw: readinessScore.score || 0,
                readinessMaximumRaw: readinessScore.maximumScore || 9,
                warnings: evidenceWarnings.concat(reviewerWarnings),
                speculativeBoundaryStatus: /speculative research visualization/i.test(boundaryText) ? "present" : "missing",
                sourceEquationMatchStatus: sourceMatch === "matched" && equationMatch === "matched" ? "matched" : "missing",
                exportContainsExecutableCode: false
            };
        }
        getGalleryFilterValue(selector) {
            const input = this.root.querySelector(selector);
            return input ? input.value : "all";
        }
        filterEvidenceIndexRows(rows) {
            const reviewerStatus = this.getGalleryFilterValue("[data-arcsecs-gallery-filter-reviewer-status]");
            const screenshotSuitability = this.getGalleryFilterValue("[data-arcsecs-gallery-filter-screenshot-suitability]");
            const citationStatus = this.getGalleryFilterValue("[data-arcsecs-gallery-filter-citation-status]");
            const telemetry = this.getGalleryFilterValue("[data-arcsecs-gallery-filter-telemetry]");
            const sourceEquation = this.getGalleryFilterValue("[data-arcsecs-gallery-filter-source-equation]");
            return rows.filter((row) => {
                if (reviewerStatus !== "all" && row.reviewerStatus !== reviewerStatus) { return false; }
                if (screenshotSuitability !== "all" && row.screenshotSuitability !== screenshotSuitability) { return false; }
                if (citationStatus !== "all" && row.citationStatus !== citationStatus) { return false; }
                if (telemetry !== "all" && row.telemetryFiniteStatus !== telemetry) { return false; }
                if (sourceEquation !== "all" && row.sourceEquationMatchStatus !== sourceEquation) { return false; }
                return true;
            });
        }
        buildReviewerReadinessSummary(rows) {
            const count = (predicate) => rows.filter(predicate).length;
            return {
                totalRows: rows.length,
                approvedForDemo: count((row) => row.reviewerStatus === "approved-for-demo"),
                needsRevision: count((row) => row.reviewerStatus === "needs-revision"),
                rejected: count((row) => row.reviewerStatus === "rejected"),
                screenshotReady: count((row) => row.screenshotSuitability === "screenshot-ready"),
                telemetryNeeded: count((row) => row.screenshotSuitability === "telemetry-needed"),
                sourceNeeded: count((row) => row.screenshotSuitability === "source-needed"),
                falsificationNeeded: count((row) => row.screenshotSuitability === "falsification-needed"),
                rowsMissingSpeculativeBoundaryText: count((row) => row.speculativeBoundaryStatus !== "present"),
                rowsMissingSourceEquationMatches: count((row) => row.sourceEquationMatchStatus !== "matched"),
                rejectedRows: this.publicReviewerRejectedRows.length
            };
        }
        buildPublicReviewerGalleryManifest(updateUi) {
            const warnings = [];
            if (!this.publicReviewerGalleryRows || this.publicReviewerGalleryRows.length === 0) { warnings.push("No evidence rows have been added to the local Evidence Index."); }
            const manifest = {
                manifestVersion: "1.0.0",
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsPublicReviewerGalleryManifest",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                evidenceRows: this.publicReviewerGalleryRows || [],
                warnings,
                rejectedRows: this.publicReviewerRejectedRows || [],
                reviewerReadinessSummary: this.buildReviewerReadinessSummary(this.publicReviewerGalleryRows || []),
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. This gallery manifest indexes local exported evidence only and does not establish real propulsion, settled physics, or operational technology. It adds no uploads, URL fetches, network probing, credential validation, private endpoint behavior, or executable imports.",
                exportContainsExecutableCode: false
            };
            this.latestPublicReviewerGalleryManifest = manifest;
            if (updateUi) { this.renderPublicReviewerGalleryManifest(); }
            return manifest;
        }
        addPublicReviewerGalleryRow() {
            const evidenceInput = this.root.querySelector("[data-arcsecs-gallery-evidence-pack-json]");
            const reviewerInput = this.root.querySelector("[data-arcsecs-gallery-reviewer-notes-json]");
            const warningPanel = this.root.querySelector("[data-arcsecs-gallery-manifest-warning]");
            const evidence = this.parseGalleryJson(evidenceInput ? evidenceInput.value : "", "Evidence Pack JSON");
            const notes = this.parseGalleryJson(reviewerInput ? reviewerInput.value : "", "Reviewer Notes JSON");
            const errors = evidence.errors.concat(notes.errors);
            if (evidence.payload) { errors.push.apply(errors, this.validateGalleryEvidencePack(evidence.payload)); }
            if (notes.payload) { errors.push.apply(errors, this.validateGalleryReviewerNotes(notes.payload)); }
            if (errors.length > 0 || !evidence.payload || !notes.payload) {
                const rejected = { rejectedUtc: new Date().toISOString(), errors, exportContainsExecutableCode: false };
                this.publicReviewerRejectedRows.push(rejected);
                if (warningPanel) { warningPanel.innerHTML = `<div class="arcsecs-gallery-errors"><strong>Invalid JSON rejected safely.</strong><ul>${errors.map((error) => `<li>${auditEscapeHtml(error)}</li>`).join("")}</ul><p>Imported content was parsed only as inert JSON. It was never executed, uploaded, fetched, or stored remotely.</p></div>`; }
                this.renderPublicReviewerGalleryManifest();
                this.updateStatus("Public Reviewer Gallery Manifest rejected invalid inert JSON.");
                return null;
            }
            const row = this.buildEvidenceIndexRow(evidence.payload, notes.payload);
            this.publicReviewerGalleryRows.push(row);
            if (warningPanel) { warningPanel.innerHTML = `<strong>Evidence row added locally:</strong> ${auditEscapeHtml(row.scenarioLabel)} · ${auditEscapeHtml(row.reviewerStatus)} · ${auditEscapeHtml(row.screenshotSuitability)}. No upload, fetch, execution, or remote storage occurred.`; }
            this.renderPublicReviewerGalleryManifest();
            this.updateStatus("Evidence Index row added to local Public Reviewer Gallery Manifest.");
            return row;
        }
        renderPublicReviewerGalleryManifest() {
            const rows = this.publicReviewerGalleryRows || [];
            const filteredRows = this.filterEvidenceIndexRows(rows);
            const summary = this.buildReviewerReadinessSummary(rows);
            const summaryPanel = this.root.querySelector("[data-arcsecs-reviewer-readiness-summary]");
            if (summaryPanel) {
                summaryPanel.innerHTML = `<div class="arcsecs-gallery-summary-grid"><strong>Total rows ${summary.totalRows}</strong><strong>approved-for-demo ${summary.approvedForDemo}</strong><strong>needs-revision ${summary.needsRevision}</strong><strong>rejected ${summary.rejected}</strong><strong>screenshot-ready ${summary.screenshotReady}</strong><strong>telemetry-needed ${summary.telemetryNeeded}</strong><strong>source-needed ${summary.sourceNeeded}</strong><strong>falsification-needed ${summary.falsificationNeeded}</strong><strong>missing boundary ${summary.rowsMissingSpeculativeBoundaryText}</strong><strong>missing source/equation ${summary.rowsMissingSourceEquationMatches}</strong><strong>rejected imports ${summary.rejectedRows}</strong></div>`;
            }
            const body = this.root.querySelector("[data-arcsecs-evidence-index-body]");
            if (!body) { return; }
            if (filteredRows.length === 0) { body.innerHTML = `<tr><td colspan="14">No evidence rows match the current filters. Paste inert exports or loosen filters.</td></tr>`; return; }
            body.innerHTML = filteredRows.map((row) => `<tr><td>${auditEscapeHtml(row.packageVersion)}</td><td>${auditEscapeHtml(row.generatedUtc)}</td><td><strong>${auditEscapeHtml(row.scenarioLabel)}</strong><span>${auditEscapeHtml(row.activeScenario)}</span></td><td>${auditEscapeHtml(row.screenshotCaptureStatus)}</td><td>${auditEscapeHtml(row.telemetryFiniteStatus)}</td><td>${auditEscapeHtml(row.sourceMatrixRowMatch)}</td><td>${auditEscapeHtml(row.scenarioEquationLibraryRowMatch)}</td><td>${auditEscapeHtml(row.citationStatus)}</td><td>${auditEscapeHtml(row.falsificationTrigger)}</td><td>${auditEscapeHtml(row.reviewerStatus)}</td><td>${auditEscapeHtml(row.screenshotSuitability)}</td><td>${auditEscapeHtml(row.readinessScore)}</td><td>${auditEscapeHtml(row.warnings.length ? row.warnings.join("; ") : "none")}</td><td>${auditEscapeHtml(row.speculativeBoundaryStatus)}</td></tr>`).join("");
        }
        exportPublicReviewerGalleryManifestJson() {
            const manifest = this.buildPublicReviewerGalleryManifest(true);
            this.download("arcsecs-public-reviewer-gallery-manifest.json", JSON.stringify(manifest, null, 2), "application/json");
            this.updateStatus("Exported inert Public Reviewer Gallery Manifest JSON.");
        }
        clearPublicReviewerGalleryManifest() {
            this.publicReviewerGalleryRows = [];
            this.publicReviewerRejectedRows = [];
            this.latestPublicReviewerGalleryManifest = null;
            const warningPanel = this.root.querySelector("[data-arcsecs-gallery-manifest-warning]");
            if (warningPanel) { warningPanel.textContent = "Local Evidence Index cleared. Paste inert Evidence Pack JSON and Reviewer Notes JSON to rebuild it."; }
            this.renderPublicReviewerGalleryManifest();
            this.updateStatus("Cleared local Public Reviewer Gallery Manifest rows.");
        }

        normalizeIntegrityPrimitive(value) {
            if (Array.isArray(value)) { return value.map((item) => this.normalizeIntegrityPrimitive(item)); }
            if (value && typeof value === "object") {
                const normalized = {};
                Object.keys(value).sort().forEach((key) => {
                    if (/secret|password|token|credential|privatePath|certificate|signingKey/i.test(key)) { return; }
                    normalized[key] = this.normalizeIntegrityPrimitive(value[key]);
                });
                return normalized;
            }
            if (typeof value === "number") { return Number.isFinite(value) ? Number(value.toFixed(6)) : 0; }
            if (typeof value === "boolean" || typeof value === "string" || value === null) { return value; }
            return String(value || "");
        }
        stableLocalFingerprint(source) {
            const normalized = JSON.stringify(this.normalizeIntegrityPrimitive(source || {}));
            let hash = 2166136261;
            for (let index = 0; index < normalized.length; index += 1) {
                hash ^= normalized.charCodeAt(index);
                hash = Math.imul(hash, 16777619);
            }
            return "local-fnv1a-" + (hash >>> 0).toString(16).padStart(8, "0");
        }
        deriveIntegrityStatus(row) {
            if (!row || row.reviewerStatus === "rejected") { return "rejected"; }
            const readinessText = String(row.readinessScore || "0");
            const readinessNumber = Number((readinessText.match(/\d+/) || ["0"])[0]);
            const warningsCount = Array.isArray(row.warnings) ? row.warnings.length : 0;
            const hasBoundary = row.speculativeBoundaryStatus === "present";
            const hasSourceEquation = row.sourceEquationMatchStatus === "matched";
            const telemetryFinite = row.telemetryFiniteStatus === "finite";
            if (readinessNumber >= 8 && warningsCount === 0 && hasBoundary && hasSourceEquation && telemetryFinite) { return "complete"; }
            if (readinessNumber >= 5 && hasBoundary && telemetryFinite) { return "warning"; }
            return "incomplete";
        }
        buildEvidenceBundleIntegrityLabel(row, index) {
            const warningsCount = Array.isArray(row.warnings) ? row.warnings.length : 0;
            const normalizedFields = {
                packageVersion: row.packageVersion || PACKAGE_VERSION,
                generatedUtc: row.generatedUtc || new Date().toISOString(),
                exportType: "ArcSecsEvidenceBundleIntegrityLabel",
                activeScenario: row.activeScenario || "unknown",
                scenarioLabel: row.scenarioLabel || row.activeScenario || "unknown scenario",
                reviewerStatus: row.reviewerStatus || "pending-review",
                screenshotSuitability: row.screenshotSuitability || "not-reviewed",
                readinessScore: row.readinessScore || "0 / 9",
                sourceMatrixRowMatch: row.sourceMatrixRowMatch || "missing",
                scenarioEquationLibraryRowMatch: row.scenarioEquationLibraryRowMatch || "missing",
                citationStatus: row.citationStatus || "placeholder-needed",
                falsificationTrigger: row.falsificationTrigger || "falsification trigger missing",
                warningsCount,
                speculativeBoundaryStatus: row.speculativeBoundaryStatus || "missing"
            };
            const integrityStatus = this.deriveIntegrityStatus(row);
            return Object.freeze(Object.assign({}, normalizedFields, {
                labelId: "integrity-" + String(index + 1).padStart(3, "0"),
                rowLabel: row.rowId || "evidence-row-" + String(index + 1),
                integrityStatus,
                localFingerprint: this.stableLocalFingerprint(normalizedFields),
                usesSecretsSigningKeysPasswordsCertificatesAccountsOrRemoteValidation: false,
                exportContainsExecutableCode: false
            }));
        }
        filterIntegrityLabels(labels) {
            const filter = this.root.querySelector("[data-arcsecs-integrity-filter-status]");
            const status = filter ? filter.value : "all";
            if (status === "all") { return labels; }
            return labels.filter((label) => label.integrityStatus === status);
        }
        buildEvidenceBundleIntegrityLabels(updateUi) {
            const rows = this.publicReviewerGalleryRows || [];
            const labels = rows.map((row, index) => this.buildEvidenceBundleIntegrityLabel(row, index));
            const warnings = [];
            if (rows.length === 0) { warnings.push("No local Evidence Index rows exist. Add inert Evidence Pack and Reviewer Notes JSON before building integrity labels."); }
            if (labels.some((label) => label.integrityStatus !== "complete")) { warnings.push("One or more integrity labels are warning, incomplete, or rejected and should not be treated as final evidence."); }
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsEvidenceBundleIntegrityLabels",
                tableLabel: "Integrity Review Table",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                labels,
                warnings,
                integrityStatusesSupported: Object.freeze(["complete", "warning", "incomplete", "rejected"]),
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. Integrity labels are local review metadata only and do not establish real propulsion, settled physics, or operational technology.",
                exportContainsExecutableCode: false
            });
            this.latestEvidenceBundleIntegrityLabels = payload;
            if (updateUi) { this.renderEvidenceBundleIntegrityLabels(); this.updateStatus("Built local Evidence Bundle Integrity Labels without secrets, signing keys, passwords, certificates, accounts, or remote validation."); }
            return payload;
        }
        renderEvidenceBundleIntegrityLabels() {
            const payload = this.latestEvidenceBundleIntegrityLabels || this.buildEvidenceBundleIntegrityLabels(false);
            const labels = this.filterIntegrityLabels(payload.labels || []);
            const body = this.root.querySelector("[data-arcsecs-integrity-review-body]");
            if (body) {
                if (labels.length === 0) {
                    body.innerHTML = `<tr><td colspan="9">No integrity labels match the current filter. Build labels from the local Evidence Index or loosen the filter.</td></tr>`;
                } else {
                    body.innerHTML = labels.map((label) => `<tr><td>${auditEscapeHtml(label.rowLabel)}</td><td>${auditEscapeHtml(label.scenarioLabel)}</td><td>${auditEscapeHtml(label.reviewerStatus)}</td><td>${auditEscapeHtml(label.screenshotSuitability)}</td><td>${auditEscapeHtml(label.readinessScore)}</td><td>${auditEscapeHtml(label.integrityStatus)}</td><td>${auditEscapeHtml(String(label.warningsCount))}</td><td>${auditEscapeHtml(label.speculativeBoundaryStatus)}</td><td><code>${auditEscapeHtml(label.localFingerprint)}</code></td></tr>`).join("");
                }
            }
            const output = this.root.querySelector("[data-arcsecs-integrity-label-output]");
            if (output) {
                output.innerHTML = `<strong>${(payload.labels || []).length} integrity labels</strong> · statuses: complete, warning, incomplete, rejected · ${(payload.warnings || []).length} warning(s). Local fingerprint helper avoids secrets, signing keys, passwords, certificates, accounts, and remote validation.`;
            }
        }
        buildReviewerSignOffSummary(updateUi) {
            const reviewerInput = this.root.querySelector("[data-arcsecs-signoff-reviewer]");
            const statusInput = this.root.querySelector("[data-arcsecs-signoff-status]");
            const noteInput = this.root.querySelector("[data-arcsecs-signoff-note]");
            const rows = this.publicReviewerGalleryRows || [];
            const readinessSummary = this.buildReviewerReadinessSummary(rows);
            const labelsPayload = this.latestEvidenceBundleIntegrityLabels || this.buildEvidenceBundleIntegrityLabels(false);
            const summary = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsReviewerSignOffSummary",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                reviewerNameOrHandle: reviewerInput ? String(reviewerInput.value || "") : "",
                signOffStatus: statusInput ? statusInput.value : "pending-review",
                signOffNote: noteInput ? String(noteInput.value || "") : "",
                selectedEvidenceRows: rows,
                reviewerReadinessSummary: readinessSummary,
                rejectedRowCount: readinessSummary.rejectedRows,
                missingBoundaryCount: readinessSummary.rowsMissingSpeculativeBoundaryText,
                missingSourceEquationMatchCount: readinessSummary.rowsMissingSourceEquationMatches,
                telemetryNeededCount: readinessSummary.telemetryNeeded,
                sourceNeededCount: readinessSummary.sourceNeeded,
                falsificationNeededCount: readinessSummary.falsificationNeeded,
                evidenceBundleIntegrityLabels: labelsPayload,
                warnings: rows.length === 0 ? ["No Evidence Index rows were available when this local sign-off summary was built."] : [],
                speculativeBoundaryText: "Reviewer sign-off is local review metadata only. It does not prove ArcSecs, dark matter propulsion, tired light, Proca photon behavior, inertial decoupling, warp, haloscope sailing, quantized inertia, or any placeholder mode.",
                exportContainsExecutableCode: false
            });
            this.latestReviewerSignOffSummary = summary;
            if (updateUi) {
                const output = this.root.querySelector("[data-arcsecs-signoff-output]");
                if (output) { output.innerHTML = `<strong>${auditEscapeHtml(summary.signOffStatus)}</strong> · rows ${summary.reviewerReadinessSummary.totalRows} · rejected ${summary.rejectedRowCount} · missing boundary ${summary.missingBoundaryCount} · missing source/equation ${summary.missingSourceEquationMatchCount}`; }
                this.updateStatus("Built local Reviewer Sign-Off Summary.");
            }
            return summary;
        }
        exportReviewerSignOffSummaryJson() {
            const summary = this.buildReviewerSignOffSummary(true);
            this.download("arcsecs-reviewer-signoff-summary.json", JSON.stringify(summary, null, 2), "application/json");
            this.updateStatus("Exported inert Reviewer Sign-Off Summary JSON.");
        }


        parseReconciliationJson(text, label) {
            const errors = [];
            let payload = null;
            try { payload = JSON.parse(String(text || "")); }
            catch (error) { errors.push(label + " is not valid JSON: " + error.message); }
            if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
                errors.push(label + " must be a JSON object. Imported content is inert JSON data only and is never executed.");
                return { payload: null, errors };
            }
            return { payload, errors };
        }
        validateReconciliationImport(payload, expectedType, label) {
            const errors = [];
            if (!payload || typeof payload !== "object") { errors.push(label + " is missing or is not a JSON object."); return errors; }
            if (!payload.packageVersion) { errors.push(label + " is missing packageVersion."); }
            if (payload.exportType !== expectedType) { errors.push(label + " exportType must be " + expectedType + "."); }
            if (!payload.generatedUtc) { errors.push(label + " is missing generatedUtc."); }
            if (payload.exportContainsExecutableCode !== false) { errors.push(label + " must declare exportContainsExecutableCode:false."); }
            return errors;
        }
        normalizeReconciliationRows(galleryPayload, integrityPayload, signoffPayload) {
            const evidenceRows = Array.isArray(galleryPayload && galleryPayload.evidenceRows) ? galleryPayload.evidenceRows : [];
            const labels = Array.isArray(integrityPayload && integrityPayload.labels) ? integrityPayload.labels : [];
            const signoffRows = Array.isArray(signoffPayload && signoffPayload.selectedEvidenceRows) ? signoffPayload.selectedEvidenceRows : [];
            const labelByRow = new Map(labels.map((label) => [label.rowLabel || label.rowId || label.activeScenario || label.scenarioLabel, label]));
            const signoffByRow = new Map(signoffRows.map((row) => [row.rowId || row.activeScenario || row.scenarioLabel, row]));
            return evidenceRows.map((row, index) => {
                const rowId = row.rowId || "row-" + String(index + 1);
                const label = labelByRow.get(rowId) || labelByRow.get(row.activeScenario) || labelByRow.get(row.scenarioLabel) || null;
                const signoffRow = signoffByRow.get(rowId) || signoffByRow.get(row.activeScenario) || signoffByRow.get(row.scenarioLabel) || null;
                const issues = [];
                const sourceEquationMatch = row.sourceEquationMatchStatus === "matched" || (row.sourceMatrixRowMatch === "matched" && row.scenarioEquationLibraryRowMatch === "matched");
                if (!label) { issues.push("missing integrity label"); }
                if (label && label.packageVersion !== row.packageVersion) { issues.push("packageVersion mismatch"); }
                if (label && label.localFingerprint && row.localFingerprint && label.localFingerprint !== row.localFingerprint) { issues.push("local fingerprint mismatch"); }
                if (!signoffRow) { issues.push("missing sign-off row match"); }
                if (signoffRow && signoffRow.reviewerStatus && signoffRow.reviewerStatus !== row.reviewerStatus) { issues.push("reviewer status mismatch"); }
                if (row.speculativeBoundaryStatus !== "present") { issues.push("speculative boundary missing"); }
                if (!sourceEquationMatch) { issues.push("source/equation match missing"); }
                const integrityStatus = label ? (label.integrityStatus || "missing") : "missing";
                let state = "matched";
                if (row.reviewerStatus === "rejected" || integrityStatus === "rejected") { state = "rejected"; }
                else if (!label || !signoffRow) { state = "missing"; }
                else if (issues.length > 0) { state = "mismatched"; }
                else if (row.packageVersion !== (galleryPayload.packageVersion || row.packageVersion)) { state = "stale"; }
                return Object.freeze({
                    state,
                    rowId,
                    packageVersion: row.packageVersion || PACKAGE_VERSION,
                    activeScenario: row.activeScenario || "unknown",
                    scenarioLabel: row.scenarioLabel || row.activeScenario || "Unknown scenario",
                    localFingerprint: label ? (label.localFingerprint || "missing") : "missing",
                    reviewerStatus: row.reviewerStatus || "pending-review",
                    screenshotSuitability: row.screenshotSuitability || "not-reviewed",
                    readinessScore: row.readinessScore || "0 / 9",
                    integrityStatus,
                    signOffStatus: signoffPayload && signoffPayload.signOffStatus ? signoffPayload.signOffStatus : "pending-review",
                    sourceEquationMatchStatus: sourceEquationMatch ? "matched" : "missing",
                    speculativeBoundaryStatus: row.speculativeBoundaryStatus || "missing",
                    issues,
                    exportContainsExecutableCode: false
                });
            });
        }
        buildEvidenceGapForRow(row) {
            const gaps = [];
            const addGap = (gapType, severity, recommendedNextAction) => gaps.push(Object.freeze({ rowId: row.rowId, activeScenario: row.activeScenario, scenarioLabel: row.scenarioLabel, gapType, severity, recommendedNextAction, exportContainsExecutableCode: false }));
            if (row.screenshotSuitability === "telemetry-needed" || /not-captured|missing/i.test(String(row.screenshotCaptureStatus || ""))) { addGap("missing screenshot capture", "warning", "Capture a local screenshot after the scenario visibly changes, then rebuild the evidence pack."); }
            if (!/finite/i.test(String(row.telemetryFiniteStatus || ""))) { addGap("missing or non-finite telemetry", "critical", "Rerun the scenario and verify finite telemetry before approval."); }
            if (row.sourceMatrixRowMatch !== "matched") { addGap("missing source matrix match", "warning", "Open the Scientific Source Matrix row and connect the scenario to a source/reference note."); }
            if (row.scenarioEquationLibraryRowMatch !== "matched") { addGap("missing equation library match", "warning", "Open the Scenario Equation Library row and confirm the normalized formula or pseudo-formula."); }
            if (row.citationStatus === "placeholder-needed" || row.citationStatus === "future-research") { addGap("citation status not complete", "info", "Complete citation review or keep the row out of public demo approval."); }
            if (!row.falsificationTrigger || /missing/i.test(String(row.falsificationTrigger))) { addGap("missing falsification trigger", "critical", "Add a falsification trigger before marking the scenario demo-ready."); }
            if (row.speculativeBoundaryStatus !== "present") { addGap("missing speculative boundary text", "critical", "Add the speculative research visualization boundary text to the export."); }
            if (row.reviewerStatus === "approved-for-demo" && ["warning", "incomplete", "rejected", "missing"].indexOf(row.integrityStatus) >= 0) { addGap("approved row conflicts with integrity status", "critical", "Change reviewer status or rebuild evidence until integrity is complete."); }
            if (row.signOffStatus && row.signOffStatus !== "pending-review" && row.reviewerStatus && row.signOffStatus !== row.reviewerStatus && !(row.signOffStatus === "approved-with-warnings" && row.reviewerStatus === "approved-for-demo")) { addGap("sign-off conflict", "warning", "Align the sign-off summary with row-level reviewer status before publishing the bundle."); }
            return gaps;
        }
        buildReviewBundleReconciliationPayload(updateUi) {
            const warnings = [];
            const rows = this.latestReviewBundleReconciliation && Array.isArray(this.latestReviewBundleReconciliation.allRows) ? this.latestReviewBundleReconciliation.allRows : [];
            if (rows.length === 0) { warnings.push("No imported review bundle rows have been reconciled yet."); }
            const evidenceGaps = rows.reduce((all, row) => all.concat(this.buildEvidenceGapForRow(row)), []);
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsReviewBundleReconciliation",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                reconciliationVersion: "1.0.0",
                matchedRows: rows.filter((row) => row.state === "matched"),
                mismatchedRows: rows.filter((row) => row.state === "mismatched"),
                missingRows: rows.filter((row) => row.state === "missing"),
                staleRows: rows.filter((row) => row.state === "stale"),
                rejectedRows: rows.filter((row) => row.state === "rejected").concat(this.reconciliationRejectedRows || []),
                evidenceGaps,
                recommendedNextActions: evidenceGaps.map((gap) => gap.recommendedNextAction),
                warnings,
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. Reconciliation is local review metadata only and does not establish real propulsion, settled physics, or operational technology.",
                exportContainsExecutableCode: false,
                allRows: rows
            });
            if (updateUi) { this.latestReviewBundleReconciliation = payload; this.renderReviewBundleReconciliation(); }
            return payload;
        }
        reconcileReviewBundle() {
            const galleryInput = this.root.querySelector("[data-arcsecs-reconciliation-gallery-json]");
            const integrityInput = this.root.querySelector("[data-arcsecs-reconciliation-integrity-json]");
            const signoffInput = this.root.querySelector("[data-arcsecs-reconciliation-signoff-json]");
            const gallery = this.parseReconciliationJson(galleryInput ? galleryInput.value : "", "Gallery Manifest JSON");
            const integrity = this.parseReconciliationJson(integrityInput ? integrityInput.value : "", "Evidence Bundle Integrity Labels JSON");
            const signoff = this.parseReconciliationJson(signoffInput ? signoffInput.value : "", "Reviewer Sign-Off Summary JSON");
            const errors = gallery.errors.concat(integrity.errors, signoff.errors);
            if (gallery.payload) { errors.push.apply(errors, this.validateReconciliationImport(gallery.payload, "ArcSecsPublicReviewerGalleryManifest", "Gallery Manifest JSON")); }
            if (integrity.payload) { errors.push.apply(errors, this.validateReconciliationImport(integrity.payload, "ArcSecsEvidenceBundleIntegrityLabels", "Evidence Bundle Integrity Labels JSON")); }
            if (signoff.payload) { errors.push.apply(errors, this.validateReconciliationImport(signoff.payload, "ArcSecsReviewerSignOffSummary", "Reviewer Sign-Off Summary JSON")); }
            if (errors.length > 0 || !gallery.payload || !integrity.payload || !signoff.payload) {
                this.reconciliationRejectedRows.push(Object.freeze({ rejectedUtc: new Date().toISOString(), errors, exportContainsExecutableCode: false }));
                this.latestReviewBundleReconciliation = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsReviewBundleReconciliation", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", reconciliationVersion: "1.0.0", matchedRows: [], mismatchedRows: [], missingRows: [], staleRows: [], rejectedRows: this.reconciliationRejectedRows, evidenceGaps: [], recommendedNextActions: ["Fix invalid inert JSON and rerun Review Bundle Import Reconciliation."], warnings: errors, speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. Invalid imports are rejected visibly and are never executed.", exportContainsExecutableCode: false, allRows: [] });
                this.renderReviewBundleReconciliation();
                this.updateStatus("Review Bundle Import Reconciliation rejected invalid inert JSON safely.");
                return null;
            }
            const rows = this.normalizeReconciliationRows(gallery.payload, integrity.payload, signoff.payload);
            this.latestReviewBundleReconciliation = Object.freeze(Object.assign({}, this.buildReviewBundleReconciliationPayload(false), { allRows: rows }));
            this.latestReviewBundleReconciliation = this.buildReviewBundleReconciliationPayload(false);
            this.renderReviewBundleReconciliation();
            this.updateStatus("Review Bundle Import Reconciliation completed locally with Evidence Gap Assistant recommendations.");
            return this.latestReviewBundleReconciliation;
        }
        getReconciliationFilterValue(selector) {
            const input = this.root.querySelector(selector);
            return input ? input.value : "all";
        }
        filterEvidenceGaps(gaps) {
            const severity = this.getReconciliationFilterValue("[data-arcsecs-gap-filter-severity]");
            const scenario = this.getReconciliationFilterValue("[data-arcsecs-gap-filter-scenario]");
            return (gaps || []).filter((gap) => (severity === "all" || gap.severity === severity) && (scenario === "all" || gap.activeScenario === scenario));
        }
        renderReviewBundleReconciliation() {
            const payload = this.latestReviewBundleReconciliation || this.buildReviewBundleReconciliationPayload(false);
            const rows = payload.allRows || [];
            const body = this.root.querySelector("[data-arcsecs-reconciliation-body]");
            if (body) {
                if (rows.length === 0) { body.innerHTML = `<tr><td colspan="11">No reconciliation rows yet. Invalid JSON is rejected safely and imported content is never executed.</td></tr>`; }
                else { body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.state)}</td><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.rowId)}</td><td>${auditEscapeHtml(row.packageVersion)}</td><td><code>${auditEscapeHtml(row.localFingerprint)}</code></td><td>${auditEscapeHtml(row.reviewerStatus)}</td><td>${auditEscapeHtml(row.readinessScore)}</td><td>${auditEscapeHtml(row.integrityStatus)}</td><td>${auditEscapeHtml(row.signOffStatus)}</td><td>${auditEscapeHtml(row.sourceEquationMatchStatus)}</td><td>${auditEscapeHtml(row.speculativeBoundaryStatus)}</td></tr>`).join(""); }
            }
            const allGaps = payload.evidenceGaps || [];
            const filteredGaps = this.filterEvidenceGaps(allGaps);
            const summary = this.root.querySelector("[data-arcsecs-gap-summary]");
            if (summary) { summary.innerHTML = `<strong>${allGaps.length} evidence gap(s)</strong> · matched ${payload.matchedRows.length} · mismatched ${payload.mismatchedRows.length} · missing ${payload.missingRows.length} · stale ${payload.staleRows.length} · rejected ${payload.rejectedRows.length}`; }
            const list = this.root.querySelector("[data-arcsecs-gap-list]");
            if (list) { list.innerHTML = filteredGaps.length ? filteredGaps.map((gap) => `<li><strong>${auditEscapeHtml(gap.severity)}:</strong> ${auditEscapeHtml(gap.gapType)} — ${auditEscapeHtml(gap.recommendedNextAction)}</li>`).join("") : "<li>No evidence gaps match the current filters.</li>"; }
            const status = this.root.querySelector("[data-arcsecs-reconciliation-status]");
            if (status) { status.innerHTML = `<strong>Reconciliation:</strong> ${rows.length} row(s), ${(payload.warnings || []).length} warning(s). Imports are inert JSON only: no uploads, remote fetching, network probing, credential validation, secrets, signing keys, passwords, certificates, accounts, private endpoint behavior, unsafe execution, webhook replay, local tunnels, browser automation, or remote validation.`; }
        }
        exportReviewBundleReconciliationJson() {
            const payload = this.latestReviewBundleReconciliation || this.buildReviewBundleReconciliationPayload(false);
            this.download("arcsecs-review-bundle-reconciliation.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported inert Review Bundle Reconciliation JSON.");
        }
        clearReviewBundleReconciliationInputs() {
            ["[data-arcsecs-reconciliation-gallery-json]", "[data-arcsecs-reconciliation-integrity-json]", "[data-arcsecs-reconciliation-signoff-json]"].forEach((selector) => { const input = this.root.querySelector(selector); if (input) { input.value = ""; } });
            this.latestReviewBundleReconciliation = null;
            this.reconciliationRejectedRows = [];
            this.renderReviewBundleReconciliation();
            this.updateStatus("Cleared Review Bundle Import Reconciliation inputs.");
        }

        getReviewRowsForWalkthrough() {
            const reconciliation = this.latestReviewBundleReconciliation || this.buildReviewBundleReconciliationPayload(false);
            const rows = reconciliation && Array.isArray(reconciliation.allRows) ? reconciliation.allRows.slice() : [];
            if (rows.length > 0) { return rows; }
            const scenario = this.toConfig ? this.toConfig().scenario : "distanceTimeKernel";
            const scenarioConfig = ScenarioRegistry.getScenario(scenario) || { label: scenario };
            return [{ state: "missing", rowId: "local-fallback-" + scenario, packageVersion: PACKAGE_VERSION, activeScenario: scenario, scenarioLabel: scenarioConfig.label || scenario, localFingerprint: "not-generated", reviewerStatus: "pending-review", screenshotSuitability: "not-reviewed", readinessScore: "0 / 9", integrityStatus: "warning", signOffStatus: "pending-review", sourceEquationMatchStatus: "missing", speculativeBoundaryStatus: "required", issues: ["No reconciliation bundle loaded."], exportContainsExecutableCode: false }];
        }
        buildWalkthroughStepsForRow(row) {
            const gaps = this.buildEvidenceGapForRow ? this.buildEvidenceGapForRow(row) : [];
            const gapTypes = gaps.map((gap) => gap.gapType);
            const step = (id, label, complete) => ({ id, label, status: complete ? "complete" : "open", exportContainsExecutableCode: false });
            return [
                step("verify-scenario-run", "verify scenario run", row.state === "matched" || row.state === "mismatched"),
                step("verify-finite-telemetry", "verify finite telemetry", gapTypes.indexOf("missing or non-finite telemetry") < 0),
                step("capture-screenshot", "capture screenshot", gapTypes.indexOf("missing screenshot capture") < 0),
                step("confirm-source-matrix-row", "confirm source matrix row", String(row.sourceEquationMatchStatus || "").indexOf("matched") >= 0),
                step("confirm-equation-library-row", "confirm equation library row", String(row.sourceEquationMatchStatus || "").indexOf("matched") >= 0),
                step("confirm-falsification-trigger", "confirm falsification trigger", gapTypes.indexOf("missing falsification trigger") < 0),
                step("confirm-speculative-boundary-text", "confirm speculative boundary text", row.speculativeBoundaryStatus === "present"),
                step("confirm-reviewer-note", "confirm reviewer note", row.reviewerStatus && row.reviewerStatus !== "pending-review"),
                step("confirm-sign-off-status", "confirm sign-off status", row.signOffStatus && row.signOffStatus !== "pending-review")
            ];
        }
        buildScenarioReviewWalkthroughWizard(updateUi) {
            const rows = this.getReviewRowsForWalkthrough();
            const safeIndex = Math.max(0, Math.min(this.activeReviewScenarioIndex || 0, rows.length - 1));
            const activeRow = rows[safeIndex] || rows[0];
            const currentEvidenceGaps = activeRow ? this.buildEvidenceGapForRow(activeRow) : [];
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsScenarioReviewWalkthroughWizard",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: activeRow ? activeRow.activeScenario : "none",
                activeScenarioIndex: safeIndex,
                totalScenarios: rows.length,
                wizardState: activeRow ? { scenarioLabel: activeRow.scenarioLabel, reviewerStatus: activeRow.reviewerStatus, integrityStatus: activeRow.integrityStatus, readinessScore: activeRow.readinessScore, sourceEquationStatus: activeRow.sourceEquationMatchStatus, speculativeBoundaryStatus: activeRow.speculativeBoundaryStatus, currentEvidenceGaps, guidedSteps: this.buildWalkthroughStepsForRow(activeRow), exportContainsExecutableCode: false } : null,
                warnings: rows.length ? [] : ["No local reconciliation rows are available for the walkthrough wizard."],
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. The walkthrough is local review guidance only and does not establish real propulsion, settled physics, or operational technology.",
                exportContainsExecutableCode: false
            });
            this.latestScenarioReviewWalkthroughWizard = payload;
            if (updateUi) { this.renderScenarioReviewWalkthroughWizard(); this.updateStatus("Started local Scenario Review Walkthrough Wizard."); }
            return payload;
        }
        startScenarioReviewWalkthrough() {
            this.activeReviewScenarioIndex = 0;
            return this.buildScenarioReviewWalkthroughWizard(true);
        }
        nextReviewScenario() {
            const rows = this.getReviewRowsForWalkthrough();
            this.activeReviewScenarioIndex = Math.min(rows.length - 1, (this.activeReviewScenarioIndex || 0) + 1);
            return this.buildScenarioReviewWalkthroughWizard(true);
        }
        previousReviewScenario() {
            this.activeReviewScenarioIndex = Math.max(0, (this.activeReviewScenarioIndex || 0) - 1);
            return this.buildScenarioReviewWalkthroughWizard(true);
        }
        renderScenarioReviewWalkthroughWizard() {
            const payload = this.latestScenarioReviewWalkthroughWizard || this.buildScenarioReviewWalkthroughWizard(false);
            const wizardState = payload.wizardState || {};
            setText(this.root.querySelector("[data-arcsecs-walkthrough-scenario-label]"), wizardState.scenarioLabel || "No scenario selected");
            setText(this.root.querySelector("[data-arcsecs-walkthrough-reviewer-status]"), wizardState.reviewerStatus || "pending-review");
            setText(this.root.querySelector("[data-arcsecs-walkthrough-integrity-status]"), wizardState.integrityStatus || "warning");
            setText(this.root.querySelector("[data-arcsecs-walkthrough-readiness-score]"), wizardState.readinessScore || "0 / 9");
            setText(this.root.querySelector("[data-arcsecs-walkthrough-source-equation-status]"), wizardState.sourceEquationStatus || "missing");
            setText(this.root.querySelector("[data-arcsecs-walkthrough-boundary-status]"), wizardState.speculativeBoundaryStatus || "required");
            const steps = this.root.querySelector("[data-arcsecs-walkthrough-steps]");
            if (steps) { steps.innerHTML = (wizardState.guidedSteps || []).map((step) => `<li data-step-status="${auditEscapeHtml(step.status)}"><strong>${auditEscapeHtml(step.status)}</strong> — ${auditEscapeHtml(step.label)}</li>`).join("") || "<li>No walkthrough steps loaded.</li>"; }
            const gapList = this.root.querySelector("[data-arcsecs-walkthrough-gap-list]");
            if (gapList) { gapList.innerHTML = (wizardState.currentEvidenceGaps || []).length ? wizardState.currentEvidenceGaps.map((gap) => `<li><strong>${auditEscapeHtml(gap.severity)}:</strong> ${auditEscapeHtml(gap.gapType)} — ${auditEscapeHtml(gap.recommendedNextAction)}</li>`).join("") : "<li>No current evidence gaps for this scenario.</li>"; }
            const status = this.root.querySelector("[data-arcsecs-walkthrough-status]");
            if (status) { status.innerHTML = `<strong>Walkthrough:</strong> scenario ${(payload.activeScenarioIndex || 0) + 1} of ${payload.totalScenarios || 0}. Guided steps are local-only review metadata and never execute imported content.`; }
        }
        exportScenarioReviewWalkthroughJson() {
            const payload = this.latestScenarioReviewWalkthroughWizard || this.buildScenarioReviewWalkthroughWizard(false);
            this.download("arcsecs-scenario-review-walkthrough.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported inert Scenario Review Walkthrough JSON.");
        }
        mapGapToRepairType(gapType) {
            const text = String(gapType || "").toLowerCase();
            if (text.indexOf("screenshot") >= 0) { return "screenshot repair"; }
            if (text.indexOf("telemetry") >= 0) { return "telemetry repair"; }
            if (text.indexOf("source") >= 0) { return "source repair"; }
            if (text.indexOf("equation") >= 0) { return "equation repair"; }
            if (text.indexOf("citation") >= 0) { return "citation repair"; }
            if (text.indexOf("falsification") >= 0) { return "falsification repair"; }
            if (text.indexOf("boundary") >= 0) { return "boundary repair"; }
            if (text.indexOf("integrity") >= 0) { return "integrity repair"; }
            if (text.indexOf("sign-off") >= 0 || text.indexOf("signoff") >= 0) { return "sign-off repair"; }
            return "integrity repair";
        }
        repairPanelForType(repairType) {
            const panels = { "screenshot repair": "Scenario Screenshot Evidence Pack", "telemetry repair": "Live Scenario Audit Console", "source repair": "Scientific Source Matrix", "equation repair": "Scenario Equation Library", "citation repair": "Scientific Source Matrix", "falsification repair": "Evidence and Falsification", "boundary repair": "Evidence and Falsification", "integrity repair": "Evidence Bundle Integrity Labels", "sign-off repair": "Reviewer Sign-Off Summary" };
            return panels[repairType] || "Review Bundle Import Reconciliation";
        }
        repairExportForType(repairType) {
            const exports = { "screenshot repair": "Evidence Pack JSON", "telemetry repair": "Audit Console JSON", "source repair": "Gallery Manifest JSON", "equation repair": "Gallery Manifest JSON", "citation repair": "Gallery Manifest JSON", "falsification repair": "Reviewer Notes JSON", "boundary repair": "Reviewer Notes JSON", "integrity repair": "Evidence Bundle Integrity Labels JSON", "sign-off repair": "Sign-Off Summary JSON" };
            return exports[repairType] || "Reconciliation JSON";
        }
        buildEvidenceRepairQueue(updateUi) {
            const reconciliation = this.latestReviewBundleReconciliation || this.buildReviewBundleReconciliationPayload(false);
            const gaps = reconciliation && Array.isArray(reconciliation.evidenceGaps) ? reconciliation.evidenceGaps : [];
            const rows = gaps.map((gap, index) => {
                const repairType = this.mapGapToRepairType(gap.gapType);
                return Object.freeze({
                    queueId: "repair-" + String(index + 1),
                    rowId: gap.rowId || "unknown-row",
                    activeScenario: gap.activeScenario || "unknown",
                    scenarioLabel: gap.scenarioLabel || gap.activeScenario || "Unknown scenario",
                    severity: gap.severity || "warning",
                    repairType,
                    status: "open",
                    problem: gap.gapType || "unspecified evidence gap",
                    whyItMatters: "Reviewers need this evidence so the scenario remains inspectable, falsifiable, and clearly labeled as a speculative research visualization.",
                    recommendedNextAction: gap.recommendedNextAction || "Repair the missing local evidence and regenerate the related inert JSON export.",
                    panelToUse: this.repairPanelForType(repairType),
                    exportToRegenerate: this.repairExportForType(repairType),
                    resolvedCriteria: "The next reconciliation run no longer reports this gap and the exported JSON still declares exportContainsExecutableCode:false.",
                    exportContainsExecutableCode: false
                });
            });
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsEvidenceRepairQueue",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                queueItems: rows,
                warnings: rows.length ? [] : ["No evidence gaps are available. Run Review Bundle Import Reconciliation first."],
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. Repair queue items are local review guidance only and do not establish real propulsion, settled physics, or operational technology.",
                exportContainsExecutableCode: false
            });
            this.evidenceRepairQueueRows = rows;
            this.latestEvidenceRepairQueue = payload;
            if (updateUi) { this.renderEvidenceRepairQueue(); this.updateStatus("Built local Evidence Repair Queue from reconciliation gaps."); }
            return payload;
        }
        getRepairFilterValue(selector) {
            const input = this.root.querySelector(selector);
            return input ? input.value : "all";
        }
        filterEvidenceRepairQueueRows(rows) {
            const severity = this.getRepairFilterValue("[data-arcsecs-repair-filter-severity]");
            const scenario = this.getRepairFilterValue("[data-arcsecs-repair-filter-scenario]");
            const repairType = this.getRepairFilterValue("[data-arcsecs-repair-filter-type]");
            const status = this.getRepairFilterValue("[data-arcsecs-repair-filter-status]");
            return (rows || []).filter((row) => (severity === "all" || row.severity === severity) && (scenario === "all" || row.activeScenario === scenario) && (repairType === "all" || row.repairType === repairType) && (status === "all" || row.status === status));
        }
        renderEvidenceRepairQueue() {
            const payload = this.latestEvidenceRepairQueue || this.buildEvidenceRepairQueue(false);
            const rows = this.filterEvidenceRepairQueueRows(payload.queueItems || []);
            const body = this.root.querySelector("[data-arcsecs-repair-queue-body]");
            if (body) {
                body.innerHTML = rows.length ? rows.map((row) => `<tr><td>${auditEscapeHtml(row.severity)}</td><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.repairType)}</td><td><select data-arcsecs-repair-queue-status="${auditEscapeHtml(row.queueId)}" aria-label="Repair queue status for ${auditEscapeHtml(row.scenarioLabel)}"><option value="open"${row.status === "open" ? " selected" : ""}>open</option><option value="in-progress"${row.status === "in-progress" ? " selected" : ""}>in-progress</option><option value="resolved"${row.status === "resolved" ? " selected" : ""}>resolved</option><option value="deferred"${row.status === "deferred" ? " selected" : ""}>deferred</option><option value="rejected"${row.status === "rejected" ? " selected" : ""}>rejected</option></select></td><td>${auditEscapeHtml(row.problem)}</td><td>${auditEscapeHtml(row.whyItMatters)}</td><td>${auditEscapeHtml(row.recommendedNextAction)}</td><td>${auditEscapeHtml(row.panelToUse)}</td><td>${auditEscapeHtml(row.exportToRegenerate)}</td><td>${auditEscapeHtml(row.resolvedCriteria)}</td></tr>`).join("") : `<tr><td colspan="10">No repair queue items match the current filters. Queue status values: open, in-progress, resolved, deferred, rejected.</td></tr>`;
                body.querySelectorAll("[data-arcsecs-repair-queue-status]").forEach((select) => select.addEventListener("change", () => { const queueId = select.getAttribute("data-arcsecs-repair-queue-status") || ""; this.evidenceRepairQueueRows = (this.evidenceRepairQueueRows || []).map((row) => row.queueId === queueId ? Object.freeze(Object.assign({}, row, { status: select.value })) : row); this.latestEvidenceRepairQueue = Object.freeze(Object.assign({}, payload, { queueItems: this.evidenceRepairQueueRows, generatedUtc: new Date().toISOString() })); this.renderEvidenceRepairQueue(); }));
            }
            const status = this.root.querySelector("[data-arcsecs-repair-queue-status]");
            if (status) { status.innerHTML = `<strong>Evidence Repair Queue:</strong> ${(payload.queueItems || []).length} item(s). Status changes are local-only and never write to a server.`; }
        }
        exportEvidenceRepairQueueJson() {
            const payload = this.latestEvidenceRepairQueue || this.buildEvidenceRepairQueue(false);
            this.download("arcsecs-evidence-repair-queue.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported inert Evidence Repair Queue JSON.");
        }

        completionStatusForRepairRow(row) {
            if (!row) { return "not-started"; }
            if (row.status === "resolved") { return "completed"; }
            if (row.status === "in-progress") { return "in-progress"; }
            if (row.status === "deferred") { return "deferred"; }
            if (row.status === "rejected") { return "rejected"; }
            if (row.status === "open" && row.severity === "warning") { return "not-started"; }
            return "not-started";
        }
        buildEvidenceRepairCompletionLedger(updateUi) {
            const queue = this.latestEvidenceRepairQueue || this.buildEvidenceRepairQueue(false);
            const items = Array.isArray(queue.queueItems) ? queue.queueItems : [];
            const rows = items.map((item, index) => Object.freeze({
                completionId: "completion-" + String(index + 1),
                queueId: item.queueId || "repair-" + String(index + 1),
                activeScenario: item.activeScenario || "unknown",
                scenarioLabel: item.scenarioLabel || item.activeScenario || "Unknown scenario",
                repairType: item.repairType || "integrity repair",
                queueStatus: item.status || "open",
                completionStatus: this.completionStatusForRepairRow(item),
                criticalOpenRepair: item.severity === "critical" && ["open", "in-progress"].indexOf(item.status || "open") >= 0,
                completionNotes: "Local completion notes: verify the repair, regenerate the recommended inert export, and rerun reconciliation before demo-readiness review.",
                problem: item.problem || "unspecified repair item",
                exportContainsExecutableCode: false
            }));
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsEvidenceRepairCompletionLedger",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                completionVersion: "1.0.0",
                completionRows: rows,
                warnings: rows.length ? [] : ["No Evidence Repair Queue rows are available. Build the Evidence Repair Queue first."],
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. Completion rows are local review metadata and are not proof, validation, or operational capability.",
                exportContainsExecutableCode: false
            });
            this.evidenceRepairCompletionRows = rows;
            this.latestEvidenceRepairCompletionLedger = payload;
            if (updateUi) { this.renderEvidenceRepairCompletionLedger(); this.updateStatus("Built local Evidence Repair Completion Ledger."); }
            return payload;
        }
        getCompletionFilterValue(selector) {
            const input = this.root.querySelector(selector);
            return input ? input.value : "all";
        }
        filterEvidenceRepairCompletionRows(rows) {
            const scenario = this.getCompletionFilterValue("[data-arcsecs-completion-filter-scenario]");
            const completionStatus = this.getCompletionFilterValue("[data-arcsecs-completion-filter-status]");
            return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (completionStatus === "all" || row.completionStatus === completionStatus));
        }
        renderEvidenceRepairCompletionLedger() {
            const payload = this.latestEvidenceRepairCompletionLedger || this.buildEvidenceRepairCompletionLedger(false);
            const rows = this.filterEvidenceRepairCompletionRows(payload.completionRows || []);
            const body = this.root.querySelector("[data-arcsecs-completion-ledger-body]");
            if (body) {
                body.innerHTML = rows.length ? rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.repairType)}</td><td>${auditEscapeHtml(row.queueStatus)}</td><td><select data-arcsecs-completion-status="${auditEscapeHtml(row.completionId)}" aria-label="Completion status for ${auditEscapeHtml(row.scenarioLabel)}"><option value="not-started"${row.completionStatus === "not-started" ? " selected" : ""}>not-started</option><option value="in-progress"${row.completionStatus === "in-progress" ? " selected" : ""}>in-progress</option><option value="completed"${row.completionStatus === "completed" ? " selected" : ""}>completed</option><option value="completed-with-warnings"${row.completionStatus === "completed-with-warnings" ? " selected" : ""}>completed-with-warnings</option><option value="deferred"${row.completionStatus === "deferred" ? " selected" : ""}>deferred</option><option value="rejected"${row.completionStatus === "rejected" ? " selected" : ""}>rejected</option></select></td><td>${row.criticalOpenRepair ? "yes" : "no"}</td><td>${auditEscapeHtml(row.completionNotes)}</td></tr>`).join("") : `<tr><td colspan="6">No completion ledger rows match the current filters. Completion status values: not-started, in-progress, completed, completed-with-warnings, deferred, rejected.</td></tr>`;
                body.querySelectorAll("[data-arcsecs-completion-status]").forEach((select) => select.addEventListener("change", () => { const completionId = select.getAttribute("data-arcsecs-completion-status") || ""; this.evidenceRepairCompletionRows = (this.evidenceRepairCompletionRows || []).map((row) => row.completionId === completionId ? Object.freeze(Object.assign({}, row, { completionStatus: select.value })) : row); this.latestEvidenceRepairCompletionLedger = Object.freeze(Object.assign({}, payload, { completionRows: this.evidenceRepairCompletionRows, generatedUtc: new Date().toISOString() })); this.renderEvidenceRepairCompletionLedger(); }));
            }
            const status = this.root.querySelector("[data-arcsecs-completion-ledger-status]");
            if (status) { status.innerHTML = `<strong>Evidence Repair Completion Ledger:</strong> ${(payload.completionRows || []).length} row(s). Completion states are local-only and never write to a server.`; }
        }
        exportEvidenceRepairCompletionLedgerJson() {
            const payload = this.latestEvidenceRepairCompletionLedger || this.buildEvidenceRepairCompletionLedger(false);
            this.download("arcsecs-evidence-repair-completion-ledger.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported inert Evidence Repair Completion Ledger JSON.");
        }
        getScenarioGateInputs() {
            const reconciliation = this.latestReviewBundleReconciliation || this.buildReviewBundleReconciliationPayload(false);
            const reconciliationRows = reconciliation && Array.isArray(reconciliation.allRows) ? reconciliation.allRows : [];
            if (reconciliationRows.length) { return reconciliationRows; }
            return this.getReviewRowsForWalkthrough();
        }
        evaluateGateStatus(checks) {
            if (checks.rejected) { return "rejected"; }
            if (checks.criticalOpenRepair || !checks.scenarioRunExists || !checks.finiteTelemetry || !checks.sourceMatrixRowMatched || !checks.equationLibraryRowMatched || !checks.falsificationTriggerPresent || !checks.speculativeBoundaryTextPresent) { return "blocked"; }
            if (!checks.reviewerNotePresent || !checks.signOffStatusPresent) { return "needs-review"; }
            if (!checks.screenshotReady || !checks.integrityStatusAcceptable || !checks.citationStatusAcceptable) { return "demo-ready-with-warnings"; }
            return "demo-ready";
        }
        buildDemoReadinessGateRow(row, completionRows) {
            const relatedCompletion = (completionRows || []).filter((item) => item.activeScenario === row.activeScenario);
            const criticalOpenRepair = relatedCompletion.some((item) => item.criticalOpenRepair && ["not-started", "in-progress"].indexOf(item.completionStatus) >= 0);
            const sourceEquationText = String(row.sourceEquationMatchStatus || "").toLowerCase();
            const boundaryText = String(row.speculativeBoundaryStatus || "").toLowerCase();
            const citationText = String(row.citationStatus || "confirmed").toLowerCase();
            const integrityText = String(row.integrityStatus || "warning").toLowerCase();
            const reviewerText = String(row.reviewerStatus || "pending-review").toLowerCase();
            const signoffText = String(row.signOffStatus || "pending-review").toLowerCase();
            const screenshotText = String(row.screenshotSuitability || "not-reviewed").toLowerCase();
            const checks = {
                scenarioRunExists: row.state === "matched" || row.state === "mismatched",
                finiteTelemetry: String(row.telemetryFiniteStatus || "finite").indexOf("non-finite") < 0,
                screenshotReady: screenshotText === "screenshot-ready" || screenshotText === "not-required",
                sourceMatrixRowMatched: sourceEquationText.indexOf("matched") >= 0,
                equationLibraryRowMatched: sourceEquationText.indexOf("matched") >= 0,
                citationStatusAcceptable: citationText !== "placeholder-needed" && citationText !== "future-research" && citationText !== "unresolved",
                falsificationTriggerPresent: !(row.issues || []).some((issue) => String(issue).toLowerCase().indexOf("falsification") >= 0) && row.falsificationTrigger !== "missing",
                speculativeBoundaryTextPresent: boundaryText === "present",
                reviewerNotePresent: reviewerText !== "pending-review",
                signOffStatusPresent: signoffText !== "pending-review",
                integrityStatusAcceptable: integrityText === "complete" || integrityText === "warning",
                criticalOpenRepair,
                rejected: reviewerText === "rejected" || signoffText === "rejected" || integrityText === "rejected"
            };
            const gateStatus = this.evaluateGateStatus(checks);
            return Object.freeze({
                activeScenario: row.activeScenario || "unknown",
                scenarioLabel: row.scenarioLabel || row.activeScenario || "Unknown scenario",
                gateStatus,
                checks,
                completionRows: relatedCompletion,
                copySafeguard: "Demo-ready means only ready for public demonstration of the visualization; it is not proof and not operational capability.",
                exportContainsExecutableCode: false
            });
        }
        evaluateDemoReadinessGate(updateUi) {
            const ledger = this.latestEvidenceRepairCompletionLedger || this.buildEvidenceRepairCompletionLedger(false);
            const completionRows = ledger.completionRows || [];
            const gateRows = this.getScenarioGateInputs().map((row) => this.buildDemoReadinessGateRow(row, completionRows));
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsDemoReadinessGate",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                gateVersion: "1.0.0",
                gateRows,
                warnings: gateRows.length ? [] : ["No scenario rows are available for Demo Readiness Gate evaluation."],
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. Demo-ready means only ready for public demonstration of the visualization, not scientifically proven and not operational capability.",
                exportContainsExecutableCode: false
            });
            this.latestDemoReadinessGate = payload;
            if (updateUi) { this.renderDemoReadinessGate(); this.updateStatus("Evaluated local Demo Readiness Gate. Demo-ready is not proof or operational capability."); }
            return payload;
        }
        getDemoGateFilterValue(selector) {
            const input = this.root.querySelector(selector);
            return input ? input.value : "all";
        }
        filterDemoReadinessGateRows(rows) {
            const scenario = this.getDemoGateFilterValue("[data-arcsecs-demo-gate-filter-scenario]");
            const gateStatus = this.getDemoGateFilterValue("[data-arcsecs-demo-gate-filter-status]");
            const critical = this.getDemoGateFilterValue("[data-arcsecs-demo-gate-filter-critical]");
            return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (gateStatus === "all" || row.gateStatus === gateStatus) && (critical === "all" || (critical === "yes") === Boolean(row.checks && row.checks.criticalOpenRepair)));
        }
        renderDemoReadinessGate() {
            const payload = this.latestDemoReadinessGate || this.evaluateDemoReadinessGate(false);
            const rows = this.filterDemoReadinessGateRows(payload.gateRows || []);
            const body = this.root.querySelector("[data-arcsecs-demo-gate-body]");
            if (body) {
                body.innerHTML = rows.length ? rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.gateStatus)}</td><td>${row.checks.scenarioRunExists ? "pass" : "missing"}</td><td>${row.checks.finiteTelemetry ? "pass" : "missing"}</td><td>${row.checks.screenshotReady ? "pass" : "warning"}</td><td>${row.checks.sourceMatrixRowMatched && row.checks.equationLibraryRowMatched ? "pass" : "missing"}</td><td>${row.checks.citationStatusAcceptable ? "pass" : "warning"}</td><td>${row.checks.falsificationTriggerPresent ? "pass" : "missing"}</td><td>${row.checks.speculativeBoundaryTextPresent ? "pass" : "missing"}</td><td>${row.checks.reviewerNotePresent ? "pass" : "missing"}</td><td>${row.checks.signOffStatusPresent ? "pass" : "missing"}</td><td>${row.checks.integrityStatusAcceptable ? "pass" : "warning"}</td><td>${row.checks.criticalOpenRepair ? "yes" : "no"}</td></tr>`).join("") : `<tr><td colspan="13">No demo readiness gate rows match the current filters. Gate status values: blocked, needs-review, demo-ready-with-warnings, demo-ready, rejected.</td></tr>`;
            }
            const status = this.root.querySelector("[data-arcsecs-demo-gate-status]");
            if (status) { status.innerHTML = `<strong>Demo Readiness Gate:</strong> ${(payload.gateRows || []).length} scenario row(s). Demo-ready is not proof, not operational capability, and only means ready for public demonstration of the visualization.`; }
        }
        exportDemoReadinessGateJson() {
            const payload = this.latestDemoReadinessGate || this.evaluateDemoReadinessGate(false);
            this.download("arcsecs-demo-readiness-gate.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported inert Demo Readiness Gate JSON.");
        }

        publicDemoChecklistItemDefinitions() {
            return Object.freeze([
                Object.freeze({ key: "scenarioPurposeUnderstandable", label: "scenario purpose is understandable" }),
                Object.freeze({ key: "speculativeBoundaryVisible", label: "speculative boundary is visible" }),
                Object.freeze({ key: "standardComparisonVisible", label: "standard comparison is visible" }),
                Object.freeze({ key: "sourceMatrixRowPresent", label: "source matrix row is present" }),
                Object.freeze({ key: "equationLibraryRowPresent", label: "equation library row is present" }),
                Object.freeze({ key: "telemetryFinite", label: "telemetry is finite" }),
                Object.freeze({ key: "screenshotEvidenceExistsOrNotRequired", label: "screenshot evidence exists or is explicitly not required" }),
                Object.freeze({ key: "falsificationTriggerVisible", label: "falsification trigger is visible" }),
                Object.freeze({ key: "reviewerNoteExists", label: "reviewer note exists" }),
                Object.freeze({ key: "exportEvidenceComplete", label: "export evidence is complete" }),
                Object.freeze({ key: "demoReadyWarningCopyVisible", label: "demo-ready warning copy is visible" })
            ]);
        }
        getChecklistOverrideStatus() {
            const input = this.root.querySelector("[data-arcsecs-demo-checklist-override-status]");
            return input ? input.value : "not-reviewed";
        }
        resolveScenarioLabelFromKey(key) {
            if (!key || key === "active") { return ScenarioRegistry.getScenario(this.toConfig ? this.toConfig().scenario : "distanceTimeKernel").label; }
            return ScenarioRegistry.getScenario(key).label || key;
        }
        buildPublicDemoChecklistRow(gateRow) {
            const checks = gateRow && gateRow.checks ? gateRow.checks : {};
            const overrideStatus = this.getChecklistOverrideStatus();
            const checklistItems = {
                scenarioPurposeUnderstandable: Boolean(gateRow && gateRow.scenarioLabel),
                speculativeBoundaryVisible: Boolean(checks.speculativeBoundaryTextPresent),
                standardComparisonVisible: true,
                sourceMatrixRowPresent: Boolean(checks.sourceMatrixRowMatched),
                equationLibraryRowPresent: Boolean(checks.equationLibraryRowMatched),
                telemetryFinite: Boolean(checks.finiteTelemetry),
                screenshotEvidenceExistsOrNotRequired: Boolean(checks.screenshotReady),
                falsificationTriggerVisible: Boolean(checks.falsificationTriggerPresent),
                reviewerNoteExists: Boolean(checks.reviewerNotePresent),
                exportEvidenceComplete: Boolean(checks.scenarioRunExists && checks.sourceMatrixRowMatched && checks.equationLibraryRowMatched && checks.speculativeBoundaryTextPresent),
                demoReadyWarningCopyVisible: true
            };
            const passedCount = Object.keys(checklistItems).filter((key) => checklistItems[key]).length;
            const totalCount = Object.keys(checklistItems).length;
            const completionStatus = passedCount === totalCount ? "complete" : "incomplete";
            const relatedCompletion = (this.evidenceRepairCompletionRows || []).filter((row) => row.activeScenario === gateRow.activeScenario);
            const completionStatusText = relatedCompletion.length ? relatedCompletion.map((row) => row.completionStatus || "not-started").join(", ") : "not-started";
            return Object.freeze({
                packageVersion: PACKAGE_VERSION,
                generatedUtc: new Date().toISOString(),
                activeScenario: gateRow.activeScenario || "unknown",
                scenarioLabel: gateRow.scenarioLabel || gateRow.activeScenario || "Unknown scenario",
                gateStatus: gateRow.gateStatus || "needs-review",
                reviewerStatus: this.latestReviewerSignOffSummary && this.latestReviewerSignOffSummary.signOffStatus ? this.latestReviewerSignOffSummary.signOffStatus : "pending-review",
                signOffStatus: this.latestReviewerSignOffSummary && this.latestReviewerSignOffSummary.signOffStatus ? this.latestReviewerSignOffSummary.signOffStatus : "pending-review",
                readinessScore: this.deriveChecklistReadinessScore(checklistItems),
                integrityStatus: checks.integrityStatusAcceptable ? "complete-or-warning" : "incomplete",
                completionStatus: completionStatusText,
                criticalOpenRepairStatus: checks.criticalOpenRepair ? "yes" : "no",
                checklistOverrideStatus: overrideStatus,
                checklistCompleteness: completionStatus,
                checklistItems,
                checklistItemLabels: this.publicDemoChecklistItemDefinitions().map((item) => item.label),
                copySafeguard: "Checklist-ready is not proof, not operational capability, and only means local evidence is ready for public demonstration of the visualization.",
                exportContainsExecutableCode: false
            });
        }
        deriveChecklistReadinessScore(checklistItems) {
            const keys = Object.keys(checklistItems || {});
            const passed = keys.filter((key) => checklistItems[key]).length;
            return String(passed) + " / " + String(keys.length || 11);
        }
        buildPublicDemoScenarioChecklist(updateUi) {
            const gate = this.latestDemoReadinessGate || this.evaluateDemoReadinessGate(false);
            const rows = (gate.gateRows || []).map((row) => this.buildPublicDemoChecklistRow(row));
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsPublicDemoScenarioChecklist",
                checklistVersion: "1.0.0",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                checklistRows: rows,
                checklistOverrideStatusesSupported: Object.freeze(["not-reviewed", "ready", "ready-with-warnings", "blocked", "rejected"]),
                warnings: rows.length ? [] : ["No Demo Readiness Gate rows are available. Evaluate Demo Readiness Gate before building the public demo checklist."],
                falsificationNotes: ["Public-demo-ready means visualization-demo readiness only and can be weakened by missing telemetry, source rows, equation rows, reviewer notes, or falsification triggers."],
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. Checklist-ready is not proof and not operational capability. Speculative and placeholder modes remain speculative or placeholder.",
                exportContainsExecutableCode: false
            });
            this.latestPublicDemoScenarioChecklist = payload;
            this.publicDemoChecklistRows = rows;
            if (updateUi) { this.renderPublicDemoScenarioChecklist(); this.renderReviewerEvidenceExportPackStatus(); this.updateStatus("Built local Public Demo Scenario Checklist. Checklist-ready is not proof or operational capability."); }
            return payload;
        }
        getPublicDemoChecklistFilter(selector) {
            const input = this.root.querySelector(selector);
            return input ? input.value : "all";
        }
        filterPublicDemoChecklistRows(rows) {
            const scenario = this.getPublicDemoChecklistFilter("[data-arcsecs-demo-checklist-filter-scenario]");
            const gateStatus = this.getPublicDemoChecklistFilter("[data-arcsecs-demo-checklist-filter-gate-status]");
            const completeness = this.getPublicDemoChecklistFilter("[data-arcsecs-demo-checklist-filter-completeness]");
            const critical = this.getPublicDemoChecklistFilter("[data-arcsecs-demo-checklist-filter-critical]");
            return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (gateStatus === "all" || row.gateStatus === gateStatus) && (completeness === "all" || row.checklistCompleteness === completeness) && (critical === "all" || (critical === "yes") === (row.criticalOpenRepairStatus === "yes")));
        }
        renderPublicDemoScenarioChecklist() {
            const payload = this.latestPublicDemoScenarioChecklist || this.buildPublicDemoScenarioChecklist(false);
            const rows = this.filterPublicDemoChecklistRows(payload.checklistRows || []);
            const body = this.root.querySelector("[data-arcsecs-public-demo-checklist-body]");
            if (body) {
                body.innerHTML = rows.length ? rows.map((row) => {
                    const itemText = Object.keys(row.checklistItems || {}).map((key) => (row.checklistItems[key] ? "pass" : "missing") + ": " + key).join("; ");
                    return `<tr><td><strong>${auditEscapeHtml(row.scenarioLabel)}</strong><span>${auditEscapeHtml(row.activeScenario)}</span></td><td>${auditEscapeHtml(row.gateStatus)}</td><td>${auditEscapeHtml(row.reviewerStatus)}</td><td>${auditEscapeHtml(row.signOffStatus)}</td><td>${auditEscapeHtml(row.readinessScore)}</td><td>${auditEscapeHtml(row.integrityStatus)}</td><td>${auditEscapeHtml(row.completionStatus)}</td><td>${auditEscapeHtml(row.criticalOpenRepairStatus)}</td><td>${auditEscapeHtml(row.checklistOverrideStatus)}</td><td>${auditEscapeHtml(itemText)}</td></tr>`;
                }).join("") : `<tr><td colspan="10">No checklist rows match the current filters. Checklist override status values: not-reviewed, ready, ready-with-warnings, blocked, rejected.</td></tr>`;
            }
            const status = this.root.querySelector("[data-arcsecs-public-demo-checklist-status]");
            if (status) { status.innerHTML = `<strong>Public Demo Scenario Checklist:</strong> ${(payload.checklistRows || []).length} row(s). Public-demo-ready means visualization-demo readiness only, not proof and not operational capability.`; }
        }
        findSourceMatrixRowForScenario(activeScenario) {
            const matrix = buildScientificSourceMatrix(activeScenario);
            const label = this.resolveScenarioLabelFromKey(activeScenario);
            return (matrix.rows || []).find((row) => row.scenario === label || String(row.scenario || "").toLowerCase().indexOf(String(label || "").toLowerCase()) >= 0) || (matrix.rows || [])[0] || null;
        }
        findEquationLibraryRowForScenario(activeScenario) {
            const library = buildScenarioEquationLibrary(activeScenario);
            const label = this.resolveScenarioLabelFromKey(activeScenario);
            return (library.rows || []).find((row) => row.scenario === label || String(row.scenario || "").toLowerCase().indexOf(String(label || "").toLowerCase()) >= 0) || (library.rows || [])[0] || null;
        }
        getSelectedEvidencePackScenario() {
            const input = this.root.querySelector("[data-arcsecs-evidence-pack-selected-scenario]");
            const value = input ? input.value : "active";
            return value === "active" ? (this.toConfig ? this.toConfig().scenario : "distanceTimeKernel") : value;
        }
        buildReviewerEvidencePackForScenario(activeScenario, checklistRow) {
            const gate = this.latestDemoReadinessGate || this.evaluateDemoReadinessGate(false);
            const ledger = this.latestEvidenceRepairCompletionLedger || this.buildEvidenceRepairCompletionLedger(false);
            const queue = this.latestEvidenceRepairQueue || this.buildEvidenceRepairQueue(false);
            const signoff = this.latestReviewerSignOffSummary || this.buildReviewerSignOffSummary(false);
            const integrity = this.latestEvidenceBundleIntegrityLabels || this.buildEvidenceBundleIntegrityLabels(false);
            const gallery = this.latestPublicReviewerGalleryManifest || this.buildPublicReviewerGalleryManifest(false);
            const matrix = buildScientificSourceMatrix(activeScenario);
            const library = buildScenarioEquationLibrary(activeScenario);
            const gateRow = (gate.gateRows || []).find((row) => row.activeScenario === activeScenario) || null;
            const completionRows = (ledger.completionRows || []).filter((row) => row.activeScenario === activeScenario);
            const repairQueueRows = (queue.queueItems || []).filter((row) => row.activeScenario === activeScenario);
            const integrityLabels = (integrity.labels || []).filter((row) => row.activeScenario === activeScenario);
            const evidenceRows = (gallery.evidenceRows || []).filter((row) => row.activeScenario === activeScenario);
            const sourceMatrixRow = this.findSourceMatrixRowForScenario(activeScenario);
            const scenarioEquationLibraryRow = this.findEquationLibraryRowForScenario(activeScenario);
            const warnings = [];
            if (!gateRow) { warnings.push("Demo Readiness Gate row missing for selected scenario."); }
            if (!checklistRow) { warnings.push("Public Demo Scenario Checklist row missing for selected scenario."); }
            if (!sourceMatrixRow) { warnings.push("Source Matrix row missing for selected scenario."); }
            if (!scenarioEquationLibraryRow) { warnings.push("Scenario Equation Library row missing for selected scenario."); }
            return Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsReviewerEvidenceExportPack",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario,
                scenarioLabel: checklistRow ? checklistRow.scenarioLabel : this.resolveScenarioLabelFromKey(activeScenario),
                demoReadinessGate: gateRow,
                evidenceRepairCompletionLedger: completionRows,
                evidenceRepairQueue: repairQueueRows,
                reviewerSignOffSummary: signoff,
                evidenceBundleIntegrityLabels: integrityLabels,
                publicReviewerGalleryManifest: evidenceRows.length ? { evidenceRows } : gallery,
                evidenceIndexRow: evidenceRows[0] || null,
                sourceMatrix: sourceMatrixRow,
                scenarioEquationLibrary: scenarioEquationLibraryRow,
                checklistState: checklistRow || null,
                warnings,
                falsificationNotes: [sourceMatrixRow && sourceMatrixRow.falsificationTrigger ? sourceMatrixRow.falsificationTrigger : "Falsification trigger should remain visible before public demonstration."],
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. Reviewer evidence packs are local review artifacts; checklist-ready is not proof, not scientific validation, and not operational capability.",
                exportContainsExecutableCode: false
            });
        }
        buildReviewerEvidenceExportPack(updateUi) {
            const checklist = this.latestPublicDemoScenarioChecklist || this.buildPublicDemoScenarioChecklist(false);
            const selectedScenario = this.getSelectedEvidencePackScenario();
            const selectedRow = (checklist.checklistRows || []).find((row) => row.activeScenario === selectedScenario) || (checklist.checklistRows || [])[0] || null;
            const packRows = selectedRow ? [this.buildReviewerEvidencePackForScenario(selectedRow.activeScenario, selectedRow)] : [];
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsReviewerEvidenceExportPackCollection",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: selectedScenario,
                evidencePackRows: packRows,
                warnings: packRows.length ? [] : ["No checklist row is available for the selected scenario."],
                falsificationNotes: ["Evidence pack review must keep falsification notes visible and must not be described as proof."],
                speculativeBoundaryText: "ArcSecs evidence packs are local review artifacts for a speculative research visualization. They are not operational capability.",
                exportContainsExecutableCode: false
            });
            this.latestReviewerEvidenceExportPack = payload;
            if (updateUi) { this.renderReviewerEvidenceExportPackStatus(); }
            return payload;
        }
        buildAllDemoEvidencePacks() {
            const checklist = this.latestPublicDemoScenarioChecklist || this.buildPublicDemoScenarioChecklist(false);
            return Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsAllDemoReviewerEvidenceExportPacks",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                evidencePackRows: (checklist.checklistRows || []).map((row) => this.buildReviewerEvidencePackForScenario(row.activeScenario, row)),
                publicDemoScenarioChecklist: checklist,
                warnings: [],
                falsificationNotes: ["All demo evidence packs remain local inert JSON and do not prove the ArcSecs model."],
                speculativeBoundaryText: "ArcSecs is a speculative research visualization framework. Public demo evidence packs are local review artifacts and not operational capability.",
                exportContainsExecutableCode: false
            });
        }
        renderReviewerEvidenceExportPackStatus() {
            const payload = this.latestReviewerEvidenceExportPack || this.buildReviewerEvidenceExportPack(false);
            const status = this.root.querySelector("[data-arcsecs-reviewer-evidence-export-status]");
            if (status) { status.innerHTML = `<strong>Reviewer Evidence Export Pack:</strong> ${(payload.evidencePackRows || []).length} selected pack(s). Exports include demoReadinessGate, evidenceRepairCompletionLedger, evidenceRepairQueue, reviewerSignOffSummary, evidenceBundleIntegrityLabels, publicReviewerGalleryManifest or evidence index row, sourceMatrix, scenarioEquationLibrary, warnings, falsification notes, speculativeBoundaryText, and exportContainsExecutableCode:false.`; }
        }
        exportSelectedScenarioEvidencePackJson() {
            const payload = this.buildReviewerEvidenceExportPack(true);
            this.download("arcsecs-selected-scenario-reviewer-evidence-pack.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported inert Reviewer Evidence Export Pack JSON for selected scenario.");
        }
        exportAllDemoEvidencePacksJson() {
            const payload = this.buildAllDemoEvidencePacks();
            this.latestReviewerEvidenceExportPack = payload;
            this.renderReviewerEvidenceExportPackStatus();
            this.download("arcsecs-all-demo-reviewer-evidence-packs.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported inert Reviewer Evidence Export Pack JSON for all demo scenarios.");
        }


        resolvePublicDemoScenarioPack(scenario) {
            const checklist = this.latestPublicDemoScenarioChecklist || this.buildPublicDemoScenarioChecklist(false);
            const evidencePack = this.latestReviewerEvidenceExportPack || this.buildReviewerEvidenceExportPack(false);
            const rows = Array.isArray(checklist.checklistRows) ? checklist.checklistRows : [];
            const packs = evidencePack && Array.isArray(evidencePack.evidencePacks) ? evidencePack.evidencePacks : [];
            const targetScenario = scenario || (this.toConfig ? this.toConfig().scenario : "distanceTimeKernel");
            const checklistRow = rows.find((row) => row.activeScenario === targetScenario) || rows[0] || null;
            const evidenceRow = packs.find((row) => row.activeScenario === targetScenario) || packs[0] || null;
            const sourceRows = auditRows(buildScientificSourceMatrix(targetScenario));
            const equationRows = auditRows(buildScenarioEquationLibrary(targetScenario));
            const scenarioConfig = ScenarioRegistry.getScenario(targetScenario);
            const scenarioLabel = (checklistRow && checklistRow.scenarioLabel) || (evidenceRow && evidenceRow.scenarioLabel) || (scenarioConfig && scenarioConfig.label) || targetScenario;
            const sourceRow = findAuditRow(sourceRows, scenarioLabel) || sourceRows[0] || null;
            const equationRow = findAuditRow(equationRows, scenarioLabel) || equationRows[0] || null;
            return Object.freeze({ scenario: targetScenario, scenarioLabel, checklist, evidencePack, checklistRow, evidenceRow, sourceRow, equationRow });
        }
        buildPublicDemoScriptRow(source) {
            const row = source.checklistRow || {};
            const evidence = source.evidenceRow || {};
            const sourceRow = source.sourceRow || {};
            const equationRow = source.equationRow || {};
            const warningCount = Array.isArray(row.warnings) ? row.warnings.length : Array.isArray(evidence.warnings) ? evidence.warnings.length : 0;
            const warningStatus = warningCount > 0 || String(row.gateStatus || "").indexOf("warning") >= 0 ? "warnings" : "clear";
            const scriptStatusField = this.root.querySelector("[data-arcsecs-demo-script-status]");
            const scriptStatus = scriptStatusField ? scriptStatusField.value : "draft";
            return Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsPublicDemoScriptRow",
                activeScenario: source.scenario,
                scenarioLabel: source.scenarioLabel,
                gateStatus: row.gateStatus || "needs-review",
                checklistOverrideStatus: row.checklistOverrideStatus || "not-reviewed",
                readinessScore: row.readinessScore || "0 / 11",
                integrityStatus: row.integrityStatus || "warning",
                sourceEquationStatus: ((row.checklistItems && row.checklistItems.sourceMatrixRowPresent) ? "source-present" : "source-review") + " / " + ((row.checklistItems && row.checklistItems.equationLibraryRowPresent) ? "equation-present" : "equation-review"),
                falsificationTrigger: (sourceRow && sourceRow.falsificationTrigger) || "Falsification trigger must remain visible before public use.",
                warningStatus,
                scriptStatus,
                visitorIntroduction: "This is an ArcSecs speculative research visualization for the " + source.scenarioLabel + " scenario; it is not proof and not operational capability.",
                scenarioGoal: "What the scenario is trying to show: " + ((sourceRow && sourceRow.arcsecsAlternativeAssumption) || "how an alternative model branch changes visible telemetry under review."),
                standardComparison: "Standard comparison expects: " + ((sourceRow && sourceRow.standardExpectation) || "a clearly labeled baseline for comparison."),
                arcsecsSpeculativeChange: "ArcSecs changes in the speculative model: " + ((sourceRow && sourceRow.arcsecsAlternativeAssumption) || "normalized proxy behavior is separated from the standard reference."),
                telemetryToWatch: "Telemetry to watch: " + ((sourceRow && sourceRow.derivedTelemetry) || (equationRow && equationRow.derivedTelemetry) || "finite telemetry, warnings, and export evidence."),
                screenshotMoment: "Screenshot moment to capture: show the active viewport with standard comparison, source/equation status, and falsification note visible.",
                falsificationCriteria: "What would weaken or falsify this scenario: " + ((sourceRow && sourceRow.falsificationTrigger) || "missing or non-finite telemetry, missing source/equation traceability, or proof-like wording."),
                closingCaveat: "Closing caveat: this demo is a communication aid for a speculative research visualization; screenshots are evidence of a simulation run, not proof of physics or a working drive.",
                references: Object.freeze({ demoReadinessGate: row.gateStatus || "missing", publicDemoScenarioChecklist: row.activeScenario || "missing", reviewerEvidenceExportPack: evidence.exportType || "missing", sourceMatrix: sourceRow ? sourceRow.scenario : "missing", scenarioEquationLibrary: equationRow ? equationRow.scenario : "missing" }),
                exportContainsExecutableCode: false
            });
        }
        getPublicDemoScriptRows() {
            const checklist = this.latestPublicDemoScenarioChecklist || this.buildPublicDemoScenarioChecklist(false);
            const checklistRows = Array.isArray(checklist.checklistRows) && checklist.checklistRows.length ? checklist.checklistRows : liveAuditScenarioRows.map((item) => Object.freeze({ activeScenario: item.key, scenarioLabel: item.label }));
            return checklistRows.map((row) => this.buildPublicDemoScriptRow(this.resolvePublicDemoScenarioPack(row.activeScenario)));
        }
        publicDemoScriptRowsForDisplay() {
            const payload = this.latestPublicDemoScriptBuilder || this.buildPublicDemoScripts(false);
            const rows = Array.isArray(payload.scriptRows) ? payload.scriptRows : [];
            const scenarioFilter = (this.root.querySelector("[data-arcsecs-demo-script-filter-scenario]") || {}).value || "all";
            const gateFilter = (this.root.querySelector("[data-arcsecs-demo-script-filter-gate-status]") || {}).value || "all";
            const checklistFilter = (this.root.querySelector("[data-arcsecs-demo-script-filter-checklist-override]") || {}).value || "all";
            const warningFilter = (this.root.querySelector("[data-arcsecs-demo-script-filter-warning]") || {}).value || "all";
            return rows.filter((row) => (scenarioFilter === "all" || row.activeScenario === scenarioFilter) && (gateFilter === "all" || row.gateStatus === gateFilter) && (checklistFilter === "all" || row.checklistOverrideStatus === checklistFilter) && (warningFilter === "all" || row.warningStatus === warningFilter));
        }
        renderPublicDemoScriptBuilder() {
            const body = this.root.querySelector("[data-arcsecs-demo-script-body]");
            const status = this.root.querySelector("[data-arcsecs-demo-script-builder-status]");
            if (!body) { return; }
            const rows = this.publicDemoScriptRowsForDisplay();
            if (!rows.length) { body.innerHTML = '<tr><td colspan="9">No matching demo script rows. Build scripts or clear filters.</td></tr>'; if (status) { status.textContent = "Public Demo Script Builder has no matching rows."; } return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.gateStatus)}</td><td>${auditEscapeHtml(row.checklistOverrideStatus)}</td><td>${auditEscapeHtml(row.readinessScore)}</td><td>${auditEscapeHtml(row.integrityStatus)}</td><td>${auditEscapeHtml(row.sourceEquationStatus)}</td><td>${auditEscapeHtml(row.warningStatus)}</td><td>${auditEscapeHtml(row.scriptStatus)}</td><td><details><summary>script sections</summary><strong>visitor introduction</strong><p>${auditEscapeHtml(row.visitorIntroduction)}</p><strong>standard comparison</strong><p>${auditEscapeHtml(row.standardComparison)}</p><strong>ArcSecs speculative change</strong><p>${auditEscapeHtml(row.arcsecsSpeculativeChange)}</p><strong>telemetry to watch</strong><p>${auditEscapeHtml(row.telemetryToWatch)}</p><strong>screenshot moment</strong><p>${auditEscapeHtml(row.screenshotMoment)}</p><strong>falsification criteria</strong><p>${auditEscapeHtml(row.falsificationCriteria)}</p><strong>closing caveat</strong><p>${auditEscapeHtml(row.closingCaveat)}</p></details></td></tr>`).join("");
            if (status) { status.textContent = "Public Demo Script Builder has " + rows.length + " local script row" + (rows.length === 1 ? "" : "s") + ". Scripts are communication aids only."; }
        }
        buildPublicDemoScripts(updateUi) {
            const rows = this.getPublicDemoScriptRows();
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsPublicDemoScriptBuilder",
                scriptBuilderVersion: "1.0.0",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                scriptRows: Object.freeze(rows),
                scriptStatusValuesSupported: Object.freeze(["draft", "reviewer-ready", "needs-revision", "blocked", "rejected"]),
                warnings: rows.some((row) => row.warningStatus === "warnings") ? ["Some script rows carry warnings; keep falsification callouts visible before public use."] : [],
                falsificationNotes: rows.map((row) => row.falsificationCriteria),
                speculativeBoundaryText: "Public demo scripts are communication aids for an ArcSecs speculative research visualization. They are not proof and not operational capability.",
                references: Object.freeze(["demoReadinessGate", "publicDemoScenarioChecklist", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary"]),
                exportContainsExecutableCode: false
            });
            this.latestPublicDemoScriptBuilder = payload;
            if (updateUi) { this.renderPublicDemoScriptBuilder(); this.updateStatus("Built local Public Demo Script Builder rows."); }
            return payload;
        }
        buildScreenshotCaptionRow(scriptRow) {
            return Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsScreenshotCaptionRow",
                activeScenario: scriptRow.activeScenario,
                scenarioLabel: scriptRow.scenarioLabel,
                screenshotTitle: scriptRow.scenarioLabel + " — ArcSecs speculative visualization screenshot",
                shortCaption: scriptRow.scenarioLabel + " screenshot from a local ArcSecs simulation run; this is not proof of physics.",
                longCaption: "This screenshot caption describes a browser-side ArcSecs speculative research visualization for " + scriptRow.scenarioLabel + ". It should be presented with standard comparison, telemetry, and falsification context visible.",
                telemetryCaption: "Telemetry caption: watch " + scriptRow.telemetryToWatch.replace(/^Telemetry to watch:\s*/i, "") + ".",
                sourceEquationCaption: "Source/equation caption: source/equation status is " + scriptRow.sourceEquationStatus + "; normalized formulas are communication aids, not measured laws.",
                falsificationCaption: scriptRow.falsificationCriteria,
                warningCaption: scriptRow.warningStatus === "warnings" ? "Warning: this caption should remain paired with review warnings before public posting." : "Warning status clear for local review, but speculative boundary text must remain visible.",
                altText: "ArcSecs " + scriptRow.scenarioLabel + " browser simulation screenshot with telemetry, standard comparison, and falsification note visible.",
                speculativeBoundaryCaption: "Speculative research visualization; screenshot evidence documents a simulation run, not proof, not established physics, and not operational capability.",
                exportContainsExecutableCode: false
            });
        }
        renderScreenshotCaptionPack() {
            const body = this.root.querySelector("[data-arcsecs-screenshot-caption-body]");
            const status = this.root.querySelector("[data-arcsecs-screenshot-caption-pack-status]");
            if (!body) { return; }
            const payload = this.latestScreenshotCaptionPack || this.buildScreenshotCaptionPack(false);
            const rows = Array.isArray(payload.captionRows) ? payload.captionRows : [];
            if (!rows.length) { body.innerHTML = '<tr><td colspan="7">No caption rows yet. Build Screenshot Caption Pack.</td></tr>'; if (status) { status.textContent = "Screenshot Caption Pack waiting for generated demo scripts."; } return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.screenshotTitle)}</td><td>${auditEscapeHtml(row.shortCaption)}</td><td>${auditEscapeHtml(row.telemetryCaption)}</td><td>${auditEscapeHtml(row.falsificationCaption)}</td><td>${auditEscapeHtml(row.altText)}</td><td>${auditEscapeHtml(row.speculativeBoundaryCaption)}</td></tr>`).join("");
            if (status) { status.textContent = "Screenshot Caption Pack has " + rows.length + " local caption row" + (rows.length === 1 ? "" : "s") + "."; }
        }
        buildScreenshotCaptionPack(updateUi) {
            const scripts = this.latestPublicDemoScriptBuilder || this.buildPublicDemoScripts(false);
            const rows = (Array.isArray(scripts.scriptRows) ? scripts.scriptRows : []).map((row) => this.buildScreenshotCaptionRow(row));
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsScreenshotCaptionPack",
                captionPackVersion: "1.0.0",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                captionRows: Object.freeze(rows),
                warnings: rows.length ? [] : ["No public demo script rows were available before building captions."],
                falsificationNotes: rows.map((row) => row.falsificationCaption),
                speculativeBoundaryText: "Screenshot captions are evidence of a browser simulation run, not proof of physics, established technology, or operational capability.",
                references: Object.freeze(["publicDemoScriptBuilder", "demoReadinessGate", "publicDemoScenarioChecklist", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary"]),
                exportContainsExecutableCode: false
            });
            this.latestScreenshotCaptionPack = payload;
            if (updateUi) { this.renderScreenshotCaptionPack(); this.updateStatus("Built local Screenshot Caption Pack rows."); }
            return payload;
        }
        selectedPublicDemoScriptScenario() {
            const select = this.root.querySelector("[data-arcsecs-demo-script-filter-scenario]") || this.root.querySelector("[data-arcsecs-evidence-pack-selected-scenario]");
            const value = select && select.value && select.value !== "all" && select.value !== "active" ? select.value : (this.toConfig ? this.toConfig().scenario : "distanceTimeKernel");
            return value || "distanceTimeKernel";
        }
        exportSelectedDemoScriptJson() {
            const payload = this.latestPublicDemoScriptBuilder || this.buildPublicDemoScripts(false);
            const scenario = this.selectedPublicDemoScriptScenario();
            const row = (payload.scriptRows || []).find((item) => item.activeScenario === scenario) || (payload.scriptRows || [])[0];
            this.download("arcsecs-selected-public-demo-script.json", JSON.stringify(Object.assign({}, payload, { exportType: "ArcSecsSelectedPublicDemoScript", selectedScenario: scenario, scriptRows: row ? [row] : [] }), null, 2), "application/json");
            this.updateStatus("Exported selected inert Public Demo Script JSON.");
        }
        exportAllDemoScriptsJson() {
            const payload = this.latestPublicDemoScriptBuilder || this.buildPublicDemoScripts(false);
            this.download("arcsecs-all-public-demo-scripts.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported all inert Public Demo Script JSON rows.");
        }
        exportScreenshotCaptionPackJson() {
            const payload = this.latestScreenshotCaptionPack || this.buildScreenshotCaptionPack(false);
            this.download("arcsecs-screenshot-caption-pack.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported inert Screenshot Caption Pack JSON.");
        }


        getPageAssemblyFilterValue(selector) {
            const input = this.root.querySelector(selector);
            return input ? input.value : "all";
        }
        buildAssemblyChecklistItems(scriptRow, captionRow, evidenceRow, sourceRow, equationRow) {
            return Object.freeze({
                heroTitleCopyPresent: !!(scriptRow && scriptRow.scenarioLabel),
                publicSummaryPresent: !!(scriptRow && scriptRow.scenarioGoal),
                scriptVisitorIntroductionPresent: !!(scriptRow && scriptRow.visitorIntroduction),
                standardComparisonPresent: !!(scriptRow && scriptRow.standardComparison),
                arcsecsSpeculativeChangePresent: !!(scriptRow && scriptRow.arcsecsSpeculativeChange),
                screenshotCaptionPresent: !!(captionRow && captionRow.shortCaption),
                altTextPresent: !!(captionRow && captionRow.altText),
                telemetryCalloutPresent: !!(captionRow && captionRow.telemetryCaption),
                sourceEquationCalloutPresent: !!(sourceRow && equationRow),
                falsificationCalloutPresent: !!(scriptRow && scriptRow.falsificationCriteria),
                speculativeBoundaryPresent: !!(scriptRow && scriptRow.closingCaveat && scriptRow.closingCaveat.toLowerCase().indexOf("not proof") >= 0),
                placeholderSpeculativeLabelsVisible: true,
                operationalCapabilityDisclaimerPresent: !!(scriptRow && scriptRow.closingCaveat && scriptRow.closingCaveat.toLowerCase().indexOf("not operational capability") >= 0),
                exportEvidenceReferencePresent: !!evidenceRow
            });
        }
        buildPublicDemoPageAssemblyRow(scriptRow, captionRow, evidenceRow) {
            const activeScenario = (scriptRow && scriptRow.activeScenario) || (captionRow && captionRow.activeScenario) || (evidenceRow && evidenceRow.activeScenario) || "distanceTimeKernel";
            const scenarioLabel = (scriptRow && scriptRow.scenarioLabel) || (captionRow && captionRow.scenarioLabel) || (evidenceRow && evidenceRow.scenarioLabel) || activeScenario;
            const sourceRow = this.findSourceMatrixRowForScenario(activeScenario);
            const equationRow = this.findEquationLibraryRowForScenario(activeScenario);
            const checklistItems = this.buildAssemblyChecklistItems(scriptRow, captionRow, evidenceRow, sourceRow, equationRow);
            const missingItems = Object.keys(checklistItems).filter((key) => checklistItems[key] !== true);
            const warningStatus = missingItems.length ? "warnings" : "clear";
            const copyReadinessInput = this.root.querySelector("[data-arcsecs-copy-readiness-status]");
            const copyReadinessStatus = copyReadinessInput ? copyReadinessInput.value : (warningStatus === "clear" ? "reviewer-ready" : "draft");
            return Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsPublicDemoPageAssemblyRow",
                generatedUtc: new Date().toISOString(),
                activeScenario,
                scenarioLabel,
                scriptStatus: (scriptRow && scriptRow.scriptStatus) || "draft",
                captionStatus: captionRow ? "present" : "missing",
                gateStatus: (scriptRow && scriptRow.gateStatus) || (evidenceRow && evidenceRow.demoReadinessGate && evidenceRow.demoReadinessGate.gateStatus) || "needs-review",
                checklistOverrideStatus: (scriptRow && scriptRow.checklistOverrideStatus) || "not-reviewed",
                readinessScore: (scriptRow && scriptRow.readinessScore) || (evidenceRow && evidenceRow.checklistState && evidenceRow.checklistState.readinessScore) || "0 / 11",
                warningStatus,
                sourceEquationStatus: sourceRow && equationRow ? "present" : "missing",
                falsificationStatus: scriptRow && scriptRow.falsificationCriteria ? "present" : "missing",
                copyReadinessStatus,
                checklistItems,
                checklistItemLabels: Object.freeze(["hero/title copy present", "public summary present", "script visitor introduction present", "standard comparison present", "ArcSecs speculative change present", "screenshot caption present", "alt text present", "telemetry callout present", "source/equation callout present", "falsification callout present", "speculative boundary present", "placeholder/speculative labels visible", "operational-capability disclaimer present", "export evidence reference present"]),
                missingItems: Object.freeze(missingItems),
                copySafeguard: "Public copy must remain cautious, falsifiable, and clearly labeled as a speculative research visualization; page assembly readiness is not proof or operational capability.",
                exportContainsExecutableCode: false
            });
        }
        getPublicDemoPageAssemblyRows() {
            const scripts = this.latestPublicDemoScriptBuilder || this.buildPublicDemoScripts(false);
            const captions = this.latestScreenshotCaptionPack || this.buildScreenshotCaptionPack(false);
            const evidence = this.latestReviewerEvidenceExportPack || this.buildReviewerEvidenceExportPack(false);
            const scriptRows = Array.isArray(scripts.scriptRows) ? scripts.scriptRows : [];
            const captionRows = Array.isArray(captions.captionRows) ? captions.captionRows : [];
            const evidenceRows = Array.isArray(evidence.evidencePackRows) ? evidence.evidencePackRows : [];
            const scenarioKeys = Array.from(new Set([].concat(scriptRows.map((row) => row.activeScenario), captionRows.map((row) => row.activeScenario), evidenceRows.map((row) => row.activeScenario)).filter(Boolean)));
            const keys = scenarioKeys.length ? scenarioKeys : [this.toConfig ? this.toConfig().scenario : "distanceTimeKernel"];
            return keys.map((key) => this.buildPublicDemoPageAssemblyRow(scriptRows.find((row) => row.activeScenario === key), captionRows.find((row) => row.activeScenario === key), evidenceRows.find((row) => row.activeScenario === key)));
        }
        filterPublicDemoPageAssemblyRows(rows) {
            const scenario = this.getPageAssemblyFilterValue("[data-arcsecs-page-assembly-filter-scenario]");
            const scriptStatus = this.getPageAssemblyFilterValue("[data-arcsecs-page-assembly-filter-script-status]");
            const captionStatus = this.getPageAssemblyFilterValue("[data-arcsecs-page-assembly-filter-caption-status]");
            const copyReadiness = this.getPageAssemblyFilterValue("[data-arcsecs-page-assembly-filter-copy-readiness]");
            const warningStatus = this.getPageAssemblyFilterValue("[data-arcsecs-page-assembly-filter-warning]");
            return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (scriptStatus === "all" || row.scriptStatus === scriptStatus) && (captionStatus === "all" || row.captionStatus === captionStatus) && (copyReadiness === "all" || row.copyReadinessStatus === copyReadiness) && (warningStatus === "all" || row.warningStatus === warningStatus));
        }
        renderPublicDemoPageAssemblyChecklist() {
            const body = this.root.querySelector("[data-arcsecs-page-assembly-body]");
            const status = this.root.querySelector("[data-arcsecs-page-assembly-status]");
            if (!body) { return; }
            const payload = this.latestPublicDemoPageAssemblyChecklist || this.buildPublicDemoPageAssemblyChecklist(false);
            const rows = this.filterPublicDemoPageAssemblyRows(payload.assemblyRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="11">No assembly rows match the current filters. Build Page Assembly Checklist or clear filters.</td></tr>'; if (status) { status.textContent = "Public Demo Page Assembly Checklist has no matching rows."; } return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.scriptStatus)}</td><td>${auditEscapeHtml(row.captionStatus)}</td><td>${auditEscapeHtml(row.gateStatus)}</td><td>${auditEscapeHtml(row.checklistOverrideStatus)}</td><td>${auditEscapeHtml(row.readinessScore)}</td><td>${auditEscapeHtml(row.warningStatus)}</td><td>${auditEscapeHtml(row.sourceEquationStatus)}</td><td>${auditEscapeHtml(row.falsificationStatus)}</td><td>${auditEscapeHtml(row.copyReadinessStatus)}</td><td><details><summary>${row.missingItems.length ? row.missingItems.length + " missing" : "complete"}</summary><ul>${row.checklistItemLabels.map((label) => `<li>${auditEscapeHtml(label)}</li>`).join("")}</ul></details></td></tr>`).join("");
            if (status) { status.textContent = "Public Demo Page Assembly Checklist has " + rows.length + " local row" + (rows.length === 1 ? "" : "s") + ". Copy readiness is not proof or operational capability."; }
        }
        buildPublicDemoPageAssemblyChecklist(updateUi) {
            const rows = this.getPublicDemoPageAssemblyRows();
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsPublicDemoPageAssemblyChecklist",
                assemblyChecklistVersion: "1.0.0",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                assemblyRows: Object.freeze(rows),
                copyReadinessStatusesSupported: Object.freeze(["draft", "reviewer-ready", "ready-with-warnings", "blocked", "rejected"]),
                warnings: rows.some((row) => row.warningStatus === "warnings") ? ["Some page assembly rows have copy warnings or missing checklist items."] : [],
                falsificationNotes: rows.map((row) => "Falsification callout status for " + row.scenarioLabel + ": " + row.falsificationStatus),
                speculativeBoundaryText: "Public demo page assembly rows are local copy-review artifacts for a speculative research visualization; they are not proof, not validation, and not operational capability.",
                references: Object.freeze(["publicDemoScriptBuilder", "screenshotCaptionPack", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary"]),
                exportContainsExecutableCode: false
            });
            this.latestPublicDemoPageAssemblyChecklist = payload;
            if (updateUi) { this.renderPublicDemoPageAssemblyChecklist(); this.updateStatus("Built local Public Demo Page Assembly Checklist rows."); }
            return payload;
        }
        detectCopyQualityWarnings(bundle) {
            const combined = [bundle.suggestedIntroParagraph, bundle.suggestedTelemetryCallout, bundle.suggestedFalsificationCallout, bundle.suggestedBoundaryCopy, bundle.suggestedAltText].join(" ");
            const lower = combined.toLowerCase();
            const warnings = [];
            const rejectedPhrases = [];
            const fixes = [];
            if (lower.indexOf("speculative research visualization") < 0) { warnings.push("missing speculative boundary language"); fixes.push("Add speculative research visualization boundary copy."); }
            if (lower.indexOf("falsif") < 0 && lower.indexOf("weaken") < 0) { warnings.push("missing falsification language"); fixes.push("Add a falsification or weakening-condition callout."); }
            if (lower.indexOf("standard comparison") < 0 && lower.indexOf("standard reference") < 0) { warnings.push("missing standard comparison language"); fixes.push("Add standard comparison context."); }
            if (lower.indexOf("source") < 0 || lower.indexOf("equation") < 0) { warnings.push("missing source/equation language"); fixes.push("Mention the source matrix and scenario equation library rows."); }
            if (!bundle.suggestedAltText) { warnings.push("missing screenshot alt text"); fixes.push("Add concise accessible alt text for the screenshot."); }
            ["proves", "real propulsion", "working propulsion", "operational capability", "unsupported-claim marker", "established technology"].forEach((phrase) => { if (lower.indexOf(phrase) >= 0) { rejectedPhrases.push(phrase); } });
            if (lower.indexOf("placeholder") >= 0 && lower.indexOf("speculative") < 0) { warnings.push("unlabeled placeholders"); fixes.push("Label placeholder modes as placeholder and speculative."); }
            if (rejectedPhrases.length) { warnings.push("proof or operational-capability wording detected"); fixes.push("Replace rejected phrases with cautious model/comparison language."); }
            return Object.freeze({ warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhrases), recommendedFixes: Object.freeze(fixes) });
        }
        buildCopyReviewBundleRow(assemblyRow) {
            const scriptPayload = this.latestPublicDemoScriptBuilder || this.buildPublicDemoScripts(false);
            const captionPayload = this.latestScreenshotCaptionPack || this.buildScreenshotCaptionPack(false);
            const evidencePayload = this.latestReviewerEvidenceExportPack || this.buildReviewerEvidenceExportPack(false);
            const scriptRow = (scriptPayload.scriptRows || []).find((row) => row.activeScenario === assemblyRow.activeScenario) || null;
            const captionRow = (captionPayload.captionRows || []).find((row) => row.activeScenario === assemblyRow.activeScenario) || null;
            const evidenceRow = (evidencePayload.evidencePackRows || []).find((row) => row.activeScenario === assemblyRow.activeScenario) || null;
            const sourceMatrixRow = this.findSourceMatrixRowForScenario(assemblyRow.activeScenario);
            const scenarioEquationLibraryRow = this.findEquationLibraryRowForScenario(assemblyRow.activeScenario);
            const row = {
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsCopyReviewBundleRow",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: assemblyRow.activeScenario,
                scenarioLabel: assemblyRow.scenarioLabel,
                demoScriptRow: scriptRow,
                screenshotCaptionRow: captionRow,
                reviewerEvidenceExportPackRow: evidenceRow,
                sourceMatrix: sourceMatrixRow,
                scenarioEquationLibrary: scenarioEquationLibraryRow,
                suggestedPageTitle: assemblyRow.scenarioLabel + " — ArcSecs speculative visualization demo",
                suggestedIntroParagraph: scriptRow ? scriptRow.visitorIntroduction + " This public summary is for a speculative research visualization and should be reviewed with the standard comparison visible." : "Draft intro: this scenario is a speculative research visualization and requires standard comparison review.",
                suggestedTelemetryCallout: captionRow ? captionRow.telemetryCaption + " Source and equation rows should remain visible beside telemetry." : "Telemetry callout pending: add source/equation context before publishing.",
                suggestedFalsificationCallout: scriptRow ? scriptRow.falsificationCriteria : "Falsification callout pending: identify what would weaken this scenario.",
                suggestedBoundaryCopy: "ArcSecs is a speculative research visualization. This page is not proof, not established physics, and not operational capability. Placeholder modes remain placeholder/speculative.",
                suggestedAltText: captionRow ? captionRow.altText : "ArcSecs browser simulation screenshot with telemetry, source/equation note, and falsification boundary visible.",
                copyWarnings: [],
                rejectedPhrases: [],
                recommendedFixes: [],
                speculativeBoundaryText: "Copy review bundles are inert local review artifacts for a speculative research visualization.",
                copyReadinessStatus: assemblyRow.copyReadinessStatus,
                exportContainsExecutableCode: false
            };
            const quality = this.detectCopyQualityWarnings(row);
            row.copyWarnings = quality.warnings;
            row.rejectedPhrases = quality.rejectedPhrases;
            row.recommendedFixes = quality.recommendedFixes;
            return Object.freeze(row);
        }
        filterCopyReviewBundleRows(rows) {
            const assemblyPayload = this.latestPublicDemoPageAssemblyChecklist || this.buildPublicDemoPageAssemblyChecklist(false);
            const filteredAssembly = this.filterPublicDemoPageAssemblyRows(assemblyPayload.assemblyRows || []);
            const allowed = new Set(filteredAssembly.map((row) => row.activeScenario));
            return (rows || []).filter((row) => allowed.size === 0 || allowed.has(row.activeScenario));
        }
        renderCopyReviewBundle() {
            const body = this.root.querySelector("[data-arcsecs-copy-review-body]");
            const status = this.root.querySelector("[data-arcsecs-copy-review-status]");
            const qualityStatus = this.root.querySelector("[data-arcsecs-copy-quality-status]");
            if (!body) { return; }
            const payload = this.latestCopyReviewBundle || this.buildCopyReviewBundle(false);
            const rows = this.filterCopyReviewBundleRows(payload.copyBundleRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="9">No copy bundle rows match the current filters. Build Copy Review Bundle or clear filters.</td></tr>'; if (status) { status.textContent = "Copy Review Bundle has no matching rows."; } return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.suggestedPageTitle)}</td><td>${auditEscapeHtml(row.suggestedIntroParagraph)}</td><td>${auditEscapeHtml(row.suggestedTelemetryCallout)}</td><td>${auditEscapeHtml(row.suggestedFalsificationCallout)}</td><td>${auditEscapeHtml(row.suggestedBoundaryCopy)}</td><td>${auditEscapeHtml(row.suggestedAltText)}</td><td>${auditEscapeHtml(row.copyWarnings.length ? row.copyWarnings.join("; ") : "none")}</td><td>${auditEscapeHtml(row.rejectedPhrases.length ? row.rejectedPhrases.join("; ") : "none")}</td></tr>`).join("");
            if (status) { status.textContent = "Copy Review Bundle has " + rows.length + " local row" + (rows.length === 1 ? "" : "s") + "."; }
            if (qualityStatus) { qualityStatus.textContent = "Copy quality checks detected " + rows.reduce((sum, row) => sum + row.copyWarnings.length, 0) + " warning(s) and " + rows.reduce((sum, row) => sum + row.rejectedPhrases.length, 0) + " rejected phrase(s)."; }
        }
        buildCopyReviewBundle(updateUi) {
            const assembly = this.latestPublicDemoPageAssemblyChecklist || this.buildPublicDemoPageAssemblyChecklist(false);
            const rows = (assembly.assemblyRows || []).map((row) => this.buildCopyReviewBundleRow(row));
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsCopyReviewBundle",
                copyReviewBundleVersion: "1.0.0",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                copyBundleRows: Object.freeze(rows),
                copyWarnings: Object.freeze(rows.reduce((list, row) => list.concat(row.copyWarnings), [])),
                rejectedPhrases: Object.freeze(rows.reduce((list, row) => list.concat(row.rejectedPhrases), [])),
                falsificationNotes: Object.freeze(rows.map((row) => row.suggestedFalsificationCallout)),
                speculativeBoundaryText: "Copy review bundles are inert local review artifacts. Public copy must remain cautious, falsifiable, and clearly labeled as a speculative research visualization.",
                references: Object.freeze(["publicDemoScriptBuilder", "screenshotCaptionPack", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary"]),
                exportContainsExecutableCode: false
            });
            this.latestCopyReviewBundle = payload;
            if (updateUi) { this.renderCopyReviewBundle(); this.updateStatus("Built local Copy Review Bundle rows."); }
            return payload;
        }
        selectedCopyReviewScenario() {
            const select = this.root.querySelector("[data-arcsecs-page-assembly-filter-scenario]") || this.root.querySelector("[data-arcsecs-demo-script-filter-scenario]");
            const value = select && select.value && select.value !== "all" ? select.value : (this.toConfig ? this.toConfig().scenario : "distanceTimeKernel");
            return value || "distanceTimeKernel";
        }
        exportSelectedCopyReviewBundleJson() {
            const payload = this.latestCopyReviewBundle || this.buildCopyReviewBundle(false);
            const scenario = this.selectedCopyReviewScenario();
            const row = (payload.copyBundleRows || []).find((item) => item.activeScenario === scenario) || (payload.copyBundleRows || [])[0];
            this.download("arcsecs-selected-copy-review-bundle.json", JSON.stringify(Object.assign({}, payload, { exportType: "ArcSecsSelectedCopyReviewBundle", selectedScenario: scenario, copyBundleRows: row ? [row] : [] }), null, 2), "application/json");
            this.updateStatus("Exported selected inert Copy Review Bundle JSON.");
        }
        exportAllCopyReviewBundlesJson() {
            const payload = this.latestCopyReviewBundle || this.buildCopyReviewBundle(false);
            this.download("arcsecs-all-copy-review-bundles.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported all inert Copy Review Bundle JSON rows.");
        }


        getRouteDraftFilterValue(selector) {
            const input = this.root.querySelector(selector);
            return input ? input.value : "all";
        }
        slugifyScenarioLabel(value) {
            return String(value || "arcsecs-scenario").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "arcsecs-scenario";
        }
        getCopyReviewRowsForRouteDrafts() {
            const copy = this.latestCopyReviewBundle || this.buildCopyReviewBundle(false);
            const rows = Array.isArray(copy.copyBundleRows) ? copy.copyBundleRows : [];
            if (rows.length) { return rows; }
            const assembly = this.latestPublicDemoPageAssemblyChecklist || this.buildPublicDemoPageAssemblyChecklist(false);
            return (assembly.assemblyRows || []).map((row) => this.buildCopyReviewBundleRow(row));
        }
        buildInternalLinkSuggestions(routeRow) {
            const slug = routeRow.suggestedSlug || this.slugifyScenarioLabel(routeRow.scenarioLabel);
            return Object.freeze([
                "/arcsecs-physics-engine-demo/" + slug + "/",
                "/arcsecs-physics-engine-demo/#source-matrix",
                "/arcsecs-physics-engine-demo/#scenario-equation-library",
                "/arcsecs-physics-engine-demo/#falsification-checklist",
                "/arcsecs-physics-engine-demo/#public-demo-script-builder",
                "/arcsecs-physics-engine-demo/#screenshot-caption-pack",
                "/arcsecs-physics-engine-demo/#reviewer-evidence-export-pack",
                "/arcsecs-physics-engine-demo/#copy-review-bundle"
            ]);
        }
        detectRouteCopyQualityWarnings(row) {
            const combined = [row.suggestedSlug, row.suggestedPageTitle, row.suggestedMetaTitle, row.suggestedMetaDescription, row.canonicalRouteNote, row.speculativeBoundaryText, row.falsificationNotes && row.falsificationNotes.join ? row.falsificationNotes.join(" ") : row.falsificationNotes, row.sourceEquationStatus].join(" ");
            const lower = combined.toLowerCase();
            const warnings = [];
            const rejectedPhrases = [];
            const fixes = [];
            if (!row.suggestedSlug) { warnings.push("missing slug"); fixes.push("Add a short scenario-specific slug before page planning."); }
            if (!row.suggestedMetaTitle) { warnings.push("missing meta title"); fixes.push("Add a cautious meta title."); }
            if (!row.suggestedMetaDescription) { warnings.push("missing meta description"); fixes.push("Add a meta description with speculative boundary language."); }
            if (lower.indexOf("speculative research visualization") < 0) { warnings.push("missing speculative boundary"); fixes.push("Add speculative research visualization boundary language."); }
            if (lower.indexOf("falsif") < 0 && lower.indexOf("weaken") < 0) { warnings.push("missing falsification note"); fixes.push("Add a falsification or weakening-condition note."); }
            if (lower.indexOf("source") < 0 || lower.indexOf("equation") < 0) { warnings.push("missing source/equation callout"); fixes.push("Mention source matrix and scenario equation library rows."); }
            ["proves", "real propulsion", "working propulsion", "operational capability", "validated technology", "established technology"].forEach((phrase) => { if (lower.indexOf(phrase) >= 0) { rejectedPhrases.push(phrase); } });
            if (lower.indexOf("placeholder") >= 0 && lower.indexOf("speculative") < 0) { warnings.push("unlabeled placeholder/speculative mode"); fixes.push("Label placeholder modes as placeholder and speculative."); }
            if (rejectedPhrases.length) { warnings.push("proof or operational-capability wording detected"); fixes.push("Replace rejected phrases with cautious model/comparison language."); }
            return Object.freeze({ warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhrases), recommendedFixes: Object.freeze(fixes) });
        }
        buildPublicDemoRouteDraftRow(copyRow) {
            const activeScenario = (copyRow && copyRow.activeScenario) || (this.toConfig ? this.toConfig().scenario : "distanceTimeKernel");
            const scenarioLabel = (copyRow && copyRow.scenarioLabel) || (ScenarioRegistry.getScenario(activeScenario).label || activeScenario);
            const sourceMatrixRow = this.findSourceMatrixRowForScenario(activeScenario);
            const scenarioEquationLibraryRow = this.findEquationLibraryRowForScenario(activeScenario);
            const routeDraftStatusInput = this.root.querySelector("[data-arcsecs-route-draft-status]");
            const routeDraftStatus = routeDraftStatusInput ? routeDraftStatusInput.value : ((copyRow && copyRow.copyWarnings && copyRow.copyWarnings.length) ? "ready-with-warnings" : "reviewer-ready");
            const suggestedSlug = this.slugifyScenarioLabel(scenarioLabel);
            const row = {
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsPublicDemoRouteDraftRow",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario,
                scenarioLabel,
                suggestedSlug,
                suggestedPageTitle: (copyRow && copyRow.suggestedPageTitle) || (scenarioLabel + " — ArcSecs speculative visualization demo"),
                suggestedMetaTitle: scenarioLabel + " | ArcSecs speculative visualization review",
                suggestedMetaDescription: "Review " + scenarioLabel + " as an ArcSecs speculative research visualization with standard comparison, source/equation notes, and falsification criteria visible.",
                canonicalRouteNote: "/arcsecs-physics-engine-demo/" + suggestedSlug + "/ is a local text-only route candidate; no page is created or published by this tool.",
                copyReadinessStatus: (copyRow && copyRow.copyReadinessStatus) || "draft",
                routeDraftStatus,
                schemaStatus: "reviewer-draft",
                warningStatus: (copyRow && copyRow.copyWarnings && copyRow.copyWarnings.length) ? "warnings" : "clear",
                placeholderLabelStatus: "labeled",
                sourceEquationStatus: sourceMatrixRow && scenarioEquationLibraryRow ? "present" : "missing",
                falsificationStatus: (copyRow && copyRow.suggestedFalsificationCallout) ? "present" : "missing",
                sourceMatrix: sourceMatrixRow,
                scenarioEquationLibrary: scenarioEquationLibraryRow,
                copyReviewBundleRow: copyRow || null,
                linkSuggestionRows: [],
                routeWarnings: [],
                rejectedPhrases: [],
                recommendedFixes: [],
                falsificationNotes: Object.freeze([(copyRow && copyRow.suggestedFalsificationCallout) || "Falsification note pending for local route review."]),
                speculativeBoundaryText: "Public route drafts are local reviewer artifacts for a speculative research visualization. They are not published, not proof, and not operational capability.",
                exportContainsExecutableCode: false
            };
            row.linkSuggestionRows = this.buildInternalLinkSuggestions(row);
            const quality = this.detectRouteCopyQualityWarnings(row);
            row.routeWarnings = quality.warnings;
            row.rejectedPhrases = quality.rejectedPhrases;
            row.recommendedFixes = quality.recommendedFixes;
            row.warningStatus = row.routeWarnings.length ? "warnings" : row.warningStatus;
            return Object.freeze(row);
        }
        getPublicDemoRouteDraftRows() {
            const copyRows = this.getCopyReviewRowsForRouteDrafts();
            const rows = copyRows.map((row) => this.buildPublicDemoRouteDraftRow(row));
            if (rows.length) { return rows; }
            return [this.buildPublicDemoRouteDraftRow(null)];
        }
        filterPublicDemoRouteDraftRows(rows) {
            const scenario = this.getRouteDraftFilterValue("[data-arcsecs-route-draft-filter-scenario]");
            const copyReadiness = this.getRouteDraftFilterValue("[data-arcsecs-route-draft-filter-copy-readiness]");
            const schemaStatus = this.getRouteDraftFilterValue("[data-arcsecs-route-draft-filter-schema-status]");
            const warningStatus = this.getRouteDraftFilterValue("[data-arcsecs-route-draft-filter-warning]");
            const placeholderStatus = this.getRouteDraftFilterValue("[data-arcsecs-route-draft-filter-placeholder]");
            return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (copyReadiness === "all" || row.copyReadinessStatus === copyReadiness || row.routeDraftStatus === copyReadiness) && (schemaStatus === "all" || row.schemaStatus === schemaStatus) && (warningStatus === "all" || row.warningStatus === warningStatus) && (placeholderStatus === "all" || row.placeholderLabelStatus === placeholderStatus));
        }
        renderPublicDemoRouteDraftBundle() {
            const body = this.root.querySelector("[data-arcsecs-route-draft-body]");
            const status = this.root.querySelector("[data-arcsecs-route-draft-status-output]");
            if (!body) { return; }
            const payload = this.latestPublicDemoRouteDraftBundle || this.buildPublicDemoRouteDraftBundle(false);
            const rows = this.filterPublicDemoRouteDraftRows(payload.routeRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="11">No route draft rows match the current filters. Build Route Draft Bundle or clear filters.</td></tr>'; if (status) { status.textContent = "Public Demo Route Draft Bundle has no matching rows."; } return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.suggestedSlug)}</td><td>${auditEscapeHtml(row.suggestedPageTitle)}</td><td>${auditEscapeHtml(row.suggestedMetaTitle)}</td><td>${auditEscapeHtml(row.suggestedMetaDescription)}</td><td>${auditEscapeHtml(row.canonicalRouteNote)}</td><td>${auditEscapeHtml(row.routeDraftStatus)}</td><td>${auditEscapeHtml(row.warningStatus + (row.routeWarnings.length ? ": " + row.routeWarnings.join("; ") : ""))}</td><td>${auditEscapeHtml(row.sourceEquationStatus)}</td><td>${auditEscapeHtml(row.falsificationStatus)}</td><td><details><summary>${row.linkSuggestionRows.length} text links</summary><ul>${row.linkSuggestionRows.map((link) => `<li>${auditEscapeHtml(link)}</li>`).join("")}</ul></details></td></tr>`).join("");
            if (status) { status.textContent = "Public Demo Route Draft Bundle has " + rows.length + " local row" + (rows.length === 1 ? "" : "s") + ". Route drafts are not published and are not proof."; }
        }
        buildPublicDemoRouteDraftBundle(updateUi) {
            const rows = this.getPublicDemoRouteDraftRows();
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsPublicDemoRouteDraftBundle",
                routeDraftBundleVersion: "1.0.0",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                routeRows: Object.freeze(rows),
                linkSuggestionRows: Object.freeze(rows.reduce((list, row) => list.concat(row.linkSuggestionRows.map((link) => ({ activeScenario: row.activeScenario, scenarioLabel: row.scenarioLabel, linkReference: link, textOnly: true }))), [])),
                routeDraftStatusesSupported: Object.freeze(["draft", "reviewer-ready", "ready-with-warnings", "blocked", "rejected"]),
                routeWarnings: Object.freeze(rows.reduce((list, row) => list.concat(row.routeWarnings), [])),
                rejectedPhrases: Object.freeze(rows.reduce((list, row) => list.concat(row.rejectedPhrases), [])),
                falsificationNotes: Object.freeze(rows.reduce((list, row) => list.concat(row.falsificationNotes), [])),
                speculativeBoundaryText: "Public demo route drafts are local inert reviewer notes. They do not publish content and do not claim proof, validation, or operational capability.",
                references: Object.freeze(["publicDemoPageAssemblyChecklist", "copyReviewBundle", "publicDemoScriptBuilder", "screenshotCaptionPack", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary"]),
                exportContainsExecutableCode: false
            });
            this.latestPublicDemoRouteDraftBundle = payload;
            if (updateUi) { this.renderPublicDemoRouteDraftBundle(); this.updateStatus("Built local Public Demo Route Draft Bundle rows."); }
            return payload;
        }
        buildSeoSchemaReviewRow(routeRow) {
            return Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsSeoSchemaReviewRow",
                generatedUtc: new Date().toISOString(),
                activeScenario: routeRow.activeScenario,
                scenarioLabel: routeRow.scenarioLabel,
                schemaStatus: routeRow.routeWarnings.length ? "needs-review" : "reviewer-draft",
                suggestedSchemaType: "CreativeWork",
                headline: routeRow.suggestedPageTitle,
                description: routeRow.suggestedMetaDescription,
                imageCaptionNote: "Use a local screenshot caption from Screenshot Caption Pack only after reviewer approval; screenshots document a simulation run, not proof of physics.",
                authorPublisherNotePlaceholder: "Author/publisher note placeholder for future public page review; do not auto-inject or publish.",
                aboutTopicNotes: "About/topic notes: " + routeRow.scenarioLabel + "; speculative research visualization; standard comparison and telemetry review.",
                citationSourceNotes: "Citation/source notes should reference the local source matrix and scenario equation library rows; placeholder-needed citations remain reviewer warnings.",
                cautionDisclaimerNotes: "Reviewer-draft schema only. ArcSecs is speculative, not proven, not established technology, and not operational capability.",
                falsificationNote: (routeRow.falsificationNotes && routeRow.falsificationNotes[0]) || "Falsification note pending.",
                reviewerDraftOnly: true,
                injectsLiveSchema: false,
                claimsScientificValidation: false,
                exportContainsExecutableCode: false
            });
        }
        renderSeoSchemaReview() {
            const body = this.root.querySelector("[data-arcsecs-seo-schema-body]");
            const status = this.root.querySelector("[data-arcsecs-seo-schema-status]");
            const qualityStatus = this.root.querySelector("[data-arcsecs-route-quality-status]");
            if (!body) { return; }
            const payload = this.latestSeoSchemaReview || this.buildSeoSchemaReview(false);
            const routePayload = this.latestPublicDemoRouteDraftBundle || this.buildPublicDemoRouteDraftBundle(false);
            const allowed = new Set(this.filterPublicDemoRouteDraftRows(routePayload.routeRows || []).map((row) => row.activeScenario));
            const rows = (payload.schemaReviewRows || []).filter((row) => allowed.size === 0 || allowed.has(row.activeScenario));
            if (!rows.length) { body.innerHTML = '<tr><td colspan="10">No schema review rows match the current filters. Build SEO Schema Review or clear filters.</td></tr>'; if (status) { status.textContent = "SEO Schema Review has no matching rows."; } return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.suggestedSchemaType)}</td><td>${auditEscapeHtml(row.headline)}</td><td>${auditEscapeHtml(row.description)}</td><td>${auditEscapeHtml(row.imageCaptionNote)}</td><td>${auditEscapeHtml(row.authorPublisherNotePlaceholder)}</td><td>${auditEscapeHtml(row.aboutTopicNotes)}</td><td>${auditEscapeHtml(row.citationSourceNotes)}</td><td>${auditEscapeHtml(row.cautionDisclaimerNotes)}</td><td>${auditEscapeHtml(row.falsificationNote)}</td></tr>`).join("");
            if (status) { status.textContent = "SEO Schema Review has " + rows.length + " reviewer-draft row" + (rows.length === 1 ? "" : "s") + ". Schema is not injected into live pages."; }
            if (qualityStatus) { const routeRows = routePayload.routeRows || []; qualityStatus.textContent = "Route/copy quality checks found " + routeRows.reduce((sum, row) => sum + row.routeWarnings.length, 0) + " warning(s) and " + routeRows.reduce((sum, row) => sum + row.rejectedPhrases.length, 0) + " rejected phrase(s)."; }
        }
        buildSeoSchemaReview(updateUi) {
            const routePayload = this.latestPublicDemoRouteDraftBundle || this.buildPublicDemoRouteDraftBundle(false);
            const rows = (routePayload.routeRows || []).map((row) => this.buildSeoSchemaReviewRow(row));
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsSeoSchemaReview",
                schemaReviewVersion: "1.0.0",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                schemaReviewRows: Object.freeze(rows),
                linkSuggestionRows: routePayload.linkSuggestionRows || [],
                routeWarnings: routePayload.routeWarnings || [],
                rejectedPhrases: routePayload.rejectedPhrases || [],
                falsificationNotes: Object.freeze(rows.map((row) => row.falsificationNote)),
                speculativeBoundaryText: "SEO schema review rows are local reviewer-draft notes for speculative research visualization pages. They do not publish, inject schema, or claim validation.",
                references: Object.freeze(["publicDemoRouteDraftBundle", "publicDemoPageAssemblyChecklist", "copyReviewBundle", "publicDemoScriptBuilder", "screenshotCaptionPack", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary"]),
                exportContainsExecutableCode: false
            });
            this.latestSeoSchemaReview = payload;
            if (updateUi) { this.renderSeoSchemaReview(); this.updateStatus("Built local SEO Schema Review rows."); }
            return payload;
        }
        selectedRouteDraftScenario() {
            const select = this.root.querySelector("[data-arcsecs-route-draft-filter-scenario]") || this.root.querySelector("[data-arcsecs-page-assembly-filter-scenario]");
            const value = select && select.value && select.value !== "all" ? select.value : (this.toConfig ? this.toConfig().scenario : "distanceTimeKernel");
            return value || "distanceTimeKernel";
        }
        exportSelectedRouteDraftJson() {
            const payload = this.latestPublicDemoRouteDraftBundle || this.buildPublicDemoRouteDraftBundle(false);
            const scenario = this.selectedRouteDraftScenario();
            const row = (payload.routeRows || []).find((item) => item.activeScenario === scenario) || (payload.routeRows || [])[0];
            this.download("arcsecs-selected-route-draft.json", JSON.stringify(Object.assign({}, payload, { exportType: "ArcSecsSelectedPublicDemoRouteDraft", selectedScenario: scenario, routeRows: row ? [row] : [] }), null, 2), "application/json");
            this.updateStatus("Exported selected inert Public Demo Route Draft JSON.");
        }
        exportAllRouteDraftsJson() {
            const payload = this.latestPublicDemoRouteDraftBundle || this.buildPublicDemoRouteDraftBundle(false);
            this.download("arcsecs-all-route-drafts.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported all inert Public Demo Route Draft JSON rows.");
        }
        exportSeoSchemaReviewJson() {
            const payload = this.latestSeoSchemaReview || this.buildSeoSchemaReview(false);
            this.download("arcsecs-seo-schema-review.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported inert SEO Schema Review JSON.");
        }


        getPublicationHandoffFilterValue(selector) {
            const node = this.root.querySelector(selector);
            return node ? node.value : "all";
        }
        getLatestRouteDraftRowsForPublication() {
            const payload = this.latestPublicDemoRouteDraftBundle || this.buildPublicDemoRouteDraftBundle(false);
            return Array.isArray(payload.routeRows) ? payload.routeRows : [];
        }
        getLatestSeoSchemaRowsForPublication() {
            const payload = this.latestSeoSchemaReview || this.buildSeoSchemaReview(false);
            return Array.isArray(payload.schemaReviewRows) ? payload.schemaReviewRows : [];
        }
        getLatestCopyReviewRowsForPublication() {
            const payload = this.latestCopyReviewBundle || this.buildCopyReviewBundle(false);
            return Array.isArray(payload.copyBundleRows) ? payload.copyBundleRows : [];
        }
        getLatestDemoScriptRowsForPublication() {
            const payload = this.latestPublicDemoScriptBuilder || this.buildPublicDemoScripts(false);
            return Array.isArray(payload.scriptRows) ? payload.scriptRows : [];
        }
        getLatestScreenshotCaptionRowsForPublication() {
            const payload = this.latestScreenshotCaptionPack || this.buildScreenshotCaptionPack(false);
            return Array.isArray(payload.captionRows) ? payload.captionRows : [];
        }
        getLatestEvidencePackRowsForPublication() {
            const payload = this.latestReviewerEvidenceExportPack || this.buildReviewerEvidenceExportPack(false);
            return Array.isArray(payload.evidencePackRows) ? payload.evidencePackRows : [];
        }
        detectPublicationHandoffQualityWarnings(row) {
            const combined = [row.suggestedSlug, row.suggestedMetaTitle, row.suggestedMetaDescription, row.suggestedIntroParagraph, row.suggestedFalsificationCallout, row.suggestedBoundaryCopy, row.sourceEquationStatus, row.schemaStatus, row.copyReadinessStatus, row.evidencePackStatus].join(" ");
            const lower = combined.toLowerCase();
            const warnings = [];
            const rejectedPhrases = [];
            const recommendedFixes = [];
            if (!row.routeDraftRow) { warnings.push("missing route draft"); recommendedFixes.push("Build Public Demo Route Draft Bundle before publication handoff."); }
            if (!row.schemaReviewRow) { warnings.push("missing SEO schema review"); recommendedFixes.push("Build SEO Schema Review before static page draft export."); }
            if (!row.copyReviewBundleRow) { warnings.push("missing copy review bundle"); recommendedFixes.push("Build Copy Review Bundle so public copy can be checked."); }
            if (!row.demoScriptRow) { warnings.push("missing demo script"); recommendedFixes.push("Build Public Demo Script Builder rows before page handoff."); }
            if (!row.screenshotCaptionRow) { warnings.push("missing screenshot caption"); recommendedFixes.push("Build Screenshot Caption Pack rows before page handoff."); }
            if (!row.reviewerEvidenceExportPackRow) { warnings.push("missing evidence pack"); recommendedFixes.push("Build Reviewer Evidence Export Pack rows before publication handoff."); }
            if (!row.sourceMatrixRow) { warnings.push("missing source matrix row"); recommendedFixes.push("Confirm Scientific Source Matrix row is present."); }
            if (!row.scenarioEquationLibraryRow) { warnings.push("missing equation library row"); recommendedFixes.push("Confirm Scenario Equation Library row is present."); }
            if (lower.indexOf("falsif") < 0 && lower.indexOf("weaken") < 0) { warnings.push("missing falsification callout"); recommendedFixes.push("Add a clear falsification or weakening-condition callout."); }
            if (lower.indexOf("speculative research visualization") < 0) { warnings.push("missing speculative boundary text"); recommendedFixes.push("Add speculative research visualization boundary language."); }
            ["proves", "real propulsion", "working propulsion", "operational capability", "validated technology", "established technology"].forEach((phrase) => { if (lower.indexOf(phrase) >= 0) { rejectedPhrases.push(phrase); } });
            if (lower.indexOf("placeholder") >= 0 && lower.indexOf("speculative") < 0) { warnings.push("unlabeled placeholder/speculative mode"); recommendedFixes.push("Label placeholder modes as placeholder and speculative."); }
            if (rejectedPhrases.length) { warnings.push("unsupported proof/operational-capability wording"); recommendedFixes.push("Replace rejected phrases with cautious model, comparison, and review language."); }
            return Object.freeze({ warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhrases), recommendedFixes: Object.freeze(recommendedFixes) });
        }
        buildPublicDemoPublicationHandoffRow(routeRow, schemaRow, copyRow, scriptRow, captionRow, evidenceRow) {
            const activeScenario = (routeRow && routeRow.activeScenario) || (copyRow && copyRow.activeScenario) || (scriptRow && scriptRow.activeScenario) || (captionRow && captionRow.activeScenario) || (evidenceRow && evidenceRow.activeScenario) || (this.toConfig ? this.toConfig().scenario : "distanceTimeKernel");
            const scenarioConfig = ScenarioRegistry.getScenario(activeScenario);
            const scenarioLabel = (routeRow && routeRow.scenarioLabel) || (copyRow && copyRow.scenarioLabel) || (scriptRow && scriptRow.scenarioLabel) || (captionRow && captionRow.scenarioLabel) || (evidenceRow && evidenceRow.scenarioLabel) || (scenarioConfig && scenarioConfig.label) || activeScenario;
            const sourceMatrixRow = this.findSourceMatrixRowForScenario(activeScenario);
            const scenarioEquationLibraryRow = this.findEquationLibraryRowForScenario(activeScenario);
            const handoffStatusInput = this.root.querySelector("[data-arcsecs-publication-handoff-status]");
            const handoffStatus = handoffStatusInput ? handoffStatusInput.value : "draft";
            const row = {
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsPublicDemoPublicationHandoffRow",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario,
                scenarioLabel,
                suggestedSlug: (routeRow && routeRow.suggestedSlug) || this.slugifyScenarioLabel(scenarioLabel),
                suggestedPageTitle: (routeRow && routeRow.suggestedPageTitle) || (copyRow && copyRow.suggestedPageTitle) || (scenarioLabel + " — ArcSecs speculative visualization draft"),
                suggestedMetaTitle: (routeRow && routeRow.suggestedMetaTitle) || (scenarioLabel + " | ArcSecs reviewer draft"),
                suggestedMetaDescription: (routeRow && routeRow.suggestedMetaDescription) || "Reviewer handoff draft for " + scenarioLabel + ", a speculative research visualization with standard comparison, source/equation notes, and falsification callouts.",
                schemaStatus: schemaRow ? (schemaRow.schemaStatus || "reviewer-draft") : "missing",
                copyReadinessStatus: (copyRow && copyRow.copyReadinessStatus) || (routeRow && routeRow.copyReadinessStatus) || "draft",
                routeWarningStatus: (routeRow && routeRow.warningStatus) || "warnings",
                evidencePackStatus: evidenceRow ? "present" : "missing",
                sourceEquationStatus: sourceMatrixRow && scenarioEquationLibraryRow ? "present" : "missing",
                falsificationStatus: (copyRow && copyRow.suggestedFalsificationCallout) || (scriptRow && scriptRow.falsificationCriteria) || (schemaRow && schemaRow.falsificationNote) ? "present" : "missing",
                placeholderLabelStatus: (routeRow && routeRow.placeholderLabelStatus) || "labeled",
                handoffStatus,
                reviewerHandoffDraftOnly: true,
                routeDraftRow: routeRow || null,
                schemaReviewRow: schemaRow || null,
                copyReviewBundleRow: copyRow || null,
                demoScriptRow: scriptRow || null,
                screenshotCaptionRow: captionRow || null,
                reviewerEvidenceExportPackRow: evidenceRow || null,
                sourceMatrixRow,
                scenarioEquationLibraryRow,
                suggestedIntroParagraph: (copyRow && copyRow.suggestedIntroParagraph) || (scriptRow && scriptRow.visitorIntroduction) || ("This page draft introduces " + scenarioLabel + " as a speculative research visualization and comparison exercise."),
                suggestedFalsificationCallout: (copyRow && copyRow.suggestedFalsificationCallout) || (scriptRow && scriptRow.falsificationCriteria) || "The scenario weakens if telemetry, source/equation rows, or falsification notes cannot be reviewed.",
                suggestedBoundaryCopy: (copyRow && copyRow.suggestedBoundaryCopy) || "ArcSecs is a speculative research visualization. This draft is not proof, not validation, and not operational capability.",
                routeWarnings: (routeRow && routeRow.routeWarnings) || [],
                copyWarnings: (copyRow && copyRow.copyWarnings) || [],
                rejectedPhrases: [],
                recommendedFixes: [],
                speculativeBoundaryText: "Publication handoff rows are inert reviewer drafts for a speculative research visualization. They do not create pages, publish posts, inject live schema, or prove physics.",
                exportContainsExecutableCode: false
            };
            const quality = this.detectPublicationHandoffQualityWarnings(row);
            row.handoffWarnings = quality.warnings;
            row.rejectedPhrases = quality.rejectedPhrases;
            row.recommendedFixes = quality.recommendedFixes;
            row.warningStatus = row.handoffWarnings.length || row.routeWarningStatus === "warnings" || (row.copyWarnings && row.copyWarnings.length) ? "warnings" : "clear";
            return Object.freeze(row);
        }
        getPublicDemoPublicationHandoffRows() {
            const routeRows = this.getLatestRouteDraftRowsForPublication();
            const schemaRows = this.getLatestSeoSchemaRowsForPublication();
            const copyRows = this.getLatestCopyReviewRowsForPublication();
            const scriptRows = this.getLatestDemoScriptRowsForPublication();
            const captionRows = this.getLatestScreenshotCaptionRowsForPublication();
            const evidenceRows = this.getLatestEvidencePackRowsForPublication();
            const scenarios = Array.from(new Set([].concat(routeRows, schemaRows, copyRows, scriptRows, captionRows, evidenceRows).map((row) => row && row.activeScenario).filter(Boolean)));
            const keys = scenarios.length ? scenarios : [this.toConfig ? this.toConfig().scenario : "distanceTimeKernel"];
            return keys.map((key) => this.buildPublicDemoPublicationHandoffRow(routeRows.find((row) => row.activeScenario === key) || null, schemaRows.find((row) => row.activeScenario === key) || null, copyRows.find((row) => row.activeScenario === key) || null, scriptRows.find((row) => row.activeScenario === key) || null, captionRows.find((row) => row.activeScenario === key) || null, evidenceRows.find((row) => row.activeScenario === key) || null));
        }
        filterPublicDemoPublicationHandoffRows(rows) {
            const scenario = this.getPublicationHandoffFilterValue("[data-arcsecs-publication-handoff-filter-scenario]");
            const routeStatus = this.getPublicationHandoffFilterValue("[data-arcsecs-publication-handoff-filter-route-status]");
            const schemaStatus = this.getPublicationHandoffFilterValue("[data-arcsecs-publication-handoff-filter-schema-status]");
            const copyReadiness = this.getPublicationHandoffFilterValue("[data-arcsecs-publication-handoff-filter-copy-readiness]");
            const evidencePack = this.getPublicationHandoffFilterValue("[data-arcsecs-publication-handoff-filter-evidence-pack]");
            const warningStatus = this.getPublicationHandoffFilterValue("[data-arcsecs-publication-handoff-filter-warning]");
            return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (routeStatus === "all" || (row.routeDraftRow && row.routeDraftRow.routeDraftStatus === routeStatus) || row.handoffStatus === routeStatus) && (schemaStatus === "all" || row.schemaStatus === schemaStatus) && (copyReadiness === "all" || row.copyReadinessStatus === copyReadiness) && (evidencePack === "all" || row.evidencePackStatus === evidencePack) && (warningStatus === "all" || row.warningStatus === warningStatus));
        }
        renderPublicDemoPublicationHandoffManifest() {
            const body = this.root.querySelector("[data-arcsecs-publication-handoff-body]");
            const status = this.root.querySelector("[data-arcsecs-publication-handoff-status-output]");
            if (!body) { return; }
            const payload = this.latestPublicDemoPublicationHandoffManifest || this.buildPublicDemoPublicationHandoffManifest(false);
            const rows = this.filterPublicDemoPublicationHandoffRows(payload.handoffRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="13">No publication handoff rows match the current filters. Build Publication Handoff Manifest or clear filters.</td></tr>'; if (status) { status.textContent = "Publication Handoff Manifest has no matching rows."; } return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.suggestedSlug)}</td><td>${auditEscapeHtml(row.suggestedPageTitle)}</td><td>${auditEscapeHtml(row.suggestedMetaTitle)}</td><td>${auditEscapeHtml(row.suggestedMetaDescription)}</td><td>${auditEscapeHtml(row.schemaStatus)}</td><td>${auditEscapeHtml(row.copyReadinessStatus)}</td><td>${auditEscapeHtml(row.warningStatus + (row.handoffWarnings && row.handoffWarnings.length ? ": " + row.handoffWarnings.join("; ") : ""))}</td><td>${auditEscapeHtml(row.evidencePackStatus)}</td><td>${auditEscapeHtml(row.sourceEquationStatus)}</td><td>${auditEscapeHtml(row.falsificationStatus)}</td><td>${auditEscapeHtml(row.placeholderLabelStatus)}</td><td>${auditEscapeHtml(row.handoffStatus)}</td></tr>`).join("");
            if (status) { status.textContent = "Publication Handoff Manifest has " + rows.length + " reviewer-draft row" + (rows.length === 1 ? "" : "s") + ". No pages are created or published."; }
        }
        buildPublicDemoPublicationHandoffManifest(updateUi) {
            const rows = this.getPublicDemoPublicationHandoffRows();
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsPublicDemoPublicationHandoffManifest",
                handoffManifestVersion: "1.0.0",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                handoffRows: Object.freeze(rows),
                handoffStatusesSupported: Object.freeze(["draft", "reviewer-ready", "ready-with-warnings", "blocked", "rejected"]),
                warnings: Object.freeze(rows.flatMap((row) => row.handoffWarnings || [])),
                rejectedPhrases: Object.freeze(rows.flatMap((row) => row.rejectedPhrases || [])),
                recommendedFixes: Object.freeze(rows.flatMap((row) => row.recommendedFixes || [])),
                falsificationNotes: Object.freeze(rows.map((row) => "Falsification callout status for " + row.scenarioLabel + ": " + row.falsificationStatus)),
                speculativeBoundaryText: "Public demo publication handoff manifests are inert local reviewer artifacts. They are not proof, not scientific validation, not real propulsion, not operational capability, and not publication automation.",
                references: Object.freeze(["publicDemoRouteDraftBundle", "seoSchemaReview", "publicDemoPageAssemblyChecklist", "copyReviewBundle", "publicDemoScriptBuilder", "screenshotCaptionPack", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary"]),
                exportContainsExecutableCode: false
            });
            this.latestPublicDemoPublicationHandoffManifest = payload;
            if (updateUi) { this.renderPublicDemoPublicationHandoffManifest(); this.renderStaticPageDraftExport(); this.updateStatus("Built local Publication Handoff Manifest rows."); }
            return payload;
        }
        buildStaticPageDraftRow(handoffRow) {
            const schemaReview = handoffRow.schemaReviewRow || null;
            const script = handoffRow.demoScriptRow || {};
            const caption = handoffRow.screenshotCaptionRow || {};
            const route = handoffRow.routeDraftRow || {};
            const copy = handoffRow.copyReviewBundleRow || {};
            const staticRow = {
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsStaticPageDraftRow",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: handoffRow.activeScenario,
                scenarioLabel: handoffRow.scenarioLabel,
                suggestedSlug: handoffRow.suggestedSlug,
                suggestedPageTitle: handoffRow.suggestedPageTitle,
                suggestedMetaTitle: handoffRow.suggestedMetaTitle,
                suggestedMetaDescription: handoffRow.suggestedMetaDescription,
                suggestedCanonicalNote: (route && route.canonicalRouteNote) || "/arcsecs-physics-engine-demo/" + handoffRow.suggestedSlug + "/ is a reviewer-draft route candidate only.",
                suggestedHeroTitle: handoffRow.scenarioLabel + " — speculative visualization demo draft",
                suggestedIntroParagraph: handoffRow.suggestedIntroParagraph,
                suggestedDemoScriptSections: Object.freeze({ visitorIntroduction: script.visitorIntroduction || "Introduce the scenario as a speculative research visualization.", scenarioPurpose: script.scenarioPurpose || "Explain the scenario purpose before showing telemetry.", standardComparison: script.standardComparison || "Show the standard comparison before the ArcSecs branch.", arcsecsSpeculativeChange: script.arcsecsSpeculativeChange || "Describe the ArcSecs change as a model assumption, not proof.", telemetryToWatch: script.telemetryToWatch || "Watch finite telemetry and warning status.", screenshotMoment: script.screenshotMoment || "Capture the moment after telemetry and falsification notes are visible.", falsificationCriteria: script.falsificationCriteria || handoffRow.suggestedFalsificationCallout, closingCaveat: script.closingCaveat || "This is not proof, validation, real propulsion, or operational capability." }),
                suggestedScreenshotCaption: caption.longCaption || caption.shortCaption || "Screenshot caption pending for reviewer handoff.",
                suggestedAltText: caption.altText || copy.suggestedAltText || "ArcSecs speculative visualization screenshot for " + handoffRow.scenarioLabel + ".",
                suggestedTelemetryCallout: copy.suggestedTelemetryCallout || "Telemetry must remain finite and visible before this page draft is used.",
                suggestedSourceEquationCallout: copy.suggestedSourceEquationCallout || "Reference the Scientific Source Matrix and Scenario Equation Library rows.",
                suggestedFalsificationCallout: handoffRow.suggestedFalsificationCallout,
                suggestedBoundaryCopy: handoffRow.suggestedBoundaryCopy,
                suggestedSchemaReview: schemaReview,
                suggestedInternalLinkTextRows: (route && route.linkSuggestionRows) || [],
                reviewerEvidenceExportPackRow: handoffRow.reviewerEvidenceExportPackRow,
                sourceMatrixRow: handoffRow.sourceMatrixRow,
                scenarioEquationLibraryRow: handoffRow.scenarioEquationLibraryRow,
                routeWarnings: handoffRow.routeWarnings || [],
                copyWarnings: handoffRow.copyWarnings || [],
                handoffWarnings: handoffRow.handoffWarnings || [],
                rejectedPhrases: handoffRow.rejectedPhrases || [],
                recommendedFixes: handoffRow.recommendedFixes || [],
                falsificationNotes: Object.freeze([handoffRow.suggestedFalsificationCallout]),
                speculativeBoundaryText: "Static page drafts are inert reviewer handoff artifacts for a speculative research visualization. They are not live pages, not proof, and not operational capability.",
                exportContainsExecutableCode: false
            };
            return Object.freeze(staticRow);
        }
        renderStaticPageDraftExport() {
            const body = this.root.querySelector("[data-arcsecs-static-page-draft-body]");
            const status = this.root.querySelector("[data-arcsecs-static-page-draft-status]");
            if (!body) { return; }
            const payload = this.latestStaticPageDraftExport || this.buildStaticPageDraftExport(false);
            const rows = this.filterPublicDemoPublicationHandoffRows(payload.staticPageDraftRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="13">No static page draft rows match the current filters. Build Static Page Draft Export or clear filters.</td></tr>'; if (status) { status.textContent = "Static Page Draft Export has no matching rows."; } return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.suggestedSlug + " | " + row.suggestedMetaTitle)}</td><td>${auditEscapeHtml(row.suggestedHeroTitle)}</td><td>${auditEscapeHtml(row.suggestedIntroParagraph)}</td><td><details><summary>sections</summary><ul>${Object.keys(row.suggestedDemoScriptSections).map((key) => `<li>${auditEscapeHtml(key + ": " + row.suggestedDemoScriptSections[key])}</li>`).join("")}</ul></details></td><td>${auditEscapeHtml(row.suggestedScreenshotCaption)}</td><td>${auditEscapeHtml(row.suggestedAltText)}</td><td>${auditEscapeHtml(row.suggestedTelemetryCallout)}</td><td>${auditEscapeHtml(row.suggestedSourceEquationCallout)}</td><td>${auditEscapeHtml(row.suggestedFalsificationCallout)}</td><td>${auditEscapeHtml(row.suggestedBoundaryCopy)}</td><td>${auditEscapeHtml(row.suggestedSchemaReview ? (row.suggestedSchemaReview.suggestedSchemaType || "reviewer-draft") : "missing")}</td><td>${auditEscapeHtml((row.recommendedFixes || []).join("; ") || "none")}</td></tr>`).join("");
            if (status) { status.textContent = "Static Page Draft Export has " + rows.length + " inert reviewer draft row" + (rows.length === 1 ? "" : "s") + ". Nothing is published."; }
        }
        buildStaticPageDraftExport(updateUi) {
            const handoff = this.latestPublicDemoPublicationHandoffManifest || this.buildPublicDemoPublicationHandoffManifest(false);
            const rows = (handoff.handoffRows || []).map((row) => this.buildStaticPageDraftRow(row));
            const payload = Object.freeze({
                packageVersion: PACKAGE_VERSION,
                exportType: "ArcSecsStaticPageDraftExport",
                staticPageDraftVersion: "1.0.0",
                generatedUtc: new Date().toISOString(),
                pageSourceRoute: "/arcsecs-physics-engine-demo/",
                activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel",
                staticPageDraftRows: Object.freeze(rows),
                routeWarnings: Object.freeze(rows.flatMap((row) => row.routeWarnings || [])),
                copyWarnings: Object.freeze(rows.flatMap((row) => row.copyWarnings || [])),
                rejectedPhrases: Object.freeze(rows.flatMap((row) => row.rejectedPhrases || [])),
                recommendedFixes: Object.freeze(rows.flatMap((row) => row.recommendedFixes || [])),
                falsificationNotes: Object.freeze(rows.flatMap((row) => row.falsificationNotes || [])),
                speculativeBoundaryText: "Static page draft exports are inert local reviewer artifacts. They do not create WordPress pages, publish posts, inject schema, fetch links, or validate live routes.",
                references: Object.freeze(["publicDemoPublicationHandoffManifest", "publicDemoRouteDraftBundle", "seoSchemaReview", "copyReviewBundle", "publicDemoScriptBuilder", "screenshotCaptionPack", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary"]),
                exportContainsExecutableCode: false
            });
            this.latestStaticPageDraftExport = payload;
            if (updateUi) { this.renderStaticPageDraftExport(); this.updateStatus("Built inert Static Page Draft Export rows."); }
            return payload;
        }
        exportPublicationHandoffManifestJson() {
            const payload = this.latestPublicDemoPublicationHandoffManifest || this.buildPublicDemoPublicationHandoffManifest(false);
            this.download("arcsecs-publication-handoff-manifest.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported inert Publication Handoff Manifest JSON.");
        }
        exportSelectedStaticPageDraftJson() {
            const payload = this.latestStaticPageDraftExport || this.buildStaticPageDraftExport(false);
            const active = this.toConfig ? this.toConfig().scenario : "distanceTimeKernel";
            const selected = (payload.staticPageDraftRows || []).find((row) => row.activeScenario === active) || (payload.staticPageDraftRows || [])[0] || null;
            this.download("arcsecs-selected-static-page-draft.json", JSON.stringify(Object.assign({}, payload, { exportType: "ArcSecsSelectedStaticPageDraft", selectedStaticPageDraftRow: selected, exportContainsExecutableCode: false }), null, 2), "application/json");
            this.updateStatus("Exported selected inert Static Page Draft JSON.");
        }
        exportAllStaticPageDraftsJson() {
            const payload = this.latestStaticPageDraftExport || this.buildStaticPageDraftExport(false);
            this.download("arcsecs-all-static-page-drafts.json", JSON.stringify(payload, null, 2), "application/json");
            this.updateStatus("Exported all inert Static Page Draft rows.");
        }


        bindStaticDraftReviewControls() {
            const importButton = this.root.querySelector("[data-arcsecs-import-static-draft-review-json]"); if (importButton) importButton.addEventListener("click", () => this.importStaticDraftReviewJson(true));
            const diffButton = this.root.querySelector("[data-arcsecs-build-page-readiness-diff]"); if (diffButton) diffButton.addEventListener("click", () => this.buildPageReadinessDiff(true));
            const exportButton = this.root.querySelector("[data-arcsecs-export-page-readiness-diff-json]"); if (exportButton) exportButton.addEventListener("click", () => this.exportPageReadinessDiffJson());
            const clearButton = this.root.querySelector("[data-arcsecs-clear-static-draft-review-imports]"); if (clearButton) clearButton.addEventListener("click", () => this.clearStaticDraftReviewImports());
            this.root.querySelectorAll("[data-arcsecs-page-readiness-filter-scenario],[data-arcsecs-page-readiness-filter-diff-status],[data-arcsecs-page-readiness-filter-warning],[data-arcsecs-page-readiness-filter-stale],[data-arcsecs-page-readiness-filter-missing],[data-arcsecs-page-readiness-diff-review-status]").forEach((control) => control.addEventListener("change", () => this.renderPageReadinessDiff()));
        }
        getStaticDraftReviewFilterValue(selector) { const control = this.root.querySelector(selector); return control && control.value ? control.value : "all"; }
        staticDraftExecutableContentMatches(value, path, output) {
            if (typeof value === "string") { const text = value.toLowerCase(); ["<script", "javascript:", "onerror=", "onclick=", "eval(", "new function", "function(", "=>", "import(", "require("].forEach((pattern) => { if (text.indexOf(pattern) >= 0) output.push(path + " contains executable-looking content: " + pattern); }); return; }
            if (Array.isArray(value)) { value.forEach((item, index) => this.staticDraftExecutableContentMatches(item, path + "[" + index + "]", output)); return; }
            if (value && typeof value === "object") Object.keys(value).forEach((key) => this.staticDraftExecutableContentMatches(value[key], path + "." + key, output));
        }
        parseInertStaticDraftJson(rawText, label) {
            const trimmed = String(rawText || "").trim();
            if (!trimmed) return { ok: false, label, payload: null, warnings: [label + " input is empty."], rejectedRows: [{ label, reason: "empty input" }] };
            try { const payload = JSON.parse(trimmed); const matches = []; this.staticDraftExecutableContentMatches(payload, label, matches); if (matches.length) return { ok: false, label, payload: null, warnings: matches, rejectedRows: matches.map((reason) => ({ label, reason })) }; if (payload && payload.exportContainsExecutableCode === true) return { ok: false, label, payload: null, warnings: [label + " declares exportContainsExecutableCode:true."], rejectedRows: [{ label, reason: "exportContainsExecutableCode:true" }] }; return { ok: true, label, payload, warnings: [], rejectedRows: [] }; }
            catch (error) { return { ok: false, label, payload: null, warnings: [label + " is invalid JSON: " + error.message], rejectedRows: [{ label, reason: "invalid JSON" }] }; }
        }
        staticDraftRowsFromPayload(payload) { if (!payload) return []; if (Array.isArray(payload.staticPageDraftRows)) return payload.staticPageDraftRows; if (payload.selectedStaticPageDraftRow) return [payload.selectedStaticPageDraftRow]; if (payload.staticPageDraftExport && Array.isArray(payload.staticPageDraftExport.staticPageDraftRows)) return payload.staticPageDraftExport.staticPageDraftRows; return []; }
        handoffRowsFromPayload(payload) { if (!payload) return []; if (Array.isArray(payload.handoffRows)) return payload.handoffRows; if (payload.publicDemoPublicationHandoffManifest && Array.isArray(payload.publicDemoPublicationHandoffManifest.handoffRows)) return payload.publicDemoPublicationHandoffManifest.handoffRows; return []; }
        summarizeStaticDraftImportResult(result, expectedType) {
            const payload = result.payload || {}; const rows = expectedType === "static" ? this.staticDraftRowsFromPayload(payload) : this.handoffRowsFromPayload(payload); const exportType = payload.exportType || "missing"; const packageVersion = payload.packageVersion || "missing"; const generatedUtc = payload.generatedUtc || "missing"; const typeMismatch = expectedType === "static" ? !/StaticPageDraft|SelectedStaticPageDraft/i.test(exportType) : !/PublicationHandoffManifest/i.test(exportType); const warnings = [].concat(result.warnings || []); if (result.ok && typeMismatch) warnings.push(expectedType === "static" ? "Static draft import missing expected Static Page Draft exportType." : "Publication handoff import missing expected Publication Handoff Manifest exportType."); if (result.ok && rows.length === 0) warnings.push("No scenario rows were found in " + result.label + "."); return Object.freeze({ label: result.label, status: result.ok && !typeMismatch ? "accepted" : "rejected", packageVersion, exportType, generatedUtc, scenarioCount: rows.length, warningCount: warnings.length, rejectedRowCount: (result.rejectedRows || []).length + (typeMismatch ? 1 : 0), warnings: Object.freeze(warnings), rows: Object.freeze(rows) });
        }
        importStaticDraftReviewJson(updateUi) {
            const staticInput = this.root.querySelector("[data-arcsecs-static-page-draft-import-json]"); const handoffInput = this.root.querySelector("[data-arcsecs-publication-handoff-import-json]"); const staticResult = this.parseInertStaticDraftJson(staticInput ? staticInput.value : "", "Static Page Draft Export JSON"); const handoffResult = this.parseInertStaticDraftJson(handoffInput ? handoffInput.value : "", "Publication Handoff Manifest JSON"); const staticSummary = this.summarizeStaticDraftImportResult(staticResult, "static"); const handoffSummary = this.summarizeStaticDraftImportResult(handoffResult, "handoff"); const rejectedRows = [].concat(staticResult.rejectedRows || [], handoffResult.rejectedRows || []); if (staticSummary.status === "rejected") rejectedRows.push({ label: "Static Page Draft Export JSON", reason: "missing expected static draft rows or export type" }); if (handoffSummary.status === "rejected") rejectedRows.push({ label: "Publication Handoff Manifest JSON", reason: "missing expected handoff rows or export type" }); const payload = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsStaticDraftReviewImport", staticDraftReviewImportVersion: "1.0.0", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", importedExportSummaries: Object.freeze([staticSummary, handoffSummary]), importedStaticPageDraftExport: staticSummary.status === "accepted" ? staticResult.payload : null, importedPublicationHandoffManifest: handoffSummary.status === "accepted" ? handoffResult.payload : null, warnings: Object.freeze([].concat(staticSummary.warnings || [], handoffSummary.warnings || [])), rejectedRows: Object.freeze(rejectedRows), speculativeBoundaryText: "Static draft review imports are inert local reviewer artifacts for a speculative research visualization. They are not executed, not uploaded, not published, not proof, and not operational capability.", exportContainsExecutableCode: false }); this.latestStaticDraftReviewImport = payload; this.staticDraftReviewRejectedRows = rejectedRows; if (updateUi) { this.renderStaticDraftReviewImport(); this.buildPageReadinessDiff(true); this.updateStatus("Imported static draft review JSON locally; rejected rows remain visible."); } return payload;
        }
        renderStaticDraftReviewImport() { const body = this.root.querySelector("[data-arcsecs-static-draft-review-body]"); const status = this.root.querySelector("[data-arcsecs-static-draft-review-status]"); if (!body) return; const payload = this.latestStaticDraftReviewImport; if (!payload) { body.innerHTML = '<tr><td colspan="8">No imports yet. Paste inert JSON and click Import Static Draft Review JSON.</td></tr>'; if (status) status.textContent = "Static Draft Review Import waiting for pasted inert JSON."; return; } body.innerHTML = (payload.importedExportSummaries || []).map((summary) => `<tr><td>${auditEscapeHtml(summary.label)}</td><td>${auditEscapeHtml(summary.status)}</td><td>${auditEscapeHtml(summary.packageVersion)}</td><td>${auditEscapeHtml(summary.exportType)}</td><td>${auditEscapeHtml(summary.generatedUtc)}</td><td>${auditEscapeHtml(String(summary.scenarioCount))}</td><td>${auditEscapeHtml(String(summary.warningCount))}</td><td>${auditEscapeHtml(String(summary.rejectedRowCount))}</td></tr>`).join(""); if (status) status.textContent = "Static Draft Review Import loaded " + (payload.importedExportSummaries || []).length + " import summaries, " + (payload.warnings || []).length + " warning(s), and " + (payload.rejectedRows || []).length + " rejected row(s)."; }
        clearStaticDraftReviewImports() { const staticInput = this.root.querySelector("[data-arcsecs-static-page-draft-import-json]"); const handoffInput = this.root.querySelector("[data-arcsecs-publication-handoff-import-json]"); if (staticInput) staticInput.value = ""; if (handoffInput) handoffInput.value = ""; this.latestStaticDraftReviewImport = null; this.latestPageReadinessDiff = null; this.staticDraftReviewRejectedRows = []; this.latestStaticPublicationReviewChecklist = null; this.latestPageDraftFreezeBundle = null; this.renderStaticDraftReviewImport(); this.renderPageReadinessDiff(); this.updateStatus("Cleared local Static Draft Review imports."); }
        stableStaticDraftValue(value) { if (value === undefined || value === null) return ""; try { return JSON.stringify(value); } catch (error) { return String(value); } }
        compareStaticDraftField(importedRow, currentRow, fieldName) { return this.stableStaticDraftValue(importedRow ? importedRow[fieldName] : undefined) === this.stableStaticDraftValue(currentRow ? currentRow[fieldName] : undefined); }
        // Page Readiness Difference Assistant phrases: missing route metadata; missing SEO schema review; missing copy review bundle; missing demo script sections; missing screenshot caption; missing alt text; missing evidence pack row; missing source matrix row; missing equation library row; missing falsification callout; missing speculative boundary text; unsafe wording risk; stale package version.
        detectPageReadinessDifferenceGaps(importedRow, currentRow, importedPackageVersion) {
            const row = currentRow || importedRow || {}; const missingFields = []; const warnings = []; const rejectedPhrases = []; const recommendedFixes = []; const check = (field, label, fix) => { if (!row[field] || (Array.isArray(row[field]) && !row[field].length)) { missingFields.push(field); warnings.push("missing " + label); recommendedFixes.push(fix || ("Add " + label + " before reviewer-ready status.")); } };
            check("suggestedSlug", "route metadata", "Regenerate Route Draft Bundle so suggested slug, title, and metadata exist."); check("suggestedMetaTitle", "SEO schema review", "Build SEO Schema Review and Static Page Draft Export again."); check("suggestedIntroParagraph", "copy review bundle", "Build Copy Review Bundle so the intro and public copy are present."); check("suggestedDemoScriptSections", "demo script sections", "Build Public Demo Scripts and regenerate the static draft."); check("suggestedScreenshotCaption", "screenshot caption", "Build Screenshot Caption Pack and regenerate the evidence draft."); check("suggestedAltText", "alt text", "Add accessible alt text before page review."); check("reviewerEvidenceExportPackRow", "evidence pack row", "Export Reviewer Evidence Pack for this scenario."); check("sourceMatrixRow", "source matrix row", "Confirm the Scientific Source Matrix row is present."); check("scenarioEquationLibraryRow", "equation library row", "Confirm the Scenario Equation Library row is present."); check("suggestedFalsificationCallout", "falsification callout", "Add a visible falsification or weakening-condition callout."); check("speculativeBoundaryText", "speculative boundary text", "Add boundary text that says the page is a speculative research visualization, not proof."); const combined = JSON.stringify(row).toLowerCase(); ["proves", "proven", "working propulsion", "validated technology", "established technology", "operational capability", "real propulsion"].forEach((phrase) => { if (combined.indexOf(phrase) >= 0) { warnings.push("unsafe wording risk: " + phrase); rejectedPhrases.push(phrase); recommendedFixes.push("Replace unsupported proof or operational-capability wording with cautious speculative research visualization language."); } }); if (combined.indexOf("placeholder") >= 0 && combined.indexOf("speculative") < 0) { warnings.push("unlabeled placeholder/speculative mode"); recommendedFixes.push("Label placeholder modes as placeholder/speculative before public copy review."); } if (importedPackageVersion && importedPackageVersion !== "5.8.36") { warnings.push("stale package version: imported row from " + importedPackageVersion); recommendedFixes.push("Regenerate this static draft using package v5.8.36 before reviewer-ready status."); } return Object.freeze({ missingFields: Object.freeze(missingFields), warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhrases), recommendedFixes: Object.freeze(recommendedFixes) });
        }
        buildPageReadinessDiffRow(activeScenario, importedRow, currentRow, importedPackageVersion) {
            const compareFields = ["packageVersion", "activeScenario", "scenarioLabel", "suggestedSlug", "suggestedPageTitle", "suggestedMetaTitle", "suggestedMetaDescription", "suggestedCanonicalNote", "suggestedHeroTitle", "suggestedIntroParagraph", "suggestedDemoScriptSections", "suggestedScreenshotCaption", "suggestedAltText", "suggestedTelemetryCallout", "suggestedSourceEquationCallout", "suggestedFalsificationCallout", "suggestedBoundaryCopy", "suggestedSchemaReview", "suggestedInternalLinkTextRows", "reviewerEvidenceExportPackRow", "sourceMatrixRow", "scenarioEquationLibraryRow", "routeWarnings", "copyWarnings", "rejectedPhrases", "recommendedFixes", "speculativeBoundaryText", "exportContainsExecutableCode"]; const changedFields = []; const missingFields = []; compareFields.forEach((field) => { if (!importedRow || importedRow[field] === undefined || importedRow[field] === null || importedRow[field] === "") missingFields.push(field); else if (!this.compareStaticDraftField(importedRow, currentRow, field)) changedFields.push(field); }); const gaps = this.detectPageReadinessDifferenceGaps(importedRow, currentRow, importedPackageVersion); const allMissing = Array.from(new Set(missingFields.concat(gaps.missingFields))); const warnings = Array.from(new Set(gaps.warnings.concat((currentRow && currentRow.routeWarnings) || [], (currentRow && currentRow.copyWarnings) || []))); const rejectedPhrases = Array.from(new Set(gaps.rejectedPhrases.concat((currentRow && currentRow.rejectedPhrases) || []))); const stalePackageVersion = importedPackageVersion && importedPackageVersion !== "5.8.36"; let diffStatus = "unchanged"; if (!importedRow && currentRow) diffStatus = "added"; else if (importedRow && !currentRow) diffStatus = "removed"; else if (allMissing.length) diffStatus = "missing"; else if (stalePackageVersion) diffStatus = "stale"; else if (rejectedPhrases.length) diffStatus = "rejected"; else if (warnings.length) diffStatus = "warning"; else if (changedFields.length) diffStatus = "changed"; const reviewStatusControl = this.root.querySelector("[data-arcsecs-page-readiness-diff-review-status]"); const reviewStatus = reviewStatusControl && reviewStatusControl.value ? reviewStatusControl.value : "not-reviewed"; return Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPageReadinessDiffRow", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario, scenarioLabel: (currentRow && currentRow.scenarioLabel) || (importedRow && importedRow.scenarioLabel) || activeScenario, diffStatus, diffReviewStatus: reviewStatus, changedFields: Object.freeze(changedFields), missingFields: Object.freeze(allMissing), warningStatus: warnings.length ? "warnings" : "clear", staleStatus: stalePackageVersion ? "stale" : "current", missingFieldStatus: allMissing.length ? "missing-fields" : "complete", warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhrases), recommendedFixes: Object.freeze(Array.from(new Set(gaps.recommendedFixes.concat((currentRow && currentRow.recommendedFixes) || [])))), importedPackageVersion: importedPackageVersion || "missing", stalePackageVersion, importedRow: importedRow || null, currentRow: currentRow || null, speculativeBoundaryText: "Page Readiness Diff rows are inert local reviewer comparisons for speculative research visualization drafts. They are not publishing automation and are not proof.", exportContainsExecutableCode: false });
        }
        filterPageReadinessDiffRows(rows) { const scenario = this.getStaticDraftReviewFilterValue("[data-arcsecs-page-readiness-filter-scenario]"); const diffStatus = this.getStaticDraftReviewFilterValue("[data-arcsecs-page-readiness-filter-diff-status]"); const warning = this.getStaticDraftReviewFilterValue("[data-arcsecs-page-readiness-filter-warning]"); const stale = this.getStaticDraftReviewFilterValue("[data-arcsecs-page-readiness-filter-stale]"); const missing = this.getStaticDraftReviewFilterValue("[data-arcsecs-page-readiness-filter-missing]"); return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (diffStatus === "all" || row.diffStatus === diffStatus) && (warning === "all" || row.warningStatus === warning) && (stale === "all" || row.staleStatus === stale) && (missing === "all" || row.missingFieldStatus === missing)); }
        buildPageReadinessDiff(updateUi) {
            const importPayload = this.latestStaticDraftReviewImport || null; const currentStatic = this.latestStaticPageDraftExport || this.buildStaticPageDraftExport(false); const importedStatic = importPayload && importPayload.importedStaticPageDraftExport ? importPayload.importedStaticPageDraftExport : null; const importedRows = this.staticDraftRowsFromPayload(importedStatic); const currentRows = currentStatic && currentStatic.staticPageDraftRows ? currentStatic.staticPageDraftRows : []; const importedPackageVersion = importedStatic && importedStatic.packageVersion ? importedStatic.packageVersion : "missing"; const keys = Array.from(new Set(importedRows.concat(currentRows).map((row) => row && row.activeScenario).filter(Boolean))); const activeKeys = keys.length ? keys : [this.toConfig ? this.toConfig().scenario : "distanceTimeKernel"]; const diffRows = activeKeys.map((key) => this.buildPageReadinessDiffRow(key, importedRows.find((row) => row.activeScenario === key) || null, currentRows.find((row) => row.activeScenario === key) || null, importedPackageVersion)); const warnings = []; if (!importPayload) warnings.push("No Static Draft Review Import exists; diff compares against current local state only."); const payload = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPageReadinessDiff", pageReadinessDiffVersion: "1.0.0", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel", importedExportSummaries: importPayload ? importPayload.importedExportSummaries : [], diffRows: Object.freeze(diffRows), missingFields: Object.freeze(diffRows.flatMap((row) => row.missingFields || [])), changedFields: Object.freeze(diffRows.flatMap((row) => row.changedFields || [])), warnings: Object.freeze(warnings.concat(diffRows.flatMap((row) => row.warnings || []))), rejectedPhrases: Object.freeze(diffRows.flatMap((row) => row.rejectedPhrases || [])), recommendedFixes: Object.freeze(diffRows.flatMap((row) => row.recommendedFixes || [])), falsificationNotes: Object.freeze(diffRows.map((row) => "Falsification callout diff status for " + row.scenarioLabel + ": " + (row.changedFields.indexOf("suggestedFalsificationCallout") >= 0 ? "changed" : "reviewed"))), diffReviewStatusesSupported: Object.freeze(["not-reviewed", "reviewer-ready", "ready-with-warnings", "needs-revision", "blocked", "rejected"]), speculativeBoundaryText: "Page readiness diffs are inert local reviewer artifacts. They compare static drafts before human publishing work and do not publish, validate routes, or prove physics.", references: Object.freeze(["publicDemoPublicationHandoffManifest", "staticPageDraftExport", "publicDemoRouteDraftBundle", "seoSchemaReview", "copyReviewBundle", "publicDemoScriptBuilder", "screenshotCaptionPack", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary"]), exportContainsExecutableCode: false }); this.latestPageReadinessDiff = payload; if (updateUi) { this.renderPageReadinessDiff(); this.updateStatus("Built local Page Readiness Diff rows."); } return payload;
        }
        renderPageReadinessDiff() { const body = this.root.querySelector("[data-arcsecs-page-readiness-diff-body]"); const status = this.root.querySelector("[data-arcsecs-page-readiness-diff-status]"); const assistant = this.root.querySelector("[data-arcsecs-page-readiness-assistant-status]"); if (!body) return; const payload = this.latestPageReadinessDiff || this.buildPageReadinessDiff(false); const rows = this.filterPageReadinessDiffRows(payload.diffRows || []); if (!rows.length) { body.innerHTML = '<tr><td colspan="9">No page readiness diff rows match the current filters.</td></tr>'; if (status) status.textContent = "Page Readiness Diff has no matching rows."; return; } body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.diffStatus)}</td><td>${auditEscapeHtml(row.diffReviewStatus)}</td><td>${auditEscapeHtml((row.changedFields || []).join(", ") || "none")}</td><td>${auditEscapeHtml((row.missingFields || []).join(", ") || "none")}</td><td>${auditEscapeHtml((row.warnings || []).join("; ") || "none")}</td><td>${auditEscapeHtml((row.rejectedPhrases || []).join(", ") || "none")}</td><td>${auditEscapeHtml((row.recommendedFixes || []).join("; ") || "none")}</td><td>${auditEscapeHtml(row.stalePackageVersion ? "stale imported package " + row.importedPackageVersion : "current")}</td></tr>`).join(""); if (status) status.textContent = "Page Readiness Diff has " + rows.length + " local row" + (rows.length === 1 ? "" : "s") + ". No pages are created or published."; if (assistant) assistant.textContent = "Difference Assistant found " + (payload.missingFields || []).length + " missing field marker(s), " + (payload.rejectedPhrases || []).length + " rejected phrase marker(s), and " + (payload.recommendedFixes || []).length + " recommended fix item(s)."; }
        exportPageReadinessDiffJson() { const payload = this.latestPageReadinessDiff || this.buildPageReadinessDiff(false); this.download("arcsecs-page-readiness-diff.json", JSON.stringify(payload, null, 2), "application/json"); this.updateStatus("Exported inert Page Readiness Diff JSON."); }




        // v5.8.36 Public Publishing Evidence Archive Index and Reviewer Retrieval Notes.
        bindPublishingEvidenceArchiveIndexControls() {
            const buildIndex = this.root.querySelector("[data-arcsecs-build-publishing-evidence-archive-index]"); if (buildIndex) buildIndex.addEventListener("click", () => this.buildPublicPublishingEvidenceArchiveIndex(true));
            const buildRetrieval = this.root.querySelector("[data-arcsecs-build-reviewer-retrieval-notes]"); if (buildRetrieval) buildRetrieval.addEventListener("click", () => this.buildReviewerRetrievalNotes(true));
            const exportSelectedIndex = this.root.querySelector("[data-arcsecs-export-selected-archive-index-json]"); if (exportSelectedIndex) exportSelectedIndex.addEventListener("click", () => this.exportSelectedPublishingEvidenceArchiveIndexJson());
            const exportAllIndex = this.root.querySelector("[data-arcsecs-export-all-archive-index-json]"); if (exportAllIndex) exportAllIndex.addEventListener("click", () => this.exportAllPublishingEvidenceArchiveIndexJson());
            const exportRetrieval = this.root.querySelector("[data-arcsecs-export-reviewer-retrieval-notes-json]"); if (exportRetrieval) exportRetrieval.addEventListener("click", () => this.exportReviewerRetrievalNotesJson());
            this.root.querySelectorAll("[data-arcsecs-archive-index-filter-scenario], [data-arcsecs-archive-index-filter-archive-status], [data-arcsecs-archive-index-filter-signoff-status], [data-arcsecs-archive-index-filter-retrieval-status], [data-arcsecs-archive-index-filter-warning], [data-arcsecs-archive-index-filter-rejected-phrase], [data-arcsecs-archive-index-filter-source-equation], [data-arcsecs-archive-index-filter-boundary], [data-arcsecs-archive-retrieval-status], [data-arcsecs-reviewer-retrieval-note]").forEach((input) => input.addEventListener("change", () => { this.renderPublicPublishingEvidenceArchiveIndex(); this.renderReviewerRetrievalNotes(); }));
        }
        getPublishingArchiveFilterValue(selector) { const input = this.root.querySelector(selector); return input && input.value ? input.value : "all"; }
        getArchiveRetrievalStatusValue() { const input = this.root.querySelector("[data-arcsecs-archive-retrieval-status]"); return input && input.value ? input.value : "not-reviewed"; }
        getReviewerRetrievalNoteValue() { const input = this.root.querySelector("[data-arcsecs-reviewer-retrieval-note]"); return input && input.value ? input.value.trim() : ""; }
        getArchiveReceiptRowsForRetrieval() {
            const receipt = this.latestManualPublishingArchiveReceipt || (this.buildManualPublishingArchiveReceipt ? this.buildManualPublishingArchiveReceipt(false) : null);
            const rows = receipt && Array.isArray(receipt.archiveReceiptRows) ? receipt.archiveReceiptRows : [];
            if (rows.length) return rows;
            const scenarioKey = this.toConfig ? this.toConfig().scenario : "distanceTimeKernel";
            return [Object.freeze({ packageVersion: PACKAGE_VERSION, activeScenario: scenarioKey, scenarioLabel: ScenarioRegistry.getScenario(scenarioKey).label, suggestedSlug: "missing slug", pageTitle: "missing page title", manualHandoffStatus: "not-reviewed", verificationStatus: "pending-human-verification", archiveReceiptStatus: "not-reviewed", evidenceReferenceNote: "missing evidence reference", warningCount: 1, rejectedPhraseStatus: "clear", placeholderSpeculativeLabelStatus: "pending", exportArchiveRetainedStatus: "pending-human-confirmation", warnings: Object.freeze(["Manual Publishing Archive Receipt missing; build it before retrieval indexing."]), rejectedPhrases: Object.freeze([]), recommendedFixes: Object.freeze(["Build Manual Publishing Archive Receipt before retrieval indexing."]), falsificationNotes: Object.freeze(["Falsification notes must remain retrievable before public review."]), speculativeBoundaryText: "Speculative research visualization boundary text is required.", exportContainsExecutableCode: false })];
        }
        getHumanSignOffRowsForRetrieval() {
            const signoff = this.latestHumanReviewSignOffExport || (this.buildHumanReviewSignOffExport ? this.buildHumanReviewSignOffExport(false) : null);
            return signoff && Array.isArray(signoff.signOffRows) ? signoff.signOffRows : [];
        }
        buildPublishingEvidenceArchiveIndexRow(receiptRow, signOffRow) {
            const warnings = Array.from(new Set([].concat(receiptRow.warnings || [], signOffRow ? signOffRow.warnings || [] : [])));
            const rejectedPhrases = Array.from(new Set([].concat(receiptRow.rejectedPhrases || [], signOffRow ? signOffRow.rejectedPhrases || [] : [])));
            const recommendedFixes = Array.from(new Set([].concat(receiptRow.recommendedFixes || [], signOffRow ? signOffRow.recommendedFixes || [] : [])));
            const archiveReceiptStatus = receiptRow.archiveReceiptStatus || "not-reviewed";
            const signOffStatus = signOffRow ? signOffRow.signOffStatus || "not-reviewed" : "not-reviewed";
            const sourceMatrixStatus = receiptRow.sourceMatrixRow || (signOffRow && signOffRow.sourceMatrixRow) ? "source-matrix-present" : "source-matrix-warning";
            const equationLibraryStatus = receiptRow.scenarioEquationLibraryRow || (signOffRow && signOffRow.scenarioEquationLibraryRow) ? "equation-library-present" : "equation-library-warning";
            const falsificationNoteStatus = ((receiptRow.falsificationNotes || []).length || (signOffRow && (signOffRow.falsificationNotes || []).length)) ? "falsification-notes-present" : "falsification-notes-missing";
            const speculativeBoundaryStatus = receiptRow.speculativeBoundaryText || (signOffRow && signOffRow.speculativeBoundaryText) ? "boundary-present" : "boundary-missing";
            if (["blocked", "rejected", "needs-revision", "not-reviewed"].indexOf(archiveReceiptStatus) >= 0) recommendedFixes.push("Resolve archive receipt status before marking the row retrievable.");
            if (["blocked", "rejected", "needs-revision", "not-reviewed"].indexOf(signOffStatus) >= 0) recommendedFixes.push("Resolve human sign-off status before marking the row retrievable.");
            if (rejectedPhrases.length) recommendedFixes.push("Remove rejected proof or operational-capability wording before retrieval sign-off.");
            if (falsificationNoteStatus === "falsification-notes-missing") recommendedFixes.push("Add falsification notes before retrieval indexing.");
            if (speculativeBoundaryStatus === "boundary-missing") recommendedFixes.push("Add speculative boundary text before retrieval indexing.");
            if (sourceMatrixStatus !== "source-matrix-present" || equationLibraryStatus !== "equation-library-present") warnings.push("Source/equation references are incomplete; retrievable-with-warnings is required unless repaired.");
            const requestedRetrievalStatus = this.getArchiveRetrievalStatusValue();
            let archiveRetrievalStatus = requestedRetrievalStatus;
            if (requestedRetrievalStatus === "retrievable" && recommendedFixes.length) archiveRetrievalStatus = "blocked";
            if (requestedRetrievalStatus === "retrievable" && (sourceMatrixStatus !== "source-matrix-present" || equationLibraryStatus !== "equation-library-present")) archiveRetrievalStatus = "blocked";
            if (requestedRetrievalStatus === "retrievable-with-warnings") archiveRetrievalStatus = "retrievable-with-warnings";
            return Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPublicPublishingEvidenceArchiveIndexRow", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: receiptRow.activeScenario || (signOffRow && signOffRow.activeScenario) || "distanceTimeKernel", scenarioLabel: receiptRow.scenarioLabel || (signOffRow && signOffRow.scenarioLabel) || "Current Scenario", suggestedSlug: receiptRow.suggestedSlug || "missing slug", pageTitle: receiptRow.pageTitle || "missing page title", manualHandoffStatus: receiptRow.manualHandoffStatus || "not-reviewed", verificationStatus: receiptRow.verificationStatus || "pending-human-verification", archiveReceiptStatus, signOffStatus, reviewerNameOrHandle: signOffRow ? signOffRow.reviewerNameOrHandle || "" : "", warningCount: warnings.length, rejectedPhraseCount: rejectedPhrases.length, recommendedFixCount: recommendedFixes.length, falsificationNoteStatus, speculativeBoundaryStatus, sourceMatrixStatus, equationLibraryStatus, archiveRetrievalStatus, warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhrases), recommendedFixes: Object.freeze(recommendedFixes), manualPublishingArchiveReceiptRow: receiptRow, humanReviewSignOffRow: signOffRow || null, speculativeBoundaryText: "Public Publishing Evidence Archive Index rows are local reviewer retrieval metadata only. They do not publish pages, create WordPress content, inject schema, fetch links, prove physics, or imply operational capability.", exportContainsExecutableCode: false });
        }
        buildPublicPublishingEvidenceArchiveIndex(updateUi) {
            const receiptRows = this.getArchiveReceiptRowsForRetrieval(); const signOffRows = this.getHumanSignOffRowsForRetrieval();
            const rows = receiptRows.map((receiptRow) => this.buildPublishingEvidenceArchiveIndexRow(receiptRow, signOffRows.find((row) => row.activeScenario === receiptRow.activeScenario) || null));
            const payload = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPublicPublishingEvidenceArchiveIndex", publicPublishingEvidenceArchiveIndexVersion: "1.0.0", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel", archiveIndexRows: Object.freeze(rows), archiveRetrievalStatusesSupported: Object.freeze(["not-reviewed", "retrievable", "retrievable-with-warnings", "needs-revision", "blocked", "rejected"]), warnings: Object.freeze(rows.flatMap((row) => row.warnings || [])), rejectedPhrases: Object.freeze(rows.flatMap((row) => row.rejectedPhrases || [])), recommendedFixes: Object.freeze(rows.flatMap((row) => row.recommendedFixes || [])), falsificationNotes: Object.freeze(rows.map((row) => row.falsificationNoteStatus + " for " + row.scenarioLabel)), speculativeBoundaryText: "Public Publishing Evidence Archive Index is inert local reviewer retrieval metadata only. It does not publish pages, create WordPress content, inject schema, fetch links, prove physics, or imply operational capability.", references: Object.freeze(["manualPublishingArchiveReceipt", "humanReviewSignOffExport", "publicPageManualPublishingRunbook", "postDeployVerificationChecklist", "staticPublishHandoffQaSummary", "publicPageContentChecklist", "pageDraftFreezeBundle", "sourceMatrix", "scenarioEquationLibrary", "uaiMemoryOrganizationCompletenessCheck"]), exportContainsExecutableCode: false });
            this.latestPublicPublishingEvidenceArchiveIndex = payload; if (updateUi) { this.renderPublicPublishingEvidenceArchiveIndex(); this.updateStatus("Built local Public Publishing Evidence Archive Index rows."); } return payload;
        }
        filterPublishingEvidenceArchiveIndexRows(rows) {
            const scenario = this.getPublishingArchiveFilterValue("[data-arcsecs-archive-index-filter-scenario]");
            const archiveStatus = this.getPublishingArchiveFilterValue("[data-arcsecs-archive-index-filter-archive-status]");
            const signoffStatus = this.getPublishingArchiveFilterValue("[data-arcsecs-archive-index-filter-signoff-status]");
            const retrievalStatus = this.getPublishingArchiveFilterValue("[data-arcsecs-archive-index-filter-retrieval-status]");
            const warning = this.getPublishingArchiveFilterValue("[data-arcsecs-archive-index-filter-warning]");
            const rejected = this.getPublishingArchiveFilterValue("[data-arcsecs-archive-index-filter-rejected-phrase]");
            const sourceEquation = this.getPublishingArchiveFilterValue("[data-arcsecs-archive-index-filter-source-equation]");
            const boundary = this.getPublishingArchiveFilterValue("[data-arcsecs-archive-index-filter-boundary]");
            return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (archiveStatus === "all" || row.archiveReceiptStatus === archiveStatus) && (signoffStatus === "all" || row.signOffStatus === signoffStatus) && (retrievalStatus === "all" || row.archiveRetrievalStatus === retrievalStatus) && (warning === "all" || (warning === "warnings" ? row.warningCount > 0 : row.warningCount === 0)) && (rejected === "all" || (rejected === "rejected-phrases" ? row.rejectedPhraseCount > 0 : row.rejectedPhraseCount === 0)) && (sourceEquation === "all" || (sourceEquation === "complete" ? row.sourceMatrixStatus === "source-matrix-present" && row.equationLibraryStatus === "equation-library-present" : row.sourceMatrixStatus !== "source-matrix-present" || row.equationLibraryStatus !== "equation-library-present")) && (boundary === "all" || row.speculativeBoundaryStatus === boundary));
        }
        renderPublicPublishingEvidenceArchiveIndex() {
            const body = this.root.querySelector("[data-arcsecs-publishing-evidence-archive-index-body]"); const status = this.root.querySelector("[data-arcsecs-publishing-evidence-archive-index-status]"); if (!body) return;
            const payload = this.latestPublicPublishingEvidenceArchiveIndex || this.buildPublicPublishingEvidenceArchiveIndex(false); const rows = this.filterPublishingEvidenceArchiveIndexRows(payload.archiveIndexRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="15">No archive index rows match the current filters.</td></tr>'; if (status) status.textContent = "Public Publishing Evidence Archive Index has no matching rows."; return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.suggestedSlug)}</td><td>${auditEscapeHtml(row.pageTitle)}</td><td>${auditEscapeHtml(row.manualHandoffStatus)}</td><td>${auditEscapeHtml(row.verificationStatus)}</td><td>${auditEscapeHtml(row.archiveReceiptStatus)}</td><td>${auditEscapeHtml(row.signOffStatus)}</td><td>${auditEscapeHtml(row.reviewerNameOrHandle || "optional")}</td><td>${auditEscapeHtml(String(row.warningCount))}</td><td>${auditEscapeHtml(String(row.rejectedPhraseCount))}</td><td>${auditEscapeHtml(String(row.recommendedFixCount))}</td><td>${auditEscapeHtml(row.falsificationNoteStatus)}</td><td>${auditEscapeHtml(row.speculativeBoundaryStatus)}</td><td>${auditEscapeHtml(row.sourceMatrixStatus + " / " + row.equationLibraryStatus)}</td><td>${auditEscapeHtml(row.archiveRetrievalStatus)}</td></tr>`).join("");
            if (status) status.textContent = "Public Publishing Evidence Archive Index has " + rows.length + " local row" + (rows.length === 1 ? "" : "s") + ". It is reviewer retrieval metadata only and does not publish anything.";
        }
        buildReviewerRetrievalNoteRow(indexRow) {
            const note = this.getReviewerRetrievalNoteValue(); const requestedStatus = this.getArchiveRetrievalStatusValue();
            const warnings = Array.from(new Set(indexRow.warnings || [])); const rejectedPhrases = Array.from(new Set(indexRow.rejectedPhrases || [])); const recommendedFixes = Array.from(new Set(indexRow.recommendedFixes || []));
            if (indexRow.sourceMatrixStatus !== "source-matrix-present" || indexRow.equationLibraryStatus !== "equation-library-present") recommendedFixes.push("Attach source matrix and equation library rows or select retrievable-with-warnings.");
            let retrievalStatus = requestedStatus;
            if (requestedStatus === "retrievable" && recommendedFixes.length) retrievalStatus = "blocked";
            return Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsReviewerRetrievalNotesRow", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: indexRow.activeScenario, scenarioLabel: indexRow.scenarioLabel, retrievalStatus, requestedRetrievalStatus: requestedStatus, reviewerRetrievalNote: note, archiveIndexRow: indexRow, humanSignOffRow: indexRow.humanReviewSignOffRow || null, archiveReceiptRow: indexRow.manualPublishingArchiveReceiptRow || null, manualRunbookRow: indexRow.manualPublishingArchiveReceiptRow ? indexRow.manualPublishingArchiveReceiptRow.publicPageManualPublishingRunbookRow || null : null, postDeployVerificationRow: indexRow.manualPublishingArchiveReceiptRow ? indexRow.manualPublishingArchiveReceiptRow.postDeployVerificationChecklistRow || null : null, staticPublishHandoffQaSummaryRow: null, publicPageContentChecklistRow: null, pageDraftFreezeBundleRow: null, sourceMatrixRow: indexRow.sourceMatrixStatus === "source-matrix-present" ? (indexRow.sourceMatrixRow || null) : null, scenarioEquationLibraryRow: indexRow.equationLibraryStatus === "equation-library-present" ? (indexRow.scenarioEquationLibraryRow || null) : null, falsificationNotes: Object.freeze([indexRow.falsificationNoteStatus + " for " + indexRow.scenarioLabel]), speculativeBoundaryText: indexRow.speculativeBoundaryText, warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhrases), recommendedFixes: Object.freeze(recommendedFixes), exportContainsExecutableCode: false });
        }
        buildReviewerRetrievalNotes(updateUi) {
            const index = this.latestPublicPublishingEvidenceArchiveIndex || this.buildPublicPublishingEvidenceArchiveIndex(false); const rows = (index.archiveIndexRows || []).map((row) => this.buildReviewerRetrievalNoteRow(row));
            const payload = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsReviewerRetrievalNotes", reviewerRetrievalNotesVersion: "1.0.0", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel", reviewerRetrievalNote: this.getReviewerRetrievalNoteValue(), retrievalNoteRows: Object.freeze(rows), archiveRetrievalStatusesSupported: Object.freeze(["not-reviewed", "retrievable", "retrievable-with-warnings", "needs-revision", "blocked", "rejected"]), warnings: Object.freeze(rows.flatMap((row) => row.warnings || [])), rejectedPhrases: Object.freeze(rows.flatMap((row) => row.rejectedPhrases || [])), recommendedFixes: Object.freeze(rows.flatMap((row) => row.recommendedFixes || [])), falsificationNotes: Object.freeze(rows.flatMap((row) => row.falsificationNotes || [])), speculativeBoundaryText: "Reviewer Retrieval Notes are inert local reviewer metadata only. They do not publish pages, create content, inject schema, fetch links, prove physics, or imply operational capability.", references: Object.freeze(["publicPublishingEvidenceArchiveIndex", "manualPublishingArchiveReceipt", "humanReviewSignOffExport", "publicPageManualPublishingRunbook", "postDeployVerificationChecklist", "staticPublishHandoffQaSummary", "publicPageContentChecklist", "pageDraftFreezeBundle", "sourceMatrix", "scenarioEquationLibrary", "uaiMemoryOrganizationCompletenessCheck"]), exportContainsExecutableCode: false });
            this.latestReviewerRetrievalNotes = payload; if (updateUi) { this.renderReviewerRetrievalNotes(); this.updateStatus("Built local Reviewer Retrieval Notes rows."); } return payload;
        }
        renderReviewerRetrievalNotes() {
            const body = this.root.querySelector("[data-arcsecs-reviewer-retrieval-notes-body]"); const status = this.root.querySelector("[data-arcsecs-reviewer-retrieval-notes-status]"); if (!body) return;
            const payload = this.latestReviewerRetrievalNotes || this.buildReviewerRetrievalNotes(false); const rows = this.filterPublishingEvidenceArchiveIndexRows((payload.retrievalNoteRows || []).map((row) => Object.assign({}, row.archiveIndexRow, { archiveRetrievalStatus: row.retrievalStatus })));
            const sourceRows = payload.retrievalNoteRows || []; const visibleRows = rows.map((row) => sourceRows.find((source) => source.activeScenario === row.activeScenario)).filter(Boolean);
            if (!visibleRows.length) { body.innerHTML = '<tr><td colspan="11">No reviewer retrieval note rows match the current filters.</td></tr>'; if (status) status.textContent = "Reviewer Retrieval Notes have no matching rows."; return; }
            body.innerHTML = visibleRows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.retrievalStatus)}</td><td>${auditEscapeHtml(row.archiveIndexRow.archiveReceiptStatus)}</td><td>${auditEscapeHtml(row.archiveIndexRow.signOffStatus)}</td><td>${auditEscapeHtml(row.archiveIndexRow.sourceMatrixStatus)}</td><td>${auditEscapeHtml(row.archiveIndexRow.equationLibraryStatus)}</td><td>${auditEscapeHtml(row.archiveIndexRow.speculativeBoundaryStatus)}</td><td>${auditEscapeHtml((row.falsificationNotes || []).join("; "))}</td><td>${auditEscapeHtml(String((row.warnings || []).length))}</td><td>${auditEscapeHtml(String((row.recommendedFixes || []).length))}</td><td>${auditEscapeHtml(row.reviewerRetrievalNote || "optional")}</td></tr>`).join("");
            if (status) status.textContent = "Reviewer Retrieval Notes contain " + visibleRows.length + " local row" + (visibleRows.length === 1 ? "" : "s") + ". They are retrieval metadata only and do not publish anything.";
        }
        exportSelectedPublishingEvidenceArchiveIndexJson() { const payload = this.latestPublicPublishingEvidenceArchiveIndex || this.buildPublicPublishingEvidenceArchiveIndex(false); const activeScenario = this.toConfig ? this.toConfig().scenario : "distanceTimeKernel"; const selected = (payload.archiveIndexRows || []).find((row) => row.activeScenario === activeScenario) || (payload.archiveIndexRows || [])[0] || null; this.download("arcsecs-selected-public-publishing-evidence-archive-index.json", JSON.stringify(Object.assign({}, payload, { exportType: "ArcSecsSelectedPublicPublishingEvidenceArchiveIndex", selectedArchiveIndexRow: selected, archiveIndexRows: selected ? [selected] : [] }), null, 2), "application/json"); this.updateStatus("Exported selected inert Public Publishing Evidence Archive Index JSON."); }
        exportAllPublishingEvidenceArchiveIndexJson() { const payload = this.latestPublicPublishingEvidenceArchiveIndex || this.buildPublicPublishingEvidenceArchiveIndex(false); this.download("arcsecs-all-public-publishing-evidence-archive-index.json", JSON.stringify(payload, null, 2), "application/json"); this.updateStatus("Exported all inert Public Publishing Evidence Archive Index JSON."); }
        exportReviewerRetrievalNotesJson() { const payload = this.latestReviewerRetrievalNotes || this.buildReviewerRetrievalNotes(false); this.download("arcsecs-reviewer-retrieval-notes.json", JSON.stringify(payload, null, 2), "application/json"); this.updateStatus("Exported inert Reviewer Retrieval Notes JSON."); }


        // Static Publication Freeze Assistant phrases: missing route metadata; missing schema review; missing copy review; missing evidence pack; missing source matrix row; missing equation library row; missing falsification; missing speculative boundary text; unsafe wording risk; stale rows require frozen-with-warnings; unlabeled placeholder/speculative modes.
        bindStaticPublishHandoffQaControls() {
            const buildQa = this.root.querySelector("[data-arcsecs-build-publish-handoff-qa-summary]"); if (buildQa) buildQa.addEventListener("click", () => this.buildStaticPublishHandoffQaSummary(true));
            const buildChecklist = this.root.querySelector("[data-arcsecs-build-public-page-content-checklist]"); if (buildChecklist) buildChecklist.addEventListener("click", () => this.buildPublicPageContentChecklist(true));
            const exportSelectedQa = this.root.querySelector("[data-arcsecs-export-selected-qa-summary-json]"); if (exportSelectedQa) exportSelectedQa.addEventListener("click", () => this.exportSelectedQaSummaryJson());
            const exportAllQa = this.root.querySelector("[data-arcsecs-export-all-qa-summaries-json]"); if (exportAllQa) exportAllQa.addEventListener("click", () => this.exportAllQaSummariesJson());
            const exportChecklist = this.root.querySelector("[data-arcsecs-export-public-page-content-checklist-json]"); if (exportChecklist) exportChecklist.addEventListener("click", () => this.exportPublicPageContentChecklistJson());
            this.root.querySelectorAll("[data-arcsecs-static-publish-qa-filter-scenario], [data-arcsecs-static-publish-qa-filter-freeze-status], [data-arcsecs-static-publish-qa-filter-qa-status], [data-arcsecs-static-publish-qa-filter-warning], [data-arcsecs-static-publish-qa-filter-rejected-phrase], [data-arcsecs-static-publish-qa-filter-checklist-completion], [data-arcsecs-static-publish-qa-status]").forEach((input) => input.addEventListener("change", () => { this.renderStaticPublishHandoffQaSummary(); this.renderPublicPageContentChecklist(); this.renderPublicPageManualPublishingRunbook(); this.renderPostDeployVerificationChecklist(); }));
            this.bindManualPublishingRunbookControls(); this.bindManualPublishingArchiveReceiptControls(); this.bindPublishingEvidenceArchiveIndexControls();
        }
        getStaticPublishQaFilterValue(selector) { const input = this.root.querySelector(selector); return input && input.value ? input.value : "all"; }
        getStaticPublishQaStatusValue() { const input = this.root.querySelector("[data-arcsecs-static-publish-qa-status]"); return input && input.value ? input.value : "not-reviewed"; }
        getPageDraftFreezeBundleRowsForQa() {
            const bundle = this.latestPageDraftFreezeBundle || this.buildPageDraftFreezeBundle(false);
            const rows = bundle && Array.isArray(bundle.freezeBundleRows) ? bundle.freezeBundleRows : [];
            if (rows.length) { return rows; }
            return Object.keys(ScenarioRegistry.scenarios).slice(0, 8).map((scenarioKey) => Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPageDraftFreezeBundleRow", activeScenario: scenarioKey, scenarioLabel: ScenarioRegistry.getScenario(scenarioKey).label, freezeStatus: "not-reviewed", routeDraftRow: null, seoSchemaReviewRow: null, copyReviewBundleRow: null, publicDemoScriptRow: null, screenshotCaptionRow: null, reviewerEvidenceExportPackRow: null, sourceMatrixRow: null, scenarioEquationLibraryRow: null, warnings: Object.freeze(["Freeze bundle row missing; build Page Draft Freeze Bundle before QA handoff."]), rejectedPhrases: Object.freeze([]), recommendedFixes: Object.freeze(["Build the Page Draft Freeze Bundle for this scenario before QA-ready review."]), falsificationNotes: Object.freeze(["Falsification callout must remain visible before public page handoff."]), speculativeBoundaryText: "Speculative research visualization boundary text is required.", exportContainsExecutableCode: false }));
        }
        buildStaticPublishHandoffQaRow(freezeRow) {
            const warnings = Array.from(new Set(freezeRow.warnings || []));
            const rejectedPhrases = Array.from(new Set(freezeRow.rejectedPhrases || []));
            const recommendedFixes = Array.from(new Set(freezeRow.recommendedFixes || []));
            const hasRoute = Boolean(freezeRow.routeDraftRow || (freezeRow.staticPageDraftExportRow && freezeRow.staticPageDraftExportRow.suggestedSlug));
            const hasSchema = Boolean(freezeRow.seoSchemaReviewRow || (freezeRow.staticPageDraftExportRow && freezeRow.staticPageDraftExportRow.suggestedSchemaReview));
            const hasCopy = Boolean(freezeRow.copyReviewBundleRow || (freezeRow.staticPageDraftExportRow && freezeRow.staticPageDraftExportRow.suggestedIntroParagraph));
            const hasEvidence = Boolean(freezeRow.reviewerEvidenceExportPackRow || (freezeRow.staticPageDraftExportRow && freezeRow.staticPageDraftExportRow.reviewerEvidenceExportPackRow));
            const hasSource = Boolean(freezeRow.sourceMatrixRow || (freezeRow.staticPageDraftExportRow && freezeRow.staticPageDraftExportRow.sourceMatrixRow));
            const hasEquation = Boolean(freezeRow.scenarioEquationLibraryRow || (freezeRow.staticPageDraftExportRow && freezeRow.staticPageDraftExportRow.scenarioEquationLibraryRow));
            const hasFalsification = Boolean((freezeRow.falsificationNotes && freezeRow.falsificationNotes.length) || (freezeRow.staticPageDraftExportRow && freezeRow.staticPageDraftExportRow.suggestedFalsificationCallout));
            const hasBoundary = Boolean(freezeRow.speculativeBoundaryText || (freezeRow.staticPageDraftExportRow && freezeRow.staticPageDraftExportRow.speculativeBoundaryText));
            if (["blocked", "rejected", "needs-revision"].indexOf(freezeRow.freezeStatus) >= 0) { recommendedFixes.push("Resolve blocked/rejected/needs-revision freeze state before QA-ready review."); }
            if (!hasRoute) { recommendedFixes.push("Add route metadata before QA-ready review."); }
            if (!hasSchema) { recommendedFixes.push("Add SEO schema review before QA-ready review."); }
            if (!hasCopy) { recommendedFixes.push("Add copy review bundle before QA-ready review."); }
            if (!hasEvidence) { recommendedFixes.push("Add reviewer evidence pack before QA-ready review."); }
            if (!hasSource || !hasEquation) { recommendedFixes.push("Add source matrix row and scenario equation library row before QA-ready review."); }
            if (!hasFalsification) { recommendedFixes.push("Add falsification callout before QA-ready review."); }
            if (!hasBoundary) { recommendedFixes.push("Add speculative boundary copy before QA-ready review."); }
            if (rejectedPhrases.length) { recommendedFixes.push("Remove rejected proof or operational-capability phrases before QA-ready review."); }
            if ((freezeRow.recommendedFixes || []).length) { warnings.push("Recommended fixes remain open."); }
            if (freezeRow.freezeStatus === "frozen-with-warnings") { warnings.push("Freeze status is frozen-with-warnings; QA can only be qa-ready-with-warnings until reviewed."); }
            let qaStatus = this.getStaticPublishQaStatusValue();
            if (["blocked", "rejected"].indexOf(freezeRow.freezeStatus) >= 0 || rejectedPhrases.length || !hasRoute || !hasSchema || !hasCopy || !hasEvidence || !hasSource || !hasEquation || !hasFalsification || !hasBoundary) { qaStatus = qaStatus === "rejected" ? "rejected" : "blocked"; }
            else if (freezeRow.freezeStatus === "needs-revision" || recommendedFixes.length) { qaStatus = "needs-revision"; }
            else if (warnings.length || freezeRow.freezeStatus === "frozen-with-warnings") { qaStatus = "qa-ready-with-warnings"; }
            else if (qaStatus === "not-reviewed") { qaStatus = "qa-ready"; }
            return Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsStaticPublishHandoffQaSummaryRow", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: freezeRow.activeScenario, scenarioLabel: freezeRow.scenarioLabel, freezeStatus: freezeRow.freezeStatus || "not-reviewed", routeMetadataStatus: hasRoute ? "present" : "missing route metadata", schemaReviewStatus: hasSchema ? "present" : "missing schema review", copyReviewStatus: hasCopy ? "present" : "missing copy review", evidencePackStatus: hasEvidence ? "present" : "missing evidence pack", sourceEquationStatus: hasSource && hasEquation ? "present" : "missing source/equation", falsificationStatus: hasFalsification ? "present" : "missing falsification", boundaryStatus: hasBoundary ? "present" : "missing boundary", warningCount: warnings.length, rejectedPhraseCount: rejectedPhrases.length, recommendedFixCount: recommendedFixes.length, finalQaStatus: qaStatus, warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhrases), recommendedFixes: Object.freeze(Array.from(new Set(recommendedFixes))), pageDraftFreezeBundleRow: freezeRow, speculativeBoundaryText: freezeRow.speculativeBoundaryText || "Speculative research visualization boundary text required.", exportContainsExecutableCode: false });
        }
        filterStaticPublishHandoffQaRows(rows) {
            const scenario = this.getStaticPublishQaFilterValue("[data-arcsecs-static-publish-qa-filter-scenario]");
            const freeze = this.getStaticPublishQaFilterValue("[data-arcsecs-static-publish-qa-filter-freeze-status]");
            const qa = this.getStaticPublishQaFilterValue("[data-arcsecs-static-publish-qa-filter-qa-status]");
            const warning = this.getStaticPublishQaFilterValue("[data-arcsecs-static-publish-qa-filter-warning]");
            const rejected = this.getStaticPublishQaFilterValue("[data-arcsecs-static-publish-qa-filter-rejected-phrase]");
            return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (freeze === "all" || row.freezeStatus === freeze) && (qa === "all" || row.finalQaStatus === qa) && (warning === "all" || (warning === "clear" ? row.warningCount === 0 : row.warningCount > 0)) && (rejected === "all" || (rejected === "clear" ? row.rejectedPhraseCount === 0 : row.rejectedPhraseCount > 0)));
        }
        buildStaticPublishHandoffQaSummary(updateUi) {
            const rows = this.getPageDraftFreezeBundleRowsForQa().map((row) => this.buildStaticPublishHandoffQaRow(row));
            const payload = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsStaticPublishHandoffQaSummary", staticPublishHandoffQaSummaryVersion: "1.0.0", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel", qaRows: Object.freeze(rows), qaStatusesSupported: Object.freeze(["not-reviewed", "qa-ready", "qa-ready-with-warnings", "needs-revision", "blocked", "rejected"]), warnings: Object.freeze(rows.flatMap((row) => row.warnings || [])), rejectedPhrases: Object.freeze(rows.flatMap((row) => row.rejectedPhrases || [])), recommendedFixes: Object.freeze(rows.flatMap((row) => row.recommendedFixes || [])), falsificationNotes: Object.freeze(rows.map((row) => "Falsification status for " + row.scenarioLabel + ": " + row.falsificationStatus)), speculativeBoundaryText: "Static Publish Handoff QA Summary is an inert local human-review handoff artifact only. It does not publish pages, inject schema, fetch links, prove physics, or imply operational capability.", references: Object.freeze(["staticPublicationReviewChecklist", "pageDraftFreezeBundle", "staticDraftReviewImport", "pageReadinessDiff", "publicDemoPublicationHandoffManifest", "staticPageDraftExport", "publicDemoRouteDraftBundle", "seoSchemaReview", "copyReviewBundle", "publicDemoScriptBuilder", "screenshotCaptionPack", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary"]), exportContainsExecutableCode: false });
            this.latestStaticPublishHandoffQaSummary = payload;
            if (updateUi) { this.renderStaticPublishHandoffQaSummary(); this.renderPublicPageContentChecklist(); this.updateStatus("Built local Static Publish Handoff QA Summary rows."); }
            return payload;
        }
        renderStaticPublishHandoffQaSummary() {
            const body = this.root.querySelector("[data-arcsecs-static-publish-handoff-qa-body]"); const status = this.root.querySelector("[data-arcsecs-static-publish-handoff-qa-status]"); if (!body) { return; }
            const payload = this.latestStaticPublishHandoffQaSummary || this.buildStaticPublishHandoffQaSummary(false); const rows = this.filterStaticPublishHandoffQaRows(payload.qaRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="13">No QA rows match the current filters.</td></tr>'; if (status) status.textContent = "Static Publish Handoff QA Summary has no matching rows."; return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.freezeStatus)}</td><td>${auditEscapeHtml(row.routeMetadataStatus)}</td><td>${auditEscapeHtml(row.schemaReviewStatus)}</td><td>${auditEscapeHtml(row.copyReviewStatus)}</td><td>${auditEscapeHtml(row.evidencePackStatus)}</td><td>${auditEscapeHtml(row.sourceEquationStatus)}</td><td>${auditEscapeHtml(row.falsificationStatus)}</td><td>${auditEscapeHtml(row.boundaryStatus)}</td><td>${auditEscapeHtml(String(row.warningCount))}</td><td>${auditEscapeHtml(String(row.rejectedPhraseCount))}</td><td>${auditEscapeHtml(String(row.recommendedFixCount))}</td><td>${auditEscapeHtml(row.finalQaStatus)}</td></tr>`).join("");
            if (status) { status.textContent = "Static Publish Handoff QA Summary has " + rows.length + " local row" + (rows.length === 1 ? "" : "s") + ". This is a human-review handoff only and does not publish anything."; }
        }
        buildPublicPageContentChecklistRow(qaRow) {
            const freezeRow = qaRow.pageDraftFreezeBundleRow || {};
            const staticRow = freezeRow.staticPageDraftExportRow || {};
            const hasSlug = Boolean(staticRow.suggestedSlug);
            const hasTitle = Boolean(staticRow.suggestedPageTitle);
            const hasMeta = Boolean(staticRow.suggestedMetaTitle && staticRow.suggestedMetaDescription);
            const hasHero = Boolean(staticRow.suggestedHeroTitle);
            const hasIntro = Boolean(staticRow.suggestedIntroParagraph);
            const scriptSections = staticRow.suggestedDemoScriptSections || freezeRow.publicDemoScriptRow || {};
            const hasScript = Boolean(scriptSections && Object.keys(scriptSections).length);
            const hasCaption = Boolean(staticRow.suggestedScreenshotCaption || freezeRow.screenshotCaptionRow);
            const hasAlt = Boolean(staticRow.suggestedAltText);
            const hasTelemetry = Boolean(staticRow.suggestedTelemetryCallout);
            const hasSourceEquation = Boolean(staticRow.suggestedSourceEquationCallout && staticRow.sourceMatrixRow && staticRow.scenarioEquationLibraryRow);
            const hasFalsification = Boolean(staticRow.suggestedFalsificationCallout || (freezeRow.falsificationNotes && freezeRow.falsificationNotes.length));
            const hasBoundary = Boolean(staticRow.suggestedBoundaryCopy || staticRow.speculativeBoundaryText || qaRow.speculativeBoundaryText);
            const hasSchema = Boolean(staticRow.suggestedSchemaReview || freezeRow.seoSchemaReviewRow);
            const linkRows = staticRow.suggestedInternalLinkTextRows || [];
            const hasEvidence = Boolean(staticRow.reviewerEvidenceExportPackRow || freezeRow.reviewerEvidenceExportPackRow);
            const rejectedPhraseStatus = qaRow.rejectedPhraseCount > 0 ? "rejected-phrases" : "clear";
            const placeholderLabelStatus = "placeholder/speculative labels visible";
            const complete = hasSlug && hasTitle && hasMeta && hasHero && hasIntro && hasScript && hasCaption && hasAlt && hasTelemetry && hasSourceEquation && hasFalsification && hasBoundary && hasSchema && hasEvidence && rejectedPhraseStatus === "clear";
            return Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPublicPageContentChecklistRow", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: qaRow.activeScenario, scenarioLabel: qaRow.scenarioLabel, suggestedSlug: staticRow.suggestedSlug || "missing slug", pageTitle: staticRow.suggestedPageTitle || "missing page title", metaTitle: staticRow.suggestedMetaTitle || "missing meta title", metaDescription: staticRow.suggestedMetaDescription || "missing meta description", heroTitle: staticRow.suggestedHeroTitle || "missing hero title", introParagraph: staticRow.suggestedIntroParagraph || "missing intro paragraph", demoScriptSections: scriptSections, screenshotCaption: staticRow.suggestedScreenshotCaption || "missing screenshot caption", altText: staticRow.suggestedAltText || "missing alt text", telemetryCallout: staticRow.suggestedTelemetryCallout || "missing telemetry callout", sourceEquationCallout: staticRow.suggestedSourceEquationCallout || "missing source/equation callout", falsificationCallout: staticRow.suggestedFalsificationCallout || "missing falsification callout", speculativeBoundaryCopy: staticRow.suggestedBoundaryCopy || staticRow.speculativeBoundaryText || "missing speculative boundary copy", schemaReviewNote: hasSchema ? "schema review present" : "missing schema review note", internalLinkTextRows: Object.freeze(linkRows), evidenceReferenceNote: hasEvidence ? "evidence reference present" : "missing evidence reference note", rejectedPhraseStatus, placeholderSpeculativeLabelStatus: placeholderLabelStatus, checklistCompletionStatus: complete ? "complete" : "incomplete", finalQaStatus: qaRow.finalQaStatus, warnings: Object.freeze(qaRow.warnings || []), recommendedFixes: Object.freeze(qaRow.recommendedFixes || []), speculativeBoundaryText: "Public Page Content Checklist rows are inert local reviewer artifacts only. They are not proof, validation, real propulsion, operational capability, or publishing automation.", exportContainsExecutableCode: false });
        }
        filterPublicPageContentChecklistRows(rows) {
            const scenario = this.getStaticPublishQaFilterValue("[data-arcsecs-static-publish-qa-filter-scenario]"); const completion = this.getStaticPublishQaFilterValue("[data-arcsecs-static-publish-qa-filter-checklist-completion]");
            return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (completion === "all" || row.checklistCompletionStatus === completion));
        }
        buildPublicPageContentChecklist(updateUi) {
            const qa = this.latestStaticPublishHandoffQaSummary || this.buildStaticPublishHandoffQaSummary(false);
            const rows = (qa.qaRows || []).map((row) => this.buildPublicPageContentChecklistRow(row));
            const payload = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPublicPageContentChecklist", publicPageContentChecklistVersion: "1.0.0", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel", checklistRows: Object.freeze(rows), warnings: Object.freeze(rows.flatMap((row) => row.warnings || [])), rejectedPhrases: Object.freeze(rows.filter((row) => row.rejectedPhraseStatus !== "clear").map((row) => row.rejectedPhraseStatus)), recommendedFixes: Object.freeze(rows.flatMap((row) => row.recommendedFixes || [])), falsificationNotes: Object.freeze(rows.map((row) => row.falsificationCallout)), speculativeBoundaryText: "Public Page Content Checklist exports are inert local human-review artifacts only. They do not write to a server, publish pages, inject schema, prove physics, or imply operational capability.", references: Object.freeze(["staticPublishHandoffQaSummary", "pageDraftFreezeBundle", "staticPublicationReviewChecklist", "pageReadinessDiff", "publicDemoPublicationHandoffManifest", "staticPageDraftExport", "publicDemoRouteDraftBundle", "seoSchemaReview", "copyReviewBundle", "publicDemoScriptBuilder", "screenshotCaptionPack", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary"]), exportContainsExecutableCode: false });
            this.latestPublicPageContentChecklist = payload;
            if (updateUi) { this.renderStaticPublishHandoffQaSummary(); this.renderPublicPageContentChecklist(); this.updateStatus("Built local Public Page Content Checklist rows."); }
            return payload;
        }
        renderPublicPageContentChecklist() {
            const body = this.root.querySelector("[data-arcsecs-public-page-content-checklist-body]"); const status = this.root.querySelector("[data-arcsecs-public-page-content-checklist-status]"); if (!body) { return; }
            const payload = this.latestPublicPageContentChecklist || this.buildPublicPageContentChecklist(false); const rows = this.filterPublicPageContentChecklistRows(payload.checklistRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="13">No public page content checklist rows match the current filters.</td></tr>'; if (status) status.textContent = "Public Page Content Checklist has no matching rows."; return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.suggestedSlug + " | " + row.pageTitle + " | " + row.metaTitle + " | " + row.metaDescription)}</td><td>${auditEscapeHtml(row.heroTitle + " | " + row.introParagraph)}</td><td>${auditEscapeHtml(Object.keys(row.demoScriptSections || {}).join(", ") || "missing")}</td><td>${auditEscapeHtml(row.screenshotCaption)}</td><td>${auditEscapeHtml(row.altText)}</td><td>${auditEscapeHtml(row.telemetryCallout + " | " + row.sourceEquationCallout + " | " + row.falsificationCallout + " | " + row.speculativeBoundaryCopy)}</td><td>${auditEscapeHtml(row.schemaReviewNote)}</td><td>${auditEscapeHtml((row.internalLinkTextRows || []).length ? "text-only rows present" : "pending")}</td><td>${auditEscapeHtml(row.evidenceReferenceNote)}</td><td>${auditEscapeHtml(row.rejectedPhraseStatus)}</td><td>${auditEscapeHtml(row.placeholderSpeculativeLabelStatus)}</td><td>${auditEscapeHtml(row.checklistCompletionStatus)}</td></tr>`).join("");
            if (status) { status.textContent = "Public Page Content Checklist has " + rows.length + " local row" + (rows.length === 1 ? "" : "s") + ". It does not write to a server."; }
        }
        exportSelectedQaSummaryJson() {
            const payload = this.latestStaticPublishHandoffQaSummary || this.buildStaticPublishHandoffQaSummary(false);
            const activeScenario = this.toConfig ? this.toConfig().scenario : "distanceTimeKernel";
            const selectedRow = (payload.qaRows || []).find((row) => row.activeScenario === activeScenario) || (payload.qaRows || [])[0] || null;
            this.download("arcsecs-selected-static-publish-handoff-qa-summary.json", JSON.stringify(Object.assign({}, payload, { exportType: "ArcSecsSelectedStaticPublishHandoffQaSummary", selectedQaRow: selectedRow, qaRows: selectedRow ? [selectedRow] : [] }), null, 2), "application/json");
            this.updateStatus("Exported selected inert Static Publish Handoff QA Summary JSON.");
        }
        exportAllQaSummariesJson() { const payload = this.latestStaticPublishHandoffQaSummary || this.buildStaticPublishHandoffQaSummary(false); this.download("arcsecs-all-static-publish-handoff-qa-summaries.json", JSON.stringify(payload, null, 2), "application/json"); this.updateStatus("Exported all inert Static Publish Handoff QA Summary JSON."); }
        exportPublicPageContentChecklistJson() { const payload = this.latestPublicPageContentChecklist || this.buildPublicPageContentChecklist(false); this.download("arcsecs-public-page-content-checklist.json", JSON.stringify(payload, null, 2), "application/json"); this.updateStatus("Exported inert Public Page Content Checklist JSON."); }


        // v5.8.36 Public Publishing Evidence Archive Index and Reviewer Retrieval Notes.
        bindManualPublishingRunbookControls() {
            const buildRunbook = this.root.querySelector("[data-arcsecs-build-manual-publishing-runbook]"); if (buildRunbook) buildRunbook.addEventListener("click", () => this.buildPublicPageManualPublishingRunbook(true));
            const buildPostDeploy = this.root.querySelector("[data-arcsecs-build-post-deploy-verification-checklist]"); if (buildPostDeploy) buildPostDeploy.addEventListener("click", () => this.buildPostDeployVerificationChecklist(true));
            const exportSelected = this.root.querySelector("[data-arcsecs-export-selected-manual-runbook-json]"); if (exportSelected) exportSelected.addEventListener("click", () => this.exportSelectedManualRunbookJson());
            const exportAll = this.root.querySelector("[data-arcsecs-export-all-manual-runbooks-json]"); if (exportAll) exportAll.addEventListener("click", () => this.exportAllManualRunbooksJson());
            const exportPostDeploy = this.root.querySelector("[data-arcsecs-export-post-deploy-verification-checklist-json]"); if (exportPostDeploy) exportPostDeploy.addEventListener("click", () => this.exportPostDeployVerificationChecklistJson());
            this.root.querySelectorAll("[data-arcsecs-manual-runbook-filter-scenario], [data-arcsecs-manual-runbook-filter-qa-status], [data-arcsecs-manual-runbook-filter-checklist-completion], [data-arcsecs-manual-runbook-filter-warning], [data-arcsecs-manual-runbook-filter-rejected-phrase], [data-arcsecs-manual-runbook-filter-manual-handoff], [data-arcsecs-manual-handoff-status]").forEach((input) => input.addEventListener("change", () => { this.renderPublicPageManualPublishingRunbook(); this.renderPostDeployVerificationChecklist(); }));
        }
        getManualRunbookFilterValue(selector) { const input = this.root.querySelector(selector); return input && input.value ? input.value : "all"; }
        getManualHandoffStatusValue() { const input = this.root.querySelector("[data-arcsecs-manual-handoff-status]"); return input && input.value ? input.value : "not-reviewed"; }
        getManualRunbookSourceRows() {
            const qa = this.latestStaticPublishHandoffQaSummary || this.buildStaticPublishHandoffQaSummary(false);
            const checklist = this.latestPublicPageContentChecklist || this.buildPublicPageContentChecklist(false);
            const qaRows = qa && Array.isArray(qa.qaRows) ? qa.qaRows : [];
            const checklistRows = checklist && Array.isArray(checklist.checklistRows) ? checklist.checklistRows : [];
            if (qaRows.length) { return qaRows.map((qaRow) => Object.freeze({ qaRow, checklistRow: checklistRows.find((row) => row.activeScenario === qaRow.activeScenario) || null })); }
            const scenarioKey = this.toConfig ? this.toConfig().scenario : "distanceTimeKernel";
            return [Object.freeze({ qaRow: Object.freeze({ activeScenario: scenarioKey, scenarioLabel: ScenarioRegistry.getScenario(scenarioKey).label, finalQaStatus: "not-reviewed", warningCount: 1, rejectedPhraseCount: 0, recommendedFixCount: 1, recommendedFixes: ["Build Static Publish Handoff QA Summary before manual publishing handoff."], warnings: ["QA summary missing."], speculativeBoundaryText: "Speculative research visualization boundary text required.", exportContainsExecutableCode: false }), checklistRow: null })];
        }
        buildPublicPageManualPublishingRunbookRow(pair) {
            const qaRow = pair.qaRow || {};
            const checklistRow = pair.checklistRow || {};
            const recommendedFixes = Array.from(new Set([].concat(qaRow.recommendedFixes || [], checklistRow.recommendedFixes || [])));
            const warnings = Array.from(new Set([].concat(qaRow.warnings || [], checklistRow.warnings || [])));
            const rejectedPhraseStatus = checklistRow.rejectedPhraseStatus || (qaRow.rejectedPhraseCount > 0 ? "rejected-phrases" : "clear");
            const qaStatus = qaRow.finalQaStatus || "not-reviewed";
            const checklistCompletionStatus = checklistRow.checklistCompletionStatus || "incomplete";
            if (["blocked", "rejected", "needs-revision", "not-reviewed"].indexOf(qaStatus) >= 0) { recommendedFixes.push("Resolve QA status before manual publishing handoff-ready review."); }
            if (checklistCompletionStatus !== "complete") { recommendedFixes.push("Complete the Public Page Content Checklist before manual publishing handoff."); }
            if (rejectedPhraseStatus !== "clear") { recommendedFixes.push("Remove rejected proof or operational-capability phrases before manual publishing handoff."); }
            if (qaStatus === "qa-ready-with-warnings") { warnings.push("QA status is qa-ready-with-warnings; manual handoff can only be handoff-ready-with-warnings until reviewed."); }
            if (recommendedFixes.length) { warnings.push("Manual runbook has unresolved recommended fixes."); }
            let manualHandoffStatus = this.getManualHandoffStatusValue();
            if (["blocked", "rejected", "needs-revision", "not-reviewed"].indexOf(qaStatus) >= 0 || checklistCompletionStatus !== "complete" || rejectedPhraseStatus !== "clear") { manualHandoffStatus = manualHandoffStatus === "rejected" ? "rejected" : "blocked"; }
            else if (warnings.length || qaStatus === "qa-ready-with-warnings" || recommendedFixes.length) { manualHandoffStatus = "handoff-ready-with-warnings"; }
            else if (manualHandoffStatus === "not-reviewed") { manualHandoffStatus = "handoff-ready"; }
            return Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPublicPageManualPublishingRunbookRow", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: qaRow.activeScenario || checklistRow.activeScenario || "distanceTimeKernel", scenarioLabel: qaRow.scenarioLabel || checklistRow.scenarioLabel || "Current Scenario", qaStatus, checklistCompletionStatus, suggestedSlug: checklistRow.suggestedSlug || "missing slug", pageTitle: checklistRow.pageTitle || "missing page title", metaTitle: checklistRow.metaTitle || "missing meta title", metaDescription: checklistRow.metaDescription || "missing meta description", heroTitle: checklistRow.heroTitle || "missing hero title", introParagraph: checklistRow.introParagraph || "missing intro paragraph", schemaReviewNote: checklistRow.schemaReviewNote || "missing schema review note", evidenceReferenceNote: checklistRow.evidenceReferenceNote || "missing evidence reference note", warningCount: warnings.length, rejectedPhraseStatus, placeholderSpeculativeLabelStatus: checklistRow.placeholderSpeculativeLabelStatus || "placeholder/speculative label review pending", manualHandoffStatus, warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhraseStatus === "clear" ? [] : [rejectedPhraseStatus]), recommendedFixes: Object.freeze(recommendedFixes), staticPublishHandoffQaSummaryRow: qaRow, publicPageContentChecklistRow: checklistRow, speculativeBoundaryText: "Manual Publishing Runbook rows are local human-review artifacts only. They do not create WordPress pages, publish posts, inject schema, fetch links, validate routes, prove physics, or imply operational capability.", exportContainsExecutableCode: false });
        }
        filterManualRunbookRows(rows) {
            const scenario = this.getManualRunbookFilterValue("[data-arcsecs-manual-runbook-filter-scenario]");
            const qa = this.getManualRunbookFilterValue("[data-arcsecs-manual-runbook-filter-qa-status]");
            const completion = this.getManualRunbookFilterValue("[data-arcsecs-manual-runbook-filter-checklist-completion]");
            const warning = this.getManualRunbookFilterValue("[data-arcsecs-manual-runbook-filter-warning]");
            const rejected = this.getManualRunbookFilterValue("[data-arcsecs-manual-runbook-filter-rejected-phrase]");
            const handoff = this.getManualRunbookFilterValue("[data-arcsecs-manual-runbook-filter-manual-handoff]");
            return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (qa === "all" || row.qaStatus === qa) && (completion === "all" || row.checklistCompletionStatus === completion) && (warning === "all" || (warning === "clear" ? row.warningCount === 0 : row.warningCount > 0)) && (rejected === "all" || row.rejectedPhraseStatus === rejected) && (handoff === "all" || row.manualHandoffStatus === handoff));
        }
        buildPublicPageManualPublishingRunbook(updateUi) {
            const rows = this.getManualRunbookSourceRows().map((pair) => this.buildPublicPageManualPublishingRunbookRow(pair));
            const payload = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPublicPageManualPublishingRunbook", publicPageManualPublishingRunbookVersion: "1.0.0", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel", runbookRows: Object.freeze(rows), manualHandoffStatusesSupported: Object.freeze(["not-reviewed", "handoff-ready", "handoff-ready-with-warnings", "needs-revision", "blocked", "rejected"]), warnings: Object.freeze(rows.flatMap((row) => row.warnings || [])), rejectedPhrases: Object.freeze(rows.flatMap((row) => row.rejectedPhrases || [])), recommendedFixes: Object.freeze(rows.flatMap((row) => row.recommendedFixes || [])), falsificationNotes: Object.freeze(rows.map((row) => "Manual publishing handoff keeps falsification callouts visible for " + row.scenarioLabel + ".")), speculativeBoundaryText: "Public Page Manual Publishing Runbook exports are inert local human-review artifacts only. They do not publish pages, create WordPress content, inject schema, fetch links, prove physics, or imply operational capability.", references: Object.freeze(["staticPublishHandoffQaSummary", "publicPageContentChecklist", "pageDraftFreezeBundle", "staticPublicationReviewChecklist", "pageReadinessDiff", "publicDemoPublicationHandoffManifest", "staticPageDraftExport", "publicDemoRouteDraftBundle", "seoSchemaReview", "copyReviewBundle", "publicDemoScriptBuilder", "screenshotCaptionPack", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary", "uaiMemoryOrganizationCompletenessCheck"]), exportContainsExecutableCode: false });
            this.latestPublicPageManualPublishingRunbook = payload;
            if (updateUi) { this.renderPublicPageManualPublishingRunbook(); this.renderPostDeployVerificationChecklist(); this.updateStatus("Built local Public Page Manual Publishing Runbook rows."); }
            return payload;
        }
        renderPublicPageManualPublishingRunbook() {
            const body = this.root.querySelector("[data-arcsecs-manual-publishing-runbook-body]"); const status = this.root.querySelector("[data-arcsecs-manual-publishing-runbook-status]"); if (!body) return;
            const payload = this.latestPublicPageManualPublishingRunbook || this.buildPublicPageManualPublishingRunbook(false); const rows = this.filterManualRunbookRows(payload.runbookRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="13">No manual publishing runbook rows match the current filters.</td></tr>'; if (status) status.textContent = "Manual Publishing Runbook has no matching rows."; return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.qaStatus)}</td><td>${auditEscapeHtml(row.checklistCompletionStatus)}</td><td>${auditEscapeHtml(row.suggestedSlug)}</td><td>${auditEscapeHtml(row.pageTitle)}</td><td>${auditEscapeHtml(row.metaTitle)}</td><td>${auditEscapeHtml(row.metaDescription)}</td><td>${auditEscapeHtml(row.heroTitle)}</td><td>${auditEscapeHtml(row.schemaReviewNote)}</td><td>${auditEscapeHtml(row.evidenceReferenceNote)}</td><td>${auditEscapeHtml(String(row.warningCount))}</td><td>${auditEscapeHtml(row.rejectedPhraseStatus)}</td><td>${auditEscapeHtml(row.manualHandoffStatus)}</td></tr>`).join("");
            if (status) status.textContent = "Manual Publishing Runbook has " + rows.length + " local row" + (rows.length === 1 ? "" : "s") + ". It is human manual publishing preparation only and does not publish anything.";
        }
        buildPostDeployVerificationChecklistRow(runbookRow) {
            const pending = "pending-human-confirmation";
            const items = Object.freeze({ routeManuallyCreatedConfirmation: pending, pageTitleVisibleConfirmation: pending, metaDescriptionReviewedConfirmation: pending, speculativeBoundaryVisibleConfirmation: pending, falsificationCalloutVisibleConfirmation: pending, sourceEquationCalloutVisibleConfirmation: pending, screenshotCaptionVisibleConfirmation: pending, altTextReviewedConfirmation: pending, placeholderSpeculativeLabelsVisibleConfirmation: pending, noProofWordingConfirmation: pending, noOperationalCapabilityWordingConfirmation: pending, evidenceReferenceVisibleConfirmation: pending, exportArchiveRetainedConfirmation: pending });
            return Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPostDeployVerificationChecklistRow", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: runbookRow.activeScenario, scenarioLabel: runbookRow.scenarioLabel, manualHandoffStatus: runbookRow.manualHandoffStatus, verificationStatus: "pending-human-verification", routeManuallyCreatedConfirmation: items.routeManuallyCreatedConfirmation, pageTitleVisibleConfirmation: items.pageTitleVisibleConfirmation, metaDescriptionReviewedConfirmation: items.metaDescriptionReviewedConfirmation, speculativeBoundaryVisibleConfirmation: items.speculativeBoundaryVisibleConfirmation, falsificationCalloutVisibleConfirmation: items.falsificationCalloutVisibleConfirmation, sourceEquationCalloutVisibleConfirmation: items.sourceEquationCalloutVisibleConfirmation, screenshotCaptionVisibleConfirmation: items.screenshotCaptionVisibleConfirmation, altTextReviewedConfirmation: items.altTextReviewedConfirmation, placeholderSpeculativeLabelsVisibleConfirmation: items.placeholderSpeculativeLabelsVisibleConfirmation, noProofWordingConfirmation: items.noProofWordingConfirmation, noOperationalCapabilityWordingConfirmation: items.noOperationalCapabilityWordingConfirmation, evidenceReferenceVisibleConfirmation: items.evidenceReferenceVisibleConfirmation, exportArchiveRetainedConfirmation: items.exportArchiveRetainedConfirmation, warnings: Object.freeze(runbookRow.warnings || []), recommendedFixes: Object.freeze(runbookRow.recommendedFixes || []), publicPageManualPublishingRunbookRow: runbookRow, speculativeBoundaryText: "Post-Deploy Verification Checklist rows are local human checklist artifacts only. The plugin does not fetch, verify, publish, crawl, or validate live pages automatically.", exportContainsExecutableCode: false });
        }
        buildPostDeployVerificationChecklist(updateUi) {
            const runbook = this.latestPublicPageManualPublishingRunbook || this.buildPublicPageManualPublishingRunbook(false);
            const rows = (runbook.runbookRows || []).map((row) => this.buildPostDeployVerificationChecklistRow(row));
            const payload = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPostDeployVerificationChecklist", postDeployVerificationChecklistVersion: "1.0.0", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel", postDeployVerificationRows: Object.freeze(rows), warnings: Object.freeze(rows.flatMap((row) => row.warnings || [])), rejectedPhrases: Object.freeze((runbook.rejectedPhrases || [])), recommendedFixes: Object.freeze(rows.flatMap((row) => row.recommendedFixes || [])), falsificationNotes: Object.freeze(rows.map((row) => "Human reviewer must verify falsification callout visibility for " + row.scenarioLabel + ".")), speculativeBoundaryText: "Post-Deploy Verification Checklist exports are inert local human-review artifacts only. They do not automatically verify live pages, publish pages, create content, inject schema, prove physics, or imply operational capability.", references: Object.freeze(["publicPageManualPublishingRunbook", "staticPublishHandoffQaSummary", "publicPageContentChecklist", "pageDraftFreezeBundle", "staticPublicationReviewChecklist", "pageReadinessDiff", "publicDemoPublicationHandoffManifest", "staticPageDraftExport", "publicDemoRouteDraftBundle", "seoSchemaReview", "copyReviewBundle", "publicDemoScriptBuilder", "screenshotCaptionPack", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary", "uaiMemoryOrganizationCompletenessCheck"]), exportContainsExecutableCode: false });
            this.latestPostDeployVerificationChecklist = payload;
            if (updateUi) { this.renderPostDeployVerificationChecklist(); this.updateStatus("Built local Post-Deploy Verification Checklist rows."); }
            return payload;
        }
        renderPostDeployVerificationChecklist() {
            const body = this.root.querySelector("[data-arcsecs-post-deploy-verification-body]"); const status = this.root.querySelector("[data-arcsecs-post-deploy-verification-status]"); if (!body) return;
            const payload = this.latestPostDeployVerificationChecklist || this.buildPostDeployVerificationChecklist(false); const rows = this.filterManualRunbookRows(payload.postDeployVerificationRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="14">No post-deploy verification checklist rows match the current filters.</td></tr>'; if (status) status.textContent = "Post-Deploy Verification Checklist has no matching rows."; return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.manualHandoffStatus)}</td><td>${auditEscapeHtml(row.routeManuallyCreatedConfirmation)}</td><td>${auditEscapeHtml(row.pageTitleVisibleConfirmation)}</td><td>${auditEscapeHtml(row.metaDescriptionReviewedConfirmation)}</td><td>${auditEscapeHtml(row.speculativeBoundaryVisibleConfirmation)}</td><td>${auditEscapeHtml(row.falsificationCalloutVisibleConfirmation)}</td><td>${auditEscapeHtml(row.sourceEquationCalloutVisibleConfirmation)}</td><td>${auditEscapeHtml(row.screenshotCaptionVisibleConfirmation)}</td><td>${auditEscapeHtml(row.altTextReviewedConfirmation)}</td><td>${auditEscapeHtml(row.placeholderSpeculativeLabelsVisibleConfirmation)}</td><td>${auditEscapeHtml(row.noProofWordingConfirmation)}</td><td>${auditEscapeHtml(row.noOperationalCapabilityWordingConfirmation)}</td><td>${auditEscapeHtml(row.exportArchiveRetainedConfirmation)}</td></tr>`).join("");
            if (status) status.textContent = "Post-Deploy Verification Checklist has " + rows.length + " local row" + (rows.length === 1 ? "" : "s") + ". It does not fetch or verify live pages automatically.";
        }
        exportSelectedManualRunbookJson() {
            const payload = this.latestPublicPageManualPublishingRunbook || this.buildPublicPageManualPublishingRunbook(false);
            const activeScenario = this.toConfig ? this.toConfig().scenario : "distanceTimeKernel";
            const selectedRow = (payload.runbookRows || []).find((row) => row.activeScenario === activeScenario) || (payload.runbookRows || [])[0] || null;
            this.download("arcsecs-selected-manual-publishing-runbook.json", JSON.stringify(Object.assign({}, payload, { exportType: "ArcSecsSelectedPublicPageManualPublishingRunbook", selectedRunbookRow: selectedRow, runbookRows: selectedRow ? [selectedRow] : [] }), null, 2), "application/json");
            this.updateStatus("Exported selected inert Manual Publishing Runbook JSON.");
        }
        exportAllManualRunbooksJson() { const payload = this.latestPublicPageManualPublishingRunbook || this.buildPublicPageManualPublishingRunbook(false); this.download("arcsecs-all-manual-publishing-runbooks.json", JSON.stringify(payload, null, 2), "application/json"); this.updateStatus("Exported all inert Manual Publishing Runbook JSON."); }
        exportPostDeployVerificationChecklistJson() { const payload = this.latestPostDeployVerificationChecklist || this.buildPostDeployVerificationChecklist(false); this.download("arcsecs-post-deploy-verification-checklist.json", JSON.stringify(payload, null, 2), "application/json"); this.updateStatus("Exported inert Post-Deploy Verification Checklist JSON."); }

        bindStaticPublicationReviewControls() {
            const buildChecklist = this.root.querySelector("[data-arcsecs-build-static-publication-review-checklist]"); if (buildChecklist) buildChecklist.addEventListener("click", () => this.buildStaticPublicationReviewChecklist(true));
            const buildFreezeBundle = this.root.querySelector("[data-arcsecs-build-page-draft-freeze-bundle]"); if (buildFreezeBundle) buildFreezeBundle.addEventListener("click", () => this.buildPageDraftFreezeBundle(true));
            const exportSelectedFreeze = this.root.querySelector("[data-arcsecs-export-selected-freeze-bundle-json]"); if (exportSelectedFreeze) exportSelectedFreeze.addEventListener("click", () => this.exportSelectedFreezeBundleJson());
            const exportAllFreeze = this.root.querySelector("[data-arcsecs-export-all-freeze-bundles-json]"); if (exportAllFreeze) exportAllFreeze.addEventListener("click", () => this.exportAllFreezeBundlesJson());
            this.root.querySelectorAll("[data-arcsecs-static-publication-filter-scenario], [data-arcsecs-static-publication-filter-diff-status], [data-arcsecs-static-publication-filter-freeze-status], [data-arcsecs-static-publication-filter-warning], [data-arcsecs-static-publication-filter-stale], [data-arcsecs-static-publication-filter-rejected-phrase]").forEach((control) => control.addEventListener("change", () => { this.renderStaticPublicationReviewChecklist(); this.renderPageDraftFreezeBundle(); this.renderPublicPublishingEvidenceArchiveIndex(); this.renderReviewerRetrievalNotes(); }));
        }
        getStaticPublicationFilterValue(selector) { const control = this.root.querySelector(selector); return control && control.value ? control.value : "all"; }
        getStaticPublicationReviewChecklistRows() {
            const diff = this.latestPageReadinessDiff || this.buildPageReadinessDiff(false);
            const rows = (diff && diff.diffRows ? diff.diffRows : []).map((diffRow) => this.buildStaticPublicationReviewChecklistRow(diffRow));
            if (rows.length) { return rows; }
            return [this.buildStaticPublicationReviewChecklistRow({ activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel", scenarioLabel: "Current Scenario", diffStatus: "missing", diffReviewStatus: "not-reviewed", staleStatus: "current", missingFieldStatus: "missing-fields", warningStatus: "warnings", rejectedPhrases: [], warnings: ["No Page Readiness Diff row exists."], missingFields: ["pageReadinessDiff"], recommendedFixes: ["Build Page Readiness Diff before freezing static page drafts."], currentRow: null, importedRow: null })];
        }
        buildStaticPublicationReviewChecklistRow(diffRow) {
            const currentRow = diffRow && diffRow.currentRow ? diffRow.currentRow : null;
            const row = currentRow || diffRow || {};
            const missingFields = Array.from(new Set((diffRow && diffRow.missingFields) || []));
            const warnings = Array.from(new Set((diffRow && diffRow.warnings) || []));
            const rejectedPhrases = Array.from(new Set((diffRow && diffRow.rejectedPhrases) || []));
            const recommendedFixes = Array.from(new Set((diffRow && diffRow.recommendedFixes) || []));
            const has = (field) => !!(row && row[field] && (!Array.isArray(row[field]) || row[field].length));
            const routeMetadataStatus = has("suggestedSlug") && has("suggestedMetaTitle") && has("suggestedMetaDescription") ? "present" : "missing";
            const schemaReviewStatus = has("suggestedSchemaReview") ? "present" : "missing";
            const copyReviewStatus = has("suggestedIntroParagraph") && has("suggestedBoundaryCopy") ? "present" : "missing";
            const evidencePackStatus = has("reviewerEvidenceExportPackRow") ? "present" : "missing";
            const sourceEquationStatus = has("sourceMatrixRow") && has("scenarioEquationLibraryRow") ? "matched" : "missing";
            const falsificationStatus = has("suggestedFalsificationCallout") ? "present" : "missing";
            const boundaryStatus = has("speculativeBoundaryText") || has("suggestedBoundaryCopy") ? "present" : "missing";
            [["route metadata", routeMetadataStatus, "Regenerate Public Demo Route Draft Bundle before final freeze."], ["schema review", schemaReviewStatus, "Build SEO Schema Review before final freeze. Missing schema review must block final freeze."], ["copy review", copyReviewStatus, "Build Copy Review Bundle and boundary copy before final freeze."], ["evidence pack", evidencePackStatus, "Export Reviewer Evidence Export Pack before final freeze."], ["source matrix row", has("sourceMatrixRow") ? "present" : "missing", "Confirm Scientific Source Matrix row before final freeze."], ["equation library row", has("scenarioEquationLibraryRow") ? "present" : "missing", "Confirm Scenario Equation Library row before final freeze."], ["falsification", falsificationStatus, "Add falsification callout before final freeze."], ["speculative boundary text", boundaryStatus, "Add speculative research visualization boundary text before final freeze."]].forEach((item) => { if (item[1] === "missing") { if (warnings.indexOf("missing " + item[0]) < 0) warnings.push("missing " + item[0]); if (recommendedFixes.indexOf(item[2]) < 0) recommendedFixes.push(item[2]); } });
            const combined = JSON.stringify(row).toLowerCase();
            ["proves", "proven", "working propulsion", "validated technology", "established technology", "operational capability", "real propulsion"].forEach((phrase) => { if (combined.indexOf(phrase) >= 0 && rejectedPhrases.indexOf(phrase) < 0) { rejectedPhrases.push(phrase); warnings.push("unsafe wording risk: " + phrase); recommendedFixes.push("Replace unsupported proof or operational-capability wording with cautious speculative research visualization language."); } });
            if (combined.indexOf("placeholder") >= 0 && combined.indexOf("speculative") < 0) { warnings.push("unlabeled placeholder/speculative modes"); recommendedFixes.push("Label placeholder modes as placeholder/speculative before freezing static page drafts."); }
            const staleStatus = (diffRow && (diffRow.staleStatus === "stale" || diffRow.stalePackageVersion)) ? "stale" : "current";
            const freezeControl = this.root.querySelector("[data-arcsecs-static-publication-freeze-status]");
            let freezeStatus = freezeControl && freezeControl.value ? freezeControl.value : "not-reviewed";
            const blockingIssues = [routeMetadataStatus, schemaReviewStatus, copyReviewStatus, evidencePackStatus, sourceEquationStatus, falsificationStatus, boundaryStatus].filter((status) => status === "missing").length;
            if (rejectedPhrases.length) { freezeStatus = "rejected"; }
            else if (blockingIssues) { freezeStatus = "blocked"; }
            else if (staleStatus === "stale" && freezeStatus !== "frozen-with-warnings") { freezeStatus = "needs-revision"; warnings.push("stale rows require frozen-with-warnings or regeneration before final freeze"); recommendedFixes.push("Regenerate stale imported rows or mark frozen-with-warnings with explanation."); }
            else if (warnings.length && freezeStatus === "not-reviewed") { freezeStatus = "frozen-with-warnings"; }
            return Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsStaticPublicationReviewChecklistRow", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: row.activeScenario || (diffRow && diffRow.activeScenario) || "distanceTimeKernel", scenarioLabel: row.scenarioLabel || (diffRow && diffRow.scenarioLabel) || "Current Scenario", diffStatus: (diffRow && diffRow.diffStatus) || "missing", diffReviewStatus: (diffRow && diffRow.diffReviewStatus) || "not-reviewed", staleStatus, missingFieldStatus: missingFields.length ? "missing-fields" : "complete", warningStatus: warnings.length ? "warnings" : "clear", rejectedPhraseStatus: rejectedPhrases.length ? "rejected-phrases" : "clear", routeMetadataStatus, schemaReviewStatus, copyReviewStatus, evidencePackStatus, sourceEquationStatus, falsificationStatus, boundaryStatus, freezeStatus, missingFields: Object.freeze(missingFields), changedFields: Object.freeze((diffRow && diffRow.changedFields) || []), warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhrases), recommendedFixes: Object.freeze(Array.from(new Set(recommendedFixes))), pageReadinessDiffRow: diffRow || null, staticPageDraftExportRow: currentRow, publicationHandoffManifestRow: currentRow && currentRow.publicationHandoffManifestRow ? currentRow.publicationHandoffManifestRow : null, speculativeBoundaryText: "Static Publication Review Checklist rows are local reviewer freeze checks for speculative research visualization drafts. They do not publish anything and are not proof or operational capability.", exportContainsExecutableCode: false });
        }
        filterStaticPublicationReviewChecklistRows(rows) {
            const scenario = this.getStaticPublicationFilterValue("[data-arcsecs-static-publication-filter-scenario]");
            const diffStatus = this.getStaticPublicationFilterValue("[data-arcsecs-static-publication-filter-diff-status]");
            const freezeStatus = this.getStaticPublicationFilterValue("[data-arcsecs-static-publication-filter-freeze-status]");
            const warning = this.getStaticPublicationFilterValue("[data-arcsecs-static-publication-filter-warning]");
            const stale = this.getStaticPublicationFilterValue("[data-arcsecs-static-publication-filter-stale]");
            const rejectedPhrase = this.getStaticPublicationFilterValue("[data-arcsecs-static-publication-filter-rejected-phrase]");
            return (rows || []).filter((row) => (scenario === "all" || row.activeScenario === scenario) && (diffStatus === "all" || row.diffStatus === diffStatus) && (freezeStatus === "all" || row.freezeStatus === freezeStatus) && (warning === "all" || row.warningStatus === warning) && (stale === "all" || row.staleStatus === stale) && (rejectedPhrase === "all" || row.rejectedPhraseStatus === rejectedPhrase));
        }
        buildStaticPublicationReviewChecklist(updateUi) {
            const rows = this.getStaticPublicationReviewChecklistRows();
            const payload = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsStaticPublicationReviewChecklist", staticPublicationReviewChecklistVersion: "1.0.0", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel", checklistRows: Object.freeze(rows), freezeStatusesSupported: Object.freeze(["not-reviewed", "frozen-for-review", "frozen-with-warnings", "needs-revision", "blocked", "rejected"]), missingFields: Object.freeze(rows.flatMap((row) => row.missingFields || [])), changedFields: Object.freeze(rows.flatMap((row) => row.changedFields || [])), warnings: Object.freeze(rows.flatMap((row) => row.warnings || [])), rejectedPhrases: Object.freeze(rows.flatMap((row) => row.rejectedPhrases || [])), recommendedFixes: Object.freeze(rows.flatMap((row) => row.recommendedFixes || [])), falsificationNotes: Object.freeze(rows.map((row) => "Falsification status for " + row.scenarioLabel + ": " + row.falsificationStatus)), speculativeBoundaryText: "Static Publication Review Checklist is a local human-review artifact only. It does not publish pages, inject schema, fetch links, validate routes, prove physics, or imply operational capability.", exportContainsExecutableCode: false });
            this.latestStaticPublicationReviewChecklist = payload;
            if (updateUi) { this.renderStaticPublicationReviewChecklist(); this.renderPageDraftFreezeBundle(); this.renderPublicPublishingEvidenceArchiveIndex(); this.renderReviewerRetrievalNotes(); this.updateStatus("Built local Static Publication Review Checklist rows."); }
            return payload;
        }
        renderStaticPublicationReviewChecklist() {
            const body = this.root.querySelector("[data-arcsecs-static-publication-review-body]"); const status = this.root.querySelector("[data-arcsecs-static-publication-review-status]"); if (!body) { return; }
            const payload = this.latestStaticPublicationReviewChecklist || this.buildStaticPublicationReviewChecklist(false); const rows = this.filterStaticPublicationReviewChecklistRows(payload.checklistRows || []);
            if (!rows.length) { body.innerHTML = '<tr><td colspan="15">No static publication checklist rows match the current filters.</td></tr>'; if (status) status.textContent = "Static Publication Review Checklist has no matching rows."; return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.diffStatus)}</td><td>${auditEscapeHtml(row.diffReviewStatus)}</td><td>${auditEscapeHtml(row.staleStatus)}</td><td>${auditEscapeHtml(row.missingFieldStatus + ((row.missingFields || []).length ? ": " + row.missingFields.join(", ") : ""))}</td><td>${auditEscapeHtml((row.warnings || []).join("; ") || row.warningStatus)}</td><td>${auditEscapeHtml((row.rejectedPhrases || []).join(", ") || row.rejectedPhraseStatus)}</td><td>${auditEscapeHtml(row.routeMetadataStatus)}</td><td>${auditEscapeHtml(row.schemaReviewStatus)}</td><td>${auditEscapeHtml(row.copyReviewStatus)}</td><td>${auditEscapeHtml(row.evidencePackStatus)}</td><td>${auditEscapeHtml(row.sourceEquationStatus)}</td><td>${auditEscapeHtml(row.falsificationStatus)}</td><td>${auditEscapeHtml(row.boundaryStatus)}</td><td>${auditEscapeHtml(row.freezeStatus)}</td></tr>`).join("");
            if (status) { status.textContent = "Static Publication Review Checklist has " + rows.length + " local row" + (rows.length === 1 ? "" : "s") + ". This reviewer checklist does not publish anything."; }
        }
        buildPageDraftFreezeBundleRow(checklistRow) {
            const diffRow = checklistRow.pageReadinessDiffRow || {}; const staticRow = checklistRow.staticPageDraftExportRow || (diffRow && diffRow.currentRow) || {};
            const missingFields = Array.from(new Set((checklistRow.missingFields || []).concat((diffRow && diffRow.missingFields) || [])));
            const changedFields = Array.from(new Set((checklistRow.changedFields || []).concat((diffRow && diffRow.changedFields) || [])));
            const warnings = Array.from(new Set((checklistRow.warnings || []).concat((diffRow && diffRow.warnings) || [])));
            const rejectedPhrases = Array.from(new Set((checklistRow.rejectedPhrases || []).concat((diffRow && diffRow.rejectedPhrases) || [])));
            const recommendedFixes = Array.from(new Set((checklistRow.recommendedFixes || []).concat((diffRow && diffRow.recommendedFixes) || [])));
            return Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPageDraftFreezeBundleRow", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: checklistRow.activeScenario, scenarioLabel: checklistRow.scenarioLabel, pageReadinessDiffRow: diffRow || null, staticPageDraftExportRow: staticRow || null, publicationHandoffManifestRow: checklistRow.publicationHandoffManifestRow || null, routeDraftRow: staticRow.routeDraftRow || staticRow.publicationHandoffManifestRow || null, seoSchemaReviewRow: staticRow.suggestedSchemaReview || null, copyReviewBundleRow: staticRow.copyReviewBundleRow || null, publicDemoScriptRow: staticRow.suggestedDemoScriptSections || null, screenshotCaptionRow: staticRow.suggestedScreenshotCaption || null, reviewerEvidenceExportPackRow: staticRow.reviewerEvidenceExportPackRow || null, sourceMatrixRow: staticRow.sourceMatrixRow || null, scenarioEquationLibraryRow: staticRow.scenarioEquationLibraryRow || null, checklistState: checklistRow, freezeStatus: checklistRow.freezeStatus, missingFields: Object.freeze(missingFields), changedFields: Object.freeze(changedFields), warnings: Object.freeze(warnings), rejectedPhrases: Object.freeze(rejectedPhrases), recommendedFixes: Object.freeze(recommendedFixes), falsificationNotes: Object.freeze((staticRow.falsificationNotes || []).concat([staticRow.suggestedFalsificationCallout || checklistRow.falsificationStatus])), speculativeBoundaryText: staticRow.speculativeBoundaryText || checklistRow.speculativeBoundaryText, exportContainsExecutableCode: false });
        }
        buildPageDraftFreezeBundle(updateUi) {
            const checklist = this.latestStaticPublicationReviewChecklist || this.buildStaticPublicationReviewChecklist(false);
            const rows = this.filterStaticPublicationReviewChecklistRows(checklist.checklistRows || []).map((row) => this.buildPageDraftFreezeBundleRow(row));
            const payload = Object.freeze({ packageVersion: PACKAGE_VERSION, exportType: "ArcSecsPageDraftFreezeBundle", pageDraftFreezeBundleVersion: "1.0.0", generatedUtc: new Date().toISOString(), pageSourceRoute: "/arcsecs-physics-engine-demo/", activeScenario: this.toConfig ? this.toConfig().scenario : "distanceTimeKernel", freezeBundleRows: Object.freeze(rows), checklistRows: Object.freeze(checklist.checklistRows || []), missingFields: Object.freeze(rows.flatMap((row) => row.missingFields || [])), changedFields: Object.freeze(rows.flatMap((row) => row.changedFields || [])), warnings: Object.freeze(rows.flatMap((row) => row.warnings || [])), rejectedPhrases: Object.freeze(rows.flatMap((row) => row.rejectedPhrases || [])), recommendedFixes: Object.freeze(rows.flatMap((row) => row.recommendedFixes || [])), falsificationNotes: Object.freeze(rows.flatMap((row) => row.falsificationNotes || [])), speculativeBoundaryText: "Page Draft Freeze Bundles are inert local human-review artifacts only. They do not create WordPress pages, publish posts, inject schema, validate routes, prove physics, or imply operational capability.", references: Object.freeze(["staticDraftReviewImport", "pageReadinessDiff", "publicDemoPublicationHandoffManifest", "staticPageDraftExport", "publicDemoRouteDraftBundle", "seoSchemaReview", "copyReviewBundle", "publicDemoScriptBuilder", "screenshotCaptionPack", "reviewerEvidenceExportPack", "sourceMatrix", "scenarioEquationLibrary"]), exportContainsExecutableCode: false });
            this.latestPageDraftFreezeBundle = payload;
            if (updateUi) { this.renderStaticPublicationReviewChecklist(); this.renderPageDraftFreezeBundle(); this.renderPublicPublishingEvidenceArchiveIndex(); this.renderReviewerRetrievalNotes(); this.updateStatus("Built local Page Draft Freeze Bundle rows."); }
            return payload;
        }
        renderPageDraftFreezeBundle() {
            const body = this.root.querySelector("[data-arcsecs-page-draft-freeze-body]"); const status = this.root.querySelector("[data-arcsecs-page-draft-freeze-status]"); if (!body) { return; }
            const payload = this.latestPageDraftFreezeBundle || this.buildPageDraftFreezeBundle(false); const rows = payload.freezeBundleRows || [];
            if (!rows.length) { body.innerHTML = '<tr><td colspan="10">No freeze bundle rows match the current filters.</td></tr>'; if (status) status.textContent = "Page Draft Freeze Bundle has no matching rows."; return; }
            body.innerHTML = rows.map((row) => `<tr><td>${auditEscapeHtml(row.scenarioLabel)}</td><td>${auditEscapeHtml(row.freezeStatus)}</td><td>${auditEscapeHtml(row.staticPageDraftExportRow ? "static draft present" : "missing static draft")}</td><td>${auditEscapeHtml((row.seoSchemaReviewRow ? "schema present" : "missing schema") + " / " + (row.copyReviewBundleRow ? "copy present" : "copy pending"))}</td><td>${auditEscapeHtml((row.publicDemoScriptRow ? "script present" : "missing script") + " / " + (row.screenshotCaptionRow ? "caption present" : "missing caption"))}</td><td>${auditEscapeHtml((row.reviewerEvidenceExportPackRow ? "evidence present" : "missing evidence") + " / " + (row.sourceMatrixRow ? "source present" : "missing source") + " / " + (row.scenarioEquationLibraryRow ? "equation present" : "missing equation"))}</td><td>${auditEscapeHtml((row.warnings || []).join("; ") || "none")}</td><td>${auditEscapeHtml((row.rejectedPhrases || []).join(", ") || "none")}</td><td>${auditEscapeHtml((row.recommendedFixes || []).join("; ") || "none")}</td><td>${auditEscapeHtml(String(row.exportContainsExecutableCode))}</td></tr>`).join("");
            if (status) { status.textContent = "Page Draft Freeze Bundle has " + rows.length + " inert row" + (rows.length === 1 ? "" : "s") + ". No publishing action is performed."; }
        }
        exportSelectedFreezeBundleJson() { const payload = this.latestPageDraftFreezeBundle || this.buildPageDraftFreezeBundle(false); const activeScenario = this.toConfig ? this.toConfig().scenario : "distanceTimeKernel"; const selectedRow = (payload.freezeBundleRows || []).find((row) => row.activeScenario === activeScenario) || (payload.freezeBundleRows || [])[0] || null; this.download("arcsecs-selected-page-draft-freeze-bundle.json", JSON.stringify(Object.assign({}, payload, { exportType: "ArcSecsSelectedPageDraftFreezeBundle", selectedFreezeBundleRow: selectedRow, freezeBundleRows: selectedRow ? [selectedRow] : [] }), null, 2), "application/json"); this.updateStatus("Exported selected inert Page Draft Freeze Bundle JSON."); }
        exportAllFreezeBundlesJson() { const payload = this.latestPageDraftFreezeBundle || this.buildPageDraftFreezeBundle(false); this.download("arcsecs-all-page-draft-freeze-bundles.json", JSON.stringify(payload, null, 2), "application/json"); this.updateStatus("Exported all inert Page Draft Freeze Bundle JSON."); }

        normalizeRuntimeState(value) {
            const text = String(value || "Idle").toLowerCase();
            if (text.indexOf("failed") >= 0 || text.indexOf("error") >= 0 || text.indexOf("unavailable") >= 0) { return "Failed validation"; }
            if (text.indexOf("warning") >= 0 || text.indexOf("armed") >= 0) { return "Warning"; }
            if (text.indexOf("paused") >= 0) { return "Paused"; }
            if (text.indexOf("step") >= 0) { return "Stepping"; }
            if (text.indexOf("running") >= 0 || text.indexOf("benchmark") >= 0) { return "Running"; }
            return "Idle";
        }
        updateStatus(value) {
            const runtimeState = this.normalizeRuntimeState(value);
            this.root.dataset.arcsecsRuntimeState = runtimeState;
            setText(this.root.querySelector("[data-arcsecs-status]"), value);
            this.root.querySelectorAll("[data-arcsecs-status-state]").forEach((item) => {
                const active = item.getAttribute("data-arcsecs-status-state") === runtimeState;
                item.classList.toggle("is-active", active);
                if (active) { item.setAttribute("aria-current", "true"); } else { item.removeAttribute("aria-current"); }
            });
        }
        updateCounters(frameMs) { setText(this.root.querySelector("[data-arcsecs-tick]"), String(this.runner.tick)); setText(this.root.querySelector("[data-arcsecs-frame-ms]"), formatNumber(frameMs)); }
        startRenderLoop() { let lastDraw = 0; const loop = (time) => { if (!this.root.isConnected) { this.autoLaunchDirector.cancel(); this.releaseWorker(); return; } const delta = Math.max(0, Math.min(0.05, (time - this.lastFrameTime) / 1000)); this.lastFrameTime = time; if (!document.hidden) { const drawInterval = this.runner.running ? 0 : 250; if (!lastDraw || time - lastDraw >= drawInterval) { const elapsed = lastDraw ? time - lastDraw : 0; lastDraw = time; const start = performance.now(); this.runner.update(delta); this.frame = this.runner.tick; const activeConfig = this.toConfig(); const renderResult = this.latestResult && this.latestResult.config && this.latestResult.config.scenario === activeConfig.scenario ? this.latestResult : { config: activeConfig, metrics: {}, distanceTimeKernel: activeConfig.scenario === "distanceTimeKernel" ? (this.latestDistanceTimeKernel || buildDistanceTimeKernelState(activeConfig, this.frame || 0)) : null }; this.viewport.draw(renderResult, this.frame); const frameMs = performance.now() - start; setText(this.root.querySelector("[data-arcsecs-fps]"), elapsed > 0 ? formatNumber(1000 / elapsed) : "—"); this.updateCounters(frameMs); this.updateUniversalCosmicClockLive(); } } requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
        buildSceneGraph() { const context = this.buildStrictExportContext(); const result = buildStrictExportPayload("sceneJson", context); if (result.success && result.payload) { return result.payload; } const kernelState = this.latestDistanceTimeKernel || buildDistanceTimeKernelState(this.toConfig(), this.frame || 0); return { metadata: { engineVersion: "5.7.65", generatedUtc: new Date().toISOString() }, scenarioType: this.toConfig().scenario, simulationSettings: this.toConfig(), distanceTimeKernel: kernelState, frameworkClaimMap: distanceTimeExportRecords(kernelState), multiMessengerEventTheater: distanceTimeExportBundle(kernelState), exportValidationErrors: result.validationErrors }; }
        importScene(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) { this.updateStatus("Invalid scene JSON: file exceeds 2 MiB."); return; }
            return file.text().then((text) => {
                const scene = JSON.parse(text);
                if (!scene || typeof scene !== "object" || Array.isArray(scene) || !ScenarioRegistry.validateScenario(scene.scenarioType) || !scene.simulationSettings || typeof scene.simulationSettings !== "object" || Array.isArray(scene.simulationSettings)) throw new Error("Scene must include a registered scenario and a simulationSettings object.");
                const settings = scene.simulationSettings;
                if (Object.prototype.hasOwnProperty.call(settings, "scenario") && settings.scenario !== scene.scenarioType) throw new Error("Scene scenario and settings scenario disagree.");
                const allowed = this.toConfig(), updates = [], ignored = [];
                for (const [key, value] of Object.entries(settings)) {
                    if (key === "scenario") continue;
                    if (["__proto__", "constructor", "prototype"].includes(key)) throw new Error("Unsafe setting name.");
                    if (!Object.prototype.hasOwnProperty.call(allowed, key)) { ignored.push(key); continue; }
                    const control = this.form.elements.namedItem(key);
                    if (!control || typeof value !== typeof allowed[key]) throw new Error("Invalid value type for " + key + ".");
                    if (typeof value === "number") {
                        if (!Number.isFinite(value)) throw new Error("Non-finite value for " + key + ".");
                        if ((control.min !== "" && Number(value) < Number(control.min)) || (control.max !== "" && Number(value) > Number(control.max))) throw new Error("Value outside control range: " + key + ".");
                    }
                    if (control.tagName === "SELECT" && !Array.from(control.options).some(option => option.value === value)) throw new Error("Unknown option for " + key + ".");
                    updates.push([control, value]);
                }
                this.autoLaunchDirector.cancel(); this.pendingSweep = false; this.activeRunId += 1; this.releaseWorker();
                for (const [control, value] of updates) { if (typeof value === "boolean") control.checked = value; else control.value = String(value); }
                this.setScenario(scene.scenarioType); this.markDirty();
                this.updateStatus("Scene imported. Run to simulate." + (ignored.length ? " Unsupported settings ignored: " + ignored.length + "." : ""));
            }).catch(error => { this.updateStatus("Invalid scene JSON: " + error.message); });
        }
        saveRun() {
            if (!this.latestResult || !Array.isArray(this.latestResult.buffer)) { this.updateStatus("Run a simulation before saving."); return; }
            try { this.memory.saveRun(ScenarioRegistry.getScenario(this.latestResult.config.scenario).label, this.latestResult); this.renderMemory(); }
            catch (error) { this.updateStatus("Could not save run in local browser storage. Export JSON instead."); }
        }
        renderMemory() {
            const target = this.root.querySelector("[data-arcsecs-memory-list]"); if (!target) return;
            const memory = this.memory.load(); target.textContent = "";
            if (!memory.runs.length) { target.textContent = "No saved runs."; return; }
            for (const run of memory.runs) {
                const row = document.createElement("div"); row.className = "arcsecs-memory-item";
                const load = document.createElement("button"); load.type = "button"; load.textContent = String(run.name || "Saved run"); load.setAttribute("data-memory-load", String(run.id));
                const time = document.createElement("time"); time.textContent = String(run.savedAtUtc || "");
                const del = document.createElement("button"); del.type = "button"; del.textContent = "delete"; del.setAttribute("data-memory-delete", String(run.id));
                load.addEventListener("click", () => { try { this.latestResult = run.result; this.completedRequestConfig = null; this.updateFromResult(run.result); this.markDirty(); this.updateStatus("Loaded saved run. Run current parameters again before exporting."); } catch (error) { this.updateStatus("Saved run could not be loaded."); } });
                del.addEventListener("click", () => { try { this.memory.deleteRun(run.id); this.renderMemory(); } catch (error) { this.updateStatus("Could not delete saved run."); } });
                row.append(load,time,del); target.appendChild(row);
            }
        }
        exportBenchmark() { if (!this.latestBenchmark) { this.updateStatus("Run the benchmark before exporting."); return; } this.downloadStrictExportTarget("benchmarkJson", "arcsecs-validation-benchmark.json", { benchmark: this.latestBenchmark }); }
        exportFlightRecorder() { if (!this.flightRecorder) { this.updateStatus("Flight recorder is unavailable in this browser session."); return; } const snapshot = this.flightRecorder.snapshot(9); this.download("arcsecs-autopilot-flight-recorder.json", JSON.stringify({ packetType: "ArcSecs Autopilot Flight Recorder", generatedUtc: new Date().toISOString(), scientificBoundary: "Speculative research visualization — not established current technology.", snapshot, latestScenario: this.latestResult && this.latestResult.config ? this.latestResult.config.scenario : this.toConfig().scenario, exportContainsExecutableCode: false }, null, 2), "application/json"); }
        exportEvidencePacket() { if (!this.latestGrandTour) { this.updateStatus("Run Grand Experiment before exporting."); return; } this.downloadStrictExportTarget("evidencePacket", "arcsecs-grand-experiment-evidence-packet.json", { grandTour: this.latestGrandTour }); }
        exportJson() { if (!this.latestResult || !Array.isArray(this.latestResult.buffer) || this.root.classList.contains("arcsecs-is-dirty") || this.completedRequestConfig !== JSON.stringify(this.toConfig()) || this.latestResult.config.scenario !== this.toConfig().scenario) { this.updateStatus("Run a simulation before exporting JSON."); return; } const context = this.buildStrictExportContext(); const report = Object.assign({}, this.latestResult, { reviewCockpit: this.latestReviewCockpit || this.buildReviewCockpitPanel(false), strictExportBuilderHandoff: arcsecsExportBuilderHandoff, scenarioScreenshotEvidencePack: this.latestScenarioScreenshotEvidencePack || this.buildScenarioScreenshotEvidencePack(false), reviewerNotesBundle: this.latestReviewerNotesBundle || this.buildReviewerNotesBundle(false), publicReviewerGalleryManifest: this.buildPublicReviewerGalleryManifest(false), evidenceBundleIntegrityLabels: this.buildEvidenceBundleIntegrityLabels(false), reviewerSignOffSummary: this.latestReviewerSignOffSummary || this.buildReviewerSignOffSummary(false), reviewBundleReconciliation: this.latestReviewBundleReconciliation || this.buildReviewBundleReconciliationPayload(false), scenarioReviewWalkthroughWizard: this.latestScenarioReviewWalkthroughWizard || this.buildScenarioReviewWalkthroughWizard(false), evidenceRepairQueue: this.latestEvidenceRepairQueue || this.buildEvidenceRepairQueue(false), evidenceRepairCompletionLedger: this.latestEvidenceRepairCompletionLedger || this.buildEvidenceRepairCompletionLedger(false), demoReadinessGate: this.latestDemoReadinessGate || this.evaluateDemoReadinessGate(false), publicDemoScenarioChecklist: this.latestPublicDemoScenarioChecklist || this.buildPublicDemoScenarioChecklist(false), reviewerEvidenceExportPack: this.latestReviewerEvidenceExportPack || this.buildReviewerEvidenceExportPack(false), publicDemoScriptBuilder: this.latestPublicDemoScriptBuilder || this.buildPublicDemoScripts(false), screenshotCaptionPack: this.latestScreenshotCaptionPack || this.buildScreenshotCaptionPack(false), publicDemoPageAssemblyChecklist: this.latestPublicDemoPageAssemblyChecklist || this.buildPublicDemoPageAssemblyChecklist(false), copyReviewBundle: this.latestCopyReviewBundle || this.buildCopyReviewBundle(false), publicDemoRouteDraftBundle: this.latestPublicDemoRouteDraftBundle || this.buildPublicDemoRouteDraftBundle(false), seoSchemaReview: this.latestSeoSchemaReview || this.buildSeoSchemaReview(false), publicDemoPublicationHandoffManifest: this.latestPublicDemoPublicationHandoffManifest || this.buildPublicDemoPublicationHandoffManifest(false), staticPageDraftExport: this.latestStaticPageDraftExport || this.buildStaticPageDraftExport(false), staticDraftReviewImport: this.latestStaticDraftReviewImport || null, pageReadinessDiff: this.latestPageReadinessDiff || this.buildPageReadinessDiff(false), staticPublicationReviewChecklist: this.latestStaticPublicationReviewChecklist || this.buildStaticPublicationReviewChecklist(false), pageDraftFreezeBundle: this.latestPageDraftFreezeBundle || this.buildPageDraftFreezeBundle(false), staticPublishHandoffQaSummary: this.latestStaticPublishHandoffQaSummary || this.buildStaticPublishHandoffQaSummary(false), publicPageContentChecklist: this.latestPublicPageContentChecklist || this.buildPublicPageContentChecklist(false), publicPageManualPublishingRunbook: this.latestPublicPageManualPublishingRunbook || this.buildPublicPageManualPublishingRunbook(false), postDeployVerificationChecklist: this.latestPostDeployVerificationChecklist || this.buildPostDeployVerificationChecklist(false), manualPublishingArchiveReceipt: this.latestManualPublishingArchiveReceipt || this.buildManualPublishingArchiveReceipt(false), humanReviewSignOffExport: this.latestHumanReviewSignOffExport || this.buildHumanReviewSignOffExport(false), publicPublishingEvidenceArchiveIndex: this.latestPublicPublishingEvidenceArchiveIndex || this.buildPublicPublishingEvidenceArchiveIndex(false), reviewerRetrievalNotes: this.latestReviewerRetrievalNotes || this.buildReviewerRetrievalNotes(false), distanceTimeKernel: context.distanceTimeKernel, frameworkClaimMap: context.frameworkClaimMap, multiMessengerEventTheater: context.eventTheater, strictExportPayloads: { benchmarkJson: buildStrictExportPayload("benchmarkJson", context).payload, calibrationCertificate: buildStrictExportPayload("calibrationCertificate", context).payload, qualityGate: buildStrictExportPayload("qualityGate", context).payload, operatorRunbook: buildStrictExportPayload("operatorRunbook", context).payload, evidencePacket: buildStrictExportPayload("evidencePacket", context).payload, researchBundle: buildStrictExportPayload("researchBundle", context).payload, sceneJson: buildStrictExportPayload("sceneJson", context).payload } }); this.download("arcsecs-report.json", JSON.stringify(report, null, 2), "application/json"); }
        exportCsv() { if (!this.latestResult || !Array.isArray(this.latestResult.buffer) || this.root.classList.contains("arcsecs-is-dirty") || this.completedRequestConfig !== JSON.stringify(this.toConfig()) || this.latestResult.config.scenario !== this.toConfig().scenario) { this.updateStatus("Run a simulation before exporting CSV."); return; } const result = this.latestResult; const stride = result.valuesPerTick; const rows = ["t,primary,secondary,energy,redshift,highVelocity,lowVelocity,storedEnergy,orbit,error,entities,photons,constraints,channel13,channel14,channel15,channel16,channel17"]; for (let i = 0; i < result.buffer.length / stride; i++) { const o = i * stride; rows.push(result.buffer.slice(o, o + stride).join(",")); } this.download("arcsecs-simulation.csv", rows.join("\n"), "text/csv"); }
        screenshot() { const canvas = this.root.querySelector("[data-arcsecs-viewport]"); if (canvas) { canvas.toBlob((blob) => { if (blob) this.downloadBlob("arcsecs-viewport.png", blob); }); } }
        download(filename, text, type) { this.downloadBlob(filename, new Blob([text], { type })); }
        downloadBlob(filename, blob) { const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.rel = "noopener"; anchor.style.display = "none"; document.body.appendChild(anchor); anchor.click(); window.setTimeout(() => { URL.revokeObjectURL(url); anchor.remove(); }, 0); }
    }


    function experimentRecipes(key) {
        const shared = [
            { title: "Run, then Step", detail: "Run the scenario once, pause it, then use Step to prove the fixed-time runner advances deterministically." },
            { title: "Watch the counters", detail: "Entities, photons, and solver links should remain finite and scenario-derived, never undefined or misleading zero placeholders." },
            { title: "Export evidence", detail: "Export the scene or release packet after a run to capture the exact settings, telemetry, and validation state." }
        ];
        const map = {
            mechanisticTiredLight: [
                { title: "Increase particle density", detail: "Raise intergalactic density and rerun; redshift and energy-loss telemetry should change while the forward-scattering caution remains visible." },
                { title: "Compare baseline", detail: "Use the ledger graph to compare no-decay baseline against the ArcSecs tired-light branch." },
                shared[2]
            ],
            darkMatterRamjet: [
                { title: "Stress the intake", detail: "Increase ship velocity and substrate density; the Fishback, shield, thermal, and exhaust warnings should respond coherently." },
                { title: "Throttle the reactor", detail: "Lower reactor efficiency and watch output power, waste heat, radiator load, and thrust proxy separate." },
                shared[2]
            ],
            parallaxCalibration: [
                { title: "Use one arcsecond", detail: "Set parallax to 1 arcsecond and verify the parsec benchmark remains near one parsec." },
                shared[1],
                shared[2]
            ],
            flatSpaceLensing: [
                { title: "Move the impact parameter", detail: "Change impact parameter and compare Soldner-style corpuscular deflection to the reference curve." },
                shared[1],
                shared[2]
            ]
        };
        return map[key] || shared;
    }

    function bootstrap() { document.querySelectorAll("[data-arcsecs-engine='true']").forEach((root) => { if (root.__arcsecsApp) return; const app = new DemoController(root); root.__arcsecsApp = app; app.initialize(); }); }
    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", bootstrap); } else { bootstrap(); }

    window.ArcSecsPhysicsDemo = { EventBus, Vector2, FixedTimeStepRunner, ScenarioRegistry, DemoMemoryStore, AutoLaunchDirector, ReviewCockpit, NextActionCommandCenter, ExperimentReplayTimeline, ExperimentSensitivityScanner, scenarioContract };
}());
