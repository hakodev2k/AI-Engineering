# Research — Parallel Tool Output Cardinality Gate

## Topic
Completeness and one-to-one accounting for parallel agent tool calls.

## Category
Thinking / Performance

## Problem
When an agent emits multiple tool calls in one turn, orchestration layers can accidentally persist or return only a subset of the corresponding tool outputs. The next model call then sees unmatched call IDs, can fail with provider errors, or can reason over an incomplete execution history. This is especially fragile when structured-output tools, approvals, streaming, guardrails, or resume logic are mixed with parallel execution.

## Why it matters now
Current 2026 issue reports across different agent ecosystems show the same structural failure class: parallel calls are accepted, but output cardinality and lifecycle completeness are not guaranteed across all orchestration paths.

## Affected users
Developers building coding agents, workflow agents, structured-output agents, approval-gated agents, and platforms that execute multiple tools concurrently.

## Current public evidence
### Observed evidence
1. LangChainJS issue #11020 (2026-06-03) reports `createAgent` with `responseFormat`/ToolStrategy failing with `INVALID_TOOL_RESULTS` when the model emits the synthetic structured-output tool more than once; only one call is answered while the assistant message contains all calls: https://github.com/langchain-ai/langchainjs/issues/11020
2. OpenAI Agents Python issue #4125 (2026-08-02) reports an output guardrail trip during streamed resume leaving a `function_call` without a matching `function_call_output`: https://github.com/openai/openai-agents-python/issues/4125
3. OpenAI Agents Python issue #3004 (2026-04-22) reports HITL resume dropping the output of a successful non-approval tool when parallel calls mix approval-gated and immediately executed tools, leading to `No tool output found for function call <call_id>`: https://github.com/openai/openai-agents-python/issues/3004

### Interpretation
These are implementation-specific bugs, but they share a reusable invariant: every emitted tool call that reaches a terminal orchestration state must have exactly one terminal disposition before the next model turn is sent. The disposition can be success, error, rejection, cancellation, or explicit deferred/interrupted state, but it must be structurally accounted for.

## Existing approaches
- Provider/API validation of missing tool outputs.
- Framework-specific call/result trackers.
- Sequential execution to reduce complexity.
- Approval/run-state persistence and resume logic.
- Ad hoc deduplication by call ID.

## Remaining limitations
- Provider validation happens late, after orchestration has already lost state.
- Parallel paths often have different handling for success, guardrail failure, approval rejection, cancellation, and structured-output tools.
- Deduplication can suppress a locally generated output that was never actually persisted/sent.
- Sequential fallback reduces throughput and hides rather than fixes lifecycle accounting defects.

## Root-cause analysis
1. No explicit turn-level ledger of expected call IDs before execution begins.
2. Multiple subsystems own terminalization independently: executor, approval manager, guardrail, streamer, session store, response formatter.
3. 'Generated', 'persisted', and 'sent to provider' are sometimes conflated.
4. Resume hydration reconstructs state from partial records and may mark outputs as already sent.
5. Structured-output synthetic tools are treated as a special path that may not obey normal multi-call accounting.

## Improvement opportunity
Create a turn-scoped cardinality ledger. Register all tool calls before executing any, require exactly one terminal disposition per call ID, track generated/persisted/sent states separately, and block the next model request if the ledger is incomplete or duplicated. Preserve parallelism; repair state rather than serializing everything.

## Goal
Prevent orphaned, duplicated, or silently dropped tool results without sacrificing safe concurrency.

## Metrics
- Orphaned terminal tool calls: 0.
- Duplicate terminal dispositions per call ID: 0.
- Next-turn requests sent with incomplete ledger: 0.
- Parallel throughput regression <= configured budget compared with baseline.
- Recovery retries bounded to 1 state-reconciliation pass before escalation.

## Trigger
After model tool-call emission, after each tool terminal event, before persistence, on resume hydration, and immediately before the next provider/model request.

## Inputs
Turn ID, emitted call IDs, tool names, execution states, approval states, guardrail outcomes, persisted output IDs, provider-sent IDs.

## Outputs
`complete`, `repair`, or `block`; missing call IDs; duplicate call IDs; state mismatches; safe next action.

## Relevant sources
- https://github.com/langchain-ai/langchainjs/issues/11020
- https://github.com/openai/openai-agents-python/issues/4125
- https://github.com/openai/openai-agents-python/issues/3004
