# Skill: Compaction Semantic Integrity Analysis

## Purpose
Verify that context compaction reduces context size without silently changing observable task state.

## Trigger
Run before and after automatic compaction, manual compression, session rotation, or agent handoff that replaces prior context with a summary.

## Inputs
- Durable pre-compaction state.
- Candidate compacted state.
- Evidence/event IDs for legitimate state transitions.
- `config/integrity-policy.json`.
- Optional raw transcript references for disputed fields.

## Preconditions
The workflow must expose critical state as structured data. Do not infer a passing result from prose similarity alone.

## Required context
Only observable task facts: goal, constraints, work-item lifecycle, approvals, verification obligations, language, and provenance. Hidden chain-of-thought is neither required nor permitted.

## Allowed tools
Read-only session/event retrieval, JSON parsing, hashing, diff tools, and `scripts/compaction_integrity_gate.py`.

## Constraints
- MUST NOT weaken invariants to force a pass.
- MUST NOT treat a prior summary as independent evidence for a disputed claim.
- MUST NOT mark new work as completed unless a durable event supports it.
- SHOULD keep the invariant ledger much smaller than the full transcript.

## Procedure
1. Capture the pre-compaction structured state from durable sources.
2. Normalize sets and stable identifiers; retain provenance IDs for approvals and work-item transitions.
3. Run compaction using the platform's normal mechanism.
4. Materialize the post-compaction structured state.
5. Run the deterministic integrity gate.
6. For every finding, classify it as missing, unsupported addition, illegal transition, immutable-field mutation, or approval/provenance mismatch.
7. If the gate fails, retry compaction at most the policy limit using the original pre-compaction snapshot, never the failed compacted output as the sole source.
8. If retries fail, preserve the pre-compaction snapshot and stop autonomous continuation.

## Decision points
- **Pass:** all required invariants preserved and any allowed transition has evidence.
- **Recover:** first/second failure with original evidence still available.
- **Stop:** retry budget exhausted, provenance unavailable, or critical state cannot be reconstructed.

## Expected output
A machine-readable gate result plus a short verification record containing changed fields, evidence IDs, retry count, and final status.

## Metrics
Critical-field preservation rate, unsupported additions, illegal lifecycle regressions, approval mismatches, retry count, and compaction-induced task regression count.

## Verification
A passing gate plus regression tests covering fabricated completion, dropped pending work, approval mutation, goal mutation, and benign compaction.

## Failure handling
Preserve the last verified state, attach the failed diff, and escalate for human review when critical state cannot be reconciled.

## Stop conditions
Stop after `max_recovery_retries`, on missing durable evidence, or on any unresolved task/approval identity conflict.