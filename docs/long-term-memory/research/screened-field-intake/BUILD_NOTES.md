# Build and limitations

Source is `book/book.md`. Edited into Word with Pandoc 3.1.11 using the prior Word edition as the style reference; typeset PDF using XeLaTeX, six-by-nine-inch trim and FreeSerif; EPUB 3 uses MathML. PDF and Word differ in pagination. Both were rendered and inspected at the new chapter and appendix; no new observational dataset was fitted. Source uploads were copied byte-for-byte, and all earlier reports preserved.

Run `python -m unittest discover -s tests -q`, then `python tools/validate_package.py`. The new algebra suite is `tests/test_screened_field_book_audit.py`.
