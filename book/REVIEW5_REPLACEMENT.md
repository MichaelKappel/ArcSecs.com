# Protected Scientific Review 5.0 replacement — 2026-11-24

The user supplied `ArcSecs_Scientific_Paper_Review_5(1).pdf` as the updated ending of BEYOND SPACETIME. This replaces Review 4.0 in the printed volume only; both Review 3.0 and Review 4.0 source PDFs remain preserved unchanged. Review 5.0 is now the authoritative, content-locked final section, under the separate contributor's ownership. No scientific text, figures, equations, tables, references, internal folios or original page order were changed. The original is copied byte-for-byte into `book/review5-original.pdf`.

## Editorial closure

The prior audit issues SCI-001 and PUB-003 are addressed in Review 5.0: internal p. 69 explicitly distinguishes level-energy and free-energy formulations of detailed balance, and pp. 71–72 distinguish historical book pagination from the Review 4.0-era page references. The latter references describe the older edition, not a new page count. Internal p. 108 also describes an earlier Review 4.0 release; the current book page mapping is stated below. No alteration was made to these historical statements.

Part XXXIII (internal pp. 73–95) reports a bounded local classical action, differential conversion and polarization calculations, reversible finite-capacity kinetics, interval comparison for the original static smooth-wall AGE-H reference, and a finite-aperture transport control. The reported contact vertex fails narrow-beam transport in the specified example; retain it as an exclusion control, not a cosmological aging solution. The reported interval certificate is conditional on the stated reduced model and interval arithmetic, not a universal result. This update is a publication assembly, not an independent validation or authorization to merge the contributor's new scientific claims into the main research model. The companion executable code, datasets and editable Review 5.0 source were not supplied.

## Assembly and checks

- Main book and final-section divider: pages 1–345.
- Page 346: intentional recto-alignment blank.
- Review 5.0: pages 347–455 (internal page n = hardcover page n + 346).
- Page 456: intentional closing blank.
- Native 6.14 × 9.21 inch trim, no scaling; original review folios preserved, additional book folios below original content.
- All 109 source pages match normalized extracted text and rendered pixels above the added folio at 72 PPI; all 122 source links preserve the mapped destination or URI. Embedded fonts, zero detected text/image margin violations, zero detected replacement characters. Forty raster placements; none materially below 300 effective PPI (minimum 300.0 rounded).
- Main-book automated suite: 451 tests passed; this is not an independent rerun of the contributor's reported calculations.
- Main-book changes limited to publication identity, review cross-references and editorial status. Twelve charter principles and 41 numbered historical reports unchanged. Earlier PDFs of the protected paper remain historical originals. Previous Word/EPUB files are historical main-only editions.

See `book/KDP_PREFLIGHT.json` and `book/FINAL_SECTION_LOCK.md` for exact hashes and geometry. Rebuild using `python tools/build_kdp_interior.py` from the project root, then `python tools/check_kdp_publication.py`. The required cover wrap must be generated for 456 pages and the selected paper/ink; the cover artwork is not a complete wrap. Publisher attribution, KDP Previewer and physical proof remain outstanding.
