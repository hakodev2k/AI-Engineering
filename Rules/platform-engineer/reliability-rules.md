# Platform Reliability Rules

## Purpose
Ensure platform services meet declared reliability expectations and fail predictably.

## Scope
Applies to platform control planes, shared services, provisioning APIs, automation, and critical dependencies.

## MUST
- Critical platform services MUST define service objectives or equivalent reliability expectations.
- Failure modes and dependency assumptions MUST be documented for critical paths.
- Platform changes MUST include rollback or forward-fix strategy proportional to risk.
- Reliability incidents MUST produce evidence-driven follow-up actions.

## MUST NOT
- MUST NOT make availability claims without telemetry.
- MUST NOT create hidden single points of failure in critical platform paths without documented acceptance.
- MUST NOT suppress alerts to conceal recurring failures.

## SHOULD
- Prefer graceful degradation for noncritical platform features.
- Test dependency outage and control-plane failure scenarios.

## Exceptions
Lower reliability tiers are acceptable when explicitly documented and suitable for intended workloads.

## Verification
Use SLO metrics, synthetic tests, failure injection, dependency health checks, incident data, and recovery exercises.