"""Build deterministic graph from existing catalog snapshots. No network, no inferred evidence.
Run museum/_lib/build-index.py first; Python is build-time only.
"""
from pathlib import Path
import json, hashlib, csv, xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/'knowledge-graph'; BASE='https://beyondspacetime.org'; VOC=BASE+'/knowledge-graph/method/#'; schema='beyondspacetime.graph.v1'
MODULES=['museum','foundations','evidence','research','model-comparison','timeline','global','visualizations','experiment-design','universal-time']
cats={}; hashes={}
for module in MODULES:
 raw=(ROOT/module/'catalog.json').read_bytes();cats[module]=json.loads(raw);hashes[module]=hashlib.sha256(raw).hexdigest()
def pointer(*parts):return ''.join('/'+str(p).replace('~','~0').replace('/','~1') for p in parts)
def provenance(module,*parts):return {'catalog':f'/{module}/catalog.json','sha256':hashes[module],'pointer':pointer(*parts)}
def sha(s):return hashlib.sha256(s.encode()).hexdigest()
def local(url):return url.removeprefix(BASE)
TYPES={
 'contains':('Catalogs','Editorial membership of a record in an exhibit; not scientific support.'),
 'explainsPremise':('Explains charter premise','A foundation lesson preserves and discusses the specified original premise.'),
 'usesModel':('Uses calculation model','A declared model identifier in a preset, comparison, visualization, design or lesson; not evidence of physical validity.'),
 'relatesFoundation':('Relates to foundation','An explicit foundation reference in an evidence or educational record; not confirmation of the premise.'),
 'addressesGate':('Addresses validation gate','A ledger entry, educational record or experiment design identifies a relevant validation requirement. This does not mark a gate complete.'),
 'hasWorkbench':('Has numerical workbench','The evidence ledger links a record to an existing computation.'),
 'examinesEvidence':('Examines evidence record','The model, investigation or workbench catalog explicitly names the evidence record. This is not an assertion that the evidence supports the model.'),
 'referencesRecord':('References research record','An explicit related URL in the timeline catalog, resolved only when it identifies one unique record.'),
 'adaptsLesson':('Adapts foundation lesson','A localized educational lesson points to its original English foundation.'),
 'languageVariant':('Language variant','A declared alternate localized lesson, not a claim of word-for-word equivalence.'),
 'definesForLesson':('Defines term for lesson','A glossary entry identifies its associated localized lesson.'),
 'archivedSource':('Archived source snapshot','The catalog records a path and SHA-256 of an archived source. A literature record may hash a bibliography, not the referenced paper.'),
}
N={}; E={}; unresolved=[]
def node(id,kind,title,summary,url,status='',lang='en',source='',provs=(),details=None):
 assert id not in N,id
 N[id]={'id':id,'kind':kind,'title':title,'summary':summary,'url':local(url),'status':status,'language':lang,'source':source,'provenance':list(provs),'details':details or {}}
def edge(a,p,b,prov):
 assert a in N and b in N and a!=b and p in TYPES,(a,p,b)
 key=(a,p,b); e=E.setdefault(key,{'id':'edge:'+sha('\x1f'.join(key))[:32],'from':a,'predicate':p,'to':b,'provenance':[]})
 if prov not in e['provenance']:e['provenance'].append(prov)
m=cats['museum']; f=cats['foundations']; ev=cats['evidence']; r=cats['research']; c=cats['model-comparison']; t=cats['timeline']; g=cats['global']; v=cats['visualizations']
for i,x in enumerate(m['entries']):
 node(x['id'],x['kind'],x['title'],x['summary'],x['url'],x['status'],x['language'],x['source'],[provenance('museum','entries',i)])
# Source-specific fields supplement the museum index. Every field remains attributable to a source catalog.
def enrich(id,module,parts,obj,keys):
 N[id]['provenance'].append(provenance(module,*parts)); N[id]['details'].update({k:obj[k] for k in keys if k in obj})
