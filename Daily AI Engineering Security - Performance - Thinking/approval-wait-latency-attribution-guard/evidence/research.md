# Research — Approval-Wait Latency Attribution Guard

## Topic
Approval-Wait Latency Attribution Guard

## Category
Thinking / Performance

## Problem
Human approval delay is often mixed into tool execution time. When an agent interprets that combined wall-clock duration as evidence that the command, API, database, network, or tool implementation is slow, it can produce a false diagnosis and make unnecessary or harmful changes.

## Why it matters now
Approval-gated tool execution is increasingly common in coding and production agents, while current clients and SDKs support long-lived approval interruptions. A fresh Codex issue shows that approval dwell can be attributed to tool runtime and can influence the model's technical conclusions.

## Affected users
Coding-agent users, platform teams, SREs, developers using human-in-the-loop agent systems, and teams relying on agent-generated performance investigations.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38731, opened 2026-08-15, reports that Codex Desktop can include manual approval wait in apparent tool execution time and then infer a technical cause for the delay: https://github.com/openai/codex/issues/38731
2. OpenAI Agents SDK's current human-in-the-loop documentation explicitly models approval as a pause/interruption before tool execution and supports durable `RunState` resume, showing approval wait is a distinct lifecycle phase rather than tool runtime: https://openai.github.io/openai-agents-python/human_in_the_loop/
3. The Agents SDK realtime guide similarly emits `tool_approval_required` and pauses the tool run until approval or rejection, again establishing a separate approval boundary: https://openai.github.io/openai-agents-python/realtime/guide/

### Interpretation
The platform lifecycle already contains enough semantic boundaries to separate approval dwell from execution latency, but observability pipelines and agent reasoning can collapse them into one elapsed duration. The problem is therefore not merely UI timing: it can poison performance evidence.

## Existing approaches
- Display a single elapsed duration for a tool call.
- Rely on generic tracing spans without enforcing phase semantics.
- Manually inspect logs when a delay looks suspicious.
- Ask the agent to distinguish approval time conceptually.

## Remaining limitations
- A single start/end timestamp cannot identify where latency occurred.
- The model may reason from an inaccurate displayed duration before a human notices.
- Approval, queue, sandbox startup, tool runtime, serialization, and post-processing may all be mixed.
- Manual correction is not reusable or deterministic.

## Root-cause analysis
1. Missing phase-specific timestamps.
2. Tool spans start before approval but are labeled as execution spans.
3. No invariant requiring `execution_start >= approval_decision` for approval-gated calls.
4. Performance diagnosis consumes wall time without provenance.
5. No deterministic gate rejects evidence that conflates lifecycle phases.

## Improvement opportunity
Capture normalized lifecycle timestamps and compute approval wait, queue delay, tool execution, post-processing, and total wall time independently. Require performance conclusions to use execution time unless explicitly analyzing approval UX. Block or flag traces whose timing boundaries are impossible or incomplete.

## Goal
Prevent approval wait from being used as evidence of tool slowness and make latency attribution machine-verifiable.

## Metrics
- 100% of approval-gated calls contain phase timestamps or are marked `insufficient_evidence`.
- 0 false tool-latency regressions in provided approval-delay fixtures.
- Attribution error <= 10 ms on deterministic fixtures.
- Baseline and post-change reports include approval wait separately from execution time.

## Trigger
Post-tool trace ingestion, benchmark analysis, or any performance diagnosis involving approval-gated actions.

## Inputs
Tool call ID, requested timestamp, approval-required timestamp, approval decision timestamp, execution start/end, post-processing end, optional queue timestamps.

## Outputs
Phase durations, trace validity, attribution verdict, diagnostic evidence, and blocking reasons.

## Relevant sources
- Codex #38731: https://github.com/openai/codex/issues/38731
- OpenAI Agents SDK HITL: https://openai.github.io/openai-agents-python/human_in_the_loop/
- OpenAI Agents SDK Realtime guide: https://openai.github.io/openai-agents-python/realtime/guide/
