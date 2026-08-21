# Hook — Pre Cache Admission

## Trigger
Immediately before an MCP result is inserted into any local or shared cache.

## Preconditions
The response bytes, server origin, negotiated protocol version, method, canonical request identity, authorization fingerprint, and policy file are available.

## Action
Run:

`python scripts/cache_scope_guard.py admission.json --policy config/policy.json --strict`

The input must contain the exact metadata used by the cache implementation. Do not synthesize a trusted server identity from model output.

## Expected result
Exit code `0` with decision `private` or `shared`. The emitted record includes effective scope, normalized key, payload hash, TTL, and reasons.

## Failure behavior
- Exit `2`: invalid input/config; block cache insertion.
- Exit `3`: security-policy rejection; block cache insertion and record reason.
- Any unexpected exception: fail closed; do not cache.

## Blocking
Yes. Failure blocks cache admission but does not need to block a safe fresh MCP request. The caller may continue without caching.

## Verification
CI must execute at least one benign private fixture, one untrusted-public downgrade fixture, and one cross-authorization lookup fixture. A hook change is not complete until the independent reviewer confirms those results.
