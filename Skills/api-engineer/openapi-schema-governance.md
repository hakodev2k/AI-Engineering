# OpenAPI Schema Governance

## Purpose
Use machine-readable API schemas as enforceable contracts for documentation, validation, tooling, and change control.

## When to use
Use when maintaining HTTP APIs described with OpenAPI.

## Inputs
API implementation, OpenAPI document, organization standards, and consumer requirements.

## Context to inspect
Schema generation, CI checks, examples, security schemes, reusable components, and generated clients.

## Core knowledge
An OpenAPI document is useful only when it matches runtime behavior. Precise types, required fields, formats, examples, and error schemas reduce integration ambiguity.

## Procedure
1. Establish schema ownership and source of truth.
2. Define reusable components and naming rules.
3. Describe all operations and security requirements.
4. Model validation constraints and errors accurately.
5. Add representative examples.
6. Lint the document.
7. Diff contracts in CI.
8. Validate implementation against the schema.
9. Test generated clients where supported.

## Decision points
Choose design-first when cross-team agreement must precede implementation; code-first can work when generation is deterministic and reviewed.

## Common failure patterns
Stale specs, generic object schemas, missing errors, inaccurate nullability, and generated documents never reviewed.

## Verification
Linting, schema validation, contract tests, and sample client calls all agree with runtime behavior.

## Expected output
A trustworthy, governed OpenAPI contract.

## Stop conditions
Stop if no authoritative contract source can be established.