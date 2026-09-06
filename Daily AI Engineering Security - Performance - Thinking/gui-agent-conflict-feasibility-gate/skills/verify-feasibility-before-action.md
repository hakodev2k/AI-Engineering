# Skill: Verify Feasibility Before GUI Action

## Purpose
Convert ambiguous or conflicting GUI-task state into an observable decision before an agent executes a consequential action.

## Trigger
Run before destructive, irreversible, financial, account, configuration, permission, submission, or externally visible GUI actions; also run whenever the agent detects a mismatch between requested constraints and the current interface state.

## Inputs
- User goal.
- Explicit task constraints and allowed deviations.
- Current observed GUI facts.
- Proposed action.
- Known conflicts.
- Evidence completeness.
- Action reversibility and consequence level.

## Preconditions
The agent MUST have a fresh observation relevant to the proposed action. Stale screenshots or remembered UI state MUST NOT be treated as current evidence for consequential actions.

## Required context
Facts, task constraints, permitted alternatives, current UI observations, previous unresolved conflicts, and whether human approval is available.

## Allowed tools
GUI observation tools, accessibility-tree readers, DOM readers, non-mutating queries, `scripts/feasibility_gate.py`, and human approval channels when required.

## Constraints
- MUST NOT request or expose hidden chain-of-thought.
- MUST represent reasoning as observable Facts, Constraints, Conflicts, Decision, Risks, and Verification status.
- MUST NOT substitute the closest available option unless the user explicitly allowed deviation.
- MUST NOT clear an unresolved conflict merely because an action is syntactically possible.
- MUST require human approval before an irreversible action when feasibility cannot be proven.

## Procedure
1. Normalize the user's exact goal and constraints into a structured envelope.
2. Capture fresh GUI evidence relevant to the next proposed action.
3. Compare every required constraint against observed state.
4. Record each mismatch as a conflict with severity `blocking` or `advisory` and a stable identifier.
5. Mark evidence completeness. If required state is not observable, mark incomplete instead of guessing.
6. Classify the proposed action as reversible or irreversible/consequential.
7. Run `scripts/feasibility_gate.py` against the envelope.
8. If `PROCEED`, execute only the approved proposed action and immediately re-observe state.
9. If `STOP`, terminate that execution path and report the specific unsatisfied constraint.
10. If `ESCALATE`, request an explicit human decision or gather missing non-mutating evidence; do not execute the consequential action.
11. Persist unresolved conflict identifiers across steps, retries, subagents, and resume points until evidence explicitly resolves them.

## Decision points
- Blocking conflict present: STOP.
- Evidence incomplete + irreversible/consequential action: ESCALATE.
- Evidence incomplete + reversible low-risk observation/navigation: MAY proceed only if it cannot violate a task constraint.
- No blocking conflicts + complete evidence: PROCEED.

## Expected output
A structured feasibility decision with status, blocking/advisory conflicts, evidence completeness, proposed action, and verification status.

## Metrics
- Consequential actions executed with unresolved blocking conflicts: target 0.
- Conflict cases correctly stopped/escalated: target 100% on the local regression set.
- Feasible-task false-stop rate: define and keep below the team's accepted threshold.
- Unresolved conflicts lost across a step/resume boundary: target 0.

## Verification
A separate verifier MUST execute both feasible and conflict-laden cases and confirm the runtime blocks prohibited actions without degrading normal-task completion beyond the accepted threshold.

## Failure handling
Detection: invalid envelope, stale/missing evidence, unresolved blocking conflict, or unexpected action despite STOP/ESCALATE. Preserve structured evidence. Retry evidence collection at most 2 times when freshness/visibility is the issue. Otherwise stop and escalate.

## Stop conditions
Stop when a blocking conflict exists, required evidence cannot be obtained within 2 bounded attempts, the task becomes impossible under the user's constraints, or a required human approval is unavailable.
