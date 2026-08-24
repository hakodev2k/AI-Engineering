# Streaming Tool Argument Parser Rules

1. Implementations **MUST** establish a before-change benchmark for representative payload and chunk sizes.
2. Raw streamed deltas **MUST** be appendable without reparsing the entire accumulated prefix on every chunk in the common path.
3. Final tool execution **MUST** use one authoritative complete JSON parse plus schema validation.
4. A parser **MUST NOT** execute a tool merely because a partial prefix is currently syntactically parsable.
5. UI/telemetry preview parsing **SHOULD** be throttled or incrementally maintained and **MUST NOT** determine execution readiness.
6. Malformed or truncated final JSON **MUST** fail explicitly; it **MUST NOT** be silently coerced into an executable call.
7. Unicode, escapes, nested structures, large strings, and provider-specific delta boundaries **MUST** have regression coverage.
8. Optimization claims **MUST** include before/after CPU or wall-time measurements and final semantic-equivalence evidence.
9. The benchmark **MUST** include increasing payload sizes sufficient to expose scaling behavior, not a single small fixture.
10. A regression that lowers latency by dropping required tool argument content **MUST** fail verification.
11. Retries for parser failures **MUST** be bounded; maximum default attempts is 2, and the second attempt **MUST** use new evidence or a different recovery strategy.
