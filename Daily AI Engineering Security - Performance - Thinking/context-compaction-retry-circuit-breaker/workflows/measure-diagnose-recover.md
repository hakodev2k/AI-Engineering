# Workflow: Measure, Diagnose, Recover

## Trigger
Compaction failure or repeated context-limit error.

## Goal
Recover without an unbounded token loop or silent loss of required context.

## Inputs
Failure state, token metrics, policy, required-fact checklist.

## Baseline
Capture the first failed request's token counts, fingerprint, and source-history size.

## Context
Use only the conversation material needed to determine convergence and preserve task-critical facts.

## Stages
1. **Observe** — collect provider error and retry history.
2. **Measure** — compute headroom, retry debris, and input delta.
3. **Diagnose** — distinguish deterministic overflow, transient provider failure, and summary-quality failure.
4. **Form hypothesis** — state one observable recovery hypothesis.
5. **Implement improvement** — exclude retry debris and create a smaller bounded summary.
6. **Measure again** — run the guard before retry.
7. **Improved?** If no, revise once more; if yes, continue to verification.
8. **Verify** — independent verifier checks critical-fact retention.

## Responsible agent
Runtime owner implements; Recovery Verifier independently verifies.

## Tools
Token counters, logs, `scripts/compaction_guard.py`, tests, diff tools.

## Outputs
Guard decision, before/after token metrics, recovery summary, verification result.

## Checkpoints
Before first retry; before second retry; before fresh continuation.

## Metrics
Input shrink, failed-retry tokens, recovery latency, task-quality regression.

## Retry policy
Maximum 2 automatic recovery attempts.

## Stop conditions
No shrink, identical failure fingerprint, insufficient headroom, retry debris over budget, or verifier rejection.

## Failure path
Preserve original history, stop automatic retry, generate a bounded continuation summary, and require explicit re-entry rather than looping.

## Verification
Recovery Verifier must confirm retry bounds and critical-fact preservation.

## Definition of Done
Recovery terminates, metrics are recorded, verification passes, and no blocking context-loss issue remains.
