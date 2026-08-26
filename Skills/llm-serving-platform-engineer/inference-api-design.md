# Inference API Design

## Purpose
Design stable, efficient inference contracts for text generation while preserving compatibility and operational control.

## When to use
Use for new endpoints or changes to streaming, structured output, tools, quotas, or model selection.

## Inputs
Consumer requirements, existing contracts, model capabilities, SLOs, authentication, quotas, compatibility constraints.

## Context to inspect
Gateway conventions, schemas, SDKs, streaming protocol, errors, limits, telemetry, and versioning policy.

## Core knowledge
Separate stable platform semantics from runtime details. Explicitly model token limits, sampling, cancellation, stream termination, errors, usage accounting, and model identity.

## Procedure
1. Identify consumers and capabilities. 2. Define schemas and defaults. 3. Specify sync and streaming lifecycles. 4. Validate context/token limits before execution. 5. Define auth, quotas, and tenant attribution. 6. Define timeout, cancellation, retry, and idempotency semantics. 7. Create stable error codes. 8. Specify usage metadata. 9. Check compatibility. 10. Add contract, interruption, overload, and malformed-input tests. 11. Publish versioning rules.

## Decision points
Use SSE for simple one-way token streaming; WebSocket only when bidirectional semantics justify state. Reject unsupported parameters rather than silently ignoring them unless compatibility requires tolerance.

## Common failure patterns
Runtime fields leaking into contracts, ambiguous limits, unsafe retries, incorrect stream termination, unbounded bodies, and changing defaults without versioning.

## Verification
Run schema, compatibility, cancellation, quota, and load tests through the real gateway.

## Expected output
A versioned inference contract with explicit lifecycle, errors, limits, security, and test evidence.

## Stop conditions
Stop when semantics are unresolved, compatibility cannot be assessed, or security ownership is undefined.