#!/usr/bin/env python3
from pathlib import Path
import re, sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
required_dirs = ["skills","rules","subagents","workflows","hooks","scripts","knowledge"]
required_files = ["README.md","rules/operating-rules.md","hooks/lifecycle-hooks.md","scripts/validate-task-contract.py"]
errors=[]
for d in required_dirs:
    if not (root/d).is_dir(): errors.append(f"missing dir: {d}")
for f in required_files:
    if not (root/f).is_file(): errors.append(f"missing file: {f}")
link_re = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
for md in root.rglob("*.md"):
    text=md.read_text(encoding="utf-8")
    for target in link_re.findall(text):
        if "://" in target or target.startswith("#"): continue
        clean=target.split("#",1)[0]
        if clean and not (md.parent/clean).resolve().exists(): errors.append(f"broken link: {md.relative_to(root)} -> {target}")
if errors:
    for e in errors: print("ERROR:",e,file=sys.stderr)
    raise SystemExit(1)
print("VALID")
