# Rules: Aggregate Tool Output Context Budget

- Every model request MUST reserve configured output tokens and a safety margin before admitting tool results.
- Tool output MUST be measured cumulatively per turn, not only per result.
- A result exceeding `max_tool_result_tokens` MUST NOT be inserted raw without an explicit exception backed by correctness requirements.
- Aggregate tool output exceeding `max_tool_turn_tokens` MUST be externalized, filtered, chunked, or summarized before insertion.
- Correctness-critical evidence MUST be preserved through an excerpt plus stable reference or equivalent loss-aware mechanism.
- Context reduction MUST NOT remove required instructions, authorization boundaries, or evidence solely to reduce cost.
- Identical overflow retries MUST be bounded and MUST NOT repeat indefinitely.
- Before/after token, latency, overflow, and quality metrics MUST be recorded for optimization claims.
- Failure to estimate safely SHOULD use a conservative estimate and MUST fail before sending an over-limit request.
