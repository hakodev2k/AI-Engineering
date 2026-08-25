# Research

## Topic
Provider-agnostic phase latency attribution for AI-agent runs.

## Category
Performance

## Problem
Total runtime and model latency do not reveal where agent time is spent. Host orchestration, queueing, preparation, provider process startup, loop transitions, rendering, and long-session processing can dominate or accumulate while appearing as generic slowness.

## Why it matters now
Agent systems increasingly execute dozens or hundreds of model/tool transitions. Small host overhead compounds, while cold-start and long-session costs are often invisible in provider metrics. Recent August 2026 reports ask for phase-level observability and show measurable platform-specific transition overhead.

## Affected users
Agent-platform builders, coding-agent users, performance engineers, self-hosted runners, Windows developers, and teams comparing providers or runtime versions.

## Current public evidence

### Observed evidence
1. Multica issue #6859, opened 2026-08-12, says current broad lifecycle timestamps cannot distinguish queue pickup, payload hydration, resource locks, environment preparation, repository checkout, provider startup, platform-control calls, and actual task work. It proposes stable phase timestamps and time-to-first-business-action: https://github.com/multica-ai/multica/issues/6859
2. OpenCode issue #44515, opened 2026-08-23, compares the same machine/provider/model and observes native Windows loop-to-stream transition around 1.19 s versus roughly 0.52 s under WSL2/Linux, with additional transition/TUI latency: https://github.com/anomalyco/opencode/issues/44515
3. OpenCode issue #30067, opened 2026-05-31, reports long agent loops slowing from about 6 s per step to 30/60/100+ s and attributes the growth to O(N²) text/reasoning delta accumulation: https://github.com/anomalyco/opencode/issues/30067
4. OpenCode issue #31293, opened 2026-06-08, reports Windows subagent invocation taking 2–4 minutes even for trivial prompts across models, indicating host/subagent path latency can be distinct from primary-agent inference: https://github.com/anomalyco/opencode/issues/31293

### Interpretation
The common problem is attribution, not a single runtime bug. An operator needs stable host-level phase definitions before deciding whether to tune prompts, caching, process startup, filesystem paths, session processing, provider selection, or orchestration.

## Existing approaches
- Total wall-clock duration.
- Provider request latency and first-token metrics.
- General logs with timestamps.
- Ad hoc before/after comparisons.
- Product-specific tracing/observability.

## Remaining limitations
- Timestamps are often not normalized into comparable phases.
- Provider metrics exclude host preparation and post-tool transitions.
- Total duration hides whether useful work begins late.
- Cross-platform comparisons can mix model, filesystem, process, and UI overhead.
- Long-session complexity can create per-step growth that a single total-duration metric cannot localize.

## Root-cause analysis
1. Agent execution crosses multiple processes and subsystems.
2. Instrumentation names lifecycle events differently across providers/runtimes.
3. Wall-clock timestamps across hosts are unsafe for small duration calculations.
4. Platform-control work and task/business work are commonly mixed.
5. Optimization is attempted before a phase baseline exists.

## Improvement opportunity
Define a minimal, versioned phase event contract and compute monotonic durations inside each runtime. Separate provider readiness, first provider event, first business action, first visible output, and terminal completion. Use repeated before/after traces to attribute improvements.

## Goal
Make at least 95% of measured run time attributable to named phases and prevent performance claims without comparable baseline evidence.

## Metrics
Per-phase p50/p95, total runtime, time-to-first-business-action, time-to-first-visible-output, unattributed time ratio, regression percentage.

## Trigger
Slow-run report, runtime/provider upgrade, platform migration, orchestration change, cache change, or benchmark release.

## Inputs
Versioned JSONL phase events and benchmark metadata that excludes sensitive task content.

## Outputs
Per-run phase breakdown, aggregate metrics, dominant phase, and machine-readable verification result.

## Relevant sources
- https://github.com/multica-ai/multica/issues/6859
- https://github.com/anomalyco/opencode/issues/44515
- https://github.com/anomalyco/opencode/issues/30067
- https://github.com/anomalyco/opencode/issues/31293
