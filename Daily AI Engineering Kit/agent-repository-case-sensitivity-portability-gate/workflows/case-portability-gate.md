# Workflow: Repository Case Portability Gate

## Trigger

A task adds, moves, renames, regenerates, or edits source files/imports, or reaches a pre-completion checkpoint.

## Entry conditions

Repository root and policy are available; dangerous repair actions have not begun without approval.

## Inputs

Repository tree, Git index when available, `config/policy.json`, parent task acceptance criteria.

## Stages

1. **Collect context — owning agent**: identify changed paths and expected build/test commands.
2. **Scan — deterministic script**: run `scripts/case_portability_gate.py` and save JSON evidence.
3. **Classify — Repository Portability Reviewer**: separate blocking collisions/mismatches from unresolved-import warnings.
4. **Plan repair — reviewer**: establish canonical casing and smallest repair set.
5. **Approval checkpoint — human when required**: stop before destructive deletion, history rewrite, force push, broad generated-file rewrite, or other parent-workflow dangerous action.
6. **Repair — implementation owner**: apply the minimal reference edit or Git-aware rename.
7. **Rescan — deterministic script**: rerun after every repair.
8. **Test/build — implementation owner**: run targeted and repository-required checks.
9. **Verify — Verification Agent**: validate current report, final tracked paths, diff scope, tests, and approvals.
10. **Complete — parent task**: only after both portability and parent acceptance criteria pass.

## Produced artifacts

Case portability report, diagnosis, repair diff, build/test evidence, verification record, and approval record if applicable.

## Checkpoints

The scanner is blocking when status is `fail`, `invalid`, or `error`. Approval-required actions stop before execution.

## Retry rules

- Scanner invalid input: one retry after deterministic correction.
- Repair failure: maximum 2 repair cycles.
- Build/test failure caused by the repair: maximum 2 fix/retest cycles.
- Tool transport failure with no side effects: maximum 2 retries.

Preserve reports, diffs, and test output across retries. Stop when retry bounds are exhausted.

## Failure paths

Ambiguous canonical casing, generated-file ownership, inaccessible Git state, policy corruption, unresolved destructive collision, or unexplained side effects require escalation. Do not increase permissions or weaken the policy to proceed.

## Definition of Done

- Current-tree scanner report is `pass`.
- Blocking findings are zero.
- Canonical path casing is represented in tracked files and references.
- Required build/tests pass after the last repair.
- Diff contains no unexplained path churn.
- Required approvals exist.
- Remaining warnings/risks are recorded.