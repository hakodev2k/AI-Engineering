# Research — Parallel Tool Call Integrity Ledger

**Topic:** Silent loss or mis-pairing of parallel tool calls/results  
**Category:** Thinking  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Parallel tool execution can lose, collapse, or mis-pair calls/results inside orchestration layers, corrupting the evidence used by the next model turn.

## Why it matters now
Parallel tool calling is common in production agents. Recent issues show valid provider responses can be lost or reconstructed incorrectly after streaming, dispatch, approval, or resume.

## Affected users
Agent-framework developers, workflow platforms, AI coding tools, and teams using approval-gated parallel tools.

## Current public evidence

### Observed evidence
1. n8n issue #36883, opened 2026-08-23, reports AI Agent v3.1 silently discarding valid HTTP 200 model responses containing tool calls; tools are not executed and the response is not appended before another model call. https://github.com/n8n-io/n8n/issues/36883
2. OpenAI Agents Python issue #3004, opened 2026-04-22, documents a HITL resume path where mixed approval-gated/non-approval parallel calls caused a successfully executed tool output to be skipped, yielding `No tool output found for function call <call_id>`. https://github.com/openai/openai-agents-python/issues/3004
3. Claude Code issue #39830, opened 2026-03-27, reports parallel Agent calls where some `tool_result` blocks went missing despite the session remaining usable. https://github.com/anthropics/claude-code/issues/39830
4. OmniRoute issue #11044, opened 2026-08-21, reports same-name parallel tool calls collapsing into one malformed streamed call when upstream indexes/IDs do not vary correctly. https://github.com/diegosouzapw/OmniRoute/issues/11044

## Existing approaches
Pairing checks, missing-result repair, sequential fallback, retries, state persistence/resume.

## Remaining limitations
Silent loss may not raise; execution state is distributed; repair may not prove whether a side effect occurred; blind retries can duplicate mutations; same-name calls require stable identity; approval/resume adds partial states.

## Root-cause analysis
No authoritative lifecycle ledger; generated/sent/executed/acknowledged states are conflated; stream assembly may merge on unstable identity; loops advance without completeness proof; recovery often ignores effect class.

## Improvement opportunity
Create a framework-agnostic integrity ledger with states `declared`, `dispatched`, `awaiting_approval`, `succeeded`, `failed`, `rejected`, keyed by batch and stable call ID. Block the next model turn on orphan, duplicate, incomplete, or ambiguous mutating state.

## Goal
Evidence-complete parallel execution with bounded recovery and no duplicate side effects.

## Metrics
Missing, duplicate, orphan, ambiguous-mutation counts; reconciliation attempts; rework; duplicate-side-effect incidents.

## Trigger
After provider call emission, tool completion, approval resume, and before next model turn.

## Inputs
Batch ID, call ID, tool, effect class, lifecycle event.

## Outputs
`complete`, `wait`, or `block` with violations.

## Relevant sources
- https://github.com/n8n-io/n8n/issues/36883
- https://github.com/openai/openai-agents-python/issues/3004
- https://github.com/anthropics/claude-code/issues/39830
- https://github.com/diegosouzapw/OmniRoute/issues/11044

### Interpretation
The recurring engineering gap is execution-state evidence, not model reasoning quality.

### Proposed solution
A deterministic lifecycle ledger and a blocking pre-next-turn reconciliation checkpoint.
