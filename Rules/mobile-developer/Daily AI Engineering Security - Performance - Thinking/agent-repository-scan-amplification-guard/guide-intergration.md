# Integration Guide

## Scope
This package is designed for AI coding-agent hosts, IDE extensions, sandbox wrappers, repository-indexing services, and orchestration layers that can observe filesystem-discovery operations. It does not require modifying the language model.

## 1. Emit scan events
Wrap every host-initiated repository inventory, Git untracked-file scan, ripgrep file listing, sandbox writable-root traversal, or equivalent discovery operation. Emit one JSONL event after completion or abort with:

- `timestamp`
- `repo`
- `worktree`
- `scope`
- `reason`
- `scanner`
- `elapsed_ms`
- `concurrent_scans`
- optional `files`
- optional `paths`

Use stable reasons such as `initial-inventory`, `changed-files-refresh`, `worktree-created`, or `sandbox-scope-validation`. Do not overload the reason with free-form model text.

## 2. Establish the baseline
Collect events for:
1. an idle saved repository;
2. a normal edit/search task;
3. worktree creation;
4. a dependency-heavy workspace;
5. checkout or branch change.

Run:

```bash
python scripts/scan_guard.py \
  --events scan-events.jsonl \
  --policy config/scan-policy.json \
  --report baseline-report.json
```

Do not change thresholds before the baseline is captured.

## 3. Integrate the pre-scan gate
Before a host maintenance scan starts, compute the same scan identity used by the analyzer. Consult recent events or an in-memory equivalent-scan cache.

For model/user-requested searches, preserve functional behavior; if a scan is suppressed, a correctness-preserving cached result or narrower fresh scan must exist. For maintenance scans, duplicate suppression may fail closed when the configured budget is exceeded.

## 4. Add explicit invalidation
A cached inventory may be reused only until a material invalidation event occurs. Recommended invalidators:

- file create/delete/rename;
- Git checkout/reset that changes the working tree;
- linked worktree create/remove/move;
- sparse-checkout changes;
- `.gitignore`/ignore-policy changes;
- repository root change.

Do not invalidate the entire repository solely because an unrelated UI panel refreshed or a model turn started.

## 5. Narrow roots
Review full-root scans identified by the baseline. Exclude dependency/generated directories from host bookkeeping where safe. The default policy contains example fragments only; adjust them for the repository before enforcement.

Security-sensitive sandbox traversal is a separate trust boundary: never reduce sandbox protection simply to improve performance. Instead reduce repeated setup, cache validated metadata with correct invalidation, or narrow only roots that are demonstrably outside the writable/required scope.

## 6. Enforce concurrency and rate limits
Use `max_concurrent_scans` and `max_scans_per_minute` as circuit breakers. A rate breach should identify the component and scan reason. Avoid queuing unlimited scans because that only converts resource saturation into unbounded latency.

## 7. Verify correctness
Build a discovery fixture containing files that are:

- newly created;
- deleted;
- renamed;
- moved across relevant scopes;
- revealed after checkout;
- affected by ignore-rule changes.

After each optimization, verify the host discovers the expected current state.

## 8. CI/release gate
For releases that modify worktree, sandbox, project indexing, Git status, filesystem watching, or tool orchestration:

```bash
python -m unittest tests/test_scan_guard.py
python scripts/scan_guard.py \
  --events candidate.jsonl \
  --policy config/scan-policy.json \
  --report candidate-report.json
```

Compare candidate metrics with the approved baseline. Exit code 2 blocks on policy violations. Exit code 3 means malformed input/policy; exit code 4 is an I/O failure.

## 9. Rollout
Start in report-only mode if the host has no existing scan visibility. After one representative observation period, enable blocking for duplicate-equivalent scans and concurrency/rate violations. Keep slow-scan thresholds as warnings initially unless a scan duration is known to destabilize the environment.

## 10. Production signals
Alert on:
- duplicate-equivalent ratio above target;
- scan rate bursts;
- maximum concurrency above policy;
- scans entering denied dependency/generated roots;
- p95 scan overhead regression;
- inactive repositories consuming scan budget.

Preserve the scanner identity and reason in alerts so developers can fix the component instead of guessing that the model is slow.