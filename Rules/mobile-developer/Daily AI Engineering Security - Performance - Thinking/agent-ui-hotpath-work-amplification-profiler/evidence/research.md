# Research

## Topic
Agent UI Hot-Path Work Amplification Profiler

## Category
Performance

## Problem
Agent clients can perform repeated copies, formatting work, and subscriber wakeups on frequently executed history/state paths even when ownership does not require copying or state has not changed.

## Why it matters now
Agent sessions increasingly contain large MCP/tool histories and many concurrent UI/state consumers. OpenAI merged two concrete Codex optimizations on 2026-08-12 targeting avoidable work in such paths.

## Affected users
Coding-agent users with long/heavy sessions, desktop/TUI client developers, agent-platform engineers, and teams integrating high-volume MCP tools.

## Current public evidence — Observed
1. OpenAI Codex PR #38103, merged 2026-08-12, explicitly changed MCP invocation formatting to borrow invocation/server/tool names instead of cloning them when rendering TUI history cells: https://github.com/openai/codex/pull/38103
2. OpenAI Codex PR #38170, merged 2026-08-12, switched running-turn watcher publication to `send_if_modified` so subscribers are not woken when a thread status update leaves the count unchanged; it also added a test proving permission requests during a turn should not notify the count watcher: https://github.com/openai/codex/pull/38170
3. Open Codex issue #30408, updated 2026-08-19, reports a separate long-session memory-pressure failure where per-thread MCP processes accumulate to ~9.3 GB RSS. This does not share the clone/wakeup root cause, but demonstrates that long-lived agent clients have material memory-lifecycle sensitivity and need measurable regression controls: https://github.com/openai/codex/issues/30408

## Existing approaches
Borrow/reference immutable data, memoize formatting, virtualize histories, notify reactive watchers only on semantic changes, profile allocations, and optimize isolated hot spots.

## Remaining limitations
One fixed clone or watcher does not prevent similar amplification elsewhere. Micro-optimizations can accidentally change ownership/lifetime semantics or suppress meaningful events. Without an equivalent before/after workload and explicit budgets, improvements are difficult to verify and regressions can return unnoticed.

## Root-cause analysis
- Hot paths evolve without per-event allocation/wakeup budgets.
- Large tool payloads magnify small per-render copies.
- Reactive publication can be coupled to every mutation instead of semantic value changes.
- Performance fixes may be reviewed qualitatively rather than against captured workloads.
- Ownership correctness and performance are often evaluated separately.

## Improvement opportunity
Provide a reusable profiler and workflow that quantifies copy/wakeup amplification, establishes a baseline, guides one hypothesis at a time, and requires identical-workload regression verification plus correctness tests.

## Goal
Reduce avoidable CPU/memory/event work without changing observable agent behavior.

## Metrics
Total clone bytes; clone bytes/event; redundant wakeups; p95 event duration; no-change ratio; amplification ratio; behavior-regression count.

## Trigger
Rising session RSS/CPU, slow history rendering, high event volume, large MCP payloads, or changes to reactive state/render code.

## Inputs
Captured per-event telemetry and performance budget; no conversation content is required.

## Outputs
Baseline report, budget pass/fail, diagnosed amplification sources, and before/after comparison.

## Interpretation
The two merged Codex PRs show real avoidable work in separate client hot paths. They do not establish a universal performance defect in every agent UI. The reusable value is measurement and regression control for the pattern.

## Proposed solution
Measure -> diagnose -> hypothesize -> optimize -> replay the same workload -> independently verify correctness and performance.