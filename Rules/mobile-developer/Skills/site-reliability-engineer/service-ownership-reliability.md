# Service Ownership and Reliability Accountability

## Purpose
Establish clear accountability for reliability decisions, operational work, and production outcomes across service boundaries.

## When to use
Use when services have unclear ownership, incidents bounce between teams, ownership changes, or platform/application responsibilities overlap.

## Inputs
Service catalog, team boundaries, architecture, dependency graph, on-call rotations, SLOs, escalation paths, and support agreements.

## Preconditions
Relevant teams and system boundaries must be identifiable even if ownership is currently disputed.

## Context to inspect
Repositories, deployment ownership, alerts, dashboards, infrastructure resources, data stores, APIs, vendor contracts, runbooks, and incident history.

## Core knowledge
Reliability work fails when operational ownership is implicit. Ownership includes not only code changes but SLOs, alerts, runbooks, capacity, dependencies, incident response, lifecycle decisions, and risk acceptance. Shared systems still require explicit responsibility boundaries.

## Procedure
1. Inventory production services and critical dependencies.
2. Assign a primary owning team for each service.
3. Define responsibilities for application, platform, data, and vendor layers.
4. Map alerts and escalation to owners.
5. Confirm each critical service has SLO and operational documentation ownership.
6. Define handoff requirements for ownership transfers.
7. Resolve ambiguous shared-component responsibilities through explicit operating agreements.
8. Add service metadata to the service catalog.
9. Review orphaned services and dependencies periodically.
10. Use incident routing failures as signals to improve ownership data.

## Decision points
Use one accountable owner with supporting teams rather than vague joint ownership. Separate platform responsibility from workload responsibility where failure remediation differs. Retire services that no longer have justified ownership.

## Common failure patterns
“No one owns production,” alerts routed to generic channels, ownership based only on repository authorship, stale service catalogs, and shared components with no final escalation owner.

## Verification
Sample critical services and confirm an engineer can identify the owner, SLO, on-call route, runbook, dependency contacts, and escalation path without tribal knowledge.

## Expected output
Accurate service ownership map, responsibility boundaries, escalation paths, and maintenance process.

## Stop conditions
Escalate when critical services have no accountable team, organizational boundaries prevent ownership assignment, or unresolved responsibility creates material production risk.