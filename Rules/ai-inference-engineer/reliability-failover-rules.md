# Reliability and Failover Rules

## Purpose
Keep inference available and correct during replica, accelerator, zone, dependency, or regional failures.

## Scope
Replication, failover, retries, circuit breaking, degraded modes, dependency failures, and recovery.

## MUST
- Critical serving paths MUST define availability and recovery objectives.
- Retry policies MUST be bounded and safe for request semantics.
- Failover targets MUST be contract-compatible and capacity-validated.
- Degraded modes MUST define whether requests are rejected, delayed, or served by an approved fallback.
- Recovery MUST be verified with representative inference requests before declaring service healthy.

## MUST NOT
- MUST NOT amplify outages with synchronized or unlimited retries.
- MUST NOT fail over to unvalidated model versions or hardware paths.
- MUST NOT bypass tenant isolation, authentication, or authorization during failover.

## SHOULD
- Use failure-domain diversity appropriate to service criticality.
- Practice controlled failover for high-severity services.

## Exceptions
Reduced redundancy requires documented duration, impact, mitigation, and approval.

## Verification
Review failover tests, retry configuration, recovery drills, capacity evidence, and incident telemetry.