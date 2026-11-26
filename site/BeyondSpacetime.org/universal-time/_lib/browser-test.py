"""Isolated rendering of actual Apache responses; no live origin/CSP certification."""
import pathlib,sys,urllib.request,urllib.parse,re,base64,json
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[2];base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8175';out=pathlib.Path(sys.argv[2]) if len(sys.argv)>2 else root.parent/'bsp-v2.5.0-previews';out.mkdir(exist_ok=True)
def fetch(path,data=None):
 return urllib.request.urlopen(urllib.request.Request(base+path,data=data,headers={'Content-Type':'application/x-www-form-urlencoded'} if data else {}),timeout=15).read().decode()
def load(page,html):
 scripts=[]
 def js(m):scripts.append((root/m[1].split('?')[0].lstrip('/')).read_text());return ''
 html=re.sub(r'<script src="(/[^"]+)" defer></script>',js,html);html=re.sub(r'<link rel="stylesheet" href="(/[^"]+)">',lambda m:'<style>'+ (root/m[1].split('?')[0].lstrip('/')).read_text()+'</style>',html)
 def image(m):
  p=root/m[1].lstrip('/');ext=p.suffix[1:];return 'src="data:image/'+ext+';base64,'+base64.b64encode(p.read_bytes()).decode()+'"' if p.is_file() and ext in ['png','webp','jpg','jpeg'] else m[0]
 html=re.sub(r'src="(/[^"]+)"',image,html);page.route('**/*',lambda r:r.abort());page.set_content(html,wait_until='domcontentloaded')
 for js in scripts:page.add_script_tag(content=js)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);n=0;exports=0;scrubs=0
 for w in [390,768,1440]:
  for name,path in [('root','/'),('home','/universal-time/'),('dinner','/universal-time/dinner/'),('benchmarks','/universal-time/benchmarks/'),('rates','/universal-time/rates/'),('synchronization','/universal-time/synchronization/')]:
   page=b.new_page(viewport={'width':w,'height':960},reduced_motion='reduce',accept_downloads=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));load(page,fetch(path));assert page.locator('h1').count()==1;assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'),(name,w,page.evaluate('document.documentElement.scrollWidth'));n+=1
   if name not in ('home','root'):
    assert page.locator('#time-interaction').is_visible();r=json.loads(page.locator('#time-data').text_content());slider=page.locator('#time-sample');slider.fill('0');assert page.locator('#time-readout').inner_text().startswith(r['columns'][0]);slider.fill(str(len(r['rows'])-1));scrubs+=1
    if name=='dinner':assert page.locator('#time-home-dial').inner_text()=='18:00:00';assert page.locator('#time-traveler-dial').inner_text()=='15:00:00';assert page.locator('#time-bio-dial').inner_text()=='3 h'
    with page.expect_download() as d:page.click('#time-json')
    assert json.loads(pathlib.Path(d.value.path()).read_text())==r;exports+=1
    with page.expect_download() as d:page.click('#time-csv')
    import csv
    assert len(list(csv.reader(pathlib.Path(d.value.path()).open())))==len(r['rows'])+1;exports+=1
   if w in [390,1440]:page.evaluate('window.scrollTo(0,0)');page.screenshot(path=str(out/f'{name}-{w}.png'),full_page=False)
   if name=='dinner' and w==1440:page.locator('.time-clock-grid').screenshot(path=str(out/'dinner-clocks-1440.png'))
   assert not errors,errors;page.close()
  print('PASS viewport',w,flush=True)
 b.close();print(f'{n} responsive renders; {scrubs} sample-scrub checks; {exports} export checks passed')
