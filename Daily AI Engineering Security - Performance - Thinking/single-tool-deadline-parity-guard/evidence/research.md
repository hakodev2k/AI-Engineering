# Research Evidence

## Topic
Single Tool Deadline Parity Guard

## Category
Performance

## Problem
Tool execution paths can have inconsistent liveness controls, allowing a single stalled call to block an agent turn far longer than parallel/batched calls.

## Why it matters now
Recent 2026 agent-runtime issues continue to report indefinite or multi-minute tool hangs across MCP and workflow systems, showing that timeout configuration remains fragmented by transport and execution path.

## Affected users
Agent CLI/TUI users, MCP users, workflow operators, platform builders, realtime/chat integrations, and teams running unattended agents.

## Current public evidence
### Observed evidence
1. NousResearch/hermes-agent #84719, opened 2026-08-12, reported `execute_tool_calls_sequential` had no deadline while the concurrent path had a 420s bound. A single lost tool result reportedly wedged a session for 21 hours; the issue was fixed via #86311.
2. QwenLM/qwen-code #6047, opened 2026-06-30, requested a separate configurable idle timeout for remote MCP tool calls so a non-responsive server aborts clearly instead of hanging indefinitely; this distinguishes idle liveness from total call timeout.
3. anthropics/claude-code #53641, opened 2026-04-26, reported per-server timeout configuration was not enforced on individual stdio MCP tool calls, causing 10+ minute hangs.
4. anthropics/claude-code #68842, opened 2026-06-16, reported workflow `agent()` calls lacked per-agent wall-clock/heartbeat timeout, causing individual stalls of 15–50 minutes and a multi-hour workflow.

### Interpretation
Timeout knobs are often scoped to startup, batch execution, or the whole turn. Those controls are not equivalent. Reliability requires deadline semantics at the exact awaited operation plus cancellation/cleanup and a normalized result that downstream recovery can reason about.

### Proposed solution
Use an executable parity gate over all declared tool execution paths. Require finite hard deadlines, optional idle/progress deadlines where long operations need them, cancellation/cleanup, normalized timeout dispositions, and bounded retry rules.

## Existing approaches
Total-turn watchdogs; per-server MCP timeout; startup timeout; async wait timeouts; subprocess kill; parallel-batch timeout; configurable tool timeout; heartbeat/idle timeout; outer job timeout.

## Remaining limitations
Coverage gaps between single vs parallel paths; startup vs call semantics; dead connections that never produce progress; timeout without cancellation; retries that duplicate side effects; outer watchdogs that recover too late.

## Root-cause analysis
1. Separate executors evolve independently.
2. Timeout configuration is attached to transport/server rather than operation.
3. Long-running tools encourage disabling limits instead of adding progress-aware liveness.
4. Error schemas differ by path, weakening recovery logic.
5. Tests cover successful tools but not never-returning fixtures and cleanup.

## Improvement opportunity
Treat liveness as a cross-path invariant and regression-test stalled calls deterministically.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/84719
- https://github.com/QwenLM/qwen-code/issues/6047
- https://github.com/anthropics/claude-code/issues/53641
- https://github.com/anthropics/claude-code/issues/68842
