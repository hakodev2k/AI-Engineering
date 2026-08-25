# Network Change Risk Management

## Purpose
Plan and execute security-sensitive network changes with bounded blast radius, evidence, rollback, and stakeholder coordination.

## When to use
Use for firewall, routing, VPN, segmentation, DNS, proxy, or device-security changes that can affect production connectivity.

## Inputs
Change request, topology, dependencies, current configuration, proposed diff, maintenance window, rollback options.

## Context to inspect
HA state, recent incidents, dependent services, out-of-band access, monitoring, configuration backups, concurrent changes.

## Core knowledge
Network changes can create nonlinear outages through routing, state, DNS, NAT, and dependency interactions. Safe change requires preconditions and observable success criteria.

## Procedure
1. Define intended security and business outcome.
2. Review exact configuration diff.
3. Identify blast radius and hidden dependencies.
4. Establish pre-change health baseline.
5. Prepare tested rollback and out-of-band access.
6. Sequence changes to preserve recoverability.
7. Execute one bounded step at a time.
8. Validate technical and application outcomes.
9. Roll back on predefined failure criteria.
10. Record evidence and follow-up work.

## Decision points
Use staged rollout when scope is large or dependencies uncertain. Choose emergency change only when delay creates greater risk than reduced review time.

## Common failure patterns
No rollback, multiple unrelated changes, stale diagrams, testing only device health, ignoring asymmetric routing, changing both HA peers simultaneously.

## Verification
Compare before/after state, test representative flows, inspect telemetry, and obtain application-owner confirmation for critical services.

## Expected output
Approved change plan, risk analysis, rollback, execution record, verification evidence.

## Stop conditions
Stop if baseline health is already abnormal, rollback is unavailable, required approvers are missing, or unexpected impact exceeds threshold.