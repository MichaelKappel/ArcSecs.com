import urllib.request,urllib.error,json,sys,xml.etree.ElementTree as ET
from pathlib import Path
b=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8157';n=0
def get(p,method='GET'):
 try:r=urllib.request.urlopen(urllib.request.Request(b+p,method=method),timeout=5)
 except urllib.error.HTTPError as e:r=e
 return r.status,r.read().decode(),r.headers
def check(x,m):
 global n
 assert x,m;n+=1;print('PASS',m)
s,x,_=get('/timeline/sitemap.xml');paths=[e.text.removeprefix('https://beyondspacetime.org') for e in ET.fromstring(x).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')];check(s==200 and len(paths)==len(set(paths))==63,'63 canonical sitemap routes')
for p in paths:
 s,x,h=get(p);check(s==200 and x.count('<h1>')==1 and f'rel="canonical" href="https://beyondspacetime.org{p}"' in x and 'Content-Security-Policy' in h,p)
s,x,_=get('/timeline/api/?track=reports');check(s==200 and len(json.loads(x)['records'])==41,'API archive filter');s,x,_=get('/timeline/api/?id=review-6');check(s==200 and json.loads(x)['record']['date']=='2026-11-24','API individual');s,x,_=get('/timeline/api/?a=review-5&b=review-6');check(s==200 and len(json.loads(x)['records'])==2,'API comparison');
for p,e in [('/timeline/api/?id=no-such',404),('/timeline/api/?track=invalid',400),('/timeline/api/?q%5B%5D=x',400),('/timeline/api/?a=review-5&b=review-5',400),('/timeline/_lib/model.php',403),('/timeline/record/no-such/',404)]:check(get(p)[0]==e,p)
check(get('/timeline/api/','POST')[0]==405,'API POST denied');s,x,h=get('/timeline/?track=reports&branch=Clocks');check(s==200 and x.count('class="timeline-item"')==3 and 'noindex' in h['X-Robots-Tag'],'no-JS filter');s,x,h=get('/timeline/compare/?a=review-5&b=review-6');check(s==200 and 'Review 5.0' in x and 'Review 6.0' in x and 'noindex' in h['X-Robots-Tag'],'no-JS comparison');s,x,_=get('/timeline/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E');check(s==200 and '<script>alert(1)</script>' not in x,'escaped input');check(get('/timeline/compare/?a=review-5&b=review-5')[0]==400,'invalid HTML pair rejected');print(n,'passed')
