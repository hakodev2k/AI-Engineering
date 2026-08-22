# Skill — Cache Trust Assessment

## Purpose
Turn MCP cache hints into a local, evidence-backed effective cache decision.

## Trigger
Before shared-cache write/hit for `server/discover`, tools/prompts/resources list/read, or another policy-declared cacheable method.

## Inputs
Server identity; endpoint; method; protocol version; declared scope/TTL; auth-context fingerprint; response digest; policy.

## Preconditions
Identity source is authenticated or configuration-bound; secrets are represented only by one-way fingerprints; response bytes are available for hashing.

## Allowed tools
Configuration reader, cryptographic hash, cache metadata reader, audit logger, test runner.

## Constraints
MUST NOT treat server-declared `public` as authorization. MUST NOT log access tokens. MUST fail closed on malformed scope/identity.

## Procedure
1. Capture baseline key, scope, TTL, hit/miss and tenant partition.
2. Canonicalize server ID, method and protocol version.
3. Hash response bytes/normalized metadata.
4. Classify whether local policy permits public caching for this server/method.
5. If not explicitly permitted, downgrade public to private or no-store.
6. Build key from server ID + method + protocol + effective partition + representation discriminator.
7. On cache hit, verify stored digest/provenance against expected key metadata before use.
8. Emit sanitized reason code and metrics.
9. Run cross-context negative fixture before rollout.

## Decision points
- Unknown identity → no-store.
- Public not allowlisted → private/no-store.
- Authorization-context mismatch on private entry → deny.
- Digest/provenance mismatch → evict and deny.
- Approved public + matching provenance → allow.

## Expected output
Effective cache directive, cache-key material, reason code, evidence record.

## Metrics
Downgrade rate, denied hits, provenance mismatches, p95 guard latency, approved-public hit ratio.

## Verification
A second reviewer/test process attempts cross-user poisoning and verifies zero transfer.

## Failure handling
At most 2 metadata re-resolution attempts. Fallback is no-store. Escalate repeated mismatches.

## Stop conditions
Stop when decision is deterministic, required identity is unavailable, retry budget is exhausted, or security test fails.
