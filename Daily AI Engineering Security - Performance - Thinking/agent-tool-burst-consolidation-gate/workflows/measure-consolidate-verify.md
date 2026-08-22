# Measure, Consolidate, Verify Workflow

## Trigger
Tool-heavy turns exceed cost/latency expectations or users observe silent rapid-fire agent activity.

## Goal
Bound waste from heterogeneous tool bursts while preserving productive multi-step workflows.

## Inputs
Representative traces, usage metrics, candidate policy, completion outcomes.

## Baseline
Capture calls/turn, tokens/task, p95 turn latency, completion rate, and existing hard limits before changes.

## Stages
1. **Observe** traces and identify costly bursts.
2. **Measure baseline** on a fixed fixture corpus.
3. **Diagnose** whether bursts are productive, over-decomposed, or recovery thrash.
4. **Form hypothesis** for compound call/token/time budgets.
5. **Implement** post-tool gate in dry-run mode.
6. **Measure again** and tune at most twice.
7. **Enforce** checkpoint requirement on threshold crossing.
8. **Independent verification** on untouched traces/canary tasks.

## Responsible agent
Performance investigator proposes policy; implementation agent integrates; Performance Verifier signs off.

## Tools
Usage logs, JSONL traces, `tool_burst_guard.py`, tests.

## Outputs
Baseline, policy, checkpoint reports, before/after metrics, regression report.

## Checkpoints
After baseline; after dry-run; after tuning; before production enforcement.

## Metrics
Calls/turn, tokens/task, burst duration, p95 latency, completion rate, checkpoint precision.

## Retry policy
Maximum 2 policy-tuning iterations. Each retry requires evidence explaining the previous miss.

## Stop conditions
Stop if completion quality/security verification regresses, telemetry is insufficient, or two iterations fail to improve the target metrics.

## Failure path
Disable only this new enforcement gate (not native safety limits), retain collected evidence, and escalate threshold/design analysis.

## Verification
Replay mixed productive/pathological corpus and run a small canary set.

## Definition of Done
Measured reduction in avoidable calls/tokens/latency, acceptable completion regression, bounded loops, independent verification complete.
