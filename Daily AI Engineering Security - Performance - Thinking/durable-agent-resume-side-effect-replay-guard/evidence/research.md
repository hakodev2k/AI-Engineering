# Research — Durable Agent Resume Side-Effect Replay Guard

## Topic
Checkpointed recovery can replay completed side effects or restore inconsistent pending state.

## Category
Thinking

## Problem
A durable workflow checkpoint is not an exactly-once transaction boundary for external effects. An action can succeed after the last checkpoint and then be replayed on resume. Pending-request or snapshot restore bugs can compound the risk.

## Why it matters now
Microsoft Agent Framework is actively adding durable workflows in 2026 while recent reports expose replay and restore edge cases in production-like long-running agents.

## Affected users
Agent-platform builders, checkpointed workflow teams, HITL systems, hosted agents, and applications performing payments, deployments, repository writes, messages, or other non-idempotent actions.

## Current public evidence
### Observed evidence
1. Agent Framework #3938 (2026-02-14): after tool side effects complete, executor failure before the next checkpoint can make resume replay the completed tool calls: https://github.com/microsoft/agent-framework/issues/3938
2. Agent Framework #7618 (2026-08-11): checkpoint restore/pending-request deserialization produces request-ID mismatch: https://github.com/microsoft/agent-framework/issues/7618
3. Agent Framework #7683 (2026-08-16): checkpoint state is not fully isolated from live workflow state: https://github.com/microsoft/agent-framework/issues/7683
4. Agent Framework #7137 (2026-07-16): hosted workflow checkpoint restoration can fail after compute recreation: https://github.com/microsoft/agent-framework/issues/7137
5. Microsoft checkpoint docs updated 2026-08-10 describe checkpoints at superstep boundaries, resume/rehydration, durable stores, and topology/executor compatibility: https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints
6. Microsoft functional workflow sample demonstrates per-step checkpointing to avoid re-executing completed expensive work: https://github.com/microsoft/agent-framework/blob/main/python/samples/03-workflows/functional/steps_and_checkpointing.py

### Interpretation
Checkpoint persistence solves workflow-state durability, not atomicity with external systems. A transport/executor failure cannot distinguish “failed before action” from “action succeeded but acknowledgement/checkpoint was lost.”

## Existing approaches
Framework checkpoints, per-step checkpointing, durable storage, HITL persistence, API idempotency keys, generic retries, compensating transactions.

## Remaining limitations
Not every API supports idempotency; external systems and checkpoint stores lack a shared transaction; request identity can drift; snapshot/reference bugs can corrupt restore semantics.

## Root-cause analysis
1. Checkpoint boundaries differ from side-effect boundaries.
2. No shared transaction spans external systems and agent state.
3. Operation identity may be generated too late.
4. Retry logic mistakes executor failure for no-effect evidence.
5. Resume verification may be coupled to the implementer.
6. Lineage and pending-request integrity are not always validated first.

## Improvement opportunity
Persist a stable operation ID before consequential execution, maintain a ledger with external evidence, classify each operation, block ambiguous non-idempotent replay, reconcile idempotent in-flight actions, and validate checkpoint ancestry plus pending-request identity before resume.

## Relevant sources
- https://github.com/microsoft/agent-framework/issues/3938
- https://github.com/microsoft/agent-framework/issues/7618
- https://github.com/microsoft/agent-framework/issues/7683
- https://github.com/microsoft/agent-framework/issues/7137
- https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints
- https://github.com/microsoft/agent-framework/blob/main/python/samples/03-workflows/functional/steps_and_checkpointing.py
