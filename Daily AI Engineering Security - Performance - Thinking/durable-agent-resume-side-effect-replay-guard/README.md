# Durable Agent Resume Side-Effect Replay Guard

**Category:** Thinking  
**Run date:** 2026-08-27 (UTC+7)

## Problem
Checkpointed agents can resume after a crash yet repeat external side effects completed after the last durable checkpoint, or restore mismatched pending-request/checkpoint state.

## Evidence
See `evidence/research.md` for current Microsoft Agent Framework issue reports and checkpoint guidance.

## Existing approach
Checkpoint stores, per-step checkpointing, durable backends, HITL persistence, retries, provider idempotency keys, and compensating transactions.

## Existing limitations
Workflow state and external effects are separate durability domains. Executor failure does not prove the side effect failed. Restore paths can also mismatch request IDs or snapshot lineage.

## Proposed improvement
Persist stable operation IDs before consequential execution, record side-effect evidence in a ledger, validate checkpoint lineage/pending request IDs, and gate replay deterministically with independent verification.

## Architecture
- `evidence/research.md`
- `schemas/resume-event.schema.json`
- `scripts/resume_guard.py`
- `tests/test_resume_guard.py`
- `skills/durable-resume-analysis.md`
- `rules/resume-safety.md`
- `subagents/resume-verifier.md`
- `workflows/diagnose-resume-risk.md`
- `workflows/recover-and-verify.md`
- `hooks/pre-resume.md`

## Installation
Python 3.10+; standard library only.

## Configuration
Populate resume-event JSON from persisted checkpoint/ledger state. Stable operation IDs must exist before consequential execution.

## Usage
`python scripts/resume_guard.py --event resume-event.json`

## Workflow
Observe → baseline → diagnose replay window → hypothesis → guard → bounded recovery → independent verification.

## Metrics
Replay-risk blocks, duplicate-operation detections, pending-request failures, lineage failures, stable-ID coverage, recovery success rate.

## Verification
Run `python -m unittest tests/test_resume_guard.py`.

## Safety
The package performs no external side effects. Ambiguous non-idempotent operations fail closed and require human reconciliation.

## Failure handling
Maximum 2 diagnosis revisions and 1 recovery rerun. Stop on irreversible ambiguity, missing operation identity, broken lineage, request mismatch, or exhausted retries.

## Definition of Done
**Implemented:** operation IDs, ledger check, pre-resume hook, guard.  
**Measured:** resume-risk metrics captured.  
**Verified:** tests pass; zero completed consequential operations replayed; lineage/request integrity confirmed.

## Customization
Add operation classes and ledger adapters without weakening fail-closed behavior.
