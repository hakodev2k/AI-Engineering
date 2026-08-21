# Hooks: Multi-Repo Coordination Lifecycle

## Pre-plan repository binding
- **Trigger:** before graph construction.
- **Preconditions:** repository list is known.
- **Action:** record immutable revision for every repository.
- **Expected result:** no repository is represented only by a moving branch name.
- **Failure behavior:** block planning if a revision cannot be resolved.
- **Blocking:** yes.

## Post-plan validation
- **Trigger:** after change plan creation/edit.
- **Action:** `python scripts/validate-change-plan.py <plan.json>`.
- **Expected result:** exit 0 and valid acyclic dependency/order/rollback structure.
- **Failure behavior:** return to planning; no rollout gate.
- **Blocking:** yes.

## Pre-review fingerprint
- **Trigger:** immediately before reviewer handoff.
- **Action:** `python scripts/fingerprint-plan.py <plan.json> --output plan-fingerprint.json`.
- **Expected result:** reviewer binds to current SHA-256 fingerprint.
- **Failure behavior:** block review.
- **Blocking:** yes.

## Pre-rollout gate
- **Trigger:** before first rollout checkpoint and after any plan/revision change.
- **Action:** `python scripts/evaluate-rollout-gate.py <plan.json> --review <review.json> --output rollout-gate.json` when review is required.
- **Expected result:** `verified` or explicit non-success state.
- **Failure behavior:** do not execute forward rollout.
- **Blocking:** yes.

## Pre-dangerous-action approval
- **Trigger:** before production deploy, breaking contract, schema/destructive data change, force-push, infra/secret/prod-config change, security weakening, irreversible migration, or large upgrade.
- **Action:** validate explicit human approval is bound to actual repository/action/scope.
- **Expected result:** matching approval evidence exists.
- **Failure behavior:** stop before side effect.
- **Blocking:** yes.

## Post-checkpoint verification
- **Trigger:** after each repository rollout action.
- **Action:** run repository-specific build/test/contract checks from the plan and preserve evidence.
- **Expected result:** only evidence-backed state transition to `verified` or documented next safe state.
- **Failure behavior:** stop forward rollout and enter rollback decision path.
- **Blocking:** yes.

## Final revision and completion gate
- **Trigger:** before declaring coordinated change complete.
- **Action:** refresh current revisions, then run `python scripts/evaluate-final-gate.py <plan.json> <rollout-gate.json> --current-revisions current-revisions.json`.
- **Expected result:** exit 0 / `verified`.
- **Failure behavior:** block completion and replan/re-review affected drift.
- **Blocking:** yes.
