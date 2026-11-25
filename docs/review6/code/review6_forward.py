"""Part XXXIV synthetic normalized controls: scalar exchange and coherent finite cell.
Run python code/review6_forward.py. No observational fit."""
from pathlib import Path
import csv,json,math,platform,warnings
import numpy as np, scipy, mpmath as mp
from scipy.integrate import quad, IntegrationWarning
from scipy.optimize import brentq
from scipy.linalg import eigh
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'appendices'; FIG=ROOT/'figures';checks=[]
def check(name,ok):
    checks.append(dict(test=name,passed=bool(ok)));assert ok,name
def csvout(name,rows):
    with (OUT/name).open('w') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
mp.mp.dps=65
def kernel(E,mi,mf,Mi,Mf,mu_s,eps=2e-10,contact=False):
    # CM two-body momenta and t-forward, computed at high precision to avoid cancellation.
    ee,mm,nn,MM,NN=map(lambda x:mp.mpf(str(x)),(E,mi,mf,Mi,Mf));p=mp.sqrt(ee*ee-mm*mm);s=MM*MM+mm*mm+2*MM*ee;W=mp.sqrt(s)
    assert W>nn+NN
    def q(m,M):return mp.sqrt((s-(m+M)**2)*(s-(m-M)**2))/(2*W)
    qi=q(mm,MM);qf=q(nn,NN);ei=mp.sqrt(qi*qi+mm*mm);ef=mp.sqrt(qf*qf+nn*nn);t0=(ei-ef)**2-(qi-qf)**2;d0=ei*ef-qi*qf
    s,p,qi,qf,ei,ef,t0,d0,B=map(float,(s,p,qi,qf,ei,ef,t0,d0,p/(ee+MM)))
    b=2*qi*qf;G=1/math.sqrt(1-B*B);a=mu_s**2-t0;assert a>0 and qf>B*ef
    # y=1-cos theta*. Log substitution resolves tiny forward cones.
    zmax=math.log1p(2*b/a);angle0=math.pi/(180*3600)
    def vals(y):
        sn=math.sqrt(max(0,y*(2-y)));co=1-y;w=.5*((-d0+ei*ef*y)**2+(d0+qi*qf*y)**2+(ei*mf*sn)**2)
        pt=qf*sn;pz=G*(qf*co+B*ef);en=G*(ef+B*qf*co);qq=math.hypot(pt,pz);th=math.atan2(pt,pz)
        DD=d0+qi*qf*y;wl=(E*mf*pt/qq)**2;wt=(-DD*pz/qq+p*pt*pt/qq)**2+DD**2
        return w,en,qq/en,th,wl/(wl+wt),p-pz
    yc=brentq(lambda y:vals(y)[3]-angle0,0,2,xtol=1e-28,rtol=1e-14)
    if contact:fun=lambda y:vals(y)[0];upper=2.;cut=yc;to_y=lambda x:x;pref=.01**2
    else:
        to_y=lambda z:min(2.,a/b*math.expm1(z));fun=lambda z:vals(to_y(z))[0]*math.exp(-z);upper=zmax;cut=math.log1p(b*yc/a);pref=.01**2/(a*b)
    integ=lambda f,lo=0,hi=upper:quad(f,lo,hi,epsabs=1e-32,epsrel=eps,limit=500)[0]
    total=integ(fun);sig=pref*total*qf/qi/(32*math.pi*s);cone=integ(fun,0,cut)/total;moment=lambda j:integ(lambda x:fun(x)*vals(to_y(x))[j])/total;ymean=integ(lambda x:fun(x)*to_y(x))/total;mean=G*(ef+B*qf*(1-ymean));sd=G*B*qf*math.sqrt(integ(lambda x:fun(x)*(to_y(x)-ymean)**2)/total)
    return dict(E=E,m_initial=mi,m_final=mf,M_initial=Mi,M_final=Mf,mediator_mass=mu_s,contact=contact,t_forward=t0,transfer_floor=math.sqrt(max(0,-t0)),forward_lab_energy=vals(0)[1],forward_lab_speed=vals(0)[2],sigma_T=sig,cone_fraction=cone,mean_energy=mean,sd_energy=sd,mean_speed=moment(2),mean_angle_deg=moment(3)*180/math.pi,longitudinal_fraction_lab=moment(4),mean_longitudinal_transfer=moment(5))
rows=[]
for mi,mf,dm in [(1e-6,.5,.1),(1e-6,.1,.01),(1e-6,.01,.001),(1e-6,.001,.0001),(1e-6,1e-5,1e-6),(.1,.10001,1e-6),(.1,.1,0.)]:
    for ms in [10.,1.,.1,.01,.001,1e-4,1e-5,1e-6,1e-7,1e-8]:
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter('always',IntegrationWarning);r=kernel(1.,mi,mf,100.,100.+dm,ms)
        r['quadrature_warnings']=len(caught);rows.append(r);check(f'probability {mi,mf,dm,ms}',0<r['cone_fraction']<=1 and r['sigma_T']>0)
