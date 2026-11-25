#!/usr/bin/env python3
"""Print SHA-256 hashes of every tracked blob at a Git ref, not working-tree bytes."""
import argparse
import hashlib
import subprocess

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ref", nargs="?", default="HEAD")
    args = parser.parse_args()
    tree = subprocess.check_output(["git", "ls-tree", "-r", "-z", args.ref])
    for entry in tree.split(b"\0"):
        if not entry:
            continue
        metadata, path = entry.split(b"\t", 1)
        _, kind, oid = metadata.split()
        if kind != b"blob":
            continue
        data = subprocess.check_output(["git", "cat-file", "blob", oid.decode("ascii")])
        print(hashlib.sha256(data).hexdigest() + "  " + path.decode("utf-8"))

if __name__ == "__main__":
    main()
