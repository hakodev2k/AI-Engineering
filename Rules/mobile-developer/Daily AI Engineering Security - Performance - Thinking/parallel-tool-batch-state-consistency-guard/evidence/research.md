# Research Evidence

## Topic
Parallel Tool Batch State Consistency Guard

## Category
Performance

## Problem
Agent frameworks increasingly execute several tool calls in parallel, but session state, approval queues, handoff state, and tool-result ordering are not always transactionally isolated. A single model turn can therefore lose sibling calls, interleave state from concurrent requests, deadlock handoffs, or trigger repeated tool retries that erase the latency advantage of parallelism.

## Why it matters now
Parallel tool calling is now a default optimization in several agent stacks. Recent 2026 reports show that concurrency bugs are not isolated to one framework: they appear in approval middleware, subagent execution, handoff pipelines, and session memory.

## Affected users
Developers building multi-tool agents, human-in-the-loop approval systems, multi-agent orchestrators, realtime voice agents, and platform teams running concurrent requests against shared sessions.

## Current public evidence
### Observed evidence
1. Microsoft Agent Framework issue #6910, opened July 4, 2026, reports that AG-UI can lose sibling tool calls when one parallel call requires approval. The host recreates `AgentSession` per request while approval state is session-bound, and synthetic skipped results can cause repeated re-issuance loops.
2. Google ADK Go issue #1137, opened July 9, 2026, reports a data race when the same `single_turn` sub-agent is dispatched multiple times in parallel because concurrent goroutines mutate shared agent state.
3. LiveKit Agents issue #5150 reports a parallel handoff race: one tool returns a new Agent while another requires a reply, and the reply path can run on the old agent before the handoff completes, leaving the conversation in a loop.
4. AgentScope Runtime issue #402 reports memory corruption when concurrent tool-calling requests use the same session ID and their Reasoning/Action/Observation sequences interleave.

### Official guidance / existing contract
Microsoft's current Agent Framework tool-approval documentation requires callers to pass the same session object back after approval and, for multiple approvals, continue until every request is resolved. The `ToolApprovalAgent` documentation states that queued approvals and standing rules live in `AgentSessionStateBag` and survive only across runs in the same session.

### Interpretation
The common failure is a missing batch/session consistency contract. Parallelism is introduced at the executor level, but mutable state is often scoped to an agent or session rather than to an immutable tool-call batch. Once approvals, handoffs, or concurrent HTTP requests cross boundaries, sibling-call identity and state transitions can be lost or reordered.

## Existing approaches
- Framework-provided parallel tool execution.
- Session-scoped approval queues.
- Locks around selected mutable fields.
- Sequential fallback for sensitive tools.
- Retry/re-prompt when a tool result is missing.
- Per-tool spans and logs.

## Remaining limitations
- A lock on one field does not guarantee atomicity across the whole tool batch.
- Reconstructing sessions per transport request can invalidate approval queues.
- Retrying missing calls can create duplicate side effects.
- Parallel handoff plus reply-producing tools may need ordering barriers, not generic locking.
- Traces often lack stable `batch_id`, `tool_call_id`, state version, and terminal outcome fields needed to prove no sibling was lost.

## Root-cause analysis
1. Mutable agent/session state is shared by parallel tool calls.
2. Tool-call batches lack a durable identity and lifecycle ledger.
3. State transitions are not guarded by compare-and-swap/version checks.
4. Approval continuation recreates or detaches the session carrying pending siblings.
5. Handoff/reply paths are allowed to commit independently without a batch barrier.
6. Missing-result recovery retries work without idempotency evidence.

## Improvement opportunity
Add a reusable batch-state consistency layer: assign durable batch and call IDs, snapshot the session version before dispatch, record every call state transition, block incompatible commits, require idempotency keys for retryable side effects, and replay traces in CI to detect lost, duplicated, reordered, or non-terminal calls.

## Goal
Preserve parallelism while ensuring every tool call in a model-issued batch reaches exactly one terminal state and every stateful commit is attributable to the correct session version.

## Metrics
Batch completion latency, duplicate execution count, lost-call count, non-terminal-call count, state-version conflicts, retry count, approval-resume success rate, and throughput versus sequential baseline.

## Trigger
Any feature enabling parallel tool calls, same-session concurrent requests, multi-tool approval, or agent handoff in the same model turn.

## Inputs
Structured tool-call trace, session ID/version, tool metadata, approval/handoff events, baseline sequential/parallel timings.

## Outputs
Invariant audit, conflict report, before/after benchmark, and PASS/BLOCK verification result.

## Relevant sources
- https://github.com/microsoft/agent-framework/issues/6910
- https://github.com/google/adk-go/issues/1137
- https://github.com/livekit/agents/issues/5150
- https://github.com/agentscope-ai/agentscope-runtime/issues/402
- https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval
- https://learn.microsoft.com/en-us/dotnet/api/microsoft.agents.ai.toolapprovalagent?view=agent-framework-dotnet-latest
