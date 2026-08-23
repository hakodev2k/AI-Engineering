# iOS App Architecture

## Purpose
Structure an iOS application so UI, domain behavior, data access, platform services, and composition remain independently testable and changeable.

## When to use
Use for new applications, major features, dependency tangles, or architecture reviews.

## Inputs
Product requirements, existing modules, team boundaries, deployment target, test strategy, build constraints.

## Context to inspect
Targets/packages, dependency graph, navigation, state ownership, persistence, networking, platform adapters, tests, build times.

## Core knowledge
Architecture should optimize change boundaries rather than pattern purity. Dependency direction, state ownership, side-effect isolation, and composition roots matter more than naming a pattern.

## Procedure
1. Map feature and platform responsibilities.
2. Identify volatile dependencies and stable domain concepts.
3. Define module and type boundaries around cohesive capabilities.
4. Keep UI state and domain state ownership explicit.
5. Isolate network, persistence, analytics, notifications, and OS services behind narrow boundaries when substitution is useful.
6. Centralize dependency composition.
7. Prevent cyclic dependencies.
8. Define cross-feature communication deliberately.
9. Add contract/integration tests at important seams.
10. Validate build and runtime overhead.

## Decision points
Use feature modules when independent ownership or build isolation pays off. Use layers only where they create real substitution or policy boundaries. Avoid repositories/use-cases that merely forward calls.

## Common failure patterns
Massive coordinators/view models, global service locators, cyclic modules, duplicated models, hidden singletons, and abstraction without independent variation.

## Verification
Build from clean state, run module and integration tests, inspect dependency direction, and trace representative feature flows end to end.

## Expected output
Documented boundaries, dependency rules, composition strategy, and evidence that representative features remain testable.

## Stop conditions
Escalate when organizational ownership, migration constraints, or public SDK compatibility prevents a safe boundary change.