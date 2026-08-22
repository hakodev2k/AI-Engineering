#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path

TEXT_EXTS = {'.cs', '.py', '.js', '.ts', '.tsx', '.java', '.go', '.rs', '.kt', '.fs', '.vb', '.json', '.yaml', '.yml'}
PATTERNS = [
    ('infinite_timeout', 5, re.compile(r'InfiniteTimeSpan|Timeout\.Infinite|timeout\s*[:=]\s*(?:0|-1|None|null)', re.I)),
    ('blocking_wait_in_async_path', 3, re.compile(r'\.Result\b|\.Wait\s*\(|GetAwaiter\(\)\.GetResult\(\)', re.I)),
    ('missing_cancellation', 3, re.compile(r'HttpClient\.(?:Get|Post|Put|Delete|Send)Async\s*\([^\n;]*\)', re.I)),
    ('hardcoded_timeout_without_budget', 3, re.compile(r'Timeout\s*=\s*TimeSpan\.(?:FromMilliseconds|FromSeconds|FromMinutes)\s*\(|timeout\s*[:=]\s*\d+', re.I)),
    ('retry_without_deadline', 4, re.compile(r'(?:retry|retries|attempts).{0,120}(?:while\s*\(|for\s*\(|Policy\.|WaitAndRetry|RetryAsync)', re.I | re.S)),
    ('swallowed_timeout_or_cancellation', 5, re.compile(r'catch\s*\(\s*(?:TaskCanceledException|OperationCanceledException|TimeoutException)[^)]*\)\s*\{\s*(?:\}|return\s*;)', re.I | re.S)),
]

SKIP_DIRS = {'.git', 'node_modules', 'bin', 'obj', 'dist', 'build', '.venv', 'venv'}


def scan_file(path: Path):
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except OSError:
        return []
    findings = []
    for kind, weight, pattern in PATTERNS:
        for match in pattern.finditer(text):
            line = text.count('\n', 0, match.start()) + 1
            snippet = ' '.join(match.group(0).split())[:220]
            findings.append({
                'type': kind,
                'weight': weight,
                'file': str(path),
                'line': line,
                'evidence': snippet,
            })
    return findings


def main():
    parser = argparse.ArgumentParser(description='Scan source for timeout-budget propagation risks.')
    parser.add_argument('root', nargs='?', default='.', help='Repository or source root')
    parser.add_argument('--json', action='store_true', help='Emit JSON')
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists() or not root.is_dir():
        raise SystemExit(f'error: directory not found: {root}')

    findings = []
    for path in root.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTS:
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        findings.extend(scan_file(path))

    score = sum(item['weight'] for item in findings)
    result = {'root': str(root), 'score': score, 'finding_count': len(findings), 'findings': findings}
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(f'timeout-risk score={score} findings={len(findings)}')
        for item in findings:
            print(f"[{item['weight']}] {item['type']} {item['file']}:{item['line']} :: {item['evidence']}")

    raise SystemExit(2 if score >= 6 else 1 if score >= 3 else 0)


if __name__ == '__main__':
    main()
