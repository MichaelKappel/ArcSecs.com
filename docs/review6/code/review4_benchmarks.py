#!/usr/bin/env python3
"""Review 4.0 controls, not calibrated observations. All numerical units normalized.
Run python code/review4_benchmarks.py from any directory. Historical scripts retained.
"""
from pathlib import Path
import csv, json, math, platform, hashlib
import numpy as np
import scipy
from scipy.integrate import solve_ivp, quad
from scipy.optimize import minimize_scalar, brentq
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from decimal import Decimal, localcontext
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'appendices'; FIG=ROOT/'figures'
OUT.mkdir(exist_ok=True); FIG.mkdir(exist_ok=True)
checks=[]
def check(name,ok):
    checks.append((name,bool(ok))); assert ok,name

def write(name,rows):
    with (OUT/name).open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)

def wall(*, beta=1., mobility=1., lead=.3, ratio=1.2, gap0=1e-6, energy0=1., mass=100., capacity=2., step=.04, tol=1e-10, method='DOP853', horizon=100.):
    p0=math.sqrt((energy0-gap0)*(energy0+gap0)); atol=tol*.01
    def ev(y):
        x,p,a,Q,W=y; u=np.clip(x,0.,1.); C=1+(ratio-1)*u*u*(3-2*u); Cp=(ratio-1)*6*u*(1-u)
        D=gap0+beta*a; E=np.hypot(C*p,D); v=C*C*p/E; A=v-beta*D/E-a/mass
        r=mobility*max(A,0.)*max(1-a/capacity,0.); Hx=C*Cp*p*p/E
        dv=v*v*Cp/C-C*C*D*(D+beta*p)/E**3*r
        return C,D,E,v,A,r,Hx,dv
    def rhs(t,y):
        C,D,E,v,A,r,Hx,dv=ev(y);return [v,-Hx-r,r,A*r,Hx]
    def arrive(t,y):return y[0]-1
    arrive.terminal=True; arrive.direction=1
    def stop(t,y):return y[1]-1e-10
    stop.terminal=True;stop.direction=-1
    sol=solve_ivp(rhs,(0,horizon),[-lead,p0,0,0,0],events=(arrive,stop),method=method,rtol=tol,atol=atol,max_step=step,dense_output=True)
    status='arrived' if sol.t_events[0].size else ('stopped_threshold' if sol.t_events[1].size else ('timeout' if sol.success else 'solver_failure'))
    # Search each accepted dense-output interval, divided in half. Includes endpoints,
    # wall joins (where C' changes form), and each locally optimized maximum.
    # This is not interval arithmetic: extrema search can miss multiple narrow peaks.
    ts=list(sol.t); ends=sol.sol(sol.t)
    for boundary in (0.,1.):
        if ends[0,0]<boundary<ends[0,-1]:ts.append(brentq(lambda t:sol.sol(t)[0]-boundary,sol.t[0],sol.t[-1],xtol=1e-14))
    ts=np.unique(ts); best=(-np.inf,0.)
    def d(t):return float(ev(sol.sol(t))[-1])
    for a,b in zip(ts[:-1],ts[1:]):
        for lo,hi in ((a,(a+b)/2),((a+b)/2,b)):
            r=minimize_scalar(lambda t:-d(t),bounds=(lo,hi),method='bounded',options={'xatol':max(1e-13,(hi-lo)*1e-5)})
            for t in (lo,hi,r.x):best=max(best,(d(t),t))
    t=np.unique(np.r_[np.linspace(0,sol.t[-1],3001),ts,best[1]]); y=sol.sol(t); vals=np.array([ev(Y) for Y in y.T]); C,D,E,v,A,r,Hx,dv=vals.T
    x,p,a,Q,W=y; recoil=a*a/(2*mass)
    row=dict(status=status,method=method,rtol=tol,atol=atol,max_step=step,horizon=horizon,beta=beta,mobility=mobility,lead=lead,ratio=ratio,gap0=gap0,energy0=energy0,mass=mass,capacity=capacity,accepted_intervals=len(sol.t)-1,nfev=sol.nfev,duration=t[-1],x_final=x[-1],p_final=p[-1],v_initial=v[0],v_final=v[-1],E_final=E[-1],gap_final=D[-1],heat=Q[-1],recoil=recoil[-1],max_dvdt_search=best[0],t_at_max=best[1],max_dvdt_grid=max(dv),max_energy_residual=max(abs(E+recoil+Q-energy0)),max_momentum_residual=max(abs(p+a+W-p0)),wall_momentum=W[-1])
    print('wall diagnostic', row['status'],row['energy0'],row['max_energy_residual'],row['max_momentum_residual'],flush=True); check('wall ledger '+str(len(checks)),row['max_energy_residual']<2e-7 and row['max_momentum_residual']<2e-7)
    return row,np.column_stack((t,y.T,vals,recoil))

