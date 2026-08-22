# Workflow: Coordinated Multi-Repo Change

## Trigger
A feature, fix, migration, package update, API/schema change, infrastructure change, or release requires coordinated changes across two or more repositories.

## Entry conditions
- Objective and acceptance criteria are known.
- Participating repositories are accessible.
- Production/destructive work has not started.

## Inputs
Change objective, repo URLs/names, immutable revisions, relevant contracts/tests, risk classification, deployment environments.

## Context
Load repository structure and directly relevant producer/consumer contracts first. Expand only when evidence identifies another dependency.

## Stages
1. **Discover** — Coordination Planner binds repositories to revisions and identifies contract surfaces.
2. **Graph** — Planner creates directed dependency edges and compatibility classifications.
3. **Plan** — Planner defines repository changes, rollout, rollback, verification, and approval actions.
4. **Validate** — Run `python scripts/validate-change-plan.py <plan.json>`.
5. **Fingerprint** — Run `python scripts/fingerprint-plan.py <plan.json> --output plan-fingerprint.json`.
6. **Review** — High/critical risk goes to Coordination Reviewer. Reviewer output must match `schemas/review.schema.json` and bind the exact fingerprint.
7. **Readiness Gate** — Run `python scripts/evaluate-rollout-gate.py <plan.json> --review <review.json> --output rollout-gate.json` when review is required.
8. **Approval Checkpoint** — Stop before any approval-required action. Resume only with explicit scope-bound approval evidence in the plan.
9. **Execute One Checkpoint** — Apply only the next repository/action in rollout order.
10. **Verify Checkpoint** — Run that repository's documented build/test/contract checks; update state only from evidence.
11. **Continue or Roll Back** — On success, repeat stages 8–10 for the next checkpoint. On required verification failure, stop forward rollout and execute rollback order/conditions.
12. **Final Revision Refresh** — Capture current revisions for every repository. Any drift requires affected replan/review.
13. **Final Gate** — Mark each repository `verified`, then run `python scripts/evaluate-final-gate.py <plan.json> <rollout-gate.json> --current-revisions current-revisions.json`.

## Responsible agents
- Coordination Planner: stages 1–5.
- Coordination Reviewer: stage 6 for high/critical risk.
- Human/release owner: approval-required actions and actual production execution.
- Verification owner: checkpoint and final verification; for high risk this must not be only the implementer.

## Produced artifacts
Change plan, plan fingerprint, review record when required, rollout gate result, current revision snapshot, checkpoint evidence, final gate result.

## Checkpoints
- After deterministic plan validation.
- After independent review.
- Before every approval-required action.
- After every rollout repository.
- Before final completion.

## Retry rules
- Transient repository metadata/tool failure: maximum 1 retry; preserve source, error, and attempt evidence.
- Validation failure, unknown compatibility, test/build failure, revision drift, approval failure: no blind retry. Replan, fix, review, or rollback.
- Repeated transient failure after retry: stop and escalate with evidence.

## Stop conditions
Unknown compatibility, dependency cycle without migration strategy, stale review fingerprint, revision drift, missing approval, failed required verification, unsafe rollback, or inaccessible required repository.

## Approval points
Explicit human approval is mandatory for production deploy, breaking contracts, database schema/destructive changes, force-push/history rewrite, infrastructure/secret/production-config changes, security weakening, irreversible migration, and large dependency upgrades.

## Failure paths
- Pre-execution failure: block rollout and preserve plan/evidence.
- Mid-rollout verification failure: stop forward progress and evaluate rollback from the last verified checkpoint.
- Rollback failure: stop further mutation and escalate; do not improvise destructive recovery.

## Definition of Done
All repository revisions still match reviewed bindings, all participating repositories are `verified`, required approvals exist, all required checkpoint evidence exists, compatibility is known, rollback remains documented, and final gate exits 0.
