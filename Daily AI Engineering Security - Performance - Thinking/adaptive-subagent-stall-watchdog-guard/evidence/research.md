# Research — Adaptive Subagent Stall Watchdog Guard

## Topic
Progress-aware stall detection for long-running AI subagents.

## Category
Performance

## Problem
Fixed wall-clock watchdogs can terminate healthy heavyweight subagents during long model-response gaps, then trigger retries that repeat repository exploration and burn tokens while reducing throughput.

## Why it matters now
Multiple August 2026 Claude Code reports independently identify a sharp ~600-second kill signature. One report measured healthy near-misses at 560s/475s/407s and successful completion after resume; another found 13 transcripts clustered at 600.0–605.6s; a workflow report described repeated watchdog kills and roughly 580k tokens consumed with no progress.

## Affected users
Teams running background coding/research agents, heavyweight reasoning tiers, large-context sessions, long test/build workflows, and orchestration platforms with automatic retry.

## Current public evidence
### Observed evidence
1. Claude Code issue #85265, 2026-08-09: the async watchdog aborts at exactly 600s after a tool result; measured stall rates included 10.2% on one model tier and 2.5% on another, with resumed tasks completing normally. https://github.com/anthropics/claude-code/issues/85265
2. Claude Code issue #84346, 2026-08-06: 13/14 analyzed transcripts showed a 600.0–605.6s gap before an unsolicited interruption marker. https://github.com/anthropics/claude-code/issues/84346
3. Claude Code issue #85206, 2026-08-09: a workflow watchdog repeatedly killed actively working subagents and retried from scratch; the reporter estimated about 580k tokens consumed across four attempts with zero lines of code written. https://github.com/anthropics/claude-code/issues/85206
4. Claude Code issue #85615, 2026-08-10, separately reports subagents killed while productive and questions treating a fixed timeout as proof of deadlock. https://github.com/anthropics/claude-code/issues/85615

## Interpretation
The unresolved problem is classification: elapsed silence alone does not distinguish dead transport, saturated upstream model service, slow-but-valid reasoning, or a truly wedged agent. A retry layer amplifies the cost of a false positive.

## Existing approaches
Fixed inactivity timeout; progress ticks; deferring timeout while tools are in flight; manual environment-variable timeout increases; generic tool-stall watchdogs; retry on failure.

## Remaining limitations
A single global threshold ignores model tier, context size, observed latency distribution, prior tool completion, stream/transport health, and retry cost. Raising the timeout globally delays true-stall recovery; lowering it increases false kills. Retry can restart expensive work without continuity.

## Root-cause analysis
- Liveness represented by one elapsed-time scalar.
- Tail latency changes with model/effort/context/provider conditions.
- Transport health and semantic progress are conflated.
- Retry policies consume the watchdog's ambiguous failure as if definitive.
- Thresholds lack measured calibration and hysteresis.

## Improvement opportunity
Use a deterministic watchdog decision layer fed by observable signals: silence duration, calibrated latency percentile, transport status, recent completed tool/progress event, retry count, and maximum hard ceiling. Require two-signal evidence before destructive abort where possible; classify uncertain cases as `defer` with bounded extension, then escalate rather than retrying indefinitely.

## Proposed solution
A pure-Python decision engine, calibration utility, rules, investigation skill, independent verifier, pre-abort hook, bounded workflow, and tests.

## Metrics
false-abort rate; true-stall detection latency; p95/p99 post-tool model gap; retry-amplified tokens; tasks completed without restart; throughput; mean recovery time.

## Inputs / Outputs
Input JSON observation: silence seconds, calibrated p99 seconds, transport state, recent progress age, retry count, hard ceiling. Output: `continue`, `defer`, `abort`, or `escalate`, plus reason and next deadline.

## Verification
Tests MUST prove healthy slow work is not aborted solely because it crosses a fixed legacy threshold, hard ceilings remain bounded, dead transport can abort, retry limits escalate, and no infinite extension is possible.