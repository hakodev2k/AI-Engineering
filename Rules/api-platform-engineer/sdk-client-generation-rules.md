# SDK and Client Generation

## Purpose
Ensure generated clients preserve API contracts and remain supportable.

## Scope
Code generation, schemas, runtime dependencies, release compatibility, and generated artifacts.

## MUST
- Generated clients MUST originate from an authoritative versioned contract.
- Generator versions and templates MUST be reproducible.
- SDK releases MUST state compatible API versions and runtime requirements.
- Breaking generator changes MUST be tested against representative consumers.

## MUST NOT
- MUST NOT hand-edit generated files when regeneration would erase the change.
- MUST NOT publish clients containing embedded credentials or environment-specific endpoints.

## SHOULD
- Generated clients SHOULD provide typed errors, cancellation/timeouts, and safe retry hooks appropriate to the language.

## Exceptions
Handwritten extensions must be separated from generated code and covered by tests.

## Verification
Regenerate in CI, diff outputs, compile supported targets, run contract tests, and scan artifacts.