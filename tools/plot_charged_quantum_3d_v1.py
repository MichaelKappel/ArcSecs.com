"""Create Chapter 30P diagnostic plots from saved CSV without fitted data."""
from pathlib import Path
import csv,argparse
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

def create(data,figures):
    data=Path(data);figures=Path(figures);figures.mkdir(parents=True,exist_ok=True)
    with (data/'comparison.csv').open() as f:rows=list(csv.DictReader(f))
    shell=[r for r in rows if r['case'].startswith('shell_')]
    counts=np.array([int(r['modes']) for r in shell])
    resp=np.array([float(r['peak_receiver']) for r in shell])
    fig,ax=plt.subplots(figsize=(7.7,4.4))
    ax.plot(counts,resp*1e4,marker='o')
    ax.set_xlabel('Retained real Fourier wavevector pairs')
    ax.set_ylabel('Peak receiver excitation (×10⁻⁴)')
    ax.set_title('Three-dimensional quantum receiver cutoff study')
    ax.grid(alpha=.24)
    fig.tight_layout();fig.savefig(figures/'charged-quantum-3d-convergence.png',dpi=450);plt.close(fig)
    det=[r for r in rows if r['case'].startswith('detune_')]
    response0=float(next(r for r in rows if r['case']=='shell_4')['peak_receiver'])
    xs=np.array([-.12,-.06,0.,.06,.12]);ys=np.array([float(det[0]['peak_receiver']),float(det[1]['peak_receiver']),response0,float(det[2]['peak_receiver']),float(det[3]['peak_receiver'])])
    fig,ax=plt.subplots(figsize=(7.7,4.4))
    ax.plot(xs*100,ys*1e4,marker='o')
    ax.set_xlabel('Detector transition offset (%)')
    ax.set_ylabel('Peak receiver excitation (×10⁻⁴)')
    ax.set_title('Synthetic quantum receiver detuning response (364 modes)')
    ax.grid(alpha=.24);fig.tight_layout();fig.savefig(figures/'charged-quantum-3d-detuning.png',dpi=450);plt.close(fig)
    with (data/'baseline_trace.csv').open() as f:r=list(csv.DictReader(f))
    t=np.array([float(z['T']) for z in r])
    pop=np.array([float(z['receiver_population']) for z in r])
    en=np.array([float(z['energy']) for z in r])
    p=np.array([[float(z[k]) for k in ('P_x','P_y','P_z')] for z in r])
    fig,ax=plt.subplots(figsize=(7.7,4.4))
    ax.plot(t,pop*1e4,label='Detector excitation ×10⁴')
    ax.set_xlabel('Preferred-time parameter (normalized)')
    ax.set_ylabel('Excited-state population (×10⁻⁴)')
    ax.set_title('Reciprocal source-to-receiver excitation')
    ax.grid(alpha=.24);fig.tight_layout();fig.savefig(figures/'charged-quantum-3d-trace.png',dpi=450);plt.close(fig)
    return [figures/f'charged-quantum-3d-{w}.png' for w in ['convergence','detuning','trace']]
if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--data',required=True);ap.add_argument('--figures',required=True)
    args=ap.parse_args();print(*create(args.data,args.figures),sep='\n')
