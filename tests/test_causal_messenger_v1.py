"""R40: synthetic physical-carrier model mathematical checks."""
import math, sys, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools'))
from causal_messenger_v1 import Body, Carrier, Exchange, run_models

class FiniteSpeedMessengerTests(unittest.TestCase):
    def test_launch_keeps_total_momentum(self):
        s=Exchange(False)
        self.assertAlmostEqual(s.ledger()['momentum'],s.start_ledger['momentum'],places=13)
    def test_launch_spends_source_energy(self):
        s=Exchange(False)
        self.assertLess(s.bodies['internal_source'].reserve,2.)
        self.assertAlmostEqual(s.ledger()['energy'],s.start_ledger['energy'],places=13)
    def test_emitter_recoil_opposite_launch(self):
        s=Exchange(False)
        self.assertLess(s.bodies['internal_source'].v,0.)
        self.assertGreater(s.carriers['internal_packet'].v,0.)
    def test_no_receiver_response_before_first_contact(self):
        s=Exchange(False);s.run(end=4.5,checkpoints=(0,1,4.5))
        self.assertAlmostEqual(s.bodies['receiver'].v,0.,places=13)
    def test_internal_arrival_is_five_progression_units(self):
        s=Exchange(False);s.run()
        e=[e for e in s.events if e['event']=='contact']
        self.assertEqual(len(e),1)
        self.assertAlmostEqual(e[0]['time'],5.,places=10)
    def test_bubble_contact_is_delayed(self):
        s=Exchange(True);s.run()
        e=[e for e in s.events if e['event']=='contact']
        self.assertEqual(len(e),2)
        self.assertEqual(e[1]['carrier'],'exterior_packet')
        self.assertGreater(e[1]['time'],8.)
        self.assertLess(e[1]['time'],8.5)
    def test_bubble_does_not_preempt_internal_arrival(self):
        a=Exchange(False);ha=a.run(end=7.,checkpoints=(0,5.2,7.))
        b=Exchange(True);hb=b.run(end=7.,checkpoints=(0,5.2,7.))
        for x,y in zip(ha,hb):
            self.assertAlmostEqual(x['receiver_v'],y['receiver_v'],places=13)
            self.assertAlmostEqual(x['receiver_x'],y['receiver_x'],places=13)
    def test_energy_conservation_after_each_contact(self):
        for external in (False,True):
            s=Exchange(external);s.run()
            self.assertAlmostEqual(s.ledger()['energy'],s.start_ledger['energy'],places=12)
    def test_momentum_conservation_after_each_contact(self):
        for external in (False,True):
            s=Exchange(external);s.run()
            self.assertAlmostEqual(s.ledger()['momentum'],s.start_ledger['momentum'],places=12)
    def test_external_impact_changes_receiver(self):
        a=Exchange(False);a.run()
        b=Exchange(True);b.run()
        self.assertGreater(a.bodies['receiver'].v,b.bodies['receiver'].v)
        self.assertNotAlmostEqual(a.bodies['receiver'].v,b.bodies['receiver'].v,places=8)
    def test_incoming_packet_transfers_its_momentum_sign(self):
        s=Exchange(True);s.run()
        last=[e for e in s.events if e['event']=='contact'][-1]
        self.assertLess(last['receiver_velocity_after'],.25)
    def test_carrier_momentum_exists_during_flight(self):
        s=Exchange(False)
        self.assertNotEqual(s.ledger()['inflight_carrier_momentum'],0)
        self.assertNotEqual(s.ledger()['matter_momentum'],0)
        self.assertAlmostEqual(s.ledger()['matter_momentum']+s.ledger()['carrier_momentum'],s.ledger()['momentum'])
    def test_insufficient_reserve_refuses_launch(self):
        s=Exchange(False)
        c=s.carriers['exterior_packet']
        s.bodies[c.origin].reserve=0.
        with self.assertRaises(ValueError):s.launch('exterior_packet',-2.)
    def test_earliest_contact_depends_on_receiver_motion(self):
        a=Exchange(True);a.run()
        e=[x for x in a.events if x['event']=='contact']
        # External source is 18 units away and emits at speed -2.08.
        # If receiver remained fixed, arrival would be 18/2.08.
        self.assertLess(e[-1]['time'],18/2.08)
    def test_export_safe_report(self):
        p=ROOT/'docs/long-term-memory/reports/R40.md';s=p.read_text(encoding='utf-8')
        self.assertGreater(len(s.split()),3800)
        self.assertNotIn('```',s)
        self.assertNotIn('\\[',s)
        self.assertNotIn('data:image/',s)
        self.assertIn('interpretation-versus-observation checkpoint',s.lower())
        self.assertIn('UAIX navigation',s)
    def test_synthetic_outputs_are_clearly_labeled(self):
        p=ROOT/'docs/long-term-memory/research/causal-carrier-events.json'
        self.assertIn('Synthetic',p.read_text())
    def test_no_source_text_shortened(self):
        p=ROOT/'docs/long-term-memory/reports'
        self.assertEqual(len(list(p.glob('R??.md'))),41)

if __name__=='__main__':unittest.main()
