# Skill: Verify Coordinated Rollout

## Purpose
Prove that a multi-repository rollout is safe at each checkpoint and still matches the reviewed revisions.

## Inputs
- Valid change plan.
- Current repository revisions.
- Build/test/contract evidence from each repository.
- Independent review for high/critical risk.
- Approval evidence where required.

## Preconditions
- `scripts/validate-change-plan.py` passes.
- Planned revisions are known.
- Approval-required actions have not been executed without approval.

## Procedure
1. Re-read the current revision of every repository immediately before the gate.
2. If any revision differs from the plan, stop and re-evaluate affected edges, tests, rollout, and rollback.
3. Confirm each repository marked `ready` has concrete verification evidence rather than a prose claim.
4. Check every edge. `unknown` blocks rollout. `breaking` and `requires-ordering` must obey the documented sequence.
5. Confirm required approval evidence is bound to the actual action/repository/change scope.
6. For high/critical risk, obtain review from an identity independent of the planner/implementer.
7. Run `scripts/evaluate-rollout-gate.py` with the plan and reviewer record when required.
8. Execute only the next approved checkpoint; do not batch future destructive or production steps.
9. After execution, collect fresh verification evidence and update only that repository state.
10. If verification fails, stop forward rollout and follow the rollback order/conditions.
11. Before declaring completion, mark all repositories `verified`, capture current revisions, and run `scripts/evaluate-final-gate.py`.

## Expected output
A gate result of `verified`, `review-required`, `approval-required`, or `blocked`, plus preserved evidence for any non-success state.

## Verification
Final gate exits 0 only when every repository is verified, rollout gate passed, and optional current revision bindings still match.

## Failure handling
Transient metadata/tool failure: retry once. Test/contract/revision failure: do not retry by default; preserve evidence, classify cause, and replan or rollback.

## Stop conditions
Stop on stale revision bindings, missing approval, unknown compatibility, failed required verification, non-independent high-risk review, or rollback becoming unsafe.
