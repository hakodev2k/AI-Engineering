# Skill: Tool Safety Assessment

## Purpose
Assess whether a structured agent tool is safe to expose to autonomous workflows at its declared permission level.

## When to use
After fixture execution, before enabling a new tool for agents, or when a tool's side effects/permissions change.

## Inputs
- Validated tool contract
- Normalized fixture result report
- Declared side-effect level
- Approval policy
- Known operational constraints

## Preconditions
Deterministic contract validation has passed and fixture results are available. The assessor must not be the same role that authored the final contract decision.

## Process
1. Confirm the declared side-effect level matches observed behavior.
2. Check negative fixtures reject malformed inputs deterministically.
3. Check authorization/approval failures are explicit rather than silently downgraded.
4. Check errors do not leak credentials, tokens, private payloads or stack traces containing secrets.
5. Check destructive/privileged actions require the policy-defined human approval boundary.
6. Check read-only tools do not mutate files, databases, infrastructure or remote state.
7. Check replay behavior for write tools and identify duplicate-action risk.
8. Check result/error envelopes are stable enough for agent reasoning.
9. Check unexpected fields or missing required fields in runtime results.
10. Assign `pass`, `revise`, or `blocked` with evidence references.

## Tools
Contract report, fixture report, diff/log inspection, repository policy, deterministic scripts.

## Constraints
Do not approve based only on a happy-path fixture. Do not waive missing safety fixtures because the tool "usually works".

## Expected output
A review note containing decision, observed risk, mismatches, required fixes and unresolved approvals.

## Verification
A `pass` decision requires zero undeclared side effects, zero missing required fixture classes, and no unresolved high-risk approval boundary.

## Failure handling
Transient sandbox/runtime failures may be rerun at most twice if the failure is demonstrably environmental. Semantic mismatches are not retried blindly.

## Stop conditions
Stop and mark `blocked` for undeclared destructive behavior, secret leakage, bypassed approval, or inability to distinguish success from failure reliably.