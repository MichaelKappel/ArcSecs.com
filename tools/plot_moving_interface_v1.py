"""Reproduce two synthetic figures from the CSV output of moving_interface_v1.py."""
import csv
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

def load(p):
    with Path(p).open() as f: return list(csv.DictReader(f))

def arr(rows,name):return np.array([float(x[name]) for x in rows])

def make(out_dir,figure_dir):
    out_dir=Path(out_dir);figure_dir=Path(figure_dir);figure_dir.mkdir(exist_ok=True,parents=True)
    profile=load(out_dir/'moving_plus_final_profile.csv')
    m=load(out_dir/'moving_plus_budgets.csv')
    st=load(out_dir/'stationary_budgets.csv')
    def graphic_setup():
        plt.rcParams.update({'font.size':9,'axes.spines.top':False,'axes.spines.right':False,
                             'axes.grid':True,'grid.alpha':.18})
    graphic_setup()
    fig,ax1=plt.subplots(figsize=(8,3.55))
    x=arr(profile,'x');psi=arr(profile,'psi');rho=arr(profile,'rho')
    ax1.plot(x,psi,label='Scalar field $\\psi$ at $T=18$',color='#124E78',lw=2.2)
    ax1.set(xlim=(-5,5),xlabel='Location (dimensionless)',ylabel='Scalar field $\\psi$',
            title='A moving physical matter density screens a responsive scalar')
    ax1.set_ylim(-.01,1.07)
    ax2=ax1.twinx();ax2.plot(x,rho,label='Moving matter density',color='#C16733',ls='--',lw=1.7)
    ax2.set(ylabel='Material density $\\rho$',ylim=(-.05,4.9))
    l1,lab1=ax1.get_legend_handles_labels();l2,lab2=ax2.get_legend_handles_labels()
    ax1.legend(l1+l2,lab1+lab2,loc='lower left',fontsize=8,frameon=False)
    fig.tight_layout();fig.savefig(figure_dir/'moving-slab-scalar.png',dpi=450);plt.close(fig)
    fig,ax=plt.subplots(figsize=(8,3.6))
    t=arr(m,'time')
    for y,title,color in [('E_em','Electromagnetic wave','#124E78'),
                           ('E_scalar','Scalar field + interaction','#C16733'),
                           ('E_matter','Material motion','#238568')]:
        ax.plot(t,arr(m,y)-arr(m,y)[0],label=title,lw=1.8,color=color)
    ax.plot(t,arr(m,'E_total')-arr(m,'E_total')[0],ls='--',lw=1.4,
            label='Closed total (near zero)',color='#444444')
    ax.set(xlabel='Progression $T$ (dimensionless)',ylabel='Energy difference from $T=0$',
           title='Synthetic energy exchange without a prescribed energy sink')
    ax.legend(frameon=False,fontsize=8,ncol=2,loc='lower left')
    fig.tight_layout();fig.savefig(figure_dir/'moving-slab-energy-ledger.png',dpi=450);plt.close(fig)
    fig,ax=plt.subplots(figsize=(8,3.5))
    for label,c,style in [('moving_plus','#124E78','-'),('stationary','#C16733','--'),
                           ('moving_minus','#238568','-.')]:
        rows=load(out_dir/f'{label}_ray.csv')
        ax.plot(arr(rows,'time'),arr(rows,'ln_omega_ratio'),color=c,lw=1.8,ls=style,
                label={'moving_plus':'Initially moving $+v$','stationary':'Initially stationary',
                       'moving_minus':'Initially moving $-v$'}[label])
    ax.set(xlabel='Progression $T$ (dimensionless)',ylabel='$\\ln[\\omega(T)/\\omega(0)]$',
            title='Conditional WKB ray record from the same evolving field')
    ax.legend(frameon=False,fontsize=8)
    fig.tight_layout();fig.savefig(figure_dir/'moving-slab-ray.png',dpi=450);plt.close(fig)

if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser();parser.add_argument('--output-dir',default='docs/long-term-memory/research/moving-interface')
    parser.add_argument('--figure-dir',default='book/figures');args=parser.parse_args()
    make(args.output_dir,args.figure_dir)
