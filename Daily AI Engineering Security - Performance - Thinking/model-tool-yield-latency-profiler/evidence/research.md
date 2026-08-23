# Research — Model-Tool Yield Latency Profiler

## Topic
Model↔tool yield latency and avoidable serial round-trips in agent runtimes

## Category
Performance

## Problem
Tool-heavy agents can spend substantial wall-clock time in orchestration/model round-trips rather than in the tools themselves. Counting tool calls obscures whether independent operations share a model yield or cause repeated serial yields.

## Why it matters now
Agent frameworks are using more tools, MCP servers and subagents. In 2026, both platform guidance and public bug reports increasingly expose yield/dispatch overhead as a distinct performance bottleneck rather than a slow-tool problem.

## Affected users
Agent runtime developers, coding-agent users, MCP platform builders, and teams operating latency-sensitive tool workflows.

## Current public evidence

### Observed evidence
1. OpenAI's GPT-5.4 release explains that a tool yield occurs when the assistant waits for tool responses and states that yields are a better proxy of latency than raw tool calls because parallel calls can share a yield. Source: https://openai.com/index/introducing-gpt-5-4/
2. OpenAI model guidance for GPT-5.6 recommends Programmatic Tool Calling for bounded, tool-heavy workflows that do not require fresh model judgment between each step, explicitly targeting intermediate tool execution without repeated model round-trips. Source: https://developers.openai.com/api/docs/guides/latest-model
3. Anthropic Claude Code issue #81918 (2026-07-28) reports independent subagent tool calls executing sequentially even when explicitly requested to batch, producing one tool-use/wait cycle per independent read. Source: https://github.com/anthropics/claude-code/issues/81918
4. Claude Code issue #76854 (2026-07-12) reports Desktop MCP calls dispatched roughly 3–6 seconds apart while the local MCP server responds around 50 ms, indicating overhead in the host dispatch/model loop rather than the tool. Source: https://github.com/anthropics/claude-code/issues/76854
5. Claude Code issue #81258 (2026-07-25) reports a roughly 5–10 second fixed latency floor per tool call across MCP and even built-in `Glob`, again separating host/tool-calling overhead from actual tool execution. Source: https://github.com/anthropics/claude-code/issues/81258

## Existing approaches
- Parallel tool calls emitted in one model response.
- Prompt instructions asking the model to batch independent calls.
- Framework-level async execution.
- Programmatic/code-based tool orchestration for deterministic workflows.
- General tracing/APM around tool duration.

## Remaining limitations
- Tool count alone does not identify expensive model yields.
- Prompt guidance can be ignored or applied inconsistently by models/subagents.
- Blanket parallelism can break ordering, shared-state mutations, approval flows and cancellation semantics.
- APM often measures server/tool latency but not the gaps between model and tool phases.
- Teams lack a deterministic way to identify which serial sequences are actually safe optimization candidates.

## Root-cause analysis
1. Model/tool orchestration is represented as turns, but performance dashboards often aggregate only request/tool durations.
2. Independence is implicit rather than declared or inferred from trace metadata.
3. Hosts rely on model behavior for batching instead of enforcing a bounded execution plan.
4. Every model re-entry may carry fixed inference, serialization, UI, transport, policy and scheduling overhead.
5. Optimization decisions are made without a before/after workload-equivalent benchmark.

## Improvement opportunity
Make yields first-class telemetry. Compute model/tool phases, yield durations, idle gaps, and serial independent sequences. Require explicit dependency classification before recommending batching or programmatic execution. Gate rollout on before/after measurements.

## Goal
Reduce wall-clock latency and unnecessary model re-entry while preserving correctness and authorization boundaries.

## Metrics
Tool yields/task, p50/p95 yield duration, total wall time, tool-active ratio, orchestration-gap ratio, candidate serial groups, estimated safe-batching savings, post-change correctness/regression rate.

## Trigger
A trace shows high end-to-end latency, many serial tool phases, or a regression in yield p95/count.

## Inputs
Timestamped model/tool trace plus optional dependency-group metadata and baseline thresholds.

## Outputs
Yield report, safe optimization candidates, regression status, before/after comparison inputs.

## Verification
Use synthetic traces with parallel and sequential calls, malformed events, and long orchestration gaps. On a real workload, require identical task success criteria before and after optimization.
