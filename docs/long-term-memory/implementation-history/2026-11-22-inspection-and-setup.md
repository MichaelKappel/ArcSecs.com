# Inspected Implementation History — UAIX setup

[Durable index](../index.md#decisions-and-implementation) · [Decision record](../decisions/2026-11-22-uaix-book-workspace.md)

## Inspected source evidence
- `/mnt/data/ArcSecs_Single_Book_2026-11-22/`: four matching book editions (Markdown, DOCX, PDF, EPUB), with 33,516 words in Markdown and 33 chapter headings. Imported byte-for-byte to `book/`.
- `/mnt/data/ArcSecs_Full_Depth_Research_Restoration_2026-11-22/`: nine restored reports with full Part II material, approximately 145,689 words in previous restoration estimate; 22 figures. Imported reports to `docs/long-term-memory/reports/` with only a navigation note and figure-link relocation; copied figures unmodified.
- `/mnt/data/ArcSecs_Clean_Advocacy_Handoff_2026-11-22/`: claim, test and source ledgers imported as reference seeds.
- `/mnt/data/ArcSecs_Audit_Issues_2026-11-22.csv`: audit issue register imported as historical reference, not new accepted verdict.
- No nearest `AGENTS.md`, nested agent instructions, `.uai` records, or `.git` checkout found in the inspected book/report material roots. No application build, route, API/test or deployment configuration found.

## Work performed
Created `AGENTS.md`, required typed `.uai` records, durable docs layer and linkable report index, scope-specific source/claim/evidence controls, checksum manifest, Python stdlib validator/unit tests, and delivery ZIP. No user-owned source files were modified, deleted, moved or overwritten. No credentials were acquired. No live deployment occurred.

## Selected wizard URL
https://uaix.org/en-us/tools/ai-memory-package-wizard/?memory=docs-folder&loops=1

## Scope and residual risks
This is a **portable project-root archive** suitable for review/import; it is not an in-place change to an unknown external repository. Upstream numerical source code, notebooks, covariance files, raw experimental datasets, Git history and deployment permissions remain unavailable. Scientific manuscripts and source URL claims need independent review. Generated editions have the historical layout already rendered in prior work, but this setup did not rerender those files.


## Later 24-report inventory reconciliation
Recovered the fifteen previously revised (selective) report texts from the earlier existing handoff ZIP without re-upload. Added as R-10 through R-24, including the out-of-scope governance-methodology record. Kept nine full-depth reports and figures untouched. Did not import old original source reports or claim the 15 short summaries are full-depth. See [24-report coverage](../research/24-report-coverage.md).
