# Metadata and Interceptor Rules

## Purpose
Keep cross-cutting RPC behavior predictable and prevent hidden contract or security coupling.

## Scope
Client/server interceptors, metadata, correlation context, policy injection, and middleware ordering.

## MUST
- Metadata keys with contract significance MUST be documented and versioned deliberately.
- Interceptor ordering MUST be deterministic when behavior depends on order.
- Security-sensitive metadata MUST be validated at a trusted boundary.
- Interceptors MUST preserve cancellation, deadlines, and status semantics.

## MUST NOT
- MUST NOT hide essential business inputs exclusively in undocumented metadata.
- MUST NOT mutate requests/responses in interceptors in ways that violate the declared API contract.
- MUST NOT log sensitive metadata.
- MUST NOT allow interceptor failures to silently bypass required authentication, authorization, or audit controls.

## SHOULD
- Use interceptors for genuinely cross-cutting concerns such as telemetry and policy enforcement, not arbitrary domain logic.

## Exceptions
Domain-aware interceptors require explicit architecture rationale and tests demonstrating predictable coupling.

## Verification
Review interceptor registration/order, metadata schemas, security tests, propagation tests, and traces showing preserved context.