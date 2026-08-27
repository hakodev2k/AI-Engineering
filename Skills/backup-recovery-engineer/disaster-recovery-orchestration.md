# Disaster Recovery Orchestration

## Purpose
Coordinate multi-system recovery in the correct dependency order while controlling concurrency, state, retries, and cutover risk.

## When to use
Use for regional failures, full-environment rebuilds, complex application stacks, or repeated DR exercises.

## Inputs
Dependency graph, recovery objectives, infrastructure definitions, backup locations, runbooks, validation gates, and traffic-management controls.

## Context to inspect
Inspect identity, network, DNS, secrets, storage, databases, messaging, application tiers, observability, and external integrations.

## Core knowledge
Parallelism reduces RTO only for independent tasks. Incorrect concurrency can overload repositories or restore dependents before prerequisites. Orchestration must be resumable and observable.

## Procedure
1. Build a dependency DAG for recovery components.
2. Identify critical path and parallel-safe stages.
3. Define idempotent recovery actions where possible.
4. Establish state tracking and checkpoints.
5. Rate-limit high-I/O restore operations.
6. Add retries only for transient failures with bounded attempts.
7. Gate progression on health and data validation.
8. Separate environment recovery from traffic cutover.
9. Record timestamps, decisions, and operator interventions.
10. Exercise partial failure and resume behavior.

## Decision points
Automate deterministic infrastructure and restore steps; preserve explicit approval for data-point selection and production cutover. Parallelize based on dependency and resource capacity, not task count.

## Common failure patterns
Unbounded retries; hidden dependencies; concurrent restores saturating storage; automation that cannot resume; DNS cutover before data validation.

## Verification
Run an orchestrated exercise, inject failures, confirm safe resume, and compare measured critical path against RTO.

## Expected output
A controlled recovery workflow with observable state, gates, and bounded failure handling.

## Stop conditions
Stop when dependency state is unknown, validation gates fail, resource saturation threatens integrity, or cutover approval is absent.