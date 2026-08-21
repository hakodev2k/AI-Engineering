# Poison Message Triage

## Purpose
Classify repeatedly failing queue messages without creating infinite retries or hiding deterministic defects.

## When to use
Use after a message has failed processing more than once, has entered a DLQ, or shows repeated consumer crashes.

## Inputs
- Redacted message envelope and payload shape.
- Delivery attempt count and timestamps.
- Last error and relevant consumer logs.
- Consumer code/config and message schema version.

## Preconditions
Read-only access to queue metadata/logs is sufficient. Do not require production mutation permissions.

## Allowed tools
Repository search, logs, schema validators, test runners, and `scripts/analyze_message.py`.

## Constraints
Never replay, delete, purge, requeue, or edit production messages during triage. Never expose secrets from payloads.

## Procedure
1. Capture message ID, correlation ID, schema version, created time, attempt count, routing key/topic, and last error.
2. Redact secrets before storing evidence.
3. Run `python scripts/analyze_message.py <message.json> --out analysis.json`.
4. Trace the consumer entry point and identify deserialization, validation, dependency calls, persistence, and acknowledgement behavior.
5. Compare the failing message with a known-good message from the same schema version.
6. Classify the failure as transient, poison, schema, business-rule, dependency, or unknown.
7. For transient failures, verify the retry is bounded and delayed; do not exceed policy limits.
8. For deterministic failures, create a minimal reproduction test before proposing code changes.
9. Identify whether the correct fix is producer, schema, consumer, dependency, or data remediation.
10. Record evidence and unresolved uncertainty separately.

## Expected output
A schema-compatible analysis containing classification, evidence, risk, recommended action, and verification status.

## Verification
The classification must be supported by reproducible evidence: test output, schema validation, logs, or a deterministic comparison.

## Failure handling
If logs are incomplete, mark `needs-review`. If permission is missing, stop; do not request broader runtime permissions automatically.

## Stop conditions
Stop when classification cannot improve without missing evidence, or when the next action would mutate a production queue/message.
