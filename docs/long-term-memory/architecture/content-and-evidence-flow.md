# ArcSecs Content and Evidence Architecture

[Durable index](../index.md#decisions-and-implementation) · [Evidence policy](../research/evidence-and-verification.md)

## What actually exists
A single long-form book in Markdown and three reading editions; nine restored Markdown report bodies; 22 PNG figures; CSV claim/test/audit ledgers; a typed UAIX startup and routing layer; Python stdlib validators. There is **no supplied app executable, HTTP route, API schema, database, cloud account, or deployed website source checkout**.

## Ownership and flow
1. Source observation and papers → verified research note with DOI/dataset/measurement and provenance (to be added by future project work).
2. Quantitative candidate mechanism and method → owning full technical mission report `../reports/` and figures under `../research/figures/`.
3. Claim-evidence/test status → `../research/claim-ledger.csv` and `../research/test-matrix.csv`.
4. Reviewed synthesis/editorial decision → `../decisions/` and `.uai/decisions.uai`.
5. Book narrative → `../../../book/book.md`; reader PDF/DOCX/EPUB should be regenerated after source modifications.
6. UAIX hot records and pointer ledger route the next researcher; do not paste entire reports into them.

## Failure paths
- Citation points to placeholder/non-primary source → quarantine as unverified and source-check.
- Fit claims executable code but no script/data supplied → mark `NOT REPRODUCED`, do not report as measured discovery.
- A hypothesis contradicts a measured benchmark → retain benchmark, revise mechanism and log trial/failure.
- Figure link relocated → run `tools/validate_package.py` and check image count/hashes.
- Book Markdown changes but editions do not → mark those editions stale until rerender and visual verification.
- Future Git repo supplied → inspect nested AGENTS and existing .uai first; do not overwrite.
