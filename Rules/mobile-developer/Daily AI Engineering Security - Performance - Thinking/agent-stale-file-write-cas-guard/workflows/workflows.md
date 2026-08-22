# Workflows

## Workflow 1 — Guarded File Mutation

**Trigger:** any agent action will create, replace, edit, format, generate, or otherwise mutate a file whose current state matters to correctness.

**Goal:** ensure the mutation is based on fresh evidence and cannot silently overwrite a newer version.

**Inputs:** task intent, repository root, target paths, policy.

**Baseline:** current target bytes and SHA-256 captured after the last task-relevant read.

**Context:** Facts, Assumptions, Evidence, Target Paths, Snapshot ID, Retry Count.

### Stages
1. **Observe** — Evidence & Concurrency Analyst reads the current target files and identifies the smallest mutation-relevant set.
2. **Baseline** — run `file_snapshot_guard.py snapshot` for all targets.
3. **Plan** — Implementation Agent constructs a narrow change against those exact bytes.
4. **Checkpoint A: pre-write CAS** — run `verify` immediately before mutation.
5. **Execute** — only on a fresh result, apply the planned mutation.
6. **Measure** — capture final diff, changed paths, tests, and unexpected diff size.
7. **Checkpoint B: independent verification** — Verification Agent re-reads disk state and checks intended scope plus preservation of unrelated edits.
8. **Complete** — classify Implemented / Measured / Verified separately.

**Tools:** read/search/diff/edit tools, snapshot guard, relevant build/test commands.

**Outputs:** snapshot, mutation result, diff, test results, verification record.

**Metrics:** pre-write verification coverage; post-write verification coverage; stale detections; unrelated-line loss; unexpected diff; retries.

**Retry policy:** no retry of the same stale proposal. Transition to Workflow 2. Maximum reconciliation retries: policy value, default 2.

**Stop conditions:** verified success; semantic conflict requiring approval; retry budget exhausted; guard/tool I/O failure that cannot be deterministically resolved.

**Failure path:** preserve current disk state; do not weaken CAS; record blocking evidence.

**Definition of Done:** fresh CAS occurred immediately before write; intended mutation exists; no unrelated newer content was lost; required tests pass; final verifier approves.

---

## Workflow 2 — Stale Snapshot Reconciliation

**Trigger:** pre-write CAS returns exit code 2 / stale status.

**Goal:** regenerate the proposal from current evidence without clobbering newer work.

**Inputs:** stale report, invalidated proposal, task intent, retry count.

**Baseline:** stale report plus current disk content; the old proposal is historical evidence only.

### Stages
1. **Invalidate** — mark the old proposal unusable.
2. **Re-observe** — re-read every stale path and any directly dependent files.
3. **Classify** — record Facts, Newer Changes, Requested Intent, Conflicts, Assumptions.
4. **Decision checkpoint:**
   - compatible newer change → preserve it and continue;
   - incompatible intent → request human approval and stop autonomous mutation;
   - uncertain ownership → stop rather than infer.
5. **Re-plan** — create the smallest new mutation against current bytes.
6. **Re-baseline** — capture a new snapshot.
7. **Retry** — return to Workflow 1 Checkpoint A.

**Responsible agents:** Evidence & Concurrency Analyst → Implementation Agent.

**Metrics:** reconciliation attempts, stale paths, contention duration, escalations, successful preservation.

**Retry policy:** increment once per complete re-observe/re-plan cycle; maximum 2 by default. Repeated file churn after the maximum is a blocked state, not a reason for infinite retries.

**Stop conditions:** fresh proposal proceeds; conflict escalates; retry budget exhausted.

**Failure path:** leave all competing changes intact and report current evidence.

**Verification:** final diff must be evaluated against the refreshed baseline, not the original stale baseline.

**Definition of Done:** stale proposal is never written; refreshed evidence is explicit; retry bound respected; either safe progress or transparent block occurs.

---

## Workflow 3 — Concurrency Regression Verification

**Trigger:** integrating the guard into a new agent host/write tool or changing write orchestration.

**Goal:** prove stale writes are blocked across the relevant write paths.

**Inputs:** protected write paths, regression fixtures, policy thresholds.

**Baseline:** behavior without guard or previous release metrics.

### Stages
1. Create representative files and snapshot them.
2. Simulate a human/other-agent edit after snapshot.
3. Attempt the guarded mutation.
4. Assert mutation is not executed when CAS fails.
5. Test delete/recreate and missing-to-created transitions.
6. Test unchanged bytes with metadata changes to avoid mtime-only false positives.
7. Run `tests/test_file_snapshot_guard.py`.
8. For each host write path, record whether the guard runs at the final mutation boundary.
9. Review by Verification Agent.

**Metrics:** stale-write block rate (target 100%); stale writes committed (target 0); unrelated-line loss (target 0); guard coverage (target 100% for declared protected paths).

**Retry policy:** one rerun for deterministic test-environment failures; product failures are not retried away.

**Stop conditions:** all required fixtures pass or integration remains blocked.

**Definition of Done:** tests pass, all protected paths are mapped to pre-write guard hooks, and no blocking gap is unacknowledged.
