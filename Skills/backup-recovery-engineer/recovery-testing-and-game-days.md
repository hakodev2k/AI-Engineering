# Recovery Testing and Game Days

## Purpose
Prove recoverability through realistic exercises rather than relying on backup-job success indicators.

## When to use
Use periodically for critical systems, after material changes, before audits, and after recovery incidents.

## Inputs
Recovery objectives, runbooks, backup inventory, test environment, failure scenarios, validation criteria, and participants.

## Context to inspect
Inspect recent restore history, unresolved defects, architecture changes, production constraints, and representative data volumes.

## Core knowledge
A successful backup is not evidence of a successful recovery. Tests should cover data integrity, dependencies, operator readiness, timing, and decision processes.

## Procedure
1. Select a scenario based on risk and untested failure modes.
2. Define scope, safety boundaries, and success criteria.
3. Choose representative backup age and data volume.
4. Start timing from the agreed detection/decision point.
5. Execute recovery using normal runbooks and credentials.
6. Validate application and data invariants.
7. Record delays, manual work, defects, and objective misses.
8. Conduct a blameless review.
9. Assign remediation owners and deadlines.
10. Re-test material failures.

## Decision points
Use isolated exercises for destructive scenarios; controlled production failovers may be appropriate only with explicit risk approval. Rotate scenarios rather than repeatedly testing the easiest restore.

## Common failure patterns
Testing tiny datasets; pre-staging hidden shortcuts; stopping at database availability; not timing manual approvals; never retesting fixes.

## Verification
Evidence includes timestamps, restored data checks, service acceptance tests, observed RPO, observed RTO, and closed remediation items.

## Expected output
Measured recovery capability and prioritized resilience improvements.

## Stop conditions
Abort if exercise safety boundaries are breached, production risk becomes unacceptable, or recovered data could contaminate live systems.