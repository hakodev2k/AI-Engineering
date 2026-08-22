# Forms and Validation

## Purpose
Build reliable Angular forms with explicit models, validation, accessibility, and server-error handling.

## When to use
Use for data-entry workflows, complex validation, dynamic fields, and form refactors.

## Inputs
Business rules, field schema, API contract, UX states, and accessibility requirements.

## Context to inspect
Inspect form model, validators, templates, server errors, submission flow, disabled states, and data transformations.

## Core knowledge
Client validation improves feedback but cannot replace server validation. Typed reactive forms are appropriate for complex workflows; validation should express business rules without duplicating unrelated domain logic.

## Procedure
1. Define the form data contract separately from persistence models.
2. Choose controls and typed structure.
3. Add synchronous and asynchronous validators deliberately.
4. Define touched/dirty and error-display policy.
5. Prevent duplicate submissions.
6. Map server validation errors back to fields or form-level errors.
7. Preserve accessible labels, descriptions, and focus behavior.
8. Test valid, invalid, partial, slow, and failed submissions.

## Decision points
Use reactive forms for complex/dynamic workflows; simpler binding may suffice for trivial forms. Validate remotely only when local evidence is insufficient.

## Common failure patterns
Validation only on client, giant templates, hidden server errors, premature async validation, inconsistent normalization, and inaccessible error messaging.

## Verification
Verify keyboard flow, validation rules, server rejection, duplicate-click behavior, reset behavior, and successful payload shape.

## Expected output
A typed, accessible form with deterministic submission behavior.

## Stop conditions
Stop when authoritative validation rules or API contracts are missing.