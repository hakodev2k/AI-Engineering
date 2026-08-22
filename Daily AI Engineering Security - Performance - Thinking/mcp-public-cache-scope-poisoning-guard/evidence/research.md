# Research — MCP Public Cache-Scope Poisoning Guard

## Topic
MCP public cache-scope poisoning and cross-authorization metadata reuse.

## Category
Security

## Problem
A malicious or compromised MCP server can mark discovery/list/read metadata as publicly cacheable. A shared intermediary that trusts this server-authored classification can reuse poisoned content across authorization contexts.

## Why it matters now
The MCP 2026-07-28 revision newly requires `ttlMs` and `cacheScope` on several cacheable result types, making cache semantics an active implementation concern across SDKs and gateways.

## Affected users
MCP client authors, enterprise AI gateways, multi-tenant agent platforms, tool registries, developers using shared proxies, and users whose models consume cached MCP metadata.

## Current public evidence
### Observed evidence
1. MCP issue #3207, opened 2026-08-06, reports that `cacheScope: public` permits shared intermediaries to serve cached tool/prompt/resource metadata across authorization contexts and supplies a poisoning PoC: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3207
2. MCP issue #3213, opened 2026-08-07, demonstrates an amplification path where server-controlled `instructions` combined with public caching can spread prompt injection across users: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
3. MCP SEP-2549 explicitly defines public entries as reusable by shared gateways/proxies across users and says cache scope is server supplied: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2549-TTL-for-list-results.md
4. The 2026-07-28 schema encodes the same cross-authorization semantics: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.json
5. TypeScript SDK migration guidance uses conservative defaults (`ttlMs: 0`, `cacheScope: private`) unless cache hints are explicitly configured: https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/support-2026-07-28.md

## Interpretation
Caching itself is useful and the protocol distinguishes public/private intent, but server-provided scope is not sufficient evidence that cross-tenant reuse is safe. Multi-tenant hosts need a local trust decision and a provenance-bound cache key.

## Existing approaches
- Honor `ttlMs` and `cacheScope` directly.
- Use private caches per authorization context.
- Default to private/zero TTL in conservative SDKs.
- Invalidate on MCP list-changed notifications.

## Remaining limitations
- A malicious server controls its own `cacheScope` claim.
- Public cache semantics do not authenticate the origin/content of a cached entry.
- Cache keys can omit server identity, protocol revision, or authorization partition.
- Notifications address freshness, not poisoning or tenant isolation.
- Operators may enable shared caching for performance without threat-modeling LLM-visible metadata.

## Root-cause analysis
1. Cache classification and content originate at the same trust boundary.
2. Shared-cache admission is treated as a performance decision rather than a security decision.
3. Cache keys are often transport-oriented instead of provenance-oriented.
4. Model-visible tool/prompt/server metadata can alter future agent actions, increasing impact.
5. Cross-tenant negative tests are uncommon.

## Improvement opportunity
Require a host-side admission policy that verifies canonical server identity and operation, computes a content digest, binds authorization context by default, and only permits cross-context public reuse for explicitly trusted server/operation pairs. Otherwise downgrade to private or no-store.

## Goal
Prevent attacker-controlled MCP metadata from crossing authorization boundaries through shared caching while preserving safe caching for approved public data.

## Metrics
- Cross-context poisoning success rate: 0% in fixtures.
- Unknown-server public claims admitted to shared cache: 0.
- Digest/provenance mismatches served: 0.
- Security false negatives: 0 in maintained attack corpus.
- Added admission latency p95 tracked and bounded by deployment SLO.
- Approved-public cache hit ratio measured separately from private cache hits.

## Trigger
Before storing a cacheable MCP response and before serving a shared-cache hit.

## Inputs
Canonical server identity, method, protocol version, requested cache scope, TTL, authorization-context fingerprint, content digest, local trust policy.

## Outputs
`public`, `private`, `no-store`, or `deny`; canonical cache-key material; reason code; sanitized audit event.

## Proposed solution
See package rules, workflow, hook, and deterministic script. The proposal is host-side defense-in-depth and does not claim the protocol issue is resolved upstream.

## Relevant sources
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3207
- https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2549-TTL-for-list-results.md
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.json
- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/support-2026-07-28.md
