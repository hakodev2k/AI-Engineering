# Research — Event-Driven Long Command Wakeup

## Topic
Event-Driven Long Command Wakeup

## Category
Performance

## Problem
Long-running commands in agent runtimes can fall back to model-driven polling. When a command exceeds an initial yield deadline, the runtime returns a process/cell handle and the model repeatedly spends full inference turns asking whether the process has finished. Each poll may resend a very large cached context even though no reasoning is needed, creating extreme token, latency, quota, and concurrency waste.

## Why it matters now
A fresh Codex issue opened 2026-08-14 documents 34.6M tokens consumed after task completion due to repeated `wait`/`write_stdin` polling of long-running cleanup work. An earlier enhancement issue opened 2026-07-10 requests event-driven wakeup specifically because long-running background exec currently requires polling or a monitoring subagent. A June request for `wake_on_output` describes the same architectural limitation from another workflow. Separate July/August reports show full-context polling also affects agent waits, indicating the cost pattern is systemic when idle status checks re-enter the model.

## Affected users
Developers using AI coding agents, long-running CLI/build/test/deploy commands, slow MCP tools, background processes, repository cleanup tasks, and agent-platform builders implementing tool execution.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38495, opened 2026-08-14, reports a long-running code-mode `exec` degrading into full-context polling. One cleanup sequence produced 90 model turns and more than 21M input tokens; the report states 34.6M tokens were burned after the task had already completed. Source: https://github.com/openai/codex/issues/38495
2. Codex issue #32188, opened 2026-07-10, requests event-driven wakeup because background processes currently require model polling, a long-running tool call, or a monitoring subagent. The report notes Codex already receives an `ExecCommandEnd` event internally. Source: https://github.com/openai/codex/issues/32188
3. Codex issue #29865, opened 2026-06-24, requests `wake_on_output` because background `exec_command` output is otherwise observed only by explicit polling with `write_stdin`. Source: https://github.com/openai/codex/issues/29865
4. Codex issue #37299, opened 2026-08-06, reports full-context wait/status turns at 10–30 second cadence with ~137–141k input tokens per turn, demonstrating the wider cost of model-mediated polling. Source: https://github.com/openai/codex/issues/37299
5. Codex issue #35259, opened 2026-07-24, separately measured wait/status-only model turns as a substantial fraction of raw local token volume. Source: https://github.com/openai/codex/issues/35259

## Existing approaches
- Poll `wait` or `write_stdin` from the model at fixed intervals.
- Increase poll timeout.
- Delegate monitoring to a subagent.
- Keep a long-running tool call open until completion.
- Manually interrupt suspected hangs.

## Remaining limitations
Longer poll intervals reduce but do not remove full-context re-entry. A monitoring subagent shifts rather than eliminates orchestration cost and consumes agent capacity. A permanently open tool call can complicate cancellation and UI responsiveness. Fixed polling cannot distinguish a silent but healthy process from a hung process. Manual interruption is unavailable for unattended workflows.

## Root-cause analysis
- Process completion is represented as pull-based state rather than an event delivered to the orchestration layer.
- The model is used as a timer/state-machine for deterministic waiting.
- Poll cost scales with accumulated context instead of with tiny status payload size.
- Poll intervals are often chosen without expected command-duration evidence.
- Runtime lacks a per-process polling/token budget and duplicate no-progress circuit breaker.
- Completion events may exist internally but are not wired to resume the correct agent turn.

## Improvement opportunity
Move waiting out of the model loop. Use event-driven completion/output notification where runtime APIs permit it. When only polling is available, use a deterministic watchdog with exponential backoff, no-progress detection, per-process poll/token budgets, completion-after-deliverable detection, and a hard stop/escalation threshold. Resume the model only for meaningful process events or when deterministic recovery criteria require a decision.

## Goal
Reduce model turns and token usage attributable to waiting on long-running commands without losing correct completion detection, cancellation, or failure reporting.

## Metrics
- Model polling turns per long-running command.
- Input tokens spent only on wait/status turns.
- p50/p95 command-completion detection delay.
- wall-clock task latency.
- background process timeout/cancellation accuracy.
- false-hang interventions.
- concurrency-slot occupancy after deliverable completion.
- percentage of waits handled without model re-entry.

## Trigger
A command/tool exceeds initial yield deadline, returns a running handle, or enters background execution.

## Inputs
Process/session ID, start time, last progress time, expected duration class if known, current poll count, no-progress count, estimated model input tokens per poll, command state, output delta, task/deliverable completion state, and policy.

## Outputs
`wait_runtime`, `resume_model`, `collect_result`, `cancel`, or `escalate`; next deterministic wakeup interval; reason; accumulated wait budget; and measurement record.

## Interpretation
The evidence shows a real repeated efficiency problem in current agent execution paths. It does not imply every long command should be interrupted or that all model polling is unnecessary. The engineering target is deterministic waiting/status management, not suppression of meaningful model decisions.

## Proposed solution
A reusable event-first wait controller with bounded fallback polling, deterministic budgets, progress-aware backoff, and before/after benchmark verification.

## Relevant sources
- https://github.com/openai/codex/issues/38495
- https://github.com/openai/codex/issues/32188
- https://github.com/openai/codex/issues/29865
- https://github.com/openai/codex/issues/37299
- https://github.com/openai/codex/issues/35259
