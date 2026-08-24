# Skill — Approval Evidence Review

## Purpose
Determine whether an approval request gives a decision-maker enough visible evidence to safely approve the exact action being requested.

## Trigger
Run before any approval UI is rendered and during regression review of approval-producing components.

## Inputs
- Normalized approval payload.
- Policy-engine output.
- UI/render snapshot or normalized rendered fields.
- Audit/log record.

## Preconditions
The approval request has a stable request ID and the action has not executed.

## Required context
Action/tool name, concrete target, requested permission scope, rationale/risk explanation, reviewer identity/type, and the user-visible representation.

## Allowed tools
Read-only schema inspection, UI snapshot inspection, structured log comparison, local deterministic validation.

## Constraints
- MUST NOT approve an action.
- MUST NOT infer missing scope from prose.
- MUST NOT substitute a generic risk label for the concrete target.
- MUST treat automated and human approvals with the same evidence-integrity requirement.

## Procedure
1. Capture the producer payload before rendering.
2. Normalize `action`, `target`, `scope`, `rationale`, `decision`, `requires_human`, and `human_visible`.
3. Validate structural completeness using `scripts/approval_evidence_guard.py`.
4. Compare producer values with UI-visible values field by field.
5. Compare producer values with the persisted audit record.
6. Classify any mismatch as omission, mutation, stale-value, cross-surface divergence, or non-actionable approval state.
7. For an affirmative path, fail closed if action, target, scope, or rationale is absent or if the human-required request is not actually visible.
8. Record evidence and the exact blocking reason.

## Decision points
- If the action is non-sensitive and no approval is required, return `not_applicable`.
- If an affirmative choice exists but required evidence is missing, return `block`.
- If UI and audit data both match the policy payload, return `pass`.
- If only telemetry is missing, return `block_for_verification`; absence of audit evidence prevents a verified result.

## Expected output
A structured record containing status, request ID, missing fields, mismatched fields, and verification evidence.

## Metrics
Evidence-complete approval rate, cross-surface mismatch rate, blank-prompt count, and audit parity rate.

## Verification
A different verifier must replay at least one complete and one intentionally incomplete approval fixture and confirm the same result.

## Failure handling
On parser/schema errors, preserve the raw payload, return a blocking error, and do not downgrade the requirement.

## Stop conditions
Stop when the request is blocked, or when producer → transport → UI → audit parity is proven for the request.
