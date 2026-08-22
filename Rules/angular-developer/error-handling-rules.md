# Error Handling Rules

## Purpose
Make frontend failures recoverable, diagnosable, and appropriately visible without exposing sensitive internals.

## Scope
Synchronous exceptions, Observable errors, HTTP failures, global handlers, user feedback, and recovery.

## MUST
- Handle expected failures close to the layer that can choose a meaningful recovery or user outcome.
- Preserve diagnostic context such as operation, correlation identifier, and safe failure category.
- Provide users actionable states for recoverable failures and safe fallback for unrecoverable ones.
- Distinguish programming defects from expected business or transport failures.

## MUST NOT
- Swallow unexpected exceptions silently.
- Display stack traces, secrets, tokens, or sensitive server details to users.
- Convert all failures into generic empty data when that can mislead users.

## SHOULD
- Use global error handling for last-resort reporting, not as the primary business error strategy.

## Exceptions
Best-effort telemetry failures may be suppressed when suppression is deliberate, bounded, and cannot hide user-impacting failure.

## Verification
Exercise failure paths, inspect logs/telemetry and user states, and confirm sensitive details are redacted.