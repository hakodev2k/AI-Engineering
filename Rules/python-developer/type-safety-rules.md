# Type Safety Rules
## Purpose
Use Python typing to prevent interface and refactoring defects.
## Scope
Public APIs, domain boundaries, shared modules, and critical code.
## MUST
- Boundary inputs and outputs MUST have reviewable type contracts.
- Type-checker suppressions MUST include a local justification.
- Runtime validation MUST remain where untrusted data crosses a boundary.
## MUST NOT
- MUST NOT treat static typing as runtime validation.
- MUST NOT introduce broad `Any` merely to silence errors.
## SHOULD
- Prefer precise protocols and narrow unions over implementation coupling.
## Exceptions
Dynamic integrations may relax typing with documented containment and tests.
## Verification
Run the configured type checker and inspect suppressions and boundary tests.