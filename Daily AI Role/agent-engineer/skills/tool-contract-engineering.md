# Skill: Tool Contract Engineering

**Purpose:** Make agent tool use predictable, testable, and safe.

**Trigger:** Adding or changing a tool, API, connector, script, browser action, database operation, or external side effect.

**Inputs:** operation purpose, auth model, request/response format, errors, rate limits, side effects, idempotency behavior.

## Procedure
1. Name one responsibility for the tool.
2. Specify typed inputs, required fields, validation, defaults, and forbidden combinations.
3. Specify outputs that distinguish success, partial success, not-found, retryable failure, permission failure, and permanent failure.
4. Classify side effects and whether dry-run is supported.
5. Define idempotency key or deduplication behavior where repeated calls are possible.
6. Define timeout, retry, backoff, rate-limit, and cancellation behavior.
7. Define evidence the agent must inspect after the call.
8. Add contract tests for normal, malformed, stale, duplicate, denied, and partial-result cases.

**Decision rules:** read-only calls may run autonomously within scope; reversible writes need verification; irreversible or sensitive writes require explicit configured approval.

**Output:** tool schema, error taxonomy, retry policy, permission boundary, and tests.

**Quality:** the agent can decide what to do from structured results without parsing vague prose.

**Failure handling:** do not retry non-idempotent writes unless outcome is known or deduplication exists.

**Stop:** contract tests and side-effect review pass.