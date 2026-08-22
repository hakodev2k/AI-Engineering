#!/usr/bin/env python3
from pathlib import Path
import re, sys

ROOT=Path(__file__).resolve().parents[1]
REQUIRED_DIRS=["skills","rules","subagents","workflows","hooks","scripts","knowledge","templates","checklists","config","schemas","examples","metrics"]
REQUIRED_FILES=["README.md","rules/operating-rules.md","hooks/lifecycle-hooks.md","checklists/definition-of-done.md","config/role-config.yaml","schemas/database-change.schema.json","examples/database-change.example.json"]

def main():
    errors=[]
    for d in REQUIRED_DIRS:
        if not (ROOT/d).is_dir(): errors.append(f"missing directory: {d}")
    for f in REQUIRED_FILES:
        if not (ROOT/f).is_file(): errors.append(f"missing file: {f}")
    link_re=re.compile(r"\[[^\]]+\]\(([^)]+)\)")
    for md in ROOT.rglob("*.md"):
        text=md.read_text(encoding="utf-8")
        for target in link_re.findall(text):
            if "://" in target or target.startswith("#"): continue
            p=(md.parent/target.split("#",1)[0]).resolve()
            if not p.exists(): errors.append(f"broken link: {md.relative_to(ROOT)} -> {target}")
    for script in (ROOT/"scripts").glob("*.py"):
        if not script.read_text(encoding="utf-8").startswith("#!/usr/bin/env python3"):
            errors.append(f"missing python shebang: {script.name}")
    if errors:
        for e in errors: print("ERROR:",e,file=sys.stderr)
        return 2
    print("OK: package structure and relative Markdown links are valid")
    return 0

if __name__ == "__main__": raise SystemExit(main())
