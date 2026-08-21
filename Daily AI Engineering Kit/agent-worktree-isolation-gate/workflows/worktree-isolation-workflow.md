# Worktree Isolation Workflow

## Trigger
Any mutating AI-assisted repository task that may overlap in time with another task, agent, automation, or human checkout.

## Entry conditions
- Exact repository and base revision are identifiable.
- Task scope can be expressed as allowed path globs.
- Git worktree support is available or equivalent isolated checkout can be provided.
- Risk is classified.

## Inputs
Task/session ID, actor ID, repository, base revision, branch, worktree path, allowed paths, risk, policy, active-session registry.

## Context
Repository/worktree metadata, scoped source/tests, current diff, active session metadata, build/test evidence. Expand source context only as the implementation itself requires.

## Flow
```text
Trigger
  ↓
Register session + inspect active ownership
  ↓
Create/validate dedicated branch & worktree
  ↓
Capture clean start
  ↓
Implement in isolated checkout
  ↓
Capture current state + changed paths
  ↓
Working-phase isolation evaluation
  ├─ blocked → freeze → reconcile collision → fresh capture
  ├─ review-required → independent review when required
  └─ pass
  ↓
Run task-specific tests/build in same exact worktree/revision
  ↓
Recapture HEAD/state + final-phase evaluation
  ↓
Final isolation gate
  ↓
Verified handoff to integration owner
```

## Stages
1. **Register** — Worktree Coordinator creates the session record and checks branch/path uniqueness.
2. **Isolate** — create/validate a dedicated branch/worktree from exact base revision.
3. **Baseline** — run `scripts/capture-worktree-state.py`; clean-start violations block.
4. **Execute** — implementation agent works only in the session worktree and allowed scope.
5. **Inventory** — produce changed-path list from Git, e.g. `git diff --name-only <base>...HEAD` plus intended uncommitted changes when applicable.
6. **Working evaluation** — run `scripts/evaluate-isolation.py --phase working` against active sessions. This can be used before tests while the session may still contain intended working state.
7. **Reconcile** — on blocker, freeze edits and use `skills/reconcile-cross-worktree-collision.md`. No blind cleanup.
8. **Verify implementation** — run task-specific build/tests in this exact worktree. Record exact HEAD, commands, and relevant state.
9. **Final capture** — recapture state, regenerate changed paths, then run `scripts/evaluate-isolation.py --phase final`. `require_clean_handoff` is enforced here; working-phase reports are not accepted by the final gate.
10. **Review** — high/critical or warning-bearing final reports receive fingerprint-bound independent review.
11. **Final gate** — Isolation Verifier runs `scripts/verify-final-gate.py` against the final report. The gate verifies report self-integrity and exact session/policy fingerprints.
12. **Handoff** — provide exact branch, HEAD, worktree, changed paths, test evidence, report fingerprint, and residual risks to integration owner.

## Produced artifacts
- Session record matching `schemas/worktree-session.schema.json`
- Before/final worktree-state JSON
- Changed-path text file
- Isolation report matching `schemas/isolation-report.schema.json`
- Optional review matching `schemas/isolation-review.schema.json`
- Build/test evidence bound to exact HEAD

## Checkpoints
- Before first edit: unique branch/worktree and clean start.
- Before tests: no deterministic collision blocker in a working-phase report.
- Before final gate: task-specific verification corresponds to exact current HEAD/worktree; final-phase report is fresh and clean-handoff policy is satisfied.
- Before integration: verified handoff exists.

## Retry rules
- Transient read-only Git/tool failure: maximum 1 retry; preserve first error.
- Validation/collision failure: 0 blind retries; remediation creates a new evaluation cycle.
- Build/test failure: 0 automatic isolation retries; preserve output and return to implementation workflow.
- Permission/environment failure: 0 retries unless the environment changes explicitly.

## Stop conditions
Stop when ownership is ambiguous, another session shares branch/worktree, overlapping paths are unresolved, scope drift exists, current state cannot be inspected, final handoff is dirty when policy requires cleanliness, or remediation would require destructive Git/file action without approval.

## Approval points
Explicit human approval is required before force push/history rewrite, deleting changed worktrees/files, destructive SQL, DB schema changes, production deployment/config, infrastructure/secret changes, breaking API/security changes, irreversible migrations, or large dependency upgrades.

## Failure paths
- Collision → freeze + preserve both sides + coordinator/human ownership decision.
- Dirty start → allocate fresh isolation or escalate; do not clean automatically.
- Dirty final handoff → commit/resolve only agent-owned intended changes using the normal repository workflow; do not clean/reset unrelated work automatically.
- Scope drift → remove only clearly agent-owned unintended changes safely or obtain explicit scope change; regenerate evidence.
- Stale review/test evidence → rerun against current exact state.
- Session/policy/report integrity mismatch → regenerate report/review; never patch fingerprints manually.

## Definition of Done
- One unique session maps to one dedicated branch and worktree.
- No unresolved collision or out-of-scope changed path exists.
- Final handoff cleanliness satisfies policy.
- Task-specific tests/build were executed in the same exact worktree and final relevant revision.
- Current final-phase isolation report is non-blocked and self-integrity-valid.
- Required independent review is approved and fingerprint-bound.
- Final gate returns `verified`.
- Dangerous actions, if actually performed, had explicit approval.
- Handoff contains exact branch/HEAD/worktree, evidence, and residual risks.
