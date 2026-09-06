# Research: Stream Semantic Progress Watchdog

## Topic
Distinguishing transport liveness from useful progress in streaming AI-agent execution.

## Category
Performance

## Problem
Streaming LLM/agent calls may remain connected or emit control traffic while useful output stops. Orchestrators that treat every received event as progress can wait indefinitely; retry-heavy mitigations can amplify cost and duplicate work.

## Why it matters now
Agent workloads are longer, involve more streaming/tool transitions, and increasingly rely on provider SDK retry/timeout defaults that were designed around network operations rather than semantic task progress.

## Affected users
Agent-platform builders, SDK users, production assistants, long-running coding/research agents, and teams with strict latency/cost SLOs.

## Current public evidence
### Observed evidence
1. OpenAI Python issue #2319 reports async streaming requests hanging indefinitely after a connection error, with users adding explicit timeouts/retries as a workaround. https://github.com/openai/openai-python/issues/2319
2. OpenAI Python issue #2599 reports streaming responses that stop after partial output without a terminal error/event, requiring application-side detection/recovery. https://github.com/openai/openai-python/issues/2599
3. LangChain issue #33215 reports long-running streaming behavior that can hang in agent execution and highlights the need for explicit execution bounds rather than assuming stream completion. https://github.com/langchain-ai/langchain/issues/33215
4. OpenAI Python timeout/retry documentation exposes connect/read/write/pool timeout control and automatic retries for selected failures, but these network controls do not define application-level semantic progress. https://github.com/openai/openai-python#timeouts and https://github.com/openai/openai-python#retries

### Interpretation
The unresolved layer is orchestration semantics. Network liveness answers whether bytes/events arrive; task liveness answers whether the agent is getting closer to completion. Conflating the two creates unbounded tail latency or retry amplification.

### Proposed solution
Maintain separate transport and semantic-progress clocks, an overall deadline, and a bounded recovery budget. Only events that advance user-visible output, tool execution state, or completion reset the semantic clock.

## Existing approaches
SDK read/connect timeouts, generic inactivity timers, heartbeats, automatic retry with exponential backoff, and total task deadlines.

## Remaining limitations
Heartbeats can defeat inactivity logic; read timeouts reset on network activity; total deadlines are coarse; automatic retries cannot safely replay every tool-bearing task; generic event counters mistake metadata for progress.

## Root-cause analysis
1. Liveness is measured at the transport layer instead of the task state machine.
2. Stream event taxonomies do not consistently label semantic advancement.
3. Retry policy is often detached from idempotency and remaining deadline.
4. Baselines emphasize average latency and hide stuck p99/max tasks.

## Improvement opportunity
A provider-neutral JSON event classifier can make semantic progress observable and enforce bounded recovery before integrating the concept into runtime instrumentation.

## Relevant sources
- https://github.com/openai/openai-python/issues/2319
- https://github.com/openai/openai-python/issues/2599
- https://github.com/langchain-ai/langchain/issues/33215
- https://github.com/openai/openai-python#timeouts
- https://github.com/openai/openai-python#retries

## Status
Package implementation provides deterministic trace analysis. Deployment performance claims require measured before/after production or representative benchmark evidence.