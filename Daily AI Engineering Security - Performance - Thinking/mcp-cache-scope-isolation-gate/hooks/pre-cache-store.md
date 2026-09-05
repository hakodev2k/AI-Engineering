# Hook: Pre Cache Store

## Trigger
Immediately before an MCP response is stored in any cache.

## Preconditions
The gateway can serialize endpoint, server identity, principal namespace, protocol version, requested scope, content fields, and target cache kind.

## Action
Run the deterministic cache-entry policy gate.

## Script / command
`python scripts/check_cache_entry.py config/policy.example.json <entry.json>`

## Expected result
Exit 0 with `ALLOW`.

## Failure behavior
Exit 5 prevents shared storage and falls back to private/no-store according to platform policy. Exit 1 also blocks shared storage because the decision could not be validated.

## Blocks completion
Yes for shared caching; safe private/no-store fallback is permitted.