cases=[('baseline',{}),('refined',{'step':.01,'tol':1e-12}),('rk45_control',{'method':'RK45','step':.02,'tol':1e-11}),('no_exchange',{'mobility':0.}),('low_capacity',{'capacity':.1}),('high_energy',{'energy0':4.,'step':.01,'tol':1e-12}),('no_lead',{'lead':0.}),('steep_wall',{'ratio':1.4}),('tiny_gap',{'gap0':1e-16}),('timeout_control',{'horizon':.01}),('beta_zero',{'beta':0.}),('stop_threshold_control',{'gap0':.1,'beta':0.,'mobility':100.,'mass':1e12,'capacity':10.,'lead':.1,'horizon':5.})]
rows=[]; traces={}
for name,kw in cases:
    r,tr=wall(**kw);rows.append(dict(case=name,**r));traces[name]=tr
write('review4_wall_extrema.csv',rows)
by={r['case']:r for r in rows}; b=by['baseline']; f=by['refined']; alt=by['rk45_control']
check('baseline arrives and searched max derivative negative',b['status']=='arrived' and b['max_dvdt_search']<0)
check('two independent algorithms agree at baseline endpoint',max(abs(b[k]-a[k]) for a in (f,alt) for k in ('duration','v_final','E_final','gap_final'))<2e-8)
check('negative control reaccelerates',by['no_exchange']['max_dvdt_search']>0)
check('timeout explicitly classified',by['timeout_control']['status']=='timeout')
check('threshold stop explicitly classified',by['stop_threshold_control']['status']=='stopped_threshold')
# Re-evaluate original 42 cases: explicit stop vs timeout based on event threshold,
# using historical accepted records, not counting them as new experiments.
old=[]
for file in ('history_cases.csv','history_scan.csv'):
    with (OUT/file).open() as f0:
        for i,r in enumerate(csv.DictReader(f0)):
            status='arrived' if r['crossed']=='True' else ('stopped_threshold' if float(r['min_p'])<=1.001e-10 else 'timeout_or_unresolved')
            old.append(dict(source=file,case=r.get('case',str(i)),status=status,duration=r['duration'],min_p=r['min_p'],x_final=r['x_final'],max_sampled_dvdt=r['max_dvdt']))
write('review4_historical_status.csv',old)
# Exact fixed-gap linear wall checks and asymptotic stop classification.
linear=[]; eps=.1;k=.2;s=1.2;y0=math.acosh(1/eps);gmin=k*math.sinh(y0)*math.cosh(y0);gmax=k*y0/math.log(s)
for g in (0.,.2,2.,gmin):
    reach=g<gmax; xstop=math.expm1(k*y0/g)/k if not reach else None
    y1=y0-g*math.log(s)/k if reach else 0.;
    linear.append(dict(drag=g,status='arrived' if reach else 'asymptotic_stop',stop_x=xstop,arrival_speed=s*math.tanh(y1) if reach else '',analytic_monotone=g>=gmin,monotone_threshold=gmin,arrival_upper_threshold=gmax))
