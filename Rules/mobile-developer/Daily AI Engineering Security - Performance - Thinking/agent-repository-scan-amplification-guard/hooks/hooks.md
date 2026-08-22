# Hooks

## Pre-task scan baseline hook
**Trigger:** before a representative benchmark task or host release test.  
**Action:** start scan-event capture and record repository/worktree identity plus active/inactive project state.  
**Command:** host-specific instrumentation; output JSONL compatible with `scripts/scan_guard.py`.  
**Expected result:** a clean trace boundary exists before model/tool activity.  
**Failure behavior:** block performance conclusions if scan attribution cannot be separated from tool execution.

## Pre-tool scan budget hook
**Trigger:** immediately before filesystem discovery, repository inventory, sandbox refresh, or background Git scan.  
**Action:** compute scan identity `(repo, worktree, scope, reason, scanner)` and check recent equivalent scans, rate, concurrency, and scope policy.  
**Command:** in-process policy check or append prospective event and run `python scripts/scan_guard.py --events scan-events.jsonl --policy config/scan-policy.json`.  
**Expected result:** operation is within policy or explicitly blocked/warned.  
**Failure behavior:** suppress equivalent maintenance scan or stop the host operation with a diagnostic; do not suppress user-requested search without a correctness-preserving fallback.

## Post-scan telemetry hook
**Trigger:** every completed or aborted scan.  
**Action:** append elapsed time, files/paths observed, concurrency and scanner identity to JSONL.  
**Expected result:** scan overhead is observable independently of downstream tool latency.  
**Failure behavior:** mark run unverifiable for scan-performance claims; do not fabricate zero-cost telemetry.

## Filesystem invalidation hook
**Trigger:** file create/delete/rename, checkout, worktree creation/removal, sparse-checkout change, ignore-policy change.  
**Action:** invalidate only affected cached scan identities/scopes.  
**Expected result:** new repository state becomes discoverable without a global rescan when narrower invalidation is sufficient.  
**Failure behavior:** prefer one justified fresh scan over stale inventory; never keep stale cache for speed.

## Inactive-project hook
**Trigger:** project/workspace loses active-task status.  
**Action:** cancel or deprioritize nonessential background full-repository scans and preserve only explicitly required watchers.  
**Expected result:** inactive repositories do not consume active scan budget.  
**Failure behavior:** record background scan reason and escalate if host cannot isolate inactive projects.

## Post-change verification hook
**Trigger:** after modifying scanner, sandbox, worktree, indexing or invalidation logic.  
**Action:** run regression scenarios and the deterministic guard.  
**Command:** `python scripts/scan_guard.py --events candidate.jsonl --policy config/scan-policy.json --report candidate-report.json` plus repository discovery tests.  
**Expected result:** guard exit 0 and correctness fixtures pass.  
**Failure behavior:** revert/disable the optimization candidate rather than widening thresholds automatically.

## Final verification hook
**Trigger:** before declaring the performance fix complete.  
**Action:** compare baseline vs candidate scan count, duplicate ratio, total scan time, concurrency and total tool latency; confirm file discovery correctness.  
**Expected result:** measurable improvement with no correctness regression.  
**Failure behavior:** report Implemented or Measured but not Verified.