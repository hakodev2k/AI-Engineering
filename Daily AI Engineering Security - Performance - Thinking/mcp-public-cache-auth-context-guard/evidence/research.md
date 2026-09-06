# Research

## Topic
MCP Public Cache Authorization-Context Guard

## Category
Security

## Problem
The 2026-07-28 Model Context Protocol revision introduced cache metadata that lets servers mark discovery/list/read responses as `cacheScope: "public"`. A response marked public may be reused across authorization contexts. If a response is personalized, permission-filtered, attacker-controlled, or carries model-visible instructions, a shared cache can turn a single bad response into cross-user data exposure or prompt/tool poisoning.

## Why it matters now
This attack surface is new to the 2026-07-28 protocol generation and is already producing open security reports and interoperability failures. Teams are adopting caching to reduce MCP startup latency and schema-transfer overhead, while server and SDK behavior is still converging.

## Affected users
MCP client and server authors, enterprise MCP gateways, shared reverse proxies/CDNs, multi-tenant agent platforms, security teams, and developers operating authenticated MCP integrations.

## Current public evidence

### Observed evidence
1. Model Context Protocol issue #3207, opened 2026-08-06, reports that `CacheableResult.cacheScope: public` can permit a poisoned `tools/list`, `prompts/list`, `resources/list`, or `resources/read` response to be served across authorization contexts. The issue remains open.
2. Model Context Protocol issue #3213, opened 2026-08-07, reports that model-visible `instructions` in `server/discover`/`initialize` can be attacker-controlled and combines this with public caching into a cross-user prompt-injection chain. The issue remains open.
3. A current MCP conformance validator documents that authenticated or personalized results must not be treated as safely public and specifically flags the cross-user caching risk.
4. A public MCP cache implementation, `mcp-cache-kit`, independently implements authorization-context isolation and describes private responses as unsafe to share across users/tenants.
5. Hermes Agent issue #94992, reported in late August 2026, shows the ecosystem is already encountering malformed `cacheScope` values from a real hosted MCP endpoint, demonstrating that cache metadata cannot simply be trusted as uniformly correct input.

### Interpretation
The protocol's cache hint is server-authored metadata, while cache reuse is a client/intermediary security decision. Treating the hint as sufficient authorization evidence conflates freshness policy with access control. The safe boundary is a tuple of server identity, method, negotiated protocol, request identity, authorization context, and response trust classification.

### Proposed solution
Add an admission gate in front of shared caching. Default authenticated or personalized responses to private isolation; require explicit proof before public reuse; bind private cache keys to a stable non-secret authorization-context digest; quarantine malformed hints; and prevent untrusted model-visible instructions from becoming globally reusable cache entries.

## Existing approaches
- MCP `ttlMs` and `cacheScope` metadata.
- Server-side per-primitive authorization.
- Shared HTTP/gateway caches.
- Validators that warn on authenticated/personalized public responses.
- Libraries that key private entries by authorization context.

## Remaining limitations
- `cacheScope` is declared by the server that may be compromised or malicious.
- Authorization-filtered tool/resource lists can look structurally valid while being unsafe to share.
- Shared caches may not include identity/authorization context in keys unless explicitly configured.
- Malformed cache metadata can trigger either unsafe fallback or total discovery failure.
- Prompt/tool metadata can influence model behavior even when it contains no conventional secret.
- Static configuration review does not prove effective cache-key partitioning at runtime.

## Root-cause analysis
1. Cache freshness metadata is being treated as an access-control assertion.
2. Cache keys often omit authorization-context identity.
3. Public sharing is an optimization with security impact but lacks a local proof obligation.
4. Clients and intermediaries need fail-closed behavior for malformed or ambiguous metadata.
5. Model-visible metadata is not always classified as security-sensitive content.

## Improvement opportunity
A reusable guard can validate cache candidates before admission, generate an evidence artifact explaining the decision, and regression-test that cross-user cache hits cannot occur. The guard is intentionally stricter than protocol syntax: protocol-valid `public` is not automatically organization-safe.

## Relevant sources
- MCP issue #3207, 2026-08-06: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3207
- MCP issue #3213, 2026-08-07: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- MCP caching metadata explainer, verified 2026-08-10: https://www.createmcps.com/spec/caching-metadata
- MCP-CAC-005 validator rule: https://www.createmcps.com/rules/mcp-cac-005
- mcp-cache-kit: https://github.com/studiomeyer-io/mcp-cache-kit
- Hermes Agent issue #94992: https://github.com/NousResearch/hermes-agent/issues/94992
- MCP threat-modeling paper, 2026-03-23: https://arxiv.org/abs/2603.22489