write('review4_linear_exact.csv',linear);check('linear strong-drag stop',linear[-1]['status']=='asymptotic_stop' and linear[-1]['stop_x']<1)
# C-01 bounded ballistic congruence. B=all-sector control, C<=B constant.
# tau labels physical material clocks under a boost-symmetric matter control;
# T is still a common coordinate, not a material substance.
def flow(C=.8, gap=.1, eta=.5, te=1., We=1., B=1., survival=1.):
    q=math.sqrt(We*We-gap*gap)*te/C # conserved tau*p
    a=C*q/gap if gap else None
    if gap:
        reach=C/B*math.asinh(a/te)
        if eta>=reach:return {'status':'nonarrival','reach_eta':reach}
        ta=a/math.sinh(math.asinh(a/te)-B*eta/C)
    else:reach=math.inf;ta=te*math.exp(B*eta/C)
    Wa=math.hypot(C*q/ta,gap); w_e=C*C*q/(te*We); w_a=C*C*q/(ta*Wa)
    ua=B*math.tanh(eta); common=(ua+w_a)/(1+ua*w_a/B**2)
    T_a=ta*math.cosh(eta); D_e=B*te*math.tanh(eta); D_a=B*T_a*math.tanh(eta); path=D_a
    DA=B*te*math.sinh(eta); DG=B*ta*math.sinh(eta); stretch=ta/te; ZE=We/Wa; DL=DG*math.sqrt(ZE*stretch/survival)
    integ=quad(lambda t:C*C*q/(B*t*t*math.hypot(C*q/t,gap)),te,ta,epsabs=1e-12)[0]
    return dict(status='arrived',reach_eta=reach,C=C,gap=gap,eta=eta,te=te,ta=ta,Ta=T_a,We=We,Wa=Wa,initial_group=w_e,arrival_group=w_a,arrival_common=common,receiver_u=ua,D_e=D_e,D_a=D_a,path=path,D_TOF=B*(T_a-te),D_A=DA,D_G=DG,D_L=DL,Z_E=ZE,stretch_clock=stretch,stretch_T=T_a/te,duality=DL/(ZE**2*DA),quadrature_error=abs(integ-eta),survival=survival)
flows=[]
for C in (1.,.8,.5):
    for gap in (0.,.01,.1,.3):
        for eta in (.1,.5,1.):
            r=flow(C,gap,eta); flows.append(r)
# use union for occasional nonarrival rows
keys=list(dict.fromkeys(k for r in flows for k in r));write('review4_flow.csv',[{k:r.get(k,'') for k in keys} for r in flows]); fr=flow();
for r in flows:
    if r['status']=='arrived':check('bounded flow quadrature and ceiling',r['quadrature_error']<1e-9 and r['arrival_common']<=1+1e-12)
