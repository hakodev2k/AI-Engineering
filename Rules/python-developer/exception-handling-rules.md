# Exception Handling Rules
## Purpose
Preserve failure semantics and diagnostic evidence.
## Scope
Application, library, worker, and integration code.
## MUST
- Exceptions MUST be caught only where recovery, translation, cleanup, or context addition is possible.
- Translated exceptions MUST preserve causal information.
- Retryable and terminal failures MUST be distinguishable.
## MUST NOT
- MUST NOT silently swallow unexpected exceptions.
- MUST NOT catch `BaseException` for ordinary error handling.
## SHOULD
- Use domain-specific exceptions at stable boundaries.
## Exceptions
Broad catches are allowed at process boundaries when they log evidence and fail safely.
## Verification
Review exception paths and test representative failure modes.