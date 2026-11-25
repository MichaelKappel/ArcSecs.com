"""30S: kinematic bath emission and explicitly synthetic line/angle statistics.
Units: C=initial packet energy=1 per event; e=photon gap/E; b=s/C;
y=energy lost/E; h=bath gap/E. No vector transition rate or cosmological fit.
"""
from pathlib import Path
import csv, math
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/long-term-memory/research/bath-recoil'
FIG=ROOT/'book/figures'

def momenta(e,y):
    if not (0<e<1 and 0<y<1-e): raise ValueError('positive gap and forward energy domain required')
    p=math.sqrt((1-e)*(1+e)); r=math.sqrt((1-y-e)*(1-y+e))
    d=y*(2-y)/(p+r) # stable momentum difference
    return p,r,d

def allowed_band(e,y,h=0,angle=math.pi):
    p,r,d=momenta(e,y)
    if not (0<=h<y and 0<=angle<=math.pi): raise ValueError('bath gap/angle outside domain')
    w=math.sqrt((y-h)*(y+h))
    qmax=math.hypot(d,2*math.sqrt(p*r)*math.sin(angle/2))
    return w/qmax,w/d

def event(e,y,b,h=0):
    p,r,d=momenta(e,y)
    if not (0<b<=1 and 0<=h<y): raise ValueError('invalid bath')
    q=math.sqrt((y-h)*(y+h))/b
    if q<d-2e-15 or q>p+r+2e-15: raise ValueError('no real momentum triangle')
    sin2=max(0.,min(1.,(q-d)*(q+d)/(4*p*r)))
    phi=2*math.asin(math.sqrt(sin2))
    pp=np.array([0.,0.,p]); rr=np.array([r*math.sin(phi),0.,r*math.cos(phi)])
    qq=pp-rr
    err=abs((1-y)+math.hypot(b*np.linalg.norm(qq),h)-1)
    return dict(p=p,p_final=r,q=q,angle=phi,energy_error=err,
                momentum_error=float(np.linalg.norm(pp-rr-qq)),
                q_error=abs(float(np.linalg.norm(qq))-q))

def threshold(b):
    if not 0<b<1: raise ValueError('requires slower bath')
    return 1/math.sqrt((1-b)*(1+b)) # E_threshold / mass gap

def qmax_gapless(e,b):
    if not (0<e<1 and 0<b<1): raise ValueError('invalid inputs')
    p=math.sqrt((1-e)*(1+e))
    if p<=b: return 0.
    return 2*(p-b)/((1-b)*(1+b))

def allowed_y_interval(e,b,h):
    """Positive-gap daughter energy interval from the collinear phase-space boundary.
    Uses convex E_final(q)+B(q) along initial direction. C=E=1.
    """
    from scipy.optimize import minimize_scalar, brentq
    if not (0<e<1 and 0<b<1 and 0<h<1-e): raise ValueError('invalid positive-gap phase space')
    p=math.sqrt((1-e)*(1+e))
    def residual(q):return math.hypot(p-q,e)+math.hypot(b*q,h)-1
    qtop=math.sqrt((1-e-h)*(1-e+h))/b
    opt=minimize_scalar(residual,bounds=(0,qtop),method='bounded',options={'xatol':1e-14})
    if opt.fun>=0: return None
    qlo=brentq(residual,0,opt.x,xtol=1e-14);qhi=brentq(residual,opt.x,qtop,xtol=1e-14)
    return math.hypot(b*qlo,h),math.hypot(b*qhi,h)

def scalar_rate(e,b,h,g=1.):
    """Tree-level scalar-proxy rate for constant cubic amplitude; NOT vector rate.
    All dimensionful quantities expressed in units of initial energy, hbar=C=1.
    """
    band=allowed_y_interval(e,b,h)
    if band is None:return 0.,0.,0.,0.
    lo,hi=band
    p=math.sqrt((1-e)*(1+e))
    rate=g*g*(hi-lo)/(16*math.pi*p*b*b)
    return lo,hi,rate,rate*(lo+hi)/2

def cascade(e,b,n,z=1.):
    if n<1 or z<=0: raise ValueError('invalid cascade')
    f=-math.expm1(-math.log1p(z)/n)
    angles=np.array([event(e*math.exp(i*math.log1p(z)/n),f,b)['angle'] for i in range(n)])
    # E[cos theta] for independent uniform azimuth, conditional on equal events.
    # Stable E[1-cos theta] for positive cos factors; handle general sign.
    if np.all(angles<math.pi/2):
        deficit=-math.expm1(float(np.sum(np.log1p(-2*np.sin(angles/2)**2))))
    else: deficit=1-float(np.prod(np.cos(angles)))
    return angles,math.sqrt(2*deficit) # rms chord, radians only small-angle approximation

def monte_carlo(angles,count=20000,seed=3026):
    rng=np.random.default_rng(seed); mu=np.ones(count)
    for a in angles:
        mu=np.clip(mu*math.cos(a)+np.sqrt(np.maximum(0.,1-mu*mu))*math.sin(a)*np.cos(rng.uniform(0,2*math.pi,count)),-1,1)
    d=2*(1-mu)
    return math.sqrt(float(d.mean())),float(d.std(ddof=1)/math.sqrt(count))

