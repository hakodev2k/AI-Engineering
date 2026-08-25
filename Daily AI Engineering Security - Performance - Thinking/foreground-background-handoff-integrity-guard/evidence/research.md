# Research — Foreground/Background Handoff Integrity Guard

## Topic
Lossy handoff when long-running foreground tool commands are yielded or auto-backgrounded.

## Category
Performance

## Problem
Agent runtimes often move a long-running command from synchronous foreground ownership to a background session. If the transition, owner, terminal result, and completion notification are not correlated reliably, agents can sleep indefinitely, poll repeatedly, duplicate the command, or miss the terminal output.

## Why it matters now
Recent 2026 reports across Claude Code and Codex show this failure at multiple handoff boundaries, including auto-background after a fixed cap, yielded exec sessions, explicit background terminals, and polling-based recovery.

## Affected users
Developers running long builds/tests, autonomous coding agents, nested subagents, CI-like agent workflows, and platform teams implementing tool runners.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #89044, opened 2026-08-23, reports foreground Bash commands inside subagents auto-backgrounding at the 600-second cap, after which completion notifications can be missing or duplicated; the report describes repeated 30–40 minute stalls. https://github.com/anthropics/claude-code/issues/89044
2. OpenAI Codex issue #33816, opened 2026-07-17, reports yielded `exec_command` sessions being abandoned after the initial synchronous window and duplicate commands being attempted while the original remains live. https://github.com/openai/codex/issues/33816
3. OpenAI Codex issue #14314, opened 2026-03-11, reports an agent stuck repeatedly waiting for a background terminal after the command had already finished and emitted an error. https://github.com/openai/codex/issues/14314
4. Codex issue #32188, opened 2026-07-10, requests event-driven wakeup because current long-running commands require polling, long tool calls, or monitoring subagents, each adding latency or model/context cost. https://github.com/openai/codex/issues/32188
5. Codex issue #13733 documents repeated background-process polling causing full model turns and developers observing agents abandon long tasks after many empty polls. https://github.com/openai/codex/issues/13733

### Interpretation
The recurring engineering problem is not simply “background processes are hard.” It is a lifecycle integrity gap: foreground ownership, background identity, terminal state, notification, and model wakeup are separate events without a universally enforced correlation/latency contract.

## Existing approaches
- Fixed foreground wait windows followed by auto-backgrounding.
- Explicit `run_in_background`/yield controls and returned session IDs.
- Repeated status or `write_stdin` polling.
- Background completion events/notifications where supported.
- Monitoring subagents for long jobs.

## Remaining limitations
Fixed timeouts cannot distinguish a healthy long build from a stall. Polling adds model turns and can still be abandoned. Notifications can be delayed, lost, or duplicated. A session ID alone does not prove that the owner observed the transition or terminal result. Monitoring subagents shift rather than remove orchestration cost.

## Root-cause analysis
1. Process state and agent-visible lifecycle state are maintained in separate components.
2. Foreground→background transition acknowledgement is not always durable before the model yields.
3. Completion notification and terminal state may not share a single idempotent correlation contract.
4. Polling is used as a recovery mechanism without strict budgets.
5. Traces often record tool duration but not handoff and notification lag separately.

## Improvement opportunity
Instrument lifecycle traces around a stable command ID and enforce deadlines for background acknowledgement and terminal notification. Use bounded recovery polling only after a missed event, never as the default wait loop.

## Proposed solution
This package provides a deterministic JSONL trace auditor, enforceable lifecycle rules, a measurement/diagnosis skill, independent verifier, bounded recovery workflow, and a post-timeout validation hook.

## Metrics
- handoff acknowledgement latency and p95
- terminal→notification latency and p95
- missing/late acknowledgements
- missing/late notifications
- duplicate terminal events
- model polls while running and after terminal
- healthy transitions / total transitions

## Trigger
Any tool runner that yields or auto-backgrounds a foreground command, or any investigation of long-task stalls/duplicate commands.

## Inputs
JSONL lifecycle trace with stable `command_id`, monotonic/normalized timestamps, and lifecycle events.

## Outputs
Machine-readable health summary, violations, latency metrics, and blocking exit status.

## Verification
Implemented means tracing and guard integration exist. Measured means baseline and post-change traces are collected from comparable workloads. Verified means tests pass and the post-change trace meets configured deadlines without increased duplicate execution, polling, or security relaxation.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/89044
- https://github.com/openai/codex/issues/33816
- https://github.com/openai/codex/issues/14314
- https://github.com/openai/codex/issues/32188
- https://github.com/openai/codex/issues/13733
