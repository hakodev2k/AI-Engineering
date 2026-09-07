# Error Handling Rules

## Purpose
Make failures diagnosable, correctly classified, and safe for callers.

## Scope
Applies to exceptions, domain failures, transport errors, retries, and recovery paths.

## MUST
- Unexpected failures MUST preserve causal diagnostic information.
- Error translation MUST distinguish caller errors, business conflicts, dependency failures, and internal faults where behavior differs.
- Cleanup and rollback MUST execute reliably on exceptional paths.
- Public error responses MUST be stable enough for clients and safe from sensitive-data leakage.
- Retryable failures MUST be explicitly classified rather than inferred from broad exception types.

## MUST NOT
- MUST NOT silently swallow unexpected exceptions.
- MUST NOT use exceptions as routine control flow when normal domain outcomes can be represented explicitly.
- MUST NOT log and rethrow the same failure at every layer, creating duplicate noise without context.

## SHOULD
- Add contextual information at boundaries while preserving the original cause.
- Prefer domain-specific failure models for expected business outcomes.

## Exceptions
Deliberate suppression is allowed only for explicitly non-critical cleanup or best-effort behavior with suitable telemetry.

## Verification
Use unit and integration tests for failure paths, log/trace inspection, static analysis, chaos/fault injection where appropriate, and review of error mappings.