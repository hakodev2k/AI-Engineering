#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path
SCRIPT = Path(__file__).parents[1] / "scripts" / "large_change_profiler.py"

def run(*args):
    return subprocess.run([sys.executable, str(SCRIPT), *map(str,args)], text=True, capture_output=True)

def main():
    with tempfile.TemporaryDirectory() as td:
        root=Path(td); (root/"small.txt").write_bytes(b"x"*10); (root/"large.txt").write_bytes(b"x"*200)
        p=run("--repo",root,"--max-file-bytes",100)
        assert p.returncode==2 and "large.txt" in p.stdout
        p=run("--repo",root,"--max-file-bytes",1000)
        assert p.returncode==0
        hist=root/"h.jsonl"
        with hist.open("wb") as f:
            f.write((json.dumps({"x":"a"*10})+"\n").encode())
            f.write((json.dumps({"x":"a"*300})+"\n").encode())
        p=run("--jsonl",hist,"--max-record-bytes",100)
        assert p.returncode==2 and "history_record_budget" in p.stdout
        p=run("--jsonl",hist,"--max-record-bytes",1000)
        assert p.returncode==0
    print("ok")
    return 0
if __name__=="__main__": raise SystemExit(main())
