# Core Skills

## Skill 1 — Path Trust Classification

**Purpose**: decide whether an agent-requested filesystem mutation is safe before any bytes are changed.

**Trigger**: any create, overwrite, rename, delete, chmod, symlink, worktree, patch, or shell-redirection operation.

**Inputs**: requested path, operation type, working directory, policy, active workspace roots, protected roots.

**Preconditions**: policy loaded successfully; roots are absolute after expansion; filesystem metadata can be queried.

**Required context**: lexical path, canonical parent path, canonical target when it exists, symlink chain, device/inode metadata when supported.

**Tools**: `scripts/path_integrity_guard.py preflight`, filesystem metadata APIs.

**Procedure**:
1. Normalize the requested path without treating normalization as authorization.
2. Expand the nearest existing ancestor and resolve every symlink in that ancestor chain.
3. Record lexical path and canonical path separately.
4. Determine the writable root containing the canonical target/parent.
5. Reject if canonical identity escapes all writable roots.
6. Reject if canonical identity intersects a protected root.
7. Inspect each path component for symlink transitions and broken links.
8. Apply explicit symlink-root exceptions only when configured.
9. Capture parent and existing-target identity for commit revalidation.
10. Emit a signed-by-process decision object (not a cryptographic signature): decision, reason, identities, matched root, operation.

**Decisions**: `allow`, `deny`, or `approval-required`. Default is `deny` on unresolved identity.

**Constraints**: never infer safety from string prefix alone; never follow a symlink merely to decide it is safe without checking the resulting canonical object.

**Expected output**: deterministic JSON preflight record.

**Metrics**: checks/task, denials/task, symlink transitions, mean/p95 guard latency.

**Verification**: run adversarial fixtures from `tests/test_path_integrity_guard.py`.

**Failure handling**: metadata/permission error => fail closed; preserve evidence; no mutation.

**Stop conditions**: protected-root match, root escape, broken write target where policy rejects it, excessive symlink depth, or unresolved canonicalization.

## Skill 2 — Commit-Time Identity Revalidation

**Purpose**: close the validation-to-use gap between preflight and filesystem mutation.

**Trigger**: immediately before a previously authorized mutation is committed.

**Inputs**: preflight record and requested path.

**Preconditions**: preflight decision was `allow`; record is fresh enough for the operation.

**Required context**: captured parent/target identity and current filesystem identity.

**Tools**: `scripts/path_integrity_guard.py commit-check`.

**Procedure**:
1. Reload the preflight record.
2. Resolve the current canonical parent and target identity.
3. Compare current parent identity to captured identity.
4. Compare existing target identity when applicable.
5. Re-run protected-root and writable-root tests.
6. Reject if symlink topology or canonical destination changed.
7. Permit mutation only after all comparisons pass.

**Decisions**: commit allowed or stopped for drift.

**Constraints**: no automatic retry after drift without a new full preflight.

**Expected output**: JSON commit gate result.

**Metrics**: drift detections, re-preflights, false-positive review count.

**Verification**: test a fixture that swaps a safe parent for a symlink after preflight.

**Failure handling**: drift => stop mutation and rebuild plan from current state.

**Stop conditions**: any identity mismatch or policy violation.

## Skill 3 — Repository and Worktree Alias Audit

**Purpose**: find dangerous path aliases before an agent starts high-autonomy work.

**Trigger**: workspace admission, new Git worktree, sandbox policy change, or security review.

**Inputs**: workspace root, protected roots, policy.

**Tools**: `scripts/scan_path_aliases.py`.

**Procedure**:
1. Walk filesystem entries without following directory symlinks recursively.
2. Record symlinks, their targets, and whether targets escape workspace roots.
3. Flag symlinks that enter protected roots.
4. Identify `.git` files/directories/symlinks and resolve Git worktree indirection where safely readable.
5. Flag broken aliases and suspicious temporary wrappers targeting managed runtime locations.
6. Emit a machine-readable report and non-zero exit status for blocking findings.

**Decisions**: admit workspace, admit with explicit exception, or reject.

**Constraints**: do not execute repository content; scanner is metadata-only.

**Expected output**: JSON findings.

**Metrics**: escaping aliases, protected-root aliases, broken links, scan duration.

**Verification**: fixtures include safe in-root link and malicious outside-root link.

**Failure handling**: unreadable critical path => mark scan incomplete and fail closed for autonomous write mode.

**Stop conditions**: blocking finding or incomplete coverage of a mutation-relevant path.

## Skill 4 — Path-Incident Recovery

**Purpose**: contain damage after suspected write-through, worktree confusion, or runtime-path mutation.

**Trigger**: guard denial on protected root, unexpected hash change, recursive tool behavior, or outside-root mutation evidence.

**Inputs**: audit record, process/tool logs, affected paths, package/runtime manifest if available.

**Procedure**:
1. Stop further autonomous writes.
2. Preserve metadata and hashes of affected files without executing them.
3. Determine lexical alias and canonical target relationships.
4. Quarantine suspicious wrapper/scripts if platform policy permits and human approves.
5. Restore only from trusted package/runtime source.
6. Re-run alias scan and integrity checks.
7. Resume only after independent verification.

**Constraints**: no destructive cleanup before evidence capture; no execution of suspected corrupted wrappers.

**Expected output**: incident record, containment status, verified recovery state.

**Metrics**: time to detection, scope of affected paths, recurrence after recovery.

**Verification**: independent verifier confirms canonical identities and trusted hashes.

**Failure handling**: if trusted recovery source is unavailable, remain stopped and escalate.

**Stop conditions**: verified recovery or human-controlled incident response handoff.
