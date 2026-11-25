# BEYOND SPACETIME — audit response, 2026-11-24

The supplied audit is archived unchanged as `original-audit.md`. This release is a targeted main-manuscript correction, not a new empirical theory or a comprehensive scientific re-review. The twelve principles and historical sources remain immutable. The 40-page Review 3.0 is protected by the investigator: do not integrate, edit, or silently correct it. Its original page numbering and content remain separate from the main book.

| Audit item | Disposition |
|---|---|
| A1 tidal tensor | Main book uses acceleration gradient, negative potential Hessian; trace and relative acceleration are explicit. Existing point-neighbor solver already uses correct sign. |
| A2 bath endpoint | Corrected to 1 − 10⁻¹⁶; independent 65-digit Decimal calculation in `tools/audit_revision_v1.py`, with exact printed endpoints in `calculations.txt`. Old binary64 scans remain approximate; use the high-precision check for near-unity values. |
| A3 wall monopole | Mean radius carries monopole, perturbation sum starts at ell=1. |
| A4 finite density | Main book wording corrected; the protected paper's wording stays unchanged. |
| B1 frame distinction | Added velocity derivative, common-frame acceleration, and five-case arrival speed table to 32A. Kinematic benchmark does not enforce common-frame ceiling. |
| B2 emission characteristic | Introductory C-01 bridge states exact equality is not attained for finite positive-gap packet; front and group differ. |
| B3 atomic calibration | C-01 bridge connects matched impedance to the previously derived conditional blueshift; matter-rate law remains unsolved. |
| B4 operational flux | Clock-rate and energy-unit qualifications added to D-05, 32A and CR8. |
| B5 distance examples | Separate cosmological-time arrival-normalized example from stationary emission-normalized C-01 illustration; explicit 1 Mpc ratio. |
| B6 Foundation 12 | Explicit estimator/epoch/anchor distinction. Seven object dossiers still need systematic primary-source verification. |
| B7 mechanisms | Keep scalar-emission B-01a distinct from protected Part XXXI dressing history. No scientific integration without authorization. |
| B8 convergence | Main-book acceptance gates and handoff updated; no claim of new continuum convergence. |
| C selected checks | Added independent reproducible BS3 and OF5 checks and tidal sign test; other audit calculations are source-reported, not all rerun here. |
| D references | Retain original provenance identifiers; comprehensive bibliographic unification, permanent public repository, source verification and per-table reproduction mapping remain pending. |
| E1 final paper | Front matter and closing revision note identify the latest main-book and protected sections. Do not merge the locked manuscript. Report inventories differ in scope. |
| E2 numbering | Retain original page and heading numbering; book folio crosswalk is supplied. Renumbering the protected original requires its maintainer's source. |
| E3 print | Five main-book plots regenerated at 450 source DPI; publication information page added without inventing rights owner, ISBN or imprint. Remaining low-resolution inherited figures and small protected-paper type need proof review. No KDP acceptance asserted. |

## Reproduction and next gate

Run `python -m tools.audit_revision_v1` from the project root. `python -m unittest discover -s tests -q` exercises the project. The dependency snapshot records this execution environment, not a portable lockfile. Preserve the protected PDF checksum and historical reports. Future changes must maintain the frame, clock and precision corrections. The next scientific step remains deriving the vector-bath amplitudes with reciprocal energy, momentum and spectral fidelity, without confusing the independently maintained dressing model with the scalar surrogate.

## Release verification

- 447 project tests passed (including four new audit regression tests).
- 384-page hardcover; 6.14 x 9.21 in; no detected text/image margin violations, embedded fonts, no Unicode replacement characters.
- All 40 protected source pages reproduced with exact text after whitespace normalization; source bytes unchanged. Internal review page n maps to hardcover page n + 344 (345–384); page 344 intentionally blank for recto alignment.
- Five plots regenerated from original numerical code at 450 DPI. Effective PPI minimum increased from about 222 to 275.1; 15 of 48 raster placements remain below 300 PPI.
- Representative page render inspection completed. No comprehensive proofread of every page or KDP approval is asserted. Previous Word/EPUB exports are retained as older main-book formats, not revised publication masters.
- The original 380-page edition remains in the preceding release archive. The 12 foundations and 41 historical reports are preserved.
