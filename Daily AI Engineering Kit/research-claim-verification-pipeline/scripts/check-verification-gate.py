#!/usr/bin/env python3
import argparse, json, subprocess, sys
from pathlib import Path

def main():
    p=argparse.ArgumentParser(); p.add_argument("matrix"); a=p.parse_args()
    matrix=Path(a.matrix)
    validator=Path(__file__).with_name("validate-claim-matrix.py")
    r=subprocess.run([sys.executable,str(validator),str(matrix)])
    if r.returncode: return r.returncode
    data=json.loads(matrix.read_text(encoding="utf-8"))
    reviewer=data.get("reviewer",{})
    if reviewer.get("status") != "pass":
        print("BLOCKED: independent reviewer status is not pass", file=sys.stderr); return 3
    blockers=[]; provisional=[]
    for c in data["claims"]:
        if c.get("status")=="blocked": blockers.append(c["id"])
        if c.get("status") in {"unresolved","provisional"}: provisional.append(c["id"])
        if c.get("impact")=="high" and c.get("status")!="verified": blockers.append(c["id"])
    if blockers:
        print("BLOCKED: " + ", ".join(sorted(set(blockers))), file=sys.stderr); return 4
    if provisional:
        print("PARTIALLY-VERIFIED: " + ", ".join(provisional)); return 5
    print("VERIFIED: all claims pass the gate"); return 0
if __name__=="__main__": raise SystemExit(main())