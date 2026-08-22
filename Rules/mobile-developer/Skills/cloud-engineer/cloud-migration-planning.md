# Cloud Migration Planning

## Purpose
Plan and execute workload migrations with controlled business risk, dependency awareness, validation, and rollback.

## When to use
Use for data-center exits, provider moves, modernization, re-platforming, or major cloud relocations.

## Inputs
Application inventory, dependencies, business criticality, data size, downtime tolerance, compliance, target architecture.

## Context to inspect
Runtime, databases, integrations, DNS, identity, certificates, batch jobs, network flows, operational tooling, licensing.

## Core knowledge
Migration strategies include rehost, replatform, refactor, repurchase, retain, and retire. Choose per workload rather than forcing one pattern.

## Procedure
1. Inventory workloads and owners.
2. Discover technical and business dependencies.
3. Classify criticality and migration strategy.
4. Build target landing-zone prerequisites.
5. Define data migration and synchronization.
6. Create migration waves around dependencies.
7. Establish acceptance, performance, and security tests.
8. Rehearse cutover and rollback.
9. Execute with telemetry and decision checkpoints.
10. Decommission source only after verified stabilization.

## Decision points
Prefer rehost for speed when architecture change adds risk; modernize when clear operational or product value justifies it.

## Common failure patterns
Unknown dependencies, simultaneous modernization and migration without need, premature source shutdown, DNS surprises, and no rollback window.

## Verification
Confirm functional, performance, security, observability, backup, and business acceptance in the target environment.

## Expected output
A wave-based migration plan with measurable exit criteria.

## Stop conditions
Stop cutover when acceptance gates fail, data divergence is unexplained, or rollback capability is lost.