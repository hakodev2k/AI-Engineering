# Research Evidence

## Topic
Thread Hydration Working-Set Guard

## Category
Performance

## Problem
Long-lived AI-agent threads can become expensive to reopen because desktop/app-server clients hydrate, parse, serialize, retain, or render much more historical state than the active task needs. Large histories can therefore turn resume/open operations into high-latency, high-memory control-plane work that blocks new turns, remote steering, or the whole client.

## Why it matters now
Multiple recent Codex reports describe large persisted threads consuming multi-gigabyte working sets, long `thread/resume` CPU time, queued request starvation, and aggressive auto-resume behavior. This is distinct from model context-window size: model compaction can succeed while the local persisted/UI-visible history remains huge.

## Affected users
Developers with long coding-agent sessions, teams using desktop/IDE agents, remote-control users, operators of app-server style agent runtimes, and platform builders that persist full tool-heavy transcripts.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #40934, opened 2026-08-26, reports two large threads (12.7k and 146k rollout items) causing 7.6–15.4 GB RSS during launch-time auto-resume and explicitly identifies full-thread costs at launch, attach, and render time.
2. OpenAI Codex issue #38787, opened 2026-08-15, reports `thread/resume` becoming effectively quadratic on a 22,617-record active thread, CPU-bound long enough to prevent remote steering.
3. OpenAI Codex issue #40540, opened 2026-08-25, reports app-server memory reaching roughly 20–28 GB during thread hydration, with queued turns timing out and the runtime eventually being killed.
4. OpenAI Codex issue #29510, opened 2026-06-23, reports pathological persisted rollout history driving app-server footprint into tens of gigabytes on macOS.
5. OpenAI Codex issue #41512, opened 2026-08-29, shows that paginated thread-resume semantics are already being introduced, but client/server version mismatch can make existing long threads unreadable.

### Interpretation
The recurring engineering gap is the absence of a measurable working-set contract for thread hydration. Persisted history, active model context, UI history, and immediately resident state are often treated as one object. That makes open/resume cost scale with total historical size even when only a bounded suffix plus compacted state is required for continuation.

### Proposed solution
Introduce a reusable measurement and enforcement package around hydration: baseline resume latency and resident memory, cap per-thread loaded items, cap concurrent hydrations, prefer lazy/on-demand resume, require pagination/windowing compatibility checks, and block completion when the new path regresses measured budgets.

## Existing approaches
- Full transcript persistence with automatic resume.
- Model-context compaction while leaving local history intact.
- Pagination/windowing of thread history.
- Lazy rendering or list virtualization in UI layers.
- Detached/shallow continuation proposals that preserve effective context without inheriting the entire visible history.

## Remaining limitations
- Model compaction does not reduce app-server/UI hydration cost by itself.
- Pagination can regress across client/server versions if protocol capabilities are not negotiated.
- UI virtualization alone does not bound backend parsing or in-memory rollout structures.
- A global concurrency cap without per-thread size budgeting can still let one huge thread monopolize resources.
- Memory-only measurements can miss queue starvation and CPU-bound serialization.

## Root-cause analysis
1. Total persisted history is conflated with required active working set.
2. Resume APIs lack explicit cost/budget contracts.
3. Large histories are eagerly hydrated or auto-resumed before user intent requires them.
4. Pagination semantics are version-sensitive and may not be capability-negotiated.
5. Performance tests cover ordinary sessions but not 10k–100k+ record histories.
6. Queueing and memory metrics are often observed separately rather than correlated to a specific hydration operation.

## Improvement opportunity
Make thread hydration an observable bounded operation. Require budgets for p95 resume latency, peak RSS, loaded item count, and concurrent hydration count. Test representative small/medium/oversized histories. Fail closed to lazy/paginated access rather than eagerly loading an oversized thread.

## Goal
Keep open/resume operations responsive and bounded as persisted thread history grows, without deleting required history or weakening correctness.

## Metrics
- p50/p95 `thread/resume` latency.
- Peak app-server RSS delta during hydration.
- Number of history items loaded per thread.
- Peak concurrent hydrations.
- Queue wait time for unrelated turns.
- CPU time per hydration.
- Regression ratio versus baseline.

## Trigger
Use when changing thread persistence, resume APIs, pagination, desktop/IDE history rendering, startup auto-resume behavior, or remote steering of long-running sessions.

## Inputs
Hydration telemetry JSONL, thread-size distribution, policy thresholds, client/server capability versions, and representative large-thread fixtures.

## Outputs
Baseline report, violations, optimization decision, before/after comparison, and verification record.

## Relevant sources
- https://github.com/openai/codex/issues/40934
- https://github.com/openai/codex/issues/38787
- https://github.com/openai/codex/issues/40540
- https://github.com/openai/codex/issues/29510
- https://github.com/openai/codex/issues/41512
