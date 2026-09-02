# Quantum SDK Architecture

## Purpose
Design maintainable quantum software libraries that isolate algorithm logic from provider APIs, preserve mathematical semantics, and remain testable as SDKs and backends evolve.

## When to use
Use when structuring a reusable quantum codebase, adding multiple providers, refactoring notebooks into production-quality modules, or reviewing dependency boundaries.

## Inputs
Repository, supported algorithms, provider SDKs, backend requirements, public API expectations, testing strategy, and compatibility constraints.

## Preconditions
Core domain responsibilities and external integration requirements must be identifiable.

## Context to inspect
Package boundaries, circuit abstractions, provider imports, configuration flow, result models, serialization, version pins, test doubles, notebooks, and CLI/service entry points.

## Core knowledge
Quantum applications benefit from separating domain mathematics, logical circuit construction, compilation policy, backend adapters, execution orchestration, and result analysis. Provider-neutral abstractions should preserve capabilities rather than flatten materially different semantics. Notebooks are useful exploration surfaces but poor dependency boundaries.

## Procedure
1. Identify stable domain concepts and volatile provider-specific concepts.
2. Keep mathematical models and algorithm definitions independent of cloud credentials and network clients.
3. Define explicit circuit, execution-request, backend-capability, and result boundaries.
4. Place provider SDK code behind adapters with narrow interfaces.
5. Make transpilation policy configurable rather than hidden inside algorithms.
6. Separate raw provider results from normalized analysis models.
7. Centralize version and feature compatibility checks.
8. Make configuration injectable and secrets external.
9. Provide deterministic simulator-backed tests for domain logic.
10. Add contract tests for each backend adapter.
11. Keep notebooks and examples as consumers of the library, not the library itself.
12. Review abstractions whenever a second provider or materially different backend exposes semantic mismatch.

## Decision points
Use provider-neutral interfaces only for concepts that are truly shared. Expose provider-specific extensions when hiding them would block important hardware capabilities. Prefer small composable modules over a universal quantum framework inside the project.

## Common failure patterns
Provider imports throughout algorithm code, hidden transpilation, mutable global backend state, leaking provider result schemas across the application, notebook-only business logic, excessive abstraction before a second use case exists, and loose dependency versioning.

## Verification
Run domain tests without network access, execute adapter contract tests, swap between simulator and supported providers without changing algorithm semantics, and inspect dependency boundaries for provider leakage.

## Expected output
A modular quantum software architecture with stable domain APIs, isolated provider adapters, explicit compilation/execution policies, and strong testability.

## Stop conditions
Stop when provider capabilities are too divergent for a common abstraction, public API compatibility requirements are unresolved, or architectural changes would break downstream consumers without a migration plan.