"""Release preflight: exact source math, clean Unicode, valid EPUB links, PDF bounds."""
from pathlib import Path
from collections import Counter
import os, sys, re, json, zipfile, subprocess, posixpath, urllib.parse
from lxml import etree
import fitz
R=Path(__file__).resolve().parents[1]; B=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else R/'book'
TITLE='BEYOND SPACETIME'
BAD=('\ufffd','\u25a1','\u0d0d')
source=(R/'book/book.md').read_text(encoding='utf-8'); assert '\ufffd' not in source
labels=re.findall(r'\\tag\{([^}]+)\}',source);assert len(labels)==len(set(labels))
assert source.index('# 31.')<source.index('# 32.')<source.index('# Chapter 32A.')<source.index('# Chapter 30Q.')<source.index('# Chapter 30R.')<source.index('# Chapter 30S.')<source.index('# 33.')<source.index('# Appendix A')
env={**os.environ,'LANG':'C.UTF-8','LC_ALL':'C.UTF-8'}
def ast(t): return json.loads(subprocess.run(['pandoc','-f','markdown+tex_math_dollars','-t','json'],input=t.encode('utf8'),stdout=subprocess.PIPE,check=True,env=env).stdout)
def walk(obj,tag):
    if isinstance(obj,dict):
        if obj.get('t')==tag:yield obj['c']
        for v in obj.values():yield from walk(v,tag)
    elif isinstance(obj,list):
        for v in obj:yield from walk(v,tag)
a=ast(source); math=list(walk(a,'Math'));imgs=list(walk(a,'Image'));heads=list(walk(a,'Header'));ids={h[1][0] for h in heads}; links=[l[-1][0] for l in walk(a,'Link') if l[-1][0].startswith('#')];assert all(l[1:] in ids for l in links)
for i in imgs:assert (R/'book'/i[-1][0]).is_file(),i[-1][0]
if len(sys.argv)>2:
    with zipfile.ZipFile(sys.argv[2]) as z:old=ast(z.read('ArcSecs/book/book.md').decode('utf8'))
    def norm(x):return (x[0]['t'],x[1].replace('\\tag{App-','\\tag{'))
    assert not (Counter(map(norm,walk(old,'Math')))-Counter(map(norm,math))), 'Earlier mathematical expression content changed'
    assert not (Counter(i[-1][0] for i in walk(old,'Image'))-Counter(i[-1][0] for i in imgs))
print('Source: ',len(math),'math expressions,',len(imgs),'figures,',len(labels),'unique equation tags,',len(links),'valid internal links')
for ext in ('docx','epub'):
    with zipfile.ZipFile(B/('book.'+ext)) as z:
        assert z.testzip() is None
        xml={n:etree.fromstring(z.read(n)) for n in z.namelist() if n.endswith(('.xhtml','.xml','.opf','.ncx','.rels'))}
        assert all('\ufffd'.encode() not in z.read(n) for n in xml),ext
        if ext=='docx':
            assert TITLE in z.read('docProps/core.xml').decode()
            assert len(xml['word/document.xml'].xpath('//*[local-name()="oMath"]'))==len(math)
            assert len([n for n in z.namelist() if n.startswith('word/media/')])==len(imgs)
        else:
            assert TITLE in z.read('EPUB/content.opf').decode()
            assert sum(len(x.xpath('//*[local-name()="math"]')) for x in xml.values())>=len(math)
            assert len([n for n in z.namelist() if n.startswith('EPUB/media/')])==len(imgs)
            for n,t in xml.items():
                if not n.endswith('.xhtml'):continue
                for e in t.xpath('//*[@href or @src]'):
                    v=e.get('href') or e.get('src');q=urllib.parse.urlsplit(v)
                    if q.scheme or q.netloc:continue
                    path=posixpath.normpath(posixpath.join(posixpath.dirname(n),urllib.parse.unquote(q.path))) if q.path else n
                    assert path in z.namelist(),(n,v)
                    if q.fragment and path in xml:assert xml[path].xpath('//*[@id=$x]',x=urllib.parse.unquote(q.fragment)),(n,v)
        print(ext.upper()+': XML, metadata, figures and math passed'+('; local links passed' if ext=='epub' else ''))
with fitz.open(B/'book.pdf') as d:
    assert d.metadata['title']==TITLE
    overflow=[];bad=[]
    for i,p in enumerate(d):
        t=p.get_text()
        if any(x in t for x in BAD):bad.append(i+1)
        for b in p.get_text('blocks'):
            if b[0]<-1 or b[1]<-1 or b[2]>p.rect.width+1 or b[3]>p.rect.height+1:overflow.append((i+1,b[:4],b[4][:100]))
    assert not bad,bad; assert not overflow,overflow
    print('PDF:',len(d),'pages, zero scanned replacement glyphs, zero text blocks outside page boundaries,',len(d.get_toc()),'bookmarks')
