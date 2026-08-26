# Agent Compaction Side-Effect Commit Fence

**Category:** Thinking

## Problem
Long-running agents can compact or rotate context while mutating tool calls are still in flight, losing confirmations, queued user state, or source history. The agent may then continue from a summary that cannot prove whether a side effect committed.

## Evidence
See `evidence/research.md`.

## Existing approach
Context compressors summarize history at token thresholds; runtimes may have generic interrupt/commit fences and operators may reconcile missing writes after the fact.

## Existing limitations
A context summary is not a transaction log. Generic turn cancellation does not prove a mutating tool reached a durable terminal state, and replay without idempotency can double-execute.

## Proposed improvement
Add an observable side-effect ledger and a deterministic compaction admission fence. Compaction is allowed only at a quiescent boundary where every mutating action is `confirmed`, `failed`, or explicitly `indeterminate` and escalated.

## Architecture
- `scripts/compaction_fence.py`
- `tests/test_compaction_fence.py`
- `schemas/side-effect-ledger.schema.json`
- `skills/side-effect-state-reconciliation.md`
- `rules/compaction-safety.md`
- `subagents/verification-agent.md`
- `workflows/diagnose-and-implement.md`
- `workflows/recovery.md`
- `hooks/pre-compaction.md`
- `evidence/research.md`

## Installation
Python 3.10+; standard library only.

## Usage
`python scripts/compaction_fence.py ledger.json`

## Metrics
In-flight mutations at compaction; indeterminate mutations; confirmation coverage; duplicate replay rate; lost-effect incidents; compaction deferrals.

## Verification
Run `python -m unittest tests/test_compaction_fence.py`.

## Safety
Never replay an indeterminate mutating action without an idempotency key or explicit human approval. Do not convert uncertainty into success.

## Failure handling
Detection: non-terminal or indeterminate ledger entries. Maximum automated retries: 1 validation rerun after state refresh. Fallback: defer compaction and reconcile external state. Escalation: any irreversible or non-idempotent indeterminate action.

## Definition of Done
**Implemented:** ledger and fence integrated at the compaction boundary.  
**Measured:** baseline and post-change counters captured.  
**Verified:** all fixtures pass, no in-flight mutation can cross compaction, indeterminate state is surfaced, and verifier is independent of the implementer.
