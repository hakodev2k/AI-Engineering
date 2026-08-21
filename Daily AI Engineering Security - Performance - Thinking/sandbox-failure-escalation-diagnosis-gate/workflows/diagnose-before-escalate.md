# Workflow: Diagnose Before Escalate

## Trigger
A sandboxed tool/command fails and the agent proposes retrying with broader permissions or an approval reviewer.

## Goal
Determine the real failure class before permission expansion and stop repeated escalation when it does not remediate the cause.

## Inputs
Original operation, effective sandbox boundary, raw failure, target resources, prior matching attempts, approval history.

## Baseline
Record failure signature, current privilege level, target-resource location, reviewer calls, latency, and whether the operation succeeds outside the sandbox in a controlled environment when known.

## Context
Use observable Facts, Assumptions, Hypotheses, Evidence, Decision, Risks, Verification status.

## Stages
1. Observe the raw failure without interpreting it.
2. Measure boundary relationship and capture signature.
3. Form up to four explicit hypotheses.
4. Run safe discriminating diagnostics.
5. Decide: genuine boundary crossing, runtime/helper failure, approval failure, or unknown.
6. If escalation is justified, obtain required approval and perform one attempt.
7. Verify whether the original operation succeeds and whether the signature disappears.
8. If not improved, open circuit breaker and re-evaluate; do not repeat escalation.
9. Independent Escalation Verifier reviews the record.

## Responsible agent
Primary agent diagnoses/implements safe fallback; Escalation Verifier independently verifies.

## Tools
`scripts/escalation_trace_checker.py`, read-only sandbox diagnostics, task-specific tests.

## Outputs
Structured diagnosis record, before/after metrics, circuit-breaker state, verification report.

## Checkpoints
No escalation before boundary evidence. No second escalation for the same signature without explicit human reset. No completion without postcondition verification.

## Metrics
Escalations/task, repeated-signature escalations, auto-review calls/task, successful-remediation rate, diagnostic cycles, rework rate.

## Retry policy
Maximum two diagnosis cycles; maximum one escalation attempt per failure signature after evidence is established; approval timeout may be retried once.

## Stop conditions
Stop on unknown boundary, dangerous irreversible action without human approval, repeated same signature after escalation, or exhausted diagnostic budget.

## Failure path
Checkpoint evidence, preserve least privilege, select a safe non-escalating fallback if validated, otherwise escalate to human/operator with an indeterminate result.

## Verification
Task postcondition must pass and original failure signature must be absent. Approval response alone is insufficient.

## Definition of Done
Evidence documented, boundary measured, hypothesis tested, escalation justified or rejected, loops bounded, task result verified, independent verifier passes, and no blocking issue remains.