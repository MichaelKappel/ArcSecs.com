import unittest,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class CharterTwelveTests(unittest.TestCase):
 def test_current_enumeration(self):
  s=(ROOT/'.uai/totem.uai').read_text()
  lines=re.findall(r'(?m)^(\d+)\. \*\*(.+?)\*\*$',s)
  self.assertEqual(len(lines),12)
  self.assertEqual([int(n) for n,_ in lines],list(range(1,13)))
  self.assertEqual(lines[9][1], 'The size of the universe is unknown.')
  self.assertEqual(lines[10][1], 'The age of the universe is unknown.')
  self.assertEqual(lines[11][1], 'Objects in the universe are smaller and closer than they appear.')
 def test_book_and_memory_agree(self):
  b=(ROOT/'book/book.md').read_text()
  p=(ROOT/'docs/long-term-memory/research/arcsecs-principles.md').read_text()
  self.assertIn('# The Twelve ArcSecs Foundations',b)
  for x in ['11. **The age of the universe is unknown.**','12. **Objects in the universe are smaller and closer than they appear.**']:
   self.assertIn(x,b);self.assertIn(x,p)
 def test_history_is_preserved(self):
  self.assertEqual(len(list((ROOT/'docs/long-term-memory/reports').glob('R??.md'))),41)
  self.assertIn('superseded', (ROOT/'docs/long-term-memory/research/charter-12-migration.md').read_text())
 def test_handoff(self):
  for n in ['AGENTS.md','.uai/startup-packet.uai','.uai/next-recursive-prompt.uai']:
   s=(ROOT/n).read_text()
   self.assertIn('12 ArcSecs project principles',s)
if __name__=='__main__':unittest.main()
