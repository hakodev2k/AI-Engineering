# Research

## Topic
Model-stream stall classification and bounded recovery

## Category
Performance

## Problem
Agent runtimes often use one wall-clock idle timeout to represent several different states: slow but healthy inference, provider queueing, transport loss, active SDK retry, and actual deadlock. Misclassification either kills viable work or waits too long on dead work.

## Why it matters now
Long-context and high-effort agent workloads amplify TTFT variance, while multi-agent systems make every mistaken cancellation expensive because context, cache state, local processes, and verification work may be discarded.

## Affected users
Coding-agent users, multi-agent orchestrators, headless automation, and platform teams operating long model turns.

## Current public evidence — Observed
1. Anthropic Claude Code issue #85265, opened 2026-08-09, reports background subagents aborted at exactly 600 seconds although resumed tasks complete normally; measured stalls were 10.2% on one heavyweight model cohort and 2.5% on another, with near-misses at 560/475/407 seconds. https://github.com/anthropics/claude-code/issues/85265
2. Claude Code issue #84346, opened 2026-08-06, found 13 transcripts clustered at 600.0–605.6 seconds after a completed tool result and mis-surfaced as user interrupts, supporting a machine-timeout signature rather than human cancellation. https://github.com/anthropics/claude-code/issues/84346
3. Claude Code issue #88178, opened 2026-08-20, consolidates reports of dead connections producing silent 3–15 minute hangs where manual interrupt/retry succeeds quickly, demonstrating the opposite failure: insufficient early dead-stream detection. https://github.com/anthropics/claude-code/issues/88178
4. Claude Code issue #81993, opened 2026-07-27, reports frequent mid-stream disconnections and terminal 600-second watchdog failures with lost work, plus operational mitigations such as frequent handoffs. https://github.com/anthropics/claude-code/issues/81993

## Interpretation
The evidence supports a classification problem, not merely a bad timeout constant. A single timeout cannot optimize both long healthy TTFT tails and dead-connection recovery.

## Existing approaches
Fixed idle timeout; SDK transport timeout; manual interrupt/retry; generic retry/backoff; model fallback; periodic progress ticks.

## Remaining limitations
Progress ticks can mask real transport failure; wall-clock thresholds ignore model/context/effort; retries can duplicate costs or side effects; generic error text destroys root-cause observability; fallback without lineage can invalidate evaluation comparability.

## Root causes
- Stall state collapses model, transport, retry, and orchestration phases into one timer.
- Missing request-phase telemetry and last-observed-progress evidence.
- Cancellation precedes classification.
- Recovery lacks idempotency and bounded retry contracts.

## Improvement opportunity — Proposed solution
Measure phase-specific latency; classify boundary events from observable trace signals; gate cancellation on evidence; preserve checkpoint/side-effect ledger; attempt at most one safe recovery; label terminal reason precisely.

## Metrics
TTFT distribution by model/effort/context bucket; false-abort rate; dead-stream detection latency; successful recovery rate; duplicate token/tool cost; leaked-process count; terminal reason accuracy.

## Trigger / Inputs / Outputs
Trigger: model request exceeds warning threshold or transport goes silent. Inputs: timestamped request/stream/retry/transport events, model metadata, timeout policy. Outputs: classification, evidence, recommended action, terminal reason.
