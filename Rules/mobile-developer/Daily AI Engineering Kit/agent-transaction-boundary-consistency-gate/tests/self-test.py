#!/usr/bin/env python3
import json, pathlib, subprocess, sys, tempfile
ROOT = pathlib.Path(__file__).resolve().parents[1]
SCAN = ROOT / "scripts" / "scan-transaction-risk.py"
VALIDATE = ROOT / "scripts" / "validate-assessment.py"
SAMPLE = ROOT / "examples" / "sample-assessment.json"

def run(args):
    return subprocess.run([sys.executable, *map(str,args)], capture_output=True, text=True)

def main():
    ok = run([VALIDATE, SAMPLE])
    assert ok.returncode == 0, ok.stderr
    with tempfile.TemporaryDirectory() as td:
        p = pathlib.Path(td) / "Handler.cs"
        p.write_text('using var tx = db.Database.BeginTransaction();\nawait http.SendAsync(req);\nawait db.SaveChangesAsync();\ntx.Commit();\n', encoding='utf-8')
        scan = run([SCAN, td, "--json", "--fail-on-risk"])
        assert scan.returncode == 2, scan.stdout + scan.stderr
        payload=json.loads(scan.stdout)
        assert payload["riskCount"] >= 1
    bad = json.loads(SAMPLE.read_text(encoding="utf-8"))
    bad["status"]="pass"; bad["verification"]["testsPassed"]=False
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump(bad,f); name=f.name
    invalid=run([VALIDATE,name])
    pathlib.Path(name).unlink(missing_ok=True)
    assert invalid.returncode == 2
    print("SELF-TEST PASS")
    return 0

if __name__ == "__main__": raise SystemExit(main())
