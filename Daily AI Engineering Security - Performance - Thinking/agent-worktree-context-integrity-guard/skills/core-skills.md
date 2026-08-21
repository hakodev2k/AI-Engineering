# Core Skills

## Skill 1 — Capture a Repository-Context Contract

**Purpose:** Bind an agent task to the exact Git repository/worktree context before mutation.  
**Trigger:** Task start, resume, reconnect, worktree creation, branch switch, or handoff.  
**Inputs:** Working directory, intended operation, optional required branch/upstream.  
**Preconditions:** Git installed; directory belongs to a Git worktree.  
**Required context:** Task ID, intended repository, intended branch/base if known.  
**Tools:** `scripts/worktree_context_guard.py`, Git CLI.  

### Procedure
1. Resolve the active repository using Git, not UI/session labels.
2. Capture canonical repo top-level, worktree path, common Git dir, HEAD OID, branch/detached state, upstream.
3. Store the resulting contract outside model prose and associate it with the task/run ID.
4. If the human selected a branch/base, encode it explicitly rather than inheriting whatever Git currently reports.
5. Mark context stale after resume, reconnect, worktree move, branch mutation, or explicit `git switch/checkout`.

### Decisions
- If repository identity is ambiguous: stop.
- If branch is intentionally detached: allow only if policy permits and the expected OID is recorded.
- If the task needs a different worktree: create/reselect it first, then recapture.

**Constraints:** Never infer repository identity from directory basename or UI label.  
**Expected output:** JSON context contract.  
**Metrics:** contract capture success rate; ambiguous contexts blocked.  
**Verification:** Run `check` immediately after capture.  
**Failure handling:** Preserve current files; do not switch branches automatically unless separately authorized.  
**Stop conditions:** Contract captured and validated, or task blocked with a reason.

## Skill 2 — Pre-Mutation Context Gate

**Purpose:** Prevent writes in a stale/wrong worktree.  
**Trigger:** Before file write, patch application, commit, push, or branch mutation.  
**Inputs:** Contract, policy, active cwd, operation class.  
**Preconditions:** Existing valid contract.  
**Required context:** Current task/run ID and target operation.  
**Tools:** Guard script; orchestration hook.  

### Procedure
1. Recompute current Git state from the active cwd.
2. Compare canonical repo root, common Git dir, worktree path, branch/detached state.
3. For patch application, compare destination HEAD with the captured patch/base HEAD and require a clean destination when policy says so.
4. Fail closed on any mismatch.
5. For dangerous operations, also enforce host-level human approval if policy requires it.
6. Log only identifiers/OIDs/paths needed for audit; never log secrets or file content.

### Decisions
- Same branch name but different common Git dir: block.
- Same repository but different worktree: block unless contract is explicitly renewed.
- Detached when a branch was expected: block.
- HEAD changed during ordinary write work: may be acceptable only after recapture; never silently update contract.

**Expected output:** PASS or deterministic block reasons.  
**Metrics:** wrong-context mutations blocked; false-block rate.  
**Verification:** Negative tests for every mismatch class.  
**Failure handling:** One revalidation/recapture attempt maximum by default.  
**Stop conditions:** Gate passes or operation remains blocked.

## Skill 3 — Safe Resume / Handoff Rebinding

**Purpose:** Recover safely after a session boundary without trusting cached state.  
**Trigger:** Agent resume, app restart, reconnect, fork, subagent handoff.  
**Inputs:** Prior contract, current cwd, task metadata.  
**Preconditions:** No new mutation before revalidation.  
**Required context:** Expected repository/worktree from the previous trusted checkpoint.  
**Tools:** Guard script, `git worktree list --porcelain`.  

### Procedure
1. Treat cached branch/worktree labels as advisory only.
2. Run a fresh context check from the execution cwd.
3. If it matches, renew timestamp and continue.
4. If it differs, classify the mismatch before taking action.
5. Do not auto-switch to “fix” an ambiguous mismatch; surface actual and expected state.
6. Require explicit selection/approval when more than one plausible worktree exists.
7. Recapture only after the intended state has been established.

**Metrics:** resume mismatches detected before first write; silent rebind count (target 0).  
**Verification:** Simulate branch switch, cwd switch, and detached transition between checkpoints.  
**Failure handling:** Block writes and preserve current state.  
**Stop conditions:** Fresh validated binding or explicit escalation.

## Skill 4 — Patch/Base Provenance Check

**Purpose:** Prevent a diff generated from one base being partially applied to an incompatible destination.  
**Trigger:** Fork/continue-in-worktree, patch import, automated transplant.  
**Inputs:** Source base OID, destination contract, patch metadata.  
**Preconditions:** Destination mutation has not started.  
**Required context:** Source base/head, destination HEAD, intended strategy (`preserve-source-state` or `start-clean-from-ref`).  
**Tools:** Guard script plus host-specific patch generator.  

### Procedure
1. Record source base OID before generating/transferring the patch.
2. Record destination HEAD before application.
3. Require an explicit strategy; never mix “clean fork” and “carry source diff” implicitly.
4. If carrying a diff, require destination HEAD to equal the expected patch base unless a deterministic three-way strategy has been explicitly chosen and verified.
5. Require clean destination index/worktree by default.
6. If compatibility cannot be proven, stop before applying anything.
7. After application, run context gate again and verify resulting diff scope.

**Constraints:** Do not repeat partial fallback patch applications automatically.  
**Expected output:** compatible/incompatible decision with OIDs.  
**Metrics:** partial patch incidents; base mismatch blocks.  
**Verification:** stale-base regression fixture.  
**Failure handling:** abandon the new destination worktree only with explicit cleanup policy; never touch the dirty source checkout.  
**Stop conditions:** Safe application completed and verified, or blocked before mutation.