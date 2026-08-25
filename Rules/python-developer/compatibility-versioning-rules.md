# Compatibility and Versioning Rules
## Purpose
Prevent accidental breakage across Python versions and consumers.
## Scope
Public APIs, packages, persisted formats, dependencies, and runtime upgrades.
## MUST
- Supported Python/runtime versions MUST be explicit and tested.
- Breaking public changes MUST be intentional, documented, and approved under the project's compatibility policy.
- Deprecations MUST provide a migration path when consumers cannot migrate atomically.
## MUST NOT
- MUST NOT remove or reinterpret public behavior accidentally during refactoring.
- MUST NOT claim compatibility without representative validation.
## SHOULD
- Prefer additive evolution and staged deprecation.
## Exceptions
Security fixes may require expedited breaking changes with risk communication.
## Verification
Multi-version CI, API/contract tests, upgrade tests, and release diff review.