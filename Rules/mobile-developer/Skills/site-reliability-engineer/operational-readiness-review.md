# Operational Readiness Review

## Purpose
Determine whether a service is safe to operate in production before launch or major architectural change.

## When to use
Use before production launch, major migration, ownership transfer, new critical dependency, or material traffic increase.

## Inputs
Architecture, SLOs, deployment model, dashboards, alerts, runbooks, capacity evidence, dependency map, security controls, backup/restore, and incident ownership.

## Preconditions
The service must be sufficiently implemented that operational behavior can be tested rather than inferred only from design documents.

## Context to inspect
Health checks, startup/shutdown behavior, deployment rollback, autoscaling, quotas, observability, paging, runbooks, failover, data durability, secrets, access, dependency failure behavior, and support ownership.

## Core knowledge
Production readiness is evidence that a service can be detected, diagnosed, mitigated, recovered, and safely changed. A checklist is useful only when items represent real failure risks and contain proof.

## Procedure
1. Identify critical user journeys and reliability objectives.
2. Verify service ownership and on-call coverage.
3. Confirm SLOs and user-centered telemetry exist.
4. Validate alert routing and runbook quality.
5. Review capacity, scaling, and dependency quotas.
6. Test rollback and safe deployment controls.
7. Review dependency timeouts, retries, and degradation.
8. Verify data backup, restore, and integrity controls.
9. Confirm security and secret-management requirements.
10. Exercise representative failure and recovery scenarios.
11. Record unresolved risks with explicit owners and launch criteria.
12. Approve readiness only when blocking risks are resolved or formally accepted.

## Decision points
Block launch for risks that can cause severe impact without detection or recovery. Accept lower risks only with named ownership, mitigation, and review date. Avoid adding requirements unrelated to the service’s actual failure modes.

## Common failure patterns
Checklist-only approval, missing rollback tests, no on-call owner, infrastructure metrics without user signals, undocumented dependencies, and assuming cloud-managed services remove recovery responsibilities.

## Verification
Review concrete evidence: test results, dashboards, alert delivery, rollback execution, restore exercises, capacity results, and owned risk records.

## Expected output
Readiness assessment, blocking issues, accepted risks, evidence links, and clear operational ownership.

## Stop conditions
Do not approve when critical failure modes are unobservable, recovery is untested, ownership is missing, or high-impact risks lack authorized acceptance.