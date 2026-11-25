export interface DarkMatterDriveDemoFlightCheck {
    readonly key: string;
    readonly label: string;
    readonly passed: boolean;
    readonly value: string;
    readonly note: string;
}

export interface DarkMatterDriveDemoFlightVerification {
    readonly stageId: string;
    readonly stageTitle: string;
    readonly status: "pass" | "attention";
    readonly passedCount: number;
    readonly totalCount: number;
    readonly finite: boolean;
    readonly checks: readonly DarkMatterDriveDemoFlightCheck[];
}

export interface DarkMatterDriveDemoFlightRecipeSnapshot {
    readonly speedMultiplier: number;
    readonly driveCoupling: number;
    readonly windDensity: number;
    readonly magneticScoopStrength: number;
    readonly multiMessengerEventPreset: string;
    readonly substrateDensityProfile: string;
    readonly lineOfSightOpticalResistance: number;
    readonly thermalRejectionCapacity: number;
    readonly compressionRatio: number;
}

export class DarkMatterDriveDemoFlightVerificationBuilder {
    public build(stageId: string, stageTitle: string, activeHotspotId: string, expectedHotspotId: string, recipe: DarkMatterDriveDemoFlightRecipeSnapshot): DarkMatterDriveDemoFlightVerification {
        const checks: DarkMatterDriveDemoFlightCheck[] = [
            this.createCheck("stage-target", "Stage target is active", activeHotspotId === expectedHotspotId, activeHotspotId, "The highlighted cockpit hotspot should match the current demo stage."),
            this.createCheck("finite-recipe", "Recipe telemetry is finite", this.isFiniteRecipe(recipe), "finite-check", "The autopilot stage must not create non-finite simulator inputs."),
            ...this.getStageChecks(stageId, recipe)
        ];
        const passedCount: number = checks.filter((check: DarkMatterDriveDemoFlightCheck) => check.passed).length;
        return {
            stageId,
            stageTitle,
            status: passedCount === checks.length ? "pass" : "attention",
            passedCount,
            totalCount: checks.length,
            finite: checks.every((check: DarkMatterDriveDemoFlightCheck) => Number.isFinite(check.passed ? 1 : 0)),
            checks
        };
    }

    private getStageChecks(stageId: string, recipe: DarkMatterDriveDemoFlightRecipeSnapshot): DarkMatterDriveDemoFlightCheck[] {
        if (stageId === "align-scoop") {
            return [
                this.createCheck("scoop-strength", "Scoop strength increased", recipe.magneticScoopStrength >= 0.85, recipe.magneticScoopStrength.toFixed(2), "Capture packets should visibly intensify."),
                this.createCheck("wind-density", "Proca flux density increased", recipe.windDensity >= 1.7, recipe.windDensity.toFixed(2), "The guide stream should show stronger substrate flow.")
            ];
        }
        if (stageId === "dense-filament") {
            return [
                this.createCheck("filament-profile", "Dense filament profile selected", recipe.substrateDensityProfile === "filament", recipe.substrateDensityProfile, "Photon degradation should become visible along the line of sight."),
                this.createCheck("optical-resistance", "Optical resistance elevated", recipe.lineOfSightOpticalResistance >= 2.3, recipe.lineOfSightOpticalResistance.toFixed(2), "Light should appear weaker/redder while gravity remains baseline.")
            ];
        }
        if (stageId === "agn-diffusion") {
            return [
                this.createCheck("agn-event", "GW190521 AGN case selected", recipe.multiMessengerEventPreset === "gw190521", recipe.multiMessengerEventPreset, "The event theater should emphasize environment/diffusion delay."),
                this.createCheck("agn-profile", "AGN disk profile selected", recipe.substrateDensityProfile === "agnDisk", recipe.substrateDensityProfile, "Environmental diffusion should dominate the delay explanation.")
            ];
        }
        if (stageId === "missing-counterpart") {
            return [
                this.createCheck("missing-event", "Missing counterpart event selected", recipe.multiMessengerEventPreset === "gw190814", recipe.multiMessengerEventPreset, "The light marker may vanish without breaking telemetry."),
                this.createCheck("visibility-threshold", "Visibility threshold stress is high", recipe.lineOfSightOpticalResistance >= 3, recipe.lineOfSightOpticalResistance.toFixed(2), "Photon energy should fall toward the detection threshold.")
            ];
        }
        if (stageId === "thermal-stress") {
            return [
                this.createCheck("compression-core", "Compression core stressed", recipe.compressionRatio >= 70, recipe.compressionRatio.toFixed(1), "The propulsion core should show a bottleneck condition."),
                this.createCheck("radiator-limit", "Radiator capacity constrained", recipe.thermalRejectionCapacity <= 0.35, recipe.thermalRejectionCapacity.toFixed(2), "Thermal warnings should be visible and finite.")
            ];
        }
        return [
            this.createCheck("speed-preview", "Motion preview is active", recipe.speedMultiplier >= 1.1, recipe.speedMultiplier.toFixed(2), "The cockpit should not look static."),
            this.createCheck("drive-coupling", "Drive coupling is visible", recipe.driveCoupling >= 0.6, recipe.driveCoupling.toFixed(2), "Tethers, packets, and route motion should be visible.")
        ];
    }

    private createCheck(key: string, label: string, passed: boolean, value: string, note: string): DarkMatterDriveDemoFlightCheck {
        return { key, label, passed, value, note };
    }

    private isFiniteRecipe(recipe: DarkMatterDriveDemoFlightRecipeSnapshot): boolean {
        return Number.isFinite(recipe.speedMultiplier)
            && Number.isFinite(recipe.driveCoupling)
            && Number.isFinite(recipe.windDensity)
            && Number.isFinite(recipe.magneticScoopStrength)
            && Number.isFinite(recipe.lineOfSightOpticalResistance)
            && Number.isFinite(recipe.thermalRejectionCapacity)
            && Number.isFinite(recipe.compressionRatio);
    }
}
