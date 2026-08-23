# Backend Service Design

## Purpose
Structure backend application logic into cohesive services with explicit boundaries and manageable dependencies.

## When to use
New backend capabilities, large refactors, or services suffering from tangled controllers and infrastructure code.

## Inputs
Use cases, domain rules, repository, integration contracts, operational requirements.

## Context to inspect
Request pipeline, modules, domain model, persistence, dependency injection, integrations, tests.

## Core knowledge
Separate orchestration, domain policy, and infrastructure concerns according to actual complexity. Keep transaction and failure boundaries explicit. Avoid architecture patterns that add indirection without reducing change risk.

## Procedure
1. Map use cases and invariants.
2. Identify cohesive module boundaries.
3. Place business rules near the domain concepts they govern.
4. Keep transport concerns at edges.
5. Define persistence and integration boundaries.
6. Establish transaction ownership.
7. Define error and cancellation propagation.
8. Add tests at useful boundaries.
9. Instrument critical paths.
10. Review dependency direction and operational behavior.

## Decision points
Use richer domain modeling for complex invariants; simpler transaction scripts for straightforward workflows. Introduce abstractions where substitution, testing, or architectural boundaries justify them.

## Common failure patterns
Fat controllers, anemic wrappers, service classes with unrelated responsibilities, hidden transactions, infrastructure leakage, excessive interfaces, and missing cancellation.

## Verification
Trace representative use cases end-to-end; confirm dependency direction, transaction semantics, tests, and telemetry.

## Expected output
Cohesive backend modules with explicit contracts and responsibilities.

## Stop conditions
Escalate when domain ownership or consistency requirements are unresolved.