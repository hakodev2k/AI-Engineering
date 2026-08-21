# Skill — Cache Admission Analysis

## Purpose
Determine whether an MCP response may be cached, what effective scope it receives, and the exact identity tuple required for safe reuse.

## Trigger
Run on every cacheable MCP result before storage and whenever cache policy, server identity, protocol version, or authorization context changes.

## Inputs
Server origin, negotiated protocol version, MCP method, canonical request, resource identity, server-declared cache scope/TTL, result bytes, authorization-context fingerprint, tenant class, and `config/policy.json`.

## Preconditions
The caller has a stable server origin and can canonicalize the request without including secrets. The authorization fingerprint is derived from non-reversible identifiers or a one-way digest.

## Required context
Current trust policy and the exact response being considered. Historical model conversation is not required.

## Allowed tools
Local JSON parsing, hashing, deterministic policy evaluation, audit logging, and test fixtures.

## Constraints
Do not trust server-declared `public` scope by itself. Do not persist raw credentials. Do not expand the response's authorization capability.

## Procedure
1. Validate required fields and declared scope.
2. Canonicalize server origin, method, request, protocol version, and resource identity.
3. Compute SHA-256 over canonical result bytes.
4. Classify the server as share-trusted or untrusted from local policy.
5. If declared scope is private, bind the effective key to the authorization fingerprint.
6. If declared scope is public and server is not share-trusted, downgrade to private when allowed; otherwise reject.
7. If declared scope is public and server is share-trusted, require every configured shared-key field and clamp TTL to `max_ttl_ms_shared`.
8. For private entries clamp TTL to `max_ttl_ms_private`.
9. Emit decision, effective scope, normalized key components, payload hash, expiry, and reason codes.
10. Record an audit event without secret material.

## Decision points
- Missing identity input: reject.
- Missing authorization fingerprint for private caching: reject.
- Untrusted public entry: downgrade or reject according to policy.
- Integrity calculation failure: reject.
- Policy ambiguity: fail closed and escalate.

## Expected output
A machine-consumable admission record with `decision`, `effective_scope`, `cache_key`, `payload_sha256`, `ttl_ms`, and `reasons`.

## Metrics
Admission counts by effective scope, public-to-private downgrade count, rejected entries, cross-authorization hit count, integrity failures, and private/shared hit rate.

## Verification
Use adversarial fixtures where tenant A returns poisoned metadata marked public and tenant B performs the same lookup. The result must not cross contexts unless the server is explicitly share-trusted.

## Failure handling
Malformed input is non-retryable until input changes. Hash/storage failures may be retried once. Policy failures require operator review rather than automatic relaxation.

## Stop conditions
Stop after one deterministic decision. Never loop trying alternative cache keys to obtain an allow decision.
