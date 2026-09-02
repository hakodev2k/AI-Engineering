# Disaster Recovery Rules

## Purpose
Ensure cloud systems can recover from regional, service, configuration, and data-loss disasters within approved business objectives.

## Scope
Applies to recovery time objectives, recovery point objectives, backup restoration, regional recovery, dependency recovery, and recovery governance.

## MUST
- Critical workloads MUST define approved RTO and RPO targets tied to business impact.
- Recovery architecture MUST identify data, configuration, secrets, identities, networking, dependencies, and operational procedures required to restore service.
- Recovery procedures MUST be exercised at a frequency proportional to business criticality and architectural change rate.
- Recovery copies and control paths MUST not share every failure domain with the primary workload.
- Any recovery design that depends on manual actions MUST document roles, prerequisites, ordering, and validation criteria.

## MUST NOT
- MUST NOT equate backup existence with recoverability.
- MUST NOT claim an RTO or RPO that has not been demonstrated or credibly validated.
- MUST NOT make irreversible production changes during a disaster without authorized incident or recovery leadership.

## SHOULD
- Automate repeatable recovery actions while retaining explicit safety gates for destructive steps.
- Validate recovery against complete business transactions, not infrastructure availability alone.

## Exceptions
Exceptions require business acceptance, quantified recovery exposure, compensating controls, owner, and review date.

## Verification
Inspect RTO/RPO records, restore tests, regional recovery exercises, runbooks, backup isolation, dependency recovery evidence, and post-exercise findings.