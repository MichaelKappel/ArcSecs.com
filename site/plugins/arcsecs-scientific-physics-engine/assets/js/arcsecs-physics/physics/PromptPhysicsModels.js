'use strict';

function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, value)); }

class GravitySolver {
  constructor(gravitationalConstantProxy) { this.gravitationalConstantProxy = Math.max(0, Number(gravitationalConstantProxy === undefined ? 1 : gravitationalConstantProxy)); }
  acceleration(centralMass, radius, softeningRadius) {
    const softenedRadius = Math.sqrt(Number(radius) * Number(radius) + Number(softeningRadius === undefined ? 0.001 : softeningRadius) * Number(softeningRadius === undefined ? 0.001 : softeningRadius));
    const acceleration = this.gravitationalConstantProxy * Math.max(0, Number(centralMass)) / Math.max(0.000001, softenedRadius * softenedRadius);
    return { radius: Number(radius), acceleration, softenedRadius };
  }
  escapeVelocity(centralMass, radius) { return Math.sqrt((2 * this.gravitationalConstantProxy * Math.max(0, Number(centralMass))) / Math.max(0.000001, Number(radius))); }
}

class RelationalSolver {
  evaluateEdge(fromEntityId, toEntityId, restLength, currentLength, relativeAngleRadians) {
    const safeRestLength = Math.max(0.000001, Number(restLength));
    const tension = (Number(currentLength) - safeRestLength) / safeRestLength;
    const torsionProxy = Math.sin(Number(relativeAngleRadians)) * Math.min(1, Math.abs(tension) + 0.05);
    const stability = clamp(1 - Math.abs(tension) - Math.abs(torsionProxy) * 0.5, 0, 1);
    return { fromEntityId: Math.trunc(Number(fromEntityId)), toEntityId: Math.trunc(Number(toEntityId)), restLength: safeRestLength, currentLength: Number(currentLength), tension, torsionProxy, stability };
  }
}

class QuantumOscillatorDampingModel {
  compute(globalTickCount, fixedStepSeconds, massProxy, distanceProxy) {
    const safeDistance = Math.max(0.001, Number(distanceProxy));
    const localGravitationalGradient = Math.max(0, Number(massProxy)) / (safeDistance * safeDistance);
    const dampingCoefficient = clamp(localGravitationalGradient * 0.012, 0, 0.36);
    return { globalTickCount: Math.trunc(Number(globalTickCount)), globalSimulationSeconds: Number(globalTickCount) * Number(fixedStepSeconds), deepSpaceTransitionCount: Math.trunc(Number(globalTickCount)), nearMassTransitionCount: Math.floor(Number(globalTickCount) * (1 - dampingCoefficient)), localGravitationalGradient, dampingCoefficient };
  }
}

class MassivePhotonModel {
  state(photonMass, velocity) {
    const safePhotonMass = Math.max(0, Number(photonMass));
    const safeVelocity = Math.max(0.000001, Number(velocity));
    return { photonMass: safePhotonMass, velocity: safeVelocity, gravitationalCoupling: clamp(safePhotonMass * 1e18, 0, 4), kineticEnergyProxy: 0.5 * safePhotonMass * safeVelocity * safeVelocity };
  }
}

class TiredLightDecayModel {
  decay(initialEnergy, distance, attenuationCoefficient, ledgerEfficiency) {
    const safeInitialEnergy = Math.max(0, Number(initialEnergy));
    const currentEnergy = safeInitialEnergy * Math.exp(-Math.max(0, Number(attenuationCoefficient)) * Math.max(0, Number(distance)));
    const energyLost = safeInitialEnergy - currentEnergy;
    const substrateLedgerEnergy = energyLost * clamp(Number(ledgerEfficiency === undefined ? 1 : ledgerEfficiency), 0, 1);
    return { initialEnergy: safeInitialEnergy, currentEnergy, energyLost, substrateLedgerEnergy, ledgerClosureError: Math.abs(energyLost - substrateLedgerEnergy), redshift: safeInitialEnergy / Math.max(0.000001, currentEnergy) - 1 };
  }
}

class DarkStarEscapeModel {
  constructor(gravitySolver) { this.gravitySolver = gravitySolver || new GravitySolver(); }
  evaluate(centralMass, launchRadius, photonVelocity) {
    const distanceFromCenter = Math.max(0.000001, Number(launchRadius));
    const escapeVelocity = this.gravitySolver.escapeVelocity(centralMass, distanceFromCenter);
    const captured = Number(photonVelocity) < escapeVelocity;
    const velocityRatio = Number(photonVelocity) / Math.max(0.000001, escapeVelocity);
    const apogee = captured ? distanceFromCenter / Math.max(0.000001, 1 - velocityRatio * velocityRatio) : Number.POSITIVE_INFINITY;
    return { escapeVelocity, photonVelocity: Number(photonVelocity), distanceFromCenter, apogee, captured, escaping: !captured };
  }
}

class LensingModel {
  compare(centralMass, impactParameter, photonMass, photonVelocity) {
    const safeImpactParameter = Math.max(0.000001, Number(impactParameter));
    const safePhotonVelocity = Math.max(0.000001, Number(photonVelocity));
    const safePhotonMass = Math.max(0, Number(photonMass));
    const soldnerDeflectionArcseconds = (2 * Math.max(0, Number(centralMass))) / (safeImpactParameter * safePhotonVelocity * safePhotonVelocity);
    const standardGeneralRelativityArcseconds = soldnerDeflectionArcseconds * 2;
    const arcsecsProxyArcseconds = soldnerDeflectionArcseconds * (1 + clamp(safePhotonMass * 1e18, 0, 4));
    return { impactParameter: safeImpactParameter, centralMass: Number(centralMass), photonMass: safePhotonMass, photonVelocity: safePhotonVelocity, soldnerDeflectionArcseconds, standardGeneralRelativityArcseconds, arcsecsProxyArcseconds, standardMismatchArcseconds: arcsecsProxyArcseconds - standardGeneralRelativityArcseconds };
  }
}

