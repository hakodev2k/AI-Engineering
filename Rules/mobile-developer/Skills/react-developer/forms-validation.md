# Forms and Validation

## Purpose
Design robust forms with predictable state, validation, accessibility, and server-error handling.

## When to use
Use for data-entry flows, complex forms, validation frameworks, and multi-step workflows.

## Inputs
Field model, business rules, API errors, UX requirements, persistence behavior.

## Preconditions
Separate client usability validation from authoritative server validation.

## Context to inspect
Controlled/uncontrolled fields, form library, schema validation, submission lifecycle, error mapping.

## Core knowledge
Client validation improves UX but cannot enforce trust boundaries. Form state should distinguish values, touched/dirty state, submission, and server feedback.

## Procedure
1. Model fields and dependencies.
2. Choose controlled/uncontrolled approach intentionally.
3. Encode reusable validation rules.
4. Validate on appropriate interaction events.
5. Preserve user input on server failure.
6. Map server errors to field/general messages.
7. Prevent accidental duplicate submissions.
8. Ensure labels, focus, and error announcements are accessible.
9. Test edge cases and interrupted submissions.

## Decision points
Use a form library when dynamic fields, nested state, performance, or validation complexity justify it.

## Common failure patterns
Duplicated validation logic, clearing inputs on error, disabling submit without explanation, client-only trust, inaccessible errors.

## Verification
Test invalid/valid transitions, server failures, keyboard flow, duplicate submits, and data preservation.

## Expected output
Reliable, accessible forms with clear error semantics.

## Stop conditions
Stop if backend validation rules are unknown or contradictory.