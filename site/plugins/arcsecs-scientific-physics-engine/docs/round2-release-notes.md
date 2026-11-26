# ArcSecs Scientific Physics Engine 3.141.2 — Round 2: Quality and automated testing

## Install

Replace only the ArcSecs Scientific Physics Engine plugin through WordPress Plugins → Add New → Upload Plugin. Keep theme v3.141.0 (or compatible later theme). Back up and stage first. The full ZIP contains the plugin directory. The GitHub overlay is relative to the v3.141.1 plugin and includes a repository-root GitHub Actions workflow. Pull the current repository before extracting the overlay, inspect the changes in GitHub Desktop, then commit and push. No deployment or GitHub push was performed here.

## Defects corrected

- All 44 named physics-engine controls now reach the worker, instead of 36. The omitted controls were photonPacketCount, intergalacticParticleDensity, forwardScatteringStrictness, softeningRadius, parallaxArcseconds, baselineAu, apertureRadius and backgroundSkyLevel. These changes can alter results for non-default inputs which had previously been ignored.
- Non-finite numerical telemetry is rejected with an explicit error, not exported as null/Infinity or rendered as a successful computation. Blank, null and nonnumeric inputs default rather than implicitly coercing to zero. Array configuration is rejected. Other existing normalization and scientific model formulas are preserved.
- Benchmark quality status derives from row test outcomes, ledger proxy status, quality-gate status and warnings instead of a constant pass. Grand-experiment stage status also checks these outcomes. The built-in ledger is a model bookkeeping proxy; its tired-light closure is constructed from one energy-loss term. The observational-fit score is heuristic, not a calibrated fit to measurements.
- A 120-second worker watchdog clears a hung computation, protects against late results and gives a recoverable status. Completed results remain distinct from parameter previews; stale parameter configurations cannot be exported as fresh run CSV/JSON.
- Scene JSON import validates registered scenarios, types, finite numbers, declared control ranges and select options before applying any values. It restores supplied controls and does not start a run. Invalid input is rejected atomically; unrecognized non-dangerous settings are counted and ignored. Files over 2 MiB are rejected. Prototype-like setting names are rejected.
- CSV now exports all accepted ticks and all 18 buffer channels, rather than 13 channels and sampled rows. Channels 13–17 are scenario-dependent: ramjet capture/radiator/thrust/efficiency/shield or synthetic visualization values and configured restitution/friction/beta in other scenarios. Existing 13 columns retain their order.
- Benchmark and grand-experiment evidence exports retain their existing strict context and include the actual completed worker sweep. They require a completed sweep. Current generated package metadata reflects 3.141.2; historical model/schema identifiers remain unchanged.
- A missing WebGPU cadence constant is restored from the main simulator's existing [18,24,36,54] contract. Dedicated worker no-adapter, adapter failure, unsupported message, fallback run and shutdown paths now execute. Actual GPU shader execution was not tested.
- Saved-run names render as text, not raw HTML. Save/delete errors are reported instead of treating browser storage as guaranteed. This is not a comprehensive application security audit.
- PHP version contracts now validate agreement with package.json rather than a fixed 5.8.36 version; assertions previously after exit now run. The PHP runner propagates every test/lint failure rather than masking intermediate failures.

## Reproduce the testing

Prerequisites: Node 22.16.0, PHP CLI 8.4, TypeScript 5.8.3, Python with Playwright 1.57.0 and Chromium. Tested locally with installed TypeScript and system Chromium. NPM registry access was unavailable for generating a lockfile; the dependency version is pinned exactly, but the CI dependency install has not run here.

- `npm install --ignore-scripts --no-audit --no-fund` (once, if TypeScript is not installed locally)
- `npm test` runs strict TypeScript compilation, all PHP test/lint files and the JavaScript regression gate. Writes `test-results/quality.json`.
- `python -m pip install -r tests/browser/requirements.txt` and `python -m playwright install chromium` (browser dependencies; on Linux use `--with-deps` when necessary).
- `npm run test:e2e` runs nine rendered browser smoke checks. Uses CHROMIUM_PATH if supplied, then system chromium if available, otherwise Playwright's Chromium. Writes screenshots and `test-results/browser/browser-validation.json`.
- `npm run test:all` runs the gate and browser tests. `npm run test:js` / `npm run test:strict` expose the unfiltered historical suite and intentionally remain failing while historical debt exists.

GitHub overlay includes `.github/workflows/arcsecs-plugin-quality.yml`. On pushes to main or PRs changing the plugin or workflow, and manual runs, it installs pinned dependencies, runs the gate and browser checks, and uploads test results. Workflow has read-only repository permissions and does not deploy. It has not run on GitHub yet.

## Verified results

| Check | Round 1 | Round 2 |
|---|---:|---:|
| JavaScript passes | 110 | 214 |
| Known historical JavaScript failures | 58 | 58 |
| New/unexpected failures | — | 0 |
| PHP test files passing | 1/3 | 3/3 |
| PHP syntax checks | 10 | 10 |
| Strict TypeScript compilation | pass | pass |
| Browser demo/viewport checks | 6 | 9 |
| Uncaught JS errors in browser checks | 0 | 0 |

104 new JS tests: 29 default deterministic worker scenarios, 29 stress cases, 11 additional worker contracts/invariants, 29 golden numerical comparisons, 4 GPU fallback tests, 2 UI/version contracts. The golden fixture hashes the actual v3.141.1 worker buffer and original metrics at 500 ticks for all 29 scenarios. New ledger status is excluded from comparison; all old metrics and all 9,000 samples per scenario match exactly under Node 22.16.0. This is a software regression baseline, not a physical benchmark. Exact fingerprints may be platform/V8-sensitive.

Browser tests exercise the actual rendered PHP shortcode templates, actual physics worker via blob URL, three widths (390,768,1440), focus-scoped controls, cancellation, parallax control-to-worker propagation, CSV shape, valid and invalid scene imports, benchmark and grand-tour exports, simulated watchdog/stale response, saved-run text escaping, simulated storage failure and route-planner actions. All nine had no uncaught JS errors and no horizontal document overflow. Network requests are blocked in this isolated harness; this does not prove live WordPress, deployment URLs, or actual GPU rendering.

## Historical test debt and gate behavior

All original JavaScript test files remain byte-identical. Baseline preserves all 168 Round 1 test identities. 44 failures are named missing historical documentation/private fixtures, 7 are fixed-version assertions, and 7 historical files fail to load due to a named missing fixture. The gate accepts only the recorded test identity and error code, with exact missing-fixture diagnostics where applicable; any novel failure, missing test, duplicate identity or runner error blocks the gate. For fixed-version assertions the error code and identity are checked, not the full assertion message, so this is not a substitute for modernizing those tests. No private memory is added. A temporary deliberate failing test verified exit code 1; it was removed, then the clean suite was rerun and passed the disclosed-debt gate. The raw suite still has 58 failures. The next quality round should recover historical behavior contracts with public fixtures, rather than add more exceptions.

## Limitations

No new empirical evidence or physical validation, no production WordPress integration, no actual hardware-GPU execution, no complete import/export or adversarial security audit. Tests do not demonstrate all possible parameter combinations or all reviewer workflows. The scientific research premises and model outputs remain speculative where originally classified as such. Existing theme legacy failures were not addressed. No private operational memory was included.
