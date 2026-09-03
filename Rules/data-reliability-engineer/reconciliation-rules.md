# Reconciliation Rules

## Purpose
Detect silent divergence between authoritative sources and derived or replicated data.

## Scope
Source-to-target comparisons, balances, counts, aggregates, CDC, replicas, exports, and restored data.

## MUST
- Define reconciliation controls for critical datasets where silent divergence is plausible.
- Compare semantically meaningful totals, keys, and aggregates rather than relying on file presence alone.
- Investigate material mismatches before certifying data as correct.
- Record reconciliation scope, time range, tolerances, and unresolved differences.

## MUST NOT
- Treat matching row counts as proof that values are correct.
- Ignore unexplained reconciliation gaps because they fall outside pipeline error logs.
- Use arbitrary tolerances without business or technical justification.

## SHOULD
- Automate recurring reconciliation for high-impact flows.
- Reconcile after migrations, backfills, restores, and major pipeline changes.

## Exceptions
Approximate reconciliation requires documented tolerance logic, evidence, and owner acceptance.

## Verification
Inspect reconciliation queries, source and target snapshots, mismatch samples, tolerance definitions, and remediation records.