# Research — Agent Interrupt Control-Plane Liveness Guard

## Topic
Agent Interrupt Control-Plane Liveness Guard

## Category
Thinking / Performance

## Problem
Long-running agents can receive a user's stop, abort, or corrective message but fail to make that intervention effective promptly. The failure can occur because the interrupt is queued behind the active run, not propagated to the running task/tool, buried in model context, or leaves malformed conversational state after cancellation. The result is lost user control, wasted compute/tokens, unintended continued side effects, and unsafe resumption.

## Why it matters now
Agent runtimes increasingly support long commands, background work, subagents, tool loops, and resumable sessions. Fresh 2026 issue reports across independent agent projects show interrupt delivery and cancellation remain recurring control-plane failure modes.

## Affected users
Coding-agent users, operators of autonomous assistants, platform engineers, multi-agent orchestrator developers, and teams running expensive or side-effecting unattended workflows.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #38390, opened 2026-06-03, reports `busy_input_mode=interrupt` regressed so new user messages no longer interrupted a running task and were handled only after current work completed: https://github.com/NousResearch/hermes-agent/issues/38390
2. Agent Zero issue #1672, opened 2026-05-28, reports user interventions can be effectively drowned by a long repetitive context, with the agent continuing a loop even after new messages arrive: https://github.com/agent0ai/agent-zero/issues/1672
3. OpenClaw issue #60635, opened 2026-04-04, reports `/stop`, `/abort`, and explicit stop commands were received by the gateway but `chat.abort` was not propagated to the running AI task, so execution continued: https://github.com/openclaw/openclaw/issues/60635
4. Hermes Agent issue #48879, opened 2026-06-19, reports interruption after tool execution could produce a Tool→User role alternation violation and downstream hallucination/continuation problems, showing cancellation must preserve conversation-state integrity: https://github.com/NousResearch/hermes-agent/issues/48879
5. Claude Code issue #25963, opened 2026-02-15, describes a runaway state where stop messages, escape interruption, process kills, and session resume failed to restore user control reliably: https://github.com/anthropics/claude-code/issues/25963

### Interpretation
“Message received” is not equivalent to “interrupt effective.” A reliable system needs an observable cancellation lifecycle spanning ingress, scheduler/run state, active tool/subagent processes, side-effect admission, transcript repair, and safe resume. Model prompting alone cannot guarantee this boundary when the defect is in runtime propagation or state handling.

## Existing approaches
- Queue new user input until the active run finishes.
- Provide `/stop`, Escape, abort APIs, or busy-input modes.
- Cancel model streaming or active task futures.
- Kill subprocesses manually.
- Use tool timeouts and global run limits.
- Add behavioral instructions telling the model to stop when requested.

## Remaining limitations
- Gateway acknowledgement can occur without cancellation reaching the worker.
- Canceling the model call may not stop already-running tools or child processes.
- New user messages can be appended as ordinary context instead of high-priority control events.
- Cancellation can leave incomplete tool-call/result pairs or invalid role ordering.
- Resumption may replay stale work unless the prior run is durably marked canceled.
- Hard process kill restores control but can lose partial-progress evidence and leave side effects ambiguous.

## Root-cause analysis
1. User control messages share the same queue/path as ordinary conversational input.
2. Cancellation tokens are not propagated through all descendants and tool adapters.
3. Side-effect admission does not re-check cancellation immediately before execution.
4. Runtime state lacks a durable monotonic cancellation epoch/state.
5. Transcript repair after interruption is framework-specific or absent.
6. Resume logic trusts stale checkpoints without reconciling canceled work.
7. Observability records ingress but not end-to-end cancellation latency.

## Improvement opportunity
Create a control-plane liveness contract with a monotonic interrupt epoch, deterministic state transitions, descendant cancellation propagation, a pre-side-effect cancellation fence, transcript integrity repair, and measurable acknowledgement/effectiveness deadlines. The package should verify the entire path using synthetic long-running fixtures rather than relying on UI acknowledgement.

## Goal
Ensure a user interrupt becomes effective within a bounded time, prevents new side effects after the cancellation fence, reconciles active descendants, and leaves a resumable transcript/state.

## Metrics
- Interrupt ingress-to-acknowledgement latency.
- Interrupt ingress-to-run-canceled latency.
- Active tool/subagent drain latency.
- Count of side effects admitted after cancellation epoch.
- Orphan process/subagent count after grace period.
- Transcript integrity violations after cancel.
- Unsafe resume/replay count.

## Trigger
Any change to agent input routing, scheduler, tool execution, background work, cancellation/abort handling, transcript persistence, checkpointing, or resume logic; also run periodically as a production canary.

## Inputs
Run ID, interrupt event, current execution tree, cancellation epoch, tool/subagent registry, side-effect admission log, transcript/checkpoint state, and policy thresholds.

## Outputs
A machine-readable lifecycle report with `effective`, `degraded`, or `block`, per-stage timestamps, orphan inventory, post-cancel side effects, transcript integrity result, and resume-safety result.

## Relevant sources
- Hermes Agent #38390: https://github.com/NousResearch/hermes-agent/issues/38390
- Agent Zero #1672: https://github.com/agent0ai/agent-zero/issues/1672
- OpenClaw #60635: https://github.com/openclaw/openclaw/issues/60635
- Hermes Agent #48879: https://github.com/NousResearch/hermes-agent/issues/48879
- Claude Code #25963: https://github.com/anthropics/claude-code/issues/25963
