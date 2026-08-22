# Core Skills

## Skill 1 — Capture Mutation Evidence Snapshot

**Purpose:** bind every planned file mutation to the exact bytes that informed the plan.

**Trigger:** before an agent proposes or prepares a write, patch, generated replacement, formatter run, or config mutation for an existing or potentially-created path.

**Inputs:** repository root; target paths; task intent; current read results.

**Preconditions:** target paths are known; repository root is trusted; the agent has read permission.

**Required context:** task scope, target paths, current file content actually used for planning, ownership/concurrency constraints.

**Tools:** `scripts/file_snapshot_guard.py snapshot`; normal file-read/search tools.

**Procedure:**
1. Resolve the smallest set of files whose current bytes influence the mutation.
2. Read those files from the real filesystem, not only from remembered conversation context.
3. Capture their snapshot tokens with `snapshot`.
4. Record snapshot artifact path with the mutation plan.
5. Treat new/missing files as versioned state too: `exists=false` is a valid snapshot.
6. Do not broaden the snapshot to the whole repository unless the operation truly depends on the whole repository.

**Decisions:** if the task cannot identify its mutation inputs, stop and refine scope; if a target escapes the repository root, reject it.

**Constraints:** hash is authoritative; mtime is diagnostic only; never infer freshness from model memory.

**Expected output:** a versioned JSON snapshot listing path, existence, SHA-256, size, and mtime.

**Metrics:** snapshot coverage of guarded writes; number of paths per mutation; snapshot-to-write age.

**Verification:** snapshot command exits 0 and contains every intended mutation target.

**Failure handling:** invalid paths or I/O failures block the write path; do not bypass the guard.

**Stop conditions:** all mutation-relevant targets have a valid snapshot or the task stops as blocked.

---

## Skill 2 — Pre-Write CAS Verification

**Purpose:** prove that mutation evidence is still fresh at the write boundary.

**Trigger:** immediately before any guarded write command/tool call.

**Inputs:** snapshot artifact; repository root; intended mutation.

**Preconditions:** a snapshot exists from the planning/read phase.

**Required context:** intended operation, snapshot path, current retry count.

**Tools:** `scripts/file_snapshot_guard.py verify`.

**Procedure:**
1. Run `verify` immediately before the mutation.
2. If status is `fresh`, proceed directly to the mutation without unrelated model/tool work that creates a long race window.
3. If status is `stale`, block the mutation.
4. Record which paths changed and why (`content_hash_changed` or `existence_changed`).
5. Handoff to Stale Snapshot Reconciliation instead of reusing the old patch.

**Decisions:** freshness pass permits the proposed write; freshness fail invalidates the proposal, not merely the cached bytes.

**Constraints:** never transform exit code 2 into a warning; never retry the same write unchanged.

**Expected output:** `fresh` verification or structured stale event.

**Metrics:** stale detection count; guarded writes revalidated; stale writes that reached storage (must remain zero).

**Verification:** host telemetry shows no guarded mutation executed after a failed CAS check.

**Failure handling:** tool error blocks mutation and escalates after one deterministic rerun if caused by transient artifact access.

**Stop conditions:** pass, or stale handoff, or hard failure.

---

## Skill 3 — Stale Snapshot Reconciliation

**Purpose:** rebuild a valid change when another actor has modified the target after planning.

**Trigger:** CAS verification reports stale state.

**Inputs:** stale report; old task intent; current files; previous proposal only as historical evidence.

**Preconditions:** retry count is below policy maximum.

**Required context:** facts about current disk state, requested outcome, stale paths, previous diff intent.

**Tools:** file read/diff/search; snapshot guard; implementation tools.

**Procedure:**
1. Mark the previous mutation proposal **invalidated**.
2. Re-read all stale paths from disk.
3. Separate facts into: user/other-agent changes, still-valid requested intent, and conflicting intent.
4. Rebuild the smallest mutation against current bytes.
5. Preserve unrelated current changes by default.
6. Capture a new snapshot for the refreshed evidence.
7. Re-run pre-write CAS.
8. Retry no more than `max_reconciliation_retries`.

**Decisions:** if current changes conflict materially with the requested outcome, stop for human approval rather than guess which work to discard.

**Constraints:** do not three-way merge blindly; do not restore content merely because it existed in the old snapshot.

**Expected output:** refreshed proposal plus fresh snapshot, or an explicit conflict/block state.

**Metrics:** reconciliation success rate; retries/task; unrelated-line loss; human escalations.

**Verification:** compare final diff against refreshed baseline and task intent.

**Failure handling:** after the configured retry budget, stop with evidence of repeated contention.

**Stop conditions:** fresh proposal is ready, conflict requires approval, or retry budget exhausted.

---

## Skill 4 — Independent Post-Write Verification

**Purpose:** verify the completed mutation did not clobber unrelated work and matches the intended scope.

**Trigger:** after a guarded mutation reports success.

**Inputs:** refreshed pre-write baseline; final disk state; intended change; VCS diff when available.

**Preconditions:** write completed successfully.

**Required context:** target paths, task acceptance criteria, stale/reconciliation history.

**Tools:** file read; `git diff -- <paths>`; targeted tests; optional `post-verify` against a prepared expected snapshot.

**Procedure:**
1. Re-read changed files from disk independently of the implementation tool's success message.
2. Inspect diff against the refreshed baseline.
3. Confirm intended edits exist.
4. Confirm unrelated concurrent edits remain.
5. Run relevant syntax/tests/format checks.
6. Record Implemented, Measured, and Verified separately.

**Decisions:** any unexplained large rewrite, missing unrelated edit, or failed test returns the task to reconciliation; the implementing agent cannot be sole verifier for high-risk files.

**Constraints:** tool success is not verification; do not use the pre-write model context as proof of final disk state.

**Expected output:** verification record with status and evidence.

**Metrics:** post-write verification coverage; unexpected diff count; rework rate.

**Verification:** independent verifier signs off on final diff and tests.

**Failure handling:** rollback only when safe and authorized; otherwise stop with current diff preserved for review.

**Stop conditions:** verified success or explicit blocking defect.
