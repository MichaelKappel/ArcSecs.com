"""Tests of algebraic equations quoted in book Chapter 30E / Appendix K.
All parameters synthetic and unit-normalized: not an astrophysical fit."""
import unittest
import math


def c(a,b,psi):
    return math.exp(-0.5*(a+b)*psi)


def impedance(a,b,psi):
    return math.exp(0.5*(b-a)*psi)


def alpha(a,b,psi):
    return math.exp(0.5*(b-a)*psi)


def atomic(a,psi):
    return math.exp(-2*a*psi)


def zfactor(a,b,dpsi):
    return math.exp(0.5*(b-3*a)*dpsi)


def travel_distance(v_a,Gamma,delta_t):
    return v_a*math.expm1(Gamma*delta_t)/Gamma


class ScreenedFieldBookTests(unittest.TestCase):
    def test_coulomb_and_propagation_composition(self):
        for a,b,dpsi in [(0,2,.1),(1,1,.1),(1,3,.1),(-.1,1,.4)]:
            direct = atomic(a,dpsi)/c(a,b,dpsi) # psi_e=0, psi_a=dpsi
            self.assertAlmostEqual(zfactor(a,b,dpsi),direct,places=12)

    def test_matching_impedance_not_speed(self):
        self.assertAlmostEqual(impedance(1,1,.2),1.0)
        self.assertLess(c(1,1,.2),1.0)
        self.assertAlmostEqual(alpha(1,1,.2),1.0)

    def test_constant_speed_not_impedance(self):
        self.assertAlmostEqual(c(1,-1,.3),1.0)
        self.assertNotAlmostEqual(impedance(1,-1,.3),1.0)

    def test_positive_redshift_magnetic_branch(self):
        self.assertGreater(zfactor(0,2,.1),1)

    def test_blueshift_matched_branch(self):
        self.assertLess(zfactor(1,1,.1),1)

    def test_cancellation_branch_only_spectroscopy(self):
        self.assertAlmostEqual(zfactor(1,3,.1),1)
        self.assertNotAlmostEqual(alpha(1,3,.1),1)

    def test_distance_integral(self):
        g=.2;v=1.;dt=1.
        n=100000
        step=dt/n
        num=sum(v*math.exp(-g*((j+.5)*step-dt))*step for j in range(n))
        self.assertAlmostEqual(travel_distance(v,g,dt),num,places=9)
        self.assertNotAlmostEqual(travel_distance(v,g,dt),(1-math.exp(-g*dt))/g)

    def test_arrival_stretch(self):
        self.assertAlmostEqual(c(0,2,0)/c(0,2,.1),math.exp(.1))

    def test_twelve_foundations_retained(self):
        from pathlib import Path
        t=(Path(__file__).resolve().parents[1]/'book'/'book.md').read_text()
        charter=t.split('# The Twelve ArcSecs Foundations',1)[1].split('## Research translation',1)[0]
        for i in range(1,13):
            self.assertIn(f'{i}. **',charter)
        self.assertIn('11. **The age of the universe is unknown.**',charter)
        self.assertIn('# Chapter 30E.',t)
        self.assertIn('# Appendix K',t)

if __name__ == '__main__': unittest.main()
