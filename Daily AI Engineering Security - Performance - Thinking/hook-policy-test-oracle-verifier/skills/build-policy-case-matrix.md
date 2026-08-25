# Skill: Build a Policy Case Matrix

## Purpose
Turn human security intent into machine-checkable hook cases that prove both hook decision correctness and effective runtime enforcement.

## Trigger
A permission hook/rule is added or changed, a runtime/IDE version changes, or a bypass/missing-prompt incident is reported.

## Inputs
Policy requirements, high-risk tools/actions, hook event contract, permission modes/surfaces, known incidents.

## Preconditions
The team can identify harmless representative inputs for prohibited/high-impact actions.

## Required context
Tool names and input schemas, expected allow/deny/ask semantics, host mode/surface, current hook documentation.

## Allowed tools
Documentation, read-only configuration inspection, `scripts/verify_hook_policy.py`, sandboxed test host.

## Constraints
Never use a destructive production action as a canary. Do not treat unit-hook pass as runtime enforcement proof.

## Procedure
1. Enumerate high-impact capabilities and trust boundaries.
2. For each capability add at least one allowed case and one deny/approval case where meaningful.
3. Assign stable case IDs and exact expected semantic outcomes.
4. Include boundary inputs: path variants, command variants, mode/surface, restart/workdir state where relevant.
5. Run isolated hook verification against the trusted hook executable.
6. Run host-level canary scenarios and record effective decisions with the same IDs.
7. Compare all required observations; investigate every mismatch or missing case.
8. Re-run after a fix; maximum one automatic retry for runtime flakiness.

## Decision points
A unit mismatch means hook logic is wrong. A unit pass plus runtime mismatch means host integration/enforcement is wrong. Missing observation means verification is incomplete.

## Expected output
Versioned case matrix, unit results, runtime observations, mismatch list, verification status.

## Metrics
High-risk decision coverage, false-allow count, missing observations, mode/surface coverage.

## Verification
Independent security verifier reviews the case denominator and reruns required cases.

## Failure handling
Fail closed on parser error, timeout, missing expectation, mismatch, or missing required runtime observation.

## Stop conditions
All required cases verified; a blocking mismatch remains after one diagnostic retry; unsafe test setup; evidence unavailable.
