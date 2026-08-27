# Research — Subagent Barrier Watchdog Contract

**Topic:** Subagent Barrier Watchdog Contract  
**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Multi-agent workflows can stall at parent/child barriers when one child stops making observable progress, when a timeout is not enforced end-to-end, or when cleanup waits indefinitely for an unresponsive child. The parent then fails to reach downstream verification even when other children completed successfully.

## Why it matters now
Recent public reports show multi-minute to multi-hour stalls in agent workflows. These are reliability failures in planning and recovery, not merely slow models: orchestration lacks explicit heartbeat semantics, bounded waits, degraded-completion criteria, and terminal child states.

## Affected users
Developers using coding subagents, multi-agent workflow authors, CI operators, platform builders, and teams running unattended long-horizon agents.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #68093, opened 2026-06-12, reports one parallel subagent emitting 229 consecutive empty StructuredOutput calls; two siblings completed, but the barrier never released and downstream Verify never ran: https://github.com/anthropics/claude-code/issues/68093
2. Anthropic Claude Code issue #68842, opened 2026-06-16, reports no per-agent wall-clock/heartbeat timeout, with individual stalled agent calls lasting 15–50 minutes and a workflow running about 3h16m: https://github.com/anthropics/claude-code/issues/68842
3. OpenAI Codex issue #24951, opened 2026-05-28, reports `wait_agent(timeout_ms=300000)` returning only after roughly 7.5 hours during a runtime stall, indicating the timeout was not an end-to-end deadline: https://github.com/openai/codex/issues/24951
4. OpenAI Codex issue #29937, opened 2026-06-25, reports `close_agent` can block a finished parent while waiting for an unresponsive child to terminate: https://github.com/openai/codex/issues/29937

### Interpretation
The recurring defect is a missing orchestration contract for observable progress. Parent workflows need runtime-enforced deadlines, heartbeats tied to meaningful progress, terminal child states, quorum/degraded-success rules, and cleanup that is not on an unbounded critical path.

## Existing approaches
- Per-call timeouts.
- Manual `TaskStop` / interruption.
- Global workflow timeouts.
- Polling child status.
- `Promise.all`-style barriers or equivalent wait-for-all patterns.

## Remaining limitations
- A configured timeout may not cover the whole control path.
- Polling can be token- and latency-expensive and can still miss wedged runtime state.
- Wait-for-all barriers make one child a single point of failure.
- Model-visible instructions to stop do not enforce termination.
- Cleanup can itself hang.
- Fixed idle timers can falsely kill healthy children during long tool calls unless progress events reset the watchdog.

## Root-cause analysis
1. No explicit definition of progress versus mere activity.
2. Deadlines are implemented inside a layer that can itself stall.
3. Barrier completion policy is hard-coded to all children rather than a declared quorum.
4. Parent state does not always distinguish `running`, `stalled`, `failed`, `cancelled`, and `completed`.
5. Cleanup is synchronous and unbounded.
6. Verification is downstream of a barrier that may never resolve.

## Improvement opportunity
Define a reusable watchdog contract: every child reports monotonic progress events; the parent applies wall-clock and idle-progress deadlines; barriers declare `all`, `quorum`, or `best-effort` policy; a timed-out child becomes a terminal structured result; cleanup is bounded; downstream verification always receives the completed/failed/stalled ledger and decides whether evidence is sufficient.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/68093
- https://github.com/anthropics/claude-code/issues/68842
- https://github.com/openai/codex/issues/24951
- https://github.com/openai/codex/issues/29937
