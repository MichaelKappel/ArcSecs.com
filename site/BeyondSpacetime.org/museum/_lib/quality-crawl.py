import requests,pathlib,xml.etree.ElementTree as ET,collections,urllib.parse,time,json,sys
from bs4 import BeautifulSoup
base=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'http://127.0.0.1:8171'; root=pathlib.Path(__file__).resolve().parents[2];site='https://beyondspacetime.org'; s=requests.Session(); paths=[]
for p in root.glob('*/sitemap.xml'):paths.extend(x.text.removeprefix(site) for x in ET.parse(p).getroot().findall('{*}url/{*}loc'))
links=collections.defaultdict(set);issues=[];times=[];fragments=set();pageids={}
for p in paths:
 t=time.perf_counter();r=s.get(base+p,timeout=10);times.append((time.perf_counter()-t)*1000); soup=BeautifulSoup(r.text,'html.parser')
 if r.status_code!=200:issues.append((p,'status',r.status_code))
 canon=soup.select_one('link[rel=canonical]')
 if not canon or canon.get('href')!=site+p:issues.append((p,'canonical',str(canon)))
 if len(soup.find_all('h1'))!=1:issues.append((p,'h1',len(soup.find_all('h1'))))
 ids=collections.Counter(x['id'] for x in soup.select('[id]'));pageids[p]=set(ids);dups=[x for x,v in ids.items() if v>1]
 if dups:issues.append((p,'duplicates',dups))
 for label in soup.select('label[for]'):
  if label['for'] not in ids:issues.append((p,'label target',label['for']))
 for el in soup.select('a[href],link[href],script[src],img[src],form[action]'):
  url=el.get('href') or el.get('src') or el.get('action');u=urllib.parse.urlsplit(urllib.parse.urljoin(site+p,url))
  if u.netloc=='beyondspacetime.org' and u.scheme in ['https','http']:
   links[u.path+('?' + u.query if u.query else '')].add(p)
   if u.fragment:fragments.add((p,u.path+('?' + u.query if u.query else ''),urllib.parse.unquote(u.fragment)))
 for el in soup.select('img:not([alt])'):issues.append((p,'missing alt',str(el)[:100]))
 for el in soup.select('[style]'):issues.append((p,'inline style',str(el)[:100]))
 for el in soup.find_all('script'):
  if not el.get('src') and el.get('type') in ['application/json','application/ld+json']:
   try:json.loads(el.string or '')
   except Exception as e:issues.append((p,'bad script json',str(e)))
errors=[]
for path,orig in links.items():
 try:r=s.get(base+path,timeout=10,allow_redirects=False);status=r.status_code
 except Exception as e:status=str(e)
 if status!=200 and path not in ['/']:errors.append((path,status,len(orig),sorted(orig)[:2]))
 if status==200 and path not in pageids and any(x[1]==path for x in fragments):pageids[path]={x['id'] for x in BeautifulSoup(r.text,'html.parser').select('[id]')}
for source,target,anchor in sorted(fragments):
 if target in pageids and anchor not in pageids[target]:issues.append((source,'missing fragment',target+'#'+anchor))
print('Fragment references',len(fragments))
print('Pages',len(paths),'unique',len(set(paths)),'targets',len(links),'p50',round(sorted(times)[len(times)//2],2),'p95',round(sorted(times)[int(len(times)*.95)],2));print('issues',len(issues));print(*issues[:70],sep='\n');print('link failures',len(errors));print(*errors[:80],sep='\n');
assert not issues and not errors, "Crawl issues detected (run on standalone staging root)"
