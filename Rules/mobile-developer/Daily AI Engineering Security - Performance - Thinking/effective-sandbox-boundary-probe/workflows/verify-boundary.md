# Workflow — Verify Effective Boundary

## Trigger
Before unattended execution and after any runtime/config/tool change.

## Goal
Prove the observed boundary is at least as strict as the declared boundary.

## Inputs
Runtime/version/surface, expected policy, resolved config, tool inventory, disposable fixture.

## Baseline
A documented expected matrix of harmless allowed and denied effects.

## Stages
1. **Observe:** capture runtime identity and configured policy.
2. **Measure baseline:** define expected outcomes before testing.
3. **Diagnose:** enumerate configuration precedence and external execution tools.
4. **Form hypothesis:** identify paths where effective policy may differ.
5. **Probe:** run only harmless disposable canaries.
6. **Measure again:** collect actual effects.
7. **Evaluate:** run `python scripts/evaluate_boundary.py observations.json`.
8. **Independent review:** Boundary Reviewer checks evidence and untested paths.
9. **Complete or block:** PASS enables the caller's next stage; FAIL_OPEN/UNKNOWN blocks autonomy.

## Responsible agent
Boundary Reviewer owns verification; implementation/runtime operator supplies the environment and may not self-verify high-risk mismatches.

## Tools
Config readers, disposable filesystem fixtures, structured observation logger, evaluator script.

## Outputs
Observation JSON, evaluator result, independent review decision.

## Checkpoints
- expected outcomes fixed before probes;
- fixture confirmed disposable;
- external executors inventoried;
- evaluator result persisted.

## Metrics
Probe coverage, policy mismatch count, unknown capability count, regression detection time.

## Retry policy
At most one retry for instrumentation/environment setup failure. Zero automatic retries for policy mismatches.

## Stop conditions
Stop on any unexpected non-disposable side effect, ambiguous target, FAIL_OPEN, or missing evidence for a high-impact capability.

## Failure path
Disable high-autonomy mode, force stricter runtime overrides or remove the external capability, then rerun from a fresh fixture.

## Verification
PASS requires all mandatory expected-deny canaries to remain denied and no unreviewed external executor.

## Definition of Done
Declared policy captured; canaries executed safely; observations evaluated; external tools reviewed; independent verification complete; no FAIL_OPEN/UNKNOWN remains.