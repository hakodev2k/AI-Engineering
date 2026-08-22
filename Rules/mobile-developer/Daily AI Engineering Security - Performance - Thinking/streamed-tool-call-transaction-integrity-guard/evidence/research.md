# Research — Streamed Tool Call Transaction Integrity Guard

## Topic
Streamed Tool Call Transaction Integrity Guard

## Category
Thinking

## Problem
Agent runtimes may treat incomplete, duplicated, or malformed streamed tool-call arguments as executable work. A transport interruption can therefore be converted into a semantically different tool call, while the agent continues as if the intended action happened. The resulting false assumption contaminates later planning, verification, and completion claims.

## Why it matters now
Recent August 2026 incidents show the same failure class across different agent stacks: partial arguments replaced by `{}`, duplicate streamed function calls with empty arguments, and malformed streaming JSON reaching execution or broken recovery paths.

## Affected users
Developers building streaming agents, long-running coding agents, workflow systems using write tools, and users relying on agent completion claims after file/API/database actions.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #80498 (2026-08-06) reports a stream drop during `write_file` argument generation; incomplete arguments were replaced with `{}`, the write did not happen, no retry occurred, and the agent drifted off-task: https://github.com/NousResearch/hermes-agent/issues/80498
2. Hermes Agent issue #81639 (2026-08-08) reports malformed tool-call arguments being canonicalized to `{}` and persisted, producing stuck/reasoning-only sessions across multiple tools and upstream causes: https://github.com/NousResearch/hermes-agent/issues/81639
3. Microsoft Agent Framework issue #7485 (2026-08-03) reports duplicate function calls with the same ID during streaming, with the second call carrying no arguments: https://github.com/microsoft/agent-framework/issues/7485
4. Anthropic Python SDK issue #1265 documents malformed streamed tool JSON reaching a parsing path with insufficient error handling, and recommends explicit parse failure handling and retry guidance: https://github.com/anthropics/anthropic-sdk-python/issues/1265
5. OpenAI Agents SDK lifecycle guidance separates discovery/planning from invocation and requires validation before side effects; ToolContext exposes raw tool arguments and call identity for execution-boundary checks: https://github.com/openai/openai-agents-python/blob/main/.agents/references/tool-execution-lifecycle.md

## Existing approaches
- Best-effort JSON repair/sanitization.
- Convert missing/empty arguments to `{}` for no-argument tools.
- Retry the whole model turn on provider error.
- Rely on tool schema validation immediately before invocation.
- Persist streamed transcript fragments and recover on the next turn.

## Remaining limitations
Best-effort repair can silently change semantics. Whole-turn retries risk duplicate side effects unless invocation state is known. Schema validation only proves shape, not stream completeness or semantic equivalence to the intended call. Persisting repaired arguments destroys forensic evidence. Empty `{}` is valid for some tools and dangerous for others, so one normalization rule is insufficient.

## Root-cause analysis
- Streaming assembly state is not treated as a transaction with explicit terminal states.
- Transport completeness, JSON validity, schema validity, and invocation authorization are conflated.
- Runtimes may mutate raw evidence during repair instead of retaining original fragments.
- Retry decisions lack a durable record of whether side effects began or completed.
- Later agent reasoning receives no explicit failure fact and assumes the planned action succeeded.

## Improvement opportunity
Use a transaction envelope for every streamed tool call. Preserve raw fragments, require an explicit terminal/complete state before invocation, validate JSON and schema separately, bind execution to a call fingerprint, record `not-started / started / succeeded / failed / unknown`, and expose a structured model-visible failure when recovery is required. Never substitute repaired arguments for executable arguments without proving semantic equivalence.

## Goal
Prevent transport/parser corruption from becoming silent tool execution or unsupported completion assumptions.

## Metrics
- 100% streamed calls have terminal assembly status before execution.
- 0 incomplete/malformed calls reach side-effecting tools.
- 100% recovery decisions know whether execution started.
- 0 successful completion claims when required tool transactions are `failed`, `unknown`, or `not-started`.
- Recovery fixtures terminate within 2 retries.

## Trigger
Any streamed tool call; especially stream termination without expected finish event, duplicate call identity, JSON parse failure, or schema mismatch.

## Inputs
Stream fragments, tool/call identity, raw argument buffer, terminal event, tool schema, execution state, and retry count.

## Outputs
`ready / retry / block / reconcile` decision, immutable raw evidence hash, parsed arguments when safe, execution-state record, and model-visible failure facts.

## Interpretation
These incidents do not prove all streaming tool implementations are unsafe. They demonstrate that repair-first execution can turn transient transport/model faults into incorrect world-state assumptions.

## Proposed solution
A reusable transaction-state validator plus bounded recovery workflow that makes incomplete tool calls non-executable and requires evidence before the agent proceeds or claims success.