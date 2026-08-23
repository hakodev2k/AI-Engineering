# Forms and Validation

## Purpose
Implement complex forms with clear data ownership, accessible validation, safe submission, and robust handling of server-side business rules.

## When to use
Use for data-entry workflows, multi-step forms, dynamic fields, uploads, or forms with asynchronous/server validation.

## Inputs
Field definitions, business rules, API contract, UX design, accessibility requirements, and submission semantics.

## Context to inspect
Existing form library, field components, schema validators, server error format, autosave behavior, dirty-state handling, and localization.

## Core knowledge
Client validation improves feedback but cannot enforce trust boundaries. Server validation remains authoritative. Validation should communicate what failed and how to recover while preserving user input.

## Procedure
1. Model the submitted data separately from transient UI state.
2. Identify required, conditional, cross-field, and server-only rules.
3. Choose a validation schema compatible with runtime data.
4. Define touched/dirty/submitting states.
5. Use native semantic controls where possible.
6. Associate errors programmatically with fields and summaries.
7. Prevent duplicate submissions and define idempotency expectations.
8. Map server validation errors back to fields or form-level feedback.
9. Preserve recoverable input after failures.
10. Test keyboard use, malformed input, slow submission, and repeated actions.

## Decision points
Validate on change only when feedback remains useful and non-disruptive; otherwise validate on blur/submission. Use multi-step forms when cognitive or workflow boundaries justify the added persistence complexity.

## Common failure patterns
Client-only validation, clearing input after errors, inaccessible messages, duplicated rule definitions drifting apart, accidental double submits, and uncontrolled async validation races.

## Verification
Server and client rules agree on representative cases, submission is safe under repeated clicks, errors are accessible, and user data survives recoverable failures.

## Expected output
A reliable form workflow with explicit validation, submission, error, and recovery behavior.

## Stop conditions
Stop when authoritative validation rules are unavailable, submission has destructive ambiguity, or sensitive fields require unresolved security controls.