for i,x in enumerate(f['lessons']):
 id='foundation:'+x['slug']; p=('lessons',i); enrich(id,'foundations',p,x,['number','statement','standard','candidate','equation','limitation','observation','reference','source','model_status','epistemic_status']);
 node('premise:'+x['slug'],'premise',f"Foundation {x['number']}: {x['statement']}",'Exact research charter statement; stipulated premise, not a measured finding.',x['url'],'charter_premise',source=x['source']['url'],provs=[provenance('foundations',*p,'statement')],details={'statement':x['statement'],'number':x['number'],'source':x['source']})
for i,x in enumerate(ev['records']):enrich('evidence:'+x['id'],'evidence',('records',i),x,['status','phase','pages','branch','limitation','next_test','gates','foundations','workbench'])
for i,x in enumerate(ev['gates']):enrich('gate:'+x['id'],'evidence',('gates',i),x,['pass_condition','status','deliverable'])
for id,x in ev['workbenches'].items():enrich('workbench:'+id,'evidence',('workbenches',id),x,['params','record','series','x'])
for id,x in r['models'].items():
 node('model:'+id,'model',x['title']+' — calculation model',x.get('limitation',x.get('description','Conditional calculation')),x['url'],'Conditional educational calculation',source=x['source']['url'] if isinstance(x['source'],dict) else r['source']['url'],provs=[provenance('research','models',id)],details=x)
for id,x in r['presets'].items():enrich('research:'+id,'research',('presets',id),x,['plan'])
for id,x in c['presets'].items():enrich('comparison:'+id,'model-comparison',('presets',id),x,list(x))
# The archived source fingerprint identifies the supplied archive entry, not external URL contents.
for i,x in enumerate(t['records']):
 id='timeline:'+x['id'];enrich(id,'timeline',('records',i),x,['track','branch','status','limitation','source','date','original_title','sequence','edition']);s=x['source']; key='archive:'+sha(s['path']+'\x1f'+s['sha256'])[:32]
 if key not in N:node(key,'archive','Archive · '+s['path'].split('/')[-1], 'Archived source pointer and fingerprint as recorded in the timeline catalog. A cited external URL need not contain these exact bytes.',N[id]['url'],'Recorded archival provenance',provs=[provenance('timeline','records',i,'source')],details={'path':s['path'],'sha256':s['sha256']})
 else:N[key]['provenance'].append(provenance('timeline','records',i,'source'))
 edge(id,'archivedSource',key,provenance('timeline','records',i,'source'))
for lang,x in g['languages'].items():
 for i,l in enumerate(x['lessons']):enrich('translation:'+lang+':'+l['id'],'global',('languages',lang,'lessons',i),l,['original_statement','equation','limitation','test','englishUrl','alternates','source'])
 for i,l in enumerate(x['glossary']):enrich('glossary:'+lang+':'+str(i),'global',('languages',lang,'glossary',i),l,['term','definition','lesson'])
for i,x in enumerate(v['scenes']):enrich('visualization:'+x['id'],'visualizations',('scenes',i),x,['model','mode','control','question','detail','source_label'])
# URL matching only for explicitly declared links, never to equate records sharing a URL.
urls={}
for x in m['entries']:urls.setdefault(x['url'],[]).append(x['id'])
def resolved(a,p,url,prov):
 targets=urls.get(local(url),[])
 if len(targets)!=1 or targets[0]==a:unresolved.append({'from':a,'predicate':p,'url':url,'reason':'Ambiguous or missing exact destination','provenance':prov});return
 edge(a,p,targets[0],prov)
for i,x in enumerate(m['entries']):
 if x['kind']!='module':
  mod=x['url'].split('/')[1];edge('module:'+mod,'contains',x['id'],provenance('museum','entries',i,'url'))
for i,x in enumerate(f['lessons']):
 id='foundation:'+x['slug'];edge(id,'explainsPremise','premise:'+x['slug'],provenance('foundations','lessons',i,'statement'))
 # the model catalog explicitly gives the same foundation id
 edge(id,'usesModel','model:'+id,provenance('research','models',id,'id'))
for i,x in enumerate(ev['records']):
 id='evidence:'+x['id']
 for k,slug in enumerate(x['foundations']):edge(id,'relatesFoundation','foundation:'+slug,provenance('evidence','records',i,'foundations',k))
 for k,gate in enumerate(x['gates']):edge(id,'addressesGate','gate:'+gate,provenance('evidence','records',i,'gates',k))
 if x['workbench']:edge(id,'hasWorkbench','workbench:'+x['workbench'],provenance('evidence','records',i,'workbench'))
