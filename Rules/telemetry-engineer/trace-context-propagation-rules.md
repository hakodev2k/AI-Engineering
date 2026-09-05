# Trace Context Propagation Rules

## Purpose
Preserve causality across service, process, queue, and asynchronous boundaries.

## Scope
Trace identifiers, span context, baggage, messaging metadata, background work, and cross-service propagation.

## MUST
- Supported distributed boundaries MUST propagate trace context using an agreed standard.
- Context extraction MUST validate untrusted incoming values before use.
- Asynchronous producers and consumers MUST preserve causality where operational diagnosis depends on it.
- Propagation failures MUST be distinguishable from normal root-span creation.

## MUST NOT
- MUST NOT copy sensitive business data into tracing baggage merely for convenience.
- MUST NOT create conflicting trace identifiers for the same logical hop without explicit fan-out semantics.
- MUST NOT trust arbitrary external context to override internal security boundaries.

## SHOULD
- Keep baggage minimal and define ownership for each propagated field.

## Exceptions
Require documented technical limitation, impact on diagnosis, and alternative correlation mechanism.

## Verification
Use integration tests across process and messaging boundaries, inspect traces, and review propagation headers and SDK configuration.