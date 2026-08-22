# Workflow: Audit → Rebuild → Verify

## Trigger
History migration, projection drift, resume showing incomplete history, or format conversion.

## Goal
Preserve canonical logical history with no silent loss, duplication, or ordering corruption.

## Inputs
Source and target/projection artifacts, compatibility policy, optional cursor metadata.

## Baseline
Capture source SHA-256, bytes, line count, parsed count, logical-item ledger, ordinal range, and backup location.

## Stages
1. **Observe** — reproduce symptom without modifying source.
2. **Measure baseline** — run fidelity scanner on source and current target.
3. **Diagnose** — classify omission, duplicate alias, decoder divergence, or cursor drift.
4. **Hypothesis** — choose smallest correction: transform fix or derived-projection rebuild.
5. **Implement** — fix transform; for derived data rebuild from source only after backup.
6. **Measure again** — rerun ledger/cursor comparison.
7. **Improved?** If no, allow one changed remediation attempt; never repeat identical action.
8. **Verify** — independent History Verifier reruns checks on immutable snapshots.

## Responsible agent
Implementation owner fixes/rebuilds; `subagents/history-verifier.md` performs final independent verification.

## Tools
`scripts/rollout_fidelity.py`, backup mechanism, read-only SQLite inspection, target-specific migration/rebuild command.

## Outputs
Baseline report, anomaly evidence, post-change report, independent verification result.

## Checkpoints
Backup before destructive work; source parse must be clean; target must exist before replacement; cursor must be valid before incremental continuation.

## Metrics
Omissions=0, unexplained duplicates=0, reorder violations=0, cursor mismatches=0, source canonical coverage=100%.

## Retry policy
Maximum two implementation attempts total. Second attempt must address a newly evidenced root cause.

## Stop conditions
Unrecoverable source error, absent backup, unexplained mismatch after second attempt, or verification BLOCK.

## Failure path
Keep canonical source unchanged, retain sanitized evidence, mark migration/resume repair blocked, and escalate for manual review.

## Definition of Done
Baseline captured; limitation identified; fix/rebuild completed; metrics meet thresholds; independent verifier passes; backup retained until post-resume smoke test succeeds.