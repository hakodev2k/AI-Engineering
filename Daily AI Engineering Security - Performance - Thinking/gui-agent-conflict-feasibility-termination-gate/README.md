# GUI Agent Conflict Feasibility Termination Gate

**Category:** Thinking

## Problem
Computer-use and GUI agents can continue acting when instructions are contradictory, infeasible, or unsupported by current interface state. This package inserts an observable feasibility state between task interpretation and state-changing action.

## Evidence
See `evidence/research.md`. Current signals include the 2026-09-03 CONFLICTGUI/CONFLICTGUARD paper, Ruflo issue #3191 from 2026-09-05, and the earlier 2026 BLIND-ACT findings on blind goal-directedness across frontier computer-use agents.

## Existing approach
Teams use prompting, model confidence, human approval, and inference-time feasibility checks. These help, but narrative instructions can be skipped and confidence does not prove that preconditions are satisfied.

## Existing limitations
Action generation and feasibility checking are often coupled; unresolved contradictions are not persistent blocking state; preconditions are not machine-checkable; stop conditions and correct-abstention tests are weak.

## Proposed improvement
Represent Facts, Assumptions, Conflicts, Preconditions, Evidence, Action, Risk, retry count and approval as explicit state. A deterministic pre-action gate allows `ACT` only when blocking conflicts are absent and required preconditions are evidenced; otherwise it emits `REVIEW` or `STOP`.

## Architecture
- `evidence/research.md` — current evidence, existing approaches, limitations and root causes.
- `skills/assess-feasibility.md` — reusable evidence-driven procedure.
- `rules/feasibility-rules.md` — enforceable reasoning/retry rules.
- `subagents/feasibility-reviewer.md` — independent reviewer role.
- `workflows/pre-action-feasibility.md` — bounded pre-action workflow.
- `hooks/pre-action-gate.md` — blocking integration hook.
- `scripts/feasibility_gate.py` — dependency-free deterministic validator.
- `tests/test_feasibility_gate.py` — conflict/control/approval tests.

## Installation
Python 3.9+; no third-party dependencies.

## Configuration
The orchestration layer must produce a JSON record with: `facts`, `assumptions`, `conflicts`, `preconditions`, `evidence`, `action`, `risk`, `retry_count`; add `approval_required` and `approval` for controlled actions.

## Usage
Run the gate before a state-changing action:

`python scripts/feasibility_gate.py record.json`

Exit code 0 means `ACT`. Exit code 4 means the structured record produced `REVIEW` or `STOP`. Exit code 2 means malformed input and is always blocking.

Run tests:

`python -m unittest tests/test_feasibility_gate.py`

## Workflow
Follow `workflows/pre-action-feasibility.md`: Observe → Decompose → Conflict check → Evidence check → Gate → ACT/REVIEW/STOP → bounded refresh → re-observe → independent verification.

## Metrics
Correct termination rate on conflict-bearing tasks; false termination rate on feasible tasks; unsupported-action rate; actions before termination; human escalation rate; retry-bound compliance.

## Verification
**Implemented:** gate, rules, workflow and tests exist. **Measured:** baseline and gated runs use the same mixed feasible/conflict benchmark. **Verified:** gated runs reduce unsupported actions and improve correct conflict termination without unacceptable false termination on feasible controls; an independent reviewer confirms results.

## Safety
The gate is fail-closed. It never executes GUI actions itself. Consequential/irreversible actions require approval by default. Missing evidence does not become permission. Hidden chain-of-thought is neither requested nor accepted as evidence.

## Failure handling
Malformed records STOP with a blocking error. Missing evidence permits at most two targeted refreshes. Unresolved conflict, denied approval, or exhausted retries STOP the proposed action and escalate according to host policy.

## Definition of Done
Evidence documented; existing approaches and limitations identified; gate integrated; baseline captured; tests pass; conflict/control metrics collected; retry bounds demonstrated; approval boundaries preserved; independent verification complete; no blocking issue remains.

## Customization
Hosts may add richer conflict types, evidence provenance, risk levels, and organization-specific approvals. They MUST preserve fail-closed behavior, explicit preconditions, bounded retries, and control-task measurement.
