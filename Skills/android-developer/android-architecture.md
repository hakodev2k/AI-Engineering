# Android Architecture

## Purpose
Design maintainable Android application boundaries that keep UI, domain logic, data access, platform APIs, and asynchronous work explicit and testable.

## When to use
Use for a new app, major feature, modularization effort, or architecture review. Do not add layers mechanically when a small feature does not benefit from them.

## Inputs
Requirements, module graph, navigation, data sources, lifecycle constraints, offline needs, performance targets, team conventions.

## Preconditions
Inspect the current project before choosing patterns or libraries.

## Context to inspect
Gradle modules, dependency direction, ViewModels, repositories, use cases, data models, coroutine scopes, navigation, DI, persistence, and platform integrations.

## Core knowledge
Good Android architecture separates volatile framework concerns from business policy, gives state a clear owner, respects lifecycle and process death, and avoids hidden cross-module coupling.

## Procedure
1. Identify user journeys and business invariants.
2. Map UI, domain, data, and platform responsibilities.
3. Define module and package boundaries around cohesive capabilities.
4. Keep dependency direction explicit and acyclic.
5. Choose state owners and lifecycle scopes.
6. Define data contracts and error models.
7. Decide where mapping between DTO, entity, domain, and UI models occurs.
8. Define navigation and cross-feature communication.
9. Add test seams at meaningful boundaries.
10. Validate build times, dependency graph, and representative feature changes.

## Decision points
Use cases are valuable when business workflows are non-trivial or reused; direct repository access may be simpler for thin CRUD screens. Split modules when ownership, build isolation, reuse, or encapsulation justify the cost.

## Common failure patterns
God modules, circular dependencies, framework types leaking everywhere, duplicated state, mutable singleton state, excessive abstractions, and repositories that mix unrelated responsibilities.

## Verification
A design is implemented when dependency boundaries exist; it is verified when tests can isolate key business behavior, navigation works through lifecycle changes, and representative changes stay localized.

## Expected output
Architecture decision, module responsibilities, dependency rules, state ownership, interface contracts, and identified risks.

## Stop conditions
Escalate when required boundaries conflict with existing public APIs, migration risk is high, or critical lifecycle/process-death behavior is unknown.