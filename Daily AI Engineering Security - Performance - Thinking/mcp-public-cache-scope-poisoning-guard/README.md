# MCP Public Cache-Scope Poisoning Guard

Category: Security

## Problem
MCP 2026-07-28 permits cacheable discovery/list/read results to declare `cacheScope: "public"`, allowing reuse across authorization contexts. Because this classification is server-authored, a shared gateway that trusts it blindly can distribute poisoned tool, prompt, resource, or server-discovery metadata to other users.

## Evidence
See `evidence/research.md`. Current protocol text permits cross-authorization reuse for public entries; current TypeScript SDK guidance defaults to private/zero-TTL, while public issue MCP-2026-008 documents the poisoning risk and MCP-2026-015 shows how cached server instructions can amplify prompt injection.

## Existing approach and limitation
TTL and public/private cache hints reduce polling, but cache scope alone does not establish provenance, tenant safety, or content integrity. A server cannot be allowed to self-authorize cross-tenant reuse merely by writing `public`.

## Proposed improvement
Insert an admission gate before any shared cache write or hit. The gate binds entries to canonical server identity, operation, protocol version, content digest, trust policy, and—unless explicitly approved—authorization-context hash. Unverified public claims downgrade to private or no-store.

## Package tree
- `evidence/research.md`
- `skills/cache-trust-assessment.md`
- `rules/cache-scope-security.md`
- `subagents/cache-security-reviewer.md`
- `workflows/assess-and-enforce.md`
- `hooks/pre-cache-admission.md`
- `scripts/cache_scope_guard.py`
- `config/policy.json`
- `tests/fixtures.md`

## Installation
Requires Python 3.10+ only for the reference script. No third-party package is required.

## Configuration
Edit `config/policy.json`. Production deployments SHOULD replace example trusted server IDs with canonical identities derived from authenticated endpoint configuration or verified deployment metadata.

## Usage
Run `python scripts/cache_scope_guard.py record.json --policy config/policy.json`. Exit 0 allows the declared cache mode, 4 downgrades to private/no-store, and 5 blocks an unsafe cache hit/write.

## Workflow
Observe cacheable response → capture baseline cache key/scope → resolve server and authorization provenance → classify operation/content → apply policy → generate effective cache directive → independently verify isolation with cross-tenant fixtures.

## Metrics
Track public-claim count, downgraded claims, blocked cross-context hits, cache-hit ratio, added latency, cache-key cardinality, and security-regression failures.

## Verification
Implemented means the admission hook runs on writes and reads. Measured means cache/security fixtures produce before/after metrics. Verified means cross-tenant poisoning fixtures cannot transfer attacker-controlled metadata and legitimate approved public entries still cache correctly.

## Safety
Never weaken authentication, tenant isolation, signature/provenance checks, or content validation to preserve cache hit rate. Public caching is an optimization, not an authorization decision.

## Failure handling
Malformed metadata fails closed to no-store. Unknown server identity downgrades to private/no-store. Verification retries are bounded to 2; unresolved identity or digest mismatch blocks shared-cache use and escalates.

## Definition of Done
Evidence documented; baseline captured; admission policy implemented; deterministic tests cover public/private, tenant mismatch, digest mismatch, unknown server, and approved public reuse; no secrets are logged; metrics collected; independent verification passes; no blocking issue remains.
