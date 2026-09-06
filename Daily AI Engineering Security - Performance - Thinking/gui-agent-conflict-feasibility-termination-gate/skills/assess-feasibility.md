# Skill: Assess Action Feasibility

## Purpose
Separate feasibility verification from GUI action generation so contradictory or unsupported tasks terminate or escalate before consequential execution.

## Trigger
Before a GUI agent performs a state-changing action, and again whenever visible state, user constraints, or task preconditions materially change.

## Inputs
Task goal; current observable GUI facts; explicit user constraints; required preconditions; proposed next action; action reversibility/risk; evidence references.

## Preconditions
The agent MUST have a fresh observation of the relevant UI state. Required preconditions MUST be named rather than assumed.

## Required context
Facts, Assumptions, Conflicts, Preconditions, Evidence, proposed Action, Risk, and current retry count.

## Allowed tools
Read-only GUI observation, DOM/accessibility inspection, screenshots, deterministic `scripts/feasibility_gate.py`, and human review when needed.

## Constraints
Do not request hidden chain-of-thought. Do not reinterpret an unresolved conflict as permission. Do not perform consequential actions to discover whether they were feasible.

## Procedure
1. Record observable Facts separately from Assumptions.
2. Enumerate instruction-internal conflicts and instruction-versus-environment conflicts.
3. List preconditions required by the proposed action.
4. Attach evidence for each required precondition.
5. Classify action risk as reversible, consequential, or irreversible.
6. Run the deterministic gate over the structured record.
7. `ACT` only when there are no blocking conflicts, all required preconditions have evidence, and approval requirements are satisfied.
8. `REVIEW` when evidence is incomplete but can be safely refreshed or human clarification/approval is required.
9. `STOP` when the goal is contradictory, infeasible, or retries are exhausted.

## Decision points
Missing evidence → REVIEW. Blocking contradiction → STOP. Consequential action without required approval → REVIEW. Complete evidence and no conflicts → ACT.

## Expected output
A structured feasibility record and one observable decision: ACT, REVIEW, or STOP.

## Metrics
Conflict detection rate on benchmark tasks; correct termination rate; false termination rate on feasible tasks; unsupported-action rate; bounded-retry compliance.

## Verification
Evaluate on both conflict-bearing and feasible controls. Improvement requires higher correct termination without unacceptable degradation on feasible tasks.

## Failure handling
Malformed records block action. Evidence refresh retries are limited to two. After two unresolved refreshes, STOP or hand off to a human according to risk.

## Stop conditions
Blocking conflict found; required evidence cannot be obtained within two retries; human approval denied; or action passes the gate and executes once.
