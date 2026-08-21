# Hooks

## Hook 1 — Pre-Task Mutation Scope

**Trigger:** task planning identifies any local file mutation.

**Action:** resolve trusted repository root, enumerate intended mutation targets, classify high-risk files, and ensure each target will be snapshotted before planning from its contents.

**Command/script:** host-specific orchestration; use `python scripts/file_snapshot_guard.py snapshot --root <repo> --output <artifact> <paths...>` once task-relevant reads are complete.

**Expected result:** every planned mutation target has a version token.

**Failure behavior:** block write-capable execution until target scope is known; do not expand to arbitrary filesystem roots.

---

## Hook 2 — Pre-Write CAS Gate

**Trigger:** immediately before the host invokes an edit/write/patch/generator command.

**Action:** compare current disk bytes with the snapshot that informed the proposal.

**Command/script:** `python scripts/file_snapshot_guard.py verify --root <repo> --snapshot <snapshot.json> --report <report.json>`

**Expected result:** exit 0 and `status=fresh`.

**Failure behavior:** exit 2 means stale evidence: cancel the pending mutation, invalidate its proposal ID, enter stale reconciliation. Exit 3/4 blocks the mutation and surfaces guard failure. Never continue as warning-only.

---

## Hook 3 — Post-Write Disk Re-read

**Trigger:** write tool reports success.

**Action:** re-read target files from disk, capture `git diff -- <targets>` when applicable, and compare actual state to intended scope.

**Command/script:** host read/diff commands; optionally prepare an expected post-write snapshot and run `post-verify`.

**Expected result:** intended changes exist, no unexplained broad rewrite appears, unrelated refreshed-baseline edits remain.

**Failure behavior:** do not report completion; route once to reconciliation/verification. Destructive rollback requires explicit safety assessment or approval.

---

## Hook 4 — Retry Budget Gate

**Trigger:** a stale snapshot or post-write verification failure requests another implementation cycle.

**Action:** increment reconciliation count and compare with `config/policy.json`.

**Command/script:** deterministic host counter; no model judgment needed.

**Expected result:** retry allowed only while count <= `max_reconciliation_retries`.

**Failure behavior:** stop autonomous edits and escalate with current files preserved.

---

## Hook 5 — Final Verification Gate

**Trigger:** agent intends to claim the file task complete.

**Action:** require evidence for: last CAS pass, applied mutation, targeted tests, independent disk re-read, final diff review, retry count, and unresolved risks.

**Command/script:** verification workflow plus relevant project tests.

**Expected result:** explicit states `Implemented=true`, `Measured=true`, `Verified=true` for required scope.

**Failure behavior:** completion is blocked; never convert missing verification into success wording.
