"""Source-backed graph regression suite. Optional rdflib verifies RDF expansion."""
import pathlib,sys,json,hashlib,csv,urllib.request,urllib.error,urllib.parse,collections,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[2];G=ROOT/'knowledge-graph';base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8162';B='https://beyondspacetime.org';n=0
def ck(ok,label):
 global n
 assert ok,label;n+=1;print('PASS',label)
g=json.loads((G/'catalog.json').read_text());nodes={x['id']:x for x in g['nodes']};edges={x['id']:x for x in g['edges']};cats={}
ck(len(nodes)==len(g['nodes'])==295,'295 unique records');ck(len(edges)==len(g['edges'])==791,'791 unique edges');ck(len(g['predicates'])==12,'12 predicates');ck(not g['unresolvedLinks'],'all declared links resolved uniquely');
for name,meta in g['sourceCatalogs'].items():
 data=(ROOT/meta['url'].lstrip('/')).read_bytes();ck(hashlib.sha256(data).hexdigest()==meta['sha256'],'source catalog hash '+name);cats[meta['url']]=json.loads(data)
def resolve(p):
 o=cats[p['catalog']];assert p['sha256']==g['sourceCatalogs'][p['catalog'].split('/')[1]]['sha256'];
 for key in p['pointer'].split('/')[1:]:
  k=key.replace('~1','/').replace('~0','~');o=o[int(k)] if isinstance(o,list) else o[k]
 return o
for a in nodes.values():
 ck(bool(a['provenance']) and all(resolve(p) is not None for p in a['provenance']),'node provenance '+a['id'])
 ck(a['url'].startswith('/') and not a['url'].startswith('//'),'local destination '+a['id'])
# Independently verify the typed meaning of every edge against the field cited by its provenance.
for e in edges.values():
 a,b,p=e['from'],e['to'],e['predicate']; vals=[resolve(q) for q in e['provenance']];ck(a in nodes and b in nodes and a!=b and bool(vals),'edge endpoints '+e['id'])
 if p=='contains':ok=all(a=='module:'+v.split('/')[1] and v==nodes[b]['url'] for v in vals)
 elif p=='explainsPremise':ok=a.replace('foundation:','premise:',1)==b and vals==[nodes[b]['details']['statement']]
 elif p=='usesModel':ok=all(b=='model:'+v or b.rsplit(':',1)[1]==v and a.startswith(('foundation:','workbench:')) for v in vals)
 elif p=='relatesFoundation':ok=all(b=='foundation:'+v for v in vals) and a.startswith(('evidence:','time:'))
 elif p=='addressesGate':ok=all(b=='gate:'+v for v in vals) and a.startswith(('evidence:','design:','time:'))
 elif p=='hasWorkbench':ok=all(b=='workbench:'+v for v in vals)
 elif p=='examinesEvidence':ok=all(b=='evidence:'+v for v in vals)
 elif p in ('referencesRecord','adaptsLesson','languageVariant'):ok=all(v.removeprefix(B)==nodes[b]['url'] for v in vals)
 elif p=='definesForLesson':ok=all(b=='translation:'+a.split(':')[1]+':'+v for v in vals)
 elif p=='archivedSource':ok=all(v['path']==nodes[b]['details']['path'] and v['sha256']==nodes[b]['details']['sha256'] for v in vals)
 else:ok=False
 ck(ok,'typed provenance '+e['id'])
ck(len({(e['from'],e['predicate'],e['to']) for e in edges.values()})==len(edges),'no duplicate triples')
# All model and status scopes remain intact; translations and archive records are not equated by shared page URL.
ck(all('charter_premise'==x['status'] for x in nodes.values() if x['kind']=='premise'),'premises not evidence');ck(all(x['details']['status']=='Completion not established in Review 6.0' for x in nodes.values() if x['kind']=='gate'),'no fabricated gate completion')
for k in ['premise','foundation','model','evidence','gate','timeline','lesson','glossary','visualization','archive']:
 ck(any(x['kind']==k for x in nodes.values()),'node type '+k)
ck(len({x['url'] for x in nodes.values() if x['kind']=='gate'})==1 and len([x for x in nodes.values() if x['kind']=='gate'])==7,'distinct gates on shared page')
# Deterministic rebuild, with no changes to source catalogs.
files=['catalog.json','graph.jsonld','nodes.csv','edges.csv','sitemap.xml'];before={k:(G/k).read_bytes() for k in files};subprocess.run([sys.executable,str(G/'_lib/build-graph.py')],check=True,stdout=subprocess.DEVNULL);ck(all((G/k).read_bytes()==v for k,v in before.items()),'deterministic graph rebuild')
for name,ids in [('nodes.csv',nodes),('edges.csv',edges)]:
 with (G/name).open() as f:rows=list(csv.DictReader(f));ck(set(x['id'] for x in rows)==set(ids) and len(rows)==len(ids),'CSV identity coverage '+name)
ld=json.loads((G/'graph.jsonld').read_text());ck(len(ld['@graph'])==len(nodes)+len(edges),'JSON-LD node and edge resources')
try:
 import rdflib
except ImportError:print('SKIP optional rdflib expansion (not installed)')
else:
 rdf=rdflib.Graph().parse(data=(G/'graph.jsonld').read_text(),format='json-ld');uri=rdflib.URIRef
 def iri(id):return uri(B+'/knowledge-graph/record/?id='+urllib.parse.quote(id,safe=''))
 ck(all((iri(e['from']),uri(g['predicates'][e['predicate']]['uri']),iri(e['to'])) in rdf for e in edges.values()),'RDF expansion contains every typed edge')
 ck(all((uri(B+'/knowledge-graph/graph.jsonld#'+e['id']),uri(B+'/knowledge-graph/method/#from'),iri(e['from'])) in rdf for e in edges.values()),'RDF edge resources preserve source node')

