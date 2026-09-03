# DLQ Replay Safety Rules

## MUST

- Record the exact queue/subscription, environment, and message IDs before replay.
- Classify each selected message failure as transient, permanent, unknown, or already-resolved.
- Prove handler idempotency or deduplication before replaying side-effecting operations.
- Preserve tenant identity and authorization boundaries during investigation and replay.
- Validate the replay plan with `scripts/validate-replay-plan.py` before execution.
- Record a receipt or explicit unknown outcome for every attempted message.
- Treat production replay as approval-required.
- Stop when actual execution scope differs from the approved plan.
- Preserve evidence for failed or ambiguous replay attempts.

## MUST NOT

- Replay an entire DLQ because individual selection is inconvenient.
- Replay permanent failures without an explicitly approved remediation plan.
- Requeue malformed, unsupported-version, authorization-denied, or business-rule-rejected messages merely to clear backlog metrics.
- Delete or purge DLQ messages as part of normal replay flow.
- Modify message payloads silently between investigation and replay.
- Retry an ambiguous provider response automatically.
- Disable deduplication, authorization, validation, or security controls to make replay succeed.
- Increase privileges automatically after a permission failure.
- Claim success from queue acceptance alone; downstream processing must be checked.

## SHOULD

- Prefer the smallest reproducible batch, starting with one non-production message where possible.
- Use immutable replay-plan files and record their SHA-256 hash.
- Group messages by evidenced root cause before deciding replayability.
- Verify business-level side effects, not only transport-level delivery.
- Keep provider-specific execution adapters separate from the core gate.
