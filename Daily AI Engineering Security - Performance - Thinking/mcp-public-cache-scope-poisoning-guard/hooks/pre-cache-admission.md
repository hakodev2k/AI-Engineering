# Hook — Pre-Cache Admission

## Trigger
Immediately before writing an MCP response to cache and immediately before serving a cached MCP entry.

## Preconditions
Canonical server ID, method, protocol version, declared scope, TTL, auth-context fingerprint, and content bytes/digest are available.

## Action
Invoke `scripts/cache_scope_guard.py` with the record and `config/policy.json`. Apply the returned effective scope and canonical partition. On reads, compare stored provenance/digest before returning content.

## Script/command
`python scripts/cache_scope_guard.py record.json --policy config/policy.json`

## Expected result
Exit 0: decision allowed. Exit 4: downgrade to private/no-store. Exit 5: block/evict. Exit 2: invalid input; fail closed.

## Failure behavior
Malformed or incomplete records MUST become no-store. A blocked cache hit MUST fall back to an authenticated origin fetch only if normal authorization permits it.

## Blocking
Yes for shared-cache writes/hits. A guard failure MUST NOT be ignored for performance reasons.
