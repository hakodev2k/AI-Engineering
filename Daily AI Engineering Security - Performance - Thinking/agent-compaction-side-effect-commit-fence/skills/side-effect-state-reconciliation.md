# Skill: Side-Effect State Reconciliation
## Purpose
Determine whether every mutating tool action has a durable, externally evidenced terminal state before context compaction.
## Trigger
Automatic/manual compaction, session rotation, interrupted tool execution, or recovery after a crash.
## Inputs
Side-effect ledger, tool classification, external state query, idempotency metadata.
## Preconditions
Read-only access to relevant external state; mutation policy exists.
## Required context
Action IDs, expected effects, confirmation evidence. Hidden chain-of-thought is neither required nor requested.
## Allowed tools
Read-only database/API queries, logs, filesystem metadata, deterministic fence script.
## Constraints
MUST NOT infer commit from model text. MUST NOT blindly replay indeterminate mutations. MUST preserve least privilege.
## Procedure
1. Classify each action as read-only or mutating.
2. Record Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, Verification status.
3. For each mutating action, match durable evidence to its action ID.
4. Mark `confirmed`, `failed`, or `indeterminate`; do not collapse uncertainty.
5. Run `scripts/compaction_fence.py`.
6. If `defer`, refresh state once and rerun.
7. If still unresolved, escalate; if `allow`, proceed to independent verification.
## Decision points
`issued/executing` => defer. `indeterminate` without idempotency => escalate. `confirmed` without durable evidence => defer.
## Expected output
Ledger plus deterministic admission decision.
## Metrics
Confirmation coverage, indeterminate rate, duplicate replay rate, deferral duration.
## Verification
A different agent/operator validates sampled external effects.
## Failure handling
One refresh retry only. Preserve logs and stop on conflicting evidence.
## Stop conditions
No automated looping beyond one state refresh; irreversible uncertainty requires human approval.
