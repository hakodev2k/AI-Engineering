# Reconciliation and Data Quality Rules

## Purpose
Detect silent loss, duplication, corruption, and divergence between source and derived state.

## Scope
Counts, checksums, key sampling, invariants, source-to-sink comparison, and drift detection.

## MUST
- Critical CDC pipelines MUST have a reconciliation strategy independent of connector health.
- Reconciliation MUST compare business-relevant state or invariants, not only message counts.
- Mismatches MUST be attributable to a bounded key/range or investigated before closure.
- Repair procedures MUST avoid overwriting newer correct state.
- Reconciliation evidence MUST be retained for high-impact migrations and incidents.

## MUST NOT
- MUST NOT treat equal row counts as proof of equality.
- MUST NOT silently auto-repair unexplained divergence in critical data.
- MUST NOT ignore persistent low-rate mismatches as noise.

## SHOULD
- Use deterministic checksums or sampled key comparisons where full comparison is expensive.
- Schedule periodic reconciliation for critical datasets.

## Exceptions
Sampling-only validation requires documented confidence bounds and risk acceptance.

## Verification
Inspect reconciliation jobs, mismatch reports, repair logs, invariants, and incident evidence.