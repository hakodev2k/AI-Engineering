# Trace Context Rules

## Purpose
Preserve end-to-end causal continuity across distributed requests, jobs, and messages.

## Scope
Applies to inbound and outbound propagation of trace identifiers, parent relationships, baggage, and correlation metadata.

## MUST
- Services MUST propagate the project-approved trace context across supported protocol boundaries.
- Trace-parent relationships MUST reflect actual causal execution rather than convenient call ordering.
- Asynchronous work MUST preserve or explicitly re-root context according to documented semantics.
- Context extraction failures MUST be observable without breaking legitimate traffic.

## MUST NOT
- MUST NOT generate unrelated trace roots when valid upstream context is available.
- MUST NOT trust externally supplied baggage without validation and size limits.
- MUST NOT place secrets, tokens, credentials, or unrestricted user data in trace context.

## SHOULD
- Context handling SHOULD use standard library or framework instrumentation before custom propagation code.
- Cross-language systems SHOULD use interoperable standards where practical.

## Exceptions
Exceptions require protocol constraints, compatibility impact, alternative correlation strategy, risk, and review approval.

## Verification
Use integration tests across service and queue boundaries, inspect parent-child relationships in a tracing backend, and validate malformed-context behavior.
