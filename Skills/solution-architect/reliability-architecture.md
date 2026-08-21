# Reliability Architecture

## Purpose
Design systems that meet availability and correctness objectives despite dependency, infrastructure, software, and operational failures.

## When to use
Use for business-critical systems, distributed systems, cloud deployments, or services with explicit SLOs.

## Inputs
Availability targets, dependencies, failure modes, topology, state model, traffic, support model.

## Preconditions
SLOs and critical user journeys are defined.

## Context to inspect
Dependency SLAs, zones/regions, stateful components, deployment process, scaling, queues, timeouts, retries, health checks, incident history.

## Core knowledge
Reliability comes from controlling failure domains, dependencies, recovery, load, and change. Retries can amplify failures. Redundancy without tested failover is not proven resilience.

## Procedure
1. Map critical request and workflow dependency chains.
2. Identify single points of failure.
3. Define failure domains and redundancy strategy.
4. Configure timeout budgets end to end.
5. Design bounded retries with jitter where safe.
6. Use circuit breaking, load shedding, buffering, or graceful degradation as appropriate.
7. Define health/readiness semantics.
8. Plan state replication and recovery.
9. Define deployment rollback and safe-change mechanisms.
10. Test dependency failure, overload, partial outage, and recovery.

## Decision points
Use multi-zone or multi-region only when business targets justify complexity and data-consistency consequences.

## Common failure patterns
Retry storms, false health checks, synchronous dependency chains, untested failover, hidden SPOFs, relying on autoscaling after saturation.

## Verification
Chaos/failure tests and recovery exercises demonstrate SLO-compatible behavior.

## Expected output
Reliability design tied to measurable failure scenarios.

## Stop conditions
Stop when required availability exceeds dependency or data-layer capabilities.