# Restore Testing

## Purpose
Prove recoverability with repeatable evidence before an incident.

## Scope
File, database, application, system, infrastructure, and disaster recovery tests.

## MUST
- Critical workloads MUST undergo scheduled restore tests at a frequency justified by risk and change rate.
- Tests MUST validate data usability, dependencies, permissions, configuration, and measured recovery time.
- Failures MUST produce tracked remediation with owner and due date.
- Test evidence MUST identify the restore point, procedure, environment, result, duration, and deviations.

## MUST NOT
- MUST NOT count a backup job as a restore test.
- MUST NOT repeatedly test only the easiest workload or newest restore point.
- MUST NOT declare recovery readiness while material test failures remain unassessed.

## SHOULD
- Tests SHOULD rotate scenarios, ages, storage tiers, regions, and personnel.
- Automation SHOULD be used for repeatable validation while retaining human review of business correctness.

## Exceptions
Deferred tests require documented risk, compensating evidence, approval, and a new deadline.

## Verification
Inspect test schedules, execution logs, recovered-system validation, timing evidence, defect records, and closure evidence.