"""Part XXXIII: normalized homogeneous tree-level controls and an interval wall certificate.
Run from any directory. No empirical fit. All quantities are dimensionless except anchor rows.
"""
from pathlib import Path
import csv, json, math, platform
import numpy as np, scipy, mpmath as mp
from scipy.special import roots_legendre
from scipy.optimize import brentq
from scipy.integrate import solve_ivp
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'appendices'; FIG=ROOT/'figures'; checks=[]
def check(name,ok,detail=''):
    checks.append(dict(check=name,passed=bool(ok),detail=str(detail))); assert ok,name

def write(name,rows):
    with (OUT/name).open('w') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
# All normalized units: B=C=hbar=1. g_b=0.01 inverse energy squared.
m0=1e-6; m1=.5; M0=100.; M1=100.1; gb=.01; chimax=.8

def qcm(s,m,M):
    return math.sqrt(max(0,(s-(m+M)**2)*(s-(m-M)**2)))/(2*math.sqrt(s))

def amp(Ei,qi,Ef,qf,mu,mi,mf):
    """Rows outgoing (in-plane T, out-of-plane T,L), columns incident same basis.
    H3 vertex -g/2 phi0 phi1 F0 F1 -> g [(p.p')(e.e')-(p.e')(p'.e)]."""
    mu=np.asarray(mu); sn=np.sqrt(np.maximum(0,1-mu*mu)); D=Ei*Ef-qi*qf*mu
    A=np.zeros(mu.shape+(3,3));A[...,0,0]=qi*qf-Ei*Ef*mu;A[...,1,1]=-D
    A[...,2,0]=-Ei*mf*sn;A[...,0,2]=mi*Ef*sn;A[...,2,2]=-mi*mf*mu
    return gb*A

def cm(s,mi,Mi,mf,Mf,mu,pol='T'):
    qi=qcm(s,mi,Mi); qf=qcm(s,mf,Mf); Ei=math.hypot(qi,mi); Ef=math.hypot(qf,mf)
    A=amp(Ei,qi,Ef,qf,mu,mi,mf); cols=2 if pol=='T' else 3
    W=np.sum(A[...,:,:cols]**2,axis=-1)/cols
    return W*qf/qi/(64*math.pi**2*s), qi,qf,Ei,Ef

def lab(E,mu):
    p=math.sqrt((E-m0)*(E+m0));s=M0*M0+m0*m0+2*M0*E
    W,qi,qf,Ei,Ef=cm(s,m0,M0,m1,M1,mu)
    b=p/(E+M0);G=1/math.sqrt(1-b*b);mu=np.asarray(mu);pt=qf*np.sqrt(np.maximum(0,1-mu*mu));pz=G*(qf*mu+b*Ef);e=G*(Ef+b*qf*mu);q=np.hypot(pt,pz);theta=np.arctan2(pt,pz);r=np.hypot(M1,np.hypot(p-pz,pt))-M1
    # For a vectorized outgoing lab state, evaluate stable expressions directly.
    D=E*e-p*q*np.cos(theta); labT=((p*q-E*e*np.cos(theta))**2+D**2)*gb**2/2;labL=(E*m1*np.sin(theta))**2*gb**2/2
    return W,e,q/e,theta,r,labL/(labT+labL),s,qi,qf