for id,x in ev['workbenches'].items():
 edge('workbench:'+id,'examinesEvidence','evidence:'+x['record'],provenance('evidence','workbenches',id,'record'))
 edge('workbench:'+id,'usesModel','model:evidence:'+id,provenance('research','models','evidence:'+id,'id'))
for id,x in r['models'].items():
 for i,rec in enumerate(x['evidence']):edge('model:'+id,'examinesEvidence','evidence:'+rec,provenance('research','models',id,'evidence',i))
for id,x in r['presets'].items():
 for i,a in enumerate(x['plan']['cases']):edge('research:'+id,'usesModel','model:'+a['model'],provenance('research','presets',id,'plan','cases',i,'model'))
 for i,a in enumerate(x['plan']['evidence']):edge('research:'+id,'examinesEvidence','evidence:'+a,provenance('research','presets',id,'plan','evidence',i))
for id,x in c['presets'].items():edge('comparison:'+id,'usesModel','model:'+x['model'],provenance('model-comparison','presets',id,'model'))
for i,x in enumerate(t['records']):
 for j,a in enumerate(x['related']):resolved('timeline:'+x['id'],'referencesRecord',a['url'],provenance('timeline','records',i,'related',j,'url'))
for lang,x in g['languages'].items():
 for i,l in enumerate(x['lessons']):
  id='translation:'+lang+':'+l['id'];resolved(id,'adaptsLesson',l['englishUrl'],provenance('global','languages',lang,'lessons',i,'englishUrl'))
  for alt,url in l['alternates'].items():
   if alt!=lang:resolved(id,'languageVariant',url,provenance('global','languages',lang,'lessons',i,'alternates',alt))
 for i,l in enumerate(x['glossary']):edge('glossary:'+lang+':'+str(i),'definesForLesson','translation:'+lang+':'+l['lesson'],provenance('global','languages',lang,'glossary',i,'lesson'))
for i,x in enumerate(v['scenes']):edge('visualization:'+x['id'],'usesModel','model:'+x['model'],provenance('visualizations','scenes',i,'model'))
for id,a in cats['experiment-design']['presets'].items():
 key='design:'+id;enrich(key,'experiment-design',('presets',id),a,['model','variable','metric','direction','criteria','uncertainty','notes','cases','evidence','gates']);edge(key,'usesModel','model:'+a['model'],provenance('experiment-design','presets',id,'model'))
 for i,e in enumerate(a['evidence']):edge(key,'examinesEvidence','evidence:'+e,provenance('experiment-design','presets',id,'evidence',i))
 for i,g in enumerate(a['gates']):edge(key,'addressesGate','gate:'+g,provenance('experiment-design','presets',id,'gates',i))
for i,a in enumerate(cats['universal-time']['records']):
 key='time:'+a['id'];enrich(key,'universal-time',('records',i),a,['foundations','gates','status','source'])
 for j,fid in enumerate(a['foundations']):edge(key,'relatesFoundation','foundation:'+fid,provenance('universal-time','records',i,'foundations',j))
 for j,gid in enumerate(a['gates']):edge(key,'addressesGate','gate:'+gid,provenance('universal-time','records',i,'gates',j))
# Graph hub is intentionally isolated: its self-discovery entry would create a self-loop.
# Connect module graph hub to the museum source module? No arbitrary relation; graph hub indexes all records through this API.
for id,x in N.items():
 assert x['provenance'] and x['title'] and x['summary'],id
 assert x['url'].startswith('/') and not x['url'].startswith('//'),id
 assert (ROOT/x['url'].split('?')[0].lstrip('/')/'index.php').is_file() or (ROOT/x['url'].split('?')[0].lstrip('/')/'index.html').is_file(),id
