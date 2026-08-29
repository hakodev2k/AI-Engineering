# Research

## Topic
Successful Tool-Search Loop Budget Guard

## Category
Performance

## Problem
Agent runtimes frequently treat tool-search success as progress. A search can return a valid payload yet add no useful capability, causing repeated discovery calls that consume model turns, context, latency, and money without moving the task toward completion.

## Why it matters now
Tool catalogs are increasingly deferred or dynamically discovered through MCP and coding-agent runtimes. On Aug 27, 2026, a Hermes Agent report documented 1,523 successful `tool_search` calls against a 17-tool catalog, a 130k-token context, and 1,125 seconds of runtime with no answer; disabling tool search completed the same prompt in 30 messages and 205 seconds.

## Affected users
Developers using coding agents; MCP platform builders; teams operating long-running agents; users paying per token or subject to context/rate limits.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #96247, opened Aug 27, 2026: 1,523 successful tool searches; existing failure-based guardrails never fired because calls succeeded. https://github.com/NousResearch/hermes-agent/issues/96247
2. VS Code issue #296123, Feb 18, 2026, verified: deferred MCP activation failure caused repeated `tool_search_tool_regex` calls with no stop condition. https://github.com/microsoft/vscode/issues/296123
3. OpenAI Codex issue #34735, Jul 22, 2026: deterministic tool failures could be retried without a retry/usage guard, demonstrating the broader need for runtime-level budgets rather than relying on model self-correction. https://github.com/openai/codex/issues/34735
4. Claude Code issue #68093, Jun 12, 2026: a parallel sub-agent emitted 229 consecutive empty StructuredOutput calls and stalled without a per-agent retry cap. https://github.com/anthropics/claude-code/issues/68093

### Interpretation
The common weakness is not a single model bug. Runtime guardrails often key on errors, identical failed calls, or global iteration caps. A nominally successful call can still be semantically stagnant. Progress therefore needs an observable definition independent of HTTP/tool success.

## Existing approaches
Failure counters; global max-iteration settings; duplicate-call detection; timeouts; model instructions; result-reference stubs; deferred tool loading.

## Remaining limitations
Failure counters miss successful no-progress calls. Global iteration limits are too coarse. Exact duplicate detection misses query mutations. Natural-language warnings can be ignored. Timeouts cap damage late rather than early. Deferred loading itself can create discovery loops.

## Root-cause analysis
- Success is conflated with progress.
- No task-level budget for discovery calls.
- No semantic/result fingerprint accounting across successful calls.
- No requirement that repeated discovery produce new tools or evidence.
- Model-visible warnings are advisory rather than blocking.
- Context/token growth is not coupled to a stop condition.

## Improvement opportunity
Add a deterministic progress ledger at the runtime boundary. Track successful search count, consecutive calls with zero new tools, repeated normalized query/result fingerprints, elapsed time, and token/context growth. Block when budgets are exceeded and force a bounded strategy change or terminal failure.

## Goal
Prevent successful-but-stagnant discovery from consuming unbounded model turns while preserving legitimate multi-step discovery.

## Metrics
Tool-search calls/task; stagnant-search streak; repeated fingerprint count; new tools/search; total tool calls; prompt tokens/task; latency; completion rate; quality regression rate.

## Trigger
Any workflow using deferred/dynamic tool discovery or showing elevated tool-search counts.

## Inputs
Agent trace JSONL, tool names/arguments/results, timestamps, optional discovered-tool IDs and token metrics.

## Outputs
Guard verdict, blocking reason, loop evidence, per-task metrics, bounded recovery recommendation.

## Proposed solution
This package's deterministic analyzer and runtime rules implement progress-aware budgets and independent verification. This is a proposed engineering control, not a claim that upstream frameworks currently implement it.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/96247
- https://github.com/microsoft/vscode/issues/296123
- https://github.com/openai/codex/issues/34735
- https://github.com/anthropics/claude-code/issues/68093
- https://github.com/nearai/ironclaw/issues/2240
