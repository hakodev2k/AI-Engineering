# Research

## Topic
Background worker memory lifecycle leaks in AI coding/agent runtimes

## Category
Performance

## Problem
Background workers can outlive useful work or retain large heaps after completion, causing monotonic RSS growth, swap pressure, OOM kills, and host freezes.

## Why it matters now
AI coding products are moving toward persistent app servers, background sessions, agent fleets, and pre-warmed workers. That increases the cost of lifecycle bugs because a leak can continue while the visible task is idle.

## Affected users
Developers using desktop/CLI coding agents, teams running unattended agents, platform builders embedding agent SDKs, and workstation/CI operators.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #88116, opened 2026-08-20, reports `bg-spare` workers that do not release memory after jobs complete, with monotonic RSS growth saturating a 24 GB Mac in about seven days. https://github.com/anthropics/claude-code/issues/88116
2. Anthropic Claude Code issue #87891, opened 2026-08-19 and marked reproduced, reports stale/unclaimed background workers being re-adopted on daemon restart: 64 leaked processes retaining about 7.1 GB RSS after six weeks. https://github.com/anthropics/claude-code/issues/87891
3. Anthropic Claude Code issue #85015, opened 2026-08-08, reports two background subagent processes reaching roughly 26.4 GiB and 20.3 GiB physical footprint and freezing a 16 GB Mac. https://github.com/anthropics/claude-code/issues/85015
4. OpenAI Codex issue #36431, opened 2026-08-01, reports `codex app-server` runaway memory growth, ~54 GB swap exhaustion and repeated crashes. https://github.com/openai/codex/issues/36431
5. OpenAI Codex issue #39732, opened 2026-08-20, isolates an unbounded `computer-use` worker-thread leak when `CODEX_HOME` traverses a symlink, ending in V8 OOM in ~90 seconds. https://github.com/openai/codex/issues/39732

## Interpretation
These reports are independent signals from two agent ecosystems and multiple lifecycle surfaces. They do not prove one shared implementation bug; they support a recurring engineering failure class: persistent workers lack measurable lifecycle/RSS invariants or those invariants are not enforced consistently.

## Existing approaches
OS OOM/pressure handling, app supervisors, idle pools, restart recovery, process cleanup on exit, and product-specific governors.

## Remaining limitations
OS pressure handling is reactive and may kill unrelated processes first. A supervisor can re-adopt stale children. Restarting hides retained-memory evidence. Generic CPU-idle detection does not prove a worker is safe to kill. Product dashboards rarely expose post-job retained RSS or time-to-baseline.

## Root-cause analysis
Likely root causes include missing lease expiry/reaping, retained output/transcript buffers, stale worker adoption after supervisor restart, unbounded worker-thread creation, inconsistent canonical-path identity, and absence of a post-job memory reclamation SLO.

## Improvement opportunity
Use an external read-only verifier to establish a baseline, sample matching process trees, calculate retained RSS and worker-count deltas after cooldown, detect stale workers by age/activity evidence, and block completion when memory does not converge. Keep containment separate from measurement and require human approval before terminating ambiguous processes.

## Goal
Make memory lifecycle regressions observable and release-gating instead of relying on eventual OOM.

## Metrics
Peak tree RSS; post-job RSS delta; worker count delta; stale-worker count; RSS slope; time-to-baseline; swap growth; OOM/restart count.

## Trigger
After background-agent workloads, daemon upgrades/restarts, repeated session creation, or any unexplained memory pressure.

## Inputs
Process match expression, idle baseline snapshot, cooldown, RSS budget, stale-age budget.

## Outputs
JSON snapshots, comparison result, offending process evidence, pass/block exit status.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/88116
- https://github.com/anthropics/claude-code/issues/87891
- https://github.com/anthropics/claude-code/issues/85015
- https://github.com/openai/codex/issues/36431
- https://github.com/openai/codex/issues/39732