base=kernel(1.,1e-6,.5,100.,100.1,1.,contact=True);massless=kernel(1.,1e-6,.5,100.,100.1,0.);base['quadrature_warnings']=0;massless['quadrature_warnings']=0;rows.extend([base,massless]);ref=next(r for r in csv.DictReader((OUT/'review5_cross_sections.csv').open()) if float(r['E'])==1.)
check('contact cross section reproduces Review 5',abs(base['sigma_T']/float(ref['sigma_T'])-1)<2e-10)
check('contact cone reproduces Review 5',abs(base['cone_fraction']/float(ref['one_arcsec_fraction'])-1)<2e-9)
check('endothermic reference transfer floor',massless['t_forward']<0)
for r in [massless,rows[0],rows[29],rows[49],rows[69]]:
    rr=kernel(r['E'],r['m_initial'],r['m_final'],r['M_initial'],r['M_final'],r['mediator_mass'],eps=1e-12,contact=r['contact']);check('quadrature refinement '+str((r['m_final'],r['mediator_mass'])),abs(rr['cone_fraction']/r['cone_fraction']-1)<1e-7 and abs(rr['sigma_T']/r['sigma_T']-1)<1e-7)
csvout('review6_mediator_scan.csv',rows)
# Collinear A -> B + selected propagating reservoir excitation. Different mechanism than 2->2 exchange.
mi=1e-6;mf=.5;E=1.;p=math.sqrt(E*E-mi*mi);sb=.4;mb=.02
omega=lambda Q:math.hypot(sb*Q,mb);EB=lambda pp:math.hypot(pp,mf)
Q=brentq(lambda Q:EB(p-Q)+omega(Q)-E,0,p,xtol=1e-15);pr=p-Q;Eb=EB(pr);Om=omega(Q);va=p/E;vb=pr/Eb
check('collinear phase match energy',abs(E-Eb-Om)<2e-15);check('collinear phase match momentum',abs(p-pr-Q)<2e-15);check('collinear positive-gap slowing',0<vb<va<1);check('reservoir group causal',sb*sb*Q/Om<sb<1)
D0=E*Eb-p*pr;check('finite collinear transverse vertex',D0>0)
# Gaussian transverse amplitude envelope. Conditional paraxial limit, not a derived reservoir correlation.
angle=math.pi/(180*3600);L90=math.sqrt(math.log(10))/(pr*math.sin(angle));L99=math.sqrt(math.log(100))/(pr*math.sin(angle));beam=[]
for L in [1e2,1e3,1e4,1e5,L90,L99,1e6,1e7]:beam.append(dict(L_perp=L,one_arcsec_probability=-math.expm1(-(L*pr*math.sin(angle))**2),rms_paraxial_angle_rad=1/(L*pr)))
check('Gaussian 90% aperture target',abs(beam[4]['one_arcsec_probability']-.9)<1e-14);csvout('review6_coherent_aperture.csv',beam)
# Finite collective spin R. In invariant sector n_B=n_exc=n, H_int=g(b^dag a S^+ + h.c.).
# This is a selected-mode rotating-wave control. On resonance the free ledger is constant; off resonance include H_int.
cell=[];g=.01
for N,R in [(1,1),(1,16),(4,2),(4,4),(8,16)]:
    n=np.arange(min(N,R)+1,dtype=float);off=g*(n[:-1]+1)*np.sqrt((N-n[:-1])*(R-n[:-1]));
    for delta in [0.,.02,.1]:
        H=np.diag(delta*n)+np.diag(off,1)+np.diag(off,-1);lam,V=eigh(H);initial=np.zeros(len(n));initial[0]=1.;coeff=V.T@initial
        ts=np.linspace(0,400,801);states=(np.exp(-1j*np.outer(ts,lam))*coeff)@V.T;pop=abs(states)**2;mean=pop@n;eng=np.einsum('ti,ij,tj->t',states.conj(),H,states).real
        check(f'unitarity {N,R,delta}',np.max(abs(pop.sum(axis=1)-1))<1e-12);check(f'finite capacity {N,R,delta}',np.max(mean)<=min(N,R)+1e-12 and np.min(mean)>=-1e-12);check(f'closed Hamiltonian energy {N,R,delta}',np.max(abs(eng))<1e-12)
        if N==1:
            Gc=g*math.sqrt(R);exact=Gc**2/(Gc**2+(delta/2)**2)*np.sin(np.sqrt(Gc**2+(delta/2)**2)*ts)**2;check(f'analytic Rabi benchmark {R,delta}',np.max(abs(mean-exact))<1e-12)
        for t,m,e,pc in zip(ts,mean,eng,pop[:,-1]):cell.append(dict(N=N,R=R,detuning=delta,g=g,T=t,mean_converted=m,full_capacity_probability=pc,H_relative=e))
