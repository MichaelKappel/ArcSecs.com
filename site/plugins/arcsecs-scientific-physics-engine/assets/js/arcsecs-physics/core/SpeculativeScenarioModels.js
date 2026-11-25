'use strict';

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

class SpeculativeScenarioModels {
  oscillatorDamping(globalTickCount, fixedStepSeconds, massProxy, distanceProxy) {
    const gradient = massProxy / Math.pow(Math.max(0.001, distanceProxy), 2);
    const dampingCoefficient = clamp(gradient * 0.012, 0, 0.36);
    return {
      globalTickCount,
      globalSimulationSeconds: globalTickCount * fixedStepSeconds,
      deepSpaceTransitions: globalTickCount,
      nearMassTransitions: Math.floor(globalTickCount * (1 - dampingCoefficient)),
      localGravitationalGradient: gradient,
      dampingCoefficient
    };
  }
  lensing(centralMass, impactParameter, photonMass, velocity) {
    const safeImpactParameter = Math.max(0.001, impactParameter);
    const safeVelocity = Math.max(0.001, velocity);
    const soldnerDeflectionArcseconds = (2 * centralMass) / (safeImpactParameter * safeVelocity * safeVelocity);
    const standardGeneralRelativityArcseconds = soldnerDeflectionArcseconds * 2;
    const arcsecsProxyArcseconds = soldnerDeflectionArcseconds * (1 + clamp(photonMass * 1e18, 0, 3));
    return { impactParameter: safeImpactParameter, centralMass, photonMass, velocity: safeVelocity, soldnerDeflectionArcseconds, standardGeneralRelativityArcseconds, arcsecsProxyArcseconds };
  }
  darkStar(centralMass, radius, photonVelocity) {
    const safeRadius = Math.max(0.001, radius);
    const escapeVelocity = Math.sqrt((2 * centralMass) / safeRadius);
    const captured = photonVelocity < escapeVelocity;
    const apogeeRadius = captured ? safeRadius / Math.max(0.001, 1 - Math.pow(photonVelocity / escapeVelocity, 2)) : safeRadius * 1000000;
    return { escapeVelocity, photonVelocity, apogeeRadius, captured };
  }
  galileanRelativeVelocity(bodyAVelocity, bodyBVelocity) {
    return { bodyAVelocity, bodyBVelocity, relativeVelocity: Math.abs(bodyAVelocity - bodyBVelocity), lorentzFactorApplied: false };
  }
  tiredLightLedger(initialEnergy, distance, attenuationCoefficient) {
    const currentEnergy = initialEnergy * Math.exp(-Math.max(0, attenuationCoefficient) * Math.max(0, distance));
    const energyLost = initialEnergy - currentEnergy;
    const substrateLedgerEnergy = energyLost;
    const ledgerClosureError = Math.abs(initialEnergy - currentEnergy - substrateLedgerEnergy);
    const redshift = initialEnergy / Math.max(0.000001, currentEnergy) - 1;
    return { initialEnergy, currentEnergy, energyLost, substrateLedgerEnergy, ledgerClosureError, redshift };
  }
  condensate(ledgerEnergy, radius) {
    const volumeProxy = (4 / 3) * Math.PI * Math.pow(Math.max(0.001, radius), 3);
    const haloDensity = ledgerEnergy / volumeProxy;
    return { haloDensity, accumulatedCondensateEnergy: ledgerEnergy, ledgerCoupling: clamp(haloDensity * 100, 0, 1) };
  }
  ramjetPipeline(substrateDensity, scoopArea, reactorEfficiency, radiatorCapacity, exhaustCollimation) {
    const intakeRate = Math.max(0, substrateDensity) * Math.max(0, scoopArea);
    const dragLoad = intakeRate * 0.18;
    const shieldAblation = dragLoad * 0.04;
    const bufferFill = clamp(intakeRate / 100, 0, 1);
    const bufferCoherence = clamp(1 - bufferFill * 0.18, 0, 1);
    const reactorOutput = intakeRate * clamp(reactorEfficiency, 0, 1) * bufferCoherence;
    const wasteHeat = Math.max(0, intakeRate - reactorOutput);
    const thermalMargin = Math.max(0.001, radiatorCapacity) / Math.max(0.001, wasteHeat);
    const thrust = reactorOutput * clamp(exhaustCollimation, 0, 1) * clamp(thermalMargin, 0, 1);
    const netAcceleration = thrust - dragLoad;
    const ledgerClosure = clamp(1 - Math.abs(intakeRate - reactorOutput - wasteHeat) / Math.max(1, intakeRate), 0, 1);
    const flightReadinessScore = clamp((bufferCoherence + ledgerClosure + clamp(thermalMargin, 0, 1) + clamp(exhaustCollimation, 0, 1)) / 4, 0, 1);
    return { intakeRate, dragLoad, shieldAblation, solenoidStatus: dragLoad > 24 ? 'stressed' : 'nominal', bufferFill, bufferCoherence, reactorOutput, wasteHeat, radiatorCapacity, exhaustCollimation, thrust, netAcceleration, ledgerClosure, flightReadinessScore };
  }
}

module.exports = { SpeculativeScenarioModels };
