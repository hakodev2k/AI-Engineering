# Solution Architecture and Trade-offs

## Purpose
Make Senior-level Salesforce design decisions by balancing platform-native capabilities, custom code, integration boundaries, limits, security, maintainability, operability, and total lifecycle cost.

## When to use
Use for major features, cross-cloud/domain integrations, high-volume processes, architectural reviews, build-vs-configure decisions, and legacy redesign.

## Inputs
Business outcomes, NFRs, data volumes, personas, integration landscape, release constraints, compliance requirements, team capabilities, platform limits.

## Context to inspect
Current metadata/code, automation inventory, data ownership, sharing model, package boundaries, integrations, operational incidents, license/platform constraints, technical debt.

## Core knowledge
A good Salesforce architecture exploits platform capabilities without forcing every problem into the platform. Declarative automation, Apex, LWC, events, middleware, and external services each have different consistency, scaling, testability, and ownership characteristics. Senior decisions optimize the whole lifecycle rather than local implementation convenience.

## Procedure
1. State the business outcome and measurable NFRs.
2. Identify authoritative systems and transaction boundaries.
3. Quantify data volume, concurrency, latency, and integration load.
4. Map security and compliance boundaries.
5. Generate at least two viable options for consequential decisions.
6. Compare limits, failure modes, operational burden, delivery speed, coupling, and migration cost.
7. Prefer the simplest option that meets current and credible near-term requirements.
8. Record assumptions, rejected alternatives, and triggers for revisiting the decision.
9. Prototype or benchmark the highest-risk assumption.
10. Verify the selected architecture against failure, scale, upgrade, and support scenarios.

## Decision points
Prefer declarative solutions when complexity remains transparent and testable. Prefer Apex when logic, reuse, transaction control, or performance requires code. Prefer external services/middleware when workload, orchestration, compute, or data responsibilities do not fit Salesforce limits or ownership.

## Common failure patterns
Platform absolutism, overengineering, architecture by feature checklist, ignoring governor limits until implementation, unclear system-of-record ownership, synchronous distributed transactions, and decisions without operational evidence.

## Verification
Review against NFRs, security, representative volume, failure recovery, deployment, supportability, and cost. Validate risky assumptions with prototypes or measurements.

## Expected output
An evidence-backed architecture decision with explicit trade-offs, risks, boundaries, and revisit criteria.

## Stop conditions
Escalate when critical NFRs conflict, required scale cannot fit the platform, compliance ownership is unresolved, or an irreversible decision lacks sufficient evidence.