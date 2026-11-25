"""Preflight current print edition, including immutable last-section content."""
from pathlib import Path
import fitz, hashlib, re, json, subprocess
ROOT=Path(__file__).resolve().parents[1]
B=ROOT/'book'
W,H=6.14*72,9.21*72
MIN_INNER,MIN_OUTER=45,18
norm=lambda t:re.sub(r'\s+','',t)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def check():
    srcpath=B/'review6-original.pdf'; outpath=B/'book.pdf'
    lock=(B/'FINAL_SECTION_LOCK.md').read_text(encoding='utf8')
    assert sha(srcpath) in lock, 'Protected original changed'
    d=fitz.open(outpath); src=fitz.open(srcpath)
    assert len(src)==129 and 301<=len(d)<=500 and len(d)%2==0 and not d.is_encrypted
    errors=[]; ppis=[]; warnings=[]
    for i,p in enumerate(d):
        assert abs(p.rect.width-W)<.02 and abs(p.rect.height-H)<.02 and p.rotation==0
        lo,hi=(MIN_INNER,W-MIN_OUTER) if i%2==0 else (MIN_OUTER,W-MIN_INNER)
        for b in p.get_text('dict')['blocks']:
            x0,y0,x1,y1=b['bbox']
            if x0<lo-.15 or x1>hi+.15 or y0<18 or y1>H-18:errors.append((i+1,b['bbox']))
            if b['type']==0 and any('\ufffd' in s['text'] for l in b['lines'] for s in l['spans']):warnings.append(i+1)
            if b['type']==1 and x1>x0 and y1>y0:ppis.append(min(b['width']*72/(x1-x0),b['height']*72/(y1-y0)))
    assert not errors,errors
    assert not warnings,warnings
    start=len(d)-len(src)-1
    assert not d[-1].get_text().strip()
    for i,p in enumerate(src):
        expected=norm(p.get_text()); actual=norm(d[start+i].get_text())
        footer=norm(f'Book page {start+i+1}  |  Scientific review')
        assert actual.replace(footer,'')==expected, f'Review text mismatch on source page {i+1}'
    fonts=subprocess.check_output(['pdffonts',str(outpath)],text=True)
    assert all(re.search(r'\byes\s+(yes|no)\s+(yes|no)\s+\d+\s+\d+\s*$',line) for line in fonts.splitlines()[2:] if line.strip()), 'Non-embedded font found'
    return dict(page_count=len(d),trim_inches=[6.14,9.21],review_start_page=start+1,review_end_page=start+len(src),trailing_blank_pages=1,source_pages_preserved=len(src),minimum_gutter_inches=MIN_INNER/72,minimum_outer_inches=MIN_OUTER/72,all_fonts_embedded=True,margin_violations=len(errors),replacement_characters_detected=len(warnings),image_instances=len(ppis),minimum_effective_raster_ppi=round(min(ppis),1) if ppis else None,images_under_300_ppi=sum(v<299.9 for v in ppis),source_sha256=sha(srcpath),interior_sha256=sha(outpath))
if __name__=='__main__':print(json.dumps(check(),indent=2))
