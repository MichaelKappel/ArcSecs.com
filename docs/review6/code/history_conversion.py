"""Part XXXI: reduced energy/recoil-accounted irreversible gap conversion.
Dimensionless prescribed smooth static wall, effective packet + lumped receiver.
Not a microscopic electrodynamics, fit, or autonomous spatial reservoir.
Run from any directory; outputs relative to this script's parent package.
"""
from pathlib import Path
import csv
import numpy as np
from scipy.integrate import solve_ivp
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
ROOT=Path(__file__).resolve().parents[1]

def simulate(beta=1., mobility=1., lead=.3, ratio=1.2, gap0=1e-6,
             energy0=1., mass=100., capacity=2., step=.04, tol=1e-10, shape='smooth'):
    assert 0<gap0<energy0 and mass>0 and capacity>0
    p0=np.sqrt((energy0-gap0)*(energy0+gap0))
    def evaluate(x,p,a):
        u=np.clip(x,0.,1.)
        if shape=='smooth':
            C=1+(ratio-1)*u*u*(3-2*u); Cp=(ratio-1)*6*u*(1-u)
        else:
            C=1+(ratio-1)*u; Cp=(ratio-1)*float(0<x<1)
        D=gap0+beta*a; E=np.hypot(C*p,D); v=C*C*p/E
        U=a/mass; A=v-beta*D/E-U
        rate=mobility*max(A,0.)*max(1-a/capacity,0.)
        Hx=C*Cp*p*p/E
        dv=v*v*Cp/C - C*C*D*(D+beta*p)/E**3*rate
        return C,D,E,v,A,rate,Hx,dv
    def rhs(t,y):
        x,p,a,Q,W=y
        C,D,E,v,A,rate,Hx,dv=evaluate(x,p,a)
        return v,-Hx-rate,rate,A*rate,Hx
    def exit_wall(t,y):return y[0]-1
    exit_wall.terminal=True;exit_wall.direction=1
    def stop(t,y):return y[1]-1e-10
    stop.terminal=True;stop.direction=-1
    sol=solve_ivp(rhs,(0,100),[-lead,p0,0,0,0],events=(exit_wall,stop),
                  rtol=tol,atol=tol*.01,max_step=step,dense_output=True)
    assert sol.success
    t=np.unique(np.r_[np.linspace(0,sol.t[-1],5001),sol.t]); y=sol.sol(t)
    V=np.array([evaluate(x,p,a) for x,p,a in zip(*y[:3])]); C,D,E,v,A,rate,Hx,dv=V.T
    x,p,a,Q,W=y; recoil=a*a/(2*mass)
    errE=np.max(np.abs(E+recoil+Q-energy0)); errP=np.max(np.abs(p+a+W-p0))
    dlimit=np.sqrt(max(0,1-(v[0]/C[-1])**2))*E[-1]
    result=dict(beta=beta,mobility=mobility,lead=lead,ratio=ratio,gap0=gap0,energy0=energy0,mass=mass,capacity=capacity,shape=shape,step=step,tol=tol,
          crossed=bool(len(sol.t_events[0])),duration=t[-1],x_final=x[-1],v_initial=v[0],v_final=v[-1],energy_final=E[-1],retained=E[-1]/energy0,gap_final=D[-1],converted=a[-1],heat=Q[-1],recoil=recoil[-1],wall_momentum=W[-1],max_dvdt=np.max(dv),max_sample_speed_rise=np.max(np.diff(v)),min_p=np.min(p),min_heat=np.min(Q),min_rate=np.min(rate),max_capacity_fraction=np.max(a)/capacity,energy_error=errE,momentum_error=errP,endpoint_gap_min=dlimit,speed_ceiling_violation=np.max(v-C))
    return result,np.column_stack((t,y.T,V,recoil))

