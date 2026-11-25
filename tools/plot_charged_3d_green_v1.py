#!/usr/bin/env python3
"""Three source-integrity figures for Chapter 30O. Default matplotlib palette."""
from pathlib import Path
import argparse,csv
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

def read(p):
    with Path(p).open() as f:return list(csv.DictReader(f))

def plot(datadir,figdir):
    data=Path(datadir);fig=Path(figdir);fig.mkdir(parents=True,exist_ok=True)
    rows=read(data/'spectral_cutoff_scan.csv')
    cutoffs=sorted({int(r['N']) for r in rows})
    f=sorted({float(r['frequency']) for r in rows})
    vals={(int(r['N']),float(r['frequency'])):r for r in rows}
    # I: Fixed source profile and cutoff sweep.
    plt.figure(figsize=(8.3,4.7))
    for n in cutoffs:
        plt.plot(f,[float(vals[n,fr]['total_abs']) for fr in f],marker='o',markersize=3,label=f'N = {n}')
    plt.xlabel('Driven angular frequency (normalized)')
    plt.ylabel('Magnitude of complex receiver field response')
    plt.title('3D vector receiver spectrum under fixed Gaussian widths')
    plt.grid(alpha=.25);plt.legend(ncol=3,fontsize=8);plt.tight_layout()
    plt.savefig(fig/'charged-3d-green-spectrum.png',dpi=450);plt.close()
    # II: complex error using N=12 reference; no false precision at N=12 itself.
    plt.figure(figsize=(7.8,4.5))
    maxn=cutoffs[-1]
    for n in cutoffs[:-1]:
        errors=[]
        for fr in f:
            a=complex(float(vals[n,fr]['total_re']),float(vals[n,fr]['total_im']))
            b=complex(float(vals[maxn,fr]['total_re']),float(vals[maxn,fr]['total_im']))
            errors.append(abs(a-b)/max(abs(b),1e-14))
        plt.semilogy(f,errors,marker='o',markersize=4,label=f'N = {n} vs N = {maxn}')
    plt.xlabel('Driven angular frequency (normalized)')
    plt.ylabel('Relative complex receiver-response difference')
    plt.title('Convergence: amplitude and phase, fixed widths and box')
    plt.grid(alpha=.25,which='both');plt.legend(fontsize=8);plt.tight_layout()
    plt.savefig(fig/'charged-3d-green-convergence.png',dpi=450);plt.close()
    # III: transverse and longitudinal components contribute *coherently*.
    p=[vals[maxn,x] for x in f]
    plt.figure(figsize=(8.3,4.6))
    plt.plot(f,[float(r['total_abs']) for r in p],marker='o',label='Combined |T + L|')
    plt.plot(f,[float(r['transverse_abs']) for r in p],marker='s',label='|Transverse|')
    plt.plot(f,[float(r['longitudinal_abs']) for r in p],marker='^',label='|Longitudinal|')
    plt.xlabel('Driven angular frequency (normalized)')
    plt.ylabel('Magnitude of complex receiver field')
    plt.title('Full response includes a propagating longitudinal mode')
    plt.grid(alpha=.25);plt.legend(fontsize=8);plt.tight_layout()
    plt.savefig(fig/'charged-3d-green-polarizations.png',dpi=450);plt.close()

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--data',required=True);p.add_argument('--figures',required=True)
    args=p.parse_args();plot(args.data,args.figures)
