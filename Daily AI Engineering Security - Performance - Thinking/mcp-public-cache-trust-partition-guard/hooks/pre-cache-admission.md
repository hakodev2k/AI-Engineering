# Hook: Pre-Cache Admission

## Trigger
Before enabling or deploying an MCP response-cache configuration.

## Preconditions
A policy JSON models every cacheable result class/path.

## Action
Run deterministic trust-partition validation.

## Script / command
`python scripts/check_cache_policy.py <policy.json>`

## Expected result
Exit 0 with `PASS`.

## Failure behavior
Exit 2 blocks deployment/cache enablement. Exit 1 also blocks because policy could not be evaluated. Save output as evidence.

## Blocks completion
Yes.