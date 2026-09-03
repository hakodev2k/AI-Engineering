# Research Evidence

## Topic
Agent Lifecycle Phase Observability Contract

## Category
Performance

## Problem
Agent hosts often expose only coarse completion signals while hiding turn-start, model streaming, approval, tool-start/end, queue, and token phases. The result is ungrounded latency diagnosis: slow tools, model inference, host overhead, and human wait are conflated, so teams optimize the wrong component.

## Why it matters now
On 2026-09-03, OpenAI Codex issue #42494 requested lifecycle events for turn start, streaming, tool timing, and token usage because the existing completion-only notification is insufficient for external consumers. On 2026-08-22, issue #40087 independently requested a per-tool performance breakdown that distinguishes actual tool execution from Codex overhead. Issue #38731 (2026-08-15) demonstrates the practical consequence: approval wait was interpreted as execution latency and influenced an implementation decision.

## Affected users
Agent-platform builders, developers running coding agents, SRE/performance teams, observability vendors, and users automating long-running workflows.

## Current public evidence

### Observed evidence
1. Codex #42494 asks for start, streaming, tool timing, and token lifecycle events; completion-only notification prevents accurate external state and ETA analysis.
2. Codex #40087 asks for model-vs-tool-vs-host timing because a fast command can appear slow end-to-end when host overhead dominates.
3. Codex #38731 reports a false performance conclusion caused by mixing approval dwell with tool runtime.

### Interpretation
The recurring deficiency is not one slow component but missing phase provenance. Without phase boundaries, wall-clock measurements cannot support component-level conclusions.

### Proposed solution
Define a host-neutral lifecycle event contract and deterministic analyzer. Require stable run/turn/tool IDs, explicit phase timestamps, monotonic ordering, and completeness scoring before performance claims are accepted.

## Existing approaches
- Completion-only hooks/notifications.
- Console timestamps and command-local timers.
- Provider traces that cover model calls but not all host phases.
- Manual correlation between logs, UI and tool output.

## Remaining limitations
- Completion signals cannot identify where time was spent.
- Tool-local timing omits queueing, approvals and post-tool continuation.
- Provider telemetry does not necessarily capture host orchestration.
- Ad hoc event names make cross-agent comparison fragile.
- Missing events can silently create misleading derived durations.

## Root-cause analysis
1. Lifecycle state is implemented internally but not emitted as a stable external contract.
2. Instrumentation starts/ends spans at convenience boundaries rather than semantic phase boundaries.
3. IDs are not consistently propagated across model, tool and approval events.
4. Derived latency is computed even when required events are missing.
5. UX wall time and component execution time are treated as interchangeable.

## Improvement opportunity
Standardize events for `turn_started`, `model_started`, `model_first_token`, `model_completed`, `approval_started`, `approval_completed`, `tool_started`, `tool_completed`, and `turn_completed`. Add a deterministic profiler that validates ordering, computes phase durations, records missing phases and refuses unsupported attribution.

## Goal
Make agent latency attributable, comparable and regression-testable without requiring hidden reasoning.

## Metrics
- Lifecycle completeness ratio.
- Invalid event-order count.
- Uncorrelated tool-event count.
- Model time-to-first-token.
- Model generation duration.
- Approval wait duration.
- Tool execution duration.
- Host/orchestration residual time.
- End-to-end turn latency.
- Unsupported attribution count.

## Trigger
Use when instrumenting an agent host, investigating latency, adding hooks, benchmarking versions, or integrating external status/ETA consumers.

## Inputs
JSONL lifecycle events with timestamp, run_id, turn_id, event and optional tool_call_id.

## Outputs
Validated phase ledger, per-turn metrics, missing-event warnings, attribution verdict and regression report.

## Relevant sources
- OpenAI Codex #42494, opened 2026-09-03: https://github.com/openai/codex/issues/42494
- OpenAI Codex #40087, opened 2026-08-22: https://github.com/openai/codex/issues/40087
- OpenAI Codex #38731, opened 2026-08-15: https://github.com/openai/codex/issues/38731
