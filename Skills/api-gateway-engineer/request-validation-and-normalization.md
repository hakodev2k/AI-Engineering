# Request Validation and Normalization

## Purpose
Reject malformed or dangerous requests early while preserving API contract semantics.

## When to use
Use when enforcing schemas, headers, methods, payload sizes, or canonical request shapes.

## Inputs
API contracts, payload constraints, content types, backend expectations.

## Context to inspect
OpenAPI/JSON Schema definitions, body limits, header handling, proxy normalization, duplicate headers, encoding behavior.

## Core knowledge
Understand schema validation, HTTP parsing ambiguities, request smuggling risks, canonicalization, content negotiation, and validation cost.

## Procedure
1. Identify authoritative contracts.
2. Enforce allowed methods, content types, and body/header limits.
3. Validate structure before transformation.
4. Normalize only explicitly defined fields.
5. Reject ambiguous encodings and malformed framing.
6. Preserve correlation and trusted metadata.
7. Return stable client errors without leaking internals.
8. Test malformed, oversized, duplicate, and edge-case requests.

## Decision points
Validate at gateway when rules are transport/contract-wide; keep business validation in services.

## Common failure patterns
Silently correcting invalid input, divergent gateway/service schemas, unlimited bodies, inconsistent header canonicalization.

## Verification
Contract tests and adversarial parsing cases pass; rejected traffic is observable.

## Expected output
A deterministic edge-validation policy aligned with backend contracts.

## Stop conditions
Escalate if no authoritative API contract exists.