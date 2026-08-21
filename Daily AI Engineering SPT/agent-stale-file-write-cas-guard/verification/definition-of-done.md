# Verification and Definition of Done

## Implemented
- [ ] Every declared protected write path captures a snapshot after task-relevant reads.
- [ ] Every declared protected write path runs pre-write CAS at the final mutation boundary.
- [ ] Exit code 2 cancels the pending mutation instead of warning and continuing.
- [ ] Stale proposals are invalidated and rebuilt from fresh disk state.
- [ ] Retry count is bounded by policy.
- [ ] High-risk writes use an independent verifier.

## Measured
- [ ] Guarded-write revalidation coverage is measured.
- [ ] Post-write verification coverage is measured.
- [ ] Stale detection count and reconciliation retries are recorded.
- [ ] Snapshot-to-write and CAS-to-write intervals are measurable.
- [ ] Unexpected diff and unrelated-line-loss incidents are tracked.

## Verified
- [ ] `tests/test_file_snapshot_guard.py` passes.
- [ ] Unchanged file passes CAS.
- [ ] Modified file is blocked.
- [ ] Deleted file is blocked.
- [ ] Missing-then-created file is blocked.
- [ ] Same bytes with metadata-only change pass because SHA-256 is authoritative.
- [ ] Path escape is rejected.
- [ ] Host-level concurrency test proves a human edit after snapshot is preserved.
- [ ] Host-level multi-agent test proves a second writer cannot cause the first stale proposal to overwrite newer bytes.
- [ ] Committed stale writes = 0.
- [ ] Unrelated-line loss = 0 in regression fixtures.

## Failure handling

| Failure | Detection | Retry | Fallback | Escalation / Stop |
|---|---|---|---|---|
| Content hash changed | CAS exit 2 | Reconcile, max policy retries | Re-read and rebuild | Human approval if conflict or retries exhausted |
| File created/deleted after snapshot | CAS exit 2 | Reconcile, max policy retries | Re-evaluate intent against current existence | Stop if replacement would destroy newer work |
| Snapshot artifact invalid | Exit 3 | None unless caller corrects deterministic input | Recapture from trusted root | Block mutation |
| I/O failure | Exit 4 | One deterministic retry if transient | Preserve disk state | Block mutation if unresolved |
| Post-write unexpected diff | Independent verification | One reconciliation within total budget | Preserve current diff for review | Stop if scope cannot be proven |
| Repeated contention | Retry counter | No retries beyond maximum | Isolate writer/worktree or defer | Stop autonomous mutation |

## Final completion criteria
The package/integration is complete only when evidence is documented, current limitations are documented, guard is integrated at every declared write boundary, regression tests pass, metrics are collected, stale-write comparison is demonstrated, risks and residual race window are documented, required approvals are honored, and no blocking verification gap remains.
