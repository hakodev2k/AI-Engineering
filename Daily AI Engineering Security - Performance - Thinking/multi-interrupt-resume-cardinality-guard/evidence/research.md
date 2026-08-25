# Research

## Topic
Multi-interrupt resume cardinality and response binding

## Category
Thinking

## Problem
When one agent turn contains multiple concurrent human-input/approval interrupts, resume logic can under-count nested interrupts, consume only one response, drop sibling calls, or reconstruct state that no longer represents all pending decisions.

## Why it matters now
Agent frameworks increasingly support parallel tool calls, resumable graphs, AG-UI clients, and multiple human approvals in one turn. The failure is not merely UI inconvenience: the agent can proceed with a partial or misbound decision set while the user believes every visible request was answered.

## Affected users
Developers building human-in-the-loop agents, AG-UI clients, LangGraph workflows, approval-heavy automation, and platform teams supporting parallel tool execution.

## Current public evidence
### Observed evidence
1. LangGraph issue #8579, opened 2026-08-09, reproduces a scalar `Command(resume=...)` being accepted when a subgraph task actually contains two pending interrupts. One branch receives the scalar according to internal execution order while the other remains pending. The report notes the existing protection works for separate top-level tasks but misses multiple child interrupts grouped in one task. https://github.com/langchain-ai/langgraph/issues/8579
2. Microsoft Agent Framework issue #7569, opened 2026-08-07, reproduces two `always_require` tool calls surfaced as two interrupts; a client approves both, yet only the first executes and the second disappears without result or transcript evidence. https://github.com/microsoft/agent-framework/issues/7569
3. Microsoft Agent Framework issue #6910, opened 2026-07-04, documents parallel approval state loss across AG-UI runs; only one interrupt is opened per run and state needed to resume the batch can be destroyed between runs. https://github.com/microsoft/agent-framework/issues/6910
4. Microsoft Agent Framework issue #6909, opened 2026-07-04, reports approval-resolved tool results appended out of order during resumed history construction, producing invalid histories for strict chat providers. https://github.com/microsoft/agent-framework/issues/6909

## Interpretation
Independent runtimes expose a common control-plane flaw: resume correctness depends on the complete set of pending decision identities, but implementations often reason at task/run/container cardinality rather than interrupt cardinality. Partial processing then creates silent loss or ambiguous binding.

## Existing approaches
- Unique interrupt/tool-call IDs.
- Pending approval registries.
- Checkpoint/resume APIs.
- Scalar-resume rejection when multiple interrupts are detected.
- Queueing approval requests across runs.
- Provider validation of assistant/tool message ordering.

## Remaining limitations
Nested containers may hide multiple IDs; queues can split one logical decision batch across runs; consumers can short-circuit after the first response; and late provider validation cannot reconstruct a human decision that was already misapplied or dropped.

## Root-cause analysis
1. Cardinality is computed from task containers rather than flattened interrupt IDs.
2. Resume payload schemas allow scalar values without proving singleton state.
3. Pending state and response consumption are not atomic as a complete batch.
4. “Handled by UI” and “applied by executor” are separate states without reconciliation.
5. Resumed transcript construction can reorder or omit artifacts tied to the original calls.

## Improvement opportunity
Make the pending interrupt set explicit and versioned. Flatten nested interrupts, require one-to-one ID coverage, reject scalar values unless the set has exactly one member, consume/apply the batch atomically, then verify every disposition before advancing.

## Proposed solution
A reusable pre-resume validator plus lifecycle rules, workflow, independent verifier, and tests that enforce exact set reconciliation without exposing hidden reasoning.

## Goal
Zero ambiguous resume bindings, zero silently dropped approved calls, and zero continuation with unresolved expected interrupts.

## Metrics
Pending vs response cardinality, missing/unknown/duplicate IDs, scalar-on-multiple attempts, post-resume unresolved count, dropped-approved-call rate, and verification latency.

## Trigger
Any resume/continue operation after one or more human-input, approval, or interrupt events, especially nested or parallel flows.

## Inputs
Flattened pending interrupt IDs and proposed resume payload.

## Outputs
Allow/block decision with mismatch evidence.

## Relevant sources
- https://github.com/langchain-ai/langgraph/issues/8579
- https://github.com/microsoft/agent-framework/issues/7569
- https://github.com/microsoft/agent-framework/issues/6910
- https://github.com/microsoft/agent-framework/issues/6909
