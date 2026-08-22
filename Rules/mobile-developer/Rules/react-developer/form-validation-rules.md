# Form and Validation Rules

## Purpose
Ensure forms produce predictable user behavior and do not confuse client validation with security enforcement.

## Scope
Applies to forms, inputs, validation, submission, and error presentation.

## MUST
- Form state MUST distinguish untouched, valid, invalid, submitting, succeeded, and failed states when relevant.
- Client validation MUST align with published API/business constraints where the client knows them.
- Server validation failures MUST remain authoritative and be surfaced to the correct field or form context when possible.
- Submit actions MUST prevent unintended duplicate submission when duplicate side effects are possible.
- Validation messages MUST be accessible and understandable.

## MUST NOT
- MUST NOT treat client-side validation as a security boundary.
- MUST NOT discard user input after recoverable submission failures.
- MUST NOT encode business-critical validation only in UI code.

## SHOULD
- Prefer schema/shared validation mechanisms when they reduce contract drift.
- Prefer validation timing that helps users without excessive disruptive feedback.

## Exceptions
Document conflicting backend constraints, temporary compatibility behavior, and planned reconciliation.

## Verification
Use component tests, API integration tests, keyboard/screen-reader checks, duplicate-submit tests, and review against server validation contracts.