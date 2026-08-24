# Research — Large Diff Memory Budget Guard

## Topic
Bound memory and serialization amplification from large-file diff/change tracking in coding agents

## Category
Performance

## Problem
Coding-agent runtimes often retain baseline/current file contents, rendered diffs, patch history, event payloads, and logs so users can inspect changes. On large or generated files, the same bytes can be retained, re-rendered, cloned, serialized, logged, persisted, and later hydrated multiple times. Without byte budgets and large-file fallbacks, small edits can create unbounded RAM/disk amplification and eventually OOM or crash sessions.

## Why it matters now
August 2026 Codex reports provide concrete mechanisms and measurements: `TurnDiffTracker` can retain and repeatedly clone full accumulated diffs until RSS reaches tens of GB; a single deletion generated a 203 MB `patch_apply_end` record that crashed desktop history hydration; and multi-agent fan-out duplicated multi-GB parent context into many child rollout files, producing very large working sets. These signals show that observability/history structures themselves need bounded byte contracts.

## Affected users
Developers editing large generated files, logs, data fixtures, lockfiles, snapshots, or minified assets; long-running coding-agent users; multi-agent workflows; platform teams implementing diff/history/event pipelines.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #39231, opened 2026-08-18, reports `TurnDiffTracker` storing full baseline/current contents, repeatedly rendering/joining accumulated unified diff, cloning it for events, and logging full diff text. The repro on large text files showed RSS growing roughly 10–30 MB/s and an observed OOM near 70 GB. https://github.com/openai/codex/issues/39231
2. OpenAI Codex issue #32904 reports a 203,310,615-character `patch_apply_end` JSONL record caused by deleting a large JSON file through `apply_patch`; reopening/hydrating the thread crashed the desktop app. https://github.com/openai/codex/issues/32904
3. OpenAI Codex issue #39469, opened 2026-08-19, reports multi-agent fan-out duplicating full parent context into 22 rollout files (9.4 GB each, ~208 GiB total) with the app reaching ~14 GB working set; quarantining oversized files reportedly removed symptoms. https://github.com/openai/codex/issues/39469
4. OpenAI Codex issue #38542, opened 2026-08-14, reports sharply elevated memory with multiple windows and long-history/tool-heavy threads, remaining above empty-task baseline after settling. https://github.com/openai/codex/issues/38542

### Interpretation
The reports cover distinct subsystems and should not be conflated into one product bug. They support a broader reusable engineering conclusion: change/history observability must be byte-budgeted at every representation boundary, especially when the same large content is copied into in-memory trackers, event buses, logs, persistence, and child-agent context.

## Existing approaches
- Time-bounded diff algorithms.
- Git/unified diff rendering.
- Event/history persistence for replay and UI hydration.
- Context compaction and session archival.
- OS/container memory limits and OOM recovery.
- File ignore rules for generated artifacts.

## Remaining limitations
- Time bounds do not bound output size; a timeout fallback can produce whole-file replacement hunks.
- Per-component limits miss cross-layer amplification from tracker → event → log → JSONL → UI → subagent.
- Ignoring generated files depends on correct repository configuration and does not cover unexpected large user files.
- OOM limits detect failure too late and can destroy long-running task state.
- History serializers may preserve full deleted content even when review needs only metadata or a bounded excerpt.

## Root-cause analysis
1. No shared byte budget for change observability per file/turn/task.
2. Large-file paths use the same full-content representation as normal source files.
3. Diff fallback behavior optimizes time but not retained/output bytes.
4. Aggregated diffs are eagerly rebuilt/cloned/logged rather than streamed or represented by references.
5. Persistence and hydration accept single unbounded event records.
6. Child/fan-out workflows duplicate parent artifacts instead of referencing or selectively loading them.

## Improvement opportunity
Introduce layered byte budgets before expensive representations are created: file tracking threshold, rendered diff threshold, event payload threshold, log threshold, persisted-record threshold, and task aggregate threshold. When exceeded, retain hashes/metadata plus bounded excerpts and an explicit `elided_due_to_budget` marker; optionally spill content to a controlled artifact store. Measure amplification ratio from source-change bytes to peak retained/serialized bytes.

## Proposed solution
This package provides a baseline profiler, enforceable rules, independent verifier, bounded Measure→Diagnose→Optimize workflow, pre-change hook contract, and a dependency-free Python scanner that identifies oversized files and oversized JSONL history records before they become expensive diff/history inputs.

## Metrics
- Peak RSS and RSS delta per edit.
- Bytes retained by change tracker per task.
- Maximum rendered diff/event/history record bytes.
- Observability amplification ratio = retained+serialized bytes / changed source bytes.
- History hydration time and failure rate.
- Disk bytes per parent/child rollout.
- Percentage of changes represented by bounded metadata/excerpts.

## Trigger
Before tracking/diffing a large file, after a diff/event is produced, before persisting history, and when profiling an existing session store.

## Inputs
Repository path or file list, JSONL history/telemetry, configured byte thresholds.

## Outputs
Oversize findings, byte totals, largest files/records, blocking status, and optimization evidence.

## Verification
Verified only when large-file fixtures are detected before full-content tracking, oversized history records are flagged deterministically, representative workloads show bounded peak memory/record sizes, and normal source-file review quality remains acceptable.

## Relevant sources
- https://github.com/openai/codex/issues/39231
- https://github.com/openai/codex/issues/32904
- https://github.com/openai/codex/issues/39469
- https://github.com/openai/codex/issues/38542
