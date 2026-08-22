# Architecture Boundaries

## Purpose
Structure .NET backend systems around clear responsibilities and dependency direction so change remains localized as the system grows.

## When to use
New service/module design, monolith decomposition, legacy refactoring, dependency tangles, or architecture review.

## Inputs
Business capabilities, change patterns, domain complexity, integrations, team/operational constraints.

## Context to inspect
Project references, module coupling, domain/application/infrastructure responsibilities, shared libraries, transaction boundaries.

## Core knowledge
Architecture should protect high-value policy from volatile details. Boundaries need business or operational justification; Clean/Onion/Hexagonal patterns are tools, not goals.

## Procedure
1. Identify cohesive business capabilities.
2. Map dependencies and change reasons.
3. Keep domain/application policy independent of infrastructure where valuable.
4. Place interfaces at boundaries that need substitution or inversion.
5. Avoid generic abstraction layers with no independent reason to change.
6. Define ownership of data and transactions.
7. Expose narrow module contracts.
8. Enforce dependencies with project structure/tests where useful.

## Decision points
Use a modular monolith when one deployment/database is operationally simpler; split services only when independent scaling, ownership, reliability, or release boundaries justify distributed complexity.

## Common failure patterns
Layer-per-technology ceremony, shared-domain dumping ground, circular project references, premature microservices, abstractions mirroring frameworks.

## Verification
Dependency graph review, change-scenario walkthroughs, architecture tests, module-level tests.

## Expected output
Explicit boundaries aligned with business change and operational reality.

## Stop conditions
Escalate decomposition that changes ownership, deployment topology, or cross-team contracts.