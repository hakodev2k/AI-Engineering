# Workflow Architecture and Boundaries

## Purpose
Design workflow boundaries, responsibilities, and execution topology so automation remains understandable, testable, recoverable, and independently changeable.

## When to use
Use when a workflow spans multiple systems, contains long-running steps, is growing beyond a simple sequence, or is being decomposed from a monolithic automation.

## Inputs
Process map, integration inventory, SLAs, transaction volume, ownership model, security constraints, failure modes, and platform capabilities.

## Preconditions
Major side effects, systems of record, and business ownership must be known.

## Context to inspect
Inspect current workflows, duplicated logic, shared credentials, coupling between systems, deployment boundaries, data stores, queues, schedules, and operational runbooks.

## Core knowledge
Workflow architecture should separate orchestration from domain decisions and adapters. Boundaries should follow ownership, failure isolation, transaction limits, change cadence, and security zones rather than arbitrary file size.

## Procedure
1. Identify the workflow's business responsibility and invariants.
2. Mark external systems and side-effect boundaries.
3. Separate pure transformations from I/O and orchestration.
4. Define subworkflow boundaries around cohesive responsibilities.
5. Decide which state must persist across retries or restarts.
6. Define contracts between workflow components.
7. Establish failure, timeout, and compensation boundaries.
8. Minimize shared mutable state and hidden dependencies.
9. Define ownership and deployment responsibility for each boundary.
10. Review observability and access-control implications.
11. Validate architecture against normal, partial-failure, and replay scenarios.

## Decision points
Use a single workflow for tightly coupled, short-lived steps with one owner. Split workflows when ownership, retry policy, security boundary, scaling, or release cadence differs. Prefer explicit contracts over shared internal state.

## Common failure patterns
Giant workflows, circular subworkflow calls, duplicated business rules, implicit state in platform variables, hidden cross-workflow dependencies, and coupling orchestration directly to vendor-specific nodes.

## Verification
Trace representative transactions through architecture diagrams and confirm state, ownership, retries, and side effects are unambiguous at every boundary.

## Expected output
A workflow architecture with clear responsibilities, component contracts, persisted state, failure boundaries, ownership, and operational implications.

## Stop conditions
Stop when system ownership is unresolved, transaction requirements contradict proposed boundaries, or the platform cannot provide required state durability or security isolation.