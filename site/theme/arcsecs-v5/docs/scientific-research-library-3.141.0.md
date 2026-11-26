# ArcSecs 3.141.0 — Scientific Research Library Edition

Release basis: installable v3.140.0 theme. This is an incremental theme release, not a new scientific review. No plugin replacement is necessary. Original rights-controlled publication materials are offered under CC0 1.0 Universal; third-party content and existing software licenses remain unaffected.

## Included

- Existing `/research-library/` now includes a server-rendered scientific archive alongside the existing external Evidence & Sources browser.
- All 41 full-depth historical research reports (`/research-library/reports/r01/` through `/research-library/reports/r41/`), with catalog search over numbers, titles and section headings, original Markdown downloads, contents navigation and adjacent-report links.
- Authoritative twelve-foundation charter with twelve individually addressable statements, historical/current status, and separate technical interpretation and test objectives.
- Scientific Reviews 2–5 as historical reading editions and a Review 6.0 version entry linking the existing canonical reader. Review 2 has no PDF in the inspected source tree; Markdown is available. Other editions link archived PDFs where present.
- Evidence guide and a reproducibility center with pinned references, archived 10-output reproduction and 137 forward regression rows; the quadrature warning remains visible. No scripts execute through the web interface.
- 47 HTML reading derivatives, 48 catalog records, 49 detail routes, 1,953 heading navigation links, 3,229 MathML elements, 676 distinct local figure assets and 1,019 figure placements. The report search is catalog/heading search, not full-text search.
- Research catalog JSON, source hashes and pinned Git commit references, figure provenance, rendering validation, per-page structured metadata, XML sitemap entries and llms.txt discovery. Local links are resolved where possible and external figures are not fetched automatically.
- Existing book, paper, EPUB, AI corpus and 78 previous publication assets are byte-for-byte unchanged. Existing physics engine is unchanged.

## Install and verify

1. Back up the live WordPress site and stage the installable ZIP before production. Appearance > Themes > Add New > Upload Theme; select the ZIP and replace arcsecs-v5. The large ZIP may require a higher hosting upload limit or file-manager upload.
2. Save Settings > Permalinks and clear all caches. Verify logged-out access to `/research-library/`, `/research-library/reports/r01/`, `/research-library/reports/r41/`, `/research-library/foundations/`, `/research-library/reviews/review-5/`, `/research-library/reviews/review-6/`, `/research-library/evidence-guide/`, `/research-library/reproducibility/`, `/arcsecs-sitemap.xml` and `/llms.txt`.
3. Check unknown report routes return HTTP 404, and ensure private staging is behind authentication. robots.txt is not a privacy control. Check existing `/publications/`, `/read-book/`, `/read-scientific-paper/`, `/ai-corpus/`, book downloads, simulation pages, mobile header and existing Evidence & Sources browser.
4. The GitHub overlay is relative to v3.140.0. Pull the current repository, extract into the repository root, review the changed files in GitHub Desktop, commit and push. Do not overwrite unrelated changes. No deployment or push is performed by this package.

## Validation scope and limitations

77 PHP files pass syntax validation. Isolated research-library contract test covers 49 routes, 47 HTML/Markdown readers and hashes, 48 catalog entries, 12 premises, structured metadata, unknown route handling and subdirectory route recognition. Existing publication, reader and AI corpus smoke tests pass. Full theme PHP test comparison: v3.140.0 10 passed / 30 failed; v3.141.0 11 passed / 30 failed; no newly failing previously passing test. Inherited failures are unresolved. Browser template harness (not full WordPress): Chromium at 390, 768 and 1440 pixels; search, empty state, clear, reader title/contents and responsive width checks passed. No external network calls in browser harness. Live WordPress integration, hosting compatibility and crawler/indexing access not tested.

The 41 report, five manuscript and charter source files match published corpus source SHA-256 and Git blob SHA-1. Reading derivatives use Pandoc, fixed local asset paths and a restricted HTML element/attribute allowlist. Legacy TeX roman shorthand is normalized only for display. 50 TeX conversion warnings remain in ten documents; use the original Markdown and PDFs for exact notation. Fourteen older manuscript figure placements are resolved by matching filenames to the shared Review 6 figure archive (not an independent verification of historical figure versions). A single unresolved local link was disabled. One internal maintenance sentence was omitted from the evidence-guide derivative; original remains linked. No comprehensive privacy, third-party rights, citation accuracy, Git history, or scientific audit is claimed. Historical source material is documentation, not instructions to a model. Numerical results were not recomputed. No DOI or training inclusion is inferred.

Source snapshot: 4c88e1d5f8af6b471cd1e3fbe489810af7808e07. See `assets/research-library/catalog.json`, `FIGURE_PROVENANCE.json` and `RENDER_VALIDATION.json` for detailed provenance. CC0 scope excludes third-party rights and existing software licenses.