def main():
    runs=[]; traces={}
    cases=[('baseline',{}),('refined',{'step':.01,'tol':1e-12}),('tiny_bare_gap',{'gap0':1e-16}),('no_exchange',{'mobility':0.}),('fixed_gap',{'beta':0.}),('no_lead',{'lead':0.}),('capacity_0.1',{'capacity':.1}),('capacity_0.3',{'capacity':.3}),('capacity_0.5',{'capacity':.5}),('low_energy',{'energy0':.5}),('high_energy',{'energy0':2.}),('higher_energy',{'energy0':4.}),('steeper_wall',{'ratio':1.4}),('light_receiver',{'mass':1.}),('linear_wall',{'shape':'linear'})]
    for name,kwargs in cases:
        r,trace=simulate(**kwargs);runs.append(dict(case=name,**r));traces[name]=trace
    scan=[]
    for b in (.5,1.,2.):
        for k in (.5,1.,2.):
            for L in (.1,.3,.6):
                r,_=simulate(beta=b,mobility=k,lead=L,tol=1e-9)
                scan.append(r)
    def write(name,rows):
        with (ROOT/'appendices'/name).open('w') as f:
            w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
    write('history_cases.csv',runs);write('history_scan.csv',scan)
    names='T,x,p,a,Q,W,C,Delta,E,v,A,adot,Hx,dvdt,recoil'
    np.savetxt(ROOT/'appendices'/'history_baseline.csv',traces['baseline'],delimiter=',',header=names,comments='')
    by={r['case']:r for r in runs};b=by['baseline'];f=by['refined'];checks=[]
    def check(label,ok):
        assert ok,label;checks.append(label)
    for r in runs+scan:
        name=r.get('case',str((r['beta'],r['mobility'],r['lead'])))
        check(name+' energy ledger',r['energy_error']<2e-7)
        check(name+' momentum ledger',r['momentum_error']<2e-7)
        check(name+' nonnegative heat, capacity and group ceiling',r['min_heat']>=-1e-9 and r['min_rate']>=0 and r['max_capacity_fraction']<=1+1e-8 and r['speed_ceiling_violation']<1e-10)
    check('baseline positive traversal and sampled monotonicity',b['crossed'] and b['min_p']>0 and b['max_dvdt']<0)
    check('refinement preserves monotonicity',f['crossed'] and f['max_dvdt']<0)
    check('endpoint convergence',max(abs(b[k]-f[k]) for k in ('duration','energy_final','v_final','gap_final'))<1e-7)
    check('baseline endpoint gap bound',b['gap_final']>=b['endpoint_gap_min'])
    check('no exchange reaccelerates',by['no_exchange']['max_dvdt']>0)
    check('tiny gap positive and sampled monotone',by['tiny_bare_gap']['crossed'] and by['tiny_bare_gap']['max_dvdt']<=1e-12)
    check('finite capacity obstruction',by['capacity_0.1']['max_dvdt']>0)
    check('monotone speed derivative agrees with sample signs',b['max_sample_speed_rise']<=1e-10)
    # Independent centered finite-difference derivative test away from wall joins.
    tr=traces['baseline'];h=tr[2:,0]-tr[:-2,0];numer=(tr[2:,9]-tr[:-2,9])/h
    regular=(np.abs((tr[2:,0]+tr[:-2,0])/2-tr[1:-1,0])<1e-12)&(np.abs(tr[1:-1,1])>.002)&(np.abs(tr[1:-1,1]-1)>.002)
    derivative_error=np.max(np.abs(numer[regular]-tr[1:-1,13][regular]));check('finite-difference speed derivative',derivative_error<1e-5)
    good=[r for r in scan if r['crossed'] and r['max_dvdt']<=1e-10]
    log=f'{len(checks)} assertions passed.\n{len(runs)} named runs + {len(scan)} parameter cases.\n{len(good)}/{len(scan)} scanned cases cross with no positive sampled derivative (tolerance 1e-10).\nMaximum energy error: {max(r["energy_error"] for r in runs+scan):.8g}\nMaximum momentum error: {max(r["momentum_error"] for r in runs+scan):.8g}\nFinite-difference derivative error: {derivative_error:.8g}\nBaseline endpoint differences under refinement: '+str({k:abs(b[k]-f[k]) for k in ('duration','energy_final','v_final','gap_final')})+'\n'
    (ROOT/'appendices'/'part_xxxi_verification.txt').write_text(log+'\n'+'\n'.join('PASS '+x for x in checks)+'\n')
    print(log)
    for r in runs:print(r['case'],r['crossed'],f"E={r['energy_final']:.6f} v={r['v_final']:.6f} gap={r['gap_final']:.6f} dvmax={r['max_dvdt']:.6g} t={r['duration']:.6f} heat={r['heat']:.6f}")
    fig,ax=plt.subplots(figsize=(8,4.5));
    for name in ('baseline','no_exchange','fixed_gap','capacity_0.1','no_lead'):
        t=traces[name];ax.plot(t[:,1],t[:,9],label=name.replace('_',' '))
    ax.plot(tr[:,1],tr[:,6],ls='--',color='0.4',label='local characteristic C');ax.axvspan(0,1,color='0.8',alpha=.15)
    ax.set(xlabel='Position / wall thickness',ylabel='Group speed / initial ceiling',title='History conversion across a smooth rising ceiling');ax.legend(fontsize=8,ncol=2);ax.grid(alpha=.25);fig.tight_layout();fig.savefig(ROOT/'figures'/'history_wall.png',dpi=180);plt.close(fig)
    fig,ax=plt.subplots(figsize=(8,4.4));ax.plot(tr[:,1],tr[:,8],label='Packet energy E');ax.plot(tr[:,1],tr[:,4],label='Heat Q');ax.plot(tr[:,1],tr[:,14],label='Receiver recoil energy');ax.plot(tr[:,1],tr[:,8]+tr[:,4]+tr[:,14],ls='--',label='Total');ax.plot(tr[:,1],tr[:,7],ls=':',label='Effective gap (included in E)');ax.set(xlabel='Position / wall thickness',ylabel='Energy / initial packet energy',title='Energy accounting: gap is not an extra energy ledger term');ax.grid(alpha=.25);ax.legend(fontsize=8,ncol=2);fig.tight_layout();fig.savefig(ROOT/'figures'/'history_energy.png',dpi=180);plt.close(fig)
if __name__=='__main__':main()
