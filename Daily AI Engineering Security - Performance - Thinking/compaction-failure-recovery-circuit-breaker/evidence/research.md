# Research

## Topic
Bounded recovery and circuit breaking for AI-agent compaction failures

## Category
Thinking

## Problem
Context compaction is a recovery mechanism, but current agent runtimes can fail inside that mechanism: repeated oversized summary retries can self-amplify, headless runs can terminate at a compaction transition, and model/provider compaction behavior can occur before host checkpoint assumptions. Without explicit bounded recovery state, a system can loop, stop prematurely, or discard recoverable state.

## Why it matters now
Recent August 2026 reports show the problem across multiple agent runtimes and providers, especially in long-running/headless and multi-agent workflows where there is no human continuously watching the session.

## Affected users
Developers running long coding tasks, benchmark/headless operators, agent platform builders, multi-agent teams, users of third-party model gateways, and teams relying on automatic memory/checkpoint behavior.

## Current public evidence
### Observed evidence
1. **Prime Agent issue #900, opened 2026-08-08.** A long-running session can enter a self-amplifying compaction loop: the provider rejects an oversized turn, compaction submits an oversized summary and fails, overflow recovery retries, failure diagnostics are persisted, and the next attempt becomes worse. https://github.com/PrimeIntellect-ai/prime-agent/issues/900
2. **Prime Agent issue #674, opened 2026-08-06.** Headless `--print` execution was reported to terminate prematurely when auto-compaction starts, including a simple reproducible case. https://github.com/PrimeIntellect-ai/prime-agent/issues/674
3. **Claude Code issue #86716, opened 2026-08-14.** Long-running agent-team teammates can exhaust context so completely that even shutdown/recovery messages fail; the documented practical remedy is replacement and re-briefing, creating rework/state-transfer risk. https://github.com/anthropics/claude-code/issues/86716
4. **OpenClaw issue #121230, opened 2026-08-09.** Host memory-flush thresholds were reported as based on a larger resolved context window while Codex natively compacted around a much smaller point, allowing compaction before the host memory-flush threshold. https://github.com/openclaw/openclaw/issues/121230
5. **OpenClaw issue #118772, opened 2026-08-03.** Token accounting inflation was reported to trigger premature compaction at 4–8% of a configured window, causing unnecessary summarization/data loss. https://github.com/openclaw/openclaw/issues/118772

### Interpretation
These are different implementation defects, not one shared bug. The recurring engineering weakness is that compaction/recovery is treated as an implicit side effect rather than an observable bounded state machine with explicit progress, checkpoint, retry, and stop conditions.

## Existing approaches
- automatic context compaction and reserve-token thresholds
- overflow retries
- summarization and recent-tail retention
- host memory flush/checkpoint hooks
- replacement subagents after hard context exhaustion
- model-specific context-window tables

## Remaining limitations
- retry attempts may not prove progress
- failed recovery artifacts can increase future prompt size
- host and provider can disagree on compaction timing
- headless completion semantics can conflate compaction transition with terminal completion
- checkpoint evidence is not always required before destructive summarization/replacement

## Root-cause analysis
1. Compaction lifecycle is not modeled as a strict finite-state machine in every host.
2. Retry budgets span multiple layers and can multiply.
3. Progress is inferred from activity rather than measured state change.
4. Durable retry/error debris can be fed back into the next recovery attempt.
5. Host context-window assumptions can differ from provider-native behavior.
6. Long-running subagents lack a guaranteed out-of-band recovery channel after hard exhaustion.

## Improvement opportunity
Add a runtime-agnostic circuit breaker over observable compaction events. Require checkpoint evidence before repeated destructive recovery, detect no-progress consecutive failures and debris growth, and make `recovery_required` an explicit non-success state.

## Proposed solution
This package supplies a normalized event contract, dependency-free analyzer, bounded rules, workflow, hook contract, and tests. It does not replace runtime compaction; it prevents uncontrolled recovery behavior around it.

## Goal
Bound recovery attempts, preserve evidence/state, and prevent false completion or self-amplifying compaction loops.

## Metrics
Failures/session, retries/session, debris growth, checkpoint coverage, false completion count, successful recovery rate, rework after replacement.

## Trigger
Any compaction start/failure/success, context-overflow error, provider-native compaction notification, headless session end after compaction, or repeated recovery attempt.

## Inputs
Normalized JSONL lifecycle events and recovery policy.

## Outputs
Continue versus recovery-required decision, reasons, counters, evidence summary.

## Relevant sources
- https://github.com/PrimeIntellect-ai/prime-agent/issues/900
- https://github.com/PrimeIntellect-ai/prime-agent/issues/674
- https://github.com/anthropics/claude-code/issues/86716
- https://github.com/openclaw/openclaw/issues/121230
- https://github.com/openclaw/openclaw/issues/118772
