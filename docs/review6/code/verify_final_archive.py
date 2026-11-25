"""Verify release manifest from project root (standard library only)."""
from pathlib import Path
import hashlib, sys
ROOT=Path(__file__).resolve().parents[1]
def verify():
    count=0; bad=[]
    for line in (ROOT/'SHA256SUMS.txt').read_text(encoding='utf-8').splitlines():
        expected,name=line.split(maxsplit=1); p=ROOT/name
        if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest()!=expected: bad.append(name)
        count+=1
    if bad: raise SystemExit('MISSING OR WRONG HASH:\n'+'\n'.join(bad))
    print(f'PASS: {count} manifest files verified.')
if __name__=='__main__': verify()
