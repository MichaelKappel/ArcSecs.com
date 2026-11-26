"""Isolated browser rendering of real HTTP responses. Direct navigation is restricted in the test environment.
No external media loaded. Browser tooling is development-only.
"""
import pathlib,sys,urllib.request,urllib.parse,re,base64
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[2];base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8162';out=pathlib.Path(sys.argv[2]) if len(sys.argv)>2 else root.parent/'bsp-v2.2.0-previews';out.mkdir(exist_ok=True)
paths={'graph':'/knowledge-graph/','photon':'/knowledge-graph/record/?id=foundation%3Aphoton-mass','escape':'/knowledge-graph/record/?id=evidence%3Aescape-criterion','path':'/knowledge-graph/record/?id=premise%3Aphoton-mass&to=gate%3AC','method':'/knowledge-graph/method/','museum':'/museum/','search':'/museum/search/?q=escape'}
def fetch(path):return urllib.request.urlopen(base+path,timeout=10).read().decode()
def load(page,path):
 html=fetch(path);scripts=[]
 def script(m):scripts.append((root/m[1].split('?')[0].lstrip('/')).read_text());return ''
 html=re.sub(r'<script src="(/[^\"]+)" defer></script>',script,html)
 html=re.sub(r'<link rel="stylesheet" href="(/[^\"]+)">',lambda m:'<style>'+ (root/m[1].split('?')[0].lstrip('/')).read_text()+'</style>',html)
 def image(m):
  path=root/m[1].lstrip('/');ext=path.suffix[1:];return 'src="data:image/'+ext+';base64,'+base64.b64encode(path.read_bytes()).decode()+'"' if path.is_file() and ext in ['png','webp','jpg','jpeg'] else m[0]
 html=re.sub(r'src="(/[^\"]+)"',image,html);page.route('**/*',lambda r:r.abort());page.set_content(html,wait_until='domcontentloaded');
 for js in scripts:page.add_script_tag(content=js)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);checks=0;filters=0;paths_checked=0
 for w in [390,768,1440]:
  for name,path in paths.items():
   page=browser.new_page(viewport={'width':w,'height':1000},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));load(page,path);assert page.locator('h1').count()==1,name;assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'),(name,w,page.evaluate('document.documentElement.scrollWidth'));assert not errors,(name,errors);checks+=1
   if name in ['photon','escape','path']:
    n=page.locator('.graph-link').count();assert n>0;assert page.locator('#local-graph .graph-node').count()<=12;assert page.locator('.graph-local-filter').is_visible();page.fill('#graph-neighbor-query','zzzz_no_match');assert page.locator('.graph-link:visible').count()==0;page.fill('#graph-neighbor-query','');assert page.locator('.graph-link:visible').count()==n;page.locator('.graph-link').first.locator('a').first.focus();assert page.locator('.graph-link.graph-highlight').count()>0;filters+=1
    if name=='path':assert 'Path found' in page.locator('#graph-path h3').inner_text();assert page.locator('#graph-path .graph-path-list li').count()>0;paths_checked+=1
   if name=='search':assert page.locator('a[href^="/knowledge-graph/record/?id="]').count()>0
   if name=='museum':assert page.locator('a[href="/knowledge-graph/"]').count()>0;assert page.locator('#museum-video iframe').count()==0
   if w in [390,1440] and name!='search':page.evaluate('window.scrollTo(0,0)');page.screenshot(path=str(out/f'{name}-{w}.png'),full_page=False)
   if w==1440 and name in ['escape','photon']:page.locator('.graph-workspace').screenshot(path=str(out/f'{name}-network-1440.png'))
   page.close()
  print('PASS viewport',w,flush=True)
 browser.close();print(f'{checks} responsive renders; {filters} filter/focus interactions; {paths_checked} rendered path checks passed')
