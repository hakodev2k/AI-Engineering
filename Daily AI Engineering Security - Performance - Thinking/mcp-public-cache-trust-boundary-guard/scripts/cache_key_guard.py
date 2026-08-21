#!/usr/bin/env python3
"""Build/validate security cache keys for MCP cacheable results."""
import argparse, hashlib, json, sys

def digest(value: str) -> str:
    return hashlib.sha256(value.encode('utf-8')).hexdigest()

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument('--server-id', required=True)
    p.add_argument('--endpoint', required=True)
    p.add_argument('--protocol', required=True)
    p.add_argument('--method', required=True)
    p.add_argument('--scope', choices=['public','private'], required=True)
    p.add_argument('--auth-context', default='')
    p.add_argument('--policy-version', required=True)
    p.add_argument('--trusted-server', action='store_true')
    a = p.parse_args()
    if a.scope == 'private' and not a.auth_context:
        print('private scope requires auth context', file=sys.stderr); return 2
    shared = a.scope == 'public' and a.trusted_server
    if a.scope == 'public' and not a.trusted_server:
        decision = 'NO_STORE'
    else:
        decision = 'ALLOW_SHARED' if shared else 'ALLOW_PRIVATE'
    parts = [a.server_id, a.endpoint, a.protocol, a.method, a.policy_version]
    if not shared:
        parts.append(digest(a.auth_context or 'anonymous'))
    key = 'mcp:' + digest('|'.join(parts))
    print(json.dumps({'decision':decision,'cache_key':key,'server_id_hash':digest(a.server_id),'endpoint_hash':digest(a.endpoint),'protocol':a.protocol,'method':a.method,'scope':a.scope}, indent=2))
    return 3 if decision == 'NO_STORE' else 0

if __name__ == '__main__':
    raise SystemExit(main())
