# Package Design Rules
## Purpose
Protect module boundaries and reusable contracts.
## Scope
Packages, modules, imports, and public symbols.
## MUST
- Public package surfaces MUST be intentional and documented by usage or tests.
- Dependency direction MUST follow the project's architecture boundaries.
- Import-time behavior MUST be deterministic and free of unsafe external side effects.
## MUST NOT
- MUST NOT create circular dependencies as an accepted architecture mechanism.
- MUST NOT expose internal implementation accidentally as a supported contract.
## SHOULD
- Keep modules cohesive and package APIs smaller than their internals.
## Exceptions
Compatibility shims require a removal or maintenance strategy.
## Verification
Import tests, architecture checks, API review, and dependency inspection.