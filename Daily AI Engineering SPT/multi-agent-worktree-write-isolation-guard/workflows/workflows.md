# Workflows

## Workflow A — Parallel Work Planning

**Trigger:** parent identifies two or more potentially independent coding workstreams.

**Goal:** parallelize only work whose mutable state can be isolated.

**Inputs:** task requirements, repository map, base SHA, test requirements.

**Baseline:** shared-checkout mode records expected agent count, overlapping files, conflict/retry count, wall-clock time, and rework.

**Stages:**
1. Planner decomposes task.
2. Enumerate expected writable paths per slice.
3. Detect prefix overlap.
4. Convert overlapping slices to serial integration or patch-only review work.
5. Create one manifest per write worker.
6. Validate all manifests as a set.
7. Provision dedicated worktrees.
8. Preflight each workspace before worker start.

**Checkpoint:** no write worker starts until manifest-set validation and workspace preflight pass.

**Retry policy:** manifest repair <= 2 planning iterations; workspace provision retry <= 1.

**Stop conditions:** unresolved ownership overlap, missing base SHA, unclean unknown worktree state, or inability to isolate workspace.

**Definition of Done:** each write worker has a unique branch/worktree, exclusive owned paths, and verified base identity.

---

## Workflow B — Guarded Implementation

**Trigger:** implementation worker receives a valid manifest and workspace.

**Goal:** produce a change without contaminating another agent's mutable state.

**Stages:**
1. Verify cwd/repo/branch/base.
2. Inspect task and owned paths.
3. Before each mutation phase, run pre-write guard for target paths.
4. Implement smallest coherent change.
5. If file changed since read or index-lock/conflict appears: re-read once, then retry once.
6. If recurrence persists, stop and return `orchestration-conflict` rather than looping.
7. Run required tests in the same worktree.
8. Record diff paths and HEAD.
9. Generate handoff.

**Metrics:** edit retries, blocked writes, drift detections, worker duration, test status.

**Failure path:** preserve safe diff/commit evidence; do not reset unknown changes; parent decides rebase/replan/serialize.

**Verification:** handoff cannot self-approve.

**Definition of Done:** handoff generated with all changed paths owned and required evidence present.

---

## Workflow C — Handoff Verification and Integration

**Trigger:** worker returns handoff.

**Goal:** ensure parent merges only provenance-correct, ownership-compliant output.

**Stages:**
1. Verifier loads worker manifest and handoff.
2. Confirm task/agent/worktree/branch identity.
3. Confirm base SHA is ancestor of head SHA or recorded rebase base is approved.
4. Independently compute changed paths from git.
5. Compare diff paths with declared `changed_paths` and `owned_paths`.
6. Confirm tests include commands/status and were run against candidate head where applicable.
7. Reject stale, cross-owned, unverifiable, or failing output.
8. Integration Agent merges/cherry-picks verified workers in dependency order.
9. Shared integration files are modified only now by the designated integrator.
10. Run final integration tests.

**Retry policy:** one corrected handoff allowed for metadata mismatch; code/ownership/ancestry failures require rework or replan.

**Stop conditions:** unowned changed path, stale head, ancestry failure, unresolved conflict, missing critical test evidence.

**Definition of Done:** all merged workers are verified, integration tests pass or explicit waiver is recorded, and no ownership conflict remains.

---

## Workflow D — Drift Recovery

**Trigger:** wrong branch/worktree, unexpected HEAD, external write, or repeated concurrent modification.

**Goal:** recover without destroying another agent's work.

**Stages:**
1. Stop mutation immediately.
2. Capture `status`, branch, HEAD, worktree list, and diff metadata.
3. Compare with manifest and identify external/unowned state.
4. If current changes are owned and safe, persist as patch/commit.
5. Parent chooses: recreate worktree, rebase from approved base, serialize contested paths, or abandon worker.
6. Re-run preflight before resume.

**Maximum retries:** one recovery attempt for the same drift cause.

**Escalation:** second occurrence becomes a blocking orchestration incident.

**Safety:** never use destructive cleanup as automatic recovery.