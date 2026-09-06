# Research

## Topic
Agent Pre-Checkpoint Admission Ledger

## Category
Thinking

## Problem
A background or fire-and-forget agent run can be accepted by the caller but crash before the workflow runtime writes its first durable checkpoint. Recovery then has no state to resume and may have no durable record that the accepted run ever existed. This creates a silent-loss boundary: the system can neither resume the work nor reliably explain that it was lost.

## Why it matters now
A fresh LangGraph issue opened on 2026-08-30 provides a reproducible example in which a process dies before its first checkpoint, leaving zero durable checkpoints and `EmptyInputError` on recovery. The report explicitly identifies the missing durable acceptance boundary for fire-and-forget/background invocation. Separate 2026 LangGraph reports show persistence and crash/recovery correctness remain active engineering concerns, including checkpoint flush loss on non-graceful exit and requests for deterministic checkpoint resume contracts. LangGraph's own documentation states that without checkpointing a subgraph has no durable execution and must restart after a crash, reinforcing that recovery guarantees depend on actual persisted state rather than accepted invocation alone.

## Affected users
Agent-platform builders, background workflow operators, job queues, long-running agent systems, LangGraph users, orchestration frameworks, CI/automation systems, and services that acknowledge work before a durable workflow checkpoint exists.

## Current public evidence
### Observed evidence
1. LangGraph issue #8764, 2026-08-30: a process killed before the first durable checkpoint leaves no resumable checkpoint and no durable failure marker; the reporter proposes an acceptance ledger or an explicit documented contract.
2. LangGraph issue #8298, 2026-07-08: non-graceful process exit could lose checkpoint state in `langgraph dev` because checkpoint stores were not flushed as intended.
3. LangGraph issue #6818, 2026-02-15: users requested deterministic checkpoint-resume guarantees and crash/resume tests for durable agent workloads.
4. LangGraph documentation: stateless subgraphs without checkpointing cannot recover mid-run and must restart, demonstrating that durable execution is conditional on persisted checkpoints.

### Interpretation
A workflow's *admission* event and its *first workflow checkpoint* are different durability boundaries. If an API, queue, scheduler, or parent agent tells the caller a run is accepted before the workflow runtime has persisted resumable state, the host must separately persist an admission record and reconcile it with checkpoint/run state. Correctness requires observable states such as `accepted`, `checkpointed`, `completed`, `failed`, and `lost`, not an implicit assumption that accepted means recoverable.

## Existing approaches
Existing approaches include synchronous invocation, workflow checkpointers, durable task queues, write-ahead logs, job tables, retries, idempotency keys, and runtime-specific persistence settings such as synchronous checkpoint durability.

## Remaining limitations
- Workflow checkpointing cannot recover state that was never persisted.
- Caller-side acknowledgement may occur before the runtime's first durable checkpoint.
- A generic retry can duplicate work if the original run actually crossed an external side effect before its durable state was recorded.
- Runtime-level persistence may not expose a durable `accepted` or `lost` state for every invocation shape.
- Recovery logic often treats "no checkpoint" as "nothing to resume" rather than distinguishing never-started, lost-before-checkpoint, and already-completed cases.
- Operators may lack metrics for admission-to-first-checkpoint latency and orphaned accepted runs.

## Root-cause analysis
1. Admission and checkpoint durability are conflated.
2. Acknowledgement is emitted before a durable ownership record exists.
3. Recovery has no authoritative ledger of accepted run IDs and inputs/idempotency keys.
4. Reconciliation is not performed between admitted runs and runtime checkpoint/completion state.
5. Retries are attempted without classifying whether external side effects may have occurred.
6. No bounded timeout defines when an accepted-but-uncheckpointed run becomes `lost` and requires operator action.

## Improvement opportunity
Add a small external admission ledger that is durably written before caller acknowledgement. Require unique run and idempotency IDs, track the first checkpoint marker, and run a reconciler that classifies stale `accepted` records as `lost` rather than silently forgetting them. The ledger must not automatically retry potentially side-effecting work; recovery policy should distinguish safe restart, manual review, and stop conditions.

## Relevant sources
- LangGraph issue #8764, 2026-08-30: https://github.com/langchain-ai/langgraph/issues/8764
- LangGraph issue #8298, 2026-07-08: https://github.com/langchain-ai/langgraph/issues/8298
- LangGraph issue #6818, 2026-02-15: https://github.com/langchain-ai/langgraph/issues/6818
- LangGraph documentation, subgraph persistence/durable execution: https://docs.langchain.com/oss/javascript/langgraph/use-subgraphs
