# Gameplay Architecture Rules

## Purpose
Protect module boundaries and keep gameplay systems evolvable under content and feature growth.

## Scope
Subsystem ownership, dependencies, events, services, entities, components, and public gameplay contracts.

## MUST
- Each authoritative gameplay concern MUST have a clear owner and dependency direction.
- Cross-system contracts MUST define lifecycle, failure, and ordering semantics where relevant.
- Significant architecture changes MUST document constraints, trade-offs, compatibility impact, and migration strategy.
- Engine/framework abstractions MUST be isolated where doing so materially improves testability or portability.

## MUST NOT
- MUST NOT use global mutable state as an undocumented coordination mechanism.
- MUST NOT create circular subsystem dependencies that make initialization or teardown order implicit.

## SHOULD
- Data and behavior boundaries SHOULD follow stable gameplay concepts rather than transient UI or scene structure.

## Exceptions
Intentional coupling requires evidence that simpler boundaries would add greater cost and must document containment.

## Verification
Use dependency inspection, architecture tests where practical, lifecycle tests, design review, and change-impact analysis.