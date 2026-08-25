# Recovery Validation

## Purpose
Define evidence required before recovered data or services are accepted as usable.

## Scope
Technical validation, business validation, reconciliation, data-loss assessment, and service handoff.

## MUST
- Every recovery procedure MUST define objective acceptance criteria appropriate to the workload.
- Validation MUST check data integrity, application behavior, security controls, required dependencies, and expected recovery point where applicable.
- Actual data loss or uncertainty MUST be quantified or bounded and communicated to accountable owners.
- Business-critical recovery MUST include owner or delegated acceptance before normal operation resumes when feasible.

## MUST NOT
- MUST NOT declare recovery complete because a VM, database, or filesystem merely starts.
- MUST NOT hide reconciliation errors or unexplained data divergence.
- MUST NOT discard pre-recovery evidence until acceptance and rollback needs are resolved.

## SHOULD
- Validation SHOULD be automated for deterministic checks and supplemented by domain-specific business checks.

## Exceptions
Emergency service restoration with incomplete validation requires explicit incident authority, known-risk record, monitoring, and follow-up validation.

## Verification
Inspect acceptance criteria, automated checks, reconciliation reports, data-loss estimates, owner sign-off, and post-recovery monitoring.