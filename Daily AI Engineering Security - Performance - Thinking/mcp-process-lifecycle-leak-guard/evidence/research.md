# Research Evidence

## Topic
MCP Process Lifecycle Leak Guard

## Category
Performance

## Problem
Agent hosts that launch local stdio MCP servers can accumulate duplicate or orphaned server process trees across resume, fork, reconnect, configuration reload, and session shutdown. The leak increases memory/CPU usage, can duplicate paid or exclusive upstream connections, and can degrade shell/build/test latency over time.

## Why it matters now
Multiple 2026 reports across Codex and Claude Code describe the same operational class with different triggers. Recent August reports show historical-thread resume and long-lived resumed sessions spawning or retaining MCP process stacks even when no new tool call is made. The problem therefore persists beyond simple abnormal-exit cleanup.

## Affected users
Developers running coding agents with local MCP servers, teams operating long-lived desktop/app-server sessions, users with many configured MCP integrations, and MCP server authors whose servers hold singleton resources or expensive connections.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #37453, opened 2026-08-07, reports that opening/resuming historical parent or completed child threads on Windows can spawn duplicate local MCP and `node_repl.exe` process stacks; processes remain alive under the app-server instead of returning to a bounded baseline.
2. Anthropic Claude Code issue #83771, opened 2026-08-04, reports forked/resumed sessions and per-session MCP servers persisting for days, including a stale resumed process with hundreds of CPU-hours and no remaining resumable transcript.
3. Anthropic issue #75574, opened 2026-07-08, reports duplicate generations of local MCP processes after transport close/restart; old OS processes remain alive while a new generation starts.
4. OpenAI Codex issue #16895, opened 2026-04-06, reports stdio MCP subprocesses accumulating across long-lived, resumed, VS Code app-server, and subagent flows.
5. Anthropic issue #85895, opened 2026-08-11, reports two launches of the same project MCP server from one fresh Claude Code process, including one instance outside normal client-manager accounting.

### Interpretation
This is a lifecycle-accounting problem rather than merely a single product bug. Agent hosts need an observable ownership contract between logical session/server identity and OS process generation. A process that has no live owner, duplicates an exclusive logical server identity without an explicit sharing policy, or survives beyond a shutdown grace period must be detectable independently of UI state.

### Proposed solution
Provide a reusable lifecycle audit that consumes a normalized process snapshot, computes logical MCP identities, detects duplicate generations and orphaned children, records a baseline, and blocks completion when configured invariants are violated. The package does not kill processes automatically; remediation remains explicit and human-controlled.

## Existing approaches
- Rely on parent-process teardown or ordinary signal handlers.
- Manually inspect `ps`, Task Manager, or Process Explorer.
- Restart the agent host or machine.
- Use process groups/job objects and cleanup handlers in individual implementations.
- Externalize singleton MCP state to a shared service.

## Remaining limitations
- Parent exit handlers do not cover hosts that remain alive while a session/server generation is replaced.
- UI MCP lists can omit processes launched outside the normal client manager.
- PID-only checks cannot determine whether two processes represent legitimate concurrency or duplicate logical ownership.
- Restarting clears symptoms but produces no regression evidence and can hide the trigger.
- Aggressive automated killing can terminate unrelated user processes when ownership is inferred incorrectly.

## Root-cause analysis
1. Logical ownership is not durably attached to each spawned process generation.
2. Resume/fork/reload paths create a new generation before proving the old generation is terminal.
3. Transport closure is sometimes treated as equivalent to OS process termination.
4. Multiple configuration discovery paths can resolve to the same logical server without deduplication.
5. Long-lived app servers outlive individual sessions, so parent PID alone is an insufficient lifetime boundary.
6. Operators lack baseline metrics for process count, age, generation count, and ownership drift.

## Improvement opportunity
Define a normalized ownership key (`host_instance`, `server_identity`, `scope_key`) and measurable invariants: bounded active generations per key, no stale process whose owner session is terminal, no process older than the configured orphan grace period without a live owner, and stable process count after resume/close cycles. Add a deterministic audit script and tests so teams can regression-test lifecycle changes without depending on one vendor UI.

## Goal
Keep MCP process count and resource ownership bounded across repeated session start, resume, fork, reconnect, and shutdown cycles.

## Metrics
- Active MCP process count.
- Duplicate logical identities.
- Maximum generations per logical identity.
- Orphan count after grace period.
- Oldest orphan age.
- Process-count delta after N resume/close cycles.
- Optional RSS/CPU totals supplied by the snapshot producer.

## Trigger
Run before and after agent-host upgrades, MCP lifecycle changes, resume/fork implementation changes, plugin/config reload changes, or when host performance degrades over long sessions.

## Inputs
Normalized process snapshot JSON, live session/owner identifiers, lifecycle policy, and optional baseline snapshot.

## Outputs
Machine-readable audit report, blocking/non-blocking findings, and before/after metrics suitable for regression evidence.

## Relevant sources
- OpenAI Codex #37453, 2026-08-07: https://github.com/openai/codex/issues/37453
- Anthropic Claude Code #83771, 2026-08-04: https://github.com/anthropics/claude-code/issues/83771
- Anthropic Claude Code #75574, 2026-07-08: https://github.com/anthropics/claude-code/issues/75574
- OpenAI Codex #16895, 2026-04-06: https://github.com/openai/codex/issues/16895
- Anthropic Claude Code #85895, 2026-08-11: https://github.com/anthropics/claude-code/issues/85895
- Anthropic Claude Code #27707, 2026-02-22: https://github.com/anthropics/claude-code/issues/27707
