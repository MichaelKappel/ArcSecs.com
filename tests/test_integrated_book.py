"""Publication structure and active-source routing; not physical verification."""
import json,re,unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]; S=(R/'book/book.md').read_text(); C=json.loads((R/'docs/long-term-memory/curated/claims.json').read_text())
class IntegratedBookTests(unittest.TestCase):
    def test_curated_claims_distributed(self):
        owners={'distances':2,'clocks':5,'gravity':6,'photons':7,'ceiling':13,'bubbles':32}
        for c in C:
            start=S.index("# Part One");start+=re.search(rf'^## {owners[c["topic"]]}\. ',S[start:],re.M).start()
            end=re.search(r'^#{1,2} ',S[start+4:],re.M).start()+start+4
            self.assertIn('#### '+c['id']+' —',S[start:end])
    def test_order(self):
        labels=['## 30.','## 31.','## 32.','## Chapter 32A.','## Chapter 30A.','## Chapter 30S.','## 33.','## Appendix A','## Synthesis Ledger']
        self.assertEqual([S.index(x) for x in labels],sorted(S.index(x) for x in labels))
    def test_charter_exact(self):
        t=(R/'.uai/totem.uai').read_text();charter=S.split('# The Twelve ArcSecs Foundations',1)[1].split('## Research translation',1)[0]
        self.assertEqual(re.findall(r'^\d+\. \*\*.*\*\*$',t,re.M),re.findall(r'^\d+\. \*\*.*\*\*$',charter,re.M))
    def test_scope(self):
        ch=S.split('## Chapter 32A.',1)[1].split('# Part Seven',1)[0]
        self.assertIn('No fit',ch);self.assertIn('does not establish the smaller/closer',ch);self.assertIn('does not close the photon-plus-matter energy ledger',ch)
    def test_unique_labels_and_next_gate(self):
        tags=re.findall(r'\\tag\{([^}]+)\}',S);self.assertEqual(len(tags),len(set(tags)))
        self.assertNotIn('## Chapter 30T.',S);self.assertIn('vector–bath', (R/'.uai/progress.uai').read_text())
if __name__=='__main__':unittest.main()
