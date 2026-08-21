# Research — Unchanged Read-Only Tool Result Dedup Guard

## Topic
Unchanged Read-Only Tool Result Dedup Guard

## Category
Token

## Problem
Agent runtimes often resend the full payload of unchanged read-only tool results—file reads, directory listings, diagnostics, metadata, and search results—on later model turns. The model pays repeatedly for bytes it has already seen, context fills sooner, compaction happens earlier, and latency/cost rise without adding information.

## Why it matters now
Docker Agent issue #3939, opened 2026-08-07, reports unchanged read-only results being re-sent in full. Hermes Agent issues in 2026 document repeated successful calls returning the same information and excessive call fragmentation that bloats context.

## Affected users
AI coding-agent users, agent-runtime maintainers, platform teams paying API token costs, repository automation workflows, and multi-agent systems.

## Current public evidence
### Observed evidence
1. Docker Agent #3939 (2026-08-07): unchanged read-only tool results are re-sent in full, increasing token cost and accelerating compaction: https://github.com/docker/docker-agent/issues/3939
2. Hermes Agent #18076: repeated successful tool calls can return effectively identical information; warning-only loop guards do not fully solve cross-turn duplication: https://github.com/NousResearch/hermes-agent/issues/18076
3. Hermes Agent #48195: excessive splitting into individual tool calls inflates token use and context: https://github.com/NousResearch/hermes-agent/issues/48195

## Existing approaches
Truncate large results, compact history, warn on repeated calls, cap steps/tool calls, or rely on model behavior.

## Remaining limitations
Truncation does not stop repeated medium-sized payloads. Compaction is reactive and costs model work. Loop detection can suppress legitimate rereads when resources changed and can miss different calls yielding the same content. Safe optimization needs freshness/provenance checks.

## Root-cause analysis
Tool results are transient messages instead of versioned artifacts; runtimes lack stable digests; cache invalidation is disconnected from ETag/version/mtime; duplicate context is often measured only after it is sent.

## Improvement opportunity
Use a deterministic content-addressed ledger. Normalize eligible results, compute digests, associate them with resource identity/freshness evidence, and replace verified-unchanged repeats with a compact reference. Bypass for side effects, ambiguous identity, unknown freshness, non-cacheable policy, or exact-byte correctness requirements.

## Goal
Reduce redundant input without hiding changed or correctness-critical information.

## Metrics
Duplicate bytes avoided/task; input tokens/task; context utilization; compactions/task; eligible cache hit rate; false-dedup rate (target 0); quality/regression pass rate.

## Trigger
After an eligible read-only tool returns and before appending its result to model context.

## Inputs
Tool, canonical arguments, resource identity, result, optional ETag/version/mtime, previous ledger entries, cache policy.

## Outputs
`full`, `unchanged_reference`, or `bypass`; digest; freshness evidence; byte estimate; audit record.

## Interpretation
The evidence supports a recurring token-efficiency problem, but not every repeat is redundant. Resources can change, so deduplication must be evidence-bound.

## Proposed solution
Deterministic normalization/digest logic, cache-safety rules, measurement workflow, and regression checks that fail closed when freshness is uncertain.

## Relevant sources
- https://github.com/docker/docker-agent/issues/3939
- https://github.com/NousResearch/hermes-agent/issues/18076
- https://github.com/NousResearch/hermes-agent/issues/48195
