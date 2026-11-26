"""Offline build tool; not a production dependency. Run from any directory."""
import json, pathlib, hashlib, xml.etree.ElementTree as ET
root=pathlib.Path(__file__).resolve().parents[2]; out=root/'museum'; base='https://beyondspacetime.org'; entries=[]; modules={}; catalogs={}
def load(name):
 p=root/name/'catalog.json';raw=p.read_bytes();catalogs[name]=dict(url=f'/{name}/catalog.json',sha256=hashlib.sha256(raw).hexdigest());return json.loads(raw)
def add(id,title,summary,url,kind,lang='en',status='',source='',related=None,keywords=''):
 if url.startswith(base):url=url[len(base):]
 assert url.startswith('/') and not url.startswith('//'),url
 entries.append(dict(id=id,title=title,summary=summary,url=url,kind=kind,language=lang,status=status,source=source,related=related or [],keywords=keywords))
modlist=[('foundations','Twelve foundations','Read the exact research charter, conventional reference physics and interactive numerical controls.','LEARN'),('evidence','Scientific evidence','Explore reported verification, failed mechanisms, and seven validation gates.','VERIFY'),('research','Research workspace','Run up to eight ordered cases and replay complete investigations.','INVESTIGATE'),('model-comparison','Model comparison','Sweep parameters and compare compatible observables.','COMPARE'),('timeline','Discovery timeline','Trace numbered reports, scientific editions and mathematical milestones.','TRACE'),('global','Global learning','Read foundation lessons in English, Spanish and French.','CONNECT'),('offline','Offline learning studio','Prepare a portable lesson library and calculate on your device.','TAKE ALONG'),('visualizations','Interactive visual science','Inspect synchronized diagrams, numerical samples and reference comparisons.','VISUALIZE'),('knowledge-graph','Semantic knowledge graph','Follow explicit source-grounded links between premises, models, evidence and validation requirements.','CONNECT'),('experiment-design','Scientific experiment design','Seal numerical hypotheses, controls, decision criteria and reproducible protocols before executing a study.','DESIGN'),('universal-time','Universal time & clock observations','Explore universal progression, the dinner deadline, measured clocks, candidate process rates and remote synchronization.','TIME')]
for id,title,summary,tag in modlist:
 modules[id]=dict(title=title,summary=summary,url=f'/{id}/',tag=tag);add('module:'+id,title,summary,f'/{id}/','module')
f=load('foundations'); e=load('evidence'); r=load('research'); c=load('model-comparison'); t=load('timeline'); g=load('global'); source=f['source'];
for a in f['lessons']:
 slug=a['slug']; related=[dict(label=x['title'],url='/evidence/ledger/'+x['id']+'/') for x in e['records'] if slug in x['foundations']]; add('foundation:'+slug,a['title'],a['answer'],a['url'],'foundation',status=a['epistemic_status'],source=a['source']['url'],related=related,keywords=a['statement']+' '+a['equation'])
for a in e['records']:
 rel=[dict(label='Foundation: '+i,url='/foundations/'+i+'/') for i in a['foundations'] if (root/'foundations'/i/'index.php').exists()]; add('evidence:'+a['id'],a['title'],a['finding'],'/evidence/ledger/'+a['id']+'/','evidence',status=e['statuses'][a['status']],source=a['source_url'],related=rel,keywords=a['branch']+' '+a['limitation']+' '+a['next_test'])
