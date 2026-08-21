# Core Skills

## Skill 1 — Partition Mutable Work

**Purpose:** turn a parallel coding plan into non-overlapping mutable ownership domains.

**Trigger:** two or more agents may write to the same repository concurrently.

**Inputs:** task goal, repository root, base commit, candidate workstreams, expected files/modules.

**Preconditions:** repository exists; base SHA is known; parent can inspect dependency boundaries.

**Procedure:**
1. Decompose work into independently verifiable slices.
2. Map each slice to explicit path prefixes.
3. Detect overlapping write paths before spawning workers.
4. Convert uncertain/shared paths into either read-only access or a serial integration task.
5. Assign one owner per mutable path prefix.
6. Record task ID, agent ID, base SHA, branch, worktree, owned paths, forbidden paths, required tests.
7. Validate the manifest deterministically.

**Decisions:** if two workstreams require the same mutable file, do not parallelize those writes unless the task is redesigned around generated patches or a serial integrator.

**Constraints:** ownership is about writes, not reads; generated artifacts must also have owners.

**Expected output:** valid task manifests with zero accidental path overlap.

**Metrics:** ownership collisions detected pre-spawn; number of workstreams converted to serial; conflicting-write incidents.

**Verification:** run `scripts/worktree_guard.py manifest`.

**Failure handling:** collapse conflicting slices into one writer or introduce an integration boundary.

**Stop condition:** no active writers have overlapping owned path prefixes.

---

## Skill 2 — Bind Agent to Worktree Identity

**Purpose:** make workspace identity an executable invariant rather than a prompt hint.

**Trigger:** before a write-capable subagent starts.

**Inputs:** manifest, repository, base SHA.

**Procedure:**
1. Create or provision a dedicated worktree and branch.
2. Capture canonical repo root and worktree path.
3. Confirm `HEAD` descends from the expected base SHA.
4. Confirm branch matches manifest and is not detached.
5. Confirm starting worktree is clean unless the manifest explicitly records preexisting state.
6. Run preflight before delegating write permission.
7. Pass the manifest path/ID to the worker, not only natural-language branch instructions.

**Expected output:** `workspace-ok` evidence containing repo root, branch, HEAD, base ancestry, and worktree path.

**Metrics:** workspace-drift blocks; incorrect-branch writes prevented.

**Verification:** `scripts/worktree_guard.py preflight --manifest ...` exits 0.

**Failure handling:** do not write; recreate/rebind worktree or replan.

**Stop condition:** all identity assertions pass.

---

## Skill 3 — Guard Every Write Phase

**Purpose:** catch branch/worktree drift after spawn but before mutation.

**Trigger:** immediately before the first edit/write/format/codegen command in each mutation phase.

**Inputs:** manifest and requested target paths.

**Procedure:**
1. Re-run workspace identity checks.
2. Normalize target paths relative to canonical repo root.
3. Verify every target is inside an owned path prefix.
4. Reject path traversal, symlink escape, wrong branch, wrong worktree, or base ancestry loss.
5. On “modified since read”/index-lock/conflict signals, retry at most once after re-read.
6. If the conflict recurs, stop and escalate to orchestration; do not loop.

**Expected output:** allow/block decision with machine-readable reason.

**Metrics:** blocked unowned writes, drift detections, bounded conflict retries.

**Verification:** guard exit code and audit record.

**Failure handling:** save patch/diff if safe, stop worker, rebase/replan through parent.

---

## Skill 4 — Structured Handoff and Independent Verification

**Purpose:** prove what state a worker actually changed before parent synthesis/merge.

**Trigger:** worker completion or interruption after any mutation.

**Inputs:** manifest, worker branch/worktree, test commands/results.

**Procedure:**
1. Record current head SHA and changed paths relative to base.
2. Record executed tests with exit status.
3. Compare changed paths to ownership contract.
4. Record unresolved conflicts/blockers and whether branch was rebased.
5. Produce handoff JSON.
6. Have a verifier independently compare manifest, git state, diff paths, ancestry, and test evidence.
7. Reject stale/cross-owned handoffs before merge.

**Expected output:** verified handoff with `verification_status=verified` or an explicit blocker.

**Metrics:** rejected stale handoffs; ownership violations; integration rework rate.

**Stop condition:** verifier passes or parent replans; prose-only completion is not sufficient.