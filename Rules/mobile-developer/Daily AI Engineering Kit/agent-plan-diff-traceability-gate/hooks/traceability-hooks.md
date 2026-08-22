# Hooks: Plan-to-Diff Traceability

## Hook: pre-edit-plan-freeze
- **Trigger:** before first source edit.
- **Preconditions:** `plan.json` exists and repository base revision is known.
- **Action:** run `python scripts/fingerprint-plan.py plan.json`; persist fingerprint with task state.
- **Expected result:** one SHA-256 fingerprint.
- **Failure:** invalid/missing plan blocks editing workflow.
- **Blocking:** yes.

## Hook: post-change-diff-inventory
- **Trigger:** after a material implementation checkpoint or before handoff.
- **Preconditions:** base/head revisions are known.
- **Action:** run `python scripts/collect-git-diff.py <base> <head> > diff-inventory.json`.
- **Expected result:** complete add/modify/delete/rename inventory with content fingerprints.
- **Failure:** retry transient Git read error once; repeated error blocks handoff.
- **Blocking:** yes.

## Hook: pre-review-traceability-validation
- **Trigger:** before code review/PR preparation/final verification.
- **Preconditions:** plan and change manifest exist.
- **Action:** run `python scripts/validate-traceability.py plan.json change-manifest.json config/traceability-policy.json > validation.json`.
- **Expected result:** `verified`, `review-required`, or `blocked` with deterministic evidence.
- **Failure:** validation blockers must be remediated or replanned; do not retry them.
- **Blocking:** yes for `blocked`.

## Hook: approval-boundary
- **Trigger:** immediately before any dangerous side effect or when manifest contains an approval-required risk category.
- **Preconditions:** current plan/manifest fingerprints exist.
- **Action:** confirm explicit human approval reference is present and bound to the intended action/scope.
- **Expected result:** approval reference is recorded in affected manifest entries.
- **Failure:** stop with `approval-required`; never widen permissions automatically.
- **Blocking:** yes.

## Hook: final-traceability-gate
- **Trigger:** immediately before reporting task completion or merge readiness.
- **Preconditions:** current validation exists; review exists when required.
- **Action:** run `python scripts/evaluate-final-gate.py plan.json change-manifest.json validation.json [traceability-review.json] > final-gate.json`.
- **Expected result:** status `verified`.
- **Failure:** preserve gate output and stop. Replanning invalidates old validation/review.
- **Blocking:** yes.
