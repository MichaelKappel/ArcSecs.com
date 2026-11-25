"""Editorial implementation checks; do not imply physical-world validation."""
import unittest,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class BookIntegrationTests(unittest.TestCase):
    def test_exact_11_principles_appear_before_analysis(self):
        totem=(ROOT/'.uai/totem.uai').read_text(encoding='utf-8')
        book=(ROOT/'book/book.md').read_text(encoding='utf-8')
        before=book.split('## Research translation — experimental meaning',1)[0]
        positions=[]
        for n in range(1,12):
            mm=re.search(r'(?m)^'+str(n)+r'\. \*\*(.+?)\*\*$',totem)
            self.assertIsNotNone(mm)
            expected=f'{n}. **{mm.group(1)}**'
            self.assertIn(expected,before)
            positions.append(before.index(expected))
        self.assertEqual(positions,sorted(positions))
    def test_model_is_open_work_not_pretend_result(self):
        book=(ROOT/'book/book.md').read_text(encoding='utf-8')
        for s in ['Chapter 30C. One State, Five Mechanisms',
            'UPM-0', 'not yet', 'hypothetical',
            'tools/unified_reference.py','[S30]',
            'Appendix J — Report-to-Model Integration Map']:
            self.assertIn(s,book)
        for n in range(1,25):
            self.assertIn(f'R{n:02d}',(ROOT/'docs/long-term-memory/research/24-report-coverage.md').read_text() if n>=10 else (ROOT/'docs/long-term-memory/index.md').read_text())
    def test_primary_source_and_durable_note(self):
        self.assertIn('10.3390/universe12070193',(ROOT/'book/book.md').read_text())
        t=(ROOT/'docs/long-term-memory/research/unified-physical-model.md').read_text()
        for q in ['not yet', 'photon', 'clock', 'bubble', '24-report', 'conservation']:
            self.assertIn(q.lower(),t.lower())
        self.assertTrue((ROOT/'tools/unified_reference.py').exists())
        self.assertTrue((ROOT/'tests/test_unified_reference.py').exists())
if __name__=='__main__':unittest.main()
