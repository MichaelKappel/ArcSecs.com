from playwright.sync_api import sync_playwright
from pathlib import Path
import urllib.request,re,base64,json
import sys
root=Path(__file__).resolve().parents[1];out=Path(sys.argv[1] if len(sys.argv)>1 else 'offline-test-previews');out.mkdir(exist_ok=True)
html=urllib.request.urlopen((sys.argv[2].rstrip('/') if len(sys.argv)>2 else 'http://127.0.0.1:8159')+'/offline/').read().decode();css=(root/'assets/offline.css').read_text();js='\n'.join((root/'assets'/n).read_text() for n in ['catalog.js','solver.js','offline.js']);icon='data:image/png;base64,'+base64.b64encode((root/'assets/compass.png').read_bytes()).decode();html=re.sub(r'<link rel="(?:manifest|apple-touch-icon|icon|stylesheet)"[^>]+>','',html);html=re.sub(r'<script src="[^"]+" defer></script>','',html).replace('</head>','<style>'+css+'</style></head>').replace('src="/offline/assets/compass.png"','src="'+icon+'"')
def load(page,stored=None):
 page.route('**/*',lambda r:r.abort());page.set_content(html,wait_until='domcontentloaded');page.evaluate('stored=>{const data=new Map(Object.entries(stored||{}));Object.defineProperty(window,"localStorage",{configurable:true,value:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}})}',stored);page.add_script_tag(content=js)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);errors=[];renders=calculations=exports=imports=0
 for w in [390,768,1440]:
  ctx=b.new_context(viewport={'width':w,'height':950},accept_downloads=True);page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));load(page);assert page.locator('#studio').is_visible();assert page.locator('#lesson-list button').count()==12;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');renders+=1
  if w!=768:page.screenshot(path=str(out/f'home-{w}.png'))
  for lang in ['en','es','fr']:
   page.select_option('#language',lang);assert page.locator('#glossary article').count()==10
   for i in range(12):
    page.locator('#lesson-list button').nth(i).click();page.click('#control');assert page.locator('#metrics>div').count()==3;assert page.locator('#plot svg').count()==1;assert page.locator('#samples tbody tr').count() in [11,101];calculations+=1
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');renders+=1
  page.select_option('#language','es');page.locator('#lesson-list button').nth(8).click();page.fill('#param-beta','0.9');page.click('#calculate');assert page.locator('#metrics strong').first.inner_text()=='1.8';page.click('#complete');assert page.locator('#progress-text').inner_text()=='1 / 12';page.click('#save');assert page.locator('.saved-item').count()==1
  if w!=768:page.locator('#lab').scroll_into_view_if_needed();page.screenshot(path=str(out/f'separation-es-{w}.png'))
  with page.expect_download() as d:page.click('#export')
  data=json.loads(Path(d.value.path()).read_text());assert data['result']['metrics'][0]['value']==1.8;exports+=1
  with page.expect_download() as d:page.click('#csv')
  assert len(Path(d.value.path()).read_text().splitlines())==102;exports+=1
  data['result']['metrics'][0]['value']=999;page.locator('#recipe-file').set_input_files({'name':'test.json','mimeType':'application/json','buffer':json.dumps(data).encode()});page.wait_for_function("document.querySelector('#notebook-status').textContent.startsWith('Imported recipe')");assert page.locator('#metrics strong').first.inner_text()=='1.8';imports+=1
  data['recipe']['parameters']['beta']=1.2;page.locator('#recipe-file').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':json.dumps(data).encode()});page.wait_for_function("document.querySelector('#notebook-status').textContent.startsWith('Import rejected')");assert page.locator('#metrics strong').first.inner_text()=='1.8';imports+=1
  store=page.evaluate("localStorage.getItem('bsp.offline.notebook.v1')");page.close();page=ctx.new_page();load(page,{'bsp.offline.notebook.v1':store});assert page.locator('#progress-text').inner_text()=='1 / 12';assert page.locator('.saved-item').count()==1;page.locator('.saved-item button').first.click();assert page.locator('#metrics strong').first.inner_text()=='1.8';ctx.close();print('PASS viewport',w,flush=True)
 assert not errors,errors;b.close();print(f'PASS {renders} responsive language/page checks; {calculations} local reference calculations; {exports} exports; {imports} import/rejection checks; three notebook rehydration checks (mock storage)',flush=True)
