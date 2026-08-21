#!/usr/bin/env python3
import argparse, fnmatch, hashlib, json
from pathlib import Path


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception as exc:
        raise SystemExit(f'ERROR: cannot read JSON {path}: {exc}')


def match_files(root: Path, pattern: str):
    if '*' in pattern or '?' in pattern or '[' in pattern:
        for p in root.rglob('*'):
            if p.is_file() and fnmatch.fnmatch(p.relative_to(root).as_posix(), pattern):
                yield p
    else:
        for p in root.rglob(Path(pattern).name):
            if p.is_file() and p.relative_to(root).as_posix().endswith(pattern):
                yield p


def scope_for(root: Path, path: Path) -> str:
    rel_parent = path.parent.relative_to(root).as_posix()
    return '.' if rel_parent == '.' else rel_parent


def applies(scope: str, target: str) -> bool:
    if scope == '.':
        return True
    target = target.strip('/')
    return target == scope or target.startswith(scope.rstrip('/') + '/')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', required=True)
    ap.add_argument('--policy', required=True)
    ap.add_argument('--targets', nargs='+', required=True)
    ap.add_argument('--out', required=True)
    args = ap.parse_args()

    root = Path(args.root).resolve()
    if not root.is_dir():
        raise SystemExit('ERROR: --root must be a directory')
    policy = load_json(Path(args.policy))
    entries = policy.get('instruction_files')
    if not isinstance(entries, list) or not entries:
        raise SystemExit('ERROR: policy instruction_files missing')

    found = []
    seen = set()
    for entry in entries:
        pattern = entry.get('pattern')
        if not pattern:
            raise SystemExit('ERROR: policy entry missing pattern')
        for path in match_files(root, pattern):
            rel = path.relative_to(root).as_posix()
            if rel in seen:
                continue
            scope = scope_for(root, path)
            if not any(applies(scope, t) for t in args.targets):
                continue
            try:
                digest = sha256(path)
                path.read_text(encoding='utf-8')
            except Exception as exc:
                raise SystemExit(f'ERROR: applicable instruction unreadable: {rel}: {exc}')
            seen.add(rel)
            found.append({
                'id': f'src-{len(found)+1}',
                'path': rel,
                'source_type': entry.get('source_type', 'unknown'),
                'authority': int(entry.get('authority', 0)),
                'scope': scope,
                'sha256': digest,
                'inherits_to_descendants': bool(entry.get('inherits_to_descendants', True))
            })

    found.sort(key=lambda x: (-x['authority'], x['path']))
    out = {'root': str(root), 'targets': args.targets, 'sources': found}
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(out, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'status': 'ok', 'source_count': len(found), 'out': str(out_path)}))


if __name__ == '__main__':
    main()
