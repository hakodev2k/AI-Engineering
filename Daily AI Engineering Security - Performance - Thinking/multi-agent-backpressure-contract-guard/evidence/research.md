# Research — Multi-Agent Backpressure Contract Guard

## Topic
Multi-Agent Backpressure Contract Guard

## Category
Performance

## Problem
Multi-agent systems can amplify load when callers retry saturated agents/tools without a shared capacity contract. The result is retry storms, rising queue time, duplicated work, extra model/tool calls, and cascading timeouts.

## Why it matters now
A 2026 AutoGen proposal documents this exact production failure class: callers independently retry saturated downstream agents because capacity limits are not declared centrally. AutoGen also exposes bounded inner tool-call loops via `max_tool_iterations`, showing that explicit runtime bounds are already necessary. LangGraph's current fault-tolerance docs provide retries, timeouts, and error handlers, but capacity/backpressure still has to be composed by application code.

## Affected users
Teams running multi-agent orchestrators, tool-heavy agents, background AI workers, agent-to-agent delegation, or shared downstream APIs.

## Current public evidence
1. AutoGen issue #7321 (2026-02-28) describes cascading failure from retrying saturated downstream agents and proposes provider-owned capacity declarations: https://github.com/microsoft/autogen/issues/7321
2. AutoGen release notes document `max_tool_iterations` for bounded tool loops, reinforcing the need for explicit execution limits: https://github.com/microsoft/autogen/releases
3. LangGraph fault-tolerance documentation provides retries, timeouts, backoff, and recovery handlers, but these are node-level mechanisms rather than a shared downstream-capacity contract: https://github.com/langchain-ai/docs/blob/main/src/oss/langgraph/fault-tolerance.mdx
4. AutoGen discussion #7824 describes runaway multi-agent loops causing excessive API cost and recommends deterministic runtime validation: https://github.com/microsoft/autogen/discussions/7824

## Existing approaches
- Per-caller retry policies.
- Exponential backoff.
- Circuit breakers.
- Concurrency semaphores.
- Tool/agent iteration limits.
- External rate limiters and queue limits.

## Remaining limitations
Per-caller policies drift from actual provider capacity. Generic retry middleware may retry into congestion. External limiters react after work reaches the boundary. Concurrency limits without queue-age or retry-budget checks can still accumulate stale work. Teams often lack one auditable contract tying concurrency, queue depth, retry count, wait time, and token/call budget together.

## Root-cause analysis
- Capacity knowledge lives with providers but retry policy often lives with callers.
- Saturation signals are inconsistently classified.
- Retry budgets are tracked per request, not across a dependency edge.
- Queue age is not treated as a stop condition.
- No-progress retries can continue despite worsening latency.
- Observability lacks a single backpressure decision record.

## Improvement opportunity
Introduce a reusable provider-owned capacity contract and deterministic pre-dispatch guard. Every call checks current in-flight count, queue depth, queue age, retry count, and request budget before dispatch. The guard returns `allow`, `delay`, `shed`, or `stop`, with bounded exponential backoff and explicit retry exhaustion.

## Goal
Prevent cascading retry amplification while preserving throughput under healthy load.

## Metrics
- p50/p95/p99 end-to-end latency
- in-flight requests per dependency
- queue depth and oldest queue age
- retries per logical task
- shed/stop decisions
- model/tool calls per completed task
- token usage per completed task
- timeout/error rate
- throughput

## Trigger
Before agent delegation or tool dispatch, and after retryable failure/429/timeout/saturation signal.

## Inputs
Capacity policy, current in-flight count, queue depth, queue age, retry count, last error class, estimated request cost/tokens, and task deadline.

## Outputs
Decision (`allow|delay|shed|stop`), delay duration, reasons, remaining retry budget, and metrics record.

## Observed evidence
Current frameworks expose retries and bounds, while production users still report missing shared capacity contracts and retry amplification.

## Interpretation
The gap is not “retries are bad.” The gap is that retries without provider-aware capacity and bounded budgets can increase pressure exactly when a dependency is already saturated.

## Proposed solution
A deterministic backpressure policy layer plus benchmark workflow that measures before/after latency, throughput, retries, and call/token amplification.
