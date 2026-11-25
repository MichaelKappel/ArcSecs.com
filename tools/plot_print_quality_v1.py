"""Regenerate selected low-resolution illustrations from equations or archived data.
The wall-force figure intentionally shows only the derived pressure/tension law;
the historical extra curve lacked a recorded coefficient. Historical PDF retained in audit ZIP.
"""
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from bubble_force_toy import wall_force
from external_coupling import acceleration,needed_shell_mass,MPC,G_NEWTON
ROOT=Path(__file__).resolve().parents[1]; F=ROOT/'book/figures'
plt.rcParams.update({'font.size':11,'axes.spines.top':False,'axes.spines.right':False})
def save(fig,name):
    fig.tight_layout();fig.savefig(F/(name+'.png'),dpi=450);plt.close(fig)
def main():
    r=np.linspace(.15,3.2,400);fig,ax=plt.subplots(figsize=(8,4.3));ax.plot(r,[wall_force(x,.8,1) for x in r],label='Pressure and surface tension',color='black');ax.axhline(0,color='gray',lw=.8);ax.axvline(1.6,ls='--',color='gray',label='Critical radius 1.6');ax.set(xlabel='Radius R (normalized)',ylabel='Radial generalized force',title='Derived bubble-wall force: dimensionless control');ax.legend();ax.grid(alpha=.18);save(fig,'bubble-force-toy')
    t=np.linspace(0,2*np.pi,500);fig,axs=plt.subplots(1,2,figsize=(8,3.6));
    for ax,a,b,title in zip(axs,[1,1.16],[1,.84],['Equal outward growth','Directional deformation']):
        ax.plot(a*np.cos(t),b*np.sin(t),color='black',lw=2);ax.plot(0,0,'o',color='black',ms=3);ax.set_title(title);ax.set_aspect('equal');ax.set(xlim=(-1.4,1.4),ylim=(-1.4,1.4));ax.axis('off')
    save(fig,'isotropic-vs-tidal')
    a=1000*MPC;lam=500*MPC;H=70000/MPC;M=needed_shell_mass(H*H,a,lam,G_NEWTON);r=np.linspace(0,950,400);fig,ax=plt.subplots(figsize=(8,4.1));ax.plot(r,[acceleration(x*MPC,a,lam,G_NEWTON,M) for x in r],label='Exact shell acceleration',color='black');ax.plot(r,H*H*r*MPC,ls='--',label='Near-center linear approximation',color='gray');ax.set(xlabel='Radius from shell center (Mpc)',ylabel='Outward acceleration (m/s²)',title='Hypothetical screened-shell response');ax.legend();ax.grid(alpha=.18);save(fig,'shell-response')
    r=np.linspace(0,1,200);fig,ax=plt.subplots(figsize=(8,4.1));ax.plot(r,2*r,label='Along source axis: +2Kr',color='black');ax.plot(r,-r,ls='--',label='Each transverse axis: −Kr',color='gray');ax.plot(r,r*0,ls=':',color='black',label='Trace = 0');ax.set(xlabel='Normalized displacement r',ylabel='Differential acceleration / K',title='Newtonian tidal eigenmodes');ax.legend();ax.grid(alpha=.18);save(fig,'tidal-eigenmodes')
    data=np.genfromtxt(ROOT/'docs/long-term-memory/research/screened-boundary/screened_slab_profile.csv',delimiter=',',names=True);fig,ax=plt.subplots(figsize=(8,4));ax.plot(data['x'],data['psi'],color='black',label='Computed scalar profile');ax.axhline(1,ls=':',color='gray',label='Exterior equilibrium');ax.axhline(1/41,ls='--',color='gray',label='Dense-region equilibrium');ax.axvspan(-1,1,alpha=.12,color='gray',label='Dense material');ax.set(xlabel='Position (dimensionless)',ylabel='Scalar field ψ (dimensionless)',title='Synthetic finite dense slab');ax.legend();ax.grid(alpha=.18);save(fig,'screened-slab-profile')
if __name__=='__main__':main()
