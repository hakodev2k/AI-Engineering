# Research — Agent Tool-Call Deadline Watchdog

**Category:** Performance  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Bounded deadlines and observable in-flight duration for agent tool calls.

## Problem
Agent runtimes can wedge an entire turn when a single tool call hangs, while orchestrators may expose only a generic `tool` state without elapsed duration or in-flight count. This prevents reliable stall detection, recovery, and latency control.

## Why it matters now
Recent August 2026 reports show the failure in multiple agent runtimes: Prime Agent lacks elapsed-time/in-flight-count observability for child tool calls, while Hermes Agent had sequential tool calls without a deadline and malformed MCP calls that waited for a multi-minute timeout.

## Affected users
AI-agent users, coding-agent developers, orchestration/platform teams, MCP integrators, and operators of long-running agent jobs.

## Current public evidence

### Observed evidence
1. PrimeIntellect `prime-agent` issue #822, opened 2026-08-07, reports that `agent_observe` exposes a child as `status: tool` but not elapsed duration or in-flight call count; a short call and a forty-minute hang can appear identical. The report also notes the bash timeout is optional with no default.  
   https://github.com/PrimeIntellect-ai/prime-agent/issues/822
2. NousResearch Hermes Agent issue #84719, opened 2026-08-12, reports that a sequential single tool call had no deadline while parallel batches had a 420-second bound; the reporter observed a web extraction session wedged for 21 hours until process restart.  
   https://github.com/NousResearch/hermes-agent/issues/84719
3. Hermes Agent issue #78260, opened 2026-08-04, reports malformed MCP tool parameters causing the execution path to hang for the full default timeout of about seven minutes instead of failing fast.  
   https://github.com/NousResearch/hermes-agent/issues/78260

### Interpretation
The recurring engineering gap is a missing deadline-and-observability contract across tool adapters. Timeouts are inconsistent by execution path, validation may occur too late, and orchestrators cannot distinguish healthy in-flight work from a stalled call using deterministic telemetry.

## Existing approaches
- Per-tool timeout arguments.
- Parallel-batch executor deadlines.
- Process-level restarts and manual cancellation.
- Generic retry wrappers.
- Status polling such as `status: tool`.

## Remaining limitations
- Optional or absent deadlines leave sequential paths unbounded.
- A single coarse timeout can be too slow for validation failures and too short for legitimate long operations.
- Generic status does not include start time, elapsed time, deadline, or attempt count.
- Blind retries can duplicate non-idempotent effects.
- Process restart loses useful diagnostic context and increases recovery time.

## Root-cause analysis
1. Deadline policy is implemented per adapter/path rather than centrally.
2. Schema validation may happen after network/tool dispatch.
3. In-flight telemetry lacks monotonic timestamps and attempt identifiers.
4. Recovery policy is not bound to idempotency or side-effect class.
5. Retry loops often lack a total wall-clock budget.

## Improvement opportunity
Introduce a reusable watchdog contract that validates calls before dispatch, assigns per-class deadlines, records start/deadline/elapsed fields, detects stale calls deterministically, allows at most one safe retry for idempotent operations, and blocks automatic retry for unknown or consequential side effects.

## Relevant sources
- Prime Agent issue #822: https://github.com/PrimeIntellect-ai/prime-agent/issues/822
- Hermes Agent issue #84719: https://github.com/NousResearch/hermes-agent/issues/84719
- Hermes Agent issue #78260: https://github.com/NousResearch/hermes-agent/issues/78260
