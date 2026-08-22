# Verification Report

## Implemented

- Deterministic Git-state capture from execution cwd.
- Canonical repository top-level, worktree path, Git common directory, HEAD OID, branch/detached state, upstream, and dirty-state inspection.
- Context contract capture and validation.
- Operation-specific gates for write, commit, push, patch application, and branch mutation.
- Patch-base OID and clean-destination checks.
- Fail-closed mismatch reason codes.
- Skills, rules, subagent boundaries, workflows, hooks, and integration guidance.
- Unit/regression tests covering the primary mismatch classes.

## Measured

The package ships deterministic tests but does not claim production incident-rate improvement before deployment. Teams should baseline and measure:

- `context_checks_total`;
- `context_blocks_total{reason}`;
- `resume_context_mismatch_rate`;
- `mutations_without_fresh_gate` (target 0);
- `wrong_context_mutation_incidents` (target 0);
- `patch_base_mismatch_blocks`;
- `partial_patch_incidents` (target 0);
- `false_block_rate`.

## Verified by included tests

`tests/test_worktree_context_guard.py` verifies:

1. capture/check in a real temporary Git repository;
2. wrong worktree path is blocked;
3. wrong branch is blocked;
4. wrong Git common directory is blocked;
5. stale destination HEAD blocks patch application;
6. dirty destination blocks patch application.

Run:

```bash
python -m unittest tests/test_worktree_context_guard.py
```

## Production verification checklist

- Run tests with the target Git/Python versions.
- Test main checkout and linked worktree paths.
- Test nested cwd inside approved worktree.
- Test a deliberate cwd switch to another linked worktree and confirm pre-write block.
- Test branch switch after contract capture and confirm block until explicit recapture.
- Test detached HEAD behavior against local policy.
- Test source/destination patch OID mismatch and confirm no patch bytes are applied.
- Verify push/branch-mutation approval is enforced by the host in addition to context PASS.
- Inspect logs to ensure no credentials or repository file content are recorded.

## Definition of verified deployment

Deployment is verified only when all package tests pass, every mutation path is instrumented with the gate, resume/reconnect invalidates cached context, high-risk approval boundaries remain intact, and deliberate mismatch simulations are blocked before mutation.