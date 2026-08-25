# Research — Desktop Agent Resource Contention Profiler

## Topic
Desktop AI-agent host resource contention that degrades system-wide input/UI responsiveness.

## Category
Performance

## Problem
AI coding desktop clients can consume enough disk I/O, CPU/event-loop time, or main-process resources that keyboard/mouse/UI responsiveness degrades outside the agent itself. The symptom is easy to misdiagnose as network or model latency because it often appears while the agent is “thinking” or after long idle periods.

## Why it matters now
Fresh August 2026 reports show reproducible system-wide latency on Windows, including measured input-delivery stalls and extreme read I/O after idle time. A separate Claude Code report describes keyboard latency coupled to slow API responses, indicating that local input handling can become entangled with agent/network work.

## Affected users
Developers running desktop/CLI coding agents, Windows-heavy engineering teams, IT/platform teams deploying agent clients, and maintainers diagnosing responsiveness regressions.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #38777, opened 2026-08-15, reports roughly 50× higher Windows input-delivery stalls while Codex is active and links several related reports: https://github.com/openai/codex/issues/38777
2. OpenAI Codex issue #38702, opened 2026-08-15, reports the main process reaching roughly 1.1–1.5 GB/s read I/O and causing system-wide lag after hours idle: https://github.com/openai/codex/issues/38702
3. Anthropic Claude Code issue #14461 reports approximately one-second keyboard-input delay during API slowdowns and argues that stdin/UI work is coupled to the same event loop as remote work: https://github.com/anthropics/claude-code/issues/14461

### Interpretation
The reports do not prove one universal root cause. They establish a recurring observability problem: model/network time, app main-process work, disk throughput, CPU pressure, and user-input stalls are not separated consistently, so teams can optimize the wrong layer or rely on restarts without a regression gate.

## Existing approaches
- Restart or fully quit the client.
- Inspect Task Manager, WPR, Process Explorer, Activity Monitor, or generic OS telemetry.
- Reduce project/context size or disable optional background work.
- Report vendor-specific traces.

## Remaining limitations
Generic monitoring does not correlate agent lifecycle state with host metrics. Vendor logs may omit OS-level input stalls. Restarting clears evidence. Averages hide saturation bursts. Teams lack portable thresholds and before/after regression evidence.

## Root-cause analysis
1. UI/input, model orchestration, indexing, persistence, and background work may share constrained processes/event loops.
2. High-rate repository/session reads can persist even with no visible task.
3. Host telemetry and agent-state telemetry are usually collected separately.
4. Mean CPU or disk figures hide p95/p99 stalls that dominate perceived responsiveness.
5. Troubleshooting often starts after restart, destroying the failure state.

## Improvement opportunity
Provide a dependency-free trace analyzer that accepts sampled host/agent metrics, segments active versus idle states, computes p50/p95/p99 input latency and resource rates, flags correlation with CPU/disk saturation, and enforces configurable regression thresholds. It must not claim causality from correlation.

## Proposed solution
A portable sampling contract, deterministic profiler, baseline/compare workflow, blocking regression hook, enforceable performance rules, and independent verification procedure.

## Metrics
Input latency p50/p95/p99; process CPU/read/write/RSS/event-loop-lag p95; active-vs-idle input-latency ratio; threshold breach count; before/after deltas.

## Trigger
User-visible lag, unexplained host slowdown, desktop-agent upgrade, long-idle regression, or performance-sensitive rollout.

## Inputs
CSV trace and threshold JSON.

## Outputs
JSON summary, threshold findings, correlation warnings, and blocking exit status.

## Relevant sources
- https://github.com/openai/codex/issues/38777
- https://github.com/openai/codex/issues/38702
- https://github.com/anthropics/claude-code/issues/14461
