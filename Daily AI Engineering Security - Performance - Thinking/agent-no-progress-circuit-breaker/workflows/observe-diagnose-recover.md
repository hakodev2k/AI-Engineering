# Workflow: Observe → Diagnose → Recover

## Trigger
A new autonomous task begins, a continuation is requested, or the progress guard opens a circuit.

## Goal
Bound long-running work using measurable progress and recover from loop conditions without infinite retries.

## Inputs
Task criteria, event trace, policy, token usage, artifact state, verification receipt.

## Baseline
Record starting artifact hashes/status, starting token counters, acceptance criteria, and latest valid verification receipt.

## Stages
1. **Observe** — emit one event for each model/tool step.
2. **Measure** — run the guard before continuation.
3. **Diagnose** — if stopped, classify the reason and preserve the trace.
4. **Hypothesize** — define one testable root-cause hypothesis such as stale receipt or repeated retry state.
5. **Implement** — change only the state/update mechanism required by that hypothesis.
6. **Measure again** — replay representative fixtures and run the task from a new bounded run boundary.
7. **Verify** — independent reviewer confirms fresh state and no detector fires.

## Responsible agent
Implementation agent owns stages 1–6; `subagents/verification-reviewer.md` owns stage 7.

## Tools
`python scripts/progress_guard.py --trace <trace.jsonl> --policy config/policy.json`, repository hash/status tools, test runner.

## Outputs
Guard decision, metrics, preserved trace, recovery evidence, independent verification decision.

## Checkpoints
Before first autonomous step; before each continuation; after circuit-open; after recovery; before completion.

## Metrics
Step count, total tokens, consecutive no-progress steps, repeated fingerprint count, repeated receipt count, recovery attempts.

## Retry policy
Maximum 2 recovery attempts. Each attempt MUST use a new explicit hypothesis and new run boundary.

## Stop conditions
Token/step budget breach, no-progress threshold, repeated action threshold, stale verification threshold, missing state evidence, or two failed recoveries.

## Failure path
Stop autonomous execution, preserve evidence, and require manual/new-run restart. Do not silently reset counters.

## Verification
Independent reviewer reruns guard/tests and confirms the verification receipt is bound to current artifact state.

## Definition of Done
Implemented guard is active; Measured baseline and after-state exist; Verified run finishes within budget without a detector firing; no blocking issue remains.
