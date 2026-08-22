#!/usr/bin/env python3
import argparse, json, pathlib, re, sys

EXTENSIONS = {'.cs', '.py', '.js', '.ts', '.java', '.go'}
PATTERNS = {
    'cache_miss_direct_backend_call': re.compile(r'(cache\.(get|tryget|getasync)|TryGetValue).*?(if\s*\(!|==\s*null|is\s+null).*?(http|db|repository|client|fetch|query|load)', re.I | re.S),
    'fixed_ttl_without_jitter': re.compile(r'(absoluteexpiration|slidingexpiration|ttl|expire).*?\b(30|60|120|300|600|900|1800|3600)\b', re.I),
    'global_cache_flush': re.compile(r'(flushall|flushdb|clear\s*\(|removeall|invalidateall)', re.I),
    'unbounded_parallel_regeneration': re.compile(r'(Task\.WhenAll|Promise\.all|Parallel\.ForEach|gather\().*?(cache|refresh|load|fetch)', re.I | re.S),
    'retry_loop_around_cache_fill': re.compile(r'(retry|while\s*\(|for\s*\().*?(cache.*?(set|put)|refresh)', re.I | re.S),
}

def main():
    parser = argparse.ArgumentParser(description='Heuristic cache stampede risk scanner')
    parser.add_argument('root', nargs='?', default='.')
    parser.add_argument('--output')
    args = parser.parse_args()
    root = pathlib.Path(args.root).resolve()
    if not root.is_dir():
        print('root must be a directory', file=sys.stderr)
        return 2
    findings = []
    for path in root.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in EXTENSIONS:
            continue
        if any(part in {'.git', 'node_modules', 'bin', 'obj', 'dist', 'build'} for part in path.parts):
            continue
        try:
            text = path.read_text(encoding='utf-8', errors='ignore')
        except OSError:
            continue
        for name, regex in PATTERNS.items():
            for match in regex.finditer(text):
                line = text.count('\n', 0, match.start()) + 1
                findings.append({
                    'pattern': name,
                    'path': str(path.relative_to(root)),
                    'line': line,
                    'evidence': match.group(0)[:220].replace('\n', ' ')
                })
    report = {
        'root': str(root),
        'finding_count': len(findings),
        'findings': findings,
        'note': 'Heuristic findings are hypotheses and require code/runtime evidence before classification.'
    }
    output = json.dumps(report, indent=2)
    if args.output:
        pathlib.Path(args.output).write_text(output + '\n', encoding='utf-8')
    else:
        print(output)
    return 1 if findings else 0

if __name__ == '__main__':
    raise SystemExit(main())
