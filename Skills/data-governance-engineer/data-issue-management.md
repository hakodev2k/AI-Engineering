# Data Issue Management

## Purpose
Run a disciplined workflow for triaging, containing, resolving, and learning from material data issues.

## When to use
Use for quality defects, semantic disputes, ownership gaps, policy violations, broken lineage, or repeated consumer complaints.

## Inputs
Issue report, affected assets, logs, quality results, lineage, consumers, business impact, ownership, prior incidents.

## Context to inspect
Inspect scope, onset, source changes, downstream propagation, controls, workarounds, and similar historical issues.

## Core knowledge
Separate symptom correction from root-cause remediation. Severity should reflect business impact, regulatory exposure, affected consumers, duration, and recoverability. Governance issues need accountable ownership and closure evidence.

## Procedure
1. Validate the issue and capture evidence.
2. Assess severity and affected consumers/processes.
3. Contain propagation where appropriate.
4. Assign accountable resolver and stakeholders.
5. Trace lineage and recent changes.
6. Form and test root-cause hypotheses.
7. Correct affected data safely if required.
8. Fix the originating process/control.
9. Add regression detection or preventive controls.
10. Communicate resolution and residual impact.
11. Verify recovery and close with evidence.
12. Analyze recurring themes for systemic remediation.

## Decision points
Contain immediately when ongoing propagation increases harm. Reprocess/correct historical data only after validating downstream consequences and audit requirements.

## Common failure patterns
Closing after manual cleanup, severity based on row count alone, unclear ownership, endless reassignment, no consumer notification, and no regression control.

## Verification
Reproduce the original failure where safe, confirm root cause is removed, validate corrected outputs, and monitor for recurrence.

## Expected output
Issue record with severity, impact, root cause, remediation, evidence, communications, and prevention actions.

## Stop conditions
Escalate suspected security/privacy incidents, regulated-reporting impact, destructive correction requirements, or unresolved ownership.