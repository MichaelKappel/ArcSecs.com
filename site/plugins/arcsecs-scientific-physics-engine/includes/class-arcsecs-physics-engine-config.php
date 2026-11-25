<?php
if (!defined('ABSPATH') && !defined('ARCSECS_PHYSICS_ENGINE_TESTING')) {
    exit;
}

final class ArcSecs_Physics_Engine_Config
{
    public const DEFAULT_SCENARIO = 'relationalLattice';
    public const MIN_STEPS = 500;
    public const MAX_STEPS = 25000;

    /**
     * Returns the supported simulator scenario identifiers.
     *
     * @return array<int, string> Scenario keys accepted by shortcode and runtime configuration.
     */
    public static function allowed_scenarios(): array
    {
        return array(
            'control',
            'vsl',
            'relationalLattice',
            'relationalFlatSpaceEngine',
            'absoluteTimeQuantumOscillator',
            'teleparallelGravity',
            'tiredLightPhotonDecay',
            'mechanisticTiredLight',
            'tiredLight',
            'entropicBetaMatter',
            'mondRotationCurves',
            'procaPhotonDispersion',
            'massivePhotonProca',
            'proca',
            'eitSlowLight',
            'flatSpaceLensing',
            'massivePhotonLensing',
            'newtonianDarkStar',
            'superluminalGalilean',
            'tiredLightEnergyLedger',
            'darkMatterCondensate',
            'singularitySafeGravity',
            'monteCarloPhotonPipeline',
            'parallaxCalibration',
            'photometricCalibration',
            'rigidBodyDiagnostics',
            'ccctl',
            'darkMatterDrive',
            'darkMatterRamjet',
            'sunSimulation'
        );
    }

    /**
     * Normalizes a requested scenario to a safe runtime value.
     *
     * @param mixed $scenario Requested scenario value.
     * @return string Safe scenario identifier.
     */
    public static function normalize_scenario($scenario): string
    {
        $value = self::sanitize_key_compat((string) $scenario);
        $map = array(
            'control' => 'control',
            'fixedconstants' => 'control',
            'vsl' => 'vsl',
            'variablespeedoflight' => 'vsl',
            'relationallattice' => 'relationalLattice',
            'relationalflatspaceengine' => 'relationalFlatSpaceEngine',
            'relational-flat-space-engine' => 'relationalFlatSpaceEngine',
            'flatspaceengine' => 'relationalFlatSpaceEngine',
            'absolutetimequantumoscillator' => 'absoluteTimeQuantumOscillator',
            'quantumoscillator' => 'absoluteTimeQuantumOscillator',
            'oscillatordamping' => 'absoluteTimeQuantumOscillator',
            'lattice' => 'relationalLattice',
            'teleparallelgravity' => 'teleparallelGravity',
            'teleparallel' => 'teleparallelGravity',
            'tiredlight' => 'tiredLightPhotonDecay',
            'tiredlightphotondecay' => 'tiredLightPhotonDecay',
            'mechanistictiredlight' => 'mechanisticTiredLight',
            'mechanisticredshift' => 'mechanisticTiredLight',
            'entropicgravitybetamatter' => 'entropicBetaMatter',
            'entropicbetamatter' => 'entropicBetaMatter',
            'betamatter' => 'entropicBetaMatter',
            'mondrotationcurves' => 'mondRotationCurves',
            'mond' => 'mondRotationCurves',
            'proca' => 'procaPhotonDispersion',
            'procaphotondispersion' => 'procaPhotonDispersion',
            'massivephotonproca' => 'massivePhotonProca',
            'massivephoton' => 'massivePhotonProca',
            'eitslowlight' => 'eitSlowLight',
            'slowlight' => 'eitSlowLight',
            'flatspacelensing' => 'flatSpaceLensing',
            'lensing' => 'flatSpaceLensing',
            'massivephotonlensing' => 'massivePhotonLensing',
            'photonlensing' => 'massivePhotonLensing',
            'newtoniandarkstar' => 'newtonianDarkStar',
            'darkstar' => 'newtonianDarkStar',
            'superluminalgalilean' => 'superluminalGalilean',
            'galileansuperluminal' => 'superluminalGalilean',
            'relativevelocity' => 'superluminalGalilean',
            'tiredlightenergyledger' => 'tiredLightEnergyLedger',
            'energyledger' => 'tiredLightEnergyLedger',
            'darkmattercondensate' => 'darkMatterCondensate',
            'condensate' => 'darkMatterCondensate',
            'singularitysafegravity' => 'singularitySafeGravity',
            'singularitysafe' => 'singularitySafeGravity',
            'montecarlophotonpipeline' => 'monteCarloPhotonPipeline',
            'monte-carlo-photon-pipeline' => 'monteCarloPhotonPipeline',
            'montecarlo' => 'monteCarloPhotonPipeline',
            'parallaxcalibration' => 'parallaxCalibration',
            'parallax' => 'parallaxCalibration',
            'photometriccalibration' => 'photometricCalibration',
            'photometric-calibration' => 'photometricCalibration',
            'photometry' => 'photometricCalibration',
            'rigidbodydiagnostics' => 'rigidBodyDiagnostics',
            'rigidbody' => 'rigidBodyDiagnostics',
            'ccctl' => 'ccctl',
            'darkmatterdrive' => 'darkMatterDrive',
            'darkmatterramjet' => 'darkMatterRamjet',
            'ramjet' => 'darkMatterRamjet',
            'darkmatterdriveramjet' => 'darkMatterRamjet',
            'sunsimulation' => 'sunSimulation',
            'solargravity' => 'sunSimulation',
        );
        return array_key_exists($value, $map) ? $map[$value] : self::DEFAULT_SCENARIO;
    }

    /**
     * Clamps accepted simulation steps to the supported page-safe range.
     *
     * @param mixed $steps Requested accepted step count.
     * @return int Clamped accepted step count.
     */
    public static function normalize_steps($steps): int
    {
        $value = (int) $steps;
        if ($value < self::MIN_STEPS) {
            return self::MIN_STEPS;
        }
        if ($value > self::MAX_STEPS) {
            return self::MAX_STEPS;
        }
        return $value;
    }

    /**
     * Converts shortcode-style booleans to an HTML data attribute string.
     *
     * @param mixed $value Value supplied by shortcode attributes.
     * @return string Either "true" or "false".
     */
    public static function normalize_bool_attribute($value): string
    {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
    }

    /**
     * Provides a sanitize_key equivalent for isolated unit tests without WordPress loaded.
     *
     * @param string $value Raw key.
     * @return string Sanitized key.
     */
    private static function sanitize_key_compat(string $value): string
    {
        if (function_exists('sanitize_key')) {
            return sanitize_key($value);
        }

        $value = strtolower($value);
        return preg_replace('/[^a-z0-9_\-]/', '', $value) ?: '';
    }
}
