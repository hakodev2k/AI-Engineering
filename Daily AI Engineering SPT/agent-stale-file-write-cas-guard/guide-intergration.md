# Integration Guide

## Goal
Wire the CAS guard into the **actual mutation boundary** of an AI coding agent so a proposal created from stale file evidence cannot reach disk.

## 1. Identify protected write paths
Inventory every way the host can mutate files, including:
- editor `Edit` / `Write` tools;
- patch/apply-patch tools;
- shell commands such as formatters, generators, redirects, scripts, or `sed -i`;
- MCP/custom tools that modify local files;
- internal config/state writers when they touch user-editable files.

A write path is not protected until the final operation is preceded by the same freshness contract.

## 2. Capture snapshots after task-relevant reads
When the agent has read the file content it will use to plan a change, capture a snapshot:

```bash
python scripts/file_snapshot_guard.py snapshot \
  --root /path/to/repo \
  --output .agent-artifacts/change-42.pre.json \
  src/service.py tests/test_service.py
```

Store the snapshot ID/path with the proposal/tool-call state. If the proposal is regenerated from a later read, discard the old binding and create a new snapshot.

## 3. Guard immediately before write
Before invoking the mutating tool:

```bash
python scripts/file_snapshot_guard.py verify \
  --root /path/to/repo \
  --snapshot .agent-artifacts/change-42.pre.json \
  --report .agent-artifacts/change-42.cas.json
```

Interpretation:
- `0`: current bytes equal the planning snapshot; mutation may proceed.
- `2`: stale snapshot; cancel the pending write and reconcile.
- `3`: invalid input/policy boundary; block.
- `4`: I/O error; block.

Do not place long model calls or unrelated tool work between a passing check and the mutation. The check should sit as close to the write as the host architecture allows.

## 4. Reconcile stale state
On exit 2:
1. invalidate the proposed patch/write;
2. re-read stale paths from disk;
3. identify newer edits that must be preserved;
4. rebuild the mutation against current bytes;
5. create a new snapshot;
6. retry, bounded by `config/policy.json`.

Do not simply run the old patch again.

## 5. Protect whole-file writes and generated files
For a new file, snapshot it while missing (`exists=false`). If another actor creates that path before the agent writes, CAS will fail. For generators that overwrite several outputs, snapshot every output whose previous/current content matters before launching the generator.

If a shell command can mutate a dynamic set of paths, first constrain or predict the output set; otherwise use an isolated worktree/staging directory and merge only after verification.

## 6. Add post-write verification
After mutation:
- re-read the target from disk;
- inspect the final diff against the **refreshed** baseline;
- run targeted tests/lint/format validation;
- verify unrelated concurrent edits remain;
- record Implemented / Measured / Verified separately.

For high-risk files, route verification to a different agent or deterministic test stage.

## 7. Host adapter pseudocode

```text
proposal = plan_from_current_reads(task)
snapshot = capture_snapshot(proposal.input_paths)

for attempt in 0..max_reconciliation_retries:
    if !verify_snapshot(snapshot):
        proposal = rebuild_from_fresh_disk(task, stale_paths)
        snapshot = capture_snapshot(proposal.input_paths)
        continue

    result = execute_mutation(proposal)
    if !result.success:
        stop_or_handle_non_stale_failure()

    verification = independently_verify_disk(result, proposal)
    if verification.pass:
        complete()
    else:
        stop_or_reconcile_within_budget()

stop_as_contended_or_conflicted()
```

## 8. Shell-command integration
A shell command such as a formatter is harder to guard because the agent may not know all touched files. Prefer one of:
1. formatter invoked with explicit file list and snapshot those paths;
2. run in isolated worktree/staging directory then review/merge;
3. dry-run/list-changes mode to discover outputs before mutation.

Never claim full CAS coverage while allowing unrestricted write-capable shell commands to bypass the guard.

## 9. CI/regression
Run:

```bash
python -m unittest tests/test_file_snapshot_guard.py -v
```

Then add host-level tests that simulate:
- human edits after agent read;
- another agent edit;
- delete/recreate;
- new-file race;
- same bytes with changed mtime;
- write tool reporting success but disk state differing;
- contention beyond retry budget.

## 10. Metrics and alerting
Track per host/write path:
- guarded writes / total writes;
- stale checks / failures;
- committed stale writes (must be zero);
- reconciliation retry histogram;
- time from snapshot to CAS check;
- time from CAS pass to write;
- post-write verification coverage;
- unexpected diff and unrelated-line-loss incidents.

## 11. Rollout
Start in observe-only mode only for measuring where CAS would fire, **not** as the final safety state. Before enabling autonomous writes, enforce blocking on stale detection for protected paths. Roll out high-risk files first, then all editor writes, then shell/custom-tool write paths.

## 12. Limitations
This guard cannot prevent a race that occurs after verification and before a write by a non-cooperating process; minimizing that interval, atomic replacement, file locking, or isolated worktrees reduce the residual risk. The package therefore combines CAS with narrow writes and post-write verification rather than claiming CAS alone makes concurrent mutation impossible.
