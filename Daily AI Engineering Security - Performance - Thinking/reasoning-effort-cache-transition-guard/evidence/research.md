# Research

## Topic
Reasoning-Effort Cache Transition Guard

## Category
Token

## Problem
Long-running agent applications can invalidate a large reusable prompt prefix when they change reasoning effort through request-level parameters instead of a cache-preserving in-conversation configuration transition. The model still works, so the regression can appear only as higher cached-input misses, cache-write cost, latency, and token/quota consumption.

## Why it matters now
OpenAI released GPT-6 Astra on 2026-09-03 with a new Responses API mechanism for changing reasoning effort mid-conversation while preserving the cached prompt prefix. The current OpenAI model guidance explicitly says to keep request-level `reasoning.effort` unchanged and use `configuration_update` items when changing effort in compatible standard single-agent requests. On 2026-09-05, Codex issue #42996 reported that normal reasoning-effort changes on current `main` still appeared to use the older request-level settings path rather than the newly supported trusted `configuration_update` item, defeating cache preservation.

## Affected users
Agent-platform developers, Codex/Responses API integrators, teams running long context sessions, orchestration frameworks that dynamically route reasoning effort, and cost/latency owners for tool-heavy workflows.

## Current public evidence
### Observed evidence
1. **OpenAI release notes, 2026-09-03**: GPT-6 Astra added the ability to change reasoning effort mid-conversation while preserving the cached prompt prefix.
2. **OpenAI model guidance, current as of 2026-09-06**: applications changing effort between responses should use `configuration_update` items for compatible standard single-agent requests and keep request-level `reasoning.effort` unchanged to preserve the prompt prefix for caching.
3. **OpenAI Codex issue #42996, opened 2026-09-05**: reports that Codex had durable/trusted support for `ResponseItem::ConfigurationUpdate`, but normal reasoning-effort changes still appeared to follow the older request-level path, causing prompt-prefix cache invalidation.
4. **GPT-6 Astra model documentation**: the model has a 1,050,000-token context window and distinct cached-input/cache-write pricing, increasing the practical value of preserving stable prefixes in long sessions.

### Interpretation
A new cache-preserving API primitive creates a migration hazard: applications can remain functionally correct while paying an avoidable cache and latency penalty because the request shape is wrong. This is especially difficult to catch without request-level observability and a regression gate that correlates effort transitions with cache metrics.

## Existing approaches
- Provider prompt caching.
- Stable system/developer prefixes.
- Request telemetry for input/cached tokens.
- Dynamic reasoning-effort routing.
- OpenAI `configuration_update` items for compatible GPT-6 Astra Responses workflows.

## Remaining limitations
- Functional tests may pass even when caching regresses.
- Existing request-level effort toggles can survive migrations unnoticed.
- Cache hit/miss metrics alone do not identify which request-shape mutation invalidated the prefix.
- `configuration_update` has compatibility constraints; not every topology can use it.
- Multi-agent or unsupported flows need an explicit fallback rather than blindly applying the new item type.

## Root-cause analysis
1. Reasoning effort is treated as ordinary per-request configuration even when it participates in prefix cache identity.
2. Integration layers separate user intent ('use more reasoning now') from request serialization details.
3. Tests validate answer quality but not cache continuity.
4. Traces often omit a normalized record of request-level effort, configuration-update events, and cache counters.
5. Migration guidance can be implemented partially: parser/persistence support exists while the normal control path remains old.

## Improvement opportunity
Add a token-performance guard that audits sequential request traces, detects changes to request-level `reasoning.effort` within a session, verifies that intended effort transitions are represented by `configuration_update` when the flow is declared compatible, and compares cache hit/write metrics before and after migration. Block release claims when quality is preserved but cache continuity or cost/latency metrics regress.

## Goal
Preserve correctness while reducing avoidable cache invalidation, cache-write cost, uncached input, and latency during dynamic reasoning-effort changes.

## Metrics
- cached input ratio
- cache-write tokens / task
- uncached input tokens / task
- total input tokens / task
- cost / task
- p50/p95 response latency
- quality/pass rate on unchanged acceptance tests
- request-level effort mutation count
- compatible transitions using `configuration_update`

## Trigger
Migration to GPT-6 Astra or any compatible model/API flow that dynamically changes reasoning effort across turns.

## Inputs
Normalized sequential request trace with session id, request-level effort, input items, cached-input/cache-write counters, latency, cost if known, and quality result.

## Outputs
Per-session transition findings, cache-preservation violations, metric deltas, and `pass`/`review`/`fail` verification result.

## Relevant sources
- OpenAI release notes, GPT-6 Astra, 2026-09-03: https://openai.com/products/release-notes/
- OpenAI model guidance: https://developers.openai.com/api/docs/guides/latest-model
- GPT-6 Astra model docs: https://developers.openai.com/api/docs/models/gpt-6-astra
- OpenAI Codex issue #42996, 2026-09-05: https://github.com/openai/codex/issues/42996
