"""Outward interval enclosure for the static smooth-wall Part XXXI reference.
Uses mpmath.iv at 40 decimal digits. Position as independent variable;
strict Picard box containment + interval Euler endpoint enclosure.
Not a certificate for any other parameter set or a microscopic model.
"""
from pathlib import Path
import csv,json,time
from mpmath import iv
iv.dps=40
I=iv.mpf; ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'appendices'
zero=I(0); one=I(1); gap=I('0.000001');cap=I(2);M=I(100);rise=I('0.2')
def hull(a,b):return I([a.a,b.b])
def pos(a):return I([max(zero,a.a),max(zero,a.b)])
def coeff(x,inside):
    if not inside:return one,zero
    # C monotonically increases on [0,1]; endpoint evaluation narrows dependency.
    c=lambda q:one+rise*q*q*(3-2*q)
    C=I([c(x.a).a,c(x.b).b]);Cp=6*rise*x*(1-x)
    return C,Cp

def rhs(x,b,a,inside):
    C,Cp=coeff(x,inside); d=gap+a; r=b-C*a; p=r/C; E=iv.sqrt(r*r+d*d); v=C*r/E
    if not (r.a>0 and d.a>0 and v.a>0):raise ValueError('lost positive momentum or gap')
    # algebraically equivalent spatial evolution a' = dot(a)/v
    ax=pos(1-d/(C*r)-a*E/(M*C*r))*pos(1-a/cap)
    ad=ax*v
    dv=v*v*Cp/C-C*C*d*(d+p)*ad/(E**3)
    return Cp*a,ax,dv,v

def run(n):
    # b=r+C*a, b'=C'*a. On a>=0, r>0, a<=cap, off-diagonal derivatives
    # are nonnegative: b' increases with a, a' increases with b.
    # Cooperative comparison: propagate two point-corner enclosures rather
    # than wrapping both independent intervals with the adverse diagonal.
    h=one/n; lead=3*n//10; b=iv.sqrt(1-gap*gap);a=zero; maxd=None; minv=one; records=[]
    for j in range(lead+n):
        x0=I(j-lead)/n;x1=I(j-lead+1)/n; X=hull(x0,x1);inside=j>=lead
        bb=b+I([zero,2*h.b]);ab=a+I([zero,2*h.b]);
        fb,fa,dv,v=rhs(X,bb,ab,inside)
        if not (fb.a>=0 and fb.b<2 and fa.a>=0 and fa.b<2 and ab.b<cap):return False,f'Picard containment failed at {j}: {fb} {fa}'
        if inside:
            if not dv.b<0:return False,f'nonnegative derivative enclosure at x={x0}: {dv}'
            maxd=dv.b if maxd is None else max(maxd,dv.b)
        minv=min(minv,v.a)
        corners=[]
        for bc,ac in [(b.a,a.a),(b.b,a.b)]:
            fbc,fac,_,_=rhs(X,bc+I([zero,2*h.b]),ac+I([zero,2*h.b]),inside)
            corners.append((bc+h*fbc,ac+h*fac))
        b=I([corners[0][0].a,corners[1][0].b]);a=I([corners[0][1].a,corners[1][1].b]);
        if j%max(1,n//50)==0 or j==lead+n-1:
            records.append(dict(x_start=str(x0),x_end=str(x1),b_lower=str(b.a),b_upper=str(b.b),a_lower=str(a.a),a_upper=str(a.b),dv_upper=str(dv.b),v_lower=str(v.a)))
    return True,dict(n=n,steps=lead+n,wall_derivative_upper=str(maxd),all_path_speed_lower=str(minv),arrival_r=str(b-(one+rise)*a),arrival_a=str(a),records=records)
import argparse
parser=argparse.ArgumentParser();parser.add_argument("--steps",type=int,default=2000);args=parser.parse_args();assert args.steps%10==0
results=[]
for n in [args.steps]:
    try: ok,out=run(n)
    except ValueError as e:ok,out=False,str(e)
    print(n,ok,str(out)[:400],flush=True);results.append(dict(n=n,success=ok,diagnostic=str(out)[:500] if not ok else 'strict wall bound and lead sign established'))
    if ok:break
if not ok:raise SystemExit('No certificate at attempted resolutions')
rec=out.pop('records');out['attempts']=results;out['interval_arithmetic']='mpmath.iv dps=40; decimal input intervals; cooperative corner comparison; strict enclosure on changing faces; sign invariance on other faces'
(OUT/('review5_interval_certificate_coarse.json' if args.steps==1000 else 'review5_interval_certificate.json')).write_text(json.dumps(out,indent=2))
with (OUT/('review5_interval_enclosures_coarse.csv' if args.steps==1000 else 'review5_interval_enclosures.csv')).open('w') as f:
    w=csv.DictWriter(f,fieldnames=list(rec[0]));w.writeheader();w.writerows(rec)
print(json.dumps(out,indent=2))
