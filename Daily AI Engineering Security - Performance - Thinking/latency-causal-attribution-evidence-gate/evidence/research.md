# Research — Latency Causal Attribution Evidence Gate

## Topic
Prevent AI agents from turning phase-ambiguous elapsed time into unsupported performance diagnoses.

## Category
Thinking

## Problem
A runtime may expose wall-clock duration that contains human approval wait, actual tool execution, result ingestion, model re-entry, and UI/runtime overhead. The agent may treat that number as execution time, invent a plausible root cause, and alter implementation on false evidence.

## Why it matters now
On 2026-08-15, OpenAI Codex issue #38731 reported a confirmed case where a manually delayed approval was interpreted as a multi-minute tool delay; the actual query took about 11 seconds and the agent reversed its conclusion after correction. On 2026-08-22, issue #40087 separately requested per-tool timing that distinguishes tool execution from Codex overhead/waiting because current visibility cannot reliably localize latency.

## Affected users
Developers using approval-gated agents; teams optimizing tool/MCP/test latency; platform builders exposing timing telemetry to models; reviewers evaluating performance-driven code changes.

## Current public evidence

### Observed evidence
1. OpenAI Codex #38731, opened 2026-08-15: approval wait was attributed to tool execution and promoted into a technical recommendation. The issue explicitly asks for separate approval-wait and execution-only durations.
2. OpenAI Codex #40087, opened 2026-08-22: requests a per-turn breakdown separating model/inference, individual tool calls, and overhead/waiting, including the case where a 100 ms command takes seconds end-to-end.
3. OpenAI Agents SDK tracing documents model, tool, handoff, and custom spans, demonstrating that phase-level instrumentation is a practical existing mechanism rather than hidden reasoning.

## Interpretation
The recurring defect is evidence provenance: a measurement whose interval contains multiple lifecycle states is used as if it measured one cause.

## Existing approaches
Whole-turn timers, tool-handler duration, trace dashboards, model-visible progress messages, and manual log comparison.

## Remaining limitations
Whole-turn timers conflate phases; raw traces do not enforce claim discipline; agent prose can convert correlation into causation; approval time can be intentional but is still unsuitable as tool-execution evidence.

## Root-cause analysis
1. Lifecycle timestamps are incomplete or semantically unlabeled.
2. Wall-clock and execution-only metrics have similar names.
3. Progress timers may continue across approval waits.
4. Decision logic lacks an evidence gate requiring phase provenance.
5. Human reviewers often see the final narrative rather than the underlying trace.

## Improvement opportunity
Introduce a reusable phase contract and deterministic claim gate. The gate does not request chain-of-thought; it requires observable timestamps and an explicit claimed phase.

## Proposed solution
Classify timing records as `attributable`, `ambiguous`, or `invalid`; block causal performance decisions when required phase bounds are missing or inconsistent; retain end-to-end time for UX metrics without relabeling it as execution time.

## Goal
Reduce unsupported latency diagnoses and performance rework without weakening approvals or other safety controls.

## Metrics
Unsupported latency claims/task; ambiguous timing records; percentage of decisions backed by execution-only evidence; rework caused by disproven hypotheses; p95 approval wait vs execution vs post-tool overhead.

## Trigger
Before an agent changes code/configuration, recommends an optimization, or closes a performance investigation based on elapsed-time evidence.

## Inputs
JSON timing record, policy, and claimed phase.

## Outputs
Structured attribution report, normalized phase durations, blocking exit status.

## Relevant sources
- https://github.com/openai/codex/issues/38731
- https://github.com/openai/codex/issues/40087
- https://openai.github.io/openai-agents-python/tracing/
