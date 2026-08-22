# Research Evidence

## Topic
Stdio MCP Runtime Reaper Guard

## Category
Performance

## Problem
Long-running AI desktop and coding-agent sessions can repeatedly spawn local stdio MCP servers, computer-use workers, browser runtimes, overlays, or helper processes without reliably reusing or reaping earlier instances. Resource use then grows by turn or restore cycle until latency, UI responsiveness, memory, CPU, and eventually process stability degrade.

## Why it matters now
Recent August 2026 reports show this as a live lifecycle problem rather than a theoretical process-management concern. One Codex report observed new stdio MCP instances on successive turns in a single task. Another observed dozens of computer-use child processes and a V8 out-of-memory crash while the app was otherwise idle.

## Affected users
Developers using local MCP servers, desktop coding agents, computer-use/browser agents, tool authors that launch subprocess trees, and platform teams operating long-lived agent sessions.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #38754, opened 2026-08-15 and still open when researched, reports repeated spawning of local stdio MCP servers within one task. After six turns the reporter observed six logical instances of one MCP server plus six `node_repl.exe` instances; with a computer-use driver, accumulated overlay processes caused severe cursor stutter. Restarting the application cleared the processes.
2. OpenAI Codex issue #38455, opened 2026-08-13 and still open when researched, reports repeated Computer Use worker spawning on macOS. The report records 78 unexplained child processes consuming about 4.96 GB after 29 seconds and 187 computer-use threads at a V8 OOM crash.
3. OpenAI Codex issue #39552 reports persisted browser-tab state that is not evicted; restoring a poisoned tab can pin a renderer near 100% CPU, while dozens of browser identities accumulate. This is a related lifecycle signal: runtime resources can outlive their useful task scope and be recreated from durable state.

### Interpretation
The common failure mode is missing ownership and reconciliation across runtime resources. Creation is tied to a turn, tool environment, restore event, or feature notifier, while cleanup/reuse is not governed by an equally explicit lifecycle contract. Restart becomes the de-facto garbage collector.

### Proposed solution
Add a host-side lifecycle guard that registers every child runtime against an owner scope, enforces per-owner and global budgets, detects duplicate live instances, reconciles process state at checkpoints, gracefully terminates stale resources, escalates to bounded forced cleanup only when necessary, and verifies that terminal owners have zero surviving owned processes.

## Existing approaches
- Rely on process-parent termination when the desktop app exits.
- Restart the host application to clear accumulated workers.
- Disable the triggering plugin/driver.
- Recreate tool environments per turn for isolation.
- Use operating-system process managers or ad-hoc `kill`/Task Manager cleanup.

## Remaining limitations
- Host exit cleanup does not protect multi-hour sessions.
- Per-turn isolation without ownership-aware cleanup can multiply workers.
- Manual restart loses continuity and does not detect regression early.
- Killing by process name can terminate unrelated user processes.
- A raw process-count limit does not distinguish legitimate parallelism from leaks.
- Child processes may themselves spawn descendants, so tracking only the direct PID is incomplete.

## Root-cause analysis
1. Resource creation is not paired with a durable owner identity and terminal lifecycle state.
2. Reuse keys for equivalent stdio servers/tool environments are missing or not consistently applied.
3. Session/turn disposal does not deterministically reconcile descendants.
4. Persistent UI/runtime state can recreate resources after restart or hydration without TTL/eviction checks.
5. No baseline or budget gate detects monotonic process/RSS growth before user-visible failure.
6. Cleanup paths often depend on graceful shutdown only, with no bounded escalation and verification.

## Improvement opportunity
A reusable runtime ownership registry and deterministic reaper can be integrated around any agent harness. It can measure process count/RSS before and after repeated turns, prevent duplicate equivalent runtimes, detect orphans using PID/start-time identity, terminate only owned descendants, and provide measurable regression gates.

## Goal
Keep runtime resource count and memory bounded across repeated turns and restores while preserving legitimate parallel tool execution.

## Metrics
- owned live process count by owner and runtime key
- duplicate live runtime count
- orphan count after owner termination
- RSS/CPU growth across N repeated turns
- spawn-to-reuse ratio
- graceful shutdown success rate
- forced termination count
- task latency and failure rate before/after

## Trigger
Runtime spawn, task/turn terminal event, reconnect/restore, periodic checkpoint, or resource-budget breach.

## Inputs
Owner id, runtime key, PID, process start time, parent PID, command fingerprint, lifecycle event, configured budgets, optional RSS/CPU observations.

## Outputs
Lifecycle registry snapshot, PASS/BLOCK decision, stale-owned process list, bounded cleanup actions, before/after metrics, verification report.

## Relevant sources
- https://github.com/openai/codex/issues/38754
- https://github.com/openai/codex/issues/38455
- https://github.com/openai/codex/issues/39552

Research date: 2026-08-20, Vietnam time (UTC+7).