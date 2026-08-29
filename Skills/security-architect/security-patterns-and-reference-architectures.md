# Security Patterns and Reference Architectures

## Purpose
Create reusable security patterns that help delivery teams make consistent, reviewable design decisions without re-solving common problems.

## When to use
Use when many teams repeatedly design similar authentication, integration, cloud, data, or deployment capabilities.

## Inputs
Common system archetypes, security standards, incident lessons, platform capabilities, threat models, regulatory constraints, operational feedback.

## Preconditions
Recurring architecture problems and responsible platform or security owners can be identified.

## Context to inspect
Existing reference architectures, engineering standards, platform roadmaps, exceptions, review findings, adoption metrics, and implementation pain points.

## Core knowledge
A useful pattern defines context, forces, recommended design, alternatives, constraints, verification, and ownership. Patterns should reduce cognitive load while preserving room for justified exceptions.

## Procedure
1. Identify a recurring security design problem with meaningful risk.
2. Gather successful and failed implementations.
3. Define applicability boundaries and assumptions.
4. Specify the recommended architecture and mandatory controls.
5. Document alternatives and trade-offs.
6. Include operational, performance, availability, and cost implications.
7. Provide verification criteria and example evidence.
8. Define exception and escalation paths.
9. Pilot with representative teams.
10. Measure adoption and revise based on incidents and feedback.

## Decision points
Create a reference pattern only when repetition justifies standardization. Prefer platform-enforced patterns for high-risk controls and guidance-only patterns where context varies significantly.

## Common failure patterns
Overly generic diagrams, product-specific mandates without rationale, no exception path, stale patterns, and standards that cannot be verified.

## Verification
Validate the pattern against several representative architectures and confirm teams can apply it without hidden assumptions.

## Expected output
A reusable reference architecture with scope, controls, trade-offs, evidence requirements, and lifecycle ownership.

## Stop conditions
Stop when implementations vary too widely for one pattern, ownership is absent, or the pattern depends on unavailable platform capabilities.