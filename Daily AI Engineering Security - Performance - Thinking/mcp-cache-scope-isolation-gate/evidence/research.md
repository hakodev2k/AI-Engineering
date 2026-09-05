# Research

## Topic
MCP Cache Scope Isolation Gate

## Category
Security

## Problem
Server-controlled MCP content marked `cacheScope: public` can be reused by shared caches across authorization contexts, creating a cross-user cache-poisoning surface for tool, prompt, resource, and instruction metadata.

## Why it matters now
The cache scope was introduced in the MCP 2026-07-28 specification generation, and protocol-level security issues were opened in August 2026 while implementations were still adopting the feature. The risk therefore sits at a moving interoperability boundary where client, server, and gateway assumptions may differ.

## Affected users
MCP client authors, gateway operators, enterprise agent platforms, shared developer environments, and teams caching MCP discovery/list/read responses for latency or cost.

## Current public evidence
### Observed evidence
1. Model Context Protocol issue #3207, opened 2026-08-06, reports that `CacheableResult.cacheScope: public` permits an intermediary to cache and serve content across authorization contexts. The report identifies `tools/list`, `prompts/list`, `resources/list`, and `resources/read` as affected surfaces and describes a malicious server poisoning shared cached metadata.
2. MCP issue #3213, opened 2026-08-07, reports that server-controlled `instructions` can be used as natural-language guidance for an LLM and describes amplification when such content is combined with public caching, creating a cross-user prompt-injection delivery path.
3. RFC 9111 HTTP Caching states that shared caches normally restrict responses associated with `Authorization`, but explicit directives such as `public` can allow shared caching. This means transport-compliant caching can still violate the application's trust assumptions if `public` is accepted from an untrusted MCP server.
4. Hermes Agent issue #94992, opened 2026-08-25, shows real implementation sensitivity to the new `cacheScope` field: an empty invalid scope can break authenticated remote MCP discovery, illustrating current ecosystem adoption/interoperability fragility around this field.

### Interpretation
HTTP cache semantics are functioning as designed; the security mismatch is that cacheability is not equivalent to trustworthiness. MCP content can affect an agent's prompt and capability surface, so a server should not unilaterally decide that content is safe for cross-principal reuse.

### Proposed solution
Enforce a client/gateway policy that defaults MCP responses to private isolation, treats public scope as a request rather than authority, forbids shared caching for prompt/capability-bearing fields by default, and binds accepted cache keys to trusted server identity plus protocol/schema version.

## Existing approaches
HTTP `private`/`no-store`; per-user cache keys; MCP default-private behavior when scope is omitted; server allowlists; sanitizing/isolating instructions; signed or pinned server metadata proposals; disabling shared MCP caching.

## Remaining limitations
A malicious or compromised server controls its own scope declaration. Shared gateways may optimize for hit rate and accept protocol metadata without evaluating agent-specific impact. Cache keys may omit server trust identity, authorization principal, or schema version. Prompt sanitization does not prevent poisoned tool/resource metadata from crossing users.

## Root-cause analysis
- Cacheability metadata is asserted by the content producer that may itself be untrusted.
- HTTP cache semantics do not model agent capability or prompt trust.
- Cross-user reuse can occur before downstream validation.
- Cache keys can be under-specified for multi-tenant agent systems.
- Protocol adoption can diverge between specification and SDKs/clients.

## Improvement opportunity
Move trust enforcement to the cache-store boundary: private by default, explicit allowlist for public content, server/version-aware keys, forbidden-field checks, identity isolation, deterministic poisoning fixtures, and fail-closed fallback.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3207
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- https://github.com/NousResearch/hermes-agent/issues/94992
- https://www.rfc-editor.org/rfc/rfc9111.html
- https://datapace.ai/blog/mcp-cache-poisoning-prompt-injection
