# Skill: Repeatability Analysis

## Purpose
Measure whether an agent workflow reliably reaches the correct persistent state across repeated clean-state executions and diagnose variance using observable evidence.

## Trigger
New consequential agent workflow, model/orchestrator change, prompt/tool change, production reliability incident, or release candidate.

## Inputs
Task corpus; reset procedure; executable state assertions; trial count; agent/tool traces; candidate/baseline identifiers; reliability thresholds.

## Preconditions
Tasks must run in an isolated/owned environment where state can be reset. Assertions must test user-required outcomes and forbidden collateral effects.

## Required context
Task requirements, policy constraints, expected persistent state, allowed side effects, and failure taxonomy.

## Allowed tools
Sandbox/reset tooling, task runner, observable tool traces, state/database/API assertions, `scripts/repeatability_gate.py`.

## Constraints
Never request hidden chain-of-thought. Never drop failures to improve metrics. Never mutate production solely for evaluation without approval.

## Procedure
1. Decompose each task into required state assertions and forbidden effects.
2. Define a deterministic reset to the same initial state.
3. Run the baseline for the configured bounded number of trials.
4. Record every trial: task ID, trial number, pass/fail, collateral effect, harness error, recovery attempted, evidence reference.
5. Calculate run pass rate, task `pass^n`, flaky-task rate, never-pass rate, collateral-effect rate.
6. Classify failures from observable evidence: wrong tool/action, failed recovery, wrong state update, missing state update, policy violation, harness failure, unsupported final claim.
7. Form at most one primary hypothesis per remediation cycle.
8. Implement the smallest change and replay the identical matrix.
9. Compare candidate versus baseline without changing thresholds.
10. Hand complete evidence to Reliability Verifier.

## Decision points
- Harness failure: report separately; do not silently count as agent success.
- Collateral effect: blocking if policy says so.
- Task passes some but not all trials: classify as flaky.
- Candidate improves aggregate pass but worsens flaky-task or collateral metrics: do not declare success automatically.

## Expected output
Complete trial JSONL, metric report, failure taxonomy, before/after comparison, decision and residual risks.

## Metrics
Run pass rate; pass^n task rate; flaky-task rate; never-pass rate; collateral-effect rate; recovery success; excluded/harness-error count.

## Verification
Independent verifier recomputes metrics from the raw trial corpus and samples state evidence.

## Failure handling
One retry allowed for a proven infrastructure transient, preserving the original failed harness record. Diagnosis/remediation cycles are capped at two.

## Stop conditions
Stop after two unsuccessful remediation cycles, any uncontrolled consequential side effect, inability to reset state reliably, or missing executable assertions.