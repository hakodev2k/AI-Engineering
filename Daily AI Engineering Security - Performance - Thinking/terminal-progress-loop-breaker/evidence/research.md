# Research — Terminal Progress Loop Breaker

**Topic:** Terminal Progress Loop Breaker  
**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Agent runtimes can detect repeated tool behavior yet fail to terminate or transfer control. The model remains alive, retries equivalent actions, consumes tokens/time, and may never create a durable result. A warning-only detector therefore does not reliably convert “stuck” into a bounded terminal state.

## Why it matters now
Long-running coding agents increasingly execute unattended tool loops. August 2026 evidence includes real runs that consumed very large token budgets without producing a patch and reports where critical loop detection blocked a tool but did not end the agent run, allowing retries to continue.

## Affected users
Coding-agent users, autonomous-agent platform teams, CI automation owners, multi-agent orchestrators, and developers paying for long-running model/tool execution.

## Current public evidence

### Observed evidence
1. **OpenClaw issue #106231 / duplicate #119719 — active through August 2026.** The report states that critical tool-loop detection can block tool execution without aborting the run, after which the model keeps retrying. Operator workarounds include wall-clock timeouts and tighter loop thresholds, while the desired fix is a terminal owner wired through the runtime.  
   https://github.com/openclaw/openclaw/issues/106231
2. **plori — August 12, 2026.** A SWE-bench-style run used about 1.06M tokens, remained apparently healthy, and never wrote the patch. Their analysis argues that liveness is not progress and recommends putting the stop decision outside the model, using hard budgets plus detection of equivalent repeated failures.  
   https://plori.ai/blog/stop-ai-agent-stuck-in-loop
3. **CustomLabs — updated August 21, 2026.** Their production failure-mode write-up describes agents with no step/token budget or progress recognition repeatedly trying variants of the same failed action until an external timeout/cost limit stops them.  
   https://customlabs.io/failure-modes/unbounded-agent-loop/
4. **GitHub Copilot SDK agent-loop documentation — current August 2026.** GitHub documents that each agent turn is an observable LLM call and distinguishes `session.idle` (mechanical loop end) from best-effort semantic `session.task_complete`. This provides the event surface needed for an external progress governor rather than hidden reasoning inspection.  
   https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/agent-loop
5. **strongdm Attractor coding-agent loop specification — current 2026.** The specification includes explicit `max_tool_rounds_per_input`, `max_turns`, and abort signals as host-owned stop conditions, showing that bounded loops can be enforced outside the model.  
   https://github.com/strongdm/attractor/blob/main/coding-agent-loop-spec.md

### Interpretation
The recurring gap is a split between **detection** and **terminal ownership**. A runtime can recognize repetition but still return control to the model, which sees another opportunity to retry. Hard time/turn budgets cap worst-case spend but can be too late; pattern detection without a terminal state can be ignored; “agent is emitting events” proves liveness, not progress.

### Proposed solution
Introduce an external, deterministic progress governor. It fingerprints observable action/result pairs, tracks evidence of durable progress, applies bounded equivalent-failure thresholds, and owns a terminal transition (`continue`, `checkpoint_and_stop`, or `terminal_stuck`). The model receives a structured stop/failure result but cannot override the terminal state.

## Existing approaches
- Wall-clock, token, and turn limits.
- Tool-loop warning/critical thresholds.
- Model-instruction nudges to keep working or call completion.
- Manual operator interruption.
- Best-effort semantic completion signals such as `task_complete`.

## Remaining limitations
- A hard budget limits cost but may allow long periods of useless work.
- A warning/blocked tool can cause the model to try near-equivalent variants indefinitely.
- Textual self-evaluation of progress is not independently observable.
- Liveness/heartbeat signals can remain healthy during zero-progress loops.
- Different argument formatting can defeat naïve exact-match loop detectors.

## Root-cause analysis
1. **Terminal ownership missing:** detector emits a warning but does not own state transition.
2. **Progress conflated with activity:** tool calls/turns are counted without checking durable state change or new evidence.
3. **Retry equivalence too literal:** semantically identical attempts with minor argument changes look different.
4. **No checkpoint contract:** stopping late may lose partial useful work.
5. **Model-controlled stopping:** the same component generating retries is asked to decide whether retries are pointless.

## Improvement opportunity
Use observable mechanisms only: canonical action fingerprints, result/error class, artifact/diff/test-state changes, bounded budgets, and an external stop state. This improves reliability without requesting hidden chain-of-thought.

## Goal
Terminate zero-progress retry loops early enough to preserve useful partial work while allowing legitimate transient retries.

## Metrics
- Zero-progress turns before stop.
- Tokens/time spent after first repeated-equivalent failure.
- Equivalent-failure detection precision.
- Durable-artifact completion rate.
- False-stop rate on transient failures.
- Median/p95 cost per completed task.

## Trigger
After every tool/result pair and before scheduling another model turn.

## Inputs
Tool name, normalized arguments, result status/error class, current turn, token/time budget, changed-artifact identifiers, test/evidence state, prior fingerprints.

## Outputs
`continue`, `checkpoint_and_stop`, or `terminal_stuck` plus observable reason codes and progress metrics.

## Relevant sources
- https://github.com/openclaw/openclaw/issues/106231
- https://plori.ai/blog/stop-ai-agent-stuck-in-loop
- https://customlabs.io/failure-modes/unbounded-agent-loop/
- https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/agent-loop
- https://github.com/strongdm/attractor/blob/main/coding-agent-loop-spec.md
