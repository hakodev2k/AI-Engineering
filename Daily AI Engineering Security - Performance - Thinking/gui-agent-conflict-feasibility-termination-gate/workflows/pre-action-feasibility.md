# Workflow: Pre-Action Feasibility

## Trigger
Before every consequential GUI state change and after material UI-state changes.

## Goal
Prevent execution-biased overcompliance by requiring explicit feasibility evidence before action.

## Inputs
Goal, user constraints, current UI observation, proposed action, preconditions, risk, approval state.

## Baseline
Measure current agent on a mixed suite of feasible and conflict-bearing tasks: correct termination rate, false termination rate, unsupported-action rate, and average action count before termination.

## Context
Persist Facts, Assumptions, Conflicts, Preconditions, Evidence, Decision, Risks and retry count as observable orchestration state.

## Stages
1. **Observe** — capture fresh task-relevant UI state.
2. **Decompose** — identify next proposed action and its preconditions.
3. **Conflict check** — compare instruction clauses and observable environment state.
4. **Evidence check** — map each required precondition to evidence.
5. **Gate** — run `python scripts/feasibility_gate.py record.json`.
6. **Decision** — ACT, REVIEW, or STOP.
7. **Refresh** — for REVIEW, collect only missing evidence; maximum two retries.
8. **Execute** — executor performs exactly one approved action for ACT.
9. **Re-observe** — repeat from stage 1 after state changes.
10. **Verify** — independent reviewer checks correct decisions against expected outcomes.

## Responsible agent
Executor proposes actions; Feasibility Reviewer verifies feasibility and gate result; human handles required approvals.

## Tools
Read-only UI inspection, deterministic gate, benchmark harness, policy/approval interface.

## Outputs
Structured feasibility records, decisions, benchmark report, verification status.

## Checkpoints
Fresh observation before gate; explicit conflict list; all required preconditions mapped; approval checked; retry count <=2.

## Metrics
Correct conflict termination, false termination on feasible controls, unsupported actions, actions taken before stop, human escalations.

## Retry policy
At most two evidence-refresh attempts per proposed action. Each retry must target a named missing fact.

## Stop conditions
Blocking contradiction; infeasible state; approval denied; evidence unavailable after two retries; or task completed and independently verified.

## Failure path
Preserve record and evidence, STOP consequential execution, escalate to human/task coordinator. Never weaken the gate to obtain completion.

## Verification
Compare baseline and gated runs on the same mixed task set. Require fewer unsupported actions and improved correct termination without unacceptable false termination.

## Definition of Done
Evidence documented; baseline measured; gate integrated; conflict and control tests pass; retry bound enforced; risks/approvals captured; independent verification complete.