csvout('review6_coherent_cells.csv',cell)
# Fixed Q, finite coupling duration. Free mismatch off resonance requires interaction or switching energy.
R=16;Gc=g*math.sqrt(R);Tpi=math.pi/(2*Gc);lines=[]
for Ei in np.linspace(.6,1.4,401):
    pi=math.sqrt(Ei**2-mi**2);Ef=EB(pi-Q);delta=Ef+Om-Ei;nu=math.sqrt(Gc**2+(delta/2)**2);P=Gc**2/nu**2*math.sin(nu*Tpi)**2
    lines.append(dict(E_in=Ei,E_B_at_fixed_Q=Ef,detuning=delta,finite_time_probability=P,free_energy_mismatch=delta,group_speed_B=(pi-Q)/Ef))
check('on-resonance full single photon conversion',abs(lines[200]['finite_time_probability']-1)<1e-12);csvout('review6_coherent_detuning.csv',lines)
# Homogeneous temporal variation: conserved k, energy can fall with growing gap only if C falls sufficiently.
Eend=.695302669585;gapend=.5065013693;Cend=math.sqrt(Eend**2-gapend**2)/p;vend=Cend*Cend*p/Eend;check('fixed momentum incompatible with rising C for R5 endpoints',Cend<1)
opt=[]
for d in [.2,.5,.8]:
    arrival=d/va+(1-d)/vb;opt.append(dict(path=1.,conversion_x=d,arrival=arrival,unconverted_arrival=1/va,delay=arrival-1/va,energy_ratio=Eb/E,spectral_ratio_if_same_standards=E/Eb,pulse_interval_ratio_same_stationary_history=1.0))
csvout('review6_coherent_timing.csv',opt)
csvout('review6_detector_control.csv',[dict(q_B_over_q_A=r,relative_squared_current_coupling=r*r) for r in [0.,.01,.1,.5,1.]])
plt.rcParams.update({'font.size':10,'pdf.fonttype':42,'axes.spines.top':False,'axes.spines.right':False,'figure.figsize':(4.7,3.25)})
fig,ax=plt.subplots()
for (aa,bb,cc),style in zip([(1e-6,.5,.1),(1e-6,.1,.01),(1e-6,.01,.001),(.1,.10001,1e-6),(.1,.1,0.)],['-','--','-.',':','-']):
    rr=[r for r in rows if r['m_initial']==aa and r['m_final']==bb and not r['contact'] and r['mediator_mass']>0];ax.loglog([r['mediator_mass'] for r in rr],[r['cone_fraction'] for r in rr],style,marker='.',label=f'{aa:g} → {bb:g}, δM={cc:g}')
ax.set(xlabel='Mediator mass (normalized)',ylabel='One-arcsec conditional fraction');ax.legend(fontsize=7);ax.grid(alpha=.2,which='both');fig.tight_layout();fig.savefig(FIG/'review6_mediator.pdf');plt.close(fig)
fig,ax=plt.subplots()
for N,R,delta in [(1,16,0.),(1,16,.1),(4,2,0.),(4,4,0.)]:
    rr=[r for r in cell if r['N']==N and r['R']==R and r['detuning']==delta];ax.plot([r['T'] for r in rr],[r['mean_converted']/N for r in rr],label=f'N={N}, R={R}, δ={delta:g}')
ax.set(xlabel='Interaction time (normalized)',ylabel='Converted radiation fraction');ax.legend(fontsize=8);fig.tight_layout();fig.savefig(FIG/'review6_coherent_cells.pdf');plt.close(fig)
fig,ax=plt.subplots();ax.plot([r['E_in'] for r in lines],[r['finite_time_probability'] for r in lines]);ax.set(xlabel='Incident energy (normalized)',ylabel='Finite-time conversion probability');ax.axvline(1,ls=':',color='gray');fig.tight_layout();fig.savefig(FIG/'review6_detuning.pdf');plt.close(fig)
csvout('review6_regression.csv',checks)
summary=dict(contact=base,massless_inelastic=massless,coherent=dict(E_in=E,p_in=p,E_out=Eb,p_out=pr,Q=Q,omega_reservoir=Om,s_reservoir=sb,gap_reservoir=mb,group_in=va,group_out=vb,reservoir_group=sb*sb*Q/Om,transverse_vertex_tensor=D0,L90=L90,L99=L99,g=g,R=16,Tpi=Tpi,fixed_p_C_for_R5_endpoint=Cend,fixed_p_v_for_R5_endpoint=vend),checks=len(checks),mediator_cases=len(rows),coherent_cell_cases=15,dependencies=dict(python=platform.python_version(),numpy=np.__version__,scipy=scipy.__version__,mpmath=mp.__version__,matplotlib=matplotlib.__version__))
(OUT/'review6_summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary,indent=2))
