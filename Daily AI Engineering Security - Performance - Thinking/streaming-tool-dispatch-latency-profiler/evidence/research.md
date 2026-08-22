# Research

## Topic
Streaming Tool Dispatch Latency Profiler

## Category
Performance

## Problem
Streaming agent runtimes may wait for the model response/message to finish before dispatching a tool whose complete call arguments were already available. This creates avoidable idle latency between `tool_call_complete` and `tool_start`, especially for slow tools or responses containing additional streamed text/tool calls.

## Why it matters now
OpenAI Agents SDK issue #3404, opened 2026-05-14 and still public, requests an eager-dispatch hook so a tool can start as soon as its tool-use block finishes instead of waiting for `message_stop`. Earlier issue #1282 documented user-visible delay from buffering streamed tool-call events until execution. The current running-agents documentation separately exposes local tool concurrency after calls are emitted, showing that concurrency control and dispatch timing are distinct optimization layers.

## Affected users
Agent application developers, realtime assistants, coding agents, voice/realtime workflows, orchestration platforms, and teams with network/database/MCP tools on the critical path.

## Current public evidence
### Observed evidence
- OpenAI Agents SDK #3404: proposes eager tool dispatch overlapping tool execution with continued model streaming; current path waits until message completion. https://github.com/openai/openai-agents-python/issues/3404
- OpenAI Agents SDK #1282: reported streamed tool-call event buffering that delayed realtime feedback; it demonstrates dispatch/visibility timing as a recurring integration concern. https://github.com/openai/openai-agents-python/issues/1282
- Official running-agents docs expose `max_function_tool_concurrency`, while provider `parallel_tool_calls` controls emission; these controls do not by themselves measure the delay from complete tool arguments to actual tool start. https://openai.github.io/openai-agents-python/running_agents/

### Interpretation
Before adopting eager dispatch, teams need evidence that dispatch wait is material and that earlier execution is safe for their tool semantics. A profiler should separate model streaming time, dispatch wait, execution time, and post-tool continuation time.

## Existing approaches
Parallel tool calls; local function-tool concurrency limits; tracing; manually timestamped logs; framework-specific streaming callbacks.

## Remaining limitations
Aggregate request latency hides dispatch wait. Parallelism does not help when the completed tool call waits for the rest of the model message. Naive eager dispatch can be unsafe if a provider mutates an apparently complete call, if execution order is significant, or if approval/guardrails have not completed.

## Root-cause analysis
- Timing telemetry usually records model span and tool span but not the gap between call completion and tool start.
- Dispatch is often coupled to message finalization.
- Safety prerequisites for eager execution are not explicit.
- Optimization decisions are made without baseline distributions.

## Improvement opportunity
Instrument four timestamps per call: arguments complete, approval/guardrails complete, tool start, tool end. Compute dispatch wait and safe-eager opportunity. Only recommend eager execution when the call is finalized, approved, guardrails passed, ordering constraints satisfied, and measured p95 dispatch wait is material.

## Goal / Metrics
- Baseline p50/p95 dispatch wait, tool duration, and end-to-end critical-path latency.
- Detect calls where dispatch wait is >= configured threshold.
- Quantify theoretical overlap without claiming realized improvement.
- After implementation, require measured p95 latency improvement with zero semantic/ordering regressions.

## Trigger / Inputs / Outputs
Trigger: high agent latency, streaming migration, new slow tools, or orchestration changes. Inputs: JSONL tool lifecycle events. Outputs: latency report, eager-eligible count, blocking safety violations, before/after comparison.
