# Data Recovery Assurance Rules

## Purpose
Ensure critical business data can be restored to an acceptable, verifiable state after disruption.

## Scope
Applies to operational data, configuration, records, reference data, recovery copies, replication, and data-dependent business processes.

## MUST
- Critical datasets MUST have recovery requirements traceable to business RPO, integrity, confidentiality, and retention needs.
- Recovery procedures MUST verify data completeness, consistency, usability, and authorization before business resumption.
- Restore testing MUST use evidence sufficient to prove recoverability, not only successful backup-job status.
- Dependencies between application recovery and data recovery MUST be documented and sequenced.
- Destructive restoration, failback, or data reconciliation affecting production MUST require authorized approval and a validated recovery plan.

## MUST NOT
- MUST NOT overwrite the only viable recovery copy during restoration.
- MUST NOT declare data recovered when integrity or reconciliation remains materially uncertain.
- MUST NOT weaken access controls or expose sensitive data solely to accelerate recovery.

## SHOULD
- Maintain isolated or immutable recovery copies when risk warrants it.
- Test representative large-scale and point-in-time recovery scenarios.

## Exceptions
Any unmet data recovery requirement requires documented impact, compensating controls, accountable approval, and remediation date.

## Verification
Review RPO traceability, backup and restore evidence, integrity checks, reconciliation results, access controls, test timings, and approval records.
