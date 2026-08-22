#!/usr/bin/env python3
import argparse
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print('ERROR: PyYAML is required. Install with: pip install pyyaml', file=sys.stderr)
    sys.exit(3)


def fail(message: str) -> int:
    print(f'INVALID: {message}', file=sys.stderr)
    return 2


def validate(policy: dict) -> int:
    if policy.get('version') != 1:
        return fail('version must be 1')
    resources = policy.get('resources')
    if not isinstance(resources, dict) or not resources:
        return fail('resources must be a non-empty mapping')
    for name, cfg in resources.items():
        if not isinstance(cfg, dict):
            return fail(f'resource {name} must be a mapping')
        required = ['max_concurrency','max_queue','queue_timeout_ms','execution_timeout_ms','retry_limit','failure_rate_open_threshold','minimum_samples','recovery_cooldown_seconds']
        missing = [k for k in required if k not in cfg]
        if missing:
            return fail(f'resource {name} missing: {", ".join(missing)}')
        if not isinstance(cfg['max_concurrency'], int) or cfg['max_concurrency'] <= 0:
            return fail(f'{name}.max_concurrency must be a positive integer')
        if not isinstance(cfg['max_queue'], int) or cfg['max_queue'] < 0:
            return fail(f'{name}.max_queue must be a non-negative integer')
        if not isinstance(cfg['queue_timeout_ms'], int) or cfg['queue_timeout_ms'] <= 0:
            return fail(f'{name}.queue_timeout_ms must be positive')
        if not isinstance(cfg['execution_timeout_ms'], int) or cfg['execution_timeout_ms'] <= 0:
            return fail(f'{name}.execution_timeout_ms must be positive')
        if cfg['queue_timeout_ms'] >= cfg['execution_timeout_ms']:
            return fail(f'{name}.queue_timeout_ms must be lower than execution_timeout_ms')
        if not isinstance(cfg['retry_limit'], int) or not 0 <= cfg['retry_limit'] <= 3:
            return fail(f'{name}.retry_limit must be between 0 and 3')
        threshold = cfg['failure_rate_open_threshold']
        if not isinstance(threshold, (int, float)) or not 0 < threshold <= 1:
            return fail(f'{name}.failure_rate_open_threshold must be in (0, 1]')
        if not isinstance(cfg['minimum_samples'], int) or cfg['minimum_samples'] < 1:
            return fail(f'{name}.minimum_samples must be positive')
        if not isinstance(cfg['recovery_cooldown_seconds'], int) or cfg['recovery_cooldown_seconds'] < 1:
            return fail(f'{name}.recovery_cooldown_seconds must be positive')
    approvals = policy.get('approval_required_for', [])
    required_approvals = {'production-capacity-change','disabling-isolation','increasing-permission-scope'}
    if not required_approvals.issubset(set(approvals)):
        return fail('approval_required_for is missing mandatory boundaries')
    print('VALID')
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description='Validate bulkhead isolation policy.')
    parser.add_argument('--policy', required=True)
    args = parser.parse_args()
    path = Path(args.policy)
    if not path.is_file():
        print(f'ERROR: policy file not found: {path}', file=sys.stderr)
        return 3
    try:
        policy = yaml.safe_load(path.read_text(encoding='utf-8'))
    except Exception as exc:
        print(f'ERROR: cannot parse policy: {exc}', file=sys.stderr)
        return 3
    if not isinstance(policy, dict):
        return fail('policy root must be a mapping')
    return validate(policy)


if __name__ == '__main__':
    raise SystemExit(main())
