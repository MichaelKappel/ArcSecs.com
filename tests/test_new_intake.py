import csv, json, hashlib, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
R=ROOT/'docs/long-term-memory/reports'
D=ROOT/'docs/long-term-memory/research'
class NewIntake(unittest.TestCase):
 def test_all_thirteen_present_and_full_depth(self):
  for i in range(25,38):
   s=(R/f'R{i:02}.md').read_text()
   self.assertGreater(len(s.split()),3000)
   self.assertIn('ArcSecs editorial reading key',s)
   self.assertIn('interpretation-versus-observation checkpoint',s)
   self.assertNotIn('data:image/',s)
 def test_line_audit_covers_source_inventory(self):
  intake=json.loads((D/'13-report-intake.json').read_text())['files']
  with (D/'13-report-line-audit.csv').open(encoding='utf-8',newline='') as f:
   rows=list(csv.DictReader(f))
  self.assertEqual(len(intake),13)
  self.assertEqual(len(rows),sum(x['source_lines'] for x in intake))
  for x in intake:
   p=R/f"{x['id']}.md"
   self.assertEqual(hashlib.sha256(p.read_bytes()).hexdigest(),x['packaged_sha256'])
 def test_asset_integrity(self):
  with (D/'13-report-figure-provenance.csv').open(encoding='utf-8',newline='') as f:
   rows=list(csv.DictReader(f))
  self.assertEqual(len(rows),68)
  for x in rows:
   p=ROOT/x['path']
   self.assertEqual(hashlib.sha256(p.read_bytes()).hexdigest(),x['sha256'])
 def test_charter_unchanged_and_verified_reference_memo(self):
  s=(ROOT/'.uai/totem.uai').read_text()
  for i in range(1,12):self.assertIn(f'{i}. **',s)
  m=(D/'measurement-vs-inference.md').read_text()
  self.assertIn('10.3390/universe12070193',m)
if __name__=='__main__':unittest.main()