def get(path,method='GET'):
 try:r=urllib.request.urlopen(urllib.request.Request(base+path,method=method),timeout=10)
 except urllib.error.HTTPError as e:r=e
 return r.status,r.read(),r.headers
def api(**q):
 s,b,h=get('/knowledge-graph/api/?'+urllib.parse.urlencode(q));assert s==200,(s,b);return json.loads(b)
ck(api()['nodes']==len(nodes) and api()['edges']==len(edges),'API summary')
for a in nodes.values():
 r=api(action='node',id=a['id']);wanted={e['id'] for e in edges.values() if a['id'] in (e['from'],e['to'])};ck(r['node']==a and {x['edge']['id'] for x in r['relationships']}==wanted,'API node and complete adjacency '+a['id'])
for p in g['predicates']:
 sample=next(e for e in edges.values() if e['predicate']==p);r=api(action='node',id=sample['from'],predicate=p);ck(r['relationships'] and all(x['edge']['predicate']==p for x in r['relationships']),'predicate filter '+p)
for k in set(x['kind'] for x in nodes.values()):ck(api(action='search',kind=k)['total']==sum(x['kind']==k for x in nodes.values()),'kind search '+k)
for lang in ['en','es','fr']:ck(api(action='search',lang=lang)['total']==sum(x['language']==lang for x in nodes.values()),'language search '+lang)
allids=[]
for p in range(1,api(action="search")["pages"]+1):allids.extend(x['id'] for x in api(action='search',page=p)['results'])
ck(len(allids)==len(set(allids))==len(nodes),'stable search pagination');ck(api(action='search',q='ÉNERGIE',lang='fr')['total']>0,'Unicode query');ck(api(action='search',q='[.*]')['total']==0,'literal query');ck(api(action='search',q='notfound987654')['total']==0,'empty query');
# Verify bounded BFS against independent unweighted graph distance.
def distance(a,b,struct):
 adj=collections.defaultdict(set)
 for e in edges.values():
  if struct or e['predicate'] not in ('contains','archivedSource'):adj[e['from']].add(e['to']);adj[e['to']].add(e['from'])
 queue=collections.deque([(a,0)]);seen={a}
 while queue:
  x,d=queue.popleft()
  if x==b:return d
  if d<6:
   for y in adj[x]-seen:seen.add(y);queue.append((y,d+1))
 return None
for a,b,struct in [('premise:photon-mass','gate:C',False),('gate:C','premise:photon-mass',False),('research:escape','visualization:escape',False),('foundation:cosmic-age','foundation:cosmic-age',False),('module:foundations','foundation:cosmic-age',False),('module:foundations','foundation:cosmic-age',True),('module:knowledge-graph','premise:photon-mass',True),('translation:fr:separation','translation:es:separation',False)]:
 r=api(action='path',id=a,to=b,structural=int(struct));d=distance(a,b,struct);ck(r['found']==(d is not None) and len(r['steps'])==(d or 0),'shortest path '+a+' to '+b+' '+str(struct));pos=a
 for s in r['steps']:
  e=s['edge'];ck(e==edges[e['id']] and s['from']==pos and (s['from'],s['to'])==((e['from'],e['to']) if s['traversal']=='forward' else (e['to'],e['from'])),'path original direction');pos=s['to']
 if r['found']:ck(pos==b,'path destination '+b)
for q in ['action=bad','action=search&kind=bad','action=search&lang=zz','action=search&page=0','action=search&q%5B%5D=x','action=search&q=%FF','action=search&q='+('x'*181),'action=path&id=gate%3AA&to=gate%3AB&structural=2','action=node&id=gate%3AA&predicate=bad','action=summary&extra=x']:
 ck(get('/knowledge-graph/api/?'+q)[0]==400,'reject '+q[:60])
ck(get('/knowledge-graph/api/?action=node&id=unknown')[0]==404,'missing node');ck(get('/knowledge-graph/api/','POST')[0]==405,'read-only API');ck(get('/knowledge-graph/_lib/site.php')[0]==403,'protected internals')
for p in ['/knowledge-graph/','/knowledge-graph/method/','/knowledge-graph/record/?id=evidence%3Aescape-criterion','/knowledge-graph/record/?id=gate%3AC&to=premise%3Aphoton-mass']:
 s,b,h=get(p);ck(s==200 and b.count(b'<h1')==1 and 'Content-Security-Policy' in h,'server-rendered '+p)
ck('noindex' in get('/knowledge-graph/record/?id=gate%3AA')[2]['X-Robots-Tag'],'duplicate inspector noindex');ck('noindex' in get('/knowledge-graph/?q=photon')[2]['X-Robots-Tag'],'filtered discovery noindex');ck(get('/knowledge-graph/record/?id=unknown')[0]==404,'HTML missing record');ck(get('/knowledge-graph/?q=%3Cscript%3E')[0]==200 and b'&lt;script&gt;' in get('/knowledge-graph/?q=%3Cscript%3E')[1],'HTML escape');
for name in ['catalog.json','graph.jsonld','nodes.csv','edges.csv','sitemap.xml']:ck(get('/knowledge-graph/'+name)[1]==(G/name).read_bytes(),'public export exact bytes '+name)
print(f'{n} passed, 0 failed')
