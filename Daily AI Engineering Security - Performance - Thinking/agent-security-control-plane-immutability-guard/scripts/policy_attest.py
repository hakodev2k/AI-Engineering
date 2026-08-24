#!/usr/bin/env python3
"""Dependency-free security control-plane hash attestation."""
import argparse, hashlib, json, os, sys
from pathlib import Path


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def load_json(path: Path):
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)


def collect(root: Path, cfg: dict):
    items = {}
    errors = []
    files = cfg.get('protected_files')
    if not isinstance(files, list):
        raise ValueError('protected_files must be a list')
    for entry in files:
        if not isinstance(entry, dict) or not isinstance(entry.get('path'), str):
            raise ValueError('each protected_files entry requires string path')
        rel = entry['path']
        p = (root / rel)
        required = bool(entry.get('required', False))
        if p.exists() and p.is_file():
            try:
                items[rel] = {'present': True, 'sha256': sha256_file(p), 'required': required}
            except OSError as e:
                errors.append({'path': rel, 'reason': f'read-error: {e}'})
        elif p.exists():
            errors.append({'path': rel, 'reason': 'protected-path-not-regular-file'})
            items[rel] = {'present': True, 'sha256': None, 'required': required}
        else:
            items[rel] = {'present': False, 'sha256': None, 'required': required}
    return items, errors


def verify(current, baseline):
    findings = []
    base_items = baseline.get('files', {})
    for rel, cur in current.items():
        old = base_items.get(rel)
        if cur['required'] and not cur['present']:
            findings.append({'path': rel, 'reason': 'required-file-missing'})
            continue
        if old is None:
            if cur['present']:
                findings.append({'path': rel, 'reason': 'new-protected-file', 'current_sha256': cur['sha256']})
            continue
        if bool(old.get('present')) != cur['present']:
            findings.append({'path': rel, 'reason': 'presence-changed', 'baseline': old, 'current': cur})
        elif cur['present'] and old.get('sha256') != cur['sha256']:
            findings.append({'path': rel, 'reason': 'hash-changed', 'baseline_sha256': old.get('sha256'), 'current_sha256': cur['sha256']})
    for rel in base_items:
        if rel not in current:
            findings.append({'path': rel, 'reason': 'baseline-entry-removed-from-policy-inventory'})
    return findings


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', required=True)
    ap.add_argument('--config', required=True)
    ap.add_argument('--state', required=True)
    ap.add_argument('--record', action='store_true', help='explicitly create/replace approved baseline')
    args = ap.parse_args()
    try:
        root = Path(args.root).resolve(strict=True)
        if not root.is_dir():
            raise ValueError('root must be a directory')
        cfg = load_json(Path(args.config))
        current, errors = collect(root, cfg)
        if errors:
            print(json.dumps({'status':'error','errors':errors}, indent=2))
            return 3
        state_path = Path(args.state)
        if args.record:
            state = {'version': 1, 'root': str(root), 'files': current}
            try:
                state_path.parent.mkdir(parents=True, exist_ok=True)
                tmp = state_path.with_suffix(state_path.suffix + '.tmp')
                tmp.write_text(json.dumps(state, indent=2, sort_keys=True) + '\n', encoding='utf-8')
                os.replace(tmp, state_path)
            except OSError as e:
                print(json.dumps({'status':'error','reason':f'baseline-write-failed: {e}'}))
                return 4
            print(json.dumps({'status':'recorded','state':str(state_path),'files':current}, indent=2))
            return 0
        if not state_path.exists():
            print(json.dumps({'status':'drift','reason':'baseline-missing'}))
            return 2
        baseline = load_json(state_path)
        if baseline.get('root') != str(root):
            print(json.dumps({'status':'drift','reason':'root-mismatch','baseline_root':baseline.get('root'),'current_root':str(root)}, indent=2))
            return 2
        findings = verify(current, baseline)
        status = 'verified' if not findings else 'drift'
        print(json.dumps({'status':status,'findings':findings,'files':current}, indent=2))
        return 0 if not findings else 2
    except (OSError, ValueError, json.JSONDecodeError) as e:
        print(json.dumps({'status':'error','reason':str(e)}))
        return 3

if __name__ == '__main__':
    sys.exit(main())
