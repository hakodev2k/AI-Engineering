#!/usr/bin/env python3
import argparse, fnmatch, json, sys
from pathlib import Path

def load(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def matches(path, globs):
    p = path.replace('\\', '/')
    return any(fnmatch.fnmatch(p, g) or fnmatch.fnmatch('/'+p, g) for g in globs)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--manifest', required=True)
    ap.add_argument('--policy', required=True)
    args = ap.parse_args()
    m, p = load(args.manifest), load(args.policy)
    errors = []
    for key in ('task_id','head','items'):
        if key not in m: errors.append(f'missing {key}')
    seen=set()
    for i,item in enumerate(m.get('items', [])):
        path=item.get('path','')
        cls=item.get('classification')
        if not path: errors.append(f'items[{i}]: missing path'); continue
        if path in seen: errors.append(f'duplicate path: {path}')
        seen.add(path)
        if cls not in p['classifications']: errors.append(f'{path}: invalid classification {cls}')
        if not item.get('evidence'): errors.append(f'{path}: missing evidence')
        if matches(path, p.get('protected_globs', [])) and cls == 'source':
            errors.append(f'{path}: protected glob cannot be classified source without policy change')
        if cls in p.get('require_source_for', []) and not item.get('source_path'):
            errors.append(f'{path}: missing source_path')
        if cls in p.get('require_regenerator_for', []) and not item.get('generator_command'):
            errors.append(f'{path}: missing generator_command')
        if cls == 'unknown' and p.get('fail_closed_on_unknown', True):
            errors.append(f'{path}: unknown ownership blocks editing')
    if errors:
        for e in errors: print(e, file=sys.stderr)
        return 2
    print(json.dumps({'status':'valid','items':len(m.get('items',[]))}))
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
