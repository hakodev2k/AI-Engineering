# Dead-Letter Handling

## Purpose
Handle messages that cannot be processed automatically while preserving evidence and recovery paths.

## When to use
Use when consumers can exhaust retries, encounter poison messages, or require manual remediation.

## Inputs
Failure categories, original event, retry history, privacy rules, remediation ownership.

## Context to inspect
DLQ configuration, retention, access controls, replay tooling, alerts, and runbooks.

## Core knowledge
A dead-letter queue is not a garbage bin. It is an operational workflow requiring context, ownership, retention, observability, and controlled replay.

## Procedure
1. Define which failures enter dead-letter handling.
2. Preserve original payload and immutable identity.
3. Attach failure reason, consumer version, timestamps, and attempt history.
4. Protect sensitive payloads with appropriate access and retention.
5. Alert based on business impact and rate.
6. Provide inspection and classification tooling.
7. Fix root cause before replay when necessary.
8. Replay with idempotency, throttling, and audit trail.
9. Confirm successful drain and close incident evidence.

## Decision points
Quarantine malformed/security-sensitive messages instead of blind replay. Use delayed retry queues for recoverable long outages; DLQ for messages needing intervention or code/data correction.

## Common failure patterns
No owner, silent accumulation, infinite DLQ-to-source loops, payload mutation, mass replay without throttling, and exposing sensitive data in failure metadata.

## Verification
Inject poison and permanent failures; confirm routing, alerting, inspection, safe replay, and audit records.

## Expected output
An operationally owned dead-letter workflow with runbooks and replay controls.

## Stop conditions
Stop before replay when root cause is unknown, downstream safety is uncertain, or authorization is insufficient.