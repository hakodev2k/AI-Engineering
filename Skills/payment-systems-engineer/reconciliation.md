# Payment Reconciliation

## Purpose
Detect and resolve differences between internal payment records and external processor, bank, or settlement truth.

## When to use
Use for daily reconciliation, incident recovery, provider migration, settlement validation, or unexplained balance differences.

## Inputs
Internal transactions/ledger, provider reports/APIs, bank statements, settlement files, currency/timezone rules.

## Context to inspect
Identifiers, statuses, amounts, fees, timestamps, adjustments, ingestion jobs, previous breaks and runbooks.

## Core knowledge
Reconciliation is an independent correctness control. Matching needs stable identifiers plus amount/currency/time evidence. Differences should be classified, aged, assigned, and resolved through auditable adjustments rather than silent mutation.

## Procedure
1. Define reconciliation population and cutoff.
2. Acquire external data with completeness checks.
3. Normalize identifiers, currency, precision, and timestamps.
4. Match deterministic IDs first.
5. Apply controlled secondary matching only where justified.
6. Classify missing, duplicate, amount, fee, status, and timing breaks.
7. Separate expected timing differences from true discrepancies.
8. Investigate material breaks using raw provider evidence.
9. Correct through normal domain/ledger mechanisms.
10. Record resolution reason and operator evidence.
11. Track break count, value, age, and recurrence.
12. Automate known safe classifications while preserving review for ambiguity.

## Decision points
Never auto-adjust merely to force totals to agree. Materiality thresholds can prioritize work but must not hide systematic defects.

## Common failure patterns
Reconciling only aggregate totals, timezone mismatches, unstable fuzzy matching, deleting breaks, and ignoring provider fees or reversals.

## Verification
Prove source completeness, matched/unmatched totals, deterministic reruns, auditable resolutions, and zero unexplained material variance.

## Expected output
A repeatable reconciliation process with classified exceptions, evidence, metrics, and safe remediation.

## Stop conditions
Escalate unexplained material money differences, incomplete source files, or adjustments requiring finance approval.