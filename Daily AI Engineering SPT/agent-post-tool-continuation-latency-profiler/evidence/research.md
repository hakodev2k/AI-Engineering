# Research — Agent Post-Tool Continuation Latency Profiler

**Research date:** 2026-08-20 (UTC+7)
**Category:** Performance

## Problem
Agentic coding systems can appear slow even when the underlying tool finishes quickly. The delay may occur after a tool result is already available but before the agent produces its next useful action. Without phase-level timing, teams misdiagnose the bottleneck as filesystem, shell, MCP, network, or test latency and optimize the wrong layer.

## Why it matters now
Current public reports show multi-minute perceived tool latency where local commands complete in milliseconds or seconds. As coding agents use larger contexts, MCP servers, sandboxing, images, background processes, and multi-step orchestration, end-to-end latency increasingly contains multiple layers that need separate measurement.

## Current public signals

### Signal 1 — OpenAI Codex issue #34627, 2026-07-21
A user measured one-line `apply_patch` operations taking 81–258 seconds while direct filesystem writes, Git operations, and local tests remained fast. One underlying test finished in 1.21 seconds while the surrounding Codex tool operation took about 30.5 seconds. The issue remains open and is labeled performance/tool-calls/sandbox.

Source: https://github.com/openai/codex/issues/34627

### Signal 2 — OpenAI Codex issue #24738, 2026-05-27
A long Windows session showed tool results returning in roughly 0.23–0.6 seconds followed by 92.9–118.6 seconds before the next useful agent action. The report explicitly distinguishes tool execution from post-tool-result continuation latency.

Source: https://github.com/openai/codex/issues/24738

### Signal 3 — Codex long-session processing regression, issue #34971
A July 2026 report describes severe slowdown, repeated tool loops, timeouts, large cached-context processing, and small patches taking 40–75 minutes in saturated long sessions. This supports the broader interpretation that orchestration/context processing can dominate wall time even when tool work is modest.

Source: https://github.com/openai/codex/issues/34971

### Signal 4 — tracing capabilities exist, but diagnosis still requires a phase contract
The OpenAI Agents SDK traces runner invocations, turns, generations, function tools, handoffs, guardrails, and custom spans with start/end timestamps. These primitives make phase attribution possible, but an application still needs explicit derived metrics and regression gates for the gap between tool completion and the next model/agent action.

Sources:
- https://openai.github.io/openai-agents-python/tracing/
- https://openai.github.io/openai-agents-js/guides/tracing/
- https://openai.github.io/openai-agents-python/ref/tracing/

## Existing approaches
1. End-to-end task timing.
2. Tool handler duration only.
3. Generic tracing dashboards.
4. Ad-hoc log inspection and timestamp subtraction.
5. Restarting clients, disabling MCP servers, reducing repository size, or blaming disk/network before proving the bottleneck.

## Observed limitations
- End-to-end timing cannot attribute latency to a phase.
- Tool duration can be low while user-perceived latency is high.
- Generic traces expose timestamps but may not calculate continuation gaps or enforce budgets.
- Manual inspection does not scale across many runs and regressions.
- Context hydration, model queueing, sandbox setup, broker scheduling, state persistence, result ingestion, and UI rendering can be conflated.
- Optimizing the tool itself may produce no measurable improvement when the dominant cost is outside the tool.

## Root-cause hypotheses
These are hypotheses to test, not assumed causes:
- broker/worker queue delay before or after tool execution;
- sandbox initialization or permission evaluation;
- tool-result serialization/ingestion overhead;
- model re-entry or provider queue latency;
- context hydration/compaction cost after tool output;
- local state/SQLite persistence delay;
- UI/rendering delay;
- repeated retry/poll behavior.

## Improvement target
Create a reusable measurement boundary that records:

`agent_action -> tool_start -> tool_end -> result_ingested -> next_model_start -> next_agent_action`

Then derive:
- tool runtime;
- result-ingestion delay;
- continuation gap;
- model continuation latency;
- end-to-end tool cycle;
- continuation/tool ratio;
- p50/p95/p99 by tool and environment;
- regression threshold violations.

The package should classify the likely bottleneck only from measured timing, not guesswork.

## Success metrics
- 100% of analyzed tool cycles have explicit phase timestamps or are marked incomplete.
- p95 continuation gap is measured independently from p95 tool runtime.
- regressions fail a deterministic budget gate.
- no optimization is accepted without before/after measurements from comparable workloads.
- diagnosis reports identify the dominant measured phase for each slow cycle.
- missing timestamps never become zero-duration measurements.

## Observed evidence vs interpretation vs proposal
### Observed evidence
Multiple public Codex reports show large wall-clock delays not explained by local command runtime, and official tracing SDKs expose span timing primitives.

### Interpretation
A recurring engineering failure is insufficient latency attribution: developers measure only tools or whole tasks and therefore cannot reliably locate post-tool continuation stalls.

### Proposed engineering solution
Instrument a phase contract, normalize traces into a small JSON event schema, derive deterministic latency metrics, compare against policy budgets, and require a measured before/after regression report for fixes.

## Scope boundary
This package does not claim to fix a provider, desktop client, sandbox, or operating system. It provides diagnosis, regression prevention, and evidence-driven optimization workflow. Security controls, sandboxing, and correctness checks must not be disabled merely to improve latency.