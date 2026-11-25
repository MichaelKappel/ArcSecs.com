export interface DeploymentAssetRecord {
  readonly key: string;
  readonly url: string;
  readonly version: string;
  readonly required: boolean;
}

export interface DeploymentInstallRegressionInput {
  readonly engineScriptUrl: string;
  readonly engineWorkerUrl: string;
  readonly driveScriptUrl: string;
  readonly driveComputeWorkerUrl: string;
  readonly styleUrl: string;
  readonly deploymentAssetVersion: string;
  readonly shortcodeContainsEngineRoot: boolean;
  readonly shortcodeContainsDistanceTimeKernel: boolean;
  readonly shortcodeContainsExportButtons: boolean;
  readonly exportsUseJsonMimeType: boolean;
  readonly downloadsAppendAnchorBeforeClick: boolean;
}

export interface DeploymentInstallRegressionCheck {
  readonly key: string;
  readonly label: string;
  readonly passed: boolean;
  readonly detail: string;
}

export interface DeploymentInstallRegressionReport {
  readonly status: "pass" | "warn" | "fail";
  readonly checks: readonly DeploymentInstallRegressionCheck[];
  readonly assets: readonly DeploymentAssetRecord[];
  readonly speculativeBoundary: string;
}

function hasNonEmptyValue(value: string): boolean {
  return value.trim().length > 0;
}

function looksLikeJavaScriptAsset(url: string): boolean {
  const normalizedUrl: string = url.trim().toLowerCase();
  return normalizedUrl.indexOf(".js") >= 0;
}

function looksLikeStyleAsset(url: string): boolean {
  const normalizedUrl: string = url.trim().toLowerCase();
  return normalizedUrl.indexOf(".css") >= 0;
}

function hasVersionQuery(url: string): boolean {
  return url.indexOf("?ver=") >= 0 || url.indexOf("&ver=") >= 0;
}

function createCheck(key: string, label: string, passed: boolean, detail: string): DeploymentInstallRegressionCheck {
  return Object.freeze({ key, label, passed, detail });
}

export class DeploymentInstallRegressionAudit {
  public static readonly speculativeBoundary: string = "Deployment checks verify plugin wiring for a speculative research visualization; they do not prove the physics model.";

  public evaluate(input: DeploymentInstallRegressionInput): DeploymentInstallRegressionReport {
    const checks: DeploymentInstallRegressionCheck[] = [
      createCheck(
        "engine-script-url",
        "Physics Engine script URL is present",
        hasNonEmptyValue(input.engineScriptUrl) && looksLikeJavaScriptAsset(input.engineScriptUrl),
        "The WordPress enqueue must point at assets/js/arcsecs-physics-engine.js."
      ),
      createCheck(
        "engine-worker-url",
        "Physics worker URL is cache-busted",
        hasNonEmptyValue(input.engineWorkerUrl) && looksLikeJavaScriptAsset(input.engineWorkerUrl) && hasVersionQuery(input.engineWorkerUrl),
        "Worker constructor URLs need an explicit version query because Web Workers are not enqueued by WordPress."
      ),
      createCheck(
        "drive-script-url",
        "Dark Matter Drive script URL is present",
        hasNonEmptyValue(input.driveScriptUrl) && looksLikeJavaScriptAsset(input.driveScriptUrl),
        "The compact operational simulator must keep its plugin script dependency."
      ),
      createCheck(
        "drive-compute-worker-url",
        "Dark Matter Drive compute worker URL is cache-busted",
        hasNonEmptyValue(input.driveComputeWorkerUrl) && looksLikeJavaScriptAsset(input.driveComputeWorkerUrl) && hasVersionQuery(input.driveComputeWorkerUrl),
        "The WebGPU compute worker needs the same deployment cache-busting path protection."
      ),
      createCheck(
        "style-url",
        "Plugin stylesheet URL is present",
        hasNonEmptyValue(input.styleUrl) && looksLikeStyleAsset(input.styleUrl),
        "The browser-facing visual smoke pass depends on plugin CSS loading after deployment."
      ),
      createCheck(
        "asset-version",
        "Deployment asset version is present",
        hasNonEmptyValue(input.deploymentAssetVersion),
        "Asset versions should change when upgraded plugin files change to avoid stale browser cache behavior."
      ),
      createCheck(
        "shortcode-root",
        "Shortcode renders plugin root",
        input.shortcodeContainsEngineRoot,
        "The live pages must render the plugin shell instead of relying on theme-only content."
      ),
      createCheck(
        "distance-time-mode",
        "Shortcode renders Distance-Time Kernel selector",
        input.shortcodeContainsDistanceTimeKernel,
        "The live Physics Engine page must expose the Distance-Time Kernel mode after deployment."
      ),
      createCheck(
        "export-buttons",
        "Export buttons are present",
        input.shortcodeContainsExportButtons && input.exportsUseJsonMimeType,
        "Deployment checks must preserve valid JSON export controls."
      ),
      createCheck(
        "download-anchor-safety",
        "Downloads append an anchor before click",
        input.downloadsAppendAnchorBeforeClick,
        "Appending the generated anchor improves export-button behavior across browser security models."
      )
    ];

    const failedCount: number = checks.filter((check: DeploymentInstallRegressionCheck) => !check.passed).length;
    const status: "pass" | "warn" | "fail" = failedCount === 0 ? "pass" : failedCount <= 2 ? "warn" : "fail";
    const assets: DeploymentAssetRecord[] = [
      Object.freeze({ key: "engineScript", url: input.engineScriptUrl, version: input.deploymentAssetVersion, required: true }),
      Object.freeze({ key: "engineWorker", url: input.engineWorkerUrl, version: input.deploymentAssetVersion, required: true }),
      Object.freeze({ key: "driveScript", url: input.driveScriptUrl, version: input.deploymentAssetVersion, required: true }),
      Object.freeze({ key: "driveComputeWorker", url: input.driveComputeWorkerUrl, version: input.deploymentAssetVersion, required: true }),
      Object.freeze({ key: "style", url: input.styleUrl, version: input.deploymentAssetVersion, required: true })
    ];

    return Object.freeze({
      status,
      checks: Object.freeze(checks),
      assets: Object.freeze(assets),
      speculativeBoundary: DeploymentInstallRegressionAudit.speculativeBoundary
    });
  }
}
