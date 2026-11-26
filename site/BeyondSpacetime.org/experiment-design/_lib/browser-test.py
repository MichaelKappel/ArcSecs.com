"""Isolated rendering of actual Apache responses; no live origin/CSP certification."""
import pathlib,sys,urllib.request,urllib.parse,re,base64,json
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[2];base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8173';out=pathlib.Path(sys.argv[2]) if len(sys.argv)>2 else root.parent/'bsp-v2.3.0-previews';out.mkdir(exist_ok=True)
def fetch(path,data=None):
 return urllib.request.urlopen(urllib.request.Request(base+path,data=data,headers={'Content-Type':'application/x-www-form-urlencoded'} if data else {}),timeout=15).read().decode()
cat=json.loads((root/'experiment-design/catalog.json').read_text());protocol=cat['presets']['photon'];raw=json.dumps({'action':'seal','protocol':protocol}).encode();sealed=json.loads(urllib.request.urlopen(urllib.request.Request(base+'/experiment-design/api/',data=raw,headers={'Content-Type':'application/json'})).read())['sealed'];payload=urllib.parse.urlencode({'sealed':json.dumps(sealed),'action':'run'}).encode();result=fetch('/experiment-design/replay/',payload)
def load(page,html):
 scripts=[]
 def js(m):scripts.append((root/m[1].split('?')[0].lstrip('/')).read_text());return ''
 html=re.sub(r'<script src="(/[^"]+)" defer></script>',js,html);html=re.sub(r'<link rel="stylesheet" href="(/[^"]+)">',lambda m:'<style>'+ (root/m[1].split('?')[0].lstrip('/')).read_text()+'</style>',html)
 def image(m):
  p=root/m[1].lstrip('/');ext=p.suffix[1:];return 'src="data:image/'+ext+';base64,'+base64.b64encode(p.read_bytes()).decode()+'"' if p.is_file() and ext in ['png','webp','jpg','jpeg'] else m[0]
 html=re.sub(r'src="(/[^"]+)"',image,html);page.route('**/*',lambda r:r.abort());page.set_content(html,wait_until='domcontentloaded')
 for js in scripts:page.add_script_tag(content=js)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);n=0;imports=0
 for w in [390,768,1440]:
  for name,html in [('studio',fetch('/experiment-design/')),('method',fetch('/experiment-design/method/')),('replay',fetch('/experiment-design/replay/')),('result',result),('museum',fetch('/museum/')),('graph',fetch('/knowledge-graph/record/?id=design%3Aphoton'))]:
   page=b.new_page(viewport={'width':w,'height':960},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));load(page,html);assert page.locator('h1').count()==1,name;assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'),(name,w,page.evaluate('document.documentElement.scrollWidth'));assert not errors,errors;n+=1
   if name=='studio':assert page.locator('fieldset').count()==4;assert page.locator('form.editor').count()==1
   if name=='result':assert page.locator('.effect-figure svg').count()==1;assert page.locator('.result h2').inner_text()=='Numerical criterion met';assert page.locator('table tbody tr').count()==4
   if name=='replay':
    file=page.locator('#import-file');file.set_input_files({'name':'sealed.json','mimeType':'application/json','buffer':json.dumps(sealed).encode()});page.wait_for_function("document.querySelector('#import-status').textContent.startsWith('Recipe loaded')");assert json.loads(page.locator('#replay-json').input_value())==sealed;imports+=1
    file.set_input_files({'name':'result.json','mimeType':'application/json','buffer':json.dumps({'schema':'beyondspacetime.design-result.v1','sealed':sealed,'result_sha256':'0'*64,'research_result':{'forged':True}}).encode()});page.wait_for_function("document.querySelector('#replay-json').value.includes('design-result')");assert 'research_result' not in json.loads(page.locator('#replay-json').input_value());imports+=1
    file.set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{'});page.wait_for_function("document.querySelector('#import-status').textContent.startsWith('Import rejected')");imports+=1
   if name=='museum':assert page.locator('a[href="/experiment-design/"]').count()>0
   if name=='graph':assert 'Does a positive gap' in page.locator('h1').inner_text()
   if w in [390,1440] and name in ['studio','result','graph','museum']:page.screenshot(path=str(out/f'{name}-{w}.png'),full_page=False)
   if w==1440 and name=='result':page.locator('.effect-figure').screenshot(path=str(out/'effects-1440.png'))
   assert not errors,errors;page.close()
  print('PASS viewport',w,flush=True)
 b.close();print(f'{n} responsive renders; {imports} import checks passed')
