# Research

## Topic
Astra Reasoning Cache Transition Guard

## Category
Token

## Problem
Long-running GPT-6 Astra agent sessions can lose reusable prompt-prefix cache benefits when reasoning effort is changed through request-level settings instead of the model's cache-preserving `configuration_update` mechanism. The task still works, but a large stable prefix may be reprocessed, increasing input tokens, cache-write cost, and latency exactly when operators try to adapt reasoning effort dynamically.

## Why it matters now
GPT-6 Astra shipped on 2026-09-03 with a new Responses API mechanism specifically for changing reasoning effort mid-conversation while preserving the cached prompt prefix. On 2026-09-05, OpenAI Codex issue #42996 reported that current Codex `main` had persistence/replay support for trusted `ConfigurationUpdate` items but ordinary reasoning-effort changes still appeared to use the older request-level settings path. The issue explicitly links this to earlier Codex issue #35416, which empirically reported a substantial prompt-cache regression after switching to a previously unused reasoning effort.

## Affected users
Developers running long agent sessions, Codex/Responses API integrators, platform teams that dynamically route reasoning effort, multi-turn coding/research systems, and teams measuring token cost and latency.

## Current public evidence

### Observed evidence
1. OpenAI model guidance, current as of 2026-09-06, states that GPT-6 Astra can change reasoning effort mid-conversation using a `configuration_update` input item while preserving the cached prompt prefix. It explicitly recommends keeping request-level `reasoning.effort` unchanged for standard single-agent requests when using this feature.
2. OpenAI release notes dated 2026-09-03 list "Change reasoning effort mid-conversation" as a new long-running-work control designed to preserve the cached prompt prefix.
3. OpenAI Codex issue #42996, opened 2026-09-05, reports that Codex already has trusted/durable `ResponseItem::ConfigurationUpdate` handling but normal reasoning-effort changes appear not to materialize the trusted history item, defeating the new cache-preservation path.
4. The same issue distinguishes itself from Codex #35416, an earlier empirical report showing a substantial prompt-cache regression when reasoning effort changes to a previously unused value.

### Interpretation
This is not a generic "use caching" problem. Astra introduces a concrete state-transition primitive intended to decouple the effective reasoning level from the request-level prefix that participates in caching. Agent hosts that keep changing the request-level field can accidentally invalidate or fragment cache reuse. Because the session still returns correct answers, the regression can remain invisible without per-turn cache telemetry.

## Existing approaches
Existing approaches include provider prompt caching, stable system/developer prefixes, request-level reasoning configuration, explicit `configuration_update` items, provider usage fields for cached input tokens, and manual comparison of before/after turns.

## Remaining limitations
- An application can be functionally correct while silently losing cache reuse.
- Dynamic reasoning routing may mutate request-level configuration by default.
- Cache regressions are workload-dependent and easy to miss without baseline measurements.
- A single aggregate token total cannot distinguish stable-prefix cache loss from legitimate context growth.
- Multi-turn hosts may persist configuration state differently across resume/fork/replay paths.
- Migration guidance alone does not guarantee a framework actually emits trusted `configuration_update` items.

## Root-cause analysis
1. Older integrations model reasoning effort as request configuration rather than conversation state.
2. Host abstractions can hide whether a change was represented as request metadata or a history item.
3. Token/cost observability frequently aggregates totals instead of computing cache hit ratios around transitions.
4. Framework support may exist at serialization/replay layers without being wired into the normal setting-change path.
5. Teams optimize quality routing before verifying cache behavior under the new transition mechanism.

## Improvement opportunity
Add a token-aware transition guard that records reasoning-change events plus per-turn usage, establishes a baseline cache-hit ratio before a change, detects request-level effort mutations, measures post-change cache behavior, and blocks claims of optimization unless token/cost/latency regressions remain within configured thresholds. Prefer `configuration_update` for compatible Astra flows, while preserving required context and correctness.

## Relevant sources
- OpenAI model guidance for GPT-6 Astra, accessed 2026-09-06: https://developers.openai.com/api/docs/guides/latest-model
- OpenAI release notes, GPT-6 Astra / Responses API, 2026-09-03: https://openai.com/products/release-notes/
- OpenAI Codex #42996, 2026-09-05: https://github.com/openai/codex/issues/42996
- OpenAI Codex #35416, referenced by #42996 as prior empirical cache-regression evidence: https://github.com/openai/codex/issues/35416

## Proposed solution
The package supplies a measurable migration and verification procedure, enforceable token/cache rules, a deterministic analyzer for JSONL turn telemetry, a blocking pre-change hook, an independent cache verifier, and tests. It never removes correctness-critical context merely to improve token metrics.
