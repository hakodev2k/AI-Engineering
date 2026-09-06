#!/usr/bin/env python3
import subprocess, sys, tempfile
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "unicode_input_guard.py"

def run(text, strip=False):
    with tempfile.TemporaryDirectory() as d:
        d=Path(d); inp=d/"in.txt"; out=d/"out.txt"
        inp.write_text(text, encoding="utf-8")
        cmd=[sys.executable,str(SCRIPT),str(inp)]
        if strip: cmd += ["--strip-risky","--output",str(out)]
        p=subprocess.run(cmd,capture_output=True,text=True)
        return p, out.read_text(encoding="utf-8") if out.exists() else None

clean,_=run("Xin chào — normal multilingual text")
assert clean.returncode == 0, clean.stdout + clean.stderr

tag=chr(0xE0020)
risky,canonical=run("fun"+tag+"ding", True)
assert risky.returncode == 2 and "U+E0020" in risky.stdout, risky.stdout
assert canonical == "funding", repr(canonical)
zw=chr(0x2062)+chr(0x2064)
risky2,_=run("safe"+zw+"text")
assert risky2.returncode == 2 and "U+2062" in risky2.stdout and "U+2064" in risky2.stdout, risky2.stdout
print("ok")
