# Research

## Topic
Approval-wait latency attribution integrity in tool-using agents

## Category
Thinking

## Problem
Agents and analytics can mistake time blocked on human approval for active tool execution, then build technical conclusions on the wrong latency signal.

## Why it matters now
Approval-gated agent workflows are common in coding agents. A fresh August 2026 Codex report shows the model itself using approval-inflated elapsed time to make a false performance diagnosis, while an independent Claude Code telemetry report shows the underlying trace format can make the two states structurally indistinguishable.

## Affected users
Developers using approval-gated tools, agent-platform teams, observability/analytics builders, and teams relying on autonomous performance diagnosis.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38731, opened 2026-08-15, reports Codex Desktop attributing approval-wait time to a tool, inventing a technical explanation for the apparent delay, and changing its implementation plan until corrected. The report requests separate approval-wait and execution-only durations. https://github.com/openai/codex/issues/38731
2. OpenAI Codex issue #22312, opened 2026-05-12, reports `/goal` runtime continuing through approval waits and therefore attributing blocked time as active runtime. https://github.com/openai/codex/issues/22312
3. Anthropic Claude Code issue #55240, opened 2026-05-01, reports JSONL traces where `tool_use` to `tool_result` spans approval wait with no structural marker. Across 212 subagent traces, several long traces were dominated by approval-gated gaps, preventing downstream latency analytics from distinguishing wait from execution. https://github.com/anthropics/claude-code/issues/55240
4. Claude Code issue #58965 separately reports permission-prompt sessions displayed as `working` rather than `waiting for input`, another lifecycle-state attribution failure. https://github.com/anthropics/claude-code/issues/58965

## Interpretation
The recurring problem is not merely a UI timer. Multiple systems expose a blended lifecycle interval that can flow into analytics or model-visible context. When an agent is allowed to reason from that blended metric, it can optimize the wrong subsystem.

## Existing approaches
- End-to-end wall-clock duration for user-perceived latency.
- Pairing tool request and result timestamps.
- Progress timers and generic `working` states.
- Human correction after a false diagnosis.

## Remaining limitations
These approaches do not encode where approval waiting ends and execution begins. Wall time is valid for UX but insufficient as causal evidence about tool performance. Human correction is late and non-reusable.

## Root-cause analysis
1. Lifecycle state is compressed into request/result pairs.
2. Approval and execution clocks are not separately instrumented.
3. Agent-visible timing does not carry provenance/semantics.
4. Performance decisions lack an evidence gate requiring execution-only timing.
5. Progress timers can continue while execution is blocked.

## Improvement opportunity
Introduce a lifecycle timing contract and deterministic validator that refuses to classify tool speed unless execution boundaries are known. Preserve wall-clock latency separately for UX and approval-friction analysis.

## Proposed solution
Instrument five boundaries, calculate non-overlapping durations, mark incomplete evidence as unknown, and require independent verification before performance-driven code/design changes.

## Goal
Prevent unsupported performance conclusions caused by approval-inflated timing.

## Metrics
Attributable-tool ratio, ambiguous-tool count, execution-only latency, approval-wait latency, postprocess latency, and number of performance decisions rejected for insufficient timing evidence.

## Trigger
Any performance investigation, automated optimization, or progress diagnosis involving approval-gated tools.

## Inputs
Lifecycle JSONL events and any proposed performance conclusion.

## Outputs
Separated timing metrics, violations, attribution status, and evidence suitable for review.

## Relevant sources
- https://github.com/openai/codex/issues/38731
- https://github.com/openai/codex/issues/22312
- https://github.com/anthropics/claude-code/issues/55240
- https://github.com/anthropics/claude-code/issues/58965
