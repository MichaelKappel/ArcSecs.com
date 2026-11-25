# Decision D-001 — UAIX docs-folder book research workspace

[Durable index](../index.md#decisions-and-implementation) · [Implementation inspection](../implementation-history/2026-11-22-inspection-and-setup.md)

- **Status:** Accepted for portable-package creation by the most recent explicit user instruction. Not installed into a user Git repository.
- **Authority:** requesting project sponsor controls editorial and workspace scope.
- **Selected exact URL:** https://uaix.org/en-us/tools/ai-memory-package-wizard/?memory=docs-folder&loops=1
- **Configuration:** Simple `docs/long-term-memory/` durable memory, `.uai/` active memory, `loops=1` reviewed next-task suggestion.
- **Rationale:** project is a single ArcSecs book plus nine science reports and figures; the default no-docs profile was explicitly superseded by two `docs-folder` instructions.
- **Alternative rejected:** pretend there is a software repository/framework and generate fabricated architecture/routes/build/deploy secrets.
- **Content ownership:** book Markdown is the reader-facing narrative; nine full-depth reports stay in `reports/`; source data/claim ledger and evidence rules belong to `research/`; `.uai/long-term-memory.uai` only routes to durable files.
- **Consequences:** explicit traceability, rapid new-AI pickup, source-preserving write-back; no hidden Git/deployment claims.
- **Risks:** science citations and numerical simulations have not all been independently verified; original publication scripts not provided; no actual repo branch/history/permissions known.
- **Next decision needed:** if an actual software or website repository is later supplied, inspect its root and existing AGENTS/.uai/docs before merging, and review potential collisions rather than overwrite.
