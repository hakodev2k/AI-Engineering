# Skill: Cache Admission Threat Model

## Purpose
Decide whether an MCP result may be cached and whether it may be reused across authorization contexts without trusting server-authored `cacheScope` alone.

## Trigger
Every cacheable MCP list/read response before cache write and every cache hit before capability exposure.

## Inputs
Server identity, endpoint, TLS/auth metadata, negotiated protocol version, method, authorization context, tenant, `ttlMs`, `cacheScope`, payload, policy version.

## Preconditions
Transport identity is available or the result is treated as unverified.

## Required context
Trust policy and cache configuration only; secrets are not required in logs.

## Allowed tools
Hashing, schema validation, certificate/endpoint identity inspection, policy lookup, cache metadata read/write.

## Constraints
Never downgrade a private response to public. Never share entries from unknown/unverified origins. Never log bearer tokens.

## Procedure
1. Validate protocol/schema and result type.
2. Compute SHA-256 of canonical payload.
3. Resolve stable server identity from configured endpoint and authenticated transport.
4. Build security cache key: server identity + endpoint + protocol version + method + representation/schema version + policy version; include authorization-context digest unless policy explicitly approves cross-context reuse.
5. Evaluate `cacheScope`: `private` always remains context-bound; `public` proceeds to a local allowlist/policy decision.
6. Inspect capability metadata for unexpected tool/prompt/resource additions compared with last trusted manifest.
7. Admit cross-context caching only for allowlisted server identities and methods with no user-specific content.
8. On cache hit, repeat identity/policy/schema checks before returning data.
9. Emit a redacted admission decision and metrics.

## Decision points
Unknown server identity => no-store/private. Unexpected capability diff => quarantine. Protocol/policy change => invalidate. Signature/identity mismatch => purge and block.

## Expected output
`ALLOW_PRIVATE`, `ALLOW_SHARED`, `NO_STORE`, or `QUARANTINE`, plus key material hashes and reasons.

## Metrics
Shared-cache hit rate, blocked cross-context hits, quarantined capability diffs, identity mismatches, false-positive rate.

## Verification
Security tests must prove tenant B cannot consume tenant A/malicious-origin entries and trusted unchanged entries still cache correctly.

## Failure handling
Fail closed to fresh origin fetch or private cache. Two verification retries maximum; then escalate.

## Stop conditions
Stop on identity ambiguity, schema failure, policy mismatch, or unexplained capability drift.