# Research — Background Inference Quota Runaway Circuit Breaker

## Topic
Background inference workers that keep consuming model calls/quota without useful progress.

## Category
Performance

## Problem
Agent runtimes increasingly execute memory extraction, approvals, waits, polling, subagents, and maintenance work in the background. When worker state and call admission are weakly coupled, a terminal/stale worker can continue invoking the model indefinitely or repeatedly retry expensive context.

## Why it matters now
Current August 2026 Codex reports quantify severe impact: thousands of unintended requests, hundreds of millions of input tokens, rapid weekly-quota depletion, and idle background activity with no useful output change.

## Affected users
AI-agent users, coding-agent platform teams, orchestration/runtime engineers, quota/cost operators, and developers running long multi-agent sessions.

## Current public evidence
### Observed evidence
1. OpenAI Codex #40110, opened 2026-08-22: a background memory worker reportedly resubmitted the same thread/turn 1,911 times over 5h13m even while logs said `needs_follow_up=false` and no pending input existed; reported input usage exceeded 242M tokens, mostly cached. https://github.com/openai/codex/issues/40110
2. OpenAI Codex #37299, opened 2026-08-06: Desktop wait/status orchestration reportedly re-entered the model every 10–30 seconds against stale-running subagents, re-metering ~140k context and consuming ~90% of a weekly Pro allowance in 15.5 hours. https://github.com/openai/codex/issues/37299
3. OpenAI Codex #36736, opened 2026-08-03: background memory jobs reportedly retried oversized transcripts while idle, while guardian/background features consumed quota without clear UI attribution. https://github.com/openai/codex/issues/36736

### Interpretation
These incidents share a control-plane weakness: retry/backoff answers *when to try again* but not *whether another model call is justified by new state or progress*. HTTP success also does not prove useful state transition.

### Proposed solution
Add deterministic call admission before each background model request. Correlate worker and turn identity, terminal flags, pending input, progress fingerprint, repeated-call count, and elapsed no-progress time. Block terminal/no-input calls and bounded repeated same-turn/no-progress loops; require explicit recovery state before resuming.

## Existing approaches
- Exponential backoff and retry caps.
- Generic process/task cancellation.
- Timeouts and watchdogs.
- User-visible stop buttons.
- Poll/wait loops for subagent state.
- Retry queues for background jobs.

## Remaining limitations
Backoff can prolong rather than stop a semantic loop; process watchdogs may not see successful-but-useless model calls; parent UIs may be idle while child workers consume quota; stale worker status can cause repeated polling; retry queues often retry unchanged oversized inputs; usage attribution may not identify background features.

## Root-cause analysis
1. Model-call admission is not conditioned on meaningful state change.
2. Terminal/follow-up flags are logged but not enforced as invariants.
3. Worker/turn identity can repeat without a request-count circuit breaker.
4. Progress is inferred from HTTP success rather than durable output/state mutation.
5. Background usage is poorly attributed, delaying detection.
6. Retry queues do not always distinguish transient failure from deterministic oversized/unserviceable input.

## Improvement opportunity
Make every autonomous background model call justify itself with one of: new input, explicit follow-up requirement, changed dependency state, or bounded recovery attempt. Track fingerprints and budgets per worker/turn, not only per process.

## Goal
Prevent runaway background inference while preserving legitimate long-running and event-driven work.

## Metrics
Background calls/task, idle calls/task, repeated same-turn calls, no-progress seconds, tokens after terminal state, background quota share, mean time to break, false-block rate.

## Trigger
Any background worker before a model call; incident investigation after unexplained quota drain; runtime upgrade changing background orchestration.

## Inputs
JSONL worker events with timestamp, worker_id, turn_id, pending_input, needs_follow_up, progress_fingerprint, and optional token counters.

## Outputs
Admission verdict, blocking reason, worker/turn counters, evidence for recovery/escalation.

## Relevant sources
- https://github.com/openai/codex/issues/40110
- https://github.com/openai/codex/issues/37299
- https://github.com/openai/codex/issues/36736
