# Research — Approval-Wait Latency Attribution Profiler

## Topic
Separate human approval wait from tool execution and model continuation latency in agent traces.

## Category
Performance

## Problem
Agent runtimes often expose one wall-clock duration around an approval-gated tool call. If the model or telemetry pipeline treats that entire interval as tool execution, a user taking minutes to approve an action can make an 11-second command appear to take minutes. The agent may then invent a technical performance diagnosis and change implementation strategy based on a false latency signal.

## Why it matters now
A 2026-08-15 Codex Desktop issue reports exactly this failure: delayed user approval was attributed to the underlying command and influenced a technical decision, despite the command itself completing in about 11 seconds. An earlier Codex issue documents `/goal` time accounting continuing during approval waits. Together they show that approval wait is a real lifecycle phase that can contaminate both observability and agent reasoning when it is not separately represented.

## Affected users
- Developers using approval-gated coding agents.
- Platform teams measuring tool latency and agent task duration.
- Agent developers using trace timing as model-visible evidence.
- Engineering teams tuning commands, network access, or tool choices from agent-produced diagnostics.

## Current public evidence

### Observed evidence
1. openai/codex issue #38731, opened 2026-08-15: Codex Desktop can attribute approval-wait time to tool execution, invent a plausible cause for the apparent delay, and alter implementation decisions. The reporter independently measured the actual query at about 11 seconds. https://github.com/openai/codex/issues/38731
2. openai/codex issue #22312, opened 2026-05-12: `/goal` runtime includes time spent waiting for user approval, confirming wall-clock accounting crosses the approval boundary. https://github.com/openai/codex/issues/22312
3. openai/codex issue #27458 reports approval/user-input waiting interacting with timeout behavior, demonstrating that interactive wait is operationally distinct from execution and can affect control flow. https://github.com/openai/codex/issues/27458
4. openai/codex issue #12923 reports agents entering permission-wait states without a surfaced approval prompt, reinforcing that approval has its own lifecycle state and should be observable rather than inferred from elapsed time. https://github.com/openai/codex/issues/12923

## Interpretation
The core engineering defect is phase collapse. A single elapsed interval is used for at least three semantically different states: waiting for a human, executing the tool, and waiting for/processing the model continuation. Wall-clock duration remains useful for user experience, but it is invalid evidence for tool performance unless phase boundaries are explicit.

## Existing approaches
- End-to-end task timers.
- Tool result timestamps or execution duration when supplied by adapters.
- Approval prompts and permission lifecycle state.
- Distributed tracing/span systems in agent platforms.
- Manual correction when the user notices a false timing diagnosis.

## Remaining limitations
- Approval and execution events may be emitted by different UI/runtime components without a shared correlation ID.
- A progress timer can fire immediately after approval and make stale wall-clock time model-visible.
- Tool adapters may report only completion timestamps, forcing the host to infer start time.
- Existing dashboards can intentionally include approval wait in total task time while failing to expose execution-only time separately.
- Agents can act on contaminated timing evidence before a human notices the attribution error.

## Root-cause analysis
1. Lifecycle phases are modeled as one coarse span instead of nested/correlated spans.
2. Human wait is treated as idle time in the UI but not encoded as a distinct agent-visible state.
3. Performance conclusions are allowed from wall-clock deltas without source/phase validation.
4. Progress-message scheduling is not paused or relabeled while awaiting approval.
5. There is no deterministic regression check proving `tool_execution_ms` excludes `approval_wait_ms`.

## Improvement opportunity
Define a trace contract with separate timestamps for approval requested, approval resolved, execution started, execution ended, and continuation completed. Derive explicit metrics: approval wait, execution, continuation, and total wall-clock. Block tool-performance conclusions when only wall-clock timing exists or when phase ordering is invalid.

## Proposed solution
This package provides a dependency-free event profiler, JSON schema, enforceable attribution rules, a performance-investigation skill, a verifier subagent, a post-tool timing hook, tests, and a bounded Measure → Diagnose → Hypothesize → Optimize → Measure workflow.

## Goal
Prevent approval latency from contaminating technical performance diagnosis while preserving end-to-end user-facing task timing.

## Metrics
- `approval_wait_ms`.
- `tool_execution_ms`.
- `continuation_ms`.
- `wall_clock_ms`.
- `misattribution_count` (target 0).
- `% tool latency claims backed by execution-only timing` (target 100%).
- p50/p95 execution latency before/after optimization.

## Trigger
Any approval-gated tool call used for performance diagnosis, any apparent multi-minute tool delay, or any change that affects approval/tool timing instrumentation.

## Inputs
Correlated lifecycle events with timestamps and call ID.

## Outputs
Per-call phase timing, validation errors, evidence-quality flag, and machine-readable JSON summary.

## Relevant sources
- https://github.com/openai/codex/issues/38731
- https://github.com/openai/codex/issues/22312
- https://github.com/openai/codex/issues/27458
- https://github.com/openai/codex/issues/12923
