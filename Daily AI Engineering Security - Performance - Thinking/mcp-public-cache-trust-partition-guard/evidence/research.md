# Research Evidence

## Topic
MCP Public Cache Trust Partition Guard

## Category
Security

## Problem
Shared MCP caches can serve server-controlled results across users or authorization contexts when `cacheScope: public` is trusted without verifying whether the response is globally invariant and safe to share. Server-controlled `instructions` add a prompt-injection path if poisoned metadata is later inserted into model context.

## Why it matters now
The MCP 2026-07-28 protocol revision introduced cache behavior that is now implemented in SDK response-cache layers. In August 2026, public issue reports identified cross-user poisoning risk from `cacheScope: public` and a separate injection path through server-controlled discovery instructions. These two mechanisms compose into a practical trust-boundary problem for gateways and clients that share caches.

## Affected users
MCP client developers, gateway operators, multi-tenant agent platforms, enterprise AI teams, hosted MCP services, users connecting agents to third-party servers.

## Current public evidence
### Observed evidence
1. `modelcontextprotocol/modelcontextprotocol` issue #3207, opened 2026-08-06, reports that `CacheableResult cacheScope:public` can let shared intermediaries cache tool/prompt/resource discovery data and serve it across authorization contexts, enabling cross-user cache poisoning.
2. `modelcontextprotocol/modelcontextprotocol` issue #3213, opened 2026-08-07, reports that server-controlled `instructions` in discovery/initialize responses can be passed into model context and become a prompt-injection vector; it explicitly notes amplification when combined with public cache scope.
3. The MCP TypeScript SDK migration guide for protocol revision 2026-07-28 states that `ttlMs` and `cacheScope` are consumed by the client's response-cache layer and that absent/malformed hints default to `0` and `private`, confirming that cache semantics are active implementation concerns rather than merely documentation metadata.

### Interpretation
The core security boundary is not just whether a response says `public`; it is whether sharing that exact response is safe across every tenant, user, credential, permission set, and server identity represented by the shared cache. A server-provided cache hint cannot by itself establish that trust property. Natural-language instructions also require a content trust boundary independent of transport or cache validity.

### Proposed solution
Add a cache-admission gate that combines scope, authorization sensitivity, tenant/user scoping, instruction presence, TTL, and cache-key partition fields. Fail closed for unknown sensitivity. Keep instruction-bearing server metadata out of trusted system-instruction channels and verify cross-user isolation with deterministic fixtures.

## Existing approaches
Private-by-default cache hints; zero TTL for malformed/absent hints; tenant-specific caches; authorization-aware cache keys; bypassing cache for sensitive data; untrusted-content delimiters; prompt-injection detection; TTL limits; per-server trust policy.

## Remaining limitations
- `public` is server-controlled metadata and can be wrong or malicious.
- Shared gateways may omit tenant/principal/authz dimensions from cache keys.
- Correct caching does not make natural-language instructions trustworthy.
- Detection-only prompt-injection filters are not a complete trust boundary.
- Authentication at transport level does not prove that a cached response is safe to share with another authenticated user.

## Root-cause analysis
1. Cache scope and authorization scope are modeled independently.
2. Cache keys are often optimized for hit rate rather than principal/tenant isolation.
3. Protocol metadata from a remote server can be treated as policy rather than as an input to local policy.
4. Natural-language discovery instructions can be promoted into higher-trust prompt regions.
5. Negative cross-user cache tests are uncommon in ordinary MCP integration testing.

## Improvement opportunity
Make cache admission observable and deterministic. Require local policy to decide shareability, require private partition dimensions for sensitive content, block instruction-bearing public entries by default, and add poisoning/isolation regression tests.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3207
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- https://ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28
