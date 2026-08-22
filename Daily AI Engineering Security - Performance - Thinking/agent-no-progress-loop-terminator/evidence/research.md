# Research — Agent No-Progress Loop Terminator

## Topic
Agent No-Progress Loop Terminator

## Category
Thinking / Performance

## Problem
Agent runtimes can keep invoking the same tool with the same arguments, repeating the same validation error, or cycling over equivalent state until a coarse `max_turns`/iteration limit is reached. This wastes model calls, tokens, latency, and tool capacity while producing no new evidence.

## Why it matters now
Current agent frameworks expose hard turn/call ceilings, but current public issue reports show demand for progress-aware termination rather than count-only caps.

## Affected users
Developers operating tool-using agents, support agents, coding agents, workflow orchestrators, and platform teams paying for multi-step runs.

## Current public evidence
### Observed evidence
1. LangChain issue #36139 (2026-03) proposes progress-aware termination after repeated invalid tool calls, validation failures, and repeated actions, explicitly noting that recursion/tool-call limits cap steps but do not detect stuck states early: https://github.com/langchain-ai/langchain/issues/36139
2. OpenAI Agents SDK documents an agent loop that continues through tool calls until final output or `max_turns`; exceeding the limit raises `MaxTurnsExceeded`. This is a count-based safety boundary, not a progress detector: https://openai.github.io/openai-agents-python/running_agents/
3. OpenAI Agents SDK issue #2426 reported missing persisted tool calls causing repeated tool calls on later turns, demonstrating a real repeat-call failure mode even when the root cause is session persistence: https://github.com/openai/openai-agents-python/issues/2426

### Interpretation
Count limits remain necessary as a final safety bound, but they are late detectors. A reusable progress guard can stop equivalent failing trajectories earlier without replacing framework-native limits.

## Existing approaches
- `max_turns`, recursion limits, tool-call limits.
- Manual counters in orchestration code.
- Fixing individual tool/schema/session bugs.
- Human cancellation after observing a stuck run.

## Remaining limitations
- Count limits cannot distinguish productive 8-step work from 8 repeated failures.
- Exact string equality misses semantically identical calls with reordered JSON or unstable IDs.
- Aggressive loop detection can terminate legitimate retry/backoff flows.
- Framework-specific fixes do not provide a reusable cross-agent policy.

## Root-cause analysis
1. Agent state lacks an explicit progress invariant.
2. Tool events are often compared as raw payloads instead of canonical signatures.
3. Error classes and outputs are not normalized before comparison.
4. Stop policy is typically step-count based rather than evidence-change based.
5. Recovery paths do not require a changed hypothesis/tool/arguments before retry.

## Improvement opportunity
Add a deterministic progress ledger that canonicalizes tool calls/results/errors, tracks novel state, and blocks repeated no-progress patterns after a configurable threshold. Preserve a hard global turn cap and allow explicit retry exemptions for transient errors.

## Relevant sources
- LangChain #36139: https://github.com/langchain-ai/langchain/issues/36139
- OpenAI Agents SDK running agents: https://openai.github.io/openai-agents-python/running_agents/
- OpenAI Agents SDK #2426: https://github.com/openai/openai-agents-python/issues/2426

## Goal and metrics
- Detect repeated equivalent action/error cycles before the outer turn limit.
- Reduce wasted tool/model calls on stuck fixtures by >=50%.
- False-positive termination rate on productive fixtures: 0%.
- Every termination emits a machine-readable reason and evidence window.

## Trigger / Inputs / Outputs
- Trigger: each completed tool step or tool failure.
- Inputs: tool name, args, result/error, state fingerprint, retry classification.
- Outputs: `continue`, `recover`, or `terminate`, plus reason, signature, repeat count, and evidence window.
