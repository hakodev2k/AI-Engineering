# Research — Agent Background Process Cancellation Guard

## Problem
AI coding agents increasingly launch background subprocesses, nested agents, MCP servers, test runners, build tools, and API-driving scripts. Cancellation of the parent turn/session is not always propagated to those descendants. The result can be orphaned work that keeps consuming CPU, memory, tokens, API quota, or money after the user believes the task has stopped.

## Category
**Performance** — with reliability and safety implications.

## Why it matters now
Long-running/background-agent features are becoming common, and recent 2026 reports show that lifecycle tracking and cancellation remain imperfect across major agent runtimes.

## Current public signals

### Signal 1 — Claude Code background agents continued for 21+ hours after stop
Anthropic Claude Code issue #66339, opened 2026-06-08, reports background subagents continuing after explicit stop attempts, consuming roughly 160k tokens over 21+ hours until the parent session was deleted.

Source: https://github.com/anthropics/claude-code/issues/66339

### Signal 2 — Claude Code reported completion while background API processes were still running
Issue #68642, opened 2026-06-15, reports a task-complete signal while multiple background processes continued for hours and generated substantial API charges.

Source: https://github.com/anthropics/claude-code/issues/68642

### Signal 3 — orphan background Bash processes after interruption/session close
Claude Code issue #27959, opened 2026-02-23, describes `run_in_background` processes becoming orphaned when a parent task is interrupted or the session closes, leaving Node/zsh processes alive and consuming resources.

Source: https://github.com/anthropics/claude-code/issues/27959

### Signal 4 — Codex stop/cancel can become ineffective under subagent/MCP memory pressure
OpenAI Codex issue #29057, opened 2026-06-19, reports that Stop became unresponsive after subagent MCP processes exhausted memory, requiring external process termination to recover.

Source: https://github.com/openai/codex/issues/29057

### Signal 5 — user-visible background task state can be stale or unmanageable
Claude Code issues #68992 and #65925 report background tasks stuck in a running state or persisting across process restarts, showing that UI/runtime bookkeeping can diverge from actual process lifecycle.

Sources:
- https://github.com/anthropics/claude-code/issues/68992
- https://github.com/anthropics/claude-code/issues/65925

## Existing approaches
Common approaches include:

1. parent task cancellation APIs;
2. terminal Ctrl+C / SIGINT;
3. task panels with Stop/Clear controls;
4. runtime-internal child tracking;
5. OS process cleanup after application exit;
6. ad-hoc `pkill`/Task Manager/manual termination;
7. container or CI job timeouts.

## Observed limitations
The reports above show recurring gaps:

- cancellation may stop logical orchestration without killing descendants;
- descendants may escape into independent process groups;
- task status can become stale or disagree with OS reality;
- shutdown may not run cleanup hooks;
- a memory-exhausted coordinator may be too unhealthy to perform graceful cancellation;
- completion can be declared before background descendants terminate;
- manual `pkill` patterns are unsafe because they can kill unrelated processes;
- provider-specific task IDs are insufficient to prove OS-process ownership.

## Root-cause hypotheses
These are engineering hypotheses, not claims about any specific proprietary implementation:

1. **Missing ownership graph** — parent logical task, process group, child PID, and remote task ID are not represented in one durable registry.
2. **Cancellation is advisory** — stop signals are issued but completion is not verified.
3. **No process-group isolation** — descendants can outlive the immediate shell process.
4. **No lease/reaper** — abandoned work has no independent expiry mechanism.
5. **UI state is treated as authority** — orchestration trusts a task label rather than OS/runtime evidence.
6. **Cleanup depends on the unhealthy parent** — memory pressure or crash prevents graceful teardown.
7. **No completion barrier for resource release** — final success does not require zero owned live descendants.

## Improvement target
Build a provider-neutral host-side lifecycle boundary:

```text
register logical task
  -> launch in owned process group/session
  -> persist PID/group/start identity + lease
  -> heartbeat while authorized
  -> cancel parent
  -> TERM owned group
  -> bounded wait
  -> optional KILL only for verified-owned descendants
  -> verify zero live owned processes
  -> close registry record
```

The guard must never kill a process based only on a reused PID or fuzzy name match.

## Success metrics

- `owned_live_processes_after_cancel = 0` within configured deadline;
- `orphan_rate = 0` in fault-injection tests;
- `false_kill_rate = 0` for non-owned fixture processes;
- cancellation p95 below configured deadline;
- no task may report completion while required owned descendants remain live;
- stale leases are detected and reconciled;
- cleanup attempts and outcomes are auditable;
- CPU/RAM/API activity from cancelled owned work stops within the bounded cancellation window.

## Existing-solution analysis
OS process groups, containers, job objects, supervisors, and runtime cancellation primitives are useful building blocks, but they must be connected to durable ownership identity and post-cancel verification. The package therefore does not replace provider-native cancellation; it wraps it with an external deterministic lifecycle contract.

## Proposed engineering solution
Use a durable registry keyed by a stable logical task ID and launch nonce. Track process identity using PID plus process start time (or equivalent identity evidence) to reduce PID-reuse risk. Prefer process groups/session IDs on POSIX and Job Objects or a host adapter on Windows. Use leases so a separate reaper can detect abandoned tasks. Cancellation is a state machine, not a single signal.

## Safety boundaries
- Default scripts are inspection/dry-run oriented unless explicit `--terminate` is supplied.
- Never kill by process name, substring, port alone, or unverified PID.
- Never terminate records whose current process identity does not match the registered identity.
- Escalation from graceful to forceful termination is bounded and policy-controlled.
- Production adoption should run in shadow/observe mode before enforce mode.

## Evidence vs interpretation vs proposal
- **Observed evidence:** the linked issue reports and documented symptoms.
- **Interpretation:** lifecycle ownership and cancellation verification are recurring weak points across agent orchestration.
- **Proposed solution:** this package's registry, lease, process-group, reaper, metrics, and verification contract. It is not claimed to be an official fix for the referenced products.
