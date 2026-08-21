#!/usr/bin/env python3
import argparse, re, sys
from pathlib import Path

PATTERNS = [
    re.compile(r'(?i)authorization:\s*bearer\s+\S+'),
    re.compile(r'(?i)(password|passwd|secret|api[_-]?key)\s*[:=]\s*\S+'),
    re.compile(r'\b(?:\d[ -]*?){13,19}\b'),
]

def redact(text: str) -> str:
    for pattern in PATTERNS:
        text = pattern.sub('[REDACTED]', text)
    return text

def main() -> int:
    p = argparse.ArgumentParser(description='Redact common secrets from observability evidence.')
    p.add_argument('input')
    p.add_argument('output')
    args = p.parse_args()
    src, dst = Path(args.input), Path(args.output)
    if not src.is_file():
        print(f'input not found: {src}', file=sys.stderr); return 2
    if src.resolve() == dst.resolve():
        print('refusing in-place overwrite; preserve raw evidence separately', file=sys.stderr); return 3
    try:
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(redact(src.read_text(encoding='utf-8', errors='replace')), encoding='utf-8')
    except OSError as exc:
        print(f'I/O error: {exc}', file=sys.stderr); return 4
    print(dst)
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
