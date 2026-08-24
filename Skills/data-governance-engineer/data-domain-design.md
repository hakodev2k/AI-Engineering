# Data Domain Design

## Purpose
Define durable business-aligned data domains and boundaries so ownership, policy, quality, and interoperability can be governed coherently.

## When to use
Use during governance design, data-platform modernization, data-product programs, or ownership disputes. Avoid copying application boundaries blindly.

## Inputs
Business capabilities, conceptual models, source systems, data flows, organization structure, consumers, regulatory constraints.

## Context to inspect
Inspect authoritative sources, semantic overlaps, lifecycle dependencies, current ownership, integration patterns, and cross-domain entities.

## Core knowledge
A domain should represent a cohesive business responsibility with meaningful stewardship authority. Shared entities require explicit semantic and lifecycle contracts. Organizational charts are evidence, not the sole design rule.

## Procedure
1. Map business capabilities and critical information concepts.
2. Trace producers, transformations, and consumers.
3. Identify cohesive clusters of meaning and lifecycle responsibility.
4. Separate system boundaries from business-data boundaries.
5. Define domain purpose, scope, key entities, and exclusions.
6. Identify authoritative sources and shared concepts.
7. Assign accountable owner and stewardship capability.
8. Define cross-domain contracts and conflict-resolution rules.
9. Validate boundaries against real use cases and incidents.
10. Record rationale and revisit when business capabilities change.

## Decision points
Split a domain when ownership, lifecycle, or semantics diverge materially. Keep concepts together when separating them creates artificial synchronization. Treat genuinely shared reference data explicitly rather than hiding ambiguity.

## Common failure patterns
Domains equal databases, domains equal teams, overlapping ownership, orphan shared data, excessively broad domains, and boundaries chosen only for current technology.

## Verification
Walk representative data journeys across domains; verify every critical entity has an accountable domain, conflicts have a resolution path, and consumers understand authoritative sources.

## Expected output
A domain map with scope, ownership, key concepts, sources, dependencies, and contracts.

## Stop conditions
Escalate unresolved business ownership conflicts or domain choices that materially alter regulated responsibilities.