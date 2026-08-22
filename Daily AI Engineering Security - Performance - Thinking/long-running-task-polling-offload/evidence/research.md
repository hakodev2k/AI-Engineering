# Research — Long-Running Task Polling Offload

## Topic
Long-Running Task Polling Offload

## Category
Performance / Token

## Problem
Coding and multi-agent systems often re-enter the model merely to poll a long-running process or child agent. Each quiet poll can replay a large context, consume tokens/credits, add latency, and create thousands of low-value turns.

## Why it matters now
Recent 2026 reports show this is not theoretical: long-running waits in coding agents can spend a material fraction of usage on status checks alone, and some incidents reach tens of millions of tokens.

## Affected users
Coding-agent users, agent-platform teams, CI/build automation, MCP clients with long-running jobs, and multi-agent orchestrators.

## Current public evidence
### Observed evidence
- OpenAI Codex issue #35259 (2026-07-24): wait/status-only turns accounted for 19.8% of raw local token volume in a measured usage window. https://github.com/openai/codex/issues/35259
- OpenAI Codex issue #38495 (2026-08): reports a long-running command degrading into full-context polling and 34.6M tokens spent after the task result had already been produced. https://github.com/openai/codex/issues/38495
- OpenClaw issue #16807 documents aggressive process polling, high cached-context reads, and memory growth during background waits. https://github.com/openclaw/openclaw/issues/16807
- `mcp-sentinel` demonstrates a practical pattern: move polling outside the LLM inference path and wake the model only on meaningful state change. https://github.com/GCS-ZHN/mcp-sentinel

### Interpretation
The core inefficiency is architectural: waiting is deterministic orchestration work but is frequently implemented as repeated model turns. Backoff helps, but the stronger default is event/push completion or runtime-side polling with bounded fallback.

## Existing approaches
- Fixed 30–60 second `wait` calls.
- Manual `sleep` + status commands.
- Background process APIs with model-driven polling.
- Exponential backoff.
- Runtime-side polling plugins.

## Remaining limitations
Fixed polling still burns inference turns; backoff reduces frequency but not the architectural coupling. Runtime offload needs timeouts, liveness checks, cancellation, bounded polling, safe result-size limits, and a fallback for runtimes without push completion.

## Root-cause analysis
1. Agent orchestration treats 'still running' as information requiring model reasoning.
2. Wait tools return too quickly or without push completion.
3. Large context is replayed for a trivial status decision.
4. No token/turn budget is reserved specifically for waiting.
5. Completion and cancellation are not modeled as runtime events.

## Improvement opportunity
Introduce a deterministic wait broker that parks the LLM, performs bounded runtime-side polling with exponential backoff and jitter, emits only state transitions, and wakes the model on completion/error/timeout/cancellation.

## Metrics
- model turns spent waiting/task
- tokens spent waiting/task
- polls/task
- p50/p95 completion-detection lag
- false timeout rate
- cancellation latency
- result correctness/regression rate

## Goal
Reduce model wait turns and wait-related tokens by >=80% on long-running fixtures while preserving completion correctness and cancellation semantics.

## Trigger / Inputs / Outputs
Trigger: a tool or child agent returns `running/pending` with a durable handle. Inputs: handle, status command/provider, timeout, initial interval, max interval, cancellation signal. Output: terminal event with status, elapsed time, bounded result, and poll telemetry.
