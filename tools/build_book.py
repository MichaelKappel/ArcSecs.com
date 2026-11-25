"""Regenerate all current reading formats from the same canonical UTF-8 source."""
from pathlib import Path
import os, subprocess, sys, zipfile, json
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt
R=Path(__file__).resolve().parents[1]; B=R/'book'; OUT=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else B
# The protected paper must not be silently omitted by this older multi-format builder.
if (B/'FINAL_SECTION_LOCK.md').exists():
    raise SystemExit('Protected final section present. Use tools/build_kdp_interior.py; the older reading formats remain historical.')
OUT.mkdir(parents=True,exist_ok=True)
env={**os.environ,'LANG':'C.UTF-8','LC_ALL':'C.UTF-8','PYTHONUTF8':'1'}
TITLE='BEYOND SPACETIME'; AUTHOR='ArcSecs Research Program'
common=['pandoc','book.md','-f','markdown+tex_math_dollars+autolink_bare_uris','--standalone','--resource-path=.','--lua-filter=edition.lua']
def run(args):
    subprocess.run(args,cwd=B,env=env,check=True)
# No visible metadata-driven title for Word or PDF; manuscript contains the one cover.
run(common+['-t','docx','--reference-doc='+str(B/'book.docx'),'-M','lang=en-US','-o',str(OUT/'book-new.docx')])
d=Document(OUT/'book-new.docx')
d.core_properties.title=TITLE;d.core_properties.author=AUTHOR;d.core_properties.subject='A Physical-First Investigation into the Nature of the Universe'
for i,p in enumerate(d.paragraphs):
    if p.text.strip()=='About this edition': break
    if not p.text.strip(): continue
    p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after=Pt(12)
    if i==0:
        p.paragraph_format.space_before=Pt(105)
        for rr in p.runs:rr.font.size=Pt(27);rr.bold=True
    elif i==1:
        for rr in p.runs:rr.font.size=Pt(14)
d.save(OUT/'book-new.docx')
run(common+['-t','epub3','--mathml','--toc','--toc-depth=2','--epub-title-page=false','--metadata-file=edition-metadata.yaml','-o',str(OUT/'book-new.epub')])
run(common+['--no-highlight','--pdf-engine=xelatex','-V','mainfont=DejaVu Serif','-V','geometry:margin=0.85in','-V','fontsize=11pt','-V','papersize=letter','-V','title-meta='+TITLE,'-V','author-meta='+AUTHOR,'-V','colorlinks=true','-V','linkcolor=black','-V','urlcolor=blue','-V','toccolor=black','-H','edition-header.tex','-o',str(OUT/'book-new.pdf')])
for ext in ('docx','epub','pdf'):
    (OUT/('book-new.'+ext)).replace(OUT/('book.'+ext))
