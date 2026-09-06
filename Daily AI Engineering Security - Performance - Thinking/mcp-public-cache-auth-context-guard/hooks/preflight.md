# Hook: Cache Admission Preflight

## Trigger
Immediately before an MCP response is admitted to a reusable cache, and again when server identity, protocol version, authorization policy, or cache configuration changes.

## Preconditions
An assessment JSON exists and contains no raw credentials.

## Action
Run the deterministic scope validator against the proposed cache policy.

## Script / command
`python scripts/verify_cache_scope.py path/to/assessment.json`

## Expected result
Exit code `0` with `status=PASS`. The report must contain zero blocking findings.

## Failure behavior
Exit code `2` blocks cache admission. Treat the candidate as private/no-cache, invalidate an unsafe existing shared entry when applicable, and preserve the validator output as evidence. Exit code `1` indicates invalid input or an execution error and also blocks completion.

## Blocks completion
Yes. A failure cannot be converted to a warning merely to retain cache hit rate.
