#!/usr/bin/env python3
"""Self-contained regression test for analyze_lifecycle.py."""
from __future__ import annotations
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
ANALYZER=ROOT/"scripts"/"analyze_lifecycle.py"
THRESHOLDS=ROOT/"config"/"thresholds.json"


def write_jsonl(path:Path, duplicate:bool=False, dirty:bool=False):
    rows=[]
    for i in range(1,6002):
        sid="shared" if duplicate else f"s-{i}"
        rows.append({"request":i,"server_id":sid,"heap_used_mb":100.0+i*0.0002,"latency_ms":10.0+(i%7)*0.1,"ok":True})
    rows.append({"event":"teardown","clean":not dirty,"error":"RangeError" if dirty else None})
    path.write_text("\n".join(json.dumps(x) for x in rows)+"\n",encoding="utf-8")


def run(path:Path):
    return subprocess.run([sys.executable,str(ANALYZER),str(path),"--thresholds",str(THRESHOLDS),"--baseline-p95-ms","10.8"],capture_output=True,text=True,check=False)


def main():
    with tempfile.TemporaryDirectory() as td:
        td=Path(td)
        good=td/"good.jsonl"; write_jsonl(good)
        r=run(good)
        if r.returncode!=0: raise AssertionError(f"good fixture failed: {r.stdout} {r.stderr}")
        bad=td/"bad.jsonl"; write_jsonl(bad,duplicate=True,dirty=True)
        r=run(bad)
        if r.returncode!=3: raise AssertionError(f"bad fixture should block: {r.stdout} {r.stderr}")
        payload=json.loads(r.stdout)
        if payload["duplicate_server_instances"]<=0 or payload["clean_teardown"] is not False:
            raise AssertionError(f"bad fixture findings missing: {payload}")
    print("analyze_lifecycle tests passed")
    return 0

if __name__=="__main__": raise SystemExit(main())
