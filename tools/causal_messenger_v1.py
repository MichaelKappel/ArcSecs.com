#!/usr/bin/env python3
"""ArcSecs R40 finite-speed physical messenger, exact 1-D collision toy.

DO NOT interpret this as a detection of cosmic bubbles or a gravity law.
Unlike the instantaneous R39 potential, carrier momentum exists in flight.
Each source has a finite internal energy reserve that powers its launch.
No spacetime, time, or space material is instantiated in the model.
"""
from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path
import csv, json

@dataclass
class Body:
    name: str
    x: float
    v: float
    mass: float
    reserve: float = 0.

@dataclass
class Carrier:
    name: str
    x: float
    v: float
    mass: float
    origin: str
    target: str
    launched: bool = False
    collided: bool = False

class Exchange:
    """Nonrelativistic point-body benchmark, with constant event ordering T."""
    def __init__(self, with_exterior:bool=False):
        self.t=0.
        self.bodies={
          'internal_source':Body('internal_source',-10.,0.,20.,2.),
          'receiver':Body('receiver',0.,0.,3.,0.),
          'external_bubble_candidate':Body('external_bubble_candidate',18.,-.08,40.,2.),
        }
        self.carriers={
          'internal_packet':Carrier('internal_packet',-10.,0.,.20,'internal_source','receiver'),
          'exterior_packet':Carrier('exterior_packet',18.,-.08,.16,'external_bubble_candidate','receiver'),
        }
        self.with_exterior=with_exterior
        self.events=[]
        self.start_ledger=self.ledger()
        self.launch('internal_packet',2.0)
        if with_exterior:
            self.launch('exterior_packet',-2.0)
        self.events.append({'time':self.t,'event':'ready','energy':self.ledger()['energy'],'momentum':self.ledger()['momentum']})
    def ledger(self):
        E=sum(.5*b.mass*b.v*b.v+b.reserve for b in self.bodies.values())
        P=sum(b.mass*b.v for b in self.bodies.values())
        for c in self.carriers.values():
            E+=.5*c.mass*c.v*c.v
            P+=c.mass*c.v
        return {'energy':E,'momentum':P,'matter_momentum':sum(b.mass*b.v for b in self.bodies.values()),
                'carrier_momentum':sum(c.mass*c.v for c in self.carriers.values()),
                'inflight_carrier_momentum':sum(c.mass*c.v for c in self.carriers.values() if c.launched)}
    def launch(self,carrier_name,relative_speed):
        c=self.carriers[carrier_name];s=self.bodies[c.origin]
        assert not c.launched and not c.collided
        # Carrier already exists in source store, counted in baseline mass/momentum.
        # A local internal-energy transfer launches it with reciprocal recoil.
        before=.5*s.mass*s.v*s.v+.5*c.mass*c.v*c.v
        new_cv=s.v+relative_speed
        new_sv=s.v-(c.mass/s.mass)*(new_cv-c.v)
        after=.5*s.mass*new_sv**2+.5*c.mass*new_cv**2
        cost=after-before
        if cost>s.reserve:raise ValueError('insufficient physical source energy')
        s.reserve-=cost;s.v=new_sv;c.v=new_cv;c.launched=True;c.x=s.x
        self.events.append({'time':self.t,'event':'launch','carrier':c.name,'origin':s.name,
                            'source_recoil_velocity':s.v,'reserve_spent':cost})
    def advance(self,time):
        dt=time-self.t
        if dt < -1e-12:raise ValueError('cannot reverse constant T')
        for b in self.bodies.values():b.x+=b.v*dt
        for c in self.carriers.values():
            if c.launched:c.x+=c.v*dt
            else:c.x=self.bodies[c.origin].x
        self.t=time
    def next_contact(self):
        choices=[]
        for c in self.carriers.values():
            if c.launched and not c.collided:
                b=self.bodies[c.target];relative=c.v-b.v
                if abs(relative)<1e-14:continue
                delay=(b.x-c.x)/relative
                if delay>1e-12:choices.append((self.t+delay,c.name))
        return min(choices) if choices else (float('inf'),None)
    def collide(self,cname):
        c=self.carriers[cname]; b=self.bodies[c.target]
        m,M=c.mass,b.mass;u,v=c.v,b.v
        c.v=((m-M)*u+2*M*v)/(m+M)
        b.v=(2*m*u+(M-m)*v)/(m+M)
        c.collided=True
        self.events.append({'time':self.t,'event':'contact','carrier':c.name,'target':b.name,
                            'receiver_velocity_after':b.v,'carrier_velocity_after':c.v})
    def run(self,end=9.5, checkpoints=(0.,2.,4.,5.2,7.,8.,8.5,9.,9.5)):
        timeline=[]
        checkpoints=sorted(set(float(x) for x in checkpoints if 0<=x<=end)|{float(end)})
        k=0
        while self.t < end-1e-10 or k<len(checkpoints):
            tcontact,cname=self.next_contact()
            tcheck=checkpoints[k] if k<len(checkpoints) else float('inf')
            tnext=min(end,tcontact,tcheck)
            if tnext < self.t-1e-9:raise AssertionError('bad chronology')
            self.advance(tnext)
            if tcontact<=tnext+1e-10 and cname is not None:
                self.collide(cname)
            if tcheck<=tnext+1e-10:
                row={'T':self.t,'scenario':'with_exterior' if self.with_exterior else 'internal_only',
                     'receiver_x':self.bodies['receiver'].x,
                     'receiver_v':self.bodies['receiver'].v,
                     'bubble_x':self.bodies['external_bubble_candidate'].x,
                     'bubble_v':self.bodies['external_bubble_candidate'].v,
                     **self.ledger()}
                timeline.append(row);k+=1
            if self.t>=end-1e-10 and k>=len(checkpoints):break
        return timeline

def run_models(destination=None):
    runs=[];all_rows=[]
    for external in (False,True):
        s=Exchange(with_exterior=external)
        rows=s.run();runs.append(s);all_rows+=rows
    if destination:
        destination=Path(destination);destination.parent.mkdir(parents=True,exist_ok=True)
        with destination.open('w',newline='',encoding='utf8') as f:
            fields=['scenario','T','receiver_x','receiver_v','bubble_x','bubble_v','energy','momentum','matter_momentum','carrier_momentum','inflight_carrier_momentum']
            w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(all_rows)
        ev=destination.with_name('causal-carrier-events.json')
        ev.write_text(json.dumps({'disclosure':'Synthetic nonrelativistic test only; no actual cosmic bubble observed.',
                                  'events':{'internal_only':runs[0].events,'with_exterior':runs[1].events}},indent=2)+'\n',encoding='utf8')
    return runs,all_rows

def main():
    out=Path(__file__).resolve().parents[1]/'docs/long-term-memory/research/causal-carrier-benchmarks.csv'
    runs,rows=run_models(out)
    for s in runs:
        contacts=[(x['carrier'],round(x['time'],6)) for x in s.events if x['event']=='contact']
        ledger=s.ledger();E=s.start_ledger['energy'];P=s.start_ledger['momentum']
        print('external',s.with_exterior,'contacts',contacts,'receiver_v',round(s.bodies['receiver'].v,8),
              'E_err',round(ledger['energy']-E,13),'P_err',round(ledger['momentum']-P,13))
    print('Synthetic benchmark:',out)

if __name__=='__main__':main()
