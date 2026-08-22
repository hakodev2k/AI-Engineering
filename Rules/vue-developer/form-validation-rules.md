# Form and Validation Rules

## Purpose
Keep form state, validation, submission, and error recovery correct and usable.

## Scope
Forms, field state, client validation, server validation, dirty state, and submissions.

## MUST
- Server-side validation MUST remain authoritative for security and business invariants.
- Client validation MUST provide timely feedback without claiming acceptance the server has not confirmed.
- Submission logic MUST prevent unintended duplicate actions where duplicates cause harm.
- Field-level and form-level errors MUST remain associated with actionable user context.
- Destructive or high-impact submissions MUST communicate consequences and require appropriate confirmation.

## MUST NOT
- Client validation MUST NOT be treated as a security control.
- Failed submissions MUST NOT silently discard user-entered data unless policy requires it.
- Buttons MUST NOT remain ambiguously actionable during a non-repeatable in-flight submission.

## SHOULD
- Separate display formatting from canonical values.
- Preserve dirty state across recoverable failures and warn before accidental navigation when loss would be costly.

## Exceptions
Idempotent search/filter forms may allow overlapping submissions when stale results are correctly discarded.

## Verification
Test keyboard submission, duplicate clicks, server validation, network failure, navigation with dirty state, and recovery after errors.