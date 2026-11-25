#!/usr/bin/env python3
"""Independent algebra and dataset cross-checks for Review 4.0; not experiments."""
from pathlib import Path
import csv, json, math, hashlib, platform
import numpy as np
R=Path(__file__).resolve().parents[1]; O=R/'appendices'; results=[]
def check(name, value, tolerance, detail=''):
    ok=abs(value)<=tolerance;results.append(dict(check=name,residual=value,tolerance=tolerance,passed=ok,detail=detail));assert ok,name
# Direct local velocity derivative versus finite difference on a prescribed ray.
for C in (.5,.8,1.):
    B=1.; gap=.1;q=math.sqrt(1-gap*gap)/C; b=C*q/gap
    def w(t):return C*C*q/math.hypot(C*q,gap*t)
    def Y(t):return C/B*(math.asinh(b)-math.asinh(b/t))+math.atanh(w(t)/B)
    for t in (1.1,1.5,2.,4.):
        h=1e-5; v=w(t); exact=v/B*v*v*(1/(C*C)-1/(B*B))/(1-v*v/(B*B))
        fd=(Y(t*math.exp(h))-Y(t*math.exp(-h)))/(2*h)
        check(f'R5 C={C}, tau={t}',fd-exact,2e-9)
        lam=v*v*(1/C**2-1/B**2)/(1-v*v/C**2)
        dY=v/B-(1+lam)*v/B*(1-v*v/C**2)/(1-v*v/B**2)
        check(f'R6 equality C={C}, tau={t}',dY,1e-13)
# Reconstruct photon counting with physical clocks and different numerical energy units.
flow=json.loads((O/'review4_summary.json').read_text())['flow_reference']; dg=flow['D_G']; ZE=flow['Z_E']; AT=flow['stretch_T'];re=1.;ra=1/math.cosh(flow['eta']);Ac=ra/re*AT
check('clock ratio calibration',Ac-flow['stretch_clock'],1e-12)
N=5000.;Ee=2.;Ea=Ee/ZE;dt_e=.4;dt_a=Ac*dt_e;survival=.8;area=4*math.pi*dg*dg
Le=N*Ee/dt_e; direct=N*survival*Ea/(area*dt_a); flux=Le*survival/(area*ZE*Ac)
check('photon counting',direct-flux,1e-10)
es,er=.5,2.; check('different energy standards',direct/er-(Le/es)*survival/(area*ZE*Ac)*es/er,1e-10)
# Point-mass acceleration Jacobian from finite differences.
x=np.array([1.,0.,0.]); h=1e-5;g=lambda x:-x/np.linalg.norm(x)**3
J=np.column_stack([(g(x+np.eye(3)[i]*h)-g(x-np.eye(3)[i]*h))/(2*h) for i in range(3)])
check('tidal acceleration sign',np.max(abs(J-np.diag([2.,-1.,-1.]))),1e-8)
# Read and independently recompute static and moving wall endpoint ledgers.
for name in ('review4_wall_extrema.csv','review4_recoil.csv'):
    for i,r in enumerate(csv.DictReader((O/name).open())):
        if name.endswith('extrema.csv'):
            total=sum(float(r[k]) for k in ('E_final','heat','recoil')); E0=float(r['energy0'])
        else: total=sum(float(r[k]) for k in ('energy','heat','bath_recoil','wall_recoil')); E0=1.
        check(f'{name} row {i} endpoint ledger',total-E0,2e-7)
# Exact charter occurs verbatim in active manuscript, constraints and primary memory.
charter=(R/'docs/research/authoritative_charter.md').read_text().split('\n\n')[-1].strip()
for path in ('ArcSecs_Scientific_Paper_Review_4.md','.uai/constraints.uai','.uai/memory.uai'):
    check('charter: '+path,0 if charter in (R/path).read_text() else 1,0)
with (O/'review4_extra_checks.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(results[0]));w.writeheader();w.writerows(results)
(O/'review4_extra_verification.txt').write_text(f'{len(results)} algebra/dataset regression assertions passed. These are not independent physical experiments.\n'+'\n'.join(f"PASS {r['check']}: residual={r['residual']:.4g}, tolerance={r['tolerance']:.4g}" for r in results)+'\n')
print(f'{len(results)} assertions passed')
