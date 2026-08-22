# Research — Status Poll Amplification Guard

## Topic
Short status/wait polling in long-running AI-agent tasks can repeatedly trigger full-context model turns even when external state has not changed.

## Category
Performance

## Problem
Agent orchestrators commonly poll subagents, background commands, CI, or external services using fixed short waits. When every timeout/no-change poll is surfaced back to the model, the orchestration layer can spend far more model calls, cached-context traffic, tool bytes, and wall-clock overhead than the underlying work requires. Stale child states can keep the loop alive indefinitely.

## Why it matters now
OpenAI Codex issue #37299, opened 2026-08-06 and updated 2026-08-13, reports measured Desktop sessions where 75% of model-visible tool calls were wait/status operations, 83% of `wait_agent` calls timed out, and average input remained around 137–141k tokens with very high cache percentages. The report also describes stale agents remaining `running`, causing continued polling. A separate Codex issue #36503 documents an eight-hour automatic-continuation loop with 2,514 repeated blocked-state calls after an unchanged deterministic failure. Together these are strong signals that no-change orchestration turns and missing circuit breakers can amplify model traffic dramatically.

## Affected users
Developers using long-running coding agents, platform builders implementing agent orchestration, teams using verifier subagents/CI waits, and users with usage/cost limits sensitive to repeated cached-context turns.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #37299: https://github.com/openai/codex/issues/37299 — reports 8,744 wait-family calls out of 11,002 model-visible tool calls (75%), 1,765/2,122 `wait_agent` calls timing out (83%), ~137–141k average input tokens per turn, and stale agent states that kept polling alive.
2. OpenAI Codex issue #36503: https://github.com/openai/codex/issues/36503 — reports 2,514 repeated `update_goal` attempts over ~8h11m after a deterministic pre-tool hook failure prevented the blocked-state update itself; the issue argues for failure-signature deduplication and an out-of-band suspended state.
3. #37299 references #4764 as earlier evidence that large cached contexts can still materially affect usage limits, making repeated no-change turns operationally relevant even when most input is cached. Source: https://github.com/openai/codex/issues/4764

### Interpretation
The reusable engineering weakness is not “polling is always bad.” Polling becomes pathological when **unchanged status is treated as new model-relevant information** and when the cadence does not adapt to expected task duration/state changes. A second failure mode appears when stale lifecycle state prevents the orchestrator from reaching a terminal condition.

### Proposed solution
Introduce a polling controller outside the model loop. It maintains a stable status fingerprint, suppresses model turns for unchanged timeout/no-change results, increases polling intervals with bounded exponential backoff, resets backoff on material state change, enforces per-wait and per-task poll budgets, and circuit-breaks repeated identical failure signatures. Only a state change, terminal event, deadline, or escalation condition becomes model-visible.

## Existing approaches
- Fixed 10–60 second waits.
- Manual long timeouts.
- Repeated `list_agents`/status calls.
- Generic retry libraries.
- User stops runaway tasks manually.

## Remaining limitations
- Longer fixed sleeps increase responsiveness latency and still create needless turns.
- Retry libraries often retry calls but do not suppress unchanged results from model context.
- A status endpoint may contain noisy timestamps/full messages that change bytes without changing semantic state.
- Stale `running` states require independent age/progress checks, not just backoff.
- Over-aggressive suppression can hide meaningful progress; fingerprints must include material fields.

## Root-cause analysis
1. Poll cadence is disconnected from expected external task duration.
2. Timeout/no-change results are forwarded to the model as if they require reasoning.
3. Full status payloads can re-enter context repeatedly.
4. Poll loops often lack a total call/time budget.
5. Child lifecycle state may remain stale, preventing natural termination.
6. Failure deduplication is absent or model-driven rather than deterministic.

## Improvement opportunity
A deterministic controller can cheaply decide whether a poll result contains new information before invoking a model. This moves waiting, backoff, deduplication, and circuit breaking into ordinary software where behavior is measurable and bounded.

## Goal
Reduce model-visible no-change polling turns and context traffic without materially delaying detection of real state changes.

## Metrics
- polls/task;
- model-visible poll events/task;
- no-change suppression ratio;
- model calls/task;
- input tokens/task and cached-input tokens/task;
- time-to-detect terminal state;
- p50/p95 poll interval;
- stale-running detections;
- circuit-break events;
- wall-clock completion and regression rate.

## Trigger
Any long-running wait loop for subagents, commands, CI, jobs, queues, deployments, or external APIs.

## Inputs
Status snapshots, material fields, timestamps, expected duration class, initial/max interval, maximum polls, maximum wall-clock wait, and failure signatures.

## Outputs
`emit`, `suppress`, `terminal`, or `circuit-break`, plus next polling interval and metrics record.

## Status
**Implemented:** controller, policy, hook, workflow, verifier, tests.

**Measured:** requires baseline/adopter telemetry.

**Verified:** only when tests pass and before/after measurements show fewer model-visible no-change turns with acceptable terminal-state detection latency.
