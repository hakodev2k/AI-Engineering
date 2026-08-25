# Retry Policy

- A model event that is semantically terminal, including `response.completed`, `response.incomplete`, explicit cancellation, invalid request, or authentication failure, **MUST NOT** be retried as a transport failure.
- Every retry decision **MUST** be attributable to one logical turn ID across attempts and transports.
- Retry eligibility **MUST** be determined by one normalized classifier, not independently by multiple orchestration layers.
- Retry loops **MUST** enforce both a maximum attempt count and a maximum cumulative wait budget.
- WebSocket transport stalls **SHOULD** fall back to HTTPS when the configured transport budget is exhausted rather than starting an unbounded retry sequence.
- Rate-limit retries **MUST** honor a bounded `Retry-After` value when available.
- Unknown/unclassified outcomes **MUST NOT** be treated as retryable by default.
- Performance claims **MUST** include before/after measurements for latency, attempts per logical turn, cumulative wait, success rate, and when available token usage.
- An optimization **MUST NOT** be accepted when lower latency is achieved by reducing correctness, successful completion rate, required verification, or security checks.
- Failed experiments **MUST** preserve baseline evidence and stop after at most two policy revisions in one run.
