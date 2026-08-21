# Verification Report

## Verification model
This package separates **Implemented**, **Measured**, and **Verified** claims.

## Implemented
- Structured continuity policy with explicit critical fields.
- Authoritative task/active-turn identity.
- Goal, constraints, decisions, completed items, failed approaches, open items, blockers and evidence references modeled separately.
- SHA-256 canonical capsule checksum.
- Deterministic capsule validation.
- Deterministic pre/post-compaction comparison.
- Mutation receipt generation after successful continuity comparison.
- Bounded rehydrate workflow.
- Stale-turn and repeated-work rules.
- Independent Recovery Verifier role.
- Regression fixtures for goal loss, stale turn, dropped completed state, dropped failed approaches, checksum tampering and missing evidence.

## Static verification completed
The generated package was reviewed for these invariants:
1. The policy marks task identity, active turn, goal, constraints and work-state collections as critical.
2. `continuity_guard.py` removes only the checksum field when computing the canonical SHA-256 digest.
3. Validation checks required top-level fields and `active_turn.id`.
4. Policy checks require evidence for decisions, reasons for failed approaches, and artifact/evidence references for completed items.
5. Compare checks each configured critical dotted path and returns non-zero on mismatch.
6. Mutation receipts are emitted only after both capsules validate and critical comparison has no mismatch.
7. Workflows cap recovery attempts; rules prohibit unlimited retries and fail-open mutation.
8. No package file requires hidden chain-of-thought.
9. No secrets, credentials, or destructive default actions are embedded.

## Test suite provided
Run:

```bash
python -m unittest tests/test_continuity_guard.py -v
```

Expected tests:
- valid capsule passes;
- changed active goal is detected;
- stale active-turn ID is detected;
- loss of failed approaches is detected;
- loss of completed work is detected;
- checksum tampering fails validation;
- decision without evidence fails policy;
- completed item without artifact/evidence fails policy.

## Measured status
No claim is made that this package has already reduced token usage, latency, or production rework in a specific deployment. Those values depend on the target agent runtime and must be measured after integration.

The package does provide measurable counters and deterministic pass/fail conditions suitable for baseline/after comparison.

## Required production verification
Before enabling mutating actions behind this gate in production:
1. Execute the included tests in the target Python runtime.
2. Add runtime-specific compaction/resume fixtures.
3. Inject critical-field loss and prove mutation is blocked.
4. Inject stale historical user-turn replay and prove mutation is blocked.
5. Drop a known failed approach and prove recovery fails.
6. Preserve all critical fields and prove normal continuation succeeds.
7. Measure recovery latency and capsule size.
8. Verify concurrent checkpoint writes are serialized/atomic in the chosen store.

## Success criteria
- Critical-field loss false-pass rate: **0** in the fixture set.
- Stale-turn false-pass rate: **0**.
- Known-failed-approach loss false-pass rate: **0**.
- All intentionally valid fixtures pass.
- Capsule remains within `max_capsule_bytes`.
- No mutating tool executes while continuity is invalid/unknown.
- Recovery attempts never exceed policy.

## Failure handling
**Detection:** validator/compare non-zero exit, missing authoritative capsule, checksum mismatch, critical drift, stale turn, or exceeded retry budget.

**Evidence:** exact field mismatches and validation errors are emitted as JSON.

**Retry policy:** bounded by `max_rehydrate_attempts`; malformed local state may be repaired once before recompare.

**Fallback:** continue read-only diagnosis or restore the latest valid generation.

**Escalation:** operator/human review for unresolved critical mismatch or dangerous action.

**Stop condition:** mutation remains blocked until continuity becomes valid through evidence-backed recovery or explicit new authoritative task state.

## Definition of Done for an integration
- Evidence/problem analysis is documented.
- Policy is customized and versioned.
- Pre-compaction capture is wired.
- Post-compaction gate is wired before mutation.
- Stable active-turn IDs are supplied by the harness.
- Regression tests pass in the target runtime.
- Runtime fault injection proves critical drift blocks execution.
- Metrics are collected.
- Risks and approval boundaries are documented.
- No blocking continuity issue remains.
