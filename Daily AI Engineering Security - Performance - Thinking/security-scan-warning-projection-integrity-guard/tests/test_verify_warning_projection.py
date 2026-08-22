#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/"scripts"/"verify_warning_projection.py"

def run(canonical, projection):
    with tempfile.TemporaryDirectory() as d:
        d=Path(d); c=d/"c.json"; p=d/"p.json"
        c.write_text(json.dumps(canonical)); p.write_text(json.dumps(projection))
        return subprocess.run([sys.executable,str(SCRIPT),str(c),str(p)],capture_output=True,text=True)

def main():
    w={"code":"TARGET_DRIFT","target":"repo-a","message":"target changed during scan","level":"warning"}
    ok=run({"warnings":[w]},{"warnings":[w]})
    assert ok.returncode==0, ok.stderr+ok.stdout
    missing=run({"warnings":[w]},{"warnings":[]})
    assert missing.returncode==3, missing.stderr+missing.stdout
    clean=run({"warnings":[]},{"warnings":[]})
    assert clean.returncode==0, clean.stderr+clean.stdout
    sarif={"version":"2.1.0","runs":[{"invocations":[{"toolExecutionNotifications":[w]}]}]}
    sarif_ok=run({"warnings":[w]},sarif)
    assert sarif_ok.returncode==0, sarif_ok.stderr+sarif_ok.stdout
    print("4 projection-integrity cases passed")

if __name__=="__main__": main()
