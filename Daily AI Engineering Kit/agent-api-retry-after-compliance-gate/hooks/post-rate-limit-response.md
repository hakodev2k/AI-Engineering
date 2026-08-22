# Post Rate-Limit Response Hook

## Trigger
A client receives HTTP 429 or configured retryable 503.

## Preconditions
The response belongs to a non-production test, captured incident trace, or normal application execution that is already authorized.

## Action
Capture method, status, Retry-After, attempt number, and endpoint class. Invoke:

`python scripts/retry_after_gate.py --method <METHOD> --status <STATUS> --retry-after <VALUE> --policy config/retry-after-policy.json --output <PATH>`

Omit `--retry-after` when absent.

## Expected result
A deterministic decision of `retry`, `do-not-retry`, `approval-required`, or `block` with a bounded delay.

## Failure behavior
Exit code 2 blocks automatic retry/completion and requires investigation or approval. Exit code 3/4 is configuration/input failure and blocks execution until corrected. Preserve the original response on every failure.

## Blocking
Yes. This hook blocks unsafe or malformed retry behavior; it never sends the retry itself.
