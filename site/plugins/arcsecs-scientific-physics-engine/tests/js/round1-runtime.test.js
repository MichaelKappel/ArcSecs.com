const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function load(reduced=false){const timers=new Map();let id=0;const window={Worker:class{},matchMedia:()=>({matches:reduced}),setTimeout:cb=>{timers.set(++id,cb);return id;},clearTimeout:n=>timers.delete(n)};const document={readyState:'loading',addEventListener(){},hidden:false};vm.runInNewContext(fs.readFileSync('assets/js/arcsecs-physics-engine.js','utf8'),{window,document});return {api:window.ArcSecsPhysicsDemo,timers,document};}
test('visual clock is refresh-rate independent, and paused clock does not advance',()=>{const {api}=load();for(const hz of [30,60,120,144]){const r=new api.FixedTimeStepRunner();for(let i=0;i<hz;i++)r.update(1/hz);assert.equal(r.tick,60);r.pause();r.update(1);assert.equal(r.tick,60);r.stepOneTick();assert.equal(r.tick,61);}});
function setup(reduced=false){const l=load(reduced),root={isConnected:true,dataset:{autoRun:'true',autoGrandExperiment:'true',autoLaunchDelayMs:'900'}},calls=[];const d=new l.api.AutoLaunchDirector(root);const c={root,updateAutoLaunchPanel(){},updateStatus(){},runSimulation(o){calls.push('scenario');assert.equal(o.autoStarted,true);},runGrandExperiment(){calls.push('sweep');}};return {...l,d,c,calls};}
test('combined automatic launch starts only the scenario and queues the sweep',()=>{const l=setup();l.d.execute(l.c,false);assert.equal(l.timers.size,1);[...l.timers.values()][0]();assert.deepEqual(l.calls,['scenario']);assert.equal(l.c.pendingSweep,true);});
test('cancel removes pending launch and reduced motion schedules no work',()=>{let l=setup();l.d.execute(l.c,false);l.d.cancel();assert.equal(l.timers.size,0);l=setup(true);l.d.execute(l.c,false);assert.equal(l.timers.size,0);});
test('hidden page does not launch automatic computation',()=>{const l=setup();l.d.execute(l.c,false);l.document.hidden=true;[...l.timers.values()][0]();assert.deepEqual(l.calls,[]);});
