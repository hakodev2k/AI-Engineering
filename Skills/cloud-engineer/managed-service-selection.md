# Managed Service Selection

## Purpose
Choose cloud managed services using workload requirements, operational risk, cost, portability, and lifecycle constraints.

## When to use
Use before adopting databases, messaging, integration, analytics, compute, security, or platform services.

## Inputs
Functional needs, SLOs, scale, team capability, compliance, budget, integration and portability requirements.

## Context to inspect
Current architecture, provider service limits, regional availability, SLA, pricing, maintenance model, export/migration paths.

## Core knowledge
Managed services trade control and portability for reduced operational responsibility. Evaluate total lifecycle cost and failure behavior, not feature lists alone.

## Procedure
1. Define required capabilities and nonfunctional constraints.
2. Separate mandatory requirements from preferences.
3. Shortlist the simplest services that fit.
4. Review quotas, scaling, consistency, availability, and recovery behavior.
5. Assess identity, networking, encryption, and audit support.
6. Model expected cost including transfer and operations.
7. Evaluate lock-in and credible exit path.
8. Prototype uncertain high-risk assumptions.
9. Record trade-offs in an architecture decision.
10. Reassess when workload assumptions materially change.

## Decision points
Prefer managed services when provider operations reduce more risk than platform constraints introduce. Self-manage only when control or capability requirements are material.

## Common failure patterns
Feature-driven selection, ignoring quotas and egress, theoretical portability requirements, no restore test, and adopting services the team cannot operate.

## Verification
Prototype critical workload paths and validate limits, failure behavior, security, and cost assumptions.

## Expected output
An evidence-backed service decision with known constraints and exit considerations.

## Stop conditions
Escalate unresolved compliance, licensing, data residency, or unsupported critical requirements.