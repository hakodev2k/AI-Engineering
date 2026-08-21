# Workflows

## Workflow 1 — Task Start / Resume Context Binding

**Trigger:** New task, resumed task, reconnect, app restart, or subagent handoff.  
**Goal:** Bind execution to the intended Git worktree before mutation.  
**Inputs:** Cwd, intended repository/branch, operation class, policy.  
**Baseline:** No mutation is allowed until context passes.  
**Context:** Task/run ID plus prior trusted contract if resuming.  

### Stages
1. **Observe** — Context Inspector obtains Git facts from the actual cwd.
2. **Compare** — On resume, compare with prior contract; on new tasks, compare with explicit user/orchestrator intent.
3. **Capture** — Create contract only after intended state is established.
4. **Gate** — Run deterministic check.
5. **Proceed or Recover** — PASS hands off to implementation; mismatch enters Workflow 3.

**Responsible agent:** Context Inspector.  
**Tools:** Guard script, read-only Git commands.  
**Outputs:** Valid contract or mismatch report.  
**Checkpoint:** Immediately before first write.  
**Metrics:** resume mismatch rate; first-write gate coverage.  
**Retry policy:** Maximum 1 revalidation after state refresh.  
**Stop conditions:** PASS, or block after one failed recovery attempt.  
**Failure path:** Preserve repo state and escalate actual/expected context.  
**Verification:** Guard exit code 0 and expected identifiers match.  
**Definition of Done:** No write occurred before validated binding.

## Workflow 2 — Mutation Boundary Gate

**Trigger:** File write, patch application, commit, push, or branch mutation.  
**Goal:** Ensure cached agent/session state has not drifted.  
**Inputs:** Current contract, cwd, requested operation.  
**Baseline:** Last successful context check and timestamp.  
**Context:** Approved task binding.  

### Stages
1. Check contract age against configured TTL.
2. Recompute current Git state.
3. Compare repository root/common dir/worktree path/branch-detached state.
4. Apply operation-specific checks.
5. For `push`/`branch-mutate`, require configured approval outside the model.
6. Execute mutation only after PASS.
7. Revalidate after operations that intentionally alter Git context.

**Responsible agent:** Orchestrator with Context Inspector.  
**Outputs:** PASS/BLOCK with reason codes.  
**Metrics:** gate coverage; wrong-context blocks; false blocks.  
**Retry policy:** No automatic operation retry after a context mismatch; at most one context recovery.  
**Stop conditions:** Mutation succeeds under valid context or remains blocked.  
**Failure path:** Workflow 3.  
**Verification:** Independent Context Verifier for high-risk changes.  
**Definition of Done:** Every mutation has a fresh preceding PASS.

## Workflow 3 — Context Drift Recovery

**Trigger:** Any mismatch such as `worktree_path_mismatch`, `branch_mismatch`, `common_git_dir_mismatch`, or detached-state mismatch.  
**Goal:** Recover without moving/corrupting unrelated changes.  
**Inputs:** Failure report, worktree inventory, prior contract.  
**Baseline:** Current state is considered untrusted for mutation.  

### Stages
1. Freeze writes.
2. Inventory worktrees with Git porcelain output.
3. Classify: wrong cwd, branch drift, detached transition, moved worktree, wrong repository, or ambiguous state.
4. If one unambiguous non-destructive correction exists, perform it only through host-authorized recovery.
5. Otherwise require human selection of intended worktree/branch.
6. Recapture contract from the corrected state.
7. Run one final gate.

**Responsible agent:** Recovery Coordinator.  
**Outputs:** New validated contract or blocked incident record.  
**Metrics:** successful safe recovery rate; silent auto-rebind count (target 0).  
**Retry policy:** Maximum 1 correction/rebind attempt.  
**Stop conditions:** PASS after recapture or explicit escalation.  
**Failure path:** Report blocked; never reset/clean to force alignment.  
**Verification:** Independent verifier checks the new binding for dangerous operations.  
**Definition of Done:** Intended state is explicitly restored and validated, or no mutation occurs.

## Workflow 4 — Safe Patch/Fork Transfer

**Trigger:** Fork task, continue in new worktree, import patch/diff.  
**Goal:** Prevent partial mutation against a stale/incompatible base.  
**Inputs:** Source base/head OID, source diff, destination ref/contract, transfer strategy.  
**Baseline:** Destination is clean and unmodified by transfer.  

### Stages
1. Choose exactly one strategy: `preserve-source-state` or `start-clean-from-ref`.
2. Capture source base/head and destination HEAD.
3. Patch Provenance Reviewer proves compatibility before application.
4. Gate destination with operation `patch-apply`.
5. Apply once using the selected deterministic strategy.
6. If application fails, stop; restore only through a known-safe host mechanism rather than cascading fallbacks.
7. Inspect resulting diff scope and rerun context gate.
8. Independently verify before commit.

**Responsible agent:** Patch Provenance Reviewer then Implementation Agent.  
**Outputs:** Verified transferred state or untouched/blocked destination.  
**Metrics:** base mismatch detections; partial patch incidents (target 0); fallback repeats (target 0).  
**Retry policy:** 0 automatic patch-application retries after partial failure. A new clean destination may be created once with explicit authorization.  
**Stop conditions:** Transfer verified, or destination quarantined/blocked.  
**Failure path:** Preserve source; do not push/commit conflicted partial state.  
**Verification:** OID/base evidence plus diff inspection.  
**Definition of Done:** Base provenance proven, context valid, patch applied once, resulting scope verified.