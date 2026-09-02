# Rollback and Recovery Rules

## Purpose
Ensure production changes can be safely reversed or recovered when rollback is impossible.

## Scope
Applies to application releases, infrastructure changes, configuration updates, and data/schema changes.

## MUST
- Every material change MUST define whether rollback is technically safe and, if not, define a tested forward-recovery plan.
- Rollback criteria MUST be based on observable service or business health signals.
- Data-affecting rollback procedures MUST account for writes made after deployment.
- Recovery steps MUST identify dependencies, order of operations, and verification checks.

## MUST NOT
- MUST NOT label a deployment reversible unless rollback has been technically validated for the relevant change class.
- MUST NOT roll back schema or state changes in a way that can corrupt or discard valid production data.
- MUST NOT delay rollback solely to preserve a release when user impact is worsening.

## SHOULD
- Exercise rollback and recovery procedures before high-risk releases.
- Keep rollback mechanics automated where safe and deterministic.

## Exceptions
Exceptions require explicit risk acceptance, documented recovery alternative, and accountable approval.

## Verification
Inspect rollback tests, deployment tooling, schema compatibility evidence, recovery runbooks, and incident or game-day records.