nodes=sorted(N.values(),key=lambda a:a['id']);edges=sorted(E.values(),key=lambda a:(a['from'],a['predicate'],a['to']))
result={'schema':schema,'version':'2.5.0','scope':'Editorial knowledge graph derived from the supplied catalogs; no new empirical findings, automatic entailment or evidence rankings. Source hashes identify catalog bytes, not current external page contents.','sourceCatalogs':{k:{'url':f'/{k}/catalog.json','sha256':h} for k,h in hashes.items()},'predicates':{k:{'label':a,'definition':b,'uri':VOC+k} for k,(a,b) in TYPES.items()},'nodes':nodes,'edges':edges,'unresolvedLinks':unresolved}
def write(name,data): (OUT/name).write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
write('catalog.json',result)
# JSON-LD uses explicit local vocabulary and unique record IRIs; relation resources preserve edge-level provenance.
from urllib.parse import quote
def iri(id):return BASE+'/knowledge-graph/record/?id='+quote(id,safe='')
ctx={'@vocab':VOC,'label':'http://www.w3.org/2000/01/rdf-schema#label','description':'http://purl.org/dc/terms/description','language':'http://purl.org/dc/terms/language','recordPage':{'@id':VOC+'recordPage','@type':'@id'},'sourcePage':{'@id':VOC+'sourcePage','@type':'@id'},'from':{'@id':VOC+'from','@type':'@id'},'to':{'@id':VOC+'to','@type':'@id'},'predicate':{'@id':VOC+'predicate','@type':'@id'},'catalog':{'@id':VOC+'catalog','@type':'@id'},'provenance':VOC+'provenance'}
ctx.update({k:{'@id':VOC+k,'@type':'@id'} for k in TYPES})
def ldprov(ps):return [dict(p,catalog=BASE+p['catalog']) for p in ps]
ld=[];adj={}
for e in edges:adj.setdefault(e['from'],{}).setdefault(e['predicate'],[]).append(iri(e['to']))
for n in nodes:
 a={'@id':iri(n['id']),'@type':'ScientificRecord','identifier':n['id'],'kind':n['kind'],'label':{'@value':n['title'],'@language':n['language']},'description':{'@value':n['summary'],'@language':n['language']},'language':n['language'],'status':n['status'],'recordPage':BASE+n['url'],'provenance':ldprov(n['provenance'])}
 if n['source'].startswith('https://'):a['sourcePage']=n['source']
 a.update(adj.get(n['id'],{}));ld.append(a)
for e in edges:ld.append({'@id':BASE+'/knowledge-graph/graph.jsonld#'+e['id'],'@type':'Relationship','from':iri(e['from']),'to':iri(e['to']),'predicate':VOC+e['predicate'],'provenance':ldprov(e['provenance'])})
write('graph.jsonld',{'@context':ctx,'@graph':ld})
# CSV for analysis tools; JSON preserves complete nested provenance. Prefix any spreadsheet formula-like strings.
def safe(v):return "'"+v if v.startswith(('=','+','-','@','\t','\r')) else v
for name,cols,rows in [('nodes.csv',['id','kind','title','language','status','url'],nodes),('edges.csv',['id','from','predicate','to','provenance'],edges)]:
 with (OUT/name).open('w',newline='',encoding='utf-8') as fp:
  w=csv.writer(fp);w.writerow(cols)
  for row in rows:w.writerow([safe(json.dumps(row[k],ensure_ascii=False,separators=(',',':')) if isinstance(row[k],list) else str(row[k])) for k in cols])
ns='http://www.sitemaps.org/schemas/sitemap/0.9';ET.register_namespace('',ns);xml=ET.Element('{'+ns+'}urlset')
for p in ['/knowledge-graph/','/knowledge-graph/method/']:ET.SubElement(ET.SubElement(xml,'{'+ns+'}url'),'{'+ns+'}loc').text=BASE+p
ET.ElementTree(xml).write(OUT/'sitemap.xml',encoding='utf-8',xml_declaration=True)
from collections import Counter
print(len(nodes),'nodes;',len(edges),'edges;',len(TYPES),'predicate types;',len(unresolved),'unresolved explicit links')
print(Counter(x['kind'] for x in nodes));print(Counter(x['predicate'] for x in edges));print('Unresolved:',[(u['from'],u['url']) for u in unresolved])
