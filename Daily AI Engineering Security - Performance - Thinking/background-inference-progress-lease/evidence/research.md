# Research — Background Inference Progress Lease

## Topic
Background inference progress lease and circuit breaker for agent workers

## Category
Token

## Problem
AI coding runtimes can continue issuing expensive model requests after a background task has stopped making observable progress or after the owning foreground task is effectively idle/completed. Because internal memory, continuation, review, polling, or maintenance workers may bypass user-visible turn boundaries, a single stuck worker can consume millions of input tokens and quota without producing useful state changes.

## Why it matters now
Fresh August 2026 reports show multiple independent forms of runaway inference: a Codex background memory worker repeatedly resubmitted one completed turn for hours; automatic continuation loops emitted progress-like text without edits; and long-running command handling could devolve into repeated full-context model polling. These are distinct implementations but share one engineering failure: model re-entry is not conditioned on a durable progress invariant and bounded budget.

## Affected users
Developers using long-running agents, unattended coding sessions, background memory/review features, scheduled/headless runs, and platform teams operating agent runtimes with metered model usage.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #40110, opened 2026-08-22: a background memory worker made 1,911 requests over 5h13m while the visible parent was idle. The report records 242,939,410 input tokens, 241,319,680 cached input tokens, no pending user input, no model-requested follow-up, and unchanged consolidated memory output. https://github.com/openai/codex/issues/40110
2. OpenAI Codex issue #37800, opened 2026-08-10: an automatic continuation loop repeatedly emitted continuation messages while making no meaningful file progress, consuming tokens until stopped. https://github.com/openai/codex/issues/37800
3. OpenAI Codex issue #38495, opened 2026-08-14: a long-running `exec` path reportedly degraded into full-context model polling and consumed 34.6M tokens after useful work had completed. https://github.com/openai/codex/issues/38495
4. OpenAI Codex issue #38860, opened 2026-08-16: background `memory_stage1` jobs feed entire rollouts and fail for a material fraction of long sessions when context is exhausted, showing that background workers can also have independent context/budget behavior requiring explicit control. https://github.com/openai/codex/issues/38860

### Interpretation
These reports do not prove one common product bug. They do support a reusable platform-level invariant: every background model request should be attached to a finite lease that requires observable state progress, a bounded request/token budget, and an explicit reason to continue. Worker-specific retry logic is insufficient when the failure is a repeated successful request whose result does not advance state.

## Existing approaches
- Retry limits and exponential backoff for transport errors.
- Foreground turn limits and user cancellation.
- Context compaction and prompt caching.
- Generic no-progress loop detection in agent orchestrators.
- Background job schedulers with timeouts.

## Remaining limitations
- Successful HTTP/model calls are often treated as healthy even when they repeat identical semantic work.
- Cached input lowers marginal compute cost but does not guarantee quota/token-budget safety.
- Timeouts bound wall time but can still permit hundreds or thousands of expensive requests inside the window.
- Foreground cancellation may not cover internal workers with separate thread/turn identities.
- Generic loop detection often observes tool actions, not hidden/internal background inference requests.

## Root-cause analysis
1. Background workers lack a first-class progress contract tied to durable output state.
2. Request authorization is separated from cumulative token/request budgets.
3. Completion/idle state is not propagated as a hard veto to all child workers.
4. Retries distinguish failure from success, but not success-without-progress.
5. Repeated request fingerprints and unchanged output versions are not used as circuit-breaker evidence.

## Improvement opportunity
Introduce a model-call lease for background workers. A lease carries owner identity, purpose, expiry, maximum requests, maximum input tokens, maximum consecutive no-progress calls, and a progress version/fingerprint. Every model re-entry must renew against fresh evidence of progress. Repeated identical work or owner-idle/completed state trips a deterministic breaker before another expensive request.

## Proposed solution
This package provides an evidence-driven procedure, enforceable rules, a worker/verification split, a bounded workflow, a pre-dispatch hook contract, and a dependency-free JSONL analyzer that detects repeated background requests with unchanged progress fingerprints and budget violations.

## Metrics
- Background model requests per completed foreground task.
- Input tokens per background worker purpose.
- Consecutive no-progress model calls.
- Duplicate request fingerprint rate.
- Time from owner completion/idle to worker stop.
- Useful output-version changes per 100 model requests.
- Prevented token spend estimated from blocked duplicate calls.

## Trigger
Any background or deferred worker that can call a model independently of a direct user turn.

## Inputs
Worker telemetry JSONL, owner/task state, request/token counters, progress fingerprint/version, policy thresholds.

## Outputs
Lease decision (`allow`, `deny`, `escalate`), evidence record, budget metrics, and a machine-readable analyzer report.

## Verification
Verified only when fixtures demonstrate that repeated no-progress calls are blocked within the configured bound, normal progressing calls are allowed, owner-completed workers are denied, and counters cannot be reset merely by retry/reconnect.

## Relevant sources
- https://github.com/openai/codex/issues/40110
- https://github.com/openai/codex/issues/37800
- https://github.com/openai/codex/issues/38495
- https://github.com/openai/codex/issues/38860
