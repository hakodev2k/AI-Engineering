# App Architecture Rules

## Purpose
Protect module boundaries, dependency direction, testability, and change isolation in iOS systems.

## Scope
Application layers, features, modules, domain logic, infrastructure, and composition roots.

## MUST
- Business rules MUST remain independent from UIKit/SwiftUI, persistence, networking, and vendor SDK details where practical.
- Dependencies MUST point toward stable abstractions or explicitly owned contracts.
- Feature ownership and state boundaries MUST be identifiable from code structure.
- Cross-module contracts MUST be deliberate and reviewed for compatibility.
- Architecture changes with broad blast radius MUST document constraints, alternatives, migration impact, and rollback strategy.

## MUST NOT
- MUST NOT create circular module dependencies.
- MUST NOT use global service locators to conceal dependency ownership.
- MUST NOT leak persistence or transport models across unrelated layers without an intentional contract.
- MUST NOT introduce abstraction layers without a concrete change, testability, or isolation benefit.

## SHOULD
- Keep composition at explicit boundaries.
- Prefer cohesive feature modules with narrow interfaces.
- Use architecture tests or dependency checks where tooling permits.

## Exceptions
Boundary violations require a recorded reason, bounded scope, removal plan when temporary, and reviewer approval.

## Verification
Review dependency graphs, imports, public symbols, composition roots, architecture tests, and representative feature changes for coupling and testability.