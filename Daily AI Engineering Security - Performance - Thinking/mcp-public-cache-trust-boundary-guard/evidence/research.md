# Research

## Topic
MCP Public Cache Trust Boundary Guard

## Category
Security

## Problem
MCP 2026-07-28 introduced `CacheableResult` with `cacheScope: "public"`, allowing shared intermediaries to reuse list/read results across authorization contexts. Because cache scope is server-authored metadata, a malicious or compromised server can cause poisoned tool, prompt, or resource metadata to be cached and replayed to other users unless the client/gateway independently binds cache entries to a trusted origin.

## Why it matters now
The 2026-07-28 specification is current, cacheable list/read results are newly deployed, and an August 6, 2026 public issue includes a working proof-of-concept for cross-user poisoning. SDK behavior is also still converging on the new fields.

## Affected users
MCP client authors, enterprise gateways, shared proxies, agent platforms, multi-tenant developer tooling, and teams exposing MCP servers through shared infrastructure.

## Current public evidence
### Observed evidence
1. `modelcontextprotocol/modelcontextprotocol#3207` (2026-08-06) reports that `cacheScope: public` can allow poisoned `tools/list`, `prompts/list`, `resources/list`, or `resources/read` content to cross authorization contexts when a shared cache trusts the server declaration. The issue provides a PoC and proposes origin verification/signatures.
2. The official 2026-07-28 schema states that `public` responses may be served across authorization contexts, while `private` responses may only be reused in the same authorization context.
3. SEP-2549 documents the same cross-user cache semantics and permits stale responses in some error conditions, increasing the importance of origin/integrity checks.
4. C# SDK issue #1721 showed version-negotiation problems around `resultType`, `ttlMs`, and `cacheScope`, illustrating ecosystem churn while implementations adopt the new contract.

### Interpretation
Caching is useful for performance, but the new trust boundary is larger than ordinary per-user client caching. Authorization scope and cache freshness alone do not authenticate the provenance or semantic safety of cached agent capabilities.

## Existing approaches
Use `private` scope for user-specific data, obey TTL/invalidation notifications, separate cache keys by authorization context, and validate negotiated protocol versions.

## Remaining limitations
A malicious server controls `cacheScope`; a shared gateway may cache before a downstream client can apply policy; cache keys may not include server identity/schema digest; stale-on-error behavior can prolong poisoned entries; and cached tool descriptions can influence agent behavior even without a tool invocation.

## Root-cause analysis
1. Cache authorization scope is declarative, not cryptographically bound to origin.
2. Shared intermediaries may treat `public` as sufficient evidence for cross-user reuse.
3. Cache keys often omit server identity, protocol version, capability digest, and tenant policy.
4. Clients may consume cached metadata before re-validating trust policy.
5. Invalidation is freshness-oriented, not provenance-oriented.

## Improvement opportunity
Add a fail-closed cache admission layer that treats `public` as permission to consider caching, not permission to share. Bind entries to verified server identity, endpoint, protocol version, content hash, schema, and policy; default unknown origins to private/no-store; validate cache hits before exposing capabilities; and purge on identity/schema/policy changes.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3207
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.json
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2549-TTL-for-list-results.md
- https://github.com/modelcontextprotocol/csharp-sdk/issues/1721
- https://blog.modelcontextprotocol.io/posts/2026-07-28/
