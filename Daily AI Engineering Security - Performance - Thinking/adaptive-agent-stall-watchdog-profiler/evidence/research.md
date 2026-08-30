# Research — Adaptive Agent Stall Watchdog Profiler

## Topic
Fixed no-progress watchdogs misclassify slow-but-healthy agent/model work as stalls, causing avoidable aborts, retries, duplicated work, latency, and token cost.

## Category
Performance

## Problem
Long-running agent turns can legitimately spend minutes between tool completion and the next model chunk, especially with high-effort reasoning, large contexts, local models, or transient stream instability. Flat watchdog thresholds treat silence as proof of failure. The result is false aborts, restart loops, lost cache state, duplicate repository exploration, and degraded throughput.

## Why it matters now
Multiple August 2026 issue reports independently show this failure mode. Claude Code issue #85265 measured watchdog aborts at exactly 600 seconds, including near-misses at 560/475/407 seconds and successful completion after manual resume. Issue #85206 reported repeated watchdog restarts consuming about 580k tokens with no progress. OpenClaw issue #121018 reports provider-specific timeout settings being pre-empted by a shorter global stuck-session abort. Hermes Agent issue #69424 describes a slow local model repeatedly restarting at 180 seconds, producing an infinite retry loop.

## Affected users
Coding-agent users, multi-agent workflow operators, local/self-hosted model users, platform builders with long tool/model phases, and teams paying for repeated context processing.

## Current public evidence
### Observed evidence
1. Claude Code #85265, opened 2026-08-09: background agents killed at exactly 600s although resume completes; cache_read was lost on resumed work. https://github.com/anthropics/claude-code/issues/85265
2. Claude Code #85206, opened 2026-08-09: watchdog repeatedly killed an actively working workflow agent; four attempts consumed ~580k tokens with zero code progress. https://github.com/anthropics/claude-code/issues/85206
3. OpenClaw #121018, opened 2026-08-09: provider timeout is silently capped by a shorter global stuck-session abort, so the configured allowance is not the effective deadline. https://github.com/openclaw/openclaw/issues/121018
4. Hermes Agent #69424, opened 2026-07-22: 180s reconnect timeout repeatedly aborts prompt processing for a ~140k-token context on a slow local model, creating a restart loop. https://github.com/NousResearch/hermes-agent/issues/69424

### Interpretation
The engineering defect is not simply "timeout too short." It is weak liveness classification. A robust watchdog must separate at least: active progress, known long-running model inference, live tool execution, transient stream disconnect, retry/backoff, and genuinely stuck work. A fixed wall-clock threshold without phase-aware evidence cannot do that reliably.

### Proposed solution
Instrument agent phases and progress signals, build latency distributions by model/effort/context/tool class, classify watchdog outcomes, and replace flat timeout decisions with bounded adaptive budgets plus explicit heartbeats/retry state. Use a deterministic profiler to identify false-positive aborts and retry amplification before changing thresholds.

## Existing approaches
- Raise static timeouts.
- Resume/retry failed tasks.
- Add SSE/progress heartbeats.
- Configure provider-specific request timeouts.
- Use global stuck-session watchdogs to prevent infinite hangs.

## Remaining limitations
Static increases can hide real hangs and inflate queue occupancy. Retry without idempotency can duplicate side effects or cost. Provider settings may be shadowed by global watchdogs. Heartbeats can prove transport liveness but not semantic progress. Different phases require different expectations.

## Root-cause analysis
- One threshold covers heterogeneous phases and models.
- Effective deadline is often the minimum of several hidden/configured timers.
- Progress signals are incomplete or not surfaced to the watchdog.
- Retry policies restart from expensive checkpoints without cost budgets.
- Operators often lack phase-level latency histograms and false-abort labels.

## Improvement opportunity
Create a reusable profiler and policy workflow that measures phase durations, computes false-abort candidates, detects nested timeout precedence, limits retry amplification, and validates any new watchdog policy against historical traces before deployment.

## Metrics
False-abort rate; successful-resume-after-timeout rate; retry amplification; tokens/task; duplicated tool/model calls; p50/p95/p99 phase latency; completion rate; queue occupancy; time-to-detect true stalls.

## Trigger
Any recurring timeout/stall signature, exact-threshold abort clustering, expensive resume/retry behavior, slow local models, or heterogeneous model/effort tiers.

## Inputs
JSONL run events with run ID, phase, start/end or duration, watchdog timeout, outcome, progress/heartbeat timestamps, retry count, tokens, optional cache tokens.

## Outputs
Baseline report, timeout-precedence findings, false-abort candidates, retry-cost report, recommended bounded policy, before/after verification report.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/85265
- https://github.com/anthropics/claude-code/issues/85206
- https://github.com/openclaw/openclaw/issues/121018
- https://github.com/NousResearch/hermes-agent/issues/69424
