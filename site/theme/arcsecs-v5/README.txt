ArcSecs V5

This version refines the ArcSecs theme with:
- a much more compact header/menu bar
- more balanced headline and card typography
- improved logo presentation
- visual image thumbnails inside the Redshift, Photon Mass, and Dark Sector home panels
- bundled theme-local imagery and a self-contained stylesheet fallback
- AI/crawler endpoints for robots.txt, llms.txt, and the ArcSecs sitemap
- a dedicated Standard Cosmology vs. ArcSecs comparison page at /standard-cosmology-vs-arcsecs/
- v5.0.9 polish for the comparison page observation checkpoints, prediction ledger, glossary, SEO metadata, and home hero CSS

Install:
1. Appearance > Themes > Add New > Upload Theme
2. Upload arcsecs-v5.zip
3. Activate ArcSecs V5
4. Appearance > ArcSecs Repair > Repair Home and Blog if the host has stale page templates
5. Settings > Permalinks > Save Changes
6. Clear any cache

Important routes:
- /standard-cosmology-vs-arcsecs/
- /cosmic-anomalies-tracker/
- /arcsecs-physics-engine-demo/
- /arcsecs-physics-engine-demo/ai-summary/
- /llms.txt
- /arcsecs-sitemap.xml


## v5.0.9 Cosmic Anomalies Tracker

- Added the virtual `/cosmic-anomalies-tracker/` page.
- Added a dashboard and interactive anomaly tracker for Hubble tension, JWST mature early galaxies, SPARC/rotation curves, El Gordo, Lithium-7, photon mass/Proca electrodynamics, tired light/redshift duality, and Dark Matter Drive implications.
- Added scoped `anomalies-` CSS and a small framework-free JavaScript enhancement for search, category/status filters, expand/collapse controls, copy-section-link buttons, and reading progress.
- Added SEO metadata, Open Graph, Twitter/X cards, TechArticle JSON-LD, BreadcrumbList JSON-LD, and FAQPage JSON-LD.
- Added `docs/cosmic-anomalies-tracker-page.md` and source-level tests for the new page.

## v5.0.9 Cosmic Anomalies Tracker Pressure Ledger

- Added the pressure ledger section to /cosmic-anomalies-tracker/.
- Added observation maturity, mainstream fit pressure, ArcSecs simulation readiness, demo priority, model-cost, and failure-condition language.
- Added reset filters and shareable query-string state for tracker controls.

## v5.0.10 Cosmic Anomalies Tracker Run Builder

- Added a guided simulation run-card builder with copyable experiment recipes.
- Added profile data for all eight anomaly topics.
- Added HowTo JSON-LD and tests for the builder workflow.


## v5.0.16 Cosmic Anomalies Tracker Claim Hygiene

- Added a `#claim-hygiene` section to `/cosmic-anomalies-tracker/` that separates established observations, active interpretations, boundary constraints, and speculative extensions.
- Added an Evidence Grade filter to the tracker with URL query-state support through `anomalyEvidence`.
- Added visible evidence-grade badges to tracker cards and evidence-grade text to dashboard/detail panels.
- Updated JavaScript filtering, reset behavior, copied section links, schema `hasPart`, FAQPage JSON-LD, styles, tests, docs, and handoff memory.

## v5.0.16 Cosmic Anomalies Tracker Observation-First Mode

Added an observation-first review mode to the Cosmic Anomalies Tracker. The toggle dims ArcSecs-only speculative lanes while preserving observations, mainstream explanations, evidence grades, pressure points, and kill tests. The state is shareable with `anomalyMode=observation`, appears in schema/AI-readable summaries, and has source-level test coverage.


## v5.0.16 Cosmic Anomalies Tracker Hero Overview
- Added a high-resolution top-of-page PNG banner to `/cosmic-anomalies-tracker/`.
- Bundled the artwork locally at `assets/images/cosmic-anomalies-tracker-overview.png`.
- Updated the page's social-preview image to use the new anomalies overview artwork.


## v5.0.16 Cosmology Comparison Visual Polish
- Added a high-resolution overview PNG to `/standard-cosmology-vs-arcsecs/`.
- Bundled the image locally at `assets/images/standard-cosmology-vs-arcsecs-comparison.png`.
- Added a visual hero figure and a four-card summary strip to improve first-glance readability.


## v5.0.16 UAI Memory System Update
- Promoted the legacy root `.uai` memory file into a standards-aligned `.uai/` handoff suite.
- Added typed memory files including startup packet, receiver brief, short-term memory, long-term pointer, test plan, file handoff, and intake ledger.
- Preserved the old `.uai` file in `.uai/archives/legacy-root-uai-memory-v5.0.14.md`.
- Added current source briefs and implementation prompts into `/docs/` for long-term memory.


