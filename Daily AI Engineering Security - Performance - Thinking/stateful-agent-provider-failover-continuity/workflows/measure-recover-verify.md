# Workflow: Measure, Recover, Verify

## Trigger
A provider call exceeds latency threshold, returns a qualifying error burst, terminates a stream incompletely, or fails to produce a terminal agent response.

## Goal
Restore useful agent progress with bounded latency while preserving tool/state correctness and security boundaries.

## Inputs
Trace JSONL, portable checkpoint, tool ledger, provider health data, fallback compatibility matrix, latency/retry thresholds.

## Baseline
Before changing routing, record provider latency, retry count, task progress, completed tool operations, pending approvals and the last safe checkpoint.

## Stages
1. **Observe** — capture the first failure and surrounding events.
2. **Measure baseline** — quantify stall duration, attempts and outstanding work.
3. **Diagnose** — classify failure with `../scripts/failover_analyzer.py`.
4. **Form hypothesis** — decide whether transient retry, provider outage, state corruption or compatibility mismatch is most likely.
5. **Implement improvement** — apply one bounded recovery action: retry, reconcile or fail over.
6. **Measure again** — capture recovery latency, terminal outcome, duplicated calls and tool completion.
7. **Improved?** — if no, allow at most one reclassification/recovery cycle; otherwise stop.
8. **Verify** — `../subagents/recovery-verifier.md` independently checks end-to-end continuity.

## Responsible agent
Recovery implementation agent performs stages 1-7. Recovery Verifier performs stage 8.

## Tools
Provider status API/pages, trace parser, checkpoint store, durable tool ledger, deterministic analyzer and test harness.

## Outputs
Failure classification, recovery decision, before/after metrics, checkpoint ID, reconciliation evidence and verification result.

## Checkpoints
Before any retry that could duplicate a side effect; before provider switch; after replay; before declaring completion.

## Metrics
Recovery latency, p95 stall time, retries/run, failover success, duplicate-side-effect count, terminal-response coverage and task completion rate.

## Retry policy
Maximum two total recovery actions per incident. Each action consumes the shared run retry budget. Backoff must be bounded and jittered.

## Stop conditions
Budget exhausted, fallback incompatible, checkpoint invalid, side effect ambiguous after reconciliation, auth/security mismatch, or second recovery action fails.

## Failure path
Persist evidence; stop further provider requests; surface recoverable state; retain durable checkpoint and tool ledger; escalate to a human operator for ambiguous side effects or policy changes.

## Verification
Replay injected-failure fixtures and compare end-to-end state. A successful API response is insufficient if required tools or final response are missing.

## Definition of Done
Implemented: bounded recovery state machine is active. Measured: before/after latency and retry data exist. Verified: task/tool continuity is independently confirmed with zero duplicate side effects and preserved permissions.
