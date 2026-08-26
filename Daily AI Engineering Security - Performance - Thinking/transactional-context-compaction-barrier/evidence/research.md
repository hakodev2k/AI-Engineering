# Research — Transactional Context Compaction Barrier

**Category:** Token  
**Research date:** 2026-08-26 (UTC+7)

## Topic
Prevent automatic context compaction from deleting durable history, miscounting context pressure, or crossing in-flight tool side effects.

## Problem
Long-running agents increasingly compact context automatically. Current implementations can trigger compaction from incorrect token-accounting state, interrupt or erase tool-call evidence, or destroy the parent transcript while retaining only a synthetic summary. This creates a reliability failure disguised as token optimization.

## Why it matters now
Multiple August 2026 bug reports independently show data-loss and state-integrity failures in active agent frameworks. These are not theoretical prompt-quality concerns: they include lost conversation history, prematurely triggered compaction, and side effects that were issued but never durably confirmed.

## Affected users
Agent framework maintainers, coding-agent users, orchestration teams, platform engineers running long sessions, and applications with tools that mutate files, jobs, databases, or external services.

## Current public evidence

### Observed evidence
1. Hermes Agent issue #90985, opened August 20, 2026, reports context compaction tearing down turns while tool calls are in flight, leaving issued side effects without durable confirmation or audit evidence: https://github.com/NousResearch/hermes-agent/issues/90985
2. Hermes Agent issue #92080, opened August 22, 2026, reports routine compaction rotating the session before parent messages are durably serialized, leaving the parent transcript empty and only a generated summary available: https://github.com/NousResearch/hermes-agent/issues/92080
3. OpenClaw issue #118772, opened August 3, 2026, documents cumulative run-usage being treated as current context size, causing premature compaction at only a small fraction of the configured window and discarding real conversation context: https://github.com/openclaw/openclaw/issues/118772
4. Prime Agent issue #900, opened August 8, 2026, reports compaction retry debris making overflow recovery self-amplify because failed summary attempts enlarge durable state and trigger the same failure again: https://github.com/PrimeIntellect-ai/prime-agent/issues/900

### Interpretation
The common engineering failure is a missing transaction boundary around compaction. Systems conflate at least three different values: cumulative token usage, current materialized prompt size, and durable history size. They also compact across an unresolved side-effect boundary without requiring every tool call to be either durably committed or explicitly marked unknown.

## Existing approaches
- Threshold-based automatic compaction.
- Summary generation followed by transcript replacement.
- Provider-reported usage counters and session-level token meters.
- Retry loops on overflow or rejected summaries.
- Ad hoc persistence at normal session/turn completion.

## Remaining limitations
- A threshold is unsafe if its input is cumulative usage rather than a current-context snapshot.
- Summaries are lossy and cannot substitute for an unavailable durable source transcript.
- Tool-call state often has only "requested" and "returned" semantics, not issued/committed/unknown durability states.
- Compaction can occur at preflight boundaries that are unaware of executor activity.
- Retry debris can itself increase context pressure and create compaction loops.

## Root-cause analysis
1. Token accounting lacks explicit scope metadata (`current_context`, `cumulative_run`, `durable_transcript`).
2. Compaction eligibility is evaluated without a side-effect quiescence barrier.
3. History persistence is coupled to clean turn/session completion.
4. Compaction replacement can happen before source-history durability is proven.
5. Retry policy does not hash or compare failed compaction inputs, so unchanged failures repeat.

## Improvement opportunity
Add a deterministic pre-compaction gate that requires: a current-context token snapshot, a durable source-history checkpoint, zero unresolved side-effecting tool calls, and bounded retry state keyed by transcript digest. Treat compaction as a transaction: prepare → verify quiescence/durability → compact → verify smaller valid state → commit. Otherwise defer or fail closed.

## Relevant sources
- Hermes #90985: https://github.com/NousResearch/hermes-agent/issues/90985
- Hermes #92080: https://github.com/NousResearch/hermes-agent/issues/92080
- OpenClaw #118772: https://github.com/openclaw/openclaw/issues/118772
- Prime Agent #900: https://github.com/PrimeIntellect-ai/prime-agent/issues/900
