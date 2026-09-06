# Workflow: Observe, Verify Feasibility, Act

## Trigger
Before consequential GUI actions and whenever the runtime detects a contradiction, unavailable target, blocking dialog, changed interface state, or long-horizon mismatch between the requested goal and available options.

## Goal
Prevent execution-biased overcompliance by making feasibility an explicit blocking orchestration decision.

## Inputs
User goal, exact constraints, allowed deviations, current GUI evidence, proposed action, persisted conflicts, consequence level.

## Baseline
Run a representative local case set before integration and record: conflict-case unsafe-action rate, feasible-task success rate, false-stop rate, escalation rate, and lost-conflict count across resume/handoff.

## Context
Use `skills/verify-feasibility-before-action.md` and enforce `rules/conflict-aware-action-rules.md`.

## Stages
1. **Observe** — collect fresh, non-mutating UI evidence relevant to the next action.
2. **Measure baseline state** — normalize facts, constraints, prior conflicts, proposed action, evidence completeness, and consequence level.
3. **Diagnose** — compare required constraints against observed facts; create/update conflict records.
4. **Form decision hypothesis** — determine whether evidence supports PROCEED, STOP, or ESCALATE.
5. **Gate** — run `scripts/feasibility_gate.py`; the acting agent cannot override its blocking result.
6. **Act** — only after PROCEED, execute exactly the proposed action.
7. **Measure again** — immediately re-observe the UI and verify expected postcondition.
8. **Recover if needed** — if expected state is not reached, refresh evidence and re-evaluate at most 2 times; do not replay a consequential action blindly.
9. **Independent verification** — `subagents/feasibility-verifier.md` evaluates conflict and feasible controls.
10. **Complete** — record Implemented, Measured, Verified separately.

## Responsible agent
Acting agent for observation/proposal; deterministic gate for decision enforcement; independent feasibility verifier for final verification.

## Tools
GUI observation, accessibility/DOM readers, non-mutating queries, Python 3 feasibility gate, structured event log, explicit human approval channel where needed.

## Outputs
Feasibility envelope, gate decision, action/postcondition record, persisted conflict state, regression metrics, verification record.

## Checkpoints
- Before each consequential action.
- After any UI state transition that invalidates earlier evidence.
- After a retry/handoff/resume.
- Before declaring task success.

## Metrics
- Unsafe consequential actions in blocking-conflict cases: 0.
- Lost unresolved conflicts across transitions: 0.
- Feasible-task success: no unacceptable regression versus baseline.
- False-stop rate: below team-defined threshold.
- Retry count per unresolved state: <=2 without human authorization.

## Retry policy
Maximum 2 evidence-refresh/re-evaluation attempts for the same unresolved state. Each retry MUST add fresh evidence. Repeating the same action or observation without new information is prohibited.

## Stop conditions
Blocking conflict, impossible goal under fixed user constraints, evidence still incomplete after 2 attempts, required approval unavailable, or an unexpected consequential side effect.

## Failure path
Detection: gate STOP/ESCALATE, postcondition mismatch, lost conflict state, or verifier failure. Evidence: preserve structured envelope and sanitized observations. Fallback: stop mutation and return to evidence-gathering or human decision. Escalation: runtime owner/human approver. Do not weaken constraints to force progress.

## Verification
Use both conflict-laden and feasible control cases. Verify gate outputs and actual runtime enforcement; a model saying it would stop is not sufficient.

## Definition of Done
Current evidence documented; baseline metrics captured; explicit constraints represented; conflicts persisted; deterministic gate integrated; blocked cases cannot execute prohibited actions; feasible controls remain within accepted regression thresholds; bounded retry behavior demonstrated; independent verification complete; no blocking issue remains.
