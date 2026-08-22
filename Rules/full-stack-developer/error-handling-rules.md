# Error Handling Rules

## Purpose
Provide safe user behavior while preserving diagnostic evidence.
## Scope
Frontend errors, API failures, exceptions, validation, and integration failures.
## MUST
- Distinguish expected domain/validation failures from unexpected system failures.
- Preserve correlation and diagnostic context for unexpected failures.
- Return safe errors that do not expose secrets or internals.
## MUST NOT
- Silently swallow unexpected exceptions.
- Display raw stack traces or sensitive backend details to users.
## SHOULD
- Design recoverable UI states and actionable retry guidance for transient failures.
## Exceptions
Deliberately ignored failures require explicit bounded impact and observability when operationally relevant.
## Verification
Review error contracts, logs, UI failure states, and injected failure tests.