check('nonentrained vacuum limit common speed constant',abs(flow(1.,.1,.5)['arrival_common']-flow(1.,.1,.5)['initial_group'])<1e-12)
check('slower medium can still accelerate common speed',fr['arrival_common']>fr['initial_group'] and fr['arrival_group']<fr['initial_group'])
h=1e-5; deriv=(flow(te=1+h)['ta']-flow(te=1-h)['ta'])/(2*h);check('clock stretch finite difference',abs(deriv-fr['stretch_clock'])<1e-9)
# Local branch-changing binary collisions. Exact relativistic conservation in a
# homogeneous B=C=1 control, not a derived microscopic rate. cm angle measured
# with respect to incoming z. Bath excitation is target mass increase.
def collision(E,m0,m1,M,delta,theta):
    p=math.sqrt((E-m0)*(E+m0)); M1=M+delta;s=M*M+m0*m0+2*M*E; root=math.sqrt(s)
    if root<m1+M1:return None
    q=math.sqrt(max(0,(s-(m1+M1)**2)*(s-(m1-M1)**2)))/(2*root); e=math.hypot(q,m1)
    b=p/(E+M); G=(E+M)/root; pz=G*(q*math.cos(theta)+b*e); px=q*math.sin(theta); ef=G*(e+b*q*math.cos(theta)); pf=math.hypot(pz,px)
    Eb=math.sqrt(M1*M1+(p-pz)**2+px**2); recoil=Eb-M1
    # F_out F_in polarization contractions (common normalization), metric +---.
    pin=np.array([E,0.,0.,p]); pout=np.array([ef,px,0.,pz]); dot=lambda a,b:a[0]*b[0]-np.dot(a[1:],b[1:]);
    polin=[np.array([0.,1.,0.,0.]),np.array([0.,0.,1.,0.])]; polout=[np.array([0.,pz/pf,0.,-px/pf]),np.array([0.,0.,1.,0.]),np.array([pf/m1,ef*px/(m1*pf),0.,ef*pz/(m1*pf)])] if pf>0 else []
    mat=np.array([[2*(dot(pin,pout)*dot(a,b0)-dot(pin,b0)*dot(pout,a)) for b0 in polout] for a in polin]); strength=np.sum(mat**2); longitudinal=float(np.sum(mat[:,2]**2)/strength) if strength>0 else float('nan')
    return dict(E=E,m0=m0,m1=m1,M=M,delta=delta,theta_cm=theta,energy_final=ef,v_initial=p/E,v_final=pf/ef,angle_lab_deg=math.degrees(math.atan2(abs(px),pz)),bath_excitation=delta,bath_recoil=recoil,energy_error=abs(ef+Eb-E-M),longitudinal_fraction_unpolarized=longitudinal)
cr=[]
for E in (.5,1.,2.,4.):
 for m1 in (.1,.3,.5,.7):
  for theta in (0.,.01,.1,.5,1.,math.pi/2,math.pi):
   r=collision(E,1e-6,m1,100.,.1,theta)
   if r:cr.append(dict(status='allowed',**r))
   else:cr.append(dict(status='below_threshold',E=E,m0=1e-6,m1=m1,M=100.,delta=.1,theta_cm=theta,energy_final='',v_initial='',v_final='',angle_lab_deg='',bath_excitation='',bath_recoil='',energy_error='',longitudinal_fraction_unpolarized=''))
write('review4_collisions.csv',cr); allowed=[r for r in cr if r['status']=='allowed'];check('binary channel energy conservation',max(r['energy_error'] for r in allowed)<1e-12)
check('both allowed and closed channels',len(allowed)<len(cr));
# Bath finite occupancy reversible rate control (fixed energy exchange affinity).
# d n/dt = k+ (N-n) - k- n; ratio exp(A/theta), not derived QFT cross sections.
occ=[]; N=10.; kp=.4; km=.1; n_eq=N*kp/(kp+km)
for t in np.linspace(0,20,101):occ.append(dict(t=t,occupation=n_eq*(1-math.exp(-(kp+km)*t)),capacity=N,equilibrium=n_eq))
write('review4_occupancy.csv',occ);check('equilibrium balances forward reverse',abs(kp*(N-n_eq)-km*n_eq)<1e-12)
# Operational calibration tests; fixed local tick units and shared area unit.
cal=[]
for C in (1.,.8,.5):
 for law in ('fixed_mass','binding_compensated'):
  mu=1. if law=='fixed_mass' else C**-2; atom=mu*C*C; aB=1/(mu*C); Wratio=C; z=atom/Wratio-1
  cal.append(dict(C_ratio=C,mass_law=law,mass_ratio=mu,atomic_frequency_ratio=atom,bohr_radius_ratio=aB,photon_frequency_ratio=Wratio,z_spec=z))
write('review4_clock_calibration.csv',cal);check('impedance matched fixed mass gives blueshift',cal[-2]['z_spec']==-.5)
# Bath bound independently computed without subtractive cancellation in binary64.
with localcontext() as ctx:
 ctx.prec=60;e=Decimal('1e-8'); y=Decimal('0.5'); p=(1-e*e).sqrt(); pp=(y*y-e*e).sqrt(); beta=(1-y)/(p-pp); deficit=1-beta
