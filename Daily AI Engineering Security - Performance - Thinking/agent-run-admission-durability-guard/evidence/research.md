# Research

## Topic
Agent Run Admission Durability Guard

## Category
Thinking

## Problem
A background agent run can be acknowledged to its caller before any durable run/checkpoint record exists. A crash in that admission window leaves restart recovery with nothing to resume and no reliable evidence that acknowledged work ever existed. Related agent systems also show restart-induced task loss when durable state and reconciliation are incomplete.

## Why it matters now
LangGraph issue #8764 was opened on 2026-08-30 with a minimal reproduction of process death before the first durable checkpoint. The reproduction reports zero durable checkpoints and a recovery failure because no input/checkpoint exists. OpenClaw has multiple 2026 reports of active and scheduled work being lost or requiring manual intervention after gateway restart. Current OpenClaw restart-recovery documentation now describes persisted task records and automatic recovery, showing that restart durability is an active engineering area rather than a theoretical concern.

## Affected users
Agent-platform builders, workflow/orchestration engineers, developers running fire-and-forget jobs, long-running coding-agent users, scheduled automation operators, and teams that expose asynchronous run-creation APIs.

## Current public evidence
### Observed evidence
1. LangGraph issue #8764, opened 2026-08-30, demonstrates a run dying before its first durable checkpoint. The report distinguishes this from later checkpoint races: no checkpoint remains, recovery has nothing to resume, and without an external acceptance ledger there is no durable record that the run was accepted.
2. OpenClaw issue #39922, opened 2026-03-08, reports an active task becoming silently idle after gateway restart and requiring manual user input to resume.
3. OpenClaw issue #62738, opened 2026-04-07, reports in-flight cron tasks being orphaned/lost during gateway restart, with no built-in resume/retry/alert mechanism in the reported version.
4. OpenClaw's current `docs/gateway/restart-recovery.md` says conversations, task records and queued work are persisted and interrupted work is detected and resumed after restart, providing a concrete example of the direction existing solutions are taking.
5. LangGraph issue #6818, opened 2026-02-15, requests deterministic checkpoint-resume guarantees and crash/resume tests for durable agent workloads.

### Interpretation
Checkpoint durability and admission durability are separate invariants. A system can offer durable execution after a checkpoint yet still lose an asynchronously acknowledged run before that first checkpoint. Operators need an explicit acceptance ledger and restart reconciliation contract rather than assuming graph/checkpoint durability covers the API acknowledgement boundary.

### Proposed solution
Persist a minimal admission record containing stable run identity and idempotency key before returning an external accepted/success acknowledgement. On process restart, reconcile every accepted non-terminal record: it must be known to have started, be terminal, or be queued for bounded recovery. Validate the ledger deterministically and test crash points around admission and first execution checkpoint.

## Existing approaches
- Durable graph/workflow checkpoints.
- Persistent task queues and job databases.
- Idempotency keys on asynchronous job creation.
- Restart recovery and orphan scanning.
- Graceful shutdown/draining.
- Watchdogs and lost-task alerts.
- Synchronous durability modes for checkpoints.

## Remaining limitations
- Checkpoint systems cannot recover a run that has no first durable checkpoint/admission record.
- An API acknowledgement can occur in a different component/transaction from persistence.
- Generic retry without idempotency may create duplicate runs or duplicate side effects.
- Graceful shutdown does not cover SIGKILL, process crash, host failure or power loss.
- A watchdog that only watches existing task records cannot see a run that was acknowledged but never durably recorded.
- Restart recovery needs a deterministic definition of which accepted records are orphaned and what bounded action is safe.

## Root-cause analysis
1. External acknowledgement semantics are not tied to a durable commit boundary.
2. Execution checkpoint identity is reused as admission identity even though the first checkpoint occurs later.
3. Idempotency is added to side effects but not necessarily to run creation/admission.
4. Recovery scans operate on runtime checkpoints only, omitting an acceptance ledger.
5. Crash/restart tests focus on mid-run replay rather than the pre-first-checkpoint window.
6. Failure recovery lacks explicit retry limits or escalation states.

## Improvement opportunity
A small durable admission contract can close the unobservable window without replacing existing checkpoint engines. It can be implemented in a relational row, queue record or durable KV entry, then validated with simple invariants and crash testing. The package makes acceptance, execution and recovery separately observable and gives operators measurable evidence instead of relying on inferred progress.

## Relevant sources
- LangGraph issue #8764, 2026-08-30: https://github.com/langchain-ai/langgraph/issues/8764
- LangGraph issue #6818, 2026-02-15: https://github.com/langchain-ai/langgraph/issues/6818
- LangGraph Python SDK run durability documentation/source: https://github.com/langchain-ai/langgraph/blob/main/libs/sdk-py/langgraph_sdk/_async/runs.py
- OpenClaw issue #39922, 2026-03-08: https://github.com/openclaw/openclaw/issues/39922
- OpenClaw issue #62738, 2026-04-07: https://github.com/openclaw/openclaw/issues/62738
- OpenClaw restart recovery documentation (current): https://github.com/openclaw/openclaw/blob/main/docs/gateway/restart-recovery.md
