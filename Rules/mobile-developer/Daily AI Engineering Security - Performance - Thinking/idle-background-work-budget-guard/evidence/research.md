# Research Evidence

## Topic
Idle Background Work Budget Guard

## Category
Performance

## Problem
Desktop AI-agent clients can continue expensive background work while no task is actively running: history scans, local-state reconciliation, renderer/main-process loops, Git scanning, log/SQLite maintenance, scheduled reconciliation, or other polling. When this work is unbounded, idle CPU can consume one or more logical cores and large local state can amplify the same path into system-wide stutter, memory exhaustion, or forced reboot.

## Why it matters now
A fresh August 2026 Codex Windows report shows an idle app consuming roughly 1.5–2 logical cores after a recent update, with system-wide cursor stutter. Older open reports independently show sustained idle CPU on a visible window and severe startup CPU/RAM exhaustion when large local histories are present. The recurrence across versions indicates a lifecycle/resource-budget problem rather than one isolated slow operation.

## Affected users
Desktop coding-agent users, developers with large local histories or workspaces, agent-platform teams implementing background indexing/reconciliation, and operators supporting resource-constrained developer machines.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38719 (August 2026) reports idle `ChatGPT.exe` averaging about 151% of one logical core and peaking near 209%, with system-wide pointer stutter. Hiding the app reduced DWM/System load but the main process remained CPU-bound. The reporter had about 27.15 GB of session JSONL and a 1.45 GB log database.
2. Codex issue #30021, still open and updated in August 2026, reports sustained visible-idle CPU averaging about 67% of one logical core, p95 around 106%, with peaks around 144%; minimizing reduced usage close to zero.
3. Codex issue #27848 documents a severe prior regression where launch with large local state drove CPU toward saturation and memory to about 99.9%, freezing the system and requiring reboot. The report explicitly called for bounded, cancellable, lazy history/indexing work.
4. Issue #38719 links additional related Git/history scanning and runaway-loop reports, indicating multiple background work classes can feed the same symptom.

### Interpretation
The common weakness is missing or ineffective resource governance for non-user-visible work. Even when the exact root operation differs, a desktop agent should not allow maintenance/indexing/polling loops to consume unbounded CPU, memory, I/O, or wall time while idle. Visibility/minimize state also appears capable of changing the workload, suggesting background paths are not consistently suspended or rate-limited.

## Existing approaches
- OS process scheduling and generic Electron/browser throttling.
- Ad-hoc debouncing/poll intervals.
- Lazy loading in selected features.
- Manual app restart/minimize.
- Git ignore/exclusion tuning.
- SQLite/WAL maintenance and history compaction.

## Remaining limitations
- Generic OS scheduling does not know user-idle vs active-agent intent.
- A single runaway loop can stay below total-system CPU alarms on high-core machines while saturating one or two cores.
- Background jobs may lack per-job CPU/time/I/O budgets and cancellation.
- Large history/workspace state amplifies O(n) rescans and repeated reconciliation.
- Aggregate process CPU does not identify which background job consumed the budget.
- Retry/recovery can restart the same heavy path indefinitely after launch failures.

## Root-cause analysis
1. No explicit idle-state service-level objective for CPU, memory growth, disk I/O, or polling frequency.
2. Background jobs are not consistently registered with ownership, reason, budget, and cancellation token.
3. Reconciliation/indexing can rescan unchanged state instead of using watermarks/change detection.
4. Failure recovery may retry the same expensive job without a circuit breaker or safe mode.
5. Telemetry focuses on total process usage rather than job-attributed resource deltas.
6. UI visibility/hidden state is not reliably connected to background scheduling policy.

## Improvement opportunity
Introduce a reusable background-work budget layer: every recurring/maintenance job declares owner, trigger, idle/active eligibility, max wall time, minimum interval, and resource budget. A deterministic sampler attributes CPU/wall-time deltas to registered jobs; repeated budget breaches cancel/defer the job, record evidence, and open a bounded recovery path instead of immediately rerunning it.

## Goal
Keep idle agent surfaces responsive and resource-bounded while preserving required maintenance correctness.

## Metrics
Process CPU/core-seconds per minute, per-job wall time, idle duty cycle, memory delta, I/O bytes, jobs started/completed/cancelled, repeated scans of unchanged state, p95 UI/event-loop delay when available, breach count, recovery count.

## Trigger
Desktop/app startup, transition to idle/hidden state, recurring maintenance scheduling, or investigation of unexplained idle CPU/memory/I/O.

## Inputs
Job registry, sampled process/job telemetry, idle/active state, configured budgets, optional before/after benchmark traces.

## Outputs
Budget decision log, baseline/optimized metrics, PASS/BLOCK result, identified offender jobs, defer/cancel recommendation.

## Relevant sources
- https://github.com/openai/codex/issues/38719
- https://github.com/openai/codex/issues/30021
- https://github.com/openai/codex/issues/27848
