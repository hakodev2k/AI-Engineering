# Workflow: Measure, Normalize, Verify Token Occupancy

## Trigger
Premature compaction, Advisor rollout, provider usage-schema change, inconsistent context meters, or token-cost/occupancy divergence.

## Goal
Ensure context management uses instantaneous executor occupancy while preserving separate cumulative cost/processing metrics.

## Inputs
Sanitized usage records, model effective context window, reserve/threshold policy, existing compaction telemetry, and provider documentation.

## Baseline
Before changing logic, record for a representative sample: top-level input-like tokens, final executor-iteration input-like tokens, compaction decisions, context window, threshold, Advisor-use flag, and compaction latency/token cost where available.

## Stages
1. **Observe** — capture ordinary and Advisor turns. Responsible: implementation owner.
2. **Measure baseline** — compute current controller decision and cumulative/iteration ratios.
3. **Diagnose** — identify whether the controller consumes cumulative, estimated, or occupancy-specific fields.
4. **Form hypothesis** — state the expected semantic mismatch and fixture that proves it.
5. **Implement improvement** — add normalization and route compaction only through `occupancy_tokens`.
6. **Measure again** — replay the same fixtures and representative transcripts.
7. **Improved?** — if false-compaction behavior remains, re-evaluate once; maximum two remediation cycles total.
8. **Independent verification** — Verification Agent runs unit tests and fixture comparison without modifying code.
9. **Complete** — persist before/after metrics and semantic mapping.

## Responsible agent
Implementation owner for stages 1-6; Token Accounting Verification Agent for stage 8.

## Tools
Provider docs, transcript parser, `scripts/normalize_usage.py`, Python unittest, and existing compaction telemetry.

## Outputs
Normalized usage records, baseline/comparison report, failing fixtures when applicable, and final verification record.

## Checkpoints
- Occupancy source explicitly labeled.
- Advisor usage separate from executor occupancy.
- Threshold and effective context window recorded.
- Ordinary non-Advisor behavior does not regress.
- Unknown iteration types do not silently map to occupancy.

## Metrics
False compactions per 100 turns, median occupancy at compaction, cumulative/occupancy inflation ratio, compaction count per task, tokens/task, latency/task, and normalization regression count.

## Retry policy
Maximum two implementation/replay cycles for the same semantic defect.

## Stop conditions
Stop on independent verification success. Stop and escalate after two failed remediation cycles or when provider semantics cannot be established from authoritative documentation.

## Failure path
Disable the affected automatic occupancy decision for unknown/malformed shapes, use the documented conservative compatibility path, preserve sanitized evidence, and escalate. Do not increase the threshold blindly to mask the accounting error.

## Verification
The same fixtures used to demonstrate the bug must pass after the change. `python -m unittest tests/test_normalize_usage.py` must pass. Advisor fixture decisions must use final executor occupancy; cost totals may remain cumulative.

## Definition of Done
Implemented: normalized semantic fields are wired into the controller. Measured: baseline and post-change metrics exist. Verified: independent fixtures/tests pass, false-compaction reproductions no longer compact early, ordinary behavior remains correct, and no blocking semantic ambiguity remains.
