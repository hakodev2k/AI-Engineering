# Forms and Validation

## Purpose
Build accessible, maintainable Vue forms with correct validation, submission state, and server-error handling.

## When to use
Use for data-entry workflows, complex validation, multi-step forms, or form reliability issues.

## Inputs
Field rules, API contract, UX requirements, accessibility needs, and server validation semantics.

## Context to inspect
Inspect existing form libraries, design-system fields, validation conventions, localization, and submission APIs.

## Core knowledge
Client validation improves feedback but never replaces server validation. Validation should distinguish field, cross-field, and server/business rules. Preserve user input on recoverable failures.

## Procedure
1. Define the form data model and submission contract.
2. Separate display formatting from canonical values.
3. Implement field and cross-field validation.
4. Associate errors programmatically with controls.
5. Model dirty, touched, pending, and submitting states as needed.
6. Prevent accidental duplicate submissions.
7. Map server validation errors to useful UI.
8. Handle reset and initial-data changes deliberately.
9. Test keyboard, screen-reader, invalid, slow, and failed submission flows.

## Decision points
Use a form library when schema, nested data, or repeated validation complexity warrants it; otherwise prefer simple explicit state. Validate on blur/change/submit based on interaction cost.

## Common failure patterns
Disabling submit without explaining errors, losing values after failure, trusting client validation, inaccessible errors, duplicate submissions, and conflating formatted/display values with payload values.

## Verification
Verify valid and invalid submissions, server errors, keyboard use, focus management, duplicate-click behavior, and data normalization.

## Expected output
Accessible forms with deterministic validation and resilient submission behavior.

## Stop conditions
Stop when business validation rules or server error contracts are unknown.