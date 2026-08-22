# Owned Diff Workflow

## Trigger
Any AI-assisted task that can mutate a Git worktree, especially when the workspace may already be dirty or multiple tools/agents share it.

## Entry conditions
- Repository is readable by Git.
- Task scope and implementation owner are known.
- No mutation has occurred yet, or the workflow must stop because a trustworthy baseline cannot be reconstructed.

## Inputs
Task request, repository, path scope, implementation owner, dangerous actions expected.

## Context
Repository rules, Git status/HEAD, generated-file conventions, relevant build/test commands.

## Stages
1. **Baseline — Workspace Curator**
   - Capture `workspace-baseline.json`.
   - Create `owned-diff-manifest.json` bound to baseline HEAD/fingerprint.
   - Check pre-existing dirty files before any edit.
2. **Plan — Implementation owner**
   - Plan changes only inside allowed paths.
   - If the task inherently requires a dirty pre-existing file, record that expectation; do not erase it.
3. **Execute — Implementation owner**
   - Make the smallest required edits.
   - Run deterministic formatting/build/test tools.
   - Record any tool known to generate files.
4. **Classify — Workspace Curator**
   - Capture `workspace-current.json`.
   - Run `derive-owned-diff.py`.
   - Hard stop on unowned paths or HEAD drift.
5. **Independent review — Workspace Reviewer**
   - Required for touched/resolved pre-existing paths.
   - Review is fingerprint-bound and invalid after workspace changes.
6. **Workspace gate**
   - Run `evaluate-workspace-gate.py`.
   - `blocked` stops; `review-required` cannot continue without fresh review.
7. **Behavior verification — Test/verification owner**
   - Run task-specific tests/build/static checks.
   - If verification mutates files, return to stage 4.
8. **Approval checkpoint**
   - Obtain explicit human approval for dangerous actions listed in the manifest.
9. **Final drift check**
   - Capture `workspace-final.json` immediately before completion.
   - Run `evaluate-final-gate.py`; only `verified` completes the task.

## Produced artifacts
Baseline/current/final snapshots, manifest, owned-diff result, optional review/approval, workspace gate, final gate, task-specific test evidence.

## Checkpoints
No edit before baseline; no verification claim before ownership classification; no completion after a stale review; no dangerous action before approval.

## Retry rules
- Transient Git/process capture failure: maximum 1 retry, preserving the first error.
- Validation, scope, HEAD drift, ownership, review, or approval failure: 0 blind retries; fix/replan and recapture.
- Build/test retry is outside this gate and must follow the task's bounded test policy.

## Failure paths
- Baseline unavailable after edits: stop; do not invent ownership history.
- Unowned path: remove only agent-created unintended work or replan scope before further edits; never discard pre-existing work automatically.
- HEAD drift: stop and create a new baseline/plan.
- Touched pre-existing path: independent review.
- Post-review drift: invalidate review and repeat classification/review.

## Approval points
Human approval before deleting/discarding pre-existing work and all other dangerous actions listed in policy/manifest.

## Definition of Done
- Baseline predates edits and is fingerprint-bound.
- Every dirty path is classified.
- No unowned task changes remain.
- All pre-existing touches have independent review.
- HEAD equals baseline HEAD for the active task epoch.
- Task-specific tests/verifications passed.
- Required approvals exist.
- Final capture equals workspace-gate current fingerprint.
- Final gate returns `verified`.
