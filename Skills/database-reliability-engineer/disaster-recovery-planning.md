# Disaster Recovery Planning

## Purpose
Prepare databases and teams to recover from site, region, account, or widespread infrastructure failure.

## When to use
Use for business-critical data stores and whenever topology, recovery objectives, or regulatory obligations change.

## Inputs
RPO/RTO, dependency map, regions, backup strategy, replication model, DNS/routing, secrets, and staffing constraints.

## Context to inspect
Cross-region copies, infrastructure definitions, access paths, key management, application dependencies, runbooks, and communication channels.

## Core knowledge
DR must recover the service dependency chain, not only database bytes. Plans require independent control planes, credentials, capacity, and practiced decisions.

## Procedure
1. Define disaster scenarios and declaration authority.
2. Map required dependencies and recovery order.
3. Establish secondary data and infrastructure.
4. Define promotion, routing, and application recovery steps.
5. Protect credentials and keys needed during disaster.
6. Specify reconciliation and failback procedures.
7. Run tabletop exercises.
8. Execute controlled DR drills.
9. Measure RPO/RTO and capture gaps.
10. Update runbooks after every exercise.

## Decision points
Choose active-active only when complexity is justified. Prefer simpler warm standby when recovery objectives allow it.

## Common failure patterns
Paper-only DR, missing secrets, insufficient standby capacity, untested DNS changes, unclear authority, and no failback plan.

## Verification
Complete a drill from declaration through validated application operation and record measured recovery objectives.

## Expected output
A tested DR plan, dependency sequence, decision matrix, runbook, and drill evidence.

## Stop conditions
Escalate when recovery would exceed approved objectives, require destructive reconciliation, or depend on inaccessible control planes.