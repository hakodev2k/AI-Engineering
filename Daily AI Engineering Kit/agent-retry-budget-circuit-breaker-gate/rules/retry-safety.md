# Retry Safety Rules

## MUST
- Classify a failure before retrying and preserve evidence from every attempt.
- Enforce `max_attempts`; after the budget is exhausted, stop and escalate.
- Use exponential backoff with bounded jitter for transient failures.
- Treat authentication, authorization, validation, and business-rule failures as non-retryable unless new evidence changes the classification.
- Require explicit human approval before retrying an operation whose repetition could create duplicate writes, charges, deployments, destructive changes, permission increases, or irreversible effects.
- Use an idempotency key or equivalent deduplication mechanism for retryable writes when the target supports one.

## MUST NOT
- Retry indefinitely.
- Increase permissions, weaken validation, suppress errors, or disable security controls to make a retry succeed.
- Retry an unknown-outcome write until its prior effect has been reconciled.
- hide failed attempts from the final evidence record.

## SHOULD
- Prefer server-provided retry hints such as `Retry-After` over locally calculated delay.
- Open a circuit after repeated dependency failures and probe only after the configured cool-down.
- Keep retry policy outside agent prompts so deterministic enforcement cannot be casually overridden.
