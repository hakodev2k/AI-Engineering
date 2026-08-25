# Research — Productive Subagent Stall Discriminator

## Topic
False-positive stall detection in long-running AI subagents.

## Category
Performance

## Problem
Wall-clock or stream-silence watchdogs can terminate healthy subagents during long model inference or active work, then restart them from scratch. Tail latency becomes wasted tokens, repeated setup, resource leaks and false failures.

## Why it matters now
Fresh August 2026 reports show this is recurring in current coding-agent practice. Heavy reasoning tiers and large contexts can have long time-to-first-chunk tails, so one fixed silence threshold is a weak liveness signal.

## Affected users
Developers running background agents; CI/headless agent workflows; teams using high reasoning effort or large contexts; platform builders implementing watchdog/retry systems.

## Current public evidence

### Observed evidence
1. **Claude Code issue #85265, 2026-08-09.** Healthy async agents were reported killed at exactly 600s when time-to-first-chunk exceeded the watchdog. Recovered near-misses occurred at 560s, 475s and 407s; resumed killed tasks completed normally. https://github.com/anthropics/claude-code/issues/85265
2. **Claude Code issue #85206, 2026-08-09.** A Workflow subagent was repeatedly killed despite successful tool activity; four restarts repeated repository exploration/setup and consumed roughly 580k tokens with zero code progress. https://github.com/anthropics/claude-code/issues/85206
3. **Claude Code issue #84346, 2026-08-06.** Analysis of 13 transcripts found interruption gaps tightly clustered at 600.0–605.6 seconds after a tool result, while the error surfaced as if the user had interrupted. https://github.com/anthropics/claude-code/issues/84346
4. **pi-subagent.** This open-source subagent runtime documents a stall watchdog combining protocol activity with a quiet-but-thinking liveness probe and bounded retry/model fallback. https://github.com/LukasParke/pi-subagent

### Interpretation
A fixed silence timeout is insufficient evidence of a dead agent. Retry is especially expensive when progress/state is discarded. Termination reason integrity matters because `human_cancel`, provider timeout and confirmed stall require different recovery actions.

## Existing approaches
Fixed stall/request timeouts; tool-in-flight exemptions; automatic retry; larger configurable timeouts; process/stream heartbeats; protocol activity plus liveness probes in some runtimes.

## Remaining limitations
Provider inference may be alive without emitting visible chunks. Host heartbeats do not prove provider progress. Longer timeouts reduce false positives but delay real-hang recovery. Blind retry repeats expensive exploration/setup. Misclassified termination reasons select the wrong recovery policy.

## Root-cause analysis
1. Liveness inferred from one clock rather than independent progress signals.
2. Thresholds not calibrated to model/context/effort tail latency.
3. Retry decoupled from checkpoint/progress preservation.
4. Termination reasons not reliably machine-readable.
5. Parent workflows may restart without a durable-progress fingerprint.

## Improvement opportunity
Classify liveness from recent model/tool/protocol/durable-progress events; require multiple stale signals and a hard boundary before confirmed kill; preserve progress; cap retries; distinguish provider timeout, human cancellation and policy denial.

## Goal
Reduce false-positive kills and retry amplification without materially increasing recovery time for true stalls.

## Metrics
False-positive kill rate; true-stall recovery latency; tokens lost per kill; duplicate setup/tool calls; retries/task; completion rate.

## Trigger
A subagent exceeds the soft silence threshold, a watchdog fires, or retry/token amplification exceeds baseline.

## Inputs
Timestamped normalized events, policy thresholds, retry history and optional model/context/effort metadata.

## Outputs
Typed liveness classification, stale/recent signals and a blocking exit code for safe retry decisions.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/85265
- https://github.com/anthropics/claude-code/issues/85206
- https://github.com/anthropics/claude-code/issues/84346
- https://github.com/LukasParke/pi-subagent
