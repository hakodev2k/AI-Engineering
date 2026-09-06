# Network Change Safety

## Purpose
Plan and execute network changes with bounded blast radius, clear rollback, and evidence-based validation.

## When to use
Use for routing, firewall, DNS, load-balancer, address-space, peering, tunnel, or device changes that can affect production connectivity.

## Inputs
Proposed diff, topology, dependencies, maintenance constraints, rollback path, monitoring, and ownership contacts.

## Context to inspect
Inspect hidden dependencies, out-of-band access, redundancy state, current incidents, configuration drift, and whether rollback itself depends on the path being modified.

## Core knowledge
Network changes can cause instantaneous wide-area failure. Safe execution requires staged scope, independent management access, explicit success criteria, and rollback triggers.

## Procedure
1. Define intended behavior and affected paths.
2. Produce an exact configuration diff.
3. Identify blast radius and dependent services.
4. Validate redundancy and management access.
5. Establish pre-change baselines.
6. Define go/no-go and rollback thresholds.
7. Stage or canary the change where possible.
8. Execute one bounded step at a time.
9. Validate routing, reachability, latency, and errors after each step.
10. Record final state and deviations.

## Decision points
Prefer staged rollout over global change. Use maintenance windows when rollback or failover risk cannot be sufficiently bounded.

## Common failure patterns
No independent access path, batching unrelated changes, assuming configuration acceptance means traffic correctness, and rollback plans that require unavailable connectivity.

## Verification
Compare post-change telemetry with baseline, test critical paths, and confirm no unintended route or policy changes.

## Expected output
A safely executed change with validation evidence and auditable rollback criteria.

## Stop conditions
Stop immediately when preconditions differ from plan, redundancy is degraded, unexpected reachability changes appear, or rollback confidence is lost.