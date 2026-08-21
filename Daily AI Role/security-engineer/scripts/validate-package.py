#!/usr/bin/env python3
from pathlib import Path
import re, sys

REQUIRED_DIRS = ['skills','rules','subagents','workflows','hooks','scripts','knowledge']
REQUIRED_FILES = ['README.md','rules/operating-rules.md','hooks/lifecycle-hooks.md']

def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    errors=[]
    for d in REQUIRED_DIRS:
        if not (root/d).is_dir(): errors.append(f'missing directory: {d}')
    for f in REQUIRED_FILES:
        if not (root/f).is_file(): errors.append(f'missing file: {f}')
    for md in root.rglob('*.md'):
        text=md.read_text(encoding='utf-8')
        for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', text):
            if '://' in target or target.startswith('#'): continue
            p=(md.parent/target.split('#',1)[0]).resolve()
            if target and not p.exists(): errors.append(f'broken link: {md.relative_to(root)} -> {target}')
    if errors:
        for e in errors: print(e, file=sys.stderr)
        return 1
    print('package validation passed')
    return 0

if __name__ == '__main__': raise SystemExit(main())