## v5.0.16 Primary Navigation Fix
- Added a primary-menu filter so `/standard-cosmology-vs-arcsecs/` and `/cosmic-anomalies-tracker/` appear in the top navigation even when a custom WordPress menu is assigned.
- The fallback menu already had these links; this update covers custom menus too.


## v5.0.19 ArcSecs Research Hub
- Added `/arcsecs-research-hub/` as the Start Here route.
- Added six visual path cards: New to ArcSecs, Compare the Physics, Track Cosmic Anomalies, Run the Simulation, Explore Propulsion Concepts, and For AI / Researchers.
- Added a home-page sitewide CTA strip.
- Added SEO metadata, schema, sitemap, llms.txt, docs, .uai memory, and route-link tests.


## v5.0.19 Page polish and TypeScript source contracts
- Added real TypeScript source examples under `assets/ts/arcsecs-physics-engine/`.
- Updated `/standard-cosmology-vs-arcsecs/` to show the TypeScript source path, file list, and a code sample.
- Polished oversized hero typography, sparse right-side hero panels, and the demo companion panel.


## v5.0.19 Dark Matter Drive Simulator Main-Site Integration
- Promoted the plugin-owned `/dark-matter-drive-simulator/` route from the theme without implementing the simulator in the theme.
- Added one duplicate-safe top navigation link labeled `Dark Matter Drive`.
- Added home, Research Hub, Physics Demo fallback, Cosmology Comparison, and Cosmic Anomalies Tracker contextual links.
- Added sitemap and llms discovery entries because the theme owns those endpoints.


## v5.0.20 Compact Header Navigation
- The plugin-owned `/dark-matter-drive-simulator/` link now appears as `DM Drive` in theme-controlled navigation.
- Known ArcSecs Primary Menu links are normalized to compact labels to reduce header crowding.
- The theme still does not implement or duplicate simulator functionality.


## v5.0.24 header/navigation continuation
- Added a last-pass rendered-menu de-duplication filter for known ArcSecs route links so the theme keeps only one required route item if another extension or custom menu injects duplicates.
- Added `data-arcsecs-route` and `aria-current="page"` handling for known Primary Menu route links.
- Expanded the ArcSecs Repair admin page with route and navigation diagnostics, including a DM Drive 404 checklist that preserves plugin ownership.
- Added source-level test coverage for route diagnostics, duplicate suppression, and active-state attributes.


## v5.0.24 Primary Menu Route Repair
- Added an explicit ArcSecs Repair admin action to audit and repair the assigned Primary Menu.
- The repair keeps the plugin-owned simulator boundary intact; it only fixes public menu links and labels.
- The repair adds missing known route links, compacts labels, retargets obvious stale DM Drive slugs to `/dark-matter-drive-simulator/`, and removes duplicate known route links where safe.
- Long-term documentation added: `docs/theme-primary-menu-route-repair-v5.0.24.md`.

## v5.0.24 Mobile Navigation Accessibility

- Hardened the theme-owned mobile header menu.
- Escape, outside click, menu-link click, and desktop resize now close the mobile menu.
- Added body open-state styling and bounded mobile nav scrolling.
- Preserved plugin ownership of `/dark-matter-drive-simulator/`.


## v5.0.24 Route Health Dashboard
- Added an admin-facing ArcSecs Route Health Dashboard under Appearance > ArcSecs Repair.
- Tracks theme routes, plugin-owned DM Drive route, llms.txt, arcsecs-sitemap.xml, robots.txt, top-nav presence, sitemap membership, and llms membership.
- Live HTTP checks run only when requested.


## v5.0.25 Memory Completeness Audit
- Added missing uploaded/pasted prompt sources to `/docs/` as stable Markdown files.
- Added `docs/ArcSecs Uploaded Source Brief Mapping.md`.
- Added `docs/ArcSecs Research Archive Manifest.md`.
- Added `docs/ArcSecs Memory System Audit v5.0.25.md`.
- Added `tests/php/theme-memory-completeness-test.php` to guard the memory contract.


## v5.0.28 TypeScript Source Browser
- Replaced inert TypeScript file-name chips on `/standard-cosmology-vs-arcsecs/#architecture` with a dynamic source browser.
- The page now scans `assets/ts/arcsecs-physics-engine/` at render time and renders each `.ts` and `.md` file as a clickable `<details>` source panel.
- Added `docs/TypeScript Source Browser v5.0.28.md` and expanded source tests.


## v5.0.28 TypeScript Source Explorer Hardening
- Added `assets/js/typescript-source-browser.js` for the Standard Cosmology comparison page.
- Added filter, copy-selected-source, line counts, one-open-file behavior, and hash-deep-link support for bundled source files.
- Kept the PHP folder scan as the source of truth so every `.ts` and `.md` file in `assets/ts/arcsecs-physics-engine/` remains viewable without hardcoding a template list.


