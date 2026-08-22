# Team Topology and Ownership

## Purpose
Design clear team boundaries and ownership so systems can evolve without coordination overload, orphaned components, or ambiguous accountability.

## When to use
Use during organizational growth, reorganizations, platform creation, recurring cross-team blocking, or unclear service ownership.

## Inputs
System map, dependency graph, team responsibilities, product domains, incident ownership, delivery dependencies, and staffing constraints.

## Context to inspect
Inspect actual communication paths, shared components, operational ownership, deployment boundaries, domain boundaries, and recurring handoffs rather than relying only on org charts.

## Core knowledge
Team boundaries influence architecture. Stable ownership reduces cognitive load, but overly narrow ownership creates handoffs. Platform teams should provide usable products rather than become ticket queues.

## Procedure
1. Map products, services, domains, and operational responsibilities.
2. Identify high-friction dependencies and ambiguous ownership.
3. Estimate cognitive load for each team.
4. Align long-lived ownership with meaningful domain or platform boundaries.
5. Define primary owners and escalation paths.
6. Clarify interfaces between teams and expected service levels.
7. Separate enabling work from permanent dependency where possible.
8. Update code ownership, on-call ownership, and documentation.
9. Test the model against realistic delivery and incident scenarios.
10. Reassess after material product or architecture changes.

## Decision points
Choose stream-aligned ownership for coherent customer or business domains; use platform ownership when a shared capability can be productized with self-service interfaces. Avoid splitting tightly coupled components across teams without a deliberate migration plan.

## Common failure patterns
Ownership only on paper, shared-everything models, teams owning more systems than they can understand, platform teams becoming approval gates, and reorganizing without changing interfaces.

## Verification
Confirm every production component has an accountable team, critical dependencies have explicit interfaces, escalation routes work, and ownership matches operational reality.

## Expected output
An ownership model covering systems, responsibilities, interfaces, escalation paths, and identified topology changes.

## Stop conditions
Escalate when organizational authority is insufficient, critical responsibilities have no viable owner, or proposed boundaries conflict with regulatory separation requirements.