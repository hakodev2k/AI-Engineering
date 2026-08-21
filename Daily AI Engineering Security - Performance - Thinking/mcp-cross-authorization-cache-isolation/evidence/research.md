# Research — MCP Cross-Authorization Cache Isolation

## Topic
MCP Cross-Authorization Cache Isolation

## Category
Security

## Problem
The MCP 2026-07-28 schema allows `CacheableResult.cacheScope = "public"`, meaning clients or shared intermediaries may reuse a response across authorization contexts. Because `cacheScope`, `ttlMs`, and the payload are server-authored, a malicious or compromised server can assert that attacker-controlled tool, prompt, or resource metadata is globally reusable. A shared cache that trusts this assertion can serve poisoned metadata to a different user or access token.

## Why it matters now
This behavior is new enough that ecosystem implementations are still converging. On 2026-08-06, MCP issue #3207 documented a cross-user cache-poisoning scenario and noted a spec/SDK implementation gap. On 2026-08-07/08, issue #3213 described how cached server-controlled instructions can amplify prompt injection across users. The 2026-07-28 schema explicitly defines `public` as reusable across authorization contexts.

## Affected users
MCP client developers, enterprise MCP gateways, caching proxies, multi-tenant agent platforms, developers using shared MCP infrastructure, and users whose agents automatically trust server-advertised tools/resources.

## Current public evidence
### Observed evidence
1. MCP issue #3207, opened 2026-08-06, describes `cacheScope: public` cross-user cache poisoning for `tools/list`, `prompts/list`, `resources/list`, and `resources/read`, with a proof-of-concept. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3207
2. MCP 2026-07-28 schema defines `public` cache entries as reusable across authorization contexts and `private` entries as scoped to the same authorization context. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.json
3. MCP issue #3213, opened 2026-08-07, documents a related amplification path where shared cached server instructions can become a prompt-injection vector. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
4. MCP authorization guidance treats server-authored authorization/tool metadata as advisory rather than a substitute for server-side authorization and recommends caution with metadata from untrusted servers. Source: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization

## Existing approaches
- Honor `cacheScope` exactly as declared by the server.
- Disable caching entirely.
- Cache private responses by access token or authorization context.
- Rely on gateway/server allowlists.
- Use short TTLs to reduce exposure duration.

## Remaining limitations
Disabling caching sacrifices useful performance. Short TTLs limit duration but do not prevent cross-tenant poisoning. A server allowlist establishes administrative trust but does not guarantee that a previously trusted server cannot change or be compromised. Cache keys based only on endpoint/method omit identity, audience, tenant, negotiated protocol version, server origin, and payload integrity. `cacheScope: public` is an assertion, not cryptographic proof that content is safe to share.

## Root-cause analysis
- Server-controlled cache policy is treated as authoritative trust metadata.
- Cache identity is often weaker than authorization identity.
- No mandatory payload-origin binding is required for shared cache reuse.
- Cross-tenant reuse can occur before the model sees the data, so model-level prompt defenses are too late.
- Cache invalidation may not include server identity/version changes.
- Cache observability commonly records hits/misses without proving which authorization scope supplied a hit.

## Improvement opportunity
Add a client/gateway-side cache admission guard that defaults to authorization-isolated caching. Permit cross-authorization reuse only for explicitly trusted servers and only when a policy-defined identity tuple matches. Bind entries to server origin, protocol version, method, canonical request, resource identity, and payload hash. Reject or downgrade unsafe `public` entries to private. Record provenance for every cache hit and add deterministic poisoning regression tests.

## Goal
Prevent one authorization context from receiving attacker-controlled MCP cache content admitted under another context unless an explicit, verifiable sharing policy permits it.

## Metrics
- 100% cache entries include server origin, protocol version, method, scope classification, authorization-context fingerprint, and payload hash.
- 0 cross-authorization cache hits when server is not explicitly share-trusted.
- 100% `public` entries from unknown/untrusted servers are downgraded or rejected.
- 100% cache hits expose source authorization class and entry hash in audit logs.
- Adversarial cross-tenant poisoning fixtures are blocked.
- Benign private-cache hit rate is preserved within configured tolerance.

## Trigger
Any MCP result carrying caching metadata, cache lookup, cache admission, server identity change, protocol upgrade, or authorization-context change.

## Inputs
MCP server origin/identity, method, request parameters, result, `cacheScope`, TTL, protocol version, authorization-context fingerprint, trust policy, and optional tenant identifier.

## Outputs
Admission decision (`reject`, `private`, `shared`), normalized cache key, payload SHA-256, expiry, reason codes, and audit record.

## Interpretation
The sources establish a concrete cross-authorization design risk, not proof that every MCP cache implementation is exploitable. Exploitability depends on whether a client/gateway implements shared caching and trusts server-declared public scope without stronger binding.

## Proposed solution
A deterministic cache-admission and cache-lookup guard that enforces provenance-bound keys and authorization isolation before any cached MCP content enters agent context.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3207
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.json
- https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