def integrate(E,n=128):
    mu,w=roots_legendre(n); W,e,v,th,r,ll,s,qi,qf=lab(E,mu); ds=W.sum(axis=-1)*2*math.pi; sig=float(w@ds); weights=w*ds/sig
    p=math.sqrt((E-m0)*(E+m0));b=p/(E+M0); Ef=math.hypot(qf,m1)
    # forward aperture for qf>b Ef: lab angle increases monotonically from 0 to pi.
    ap=float('nan'); a=math.pi/(180*3600)
    if qf>b*Ef:
        # use sin theta = sqrt(t*(2-t)), t=1-mu; bracket accurately in t
        def angle(t):return math.atan2(qf*math.sqrt(t*(2-t)),(qf*(1-t)+b*Ef)/math.sqrt(1-b*b))
        t=brentq(lambda t:angle(t)-a,0,2,xtol=1e-24,rtol=1e-14)
        u,ww=roots_legendre(16); Wcone=cm(s,m0,M0,m1,M1,1-t*(u+1)/2)[0].sum(axis=-1)
        ap=math.pi*t*float(ww@Wcone)/sig
    allf=cm(s,m0,M0,m1,M1,mu,'all')[0].sum(axis=-1);allr=cm(s,m1,M1,m0,M0,mu,'all')[0].sum(axis=-1)
    sf=2*math.pi*float(w@allf);sr=2*math.pi*float(w@allr)
    check(f'reciprocity E={E} n={n}',abs(qi**2*sf-qf**2*sr)<1e-12*max(qi**2*sf,1e-30))
    check(f'energy E={E} n={n}',np.max(np.abs(E-e-(M1-M0)-r))<1e-11)
    check(f'forward event slowing E={E} n={n}',np.max(v)<p/E)
    check(f'lab longitudinal fraction E={E} n={n}',np.all((ll>=0)&(ll<=1)))
    p0=math.sqrt((E-m0)*(E+m0)); q=e*v; cos=np.cos(th); D=E*e-p0*q*cos
    labW=gb**2/2*((p0*q-E*e*cos)**2+D**2+(E*m1*np.sin(th))**2)
    cmW=W.sum(axis=-1)*qi/qf*(64*math.pi**2*s)
    check(f'lab vs CM amplitude sum E={E} n={n}',np.max(abs(labW-cmW))<1e-12*max(cmW.max(),1e-30))
    mean=float(weights@e); sd=math.sqrt(float(weights@((e-mean)**2)))
    return dict(E=E,n=n,sigma_T=sig,sigma_all_forward=sf,sigma_all_reverse=sr,mean_E=mean,sd_E=sd,mean_lab_angle_deg=float(weights@th)*180/math.pi,mean_cos=float(weights@np.cos(th)),longitudinal_CM=float(w@(W[:,2]*2*math.pi))/sig,longitudinal_lab=float(weights@ll),one_arcsec_fraction=ap,mean_recoil=float(weights@r),qi=qi,qf=qf,s=s)
threshold=((m1+M1)**2-M0**2-m0**2)/(2*M0)
rows=[]
for E in [.5,.61,.75,1.,2.,4.]:
    if E<=threshold:continue
    rows.append(integrate(E,128));ref=integrate(E,256);check(f'quadrature sigma E={E}',abs(rows[-1]['sigma_T']-ref['sigma_T'])<1e-12*ref['sigma_T'])
write('review5_cross_sections.csv',rows); baseline=next(r for r in rows if r['E']==1)
# Direct contraction and Ward checks at a nondegenerate mass point.
metric=np.diag([1.,-1.,-1.,-1.]);dot=lambda a,b:a@metric@b
mi=.2;mf=.5;qi=.9;qf=.7;Ei=math.hypot(qi,mi);Ef=math.hypot(qf,mf);mu=.3;sn=math.sqrt(1-mu*mu)
p=np.array([Ei,0,0,qi]);pp=np.array([Ef,qf*sn,0,qf*mu]);ei=[np.array([0,1,0,0]),np.array([0,0,1,0]),np.array([qi/mi,0,0,Ei/mi])];ef=[np.array([0,mu,0,-sn]),np.array([0,0,1,0]),np.array([qf/mf,Ef*sn/mf,0,Ef*mu/mf])]
contract=lambda a,b:gb*(dot(p,pp)*dot(a,b)-dot(p,b)*dot(pp,a))
A=np.array([[contract(a,b) for a in ei] for b in ef]);check('analytic polarization matrix vs four-vector contraction',np.max(abs(A-amp(Ei,qi,Ef,qf,mu,mi,mf)))<1e-15)
check('Ward substitution',max(abs(contract(p,b)) for b in ef)<1e-15 and max(abs(contract(a,pp)) for a in ei)<1e-15)
# Bounded positive kinetic matrix and coherent pole masses.
# Stable small eigenvalue via product of roots rather than cancellation.
mix=[]
for x in np.linspace(-5,5,201):
    chi=chimax*math.tanh(x/chimax);det=1-chi**2; S=m0*m0+m1*m1; hi=(S+math.sqrt(S*S-4*det*m0*m0*m1*m1))/(2*det);lo=m0*m0*m1*m1/(det*hi)
    check('kinetic positivity at '+str(x),1-abs(chi)>=1-chimax)
    mix.append(dict(argument=x,chi=chi,lambda_min=1-abs(chi),light_gap=math.sqrt(lo),heavy_gap=math.sqrt(hi)))
