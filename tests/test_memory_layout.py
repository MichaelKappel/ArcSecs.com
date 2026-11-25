\
import json, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class ArcSecsUAIxTests(unittest.TestCase):
    def test_manifest_and_content(self):
        mf=json.loads((ROOT/'project-manifest.json').read_text())
        self.assertFalse(mf['repository_checkout_present'])
        self.assertEqual(len([x for x in mf['files'] if x['type']=='full_depth_report']),9)
        self.assertEqual(len([x for x in mf['files'] if x['type']=='full_depth_annotated_report']),15)
        self.assertEqual(mf['report_inventory']['total'],41)
        self.assertEqual(len([x for x in mf['files'] if x['type']=='new_scope_edited_report']),14)
        self.assertEqual(len([x for x in mf['files'] if x['type']=='figure']),22)
        self.assertEqual(len([x for x in mf['files'] if x['type']=='book']),4)
        self.assertTrue(all(len(x['source_sha256'])==64 for x in mf['files']))
    def test_docs_selection_and_exact_url(self):
        url='https://uaix.org/en-us/tools/ai-memory-package-wizard/?memory=docs-folder&loops=1'
        for name in ['AGENTS.md','.uai/readme.human','.uai/agent-pickup.uai','.uai/totem.uai']:
            self.assertIn(url,(ROOT/name).read_text())
        self.assertIn('docs/long-term-memory/',(ROOT/'.uai/index.uai').read_text())
        self.assertIn('pointer',(ROOT/'.uai/long-term-memory.uai').read_text().lower())
    def test_loop_next_prompt_sections(self):
        s=(ROOT/'.uai/next-recursive-prompt.uai').read_text()
        for h in ('Feature/improvement focus','Code/source changes','Automated tests/checks'):
            self.assertIn(h,s)
    def test_report_completeness_and_figure_imports(self):
        for f in (ROOT/'docs/long-term-memory/reports').glob('*.md'):
            s=f.read_text()
            self.assertIn('UAIX navigation',s)
            if f.name in [f'R{i:02d}.md' for i in range(1,10)]:
                self.assertIn('Full Detailed Technical',s)
                self.assertTrue(len(s.split())>8000)
            elif f.name in [f'R{i:02d}.md' for i in range(10,25)]:
                self.assertIn('Earlier Corrected Report',s)
                self.assertIn('Full Recovered Technical Study',s)
                self.assertTrue(len(s.split())>2000)
            else:
                self.assertIn('ArcSecs editorial reading key',s)
                self.assertIn('interpretation-versus-observation checkpoint',s)
                self.assertNotIn('data:image/',s)
                self.assertTrue(len(s.split())>3000)
        self.assertEqual(len(list((ROOT/'docs/long-term-memory/research/figures').glob('*/*.png'))),22)
        self.assertEqual(len(list((ROOT/'docs/long-term-memory/research/figures-restored').glob('*/*'))), 637)
    def test_short_windows_paths_and_totem(self):
        paths=[str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file()]
        self.assertLessEqual(max(map(len,paths)),180)
        self.assertEqual(len(list((ROOT/'docs/long-term-memory/reports').glob('R??.md'))),41)
        txt=(ROOT/'.uai/totem.uai').read_text(encoding='utf-8')
        for x in range(1,13):self.assertIn(f'{x}. **',txt)
        self.assertIn('.uai/totem.uai',(ROOT/'AGENTS.md').read_text())
    def test_no_real_git_checkout_claim(self):
        self.assertFalse((ROOT/'.git').exists())
        self.assertIn('no `.git`',(ROOT/'.uai/world-context.uai').read_text())
if __name__=='__main__': unittest.main()
