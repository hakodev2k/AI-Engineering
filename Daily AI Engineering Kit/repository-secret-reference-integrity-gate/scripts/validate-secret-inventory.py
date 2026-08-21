#!/usr/bin/env python3
import argparse, hashlib, json, sys

ALLOWED_SOURCE_KINDS = {'github-actions-secret','environment','key-vault','secret-manager','ci-variable','manual-runtime','unknown'}
ALLOWED_SCOPES = {'local','development','test','staging','production','shared'}


def canonical_inventory(inv):
    return json.dumps(inv, sort_keys=True, separators=(',', ':')).encode()


def main():
    ap = argparse.ArgumentParser(description='Validate secret-reference inventory and contract integrity without secret values.')
    ap.add_argument('--inventory', required=True)
    ap.add_argument('--policy', required=True)
    ap.add_argument('--output')
    args = ap.parse_args()
    try:
        with open(args.inventory, encoding='utf-8') as f:
            payload = json.load(f)
        with open(args.policy, encoding='utf-8') as f:
            policy = json.load(f)
    except Exception as e:
        print(f'input error: {e}', file=sys.stderr); return 2

    inv = payload.get('inventory', payload)
    supplied_fp = payload.get('inventory_fingerprint')
    errors, warnings = [], []
    for field in ('inventory_version','repository','head','generated_at','contracts','references'):
        if field not in inv: errors.append(f'missing field: {field}')
    if errors:
        print(json.dumps({'status':'blocked','errors':errors,'warnings':warnings})); return 2

    computed_fp = hashlib.sha256(canonical_inventory(inv)).hexdigest()
    if supplied_fp and supplied_fp != computed_fp:
        errors.append('inventory fingerprint mismatch')

    contracts, aliases = {}, {}
    for idx, c in enumerate(inv['contracts']):
        if not isinstance(c, dict): errors.append(f'contract[{idx}] must be object'); continue
        name = c.get('name')
        if not name: errors.append(f'contract[{idx}] missing name'); continue
        if name in contracts and contracts[name] != c: errors.append(f'conflicting duplicate contract: {name}')
        contracts[name] = c
        if c.get('source_kind') not in ALLOWED_SOURCE_KINDS: errors.append(f'{name}: unsupported source_kind')
        if c.get('scope') not in ALLOWED_SCOPES: errors.append(f'{name}: unsupported scope')
        if not isinstance(c.get('required'), bool): errors.append(f'{name}: required must be boolean')
        if not c.get('consumers'): errors.append(f'{name}: at least one consumer is required')
        for alias in c.get('aliases', []):
            if alias in aliases and aliases[alias] != name: errors.append(f'alias {alias} maps to multiple contracts')
            aliases[alias] = name

    referenced_names, unknown_refs, alias_refs = set(), set(), set()
    for r in inv['references']:
        if not isinstance(r, dict) or not all(k in r for k in ('name','path','line','pattern_id','context')):
            errors.append('malformed reference record'); continue
        n = r['name']; referenced_names.add(n)
        if n in aliases: alias_refs.add(n)
        elif n not in contracts: unknown_refs.add(n)

    gate = policy.get('gate', {})
    if unknown_refs and gate.get('block_on_unknown_reference', True):
        errors.append('unknown references: ' + ', '.join(sorted(unknown_refs)))
    if alias_refs and gate.get('review_required_for_alias', True):
        warnings.append('alias references require review: ' + ', '.join(sorted(alias_refs)))

    for name, c in contracts.items():
        used = name in referenced_names or any(a in referenced_names for a in c.get('aliases', []))
        if c.get('required') and c.get('source_kind') == 'unknown' and gate.get('block_on_required_without_source', True):
            errors.append(f'{name}: required contract has unknown source')
        if not used and gate.get('block_on_source_without_consumer', False): errors.append(f'{name}: contract declared but no repository reference found')
        elif not used: warnings.append(f'{name}: declared contract has no scanned reference')

    status = 'blocked' if errors else ('review-required' if warnings else 'verified')
    result = {'status':status,'inventory_fingerprint':computed_fp,'errors':errors,'warnings':warnings,'unknown_references':sorted(unknown_refs),'alias_references':sorted(alias_refs),'contract_count':len(contracts),'reference_count':len(inv['references'])}
    if args.output:
        with open(args.output,'w',encoding='utf-8') as f:
            json.dump(result,f,indent=2,sort_keys=True); f.write('\n')
    print(json.dumps(result, sort_keys=True))
    return 2 if errors else (3 if warnings else 0)

if __name__ == '__main__':
    raise SystemExit(main())
