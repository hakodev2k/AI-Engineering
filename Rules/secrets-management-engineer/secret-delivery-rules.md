# Secret Delivery Rules

## Purpose
Deliver secret material to authorized consumers without creating uncontrolled copies or interception paths.

## Scope
Runtime injection, sidecars, mounted files, environment variables, APIs, deployment systems, and bootstrap channels.

## MUST
- Delivery MUST authenticate the consumer and protect confidentiality and integrity in transit.
- Delivery mechanisms MUST minimize persistence and exposure to sibling processes, logs, diagnostics, and crash artifacts.
- File-based delivery MUST use restrictive permissions and controlled cleanup.
- Delivery failures MUST fail safely and emit non-secret diagnostic evidence.

## MUST NOT
- Secrets MUST NOT be passed through command-line arguments when process listings or telemetry can expose them.
- Secret values MUST NOT be printed during deployment or troubleshooting.
- Delivery MUST NOT depend on unauthenticated network location as proof of identity.

## SHOULD
- Prefer runtime retrieval or memory-bound delivery over baking credentials into artifacts.
- Consumers SHOULD retrieve only the secrets required for their current function.

## Exceptions
Less-preferred delivery requires documented platform constraint, exposure analysis, compensating controls, and approval for sensitive environments.

## Verification
Inspect deployment definitions, process arguments, filesystem permissions, transport configuration, logs, traces, crash dumps, and controlled unauthorized retrieval tests.