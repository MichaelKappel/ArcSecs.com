import subprocess,time,json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
p=Path(__file__).resolve().parents[2];out=p.parent / 'arcsecs-round1-browser-output';out.mkdir(exist_ok=True)
if __name__ == "__main__":
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu'])
  results=[]
  for demo,selector in [('engine','[data-arcsecs-engine]'),('space','[data-arcsecs-space-travel-simulation]'),('drive','[data-arcsecs-dark-drive]')]:
   for width in (390,1440):
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
    assert root.locator('.arcsecs-demo-round-nav a').count()==6
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
  (out/'browser-validation.json').write_text(json.dumps(results,indent=2)+'\n');assert not any(r['page_errors'] for r in results)

