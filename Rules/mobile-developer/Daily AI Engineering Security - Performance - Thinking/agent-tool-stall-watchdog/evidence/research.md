# Research — Agent Tool Stall Watchdog

## Topic
Detecting and recovering from silent tool/headless-agent stalls within a bounded wall-clock budget.

## Category
Performance

## Problem
Scheduled and headless agent runs can spend minutes or hours producing no events because a tool call, deferred-tool transition, network operation, hook interaction, or internal retry path stalls. A coarse outer process timeout eventually kills the run, but it provides weak diagnostics and wastes most of the execution budget.

## Why it matters now
Recent Claude Code reports show both a new fixed-duration headless stall and a longer-running class of silent tool hangs. These are especially costly for cron jobs, CI, automation workers, and multi-agent parents waiting on blocked children.

## Affected users
Developers running `claude -p` or similar non-interactive agents; CI/scheduled automation; orchestration systems; agents using WebFetch/WebSearch or deferred tools; teams with strict wall-clock SLOs.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #83859 (2026-08-04) reports 9/9 headless runs stalling for about 398–412 seconds once early in each session across versions 2.1.220 and 2.1.221. The same workload previously had 22 clean runs. A 10-minute process timeout then killed jobs that previously completed in roughly six minutes.
2. Claude Code issue #34565 documents a WebFetch tool call that emitted neither result nor error and caused the process/subagent chain to wait for more than 11 hours until manually killed. The issue is older and closed as not planned, but it demonstrates the same unbounded-silence failure class.
3. Claude Code issue #33073 reports repeated `claude -p` hangs after ToolSearch/deferred-tool loading when a PreToolUse hook is present, including five consecutive affected planner sessions.
4. Claude Code issue #60224 describes an initialization/probe timeout that can silently drop MCP tools when server startup exceeds a timeout, illustrating how timeout behavior around tool lifecycle can turn transient latency into persistent capability failure.

### Interpretation
The host should not assume every long pause is legitimate model thinking or network latency. A production runner needs observable progress events and layered deadlines: per-stage silence budget, per-tool deadline, bounded recovery attempts, and a global run budget. The watchdog must diagnose and stop safely; it cannot repair an upstream client defect by itself.

### Proposed solution
Wrap the agent process with a monotonic event watchdog. Parse line-oriented activity when available; otherwise accept explicit heartbeat events from the integration. Track `last_activity`, stage/tool identity, total runtime, and recovery count. On silence threshold breach, capture diagnostics, terminate gracefully, then hard-kill if necessary. Retry only when the operation is known safe/idempotent and the global budget can still be met.

## Existing approaches
- One global subprocess timeout.
- Manually increasing cron/CI timeout.
- Shell `timeout`/PowerShell job timeout without stage telemetry.
- Human intervention after observing a hung process.
- Model-level retry instructions.

## Remaining limitations
- A global timeout detects failure late and does not identify the stalled stage.
- Increasing timeout can convert a deterministic 6-minute regression into recurring wasted capacity.
- Model instructions cannot recover when no new model/tool event occurs.
- Blind retries can duplicate side effects.
- Killing a parent without capturing the child process tree can leave orphaned work.
- Very long legitimate calls require stage-specific budgets rather than one universal threshold.

## Root causes
1. Missing liveness contract between runner and agent/tool process.
2. Timeout policy lives only at the outermost process boundary.
3. Lack of stage/tool-aware silence telemetry.
4. Retry policy is not coupled to idempotency and remaining wall-clock budget.
5. Diagnostics are captured after termination rather than at the first liveness breach.

## Improvement opportunity
Move from `run until global timeout` to `observe -> detect silence -> capture diagnostics -> bounded recovery -> verify`. This makes failures faster, cheaper, and measurable even when the underlying client bug remains unresolved.

## Metrics
- p50/p95/p99 event-silence duration;
- stalls detected before global timeout;
- wasted wall-clock seconds per failed run;
- successful safe recoveries;
- repeated-stall rate by stage/tool/version;
- orphan-process count;
- mean time to actionable diagnostic;
- false-positive watchdog terminations.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/83859
- https://github.com/anthropics/claude-code/issues/34565
- https://github.com/anthropics/claude-code/issues/33073
- https://github.com/anthropics/claude-code/issues/60224

## Evidence status
**Implemented:** package provides a generic watchdog wrapper, not an upstream Claude Code fix.

**Measured:** adopting runner must record baseline silence/runtime distributions.

**Verified:** unit tests plus a controlled silent-child integration scenario must pass before production use.