class GalileanKinematicsModel {
  relativeVelocity(bodyAVelocity, bodyBVelocity, globalTimeSeconds) { return { bodyAVelocity: Number(bodyAVelocity), bodyBVelocity: Number(bodyBVelocity), relativeVelocity: Math.abs(Number(bodyAVelocity) - Number(bodyBVelocity)), globalTimeSeconds: Number(globalTimeSeconds), lorentzFactorApplied: false }; }
}

class DarkMatterDrivePipelineModel {
  compute(input) {
    const intakeRateBase = Math.max(0, Number(input.substrateDensity)) * Math.max(0, Number(input.scoopArea)) * Math.max(0.01, Number(input.shipVelocityRatioC));
    const intakeRate = input.failureMode === 'micrometeorBurst' ? intakeRateBase * 0.72 : intakeRateBase;
    const solenoidFailed = input.failureMode === 'solenoidQuench';
    const dragLoad = intakeRate * Math.max(0, Number(input.dragCoefficient)) * 0.18 * (solenoidFailed ? 2.4 : 1);
    const shieldStress = input.failureMode === 'shieldOverload' ? 0.52 : input.failureMode === 'micrometeorBurst' ? 0.34 : 0;
    const shieldIntegrity = clamp(1 - Number(input.shieldAblationRate) - dragLoad * 0.002 - shieldStress, 0, 1);
    const compressedIntake = intakeRate * Math.max(1, Number(input.compressionRatio)) / 18;
    const bufferCapacity = Math.max(0.001, Number(input.bufferCapacity));
    const bufferFill = clamp((compressedIntake + (input.failureMode === 'bufferSaturation' ? bufferCapacity * 0.68 : 0)) / bufferCapacity, 0, 1.4);
    const bufferCoherence = clamp(1 - Math.max(0, bufferFill - 0.82) * 0.85 - (input.failureMode === 'bufferDecoherence' ? 0.55 : 0), 0, 1);
    const reactorInput = Math.min(compressedIntake, bufferCapacity) * bufferCoherence;
    const reactorOutput = reactorInput * clamp(Number(input.reactorEfficiency), 0, 1);
    const wasteHeat = Math.max(0, reactorInput - reactorOutput) + dragLoad * 0.12;
    const radiatorCapacity = input.failureMode === 'radiatorPanelLoss' ? Number(input.radiatorCapacity) * 0.45 : Number(input.radiatorCapacity);
    const thermalThrottle = clamp(radiatorCapacity / Math.max(0.000001, wasteHeat), 0, 1);
    const exhaustCollimation = clamp(input.failureMode === 'wideExhaust' ? Number(input.exhaustCollimation) * 0.48 : Number(input.exhaustCollimation), 0, 1);
    const thrust = reactorOutput * thermalThrottle * exhaustCollimation;
    const netAcceleration = thrust - dragLoad;
    const warningCount = (shieldIntegrity < 0.55 ? 1 : 0) + (bufferFill > 1 ? 1 : 0) + (bufferCoherence < 0.55 ? 1 : 0) + (wasteHeat > radiatorCapacity ? 1 : 0) + (exhaustCollimation < 0.55 ? 1 : 0) + (solenoidFailed ? 1 : 0);
    const ledgerClosure = 1;
    const flightReadinessScore = clamp((shieldIntegrity + bufferCoherence + thermalThrottle + exhaustCollimation + ledgerClosure) / 5 - warningCount * 0.05, 0, 1);
    const solenoidStatus = solenoidFailed ? 'quench' : dragLoad > intakeRate * 0.4 ? 'stressed' : 'nominal';
    return { intakeRate, dragLoad, shieldIntegrity, solenoidStatus, bufferFill, bufferCoherence, reactorOutput, wasteHeat, radiatorCapacity, exhaustCollimation, thrust, netAcceleration, ledgerClosure, flightReadinessScore, warningCount };
  }
}

class StabilityLedgerChecks {
  evaluate(input) {
    const finiteTelemetryPassed = input.finiteSampleValues.every((value) => Number.isFinite(value));
    const ledgerClosureError = Math.abs(Number(input.energyIn) - Number(input.energyStored) - Number(input.energyOutput) - Number(input.energyWaste));
    const energyLedgerScore = clamp(1 - ledgerClosureError / Math.max(1, Number(input.energyIn)), 0, 1);
    const warningPenalty = Math.min(0.6, Math.max(0, Number(input.warningCount)) * 0.08);
    const stabilityScore = finiteTelemetryPassed ? clamp(energyLedgerScore - warningPenalty, 0, 1) : 0;
    const riskScore = clamp(1 - stabilityScore + warningPenalty, 0, 1);
    const failedReason = !finiteTelemetryPassed ? 'Non-finite telemetry sample detected.' : ledgerClosureError > 0.000001 ? 'Energy ledger did not close within tolerance.' : Number(input.warningCount) > 0 ? 'Scenario has active warning conditions.' : 'All stability checks passed.';
    return { finiteTelemetryPassed, ledgerClosureError, energyLedgerScore, stabilityScore, riskScore, failedReason };
  }
}

module.exports = { GravitySolver, RelationalSolver, QuantumOscillatorDampingModel, MassivePhotonModel, TiredLightDecayModel, DarkStarEscapeModel, LensingModel, GalileanKinematicsModel, DarkMatterDrivePipelineModel, StabilityLedgerChecks };
