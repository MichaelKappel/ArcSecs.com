import subprocess, json, re, os, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
p=Path(__file__).resolve().parents[2]; out=p/'test-results'/'browser';out.mkdir(parents=True,exist_ok=True)
html=subprocess.check_output(['php',str(p/'tests/browser/round1-preview.php'),str(p),'cosmic'],text=True)
html=html.replace('<link rel="stylesheet" href="/assets/css/arcsecs-physics-engine.css">','<style>'+(p/'assets/css/arcsecs-physics-engine.css').read_text()+'</style>')
html=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>'+(p/m.group(1).lstrip('/')).read_text().replace('</script','<\\/script')+'</script>',html)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),headless=True,args=['--no-sandbox','--disable-gpu']);results=[]
 for width in (390,768,1440):
  page=b.new_page(viewport={'width':width,'height':900},accept_downloads=True,reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.route('**/*',lambda r:r.abort());page.set_content(html,wait_until='domcontentloaded');root=page.locator('[data-cosmic-lab]');assert root.count()==1
  for mode in ('reference','recession','boundary','external','tidal','population','adiabatic','movingShell','causalField','localCollision','photonAging','photonShell','photonTiming','photonRecoil','outflow','clockCalibration','quantumReceiver'):
   root.locator('[data-cosmic-mode]').select_option(mode);assert root.locator('[data-cosmic-export]').is_disabled();root.locator('button[type=submit]').click();assert 'Calculation complete' in root.locator('[data-cosmic-status]').inner_text(),root.locator('[data-cosmic-status]').inner_text();assert root.locator('[data-cosmic-chart] polyline').count()>=1
   with page.expect_download() as dl:root.locator('[data-cosmic-export]').click()
   data=json.loads(Path(dl.value.path()).read_text());assert data['result']['model']==mode and data['implementationVersion']=='3.142.0';assert data['result']['rows'];assert 'not observation' in data['classification']
   if mode in ('adiabatic','movingShell'):
    assert root.locator('[data-cosmic-trajectory]').is_visible();assert root.locator('[data-cosmic-trajectory-chart] polyline').count()>=1;assert data['result']['maxRelativeEnergyResidual']<1e-8;assert data['result']['acceptedSteps']==2000;assert 'New conditional extension' in data['source']
    assert all(abs(r['energyResidual'])<1e-7 for r in data['result']['rows'])
   if mode=='causalField':
    assert root.locator('[data-cosmic-trajectory]').is_visible();assert root.locator('[data-cosmic-trajectory-chart] polyline').count()==3;assert data['result']['maxAbsoluteMomentumResidual']<1e-9;assert data['result']['maxAbsoluteEnergyResidual']<.00013;assert data['result']['nominalArrival']==6;assert 'R41' in data['source']
    assert abs(next(r for r in data['result']['rows'] if r['t']==6)['receiverForce']-.0626366117366)<1e-9
    root.locator('[name=receiverCharge]:enabled').fill('-1');assert root.locator('[data-cosmic-export]').is_disabled();root.locator('button[type=submit]').click();assert 'Calculation complete' in root.locator('[data-cosmic-status]').inner_text()
    with page.expect_download() as dl:root.locator('[data-cosmic-export]').click()
    assert json.loads(Path(dl.value.path()).read_text())['result']['rows'][-1]['receiverMomentum']<0
    root.locator('[name=receiverCharge]:enabled').fill('1');root.locator('button[type=submit]').click()
   if mode=='localCollision':
    assert root.locator('[data-cosmic-trajectory]').is_visible();assert root.locator('[data-cosmic-trajectory-chart] polyline').count()==3
    assert data['result']['maxRelativeEnergyResidual']<.0003;assert data['result']['maxAbsoluteLocalResidual']<.0006;assert len(data['result']['profile'])==512;assert 'New conditional extension' in data['source']
    root.locator('[name=initialState]:enabled').fill('0');assert root.locator('[data-cosmic-export]').is_disabled();root.locator('button[type=submit]').click();assert 'Calculation complete' in root.locator('[data-cosmic-status]').inner_text()
    with page.expect_download() as dl:root.locator('[data-cosmic-export]').click()
    null=json.loads(Path(dl.value.path()).read_text());assert all(r['totalEnergy']==0 for r in null['result']['rows']);root.locator('[name=initialState]:enabled').fill('1');root.locator('button[type=submit]').click()
   if mode=='photonAging':
    assert root.locator('[data-cosmic-trajectory]').is_visible();assert abs(data['result']['finalEnergyRatio']-.5)<1e-8;assert abs(data['result']['finalSpeedDeficit']-2e-16)<1e-23;assert data['result']['stationaryArrivalStretch']==1;assert '30R' in data['source']
   if mode=='photonShell':
    assert data['result']['exitAcceleratesWithoutLoss'];assert data['result']['wallCharacteristic']<1;assert data['result']['endpointEnergySurvivalCeiling']<1.5e-8
   if mode=='photonTiming':
    assert abs(data['result']['arrivalTime']-1.4840764352)<1e-9;assert abs(data['result']['arrivalStretch']-1.114517297)<1e-9
    root.locator('[name=sourceVelocity]:enabled').fill('0');root.locator('[name=receiverVelocity]:enabled').fill('0');assert root.locator('[data-cosmic-export]').is_disabled();root.locator('button[type=submit]').click()
    with page.expect_download() as dl:root.locator('[data-cosmic-export]').click()
    assert json.loads(Path(dl.value.path()).read_text())['result']['arrivalStretch']==1
    root.locator('[name=sourceVelocity]:enabled').fill('-.08');root.locator('[name=receiverVelocity]:enabled').fill('.03');root.locator('button[type=submit]').click()
   if mode=='photonRecoil':
    assert data['result']['allowed'] and not data['result']['withinSelectedAngle'];assert abs(data['result']['deflectionDegrees']-19.7191160383)<1e-9
    root.locator('[name=bathSpeed]:enabled').fill('1');root.locator('button[type=submit]').click()
    with page.expect_download() as dl:root.locator('[data-cosmic-export]').click()
    assert not json.loads(Path(dl.value.path()).read_text())['result']['allowed'];root.locator('[name=bathSpeed]:enabled').fill('.9');root.locator('button[type=submit]').click()
   if mode=='outflow':
    assert abs(data['result']['arrivalStretch']-2.041666666666667)<1e-12;assert data['result']['arrivalCoordinateSpeed']>2;assert data['result']['arrivalRelativeSpeed']<1
   if mode=='clockCalibration':
    assert data['result']['countStretch']==2;assert abs(data['result']['srRateRatio']-.8)<1e-12
   if mode=='quantumReceiver':
    assert data['result']['maxRelativeEnergyResidual']<1e-7;assert data['result']['finalReceiverPopulation']>0;assert data['result']['maxBlochNormResidual']<1e-8
   if mode=='boundary':assert all(r['interiorScale']==1 for r in data['result']['rows'])
   if mode=='external':assert all(r['newtonianShellAcceleration']==0 for r in data['result']['rows'])
   if mode=='population':root.locator('[name=initial]').fill('0');assert root.locator('[data-cosmic-export]').is_disabled();root.locator('button[type=submit]').click();assert 'Calculation complete' in root.locator('[data-cosmic-status]').inner_text()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), mode
   if mode in ('boundary','reference','external','adiabatic','movingShell','causalField','localCollision','photonAging','photonShell','photonTiming','photonRecoil','outflow','clockCalibration','quantumReceiver'):page.screenshot(path=str(out/f'cosmic-{mode}-{width}.png'),full_page=True)
  root.locator('[data-cosmic-mode]').select_option('outflow');root.locator('button[type=submit]').click()
  with page.expect_download() as dl:root.locator('[data-cosmic-csv]').click()
  assert len(Path(dl.value.path()).read_text().splitlines())==202
  with page.expect_download() as dl:root.locator('[data-cosmic-recipe]').click()
  recipe=json.loads(Path(dl.value.path()).read_text());assert recipe['model']=='outflow' and 'result' not in recipe
  root.locator('[name=redshift]:enabled').fill('2');assert root.locator('[data-cosmic-recipe]').is_disabled()
  root.locator('[data-cosmic-import]').set_input_files({'name':'recipe.json','mimeType':'application/json','buffer':json.dumps(recipe).encode()})
  page.wait_for_function("document.querySelector('[data-cosmic-status]').textContent.includes('Recipe loaded')")
  assert root.locator('[name=redshift]:enabled').input_value()=='1';assert root.locator('[data-cosmic-export]').is_disabled();root.locator('button[type=submit]').click()
  root.locator('[data-cosmic-import]').set_input_files({'name':'invalid.json','mimeType':'application/json','buffer':b'{"schema":"bad"}'})
  page.wait_for_function("document.querySelector('[data-cosmic-status]').textContent.includes('Import rejected')")
  root.locator('[data-cosmic-reset]').click();assert root.locator('[data-cosmic-export]').is_disabled()
  root.locator('[data-cosmic-mode]').select_option('reference');root.locator('[name=matter]').fill('1');root.locator('[name=radiation]').fill('.1');root.locator('button[type=submit]').click();assert 'Calculation rejected' in root.locator('[data-cosmic-status]').inner_text();assert root.locator('[data-cosmic-export]').is_disabled();assert not errors,errors
  results.append({'width':width,'experiments':17,'exports':21,'invalidInputRejected':True,'uncaughtErrors':errors});page.close()
 b.close()
(out/'cosmic-results.json').write_text(json.dumps(results,indent=2)+'\n');print(json.dumps(results))
