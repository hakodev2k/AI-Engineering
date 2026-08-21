# Disaster Recovery Rules

## Purpose
Define Senior-level controls for restoring service after region, platform, or large-scale infrastructure failure.

## Scope
Applies to critical applications, cloud regions, clusters, shared infrastructure, and dependencies.

## MUST
- Critical services MUST define recovery strategy, dependency order, owners, and recovery objectives.
- Disaster-recovery procedures MUST be exercised periodically using realistic failure scenarios.
- Failover mechanisms MUST be validated before being relied upon in production.
- Recovery plans MUST include DNS, identity, secrets, data, networking, observability, and external dependencies when relevant.
- Major recovery changes MUST be reviewed for cross-service impact.

## MUST NOT
- MUST NOT claim disaster recovery readiness without exercise evidence.
- MUST NOT assume infrastructure recreation alone restores application correctness.
- MUST NOT perform irreversible failover actions without required approval.

## SHOULD
- Prefer automated, documented, and regularly tested recovery paths.
- Record gaps discovered during exercises and track remediation.

## Exceptions
Systems without full DR capability require explicit risk acceptance and documented business impact.

## Verification
Use recovery exercises, failover tests, runbook reviews, dependency checks, recovery timing, telemetry, and post-exercise action tracking.