## v5.0.28 Performance Sweep
- Disabled duplicate full inline CSS output by default while keeping an opt-in compatibility fallback.
- Deferred theme scripts and conditionally loaded page-specific JavaScript.
- Added WebP companion assets and route-aware hero image preloading.
- Cached dynamic TypeScript source-contract scanning.
- Added `docs/ArcSecs Performance Sweep v5.0.28.md` and `tests/php/theme-performance-sweep-test.php`.


## v5.0.31 SEO Sweep
- Added centralized public route SEO manifest through `arcsecs_get_public_route_seo_entries()`.
- Added front-page metadata and richer social metadata for theme-owned routes.
- Added Open Graph image dimensions/alt text and Twitter/X image alt text.
- Added global Organization, WebSite, SearchAction, ItemList, and SiteNavigationElement schema nodes.
- Enriched `arcsecs-sitemap.xml` with image sitemap entries for image-backed routes.
- Added an SEO route manifest to generated `llms.txt`.
- Added `docs/ArcSecs SEO Sweep v5.0.31.md` and `tests/php/theme-seo-sweep-test.php`.


## v5.0.31 Science Page Readability Sweep
- Added reader-path sections to `/standard-cosmology-vs-arcsecs/` and `/cosmic-anomalies-tracker/`.
- Added scan-summary callouts so visitors can move from overview to mechanism to ledger to demo without hitting a wall of text.
- Added deeper-link chips for major sections and preserved all existing science content.
- Added `docs/ArcSecs Science Page Readability Sweep v5.0.31.md` and `tests/php/theme-science-readability-sweep-test.php`.


## v5.0.31 Home and Research Hub Conversion Polish
- Simplified the home hero action row so first-time visitors are not confronted with too many competing CTAs.
- Added a six-step Primary Path section to the home page.
- Added a matching Primary Path stepper to `/arcsecs-research-hub/`.
- Kept all existing routes, SEO, sitemap, llms.txt, route health, memory, and plugin/theme ownership boundaries intact.
- Added source-level test coverage for the new primary path and route links.

## v5.0.33 Evidence & Sources Layer
- Added a reusable Evidence & Sources component to the home page, Research Hub, Standard Cosmology comparison page, and Cosmic Anomalies Tracker.
- Grouped sources by Hubble tension, JWST early galaxies, SPARC rotation curves, El Gordo, Lithium-7, Proca photon mass bounds, tired-light constraints, and dark matter/propulsion concepts.
- Each card now states what the source supports and what it does not prove.
- Added source schema nodes and `llms.txt` evidence source summaries.

## v5.0.33 Evidence & Sources Layer
- Added a reusable Evidence & Sources component to the home page, Research Hub, Standard Cosmology comparison page, and Cosmic Anomalies Tracker.
- Grouped sources by Hubble tension, JWST early galaxies, SPARC rotation curves, El Gordo, Lithium-7, Proca photon mass bounds, tired-light constraints, and dark matter/propulsion concepts.
- Each card now states what the source supports and what it does not prove.
- Added source schema nodes and `llms.txt` evidence source summaries.


## v5.0.33 Evidence Source Browser
- Added a progressive-enhancement source browser for the reusable Evidence & Sources component.
- The source component now includes search, source-type filtering, reset behavior, live visible-source counts, and topic jump chips.
- The browser appears wherever the reusable source layer appears: home, Start Here, Standard Cosmology vs ArcSecs, and Cosmic Anomalies Tracker.
- Native source cards remain visible without JavaScript.


## v5.0.34 Research Library Links
- Added `/research-library/` as a theme-owned public Evidence & Sources library.
- The page reuses the source map and browser from the Evidence & Sources layer.
- Added links from the home page and Research Hub.
- Added SEO, schema, sitemap, llms.txt, `.uai/`, `/docs/`, and source tests.


## v5.0.36 Multi-Messenger Light Delay Page
- Added `/multi-messenger-light-delay/` as a theme-owned science page.
- Added uploaded multi-messenger timing diagrams as local theme image assets with WebP companions.
- Added uploaded source reports into `/docs/` long-term memory.
- Added route SEO metadata, schema, sitemap, llms.txt, route health, and internal links from Home, Research Hub, Research Library, Standard Cosmology, and Cosmic Anomalies.


## v5.0.36 Framework Memory Completeness
- Added uploaded no-spacetime / no-literal-time-dilation research files into `/docs/` long-term memory.
- Added a framework integration note so future agents preserve the ArcSecs split between mainstream observations and speculative interpretation.
