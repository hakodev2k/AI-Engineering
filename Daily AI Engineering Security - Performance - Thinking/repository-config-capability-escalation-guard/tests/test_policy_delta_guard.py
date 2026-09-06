#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path
SCRIPT=Path(__file__).resolve().parents[1]/"scripts"/"policy_delta_guard.py"

def run(base,cand):
    with tempfile.TemporaryDirectory() as d:
        b=Path(d)/"b.json"; c=Path(d)/"c.json"
        b.write_text(json.dumps(base)); c.write_text(json.dumps(cand))
        p=subprocess.run([sys.executable,str(SCRIPT),"--baseline",str(b),"--candidate",str(c),"--repository","test/repo"],capture_output=True,text=True)
        return p.returncode,json.loads(p.stdout)

def main():
    rc,o=run({"allow_shell":False,"approval_policy":"always"},{"allow_shell":True,"approval_policy":"always"})
    assert rc==3 and o["decision"]=="BLOCK"
    rc,o=run({"allow_shell":False,"sandbox_mode":"workspace"},{"allow_shell":False,"sandbox_mode":"read-only"})
    assert rc==0 and o["decision"]=="ALLOW"
    rc,o=run({"allow_shell":False},{"mystery_exec_mode":"fast"})
    assert rc==3 and o["blocked_deltas"][0]["classification"]=="unknown"
    print("3 policy delta tests passed")
if __name__=="__main__": main()
