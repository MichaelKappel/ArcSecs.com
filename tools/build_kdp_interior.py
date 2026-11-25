"""Build a no-bleed 6.14 x 9.21 inch hardcover; append the locked source PDF.
Requires Pandoc, XeLaTeX, PyMuPDF, DejaVu fonts. No scientific rewriting.
"""
from pathlib import Path
import argparse, hashlib, json, os, re, subprocess, tempfile
import fitz
ROOT=Path(__file__).resolve().parents[1]
B=ROOT/'book'
W,H=6.14*72,9.21*72
ORIGINAL=B/'review6-original.pdf'
FONT=Path('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def build_main(out):
    env={**os.environ,'LANG':'C.UTF-8','LC_ALL':'C.UTF-8','PYTHONUTF8':'1'}
    subprocess.run(['pandoc','book.md','-f','markdown+tex_math_dollars+autolink_bare_uris','--standalone','--resource-path=.','--lua-filter=kdp.lua','--no-highlight','--pdf-engine=xelatex','-V','mainfont=DejaVu Serif','-V','fontsize=11pt','-V','classoption=twoside','-V','geometry:paperwidth=6.14in,paperheight=9.21in,inner=0.70in,outer=0.40in,top=0.54in,bottom=0.62in,footskip=0.30in','-V','title-meta=BEYOND SPACETIME','-V','author-meta=Machine Intelligence and Michael Joseph Kappel','-V','colorlinks=false','-H','kdp-header.tex','-o',str(out.resolve())],cwd=B,env=env,check=True)
def assemble(main,out):
    locked=(B/'FINAL_SECTION_LOCK.md').read_text(encoding='utf8')
    assert sha(ORIGINAL) in locked,'Protected source checksum mismatch: requires owner approval'
    src=fitz.open(ORIGINAL); doc=fitz.open(main)
    assert len(src)==129
    assert all(abs(p.rect.width-W)<0.02 and abs(p.rect.height-H)<0.02 for p in doc)
    toc=doc.get_toc()
    main_count=len(doc)
    if main_count%2:doc.new_page(width=W,height=H)
    offset=len(doc)
    assert offset+len(src)<=500,'Recalculate minimum gutter for a >500-page interior'
    # Review 6 is already at target trim; preserve full PDF pages and links.
    assert all(abs(p.rect.width-W)<.02 and abs(p.rect.height-H)<.02 for p in src)
    doc.insert_pdf(src, links=True, annots=True)
    # PyMuPDF insert_pdf copies ordinary links but skips named destinations.
    # Resolve them to page-local GoTo destinations in the assembled document.
    for i in range(len(src)):
        pg=doc[offset+i]
        for link in src[i].get_links():
            if link['kind']==fitz.LINK_NAMED and link.get('page',-1)>=0:
                target=link['to']
                pg.insert_link({'kind':fitz.LINK_GOTO,'from':link['from'],'page':offset+link['page'],'to':fitz.Point(target.x,H-target.y),'zoom':link.get('zoom',0.0)})
        left=45 if pg.number%2==0 else 18
        right=18 if pg.number%2==0 else 45
        pg.insert_font(fontname='BookFolio',fontfile=str(FONT))
        rc=pg.insert_textbox(fitz.Rect(left,H-31,W-right,H-17),f'Book page {pg.number+1}  |  Scientific review',fontname='BookFolio',fontsize=8,align=fitz.TEXT_ALIGN_CENTER,color=(0,0,0))
        assert rc>=0
    if len(doc)%2:doc.new_page(width=W,height=H)
    toc.append([2,'Scientific Review 6.0 — original paper',offset+1])
    for level,title,page in src.get_toc():
        if page>0:toc.append([level+2,title,offset+page])
    doc.set_toc(toc)
    doc.set_metadata({'title':'BEYOND SPACETIME','author':'Machine Intelligence and Michael Joseph Kappel','subject':'A Physical-First Investigation into the Nature of the Universe','keywords':'ArcSecs; cosmology; physical-process research','creator':'ArcSecs publication workflow','producer':'XeLaTeX and PyMuPDF'})
    doc.save(out,garbage=4,deflate=True)
    doc.close();src.close()
    # Verify preserved text page by page, independent of layout whitespace.
    final=fitz.open(out);src=fitz.open(ORIGINAL)
    norm=lambda t: re.sub(r'\s+','',t)
    errors=[]
    for i,p in enumerate(src):
        expected=norm(p.get_text()); actual=norm(final[offset+i].get_text())
        footer=norm(f'Book page {offset+i+1}  |  Scientific review')
        if expected!=actual.replace(footer,''):errors.append(i+1)
    if errors:raise ValueError(f'Review source text mismatch on pages {errors}')
    return {'trim_inches':[6.14,9.21],'main_pages':main_count,'interstitial_blank_pages':offset-main_count,'review_start_page':offset+1,'review_end_page':offset+len(src),'final_pages':len(final),'review_source_pages':len(src),'review_source_sha256':sha(ORIGINAL),'review_text_pages_exact_after_whitespace_normalization':len(src),'review_proportional_scale':1.0,'trailing_blank_pages':len(final)-offset-len(src),'interior_sha256':sha(Path(out))}
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('output',type=Path,nargs='?',default=B/'book.pdf');p.add_argument('--main',type=Path);args=p.parse_args()
    with tempfile.TemporaryDirectory() as t:
        main=args.main or Path(t)/'main.pdf'
        if not args.main:build_main(main)
        result=assemble(main,args.output)
        print(json.dumps(result,indent=2))
