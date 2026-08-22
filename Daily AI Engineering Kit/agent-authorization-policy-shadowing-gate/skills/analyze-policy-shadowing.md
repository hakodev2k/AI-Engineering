# Analyze Policy Shadowing

## Purpose
Detect unreachable or misleading authorization rules caused by broader earlier rules under first-match evaluation.

## Inputs
Normalized JSON policy map, evaluation semantics, repository evidence.

## Preconditions
First-match semantics are confirmed. Each rule has explicit integer priority.

## Process
1. Run `python scripts/policy_shadow_gate.py <policy-map.json> --output artifacts/policy-shadow-result.json`.
2. For each `shadowed-deny`, confirm the earlier allow covers the same principal/action/resource space.
3. For each `shadowed-allow`, confirm the earlier deny makes the later grant unreachable.
4. For `redundant-shadow`, determine whether duplication is intentional documentation or stale configuration.
5. Trace affected routes/services and identify existing tests.
6. Propose the smallest correction: narrow scope, change priority, or remove unreachable rule.
7. Do not apply changes requiring approval without explicit human approval.
8. Re-run deterministic analysis and targeted authorization tests after edits.

## Expected output
Finding, evidence, affected component, risk, recommended action, verification status.

## Verification
Blocking findings are resolved or explicitly accepted; targeted allow/deny tests demonstrate intended behavior.

## Failure handling
Malformed policy maps are validation failures, not retryable. Tool I/O failures may be retried twice while preserving stderr and input hashes.

## Stop conditions
Stop before removing deny rules, widening privileged access, changing the default effect, or deploying policy changes.