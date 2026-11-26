"""Generate independent R41 fixtures from a public ArcSecs repository checkout."""
import sys, json, hashlib
from pathlib import Path
repo = Path(sys.argv[1]).resolve()
source = repo/'tools/attractive_field_v1.py'
sys.path.insert(0, str(source.parent))
from attractive_field_v1 import AttractiveField1D, Particle
base=dict(distance=12,speed=2,gap=.15,width=.3,receiverCharge=1,sourceCharge=1,mass=1000,sourceMass=1000,sourceVelocity=0,symmetric=0,duration=8,dt=.025,resolution=384)
cases={"book":{},"moving":{"sourceVelocity":.25},"opposite":{"receiverCharge":-1},"left":{"distance":-12},"slow":{"speed":1},"symmetric":{"symmetric":1},"uncoupled":{"sourceCharge":0},"refined":{"dt":.0125},"asymmetric":{"mass":100,"sourceMass":200,"sourceCharge":.6,"width":.45,"distance":8,"speed":1.5},"wider":{"width":.65,"gap":.5,"distance":6}}
results=[]
for name, overrides in cases.items():
 p={**base,**overrides}; parts=[Particle(0,0,p['mass'],p['receiverCharge']),Particle(p['distance'],p['sourceMass']*p['sourceVelocity'],p['sourceMass'],p['sourceCharge'])]
 if p['symmetric']:parts.append(Particle(-p['distance'],0,p['sourceMass'],p['sourceCharge']))
 model=AttractiveField1D(parts,length=96,n=p['resolution'],speed=p['speed'],gap=p['gap'],width=p['width'])
 rows=model.evolve(p['duration'],dt=p['dt'],trace_dt=.25)
 results.append(dict(name=name,parameters=p,rows=rows,sourceMomentum=model.parts[1].p,sourcePosition=model.parts[1].x))
output=dict(source='tools/attractive_field_v1.py',sha256=hashlib.sha256(source.read_bytes()).hexdigest(),notes='Original NumPy FFT implementation. Browser symmetric Fourier basis omits unpaired Nyquist mode.',cases=results)
Path(__file__).with_name('causal-reference.json').write_text(json.dumps(output,indent=2)+'\n')