def line_stats(n,p=.5,z=1.):
    """N independent Bernoulli slots; mean energy ratio 1/(1+z), not a fitted rate."""
    if n<1 or not 0<p<=1 or z<=0: raise ValueError('invalid slots')
    f=-math.expm1(-math.log1p(z)/n)/p
    if not 0<f<1: raise ValueError('fraction invalid')
    mean=math.exp(n*math.log1p(-p*f)); minimum=math.exp(n*math.log1p(-f))
    rel=math.sqrt(math.expm1(n*math.log1p(p*(1-p)*f*f/(1-p*f)**2)))
    return f,mean,rel,minimum

def write_csv(name,rows):
    with (OUT/name).open('w',newline='') as fp:
        w=csv.DictWriter(fp,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    e=1e-8;y=.5; arc=math.pi/648000
    cases=[]; maxerr=0.
    for ee in [1e-8,1e-4,.01,.1]:
        for b in [.5,.9,.99,.9999,.999999,.99999999999]:
            row=dict(gap_fraction=ee,bath_speed=b,loss_fraction=y,allowed=False,angle_deg='',energy_error='',q_error='')
            try:
                ev=event(ee,y,b);row.update(allowed=True,angle_deg=math.degrees(ev['angle']),energy_error=ev['energy_error'],q_error=ev['q_error']);maxerr=max(maxerr,ev['energy_error'],ev['q_error'])
            except ValueError: pass
            cases.append(row)
    write_csv('events.csv',cases)
    bands=[]
    for ee in [1e-8,1e-4,.01,.1]:
        for angle in [arc,10*arc,math.radians(1),math.pi]:
            for h in [0,.1,.3]:
                lo,hi=allowed_band(ee,y,h,angle)
                bands.append(dict(gap_fraction=ee,bath_gap=h,angle_arcsec=angle/arc,beta_min=lo,beta_max=hi,bandwidth=hi-lo))
    write_csv('bands.csv',bands)
    cascades=[]
    for n in [1,4,16,64,256,1024]:
        a,r=cascade(e,.9,n);mc,se=monte_carlo(a)
        cascades.append(dict(events=n,rms_chord=r,mc_rms_chord=mc,mc_deficit_se=se,delta_per_event=a[0]))
    write_csv('cascades.csv',cascades)
    lines=[]
    for n in [2,10,100,1000,10000,100000,1000000]:
        f,m,r,low=line_stats(n)
        # Verify the largest possible total loss stays in the same allowed regime.
        event(e/low,f,.9)
        lines.append(dict(slots=n,fraction_per_event=f,mean_energy_ratio=m,relative_rms=r,min_energy_ratio=low))
    write_csv('linewidth.csv',lines)
    rates=[]
    for ee in [.01,.1,.4]:
        for b in [.5,.9,.99]:
            for h in [.005,.05,.2]:
                l,u,gam,power=scalar_rate(ee,b,h,g=.001)
                rates.append(dict(gap_fraction=ee,bath_speed=b,bath_gap=h,coupling=.001,y_min=l,y_max=u,rate=gam,power=power))
    write_csv('scalar-rates.csv',rates)

    lo,hi=allowed_band(e,y,angle=arc)
    (OUT/'verification.txt').write_text(f'Maximum allowed-event energy or momentum-magnitude residual: {maxerr:.17g}\nOne arcsec bath-speed band: {lo:.17g} to {hi:.17g}\nSynthetic random azimuth seed 3026, 20000 rays per case.\nAll quantities dimensionless. Tree-level scalar proxy rates only; no vector rate or fit.\n',encoding='utf8')
    import matplotlib;matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    fig,ax=plt.subplots(figsize=(7,4.2)); x=np.logspace(-12,-1,180); a=[event(e,y,1-t)['angle']/arc for t in x];ax.loglog(x,a);ax.axhline(1,ls='--',color='gray',label='Illustrative 1 arcsecond tolerance');ax.set(xlabel='Bath speed deficit 1 - s/C',ylabel='Single-event photon deflection (arcsec)',title='Half-energy loss into a linear acoustic branch');ax.grid(True,which='both',alpha=.22);ax.legend();fig.tight_layout();fig.savefig(FIG/'bath-recoil-angle.png',dpi=450);plt.close(fig)
    fig,ax=plt.subplots(figsize=(7,4.2));ax.loglog([r['events'] for r in cascades],[r['rms_chord'] for r in cascades],'-o',label='Analytic RMS direction chord');ax.loglog([r['events'] for r in cascades],[r['mc_rms_chord'] for r in cascades],'x',label='Seeded Monte Carlo');ax.loglog([r['slots'] for r in lines],[r['relative_rms'] for r in lines],'-s',label='Separate Bernoulli energy spread');ax.set(xlabel='Number of equal loss events / available slots',ylabel='Dimensionless spread (different observables)',title='Many weak interactions reduce conditional spreads');ax.legend(fontsize=8);ax.grid(True,which='both',alpha=.22);fig.tight_layout();fig.savefig(FIG/'bath-recoil-statistics.png',dpi=450);plt.close(fig)
    print((OUT/'verification.txt').read_text());print(cascades);print(lines)
if __name__=='__main__': main()
