# Core Skills

## Skill 1 — Capture Trusted Workspace State

**Purpose:** Create a versioned baseline that binds a plan to the exact workspace facts it relied on.

**Trigger:** Before a non-trivial implementation plan, before pausing a long-running task, after a successful revalidation, or before delegating work whose correctness depends on current repository state.

**Inputs:** Repository root, plan/task ID, critical files or glob-derived tracked files, verification evidence identifiers.

**Preconditions:** Git repository is readable when Git metadata is required; tracked files are inside the repository; no unresolved policy parse errors.

**Required context:** Current branch, HEAD, dirty status, critical dependency files, tests/commands whose results will later be reused.

**Tools:** `git`, filesystem metadata/hash reads, `scripts/workspace_guard.py`.

**Procedure:**
1. Resolve repository root canonically.
2. Read branch and HEAD.
3. Hash each explicitly tracked critical file; do not rely on mtime alone.
4. Capture a normalized digest of `git status --porcelain=v1`.
5. Record verification evidence with dependency paths and capture time.
6. Write the snapshot atomically to the configured state directory.
7. Return the snapshot ID and tracked dependency count.

**Decisions:** If the repository is not Git-backed, capture file hashes and mark Git identity unavailable; if critical files exceed policy limits, require explicit narrowing rather than silently dropping them.

**Constraints:** Snapshot creation is read-only with respect to source files. Secrets or file contents are not stored; only hashes/metadata are recorded.

**Expected output:** JSON snapshot with workspace identity, file hashes, evidence bindings, and creation timestamp.

**Metrics:** Snapshot latency, tracked-file count, bytes hashed, capture failures.

**Verification:** Recompute the snapshot immediately in test mode and require zero drift.

**Failure handling:** Fail closed if configured critical files cannot be hashed or snapshot persistence fails.

**Stop conditions:** Snapshot persisted and self-check passes, or a blocking capture failure is reported.

## Skill 2 — Detect and Classify Workspace Drift

**Purpose:** Determine whether prior reasoning can still be trusted before protected actions.

**Trigger:** Resume after pause, before mutation, before using cached test evidence, before completion, after external tool execution, or when a file-watch/change event occurs.

**Inputs:** Trusted snapshot, current repository root, policy.

**Preconditions:** Snapshot schema/version is supported and repository identity can be evaluated.

**Required context:** Snapshot branch/HEAD/status digest/file hashes plus current values.

**Tools:** `scripts/workspace_guard.py check`, `git`, filesystem hashing.

**Procedure:**
1. Load and validate snapshot.
2. Compare canonical repository root identity.
3. Compare branch and HEAD.
4. Rehash tracked files and identify added/changed/deleted items.
5. Compare dirty-state digest for diagnostic context.
6. Classify changes using policy:
   - `none`: all protected facts match.
   - `non-impacting`: only unbound/untracked state changed.
   - `revalidation-required`: tracked dependency or HEAD changed and policy permits scoped recovery.
   - `hard-stop`: branch changed when prohibited, tracked critical file disappeared, root identity changed, or snapshot integrity is invalid.
7. Emit a machine-readable drift report; never mutate the baseline during check.

**Decisions:** A change is impacting when it intersects a dependency declared by the plan or verification evidence. Branch/root changes override narrower file decisions.

**Constraints:** Do not infer safety from model memory. Absence of a detected change is only valid for fields actually captured.

**Expected output:** Drift classification, changed facts, invalidated evidence IDs, and required next action.

**Metrics:** Drift detection rate in fixtures, classification latency, number of files rehashed, false-negative count.

**Verification:** Adversarial fixtures must detect branch, HEAD, file-content, deletion, and status changes according to policy.

**Failure handling:** Parsing/hash/Git failures become `hard-stop` when they prevent proving freshness.

**Stop conditions:** Classification is emitted with enough evidence to decide whether protected work may proceed.

## Skill 3 — Scoped Revalidation and Plan Repair

**Purpose:** Repair only the assumptions invalidated by drift rather than restarting the entire task.

**Trigger:** Drift classification is `revalidation-required`.

**Inputs:** Drift report, original plan, assumption/dependency bindings, policy, current workspace.

**Preconditions:** No `hard-stop` condition; maximum automatic attempts not exceeded.

**Required context:** Facts previously used by the plan, files that changed, tests/evidence bound to changed paths.

**Tools:** File reads/search, build/test tools, `workspace_guard.py`.

**Procedure:**
1. Convert the drift report into an invalidation set.
2. Mark every assumption/evidence record whose dependencies intersect that set as `stale`.
3. Reread changed relevant files and only the minimum neighboring context needed to interpret them.
4. Re-evaluate affected assumptions using explicit `Fact / Evidence / Status / Impact` records.
5. Repair plan steps whose preconditions changed.
6. Rerun verification commands whose declared dependencies became stale.
7. Capture a new trusted snapshot.
8. Check the new snapshot immediately before returning control to implementation.

**Decisions:** If a changed fact alters task scope, public behavior, schema, dependency versions, or branch intent, escalate instead of auto-repairing silently.

**Constraints:** Maximum two automatic revalidation attempts by default. Do not reuse stale test results to justify completion.

**Expected output:** Updated plan delta, fresh snapshot ID, evidence statuses, and remaining risks.

**Metrics:** Revalidated files versus full-repo files, invalidated evidence count, repair attempts, rework avoided.

**Verification:** Independent verifier confirms every changed dependency is either revalidated or explicitly irrelevant.

**Failure handling:** Second failed revalidation becomes a stop requiring human/parent-agent resolution.

**Stop conditions:** Fresh snapshot with repaired plan and required evidence, or bounded escalation.

## Skill 4 — Freshness-Gated Completion

**Purpose:** Prevent an agent from claiming success using stale workspace or stale verification evidence.

**Trigger:** Immediately before final completion or handoff.

**Inputs:** Latest snapshot, completion claims, evidence registry, current workspace.

**Preconditions:** Implementation work has stopped mutating the workspace.

**Required context:** Files changed by implementation, tests/builds used as evidence, latest snapshot.

**Tools:** `workspace_guard.py check`, test/build commands when invalidated.

**Procedure:**
1. Run a final drift check.
2. Reject completion on `hard-stop` or `revalidation-required`.
3. Verify every completion claim has current evidence.
4. Reject evidence older than configured TTL when its dependencies are mutable and no freshness proof exists.
5. Confirm the implementation agent is not the sole verifier for high-impact drift repairs.
6. Emit `Verified` only when freshness and evidence gates pass.

**Decisions:** `Implemented` is not equivalent to `Verified`; stale evidence keeps status at `Implemented` or `Measured` only.

**Constraints:** Never weaken drift rules merely to finish a run.

**Expected output:** Completion gate result with snapshot ID and verification status.

**Metrics:** Stale completion attempts blocked, evidence freshness coverage, post-completion drift incidents.

**Verification:** Final check must run after the last write and before the completion claim.

**Failure handling:** Return to scoped revalidation if retries remain; otherwise stop and report blocking drift.

**Stop conditions:** Freshness gate passes or a blocking condition is surfaced.