check('high precision bath upper deficit',abs(float(deficit)-1e-16)<1e-30)
# New vector graphics, readable grayscale / line styles.
plt.rcParams.update({'font.size':10,'pdf.fonttype':42,'axes.spines.top':False,'axes.spines.right':False})
fig,ax=plt.subplots(figsize=(4.65,3.1));
for name,style in [('baseline','-'),('no_exchange','--'),('low_capacity',':'),('high_energy','-.')]:
 tr=traces[name];ax.plot(tr[:,1],tr[:,9],style,label=name.replace('_',' '),linewidth=1.5)
ax.set(xlabel='Position / wall thickness',ylabel='Group speed / reference ceiling');ax.axvspan(0,1,color='0.85',alpha=.35);ax.legend(fontsize=8);ax.grid(alpha=.2);fig.tight_layout();fig.savefig(FIG/'review4_wall.pdf');plt.close(fig)
fig,ax=plt.subplots(figsize=(4.65,3.1));
for C,style in [(1.,'-'),(.8,'--'),(.5,':')]:
 rr=[flow(C,.1,e) for e in np.linspace(0.001,1.,120)]; rr=[r for r in rr if r['status']=='arrived'];ax.plot([r['eta'] for r in rr],[r['arrival_common'] for r in rr],style,label=f'common, C/B={C:g}');ax.plot([r['eta'] for r in rr],[r['arrival_group'] for r in rr],style,color='0.55',linewidth=.9)
ax.axhline(1,color='0.2',linewidth=.7);ax.set(xlabel='Receiver rapidity label',ylabel='Speed / B');ax.legend(fontsize=8);ax.grid(alpha=.2);fig.tight_layout();fig.savefig(FIG/'review4_flow.pdf');plt.close(fig)
fig,ax=plt.subplots(figsize=(4.65,3.1));
for m,style in [(.1,'-'),(.3,'--'),(.5,':'),(.7,'-.')]:
 rs=[collision(1.,1e-6,m,100.,.1,t) for t in np.linspace(0,math.pi,200)];rs=[r for r in rs if r];ax.plot([r['angle_lab_deg'] for r in rs],[r['energy_final'] for r in rs],style,label=f'dressed gap {m:g}')
ax.set(xlabel='Lab deflection (degrees)',ylabel='Retained energy / initial energy');ax.legend(fontsize=8);ax.grid(alpha=.2);fig.tight_layout();fig.savefig(FIG/'review4_collision.pdf');plt.close(fig)
summary={'baseline':b,'refined':f,'rk45_control':alt,'max_endpoint_difference':max(abs(b[k]-a[k]) for a in (f,alt) for k in ('duration','v_final','E_final','gap_final')),'flow_reference':fr,'flow_reference_stretch_fd':deriv,'bath_beta_max':str(beta),'bath_beta_deficit':str(deficit),'collision_forward':collision(1.,1e-6,.5,100.,.1,0.),'collision_oblique':collision(1.,1e-6,.5,100.,.1,.1),'wall_statuses':{s:sum(r['status']==s for r in rows) for s in sorted(set(r['status'] for r in rows))},'historical_statuses':{s:sum(r['status']==s for r in old) for s in sorted(set(r['status'] for r in old))},'assertion_count':len(checks),'collision_channels_allowed':len(allowed),'collision_channels_total':len(cr),'versions':{'python':platform.python_version(),'numpy':np.__version__,'scipy':scipy.__version__,'matplotlib':matplotlib.__version__}}
(OUT/'review4_summary.json').write_text(json.dumps(summary,indent=2,allow_nan=False))
(OUT/'review4_verification.txt').write_text('Automated regression assertions; not independent physical experiments. Adaptive extrema searches are not rigorous interval certificates.\n'+ '\n'.join(('PASS ' if ok else 'FAIL ')+name for name,ok in checks)+'\n')
(OUT/'review4_dependencies.txt').write_text('\n'.join(f'{k}=={v}' for k,v in summary['versions'].items())+'\n')
print(json.dumps(summary,indent=2,allow_nan=False))
