# Review 5.0 reference and provenance register

Historical primary inputs and exact SHA-256:

- `0f60d9dc6b42611692e251316ca856f423567f137d5c727e56a207bced73350d` — ArcSecs_Scientific_Paper_Review_4.md
- `bb34df51ed37c40750c4cd93e203cf593d5d7a8747b036dd7b87f5590129db01` — ArcSecs_Scientific_Paper_Review_4.tex
- `0b5908555f273e36fedf9e01eaa11c953580102194d67b8354a94fac9e2eace9` — ArcSecs_Scientific_Paper_Review_4.pdf
- `84132339f77d37fdb2824c3a2fc6acfdc54b973746356d161bfcbfac57eb0ed7` — ArcSecs_Scientific_Review_4_Full_Update.zip
- `19dc1d814db352ade5bb5cea62738a7a7396d2b9212a0dbf8e6a32491848f8d6` — ARCSECS_INDEPENDENT_AUDIT(1).zip
- `6049aecf94758048ef9089f4016705215f83dc7085abc6d7d11992aac2713e00` — BEYOND_SPACETIME_Review4_2026-11-24_KDP_Hardcover_Interior(1).pdf
- `651e7e6bd9b29e5d21ad1d0a72709b01d9d4cb318f30b405a62fd0b1bc4df2ce` — BEYOND_SPACETIME_KDP_Hardcover_Interior(1).pdf
- `888e50cac0e1cf6c56523c3862b4cc1fd5e5253ca60ddb5179481c73d5a4ba40` — constraints.uai
- `0347078ef4ed69b32e5785b283a20ce054adaccef58908be3a10d95bc2855337` — c01-hypothesis.uai

Revised book is byte-identical to audit ZIP entry; 430 physical pages, numbered text 429. Original book and Review4 bytes unchanged. Audit manifest verified. SCI-001 and PUB-003 applied, no new critical error inferred from limited review. Original older literature register retained.

New source checks (24 Nov 2026):
- PDG Kinematics, 2021 review, https://pdg.lbl.gov/2021/reviews/rpp2021-rev-kinematics.pdf — two-body differential cross section convention. Matrix element and all numerical parameters are derived/selected here, not measured.
- Pietrzyński et al. 2019, Nature 567 200–203, doi:10.1038/s41586-019-0999-4 — LMC 49.59 kpc, 0.09 statistical and 0.54 systematic.
- Reid, Pesce, Riess 2019, https://arxiv.org/abs/1908.05625 — NGC4258 7.576 Mpc, 0.082 statistical and 0.076 systematic. No raw-observable refit.

J1–J15 are new conditional derivations and synthetic controls; code in code/review5_microscopic.py and code/review5_interval_wall.py; outputs in appendices/review5_*. Historical references preserved without claim of new wholesale verification. All file hashes in root manifest.
