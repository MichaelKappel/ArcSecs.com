"""Rerun preserved independent implementation and compare against original case file."""
from pathlib import Path
import subprocess,sys,csv,hashlib,zipfile
ROOT=Path(__file__).resolve().parents[1]; a=ROOT/'historical/independent_audit'; out=ROOT/'appendices/audit_regression'
z=zipfile.ZipFile(a/'ARCSECS_INDEPENDENT_AUDIT(1).zip');assert z.testzip() is None
for line in z.read('SHA256SUMS.txt').decode().splitlines():
    h,n=line.split(maxsplit=1);assert hashlib.sha256(z.read(n.lstrip('*'))).hexdigest()==h
assert (out/'independent_checks.py').read_bytes()==z.read('independent_checks.py')
with (out/'rerun.log').open('w') as f:subprocess.run([sys.executable,str(out/'independent_checks.py')],cwd=out,stdout=f,check=True)
old={r['name']:r for r in csv.DictReader(open(a/'history_cases.csv'))};new={r['name']:r for r in csv.DictReader(open(out/'history_cases.csv'))};assert old.keys()==new.keys()
fields=['arrival_time','speed','retained','gap','heat','recoil','wall_recoil'];maxdiff=0
for n,r in new.items():
    assert all(r[k]==old[n][k] for k in ['status','reaccelerating','saturated']),n
    maxdiff=max(maxdiff,max(abs(float(r[k])-float(old[n][k])) for k in fields))
assert maxdiff<1e-7
result=f'{len(new)} case outcomes reproduced; max absolute endpoint difference {maxdiff:.12g} across {fields}. Same supplied independent implementation; not another independently designed experiment.\n';(out/'comparison.txt').write_text(result);print(result)
