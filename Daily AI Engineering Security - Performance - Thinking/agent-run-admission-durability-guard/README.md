# Agent Run Admission Durability Guard

**Category:** Thinking  
**Run date:** 2026-09-06 (UTC+7)

## Problem
Background and fire-and-forget agent runs can be acknowledged as accepted before the runtime has created any durable checkpoint or admission record. If the process dies in that window, the caller believes work exists while restart recovery has no durable evidence that the run was ever admitted. Long-running agent systems also continue to report restart-related task loss and manual-resume failure modes.

## Evidence
LangGraph issue #8764, opened 2026-08-30, reproduces a crash before the first durable checkpoint: zero checkpoints remain and recovery has nothing to resume. OpenClaw issue #39922 reports active work silently stopping after gateway restart, while issue #62738 reports in-flight cron tasks becoming lost on restart. Current OpenClaw restart-recovery documentation demonstrates the direction of the existing solution: persist task/run state and reconcile interrupted work after restart. See `evidence/research.md`.

## Existing approach
Checkpointing, durable execution, task queues, idempotency keys, restart recovery, graceful shutdown and watchdogs are established approaches. They work well once a durable run/task record exists.

## Existing limitations
A checkpoint can only recover state that was persisted. There is a distinct admission gap before the first checkpoint: an external API or dispatcher can return success while the runtime still lacks a durable run record. Generic retry can then either lose the accepted run or duplicate it.

## Proposed improvement
Create a durable admission contract separate from execution checkpoints. A run MUST receive a stable `run_id` and `idempotency_key`, persist an admission record before an external acceptance acknowledgement, and be reconciled after restart until it is started, terminal, or explicitly queued for bounded recovery.

## Architecture
The package combines an admission audit skill, enforceable durability rules, an independent recovery verifier, a bounded admit/execute/reconcile workflow, a pre-ack hook contract, and a dependency-free Python ledger validator with regression tests.

## Package tree
```
README.md
evidence/research.md
skills/run-admission-audit.md
rules/durable-admission-contract.md
subagents/recovery-verifier.md
workflows/admit-execute-reconcile.md
hooks/pre-ack-durability.md
scripts/admission_guard.py
tests/test_admission_guard.py
```

## Installation
Python 3.10+; standard library only.

## Configuration
Provide a JSON array of run records. Each record contains `run_id`, `idempotency_key`, `admission_persisted`, `acceptance_acknowledged`, `execution_started`, `terminal_state`, `recovery_enqueued`, and `recovery_attempts`.

## Usage
```bash
python scripts/admission_guard.py ledger.json
python -m unittest tests/test_admission_guard.py
```

## Workflow
Use `workflows/admit-execute-reconcile.md`: observe current acknowledgement semantics, measure the admission gap, establish an idempotent durable admission record, acknowledge only after commit, execute/checkpoint, reconcile after restart, and independently verify recovery behavior.

## Metrics
- 0 `ack_before_durable_admission` violations.
- 0 accepted non-terminal runs left unreconciled after restart scan.
- 100% accepted runs have unique stable run IDs and idempotency keys.
- Duplicate admission count = 0.
- Recovery attempts remain within the configured maximum of 2.
- Crash/restart test demonstrates every accepted run becomes started, terminal, or recovery-enqueued.

## Verification
**Implemented:** admission contract, validator, workflow, hook, independent review role and tests exist.  
**Measured:** validator emits deterministic per-run violations and exit codes.  
**Verified:** completion requires positive fixtures, failure fixtures and a restart/reconciliation exercise against the host runtime.

## Safety
Recovery MUST NOT blindly replay irreversible side effects. Dangerous or irreversible actions require explicit human approval and an idempotency strategy. The package records operational state only and never requests hidden chain-of-thought.

## Failure handling
Detection is based on persisted ledger invariants. Preserve evidence, retry recovery at most twice, then mark/escalate the run rather than looping indefinitely. If admission durability cannot be established, stop accepting fire-and-forget work.

## Definition of Done
Public evidence documented; current acknowledgement boundary measured; durable admission precedes acknowledgement; duplicate keys are rejected; restart reconciliation detects orphaned accepted runs; bounded recovery is proven; tests pass; independent verification is recorded; no blocking durability gap remains.

## Customization
Adapt field names to a queue, database or orchestration platform, but preserve the semantic invariants: persist-before-ack, stable identity, idempotency, restart reconciliation, bounded recovery and explicit terminal state.