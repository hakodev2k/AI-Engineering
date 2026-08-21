# Research — Agent Durable Side-Effect Replay Guard

## Problem
Durable agent runtimes intentionally retry, replay, and resume work after crashes, interrupts, worker restarts, or checkpoint recovery. When a task contains non-idempotent external effects—sending email, charging a payment, creating a ticket, posting a message, provisioning infrastructure, writing an append-only record—the runtime may execute that effect more than once if completion metadata and external success do not become durable atomically.

## Category
**Thinking** — reliability of execution, recovery, verification, and decision state across long-running agent workflows.

## Why it matters now
Recent LangGraph reports show duplicate or inconsistent execution under retry/recovery paths, while official documentation explicitly states that tasks can re-execute and side effects must be idempotent. This creates an application-level reliability gap: framework checkpointing reduces recomputation, but it cannot by itself guarantee exactly-once effects against arbitrary external systems.

## Current public signals

### Signal 1 — request for first-class durable tool idempotency
LangGraph issue #8464, opened 2026-07-28, reports long-running or retried graph executions re-invoking tools and duplicating side effects when workers restart or time out. The proposal asks for a durable claim store keyed by a stable request identity so retries can return prior results instead of repeating effects.

Source: https://github.com/langchain-ai/langgraph/issues/8464

### Signal 2 — crash recovery can duplicate side effects depending on persistence ordering
LangGraph issue #8039 reports that under `durability="sync"`, checkpoint and pending-write persistence ordering can produce different replay-versus-reexecute outcomes across hosts. Its reproduction shows a node side effect occurring twice after an injected crash in one interleaving.

Source: https://github.com/langchain-ai/langgraph/issues/8039

### Signal 3 — long tool calls observed re-dispatched from checkpoint
LangGraph issue #7417 reports long-running tool calls being silently re-executed from a checkpoint while the original execution was still active, producing redundant work and cost.

Source: https://github.com/langchain-ai/langgraph/issues/7417

### Signal 4 — parent retry can duplicate PUSH child work
LangGraph issue #8393 describes child-task deduplication failing on parent retry, allowing duplicate execution and duplicate side effects.

Source: https://github.com/langchain-ai/langgraph/issues/8393

### Official guidance
Current LangGraph documentation explains that a task that started but did not finish may run again on resume and recommends idempotency keys or existing-result checks for writes and API calls. Graph API documentation also states that an interrupted/retried node runs again from the start and that side effects must tolerate re-execution.

Sources:
- https://docs.langchain.com/oss/python/langgraph/functional-api
- https://langchain-ai.github.io/langgraph/how-tos/state-reducers/
- https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/breakpoints/

## Observed evidence
- Durable execution can legitimately re-run unfinished work.
- Framework-level persistence can have recovery windows where external effects have succeeded but durable completion state is absent or ambiguous.
- Duplicate work can be silent: no exception is required for a second payment, email, API mutation, or child task.
- Official guidance pushes idempotency responsibility to application/tool design.

## Interpretation
A production agent should not infer “safe to execute” merely because a workflow node is running. Before every non-idempotent external effect, it needs a durable, deterministic claim tied to the semantic operation. The claim must survive process restart and must distinguish four states: never attempted, currently claimed, completed with a reusable result, and uncertain after a crash/timeout.

## Existing approaches

### Framework checkpoints
Checkpointing stores graph/task progress and can replay completed task results.

**Strength:** avoids many repeated computations.

**Limitation:** the external system and checkpoint store are usually not in one atomic transaction. A process can die after an API mutation succeeds but before the runtime durably records completion.

### “Put side effects in tasks”
Official guidance recommends isolating side effects in tasks.

**Strength:** reduces broad node replay and lets completed task outputs be reused.

**Limitation:** a task that starts but does not durably finish can still be retried. Isolation does not make the external effect idempotent.

### Provider idempotency keys
Some APIs support idempotency keys.

**Strength:** best option when the provider guarantees stable replay semantics.

**Limitation:** not every provider supports them; retention windows vary; local file, shell, database, ticketing, and custom APIs may need application-owned protection.

### Read-before-write
Check whether the target object already exists before creating it.

**Limitation:** check-then-act races under concurrency, can require expensive reads, and is unreliable when the lookup key is not unique or the external write succeeded but is not yet visible.

### In-process deduplication
A dictionary/set prevents duplicate calls during one process lifetime.

**Limitation:** loses state on restart—the exact failure mode durable agents are designed to survive.

## Root-cause hypotheses
1. External side effect and workflow completion are persisted in different systems without a shared transaction.
2. Retry identity is based on ephemeral run/task IDs rather than semantic operation identity.
3. A timeout is treated as failure even when the remote operation may have completed.
4. Concurrent workers can race to execute the same logical effect.
5. Recovery code cannot distinguish `not executed` from `executed but acknowledgement lost`.
6. Verification focuses on final graph state rather than the count and identity of external effects.

## Improvement target
Introduce an application-owned durable side-effect ledger and execution protocol:

1. Derive a stable idempotency key from workflow identity + effect type + canonical semantic inputs.
2. Atomically claim the key in durable storage before invoking the external effect.
3. Reuse a completed result instead of calling the provider again.
4. Reject or defer concurrent claims.
5. Treat expired `in_progress` claims as **uncertain**, not automatically safe to retry.
6. Reconcile uncertain operations with provider state, provider idempotency lookup, or human approval before re-execution.
7. Record only non-secret result metadata required for deterministic resume.
8. Test crash points before call, after remote success, and before/after ledger completion.

## Success metrics
- Duplicate external effects in crash/retry test matrix: **0**.
- Completed-key replay provider calls: **0 additional calls**.
- Concurrent same-key executions: **at most 1 active executor**.
- Uncertain-state blind retries: **0**.
- Recovery paths with explicit evidence: **100%**.
- Ledger conflict/uncertain events observable with operation key hash, not sensitive payloads.

## Security and safety boundaries
- Never store credentials, authorization headers, or raw sensitive request payloads in the ledger.
- Hash canonical semantic input to derive fingerprints; store safe metadata separately.
- Destructive or financially consequential uncertain operations require provider reconciliation or explicit human approval before retry.
- Do not weaken provider authentication, authorization, or sandbox controls to improve retryability.

## Proposed engineering solution
`agent-durable-side-effect-replay-guard` supplies:
- a SQLite-backed deterministic claim/complete/reconcile CLI;
- policy for TTL, uncertainty, and high-risk effect classes;
- skills and rules for deriving stable semantic keys;
- specialized execution and verification subagents;
- bounded recovery workflows;
- pre-effect, post-effect, resume, and final-verification hooks;
- tests that simulate duplicate invocation, concurrency, and crash windows.

## Sources
1. LangGraph #8464, “Durable tool execution idempotency & retry middleware,” 2026-07-28: https://github.com/langchain-ai/langgraph/issues/8464
2. LangGraph #8039, `durability="sync"` persistence-order/recovery issue: https://github.com/langchain-ai/langgraph/issues/8039
3. LangGraph #7417, long tool calls re-executed from checkpoint: https://github.com/langchain-ai/langgraph/issues/7417
4. LangGraph #8393, duplicate PUSH child execution on parent retry: https://github.com/langchain-ai/langgraph/issues/8393
5. LangGraph Functional API docs — durable execution/idempotency: https://docs.langchain.com/oss/python/langgraph/functional-api
6. LangGraph Graph API docs — re-execution and idempotency: https://langchain-ai.github.io/langgraph/how-tos/state-reducers/
7. LangGraph interrupt guidance — side effects before interrupt must be idempotent: https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/breakpoints/
