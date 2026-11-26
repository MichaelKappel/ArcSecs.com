# BeyondSpacetime.org — Explainer & Interactive Laboratory v1.2.0

Standalone, root-deployable website. Native PHP 8.1+ (64-bit), HTML, CSS and JavaScript; no WordPress, database, package manager, third-party runtime libraries, remote fonts or analytics. The homepage offers an optional YouTube video (privacy-enhanced embed loaded only after clicking Play); this is the sole new external runtime integration. Bundled artwork: supplied banner (optimized WebP) and the exact extracted ArcSecs compass emblem, with transparent PNG and multi-resolution root favicon.ico. Do not install inside ArcSecs's WordPress directory: this is the separate document root for BeyondSpacetime.org.

## What is included
- 44 server-rendered public pages: 6 original hubs/about/method/agent pages, 11 concept guides, 13 experiment pages, and 8 discovery/learning pages and 6 immersive exploration pages.
- The twelve research premises, physical-first approach, photon mass and history, time/clock calibration, conventional hot Big Bang reference, physical recession, hypothetical bubble domains, distances, gravity and propulsion.
- Four guided learning expeditions (19 stages and eight self-check questions), a concept atlas (11 nodes and 23 editorial connections), a 20-term glossary and a server-rendered same-model two-case comparison workbench with shared plot scales. Learning progress is stored only in local browser storage when available; reset is provided.
- PHP equation engine, browser charts, seven schematic sample walkthroughs with manual scrubbing and optional playback, editable parameters, model limitations, JSON and CSV exports, plus parameter-only recipe save/load and comparison JSON export. No JS required for basic reading or form-based calculations; JS enhances graphics/exports/agent interface.
- Direct ArcSecs reader anchors and research/simulation links, not copied book/paper files. Source anchors were checked against the supplied ArcSecs v3.142.0 release HTML; the public website's live deployment was not verified.
- SEO: single canonical HTTPS hostname, descriptive titles/descriptions, Open Graph, responsive accessible navigation, 301 canonical trailing slash, real 404/405, sitemap.xml, robots.txt, Article/BreadcrumbList/LearningResource and visible Q&A JSON-LD. Search results and API responses excluded from indexing. No manufactured ratings, citations or keyword pages.
- AEO/GEO: direct answers followed by substantive explanations, clear epistemic labels, source references and related labs. `llms.txt` is an optional discovery guide, not a ranking requirement. No guarantee of search placement, AI citations or training inclusion.
- AG-UI: deterministic native POST SSE endpoint supporting a deliberately limited 1.0 subset. No external AI/LLM, credentials, browser SDK, agents with external tools, or persistent memory. See `/agents/`.

- Five immersive 3D scenes: photon history, cosmic bubble boundary, physical recession, conventional hot Big Bang, and propulsion. Native WebGL line/point rendering with Canvas 2D perspective fallback; the scene geometry is illustrative and the numerical results come from the same PHP calculation engine. Manual rotation, zoom, opt-in trajectory playback, JSON export, no-JS server-rendered results. Static bubble/drive scenes do not simulate time evolution.

## Deploy
Read DEPLOYMENT.md. Extract the ZIP **contents** directly into the domain's document root. Include `.htaccess`, `app/` and `assets/`. Verify HTTPS, redirects, MIME types and protected internal files on the target server. Do not upload this ZIP itself into a public root. No build steps.

## Structure
- `index.php`: front controller, pages, sitemap, robots, JSON API and AG-UI endpoint.
- `app/topics.json`: original guide content, related pages and ArcSecs source links.
- `app/labs.json`: experiment parameter bounds, equations, units and source links.
- `app/learning.php`: paths, atlas relationships, glossary, shared comparison validation and templates.
- `app/explore.php`: immersive scene catalog, routes and PHP-rendered controls.
- `assets/explore-core.js`, `assets/explore.js`: deterministic geometry and native graphics, with fallback.
- `app/models.php`: single authoritative computation implementation.
- `app/render.php`: escaped templates, HTML metadata, chart/metric/table rendering.
- `assets/site.css`, `assets/site.js`, `assets/learning.js`: responsive presentation and enhancement.
- `router.php`: development-only PHP built-in server routing.
- `tests/`: native PHP scientific and HTTP regression suites; denied by server configuration.

## API
`GET /api/v1/catalog/` returns complete topic/experiment metadata and source pointers, learning paths, glossary, atlas links and `immersiveScenes` metadata.
`POST /api/v1/experiment/` with JSON `{"experiment":"bubble","parameters":{"radius":1.6}}` returns schema `beyondspacetime.experiment-result.v1`, evaluated parameters, units/labels, sampled rows, metrics and limitations. Omitted parameters default; unknown keys, out-of-range values and forbidden branches return HTTP 400. Numeric parameters are bounded. Maximum input 32 KB. Population uses seeded Park–Miller PRNG and capped event count. All calculations are synthetic controls. The result JSON is not observational data.

`POST /api/v1/compare/` accepts `{"experiment":"parallax","left":{"baseline":1},"right":{"baseline":2}}`. Both cases use the same validated solver. Response contains the two complete results and metric differences (right minus left; null for nonnumeric metrics).

`POST /api/ag-ui/` accepts a RunAgentInput-shaped request with threadId, runId, messages array and state `{ "topic": "light-history" }` or `{ "experiment": "bubble", "parameters": {"radius":1.6} }`. The actual user message is not passed to a model or executed; state selects a known local computation. Emits `RUN_STARTED`, `TEXT_MESSAGE_START`, `TEXT_MESSAGE_CONTENT`, `TEXT_MESSAGE_END`, `STATE_SNAPSHOT`, `RUN_FINISHED` using SSE `data:` records. Invalid requests return HTTP 400 before starting. `/.well-known/ag-ui.json` is a project-specific capability description, not an official AG-UI registry. Spec: https://docs.ag-ui.com/spec/1.0/schema . No claimed full protocol certification or SDK interoperability. Proxy buffering can affect delivery.

## Quality tests
From the root in a local environment:
```
php tests/models-test.php
node tests/explore-test.js
php -S 127.0.0.1:8080 router.php
```
In another terminal (or hosting support's test environment):
```
php tests/http-test.php http://127.0.0.1:8080
```
Node is only required for the optional geometry test suite, not production. Requires PHP's HTTP stream wrapper (`allow_url_fopen`). All production functionality uses PHP, HTML, CSS, JS only. TEST-RESULTS.txt describes actual release checks. No live production, external indexing, accessibility certification or full AG-UI conformance claimed.

## Scientific and licensing scope
The book and Review 6.0 remain authoritative on ArcSecs.com. Stipulated research premises, conditional mathematical derivations, numerical verification and observational evidence are distinct. The site does not deny the conventional hot Big Bang or established relativity measurements. Alternative models remain hypothetical. No private .uai material, manuscripts, data archives or duplicates of full ArcSecs simulators are included. User-supplied artwork is retained for the site; original explanatory and software source are delivered to the project owner. ArcSecs's existing CC0 and GPL scope remains governed by its own licensing notice. No third-party code bundled.
