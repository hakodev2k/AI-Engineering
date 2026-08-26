# DOM Lifecycle Rules
## Purpose
Maintain safe, specification-conformant document and node lifecycle behavior.
## Scope
DOM trees, documents, mutation, adoption, teardown, and observable lifecycle effects.
## MUST
- Node ownership and document transitions MUST remain explicit and specification-conformant.
- Mutation paths MUST preserve required observer, event, accessibility, style, and layout notifications.
- Teardown MUST release resources without leaving observable stale state.
## MUST NOT
- MUST NOT retain detached trees unintentionally through engine-owned references.
- MUST NOT bypass lifecycle hooks merely to optimize mutation throughput.
## SHOULD
- SHOULD centralize lifecycle transitions so invariants are reviewable.
## Exceptions
Any bypass requires evidence that all observable side effects remain equivalent and approval from a domain reviewer.
## Verification
Run DOM conformance tests, mutation-observer tests, leak tests, lifecycle assertions, fuzzing, and memory diagnostics.