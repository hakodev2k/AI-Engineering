# Dependency Reliability Rules

## Purpose
Control reliability risk introduced by internal and external dependencies.

## Scope
Applies to APIs, databases, queues, cloud services, third-party providers, DNS, identity systems, and shared platforms.

## MUST
- Critical dependencies MUST have documented failure behavior, ownership, and operational contact or escalation path.
- Services MUST define timeouts and fallback behavior for remote dependencies where applicable.
- Dependency reliability assumptions MUST be validated against observed behavior or contractual evidence.
- Critical third-party dependencies MUST have a plan for outages, quota exhaustion, and degraded operation.
- Dependency changes that materially alter reliability risk MUST be reviewed before rollout.

## MUST NOT
- MUST NOT assume a provider SLA guarantees application SLO attainment.
- MUST NOT create hidden critical dependencies without ownership and monitoring.
- MUST NOT retry dependency failures indefinitely or without considering amplification.

## SHOULD
- Prefer dependency isolation and bounded blast radius.
- Track major dependency incidents and recurring failure modes.

## Exceptions
A dependency without adequate redundancy or fallback requires explicit risk acceptance, mitigation, and review date.

## Verification
Review dependency maps, timeout/retry settings, vendor evidence, incident history, quotas, dashboards, and failure tests.