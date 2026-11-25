'use strict';

class CommandDispatcher {
  constructor() { this.handlers = new Map(); this.history = []; }
  register(name, handler) { this.handlers.set(String(name), handler); }
  dispatch(command) {
    const normalizedCommand = { name: String(command.name || ''), value: String(command.value || ''), issuedAtTick: Number(command.issuedAtTick || 0) };
    this.history.push(normalizedCommand);
    const handler = this.handlers.get(normalizedCommand.name);
    if (!handler) { return { accepted: false, message: 'No handler registered for ' + normalizedCommand.name + '.' }; }
    return handler(normalizedCommand);
  }
  getHistory() { return this.history.slice(); }
}

const defaultKeyboardPresetBindings = Object.freeze([
  { key: '1', scenario: 'relationalLattice' },
  { key: '2', scenario: 'absoluteTimeQuantumOscillator' },
  { key: '3', scenario: 'massivePhotonLensing' },
  { key: '4', scenario: 'newtonianDarkStar' },
  { key: '5', scenario: 'superluminalGalilean' },
  { key: '6', scenario: 'tiredLightEnergyLedger' },
  { key: '7', scenario: 'darkMatterCondensate' },
  { key: '8', scenario: 'darkMatterRamjet' },
  { key: '9', scenario: 'parallaxCalibration' }
]);

module.exports = { CommandDispatcher, defaultKeyboardPresetBindings };