for a in e['gates']: add('gate:'+a['id'],a['title'],a['deliverable'],'/evidence/gates/','gate',status='Open research gate',source=e['source']['url'],keywords=a['pass_condition'])
for id,a in e['workbenches'].items():add('workbench:'+id,a['title'],a['description'],'/evidence/workbench/'+id+'/','experiment',status='Conditional calculation',source=e['source']['url'])
for id,a in r['presets'].items():add('research:'+id,a['title'],a['description'],'/research/?preset='+id,'investigation',status='Conditional calculation',source=source)
for id,a in c['presets'].items():add('comparison:'+id,a['title'],a['description'],'/model-comparison/?preset='+id,'comparison',status='Conditional calculation',source=source)
for a in t['records']:add('timeline:'+a['id'],a['title'],a['summary'],'/timeline/record/'+a['id']+'/','timeline',status=t['statuses'][a['status']],source=a['source']['url'],related=a['related'],keywords=a['branch']+' '+a.get('original_title',''))
for lang,a in g['languages'].items():
 for l in a['lessons']:add('translation:'+lang+':'+l['id'],l['title'],l['answer'],'/global/'+lang+'/'+l['id']+'/','lesson',lang,status='Educational translation' if lang!='en' else 'Educational lesson',source=source,keywords=l['context']+' '+l['test'])
 for i,l in enumerate(a['glossary']):
  add('glossary:'+lang+':'+str(i),l.get('term',l.get('title','')),l.get('definition',l.get('description','')),'/global/'+lang+'/glossary/','glossary',lang,source=source)
v=load('visualizations')
for a in v['scenes']:add('visualization:'+a['id'],a['title'],a['description'],a['url'],'visualization',status='Conditional educational visualization',source=a['source'],related=[dict(label='Original model',url=a['modelUrl'].removeprefix(base))],keywords=a['question']+' '+a['detail'])
d=load('experiment-design')
for id,a in d['presets'].items():add('design:'+id,a['title'],a['notes']['question'],'/experiment-design/?preset='+id,'design',status='Editable conditional numerical protocol',source=e['source']['url'],related=[dict(label='Calculation model',url=d['models'][a['model']]['url'].removeprefix(base))]+[dict(label='Related evidence',url='/evidence/ledger/'+r+'/') for r in a['evidence']],keywords=a['notes']['hypothesis']+' '+a['notes']['alternative'])
u=load('universal-time')
for a in u['records']:add('time:'+a['id'],a['title'],a['summary'],a['url'],'time',status=a['status'],source=a['source'],related=[dict(label='Related foundation',url='/foundations/'+f+'/') for f in a['foundations']]+[dict(label='Validation gates',url='/evidence/gates/')],keywords=a['keywords'])
assert len(set(x['id'] for x in entries))==len(entries)
for x in entries:
 assert x['title'] and x['summary'],x
 path=x['url'].split('?')[0]; assert (root/path.lstrip('/')/'index.php').is_file() or (root/path.lstrip('/')/'index.html').is_file(),x
 x['related']=[q for q in x['related'] if q['url'].startswith('/') and not q['url'].startswith('//') and (root/q['url'].split('?')[0].lstrip('/')/'index.php').is_file()]
result=dict(schema='beyondspacetime.museum.catalog.v1',version='2.5.0',scope='Original educational catalog index of the eleven supplied educational modules. No new empirical validation. Original v1.2 root code not supplied.',modules=modules,sourceCatalogs=catalogs,entries=entries)
(out/'catalog.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n')
ns='http://www.sitemaps.org/schemas/sitemap/0.9'; ET.register_namespace('',ns); xml=ET.Element('{'+ns+'}sitemapindex')
for name in ['foundations','evidence','research','model-comparison','timeline','global','visualizations','knowledge-graph','experiment-design','universal-time','museum']:
 ET.SubElement(ET.SubElement(xml,'{'+ns+'}sitemap'),'{'+ns+'}loc').text=base+'/'+name+'/sitemap.xml'
ET.ElementTree(xml).write(out/'sitemap-index.xml',encoding='utf-8',xml_declaration=True)
xml=ET.Element('{'+ns+'}urlset')
for path in ['/','/museum/','/museum/guide/','/offline/']:
 ET.SubElement(ET.SubElement(xml,'{'+ns+'}url'),'{'+ns+'}loc').text=base+path
ET.ElementTree(xml).write(out/'sitemap.xml',encoding='utf-8',xml_declaration=True)
print('Indexed',len(entries),'records from',len(catalogs),'catalogs')
