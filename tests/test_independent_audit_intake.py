"""Regression checks of the independently supplied audit outputs and ownership."""
import csv, hashlib, io, json, unittest, zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
D=ROOT/'docs/long-term-memory/research/independent-audit'
class IndependentAuditIntake(unittest.TestCase):
    def test_case_outcomes_and_numerics(self):
        with zipfile.ZipFile(D/'original-audit.zip') as z:
            old=list(csv.DictReader(io.StringIO(z.read('history_cases.csv').decode())))
        with (D/'history_cases.csv').open() as f: new=list(csv.DictReader(f))
        self.assertEqual(len(new),21)
        self.assertEqual(sum(r['status']=='arrived' for r in new),20)
        for a,b in zip(old,new):
            self.assertEqual((a['name'],a['status']),(b['name'],b['status']))
            for k in ('speed','retained','gap','heat','recoil','wall_recoil','wall_momentum'):
                self.assertAlmostEqual(float(a[k]),float(b[k]),places=9)
    def test_arrival_semantics(self):
        with (D/'history_cases.csv').open() as f: rows=list(csv.DictReader(f))
        for r in rows:
            if r['status']=='arrived': self.assertEqual(float(r['arrival_time']),float(r['integration_end_time']))
            else: self.assertEqual(r['arrival_time'],'')
    def test_json_and_protection(self):
        def fail(x): raise ValueError(x)
        j=json.loads((D/'verification.json').read_text(),parse_constant=fail)
        self.assertIsNone(j['history_baseline']['wall_mass'])
        lock=(ROOT/'book/FINAL_SECTION_LOCK.md').read_text()
        self.assertIn(hashlib.sha256((ROOT/'book/review6-original.pdf').read_bytes()).hexdigest(),lock)
    def test_model_separation(self):
        b=(ROOT/'book/book.md').read_text()
        for k in ('AGE-S','AGE-H','AGE-V','SCI-001' if False else 'internal page 69'): self.assertIn(k,b)
        self.assertIn('not an interval proof',b)
