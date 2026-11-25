"use strict";

(function initializeArcSecsSpaceTravelSimulation(globalScope) {
    const TWO_PI = Math.PI * 2;
    const FRAME_SECONDS = 1 / 60;
    const GRAVITY_WAVEFRONT_SPEED = 620;
    const PHOTON_BASE_SPEED = 360;
    const PHOTON_VISIBILITY_THRESHOLD = 0.22;
    const SPECULATIVE_BOUNDARY = "Speculative ArcSecs mission visualization — not established physics or spacecraft technology.";
    const VIEWPORT_WIDTH_GIGAPARSECS = 9.2;
    const VIEWPORT_HEIGHT_GIGAPARSECS = 5.6;
    const SIMULATED_HOURS_PER_TICK = 0.0166666667;
    const PARSECS_PER_GIGAPARSEC = 1000000000;
    const LIGHTYEARS_PER_PARSEC = 3.26156;
    const VIEWPORT_WIDTH_PIXELS = 860;
    const VIEWPORT_HEIGHT_PIXELS = 520;
    const ARCSECS_PER_DEGREE = 3600;
    const RADIANS_PER_ARCSEC = Math.PI / 648000;
    const MAX_SAFE_PARSEC_DISTANCE = 1e12;
    const ROUTE_SWEEP_WIDTH_PARSECS = 2200000;

    /**
     * @typedef {Object} GravityWavefront
     * @property {String} id
     * @property {Number} sourceX
     * @property {Number} sourceY
     * @property {Number} emittedTick
     * @property {Number} radius
     * @property {Number} speed
     * @property {Number|null} arrivalTick
     * @property {Boolean} arrived
     */

    /**
     * @typedef {Object} PhotonWavefront
     * @property {String} id
     * @property {Number} sourceX
     * @property {Number} sourceY
     * @property {Number} emittedTick
     * @property {Number} radius
     * @property {Number} baseSpeed
     * @property {Number} currentSpeed
     * @property {Number} photonEnergy
     * @property {Number} substrateRefractiveIndex
     * @property {Number|null} arrivalTick
     * @property {Boolean} arrived
     * @property {Boolean} visible
     * @property {String} visibilityStatus
     */

    /**
     * @typedef {Object} MultiMessengerEvent
     * @property {String} id
     * @property {String} label
     * @property {Number} sourceX
     * @property {Number} sourceY
     * @property {Number} emittedTick
     * @property {String} trigger
     * @property {GravityWavefront} gravityWavefront
     * @property {PhotonWavefront} photonWavefront
     */

    /**
     * @typedef {Object} WavefrontTelemetry
     * @property {Number|null} gravityArrivalTick
     * @property {Number|null} photonArrivalTick
     * @property {Number} photonDelay
     * @property {Number} photonEnergy
     * @property {Number} substrateRefractiveIndex
     * @property {String} visibilityThresholdStatus
     * @property {String} multiMessengerStatus
     */

    function finiteNumber(value, fallback) {
        return Number.isFinite(value) ? value : fallback;
    }

    function clamp(value, minimum, maximum) {
        return Math.max(minimum, Math.min(maximum, finiteNumber(value, minimum)));
    }

    function distanceBetween(firstX, firstY, secondX, secondY) {
        const deltaX = firstX - secondX;
        const deltaY = firstY - secondY;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    function createRegion(id, label, type, x, y, radius, strength) {
        return { id, label, type, x, y, radius, strength };
    }

    function createRelationalCoordinateState() {
        return {
            arcsecX: 0,
            arcsecY: 0,
            radialArcseconds: 0,
            bearingDegrees: 0,
            parallaxArcseconds: 0,
            parsecEquivalent: 0,
            properMotionArcsecPerTick: 0,
            relationalVectorMagnitude: 0,
            relationalStateKey: "arcsec:0.000:0.000",
            renderX: 0,
            renderY: 0,
            originLabel: "launch-origin",
            finite: true,
            note: "Canvas X/Y is an instrument-mask projection; physics evidence is reported as relational arcsecond telemetry."
        };
    }

    function translateInstrumentMaskToRelationalCoordinates(state) {
        const originX = 130;
        const originY = 270;
        const pixelsPerArcsecond = 3.6;
        const deltaX = finiteNumber(state.ship.x - originX, 0);
        const deltaY = finiteNumber(originY - state.ship.y, 0);
        const arcsecX = deltaX / pixelsPerArcsecond;
        const arcsecY = deltaY / pixelsPerArcsecond;
        const radialArcseconds = Math.sqrt(arcsecX * arcsecX + arcsecY * arcsecY);
        const bearingDegrees = ((Math.atan2(arcsecY, arcsecX) * 180 / Math.PI) + 360) % 360;
        const parallaxArcseconds = clamp(1 / Math.max(1, radialArcseconds + 1), 0.0001, 1);
        const parsecEquivalent = 1 / parallaxArcseconds;
        const velocityArcsecX = finiteNumber(state.ship.velocityX, 0) / pixelsPerArcsecond;
        const velocityArcsecY = finiteNumber(-state.ship.velocityY, 0) / pixelsPerArcsecond;
        const properMotionArcsecPerTick = Math.sqrt(velocityArcsecX * velocityArcsecX + velocityArcsecY * velocityArcsecY);
        const relationalVectorMagnitude = clamp(radialArcseconds + properMotionArcsecPerTick * 8 + state.telemetry.torsionPull * 4 + state.telemetry.substrateDensity * 1.5, 0, 10000);
        const relationalStateKey = "arcsec:" + arcsecX.toFixed(3) + ":" + arcsecY.toFixed(3);
        const finite = [
            arcsecX,
            arcsecY,
            radialArcseconds,
            bearingDegrees,
            parallaxArcseconds,
            parsecEquivalent,
            properMotionArcsecPerTick,
            relationalVectorMagnitude,
            state.ship.x,
            state.ship.y
        ].every(Number.isFinite);
        return {
            arcsecX,
            arcsecY,
            radialArcseconds,
            bearingDegrees,
            parallaxArcseconds,
            parsecEquivalent,
            properMotionArcsecPerTick,
            relationalVectorMagnitude,
            relationalStateKey,
            renderX: state.ship.x,
            renderY: state.ship.y,
            originLabel: "launch-origin",
            finite,
            note: "Canvas X/Y is an instrument-mask projection; physics evidence is reported as relational arcsecond telemetry."
        };
    }

    function serializeRelationalCoordinateState(relationalState) {
        const source = relationalState || createRelationalCoordinateState();
        return {
            arcsecX: Number(finiteNumber(source.arcsecX, 0).toFixed(6)),
            arcsecY: Number(finiteNumber(source.arcsecY, 0).toFixed(6)),
            radialArcseconds: Number(finiteNumber(source.radialArcseconds, 0).toFixed(6)),
            bearingDegrees: Number(finiteNumber(source.bearingDegrees, 0).toFixed(6)),
            parallaxArcseconds: Number(finiteNumber(source.parallaxArcseconds, 0).toFixed(9)),
            parsecEquivalent: Number(finiteNumber(source.parsecEquivalent, 0).toFixed(6)),
            properMotionArcsecPerTick: Number(finiteNumber(source.properMotionArcsecPerTick, 0).toFixed(9)),
            relationalVectorMagnitude: Number(finiteNumber(source.relationalVectorMagnitude, 0).toFixed(6)),
            relationalStateKey: source.relationalStateKey,
            renderX: Number(finiteNumber(source.renderX, 0).toFixed(3)),
            renderY: Number(finiteNumber(source.renderY, 0).toFixed(3)),
            originLabel: source.originLabel,
            finite: Boolean(source.finite),
            note: source.note
        };
    }

    /**
     * Creates the safe mission calibration state used by the simulator.
     * @returns {Object} Safe calibration values for distance, time, density, and speed display.
     */
    function createMissionCalibrationState() {
        return {
            calibrationProfile: "Default ArcSecs parsec mission calibration",
            viewportWidthGigaparsecs: VIEWPORT_WIDTH_GIGAPARSECS,
            viewportHeightGigaparsecs: VIEWPORT_HEIGHT_GIGAPARSECS,
            simulatedHoursPerTick: SIMULATED_HOURS_PER_TICK,
            beaconDistanceScale: 1,
            densityStrength: 1,
            speedCompression: 1,
            calibrationAppliedTick: 0,
            calibrationEvidence: "Default calibration active.",
            finite: true
        };
    }

    /**
     * Applies safe mission calibration values.
     * @param {Object} state Mission state.
     * @param {Object} calibrationInput Calibration input values.
     * @returns {Object} Updated mission calibration state.
     */
    function applyMissionCalibration(state, calibrationInput) {
        const source = calibrationInput || {};
        const viewportScale = clamp(finiteNumber(source.viewportWidthGigaparsecs, source.viewportScale || VIEWPORT_WIDTH_GIGAPARSECS), 3.0, 18.0);
        const viewportHeight = clamp(finiteNumber(source.viewportHeightGigaparsecs, viewportScale * 0.6086956522), 2.0, 12.0);
        const simulatedHoursPerTick = clamp(finiteNumber(source.simulatedHoursPerTick, SIMULATED_HOURS_PER_TICK), 0.0025, 0.1);
        const beaconDistanceScale = clamp(finiteNumber(source.beaconDistanceScale, 1), 0.25, 3.0);
        const densityStrength = clamp(finiteNumber(source.densityStrength, 1), 0.25, 2.5);
        const speedCompression = clamp(finiteNumber(source.speedCompression, 1), 0.2, 4.0);
        const finite = [
            viewportScale,
            viewportHeight,
            simulatedHoursPerTick,
            beaconDistanceScale,
            densityStrength,
            speedCompression
        ].every(Number.isFinite);
        state.missionCalibrationState = {
            calibrationProfile: "Custom Mission Calibration Lab",
            viewportWidthGigaparsecs: viewportScale,
            viewportHeightGigaparsecs: viewportHeight,
            simulatedHoursPerTick,
            beaconDistanceScale,
            densityStrength,
            speedCompression,
            calibrationAppliedTick: state.tick || 0,
            calibrationEvidence: "Calibration applied: viewport " + formatValue(viewportScale, 2) + " × " + formatValue(viewportHeight, 2) + " Gpc, tick " + formatValue(simulatedHoursPerTick, 5) + " hr, density ×" + formatValue(densityStrength, 2) + ", speed ×" + formatValue(speedCompression, 2) + ".",
            finite
        };
        return state.missionCalibrationState;
    }

    /**
     * Reads safe numeric value from the calibration state.
     * @param {Object} state Mission state.
     * @param {String} key Calibration field name.
     * @param {Number} fallback Fallback numeric value.
     * @returns {Number} Safe finite calibration value.
     */
    function getMissionCalibrationValue(state, key, fallback) {
        const calibration = state && state.missionCalibrationState ? state.missionCalibrationState : createMissionCalibrationState();
        return finiteNumber(calibration[key], fallback);
    }

    /**
     * Serializes mission calibration for export.
     * @param {Object} calibrationState Mission calibration state.
     * @returns {Object} Export-safe calibration state.
     */
    function serializeMissionCalibrationState(calibrationState) {
        const source = calibrationState || createMissionCalibrationState();
        return {
            calibrationProfile: source.calibrationProfile,
            viewportWidthGigaparsecs: Number(finiteNumber(source.viewportWidthGigaparsecs, VIEWPORT_WIDTH_GIGAPARSECS).toFixed(6)),
            viewportHeightGigaparsecs: Number(finiteNumber(source.viewportHeightGigaparsecs, VIEWPORT_HEIGHT_GIGAPARSECS).toFixed(6)),
            simulatedHoursPerTick: Number(finiteNumber(source.simulatedHoursPerTick, SIMULATED_HOURS_PER_TICK).toFixed(9)),
            beaconDistanceScale: Number(finiteNumber(source.beaconDistanceScale, 1).toFixed(6)),
            densityStrength: Number(finiteNumber(source.densityStrength, 1).toFixed(6)),
            speedCompression: Number(finiteNumber(source.speedCompression, 1).toFixed(6)),
            calibrationAppliedTick: Math.round(finiteNumber(source.calibrationAppliedTick, 0)),
            calibrationEvidence: source.calibrationEvidence,
            finite: Boolean(source.finite)
        };
    }

    /**
     * Builds calibration evidence for export and validation review.
     * @param {Object} state Mission state.
     * @returns {Object} Exportable calibration evidence.
     */
    function buildMissionCalibrationEvidence(state) {
        const calibration = state.missionCalibrationState || createMissionCalibrationState();
        return {
            schemaVersion: 1,
            generatedAtUtc: new Date().toISOString(),
            calibrationState: serializeMissionCalibrationState(calibration),
            controlledFields: [
                "viewportWidthGigaparsecs",
                "viewportHeightGigaparsecs",
                "simulatedHoursPerTick",
                "beaconDistanceScale",
                "densityStrength",
                "speedCompression"
            ],
            evidenceSummary: calibration.calibrationEvidence,
            safetyBoundary: "Mission Calibration Lab changes simulator scale parameters only; it is not proof of spacecraft capability.",
            finite: Boolean(calibration.finite)
        };
    }

    function createDistanceSpeedScaleState() {
        return {
            scaleMode: "Cosmic compressed cockpit",
            viewportWidthGigaparsecs: VIEWPORT_WIDTH_GIGAPARSECS,
            viewportHeightGigaparsecs: VIEWPORT_HEIGHT_GIGAPARSECS,
            gigaparsecsPerPixelX: VIEWPORT_WIDTH_GIGAPARSECS / 860,
            gigaparsecsPerPixelY: VIEWPORT_HEIGHT_GIGAPARSECS / 520,
            simulatedHoursPerTick: SIMULATED_HOURS_PER_TICK,
            shipXGigaparsecs: 0,
            shipYGigaparsecs: 0,
            distanceToBeaconGigaparsecs: 0,
            distanceToBeaconParsecs: 0,
            distanceToBeaconLightYears: 0,
            speedGigaparsecsPerHour: 0,
            speedParsecsPerHour: 0,
            speedLightYearsPerHour: 0,
            speedPixelsPerTick: 0,
            scaleStatus: "Cosmic scale telemetry ready.",
            finite: true,
            calibrationApplied: false,
            caveat: "Gigaparsecs per hour is a compressed visualization unit for comparing routes, not a claim of real propulsion speed."
        };
    }

    function updateDistanceSpeedScaleState(state) {
        const viewportWidthGigaparsecs = getMissionCalibrationValue(state, "viewportWidthGigaparsecs", VIEWPORT_WIDTH_GIGAPARSECS);
        const viewportHeightGigaparsecs = getMissionCalibrationValue(state, "viewportHeightGigaparsecs", VIEWPORT_HEIGHT_GIGAPARSECS);
        const simulatedHoursPerTick = getMissionCalibrationValue(state, "simulatedHoursPerTick", SIMULATED_HOURS_PER_TICK);
        const beaconDistanceScale = getMissionCalibrationValue(state, "beaconDistanceScale", 1);
        const speedCompression = getMissionCalibrationValue(state, "speedCompression", 1);
        const gigaparsecsPerPixelX = viewportWidthGigaparsecs / 860;
        const gigaparsecsPerPixelY = viewportHeightGigaparsecs / 520;
        const shipXGigaparsecs = clamp(state.ship.x * gigaparsecsPerPixelX, 0, VIEWPORT_WIDTH_GIGAPARSECS);
        const shipYGigaparsecs = clamp(state.ship.y * gigaparsecsPerPixelY, 0, VIEWPORT_HEIGHT_GIGAPARSECS);
        const beaconXGigaparsecs = state.beacon.x * gigaparsecsPerPixelX;
        const beaconYGigaparsecs = state.beacon.y * gigaparsecsPerPixelY;
        const distanceToBeaconGigaparsecs = Math.sqrt(
            Math.pow(shipXGigaparsecs - beaconXGigaparsecs, 2) +
            Math.pow(shipYGigaparsecs - beaconYGigaparsecs, 2)
        ) * beaconDistanceScale;
        const distanceToBeaconParsecs = distanceToBeaconGigaparsecs * PARSECS_PER_GIGAPARSEC;
        const distanceToBeaconLightYears = distanceToBeaconParsecs * LIGHTYEARS_PER_PARSEC;
        const velocityXGigaparsecsPerTick = state.ship.velocityX * 38 * (1 / 60) * gigaparsecsPerPixelX;
        const velocityYGigaparsecsPerTick = state.ship.velocityY * 38 * (1 / 60) * gigaparsecsPerPixelY;
        const speedGigaparsecsPerTick = Math.sqrt(
            velocityXGigaparsecsPerTick * velocityXGigaparsecsPerTick +
            velocityYGigaparsecsPerTick * velocityYGigaparsecsPerTick
        );
        const speedGigaparsecsPerHour = speedGigaparsecsPerTick * speedCompression / simulatedHoursPerTick;
        const speedParsecsPerHour = speedGigaparsecsPerHour * PARSECS_PER_GIGAPARSEC;
        const speedLightYearsPerHour = speedParsecsPerHour * LIGHTYEARS_PER_PARSEC;
        const speedPixelsPerTick = Math.sqrt(state.ship.velocityX * state.ship.velocityX + state.ship.velocityY * state.ship.velocityY) * 38 * (1 / 60);
        let scaleStatus = "Cosmic compressed scale active.";
        if (speedGigaparsecsPerHour > 0.08) {
            scaleStatus = "High route speed: gigaparsec-per-hour display is intentionally compressed for simulator readability.";
        } else if (distanceToBeaconGigaparsecs < 0.75) {
            scaleStatus = "Beacon is within final gigaparsec-scale approach range.";
        }
        const finite = [
            shipXGigaparsecs,
            shipYGigaparsecs,
            distanceToBeaconGigaparsecs,
            distanceToBeaconParsecs,
            distanceToBeaconLightYears,
            speedGigaparsecsPerHour,
            speedParsecsPerHour,
            speedLightYearsPerHour,
            speedPixelsPerTick
        ].every(Number.isFinite);
        state.distanceSpeedScaleState = {
            scaleMode: "Cosmic compressed cockpit",
            viewportWidthGigaparsecs: VIEWPORT_WIDTH_GIGAPARSECS,
            viewportHeightGigaparsecs: VIEWPORT_HEIGHT_GIGAPARSECS,
            gigaparsecsPerPixelX,
            gigaparsecsPerPixelY,
            simulatedHoursPerTick: SIMULATED_HOURS_PER_TICK,
            shipXGigaparsecs,
            shipYGigaparsecs,
            distanceToBeaconGigaparsecs,
            distanceToBeaconParsecs,
            distanceToBeaconLightYears,
            speedGigaparsecsPerHour,
            speedParsecsPerHour,
            speedLightYearsPerHour,
            speedPixelsPerTick,
            scaleStatus,
            calibrationApplied: Boolean(state.missionCalibrationState),
            finite,
            caveat: "Gigaparsecs per hour is a compressed visualization unit for comparing routes, not a claim of real propulsion speed."
        };
        return state.distanceSpeedScaleState;
    }

    function serializeDistanceSpeedScaleState(scaleState) {
        const source = scaleState || createDistanceSpeedScaleState();
        return {
            scaleMode: source.scaleMode,
            viewportWidthGigaparsecs: Number(finiteNumber(source.viewportWidthGigaparsecs, 0).toFixed(6)),
            viewportHeightGigaparsecs: Number(finiteNumber(source.viewportHeightGigaparsecs, 0).toFixed(6)),
            gigaparsecsPerPixelX: Number(finiteNumber(source.gigaparsecsPerPixelX, 0).toFixed(9)),
            gigaparsecsPerPixelY: Number(finiteNumber(source.gigaparsecsPerPixelY, 0).toFixed(9)),
            simulatedHoursPerTick: Number(finiteNumber(source.simulatedHoursPerTick, 0).toFixed(9)),
            shipXGigaparsecs: Number(finiteNumber(source.shipXGigaparsecs, 0).toFixed(6)),
            shipYGigaparsecs: Number(finiteNumber(source.shipYGigaparsecs, 0).toFixed(6)),
            distanceToBeaconGigaparsecs: Number(finiteNumber(source.distanceToBeaconGigaparsecs, 0).toFixed(6)),
            distanceToBeaconParsecs: Number(finiteNumber(source.distanceToBeaconParsecs, 0).toFixed(3)),
            distanceToBeaconLightYears: Number(finiteNumber(source.distanceToBeaconLightYears, 0).toFixed(3)),
            speedGigaparsecsPerHour: Number(finiteNumber(source.speedGigaparsecsPerHour, 0).toFixed(9)),
            speedParsecsPerHour: Number(finiteNumber(source.speedParsecsPerHour, 0).toFixed(3)),
            speedLightYearsPerHour: Number(finiteNumber(source.speedLightYearsPerHour, 0).toFixed(3)),
            speedPixelsPerTick: Number(finiteNumber(source.speedPixelsPerTick, 0).toFixed(9)),
            scaleStatus: source.scaleStatus,
            calibrationApplied: Boolean(source.calibrationApplied),
            finite: Boolean(source.finite),
            caveat: source.caveat
        };
    }

    /**
     * Converts arcseconds to radians.
     * @param {Number} arcseconds Angular distance in arcseconds.
     * @returns {Number} Finite angle in radians.
     */
    function arcsecsToRadians(arcseconds) {
        return clamp(finiteNumber(arcseconds, 0), -1296000, 1296000) * RADIANS_PER_ARCSEC;
    }

    /**
     * Converts radians to arcseconds.
     * @param {Number} radians Angular distance in radians.
     * @returns {Number} Finite angle in arcseconds.
     */
    function radiansToArcsecs(radians) {
        return clamp(finiteNumber(radians, 0) / RADIANS_PER_ARCSEC, -1296000, 1296000);
    }

    /**
     * Converts parallax arcseconds to parsecs using the reciprocal relation.
     * @param {Number} parallaxArcseconds Parallax angle in arcseconds.
     * @returns {Number} Finite parsec distance.
     */
    function parallaxArcsecsToParsecs(parallaxArcseconds) {
        const safeParallax = clamp(Math.abs(finiteNumber(parallaxArcseconds, 1)), 0.000001, 1000000);
        return clamp(1 / safeParallax, 0, MAX_SAFE_PARSEC_DISTANCE);
    }

    /**
     * Converts parsecs to megaparsecs.
     * @param {Number} parsecs Distance in parsecs.
     * @returns {Number} Finite distance in megaparsecs.
     */
    function parsecsToMegaparsecs(parsecs) {
        return clamp(finiteNumber(parsecs, 0) / 1000000, 0, MAX_SAFE_PARSEC_DISTANCE);
    }

    /**
     * Converts parsecs per simulation tick to parsecs per simulated hour.
     * @param {Number} parsecsPerTick Distance traveled per mission tick.
     * @returns {Number} Finite velocity in parsecs per simulated hour.
     */
    function parsecsPerTickToParsecsPerSimulatedHour(parsecsPerTick, simulatedHoursPerTick) {
        const safeSimulatedHoursPerTick = clamp(finiteNumber(simulatedHoursPerTick, SIMULATED_HOURS_PER_TICK), 0.0025, 0.1);
        return clamp(finiteNumber(parsecsPerTick, 0) / safeSimulatedHoursPerTick, 0, MAX_SAFE_PARSEC_DISTANCE);
    }

    /**
     * Estimates circular region area in square parsecs from an angular boundary radius.
     * @param {Number} boundaryRadiusArcsecs Region angular boundary radius in arcseconds.
     * @param {Number} parsecsPerArcsec Scale factor for projected parsecs per arcsecond.
     * @returns {Number} Finite square-parsec area.
     */
    function squareParsecRegionArea(boundaryRadiusArcsecs, parsecsPerArcsec) {
        const safeRadiusArcsecs = clamp(Math.abs(finiteNumber(boundaryRadiusArcsecs, 0)), 0, 1296000);
        const safeParsecsPerArcsec = clamp(Math.abs(finiteNumber(parsecsPerArcsec, 1)), 0.000001, MAX_SAFE_PARSEC_DISTANCE);
        const radiusParsecs = safeRadiusArcsecs * safeParsecsPerArcsec;
        return clamp(Math.PI * radiusParsecs * radiusParsecs, 0, MAX_SAFE_PARSEC_DISTANCE * MAX_SAFE_PARSEC_DISTANCE);
    }

    /**
     * Computes substrate density per square parsec.
     * @param {Number} substrateDensity Dimensionless substrate density.
     * @param {Number} squareParsecs Region area in square parsecs.
     * @returns {Number} Finite density per square parsec.
     */
    function substrateDensityPerSquareParsec(substrateDensity, squareParsecs) {
        const safeArea = Math.max(1, finiteNumber(squareParsecs, 1));
        return clamp(finiteNumber(substrateDensity, 0) / safeArea, 0, 1000);
    }

    /**
     * Formats parsec distance using parsec-first units.
     * @param {Number} parsecs Distance in parsecs.
     * @returns {String} Human-readable parsec distance.
     */
    function formatParsecDistance(parsecs) {
        const value = Math.abs(finiteNumber(parsecs, 0));
        if (value >= 1000000000) {
            return formatValue(value / 1000000000, 3) + " Gpc";
        }
        if (value >= 1000000) {
            return formatValue(value / 1000000, 3) + " Mpc";
        }
        if (value >= 1000) {
            return formatValue(value / 1000, 3) + " kpc";
        }
        return formatValue(value, 3) + " pc";
    }

    /**
     * Formats parsec velocity using parsec-first units.
     * @param {Number} parsecsPerSimulatedHour Velocity in parsecs per simulated hour.
     * @returns {String} Human-readable parsec velocity.
     */
    function formatParsecVelocity(parsecsPerSimulatedHour) {
        return formatParsecDistance(parsecsPerSimulatedHour) + "/sim hr";
    }

    function getParsecsPerPixel(state) {
        const viewportWidthGigaparsecs = getMissionCalibrationValue(state, "viewportWidthGigaparsecs", VIEWPORT_WIDTH_GIGAPARSECS);
        const viewportHeightGigaparsecs = getMissionCalibrationValue(state, "viewportHeightGigaparsecs", VIEWPORT_HEIGHT_GIGAPARSECS);
        return ((viewportWidthGigaparsecs / VIEWPORT_WIDTH_PIXELS) + (viewportHeightGigaparsecs / VIEWPORT_HEIGHT_PIXELS)) * 0.5 * PARSECS_PER_GIGAPARSEC;
    }

    function getArcsecsPerPixel() {
        return 1 / 3.6;
    }

    function createParsecNavigationState() {
        return {
            uiPositionX: 0,
            uiPositionY: 0,
            uiVelocityX: 0,
            uiVelocityY: 0,
            headingDegrees: 0,
            relationalArcsecsX: 0,
            relationalArcsecsY: 0,
            relationalArcsecsDelta: 0,
            relationalParsecsToBeacon: 0,
            relationalParsecsTraveled: 0,
            parsecsPerMissionTick: 0,
            parsecsPerSimulatedHour: 0,
            parsecVelocity: "0.000 pc/sim hr",
            kmPerSecondEquivalent: 0,
            angularHeadingArcsecs: 0,
            tetradAlignmentDegrees: 0,
            torsionGaugeForceMagnitude: 0,
            weberDragCoefficient: 0,
            nativeUnit: "parsec",
            legacyLightYearLabel: "deprecated/legacy comparison only",
            finite: true
        };
    }

    function updateParsecNavigationState(state) {
        const previous = state.parsecNavigationState || createParsecNavigationState();
        const parsecsPerPixel = getParsecsPerPixel(state);
        const arcsecsPerPixel = getArcsecsPerPixel();
        const beaconAngle = Math.atan2(state.beacon.y - state.ship.y, state.beacon.x - state.ship.x);
        const tetradAlignmentDegrees = Math.abs((((state.ship.headingRadians - beaconAngle) * 180 / Math.PI) + 540) % 360 - 180);
        const velocityPixelsPerTick = Math.sqrt(state.ship.velocityX * state.ship.velocityX + state.ship.velocityY * state.ship.velocityY) * 38 * FRAME_SECONDS;
        const parsecsPerMissionTick = clamp(velocityPixelsPerTick * parsecsPerPixel, 0, MAX_SAFE_PARSEC_DISTANCE);
        const parsecsPerSimulatedHour = parsecsPerTickToParsecsPerSimulatedHour(parsecsPerMissionTick, getMissionCalibrationValue(state, "simulatedHoursPerTick", SIMULATED_HOURS_PER_TICK));
        const relationalParsecsTraveled = clamp(finiteNumber(previous.relationalParsecsTraveled, 0) + parsecsPerMissionTick, 0, MAX_SAFE_PARSEC_DISTANCE);
        const relationalArcsecsX = (state.ship.x - 130) * arcsecsPerPixel;
        const relationalArcsecsY = (270 - state.ship.y) * arcsecsPerPixel;
        const beaconArcsecsX = (state.beacon.x - 130) * arcsecsPerPixel;
        const beaconArcsecsY = (270 - state.beacon.y) * arcsecsPerPixel;
        const relationalArcsecsDelta = Math.sqrt(Math.pow(beaconArcsecsX - relationalArcsecsX, 2) + Math.pow(beaconArcsecsY - relationalArcsecsY, 2));
        const relationalParsecsToBeacon = state.distanceSpeedScaleState ? state.distanceSpeedScaleState.distanceToBeaconParsecs : relationalArcsecsDelta * parsecsPerPixel / arcsecsPerPixel;
        const kmPerSecondEquivalent = clamp(parsecsPerSimulatedHour * 3.0856775814913673e13 / 3600, 0, Number.MAX_SAFE_INTEGER);
        const angularHeadingArcsecs = radiansToArcsecs(normalizeAngle(state.ship.headingRadians));
        const torsionGaugeForceMagnitude = state.teleparallelTorsionFieldState ? state.teleparallelTorsionFieldState.torsionMagnitude : state.telemetry.torsionPull;
        const weberDragCoefficient = state.telemetry.weberDrag;
        const finite = [
            relationalArcsecsX,
            relationalArcsecsY,
            relationalArcsecsDelta,
            relationalParsecsToBeacon,
            relationalParsecsTraveled,
            parsecsPerMissionTick,
            parsecsPerSimulatedHour,
            kmPerSecondEquivalent,
            angularHeadingArcsecs,
            tetradAlignmentDegrees,
            torsionGaugeForceMagnitude,
            weberDragCoefficient
        ].every(Number.isFinite);
        state.parsecNavigationState = {
            uiPositionX: state.ship.x,
            uiPositionY: state.ship.y,
            uiVelocityX: state.ship.velocityX,
            uiVelocityY: state.ship.velocityY,
            headingDegrees: ((state.ship.headingRadians * 180 / Math.PI) + 360) % 360,
            relationalArcsecsX,
            relationalArcsecsY,
            relationalArcsecsDelta,
            relationalParsecsToBeacon,
            relationalParsecsTraveled,
            parsecsPerMissionTick,
            parsecsPerSimulatedHour,
            parsecVelocity: formatParsecVelocity(parsecsPerSimulatedHour),
            kmPerSecondEquivalent,
            angularHeadingArcsecs,
            tetradAlignmentDegrees,
            torsionGaugeForceMagnitude,
            weberDragCoefficient,
            nativeUnit: "parsec",
            legacyLightYearLabel: "deprecated/legacy comparison only",
            finite
        };
        return state.parsecNavigationState;
    }

    function serializeParsecNavigationState(parsecState) {
        const source = parsecState || createParsecNavigationState();
        return {
            uiPositionX: Number(finiteNumber(source.uiPositionX, 0).toFixed(3)),
            uiPositionY: Number(finiteNumber(source.uiPositionY, 0).toFixed(3)),
            uiVelocityX: Number(finiteNumber(source.uiVelocityX, 0).toFixed(6)),
            uiVelocityY: Number(finiteNumber(source.uiVelocityY, 0).toFixed(6)),
            headingDegrees: Number(finiteNumber(source.headingDegrees, 0).toFixed(6)),
            relationalArcsecsX: Number(finiteNumber(source.relationalArcsecsX, 0).toFixed(6)),
            relationalArcsecsY: Number(finiteNumber(source.relationalArcsecsY, 0).toFixed(6)),
            relationalArcsecsDelta: Number(finiteNumber(source.relationalArcsecsDelta, 0).toFixed(6)),
            relationalParsecsToBeacon: Number(finiteNumber(source.relationalParsecsToBeacon, 0).toFixed(3)),
            relationalParsecsTraveled: Number(finiteNumber(source.relationalParsecsTraveled, 0).toFixed(3)),
            parsecsPerMissionTick: Number(finiteNumber(source.parsecsPerMissionTick, 0).toFixed(6)),
            parsecsPerSimulatedHour: Number(finiteNumber(source.parsecsPerSimulatedHour, 0).toFixed(3)),
            parsecVelocity: source.parsecVelocity,
            kmPerSecondEquivalent: Number(finiteNumber(source.kmPerSecondEquivalent, 0).toFixed(3)),
            angularHeadingArcsecs: Number(finiteNumber(source.angularHeadingArcsecs, 0).toFixed(6)),
            tetradAlignmentDegrees: Number(finiteNumber(source.tetradAlignmentDegrees, 0).toFixed(6)),
            torsionGaugeForceMagnitude: Number(finiteNumber(source.torsionGaugeForceMagnitude, 0).toFixed(6)),
            weberDragCoefficient: Number(finiteNumber(source.weberDragCoefficient, 0).toFixed(8)),
            nativeUnit: source.nativeUnit,
            legacyLightYearLabel: source.legacyLightYearLabel,
            finite: Boolean(source.finite)
        };
    }

    function getCurrentRegionType(state) {
        const label = state.telemetry && state.telemetry.localRegionLabel ? state.telemetry.localRegionLabel.toLowerCase() : "";
        if (label.indexOf("dense") !== -1 || label.indexOf("matter") !== -1) {
            return "dense";
        }
        if (label.indexOf("void") !== -1 || label.indexOf("smooth") !== -1) {
            return "void";
        }
        if (label.indexOf("torsion") !== -1) {
            return "torsion";
        }
        if (label.indexOf("beacon") !== -1) {
            return "beacon";
        }
        return "neutral";
    }

    function createRegionSurfaceDensityState(regionRows) {
        return {
            nativeAreaUnit: "square parsecs",
            regions: Array.isArray(regionRows) ? regionRows : [],
            routeAreaCrossedSquareParsecs: 0,
            currentRegionType: "neutral",
            currentRegionAreaSquareParsecs: 0,
            currentRegionDensityPerSquareParsec: 0,
            finite: true
        };
    }

    function buildRegionSurfaceDensityState(state) {
        const parsecsPerPixel = getParsecsPerPixel(state);
        const parsecsPerArcsec = parsecsPerPixel / getArcsecsPerPixel();
        const regionRows = state.regions.map(function mapRegion(region) {
            const boundaryRadiusArcsecs = region.radius * getArcsecsPerPixel();
            const area = squareParsecRegionArea(boundaryRadiusArcsecs, parsecsPerArcsec);
            const averageSubstrateDensity = clamp(region.strength * (region.type === "void" ? 0.18 : region.type === "dense" ? 0.88 : region.type === "torsion" ? 0.54 : 0.34), 0.01, 3);
            const peakSubstrateDensity = clamp(averageSubstrateDensity * 1.35, 0.01, 4);
            const densityPerArea = substrateDensityPerSquareParsec(averageSubstrateDensity, area);
            return {
                regionType: region.type,
                regionName: region.label,
                centerArcsecsX: Number(((region.x - 130) * getArcsecsPerPixel()).toFixed(6)),
                centerArcsecsY: Number(((270 - region.y) * getArcsecsPerPixel()).toFixed(6)),
                boundaryRadiusArcsecs: Number(boundaryRadiusArcsecs.toFixed(6)),
                approximateAreaSquareParsecs: area,
                averageSubstrateDensity,
                peakSubstrateDensity,
                densityPerSquareParsec: densityPerArea,
                opticalBlurArcsecs: clamp(averageSubstrateDensity * 4.8 + (region.type === "torsion" ? 8 : 0), 0, 45),
                fuelPotential: clamp(region.type === "dense" ? region.strength * 100 : region.type === "void" ? region.strength * 22 : region.strength * 42, 0, 140),
                thermalRisk: clamp(region.type === "dense" ? region.strength * 74 : region.type === "void" ? region.strength * 14 : region.strength * 58, 0, 100),
                torsionRisk: clamp(region.type === "torsion" ? region.strength * 90 : region.type === "dense" ? region.strength * 32 : region.strength * 12, 0, 100),
                photonLagRisk: clamp(region.type === "dense" ? region.strength * 88 : region.type === "void" ? region.strength * 12 : region.strength * 42, 0, 100)
            };
        });
        const currentRegionType = getCurrentRegionType(state);
        const currentRegion = regionRows.find(function findRegion(region) {
            return region.regionName === state.telemetry.localRegionLabel;
        });
        const previousArea = state.regionSurfaceDensityState ? state.regionSurfaceDensityState.routeAreaCrossedSquareParsecs : 0;
        const sweptArea = state.parsecNavigationState ? state.parsecNavigationState.parsecsPerMissionTick * ROUTE_SWEEP_WIDTH_PARSECS : 0;
        const finite = regionRows.every(function everyRegion(region) {
            return Number.isFinite(region.approximateAreaSquareParsecs) && Number.isFinite(region.densityPerSquareParsec);
        });
        state.regionSurfaceDensityState = {
            nativeAreaUnit: "square parsecs",
            regions: regionRows,
            routeAreaCrossedSquareParsecs: clamp(previousArea + sweptArea, 0, MAX_SAFE_PARSEC_DISTANCE * MAX_SAFE_PARSEC_DISTANCE),
            currentRegionType,
            currentRegionAreaSquareParsecs: currentRegion ? currentRegion.approximateAreaSquareParsecs : 0,
            currentRegionDensityPerSquareParsec: currentRegion ? currentRegion.densityPerSquareParsec : 0,
            finite
        };
        return state.regionSurfaceDensityState;
    }

    function serializeRegionSurfaceDensityState(regionState) {
        const source = regionState || createRegionSurfaceDensityState([]);
        return {
            nativeAreaUnit: source.nativeAreaUnit,
            routeAreaCrossedSquareParsecs: Number(finiteNumber(source.routeAreaCrossedSquareParsecs, 0).toFixed(3)),
            currentRegionType: source.currentRegionType,
            currentRegionAreaSquareParsecs: Number(finiteNumber(source.currentRegionAreaSquareParsecs, 0).toFixed(3)),
            currentRegionDensityPerSquareParsec: Number(finiteNumber(source.currentRegionDensityPerSquareParsec, 0).toExponential(6)),
            finite: Boolean(source.finite),
            regions: source.regions.map(function mapRegion(region) {
                return {
                    regionType: region.regionType,
                    regionName: region.regionName,
                    centerArcsecsX: region.centerArcsecsX,
                    centerArcsecsY: region.centerArcsecsY,
                    boundaryRadiusArcsecs: region.boundaryRadiusArcsecs,
                    approximateAreaSquareParsecs: Number(finiteNumber(region.approximateAreaSquareParsecs, 0).toFixed(3)),
                    averageSubstrateDensity: Number(finiteNumber(region.averageSubstrateDensity, 0).toFixed(6)),
                    peakSubstrateDensity: Number(finiteNumber(region.peakSubstrateDensity, 0).toFixed(6)),
                    densityPerSquareParsec: Number(finiteNumber(region.densityPerSquareParsec, 0).toExponential(6)),
                    opticalBlurArcsecs: Number(finiteNumber(region.opticalBlurArcsecs, 0).toFixed(6)),
                    fuelPotential: Number(finiteNumber(region.fuelPotential, 0).toFixed(6)),
                    thermalRisk: Number(finiteNumber(region.thermalRisk, 0).toFixed(6)),
                    torsionRisk: Number(finiteNumber(region.torsionRisk, 0).toFixed(6)),
                    photonLagRisk: Number(finiteNumber(region.photonLagRisk, 0).toFixed(6))
                };
            })
        };
    }

    function createRouteComparisonState() {
        return {
            denseTicks: 0,
            voidTicks: 0,
            torsionTicks: 0,
            beaconTicks: 0,
            neutralTicks: 0,
            densePercent: 0,
            voidPercent: 0,
            torsionPercent: 0,
            beaconPercent: 0,
            neutralPercent: 0,
            recommendation: "Start moving to build route comparison.",
            finite: true
        };
    }

    function updateRouteComparisonState(state) {
        if (!state.routeComparisonState) {
            state.routeComparisonState = createRouteComparisonState();
        }
        const regionType = getCurrentRegionType(state);
        const key = regionType + "Ticks";
        if (Object.prototype.hasOwnProperty.call(state.routeComparisonState, key)) {
            state.routeComparisonState[key] += 1;
        } else {
            state.routeComparisonState.neutralTicks += 1;
        }
        const totalTicks = Math.max(1, state.routeComparisonState.denseTicks + state.routeComparisonState.voidTicks + state.routeComparisonState.torsionTicks + state.routeComparisonState.beaconTicks + state.routeComparisonState.neutralTicks);
        state.routeComparisonState.densePercent = state.routeComparisonState.denseTicks / totalTicks * 100;
        state.routeComparisonState.voidPercent = state.routeComparisonState.voidTicks / totalTicks * 100;
        state.routeComparisonState.torsionPercent = state.routeComparisonState.torsionTicks / totalTicks * 100;
        state.routeComparisonState.beaconPercent = state.routeComparisonState.beaconTicks / totalTicks * 100;
        state.routeComparisonState.neutralPercent = state.routeComparisonState.neutralTicks / totalTicks * 100;
        if (state.routeComparisonState.densePercent > 38) {
            state.routeComparisonState.recommendation = "Dense-heavy route: strong fuel evidence, but heat/photon lag risk needs management.";
        } else if (state.routeComparisonState.voidPercent > 38) {
            state.routeComparisonState.recommendation = "Void-heavy route: efficient coast and cleaner optics, but weaker fuel gain.";
        } else if (state.routeComparisonState.torsionPercent > 24) {
            state.routeComparisonState.recommendation = "Torsion-heavy route: route-bending evidence is strong, but drift risk is elevated.";
        } else {
            state.routeComparisonState.recommendation = "Balanced route: collect dense harvest, void coast, and torsion evidence.";
        }
        state.routeComparisonState.finite = [
            state.routeComparisonState.densePercent,
            state.routeComparisonState.voidPercent,
            state.routeComparisonState.torsionPercent,
            state.routeComparisonState.beaconPercent,
            state.routeComparisonState.neutralPercent
        ].every(Number.isFinite);
        return state.routeComparisonState;
    }

    function serializeRouteComparisonState(routeComparisonState) {
        const source = routeComparisonState || createRouteComparisonState();
        return {
            denseTicks: Math.round(finiteNumber(source.denseTicks, 0)),
            voidTicks: Math.round(finiteNumber(source.voidTicks, 0)),
            torsionTicks: Math.round(finiteNumber(source.torsionTicks, 0)),
            beaconTicks: Math.round(finiteNumber(source.beaconTicks, 0)),
            neutralTicks: Math.round(finiteNumber(source.neutralTicks, 0)),
            densePercent: Number(finiteNumber(source.densePercent, 0).toFixed(3)),
            voidPercent: Number(finiteNumber(source.voidPercent, 0).toFixed(3)),
            torsionPercent: Number(finiteNumber(source.torsionPercent, 0).toFixed(3)),
            beaconPercent: Number(finiteNumber(source.beaconPercent, 0).toFixed(3)),
            neutralPercent: Number(finiteNumber(source.neutralPercent, 0).toFixed(3)),
            recommendation: source.recommendation,
            finite: Boolean(source.finite)
        };
    }

    function createWavefrontTrackerState() {
        return {
            active: false,
            gravityWaveEta: "No signal",
            photonEta: "No signal",
            photonLag: 0,
            photonEnergyRemaining: 1,
            opticalDelay: 0,
            substrateRefractiveIndex: 1,
            lineOfSightDensityIntegral: 0,
            gravityRadius: 0,
            photonRadius: 0,
            trackerStatus: "Trigger a signal event to compare gravity and photon fronts.",
            finite: true
        };
    }

    function calculateLineOfSightDensityIntegral(state) {
        const sampleCount = 10;
        let integral = 0;
        for (let index = 0; index <= sampleCount; index += 1) {
            const ratio = index / sampleCount;
            const sampleX = state.ship.x + (state.beacon.x - state.ship.x) * ratio;
            const sampleY = state.ship.y + (state.beacon.y - state.ship.y) * ratio;
            const sample = sampleMissionFieldAt(state, sampleX, sampleY);
            integral += sample.substrateDensity;
        }
        return clamp(integral / (sampleCount + 1), 0, 4);
    }

    function updateWavefrontTrackerState(state) {
        const activeEvent = getActiveMultiMessengerEvent(state);
        const lineOfSightDensityIntegral = calculateLineOfSightDensityIntegral(state);
        if (!activeEvent) {
            state.wavefrontTrackerState = createWavefrontTrackerState();
            state.wavefrontTrackerState.lineOfSightDensityIntegral = lineOfSightDensityIntegral;
            state.wavefrontTrackerState.substrateRefractiveIndex = state.wavefrontTelemetry.substrateRefractiveIndex;
            return state.wavefrontTrackerState;
        }
        const gravityDistanceRemaining = Math.max(0, distanceBetween(state.beacon.x, state.beacon.y, activeEvent.sourceX, activeEvent.sourceY) - activeEvent.gravityWavefront.radius);
        const photonDistanceRemaining = Math.max(0, distanceBetween(state.beacon.x, state.beacon.y, activeEvent.sourceX, activeEvent.sourceY) - activeEvent.photonWavefront.radius);
        const gravityTicks = Math.ceil(gravityDistanceRemaining / Math.max(1, activeEvent.gravityWavefront.speed));
        const photonTicks = Math.ceil(photonDistanceRemaining / Math.max(1, activeEvent.photonWavefront.currentSpeed));
        state.wavefrontTrackerState = {
            active: true,
            gravityWaveEta: gravityTicks + " ticks",
            photonEta: photonTicks + " ticks",
            photonLag: state.wavefrontTelemetry.photonDelay,
            photonEnergyRemaining: state.wavefrontTelemetry.photonEnergy,
            opticalDelay: clamp(state.wavefrontTelemetry.photonDelay * lineOfSightDensityIntegral, 0, 1000000),
            substrateRefractiveIndex: state.wavefrontTelemetry.substrateRefractiveIndex,
            lineOfSightDensityIntegral,
            gravityRadius: activeEvent.gravityWavefront.radius,
            photonRadius: activeEvent.photonWavefront.radius,
            trackerStatus: "Gravity baseline is clean; photon front lags through dense Proca substrate.",
            finite: [gravityTicks, photonTicks, state.wavefrontTelemetry.photonDelay, state.wavefrontTelemetry.photonEnergy, lineOfSightDensityIntegral].every(Number.isFinite)
        };
        return state.wavefrontTrackerState;
    }

    function serializeWavefrontTrackerState(trackerState) {
        const source = trackerState || createWavefrontTrackerState();
        return {
            active: Boolean(source.active),
            gravityWaveEta: source.gravityWaveEta,
            photonEta: source.photonEta,
            photonLag: Number(finiteNumber(source.photonLag, 0).toFixed(6)),
            photonEnergyRemaining: Number(finiteNumber(source.photonEnergyRemaining, 0).toFixed(6)),
            opticalDelay: Number(finiteNumber(source.opticalDelay, 0).toFixed(6)),
            substrateRefractiveIndex: Number(finiteNumber(source.substrateRefractiveIndex, 1).toFixed(6)),
            lineOfSightDensityIntegral: Number(finiteNumber(source.lineOfSightDensityIntegral, 0).toFixed(6)),
            gravityRadius: Number(finiteNumber(source.gravityRadius, 0).toFixed(3)),
            photonRadius: Number(finiteNumber(source.photonRadius, 0).toFixed(3)),
            trackerStatus: source.trackerStatus,
            finite: Boolean(source.finite)
        };
    }

    function createRouteAdvisorState() {
        return {
            currentRegionType: "neutral",
            currentRisk: 0,
            bestNextAction: "Start moving.",
            advisorMessage: "Start the mission and collect route evidence.",
            denseHarvestWorthIt: false,
            voidCoastRecommended: false,
            photonLagWarning: false,
            thermalWarning: false,
            beaconApproachRecommended: false,
            finite: true
        };
    }

    function updateRouteAdvisorState(state) {
        const regionType = getCurrentRegionType(state);
        const propulsion = state.propulsionModeState || createPropulsionModeState("inertial-coast");
        let bestNextAction = "Start thrust, collect route evidence, then trigger a signal event.";
        let advisorMessage = state.telemetry.routeAdvice;
        const denseHarvestWorthIt = regionType === "dense" && state.ship.thermalLoad < 72;
        const voidCoastRecommended = regionType === "void" || state.ship.thermalLoad > 70;
        const photonLagWarning = state.wavefrontTrackerState && state.wavefrontTrackerState.photonLag > 30;
        const thermalWarning = state.ship.thermalLoad > 78;
        const beaconDistance = distanceBetween(state.ship.x, state.ship.y, state.beacon.x, state.beacon.y);
        const beaconApproachRecommended = beaconDistance < 160;
        if (regionType === "dense") {
            bestNextAction = "Enter dense region for fuel, then leave dense region to cool down.";
            advisorMessage = "You are crossing dense Proca substrate. Fuel harvest is strong, but Weber drag, torsion pull, thermal load, and photon lag are rising. Harvest briefly, then exit toward a void corridor.";
        } else if (regionType === "void") {
            bestNextAction = "Coast the void corridor, cool down, and prepare export evidence.";
            advisorMessage = "You are in a void corridor. Fuel gain is weak, but inertial coasting is efficient and photon lag is low. Preserve velocity and cool down.";
        } else if (regionType === "torsion") {
            bestNextAction = "Avoid torsion shear; reduce throttle or use Torsion-Shear Assist.";
            advisorMessage = "Torsion shear is bending your route. Use Torsion-Shear Assist or reduce throttle before drift exceeds correction margin.";
        } else if (beaconApproachRecommended) {
            bestNextAction = "Switch to Beacon Approach mode and export the run when evidence score is ready.";
            advisorMessage = "Beacon lock is improving. Switch to Beacon Approach mode to reduce overshoot and preserve evidence quality.";
        }
        if (propulsion.locked) {
            advisorMessage += " Requested propulsion placeholder is locked and inactive.";
        } else {
            advisorMessage += " Current mode: " + propulsion.modeLabel + ".";
        }
        const currentRisk = clamp(state.telemetry.navigationRisk + state.ship.thermalLoad * 0.35 + (state.wavefrontTrackerState ? state.wavefrontTrackerState.photonLag * 0.08 : 0), 0, 100);
        state.routeAdvisorState = {
            currentRegionType: regionType,
            currentRisk,
            bestNextAction,
            advisorMessage,
            denseHarvestWorthIt,
            voidCoastRecommended,
            photonLagWarning,
            thermalWarning,
            beaconApproachRecommended,
            finite: Number.isFinite(currentRisk)
        };
        state.telemetry.routeAdvice = advisorMessage;
        return state.routeAdvisorState;
    }

    function serializeRouteAdvisorState(routeAdvisorState) {
        const source = routeAdvisorState || createRouteAdvisorState();
        return {
            currentRegionType: source.currentRegionType,
            currentRisk: Number(finiteNumber(source.currentRisk, 0).toFixed(6)),
            bestNextAction: source.bestNextAction,
            advisorMessage: source.advisorMessage,
            denseHarvestWorthIt: Boolean(source.denseHarvestWorthIt),
            voidCoastRecommended: Boolean(source.voidCoastRecommended),
            photonLagWarning: Boolean(source.photonLagWarning),
            thermalWarning: Boolean(source.thermalWarning),
            beaconApproachRecommended: Boolean(source.beaconApproachRecommended),
            finite: Boolean(source.finite)
        };
    }

    function createMissionOutcomeState() {
        return {
            missionOutcome: "Ready",
            missionPhase: "Ready",
            missionScore: 0,
            exportedEvidence: false,
            finite: true
        };
    }

    function updateMissionOutcomeState(state) {
        let missionOutcome = state.running ? "In Progress" : "Ready";
        if (state.ship.destinationReached) {
            missionOutcome = "Beacon Reached";
        }
        if (state.ship.fuelCharge <= 0.4) {
            missionOutcome = "Fuel Depleted";
        }
        if (state.ship.thermalLoad >= 96) {
            missionOutcome = "Thermal Abort";
        }
        if (state.routeCurvatureInspector && state.routeCurvatureInspector.curvatureRisk > 96) {
            missionOutcome = "Torsion Drift Failure";
        }
        if (state.missionEvidenceLedger && state.missionEvidenceLedger.ready && state.ship.destinationReached) {
            missionOutcome = "Mission Complete";
        }
        const missionScore = state.missionObjectiveScorecard ? state.missionObjectiveScorecard.score : state.ship.missionScore;
        state.missionOutcomeState = {
            missionOutcome,
            missionPhase: missionOutcome,
            missionScore,
            exportedEvidence: state.missionOutcomeState ? state.missionOutcomeState.exportedEvidence : false,
            finite: Number.isFinite(missionScore)
        };
        return state.missionOutcomeState;
    }

    function serializeMissionOutcomeState(outcomeState) {
        const source = outcomeState || createMissionOutcomeState();
        return {
            missionOutcome: source.missionOutcome,
            missionPhase: source.missionPhase,
            missionScore: Math.round(finiteNumber(source.missionScore, 0)),
            exportedEvidence: Boolean(source.exportedEvidence),
            finite: Boolean(source.finite)
        };
    }

    function createDynamicProcaFieldState() {
        return {
            phase: 0,
            fieldDensity: 0.28,
            fieldEnergy: 0.28,
            gradientX: 0,
            gradientY: 0,
            gradientMagnitude: 0,
            refractivePerturbation: 0,
            opticalTurbulence: 0,
            cellKey: "proca:0:0",
            finite: true,
            status: "Dynamic Proca field ready."
        };
    }

    function sampleDynamicProcaFieldAt(state, x, y) {
        const phase = finiteNumber(state.elapsedSeconds, 0) * 0.65;
        const waveOne = Math.sin(x * 0.015 + phase) * Math.cos(y * 0.011 - phase * 0.72);
        const waveTwo = Math.cos((x + y) * 0.008 - phase * 1.21);
        let densityBias = 0.24 + waveOne * 0.10 + waveTwo * 0.06;
        let torsionBias = 0;
        let voidBias = 0;
        for (let index = 0; index < state.regions.length; index += 1) {
            const region = state.regions[index];
            const distance = distanceBetween(x, y, region.x, region.y);
            const influence = clamp(1 - distance / region.radius, 0, 1) * region.strength;
            if (region.type === "dense") {
                densityBias += influence * 0.34;
            } else if (region.type === "void") {
                voidBias += influence * 0.18;
                densityBias -= influence * 0.10;
            } else if (region.type === "torsion") {
                torsionBias += influence * 0.24;
                densityBias += influence * 0.12;
            }
        }
        const gradientX = (Math.cos(x * 0.015 + phase) * 0.015 * Math.cos(y * 0.011 - phase * 0.72)) * 18 + torsionBias * 0.32 - voidBias * 0.08;
        const gradientY = (-Math.sin(x * 0.015 + phase) * Math.sin(y * 0.011 - phase * 0.72) * 0.011) * 18 + torsionBias * 0.18;
        const gradientMagnitude = Math.sqrt(gradientX * gradientX + gradientY * gradientY);
        const fieldDensity = clamp(densityBias, 0.03, 2.4);
        const fieldEnergy = clamp(fieldDensity * (1 + gradientMagnitude * 0.22) + torsionBias * 0.35, 0, 3.2);
        const refractivePerturbation = clamp(fieldDensity * 0.20 + gradientMagnitude * 0.12 + torsionBias * 0.14, 0, 1.2);
        const opticalTurbulence = clamp(gradientMagnitude * 0.38 + torsionBias * 0.28 + fieldDensity * 0.08, 0, 1.8);
        const cellKey = "proca:" + Math.floor(x / 86) + ":" + Math.floor(y / 52);
        const finite = [phase, fieldDensity, fieldEnergy, gradientX, gradientY, gradientMagnitude, refractivePerturbation, opticalTurbulence].every(Number.isFinite);
        return {
            phase,
            fieldDensity,
            fieldEnergy,
            gradientX,
            gradientY,
            gradientMagnitude,
            refractivePerturbation,
            opticalTurbulence,
            cellKey,
            finite,
            status: "Dynamic Proca density " + fieldDensity.toFixed(3) + ", gradient " + gradientMagnitude.toFixed(3) + "."
        };
    }

    function updateDynamicProcaField(state) {
        state.dynamicProcaFieldState = sampleDynamicProcaFieldAt(state, state.ship.x, state.ship.y);
        return state.dynamicProcaFieldState;
    }

    function serializeDynamicProcaFieldState(fieldState) {
        const source = fieldState || createDynamicProcaFieldState();
        return {
            phase: Number(finiteNumber(source.phase, 0).toFixed(6)),
            fieldDensity: Number(finiteNumber(source.fieldDensity, 0).toFixed(6)),
            fieldEnergy: Number(finiteNumber(source.fieldEnergy, 0).toFixed(6)),
            gradientX: Number(finiteNumber(source.gradientX, 0).toFixed(6)),
            gradientY: Number(finiteNumber(source.gradientY, 0).toFixed(6)),
            gradientMagnitude: Number(finiteNumber(source.gradientMagnitude, 0).toFixed(6)),
            refractivePerturbation: Number(finiteNumber(source.refractivePerturbation, 0).toFixed(6)),
            opticalTurbulence: Number(finiteNumber(source.opticalTurbulence, 0).toFixed(6)),
            cellKey: source.cellKey,
            finite: Boolean(source.finite),
            status: source.status
        };
    }

    function createPsfLensingState() {
        return {
            psfBlurRadius: 0,
            lensingDeflectionArcseconds: 0,
            lensingArcStrength: 0,
            opticalTurbulence: 0,
            photonSmear: 0,
            observedPhotonEnergy: 1,
            lensingStatus: "PSF/lensing visualization ready.",
            finite: true
        };
    }

    function buildPsfLensingState(state) {
        const proca = state.dynamicProcaFieldState || createDynamicProcaFieldState();
        const wavefront = state.wavefrontTelemetry || createEmptyWavefrontTelemetry();
        const torsion = state.telemetry ? finiteNumber(state.telemetry.torsionPull, 0) : 0;
        const propulsion = state.propulsionModeState || createPropulsionModeState("inertial-coast");
        const photonEnergy = finiteNumber(wavefront.photonEnergy, 1);
        const psfBlurRadius = clamp(1.2 + proca.opticalTurbulence * 4.4 + proca.fieldDensity * 1.8 + torsion * 6.8, 0.5, 24);
        const lensingDeflectionArcseconds = clamp((proca.gradientMagnitude * 12.5 + torsion * 18 + proca.refractivePerturbation * 9.4), 0, 180);
        const lensingArcStrength = clamp(lensingDeflectionArcseconds / 90 + proca.fieldDensity * 0.16, 0, 2.4);
        const opticalTurbulence = clamp((proca.opticalTurbulence + torsion * 0.25) * propulsion.procaTurbulenceMultiplier, 0, 2.6);
        const photonSmear = clamp(psfBlurRadius * (1.05 + opticalTurbulence * 0.22) + (1 - photonEnergy) * 8, 0, 38);
        const observedPhotonEnergy = clamp(photonEnergy * Math.exp(-opticalTurbulence * 0.015), 0, 1);
        let lensingStatus = "Stable optical counterpart.";
        if (lensingDeflectionArcseconds > 90 || photonSmear > 22) {
            lensingStatus = "Strong PSF blur/lensing arc: optical counterpart is smeared.";
        } else if (lensingDeflectionArcseconds > 36 || photonSmear > 12) {
            lensingStatus = "Moderate PSF/lensing: counterpart is broadened and shifted.";
        } else if (observedPhotonEnergy < PHOTON_VISIBILITY_THRESHOLD) {
            lensingStatus = "Counterpart below visibility threshold after turbulence loss.";
        }
        const finite = [psfBlurRadius, lensingDeflectionArcseconds, lensingArcStrength, opticalTurbulence, photonSmear, observedPhotonEnergy].every(Number.isFinite);
        return {
            psfBlurRadius,
            lensingDeflectionArcseconds,
            lensingArcStrength,
            opticalTurbulence,
            photonSmear,
            observedPhotonEnergy,
            lensingStatus,
            finite
        };
    }

    function updatePsfLensingState(state) {
        state.psfLensingState = buildPsfLensingState(state);
        return state.psfLensingState;
    }

    function serializePsfLensingState(psfState) {
        const source = psfState || createPsfLensingState();
        return {
            psfBlurRadius: Number(finiteNumber(source.psfBlurRadius, 0).toFixed(6)),
            lensingDeflectionArcseconds: Number(finiteNumber(source.lensingDeflectionArcseconds, 0).toFixed(6)),
            lensingArcStrength: Number(finiteNumber(source.lensingArcStrength, 0).toFixed(6)),
            opticalTurbulence: Number(finiteNumber(source.opticalTurbulence, 0).toFixed(6)),
            photonSmear: Number(finiteNumber(source.photonSmear, 0).toFixed(6)),
            observedPhotonEnergy: Number(finiteNumber(source.observedPhotonEnergy, 0).toFixed(6)),
            lensingStatus: source.lensingStatus,
            finite: Boolean(source.finite)
        };
    }

    function createTeleparallelTorsionFieldState() {
        return {
            vectorX: 0,
            vectorY: 0,
            torsionMagnitude: 0,
            torsionCurl: 0,
            shear: 0,
            routeCurvature: 0,
            curvatureRadius: 0,
            inertialCorrection: 0,
            fieldLineAngleDegrees: 0,
            torsionCellKey: "torsion:0:0",
            finite: true,
            status: "Teleparallel torsion vector field ready."
        };
    }

    function sampleTeleparallelTorsionFieldAt(state, x, y) {
        const proca = sampleDynamicProcaFieldAt(state, x, y);
        let vectorX = proca.gradientY * 0.22;
        let vectorY = -proca.gradientX * 0.22;
        let shear = proca.opticalTurbulence * 0.10;
        let curlBias = 0;

        for (let index = 0; index < state.regions.length; index += 1) {
            const region = state.regions[index];
            const distance = Math.max(1, distanceBetween(x, y, region.x, region.y));
            const influence = clamp(1 - distance / region.radius, 0, 1) * region.strength;
            const dx = (x - region.x) / distance;
            const dy = (y - region.y) / distance;
            if (region.type === "torsion") {
                vectorX += -dy * influence * 0.82;
                vectorY += dx * influence * 0.82;
                shear += influence * 0.48;
                curlBias += influence * 0.62;
            } else if (region.type === "dense") {
                vectorX += -dy * influence * 0.20;
                vectorY += dx * influence * 0.20;
                shear += influence * 0.14;
                curlBias += influence * 0.11;
            } else if (region.type === "void") {
                vectorX *= 1 - influence * 0.08;
                vectorY *= 1 - influence * 0.08;
                shear = Math.max(0, shear - influence * 0.10);
            }
        }

        const shipSpeed = state.ship ? Math.sqrt(state.ship.velocityX * state.ship.velocityX + state.ship.velocityY * state.ship.velocityY) : 0;
        const torsionMagnitude = clamp(Math.sqrt(vectorX * vectorX + vectorY * vectorY), 0, 3.5);
        const torsionCurl = clamp(curlBias + proca.gradientMagnitude * 0.42, 0, 4.4);
        const routeCurvature = clamp(torsionMagnitude * (0.22 + shipSpeed * 0.18) + shear * 0.12, 0, 6);
        const curvatureRadius = routeCurvature > 0.0001 ? clamp(1 / routeCurvature * 180, 12, 5000) : 5000;
        const inertialCorrection = clamp(torsionMagnitude * 0.38 + shear * 0.16, 0, 2.2);
        const fieldLineAngleDegrees = ((Math.atan2(vectorY, vectorX) * 180 / Math.PI) + 360) % 360;
        const torsionCellKey = "torsion:" + Math.floor(x / 86) + ":" + Math.floor(y / 52);
        const finite = [vectorX, vectorY, torsionMagnitude, torsionCurl, shear, routeCurvature, curvatureRadius, inertialCorrection, fieldLineAngleDegrees].every(Number.isFinite);
        let status = "Teleparallel torsion is weak; route curvature is low.";
        if (routeCurvature > 1.15 || torsionMagnitude > 0.9) {
            status = "Strong torsion vector field: route curvature and inertial correction are high.";
        } else if (routeCurvature > 0.45 || torsionMagnitude > 0.35) {
            status = "Moderate torsion vector field: route is bending measurably.";
        }
        return {
            vectorX,
            vectorY,
            torsionMagnitude,
            torsionCurl,
            shear,
            routeCurvature,
            curvatureRadius,
            inertialCorrection,
            fieldLineAngleDegrees,
            torsionCellKey,
            finite,
            status
        };
    }

    function updateTeleparallelTorsionField(state) {
        state.teleparallelTorsionFieldState = sampleTeleparallelTorsionFieldAt(state, state.ship.x, state.ship.y);
        return state.teleparallelTorsionFieldState;
    }

    function serializeTeleparallelTorsionFieldState(torsionState) {
        const source = torsionState || createTeleparallelTorsionFieldState();
        return {
            vectorX: Number(finiteNumber(source.vectorX, 0).toFixed(6)),
            vectorY: Number(finiteNumber(source.vectorY, 0).toFixed(6)),
            torsionMagnitude: Number(finiteNumber(source.torsionMagnitude, 0).toFixed(6)),
            torsionCurl: Number(finiteNumber(source.torsionCurl, 0).toFixed(6)),
            shear: Number(finiteNumber(source.shear, 0).toFixed(6)),
            routeCurvature: Number(finiteNumber(source.routeCurvature, 0).toFixed(6)),
            curvatureRadius: Number(finiteNumber(source.curvatureRadius, 0).toFixed(6)),
            inertialCorrection: Number(finiteNumber(source.inertialCorrection, 0).toFixed(6)),
            fieldLineAngleDegrees: Number(finiteNumber(source.fieldLineAngleDegrees, 0).toFixed(6)),
            torsionCellKey: source.torsionCellKey,
            finite: Boolean(source.finite),
            status: source.status
        };
    }

    function createRouteCurvatureInspector() {
        return {
            routeCurvatureScore: 0,
            projectedDeflectionX: 0,
            projectedDeflectionY: 0,
            projectedWaypointX: 0,
            projectedWaypointY: 0,
            correctionHeadingDegrees: 0,
            curvatureRisk: 0,
            curvatureStatus: "Route curvature inspector ready.",
            finite: true
        };
    }

    function buildRouteCurvatureInspector(state) {
        const torsion = state.teleparallelTorsionFieldState || createTeleparallelTorsionFieldState();
        const propulsion = state.propulsionModeState || createPropulsionModeState("inertial-coast");
        const speed = Math.sqrt(state.ship.velocityX * state.ship.velocityX + state.ship.velocityY * state.ship.velocityY);
        const headingX = Math.cos(state.ship.headingRadians);
        const headingY = Math.sin(state.ship.headingRadians);
        const projectedDeflectionX = torsion.vectorX * 52 * propulsion.routeCurvatureMultiplier + state.ship.velocityX * 18;
        const projectedDeflectionY = torsion.vectorY * 52 * propulsion.routeCurvatureMultiplier + state.ship.velocityY * 18;
        const projectedWaypointX = clamp(state.ship.x + headingX * 94 + projectedDeflectionX, 20, 840);
        const projectedWaypointY = clamp(state.ship.y + headingY * 94 + projectedDeflectionY, 20, 500);
        const correctionHeading = Math.atan2(projectedWaypointY - state.ship.y, projectedWaypointX - state.ship.x);
        const correctionHeadingDegrees = ((correctionHeading * 180 / Math.PI) + 360) % 360;
        const routeCurvatureScore = clamp((torsion.routeCurvature * 28 + torsion.shear * 12) * propulsion.routeCurvatureMultiplier + speed * 8, 0, 100);
        const curvatureRisk = clamp(routeCurvatureScore + state.telemetry.navigationRisk * 0.24 + propulsion.propulsionModeRisk * 18, 0, 100);
        let curvatureStatus = "Route curvature is low; current heading is stable.";
        if (curvatureRisk > 72) {
            curvatureStatus = "High curvature route: turn or inertial assist should compensate.";
        } else if (curvatureRisk > 42) {
            curvatureStatus = "Moderate curvature route: predicted waypoint is bending.";
        }
        const finite = [routeCurvatureScore, projectedDeflectionX, projectedDeflectionY, projectedWaypointX, projectedWaypointY, correctionHeadingDegrees, curvatureRisk].every(Number.isFinite);
        return {
            routeCurvatureScore,
            projectedDeflectionX,
            projectedDeflectionY,
            projectedWaypointX,
            projectedWaypointY,
            correctionHeadingDegrees,
            curvatureRisk,
            curvatureStatus,
            finite
        };
    }

    function updateRouteCurvatureInspector(state) {
        state.routeCurvatureInspector = buildRouteCurvatureInspector(state);
        return state.routeCurvatureInspector;
    }

    function serializeRouteCurvatureInspector(routeInspector) {
        const source = routeInspector || createRouteCurvatureInspector();
        return {
            routeCurvatureScore: Number(finiteNumber(source.routeCurvatureScore, 0).toFixed(6)),
            projectedDeflectionX: Number(finiteNumber(source.projectedDeflectionX, 0).toFixed(6)),
            projectedDeflectionY: Number(finiteNumber(source.projectedDeflectionY, 0).toFixed(6)),
            projectedWaypointX: Number(finiteNumber(source.projectedWaypointX, 0).toFixed(3)),
            projectedWaypointY: Number(finiteNumber(source.projectedWaypointY, 0).toFixed(3)),
            correctionHeadingDegrees: Number(finiteNumber(source.correctionHeadingDegrees, 0).toFixed(6)),
            curvatureRisk: Number(finiteNumber(source.curvatureRisk, 0).toFixed(6)),
            curvatureStatus: source.curvatureStatus,
            finite: Boolean(source.finite)
        };
    }

    const MISSION_DEMO_PRESETS = [
        {
            key: "free-flight",
            label: "Free Flight",
            description: "Manual flight with no guided route.",
            startX: 130,
            startY: 270,
            velocityX: 0.45,
            velocityY: -0.18,
            headingRadians: -0.18,
            targetX: 760,
            targetY: 215,
            focus: "manual",
            triggerSignal: false
        },
        {
            key: "dense-harvest",
            label: "Harvest Dense Filament",
            description: "Guided run into Dense Filament Alpha to show high fuel gain and rising torsion/thermal cost.",
            startX: 130,
            startY: 255,
            velocityX: 0.42,
            velocityY: -0.08,
            headingRadians: -0.22,
            targetX: 285,
            targetY: 165,
            focus: "dense",
            triggerSignal: false
        },
        {
            key: "void-coast",
            label: "Coast Void Corridor",
            description: "Guided run through a void corridor to show smooth inertial coasting with weaker fuel intake.",
            startX: 500,
            startY: 250,
            velocityX: 0.72,
            velocityY: -0.05,
            headingRadians: -0.05,
            targetX: 690,
            targetY: 250,
            focus: "void",
            triggerSignal: false
        },
        {
            key: "torsion-shear",
            label: "Cross Torsion Shear",
            description: "Guided run near the torsion node to show route bending and navigation-risk growth.",
            startX: 330,
            startY: 265,
            velocityX: 0.48,
            velocityY: -0.03,
            headingRadians: 0.08,
            targetX: 510,
            targetY: 210,
            focus: "torsion",
            triggerSignal: false
        },
        {
            key: "multi-messenger",
            label: "Trigger Multi-Messenger Event",
            description: "Guided run that immediately emits a signal event so GravityWavefront arrives before PhotonWavefront.",
            startX: 300,
            startY: 210,
            velocityX: 0.36,
            velocityY: 0.02,
            headingRadians: 0.12,
            targetX: 560,
            targetY: 255,
            focus: "wavefront",
            triggerSignal: true
        },
        {
            key: "grand-tour",
            label: "Grand Tour Challenge",
            description: "Guided challenge that visits dense harvest, void coast, torsion shear, multi-messenger, and beacon approach in one run.",
            startX: 130,
            startY: 270,
            velocityX: 0.45,
            velocityY: -0.18,
            headingRadians: -0.18,
            targetX: 285,
            targetY: 165,
            focus: "grand-tour",
            triggerSignal: false
        },
        {
            key: "beacon-approach",
            label: "Beacon Approach",
            description: "Guided final approach to the destination beacon while preserving fuel and lowering risk.",
            startX: 610,
            startY: 285,
            velocityX: 0.44,
            velocityY: -0.12,
            headingRadians: -0.24,
            targetX: 760,
            targetY: 215,
            focus: "beacon",
            triggerSignal: false
        }
    ];

    const PROPULSION_MODE_PRESETS = [
        {
            key: "inertial-coast",
            label: "Inertial Coast",
            active: true,
            description: "Best in voids, low fuel use, slow acceleration, stable route.",
            futureLabel: ""
        },
        {
            key: "ramscoop-harvest",
            label: "Ramscoop Harvest",
            active: true,
            description: "Best in dense regions, high fuel gain, higher drag and thermal load.",
            futureLabel: ""
        },
        {
            key: "torsion-shear-assist",
            label: "Torsion-Shear Assist",
            active: true,
            description: "Uses torsion vector field to bend/boost route, higher curvature risk.",
            futureLabel: ""
        },
        {
            key: "proca-gradient-ride",
            label: "Proca Gradient Ride",
            active: true,
            description: "Uses Proca gradient field for speed/optical effects, raises PSF/lensing distortion.",
            futureLabel: ""
        },
        {
            key: "beacon-approach",
            label: "Beacon Approach",
            active: true,
            description: "Prioritizes control and final alignment over raw speed.",
            futureLabel: ""
        },
        {
            key: "quantized-inertia-placeholder",
            label: "Quantized Inertia Placeholder",
            active: false,
            description: "Future speculative mode — not active in this package.",
            futureLabel: "Future speculative mode — not active in this package."
        },
        {
            key: "haloscope-sail-placeholder",
            label: "Haloscope Sail Placeholder",
            active: false,
            description: "Future speculative mode — not active in this package.",
            futureLabel: "Future speculative mode — not active in this package."
        },
        {
            key: "warp-bubble-placeholder",
            label: "Warp Bubble Placeholder",
            active: false,
            description: "Future speculative mode — not active in this package.",
            futureLabel: "Future speculative mode — not active in this package."
        }
    ];

    function listPropulsionModePresets() {
        return PROPULSION_MODE_PRESETS.map(function mapPropulsionMode(mode) {
            return {
                key: mode.key,
                label: mode.label,
                active: mode.active,
                description: mode.description,
                futureLabel: mode.futureLabel
            };
        });
    }

    function getPropulsionModePreset(key) {
        for (let index = 0; index < PROPULSION_MODE_PRESETS.length; index += 1) {
            if (PROPULSION_MODE_PRESETS[index].key === key) {
                return PROPULSION_MODE_PRESETS[index];
            }
        }
        return PROPULSION_MODE_PRESETS[0];
    }

    function createPropulsionModeState(key) {
        const preset = getPropulsionModePreset(key || "inertial-coast");
        return {
            activePropulsionMode: preset.active ? preset.key : "inertial-coast",
            requestedPropulsionMode: preset.key,
            modeLabel: preset.active ? preset.label : "Inertial Coast",
            requestedModeLabel: preset.label,
            locked: !preset.active,
            lockedReason: preset.active ? "" : "Future speculative mode — not active in this package.",
            propulsionFuelModel: "balanced inertial baseline",
            propulsionModeEfficiency: 0.55,
            propulsionModeRisk: 0.05,
            propulsionModeEvidence: "Inertial coast baseline selected.",
            thrustMultiplier: 0.82,
            speedMultiplier: 0.92,
            fuelUseMultiplier: 0.45,
            fuelHarvestMultiplier: 0.70,
            thermalMultiplier: 0.72,
            dragMultiplier: 0.82,
            routeCurvatureMultiplier: 0.72,
            procaTurbulenceMultiplier: 0.85,
            torsionAssistMultiplier: 0.18,
            modeRouteAdvice: preset.description,
            futurePlaceholders: listPropulsionModePresets().filter(function filterLocked(mode) { return !mode.active; }),
            finite: true
        };
    }

    function applyPropulsionMode(state, key) {
        const preset = getPropulsionModePreset(key);
        if (!preset.active) {
            state.propulsionModeState = createPropulsionModeState("inertial-coast");
            state.propulsionModeState.requestedPropulsionMode = preset.key;
            state.propulsionModeState.requestedModeLabel = preset.label;
            state.propulsionModeState.locked = true;
            state.propulsionModeState.lockedReason = "Future speculative mode — not active in this package.";
            state.propulsionModeState.propulsionModeEvidence = preset.label + " is locked as a future placeholder; Inertial Coast remains active.";
            return state.propulsionModeState;
        }
        state.propulsionModeState = createPropulsionModeState(preset.key);
        state.propulsionModeState.propulsionModeEvidence = preset.label + " selected: " + preset.description;
        return state.propulsionModeState;
    }

    function updatePropulsionModeState(state, field) {
        const previousMode = state.propulsionModeState ? state.propulsionModeState.activePropulsionMode : "inertial-coast";
        const preset = getPropulsionModePreset(previousMode);
        const sourceField = field || state.telemetry || sampleMissionField(state);
        const denseFactor = clamp(sourceField.substrateDensity / 1.6, 0, 1.4);
        const voidFactor = clamp(sourceField.inertialCoastBenefit / 0.9, 0, 1.4);
        const torsionFactor = state.teleparallelTorsionFieldState ? clamp(state.teleparallelTorsionFieldState.torsionMagnitude / 1.3 + state.teleparallelTorsionFieldState.routeCurvature / 2.2, 0, 1.8) : 0;
        const procaFactor = state.dynamicProcaFieldState ? clamp(state.dynamicProcaFieldState.gradientMagnitude / 1.1 + state.dynamicProcaFieldState.fieldDensity / 2.4, 0, 1.8) : 0;
        const beaconDistance = distanceBetween(state.ship.x, state.ship.y, state.beacon.x, state.beacon.y);
        const beaconFactor = clamp(1 - beaconDistance / 260, 0, 1);

        let propulsionFuelModel = "balanced inertial baseline";
        let propulsionModeEfficiency = clamp(0.48 + voidFactor * 0.28 - denseFactor * 0.08, 0, 1);
        let propulsionModeRisk = clamp(sourceField.navigationRisk / 140, 0, 1);
        let thrustMultiplier = 0.82;
        let speedMultiplier = 0.92 + voidFactor * 0.10;
        let fuelUseMultiplier = 0.45;
        let fuelHarvestMultiplier = 0.70;
        let thermalMultiplier = 0.72;
        let dragMultiplier = 0.82;
        let routeCurvatureMultiplier = 0.72;
        let procaTurbulenceMultiplier = 0.85;
        let torsionAssistMultiplier = 0.18;
        let modeRouteAdvice = "Inertial Coast: best in voids, low fuel use, slow acceleration, stable route.";

        if (preset.key === "ramscoop-harvest") {
            propulsionFuelModel = "dense substrate ramscoop";
            propulsionModeEfficiency = clamp(0.34 + denseFactor * 0.54 - voidFactor * 0.12, 0, 1);
            propulsionModeRisk = clamp(0.18 + denseFactor * 0.32 + sourceField.weberDrag * 3.2, 0, 1);
            thrustMultiplier = 0.94;
            speedMultiplier = 0.92 + denseFactor * 0.05;
            fuelUseMultiplier = 0.86;
            fuelHarvestMultiplier = 2.25;
            thermalMultiplier = 1.38;
            dragMultiplier = 1.25;
            routeCurvatureMultiplier = 1.05;
            procaTurbulenceMultiplier = 1.08;
            torsionAssistMultiplier = 0.14;
            modeRouteAdvice = "Ramscoop Harvest: dense matter increases fuel gain, drag, and heat.";
        } else if (preset.key === "torsion-shear-assist") {
            propulsionFuelModel = "torsion vector momentum assist";
            propulsionModeEfficiency = clamp(0.36 + torsionFactor * 0.48 - sourceField.navigationRisk / 260, 0, 1);
            propulsionModeRisk = clamp(0.20 + torsionFactor * 0.44 + sourceField.navigationRisk / 180, 0, 1);
            thrustMultiplier = 1.08;
            speedMultiplier = 1.02 + torsionFactor * 0.14;
            fuelUseMultiplier = 1.08;
            fuelHarvestMultiplier = 0.88;
            thermalMultiplier = 1.18;
            dragMultiplier = 1.05;
            routeCurvatureMultiplier = 1.62;
            procaTurbulenceMultiplier = 1.02;
            torsionAssistMultiplier = 0.72;
            modeRouteAdvice = "Torsion-Shear Assist: route can bend/boost through torsion, but curvature risk rises.";
        } else if (preset.key === "proca-gradient-ride") {
            propulsionFuelModel = "Proca gradient riding";
            propulsionModeEfficiency = clamp(0.38 + procaFactor * 0.44 - sourceField.opticalLag * 0.08, 0, 1);
            propulsionModeRisk = clamp(0.16 + procaFactor * 0.36 + sourceField.opticalLag * 0.10, 0, 1);
            thrustMultiplier = 1.02;
            speedMultiplier = 1.0 + procaFactor * 0.16;
            fuelUseMultiplier = 1.00;
            fuelHarvestMultiplier = 1.02;
            thermalMultiplier = 1.10;
            dragMultiplier = 0.98;
            routeCurvatureMultiplier = 1.12;
            procaTurbulenceMultiplier = 1.55;
            torsionAssistMultiplier = 0.24;
            modeRouteAdvice = "Proca Gradient Ride: speed responds to field gradients, while PSF/lensing distortion increases.";
        } else if (preset.key === "beacon-approach") {
            propulsionFuelModel = "precision beacon approach";
            propulsionModeEfficiency = clamp(0.46 + beaconFactor * 0.42 - sourceField.navigationRisk / 320, 0, 1);
            propulsionModeRisk = clamp(0.10 + sourceField.navigationRisk / 280 - beaconFactor * 0.08, 0, 1);
            thrustMultiplier = 0.70;
            speedMultiplier = 0.72;
            fuelUseMultiplier = 0.62;
            fuelHarvestMultiplier = 0.74;
            thermalMultiplier = 0.62;
            dragMultiplier = 0.74;
            routeCurvatureMultiplier = 0.55;
            procaTurbulenceMultiplier = 0.80;
            torsionAssistMultiplier = 0.10;
            modeRouteAdvice = "Beacon Approach: prioritizes stable control and final alignment over raw speed.";
        }

        const finite = [
            propulsionModeEfficiency,
            propulsionModeRisk,
            thrustMultiplier,
            speedMultiplier,
            fuelUseMultiplier,
            fuelHarvestMultiplier,
            thermalMultiplier,
            dragMultiplier,
            routeCurvatureMultiplier,
            procaTurbulenceMultiplier,
            torsionAssistMultiplier
        ].every(Number.isFinite);

        state.propulsionModeState = {
            activePropulsionMode: preset.key,
            requestedPropulsionMode: previousMode,
            modeLabel: preset.label,
            requestedModeLabel: preset.label,
            locked: false,
            lockedReason: "",
            propulsionFuelModel,
            propulsionModeEfficiency,
            propulsionModeRisk,
            propulsionModeEvidence: preset.label + " efficiency " + Math.round(propulsionModeEfficiency * 100) + "%, risk " + Math.round(propulsionModeRisk * 100) + "%.",
            thrustMultiplier,
            speedMultiplier,
            fuelUseMultiplier,
            fuelHarvestMultiplier,
            thermalMultiplier,
            dragMultiplier,
            routeCurvatureMultiplier,
            procaTurbulenceMultiplier,
            torsionAssistMultiplier,
            modeRouteAdvice,
            futurePlaceholders: listPropulsionModePresets().filter(function filterLocked(mode) { return !mode.active; }),
            finite
        };
        return state.propulsionModeState;
    }

    function serializePropulsionModeState(propulsionState) {
        const source = propulsionState || createPropulsionModeState("inertial-coast");
        return {
            activePropulsionMode: source.activePropulsionMode,
            requestedPropulsionMode: source.requestedPropulsionMode,
            modeLabel: source.modeLabel,
            requestedModeLabel: source.requestedModeLabel,
            locked: Boolean(source.locked),
            lockedReason: source.lockedReason,
            propulsionFuelModel: source.propulsionFuelModel,
            propulsionModeEfficiency: Number(finiteNumber(source.propulsionModeEfficiency, 0).toFixed(6)),
            propulsionModeRisk: Number(finiteNumber(source.propulsionModeRisk, 0).toFixed(6)),
            propulsionModeEvidence: source.propulsionModeEvidence,
            thrustMultiplier: Number(finiteNumber(source.thrustMultiplier, 1).toFixed(6)),
            speedMultiplier: Number(finiteNumber(source.speedMultiplier, 1).toFixed(6)),
            fuelUseMultiplier: Number(finiteNumber(source.fuelUseMultiplier, 1).toFixed(6)),
            fuelHarvestMultiplier: Number(finiteNumber(source.fuelHarvestMultiplier, 1).toFixed(6)),
            thermalMultiplier: Number(finiteNumber(source.thermalMultiplier, 1).toFixed(6)),
            dragMultiplier: Number(finiteNumber(source.dragMultiplier, 1).toFixed(6)),
            routeCurvatureMultiplier: Number(finiteNumber(source.routeCurvatureMultiplier, 1).toFixed(6)),
            procaTurbulenceMultiplier: Number(finiteNumber(source.procaTurbulenceMultiplier, 1).toFixed(6)),
            torsionAssistMultiplier: Number(finiteNumber(source.torsionAssistMultiplier, 0).toFixed(6)),
            modeRouteAdvice: source.modeRouteAdvice,
            futurePlaceholders: Array.isArray(source.futurePlaceholders) ? source.futurePlaceholders.slice() : [],
            finite: Boolean(source.finite)
        };
    }

    function normalizeAngle(radians) {
        let normalized = radians;
        while (normalized > Math.PI) {
            normalized -= TWO_PI;
        }
        while (normalized < -Math.PI) {
            normalized += TWO_PI;
        }
        return normalized;
    }

    function listMissionDemoPresets() {
        return MISSION_DEMO_PRESETS.map(function mapPreset(preset) {
            return {
                key: preset.key,
                label: preset.label,
                description: preset.description,
                focus: preset.focus
            };
        });
    }

    function getMissionDemoPreset(key) {
        for (let index = 0; index < MISSION_DEMO_PRESETS.length; index += 1) {
            if (MISSION_DEMO_PRESETS[index].key === key) {
                return MISSION_DEMO_PRESETS[index];
            }
        }
        return MISSION_DEMO_PRESETS[0];
    }

    function getGrandTourTargets() {
        return [
            { key: "dense", label: "Harvest Dense Filament", x: 285, y: 165, focus: "dense" },
            { key: "void", label: "Coast Void Corridor", x: 690, y: 250, focus: "void" },
            { key: "torsion", label: "Cross Torsion Shear", x: 510, y: 210, focus: "torsion" },
            { key: "wavefront", label: "Trigger Multi-Messenger Event", x: 560, y: 255, focus: "wavefront" },
            { key: "beacon", label: "Beacon Approach", x: 760, y: 215, focus: "beacon" }
        ];
    }

    function getGrandTourTarget(index) {
        const targets = getGrandTourTargets();
        return targets[Math.max(0, Math.min(targets.length - 1, index))];
    }

    function createMissionChallengeState() {
        return {
            score: 0,
            rank: "Ready",
            passed: false,
            achievements: [],
            flags: {
                denseHarvestVisited: false,
                voidCorridorVisited: false,
                torsionShearVisited: false,
                multiMessengerTriggered: false,
                beaconApproachReached: false,
                safeThermalMaintained: true,
                fuelReserveMaintained: true
            },
            replayFrames: 0,
            status: "Challenge ready. Run Grand Tour Challenge for the full sequence."
        };
    }

    function recordMissionReplayFrame(state, reason) {
        if (!state.missionReplayTrail) {
            state.missionReplayTrail = [];
        }
        if (state.tick % 12 !== 0 && reason !== "event" && reason !== "checkpoint") {
            return;
        }
        state.missionReplayTrail.push({
            tick: state.tick,
            tickIndex: state.tick,
            simulatedUtc: new Date(Date.UTC(2026, 0, 1, 0, 0, state.tick)).toISOString(),
            elapsedSeconds: Number(state.elapsedSeconds.toFixed(3)),
            x: Number(state.ship.x.toFixed(3)),
            y: Number(state.ship.y.toFixed(3)),
            uiPositionX: Number(state.ship.x.toFixed(3)),
            uiPositionY: Number(state.ship.y.toFixed(3)),
            velocityX: Number(state.ship.velocityX.toFixed(6)),
            velocityY: Number(state.ship.velocityY.toFixed(6)),
            uiVelocityX: Number(state.ship.velocityX.toFixed(6)),
            uiVelocityY: Number(state.ship.velocityY.toFixed(6)),
            fuelCharge: Number(state.ship.fuelCharge.toFixed(3)),
            thermalLoad: Number(state.ship.thermalLoad.toFixed(3)),
            substrateDensity: Number(state.telemetry.substrateDensity.toFixed(6)),
            torsionPull: Number(state.telemetry.torsionPull.toFixed(6)),
            photonDelay: Number(state.wavefrontTelemetry.photonDelay.toFixed(3)),
            photonLag: Number(state.wavefrontTelemetry.photonDelay.toFixed(3)),
            photonEnergyRemaining: Number(state.wavefrontTelemetry.photonEnergy.toFixed(6)),
            gravityWaveEta: state.wavefrontTrackerState ? state.wavefrontTrackerState.gravityWaveEta : "No signal",
            photonEta: state.wavefrontTrackerState ? state.wavefrontTrackerState.photonEta : "No signal",
            relationalArcsecX: state.relationalCoordinateState ? Number(state.relationalCoordinateState.arcsecX.toFixed(6)) : 0,
            relationalArcsecY: state.relationalCoordinateState ? Number(state.relationalCoordinateState.arcsecY.toFixed(6)) : 0,
            relationalRadialArcseconds: state.relationalCoordinateState ? Number(state.relationalCoordinateState.radialArcseconds.toFixed(6)) : 0,
            relationalParsecsToBeacon: state.parsecNavigationState ? Number(state.parsecNavigationState.relationalParsecsToBeacon.toFixed(3)) : 0,
            relationalParsecsTraveled: state.parsecNavigationState ? Number(state.parsecNavigationState.relationalParsecsTraveled.toFixed(3)) : 0,
            parsecsPerSimulatedHour: state.parsecNavigationState ? Number(state.parsecNavigationState.parsecsPerSimulatedHour.toFixed(3)) : 0,
            currentRegionType: state.regionSurfaceDensityState ? state.regionSurfaceDensityState.currentRegionType : "neutral",
            currentRegionAreaSquareParsecs: state.regionSurfaceDensityState ? Number(state.regionSurfaceDensityState.currentRegionAreaSquareParsecs.toFixed(3)) : 0,
            substrateDensityPerSquareParsec: state.regionSurfaceDensityState ? Number(state.regionSurfaceDensityState.currentRegionDensityPerSquareParsec.toExponential(6)) : 0,
            dynamicProcaDensity: state.dynamicProcaFieldState ? Number(state.dynamicProcaFieldState.fieldDensity.toFixed(6)) : 0,
            psfBlurRadius: state.psfLensingState ? Number(state.psfLensingState.psfBlurRadius.toFixed(6)) : 0,
            lensingDeflectionArcseconds: state.psfLensingState ? Number(state.psfLensingState.lensingDeflectionArcseconds.toFixed(6)) : 0,
            torsionMagnitude: state.teleparallelTorsionFieldState ? Number(state.teleparallelTorsionFieldState.torsionMagnitude.toFixed(6)) : 0,
            routeCurvature: state.teleparallelTorsionFieldState ? Number(state.teleparallelTorsionFieldState.routeCurvature.toFixed(6)) : 0,
            curvatureRisk: state.routeCurvatureInspector ? Number(state.routeCurvatureInspector.curvatureRisk.toFixed(6)) : 0,
            distanceToBeaconGigaparsecs: state.distanceSpeedScaleState ? Number(state.distanceSpeedScaleState.distanceToBeaconGigaparsecs.toFixed(6)) : 0,
            speedGigaparsecsPerHour: state.distanceSpeedScaleState ? Number(state.distanceSpeedScaleState.speedGigaparsecsPerHour.toFixed(9)) : 0,
            activePropulsionMode: state.propulsionModeState ? state.propulsionModeState.activePropulsionMode : "inertial-coast",
            missionPhase: state.missionOutcomeState ? state.missionOutcomeState.missionPhase : "Ready",
            advisorMessage: state.routeAdvisorState ? state.routeAdvisorState.advisorMessage : state.telemetry.routeAdvice,
            propulsionModeEfficiency: state.propulsionModeState ? Number(state.propulsionModeState.propulsionModeEfficiency.toFixed(6)) : 0,
            propulsionModeRisk: state.propulsionModeState ? Number(state.propulsionModeState.propulsionModeRisk.toFixed(6)) : 0,
            objectiveScore: state.missionObjectiveScorecard ? Math.round(state.missionObjectiveScorecard.score) : 0,
            region: state.telemetry.localRegionLabel,
            reason: reason || "tick"
        });
        if (state.missionReplayTrail.length > 180) {
            state.missionReplayTrail.shift();
        }
    }

    function buildMissionReplaySummary(state) {
        const trail = Array.isArray(state.missionReplayTrail) ? state.missionReplayTrail : [];
        const first = trail.length > 0 ? trail[0] : null;
        const last = trail.length > 0 ? trail[trail.length - 1] : null;
        let routeDistance = 0;
        for (let index = 1; index < trail.length; index += 1) {
            routeDistance += distanceBetween(trail[index - 1].x, trail[index - 1].y, trail[index].x, trail[index].y);
        }
        return {
            frameCount: trail.length,
            firstTick: first ? first.tick : 0,
            lastTick: last ? last.tick : state.tick,
            routeDistance: Number(routeDistance.toFixed(3)),
            latestRegion: last ? last.region : state.telemetry.localRegionLabel,
            replayAvailable: trail.length > 1
        };
    }

    function updateMissionChallengeState(state) {
        if (!state.missionChallengeState) {
            state.missionChallengeState = createMissionChallengeState();
        }
        const challenge = state.missionChallengeState;
        challenge.flags.denseHarvestVisited = challenge.flags.denseHarvestVisited || state.telemetry.substrateDensity > 0.82 || state.telemetry.fuelHarvestRate > 0.058;
        challenge.flags.voidCorridorVisited = challenge.flags.voidCorridorVisited || state.telemetry.inertialCoastBenefit > 0.46;
        challenge.flags.torsionShearVisited = challenge.flags.torsionShearVisited || state.telemetry.torsionPull > 0.16 || state.telemetry.navigationRisk > 28;
        challenge.flags.multiMessengerTriggered = challenge.flags.multiMessengerTriggered || state.multiMessengerEvents.length > 0;
        challenge.flags.beaconApproachReached = challenge.flags.beaconApproachReached || distanceBetween(state.ship.x, state.ship.y, state.beacon.x, state.beacon.y) < 105 || state.ship.destinationReached;
        challenge.flags.safeThermalMaintained = challenge.flags.safeThermalMaintained && state.ship.thermalLoad < 92;
        challenge.flags.fuelReserveMaintained = challenge.flags.fuelReserveMaintained && state.ship.fuelCharge > 5;

        const achievementMap = [
            { key: "dense-harvest", label: "Dense Harvest", passed: challenge.flags.denseHarvestVisited },
            { key: "void-coast", label: "Void Coast", passed: challenge.flags.voidCorridorVisited },
            { key: "torsion-crossing", label: "Torsion Crossing", passed: challenge.flags.torsionShearVisited },
            { key: "multi-messenger", label: "Multi-Messenger Signal", passed: challenge.flags.multiMessengerTriggered },
            { key: "beacon-approach", label: "Beacon Approach", passed: challenge.flags.beaconApproachReached },
            { key: "thermal-safe", label: "Thermal Safe", passed: challenge.flags.safeThermalMaintained },
            { key: "fuel-reserve", label: "Fuel Reserve", passed: challenge.flags.fuelReserveMaintained }
        ];
        challenge.achievements = achievementMap.filter(function filterAchievement(achievement) {
            return achievement.passed;
        }).map(function mapAchievement(achievement) {
            return achievement.label;
        });
        challenge.score = Math.round(challenge.achievements.length / achievementMap.length * 100);
        challenge.passed = challenge.score >= 72;
        if (challenge.score >= 92) {
            challenge.rank = "Grand Tour";
        } else if (challenge.score >= 72) {
            challenge.rank = "Explorer";
        } else if (challenge.score >= 43) {
            challenge.rank = "Training";
        } else {
            challenge.rank = "Ready";
        }
        challenge.replayFrames = Array.isArray(state.missionReplayTrail) ? state.missionReplayTrail.length : 0;
        challenge.status = challenge.achievements.length > 0 ? "Achievements: " + challenge.achievements.join(", ") : "No challenge achievements yet.";
        return challenge;
    }

    function serializeMissionChallengeState(challenge) {
        const source = challenge || createMissionChallengeState();
        return {
            score: Math.round(finiteNumber(source.score, 0)),
            rank: source.rank,
            passed: Boolean(source.passed),
            achievements: Array.isArray(source.achievements) ? source.achievements.slice() : [],
            flags: Object.assign({}, source.flags),
            replayFrames: Math.round(finiteNumber(source.replayFrames, 0)),
            status: source.status
        };
    }

    function createMissionEvidenceLedger() {
        return {
            ready: false,
            score: 0,
            status: "Evidence ledger ready.",
            rows: []
        };
    }

    function createMissionReplayInspector() {
        return {
            active: false,
            selectedFrameIndex: -1,
            selectedFrame: null,
            status: "Replay inspector ready after trail frames are recorded."
        };
    }

    function createMissionReplayExportViewerState() {
        return {
            loaded: false,
            source: "none",
            schemaVersion: 0,
            pluginVersion: "",
            scenarioName: "",
            frameCount: 0,
            selectedFrameIndex: -1,
            selectedFrame: null,
            playbackActive: false,
            playbackSpeed: 1,
            playbackAccumulator: 0,
            importedAtUtc: "",
            validationPassed: false,
            validationErrors: [],
            replayFrames: [],
            replayStatus: "No export loaded.",
            replaySummary: "Load an export JSON to replay route evidence.",
            falsificationNotes: [],
            calibrationSnapshot: null,
            routeAdvisorSnapshot: null,
            finite: true
        };
    }

    function hasNonFiniteNumber(value) {
        if (typeof value === "number") {
            return !Number.isFinite(value);
        }
        if (!value || typeof value !== "object") {
            return false;
        }
        if (Array.isArray(value)) {
            for (let index = 0; index < value.length; index += 1) {
                if (hasNonFiniteNumber(value[index])) {
                    return true;
                }
            }
            return false;
        }
        return Object.keys(value).some(function checkNestedNumber(key) {
            return hasNonFiniteNumber(value[key]);
        });
    }

    function validateMissionReplayExportPayload(payload) {
        const errors = [];
        if (!payload || typeof payload !== "object") {
            errors.push("Replay import must be a JSON object.");
            return {
                passed: false,
                errors
            };
        }
        if (payload.exportType !== "ArcSecsSpaceTravelMissionRun") {
            errors.push("exportType must be ArcSecsSpaceTravelMissionRun.");
        }
        if (!Number.isFinite(payload.schemaVersion) || payload.schemaVersion < 3) {
            errors.push("schemaVersion must be 3 or newer.");
        }
        if (!payload.pluginVersion && !payload.packageVersion) {
            errors.push("pluginVersion or packageVersion is required.");
        }
        if (!payload.scenarioName && !payload.activeScenario) {
            errors.push("scenarioName or activeScenario is required.");
        }
        if (!payload.generatedAtUtc && !payload.exportedAtUtc && !payload.utcTimestamp) {
            errors.push("A generated/exported UTC timestamp is required.");
        }
        if (!payload.missionOutcome) {
            errors.push("missionOutcome is required.");
        }
        if (!payload.telemetry || typeof payload.telemetry !== "object") {
            errors.push("telemetry fields are required.");
        }
        if (!payload.speculativeBoundary || String(payload.speculativeBoundary).indexOf("Speculative") === -1) {
            errors.push("speculativeBoundary text is required.");
        }
        const frames = Array.isArray(payload.darkMatterTravelRouteLog) ? payload.darkMatterTravelRouteLog : (Array.isArray(payload.missionReplayTrail) ? payload.missionReplayTrail : []);
        if (frames.length === 0) {
            errors.push("darkMatterTravelRouteLog or missionReplayTrail must include frames.");
        }
        if (!payload.missionCalibrationState) {
            errors.push("missionCalibrationState is required.");
        }
        if (!payload.missionCalibrationEvidence) {
            errors.push("missionCalibrationEvidence is required.");
        }
        if (!payload.parsecNavigationState) {
            errors.push("parsecNavigationState is required.");
        }
        if (!payload.regionSurfaceDensityState) {
            errors.push("regionSurfaceDensityState is required.");
        }
        if (!payload.wavefrontTrackerState) {
            errors.push("wavefrontTrackerState is required.");
        }
        if (!payload.routeAdvisorState) {
            errors.push("routeAdvisorState is required.");
        }
        if (!Array.isArray(payload.falsificationNotes) || payload.falsificationNotes.length === 0) {
            errors.push("falsificationNotes are required.");
        }
        if (hasNonFiniteNumber(payload)) {
            errors.push("Replay export contains NaN or Infinity.");
        }
        return {
            passed: errors.length === 0,
            errors
        };
    }

    function normalizeMissionReplayExportFrame(frame, index) {
        const source = frame || {};
        const x = finiteNumber(source.uiPositionX, finiteNumber(source.x, 130));
        const y = finiteNumber(source.uiPositionY, finiteNumber(source.y, 270));
        return {
            frameIndex: index,
            tickIndex: Math.round(finiteNumber(source.tickIndex, finiteNumber(source.tick, index))),
            simulatedUtc: source.simulatedUtc || "",
            elapsedSeconds: Number(finiteNumber(source.elapsedSeconds, 0).toFixed(3)),
            x: Number(x.toFixed(3)),
            y: Number(y.toFixed(3)),
            uiPositionX: Number(x.toFixed(3)),
            uiPositionY: Number(y.toFixed(3)),
            uiVelocityX: Number(finiteNumber(source.uiVelocityX, finiteNumber(source.velocityX, 0)).toFixed(6)),
            uiVelocityY: Number(finiteNumber(source.uiVelocityY, finiteNumber(source.velocityY, 0)).toFixed(6)),
            fuelCharge: Number(finiteNumber(source.fuelCharge, 0).toFixed(3)),
            thermalLoad: Number(finiteNumber(source.thermalLoad, 0).toFixed(3)),
            relationalParsecsToBeacon: Number(finiteNumber(source.relationalParsecsToBeacon, 0).toFixed(3)),
            relationalParsecsTraveled: Number(finiteNumber(source.relationalParsecsTraveled, 0).toFixed(3)),
            parsecsPerSimulatedHour: Number(finiteNumber(source.parsecsPerSimulatedHour, 0).toFixed(3)),
            currentRegionType: source.currentRegionType || source.localRegionLabel || "neutral",
            currentRegionAreaSquareParsecs: Number(finiteNumber(source.currentRegionAreaSquareParsecs, 0).toFixed(3)),
            substrateDensityPerSquareParsec: Number(finiteNumber(source.substrateDensityPerSquareParsec, 0).toExponential(6)),
            procaDensity: Number(finiteNumber(source.procaDensity, finiteNumber(source.substrateDensity, 0)).toFixed(6)),
            torsionPull: Number(finiteNumber(source.torsionPull, 0).toFixed(6)),
            weberDrag: Number(finiteNumber(source.weberDrag, 0).toFixed(8)),
            photonLag: Number(finiteNumber(source.photonLag, finiteNumber(source.photonDelay, 0)).toFixed(3)),
            photonEnergyRemaining: Number(finiteNumber(source.photonEnergyRemaining, 0).toFixed(6)),
            gravityWaveEta: source.gravityWaveEta || "No signal",
            photonEta: source.photonEta || "No signal",
            activePropulsionMode: source.activePropulsionMode || "inertial-coast",
            missionPhase: source.missionPhase || "Imported replay",
            advisorMessage: source.advisorMessage || source.routeAdvice || "Imported replay frame."
        };
    }

    function buildMissionReplayExportViewerState(payload, sourceLabel) {
        const validation = validateMissionReplayExportPayload(payload);
        const rawFrames = payload && Array.isArray(payload.darkMatterTravelRouteLog) ? payload.darkMatterTravelRouteLog : (payload && Array.isArray(payload.missionReplayTrail) ? payload.missionReplayTrail : []);
        const replayFrames = rawFrames.map(function mapReplayFrame(frame, index) {
            return normalizeMissionReplayExportFrame(frame, index);
        });
        return {
            loaded: validation.passed,
            source: sourceLabel || "imported JSON",
            schemaVersion: payload && Number.isFinite(payload.schemaVersion) ? payload.schemaVersion : 0,
            pluginVersion: payload && payload.pluginVersion ? payload.pluginVersion : "",
            scenarioName: payload && payload.scenarioName ? payload.scenarioName : "Imported replay",
            frameCount: replayFrames.length,
            selectedFrameIndex: replayFrames.length > 0 ? 0 : -1,
            selectedFrame: replayFrames.length > 0 ? replayFrames[0] : null,
            playbackActive: false,
            playbackSpeed: 1,
            playbackAccumulator: 0,
            importedAtUtc: new Date().toISOString(),
            validationPassed: validation.passed,
            validationErrors: validation.errors,
            replayFrames,
            replayStatus: validation.passed ? "Replay export loaded. Use replay controls to inspect frames." : "Replay import failed: " + validation.errors.join(" "),
            replaySummary: validation.passed ? "Loaded " + replayFrames.length + " frames from " + (payload.scenarioName || "ArcSecs export") + "." : "Replay import did not pass validation.",
            falsificationNotes: payload && Array.isArray(payload.falsificationNotes) ? payload.falsificationNotes.slice() : [],
            calibrationSnapshot: payload && payload.missionCalibrationState ? payload.missionCalibrationState : null,
            routeAdvisorSnapshot: payload && payload.routeAdvisorState ? payload.routeAdvisorState : null,
            finite: validation.passed && !hasNonFiniteNumber(replayFrames)
        };
    }

    function selectMissionReplayExportFrame(state, frameIndex) {
        const viewer = state.missionReplayExportViewer || createMissionReplayExportViewerState();
        if (!viewer.loaded || viewer.replayFrames.length === 0) {
            return viewer;
        }
        const safeIndex = Math.round(clamp(frameIndex, 0, viewer.replayFrames.length - 1));
        const frame = viewer.replayFrames[safeIndex];
        viewer.selectedFrameIndex = safeIndex;
        viewer.selectedFrame = frame;
        viewer.replayStatus = "Replay frame " + (safeIndex + 1) + " of " + viewer.replayFrames.length + " at tick " + frame.tickIndex + ".";
        state.ship.x = frame.x;
        state.ship.y = frame.y;
        state.ship.velocityX = frame.uiVelocityX;
        state.ship.velocityY = frame.uiVelocityY;
        state.ship.fuelCharge = clamp(frame.fuelCharge, 0, 100);
        state.ship.thermalLoad = clamp(frame.thermalLoad, 0, 100);
        state.telemetry.substrateDensity = frame.procaDensity;
        state.telemetry.torsionPull = frame.torsionPull;
        state.telemetry.weberDrag = frame.weberDrag;
        state.telemetry.localRegionLabel = frame.currentRegionType;
        state.telemetry.routeAdvice = frame.advisorMessage;
        state.wavefrontTelemetry.photonDelay = frame.photonLag;
        state.wavefrontTelemetry.photonEnergy = frame.photonEnergyRemaining;
        state.missionOutcomeState = {
            missionOutcome: frame.missionPhase,
            missionPhase: frame.missionPhase,
            missionScore: state.missionOutcomeState ? state.missionOutcomeState.missionScore : 0,
            exportedEvidence: true,
            finite: true
        };
        state.routeAdvisorState = {
            currentRegionType: frame.currentRegionType,
            currentRisk: clamp(frame.thermalLoad + frame.photonLag * 0.12, 0, 100),
            bestNextAction: "Inspect imported replay frame.",
            advisorMessage: frame.advisorMessage,
            denseHarvestWorthIt: frame.currentRegionType === "dense",
            voidCoastRecommended: frame.currentRegionType === "void",
            photonLagWarning: frame.photonLag > 45,
            thermalWarning: frame.thermalLoad > 78,
            beaconApproachRecommended: false,
            finite: true
        };
        state.missionReplayInspector = {
            active: true,
            selectedFrameIndex: safeIndex,
            selectedFrame: frame,
            status: viewer.replayStatus
        };
        state.running = false;
        return viewer;
    }

    function loadMissionReplayExportPayload(state, payload, sourceLabel) {
        state.missionReplayExportViewer = buildMissionReplayExportViewerState(payload, sourceLabel || "imported JSON");
        if (state.missionReplayExportViewer.loaded) {
            state.missionReplayTrail = state.missionReplayExportViewer.replayFrames.slice();
            if (payload.missionCalibrationState) {
                state.missionCalibrationState = Object.assign(createMissionCalibrationState(), payload.missionCalibrationState);
            }
            selectMissionReplayExportFrame(state, 0);
            updateMissionEvidenceLedger(state);
        }
        return state.missionReplayExportViewer;
    }

    function importMissionReplayExportJson(state, jsonText, sourceLabel) {
        try {
            const payload = JSON.parse(String(jsonText || ""));
            return loadMissionReplayExportPayload(state, payload, sourceLabel || "pasted JSON");
        } catch (error) {
            state.missionReplayExportViewer = createMissionReplayExportViewerState();
            state.missionReplayExportViewer.validationErrors = ["Could not parse replay JSON."];
            state.missionReplayExportViewer.replayStatus = "Replay import failed: could not parse JSON.";
            state.missionReplayExportViewer.finite = false;
            return state.missionReplayExportViewer;
        }
    }

    function advanceMissionReplayExportViewer(state, direction) {
        const viewer = state.missionReplayExportViewer || createMissionReplayExportViewerState();
        if (!viewer.loaded || viewer.frameCount === 0) {
            return viewer;
        }
        const offset = direction >= 0 ? 1 : -1;
        const nextIndex = (viewer.selectedFrameIndex + offset + viewer.frameCount) % viewer.frameCount;
        return selectMissionReplayExportFrame(state, nextIndex);
    }

    function stepMissionReplayExportViewer(state, deltaSeconds) {
        const viewer = state.missionReplayExportViewer || createMissionReplayExportViewerState();
        if (!viewer.loaded || !viewer.playbackActive) {
            return viewer;
        }
        viewer.playbackAccumulator += finiteNumber(deltaSeconds, FRAME_SECONDS);
        const frameSeconds = clamp(0.18 / Math.max(0.25, viewer.playbackSpeed), 0.04, 0.7);
        if (viewer.playbackAccumulator >= frameSeconds) {
            viewer.playbackAccumulator = 0;
            advanceMissionReplayExportViewer(state, 1);
        }
        return viewer;
    }

    function serializeMissionReplayExportViewerState(viewerState) {
        const source = viewerState || createMissionReplayExportViewerState();
        return {
            loaded: Boolean(source.loaded),
            source: source.source,
            schemaVersion: Number(finiteNumber(source.schemaVersion, 0)),
            pluginVersion: source.pluginVersion,
            scenarioName: source.scenarioName,
            frameCount: Math.round(finiteNumber(source.frameCount, 0)),
            selectedFrameIndex: Math.round(finiteNumber(source.selectedFrameIndex, -1)),
            selectedFrame: source.selectedFrame,
            playbackActive: Boolean(source.playbackActive),
            playbackSpeed: Number(finiteNumber(source.playbackSpeed, 1).toFixed(3)),
            importedAtUtc: source.importedAtUtc,
            validationPassed: Boolean(source.validationPassed),
            validationErrors: Array.isArray(source.validationErrors) ? source.validationErrors.slice() : [],
            replayStatus: source.replayStatus,
            replaySummary: source.replaySummary,
            falsificationNotes: Array.isArray(source.falsificationNotes) ? source.falsificationNotes.slice() : [],
            calibrationSnapshot: source.calibrationSnapshot,
            routeAdvisorSnapshot: source.routeAdvisorSnapshot,
            finite: Boolean(source.finite)
        };
    }

    function createEvidenceRow(key, label, passed, severity, evidence) {
        return {
            key,
            label,
            passed: Boolean(passed),
            severity,
            evidence
        };
    }

    function buildMissionEvidenceLedger(state) {
        const challenge = state.missionChallengeState || createMissionChallengeState();
        const objective = state.missionObjectiveScorecard || createMissionObjectiveScorecard();
        const replaySummary = buildMissionReplaySummary(state);
        const wavefrontActive = state.multiMessengerEvents.length > 0;
        const rows = [
            createEvidenceRow(
                "speculative-boundary",
                "Speculative boundary",
                state.speculativeBoundary.indexOf("Speculative") !== -1,
                "required",
                state.speculativeBoundary
            ),
            createEvidenceRow(
                "finite-telemetry",
                "Finite telemetry",
                state.telemetry.finiteTelemetry,
                "required",
                "No NaN or Infinity allowed in mission telemetry."
            ),
            createEvidenceRow(
                "mission-replay-export-viewer",
                "Mission replay export viewer",
                Boolean(state.missionReplayExportViewer && state.missionReplayExportViewer.finite),
                "important",
                state.missionReplayExportViewer ? state.missionReplayExportViewer.replayStatus : "No replay export loaded."
            ),
            createEvidenceRow(
                "mission-calibration",
                "Mission calibration",
                Boolean(state.missionCalibrationState && state.missionCalibrationState.finite),
                "required",
                state.missionCalibrationState ? state.missionCalibrationState.calibrationEvidence : "Default calibration active."
            ),
            createEvidenceRow(
                "parsec-navigation",
                "Parsec navigation",
                Boolean(state.parsecNavigationState && state.parsecNavigationState.finite),
                "required",
                state.parsecNavigationState ? "Beacon distance " + formatParsecDistance(state.parsecNavigationState.relationalParsecsToBeacon) + ", velocity " + state.parsecNavigationState.parsecVelocity + "." : "No parsec navigation state available."
            ),
            createEvidenceRow(
                "region-surface-density",
                "Square-parsec region density",
                Boolean(state.regionSurfaceDensityState && state.regionSurfaceDensityState.finite),
                "required",
                state.regionSurfaceDensityState ? "Route area crossed " + formatValue(state.regionSurfaceDensityState.routeAreaCrossedSquareParsecs, 1) + " square parsecs." : "No region surface-density state available."
            ),
            createEvidenceRow(
                "wavefront-tracker",
                "Wavefront tracker",
                Boolean(state.wavefrontTrackerState && state.wavefrontTrackerState.finite),
                "required",
                state.wavefrontTrackerState ? state.wavefrontTrackerState.trackerStatus : "No wavefront tracker available."
            ),
            createEvidenceRow(
                "relational-coordinates",
                "Relational coordinate middleware",
                Boolean(state.relationalCoordinateState && state.relationalCoordinateState.finite),
                "required",
                state.relationalCoordinateState ? state.relationalCoordinateState.note : "No relational coordinate state available."
            ),
            createEvidenceRow(
                "propulsion-mode",
                "Propulsion mode",
                Boolean(state.propulsionModeState && state.propulsionModeState.finite && !state.propulsionModeState.locked),
                "required",
                state.propulsionModeState ? state.propulsionModeState.propulsionModeEvidence : "No propulsion mode state available."
            ),
            createEvidenceRow(
                "distance-speed-scale",
                "Distance and speed scale",
                Boolean(state.distanceSpeedScaleState && state.distanceSpeedScaleState.finite),
                "required",
                state.distanceSpeedScaleState ? state.distanceSpeedScaleState.scaleStatus : "No distance/speed scale state available."
            ),
            createEvidenceRow(
                "dynamic-proca-field",
                "Dynamic Proca field",
                Boolean(state.dynamicProcaFieldState && state.dynamicProcaFieldState.finite),
                "required",
                state.dynamicProcaFieldState ? state.dynamicProcaFieldState.status : "No dynamic Proca field available."
            ),
            createEvidenceRow(
                "psf-lensing-visualization",
                "PSF/lensing visualization",
                Boolean(state.psfLensingState && state.psfLensingState.finite),
                "important",
                state.psfLensingState ? state.psfLensingState.lensingStatus : "No PSF/lensing state available."
            ),
            createEvidenceRow(
                "teleparallel-torsion-field",
                "Teleparallel torsion vector field",
                Boolean(state.teleparallelTorsionFieldState && state.teleparallelTorsionFieldState.finite),
                "required",
                state.teleparallelTorsionFieldState ? state.teleparallelTorsionFieldState.status : "No teleparallel torsion field available."
            ),
            createEvidenceRow(
                "route-curvature-inspector",
                "Route curvature inspector",
                Boolean(state.routeCurvatureInspector && state.routeCurvatureInspector.finite),
                "important",
                state.routeCurvatureInspector ? state.routeCurvatureInspector.curvatureStatus : "No route curvature inspector available."
            ),
            createEvidenceRow(
                "objective-scorecard",
                "Mission objectives",
                objective.score >= 50,
                "important",
                objective.activeObjective
            ),
            createEvidenceRow(
                "challenge-achievements",
                "Challenge achievements",
                challenge.achievements.length >= 2,
                "important",
                challenge.status
            ),
            createEvidenceRow(
                "replay-trail",
                "Replay trail",
                replaySummary.frameCount >= 6,
                "important",
                replaySummary.frameCount + " replay frames recorded."
            ),
            createEvidenceRow(
                "dense-evidence",
                "Dense harvest evidence",
                Boolean(challenge.flags && challenge.flags.denseHarvestVisited),
                "optional",
                "Dense substrate should provide fuel while raising risk."
            ),
            createEvidenceRow(
                "void-evidence",
                "Void coast evidence",
                Boolean(challenge.flags && challenge.flags.voidCorridorVisited),
                "optional",
                "Void corridor should improve coasting while reducing fuel gain."
            ),
            createEvidenceRow(
                "torsion-evidence",
                "Torsion shear evidence",
                Boolean(challenge.flags && challenge.flags.torsionShearVisited),
                "optional",
                "Torsion should bend route and raise navigation risk."
            ),
            createEvidenceRow(
                "multi-messenger-evidence",
                "Multi-messenger evidence",
                wavefrontActive,
                "optional",
                state.wavefrontTelemetry.multiMessengerStatus
            )
        ];
        const passedRows = rows.filter(function filterPassed(row) { return row.passed; }).length;
        const score = Math.round(passedRows / rows.length * 100);
        return {
            ready: score >= 70 && rows[0].passed && rows[1].passed,
            score,
            status: score >= 70 ? "Evidence bundle is ready for export." : "Collect more replay, challenge, or wavefront evidence.",
            rows
        };
    }

    function serializeMissionEvidenceLedger(ledger) {
        const source = ledger || createMissionEvidenceLedger();
        return {
            ready: Boolean(source.ready),
            score: Math.round(finiteNumber(source.score, 0)),
            status: source.status,
            rows: Array.isArray(source.rows) ? source.rows.map(function mapRow(row) {
                return {
                    key: row.key,
                    label: row.label,
                    passed: Boolean(row.passed),
                    severity: row.severity,
                    evidence: row.evidence
                };
            }) : []
        };
    }

    function buildMissionReplayInspector(state, requestedIndex) {
        const trail = Array.isArray(state.missionReplayTrail) ? state.missionReplayTrail : [];
        if (trail.length === 0) {
            return {
                active: false,
                selectedFrameIndex: -1,
                selectedFrame: null,
                status: "No replay frames recorded yet."
            };
        }
        const fallbackIndex = trail.length - 1;
        const selectedFrameIndex = Math.max(0, Math.min(trail.length - 1, Number.isFinite(requestedIndex) ? Math.round(requestedIndex) : fallbackIndex));
        const selectedFrame = trail[selectedFrameIndex];
        return {
            active: true,
            selectedFrameIndex,
            selectedFrame: Object.assign({}, selectedFrame),
            status: "Inspecting frame " + (selectedFrameIndex + 1) + " of " + trail.length + " at tick " + selectedFrame.tick + "."
        };
    }

    function updateMissionEvidenceLedger(state) {
        state.missionEvidenceLedger = buildMissionEvidenceLedger(state);
        if (!state.missionReplayInspector || state.missionReplayInspector.selectedFrameIndex < 0) {
            state.missionReplayInspector = buildMissionReplayInspector(state);
        } else {
            state.missionReplayInspector = buildMissionReplayInspector(state, state.missionReplayInspector.selectedFrameIndex);
        }
        return state.missionEvidenceLedger;
    }

    function serializeMissionReplayInspector(inspector) {
        const source = inspector || createMissionReplayInspector();
        return {
            active: Boolean(source.active),
            selectedFrameIndex: Math.round(finiteNumber(source.selectedFrameIndex, -1)),
            selectedFrame: source.selectedFrame ? Object.assign({}, source.selectedFrame) : null,
            status: source.status
        };
    }

    function createMissionDemoDirector(selectedDemoKey) {
        const preset = getMissionDemoPreset(selectedDemoKey);
        return {
            selectedDemoKey: preset.key,
            selectedDemoLabel: preset.label,
            description: preset.description,
            focus: preset.focus,
            active: false,
            completed: false,
            startedTick: 0,
            completedTick: null,
            targetX: preset.targetX,
            targetY: preset.targetY,
            tourStageIndex: 0,
            tourStageLabel: preset.focus === "grand-tour" ? getGrandTourTarget(0).label : preset.label,
            distanceToTarget: 0,
            progress: 0,
            stageLog: [],
            status: "Select a guided mission demo or fly manually."
        };
    }

    function applyMissionDemoPreset(state, key) {
        const preset = getMissionDemoPreset(key);
        state.ship.x = preset.startX;
        state.ship.y = preset.startY;
        state.ship.velocityX = preset.velocityX;
        state.ship.velocityY = preset.velocityY;
        state.ship.headingRadians = preset.headingRadians;
        state.ship.destinationReached = false;
        state.input.thrust = false;
        state.input.brake = false;
        state.input.turnLeft = false;
        state.input.turnRight = false;
        state.input.scoop = true;
        state.input.inertialAssist = true;
        state.running = preset.key !== "free-flight";
        state.demoDirector = createMissionDemoDirector(preset.key);
        state.missionObjectiveScorecard = createMissionObjectiveScorecard();
        state.missionChallengeState = createMissionChallengeState();
        state.missionEvidenceLedger = createMissionEvidenceLedger();
        state.missionReplayInspector = createMissionReplayInspector();
        state.relationalCoordinateState = createRelationalCoordinateState();
        state.teleparallelTorsionFieldState = createTeleparallelTorsionFieldState();
        state.routeCurvatureInspector = createRouteCurvatureInspector();
        state.distanceSpeedScaleState = createDistanceSpeedScaleState();
        state.parsecNavigationState = createParsecNavigationState();
        state.regionSurfaceDensityState = createRegionSurfaceDensityState([]);
        state.routeComparisonState = createRouteComparisonState();
        state.wavefrontTrackerState = createWavefrontTrackerState();
        state.routeAdvisorState = createRouteAdvisorState();
        state.missionOutcomeState = createMissionOutcomeState();
        state.propulsionModeState = createPropulsionModeState(state.propulsionModeState ? state.propulsionModeState.activePropulsionMode : "inertial-coast");
        state.missionReplayTrail = [];
        state.demoDirector.active = preset.key !== "free-flight";
        state.demoDirector.startedTick = state.tick;
        if (preset.focus === "grand-tour") {
            const firstTarget = getGrandTourTarget(0);
            state.demoDirector.targetX = firstTarget.x;
            state.demoDirector.targetY = firstTarget.y;
            state.demoDirector.tourStageLabel = firstTarget.label;
        }
        state.demoDirector.status = preset.key === "free-flight" ? "Free flight selected. Use manual controls." : "Guided mission active: " + preset.label + ".";
        state.demoDirector.stageLog.push({
            tick: state.tick,
            label: preset.label,
            status: state.demoDirector.status
        });
        if (preset.triggerSignal) {
            createMultiMessengerEvent(state, "manual", state.ship.x, state.ship.y);
            state.demoDirector.stageLog.push({
                tick: state.tick,
                label: "Signal event",
                status: "Manual multi-messenger event triggered for guided demo."
            });
        }
        return state.demoDirector;
    }

    function updateMissionDemoDirector(state, deltaSeconds) {
        if (!state.demoDirector || !state.demoDirector.active) {
            return;
        }
        const director = state.demoDirector;
        if (director.selectedDemoKey === "grand-tour") {
            const currentTourTarget = getGrandTourTarget(director.tourStageIndex);
            director.targetX = currentTourTarget.x;
            director.targetY = currentTourTarget.y;
            director.tourStageLabel = currentTourTarget.label;
            director.focus = currentTourTarget.focus;
        }
        const targetDistance = distanceBetween(state.ship.x, state.ship.y, director.targetX, director.targetY);
        const startPreset = getMissionDemoPreset(director.selectedDemoKey);
        const startingDistance = Math.max(1, distanceBetween(startPreset.startX, startPreset.startY, director.targetX, director.targetY));
        const targetAngle = Math.atan2(director.targetY - state.ship.y, director.targetX - state.ship.x);
        const angleError = normalizeAngle(targetAngle - state.ship.headingRadians);
        director.distanceToTarget = targetDistance;
        director.progress = clamp(1 - targetDistance / startingDistance, 0, 1);

        state.input.turnLeft = angleError < -0.08;
        state.input.turnRight = angleError > 0.08;
        state.input.thrust = targetDistance > 34 && state.ship.fuelCharge > 3 && state.ship.thermalLoad < 92;
        state.input.brake = targetDistance < 70 || state.ship.thermalLoad > 78;
        state.input.scoop = director.focus !== "void";
        state.input.inertialAssist = true;

        if (director.focus === "wavefront" && !getActiveMultiMessengerEvent(state)) {
            createMultiMessengerEvent(state, "manual", state.ship.x, state.ship.y);
            director.stageLog.push({
                tick: state.tick,
                label: "Signal event",
                status: "Wavefront event emitted by guided mission director."
            });
        }

        if (director.selectedDemoKey === "grand-tour" && (targetDistance <= 42 || director.progress >= 0.96)) {
            const completedTarget = getGrandTourTarget(director.tourStageIndex);
            recordMissionReplayFrame(state, "checkpoint");
            director.stageLog.push({
                tick: state.tick,
                label: completedTarget.label,
                status: "Grand Tour checkpoint reached."
            });
            if (completedTarget.focus === "wavefront" && !getActiveMultiMessengerEvent(state)) {
                createMultiMessengerEvent(state, "manual", state.ship.x, state.ship.y);
            }
            if (director.tourStageIndex < getGrandTourTargets().length - 1) {
                director.tourStageIndex += 1;
                const nextTarget = getGrandTourTarget(director.tourStageIndex);
                director.targetX = nextTarget.x;
                director.targetY = nextTarget.y;
                director.focus = nextTarget.focus;
                director.tourStageLabel = nextTarget.label;
                director.progress = 0;
                director.status = "Grand Tour checkpoint: " + nextTarget.label + ".";
                return;
            }
        }

        if (targetDistance <= 34 || director.progress >= 0.98) {
            director.active = false;
            director.completed = true;
            director.completedTick = state.tick;
            director.status = "Guided mission complete: " + director.selectedDemoLabel + ".";
            director.stageLog.push({
                tick: state.tick,
                label: "Complete",
                status: director.status
            });
            state.input.thrust = false;
            state.input.brake = true;
            state.input.turnLeft = false;
            state.input.turnRight = false;
            return;
        }

        if (state.tick % 90 === 0) {
            director.stageLog.push({
                tick: state.tick,
                label: director.selectedDemoLabel,
                status: "Progress " + Math.round(director.progress * 100) + "%, distance " + Math.round(targetDistance) + " px."
            });
            if (director.stageLog.length > 20) {
                director.stageLog.shift();
            }
        }

        director.status = "Guided " + director.selectedDemoLabel + ": " + Math.round(director.progress * 100) + "% toward target.";
    }

    function createMissionObjectiveScorecard() {
        return {
            score: 0,
            rank: "Ready",
            passed: false,
            primaryObjective: "Select a guided demo or fly manually.",
            activeObjective: "No active objective yet.",
            failures: [],
            objectives: [
                { key: "movement", label: "Move the ship", passed: false, progress: 0, evidence: "Ship has not moved yet." },
                { key: "fuel", label: "Keep fuel reserve", passed: true, progress: 1, evidence: "Fuel reserve is safe." },
                { key: "thermal", label: "Keep thermal load safe", passed: true, progress: 1, evidence: "Thermal load is safe." },
                { key: "evidence", label: "Generate evidence", passed: false, progress: 0, evidence: "Run the simulation or trigger a signal event." }
            ]
        };
    }

    function scoreObjective(passed, progress) {
        const normalizedProgress = clamp(progress, 0, 1);
        return passed ? 25 : Math.round(normalizedProgress * 18);
    }

    function buildMissionObjectiveScorecard(state) {
        const director = state.demoDirector || createMissionDemoDirector("free-flight");
        const activeEvent = getActiveMultiMessengerEvent(state);
        const fuelProgress = clamp(state.ship.fuelCharge / 45, 0, 1);
        const thermalProgress = clamp(1 - state.ship.thermalLoad / 95, 0, 1);
        const motionMagnitude = Math.sqrt(state.ship.velocityX * state.ship.velocityX + state.ship.velocityY * state.ship.velocityY);
        const movementProgress = clamp(motionMagnitude / 0.9, 0, 1);
        const demoProgress = director.selectedDemoKey === "free-flight" ? movementProgress : clamp(director.progress, 0, 1);
        const wavefrontProgress = activeEvent ? (state.wavefrontTelemetry.gravityArrivalTick !== null ? 1 : 0.55) : 0;
        const densePassed = director.focus !== "dense" || state.telemetry.substrateDensity > 0.72 || state.telemetry.fuelHarvestRate > 0.055;
        const voidPassed = director.focus !== "void" || state.telemetry.inertialCoastBenefit > 0.42;
        const torsionPassed = director.focus !== "torsion" || state.telemetry.torsionPull > 0.12 || state.telemetry.navigationRisk > 22;
        const wavefrontPassed = director.focus !== "wavefront" || Boolean(activeEvent);
        const beaconPassed = director.focus !== "beacon" || director.progress > 0.72 || state.ship.destinationReached;

        const objectives = [
            {
                key: "demo-progress",
                label: director.selectedDemoKey === "free-flight" ? "Manual flight motion" : "Guided demo progress",
                passed: director.selectedDemoKey === "free-flight" ? movementProgress > 0.18 : demoProgress > 0.72 || director.completed,
                progress: demoProgress,
                evidence: director.status
            },
            {
                key: "reach-beacon",
                label: "Reach beacon",
                passed: state.ship.destinationReached,
                progress: clamp(1 - distanceBetween(state.ship.x, state.ship.y, state.beacon.x, state.beacon.y) / 700, 0, 1),
                evidence: state.ship.destinationReached ? "Beacon reached." : "Continue toward the beacon."
            },
            {
                key: "propulsion-mode-fit",
                label: "Propulsion mode fit",
                passed: state.propulsionModeState ? state.propulsionModeState.propulsionModeEfficiency >= 0.44 && !state.propulsionModeState.locked : true,
                progress: state.propulsionModeState ? clamp(state.propulsionModeState.propulsionModeEfficiency, 0, 1) : 0.5,
                evidence: state.propulsionModeState ? state.propulsionModeState.propulsionModeEvidence : "No propulsion mode selected."
            },
            {
                key: "fuel-reserve",
                label: "Keep fuel reserve",
                passed: state.ship.fuelCharge >= 12,
                progress: fuelProgress,
                evidence: "Fuel charge " + formatValue(state.ship.fuelCharge, 1) + "%."
            },
            {
                key: "thermal-safety",
                label: "Keep thermal load safe",
                passed: state.ship.thermalLoad <= 88,
                progress: thermalProgress,
                evidence: "Thermal load " + formatValue(state.ship.thermalLoad, 1) + "%."
            },
            {
                key: "scenario-evidence",
                label: "Scenario evidence",
                passed: densePassed && voidPassed && torsionPassed && wavefrontPassed && beaconPassed,
                progress: Math.min(1, Math.max(
                    director.focus === "dense" ? state.telemetry.substrateDensity / 0.9 : 0,
                    director.focus === "void" ? state.telemetry.inertialCoastBenefit / 0.75 : 0,
                    director.focus === "torsion" ? state.telemetry.torsionPull / 0.35 : 0,
                    director.focus === "wavefront" ? wavefrontProgress : 0,
                    director.focus === "beacon" ? director.progress : 0,
                    director.focus === "manual" ? movementProgress : 0
                )),
                evidence: state.telemetry.routeAdvice
            }
        ];

        const failures = objectives.filter(function filterFailure(objective) {
            return !objective.passed;
        }).map(function mapFailure(objective) {
            return objective.label + ": " + objective.evidence;
        });

        const score = clamp(objectives.reduce(function sumScore(total, objective) {
            return total + scoreObjective(objective.passed, objective.progress);
        }, 0), 0, 100);
        let rank = "Learning";
        if (score >= 90) {
            rank = "Mission Ready";
        } else if (score >= 72) {
            rank = "Stable Run";
        } else if (score >= 50) {
            rank = "Needs Tuning";
        }

        return {
            score: Math.round(score),
            rank,
            passed: score >= 72 && failures.length <= 1,
            primaryObjective: director.selectedDemoKey === "free-flight" ? "Explore manually and generate a clean export." : director.selectedDemoLabel,
            activeObjective: failures.length > 0 ? failures[0] : "All current mission objectives are satisfied.",
            failures,
            objectives
        };
    }

    function updateMissionObjectiveScorecard(state) {
        state.missionObjectiveScorecard = buildMissionObjectiveScorecard(state);
        return state.missionObjectiveScorecard;
    }

    function serializeMissionObjectiveScorecard(scorecard) {
        const source = scorecard || createMissionObjectiveScorecard();
        return {
            score: Math.round(finiteNumber(source.score, 0)),
            rank: source.rank,
            passed: Boolean(source.passed),
            primaryObjective: source.primaryObjective,
            activeObjective: source.activeObjective,
            failures: Array.isArray(source.failures) ? source.failures.slice() : [],
            objectives: Array.isArray(source.objectives) ? source.objectives.map(function mapObjective(objective) {
                return {
                    key: objective.key,
                    label: objective.label,
                    passed: Boolean(objective.passed),
                    progress: Number(finiteNumber(objective.progress, 0).toFixed(6)),
                    evidence: objective.evidence
                };
            }) : []
        };
    }

    function createEmptyWavefrontTelemetry() {
        return {
            gravityArrivalTick: null,
            photonArrivalTick: null,
            photonDelay: 0,
            photonEnergy: 1,
            substrateRefractiveIndex: 1,
            visibilityThresholdStatus: "No signal event yet",
            multiMessengerStatus: "Trigger a signal event to compare gravity baseline against delayed photon propagation.",
            gravityWavefrontSpeed: GRAVITY_WAVEFRONT_SPEED,
            photonWavefrontSpeed: PHOTON_BASE_SPEED,
            gravityWavefrontRadius: 0,
            photonWavefrontRadius: 0
        };
    }

    function createInitialState(seed) {
        const missionSeed = Number.isFinite(seed) ? seed : 5810;
        return {
            missionName: "ArcSecs Space Travel Mission Simulator",
            speculativeBoundary: SPECULATIVE_BOUNDARY,
            tick: 0,
            elapsedSeconds: 0,
            running: false,
            demoDirector: createMissionDemoDirector("free-flight"),
            missionObjectiveScorecard: createMissionObjectiveScorecard(),
            missionChallengeState: createMissionChallengeState(),
            missionEvidenceLedger: createMissionEvidenceLedger(),
            missionReplayInspector: createMissionReplayInspector(),
            missionReplayExportViewer: createMissionReplayExportViewerState(),
            relationalCoordinateState: createRelationalCoordinateState(),
            dynamicProcaFieldState: createDynamicProcaFieldState(),
            psfLensingState: createPsfLensingState(),
            teleparallelTorsionFieldState: createTeleparallelTorsionFieldState(),
            routeCurvatureInspector: createRouteCurvatureInspector(),
            missionCalibrationState: createMissionCalibrationState(),
            distanceSpeedScaleState: createDistanceSpeedScaleState(),
            parsecNavigationState: createParsecNavigationState(),
            regionSurfaceDensityState: createRegionSurfaceDensityState([]),
            routeComparisonState: createRouteComparisonState(),
            wavefrontTrackerState: createWavefrontTrackerState(),
            routeAdvisorState: createRouteAdvisorState(),
            missionOutcomeState: createMissionOutcomeState(),
            propulsionModeState: createPropulsionModeState("inertial-coast"),
            renderOptions: {
                showDynamicProcaField: true,
                showPsfLensing: true,
                showTorsionVectorField: true
            },
            missionReplayTrail: [],
            lastAutoSignalTick: -9999,
            input: {
                thrust: false,
                brake: false,
                turnLeft: false,
                turnRight: false,
                scoop: true,
                inertialAssist: true,
                autopilotToBeacon: false,
                tapTargetActive: false,
                tapTargetX: 0,
                tapTargetY: 0
            },
            ship: {
                x: 130,
                y: 270,
                velocityX: 0.45,
                velocityY: -0.18,
                headingRadians: -0.18,
                fuelCharge: 68,
                thermalLoad: 18,
                hullStress: 4,
                missionScore: 0,
                destinationReached: false
            },
            beacon: {
                x: 760,
                y: 215,
                radius: 32
            },
            regions: [
                createRegion("dense-filament-alpha", "Dense Filament Alpha", "dense", 275, 165, 100, 1.28),
                createRegion("matter-cloud-beta", "Matter Cloud Beta", "dense", 495, 365, 125, 1.05),
                createRegion("void-corridor-east", "Void Corridor East", "void", 650, 250, 150, 0.82),
                createRegion("smooth-inertial-channel", "Smooth Inertial Channel", "void", 365, 460, 110, 0.72),
                createRegion("torsion-shear-node", "Torsion Shear Node", "torsion", 420, 230, 115, 1.18),
                createRegion("beacon-wake", "Beacon Wake", "beacon", 730, 220, 92, 0.55)
            ],
            multiMessengerEvents: [],
            activeMultiMessengerEventId: "",
            wavefrontTelemetry: createEmptyWavefrontTelemetry(),
            telemetry: {
                substrateDensity: 0,
                fuelHarvestRate: 0,
                torsionPull: 0,
                weberDrag: 0,
                thermalDelta: 0,
                opticalLag: 0,
                inertialCoastBenefit: 0,
                arcsecondsToBeacon: 0,
                navigationRisk: 0,
                localRegionLabel: "Launch pocket",
                routeAdvice: "Start the mission, steer through dense zones to harvest fuel, then coast through void corridors to cool down.",
                finiteTelemetry: true
            },
            routeLog: [],
            exportSequence: 0,
            seed: missionSeed
        };
    }

    function sampleMissionFieldAt(state, x, y) {
        let denseContribution = 0;
        let voidContribution = 0;
        let torsionContribution = 0;
        let beaconContribution = 0;
        let localRegion = "Open substrate";
        let closestInfluence = 0;

        for (let index = 0; index < state.regions.length; index += 1) {
            const region = state.regions[index];
            const distance = distanceBetween(x, y, region.x, region.y);
            const influence = clamp(1 - distance / region.radius, 0, 1) * region.strength;
            if (influence > closestInfluence) {
                closestInfluence = influence;
                localRegion = region.label;
            }
            if (region.type === "dense") {
                denseContribution += influence;
            } else if (region.type === "void") {
                voidContribution += influence;
            } else if (region.type === "torsion") {
                torsionContribution += influence;
            } else if (region.type === "beacon") {
                beaconContribution += influence;
            }
        }

        const distanceToBeacon = distanceBetween(x, y, state.beacon.x, state.beacon.y);
        const densityStrengthCalibration = getMissionCalibrationValue(state, "densityStrength", 1);
        const dynamicProcaSample = sampleDynamicProcaFieldAt(state, x, y);
        const teleparallelSample = sampleTeleparallelTorsionFieldAt(state, x, y);
        const substrateDensity = clamp((0.28 + denseContribution * 0.58 + beaconContribution * 0.18 - voidContribution * 0.22 + dynamicProcaSample.fieldDensity * 0.20) * densityStrengthCalibration, 0.05, 3.2);
        const torsionPull = clamp(0.02 + torsionContribution * 0.42 + denseContribution * 0.11 + dynamicProcaSample.gradientMagnitude * 0.035 + teleparallelSample.torsionMagnitude * 0.18, 0, 1.55);
        const inertialCoastBenefit = clamp(0.1 + voidContribution * 0.72 - denseContribution * 0.12, 0, 1.2);
        const weberDrag = clamp(substrateDensity * 0.012 + torsionPull * 0.018 - inertialCoastBenefit * 0.006, 0.002, 0.09);
        const fuelHarvestRate = clamp((state.input.scoop ? substrateDensity * 0.08 : substrateDensity * 0.015) - torsionPull * 0.012, 0, 0.22);
        const opticalLag = clamp(substrateDensity * 0.38 + torsionPull * 0.22, 0, 1.5);
        const thermalDelta = clamp(substrateDensity * 0.16 + torsionPull * 0.30 - inertialCoastBenefit * 0.12, -0.18, 0.85);
        const arcsecondsToBeacon = clamp(distanceToBeacon * 18.2, 0, 20000);
        const navigationRisk = clamp(torsionPull * 42 + substrateDensity * 14 - inertialCoastBenefit * 10, 0, 100);
        const substrateRefractiveIndex = clamp(1 + substrateDensity * 0.48 + torsionPull * 0.16 + dynamicProcaSample.refractivePerturbation * 0.30, 1, 3.1);

        let routeAdvice = "Open substrate: maintain heading, watch fuel and thermal load.";
        if (denseContribution > 0.65) {
            routeAdvice = "Dense substrate: fuel high, but torsion, Weber drag, optical lag, and thermal load are rising.";
        } else if (voidContribution > 0.55) {
            routeAdvice = "Void corridor: smooth inertial coasting, weaker fuel intake, lower drag.";
        } else if (torsionContribution > 0.55) {
            routeAdvice = "Torsion shear: route is bending; use inertial assist or turn out of the anomaly.";
        } else if (distanceToBeacon < 80) {
            routeAdvice = "Beacon approach: reduce thermal load and preserve enough fuel for final correction.";
        }

        return {
            substrateDensity,
            fuelHarvestRate,
            torsionPull,
            weberDrag,
            thermalDelta,
            opticalLag,
            inertialCoastBenefit,
            arcsecondsToBeacon,
            navigationRisk,
            substrateRefractiveIndex,
            dynamicProcaFieldDensity: dynamicProcaSample.fieldDensity,
            dynamicProcaGradientMagnitude: dynamicProcaSample.gradientMagnitude,
            dynamicProcaFieldEnergy: dynamicProcaSample.fieldEnergy,
            dynamicProcaOpticalTurbulence: dynamicProcaSample.opticalTurbulence,
            teleparallelTorsionMagnitude: teleparallelSample.torsionMagnitude,
            teleparallelTorsionCurl: teleparallelSample.torsionCurl,
            teleparallelRouteCurvature: teleparallelSample.routeCurvature,
            localRegionLabel: localRegion,
            routeAdvice,
            finiteTelemetry: true
        };
    }

    function sampleMissionField(state) {
        const field = sampleMissionFieldAt(state, state.ship.x, state.ship.y);
        field.navigationRisk = clamp(field.navigationRisk + state.ship.thermalLoad * 0.35, 0, 100);
        return field;
    }

    function createGravityWavefront(eventId, sourceX, sourceY, emittedTick) {
        return {
            id: eventId + "-gravity-wavefront",
            sourceX,
            sourceY,
            emittedTick,
            radius: 0,
            speed: GRAVITY_WAVEFRONT_SPEED,
            arrivalTick: null,
            arrived: false
        };
    }

    function createPhotonWavefront(eventId, sourceX, sourceY, emittedTick, substrateRefractiveIndex) {
        const refractiveIndex = clamp(substrateRefractiveIndex, 1, 4);
        return {
            id: eventId + "-photon-wavefront",
            sourceX,
            sourceY,
            emittedTick,
            radius: 0,
            baseSpeed: PHOTON_BASE_SPEED,
            currentSpeed: PHOTON_BASE_SPEED / refractiveIndex,
            photonEnergy: 1,
            substrateRefractiveIndex: refractiveIndex,
            arrivalTick: null,
            arrived: false,
            visible: true,
            visibilityStatus: "Visible counterpart"
        };
    }

    function createMultiMessengerEvent(state, trigger, sourceX, sourceY) {
        const eventId = "multi-messenger-event-" + String(state.multiMessengerEvents.length + 1).padStart(3, "0");
        const sourceField = sampleMissionFieldAt(state, sourceX, sourceY);
        const event = {
            id: eventId,
            label: trigger === "manual" ? "Manual signal event" : "Automatic dense/torsion signal event",
            sourceX,
            sourceY,
            emittedTick: state.tick,
            emittedAtUtc: new Date().toISOString(),
            trigger,
            sourceSubstrateDensity: sourceField.substrateDensity,
            sourceTorsionPull: sourceField.torsionPull,
            sourceRefractiveIndex: sourceField.substrateRefractiveIndex,
            gravityWavefront: createGravityWavefront(eventId, sourceX, sourceY, state.tick),
            photonWavefront: createPhotonWavefront(eventId, sourceX, sourceY, state.tick, sourceField.substrateRefractiveIndex)
        };
        state.multiMessengerEvents.push(event);
        state.activeMultiMessengerEventId = event.id;
        if (state.multiMessengerEvents.length > 8) {
            state.multiMessengerEvents.shift();
        }
        state.wavefrontTelemetry = buildWavefrontTelemetry(state, event);
        recordMissionReplayFrame(state, "event");
        updateMissionEvidenceLedger(state);
        return event;
    }

    function getActiveMultiMessengerEvent(state) {
        if (!state.activeMultiMessengerEventId) {
            return null;
        }
        for (let index = state.multiMessengerEvents.length - 1; index >= 0; index -= 1) {
            if (state.multiMessengerEvents[index].id === state.activeMultiMessengerEventId) {
                return state.multiMessengerEvents[index];
            }
        }
        return null;
    }

    function updateWavefronts(state, deltaSeconds) {
        const event = getActiveMultiMessengerEvent(state);
        if (!event) {
            state.wavefrontTelemetry = createEmptyWavefrontTelemetry();
            return;
        }

        const localField = sampleMissionField(state);
        const sourceField = sampleMissionFieldAt(state, event.sourceX, event.sourceY);
        const refractiveIndex = clamp((localField.substrateRefractiveIndex + sourceField.substrateRefractiveIndex) / 2, 1, 4);
        const gravityWavefront = event.gravityWavefront;
        const photonWavefront = event.photonWavefront;
        const distanceToShip = distanceBetween(event.sourceX, event.sourceY, state.ship.x, state.ship.y);

        gravityWavefront.speed = GRAVITY_WAVEFRONT_SPEED;
        gravityWavefront.radius += gravityWavefront.speed * deltaSeconds;
        if (!gravityWavefront.arrived && gravityWavefront.radius >= distanceToShip) {
            gravityWavefront.arrived = true;
            gravityWavefront.arrivalTick = state.tick;
        }

        photonWavefront.substrateRefractiveIndex = refractiveIndex;
        photonWavefront.currentSpeed = clamp(PHOTON_BASE_SPEED / refractiveIndex, 45, PHOTON_BASE_SPEED);
        photonWavefront.radius += photonWavefront.currentSpeed * deltaSeconds;
        photonWavefront.photonEnergy = clamp(photonWavefront.photonEnergy * Math.exp(-localField.substrateDensity * 0.018 * deltaSeconds - localField.torsionPull * 0.010 * deltaSeconds), 0, 1);

        if (!photonWavefront.arrived && photonWavefront.radius >= distanceToShip) {
            photonWavefront.arrived = true;
            photonWavefront.arrivalTick = state.tick;
        }

        if (photonWavefront.photonEnergy < PHOTON_VISIBILITY_THRESHOLD) {
            photonWavefront.visible = false;
            photonWavefront.visibilityStatus = "Missing/weak electromagnetic counterpart";
        } else if (photonWavefront.photonEnergy < 0.48) {
            photonWavefront.visible = true;
            photonWavefront.visibilityStatus = "Weak red/faded photon counterpart";
        } else {
            photonWavefront.visible = true;
            photonWavefront.visibilityStatus = "Visible photon counterpart";
        }

        state.wavefrontTelemetry = buildWavefrontTelemetry(state, event);
    }

    function buildWavefrontTelemetry(state, event) {
        if (!event) {
            return createEmptyWavefrontTelemetry();
        }
        const gravityArrivalTick = event.gravityWavefront.arrivalTick;
        const photonArrivalTick = event.photonWavefront.arrivalTick;
        let photonDelay = 0;
        if (gravityArrivalTick !== null && photonArrivalTick !== null) {
            photonDelay = Math.max(0, photonArrivalTick - gravityArrivalTick);
        } else if (gravityArrivalTick !== null) {
            photonDelay = Math.max(0, state.tick - gravityArrivalTick);
        }

        let status = "Signal emitted. Gravity baseline and photon counterpart are propagating separately.";
        if (gravityArrivalTick !== null && photonArrivalTick === null) {
            status = "Gravity baseline arrived first; photon counterpart is still delayed by substrate density.";
        } else if (gravityArrivalTick !== null && photonArrivalTick !== null) {
            status = "Gravity arrived before light. Photon delay is " + photonDelay + " ticks in this speculative instrument mask.";
        }
        if (!event.photonWavefront.visible) {
            status = "Gravity baseline arrived; photon counterpart is missing or below visibility threshold.";
        }

        return {
            gravityArrivalTick,
            photonArrivalTick,
            photonDelay,
            photonEnergy: event.photonWavefront.photonEnergy,
            substrateRefractiveIndex: event.photonWavefront.substrateRefractiveIndex,
            visibilityThresholdStatus: event.photonWavefront.visibilityStatus,
            multiMessengerStatus: status,
            gravityWavefrontSpeed: event.gravityWavefront.speed,
            photonWavefrontSpeed: event.photonWavefront.currentSpeed,
            gravityWavefrontRadius: event.gravityWavefront.radius,
            photonWavefrontRadius: event.photonWavefront.radius
        };
    }

    function maybeTriggerAutomaticMultiMessengerEvent(state) {
        if (state.tick - state.lastAutoSignalTick < 720 || getActiveMultiMessengerEvent(state)) {
            return null;
        }
        const field = sampleMissionField(state);
        if (field.substrateDensity > 0.93 || field.torsionPull > 0.36) {
            state.lastAutoSignalTick = state.tick;
            return createMultiMessengerEvent(state, "automatic", state.ship.x + Math.cos(state.ship.headingRadians) * 32, state.ship.y + Math.sin(state.ship.headingRadians) * 32);
        }
        return null;
    }

    function getActiveNavigationTarget(state) {
        if (state.input.autopilotToBeacon) {
            return {
                active: true,
                x: state.beacon.x,
                y: state.beacon.y,
                label: "beacon autopilot"
            };
        }
        if (state.input.tapTargetActive) {
            return {
                active: true,
                x: state.input.tapTargetX,
                y: state.input.tapTargetY,
                label: "tap target"
            };
        }
        return {
            active: false,
            x: state.ship.x,
            y: state.ship.y,
            label: "manual"
        };
    }

    function setTapTarget(state, x, y) {
        state.input.tapTargetActive = true;
        state.input.tapTargetX = clamp(finiteNumber(x, state.ship.x), 20, 840);
        state.input.tapTargetY = clamp(finiteNumber(y, state.ship.y), 20, 500);
        state.running = true;
        return state.input;
    }

    function stepMissionState(state, deltaSeconds) {
        const stepSeconds = clamp(deltaSeconds, 0.001, 0.08);
        updateMissionDemoDirector(state, stepSeconds);
        updateDynamicProcaField(state);
        updateTeleparallelTorsionField(state);
        const field = sampleMissionField(state);
        const propulsion = updatePropulsionModeState(state, field);
        const ship = state.ship;
        const input = state.input;
        const navigationTarget = getActiveNavigationTarget(state);
        let navigationThrust = false;
        if (navigationTarget.active) {
            const targetDistance = distanceBetween(ship.x, ship.y, navigationTarget.x, navigationTarget.y);
            const targetAngle = Math.atan2(navigationTarget.y - ship.y, navigationTarget.x - ship.x);
            const angleDelta = normalizeAngle(targetAngle - ship.headingRadians);
            ship.headingRadians = normalizeAngle(ship.headingRadians + clamp(angleDelta, -0.08, 0.08));
            navigationThrust = targetDistance > 34;
            if (targetDistance <= 22 && state.input.tapTargetActive && !state.input.autopilotToBeacon) {
                state.input.tapTargetActive = false;
            }
        }
        const turnRate = 1.75 * stepSeconds;
        const thrustPower = (input.thrust || navigationThrust) && ship.fuelCharge > 0.5 ? 1.9 * propulsion.thrustMultiplier : 0;
        const brakePower = input.brake ? 0.88 : 0;
        const torsionField = state.teleparallelTorsionFieldState || createTeleparallelTorsionFieldState();
        const assistMultiplier = input.inertialAssist ? 0.46 : 1;

        if (input.turnLeft) {
            ship.headingRadians -= turnRate;
        }
        if (input.turnRight) {
            ship.headingRadians += turnRate;
        }

        const thrustX = Math.cos(ship.headingRadians) * thrustPower * stepSeconds;
        const thrustY = Math.sin(ship.headingRadians) * thrustPower * stepSeconds;
        const torsionX = torsionField.vectorX * field.torsionPull * (0.32 + propulsion.torsionAssistMultiplier * 0.18) * stepSeconds * assistMultiplier * propulsion.routeCurvatureMultiplier;
        const torsionY = torsionField.vectorY * field.torsionPull * (0.32 + propulsion.torsionAssistMultiplier * 0.18) * stepSeconds * assistMultiplier * propulsion.routeCurvatureMultiplier;
        const procaBoostX = state.dynamicProcaFieldState.gradientX * 0.020 * propulsion.procaTurbulenceMultiplier * stepSeconds;
        const procaBoostY = state.dynamicProcaFieldState.gradientY * 0.020 * propulsion.procaTurbulenceMultiplier * stepSeconds;
        const dragFactor = clamp(1 - field.weberDrag * propulsion.dragMultiplier * (input.inertialAssist ? 0.55 : 1.0), 0.86, 0.999);
        const brakeFactor = brakePower > 0 ? clamp(1 - brakePower * stepSeconds, 0.82, 1) : 1;

        ship.velocityX = (ship.velocityX + thrustX + torsionX + procaBoostX) * dragFactor * brakeFactor * clamp(propulsion.speedMultiplier, 0.65, 1.42);
        ship.velocityY = (ship.velocityY + thrustY + torsionY + procaBoostY) * dragFactor * brakeFactor * clamp(propulsion.speedMultiplier, 0.65, 1.42);

        if (input.inertialAssist) {
            ship.velocityX += Math.cos(ship.headingRadians) * field.inertialCoastBenefit * 0.018 * stepSeconds;
            ship.velocityY += Math.sin(ship.headingRadians) * field.inertialCoastBenefit * 0.018 * stepSeconds;
        }

        ship.x += ship.velocityX * 38 * stepSeconds;
        ship.y += ship.velocityY * 38 * stepSeconds;

        if (ship.x < 20 || ship.x > 840) {
            ship.velocityX *= -0.55;
            ship.x = clamp(ship.x, 20, 840);
        }
        if (ship.y < 20 || ship.y > 500) {
            ship.velocityY *= -0.55;
            ship.y = clamp(ship.y, 20, 500);
        }

        ship.fuelCharge = clamp(ship.fuelCharge + field.fuelHarvestRate * 20 * propulsion.fuelHarvestMultiplier * stepSeconds - thrustPower * 1.4 * propulsion.fuelUseMultiplier * stepSeconds, 0, 100);
        ship.thermalLoad = clamp(ship.thermalLoad + field.thermalDelta * 10 * propulsion.thermalMultiplier * stepSeconds + propulsion.propulsionModeRisk * 0.55 * stepSeconds - (input.brake ? 1.8 * stepSeconds : 0), 0, 100);
        ship.hullStress = clamp(ship.hullStress + field.torsionPull * 2.5 * propulsion.routeCurvatureMultiplier * stepSeconds + field.weberDrag * 2.2 * propulsion.dragMultiplier * stepSeconds - field.inertialCoastBenefit * 0.9 * stepSeconds, 0, 100);

        const distanceToBeacon = distanceBetween(ship.x, ship.y, state.beacon.x, state.beacon.y);
        ship.destinationReached = distanceToBeacon <= state.beacon.radius;
        ship.missionScore = clamp(100 - distanceToBeacon * 0.08 + ship.fuelCharge * 0.18 - ship.thermalLoad * 0.16 - ship.hullStress * 0.12, 0, 100);

        state.tick += 1;
        state.elapsedSeconds += stepSeconds;
        state.telemetry = Object.assign({}, field, {
            routeAdvice: appendWavefrontAdvice(field.routeAdvice, state.wavefrontTelemetry),
            finiteTelemetry: [
                ship.x,
                ship.y,
                ship.velocityX,
                ship.velocityY,
                ship.fuelCharge,
                ship.thermalLoad,
                ship.hullStress,
                ship.missionScore,
                field.substrateDensity,
                field.fuelHarvestRate,
                field.torsionPull,
                field.weberDrag,
                field.thermalDelta,
                field.opticalLag,
                field.inertialCoastBenefit,
                field.arcsecondsToBeacon,
                field.navigationRisk,
                state.wavefrontTelemetry.photonEnergy,
                state.wavefrontTelemetry.substrateRefractiveIndex,
                state.wavefrontTelemetry.photonDelay,
                state.dynamicProcaFieldState.fieldDensity,
                state.dynamicProcaFieldState.gradientMagnitude,
                state.dynamicProcaFieldState.fieldEnergy,
                state.teleparallelTorsionFieldState.torsionMagnitude,
                state.teleparallelTorsionFieldState.routeCurvature,
                state.distanceSpeedScaleState.speedGigaparsecsPerHour,
                state.distanceSpeedScaleState.distanceToBeaconGigaparsecs,
                state.propulsionModeState.propulsionModeEfficiency,
                state.propulsionModeState.propulsionModeRisk,
                state.parsecNavigationState.parsecsPerSimulatedHour,
                state.regionSurfaceDensityState.currentRegionAreaSquareParsecs,
                state.wavefrontTrackerState.lineOfSightDensityIntegral,
                state.routeAdvisorState.currentRisk
            ].every(Number.isFinite)
        });

        maybeTriggerAutomaticMultiMessengerEvent(state);
        updateWavefronts(state, stepSeconds);
        updatePsfLensingState(state);
        updateRouteCurvatureInspector(state);
        updateDistanceSpeedScaleState(state);
        updateParsecNavigationState(state);
        buildRegionSurfaceDensityState(state);
        updateRouteComparisonState(state);
        updateWavefrontTrackerState(state);
        state.telemetry.routeAdvice = appendPropulsionModeAdvice(appendTorsionCurvatureAdvice(appendOpticalVisualizationAdvice(appendWavefrontAdvice(field.routeAdvice, state.wavefrontTelemetry), state.dynamicProcaFieldState, state.psfLensingState), state.teleparallelTorsionFieldState, state.routeCurvatureInspector), state.propulsionModeState);
        state.relationalCoordinateState = translateInstrumentMaskToRelationalCoordinates(state);
        updateRouteAdvisorState(state);
        updateMissionObjectiveScorecard(state);
        updateMissionChallengeState(state);
        updateMissionOutcomeState(state);
        recordMissionReplayFrame(state, "tick");
        updateMissionEvidenceLedger(state);
        updateMissionOutcomeState(state);

        if (state.tick % 90 === 0 || ship.destinationReached) {
            state.routeLog.push({
                tickIndex: state.tick,
                simulatedUtc: new Date(Date.UTC(2026, 0, 1, 0, 0, state.tick)).toISOString(),
                elapsedSeconds: Number(state.elapsedSeconds.toFixed(3)),
                uiPositionX: Number(ship.x.toFixed(3)),
                uiPositionY: Number(ship.y.toFixed(3)),
                uiVelocityX: Number(ship.velocityX.toFixed(6)),
                uiVelocityY: Number(ship.velocityY.toFixed(6)),
                relationalArcsecsX: state.parsecNavigationState ? Number(state.parsecNavigationState.relationalArcsecsX.toFixed(6)) : 0,
                relationalArcsecsY: state.parsecNavigationState ? Number(state.parsecNavigationState.relationalArcsecsY.toFixed(6)) : 0,
                relationalParsecsToBeacon: state.parsecNavigationState ? Number(state.parsecNavigationState.relationalParsecsToBeacon.toFixed(3)) : 0,
                relationalParsecsTraveled: state.parsecNavigationState ? Number(state.parsecNavigationState.relationalParsecsTraveled.toFixed(3)) : 0,
                parsecsPerSimulatedHour: state.parsecNavigationState ? Number(state.parsecNavigationState.parsecsPerSimulatedHour.toFixed(3)) : 0,
                currentRegionType: state.regionSurfaceDensityState ? state.regionSurfaceDensityState.currentRegionType : "neutral",
                currentRegionAreaSquareParsecs: state.regionSurfaceDensityState ? Number(state.regionSurfaceDensityState.currentRegionAreaSquareParsecs.toFixed(3)) : 0,
                procaDensity: Number(state.telemetry.substrateDensity.toFixed(6)),
                substrateDensityPerSquareParsec: state.regionSurfaceDensityState ? Number(state.regionSurfaceDensityState.currentRegionDensityPerSquareParsec.toExponential(6)) : 0,
                torsionPull: Number(state.telemetry.torsionPull.toFixed(6)),
                weberDrag: Number(state.telemetry.weberDrag.toFixed(8)),
                thermalLoad: Number(ship.thermalLoad.toFixed(3)),
                fuelCharge: Number(ship.fuelCharge.toFixed(3)),
                photonLag: Number(state.wavefrontTelemetry.photonDelay.toFixed(3)),
                photonEnergyRemaining: Number(state.wavefrontTelemetry.photonEnergy.toFixed(6)),
                gravityWaveEta: state.wavefrontTrackerState ? state.wavefrontTrackerState.gravityWaveEta : "No signal",
                photonEta: state.wavefrontTrackerState ? state.wavefrontTrackerState.photonEta : "No signal",
                activePropulsionMode: state.propulsionModeState ? state.propulsionModeState.activePropulsionMode : "inertial-coast",
                missionPhase: state.missionOutcomeState ? state.missionOutcomeState.missionPhase : "Ready",
                advisorMessage: state.routeAdvisorState ? state.routeAdvisorState.advisorMessage : state.telemetry.routeAdvice
            });
            if (state.routeLog.length > 48) {
                state.routeLog.shift();
            }
        }

        return state;
    }

    function appendWavefrontAdvice(baseAdvice, wavefrontTelemetry) {
        if (!wavefrontTelemetry || wavefrontTelemetry.gravityArrivalTick === null) {
            return baseAdvice;
        }
        if (wavefrontTelemetry.photonArrivalTick === null) {
            return baseAdvice + " Multi-messenger: gravity baseline arrived first; photon signal is still delayed by Proca substrate density.";
        }
        if (wavefrontTelemetry.visibilityThresholdStatus.indexOf("Missing") !== -1) {
            return baseAdvice + " Multi-messenger: photon counterpart is weak or missing below visibility threshold.";
        }
        return baseAdvice + " Multi-messenger: gravity-first/light-later delay is " + wavefrontTelemetry.photonDelay + " ticks.";
    }

    function appendOpticalVisualizationAdvice(baseAdvice, procaField, psfState) {
        if (!procaField || !psfState) {
            return baseAdvice;
        }
        if (psfState.photonSmear > 22 || psfState.lensingDeflectionArcseconds > 90) {
            return baseAdvice + " Optical model: dynamic Proca turbulence is smearing the photon counterpart into a lensing arc.";
        }
        if (procaField.gradientMagnitude > 0.8) {
            return baseAdvice + " Optical model: Proca gradient is rising, so PSF blur and lensing deflection are increasing.";
        }
        return baseAdvice;
    }

    function appendTorsionCurvatureAdvice(baseAdvice, torsionField, routeInspector) {
        if (!torsionField || !routeInspector) {
            return baseAdvice;
        }
        if (routeInspector.curvatureRisk > 72) {
            return baseAdvice + " Torsion model: teleparallel vector field is bending the route; apply correction or inertial assist.";
        }
        if (torsionField.routeCurvature > 0.5) {
            return baseAdvice + " Torsion model: route curvature is measurable and the predicted waypoint is shifting.";
        }
        return baseAdvice;
    }

    function appendPropulsionModeAdvice(baseAdvice, propulsionState) {
        if (!propulsionState) {
            return baseAdvice;
        }
        if (propulsionState.locked) {
            return baseAdvice + " Propulsion: requested mode is locked; active mode remains " + propulsionState.modeLabel + ".";
        }
        return baseAdvice + " Propulsion: " + propulsionState.modeRouteAdvice;
    }


    function buildScientificSourceMatrix(activeScenario) {
        return Object.freeze({
            matrixVersion: 1,
            activeScenario: activeScenario || "spaceTravelMission",
            citationPolicy: "Use confirmed project citations where present; source-note placeholders require later citation completion.",
            rows: Object.freeze([
                Object.freeze({ scenario: "Distance-Time Kernel", sourceReferenceNote: "Project note anchored to parsec distance and multi-messenger timing.", standardExpectation: "Compare gravity and electromagnetic arrival timing against standard multi-messenger references.", arcsecsAlternativeAssumption: "Gravity-wave baseline remains the route reference while electromagnetic packets may lag or fade.", normalizedParameter: "lineOfSightDensity, refractiveIndex", derivedTelemetry: "Gravity Arrival, Photon Arrival, Photon Delay, Visibility", exportEvidence: "mission export wavefrontTrackerState", falsificationTrigger: "Photon delay does not scale with density or delay causes are mixed.", citationStatus: "project-note" }),
                Object.freeze({ scenario: "Dark Matter Ramjet", sourceReferenceNote: "Educational drive visualization and locked placeholder note.", standardExpectation: "No established dark matter propulsion system exists.", arcsecsAlternativeAssumption: "Fuel, heat, drag, and route risk are model telemetry only.", normalizedParameter: "densityStrength, speedCompression, beaconDistanceScale", derivedTelemetry: "fuel, thermalLoad, weberDrag, torsionPull", exportEvidence: "mission export routeAdvisorState and evidenceLedger", falsificationTrigger: "Dense substrate increases fuel without heat, drag, or risk.", citationStatus: "project-note" }),
                Object.freeze({ scenario: "Parallax Calibration", sourceReferenceNote: "Parsec / arcsecond / AU calibration anchor.", standardExpectation: "One arcsecond at one AU maps to one parsec.", arcsecsAlternativeAssumption: "Calibration must pass before speculative route interpretation.", normalizedParameter: "viewportScale, simulatedHoursPerTick", derivedTelemetry: "parsecsToBeacon, calibrationEvidence", exportEvidence: "missionCalibrationEvidence", falsificationTrigger: "One arcsecond and one AU no longer map to one parsec.", citationStatus: "confirmed" }),
                Object.freeze({ scenario: "Multi-Messenger Events", sourceReferenceNote: "GW170817 / GRB 170817A and standard-siren comparison anchors.", standardExpectation: "Intrinsic source delay and line-of-sight propagation delay remain separate.", arcsecsAlternativeAssumption: "Photon counterpart can be delayed, weakened, stretched, blurred, uncertain, or missing.", normalizedParameter: "intrinsicSourceDelay, propagationDelayBudget", derivedTelemetry: "Gravity Arrival, Photon Arrival, Photon Delay, Photon Energy", exportEvidence: "missionReplayExportViewerState and replayFrames", falsificationTrigger: "Missing counterpart is presented as proof instead of uncertainty.", citationStatus: "confirmed" })
            ])
        });
    }

    function buildScenarioEquationLibrary(activeScenario) {
        return Object.freeze({
            libraryVersion: 1,
            activeScenario: activeScenario || "spaceTravelMission",
            precisionBoundary: "Simplified equations are visualization contracts; pseudo-formulas are normalized model proxies, not empirical proof.",
            rows: Object.freeze([
                Object.freeze({ scenario: "Distance-Time Kernel", formula: "Photon Delay ≈ Intrinsic Source Delay + Propagation Delay Budget", formulaKind: "comparison formula", units: "ticks, seconds, normalized density", controlledInputs: "lineOfSightDensity, refractiveIndex", derivedTelemetry: "Gravity Arrival, Photon Arrival, Photon Delay, Visibility", exportedEvidence: "wavefrontTrackerState", placeholderStatus: "active telemetry" }),
                Object.freeze({ scenario: "Dark Matter Ramjet", formula: "Route Risk ≈ Fuel Gain + Heat + Drag + Torsion Pull", formulaKind: "pseudo-formula", units: "normalized fuel, heat, drag, risk", controlledInputs: "densityStrength, propulsionMode, speedCompression", derivedTelemetry: "fuel, thermalLoad, route risk", exportedEvidence: "routeAdvisorState, evidenceLedger", placeholderStatus: "speculative visualization" }),
                Object.freeze({ scenario: "Parallax Calibration", formula: "distance(parsec) = 1 / parallax(arcseconds)", formulaKind: "calibration formula", units: "arcseconds, AU, parsecs", controlledInputs: "parallax benchmark and viewport scale", derivedTelemetry: "parsec distance and calibration gate", exportedEvidence: "missionCalibrationEvidence", placeholderStatus: "calibration sanity check" }),
                Object.freeze({ scenario: "Multi-Messenger Events", formula: "Delay Budget = Intrinsic Source Delay + Propagation Delay Budget", formulaKind: "comparison formula", units: "seconds, ticks, normalized density", controlledInputs: "event preset and line-of-sight profile", derivedTelemetry: "Gravity Arrival, Photon Arrival, Visibility, Falsification Note", exportedEvidence: "mission replay export", placeholderStatus: "test scenario" })
            ])
        });
    }

    function buildMissionExport(state) {
        state.exportSequence += 1;
        const activeEvent = getActiveMultiMessengerEvent(state);
        return {
            exportType: "ArcSecsSpaceTravelMissionRun",
            schemaVersion: 4,
            packageVersion: "5.8.27",
            pluginVersion: "5.8.27",
            pageSourceRoute: "/space-travel-simulation/",
            activeScenario: state.demoDirector ? state.demoDirector.selectedDemoKey : "free-flight",
            activePreset: state.demoDirector ? state.demoDirector.selectedDemoKey : "free-flight",
            guidedDemo: state.demoDirector ? serializeMissionDemoDirector(state.demoDirector) : serializeMissionDemoDirector(createMissionDemoDirector("free-flight")),
            exportedAtUtc: new Date().toISOString(),
            generatedAtUtc: new Date().toISOString(),
            utcTimestamp: new Date().toISOString(),
            scenarioName: state.demoDirector ? state.demoDirector.selectedDemoLabel : state.missionName,
            missionOutcome: state.missionOutcomeState ? state.missionOutcomeState.missionOutcome : "Ready",
            missionScore: state.missionOutcomeState ? Math.round(state.missionOutcomeState.missionScore) : Math.round(state.ship.missionScore),
            validationState: "pending",
            sequence: state.exportSequence,
            speculativeBoundary: state.speculativeBoundary,
            caveats: [
                "Speculative visualization only.",
                "The 2D canvas is an instrument mask, not literal space.",
                "Gigaparsec/hour speed is a compressed simulator display unit for route comparison, not an established propulsion claim.",
                "GravityWavefront and PhotonWavefront are decoupled model components for comparison and falsification.",
                "Dynamic Proca field and PSF/lensing overlays are visualization layers, not proof of a physical medium.",
                "Teleparallel torsion vector field and route curvature inspector are speculative navigation/evidence overlays.",
                "Propulsion modes are simulator behavior profiles; QI, haloscope, and warp options are locked placeholders in this package.",
                "Parsecs and square parsecs are simulator-native relational measurement units in this package.",
                "Light-years, where shown, are deprecated/legacy comparison only.",
                "Mission calibration controls alter simulator display/model parameters and are not physical calibration proof.",
                "Mission replay export viewer is an evidence-review tool and does not validate real-world propulsion."
            ],
            falsificationNotes: [
                "Check that distance and speed units remain finite and clearly labeled as compressed simulator scale.",
                "Check that gravity arrival precedes photon arrival.",
                "Check that photon delay increases when substrate refractive index is high.",
                "Check that photon energy remains non-negative and counterpart status is explicit.",
                "Check that stronger Proca gradients increase optical turbulence, PSF blur, or lensing deflection without creating non-finite telemetry.",
                "Check that torsion vectors bend route projections while all curvature and correction telemetry remains finite.",
                "Check that active propulsion modes change fuel, thermal, speed, and route risk while locked placeholders remain inactive.",
                "Dense regions should not increase fuel without also increasing drag, heat, photon lag, or route risk.",
                "Void corridors should reduce drag and photon lag but produce weaker fuel gain.",
                "Exported evidence must replay route frames without non-finite values.",
                "Calibration changes must produce finite telemetry and be included in exported calibration evidence.",
                "Imported replay exports must include schema, calibration, parsec navigation, route frames, falsification notes, and finite telemetry."
            ],
            missionName: state.missionName,
            calibrationProfile: state.missionCalibrationState ? state.missionCalibrationState.calibrationProfile : "Default ArcSecs parsec mission calibration",
            viewportScale: state.missionCalibrationState ? Number(state.missionCalibrationState.viewportWidthGigaparsecs.toFixed(6)) : VIEWPORT_WIDTH_GIGAPARSECS,
            simulatedHoursPerTick: state.missionCalibrationState ? Number(state.missionCalibrationState.simulatedHoursPerTick.toFixed(9)) : SIMULATED_HOURS_PER_TICK,
            beaconDistanceScale: state.missionCalibrationState ? Number(state.missionCalibrationState.beaconDistanceScale.toFixed(6)) : 1,
            densityStrength: state.missionCalibrationState ? Number(state.missionCalibrationState.densityStrength.toFixed(6)) : 1,
            speedCompression: state.missionCalibrationState ? Number(state.missionCalibrationState.speedCompression.toFixed(6)) : 1,
            fuel: Number(state.ship.fuelCharge.toFixed(3)),
            thermalLoad: Number(state.ship.thermalLoad.toFixed(3)),
            torsionPull: Number(state.telemetry.torsionPull.toFixed(6)),
            weberDrag: Number(state.telemetry.weberDrag.toFixed(6)),
            procaDensity: Number(state.telemetry.substrateDensity.toFixed(6)),
            photonLag: Number(state.wavefrontTelemetry.photonDelay.toFixed(3)),
            gravityArrival: state.wavefrontTelemetry.gravityArrivalTick,
            photonArrival: state.wavefrontTelemetry.photonArrivalTick,
            refractiveIndex: Number(state.wavefrontTelemetry.substrateRefractiveIndex.toFixed(6)),
            visibilityStatus: state.wavefrontTelemetry.visibilityThresholdStatus,
            objectiveStatus: state.missionObjectiveScorecard ? state.missionObjectiveScorecard.activeObjective : "Move, collect evidence, trigger signal, reach beacon, export JSON, replay JSON.",
            evidenceLedger: serializeMissionEvidenceLedger(state.missionEvidenceLedger),
            warnings: buildValidationRows(state).filter(function filterWarning(row) { return !row.passed; }).map(function mapWarning(row) { return row.label + ": " + row.evidence; }),
            sourceMatrix: buildScientificSourceMatrix(state.demoDirector ? state.demoDirector.selectedDemoKey : "free-flight"),
            scenarioEquationLibrary: buildScenarioEquationLibrary(state.demoDirector ? state.demoDirector.selectedDemoKey : "free-flight"),
            readinessSweep: {
                version: "5.8.27",
                visitorOnboarding: true,
                groupedTelemetry: true,
                replayValidationHardened: true,
                evidenceAndFalsificationVisible: true,
                speculativeBoundaryVisible: true,
                exportSchemaNotes: "Every mission export includes package version, route, scenario, calibration, messenger telemetry, warnings, falsification notes, and inert JSON boundary text."
            },
            tick: state.tick,
            elapsedSeconds: Number(state.elapsedSeconds.toFixed(3)),
            missionReplayExportViewerState: serializeMissionReplayExportViewerState(state.missionReplayExportViewer),
            missionCalibrationState: serializeMissionCalibrationState(state.missionCalibrationState),
            missionCalibrationEvidence: buildMissionCalibrationEvidence(state),
            calibrationAudit: {
                calibrationAppliedTick: state.missionCalibrationState ? state.missionCalibrationState.calibrationAppliedTick : 0,
                viewportWidthGigaparsecs: state.missionCalibrationState ? Number(state.missionCalibrationState.viewportWidthGigaparsecs.toFixed(6)) : VIEWPORT_WIDTH_GIGAPARSECS,
                simulatedHoursPerTick: state.missionCalibrationState ? Number(state.missionCalibrationState.simulatedHoursPerTick.toFixed(9)) : SIMULATED_HOURS_PER_TICK,
                densityStrength: state.missionCalibrationState ? Number(state.missionCalibrationState.densityStrength.toFixed(6)) : 1,
                speedCompression: state.missionCalibrationState ? Number(state.missionCalibrationState.speedCompression.toFixed(6)) : 1
            },
            darkMatterShipTravelSandbox: {
                shortcode: "[arcsecs_space_travel_simulation]",
                nativeUnit: "parsec",
                areaUnit: "square parsec",
                canvasRole: "instrument mask",
                speculativeBoundary: state.speculativeBoundary
            },
            darkMatterShipState: {
                uiPositionX: Number(state.ship.x.toFixed(3)),
                uiPositionY: Number(state.ship.y.toFixed(3)),
                uiVelocityX: Number(state.ship.velocityX.toFixed(6)),
                uiVelocityY: Number(state.ship.velocityY.toFixed(6)),
                fuelCharge: Number(state.ship.fuelCharge.toFixed(3)),
                thermalLoad: Number(state.ship.thermalLoad.toFixed(3)),
                hullStress: Number(state.ship.hullStress.toFixed(3)),
                destinationReached: Boolean(state.ship.destinationReached)
            },
            darkMatterTravelRouteLog: state.routeLog.slice(),
            darkMatterTravelOutcome: serializeMissionOutcomeState(state.missionOutcomeState),
            parsecNavigationState: serializeParsecNavigationState(state.parsecNavigationState),
            multiMessengerPropagationState: {
                wavefrontTelemetry: serializeWavefrontTrackerState(state.wavefrontTrackerState),
                multiMessengerEvents: state.multiMessengerEvents.map(function mapEvent(event) {
                    return {
                        id: event.id,
                        sourceX: Number(event.sourceX.toFixed(3)),
                        sourceY: Number(event.sourceY.toFixed(3)),
                        emittedTick: event.emittedTick,
                        gravityWavefront: Object.assign({}, event.gravityWavefront),
                        photonWavefront: Object.assign({}, event.photonWavefront)
                    };
                })
            },
            regionSurfaceDensityState: serializeRegionSurfaceDensityState(state.regionSurfaceDensityState),
            wavefrontTrackerState: serializeWavefrontTrackerState(state.wavefrontTrackerState),
            routeAdvisorState: serializeRouteAdvisorState(state.routeAdvisorState),
            objectiveScorecard: serializeMissionObjectiveScorecard(state.missionObjectiveScorecard),
            relationalCoordinateState: serializeRelationalCoordinateState(state.relationalCoordinateState),
            distanceSpeedScaleState: serializeDistanceSpeedScaleState(state.distanceSpeedScaleState),
            routeComparisonState: serializeRouteComparisonState(state.routeComparisonState),
            propulsionModeState: serializePropulsionModeState(state.propulsionModeState),
            activePropulsionMode: state.propulsionModeState ? state.propulsionModeState.activePropulsionMode : "inertial-coast",
            propulsionFuelModel: state.propulsionModeState ? state.propulsionModeState.propulsionFuelModel : "balanced inertial baseline",
            propulsionModeEfficiency: state.propulsionModeState ? Number(state.propulsionModeState.propulsionModeEfficiency.toFixed(6)) : 0,
            propulsionModeRisk: state.propulsionModeState ? Number(state.propulsionModeState.propulsionModeRisk.toFixed(6)) : 0,
            propulsionModeEvidence: state.propulsionModeState ? state.propulsionModeState.propulsionModeEvidence : "No propulsion mode state available.",
            dynamicProcaFieldState: serializeDynamicProcaFieldState(state.dynamicProcaFieldState),
            psfLensingState: serializePsfLensingState(state.psfLensingState),
            teleparallelTorsionFieldState: serializeTeleparallelTorsionFieldState(state.teleparallelTorsionFieldState),
            routeCurvatureInspector: serializeRouteCurvatureInspector(state.routeCurvatureInspector),
            instrumentMaskCoordinates: {
                x: Number(state.ship.x.toFixed(3)),
                y: Number(state.ship.y.toFixed(3)),
                note: "Rendering coordinates only; relational ArcSecs telemetry is the export evidence layer."
            },
            ship: {
                x: Number(state.ship.x.toFixed(3)),
                y: Number(state.ship.y.toFixed(3)),
                velocityX: Number(state.ship.velocityX.toFixed(6)),
                velocityY: Number(state.ship.velocityY.toFixed(6)),
                headingRadians: Number(state.ship.headingRadians.toFixed(6)),
                fuelCharge: Number(state.ship.fuelCharge.toFixed(3)),
                thermalLoad: Number(state.ship.thermalLoad.toFixed(3)),
                hullStress: Number(state.ship.hullStress.toFixed(3)),
                missionScore: Number(state.ship.missionScore.toFixed(3)),
                destinationReached: state.ship.destinationReached
            },
            telemetry: {
                substrateDensity: Number(state.telemetry.substrateDensity.toFixed(6)),
                fuelHarvestRate: Number(state.telemetry.fuelHarvestRate.toFixed(6)),
                torsionPull: Number(state.telemetry.torsionPull.toFixed(6)),
                weberDrag: Number(state.telemetry.weberDrag.toFixed(6)),
                thermalDelta: Number(state.telemetry.thermalDelta.toFixed(6)),
                opticalLag: Number(state.telemetry.opticalLag.toFixed(6)),
                inertialCoastBenefit: Number(state.telemetry.inertialCoastBenefit.toFixed(6)),
                arcsecondsToBeacon: Number(state.telemetry.arcsecondsToBeacon.toFixed(3)),
                navigationRisk: Number(state.telemetry.navigationRisk.toFixed(3)),
                localRegionLabel: state.telemetry.localRegionLabel,
                routeAdvice: state.telemetry.routeAdvice,
                finiteTelemetry: state.telemetry.finiteTelemetry
            },
            wavefrontTelemetry: serializeWavefrontTelemetry(state.wavefrontTelemetry),
            multiMessengerEvents: state.multiMessengerEvents.map(serializeMultiMessengerEvent),
            gravityWavefront: activeEvent ? serializeGravityWavefront(activeEvent.gravityWavefront) : null,
            photonWavefront: activeEvent ? serializePhotonWavefront(activeEvent.photonWavefront) : null,
            photonDelay: Number(state.wavefrontTelemetry.photonDelay.toFixed(3)),
            photonEnergy: Number(state.wavefrontTelemetry.photonEnergy.toFixed(6)),
            visibilityThreshold: state.wavefrontTelemetry.visibilityThresholdStatus,
            substrateRefractiveIndex: Number(state.wavefrontTelemetry.substrateRefractiveIndex.toFixed(6)),
            demoDirector: serializeMissionDemoDirector(state.demoDirector),
            missionObjectiveScorecard: serializeMissionObjectiveScorecard(state.missionObjectiveScorecard),
            missionObjectiveFailures: state.missionObjectiveScorecard ? state.missionObjectiveScorecard.failures.slice() : [],
            missionObjectivePass: state.missionObjectiveScorecard ? state.missionObjectiveScorecard.passed : false,
            missionChallengeState: serializeMissionChallengeState(state.missionChallengeState),
            missionChallengeAchievements: state.missionChallengeState ? state.missionChallengeState.achievements.slice() : [],
            missionChallengePass: state.missionChallengeState ? state.missionChallengeState.passed : false,
            missionEvidenceLedger: serializeMissionEvidenceLedger(state.missionEvidenceLedger),
            missionEvidenceReady: state.missionEvidenceLedger ? state.missionEvidenceLedger.ready : false,
            missionReplayInspector: serializeMissionReplayInspector(state.missionReplayInspector),
            missionReplayTrail: Array.isArray(state.missionReplayTrail) ? state.missionReplayTrail.slice() : [],
            missionReplaySummary: buildMissionReplaySummary(state),
            controls: Object.assign({}, state.input),
            regions: state.regions.map(function mapRegion(region) {
                return {
                    id: region.id,
                    label: region.label,
                    type: region.type,
                    x: region.x,
                    y: region.y,
                    radius: region.radius,
                    strength: region.strength
                };
            }),
            routeLog: state.routeLog.slice(),
            validation: buildValidationRows(state)
        };
    }

    function serializeMissionDemoDirector(director) {
        if (!director) {
            return createMissionDemoDirector("free-flight");
        }
        return {
            selectedDemoKey: director.selectedDemoKey,
            selectedDemoLabel: director.selectedDemoLabel,
            description: director.description,
            focus: director.focus,
            active: director.active,
            completed: director.completed,
            startedTick: director.startedTick,
            completedTick: director.completedTick,
            targetX: Number(finiteNumber(director.targetX, 0).toFixed(3)),
            targetY: Number(finiteNumber(director.targetY, 0).toFixed(3)),
            tourStageIndex: Math.round(finiteNumber(director.tourStageIndex, 0)),
            tourStageLabel: director.tourStageLabel,
            distanceToTarget: Number(finiteNumber(director.distanceToTarget, 0).toFixed(3)),
            progress: Number(finiteNumber(director.progress, 0).toFixed(6)),
            status: director.status,
            stageLog: Array.isArray(director.stageLog) ? director.stageLog.slice() : []
        };
    }

    function serializeGravityWavefront(wavefront) {
        return {
            id: wavefront.id,
            sourceX: Number(wavefront.sourceX.toFixed(3)),
            sourceY: Number(wavefront.sourceY.toFixed(3)),
            emittedTick: wavefront.emittedTick,
            radius: Number(wavefront.radius.toFixed(3)),
            speed: Number(wavefront.speed.toFixed(3)),
            arrivalTick: wavefront.arrivalTick,
            arrived: wavefront.arrived
        };
    }

    function serializePhotonWavefront(wavefront) {
        return {
            id: wavefront.id,
            sourceX: Number(wavefront.sourceX.toFixed(3)),
            sourceY: Number(wavefront.sourceY.toFixed(3)),
            emittedTick: wavefront.emittedTick,
            radius: Number(wavefront.radius.toFixed(3)),
            baseSpeed: Number(wavefront.baseSpeed.toFixed(3)),
            currentSpeed: Number(wavefront.currentSpeed.toFixed(3)),
            photonEnergy: Number(wavefront.photonEnergy.toFixed(6)),
            substrateRefractiveIndex: Number(wavefront.substrateRefractiveIndex.toFixed(6)),
            arrivalTick: wavefront.arrivalTick,
            arrived: wavefront.arrived,
            visible: wavefront.visible,
            visibilityStatus: wavefront.visibilityStatus
        };
    }

    function serializeMultiMessengerEvent(event) {
        return {
            id: event.id,
            label: event.label,
            sourceX: Number(event.sourceX.toFixed(3)),
            sourceY: Number(event.sourceY.toFixed(3)),
            emittedTick: event.emittedTick,
            emittedAtUtc: event.emittedAtUtc,
            trigger: event.trigger,
            sourceSubstrateDensity: Number(event.sourceSubstrateDensity.toFixed(6)),
            sourceTorsionPull: Number(event.sourceTorsionPull.toFixed(6)),
            sourceRefractiveIndex: Number(event.sourceRefractiveIndex.toFixed(6)),
            gravityWavefront: serializeGravityWavefront(event.gravityWavefront),
            photonWavefront: serializePhotonWavefront(event.photonWavefront)
        };
    }

    function serializeWavefrontTelemetry(telemetry) {
        return {
            gravityArrivalTick: telemetry.gravityArrivalTick,
            photonArrivalTick: telemetry.photonArrivalTick,
            photonDelay: Number(telemetry.photonDelay.toFixed(3)),
            photonEnergy: Number(telemetry.photonEnergy.toFixed(6)),
            substrateRefractiveIndex: Number(telemetry.substrateRefractiveIndex.toFixed(6)),
            visibilityThresholdStatus: telemetry.visibilityThresholdStatus,
            multiMessengerStatus: telemetry.multiMessengerStatus,
            gravityWavefrontSpeed: Number(telemetry.gravityWavefrontSpeed.toFixed(3)),
            photonWavefrontSpeed: Number(telemetry.photonWavefrontSpeed.toFixed(3)),
            gravityWavefrontRadius: Number(telemetry.gravityWavefrontRadius.toFixed(3)),
            photonWavefrontRadius: Number(telemetry.photonWavefrontRadius.toFixed(3))
        };
    }

    function buildValidationRows(state) {
        const activeEvent = getActiveMultiMessengerEvent(state);
        const gravityStable = !activeEvent || Math.abs(activeEvent.gravityWavefront.speed - GRAVITY_WAVEFRONT_SPEED) < 0.0001;
        const photonSlowerInDenseSubstrate = !activeEvent || activeEvent.photonWavefront.currentSpeed <= PHOTON_BASE_SPEED;
        const gravityFirst = !activeEvent || state.wavefrontTelemetry.photonArrivalTick === null || state.wavefrontTelemetry.gravityArrivalTick === null || state.wavefrontTelemetry.gravityArrivalTick <= state.wavefrontTelemetry.photonArrivalTick;
        return [
            {
                key: "finite-telemetry",
                label: "Finite telemetry",
                passed: state.telemetry.finiteTelemetry,
                evidence: "All exported numeric telemetry is finite."
            },
            {
                key: "non-negative-photon-energy",
                label: "Non-negative photon energy",
                passed: state.wavefrontTelemetry.photonEnergy >= 0,
                evidence: "Photon energy is clamped at or above zero."
            },
            {
                key: "gravity-speed-stable",
                label: "Gravity wavefront speed remains stable",
                passed: gravityStable,
                evidence: "GravityWavefront uses fixed baseline speed " + GRAVITY_WAVEFRONT_SPEED + "."
            },
            {
                key: "photon-speed-density-scaled",
                label: "Photon speed decreases with substrate density",
                passed: photonSlowerInDenseSubstrate,
                evidence: "PhotonWavefront speed is base speed divided by substrate refractive index."
            },
            {
                key: "gravity-first-light-later",
                label: "Gravity arrival precedes photon arrival",
                passed: gravityFirst,
                evidence: state.wavefrontTelemetry.multiMessengerStatus
            },
            {
                key: "guided-demo-finite",
                label: "Guided mission director finite",
                passed: !state.demoDirector || [state.demoDirector.targetX, state.demoDirector.targetY, state.demoDirector.distanceToTarget, state.demoDirector.progress].every(Number.isFinite),
                evidence: state.demoDirector ? state.demoDirector.status : "No guided mission director active."
            },
            {
                key: "mission-objective-scorecard-finite",
                label: "Mission objective scorecard finite",
                passed: state.missionObjectiveScorecard ? Number.isFinite(state.missionObjectiveScorecard.score) && state.missionObjectiveScorecard.objectives.every(function everyObjective(objective) { return Number.isFinite(objective.progress); }) : true,
                evidence: state.missionObjectiveScorecard ? state.missionObjectiveScorecard.activeObjective : "No mission objective scorecard available."
            },
            {
                key: "mission-replay-challenge-finite",
                label: "Mission replay and challenge finite",
                passed: (!state.missionReplayTrail || state.missionReplayTrail.every(function everyFrame(frame) { return Number.isFinite(frame.x) && Number.isFinite(frame.y) && Number.isFinite(frame.tick); })) && (!state.missionChallengeState || Number.isFinite(state.missionChallengeState.score)),
                evidence: state.missionChallengeState ? state.missionChallengeState.status : "No challenge state available."
            },
            {
                key: "mission-replay-export-viewer-finite",
                label: "Mission replay export viewer finite",
                passed: state.missionReplayExportViewer ? state.missionReplayExportViewer.finite && Array.isArray(state.missionReplayExportViewer.validationErrors) : true,
                evidence: state.missionReplayExportViewer ? state.missionReplayExportViewer.replayStatus : "No replay export loaded."
            },
            {
                key: "mission-calibration-finite",
                label: "Mission calibration finite",
                passed: state.missionCalibrationState ? state.missionCalibrationState.finite : true,
                evidence: state.missionCalibrationState ? state.missionCalibrationState.calibrationEvidence : "Default calibration active."
            },
            {
                key: "parsec-navigation-finite",
                label: "Parsec navigation finite",
                passed: state.parsecNavigationState ? state.parsecNavigationState.finite && state.parsecNavigationState.relationalParsecsToBeacon >= 0 && state.parsecNavigationState.parsecsPerSimulatedHour >= 0 : true,
                evidence: state.parsecNavigationState ? "Distance " + formatParsecDistance(state.parsecNavigationState.relationalParsecsToBeacon) + ", velocity " + state.parsecNavigationState.parsecVelocity + "." : "No parsec navigation state available."
            },
            {
                key: "region-surface-density-finite",
                label: "Square-parsec region surface density finite",
                passed: state.regionSurfaceDensityState ? state.regionSurfaceDensityState.finite && state.regionSurfaceDensityState.regions.length > 0 : true,
                evidence: state.regionSurfaceDensityState ? "Current region " + state.regionSurfaceDensityState.currentRegionType + " area " + formatValue(state.regionSurfaceDensityState.currentRegionAreaSquareParsecs, 1) + " square parsecs." : "No region surface-density state available."
            },
            {
                key: "wavefront-tracker-finite",
                label: "Wavefront tracker finite",
                passed: state.wavefrontTrackerState ? state.wavefrontTrackerState.finite && state.wavefrontTrackerState.lineOfSightDensityIntegral >= 0 : true,
                evidence: state.wavefrontTrackerState ? state.wavefrontTrackerState.trackerStatus : "No wavefront tracker state available."
            },
            {
                key: "route-advisor-finite",
                label: "Route advisor finite",
                passed: state.routeAdvisorState ? state.routeAdvisorState.finite && state.routeAdvisorState.advisorMessage.length > 0 : true,
                evidence: state.routeAdvisorState ? state.routeAdvisorState.bestNextAction : "No route advisor state available."
            },
            {
                key: "propulsion-mode-finite",
                label: "Propulsion mode finite",
                passed: state.propulsionModeState ? state.propulsionModeState.finite && state.propulsionModeState.propulsionModeEfficiency >= 0 && state.propulsionModeState.propulsionModeRisk >= 0 : true,
                evidence: state.propulsionModeState ? state.propulsionModeState.propulsionModeEvidence : "No propulsion mode state available."
            },
            {
                key: "distance-speed-scale-finite",
                label: "Distance and speed scale finite",
                passed: state.distanceSpeedScaleState ? state.distanceSpeedScaleState.finite && state.distanceSpeedScaleState.distanceToBeaconGigaparsecs >= 0 && state.distanceSpeedScaleState.speedGigaparsecsPerHour >= 0 : true,
                evidence: state.distanceSpeedScaleState ? state.distanceSpeedScaleState.scaleStatus : "No distance/speed scale state available."
            },
            {
                key: "teleparallel-torsion-curvature-finite",
                label: "Teleparallel torsion vector field and route curvature finite",
                passed: (!state.teleparallelTorsionFieldState || state.teleparallelTorsionFieldState.finite) && (!state.routeCurvatureInspector || state.routeCurvatureInspector.finite) && (!state.teleparallelTorsionFieldState || state.teleparallelTorsionFieldState.curvatureRadius > 0) && (!state.routeCurvatureInspector || state.routeCurvatureInspector.curvatureRisk >= 0),
                evidence: state.routeCurvatureInspector ? state.routeCurvatureInspector.curvatureStatus : "No route curvature inspector available."
            },
            {
                key: "dynamic-proca-psf-finite",
                label: "Dynamic Proca field and PSF/lensing finite",
                passed: (!state.dynamicProcaFieldState || state.dynamicProcaFieldState.finite) && (!state.psfLensingState || state.psfLensingState.finite) && (!state.psfLensingState || state.psfLensingState.psfBlurRadius >= 0) && (!state.psfLensingState || state.psfLensingState.observedPhotonEnergy >= 0),
                evidence: state.psfLensingState ? state.psfLensingState.lensingStatus : "No PSF/lensing state available."
            },
            {
                key: "relational-coordinate-finite",
                label: "Relational coordinate middleware finite",
                passed: state.relationalCoordinateState ? state.relationalCoordinateState.finite && state.relationalCoordinateState.parallaxArcseconds > 0 && state.relationalCoordinateState.parsecEquivalent > 0 : true,
                evidence: state.relationalCoordinateState ? state.relationalCoordinateState.relationalStateKey : "No relational coordinate state available."
            },
            {
                key: "mission-evidence-ledger-finite",
                label: "Mission evidence ledger finite",
                passed: state.missionEvidenceLedger ? Number.isFinite(state.missionEvidenceLedger.score) && state.missionEvidenceLedger.rows.every(function everyEvidenceRow(row) { return typeof row.key === "string" && typeof row.passed === "boolean"; }) : true,
                evidence: state.missionEvidenceLedger ? state.missionEvidenceLedger.status : "No mission evidence ledger available."
            },
            {
                key: "speculative-boundary-present",
                label: "Speculative boundary present",
                passed: state.speculativeBoundary.indexOf("Speculative") !== -1,
                evidence: state.speculativeBoundary
            }
        ];
    }

    function formatValue(value, digits) {
        return finiteNumber(value, 0).toFixed(digits);
    }

    function drawRegion(context, region) {
        let color = "rgba(104,231,255,.18)";
        if (region.type === "dense") {
            color = "rgba(255,214,111,.20)";
        } else if (region.type === "void") {
            color = "rgba(111,245,214,.13)";
        } else if (region.type === "torsion") {
            color = "rgba(255,105,135,.16)";
        } else if (region.type === "beacon") {
            color = "rgba(255,255,255,.11)";
        }

        const gradient = context.createRadialGradient(region.x, region.y, 2, region.x, region.y, region.radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(region.x, region.y, region.radius, 0, TWO_PI);
        context.fill();

        context.strokeStyle = color.replace(".20", ".55").replace(".18", ".50").replace(".13", ".46").replace(".16", ".52").replace(".11", ".45");
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(region.x, region.y, region.radius * 0.82, 0, TWO_PI);
        context.stroke();

        context.fillStyle = "rgba(235,250,255,.78)";
        context.font = "12px monospace";
        context.fillText(region.label, region.x - region.radius * 0.45, region.y - region.radius * 0.42);
    }

    function drawReplayInspectorMarker(context, state) {
        const inspector = state.missionReplayInspector || createMissionReplayInspector();
        if (!inspector.active || !inspector.selectedFrame) {
            return;
        }
        const frame = inspector.selectedFrame;
        context.save();
        context.globalCompositeOperation = "screen";
        context.strokeStyle = "rgba(255,255,255,.88)";
        context.lineWidth = 2;
        context.setLineDash([4, 5]);
        context.beginPath();
        context.arc(frame.x, frame.y, 15 + Math.sin(state.elapsedSeconds * 4) * 3, 0, TWO_PI);
        context.stroke();
        context.setLineDash([]);
        context.fillStyle = "rgba(255,255,255,.90)";
        context.font = "11px monospace";
        context.fillText("Replay frame " + (inspector.selectedFrameIndex + 1), frame.x + 18, frame.y - 10);
        context.restore();
    }

    function drawRelationalCoordinateHud(context, state) {
        const relationalState = state.relationalCoordinateState || createRelationalCoordinateState();
        context.save();
        context.fillStyle = "rgba(2,8,20,.72)";
        context.fillRect(18, 328, 300, 74);
        context.strokeStyle = relationalState.finite ? "rgba(104,231,255,.50)" : "rgba(255,105,135,.52)";
        context.strokeRect(18, 328, 300, 74);
        context.font = "12px monospace";
        context.fillStyle = "rgba(104,231,255,.94)";
        context.fillText("Relational ArcSecs", 28, 350);
        context.fillStyle = "rgba(235,250,255,.82)";
        context.fillText("r=" + formatValue(relationalState.radialArcseconds, 3) + " arcsec • p=" + formatValue(relationalState.parallaxArcseconds, 6), 28, 372);
        context.fillStyle = "rgba(159,194,215,.84)";
        context.fillText(relationalState.relationalStateKey.slice(0, 48), 28, 393);
        context.restore();
    }

    function drawEvidenceLedgerHud(context, state) {
        const ledger = state.missionEvidenceLedger || createMissionEvidenceLedger();
        context.save();
        context.fillStyle = "rgba(2,8,20,.72)";
        context.fillRect(18, 248, 300, 72);
        context.strokeStyle = ledger.ready ? "rgba(111,245,214,.55)" : "rgba(255,214,111,.38)";
        context.strokeRect(18, 248, 300, 72);
        context.font = "12px monospace";
        context.fillStyle = ledger.ready ? "rgba(111,245,214,.94)" : "rgba(255,214,111,.92)";
        context.fillText("Evidence Ledger: " + ledger.score + " • " + (ledger.ready ? "Ready" : "Collect"), 28, 270);
        context.fillStyle = "rgba(235,250,255,.82)";
        context.fillText(ledger.status.slice(0, 50), 28, 292);
        const passedRows = ledger.rows.filter(function filterRow(row) { return row.passed; }).length;
        context.fillStyle = "rgba(159,194,215,.84)";
        context.fillText("Rows passed: " + passedRows + "/" + ledger.rows.length, 28, 313);
        context.restore();
    }

    function drawTeleparallelTorsionVectorFieldOverlay(context, state) {
        if (!state.renderOptions || !state.renderOptions.showTorsionVectorField) {
            return;
        }
        context.save();
        context.globalCompositeOperation = "screen";
        const sampleStepX = 96;
        const sampleStepY = 72;
        for (let x = 48; x < 840; x += sampleStepX) {
            for (let y = 48; y < 500; y += sampleStepY) {
                const sample = sampleTeleparallelTorsionFieldAt(state, x, y);
                const vectorLength = clamp(12 + sample.torsionMagnitude * 24, 8, 44);
                const angle = Math.atan2(sample.vectorY, sample.vectorX);
                const endX = x + Math.cos(angle) * vectorLength;
                const endY = y + Math.sin(angle) * vectorLength;
                const alpha = clamp(0.12 + sample.torsionMagnitude * 0.22, 0.10, 0.68);
                context.strokeStyle = "rgba(255,105,135," + alpha.toFixed(3) + ")";
                context.lineWidth = 1.2 + sample.torsionMagnitude * 0.65;
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(endX, endY);
                context.stroke();
                context.beginPath();
                context.arc(endX, endY, 2.6, 0, TWO_PI);
                context.fillStyle = "rgba(255,105,135," + alpha.toFixed(3) + ")";
                context.fill();
            }
        }
        context.restore();
    }

    function drawRouteCurvatureInspectorOverlay(context, state) {
        if (!state.routeCurvatureInspector) {
            return;
        }
        const inspector = state.routeCurvatureInspector;
        context.save();
        context.globalCompositeOperation = "screen";
        context.strokeStyle = inspector.curvatureRisk > 72 ? "rgba(255,105,135,.80)" : "rgba(255,214,111,.64)";
        context.lineWidth = 2.2;
        context.setLineDash([8, 6]);
        context.beginPath();
        context.moveTo(state.ship.x, state.ship.y);
        context.quadraticCurveTo(
            state.ship.x + inspector.projectedDeflectionX,
            state.ship.y + inspector.projectedDeflectionY,
            inspector.projectedWaypointX,
            inspector.projectedWaypointY
        );
        context.stroke();
        context.setLineDash([]);
        context.fillStyle = "rgba(255,214,111,.88)";
        context.beginPath();
        context.arc(inspector.projectedWaypointX, inspector.projectedWaypointY, 6, 0, TWO_PI);
        context.fill();
        context.font = "11px monospace";
        context.fillStyle = "rgba(255,214,111,.92)";
        context.fillText("Curvature waypoint", inspector.projectedWaypointX + 10, inspector.projectedWaypointY - 8);
        context.restore();
    }

    function drawParsecNavigationHud(context, state) {
        const parsecState = state.parsecNavigationState || createParsecNavigationState();
        context.save();
        context.fillStyle = "rgba(2,8,20,.76)";
        context.fillRect(646, 18, 196, 92);
        context.strokeStyle = "rgba(111,245,214,.50)";
        context.strokeRect(646, 18, 196, 92);
        context.font = "11px monospace";
        context.fillStyle = "rgba(111,245,214,.94)";
        context.fillText("Parsec Nav", 656, 39);
        context.fillStyle = "rgba(235,250,255,.82)";
        context.fillText("Beacon " + formatParsecDistance(parsecState.relationalParsecsToBeacon), 656, 59);
        context.fillText("Speed " + parsecState.parsecVelocity.slice(0, 24), 656, 78);
        context.fillStyle = "rgba(159,194,215,.84)";
        context.fillText("Arcsec Δ " + formatValue(parsecState.relationalArcsecsDelta, 2), 656, 97);
        context.restore();
    }

    function drawWavefrontTrackerPanel(context, state) {
        const tracker = state.wavefrontTrackerState || createWavefrontTrackerState();
        context.save();
        context.fillStyle = "rgba(2,8,20,.76)";
        context.fillRect(646, 120, 196, 82);
        context.strokeStyle = "rgba(255,214,111,.45)";
        context.strokeRect(646, 120, 196, 82);
        context.font = "11px monospace";
        context.fillStyle = "rgba(255,214,111,.94)";
        context.fillText("Wavefront Tracker", 656, 141);
        context.fillStyle = "rgba(235,250,255,.82)";
        context.fillText("G η " + tracker.gravityWaveEta, 656, 160);
        context.fillText("γ η " + tracker.photonEta, 656, 178);
        context.fillStyle = "rgba(159,194,215,.84)";
        context.fillText("LOS density " + formatValue(tracker.lineOfSightDensityIntegral, 3), 656, 196);
        context.restore();
    }

    function drawRoutePreviewOverlay(context, state) {
        const target = getActiveNavigationTarget(state);
        context.save();
        context.globalCompositeOperation = "screen";
        context.strokeStyle = "rgba(111,245,214,.46)";
        context.lineWidth = 1.5;
        context.setLineDash([8, 8]);
        context.beginPath();
        context.moveTo(state.ship.x, state.ship.y);
        context.lineTo(target.active ? target.x : state.beacon.x, target.active ? target.y : state.beacon.y);
        context.stroke();
        context.setLineDash([]);
        context.strokeStyle = "rgba(255,255,255,.60)";
        context.beginPath();
        context.moveTo(state.ship.x, state.ship.y);
        context.lineTo(state.ship.x + Math.cos(state.ship.headingRadians) * 54, state.ship.y + Math.sin(state.ship.headingRadians) * 54);
        context.stroke();
        context.strokeStyle = "rgba(255,105,135,.55)";
        context.beginPath();
        context.moveTo(state.ship.x, state.ship.y);
        context.lineTo(state.ship.x + state.ship.velocityX * 42, state.ship.y + state.ship.velocityY * 42);
        context.stroke();
        if (state.input.tapTargetActive) {
            context.strokeStyle = "rgba(111,245,214,.80)";
            context.beginPath();
            context.arc(state.input.tapTargetX, state.input.tapTargetY, 12, 0, TWO_PI);
            context.stroke();
        }
        context.restore();
    }

    function drawDistanceSpeedScaleHud(context, state) {
        const scale = state.distanceSpeedScaleState || createDistanceSpeedScaleState();
        context.save();
        context.fillStyle = "rgba(2,8,20,.74)";
        context.fillRect(332, 110, 300, 92);
        context.strokeStyle = scale.finite ? "rgba(111,245,214,.50)" : "rgba(255,105,135,.52)";
        context.strokeRect(332, 110, 300, 92);
        context.font = "12px monospace";
        context.fillStyle = "rgba(111,245,214,.94)";
        context.fillText("Cosmic Scale", 342, 132);
        context.fillStyle = "rgba(235,250,255,.82)";
        context.fillText("dist=" + formatValue(scale.distanceToBeaconGigaparsecs, 3) + " Gpc", 342, 154);
        context.fillText("speed=" + formatValue(scale.speedGigaparsecsPerHour, 6) + " Gpc/hr", 342, 176);
        context.fillStyle = "rgba(159,194,215,.84)";
        context.fillText(scale.scaleMode.slice(0, 38), 342, 195);
        context.restore();
    }

    function drawTeleparallelTorsionHud(context, state) {
        const torsion = state.teleparallelTorsionFieldState || createTeleparallelTorsionFieldState();
        const route = state.routeCurvatureInspector || createRouteCurvatureInspector();
        context.save();
        context.fillStyle = "rgba(2,8,20,.72)";
        context.fillRect(332, 18, 300, 84);
        context.strokeStyle = route.curvatureRisk > 72 ? "rgba(255,105,135,.60)" : "rgba(255,105,135,.40)";
        context.strokeRect(332, 18, 300, 84);
        context.font = "12px monospace";
        context.fillStyle = "rgba(255,105,135,.94)";
        context.fillText("Teleparallel Torsion Field", 342, 40);
        context.fillStyle = "rgba(235,250,255,.82)";
        context.fillText("magnitude=" + formatValue(torsion.torsionMagnitude, 3) + " curl=" + formatValue(torsion.torsionCurl, 3), 342, 62);
        context.fillStyle = "rgba(159,194,215,.84)";
        context.fillText("curvature=" + formatValue(torsion.routeCurvature, 3) + " risk=" + formatValue(route.curvatureRisk, 1), 342, 83);
        context.restore();
    }

    function drawDynamicProcaFieldOverlay(context, state) {
        if (!state.renderOptions || !state.renderOptions.showDynamicProcaField) {
            return;
        }
        context.save();
        context.globalCompositeOperation = "screen";
        const sampleStepX = 86;
        const sampleStepY = 65;
        for (let x = 43; x < 840; x += sampleStepX) {
            for (let y = 42; y < 500; y += sampleStepY) {
                const sample = sampleDynamicProcaFieldAt(state, x, y);
                const radius = 5 + sample.fieldDensity * 7;
                const alpha = clamp(0.08 + sample.fieldDensity * 0.16, 0.06, 0.42);
                context.fillStyle = "rgba(104,231,255," + alpha.toFixed(3) + ")";
                context.beginPath();
                context.arc(x, y, radius, 0, TWO_PI);
                context.fill();
                context.strokeStyle = "rgba(255,214,111," + clamp(sample.gradientMagnitude * 0.26, 0.04, 0.38).toFixed(3) + ")";
                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(x + sample.gradientX * 18, y + sample.gradientY * 18);
                context.stroke();
            }
        }
        context.restore();
    }

    function drawPsfLensingOverlay(context, state) {
        if (!state.renderOptions || !state.renderOptions.showPsfLensing) {
            return;
        }
        const psf = state.psfLensingState || createPsfLensingState();
        const proca = state.dynamicProcaFieldState || createDynamicProcaFieldState();
        const event = getActiveMultiMessengerEvent(state);
        const centerX = event ? event.sourceX : state.ship.x;
        const centerY = event ? event.sourceY : state.ship.y;
        context.save();
        context.globalCompositeOperation = "screen";
        const blurRadius = clamp(psf.psfBlurRadius, 1, 30);
        const arcRadius = 28 + psf.lensingArcStrength * 24;
        context.strokeStyle = "rgba(255,150,88,.62)";
        context.lineWidth = clamp(1.4 + psf.lensingArcStrength, 1.4, 5);
        context.beginPath();
        context.arc(centerX, centerY, arcRadius, -0.65, 0.95);
        context.stroke();
        context.strokeStyle = "rgba(104,231,255,.36)";
        context.beginPath();
        context.arc(centerX + proca.gradientX * 20, centerY + proca.gradientY * 20, arcRadius + blurRadius, 2.35, 4.05);
        context.stroke();
        const gradient = context.createRadialGradient(centerX, centerY, 1, centerX, centerY, blurRadius * 2.6);
        gradient.addColorStop(0, "rgba(255,255,255,.34)");
        gradient.addColorStop(0.48, "rgba(255,150,88,.14)");
        gradient.addColorStop(1, "rgba(255,150,88,0)");
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(centerX, centerY, blurRadius * 2.6, 0, TWO_PI);
        context.fill();
        context.fillStyle = "rgba(255,214,111,.92)";
        context.font = "11px monospace";
        context.fillText("PSF " + formatValue(psf.psfBlurRadius, 1) + "px • lens " + formatValue(psf.lensingDeflectionArcseconds, 1) + " arcsec", centerX + 18, centerY + 42);
        context.restore();
    }

    function drawDynamicProcaHud(context, state) {
        const proca = state.dynamicProcaFieldState || createDynamicProcaFieldState();
        const psf = state.psfLensingState || createPsfLensingState();
        context.save();
        context.fillStyle = "rgba(2,8,20,.72)";
        context.fillRect(18, 410, 300, 80);
        context.strokeStyle = proca.finite && psf.finite ? "rgba(255,150,88,.50)" : "rgba(255,105,135,.52)";
        context.strokeRect(18, 410, 300, 80);
        context.font = "12px monospace";
        context.fillStyle = "rgba(255,150,88,.94)";
        context.fillText("Dynamic Proca + PSF", 28, 432);
        context.fillStyle = "rgba(235,250,255,.82)";
        context.fillText("density=" + formatValue(proca.fieldDensity, 3) + " gradient=" + formatValue(proca.gradientMagnitude, 3), 28, 454);
        context.fillStyle = "rgba(159,194,215,.84)";
        context.fillText("blur=" + formatValue(psf.psfBlurRadius, 2) + " lens=" + formatValue(psf.lensingDeflectionArcseconds, 2), 28, 475);
        context.restore();
    }

    function drawMissionChallengeRings(context, state) {
        const rings = [
            { label: "Dense", x: 285, y: 165, color: "rgba(255,214,111,.58)" },
            { label: "Void", x: 690, y: 250, color: "rgba(111,245,214,.48)" },
            { label: "Torsion", x: 510, y: 210, color: "rgba(255,105,135,.48)" },
            { label: "Signal", x: 560, y: 255, color: "rgba(255,150,88,.52)" },
            { label: "Beacon", x: 760, y: 215, color: "rgba(255,255,255,.52)" }
        ];
        context.save();
        context.globalCompositeOperation = "screen";
        context.font = "11px monospace";
        rings.forEach(function drawRing(ring, index) {
            const pulse = 5 + Math.sin(state.elapsedSeconds * 2.5 + index) * 2;
            context.strokeStyle = ring.color;
            context.lineWidth = 1.6;
            context.setLineDash([6, 6]);
            context.beginPath();
            context.arc(ring.x, ring.y, 22 + pulse, 0, TWO_PI);
            context.stroke();
            context.setLineDash([]);
            context.fillStyle = ring.color;
            context.fillText(ring.label, ring.x + 22, ring.y + 4);
        });
        context.restore();
    }

    function drawMissionReplayExportViewerOverlay(context, state) {
        const viewer = state.missionReplayExportViewer || createMissionReplayExportViewerState();
        if (!viewer.loaded || viewer.replayFrames.length < 1) {
            return;
        }
        context.save();
        context.globalCompositeOperation = "screen";
        context.strokeStyle = "rgba(255,214,111,.42)";
        context.lineWidth = 1.5;
        context.beginPath();
        for (let index = 0; index < viewer.replayFrames.length; index += 1) {
            const frame = viewer.replayFrames[index];
            if (index === 0) {
                context.moveTo(frame.x, frame.y);
            } else {
                context.lineTo(frame.x, frame.y);
            }
        }
        context.stroke();
        if (viewer.selectedFrame) {
            context.fillStyle = "rgba(255,214,111,.95)";
            context.strokeStyle = "rgba(255,255,255,.85)";
            context.lineWidth = 2;
            context.beginPath();
            context.arc(viewer.selectedFrame.x, viewer.selectedFrame.y, 8, 0, TWO_PI);
            context.fill();
            context.stroke();
            context.font = "11px monospace";
            context.fillStyle = "rgba(255,214,111,.96)";
            context.fillText("Replay frame " + (viewer.selectedFrameIndex + 1) + "/" + viewer.frameCount, viewer.selectedFrame.x + 12, viewer.selectedFrame.y - 12);
        }
        context.fillStyle = "rgba(2,8,20,.76)";
        context.fillRect(646, 212, 196, 82);
        context.strokeStyle = viewer.validationPassed ? "rgba(111,245,214,.50)" : "rgba(255,105,135,.52)";
        context.strokeRect(646, 212, 196, 82);
        context.font = "11px monospace";
        context.fillStyle = viewer.validationPassed ? "rgba(111,245,214,.94)" : "rgba(255,105,135,.94)";
        context.fillText("Replay Export Viewer", 656, 233);
        context.fillStyle = "rgba(235,250,255,.82)";
        context.fillText("Frames " + viewer.frameCount + " • " + (viewer.selectedFrameIndex + 1), 656, 252);
        context.fillStyle = "rgba(159,194,215,.84)";
        context.fillText((viewer.scenarioName || "Imported replay").slice(0, 25), 656, 271);
        context.restore();
    }

    function drawMissionReplayTrail(context, state) {
        const trail = Array.isArray(state.missionReplayTrail) ? state.missionReplayTrail : [];
        if (trail.length < 2) {
            return;
        }
        context.save();
        context.globalCompositeOperation = "screen";
        for (let index = 1; index < trail.length; index += 1) {
            const previousFrame = trail[index - 1];
            const frame = trail[index];
            const alpha = clamp(index / trail.length, 0.12, 0.82);
            context.strokeStyle = "rgba(104,231,255," + alpha.toFixed(3) + ")";
            context.lineWidth = frame.reason === "checkpoint" ? 3 : 1.4;
            context.beginPath();
            context.moveTo(previousFrame.x, previousFrame.y);
            context.lineTo(frame.x, frame.y);
            context.stroke();
        }
        const latest = trail[trail.length - 1];
        context.fillStyle = "rgba(104,231,255,.86)";
        context.beginPath();
        context.arc(latest.x, latest.y, 4, 0, TWO_PI);
        context.fill();
        context.restore();
    }

    function drawMissionChallengeHud(context, state) {
        const challenge = state.missionChallengeState || createMissionChallengeState();
        context.save();
        context.fillStyle = "rgba(2,8,20,.72)";
        context.fillRect(18, 168, 300, 72);
        context.strokeStyle = challenge.passed ? "rgba(111,245,214,.55)" : "rgba(104,231,255,.38)";
        context.strokeRect(18, 168, 300, 72);
        context.font = "12px monospace";
        context.fillStyle = challenge.passed ? "rgba(111,245,214,.94)" : "rgba(104,231,255,.92)";
        context.fillText("Challenge: " + challenge.score + " • " + challenge.rank, 28, 190);
        context.fillStyle = "rgba(235,250,255,.82)";
        context.fillText(challenge.status.slice(0, 50), 28, 212);
        context.fillStyle = "rgba(159,194,215,.84)";
        context.fillText("Replay frames: " + challenge.replayFrames, 28, 233);
        context.restore();
    }

    function drawMissionObjectiveHud(context, state) {
        const scorecard = state.missionObjectiveScorecard || createMissionObjectiveScorecard();
        context.save();
        context.fillStyle = "rgba(2,8,20,.72)";
        context.fillRect(18, 86, 300, 74);
        context.strokeStyle = scorecard.passed ? "rgba(111,245,214,.55)" : "rgba(255,214,111,.45)";
        context.strokeRect(18, 86, 300, 74);
        context.font = "12px monospace";
        context.fillStyle = scorecard.passed ? "rgba(111,245,214,.95)" : "rgba(255,214,111,.95)";
        context.fillText("Mission Objective Score: " + scorecard.score + " • " + scorecard.rank, 28, 108);
        context.fillStyle = "rgba(235,250,255,.82)";
        context.fillText(scorecard.primaryObjective.slice(0, 45), 28, 130);
        context.fillStyle = "rgba(159,194,215,.86)";
        context.fillText(scorecard.activeObjective.slice(0, 48), 28, 151);
        context.restore();
    }

    function drawMissionDemoDirectorOverlay(context, state) {
        if (!state.demoDirector || state.demoDirector.selectedDemoKey === "free-flight") {
            return;
        }
        const director = state.demoDirector;
        context.save();
        context.globalCompositeOperation = "screen";
        context.strokeStyle = director.active ? "rgba(255,214,111,.78)" : "rgba(111,245,214,.52)";
        context.lineWidth = 2.4;
        context.setLineDash([8, 7]);
        context.beginPath();
        context.moveTo(state.ship.x, state.ship.y);
        context.lineTo(director.targetX, director.targetY);
        context.stroke();
        context.setLineDash([]);

        context.fillStyle = director.completed ? "rgba(111,245,214,.90)" : "rgba(255,214,111,.92)";
        context.beginPath();
        context.arc(director.targetX, director.targetY, 11 + Math.sin(state.elapsedSeconds * 5) * 2, 0, TWO_PI);
        context.fill();

        context.fillStyle = "rgba(2,8,20,.78)";
        context.fillRect(18, 18, 300, 60);
        context.strokeStyle = "rgba(255,214,111,.45)";
        context.strokeRect(18, 18, 300, 60);
        context.font = "12px monospace";
        context.fillStyle = "rgba(255,214,111,.94)";
        context.fillText("Guided Demo: " + director.selectedDemoLabel, 28, 40);
        context.fillStyle = "rgba(235,250,255,.80)";
        context.fillText(director.status.slice(0, 46), 28, 61);
        context.restore();
    }

    function drawWavefronts(context, state) {
        const event = getActiveMultiMessengerEvent(state);
        if (!event) {
            return;
        }
        const gravityWavefront = event.gravityWavefront;
        const photonWavefront = event.photonWavefront;

        context.save();
        context.globalCompositeOperation = "screen";

        context.strokeStyle = "rgba(111,245,214,.86)";
        context.lineWidth = 2.2;
        context.setLineDash([10, 8]);
        context.beginPath();
        context.arc(event.sourceX, event.sourceY, gravityWavefront.radius, 0, TWO_PI);
        context.stroke();

        const photonAlpha = clamp(0.18 + photonWavefront.photonEnergy * 0.62, 0.08, 0.82);
        const redComponent = Math.round(255);
        const greenComponent = Math.round(80 + photonWavefront.photonEnergy * 120);
        context.strokeStyle = "rgba(" + redComponent + "," + greenComponent + ",88," + photonAlpha.toFixed(3) + ")";
        context.lineWidth = 3;
        context.setLineDash([]);
        context.beginPath();
        context.arc(event.sourceX, event.sourceY, photonWavefront.radius, 0, TWO_PI);
        context.stroke();

        context.fillStyle = "rgba(255,255,255,.94)";
        context.beginPath();
        context.arc(event.sourceX, event.sourceY, 5, 0, TWO_PI);
        context.fill();

        context.font = "12px monospace";
        context.fillStyle = "rgba(111,245,214,.92)";
        context.fillText("GravityWavefront", event.sourceX + 10, event.sourceY - 10);
        context.fillStyle = "rgba(255,150,88,.90)";
        context.fillText("PhotonWavefront", event.sourceX + 10, event.sourceY + 10);

        if (!photonWavefront.visible) {
            context.fillStyle = "rgba(255,105,135,.90)";
            context.fillText("Photon counterpart below threshold", event.sourceX - 86, event.sourceY + 30);
        }

        context.restore();
    }

    function drawShip(context, state) {
        const ship = state.ship;
        const pulse = 0.7 + Math.sin(state.elapsedSeconds * 5) * 0.18;
        context.save();
        context.translate(ship.x, ship.y);
        context.rotate(ship.headingRadians);
        context.fillStyle = "rgba(255,214,111," + pulse.toFixed(3) + ")";
        context.strokeStyle = "rgba(255,255,255,.88)";
        context.lineWidth = 1.4;
        context.beginPath();
        context.moveTo(17, 0);
        context.lineTo(-12, -10);
        context.lineTo(-7, 0);
        context.lineTo(-12, 10);
        context.closePath();
        context.fill();
        context.stroke();

        if (state.input.thrust) {
            context.strokeStyle = "rgba(111,245,214,.58)";
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(-12, 0);
            context.lineTo(-32 - Math.sin(state.elapsedSeconds * 18) * 9, 0);
            context.stroke();
        }

        if (state.input.scoop) {
            context.strokeStyle = "rgba(104,231,255,.48)";
            context.lineWidth = 1.2;
            context.beginPath();
            context.arc(4, 0, 30 + Math.sin(state.elapsedSeconds * 4) * 2, -0.8, 0.8);
            context.stroke();
        }

        context.restore();
    }

    function drawMission(context, state, width, height) {
        context.clearRect(0, 0, width, height);

        context.fillStyle = "rgba(2,7,17,1)";
        context.fillRect(0, 0, width, height);

        for (let starIndex = 0; starIndex < 90; starIndex += 1) {
            const x = (starIndex * 73 + state.seed * 11) % width;
            const y = (starIndex * 47 + state.seed * 17) % height;
            const alpha = 0.18 + ((starIndex % 7) * 0.08);
            context.fillStyle = "rgba(190,245,255," + alpha.toFixed(2) + ")";
            context.fillRect(x, y, starIndex % 5 === 0 ? 2 : 1, 1);
        }

        drawDynamicProcaFieldOverlay(context, state);
        drawTeleparallelTorsionVectorFieldOverlay(context, state);

        state.regions.forEach(function drawEachRegion(region) {
            drawRegion(context, region);
        });

        context.strokeStyle = "rgba(111,245,214,.42)";
        context.lineWidth = 2;
        context.setLineDash([7, 8]);
        context.beginPath();
        context.moveTo(state.ship.x, state.ship.y);
        context.quadraticCurveTo(420, 235, state.beacon.x, state.beacon.y);
        context.stroke();
        context.setLineDash([]);

        context.fillStyle = "rgba(255,255,255,.95)";
        context.strokeStyle = "rgba(255,214,111,.76)";
        context.lineWidth = 2;
        context.beginPath();
        context.arc(state.beacon.x, state.beacon.y, state.beacon.radius, 0, TWO_PI);
        context.stroke();
        context.fillText("Destination Beacon", state.beacon.x - 48, state.beacon.y - state.beacon.radius - 10);

        drawMissionChallengeRings(context, state);
        drawMissionReplayTrail(context, state);
        drawMissionReplayExportViewerOverlay(context, state);
        drawReplayInspectorMarker(context, state);
        drawMissionObjectiveHud(context, state);
        drawMissionChallengeHud(context, state);
        drawEvidenceLedgerHud(context, state);
        drawRelationalCoordinateHud(context, state);
        drawDynamicProcaHud(context, state);
        drawDistanceSpeedScaleHud(context, state);
        drawParsecNavigationHud(context, state);
        drawWavefrontTrackerPanel(context, state);
        drawTeleparallelTorsionHud(context, state);
        drawMissionDemoDirectorOverlay(context, state);
        drawWavefronts(context, state);
        drawPsfLensingOverlay(context, state);
        drawRouteCurvatureInspectorOverlay(context, state);
        drawRoutePreviewOverlay(context, state);
        drawShip(context, state);

        context.fillStyle = "rgba(255,214,111,.9)";
        context.font = "12px monospace";
        context.fillText(state.telemetry.routeAdvice.slice(0, 132), 18, height - 18);
    }

    function updateTelemetryPanel(root, state) {
        const values = {
            fuel: formatValue(state.ship.fuelCharge, 1) + "%",
            thermal: formatValue(state.ship.thermalLoad, 1) + "%",
            torsion: formatValue(state.telemetry.torsionPull, 3),
            drag: formatValue(state.telemetry.weberDrag, 4),
            density: formatValue(state.telemetry.substrateDensity, 3),
            lag: formatValue(state.telemetry.opticalLag, 3),
            arcseconds: formatValue(state.telemetry.arcsecondsToBeacon, 1),
            score: formatValue(state.ship.missionScore, 1),
            gravityArrival: state.wavefrontTelemetry.gravityArrivalTick === null ? "Pending" : String(state.wavefrontTelemetry.gravityArrivalTick),
            photonArrival: state.wavefrontTelemetry.photonArrivalTick === null ? "Pending" : String(state.wavefrontTelemetry.photonArrivalTick),
            photonDelay: formatValue(state.wavefrontTelemetry.photonDelay, 0) + " ticks",
            photonEnergy: formatValue(state.wavefrontTelemetry.photonEnergy, 3),
            refractiveIndex: formatValue(state.wavefrontTelemetry.substrateRefractiveIndex, 3),
            visibility: state.wavefrontTelemetry.visibilityThresholdStatus,
            messenger: state.wavefrontTelemetry.multiMessengerStatus,
            demo: state.demoDirector ? state.demoDirector.status : "Manual free flight.",
            objectiveScore: state.missionObjectiveScorecard ? String(state.missionObjectiveScorecard.score) + " • " + state.missionObjectiveScorecard.rank : "0 • Ready",
            objectivePrimary: state.missionObjectiveScorecard ? state.missionObjectiveScorecard.primaryObjective : "Select a guided demo.",
            objectiveActive: state.missionObjectiveScorecard ? state.missionObjectiveScorecard.activeObjective : "No active objective yet.",
            challengeScore: state.missionChallengeState ? String(state.missionChallengeState.score) + " • " + state.missionChallengeState.rank : "0 • Ready",
            challengeAchievements: state.missionChallengeState && state.missionChallengeState.achievements.length > 0 ? state.missionChallengeState.achievements.join(", ") : "No achievements yet.",
            replayFrames: state.missionReplayTrail ? String(state.missionReplayTrail.length) : "0",
            evidenceScore: state.missionEvidenceLedger ? String(state.missionEvidenceLedger.score) + " • " + (state.missionEvidenceLedger.ready ? "Ready" : "Collect") : "0 • Collect",
            evidenceStatus: state.missionEvidenceLedger ? state.missionEvidenceLedger.status : "Evidence ledger ready.",
            replayInspector: state.missionReplayInspector ? state.missionReplayInspector.status : "Replay inspector ready.",
            relationalArcseconds: state.relationalCoordinateState ? formatValue(state.relationalCoordinateState.radialArcseconds, 3) : "0.000",
            parallaxArcseconds: state.relationalCoordinateState ? formatValue(state.relationalCoordinateState.parallaxArcseconds, 6) : "0.000000",
            parsecEquivalent: state.relationalCoordinateState ? formatValue(state.relationalCoordinateState.parsecEquivalent, 3) : "0.000",
            properMotion: state.relationalCoordinateState ? formatValue(state.relationalCoordinateState.properMotionArcsecPerTick, 6) : "0.000000",
            relationalStateKey: state.relationalCoordinateState ? state.relationalCoordinateState.relationalStateKey : "arcsec:0.000:0.000",
            procaFieldDensity: state.dynamicProcaFieldState ? formatValue(state.dynamicProcaFieldState.fieldDensity, 3) : "0.000",
            procaGradient: state.dynamicProcaFieldState ? formatValue(state.dynamicProcaFieldState.gradientMagnitude, 3) : "0.000",
            procaFieldEnergy: state.dynamicProcaFieldState ? formatValue(state.dynamicProcaFieldState.fieldEnergy, 3) : "0.000",
            psfBlur: state.psfLensingState ? formatValue(state.psfLensingState.psfBlurRadius, 2) : "0.00",
            lensingDeflection: state.psfLensingState ? formatValue(state.psfLensingState.lensingDeflectionArcseconds, 2) : "0.00",
            opticalTurbulence: state.psfLensingState ? formatValue(state.psfLensingState.opticalTurbulence, 3) : "0.000",
            lensingStatus: state.psfLensingState ? state.psfLensingState.lensingStatus : "PSF/lensing visualization ready.",
            torsionVectorMagnitude: state.teleparallelTorsionFieldState ? formatValue(state.teleparallelTorsionFieldState.torsionMagnitude, 3) : "0.000",
            torsionCurl: state.teleparallelTorsionFieldState ? formatValue(state.teleparallelTorsionFieldState.torsionCurl, 3) : "0.000",
            routeCurvature: state.teleparallelTorsionFieldState ? formatValue(state.teleparallelTorsionFieldState.routeCurvature, 3) : "0.000",
            curvatureRadius: state.teleparallelTorsionFieldState ? formatValue(state.teleparallelTorsionFieldState.curvatureRadius, 1) : "0.0",
            curvatureRisk: state.routeCurvatureInspector ? formatValue(state.routeCurvatureInspector.curvatureRisk, 1) : "0.0",
            curvatureStatus: state.routeCurvatureInspector ? state.routeCurvatureInspector.curvatureStatus : "Route curvature inspector ready.",
            viewportScale: state.distanceSpeedScaleState ? formatValue(state.distanceSpeedScaleState.viewportWidthGigaparsecs, 1) + " × " + formatValue(state.distanceSpeedScaleState.viewportHeightGigaparsecs, 1) + " Gpc" : "9.2 × 5.6 Gpc",
            distanceGpc: state.distanceSpeedScaleState ? formatValue(state.distanceSpeedScaleState.distanceToBeaconGigaparsecs, 3) : "0.000",
            speedGpcHour: state.distanceSpeedScaleState ? formatValue(state.distanceSpeedScaleState.speedGigaparsecsPerHour, 6) : "0.000000",
            speedParsecHour: state.distanceSpeedScaleState ? formatValue(state.distanceSpeedScaleState.speedParsecsPerHour, 1) : "0.0",
            speedLightYearHour: state.distanceSpeedScaleState ? formatValue(state.distanceSpeedScaleState.speedLightYearsPerHour, 1) : "0.0",
            scaleStatus: state.distanceSpeedScaleState ? state.distanceSpeedScaleState.scaleStatus : "Cosmic scale telemetry ready.",
            propulsionMode: state.propulsionModeState ? state.propulsionModeState.modeLabel : "Inertial Coast",
            propulsionFuelModel: state.propulsionModeState ? state.propulsionModeState.propulsionFuelModel : "balanced inertial baseline",
            propulsionEfficiency: state.propulsionModeState ? formatValue(state.propulsionModeState.propulsionModeEfficiency * 100, 1) + "%" : "0.0%",
            propulsionRisk: state.propulsionModeState ? formatValue(state.propulsionModeState.propulsionModeRisk * 100, 1) + "%" : "0.0%",
            propulsionEvidence: state.propulsionModeState ? state.propulsionModeState.propulsionModeEvidence : "No propulsion mode state available.",
            arcsecsToBeaconNative: state.parsecNavigationState ? formatValue(state.parsecNavigationState.relationalArcsecsDelta, 3) : "0.000",
            parsecsToBeaconNative: state.parsecNavigationState ? formatParsecDistance(state.parsecNavigationState.relationalParsecsToBeacon) : "0.000 pc",
            parsecVelocityNative: state.parsecNavigationState ? state.parsecNavigationState.parsecVelocity : "0.000 pc/sim hr",
            parsecsPerTick: state.parsecNavigationState ? formatParsecDistance(state.parsecNavigationState.parsecsPerMissionTick) + "/tick" : "0.000 pc/tick",
            kmSecondEquivalent: state.parsecNavigationState ? formatValue(state.parsecNavigationState.kmPerSecondEquivalent, 2) + " km/s legacy helper" : "0.00 km/s legacy helper",
            currentRegionArea: state.regionSurfaceDensityState ? formatValue(state.regionSurfaceDensityState.currentRegionAreaSquareParsecs, 1) + " sq pc" : "0 sq pc",
            densityPerSquareParsec: state.regionSurfaceDensityState ? formatValue(state.regionSurfaceDensityState.currentRegionDensityPerSquareParsec, 9) + "/sq pc" : "0/sq pc",
            routeAreaCrossed: state.regionSurfaceDensityState ? formatValue(state.regionSurfaceDensityState.routeAreaCrossedSquareParsecs, 1) + " sq pc" : "0 sq pc",
            routeMix: state.routeComparisonState ? "Dense " + formatValue(state.routeComparisonState.densePercent, 0) + "% • Void " + formatValue(state.routeComparisonState.voidPercent, 0) + "% • Torsion " + formatValue(state.routeComparisonState.torsionPercent, 0) + "%" : "No route mix yet.",
            wavefrontTracker: state.wavefrontTrackerState ? state.wavefrontTrackerState.trackerStatus : "Trigger a signal event.",
            gravityEta: state.wavefrontTrackerState ? state.wavefrontTrackerState.gravityWaveEta : "No signal",
            photonEtaNative: state.wavefrontTrackerState ? state.wavefrontTrackerState.photonEta : "No signal",
            lineOfSightDensity: state.wavefrontTrackerState ? formatValue(state.wavefrontTrackerState.lineOfSightDensityIntegral, 3) : "0.000",
            routeAdvisorMessage: state.routeAdvisorState ? state.routeAdvisorState.advisorMessage : state.telemetry.routeAdvice,
            bestNextAction: state.routeAdvisorState ? state.routeAdvisorState.bestNextAction : "Start moving.",
            missionOutcome: state.missionOutcomeState ? state.missionOutcomeState.missionOutcome : "Ready",
            calibrationProfile: state.missionCalibrationState ? state.missionCalibrationState.calibrationProfile : "Default ArcSecs parsec mission calibration",
            calibrationViewport: state.missionCalibrationState ? formatValue(state.missionCalibrationState.viewportWidthGigaparsecs, 2) + " × " + formatValue(state.missionCalibrationState.viewportHeightGigaparsecs, 2) + " Gpc" : "9.20 × 5.60 Gpc",
            calibrationTickHours: state.missionCalibrationState ? formatValue(state.missionCalibrationState.simulatedHoursPerTick, 5) + " hr/tick" : "0.01667 hr/tick",
            calibrationBeaconScale: state.missionCalibrationState ? "×" + formatValue(state.missionCalibrationState.beaconDistanceScale, 2) : "×1.00",
            calibrationDensityStrength: state.missionCalibrationState ? "×" + formatValue(state.missionCalibrationState.densityStrength, 2) : "×1.00",
            calibrationSpeedCompression: state.missionCalibrationState ? "×" + formatValue(state.missionCalibrationState.speedCompression, 2) : "×1.00",
            calibrationEvidence: state.missionCalibrationState ? state.missionCalibrationState.calibrationEvidence : "Default calibration active.",
            replayViewerStatus: state.missionReplayExportViewer ? state.missionReplayExportViewer.replayStatus : "No export loaded.",
            replayViewerFrames: state.missionReplayExportViewer ? String(state.missionReplayExportViewer.frameCount) : "0",
            replayViewerFrame: state.missionReplayExportViewer && state.missionReplayExportViewer.selectedFrameIndex >= 0 ? String(state.missionReplayExportViewer.selectedFrameIndex + 1) + " / " + String(state.missionReplayExportViewer.frameCount) : "None",
            replayViewerScenario: state.missionReplayExportViewer ? state.missionReplayExportViewer.scenarioName : "",
            replayViewerValidation: state.missionReplayExportViewer ? (state.missionReplayExportViewer.validationPassed ? "Valid replay export" : state.missionReplayExportViewer.validationErrors.join(" | ")) : "No validation yet.",
            replayViewerFalsification: state.missionReplayExportViewer && state.missionReplayExportViewer.falsificationNotes.length > 0 ? state.missionReplayExportViewer.falsificationNotes[0] : "No replay falsification note loaded.",
            region: state.telemetry.localRegionLabel,
            advice: state.telemetry.routeAdvice,
            status: state.running ? "Running" : "Paused"
        };

        Object.keys(values).forEach(function updateValue(key) {
            const element = root.querySelector("[data-arcsecs-space-value='" + key + "']");
            if (element) {
                element.textContent = values[key];
            }
        });
    }

    function setButtonState(root, state) {
        const toggles = [
            { action: "scoop", active: state.input.scoop },
            { action: "assist", active: state.input.inertialAssist },
            { action: "autopilot", active: state.input.autopilotToBeacon },
            { action: "fieldOverlay", active: state.renderOptions && state.renderOptions.showDynamicProcaField },
            { action: "psfOverlay", active: state.renderOptions && state.renderOptions.showPsfLensing },
            { action: "torsionOverlay", active: state.renderOptions && state.renderOptions.showTorsionVectorField },
            { action: "start", active: state.running }
        ];
        toggles.forEach(function updateToggle(toggle) {
            const button = root.querySelector("[data-arcsecs-space-action='" + toggle.action + "']");
            if (button) {
                button.classList.toggle("is-active", toggle.active);
            }
        });
    }

    function downloadJson(filename, payload) {
        const documentRef = globalScope.document;
        if (!documentRef) {
            return;
        }
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = documentRef.createElement("a");
        link.href = url;
        link.download = filename;
        documentRef.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    function createController(root) {
        const canvas = root.querySelector("[data-arcsecs-space-canvas]");
        const context = canvas ? canvas.getContext("2d") : null;
        const state = createInitialState(5810);
        let animationFrame = 0;
        let lastTimestamp = 0;

        function resizeCanvas() {
            if (!canvas || !context) {
                return;
            }
            const bounds = canvas.getBoundingClientRect();
            const scale = Math.max(1, Math.min(2, globalScope.devicePixelRatio || 1));
            canvas.width = Math.max(860, Math.round(bounds.width * scale));
            canvas.height = Math.max(520, Math.round(bounds.height * scale));
            context.setTransform(canvas.width / 860, 0, 0, canvas.height / 520, 0, 0);
        }

        if (canvas) {
            canvas.addEventListener("pointerdown", function selectCanvasTarget(event) {
                const bounds = canvas.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / Math.max(1, bounds.width) * VIEWPORT_WIDTH_PIXELS;
                const y = (event.clientY - bounds.top) / Math.max(1, bounds.height) * VIEWPORT_HEIGHT_PIXELS;
                setTapTarget(state, x, y);
            });
        }

        function render() {
            if (context) {
                drawMission(context, state, 860, 520);
            }
            updateTelemetryPanel(root, state);
            setButtonState(root, state);
        }

        function loop(timestamp) {
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }
            const deltaSeconds = clamp((timestamp - lastTimestamp) / 1000, FRAME_SECONDS, 0.05);
            lastTimestamp = timestamp;
            if (state.missionReplayExportViewer && state.missionReplayExportViewer.playbackActive) {
                stepMissionReplayExportViewer(state, deltaSeconds);
            } else if (state.running) {
                stepMissionState(state, deltaSeconds);
            }
            render();
            animationFrame = globalScope.requestAnimationFrame(loop);
        }

        function setHoldAction(action, active) {
            if (action === "thrust") {
                state.input.thrust = active;
            } else if (action === "brake") {
                state.input.brake = active;
            } else if (action === "left") {
                state.input.turnLeft = active;
            } else if (action === "right") {
                state.input.turnRight = active;
            }
        }

        function readCalibrationInput(name, fallback) {
            const input = root.querySelector("[data-arcsecs-space-calibration='" + name + "']");
            if (!input) {
                return fallback;
            }
            return finiteNumber(parseFloat(input.value), fallback);
        }

        function syncCalibrationInputs(calibrationState) {
            const calibration = calibrationState || state.missionCalibrationState || createMissionCalibrationState();
            const mapping = {
                viewportScale: calibration.viewportWidthGigaparsecs,
                simulatedHoursPerTick: calibration.simulatedHoursPerTick,
                beaconDistanceScale: calibration.beaconDistanceScale,
                densityStrength: calibration.densityStrength,
                speedCompression: calibration.speedCompression
            };
            Object.keys(mapping).forEach(function syncCalibrationInput(key) {
                const input = root.querySelector("[data-arcsecs-space-calibration='" + key + "']");
                if (input) {
                    input.value = String(mapping[key]);
                }
            });
        }

        function applyCalibrationControls() {
            const viewportScale = readCalibrationInput("viewportScale", VIEWPORT_WIDTH_GIGAPARSECS);
            const calibration = applyMissionCalibration(state, {
                viewportScale,
                viewportWidthGigaparsecs: viewportScale,
                viewportHeightGigaparsecs: viewportScale * (VIEWPORT_HEIGHT_GIGAPARSECS / VIEWPORT_WIDTH_GIGAPARSECS),
                simulatedHoursPerTick: readCalibrationInput("simulatedHoursPerTick", SIMULATED_HOURS_PER_TICK),
                beaconDistanceScale: readCalibrationInput("beaconDistanceScale", 1),
                densityStrength: readCalibrationInput("densityStrength", 1),
                speedCompression: readCalibrationInput("speedCompression", 1)
            });
            syncCalibrationInputs(calibration);
            updateDistanceSpeedScaleState(state);
            updateParsecNavigationState(state);
            buildRegionSurfaceDensityState(state);
            updateWavefrontTrackerState(state);
            updateMissionEvidenceLedger(state);
            render();
        }

        function readReplayImportText() {
            const textarea = root.querySelector("[data-arcsecs-space-replay-json]");
            return textarea ? textarea.value : "";
        }

        function writeReplayImportText(text) {
            const textarea = root.querySelector("[data-arcsecs-space-replay-json]");
            if (textarea) {
                textarea.value = text;
            }
        }

        function loadReplayImportText(sourceLabel) {
            const viewer = importMissionReplayExportJson(state, readReplayImportText(), sourceLabel || "pasted JSON");
            if (viewer.loaded) {
                syncCalibrationInputs(state.missionCalibrationState);
            }
            updateMissionEvidenceLedger(state);
            render();
        }

        function loadCurrentRunAsReplay() {
            const payload = buildMissionExport(state);
            const pretty = JSON.stringify(payload, null, 2);
            writeReplayImportText(pretty);
            loadMissionReplayExportPayload(state, payload, "current run export");
            updateMissionEvidenceLedger(state);
            render();
        }

        function readReplayFile(file) {
            if (!file || !globalScope.FileReader) {
                return;
            }
            const reader = new globalScope.FileReader();
            reader.addEventListener("load", function loadReplayFile() {
                writeReplayImportText(String(reader.result || ""));
                loadReplayImportText(file.name || "uploaded replay export");
            });
            reader.readAsText(file);
        }

        function handleClick(action) {
            if (action === "start") {
                state.running = !state.running;
            } else if (action === "scoop") {
                state.input.scoop = !state.input.scoop;
            } else if (action === "assist") {
                state.input.inertialAssist = !state.input.inertialAssist;
            } else if (action === "autopilot") {
                state.input.autopilotToBeacon = !state.input.autopilotToBeacon;
                state.running = true;
            } else if (action === "signal") {
                createMultiMessengerEvent(state, "manual", state.ship.x, state.ship.y);
                state.running = true;
            } else if (action === "fieldOverlay") {
                state.renderOptions.showDynamicProcaField = !state.renderOptions.showDynamicProcaField;
            } else if (action === "psfOverlay") {
                state.renderOptions.showPsfLensing = !state.renderOptions.showPsfLensing;
            } else if (action === "torsionOverlay") {
                state.renderOptions.showTorsionVectorField = !state.renderOptions.showTorsionVectorField;
            } else if (action === "demo") {
                const select = root.querySelector("[data-arcsecs-space-demo-select]");
                const demoKey = select ? select.value : "free-flight";
                applyMissionDemoPreset(state, demoKey);
            } else if (action === "propulsion") {
                const select = root.querySelector("[data-arcsecs-space-propulsion-select]");
                const propulsionKey = select ? select.value : "inertial-coast";
                applyPropulsionMode(state, propulsionKey);
            } else if (action === "calibration") {
                applyCalibrationControls();
            } else if (action === "calibrationReset") {
                state.missionCalibrationState = createMissionCalibrationState();
                syncCalibrationInputs(state.missionCalibrationState);
                updateDistanceSpeedScaleState(state);
                updateParsecNavigationState(state);
                buildRegionSurfaceDensityState(state);
                updateMissionEvidenceLedger(state);
            } else if (action === "loadCurrentReplay") {
                loadCurrentRunAsReplay();
            } else if (action === "importReplay") {
                loadReplayImportText("pasted JSON");
            } else if (action === "replayPrev") {
                advanceMissionReplayExportViewer(state, -1);
            } else if (action === "replayNext") {
                advanceMissionReplayExportViewer(state, 1);
            } else if (action === "replayPlayPause") {
                if (state.missionReplayExportViewer && state.missionReplayExportViewer.loaded) {
                    state.missionReplayExportViewer.playbackActive = !state.missionReplayExportViewer.playbackActive;
                    state.running = false;
                }
            } else if (action === "replayClear") {
                state.missionReplayExportViewer = createMissionReplayExportViewerState();
                state.missionReplayInspector = createMissionReplayInspector();
                updateMissionEvidenceLedger(state);
            } else if (action === "inspectReplay") {
                const trailLength = state.missionReplayTrail ? state.missionReplayTrail.length : 0;
                if (trailLength > 0) {
                    const currentIndex = state.missionReplayInspector && state.missionReplayInspector.selectedFrameIndex >= 0 ? state.missionReplayInspector.selectedFrameIndex : trailLength;
                    const nextIndex = currentIndex <= 0 ? trailLength - 1 : currentIndex - 1;
                    state.missionReplayInspector = buildMissionReplayInspector(state, nextIndex);
                }
            } else if (action === "copyFalsification") {
                const summary = buildMissionExport(state).falsificationNotes.join("\n");
                if (globalScope.navigator && globalScope.navigator.clipboard) {
                    globalScope.navigator.clipboard.writeText(summary).catch(function ignoreClipboardError() {});
                }
            } else if (action === "clearTrail") {
                state.missionReplayTrail = [];
                state.missionReplayInspector = createMissionReplayInspector();
                if (state.missionChallengeState) {
                    state.missionChallengeState.replayFrames = 0;
                }
                updateMissionEvidenceLedger(state);
            } else if (action === "reset") {
                const replacement = createInitialState(5810);
                Object.keys(state).forEach(function removeKey(key) {
                    delete state[key];
                });
                Object.assign(state, replacement);
                const select = root.querySelector("[data-arcsecs-space-demo-select]");
                if (select) { select.value = "free-flight"; }
            } else if (action === "export") {
                downloadJson("arcsecs-space-travel-mission-export.json", buildMissionExport(state));
            }
            render();
        }

        const demoSelect = root.querySelector("[data-arcsecs-space-demo-select]");
        if (demoSelect) {
            demoSelect.addEventListener("change", function changeDemo() {
                const preset = getMissionDemoPreset(demoSelect.value);
                state.demoDirector = createMissionDemoDirector(preset.key);
                state.demoDirector.status = "Selected " + preset.label + ". Click Run Selected Demo to start.";
                render();
            });
        }

        const propulsionSelect = root.querySelector("[data-arcsecs-space-propulsion-select]");
        if (propulsionSelect) {
            propulsionSelect.addEventListener("change", function changePropulsionMode() {
                applyPropulsionMode(state, propulsionSelect.value);
                render();
            });
        }

        syncCalibrationInputs(state.missionCalibrationState);

        root.querySelectorAll("[data-arcsecs-space-calibration]").forEach(function bindCalibrationInput(input) {
            input.addEventListener("change", function changeCalibrationInput() {
                applyCalibrationControls();
            });
        });

        const replayFileInput = root.querySelector("[data-arcsecs-space-replay-file]");
        if (replayFileInput) {
            replayFileInput.addEventListener("change", function changeReplayFile(event) {
                const files = event.target && event.target.files ? event.target.files : [];
                if (files.length > 0) {
                    readReplayFile(files[0]);
                }
            });
        }

        root.querySelectorAll("[data-arcsecs-space-action]").forEach(function bindButton(button) {
            const action = button.getAttribute("data-arcsecs-space-action") || "";
            if (["thrust", "brake", "left", "right"].indexOf(action) !== -1) {
                button.addEventListener("pointerdown", function pointerDown() {
                    setHoldAction(action, true);
                    state.running = true;
                });
                button.addEventListener("pointerup", function pointerUp() {
                    setHoldAction(action, false);
                });
                button.addEventListener("pointerleave", function pointerLeave() {
                    setHoldAction(action, false);
                });
                button.addEventListener("keydown", function keyDown(event) {
                    if (event.key === " " || event.key === "Enter") {
                        setHoldAction(action, true);
                        state.running = true;
                    }
                });
                button.addEventListener("keyup", function keyUp() {
                    setHoldAction(action, false);
                });
            } else {
                button.addEventListener("click", function clickButton() {
                    handleClick(action);
                });
            }
        });

        globalScope.addEventListener("keydown", function keyDown(event) {
            if (event.target && ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].indexOf(event.target.tagName) !== -1) {
                return;
            }
            if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
                state.input.thrust = true;
                state.running = true;
            } else if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
                state.input.brake = true;
            } else if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
                state.input.turnLeft = true;
            } else if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
                state.input.turnRight = true;
            } else if (event.key.toLowerCase() === "e") {
                createMultiMessengerEvent(state, "manual", state.ship.x, state.ship.y);
                state.running = true;
            }
        });

        globalScope.addEventListener("keyup", function keyUp(event) {
            if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
                state.input.thrust = false;
            } else if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
                state.input.brake = false;
            } else if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
                state.input.turnLeft = false;
            } else if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
                state.input.turnRight = false;
            }
        });

        resizeCanvas();
        render();
        animationFrame = globalScope.requestAnimationFrame(loop);

        return {
            state,
            render,
            destroy: function destroy() {
                globalScope.cancelAnimationFrame(animationFrame);
            }
        };
    }

    function initializeAll() {
        const documentRef = globalScope.document;
        if (!documentRef) {
            return;
        }

        documentRef.querySelectorAll("[data-arcsecs-space-travel-simulation]").forEach(function initializeRoot(root) {
            if (root.getAttribute("data-arcsecs-space-initialized") === "true") {
                return;
            }
            root.setAttribute("data-arcsecs-space-initialized", "true");
            createController(root);
        });
    }

    const exported = {
        createInitialState,
        sampleMissionField,
        sampleMissionFieldAt,
        stepMissionState,
        createGravityWavefront,
        createPhotonWavefront,
        createMultiMessengerEvent,
        updateWavefronts,
        buildMissionExport,
        buildWavefrontTelemetry,
        listMissionDemoPresets,
        getMissionDemoPreset,
        applyMissionDemoPreset,
        updateMissionDemoDirector,
        createMissionObjectiveScorecard,
        buildMissionObjectiveScorecard,
        updateMissionObjectiveScorecard,
        serializeMissionObjectiveScorecard,
        createMissionChallengeState,
        updateMissionChallengeState,
        serializeMissionChallengeState,
        createRelationalCoordinateState,
        translateInstrumentMaskToRelationalCoordinates,
        serializeRelationalCoordinateState,
        createMissionCalibrationState,
        applyMissionCalibration,
        getMissionCalibrationValue,
        serializeMissionCalibrationState,
        buildMissionCalibrationEvidence,
        createDistanceSpeedScaleState,
        updateDistanceSpeedScaleState,
        serializeDistanceSpeedScaleState,
        arcsecsToRadians,
        radiansToArcsecs,
        parallaxArcsecsToParsecs,
        parsecsToMegaparsecs,
        parsecsPerTickToParsecsPerSimulatedHour,
        squareParsecRegionArea,
        substrateDensityPerSquareParsec,
        formatParsecDistance,
        formatParsecVelocity,
        createParsecNavigationState,
        updateParsecNavigationState,
        serializeParsecNavigationState,
        createRegionSurfaceDensityState,
        buildRegionSurfaceDensityState,
        serializeRegionSurfaceDensityState,
        createRouteComparisonState,
        updateRouteComparisonState,
        serializeRouteComparisonState,
        createWavefrontTrackerState,
        calculateLineOfSightDensityIntegral,
        updateWavefrontTrackerState,
        serializeWavefrontTrackerState,
        createRouteAdvisorState,
        updateRouteAdvisorState,
        serializeRouteAdvisorState,
        createMissionOutcomeState,
        updateMissionOutcomeState,
        serializeMissionOutcomeState,
        setTapTarget,
        listPropulsionModePresets,
        getPropulsionModePreset,
        createPropulsionModeState,
        applyPropulsionMode,
        updatePropulsionModeState,
        serializePropulsionModeState,
        createDynamicProcaFieldState,
        sampleDynamicProcaFieldAt,
        updateDynamicProcaField,
        serializeDynamicProcaFieldState,
        createPsfLensingState,
        buildPsfLensingState,
        updatePsfLensingState,
        serializePsfLensingState,
        createTeleparallelTorsionFieldState,
        sampleTeleparallelTorsionFieldAt,
        updateTeleparallelTorsionField,
        serializeTeleparallelTorsionFieldState,
        createRouteCurvatureInspector,
        buildRouteCurvatureInspector,
        updateRouteCurvatureInspector,
        serializeRouteCurvatureInspector,
        createMissionEvidenceLedger,
        buildMissionEvidenceLedger,
        updateMissionEvidenceLedger,
        serializeMissionEvidenceLedger,
        createMissionReplayInspector,
        createMissionReplayExportViewerState,
        validateMissionReplayExportPayload,
        normalizeMissionReplayExportFrame,
        buildMissionReplayExportViewerState,
        selectMissionReplayExportFrame,
        loadMissionReplayExportPayload,
        importMissionReplayExportJson,
        advanceMissionReplayExportViewer,
        stepMissionReplayExportViewer,
        serializeMissionReplayExportViewerState,
        buildMissionReplayInspector,
        serializeMissionReplayInspector,
        recordMissionReplayFrame,
        buildMissionReplaySummary,
        getGrandTourTargets,
        getGrandTourTarget,
        buildValidationRows,
        finiteNumber,
        clamp,
        GRAVITY_WAVEFRONT_SPEED,
        PHOTON_BASE_SPEED,
        PHOTON_VISIBILITY_THRESHOLD,
        SPECULATIVE_BOUNDARY
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = exported;
    }

    globalScope.ArcSecsSpaceTravelSimulation = exported;

    if (globalScope.document) {
        if (globalScope.document.readyState === "loading") {
            globalScope.document.addEventListener("DOMContentLoaded", initializeAll);
        } else {
            initializeAll();
        }
    }
})(typeof window !== "undefined" ? window : globalThis);
