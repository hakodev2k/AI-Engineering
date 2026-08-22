# Architecture Cost Review

## Purpose
Evaluate architecture decisions for cost efficiency while balancing scalability, reliability, security, maintainability, and delivery constraints.

## When to use
Use during design reviews, major migrations, scaling problems, expensive service growth, or before adopting premium managed services.

## Inputs
Architecture, traffic/data profile, SLOs, RPO/RTO, security requirements, cost model, growth forecast, operational constraints.

## Context to inspect
Inspect compute model, data stores, replication, messaging, network topology, caching, batch/stream choices, managed services, observability, and failure domains.

## Core knowledge
Architecture cost is a system property. Optimizing a component can shift cost or operational burden elsewhere. Include engineering and operational consequences where material.

## Procedure
1. Clarify business outcomes and nonfunctional constraints.
2. Map major architecture components to cost drivers.
3. Identify scale dimensions and expected growth.
4. Find architectural multipliers such as replication, fan-out, chatty calls, data copies, or always-on capacity.
5. Generate credible alternatives.
6. Model total and unit cost under realistic scenarios.
7. Compare reliability, security, complexity, lock-in, and migration effort.
8. Identify reversible experiments.
9. Record decision and cost assumptions.
10. Revisit when scale or pricing materially changes.

## Decision points
Prefer simpler architecture when economics are close. Pay premiums for managed services when reduced operational burden or risk justifies them. Do not remove redundancy required by SLOs merely to reduce spend.

## Common failure patterns
Component-level optimization, ignoring engineering labor, assuming future scale without evidence, premature multi-region deployment, and cost estimates without unit drivers.

## Verification
Cost model reconciles to current spend where applicable; alternatives satisfy mandatory NFRs; assumptions and trade-offs are reviewable.

## Expected output
An architecture cost assessment with drivers, alternatives, scenario economics, risks, and decision record.

## Stop conditions
Escalate when mandatory reliability/security requirements or strategic constraints are unresolved.