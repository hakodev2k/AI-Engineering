# Error and Failure Handling Rules

## Purpose
Make integration failures explicit, diagnosable, recoverable, and safe.

## Scope
Applies to validation errors, dependency failures, partial processing, poison data, protocol failures, and unexpected exceptions.

## MUST
- Failures MUST be classified into actionable categories such as validation, authentication, authorization, dependency, timeout, throttling, conflict, and unexpected failure.
- Unexpected exceptions MUST preserve diagnostic context and MUST NOT be silently swallowed.
- Partial-success behavior MUST be documented when an operation spans multiple records or downstream systems.
- Irrecoverable failures MUST reach a visible terminal state with an accountable remediation path.
- User-visible or partner-visible errors MUST avoid leaking internal or sensitive details.

## MUST NOT
- MUST NOT convert all failures into a generic success response.
- MUST NOT endlessly requeue poison data.
- MUST NOT discard evidence needed for root-cause analysis.

## SHOULD
- Error contracts SHOULD be stable and machine-actionable.
- Recovery actions SHOULD be idempotent where replay is possible.

## Exceptions
Document the failure mode, why standard handling is unsuitable, evidence, operational risk, and owner approval.

## Verification
Exercise negative-path tests, inspect retry and terminal states, review error payloads, and validate logs and traces preserve sufficient diagnostic evidence.