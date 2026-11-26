"""Independent 90-digit BS1–BS2 reference using exact binary64 inputs.
Requires mpmath. Law of cosines evaluated directly at high precision.
"""
from pathlib import Path
import json, math
import mpmath as mp
mp.mp.dps=90
cases=[(1e-16,.5,0,1.),(1e-16,.5,0,math.nextafter(1.,0.)),(1e-8,.5,0,1.),(1e-8,.5,0,math.nextafter(1.,0.)),(1e-8,.5,0,.99999999999),(1e-4,.5,0,.999999985),(1e-4,.5,0,.99999998),(.01,.5,.1,.9),(.01,.5,.3,.8),(.1,.5,.3,.001)]
rows=[]
for e,y,h,b in cases:
    E,Y,H,B=map(mp.mpf,(e,y,h,b)); p=mp.sqrt(1-E**2); r=mp.sqrt((1-Y)**2-E**2); q=mp.sqrt(Y**2-H**2)/B
    allowed=abs(p-r)<=q<=p+r
    angle=float(mp.acos((p*p+r*r-q*q)/(2*p*r))*180/mp.pi) if allowed else None
    rows.append({'parameters':{'gapFraction':e,'lossFraction':y,'bathGap':h,'bathSpeed':b,'angleArcsec':1},'allowed':allowed,'angleDegrees':angle})
Path(__file__).with_name('high-precision.json').write_text(json.dumps(rows,indent=2)+'\n')
