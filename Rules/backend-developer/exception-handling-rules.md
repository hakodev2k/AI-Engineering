# Exception Handling Rules

## Purpose
Preserve failure semantics, diagnostics, and service reliability when unexpected conditions occur.

## Scope
Application exceptions, infrastructure failures, dependency errors, retries, and error translation.

## MUST
- Unexpected exceptions MUST preserve diagnostic context and correlation identifiers.
- Domain and validation failures MUST be distinguished from infrastructure and programmer failures.
- Boundary layers MUST translate internal failures into stable external error contracts.
- Cleanup and resource-release behavior MUST remain correct during exceptional control flow.

## MUST NOT
- MUST NOT silently swallow unexpected exceptions.
- MUST NOT log an exception repeatedly at every layer without adding new information.
- MUST NOT expose stack traces, secrets, or internal topology to clients.

## SHOULD
- Exception types SHOULD communicate recoverability and ownership clearly.
- Retryable failures SHOULD be identified explicitly rather than inferred from generic exceptions.

## Exceptions
Intentional suppression requires a documented reason, bounded scope, and evidence that the failure cannot corrupt state or hide operational risk.

## Verification
Review exception paths, negative tests, logs, telemetry, client responses, and resource-cleanup tests.