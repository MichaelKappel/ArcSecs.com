"""Generate plot assets from stored Chapter 30Q CSV data. Plot styles use library defaults."""
from pathlib import Path
import argparse,csv
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

def rows(path):
    with Path(path).open() as f:return list(csv.DictReader(f))

def render(data,figures):
    data,figures=Path(data),Path(figures);figures.mkdir(parents=True,exist_ok=True)
    v=rows(data/'scalar_profile.csv')
    x=np.array([float(z['x']) for z in v]);psi=np.array([float(z['psi']) for z in v]);rho=np.array([float(z['density']) for z in v])
    fig,ax=plt.subplots(figsize=(9,4.4));ax.plot(x,psi,label='Screened scalar ψ(x)');ax.set_xlabel('Position x (normalized)');ax.set_ylabel('Scalar state ψ');ax.axvline(-3,ls='--',alpha=.4);ax.axvline(3,ls='--',alpha=.4)
    ax.text(0,.78,'Dense slab',ha='center',fontsize=9);ax.legend(loc='upper right');fig.tight_layout();fig.savefig(figures/'stueckelberg-screening-profile.png',dpi=190);plt.close(fig)
    v=rows(data/'mode_spectrum.csv');fig,ax=plt.subplots(figsize=(9,4.4))
    for pol,lab in [('T','Transverse T'),('L','Longitudinal L')]:
        y=[float(z['R']) for z in v if z['pol']==pol];w=[float(z['omega']) for z in v if z['pol']==pol]
        ax.plot(w,y,marker='o',ms=3,label=lab)
    ax.set_xlabel('Frequency ω (normalized; mass gap Ω=0.38)');ax.set_ylabel('Reflected energy fraction R');ax.legend();ax.set_ylim(bottom=0);fig.tight_layout();fig.savefig(figures/'stueckelberg-polarization-reflection.png',dpi=190);plt.close(fig)
    v=rows(data/'scattering_convergence.csv');fig,ax=plt.subplots(figsize=(9,4.4))
    for pol,lab in [('T','Transverse T'),('L','Longitudinal L')]:
        xx=[int(z['n']) for z in v if z['pol']==pol];yy=[float(z['R']) for z in v if z['pol']==pol]
        ax.plot(xx,yy,marker='o',ms=4,label=lab)
    ax.set_xlabel('Spatial profile grid nodes');ax.set_ylabel('Reflected fraction R at ω=1.1');ax.set_xscale('log');ax.legend();fig.tight_layout();fig.savefig(figures/'stueckelberg-boundary-convergence.png',dpi=190);plt.close(fig)

if __name__=='__main__':
    a=argparse.ArgumentParser();a.add_argument('--data',default='docs/long-term-memory/research/stueckelberg-screened-interface');a.add_argument('--figures',default='book/figures');p=a.parse_args();render(p.data,p.figures)
