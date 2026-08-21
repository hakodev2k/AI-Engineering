# Checkpoint Recovery Atomicity Guard

**Category:** Thinking

## Problem
Checkpoint-based agents can resume from a combination of checkpoint state, pending writes, and external side effects that was never atomically committed. After a crash, replay may duplicate effects or skipping replay may lose them.

## Evidence
See `evidence/research.md`. Current LangGraph issues #8039 and #8234 document unenforced persistence ordering and remaining transaction-boundary gaps; #5672 shows cancellation can leave streamed progress ahead of durable state.

## Existing approach
Sync durability, ordering fixes, idempotency keys, and application-specific reconciliation reduce risk.

## Existing limitations
Ordering is not atomicity; not every side effect is idempotent; checkpoint state alone does not prove external commit status; distributed failures can leave mixed durable evidence.

## Proposed improvement
Introduce a recovery invariant based on a stable transition ID, correlated pending writes, authoritative side-effect receipts, a fail-closed consistency gate, and independent verification. Automatic replay is permitted only when non-commit is proven; automatic skip only when commit is proven.

## Architecture
- `skills/recovery-invariant-analysis.md` defines diagnosis and decisions.
- `rules/recovery-decision-rules.md` makes replay/skip criteria enforceable.
- `subagents/recovery-verifier.md` independently verifies recovery.
- `workflows/crash-recovery-verification.md` runs bounded diagnosis and crash testing.
- `hooks/pre-resume-consistency-check.md` blocks unsafe resume.
- `scripts/recovery_consistency_check.py` validates evidence deterministically.
- `tests/test_recovery_consistency_check.py` covers safe, unknown, and mismatch cases.

## Package tree
```text
README.md
evidence/research.md
skills/recovery-invariant-analysis.md
rules/recovery-decision-rules.md
subagents/recovery-verifier.md
workflows/crash-recovery-verification.md
hooks/pre-resume-consistency-check.md
scripts/recovery_consistency_check.py
tests/test_recovery_consistency_check.py
```

## Installation
Python 3.9+; no third-party dependency is required for the checker. Integrate transition IDs and receipt references into the host agent/checkpointer layer.

## Configuration
The host must define which side effects are replay-safe, which evidence source is authoritative for each effect, and which effects require human reconciliation when status is unknown.

## Usage
Create a recovery snapshot:

```json
{
  "checkpoint": {"transition_id": "t1"},
  "pending_writes": [{"transition_id": "t1"}],
  "side_effects": [
    {"transition_id": "t1", "state": "committed", "evidence_ref": "receipt:123"}
  ]
}
```

Run `python3 scripts/recovery_consistency_check.py recovery-snapshot.json` and `python3 -m unittest tests/test_recovery_consistency_check.py`.

## Workflow
Observe → baseline → diagnose → form an evidence-backed recovery hypothesis → improve correlation/transaction handling → force crash boundaries → measure again → independent verification. Retries are bounded as specified in the workflow.

## Metrics
Duplicate side effects, missing side effects, ambiguous recoveries, checkpoint/write mismatches, crash-fixture pass rate, reconciliation time, unsupported recovery decisions.

## Verification
A complete verification requires deterministic crash tests around checkpoint boundaries, exact expected side-effect cardinality, matching transition IDs, authoritative receipts, and an independent PASS from the Recovery Verifier.

## Safety
Diagnosis is read-only. Never replay a non-idempotent effect from absence of local evidence alone. Compensation or other irreversible actions require explicit human approval.

## Failure handling
Malformed evidence or inconsistency blocks resume. Transient read failures may retry twice. Persistent ambiguity becomes `block-for-reconciliation`; do not weaken the invariant to restore automation.

## Implemented / Measured / Verified
**Implemented**: invariant and gate are integrated. **Measured**: crash fixtures and before/after incidents are recorded. **Verified**: all fixtures preserve exactly-once expected effects and independent verification passes.

## Definition of Done
Evidence documented; baseline captured; transition correlation implemented; tests pass; forced-crash scenarios are measured; no duplicate/missing effects occur in covered cases; ambiguous cases block; independent verification passes; risks are documented; no blocking issue remains.

## Customization
Replace receipt references with provider-specific transaction IDs, outbox rows, message IDs, deployment IDs, or payment idempotency keys while preserving fail-closed decision semantics.