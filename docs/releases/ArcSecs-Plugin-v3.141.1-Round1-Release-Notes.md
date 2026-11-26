# ArcSecs Physics Engine v3.141.1 — Stability & Demo Accessibility (Round 1)

Compatible target: ArcSecs Scientific Research Library theme v3.141.0. The theme is unchanged. Baseline: original arcsecs-scientific-physics-engine.zip PHP header 3.135.0 / npm metadata 5.8.36; filtered public repository source matches the working plugin baseline. The PHP header, WordPress cache version and npm version now agree at 3.141.1; internal historical packet and worker model version identifiers are retained.

## Changes

- Non-destructive existing-page upgrade/repair: do not overwrite page content, publish private drafts, or remove passwords. New missing pages are still created; activation and repair retain the existing menu/footer update behavior.
- Preserve existing robots.txt and X-Robots-Tag directives, respect the WordPress indexing preference, and avoid intercepting theme-owned llms.txt. Fullscreen plugin templates only render on a resolved published page without a password. AI summary endpoints refuse nonpublic/password-protected source pages. Robots directives are not authentication. Theme, host, WAF and real WordPress routing still require a staging check.
- Manual start by default. The explicit shortcode auto-run options still work; automatic sweep starts after scenario success instead of interrupting it. Reduced-motion and hidden-page guards. An independent Cancel computation button terminates the worker, invalidates its run ID, and preserves the last completed result. Handle worker-constructor failures and stale responses. Pause affects visual animation, not worker computation.
- Fixed-step visual tick accumulator, true measured draw frequency, lower paused refresh frequency, capped canvas pixel ratio. Space travel steps at a fixed mission interval and pauses when a tab is hidden; resize observer and input-state cleanup.
- Move misplaced archive receipt and human review methods from DemoMemoryStore to DemoController. Restore seven worker evidence panels using actual worker payloads with a readable summary and expandable raw JSON. Do not interpret worker self-reports as verified UI or deployment checks.
- Restore missing Dark Matter Drive route-planner/export controller methods and the sandbox panel's missing local variables. A route preview is not an executed autopilot run. The route button advances 12 model ticks using the existing planner and integrator. Use delegated click listeners for regenerated controls. Scope flight keyboard shortcuts to the simulator; release held inputs on focus loss, blur and pointer cancellation in space travel. Add accessible navigation among the three demos, research library, reproducibility and AI corpus.
- Preserve numerical worker and compute worker source bytes, existing formulas, archived research and theme assets. Timing and route-control integration changes can change demo trajectories compared with the earlier frame-dependent behavior. Not a new physics validation.

## Install

1. Back up WordPress and use a staging copy first. Keep the current v3.141.0 theme.
2. WordPress > Plugins > Add New Plugin > Upload Plugin. Select ArcSecs-Physics-Engine-v3.141.1-Round1.zip. Replace the existing plugin; keep folder arcsecs-scientific-physics-engine. Do not install a second copy.
3. Save Settings > Permalinks, clear caches, and test logged out. If page routing changes, check the WordPress page status and slug and use admin repair only as needed.
4. Open /arcsecs-physics-engine-demo/, /dark-matter-drive-simulator/, /space-travel-simulation/. Start a scenario, cancel, resume visual animation, compare evidence panels, test mission buttons and route planner, check exports, and verify robots.txt and llms.txt. Stage private/password pages separately to ensure no bypass by theme or server rules.
5. GitHub overlay: extract ArcSecs-Physics-Engine-GitHub-Update-v3.141.1.zip into repository root, retaining existing website theme. Review changes in GitHub Desktop, commit and push. No changes pushed by this task.

## Verification

- Strict TypeScript no-emit: pass. JS parse checks: pass. PHP syntax: 10 files (including preview harness) pass.
- Original filtered JS suite: 106 passed / 58 failed. New suite: 110 passed / 58 failed (four new regression tests). Legacy failure names unchanged; many historical tests depend on old package identifiers or unavailable private memory/docs, and some copy-boundary assertions fail. Two old PHP source marker tests still expect 5.8.36 and fail; new policy test passes ten assertions. Do not restore private operational memory just to satisfy old tests.
- Six isolated Chromium rendered-page smoke checks: engine, drive, and space at 390 and 1440 CSS pixels; no uncaught page errors or horizontal document overflow observed. Real worker run in a Blob worker, cancellation, focus/keyboard scope, held-input release, and generated route action exercised. Full WordPress integration, actual hosted worker URL/CSP, GPU hardware, assistive technology, complete export/import workflows and all legacy tests remain outstanding.
- Browser harness uses locally rendered shortcode markup and local assets with mocked WordPress PHP functions. It does not navigate to a deployed site. Reproduce from plugin root: npm run test:round1; python tests/browser/round1-browser.py (Python Playwright + /usr/bin/chromium). Legacy test suites remain intentionally unchanged.
- No full secret/history/third-party audit performed. No private .uai files included in this package. No deployment, GitHub push, or new physical-model simulations beyond smoke-test worker runs.

## Suggested next rounds

2. Scientific experiment and evidence overhaul: deterministic preset baselines, explicit units, comparison charts, schema validation, export/replay reliability; modernize legacy tests without masking failures.
3. Visual and interaction overhaul: simpler starter/advanced mode, keyboard and screen reader review, cross-device GPU fallback, performance profiling, responsive demo shell, theme-native cosmology and distance-time demos.
4. Research library integration: link scenarios to actual paper sections and evidence, preserve hypothesis/reference classifications, export documented data for AI corpus.