write('review5_mixing_poles.csv',mix)
# Exact recoil for finite source, detection, emission vs front. M in normalized units.
em=[]
for gap in [1e-6,.01,.1,.5]:
    Mg=100.;Me=101.;Ee=(Me*Me-Mg*Mg+gap*gap)/(2*Me);Ea=(Me*Me-Mg*Mg-gap*gap)/(2*Mg);v=math.sqrt((Ee-gap)*(Ee+gap))/Ee
    em.append(dict(gap=gap,source_mass_excited=Me,ground_mass=Mg,emission_E=Ee,absorption_E=Ea,group_speed=v,front_speed=1.,longitudinal_relative_dipole_factor=(gap/Ee)**2))
    check('finite-gap emission below front '+str(gap),v<1)
write('review5_emission.csv',em)
# A finite pair-cell kinetic closure at fixed s; full spin-averaged rates.
# Rates from cross section times counterstreaming Moller flux, not a thermal integral.
s=baseline['s'];qi=baseline['qi'];qf=baseline['qf'];vf=qi*(1/math.hypot(qi,m0)+1/math.hypot(qi,M0));vr=qf*(1/math.hypot(qf,m1)+1/math.hypot(qf,M1));kf=baseline['sigma_all_forward']*vf;kr=baseline['sigma_all_reverse']*vr
# Dimensionless time tau=kf*n_unit*T; n_unit=1 arbitrary density unit; closed pair bookkeeping.
kin=[];ratio=kr/kf
for R in [.25,1.,4.]:
    N=1.;eq=brentq(lambda x:(N-x)*(R-x)-ratio*x*x,0,min(N,R));ts=np.linspace(0,20,401)
    for init in [0.,min(N,R)]:
        sol=solve_ivp(lambda t,y:[(N-y[0])*(R-y[0])-ratio*y[0]**2],[0,20],[init],t_eval=ts,rtol=1e-11,atol=1e-13);check('finite-cell bound '+str((R,init)),sol.y.min()>-1e-10 and sol.y.max()<min(N,R)+1e-10)
        for t,x in zip(ts,sol.y[0]):kin.append(dict(reservoir=R,initial_converted=init,tau=t,converted=x,equilibrium=eq,kf=kf,kr=kr))
