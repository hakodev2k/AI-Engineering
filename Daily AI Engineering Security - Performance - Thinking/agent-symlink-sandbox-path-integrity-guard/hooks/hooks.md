# Hooks

## Hook 1 — Pre-Task Workspace Admission
**Trigger**: agent enters a repository/worktree with write capability.

**Action**: resolve configured roots and scan path aliases/worktree indirection.

**Command**:
`python scripts/scan_path_aliases.py --root . --policy config/policy.json`

**Expected result**: JSON report with `blocking_findings: 0` for autonomous-write admission.

**Failure behavior**: downgrade session to read-only/manual-approval mode; do not auto-ignore findings.

## Hook 2 — Pre-Mutation Path Validation
**Trigger**: before any file mutation, including patch, rename, delete, chmod, shell redirection, temp-file replacement, or Git helper that writes.

**Action**: evaluate lexical/canonical target against writable/protected roots and capture identity.

**Command**:
`python scripts/path_integrity_guard.py preflight --path <target> --operation <op> --policy config/policy.json --record <record.json>`

**Expected result**: exit 0 and `decision=allow`.

**Failure behavior**: block mutation. `approval-required` must be handled outside the agent by an explicit human-control surface.

## Hook 3 — Commit-Time Revalidation
**Trigger**: immediately before the mutation primitive is invoked.

**Action**: compare current path identity to preflight record and rerun trust-boundary checks.

**Command**:
`python scripts/path_integrity_guard.py commit-check --record <record.json> --policy config/policy.json`

**Expected result**: exit 0 and `decision=allow`.

**Failure behavior**: discard authorization and require a new preflight. Maximum one automatic re-preflight.

## Hook 4 — Post-Mutation Containment Check
**Trigger**: immediately after successful mutation.

**Action**: run a fresh read-only preflight/status check and record canonical destination.

**Command**:
`python scripts/path_integrity_guard.py inspect --path <target> --policy config/policy.json`

**Expected result**: canonical target remains inside the previously authorized writable root and outside protected roots.

**Failure behavior**: stop autonomous writes and start incident workflow.

## Hook 5 — Final Verification
**Trigger**: before declaring a path-security change complete.

**Action**: run regression suite and alias scan.

**Commands**:
- `python -m unittest tests/test_path_integrity_guard.py`
- `python scripts/scan_path_aliases.py --root . --policy config/policy.json`

**Expected result**: tests pass and scanner has no unexplained blocking findings.

**Failure behavior**: package/status remains `Implemented` or `Measured`; never mark `Verified`.
