# Release review — private draft

- Confirm KDP Select status and electronic distribution rights for the full book and overlapping paper. No full-text public posting until resolved.
- Review all third-party images, datasets, citations and historical reports for redistribution rights; do not assume a citation constitutes permission.
- Verify human rights/contributor authority and preserve AI contribution disclosure. ORCID supplied by investigator; profile ownership not independently authenticated here.
- Preserve existing theme/plugin GPL-2.0-or-later notices; no new license for book, paper, datasets or research software assigned.
- Do not expose `.uai` records, private instructions, credentials, deployment logs, or opaque backups. File-path filtering is not a complete secret or rights audit; review text and assets before any public release.
- Recheck website endpoints and crawler policies on staging. No automatic publishing, repository visibility change, or deployment.
- Review scientific claims and distinguish assumptions, simulations and external observations.

See `REPOSITORY_VALIDATION.json` and `SOURCE_PROVENANCE.csv` for verified file integrity and testing scope.

## Validation details

PHP syntax: 78 files passed; TypeScript `tsc --noEmit` passed. Plugin JS suite: 106 passed, 58 failed (original supplied ZIP: 120 passed, 65 failed). Theme PHP tests: 7 passed, 37 failed, identical aggregate to original archive. Plugin PHP tests: both fail version expectations. Missing upstream docs, differing package and PHP version labels, and intentionally omitted memory prevent a full green suite. No live WordPress integration test performed. Two historical reports had temporary signed download query parameters removed (four URLs); original copies remain in private master. Common text credential patterns yielded no matches afterward; binaries and all third-party rights remain unaudited.
