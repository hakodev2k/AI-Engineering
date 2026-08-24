# Research — Adaptive Model-Stream Stall Watchdog

## Topic
Adaptive liveness detection for long-running model streams and background agents.

## Category
Performance

## Problem
Agent runtimes need to detect genuinely dead model streams, but fixed inactivity deadlines can either kill healthy high-latency reasoning or allow silent connections to hang indefinitely. Both failure modes are current and materially increase latency, retries, token cost, and operator intervention.

## Why it matters now
Long-context and high-effort reasoning make time-to-first-chunk highly variable, while autonomous workers increasingly run without a human present. A watchdog that conflates slow with dead is a reliability/performance bug; a runtime with no watchdog can block a queue for tens of minutes or forever.

## Affected users
Coding-agent users, workflow authors, CI/automation owners, agent-platform builders, and teams running mixed cloud/local models.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #85265, opened 2026-08-09, reports background subagents killed exactly at the default 600s stall timeout even though resumed tasks complete. The report measures model-specific stall rates and near-misses up to 560s, showing the static cutoff overlaps healthy tail latency. https://github.com/anthropics/claude-code/issues/85265
2. Claude Code issue #84346, opened 2026-08-06, analyzes 13 transcripts with 600.0–605.6s gaps before a synthetic interrupt, supporting a machine-timeout signature and showing that timeout classification can be misreported as user cancellation. https://github.com/anthropics/claude-code/issues/84346
3. PrimeIntellect prime-agent issue #1232, opened 2026-08-11, reports the opposite failure: no model-stream inactivity timeout, leaving an SSE connection established with no events for 15–30+ minutes and blocking daemon mutations. https://github.com/PrimeIntellect-ai/prime-agent/issues/1232
4. NanoClaw issue #2149 documents a hardcoded 90s idle timeout breaking slow local-model cold starts, demonstrating that one global timeout is not portable across providers and inference environments. https://github.com/nanocoai/nanoclaw/issues/2149

### Interpretation
The recurring problem is not simply “timeout too short” or “timeout missing.” Runtimes need phase-aware and model-aware liveness policy: distinguish first-token wait, active streaming, tool execution, and human wait; learn an upper bound from recent healthy latency; cap it with explicit safety limits; classify failures accurately; and retry only when evidence indicates a transient provider stall.

## Existing approaches
- Fixed wall-clock inactivity timeout.
- No timeout, relying on transport close or external cancellation.
- Manual timeout tuning by environment variable.
- Blind retry after timeout.
- Generic “stalled” or “interrupted” error reporting.

## Remaining limitations
- Static values do not fit both cloud and local/high-effort models.
- TTFT and mid-stream silence have different healthy distributions.
- Timeout errors may be misclassified as user interrupts, harming recovery logic.
- Blind retries can repay huge context and amplify provider incidents.
- No-timeout designs hold workers, queue slots, sockets, and locks indefinitely.

## Root-cause analysis
1. Liveness is inferred from elapsed time alone rather than phase and recent progress.
2. Timeout policy is not parameterized by model/provider/effort/context size.
3. Runtimes lack durable latency histograms for healthy runs.
4. Retry policy is often separate from timeout evidence and cost budgets.
5. Cancellation cause is not propagated as a typed terminal state.

## Improvement opportunity
Use an adaptive watchdog with distinct TTFT and mid-stream budgets, derived from recent healthy p95/p99 observations with hard minimum/maximum bounds. Record progress events, emit typed timeout reasons, allow at most one automatic retry for a transient stall, and measure whether tuning lowers false kills without increasing indefinite hangs.

## Goal
Reduce false-positive watchdog terminations and unbounded stream stalls while preserving bounded execution.

## Metrics
- false_timeout_rate
- silent_stall_duration_p95
- ttft_p50/p95/p99 by model/provider/effort bucket
- midstream_gap_p95/p99
- retry_success_rate
- retry_token_overhead
- task_completion_rate
- worker_slot_minutes_lost_to_stalls

## Trigger
Any background or autonomous model request with streaming or long-poll semantics.

## Inputs
Structured trace events with timestamps, phase, model/provider bucket, outcome, and optional token/context metadata.

## Outputs
Recommended watchdog budgets, stall classifications, regression comparison, and blocking verification status.

## Proposed solution
The package provides an analyzer, policy, workflow, rules, hook contract, and independent investigator role. The analyzer never calls a model or network endpoint; it derives phase-specific healthy quantiles and flags timeouts that sit inside observed healthy latency tails.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/85265
- https://github.com/anthropics/claude-code/issues/84346
- https://github.com/PrimeIntellect-ai/prime-agent/issues/1232
- https://github.com/nanocoai/nanoclaw/issues/2149
