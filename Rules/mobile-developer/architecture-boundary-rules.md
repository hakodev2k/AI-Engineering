# Architecture Boundary Rules
## Purpose
Preserve maintainable dependency direction as mobile applications grow across features and platforms.
## Scope
Feature modules, domain/application logic, UI, infrastructure, native adapters, and shared libraries.
## MUST
- Module ownership and public boundaries MUST be explicit for independently changing features.
- Core business decisions MUST remain testable without booting the full UI or device runtime where practical.
- Cross-feature dependencies MUST use stable contracts rather than reach into implementation details.
## MUST NOT
- Shared utility modules MUST NOT become unrestricted dependency sinks.
- Cyclic feature dependencies MUST NOT be introduced without an explicit redesign decision.
## SHOULD
- Architecture SHOULD optimize for change isolation and testability rather than pattern conformity.
## Exceptions
Small applications may use fewer layers when dependency direction remains clear and growth risk is low.
## Verification
Use dependency graphs, architecture tests, module visibility, code review, and change-impact analysis.