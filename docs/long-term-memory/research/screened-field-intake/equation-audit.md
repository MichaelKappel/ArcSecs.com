# Screened common-field audit

This appendix is a technical correction ledger for the two 23 November 2026 files supplied with the manuscript. It does **not** retroactively rewrite either original. References to equation numbers (225)–(278) refer to the uploaded *Deriving the Screened Common-Field Model*; (11)–(38) refer to the 44-page *Integrated Physical-First Scientific Paper*. These are **internal working documents**, not independent observational confirmations.

| Source location | Printed or implied claim | Checked disposition |
|---|---|---|
| Part IX, (246)–(247) | $-\epsilon\mu F^2/4$ yields independently variable $\epsilon E^2/2-B^2/(2\mu)$ | **Not derived.** A scalar factor of $F^2$ scales both terms and does not give two independent response coefficients. Use the split action in paper (13) and Chapter 30E (E1). |
| Part IX, after (247), and stability section | $a=b$ means $\epsilon\mu$ constant | **Incorrect.** $\epsilon\mu\propto e^{(a+b)\psi}$; $a=b$ holds impedance constant, while $a+b=0$ holds speed constant (for variable $\psi$). |
| Part IX, (248)–(250) | $F_{\mu\nu}F^{\mu\nu}=-4u_{\rm EM}$ | **Incorrect in general.** The field invariant involves electric-minus-magnetic terms; positive energy density involves their sum. |
| Part IX, (229) | The printed flight-distance integral uses the wrong exponential sign. | **Incorrect sign in the evaluated integral.** Correct expression is $(v_a/\Gamma)(e^{\Gamma\Delta T}-1)$. The resulting $D=v_a z/\Gamma$ remains correct. |
| Part IX, (261)–(265) and ensuing text | $1+z_{\rm spec}=e^{(b-3a)\Delta\psi/2}$, but $a=b$ supposedly cancels field shift | **Internal contradiction.** Substitute $a=b$: $1+z_{\rm spec}=e^{-a\Delta\psi}$, generally a blue shift for $a\Delta\psi>0$. Paper (31), branch table and Chapter 30E use this substitution. |
| Part IX, spectroscopy/screening discussion | $b=3a$ keeps fine structure $\alpha$ fixed | **Incorrect in the stated approximation.** $\alpha\propto e^{(b-a)\psi/2}$ is constant for $a=b$, not $b=3a$. $b=3a$ instead cancels the toy's *spectroscopic* $\psi$ factor. |
| Part IX, time-varying density | $\psi_*=f/(m^2+g\rho)$ gives a closed scalar/EM energy budget with time-dependent $\rho$ | **Incomplete.** If $\rho(T)$ is prescribed, $U(\psi,\rho)$ has explicit time dependence and the omitted matter reservoir must receive energy and momentum. |
| Part IX, GW speed | Choice $P/Q=1/(\epsilon\mu)$ by itself passes multimessenger constraints | **Only a conditional constructed equality.** Amplitude transport, emission delay assumptions, local conditions, frequency dependence, and future events remain independent tests. |
| Part IX, conclusion | All physically stable screened common fields ruled out | **Overstated for the written calculation.** Serious parameter tensions are retained; a general no-go needs a corrected common action, sourced boundary conditions, model-wide parameter scan and quantitative likelihood analysis. |
| Integrated paper, abstract, Section 1 | “Eleven” foundations | **Historical draft superseded.** The book's binding charter contains 12 foundations; #11 is unknown total age and #12 is smaller/closer inferred objects. No scientific result is altered by the numbering correction. |

## Compact independent checks

Take $\Delta\psi=0.1$. With $(a,b)=(0,2)$, $g=1$ and equation (E5) gives $1+z_{\rm spec}=e^{0.1}>1$; with $(a,b)=(1,1)$, the **same** $g=1$ gives $1+z_{\rm spec}=e^{-0.1}<1$. Thus one slowing law does not imply one spectroscopic sign. With $(a,b)=(1,3)$, $1+z_{\rm spec}=1$ although $g=2$ and speed changes. The model's $\alpha$ exponent for these three cases is respectively $+1$, $0$, and $+1$ times $\Delta\psi$; the cancellation rules differ.

For the temporal toy, $\Gamma=0.2$, $v_a=1$, $\Delta T=1$: numerical integration of $e^{-0.2(T-T_a)}$ gives $(e^{0.2}-1)/0.2\approx1.1070$, **not** $(1-e^{-0.2})/0.2\approx0.9063$. This directly tests the corrected distance identity without assuming a cosmic age, an observed $H_0$, or a fitted spectrum.

The integrated paper's classical electromagnetic action (13), field equation (15), energy ledger (19)–(22), and spectroscopic formula (31) are the preferred *working starting point*, subject to further scientific review. Its illustrative conserved-energy simulation is **synthetic**; it does not measure $\psi$ in the actual universe. The screened report is retained as a useful collection of constraints and failed model choices, not as a verified universal exclusion proof.

## Minimal reproducibility and provenance record

The editable text and PDF originals are stored unchanged inside the accompanying workspace's `docs/long-term-memory/research/screened-field-intake/`. The small executable test file `tests/test_screened_field_book_audit.py` verifies the exponent identities and travel-distance integral; it does not validate astrophysical observations. Chapter 30E cites primary external anchors already used by the book: DES supernova stretch [S02] and GW170817/GRB170817A [S05]. No additional unpublished observational fit or sky-map analysis is claimed.

---

