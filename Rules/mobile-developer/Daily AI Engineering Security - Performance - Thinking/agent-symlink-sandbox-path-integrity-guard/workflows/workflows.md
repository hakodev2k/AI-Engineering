# Workflows

## Workflow A — Workspace Admission

**Trigger**: new repository/worktree enters an autonomous agent session.

**Goal**: establish safe writable/protected root identities before writes begin.

**Inputs**: workspace path, policy, runtime-protected paths.

**Baseline**: alias count, escaping alias count, protected-root alias count, Git metadata topology.

**Stages**:
1. Evidence Analyst confirms applicable path/sandbox constraints.
2. Resolve configured workspace aliases to canonical roots.
3. Run `scan_path_aliases.py` without following directory symlinks recursively.
4. Inspect `.git` indirection/worktree metadata as data only.
5. Classify findings: safe in-root, explicit approved alias, root escape, protected-root alias, incomplete.
6. Security Architect reviews blocking findings or exceptions.
7. Emit admission status.

**Responsible agent**: Security Architect; scanner deterministic.

**Outputs**: admission report, canonical writable roots, exceptions.

**Checkpoint**: no autonomous mutation before `admitted=true`.

**Metrics**: scan duration, aliases scanned, blocking findings.

**Retry policy**: one retry after correcting a transient unreadable path. No repeated bypass attempts.

**Stop conditions**: protected-root alias, outside-root alias relevant to writes, incomplete critical scan.

**Failure path**: downgrade to read-only/manual approval mode.

**Verification**: independent reviewer checks report against policy.

**Definition of Done**: canonical roots known, no unexplained blocking aliases, policy loaded, admission recorded.

## Workflow B — Safe Filesystem Mutation

**Trigger**: any agent-initiated filesystem mutation.

**Goal**: ensure the object being mutated is the object that was authorized.

**Inputs**: operation, requested path, policy, workspace identity.

**Baseline**: lexical path and current canonical identities.

**Stages**:
1. Run `path_integrity_guard.py preflight`.
2. If denied, stop; do not rewrite the operation to evade the gate.
3. If approval-required, show lexical/canonical target and operation to human.
4. Prepare content in memory or a safe temporary file inside the same canonical root.
5. Immediately before mutation, run `commit-check` using the preflight record.
6. Commit with the least-following primitive available.
7. Validate the final canonical target remains in the approved root.
8. Record audit result.

**Responsible agent**: Guard Implementer for code; runtime host for enforcement.

**Tools**: guard script plus host filesystem APIs.

**Outputs**: preflight record, commit-check record, mutation result.

**Checkpoints**: preflight pass; commit-check pass; post-write containment check.

**Metrics**: guard latency, denies, identity drifts, outside-root attempts.

**Retry policy**: maximum one re-preflight after benign drift; second drift => stop/escalate.

**Stop conditions**: root escape, protected-root target, identity drift, unresolved metadata, human denial.

**Failure path**: leave original target unchanged where possible; preserve temporary content for review without auto-committing.

**Verification**: post-write canonical target and expected content hash/metadata checked when applicable.

**Definition of Done**: mutation occurred only after two identity checks and final target is inside approved root.

## Workflow C — Symlink/Worktree Security Regression

**Trigger**: guard change, sandbox upgrade, Git/worktree feature change.

**Goal**: prove the safety boundary still blocks known path-confusion classes.

**Inputs**: tests, policy, disposable filesystem.

**Stages**:
1. Create safe in-root symlink fixture.
2. Create relative and absolute outside-root symlink fixtures.
3. Create protected-root fixture using a disposable protected directory.
4. Preflight a safe path, then replace parent with an outside-root symlink.
5. Verify commit-check blocks drift.
6. Exercise broken-link and excessive-depth behavior.
7. Exercise `.git`/worktree alias scanner fixtures.
8. Compare allowed/blocked matrix to expected policy.

**Responsible agent**: Independent Verifier.

**Outputs**: test report.

**Metrics**: blocked attack fixtures / total attack fixtures, benign-pass rate, p95 guard latency.

**Retry policy**: tests may retry once only for nondeterministic OS cleanup failure; security assertion failures are not retried away.

**Stop conditions**: any attack fixture writes outside root, protected-root fixture allowed, benign fixture unexpectedly mutates outside target.

**Failure path**: mark package unverified and block deployment.

**Verification**: test process checks sentinel files outside workspace remain unchanged.

**Definition of Done**: all security fixtures pass and benign allowed cases meet policy.

## Workflow D — Incident Containment and Recovery

**Trigger**: outside-root write evidence, managed-runtime hash drift, recursive wrapper behavior, or protected-root guard hit after mutation.

**Goal**: stop propagation, preserve evidence, restore trusted state.

**Inputs**: audit logs, affected paths, trusted manifest/install source.

**Stages**:
1. Disable autonomous writes.
2. Capture lexical/canonical paths, link targets, stat metadata, hashes.
3. Do not execute suspected corrupted scripts/wrappers.
4. Identify all aliases to affected objects where feasible.
5. Quarantine only with human approval if destructive movement is required.
6. Restore from trusted distribution/source.
7. Run alias scan, runtime integrity validation, and regression suite.
8. Independent Verifier signs off operationally.

**Metrics**: affected object count, detection-to-containment time, recurrence.

**Retry policy**: no automatic destructive recovery retry; one trusted reinstall/restore attempt, then escalate.

**Stop conditions**: trusted source unavailable, continuing identity drift, verification failure.

**Failure path**: keep system stopped/read-only and hand off to human incident response.

**Definition of Done**: trusted artifacts restored, aliases safe, tests pass, independent verification complete.