write('review5_pair_cell.csv',kin)
# 3D central-ray aperture model; one conversion at known location (not full radiative transfer).
# Source at z=0, disk receiver at z=L; scattered ray has azimuthal symmetry.
opt=[];E=1.;L=1.;p0=math.sqrt((E-m0)*(E+m0));s=baseline['s'];qf=baseline['qf'];b=p0/(E+M0);Ef=math.hypot(qf,m1);G=1/math.sqrt(1-b*b)
assert qf>b*Ef
for d in [.2,.5,.8]:
    for theta_max in [math.pi/(180*3600),.01,.1]:
        t=brentq(lambda t:math.atan2(qf*math.sqrt(t*(2-t)),G*(qf*(1-t)+b*Ef))-theta_max,0,2,xtol=1e-24,rtol=1e-14)
        u,ww=roots_legendre(64);mu=1-t*(u+1)/2
        W,e,v,theta,rec,ll,_,_,_=lab(E,mu);weights=ww*W.sum(axis=-1);prob=math.pi*t*float(weights.sum())/baseline['sigma_T'];weights/=weights.sum()
        path=d+(L-d)/np.cos(theta);arrival=d/(p0/E)+(L-d)/(v*np.cos(theta));radius=(L-d)*math.tan(theta_max)
        opt.append(dict(L=L,conversion_z=d,disk_radius=radius,aperture_angle_rad=theta_max,conditional_acceptance=prob,mean_detected_E=float(weights@e),mean_path=float(weights@path),mean_arrival=float(weights@arrival),direct_arrival=L/(p0/E)))
        check('aperture path/arrival '+str((d,theta_max)),np.min(path)>=L-1e-14 and np.min(arrival)>L/(p0/E) and 0<prob<1)
write('review5_aperture.csv',opt)
# Anchor-only arithmetic; no likelihood/fit. Quoted source values, independent errors in quadrature for each anchor.
anchors=[]
for label,D,st,sy in [('LMC_kpc',49.59,.09,.54),('NGC4258_Mpc',7.576,.082,.076)]:
    sigma=math.hypot(st,sy)
    for frac in [0,.01,.05,.2]:anchors.append(dict(anchor=label,source_distance=D,stat=st,sys=sy,fractional_compression=frac,conditional_distance=D*(1-frac),signed_sigma=-D*frac/sigma))
write('review5_anchor_controls.csv',anchors)
# Vector plots at final print aspect.
plt.rcParams.update({'font.size':10,'pdf.fonttype':42,'axes.spines.top':False,'axes.spines.right':False,'figure.figsize':(4.7,3.1)})
mu=np.linspace(-1,1,501);W,e,v,th,r,ll,s,qi,qf=lab(1.,mu);fig,ax=plt.subplots();ax.plot(mu,2*math.pi*W.sum(axis=-1)/baseline['sigma_T'],label='All outgoing');ax.plot(mu,2*math.pi*W[:,2]/baseline['sigma_T'],label='CM longitudinal');ax.set(xlabel=r'$\cos\theta_*$ (CM)',ylabel='Probability density');ax.legend();fig.tight_layout();fig.savefig(FIG/'review5_scattering.pdf');plt.close(fig)
fig,ax=plt.subplots();ax.plot([r['argument'] for r in mix],[r['lambda_min'] for r in mix],label='Min. kinetic eigenvalue');ax.plot([r['argument'] for r in mix],[r['heavy_gap']/m1 for r in mix],label='Heavy gap / bare gap');ax.set(xlabel='Unbounded coupling argument',ylabel='Normalized value');ax.legend();fig.tight_layout();fig.savefig(FIG/'review5_mixing.pdf');plt.close(fig)
fig,ax=plt.subplots();
for R in [.25,1.,4.]:
    for init in [0.,min(1.,R)]:
        a=[r for r in kin if r['reservoir']==R and r['initial_converted']==init];ax.plot([r['tau'] for r in a],[r['converted'] for r in a],'-' if init==0 else '--',label=f'R={R}' if init==0 else None)
ax.set(xlabel=r'Normalized time $\tau$',ylabel='Converted radiation density');ax.legend();fig.tight_layout();fig.savefig(FIG/'review5_capacity.pdf');plt.close(fig)
write('review5_regression.csv',checks)
summary=dict(threshold=threshold,baseline=baseline,kf=kf,kr=kr,ratio=ratio,checks=len(checks),dependencies=dict(python=platform.python_version(),numpy=np.__version__,scipy=scipy.__version__,mpmath=mp.__version__,matplotlib=matplotlib.__version__))
(OUT/'review5_microscopic_summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary,indent=2))
