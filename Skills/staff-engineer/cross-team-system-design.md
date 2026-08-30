# Cross-Team System Design

## Purpose
Design systems whose responsibilities, interfaces, and operating model span multiple engineering teams while minimizing coordination cost and ambiguous ownership.

## When to use
Use for shared platforms, multi-domain workflows, company-wide services, or architectures that require coordinated delivery across teams.

## Inputs
Requirements, domain boundaries, team ownership map, interfaces, dependency constraints, NFRs, delivery timelines.

## Preconditions
Participating teams and accountable owners can be identified.

## Context to inspect
Existing service boundaries, APIs, event contracts, data ownership, deployment topology, team charters, roadmap dependencies, and incident ownership.

## Core knowledge
Cross-team architecture must optimize technical qualities and socio-technical boundaries. Conway's Law, ownership clarity, API stability, blast-radius control, and independent deployability matter as much as component design.

## Procedure
1. Map business capabilities and participating teams.
2. Identify stable ownership boundaries.
3. Define data and responsibility ownership explicitly.
4. Minimize synchronous cross-team dependencies.
5. Design versioned contracts and failure semantics.
6. Define rollout sequencing and compatibility periods.
7. Assign operational ownership and escalation paths.
8. Model partial failures and dependency degradation.
9. Review the design with each affected team.
10. Capture unresolved dependencies and integration milestones.

## Decision points
Prefer contract-based autonomy over shared internals. Use shared infrastructure only when centralization reduces total complexity. Use asynchronous integration when temporal decoupling is valuable and consistency requirements permit it.

## Common failure patterns
Shared databases without ownership, chat-based undocumented contracts, cyclic dependencies, centralized bottleneck teams, synchronized releases, and unclear incident responsibility.

## Verification
Validate independent deployment paths, contract tests, ownership mapping, failure handling, and rollout compatibility.

## Expected output
A cross-team design with boundaries, interfaces, ownership, failure behavior, rollout plan, and dependency map.

## Stop conditions
Stop when organizational ownership cannot support the proposed boundaries or critical interface requirements remain unresolved.