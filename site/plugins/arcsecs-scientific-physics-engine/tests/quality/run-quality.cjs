// Explicit regression gate. Historical failures remain visible and strict mode remains red.
const {spawnSync}=require('node:child_process');
const {readFileSync,readdirSync,mkdirSync,writeFileSync}=require('node:fs');
const path=require('node:path');
let failed=false;
function check(cmd,args){const r=spawnSync(cmd,args,{stdio:'inherit'});if(r.status!==0){console.error('Failed:',cmd,args,r.error||r.signal||r.status);failed=true;}}
check(process.platform==='win32'?'tsc.cmd':'tsc',['--noEmit','--project','tsconfig.json']);
check(process.execPath,['tests/quality/run-php.cjs']);
const files=readdirSync('tests/js').filter(x=>x.endsWith('.test.js')).sort().map(x=>'tests/js/'+x);
const r=spawnSync(process.execPath,['--test','--test-reporter='+path.resolve('tests/quality/test-reporter.cjs'),...files],{encoding:'utf8',maxBuffer:32*1024*1024,timeout:180000});
if(r.stderr)process.stderr.write(r.stderr);
let actual=[];try{actual=r.stdout.trim().split('\n').filter(Boolean).map(JSON.parse);}catch(e){console.error(e);failed=true;}
if(r.error||r.signal||!actual.length||![0,1].includes(r.status)){console.error('Test runner failure',r.error||r.signal||r.status);failed=true;}
const base=JSON.parse(readFileSync('tests/quality/legacy-baseline.json','utf8')).tests;
const key=x=>x.file.replaceAll('\\','/')+'::'+x.name;
const map=new Map(base.map(x=>[key(x),x]));
const seen=new Set(),known=[],unexpected=[],recovered=[];
for(const x of actual){x.file=path.relative(process.cwd(),x.file).replaceAll('\\','/');if(x.name.startsWith(path.resolve('tests')+path.sep))x.name=path.relative(process.cwd(),x.name).replaceAll('\\','/');const k=key(x),old=map.get(k);if(seen.has(k)){unexpected.push({reason:'duplicate test identity',...x});}seen.add(k);
 if(x.type==='test:fail'){
  // For missing fixture failures require the same missing file; for historical assertion failures require same code.
  if(old?.type==='test:fail'&&old.error===x.error&&(x.error!=='ENOENT'||old.message===x.message)&&(x.error!=='ERR_TEST_FAILURE'||(old.diagnostic&&old.diagnostic===x.diagnostic))){known.push({file:x.file,name:x.name,error:x.error,category:old.category});}
  else unexpected.push(x);
 }else if(old?.type==='test:fail')recovered.push({file:x.file,name:x.name});
}
const missing=base.filter(x=>!seen.has(key(x)));if(missing.length||unexpected.length)failed=true;
const report={version:JSON.parse(readFileSync('package.json')).version,passed:actual.filter(x=>x.type==='test:pass').length,knownLegacyFailures:known.length,unexpectedFailures:unexpected.length,missingBaselineTests:missing.length,recovered:recovered.length,known,unexpected,missing,recovered,gate:failed?'FAIL':'PASS_WITH_DISCLOSED_LEGACY_DEBT'};
mkdirSync('test-results',{recursive:true});writeFileSync('test-results/quality.json',JSON.stringify(report,null,2)+'\n');
for(const x of known)console.log('KNOWN LEGACY FAILURE:',x.file,'—',x.name,'—',x.category);
console.log(JSON.stringify({...report,known:undefined,unexpected:undefined,missing:undefined,recovered:report.recovered},null,2));
if(unexpected.length)console.error('Unexpected:',unexpected.map(x=>({name:x.name,file:x.file,message:x.message?.slice(0,500)})));if(missing.length)console.error('Missing:',missing.map(key));
process.exitCode=failed?1:0;
