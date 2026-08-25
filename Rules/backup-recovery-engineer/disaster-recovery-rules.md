# Disaster Recovery

## Purpose
Provide an executable recovery path for site, region, platform, or major service loss.

## Scope
Disaster declaration, recovery sites, dependencies, sequencing, failover, failback, and validation.

## MUST
- Disaster procedures MUST define activation criteria, authority, dependency order, communication, validation, and failback.
- Recovery infrastructure and bootstrap dependencies MUST be available independently of the failed environment where required by the scenario.
- Recovery sequencing MUST reflect identity, network, data, platform, and application dependencies.
- Exercises MUST measure actual outcomes against approved objectives.

## MUST NOT
- MUST NOT execute production disaster failover or destructive failback without authorized incident/change leadership.
- MUST NOT assume documentation is executable without exercises.
- MUST NOT restore downstream services before required authoritative dependencies are safe and consistent.

## SHOULD
- Runbooks SHOULD support degraded-service recovery when full restoration would exceed RTO.

## Exceptions
Emergency deviations require incident logging, accountable authorization, observed risk, and retrospective review.

## Verification
Review runbooks, dependency maps, exercise reports, measured timings, recovery-site readiness, failback tests, and unresolved gaps.