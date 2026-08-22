#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED_DIRS=['skills','rules','subagents','workflows','hooks','scripts','knowledge','templates','checklists','schemas','config']
REQUIRED_FILES=['README.md','rules/core-rules.md','hooks/lifecycle-hooks.md','checklists/definition-of-done.md']

def main():
    root=Path(sys.argv[1] if len(sys.argv)>1 else '.')
    missing=[]
    for d in REQUIRED_DIRS:
        if not (root/d).is_dir(): missing.append(d+'/')
    for f in REQUIRED_FILES:
        if not (root/f).is_file(): missing.append(f)
    if missing:
        print('package: FAIL\nmissing: '+', '.join(missing), file=sys.stderr); return 1
    md=list(root.rglob('*.md'))
    empty=[str(p.relative_to(root)) for p in md if not p.read_text(encoding='utf-8').strip()]
    if empty:
        print('package: FAIL\nempty markdown: '+', '.join(empty), file=sys.stderr); return 1
    print(f'package: PASS ({len(md)} markdown files)'); return 0

if __name__=='__main__': raise SystemExit(main())
