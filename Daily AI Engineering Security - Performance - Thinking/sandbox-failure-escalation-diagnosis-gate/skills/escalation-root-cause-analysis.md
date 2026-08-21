# Skill: Escalation Root-Cause Analysis

## Purpose
Determine whether a sandbox/tool failure justifies broader permissions or instead indicates a runtime/helper/configuration failure that escalation will not fix.

## Trigger
Before any retry that weakens sandboxing, expands filesystem/network access, or invokes an approval reviewer because a prior sandboxed attempt failed.

## Inputs
Requested operation, target paths/resources, configured sandbox boundary, raw failure, tool/helper identity, recent matching failures, prior escalation outcomes.

## Preconditions
The original failure evidence is preserved and the effective sandbox boundary is known.

## Required context
Facts about paths/resources and runtime state. Do not request hidden chain-of-thought.

## Allowed tools
Path/boundary inspection, read-only environment diagnostics, structured failure-signature matcher, deterministic tests, logs.

## Constraints
Never infer “needs escalation” solely from a nonzero exit code, access error, timeout, or helper startup failure. Never weaken permissions to make diagnostics pass.

## Procedure
1. Record Facts: requested action, target resources, effective boundary, raw error.
2. Record Assumptions explicitly and mark unverified ones.
3. Generate bounded hypotheses: genuine boundary crossing; helper/runtime failure; transient approval failure; target-created ACL/permission anomaly; unknown.
4. Test the cheapest safe discriminators first.
5. Hash/signature-match against recent failures.
6. If target is inside the allowed boundary and the failure occurs before target access, classify as runtime/helper failure unless contrary evidence exists.
7. Permit escalation only when evidence shows the requested action requires a boundary outside the current grant and policy allows it.
8. After escalation, verify whether the original failure signature disappeared; approval alone is not remediation.

## Decision points
- Genuine boundary crossing with evidence: hand off to approval policy.
- Runtime/helper failure: block repeated escalation and use bounded fallback/repair workflow.
- Approval timeout: one retry maximum, then human/operator path.
- Unknown: one diagnostic attempt, then stop.

## Expected output
Structured record with Facts, Assumptions, Hypotheses, Evidence, Decision, Risks, Verification status, failure signature, and retry budget.

## Metrics
Repeated escalation rate, escalation-success-but-same-failure rate, auto-review calls per task, unsupported conclusions, rework loops.

## Verification
Independent verifier checks that every escalation cites boundary evidence and that repeated signatures trigger the circuit breaker.

## Failure handling
If boundary information is missing, do not escalate automatically; return indeterminate/BLOCK.

## Stop conditions
Stop after two diagnostic cycles, one approval-timeout retry, or any repeated escalation that leaves the same failure signature intact.