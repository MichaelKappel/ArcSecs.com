"""Curation coverage and repaired analytical identities (not empirical validation)."""
import unittest, csv, json, math, re
from pathlib import Path
from collections import Counter
ROOT=Path(__file__).resolve().parents[1]
D=ROOT/'docs/long-term-memory/curated'
class CuratedIntakeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.src={x['id']:x for x in json.loads((D/'sources.json').read_text())}
        cls.claims={x['id']:x for x in json.loads((D/'claims.json').read_text())}
        with (D/'line-ledger.tsv').open(newline='',encoding='utf-8') as f:cls.rows=list(csv.DictReader(f,delimiter='\t'))
    def test_complete_source_inventory(self):
        self.assertEqual(len(self.src),10)
        self.assertEqual(len(self.rows),sum(x['lines'] for x in self.src.values()))
        self.assertEqual(len(self.rows),5301)
        expected={(k,i) for k,x in self.src.items() for i in range(1,x['lines']+1)}
        self.assertEqual({(r['source'],int(r['line'])) for r in self.rows},expected)
        self.assertEqual(len(expected),len(self.rows))
    def test_claim_ownership_and_ranges(self):
        self.assertEqual(len(self.claims),28)
        self.assertEqual(len({x['topic'] for x in self.claims.values()}),6)
        active={(r['source'],int(r['line'])):r['active_claim_ids'].split(',') for r in self.rows}
        for cid,c in self.claims.items():
            self.assertIn(c['body'],(D/(c['topic']+'.md')).read_text())
            for k,a,b in c['refs']:
                self.assertTrue(1<=a<=b<=self.src[k]['lines'])
                for i in range(a,b+1): self.assertIn(cid,active[k,i])
        for row in self.rows:
            for cid in filter(None,row['active_claim_ids'].split(',')):
                self.assertTrue(any(k==row['source'] and a<=int(row['line'])<=b for k,a,b in self.claims[cid]['refs']))
    def test_guard_resolution(self):
        guards=set(re.findall(r'\| (SG-\d+) \|',(D/'retired.md').read_text()))
        self.assertEqual(len(guards),11)
        for row in self.rows:
            self.assertTrue(set(filter(None,row['guard_ids'].split(',')))<=guards)
            self.assertRegex(row['line_sha256'],r'^[0-9a-f]{64}$')
    def test_corrected_dispersion(self):
        for u in (0.01,0.2,1.,2.,10.):
            C=1.7
            vg=C*u/math.sqrt(1+u*u); vp=C*math.sqrt(1+u*u)/u
            self.assertLess(vg,C);self.assertGreater(vp,C)
            self.assertAlmostEqual(vg*vp,C*C,places=12)
            h=1e-5; deriv=C*(math.hypot(1,u+h)-math.hypot(1,u-h))/(2*h)
            self.assertAlmostEqual(vg,deriv,places=8)
    def test_arrival_age_only(self):
        # x_r=10+0.2 Ta; x_e=0.1 Te; v(age)=4 exp(-age/40).
        def arrival(te):
            lo,hi=te,te+20
            for _ in range(70):
                ta=(lo+hi)/2; d=160*(-math.expm1(-(ta-te)/40))
                if d < 10+.2*ta-.1*te:lo=ta
                else:hi=ta
            return (lo+hi)/2
        te=3.;ta=arrival(te); va=4*math.exp(-(ta-te)/40)
        h=1e-4
        self.assertAlmostEqual((arrival(te+h)-arrival(te-h))/(2*h),(va-.1)/(va-.2),places=8)
    def test_arrival_absolute_time(self):
        # v(T)=4+0.02T; same signed endpoint conventions.
        def arrival(te):
            lo,hi=te,te+20
            for _ in range(70):
                ta=(lo+hi)/2;d=4*(ta-te)+.01*(ta*ta-te*te)
                if d<10+.2*ta-.1*te:lo=ta
                else:hi=ta
            return (lo+hi)/2
        te=3.; ta=arrival(te);h=1e-4
        self.assertAlmostEqual((arrival(te+h)-arrival(te-h))/(2*h),(4+.02*te-.1)/(4+.02*ta-.2),places=8)
    def test_distance_integral_sign(self):
        for eta in (.1,.3,.6):
            g=.3;x=1.2
            integ=x+(eta/g-1)*(x-(-math.expm1(-g*x))/g)
            if eta==g:self.assertAlmostEqual(integ,x)
            elif eta>g:self.assertGreater(integ,x)
            else:self.assertLess(integ,x)
            n=5000;step=x/n
            num=step*sum(1+(eta/g-1)*(-math.expm1(-g*(i+.5)*step)) for i in range(n))
            self.assertAlmostEqual(integ,num,places=8)
if __name__=='__main__':unittest.main()
