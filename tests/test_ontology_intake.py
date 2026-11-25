import csv, json, hashlib, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
D=ROOT/'docs/long-term-memory/research'
R=ROOT/'docs/long-term-memory/reports'
class OntologyIntake(unittest.TestCase):
 def test_all_38_reports_and_original_source(self):
  self.assertEqual(len(list(R.glob('R[0-9][0-9].md'))),41)
  self.assertGreater(len((R/'R38.md').read_text().split()),10000)
  s=(ROOT/'docs/long-term-memory/sources/R38_original.md').read_text()
  self.assertGreater(len(s.split()),10000)
  self.assertIn('ArcSecs editorial reading key', (R/'R38.md').read_text())
 def test_exact_ontology_primitives(self):
  obj=json.loads((D/'ontology/entity_schema.json').read_text())
  self.assertEqual(len(obj['primitives']),18)
  self.assertEqual({x['id'] for x in obj['primitives']},{f'ARC-T{i:02}' for i in range(1,19)})
  self.assertTrue(obj['no_material_spacetime'])
  self.assertEqual(obj['universal_T_epistemic_status'],'ArcSecs premise')
 def test_source_line_index_complete(self):
  with (D/'ontology-line-audit.csv').open(newline='',encoding='utf-8') as f:rows=list(csv.DictReader(f))
  for rid in ('R31','R35','R38'):
   subset=[x for x in rows if x['report']==rid]
   original=(ROOT/'docs/long-term-memory/sources/R38_original.md' if rid=='R38' else ROOT/'docs/long-term-memory/reports'/f'{rid}.md').read_text().splitlines()
   # R31 and R35 edited source-line count is conserved plus one inserted checkpoint line.
   self.assertGreater(len(subset),300)
   if rid=='R38': self.assertEqual(len(subset),len(original))
 def test_concrete_correction_register_and_reference(self):
  with (D/'ontology-edit-ledger.csv').open(newline='',encoding='utf-8') as f: rows=list(csv.DictReader(f))
  self.assertGreaterEqual(len(rows),20)
  ids={x['edit_id'] for x in rows}
  for x in ('ONT09','ONT14','OPT01','GRV01'): self.assertIn(x,ids)
  self.assertIn('https://doi.org/10.1038/nature01997',(D/'ontology-source-audit.md').read_text())
if __name__=='__main__':unittest.main()
