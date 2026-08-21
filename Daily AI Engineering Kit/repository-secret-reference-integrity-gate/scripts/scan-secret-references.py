#!/usr/bin/env python3
import argparse, fnmatch, hashlib, json, os, re, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path


def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def git_head(repo):
    try:
        return subprocess.check_output(['git', '-C', repo, 'rev-parse', 'HEAD'], text=True, stderr=subprocess.DEVNULL).strip()
    except Exception:
        return 'unknown-head'


def rel_matches(path, patterns):
    p = path.replace(os.sep, '/')
    return any(fnmatch.fnmatch(p, pat) for pat in patterns)


def looks_secret(name, hints):
    upper = name.upper()
    return any(h in upper for h in hints)


def main():
    ap = argparse.ArgumentParser(description='Scan repository for secret references without reading secret values.')
    ap.add_argument('--repo', default='.')
    ap.add_argument('--policy', required=True)
    ap.add_argument('--contracts', help='JSON file containing a contracts array; values must not be included.')
    ap.add_argument('--output', required=True)
    ap.add_argument('--repository-name', default='local-repository')
    args = ap.parse_args()

    policy = load_json(args.policy)
    contracts = []
    if args.contracts:
        raw = load_json(args.contracts)
        contracts = raw.get('contracts', raw if isinstance(raw, list) else [])
        if not isinstance(contracts, list):
            print('contracts input must be an array or object with contracts array', file=sys.stderr); return 2

    scan = policy['scan']
    compiled = []
    for item in policy['reference_patterns']:
        try:
            compiled.append((item, re.compile(item['regex'])))
        except re.error as e:
            print(f"invalid regex {item.get('id')}: {e}", file=sys.stderr); return 2

    root = Path(args.repo).resolve()
    refs = []
    max_bytes = int(scan.get('max_file_bytes', 1048576))
    for file in root.rglob('*'):
        if not file.is_file():
            continue
        rel = file.relative_to(root).as_posix()
        if rel_matches(rel, scan.get('exclude_globs', [])):
            continue
        if not rel_matches(rel, scan.get('include_globs', ['**/*'])):
            continue
        try:
            if file.stat().st_size > max_bytes:
                continue
            text = file.read_text(encoding='utf-8')
        except (UnicodeDecodeError, OSError):
            continue
        for line_no, line in enumerate(text.splitlines(), 1):
            for rule, regex in compiled:
                for m in regex.finditer(line):
                    try:
                        name = m.group(int(rule.get('name_group', 1)))
                    except (IndexError, ValueError):
                        continue
                    if rule['id'].startswith('env-') and not looks_secret(name, policy.get('secret_name_hints', [])):
                        continue
                    refs.append({
                        'name': name,
                        'path': rel,
                        'line': line_no,
                        'pattern_id': rule['id'],
                        'context': rule.get('context', 'unknown')
                    })

    refs.sort(key=lambda x: (x['name'], x['path'], x['line'], x['pattern_id']))
    inventory = {
        'inventory_version': '1.0',
        'repository': args.repository_name,
        'head': git_head(str(root)),
        'generated_at': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
        'contracts': contracts,
        'references': refs
    }
    canonical = json.dumps(inventory, sort_keys=True, separators=(',', ':')).encode()
    fingerprint = hashlib.sha256(canonical).hexdigest()
    out = {'inventory': inventory, 'inventory_fingerprint': fingerprint}
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=2, sort_keys=True)
        f.write('\n')
    print(json.dumps({'status':'ok','references':len(refs),'inventory_fingerprint':fingerprint}))
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
