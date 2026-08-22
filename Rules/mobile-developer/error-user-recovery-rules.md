# Error and User Recovery Rules
## Purpose
Turn failures into safe, diagnosable, and recoverable mobile experiences.
## Scope
Validation errors, network failures, storage failures, permission denial, partial operations, and user messaging.
## MUST
- Errors MUST preserve diagnostic cause internally while presenting actionable, non-sensitive user guidance.
- Recoverable failures MUST offer retry, correction, resume, or safe fallback appropriate to the operation.
- Partial writes or multi-step actions MUST define compensation or reconciliation behavior.
## MUST NOT
- Unexpected exceptions MUST NOT be silently swallowed.
- Retry UI MUST NOT duplicate non-idempotent actions.
## SHOULD
- Error states SHOULD preserve user-entered data whenever safe and feasible.
## Exceptions
Security-sensitive failures may intentionally reveal less detail to the user while retaining protected diagnostics.
## Verification
Test validation, offline, timeout, permission denial, storage exhaustion, partial completion, retry, and process restart.