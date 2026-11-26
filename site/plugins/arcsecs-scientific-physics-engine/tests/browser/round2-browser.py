import subprocess,time,json,sys,os,shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
p=Path(__file__).resolve().parents[2];out=p / 'test-results' / 'browser';out.mkdir(parents=True,exist_ok=True)
if __name__ == "__main__":
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),headless=True,args=['--no-sandbox','--disable-gpu'])
  results=[]
  for demo,selector in [('engine','[data-arcsecs-engine]'),('space','[data-arcsecs-space-travel-simulation]'),('drive','[data-arcsecs-dark-drive]')]:
   for width in (390,768,1440):
    page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
    import re
    html=subprocess.check_output(['php',str(p/'tests/browser/round1-preview.php'),str(p),demo],text=True)
    html=html.replace('<link rel="stylesheet" href="/assets/css/arcsecs-physics-engine.css">','<style>'+(p/'assets/css/arcsecs-physics-engine.css').read_text()+'</style>')
    def inline(match):
     return '<script>'+(p/match.group(1).lstrip('/')).read_text().replace('</script','<\\/script')+'</script>'
    html=re.sub(r'<script src="([^"]+)"></script>',inline,html)
    worker=(p/'assets/js/arcsecs-physics-worker.js').read_text()
    html=html.replace('workerUrl:"/assets/js/arcsecs-physics-worker.js"','workerUrl:URL.createObjectURL(new Blob(['+json.dumps(worker)+'],{type:"text/javascript"}))')
    page.route('**/*',lambda route:route.abort())
    page.set_content(html,wait_until='domcontentloaded');page.wait_for_timeout(450)
    root=page.locator(selector).first;assert root.count()==1
    assert root.locator('.arcsecs-demo-round-nav a').count()==7
    # Source-matched laboratory is reachable from every cockpit and does not start the legacy engine.
    lab=page.locator('[data-research-lab]');root.locator('[data-lab-open]').click();assert lab.is_visible()
    if demo=='engine':
     lab.locator('[data-lab-close]').focus();page.keyboard.press('1');assert page.evaluate('!document.querySelector("[data-arcsecs-engine]").__arcsecsApp.workerBusy')
    lab.locator('button[type=submit]').click();assert 'Calculation complete' in lab.locator('[data-lab-status]').inner_text(),lab.locator('[data-lab-status]').inner_text()
    result=json.loads(lab.locator('[data-lab-result]').inner_text());assert result['firstSampleT90']==67 and result['minimumSampleDerivative']>=-1e-15
    assert lab.locator('[data-lab-plot] polyline').count()==4
    with page.expect_download() as download:
     lab.locator('[data-lab-export]').click()
    data=json.loads(Path(download.value.path()).read_text());assert len(data['rows'])==2401 and data['model']=='escape' and data['implementationVersion']=='3.142.0'
    lab.locator('[name=ratio]').fill('2');assert lab.locator('[data-lab-export]').is_disabled();lab.locator('button[type=submit]').click()
    assert json.loads(lab.locator('[data-lab-result]').inner_text())['minimumSampleDerivative']<0
    lab.locator('[data-lab-mode]').select_option('phaseMatch');lab.locator('button[type=submit]').click();assert abs(json.loads(lab.locator('[data-lab-result]').inner_text())['roots'][0]['Q']-.257685206948)<1e-10
    lab.locator('[name=s]').fill('1');lab.locator('button[type=submit]').click();assert 'No forward' in lab.locator('[data-lab-status]').inner_text()
    for control in ('transferFloor','optics','detuning','temporal','finiteCell','mediatorReference','distance','intake','driveBudget'):
     lab.locator('[data-lab-mode]').select_option(control);lab.locator('button[type=submit]').click();assert 'Calculation complete' in lab.locator('[data-lab-status]').inner_text(),lab.locator('[data-lab-status]').inner_text()
    d=json.loads(lab.locator('[data-lab-result]').inner_text());assert d['massIntakeKgPerSecond']>0 and abs(d['shipFrameEnergyResidualWatts'])<1e-7
    with page.expect_download() as dl:lab.locator('[data-lab-export]').click()
    packet=json.loads(Path(dl.value.path()).read_text());assert packet['model']=='driveBudget' and packet['units']=='SI' and 'chapter 14' in packet['source']
    lab.locator('[name=capture]:enabled').fill('0');lab.locator('button[type=submit]').click();assert json.loads(lab.locator('[data-lab-result]').inner_text())['exhaustThrustNewtons']==0
    lab.locator('[data-lab-mode]').select_option('escape');lab.locator('[name=ratio]').fill('4');lab.locator('button[type=submit]').click()
    page.screenshot(path=str(out/f'review6-lab-{demo}-{width}.png'));lab.locator('[data-lab-close]').click();assert not lab.is_visible()
    if demo=='engine':
     assert page.evaluate('!!document.querySelector("[data-arcsecs-engine]").__arcsecsApp')
     assert page.evaluate('document.querySelector("[data-arcsecs-engine]").__arcsecsApp.runner.running === false')
     assert page.locator('[data-arcsecs-cancel-run]').is_disabled()
     page.evaluate('document.querySelector("[data-arcsecs-run]").click()')
     page.wait_for_function('document.querySelector("[data-arcsecs-engine]").__arcsecsApp.latestResult !== null',timeout=20000)
     assert page.locator('[data-arcsecs-cancel-run]').is_disabled()
     # Synchronously cancel after opening worker; verify no stale result accepted.
     assert page.evaluate('''() => {const a=document.querySelector('[data-arcsecs-engine]').__arcsecsApp;const prev=a.latestResult; a.runSimulation(); const busy=a.workerBusy; a.cancelComputation(); return busy && a.worker===null && !a.workerBusy && a.latestResult===prev;}''')
     assert 'cancelled' in page.locator('[data-arcsecs-status]').inner_text().lower()
     page.evaluate("""() => {const a=document.querySelector('[data-arcsecs-engine]').__arcsecsApp;a.setScenario('parallaxCalibration');a.form.elements.parallaxArcseconds.value='0.5';a.form.elements.baselineAu.value='2';a.form.elements.acceptedSteps.value='500';a.runSimulation();}""")
     page.wait_for_function("""() => {const a=document.querySelector('[data-arcsecs-engine]').__arcsecsApp;return !a.workerBusy && a.latestResult?.config.scenario==='parallaxCalibration';}""",timeout=20000)
     assert page.evaluate("document.querySelector('[data-arcsecs-engine]').__arcsecsApp.latestResult.metrics.parallaxParsecs") == 4
     assert page.evaluate("""() => {const a=document.querySelector('[data-arcsecs-engine]').__arcsecsApp;const d=[];a.download=(name,text,type)=>d.push({name,text,type});a.exportCsv();const rows=d[0].text.split(String.fromCharCode(10));return rows.length===501 && rows.every(row=>row.split(',').length===18);}""")
     assert page.evaluate("""async () => {const a=document.querySelector('[data-arcsecs-engine]').__arcsecsApp;const file=x=>({target:{files:[new File([JSON.stringify(x)],'scene.json')]}});await a.importScene(file({scenarioType:'parallaxCalibration',simulationSettings:{scenario:'parallaxCalibration',baselineAu:3,parallaxArcseconds:1.5,showGrid:false}}));const valid=a.toConfig().baselineAu===3&&a.toConfig().parallaxArcseconds===1.5&&!a.toConfig().showGrid&&!a.workerBusy;await a.importScene(file({scenarioType:'parallaxCalibration',simulationSettings:{baselineAu:4,parallaxArcseconds:'bad'}}));return valid&&a.toConfig().baselineAu===3&&a.root.querySelector('[data-arcsecs-status]').textContent.includes('Invalid scene JSON');}""")
     # User-provided saved-run names remain text, and quota failure is surfaced.
     assert page.evaluate("""() => {const a=document.querySelector('[data-arcsecs-engine]').__arcsecsApp;const load=a.memory.load,save=a.memory.saveRun;try{a.memory.load=()=>({runs:[{id:'test',name:'<img src=x onerror=alert(1)>',savedAtUtc:'test',result:a.latestResult}]});a.renderMemory();const list=a.root.querySelector('[data-arcsecs-memory-list]');const safe=list.textContent.includes('<img src=x')&&!list.querySelector('img');a.memory.saveRun=()=>{throw Error('quota')};a.saveRun();return safe&&a.root.querySelector('[data-arcsecs-status]').textContent.includes('Could not save');}finally{a.memory.load=load;a.memory.saveRun=save;a.renderMemory();}}""")
     if width==1440:
      page.evaluate("document.querySelector('[data-arcsecs-engine]').__arcsecsApp.runBenchmark()")
      page.wait_for_function("""() => {const a=document.querySelector('[data-arcsecs-engine]').__arcsecsApp;return !a.workerBusy&&a.latestBenchmark?.rows.length===16;}""",timeout=30000)
      page.evaluate("document.querySelector('[data-arcsecs-engine]').__arcsecsApp.runGrandExperiment()")
      page.wait_for_function("""() => {const a=document.querySelector('[data-arcsecs-engine]').__arcsecsApp;return !a.workerBusy&&a.latestGrandTour?.rows.length===9;}""",timeout=30000)
      assert page.evaluate("""() => {const a=document.querySelector('[data-arcsecs-engine]').__arcsecsApp;const d=[];a.download=(n,t)=>d.push(JSON.parse(t));a.exportBenchmark();a.exportEvidencePacket();return d[0]?.benchmark?.rows.length===16&&d[1]?.grandTour?.rows.length===9&&d.every(x=>x.packageVersion==='3.142.0');}""")
      assert page.evaluate("""() => {const a=document.querySelector('[data-arcsecs-engine]').__arcsecsApp;const originalWorker=window.Worker,st=window.setTimeout,ct=window.clearTimeout;let callback,oldWorker,terminated=false;window.Worker=class{constructor(){oldWorker=this;this.callbacks={}}addEventListener(k,f){this.callbacks[k]=f}postMessage(){}terminate(){terminated=true}};window.setTimeout=(f,ms)=>{if(ms===120000){callback=f;return 777}return st(f,ms)};window.clearTimeout=(i)=>{if(i!==777)ct(i)};try{const prior=a.latestResult;a.runSimulation();const runId=a.activeRunId;callback();oldWorker.callbacks.message({data:{type:'result',runId,result:{config:{scenario:'control'}}}});return terminated&&!a.workerBusy&&a.latestResult===prior&&a.root.querySelector('[data-arcsecs-status]').textContent.includes('timed out');}finally{window.Worker=originalWorker;window.setTimeout=st;window.clearTimeout=ct}}""")

    elif demo=='space':
     assert page.evaluate('!!document.querySelector("[data-arcsecs-space-travel-simulation]").__arcsecsSpaceController')
     page.locator('#outside').focus();page.keyboard.down('w');assert page.evaluate('!document.querySelector("[data-arcsecs-space-travel-simulation]").__arcsecsSpaceController.state.input.thrust');page.keyboard.up('w')
     root.focus();page.keyboard.down('w');assert page.evaluate('document.querySelector("[data-arcsecs-space-travel-simulation]").__arcsecsSpaceController.state.input.thrust');page.locator('#outside').focus();assert page.evaluate('!document.querySelector("[data-arcsecs-space-travel-simulation]").__arcsecsSpaceController.state.input.thrust');page.keyboard.up('w')
     page.evaluate('document.querySelector("[data-arcsecs-space-action=start]").click()');assert page.locator('[data-arcsecs-space-action=start]').get_attribute('aria-pressed')=='false'
     assert page.evaluate('''() => {const b=document.querySelector('[data-arcsecs-space-action=thrust]'); b.dispatchEvent(new PointerEvent('pointerdown')); b.dispatchEvent(new PointerEvent('pointercancel'));return !document.querySelector('[data-arcsecs-space-travel-simulation]').__arcsecsSpaceController.state.input.thrust;}''')
    else:
     assert page.evaluate('!!document.querySelector("[data-arcsecs-dark-drive]").__arcsecsDriveController')
     assert page.evaluate('!document.querySelector("[data-arcsecs-dark-drive]").__arcsecsDriveController.core.running')
     # Exercise scoped keyboard listener with actual controller sandbox active.
     page.evaluate('document.querySelector("[data-arcsecs-dark-drive]").__arcsecsDriveController.darkMatterTravelSandboxActive=true')
     page.locator('#outside').focus();page.keyboard.down('w');assert page.evaluate('!document.querySelector("[data-arcsecs-dark-drive]").__arcsecsDriveController.darkMatterTravelInput.thrust');page.keyboard.up('w')
     root.focus();page.keyboard.down('w');assert page.evaluate('document.querySelector("[data-arcsecs-dark-drive]").__arcsecsDriveController.darkMatterTravelInput.thrust');page.locator('#outside').focus();assert page.evaluate('!document.querySelector("[data-arcsecs-dark-drive]").__arcsecsDriveController.darkMatterTravelInput.thrust');page.keyboard.up('w')
     page.evaluate('''() => {const a=document.querySelector('[data-arcsecs-dark-drive]').__arcsecsDriveController; a.handleDemoSelection('dark-matter-ship-travel-sandbox');}''')
     # Dynamically generated route controls must invoke the delegated listener.
     assert page.locator('[data-arcsecs-travel-route-autopilot]').count()>0
     assert page.evaluate('''() => {const a=document.querySelector('[data-arcsecs-dark-drive]').__arcsecsDriveController;const n=a.darkMatterTravelAutopilotTicks;document.querySelector('[data-arcsecs-travel-route-autopilot]').click();return a.darkMatterTravelAutopilotTicks===n+12;}''')
    page.wait_for_timeout(200);page.evaluate('window.scrollTo(0,0)');page.screenshot(path=str(out/f'{demo}-{width}.png'))
    record={'demo':demo,'width':width,'page_errors':errs,'scroll_width':page.evaluate('document.documentElement.scrollWidth'),'viewport':width,'result':'pass' if not errs else 'errors'};print(record,flush=True);results.append(record)
    page.close()
  browser.close()
  (out/'browser-validation.json').write_text(json.dumps(results,indent=2)+'\n');assert not any(r['page_errors'] or r['scroll_width']>r['viewport'] for r in results)

