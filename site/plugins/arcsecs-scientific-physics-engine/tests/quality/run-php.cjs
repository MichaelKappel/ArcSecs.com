const {spawnSync}=require('node:child_process');
const {readdirSync}=require('node:fs');
const path=require('node:path');
let failed=0;
function run(args){const r=spawnSync('php',args,{stdio:'inherit'});if(r.status!==0){failed++;console.error('PHP check failed:',args.join(' '),r.error||r.signal||r.status);}}
for(const file of readdirSync('tests/php').filter(x=>x.endsWith('-test.php')).sort())run([path.join('tests/php',file)]);
for(const file of ['arcsecs-scientific-physics-engine.php',...readdirSync('includes').filter(x=>x.endsWith('.php')).map(x=>'includes/'+x),...readdirSync('tests/php').filter(x=>x.endsWith('.php')).map(x=>'tests/php/'+x),...readdirSync('tests/browser').filter(x=>x.endsWith('.php')).map(x=>'tests/browser/'+x)])run(['-l',file]);
process.exitCode=failed?1:0;
