#!/usr/bin/env python3
import argparse
import json
import sys


def audit(doc, budget):
    sources = doc.get('sources')
    if not isinstance(sources, list):
        raise ValueError('sources must be a list')
    violations, refresh, exclude = [], [], []
    total = required_total = effective = 0
    for i, source in enumerate(sources):
        if not isinstance(source, dict):
            raise ValueError(f'source {i} must be object')
        name = str(source.get('name', f'source-{i}'))
        kind = str(source.get('kind', 'unknown'))
        tokens = source.get('tokens', 0)
        if not isinstance(tokens, int) or isinstance(tokens, bool) or tokens < 0:
            raise ValueError(f'{name}: tokens must be non-negative integer')
        required = bool(source.get('required', False))
        opted_in = bool(source.get('opted_in', False))
        captured = source.get('captured_at')
        current = source.get('current_mtime')
        total += tokens
        if required:
            required_total += tokens
        is_excluded = kind in {'memory', 'auto_memory'} and not required and not opted_in
        if is_excluded:
            violations.append({'source': name, 'index': i, 'code': 'optional_memory_not_opted_in', 'tokens': tokens})
            exclude.append(name)
        else:
            effective += tokens
        if required and captured is not None and current is not None:
            try:
                stale = float(current) > float(captured)
            except (TypeError, ValueError):
                raise ValueError(f'{name}: timestamps must be numeric epoch values')
            if stale:
                violations.append({'source': name, 'index': i, 'code': 'required_source_stale', 'tokens': tokens})
                refresh.append(name)
    if required_total > budget:
        violations.append({'source': '<required-total>', 'code': 'required_context_over_budget', 'tokens': required_total})
    elif effective > budget:
        violations.append({'source': '<payload>', 'code': 'payload_over_budget', 'tokens': effective})
    return {
        'allowed': not violations,
        'total_tokens': total,
        'effective_tokens_after_exclusions': effective,
        'required_tokens': required_total,
        'budget_tokens': budget,
        'exclude': exclude,
        'refresh': refresh,
        'violations': violations,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('snapshot')
    parser.add_argument('--budget-tokens', type=int, required=True)
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    if args.budget_tokens <= 0:
        parser.error('--budget-tokens must be > 0')
    try:
        with open(args.snapshot, encoding='utf-8') as handle:
            doc = json.load(handle)
        result = audit(doc, args.budget_tokens)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f'error: {exc}', file=sys.stderr)
        return 2
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        state = 'ALLOW' if result['allowed'] else 'BLOCK'
        print(f"{state} tokens={result['effective_tokens_after_exclusions']}/{result['budget_tokens']}")
    return 0 if result['allowed'] else 1


if __name__ == '__main__':
    raise SystemExit(main())