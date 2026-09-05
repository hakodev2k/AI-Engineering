# Launch Readiness Assessment

## Purpose
Assess whether an AI service has sufficient reliability controls, observability, recovery procedures, and operational ownership for broad production use.

## When to use
Use before an initial launch, major architecture change, model/provider migration, or significant increase in traffic or autonomy.

## Inputs
Architecture, SLOs, runbooks, dashboards, deployment plan, rollback plan, dependency map, load tests, recovery evidence, safety and security review results.

## Preconditions
The target production topology and critical user journeys are defined well enough to evaluate.

## Context to inspect
Model routing, retrieval, tools, state, queues, capacity, configuration, observability, ownership, incident procedures, backups, and recovery mechanisms.

## Core knowledge
Readiness requires evidence that the service remains bounded and recoverable under expected failures. Successful functional testing alone does not demonstrate resilience to provider degradation, traffic variation, partial rollout, stale data, or operator mistakes.

## Procedure
1. Confirm critical journeys and their reliability objectives.
2. Review architecture and correlated failure domains.
3. Validate timeout, retry, capacity, and fallback behavior.
4. Confirm model, prompt, configuration, and index versioning.
5. Review load and resilience test evidence.
6. Check dashboards, alerts, traces, and ownership.
7. Validate rollback and degraded-mode procedures.
8. Review incident response responsibilities and runbooks.
9. Verify backup, rebuild, and recovery procedures.
10. Record unresolved reliability risks with owners and decision criteria.

## Decision points
Delay broad rollout when essential rollback, observability, recovery, or reliability controls are absent. Lower-risk gaps may proceed only with explicit ownership and documented risk acceptance.

## Common failure patterns
Checklist completion without evidence, missing quota assumptions, untested rollback, no degraded mode, alerts without owners, and treating provider SLAs as end-to-end guarantees.

## Verification
Every critical readiness claim is supported by test results, telemetry, configuration evidence, or exercised procedures.

## Expected output
A readiness decision, supporting evidence, residual risks, owners, and follow-up requirements.

## Stop conditions
Escalate when unresolved reliability risk exceeds the reviewer’s authority or requires cross-functional approval.