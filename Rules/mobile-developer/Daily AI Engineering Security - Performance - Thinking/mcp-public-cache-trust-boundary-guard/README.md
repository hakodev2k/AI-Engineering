# MCP Public Cache Trust Boundary Guard

**Category:** Security

## Problem
MCP 2026-07-28 permits `cacheScope: public` results to be reused across authorization contexts. That performance feature creates a new trust boundary: shared infrastructure must not treat server-authored scope as proof that a cached capability/resource is safe for another user.

## Evidence
See `evidence/research.md` for current specification text, the August 2026 cache-poisoning report/PoC, SEP-2549 semantics, and SDK adoption issues.

## Existing approach
MCP distinguishes `public` and `private`, supplies TTL hints, and defines invalidation semantics. These controls govern freshness/sharing intent but do not independently authenticate content provenance.

## Existing limitations
Shared caches can key too coarsely; malicious servers choose their own scope; identity/policy changes can invalidate assumptions; stale-on-error behavior can preserve risky entries.

## Proposed improvement
Require local cache admission policy. Bind entries to verified server identity, endpoint, protocol, method, schema/representation and policy; keep private entries authorization-bound; quarantine unexpected capability drift; revalidate hits before agent exposure.

## Architecture
- `skills/cache-admission-threat-model.md`: reusable admission procedure.
- `rules/cache-trust-rules.md`: enforceable security invariants.
- `subagents/cache-security-reviewer.md`: independent verifier.
- `workflows/admit-cache-verify.md`: bounded implementation/verification flow.
- `hooks/pre-cache-admission.md`: deterministic gate.
- `scripts/cache_key_guard.py`: safe cache-key/decision helper.
- `tests/cache-boundary-cases.md`: negative and positive boundary tests.
- `evidence/research.md`: research record.

## Package tree
```text
README.md
evidence/research.md
skills/cache-admission-threat-model.md
rules/cache-trust-rules.md
subagents/cache-security-reviewer.md
workflows/admit-cache-verify.md
hooks/pre-cache-admission.md
scripts/cache_key_guard.py
tests/cache-boundary-cases.md
```

## Installation
Python 3.9+ for the helper script. Integrate the admission hook before shared-cache write and before cross-context cache hit exposure.

## Configuration
Maintain an explicit trusted-server identity allowlist, current protocol/schema version, policy version, and authorization-context hashing strategy. Never store raw bearer tokens.

## Usage
Example trusted shared decision:
`python3 scripts/cache_key_guard.py --server-id mcp.example --endpoint https://mcp.example/rpc --protocol 2026-07-28 --method tools/list --scope public --policy-version 3 --trusted-server`

Private responses require `--auth-context` and remain isolated.

## Workflow
Observe → validate identity/schema → measure baseline cache behavior → classify trust → implement scoped caching → measure hit/latency impact → run boundary attacks → independent review. Maximum two remediation iterations.

## Metrics
Cache hit rate, latency saved, blocked cross-context hits, quarantine count, invalidations, identity mismatches, isolation-test pass rate, secret-leak count.

## Verification
Run every case in `tests/cache-boundary-cases.md`. A malicious public response must not cross users; trusted public responses may retain caching benefit; private responses never cross context; current policy/identity changes invalidate prior assumptions.

## Safety
Fail closed to private/no-store/fresh fetch. Do not disable authentication, expand trust, or serve security-invalidated stale entries for availability.

## Failure handling
Detection: hook/test mismatch. Evidence: decision output plus redacted cache metadata. Retry: maximum two. Fallback: fresh fetch/private cache. Escalation: operator/security review. Stop on identity ambiguity or failed isolation.

## Implemented / Measured / Verified
Implemented means integration exists. Measured means cache/security counters were captured before/after. Verified means negative poisoning tests and independent review pass. Do not claim verification from implementation alone.

## Definition of Done
Evidence documented; trust policy configured; cache admission integrated; baseline and post-change metrics captured; cross-context poisoning blocked; trusted caching still functions; no secrets logged; reviewer returns PASS; no blocking issue remains.

## Customization
Adapt identity proof to mTLS, OAuth resource metadata, signed server registry, or enterprise service identity. Preserve the central invariant: `public` is never sufficient evidence by itself for cross-authorization reuse.